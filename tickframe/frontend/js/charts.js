let chart = null;
let candleSeries = null;
let currentSymbol = 'BTCUSDT';
let currentInterval = '5m';
let lastCandles = [];
let isDarkTheme = true;
let patternShapes = [];
let patternMarkers = [];
let patternDrawings = [];
let chartInitMode = null;
let _loadMoreTimer = null;
let _currentAbort = null;
let _currentLoadSymbol = '';
var _loadGen = 0;
const _MAX_CANDLES = 55000;
const _FUTURE_CANDLES = 500;
var _candleCache = {};
var _wsSymbol = '';
var _wsInterval = '';

let volumeSeries = null;
let volumeSmaSeries = null;

// Indicator pane height ratios (adjust these to resize sub-charts)
// Layout: Main (top) → Volume (bottom)
var INDICATOR_TOP_MAIN = 0;
var INDICATOR_BOTTOM_MAIN = 0.22;
var INDICATOR_TOP_VOLUME = 0.78;
var INDICATOR_BOTTOM_VOLUME = 0;


function _formatChartPrice(price) {
  if (price == null || isNaN(price)) return '--';
  var abs = Math.abs(price);
  var dec;
  if (abs >= 1000) dec = 2;
  else if (abs >= 100) dec = 3;
  else if (abs >= 10) dec = 4;
  else if (abs >= 1) dec = 5;
  else if (abs >= 0.01) dec = 6;
  else dec = 8;
  return price.toFixed(dec).replace(/\.?0+$/, '');
}

function _updatePriceFormat(lastPrice) {
  if (!candleSeries) return;
  var abs = Math.abs(lastPrice);
  var precision, minMove;
  if (abs >= 1000) { precision = 2; minMove = 0.01; }
  else if (abs >= 100) { precision = 3; minMove = 0.001; }
  else if (abs >= 10) { precision = 4; minMove = 0.0001; }
  else if (abs >= 1) { precision = 5; minMove = 0.00001; }
  else if (abs >= 0.01) { precision = 6; minMove = 0.000001; }
  else { precision = 8; minMove = 0.00000001; }
  candleSeries.applyOptions({
    priceFormat: { type: 'price', precision: precision, minMove: minMove },
  });
}

function _intervalToSeconds(interval) {
  var match = interval.match(/^(\d+)([smhd])$/);
  if (!match) return 300;
  var num = parseInt(match[1]);
  var unit = match[2];
  switch (unit) {
    case 's': return num;
    case 'm': return num * 60;
    case 'h': return num * 3600;
    case 'd': return num * 86400;
    default: return 300;
  }
}

function _maxFutureTime() {
  if (!lastCandles.length) return 0;
  return lastCandles[lastCandles.length - 1].time + _FUTURE_CANDLES * _intervalToSeconds(currentInterval);
}

