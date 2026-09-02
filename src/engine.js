// ---------------------------------------------------------------------------
// The plan engine.
//
// buildPlan(acres, stateId) is a pure function: same inputs, same plan, no
// side effects and no DOM. Everything the interface shows is derived from it.
//
// Allocations are interpolated from the scaling table in section 3 of the
// source document, which runs 3 / 5 / 10 / 15 / 25 / 50 / 100 / 250 acres.
// Between those rows we interpolate linearly; outside them we clamp.
// ---------------------------------------------------------------------------

// acres, grain, fodder, veg, fruitTrees, dairy, goats, poultry, pond, biogas m3, solar kWp
const SCALE_TABLE = [
  [3, 1.1, 0.6, 0.30, 25, 1.5, 3, 12, 0.10, 2.0, 2.0],
  [5, 1.8, 1.0, 0.50, 50, 2.5, 5, 22, 0.20, 2.5, 3.0],
  [10, 3.5, 2.0, 1.00, 100, 5, 10, 45, 0.40, 3.5, 4.0],
  [15, 5.0, 3.0, 1.50, 150, 7, 15, 70, 0.60, 5.0, 6.0],
  [25, 9.0, 5.0, 2.00, 250, 12.5, 25, 125, 1.00, 8.0, 10.0],
  [50, 18.0, 10.0, 3.50, 500, 25, 50, 325, 2.00, 17.5, 17.5],
  [100, 37.5, 20.0, 7.00, 1000, 50, 100, 650, 4.00, 25.0, 30.0],
  [250, 95.0, 50.0, 17.50, 2500, 125, 250, 1750, 9.00, 40.0, 70.0]
];

const SCALE_KEYS = [
  'acres', 'grain', 'fodder', 'veg', 'trees',
  'dairy', 'goats', 'poultry', 'pond', 'biogas', 'solar'
];

function interpolate(acres) {
  const t = SCALE_TABLE;
  const out = {};
  let lo = t[0], hi = t[t.length - 1], f = 0;

  if (acres <= t[0][0]) {
    lo = hi = t[0];
  } else if (acres >= t[t.length - 1][0]) {
    lo = hi = t[t.length - 1];
  } else {
    for (let i = 0; i < t.length - 1; i++) {
      if (acres >= t[i][0] && acres <= t[i + 1][0]) {
        lo = t[i]; hi = t[i + 1];
        f = (acres - lo[0]) / (hi[0] - lo[0]);
        break;
      }
    }
  }
  SCALE_KEYS.forEach(function (k, i) { out[k] = lo[i] + (hi[i] - lo[i]) * f; });
  out.acres = acres;
  return out;
}

// ---------------------------------------------------------------------------
// model of the farm at this size -- who works it and what it needs
// ---------------------------------------------------------------------------

