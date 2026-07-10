var TFIndicatorState = (function () {
  var state = {
    applied: [],
    searchQuery: '',
    expandedGroups: { standard: true, candlestickPatterns: false, community: false },
    indicatorsPanelVisible: false,
    volumeEnabled: true,
  };
  var listeners = [];

  function emit() {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](getState());
    }
  }

  function getState() {
    return {
      applied: state.applied.slice(),
      searchQuery: state.searchQuery,
      expandedGroups: Object.assign({}, state.expandedGroups),
      indicatorsPanelVisible: state.indicatorsPanelVisible,
      volumeEnabled: state.volumeEnabled,
    };
  }

  function addIndicator(entry) {
    state.applied.push(entry);
    emit();
  }

  function removeIndicator(uid) {
    var idx = -1;
    for (var i = 0; i < state.applied.length; i++) {
      if (state.applied[i].uid === uid) { idx = i; break; }
    }
    if (idx !== -1) {
      state.applied.splice(idx, 1);
      emit();
    }
  }

  function updateIndicator(uid, patch) {
    for (var i = 0; i < state.applied.length; i++) {
      if (state.applied[i].uid === uid) {
        Object.assign(state.applied[i], patch);
        emit();
        return;
      }
    }
  }

  function setSearchQuery(q) {
    state.searchQuery = q;
    emit();
  }

  function toggleGroup(g) {
    if (state.expandedGroups.hasOwnProperty(g)) {
      state.expandedGroups[g] = !state.expandedGroups[g];
      emit();
    }
  }

  function togglePanel() {
    state.indicatorsPanelVisible = !state.indicatorsPanelVisible;
    emit();
  }

  function toggleVolume() {
    state.volumeEnabled = !state.volumeEnabled;
    emit();
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function () {
      var idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function getApplied() { return state.applied; }
  function setApplied(list) { state.applied = list; emit(); }

  return {
    addIndicator: addIndicator,
    removeIndicator: removeIndicator,
    updateIndicator: updateIndicator,
    setSearchQuery: setSearchQuery,
    toggleGroup: toggleGroup,
    togglePanel: togglePanel,
    toggleVolume: toggleVolume,
    subscribe: subscribe,
    getApplied: getApplied,
    setApplied: setApplied,
    getState: getState,
    state: state,
  };
})();

window.TFIndicatorState = TFIndicatorState;