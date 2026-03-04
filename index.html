<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <title>DQRI/FRIF — Límite físico de complejidad por energía (Demo)</title>
  <style>
    :root{
      --bg:#0b0f14; --bg2:#0f1620; --panel: rgba(255,255,255,.06);
      --panel2: rgba(255,255,255,.09); --stroke: rgba(255,255,255,.14);
      --text:#e8eef6; --muted: rgba(232,238,246,.72);
      --accent:#7dd3fc; --accent2:#a78bfa; --warn:#fbbf24; --bad:#fb7185; --ok:#34d399;
      --r:16px; --r2:22px; --shadow: 0 18px 60px rgba(0,0,0,.45);
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
      --gap: 14px;
      --grid: 12px;
      --focus: 2px solid rgba(125,211,252,.7);
    }
    [data-theme="light"]{
      --bg:#f6f8fc; --bg2:#eef2f7; --panel: rgba(0,0,0,.04);
      --panel2: rgba(0,0,0,.06); --stroke: rgba(0,0,0,.12);
      --text:#0b1220; --muted: rgba(11,18,32,.7);
      --shadow: 0 14px 50px rgba(0,0,0,.12);
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family:var(--sans);
      color:var(--text);
      background:
        radial-gradient(1200px 700px at 25% 12%, rgba(167,139,250,.18), transparent 60%),
        radial-gradient(900px 650px at 75% 18%, rgba(125,211,252,.16), transparent 58%),
        radial-gradient(700px 600px at 55% 85%, rgba(52,211,153,.10), transparent 55%),
        linear-gradient(180deg, var(--bg), var(--bg2));
      overflow-x:hidden;
    }
    /* subtle grain */
    body::before{
      content:"";
      position:fixed; inset:0;
      pointer-events:none;
      opacity:.05;
      background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/></filter><rect width="160" height="160" filter="url(%23n)" opacity=".7"/></svg>');
      mix-blend-mode:overlay;
    }

    a{color:var(--accent)}
    .wrap{max-width:1180px; margin:0 auto; padding:0 16px 72px}
    header{
      position:sticky; top:0; z-index:50;
      backdrop-filter:saturate(1.2) blur(14px);
      background:linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.08));
      border-bottom:1px solid var(--stroke);
    }
    [data-theme="light"] header{
      background:linear-gradient(180deg, rgba(255,255,255,.65), rgba(255,255,255,.35));
    }
    .bar{
      display:flex; align-items:center; justify-content:space-between;
      gap:12px; padding:12px 16px;
      max-width:1180px; margin:0 auto;
    }
    .brand{
      display:flex; align-items:center; gap:10px; min-width:200px;
    }
    .logo{
      width:34px; height:34px; border-radius:12px;
      background:radial-gradient(circle at 30% 30%, rgba(125,211,252,.9), rgba(167,139,250,.7));
      box-shadow: 0 10px 30px rgba(167,139,250,.25);
    }
    .brand h1{font-size:14px; margin:0; letter-spacing:.3px}
    .brand .sub{font-size:12px; color:var(--muted); margin-top:1px}
    .status{
      display:flex; align-items:center; gap:10px; flex-wrap:wrap;
      font-family:var(--mono); font-size:12px; color:var(--muted);
    }
    .pill{
      padding:6px 10px; border:1px solid var(--stroke); border-radius:999px;
      background:rgba(255,255,255,.04);
      display:inline-flex; gap:8px; align-items:center;
    }
    .dot{width:8px; height:8px; border-radius:50%}
    .dot.ok{background:var(--ok)}
    .dot.warn{background:var(--warn)}
    .dot.bad{background:var(--bad)}
    .controls{
      display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end;
    }
    button, .btn, select, input[type="range"]{
      font-family:inherit;
    }
    button, .btn{
      border:1px solid var(--stroke);
      background:rgba(255,255,255,.06);
      color:var(--text);
      border-radius:12px;
      padding:9px 10px;
      cursor:pointer;
      transition: transform .08s ease, background .2s ease, border-color .2s ease;
      box-shadow:none;
    }
    button:hover, .btn:hover{background:rgba(255,255,255,.09)}
    button:active, .btn:active{transform:translateY(1px)}
    button:focus-visible, select:focus-visible, a:focus-visible, input:focus-visible{outline:var(--focus); outline-offset:2px}
    .btn.primary{
      background:linear-gradient(180deg, rgba(125,211,252,.22), rgba(167,139,250,.18));
      border-color:rgba(125,211,252,.35);
    }
    .btn.ghost{background:transparent}
    .toggle{
      display:inline-flex; align-items:center; gap:8px;
      padding:7px 10px; border-radius:999px; border:1px solid var(--stroke);
      background:rgba(255,255,255,.04);
      user-select:none;
    }
    .toggle input{accent-color: var(--accent)}
    .hero{
      padding:26px 0 6px;
    }
    .hero-grid{
      display:grid; grid-template-columns: 1.25fr .75fr; gap:var(--gap);
      align-items:stretch;
    }
    @media (max-width:980px){
      .hero-grid{grid-template-columns:1fr}
      .brand{min-width:auto}
    }
    .card{
      border:1px solid var(--stroke);
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
      border-radius:var(--r2);
      box-shadow:var(--shadow);
    }
    .card.pad{padding:18px}
    .hero h2{
      margin:0; font-size:28px; line-height:1.15; letter-spacing:.2px;
    }
    .hero p{margin:10px 0 0; color:var(--muted); max-width:65ch}
    .hero .cta{
      margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;
    }
    .note{
      font-size:12px; color:var(--muted); line-height:1.45;
      margin-top:12px;
    }
    .kpis{
      display:grid; grid-template-columns:1fr 1fr; gap:10px;
    }
    .kpi{
      padding:12px; border-radius:16px;
      border:1px solid var(--stroke);
      background:rgba(255,255,255,.04);
    }
    .kpi .label{font-size:12px; color:var(--muted); font-family:var(--mono)}
    .kpi .val{font-size:20px; margin-top:6px; font-family:var(--mono)}
    .kpi .val small{font-size:12px; color:var(--muted)}
    main{margin-top:14px}
    .section{
      margin-top:var(--gap);
    }
    .section h3{
      margin:0 0 10px;
      font-size:16px;
      letter-spacing:.2px;
    }
    .grid{
      display:grid;
      grid-template-columns: 1.1fr .9fr;
      gap:var(--gap);
    }
    @media (max-width:980px){
      .grid{grid-template-columns:1fr}
    }
    .lab{
      display:grid;
      grid-template-columns: repeat(12, 1fr);
      gap:var(--gap);
    }
    .panel{
      grid-column: span 6;
      border:1px solid var(--stroke);
      background:rgba(255,255,255,.04);
      border-radius:var(--r2);
      overflow:hidden;
      box-shadow:var(--shadow);
      position:relative;
      min-height:240px;
    }
    @media (max-width:980px){
      .panel{grid-column: span 12}
    }
    .panel .head{
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 12px;
      border-bottom:1px solid var(--stroke);
      background:rgba(0,0,0,.10);
    }
    [data-theme="light"] .panel .head{background:rgba(255,255,255,.55)}
    .panel .title{
      display:flex; gap:10px; align-items:baseline;
    }
    .panel .title b{font-size:12px; letter-spacing:.3px}
    .panel .title span{font-size:12px; color:var(--muted); font-family:var(--mono)}
    canvas{
      width:100%;
      height:calc(100% - 42px);
      display:block;
    }
    .aside{
      border:1px solid var(--stroke);
      background:rgba(255,255,255,.04);
      border-radius:var(--r2);
      box-shadow:var(--shadow);
      overflow:hidden;
    }
    .aside .head{
      padding:12px 14px;
      border-bottom:1px solid var(--stroke);
      display:flex; justify-content:space-between; align-items:center; gap:10px;
    }
    .aside .head b{font-size:12px; letter-spacing:.3px}
    .aside .body{padding:12px 14px}
    .row{
      display:grid; grid-template-columns: 1fr auto;
      gap:10px; align-items:center;
      margin:10px 0;
    }
    .row label{
      font-size:12px; color:var(--muted);
      font-family:var(--mono);
      display:flex; gap:8px; align-items:center; flex-wrap:wrap;
    }
    .row output{
      font-family:var(--mono); font-size:12px; color:var(--text);
      padding:5px 8px; border-radius:10px;
      border:1px solid var(--stroke);
      background:rgba(255,255,255,.04);
      min-width:78px; text-align:right;
    }
    input[type="range"]{
      width:100%;
      margin-top:6px;
    }
    .two{
      display:grid; grid-template-columns:1fr 1fr; gap:10px;
    }
    .select, select{
      width:100%;
      border:1px solid var(--stroke);
      background:rgba(255,255,255,.04);
      color:var(--text);
      border-radius:12px;
      padding:10px;
    }
    .mini{
      font-size:12px; color:var(--muted); line-height:1.55
    }
    .bullets{
      margin:8px 0 0; padding-left:16px; color:var(--muted);
      line-height:1.6; font-size:13px;
    }
    details{
      border:1px solid var(--stroke);
      border-radius:var(--r2);
      background:rgba(255,255,255,.03);
      overflow:hidden;
    }
    summary{
      cursor:pointer;
      padding:12px 14px;
      list-style:none;
      display:flex; justify-content:space-between; align-items:center;
      gap:10px;
      user-select:none;
    }
    summary::-webkit-details-marker{display:none}
    details .content{padding:12px 14px; border-top:1px solid var(--stroke)}
    pre{
      margin:0;
      white-space:pre-wrap;
      word-break:break-word;
      font-family:var(--mono);
      font-size:12px;
      color:var(--text);
      line-height:1.45;
    }
    .footer{
      margin-top:18px;
      padding:14px;
      font-size:12px;
      color:var(--muted);
      border-top:1px solid var(--stroke);
    }
    .tooltip{
      position:fixed;
      z-index:9999;
      max-width:360px;
      font-size:12px;
      line-height:1.45;
      color:var(--text);
      background:rgba(0,0,0,.82);
      border:1px solid rgba(255,255,255,.14);
      border-radius:14px;
      padding:10px 12px;
      pointer-events:none;
      transform:translate(-9999px,-9999px);
      box-shadow: 0 18px 70px rgba(0,0,0,.55);
    }
    [data-theme="light"] .tooltip{
      background:rgba(255,255,255,.92);
      border:1px solid rgba(0,0,0,.14);
      box-shadow: 0 18px 60px rgba(0,0,0,.18);
    }
    .kbd{
      font-family:var(--mono);
      border:1px solid var(--stroke);
      background:rgba(255,255,255,.05);
      padding:1px 6px;
      border-radius:8px;
      font-size:11px;
      color:var(--muted);
    }
  </style>
