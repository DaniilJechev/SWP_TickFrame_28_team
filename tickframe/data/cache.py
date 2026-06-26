import threading

from ..exchange.bybit import fetch_klines


class CandleCache:
    def __init__(self, symbol="BTCUSDT", interval="5m", max_candles=201):
        self.symbol = symbol
        self.interval = interval
        self.max_candles = max_candles
        self._candles = []
        self._lock = threading.Lock()
        self._stopped = threading.Event()
        self._load_initial()

    def _load_initial(self):
        self._candles = fetch_klines(self.symbol, self.interval, self.max_candles)

    def start(self):
        self._stopped.clear()
        self._thread = threading.Thread(target=self._update_loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._stopped.set()

    def _update_loop(self):
        while not self._stopped.wait(60):
            try:
                latest = fetch_klines(self.symbol, self.interval, 2)
                with self._lock:
                    if self._candles and self._candles[-1]["timestamp"] == latest[-1]["timestamp"]:
                        self._candles[-1] = latest[-1]
                    else:
                        self._candles.append(latest[-1])
                        if len(self._candles) > self.max_candles:
                            self._candles = self._candles[-self.max_candles:]
            except Exception:
                pass

    @property
    def candles(self):
        with self._lock:
            return self._candles.copy()

    def last(self, count):
        with self._lock:
            return self._candles[-count:].copy()
