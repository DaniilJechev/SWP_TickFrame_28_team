import argparse
import json
from datetime import datetime

SAMPLE_PATTERNS = [
    {"pattern": "Head and Shoulders", "confidence": 0.64},
    {"pattern": "Double Bottom", "confidence": 0.58},
    {"pattern": "Bull Flag", "confidence": 0.71},
]


def get_demo_scan(symbol: str, interval: str, limit: int):
    now = datetime.utcnow()
    items = []
    for i in range(limit):
        items.append(
            {
                "symbol": symbol,
                "interval": interval,
                "timestamp": (now.isoformat() + "Z"),
                "pattern": SAMPLE_PATTERNS[i % len(SAMPLE_PATTERNS)]["pattern"],
                "confidence": SAMPLE_PATTERNS[i % len(SAMPLE_PATTERNS)]["confidence"],
            }
        )
    return items


def run_scan(args):
    from .exchange.bybit import fetch_klines

    if args.mock:
        data = get_demo_scan(args.symbol, args.interval, args.limit)
        print("Mock scan result summary")
        print("========================")
        for item in data:
            print(f"{item['timestamp']} {item['symbol']} {item['pattern']} ({item['confidence']:.2f})")
    else:
        data = fetch_klines(args.symbol, args.interval, args.limit, args.category)
        print(f"Bybit scan result — {args.symbol} ({args.interval}, {args.category})")
        print("=" * 60)
        print(f"{'Timestamp':<26} {'Open':>10} {'High':>10} {'Low':>10} {'Close':>10} {'Volume':>10}")
        print("-" * 76)
        for c in data:
            print(
                f"{c['timestamp']:<26} {c['open']:>10.2f} {c['high']:>10.2f} "
                f"{c['low']:>10.2f} {c['close']:>10.2f} {c['volume']:>10.4f}"
            )

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump({"scan": data}, f, indent=2)
        print(f"\nSaved scan to {args.output}")
    return 0


def run_report(args):
    from .exchange.bybit import fetch_klines

    if args.mock:
        records = get_demo_scan(args.symbol, args.interval, 3)
        body = "\n## Detected patterns\n\n"
        for r in records:
            body += f"- {r['timestamp']}: {r['pattern']} ({r['confidence']:.2f})\n"
    else:
        records = fetch_klines(args.symbol, args.interval, args.limit, args.category)
        body = "\n## Candles\n\n| Timestamp | Open | High | Low | Close | Volume |\n"
        body += "|-----------|------|------|-----|-------|--------|\n"
        for c in records:
            body += f"| {c['timestamp']} | {c['open']:.2f} | {c['high']:.2f} | {c['low']:.2f} | {c['close']:.2f} | {c['volume']:.4f} |\n"

    report = (
        f"# TickFrame scan report\n\n"
        f"**Generated:** {datetime.utcnow().isoformat()}Z  \n"
        f"**Symbol:** {args.symbol}  \n"
        f"**Interval:** {args.interval}  \n"
        f"**Exchange:** Bybit  \n"
        f"{body}\n"
    )

    with open(args.output, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"Report written to {args.output}")
    return 0


def run_analyze(args):
    from .data.cache import CandleCache
    from .detection import mock as mock_detection

    cache = CandleCache(symbol=args.symbol, interval=args.interval, max_candles=args.limit)
    candles = cache.candles
    result = mock_detection.analyze(candles)

    print(f"Analysis result — {args.symbol} ({args.interval})")
    print("=" * 40)
    print(f"  Pattern:          {result['pattern']}")
    print(f"  Confidence:       {result['confidence']:.0%}")
    print(f"  Candles analyzed: {result['analyzed_candles']}")
    print(f"  Window start:     {result['start_time']}")
    print(f"  Window end:       {result['end_time']}")

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
        print(f"\nSaved analysis to {args.output}")
    return 0


def run_serve(args):
    import uvicorn

    uvicorn.run("tickframe.backend.main:app", host=args.host, port=args.port, reload=True)
    return 0


# ---------------------------------------------------------------------------
# DB Toolkit CLI commands
# ---------------------------------------------------------------------------