</head>

<body>
<header>
  <div class="bar">
    <div class="brand">
      <div class="logo" aria-hidden="true"></div>
      <div>
        <h1>DQRI/FRIF Lab</h1>
        <div class="sub">Límite físico de complejidad por energía · Demo conceptual</div>
      </div>
    </div>

    <div class="status" aria-live="polite">
      <span class="pill"><span class="dot" id="regDot"></span><span id="regLabel">—</span></span>
      <span class="pill">FRIF <span id="frifTop">—</span></span>
      <span class="pill">E <span id="eTop">—</span></span>
      <span class="pill">T <span id="tTop">—</span></span>
    </div>

    <div class="controls">
      <button class="btn ghost" id="btnPause" aria-label="Pausar o reanudar">Pausa</button>
      <label class="toggle" title="Reduce animación y partículas">
        <input type="checkbox" id="reduceMotion" />
        <span>Reducir movimiento</span>
      </label>
      <button class="btn ghost" id="btnTheme" aria-label="Cambiar tema">Tema</button>
      <button class="btn primary" id="btnPresent" aria-label="Modo presentación">Presentación</button>
    </div>
  </div>
</header>

<div class="wrap">
  <section class="hero">
    <div class="hero-grid">
      <div class="card pad">
        <h2>Límite físico de complejidad por energía</h2>
        <p>
          Instrumento visual (offline, sin librerías) que muestra cómo un sistema abierto lejos del equilibrio
          puede cruzar un umbral energético y sostener organización (FRIF) y asimetrías biológicas (quiralidad, polaridad, direccionalidad),
          sin invocar fuerzas nuevas: solo dinámica, disipación, ruido y selección (Darwin como algoritmo).
        </p>
        <div class="cta">
          <a class="btn primary" href="#lab">Iniciar demo</a>
          <button class="btn" id="btnCopyLink">Copiar link (hash)</button>
          <button class="btn" id="btnExport">Exportar PNG (panel)</button>
        </div>
        <div class="note">
          <b>Honestidad:</b> esto es una <b>simulación conceptual</b> informada por física/química/biología estándar.
          No es evidencia experimental ni QFT real. “Einstein” se usa como <i>lenguaje geométrico</i> (métrica efectiva/curvatura visual).
        </div>
      </div>

      <div class="card pad">
        <div class="kpis" role="group" aria-label="Indicadores principales">
          <div class="kpi">
            <div class="label">FRIF(t) · estimador</div>
            <div class="val"><span id="frifBig">—</span> <small id="frifUnit"></small></div>
          </div>
          <div class="kpi">
            <div class="label">FRIF<sub>max</sub>(E) · cota</div>
            <div class="val"><span id="frifMaxBig">—</span></div>
          </div>
          <div class="kpi">
            <div class="label">Energía de entrada E</div>
            <div class="val"><span id="eBig">—</span></div>
          </div>
          <div class="kpi">
            <div class="label">Entropía exportada (proxy)</div>
            <div class="val"><span id="sxBig">—</span></div>
          </div>
        </div>
        <div class="note">
          Tip: Presets rápidos en el panel de controles. Probá “Cerca del umbral” y luego “Supercrítico”.
        </div>
      </div>
    </div>
  </section>

  <main>
    <section class="section grid">
      <div class="card pad">
        <h3>Marco</h3>
        <p class="mini">
          FRIF ≈ −log(V<sub>eff</sub>/V<sub>ref</sub>): cuanto menor el volumen efectivamente explorado del espacio de estados (bajo dinámica real),
          mayor la restricción organizacional. En un sistema abierto, la organización puede sostenerse si la entrada de energía libre supera pérdidas
          + ruido (umbral). La “asimetría biológica” se representa como ruptura de simetría izquierda-derecha (quiralidad), un eje de polaridad (P)
          y una direccionalidad tipo 5’→3’ (advección sesgada).
        </p>
        <ul class="bullets">
          <li><b>Física:</b> lejos del equilibrio, disipación + entropía exportada + atractores estables.</li>
          <li><b>Tecnología:</b> integración temporal, métricas (ocupación/dimensión efectiva), visualización Canvas.</li>
          <li><b>Biología:</b> asimetrías mantenidas activamente (gradientes/transporte) y selección como filtro.</li>
        </ul>
      </div>

      <div class="aside">
        <div class="head">
          <b>Controles (Demo Lab)</b>
          <select id="preset" aria-label="Presets">
            <option value="sub">Subcrítico</option>
            <option value="near">Cerca del umbral</option>
            <option value="super">Supercrítico</option>
            <option value="hot">Alta T</option>
            <option value="cold">Baja T</option>
            <option value="chirL">Quiralidad L</option>
            <option value="chirD">Quiralidad D</option>
            <option value="pol">Polaridad fuerte</option>
            <option value="darwin">Darwin activo</option>
          </select>
        </div>
        <div class="body">
          <div class="row">
            <label data-tip="Energía de entrada (potencia). Aumenta estabilidad si supera pérdidas+ruido.">E (entrada)</label>
            <output id="oE"></output>
            <div style="grid-column:1 / -1">
              <input id="E" type="range" min="0" max="1" step="0.001" />
            </div>
          </div>

          <div class="two">
            <div class="row">
              <label data-tip="Temperatura (kBT). Aumenta dispersión y exploración configuracional.">T</label>
              <output id="oT"></output>
              <div style="grid-column:1 / -1">
                <input id="T" type="range" min="0.05" max="1.5" step="0.001" />
              </div>
            </div>

            <div class="row">
              <label data-tip="Ruido estocástico adicional (σ).">σ (ruido)</label>
              <output id="oSig"></output>
              <div style="grid-column:1 / -1">
                <input id="sig" type="range" min="0" max="1" step="0.001" />
              </div>
            </div>
          </div>

          <div class="two">
            <div class="row">
              <label data-tip="Disipación (γ). Pérdidas: si es alta, exige más E para sostener organización.">γ (disipación)</label>
              <output id="oGam"></output>
              <div style="grid-column:1 / -1">
                <input id="gam" type="range" min="0.02" max="1.2" step="0.001" />
              </div>
            </div>

            <div class="row">
              <label data-tip="Autocatálisis (k_auto). Refuerza bucles y organización en red química toy.">k_auto</label>
              <output id="oK"></output>
              <div style="grid-column:1 / -1">
                <input id="kauto" type="range" min="0" max="1" step="0.001" />
              </div>
            </div>
          </div>

          <div class="two">
            <div class="row">
              <label data-tip="Umbral crítico E_c. Si E supera E_c, emergen atractores más estables.">E_c</label>
              <output id="oEc"></output>
              <div style="grid-column:1 / -1">
                <input id="Ec" type="range" min="0.05" max="0.95" step="0.001" />
              </div>
            </div>

            <div class="row">
              <label data-tip="Flujo neto (Fin/Fout). Controla apertura del sistema.">Flujo</label>
              <output id="oFlow"></output>
              <div style="grid-column:1 / -1">
                <input id="flow" type="range" min="-1" max="1" step="0.001" />
              </div>
            </div>
          </div>

          <hr style="border:none;border-top:1px solid var(--stroke); margin:12px 0" />

          <div class="two">
            <div class="row">
              <label data-tip="χ: asimetría quiral (L/D). Rompe simetría izquierda-derecha en el campo.">χ (quiral)</label>
              <output id="oChi"></output>
              <div style="grid-column:1 / -1">
                <input id="chi" type="range" min="-1" max="1" step="0.001" />
              </div>
            </div>

            <div class="row">
              <label data-tip="κ: curvatura visual (métrica efectiva). Deforma la malla como lenguaje geométrico.">κ (curvatura)</label>
              <output id="oKap"></output>
              <div style="grid-column:1 / -1">
                <input id="kap" type="range" min="0" max="1" step="0.001" />
              </div>
            </div>
          </div>

          <div class="two">
            <div class="row">
              <label data-tip="|P|: intensidad de polaridad (eje).">|P|</label>
              <output id="oP"></output>
              <div style="grid-column:1 / -1">
                <input id="pMag" type="range" min="0" max="1" step="0.001" />
              </div>
            </div>

            <div class="row">
              <label data-tip="Ángulo de polaridad (dirección del sesgo).">∠P</label>
              <output id="oPa"></output>
              <div style="grid-column:1 / -1">
                <input id="pAng" type="range" min="0" max="6.283" step="0.001" />
              </div>
            </div>
          </div>

          <div class="two">
            <label class="toggle" title="Variación+selección como algoritmo" style="justify-content:space-between">
              <span>Darwin</span>
              <input type="checkbox" id="darwin" />
            </label>
            <label class="toggle" title="Invertir L↔D (handedness)" style="justify-content:space-between">
              <span>L ↔ D</span>
              <input type="checkbox" id="invLD" />
            </label>
          </div>

          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px">
            <button class="btn" id="btnReset">Reset</button>
            <button class="btn" id="btnQuality">Calidad: Auto</button>
          </div>

          <p class="mini" style="margin-top:12px">
            Consejo: si estás en móvil y va lento, activá <b>Reducir movimiento</b> o bajá <b>Calidad</b>.
          </p>
        </div>
      </div>
    </section>

    <section class="section" id="lab">
      <h3>Demo Lab · 5 paneles sincronizados</h3>

      <div class="lab" role="region" aria-label="Laboratorio interactivo">
        <div class="panel" style="grid-column: span 6" id="panelNet">
          <div class="head">
            <div class="title"><b>Red química autocatalítica</b><span>ODE toy + flujos</span></div>
            <span class="pill" style="font-family:var(--mono); font-size:11px">loops <span id="loops">—</span></span>
          </div>
          <canvas id="cNet"></canvas>
        </div>

        <div class="panel" style="grid-column: span 6" id="panelAtt">
          <div class="head">
            <div class="title"><b>Atractor</b><span>osciloscopio</span></div>
            <span class="pill" style="font-family:var(--mono); font-size:11px">D_eff <span id="deff">—</span></span>
          </div>
          <canvas id="cAtt"></canvas>
        </div>

        <div class="panel" style="grid-column: span 6" id="panelChart">
          <div class="head">
            <div class="title"><b>FRIF vs Energía</b><span>umbral + cota</span></div>
            <span class="pill" style="font-family:var(--mono); font-size:11px">E_c <span id="ecShow">—</span></span>
          </div>
          <canvas id="cChart"></canvas>
        </div>

        <div class="panel" style="grid-column: span 6" id="panelFlow">
          <div class="head">
            <div class="title"><b>Sistema abierto</b><span>energía/entropía</span></div>
            <span class="pill" style="font-family:var(--mono); font-size:11px">Σ̇ <span id="sigmadot">—</span></span>
          </div>
          <canvas id="cFlow"></canvas>
        </div>

        <div class="panel" style="grid-column: span 12" id="panelField">
          <div class="head">
            <div class="title"><b>Campo conceptual “cuántico”</b><span>quiralidad χ · polaridad P · curvatura κ</span></div>
            <span class="pill" style="font-family:var(--mono); font-size:11px">ξ <span id="xiShow">—</span></span>
          </div>
          <canvas id="cField"></canvas>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="card pad">
        <h3>Cómo lograr esto en la práctica (Física · Tecnología · Biología)</h3>

        <div class="two">
          <div>
            <p class="mini"><b>1) Física</b> — Organización sostenida requiere un <b>sistema abierto lejos del equilibrio</b>: entrada de energía libre, disipación y exportación de entropía. Con ruido térmico (kBT) y pérdidas (γ), aparece un <b>umbral</b>: cuando E supera pérdidas+ruido, emergen atractores estables y disminuye el volumen efectivamente explorado (V_eff ↓), por eso FRIF ↑. Con energía fija hay un techo: <b>FRIF_max(E)</b>.</p>
            <ul class="bullets">
              <li>Más E → más estabilidad (si no “se va” en disipación).</li>
              <li>Más T/σ → más dispersión → FRIF baja.</li>
              <li>Umbral E_c → transición a régimen estable.</li>
            </ul>
          </div>
          <div>
            <p class="mini"><b>2) Tecnología</b> — Se implementa: (i) modelos toy (ODE estocásticas) para red química, (ii) un generador de atractor, (iii) un campo en malla 2D con términos de correlación, polaridad y quiralidad. Métricas: ocupación de bins/dimensión efectiva para estimar V_eff. Visualización: Canvas con degradación adaptativa y estado reproducible por URL hash.</p>
            <ul class="bullets">
              <li>Pipeline: parámetros → simulación → métricas → visualización → falsación.</li>
              <li>Escalar a investigación: barridos, estadística, reproducibilidad, MD/DFT/HPC.</li>
            </ul>
          </div>
        </div>

        <p class="mini" style="margin-top:10px"><b>3) Biología</b> — Asimetrías reales se sostienen activamente: quiralidad por catálisis selectiva + herencia; direccionalidad 5’→3’ por polimerización enzimática acoplada a energía; polaridad por gradientes/transporte dirigido (motores/citoesqueleto/bombas); selección como filtro de eficiencia bajo energía limitada. En la demo: χ (quiral), P (polaridad), advección sesgada (direccionalidad), módulo Darwin (variación+selección).</p>
      </div>
    </section>

    <section class="section">
      <div class="card pad">
        <h3>Método paso a paso (reproducir el demo)</h3>
        <ol class="bullets" style="padding-left:18px">
          <li>Guardá este archivo como <span class="kbd">index.html</span>.</li>
          <li>Abrilo en Chrome/Edge/Firefox (desktop o móvil).</li>
          <li>Entrá a “Demo Lab” con <span class="kbd">Iniciar demo</span>.</li>
          <li>Probá el preset <b>Cerca del umbral</b> y mirá FRIF subir.</li>
          <li>Subí/bajá <b>E</b> y <b>γ</b> para ver el umbral E_c.</li>
          <li>Activá <b>L↔D</b> y verificá inversión del handedness.</li>
          <li>Subí <b>|P|</b> y cambiá ∠P: aparece polaridad/direccionalidad.</li>
          <li>Activá <b>Darwin</b>: el sistema ajusta parámetros para estabilidad bajo E fija.</li>
          <li>Tocá <span class="kbd">Copiar link</span> para compartir el estado (hash URL).</li>
          <li>Tocá <span class="kbd">Exportar PNG</span> para capturar paneles.</li>
          <li>Si va lento: activá <b>Reducir movimiento</b> o bajá <b>Calidad</b>.</li>
          <li>Para GitHub Pages: subí este <span class="kbd">index.html</span> en <span class="kbd">docs/</span> y publicá Pages desde <span class="kbd">/docs</span>.</li>
        </ol>
      </div>
    </section>

    <section class="section">
      <details>
        <summary>
          <div>
            <b>Prompt maestro completo (incluido en la página)</b>
            <div class="mini">Copiable · También disponible en botón “Descargar prompt” (más abajo)</div>
          </div>
          <span class="pill" style="font-family:var(--mono); font-size:11px">PROMPT</span>
        </summary>
        <div class="content">
          <pre id="promptText"></pre>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px">
            <button class="btn" id="btnCopyPrompt">Copiar prompt</button>
            <button class="btn" id="btnDownloadPrompt">Descargar prompt .txt</button>
          </div>
        </div>
      </details>
    </section>

    <div class="footer">
      Demo conceptual offline · Sin librerías · Canvas 2D · Estado reproducible por hash · No afirma resultados experimentales.
    </div>
  </main>
