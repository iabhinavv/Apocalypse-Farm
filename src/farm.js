// ---------------------------------------------------------------------------
// The farm map.
//
// A tile grid laid out in the five zones of section 9, sized to the acreage.
// Nothing here knows about the DOM beyond the one canvas it draws into: give
// it a plan and a set of completed step ids and it renders that farm.
//
// Sprites are drawn anchored bottom-centre on their tile, so a tall sprite
// (a house, a mature crop) overhangs upward the way it should. The grid keeps
// PAD_TOP rows of headroom above the fence for exactly that reason, and a
// two-tile planting ring inside the fence so boundary trees never overhang the
// cropped blocks.
// ---------------------------------------------------------------------------

const TILE = 16;
const PAD_TOP = 3;          // headroom rows above the fence, for tall sprites
const RING = 2;             // boundary planting ring inside the fence
const GROW_MS = 260;        // per crop growth stage

function cropSprite(crop) {
  return crop && crop.sprite ? crop.sprite : 'berry';
}

// Stable hash per tile, 0..1. A plain modulo pattern reads as a checkerboard
// at any zoom, which is exactly what grass must not do.
function tileHash(x, y) {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

// ---------------------------------------------------------------------------
// layout
// ---------------------------------------------------------------------------

function layoutFarm(plan) {
  // Deliberately NOT to scale -- 6 acres is not twice the size of 3 on screen.
  // The grid grows just enough that animals, buildings and crop rows never look
  // jammed, and the ruler carries the real dimensions instead.
  //
  // Width grows far faster than height on purpose: a large farm becomes a wide
  // board you pan across sideways, rather than a tall one that pushes the
  // meters and the build order off the bottom of the screen.
  const t = Math.log(plan.acres / 3) / Math.log(250 / 3);      // 0 .. 1
  const w = Math.round(34 + 46 * t);
  const farmH = Math.round(26 + 10 * t);
  const h = farmH + PAD_TOP;

  const fence = { x: 0, y: PAD_TOP, w: w, h: farmH };

  const ix = fence.x + RING + 1;
  const iy = fence.y + RING + 1;
  const iw = fence.w - 2 * (RING + 1);
  const ih = fence.h - 2 * (RING + 1);

  const leftW = Math.floor(iw * 0.42);
  const rightX = ix + leftW + 2;
  const rightW = iw - leftW - 2;

  // left column: homestead, then animals, then pond
  const homeH = Math.floor(ih * 0.42);
  const animH = Math.floor(ih * 0.30);
  const pondH = ih - homeH - animH - 2;

  // right column: field blocks in proportion to the land allocation
  const shares = {
    cereal: plan.scale.grain,
    fodder: plan.scale.fodder,
    pulses: plan.acres * 0.12
  };
  const total = shares.cereal + shares.fodder + shares.pulses;
  const usable = ih - 2;
  let cerealH = Math.max(3, Math.round(usable * shares.cereal / total));
  let fodderH = Math.max(3, Math.round(usable * shares.fodder / total));
  let pulsesH = Math.max(3, usable - cerealH - fodderH);
  const over = (cerealH + fodderH + pulsesH) - usable;
  if (over > 0) cerealH = Math.max(3, cerealH - over);

  return {
    w: w, h: h, fence: fence,
    blocks: {
      home: { x: ix, y: iy, w: leftW, h: homeH },
      animals: { x: ix, y: iy + homeH + 1, w: leftW, h: animH },
      pond: { x: ix, y: iy + homeH + animH + 2, w: leftW, h: pondH },
      cereal: { x: rightX, y: iy, w: rightW, h: cerealH },
      fodder: { x: rightX, y: iy + cerealH + 1, w: rightW, h: fodderH },
      pulses: { x: rightX, y: iy + cerealH + fodderH + 2, w: rightW, h: pulsesH }
    }
  };
}

// The real-world size of the plot, so the ruler can be honest. The map keeps
// the grid's aspect ratio, so both axes come out at the same metres per tile.
function farmMetrics(plan, L) {
  const areaM2 = plan.acres * 4046.856;
  const aspect = L.fence.w / L.fence.h;
  const heightM = Math.sqrt(areaM2 / aspect);
  const widthM = aspect * heightM;
  return {
    areaM2: areaM2,
    widthM: widthM,
    heightM: heightM,
    mPerTile: widthM / L.fence.w
  };
}

// the round number closest to eight divisions along the edge
function rulerStep(lengthM) {
  const nice = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];
  const want = lengthM / 8;
  let best = nice[0];
  for (let i = 1; i < nice.length; i++) {
    if (Math.abs(nice[i] - want) < Math.abs(best - want)) best = nice[i];
  }
  return best;
}

// ---------------------------------------------------------------------------
// what is standing on the farm, given which steps are done
// ---------------------------------------------------------------------------

