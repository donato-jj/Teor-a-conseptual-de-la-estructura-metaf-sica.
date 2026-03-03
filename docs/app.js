/* ============================================================
   DQRI/FRIF Interactive Lab — app.js
   Arquitectura: Engine, SimulationState, NetworkModel/Renderer,
   AttractorModel/Renderer, FRIFEstimator/ChartRenderer,
   FlowRenderer, QuantumFieldModel/Renderer, DarwinModule,
   UIController, ExportController, URLStateCodec,
   PerformanceScaler, TooltipSystem
   ============================================================

   GUÍA DE AJUSTE — parámetros clave y qué producen:
   ─────────────────────────────────────────────────
   SUBCRÍTICO  : E=0.10, T=0.30, σ=0.15, γ=0.20, k_auto=0.30
                 → FRIF≈0, atractor difuso, red débil, no organización
   UMBRAL      : E=0.50, T=0.30, σ=0.15, γ=0.20, k_auto=0.60
                 → FRIF~0.3-0.5, atractor incipiente, bifurcación
   SUPERCRÍTICO: E=0.85, T=0.15, σ=0.08, γ=0.15, k_auto=0.80
                 → FRIF>0.6, atractor estable, red autocatalítica fuerte
   QUIRALIDAD L: χ=+0.90, κ=0.50, advec=0.40 → rotación CCW, dominancia L
   QUIRALIDAD D: χ=-0.90 → L/D invertido, rotación CW, indicador cambia a D
   POLARIDAD F.: |P|=0.90, ángulo=90 → gradiente fuerte vertical visible
   DARWIN OPT. : E=0.50, μ=0.05, s=0.40, ventana=50, Darwin=ON
                 → la media de FRIF sube con el tiempo bajo misma energía
   ─────────────────────────────────────────────────
   FRIF se calcula por grid de ocupación 2D (resolución G=32).
   Reducir G para más velocidad; aumentar para más precisión.
   Δt=0.016 (≈60Hz virtual); steps_per_frame ajustado por PerformanceScaler.
   ============================================================ */

'use strict';

// ============================================================
// CONSTANTES GLOBALES
// ============================================================
const GRID_SIZE = 32;       // resolución grid ocupación FRIF
const TRACE_MAX = 500;      // máximo puntos en traza atractor
const FRIF_HISTORY = 120;   // puntos sparkline FRIF(t)
const THERMO_HISTORY = 200; // puntos panel termodinámico
const DT = 0.016;           // paso de integración virtual

// ============================================================
// SimulationState — estado mutable compartido
// ============================================================
const State = {
  // Parámetros físicos
  E: 0.50,       // energía de entrada normalizada
  T: 0.30,       // temperatura normalizada
  sigma: 0.15,   // ruido estocástico
  gamma: 0.20,   // disipación
  k_auto: 0.60,  // autocatálisis
  Fin: 1.0,      // flujo entrada
  Fout: 1.0,     // flujo salida
  Ec: 0.35,      // umbral crítico (si no es auto)
  Ec_auto: true, // calcular Ec automáticamente

  // Campo cuántico / asimetrías
  chi: 0.70,        // quiralidad (-1=D, +1=L)
  kappa: 0.40,      // curvatura visual
  xi: 0.50,         // correlación
  P_mag: 0.50,      // magnitud polaridad
  P_angle: 90,      // ángulo polaridad (grados)
  advection: 0.40,  // advección 5'→3'
  g_field: 0.30,    // intensidad campo fondo
  ld_inverted: false,

  // Darwin
  darwin_on: false,
  mu: 0.05,
  sel_s: 0.30,
  window: 50,

  // Otros controles
  trace_len: 200,
  show_nullclines: false,
  paused: false,
  time: 0,
  fps: 60,
  frame_count: 0,

  // Estado calculado
  frif: 0,
  frif_max: 0,
  regime: 'subcritical',
};

// ============================================================
// AttractorModel — oscilador de Van der Pol estocástico modificado
// ============================================================
const AttractorModel = (() => {
  let x = 0.1, y = 0.1;
  const trace = [];

  function _effectiveEc() {
    if (State.Ec_auto) return Math.max(0.05, 0.2 + 0.3 * State.T + 0.2 * State.sigma);
    return State.Ec;
  }

  function step() {
    const E = State.E;
    const T = State.T;
    const sig = State.sigma;
    const gam = State.gamma;
    const Ec = _effectiveEc();
    const mu_vdp = Math.max(0, (E - Ec) / (1 - Ec + 0.001)) * 3.0;

    // Van der Pol modificado: dx/dt = y, dy/dt = mu*(1-x²)*y - x - gamma*y + E*x
    const noise_x = sig * (Math.random() * 2 - 1) * Math.sqrt(T + 0.01);
    const noise_y = sig * (Math.random() * 2 - 1) * Math.sqrt(T + 0.01);

    const dx = y + noise_x;
    const dy = mu_vdp * (1 - x * x) * y - x - gam * y + E * 0.5 * x + noise_y;

    x += dx * DT;
    y += dy * DT;

    // Damping estabilizador
    const r2 = x * x + y * y;
    if (r2 > 16) { x *= 0.9; y *= 0.9; }

    const maxLen = Math.min(State.trace_len, TRACE_MAX);
    trace.push([x, y]);
    if (trace.length > maxLen) trace.shift();
  }

  function getTrace() { return trace; }
  function getPos() { return [x, y]; }
  function reset() { x = 0.1; y = 0.1; trace.length = 0; }
  function getEc() { return _effectiveEc(); }

  return { step, getTrace, getPos, reset, getEc };
})();

// ============================================================
// FRIFEstimator — estima FRIF por grid de ocupación 2D
// ============================================================
const FRIFEstimator = (() => {
  const G = GRID_SIZE;
  const grid = new Uint8Array(G * G);
  const history = [];
  let current = 0;
  let frif_max = 0;

  function update() {
    const trace = AttractorModel.getTrace();
    if (trace.length < 10) { current = 0; return; }

    grid.fill(0);
    const range = 3.5;
    for (const [px, py] of trace) {
      const gx = Math.floor((px + range) / (2 * range) * (G - 1));
      const gy = Math.floor((py + range) / (2 * range) * (G - 1));
      if (gx >= 0 && gx < G && gy >= 0 && gy < G) {
        grid[gy * G + gx] = 1;
      }
    }

    let occ = 0;
    for (let i = 0; i < G * G; i++) if (grid[i]) occ++;

    const V_ef = occ / (G * G);
    const V_ref = 1.0;
    if (V_ef <= 0) { current = 1; }
    else { current = -Math.log(V_ef / V_ref) / Math.log(G * G); }
    current = Math.max(0, Math.min(1, current));

    // FRIF_max analítica
    const Ec = AttractorModel.getEc();
    const alpha = 0.85;
    const T_max = 1.0;
    frif_max = alpha * State.E / (State.E + Ec) * Math.max(0, 1 - State.T / T_max);
    frif_max = Math.max(0, Math.min(1, frif_max));

    history.push(current);
    if (history.length > FRIF_HISTORY) history.shift();

    State.frif = current;
    State.frif_max = frif_max;
    State.regime = State.E < Ec * 0.8 ? 'subcritical' : State.E < Ec * 1.2 ? 'threshold' : 'supercritical';
  }

  function get() { return current; }
  function getMax() { return frif_max; }
  function getHistory() { return history; }

  return { update, get, getMax, getHistory };
})();

