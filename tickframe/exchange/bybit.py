from datetime import datetime

import requests

BASE_URL = "https://api.bybit.com"

INTERVAL_MAP = {
    "1m": "1",
    "3m": "3",
    "5m": "5",
    "15m": "15",
    "30m": "30",
    "1h": "60",
    "2h": "120",
    "4h": "240",
    "6h": "360",
    "12h": "720",
    "1d": "D",
    "1w": "W",
    "1M": "M",
}


def fetch_klines(
    symbol: str = "BTCUSDT",
    interval: str = "1h",
    limit: int = 10,
    category: str = "spot",
) -> list[dict]:
    bybit_interval = INTERVAL_MAP.get(interval)
    if bybit_interval is None:
        raise ValueError(f"Unsupported interval: {interval}. Use one of: {', '.join(INTERVAL_MAP)}")

    url = (
        f"{BASE_URL}/v5/market/kline"
        f"?category={category}"
        f"&symbol={symbol}"
        f"&interval={bybit_interval}"
        f"&limit={limit}"
    )

    resp = requests.get(url, timeout=15, proxies={"http": None, "https": None})
    resp.raise_for_status()
    data = resp.json()

    if data.get("retCode") != 0:
        raise RuntimeError(f"Bybit API error ({data.get('retCode')}): {data.get('retMsg', 'unknown')}")

    items = []
    for row in data["result"]["list"]:
        ts = int(row[0]) // 1000
        items.append({
            "timestamp": f"{datetime.utcfromtimestamp(ts).isoformat()}Z",
            "symbol": symbol,
            "interval": interval,
            "open": float(row[1]),
            "high": float(row[2]),
            "low": float(row[3]),
            "close": float(row[4]),
            "volume": float(row[5]),
            "turnover": float(row[6]),
        })

    items.reverse()
    return items