// the kitchen garden occupies the bottom strip of the homestead block
function gardenRect(L) {
  const B = L.blocks;
  return {
    x: B.home.x,
    y: B.home.y + B.home.h - 2,
    w: Math.max(4, B.home.w - 3),
    h: 2
  };
}

// spread n items evenly across a rect, so a herd never bunches into a corner
function spread(rect, n, cb) {
  if (n <= 0) return;
  const cols = Math.max(1, Math.min(n, Math.floor(rect.w / 2)));
  const rows = Math.max(1, Math.ceil(n / cols));
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const x = rect.x + Math.round((c + 0.5) * rect.w / cols) - 1;
    const y = rect.y + Math.round((r + 0.5) * rect.h / rows) - 1;
    cb(Math.max(rect.x, Math.min(rect.x + rect.w - 1, x)),
       Math.max(rect.y, Math.min(rect.y + rect.h - 1, y)), i);
  }
}

// At most this many of any one species on screen -- a 250-acre farm has 1,750
// birds and drawing them would be nonsense. The signboard carries the real count.
const MAX_ON_SCREEN = 10;

// which orchard sprite suits the fruit this state actually grows
function orchardSprite(plan, i) {
  const ids = (plan.crops.fruit || []).map(function (c) { return c.id; });
  const options = [];
  if (ids.indexOf('coconut') >= 0) options.push('palm');
  if (ids.indexOf('banana') >= 0) options.push('banana_tree');
  if (ids.indexOf('apple') >= 0) options.push('fruit_apple');
  if (ids.indexOf('lemon') >= 0) options.push('fruit_lemon');
  if (ids.indexOf('mango') >= 0) options.push('fruit_plum');
  if (ids.indexOf('guava') >= 0) options.push('leafy_tree');
  if (!options.length) options.push('fruit_apple', 'leafy_tree');
  return options[i % options.length];
}