function modelFor(acres) {
  if (acres < 5) {
    return {
      label: 'Family self-sufficiency',
      people: 'A nuclear family of 4–6',
      labour: 'Family only. No hired hands, no tractor.',
      kit: 'Hand tools, knapsack sprayer, chaff cutter, and either a power tiller or a pair of bullocks.',
      water: 'One bore well plus rooftop rainwater harvesting, with drip on the vegetable beds.',
      machine: 'tiller'
    };
  }
  if (acres < 10) {
    return {
      label: 'Family plus a modest surplus',
      people: '6–8 people',
      labour: 'Family, with occasional day labour at sowing and harvest.',
      kit: 'As above, plus a farm pond and expanded drip.',
      water: 'Bore well and a farm pond, drip on vegetables and the fruit block.',
      machine: 'tiller'
    };
  }
  if (acres < 15) {
    return {
      label: 'Family plus commercial surplus',
      people: 'Your family plus one or two hired hands — around 8–10 more people counting their households',
      labour: 'One or two part-time labourers. A power tiller becomes essential.',
      kit: 'Power tiller, larger pump, proper grain storage, solar dryer.',
      water: 'Tube well, with drip extended across the fruit and fodder blocks.',
      machine: 'tiller'
    };
  }
  if (acres < 25) {
    return {
      label: 'Small commercial farm',
      people: 'Your family plus 2–4 worker households',
      labour: 'Two to four labourers. This is where you cross from doing the work to managing a payroll.',
      kit: 'Tractor with plough, harrow and seed drill. Mechanised fodder chopping in the cattle shed.',
      water: 'Tube well, drip across all blocks.',
      machine: 'tractor'
    };
  }
  if (acres < 50) {
    return {
      label: 'Commercial farm',
      people: 'Your family plus 4–6 worker households',
      labour: 'Four to six full-time labourers. A tractor is now clearly worth owning.',
      kit: 'Tractor and implements, mechanised shed, cold storage worth considering.',
      water: 'Two tube wells.',
      machine: 'tractor'
    };
  }
  if (acres < 100) {
    return {
      label: 'Medium commercial farm',
      people: 'Your family plus 8–12 worker households',
      labour: 'Eight to twelve labourers. A tractor is essential, not optional.',
      kit: 'Tractor fleet, thresher, cold storage for perishables.',
      water: 'Multiple tube wells; pursue canal access if the district has it.',
      machine: 'tractor'
    };
  }
  return {
    label: acres < 250 ? 'Large commercial farm' : 'Commercial agribusiness',
    people: 'Your family as owner-managers, plus 20–50+ worker households',
    labour: 'Full mechanisation and a workforce of twenty upwards. Your family are managers, not labour.',
    kit: 'Full equipment fleet, harvester and thresher owned or seasonally rented, grain cleaning and milling.',
    water: 'Canal irrigation or a reservoir, plus deep tube wells.',
    machine: 'tractor'
  };
}

// ---------------------------------------------------------------------------
// crop selection -- what this state's soil and climate actually support
// ---------------------------------------------------------------------------

function cropById(id) {
  for (let i = 0; i < CROPS.length; i++) if (CROPS[i].id === id) return CROPS[i];
  return null;
}

function pickCrops(state) {
  const known = {};
  CROPS.forEach(function (c) { known[c.id] = c; });

  function resolve(list) {
    return (list || []).map(function (id) { return known[id]; }).filter(Boolean);
  }

  const kharif = resolve(state.kharif);
  const rabi = resolve(state.rabi);
  const fodder = resolve(state.fodder);
  const oil = resolve(state.oil);
  const cash = resolve(state.cash);
  const fruit = resolve(state.fruit);

  const isCereal = function (c) { return c.cat === 'cereal'; };
  const isPulse = function (c) { return c.cat === 'pulse'; };

  // the vegetable plot is the same core set everywhere, filtered to the soil
  const vegIds = ['tomato', 'brinjal', 'okra', 'onion', 'greens', 'gourds', 'rootveg', 'potato', 'cauliflower'];
  const veg = vegIds.map(function (id) { return known[id]; })
    .filter(function (c) {
      return c && c.soils.some(function (s) { return state.soils.indexOf(s) >= 0; });
    });

  return {
    stapleKharif: kharif.filter(isCereal)[0] || kharif[0] || null,
    stapleRabi: rabi.filter(isCereal)[0] || rabi[0] || null,
    pulses: kharif.filter(isPulse).concat(rabi.filter(isPulse)),
    oilseeds: oil,
    fodder: fodder,
    veg: veg,
    fruit: fruit,
    cash: cash,
    kharif: kharif,
    rabi: rabi
  };
}

// ---------------------------------------------------------------------------
// water and energy, from sections 4 and 5
// ---------------------------------------------------------------------------

function waterPlan(sc, state) {
  const rainMid = (state.rain[0] + state.rain[1]) / 2;
  // rooftop harvest: a 100 m2 roof, runoff coefficient 0.8
  const roofHarvest = Math.round(rainMid * 100 * 0.8 / 1000) * 1000;
  // irrigation demand: ~0.4 acre-metre per acre per season on cropped area
  const cropped = sc.grain + sc.fodder + sc.veg;
  const seasonDemand = Math.round(cropped * 0.4 * 4046.86); // cubic metres
  return {
    rainMid: Math.round(rainMid),
    roofHarvest: roofHarvest,
    domestic: 200,
    croppedAcres: cropped,
    seasonDemand: seasonDemand,
    seasonDemandDrip: Math.round(seasonDemand * 0.6)
  };
}

