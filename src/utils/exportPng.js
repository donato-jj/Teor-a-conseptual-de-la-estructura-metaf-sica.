// File: src/utils/exportPng.js

/**
 * exportCanvasPNG(canvas, filename)
 * Triggers a direct download of the canvas as PNG.
 */
export function exportCanvasPNG(canvas, filename = 'campo-cuantico.png') {
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, 'image/png');
}
