# DQRI/FRIF — Límite Físico de Complejidad por Energía

> **⚠ Simulación conceptual informada por física, química y biología estándar. No es un instrumento científico validado. Sin misticismo. Sin fuerzas nuevas. Sin afirmaciones experimentales reales.**

Página web científica interactiva que demuestra el **límite físico de complejidad por energía** en el marco DQRI/FRIF, con un panel de campo conceptual animado que incorpora asimetrías biológicas reales: quiralidad (L/D), polaridad celular, direccionalidad 5'→3', y ruptura de simetría. Incluye módulo darwiniano de selección bajo restricción energética.

[![Demo conceptual](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://donato-jj.github.io/Teor-a-conseptual-de-la-estructura-metaf-sica.)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-green)](LICENSE)
[![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-brightgreen)](#)

---

## Índice

1. [¿Qué es esto?](#qué-es-esto)
2. [Características principales](#características-principales)
3. [Cómo correr localmente](#cómo-correr-localmente)
4. [Cómo publicar en GitHub Pages](#cómo-publicar-en-github-pages)
5. [Reproducibilidad — Presets y Hashes](#reproducibilidad--presets-y-hashes)
6. [Uso de URL Hash](#uso-de-url-hash)
7. [Exportar PNG](#exportar-png)
8. [Cómo lograrlo — Resumen](#cómo-lograrlo--resumen)
9. [Limitaciones](#limitaciones)
10. [Versionado](#versionado)
11. [Licencia](#licencia)

---

## ¿Qué es esto?

**DQRI/FRIF Interactive Lab** es un laboratorio interactivo web (HTML + CSS + JavaScript puro, sin dependencias) que:

- Visualiza en tiempo real 5 paneles sincronizados: red química autocatalítica, atractor (osciloscopio), FRIF vs energía, termodinámica de sistema abierto, y campo conceptual con asimetrías biológicas.
- Calcula **FRIF** (Free-energy Reduction Information Fraction): estimador de organización basado en la fracción del espacio de estados efectivamente ocupado.
- Muestra la **cota FRIF_max(E)**: límite superior de organización sostenible para energía fija.
- Modela **asimetrías biológicas**: quiralidad (χ), polaridad celular (P), direccionalidad 5'→3' (advección), curvatura visual (κ), correlación (ξ).
- Incluye un **módulo Darwin**: variación + selección por eficiencia energética.
- Explica **cómo lograr** organización sostenida desde la física, la tecnología y la biología.
- Incluye una **guía de implementación real**: Demo → Investigación → Experimento.

---

## Características principales

| Característica | Descripción |
|---|---|
| 5 paneles sincronizados | Red, Atractor, FRIF, Termodinámica, Campo |
| Campo cuántico conceptual | Campo escalar 2D con asimetrías biológicas animadas |
| Presets reproducibles | 6 presets (subcrítico, umbral, supercrítico, quiralidad L/D, Darwin) |
| URL hash | Estado completo serializado en URL para reproducibilidad |
| Export PNG | Captura de los 5 paneles en una imagen |
| Módulo Darwin | 3 linajes, mutación μ, selección s, ventana temporal |
| Explicación operativa | Sección "Cómo lograrlo" con física, tecnología y biología |
| Accesibilidad | Teclado, aria-labels, contraste AA, prefers-reduced-motion |
| Sin dependencias | 100% HTML/CSS/JS puro, funciona offline |

---

## Cómo correr localmente

**Opción 1 — Abrir directamente (más simple):**

```bash
git clone https://github.com/donato-jj/Teor-a-conseptual-de-la-estructura-metaf-sica.
cd "Teor-a-conseptual-de-la-estructura-metaf-sica."
# Abrir docs/index.html con cualquier navegador moderno
open docs/index.html          # macOS
xdg-open docs/index.html      # Linux
start docs\index.html         # Windows
```

No se necesita servidor, Node.js, ni ninguna instalación adicional.

**Opción 2 — Servidor local (para funciones de clipboard):**

```bash
cd docs
python3 -m http.server 8080
# Luego abrir: http://localhost:8080
```

---

## Cómo publicar en GitHub Pages

1. Ir a **Settings** del repositorio en GitHub.
2. En la sección **Pages** (menú lateral izquierdo).
3. En **Source**: seleccionar **Deploy from a branch**.
4. Branch: **main**, Folder: **/docs**.
5. Guardar. En 1-2 minutos la página estará disponible en:
   `https://donato-jj.github.io/Teor-a-conseptual-de-la-estructura-metaf-sica.`

---

## Reproducibilidad — Presets y Hashes

### Presets disponibles

| Preset | Descripción |
|---|---|
| **Subcrítico** | E=0.10 — ruido domina, FRIF≈0, sin organización |
| **Umbral** | E=0.50 — bifurcación, atractor incipiente, FRIF≈0.3-0.5 |
| **Supercrítico** | E=0.85 — atractor estable, FRIF>0.6, red fuerte |
| **Quiralidad L** | χ=+0.90 — dominancia L, rotación CCW del campo |
| **Quiralidad D** | χ=+0.90, L/D invertido — dominancia D, rotación CW |
| **Darwin activo** | E=0.55, μ=0.05, s=0.40 — selección mejora FRIF |

### Hashes de ejemplo para reproducibilidad

Para restaurar un estado exacto, agregar el hash a la URL:

**Subcrítico:**
```
docs/index.html#E=0.1&T=0.4&sigma=0.2&gamma=0.3&k_auto=0.3&chi=0.3&kappa=0.2&xi=0.3&P_mag=0.2&advection=0.1&darwin_on=false
```

**Umbral:**
```
docs/index.html#E=0.5&T=0.3&sigma=0.15&gamma=0.2&k_auto=0.6&chi=0.7&kappa=0.4&xi=0.5&P_mag=0.5&advection=0.4&darwin_on=false
```

**Supercrítico:**
```
docs/index.html#E=0.85&T=0.15&sigma=0.08&gamma=0.15&k_auto=0.8&chi=0.7&kappa=0.6&xi=0.7&P_mag=0.7&advection=0.5&darwin_on=false
```

**Quiralidad D:**
```
docs/index.html#E=0.65&T=0.25&sigma=0.12&gamma=0.18&k_auto=0.7&chi=0.9&kappa=0.5&xi=0.6&ld_inverted=true&darwin_on=false
```

**Darwin activo:**
```
docs/index.html#E=0.55&T=0.25&sigma=0.13&gamma=0.18&k_auto=0.65&darwin_on=true&mu=0.05&sel_s=0.4&window=50
```

---

## Uso de URL Hash

El botón **🔗 Link** en el header serializa el estado completo de todos los parámetros en el hash de la URL (`#key=val&...`). Al cargar esa URL, el estado se restaura automáticamente. Útil para:

- Compartir configuraciones específicas.
- Reproducir experimentos exactos.
- Citar estados en publicaciones o notas.

---

## Exportar PNG

El botón **⬇ PNG** genera un PNG combinando los 5 paneles (900×600 px) con marca de agua. El archivo se descarga automáticamente como `dqri-frif-{timestamp}.png`.

---

## Cómo lograrlo — Resumen

La página incluye una sección completa "Cómo Lograrlo en la Práctica" con 4 subsecciones. Resumen:

**Física:** Sistema abierto lejos del equilibrio + flujo de energía libre → disipación ordenada → exportación de entropía → atractores estables → FRIF > 0. Umbral E_c: cuando potencia de entrada supera disipación + ruido térmico.

**Tecnología:** ODE estocásticas (Euler-Maruyama) → estimación V_ef por grid → FRIF. Escalado: RK4, análisis de recurrencia, barridos paramétricos, HPC, Docker.

**Biología:**
- Quiralidad L/D: catálisis enantioselectiva + herencia + selección histórica → parámetro χ.
- Direccionalidad 5'→3': hidrólisis de pirofosfato en polimerasas → advección en el campo.
- Polaridad celular: motores moleculares + bombas iónicas + gradientes → vector P.
- Ruptura de simetría: inestabilidades termodinámicas + bifurcaciones → E > E_c.
- Selección darwiniana: variación μ + selección s → FRIF mejora bajo E fija.

Ver la página completa en: [sección "Cómo Lograrlo"](docs/index.html#how-to)

---

## Limitaciones

- **FRIF es una estimación**, no una magnitud física medida calibrada.
- **El campo "cuántico" no es mecánica cuántica**: es un campo clásico escalar 2D.
- **Parámetros adimensionales**: sin correspondencia calibrada con unidades SI.
- **Darwin es metafórico**: heurística, no genética de poblaciones.
- **Sin validación experimental**: ningún resultado verificado en laboratorio.
- **Curvatura κ** = geometría como restricción del espacio de estados, no gravedad biológica.

---

## Estructura del repositorio

```
/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── .gitignore
└── docs/
    ├── index.html      ← Página principal
    ├── styles.css      ← Estilos (tema laboratorio)
    └── app.js          ← Motor de simulación completo
```

---

## Versionado

| Versión | Descripción |
|---|---|
| v0.1 | Demo conceptual inicial — 5 paneles, asimetrías biológicas, Darwin, URL hash |

---

## Licencia

**Código** (`docs/`): [MIT License](LICENSE)  
**Contenido textual y documentación**: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)

---

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md). Regla principal: ciencia estándar, sin misticismo, código puro sin dependencias.
