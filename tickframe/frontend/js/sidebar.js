const COINS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', icon: 'B' },
  { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'E' },
  { symbol: 'SOLUSDT', name: 'Solana', icon: 'S' },
  { symbol: 'XRPUSDT', name: 'Ripple', icon: 'X' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin', icon: 'D' },
  { symbol: 'ADAUSDT', name: 'Cardano', icon: 'A' },
  { symbol: 'AVAXUSDT', name: 'Avalanche', icon: 'V' },
  { symbol: 'DOTUSDT', name: 'Polkadot', icon: 'P' },
  { symbol: 'LINKUSDT', name: 'Chainlink', icon: 'L' },
  { symbol: 'BNBUSDT', name: 'BNB', icon: 'N' },
];

function renderWatchlist() {
  const el = document.getElementById('watchlist');
  if (!el) return;
  el.innerHTML = '';
  COINS.forEach(c => {
    const row = document.createElement('div');
    row.className = 'coin';
    row.dataset.symbol = c.symbol;
    row.innerHTML = `<div class="badge">${c.symbol.replace('USDT', '')}</div><div class="meta"><div class="name">${c.name}</div><div class="price">--</div></div>`;
    row.addEventListener('click', () => { onCoinClick(c.symbol); });
    el.appendChild(row);
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
    const map = {};
    list.forEach(i => { map[i.pair] = i; });
    document.querySelectorAll('.watchlist .coin').forEach(node => {
      const sym = node.dataset.symbol;
      const info = map[sym];
      const priceEl = node.querySelector('.price');
      if (info && priceEl) {
        priceEl.innerText = `$${formatPrice(info.price)}`;
        if (info.trend === 'up') priceEl.style.color = '#22c55e';
        else if (info.trend === 'down') priceEl.style.color = '#ef4444';
        else priceEl.style.color = '';
      }
    });
  } catch (e) { console.error('updatePrices', e); }
}

function onCoinClick(symbol) {
  if (window.TFChart) {
    const interval = document.querySelector('.timeframes button.active')?.dataset.tf || '5m';
    window.TFChart.setActiveSymbol?.(symbol);
    window.TFChart.loadCandles(symbol, interval);
    window.TFChart.startCandleWs(symbol, interval);
  }
  const resultEl = document.querySelector('.result-text');
  if (resultEl) resultEl.innerText = 'Click to analyze chart for patterns.';
  document.querySelectorAll('.watchlist .coin').forEach(n => n.classList.toggle('active', n.dataset.symbol === symbol));
}

document.addEventListener('DOMContentLoaded', () => { renderWatchlist(); updatePrices(); setInterval(updatePrices, 5000); });

window.Sidebar = { renderWatchlist, updatePrices, onCoinClick };
