// Minimal charts integration using Lightweight Charts
let chart = null;
let candleSeries = null;
let currentWs = null;
let currentSymbol = 'BTCUSDT';
let currentInterval = '5m';
let lastCandles = [];
let analysisLineStart = null;
let analysisLineEnd = null;
let analysisUpdateHandler = null;
let shouldReconnectWs = true;
let isDarkTheme = true;

function createChart() {
  const container = document.getElementById('chart');
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  chart = LightweightCharts.createChart(container, {
    width: Math.max(300, rect.width),
    height: Math.max(200, rect.height),
    layout: { background: { type: 'solid', color: '#000000' }, textColor: '#d1d4dc' },
    grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } },
    rightPriceScale: { borderColor: '#2a2e39' },
    timeScale: { borderColor: '#2a2e39', timeVisible: true, secondsVisible: false },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
  });

  // Use addSeries with the CandlestickSeries constructor for the standalone build
  candleSeries = chart.addSeries(window.LightweightCharts.CandlestickSeries, {
    upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350',
  });

  // expose for dev/other scripts
  window.chart = chart;
  window.candleSeries = candleSeries;
  applyChartTheme(true);

  const chartContainer = container.parentElement;
  analysisLineStart = document.createElement('div');
  analysisLineStart.className = 'analysis-line analysis-line-start';
  analysisLineEnd = document.createElement('div');
  analysisLineEnd.className = 'analysis-line analysis-line-end';
  chartContainer.appendChild(analysisLineStart);
  chartContainer.appendChild(analysisLineEnd);

  analysisUpdateHandler = () => updateAnalysisWindow();
  chart.timeScale().subscribeVisibleTimeRangeChange(analysisUpdateHandler);

  window.addEventListener('resize', () => {
    const rect = container.getBoundingClientRect();
    chart.resize(Math.max(300, rect.width), Math.max(200, rect.height));
    updateAnalysisWindow();
  });
}

function applyChartTheme(darkMode) {
  isDarkTheme = darkMode;
  if (!chart) {
    return;
  }

  const chartTheme = darkMode ? {
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

  chart.applyOptions(chartTheme);
}

function updateAnalysisWindow() {
  if (!chart || !lastCandles.length || !analysisLineStart || !analysisLineEnd) {
    return;
  }

  const startIndex = Math.max(0, lastCandles.length - 50);
  const startTime = lastCandles[startIndex]?.time;
  const endTime = lastCandles[lastCandles.length - 1]?.time;
  const startX = chart.timeScale().timeToCoordinate(startTime);
  const endX = chart.timeScale().timeToCoordinate(endTime);

  if (startX != null) {
    analysisLineStart.style.left = `${Math.round(startX)}px`;
    analysisLineStart.style.display = 'block';
  }

  if (endX != null) {
    analysisLineEnd.style.left = `${Math.round(endX)}px`;
    analysisLineEnd.style.display = 'block';
  }
}

async function loadCandles(symbol, interval = '5m') {
  currentSymbol = symbol;
  window.currentSymbol = symbol;
  currentInterval = interval;
  try {
    const resp = await fetch(`/api/coins/${symbol}/candles?interval=${interval}&limit=200`);
    if (!resp.ok) throw new Error('Failed to load candles');
    const payload = await resp.json();
    const data = Array.isArray(payload) ? payload : (payload.candles || []);
    const normalized = data.map(c => ({ time: c.time || c.t || Math.floor((new Date(c[0]||c.ts||Date.now())).getTime()/1000), open: +c.open, high: +c.high, low: +c.low, close: +c.close }));
    lastCandles = normalized;
    candleSeries.setData(normalized);
    chart.timeScale().fitContent();
    updateAnalysisWindow();
  } catch (err) {
    console.error('loadCandles error', err);
  }
}

function startCandleWs(symbol, interval='5m') {
  stopCandleWs();
  shouldReconnectWs = true;
  try {
    const proto = (location.protocol === 'https:') ? 'wss' : 'ws';
    const url = `${proto}://${location.host}/ws/candles/${symbol}?interval=${interval}`;
    currentWs = new WebSocket(url);
    currentWs.onopen = () => { const s=document.getElementById('status'); if(s) s.innerText='ONLINE'; };
    currentWs.onclose = () => {
      const s=document.getElementById('status'); if(s) s.innerText='OFFLINE';
      if (shouldReconnectWs) {
        setTimeout(()=>startCandleWs(symbol,interval),2000);
      }
    };
    currentWs.onerror = (e) => { console.error('WS error', e); };
    currentWs.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const c = msg.candle || msg;
        if (c && c.time && candleSeries) {
          const point = { time: c.time, open: +c.open, high: +c.high, low: +c.low, close: +c.close };
          candleSeries.update(point);
          if (lastCandles.length) {
            lastCandles[lastCandles.length - 1] = point;
            updateAnalysisWindow();
          }
        }
      } catch (e) { console.error('ws message parse', e); }
    };
  } catch (e) { console.error('startCandleWs', e); }
}

function stopCandleWs() { shouldReconnectWs = false; if (currentWs) { try { currentWs.close(); } catch(e){} currentWs=null; } }

// Expose for app.js
window.TFChart = { createChart, loadCandles, startCandleWs, stopCandleWs, applyChartTheme };

// Initialize
document.addEventListener('DOMContentLoaded', ()=>{ createChart(); loadCandles(currentSymbol,currentInterval); startCandleWs(currentSymbol,currentInterval); });
