let chart = null;
let candleSeries = null;
let currentSymbol = 'BTCUSDT';
let currentInterval = '5m';
let lastCandles = [];
let isDarkTheme = true;
let patternShapes = [];
let patternMarkers = [];
let chartInitMode = null;

function isChartingLibAvailable() {
  return typeof TradingView !== 'undefined';
}

function createChart() {
  const container = document.getElementById('chart');
  container.innerHTML = '';

  if (isChartingLibAvailable()) {
    chartInitMode = 'advanced';
    createAdvancedChart(container);
    const tb = document.getElementById('leftToolbar');
    if (tb) tb.style.display = 'none';
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
    timeScale: { borderColor: '#2a2e39', timeVisible: true, secondsVisible: false },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
  });

  const SeriesType = window.LightweightCharts.CandlestickSeries || 'Candlestick';
  candleSeries = lwChart.addSeries(SeriesType, {
    upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
    wickUpColor: '#26a69a', wickDownColor: '#ef5350',
  });

  window.chart = lwChart;
  window.candleSeries = candleSeries;
  chart = lwChart;
  applyChartTheme(true);

  var chartContainer = document.querySelector('.chart-container');
  if (window.DrawingOverlay && chartContainer) {
    window.DrawingOverlay.init(lwChart, candleSeries, chartContainer);
  }

  if (window.LightweightToolbar) {
    window.LightweightToolbar.init(lwChart, candleSeries, []);
  }

  window.addEventListener('resize', () => {
    const r = container.getBoundingClientRect();
    lwChart.resize(Math.max(300, r.width), Math.max(200, r.height));
    if (window.DrawingOverlay) window.DrawingOverlay.resize();
  });

  if (window.DrawingOverlay) {
    try {
      chart.timeScale().subscribeVisibleTimeRangeChange(function () {
        window.DrawingOverlay.render();
      });
    } catch (_) {}
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
  } : {
    layout: { background: { type: 'solid', color: '#f5f7fb' }, textColor: '#111827' },
    grid: { vertLines: { color: '#e5e7eb' }, horzLines: { color: '#e5e7eb' } },
    rightPriceScale: { borderColor: '#d1d5db' },
    timeScale: { borderColor: '#d1d5db', timeVisible: true, secondsVisible: false },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
  };

  chart.applyOptions(theme);
}

async function loadCandles(symbol, interval) {
  currentSymbol = symbol;
  window.currentSymbol = symbol;
  currentInterval = interval;

  if (chartInitMode === 'advanced') {
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
    return;
  }

  try {
    // Step 1: quick batch for immediate display
    const quickResp = await fetch(`/api/coins/${symbol}/candles?interval=${interval}&limit=2000`);
    if (!quickResp.ok) throw new Error('Failed to load candles');
    var quickPayload = await quickResp.json();
    var quickData = Array.isArray(quickPayload) ? quickPayload : (quickPayload.candles || []);
    lastCandles = quickData.map(function (c) {
      return {
        time: c.time || c.t || Math.floor(new Date(c[0] || c.ts || Date.now()).getTime() / 1000),
        open: +c.open, high: +c.high, low: +c.low, close: +c.close
      };
    });
    candleSeries.setData(lastCandles);
    // Zoom to last 500 candles initially
    if (lastCandles.length > 500) {
      chart.timeScale().setVisibleRange({
        from: lastCandles[lastCandles.length - 500].time,
        to: lastCandles[lastCandles.length - 1].time,
      });
    } else if (lastCandles.length > 1) {
      chart.timeScale().fitContent();
    }
    if (window.DrawingOverlay) window.DrawingOverlay.setSymbol(symbol);
    if (window.LightweightToolbar) {
      window.LightweightToolbar.setData(lastCandles);
      window.LightweightToolbar.clearAll();
    }

    // Step 2: load full 150k in background
    var fullResp = await fetch(`/api/coins/${symbol}/candles?interval=${interval}&limit=50000`);
    if (fullResp.ok) {
      var fullPayload = await fullResp.json();
      var fullData = Array.isArray(fullPayload) ? fullPayload : (fullPayload.candles || []);
      var fullNormalized = fullData.map(function (c) {
        return {
          time: c.time || c.t || Math.floor(new Date(c[0] || c.ts || Date.now()).getTime() / 1000),
          open: +c.open, high: +c.high, low: +c.low, close: +c.close
        };
      });
      if (fullNormalized.length > lastCandles.length) {
        lastCandles = fullNormalized;
        candleSeries.setData(fullNormalized);
        if (window.LightweightToolbar) {
          window.LightweightToolbar.setData(fullNormalized);
        }
        // Keep zoom at last 10000 candles
        if (fullNormalized.length > 10000) {
          chart.timeScale().setVisibleRange({
            from: fullNormalized[fullNormalized.length - 10000].time,
            to: fullNormalized[fullNormalized.length - 1].time,
          });
        }
      }
    }
  } catch (err) {
    console.error('loadCandles error', err);
  }
}

