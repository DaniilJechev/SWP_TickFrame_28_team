var DrawingState = (function () {
  var _state = {
    selectedId: null,
    selectedDrawing: null,
    drawingCount: 0,
    symbol: null,
  };

  function get(key) { return _state[key]; }
  function getAll() { return _state; }

  function set(key, value) {
    var prev = _state[key];
    if (prev === value) return;
    _state[key] = value;
    DrawingEvents.emit('state:' + key, { key: key, value: value, prev: prev });
    DrawingEvents.emit('state:changed', { key: key, value: value, prev: prev });
  }

  function setSelected(drawing) {
    set('selectedDrawing', drawing);
    set('selectedId', drawing ? drawing.id : null);
  }

  function setDrawingCount(n) {
    set('drawingCount', n);
  }

  function reset() {
    _state.selectedId = null;
    _state.selectedDrawing = null;
    _state.drawingCount = 0;
  }

  return {
    get: get,
    getAll: getAll,
    set: set,
    setSelected: setSelected,
    setDrawingCount: setDrawingCount,
    reset: reset,
  };
})();
