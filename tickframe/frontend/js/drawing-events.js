var DrawingEvents = (function () {
  var _target = new EventTarget();
  var _listeners = {};

  function on(event, fn) {
    var wrapped = function (e) { fn(e.detail); };
    _target.addEventListener(event, wrapped);
    (_listeners[event] = _listeners[event] || []).push({ fn: fn, wrapped: wrapped });
    return function () { off(event, fn); };
  }

  function off(event, fn) {
    var arr = _listeners[event];
    if (!arr) return;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].fn === fn) {
        _target.removeEventListener(event, arr[i].wrapped);
        arr.splice(i, 1);
        return;
      }
    }
  }

  function emit(event, detail) {
    try {
      _target.dispatchEvent(new CustomEvent(event, { detail: detail }));
    } catch (e) {
      console.error('DrawingEvents.emit error:', event, e);
    }
  }

  return { on: on, off: off, emit: emit };
})();