function startCandleWs(symbol, interval) {
  stopCandleWs();
  if (chartInitMode === 'advanced') return;
  window._shouldReconnectWs = true;
  try {
    const proto = (location.protocol === 'https:') ? 'wss' : 'ws';
    const url = `${proto}://${location.host}/ws/candles/${symbol}?interval=${interval}`;
    window._candleWs = new WebSocket(url);
    window._candleWs.onopen = () => {
      const s = document.getElementById('status');
      if (s) s.innerText = 'ONLINE';
    };
    window._candleWs.onclose = () => {
      const s = document.getElementById('status');
      if (s) s.innerText = 'OFFLINE';
      if (window._shouldReconnectWs) {
        setTimeout(() => startCandleWs(symbol, interval), 2000);
      }
    };
    window._candleWs.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'snapshot' && msg.candles) {
          const newCandles = msg.candles.map(c => ({
            time: c.time, open: +c.open, high: +c.high, low: +c.low, close: +c.close,
          }));
          // Only update if snapshot has more data than what we currently show
          if (newCandles.length > lastCandles.length) {
            lastCandles = newCandles;
            candleSeries.setData(newCandles);
          }
          const s = document.getElementById('status');
          if (s) s.innerText = 'LIVE';
        } else if (msg.type === 'update' && msg.candle) {
          const c = msg.candle;
          if (c && c.time && candleSeries) {
            const point = { time: c.time, open: +c.open, high: +c.high, low: +c.low, close: +c.close };
            candleSeries.update(point);
            if (lastCandles.length) {
              var last = lastCandles[lastCandles.length - 1];
              if (last.time === point.time) {
                lastCandles[lastCandles.length - 1] = point;
              } else {
                lastCandles.push(point);
              }
            }
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

function clearPatternShapes() {
  patternShapes.forEach(s => {
    try {
      if (s.remove) s.remove();
      else if (chart && chart.removeShape) chart.removeShape(s);
    } catch (e) { }
  });
  patternShapes = [];
  if (typeof candleSeries?.setMarkers === 'function') {
    candleSeries.setMarkers([]);
  }
  patternMarkers = [];
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
    const idx = lastCandles.findIndex(c => c.time === ts);
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
  if (typeof candleSeries?.setMarkers === 'function') {
    candleSeries.setMarkers(newMarkers);
  }
}

async function analyzePatterns() {
  const btn = document.querySelector('.analyze-btn');
  const resultEl = document.querySelector('.result-text');
  if (!btn || !resultEl) return;

  const origText = btn.innerText;
  btn.innerText = 'ANALYZING...';
  btn.disabled = true;
  resultEl.innerText = 'Loading all candles...';

  // Clear previous pattern drawings
  if (window.DrawingOverlay) window.DrawingOverlay.clearPatternDrawings();

  try {
    // Load ALL available candles (up to 150k)
    const resp = await fetch(`/api/coins/${currentSymbol}/candles?interval=${currentInterval}&limit=50000`);
    if (!resp.ok) throw new Error('Failed to load candles');
    const payload = await resp.json();
    const candles = (payload.candles || []);

    if (candles.length < 50) {
      resultEl.innerText = 'Not enough candle data (need at least 50).';
      return;
    }

    resultEl.innerText = `Analyzing ${candles.length} candles...`;
    const threshold = parseFloat(window._analysisThreshold || '0.80');
    const windowSize = 50;
    const step = 10;
    const found = [];
    let analyzed = 0;

    for (let i = 0; i + windowSize <= candles.length; i += step) {
      const windowCandles = candles.slice(i, i + windowSize);
      const startTime = windowCandles[0].time;
      const endTime = windowCandles[windowSize - 1].time;

      const mlCandles = windowCandles.map(c => ({
        timestamp: c.time, open: c.open, high: c.high,
        low: c.low, close: c.close, volume: c.volume || 0,
      }));

      try {
        const mlResp = await fetch(`/api/analyze/${currentSymbol}?interval=${currentInterval}&limit=${windowSize}&confidence_threshold=${threshold}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candles: mlCandles }),
        });
        analyzed++;
        if (analyzed % 50 === 0) {
          resultEl.innerText = `Analyzing ${candles.length} candles... (${Math.round(i / candles.length * 100)}%)`;
        }
        if (mlResp.ok) {
          const mlData = await mlResp.json();
          const patterns = mlData.patterns || [];
          patterns.forEach(p => {
            if (p.confidence >= threshold) {
              found.push({
                pattern_type: p.pattern_type,
                confidence: p.confidence,
                startTime: startTime,
                endTime: endTime,
                timestamp: p.timestamp || Math.floor((startTime + endTime) / 2),
              });
            }
          });
        }
      } catch (_) { /* skip failed window */ }
    }

    if (found.length === 0) {
      resultEl.innerText = `No patterns detected above ${(threshold * 100).toFixed(0)}% threshold across ${candles.length} candles.`;
    } else {
      resultEl.innerText = `Found ${found.length} pattern(s) above ${(threshold * 100).toFixed(0)}% across ${candles.length} candles.`;
      renderDetectedPatterns(found);
    }
  } catch (err) {
    resultEl.innerText = `Analysis failed: ${err.message}`;
  } finally {
    btn.innerText = origText;
    btn.disabled = false;
  }
}

function renderDetectedPatterns(patterns) {
  if (!window.DrawingOverlay || !chart) return;
  patterns.forEach(p => {
    // Two red dashed vertical lines at start and end
    var startOpts = { color: '#ff0000', width: 2, lineStyle: 'dashed', opacity: 1 };
    var endOpts = { color: '#ff0000', width: 2, lineStyle: 'dashed', opacity: 1 };
    // Use the canvas overlay to draw — add vline drawings
    var startV = { id: -Date.now() - Math.random(), type: 'vline', _isPattern: true,
      points: [{ time: p.startTime, price: 0 }], opts: startOpts };
    var endV = { id: -Date.now() - Math.random() - 1, type: 'vline', _isPattern: true,
      points: [{ time: p.endTime, price: 0 }], opts: endOpts };
    window.DrawingOverlay.addPatternDrawing(startV);
    window.DrawingOverlay.addPatternDrawing(endV);

    // Text label at the center
    var midTime = Math.floor((p.startTime + p.endTime) / 2);
    var label = p.pattern_type + ' ' + (p.confidence * 100).toFixed(0) + '%';
    var textD = { id: -Date.now() - Math.random() - 2, type: 'text', _isPattern: true,
      points: [{ time: midTime, price: 0, label: label }],
      opts: { color: '#ff0000', fontSize: 12 } };
    window.DrawingOverlay.addPatternDrawing(textD);
  });
}

window.TFChart = {
  createChart, loadCandles, startCandleWs, stopCandleWs, applyChartTheme,
  analyzePatterns, renderPatterns, setActiveSymbol: (s) => { currentSymbol = s; },
};

document.addEventListener('DOMContentLoaded', () => {
  createChart();
  loadCandles(currentSymbol, currentInterval);
  if (chartInitMode === 'lightweight') {
    startCandleWs(currentSymbol, currentInterval);
  }
});