function calculateSMA(data, period) {
  var result = [];
  for (var i = period - 1; i < data.length; i++) {
    var sum = 0;
    for (var j = i - period + 1; j <= i; j++) {
      sum += data[j].value;
    }
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}



function showLoading(show) {
  var el = document.getElementById('chartLoading');
  if (el) el.classList.toggle('visible', show);
}

function isChartingLibAvailable() {
  return typeof TradingView !== 'undefined';
}

function createChart() {
  const container = document.getElementById('chart');
  container.innerHTML = '';

  if (isChartingLibAvailable()) {
    chartInitMode = 'advanced';
    createAdvancedChart(container);
  } else {
    chartInitMode = 'lightweight';
    createLightweightChart(container);
  }

}

function createAdvancedChart(container) {
  const datafeed = new TickFrameDatafeed(currentSymbol, currentInterval);
  window._datafeed = datafeed;

  const widgetOptions = {
    symbol: currentSymbol,
    interval: currentInterval,
    container: container,
    datafeed: datafeed,
    library_path: '/lib/charting_library/',
    theme: 'Dark',
    time_frames: [
      { text: '1y', resolution: '1d', description: '1 Year' },
      { text: '6m', resolution: '4h', description: '6 Months' },
      { text: '3m', resolution: '1h', description: '3 Months' },
      { text: '1m', resolution: '15m', description: '1 Month' },
      { text: '7d', resolution: '5m', description: '7 Days' },
      { text: '3d', resolution: '5m', description: '3 Days' },
      { text: '1d', resolution: '5m', description: '1 Day' },
    ],
    fullscreen: false,
    autosize: true,
    overrides: {
      'paneProperties.background': '#000000',
      'paneProperties.vertGridProperties.color': '#1f2937',
      'paneProperties.horzGridProperties.color': '#1f2937',
      'scalesProperties.textColor': '#d1d4dc',
    },
    disabled_features: [
      'header_widget',
      'header_symbol_search',
      'header_compare',
      'header_chart_type',
      'header_settings',
      'header_indicators',
      'timeframes_toolbar',
    ],
    enabled_features: [
      'show_drawing_toolbar',
    ],
    custom_css_url: '/css/tradingview-custom.css',
  };

  const tvWidget = new TradingView.widget(widgetOptions);
  tvWidget.onChartReady(() => {
    chart = tvWidget;
    window.chart = tvWidget;
    applyChartTheme(isDarkTheme);

    tvWidget.chart().dataReady(() => {
      const bars = tvWidget.chart().getVisibleRange();
      if (bars) {
        loadCandles(currentSymbol, currentInterval);
      }
    });
  });
}

function createLightweightChart(container) {
  const rect = container.getBoundingClientRect();
  const lwChart = LightweightCharts.createChart(container, {
    width: Math.max(300, rect.width),
    height: Math.max(200, rect.height),
    layout: { background: { type: 'solid', color: '#000000' }, textColor: '#d1d4dc' },
    grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } },
    rightPriceScale: { borderColor: '#2a2e39' },
    timeScale: { visible: true, timeVisible: true, secondsVisible: false, borderColor: '#2a2e39' },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
    localization: { priceFormatter: _formatChartPrice },
  });

  const SeriesType = window.LightweightCharts.CandlestickSeries || 'Candlestick';
  candleSeries = lwChart.addSeries(SeriesType, {
    upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
    wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    priceFormat: { type: 'price', precision: 6, minMove: 0.000001 },
  });

  var _HS = window.LightweightCharts.HistogramSeries;
  var _LS = window.LightweightCharts.LineSeries;

  volumeSeries = lwChart.addSeries(_HS, {
    priceScaleId: 'volume',
    priceFormat: { type: 'volume' },
    lastValueVisible: false,
    priceLineVisible: false,
  });

  volumeSmaSeries = lwChart.addSeries(_LS, {
    priceScaleId: 'volume',
    color: '#FF9800',
    lineWidth: 2,
    lastValueVisible: false,
    priceLineVisible: false,
  });

  window.chart = lwChart;
  window.candleSeries = candleSeries;
  chart = lwChart;
  applyChartTheme(true);

  chart.priceScale('volume').applyOptions({
    scaleMargins: { top: INDICATOR_TOP_VOLUME, bottom: INDICATOR_BOTTOM_VOLUME },
  });

  chart.priceScale('right').applyOptions({
    scaleMargins: { top: INDICATOR_TOP_MAIN, bottom: INDICATOR_BOTTOM_MAIN },
  });

  window.addEventListener('resize', () => {
    const r = container.getBoundingClientRect();
    lwChart.resize(Math.max(300, r.width), Math.max(200, r.height));
  });

  chart.timeScale().subscribeVisibleTimeRangeChange(onVisibleRangeChanged);

  if (window.TFDraw && candleSeries) {
    window.TFDraw.init(lwChart, candleSeries, container);
    window.TFDraw.setSymbol(currentSymbol);
  }

  loadCandles(currentSymbol, currentInterval);
  startCandleWs(currentSymbol, currentInterval);
}

