// File: src/charts/attractor.js

/**
 * Attractor: phase-space plot (E vs dE/dt).
 */
export class Attractor {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.maxPoints = opts.maxPoints || 400;
    this.points = []; // {x, y}
    this.trail = new Uint8Array(0);
  }

  push(E, dEdt) {
    this.points.push({ x: E, y: dEdt });
    if (this.points.length > this.maxPoints) this.points.shift();
  }

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;

    // Fade trail
    ctx.fillStyle = 'rgba(11,16,32,0.18)';
    ctx.fillRect(0, 0, W, H);

    if (this.points.length < 2) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of this.points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const rx = maxX - minX || 1e-6;
    const ry = maxY - minY || 1e-6;
    const pad = 0.08;

    const toX = v => (v - minX) / rx * W * (1 - 2 * pad) + W * pad;
    const toY = v => H - ((v - minY) / ry * H * (1 - 2 * pad) + H * pad);

    ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const px = toX(this.points[i].x);
      const py = toY(this.points[i].y);
      const t = i / this.points.length;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#73a6ff';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.75;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Latest point
    const last = this.points[this.points.length - 1];
    ctx.beginPath();
    ctx.arc(toX(last.x), toY(last.y), 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#7cffc7';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#6f83a6';
    ctx.font = '9px ui-monospace, monospace';
    ctx.fillText('E →', W - 22, H - 4);
    ctx.fillText('dE/dt', 2, 12);
  }
}
