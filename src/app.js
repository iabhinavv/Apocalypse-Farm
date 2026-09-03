// ---------------------------------------------------------------------------
// Apocalypse Farm -- application shell.
//
// State is three values: acres, state id, and the list of completed step ids.
// Everything on screen is derived from those, so saving and restoring is
// just those three things.
// ---------------------------------------------------------------------------

const SAVE_KEY = 'apocalypse-farm-v1';

const App = {
  acres: 3,
  stateId: null,
  done: [],
  plan: null,
  tab: 'build',
  view: null,
  atlas: null,
  expanded: [],
  // Fixes the look of one farm: which fence style rings it, and which wooden
  // board fronts each area. Saved with the plan, so a farm keeps its fence
  // across reloads, and re-rolled whenever a new farm is started.
  seed: 1,
  auto: { on: false, timer: null, due: 0, paint: null }
};

// --- persistence ----------------------------------------------------------

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      acres: App.acres, stateId: App.stateId, done: App.done, seed: App.seed
    }));
  } catch (e) { /* private window, or storage disabled -- carry on */ }
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !d.stateId) return null;
    return d;
  } catch (e) { return null; }
}

// --- small helpers --------------------------------------------------------

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function $(sel) { return document.querySelector(sel); }

function spriteCanvas(name, scale) {
  const r = name && ATLAS[name];
  if (!r) return null;          // no art for this one yet -- caller draws nothing
  const cv = document.createElement('canvas');
  const s = scale || 2;
  cv.width = r[2] * s; cv.height = r[3] * s;
  const cx = cv.getContext('2d');
  cx.imageSmoothingEnabled = false;
  cx.drawImage(App.atlas, r[0], r[1], r[2], r[3], 0, 0, r[2] * s, r[3] * s);
  return cv;
}

function findCrop(id) {
  for (let i = 0; i < CROPS.length; i++) if (CROPS[i].id === id) return CROPS[i];
  return null;
}

function findAnimal(id) {
  for (let i = 0; i < ANIMALS.length; i++) if (ANIMALS[i].id === id) return ANIMALS[i];
  return null;
}

function allSteps() {
  const out = [];
  App.plan.steps.forEach(function (p) {
    p.steps.forEach(function (s) { out.push(s); });
  });
  return out;
}

// --- progress meters ------------------------------------------------------

const METERS = [
  {
    key: 'food', label: 'Food security', cls: '',
    parts: {
      'kitchen-garden': 15, 'poultry': 10, 'kharif': 20, 'rabi': 14,
      'pulses': 15, 'dairy': 11, 'fish': 5, 'boundary-trees': 10
    }
  },
  {
    key: 'water', label: 'Water', cls: 'sky',
    parts: { 'water-source': 30, 'rainwater': 25, 'drip': 25, 'pond': 20 }
  },
  {
    key: 'energy', label: 'Energy & fuel', cls: 'gold',
    parts: { 'solar-lighting': 28, 'biogas': 42, 'solar-scale': 30 }
  },
  {
    key: 'soil', label: 'Soil health', cls: '',
    parts: {
      'soil-test': 10, 'compost': 30, 'pulses': 20,
      'fodder-plot': 15, 'boundary-trees': 10, 'drip': 15
    }
  },
  {
    key: 'shelter', label: 'Shelter & stores', cls: 'rust',
    parts: {
      'fence': 15, 'house-start': 10, 'house-build': 30,
      'cattle-shed': 15, 'coop': 0, 'storage': 20, 'machinery': 10
    }
  }
];

function meterValue(m) {
  let v = 0;
  Object.keys(m.parts).forEach(function (k) {
    if (App.done.indexOf(k) >= 0) v += m.parts[k];
  });
  return Math.min(100, Math.round(v));
}

// =========================================================================
// the ruler -- how much land this actually is
// =========================================================================

// Drawn in DOM gutters rather than on the canvas, so the numbers stay crisp
// at any zoom. Tick positions are percentages, so they follow the canvas as
// it scales.
function drawRuler(rx, ry, corner, cap, view) {
  const L = view.layout, F = L.fence, m = view.metrics;
  rx.innerHTML = ''; ry.innerHTML = ''; corner.innerHTML = ''; cap.innerHTML = '';

  const stepM = rulerStep(Math.max(m.widthM, m.heightM));

  // the fence occupies only part of the canvas -- the top rows are headroom
  const yTop = (F.y / L.h) * 100;
  const ySpan = (F.h / L.h) * 100;

  for (let d = 0; d <= m.widthM + 0.001; d += stepM) {
    const pct = (d / m.widthM) * 100;
    if (pct > 100.001) break;
    const tick = el('i');
    tick.style.left = pct + '%';
    if (d > 0 && d < m.widthM - stepM * 0.4) {
      const lab = el('span', null, Math.round(d) + '');
      lab.style.left = pct + '%';
      rx.appendChild(lab);
    }
    rx.appendChild(tick);
  }

  for (let d = 0; d <= m.heightM + 0.001; d += stepM) {
    const pct = yTop + (d / m.heightM) * ySpan;
    if (pct > yTop + ySpan + 0.001) break;
    const tick = el('i');
    tick.style.top = pct + '%';
    if (d > 0 && d < m.heightM - stepM * 0.4) {
      const lab = el('span', null, Math.round(d) + '');
      lab.style.top = pct + '%';
      ry.appendChild(lab);
    }
    ry.appendChild(tick);
  }

  corner.textContent = 'm';

  const ha = m.areaM2 / 10000;
  const ls = view.plan.livestock;
  cap.innerHTML =
    '<b>' + Math.round(m.widthM) + ' × ' + Math.round(m.heightM) + ' m</b>' +
    '<span>' + view.plan.acres + ' acres · ' + ha.toFixed(2) + ' ha · ' +
    Math.round(m.areaM2).toLocaleString('en-IN') + ' m² · ' +
    Math.round(m.areaM2 * 10.7639).toLocaleString('en-IN') + ' sq ft</span>' +
    '<span>one tile ≈ ' + m.mPerTile.toFixed(1) + ' m</span>' +
    '<span class="tally">' + ls.dairy + ' cattle · ' + ls.goats + ' goats · ' +
    ls.poultry + ' birds · ' + ls.trees + ' trees' +
    (view.done.indexOf('fish') >= 0 ? ' · fish pond' : '') + '</span>';
}

