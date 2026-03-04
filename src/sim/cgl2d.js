// File: src/sim/cgl2d.js
import { createRNG } from './noise.js';
import { computePotential } from './potential.js';

/**
 * createCGLSim(opts) -> sim
 * Complex Ginzburg-Landau equation on 2D grid with dissipation & noise.
 *
 * ∂ψ/∂t = ψ + (1+iα)∇²ψ - (1+iβ)|ψ|²ψ - γψ - V(x,y)ψ + η·ξ(x,y,t)
 *
 * Discretization: explicit Euler, 5-point Laplacian, periodic or reflective BC.
 */
export function createCGLSim(opts = {}) {
  let N = opts.N || 256;
  let alpha = opts.alpha !== undefined ? opts.alpha : 0.35;
  let beta = opts.beta !== undefined ? opts.beta : 1.10;
  let gamma = opts.gamma !== undefined ? opts.gamma : 0.08;
  let dt = opts.dt !== undefined ? opts.dt : 0.018;
  let vAmp = opts.vAmp !== undefined ? opts.vAmp : 1.25;
  let noiseAmp = opts.noiseAmp !== undefined ? opts.noiseAmp : 0.18;
  let noiseOn = opts.noiseOn !== undefined ? opts.noiseOn : true;
  let boundary = opts.boundary || 'periodic';
  let vMode = opts.vMode || 'gaussian';
  let seed = opts.seed !== undefined ? opts.seed : 1337;

  let re, im, re2, im2, V;
  let rng;
  let _eHistory = [];
  const E_HIST_LEN = 60;

  function _alloc() {
    re = new Float32Array(N * N);
    im = new Float32Array(N * N);
    re2 = new Float32Array(N * N);
    im2 = new Float32Array(N * N);
  }

  function reset(s) {
    if (s !== undefined) seed = s;
    rng = createRNG(seed);
    _eHistory = [];
    V = computePotential(N, vMode, vAmp, seed);
    // Initialize with small random perturbations
    for (let i = 0; i < N * N; i++) {
      re[i] = rng.nextGaussian() * 0.1;
      im[i] = rng.nextGaussian() * 0.1;
    }
  }

  function resizeGrid(newN) {
    N = newN;
    _alloc();
    reset();
  }

  function _idx(i, j) {
    return j * N + i;
  }

  function _wrap(v, n) {
    return ((v % n) + n) % n;
  }

  function _getNeighbors(i, j) {
    let im1, ip1, jm1, jp1;
    if (boundary === 'periodic') {
      im1 = _wrap(i - 1, N);
      ip1 = _wrap(i + 1, N);
      jm1 = _wrap(j - 1, N);
      jp1 = _wrap(j + 1, N);
    } else {
      im1 = Math.max(0, i - 1);
      ip1 = Math.min(N - 1, i + 1);
      jm1 = Math.max(0, j - 1);
      jp1 = Math.min(N - 1, j + 1);
    }
    return { im1, ip1, jm1, jp1 };
  }

  function step(nSteps = 1) {
    for (let s = 0; s < nSteps; s++) {
      _stepOnce();
    }
  }

  function _stepOnce() {
    const N2 = N * N;

    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const k = _idx(i, j);
        const { im1, ip1, jm1, jp1 } = _getNeighbors(i, j);

        const re_c = re[k];
        const im_c = im[k];

        // 5-point Laplacian
        const lapRe = re[_idx(ip1, j)] + re[_idx(im1, j)] + re[_idx(i, jp1)] + re[_idx(i, jm1)] - 4 * re_c;
        const lapIm = im[_idx(ip1, j)] + im[_idx(im1, j)] + im[_idx(i, jp1)] + im[_idx(i, jm1)] - 4 * im_c;

        // |ψ|²
        const amp2 = re_c * re_c + im_c * im_c;

        // Diffusion term: (1+iα)∇²ψ
        const diffRe = lapRe - alpha * lapIm;
        const diffIm = lapIm + alpha * lapRe;

        // Nonlinear term: -(1+iβ)|ψ|²ψ
        const nlRe = -(amp2) * re_c + beta * amp2 * im_c;
        const nlIm = -(amp2) * im_c - beta * amp2 * re_c;

        // Potential term: -V·ψ
        const vk = V[k];
        const potRe = -vk * re_c;
        const potIm = -vk * im_c;

        // Noise
        let noiseRe = 0, noiseIm = 0;
        if (noiseOn) {
          noiseRe = rng.nextGaussian() * noiseAmp;
          noiseIm = rng.nextGaussian() * noiseAmp;
        }

        // Growth term: +ψ, dissipation: -γψ
        const growthRe = re_c * (1 - gamma);
        const growthIm = im_c * (1 - gamma);

        // Euler step: ψ_new = ψ + dt*(growth + diff + nl + pot + noise)
        re2[k] = re_c + dt * (growthRe + diffRe + nlRe + potRe + noiseRe);
        im2[k] = im_c + dt * (growthIm + diffIm + nlIm + potIm + noiseIm);
      }
    }

    // Swap buffers
    const tmp1 = re; re = re2; re2 = tmp1;
    const tmp2 = im; im = im2; im2 = tmp2;
  }

  function getField() {
    return { re, im, N };
  }

  function getMetrics() {
    const N2 = N * N;
    let sumAmp2 = 0;
    let sumGrad2 = 0;
    let sumVAmp2 = 0;

    // Histogram for entropy (64 bins)
    const BINS = 64;
    const hist = new Float32Array(BINS);

    // Phase sums for coherence
    let sumCosP = 0, sumSinP = 0;

    // For asym: sin(phase) * laplacian(phase)
    let sumAsym = 0;

    // First pass: compute sums and find maxAmp for histogram normalization
    let maxAmp = 0;
    for (let k = 0; k < N2; k++) {
      const amp2 = re[k] * re[k] + im[k] * im[k];
      const amp = Math.sqrt(amp2);
      if (amp > maxAmp) maxAmp = amp;
      sumAmp2 += amp2;
    }

    // Second pass: gradients, phase, asym, histogram (uses maxAmp from first pass)
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const k = _idx(i, j);
        const { im1, ip1, jm1, jp1 } = _getNeighbors(i, j);

        const re_c = re[k], im_c = im[k];
        const amp2 = re_c * re_c + im_c * im_c;
        const amp = Math.sqrt(amp2);

        // Gradient (central differences)
        const dxRe = (re[_idx(ip1, j)] - re[_idx(im1, j)]) * 0.5;
        const dyRe = (re[_idx(i, jp1)] - re[_idx(i, jm1)]) * 0.5;
        const dxIm = (im[_idx(ip1, j)] - im[_idx(im1, j)]) * 0.5;
        const dyIm = (im[_idx(i, jp1)] - im[_idx(i, jm1)]) * 0.5;
        sumGrad2 += dxRe * dxRe + dyRe * dyRe + dxIm * dxIm + dyIm * dyIm;

        sumVAmp2 += V[k] * amp2;

        // Phase
        const phase = Math.atan2(im_c, re_c);
        sumCosP += Math.cos(phase);
        sumSinP += Math.sin(phase);

        // Phase laplacian (for asym)
        const p_c = phase;
        const p_r = Math.atan2(im[_idx(ip1, j)], re[_idx(ip1, j)]);
        const p_l = Math.atan2(im[_idx(im1, j)], re[_idx(im1, j)]);
        const p_u = Math.atan2(im[_idx(i, jp1)], re[_idx(i, jp1)]);
        const p_d = Math.atan2(im[_idx(i, jm1)], re[_idx(i, jm1)]);
        const lapP = p_r + p_l + p_u + p_d - 4 * p_c;
        sumAsym += Math.sin(p_c) * lapP;

        // Histogram bin (maxAmp from first pass ensures correct normalization)
        const binIdx = Math.min(BINS - 1, Math.floor((amp / (maxAmp + 1e-12)) * BINS));
        hist[binIdx] += 1;
      }
    }

    const invN2 = 1 / N2;
    // E_total = mean(grad² + V·amp² + 0.5·amp⁴)
    // sumVAmp2 = Σ V[k]·amp2[k] already encodes the potential amplitude via V values
    const E = (sumGrad2 + sumVAmp2 + 0.5 * sumAmp2 * sumAmp2 * invN2) * invN2;
    const D = gamma * sumAmp2 * invN2;
    // Ein: energy proxy for "injected" growth term (mean of amp2, proportional to +ψ term)
    const Ein = sumAmp2 * invN2;

    // Shannon entropy over amplitude histogram
    let S = 0;
    const invTot = 1 / (N2 + 1e-12);
    for (let b = 0; b < BINS; b++) {
      const p = hist[b] * invTot;
      S -= p * Math.log(p + 1e-12);
    }

    // Coherence
    const coh = Math.sqrt((sumCosP * sumCosP + sumSinP * sumSinP)) * invN2;

    // I_eff
    const Smax = Math.log(BINS);
    const Ieff = Math.min(1, Math.max(0, (Smax - S) / Smax)) + 0.35 * coh;

    // Stability over recent E window
    _eHistory.push(E);
    if (_eHistory.length > E_HIST_LEN) _eHistory.shift();
    let varE = 0;
    if (_eHistory.length > 1) {
      const meanE = _eHistory.reduce((a, b) => a + b, 0) / _eHistory.length;
      varE = _eHistory.reduce((a, b) => a + (b - meanE) ** 2, 0) / _eHistory.length;
    }
    const Stab = 1 / (varE + 1e-9);

    // FRIF
    const FRIF = (Ieff * Stab) / (Ein + 1e-6);

    // Asym
    const asymRaw = sumAsym * invN2;
    const asymMax = Math.PI * Math.PI;
    const asym = Math.min(1, Math.max(-1, asymRaw / (asymMax + 1e-9)));

    return { E, Ein, D, S, FRIF, asym, dEdt: _eHistory.length > 1 ? E - _eHistory[_eHistory.length - 2] : 0 };
  }

  function setParams(params) {
    if (params.alpha !== undefined) alpha = params.alpha;
    if (params.beta !== undefined) beta = params.beta;
    if (params.gamma !== undefined) gamma = params.gamma;
    if (params.dt !== undefined) dt = params.dt;
    if (params.vAmp !== undefined) vAmp = params.vAmp;
    if (params.noiseAmp !== undefined) noiseAmp = params.noiseAmp;
    if (params.noiseOn !== undefined) noiseOn = params.noiseOn;
    if (params.boundary !== undefined) boundary = params.boundary;
    if (params.vMode !== undefined) {
      vMode = params.vMode;
      V = computePotential(N, vMode, vAmp, seed);
    }
  }

  _alloc();
  reset();

  return { step, reset, resizeGrid, getField, getMetrics, setParams };
}