// Restore saved sidebar width
(function() {
  try {
    var w = localStorage.getItem('tickframe_sidebar_width');
    if (w) {
      var s = document.querySelector('.sidebar');
      if (s) s.style.width = Math.max(150, Math.min(400, +w)) + 'px';
    }
  } catch (_) {}
})();

function onVisibleRangeChanged(range) {
  if (!range || !lastCandles.length) return;
  if (range.from < lastCandles[0].time) {
    if (_loadMoreTimer) clearTimeout(_loadMoreTimer);
    _loadMoreTimer = setTimeout(function () {
      loadMoreBefore(currentSymbol, currentInterval, lastCandles[0].time);
    }, 400);
  }
  var maxTo = _maxFutureTime();
  if (range.to > maxTo) {
    chart.timeScale().setVisibleRange({
      from: range.from,
      to: maxTo,
    });
  }
}

async function loadMoreBefore(symbol, interval, before) {
  try {
    var resp = await fetch('/api/coins/' + symbol + '/candles?interval=' + interval + '&limit=5000&before=' + before);
    if (!resp.ok) return;
    var payload = await resp.json();
    var data = Array.isArray(payload) ? payload : (payload.candles || []);
    if (!data.length) return;

    var newCandles = data.map(function (c) {
      return {
        time: c.time || c.t || Math.floor(new Date(c[0] || c.ts || Date.now()).getTime() / 1000),
        open: +c.open, high: +c.high, low: +c.low, close: +c.close, volume: +c.volume,
      };
    });

    var merged = newCandles.concat(lastCandles);
    var seen = {};
    var deduped = [];
    for (var i = 0; i < merged.length; i++) {
      var t = merged[i].time;
      if (!seen[t]) {
        seen[t] = true;
        deduped.push(merged[i]);
      }
    }
    if (deduped.length > _MAX_CANDLES) {
      deduped = deduped.slice(deduped.length - _MAX_CANDLES);
    }

    lastCandles = deduped;
    _candleCache[symbol + '|' + interval] = deduped;
    var series = window.candleSeries;
    if (series) series.setData(deduped);
    updateIndicators(lastCandles);


  } catch (err) {
    console.error('loadMoreBefore error', err);
  }
}

function applyChartTheme(darkMode) {
  isDarkTheme = darkMode;
  if (!chart) return;

  if (chartInitMode === 'advanced') {
    chart.changeTheme(darkMode ? 'Dark' : 'Light');
    return;
  }

  const theme = darkMode ? {
    layout: { background: { type: 'solid', color: '#000000' }, textColor: '#d1d4dc' },
    grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } },
    rightPriceScale: { borderColor: '#2a2e39' },
    timeScale: { borderColor: '#2a2e39', timeVisible: true, secondsVisible: false },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
    localization: { priceFormatter: _formatChartPrice },
  } : {
    layout: { background: { type: 'solid', color: '#f5f7fb' }, textColor: '#111827' },
    grid: { vertLines: { color: '#e5e7eb' }, horzLines: { color: '#e5e7eb' } },
    rightPriceScale: { borderColor: '#d1d5db' },
    timeScale: { borderColor: '#d1d5db', timeVisible: true, secondsVisible: false },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
    localization: { priceFormatter: _formatChartPrice },
  };

  chart.applyOptions(theme);
}

function resetChartScale() {
  if (!chart || chartInitMode === 'advanced') return;
  chart.timeScale().fitContent();
  var ps = chart.priceScale('right');
  ps.applyOptions({ autoScale: false });
  ps.applyOptions({ autoScale: true });
}