// A wooden plaque at the top edge of each major area. Positioned as a
// percentage of the canvas so it tracks the map at any zoom, and rendered in
// DOM so the wording stays legible however far out you are.
// Zoom the board in and out. The wheel works over the map itself, anchored on
// the pointer; the buttons step it, and Fit returns to the size that suits the
// window. Quarter steps, so a notch eases rather than doubling the board.
function zoomControls(scroller) {
  const wrap = el('span', 'zoomctl');
  const label = el('span', 'zoomlabel');

  function refresh() {
    if (!App.view) return;
    const z = App.view.scale;
    label.textContent = (z % 1 === 0 ? z : z.toFixed(2).replace(/0$/, '')) + '\u00d7';
    out.disabled = z <= FarmView.ZOOM_MIN + 0.001;
    inn.disabled = z >= FarmView.ZOOM_MAX - 0.001;
  }

  function apply(fn) {
    if (!App.view) return;
    fn();
    const layer = document.querySelector('.signlayer');
    if (layer) drawSigns(layer, App.view);
    refresh();
  }

  const out = el('button', 'zoombtn', '\u2212');
  out.type = 'button';
  out.title = 'Zoom out';
  out.onclick = function () {
    apply(function () { App.view.setZoom(App.view.scale - FarmView.ZOOM_STEP); });
  };

  const inn = el('button', 'zoombtn', '+');
  inn.type = 'button';
  inn.title = 'Zoom in';
  inn.onclick = function () {
    apply(function () { App.view.setZoom(App.view.scale + FarmView.ZOOM_STEP); });
  };

  const fit = el('button', 'zoombtn wide', 'Fit');
  fit.type = 'button';
  fit.title = 'Back to the size that suits the window';
  fit.onclick = function () { apply(function () { App.view.fitZoom(); }); };

  wrap.appendChild(el('span', 'smallcaps', 'zoom'));
  wrap.appendChild(out);
  wrap.appendChild(label);
  wrap.appendChild(inn);
  wrap.appendChild(fit);

  if (scroller) {
    scroller.addEventListener('wheel', function (e) {
      if (!App.view) return;
      // the board is a map panel, so the wheel zooms it rather than scrolling
      // the page past it -- shift+wheel still pans sideways
      if (e.shiftKey) return;
      e.preventDefault();
      // one quarter step per notch, however big a delta the mouse reports --
      // some send 100 per notch and some send 3
      const step = (e.deltaY < 0 ? 1 : -1) * FarmView.ZOOM_STEP;
      apply(function () { App.view.setZoom(App.view.scale + step, e.clientX, e.clientY); });
    }, { passive: false });
  }

  refresh();
  App.zoomRefresh = refresh;
  return wrap;
}

function drawSigns(layer, view) {
  layer.innerHTML = '';
  const L = view.layout;

  (view.signs || []).forEach(function (s) {
    const b = el('button', 'sign');
    b.type = 'button';
    b.textContent = s.label;

    // keep the plaque on the board even when its block hugs an edge
    const pct = Math.max(9, Math.min(91, s.x / L.w * 100));
    b.style.left = pct + '%';
    b.style.top = (s.y / L.h * 100) + '%';

    if (s.tip) {
      b.onmouseenter = function (e) {
        showTip(s.tip + (s.action ? '  ·  click for the guide' : ''), e);
      };
      b.onmousemove = function (e) { moveTip(e); };
      b.onmouseleave = hideTip;
    }

    if (s.action) {
      b.onclick = function (e) {
        e.stopPropagation();
        const a = s.action;
        if (a.type === 'crop') { const c = findCrop(a.id); if (c) openCrop(c); }
        else if (a.type === 'animal') { const an = findAnimal(a.id); if (an) openAnimal(an); }
        else if (a.type === 'step') openStep(a.id);
      };
    } else {
      b.disabled = true;
    }

    layer.appendChild(b);
  });
}

// =========================================================================
// pointer -- hover for a summary, click for the guide
// =========================================================================

function showTip(text, e) {
  const tip = $('#maptip');
  tip.textContent = text;
  tip.classList.add('on');
  moveTip(e);
}

function moveTip(e) {
  const tip = $('#maptip');
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let x = e.clientX + 14, y = e.clientY + 16;
  if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
  if (y + h > window.innerHeight - 8) y = e.clientY - h - 14;
  tip.style.left = Math.max(8, x) + 'px';
  tip.style.top = Math.max(8, y) + 'px';
}

function hideTip() {
  $('#maptip').classList.remove('on');
}

function wireMapPointer(cv, view) {
  const tip = $('#maptip');

  function toCanvas(e) {
    const r = cv.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / (r.width / cv.width),
      y: (e.clientY - r.top) / (r.height / cv.height)
    };
  }

  cv.onmousemove = function (e) {
    const p = toCanvas(e);
    const hit = view.pick(p.x, p.y);
    view.hover = hit;
    cv.style.cursor = hit && hit.action ? 'pointer' : 'default';
    if (!hit) { hideTip(); return; }
    showTip(hit.tip + (hit.action ? '  ·  click for the guide' : ''), e);
  };

  cv.onmouseleave = function () {
    view.hover = null;
    hideTip();
  };

  cv.onclick = function (e) {
    const p = toCanvas(e);
    const hit = view.pick(p.x, p.y);
    if (!hit || !hit.action) return;
    hideTip();
    const a = hit.action;
    if (a.type === 'crop') { const c = findCrop(a.id); if (c) openCrop(c); }
    else if (a.type === 'animal') { const an = findAnimal(a.id); if (an) openAnimal(an); }
    else if (a.type === 'step') openStep(a.id);
  };
}