function energyPlan(sc) {
  const kwp = sc.solar;
  let profile, load, battery;
  if (kwp <= 3) {
    profile = 'Basic — LED lighting, fans, phone charging, a small television and a small pump';
    load = '2.5–3 kWh a day';
    battery = '3–4 kWh usable';
  } else if (kwp <= 8) {
    profile = 'Comfortable — adds a refrigerator, more pumping hours and a grinder';
    load = '5–7 kWh a day';
    battery = '8–10 kWh usable';
  } else {
    profile = 'Commercial — irrigation pumps, cold storage and processing equipment';
    load = '20 kWh a day and upwards';
    battery = 'Grid-tied hybrid, or a large battery bank sized to your worst month';
  }
  return {
    kwp: Math.round(kwp * 10) / 10,
    profile: profile, load: load, battery: battery,
    biogas: Math.round(sc.biogas * 10) / 10,
    biogasNote: sc.biogas <= 6
      ? 'A Deenbandhu fixed-dome plant. No moving parts, 15–20 year life, and 30–45% cheaper to build than the floating-dome KVIC design.'
      : 'At this scale a biogas-to-power unit is worth pricing against multiple household plants. It is a genuinely different system, not simply a larger one.'
  };
}

// ---------------------------------------------------------------------------
// budget, in rupees
// ---------------------------------------------------------------------------

function budgetFor(sc, state, model) {
  const rows = [];
  const acres = sc.acres;

  const landLow = state.price[0] * acres;
  const landHigh = state.price[1] * acres;
  rows.push({
    item: 'Land', detail: state.priceNote,
    low: landLow, high: landHigh, land: true
  });

  rows.push({
    item: 'Biogas plant',
    detail: sc.biogas.toFixed(1) + ' m³ — roughly ₹17,000 for a household 2 m³ unit before subsidy',
    low: Math.round(8500 * sc.biogas), high: Math.round(14000 * sc.biogas)
  });
  rows.push({
    item: 'Off-grid solar',
    detail: sc.solar.toFixed(1) + ' kWp with battery',
    low: Math.round(75000 * sc.solar), high: Math.round(130000 * sc.solar)
  });
  rows.push({
    item: 'Dairy animals',
    detail: Math.round(sc.dairy) + ' desi cow or buffalo',
    low: 30000 * Math.round(sc.dairy), high: 80000 * Math.round(sc.dairy)
  });
  rows.push({
    item: 'Goats',
    detail: Math.round(sc.goats) + ' head',
    low: 5000 * Math.round(sc.goats), high: 10000 * Math.round(sc.goats)
  });
  rows.push({
    item: 'Poultry',
    detail: Math.round(sc.poultry) + ' backyard birds',
    low: 150 * Math.round(sc.poultry), high: 300 * Math.round(sc.poultry)
  });
  rows.push({
    item: 'Drip irrigation',
    detail: (Math.round((sc.veg + sc.fodder) * 10) / 10) +
      ' acre to start — 50–90% subsidy for small and marginal farmers under PMKSY',
    low: Math.round(20000 * (sc.veg + sc.fodder)),
    high: Math.round(40000 * (sc.veg + sc.fodder))
  });
  rows.push({
    item: 'Farm pond',
    detail: (Math.round(sc.pond * 100) / 100) + ' acre of water, often subsidised by the state fisheries department',
    low: Math.round(150000 * sc.pond), high: Math.round(300000 * sc.pond)
  });
  rows.push({
    item: 'Cattle shed and coop',
    detail: 'Housing for ' + Math.round(sc.dairy) + ' cattle, ' +
      Math.round(sc.goats) + ' goats and ' + Math.round(sc.poultry) + ' birds',
    low: Math.round(25000 * sc.dairy + 8000), high: Math.round(45000 * sc.dairy + 15000)
  });
  rows.push({
    item: model.machine === 'tractor' ? 'Tractor and implements' : 'Power tiller',
    detail: model.machine === 'tractor'
      ? 'Worth owning above roughly 15 acres'
      : 'Or a pair of bullocks at ₹40,000–80,000, competitive below about 10 acres',
    low: model.machine === 'tractor' ? 600000 : 130000,
    high: model.machine === 'tractor' ? 900000 : 200000
  });
  rows.push({
    item: 'Fencing',
    detail: 'Perimeter — stray cattle and nilgai are a real threat across most of rural India',
    low: Math.round(30000 * Math.sqrt(acres / 3)),
    high: Math.round(60000 * Math.sqrt(acres / 3))
  });
  rows.push({
    item: 'Water: bore well, tank and rainwater harvesting',
    detail: model.water,
    low: acres < 10 ? 120000 : 250000, high: acres < 10 ? 250000 : 600000
  });

  const setupLow = rows.filter(function (r) { return !r.land; })
    .reduce(function (a, r) { return a + r.low; }, 0);
  const setupHigh = rows.filter(function (r) { return !r.land; })
    .reduce(function (a, r) { return a + r.high; }, 0);

  return { rows: rows, setupLow: setupLow, setupHigh: setupHigh, landLow: landLow, landHigh: landHigh };
}