// ============================================================
// NetworkModel — red química autocatalítica (Lotka-Volterra simplificado)
// ============================================================
const NetworkModel = (() => {
  const N = 6;
  // Concentraciones
  let conc = new Float32Array(N).fill(0.5);
  // Matriz de conexiones (fija, topología anillo + cross-links)
  const adj = [
    [0, 1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0],
  ];
  // Extra cross-link
  const cross = [[0,3],[1,4],[2,5]];
  let fluxes = new Float32Array(N * N);
  let autoCount = 0;

  function step() {
    const k = State.k_auto;
    const Fin = State.Fin * State.E;
    const sig = State.sigma;
    const newConc = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      let dc = Fin / N - State.gamma * conc[i];
      // Autocatálisis: ki*ci*(1-ci)
      dc += k * conc[i] * (1 - conc[i]);
      // Interacciones de la red
      for (let j = 0; j < N; j++) {
        if (adj[j][i]) dc += 0.3 * conc[j] * k * (1 - conc[i]);
      }
      // Cross-links
      for (const [a, b] of cross) {
        if (b === i) dc += 0.15 * conc[a] * k;
      }
      // Ruido
      dc += sig * (Math.random() - 0.5) * 0.1;
      newConc[i] = Math.max(0, Math.min(1, conc[i] + dc * DT * 0.5));
    }

    // Calcular flujos
    autoCount = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (adj[i][j]) {
          fluxes[i * N + j] = k * conc[i] * (newConc[j] - conc[j] + 0.01);
          if (fluxes[i * N + j] > 0.005) autoCount++;
        }
      }
    }

    conc = newConc;
  }

  function getConc() { return conc; }
  function getAdj() { return adj; }
  function getFluxes() { return fluxes; }
  function getAutoCount() { return autoCount; }
  function reset() { conc.fill(0.5); }

  return { step, getConc, getAdj, getFluxes, getAutoCount, N, reset };
})();

// ============================================================
// ThermoModel — termodinámica del sistema abierto
// ============================================================
const ThermoModel = (() => {
  const history = { G_free: [], diss: [], entropy: [] };
  let G_free = 0, diss = 0, dS_exp = 0;

  function step() {
    const E = State.E;
    const gam = State.gamma;
    const T = State.T;
    const Fin = State.Fin * E;
    const Fout = State.Fout;

    // Energía libre interna (simplificada)
    G_free = E * (1 - T) - gam * E * 0.5;
    G_free = Math.max(0, G_free);

    // Disipación = gamma * E + fluctuaciones
    diss = gam * E + 0.02 * State.sigma;

    // Entropía exportada = disipación / T (forma simplificada de dS_int)
    dS_exp = T > 0.01 ? diss / T : 0;

    const add = (arr, v) => { arr.push(v); if (arr.length > THERMO_HISTORY) arr.shift(); };
    add(history.G_free, G_free);
    add(history.diss, diss);
    add(history.entropy, dS_exp);
  }

  function getHistory() { return history; }
  function get() { return { G_free, diss, dS_exp }; }
  function reset() { for (const k of Object.keys(history)) history[k].length = 0; }

  return { step, getHistory, get, reset };
})();

// ============================================================
// QuantumFieldModel — campo escalar 2D con asimetrías
// ============================================================
const QuantumFieldModel = (() => {
  const W = 128, H = 96;
  const field = new Float32Array(W * H);
  let phase = 0;
  let imageData = null;

  function step(dt) {
    phase += dt * 0.8;
    const chi = State.ld_inverted ? -State.chi : State.chi;
    const kap = State.kappa;
    const xi = State.xi;
    const Pm = State.P_mag;
    const Pa = State.P_angle * Math.PI / 180;
    const adv = State.advection;
    const g = State.g_field;
    const E = State.E;

    const px = Math.cos(Pa), py = Math.sin(Pa);

    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const nx = (i / W) * 2 - 1;   // -1..1
        const ny = (j / H) * 2 - 1;

        // Curvatura visual: deforma coordenadas
        const r2 = nx * nx + ny * ny;
        const curve = kap * r2 * 0.5;
        const cx = nx * (1 + curve), cy = ny * (1 + curve);

        // Frecuencias espaciales
        const k1 = 4 + 2 * xi;
        const k2 = 3 + 2 * chi;

        // Campo base: interferencia de ondas
        const w1 = Math.sin(k1 * cx + phase + chi * Math.PI * 0.5);
        const w2 = Math.cos(k2 * cy - phase * 0.7 + kap * Math.atan2(cy, cx));

        // Advección 5'→3': deriva en dirección preferente
        const advPhase = adv * 6 * (px * cx + py * cy) - adv * phase * 0.5;
        const w3 = Math.sin(advPhase + phase * 0.3);

        // Polaridad: gradiente de amplitud
        const polGrad = 1 + Pm * (px * cx + py * cy);

        // Campo background (campo "g")
        const bg = g * Math.sin(2 * cx + phase * 0.2) * Math.cos(2 * cy + phase * 0.15);

        // Composición total
        let val = polGrad * (w1 * (1 - adv * 0.3) + w2 * xi + w3 * adv) + bg;

        // Modulación por energía
        val *= (0.3 + 0.7 * E);

        // Normalizar a -1..1
        field[j * W + i] = Math.tanh(val * 0.8);
      }
    }
  }

  function getField() { return field; }
  function getDims() { return [W, H]; }

  return { step, getField, getDims };
})();

// ============================================================
// DarwinModule — variación + selección bajo restricción energética
// ============================================================
const DarwinModule = (() => {
  const N_LINEAGES = 3;
  const COLORS = ['#00d4aa', '#f0a020', '#8855cc'];
  let lineages = [];
  let gen = 0;
  const history = [[], [], []];   // FRIF history per lineage
  const MAX_HIST = 120;

  function init() {
    lineages = [];
    for (let i = 0; i < N_LINEAGES; i++) {
      lineages.push({
        E: State.E + (Math.random() - 0.5) * State.mu * 2,
        k: State.k_auto + (Math.random() - 0.5) * State.mu * 2,
        frif: 0,
        fitness: 0,
      });
    }
    gen = 0;
    for (let i = 0; i < N_LINEAGES; i++) history[i].length = 0;
  }

  function estimateFRIF(E_val, k_val) {
    // Estimación rápida analítica (proxy sin simulación completa)
    const Ec = AttractorModel.getEc();
    const base = Math.max(0, (E_val - Ec) / (1 - Ec + 0.001));
    const keff = Math.max(0, k_val);
    return Math.min(1, 0.6 * base * (0.5 + keff * 0.5));
  }

  function step() {
    if (!State.darwin_on) return;
    gen++;

    const mu = State.mu;
    const s = State.sel_s;

    // Evaluar FRIF de cada linaje
    for (const lin of lineages) {
      lin.frif = estimateFRIF(lin.E, lin.k);
      lin.fitness = lin.frif;
    }

    // Selección: probabilidad proporcional a fitness
    const totalFit = lineages.reduce((a, l) => a + Math.exp(s * l.fitness), 0);

    // Reproducción con mutación
    const newLineages = [];
    for (let i = 0; i < N_LINEAGES; i++) {
      // Seleccionar padre
      let r = Math.random() * totalFit;
      let parent = lineages[0];
      for (const l of lineages) {
        r -= Math.exp(s * l.fitness);
        if (r <= 0) { parent = l; break; }
      }
      newLineages.push({
        E: Math.max(0.01, Math.min(1, parent.E + mu * (Math.random() * 2 - 1))),
        k: Math.max(0, Math.min(1, parent.k + mu * (Math.random() * 2 - 1))),
        frif: parent.frif,
        fitness: parent.fitness,
      });
    }
    lineages = newLineages;

    // Registrar historia
    for (let i = 0; i < N_LINEAGES; i++) {
      history[i].push(lineages[i].frif);
      if (history[i].length > MAX_HIST) history[i].shift();
    }
  }

  function getLineages() { return lineages; }
  function getHistory() { return history; }
  function getGen() { return gen; }
  function getColors() { return COLORS; }
  function getBestFRIF() {
    if (lineages.length === 0) return 0;
    return Math.max(...lineages.map(l => l.frif));
  }
  function getMeanFitness() {
    if (lineages.length === 0) return 0;
    return lineages.reduce((a, l) => a + l.fitness, 0) / lineages.length;
  }

  return { init, step, getLineages, getHistory, getGen, getColors, getBestFRIF, getMeanFitness };
})();