// a step, opened as a guide panel from the map
function openStep(id) {
  const st = allSteps().filter(function (x) { return x.id === id; })[0];
  if (!st) return;
  const done = App.done.indexOf(st.id) >= 0;
  openDrawer(null, 2, st.title, st.when + ' · ' + st.zone, function (body) {
    const tag = el('div', 'callout ' + (done ? 'good' : ''));
    tag.innerHTML = '<b>' + (done ? 'Done' : 'Not yet done') + '</b><br>' +
      (done ? 'This is standing on your farm.'
            : 'Tick it in the build order and it appears on the map.');
    body.appendChild(tag);

    st.body.filter(Boolean).forEach(function (para) {
      body.appendChild(el('p', null, para));
    });

    if (st.cost) {
      const cl = el('div', 'costline');
      cl.textContent = st.cost.low === 0 && st.cost.high <= 500
        ? 'Cost: free, or a few hundred rupees'
        : 'Cost: ' + rupees(st.cost.low) + ' – ' + rupees(st.cost.high);
      body.appendChild(cl);
    }

    const links = el('div', 'steplinks');
    (st.crops || []).forEach(function (cid) {
      const c = findCrop(cid);
      if (!c) return;
      const b = el('button', 'chip', c.name);
      b.type = 'button';
      b.onclick = function () { openCrop(c); };
      links.appendChild(b);
    });
    (st.animals || []).forEach(function (aid) {
      const a = findAnimal(aid);
      if (!a) return;
      const b = el('button', 'chip', a.name);
      b.type = 'button';
      b.onclick = function () { openAnimal(a); };
      links.appendChild(b);
    });
    if (links.children.length) body.appendChild(links);
  });
}

// =========================================================================
// auto-build -- one step every two minutes
// =========================================================================

const AUTO_MS = 120000;

function nextAutoStep() {
  const steps = allSteps();
  for (let i = 0; i < steps.length; i++) {
    const st = steps[i];
    if (App.done.indexOf(st.id) >= 0) continue;
    if (gateUnmet(st).length) continue;
    return st;
  }
  return null;
}

function autoTick() {
  if (App.auto.paint) App.auto.paint();
  if (Date.now() < App.auto.due) return;
  const st = nextAutoStep();
  if (!st) { stopAuto(); return; }
  App.done = App.done.concat([st.id]);
  App.auto.due = Date.now() + AUTO_MS;
  save();
  const y = window.scrollY;
  renderGame();
  window.scrollTo(0, y);
}

function startAuto() {
  if (App.auto.timer) return;
  App.auto.on = true;
  App.auto.due = Date.now() + AUTO_MS;
  App.auto.timer = setInterval(autoTick, 1000);
  App.auto.last = 0;
}

function stopAuto() {
  App.auto.on = false;
  if (App.auto.timer) clearInterval(App.auto.timer);
  App.auto.timer = null;
}

function autoBar() {
  const bar = el('div', 'autobar');
  const btn = el('button', 'autobtn', App.auto.on ? 'Stop auto-build' : 'Auto-build');
  btn.type = 'button';
  const status = el('span', 'autostatus');
  const left = nextAutoStep();

  function paint() {
    if (!App.auto.on) {
      status.textContent = left
        ? 'builds one step every 2 minutes'
        : 'every step is done';
      return;
    }
    const secs = Math.max(0, Math.ceil((App.auto.due - Date.now()) / 1000));
    const nx = nextAutoStep();
    status.textContent = nx
      ? String(Math.floor(secs / 60)) + ':' + ('0' + (secs % 60)).slice(-2) +
        ' — ' + nx.title.toLowerCase()
      : 'every step is done';
  }

  btn.onclick = function () {
    if (App.auto.on) stopAuto(); else startAuto();
    const y = window.scrollY;
    renderGame();
    window.scrollTo(0, y);
  };
  btn.disabled = !left && !App.auto.on;

  bar.appendChild(btn);
  bar.appendChild(status);
  paint();
  App.auto.paint = paint;
  return bar;
}

// =========================================================================
// setup screen
// =========================================================================

