var _initialized = false;
var _controllerInitUnsub = null;

function _onKeyDown(e) {
  if (!DrawingController.getManager()) return;

  var tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

  if (e.key === 'Escape') {
    DrawingController.activateTool(null);
    e.preventDefault();
    return;
  }

  if (e.key === 'Delete') {
    DrawingController.deleteSelection();
    e.preventDefault();
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault();
    return;
  }
}

function init(chart, candleSeries, container) {
  if (!window.DrawingLib) { console.warn('DrawingLib not loaded'); return; }
  console.log('TFDraw.init called');

  if (_initialized) teardown();

  var toolbarReady = false;
  if (_controllerInitUnsub) _controllerInitUnsub();
  _controllerInitUnsub = DrawingEvents.on('controller:init', function () {
    console.log('TFDraw: controller:init received, toolbarReady=' + toolbarReady);
    if (!toolbarReady) {
      DrawingToolbar.init();
      DrawingProperties.init();
      toolbarReady = true;
    }
  });

  DrawingController.init(chart, candleSeries, container);

  document.addEventListener('keydown', _onKeyDown);
  _initialized = true;
  console.log('TFDraw.init complete, _initialized=' + _initialized);
}

function teardown() {
  DrawingController.teardown();
  document.removeEventListener('keydown', _onKeyDown);
  if (_controllerInitUnsub) { _controllerInitUnsub(); _controllerInitUnsub = null; }
  _initialized = false;
}

function setSymbol(symbol) {
  DrawingController.setSymbol(symbol);
}

function redraw() {
  DrawingController.redraw();
}

document.addEventListener('DOMContentLoaded', function () {
  if (typeof TradingView !== 'undefined') return;
  var toolbarEl = document.getElementById('drawingToolbar');
  if (toolbarEl && !_initialized) {
    console.warn('TFDraw fallback: initializing toolbar without controller!');
    DrawingToolbar.init();
    DrawingProperties.init();
  }
});

window.TFDraw = {
  init: init,
  teardown: teardown,
  setSymbol: setSymbol,
  redraw: redraw,
};
