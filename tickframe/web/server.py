import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

from ..data.cache import CandleCache
from ..detection import mock as mock_detection


class Handler(SimpleHTTPRequestHandler):
    cache = None

    def do_GET(self):
        if self.path == "/api/candles":
            self._send_json(self.cache.candles)
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/analyze":
            candles = self.cache.last(50)
            result = mock_detection.analyze(candles)
            self._send_json(result)
        else:
            self.send_response(404)
            self.end_headers()

    def _send_json(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def log_message(self, fmt, *args):
        pass


def run_server(host="0.0.0.0", port=5000, symbol="BTCUSDT"):
    cache = CandleCache(symbol=symbol, interval="5m", max_candles=201)
    cache.start()

    static_dir = os.path.join(os.path.dirname(__file__), "static")
    os.chdir(static_dir)

    Handler.cache = cache
    server = HTTPServer((host, port), Handler)
    print(f"TickFrame dashboard → http://localhost:{port}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        cache.stop()
        server.server_close()