function renderSetup() {
  const root = $('#root');
  const keepScroll = root.querySelector('.setup') ? window.scrollY : 0;
  root.innerHTML = '';
  const wrap = el('div', 'setup');

  const h = el('h2', null, 'Plan your farm');
  const lede = el('p', 'lede');
  lede.textContent =
    'Pick where the land is and how much of it there is. Everything after this — ' +
    'what you plant, in what order, what it costs, how much water and power you ' +
    'need — is worked out from those two answers and the soil that comes with them.';
  wrap.appendChild(h);
  wrap.appendChild(lede);

  // --- state picker ---
  const sp = el('div', 'panel');
  sp.appendChild(el('h3', null, 'Where is the land?'));
  const hint = el('p', 'hint');
  hint.textContent =
    'The tag on each state is the practical question for someone who is not ' +
    'already classified as a farmer: whether you can legally buy there at all.';
  sp.appendChild(hint);

  const regions = ['North', 'West', 'Central', 'South', 'East', 'Northeast'];
  regions.forEach(function (region) {
    const rows = STATES.filter(function (s) { return s.region === region; });
    if (!rows.length) return;
    const rr = el('div', 'regionrow');
    rr.appendChild(el('span', 'smallcaps', region + ' India'));
    const grid = el('div', 'states');
    rows.forEach(function (s) {
      const b = el('button', 'statebtn');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(App.stateId === s.id));
      const nm = el('b', null, s.name);
      const soil = el('small', null,
        s.soils.map(function (x) { return SOILS[x].name; }).join(' · '));
      const tag = el('span', 'tag ' + s.buy, BUY_LABEL[s.buy]);
      b.appendChild(nm); b.appendChild(soil); b.appendChild(tag);
      b.onclick = function () {
        App.stateId = s.id;
        renderSetup();
      };
      grid.appendChild(b);
    });
    rr.appendChild(grid);
    sp.appendChild(rr);
  });
  wrap.appendChild(sp);

  // --- acreage ---
  const ap = el('div', 'panel');
  ap.appendChild(el('h3', null, 'How much land?'));
  const ah = el('p', 'hint');
  ah.textContent =
    'Three acres is the floor: below that an integrated system cannot feed a ' +
    'family and produce its own fodder and fuel. Past roughly fifteen acres this ' +
    'stops being a homestead and becomes a business with a payroll.';
  ap.appendChild(ah);

  const row = el('div', 'acreRow');
  const rng = document.createElement('input');
  rng.type = 'range';
  rng.min = '3'; rng.max = '250'; rng.step = '1';
  rng.value = String(App.acres);
  const big = el('div', 'acreBig', String(App.acres));
  const unit = el('div', 'smallcaps', 'acres');
  rng.oninput = function () {
    App.acres = parseInt(rng.value, 10);
    big.textContent = String(App.acres);
    modelLine.textContent = modelFor(App.acres).label + ' — ' + modelFor(App.acres).people.toLowerCase();
  };
  row.appendChild(rng);
  row.appendChild(big);
  row.appendChild(unit);
  ap.appendChild(row);

  const presets = el('div', 'presets');
  [3, 5, 10, 15, 25, 50, 100, 250].forEach(function (n) {
    const b = el('button', null, n + ' ac');
    b.type = 'button';
    b.onclick = function () {
      App.acres = n; rng.value = String(n); big.textContent = String(n);
      modelLine.textContent = modelFor(n).label + ' — ' + modelFor(n).people.toLowerCase();
    };
    presets.appendChild(b);
  });
  ap.appendChild(presets);

  const modelLine = el('p', 'hint');
  modelLine.style.marginTop = '14px';
  modelLine.style.marginBottom = '0';
  modelLine.textContent = modelFor(App.acres).label + ' — ' + modelFor(App.acres).people.toLowerCase();
  ap.appendChild(modelLine);
  wrap.appendChild(ap);

  const start = el('button', 'bigstart', 'Begin the build');
  start.type = 'button';
  start.disabled = !App.stateId;
  if (!App.stateId) start.textContent = 'Choose a state to begin';
  start.onclick = function () {
    App.done = [];
    App.seed = Math.floor(Math.random() * 100000) + 1;
    startGame();
  };
  wrap.appendChild(start);

  const foot = el('p', 'credit');
  foot.style.maxWidth = '70ch';
  foot.innerHTML =
    'Built on the Integrated Farming System model that ICAR and the Indian ' +
    'agricultural universities promote — crops, livestock, fish and energy looped ' +
    'together so the waste of one becomes the input of the next. Figures are ' +
    'indicative and vary by district. Verify sowing windows, varieties and land ' +
    'law locally before you commit money.';
  wrap.appendChild(foot);

  root.appendChild(wrap);
  window.scrollTo(0, keepScroll);
  $('#ctx').textContent = '';
  $('#reset').style.display = 'none';
}

// =========================================================================
// game screen
// =========================================================================

function startGame() {
  App.plan = buildPlan(App.acres, App.stateId);
  App.plan.seed = App.seed;
  save();
  renderGame();
  window.scrollTo(0, 0);
}

// The zoom, and the signboards sized from it, follow the page width. Rather
// than trust a resize event -- which browser zoom, orientation changes and
// some embedded viewers do not reliably fire -- the frame loop just checks the
// width a couple of times a second. It is a single integer comparison.
let lastPageW = 0;

function refitIfResized() {
  const w = document.body.clientWidth;
  if (!w || Math.abs(w - lastPageW) < 2) return;
  lastPageW = w;
  if (App.refit) App.refit();
}

function watchMapColumn() {
  lastPageW = document.body.clientWidth;
}

