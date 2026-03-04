// File: src/sim/potential.js
import { createRNG } from './noise.js';

/**
 * computePotential(N, mode, amp, seed) -> Float32Array (length N*N)
 * Modes: gaussian | gradient | noise
 */
export function computePotential(N, mode, amp, seed) {
  const V = new Float32Array(N * N);
  const cx = N / 2, cy = N / 2;
  const rng = createRNG(seed);

  if (mode === 'gaussian') {
    const sigma2 = (N * 0.25) ** 2;
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const dx = i - cx, dy = j - cy;
        V[j * N + i] = -amp * Math.exp(-(dx * dx + dy * dy) / sigma2);
      }
    }
  } else if (mode === 'gradient') {
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        V[j * N + i] = amp * (i / (N - 1) * 2 - 1);
      }
    }
  } else if (mode === 'noise') {
    // Smooth noise via superposition of random gaussians
    const nBumps = 16;
    for (let b = 0; b < nBumps; b++) {
      const bx = rng.nextFloat() * N;
      const by = rng.nextFloat() * N;
      const s2 = (N * 0.1) ** 2;
      const sign = rng.nextFloat() > 0.5 ? 1 : -1;
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const dx = i - bx, dy = j - by;
          V[j * N + i] += sign * amp * Math.exp(-(dx * dx + dy * dy) / s2) / nBumps;
        }
      }
    }
  }

  return V;
}
