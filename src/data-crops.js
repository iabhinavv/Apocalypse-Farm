// ---------------------------------------------------------------------------
// Crop guides.
//
// Each entry carries a base guide plus `bySoil` notes -- the same crop behaves
// differently on black cotton soil and on leached laterite, and that difference
// is usually what decides whether it works.
//
// Sowing windows are given for a normal monsoon. Shift them by your own
// district's onset date, and confirm varieties with the local Krishi Vigyan
// Kendra before you buy seed.
//
//   cat      cereal | pulse | oilseed | cash | fodder | veg | fruit
//   season   kharif (monsoon) | rabi (winter) | zaid (summer) | perennial
// ---------------------------------------------------------------------------

const CROPS = [

  // =========================================================================
  // CEREALS AND MILLETS
  // =========================================================================
  {
    id: 'wheat', name: 'Wheat', local: 'Gehun', cat: 'cereal', sprite: 'wheat',
    season: 'rabi', duration: '120–150 days', staple: true,
    soils: ['alluvial', 'black', 'hill'],
    window: 'Sow 1–25 November. Every week of delay past mid-December costs roughly 1% of yield to terminal heat at grain fill.',
    seed: '40–50 kg per acre, treated with Trichoderma or carbendazim. Use 25% more if sowing late or broadcasting.',
    spacing: 'Rows 22.5 cm apart, seed 5 cm deep. A seed drill pays for itself here — broadcast wheat yields 10–15% less.',
    prep: 'Two ploughings and a planking after the kharif harvest. Wheat wants a fine, firm, level seedbed; clods cost you germination.',
    water: 'Five irrigations at crown root (21 days), tillering, jointing, flowering and dough stage. The crown-root one is non-negotiable — miss it and nothing later recovers the yield.',
    feed: '50 kg urea, 55 kg DAP and 20 kg MOP per acre, half the nitrogen at sowing and half at first irrigation. On a well-composted plot cut this by a third.',
    pests: 'Yellow rust in cool wet winters — scout from January. Aphids on the ear head. Termites in light soils, controlled at sowing with a seed treatment.',
    harvest: 'When the grain is hard and the straw yellow, at about 20% moisture. Dry to 12% before binning or it will not keep.',
    yield: '18–22 quintal per acre irrigated, 8–12 quintal rainfed.',
    rotation: 'Follows rice, cotton, soybean or maize. Do not follow wheat with wheat — take-all and rust build up fast.',
    loop: 'Straw is your dry fodder reserve for the lean months and your bedding for the cattle shed. Never burn it.',
    bySoil: {
      alluvial: 'Its natural home. Watch nitrogen — continuous rice-wheat strips organic carbon, so lean on farmyard manure and a green manure in the gap.',
      black: 'Sow into stored moisture soon after the kharif harvest, while the soil is still working. If it dries and cracks first you will not get a seedbed. Expect fewer irrigations than on alluvium.',
      hill: 'Late-sown in the valleys only. Choose a short-duration variety and accept a lower yield; frost at flowering is the risk to plan around.'
    }
  },
  {
    id: 'rice', name: 'Rice', local: 'Dhan / Chawal', cat: 'cereal', sprite: 'tallgrass',
    season: 'kharif', duration: '110–145 days', staple: true,
    soils: ['alluvial', 'coastal', 'red'],
    window: 'Nursery in the second half of May, transplant 20–30 days later with the monsoon. Direct-seeded rice goes in dry just before onset.',
    seed: '12–15 kg per acre for transplanting, 30–35 kg for direct seeding.',
    spacing: '20 × 15 cm, two seedlings per hill. Under SRI, one seedling per hill at 25 × 25 cm and transplanted at 12 days — fewer plants, more tillers, roughly half the seed and water.',
    prep: 'Puddle the field and level it properly. Unevenness is the single most common cause of patchy rice: high spots dry out, low spots drown the seedlings.',
    water: 'Traditionally 5 cm standing water, which is enormously wasteful. Alternate wetting and drying — let the water drop 15 cm below the surface before reflooding — saves 25–30% with no yield penalty.',
    feed: '40 kg urea, 50 kg DAP, 15 kg MOP per acre in three splits. Azolla grown in the standing water fixes nitrogen and is free.',
    pests: 'Stem borer and leaf folder are the routine two. Brown planthopper explodes under heavy nitrogen and dense planting — spacing is your first defence. Blast in humid weather.',
    harvest: 'When 80% of the grains are straw-coloured and the top of the panicle is hard. Do not wait for the whole panicle or you will shatter the top grains.',
    yield: '20–25 quintal per acre transplanted, 14–18 direct-seeded.',
    rotation: 'Wheat, chana, mustard or potato in rabi. A green manure of dhaincha before the kharif crop repays itself.',
    loop: 'Straw feeds cattle through the dry months and bulks up the compost heap. Rice-field water can run on to the fish pond.',
    bySoil: {
      alluvial: 'Ideal. Deep soil, water at hand, and the whole extension system built around it. Groundwater draw is the thing to watch, not agronomy.',
      coastal: 'In the deltas, salinity is the limit — test in the dry season and pick a salt-tolerant variety if EC is above 4. Drainage matters more than irrigation here.',
      red: 'Only where a tank or bore well makes it possible; this soil will not hold a puddle on its own. Upland direct-seeded rice on light land is usually a better fit than transplanted paddy.'
    }
  },
  {
    id: 'maize', name: 'Maize', local: 'Makka', cat: 'cereal', sprite: 'corn',
    season: 'kharif', duration: '90–110 days',
    soils: ['alluvial', 'red', 'hill', 'black'],
    window: 'Kharif with the monsoon onset in late June. Rabi maize from mid-October where winters are mild. Spring maize in February under irrigation.',
    seed: '8 kg per acre for grain, 20 kg for fodder maize.',
    spacing: '60 × 20 cm. Ridge-and-furrow planting is worth the effort — it drains in a wet week and holds water in a dry one.',
    prep: 'One deep ploughing and two harrowings. Maize will not tolerate waterlogging for even 48 hours, so get the drainage right first.',
    water: 'Critical at knee-high, tasselling and grain filling. Tasselling is the one that decides the crop.',
    feed: 'Heavy feeder: 50 kg urea, 55 kg DAP, 20 kg MOP per acre, nitrogen in three splits.',
    pests: 'Fall armyworm is now the dominant problem across India — scout weekly from emergence and treat the whorl early. Stem borer, and birds at the milk stage.',
    harvest: 'When the husk dries and a black layer forms at the kernel base. Dry cobs to 14% before shelling.',
    yield: '20–28 quintal per acre irrigated.',
    rotation: 'Excellent before wheat or a pulse. Follows well after a legume.',
    loop: 'Green stalk is superb cattle fodder, and the cobs and stover go through the chaff cutter. Grain is also your poultry feed base.',
    bySoil: {
      alluvial: 'Reliable and high yielding. Rabi maize under irrigation often beats kharif because pest pressure is lower.',
      red: 'Responds dramatically to organic matter and lime here — this soil is where the difference between fed and unfed maize is most visible.',
      hill: 'The traditional hill staple. Short-duration varieties, sown on terraces with the first rain.',
      black: 'Grows well but demands drainage. Broad-bed-and-furrow layout is close to essential in a heavy monsoon.'
    }
  },
  {
    id: 'bajra', name: 'Pearl millet', local: 'Bajra', cat: 'cereal', sprite: 'corn',
    season: 'kharif', duration: '75–90 days', staple: true,
    soils: ['arid', 'red', 'alluvial'],
    window: 'With the first real monsoon rain, late June to mid-July. It will germinate on 15 mm of rain, which is why it is the desert staple.',
    seed: '1.5–2 kg per acre. Tiny seed — mix with sand to broadcast evenly, or use a drill.',
    spacing: '45 × 15 cm, seed no deeper than 3 cm.',
    prep: 'One ploughing is genuinely enough. Do not over-work a sandy soil; you will lose what little structure it has to the wind.',
    water: 'Usually entirely rainfed. One protective irrigation at earhead emergence, if you have it, lifts yield sharply.',
    feed: '25 kg urea and 25 kg DAP per acre. It responds to feeding but does not demand it.',
    pests: 'Downy mildew — the answer is seed treatment and a resistant variety, not spray. Shoot fly early. Birds at grain fill.',
    harvest: 'Cut earheads when grains harden. Stack and thresh after a few days of drying.',
    yield: '8–12 quintal per acre rainfed, 15–18 with a protective irrigation.',
    rotation: 'Follow with chana or mustard on stored moisture. Rotate with moth or guar to keep nitrogen up.',
    loop: 'The stover is the best dry fodder available in arid zones, and often worth as much as the grain.',
    bySoil: {
      arid: 'The crop this soil was made for. Nothing else will give you a grain harvest on 300 mm of rain.',
      red: 'Works well and tolerates the acidity better than most cereals.',
      alluvial: 'Grown as a fast summer catch crop between two main crops rather than as the main staple.'
    }
  },
  {
    id: 'jowar', name: 'Sorghum', local: 'Jowar', cat: 'cereal', sprite: 'corn',
    season: 'kharif', duration: '100–120 days', staple: true,
    soils: ['black', 'red', 'arid'],
    window: 'Kharif with monsoon onset. Rabi jowar sown mid-September to mid-October on stored moisture in black soil — the classic Deccan winter crop.',
    seed: '4 kg per acre for grain, 12–15 kg for fodder.',
    spacing: '45 × 15 cm.',
    prep: 'For rabi jowar on black soil, the whole game is conserving monsoon moisture: harrow after the rains stop to break the surface and stop evaporation.',
    water: 'Rainfed as a rule. Sensitive at flowering and grain fill; one irrigation there if available.',
    feed: '30 kg urea, 25 kg DAP per acre.',
    pests: 'Shoot fly in late-sown crops — sow on time and that problem largely disappears. Stem borer, and midge at flowering.',
    harvest: 'Cut when grain is hard. Do not graze or feed stressed young sorghum to cattle: drought-stressed plants accumulate prussic acid.',
    yield: '10–14 quintal per acre rainfed.',
    rotation: 'With cotton, chana or a pulse. Do not repeat sorghum on the same block.',
    loop: 'Kadbi — the dried stover — is the standard dry fodder of the Deccan and stores for a year under a simple stack.',
    bySoil: {
      black: 'Rabi jowar on residual moisture in deep black soil is one of the most dependable rainfed crops in India. This is its home ground.',
      red: 'Kharif sowing only; the soil will not store enough moisture for a rabi crop.',
      arid: 'Grows, but bajra is the better bet below about 400 mm of rainfall.'
    }
  },
  {
    id: 'ragi', name: 'Finger millet', local: 'Ragi / Nachni', cat: 'cereal', sprite: 'corn',
    season: 'kharif', duration: '100–120 days', staple: true,
    soils: ['red', 'hill', 'coastal'],
    window: 'Nursery in June, transplant in July at 20–25 days old. Direct sowing also works with the monsoon.',
    seed: '2 kg per acre transplanted, 4 kg direct-sown.',
    spacing: '22.5 × 10 cm.',
    prep: 'Fine seedbed — ragi seed is very small and will not push through clods or crust.',
    water: 'Rainfed. Highly drought tolerant once established; the vulnerable window is the first three weeks.',
    feed: '20 kg urea, 25 kg DAP per acre. Responds very well to farmyard manure — 2 tonnes an acre makes a visible difference.',
    pests: 'Blast at the neck and finger stage in humid weather is the main one. Otherwise remarkably trouble-free.',
    harvest: 'Cut earheads when brown, dry in the sun, then thresh.',
    yield: '10–14 quintal per acre.',
    rotation: 'With a pulse, groundnut or mustard.',
    loop: 'Straw is decent maintenance fodder. Grain stores for years without insect damage — the best famine reserve of any Indian grain, and the reason it belongs in a self-sufficiency plan.',
    bySoil: {
      red: 'The classic southern plateau crop. Low input, drought-hardy, and nutritionally the best staple on this list — high in calcium and iron.',
      hill: 'Grown on terraces up to about 2,000 m. Short-duration types only.',
      coastal: 'Grown on the laterite uplands above the paddy fields where water will not stand.'
    }
  },

  // =========================================================================
  // PULSES  — protein, and free nitrogen
  // =========================================================================
  {
    id: 'chana', name: 'Chickpea', local: 'Chana', cat: 'pulse', sprite: 'berry',
    season: 'rabi', duration: '100–120 days',
    soils: ['black', 'alluvial', 'red'],
    window: 'Sow 15 October to 15 November on stored moisture. Late sowing brings wilt and pod borer together.',
    seed: '30–35 kg per acre for desi types, 45 kg for kabuli.',
    spacing: '30 × 10 cm, seed 5–8 cm deep — deeper than you would expect, into moisture.',
    prep: 'A rough, cloddy seedbed is fine and actually helps. Do not over-till.',
    water: 'Usually none. One irrigation at pod formation if the crop is visibly stressed. Over-watering causes rank vegetative growth and no pods.',
    feed: '10 kg urea as a starter and 50 kg DAP per acre. Inoculate the seed with Rhizobium — it fixes 30–40 kg of nitrogen an acre for free.',
    pests: 'Gram pod borer is the whole battle. Pheromone traps, bird perches across the field, and an NPV or neem spray at flowering. Wilt is managed by variety choice and rotation.',
    harvest: 'When leaves yellow and pods rattle. Do not delay — pods shatter.',
    yield: '6–9 quintal per acre.',
    rotation: 'Superb after rice, cotton or jowar. Leaves nitrogen behind for the next cereal.',
    loop: 'Haulm is good fodder. The nitrogen it fixes is the single cheapest fertiliser on the farm.',
    bySoil: {
      black: 'The best chana soil in India — it holds exactly the residual moisture the crop needs. Sow immediately after the kharif harvest.',
      alluvial: 'Good, but keep it dry. Irrigated alluvium tends to produce leaf instead of pods.',
      red: 'Needs a protective irrigation because the soil stores so little. Lime first if pH is below 6.'
    }
  },
  {
    id: 'tur', name: 'Pigeon pea', local: 'Tur / Arhar', cat: 'pulse', sprite: 'berry',
    season: 'kharif', duration: '150–270 days',
    soils: ['black', 'red', 'alluvial'],
    window: 'With the monsoon, June to early July. Long-duration types are harvested the following January.',
    seed: '6–8 kg per acre.',
    spacing: '90 × 20 cm for long-duration, 60 × 20 cm for short. Wide rows let you intercrop.',
    prep: 'Deep ploughing — tur roots go down well over a metre, which is what makes it drought-proof.',
    water: 'Rainfed. It will find its own water once established.',
    feed: '10 kg urea, 50 kg DAP at sowing, with Rhizobium inoculation.',
    pests: 'Pod borer and pod fly. Wilt and sterility mosaic are managed by resistant varieties.',
    harvest: 'When 80% of pods are mature and dry. Cut the whole plant and thresh.',
    yield: '5–8 quintal per acre.',
    rotation: 'The classic intercrop — one row of tur to four of soybean, cotton, jowar or groundnut. You get the pulse almost for free.',
    loop: 'The woody stems are genuine household fuel, which takes pressure off the biogas plant. Deep roots break hardpan for the next crop.',
    bySoil: {
      black: 'Excellent, but it will not tolerate waterlogging — plant on ridges if the monsoon is heavy.',
      red: 'Very well suited. The deep taproot reaches moisture this soil cannot hold near the surface.',
      alluvial: 'Grows well; short-duration types fit the gap before wheat.'
    }
  },
  {
    id: 'moong', name: 'Green gram', local: 'Moong', cat: 'pulse', sprite: 'berry',
    season: 'kharif', duration: '60–70 days',
    soils: ['alluvial', 'black', 'red', 'arid'],
    window: 'Kharif with the monsoon, or — more usefully — as a summer catch crop in March–April between wheat and rice.',
    seed: '6 kg per acre kharif, 10 kg summer.',
    spacing: '30 × 10 cm.',
    prep: 'Light tillage. It fits into a 60-day window, so speed matters more than perfection.',
    water: 'Two or three irrigations for a summer crop; rainfed in kharif.',
    feed: '10 kg urea, 45 kg DAP per acre with Rhizobium.',
    pests: 'Yellow mosaic virus carried by whitefly is the main threat — grow a resistant variety and control whitefly early. Thrips at flowering.',
    harvest: 'Two or three pickings as pods blacken, or one cut when 80% are mature.',
    yield: '4–6 quintal per acre.',
    rotation: 'Perfect gap filler. A summer moong between wheat and rice adds a protein crop and 20–25 kg of nitrogen per acre to the following cereal.',
    loop: 'Ploughing the residue back in is close to a free green manure. Best protein-per-day-of-occupancy on the whole farm.',
    bySoil: {
      alluvial: 'Ideal for the summer slot in a rice-wheat system.',
      black: 'Good kharif crop; needs drainage in a heavy monsoon.',
      red: 'Reliable and undemanding.',
      arid: 'Grows on very little; a dependable kharif pulse in the desert districts.'
    }
  },
  {
    id: 'urad', name: 'Black gram', local: 'Urad', cat: 'pulse', sprite: 'berry',
    season: 'kharif', duration: '70–90 days',
    soils: ['alluvial', 'black', 'red'],
    window: 'Kharif with the monsoon, or rabi in the southern and eastern rice fallows.',
    seed: '8 kg per acre.',
    spacing: '30 × 10 cm.',
    prep: 'Light tillage; it tolerates a rougher seedbed than moong.',
    water: 'Rainfed in kharif. Rice-fallow urad runs entirely on residual moisture.',
    feed: '10 kg urea, 45 kg DAP with Rhizobium.',
    pests: 'Yellow mosaic virus again, plus leaf crinkle. Resistant varieties are the answer.',
    harvest: 'Single harvest when most pods have blackened.',
    yield: '4–6 quintal per acre.',
    rotation: 'Sown into rice fallows in the east and south, it produces a whole crop on land that would otherwise sit idle.',
    loop: 'Tolerates more shade and moisture than moong, so it fits the wetter corners of the farm.',
    bySoil: {
      alluvial: 'Good in both seasons.',
      black: 'Handles the heavier soil better than moong does.',
      red: 'Reliable, and a good rotation partner for ragi.'
    }
  },
  {
    id: 'moth', name: 'Moth bean', local: 'Moth', cat: 'pulse', sprite: 'berry',
    season: 'kharif', duration: '70–90 days',
    soils: ['arid'],
    window: 'With the first monsoon rain in July.',
    seed: '5–7 kg per acre.',
    spacing: 'Broadcast or 30 cm rows. It spreads and covers the ground itself.',
    prep: 'Minimal. This crop exists to grow where nothing else will.',
    water: 'Entirely rainfed. Among the most drought-tolerant pulses in the world.',
    feed: '20 kg DAP per acre is plenty.',
    pests: 'Few. Jassids in a dry spell.',
    harvest: 'When pods dry. The trailing habit makes hand harvest slow but simple.',
    yield: '2–4 quintal per acre.',
    rotation: 'With bajra and guar in the arid rotation.',
    loop: 'Its dense mat is genuine erosion control on sandy soil, and the haulm is valuable dry fodder.',
    bySoil: {
      arid: 'One of very few crops that yields reliably on 250–300 mm of rain. In the desert districts it belongs in every rotation.'
    }
  },

  // =========================================================================
  // OILSEEDS — the self-sufficiency gap most plans miss
  // =========================================================================
  {
    id: 'mustard', name: 'Mustard', local: 'Sarson', cat: 'oilseed', sprite: 'broccoli',
    season: 'rabi', duration: '110–140 days',
    soils: ['alluvial', 'arid', 'black', 'hill'],
    window: 'Sow 10–30 October. Later sowing runs into aphids and terminal heat together.',
    seed: '2 kg per acre — very small seed, mix with sand to spread it evenly.',
    spacing: '30 × 10 cm, seed 2–3 cm deep and no more.',
    prep: 'Fine, moist seedbed. Sow into moisture rather than sowing dry and irrigating.',
    water: 'Two irrigations, at branching and at siliqua filling. It will make a crop on one.',
    feed: '35 kg urea, 45 kg DAP per acre, plus 8 kg sulphur — mustard is a sulphur crop and the oil content drops noticeably without it.',
    pests: 'Mustard aphid is the major one, arriving in December–January. White rust and Alternaria blight in damp weather.',
    harvest: 'When pods turn yellow-brown and the seed is dark. Harvest slightly early and cure in a stack; fully dry pods shatter as you cut them.',
    yield: '6–8 quintal per acre, giving roughly 200–250 kg of oil.',
    rotation: 'After rice, bajra or a fallow. Do not follow mustard with another brassica.',
    loop: 'This is your household cooking oil. The oil cake left after crushing is excellent cattle feed and a strong organic fertiliser — nothing is wasted.',
    bySoil: {
      alluvial: 'The main mustard belt. Straightforward and dependable.',
      arid: 'The best rabi option in the desert districts — it makes a crop on two irrigations where wheat needs five.',
      black: 'Grows well on residual moisture. Sow early while the soil is still workable.',
      hill: 'Grown in valleys; local toria types mature faster and dodge the cold.'
    }
  },
  {
    id: 'groundnut', name: 'Groundnut', local: 'Moongphali', cat: 'oilseed', sprite: 'beetroot',
    season: 'kharif', duration: '100–130 days',
    soils: ['red', 'black', 'arid', 'coastal'],
    window: 'Kharif with monsoon onset. A summer crop from January under irrigation yields better and has fewer diseases.',
    seed: '40–50 kg of kernels per acre for bunch types.',
    spacing: '30 × 10 cm for bunch, 45 × 15 cm for spreading types.',
    prep: 'Loose, friable soil to at least 15 cm — the pegs must be able to push into it. This is why groundnut fails on heavy clay.',
    water: 'Critical at flowering and pegging. Do not irrigate during peg penetration itself; keep it just moist.',
    feed: '10 kg urea, 50 kg DAP, and 200 kg gypsum per acre applied at flowering — the gypsum supplies calcium directly to the developing pods and materially lifts pod filling.',
    pests: 'Leaf miner, white grub in light soils, and tikka leaf spot. Aflatoxin risk if pods are dried badly — dry fast and thoroughly.',
    harvest: 'When the inner shell shows dark veining. Lift, dry in windrows, then strip.',
    yield: '8–12 quintal of pods per acre.',
    rotation: 'Excellent before a cereal. Fixes nitrogen and leaves the soil loose.',
    loop: 'Oil for the kitchen, cake for the cattle, and haulm that is among the best fodder on the farm. One of the highest-value crops in an integrated system.',
    bySoil: {
      red: 'The classic groundnut soil — light, loose, well-drained. Lime if pH is below 6, and never skip the gypsum.',
      black: 'Yields well but harvesting is hard work; pods cling to the clay and losses are high. Lift at the right moisture.',
      arid: 'Works under irrigation on sandy soil. Watch for white grub.',
      coastal: 'Grown on the sandy uplands. Drainage is the constraint in the monsoon.'
    }
  },
  {
    id: 'sesame', name: 'Sesame', local: 'Til', cat: 'oilseed', sprite: 'celery',
    season: 'kharif', duration: '80–95 days',
    soils: ['red', 'alluvial', 'arid', 'coastal'],
    window: 'Kharif with the monsoon, or summer from February under irrigation.',
    seed: '1–1.5 kg per acre. Extremely fine seed — mix with sand.',
    spacing: '30 × 10 cm, sown barely 2 cm deep.',
    prep: 'Fine, weed-free, well-drained seedbed. Sesame cannot compete with weeds in its first month and will not tolerate standing water for a day.',
    water: 'Largely rainfed. One irrigation at flowering if available.',
    feed: '20 kg urea, 25 kg DAP per acre. A light feeder.',
    pests: 'Phyllody — a witches-broom disease spread by leafhoppers. Rogue out affected plants immediately. Leaf webber.',
    harvest: 'When leaves drop and capsules yellow. Cut, stack upright to cure, then shake the seed out on to a sheet.',
    yield: '2–4 quintal per acre.',
    rotation: 'A good short crop between two main ones.',
    loop: 'Very high oil content — around 50% — so a small area produces a real quantity of cooking oil. The cake is good cattle feed.',
    bySoil: {
      red: 'Well suited, and undemanding.',
      alluvial: 'Grows readily; drainage in a heavy monsoon is the only concern.',
      arid: 'Summer sesame under irrigation is a dependable arid-zone oilseed.',
      coastal: 'Only on the free-draining uplands, never in the wet season.'
    }
  },
  {
    id: 'soybean', name: 'Soybean', local: 'Soyabean', cat: 'oilseed', sprite: 'berry',
    season: 'kharif', duration: '95–110 days',
    soils: ['black', 'red', 'alluvial'],
    window: 'Sow between 20 June and 5 July, once 100 mm of rain has fallen. Sowing dry ahead of the monsoon is the commonest way to lose the crop.',
    seed: '28–32 kg per acre. Germination drops fast in storage — always test before sowing.',
    spacing: '45 × 5 cm.',
    prep: 'One deep ploughing, two harrowings. Broad-bed-and-furrow on black soil to shed excess water.',
    water: 'Rainfed. A protective irrigation at pod fill if there is a break in the monsoon.',
    feed: '10 kg urea, 60 kg DAP, 20 kg MOP and 8 kg sulphur per acre, with Rhizobium and PSB inoculation.',
    pests: 'Girdle beetle, stem fly, and defoliating caterpillars. Yellow mosaic virus in the north.',
    harvest: 'When leaves have dropped and pods rattle, at about 15% moisture. Delay causes shattering.',
    yield: '8–12 quintal per acre.',
    rotation: 'Soybean then wheat or chana is the standard Malwa rotation and it works.',
    loop: 'Oil plus a high-protein cake that transforms dairy rations. Fixes nitrogen for the rabi crop that follows.',
    bySoil: {
      black: 'The Madhya Pradesh and Maharashtra mainstay. Drainage is everything — soybean dies in 48 hours of standing water.',
      red: 'Yields less but works with lime and organic matter.',
      alluvial: 'Grown in the northern plains; keep the drainage sharp.'
    }
  },

  // =========================================================================
  // COMMERCIAL AND SPICE CROPS
  // =========================================================================
  {
    id: 'cotton', name: 'Cotton', local: 'Kapas', cat: 'cash', sprite: 'berry',
    season: 'kharif', duration: '160–200 days',
    soils: ['black', 'red', 'alluvial'],
    window: 'Sow with the monsoon in late May to June under irrigation, or with onset if rainfed.',
    seed: '1.5–2 packets of Bt hybrid per acre, or 5–6 kg of a desi variety.',
    spacing: '90 × 60 cm for hybrids; wider on deep black soil.',
    prep: 'Deep summer ploughing. On black soil, a broad-bed-and-furrow layout is close to essential.',
    water: 'Rainfed on deep black soil. Under irrigation, critical at squaring, flowering and boll development.',
    feed: '60 kg urea, 55 kg DAP, 25 kg MOP per acre in splits. A long-duration, hungry crop.',
    pests: 'Pink bollworm is now the dominant problem and resistance to Bt is widespread — pheromone traps, a strict end to the season, and destruction of stubble matter more than spraying. Whitefly, jassids, thrips.',
    harvest: 'Three to four pickings as bolls open, from October onwards. Keep pickings separate by quality.',
    yield: '8–12 quintal of seed cotton per acre.',
    rotation: 'Rotate with jowar, chana or a pulse. Continuous cotton builds pest pressure very fast.',
    loop: 'A cash crop rather than a food crop — it pays for the things the farm cannot make. Cotton seed cake is a standard dairy feed.',
    bySoil: {
      black: 'Rainfed cotton on deep black soil is the classic Vidarbha and Marathwada system. The soil\'s moisture store carries the crop through dry spells.',
      red: 'Only under irrigation; the soil cannot hold enough water for a rainfed crop.',
      alluvial: 'Irrigated cotton in Punjab, Haryana and north Rajasthan. Whitefly is the standing threat here.'
    }
  },
  {
    id: 'sugarcane', name: 'Sugarcane', local: 'Ganna', cat: 'cash', sprite: 'bamboo',
    season: 'perennial', duration: '10–18 months',
    soils: ['alluvial', 'black', 'coastal'],
    window: 'Autumn planting in September–October gives the best yields. Spring planting February–March is more common.',
    seed: '3,000–4,000 three-budded setts per acre, treated against scale and borer.',
    spacing: 'Rows 90–120 cm apart, setts end to end in the furrow.',
    prep: 'Deep ploughing and well-made furrows. The crop occupies the land for a year or more, so do this properly.',
    water: 'Very thirsty — 1,800–2,200 mm over the season. Drip irrigation cuts this by 40% and is heavily subsidised. On any water-constrained farm, drip is not optional.',
    feed: '110 kg urea, 55 kg DAP, 40 kg MOP per acre in three splits, plus heavy organic matter.',
    pests: 'Early shoot borer, top borer, and scale. Red rot is the serious disease — use certified disease-free setts.',
    harvest: 'At 10–12 months when brix peaks. Ratoon the stubble for a second and sometimes third crop at much lower cost.',
    yield: '350–450 quintal per acre.',
    rotation: 'Follow the final ratoon with a legume to restore the soil.',
    loop: 'Gur and jaggery can be made on-farm with simple equipment. Tops are excellent green fodder, and pressmud is a first-rate compost input.',
    bySoil: {
      alluvial: 'The main sugarcane belt. Water availability, not soil, is the limit.',
      black: 'High yielding under irrigation, but the water demand on clay soil needs careful drainage management.',
      coastal: 'Grown in the deltas. Watch salinity where groundwater is drawn hard.'
    }
  },
  {
    id: 'chilli', name: 'Chilli', local: 'Mirchi', cat: 'cash', sprite: 'pepper',
    season: 'kharif', duration: '150–180 days',
    soils: ['black', 'red', 'alluvial', 'coastal'],
    window: 'Nursery in May–June, transplant in July. A rabi crop transplanted in October also works under irrigation.',
    seed: '100 g per acre for the nursery.',
    spacing: '60 × 45 cm.',
    prep: 'Well-drained beds with heavy farmyard manure — 4 tonnes an acre.',
    water: 'Regular but never waterlogged. Drip plus mulch gives the best results by a wide margin.',
    feed: '50 kg urea, 60 kg DAP, 30 kg MOP per acre in splits.',
    pests: 'Thrips and mites cause leaf curl, which is the main yield killer. Anthracnose or fruit rot in wet weather. Rotate chemistry or resistance builds quickly.',
    harvest: 'Green chilli from 60 days in multiple pickings; dry red from 120 days. Sun-dry to 10% moisture.',
    yield: '8–10 quintal dry per acre.',
    rotation: 'Never after another solanaceous crop — tomato, brinjal or potato — or wilt will find you.',
    loop: 'High value in a small area, dries and stores easily, and needs no cold chain. Among the best cash crops for a small holding.',
    bySoil: {
      black: 'Guntur and Khammam chilli country. Deep soil holds moisture through the dry finish.',
      red: 'Good with organic matter and irrigation.',
      alluvial: 'Reliable under irrigation.',
      coastal: 'Grown widely, but fruit rot pressure in the monsoon is severe.'
    }
  },
  {
    id: 'turmeric', name: 'Turmeric', local: 'Haldi', cat: 'cash', sprite: 'leek',
    season: 'kharif', duration: '8–9 months',
    soils: ['red', 'alluvial', 'coastal', 'black'],
    window: 'Plant April to June, before or with the monsoon.',
    seed: '400–500 kg of rhizomes per acre.',
    spacing: '30 × 20 cm on raised beds or ridges.',
    prep: 'Deep, loose, well-drained soil with 4 tonnes of farmyard manure an acre. Raised beds are important — rhizomes rot in standing water.',
    water: 'Regular through the growing season, tapering off from the seventh month.',
    feed: '25 kg urea, 30 kg DAP, 25 kg MOP per acre, plus heavy mulching with green leaves at planting and again at 45 days.',
    pests: 'Rhizome rot and leaf blotch in wet conditions. Shoot borer.',
    harvest: 'When leaves yellow and dry, at 8–9 months. Boil, dry and polish the rhizomes.',
    yield: '80–100 quintal fresh per acre, about a fifth of that after curing.',
    rotation: 'A long-duration crop; follow with a legume.',
    loop: 'Stores for years once cured, needs no cold chain, and is worth several times its raw value once processed on-farm.',
    bySoil: {
      red: 'Very well suited — loose soil makes both growth and harvest easy.',
      alluvial: 'High yielding under irrigation.',
      coastal: 'Traditional crop here; drainage is the whole battle.',
      black: 'Yields well but harvesting from clay is heavy work.'
    }
  },
  {
    id: 'ginger', name: 'Ginger', local: 'Adrak', cat: 'cash', sprite: 'leek',
    season: 'kharif', duration: '7–8 months',
    soils: ['coastal', 'hill', 'red'],
    window: 'Plant April to May with the pre-monsoon showers.',
    seed: '600–800 kg of rhizomes per acre.',
    spacing: '25 × 20 cm on raised beds.',
    prep: 'Raised beds 25 cm high with generous organic matter. Partial shade suits it well, which makes it a natural understorey crop in an orchard.',
    water: 'Consistent moisture, never waterlogged.',
    feed: 'Heavy mulch at planting, 40 days and 90 days. 25 kg urea, 30 kg DAP, 25 kg MOP per acre.',
    pests: 'Soft rot is the serious one — beds must drain freely. Shoot borer, and nematodes in continuous cropping.',
    harvest: 'From 7 months for fresh ginger, 8 months for dry.',
    yield: '60–80 quintal fresh per acre.',
    rotation: 'Do not replant on the same ground for three years — rot and nematodes build up.',
    loop: 'Grows in orchard shade, so it uses land that is otherwise only producing fruit.',
    bySoil: {
      coastal: 'Ideal — high rainfall, high organic matter, provided the beds are raised.',
      hill: 'Excellent quality from the north-eastern hills.',
      red: 'Works with heavy organic amendment and reliable irrigation.'
    }
  },
  {
    id: 'guar', name: 'Cluster bean', local: 'Guar', cat: 'cash', sprite: 'berry',
    season: 'kharif', duration: '90–110 days',
    soils: ['arid', 'alluvial'],
    window: 'With the monsoon, July.',
    seed: '6–8 kg per acre.',
    spacing: '45 × 20 cm.',
    prep: 'Minimal tillage on sandy soil.',
    water: 'Rainfed. Highly drought tolerant.',
    feed: '20 kg DAP per acre with Rhizobium. It fixes its own nitrogen.',
    pests: 'Jassids, and bacterial blight in a wet year.',
    harvest: 'Pods when dry and brown, or tender pods as a vegetable from 45 days.',
    yield: '4–6 quintal of seed per acre.',
    rotation: 'With bajra and moth in the arid rotation.',
    loop: 'Three uses from one crop: a vegetable, a fodder, and a seed with a genuine export market for guar gum. Fixes nitrogen while doing it.',
    bySoil: {
      arid: 'A mainstay of western Rajasthan and one of the few crops there with a real cash market.',
      alluvial: 'Grown as a summer vegetable and green manure.'
    }
  },

  // =========================================================================
  // FODDER — the crop that feeds the crop
  // =========================================================================
  {
    id: 'napier', name: 'Hybrid napier', local: 'Napier bajra', cat: 'fodder', sprite: 'tallgrass',
    season: 'perennial', duration: 'Cuts every 45 days for 3–4 years',
    soils: ['alluvial', 'black', 'red', 'coastal', 'hill'],
    window: 'Plant rooted slips or stem cuttings in February–March or with the monsoon.',
    seed: '8,000–10,000 rooted slips per acre.',
    spacing: '60 × 60 cm.',
    prep: 'Deep ploughing with 4 tonnes of farmyard manure an acre. It occupies the land for years, so prepare properly.',
    water: 'Irrigate every 10–15 days in summer. Very responsive — yield tracks water almost linearly.',
    feed: '25 kg urea per acre after every cut. This is a cut-and-come-again crop and it is hungry.',
    pests: 'Very few. Occasional stem borer.',
    harvest: 'First cut at 70–75 days, then every 40–45 days. Cut at 10–15 cm above ground, never lower.',
    yield: '800–1,000 quintal of green fodder per acre per year — the highest biomass of anything on the farm.',
    rotation: 'Replant every 3–4 years when the clumps thin out.',
    loop: 'This is the crop that makes the whole integrated system work. Roughly a quarter-acre of napier feeds one dairy animal year-round, whose dung feeds the biogas plant, whose slurry feeds the vegetables. Do not treat fodder as an afterthought.',
    bySoil: {
      alluvial: 'Outstanding yields under irrigation.',
      black: 'Grows very well; ensure drainage in the monsoon.',
      red: 'Responds hugely to organic matter and irrigation.',
      coastal: 'Thrives in high rainfall.',
      hill: 'Planted along terrace risers, where it holds the soil and feeds the animals at the same time.'
    }
  },
  {
    id: 'berseem', name: 'Berseem clover', local: 'Berseem', cat: 'fodder', sprite: 'lettuce',
    season: 'rabi', duration: '5–6 cuts, October to May',
    soils: ['alluvial', 'black', 'hill'],
    window: 'Sow late October. Delay past mid-November and you lose one or two cuts.',
    seed: '8–10 kg per acre, inoculated with Rhizobium the first time you grow it.',
    spacing: 'Broadcast into standing water on a well-levelled field.',
    prep: 'Fine, level seedbed. Level ground matters because it is irrigated by flooding.',
    water: 'Every 10–12 days through winter, and after every cut.',
    feed: '10 kg urea and 50 kg DAP per acre at sowing. Fixes its own nitrogen thereafter.',
    pests: 'Stem rot in waterlogged patches. Very few otherwise.',
    harvest: 'First cut at 50–55 days, then every 25–30 days.',
    yield: '350–450 quintal of green fodder per acre over the season.',
    rotation: 'The winter partner to napier. Between them they cover the year.',
    loop: 'High-protein green fodder through winter, exactly when milk yield would otherwise fall. Add a little mustard fodder to the mix to avoid bloat.',
    bySoil: {
      alluvial: 'Its home ground — the standard north Indian winter fodder.',
      black: 'Grows well; sow into good moisture.',
      hill: 'Grown in valleys where winter irrigation is available.'
    }
  },
  {
    id: 'lucerne', name: 'Lucerne', local: 'Rijka / Alfalfa', cat: 'fodder', sprite: 'lettuce',
    season: 'perennial', duration: '8–10 cuts a year for 2–3 years',
    soils: ['black', 'arid', 'alluvial', 'red'],
    window: 'Sow October–November.',
    seed: '8–10 kg per acre with Rhizobium.',
    spacing: 'Rows 30 cm apart.',
    prep: 'Deep ploughing — the taproot goes down two metres, which is what makes it drought-proof. Needs neutral to alkaline soil; lime acid soils first.',
    water: 'Every 15–20 days. Far less than berseem for a comparable protein yield.',
    feed: '50 kg DAP at sowing, then 20 kg of single super phosphate after every second cut.',
    pests: 'Lucerne weevil, aphids. Dodder is a real problem — buy clean seed.',
    harvest: 'First cut at 65–70 days, then every 25–30 days at 10% flowering.',
    yield: '400–500 quintal green per acre per year, at a higher protein content than berseem.',
    rotation: 'Occupies the block for two to three years, then follow with a cereal that will use the nitrogen it leaves.',
    loop: 'The best perennial protein fodder for dry regions. Deep roots mean it keeps producing in a drought when berseem has failed.',
    bySoil: {
      black: 'Excellent — deep soil suits the taproot perfectly.',
      arid: 'The most dependable irrigated fodder in the desert districts.',
      alluvial: 'Good, though berseem usually out-yields it here.',
      red: 'Needs lime and phosphorus, then performs well.'
    }
  }
];