function renderGame() {
  const root = $('#root');
  root.innerHTML = '';
  const game = el('div', 'game');

  // --- map column ---
  const mapcol = el('div', 'mapcol');

  // A fixed-height scroller: big farms get a bigger board and you pan around it
  // rather than everything shrinking until the animals are unreadable.
  const scroller = el('div', 'mapscroll');
  const grid = el('div', 'mapgrid');
  const corner = el('div', 'rcorner');
  const rulerX = el('div', 'ruler rx');
  const rulerY = el('div', 'ruler ry');
  const frame = el('div', 'mapframe');
  const cv = document.createElement('canvas');
  const signs = el('div', 'signlayer');
  frame.appendChild(cv);
  frame.appendChild(signs);
  grid.appendChild(corner);
  grid.appendChild(rulerX);
  grid.appendChild(rulerY);
  grid.appendChild(frame);
  scroller.appendChild(grid);
  mapcol.appendChild(scroller);

  const cap = el('div', 'mapcap');
  mapcol.appendChild(cap);

  const info = el('div', 'mapinfo');
  const meters = el('div', 'meters');
  METERS.forEach(function (m) {
    const r = el('div', 'meter');
    r.appendChild(el('span', 'lab', m.label));
    const bar = el('span', 'bar');
    const fill = el('i', m.cls);
    fill.style.width = meterValue(m) + '%';
    bar.appendChild(fill);
    r.appendChild(bar);
    r.appendChild(el('span', 'val', meterValue(m) + '%'));
    meters.appendChild(r);
  });
  info.appendChild(meters);
  const side = el('div', 'side');
  info.appendChild(side);
  mapcol.appendChild(info);

  side.appendChild(autoBar());

  const pending = awaitingArt(App.view ? App.view.features
    : featuresFor(App.plan, layoutFarm(App.plan), App.done));
  if (pending.length) {
    const box = el('div', 'pending');
    box.appendChild(el('div', 'smallcaps', 'shown as survey markers — no sprite yet'));
    const ul = el('div', 'pendinglist');
    pending.forEach(function (label) { ul.appendChild(el('span', 'chip', label)); });
    box.appendChild(ul);
    side.appendChild(box);
  }

  const credit = el('div', 'credit');
  credit.innerHTML =
    'Art: <b>Cute Fantasy</b> (free), <b>Farm RPG FREE 16x16</b>, <b>Super Retro ' +
    'Ranch</b> free tier by <b>Gif</b>, <b>Valley Ruin</b>, <b>Craftpix</b> free ' +
    'plants and summer tileset, line art by <b>macrovector / Freepik</b> ' +
    '(recoloured), and the wooden signboard and fence sheets. All non-commercial. ' +
    'Nothing drawn for this project — a sheep stands in for goats.';
  side.appendChild(credit);
  game.appendChild(mapcol);

  // --- plan column ---
  const plancol = el('div', 'plancol');
  const tabs = el('div', 'tabs');
  [
    ['build', 'Build order'],
    ['land', 'The land'],
    ['crops', 'Crop guides'],
    ['animals', 'Animal guides']
  ].forEach(function (t) {
    const b = el('button', null, t[1]);
    b.type = 'button';
    b.setAttribute('aria-selected', String(App.tab === t[0]));
    b.onclick = function () { App.tab = t[0]; renderGame(); window.scrollTo(0, 0); };
    tabs.appendChild(b);
  });
  plancol.appendChild(tabs);

  const body = el('div', 'tabbody');
  if (App.tab === 'build') renderBuild(body);
  else if (App.tab === 'land') renderLand(body);
  else if (App.tab === 'crops') renderCrops(body);
  else renderAnimals(body);
  plancol.appendChild(body);

  game.appendChild(plancol);
  root.appendChild(game);

  // header context
  const p = App.plan;
  $('#ctx').textContent = p.acres + ' acres · ' + p.state.name + ' · ' + p.primarySoil.name;
  $('#reset').style.display = '';

  // map view
  App.view = new FarmView(cv, App.atlas);
  App.view.setPlan(App.plan, App.done);
  drawRuler(rulerX, rulerY, corner, cap, App.view);
  // after drawRuler: it rewrites the caption's contents
  cap.appendChild(zoomControls(scroller));
  drawSigns(signs, App.view);
  wireMapPointer(cv, App.view);
  watchMapColumn();
}

// --- build order tab ------------------------------------------------------

function renderBuild(body) {
  const p = App.plan;
  const total = allSteps().length;
  const doneCount = allSteps().filter(function (s) { return App.done.indexOf(s.id) >= 0; }).length;

  body.appendChild(el('h3', null, 'The build order'));
  const lede = el('p', 'lede');
  lede.textContent =
    'Tick the box when a step is genuinely done and watch it appear on the land. ' +
    'Click a step\u2019s name to read how. ' + doneCount + ' of ' + total + ' complete.';
  body.appendChild(lede);

  if (p.state.buy !== 'open') {
    const c = el('div', 'callout ' + (p.state.buy === 'closed' ? 'warn' : ''));
    c.innerHTML = '<b>Before anything else — ' + p.state.name + '</b><br>' + p.state.buyNote;
    body.appendChild(c);
  }

  p.steps.forEach(function (phase) {
    const ph = el('div', 'phase');
    const head = el('div', 'phasehead');
    head.appendChild(el('span', 'year', phase.year));
    head.appendChild(el('h4', null, phase.name));
    const n = phase.steps.filter(function (s) { return App.done.indexOf(s.id) >= 0; }).length;
    head.appendChild(el('span', 'count', n + '/' + phase.steps.length));
    ph.appendChild(head);
    ph.appendChild(el('p', 'phaseblurb', phase.blurb));

    // a two-column grid on a wide screen: step 1 left, step 2 right,
    // step 3 back on the left, and so on down the year
    const list = el('div', 'steplist');
    phase.steps.forEach(function (st) {
      list.appendChild(stepCard(st));
    });
    ph.appendChild(list);
    body.appendChild(ph);
  });
}

function gateUnmet(st) {
  if (!st.gate) return [];
  return st.gate.filter(function (g) { return App.done.indexOf(g) < 0; });
}