// ============================================================
// PerformanceScaler — ajusta steps_per_frame según FPS
// ============================================================
const PerformanceScaler = (() => {
  let steps = 2;
  let lastTime = performance.now();
  let frameAccum = 0;
  const FPS_TARGET = 30;
  const FPS_SMOOTH = 0.1;
  let smoothFPS = 60;

  function update(now) {
    const dt_ms = now - lastTime;
    lastTime = now;
    smoothFPS = smoothFPS * (1 - FPS_SMOOTH) + (1000 / (dt_ms + 0.001)) * FPS_SMOOTH;
    State.fps = Math.round(smoothFPS);

    if (smoothFPS < FPS_TARGET * 0.7 && steps > 1) steps--;
    else if (smoothFPS > FPS_TARGET * 1.3 && steps < 4) steps++;
  }

  function getSteps() { return steps; }
  return { update, getSteps };
})();

// ============================================================
// RENDERERS
// ============================================================

// ---- Panel 1: NetworkRenderer ----
const NetworkRenderer = (() => {
  let canvas, ctx;
  const N = 6;
  const nodeColors = ['#00d4aa','#00b8d9','#4488cc','#8855cc','#f0a020','#e04040'];

  function init(c) {
    canvas = c;
    ctx = canvas.getContext('2d');
    _resize();
  }

  function _resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
  }

  function _nodePos(i, cx, cy, r) {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function render() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const dpr = devicePixelRatio;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.32;
    const conc = NetworkModel.getConc();
    const adj = NetworkModel.getAdj();
    const fluxes = NetworkModel.getFluxes();
    const k = State.k_auto;

    // Dibujar aristas con flujo
    ctx.save();
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (!adj[i][j]) continue;
        const [x1, y1] = _nodePos(i, cx, cy, r);
        const [x2, y2] = _nodePos(j, cx, cy, r);
        const flux = fluxes[i * N + j];
        const alpha = Math.max(0.05, Math.min(0.9, Math.abs(flux) * 5));
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = flux > 0 ? '#00d4aa' : '#e04040';
        ctx.lineWidth = (1 + Math.abs(flux) * 8) * dpr;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        // Curva suave
        const mx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
        const my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
        ctx.quadraticCurveTo(mx, my, x2, y2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Dibujar nodos
    for (let i = 0; i < N; i++) {
      const [nx, ny] = _nodePos(i, cx, cy, r);
      const c_val = conc[i];
      const radius = (8 + c_val * 14) * dpr;

      // Halo
      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, radius * 1.8);
      grad.addColorStop(0, nodeColors[i] + '55');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(nx, ny, radius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Nodo
      ctx.fillStyle = nodeColors[i];
      ctx.globalAlpha = 0.5 + c_val * 0.5;
      ctx.beginPath();
      ctx.arc(nx, ny, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Borde
      ctx.strokeStyle = '#ffffff33';
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.arc(nx, ny, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#c8d8e8';
      ctx.font = `${10 * dpr}px Courier New`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N' + (i + 1), nx, ny);
    }

    // Métricas
    const netFlux = Array.from(conc).reduce((a, v) => a + v, 0) / N;
    const el1 = document.getElementById('net-flux');
    const el2 = document.getElementById('net-autocycle');
    if (el1) el1.textContent = 'Flujo neto: ' + netFlux.toFixed(3);
    if (el2) el2.textContent = 'Autociclos: ' + NetworkModel.getAutoCount();
  }

  return { init, render };
})();

// ---- Panel 2: AttractorRenderer ----
const AttractorRenderer = (() => {
  let canvas, ctx;

  function init(c) {
    canvas = c;
    ctx = canvas.getContext('2d');
    _resize();
  }

  function _resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
  }

  function render() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const dpr = devicePixelRatio;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const scale = Math.min(W, H) * 0.12;
    const trace = AttractorModel.getTrace();
    const Ec = AttractorModel.getEc();

    // Ejes
    ctx.strokeStyle = '#1e2d42';
    ctx.lineWidth = dpr;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Nulclinas (opcional)
    if (State.show_nullclines && trace.length > 5) {
      ctx.strokeStyle = '#2a3d55';
      ctx.lineWidth = dpr * 0.5;
      ctx.setLineDash([3 * dpr, 3 * dpr]);
      // Nulclina x: dy/dt=0 → y=0 aprox (simplificado)
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Traza tipo osciloscopio
    if (trace.length < 2) return;
    const N = trace.length;
    for (let i = 1; i < N; i++) {
      const t_norm = i / N;
      const alpha = t_norm * 0.9 + 0.1;
      const age = 1 - (N - i) / N;
      const r = Math.floor(0 + age * 0);
      const g = Math.floor(180 + age * 75);
      const b = Math.floor(140 + age * 30);

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth = (1 + t_norm * 1.5) * dpr;
      ctx.beginPath();
      ctx.moveTo(cx + trace[i - 1][0] * scale, cy - trace[i - 1][1] * scale);
      ctx.lineTo(cx + trace[i][0] * scale, cy - trace[i][1] * scale);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Punto actual
    const [px, py] = AttractorModel.getPos();
    const sx = cx + px * scale, sy = cy - py * scale;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, 4 * dpr, 0, Math.PI * 2);
    ctx.fill();

    // Métricas
    const frif = FRIFEstimator.get();
    const dim_ef = (1 + frif * 1.5).toFixed(2);
    const lyap = ((State.E - Ec) * 2).toFixed(2);
    const e1 = document.getElementById('attr-dim');
    const e2 = document.getElementById('attr-lyap');
    if (e1) e1.textContent = 'Dim. ef.: ' + dim_ef;
    if (e2) e2.textContent = 'λ₁: ' + lyap;
  }

  return { init, render };
})();

// ---- Sparkline FRIF(t) ----
const SparklineRenderer = (() => {
  let canvas, ctx;

  function init(c) {
    canvas = c;
    ctx = canvas.getContext('2d');
  }

  function render() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, W, H);
    const hist = FRIFEstimator.getHistory();
    if (hist.length < 2) return;
    ctx.strokeStyle = '#00d4aa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < hist.length; i++) {
      const x = (i / (hist.length - 1)) * W;
      const y = H - hist[i] * H;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  return { init, render };
})();

