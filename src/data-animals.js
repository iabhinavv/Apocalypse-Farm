// ---------------------------------------------------------------------------
// Livestock rearing guides.
//
// In an integrated system the animals are not a sideline -- they are the
// machinery that turns crop residue into fertiliser and fuel. The dung matters
// as much as the milk. Every guide ends with `loop`, which is what that animal
// contributes back to the farm.
// ---------------------------------------------------------------------------

const ANIMALS = [
  {
    id: 'cattle', name: 'Dairy cow or buffalo', local: 'Gai / Bhains',
    sprite: 'cow_0', altSprite: 'bull_0', housing: 'barn',
    perUnit: 'One animal per 0.2–0.3 acre of fodder',
    breeds:
      'Desi cattle — Gir, Sahiwal, Tharparkar, Rathi — give 8–12 litres a day on ' +
      'far lower inputs than crossbreds, tolerate heat and tick-borne disease, and ' +
      'walk through a bad season that would break a Holstein cross. Murrah buffalo ' +
      'gives 10–15 litres at 7% fat, which is worth more per litre. For a ' +
      'self-sufficient farm, hardiness beats peak yield every time — a crossbred ' +
      'that needs concentrate you have to buy is a liability, not an asset.',
    housing_note:
      'Twelve square metres per animal: 4 sq m covered standing space and 8 sq m ' +
      'open paddock. Floor sloped 2 cm per metre to a covered drain, because urine ' +
      'collection is what makes your slurry valuable. Roof height 3 m minimum for ' +
      'air movement. Face the open side away from the prevailing summer wind and ' +
      'plant a tree on the west side — shade is the cheapest milk-yield improvement ' +
      'you will ever make.',
    feed:
      'Daily, per adult animal: 25–30 kg of green fodder, 4–5 kg of dry fodder ' +
      '(straw or kadbi) and 2 kg of concentrate, plus 1 kg extra concentrate for ' +
      'every 2.5 litres of milk produced. A chaff cutter reduces fodder waste by ' +
      'about 20% and pays for itself inside a year. Mineral mixture 50 g a day — ' +
      'this is the most commonly skipped input and the most commonly diagnosed ' +
      'deficiency. Clean water always available; a milking animal drinks 70–100 ' +
      'litres a day.',
    water: '70–100 litres per day per animal, more in summer',
    breeding:
      'First calving at 30–36 months for desi breeds. Heat lasts 12–18 hours; ' +
      'inseminate 12 hours after standing heat is first seen. Gestation 280 days ' +
      'for cattle, 310 for buffalo. Dry the animal off 60 days before calving — ' +
      'skipping the dry period costs you the next lactation. Aim for one calf a ' +
      'year; a calving interval over 15 months is the clearest sign something is ' +
      'wrong with feeding or heat detection.',
    health:
      'Vaccinate against foot-and-mouth twice a year, and against haemorrhagic ' +
      'septicaemia and black quarter before the monsoon. Deworm every three ' +
      'months. Mastitis is the costly routine problem — dip teats after milking ' +
      'and never let an animal lie down in a wet shed straight afterwards. Watch ' +
      'for milk fever in high yielders just after calving.',
    output: '8–15 litres of milk a day, plus 10–15 kg of fresh dung',
    econ:
      'Purchase ₹30,000–80,000 depending on breed and lactation. Feed runs ' +
      '₹120–180 a day. A desi cow at 10 litres a day roughly breaks even on ' +
      'household consumption alone once you count the dung and the calf.',
    loop:
      'This animal is the engine of the whole system. Two to three cattle produce ' +
      'the 25–30 kg of fresh dung a day that a 2 m³ biogas plant needs, which ' +
      'covers a five-person household\'s cooking fuel. The digested slurry that ' +
      'comes out is a better fertiliser than the raw dung went in, and it goes ' +
      'straight to the vegetable beds. Crop residue you cannot eat becomes milk. ' +
      'Nothing else on the farm closes that many loops at once.'
  },

  {
    id: 'goat', name: 'Goats', local: 'Bakri',
    sprite: 'sheep_0', housing: null,
    perUnit: '2–4 at the 3-acre baseline',
    breeds:
      'Match the breed to the climate rather than to the yield table. Sirohi and ' +
      'Barbari are hardy and prolific across most of northern and central India. ' +
      'Jamunapari gives more milk but needs better feed. Osmanabadi and Malabari ' +
      'suit the Deccan and the wet coast. Black Bengal is small but extraordinarily ' +
      'prolific and gives the best skin in the country.',
    housing_note:
      'One square metre per adult, raised 1–1.5 m off the ground on a slatted ' +
      'bamboo or wooden floor. The raised floor is the single most important ' +
      'detail: droppings and urine fall through, the animals stay dry, and ' +
      'footrot and internal parasites — which kill more goats than anything ' +
      'else — largely stop being a problem. Collect what falls through; goat ' +
      'pellets are a stronger fertiliser than cattle dung.',
    feed:
      '3–5 kg of green fodder a day per adult, plus 200–400 g of concentrate for ' +
      'pregnant and lactating does. Goats are browsers rather than grazers — they ' +
      'want leaves, twigs and shrubs more than grass, so tree fodder from moringa, ' +
      'subabul, neem and the prunings off your own boundary trees suits them ' +
      'exactly. This is why they cost so little to keep.',
    water: '4–6 litres per day per adult',
    breeding:
      'First kidding at 12–15 months. Gestation 150 days. Most breeds give twins, ' +
      'and three kiddings in two years is achievable. One buck serves 25–30 does; ' +
      'bring in an unrelated buck every two years or inbreeding will quietly halve ' +
      'your productivity.',
    health:
      'Peste des petits ruminants vaccination is essential and cheap — PPR still ' +
      'wipes out whole flocks. Vaccinate against enterotoxaemia and foot-and-mouth ' +
      'too. Deworm every three months; internal parasites are the main killer in ' +
      'goats kept on the ground. Trim hooves twice a year.',
    output: 'Meat, 1–2 litres of milk a day from dairy breeds, manure, skins',
    econ:
      '₹5,000–10,000 per animal. Very low feed cost if they have browse. Fast ' +
      'turnover — a doe can return her purchase price within two kiddings.',
    loop:
      'Goats convert land your cattle cannot use — scrub, boundary hedges, tree ' +
      'prunings, crop stubble — into meat, milk and concentrated manure. They ' +
      'need a fraction of the water cattle need, which matters enormously in the ' +
      'arid and semi-arid districts. Think of them as the farm\'s liquid savings ' +
      'account: sellable at any time, in small amounts, without breaking anything.'
  },

  {
    id: 'poultry', name: 'Backyard poultry', local: 'Desi murgi',
    sprite: 'hen_0', housing: null,
    perUnit: '10–15 birds at the 3-acre baseline',
    breeds:
      'Desi and improved backyard birds — Kadaknath, Aseel, Vanaraja, Gramapriya, ' +
      'Rhode Island Red crosses. These forage for most of their own food, resist ' +
      'disease, brood their own chicks and survive predators. Commercial layers ' +
      'give far more eggs but need bought feed, controlled housing and constant ' +
      'management, which defeats the purpose here.',
    housing_note:
      'Three square feet per bird in a raised coop, wire-floored or deep-littered, ' +
      'with a pop-hole ramp and a securely closed door at night. Predators — dogs, ' +
      'mongoose, snakes, kites — are the main cause of loss in backyard flocks, ' +
      'not disease. Nest boxes one per four hens, and perches, because birds that ' +
      'roost sleep better and lay better.',
    feed:
      'Free-range foraging supplemented with 40–60 g of grain per bird per day, ' +
      'plus kitchen scraps, broken grain and the screenings off your own threshing ' +
      'floor. Crushed oyster shell or limestone grit for shell strength. Clean ' +
      'water twice a day — a bird that stops drinking stops laying within a day.',
    water: '250 ml per bird per day',
    breeding:
      'Hens start laying at 5–6 months. A desi hen gives 100–150 eggs a year ' +
      '(against 280 from a commercial layer) but will go broody and hatch her own ' +
      'replacements, which costs you nothing. One cock to ten hens. Replace ' +
      'breeding stock every two years.',
    health:
      'Vaccinate against Ranikhet disease (Newcastle) — this is the one that wipes ' +
      'out backyard flocks, and the vaccine costs almost nothing. Also Marek\'s at ' +
      'day-old and fowl pox. Deworm twice a year. Keep the litter dry; wet litter ' +
      'causes coccidiosis.',
    output: '100–150 eggs per hen per year, plus meat and high-nitrogen manure',
    econ:
      '₹150–300 per bird. Feed cost is minimal for a foraging flock. This is ' +
      'the fastest-returning livestock on the farm — eggs within six months of ' +
      'buying chicks.',
    loop:
      'Poultry are the farm\'s cleanup crew. They eat insect pests, ticks, fallen ' +
      'grain and kitchen waste, and turn it into the most concentrated nitrogen ' +
      'manure on the holding — poultry droppings run around 3% nitrogen against ' +
      '0.5% for cattle dung. Run them through the orchard after harvest and they ' +
      'break the fruit-fly cycle for you. Start with poultry in year one: they ' +
      'are cheap, fast and forgiving, and they teach you animal husbandry before ' +
      'you risk money on a cow.'
  },

  {
    id: 'fish', name: 'Pond fish', local: 'Machhli',
    sprite: null, housing: null,
    perUnit: '0.1 acre pond at the 3-acre baseline',
    breeds:
      'Indian major carp polyculture — catla, rohu and mrigal together, because ' +
      'they feed at different depths and so use the whole pond rather than ' +
      'competing. Catla feeds at the surface, rohu in the middle column, mrigal ' +
      'on the bottom. Add common carp or grass carp to the mix where available. ' +
      'Stock roughly 4,000 fingerlings per acre in a 4:3:3 ratio.',
    housing_note:
      'Pond 1.5–2 m deep with gently sloping sides and a bund high enough to ' +
      'survive the monsoon. Dig it at the low point of the farm so runoff feeds ' +
      'it. Line it only if the soil is very sandy. An inlet screen keeps wild ' +
      'fish out and a monk outlet lets you drain and harvest properly. Do this ' +
      'once, properly — reworking a pond later is expensive.',
    feed:
      'Rice bran and oil cake in equal parts at 2–3% of body weight daily. Much ' +
      'of the real feeding is natural plankton, which you grow by manuring the ' +
      'pond: cattle dung at 10 tonnes per acre per year applied in small weekly ' +
      'doses, not dumped in at once. Green water is a working pond; clear water ' +
      'means nothing is growing.',
    water:
      'Top up through summer to hold the level. A farm pond is also your ' +
      'irrigation buffer and your firefighting reserve.',
    breeding:
      'Buy fingerlings each year rather than trying to breed carp on-farm — ' +
      'induced breeding needs hormones and hatchery skills. Stock in June–July ' +
      'and harvest the following March–April at 800 g to 1 kg.',
    health:
      'Most problems are water quality problems. Check that fish are not gulping ' +
      'at the surface at dawn, which means oxygen is low — stop feeding and ' +
      'add water. Argulus and other parasites in overstocked ponds. Lime the ' +
      'pond at 200 kg an acre before stocking to correct pH and kill pathogens.',
    output: '800–1,200 kg of fish per acre of water per year',
    econ:
      'Fingerlings ₹2–4 each. Pond excavation is the real cost, ₹1.5–3 lakh ' +
      'per acre, and is often subsidised under state fisheries schemes.',
    loop:
      'The pond is the neatest piece of the whole system: it stores irrigation ' +
      'water, buffers the monsoon, recharges groundwater, takes the nutrient-rich ' +
      'wastewater off the cattle shed, and turns all of that into protein. The ' +
      'silt you dig out every few years is among the best fertiliser on the farm. ' +
      'Ducks on the pond add another layer — their droppings feed the plankton ' +
      'that feeds the fish.'
  },

  {
    id: 'bees', name: 'Honey bees', local: 'Madhumakhi',
    sprite: null, housing: null,
    perUnit: '2–4 boxes, optional but high value',
    breeds:
      'Apis cerana indica, the Indian hive bee, is the sensible choice for a ' +
      'small farm — it is native, swarms less destructively than people expect, ' +
      'and needs no imported management. Apis mellifera yields more honey but ' +
      'needs migratory management and more intervention. Stingless bees ' +
      '(Trigona) are worth keeping purely for pollination in the south.',
    housing_note:
      'Standard boxes on stands 30 cm off the ground with the legs in water cups ' +
      'to stop ants — ants are the commonest reason a small apiary fails. Face ' +
      'the entrances east so the colony starts foraging early. Site them in ' +
      'partial shade near the orchard and a water source, and away from paths.',
    feed:
      'Bees feed themselves when there is forage. In the dearth period — usually ' +
      'the hot dry months before the monsoon — feed sugar syrup at 1:1 to stop ' +
      'the colony absconding. Plant mustard, sesame, moringa, guava and ' +
      'sunflower in sequence and you will have almost year-round forage.',
    water: 'A shallow water dish with pebbles, within 50 m of the hives',
    breeding:
      'Colonies divide naturally in spring. Split a strong colony rather than ' +
      'letting it swarm away. Requeen every two years — an old queen is the ' +
      'usual reason a colony goes quiet.',
    health:
      'Wax moth in weak colonies — keep colonies strong and boxes tight. ' +
      'Varroa mite in Apis mellifera. Thai sacbrood virus in Apis cerana. ' +
      'The most important health measure is not spraying insecticide on ' +
      'flowering crops in the daytime; if you must spray, do it after dusk.',
    output: '10–20 kg of honey per colony a year, plus wax',
    econ:
      '₹3,000–5,000 per colony with box. Very high return relative to the labour ' +
      'and space involved.',
    loop:
      'The honey is the smaller half of the value. Pollination raises yield ' +
      'across the whole farm — 20–40% on mustard, sunflower and most fruit, ' +
      'and it is measurable within one season. Bees are also the sharpest ' +
      'indicator you have of pesticide load: if the colony is struggling, ' +
      'something about the way the farm is being managed is wrong.'
  },

  {
    id: 'draught', name: 'Draught bullocks', local: 'Bail',
    sprite: 'bull_0', housing: 'barn',
    perUnit: 'A pair, worth considering below about 10 acres',
    breeds:
      'Hallikar, Amritmahal, Kangayam, Khillari and Nagori are the classic draught ' +
      'breeds. A pair handles ploughing, puddling, carting and threshing on a ' +
      'small holding, and works ground a tractor would compact.',
    housing_note:
      'The same shed as the dairy animals, with 4 sq m of standing space each. ' +
      'Bullocks working in the sun need shade and a midday rest more than they ' +
      'need extra feed.',
    feed:
      'On working days, 30 kg of green fodder, 5 kg of dry fodder and 2–3 kg of ' +
      'concentrate per animal. On idle days, drop the concentrate entirely — ' +
      'this is the main way people overspend on bullocks.',
    water: '60–80 litres per day per animal',
    breeding:
      'Bought as a matched pair at 3 years old and worked to about 12. Not bred ' +
      'on-farm on a holding this size.',
    health:
      'Same vaccination and deworming schedule as dairy cattle. Yoke galls and ' +
      'hoof damage are the working injuries — check the yoke fit and trim hooves ' +
      'twice a year.',
    output: 'Draught power, dung, and no fuel bill',
    econ:
      '₹40,000–80,000 a pair. Against a power tiller at ₹1.5 lakh or a tractor at ' +
      '₹6 lakh, a pair of bullocks is genuinely competitive below about 10 acres — ' +
      'and they produce dung and calves rather than depreciating.',
    loop:
      'A working pair produces around 20 kg of dung a day, which on its own runs ' +
      'a household biogas plant. They need no diesel, no spare parts and no ' +
      'mechanic, and they can work wet ground that would bog a tractor. Above ' +
      'roughly 10–15 acres the arithmetic flips and mechanisation wins — but ' +
      'below it, this is not nostalgia, it is economics.'
  }
];
