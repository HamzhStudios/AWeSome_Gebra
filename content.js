(() => {
  "use strict";

  if (window.__AWESOME_GEBRA__) { window.__AWESOME_GEBRA__.toggle(); return; }

  const CM_PX = 96 / 2.54;
  const RULER_H = 76;
  const SNAP_DIST = 30;
  const GOLD = "#D4AF37";
  const POLAR_STEP = 15;
  const PALM_MS = 900;
  const DEG = Math.PI / 180;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const norm180 = (a) => ((a + 180) % 360 + 360) % 360 - 180;

  const THEMES = {
    cherry: {
      ink: "#35101E", paper: "#FCF6F8", surface: "#FFFFFF",
      accent: "#C02E58", accent2: "#E8628C",
      rule: "#EFD9E1", mute: "#8B6373", onAccent: "#FFFFFF",
      shadow: "rgba(53,16,30,.22)", knobShadow: "rgba(53,16,30,.35)",
      rulerBg: "linear-gradient(180deg, rgba(255,255,255,.84) 0%, rgba(252,246,248,.66) 58%, rgba(245,219,228,.60) 100%)",
      rulerBorder: "rgba(192,46,88,.38)", knobRing: "rgba(255,255,255,.95)",
      tick: "#35101E", tickSoft: "rgba(53,16,30,.55)",
      face: "rgba(255,255,255,.62)", faceLine: "rgba(192,46,88,.55)",
      stamp: "rgba(192,46,88,.75)", exportBg: "#FFFFFF"
    },
    light: {
      ink: "#132537", paper: "#F6F7F9", surface: "#FFFFFF",
      accent: "#2A5F91", accent2: "#5E93C7",
      rule: "#D7DDE5", mute: "#69788B", onAccent: "#FFFFFF",
      shadow: "rgba(19,37,55,.22)", knobShadow: "rgba(19,37,55,.35)",
      rulerBg: "linear-gradient(180deg, rgba(255,255,255,.84) 0%, rgba(246,247,249,.64) 58%, rgba(226,232,240,.60) 100%)",
      rulerBorder: "rgba(42,95,145,.38)", knobRing: "rgba(255,255,255,.95)",
      tick: "#132537", tickSoft: "rgba(19,37,55,.55)",
      face: "rgba(255,255,255,.62)", faceLine: "rgba(42,95,145,.55)",
      stamp: "rgba(42,95,145,.75)", exportBg: "#FFFFFF"
    },
    dark: {
      ink: "#E7ECF3", paper: "#161B22", surface: "#1E242D",
      accent: "#2F6FB3", accent2: "#5E93C7",
      rule: "#2C3541", mute: "#93A1B4", onAccent: "#FFFFFF",
      shadow: "rgba(0,0,0,.55)", knobShadow: "rgba(0,0,0,.6)",
      rulerBg: "linear-gradient(180deg, rgba(32,39,49,.88) 0%, rgba(24,30,38,.74) 58%, rgba(18,23,30,.70) 100%)",
      rulerBorder: "rgba(94,147,199,.45)", knobRing: "rgba(231,236,243,.85)",
      tick: "#E7ECF3", tickSoft: "rgba(231,236,243,.6)",
      face: "rgba(24,30,38,.80)", faceLine: "rgba(94,147,199,.55)",
      stamp: "rgba(94,147,199,.85)", exportBg: "#161B22"
    }
  };
  let T = THEMES.cherry;

  const STR = {
    en: {
      app: "AWeSome Gebra", settings: "Settings", collapse: "Collapse panel",
      expand: "Expand panel", hide: "Hide overlay", rotate: "Drag to rotate",
      armTip: "Drag to measure an angle",
      draw: "Draw", pen: "Pen", lineTool: "Line", erase: "Erase", off: "Off",
      ink: "Ink", width: "Width", inkWidth: "Ink width",
      edit: "Edit", export: "Export", show: "Show",
      note: "Note", noteTip: "Add a note you can write or type on",
      inkCustom: "Pick any colour",
      mode: "Mode", modeNormal: "Normal", modeGebra: "Gebra",
      modeHint: "Gebra adds function plotting and numbered axes.",
      angle: "Angles", angleRad: "Radians", angleDeg: "Degrees",
      angleHint: "For trigonometry in plotted functions only.",
      plot: "Plot", fxAdd: "Plot this function", fxBad: "Cannot read that",
      fxColour: "Change colour", fxShow: "Show or hide", fxDelete: "Remove",
      noteInput: "Notes", niBoth: "Both", niWrite: "Handwriting", niType: "Typing",
      noteInputHint: "Whether a note takes the pen, the keyboard, or both.",
      snap: "Snap", free: "Free", snapRuler: "Ruler", snapGrid: "Grid",
      snapFreeTip: "Nothing pulls the pen",
      snapRulerTip: "Pen pins to the nearest instrument edge",
      snapGridTip: "Pen pulls to grid nodes",
      undo: "Undo", redo: "Redo", clear: "Clear", savePng: "Save PNG",
      touch: "Touch", penOnly: "Pen only", pressure: "Pressure",
      penOnlyTip: "Fingers scroll the page, only the stylus draws",
      pressureTip: "Stylus pressure varies the line width",
      touchHint: "Two fingers scroll the page, or move and rotate the ruler.",
      grid: "Grid", gSquare: "Square", gDots: "Dots", gIso: "Isometric", gPolar: "Polar", gNone: "Hidden",
      spacing: "Spacing", gridColour: "Grid colour",
      cAccent: "Accent", cSoft: "Soft", cGrey: "Grey", cGreen: "Green",
      ruler: "Ruler", protractor: "Protractor",
      rulerAngle: "Angle", resetAngle: "Reset angle", flatTip: "Set the ruler back to horizontal", length: "Length",
      zoom: "Zoom", zoomTip: "Pixels per unit, from 10 percent to 400", zoomReset: "Back to 100 percent", resetShort: "Reset",
      folder: "Save to",
      folderHint: "Folder inside your downloads directory. Empty saves to Downloads.",
      coords: "Numbers", coordsOff: "Off", coordsOn: "On", coordStep: "Every",
      coordsHint: "Numbers the square grid from its origin, one unit per cell.",
      centerAxes: "Centre axes", centerTip: "Move the origin to the middle of the screen",
      protSize: "Protractor",
      language: "Language", theme: "Theme", panelSize: "Size",
      sheet: "Backdrop", sheetClear: "Page", sheetPaper: "Paper",
      sheetHint: "Paper covers the page with a clean sheet to draw on.",
      tCherry: "Cherry", tDark: "Dark", tLight: "Light",
      sizeHint: "Scales the panel, text and controls together.",
      reset: "Reset settings",
      u_cm: "cm", u_in: "in", u_px: "px",
      credit: "Made by Hamzh studios™"
    },
    es: {
      app: "AWeSome Gebra", settings: "Ajustes", collapse: "Plegar el panel",
      expand: "Desplegar el panel", hide: "Ocultar la capa",
      rotate: "Arrastra para girar", armTip: "Arrastra para medir un ángulo",
      draw: "Dibujo", pen: "Lápiz", lineTool: "Línea", erase: "Borrar", off: "Apagado",
      ink: "Tinta", width: "Grosor", inkWidth: "Grosor del trazo",
      edit: "Editar", export: "Exportar", show: "Mostrar",
      note: "Nota", noteTip: "Añadir una nota para escribir a mano o con el teclado",
      inkCustom: "Elige cualquier color",
      mode: "Modo", modeNormal: "Normal", modeGebra: "Gebra",
      modeHint: "Gebra añade el trazado de funciones y los ejes numerados.",
      angle: "Ángulos", angleRad: "Radianes", angleDeg: "Grados",
      angleHint: "Solo para la trigonometría de las funciones dibujadas.",
      plot: "Función", fxAdd: "Dibujar esta función", fxBad: "No se puede leer",
      fxColour: "Cambiar color", fxShow: "Mostrar u ocultar", fxDelete: "Quitar",
      noteInput: "Notas", niBoth: "Ambos", niWrite: "A mano", niType: "Teclado",
      noteInputHint: "Si la nota acepta el lápiz, el teclado o ambos.",
      snap: "Ajuste", free: "Libre", snapRuler: "Regla", snapGrid: "Cuadrícula",
      snapFreeTip: "Nada tira del lápiz",
      snapRulerTip: "El lápiz se fija al borde del instrumento más cercano",
      snapGridTip: "El lápiz se fija a los nodos de la cuadrícula",
      undo: "Deshacer", redo: "Rehacer", clear: "Limpiar", savePng: "Guardar PNG",
      touch: "Táctil", penOnly: "Solo lápiz", pressure: "Presión",
      penOnlyTip: "Los dedos desplazan la página y solo el lápiz dibuja",
      pressureTip: "La presión del lápiz cambia el grosor del trazo",
      touchHint: "Dos dedos desplazan la página, o mueven y giran la regla.",
      grid: "Cuadrícula", gSquare: "Cuadros", gDots: "Puntos", gIso: "Isométrica", gPolar: "Polar", gNone: "Oculta",
      spacing: "Separación", gridColour: "Color de la cuadrícula",
      cAccent: "Principal", cSoft: "Suave", cGrey: "Gris", cGreen: "Verde",
      ruler: "Regla", protractor: "Transportador",
      rulerAngle: "Ángulo", resetAngle: "Reiniciar ángulo", flatTip: "Devolver la regla a la horizontal", length: "Longitud",
      zoom: "Zoom", zoomTip: "Píxeles por unidad, del 10 por ciento al 400", zoomReset: "Volver al 100 por ciento", resetShort: "Reiniciar",
      folder: "Guardar en",
      folderHint: "Carpeta dentro de tus descargas. Vacía guarda en Descargas.",
      coords: "Números", coordsOff: "No", coordsOn: "Sí", coordStep: "Cada",
      coordsHint: "Numera la cuadrícula desde su origen, una unidad por casilla.",
      centerAxes: "Centrar ejes", centerTip: "Llevar el origen al centro de la pantalla",
      protSize: "Transportador",
      language: "Idioma", theme: "Tema", panelSize: "Tamaño",
      sheet: "Fondo", sheetClear: "Página", sheetPaper: "Papel",
      sheetHint: "Papel cubre la página con una hoja limpia para dibujar.",
      tCherry: "Cereza", tDark: "Oscuro", tLight: "Claro",
      sizeHint: "Escala el panel, el texto y los controles a la vez.",
      reset: "Restablecer ajustes",
      u_cm: "cm", u_in: "pulg", u_px: "px",
      credit: "Hecho por Hamzh studios™"
    },
    ar: {
      app: "AWeSome Gebra", settings: "الإعدادات", collapse: "طيّ اللوحة",
      expand: "فتح اللوحة", hide: "إخفاء الأدوات", rotate: "اسحب للتدوير",
      armTip: "اسحب لقياس الزاوية",
      draw: "الرسم", pen: "قلم", lineTool: "خط", erase: "ممحاة", off: "إيقاف",
      ink: "الحبر", width: "السماكة", inkWidth: "سماكة القلم",
      edit: "تحرير", export: "تصدير", show: "إظهار",
      note: "ملاحظة", noteTip: "إضافة ملاحظة يمكنك الكتابة عليها بالقلم أو لوحة المفاتيح",
      inkCustom: "اختر أي لون",
      mode: "الوضع", modeNormal: "عادي", modeGebra: "هندسي",
      modeHint: "الوضع الهندسي يضيف رسم الدوال وترقيم المحاور.",
      angle: "الزوايا", angleRad: "راديان", angleDeg: "درجات",
      angleHint: "للدوال المثلثية داخل الدوال المرسومة فقط.",
      plot: "الدالة", fxAdd: "ارسم هذه الدالة", fxBad: "تعذّرت قراءة الدالة",
      fxColour: "تغيير اللون", fxShow: "إظهار أو إخفاء", fxDelete: "حذف",
      noteInput: "الملاحظات", niBoth: "الاثنان", niWrite: "بخط اليد", niType: "بلوحة المفاتيح",
      noteInputHint: "هل تقبل الملاحظة القلم أم لوحة المفاتيح أم الاثنين.",
      snap: "الالتصاق", free: "حر", snapRuler: "المسطرة", snapGrid: "الشبكة",
      snapFreeTip: "لا شيء يجذب القلم",
      snapRulerTip: "يلتصق القلم بأقرب حافة أداة",
      snapGridTip: "ينجذب القلم إلى تقاطعات الشبكة",
      undo: "تراجع", redo: "إعادة", clear: "مسح", savePng: "حفظ PNG",
      touch: "اللمس", penOnly: "القلم فقط", pressure: "الضغط",
      penOnlyTip: "الأصابع تمرر الصفحة، والقلم وحده يرسم",
      pressureTip: "ضغط القلم يغيّر سماكة الخط",
      touchHint: "إصبعان يمرران الصفحة أو يحركان المسطرة ويديرانها.",
      grid: "الشبكة", gSquare: "مربعات", gDots: "نقاط", gIso: "متساوية القياس", gPolar: "قطبية", gNone: "مخفية",
      spacing: "التباعد", gridColour: "لون الشبكة",
      cAccent: "أساسي", cSoft: "فاتح", cGrey: "رمادي", cGreen: "أخضر",
      ruler: "المسطرة", protractor: "المنقلة",
      rulerAngle: "الزاوية", resetAngle: "إعادة الزاوية", flatTip: "إرجاع المسطرة إلى الوضع الأفقي", length: "الطول",
      zoom: "التكبير", zoomTip: "عدد البكسلات لكل وحدة، من 10 بالمئة إلى 400", zoomReset: "العودة إلى 100 بالمئة", resetShort: "إعادة",
      folder: "الحفظ في",
      folderHint: "مجلد داخل التنزيلات، واتركه فارغًا للحفظ في التنزيلات.",
      coords: "الأرقام", coordsOff: "إيقاف", coordsOn: "تشغيل", coordStep: "كل",
      coordsHint: "ترقيم الشبكة المربعة من نقطة الأصل، وحدة لكل مربع.",
      centerAxes: "توسيط المحاور", centerTip: "نقل نقطة الأصل إلى منتصف الشاشة",
      protSize: "المنقلة",
      language: "اللغة", theme: "المظهر", panelSize: "الحجم",
      sheet: "الخلفية", sheetClear: "الصفحة", sheetPaper: "ورقة",
      sheetHint: "الورقة تغطي الصفحة بسطح نظيف للرسم عليه.",
      tCherry: "كرزي", tDark: "داكن", tLight: "فاتح",
      sizeHint: "يكبّر اللوحة بنصوصها وأزرارها معًا.",
      reset: "إعادة ضبط الإعدادات",
      u_cm: "سم", u_in: "بوصة", u_px: "بكسل",
      credit: "من صنع Hamzh studios™"
    }
  };
  const t = (k) => (STR[settings.lang] && STR[settings.lang][k]) || STR.en[k] || k;

  const DEFAULTS = {
    zoom: 1,
    unit: "cm",
    gridType: "square",
    gridSpacing: 1,
    gridColor: "#C02E58",
    showGrid: true,
    snapMode: "free",
    showRuler: true,
    showProtractor: false,
    rulerLength: 520,
    tool: "pen",
    inkColor: "#1A1A1A",
    customInk: "#7A4BAF",
    inkWidth: 2,
    penOnly: false,
    pressure: true,
    mode: "normal",
    angleUnit: "rad",
    noteInput: "both",
    folder: "AWeSome extractions",
    coords: false,
    coordStep: 1,
    protRadius: 156,
    sheet: "clear",
    uiScale: 1,
    theme: "cherry",
    lang: "en"
  };

  const settings = Object.assign({}, DEFAULTS);

  const ruler = { x: 120, y: 260, angle: 0 };
  const protractor = { x: 420, y: 400, angle: 0, arm: 45 };
  let origin = null;

  const sheets = {};
  const sheetFor = (g) => (sheets[g] = sheets[g] || { strokes: [], notes: [], undone: [], plots: [] });
  let strokes = [];
  let notes = [];
  let plots = [];
  let undone = [];
  let current = null;
  let visible = false;

  const host = document.createElement("div");
  host.id = "__awesome_gebra_host__";
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none;";
  const root = host.attachShadow({ mode: "open" });

  root.innerHTML = `
<style>
  :host, * { box-sizing: border-box; }
  :host {
    --ui: 1;
    --fit: 1;
  }
  [hidden] { display: none !important; }
  .layer { position: fixed; inset: 0; pointer-events: none; }
  canvas.layer { width: 100%; height: 100%; }
  #ink.on {
    pointer-events: auto; cursor: crosshair;
    touch-action: none; overscroll-behavior: contain;
  }

  #notes { pointer-events: none; }
  #notes.off { display: none; }

  .note {
    position: absolute; pointer-events: none;
    font: 13px/1.45 "Inter", "Segoe UI", "Noto Sans Arabic", Tahoma, system-ui, sans-serif;
  }
  .note .bar {
    position: absolute; inset-inline: 0; top: 0; height: 20px;
    display: flex; align-items: center; pointer-events: auto;
    background: var(--accent); border-radius: 5px 5px 0 0;
    touch-action: none;
  }
  .note .grip { flex: 1; height: 100%; cursor: grab; }
  .note .grip.dragging { cursor: grabbing; }
  .note .bar button {
    width: 20px; height: 18px; min-height: 0; padding: 0; flex: none;
    border: none; background: none; color: var(--on-accent);
    font: 11px/1 system-ui, sans-serif; cursor: pointer; opacity: .85;
    display: grid; place-items: center;
  }
  .note .bar button:hover { opacity: 1; background: none; }
  .note .bar button svg { width: 11px; height: 11px; }
  .note textarea {
    position: absolute; inset: 20px 0 0 0; pointer-events: auto;
    border: 1px solid var(--rule); border-top: none; border-radius: 0 0 5px 5px;
    outline: none; resize: none; padding: 6px 8px;
    background: var(--surface); color: var(--ink); font: inherit;
    touch-action: pan-y;
  }
  .note:not(.editing) textarea { display: none; }
  .note .size {
    position: absolute; inset-inline-end: 0; bottom: 0;
    width: 16px; height: 16px; cursor: nwse-resize; touch-action: none;
    pointer-events: auto;
    background: linear-gradient(135deg, transparent 50%, var(--rule) 50%);
  }

  #ruler {
    position: fixed; left: 0; top: 0; height: ${RULER_H}px;
    transform-origin: 0 0; pointer-events: auto; cursor: grab;
    touch-action: none; user-select: none; -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    background: var(--ruler-bg);
    border: 1px solid var(--ruler-border);
    border-top: 2px solid var(--accent);
    border-radius: 0 0 3px 3px;
    box-shadow: 0 8px 20px var(--shadow);
    backdrop-filter: saturate(1.05) blur(.4px);
  }
  #ruler.dragging { cursor: grabbing; }
  #ruler svg { display: block; pointer-events: none; }

  .knob {
    position: absolute; left: 100%; top: 50%;
    width: 26px; height: 26px; margin-left: 12px;
    transform: translate(0,-50%);
    border-radius: 50%; cursor: alias; touch-action: none;
    background: var(--accent);
    border: 2px solid var(--knob-ring);
    box-shadow: 0 2px 8px var(--knob-shadow);
  }
  .knob::before { content: ""; position: absolute; inset: -14px; border-radius: 50%; }
  .knob::after {
    content: ""; position: absolute; left: -12px; top: 50%;
    width: 12px; height: 2px; background: var(--ruler-border);
  }

  #protractor {
    position: fixed; left: 0; top: 0; pointer-events: auto; cursor: grab;
    touch-action: none; user-select: none; -webkit-user-select: none;
  }
  #protractor svg { display: block; pointer-events: none; }
  #protractor .knob { left: 0; top: 0; margin: 0; transform: translate(-50%,-50%); }
  #protractor .arm {
    position: absolute; height: 0; transform-origin: 0 50%;
    border-top: 2px solid var(--accent); pointer-events: none;
  }
  #protractor .arm .tip {
    position: absolute; right: calc(-9px); top: -9px; width: 18px; height: 18px;
    border-radius: 50%; background: var(--accent); border: 2px solid var(--knob-ring);
    box-shadow: 0 1px 5px var(--knob-shadow);
    pointer-events: auto; touch-action: none; cursor: alias;
  }
  #protractor .arm .tip::before { content: ""; position: absolute; inset: -13px; border-radius: 50%; }
  #protractor .deg {
    position: absolute; padding: 2px 6px; border-radius: 4px;
    background: var(--accent); color: var(--on-accent);
    font: 600 11px/1.2 ui-monospace, Menlo, monospace;
    pointer-events: none; white-space: nowrap;
  }

  #panel {
    --s: calc(var(--ui) * var(--fit));
    --h: calc(30px * var(--s));
    --fs: calc(13px * var(--s));
    --fs-s: calc(12px * var(--s));
    --fs-xs: calc(11px * var(--s));
    --pad: calc(10px * var(--s));
    --gap: calc(7px * var(--s));
    --label: calc(58px * var(--s));
    --radius: calc(5px * var(--s));

    position: fixed; top: 16px; right: 16px;
    width: calc(286px * var(--ui));
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 24px);
    max-height: calc(100dvh - 24px);
    display: flex; flex-direction: column;
    pointer-events: auto; touch-action: none;
    font: var(--fs)/1.45 "Inter", "Segoe UI", "Noto Sans Arabic", Tahoma, system-ui, sans-serif;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--rule);
    border-radius: calc(8px * var(--s));
    box-shadow: 0 18px 44px var(--shadow);
    overflow: hidden;
    user-select: none; -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  #panel header {
    display: flex; align-items: center; gap: calc(var(--gap) - 1px);
    padding: calc(var(--pad) * .85) var(--pad); cursor: grab; flex: none;
    background: var(--surface); border-bottom: 1px solid var(--rule);
  }
  #panel header.dragging { cursor: grabbing; }
  #panel header strong {
    font-weight: 600; font-size: calc(13.5px * var(--s)); flex: 1;
    letter-spacing: .1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .body {
    padding: var(--pad); display: grid; gap: var(--gap);
    grid-template-columns: minmax(0, 1fr);
    align-content: start; overflow-x: hidden;
    flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
    touch-action: pan-y;
  }
  #panel.cfg .main { display: none; }
  #panel .settings { display: none; }
  #panel.cfg .settings { display: grid; }
  #panel.folded .body, #panel.folded .credit { display: none; }

  .row { display: flex; align-items: center; flex-wrap: wrap; gap: calc(var(--gap) - 1px); }
  .row > label {
    flex: 0 0 var(--label); font-size: var(--fs-s); color: var(--mute);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .grp { display: flex; flex-wrap: wrap; gap: calc(var(--gap) - 1px); flex: 1 1 calc(130px * var(--s)); min-width: 0; }
  .grp > button { flex: 1 1 calc(78px * var(--s)); min-width: 0; }
  .seg { display: flex; flex: 1 1 calc(130px * var(--s)); min-width: 0; }

  button, select, input[type=number], input[type=range] {
    font: inherit; height: var(--h); min-height: var(--h);
  }
  button, select, input[type=number] {
    background: var(--surface); color: var(--ink);
    border: 1px solid var(--rule); border-radius: var(--radius);
    padding: 0 calc(6px * var(--s)); cursor: pointer;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-size: var(--fs-s);
  }
  select {
    padding-inline: calc(7px * var(--s)) calc(20px * var(--s));
    appearance: none; -webkit-appearance: none;
    background-image: var(--caret);
    background-repeat: no-repeat;
    background-position: right calc(6px * var(--s)) center;
    background-size: calc(9px * var(--s));
  }
  #panel[dir="rtl"] select { background-position: left calc(6px * var(--s)) center; }
  select option { background: var(--surface); color: var(--ink); }

  .dd { position: relative; flex: 1 1 calc(130px * var(--s)); min-width: 0; }
  .dd.narrow { flex: 0 1 calc(78px * var(--s)); }
  .ddbtn {
    width: 100%; height: var(--h); display: flex; align-items: center; gap: calc(7px * var(--s));
    padding-inline: calc(7px * var(--s)) calc(20px * var(--s));
    background-image: var(--caret); background-repeat: no-repeat;
    background-position: right calc(6px * var(--s)) center;
    background-size: calc(9px * var(--s));
  }
  #panel[dir="rtl"] .ddbtn { background-position: left calc(6px * var(--s)) center; }
  .ddlist {
    position: fixed; z-index: 2147483647;
    display: grid; padding: calc(3px * var(--s));
    background: var(--surface); border: 1px solid var(--rule);
    border-radius: var(--radius); box-shadow: 0 10px 26px var(--shadow);
  }
  .ddlist button {
    display: flex; height: var(--h); align-items: center; gap: calc(7px * var(--s));
    border: none; background: none; width: 100%; text-align: start;
  }
  .ddlist button:hover { background: var(--paper); }
  .ddlist button.on { background: var(--accent); color: var(--on-accent); }
  .flag {
    width: calc(19px * var(--s)); height: calc(12px * var(--s)); flex: none;
    border-radius: 1px; box-shadow: 0 0 0 1px var(--rule); display: block;
  }
  button:hover, select:hover { border-color: var(--accent); }
  button:focus-visible, select:focus-visible, input:focus-visible {
    outline: 2px solid var(--accent); outline-offset: 1px;
  }
  button.on { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }

  header button {
    border: none; background: none; color: var(--mute);
    height: calc(26px * var(--s)); min-height: 0; flex: none;
    width: calc(26px * var(--s)); padding: 0;
    display: grid; place-items: center;
  }
  header button svg { width: calc(15px * var(--s)); height: calc(15px * var(--s)); display: block; }
  header button:hover, header button.on { color: var(--accent); background: none; }
  #fold svg { transition: transform .15s ease; }
  #panel.folded #fold svg { transform: rotate(-90deg); }
  #panel[dir="rtl"].folded #fold svg { transform: rotate(90deg); }

  .seg button { border-radius: 0; flex: 1; min-width: 0; padding: 0 calc(3px * var(--s)); }
  .seg button:first-child { border-start-start-radius: var(--radius); border-end-start-radius: var(--radius); }
  .seg button:last-child { border-start-end-radius: var(--radius); border-end-end-radius: var(--radius); }
  .seg button + button { border-inline-start: none; }

  input[type=range] { flex: 1; min-width: 0; accent-color: var(--accent); padding: 0; cursor: pointer; }
  input[type=number] { flex: 1 1 calc(60px * var(--s)); min-width: 0; cursor: text; text-align: center; }
  input[type=text] {
    flex: 1 1 calc(120px * var(--s)); min-width: 0; height: var(--h); cursor: text;
    font: inherit; font-size: var(--fs-s); padding: 0 calc(7px * var(--s));
    background: var(--surface); color: var(--ink);
    border: 1px solid var(--rule); border-radius: var(--radius);
  }
  input[type=text]:hover { border-color: var(--accent); }
  select.fixed { flex: 0 1 calc(64px * var(--s)); }
  button.fixed { flex: 0 1 calc(74px * var(--s)); }
  button.act { flex: 0 1 calc(94px * var(--s)); }

  #panel:not(.gebra) .gebraonly { display: none !important; }
  #fxlist { display: grid; gap: calc(4px * var(--s)); }
  .fxrow {
    display: flex; align-items: center; gap: calc(var(--gap) - 1px);
    padding: calc(3px * var(--s)) calc(5px * var(--s));
    background: var(--surface); border: 1px solid var(--rule); border-radius: var(--radius);
  }
  .fxrow.off .fxsrc { opacity: .45; text-decoration: line-through; }
  .fxsrc {
    flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font: var(--fs-s) ui-monospace, "SF Mono", Menlo, monospace;
  }
  .fxsw {
    flex: none; width: calc(16px * var(--s)); height: calc(16px * var(--s));
    min-height: 0; padding: 0; border-radius: 3px; border: 1px solid var(--rule);
  }
  .fxrow .fxeye, .fxrow .fxdel {
    flex: none; width: calc(22px * var(--s)); height: calc(22px * var(--s));
    min-height: 0; padding: 0; border: none; background: none; color: var(--mute);
    display: grid; place-items: center; font-size: var(--fs-s);
  }
  .fxrow .fxeye:hover, .fxrow .fxdel:hover { color: var(--accent); background: none; }
  .fxrow .fxeye svg { width: calc(14px * var(--s)); height: calc(14px * var(--s)); }
  button.icon { flex: none; width: var(--h); padding: 0; font-size: calc(17px * var(--s)); line-height: 1; }
  #fxerr { color: var(--accent); }
  .swatches {
    flex: 1; min-width: 0; display: grid; justify-items: center;
    grid-template-columns: repeat(5, 1fr); gap: calc(6px * var(--s));
  }
  .sw {
    width: calc(21px * var(--s)); height: calc(21px * var(--s));
    min-height: 0; padding: 0; border-radius: 50%; border: 2px solid transparent;
  }
  .sw:hover { border-color: var(--rule); }
  .sw.on { border-color: var(--ink); }
  .sw.gold.on { border-color: ${GOLD}; }
  .sw.pale { box-shadow: inset 0 0 0 1px var(--rule); }
  .sw.custom { box-shadow: inset 0 0 0 1px var(--rule); }
  .inkcustom { position: relative; display: grid; place-items: center; }
  .inkpick {
    position: fixed; z-index: 2147483647; display: grid;
    gap: calc(4px * var(--s)); padding: calc(5px * var(--s));
    box-sizing: border-box; max-width: calc(100vw - 12px);
    background: var(--surface); border: 1px solid var(--rule);
    border-radius: var(--radius); box-shadow: 0 10px 26px var(--shadow);
  }
  .inkrow { display: flex; gap: calc(4px * var(--s)); }
  .inkrow input[type=color] {
    flex: none; width: calc(34px * var(--s)); height: var(--h); padding: 0;
    border: 1px solid var(--rule); border-radius: var(--radius);
    background: var(--surface); cursor: pointer;
  }
  .inkrow input[type=text] {
    flex: 1 1 auto; width: 0; min-width: 0; text-transform: uppercase; text-align: center;
    font: var(--fs-s) ui-monospace, "SF Mono", Menlo, monospace;
    padding-inline: calc(4px * var(--s));
  }

  .readout {
    font: var(--fs-s)/1.4 ui-monospace, "SF Mono", Menlo, monospace;
    font-variant-numeric: tabular-nums; color: var(--mute);
    flex: 0 0 calc(34px * var(--s)); text-align: center;
  }
  #live {
    display: flex; justify-content: space-between; align-items: center;
    height: var(--h); padding: 0 calc(8px * var(--s));
    background: var(--surface); border: 1px solid var(--rule);
    border-radius: var(--radius); color: var(--ink); direction: ltr;
    font: var(--fs-s)/1 ui-monospace, "SF Mono", Menlo, monospace;
    font-variant-numeric: tabular-nums;
  }
  hr { border: none; border-top: 1px solid var(--rule); margin: 0; }
  .hint { font-size: var(--fs-xs); line-height: 1.4; color: var(--mute); margin: 0; overflow-wrap: anywhere; }
  .credit {
    flex: none; padding: calc(var(--pad) * .8) var(--pad);
    border-top: 1px solid var(--rule); background: var(--surface);
    font-size: var(--fs-xs); color: var(--mute);
  }
  .credit b { display: block; font-weight: 600; color: var(--ink); }

  @media (prefers-reduced-motion: no-preference) {
    button, select { transition: border-color .12s ease, background .12s ease, color .12s ease; }
  }
</style>

<canvas id="grid" class="layer"></canvas>
<canvas id="ink" class="layer"></canvas>
<div id="notes" class="layer"></div>

<div id="ruler"><div class="knob" data-i18n-title="rotate"></div></div>
<div id="protractor">
  <div class="arm"><span class="tip" data-i18n-title="armTip"></span></div>
  <span class="deg">0&deg;</span>
  <div class="knob" data-i18n-title="rotate"></div>
</div>

<div id="panel" dir="ltr">
  <header id="grab">
    <strong data-i18n="app">AWeSome Gebra</strong>
    <button id="gear" data-i18n-title="settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.1 14.4a1.7 1.7 0 0 0 .35 1.87l.06.06a2 2 0 1 1-2.84 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.12a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.35l-.06.06A2 2 0 1 1 3.84 16.9l.06-.06a1.7 1.7 0 0 0 .34-1.86 1.7 1.7 0 0 0-1.55-1.04H2.5a2 2 0 1 1 0-4h.12a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.35-1.87l-.06-.06A2 2 0 1 1 6.6 3.84l.06.06a1.7 1.7 0 0 0 1.86.34h.08A1.7 1.7 0 0 0 9.6 2.68V2.5a2 2 0 1 1 4 0v.12a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.84 2.83l-.06.06a1.7 1.7 0 0 0-.35 1.87v.08a1.7 1.7 0 0 0 1.56 1.04h.18a2 2 0 1 1 0 4h-.12a1.7 1.7 0 0 0-1.51 1.04z"/></svg></button>
    <button id="fold" data-i18n-title="collapse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>
    <button id="close" data-i18n-title="hide"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  </header>

  <div class="body main">
    <div id="live"><span id="liveLen">0.00 cm</span><span id="liveAng">0&deg;</span></div>

    <div class="row">
      <label data-i18n="draw">Draw</label>
      <span class="seg">
        <button data-tool="pen" data-i18n="pen">Pen</button>
        <button data-tool="line" data-i18n="lineTool">Line</button>
        <button data-tool="erase" data-i18n="erase">Erase</button>
        <button data-tool="off" data-i18n="off">Off</button>
      </span>
    </div>
    <div class="row">
      <label data-i18n="ink">Ink</label>
      <span class="swatches" id="swatches"></span>
    </div>
    <div class="row">
      <label data-i18n="width">Width</label>
      <input id="w" type="range" min="1" max="12" step="1" data-i18n-label="inkWidth">
      <span class="readout" id="wOut">2</span>
    </div>
    <div class="row">
      <label data-i18n="snap">Snap</label>
      <span class="seg">
        <button data-snap="free" data-i18n="free" data-i18n-title="snapFreeTip">Free</button>
        <button data-snap="ruler" data-i18n="snapRuler" data-i18n-title="snapRulerTip">Ruler</button>
        <button data-snap="grid" data-i18n="snapGrid" data-i18n-title="snapGridTip">Grid</button>
      </span>
    </div>
    <div class="row">
      <label data-i18n="edit">Edit</label>
      <span class="grp">
        <button id="note" data-i18n="note" data-i18n-title="noteTip">Note</button>
        <button id="undo" data-i18n="undo">Undo</button>
        <button id="redo" data-i18n="redo">Redo</button>
        <button id="clear" data-i18n="clear">Clear</button>
      </span>
    </div>

    <hr>

    <div class="row">
      <label data-i18n="grid">Grid</label>
      <span class="dd" id="gtypedd"></span>
      <button id="gcolor" class="fixed" data-i18n-title="gridColour">Accent</button>
    </div>
    <div class="row">
      <label data-i18n="spacing">Spacing</label>
      <input id="gsize" type="number" min="0.05" step="0.05">
      <span class="dd narrow" id="unitdd"></span>
    </div>
    <div class="row">
      <label data-i18n="zoom" data-i18n-title="zoomTip">Zoom</label>
      <input id="zoom" type="range" min="0" max="100" step="1" data-i18n-label="zoom">
      <span class="readout" id="zoomOut">100%</span>
      <button id="zoom1" class="fixed" data-i18n="resetShort" data-i18n-title="zoomReset">Reset</button>
    </div>

    <hr>

    <div class="row">
      <label data-i18n="show">Show</label>
      <span class="grp">
        <button id="trule" data-i18n="ruler">Ruler</button>
        <button id="tprot" data-i18n="protractor">Protractor</button>
      </span>
    </div>
    <div class="row">
      <label data-i18n="rulerAngle">Angle</label>
      <input id="angle" type="number" min="-180" max="180" step="1">
      <button id="flat" class="act" data-i18n="resetAngle" data-i18n-title="flatTip">Reset angle</button>
    </div>
    <div class="row">
      <label data-i18n="length">Length</label>
      <input id="rlen" type="range" min="160" max="1400" step="10" data-i18n-label="length">
    </div>

    <hr class="gebraonly">

    <div class="row gebraonly">
      <label data-i18n="plot">Plot</label>
      <input id="fx" type="text" spellcheck="false" placeholder="y = x^2">
      <button id="fxadd" class="icon" data-i18n-title="fxAdd">+</button>
    </div>
    <div id="fxlist" class="gebraonly" hidden></div>
    <p class="hint gebraonly" id="fxerr" hidden></p>

    <hr>

    <div class="row">
      <label data-i18n="export">Export</label>
      <span class="grp"><button id="save" data-i18n="savePng">Save PNG</button></span>
    </div>
  </div>

  <div class="body settings">
    <div class="row">
      <label data-i18n="mode" data-i18n-title="modeHint">Mode</label>
      <span class="seg">
        <button data-mode="normal" data-i18n="modeNormal">Normal</button>
        <button data-mode="gebra" data-i18n="modeGebra">Gebra</button>
      </span>
    </div>
    <div class="row gebraonly">
      <label data-i18n="angle" data-i18n-title="angleHint">Angles</label>
      <span class="seg">
        <button data-ang="rad" data-i18n="angleRad">Radians</button>
        <button data-ang="deg" data-i18n="angleDeg">Degrees</button>
      </span>
    </div>

    <hr>

    <div class="row">
      <label data-i18n="language">Language</label>
      <span class="dd" id="langdd"></span>
    </div>
    <div class="row">
      <label data-i18n="theme">Theme</label>
      <span class="seg">
        <button data-theme="cherry" data-i18n="tCherry">Cherry</button>
        <button data-theme="dark" data-i18n="tDark">Dark</button>
        <button data-theme="light" data-i18n="tLight">Light</button>
      </span>
    </div>
    <div class="row">
      <label data-i18n="panelSize" data-i18n-title="sizeHint">Size</label>
      <input id="uiscale" type="range" min="90" max="180" step="5" data-i18n-label="panelSize">
      <span class="readout" id="uiOut">100%</span>
    </div>
    <div class="row">
      <label data-i18n="sheet" data-i18n-title="sheetHint">Backdrop</label>
      <span class="seg">
        <button data-sheet="clear" data-i18n="sheetClear">Page</button>
        <button data-sheet="paper" data-i18n="sheetPaper">Paper</button>
      </span>
    </div>

    <hr>

    <div class="row">
      <label data-i18n="coords" data-i18n-title="coordsHint">Numbers</label>
      <span class="seg">
        <button data-coords="off" data-i18n="coordsOff">Off</button>
        <button data-coords="on" data-i18n="coordsOn">On</button>
      </span>
    </div>
    <div class="row">
      <label data-i18n="coordStep">Every</label>
      <input id="cstep" type="number" min="1" max="20" step="1">
      <button id="center" class="act" data-i18n="centerAxes" data-i18n-title="centerTip">Centre axes</button>
    </div>

    <hr>

    <div class="row">
      <label data-i18n="touch" data-i18n-title="touchHint">Touch</label>
      <span class="grp">
        <button id="penonly" data-i18n="penOnly" data-i18n-title="penOnlyTip">Pen only</button>
        <button id="pressure" data-i18n="pressure" data-i18n-title="pressureTip">Pressure</button>
      </span>
    </div>
    <div class="row">
      <label data-i18n="noteInput" data-i18n-title="noteInputHint">Notes</label>
      <span class="seg">
        <button data-ni="both" data-i18n="niBoth">Both</button>
        <button data-ni="write" data-i18n="niWrite">Handwriting</button>
        <button data-ni="type" data-i18n="niType">Typing</button>
      </span>
    </div>
    <div class="row">
      <label data-i18n="protSize">Protractor</label>
      <input id="psize" type="range" min="90" max="300" step="10" data-i18n-label="protSize">
    </div>

    <hr>

    <div class="row">
      <label data-i18n="folder" data-i18n-title="folderHint">Save to</label>
      <input id="folder" type="text" spellcheck="false">
    </div>
    <div class="row">
      <label></label>
      <span class="grp"><button id="reset" data-i18n="reset">Reset settings</button></span>
    </div>
  </div>

  <div class="credit">
    <b data-i18n="credit">Made by Hamzh studios&trade;</b>
    contact@hamzhstudios.com
  </div>
</div>`;

  const FLAGS = {
    en: (id) => `<svg viewBox="0 0 60 36" class="flag" aria-hidden="true">
      <clipPath id="uj${id}"><path d="M30 18 H60 V36 z V36 H0 z H0 V0 z V0 H60 z"/></clipPath>
      <rect width="60" height="36" fill="#012169"/>
      <path d="M0 0 L60 36 M60 0 L0 36" stroke="#fff" stroke-width="7.2"/>
      <path d="M0 0 L60 36 M60 0 L0 36" clip-path="url(#uj${id})" stroke="#C8102E" stroke-width="4.8"/>
      <path d="M30 0 V36 M0 18 H60" stroke="#fff" stroke-width="12"/>
      <path d="M30 0 V36 M0 18 H60" stroke="#C8102E" stroke-width="7.2"/>
    </svg>`,
    ar: () => `<svg viewBox="0 0 60 36" class="flag" aria-hidden="true">
      <rect width="60" height="36" fill="#046A38"/>
      <path d="M9 15 q4.5 -5 9 0 q4.5 5 9 0 q4.5 -5 9 0 q4.5 5 9 0"
            fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M11 25 H45" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M45 25 l5 -2.6 v5.2 z" fill="#fff"/>
      <path d="M11 25 v-3.4" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
    es: () => `<svg viewBox="0 0 60 36" class="flag" aria-hidden="true">
      <rect width="60" height="36" fill="#AA151B"/>
      <rect y="9" width="60" height="18" fill="#F1BF00"/>
    </svg>`
  };
  const LANGS = [["en", "English"], ["ar", "العربية"], ["es", "Español"]];

  const $ = (s) => root.querySelector(s);
  const DDS = [];
  function placePopover(anchor, pop, matchWidth, fixedWidth) {
    pop.hidden = false;
    pop.style.visibility = "hidden";
    pop.style.left = "0px";
    pop.style.top = "0px";
    const a = anchor.getBoundingClientRect();
    if (matchWidth) pop.style.width = a.width + "px";
    else if (fixedWidth) pop.style.width = Math.round(fixedWidth * settings.uiScale * fit) + "px";
    const w = pop.offsetWidth || a.width;
    const h = pop.offsetHeight || 0;
    let left = matchWidth ? a.left : a.left + a.width / 2 - w / 2;
    left = clamp(left, 6, Math.max(6, innerWidth - w - 6));
    let top = a.bottom + 4;
    if (top + h > innerHeight - 6) top = Math.max(6, a.top - h - 4);
    pop.style.left = Math.round(left) + "px";
    pop.style.top = Math.round(top) + "px";
    pop.style.visibility = "";
  }
  const closeDDs = () => DDS.forEach((d) => {
    d.list.hidden = true;
    d.btn.setAttribute("aria-expanded", "false");
  });
  const refreshDDs = () => DDS.forEach((d) => d.render());
  const gridCv = $("#grid"), inkCv = $("#ink");
  const gctx = gridCv.getContext("2d"), ictx = inkCv.getContext("2d");
  const rulerEl = $("#ruler"), rulerKnob = rulerEl.querySelector(".knob");
  const protEl = $("#protractor"), protKnob = protEl.querySelector(".knob");
  const panel = $("#panel");

  const caretUrl = (colour) =>
    `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8"><path d="M1 1.5 L6 6.5 L11 1.5" fill="none" stroke="${colour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`)}")`;

  function applyTheme(key) {
    const prev = T;
    T = THEMES[key] || THEMES.cherry;
    settings.theme = THEMES[key] ? key : "cherry";
    if (prev && prev !== T) {
      if (settings.gridColor === prev.accent) settings.gridColor = T.accent;
      else if (settings.gridColor === prev.accent2) settings.gridColor = T.accent2;
    }
    const vars = {
      "--ink": T.ink, "--paper": T.paper, "--surface": T.surface,
      "--accent": T.accent, "--accent2": T.accent2, "--rule": T.rule,
      "--mute": T.mute, "--on-accent": T.onAccent, "--shadow": T.shadow,
      "--knob-shadow": T.knobShadow, "--knob-ring": T.knobRing,
      "--ruler-bg": T.rulerBg, "--ruler-border": T.rulerBorder,
      "--caret": caretUrl(T.mute)
    };
    for (const k in vars) host.style.setProperty(k, vars[k]);
    panel.style.colorScheme = settings.theme === "dark" ? "dark" : "light";
  }

  function applyLang() {
    panel.setAttribute("dir", settings.lang === "ar" ? "rtl" : "ltr");
    panel.setAttribute("lang", settings.lang);
    root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    root.querySelectorAll("[data-i18n-label]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nLabel)));
    refreshDDs();
  }

  let fit = 1;

  function applyMode() {
    panel.classList.toggle("gebra", settings.mode === "gebra");
  }

  function applyScale() {
    host.style.setProperty("--ui", String(settings.uiScale));
    fitPanel();
  }

  function fitPanel() {
    if (!visible) return;
    const want = 286 * settings.uiScale;
    const have = panel.getBoundingClientRect().width || want;
    fit = clamp(have / want, 0.55, 1);
    host.style.setProperty("--fit", fit.toFixed(3));
  }

  function repaint() {
    for (const n of notes) n.dirty = true;
    layoutRuler();
    buildProtractor();
    drawGrid();
    syncUI();
    fitPanel();
  }

  const unitPx = () =>
    settings.unit === "px" ? 1
      : settings.unit === "in" ? 96 * settings.zoom
      : CM_PX * settings.zoom;

  const gridStep = () => unitPx() * settings.gridSpacing;

  const ZOOM_MIN = 0.1, ZOOM_MAX = 4, ZOOM_SPAN = Math.log(ZOOM_MAX / ZOOM_MIN);
  const sliderToZoom = (v) => ZOOM_MIN * Math.exp(ZOOM_SPAN * clamp(v, 0, 100) / 100);
  const zoomToSlider = (z) => clamp(100 * Math.log(z / ZOOM_MIN) / ZOOM_SPAN, 0, 100);

  const STRIDES = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
  function pickEvery(step, want, minPx) {
    const base = Math.max(1, want);
    for (const f of STRIDES) if (base * f * step >= minPx) return base * f;
    return base * STRIDES[STRIDES.length - 1];
  }
  function pickSubs(step, ladder, minPx) {
    for (const n of ladder) if (step / n >= minPx) return n;
    return 1;
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    for (const c of [gridCv, inkCv]) {
      c.width = Math.round(innerWidth * dpr);
      c.height = Math.round(innerHeight * dpr);
    }
    sizeBase();
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGrid();
    drawInk();
  }

  function originPoint() {
    if (!origin) origin = { x: scrollX + innerWidth / 2, y: scrollY + innerHeight / 2 };
    return origin;
  }

  function drawGrid() {
    gctx.clearRect(0, 0, innerWidth, innerHeight);
    if (settings.tool === "off") return;
    if (settings.sheet === "paper") {
      gctx.fillStyle = T.exportBg;
      gctx.fillRect(0, 0, innerWidth, innerHeight);
    }
    if (!settings.showGrid || settings.gridType === "none") {
      drawPlots(gctx); paintNotes(gctx); return;
    }
    const s = gridStep();
    if (s < 3) { drawPlots(gctx); paintNotes(gctx); return; }

    const x0 = scrollX, y0 = scrollY, x1 = scrollX + innerWidth, y1 = scrollY + innerHeight;
    const o = originPoint();
    gctx.save();
    gctx.translate(-scrollX, -scrollY);
    gctx.lineWidth = 1;

    const faint = hexa(settings.gridColor, 0.28);
    const bold = hexa(settings.gridColor, 0.58);
    const labelled = settings.coords && settings.gridType === "square";

    const minors = s >= 6;

    if (settings.gridType === "square") {
      for (let k = Math.ceil((x0 - o.x) / s); o.x + k * s <= x1; k++) {
        const heavy = k % 5 === 0;
        if (!heavy && !minors) continue;
        gctx.strokeStyle = heavy ? bold : faint;
        line(o.x + k * s, y0, o.x + k * s, y1);
      }
      for (let k = Math.ceil((y0 - o.y) / s); o.y + k * s <= y1; k++) {
        const heavy = k % 5 === 0;
        if (!heavy && !minors) continue;
        gctx.strokeStyle = heavy ? bold : faint;
        line(x0, o.y + k * s, x1, o.y + k * s);
      }
    } else if (settings.gridType === "dots") {
      gctx.fillStyle = bold;
      for (let i = Math.ceil((x0 - o.x) / s); o.x + i * s <= x1; i++)
        for (let j = Math.ceil((y0 - o.y) / s); o.y + j * s <= y1; j++) {
          const big = i % 5 === 0 && j % 5 === 0;
          if (!big && !minors) continue;
          gctx.beginPath();
          gctx.arc(o.x + i * s, o.y + j * s, big ? 2 : 1.1, 0, 7);
          gctx.fill();
        }
    } else if (settings.gridType === "iso") {
      gctx.strokeStyle = faint;
      for (let k = Math.ceil((y0 - o.y) / s); o.y + k * s <= y1; k++)
        line(x0, o.y + k * s, x1, o.y + k * s);
      for (const m of [Math.tan(30 * DEG), -Math.tan(30 * DEG)]) {
        const dc = s / Math.cos(Math.atan(m));
        const c = (X, Y) => (Y - o.y) - m * (X - o.x);
        const cs = [c(x0, y0), c(x1, y0), c(x0, y1), c(x1, y1)];
        for (let k = Math.ceil(Math.min(...cs) / dc); k * dc <= Math.max(...cs); k++)
          line(x0, o.y + m * (x0 - o.x) + k * dc, x1, o.y + m * (x1 - o.x) + k * dc);
      }
    } else if (settings.gridType === "polar") {
      const far = Math.max(
        Math.hypot(x0 - o.x, y0 - o.y), Math.hypot(x1 - o.x, y0 - o.y),
        Math.hypot(x0 - o.x, y1 - o.y), Math.hypot(x1 - o.x, y1 - o.y));
      gctx.strokeStyle = faint;
      for (let r = s; r <= far; r += s) {
        gctx.beginPath();
        gctx.arc(o.x, o.y, r, 0, Math.PI * 2);
        gctx.stroke();
      }
      gctx.strokeStyle = bold;
      for (let a = 0; a < 180; a += POLAR_STEP)
        line(o.x - far * Math.cos(a * DEG), o.y - far * Math.sin(a * DEG),
             o.x + far * Math.cos(a * DEG), o.y + far * Math.sin(a * DEG));
    }

    if (labelled) drawAxes(o, s, x0, y0, x1, y1, clamp(settings.coordStep, 1, 20));
    gctx.restore();
    drawPlots(gctx);
    paintNotes(gctx);
  }

  function drawAxes(o, s, x0, y0, x1, y1, want) {
    const fs = clamp(Math.round(s * 0.34), 9, 13);
    gctx.lineWidth = 1.6;
    gctx.strokeStyle = T.tick;
    line(x0, o.y, x1, o.y);
    line(o.x, y0, o.x, y1);
    gctx.lineWidth = 1;

    gctx.fillStyle = T.tick;
    gctx.font = `${fs}px ui-monospace, Menlo, monospace`;
    const pad = Math.max(3, fs * 0.35);

    const kxa = Math.ceil((x0 - o.x) / s), kxb = Math.floor((x1 - o.x) / s);
    const kya = Math.ceil((y0 - o.y) / s), kyb = Math.floor((y1 - o.y) / s);
    const widest = Math.max(8,
      gctx.measureText(String(kxa)).width, gctx.measureText(String(kxb)).width,
      gctx.measureText(String(-kya)).width, gctx.measureText(String(-kyb)).width);
    const everyX = pickEvery(s, want, widest + fs);
    const everyY = pickEvery(s, want, fs * 1.9);

    gctx.textAlign = "center";
    gctx.textBaseline = "top";
    for (let k = kxa; k <= kxb; k++) {
      if (k === 0 || k % everyX !== 0) continue;
      const x = o.x + k * s;
      const y = clamp(o.y, y0 + 2, y1 - fs - 8);
      gctx.beginPath(); gctx.moveTo(x, y - 4); gctx.lineTo(x, y + 4); gctx.stroke();
      gctx.fillText(String(k), x, y + pad + 2);
    }

    gctx.textAlign = "right";
    gctx.textBaseline = "middle";
    for (let k = kya; k <= kyb; k++) {
      if (k === 0 || k % everyY !== 0) continue;
      const y = o.y + k * s;
      const x = clamp(o.x, x0 + fs * 2.2, x1 - 4);
      gctx.beginPath(); gctx.moveTo(x - 4, y); gctx.lineTo(x + 4, y); gctx.stroke();
      gctx.fillText(String(-k), x - pad - 3, y);
    }

    gctx.textAlign = "right";
    gctx.textBaseline = "top";
    gctx.fillText("0", clamp(o.x, x0 + fs, x1) - pad, clamp(o.y, y0, y1 - fs) + pad);
    gctx.textAlign = "start";
  }

  const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
                   771.32342877765313, -176.61502916214059, 12.507343278686905,
                   -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function gamma(z) {
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1;
    let a = LANCZOS[0];
    for (let i = 1; i < 9; i++) a += LANCZOS[i] / (z + i);
    const t = z + 7.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * a;
  }

  const toRad = (v) => (settings.angleUnit === "deg" ? v * Math.PI / 180 : v);
  const fromRad = (v) => (settings.angleUnit === "deg" ? v * 180 / Math.PI : v);
  const nroot = (v, n) => {
    if (v >= 0) return Math.pow(v, 1 / n);
    return Math.abs(n % 2) === 1 ? -Math.pow(-v, 1 / n) : NaN;
  };

  const FNS = {
    sin:  { n: 1, f: (a) => Math.sin(toRad(a)) },
    cos:  { n: 1, f: (a) => Math.cos(toRad(a)) },
    tan:  { n: 1, f: (a) => Math.tan(toRad(a)) },
    sec:  { n: 1, f: (a) => 1 / Math.cos(toRad(a)) },
    csc:  { n: 1, f: (a) => 1 / Math.sin(toRad(a)) },
    cot:  { n: 1, f: (a) => 1 / Math.tan(toRad(a)) },
    asin: { n: 1, f: (a) => fromRad(Math.asin(a)) },
    acos: { n: 1, f: (a) => fromRad(Math.acos(a)) },
    atan: { n: 1, f: (a) => fromRad(Math.atan(a)) },
    atan2:{ n: 2, f: (a, b) => fromRad(Math.atan2(a, b)) },
    sinh: { n: 1, f: Math.sinh }, cosh: { n: 1, f: Math.cosh }, tanh: { n: 1, f: Math.tanh },
    asinh:{ n: 1, f: Math.asinh }, acosh:{ n: 1, f: Math.acosh }, atanh:{ n: 1, f: Math.atanh },
    sqrt: { n: 1, f: Math.sqrt }, cbrt: { n: 1, f: Math.cbrt },
    nroot:{ n: 2, f: nroot },
    abs:  { n: 1, f: Math.abs }, exp: { n: 1, f: Math.exp },
    ln:   { n: 1, f: Math.log }, log2: { n: 1, f: Math.log2 },
    log:  { n: -1, f: (...a) => (a.length > 1 ? Math.log(a[0]) / Math.log(a[1]) : Math.log10(a[0])) },
    log10:{ n: 1, f: Math.log10 },
    floor:{ n: 1, f: Math.floor }, ceil: { n: 1, f: Math.ceil },
    round:{ n: 1, f: Math.round }, sign: { n: 1, f: Math.sign },
    mod:  { n: 2, f: (a, b) => a - b * Math.floor(a / b) },
    pow:  { n: 2, f: Math.pow }, hypot: { n: -1, f: (...a) => Math.hypot(...a) },
    min:  { n: -1, f: (...a) => Math.min(...a) },
    max:  { n: -1, f: (...a) => Math.max(...a) },
    gamma:{ n: 1, f: gamma },
    fact: { n: 1, f: (a) => gamma(a + 1) }
  };
  const CONSTS = { pi: Math.PI, e: Math.E, tau: Math.PI * 2, phi: (1 + Math.sqrt(5)) / 2 };

  function compile(src) {
    const text = String(src).trim().replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=\s*/i, "");
    if (!text) return { error: "empty" };

    const tok = [];
    const re = /\s*(?:(\d*\.?\d+(?:[eE][+-]?\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(\*\*|[-+*/^(),%!|]))/y;
    let i = 0;
    while (i < text.length) {
      re.lastIndex = i;
      const m = re.exec(text);
      if (!m) return { error: "bad character at " + (i + 1) };
      i = re.lastIndex;
      if (m[1] !== undefined) tok.push({ t: "num", v: parseFloat(m[1]) });
      else if (m[2] !== undefined) tok.push({ t: "name", v: m[2].toLowerCase() });
      else tok.push({ t: "op", v: m[3] === "**" ? "^" : m[3] });
    }
    if (!tok.length) return { error: "empty" };

    let p = 0, failed = null, bars = 0;
    const peek = () => tok[p];
    const eat = (t, v) => {
      const k = tok[p];
      if (k && k.t === t && (v === undefined || k.v === v)) { p++; return k; }
      return null;
    };
    const fail = (msg) => { if (!failed) failed = msg; return () => NaN; };

    function expr() {
      let a = term();
      for (;;) {
        if (eat("op", "+")) { const b = term(), l = a; a = (x) => l(x) + b(x); }
        else if (eat("op", "-")) { const b = term(), l = a; a = (x) => l(x) - b(x); }
        else return a;
      }
    }
    function term() {
      let a = unary();
      for (;;) {
        if (eat("op", "*")) { const b = unary(), l = a; a = (x) => l(x) * b(x); }
        else if (eat("op", "/")) { const b = unary(), l = a; a = (x) => l(x) / b(x); }
        else if (eat("op", "%")) { const b = unary(), l = a; a = (x) => l(x) - b(x) * Math.floor(l(x) / b(x)); }
        else if (implicitAhead()) { const b = unary(), l = a; a = (x) => l(x) * b(x); }
        else return a;
      }
    }
    function implicitAhead() {
      const k = peek();
      if (!k) return false;
      if (k.t === "num" || k.t === "name") return true;
      if (k.t === "op" && k.v === "(") return true;
      return k.t === "op" && k.v === "|" && bars === 0;
    }
    function unary() {
      if (eat("op", "-")) { const a = unary(); return (x) => -a(x); }
      if (eat("op", "+")) return unary();
      return power();
    }
    function power() {
      const base = postfix();
      if (eat("op", "^")) { const ex = unary(); return (x) => Math.pow(base(x), ex(x)); }
      return base;
    }
    function postfix() {
      let a = atom();
      while (eat("op", "!")) { const inner = a; a = (x) => gamma(inner(x) + 1); }
      return a;
    }
    function args(name, want) {
      const list = [];
      if (!eat("op", "(")) return fail(name + " needs ( )");
      if (!eat("op", ")")) {
        for (;;) {
          list.push(expr());
          if (eat("op", ",")) continue;
          if (eat("op", ")")) break;
          return fail("missing ) after " + name);
        }
      }
      if (want >= 0 && list.length !== want)
        return fail(name + " takes " + want + (want === 1 ? " argument" : " arguments"));
      if (want < 0 && !list.length) return fail(name + " needs an argument");
      return list;
    }
    function atom() {
      const k = peek();
      if (!k) return fail("unexpected end");
      if (k.t === "num") { p++; const v = k.v; return () => v; }
      if (k.t === "op" && k.v === "(") {
        p++;
        const e = expr();
        if (!eat("op", ")")) return fail("missing )");
        return e;
      }
      if (k.t === "op" && k.v === "|") {
        p++; bars++;
        const e = expr();
        bars--;
        if (!eat("op", "|")) return fail("missing closing |");
        return (x) => Math.abs(e(x));
      }
      if (k.t === "name") {
        p++;
        const n = k.v;
        if (n === "x") return (x) => x;
        if (n in CONSTS) { const v = CONSTS[n]; return () => v; }
        if (n in FNS) {
          const spec = FNS[n];
          const list = args(n, spec.n);
          if (typeof list === "function") return list;
          const f = spec.f;
          if (list.length === 1) { const a0 = list[0]; return (x) => f(a0(x)); }
          if (list.length === 2) { const a0 = list[0], a1 = list[1]; return (x) => f(a0(x), a1(x)); }
          return (x) => f(...list.map((g) => g(x)));
        }
        return fail("unknown name " + n);
      }
      return fail("unexpected " + k.v);
    }

    const fn = expr();
    if (failed) return { error: failed };
    if (p < tok.length) return { error: "unexpected " + tok[p].v };
    try {
      const probe = fn(0.7351);
      if (typeof probe !== "number") return { error: "not a number" };
    } catch (e) { return { error: "cannot evaluate" }; }
    return { fn, text };
  }

  const EYE_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></svg>';
  const EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M9.6 6A10 10 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a17 17 0 0 1-3.3 4M6.5 8.2A17 17 0 0 0 2 12s3.6 6.5 10 6.5a10 10 0 0 0 3-.45"/></svg>';
  const PLOT_COLORS = [
    "#C02E58", "#0504AA", "#128A5B", "#E07B39", "#7A4BAF", "#14A5A0",
    "#E8628C", "#2A5F91", "#7FA31E", "#EFC44A", "#C0399F", "#4FA3E3",
    "#35101E", "#B7791F", "#1A1A1A"
  ];

  function drawPlots(c) {
    if (settings.mode !== "gebra" || !plots.length) return;
    const step = gridStep();
    if (step < 3) return;
    const o = originPoint();
    const x0 = scrollX, x1 = scrollX + innerWidth;
    const top = scrollY - innerHeight, bot = scrollY + 2 * innerHeight;

    c.save();
    c.translate(-scrollX, -scrollY);
    c.lineCap = "round";
    c.lineJoin = "round";

    for (const pl of plots) {
      if (pl.hidden || !pl.fn) continue;
      c.strokeStyle = pl.color;
      c.lineWidth = pl.width || 2;
      c.beginPath();

      let drawing = false, prevY = 0, prevOn = false;
      for (let px = x0 - 1; px <= x1 + 1; px += 1) {
        const xu = (px - o.x) / step;
        let y;
        try { y = pl.fn(xu); } catch (e) { y = NaN; }

        if (!Number.isFinite(y)) { drawing = false; prevOn = false; continue; }
        const py = o.y - y * step;

        const on = py >= top && py <= bot;
        if (drawing && !on && !prevOn &&
            Math.sign(py - bot) !== Math.sign(prevY - bot)) drawing = false;
        if (!drawing) { c.moveTo(px, py); drawing = true; }
        else c.lineTo(px, py);
        prevY = py; prevOn = on;
      }
      c.stroke();
    }
    c.restore();
  }

  function addPlot(src) {
    const r = compile(src);
    const err = $("#fxerr");
    if (r.error) {
      err.textContent = t("fxBad") + ": " + r.error;
      err.hidden = false;
      return false;
    }
    err.hidden = true;
    plots.push({
      src: r.text,
      fn: r.fn,
      color: PLOT_COLORS[plots.length % PLOT_COLORS.length],
      width: 2,
      hidden: false
    });
    renderPlots();
    drawGrid();
    return true;
  }

  function renderPlots() {
    const list = $("#fxlist");
    list.textContent = "";
    plots.forEach((pl, i) => {
      const row = document.createElement("div");
      row.className = "fxrow" + (pl.hidden ? " off" : "");
      row.innerHTML =
        `<button class="fxsw" style="background:${pl.color}" data-i18n-title="fxColour"></button>` +
        `<span class="fxsrc">${pl.src.replace(/[<>&]/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[ch]))}</span>` +
        `<button class="fxeye" data-i18n-title="fxShow">${pl.hidden ? EYE_OFF : EYE_ON}</button>` +
        `<button class="fxdel" data-i18n-title="fxDelete">✕</button>`;
      row.querySelector(".fxsw").onclick = () => {
        pl.color = PLOT_COLORS[(PLOT_COLORS.indexOf(pl.color) + 1) % PLOT_COLORS.length];
        renderPlots(); drawGrid();
      };
      row.querySelector(".fxeye").onclick = () => {
        pl.hidden = !pl.hidden;
        renderPlots(); drawGrid();
      };
      row.querySelector(".fxdel").onclick = () => {
        plots.splice(i, 1);
        renderPlots(); drawGrid();
      };
      list.appendChild(row);
    });
    list.hidden = !plots.length;
    applyLang();
  }

  function line(a, b, c, d) {
    gctx.beginPath(); gctx.moveTo(a, b); gctx.lineTo(c, d); gctx.stroke();
  }

  function hexa(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  }

  const baseCv = document.createElement("canvas");
  const bctx = baseCv.getContext("2d");
  let baseStale = true;

  function sizeBase() {
    baseCv.width = inkCv.width;
    baseCv.height = inkCv.height;
    baseStale = true;
  }

  function withPen(ctx, fn) {
    const o = originPoint(), k = inkScale();
    ctx.save();
    ctx.setTransform(dprScale(), 0, 0, dprScale(), 0, 0);
    ctx.translate(-scrollX, -scrollY);
    ctx.translate(o.x, o.y);
    ctx.scale(k, k);
    ctx.translate(-o.x, -o.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    fn(ctx);
    ctx.restore();
  }

  const dprScale = () => window.devicePixelRatio || 1;

  function rebuildBase() {
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.clearRect(0, 0, baseCv.width, baseCv.height);
    withPen(bctx, (c) => { for (const st of strokes) paintOn(c, st); });
    baseStale = false;
  }

  function bakeStroke(st) {
    if (baseStale) return;
    withPen(bctx, (c) => paintOn(c, st));
  }

  function drawInk() {
    ictx.save();
    ictx.setTransform(1, 0, 0, 1, 0, 0);
    ictx.clearRect(0, 0, inkCv.width, inkCv.height);
    ictx.restore();
    notesEl.classList.toggle("off", settings.tool === "off");
    if (settings.tool === "off") return;
    if (baseStale) rebuildBase();
    ictx.save();
    ictx.setTransform(1, 0, 0, 1, 0, 0);
    ictx.drawImage(baseCv, 0, 0);
    ictx.restore();
    if (current) withPen(ictx, (c) => {
      const n = current.note;
      if (n) {
        const a = docToWorld({ x: n.x, y: n.y + 20 });
        const b = docToWorld({ x: n.x + n.w, y: n.y + n.h });
        c.save();
        c.beginPath();
        c.rect(a.x, a.y, b.x - a.x, b.y - a.y);
        c.clip();
        paintOn(c, current);
        c.restore();
      } else {
        paintOn(c, current);
      }
    });
  }

  function paintOn(ictx, st) {
    const p = st.pts;
    if (p.length < 2) return;
    ictx.globalCompositeOperation = st.erase ? "destination-out" : "source-over";
    ictx.strokeStyle = st.color;

    if (!st.line && p.length === 2 && Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y) < 0.5) {
      ictx.fillStyle = st.color;
      ictx.beginPath();
      ictx.arc(p[0].x, p[0].y, p[0].w / 2, 0, Math.PI * 2);
      ictx.fill();
      ictx.globalCompositeOperation = "source-over";
      return;
    }

    if (st.line) {
      ictx.lineWidth = p[0].w;
      ictx.beginPath();
      ictx.moveTo(p[0].x, p[0].y);
      ictx.lineTo(p[p.length - 1].x, p[p.length - 1].y);
      ictx.stroke();
    } else {
      for (let i = 1; i < p.length; i++) {
        const a = p[i - 1], b = p[i];
        const m0 = i === 1 ? a : { x: (p[i - 2].x + a.x) / 2, y: (p[i - 2].y + a.y) / 2 };
        const m1 = i === p.length - 1 ? b : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        ictx.lineWidth = (a.w + b.w) / 2;
        ictx.beginPath();
        ictx.moveTo(m0.x, m0.y);
        ictx.quadraticCurveTo(a.x, a.y, m1.x, m1.y);
        ictx.stroke();
      }
    }
    ictx.globalCompositeOperation = "source-over";
  }

  function edges() {
    const list = [];
    if (settings.showRuler) {
      const a = ruler.angle * DEG;
      list.push({ x: ruler.x, y: ruler.y, dx: Math.cos(a), dy: Math.sin(a),
                  len: settings.rulerLength, pad: 12 });
    }
    if (settings.showProtractor) {
      const R = clamp(settings.protRadius, 90, 300);
      const a = protractor.angle * DEG;
      const dx = Math.cos(a), dy = Math.sin(a);
      list.push({ x: protractor.x - R * dx, y: protractor.y - R * dy,
                  dx, dy, len: 2 * R, pad: 10 });
      const b = (protractor.angle - protractor.arm) * DEG;
      list.push({ x: protractor.x, y: protractor.y,
                  dx: Math.cos(b), dy: Math.sin(b), len: R, pad: 10 });
    }
    return list;
  }

  function snap(p, shiftKey) {
    if (settings.snapMode === "ruler") {
      let best = null;
      for (const e of edges()) {
        const t = (p.x - e.x) * e.dx + (p.y - e.y) * e.dy;
        const perp = Math.abs(-(p.x - e.x) * e.dy + (p.y - e.y) * e.dx);
        if (perp >= SNAP_DIST || t < -e.pad || t > e.len + e.pad) continue;
        if (!best || perp < best.perp) best = { e, t: clamp(t, 0, e.len), perp };
      }
      if (best) return { x: best.e.x + best.t * best.e.dx, y: best.e.y + best.t * best.e.dy };
    }
    if (settings.snapMode === "grid" && settings.gridType !== "none") {
      const g = gridNode({ x: p.x + scrollX, y: p.y + scrollY });
      if (g) return { x: g.x - scrollX, y: g.y - scrollY };
    }
    if (shiftKey && current && current.pts.length) {
      const a = current.pts[0];
      const sx = a.x - scrollX, sy = a.y - scrollY;
      const ang = Math.round(Math.atan2(p.y - sy, p.x - sx) / (15 * DEG)) * 15 * DEG;
      const len = Math.hypot(p.x - sx, p.y - sy);
      return { x: sx + len * Math.cos(ang), y: sy + len * Math.sin(ang) };
    }
    return p;
  }

  function gridNode(d) {
    const s = gridStep();
    if (s < 3) return null;
    const o = originPoint();
    const dx = d.x - o.x, dy = d.y - o.y;

    if (settings.gridType === "square" || settings.gridType === "dots") {
      return { x: o.x + Math.round(dx / s) * s, y: o.y + Math.round(dy / s) * s };
    }
    if (settings.gridType === "iso") {
      const row = Math.round(dy / s);
      const off = Math.sqrt(3) * row * s;
      let best = null;
      for (const base of [off, -off]) {
        const x = base + 2 * s * Math.round((dx - base) / (2 * s));
        if (!best || Math.abs(x - dx) < Math.abs(best - dx)) best = x;
      }
      return { x: o.x + best, y: o.y + row * s };
    }
    if (settings.gridType === "polar") {
      const r = Math.hypot(dx, dy);
      if (r < s / 2) return { x: o.x, y: o.y };
      const rr = Math.max(s, Math.round(r / s) * s);
      const a = Math.round((Math.atan2(dy, dx) / DEG) / POLAR_STEP) * POLAR_STEP * DEG;
      return { x: o.x + rr * Math.cos(a), y: o.y + rr * Math.sin(a) };
    }
    return null;
  }

  const inkScale = () => settings.zoom;

  const toWorld = (p, w) => {
    const o = originPoint(), k = inkScale();
    return {
      x: o.x + (p.x + scrollX - o.x) / k,
      y: o.y + (p.y + scrollY - o.y) / k,
      w: w / k
    };
  };

  const worldToDoc = (p) => {
    const o = originPoint(), k = inkScale();
    return { x: o.x + (p.x - o.x) * k, y: o.y + (p.y - o.y) * k };
  };

  const docToWorld = (p) => {
    const o = originPoint(), k = inkScale();
    return { x: o.x + (p.x - o.x) / k, y: o.y + (p.y - o.y) / k };
  };

  const panPtrs = new Map();
  let strokeId = null, strokeType = null, strokeLast = null;
  let lastPenAt = 0, panCentre = null;

  const centroid = (m) => {
    let x = 0, y = 0;
    for (const p of m.values()) { x += p.x; y += p.y; }
    return { x: x / m.size, y: y / m.size };
  };

  function strokeWidth(e) {
    const base = settings.tool === "erase" ? settings.inkWidth * 6 : settings.inkWidth;
    if (!settings.pressure || e.pointerType !== "pen") return base;
    const pr = e.pressure > 0 ? e.pressure : 0.5;
    return clamp(base * (0.4 + pr * 1.4), base * 0.35, base * 2.2);
  }

  function fingerIsRejected(e) {
    if (e.pointerType !== "touch") return false;
    if (settings.penOnly) return true;
    return performance.now() - lastPenAt < PALM_MS;
  }

  function beginPan(id, x, y) {
    panPtrs.set(id, { x, y });
    panCentre = centroid(panPtrs);
  }

  function abortStroke() {
    current = null; strokeId = null; strokeType = null; strokeLast = null;
    drawInk();
  }

  function startStroke(e) {
    const w = strokeWidth(e);
    const p = snap({ x: e.clientX, y: e.clientY }, false);
    strokeId = e.pointerId; strokeType = e.pointerType;
    strokeLast = { x: e.clientX, y: e.clientY };
    undone.length = 0;
    const start = toWorld(p, w);
    current = {
      color: settings.inkColor,
      erase: settings.tool === "erase",
      line: settings.tool === "line",
      note: noteAt(worldToDoc(start)),
      pts: [start, { x: start.x, y: start.y, w: start.w }]
    };
    drawInk();
  }

  const snapDuringStroke = () => settings.snapMode !== "free" || (current && current.line);

  function extendStroke(e) {
    const raw = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    const events = raw && raw.length ? raw : [e];
    for (const ev of events) {
      const w = strokeWidth(ev);
      const raw = { x: ev.clientX, y: ev.clientY };
      const p = toWorld(snapDuringStroke() ? snap(raw, ev.shiftKey) : (ev.shiftKey ? snap(raw, true) : raw), w);
      if (current.line) {
        current.pts[1] = p;
      } else {
        const last = current.pts[current.pts.length - 1];
        if (Math.hypot(p.x - last.x, p.y - last.y) * inkScale() < 0.7) continue;
        current.pts.push(p);
      }
    }
    strokeLast = { x: e.clientX, y: e.clientY };
    drawInk();
    updateLive();
  }

  inkCv.addEventListener("pointerdown", (e) => {
    if (settings.tool === "off") return;
    e.preventDefault();
    inkCv.setPointerCapture(e.pointerId);
    if (e.pointerType === "pen") lastPenAt = performance.now();

    if (e.pointerType === "touch") {
      const touchIsDrawing = strokeId !== null && strokeType === "touch";
      if (fingerIsRejected(e) || touchIsDrawing || strokeId !== null) {
        if (touchIsDrawing) {
          const id = strokeId, at = strokeLast;
          abortStroke();
          beginPan(id, at.x, at.y);
        }
        beginPan(e.pointerId, e.clientX, e.clientY);
        return;
      }
    }
    if (strokeId !== null && strokeType === "touch") abortStroke();
    if (strokeId !== null) return;
    startStroke(e);
  });

  inkCv.addEventListener("pointermove", (e) => {
    if (panPtrs.has(e.pointerId)) {
      panPtrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const c = centroid(panPtrs);
      scrollBy(panCentre.x - c.x, panCentre.y - c.y);
      panCentre = c;
      return;
    }
    if (e.pointerId !== strokeId || !current) return;
    if (e.pointerType === "pen") lastPenAt = performance.now();
    extendStroke(e);
  });

  function releasePointer(e) {
    if (panPtrs.has(e.pointerId)) {
      panPtrs.delete(e.pointerId);
      panCentre = panPtrs.size ? centroid(panPtrs) : null;
      return;
    }
    if (e.pointerId !== strokeId) return;
    if (e.pointerType === "pen") lastPenAt = performance.now();
    if (current && current.pts.length >= 2) {
      if (current.note) {
        const n = current.note;
        n.strokes.push({
          color: current.color, erase: current.erase, line: current.line,
          pts: current.pts.map((q) => {
            const d = worldToDoc(q);
            return { x: d.x - n.x, y: d.y - n.y, w: q.w * inkScale() };
          })
        });
        n.dirty = true;
        drawGrid();
      } else {
        strokes.push(current);
        bakeStroke(current);
        if (undone.length) undone.length = 0;
      }
    }
    current = null; strokeId = null; strokeType = null; strokeLast = null;
    drawInk();
  }
  inkCv.addEventListener("pointerup", releasePointer);
  inkCv.addEventListener("pointercancel", releasePointer);
  inkCv.addEventListener("lostpointercapture", releasePointer);
  inkCv.addEventListener("contextmenu", (e) => { if (settings.tool !== "off") e.preventDefault(); });

  function updateLive() {
    const st = current || strokes[strokes.length - 1];
    if (!st || st.pts.length < 2) return;
    const a = st.pts[0], b = st.pts[st.pts.length - 1];
    const px = Math.hypot(b.x - a.x, b.y - a.y) * inkScale();
    const val = settings.unit === "px" ? px : px / unitPx();
    $("#liveLen").textContent = settings.unit === "px"
      ? `${Math.round(val)} ${t("u_px")}`
      : `${val.toFixed(2)} ${t("u_" + settings.unit)}`;
    $("#liveAng").textContent = `${Math.round(norm180(-Math.atan2(b.y - a.y, b.x - a.x) / DEG))}°`;
  }

  function gesture(el, read, write, opts = {}) {
    const pts = new Map();
    let base = null;
    const snapshot = () => {
      base = { state: read(), pts: [...pts.values()].map((p) => ({ x: p.x, y: p.y })) };
    };
    el.addEventListener("pointerdown", (e) => {
      if (opts.ignore) {
        const list = Array.isArray(opts.ignore) ? opts.ignore : [opts.ignore];
        if (list.some((el) => el && (e.target === el || el.contains(e.target)))) return;
      }
      if (opts.skipTags && opts.skipTags.includes(e.target.tagName)) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      snapshot();
      el.classList.add("dragging");
    });
    el.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const cur = [...pts.values()];
      if (!base || base.pts.length !== cur.length) { snapshot(); return; }
      if (cur.length === 1) {
        write({
          x: base.state.x + cur[0].x - base.pts[0].x,
          y: base.state.y + cur[0].y - base.pts[0].y,
          angle: base.state.angle
        });
        return;
      }
      const b0 = base.pts[0], b1 = base.pts[1], c0 = cur[0], c1 = cur[1];
      const bc = { x: (b0.x + b1.x) / 2, y: (b0.y + b1.y) / 2 };
      const cc = { x: (c0.x + c1.x) / 2, y: (c0.y + c1.y) / 2 };
      const da = opts.rotate === false ? 0
        : Math.atan2(c1.y - c0.y, c1.x - c0.x) - Math.atan2(b1.y - b0.y, b1.x - b0.x);
      const vx = base.state.x - bc.x, vy = base.state.y - bc.y;
      const cos = Math.cos(da), sin = Math.sin(da);
      write({
        x: cc.x + vx * cos - vy * sin,
        y: cc.y + vx * sin + vy * cos,
        angle: norm180(base.state.angle + da / DEG)
      });
    });
    const drop = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size) snapshot();
      else { base = null; el.classList.remove("dragging"); }
    };
    el.addEventListener("pointerup", drop);
    el.addEventListener("pointercancel", drop);
  }

  function rotateKnob(knob, read, write) {
    knob.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      e.preventDefault();
      knob.setPointerCapture(e.pointerId);
      const s = read();
      const a0 = Math.atan2(e.clientY - s.y, e.clientX - s.x) / DEG;
      const r0 = s.angle;
      const move = (ev) => {
        const st = read();
        const a = Math.atan2(ev.clientY - st.y, ev.clientX - st.x) / DEG;
        let next = r0 + (a - a0);
        if (ev.shiftKey) next = Math.round(next / 15) * 15;
        write({ x: st.x, y: st.y, angle: norm180(next) });
      };
      const up = () => {
        knob.removeEventListener("pointermove", move);
        knob.removeEventListener("pointerup", up);
        knob.removeEventListener("pointercancel", up);
      };
      knob.addEventListener("pointermove", move);
      knob.addEventListener("pointerup", up);
      knob.addEventListener("pointercancel", up);
    });
  }

  function tickSvg() {
    const L = settings.rulerLength, u = unitPx();
    const step = settings.unit === "px" ? 100 : u;
    const subs = pickSubs(step, settings.unit === "in" ? [8, 4, 2, 1] : [10, 5, 2, 1], 4);
    const sub = step / subs;
    const every = pickEvery(step, 1, 30);
    const tickEvery = step >= 9 ? 1 : every;
    let out = "";
    for (let i = 0; i * sub <= L; i++) {
      const x = +(i * sub).toFixed(2);
      const unitAt = i / subs;
      const major = i % subs === 0;
      if (major && unitAt % tickEvery !== 0) continue;
      const mid = subs % 2 === 0 && i % (subs / 2) === 0;
      const h = major ? 22 : mid ? 14 : 8;
      out += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${major ? T.tick : T.tickSoft}" stroke-width="${major ? 1.4 : 1}"/>`;
      if (major && unitAt % every === 0 && x < L - 10) {
        const val = settings.unit === "px" ? unitAt * 100 : unitAt;
        out += `<text x="${x + 3}" y="35" font-family="ui-monospace,Menlo,monospace" font-size="11" fill="${T.tick}">${val}</text>`;
      }
    }
    out += `<text x="${L - 8}" y="${RULER_H - 10}" text-anchor="end" font-family="ui-sans-serif,system-ui" font-size="11" fill="${T.mute}">${t("u_" + settings.unit)}</text>`;
    out += `<text x="9" y="${RULER_H - 10}" font-family="ui-sans-serif,system-ui" font-size="10" letter-spacing=".4" fill="${T.stamp}">Hamzh studios™</text>`;
    return `<svg width="${L}" height="${RULER_H}" viewBox="0 0 ${L} ${RULER_H}">${out}</svg>`;
  }

  function layoutRuler() {
    rulerEl.style.display = settings.showRuler ? "block" : "none";
    rulerEl.style.width = settings.rulerLength + "px";
    rulerEl.style.transform = `translate(${ruler.x}px, ${ruler.y}px) rotate(${ruler.angle}deg)`;
    const old = rulerEl.querySelector("svg");
    if (old) old.remove();
    rulerEl.insertAdjacentHTML("afterbegin", tickSvg());
    $("#angle").value = Math.round(ruler.angle);
  }

  const readRuler = () => ({ x: ruler.x, y: ruler.y, angle: ruler.angle });
  const writeRuler = (s) => {
    ruler.x = s.x; ruler.y = s.y; ruler.angle = s.angle; layoutRuler();
  };
  gesture(rulerEl, readRuler, writeRuler, { ignore: rulerKnob });
  rotateKnob(rulerKnob, readRuler, writeRuler);

  function protractorSvg() {
    const R = clamp(settings.protRadius, 90, 300);
    const pad = 18, W = R * 2 + pad * 2, H = R + pad * 2;
    const cx = W / 2, cy = H - pad;
    const step = R >= 130 ? 1 : 2;
    const labelEvery = R >= 150 ? 10 : 20;
    const fs = clamp(Math.round(R * 0.068), 8, 12);
    let t = "";

    for (let a = 0; a <= 180; a += step) {
      const major = a % 10 === 0, mid = a % 5 === 0;
      const len = major ? R * 0.1 : mid ? R * 0.065 : R * 0.038;
      const r = a * DEG;
      const cos = Math.cos(r), sin = Math.sin(r);
      t += `<line x1="${(cx - R * cos).toFixed(1)}" y1="${(cy - R * sin).toFixed(1)}"` +
           ` x2="${(cx - (R - len) * cos).toFixed(1)}" y2="${(cy - (R - len) * sin).toFixed(1)}"` +
           ` stroke="${major ? T.tick : T.tickSoft}" stroke-width="${major ? 1.3 : .9}"/>`;
      if (a % labelEvery === 0) {
        const lx = cx - (R - R * 0.175) * cos, ly = cy - (R - R * 0.175) * sin;
        const ix = cx - (R - R * 0.29) * cos, iy = cy - (R - R * 0.29) * sin;
        t += `<text x="${lx.toFixed(1)}" y="${(ly + fs * .36).toFixed(1)}" text-anchor="middle"` +
             ` font-family="ui-monospace,Menlo,monospace" font-size="${fs}" fill="${T.tick}"` +
             ` transform="rotate(${a - 90} ${lx.toFixed(1)} ${ly.toFixed(1)})">${a}</text>`;
        t += `<text x="${ix.toFixed(1)}" y="${(iy + fs * .36).toFixed(1)}" text-anchor="middle"` +
             ` font-family="ui-monospace,Menlo,monospace" font-size="${fs - 1}" fill="${T.mute}"` +
             ` transform="rotate(${a - 90} ${ix.toFixed(1)} ${iy.toFixed(1)})">${180 - a}</text>`;
      }
    }

    const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z"
            fill="${T.face}" stroke="${T.faceLine}" stroke-width="1.2"/>
      ${t}
      <line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="${T.tick}" stroke-width="1.3"/>
      <line x1="${cx}" y1="${cy - R * 0.12}" x2="${cx}" y2="${cy + pad * 0.5}" stroke="${T.tick}" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="4.5" fill="none" stroke="${T.tick}" stroke-width="1.2"/>
      <circle cx="${cx}" cy="${cy}" r="1.4" fill="${T.tick}"/>
      <text x="${cx}" y="${cy - R * 0.4}" text-anchor="middle"
            font-family="ui-sans-serif,system-ui" font-size="${fs}" fill="${T.stamp}">Hamzh studios&#8482;</text>
    </svg>`;
    return { svg, W, H, cx, cy, R };
  }

  let protGeom = null;

  function buildProtractor() {
    protEl.style.display = settings.showProtractor ? "block" : "none";
    if (!settings.showProtractor) return;
    protGeom = protractorSvg();
    const old = protEl.querySelector("svg");
    if (old) old.remove();
    protEl.insertAdjacentHTML("afterbegin", protGeom.svg);
    protEl.style.width = protGeom.W + "px";
    protEl.style.height = protGeom.H + "px";
    protEl.style.transformOrigin = `${protGeom.cx}px ${protGeom.cy}px`;
    protKnob.style.left = (protGeom.cx + protGeom.R + 16) + "px";
    protKnob.style.top = protGeom.cy + "px";
    placeProtractor();
  }

  function placeProtractor() {
    if (!protGeom) return;
    protEl.style.transform =
      `translate(${protractor.x - protGeom.cx}px, ${protractor.y - protGeom.cy}px) rotate(${protractor.angle}deg)`;
    layoutArm();
  }

  function layoutArm() {
    if (!protGeom) return;
    const { cx, cy, R } = protGeom;
    const arm = protEl.querySelector(".arm");
    const deg = protEl.querySelector(".deg");
    const a = clamp(protractor.arm, 0, 180);
    arm.style.left = cx + "px";
    arm.style.top = cy + "px";
    arm.style.width = R + "px";
    arm.style.transform = `rotate(${-a}deg)`;
    const rad = a * DEG;
    deg.textContent = `${Math.round(a)}\u00B0`;
    deg.style.left = (cx - R * 0.46 * Math.cos(rad + Math.PI)) + "px";
    deg.style.top = (cy - R * 0.46 * Math.sin(rad) - 9) + "px";
    deg.style.transform = `translate(-50%,-50%) rotate(${-protractor.angle}deg)`;
  }

  const readProt = () => ({ x: protractor.x, y: protractor.y, angle: protractor.angle });
  const writeProt = (s) => {
    protractor.x = s.x; protractor.y = s.y; protractor.angle = s.angle; placeProtractor();
  };
  const protTip = protEl.querySelector(".arm .tip");
  gesture(protEl, readProt, writeProt, { ignore: [protKnob, protTip] });
  rotateKnob(protKnob, readProt, writeProt);

  protTip.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    protTip.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const a = Math.atan2(ev.clientY - protractor.y, ev.clientX - protractor.x) / DEG;
      let rel = -(a - protractor.angle);
      rel = ((rel % 360) + 360) % 360;
      if (rel > 180) rel = rel > 270 ? 0 : 180;
      protractor.arm = ev.shiftKey ? Math.round(rel / 5) * 5 : Math.round(rel);
      layoutArm();
    };
    const up = () => {
      protTip.removeEventListener("pointermove", move);
      protTip.removeEventListener("pointerup", up);
      protTip.removeEventListener("pointercancel", up);
    };
    protTip.addEventListener("pointermove", move);
    protTip.addEventListener("pointerup", up);
    protTip.addEventListener("pointercancel", up);
  });

  const notesEl = $("#notes");
  const NOTE_W = 190, NOTE_H = 130;

  function addNote() {
    notes.push({
      x: scrollX + innerWidth / 2 - NOTE_W / 2 + (notes.length % 5) * 18,
      y: scrollY + innerHeight / 3 + (notes.length % 5) * 18,
      w: NOTE_W, h: NOTE_H, text: "", strokes: [], dirty: true
    });
    renderNotes();
    drawGrid();
    if (settings.noteInput === "write") return;
    const last = notesEl.lastElementChild;
    if (last) {
      last.classList.add("editing");
      last.querySelector("textarea").focus();
    }
  }

  function renderNotes() {
    notesEl.textContent = "";
    notes.forEach((n, i) => notesEl.appendChild(noteEl(n, i)));
    layoutNotes();
  }

  const PENCIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L20 8l-4-4L4 16z"/></svg>';

  function noteEl(n) {
    const el = document.createElement("div");
    el.className = "note";
    el.innerHTML = '<div class="bar"><span class="grip"></span>' +
                   (settings.noteInput === "write" ? "" : `<button class="pen">${PENCIL}</button>`) +
                   `<button class="del">\u2715</button></div>` +
                   '<textarea spellcheck="false"></textarea><span class="size"></span>';
    const ta = el.querySelector("textarea");
    ta.value = n.text;
    ta.addEventListener("input", () => { n.text = ta.value; n.dirty = true; drawGrid(); });
    ta.addEventListener("pointerdown", (e) => e.stopPropagation());
    ta.addEventListener("blur", () => { el.classList.remove("editing"); drawGrid(); });
    ta.addEventListener("keydown", (e) => { if (e.key === "Escape") ta.blur(); });
    const penBtn = el.querySelector(".pen");
    if (penBtn) penBtn.onclick = () => { el.classList.add("editing"); ta.focus(); };
    el.querySelector(".del").onclick = () => {
      const i = notes.indexOf(n);
      if (i >= 0) notes.splice(i, 1);
      renderNotes();
      drawGrid();
    };
    gesture(el.querySelector(".grip"),
      () => ({ x: n.x - scrollX, y: n.y - scrollY, angle: 0 }),
      (st) => { n.x = st.x + scrollX; n.y = st.y + scrollY; layoutNotes(); drawGrid(); },
      { rotate: false });
    gesture(el.querySelector(".size"),
      () => ({ x: n.w, y: n.h, angle: 0 }),
      (st) => {
        n.w = clamp(st.x, 120, 520);
        n.h = clamp(st.y, 80, 520);
        n.dirty = true;
        layoutNotes();
        drawGrid();
      },
      { rotate: false });
    el.__note = n;
    return el;
  }

  function layoutNotes() {
    notesEl.classList.toggle("off", settings.tool === "off");
    for (const el of notesEl.children) {
      const n = el.__note;
      el.style.left = (n.x - scrollX) + "px";
      el.style.top = (n.y - scrollY) + "px";
      el.style.width = n.w + "px";
      el.style.height = n.h + "px";
    }
  }

  function noteBitmap(n) {
    const dpr = window.devicePixelRatio || 1;
    if (!n.cv) { n.cv = document.createElement("canvas"); n.ink = document.createElement("canvas"); }
    const wantW = Math.round(n.w * dpr), wantH = Math.round(n.h * dpr);
    if (n.cv.width !== wantW || n.cv.height !== wantH) {
      n.cv.width = wantW; n.cv.height = wantH;
      n.ink.width = wantW; n.ink.height = wantH;
      n.dirty = true;
    }
    if (!n.dirty) return n.cv;

    const r = 6;
    const roundRect = (c, inset) => {
      const x0 = inset, y0 = inset, x1 = n.w - inset, y1 = n.h - inset;
      c.beginPath();
      c.moveTo(x0 + r, y0);
      c.arcTo(x1, y0, x1, y1, r);
      c.arcTo(x1, y1, x0, y1, r);
      c.arcTo(x0, y1, x0, y0, r);
      c.arcTo(x0, y0, x1, y0, r);
      c.closePath();
    };

    const ic = n.ink.getContext("2d");
    ic.setTransform(dpr, 0, 0, dpr, 0, 0);
    ic.clearRect(0, 0, n.w, n.h);
    ic.save();
    ic.beginPath();
    ic.rect(0, 20, n.w, n.h - 20);
    ic.clip();
    ic.lineCap = "round";
    ic.lineJoin = "round";
    for (const st of n.strokes) paintOn(ic, st);
    ic.restore();

    const c = n.cv.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, n.w, n.h);

    roundRect(c, 0);
    c.fillStyle = T.surface;
    c.fill();
    c.save();
    c.clip();

    c.fillStyle = T.accent;
    c.fillRect(0, 0, n.w, 20);

    c.fillStyle = T.ink;
    c.font = '13px "Inter", "Segoe UI", system-ui, sans-serif';
    c.textAlign = "start";
    c.textBaseline = "top";
    let y = 27;
    for (const para of String(n.text).split("\n")) {
      let lineText = "";
      for (const word of para.split(" ")) {
        const probe = lineText ? lineText + " " + word : word;
        if (c.measureText(probe).width > n.w - 16 && lineText) {
          c.fillText(lineText, 8, y);
          y += 18;
          lineText = word;
        } else {
          lineText = probe;
        }
        if (y > n.h - 18) break;
      }
      if (y > n.h - 18) break;
      c.fillText(lineText, 8, y);
      y += 18;
    }

    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(n.ink, 0, 0);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.restore();

    c.strokeStyle = T.rule;
    c.lineWidth = 1;
    roundRect(c, .5);
    c.stroke();

    n.dirty = false;
    return n.cv;
  }

  function paintNotes(c) {
    if (settings.tool === "off") return;
    for (const el of notesEl.children) el.__note.editing = el.classList.contains("editing");
    c.save();
    c.translate(-scrollX, -scrollY);
    for (const n of notes) {
      if (n.editing) continue;
      c.drawImage(noteBitmap(n), n.x, n.y, n.w, n.h);
    }
    c.restore();
  }

  function noteAt(docPt) {
    if (settings.noteInput === "type") return null;
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      if (n.editing) continue;
      if (docPt.x >= n.x && docPt.x <= n.x + n.w &&
          docPt.y >= n.y + 20 && docPt.y <= n.y + n.h) return n;
    }
    return null;
  }

  const INKS = [
    { c: "#1A1A1A" },
    { c: "#FFFFFF", pale: true },
    { c: "#C02E58", gold: true },
    { c: "#0504AA", gold: true }
  ];

  const hex2 = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  const rgbToHex = (r, g, b) => ("#" + hex2(r) + hex2(g) + hex2(b)).toUpperCase();
  function hexToRgb(h) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(h).trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
  }

  $("#swatches").innerHTML =
    INKS.map((k) =>
      `<button class="sw${k.pale ? " pale" : ""}${k.gold ? " gold" : ""}" data-color="${k.c}"` +
      ` style="background:${k.c}" title="${k.c}"></button>`).join("") +
    '<span class="inkcustom">' +
      '<button class="sw custom" id="inkcust" data-i18n-title="inkCustom"></button>' +
      '<span class="inkpick" id="inkpick" hidden>' +
        '<span class="inkrow"><input type="color" id="inkmap"><input type="text" id="inkhex" spellcheck="false" maxlength="7"></span>' +
      '</span>' +
    '</span>';

  const inkPick = $("#inkpick"), inkCust = $("#inkcust");
  const closeInkPick = () => { inkPick.hidden = true; };

  function paintCustomSwatch() {
    inkCust.style.background = settings.customInk;
    inkCust.classList.toggle("on", settings.inkColor === settings.customInk &&
      !INKS.some((k) => k.c === settings.inkColor));
  }

  function setCustomInk(hex, from) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const norm = rgbToHex(rgb.r, rgb.g, rgb.b);
    settings.customInk = norm;
    settings.inkColor = norm;
    if (from !== "map") $("#inkmap").value = norm.toLowerCase();
    if (from !== "hex") $("#inkhex").value = norm;
    if (settings.tool === "erase" || settings.tool === "off") settings.tool = "pen";
    syncUI();
    drawGrid();
    drawInk();
  }

  inkCust.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = inkPick.hidden;
    closeDDs();
    if (open) {
      placePopover(inkCust, inkPick, false, 150);
      setCustomInk(settings.customInk, "");
    } else {
      inkPick.hidden = true;
    }
  });
  inkPick.addEventListener("pointerdown", (e) => e.stopPropagation());
  $("#inkmap").oninput = (e) => setCustomInk(e.target.value, "map");
  $("#inkhex").oninput = (e) => { if (hexToRgb(e.target.value)) setCustomInk(e.target.value, "hex"); };
  $("#inkhex").addEventListener("keydown", (e) => e.stopPropagation());
  panel.addEventListener("pointerdown", (e) => {
    const path = e.composedPath ? e.composedPath() : [e.target];
    if (!path.includes(inkPick) && !path.includes(inkCust)) closeInkPick();
  });
  addEventListener("pointerdown", (e) => {
    const path = e.composedPath ? e.composedPath() : [e.target];
    if (!path.includes(inkPick) && !path.includes(inkCust)) closeInkPick();
  }, true);

  const gridPalette = () => [
    [T.accent, t("cAccent")], [T.accent2, t("cSoft")], ["#8B6373", t("cGrey")], ["#128A5B", t("cGreen")]
  ];

  function syncUI() {
    root.querySelectorAll("[data-tool]").forEach((b) =>
      b.classList.toggle("on", b.dataset.tool === settings.tool));
    root.querySelectorAll("[data-snap]").forEach((b) =>
      b.classList.toggle("on", b.dataset.snap === settings.snapMode));
    root.querySelectorAll(".sw[data-color]").forEach((b) =>
      b.classList.toggle("on", b.dataset.color === settings.inkColor));
    paintCustomSwatch();
    inkCv.classList.toggle("on", settings.tool !== "off");
    $("#gsize").value = settings.gridSpacing;
    $("#w").value = settings.inkWidth;
    $("#wOut").textContent = settings.inkWidth;
    $("#rlen").value = settings.rulerLength;
    $("#zoom").value = Math.round(zoomToSlider(settings.zoom));
    $("#zoomOut").textContent = Math.round(settings.zoom * 100) + "%";
    $("#trule").classList.toggle("on", settings.showRuler);
    $("#tprot").classList.toggle("on", settings.showProtractor);
    $("#penonly").classList.toggle("on", settings.penOnly);
    $("#pressure").classList.toggle("on", settings.pressure);
    const pal = gridPalette();
    $("#gcolor").textContent = (pal.find((p) => p[0] === settings.gridColor) || [null, settings.gridColor])[1];
    $("#uiscale").value = Math.round(settings.uiScale * 100);
    $("#uiOut").textContent = Math.round(settings.uiScale * 100) + "%";
    refreshDDs();
    root.querySelectorAll("[data-theme]").forEach((b) => b.classList.toggle("on", b.dataset.theme === settings.theme));
    root.querySelectorAll("[data-sheet]").forEach((b) => b.classList.toggle("on", b.dataset.sheet === settings.sheet));
    root.querySelectorAll("[data-mode]").forEach((b) =>
      b.classList.toggle("on", b.dataset.mode === settings.mode));
    root.querySelectorAll("[data-ang]").forEach((b) =>
      b.classList.toggle("on", b.dataset.ang === settings.angleUnit));
    root.querySelectorAll("[data-coords]").forEach((b) =>
      b.classList.toggle("on", (b.dataset.coords === "on") === !!settings.coords));
    $("#cstep").value = settings.coordStep;
    root.querySelectorAll("[data-ni]").forEach((b) => b.classList.toggle("on", b.dataset.ni === settings.noteInput));
    if ($("#folder") !== root.activeElement) $("#folder").value = settings.folder;
    $("#psize").value = settings.protRadius;
    settings.showGrid = settings.gridType !== "none";
    save();
  }

  root.querySelectorAll("[data-tool]").forEach((b) =>
    b.onclick = () => { settings.tool = b.dataset.tool; syncUI(); drawGrid(); drawInk(); });
  root.querySelectorAll("[data-snap]").forEach((b) =>
    b.onclick = () => { settings.snapMode = b.dataset.snap; syncUI(); });
  root.querySelectorAll(".sw[data-color]").forEach((b) =>
    b.onclick = () => {
      settings.inkColor = b.dataset.color;
      if (settings.tool === "erase" || settings.tool === "off") settings.tool = "pen";
      syncUI();
      drawGrid();
      drawInk();
    });

  $("#w").oninput = (e) => { settings.inkWidth = +e.target.value; syncUI(); };
  $("#note").onclick = () => { if (settings.tool === "off") { settings.tool = "pen"; syncUI(); drawGrid(); drawInk(); } addNote(); };
  function lastWrittenNote() {
    for (let i = notes.length - 1; i >= 0; i--) if (notes[i].strokes.length) return notes[i];
    return null;
  }
  $("#undo").onclick = () => {
    const n = lastWrittenNote();
    if (n && n.strokes.length) {
      n.strokes.pop();
      n.dirty = true;
      drawGrid();
      return;
    }
    const s = strokes.pop();
    if (s) undone.push(s);
    baseStale = true;
    drawInk();
  };
  $("#redo").onclick = () => { const s = undone.pop(); if (s) { strokes.push(s); bakeStroke(s); } drawInk(); };
  $("#clear").onclick = () => {
    for (let i = strokes.length - 1; i >= 0; i--) undone.push(strokes[i]);
    strokes.length = 0;
    if (undone.length > 60) undone.splice(0, undone.length - 60);
    notes.length = 0;
    renderNotes();
    baseStale = true;
    drawInk();
  };
  $("#save").onclick = exportPng;

  function loadSheet(grid) {
    const sh = sheetFor(grid);
    strokes = sh.strokes; notes = sh.notes; undone = sh.undone; plots = sh.plots;
    baseStale = true;
    renderNotes();
    renderPlots();
    drawGrid();
    drawInk();
  }

  $("#gsize").oninput = (e) => {
    settings.gridSpacing = Math.max(0.05, +e.target.value || 1); drawGrid(); save();
  };
  $("#gcolor").onclick = () => {
    const pal = gridPalette();
    const i = pal.findIndex((p) => p[0] === settings.gridColor);
    settings.gridColor = pal[(i + 1) % pal.length][0];
    syncUI(); drawGrid();
  };
  $("#penonly").onclick = () => { settings.penOnly = !settings.penOnly; syncUI(); };
  $("#pressure").onclick = () => { settings.pressure = !settings.pressure; syncUI(); };

  $("#trule").onclick = () => { settings.showRuler = !settings.showRuler; syncUI(); layoutRuler(); };
  $("#tprot").onclick = () => { settings.showProtractor = !settings.showProtractor; syncUI(); buildProtractor(); };
  $("#angle").oninput = (e) => { ruler.angle = clamp(+e.target.value || 0, -180, 180); layoutRuler(); };
  $("#flat").onclick = () => { ruler.angle = 0; layoutRuler(); };
  $("#rlen").oninput = (e) => { settings.rulerLength = +e.target.value; layoutRuler(); save(); };
  function setZoom(z) {
    settings.zoom = z;
    baseStale = true;
    syncUI(); drawGrid(); drawInk(); layoutRuler();
  }
  $("#zoom").oninput = (e) => setZoom(sliderToZoom(+e.target.value));
  $("#zoom1").onclick = () => setZoom(1);
  $("#close").onclick = () => api.toggle();
  $("#gear").onclick = (e) => {
    panel.classList.toggle("cfg");
    e.currentTarget.classList.toggle("on", panel.classList.contains("cfg"));
    fitPanel();
  };
  $("#uiscale").oninput = (e) => {
    settings.uiScale = +e.target.value / 100;
    applyScale();
    syncUI();
  };
  function dropdown(hostEl, items, get, set, icon) {
    const btn = document.createElement("button");
    btn.className = "ddbtn";
    btn.setAttribute("aria-haspopup", "listbox");
    const list = document.createElement("span");
    list.className = "ddlist";
    list.setAttribute("role", "listbox");
    list.hidden = true;
    hostEl.append(btn, list);

    const label = (it) => (it.label ? it.label : t(it.key));
    const render = () => {
      const cur = items.find((i) => i.value === get()) || items[0];
      btn.innerHTML = (icon ? icon(cur.value, 0) : "") + `<span>${label(cur)}</span>`;
      list.innerHTML = items.map((i, n) =>
        `<button data-v="${i.value}" class="${i.value === get() ? "on" : ""}">` +
        (icon ? icon(i.value, n + 1) : "") + `<span>${label(i)}</span></button>`).join("");
      list.querySelectorAll("[data-v]").forEach((b) => {
        b.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const v = b.dataset.v;
          closeDDs();
          set(v);
        });
      });
    };
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = list.hidden;
      closeDDs();
      closeInkPick();
      if (open) placePopover(btn, list, true);
      else list.hidden = true;
      btn.setAttribute("aria-expanded", String(open));
    });
    const entry = { list, btn, render };
    DDS.push(entry);
    render();
    return entry;
  }

  const pressedInsideDD = (e) => {
    const path = e.composedPath ? e.composedPath() : [e.target];
    return DDS.some((d) => path.includes(d.list) || path.includes(d.btn));
  };
  panel.addEventListener("pointerdown", (e) => { if (!pressedInsideDD(e)) closeDDs(); });
  addEventListener("pointerdown", (e) => { if (!pressedInsideDD(e)) closeDDs(); }, true);

  dropdown($("#gtypedd"), [
    { value: "square", key: "gSquare" }, { value: "dots", key: "gDots" },
    { value: "iso", key: "gIso" }, { value: "polar", key: "gPolar" },
    { value: "none", key: "gNone" }
  ], () => settings.gridType, (v) => {
    settings.gridType = v;
    loadSheet(v);
    if (v === "polar") originPoint();
    syncUI(); drawGrid();
  });

  dropdown($("#unitdd"), [
    { value: "cm", key: "u_cm" }, { value: "in", key: "u_in" }, { value: "px", key: "u_px" }
  ], () => settings.unit, (v) => {
    settings.unit = v;
    settings.gridSpacing = v === "px" ? 40 : v === "in" ? 0.5 : 1;
    syncUI(); drawGrid(); layoutRuler();
  });

  dropdown($("#langdd"), LANGS.map(([value, label]) => ({ value, label })),
    () => settings.lang,
    (v) => { settings.lang = v; applyLang(); syncUI(); layoutRuler(); fitPanel(); },
    (code, n) => FLAGS[code](n));
  root.querySelectorAll("[data-theme]").forEach((b) =>
    b.onclick = () => { applyTheme(b.dataset.theme); repaint(); });
  root.querySelectorAll("[data-sheet]").forEach((b) =>
    b.onclick = () => { settings.sheet = b.dataset.sheet; syncUI(); drawGrid(); });
  root.querySelectorAll("[data-mode]").forEach((b) =>
    b.onclick = () => {
      const entering = b.dataset.mode === "gebra" && settings.mode !== "gebra";
      settings.mode = b.dataset.mode;
      if (entering) settings.coords = true;
      applyMode(); syncUI(); drawGrid(); fitPanel();
    });
  root.querySelectorAll("[data-ang]").forEach((b) =>
    b.onclick = () => { settings.angleUnit = b.dataset.ang; syncUI(); drawGrid(); });
  root.querySelectorAll("[data-coords]").forEach((b) =>
    b.onclick = () => { settings.coords = b.dataset.coords === "on"; syncUI(); drawGrid(); });
  $("#cstep").oninput = (e) => {
    settings.coordStep = clamp(Math.round(+e.target.value || 1), 1, 20);
    drawGrid(); save();
  };
  $("#fxadd").onclick = () => {
    if (addPlot($("#fx").value)) $("#fx").value = "";
  };
  $("#fx").addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter" && addPlot($("#fx").value)) $("#fx").value = "";
  });
  $("#fx").addEventListener("input", () => { $("#fxerr").hidden = true; });

  $("#folder").oninput = (e) => { settings.folder = e.target.value; save(); };
  root.querySelectorAll("[data-ni]").forEach((b) =>
    b.onclick = () => { settings.noteInput = b.dataset.ni; syncUI(); renderNotes(); });
  $("#psize").oninput = (e) => {
    settings.protRadius = +e.target.value;
    protGeom = null;
    buildProtractor(); save();
  };
  $("#center").onclick = () => {
    origin = { x: scrollX + innerWidth / 2, y: scrollY + innerHeight / 2 };
    drawGrid();
  };
  $("#reset").onclick = () => {
    Object.assign(settings, DEFAULTS);
    applyTheme(settings.theme);
    applyLang();
    applyScale();

    repaint();
  };
  $("#fold").onclick = (e) => {
    panel.classList.toggle("folded");
    const folded = panel.classList.contains("folded");
    const btn = e.currentTarget;
    btn.dataset.i18nTitle = folded ? "expand" : "collapse";
    btn.title = t(btn.dataset.i18nTitle);
    if (!folded) fitPanel();
  };

  gesture($("#grab"),
    () => { const r = panel.getBoundingClientRect(); return { x: r.left, y: r.top, angle: 0 }; },
    (s) => {
      const r = panel.getBoundingClientRect();
      panel.style.right = "auto";
      panel.style.left = clamp(s.x, 0, innerWidth - r.width) + "px";
      panel.style.top = clamp(s.y, 0, innerHeight - 44) + "px";
    },
    { rotate: false, skipTags: ["BUTTON"] });

  function exportPng() {
    const dpr = window.devicePixelRatio || 1;
    const out = document.createElement("canvas");
    out.width = gridCv.width; out.height = gridCv.height;
    const c = out.getContext("2d");
    c.fillStyle = T.exportBg;
    c.fillRect(0, 0, out.width, out.height);
    c.drawImage(gridCv, 0, 0);
    c.drawImage(inkCv, 0, 0);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    c.fillStyle = T.stamp;
    c.textAlign = "right";
    c.fillText(t("credit"), innerWidth - 14, innerHeight - 14);
    const name = `awesome-gebra-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "")}.png`;
    const url = out.toDataURL("image/png");
    const fallback = () => {
      const a = document.createElement("a");
      a.download = name;
      a.href = url;
      a.click();
    };
    try {
      chrome.runtime.sendMessage(
        { type: "awesome-gebra:save", url, filename: name, folder: settings.folder },
        (res) => {
          if (chrome.runtime.lastError || !res || !res.ok) fallback();
        });
    } catch (e) {
      fallback();
    }
  }

  const KEY = "awesomeGebra";

  function save() {
    try { chrome.storage?.local.set({ [KEY]: settings }); } catch (e) {}
  }

  function load() {
    return new Promise((res) => {
      try {
        chrome.storage?.local.get(KEY, (d) => {
          const saved = d && d[KEY];
          if (saved) {
            for (const k of Object.keys(DEFAULTS))
              if (saved[k] !== undefined) settings[k] = saved[k];
          }
          res();
        });
      } catch (e) { res(); }
    });
  }

  let raf = null;
  const redraw = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = null; baseStale = true; drawGrid(); drawInk(); layoutNotes(); });
  };
  const dismissPopovers = () => { closeDDs(); closeInkPick(); };
  root.querySelectorAll(".body").forEach((b) =>
    b.addEventListener("scroll", dismissPopovers, { passive: true }));
  addEventListener("scroll", dismissPopovers, { passive: true });
  addEventListener("scroll", redraw, { passive: true });
  addEventListener("resize", () => { dismissPopovers(); resize(); fitPanel(); });
  addEventListener("orientationchange", () => setTimeout(resize, 250));
  if (window.visualViewport) visualViewport.addEventListener("resize", redraw);

  addEventListener("keydown", (e) => {
    if (!visible || !e.altKey || e.ctrlKey || e.metaKey) return;
    const focused = root.activeElement;
    if (focused && /^(INPUT|TEXTAREA)$/.test(focused.tagName)) return;
    const acts = {
      KeyG: () => { settings.gridType = settings.gridType === "none" ? "square" : "none"; syncUI(); drawGrid(); },
      KeyR: () => { settings.showRuler = !settings.showRuler; syncUI(); layoutRuler(); },
      KeyP: () => { settings.showProtractor = !settings.showProtractor; syncUI(); buildProtractor(); },
      KeyD: () => { settings.tool = settings.tool === "off" ? "pen" : "off"; syncUI(); drawGrid(); drawInk(); },
      KeyS: () => {
        const order = ["free", "ruler", "grid"];
        settings.snapMode = order[(order.indexOf(settings.snapMode) + 1) % 3];
        syncUI();
      },
      KeyB: () => { settings.sheet = settings.sheet === "paper" ? "clear" : "paper"; syncUI(); drawGrid(); },
      KeyZ: () => { const s = strokes.pop(); if (s) undone.push(s); baseStale = true; drawInk(); },
      BracketLeft: () => { ruler.angle = norm180(ruler.angle - 1); layoutRuler(); },
      BracketRight: () => { ruler.angle = norm180(ruler.angle + 1); layoutRuler(); }
    };
    if (acts[e.code]) { e.preventDefault(); acts[e.code](); }
  }, true);

  const api = {
    toggle() {
      visible = !visible;
      if (visible) {
        document.documentElement.appendChild(host);
        applyTheme(settings.theme); applyLang(); applyScale(); applyMode();
        loadSheet(settings.gridType);
        resize(); layoutRuler(); buildProtractor(); syncUI(); fitPanel();
      } else {
        abortStroke();
        panPtrs.clear();
        host.remove();
      }
    },
    show() { if (!visible) api.toggle(); },
    stats() {
      return {
        grid: settings.gridType,
        pageStrokes: strokes.length,
        undo: undone.length,
        notes: notes.map((n) => ({ x: Math.round(n.x), y: Math.round(n.y), strokes: n.strokes.length, chars: n.text.length }))
      };
    }
  };
  window.__AWESOME_GEBRA__ = api;

  try {
    chrome.runtime.onMessage.addListener((m) => {
      if (m && m.type === "awesome-gebra:toggle") api.toggle();
    });
  } catch (e) {}

  load().then(() => {
    applyTheme(settings.theme);
    applyLang();
    applyScale();
    applyMode();
    loadSheet(settings.gridType);
    syncUI();
    if (visible) { resize(); layoutRuler(); buildProtractor(); fitPanel(); }
  });
})();
