(function () {
  'use strict';

  let chart = null;
  let mainSeries = null;
  let chartData = [];

  function _priceFormatForData(data) {
    if (!data || !data.length) return { type: 'price', precision: 4, minMove: 0.0001 };
    var min = Infinity, max = -Infinity;
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var lo = d.low !== undefined ? d.low : d.value;
      var hi = d.high !== undefined ? d.high : d.value;
      if (lo < min) min = lo;
      if (hi > max) max = hi;
    }
    var avg = (min + max) / 2;
    if (avg < 0.01) return { type: 'price', precision: 6, minMove: 0.000001 };
    if (avg < 0.1) return { type: 'price', precision: 5, minMove: 0.00001 };
    if (avg < 1) return { type: 'price', precision: 4, minMove: 0.0001 };
    if (avg < 10) return { type: 'price', precision: 3, minMove: 0.001 };
    if (avg < 100) return { type: 'price', precision: 2, minMove: 0.01 };
    if (avg < 1000) return { type: 'price', precision: 1, minMove: 0.1 };
    return { type: 'price', precision: 0, minMove: 1 };
  }

  function init(c, s, data) {
    chart = c;
    mainSeries = s;
    chartData = data || [];
  }

  function setChart(c) { chart = c; }
  function setSeries(s) { mainSeries = s; }
  function setData(d) { chartData = d || []; }

  function switchChartType(type) {
    if (!chart || !chartData.length) return;

    var newSeries;
    var data = chartData;

    try {
      if (mainSeries && chart.removeSeries) {
        chart.removeSeries(mainSeries);
      }
    } catch (_) {}

    var pf = _priceFormatForData(data);
    if (type === 'candlestick') {
      newSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
        upColor: '#26a69a', downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        priceFormat: pf,
      });
      newSeries.setData(data);
    } else if (type === 'line') {
      newSeries = chart.addSeries(LightweightCharts.LineSeries, {
        color: '#2962ff', lineWidth: 2,
        lastValueVisible: true, priceLineVisible: true,
        priceFormat: pf,
      });
      newSeries.setData(data.map(function (c) { return { time: c.time, value: c.close }; }));
    } else if (type === 'area') {
      newSeries = chart.addSeries(LightweightCharts.AreaSeries, {
        lineColor: '#2962ff', lineWidth: 2,
        topColor: 'rgba(41,98,255,0.3)',
        bottomColor: 'rgba(41,98,255,0.05)',
        lastValueVisible: true, priceLineVisible: true,
        priceFormat: pf,
      });
      newSeries.setData(data.map(function (c) { return { time: c.time, value: c.close }; }));
    }

    mainSeries = newSeries;
    window.candleSeries = newSeries;
    window.mainSeries = newSeries;

    if (window.DrawingOverlay) {
      window.DrawingOverlay.setSeries(newSeries);
    }
  }

  function fitContent() {
    if (chart) chart.timeScale().fitContent();
  }

  function clearAll() {
    if (window.DrawingOverlay) window.DrawingOverlay.clearAll();
  }

  function undo() {
    if (window.DrawingOverlay) window.DrawingOverlay.undo();
  }

  window.LightweightToolbar = {
    init: init,
    setChart: setChart,
    setSeries: setSeries,
    setData: setData,
    switchChartType: switchChartType,
    fitContent: fitContent,
    clearAll: clearAll,
    undo: undo,
  };
})();
