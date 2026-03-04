// File: src/render/fieldRenderer.js

/**
 * renderField(ctx, field, metrics, opts)
 * Renders the complex field onto a 2D canvas using ImageData and LUT for performance.
 * modes: amplitude | phase | energy | asym
 */

// Build LUT (256 entries, each [r,g,b])
function buildLUT(mode) {
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r, g, b;
    if (mode === 'amplitude') {
      // Blue -> Cyan -> White
      r = Math.round(t * t * 200);
      g = Math.round(t * 220);
      b = Math.round(100 + t * 155);
    } else if (mode === 'phase') {
      // HSL hue cycle
      const h = t * 360;
      const [rr, gg, bb] = hslToRgb(h, 1.0, 0.5);
      r = rr; g = gg; b = bb;
    } else if (mode === 'energy') {
      // Black -> Deep blue -> Cyan -> Yellow -> White
      if (t < 0.25) {
        r = 0; g = 0; b = Math.round(t * 4 * 180);
      } else if (t < 0.5) {
        const u = (t - 0.25) * 4;
        r = 0; g = Math.round(u * 200); b = Math.round(180 + u * 75);
      } else if (t < 0.75) {
        const u = (t - 0.5) * 4;
        r = Math.round(u * 255); g = Math.round(200 + u * 55); b = Math.round(255 - u * 255);
      } else {
        const u = (t - 0.75) * 4;
        r = 255; g = 255; b = Math.round(u * 200);
      }
    } else {
      // asym: negative = red, neutral = dark, positive = green
      if (t < 0.5) {
        const u = t * 2;
        r = Math.round((1 - u) * 200); g = 0; b = Math.round(u * 40);
      } else {
        const u = (t - 0.5) * 2;
        r = 0; g = Math.round(u * 200); b = Math.round(40 + u * 80);
      }
    }
    lut[i * 3] = Math.min(255, Math.max(0, r));
    lut[i * 3 + 1] = Math.min(255, Math.max(0, g));
    lut[i * 3 + 2] = Math.min(255, Math.max(0, b));
  }
  return lut;
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

const _luts = {};
function getLUT(mode) {
  if (!_luts[mode]) _luts[mode] = buildLUT(mode);
  return _luts[mode];
}

export function renderField(ctx, field, metrics, opts = {}) {
  const { re, im, N } = field;
  const mode = opts.mode || 'amplitude';
  const invertAsym = opts.invertAsym || false;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const imgData = ctx.createImageData(W, H);
  const data = imgData.data;
  const lut = getLUT(mode);

  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const fi = Math.floor(px / W * N);
      const fj = Math.floor(py / H * N);
      const k = fj * N + fi;
      const re_c = re[k], im_c = im[k];
      const amp2 = re_c * re_c + im_c * im_c;
      const amp = Math.sqrt(amp2);

      let val255;
      if (mode === 'amplitude') {
        val255 = Math.min(255, Math.round(amp * 80));
      } else if (mode === 'phase') {
        const phase = Math.atan2(im_c, re_c);
        val255 = Math.round((phase / (2 * Math.PI) + 0.5) * 255);
      } else if (mode === 'energy') {
        const localE = amp2 + 0.5 * amp2 * amp2;
        val255 = Math.min(255, Math.round(localE * 40));
      } else {
        // asym
        const phase = Math.atan2(im_c, re_c);
        // Approximate local chirality: use sin(phase) as a simple proxy
        let asym = Math.sin(phase) * amp;
        if (invertAsym) asym = -asym;
        val255 = Math.min(255, Math.round((asym + 1) * 0.5 * 255));
      }
      val255 = Math.min(255, Math.max(0, val255));

      const idx = (py * W + px) * 4;
      data[idx] = lut[val255 * 3];
      data[idx + 1] = lut[val255 * 3 + 1];
      data[idx + 2] = lut[val255 * 3 + 2];
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}