function featuresFor(plan, L, done) {
  const B = L.blocks;
  const f = [];
  const has = function (id) { return done.indexOf(id) >= 0; };

  const put = function (x, y, sprite, kind, tip, action) {
    f.push({ x: x, y: y, sprite: sprite, kind: kind || 'prop', tip: tip, action: action });
  };
  // No pack carries the off-grid infrastructure, goats, bees or fish. Rather
  // than invent them, the step plants a surveyor's marker where the thing goes
  // and the interface lists what is outstanding.
  const mark = function (x, y, label, stepId, note) {
    f.push({
      x: x, y: y, sprite: 'signpost', kind: 'marker', awaiting: label,
      tip: label + (note ? ' — ' + note : '') + ' · no sprite in the packs yet',
      action: stepId ? { type: 'step', id: stepId } : null
    });
  };

  const ls = plan.livestock;
  const e = plan.energy;

  // --- homestead ---------------------------------------------------------
  const hx = B.home.x, hy = B.home.y, hw = B.home.w, hh = B.home.h;
  const bottom = hy + hh - 1;

  if (has('house-build')) {
    // anchored high enough that the tall sprite overhangs the fence rather
    // than clipping off the top of the canvas
    put(hx + 3, hy + 4, 'farmhouse', 'building',
      'Farmhouse — sited high, long axis east-west, deep veranda south and west',
      { type: 'step', id: 'house-build' });
    put(hx + 6, hy + 4, 'lantern', 'prop', 'Yard light', null);
  }

  if (has('soil-test')) {
    put(hx + hw - 1, hy, 'signpost', 'prop',
      'Soil test marker — ' + plan.primarySoil.name + ', pH ' + plan.primarySoil.ph,
      { type: 'step', id: 'soil-test' });
  }
  if (has('storage')) {
    put(hx, hy, 'chest', 'prop', 'Grain store — dried to 12% before binning',
      { type: 'step', id: 'storage' });
    put(hx + 2, hy, 'crate_grain', 'prop',
      'Grain crates — post-harvest loss runs 8–10% and almost all of it is avoidable',
      { type: 'step', id: 'storage' });
  }
  if (has('water-source')) {
    put(hx + hw - 3, hy + 1, 'well', 'building',
      'Well — household draw ' + plan.water.domestic + ' litres a day; check the ' +
      'block groundwater category before drilling',
      { type: 'step', id: 'water-source' });
    put(hx + hw - 5, hy + 2, 'barrel_big', 'prop',
      'Water butt — rooftop harvest, about ' +
      plan.water.roofHarvest.toLocaleString('en-IN') + ' litres a year off a 100 m² roof',
      { type: 'step', id: 'rainwater' });
  }
  if (has('machinery')) {
    const big = plan.acres >= 15;
    put(hx + 5, hy + 3, big ? 'tractor' : 'cart', 'building',
      (big ? 'Tractor — worth owning above about 15 acres'
           : 'Power tiller and cart — or a pair of bullocks at ₹40,000–80,000'),
      { type: 'step', id: 'machinery' });
  }
  if (has('solar-lighting') || has('solar-scale')) {
    mark(hx + 1, bottom - 2, 'Solar panel array', 'solar-scale',
      e.kwp + ' kWp, ' + e.battery + ' battery');
  }
  if (has('biogas')) {
    mark(hx + hw - 3, bottom - 2, 'Biogas plant (fixed dome)', 'biogas',
      e.biogas + ' m³, fed on ' + Math.round(ls.dairy * 12) + ' kg of dung a day');
  }
  if (has('compost')) {
    put(hx + hw - 2, bottom - 1, 'crate_green', 'prop',
      'Compost bay — crop residue, weeds and kitchen waste, turned every 3 weeks',
      { type: 'step', id: 'compost' });
    put(hx + hw - 1, bottom, 'crate_dark', 'prop',
      'Vermicompost bed — Eisenia fetida worms in pre-decomposed material',
      { type: 'step', id: 'compost' });
  }

  // --- animals -----------------------------------------------------------
  const ax = B.animals.x, ay = B.animals.y, aw = B.animals.w, ah = B.animals.h;

  // the yard is split into three lanes so the species do not tangle
  const laneH = Math.max(1, Math.floor(ah / 3));
  const poultryLane = { x: ax + 3, y: ay, w: aw - 4, h: laneH };
  const cattleLane = { x: ax + 3, y: ay + laneH, w: aw - 4, h: laneH };
  const goatLane = { x: ax + 3, y: ay + 2 * laneH, w: aw - 4, h: ah - 2 * laneH };

  if (has('poultry')) {
    mark(ax + 1, ay + 1, 'Poultry coop', 'poultry', '3 sq ft a bird, raised, shut at night');
    const shown = Math.min(MAX_ON_SCREEN, ls.poultry);
    const tip = 'Backyard poultry — ' + ls.poultry + ' birds, 100–150 eggs each a year' +
      (ls.poultry > shown ? ' (' + shown + ' of ' + ls.poultry + ' drawn)' : '');
    spread(poultryLane, shown, function (x, y, i) {
      put(x, y, i % 5 === 4 ? 'chick_0' : (i % 2 ? 'hen_0' : 'hen2_0'), 'animal',
        tip, { type: 'animal', id: 'poultry' });
    });
  }
  if (has('cattle-shed')) {
    // anchored on the block's bottom row: the sprite is five tiles tall and
    // reaches up into the kitchen garden from anywhere higher
    put(ax + 1, ay + ah - 1, 'barn', 'building',
      'Cattle shed — 12 sq m an animal, floor sloped to a covered drain',
      { type: 'step', id: 'cattle-shed' });
  }
  if (has('dairy') || has('dairy-2')) {
    const herd = has('dairy-2') ? ls.dairy : 1;
    const shown = Math.min(MAX_ON_SCREEN, herd);
    const tip = 'Dairy cattle — ' + ls.dairy + ' head, ' + acresText(plan.scale.fodder) +
      ' of fodder feeds them' + (herd > shown ? ' (' + shown + ' of ' + herd + ' drawn)' : '');
    spread(cattleLane, shown, function (x, y, i) {
      put(x, y, i % 4 === 3 ? 'bull_0' : 'cow_0', 'animal', tip,
        { type: 'animal', id: 'cattle' });
    });
  }
  if (has('goats')) {
    mark(ax + 1, ay + ah - 1, 'Goat pen', 'goats', 'raised slatted floor, 1 sq m an adult');
    const shown = Math.min(MAX_ON_SCREEN, ls.goats);
    const tip = 'Goats — ' + ls.goats + ' head, browsers not grazers. Shown as a sheep: ' +
      'no pack here has a goat sprite' +
      (ls.goats > shown ? ' (' + shown + ' of ' + ls.goats + ' drawn)' : '');
    spread(goatLane, shown, function (x, y) {
      put(x, y, 'sheep_0', 'animal', tip, { type: 'animal', id: 'goat' });
    });
  }
  if (has('bees')) {
    const tip = 'Beehives — 2–4 colonies of Apis cerana indica; pollination lifts ' +
      'yield 20–40% across the whole farm';
    put(ax + aw - 2, ay, 'hive', 'building', tip, { type: 'animal', id: 'bees' });
    put(ax + aw - 4, ay, 'hive', 'building', tip, { type: 'animal', id: 'bees' });
    put(ax + aw - 3, ay - 1, 'bee', 'prop', tip, { type: 'animal', id: 'bees' });
  }
  if (has('labour')) {
    put(ax + aw - 3, ay + ah - 1, 'cottage', 'building',
      'Worker quarters — ' + plan.model.people.toLowerCase(),
      { type: 'step', id: 'labour' });
  }

  // --- pond --------------------------------------------------------------
  const p = B.pond;
  if (has('pond')) {
    for (let x = p.x + 1; x < p.x + p.w - 1; x += 3) {
      put(x, p.y, 'reeds', 'prop', 'Pond bank', { type: 'step', id: 'pond' });
      put(x + 1, p.y + p.h - 1, 'reeds', 'prop', 'Pond bank', { type: 'step', id: 'pond' });
    }
    const by = p.y + Math.floor(p.h / 2);
    put(p.x + 1, by, 'bridge_l', 'prop', 'Plank crossing', { type: 'step', id: 'pond' });
    put(p.x + 2, by, 'bridge_m', 'prop', 'Plank crossing', { type: 'step', id: 'pond' });
    put(p.x + 3, by, 'bridge_r', 'prop', 'Plank crossing', { type: 'step', id: 'pond' });
  }
  if (has('fish')) {
    mark(p.x + p.w - 2, p.y + 1, 'Fish', 'fish',
      'catla, rohu and mrigal at 4:3:3, ~4,000 fingerlings an acre');
  }

  return f;
}