def run_db_candle_range(args):
    import asyncio
    from .backend.services.db_toolkit import get_db, get_candle_range, count_candles

    async def _run():
        db = await get_db(use_sqlite=args.sqlite)
        try:
            rng = await get_candle_range(db, args.symbol, args.interval)
            cnt = await count_candles(db, args.symbol, args.interval)
            if rng:
                print(f"Candle range for {args.symbol} / {args.interval}:")
                print(f"  Earliest: {rng[0]}  ({datetime.utcfromtimestamp(rng[0]).isoformat()}Z)")
                print(f"  Latest:   {rng[1]}  ({datetime.utcfromtimestamp(rng[1]).isoformat()}Z)")
                print(f"  Count:    {cnt}")
            else:
                print(f"No candles found for {args.symbol} / {args.interval}")
        finally:
            await db.close()

    return asyncio.run(_run())


def run_db_export(args):
    import asyncio
    from .backend.services.db_toolkit import get_db, export_candles

    async def _run():
        db = await get_db(use_sqlite=args.sqlite)
        try:
            count = await export_candles(db, args.symbol, args.interval, args.out, fmt=args.format)
            print(f"Exported {count} candles to {args.out}")
        finally:
            await db.close()

    return asyncio.run(_run())


def run_db_import(args):
    import asyncio
    from .backend.services.db_toolkit import get_db, import_candles

    async def _run():
        db = await get_db(use_sqlite=args.sqlite)
        try:
            result = await import_candles(db, args.symbol, args.interval, args.infile, fmt=args.format)
            print(f"Import complete: {result['rows_read']} rows read, {result['rows_upserted']} upserted")
        finally:
            await db.close()

    return asyncio.run(_run())


def run_db_patterns(args):
    import asyncio
    from .backend.services.db_toolkit import get_db, get_patterns, list_all_scanned_symbols

    async def _run():
        db = await get_db(use_sqlite=args.sqlite)
        try:
            if args.symbol == "*":
                symbols = await list_all_scanned_symbols(db)
                if not symbols:
                    print("No scanned symbols found.")
                    return 0
                for sym in symbols:
                    scan = await get_patterns(db, sym, pretty=args.pretty)
                    if scan:
                        print(f"\n=== {sym} ===")
                        _print_patterns(scan, args.pretty)
                return 0
            scan = await get_patterns(db, args.symbol, pretty=args.pretty)
            if scan:
                _print_patterns(scan, args.pretty)
            else:
                print(f"No ML scan results for {args.symbol}")
        finally:
            await db.close()

    return asyncio.run(_run())


def _print_patterns(scan: dict, pretty: bool) -> None:
    print(f"Interval:      {scan.get('interval', '?')}")
    print(f"Last scanned:  {scan.get('last_scanned_time', 0)}")
    print(f"Updated:       {scan.get('updated', '?')}")
    patterns = scan.get("patterns", [])
    if not patterns:
        print("Patterns:      (none)")
        return
    print(f"Patterns ({len(patterns)}):")
    for p in patterns:
        ts = p.get("timestamp", "?")
        label = p.get("datetime", ts) if pretty else ts
        print(f"  - {p.get('pattern_type', '?')}  confidence={p.get('confidence', 0):.3f}  timestamp={label}")


def run_db_query(args):
    import asyncio
    from .backend.services.db_toolkit import get_db, run_readonly_query

    async def _run():
        db = await get_db(use_sqlite=args.sqlite)
        try:
            results = await run_readonly_query(db, args.sql)
            if not results:
                print("(no rows)")
                return 0
            headers = list(results[0].keys())
            col_widths = {h: len(h) for h in headers}
            for row in results:
                for h in headers:
                    val = str(row.get(h, ""))
                    col_widths[h] = max(col_widths[h], len(val))
            sep = "+".join("-" * (col_widths[h] + 2) for h in headers)
            header_row = "| " + " | ".join(h.ljust(col_widths[h]) for h in headers) + " |"
            print(sep)
            print(header_row)
            print(sep)
            for row in results:
                vals = " | ".join(str(row.get(h, "")).ljust(col_widths[h]) for h in headers)
                print(f"| {vals} |")
            print(sep)
            print(f"({len(results)} rows)")
        finally:
            await db.close()

    return asyncio.run(_run())


