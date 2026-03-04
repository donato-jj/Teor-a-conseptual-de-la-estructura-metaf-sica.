# PROMPT MAESTRO ULTRA SUPREMO ∞ — ULTRA CERRADO (CERO IMPROVISACIÓN)

**"LÍMITE DE COMPLEJIDAD POR ENERGÍA — DQRI/FRIF y Asimetría Biológica"**

Entrega: repositorio completo (HTML/CSS/JS ESModules) publicable en GitHub Pages, estética dashboard científico, con simulación CGL 2D real, métricas, controles, export PNG/JSON, URL-state, docs, QA.

---

## A) REGLA DE ORO (REALISMO MÁXIMO)

- NO afirmar "campo cuántico físico real"; sí afirmar "simulación numérica reproducible".
- Todo lo que se diga debe tener implementación concreta y verificable.
- Prohibido: "placeholder", "demo", "lorem", "todo", "luego", "pendiente".

---

## B) ESTRUCTURA DE REPO

```
index.html
styles.css
README.md
PROMPT.md
LICENSE
.gitignore
src/main.js
src/app/state.js
src/app/router.js
src/sim/cgl2d.js
src/sim/potential.js
src/sim/noise.js
src/render/fieldRenderer.js
src/render/gauges.js
src/charts/plot2d.js
src/charts/attractor.js
src/widgets/graphNetwork.js
src/utils/urlState.js
src/utils/exportPng.js
src/utils/exportJson.js
src/utils/perf.js
src/utils/dom.js
```

---

## C) IDENTIDAD VISUAL (PALETA EXACTA)

```css
:root {
  --bg0:#06080d; --bg1:#0b1020; --panel:#0c1426cc; --panel2:#0b1222f2;
  --stroke:#2a3a56; --stroke2:#1a2540; --glow:#73a6ff; --glow2:#7cffc7;
  --warn:#ffcc66; --danger:#ff6b6b; --text:#e9f1ff; --muted:#a9b7d1;
  --muted2:#6f83a6; --grid:rgba(120,170,255,0.06);
}
```

---

## D) PRESETS

| Preset | α | β | γ | dt | V | V_amp | noise | η | grid | scale | mode | seed |
|--------|---|---|---|----|---|-------|-------|---|------|-------|------|------|
| Stable | 0.35 | 1.10 | 0.10 | 0.016 | gaussian | 1.0 | true | 0.12 | 256 | 0.75 | amplitude | 1337 |
| Turbulent | 1.35 | 0.85 | 0.04 | 0.020 | noise | 1.7 | true | 0.28 | 384 | 0.5 | phase | 2027 |
| High Asymmetry | -0.90 | 1.40 | 0.06 | 0.018 | gradient | 2.2 | true | 0.22 | 256 | 0.75 | asym | 777 |
| Low Dissipation | 0.60 | 1.05 | 0.015 | 0.022 | gaussian | 1.3 | false | 0.00 | 384 | 0.5 | energy | 909 |

---

## E) MÉTRICAS

- **E_total** = `mean(grad² + V·amp² + 0.5·amp⁴)`
- **E_in** = `mean(amp²)` — proxy del término +ψ
- **D** = `γ · mean(amp²)`
- **S** = entropía Shannon, histograma 64 bins de `|ψ|`
- **FRIF** = `(I_eff · Stab) / (E_in + ε)`
- **Asym** = `clamp(-1,1, mean(sin(φ)·∇²φ) / π²)`

---

## F) CONTRATOS DE MÓDULOS

### cgl2d.js
```js
createCGLSim(opts) -> { step(n), reset(seed), resizeGrid(N), getField(), getMetrics(), setParams(p) }
```

### potential.js
```js
computePotential(N, mode, amp, seed) -> Float32Array
```

### noise.js
```js
createRNG(seed) -> { next(), nextFloat(), nextGaussian() }
```

### urlState.js
```js
loadStateFromURL(defaults) -> state
writeStateToURL(state)
```

### exportPng.js
```js
exportCanvasPNG(canvas, filename)
```

### exportJson.js
```js
exportStateJSON(state, metrics)
```

---

## G) QA MEDIBLE

- Grid 256 / scale 0.75: ≥ 45 FPS (auto-scale a 0.5 si < 30 FPS)
- Export PNG funciona en mobile y desktop
- Copiar Link restaura estado exacto
- Sin errores en consola
- Todos los textos coinciden con spec