// A plaque for each major area, positioned in tile coordinates at the top edge
// of its block. The interface renders these as DOM labels over the canvas so
// the wording stays crisp at any zoom.
function zoneSigns(plan, L, done) {
  const B = L.blocks, c = plan.crops, ls = plan.livestock;
  const has = function (id) { return done.indexOf(id) >= 0; };
  const nm = function (x) { return x ? x.name : null; };
  const out = [];
  // The board shows the section name and nothing else. Its size, crop and
  // counts are one hover away, and the tally line under the map carries the
  // livestock totals.
  const sign = function (rect, label, tip, action) {
    out.push({
      x: rect.x + rect.w / 2, y: rect.y, label: label, tip: tip, action: action
    });
  };

  if (has('zones')) {
    sign(B.home, 'Homestead', acresText(plan.acres * 0.08) + ' with sheds and paths',
      { type: 'step', id: 'zones' });
    sign(B.animals, 'Animal yard',
      ls.dairy + ' cattle · ' + ls.goats + ' goats · ' + ls.poultry + ' birds',
      { type: 'animal', id: 'cattle' });
  }
  if (has('kharif') || has('rabi')) {
    const crop = has('rabi') && c.stapleRabi ? c.stapleRabi : c.stapleKharif;
    sign(B.cereal, nm(crop) || 'Cereal', acresText(plan.scale.grain) + ' of staple grain',
      crop ? { type: 'crop', id: crop.id } : null);
  }
  if (has('fodder-plot')) {
    sign(B.fodder, 'Fodder', acresText(plan.scale.fodder) + ' of ' +
      (nm(c.fodder[0]) || 'napier') + ', about 0.25 acre an animal',
      c.fodder[0] ? { type: 'crop', id: c.fodder[0].id } : null);
  }
  if (has('pulses')) {
    sign(B.pulses, 'Pulses & oilseeds', acresText(plan.acres * 0.12) + ' of ' +
      [nm(c.pulses[0]), nm(c.oilseeds[0])].filter(Boolean).join(' and '),
      c.pulses[0] ? { type: 'crop', id: c.pulses[0].id } : null);
  }
  if (has('pond')) {
    sign(B.pond, 'Farm pond', acresText(ls.pond) +
      (has('fish') ? ' · carp polyculture' : ' · irrigation buffer'),
      { type: 'step', id: 'pond' });
  }
  if (has('kitchen-garden')) {
    const g = gardenRect(L);
    sign(g, 'Kitchen garden', acresText(plan.scale.veg) + ' of raised beds, sown in succession',
      c.veg[0] ? { type: 'crop', id: c.veg[0].id } : null);
  }
  if (has('boundary-trees')) {
    sign({ x: L.fence.x + 2, y: L.fence.y + 1, w: 6, h: 1 }, 'Orchard',
      ls.trees + ' trees on ' + acresText(plan.acres * 0.10) +
      ', planted on the edge so they cost no cropping land',
      c.fruit[0] ? { type: 'crop', id: c.fruit[0].id } : null);
  }
  return out;
}

// distinct labels for everything the packs cannot draw yet
function awaitingArt(features) {
  const seen = [];
  features.forEach(function (o) {
    if (o.awaiting && seen.indexOf(o.awaiting) < 0) seen.push(o.awaiting);
  });
  return seen;
}

// ---------------------------------------------------------------------------
// crop plantings
// ---------------------------------------------------------------------------

