// File: src/utils/urlState.js

const KEYS = ['preset','alpha','beta','gamma','dt','boundary','vMode','vAmp','noiseOn','noiseAmp','seed','grid','renderScale','mode'];

/**
 * loadStateFromURL(defaults) -> state
 * Reads serialized params from URL search params and merges with defaults.
 */
export function loadStateFromURL(defaults) {
  const params = new URLSearchParams(window.location.search);
  const state = Object.assign({}, defaults);
  for (const k of KEYS) {
    if (params.has(k)) {
      const raw = params.get(k);
      if (k === 'noiseOn') {
        state[k] = raw === 'true';
      } else if (['alpha','beta','gamma','dt','vAmp','noiseAmp','renderScale'].includes(k)) {
        const v = parseFloat(raw);
        if (!isNaN(v)) state[k] = v;
      } else if (['seed','grid'].includes(k)) {
        const v = parseInt(raw, 10);
        if (!isNaN(v)) state[k] = v;
      } else {
        state[k] = raw;
      }
    }
  }
  return state;
}

/**
 * writeStateToURL(state)
 * Serializes state to URL search params without page reload.
 */
export function writeStateToURL(state) {
  const params = new URLSearchParams();
  for (const k of KEYS) {
    if (state[k] !== undefined) {
      params.set(k, String(state[k]));
    }
  }
  const url = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', url);
}
