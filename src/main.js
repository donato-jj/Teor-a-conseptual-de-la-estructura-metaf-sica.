// File: src/main.js
import { createCGLSim } from './sim/cgl2d.js';
import { renderField } from './render/fieldRenderer.js';
import { drawGauges } from './render/gauges.js';
import { Plot2D } from './charts/plot2d.js';
import { Attractor } from './charts/attractor.js';
import { GraphNetwork } from './widgets/graphNetwork.js';
import { PRESETS, DEFAULT_STATE, applyPreset } from './app/state.js';
import { initRouter } from './app/router.js';
import { loadStateFromURL, writeStateToURL } from './utils/urlState.js';
import { exportCanvasPNG } from './utils/exportPng.js';
import { exportStateJSON } from './utils/exportJson.js';
import { tickFrame, getFPS, getMS, getPerfString } from './utils/perf.js';
import { $, setText } from './utils/dom.js';

// ─── State ───────────────────────────────────────────────────────────────────
let state = loadStateFromURL(DEFAULT_STATE);
let running = false;
let animFrame = null;
let invertAsym = false;
let sim;
let lastMetrics = { E: 0, Ein: 0, D: 0, S: 0, FRIF: 0, asym: 0, dEdt: 0 };

// ─── Canvas setup ─────────────────────────────────────────────────────────────
const fieldCanvas = $('fieldCanvas');
const gaugeCanvas = $('gaugeCanvas');
const frifCanvas = $('frifCanvas');
const attrCanvas = $('attrCanvas');
const netCanvas = $('netCanvas');

function resizeCanvas(canvas, w, h) {
  canvas.width = w;
  canvas.height = h;
}

function initCanvasSizes() {
  const scale = state.renderScale;
  const N = state.grid;
  resizeCanvas(fieldCanvas, Math.round(N * scale), Math.round(N * scale));
  resizeCanvas(gaugeCanvas, gaugeCanvas.clientWidth || 300, 100);
  resizeCanvas(frifCanvas, frifCanvas.clientWidth || 300, frifCanvas.clientHeight || 160);
  resizeCanvas(attrCanvas, attrCanvas.clientWidth || 300, attrCanvas.clientHeight || 160);
  resizeCanvas(netCanvas, netCanvas.clientWidth || 300, netCanvas.clientHeight || 160);
}

// ─── Charts & Widgets ─────────────────────────────────────────────────────────
let plot2d, attractor, graphNet;

function initCharts() {
  plot2d = new Plot2D(frifCanvas, { maxPoints: 200 });
  attractor = new Attractor(attrCanvas, { maxPoints: 400 });
  graphNet = new GraphNetwork(netCanvas, { nodes: 8 });
}

// ─── Simulation ───────────────────────────────────────────────────────────────
function initSim() {
  sim = createCGLSim({
    N: state.grid,
    alpha: state.alpha,
    beta: state.beta,
    gamma: state.gamma,
    dt: state.dt,
    vAmp: state.vAmp,
    noiseAmp: state.noiseAmp,
    noiseOn: state.noiseOn,
    boundary: state.boundary || 'periodic',
    vMode: state.vMode || 'gaussian',
    seed: state.seed,
  });
}

// ─── Safe dt calculation ───────────────────────────────────────────────────────
function safeDt(alpha, beta) {
  // CFL-like stability: dt < 1/(4*(1+|alpha|)) for diffusion stability
  return Math.min(0.06, 0.9 / (4 * (1 + Math.abs(alpha))));
}

function updateDtDisplay() {
  const safe = safeDt(state.alpha, state.beta);
  const clamped = Math.min(state.dt, safe);
  const el = $('dtRange');
  if (el) {
    const lbl = el.closest('.ctrlGroup')?.querySelector('.dtSafeLabel');
    if (lbl) lbl.textContent = `safe dt: ${safe.toFixed(4)} | clamped: ${clamped.toFixed(4)}`;
  }
}

