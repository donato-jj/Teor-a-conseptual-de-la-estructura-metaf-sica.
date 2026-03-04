// File: src/utils/perf.js
const WINDOW = 60;
let times = [];
let lastT = performance.now();

export function tickFrame() {
  const now = performance.now();
  const dt = now - lastT;
  lastT = now;
  times.push(dt);
  if (times.length > WINDOW) times.shift();
}

export function getFPS() {
  if (times.length < 2) return 0;
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  return avg > 0 ? 1000 / avg : 0;
}

export function getMS() {
  if (times.length === 0) return 0;
  return times[times.length - 1];
}

export function getPerfString() {
  const fps = getFPS();
  const ms = getMS();
  return `FPS: ${fps.toFixed(1)} | ms: ${ms.toFixed(2)}`;
}