// ---------------------------------------------------------------------------
// land allocation, rounded for display
// ---------------------------------------------------------------------------

function allocationFor(sc) {
  const acres = sc.acres;
  const grain = sc.grain;
  const fodder = sc.fodder;
  const veg = sc.veg;
  const pond = sc.pond;
  const pulseOil = acres * 0.12;
  const fruit = acres * 0.10;
  const home = acres * 0.08;
  const used = grain + fodder + veg + pond + pulseOil + fruit + home;
  const spare = Math.max(0, acres - used);

  const rows = [
    { key: 'grain', name: 'Cereal — the staple grain', acres: grain, tint: '#d8a53a' },
    { key: 'fodder', name: 'Fodder for the animals', acres: fodder, tint: '#5f9e3f' },
    { key: 'pulseOil', name: 'Pulses and oilseeds', acres: pulseOil, tint: '#a3563c' },
    { key: 'veg', name: 'Vegetables, rotated', acres: veg, tint: '#7fb43a' },
    { key: 'fruit', name: 'Fruit and agroforestry', acres: fruit, tint: '#3f7f4a' },
    { key: 'pond', name: 'Farm pond', acres: pond, tint: '#3678a9' },
    { key: 'home', name: 'House, sheds, biogas, paths', acres: home, tint: '#9a7b52' }
  ];
  if (spare > 0.05) {
    rows.push({ key: 'spare', name: 'Buffer, windbreak and wild edge', acres: spare, tint: '#5b6b4a' });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// the whole plan
// ---------------------------------------------------------------------------

function buildPlan(acres, stateId) {
  const state = STATES.filter(function (s) { return s.id === stateId; })[0];
  if (!state) throw new Error('unknown state: ' + stateId);

  acres = Math.max(3, Math.min(250, acres));

  const sc = interpolate(acres);
  const model = modelFor(acres);
  const crops = pickCrops(state);
  const soils = state.soils.map(function (id) {
    return Object.assign({ id: id }, SOILS[id]);
  });

  const plan = {
    acres: acres,
    state: state,
    soils: soils,
    primarySoil: soils[0],
    scale: sc,
    model: model,
    crops: crops,
    alloc: allocationFor(sc),
    livestock: {
      dairy: Math.max(1, Math.round(sc.dairy)),
      goats: Math.round(sc.goats),
      poultry: Math.round(sc.poultry),
      trees: Math.round(sc.trees),
      pond: sc.pond
    },
    water: waterPlan(sc, state),
    energy: energyPlan(sc)
  };

  plan.budget = budgetFor(sc, state, model);
  plan.steps = buildSteps(plan);
  return plan;
}

// ---------------------------------------------------------------------------
// formatting helpers shared across the interface
// ---------------------------------------------------------------------------

function rupees(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(n < 100000000 ? 2 : 1) + ' cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(n < 1000000 ? 1 : 0) + ' lakh';
  if (n >= 1000) return '₹' + Math.round(n / 1000) + ',000';
  return '₹' + Math.round(n);
}

function acresText(a) {
  if (a >= 10) return a.toFixed(0) + ' acres';
  if (a >= 1) return a.toFixed(1) + ' acres';
  if (a >= 0.1) return a.toFixed(2).replace(/0$/, '') + ' acre';
  // below a tenth of an acre, square feet is the number people can picture
  return Math.round(a * 43560).toLocaleString('en-IN') + ' sq ft';
}
