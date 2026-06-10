/* ============================================================
   gd.js — Gradient Descent Playground
   Loss surface, SGD/Momentum/Adam, canvas rendering
   ============================================================ */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // ── State ───────────────────────────────────────────────
  const state = {
    optimizer: 'sgd',
    learningRate: 0.05,
    momentum: 0.9,
    speed: 20,
    running: false,
    timer: null,
    startX: null,
    startY: null,
    currentX: null,
    currentY: null,
    step: 0,
    path: [],
    // Momentum state
    vx: 0, vy: 0,
    // Adam state
    mx: 0, my: 0, vxx: 0, vyy: 0, adamT: 0,
  };

  // ── DOM ─────────────────────────────────────────────────
  const dom = {
    canvas: $('#surfaceCanvas'),
    overlay: $('#canvasOverlay'),
    surfaceStatus: $('#surfaceStatus'),
    runStatus: $('#runStatus'),
    btnRun: $('#btnRun'),
    btnStep: $('#btnStep'),
    btnReset: $('#btnReset'),
    lrVal: $('#lrVal'),
    betaVal: $('#betaVal'),
    speedVal: $('#speedVal'),
    momentumGroup: $('#momentumGroup'),
    metricPos: $('#metricPos'),
    metricLoss: $('#metricLoss'),
    metricStep: $('#metricStep'),
    metricGrad: $('#metricGrad'),
    historyLog: $('#historyLog'),
    optimizerTabs: $('#optimizerTabs'),
  };

  // ── Loss function & gradient ────────────────────────────
  function loss(x, y) {
    return x * x + 2 * y * y + 0.3 * Math.sin(3 * x) * Math.sin(3 * y);
  }

  function gradient(x, y) {
    return {
      dx: 2 * x + 0.9 * Math.cos(3 * x) * Math.sin(3 * y),
      dy: 4 * y + 0.9 * Math.sin(3 * x) * Math.cos(3 * y),
    };
  }

  // ── Canvas setup ────────────────────────────────────────
  function initCanvas() {
    const wrap = $('#canvasWrap');
    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    const w = rect.width;
    const size = Math.min(w, 580);
    dom.canvas.width = size * dpr;
    dom.canvas.height = size * dpr;
    dom.canvas.style.width = size + 'px';
    dom.canvas.style.height = size + 'px';
    state.canvasSize = size;
    state.dpr = dpr;
    state.range = 3; // x,y in [-3, 3]
    drawSurface();
  }

  function toPixel(px, py) {
    const sz = state.canvasSize;
    const r = state.range;
    return {
      x: ((px + r) / (2 * r)) * sz,
      y: ((r - py) / (2 * r)) * sz,
    };
  }

  function toWorld(cx, cy) {
    const sz = state.canvasSize;
    const r = state.range;
    return {
      x: (cx / sz) * 2 * r - r,
      y: r - (cy / sz) * 2 * r,
    };
  }

  function drawSurface() {
    const c = dom.canvas;
    const ctx = c.getContext('2d');
    const dpr = state.dpr;
    const sz = state.canvasSize;
    const r = state.range;
    const steps = 200;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, sz, sz);

    // Compute loss range for color mapping
    let minL = Infinity, maxL = -Infinity;
    const lossGrid = [];
    for (let i = 0; i <= steps; i++) {
      const row = [];
      const y = -r + (2 * r * i) / steps;
      for (let j = 0; j <= steps; j++) {
        const x = -r + (2 * r * j) / steps;
        const l = loss(x, y);
        row.push(l);
        if (l < minL) minL = l;
        if (l > maxL) maxL = l;
      }
      lossGrid.push(row);
    }
    state.lossGrid = lossGrid;
    state.lossMin = minL;
    state.lossMax = maxL;

    // Draw heatmap
    const cellW = sz / steps;
    const cellH = sz / steps;
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < steps; j++) {
        const l = lossGrid[i][j];
        const t = (l - minL) / (maxL - minL || 1);
        ctx.fillStyle = heatColor(t);
        ctx.fillRect(j * cellW, i * cellH, cellW + 1, cellH + 1);
      }
    }

    // Draw contour lines
    const contourLevels = 8;
    for (let lev = 1; lev <= contourLevels; lev++) {
      const threshold = minL + (maxL - minL) * (lev / (contourLevels + 1));
      ctx.strokeStyle = lev === contourLevels ? 'rgba(255,215,0,0.25)' : 'rgba(42,42,42,0.6)';
      ctx.lineWidth = lev === contourLevels ? 1 : 0.5;
      drawContour(ctx, lossGrid, threshold, sz, steps);
    }

    // Mark minimum
    const minPx = toPixel(0, 0);
    ctx.beginPath();
    ctx.arc(minPx.x, minPx.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function heatColor(t) {
    // Deep blue (low loss) → dark purple → dark red → gold (high loss)
    const r = Math.floor(t < 0.5 ? t * 2 * 80 : 80 + (t - 0.5) * 2 * 175);
    const g = Math.floor(t < 0.5 ? t * 2 * 30 : 30 + (t - 0.5) * 2 * 110);
    const b = Math.floor(t < 0.5 ? 40 - t * 2 * 35 : 5 + (t - 0.5) * 2 * 5);
    return `rgb(${r},${g},${b})`;
  }

  function drawContour(ctx, grid, threshold, sz, steps) {
    ctx.beginPath();
    const cellW = sz / steps;
    const cellH = sz / steps;
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < steps; j++) {
        const tl = grid[i][j], tr = grid[i][j + 1], bl = grid[i + 1][j], br = grid[i + 1][j + 1];
        const above = [tl, tr, bl, br].map(v => v > threshold);
        const cnt = above.filter(Boolean).length;
        if (cnt === 0 || cnt === 4) continue;
        const x = j * cellW, y = i * cellH;
        const pts = [];
        // Marching squares (simplified)
        const corners = [
          { v: tl, x: x, y: y },
          { v: tr, x: x + cellW, y: y },
          { v: br, x: x + cellW, y: y + cellH },
          { v: bl, x: x, y: y + cellH },
        ];
        for (let k = 0; k < 4; k++) {
          const a = corners[k], b = corners[(k + 1) % 4];
          if ((a.v > threshold) !== (b.v > threshold)) {
            const tt = (threshold - a.v) / (b.v - a.v || 0.001);
            pts.push({ x: a.x + tt * (b.x - a.x), y: a.y + tt * (b.y - a.y) });
          }
        }
        if (pts.length >= 2) {
          ctx.moveTo(pts[0].x, pts[0].y);
          ctx.lineTo(pts[1].x, pts[1].y);
          if (pts.length === 4) {
            ctx.moveTo(pts[2].x, pts[2].y);
            ctx.lineTo(pts[3].x, pts[3].y);
          }
        }
      }
    }
    ctx.stroke();
  }

  function redrawAll() {
    drawSurface();
    drawStartPoint();
    drawPath();
    drawCurrentPoint();
  }

  function drawStartPoint() {
    if (state.startX == null) return;
    const ctx = dom.canvas.getContext('2d');
    const dpr = state.dpr;
    const pt = toPixel(state.startX, state.startY);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawCurrentPoint() {
    if (state.currentX == null) return;
    const ctx = dom.canvas.getContext('2d');
    const dpr = state.dpr;
    const pt = toPixel(state.currentX, state.currentY);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawPath() {
    if (state.path.length < 2) return;
    const ctx = dom.canvas.getContext('2d');
    const dpr = state.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.beginPath();
    const first = toPixel(state.path[0].x, state.path[0].y);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < state.path.length; i++) {
      const pt = toPixel(state.path[i].x, state.path[i].y);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.strokeStyle = 'rgba(255,215,0,0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Canvas click handler ────────────────────────────────
  dom.canvas.addEventListener('click', (e) => {
    if (state.running) return;
    const rect = dom.canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const w = toWorld(cx, cy);
    state.startX = w.x;
    state.startY = w.y;
    state.currentX = w.x;
    state.currentY = w.y;
    state.step = 0;
    state.path = [{ x: w.x, y: w.y }];
    state.vx = 0; state.vy = 0;
    state.mx = 0; state.my = 0; state.vxx = 0; state.vyy = 0; state.adamT = 0;
    dom.overlay.classList.add('hidden');
    dom.surfaceStatus.textContent = 'Ready';
    updateMetrics();
    redrawAll();
    addHistory(`Start: (${w.x.toFixed(2)}, ${w.y.toFixed(2)}) — Loss ${loss(w.x,w.y).toFixed(3)}`);
  });

  // ── Optimizer steps ─────────────────────────────────────
  function sgdStep() {
    const g = gradient(state.currentX, state.currentY);
    const lr = state.learningRate;
    state.currentX -= lr * g.dx;
    state.currentY -= lr * g.dy;
    return g;
  }

  function momentumStep() {
    const g = gradient(state.currentX, state.currentY);
    const lr = state.learningRate;
    const beta = state.momentum;
    state.vx = beta * state.vx - lr * g.dx;
    state.vy = beta * state.vy - lr * g.dy;
    state.currentX += state.vx;
    state.currentY += state.vy;
    return g;
  }

  function adamStep() {
    const g = gradient(state.currentX, state.currentY);
    const lr = state.learningRate;
    const b1 = 0.9, b2 = 0.999, eps = 1e-8;
    state.adamT++;
    state.mx = b1 * state.mx + (1 - b1) * g.dx;
    state.my = b1 * state.my + (1 - b1) * g.dy;
    state.vxx = b2 * state.vxx + (1 - b2) * g.dx * g.dx;
    state.vyy = b2 * state.vyy + (1 - b2) * g.dy * g.dy;
    const mxh = state.mx / (1 - Math.pow(b1, state.adamT));
    const myh = state.my / (1 - Math.pow(b1, state.adamT));
    const vxh = state.vxx / (1 - Math.pow(b2, state.adamT));
    const vyh = state.vyy / (1 - Math.pow(b2, state.adamT));
    state.currentX -= lr * mxh / (Math.sqrt(vxh) + eps);
    state.currentY -= lr * myh / (Math.sqrt(vyh) + eps);
    return g;
  }

  function doStep() {
    if (state.currentX == null) return false;
    let g;
    switch (state.optimizer) {
      case 'momentum': g = momentumStep(); break;
      case 'adam': g = adamStep(); break;
      default: g = sgdStep(); break;
    }
    state.step++;
    state.path.push({ x: state.currentX, y: state.currentY });
    updateMetrics(g);
    return true;
  }

  function updateMetrics(g) {
    if (state.currentX == null) {
      dom.metricPos.textContent = '\u2014';
      dom.metricLoss.textContent = '\u2014';
      dom.metricStep.textContent = '0';
      dom.metricGrad.textContent = '\u2014';
      return;
    }
    const l = loss(state.currentX, state.currentY);
    const gNorm = g ? Math.sqrt(g.dx * g.dx + g.dy * g.dy) : 0;
    dom.metricPos.textContent = `(${state.currentX.toFixed(3)}, ${state.currentY.toFixed(3)})`;
    dom.metricLoss.textContent = l.toFixed(5);
    dom.metricStep.textContent = state.step;
    dom.metricGrad.textContent = gNorm.toFixed(5);
  }

  // ── Training loop ───────────────────────────────────────
  function startRunning() {
    if (state.running) return;
    if (state.currentX == null) return;
    state.running = true;
    dom.runStatus.textContent = 'Running';
    dom.runStatus.classList.add('running');
    dom.btnRun.innerHTML = '<i class="fas fa-pause"></i> Pause';
    dom.btnStep.disabled = true;
    const interval = 1000 / state.speed;
    state.timer = setInterval(() => {
      const moved = doStep();
      redrawAll();
      if (!moved) { stopRunning(); return; }
      // Stop if gradient is tiny
      if (state.step > 500) {
        addHistory('Stopped after 500 steps');
        stopRunning();
        return;
      }
      const g = gradient(state.currentX, state.currentY);
      const gNorm = Math.sqrt(g.dx * g.dx + g.dy * g.dy);
      if (gNorm < 0.001 && state.step > 10) {
        addHistory(`Converged at step ${state.step}`);
        stopRunning();
      }
    }, interval);
  }

  function stopRunning() {
    state.running = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    dom.runStatus.textContent = 'Idle';
    dom.runStatus.classList.remove('running');
    dom.btnRun.innerHTML = '<i class="fas fa-play"></i> Run';
    dom.btnStep.disabled = false;
    redrawAll();
  }

  function resetAll() {
    stopRunning();
    state.startX = null; state.startY = null;
    state.currentX = null; state.currentY = null;
    state.step = 0; state.path = [];
    state.vx = 0; state.vy = 0;
    state.mx = 0; state.my = 0; state.vxx = 0; state.vyy = 0; state.adamT = 0;
    dom.overlay.classList.remove('hidden');
    dom.surfaceStatus.textContent = 'Click to start';
    dom.runStatus.textContent = 'Idle';
    dom.runStatus.classList.remove('running');
    dom.btnRun.innerHTML = '<i class="fas fa-play"></i> Run';
    dom.btnStep.disabled = false;
    updateMetrics();
    dom.historyLog.innerHTML = '<div class="gd-history-line muted"><i class="fas fa-circle-info"></i> Path log will appear here...</div>';
    drawSurface();
  }

  function addHistory(msg) {
    const line = document.createElement('div');
    line.className = 'gd-history-line';
    line.innerHTML = `<i class="fas fa-chevron-right"></i> ${msg}`;
    dom.historyLog.appendChild(line);
    dom.historyLog.scrollTop = dom.historyLog.scrollHeight;
  }

  // ── Event listeners ─────────────────────────────────────
  dom.btnRun.addEventListener('click', () => {
    if (state.running) { stopRunning(); return; }
    startRunning();
  });

  dom.btnStep.addEventListener('click', () => {
    if (state.currentX == null) return;
    const moved = doStep();
    redrawAll();
    if (moved) {
      addHistory(`Step ${state.step}: (${state.currentX.toFixed(3)}, ${state.currentY.toFixed(3)}) — Loss ${loss(state.currentX,state.currentY).toFixed(4)}`);
    }
  });

  dom.btnReset.addEventListener('click', resetAll);

  // Optimizer tabs
  dom.optimizerTabs.querySelectorAll('.gd-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      dom.optimizerTabs.querySelectorAll('.gd-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.optimizer = tab.dataset.opt;
      dom.momentumGroup.style.display = state.optimizer === 'momentum' ? 'block' : 'none';
    });
  });

  $('#learningRate').addEventListener('input', function () {
    state.learningRate = parseFloat(this.value);
    dom.lrVal.textContent = state.learningRate.toFixed(3);
  });

  $('#momentum').addEventListener('input', function () {
    state.momentum = parseFloat(this.value);
    dom.betaVal.textContent = state.momentum.toFixed(2);
  });

  $('#speed').addEventListener('input', function () {
    state.speed = parseInt(this.value);
    dom.speedVal.textContent = state.speed;
    if (state.running) {
      stopRunning();
      startRunning();
    }
  });

  // Resize
  let resizeDebounce;
  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      initCanvas();
      if (state.path.length > 0) redrawAll();
      if (state.startX == null) drawSurface();
    }, 200);
  });

  // ── Init ────────────────────────────────────────────────
  function init() {
    initCanvas();
    updateMetrics();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
