// File: src/app/state.js

export const PRESETS = {
  stable: {
    name: 'Stable',
    alpha: 0.35, beta: 1.10, gamma: 0.10, dt: 0.016,
    vMode: 'gaussian', vAmp: 1.0, noiseOn: true, noiseAmp: 0.12,
    grid: 256, renderScale: 0.75, mode: 'amplitude', seed: 1337
  },
  turbulent: {
    name: 'Turbulent',
    alpha: 1.35, beta: 0.85, gamma: 0.04, dt: 0.020,
    vMode: 'noise', vAmp: 1.7, noiseOn: true, noiseAmp: 0.28,
    grid: 384, renderScale: 0.5, mode: 'phase', seed: 2027
  },
  highAsym: {
    name: 'High Asymmetry',
    alpha: -0.90, beta: 1.40, gamma: 0.06, dt: 0.018,
    vMode: 'gradient', vAmp: 2.2, noiseOn: true, noiseAmp: 0.22,
    grid: 256, renderScale: 0.75, mode: 'asym', seed: 777
  },
  lowDiss: {
    name: 'Low Dissipation',
    alpha: 0.60, beta: 1.05, gamma: 0.015, dt: 0.022,
    vMode: 'gaussian', vAmp: 1.3, noiseOn: false, noiseAmp: 0.00,
    grid: 384, renderScale: 0.5, mode: 'energy', seed: 909
  }
};

export const DEFAULT_STATE = { ...PRESETS.stable };

export function applyPreset(name) {
  const key = name.toLowerCase().replace(/\s+/g, '').replace('asymmetry', 'asym').replace('dissipation', 'diss');
  const presetMap = {
    'stable': PRESETS.stable,
    'turbulent': PRESETS.turbulent,
    'highasym': PRESETS.highAsym,
    'highasymmetry': PRESETS.highAsym,
    'lowdiss': PRESETS.lowDiss,
    'lowdissipation': PRESETS.lowDiss,
  };
  return presetMap[key] || PRESETS.stable;
}