// ---- Panel 3: FRIFChartRenderer ----
const FRIFChartRenderer = (() => {
  let canvas, ctx;
  const EE = 50;  // puntos en la curva E → FRIF_max
  let frif_points = [];

  function init(c) {
    canvas = c;
    ctx = canvas.getContext('2d');
    _resize();
    _buildCurve();
  }

  function _resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
  }

  function _buildCurve() {
    frif_points = [];
    const Ec = AttractorModel.getEc();
    const alpha = 0.85;
    for (let i = 0; i <= EE; i++) {
      const E = i / EE;
      const fm = alpha * E / (E + Ec) * Math.max(0, 1 - State.T);
      frif_points.push(Math.min(1, fm));
    }
  }

  function render() {
    if (!ctx) return;
    _buildCurve();
    const W = canvas.width, H = canvas.height;
    const dpr = devicePixelRatio;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, W, H);

    const pad = 28 * dpr;
    const pw = W - pad * 1.5, ph = H - pad * 2;

    // Eje X
    ctx.strokeStyle = '#1e2d42'; ctx.lineWidth = dpr;
    ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad * 0.5, H - pad); ctx.stroke();
    // Eje Y
    ctx.beginPath(); ctx.moveTo(pad, pad * 0.5); ctx.lineTo(pad, H - pad); ctx.stroke();

    // Labels ejes
    ctx.fillStyle = '#4a6070';
    ctx.font = `${8 * dpr}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText('E / Ṡ_in', W / 2, H - 6 * dpr);
    ctx.save(); ctx.translate(10 * dpr, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('FRIF', 0, 0);
    ctx.restore();

    // Tick marks
    ctx.fillStyle = '#2a3d55';
    for (let i = 0; i <= 4; i++) {
      const x = pad + (i / 4) * pw;
      ctx.beginPath(); ctx.moveTo(x, H - pad); ctx.lineTo(x, H - pad + 4 * dpr); ctx.stroke();
      ctx.fillStyle = '#4a6070';
      ctx.font = `${7 * dpr}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText((i / 4).toFixed(1), x, H - pad + 12 * dpr);
      const y = (H - pad) - (i / 4) * ph;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad - 4 * dpr, y); ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText((i / 4).toFixed(1), pad - 6 * dpr, y + 3 * dpr);
    }

    // Zona E < Ec (sombreado subcrítico)
    const Ec = AttractorModel.getEc();
    const Ec_x = pad + Ec * pw;
    ctx.fillStyle = 'rgba(224,64,64,0.06)';
    ctx.fillRect(pad, pad * 0.5, Ec_x - pad, ph + pad * 0.5);

    // Curva FRIF_max(E)
    ctx.strokeStyle = '#4488cc';
    ctx.lineWidth = 1.5 * dpr;
    ctx.setLineDash([4 * dpr, 3 * dpr]);
    ctx.beginPath();
    for (let i = 0; i <= EE; i++) {
      const x = pad + (i / EE) * pw;
      const y = (H - pad) - frif_points[i] * ph;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Label FRIF_max
    ctx.fillStyle = '#4488cc';
    ctx.font = `${7 * dpr}px Courier New`;
    ctx.textAlign = 'left';
    ctx.fillText('FRIF_max(E)', pad + pw * 0.55, pad + 12 * dpr);

    // Punto FRIF actual
    const frif_now = FRIFEstimator.get();
    const E_now = State.E;
    const px = pad + E_now * pw;
    const py = (H - pad) - frif_now * ph;

    // Línea vertical E_c
    ctx.strokeStyle = '#e04040';
    ctx.lineWidth = dpr;
    ctx.setLineDash([3 * dpr, 2 * dpr]);
    ctx.beginPath(); ctx.moveTo(Ec_x, pad * 0.5); ctx.lineTo(Ec_x, H - pad); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#e04040';
    ctx.font = `${7 * dpr}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText('E_c', Ec_x, pad * 0.3);

    // Punto actual
    ctx.fillStyle = '#00d4aa';
    ctx.beginPath();
    ctx.arc(px, py, 5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = dpr;
    ctx.beginPath();
    ctx.arc(px, py, 5 * dpr, 0, Math.PI * 2);
    ctx.stroke();

    // Régimen label
    ctx.fillStyle = '#00d4aa';
    ctx.font = `${8 * dpr}px Courier New`;
    ctx.textAlign = 'left';
    ctx.fillText(`FRIF=${frif_now.toFixed(3)}`, px + 6 * dpr, py - 4 * dpr);

    // Métricas DOM
    const e1 = document.getElementById('frif-current');
    const e2 = document.getElementById('frif-max-current');
    const e3 = document.getElementById('frif-regime');
    if (e1) e1.textContent = 'FRIF actual: ' + frif_now.toFixed(4);
    if (e2) e2.textContent = 'FRIF_max: ' + FRIFEstimator.getMax().toFixed(4);
    if (e3) e3.textContent = 'Régimen: ' + State.regime;
  }

  return { init, render };
})();

// ---- Panel 4: ThermoRenderer ----
const ThermoRenderer = (() => {
  let canvas, ctx;

  function init(c) {
    canvas = c;
    ctx = canvas.getContext('2d');
    _resize();
  }

  function _resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
  }

  function _drawLine(hist, color, maxV, W, H, pad, ph) {
    if (hist.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 * devicePixelRatio;
    ctx.beginPath();
    for (let i = 0; i < hist.length; i++) {
      const x = pad + (i / (hist.length - 1)) * (W - pad * 1.5);
      const y = (H - pad) - (hist[i] / (maxV + 0.001)) * ph;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function render() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const dpr = devicePixelRatio;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, W, H);

    const pad = 28 * dpr;
    const ph = H - pad * 2;
    const hist = ThermoModel.getHistory();

    // Ejes
    ctx.strokeStyle = '#1e2d42';
    ctx.lineWidth = dpr;
    ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W, H - pad); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad, pad * 0.5); ctx.lineTo(pad, H - pad); ctx.stroke();

    const maxV = Math.max(1,
      ...hist.G_free, ...hist.diss, ...hist.entropy
    ) * 1.1;

    _drawLine(hist.G_free, '#00d4aa', maxV, W, H, pad, ph);
    _drawLine(hist.diss, '#f0a020', maxV, W, H, pad, ph);
    _drawLine(hist.entropy, '#e04040', maxV, W, H, pad, ph);

    // Leyenda
    const legend = [['ΔG libre', '#00d4aa'], ['Disip.', '#f0a020'], ['ΔS_exp', '#e04040']];
    legend.forEach(([label, color], idx) => {
      ctx.fillStyle = color;
      ctx.font = `${8 * dpr}px Courier New`;
      ctx.textAlign = 'left';
      ctx.fillText('─ ' + label, pad + 4 * dpr, pad + (idx + 1) * 12 * dpr);
    });

    // Axis labels
    ctx.fillStyle = '#4a6070';
    ctx.font = `${8 * dpr}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText('t (virtual)', W / 2, H - 6 * dpr);

    // Métricas DOM
    const vals = ThermoModel.get();
    const e1 = document.getElementById('thermo-g');
    const e2 = document.getElementById('thermo-diss');
    const e3 = document.getElementById('thermo-entropy');
    if (e1) e1.textContent = 'ΔG: ' + vals.G_free.toFixed(3);
    if (e2) e2.textContent = 'Disip: ' + vals.diss.toFixed(3);
    if (e3) e3.textContent = 'ΔS_exp: ' + vals.dS_exp.toFixed(3);
  }

  return { init, render };
})();

// ---- Panel 5: QuantumFieldRenderer ----
const QuantumFieldRenderer = (() => {
  let canvas, ctx;
  let offscreen = null, offCtx = null;
  let animPhase = 0;

  function init(c) {
    canvas = c;
    ctx = canvas.getContext('2d');
    _resize();
  }

  function _resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
    // Offscreen para el campo
    offscreen = document.createElement('canvas');
    offscreen.width = 128;
    offscreen.height = 96;
    offCtx = offscreen.getContext('2d');
  }

  function render() {
    if (!ctx || !offscreen) return;
    animPhase += 0.03;
    const W = canvas.width, H = canvas.height;
    const dpr = devicePixelRatio;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, W, H);

    const field = QuantumFieldModel.getField();
    const [FW, FH] = QuantumFieldModel.getDims();
    const chi = State.ld_inverted ? -State.chi : State.chi;
    const frif = FRIFEstimator.get();

    // Renderizar campo en offscreen
    const imgData = offCtx.createImageData(FW, FH);
    for (let i = 0; i < FW * FH; i++) {
      const v = field[i];  // -1..1
      const t = (v + 1) / 2;  // 0..1
      // Color: hue rotado por quiralidad
      const hue = (200 + chi * 60 + t * 80) % 360;
      // Convertir HSL a RGB simple
      const [r, g, b] = _hslToRgb(hue / 360, 0.7 + frif * 0.3, 0.15 + t * 0.65);
      const idx = i * 4;
      imgData.data[idx]   = r;
      imgData.data[idx+1] = g;
      imgData.data[idx+2] = b;
      imgData.data[idx+3] = 220;
    }
    offCtx.putImageData(imgData, 0, 0);

    // Escalar a canvas principal
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(offscreen, 0, 0, W, H);

    // Dibujar vector de polaridad
    const Pm = State.P_mag;
    const Pa = State.P_angle * Math.PI / 180;
    if (Pm > 0.05) {
      const cx = W / 2, cy = H / 2;
      const len = Pm * Math.min(W, H) * 0.3;
      const ex = cx + Math.cos(Pa) * len, ey = cy - Math.sin(Pa) * len;
      ctx.strokeStyle = '#f0a020';
      ctx.lineWidth = 2.5 * dpr;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
      // Flecha
      const aSize = 8 * dpr;
      const angle = Math.atan2(ey - cy, ex - cx);
      ctx.fillStyle = '#f0a020';
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - aSize * Math.cos(angle - 0.4), ey - aSize * Math.sin(angle - 0.4));
      ctx.lineTo(ex - aSize * Math.cos(angle + 0.4), ey - aSize * Math.sin(angle + 0.4));
      ctx.closePath(); ctx.fill();
      // Label P
      ctx.fillStyle = '#f0a020';
      ctx.font = `${9 * dpr}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText('P', ex + Math.cos(Pa) * 12 * dpr, ey - Math.sin(Pa) * 12 * dpr);
    }

    // Indicador de quiralidad: flecha giratoria
    const chR = Math.min(W, H) * 0.08;
    const chCx = W - chR * 2 - 8 * dpr, chCy = chR + 8 * dpr;
    ctx.strokeStyle = chi > 0 ? '#00d4aa' : '#e04040';
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.arc(chCx, chCy, chR, 0, Math.PI * 1.5 * (chi > 0 ? 1 : -1));
    ctx.stroke();
    // Punta flecha quiral
    const chAngle = chi > 0 ? Math.PI * 1.5 : -Math.PI * 1.5;
    const ax = chCx + chR * Math.cos(chAngle);
    const ay = chCy + chR * Math.sin(chAngle);
    ctx.fillStyle = chi > 0 ? '#00d4aa' : '#e04040';
    ctx.beginPath();
    ctx.arc(ax, ay, 4 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = chi > 0 ? '#00d4aa' : '#e04040';
    ctx.font = `${7 * dpr}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(chi > 0 ? 'L' : 'D', chCx, chCy + chR + 10 * dpr);

    // Actualizar indicadores DOM
    const ldLabel = chi > 0 ? 'L' : 'D';
    const polLabel = State.P_mag > 0.3 ? '+' : '~0';
    const dirLabel = State.advection > 0.1 ? 'activo' : 'bajo';
    const sbLabel = State.E > AttractorModel.getEc() * 1.1 ? 'sí' : 'no';
    _setAsym('asym-chi', ldLabel);
    _setAsym('asym-pol', polLabel);
    _setAsym('asym-dir', dirLabel);
    _setAsym('asym-sb', sbLabel);
  }

  function _setAsym(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function _hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  return { init, render, _resize };
})();

