const COINS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'XRPUSDT', name: 'Ripple' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'AVAXUSDT', name: 'Avalanche' },
  { symbol: 'DOTUSDT', name: 'Polkadot' },
  { symbol: 'LINKUSDT', name: 'Chainlink' },
  { symbol: 'BNBUSDT', name: 'BNB' },
];

var _coinIcons = {};
var _coinFilter = '';
window._coinIcons = _coinIcons;
window._coinList = COINS;


function renderWatchlist() {
  const el = document.getElementById('watchlist');
  if (!el) return;
  el.innerHTML = '';
  const q = _coinFilter.trim().toLowerCase();
  const filtered = COINS.filter(c =>
    !q ||
    c.symbol.toLowerCase().indexOf(q) !== -1 ||
    c.name.toLowerCase().indexOf(q) !== -1 ||
    c.symbol.replace('USDT', '').toLowerCase().indexOf(q) !== -1
  );
  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'watchlist-empty';
    empty.textContent = 'No coins match "' + _coinFilter + '"';
    el.appendChild(empty);
    return;
  }
  const activeSymbol = window.currentSymbol;
  filtered.forEach(c => {
    const ticker = c.symbol.replace('USDT', '');
    const iconUrl = _coinIcons[c.symbol];
    const row = document.createElement('div');
    row.className = 'coin' + (c.symbol === activeSymbol ? ' active' : '');
    row.dataset.symbol = c.symbol;
    row.innerHTML =
      '<div class="badge">' + (iconUrl ? '<img src="' + iconUrl + '" alt="' + ticker + '" />' : ticker) + '</div>' +
      '<div class="meta">' +
        '<div class="ticker">' + c.symbol + '</div>' +
        '<div class="name">' + c.name + '</div>' +
      '</div>' +
      '<div class="stats">' +
        '<div class="price">--</div>' +
        '<div class="change">--</div>' +
      '</div>';
    row.addEventListener('click', () => { onCoinClick(c.symbol); });
    el.appendChild(row);
  });
  // Refresh prices for the newly rendered rows without waiting for the interval.
  updatePrices();
}

function initCoinSearch() {
  const input = document.getElementById('coinSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    _coinFilter = input.value || '';
    renderWatchlist();
  });
}


function formatPrice(price) {
  if (price == null || isNaN(price)) return '--';
  var abs = Math.abs(price);
  var intDigits = abs < 1 ? 0 : Math.floor(Math.log10(abs)) + 1;
  var maxDec = Math.max(0, 6 - intDigits);
  var s = price.toFixed(maxDec);
  // Strip trailing zeros after decimal point (but keep at least 1 decimal)
  if (s.indexOf('.') !== -1) {
    s = s.replace(/0+$/, '');
    if (s.charAt(s.length - 1) === '.') s += '0';
  }
  return s;
}

async function updatePrices() {
  try {
    const res = await fetch('/api/coins');
    if (!res.ok) return;
    const list = await res.json();
    _applyCoinPrices(list);
  } catch (e) { console.error('updatePrices', e); }
}

function _applyCoinPrices(list) {
  const map = {};
  list.forEach(i => { map[i.pair] = i; });
  document.querySelectorAll('.watchlist .coin').forEach(node => {
    const sym = node.dataset.symbol;
    const info = map[sym];
    if (!info) return;
    const priceEl = node.querySelector('.price');
    const changeEl = node.querySelector('.change');
    if (priceEl) {
      priceEl.innerText = '$' + formatPrice(info.price);
      priceEl.style.color = '';
    }
    if (changeEl && info.change_24h != null) {
      var change = info.change_24h;
      var sign = change >= 0 ? '+' : '';
      changeEl.innerText = sign + change.toFixed(2) + '%';
      changeEl.style.color = change >= 0 ? 'var(--up)' : 'var(--down)';

    }
  });
  // Push ticker price into chart's latest candle (single source of truth)
  if (window.TFChart?.updateLatestPrice && map[window.currentSymbol]?.price != null) {
    window.TFChart.updateLatestPrice(Number(map[window.currentSymbol].price));
  }
}

var _marketWs = null;