</div>

<div class="tooltip" id="tooltip" role="tooltip" aria-hidden="true"></div>

<script>
/**
 * GUÍA DE AJUSTE (rápida)
 * - Subcrítico: E bajo (< E_c), T alto o σ alto, γ medio/alto -> FRIF baja, atractor disperso.
 * - Cerca umbral: E ≈ E_c, γ medio, σ medio -> transición, FRIF sube.
 * - Supercrítico: E > E_c, γ bajo/medio, σ bajo -> atractor estable, loops dominan, FRIF alta.
 * - Quiralidad fuerte: |χ| alto -> remolinos con handedness claro. Activar L↔D invierte.
 * - Polaridad fuerte: |P| alto -> advección direccional (conceptual 5'→3').
 * - Darwin: activa variación+selección (no crea energía; optimiza uso bajo E fija).
 */

/* -------------------------
   PROMPT MAESTRO (incluido)
-------------------------- */
const MASTER_PROMPT = `PROMPT MAESTRO ULTRA SUPREMO + “CÓMO LOGRARLO” + “GUÍA DE IMPLEMENTACIÓN REAL” + “MÉTODO PASO A PASO”
NIVEL ABSOLUTO, REAL, IMPLEMENTABLE, REPRODUCIBLE Y “PUBLICABLE”
PÁGINA WEB CIENTÍFICA DINÁMICA (HTML + CSS + JavaScript + Canvas 2D)
DQRI / FRIF + LÍMITE DE COMPLEJIDAD POR ENERGÍA
CON PANEL “CAMPO CUÁNTICO” ANIMADO + ASIMETRÍAS BIOLÓGICAS (QUIRALIDAD, DIRECCIONALIDAD, POLARIDAD, RUPTURA DE SIMETRÍA)
ESTÉTICA LABORATORIO / INSTRUMENTAL, REALISMO PROFESIONAL, MOVIMIENTO FÍSICAMENTE COHERENTE, SIN HUMO
INCLUYE EXPLICACIÓN OPERATIVA DE “CÓMO LOGRAR ESO” EN: FÍSICA, TECNOLOGÍA Y BIOLOGÍA
INCLUYE “PLAN DE EJECUCIÓN”, “CHECKLIST DE REPRODUCIBILIDAD” Y “GUÍA PASO A PASO” (DEMO → INVESTIGACIÓN → EXPERIMENTO)

Actuá como una arquitectura interdisciplinaria total integrada por: arquitecto web senior (HTML/CSS/JS puro, sin dependencias, performance y accesibilidad), ingeniero de visualización científica (Canvas 2D, rendering eficiente, animación física, trazas persistentes tipo osciloscopio), físico teórico (termodinámica fuera del equilibrio, dinámica estocástica, atractores, estabilidad), químico cuántico (superficies de energía potencial, densidad electrónica, quiralidad como información geométrica material), biólogo molecular y de sistemas (asimetrías biológicas reales: quiralidad, polaridad celular, direccionalidad 5’→3’, gradientes, autoorganización, autocatálisis), biólogo evolutivo (variación + selección como filtro dinámico bajo restricción energética), diseñador UI/UX científico (HUD sobrio, jerarquía, legibilidad) y QA (robustez, compatibilidad, validación).

Tu misión es entregar una página web pública de nivel laboratorio real: sobria, rigurosa, visualmente potente, interactiva y coherente con ciencia estándar, que explique y demuestre con animaciones en movimiento el “límite físico de complejidad por energía” en el marco DQRI/FRIF, incorporando un panel clave: un “campo cuántico” visual (simulación conceptual) que muestre ASIMETRÍA BIOLÓGICA de manera científicamente fiel, basada en fenómenos reales de ruptura de simetría en biología y su base fisicoquímica. Prohibido misticismo. Prohibidas fuerzas nuevas. Prohibido afirmar resultados experimentales reales.

Requisitos clave: single page, 5 paneles Canvas sincronizados, controles en tiempo real, presets, FRIF estimado (ocupación/dimensión efectiva), cota FRIF_max(E), umbral E_c, módulo Darwin (variación + selección), estado reproducible por hash URL, export PNG, accesibilidad, degradación de performance, explicación “Cómo lograrlo” (Física/Tecnología/Biología), guía de implementación real (demo→investigación→experimento) y método paso a paso.

Entregables: index.html, styles.css, app.js (o todo unido). Sin librerías. Offline. Sin imágenes externas. Canvas/SVG generativo.`;

document.getElementById("promptText").textContent = MASTER_PROMPT;

/* -------------------------
   Utilidades
-------------------------- */
const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));
const lerp = (a,b,t)=>a+(b-a)*t;
const rand = (a=0,b=1)=>a+(b-a)*Math.random();
const sign = (x)=> x<0?-1:1;

function fmt(x, d=3){
  if (!isFinite(x)) return "—";
  const ax = Math.abs(x);
  if (ax>=1000) return x.toFixed(0);
  if (ax>=100) return x.toFixed(1);
  if (ax>=10) return x.toFixed(2);
  return x.toFixed(d);
}