async function loadCandles(symbol, interval) {
  if (_currentLoadSymbol === symbol && currentInterval === interval) {
    resetChartScale();
    return;
  }

  var cacheKey = symbol + '|' + interval;
  var cached = _candleCache[cacheKey];

  if (chartInitMode === 'advanced') {
    currentSymbol = symbol;
    window.currentSymbol = symbol;
    currentInterval = interval;
    _currentLoadSymbol = symbol;
    showLoading(true);
    const datafeed = window._datafeed;
    if (datafeed) {
      datafeed.symbol = symbol;
      datafeed.interval = interval;
      datafeed.reconnectWs();
    }
    if (chart) {
      chart.setSymbol(symbol, interval);
    }
    clearPatternShapes();
    window._hideChartLoading = function () { showLoading(false); window._hideChartLoading = null; };
    setTimeout(function () { if (window._hideChartLoading) { window._hideChartLoading(); } }, 5000);
    return;
  }

  var gen = ++_loadGen;

  _wsSymbol = '';
  _wsInterval = '';

  if (!cached) {
    showLoading(true);
    if (candleSeries) candleSeries.setData([]);
  }

  currentSymbol = symbol;
  window.currentSymbol = symbol;
  currentInterval = interval;
  _currentLoadSymbol = symbol;

  if (window.TFDraw) {
    window.TFDraw.setSymbol(symbol);
  }

  window._hideChartLoading = null;

  chart.timeScale().unsubscribeVisibleTimeRangeChange(onVisibleRangeChanged);

  if (_currentAbort) {
    _currentAbort.abort();
    _currentAbort = null;
  }

  if (cached) {
    lastCandles = cached;
    var series = window.candleSeries;
    if (series) {
      series.setData([]);
      series.setData(lastCandles);
    }
    if (lastCandles.length) _updatePriceFormat(lastCandles[lastCandles.length - 1].close);
    updateIndicators(lastCandles);
    if (typeof window._onCandlesUpdated === 'function') window._onCandlesUpdated(symbol, interval);
    resetChartScale();
    chart.timeScale().subscribeVisibleTimeRangeChange(onVisibleRangeChanged);
    return;
  }

  _currentAbort = new AbortController();
  var signal = _currentAbort.signal;

  try {
    var resp = await fetch('/api/coins/' + symbol + '/candles?interval=' + interval + '&limit=10000', { signal: signal });
    if (signal.aborted) return;
    if (!resp.ok) throw new Error('Failed to load candles');
    var payload = await resp.json();
    if (signal.aborted) return;
    var data = Array.isArray(payload) ? payload : (payload.candles || []);
    var normalized = data.map(function (c) {
      return {
        time: c.time || c.t || Math.floor(new Date(c[0] || c.ts || Date.now()).getTime() / 1000),
        open: +c.open, high: +c.high, low: +c.low, close: +c.close, volume: +c.volume
      };
    });
    lastCandles = normalized;
    _candleCache[cacheKey] = normalized;
    var series = window.candleSeries;
    if (series) series.setData(lastCandles);
    if (lastCandles.length) _updatePriceFormat(lastCandles[lastCandles.length - 1].close);
    updateIndicators(lastCandles);
    if (typeof window._onCandlesUpdated === 'function') window._onCandlesUpdated(symbol, interval);
    resetChartScale();
    chart.timeScale().subscribeVisibleTimeRangeChange(onVisibleRangeChanged);
  } catch (err) {
    if (err.name === 'AbortError') return;
    console.error('loadCandles error', err);
  } finally {
    if (gen === _loadGen) {
      showLoading(false);
    }
    if (_currentAbort && _currentAbort.signal === signal) {
      _currentAbort = null;
    }
  }
}