// ─── Controls sync ────────────────────────────────────────────────────────────
function syncControls() {
  if ($('alphaRange')) $('alphaRange').value = state.alpha;
  if ($('betaRange')) $('betaRange').value = state.beta;
  if ($('gammaRange')) $('gammaRange').value = state.gamma;
  if ($('dtRange')) $('dtRange').value = state.dt;
  if ($('modeSelect')) $('modeSelect').value = state.mode;
  if ($('boundarySelect')) $('boundarySelect').value = state.boundary || 'periodic';
  if ($('potentialSelect')) $('potentialSelect').value = state.vMode || 'gaussian';
  if ($('vAmpRange')) $('vAmpRange').value = state.vAmp;
  if ($('noiseAmpRange')) $('noiseAmpRange').value = state.noiseAmp;
  if ($('seedInput')) $('seedInput').value = state.seed;
  if ($('gridSelect')) $('gridSelect').value = String(state.grid);
  if ($('renderScaleSelect')) $('renderScaleSelect').value = String(state.renderScale);
  if ($('presetSelect')) $('presetSelect').value = state.preset || 'stable';
  if ($('noiseToggle')) {
    $('noiseToggle').textContent = state.noiseOn ? 'Ruido ON' : 'Ruido OFF';
    $('noiseToggle').classList.toggle('active', state.noiseOn);
  }
  updateDtDisplay();
}

function applySimParams() {
  sim.setParams({
    alpha: state.alpha,
    beta: state.beta,
    gamma: state.gamma,
    dt: Math.min(state.dt, safeDt(state.alpha, state.beta)),
    vAmp: state.vAmp,
    noiseAmp: state.noiseAmp,
    noiseOn: state.noiseOn,
    boundary: state.boundary || 'periodic',
    vMode: state.vMode || 'gaussian',
  });
}

// ─── Main loop ────────────────────────────────────────────────────────────────
function frame() {
  tickFrame();

  // Auto-scale: if FPS < 30, drop render scale
  if (getFPS() > 0 && getFPS() < 30 && state.renderScale > 0.5) {
    state.renderScale = 0.5;
    initCanvasSizes();
    syncControls();
  }

  sim.step(1);
  lastMetrics = sim.getMetrics();

  // Field render
  renderField(fieldCanvas.getContext('2d'), sim.getField(), lastMetrics, {
    mode: state.mode || 'amplitude',
    invertAsym,
  });

  // Gauges
  drawGauges(gaugeCanvas, lastMetrics);

  // Charts
  plot2d.push(lastMetrics.E, lastMetrics.FRIF);
  plot2d.draw();

  attractor.push(lastMetrics.E, lastMetrics.dEdt);
  attractor.draw();

  graphNet.update(lastMetrics);
  graphNet.draw();

  // Perf
  setText('perfReadout', getPerfString());

  if (running) animFrame = requestAnimationFrame(frame);
}