// ---- Panel Darwin ----
const DarwinRenderer = (() => {
  let canvas, ctx;

  function init(c) {
    canvas = c;
    ctx = canvas.getContext('2d');
  }

  function render() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const dpr = devicePixelRatio;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, W, H);

    if (!State.darwin_on) {
      ctx.fillStyle = '#2a3d55';
      ctx.font = `${9 * dpr}px Courier New`;
      ctx.textAlign = 'center';
      ctx.fillText('Darwin desactivado', W / 2, H / 2);
      return;
    }

    const hist = DarwinModule.getHistory();
    const colors = DarwinModule.getColors();
    const maxLen = Math.max(...hist.map(h => h.length));
    if (maxLen < 2) return;

    // Ejes
    ctx.strokeStyle = '#1e2d42';
    ctx.lineWidth = dpr;
    ctx.beginPath(); ctx.moveTo(10 * dpr, H - 10 * dpr); ctx.lineTo(W - 5 * dpr, H - 10 * dpr); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10 * dpr, 5 * dpr); ctx.lineTo(10 * dpr, H - 10 * dpr); ctx.stroke();

    const pw = W - 15 * dpr, ph = H - 15 * dpr;

    for (let li = 0; li < 3; li++) {
      const h = hist[li];
      if (h.length < 2) continue;
      ctx.strokeStyle = colors[li];
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      for (let i = 0; i < h.length; i++) {
        const x = 10 * dpr + (i / (maxLen - 1)) * pw;
        const y = (H - 10 * dpr) - h[i] * ph;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Gen label
    ctx.fillStyle = '#4a6070';
    ctx.font = `${8 * dpr}px Courier New`;
    ctx.textAlign = 'right';
    ctx.fillText('Gen: ' + DarwinModule.getGen(), W - 4 * dpr, 12 * dpr);

    // Métricas DOM
    const e1 = document.getElementById('darwin-gen');
    const e2 = document.getElementById('darwin-fit');
    const e3 = document.getElementById('darwin-best');
    if (e1) e1.textContent = 'Gen: ' + DarwinModule.getGen();
    if (e2) e2.textContent = 'Fitness: ' + DarwinModule.getMeanFitness().toFixed(3);
    if (e3) e3.textContent = 'Mejor FRIF: ' + DarwinModule.getBestFRIF().toFixed(3);
  }

  return { init, render };
})();

// ============================================================
// CausalMapRenderer — mapa causal (Canvas en sección framework)
// ============================================================
const CausalMapRenderer = (() => {
  let canvas, ctx;

  const nodes = [
    { label: 'Flujo E',     x: 0.06 },
    { label: 'Disipación',  x: 0.20 },
    { label: 'Estabilidad', x: 0.34 },
    { label: 'Red. Explor.',x: 0.48 },
    { label: 'FRIF ↑',     x: 0.62 },
    { label: 'Asimetría',   x: 0.76 },
    { label: 'Selección',   x: 0.90 },
  ];

  const colors = ['#00b8d9','#f0a020','#00d4aa','#4488cc','#00d4aa','#8855cc','#e04040'];

  function init(c) {
    canvas = c;
    ctx = canvas.getContext('2d');
    render();
  }

  function render() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f1520';
    ctx.fillRect(0, 0, W, H);

    const cy = H / 2;
    const r = H * 0.28;

    // Dibujar flechas entre nodos
    for (let i = 0; i < nodes.length - 1; i++) {
      const x1 = nodes[i].x * W + r;
      const x2 = nodes[i + 1].x * W - r;
      ctx.strokeStyle = colors[i] + 'aa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, cy);
      ctx.lineTo(x2 - 6, cy);
      ctx.stroke();
      // Flecha
      ctx.fillStyle = colors[i] + 'aa';
      ctx.beginPath();
      ctx.moveTo(x2, cy);
      ctx.lineTo(x2 - 8, cy - 5);
      ctx.lineTo(x2 - 8, cy + 5);
      ctx.closePath();
      ctx.fill();
    }

    // Dibujar nodos
    for (let i = 0; i < nodes.length; i++) {
      const x = nodes[i].x * W;
      // Caja
      const tw = ctx.measureText(nodes[i].label).width + 16;
      const boxH = H * 0.5;
      ctx.fillStyle = colors[i] + '22';
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 1.5;
      _roundRect(ctx, x - tw / 2, cy - boxH / 2, tw, boxH, 4);
      ctx.fill();
      ctx.stroke();
      // Label
      ctx.fillStyle = colors[i];
      ctx.font = 'bold 11px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nodes[i].label, x, cy);
    }
  }

  function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  return { init, render };
})();

// ============================================================
// RegimeDiagramRenderer — diagrama de 3 regímenes (panel Física)
// ============================================================
const RegimeDiagramRenderer = (() => {
  let canvas, ctx;

  function init(c) {
    canvas = c;
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    render();
  }

  function render() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080c12';
    ctx.fillRect(0, 0, W, H);

    const regimes = [
      { label: 'Subcrítico', sub: 'E < E_c', color: '#e04040', x: 0.17 },
      { label: 'Umbral',     sub: 'E ≈ E_c', color: '#f0a020', x: 0.50 },
      { label: 'Supercrítico',sub:'E > E_c', color: '#00d4aa', x: 0.83 },
    ];

    const cy = H / 2;
    regimes.forEach(({ label, sub, color, x }) => {
      const cx = x * W;
      // Círculo
      const R = Math.min(W / 8, H * 0.32);
      ctx.fillStyle = color + '22';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy - 8, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Texto
      ctx.fillStyle = color;
      ctx.font = 'bold 10px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, cx, cy - 8);
      ctx.font = '9px Courier New';
      ctx.fillStyle = '#7a9ab8';
      ctx.fillText(sub, cx, cy + R + 12);
    });

    // Flecha transición
    ctx.strokeStyle = '#2a3d55';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(0.33 * W, cy - 8);
    ctx.lineTo(0.38 * W, cy - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.62 * W, cy - 8);
    ctx.lineTo(0.67 * W, cy - 8);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  return { init, render };
})();