function plantingsFor(plan, L, done) {
  const B = L.blocks;
  const out = [];
  const has = function (id) { return done.indexOf(id) >= 0; };
  const c = plan.crops;

  function sow(block, crops, acres, label) {
    // a field block can only carry crops that have growth frames -- tree crops
    // belong on the boundary, never sown in rows
    crops = (crops || []).filter(function (x) {
      return x && ATLAS['crop_' + cropSprite(x) + '_3'];
    });
    if (!crops.length) return;
    for (let y = block.y; y < block.y + block.h; y++) {
      for (let x = block.x; x < block.x + block.w; x++) {
        const crop = crops[(x * 3 + y * 5) % crops.length];
        out.push({
          x: x, y: y, sprite: cropSprite(crop), seed: (x * 31 + y * 17) % 97,
          crop: crop, acres: acres, label: label
        });
      }
    }
  }

  if (has('kharif') || has('rabi')) {
    const crop = has('rabi') && c.stapleRabi ? c.stapleRabi : c.stapleKharif;
    sow(B.cereal, [crop], plan.scale.grain, 'Cereal block');
  }
  if (has('fodder-plot')) {
    sow(B.fodder, c.fodder.length ? c.fodder : [{ sprite: 'tallgrass' }],
      plan.scale.fodder, 'Fodder plot');
  }
  if (has('pulses')) {
    sow(B.pulses, c.pulses.concat(c.oilseeds), plan.acres * 0.12, 'Pulses & oilseeds');
  }
  if (has('kitchen-garden')) {
    sow(gardenRect(L), c.veg.length ? c.veg : [{ sprite: 'lettuce' }],
      plan.scale.veg, 'Kitchen garden');
  }
  return out;
}

// tiles that should be drawn as tilled soil rather than grass
function fieldRects(plan, L, done) {
  const B = L.blocks;
  const has = function (id) { return done.indexOf(id) >= 0; };
  const r = [];
  if (has('kharif') || has('rabi')) r.push({ rect: B.cereal, wet: has('drip') });
  if (has('pulses')) r.push({ rect: B.pulses, wet: has('drip') });
  if (has('kitchen-garden')) r.push({ rect: gardenRect(L), wet: has('drip') });
  return r;
}

// ---------------------------------------------------------------------------
// renderer
// ---------------------------------------------------------------------------

function FarmView(canvas, atlasImage) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.img = atlasImage;
  this.plan = null;
  this.done = [];
  this.scale = 2;
  this.t = 0;
  this.plantedAt = {};
  this.targets = [];
  this.farmer = { x: 6, y: 6, tx: 6, ty: 6, face: 'd', act: 'idle', frame: 0, wait: 0 };
  this.ctx.imageSmoothingEnabled = false;
}

FarmView.prototype.draw = function (name, px, py) {
  const r = ATLAS[name];
  if (!r) return;
  this.ctx.drawImage(this.img, r[0], r[1], r[2], r[3],
    Math.round(px), Math.round(py), r[2], r[3]);
};

// bottom-centre anchored on a tile
FarmView.prototype.spriteBox = function (name, tx, ty) {
  const r = ATLAS[name];
  if (!r) return null;
  return {
    x: tx * TILE + TILE / 2 - r[2] / 2,
    y: (ty + 1) * TILE - r[3],
    w: r[2], h: r[3]
  };
};

FarmView.prototype.drawOn = function (name, tx, ty) {
  const b = this.spriteBox(name, tx, ty);
  if (b) this.draw(name, b.x, b.y);
};

FarmView.prototype.setPlan = function (plan, done) {
  const fresh = !this.plan || this.plan.acres !== plan.acres ||
    this.plan.state.id !== plan.state.id;
  this.plan = plan;
  this.done = done || [];
  this.layout = layoutFarm(plan);
  this.metrics = farmMetrics(plan, this.layout);
  if (fresh) {
    this.plantedAt = {};
    this.farmer.x = this.farmer.tx = this.layout.blocks.home.x + 4;
    this.farmer.y = this.farmer.ty = this.layout.blocks.home.y + 6;
  }
  this.features = featuresFor(plan, this.layout, this.done);
  this.plantings = plantingsFor(plan, this.layout, this.done);
  this.fields = fieldRects(plan, this.layout, this.done);
  this.signs = zoneSigns(plan, this.layout, this.done);

  const now = performance.now();
  const self = this;
  this.plantings.forEach(function (p) {
    const k = p.x + ',' + p.y + ',' + p.sprite;
    if (!(k in self.plantedAt)) self.plantedAt[k] = now + p.seed * 4;
  });

  this.buildTargets();
  this.resize();
};

// ---------------------------------------------------------------------------
// hit testing -- what the pointer is over
// ---------------------------------------------------------------------------

