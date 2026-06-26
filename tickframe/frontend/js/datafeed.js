const RESOLUTION_MAP = {
  '1': '1m', '3': '3m', '5': '5m', '15': '15m', '30': '30m',
  '60': '1h', '120': '2h', '240': '4h',
  '1D': '1d', 'D': '1d',
  '1W': '1w', 'W': '1w',
  '1M': '1M', 'M': '1M',
};
const SUPPORTED_RESOLUTIONS = ['1', '3', '5', '15', '30', '60', '120', '240', '1D', '1W', '1M'];

class TickFrameDatafeed {
  constructor(symbol, interval) {
    this.symbol = symbol;
    this.interval = interval;
    this._barsCache = [];
    this._subscriptions = [];
    this._ws = null;
    this._wsId = 0;
  }

  onReady(callback) {
    setTimeout(() => callback({
      supported_resolutions: SUPPORTED_RESOLUTIONS,
      supports_group_request: false,
      supports_marks: true,
      supports_timescale_marks: true,
      supports_time: true,
    }), 0);
  }

  resolveSymbol(symbolName, onResolve, onError) {
    onResolve({
      name: this.symbol,
      ticker: this.symbol,
      description: this.symbol,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_daily: true,
      has_weekly_and_monthly: true,
      supported_resolutions: SUPPORTED_RESOLUTIONS,
      volume_precision: 2,
      data_status: 'streaming',
    });
  }

  searchSymbols(searchString, exchange, symbolType, onResult) {
    onResult([]);
  }

  getServerTime(callback) {
    callback(Math.floor(Date.now() / 1000));
  }

  async getBars(symbolInfo, resolution, periodParams, onResult, onError) {
    const { countBack } = periodParams;
    const limit = Math.min(countBack || 5000, 50000);
    const interval = RESOLUTION_MAP[resolution] || this.interval;
    try {
      const resp = await fetch(`/api/coins/${this.symbol}/candles?interval=${interval}&limit=${limit}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const payload = await resp.json();
      const raw = Array.isArray(payload) ? payload : (payload.candles || []);
      const bars = raw.map(c => ({
        time: c.time * 1000,
        open: +c.open,
        high: +c.high,
        low: +c.low,
        close: +c.close,
        volume: +c.volume,
      }));
      this._barsCache = bars;
      onResult({ bars, meta: { noData: !bars.length } });
      if (window._hideChartLoading) window._hideChartLoading();
    } catch (err) {
      onError(err);
      if (window._hideChartLoading) window._hideChartLoading();
    }
  }

  subscribeBars(symbolInfo, resolution, onRealtimeTick, subscriberUID, onResetCacheNeededCallback) {
    this._subscriptions.push({ subscriberUID, onRealtimeTick });
    this._startWs();
  }

  unsubscribeBars(subscriberUID) {
    this._subscriptions = this._subscriptions.filter(s => s.subscriberUID !== subscriberUID);
    if (!this._subscriptions.length) this._stopWs();
  }

  reconnectWs() {
    this._stopWs();
    this._startWs();
  }

  _startWs() {
    if (this._ws) return;
    const wsId = ++this._wsId;
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    this._ws = new WebSocket(`${proto}://${location.host}/ws/candles/${this.symbol}?interval=${this.interval}`);
    this._ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'update' && msg.candle) {
          const bar = {
            time: msg.candle.time * 1000,
            open: +msg.candle.open,
            high: +msg.candle.high,
            low: +msg.candle.low,
            close: +msg.candle.close,
            volume: +msg.candle.volume,
          };
          this._subscriptions.forEach(s => s.onRealtimeTick(bar));
        } else if (msg.type === 'snapshot' && msg.candles) {
          const last = msg.candles[msg.candles.length - 1];
          if (last) {
            const bar = {
              time: last.time * 1000,
              open: +last.open,
              high: +last.high,
              low: +last.low,
              close: +last.close,
              volume: +last.volume,
            };
            this._subscriptions.forEach(s => s.onRealtimeTick(bar));
          }
        }
      } catch (e) { console.error('datafeed ws', e); }
    };
    this._ws.onclose = () => {
      if (this._wsId !== wsId) return;
      this._ws = null;
      setTimeout(() => this._startWs(), 3000);
    };
  }

  _stopWs() {
    if (this._ws) { this._ws.close(); this._ws = null; }
  }
}

window.TickFrameDatafeed = TickFrameDatafeed;
