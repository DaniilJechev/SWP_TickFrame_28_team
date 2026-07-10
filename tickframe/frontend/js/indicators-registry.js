var TFIndicators = (function () {
  var registry = [];

  function init() {
    registry = (window.LCIndicators && window.LCIndicators.indicatorRegistry) || [];
  }

  function all() { return registry; }

  function search(query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) return registry;
    return registry.filter(function (ind) {
      var name = ind.name || '';
      var id = ind.id || '';
      var shortName = ind.shortName || '';
      return name.toLowerCase().indexOf(q) !== -1 || id.toLowerCase().indexOf(q) !== -1 || shortName.toLowerCase().indexOf(q) !== -1;
    });
  }

  var GROUP_LABELS = {
    standard: 'Standard',
    candlestickPatterns: 'Candlestick Patterns',
    community: 'Community',
  };

  function byGroup() {
    var groups = { standard: [], candlestickPatterns: [], community: [] };
    for (var i = 0; i < registry.length; i++) {
      var ind = registry[i];
      if (ind.group === 'standard' || ind.group === 'candlestickPatterns' || ind.group === 'community') {
        groups[ind.group].push(ind);
      } else {
        groups.community.push(ind);
      }
    }
    return groups;
  }

  function get(id) {
    for (var i = 0; i < registry.length; i++) {
      if (registry[i].id === id) return registry[i];
    }
    return null;
  }

  init();
  return { all: all, search: search, byGroup: byGroup, get: get, GROUP_LABELS: GROUP_LABELS };
})();

window.TFIndicators = TFIndicators;