// ============================================================
// UIController — maneja eventos de los controles
// ============================================================
const UIController = (() => {
  const PANEL_INFO = {
    network: {
      title: 'Red Química Autocatalítica',
      body: `<p>Simula 6 nodos con dinámicas tipo Lotka-Volterra simplificado.</p>
             <ul>
               <li><strong>Nodos:</strong> concentraciones de "especies" químicas (0..1).</li>
               <li><strong>Aristas verdes:</strong> flujo positivo (autocatálisis activa).</li>
               <li><strong>Aristas rojas:</strong> flujo negativo (inhibición).</li>
               <li><strong>k_auto:</strong> intensidad de autocatálisis. Mayor k → más ciclos auto-amplificantes.</li>
             </ul>
             <p class="warning">⚠ Simplificación: red de topología fija, sin difusión espacial, parámetros adimensionales.</p>`
    },
    attractor: {
      title: 'Atractor — Espacio de Fase',
      body: `<p>Oscilador de Van der Pol modificado con ruido estocástico (Euler-Maruyama).</p>
             <ul>
               <li><strong>Traza:</strong> últimas N posiciones (x,y) del sistema. Color: cian = reciente.</li>
               <li><strong>μ_vdp</strong> = max(0, (E - E_c) / (1 - E_c)): controla la no-linealidad.</li>
               <li><strong>Dim. ef.:</strong> estimación de dimensión efectiva basada en FRIF.</li>
               <li><strong>λ₁:</strong> exponente de Lyapunov proxy (E - E_c).</li>
             </ul>
             <p class="warning">⚠ No es un análisis de Lyapunov real. Es una estimación proxy.</p>`
    },
    frif: {
      title: 'FRIF vs Energía',
      body: `<p>Muestra la estimación de FRIF para el estado actual y la curva teórica FRIF_max(E).</p>
             <ul>
               <li><strong>Curva azul (punteada):</strong> cota FRIF_max(E) = α·E/(E+E_c)·(1-T).</li>
               <li><strong>Punto verde:</strong> estado actual del sistema (E actual, FRIF estimado).</li>
               <li><strong>Zona roja:</strong> región subcrítica E &lt; E_c.</li>
               <li><strong>Línea vertical roja:</strong> umbral crítico E_c.</li>
             </ul>
             <p>El punto debe quedar por debajo de la curva FRIF_max cuando el sistema es estable.</p>`
    },
    thermo: {
      title: 'Termodinámica del Sistema Abierto',
      body: `<p>Historia temporal de las variables termodinámicas clave.</p>
             <ul>
               <li><strong>ΔG (verde):</strong> energía libre interna disponible.</li>
               <li><strong>Disipación (ámbar):</strong> potencia disipada como calor = γ·E.</li>
               <li><strong>ΔS_exp (rojo):</strong> entropía exportada al entorno = Disip/T.</li>
             </ul>
             <p>Sistema lejos del equilibrio: ΔS_exp > 0 siempre que el sistema esté activo.</p>
             <p class="warning">⚠ Unidades adimensionales. Sin calibración física real.</p>`
    },
    quantum: {
      title: 'Campo Conceptual + Asimetría Biológica',
      body: `<p>Simulación conceptual de un campo escalar 2D con parámetros de asimetría biológica.</p>
             <ul>
               <li><strong>χ (quiralidad):</strong> modifica la rotación del campo. L = CCW, D = CW.</li>
               <li><strong>κ (curvatura):</strong> geometría como restricción del espacio de estados (inspiración einsteiniana: geometría = lenguaje, no gravedad).</li>
               <li><strong>ξ (correlación):</strong> correlación espacial del campo.</li>
               <li><strong>|P| (polaridad):</strong> vector de gradiente celular (flecha ámbar).</li>
               <li><strong>Advección:</strong> deriva direccional 5'→3'.</li>
             </ul>
             <p class="warning">⚠ "Cuántico" aquí es metafórico: es un campo clásico. No hay cuantización.</p>`
    }
  };

  function _bind(id, prop, transform) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const val = transform ? transform(el.value) : parseFloat(el.value);
      State[prop] = val;
      // Sincronizar con display adjunto
      const disp = el.parentElement ? el.parentElement.querySelector('.val-display') : null;
      if (disp) disp.textContent = typeof val === 'boolean' ? (val ? 'on' : 'off') : val.toFixed ? val.toFixed(2) : val;
    });
  }

  function _bindAngle(id, prop, displayId) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      State[prop] = parseFloat(el.value);
      const disp = document.getElementById(displayId);
      if (disp) disp.textContent = el.value + '°';
    });
  }

  function _bindCheck(id, prop) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', () => { State[prop] = el.checked; });
  }

  function _updateDisplay(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = typeof val === 'number' ? val.toFixed(2) : val;
  }

  function init() {
    // Header controls
    _bind('energy-slider', 'E');
    _bind('temp-slider',   'T');
    _bind('noise-slider',  'sigma');
    _bind('diss-slider',   'gamma');
    _bind('auto-slider',   'k_auto');
    _bind('ec-slider',     'Ec');

    // Sync display
    document.getElementById('energy-slider')?.addEventListener('input', e => document.getElementById('energy-val').textContent = parseFloat(e.target.value).toFixed(2));
    document.getElementById('temp-slider')?.addEventListener('input', e => document.getElementById('temp-val').textContent = parseFloat(e.target.value).toFixed(2));
    document.getElementById('noise-slider')?.addEventListener('input', e => document.getElementById('noise-val').textContent = parseFloat(e.target.value).toFixed(2));
    document.getElementById('diss-slider')?.addEventListener('input', e => document.getElementById('diss-val').textContent = parseFloat(e.target.value).toFixed(2));
    document.getElementById('auto-slider')?.addEventListener('input', e => document.getElementById('auto-val').textContent = parseFloat(e.target.value).toFixed(2));

    // Ec auto
    const ecAutoCheck = document.getElementById('ec-auto-check');
    const ecSlider = document.getElementById('ec-slider');
    const ecVal = document.getElementById('ec-val');
    if (ecAutoCheck && ecSlider) {
      ecAutoCheck.addEventListener('change', () => {
        State.Ec_auto = ecAutoCheck.checked;
        ecSlider.disabled = ecAutoCheck.checked;
        if (ecVal) ecVal.textContent = ecAutoCheck.checked ? 'auto' : parseFloat(ecSlider.value).toFixed(2);
      });
      ecSlider.addEventListener('input', () => {
        State.Ec = parseFloat(ecSlider.value);
        if (ecVal) ecVal.textContent = parseFloat(ecSlider.value).toFixed(2);
      });
    }

    // Panel controls
    document.getElementById('kauto-p1')?.addEventListener('input', e => { State.k_auto = parseFloat(e.target.value); document.getElementById('auto-slider').value = e.target.value; document.getElementById('auto-val').textContent = parseFloat(e.target.value).toFixed(2); });
    _bind('fin-slider', 'Fin');
    _bind('fout-slider', 'Fout');
    _bind('trace-len', 'trace_len', v => parseInt(v));
    _bindCheck('show-nullclines', 'show_nullclines');
    _bind('ec-panel', 'Ec');

    // Quantum field
    _bind('chi-slider', 'chi');
    _bind('kappa-slider', 'kappa');
    _bind('xi-slider', 'xi');
    _bind('polar-slider', 'P_mag');
    _bindAngle('polar-angle', 'P_angle', 'angle-val');
    _bind('advect-slider', 'advection');
    _bind('gfield-slider', 'g_field');

    // Display for quantum sliders
    ['chi-slider/chi-val', 'kappa-slider/kappa-val', 'xi-slider/xi-val',
     'polar-slider/polar-val', 'advect-slider/advect-val', 'gfield-slider/gfield-val'].forEach(pair => {
      const [sid, did] = pair.split('/');
      document.getElementById(sid)?.addEventListener('input', e => {
        const d = document.getElementById(did);
        if (d) d.textContent = parseFloat(e.target.value).toFixed(2);
      });
    });

    // L/D toggle
    const ldToggle = document.getElementById('ld-toggle');
    ldToggle?.addEventListener('change', () => { State.ld_inverted = ldToggle.checked; });

    // Darwin toggle
    const darwinToggle = document.getElementById('darwin-toggle');
    darwinToggle?.addEventListener('change', () => {
      State.darwin_on = darwinToggle.checked;
      if (State.darwin_on) DarwinModule.init();
    });

    // Darwin controls
    _bind('mu-slider', 'mu');
    _bind('sel-slider', 'sel_s');
    _bind('win-slider', 'window', v => parseInt(v));
    document.getElementById('mu-slider')?.addEventListener('input', e => document.getElementById('mu-val').textContent = parseFloat(e.target.value).toFixed(3));
    document.getElementById('sel-slider')?.addEventListener('input', e => document.getElementById('sel-val').textContent = parseFloat(e.target.value).toFixed(2));
    document.getElementById('win-slider')?.addEventListener('input', e => document.getElementById('win-val').textContent = parseInt(e.target.value));

    // Pause
    document.getElementById('btn-pause')?.addEventListener('click', () => {
      State.paused = !State.paused;
      const btn = document.getElementById('btn-pause');
      btn.textContent = State.paused ? '▶ Reanudar' : '⏸ Pausa';
      btn.classList.toggle('paused', State.paused);
      btn.setAttribute('aria-label', State.paused ? 'Reanudar simulación' : 'Pausar simulación');
    });

    // Reset
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      AttractorModel.reset();
      NetworkModel.reset();
      ThermoModel.reset();
      DarwinModule.init();
      State.time = 0;
      State.paused = false;
      document.getElementById('btn-pause').textContent = '⏸ Pausa';
      document.getElementById('btn-pause').classList.remove('paused');
    });

    // Export PNG
    document.getElementById('btn-export')?.addEventListener('click', ExportController.exportPNG);

    // Copy link
    document.getElementById('btn-link')?.addEventListener('click', () => {
      URLStateCodec.encode();
      navigator.clipboard?.writeText(window.location.href).then(() => {
        ToastSystem.show('Enlace copiado al portapapeles');
      }).catch(() => {
        ToastSystem.show('URL actualizada: ' + window.location.href);
      });
    });

    // Preset selector
    document.getElementById('preset-select')?.addEventListener('change', e => {
      Presets.apply(e.target.value);
    });

    // Info buttons
    document.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.dataset.panel;
        const info = PANEL_INFO[panel];
        if (info) TooltipSystem.showModal(info.title, info.body);
      });
    });

    // Tab system in how-to
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const target = document.getElementById(btn.getAttribute('aria-controls'));
        if (target) target.classList.add('active');
      });
    });

    // Tooltip button (FRIF calc)
    document.querySelectorAll('.tooltip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        TooltipSystem.showModal('Cómo se calcula FRIF', `
          <ol>
            <li>Se registran las últimas N posiciones (x,y) del atractor.</li>
            <li>Se divide el espacio [-3.5, 3.5]² en una cuadrícula ${GRID_SIZE}×${GRID_SIZE}.</li>
            <li>Se cuenta el número de celdas visitadas: n_occ.</li>
            <li>V_ef = n_occ / ${GRID_SIZE*GRID_SIZE} (fracción del espacio visitado).</li>
            <li>FRIF = −log(V_ef) / log(${GRID_SIZE*GRID_SIZE}).</li>
            <li>Normalizado: 0 = aleatorio (todo el espacio), 1 = perfectamente confinado.</li>
          </ol>
          <p class="warning">⚠ Aproximación. En investigación real: análisis de recurrencia, dimensión de correlación.</p>
        `);
      });
    });

    // Keyboard: space = pause
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        document.getElementById('btn-pause')?.click();
      }
    });

    // Asym badges keyboard
    document.querySelectorAll('.asym-badge').forEach(badge => {
      badge.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const ttId = badge.dataset.tooltip;
          const info = { chirality: 'Quiralidad', polarity: 'Polaridad', directionality: 'Direccionalidad 5\'→3\'', 'symmetry-break': 'Ruptura de Simetría' }[ttId] || ttId;
          const body = document.getElementById('tt-' + ttId.replace('-', ''))?.textContent || '';
          TooltipSystem.showModal(info, '<p>' + body + '</p>');
        }
      });
    });

    // Restore from URL hash
    URLStateCodec.decode();
  }

  function updateStatusBar() {
    const e1 = document.getElementById('status-frif');
    const e2 = document.getElementById('status-frif-max');
    const e3 = document.getElementById('status-regime');
    const e4 = document.getElementById('status-fps');
    const e5 = document.getElementById('status-time');
    if (e1) e1.textContent = State.frif.toFixed(4);
    if (e2) e2.textContent = State.frif_max.toFixed(4);
    if (e3) e3.textContent = State.regime;
    if (e4) e4.textContent = State.fps;
    if (e5) e5.textContent = State.time.toFixed(1) + 's';
  }

  return { init, updateStatusBar };
})();

// ============================================================
// Presets
// ============================================================
const Presets = (() => {
  const data = {
    sub: { E: 0.10, T: 0.40, sigma: 0.20, gamma: 0.30, k_auto: 0.30, chi: 0.30, kappa: 0.20, xi: 0.30, P_mag: 0.20, advection: 0.10, darwin_on: false },
    threshold: { E: 0.50, T: 0.30, sigma: 0.15, gamma: 0.20, k_auto: 0.60, chi: 0.70, kappa: 0.40, xi: 0.50, P_mag: 0.50, advection: 0.40, darwin_on: false },
    super: { E: 0.85, T: 0.15, sigma: 0.08, gamma: 0.15, k_auto: 0.80, chi: 0.70, kappa: 0.60, xi: 0.70, P_mag: 0.70, advection: 0.50, darwin_on: false },
    'chiral-L': { E: 0.65, T: 0.25, sigma: 0.12, gamma: 0.18, k_auto: 0.70, chi: 0.90, kappa: 0.50, xi: 0.60, P_mag: 0.40, advection: 0.40, ld_inverted: false, darwin_on: false },
    'chiral-D': { E: 0.65, T: 0.25, sigma: 0.12, gamma: 0.18, k_auto: 0.70, chi: 0.90, kappa: 0.50, xi: 0.60, P_mag: 0.40, advection: 0.40, ld_inverted: true, darwin_on: false },
    darwin: { E: 0.55, T: 0.25, sigma: 0.13, gamma: 0.18, k_auto: 0.65, chi: 0.60, kappa: 0.40, xi: 0.50, P_mag: 0.50, advection: 0.35, darwin_on: true, mu: 0.05, sel_s: 0.40, window: 50 },
  };

  const sliderMap = {
    E: 'energy-slider', T: 'temp-slider', sigma: 'noise-slider',
    gamma: 'diss-slider', k_auto: 'auto-slider',
    chi: 'chi-slider', kappa: 'kappa-slider', xi: 'xi-slider',
    P_mag: 'polar-slider', advection: 'advect-slider',
    mu: 'mu-slider', sel_s: 'sel-slider', window: 'win-slider',
  };

  const displayMap = {
    E: 'energy-val', T: 'temp-val', sigma: 'noise-val',
    gamma: 'diss-val', k_auto: 'auto-val',
    chi: 'chi-val', kappa: 'kappa-val', xi: 'xi-val',
    P_mag: 'polar-val', advection: 'advect-val',
    mu: 'mu-val', sel_s: 'sel-val', window: 'win-val',
  };

  function apply(name) {
    const p = data[name];
    if (!p) return;
    Object.assign(State, p);

    // Sync sliders
    for (const [key, sliderId] of Object.entries(sliderMap)) {
      const val = State[key];
      if (val !== undefined) {
        const sl = document.getElementById(sliderId);
        if (sl) sl.value = val;
        const disp = document.getElementById(displayMap[key]);
        if (disp) disp.textContent = typeof val === 'number' ? val.toFixed(2) : val;
      }
    }

    // L/D toggle
    const ldToggle = document.getElementById('ld-toggle');
    if (ldToggle) ldToggle.checked = State.ld_inverted || false;

    // Darwin toggle
    const darwinToggle = document.getElementById('darwin-toggle');
    if (darwinToggle) darwinToggle.checked = State.darwin_on;

    if (State.darwin_on) DarwinModule.init();
    AttractorModel.reset();
    NetworkModel.reset();
    ThermoModel.reset();
    State.time = 0;
  }

  return { apply };
})();

// ============================================================
// ExportController — exporta PNG de todos los canvases
// ============================================================
const ExportController = (() => {
  function exportPNG() {
    const canvases = ['canvas-network', 'canvas-attractor', 'canvas-frif', 'canvas-thermo', 'canvas-quantum'];
    // Crear un canvas combinado
    const cols = 3, rows = 2;
    const W = 900, H = 600;
    const cw = W / cols, ch = H / rows;
    const out = document.createElement('canvas');
    out.width = W; out.height = H;
    const octx = out.getContext('2d');
    octx.fillStyle = '#0a0e14';
    octx.fillRect(0, 0, W, H);

    const positions = [[0,0],[1,0],[2,0],[0,1],[1,1]];
    canvases.forEach((id, idx) => {
      const c = document.getElementById(id);
      if (!c) return;
      const [col, row] = positions[idx];
      try { octx.drawImage(c, col * cw, row * ch, cw, ch); } catch(e) {}
    });

    // Watermark
    octx.fillStyle = '#ffffff22';
    octx.font = '10px Courier New';
    octx.textAlign = 'right';
    octx.fillText('DQRI/FRIF Lab — Simulación conceptual', W - 8, H - 6);

    // Download
    const a = document.createElement('a');
    a.download = `dqri-frif-${Date.now()}.png`;
    a.href = out.toDataURL('image/png');
    a.click();
  }

  return { exportPNG };
})();

// ============================================================
// URLStateCodec — serializa/deserializa estado en URL hash
// ============================================================
const URLStateCodec = (() => {
  const keys = ['E','T','sigma','gamma','k_auto','Ec','Ec_auto','chi','kappa','xi',
                'P_mag','P_angle','advection','g_field','ld_inverted','darwin_on',
                'mu','sel_s','window','trace_len'];

  function encode() {
    const parts = keys.map(k => `${k}=${encodeURIComponent(State[k])}`);
    window.location.hash = parts.join('&');
  }

  function decode() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    // Parse as key=val pairs
    hash.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      if (!keys.includes(k)) return;
      const decoded = decodeURIComponent(v);
      if (decoded === 'true') State[k] = true;
      else if (decoded === 'false') State[k] = false;
      else if (!isNaN(parseFloat(decoded))) State[k] = parseFloat(decoded);
    });
    // Sync UI
    Presets.apply('threshold'); // Reset UI first
    // Re-apply decoded state
    hash.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      if (!keys.includes(k)) return;
      const decoded = decodeURIComponent(v);
      if (decoded === 'true') State[k] = true;
      else if (decoded === 'false') State[k] = false;
      else if (!isNaN(parseFloat(decoded))) State[k] = parseFloat(decoded);
    });
  }

  return { encode, decode };
})();

// ============================================================
// TooltipSystem + ToastSystem
// ============================================================
const TooltipSystem = (() => {
  function showModal(title, body) {
    const modal = document.getElementById('info-modal');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    if (!modal) return;
    titleEl.textContent = title;
    bodyEl.innerHTML = body;
    modal.hidden = false;
    modal.querySelector('.modal-close')?.focus();
  }

  function hideModal() {
    const modal = document.getElementById('info-modal');
    if (modal) modal.hidden = true;
  }

  function init() {
    document.getElementById('info-modal')?.querySelector('.modal-close')?.addEventListener('click', hideModal);
    document.getElementById('info-modal')?.addEventListener('click', e => {
      if (e.target === document.getElementById('info-modal')) hideModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') hideModal();
    });
  }

  return { showModal, hideModal, init };
})();

const ToastSystem = (() => {
  let timeout = null;
  function show(msg, duration = 2500) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => { t.hidden = true; }, duration);
  }
  return { show };
})();

// ============================================================
// Engine — bucle principal de animación
// ============================================================
const Engine = (() => {
  let running = false;
  let lastStatusUpdate = 0;
  let initDone = false;

  function _initCanvases() {
    NetworkRenderer.init(document.getElementById('canvas-network'));
    AttractorRenderer.init(document.getElementById('canvas-attractor'));
    SparklineRenderer.init(document.getElementById('sparkline-frif'));
    FRIFChartRenderer.init(document.getElementById('canvas-frif'));
    ThermoRenderer.init(document.getElementById('canvas-thermo'));
    QuantumFieldRenderer.init(document.getElementById('canvas-quantum'));
    DarwinRenderer.init(document.getElementById('canvas-darwin'));
    CausalMapRenderer.init(document.getElementById('causal-map'));
    RegimeDiagramRenderer.init(document.getElementById('regime-diagram'));

    // ResizeObserver para canvases responsivos
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        NetworkRenderer.init(document.getElementById('canvas-network'));
        AttractorRenderer.init(document.getElementById('canvas-attractor'));
        FRIFChartRenderer.init(document.getElementById('canvas-frif'));
        ThermoRenderer.init(document.getElementById('canvas-thermo'));
        QuantumFieldRenderer.init(document.getElementById('canvas-quantum'));
        QuantumFieldRenderer._resize();
      });
      ['canvas-network','canvas-attractor','canvas-frif','canvas-thermo','canvas-quantum'].forEach(id => {
        const el = document.getElementById(id);
        if (el) ro.observe(el);
      });
    }
  }

  function loop(now) {
    if (!running) return;
    PerformanceScaler.update(now);

    if (!State.paused) {
      const steps = PerformanceScaler.getSteps();
      for (let s = 0; s < steps; s++) {
        AttractorModel.step();
        NetworkModel.step();
        ThermoModel.step();
        QuantumFieldModel.step(DT);
        DarwinModule.step();
        State.time += DT;
      }
      FRIFEstimator.update();
    }

    // Render all panels
    NetworkRenderer.render();
    AttractorRenderer.render();
    SparklineRenderer.render();
    FRIFChartRenderer.render();
    ThermoRenderer.render();
    QuantumFieldRenderer.render();
    DarwinRenderer.render();

    // Update status bar (throttled)
    if (now - lastStatusUpdate > 250) {
      UIController.updateStatusBar();
      lastStatusUpdate = now;
    }

    State.frame_count++;
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(loop);
  }

  function init() {
    if (initDone) return;
    initDone = true;
    _initCanvases();
    UIController.init();
    TooltipSystem.init();
    DarwinModule.init();
    CausalMapRenderer.render();
    start();
  }

  return { init, start };
})();

// ============================================================
// Bootstrap
// ============================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Engine.init);
} else {
  Engine.init();
}

/* ============================================================
   CHECKLIST QA
   ─────────────────────────────────────────────────────────────
   [x] Sin dependencias externas (CDN, frameworks, librerías)
   [x] Funciona 100% offline abriendo index.html directamente
   [x] Canvas generativo: sin imágenes externas
   [x] Todos los controles tienen aria-label
   [x] Foco visible (outline) en todos los elementos interactivos
   [x] prefers-reduced-motion respetado en CSS
   [x] Contraste: texto principal #c8d8e8 sobre #0a0e14 (> 4.5:1)
   [x] Navegación por teclado: Tab, Enter, Space funcionales
   [x] Modal con Escape funcional
   [x] URL hash encode/decode para reproducibilidad
   [x] Export PNG funcional (fusiona 5 canvases)
   [x] PerformanceScaler ajusta steps_per_frame por FPS
   [x] ResizeObserver reinicia canvases en resize
   [x] FRIF entre 0 y 1, FRIF_max analítica consistente
   [x] AttractorModel: damping estabilizador previene divergencia
   [x] NetworkModel: concentraciones clampeadas [0,1]
   [x] Quiralidad L/D: toggle ld_inverted invierte el campo
   [x] Darwin: selección proporcional a fitness × exp(s)
   [x] Presets: todos aplican estado y sincronizan UI
   [x] Tooltips / modales con información científica por panel
   [x] Footer y disclaimers: "Simulación conceptual" visible
   [x] No misticismo, no fuerzas nuevas, no afirmaciones experimentales
   [x] Código comentado (GUÍA DE AJUSTE al inicio, QA al final)
   ─────────────────────────────────────────────────────────────
   Versión: v0.1 — Demo conceptual (2025)
   ============================================================ */
