var TFIndicatorChips = (function () {
  var containerEl = null;
  var unsub = null;
  var volumeToggleEl = null;
  var chipsWrap = null;

  function init() {
    containerEl = document.getElementById('indicatorChips');
    if (!containerEl) return;

    containerEl.innerHTML = '';
    containerEl.style.display = 'flex';

    volumeToggleEl = document.createElement('button');
    volumeToggleEl.className = 'volume-toggle-chip';
    volumeToggleEl.innerHTML = '<span class="vt-check"></span> Volume';
    volumeToggleEl.title = 'Toggle volume pane';
    volumeToggleEl.onclick = function () { TFIndicatorState.toggleVolume(); };
    containerEl.appendChild(volumeToggleEl);

    chipsWrap = document.createElement('div');
    chipsWrap.className = 'chips-inner-wrap';
    containerEl.appendChild(chipsWrap);

    unsub = TFIndicatorState.subscribe(render);
    render();
  }

  function render() {
    if (!containerEl) return;
    var state = TFIndicatorState.getState();

    volumeToggleEl.classList.toggle('active', state.volumeEnabled);
    var check = volumeToggleEl.querySelector('.vt-check');
    if (check) check.textContent = state.volumeEnabled ? '\u2713' : '';

    var applied = state.applied;
    chipsWrap.innerHTML = '';
    for (var i = 0; i < applied.length; i++) {
      var entry = applied[i];
      var chip = document.createElement('div');
      chip.className = 'indicator-chip';

      var label = document.createElement('span');
      label.className = 'indicator-chip-label';
      label.textContent = entry.title;
      chip.appendChild(label);

      var removeBtn = document.createElement('button');
      removeBtn.className = 'indicator-chip-remove';
      removeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      removeBtn.title = 'Remove indicator';
      removeBtn.onclick = function (uid) { return function () { TFIndicatorController.removeIndicator(uid); }; }(entry.uid);
      chip.appendChild(removeBtn);

      chipsWrap.appendChild(chip);
    }
  }

  function destroy() {
    if (unsub) { unsub(); unsub = null; }
  }

  return { init: init, destroy: destroy };
})();

window.TFIndicatorChips = TFIndicatorChips;