function hashEncode(obj){
  const parts=[];
  for (const [k,v] of Object.entries(obj)){
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return "#"+parts.join("&");
}
function hashDecode(){
  const h=location.hash.replace(/^#/,"");
  if(!h) return {};
  const out={};
  for(const p of h.split("&")){
    const [k,v]=p.split("=");
    if(!k) continue;
    out[decodeURIComponent(k)] = decodeURIComponent(v||"");
  }
  return out;
}

/* -------------------------
   Tooltip system
-------------------------- */
const tooltip = document.getElementById("tooltip");
let tipActive=false;
document.addEventListener("mousemove",(e)=>{
  if(!tipActive) return;
  const pad=14;
  const maxX=window.innerWidth-360-pad;
  const x=clamp(e.clientX+14, pad, maxX);
  const y=clamp(e.clientY+14, pad, window.innerHeight-120);
  tooltip.style.transform=`translate(${x}px,${y}px)`;
});
document.addEventListener("mouseover",(e)=>{
  const t=e.target.closest("[data-tip]");
  if(!t) return;
  tipActive=true;
  tooltip.textContent = t.getAttribute("data-tip");
  tooltip.setAttribute("aria-hidden","false");
});
document.addEventListener("mouseout",(e)=>{
  const t=e.target.closest("[data-tip]");
  if(!t) return;
  tipActive=false;
  tooltip.setAttribute("aria-hidden","true");
  tooltip.style.transform="translate(-9999px,-9999px)";
});

/* -------------------------
   Performance scaler
-------------------------- */
class PerformanceScaler{
  constructor(){
    this.mode="auto"; // auto|high|med|low
    this.dpr=window.devicePixelRatio||1;
    this.scale=1;
    this.frameMs=16;
    this.target="auto";
  }
  setMode(m){this.mode=m;}
  update(frameMs, reduceMotion){
    this.frameMs = frameMs;
    let q="auto";
    if(this.mode!=="auto") q=this.mode;
    else{
      if(reduceMotion) q="low";
      else if(frameMs<18) q="high";
      else if(frameMs<28) q="med";
      else q="low";
    }
    this.target=q;
    if(q==="high") this.scale=1.0;
    if(q==="med") this.scale=0.85;
    if(q==="low") this.scale=0.72;
  }
  pixelRatio(){
    const base = Math.min(2, this.dpr);
    return base*this.scale;
  }
}

/* -------------------------
   Simulation state
-------------------------- */
class SimulationState{
  constructor(){
    // globals
    this.E=0.62;
    this.T=0.55;
    this.sig=0.18;
    this.gam=0.35;
    this.kauto=0.62;
    this.Ec=0.58;
    this.flow=0.12;

    // field (conceptual)
    this.chi=0.35;   // chirality
    this.kap=0.35;   // curvature visual
    this.pMag=0.55;  // polarity magnitude
    this.pAng=1.05;  // polarity angle
    this.invLD=false;

    // darwin
    this.darwin=false;
    this.mut=0.08;
    this.sel=0.55;
    this.window=240; // frames evaluation window

    // derived outputs
    this.frif=0;
    this.frifMax=0;
    this.sigmaDot=0; // entropy production proxy
    this.regime="—";
  }
  exportParams(){
    return {
      E: this.E.toFixed(3),
      T: this.T.toFixed(3),
      sig: this.sig.toFixed(3),
      gam: this.gam.toFixed(3),
      kauto: this.kauto.toFixed(3),
      Ec: this.Ec.toFixed(3),
      flow: this.flow.toFixed(3),
      chi: this.chi.toFixed(3),
      kap: this.kap.toFixed(3),
      pMag: this.pMag.toFixed(3),
      pAng: this.pAng.toFixed(3),
      invLD: this.invLD?1:0,
      darwin: this.darwin?1:0,
    };
  }
  importParams(obj){
    const f=(k,def)=> (k in obj)? parseFloat(obj[k]) : def;
    const b=(k,def)=> (k in obj)? (String(obj[k])==="1"||String(obj[k])==="true") : def;
    this.E=clamp(f("E",this.E),0,1);
    this.T=clamp(f("T",this.T),0.05,1.5);
    this.sig=clamp(f("sig",this.sig),0,1);
    this.gam=clamp(f("gam",this.gam),0.02,1.2);
    this.kauto=clamp(f("kauto",this.kauto),0,1);
    this.Ec=clamp(f("Ec",this.Ec),0.05,0.95);
    this.flow=clamp(f("flow",this.flow),-1,1);
    this.chi=clamp(f("chi",this.chi),-1,1);
    this.kap=clamp(f("kap",this.kap),0,1);
    this.pMag=clamp(f("pMag",this.pMag),0,1);
    this.pAng=clamp(f("pAng",this.pAng),0,Math.PI*2);
    this.invLD=b("invLD",this.invLD);
    this.darwin=b("darwin",this.darwin);
  }
}

/* -------------------------
   Models
-------------------------- */
class NetworkModel{
  constructor(n=9){
    this.n=n;
    this.nodes=[];
    for(let i=0;i<n;i++){
      this.nodes.push({
        x: Math.cos(i/n*Math.PI*2),
        y: Math.sin(i/n*Math.PI*2),
        c: rand(0.2,0.8),
        dc: 0
      });
    }
    this.edges=[];
    for(let i=0;i<n;i++){
      // ring
      this.edges.push([i,(i+1)%n, rand(0.2,0.9)]);
      // random chord
      const j=(i+Math.floor(rand(2,n-1)))%n;
      this.edges.push([i,j, rand(0.1,0.6)]);
    }
    this.loopScore=0;
  }
  step(s, dt){
    // toy kinetics: dC = inflow - outflow + autocatalysis - dissipation + noise
    const n=this.n;
    const C=this.nodes.map(o=>o.c);
    const inflow = 0.10 + 0.20*clamp(s.flow,0,1);
    const outflow= 0.12 - 0.18*clamp(s.flow,-1,0); // if negative flow => stronger out
    const k = 0.20 + 1.20*s.kauto;
    const gamma = 0.10 + 0.80*s.gam;
    const noise = (0.02 + 0.18*s.sig) * (0.35 + s.T);

    // adjacency influence
    const inSum=new Array(n).fill(0);
    const outSum=new Array(n).fill(0);
    let loops=0;

    for(const [a,b,w] of this.edges){
      const flux = w * C[a] * (0.2 + 0.8*C[b]); // simple coupling
      outSum[a]+=flux;
      inSum[b]+=flux;
      // loop proxy: strong mutual support
      if (w>0.55 && C[a]>0.55 && C[b]>0.55) loops++;
    }
    this.loopScore = loops;

    for(let i=0;i<n;i++){
      const ci=C[i];
      const auto = k * ci*ci*(1-ci); // autocatalysis saturating
      const d = inflow*(1-ci) - outflow*ci + 0.12*(inSum[i]-outSum[i]) + auto - gamma*ci;
      const stoch = noise*(rand(-1,1));
      this.nodes[i].dc = d + stoch;
    }

    // integrate and clamp
    for(let i=0;i<n;i++){
      this.nodes[i].c = clamp(this.nodes[i].c + this.nodes[i].dc*dt, 0, 1);
    }
  }
}

class AttractorModel{
  constructor(){
    this.x=0.1; this.y=0.2;
    this.hist=[]; // [{x,y}]
    this.maxHist=1600;
    this.deff=0; // effective dimension proxy
  }
  step(s, dt){
    // forced nonlinear oscillator (toy): depends on E, noise, gamma
    // stable when E > Ec and noise low
    const E=s.E, Ec=s.Ec;
    const stab = clamp((E-Ec)*2.0, -1, 1);
    const a = 1.2 + 0.9*stab;     // nonlinearity
    const b = 0.6 + 0.9*(1-stab); // damping-ish
    const g = 0.4 + 1.2*s.gam;
    const n = (0.02 + 0.20*s.sig)*(0.35+s.T);

    // dynamics
    const dx = (a*(this.y - this.x*this.x*this.x) - b*this.x - g*this.x) * dt;
    const dy = (-this.x - 0.8*this.y + 0.5*stab) * dt;

    this.x += dx + n*rand(-1,1)*dt*22;
    this.y += dy + n*rand(-1,1)*dt*22;

    // keep bounded
    this.x = clamp(this.x, -2.2, 2.2);
    this.y = clamp(this.y, -2.2, 2.2);

    this.hist.push({x:this.x, y:this.y});
    if(this.hist.length>this.maxHist) this.hist.shift();

    // dimension proxy via occupancy entropy in bins
    const bins=18;
    let occ=0;
    const seen=new Set();
    const take = Math.min(900, this.hist.length);
    for(let i=this.hist.length-take;i<this.hist.length;i++){
      const p=this.hist[i];
      const ix=clamp(Math.floor((p.x+2.2)/4.4*bins),0,bins-1);
      const iy=clamp(Math.floor((p.y+2.2)/4.4*bins),0,bins-1);
      const key=ix+","+iy;
      if(!seen.has(key)){seen.add(key); occ++;}
    }
    // normalized "effective dimension-ish"
    const frac = occ/(bins*bins);
    this.deff = clamp(2.0*(1 - Math.exp(-4*frac)), 0.2, 2.0);
  }
}

class FRIFEstimator{
  constructor(){
    this.Vref=null;
    this.frif=0;
    this.spark=[];
    this.maxSpark=220;
  }
  step(s, attractor){
    // Veff from occupancy in coarser bins + deff
    const bins=16;
    const seen=new Set();
    const take=Math.min(600, attractor.hist.length);
    for(let i=attractor.hist.length-take;i<attractor.hist.length;i++){
      const p=attractor.hist[i];
      const ix=clamp(Math.floor((p.x+2.2)/4.4*bins),0,bins-1);
      const iy=clamp(Math.floor((p.y+2.2)/4.4*bins),0,bins-1);
      seen.add(ix+","+iy);
    }
    const occ=seen.size;
    const Veff = clamp(occ/(bins*bins), 1e-6, 1);
    // Vref baseline: update slowly when in "desorganized" conditions
    const des = (s.E < s.Ec*0.85) && (s.sig>0.25 || s.T>0.75);
    if(this.Vref===null) this.Vref = Veff;
    const alpha = des ? 0.015 : 0.002;
    this.Vref = clamp(lerp(this.Vref, Math.max(this.Vref, Veff), alpha), 1e-6, 1);

    // FRIF = -log(Veff/Vref), scaled by (2 - deff) to reflect dimensional reduction
    const base = -Math.log(clamp(Veff/this.Vref, 1e-6, 1));
    const dimFactor = clamp(0.65 + 0.55*(2.0 - attractor.deff), 0.45, 1.45);
    this.frif = base*dimFactor;

    this.spark.push(this.frif);
    if(this.spark.length>this.maxSpark) this.spark.shift();

    // Cota FRIF_max(E): simple saturating bound (conceptual)
    s.frifMax = 0.2 + 2.4*(1 - Math.exp(-3.2*s.E)) * (1 - 0.35*s.gam);
    s.frif = this.frif;

    // entropy export proxy: increases with dissipation + flow + activity
    s.sigmaDot = clamp(0.4*s.gam*(0.5+s.E) + 0.2*Math.abs(s.flow) + 0.25*(s.sig+s.T*0.5), 0, 3.5);
  }
}

class QuantumFieldModel{
  constructor(){
    this.nx=140; this.ny=56;
    this.phi = new Float32Array(this.nx*this.ny);
    this.vx  = new Float32Array(this.nx*this.ny);
    this.vy  = new Float32Array(this.nx*this.ny);
    // init
    for(let i=0;i<this.phi.length;i++){
      this.phi[i] = rand(-0.2,0.2);
    }
    this.xi=0.55; // correlation length proxy for display
  }
  resize(nx, ny){
    if(nx===this.nx && ny===this.ny) return;
    this.nx=nx; this.ny=ny;
    this.phi = new Float32Array(nx*ny);
    this.vx  = new Float32Array(nx*ny);
    this.vy  = new Float32Array(nx*ny);
    for(let i=0;i<this.phi.length;i++){
      this.phi[i] = rand(-0.2,0.2);
    }
  }
  idx(x,y){ return x + y*this.nx; }
  step(s, dt){
    const nx=this.nx, ny=this.ny;
    const chi = s.invLD ? -s.chi : s.chi;
    const kap = s.kap;
    // polarity vector
    const px = s.pMag*Math.cos(s.pAng);
    const py = s.pMag*Math.sin(s.pAng);

    // noise intensity depends on T and sigma
    const noise = (0.03 + 0.25*s.sig)*(0.25 + 0.75*s.T);

    // stability depends on energy surplus
    const surplus = clamp((s.E - s.Ec)*2.0, -1, 1);
    const damp = 0.18 + 0.6*s.gam - 0.10*surplus;
    const drive = 0.12 + 0.35*surplus + 0.12*s.kauto;

    // correlation proxy (for UI): grows with stability, shrinks with noise
    this.xi = clamp(0.25 + 0.55*clamp(surplus,0,1) - 0.25*(s.sig*0.8 + s.T*0.3), 0.05, 0.95);

    // update: reaction-diffusion-ish + chiral advection + polarity advection + damping
    // φ_t = D∇²φ + drive*tanh(φ) - damp*φ + chiralTerm + advection + noise
    const D = 0.35 + 0.6*this.xi;
    const adv = 0.25 + 0.9*s.pMag; // directed transport
    const chiral = 0.9*chi;

    // temporary buffers
    const newPhi = new Float32Array(nx*ny);

    // laplacian helper
    for(let y=0;y<ny;y++){
      const y0 = (y-1+ny)%ny, y1 = (y+1)%ny;
      for(let x=0;x<nx;x++){
        const x0 = (x-1+nx)%nx, x1 = (x+1)%nx;
        const i=this.idx(x,y);
        const c=this.phi[i];
        const lap = this.phi[this.idx(x0,y)] + this.phi[this.idx(x1,y)] + this.phi[this.idx(x,y0)] + this.phi[this.idx(x,y1)] - 4*c;

        // chiral term: use perpendicular gradient dot (conceptual handedness)
        const gx = (this.phi[this.idx(x1,y)] - this.phi[this.idx(x0,y)])*0.5;
        const gy = (this.phi[this.idx(x,y1)] - this.phi[this.idx(x,y0)])*0.5;
        const curlLike = ( -gy*px + gx*py ); // couples to polarity; handedness flips with chi

        // directed advection (5'->3' conceptual): along P
        const advTerm = -(px*gx + py*gy) * adv;

        // curvature visual doesn't change physics; it's used in renderer. Here we slightly modulate diffusion as “métrica efectiva”
        const metric = 1 + 0.65*kap*Math.sin((x/nx)*Math.PI*2)*Math.cos((y/ny)*Math.PI*2);

        let dphi = (D*metric)*lap + drive*Math.tanh(1.6*c) - damp*c + chiral*curlLike + advTerm;
        dphi += noise*rand(-1,1);

        newPhi[i] = c + dphi*dt;
      }
    }
    this.phi = newPhi;

    // build a vector field for arrows (for renderer): v = grad φ rotated by chirality + polarity
    for(let y=0;y<ny;y++){
      const y0=(y-1+ny)%ny, y1=(y+1)%ny;
      for(let x=0;x<nx;x++){
        const x0=(x-1+nx)%nx, x1=(x+1)%nx;
        const i=this.idx(x,y);
        const gx = (this.phi[this.idx(x1,y)] - this.phi[this.idx(x0,y)])*0.5;
        const gy = (this.phi[this.idx(x,y1)] - this.phi[this.idx(x,y0)])*0.5;
        // rotate gradient by +/-90° to show handedness
        const rx = -gy;
        const ry = gx;
        this.vx[i] = 0.55*rx*(chi) + 0.45*px;
        this.vy[i] = 0.55*ry*(chi) + 0.45*py;
      }
    }
  }
}

/* -------------------------
   Darwin module (algorithm)
-------------------------- */
class DarwinModule{
  constructor(){
    this.timer=0;
    this.best=null;
    this.history=[];
    this.maxHist=220;
  }
  step(s, score){
    if(!s.darwin) return;

    // score: want high FRIF stability and low sigmaDot (efficiency)
    const fitness = score;

    if(this.best===null){
      this.best = { params: {...s.exportParams()}, fit: fitness };
      return;
    }

    this.timer++;
    if(this.timer % s.window !== 0) return;

    // mutate candidate
    const cand = {...s.exportParams()};
    const mu = 0.12*s.mut + 0.02;
    // mutate: kauto, gam, Ec slightly, also chi, pMag (within bounds)
    cand.kauto = clamp(parseFloat(cand.kauto) + rand(-mu,mu), 0, 1).toFixed(3);
    cand.gam   = clamp(parseFloat(cand.gam)   + rand(-mu,mu), 0.02, 1.2).toFixed(3);
    cand.Ec    = clamp(parseFloat(cand.Ec)    + rand(-mu,mu), 0.05, 0.95).toFixed(3);
    cand.chi   = clamp(parseFloat(cand.chi)   + rand(-mu,mu), -1, 1).toFixed(3);
    cand.pMag  = clamp(parseFloat(cand.pMag)  + rand(-mu,mu), 0, 1).toFixed(3);

    // evaluate quick proxy: higher FRIF + lower sigmaDot
    // Use current as baseline; selection pressure decides acceptance
    const accept = (fitness >= this.best.fit) || (Math.random() < clamp(s.sel*0.25,0,0.25));
    if(accept){
      this.best = { params: cand, fit: fitness };
      // apply best
      s.importParams(this.best.params);
      syncUIFromState();
    }

    this.history.push({fit:this.best.fit});
    if(this.history.length>this.maxHist) this.history.shift();
  }
}

/* -------------------------
   Renderers
-------------------------- */
class BaseRenderer{
  constructor(canvas, scaler){
    this.c=canvas;
    this.ctx=canvas.getContext("2d", {alpha:true});
    this.scaler=scaler;
    this.w=1; this.h=1; this.pr=1;
    this.resize();
    window.addEventListener("resize", ()=>this.resize());
  }
  resize(){
    const rect=this.c.getBoundingClientRect();
    this.pr=this.scaler.pixelRatio();
    this.w=Math.max(240, Math.floor(rect.width*this.pr));
    this.h=Math.max(160, Math.floor(rect.height*this.pr));
    this.c.width=this.w;
    this.c.height=this.h;
  }
  clear(){
    const g=this.ctx;
    g.clearRect(0,0,this.w,this.h);
  }
  hudText(txt,x,y,alpha=0.9){
    const g=this.ctx;
    g.save();
    g.globalAlpha=alpha;
    g.font=`${Math.floor(12*this.pr)}px ${getComputedStyle(document.documentElement).getPropertyValue('--mono')||'monospace'}`;
    g.fillStyle=getComputedStyle(document.body).color;
    g.fillText(txt,x,y);
    g.restore();
  }
}

class NetworkRenderer extends BaseRenderer{
  draw(s, model){
    const g=this.ctx;
    const W=this.w, H=this.h;
    // background
    g.fillStyle="rgba(0,0,0,0.08)";
    g.fillRect(0,0,W,H);

    const cx=W*0.5, cy=H*0.52;
    const R=Math.min(W,H)*0.33;

    // edges
    g.lineWidth=1.2*this.pr;
    for(const [a,b,w] of model.edges){
      const na=model.nodes[a], nb=model.nodes[b];
      const x1=cx+na.x*R, y1=cy+na.y*R;
      const x2=cx+nb.x*R, y2=cy+nb.y*R;
      const flux = w*(na.c - nb.c);
      const alpha = 0.10 + 0.35*Math.abs(flux);
      g.strokeStyle=`rgba(125,211,252,${alpha})`;
      g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();

      // flow marker
      const t=0.5 + 0.35*Math.sin(perf.t*0.001 + (a*3+b));
      const mx=lerp(x1,x2,t), my=lerp(y1,y2,t);
      g.fillStyle=`rgba(167,139,250,${0.20+0.35*Math.abs(flux)})`;
      g.beginPath(); g.arc(mx,my, (2.2+3.2*Math.abs(flux))*this.pr, 0, Math.PI*2); g.fill();
    }

    // nodes
    for(let i=0;i<model.n;i++){
      const n=model.nodes[i];
      const x=cx+n.x*R, y=cy+n.y*R;
      const r=(7+10*n.c)*this.pr;
      // glow
      g.fillStyle=`rgba(52,211,153,${0.06+0.20*n.c})`;
      g.beginPath(); g.arc(x,y,r*1.9,0,Math.PI*2); g.fill();
      // core
      g.fillStyle=`rgba(255,255,255,${0.22+0.52*n.c})`;
      g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fill();
      // label
      g.fillStyle="rgba(232,238,246,.65)";
      g.font=`${Math.floor(10*this.pr)}px var(--mono)`;
      g.fillText(String(i+1), x+8*this.pr, y-8*this.pr);
    }

    // overlay
    const org = clamp((s.frif/s.frifMax),0,1);
    g.fillStyle="rgba(0,0,0,0.35)";
    g.fillRect(10*this.pr, 10*this.pr, 180*this.pr, 54*this.pr);
    g.strokeStyle="rgba(255,255,255,0.14)";
    g.strokeRect(10*this.pr, 10*this.pr, 180*this.pr, 54*this.pr);

    g.fillStyle="rgba(232,238,246,.85)";
    g.font=`${Math.floor(12*this.pr)}px var(--mono)`;
    g.fillText(`loops=${model.loopScore}`, 18*this.pr, 30*this.pr);
    g.fillText(`org=${fmt(org,2)}`, 18*this.pr, 48*this.pr);

    // bar
    g.fillStyle="rgba(125,211,252,.25)";
    g.fillRect(18*this.pr, 58*this.pr, 160*this.pr, 8*this.pr);
    g.fillStyle="rgba(125,211,252,.8)";
    g.fillRect(18*this.pr, 58*this.pr, 160*this.pr*org, 8*this.pr);
  }
}

class AttractorRenderer extends BaseRenderer{
  constructor(canvas, scaler){
    super(canvas, scaler);
    this.fade=0.08;
  }
  draw(s, model, reduceMotion){
    const g=this.ctx, W=this.w, H=this.h;
    // oscilloscope fade
    g.fillStyle = reduceMotion ? "rgba(0,0,0,0.22)" : `rgba(0,0,0,${this.fade})`;
    g.fillRect(0,0,W,H);

    // axes
    g.strokeStyle="rgba(255,255,255,0.10)";
    g.lineWidth=1*this.pr;
    g.beginPath();
    g.moveTo(W*0.5, 0); g.lineTo(W*0.5, H);
    g.moveTo(0, H*0.5); g.lineTo(W, H*0.5);
    g.stroke();

    // trace
    const scale = Math.min(W,H)*0.20;
    g.lineWidth=1.4*this.pr;
    g.strokeStyle="rgba(125,211,252,0.75)";
    g.beginPath();
    const hist=model.hist;
    for(let i=0;i<hist.length;i++){
      const p=hist[i];
      const x=W*0.5 + (p.x/2.2)*scale;
      const y=H*0.5 + (p.y/2.2)*scale;
      if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
    }
    g.stroke();

    // current point glow
    const x=W*0.5 + (model.x/2.2)*scale;
    const y=H*0.5 + (model.y/2.2)*scale;
    g.fillStyle="rgba(167,139,250,0.25)";
    g.beginPath(); g.arc(x,y, 14*this.pr, 0, Math.PI*2); g.fill();
    g.fillStyle="rgba(255,255,255,0.70)";
    g.beginPath(); g.arc(x,y, 3.5*this.pr, 0, Math.PI*2); g.fill();

    // sparkline FRIF
    g.save();
    g.translate(10*this.pr, H-46*this.pr);
    g.fillStyle="rgba(0,0,0,0.35)";
    g.fillRect(0,0, 190*this.pr, 36*this.pr);
    g.strokeStyle="rgba(255,255,255,0.12)";
    g.strokeRect(0,0, 190*this.pr, 36*this.pr);

    const sp=frifEst.spark;
    const n=sp.length;
    if(n>2){
      const maxV=Math.max(...sp, 1e-6);
      g.strokeStyle="rgba(52,211,153,0.75)";
      g.lineWidth=1.2*this.pr;
      g.beginPath();
      for(let i=0;i<n;i++){
        const t=i/(n-1);
        const v=sp[i]/maxV;
        const px=t*190*this.pr;
        const py=(1-v)*36*this.pr;
        if(i===0) g.moveTo(px,py); else g.lineTo(px,py);
      }
      g.stroke();
    }
    g.fillStyle="rgba(232,238,246,.85)";
    g.font=`${Math.floor(11*this.pr)}px var(--mono)`;
    g.fillText(`FRIF(t)`, 6*this.pr, 12*this.pr);
    g.restore();
  }
}

class ChartRenderer extends BaseRenderer{
  draw(s){
    const g=this.ctx, W=this.w, H=this.h;
    g.fillStyle="rgba(0,0,0,0.10)";
    g.fillRect(0,0,W,H);

    const pad=26*this.pr;
    const x0=pad, x1=W-pad;
    const y0=H-pad, y1=pad;

    // grid
    g.strokeStyle="rgba(255,255,255,0.08)";
    g.lineWidth=1*this.pr;
    for(let i=0;i<=4;i++){
      const t=i/4;
      const y=lerp(y0,y1,t);
      g.beginPath(); g.moveTo(x0,y); g.lineTo(x1,y); g.stroke();
    }
    for(let i=0;i<=5;i++){
      const t=i/5;
      const x=lerp(x0,x1,t);
      g.beginPath(); g.moveTo(x,y0); g.lineTo(x,y1); g.stroke();
    }

    // cota FRIF_max(E)
    const maxY=3.2; // display scale
    g.lineWidth=2*this.pr;
    g.strokeStyle="rgba(167,139,250,0.65)";
    g.beginPath();
    for(let i=0;i<=180;i++){
      const E=i/180;
      const fr = 0.2 + 2.4*(1 - Math.exp(-3.2*E)) * (1 - 0.35*s.gam);
      const x=lerp(x0,x1,E);
      const y=lerp(y0,y1, clamp(fr/maxY,0,1));
      if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
    }
    g.stroke();

    // measured FRIF at current E (point)
    const xE=lerp(x0,x1,s.E);
    const yF=lerp(y0,y1, clamp(s.frif/maxY,0,1));
    g.fillStyle="rgba(125,211,252,0.22)";
    g.beginPath(); g.arc(xE,yF, 18*this.pr, 0, Math.PI*2); g.fill();
    g.fillStyle="rgba(255,255,255,0.82)";
    g.beginPath(); g.arc(xE,yF, 4.2*this.pr, 0, Math.PI*2); g.fill();

    // threshold Ec line
    const xEc=lerp(x0,x1,s.Ec);
    g.strokeStyle="rgba(251,191,36,0.65)";
    g.setLineDash([6*this.pr, 6*this.pr]);
    g.beginPath(); g.moveTo(xEc,y0); g.lineTo(xEc,y1); g.stroke();
    g.setLineDash([]);

    // labels
    g.fillStyle="rgba(232,238,246,.85)";
    g.font=`${Math.floor(11*this.pr)}px var(--mono)`;
    g.fillText("E", x1-10*this.pr, y0+16*this.pr);
    g.fillText("FRIF", x0-4*this.pr, y1-10*this.pr);
    g.fillText(`E_c=${fmt(s.Ec,3)}`, xEc+6*this.pr, y1+14*this.pr);
    g.fillText(`FRIF_max≈${fmt(s.frifMax,3)}`, x0+6*this.pr, y1+14*this.pr);
  }
}

class FlowRenderer extends BaseRenderer{
  draw(s){
    const g=this.ctx, W=this.w, H=this.h;
    g.fillStyle="rgba(0,0,0,0.10)";
    g.fillRect(0,0,W,H);

    const pad=18*this.pr;
    const boxW=W-2*pad, boxH=H-2*pad;
    // chamber
    g.strokeStyle="rgba(255,255,255,0.16)";
    g.lineWidth=1.4*this.pr;
    g.strokeRect(pad, pad, boxW, boxH);

    // arrows
    const inE = s.E;
    const diss = clamp(s.gam*(0.5+s.E), 0, 1.6);
    const expS = clamp(s.sigmaDot/3.5, 0, 1);

    // energy in arrow
    drawArrow(g, pad-6*this.pr, H*0.35, pad+boxW*0.25, H*0.35, 3.0*this.pr, `rgba(125,211,252,${0.35+0.55*inE})`);
    // out entropy arrow
    drawArrow(g, pad+boxW*0.75, H*0.68, pad+boxW+6*this.pr, H*0.68, 3.0*this.pr, `rgba(251,191,36,${0.25+0.65*expS})`);

    // inside bars
    const bx=pad+12*this.pr, by=pad+12*this.pr;
    bar(g, bx, by, boxW-24*this.pr, 10*this.pr, inE, "Entrada E", "rgba(125,211,252,0.85)");
    bar(g, bx, by+26*this.pr, boxW-24*this.pr, 10*this.pr, clamp(diss/1.6,0,1), "Disipación γ", "rgba(251,113,133,0.80)");
    bar(g, bx, by+52*this.pr, boxW-24*this.pr, 10*this.pr, expS, "Entropía exportada Σ̇", "rgba(251,191,36,0.85)");

    // organization dial (proxy)
    const org = clamp(s.frif/(s.frifMax+1e-6), 0, 1);
    g.save();
    g.translate(pad+boxW*0.5, pad+boxH*0.72);
    const R=Math.min(boxW, boxH)*0.18;
    g.strokeStyle="rgba(255,255,255,0.14)";
    g.lineWidth=8*this.pr;
    g.beginPath(); g.arc(0,0,R, Math.PI*0.75, Math.PI*2.25); g.stroke();
    g.strokeStyle="rgba(52,211,153,0.85)";
    g.beginPath(); g.arc(0,0,R, Math.PI*0.75, Math.PI*0.75 + (Math.PI*1.5)*org); g.stroke();
    g.fillStyle="rgba(232,238,246,.86)";
    g.font=`${Math.floor(12*this.pr)}px var(--mono)`;
    g.fillText(`org=${fmt(org,2)}`, -36*this.pr, 4*this.pr);
    g.restore();
  }
}

class QuantumFieldRenderer extends BaseRenderer{
  constructor(canvas, scaler){
    super(canvas, scaler);
    this.img=null;
    this.lastDims={};
  }
  draw(s, model, reduceMotion){
    const g=this.ctx, W=this.w, H=this.h;

    // choose grid resolution based on quality
    const q = perf.scaler.target;
    const baseNx = q==="high"?160 : q==="med"?132 : 110;
    const baseNy = q==="high"?60  : q==="med"?52  : 44;
    model.resize(baseNx, baseNy);

    // image buffer
    const nx=model.nx, ny=model.ny;
    if(!this.img || this.lastDims.nx!==nx || this.lastDims.ny!==ny){
      this.img = g.createImageData(nx, ny);
      this.lastDims={nx,ny};
    }
    const img=this.img.data;
    const phi=model.phi;
    // curvature warp grid (visual only)
    const kap=s.kap;
    // render scalar field as color map
    for(let y=0;y<ny;y++){
      for(let x=0;x<nx;x++){
        const i=x+y*nx;
        const v=phi[i];
        const u = 0.5 + 0.45*Math.tanh(1.2*v);
        // hue blend: cyan <-> violet based on sign, plus green for stability
        const pos = clamp(v*1.2, -1, 1);
        const r = clamp(40 + 200*(0.35 + 0.35*u) + 60*(pos>0?pos:0), 0, 255);
        const gg= clamp(50 + 160*(0.25 + 0.25*u) + 85*(1 - Math.abs(pos))*clamp((s.E-s.Ec)*1.5,0,1), 0, 255);
        const b = clamp(70 + 180*(0.45 + 0.35*(1-u)) + 70*(pos<0?-pos:0), 0, 255);

        img[i*4+0]=r;
        img[i*4+1]=gg;
        img[i*4+2]=b;
        img[i*4+3]=255;
      }
    }

    // draw to offscreen and scale with warp (simple)
    // we fake warp by drawing in strips with x displacement
    g.save();
    g.fillStyle="rgba(0,0,0,0.10)";
    g.fillRect(0,0,W,H);

    // draw scalar field
    // Put imageData into temporary canvas via putImageData on current ctx (small), then drawImage
    const tmp = QuantumFieldRenderer._tmp || (QuantumFieldRenderer._tmp=document.createElement("canvas"));
    tmp.width=nx; tmp.height=ny;
    const tg=tmp.getContext("2d");
    tg.putImageData(this.img,0,0);

    const strips=12;
    for(let si=0; si<strips; si++){
      const t=si/(strips-1);
      const sx=Math.floor(t*nx);
      const sw=Math.floor(nx/strips)+1;
      const dx=lerp(0,W,t);
      const dw=W/strips + 2;

      // warp offset (Einstein-style “métrica” visual)
      const off = (kap*0.18*W)*Math.sin(t*Math.PI*2 + perf.t*0.0006)*Math.cos(perf.t*0.00045);
      g.drawImage(tmp, sx, 0, sw, ny, dx+off, 0, dw, H);
    }

    // grid overlay
    g.globalAlpha = 0.22;
    g.strokeStyle="rgba(255,255,255,0.22)";
    g.lineWidth=1*this.pr;
    const gx=10, gy=5;
    for(let i=0;i<=gx;i++){
      const t=i/gx;
      const x=lerp(0,W,t);
      g.beginPath();
      for(let y=0;y<=40;y++){
        const ty=y/40;
        const yy=lerp(0,H,ty);
        const off = (kap*0.08*W)*Math.sin(t*Math.PI*2 + perf.t*0.0006)*Math.cos(ty*Math.PI*2);
        if(y===0) g.moveTo(x+off,yy); else g.lineTo(x+off,yy);
      }
      g.stroke();
    }
    for(let j=0;j<=gy;j++){
      const t=j/gy;
      const y=lerp(0,H,t);
      g.beginPath();
      for(let x=0;x<=80;x++){
        const tx=x/80;
        const xx=lerp(0,W,tx);
        const off = (kap*0.08*H)*Math.sin(tx*Math.PI*2 + perf.t*0.00045)*Math.cos(t*Math.PI*2);
        if(x===0) g.moveTo(xx, y+off); else g.lineTo(xx, y+off);
      }
      g.stroke();
    }
    g.globalAlpha = 1;

    // vector arrows (reduced if reduceMotion)
    const step = reduceMotion ? 10 : 7;
    g.strokeStyle="rgba(232,238,246,0.35)";
    g.lineWidth=1*this.pr;
    for(let y=0;y<ny;y+=step){
      for(let x=0;x<nx;x+=step){
        const i=x+y*nx;
        const vx=model.vx[i], vy=model.vy[i];
        const px=x/(nx-1)*W;
        const py=y/(ny-1)*H;
        const len = 10*this.pr;
        const mag = clamp(Math.hypot(vx,vy), 0, 2);
        const ax = (vx/(mag+1e-6))*len*0.6*mag;
        const ay = (vy/(mag+1e-6))*len*0.6*mag;
        g.beginPath();
        g.moveTo(px,py);
        g.lineTo(px+ax, py+ay);
        g.stroke();
      }
    }

    // polarity axis
    const px = s.pMag*Math.cos(s.pAng);
    const py = s.pMag*Math.sin(s.pAng);
    g.strokeStyle="rgba(251,191,36,0.65)";
    g.lineWidth=2.0*this.pr;
    g.beginPath();
    g.moveTo(W*0.5, H*0.5);
    g.lineTo(W*0.5 + px*W*0.18, H*0.5 + py*H*0.18);
    g.stroke();

    g.fillStyle="rgba(232,238,246,.85)";
    g.font=`${Math.floor(12*this.pr)}px var(--mono)`;
    const chi = s.invLD ? -s.chi : s.chi;
    g.fillText(`χ=${fmt(chi,3)}  κ=${fmt(s.kap,3)}  |P|=${fmt(s.pMag,3)}  ξ=${fmt(model.xi,3)}`, 12*this.pr, 18*this.pr);
    g.restore();
  }
}

function drawArrow(g, x1,y1,x2,y2, w, color){
  g.save();
  g.strokeStyle=color;
  g.fillStyle=color;
  g.lineWidth=w;
  g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
  const ang=Math.atan2(y2-y1,x2-x1);
  const ah=10*w;
  g.beginPath();
  g.moveTo(x2,y2);
  g.lineTo(x2 - Math.cos(ang-0.5)*ah, y2 - Math.sin(ang-0.5)*ah);
  g.lineTo(x2 - Math.cos(ang+0.5)*ah, y2 - Math.sin(ang+0.5)*ah);
  g.closePath();
  g.fill();
  g.restore();
}
function bar(g,x,y,w,h,val,label,color){
  g.save();
  g.fillStyle="rgba(255,255,255,0.06)";
  g.fillRect(x,y,w,h);
  g.fillStyle=color;
  g.fillRect(x,y,w*clamp(val,0,1),h);
  g.strokeStyle="rgba(255,255,255,0.14)";
  g.strokeRect(x,y,w,h);
  g.fillStyle="rgba(232,238,246,.8)";
  g.font=`${Math.floor(11*(window.devicePixelRatio||1))}px var(--mono)`;
  g.fillText(label, x, y-4);
  g.restore();
}

/* -------------------------
   Engine
-------------------------- */
class Engine{
  constructor(){
    this.running=true;
    this.last=performance.now();
    this.dt=0.016;
  }
  tick(){
    const now=performance.now();
    const frameMs = now-this.last;
    this.last=now;
    // clamp dt
    this.dt = clamp(frameMs/1000, 0.001, 0.05);

    // performance update
    perf.t = now;
    perf.scaler.update(frameMs, ui.reduceMotion.checked);

    // resize all canvases (when DPR changes)
    perf.maybeResizeAll();

    if(this.running){
      simStep(this.dt);
      renderStep(ui.reduceMotion.checked);
    }

    requestAnimationFrame(()=>this.tick());
  }
}

/* -------------------------
   UI wiring
-------------------------- */
const s = new SimulationState();
const perf = {
  t:0,
  scaler: new PerformanceScaler(),
  renderers: [],
  maybeResizeAll(){
    // if pixelRatio changed due to quality adjustments, resize
    for(const r of this.renderers) r.resize();
  }
};

const ui = {
  E: document.getElementById("E"),
  T: document.getElementById("T"),
  sig: document.getElementById("sig"),
  gam: document.getElementById("gam"),
  kauto: document.getElementById("kauto"),
  Ec: document.getElementById("Ec"),
  flow: document.getElementById("flow"),
  chi: document.getElementById("chi"),
  kap: document.getElementById("kap"),
  pMag: document.getElementById("pMag"),
  pAng: document.getElementById("pAng"),
  darwin: document.getElementById("darwin"),
  invLD: document.getElementById("invLD"),

  oE: document.getElementById("oE"),
  oT: document.getElementById("oT"),
  oSig: document.getElementById("oSig"),
  oGam: document.getElementById("oGam"),
  oK: document.getElementById("oK"),
  oEc: document.getElementById("oEc"),
  oFlow: document.getElementById("oFlow"),
  oChi: document.getElementById("oChi"),
  oKap: document.getElementById("oKap"),
  oP: document.getElementById("oP"),
  oPa: document.getElementById("oPa"),

  preset: document.getElementById("preset"),
  btnPause: document.getElementById("btnPause"),
  btnReset: document.getElementById("btnReset"),
  btnTheme: document.getElementById("btnTheme"),
  btnPresent: document.getElementById("btnPresent"),
  btnCopyLink: document.getElementById("btnCopyLink"),
  btnExport: document.getElementById("btnExport"),
  btnQuality: document.getElementById("btnQuality"),
  reduceMotion: document.getElementById("reduceMotion"),

  // top/big
  frifTop: document.getElementById("frifTop"),
  eTop: document.getElementById("eTop"),
  tTop: document.getElementById("tTop"),
  frifBig: document.getElementById("frifBig"),
  frifMaxBig: document.getElementById("frifMaxBig"),
  eBig: document.getElementById("eBig"),
  sxBig: document.getElementById("sxBig"),
  regDot: document.getElementById("regDot"),
  regLabel: document.getElementById("regLabel"),

  loops: document.getElementById("loops"),
  deff: document.getElementById("deff"),
  ecShow: document.getElementById("ecShow"),
  sigmadot: document.getElementById("sigmadot"),
  xiShow: document.getElementById("xiShow"),

  btnCopyPrompt: document.getElementById("btnCopyPrompt"),
  btnDownloadPrompt: document.getElementById("btnDownloadPrompt")
};

function syncUIFromState(){
  ui.E.value = s.E;
  ui.T.value = s.T;
  ui.sig.value = s.sig;
  ui.gam.value = s.gam;
  ui.kauto.value = s.kauto;
  ui.Ec.value = s.Ec;
  ui.flow.value = s.flow;

  ui.chi.value = s.chi;
  ui.kap.value = s.kap;
  ui.pMag.value = s.pMag;
  ui.pAng.value = s.pAng;
  ui.darwin.checked = s.darwin;
  ui.invLD.checked = s.invLD;

  updateOutputs();
}
function updateOutputs(){
  ui.oE.textContent = fmt(s.E,3);
  ui.oT.textContent = fmt(s.T,3);
  ui.oSig.textContent = fmt(s.sig,3);
  ui.oGam.textContent = fmt(s.gam,3);
  ui.oK.textContent = fmt(s.kauto,3);
  ui.oEc.textContent = fmt(s.Ec,3);
  ui.oFlow.textContent = fmt(s.flow,3);
  ui.oChi.textContent = fmt(s.chi,3);
  ui.oKap.textContent = fmt(s.kap,3);
  ui.oP.textContent = fmt(s.pMag,3);
  ui.oPa.textContent = fmt(s.pAng,3);

  ui.frifTop.textContent = fmt(s.frif,3);
  ui.eTop.textContent = fmt(s.E,3);
  ui.tTop.textContent = fmt(s.T,3);
  ui.frifBig.textContent = fmt(s.frif,3);
  ui.frifMaxBig.textContent = fmt(s.frifMax,3);
  ui.eBig.textContent = fmt(s.E,3);
  ui.sxBig.textContent = fmt(s.sigmaDot,3);

  ui.loops.textContent = String(net.loopScore);
  ui.deff.textContent = fmt(att.deff,3);
  ui.ecShow.textContent = fmt(s.Ec,3);
  ui.sigmadot.textContent = fmt(s.sigmaDot,3);
  ui.xiShow.textContent = fmt(field.xi,3);

  // regime
  const eps=0.02;
  let reg="Subcrítico";
  let dot="warn";
  if(s.E < s.Ec-eps){ reg="Subcrítico"; dot="warn"; }
  else if(Math.abs(s.E - s.Ec)<=eps){ reg="Crítico"; dot="bad"; }
  else { reg="Supercrítico"; dot="ok"; }
  s.regime=reg;
  ui.regLabel.textContent = reg;
  ui.regDot.className = "dot "+dot;
}

function bindSlider(el, key){
  el.addEventListener("input", ()=>{
    s[key]=parseFloat(el.value);
    updateOutputs();
  });
}
bindSlider(ui.E,"E");
bindSlider(ui.T,"T");
bindSlider(ui.sig,"sig");
bindSlider(ui.gam,"gam");
bindSlider(ui.kauto,"kauto");
bindSlider(ui.Ec,"Ec");
bindSlider(ui.flow,"flow");
bindSlider(ui.chi,"chi");
bindSlider(ui.kap,"kap");
bindSlider(ui.pMag,"pMag");
bindSlider(ui.pAng,"pAng");

ui.darwin.addEventListener("change", ()=>{s.darwin=ui.darwin.checked;});
ui.invLD.addEventListener("change", ()=>{s.invLD=ui.invLD.checked;});

ui.preset.addEventListener("change", ()=>{
  applyPreset(ui.preset.value);
  syncUIFromState();
});

function applyPreset(p){
  if(p==="sub"){
    s.E=0.35; s.Ec=0.58; s.T=0.85; s.sig=0.35; s.gam=0.55; s.kauto=0.35; s.flow=0.05;
    s.chi=0.25; s.kap=0.25; s.pMag=0.25; s.pAng=1.1; s.invLD=false; s.darwin=false;
  }
  if(p==="near"){
    s.E=0.58; s.Ec=0.58; s.T=0.58; s.sig=0.18; s.gam=0.38; s.kauto=0.62; s.flow=0.12;
    s.chi=0.35; s.kap=0.35; s.pMag=0.55; s.pAng=1.05; s.invLD=false; s.darwin=false;
  }
  if(p==="super"){
    s.E=0.82; s.Ec=0.56; s.T=0.38; s.sig=0.10; s.gam=0.22; s.kauto=0.82; s.flow=0.18;
    s.chi=0.55; s.kap=0.45; s.pMag=0.65; s.pAng=0.95; s.invLD=false; s.darwin=false;
  }
  if(p==="hot"){
    s.T=1.25; s.sig=0.25;
  }
  if(p==="cold"){
    s.T=0.20; s.sig=0.08;
  }
  if(p==="chirL"){
    s.chi=0.70; s.invLD=false;
  }
  if(p==="chirD"){
    s.chi=0.70; s.invLD=true;
  }
  if(p==="pol"){
    s.pMag=0.95; s.pAng=0.35; s.flow=0.2;
  }
  if(p==="darwin"){
    s.darwin=true; s.E=0.62; s.Ec=0.58; s.gam=0.42; s.sig=0.16; s.T=0.55; s.kauto=0.55;
  }
}

/* Theme + fullscreen */
ui.btnTheme.addEventListener("click", ()=>{
  const root=document.documentElement;
  const cur=root.getAttribute("data-theme")||"dark";
  root.setAttribute("data-theme", cur==="dark" ? "light" : "dark");
});
ui.btnPresent.addEventListener("click", async ()=>{
  if(!document.fullscreenElement){
    try{ await document.documentElement.requestFullscreen(); }catch(e){}
  }else{
    try{ await document.exitFullscreen(); }catch(e){}
  }
});

ui.btnPause.addEventListener("click", ()=>{
  engine.running = !engine.running;
  ui.btnPause.textContent = engine.running ? "Pausa" : "Reanudar";
});

ui.btnReset.addEventListener("click", ()=>{
  // hard reset models
  Object.assign(s, new SimulationState());
  net = new NetworkModel(9);
  att = new AttractorModel();
  frifEst = new FRIFEstimator();
  field = new QuantumFieldModel();
  darwin = new DarwinModule();
  syncUIFromState();
});

ui.btnCopyLink.addEventListener("click", async ()=>{
  const h=hashEncode(s.exportParams());
  try{
    await navigator.clipboard.writeText(location.origin+location.pathname+h);
    ui.btnCopyLink.textContent="Copiado ✓";
    setTimeout(()=>ui.btnCopyLink.textContent="Copiar link (hash)", 900);
  }catch(e){
    location.hash = h;
    alert("No pude copiar. Igual te dejé el hash en la URL.");
  }
});
document.getElementById("btnCopyPrompt").addEventListener("click", async ()=>{
  try{
    await navigator.clipboard.writeText(MASTER_PROMPT);
    ui.btnCopyPrompt.textContent="Copiado ✓";
    setTimeout(()=>ui.btnCopyPrompt.textContent="Copiar prompt", 900);
  }catch(e){
    alert("No pude copiar. Seleccioná el texto y copiá manual.");
  }
});
document.getElementById("btnDownloadPrompt").addEventListener("click", ()=>{
  const blob=new Blob([MASTER_PROMPT], {type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="PROMPT_DQRI_FRIF.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

ui.btnQuality.addEventListener("click", ()=>{
  const order=["auto","high","med","low"];
  const cur=perf.scaler.mode;
  const nxt=order[(order.indexOf(cur)+1)%order.length];
  perf.scaler.setMode(nxt);
  ui.btnQuality.textContent = "Calidad: " + (nxt==="auto"?"Auto":nxt==="high"?"Alta":nxt==="med"?"Media":"Baja");
});

ui.btnExport.addEventListener("click", ()=>{
  // export currently hovered panel or default field panel
  const pick = lastPanelHover || document.getElementById("panelField");
  const cv = pick.querySelector("canvas");
  if(!cv){alert("No encontré canvas."); return;}
  const link=document.createElement("a");
  link.download = `dqri_export_${pick.id}.png`;
  link.href = cv.toDataURL("image/png");
  link.click();
});

let lastPanelHover=null;
for(const id of ["panelNet","panelAtt","panelChart","panelFlow","panelField"]){
  const p=document.getElementById(id);
  p.addEventListener("mouseenter", ()=> lastPanelHover=p);
  p.addEventListener("mouseleave", ()=> { if(lastPanelHover===p) lastPanelHover=null; });
}

/* -------------------------
   Initialize from hash
-------------------------- */
const fromHash=hashDecode();
if(Object.keys(fromHash).length){
  s.importParams(fromHash);
}

/* -------------------------
   Instantiate models/renderers
-------------------------- */
let net = new NetworkModel(9);
let att = new AttractorModel();
let frifEst = new FRIFEstimator();
let field = new QuantumFieldModel();
let darwin = new DarwinModule();

const rNet = new NetworkRenderer(document.getElementById("cNet"), perf.scaler);
const rAtt = new AttractorRenderer(document.getElementById("cAtt"), perf.scaler);
const rChart = new ChartRenderer(document.getElementById("cChart"), perf.scaler);
const rFlow = new FlowRenderer(document.getElementById("cFlow"), perf.scaler);
const rField = new QuantumFieldRenderer(document.getElementById("cField"), perf.scaler);
perf.renderers.push(rNet,rAtt,rChart,rFlow,rField);

syncUIFromState();

/* -------------------------
   Simulation + render loop
-------------------------- */
function simStep(dt){
  // dt scaling to keep stable
  const step = dt*1.2;

  net.step(s, step);
  att.step(s, step);
  frifEst.step(s, att);
  field.step(s, step);

  // Darwin fitness: high FRIF, low sigmaDot, stable (low variance proxy)
  const stability = clamp(1/(0.6 + s.sig + 0.5*s.T + 0.4*s.gam), 0, 2);
  const fitness = (s.frif*0.9 + stability*0.35) - 0.35*s.sigmaDot;
  darwin.step(s, fitness);

  updateOutputs();

  // update hash lightly (optional): keep off by default to avoid spam
}

function renderStep(reduceMotion){
  rNet.draw(s, net);
  rAtt.draw(s, att, reduceMotion);
  rChart.draw(s);
  rFlow.draw(s);
  rField.draw(s, field, reduceMotion);
}

const engine = new Engine();
engine.tick();

/* -------------------------
   Keyboard helpers
-------------------------- */
document.addEventListener("keydown",(e)=>{
  if(e.key===" "){
    e.preventDefault();
    ui.btnPause.click();
  }
  if(e.key.toLowerCase()==="r"){
    ui.btnReset.click();
  }
});

/* -------------------------
   QA checklist (manual)
-------------------------- */
/*
QA CHECKLIST
[ ] Abre offline sin errores en consola.
[ ] 5 paneles se animan y responden a sliders.
[ ] Presets cambian comportamiento (sub/near/super).
[ ] L↔D invierte handedness visible del campo.
[ ] |P| y ∠P cambian eje de polaridad y advección.
[ ] Darwin activa cambios graduales (sin romper termodinámica).
[ ] Copiar link genera hash; al recargar restaura estado.
[ ] Export PNG descarga captura del panel.
[ ] Reducir movimiento baja carga visual.
[ ] Calidad (Auto/Alta/Media/Baja) ajusta resolución.
[ ] Contraste y foco visibles (teclado).
*/
</script>
</body>
</html>
