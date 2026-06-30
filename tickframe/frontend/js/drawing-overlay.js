(function () {
  'use strict';

  var TOOLS = {
    redact:     { name: 'Select / Edit',   icon: 'pointer',   points: 0, group: 'select' },
    trendline:  { name: 'Trend Line',     icon: 'trend',     points: 2, group: 'line' },
    hline:      { name: 'Horizontal Line', icon: 'hline',     points: 1, group: 'line' },
    vline:      { name: 'Vertical Line',   icon: 'vline',     points: 1, group: 'line' },
    ray:        { name: 'Ray',             icon: 'ray',       points: 2, group: 'line' },
    crossline:  { name: 'Cross Line',      icon: 'cross',     points: 1, group: 'line' },
    fib:        { name: 'Fibonacci',       icon: 'fib',       points: 2, group: 'measure' },
    pricerange_pct: { name: 'Price Range %', icon: 'rangepct',  points: 2, group: 'measure' },
    rectangle:  { name: 'Rectangle',       icon: 'rect',      points: 2, group: 'shape' },
    circle:     { name: 'Circle',          icon: 'circle',    points: 2, group: 'shape' },
    arrow:      { name: 'Arrow',           icon: 'arrow',     points: 2, group: 'shape' },

    brush:      { name: 'Brush',           icon: 'brush',     points: 0, group: 'shape', drag: true },
  };

  var ICONS = {
    pointer:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2v14l3-3.5 4 5 2-1-4-5.5 5-1.5z"/></svg>',
    trend: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="16" x2="17" y2="4"/><circle cx="3" cy="16" r="1.5" fill="currentColor"/><circle cx="17" cy="4" r="1.5" fill="currentColor"/></svg>',
    hline: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="2" y1="10" x2="18" y2="10"/></svg>',
    vline: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="10" y1="2" x2="10" y2="18"/></svg>',
    ray:   '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="16" x2="18" y2="4"/><circle cx="4" cy="16" r="1.5" fill="currentColor"/></svg>',
    cross: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="2" y1="10" x2="18" y2="10"/><line x1="10" y1="2" x2="10" y2="18"/></svg>',
    fib:   '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="4" y1="4" x2="4" y2="16" stroke-width="2"/><line x1="4" y1="5" x2="16" y2="5"/><line x1="4" y1="8" x2="14" y2="8"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="15" x2="16" y2="15"/></svg>',
    range:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="4" x2="16" y2="4"/><line x1="4" y1="16" x2="16" y2="16"/><line x1="4" y1="4" x2="4" y2="16" stroke-dasharray="2"/></svg>',
    rangepct:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="14" height="14" rx="1.5"/><text x="10" y="14" text-anchor="middle" font-size="9" fill="currentColor">%</text></svg>',
    rect: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="14" height="12" rx="1"/></svg>',
    circle:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10" cy="10" r="8"/></svg>',
    arrow:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="16" x2="16" y2="4"/><polyline points="10,4 16,4 16,10" fill="none" stroke="currentColor"/></svg>',
    text: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><text x="10" y="15" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor">T</text></svg>',
    brush:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 14c-1.5 1-2.5 3-2 4 .5 1 3 1.5 4 0l9-9c1-1 1-3 0-4s-3-1-4 0l-7 9z"/><line x1="12" y1="5" x2="15" y2="8"/></svg>',
  };

  var GROUPS = [
    { id: 'line',    label: 'Lines' },
    { id: 'measure', label: 'Measure' },
    { id: 'shape',   label: 'Shapes' },
  ];

  var LINE_STYLE_ICONS = {
    solid: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="10" x2="18" y2="10"/></svg>',
    dashed: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="10" x2="18" y2="10" stroke-dasharray="6,4"/></svg>',
    dotted: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3"><line x1="3" y1="10" x2="17" y2="10" stroke-dasharray="1,5" stroke-linecap="round"/></svg>',
  };

  var WIDTH_ICONS = {
    1: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1"><line x1="2" y1="10" x2="18" y2="10"/></svg>',
    2: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="10" x2="18" y2="10"/></svg>',
    3: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3"><line x1="2" y1="10" x2="18" y2="10"/></svg>',
    4: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="4.5"><line x1="2" y1="10" x2="18" y2="10"/></svg>',
  };

  var LINE_STYLES = {
    solid: [],
    dashed: [8, 4],
    dotted: [3, 5],
  };

  var DEFAULTS = {
    color: '#2962ff',
    width: 2,
    opacity: 0.85,
    fill: 'rgba(41,98,255,0.1)',
    lineStyle: 'solid',
    fontSize: 14,
  };

  var FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];

  function selClr() {
    return document.body.classList.contains('light') ? '#000' : '#fff';
  }

  /* ----------------------------------------------- */
  /*  Text input modal (replaces browser prompt)      */
  /* ----------------------------------------------- */
  var textModal = null;
  var textModalResolve = null;


  function ensureTextModal() {
    if (textModal) return;
    textModal = document.createElement('div');
    textModal.id = 'text-input-modal';
    textModal.style.cssText = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1d23;border:1px solid #2a2e39;border-radius:8px;padding:16px;z-index:10000;min-width:280px;box-shadow:0 8px 32px rgba(0,0,0,0.5);';
    textModal.innerHTML =
      '<div style="margin-bottom:10px;color:#d1d4dc;font:13px Inter,sans-serif;">Enter text:</div>' +
      '<input id="text-input-field" type="text" style="width:100%;padding:8px 10px;border:1px solid #2a2e39;border-radius:4px;background:#131518;color:#d1d4dc;font:13px Inter,sans-serif;box-sizing:border-box;outline:none;">' +
      '<div style="margin-top:12px;text-align:right;">' +
      '<button id="text-input-cancel" style="padding:6px 14px;border:1px solid #2a2e39;border-radius:4px;background:transparent;color:#d1d4dc;cursor:pointer;margin-right:8px;font:13px Inter,sans-serif;">Cancel</button>' +
      '<button id="text-input-ok" style="padding:6px 14px;border:none;border-radius:4px;background:#2962ff;color:#fff;cursor:pointer;font:13px Inter,sans-serif;">OK</button></div>';
    document.body.appendChild(textModal);

    document.getElementById('text-input-ok').addEventListener('click', function () {
      var val = document.getElementById('text-input-field').value;
      textModal.style.display = 'none';
      if (textModalResolve) textModalResolve(val);
    });

    document.getElementById('text-input-cancel').addEventListener('click', function () {
      textModal.style.display = 'none';
      if (textModalResolve) textModalResolve(null);
    });

    textModal.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        document.getElementById('text-input-ok').click();
      } else if (e.key === 'Escape') {
        document.getElementById('text-input-cancel').click();
      }
    });
  }

  function showTextModal() {
    ensureTextModal();
    var field = document.getElementById('text-input-field');
    field.value = 'Text';
    textModal.style.display = 'block';
    field.focus();
    field.select();
    return new Promise(function (resolve) {
      textModalResolve = resolve;
    });
  }

  var nextId = 1;

  /* ----------------------------------------------- */
  /*  Drawing store                                   */
  /* ----------------------------------------------- */
  function makeDrawing(type, points, opts) {
    return {
      id: nextId++,
      type: type,
      points: points.map(function (p) { return { time: p.time, price: p.price }; }),
      opts: Object.assign({}, DEFAULTS, opts),
    };
  }

  /* ----------------------------------------------- */
  /*  Coordinate helpers                              */
  /* ----------------------------------------------- */
  function d2s(chart, series, t, p) {
    var x = chart.timeScale().timeToCoordinate(t);
    var y = series.priceToCoordinate(p);
    if (x == null || y == null) return null;
    return { x: x, y: y };
  }

  function s2d(chart, series, x, y) {
    return {
      time: chart.timeScale().coordinateToTime(x),
      price: series.coordinateToPrice(y),
    };
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  /* ----------------------------------------------- */
  /*  Renderers per tool type                        */
  /* ----------------------------------------------- */
  var R = {};

  function renderLine(ctx, p1, p2, opts, selected) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = opts.color;
    ctx.lineWidth = opts.width;
    ctx.globalAlpha = opts.opacity;
    ctx.setLineDash(LINE_STYLES[opts.lineStyle] || []);
    ctx.stroke();
    ctx.setLineDash([]);
    if (selected) {
      ctx.strokeStyle = selClr();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  }

  function renderEndpoints(ctx, pts, opts) {
    pts.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = opts.color;
      ctx.fill();
      ctx.strokeStyle = selClr();
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  R.trendline = function (ctx, d, chart, series) {
    var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
    var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
    if (!p1 || !p2) return;
    renderLine(ctx, p1, p2, d.opts, d.selected);
    if (d.selected) renderEndpoints(ctx, [p1, p2], d.opts);
  };

  function applyLineStyle(ctx, opts) {
    ctx.setLineDash(LINE_STYLES[opts.lineStyle] || []);
  }

  R.hline = function (ctx, d, chart, series) {
    var rect = ctx.canvas.getBoundingClientRect();
    var p = d2s(chart, series, d.points[0].time, d.points[0].price);
    if (!p) return;
    ctx.beginPath();
    ctx.moveTo(0, p.y);
    ctx.lineTo(rect.width, p.y);
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.globalAlpha = d.opts.opacity;
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.setLineDash([]);
    if (d.selected) {
      ctx.strokeStyle = selClr();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  };

  R.vline = function (ctx, d, chart, series) {
    var rect = ctx.canvas.getBoundingClientRect();
    var p = d2s(chart, series, d.points[0].time, d.points[0].price);
    if (!p) return;
    ctx.beginPath();
    ctx.moveTo(p.x, 0);
    ctx.lineTo(p.x, rect.height);
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.globalAlpha = d.opts.opacity;
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.setLineDash([]);
    if (d.selected) {
      ctx.strokeStyle = selClr();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  };

  R.ray = function (ctx, d, chart, series) {
    var rect = ctx.canvas.getBoundingClientRect();
    var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
    var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
    if (!p1 || !p2) return;
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    if (dx === 0 && dy === 0) return;
    var t;
    if (dx === 0) {
      t = (dy > 0 ? rect.height : 0) - p1.y / dy;
    } else {
      var tx = (dx > 0 ? rect.width : 0) - p1.x / dx;
      var ty = (dy > 0 ? rect.height : 0) - p1.y / dy;
      t = dx > 0 ? Math.max(tx, ty >= 0 ? ty : -1) : Math.min(tx, ty >= 0 ? ty : 1e9);
      if (p2.x <= p1.x) { t = Math.min(tx, ty >= 0 ? ty : 1e9); }
    }
    var ex = p1.x + dx * t;
    var ey = p1.y + dy * t;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.globalAlpha = d.opts.opacity;
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.setLineDash([]);
    if (d.selected) {
      ctx.strokeStyle = selClr();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
    if (d.selected) renderEndpoints(ctx, [p1], d.opts);
  };

  R.crossline = function (ctx, d, chart, series) {
    var rect = ctx.canvas.getBoundingClientRect();
    var p = d2s(chart, series, d.points[0].time, d.points[0].price);
    if (!p) return;
    ctx.beginPath();
    ctx.moveTo(0, p.y);
    ctx.lineTo(rect.width, p.y);
    ctx.moveTo(p.x, 0);
    ctx.lineTo(p.x, rect.height);
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.globalAlpha = d.opts.opacity;
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.setLineDash([]);
    if (d.selected) {
      ctx.strokeStyle = selClr();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
    if (d.selected) renderEndpoints(ctx, [p], d.opts);
  };

  R.fib = function (ctx, d, chart, series) {
    if (d.points.length < 2) return;
    var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
    var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
    if (!p1 || !p2) return;
    var yTop = Math.min(p1.y, p2.y);
    var yBot = Math.max(p1.y, p2.y);
    var range = yBot - yTop;
    var left = Math.min(p1.x, p2.x);
    var right = Math.max(p1.x, p2.x);
    var pr = d.opts;
    var ls = LINE_STYLES[pr.lineStyle] || [];
    FIB_LEVELS.forEach(function (level, i) {
      var y = yBot - range * level;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.strokeStyle = pr.color;
      ctx.lineWidth = i === 0 || i === FIB_LEVELS.length - 1 ? pr.width + 1 : pr.width - 0.5;
      ctx.globalAlpha = pr.opacity * (0.5 + 0.5 * (1 - Math.abs(level - 0.5) / 0.5));
      ctx.setLineDash(ls);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      var label = level === 0 ? '0.0' : level === 1.0 ? '1.0' : level.toFixed(3);
      ctx.fillStyle = pr.color;
      ctx.font = '11px Inter,sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, right + 6, y + 4);
    });
    if (d.selected) {
      FIB_LEVELS.forEach(function (level) {
        var y = yBot - range * level;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.strokeStyle = selClr();
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      renderEndpoints(ctx, [p1, p2], pr);
    }
    ctx.globalAlpha = 1;
  };

  R.pricerange_pct = function (ctx, d, chart, series) {
    if (d.points.length < 2) return;
    var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
    var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
    if (!p1 || !p2) return;
    var x = Math.min(p1.x, p2.x);
    var y = Math.min(p1.y, p2.y);
    var w = Math.abs(p2.x - p1.x);
    var h = Math.abs(p2.y - p1.y);
    ctx.fillStyle = d.opts.fill;
    ctx.fillRect(x, y, w, h);
    // Draw only top and bottom edges (no vertical sides)
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.globalAlpha = d.opts.opacity;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    var goesUp = d.points[1].price > d.points[0].price;
    var cx = x + w / 2;
    var arrowTop = y + 8;
    var arrowBot = y + h - 8;
    var arrowSize = 6;
    if (h > 24) {
      ctx.beginPath();
      ctx.moveTo(cx, goesUp ? arrowTop + arrowSize + 2 : arrowTop);
      ctx.lineTo(cx, goesUp ? arrowBot : arrowBot - arrowSize - 2);
      ctx.strokeStyle = d.opts.color;
      ctx.lineWidth = Math.max(1, d.opts.width * 0.6);
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      if (goesUp) {
        ctx.moveTo(cx, arrowTop);
        ctx.lineTo(cx - arrowSize, arrowTop + arrowSize + 2);
        ctx.lineTo(cx + arrowSize, arrowTop + arrowSize + 2);
      } else {
        ctx.moveTo(cx, arrowBot);
        ctx.lineTo(cx - arrowSize, arrowBot - arrowSize - 2);
        ctx.lineTo(cx + arrowSize, arrowBot - arrowSize - 2);
      }
      ctx.closePath();
      ctx.fillStyle = d.opts.color;
      ctx.fill();
    }
    var pctChange = ((d.points[1].price - d.points[0].price) / d.points[0].price) * 100;
    var label = (pctChange >= 0 ? '+' : '') + pctChange.toFixed(2) + '%';
    ctx.fillStyle = d.opts.color;
    ctx.font = 'bold 12px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, cx, y + h / 2);
    if (d.selected) {
      renderEndpoints(ctx, [p1, p2], d.opts);
      ctx.strokeStyle = selClr();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.rect(x - 2, y - 2, w + 4, h + 4);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  R.rectangle = function (ctx, d, chart, series) {
    if (d.points.length < 2) return;
    var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
    var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
    if (!p1 || !p2) return;
    var x = Math.min(p1.x, p2.x);
    var y = Math.min(p1.y, p2.y);
    var w = Math.abs(p2.x - p1.x);
    var h = Math.abs(p2.y - p1.y);
    ctx.fillStyle = d.opts.fill;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.globalAlpha = d.opts.opacity;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    if (d.selected) renderEndpoints(ctx, [p1, p2], d.opts);
  };

  R.circle = function (ctx, d, chart, series) {
    if (d.points.length < 2) return;
    var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
    var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
    if (!p1 || !p2) return;
    var r = dist(p1.x, p1.y, p2.x, p2.y);
    ctx.fillStyle = d.opts.fill;
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.globalAlpha = d.opts.opacity;
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, r, 0, Math.PI * 2);
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    if (d.selected) renderEndpoints(ctx, [p1, p2], d.opts);
  };

  R.arrow = function (ctx, d, chart, series) {
    if (d.points.length < 2) return;
    var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
    var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
    if (!p1 || !p2) return;
    var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    var headLen = 10 + d.opts.width * 2;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.globalAlpha = d.opts.opacity;
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x - headLen * Math.cos(angle - 0.4), p2.y - headLen * Math.sin(angle - 0.4));
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x - headLen * Math.cos(angle + 0.4), p2.y - headLen * Math.sin(angle + 0.4));
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width;
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (d.selected) renderEndpoints(ctx, [p1, p2], d.opts);
  };

  R.text = function (ctx, d, chart, series) {
    if (d.points.length < 1) return;
    var p = d2s(chart, series, d.points[0].time, d.points[0].price);
    if (!p) return;
    var fs = d.opts.fontSize || 14;
    ctx.fillStyle = d.opts.color;
    ctx.font = 'bold ' + fs + 'px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    var label = d.opts.label || 'Text';
    ctx.fillText(label, p.x, p.y - 6);
    if (d.selected) {
      var m = ctx.measureText(label);
      ctx.strokeStyle = selClr();
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(p.x - m.width / 2 - 3, p.y - fs - 8, m.width + 6, fs + 6);
      ctx.setLineDash([]);
    }
  };

  R.brush = function (ctx, d, chart, series) {
    if (!d.points || d.points.length < 2) return;
    var pts = [];
    for (var i = 0; i < d.points.length; i++) {
      var sp = d2s(chart, series, d.points[i].time, d.points[i].price);
      if (sp) pts.push(sp);
    }
    if (pts.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var j = 1; j < pts.length; j++) {
      ctx.lineTo(pts[j].x, pts[j].y);
    }
    ctx.strokeStyle = d.opts.color;
    ctx.lineWidth = d.opts.width + 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = d.opts.opacity;
    applyLineStyle(ctx, d.opts);
    ctx.stroke();
    ctx.restore();
  };

  /* ----------------------------------------------- */
  /*  Hit testing                                     */
  /* ----------------------------------------------- */
  function hitTestDrawing(d, mx, my, chart, series) {
    var tol = 8 + (d.opts.width || 2);
    if (d.type === 'hline') {
      var r = chart.timeScale().timeToCoordinate(d.points[0].time);
      var p = d2s(chart, series, d.points[0].time, d.points[0].price);
      if (!p) return false;
      return Math.abs(my - p.y) < tol;
    }
    if (d.type === 'vline') {
      var p = d2s(chart, series, d.points[0].time, d.points[0].price);
      if (!p) return false;
      return Math.abs(mx - p.x) < tol;
    }
    if (d.type === 'crossline') {
      var p = d2s(chart, series, d.points[0].time, d.points[0].price);
      if (!p) return false;
      return Math.abs(mx - p.x) < tol || Math.abs(my - p.y) < tol;
    }
    if (d.type === 'trendline' || d.type === 'ray') {
      var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
      var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
      if (!p1 || !p2) return false;
      var dx = p2.x - p1.x, dy = p2.y - p1.y;
      var len = dist(p1.x, p1.y, p2.x, p2.y);
      if (len < 1) return dist(mx, my, p1.x, p1.y) < tol;
      var t = ((mx - p1.x) * dx + (my - p1.y) * dy) / (len * len);
      if (d.type === 'ray' && t < 0) t = 0;
      if (d.type === 'trendline' && (t < 0 || t > 1)) t = Math.max(0, Math.min(1, t));
      var cx = p1.x + t * dx, cy = p1.y + t * dy;
      return dist(mx, my, cx, cy) < tol;
    }
    if (d.type === 'rectangle') {
      var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
      var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
      if (!p1 || !p2) return false;
      var l = Math.min(p1.x, p2.x) - tol;
      var r = Math.max(p1.x, p2.x) + tol;
      var t = Math.min(p1.y, p2.y) - tol;
      var b = Math.max(p1.y, p2.y) + tol;
      return mx >= l && mx <= r && my >= t && my <= b;
    }
    if (d.type === 'circle') {
      var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
      var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
      if (!p1 || !p2) return false;
      var r = dist(p1.x, p1.y, p2.x, p2.y);
      return Math.abs(dist(mx, my, p1.x, p1.y) - r) < tol;
    }
    if (d.type === 'arrow') {
      var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
      var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
      if (!p1 || !p2) return false;
      var dx = p2.x - p1.x, dy = p2.y - p1.y;
      var len = dist(p1.x, p1.y, p2.x, p2.y);
      if (len < 1) return dist(mx, my, p1.x, p1.y) < tol;
      var t = ((mx - p1.x) * dx + (my - p1.y) * dy) / (len * len);
      t = Math.max(0, Math.min(1, t));
      var cx = p1.x + t * dx, cy = p1.y + t * dy;
      return dist(mx, my, cx, cy) < tol;
    }
    if (d.type === 'fib') {
      var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
      var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
      if (!p1 || !p2) return false;
      var yTop = Math.min(p1.y, p2.y), yBot = Math.max(p1.y, p2.y);
      var range = yBot - yTop;
      var left = Math.min(p1.x, p2.x), right = Math.max(p1.x, p2.x);
      for (var i = 0; i < FIB_LEVELS.length; i++) {
        var yy = yBot - range * FIB_LEVELS[i];
        if (Math.abs(my - yy) < tol && mx >= left - tol && mx <= right + tol) return true;
      }
      return false;
    }
    if (d.type === 'pricerange_pct') {
      var p1 = d2s(chart, series, d.points[0].time, d.points[0].price);
      var p2 = d2s(chart, series, d.points[1].time, d.points[1].price);
      if (!p1 || !p2) return false;
      var l = Math.min(p1.x, p2.x) - tol;
      var r = Math.max(p1.x, p2.x) + tol;
      var t = Math.min(p1.y, p2.y) - tol;
      var b = Math.max(p1.y, p2.y) + tol;
      return mx >= l && mx <= r && my >= t && my <= b;
    }
    if (d.type === 'text') {
      var p = d2s(chart, series, d.points[0].time, d.points[0].price);
      if (!p) return false;
      return dist(mx, my, p.x, p.y) < tol + 4;
    }
    if (d.type === 'brush') {
      for (var i = 1; i < d.points.length; i++) {
        var a = d2s(chart, series, d.points[i - 1].time, d.points[i - 1].price);
        var b = d2s(chart, series, d.points[i].time, d.points[i].price);
        if (!a || !b) continue;
        var segLen = dist(a.x, a.y, b.x, b.y);
        if (segLen < 1) { if (dist(mx, my, a.x, a.y) < tol) return true; continue; }
        var t = ((mx - a.x) * (b.x - a.x) + (my - a.y) * (b.y - a.y)) / (segLen * segLen);
        if (t < 0 || t > 1) continue;
        var cx = a.x + t * (b.x - a.x), cy = a.y + t * (b.y - a.y);
        if (dist(mx, my, cx, cy) < tol) return true;
      }
      return false;
    }
    return false;
  }

  /* ----------------------------------------------- */
  /*  DrawingManager — the core                      */
  /* ----------------------------------------------- */
  function DrawingManager(chart, series, container, symbol) {
    this.chart = chart;
    this.series = series;
    this.container = container;
    this._currentSymbol = symbol || (window.currentSymbol || 'BTCUSDT');
    this.drawings = [];
    this.undoStack = [];
    this.activeTool = null;
    this.toolPhase = 'idle';
    this.tempPoints = [];
    this.selectedId = null;
    this.brushPoints = [];
    this._crosshairPos = null;
    this._dragState = null;
    this._dragCandidate = null;
    this._redactMode = false;
    this._savedCrosshairMode = null;
    this._listeners = [];

    this._setupCanvas();
    this._bindChartEvents();
    this._bindDomEvents();
    this.render();
    var self = this;
    setTimeout(function () { self._initPerDrawingSettings(); }, 0);
    this._loadDrawings();
  }

  DrawingManager.prototype._setupCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'drawingCanvas';
    this.canvas.className = 'drawing-overlay-canvas';
    this.container.appendChild(this.canvas);
    this._resizeCanvas();

    var ro = new ResizeObserver(this._debouncedResize.bind(this));
    ro.observe(this.container);
    this._ro = ro;
  };

  DrawingManager.prototype._resizeCanvas = function () {
    var rect = this.container.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);
  };

  DrawingManager.prototype._debouncedResize = function () {
    var self = this;
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(function () { self._resizeCanvas(); self.render(); }, 50);
  };

  DrawingManager.prototype.resize = function () {
    this._resizeCanvas();
    this.render();
  };

  DrawingManager.prototype.setSeries = function (newSeries) {
    this.series = newSeries;
    this.render();
  };

  DrawingManager.prototype._bindChartEvents = function () {
    var self = this;

    var clickHandler = function (param) {
      if (!param.point) return;
      self._handleClick(param.point.x, param.point.y, param);
    };
    this.chart.subscribeClick(clickHandler);
    this._listeners.push(function () { self.chart.unsubscribeClick(clickHandler); });

    var moveHandler = function (param) {
      if (!param.point) return;
      self._handleMove(param.point.x, param.point.y, param);
    };
    this.chart.subscribeCrosshairMove(moveHandler);
    this._listeners.push(function () { self.chart.unsubscribeCrosshairMove(moveHandler); });
  };

  DrawingManager.prototype._bindDomEvents = function () {
    var self = this;
    var el = this.container;

    var getPos = function (e) {
      var r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    var md = function (e) {
      self.mouseDown = true;
      var pos = getPos(e);
      if (self.activeTool === 'brush') {
        self._brushStart(pos.x, pos.y);
        return;
      }
      if (self.activeTool) return;

      // If clicking on a selected drawing's endpoint → start endpoint drag
      // If clicking on a selected drawing's body → start move drag
      if (self.selectedId != null) {
        var sel = self._getSelectedDrawing();
        if (sel) {
          var ep = self._hitTestEndpoint(sel, pos.x, pos.y);
          if (ep !== -1) {
            self._dragCandidate = { drawing: sel, type: 'endpoint', idx: ep, startX: pos.x, startY: pos.y };
            return;
          }
          if (hitTestDrawing(sel, pos.x, pos.y, self.chart, self.series)) {
            self._dragCandidate = { drawing: sel, type: 'move', startX: pos.x, startY: pos.y };
            return;
          }
        }
      }
    };
    el.addEventListener('mousedown', md);
    this._listeners.push(function () { el.removeEventListener('mousedown', md); });

    var mm = function (e) {
      var pos = getPos(e);
      if (self.activeTool === 'brush') {
        self._brushMove(pos.x, pos.y);
        return;
      }
      if (self._dragState) {
        self._applyDrag(pos.x, pos.y);
        self.render();
        return;
      }
      if (self._dragCandidate) {
        var dx = pos.x - self._dragCandidate.startX;
        var dy = pos.y - self._dragCandidate.startY;
        if (dx * dx + dy * dy > 16) {
          self._dragState = {
            drawing: self._dragCandidate.drawing,
            type: self._dragCandidate.type,
            idx: self._dragCandidate.idx,
            startX: self._dragCandidate.startX,
            startY: self._dragCandidate.startY,
            prevPoints: self._dragCandidate.drawing.points.map(function (p) { return { time: p.time, price: p.price }; }),
          };
          self._dragCandidate = null;
          self.container.style.cursor = 'move';
          self._applyDrag(pos.x, pos.y);
          self.render();
        }
      }
    };
    el.addEventListener('mousemove', mm);
    this._listeners.push(function () { el.removeEventListener('mousemove', mm); });

    var mu = function () {
      self.mouseDown = false;
      if (self.activeTool === 'brush') {
        self._brushEnd();
        return;
      }
      if (self._dragState) {
        self._finalizeDrag();
        self._dragState = null;
        self.container.style.cursor = self._redactMode ? 'default' : '';
        self.render();
      }
      self._dragCandidate = null;
    };
    el.addEventListener('mouseup', mu);
    this._listeners.push(function () { el.removeEventListener('mouseup', mu); });

    var key = function (e) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        self._deleteSelected();
      }
    };
    document.addEventListener('keydown', key);
    this._listeners.push(function () { document.removeEventListener('keydown', key); });
  };

  DrawingManager.prototype.destroy = function () {
    this._listeners.forEach(function (fn) { fn(); });
    this._listeners = [];
    if (this._ro) this._ro.disconnect();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  };

  /* ----------------------------------------------- */
  /*  Tool activation                                 */
  /* ----------------------------------------------- */
  DrawingManager.prototype.activateTool = function (toolId) {
    if (this.activeTool === toolId) {
      this.deactivateTool();
      return;
    }
    // Deactivate previous tool first
    if (this.activeTool) {
      this.activeTool = null;
      this.toolPhase = 'idle';
      this.tempPoints = [];
      this.brushPoints = [];
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.cursor = '';
    }

    this.activeTool = toolId;
    this.toolPhase = 'idle';
    this.tempPoints = [];
    this.brushPoints = [];

    if (toolId === 'redact') {
      this._enterRedactMode();
      this._updateStatus('Click to select and edit drawings');
    } else {
      this.selectedId = null;
      this.drawings.forEach(function (d) { d.selected = false; });
      this._exitRedactMode();
      this._hidePerDrawingSettings();
      this._updateStatus('Click to place point');
      if (TOOLS[toolId].drag) {
        this.canvas.style.pointerEvents = 'auto';
        this.canvas.style.cursor = 'crosshair';
      }
    }
    this.render();
  };

  DrawingManager.prototype.deactivateTool = function () {
    this.activeTool = null;
    this.toolPhase = 'idle';
    this.tempPoints = [];
    this.brushPoints = [];
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.cursor = '';
    this.selectedId = null;
    this.drawings.forEach(function (d) { d.selected = false; });
    this._exitRedactMode();
    this._hidePerDrawingSettings();
    this._updateStatus('Ready');
    this.render();
  };

  DrawingManager.prototype._updateStatus = function (msg) {
    var el = document.getElementById('tb-status');
    if (el) el.textContent = msg;
  };

  /* ----------------------------------------------- */
  /*  Click handling                                  */
  /* ----------------------------------------------- */
  DrawingManager.prototype._handleClick = function (x, y, param) {
    // Redact tool: select / edit drawings
    if (this.activeTool === 'redact') {
      this._handleSelectionClick(x, y);
      return;
    }
    // Cursor mode (no tool active): select or deselect
    if (!this.activeTool) {
      this._handleSelectionClick(x, y);
      return;
    }
    var tool = TOOLS[this.activeTool];
    if (tool.drag) return;

    var data = s2d(this.chart, this.series, x, y);
    if (data.time == null || data.price == null) return;

    if (this.toolPhase === 'idle') {
      this.tempPoints = [data];
      this.toolPhase = this.activeTool === 'text' ? 'label' : 'placing';
      if (this.activeTool !== 'text' && tool.points === 1) {
        this._commitDrawing(this.activeTool, this.tempPoints);
        this._finishDrawing();
      } else {
        this._updateStatus('Click second point');
      }
      this.render();
      return;
    }

    if (this.toolPhase === 'placing') {
      this.tempPoints.push(data);
      if (this.tempPoints.length >= tool.points) {
        this._commitDrawing(this.activeTool, this.tempPoints);
        this._finishDrawing();
      } else {
        this._updateStatus('Click next point');
      }
      this.render();
      return;
    }

    if (this.toolPhase === 'label') {
      if (this.activeTool === 'text') {
        var self = this;
        showTextModal().then(function (label) {
          if (label) {
            self.tempPoints[0].label = label;
            self._commitDrawing('text', self.tempPoints);
          }
          self._finishDrawing();
        });
        return;
      }
      this._finishDrawing();
    }
  };

  DrawingManager.prototype._handleMove = function (x, y, param) {
    this._crosshairPos = { x: x, y: y };
    if (this._dragState) return;
    if (this.activeTool && this.toolPhase === 'placing' && this.tempPoints.length > 0) {
      this.render();
    }
  };

  DrawingManager.prototype._handleSelectionClick = function (x, y) {
    var hitId = null;
    for (var i = this.drawings.length - 1; i >= 0; i--) {
      if (hitTestDrawing(this.drawings[i], x, y, this.chart, this.series)) {
        hitId = this.drawings[i].id;
        break;
      }
    }
    this.selectedId = hitId;
    this.drawings.forEach(function (d) { d.selected = d.id === hitId; });
    if (hitId) {
      this._enterRedactMode();
      this._showPerDrawingSettings();
      this._updateStatus('Drawing selected (Del to remove)');
    } else {
      this._exitRedactMode();
      this._hidePerDrawingSettings();
      this._updateStatus('Ready');
    }
    this.render();
  };

  /* ----------------------------------------------- */
  /*  Redact mode — freeze chart, hide crosshair,     */
  /*  default cursor. User can only edit drawings.    */
  /* ----------------------------------------------- */
  DrawingManager.prototype._enterRedactMode = function () {
    if (this._redactMode) return;
    this._redactMode = true;
    this.container.style.cursor = 'default';
    try {
      if (this.chart) {
        this.chart.applyOptions({
          crosshair: { mode: LightweightCharts.CrosshairMode.Hidden },
          handleScroll: false,
          handleScale: false,
        });
      }
    } catch (e) { console.warn('redact mode error', e); }
  };

  DrawingManager.prototype._exitRedactMode = function () {
    if (!this._redactMode) return;
    this._redactMode = false;
    this.container.style.cursor = '';
    try {
      if (this.chart) {
        this.chart.applyOptions({
          crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
          handleScroll: true,
          handleScale: true,
        });
      }
    } catch (e) { console.warn('exit redact mode error', e); }
  };

  DrawingManager.prototype._deleteSelected = function () {
    if (this.selectedId == null) return;
    for (var i = 0; i < this.drawings.length; i++) {
      if (this.drawings[i].id === this.selectedId) {
        var removed = this.drawings.splice(i, 1)[0];
        this.undoStack.push(null);
        this.undoStack.push({ action: 'add', drawing: removed });
        this.selectedId = null;
        this._exitRedactMode();
        this._updateStatus('Drawing deleted');
        this._hidePerDrawingSettings();
        this._autoSave();
        this.render();
        return;
      }
    }
  };

  /* ----------------------------------------------- */
  /*  Drag helpers                                     */
  /* ----------------------------------------------- */
  DrawingManager.prototype._hitTestEndpoint = function (d, mx, my) {
    var tol = 10;
    for (var i = 0; i < d.points.length; i++) {
      var sp = d2s(this.chart, this.series, d.points[i].time, d.points[i].price);
      if (sp && dist(mx, my, sp.x, sp.y) < tol) return i;
    }
    return -1;
  };

  DrawingManager.prototype._applyDrag = function (mx, my) {
    var ds = this._dragState;
    if (!ds) return;
    var d = ds.drawing;

    if (ds.type === 'move') {
      var dx = mx - ds.startX;
      var dy = my - ds.startY;
      ds.startX = mx;
      ds.startY = my;

      // Convert screen delta to data-space delta by comparing two points
      var refX = ds.startX, refY = ds.startY;
      var before = s2d(this.chart, this.series, refX, refY);
      var after = s2d(this.chart, this.series, refX + dx, refY + dy);
      if (!before || !after || before.time == null || after.time == null) return;

      var dTime = after.time - before.time;
      var dPrice = after.price - before.price;

      for (var i = 0; i < d.points.length; i++) {
        d.points[i] = {
          time: d.points[i].time + dTime,
          price: d.points[i].price + dPrice,
        };
      }
    } else if (ds.type === 'endpoint') {
      var data = s2d(this.chart, this.series, mx, my);
      if (data && data.time != null && data.price != null) {
        d.points[ds.idx] = { time: data.time, price: data.price };
      }
    }
  };

  DrawingManager.prototype._finalizeDrag = function () {
    // Push undo entry using pre-drag points captured at drag start
    var ds = this._dragState;
    this.undoStack.push(null);
    this.undoStack.push({ action: 'modify', drawingId: ds.drawing.id, prevPoints: ds.prevPoints });
    this._autoSave();
  };

  /* ----------------------------------------------- */
  /*  Brush (freehand)                                */
  /* ----------------------------------------------- */
  DrawingManager.prototype._brushStart = function (x, y) {
    this.brushPoints = [];
    var data = s2d(this.chart, this.series, x, y);
    if (data.time == null || data.price == null) return;
    this.brushPoints.push(data);
    this.canvas.style.pointerEvents = 'auto';
  };

  DrawingManager.prototype._brushMove = function (x, y) {
    if (!this.brushPoints.length) return;
    var data = s2d(this.chart, this.series, x, y);
    if (data.time == null || data.price == null) return;
    var last = this.brushPoints[this.brushPoints.length - 1];
    if (data.time === last.time && data.price === last.price) return;
    this.brushPoints.push(data);
    this._renderBrushPreview();
  };

  DrawingManager.prototype._brushEnd = function () {
    if (this.brushPoints.length < 2) {
      this.brushPoints = [];
      return;
    }
    this._commitDrawing('brush', this.brushPoints);
    this.brushPoints = [];
    this.canvas.style.pointerEvents = 'none';
    this._finishDrawing();
  };

  DrawingManager.prototype._renderBrushPreview = function () {
    var ctx = this.ctx;
    var dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._renderAll();
    if (this.brushPoints.length < 2) { ctx.restore(); return; }
    ctx.beginPath();
    var first = d2s(this.chart, this.series, this.brushPoints[0].time, this.brushPoints[0].price);
    if (!first) { ctx.restore(); return; }
    ctx.moveTo(first.x, first.y);
    for (var i = 1; i < this.brushPoints.length; i++) {
      var sp = d2s(this.chart, this.series, this.brushPoints[i].time, this.brushPoints[i].price);
      if (sp) ctx.lineTo(sp.x, sp.y);
    }
    ctx.strokeStyle = DEFAULTS.color;
    ctx.lineWidth = DEFAULTS.width + 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = DEFAULTS.opacity;
    ctx.stroke();
    ctx.restore();
  };

  /* ----------------------------------------------- */
  /*  Commit/undo/clear                               */
  /* ----------------------------------------------- */
  DrawingManager.prototype._commitDrawing = function (type, points) {
    var opts = {
      color: this._settingsColor || DEFAULTS.color,
      width: this._settingsWidth || DEFAULTS.width,
      opacity: DEFAULTS.opacity,
      fill: DEFAULTS.fill,
      lineStyle: DEFAULTS.lineStyle,
      fontSize: DEFAULTS.fontSize,
    };
    if (type === 'text' && points[0].label) {
      opts.label = points[0].label;
    }
    var d = makeDrawing(type, points, opts);
    this.drawings.push(d);
    this.undoStack.push(null);  // sentinel for "add" action
    this.undoStack.push({ action: 'remove', drawing: d });
    this._autoSave();
    return d;
  };

  DrawingManager.prototype._finishDrawing = function () {
    this.activeTool = null;
    this.toolPhase = 'idle';
    this.tempPoints = [];
    this.brushPoints = [];
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.cursor = '';
    // Auto-select the last committed drawing
    if (this.drawings.length > 0) {
      var d = this.drawings[this.drawings.length - 1];
      this.selectedId = d.id;
      this.drawings.forEach(function (dw) { dw.selected = dw.id === d.id; });
      this._enterRedactMode();
      this._showPerDrawingSettings();
      this._updateStatus(d.type + ' drawn');
    }
    // Highlight cursor button in toolbar
    document.querySelectorAll('#leftToolbar .lt-tool').forEach(function (b) { b.classList.remove('active'); });
    var cursor = document.querySelector('#leftToolbar .lt-cursor');
    if (cursor) cursor.classList.add('active');
    this.render();
  };

  /* ----------------------------------------------- */
  /*  Server-side persistence                         */
  /* ----------------------------------------------- */
  DrawingManager.prototype._autoSave = function () {
    if (!this._currentSymbol) return;
    var clean = this.drawings.map(function (d) {
      var copy = Object.assign({}, d);
      delete copy.selected;
      delete copy._isPattern;
      return copy;
    });
    fetch('/api/drawings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: this._currentSymbol, drawings: clean }),
    }).catch(function (e) { console.warn('auto-save failed', e); });
  };

  DrawingManager.prototype._loadDrawings = function () {
    if (!this._currentSymbol) return;
    var self = this;
    var seq = (this._loadSeq = (this._loadSeq || 0) + 1);
    fetch('/api/drawings?symbol=' + encodeURIComponent(this._currentSymbol))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (seq !== self._loadSeq) return;
        if (data.drawings && data.drawings.length > 0) {
          self.drawings = [];
          data.drawings.forEach(function (d) {
            self.drawings.push(d);
            if (d.id >= nextId) nextId = d.id + 1;
          });
          self.render();
        }
      })
      .catch(function (e) { console.warn('load drawings failed', e); });
  };

  DrawingManager.prototype.undo = function () {
    while (this.undoStack.length) {
      var entry = this.undoStack.pop();
      if (entry === null) break;
      if (entry.action === 'remove') {
        for (var i = 0; i < this.drawings.length; i++) {
          if (this.drawings[i].id === entry.drawing.id) {
            this.drawings.splice(i, 1);
            break;
          }
        }
      } else if (entry.action === 'add') {
        this.drawings.push(entry.drawing);
      } else if (entry.action === 'modify') {
        for (var i = 0; i < this.drawings.length; i++) {
          if (this.drawings[i].id === entry.drawingId) {
            this.drawings[i].points = entry.prevPoints;
            break;
          }
        }
      }
    }
    this.selectedId = null;
    this._exitRedactMode();
    this._hidePerDrawingSettings();
    this._updateStatus('Undo');
    this._autoSave();
    this.render();
  };

  /* ----------------------------------------------- */
  /*  Pattern drawings (from ML analysis)             */
  /* ----------------------------------------------- */
  DrawingManager.prototype.addPatternDrawing = function (drawing) {
    drawing._isPattern = true;
    this.drawings.push(drawing);
    this.render();
  };

  DrawingManager.prototype.clearPatternDrawings = function () {
    this.drawings = this.drawings.filter(function (d) { return !d._isPattern; });
    this.render();
  };

  DrawingManager.prototype.getPatternDrawings = function () {
    return this.drawings.filter(function (d) { return d._isPattern; });
  };

  DrawingManager.prototype.clearAll = function () {
    this.drawings = [];
    this.undoStack = [];
    this.selectedId = null;
    this._exitRedactMode();
    this._hidePerDrawingSettings();
    this._updateStatus('All cleared');
    this.render();
  };

  DrawingManager.prototype.setSymbol = function (symbol) {
    // Save current drawings for the old symbol
    this._autoSave();
    // Switch to new symbol
    this._currentSymbol = symbol;
    this.drawings = [];
    this.undoStack = [];
    this.selectedId = null;
    this._exitRedactMode();
    this._hidePerDrawingSettings();
    // Load drawings for the new symbol
    this._loadDrawings();
  };

  /* ----------------------------------------------- */
  /*  Render                                          */
  /* ----------------------------------------------- */
  DrawingManager.prototype._renderAll = function () {
    var ctx = this.ctx;
    var rect = this.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (var i = 0; i < this.drawings.length; i++) {
      var renderFn = R[this.drawings[i].type];
      if (renderFn) {
        renderFn(ctx, this.drawings[i], this.chart, this.series);
      }
    }

    // Live preview: when placing a 2-point tool, show the shape from placed point to crosshair
    if (this.activeTool && !TOOLS[this.activeTool].drag && this.tempPoints.length > 0 && this.toolPhase === 'placing' && this._crosshairPos) {
      var toolId = this.activeTool;
      var toolDef = TOOLS[toolId];
      if (toolDef && toolDef.points === 2) {
        var crossData = s2d(this.chart, this.series, this._crosshairPos.x, this._crosshairPos.y);
        if (crossData && crossData.time != null && crossData.price != null) {
          var prevOpts = {
            color: this._settingsColor || DEFAULTS.color,
            width: this._settingsWidth || DEFAULTS.width,
            opacity: 0.4,
            fill: 'rgba(41,98,255,0.05)',
            lineStyle: 'dashed',
          };
          var prevD = {
            id: -1, type: toolId, selected: false,
            points: [this.tempPoints[0]],
            opts: prevOpts,
          };
          if (toolId === 'trendline' || toolId === 'ray' || toolId === 'arrow') {
            prevD.points.push(crossData);
          } else if (toolId === 'rectangle' || toolId === 'circle' || toolId === 'fib' || toolId === 'pricerange_pct') {
            prevD.points.push(crossData);
          }
          if (R[toolId]) {
            R[toolId](ctx, prevD, this.chart, this.series);
          }
        }
      }
      // Still show the placed-point marker
      var lastPt = this.tempPoints[this.tempPoints.length - 1];
      var sp = d2s(this.chart, this.series, lastPt.time, lastPt.price);
      if (sp) {
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = this._settingsColor || DEFAULTS.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  DrawingManager.prototype.render = function () {
    if (!this.ctx) return;
    this._renderAll();
  };

  /* ----------------------------------------------- */
  /*  Settings panel                                  */
  /* ----------------------------------------------- */
  DrawingManager.prototype._initSettingsPanel = function () {
    var self = this;
    var container = this.container;

    var trigger = document.createElement('button');
    trigger.className = 'settings-trigger';
    trigger.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10" cy="10" r="3"/><path d="M10 2v2m0 12v2M2 10h2m12 0h2M4.93 4.93l1.41 1.41m7.32 7.32l1.41 1.41M4.93 15.07l1.41-1.41m7.32-7.32l1.41-1.41"/></svg>';
    trigger.title = 'Settings';
    container.appendChild(trigger);

    var panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.style.display = 'none';

    var html = '';
    html += '<div class="settings-section"><div class="settings-label">Chart Type</div>';
    html += '<div class="settings-chart-types">';
    html += '<button data-ct="candlestick" class="active">Candle</button>';
    html += '<button data-ct="line">Line</button>';
    html += '<button data-ct="area">Area</button></div></div>';
    html += '<div class="settings-section"><div class="settings-label">Theme</div>';
    html += '<button id="settingsThemeBtn">Toggle Theme</button></div>';
    html += '<div class="settings-section"><div class="settings-label">Drawing Color</div>';
    html += '<div class="settings-colors">';
    var colors = ['#000000','#2962ff','#ff9800','#4caf50','#f44336','#9c27b0','#00bcd4','#ffeb3b','#ffffff'];
    for (var ci = 0; ci < colors.length; ci++) {
      html += '<button style="background:' + colors[ci] + '" data-color="' + colors[ci] + '"></button>';
    }
    html += '</div></div>';
    html += '<div class="settings-section"><div class="settings-label">Line Width</div>';
    html += '<div class="settings-widths">';
    html += '<button data-w="1">1</button><button data-w="2" class="active">2</button>';
    html += '<button data-w="3">3</button><button data-w="4">4</button></div></div>';

    html += '<div class="settings-section"><div class="settings-label">Pattern Threshold</div>';
    html += '<div class="settings-threshold">';
    html += '<input type="range" id="thresholdSlider" min="0.5" max="0.99" step="0.01" value="0.80" style="width:100%;">';
    html += '<div id="thresholdValue" style="text-align:center;font:12px Inter,sans-serif;margin-top:4px;">80%</div></div></div>';

    panel.innerHTML = html;
    container.appendChild(panel);

    var visible = false;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      visible = !visible;
      panel.style.display = visible ? 'block' : 'none';
    });

    // Threshold slider
    var thresholdSlider = panel.querySelector('#thresholdSlider');
    var thresholdDisplay = panel.querySelector('#thresholdValue');
    if (thresholdSlider) {
      thresholdSlider.addEventListener('input', function () {
        var val = +this.value;
        thresholdDisplay.textContent = Math.round(val * 100) + '%';
        window._analysisThreshold = val.toFixed(2);
      });
    }

    var docClick = function (e) {
      if (visible && !panel.contains(e.target) && e.target !== trigger) {
        visible = false;
        panel.style.display = 'none';
      }
    };
    document.addEventListener('click', docClick);
    this._listeners.push(function () { document.removeEventListener('click', docClick); });

    // Chart types
    panel.querySelectorAll('[data-ct]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('[data-ct]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var type = btn.dataset.ct;
        if (window.LightweightToolbar && window.LightweightToolbar.switchChartType) {
          window.LightweightToolbar.switchChartType(type);
        }
      });
    });

    // Theme
    var themeBtn = panel.querySelector('#settingsThemeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var isDark = !document.body.classList.contains('light');
        document.body.classList.toggle('light', isDark);
        if (window.TFChart && window.TFChart.applyChartTheme) {
          window.TFChart.applyChartTheme(!isDark);
        }
        self.setTheme(!isDark);
        self.render();
      });
    }

    // Color picker
    panel.querySelectorAll('[data-color]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('[data-color]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        self._settingsColor = btn.dataset.color;
      });
    });

    // Width picker
    panel.querySelectorAll('[data-w]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('[data-w]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        self._settingsWidth = +btn.dataset.w;
      });
    });

    this._settingsTrigger = trigger;
    this._settingsPanel = panel;
  };

  DrawingManager.prototype.setTheme = function (dark) {
    if (this._settingsPanel) {
      this._settingsPanel.style.borderColor = dark ? '#243041' : '#dbe2ea';
    }
  };

  /* ----------------------------------------------- */
  /*  Per-drawing settings                            */
  /* ----------------------------------------------- */
  DrawingManager.prototype._initPerDrawingSettings = function () {
    this._pdContainer = document.getElementById('ltDrawingSettings');
    this._pdSep = document.getElementById('ltDrawingSep');
    this._pdTrigger = document.getElementById('btn-drawing-settings');
    if (!this._pdTrigger) return;

    var self = this;
    var panel = document.createElement('div');
    panel.className = 'pd-settings-panel';
    panel.style.display = 'none';
    document.body.appendChild(panel);
    this._pdPanel = panel;

    this._pdTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (panel.style.display !== 'none') {
        panel.style.display = 'none';
      } else {
        self._openPerDrawingPanel();
      }
    });

    var pdDocClick = function (e) {
      if (panel.style.display !== 'none' && !panel.contains(e.target) && e.target !== self._pdTrigger) {
        panel.style.display = 'none';
      }
    };
    document.addEventListener('click', pdDocClick);
    this._listeners.push(function () { document.removeEventListener('click', pdDocClick); });
  };

  DrawingManager.prototype._getSelectedDrawing = function () {
    if (this.selectedId == null) return null;
    for (var i = 0; i < this.drawings.length; i++) {
      if (this.drawings[i].id === this.selectedId) return this.drawings[i];
    }
    return null;
  };

  DrawingManager.prototype._showPerDrawingSettings = function () {
    if (this._pdContainer) this._pdContainer.style.display = 'block';
    if (this._pdSep) this._pdSep.style.display = 'block';
    if (this._pdPanel) this._pdPanel.style.display = 'none';
  };

  DrawingManager.prototype._hidePerDrawingSettings = function () {
    if (this._pdContainer) this._pdContainer.style.display = 'none';
    if (this._pdSep) this._pdSep.style.display = 'none';
    if (this._pdPanel) this._pdPanel.style.display = 'none';
  };

  DrawingManager.prototype._openPerDrawingPanel = function () {
    var drawing = this._getSelectedDrawing();
    if (!drawing) return;

    var self = this;
    var panel = this._pdPanel;
    var opts = drawing.opts;

    var colors = ['#000000','#2962ff','#ff9800','#4caf50','#f44336','#9c27b0','#00bcd4','#ffeb3b','#ffffff'];
    var widths = [1, 2, 3, 4];
    var styles = ['solid', 'dashed', 'dotted'];
    var fontSizes = [10, 12, 14, 16, 18, 24, 32];

    var html = '';
    html += '<div class="pd-section"><div class="pd-label">Color</div><div class="pd-colors">';
    for (var ci = 0; ci < colors.length; ci++) {
      var act = colors[ci] === opts.color ? ' active' : '';
      html += '<button style="background:' + colors[ci] + '" data-pd-color="' + colors[ci] + '"' + act + '></button>';
    }
    html += '</div></div>';

    html += '<div class="pd-section"><div class="pd-label">Width</div><div class="pd-widths">';
    for (var wi = 0; wi < widths.length; wi++) {
      var act = widths[wi] === opts.width ? ' active' : '';
      html += '<button data-pd-w="' + widths[wi] + '"' + act + '>' + WIDTH_ICONS[widths[wi]] + '</button>';
    }
    html += '</div></div>';

    html += '<div class="pd-section"><div class="pd-label">Type</div><div class="pd-line-styles">';
    for (var si = 0; si < styles.length; si++) {
      var act = styles[si] === (opts.lineStyle || 'solid') ? ' active' : '';
      html += '<button data-pd-ls="' + styles[si] + '"' + act + '>' + LINE_STYLE_ICONS[styles[si]] + '</button>';
    }
    html += '</div></div>';

    if (drawing.type === 'text') {
      html += '<div class="pd-section"><div class="pd-label">Font</div><div class="pd-font-sizes">';
      for (var fi = 0; fi < fontSizes.length; fi++) {
        var act = fontSizes[fi] === (opts.fontSize || 14) ? ' active' : '';
        html += '<button data-pd-fs="' + fontSizes[fi] + '"' + act + '>' + fontSizes[fi] + '</button>';
      }
      html += '</div></div>';
    }

    panel.innerHTML = html;

    // Color
    panel.querySelectorAll('[data-pd-color]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('[data-pd-color]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        opts.color = btn.getAttribute('data-pd-color');
        self.render();
        self._autoSave();
      });
    });

    // Width
    panel.querySelectorAll('[data-pd-w]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('[data-pd-w]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        opts.width = +btn.getAttribute('data-pd-w');
        self.render();
        self._autoSave();
      });
    });

    // Line style
    panel.querySelectorAll('[data-pd-ls]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('[data-pd-ls]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        opts.lineStyle = btn.getAttribute('data-pd-ls');
        self.render();
        self._autoSave();
      });
    });

    // Font size
    panel.querySelectorAll('[data-pd-fs]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('[data-pd-fs]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        opts.fontSize = +btn.getAttribute('data-pd-fs');
        self.render();
        self._autoSave();
      });
    });

    // Position panel to the right of the toolbar trigger
    var tr = this._pdTrigger.getBoundingClientRect();
    panel.style.left = (tr.right + 4) + 'px';
    panel.style.top = Math.max(8, tr.top - 80) + 'px';
    panel.style.display = 'block';
  };

  /* ----------------------------------------------- */
  /*  Public API                                      */
  /* ----------------------------------------------- */
  var activeManager = null;

  function init(chart, series, container, symbol) {
    if (activeManager) { activeManager.destroy(); }
    activeManager = new DrawingManager(chart, series, container, symbol);
    activeManager._initSettingsPanel();
    return activeManager;
  }

  function destroy() {
    if (activeManager) { activeManager.destroy(); activeManager = null; }
  }

  function resize() {
    if (activeManager) activeManager.resize();
  }

  function render() {
    if (activeManager) activeManager.render();
  }

  function activateTool(toolId) {
    if (activeManager) activeManager.activateTool(toolId);
  }

  function deactivateTool() {
    if (activeManager) activeManager.deactivateTool();
  }

  function undo() {
    if (activeManager) activeManager.undo();
  }

  function clearAll() {
    if (activeManager) activeManager.clearAll();
  }

  function setSeries(series) {
    if (activeManager) activeManager.setSeries(series);
  }

  function setTheme(dark) {
    if (activeManager) activeManager.setTheme(dark);
  }

  function isActive() {
    return activeManager !== null;
  }

  function setSymbol(symbol) {
    if (activeManager) activeManager.setSymbol(symbol);
  }

  function addPatternDrawing(drawing) {
    if (activeManager) activeManager.addPatternDrawing(drawing);
  }

  function clearPatternDrawings() {
    if (activeManager) activeManager.clearPatternDrawings();
  }

  window.DrawingOverlay = {
    init: init,
    destroy: destroy,
    resize: resize,
    render: render,
    activateTool: activateTool,
    deactivateTool: deactivateTool,
    undo: undo,
    clearAll: clearAll,
    setSeries: setSeries,
    setTheme: setTheme,
    isActive: isActive,
    setSymbol: setSymbol,
    addPatternDrawing: addPatternDrawing,
    clearPatternDrawings: clearPatternDrawings,
    tools: TOOLS,
    icons: ICONS,
    groups: GROUPS,
  };

  /* ----------------------------------------------- */
  /*  Auto-wire toolbar buttons                       */
  /* ----------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    // Inject SVG icons into tool buttons
    document.querySelectorAll('.lt-tool[data-tool]').forEach(function (btn) {
      var toolId = btn.getAttribute('data-tool');
      var toolDef = TOOLS[toolId];
      if (toolDef && ICONS[toolDef.icon]) {
        btn.innerHTML = ICONS[toolDef.icon];
      }
    });

    // Tool activation
    document.querySelectorAll('#leftToolbar .lt-tool').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#leftToolbar .lt-tool').forEach(function (b) { b.classList.remove('active'); });
        var cursor = document.querySelector('#leftToolbar .lt-cursor');
        if (cursor) cursor.classList.remove('active');
        btn.classList.add('active');
        window.DrawingOverlay.activateTool(btn.getAttribute('data-tool'));
      });
    });

    // Cursor (deselect) button
    var cursorBtn = document.querySelector('#leftToolbar .lt-cursor');
    if (cursorBtn) {
      cursorBtn.addEventListener('click', function () {
        document.querySelectorAll('#leftToolbar .lt-tool').forEach(function (b) { b.classList.remove('active'); });
        cursorBtn.classList.add('active');
        window.DrawingOverlay.deactivateTool();
      });
    }

    // Actions
    var fitBtn = document.getElementById('btn-fit');
    if (fitBtn) {
      fitBtn.addEventListener('click', function () {
        if (window.chart && window.chart.timeScale) window.chart.timeScale().fitContent();
      });
    }

    var undoBtn = document.getElementById('btn-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', function () { window.DrawingOverlay.undo(); });
    }

    var clearBtn = document.getElementById('btn-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () { window.DrawingOverlay.clearAll(); });
    }
  });
})();