FarmView.prototype.buildTargets = function () {
  const L = this.layout, B = L.blocks, plan = this.plan;
  const done = this.done;
  const has = function (id) { return done.indexOf(id) >= 0; };
  const t = [];
  const rect = function (r, tip, action) {
    t.push({
      x: r.x * TILE, y: r.y * TILE, w: r.w * TILE, h: r.h * TILE,
      tip: tip, action: action
    });
  };

  // zone-sized targets go in first, so anything standing on them wins
  const c = plan.crops;
  const nm = function (x) { return x ? x.name : '—'; };

  rect(B.home, 'Homestead — house, kitchen garden, energy and compost · ' +
    acresText(plan.acres * 0.08) + ' with sheds and paths',
    { type: 'step', id: 'zones' });
  rect(B.animals, 'Animal yard — ' + plan.livestock.dairy + ' cattle, ' +
    plan.livestock.goats + ' goats, ' + plan.livestock.poultry + ' birds',
    { type: 'animal', id: 'cattle' });

  if (has('pond')) {
    rect(B.pond, 'Farm pond — ' + acresText(plan.livestock.pond) +
      ' · irrigation buffer, groundwater recharge and fish',
      { type: 'step', id: 'pond' });
  }
  if (has('kharif') || has('rabi')) {
    const crop = has('rabi') && c.stapleRabi ? c.stapleRabi : c.stapleKharif;
    rect(B.cereal, 'Cereal block — ' + nm(crop) + ' · ' + acresText(plan.scale.grain) +
      ' on ' + plan.primarySoil.name.toLowerCase(),
      crop ? { type: 'crop', id: crop.id } : null);
  }
  if (has('fodder-plot')) {
    rect(B.fodder, 'Fodder plot — ' + nm(c.fodder[0]) + ' · ' +
      acresText(plan.scale.fodder) + ' · about 0.25 acre an animal',
      c.fodder[0] ? { type: 'crop', id: c.fodder[0].id } : null);
  }
  if (has('pulses')) {
    rect(B.pulses, 'Pulses & oilseeds — ' + nm(c.pulses[0]) + ', ' + nm(c.oilseeds[0]) +
      ' · ' + acresText(plan.acres * 0.12),
      c.pulses[0] ? { type: 'crop', id: c.pulses[0].id } : null);
  }
  if (has('kitchen-garden')) {
    rect(gardenRect(L), 'Kitchen garden — ' + acresText(plan.scale.veg) +
      ' of raised beds, sown in succession',
      c.veg[0] ? { type: 'crop', id: c.veg[0].id } : null);
  }

  // individual crop tiles
  const self = this;
  this.plantings.forEach(function (p) {
    const b = self.spriteBox('crop_' + p.sprite + '_3', p.x, p.y);
    if (!b) return;
    t.push({
      x: b.x, y: b.y, w: b.w, h: b.h,
      tip: p.crop && p.crop.name
        ? p.crop.name + ' — ' + (p.crop.season || '') + ' ' + (p.crop.cat || '') +
          ' · ' + p.label + ', ' + acresText(p.acres)
        : p.label,
      action: p.crop && p.crop.id ? { type: 'crop', id: p.crop.id } : null
    });
  });

  // boundary trees
  if (has('boundary-trees')) {
    const tip = 'Boundary orchard — ' +
      plan.crops.fruit.slice(0, 3).map(function (x) { return x.name; }).join(', ') +
      ' · ' + plan.livestock.trees + ' trees on ' + acresText(plan.acres * 0.10) +
      ', planted on the edge so they cost no cropping land';
    const act = plan.crops.fruit[0] ? { type: 'crop', id: plan.crops.fruit[0].id } : null;
    this.treeSpots().forEach(function (s) {
      const b = self.spriteBox(s.sprite, s.x, s.y);
      if (b) t.push({ x: b.x, y: b.y, w: b.w, h: b.h, tip: tip, action: act });
    });
  }

  // everything standing on the farm
  this.features.forEach(function (o) {
    const b = self.spriteBox(o.sprite, o.x, o.y);
    if (b && o.tip) t.push({ x: b.x, y: b.y, w: b.w, h: b.h, tip: o.tip, action: o.action });
  });

  this.targets = t;
};

// stable list of boundary planting positions, shared by render and hit-testing
FarmView.prototype.treeSpots = function () {
  const L = this.layout, F = L.fence;
  const out = [];
  const plan = this.plan;
  let n = 0;
  const pick = function (h) {
    // mostly the fruit this state actually grows, with a few plain trees between
    if (h > 0.30) return orchardSprite(plan, n++);
    return h > 0.15 ? 'tree_small' : 'sapling';
  };
  const top = F.y + 1, bot = F.y + F.h - 2;
  for (let x = 2; x < F.w - 2; x += 4) {
    out.push({ x: x, y: top, sprite: pick(tileHash(x, 1)) });
    // short sprites only along the bottom, so nothing overhangs the fields
    out.push({ x: x + 1, y: bot, sprite: tileHash(x, 55) > 0.5 ? 'tree_small' : 'sapling' });
  }
  for (let y = top + 3; y < bot - 2; y += 4) {
    out.push({ x: 1, y: y, sprite: pick(tileHash(1, y)) });
    out.push({ x: F.w - 2, y: y, sprite: pick(tileHash(88, y)) });
  }
  return out;
};

// canvas pixel -> topmost target
FarmView.prototype.pick = function (px, py) {
  for (let i = this.targets.length - 1; i >= 0; i--) {
    const o = this.targets[i];
    if (px >= o.x && px < o.x + o.w && py >= o.y && py < o.y + o.h) return o;
  }
  return null;
};

