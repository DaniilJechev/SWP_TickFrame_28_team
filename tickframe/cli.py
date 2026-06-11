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
    data = get_demo_scan(args.symbol, args.interval, args.limit)
    print("Scan result summary")
    print("====================")
    for item in data:
        print(f"{item['timestamp']} {item['symbol']} {item['pattern']} ({item['confidence']:.2f})")
    if args.output:
        with open(args.output, "w", encoding="utf-8") as output_file:
            json.dump({"scan": data}, output_file, indent=2)
        print(f"\nSaved scan JSON to {args.output}")
    return 0


def run_report(args):
    report_data = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "symbol": args.symbol,
        "interval": args.interval,
        "records": get_demo_scan(args.symbol, args.interval, 3),
    }
    report_text = [
        f"# TickFrame MVP v0 report\n",
        f"Generated at: {report_data['generated_at']}\n",
        f"Symbol: {report_data['symbol']}\n",
        f"Interval: {report_data['interval']}\n",
        "\n## Detected patterns\n",
    ]
    for record in report_data["records"]:
        report_text.append(
            f"- {record['timestamp']}: {record['pattern']} ({record['confidence']:.2f})\n"
        )
    with open(args.output, "w", encoding="utf-8") as output_file:
        output_file.write("".join(report_text))
    print(f"Report written to {args.output}")
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="TickFrame MVP v0 CLI - sample chart scan and report generation"
    )
    subparsers = parser.add_subparsers(dest="command")

    scan_parser = subparsers.add_parser("scan", help="Run a sample chart scan")
    scan_parser.add_argument("--symbol", default="BTCUSDT", help="Cryptocurrency symbol")
    scan_parser.add_argument("--interval", default="1h", help="Candle interval")
    scan_parser.add_argument("--limit", type=int, default=3, help="Number of sample records")
    scan_parser.add_argument("--output", help="Optional JSON output file")

    report_parser = subparsers.add_parser("report", help="Generate a sample report")
    report_parser.add_argument("--symbol", default="BTCUSDT", help="Cryptocurrency symbol")
    report_parser.add_argument("--interval", default="1h", help="Candle interval")
    report_parser.add_argument("--output", default="reports/week2/mvp0-report.md", help="Report output file")

    args = parser.parse_args()
    if args.command == "scan":
        return run_scan(args)
    if args.command == "report":
        return run_report(args)

    parser.print_help()
    return 1
