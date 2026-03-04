// File: src/charts/plot2d.js

/**
 * Plot2D: rolling time-series chart for FRIF vs Energy.
 */
export class Plot2D {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.maxPoints = opts.maxPoints || 200;
    this.seriesE = [];
    this.seriesFRIF = [];
  }

  push(E, FRIF) {
    this.seriesE.push(E);
    this.seriesFRIF.push(FRIF);
    if (this.seriesE.length > this.maxPoints) {
      this.seriesE.shift();
      this.seriesFRIF.shift();
    }
  }

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(120,170,255,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 4; x++) {
      const px = Math.round(x / 4 * W) + 0.5;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }
    for (let y = 0; y <= 4; y++) {
      const py = Math.round(y / 4 * H) + 0.5;
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }

    if (this.seriesE.length < 2) return;

    const maxE = Math.max(...this.seriesE, 0.001);
    const maxF = Math.max(...this.seriesFRIF, 0.001);

    const drawLine = (series, maxV, color) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let i = 0; i < series.length; i++) {
        const x = (i / (this.maxPoints - 1)) * W;
        const y = H - (series[i] / maxV) * (H * 0.9) - H * 0.05;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    drawLine(this.seriesE, maxE, '#73a6ff');
    drawLine(this.seriesFRIF, maxF, '#7cffc7');

    // Legend
    ctx.fillStyle = '#73a6ff';
    ctx.font = '10px ui-monospace, monospace';
    ctx.fillText('E', 6, 14);
    ctx.fillStyle = '#7cffc7';
    ctx.fillText('FRIF', 20, 14);
  }
}
