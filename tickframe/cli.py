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
    serve.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    serve.add_argument("--port", type=int, default=5000, help="Port to listen on")
    serve.add_argument("--symbol", default="BTCUSDT", help="Cryptocurrency symbol")

    args = parser.parse_args()
    if args.command == "scan":
        return run_scan(args)
    if args.command == "report":
        return run_report(args)
    if args.command == "analyze":
        return run_analyze(args)
    if args.command == "serve":
        return run_serve(args)

    parser.print_help()
    return 1
