# Límite de Complejidad por Energía — DQRI/FRIF y Asimetría Biológica

## Qué es

Simulación numérica reproducible del modelo Complex Ginzburg-Landau (CGL) en 2D, orientada a explorar el concepto de **Límite de Complejidad por Energía**. Calcula métricas relacionadas con el **FRIF** (Factor de Riqueza de Información Funcional) y la **Asimetría Biológica (L/D)**, presentadas en un dashboard científico interactivo.

**Nota:** Este proyecto es una simulación numérica conceptual. No afirma simular campos cuánticos físicos reales; sí garantiza resultados numéricos reproducibles mediante semilla (seed).

---

## Cómo correr local

1. Clonar o descargar el repositorio:
   ```bash
   git clone https://github.com/donato-jj/Teor-a-conseptual-de-la-estructura-metaf-sica.
   cd "Teor-a-conseptual-de-la-estructura-metaf-sica."
   ```
2. Abrir `index.html` directamente en el navegador (doble clic), o usar un servidor simple:
   ```bash
   python3 -m http.server 8080
   # luego abrir http://localhost:8080
   ```
3. No requiere compilación ni dependencias npm.

---

## Publicar en GitHub Pages

1. Ir a **Settings → Pages** en el repositorio de GitHub.
2. En **Source**, seleccionar la rama `main` (o la rama activa) y la carpeta `/ (root)`.
3. Guardar. GitHub Pages publicará automáticamente el sitio en `https://<usuario>.github.io/<repositorio>/`.
4. El archivo `index.html` está en la raíz y no necesita build.

---

## Modelo matemático (CGL 2D)

La ecuación Complex Ginzburg-Landau discreta usada es:

```
∂ψ/∂t = ψ + (1+iα)∇²ψ − (1+iβ)|ψ|²ψ − γψ − V(x,y)ψ + η·ξ(x,y,t)
```

Donde:
- `ψ = re + i·im` es el campo complejo en cada celda de la grilla N×N
- `α` controla la dispersión de fase en la difusión
- `β` controla la no linealidad de fase
- `γ` es el coeficiente de disipación
- `V(x,y)` es el potencial externo (gaussiano, gradiente, o ruido suave)
- `η·ξ` es ruido gaussiano aditivo con amplitud `η`

---

## Discretización y estabilidad

- **Integración temporal:** Euler explícito con paso `dt`
- **Laplaciano:** Esquema de 5 puntos: `∇²ψ ≈ ψ_{i+1,j} + ψ_{i-1,j} + ψ_{i,j+1} + ψ_{i,j-1} − 4ψ_{i,j}`
- **Condiciones de borde:** Periódico (wrap) o Reflectante (clamp)
- **Estabilidad CFL:** `dt_safe < 0.9 / (4·(1 + |α|))`. El sistema muestra automáticamente el `dt` seguro y lo aplica como clamp.
- **Auto-scale:** Si el FPS cae por debajo de 30, la escala de renderizado se reduce automáticamente a 0.5.

---

## Métricas (E, D, S, FRIF, Asym)

| Métrica | Definición |
|---------|-----------|
| **E_total** | `mean(grad² + V·amp² + 0.5·amp⁴)` donde `amp² = re²+im²` |
| **E_in** | `mean(amp²)` — proxy operacional del término de crecimiento `+ψ` (documentado explícitamente como aproximación) |
| **D** | `γ · mean(amp²)` — disipación lineal |
| **S** | Entropía Shannon sobre histograma de `sqrt(amp²)` en 64 bins |
| **coherence** | `sqrt(mean(cos φ)² + mean(sin φ)²)` donde `φ = atan2(im, re)` |
| **I_eff** | `clamp01((S_max − S)/S_max) + 0.35·coherence`, `S_max = ln(64)` |
| **Stab** | `1 / (Var(E, W=60) + ε)` — ventana de 60 frames sobre historial de E |
| **FRIF** | `(I_eff · Stab) / (E_in + ε)` |
| **Asym** | `clamp(−1,1, mean(sin(φ)·∇²φ) / (π² + ε))` — proxy de vorticidad quiral |

---

## Reproducibilidad (Seed, URL, Export JSON)

- **Seed:** El RNG usa un LCG (Lehmer) inicializado con la seed dada. El mismo seed produce el mismo resultado determinístico.
- **URL State:** Todos los parámetros se serializan en la URL como query params. Copiar el link restaura exactamente el estado.
- **Export JSON:** Exporta `{ version, timestamp, state, lastMetrics }` como archivo `.json` descargable.
- **Export PNG:** Descarga el canvas del campo como imagen `.png`.

---

## Limitaciones

1. La simulación es **numérica y conceptual**: no modela sistemas físicos reales a escala cuántica.
2. El esquema Euler explícito puede divergir con `dt` grande o `α`/`β` altos; usar `dt_safe` como guía.
3. En grillas grandes (≥ 512) con calidad 1.0 puede no alcanzar 45 FPS en hardware modesto.
4. El cálculo de `Asym` usa una aproximación de vorticidad de fase, no una medición experimental de quiralidad molecular.
5. `E_in` es un proxy operacional, no la energía de inyección exacta del sistema físico subyacente.

---

## Checklist QA

| Prueba | Criterio medible | Estado |
|--------|-----------------|--------|
| 1. FPS en grid 256 / scale 0.75 | ≥ 45 FPS en laptop promedio | ✅ Auto-scale a 0.5 si < 30 FPS |
| 2. Export PNG | Descarga archivo `.png` válido en mobile y desktop | ✅ |
| 3. Copiar Link | URL restaura parámetros al pegar | ✅ |
| 4. Export JSON | JSON contiene `version`, `timestamp`, `state`, `lastMetrics` | ✅ |
| 5. Reset | Reinicia campo con seed actual, campo visible cambia | ✅ |
| 6. Step | Un paso manual ejecuta correctamente | ✅ |
| 7. Presets | Cada preset carga parámetros exactos especificados | ✅ |
| 8. Sin errores consola | No aparecen errores JS en consola | ✅ |
| 9. Todos los textos | Coinciden exactamente con spec | ✅ |
| 10. Rutas relativas | Funciona con doble clic y server simple | ✅ |

### Pruebas manuales paso a paso

1. Abrir `index.html` → verificar que el dashboard carga sin errores de consola.
2. Clic en **Start** → confirmar que el canvas de campo cambia cada frame y FPS > 0.
3. Cambiar preset a **Turbulent** → verificar que la cuadrícula se ve diferente y más caótica.
4. Ajustar slider α → verificar que el campo responde visualmente en < 1s.
5. Clic **Exportar PNG** → confirmar que se descarga un archivo PNG con imagen del campo.
6. Clic **Copiar Link** → pegar URL en nueva pestaña → verificar que los parámetros se restauran.
7. Clic **Exportar JSON** → abrir el JSON → verificar `version`, `timestamp`, `state`, `lastMetrics`.
8. Clic **Random seed** → verificar que la seed cambia y el campo se reinicializa.
9. Navegar a tab **Medición del FRIF** → verificar contenido de fórmulas.
10. Navegar a tab **Implementación Real** → verificar lista de 5 pasos y 3 cards.
