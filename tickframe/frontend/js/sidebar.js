const COINS = [
  {symbol:'BTCUSDT',name:'Bitcoin',icon:'B'},
];

function renderWatchlist() {
  const el = document.getElementById('watchlist');
  if(!el) return;
  el.innerHTML = '';
  COINS.forEach(c=>{
    const row = document.createElement('div'); row.className='coin'; row.dataset.symbol=c.symbol;
    row.innerHTML = `<div class="badge">${c.icon}</div><div class="meta"><div class="name">${c.name}</div><div class="price">--</div></div>`;
    row.addEventListener('click', ()=>{ onCoinClick(c.symbol); });
    el.appendChild(row);
  });
}

async function updatePrices() {
  try {
    const res = await fetch('/api/coins');
    if(!res.ok) return;
    const list = await res.json();
    const map = {};
    list.forEach(i=>{ map[i.symbol]=i; });
    document.querySelectorAll('.watchlist .coin').forEach(node=>{
      const sym = node.dataset.symbol;
      const info = map[sym];
      const priceEl = node.querySelector('.price');
      if(info && priceEl) priceEl.innerText = `$${parseFloat(info.price).toFixed(4)}`;
    });
  } catch(e){ console.error('updatePrices',e); }
}

function onCoinClick(symbol){
  // notify charts
  if(window.TFChart){
    const interval = document.querySelector('.timeframes button.active')?.dataset.tf || '5m';
    window.TFChart.setActiveSymbol?.(symbol);
    window.TFChart.loadCandles(symbol, interval);
    window.TFChart.startCandleWs(symbol, interval);
  }
  document.querySelectorAll('.watchlist .coin').forEach(n=>n.classList.toggle('active', n.dataset.symbol===symbol));
}

document.addEventListener('DOMContentLoaded', ()=>{ renderWatchlist(); updatePrices(); setInterval(updatePrices,5000); });

window.Sidebar = { renderWatchlist, updatePrices, onCoinClick };
