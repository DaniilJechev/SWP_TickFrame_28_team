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
var _rsiAppliedForSymbol = '';

function initIndicatorSubsystem() {
  if (window.TFIndicatorController && window.TFIndicatorState && window.TFIndicatorPanel && window.TFIndicatorChips && window.TFIndicatorPanes) {
    TFIndicatorController.init({
      getCurrentBarsFn: function () { return window.TFChart ? window.TFChart.getCurrentBars() : []; },
    });
    var mainChart = window.TFChart ? window.TFChart.mainChart() : null;
    var paneArea = document.getElementById('indicatorPanes');
    if (mainChart && paneArea) {
      TFIndicatorPanes.init(mainChart, paneArea, paneArea);
    }

    var volumePane = TFIndicatorPanes.createPane('_volume', 80);
    if (volumePane) {
      var volHeader = volumePane.container.querySelector('.indicator-pane-header');
      if (volHeader) volHeader.textContent = 'Volume';
      if (window.TFChart && typeof window.TFChart.initVolumePane === 'function') {
        window.TFChart.initVolumePane(volumePane.chart);
      }
    }

    TFIndicatorPanel.init();
    TFIndicatorChips.init();
  }

  window._onCandlesUpdated = function (symbol) {
    if (!window.TFIndicatorController) return;
    var saved = TFIndicatorState.getApplied().slice();
    TFIndicatorController.destroyAll();
    for (var i = 0; i < saved.length; i++) {
      TFIndicatorController.applyIndicator(saved[i].indicatorId, saved[i].inputs);
    }
    if (_rsiAppliedForSymbol !== symbol) {
      _rsiAppliedForSymbol = symbol;
      var hasRsi = false;
      for (var j = 0; j < saved.length; j++) {
        if (saved[j].indicatorId === 'rsi') { hasRsi = true; break; }
      }
      if (!hasRsi) {
        TFIndicatorController.applyIndicator('rsi');
      }
    }
  };
}

function indicatorsToggle() {
  var panel = document.getElementById('indicatorsPanel');
  if (panel) {
    panel.classList.toggle('hidden');
    var btn = document.getElementById('indicatorsToggle');
    if (btn) btn.classList.toggle('active');
  }
}

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

  initIndicatorSubsystem();

  var origSetActive = window.TFChart?.setActiveSymbol;
  if (window.TFChart) {
    window.TFChart.setActiveSymbol = (symbol) => {
      window.currentSymbol = symbol;
      updateTitle(symbol);
      _initialLoadDone = true;
      if (typeof origSetActive === 'function') {
        origSetActive(symbol);
      }
      if (window.TFIndicatorController && typeof TFIndicatorController.loadForSymbol === 'function') {
        TFIndicatorController.loadForSymbol(symbol);
      }
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

  // indicators toggle
  var indicatorsToggleBtn = document.getElementById('indicatorsToggle');
  if (indicatorsToggleBtn) {
    indicatorsToggleBtn.addEventListener('click', indicatorsToggle);
  }
  var indicatorsCloseBtn = document.getElementById('indicatorsClose');
  if (indicatorsCloseBtn) {
    indicatorsCloseBtn.addEventListener('click', indicatorsToggle);
  }

  // theme toggle
  const themeBtn = document.getElementById('themeBtn');
  themeBtn?.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('light');
    const dark = !body.classList.contains('light');
    window.TFChart?.applyChartTheme?.(dark);
    saveSetting('theme', dark ? 'dark' : 'light');
    if (typeof loadFearAndGreed === 'function') loadFearAndGreed();
    if (window.TFDraw && window.TFDraw.redraw) {
      window.TFDraw.redraw();
    }
    if (window.TFIndicatorPanes && typeof TFIndicatorPanes.applyThemeToAll === 'function') {
      TFIndicatorPanes.applyThemeToAll(dark);
    }
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