function startCandleWs(symbol, interval) {
  if (chartInitMode === 'advanced') return;
  _wsSymbol = '';
  _wsInterval = '';
  stopCandleWs();
  _wsSymbol = symbol;
  _wsInterval = interval;
  window._shouldReconnectWs = true;
  try {
    const proto = (location.protocol === 'https:') ? 'wss' : 'ws';
    const url = `${proto}://${location.host}/ws/candles/${symbol}?interval=${interval}`;
    var wsSymbol = symbol;
    var wsInterval = interval;
    window._candleWs = new WebSocket(url);
    window._candleWs.onopen = () => {
      if (_wsSymbol !== wsSymbol || _wsInterval !== wsInterval) return;
      const s = document.getElementById('status');
      if (s) s.innerText = 'ONLINE';
    };
    window._candleWs.onclose = () => {
      if (_wsSymbol !== wsSymbol || _wsInterval !== wsInterval) return;
      const s = document.getElementById('status');
      if (s) s.innerText = 'OFFLINE';
      if (window._shouldReconnectWs) {
        setTimeout(() => startCandleWs(wsSymbol, wsInterval), 2000);
      }
    };
    window._candleWs.onmessage = (ev) => {
      if (_wsSymbol !== wsSymbol || _wsInterval !== wsInterval) return;
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'snapshot' && msg.candles) {
          const newCandles = msg.candles.map(c => ({
            time: c.time, open: +c.open, high: +c.high, low: +c.low, close: +c.close, volume: +c.volume,
          }));
          if (newCandles.length > lastCandles.length) {
            lastCandles = newCandles;
            _candleCache[wsSymbol + '|' + wsInterval] = newCandles;
            var series = window.candleSeries;
            if (series) series.setData(newCandles);
            updateIndicators(lastCandles);
          }
          const s = document.getElementById('status');
          if (s) s.innerText = 'LIVE';
        } else if (msg.type === 'update' && msg.candle) {
          const c = msg.candle;
          if (c && c.time && window.candleSeries) {
            const point = { time: c.time, open: +c.open, high: +c.high, low: +c.low, close: +c.close, volume: +c.volume };
            window.candleSeries.update(point);
            if (lastCandles.length) {
              var last = lastCandles[lastCandles.length - 1];
              if (last.time === point.time) {
                lastCandles[lastCandles.length - 1] = point;
              } else {
                lastCandles.push(point);
              }
              _candleCache[wsSymbol + '|' + wsInterval] = lastCandles;
            }
            updateRealtime(point.time, point.close, point.volume, point.open);
          }
          const s = document.getElementById('status');
          if (s) s.innerText = 'LIVE';
        } else if (msg.type === 'heartbeat') {
          const s = document.getElementById('status');
          if (s) s.innerText = 'LIVE\u00B7' + (msg.timestamp || '');
        }
      } catch (e) { console.error('ws message parse', e); }
    };
  } catch (e) { console.error('startCandleWs', e); }
}

function stopCandleWs() {
  window._shouldReconnectWs = false;
  if (window._candleWs) {
    try { window._candleWs.close(); } catch (e) { }
    window._candleWs = null;
  }
}

function clearPatternDrawings() {
  if (!window.DrawingController?.getManager) return;
  var mgr = window.DrawingController.getManager();
  if (!mgr) return;
  patternDrawings.forEach(function (id) {
    if (!id) return;
    try { mgr.removeDrawing(id); } catch (e) { }
  });
  patternDrawings = [];
}

function clearPatternShapes() {
  patternShapes.forEach(s => {
    try { s.remove(); } catch (e) { }
  });
  patternShapes = [];
  if (typeof candleSeries?.setMarkers === 'function') {
    candleSeries.setMarkers([]);
  }
  patternMarkers = [];
  clearPatternDrawings();
}

function renderPatterns(patterns) {
  clearPatternShapes();
  if (!chart || !patterns || !patterns.length) return;

  if (chartInitMode === 'advanced') {
    renderAdvancedPatterns(patterns);
  } else {
    renderLightweightPatterns(patterns);
  }
}