function stepCard(st) {
  const done = App.done.indexOf(st.id) >= 0;
  const unmet = gateUnmet(st);
  const open = App.expanded.indexOf(st.id) >= 0;
  const card = el('div', 'step' + (done ? ' done' : '') +
    (unmet.length && !done ? ' locked' : '') + (open ? ' open' : ''));

  const head = el('div', 'stephead');

  const tick = el('button', 'tickbox');
  tick.type = 'button';
  tick.textContent = '\u00d7';
  tick.title = done ? 'Mark not done' : 'Mark done';
  tick.setAttribute('aria-pressed', String(done));
  tick.onclick = function (e) {
    e.stopPropagation();
    if (done) App.done = App.done.filter(function (x) { return x !== st.id; });
    else App.done = App.done.concat([st.id]);
    save();
    const y = window.scrollY;
    renderGame();
    window.scrollTo(0, y);
  };

  const title = el('button', 'steptitle');
  title.type = 'button';
  title.setAttribute('aria-expanded', String(open));
  title.appendChild(el('b', null, st.title));
  title.appendChild(el('span', 'meta', st.when + '  ·  ' + st.zone));
  title.onclick = function () {
    App.expanded = open
      ? App.expanded.filter(function (x) { return x !== st.id; })
      : App.expanded.concat([st.id]);
    const y = window.scrollY;
    renderGame();
    window.scrollTo(0, y);
  };

  const caret = el('span', 'caret', open ? '\u2212' : '+');

  head.appendChild(tick);
  head.appendChild(title);
  head.appendChild(caret);
  card.appendChild(head);

  if (!open) return card;

  const b = el('div', 'stepbody');
  st.body.filter(Boolean).forEach(function (para) {
    b.appendChild(el('p', null, para));
  });

  const links = el('div', 'steplinks');
  (st.crops || []).forEach(function (id) {
    const crop = findCrop(id);
    if (!crop) return;
    const c = el('button', 'chip', crop.name);
    c.type = 'button';
    c.onclick = function (e) { e.stopPropagation(); openCrop(crop); };
    links.appendChild(c);
  });
  (st.animals || []).forEach(function (id) {
    const a = findAnimal(id);
    if (!a) return;
    const c = el('button', 'chip', a.name);
    c.type = 'button';
    c.onclick = function (e) { e.stopPropagation(); openAnimal(a); };
    links.appendChild(c);
  });
  if (links.children.length) b.appendChild(links);

  if (st.cost) {
    const cl = el('div', 'costline');
    cl.textContent = st.cost.low === 0 && st.cost.high <= 500
      ? 'Cost: free, or a few hundred rupees'
      : 'Cost: ' + rupees(st.cost.low) + ' \u2013 ' + rupees(st.cost.high);
    b.appendChild(cl);
  }

  if (unmet.length && !done) {
    const g = el('div', 'gatenote');
    const names = unmet.map(function (id) {
      const x = allSteps().filter(function (q) { return q.id === id; })[0];
      return x ? x.title.toLowerCase() : id;
    });
    g.textContent = 'Do this after: ' + names.join(', ');
    b.appendChild(g);
  }

  card.appendChild(b);
  return card;
}

// --- the land tab ---------------------------------------------------------

function renderLand(body) {
  const p = App.plan;
  const s = p.state;

  body.appendChild(el('h3', null, p.acres + ' acres in ' + s.name));
  const lede = el('p', 'lede');
  lede.textContent = p.model.label + '. ' + p.model.people + '. ' + p.model.labour;
  body.appendChild(lede);

  // purchase
  const buy = el('div', 'callout ' + (s.buy === 'closed' ? 'warn' : (s.buy === 'open' ? 'good' : '')));
  buy.innerHTML = '<b>' + BUY_LABEL[s.buy] + '</b><br>' + s.buyNote;
  body.appendChild(buy);
  body.appendChild(el('p', null, s.note));

  // allocation
  body.appendChild(el('h4', null, 'How the land breaks down'));
  const bar = el('div', 'allocbar');
  p.alloc.forEach(function (a) {
    const i = el('i');
    i.style.width = (a.acres / p.acres * 100) + '%';
    i.style.background = a.tint;
    i.title = a.name + ' — ' + acresText(a.acres);
    bar.appendChild(i);
  });
  body.appendChild(bar);

  const t1 = el('table', 'data');
  t1.innerHTML = '<tr><th>Use</th><th>Area</th><th>Share</th></tr>';
  p.alloc.forEach(function (a) {
    const tr = el('tr');
    const td = el('td');
    const sw = el('span');
    sw.style.cssText = 'display:inline-block;width:9px;height:9px;background:' + a.tint + ';margin-right:8px;';
    td.appendChild(sw);
    td.appendChild(document.createTextNode(a.name));
    tr.appendChild(td);
    tr.appendChild(el('td', 'num', acresText(a.acres)));
    tr.appendChild(el('td', 'num', Math.round(a.acres / p.acres * 100) + '%'));
    t1.appendChild(tr);
  });
  body.appendChild(t1);

  // soil
  body.appendChild(el('h4', null, 'The soil you are working with'));
  p.soils.forEach(function (soil) {
    const d = el('div', 'soilnote');
    d.innerHTML = '<b>' + soil.name + '</b> — ' + soil.short;
    body.appendChild(d);
    body.appendChild(el('p', null, soil.long));
    const t = el('table', 'data');
    t.innerHTML =
      '<tr><th>pH</th><td class="num">' + soil.ph + '</td></tr>' +
      '<tr><th>Water holding</th><td class="num">' + soil.holds + '</td></tr>';
    body.appendChild(t);
    body.appendChild(el('p', null, 'Watch for: ' + soil.watch));
    body.appendChild(el('p', null, 'Building it up: ' + soil.build));
  });

  // livestock
  body.appendChild(el('h4', null, 'Livestock at this scale'));
  const t2 = el('table', 'data');
  t2.innerHTML = '<tr><th>Animal</th><th>Number</th></tr>';
  [
    ['Dairy cattle or buffalo', p.livestock.dairy],
    ['Goats', p.livestock.goats],
    ['Backyard poultry', p.livestock.poultry],
    ['Fruit and boundary trees', p.livestock.trees]
  ].forEach(function (r) {
    const tr = el('tr');
    tr.appendChild(el('td', null, r[0]));
    tr.appendChild(el('td', 'num', String(r[1])));
    t2.appendChild(tr);
  });
  const tr = el('tr');
  tr.appendChild(el('td', null, 'Farm pond'));
  tr.appendChild(el('td', 'num', (Math.round(p.livestock.pond * 100) / 100) + ' acre'));
  t2.appendChild(tr);
  body.appendChild(t2);

  // water
  body.appendChild(el('h4', null, 'Water'));
  body.appendChild(el('p', null, p.model.water));
  const w = p.water;
  body.appendChild(el('p', null,
    s.name + ' averages about ' + w.rainMid + ' mm of rain a year. A 100 m² roof ' +
    'harvests roughly ' + w.roofHarvest.toLocaleString('en-IN') + ' litres a year ' +
    'after losses. Your household needs around ' + w.domestic + ' litres a day, ' +
    'which is trivial next to the irrigation budget.'));
  body.appendChild(el('p', null,
    'Irrigation is the real number, and it scales with cropped area rather than ' +
    'total land. Your ' + acresText(w.croppedAcres) + ' of cropped ground needs on ' +
    'the order of ' + w.seasonDemand.toLocaleString('en-IN') + ' m³ a season under ' +
    'flood irrigation, or about ' + w.seasonDemandDrip.toLocaleString('en-IN') +
    ' m³ under drip — a 30–50% saving, with equal or better yields, subsidised ' +
    '50–90% for small and marginal farmers under PMKSY.'));

  // energy
  body.appendChild(el('h4', null, 'Energy and fuel'));
  const e = p.energy;
  body.appendChild(el('p', null,
    'Solar: about ' + e.kwp + ' kWp with ' + e.battery + ' of battery. ' +
    e.profile + ', running around ' + e.load + '. Size for your worst month — ' +
    'least sun, highest demand — not the annual average, and keep an LPG cylinder ' +
    'as cooking backup regardless of scale.'));
  body.appendChild(el('p', null,
    'Biogas: a ' + e.biogas + ' m³ plant. ' + e.biogasNote));

  // budget
  body.appendChild(el('h4', null, 'What it costs'));
  const t3 = el('table', 'data');
  t3.innerHTML = '<tr><th>Item</th><th>Low</th><th>High</th></tr>';
  p.budget.rows.forEach(function (r) {
    const trr = el('tr');
    const td = el('td');
    td.appendChild(el('b', null, r.item));
    const small = el('div');
    small.style.cssText = 'font-size:.8rem;color:var(--ink-faint);';
    small.textContent = r.detail;
    td.appendChild(small);
    trr.appendChild(td);
    trr.appendChild(el('td', 'num', rupees(r.low)));
    trr.appendChild(el('td', 'num', rupees(r.high)));
    t3.appendChild(trr);
  });
  const tot = el('tr', 'total');
  tot.appendChild(el('td', null, 'Setup, excluding land'));
  tot.appendChild(el('td', 'num', rupees(p.budget.setupLow)));
  tot.appendChild(el('td', 'num', rupees(p.budget.setupHigh)));
  t3.appendChild(tot);
  const tot2 = el('tr', 'total');
  tot2.appendChild(el('td', null, 'Everything, including land'));
  tot2.appendChild(el('td', 'num', rupees(p.budget.setupLow + p.budget.landLow)));
  tot2.appendChild(el('td', 'num', rupees(p.budget.setupHigh + p.budget.landHigh)));
  t3.appendChild(tot2);
  body.appendChild(t3);

  const cav = el('div', 'callout warn');
  cav.innerHTML =
    '<b>Treat every number here as indicative</b><br>Land price is the figure with ' +
    'the widest swing in the whole plan — roughly a 150× spread between the ' +
    'cheapest and most expensive farmland in India. Sowing windows, varieties and ' +
    'purchase rules all shift by district and change over time. Confirm with your ' +
    'local Krishi Vigyan Kendra, the state agriculture department, and a lawyer ' +
    'before committing money.';
  body.appendChild(cav);
}