def main():
    parser = argparse.ArgumentParser(
        description="TickFrame CLI — scan cryptocurrency charts using Bybit data"
    )
    subparsers = parser.add_subparsers(dest="command")

    scan = subparsers.add_parser("scan", help="Run a chart scan using Bybit data")
    scan.add_argument("--symbol", default="BTCUSDT", help="Cryptocurrency symbol")
    scan.add_argument("--interval", default="1h", help="Candle interval (1m, 5m, 15m, 1h, 4h, 1d, ...)")
    scan.add_argument("--limit", type=int, default=10, help="Number of candles to fetch")
    scan.add_argument("--category", default="spot", choices=["spot", "linear"], help="Market category")
    scan.add_argument("--output", help="Optional JSON output file")
    scan.add_argument("--mock", action="store_true", help="Use mock demo data instead of Bybit")

    report = subparsers.add_parser("report", help="Generate a Markdown report")
    report.add_argument("--symbol", default="BTCUSDT", help="Cryptocurrency symbol")
    report.add_argument("--interval", default="1h", help="Candle interval")
    report.add_argument("--limit", type=int, default=10, help="Number of candles")
    report.add_argument("--category", default="spot", choices=["spot", "linear"], help="Market category")
    report.add_argument("--output", default="reports/scan-report.md", help="Output Markdown file")
    report.add_argument("--mock", action="store_true", help="Use mock demo data instead of Bybit")

    analyze_parser = subparsers.add_parser("analyze", help="Run pattern analysis on cached candles")
    analyze_parser.add_argument("--symbol", default="BTCUSDT", help="Cryptocurrency symbol")
    analyze_parser.add_argument("--interval", default="5m", help="Candle interval")
    analyze_parser.add_argument("--limit", type=int, default=200, help="Number of candles to cache")
    analyze_parser.add_argument("--output", help="Optional JSON output file")

    serve = subparsers.add_parser("serve", help="Start the web dashboard")
    serve.add_argument("--host", default="0.0.0.0", help="Host to bind to")  # nosec — Docker container needs 0.0.0.0
    serve.add_argument("--port", type=int, default=5000, help="Port to listen on")
    serve.add_argument("--symbol", default="BTCUSDT", help="Cryptocurrency symbol")

    # --- db subcommand ---
    db_parser = subparsers.add_parser("db", help="Database toolkit commands")
    db_sub = db_parser.add_subparsers(dest="db_command")

    db_candle_range = db_sub.add_parser("candle-range", help="Print candle time range and count")
    db_candle_range.add_argument("symbol", help="Symbol (e.g. BTCUSDT)")
    db_candle_range.add_argument("interval", help="Interval (e.g. 5m)")
    db_candle_range.add_argument("--sqlite", action="store_true", help="Use SQLite fallback instead of PostgreSQL")

    db_export = db_sub.add_parser("export-candles", help="Export candles to file")
    db_export.add_argument("symbol", help="Symbol (e.g. BTCUSDT)")
    db_export.add_argument("interval", help="Interval (e.g. 5m)")
    db_export.add_argument("--out", required=True, help="Output file path")
    db_export.add_argument("--format", choices=["csv", "json"], default="csv", help="Output format")

    db_import = db_sub.add_parser("import-candles", help="Import candles from file")
    db_import.add_argument("symbol", help="Symbol (e.g. BTCUSDT)")
    db_import.add_argument("interval", help="Interval (e.g. 5m)")
    db_import.add_argument("--infile", required=True, help="Input file path")
    db_import.add_argument("--format", choices=["csv", "json"], default="csv", help="Input format")

    db_patterns = db_sub.add_parser("patterns", help="Show ML scan patterns for a symbol")
    db_patterns.add_argument("symbol", help="Symbol (e.g. BTCUSDT) or * for all")
    db_patterns.add_argument("--pretty", action="store_true", help="Pretty-print with human-readable timestamps")
    db_patterns.add_argument("--sqlite", action="store_true", help="Use SQLite fallback instead of PostgreSQL")

    db_query = db_sub.add_parser("query", help="Run a read-only SQL query")
    db_query.add_argument("sql", help="SELECT SQL statement")
    db_query.add_argument("--sqlite", action="store_true", help="Use SQLite fallback instead of PostgreSQL")

    args = parser.parse_args()
    if args.command == "scan":
        return run_scan(args)
    if args.command == "report":
        return run_report(args)
    if args.command == "analyze":
        return run_analyze(args)
    if args.command == "serve":
        return run_serve(args)
    if args.command == "db":
        if args.db_command == "candle-range":
            return run_db_candle_range(args)
        if args.db_command == "export-candles":
            return run_db_export(args)
        if args.db_command == "import-candles":
            return run_db_import(args)
        if args.db_command == "patterns":
            return run_db_patterns(args)
        if args.db_command == "query":
            return run_db_query(args)
        db_parser.print_help()
        return 1

    parser.print_help()
    return 1