function renderAdvancedPatterns(patterns) {
  patterns.forEach((p) => {
    const ts = p.timestamp;
    const label = `${p.pattern_type} ${(p.confidence * 100).toFixed(0)}%`;

    const shape = chart.chart().createShape(
      { time: ts },
      {
        shape: 'vertical_line',
        color: '#ff0000',
        width: 1,
        text: label,
        textColor: '#ff0000',
        textFontSize: 12,
        textBold: true,
      }
    );
    if (shape) patternShapes.push(shape);
  });
}

function renderLightweightPatterns(patterns) {
  const markerColor = '#ff0000';
  const newMarkers = [];
  patterns.forEach((p) => {
    const ts = p.timestamp;
    var series = window.candleSeries;
    if (!series) return;
    var data = lastCandles;
    const idx = data.findIndex(c => c.time === ts);
    if (idx === -1) return;

    newMarkers.push({
      time: ts,
      position: 'aboveBar',
      color: markerColor,
      shape: 'arrowDown',
      text: `${p.pattern_type} ${(p.confidence * 100).toFixed(0)}%`,
    });
  });
  patternMarkers = newMarkers;
  var series = window.candleSeries;
  if (series && typeof series.setMarkers === 'function') {
    series.setMarkers(newMarkers);
  }
}

async function analyzePatterns() {
  const btn = document.querySelector('.analyze-btn');
  const resultEl = document.querySelector('.result-text');
  if (!btn || !resultEl) return;

  const origText = btn.innerText;
  btn.innerText = 'ANALYZING...';
  btn.disabled = true;
  resultEl.innerText = 'Loading candles from database...';

  try {
    const limitInput = document.querySelector('.candle-limit-input');
    const totalLimit = limitInput ? parseInt(limitInput.value) || 10000 : 10000;
    const mlResp = await fetch(`/api/analyze/${currentSymbol}?interval=${currentInterval}&limit=${totalLimit}&confidence_threshold=${parseFloat(window._analysisThreshold || '0.80')}`, {
      method: 'POST',
    });
    if (!mlResp.ok) throw new Error('Analysis failed');
    const mlData = await mlResp.json();
    const patterns = mlData.patterns || [];

    if (patterns.length === 0) {
      resultEl.innerText = `No patterns detected above threshold across ${totalLimit} candles.`;
    } else {
      resultEl.innerText = `Found ${patterns.length} pattern(s) across ${totalLimit} candles.`;
      renderDetectedPatterns(patterns);
    }
  } catch (err) {
    resultEl.innerText = `Analysis failed: ${err.message}`;
  } finally {
    btn.innerText = origText;
    btn.disabled = false;
  }
}