FarmView.prototype.resize = function () {
  if (!this.layout) return;
  // measure the scroll viewport, not the frame, which sizes to its content
  let host = this.canvas.parentElement;
  while (host && host.className.indexOf('mapscroll') < 0) host = host.parentElement;
  const box = (host || this.canvas.parentElement).getBoundingClientRect();

  const wpx = this.layout.w * TILE;
  const hpx = this.layout.h * TILE;
  const avail = Math.max(180, box.width - 34);        // less the ruler gutter
  const fit = avail / wpx;

  // Never shrink below 1: a big farm gets a bigger board that you pan around,
  // instead of everything scaling down until the animals are unreadable. Whole
  // numbers only, because a half-pixel upscale makes the art wobble.
  this.scale = fit >= 2 ? Math.min(3, Math.floor(fit)) : 1;

  this.canvas.width = wpx;
  this.canvas.height = hpx;
  this.canvas.style.width = Math.round(wpx * this.scale) + 'px';
  this.canvas.style.height = Math.round(hpx * this.scale) + 'px';
  this.ctx.imageSmoothingEnabled = false;
};

// --- terrain --------------------------------------------------------------

FarmView.prototype.paintBlob = function (kind, rect) {
  for (let y = 0; y < rect.h; y++) {
    for (let x = 0; x < rect.w; x++) {
      const row = y === 0 ? 't' : (y === rect.h - 1 ? 'b' : 'c');
      const col = x === 0 ? 'l' : (x === rect.w - 1 ? 'r' : 'c');
      this.draw(kind + '_' + row + col, (rect.x + x) * TILE, (rect.y + y) * TILE);
    }
  }
};

FarmView.prototype.paintField = function (rect, wet) {
  const pre = wet ? 'wet' : 'till';
  for (let y = 0; y < rect.h; y++) {
    for (let x = 0; x < rect.w; x++) {
      const col = x === 0 ? 'l' : (x === rect.w - 1 ? 'r' : 'm');
      const alt = (y % 2) ? '2' : '';
      this.draw(pre + '_' + col + alt, (rect.x + x) * TILE, (rect.y + y) * TILE);
    }
  }
};

FarmView.prototype.paintFence = function () {
  const F = this.layout.fence;
  const gate = F.x + Math.floor(F.w / 2);
  const top = F.y, bot = F.y + F.h - 1;
  for (let x = F.x; x < F.x + F.w; x++) {
    this.draw('fence_m', x * TILE, top * TILE);
    if (x !== gate && x !== gate + 1) this.draw('fence_m', x * TILE, bot * TILE);
  }
  for (let y = top + 1; y < bot; y++) {
    this.draw('fence_v', F.x * TILE, y * TILE);
    this.draw('fence_v', (F.x + F.w - 1) * TILE, y * TILE);
  }
  this.draw('fence_l', F.x * TILE, top * TILE);
  this.draw('fence_r', (F.x + F.w - 1) * TILE, top * TILE);
  this.draw('fence_l', F.x * TILE, bot * TILE);
  this.draw('fence_r', (F.x + F.w - 1) * TILE, bot * TILE);
  this.draw('fence_post', (gate - 1) * TILE, bot * TILE);
  this.draw('fence_post', (gate + 2) * TILE, bot * TILE);
};

// --- the farmer -----------------------------------------------------------

FarmView.prototype.stepFarmer = function (dt) {
  const F = this.farmer;
  const fe = this.layout.fence;
  const dx = F.tx - F.x, dy = F.ty - F.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 0.08) {
    F.x = F.tx; F.y = F.ty;
    F.wait -= dt;
    if (F.wait <= 0) {
      const spots = this.features.filter(function (o) { return o.kind === 'building'; });
      let target;
      if (spots.length && Math.random() < 0.6) {
        const o = spots[Math.floor(Math.random() * spots.length)];
        target = { x: o.x + 1, y: o.y + 1 };
      } else {
        target = {
          x: fe.x + 2 + Math.random() * (fe.w - 5),
          y: fe.y + 2 + Math.random() * (fe.h - 5)
        };
      }
      F.tx = Math.max(fe.x + 1.5, Math.min(fe.x + fe.w - 2.5, target.x));
      F.ty = Math.max(fe.y + 1.5, Math.min(fe.y + fe.h - 2.5, target.y));
      F.wait = 0;
      F.act = 'walk';
    } else {
      F.act = F.wait > 900 ? (F.workAct || 'idle') : 'idle';
    }
  } else {
    const speed = 2.6 * dt / 1000;
    F.x += dx / dist * Math.min(speed, dist);
    F.y += dy / dist * Math.min(speed, dist);
    F.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u');
    F.act = 'walk';
    if (dist < 0.15) {
      F.wait = 1400 + Math.random() * 2200;
      F.workAct = Math.random() < 0.5 ? 'hoe' : 'water';
    }
  }
  F.frame = Math.floor(this.t / 160) % 3;
};