// --- guide indexes --------------------------------------------------------

function renderCrops(body) {
  const p = App.plan;
  body.appendChild(el('h3', null, 'Crop guides'));
  const lede = el('p', 'lede');
  lede.textContent =
    'Every crop carries notes for each soil it is grown on, because the same crop ' +
    'behaves differently on black cotton soil and on leached laterite. Crops suited ' +
    'to ' + p.state.name + ' are listed first.';
  body.appendChild(lede);

  const mine = {};
  ['stapleKharif', 'stapleRabi'].forEach(function (k) {
    if (p.crops[k]) mine[p.crops[k].id] = true;
  });
  ['pulses', 'oilseeds', 'fodder', 'veg', 'fruit', 'cash'].forEach(function (k) {
    (p.crops[k] || []).forEach(function (c) { mine[c.id] = true; });
  });

  const groups = [
    ['Suited to your land', function (c) { return mine[c.id]; }],
    ['Everything else', function (c) { return !mine[c.id]; }]
  ];

  groups.forEach(function (g) {
    const rows = CROPS.filter(g[1]);
    if (!rows.length) return;
    body.appendChild(el('h4', null, g[0]));
    const grid = el('div', 'guidegrid');
    rows.forEach(function (c) {
      const b = el('button', 'guidecard');
      b.type = 'button';
      const cv = spriteCanvas('crop_' + c.sprite + '_3', 1);
      if (cv) b.appendChild(cv);
      const txt = el('div');
      txt.appendChild(el('b', null, c.name));
      txt.appendChild(el('small', null, c.local + ' · ' + c.season));
      b.appendChild(txt);
      b.onclick = function () { openCrop(c); };
      grid.appendChild(b);
    });
    body.appendChild(grid);
  });
}

function renderAnimals(body) {
  body.appendChild(el('h3', null, 'Animal guides'));
  const lede = el('p', 'lede');
  lede.textContent =
    'In an integrated system the animals are the machinery that turns crop residue ' +
    'into fertiliser and fuel. The dung matters as much as the milk.';
  body.appendChild(lede);

  const grid = el('div', 'guidegrid');
  ANIMALS.forEach(function (a) {
    const b = el('button', 'guidecard');
    b.type = 'button';
    const cv = spriteCanvas(a.sprite, 2);
    if (cv) b.appendChild(cv);
    const txt = el('div');
    txt.appendChild(el('b', null, a.name));
    txt.appendChild(el('small', null, a.local));
    b.appendChild(txt);
    b.onclick = function () { openAnimal(a); };
    grid.appendChild(b);
  });
  body.appendChild(grid);
}

// --- drawer ---------------------------------------------------------------