// ─── Event handlers ───────────────────────────────────────────────────────────
function bindEvents() {
  // Toggle run
  $('toggleRun').addEventListener('click', () => {
    running = !running;
    $('toggleRun').textContent = running ? 'Pause' : 'Start';
    if (running) animFrame = requestAnimationFrame(frame);
    else cancelAnimationFrame(animFrame);
  });

  // Step
  $('btnStep').addEventListener('click', () => {
    sim.step(1);
    lastMetrics = sim.getMetrics();
    renderField(fieldCanvas.getContext('2d'), sim.getField(), lastMetrics, { mode: state.mode, invertAsym });
    drawGauges(gaugeCanvas, lastMetrics);
    plot2d.push(lastMetrics.E, lastMetrics.FRIF);
    plot2d.draw();
    attractor.push(lastMetrics.E, lastMetrics.dEdt);
    attractor.draw();
  });

  // Reset
  $('btnReset').addEventListener('click', () => {
    sim.reset(state.seed);
  });

  // Export PNG
  $('btnExportPng').addEventListener('click', () => {
    exportCanvasPNG(fieldCanvas, `campo-cuantico-${Date.now()}.png`);
  });

  // Copy link
  $('btnCopyLink').addEventListener('click', () => {
    writeStateToURL(state);
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    $('btnCopyLink').textContent = '¡Copiado!';
    setTimeout(() => { $('btnCopyLink').textContent = 'Copiar Link'; }, 2000);
  });

  // Export JSON
  $('btnExportJson').addEventListener('click', () => {
    exportStateJSON(state, lastMetrics);
  });

  // Mode select
  $('modeSelect').addEventListener('change', e => {
    state.mode = e.target.value;
    writeStateToURL(state);
  });

  // Preset select
  $('presetSelect').addEventListener('change', e => {
    const preset = PRESETS[e.target.value] || PRESETS.stable;
    Object.assign(state, preset);
    state.preset = e.target.value;
    syncControls();
    sim.resizeGrid(state.grid);
    applySimParams();
    initCanvasSizes();
    initCharts();
    writeStateToURL(state);
  });

  // Boundary
  $('boundarySelect').addEventListener('change', e => {
    state.boundary = e.target.value;
    applySimParams();
    writeStateToURL(state);
  });

  // Potential
  $('potentialSelect').addEventListener('change', e => {
    state.vMode = e.target.value;
    applySimParams();
    writeStateToURL(state);
  });

  // Grid
  $('gridSelect').addEventListener('change', e => {
    state.grid = parseInt(e.target.value, 10);
    sim.resizeGrid(state.grid);
    initCanvasSizes();
    initCharts();
    writeStateToURL(state);
  });

  // Render scale
  $('renderScaleSelect').addEventListener('change', e => {
    state.renderScale = parseFloat(e.target.value);
    initCanvasSizes();
    writeStateToURL(state);
  });

  // Alpha
  $('alphaRange').addEventListener('input', e => {
    state.alpha = parseFloat(e.target.value);
    applySimParams();
    updateDtDisplay();
    writeStateToURL(state);
  });

  // Beta
  $('betaRange').addEventListener('input', e => {
    state.beta = parseFloat(e.target.value);
    applySimParams();
    writeStateToURL(state);
  });

  // Gamma
  $('gammaRange').addEventListener('input', e => {
    state.gamma = parseFloat(e.target.value);
    applySimParams();
    writeStateToURL(state);
  });

  // dt
  $('dtRange').addEventListener('input', e => {
    state.dt = parseFloat(e.target.value);
    applySimParams();
    updateDtDisplay();
    writeStateToURL(state);
  });

  // vAmp
  $('vAmpRange').addEventListener('input', e => {
    state.vAmp = parseFloat(e.target.value);
    applySimParams();
    writeStateToURL(state);
  });

  // Noise toggle
  $('noiseToggle').addEventListener('click', () => {
    state.noiseOn = !state.noiseOn;
    applySimParams();
    syncControls();
    writeStateToURL(state);
  });

  // Noise amp
  $('noiseAmpRange').addEventListener('input', e => {
    state.noiseAmp = parseFloat(e.target.value);
    applySimParams();
    writeStateToURL(state);
  });

  // Seed
  $('seedInput').addEventListener('change', e => {
    state.seed = parseInt(e.target.value, 10) || 1337;
    writeStateToURL(state);
  });

  // Random seed
  $('btnRandomSeed').addEventListener('click', () => {
    state.seed = Math.floor(Math.random() * 99999) + 1;
    $('seedInput').value = state.seed;
    sim.reset(state.seed);
    writeStateToURL(state);
  });

  // Repo / prompt links
  const linkRepo = $('linkRepo');
  const linkPrompt = $('linkPrompt');
  if (linkRepo) linkRepo.href = 'https://github.com/donato-jj/Teor-a-conseptual-de-la-estructura-metaf-sica.';
  if (linkPrompt) linkPrompt.href = './PROMPT.md';
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
function boot() {
  initRouter();
  initCanvasSizes();
  initSim();
  initCharts();
  syncControls();
  bindEvents();

  // Initial render without running
  sim.step(1);
  lastMetrics = sim.getMetrics();
  renderField(fieldCanvas.getContext('2d'), sim.getField(), lastMetrics, { mode: state.mode, invertAsym });
  drawGauges(gaugeCanvas, lastMetrics);
  graphNet.update(lastMetrics);
  graphNet.draw();
  plot2d.push(lastMetrics.E, lastMetrics.FRIF);
  plot2d.draw();
  attractor.push(lastMetrics.E, lastMetrics.dEdt);
  attractor.draw();
  setText('perfReadout', 'FPS: -- | ms: --');
}

window.addEventListener('DOMContentLoaded', boot);
