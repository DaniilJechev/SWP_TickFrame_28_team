document.addEventListener('DOMContentLoaded', ()=>{
  const defaultSymbol = 'BTCUSDT';
  const symbolNames = {
    BTCUSDT: 'Bitcoin',
  };

  const titleEl = document.getElementById('marketTitle');
  const updateTitle = (symbol) => {
    if (titleEl) titleEl.innerText = `Market charts - ${symbolNames[symbol] || symbol}`;
  };

  if (window.TFChart) {
    window.TFChart.setActiveSymbol = (symbol) => {
      window.currentSymbol = symbol;
      updateTitle(symbol);
    };
  }
  // timeframes - only 5m
  const tf = '5m';
  document.querySelectorAll('.timeframes button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.timeframes button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      if(window.TFChart) { window.TFChart.loadCandles(window.currentSymbol || defaultSymbol, tf); window.TFChart.startCandleWs(window.currentSymbol || defaultSymbol, tf); }
    });
  });

  // theme toggle (simple)
  const themeBtn = document.getElementById('themeBtn');
  themeBtn?.addEventListener('click', ()=>{
    const body = document.body; body.classList.toggle('light');
    const dark = !body.classList.contains('light');
    window.TFChart?.applyChartTheme?.(dark);
  });

  // initialize sidebar and select default coin
  if(window.Sidebar){ window.Sidebar.renderWatchlist?.(); }
  updateTitle(defaultSymbol);
  setTimeout(()=>{ const first = document.querySelector('.watchlist .coin'); if(first){ first.click(); } else { if(window.TFChart) { window.TFChart.setActiveSymbol?.(defaultSymbol); window.TFChart.loadCandles(defaultSymbol,'5m'); } } }, 200);
});
