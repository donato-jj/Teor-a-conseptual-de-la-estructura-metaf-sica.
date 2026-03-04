// File: src/widgets/graphNetwork.js

/**
 * GraphNetwork: animated autocatalytic chemical network.
 * Nodes represent chemical species; edges represent catalytic reactions.
 */
export class GraphNetwork {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.N = opts.nodes || 8;
    this.nodes = [];
    this.edges = [];
    this._init();
  }

  _init() {
    const W = this.canvas.width, H = this.canvas.height;
    const cx = W / 2, cy = H / 2;
    const r = Math.min(W, H) * 0.35;
    this.nodes = [];
    for (let i = 0; i < this.N; i++) {
      const angle = (i / this.N) * 2 * Math.PI;
      this.nodes.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        activity: Math.random(),
        label: String.fromCharCode(65 + i),
      });
    }
    this.edges = [];
    for (let i = 0; i < this.N; i++) {
      for (let j = i + 1; j < this.N; j++) {
        if (Math.random() < 0.4) {
          this.edges.push({ from: i, to: j, strength: Math.random() });
        }
      }
    }
    // Ensure at least one edge
    if (this.edges.length === 0) {
      this.edges.push({ from: 0, to: 1, strength: 0.8 });
    }
  }

  update(metrics) {
    const t = performance.now() * 0.001;
    const activity = metrics ? Math.min(1, metrics.Ein || 0) : 0.3;
    for (let i = 0; i < this.nodes.length; i++) {
      const nd = this.nodes[i];
      nd.activity = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.7 + i * 1.3 + activity * 2));
    }
  }

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, W, H);

    // Draw edges
    for (const e of this.edges) {
      const a = this.nodes[e.from], b = this.nodes[e.to];
      const alpha = 0.2 + e.strength * 0.5;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(115,166,255,${alpha.toFixed(2)})`;
      ctx.lineWidth = 1 + e.strength * 1.5;
      ctx.stroke();

      // Arrow
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -4);
      ctx.lineTo(-8, 4);
      ctx.closePath();
      ctx.fillStyle = `rgba(124,255,199,${(alpha * 0.8).toFixed(2)})`;
      ctx.fill();
      ctx.restore();
    }

    // Draw nodes
    const nodeR = Math.min(W, H) * 0.055;
    for (let i = 0; i < this.nodes.length; i++) {
      const nd = this.nodes[i];
      const glow = Math.round(nd.activity * 255);

      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nodeR, 0, 2 * Math.PI);
      const grad = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, nodeR);
      grad.addColorStop(0, `rgba(${glow}, ${Math.round(166 + nd.activity * 60)}, 255, 0.9)`);
      grad.addColorStop(1, `rgba(11, 16, 32, 0.6)`);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = `rgba(115,166,255,0.6)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#e9f1ff';
      ctx.font = `bold ${Math.round(nodeR * 0.9)}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nd.label, nd.x, nd.y);
    }
  }
}