function openDrawer(spriteName, spriteScale, title, local, build) {
  const head = $('#drawerhead');
  head.innerHTML = '';
  const headCv = spriteCanvas(spriteName, spriteScale);
  if (headCv) head.appendChild(headCv);
  const t = el('div');
  t.appendChild(el('h3', null, title));
  if (local) t.appendChild(el('div', 'local', local));
  head.appendChild(t);
  const close = el('button', 'linkbtn close', 'Close');
  close.type = 'button';
  close.style.cssText = 'color:var(--ink);border-color:var(--edge);';
  close.onclick = closeDrawer;
  head.appendChild(close);

  const body = $('#drawerbody');
  body.innerHTML = '';
  body.scrollTop = 0;
  build(body);

  $('#scrim').classList.add('on');
  $('#drawer').classList.add('on');
}

function closeDrawer() {
  $('#scrim').classList.remove('on');
  $('#drawer').classList.remove('on');
}

function fact(body, k, v) {
  if (!v) return;
  const r = el('div', 'factrow');
  r.appendChild(el('div', 'k', k));
  r.appendChild(el('div', null, v));
  body.appendChild(r);
}

function openCrop(c) {
  openDrawer('crop_' + c.sprite + '_3', 2, c.name, c.local + ' · ' + c.cat + ' · ' + c.season,
    function (body) {
      const p = App.plan;
      const relevant = p ? p.state.soils.filter(function (s) { return c.bySoil[s]; }) : [];

      if (relevant.length) {
        relevant.forEach(function (sid) {
          const d = el('div', 'soilnote');
          d.innerHTML = '<b>On ' + SOILS[sid].name.toLowerCase() + ', your soil</b><br>' + c.bySoil[sid];
          body.appendChild(d);
        });
      }

      fact(body, 'Duration', c.duration);
      fact(body, 'Sowing window', c.window);
      fact(body, 'Seed rate', c.seed);
      fact(body, 'Spacing', c.spacing);
      fact(body, 'Land prep', c.prep);
      fact(body, 'Water', c.water);
      fact(body, 'Nutrition', c.feed);
      fact(body, 'Pests & disease', c.pests);
      fact(body, 'Harvest', c.harvest);
      fact(body, 'Yield', c.yield);
      fact(body, 'Rotation', c.rotation);

      const loop = el('div', 'callout good');
      loop.innerHTML = '<b>In the loop</b><br>' + c.loop;
      body.appendChild(loop);

      const others = Object.keys(c.bySoil).filter(function (s) { return relevant.indexOf(s) < 0; });
      if (others.length) {
        body.appendChild(el('h4', null, 'On other soils'));
        others.forEach(function (sid) {
          const d = el('div', 'soilnote');
          d.style.borderLeftColor = 'var(--rule)';
          d.innerHTML = '<b>' + SOILS[sid].name + '</b><br>' + c.bySoil[sid];
          body.appendChild(d);
        });
      }
    });
}

function openAnimal(a) {
  openDrawer(a.sprite, 3, a.name, a.local, function (body) {
    fact(body, 'How many', a.perUnit);
    fact(body, 'Breeds', a.breeds);
    fact(body, 'Housing', a.housing_note);
    fact(body, 'Feed', a.feed);
    fact(body, 'Water', a.water);
    fact(body, 'Breeding', a.breeding);
    fact(body, 'Health', a.health);
    fact(body, 'Output', a.output);
    fact(body, 'Economics', a.econ);

    const loop = el('div', 'callout good');
    loop.innerHTML = '<b>In the loop</b><br>' + a.loop;
    body.appendChild(loop);
  });
}

// =========================================================================
// boot
// =========================================================================

function boot() {
  const img = new Image();
  img.onload = function () {
    App.atlas = img;

    const saved = load();
    if (saved) {
      App.acres = saved.acres;
      App.stateId = saved.stateId;
      App.done = saved.done || [];
      App.seed = saved.seed || 1;
      startGame();
    } else {
      renderSetup();
    }

    let last = performance.now();
    let sinceCheck = 0;
    (function frame(now) {
      const dt = Math.min(64, now - last);
      last = now;
      sinceCheck += dt;
      if (sinceCheck > 400) { sinceCheck = 0; if (App.view) refitIfResized(); }
      if (App.view) App.view.render(dt);
      requestAnimationFrame(frame);
    })(last);
  };
  img.src = ATLAS_SRC;

  $('#scrim').onclick = closeDrawer;
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
  // window.confirm() is suppressed in several embedded viewers -- it returns
  // false and the click silently does nothing. Ask for the second click inline.
  const reset = $('#reset');
  let armed = null;
  reset.onclick = function () {
    if (!armed) {
      reset.textContent = 'Confirm — start over';
      reset.classList.add('arm');
      armed = setTimeout(function () {
        armed = null;
        reset.textContent = 'New plan';
        reset.classList.remove('arm');
      }, 4000);
      return;
    }
    clearTimeout(armed);
    armed = null;
    reset.textContent = 'New plan';
    reset.classList.remove('arm');
    stopAuto();
    App.done = [];
    App.expanded = [];
    App.plan = null;
    App.view = null;
    App.tab = 'build';
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
    renderSetup();
    window.scrollTo(0, 0);
  };
  // Resizing the window can change the zoom, and the signboards are sized in
  // pixels from it -- they have to be redrawn or they end up out of proportion
  // with the map.
  let resizeTimer = null;
  function refit() {
    if (!App.view) return;
    const was = App.view.scale;
    App.view.resize();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!App.view) return;
      const layer = document.querySelector('.signlayer');
      if (layer && App.view.scale !== was) drawSigns(layer, App.view);
      if (App.zoomRefresh) App.zoomRefresh();
    }, 120);
  }
  window.addEventListener('resize', refit);

  App.refit = refit;
}

document.addEventListener('DOMContentLoaded', boot);
