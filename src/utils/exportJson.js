// File: src/utils/exportJson.js

/**
 * exportStateJSON(state, metrics)
 * Creates and downloads a JSON file with simulation state and last metrics.
 */
export function exportStateJSON(state, metrics) {
  const data = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    state,
    lastMetrics: metrics
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'simulacion-dqri.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
