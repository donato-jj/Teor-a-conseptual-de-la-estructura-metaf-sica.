// File: src/render/gauges.js

/**
 * Draws 3 semicircular gauges on gaugeCanvas and updates #gaugeNumbers.
 */

function drawGauge(ctx, cx, cy, radius, value, label, color, minV, maxV) {
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const t = Math.min(1, Math.max(0, (value - minV) / (maxV - minV + 1e-9)));
  const fillAngle = startAngle + t * Math.PI;

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.strokeStyle = '#1a2540';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Fill arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, fillAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Label
  ctx.fillStyle = '#a9b7d1';
  ctx.font = '11px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, cx, cy + 16);

  // Value
  ctx.fillStyle = color;
  ctx.font = 'bold 13px ui-monospace, monospace';
  ctx.fillText(value.toFixed(3), cx, cy + 2);
}

export function drawGauges(canvas, metrics) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const { E = 0, D = 0, S = 0 } = metrics || {};

  const r = Math.min(W / 8, H * 0.38);
  const y = H * 0.55;
  const x1 = W * 0.18, x2 = W * 0.5, x3 = W * 0.82;

  drawGauge(ctx, x1, y, r, E, 'E_total', '#73a6ff', 0, 5);
  drawGauge(ctx, x2, y, r, D, 'Disipación', '#7cffc7', 0, 2);
  drawGauge(ctx, x3, y, r, S, 'Entropía', '#ffcc66', 0, 5);

  // Update text readout
  const el = document.getElementById('gaugeNumbers');
  if (el) {
    el.innerHTML = `
      <span style="color:#73a6ff">E_total: ${E.toFixed(3)}</span>&nbsp;
      <span style="color:#7cffc7">Disipación: ${D.toFixed(3)}</span>&nbsp;
      <span style="color:#ffcc66">Entropía: ${S.toFixed(3)}</span>
    `;
  }
}