FarmView.prototype.drawFarmer = function () {
  const F = this.farmer;
  const frame = F.act === 'idle' ? 0 : F.frame;
  const key = 'farmer_' + F.act + '_' + F.face + '_' + frame;
  const r = ATLAS[key] || ATLAS['farmer_idle_d_0'];
  if (!r) return;
  this.ctx.drawImage(this.img, r[0], r[1], r[2], r[3],
    Math.round(F.x * TILE + TILE / 2 - r[2] / 2),
    Math.round((F.y + 1) * TILE - r[3]), r[2], r[3]);
};

// --- the frame ------------------------------------------------------------

FarmView.prototype.render = function (dt) {
  if (!this.plan || !this.layout) return;
  this.t += dt;
  const ctx = this.ctx;
  const L = this.layout, F = L.fence;
  const done = this.done;
  const has = function (id) { return done.indexOf(id) >= 0; };
  const self = this;

  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // base grass -- clumped rather than chequered, so it reads as a field
  for (let y = 0; y < L.h; y++) {
    for (let x = 0; x < L.w; x++) {
      const n = tileHash(x, y) * 0.55 +
        tileHash(Math.floor(x / 3), Math.floor(y / 3)) * 0.45;
      this.draw(n > 0.62 ? 'grass_b' : 'grass_a', x * TILE, y * TILE);
    }
  }

  // scrub on the margin, so the edge is not empty lawn
  for (let y = F.y + 1; y < F.y + F.h - 1; y++) {
    for (let x = 1; x < F.w - 1; x++) {
      const inside = x > RING + 1 && x < F.w - RING - 2 &&
        y > F.y + RING + 1 && y < F.y + F.h - RING - 2;
      if (inside) continue;
      const n = tileHash(x + 991, y + 77);
      if (n > 0.94) this.drawOn('shrub', x, y);
      else if (n < 0.03) this.drawOn('rock', x, y);
    }
  }

  // zones as soil patches
  if (has('zones')) {
    this.paintBlob('field', L.blocks.home);
    this.paintBlob('meadow', L.blocks.animals);
  }
  if (has('fodder-plot')) this.paintBlob('meadow', L.blocks.fodder);

  // the pond: Cute Fantasy's water autotile, with its middle tile as the fill
  if (has('pond')) {
    const p = L.blocks.pond;
    for (let y = 1; y < p.h - 1; y++) {
      for (let x = 1; x < p.w - 1; x++) {
        this.draw('water_mid', (p.x + x) * TILE, (p.y + y) * TILE);
      }
    }
    this.paintBlob('water', p);
  }

  // tilled fields. Irrigation shows as the pack's darker watered-soil tiles
  // rather than a drip-lateral sprite, which no pack provides.
  this.fields.forEach(function (f) { self.paintField(f.rect, f.wet); });

  // the house footprint, before the house itself goes up
  if (has('house-start') && !has('house-build')) {
    const b = L.blocks.home;
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 3; y++) {
        this.draw(((x + y) % 2) ? 'gravel' : 'stone_bits',
          (b.x + 1 + x) * TILE, (b.y + 1 + y) * TILE);
      }
    }
  }

  // The fence goes down BEFORE anything standing, so the house, the barn and
  // the boundary trees read as being on the farm rather than behind a railing.
  this.paintFence();

  if (has('boundary-trees')) {
    this.treeSpots().forEach(function (s) { self.drawOn(s.sprite, s.x, s.y); });
    const flowers = ['flowers_purple', 'flowers_pink', 'flowers_white', 'sunflower'];
    for (let x = 3; x < F.w - 3; x += 5) {
      const h = tileHash(x, 404);
      this.drawOn(flowers[Math.floor(h * flowers.length) % flowers.length],
        x, F.y + F.h - 3);
    }
  }

  // crops, growing in
  const now = performance.now();
  this.plantings.forEach(function (p) {
    const k = p.x + ',' + p.y + ',' + p.sprite;
    const age = now - (self.plantedAt[k] || now);
    const stage = Math.max(0, Math.min(3, Math.floor(age / GROW_MS)));
    self.drawOn('crop_' + p.sprite + '_' + stage, p.x, p.y);
  });

  // everything standing, back to front
  this.features.slice()
    .sort(function (a, b) { return a.y - b.y; })
    .forEach(function (o) { self.drawOn(o.sprite, o.x, o.y); });

  this.stepFarmer(dt);
  this.drawFarmer();

  // highlight whatever the pointer is over
  if (this.hover) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,248,220,.85)';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.hover.x + .5, this.hover.y + .5, this.hover.w - 1, this.hover.h - 1);
    ctx.restore();
  }

  // No vignette. It tinted the outer grass brown, which read as a border and
  // made the ruler look like it was measuring more ground than the fence holds.
};
