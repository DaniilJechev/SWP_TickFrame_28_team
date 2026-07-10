var TFIndicatorPanes = (function () {
  var panes = {};
  var mainChart = null;
  var mainContainer = null;
  var paneContainer = null;
  var resizeHandler = null;

  function init(chart, container, paneArea) {
    mainChart = chart;
    mainContainer = container;
    paneContainer = paneArea || container;
  }

  function createPane(paneId, heightPx) {
    if (panes[paneId]) return panes[paneId];
    heightPx = heightPx || 120;

    var wrap = document.createElement('div');
    wrap.className = 'indicator-pane-wrap';
    wrap.style.height = heightPx + 'px';
    wrap.style.minHeight = heightPx + 'px';
    paneContainer.appendChild(wrap);

    var divider = document.createElement('div');
    divider.className = 'indicator-pane-divider';
    wrap.appendChild(divider);

    var header = document.createElement('div');
    header.className = 'indicator-pane-header';
    header.textContent = paneId;
    wrap.appendChild(header);

    var chartWrap = document.createElement('div');
    chartWrap.className = 'indicator-pane-chart';
    chartWrap.style.flex = '1';
    wrap.appendChild(chartWrap);

    var dividerHeight = 6;
    var headerHeight = 24;
    var chartHeight = heightPx - headerHeight - dividerHeight;
    var currentTheme = document.body.classList.contains('light') ? false : true;
    var lwChart = LightweightCharts.createChart(chartWrap, {
      width: chartWrap.clientWidth || 300,
      height: chartHeight,
      layout: {
        background: { type: 'solid', color: currentTheme ? '#000000' : '#f5f7fb' },
        textColor: currentTheme ? '#d1d4dc' : '#111827',
      },
      grid: {
        vertLines: { color: currentTheme ? '#1f2937' : '#e5e7eb' },
        horzLines: { color: currentTheme ? '#1f2937' : '#e5e7eb' },
      },
      rightPriceScale: { borderColor: currentTheme ? '#2a2e39' : '#d1d5db' },
      timeScale: { visible: false },
      crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
    });

    mainChart.timeScale().subscribeVisibleLogicalRangeChange(function (range) {
      if (range) lwChart.timeScale().setVisibleLogicalRange(range);
    });

    startResizeDrag(divider, wrap, lwChart, heightPx);

    panes[paneId] = { chart: lwChart, container: wrap, chartWrap: chartWrap, series: {}, height: heightPx, divider: divider };
    window._indicatorPanes = window._indicatorPanes || {};
    window._indicatorPanes[paneId] = panes[paneId];

    syncTimeScaleVisiblity();

    return panes[paneId];
  }

  function startResizeDrag(handle, wrap, chart, initialHeight) {
    var headerHeight = 24;
    var dividerHeight = 6;
    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      var startY = e.clientY;
      var startH = wrap.offsetHeight || initialHeight;

      function onMouseMove(ev) {
        var delta = startY - ev.clientY;
        var newH = Math.max(60, startH + delta);
        wrap.style.height = newH + 'px';
        wrap.style.minHeight = newH + 'px';
        chart.applyOptions({ height: newH - headerHeight - dividerHeight });
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    });
  }

  function syncTimeScaleVisiblity() {
    var ids = Object.keys(panes);
    var mainTimeScale = mainChart ? mainChart.timeScale() : null;
    if (mainTimeScale) mainTimeScale.applyOptions({ visible: ids.length === 0 });
    for (var i = 0; i < ids.length; i++) {
      var p = panes[ids[i]];
      if (p && p.chart) {
        p.chart.timeScale().applyOptions({ visible: i === ids.length - 1 });
      }
    }
  }

  function getOrCreatePane(paneId) {
    if (panes[paneId]) return panes[paneId];
    return createPane(paneId);
  }

  function destroyPane(paneId) {
    if (paneId.charAt(0) === '_') return;
    var pane = panes[paneId];
    if (!pane) return;
    try { pane.chart.remove(); } catch (e) {}
    if (pane.container && pane.container.parentNode) {
      pane.container.parentNode.removeChild(pane.container);
    }
    delete panes[paneId];
    syncTimeScaleVisiblity();
  }

  function destroyAll() {
    var ids = Object.keys(panes);
    for (var i = 0; i < ids.length; i++) {
      if (ids[i].charAt(0) !== '_') destroyPane(ids[i]);
    }
  }

  function resizeAll() {
    var ids = Object.keys(panes);
    for (var i = 0; i < ids.length; i++) {
      var p = panes[ids[i]];
      if (p && p.chart && p.chartWrap) {
        p.chart.applyOptions({ width: p.chartWrap.clientWidth });
      }
    }
  }

  function applyThemeToAll(dark) {
    var ids = Object.keys(panes);
    for (var i = 0; i < ids.length; i++) {
      var p = panes[ids[i]];
      if (p && p.chart) {
        p.chart.applyOptions({
          layout: {
            background: { type: 'solid', color: dark ? '#000000' : '#f5f7fb' },
            textColor: dark ? '#d1d4dc' : '#111827',
          },
          grid: {
            vertLines: { color: dark ? '#1f2937' : '#e5e7eb' },
            horzLines: { color: dark ? '#1f2937' : '#e5e7eb' },
          },
          rightPriceScale: { borderColor: dark ? '#2a2e39' : '#d1d5db' },
        });
      }
    }
  }

  return {
    init: init,
    createPane: createPane,
    getOrCreatePane: getOrCreatePane,
    destroyPane: destroyPane,
    destroyAll: destroyAll,
    resizeAll: resizeAll,
    applyThemeToAll: applyThemeToAll,
    panes: panes,
  };
})();

window.TFIndicatorPanes = TFIndicatorPanes;