function _startMarketWs() {
  if (_marketWs) { try { _marketWs.close(); } catch (e) {} }
  const proto = (location.protocol === 'https:') ? 'wss' : 'ws';
  _marketWs = new WebSocket(proto + '://' + location.host + '/ws/market');
  _marketWs.onopen = function () {};
  _marketWs.onclose = function () {
    _marketWs = null;
    setTimeout(_startMarketWs, 3000);
  };
  _marketWs.onmessage = function (ev) {
    try {
      var msg = JSON.parse(ev.data);
      if (msg.type === 'market_snapshot' || msg.type === 'snapshot') {
        if (msg.coins && msg.coins.length) {
          _applyCoinPrices(msg.coins);
          // Also push to topbar
          var current = msg.coins.find(function (c) { return c.pair === window.currentSymbol; });
          if (current && window.TFTopbar?.updateFromSnapshot) {
            window.TFTopbar.updateFromSnapshot(
              current.price,
              current.change_24h,
              current.volume_24h
            );
          }
        }
      }
    } catch (e) { /* ignore parse errors */ }
  };
}

function onCoinClick(symbol) {
  if (window.TFChart) {
    if (window.currentSymbol) {
      var activeInterval = document.querySelector('.timeframes button.active')?.dataset.tf || '5m';
      window.TFChart.saveCoinState(window.currentSymbol, activeInterval);
    }

    var saved = window.TFChart.getCoinState(symbol);
    var targetInterval = (saved && saved.interval) || document.querySelector('.timeframes button.active')?.dataset.tf || '5m';

    document.querySelectorAll('.timeframes button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tf === targetInterval);
    });

    window.TFChart.setActiveSymbol(symbol);
    window.TFChart.switchCoin(symbol, targetInterval);
    window.TFChart.restoreCoinState(symbol, targetInterval);
  }
  const resultEl = document.querySelector('.result-text');
  if (resultEl) resultEl.innerText = 'Click to analyze chart for patterns.';
  document.querySelectorAll('.watchlist .coin').forEach(function (n) {
    n.classList.toggle('active', n.dataset.symbol === symbol);
  });
}

// ── Fear & Greed Speedometer ───────────────────────────────────────────

var FNG_ZONES = [
  { start: 0, end: 25, color: '#ff3d3d', label: 'Extreme Fear' },
  { start: 25, end: 45, color: '#ff9800', label: 'Fear' },
  { start: 45, end: 55, color: '#ffeb3b', label: 'Neutral' },
  { start: 55, end: 75, color: '#8bc34a', label: 'Greed' },
  { start: 75, end: 100, color: '#4caf50', label: 'Extreme Greed' },
];

function _fngValueToAngle(v) {
  return Math.PI * (1 + v / 100);
}

