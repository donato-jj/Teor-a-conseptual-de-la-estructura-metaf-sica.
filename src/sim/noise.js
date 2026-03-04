// File: src/sim/noise.js

/**
 * createRNG(seed) -> { next(), nextFloat(), nextGaussian() }
 * Reproducible LCG-based RNG with Box-Muller Gaussian.
 */
export function createRNG(seed) {
  let s = (seed >>> 0) || 1;
  let _spare = null;
  let _hasSpare = false;

  function next() {
    s = Math.imul(1664525, s) + 1013904223 >>> 0;
    return s;
  }

  function nextFloat() {
    return (next() >>> 0) / 0x100000000;
  }

  function nextGaussian() {
    if (_hasSpare) {
      _hasSpare = false;
      return _spare;
    }
    let u, v, s2;
    do {
      u = nextFloat() * 2 - 1;
      v = nextFloat() * 2 - 1;
      s2 = u * u + v * v;
    } while (s2 >= 1 || s2 === 0);
    const mag = Math.sqrt(-2 * Math.log(s2) / s2);
    _spare = v * mag;
    _hasSpare = true;
    return u * mag;
  }

  return { next, nextFloat, nextGaussian };
}
