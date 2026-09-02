// ---------------------------------------------------------------------------
// The build order.
//
// buildSteps(plan) produces three phases of ordered, checkable steps,
// personalised to the acreage, state and soil the player chose. Each step
// names what it puts on the map when it is ticked (`build`) and what it needs
// finished first (`gate`).
//
// The sequence follows section 10 of the source document: soil and water
// first, then the animal-and-biogas loop, then the things that only make
// sense once the loop is closed.
// ---------------------------------------------------------------------------

function buildSteps(plan) {
  const s = plan.state;
  const soil = plan.primarySoil;
  const c = plan.crops;
  const ls = plan.livestock;
  const sc = plan.scale;
  const acres = plan.acres;
  const big = acres >= 15;

  const name = function (crop) { return crop ? crop.name : null; };
  const list = function (arr, n) {
    const names = (arr || []).slice(0, n || 3).map(name).filter(Boolean);
    if (!names.length) return 'the crops suited to your block';
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  };
  const ids = function (arr, n) {
    return (arr || []).slice(0, n || 3).map(function (x) { return x.id; });
  };

  const kharif = c.stapleKharif;
  const rabi = c.stapleRabi;

  // =========================================================================
  const YEAR1 = {
    id: 'y1', year: 'Year One', name: 'Foundation',
    blurb:
      'Nothing here depends on anything else being finished, and all of it is ' +
      'cheap relative to what comes later. The point of the first year is to ' +
      'learn your land and start building soil, not to farm it hard.',
    steps: [
      {
        id: 'soil-test',
        title: 'Get a soil test done',
        when: 'Before anything else. Ideally before you finish buying.',
        zone: 'Whole holding',
        body: [
          'Take samples from 8–10 spots across the holding in a zig-zag, at 0–15 cm ' +
          'depth, avoiding field edges, bunds and old manure heaps. Mix them in a ' +
          'clean bucket, quarter the pile down to about half a kilogram, and take ' +
          'that to the state agriculture department lab or your Krishi Vigyan Kendra. ' +
          'It is free or close to free.',
          'Ask specifically for pH, organic carbon, available nitrogen, phosphorus ' +
          'and potassium, plus electrical conductivity if there is any chance of ' +
          'salinity. On ' + soil.name.toLowerCase() + ' this matters because ' +
          soil.watch.charAt(0).toLowerCase() + soil.watch.slice(1),
          'Everything downstream — how much you spend on fertiliser, whether you ' +
          'need lime or gypsum, which crops are realistic — is set by this one ' +
          'result. Do not skip it and do not guess.'
        ],
        cost: { low: 0, high: 500 },
        build: ['signpost']
      },
      {
        id: 'fence',
        title: 'Fence the perimeter and hang a gate',
        when: 'First dry-weather window',
        zone: 'Boundary',
        body: [
          'Stray cattle and nilgai will take a young crop to the ground in a night, ' +
          'across most of rural India. This is not an optional refinement — it is ' +
          'the thing that stops your first year being wasted.',
          'A four-strand barbed wire fence on angle-iron or concrete posts every ' +
          '3 metres is the standard answer. Cheaper and better in the long run: ' +
          'plant a live fence of khejri, agave, thorny acacia or moringa along the ' +
          'wire, so that in five years the hedge is doing the work and the wire is ' +
          'just holding it in line.',
          'Put the gate where the road access is, wide enough for a tractor trailer ' +
          'even if you do not own one yet.'
        ],
        cost: { low: Math.round(30000 * Math.sqrt(acres / 3)), high: Math.round(60000 * Math.sqrt(acres / 3)) },
        build: ['fence', 'gate']
      },
      {
        id: 'zones',
        title: 'Peg out the five zones',
        when: 'Before you plant anything',
        zone: 'Whole holding',
        body: [
          'Walk the land and mark, with pegs and lime, where each zone goes. ' +
          'Zone 1 is the house with the kitchen garden, biogas plant and compost ' +
          'pits — everything you visit daily, within thirty steps of the door. ' +
          'Zone 2 is poultry, goats and the near orchard. Zone 3 is the main ' +
          'field: cereal, pulses, oilseeds, the cattle shed and the fodder plot. ' +
          'Zone 4 is the pond and the boundary fruit trees. Zone 5 is the wild ' +
          'edge — windbreak, biodiversity, and the buffer you do not cultivate.',
          'The logic is distance against frequency of visits. Anything you touch ' +
          'every day goes closest to the house. Getting this wrong costs you ' +
          'thousands of unnecessary steps a day for the rest of your life on the land.',
          'On your ' + plan.acres + ' acres this gives you roughly ' +
          acresText(sc.grain) + ' of cereal, ' + acresText(sc.fodder) + ' of fodder, ' +
          acresText(sc.veg) + ' of vegetables and ' + acresText(acres * 0.12) +
          ' of pulses and oilseeds.'
        ],
        cost: null,
        build: ['zones']
      },
      {
        id: 'compost',
        title: 'Dig the compost and vermicompost beds',
        when: 'Immediately — this takes months to mature',
        zone: 'Zone 1',
        body: [
          'Two pits, each roughly 3 × 1.5 × 1 metre, sited in shade and downwind ' +
          'of the house. Layer crop residue, weeds, kitchen waste and whatever ' +
          'dung you can get, keep it as damp as a wrung-out cloth, and turn it ' +
          'every three weeks. You will have usable compost in three to four months.',
          'Alongside them, build a vermicompost bed — a brick-sided or shaded ' +
          'HDPE bed, 1 metre wide, with pre-decomposed material and Eisenia fetida ' +
          'worms. Vermicompost is several times richer than ordinary compost in ' +
          'available nutrients and is what your vegetable beds will run on.',
          soil.build
        ],
        cost: { low: 4000, high: 12000 },
        build: ['compost', 'vermibed']
      },
      {
        id: 'water-source',
        title: 'Establish the water source',
        when: 'Before the first crop goes in',
        zone: 'Zone 1',
        body: [
          plan.model.water,
          'Before drilling, check the block\'s groundwater category with the ' +
          'district groundwater board — over-exploited blocks may not permit a new ' +
          'bore, and in any case a falling water table turns a cheap bore well into ' +
          'an expensive one within a decade.',
          'Your household needs only about 200 litres a day. The real budget is ' +
          'irrigation: at roughly 0.4 acre-metre per cropped acre per season, your ' +
          acresText(plan.water.croppedAcres) + ' of cropped land needs on the order of ' +
          plan.water.seasonDemand.toLocaleString('en-IN') + ' cubic metres a season ' +
          'under flood irrigation, or about ' +
          plan.water.seasonDemandDrip.toLocaleString('en-IN') + ' under drip.'
        ],
        cost: { low: acres < 10 ? 120000 : 250000, high: acres < 10 ? 250000 : 600000 },
        build: ['well', 'tank']
      },
      {
        id: 'rainwater',
        title: 'Set up rainwater harvesting',
        when: 'Complete before the monsoon',
        zone: 'Zone 1',
        body: [
          s.name + ' averages around ' + plan.water.rainMid + ' mm of rain a year. ' +
          'A 100 square metre roof at that rainfall yields roughly ' +
          plan.water.roofHarvest.toLocaleString('en-IN') + ' litres a year after ' +
          'losses — the rule of thumb is rainfall in mm times catchment area in m² ' +
          'times a runoff coefficient of about 0.8.',
          'Gutter the roof into a first-flush diverter — the first few minutes of ' +
          'runoff carries the dust and bird droppings and should go to waste — then ' +
          'into a covered ferrocement or plastic sump. Overflow should go to a ' +
          'recharge pit, not off the property.',
          'Also cut contour trenches or a farm bund across the slope. Slowing runoff ' +
          'so it soaks in where it falls does more for your water security over ' +
          'twenty years than any pump you can buy.'
        ],
        cost: { low: 25000, high: 80000 },
        build: ['tank'],
        gate: ['water-source']
      },
      {
        id: 'kitchen-garden',
        title: 'Break the kitchen garden and sow the first beds',
        when: 'First sowing window after the soil test',
        zone: 'Zone 1',
        body: [
          'Start with ' + acresText(sc.veg) + ' laid out as raised beds 1.2 metres ' +
          'wide with paths between — narrow enough to reach the middle from either ' +
          'side without stepping on the soil.',
          'Sow ' + list(c.veg, 4) + ' to begin with. The discipline that matters ' +
          'more than the crop list: sow a short strip every two or three weeks ' +
          'rather than one large planting. A single big bed of spinach gives you ' +
          'more spinach than you can eat for two weeks and none for the next two ' +
          'months.',
          'Dig in every bit of compost you have. This bed will produce daily food ' +
          'within six weeks and is the fastest return on the whole holding.'
        ],
        cost: { low: 8000, high: 25000 },
        crops: ids(c.veg, 5),
        build: ['garden'],
        gate: ['soil-test']
      },
      {
        id: 'poultry',
        title: 'Build the coop and bring in poultry',
        when: 'Any time — start early',
        zone: 'Zone 2',
        body: [
          'Start with ' + ls.poultry + ' desi or improved backyard birds — ' +
          'Kadaknath, Aseel, Vanaraja or Gramapriya. They forage for most of their ' +
          'own food, resist disease, and will hatch their own replacements.',
          'A raised coop at three square feet a bird, with a pop-hole ramp and a ' +
          'door you actually close at night. Predators, not disease, are what kills ' +
          'backyard flocks.',
          'Poultry are deliberately first among the animals: they are cheap, fast ' +
          'and forgiving, they turn kitchen waste and insect pests into eggs and ' +
          'the most concentrated nitrogen manure on the farm, and they teach you ' +
          'animal husbandry before you risk real money on a cow.'
        ],
        cost: { low: 8000 + 150 * ls.poultry, high: 15000 + 300 * ls.poultry },
        animals: ['poultry'],
        build: ['coop', 'hens']
      },
      {
        id: 'boundary-trees',
        title: 'Plant the boundary fruit and windbreak trees',
        when: 'With the monsoon — July or August',
        zone: 'Zone 4 and 5',
        body: [
          'Plant ' + ls.trees + ' trees along the boundary and the internal paths — ' +
          list(c.fruit, 3) + ' are the right choices for ' + soil.name.toLowerCase() +
          ' in ' + s.name + '.',
          'Dig the pits a month ahead — one metre cube for mango and similar, ' +
          '60 cm for guava and citrus — and refill with topsoil and 15 kg of compost ' +
          'each. Planting on the boundary means they cost you no cropping land, ' +
          'and they will be producing for thirty years or more.',
          (s.soils.indexOf('arid') >= 0
            ? 'On this land the windbreak matters as much as the fruit: a double row ' +
              'of khejri, neem or jujube on the windward edge, planted before ' +
              'anything else you care about, is what stops the topsoil leaving.'
            : 'Add a windbreak row on the exposed edge. It reduces evaporation ' +
              'across the whole field behind it, which is free irrigation.'),
          'Also plant the trees your animals will eat — moringa and subabul on the ' +
          'fence line give you goat fodder from land that is otherwise just boundary.'
        ],
        cost: { low: 60 * ls.trees, high: 200 * ls.trees },
        crops: ids(c.fruit, 4),
        build: ['orchard'],
        gate: ['fence']
      },
      {
        id: 'house-start',
        title: 'Lay out the house and get the footings in',
        when: 'Dry season',
        zone: 'Zone 1',
        body: [
          'Site the house on the highest ground you have, with the long axis running ' +
          'east–west so the low sun hits the short walls and the long walls stay ' +
          'shaded through the afternoon. A deep veranda on the south and west sides ' +
          'is worth more than any cooling you can buy.',
          'Put it upwind of the cattle shed and the compost, and close enough to ' +
          'the kitchen garden and biogas plant that you pass them every day.',
          'Stone or brick footings, damp-proof course, and plinth raised at least ' +
          '45 cm above the highest water you have seen on the site. Ask the ' +
          'neighbours where the water reached in the worst monsoon they remember, ' +
          'and then add a foot.'
        ],
        cost: { low: 60000, high: 200000 },
        build: ['house:0']
      },
      {
        id: 'solar-lighting',
        title: 'Put up basic solar lighting',
        when: 'Once the house has a roof to mount on',
        zone: 'Zone 1',
        body: [
          'Start small: a 1–1.5 kWp array with 3–4 kWh of usable battery covers ' +
          'LED lighting, fans, phone charging and a small pump. That is genuinely ' +
          'enough to live well on.',
          'Size the system for your worst month — least sunlight, highest demand — ' +
          'not the annual average. A system that works in November and fails in ' +
          'July is a system that has failed.',
          'Keep an LPG cylinder as cooking backup regardless of what else you build. ' +
          'The biogas plant comes in year two and will not be reliable from day one.'
        ],
        cost: { low: 90000, high: 180000 },
        build: ['solar'],
        gate: ['house-start']
      }
    ]
  };

  // =========================================================================
  const YEAR2 = {
    id: 'y2', year: 'Year Two', name: 'The loop closes',
    blurb:
      'This is the year the farm stops being a garden with animals and starts ' +
      'being a system. Dung becomes fuel, slurry becomes fertiliser, residue ' +
      'becomes fodder. Each of these steps depends on the one before it, so the ' +
      'order genuinely matters.',
    steps: [
      {
        id: 'house-build',
        title: 'Build the house',
        when: 'Dry season, before the monsoon',
        zone: 'Zone 1',
        body: [
          'Walls up, roof on. Local material is almost always the right answer: ' +
          'it costs less, it suits the climate because that is what it evolved for, ' +
          'and anyone nearby can repair it.',
          'Cross-ventilation on opposite walls, a high ceiling, and a roof overhang ' +
          'deep enough to keep the monsoon off the walls and the summer sun off the ' +
          'windows. Get the rainwater gutters on as part of the roof, not as an ' +
          'afterthought.',
          'Plan the kitchen for a biogas line now even though the plant is not built ' +
          'yet — running the pipe later means breaking a wall.'
        ],
        cost: { low: 600000, high: 2500000 },
        build: ['house:1', 'house:2'],
        gate: ['house-start']
      },
      {
        id: 'fodder-plot',
        title: 'Establish the fodder plot',
        when: 'February–March, or with the monsoon',
        zone: 'Zone 3',
        body: [
          'Plant ' + acresText(sc.fodder) + ' — hybrid napier as the perennial ' +
          'backbone, ' + (c.fodder.length > 1 ? name(c.fodder[1]) : 'berseem') +
          ' for the winter cuts. Budget roughly 0.2–0.3 acre per dairy animal.',
          'Napier goes in as rooted slips at 60 × 60 cm, about 8,000–10,000 an acre. ' +
          'First cut at 70–75 days, then every 40–45 days for three or four years, ' +
          'cutting at 10–15 cm above the ground and never lower.',
          'This step comes before you buy a cow, and that ordering is deliberate. ' +
          'Buying an animal you cannot feed from your own land is the single most ' +
          'common way small dairy operations fail — you end up buying fodder at ' +
          'market rates and the milk stops paying for itself.'
        ],
        cost: { low: Math.round(12000 * sc.fodder), high: Math.round(25000 * sc.fodder) },
        crops: ids(c.fodder, 3),
        build: ['fodder']
      },
      {
        id: 'cattle-shed',
        title: 'Build the cattle shed',
        when: 'Before the animals arrive',
        zone: 'Zone 3',
        body: [
          'Twelve square metres per animal — 4 covered, 8 as open paddock — for ' +
          ls.dairy + ' animal' + (ls.dairy > 1 ? 's' : '') + '. Roof at least ' +
          '3 metres high for air movement, open on the side away from the summer wind.',
          'The detail that matters most is the floor: sloped about 2 cm per metre ' +
          'to a covered drain, so urine is collected rather than lost. Urine carries ' +
          'much of the nitrogen and potassium, and a shed that drains it away is ' +
          'throwing your fertiliser into the ground.',
          'Plant a tree on the west side. Shade is the cheapest milk-yield ' +
          'improvement available to you.'
        ],
        cost: { low: Math.round(25000 * ls.dairy + 10000), high: Math.round(45000 * ls.dairy + 20000) },
        animals: ['cattle'],
        build: ['shed_cattle'],
        gate: ['fodder-plot']
      },
      {
        id: 'dairy',
        title: 'Bring in the first dairy animal',
        when: 'Once the shed is up and the fodder plot is cutting',
        zone: 'Zone 3',
        body: [
          'Buy a desi breed — Gir, Sahiwal, Tharparkar or Rathi for cattle, Murrah ' +
          'if you want buffalo. They give 8–12 litres a day on far lower inputs ' +
          'than crossbreds, tolerate heat and tick-borne disease, and survive a bad ' +
          'season that would break a Holstein cross.',
          'Buy in the second or third lactation, not the first — you can see what ' +
          'the animal actually produces. Watch it being milked before you pay. ' +
          'Check the udder for old mastitis damage and ask for the vaccination record.',
          'Daily feed per animal: 25–30 kg green fodder, 4–5 kg dry fodder, 2 kg ' +
          'concentrate, plus 1 kg more concentrate for every 2.5 litres of milk. ' +
          'Fifty grams of mineral mixture a day — the most commonly skipped input ' +
          'on Indian farms and the most commonly diagnosed deficiency.'
        ],
        cost: { low: 30000 * ls.dairy, high: 80000 * ls.dairy },
        animals: ['cattle'],
        build: ['cows'],
        gate: ['cattle-shed']
      },
      {
        id: 'biogas',
        title: 'Build the biogas plant',
        when: 'Once you have 2–3 cattle producing dung daily',
        zone: 'Zone 1',
        body: [
          'A ' + plan.energy.biogas.toFixed(1) + ' m³ plant for your herd. ' +
          plan.energy.biogasNote,
          'A 2 m³ plant covers cooking fuel for a five-person household and needs ' +
          '25–30 kg of fresh dung a day — which is what 2–3 cattle produce. Mix ' +
          'dung and water one to one and feed it daily; a plant fed irregularly ' +
          'produces irregularly.',
          'Site it within 15 metres of both the cattle shed and the kitchen, with ' +
          'the inlet downhill of the shed so you are not carrying dung uphill twice ' +
          'a day. Subsidy is available under the MNRE National Biogas Programme — ' +
          'apply through your block development office before you build, not after.',
          'The slurry that comes out is a better fertiliser than the dung that went ' +
          'in — the carbon is gone but the nitrogen is more available. Pipe it ' +
          'straight to the vegetable beds.'
        ],
        cost: { low: Math.round(8500 * sc.biogas), high: Math.round(14000 * sc.biogas) },
        build: ['biogas'],
        gate: ['dairy']
      },
      {
        id: 'drip',
        title: 'Lay drip irrigation',
        when: 'Before the dry season',
        zone: 'Zones 1 and 3',
        body: [
          'Start with ' + acresText(sc.veg + sc.fodder) + ' — the vegetable beds ' +
          'and the fodder plot, where the return per litre is highest.',
          'Drip cuts water use 30–50% against flood irrigation with equal or better ' +
          'yields, and it is subsidised 50–90% for small and marginal farmers under ' +
          'the Pradhan Mantri Krishi Sinchayee Yojana. Apply through the horticulture ' +
          'or agriculture department before purchase — buying first usually forfeits ' +
          'the subsidy.',
          'Add mulch under the drip lines. Drip plus mulch together roughly halves ' +
          'evaporation again, and on ' + soil.name.toLowerCase() + ' that is the ' +
          'difference between a crop that finishes and one that stalls.'
        ],
        cost: { low: Math.round(20000 * (sc.veg + sc.fodder)), high: Math.round(40000 * (sc.veg + sc.fodder)) },
        build: ['drip'],
        gate: ['water-source']
      },
      {
        id: 'kharif',
        title: 'Sow the first main kharif crop',
        when: 'With the monsoon onset',
        zone: 'Zone 3',
        body: [
          kharif
            ? 'Sow ' + acresText(sc.grain) + ' of ' + name(kharif) + '. ' + kharif.window
            : 'Sow your main monsoon cereal across ' + acresText(sc.grain) + '.',
          kharif ? kharif.prep : '',
          'Wait for the monsoon to actually arrive. Sowing dry, ahead of the rain, ' +
          'on the strength of a forecast is the commonest way to lose a kharif crop ' +
          'in India — a false start germinates the seed and then kills it.',
          'Intercrop where you can. A row of ' + (c.pulses[0] ? name(c.pulses[0]) : 'pigeon pea') +
          ' to every four rows of cereal gives you a pulse almost for free and puts ' +
          'nitrogen back for the rabi crop.'
        ],
        cost: { low: Math.round(6000 * sc.grain), high: Math.round(14000 * sc.grain) },
        crops: [kharif ? kharif.id : null, c.pulses[0] ? c.pulses[0].id : null].filter(Boolean),
        build: ['cereal'],
        gate: ['zones']
      },
      {
        id: 'pulses',
        title: 'Put in the pulses and oilseeds block',
        when: 'Kharif and rabi both',
        zone: 'Zone 3',
        body: [
          'Roughly ' + acresText(acres * 0.12) + ' split between ' +
          list(c.pulses, 2) + ' for protein and ' + list(c.oilseeds, 2) +
          ' for your own cooking oil.',
          'Cooking oil is the self-sufficiency gap almost every homestead plan ' +
          'misses. You will grow your own grain and vegetables and then buy oil ' +
          'all year. ' + (c.oilseeds[0] ? name(c.oilseeds[0]) : 'Mustard') +
          ' on a fraction of an acre closes it, and the cake left after crushing ' +
          'is excellent cattle feed.',
          'Always inoculate pulse seed with Rhizobium. It costs almost nothing and ' +
          'fixes 30–40 kg of nitrogen per acre — the cheapest fertiliser on the farm.'
        ],
        cost: { low: Math.round(5000 * acres * 0.12), high: Math.round(12000 * acres * 0.12) },
        crops: ids(c.pulses, 2).concat(ids(c.oilseeds, 2)),
        build: ['pulses'],
        gate: ['zones']
      },
      {
        id: 'rabi',
        title: 'Sow the rabi crop',
        when: 'October–November',
        zone: 'Zone 3',
        body: [
          rabi
            ? 'Sow ' + name(rabi) + ' across the cereal block. ' + rabi.window
            : 'Sow your winter cereal across the cereal block.',
          rabi ? rabi.water : '',
          'Rotation is not optional. Cereal after cereal on the same ground builds ' +
          'disease and strips nitrogen. Follow the kharif crop with a different ' +
          'family, and put a legume in the sequence at least once a year.'
        ],
        cost: { low: Math.round(6000 * sc.grain), high: Math.round(14000 * sc.grain) },
        crops: [rabi ? rabi.id : null].filter(Boolean),
        build: ['cereal2'],
        gate: ['kharif']
      },
      {
        id: 'goats',
        title: 'Add goats',
        when: 'Any time after the fodder plot is established',
        zone: 'Zone 2',
        body: [
          'Start with ' + ls.goats + '. Sirohi and Barbari are hardy and prolific ' +
          'across most of the country; match the breed to your climate rather than ' +
          'to a yield table.',
          'Build the pen with a raised slatted floor, one metre up. This single ' +
          'detail — droppings falling through, animals staying dry — largely ' +
          'eliminates footrot and internal parasites, which kill more goats than ' +
          'everything else combined.',
          'Goats are browsers, not grazers. They want leaves, twigs and shrubs, so ' +
          'the prunings off your boundary trees and the moringa on the fence line ' +
          'feed them. They convert land your cattle cannot use, on a fraction of ' +
          'the water, and they are sellable in small amounts at any time.'
        ],
        cost: { low: 5000 * ls.goats + 15000, high: 10000 * ls.goats + 30000 },
        animals: ['goat'],
        build: ['shed_goat', 'goats'],
        gate: ['fodder-plot']
      }
    ]
  };

  // =========================================================================
  const YEAR3 = {
    id: 'y3', year: 'Year Three', name: 'Scale and stabilise',
    blurb:
      'The loop is closed and the farm feeds itself. What remains is buffering ' +
      'against bad years, adding the pieces that only pay once the basics work, ' +
      'and deciding how much bigger you actually want this to get.',
    steps: [
      {
        id: 'pond',
        title: 'Dig the farm pond',
        when: 'Dry season, before the monsoon',
        zone: 'Zone 4',
        body: [
          'Roughly ' + (Math.round(sc.pond * 100) / 100) + ' acre of water, 1.5–2 ' +
          'metres deep, dug at the lowest point of the holding so runoff feeds it ' +
          'without pumping.',
          'Gently sloping sides, a bund high enough to survive the worst monsoon ' +
          'you have heard of, an inlet screen to keep wild fish out, and a monk ' +
          'outlet so you can drain and harvest properly. Do this once and do it ' +
          'right — reworking a pond later costs more than digging it well now.',
          'The pond is doing four jobs at once: irrigation buffer, groundwater ' +
          'recharge, protein production, and somewhere for the nutrient-rich ' +
          'washings off the cattle shed to go. The silt you dig out every few years ' +
          'is among the best fertiliser on the farm.'
        ],
        cost: { low: Math.round(150000 * sc.pond), high: Math.round(300000 * sc.pond) },
        build: ['pond'],
        gate: ['zones']
      },
      {
        id: 'fish',
        title: 'Stock the pond with fish',
        when: 'June–July, after liming',
        zone: 'Zone 4',
        body: [
          'Lime the pond at 200 kg per acre before stocking, to correct pH and kill ' +
          'pathogens. Then stock Indian major carp in polyculture — catla, rohu and ' +
          'mrigal at roughly 4:3:3, about 4,000 fingerlings per acre.',
          'The three species feed at different depths — catla at the surface, rohu ' +
          'in the middle, mrigal on the bottom — so together they use the whole ' +
          'pond instead of competing for one layer of it.',
          'Manure the pond with cattle dung in small weekly doses rather than one ' +
          'large dump, to grow the plankton the fish actually live on. Green water ' +
          'is a working pond. Feed rice bran and oil cake at 2–3% of body weight ' +
          'daily. Harvest at 800 g to 1 kg the following March or April.'
        ],
        cost: { low: 12000, high: 30000 },
        animals: ['fish'],
        build: ['fish'],
        gate: ['pond']
      },
      {
        id: 'solar-scale',
        title: 'Scale the solar system',
        when: 'Once pump and refrigeration loads are known',
        zone: 'Zone 1',
        body: [
          'Take the array to about ' + plan.energy.kwp + ' kWp with ' +
          plan.energy.battery + ' of battery. Load profile at this scale: ' +
          plan.energy.profile.toLowerCase() + ', running around ' +
          plan.energy.load + '.',
          'Solar pumping is the single highest-value load you can add — it moves ' +
          'irrigation off diesel entirely and the pump runs hardest exactly when ' +
          'the sun is strongest. Check the PM-KUSUM scheme, which subsidises solar ' +
          'pumps heavily.',
          'Size for your worst month, keep the panels clean, and keep the LPG ' +
          'cylinder as backup regardless.'
        ],
        cost: { low: Math.round(75000 * sc.solar), high: Math.round(130000 * sc.solar) },
        build: ['solar2'],
        gate: ['solar-lighting']
      },
      {
        id: 'dairy-2',
        title: 'Add the remaining dairy animals',
        when: 'Only once the fodder plot demonstrably supports them',
        zone: 'Zone 3',
        body: [
          'Take the herd to ' + ls.dairy + '. The test is simple and unforgiving: ' +
          'can your own land feed them through the leanest month without buying ' +
          'fodder? If not, do not buy the animal.',
          'Stagger the calvings so milk production stays even across the year ' +
          'rather than peaking and collapsing. Aim for one calf per animal per year; ' +
          'a calving interval beyond 15 months means something is wrong with your ' +
          'feeding or your heat detection, not with the animal.',
          'More cattle also means more dung, which is what lets the biogas plant ' +
          'run at capacity.'
        ],
        cost: { low: 30000 * Math.max(0, ls.dairy - 1), high: 80000 * Math.max(0, ls.dairy - 1) },
        animals: ['cattle'],
        build: ['cows2'],
        gate: ['biogas']
      },
      {
        id: 'bees',
        title: 'Put out beehives',
        when: 'Spring, as the first flowering starts',
        zone: 'Zone 2',
        body: [
          'Two to four boxes of Apis cerana indica, the native hive bee. Stands ' +
          '30 cm off the ground with the legs standing in water cups to stop ants — ' +
          'ants are the commonest reason a small apiary quietly fails.',
          'Face the entrances east so the colony starts foraging early, site them ' +
          'in partial shade near the orchard, and keep a shallow water dish with ' +
          'pebbles within fifty metres.',
          'The honey is the smaller half of the value. Pollination lifts yield ' +
          '20–40% on mustard, sunflower and most fruit across the whole holding, ' +
          'and it shows up in the first season. The bees are also the sharpest ' +
          'indicator you have of pesticide load — if the colony struggles, ' +
          'something about how the farm is being managed is wrong.'
        ],
        cost: { low: 6000, high: 20000 },
        animals: ['bees'],
        build: ['hives'],
        gate: ['boundary-trees']
      },
      {
        id: 'storage',
        title: 'Build grain storage and a solar dryer',
        when: 'Before the first big harvest',
        zone: 'Zone 1',
        body: [
          'Post-harvest loss in India runs 8–10% of grain, and almost all of it is ' +
          'avoidable. Metal or HDPE bins raised off the floor on a plinth, dried to ' +
          '12% moisture before filling, sealed against moisture and rodents.',
          'A simple solar dryer — a glazed box with a black absorber and a ventilated ' +
          'tray — dries vegetables, chilli and fruit to storable moisture in a day ' +
          'or two without the dust, insects and rain risk of open sun drying.',
          'This is the step that turns a good harvest into a year of eating. ' +
          'Storing well is worth more than growing 10% more.'
        ],
        cost: { low: 30000, high: 120000 },
        build: ['storage'],
        gate: ['rabi']
      },
      {
        id: 'machinery',
        title: big ? 'Buy a tractor and implements' : 'Buy a power tiller',
        when: 'Once the cropped area justifies it',
        zone: 'Zone 3',
        body: [
          plan.model.kit,
          big
            ? 'Above roughly 15 acres a tractor stops being a luxury. Buy the ' +
              'implements with it — plough, harrow and seed drill — because a ' +
              'tractor without a seed drill still leaves you broadcasting, and ' +
              'broadcast wheat yields 10–15% less than drilled.'
            : 'Below about 10 acres a pair of bullocks at ₹40,000–80,000 is ' +
              'genuinely competitive with a power tiller at ₹1.5 lakh. They need ' +
              'no diesel, no spare parts and no mechanic, they work wet ground that ' +
              'would bog a tractor, and they produce 20 kg of dung a day and a calf ' +
              'a year instead of depreciating.',
          'Whatever you buy, a chaff cutter comes first. It cuts fodder waste by ' +
          'about 20% and pays for itself inside a year.'
        ],
        cost: { low: big ? 600000 : 130000, high: big ? 900000 : 200000 },
        build: [big ? 'tractor' : 'tiller'],
        gate: ['kharif']
      }
    ]
  };

  if (acres >= 10) {
    YEAR3.steps.push({
      id: 'labour',
      title: 'Set up for hired labour',
      when: 'Before the area outgrows the family',
      zone: 'Zone 2',
      body: [
        'At ' + plan.acres + ' acres this stops being a homestead in the subsistence ' +
        'sense and becomes a farming enterprise. ' + plan.model.labour,
        'The land now supports ' + plan.model.people.toLowerCase() + '. That is a ' +
        'different kind of responsibility from feeding your own household: it means ' +
        'wages paid on time, decent housing, and work that continues through the ' +
        'lean months rather than only at harvest.',
        'The transition between roughly 10 and 25 acres is the one to plan for most ' +
        'carefully. It is where you cross from doing the work yourself to running a ' +
        'payroll, and the skills required are almost entirely different.'
      ],
      cost: { low: 200000, high: 800000 },
      build: ['quarters'],
      gate: ['machinery']
    });
  }

  return [YEAR1, YEAR2, YEAR3];
}