function _fngPolar(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function _fngArcPath(cx, cy, r, vStart, vEnd) {
  var a1 = _fngValueToAngle(vStart);
  var a2 = _fngValueToAngle(vEnd);
  var p1 = _fngPolar(cx, cy, r, a1);
  var p2 = _fngPolar(cx, cy, r, a2);
  var large = a2 - a1 > Math.PI ? 1 : 0;
  return 'M ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
}

function _fngTimeUntil(timestamp) {
  var now = Math.floor(Date.now() / 1000);
  var next = timestamp + 86400;
  var diff = Math.max(0, next - now);
  var h = Math.floor(diff / 3600);
  var m = Math.floor((diff % 3600) / 60);
  if (h > 0) return h + 'h ' + m + 'm';
  return m + 'm';
}

function _fngBuildSVG(value, classification, timestamp) {
  var cx = 120, cy = 150, r = 72, sw = 16;
  var needleLen = r * 0.78;
  var w = 240, h = 280;
  var light = document.body.classList.contains('light');

  var angle = _fngValueToAngle(value);
  var tip = _fngPolar(cx, cy, needleLen, angle);
  var nextUpdate = _fngTimeUntil(timestamp);

  var c = {
    track: light ? '#e5e7eb' : '#1f2937',
    title: light ? '#0f172a' : '#e2e8f0',
    tick: light ? '#9ca3af' : '#6b7280',
    tickLabel: light ? '#5b6575' : '#9ca3af',
    needle: light ? '#0f172a' : '#f1f5f9',
    dotOuter: light ? '#0f172a' : '#f1f5f9',
    dotInner: light ? '#f8fafc' : '#1e293b',
    value: light ? '#0f172a' : '#f1f5f9',
    classText: light ? '#5b6575' : '#9ca3af',
    nextText: light ? '#5b6575' : '#6b7280',
  };

  var svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">';
  svg += '<defs><filter id="fng-shadow"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>';

  // Title
  svg += '<text x="' + cx + '" y="28" text-anchor="middle" fill="' + c.title + '" font-size="12" font-weight="700" font-family="inherit" letter-spacing="0.5">Crypto Fear &amp; Greed Index</text>';

  // Background track
  svg += '<path d="' + _fngArcPath(cx, cy, r, 0, 100) + '" fill="none" stroke="' + c.track + '" stroke-width="' + (sw + 4) + '" stroke-linecap="round"/>';

  // Colored zones
  for (var i = 0; i < FNG_ZONES.length; i++) {
    var z = FNG_ZONES[i];
    svg += '<path d="' + _fngArcPath(cx, cy, r, z.start, z.end) + '" fill="none" stroke="' + z.color + '" stroke-width="' + sw + '" stroke-linecap="butt"/>';
  }

  // Tick marks & labels
  var ticks = [0, 10, 20, 25, 30, 40, 45, 50, 55, 60, 70, 75, 80, 90, 100];
  var majors = [0, 25, 50, 75, 100];
  for (var i = 0; i < ticks.length; i++) {
    var v = ticks[i];
    var a = _fngValueToAngle(v);
    var isMajor = majors.indexOf(v) !== -1;
    var inner = _fngPolar(cx, cy, r - (isMajor ? 12 : 8), a);
    var outer = _fngPolar(cx, cy, r - 3, a);
    svg += '<line x1="' + inner.x.toFixed(1) + '" y1="' + inner.y.toFixed(1) + '" x2="' + outer.x.toFixed(1) + '" y2="' + outer.y.toFixed(1) + '" stroke="' + c.tick + '" stroke-width="' + (isMajor ? 2 : 1) + '"/>';
  }

  // Label text for major ticks
  var labelR = r + 14;
  for (var i = 0; i < majors.length; i++) {
    var v = majors[i];
    var a = _fngValueToAngle(v);
    var p = _fngPolar(cx, cy, labelR, a);
    svg += '<text x="' + p.x.toFixed(1) + '" y="' + (p.y + 3.5).toFixed(1) + '" text-anchor="middle" fill="' + c.tickLabel + '" font-size="8" font-family="inherit">' + v + '</text>';
  }

  // Needle with shadow
  svg += '<g filter="url(#fng-shadow)">';
  svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + tip.x.toFixed(1) + '" y2="' + tip.y.toFixed(1) + '" stroke="' + c.needle + '" stroke-width="2.5" stroke-linecap="round"/>';
  svg += '</g>';

  // Center dot
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="' + c.dotOuter + '"/>';
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + c.dotInner + '"/>';

  // Value & classification text (lower, inside gauge center)
  var textY = cy + 30;
  svg += '<text x="' + cx + '" y="' + (textY) + '" text-anchor="middle" fill="' + c.value + '" font-size="26" font-weight="bold" font-family="inherit">' + value + '</text>';
  svg += '<text x="' + cx + '" y="' + (textY + 16) + '" text-anchor="middle" fill="' + c.classText + '" font-size="10" font-family="inherit">' + classification + '</text>';

  // Next update
  svg += '<text x="' + cx + '" y="' + (h - 30) + '" text-anchor="middle" fill="' + c.nextText + '" font-size="10" font-family="inherit">next update in: ' + nextUpdate + '</text>';

  svg += '</svg>';
  return svg;
}

async function loadFearAndGreed() {
  try {
    var resp = await fetch('/api/sentiment');
    if (!resp.ok) return;
    var data = await resp.json();
    var el = document.getElementById('fng-container');
    if (!el) return;
    el.innerHTML = _fngBuildSVG(data.value, data.classification, data.timestamp);
  } catch (_) {}
}

async function loadCoinIcons() {
  try {
    var resp = await fetch('/api/coins/icons');
    if (!resp.ok) return;
    var icons = await resp.json();
    Object.keys(icons).forEach(function (k) { _coinIcons[k] = icons[k]; });
    // Re-render with icons
    renderWatchlist();
    if (window.TFTopbar && typeof window.TFTopbar.refreshIdentity === 'function') {
      window.TFTopbar.refreshIdentity();
    }

  } catch (_) {}
}

document.addEventListener('DOMContentLoaded', () => { renderWatchlist(); initCoinSearch(); updatePrices(); _startMarketWs(); loadFearAndGreed(); loadCoinIcons(); });

window.Sidebar = { renderWatchlist, updatePrices, onCoinClick };

