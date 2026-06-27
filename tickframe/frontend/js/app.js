function saveSetting(key, value) {
  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings: { [key]: value } }),
  }).catch(function () {});
}

async function loadSettings() {
  try {
    var r = await fetch('/api/settings');
    var data = await r.json();
    var s = data.settings || {};
    if (s.theme === 'light') {
      document.body.classList.add('light');
      if (window.TFChart && window.TFChart.applyChartTheme) {
        window.TFChart.applyChartTheme(false);
      }
    }
  } catch (e) {}
}

var _initialLoadDone = false;

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  const defaultSymbol = 'BTCUSDT';
  const symbolNames = {
    BTCUSDT: 'Bitcoin',
    ETHUSDT: 'Ethereum',
    SOLUSDT: 'Solana',
    XRPUSDT: 'Ripple',
    DOGEUSDT: 'Dogecoin',
    ADAUSDT: 'Cardano',
    AVAXUSDT: 'Avalanche',
    DOTUSDT: 'Polkadot',
    LINKUSDT: 'Chainlink',
    BNBUSDT: 'BNB',
  };

  const titleEl = document.getElementById('marketTitle');
  const updateTitle = (symbol) => {
    if (titleEl) titleEl.innerText = `Market charts - ${symbolNames[symbol] || symbol}`;
  };

  var origSetActive = window.TFChart?.setActiveSymbol;
  if (window.TFChart) {
    window.TFChart.setActiveSymbol = (symbol) => {
      window.currentSymbol = symbol;
      updateTitle(symbol);
      _initialLoadDone = true;
    };
  }

  // timeframe buttons
  document.querySelectorAll('.timeframes button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timeframes button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tf = btn.dataset.tf;
      if (window.TFChart) {
        window.TFChart.loadCandles(window.currentSymbol || defaultSymbol, tf);
        window.TFChart.startCandleWs(window.currentSymbol || defaultSymbol, tf);
      }
    });
  });

  // theme toggle
  const themeBtn = document.getElementById('themeBtn');
  themeBtn?.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('light');
    const dark = !body.classList.contains('light');
    window.TFChart?.applyChartTheme?.(dark);
    saveSetting('theme', dark ? 'dark' : 'light');
  });

  // analyze button
  const analyzeBtn = document.querySelector('.analyze-btn');
  analyzeBtn?.addEventListener('click', () => {
    window.TFChart?.analyzePatterns?.();
  });

  // Select default coin after chart is ready; skip if user already clicked a coin.
  updateTitle(defaultSymbol);
  setTimeout(() => {
    if (_initialLoadDone) return;
    const first = document.querySelector('.watchlist .coin');
    if (first) {
      first.click();
    }
  }, 300);
});