function renderDetectedPatterns(patterns) {
  clearPatternShapes();

  var data = lastCandles || [];
  var segments = [];
  patterns.forEach(function (p) {
    if (p.startTime !== undefined && p.endTime !== undefined) {
      segments.push({ start: p.startTime, end: p.endTime, patterns: [p] });
      return;
    }
    var ts = p.timestamp;
    var idx = data.findIndex(function (c) { return c.time === ts; });
    if (idx === -1) {
      segments.push({ start: ts, end: ts, patterns: [p] });
      return;
    }
    var startIdx = Math.max(0, idx - 49);
    segments.push({ start: data[startIdx].time, end: ts, patterns: [p] });
  });

  segments.sort(function (a, b) { return a.start - b.start; });
  var merged = [];
  segments.forEach(function (seg) {
    if (merged.length === 0) {
      merged.push(seg);
      return;
    }
    var last = merged[merged.length - 1];
    if (seg.start <= last.end) {
      last.end = Math.max(last.end, seg.end);
      last.patterns = last.patterns.concat(seg.patterns);
    } else {
      merged.push(seg);
    }
  });

  var markers = [];
  var drawingMgr = window.DrawingController?.getManager ? window.DrawingController.getManager() : null;
  var registry = window.DrawingLib?.getToolRegistry ? window.DrawingLib.getToolRegistry() : null;
  var fallbackPrice = data.length ? data[data.length - 1].close : 0;

  merged.forEach(function (seg, index) {
    var topPattern = seg.patterns.reduce(function (best, p) {
      if (!best || p.confidence > best.confidence) return p;
      return best;
    }, null);
    if (!topPattern) return;

    var label = `${topPattern.pattern_type} - ${(topPattern.confidence * 100).toFixed(0)}%`;

    if (drawingMgr && registry) {
      var anchors = [
        { time: seg.start, price: fallbackPrice },
        { time: seg.end, price: fallbackPrice },
      ];
      try {
        var drawing = registry.createDrawing(
          'pattern-date-range',
          'pattern-range-' + index + '-' + Date.now(),
          anchors,
          {
            lineColor: '#26a69a',
            lineWidth: 1,
            lineDash: [5, 5],
          },
          {
            labelText: label,
            showBars: false,
            showDays: false,
            showDates: true,
            filled: false,
          }
        );
        if (drawing && drawing.id) {
          drawingMgr.addDrawing(drawing);
          patternDrawings.push(drawing.id);
        }
      } catch (e) {
        console.warn('Unable to create pattern date-range drawing', e);
      }
    } else if (chartInitMode === 'advanced' && chart && chart.chart && typeof chart.chart().createShape === 'function') {
      var shape = chart.chart().createShape(
        { time: seg.start },
        {
          shape: 'vertical_line',
          color: '#26a69a',
          width: 1,
          text: label,
          textColor: '#26a69a',
          textFontSize: 12,
          textBold: true,
        }
      );
      if (shape) patternShapes.push(shape);
    }

    markers.push({
      time: seg.start,
      position: 'aboveBar',
      color: '#26a69a',
      shape: 'arrowDown',
      text: label,
    });
  });

  if (candleSeries && typeof candleSeries.setMarkers === 'function') {
    candleSeries.setMarkers(markers);
    patternMarkers = markers;
  }
}

function initVolumePane(paneChart) {
  var _HS = window.LightweightCharts.HistogramSeries;
  var _LS = window.LightweightCharts.LineSeries;

  volumeSeries = paneChart.addSeries(_HS, {
    priceFormat: { type: 'volume' },
    lastValueVisible: false,
    priceLineVisible: false,
  });

  volumeSmaSeries = paneChart.addSeries(_LS, {
    color: '#FF9800',
    lineWidth: 2,
    lastValueVisible: false,
    priceLineVisible: false,
  });
}

function updateIndicators(candleData) {
  if (!volumeSeries || !volumeSmaSeries) return;
  if (!candleData || candleData.length < 20) return;

  var volData = candleData.map(function (c) {
    return {
      time: c.time,
      value: c.volume || 0,
      color: c.close >= c.open ? '#26a69a' : '#ef5350',
    };
  });
  volumeSeries.setData(volData);

  var volValues = candleData.map(function (c) {
    return { time: c.time, value: c.volume || 0 };
  });
  volumeSmaSeries.setData(calculateSMA(volValues, 20));
}

function updateRealtime(time, close, volume, open) {
  if (!volumeSeries) return;
  volumeSeries.update({
    time: time,
    value: volume || 0,
    color: close >= open ? '#26a69a' : '#ef5350',
  });
  if (!lastCandles.length) return;
  var volValues = lastCandles.map(function (c) {
    return { time: c.time, value: c.volume || 0 };
  });
  volumeSmaSeries.setData(calculateSMA(volValues, 20));
}



function getCurrentBars() {
  return lastCandles;
}

function mainChart() {
  return chart;
}

window.TFChart = {
  createChart, loadCandles, startCandleWs, stopCandleWs, applyChartTheme,
  analyzePatterns, renderPatterns, setActiveSymbol: (s) => { currentSymbol = s; },
  updateIndicators, updateRealtime, getCurrentBars, mainChart,
  initVolumePane,
  resetChartScale,
};

document.addEventListener('DOMContentLoaded', () => {
  createChart();
});
