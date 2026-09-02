// ---------------------------------------------------------------------------
// Kitchen garden and orchard. Appended to the same CROPS list.
//
// The vegetable plot is small in area and large in importance: at the 3-acre
// baseline it is 0.3 acre feeding the household daily, year round. Plan it as
// a staggered succession, never as one big planting.
// ---------------------------------------------------------------------------

CROPS.push(

  // =========================================================================
  // VEGETABLES
  // =========================================================================
  {
    id: 'tomato', name: 'Tomato', local: 'Tamatar', cat: 'veg', sprite: 'tomato',
    season: 'rabi', duration: '120–150 days',
    soils: ['alluvial', 'black', 'red', 'hill', 'coastal'],
    window: 'Main crop: nursery in June–July, transplant August. Rabi: nursery October, transplant November. In the hills, a summer crop.',
    seed: '100 g per acre raised in a nursery bed.',
    spacing: '60 × 45 cm. Stake or trellis indeterminate types — fruit lying on soil rots.',
    prep: 'Raised beds with 4 tonnes of farmyard manure an acre. Drainage matters more than fertility.',
    water: 'Steady and even. Irregular watering splits fruit and causes blossom-end rot. Drip with plastic or straw mulch is the single biggest quality improvement available.',
    feed: '40 kg urea, 50 kg DAP, 25 kg MOP per acre in splits, plus calcium if blossom-end rot appears.',
    pests: 'Fruit borer, whitefly carrying leaf curl virus, and early and late blight. Marigold as a border trap crop genuinely helps with borer.',
    harvest: 'From 70 days after transplanting, every two or three days for two months.',
    yield: '100–150 quintal per acre.',
    rotation: 'Never after potato, brinjal or chilli. Three-year gap on the same bed.',
    loop: 'The highest-value bed in the kitchen garden. Surplus dries or becomes purée, so a glut is not wasted.',
    bySoil: {
      alluvial: 'Reliable and high yielding.',
      black: 'Excellent flavour and yield, but the beds must be raised properly.',
      red: 'Needs organic matter and steady irrigation; responds very well to both.',
      hill: 'Summer tomato in the hills is high quality and reaches the plains when nothing else is cropping.',
      coastal: 'Grow in the dry season only — monsoon blight pressure is unmanageable.'
    }
  },
  {
    id: 'brinjal', name: 'Brinjal', local: 'Baingan', cat: 'veg', sprite: 'eggplant',
    season: 'perennial', duration: '150–180 days, picked continuously',
    soils: ['alluvial', 'black', 'red', 'coastal'],
    window: 'Can be transplanted in almost any month with irrigation. Main plantings June–July and October–November.',
    seed: '150 g per acre in a nursery.',
    spacing: '75 × 60 cm.',
    prep: 'Well-manured, well-drained beds.',
    water: 'Every 7–10 days. Tolerates more heat and neglect than tomato.',
    feed: '45 kg urea, 50 kg DAP, 25 kg MOP per acre in splits.',
    pests: 'Shoot and fruit borer is constant. Clip and destroy wilted shoots twice a week — mechanical removal works better than spraying. Bacterial wilt in wet soil.',
    harvest: 'From 60 days, then every 4–5 days for months on end.',
    yield: '120–200 quintal per acre.',
    rotation: 'Same solanaceous rule — no potato, tomato or chilli before it.',
    loop: 'The most productive and forgiving vegetable in an Indian kitchen garden. One planting feeds a household for half a year.',
    bySoil: {
      alluvial: 'Very high yielding.',
      black: 'Excellent, given drainage.',
      red: 'Good with organic matter.',
      coastal: 'Grows year round; wilt is the main constraint in wet soil.'
    }
  },
  {
    id: 'okra', name: 'Okra', local: 'Bhindi', cat: 'veg', sprite: 'pepper',
    season: 'kharif', duration: '90–110 days',
    soils: ['alluvial', 'black', 'red', 'arid', 'coastal'],
    window: 'Summer sowing February–March, kharif sowing June–July.',
    seed: '4 kg per acre summer, 2.5 kg kharif. Soak seed overnight before sowing.',
    spacing: '45 × 30 cm.',
    prep: 'Ordinary well-drained beds. Undemanding.',
    water: 'Every 7–10 days; more often in summer.',
    feed: '35 kg urea, 40 kg DAP, 20 kg MOP per acre.',
    pests: 'Jassids, whitefly and yellow vein mosaic virus. Shoot and fruit borer. Grow a tolerant variety.',
    harvest: 'From 45 days, every other day. Pick young — an okra pod goes from tender to fibrous in about 48 hours.',
    yield: '50–70 quintal per acre.',
    rotation: 'Fits anywhere; a good short crop between two longer ones.',
    loop: 'Fast, hardy, heat-tolerant, and productive right through the hottest months when little else is cropping.',
    bySoil: {
      alluvial: 'Straightforward.', black: 'Good, with drainage.',
      red: 'Reliable.', arid: 'Grows well in summer under irrigation.',
      coastal: 'Year-round crop.'
    }
  },
  {
    id: 'onion', name: 'Onion', local: 'Pyaz', cat: 'veg', sprite: 'onion',
    season: 'rabi', duration: '120–150 days',
    soils: ['black', 'alluvial', 'red'],
    window: 'Rabi nursery in October, transplant December, harvest April. Kharif nursery June, transplant July–August.',
    seed: '3–4 kg per acre in a nursery.',
    spacing: '15 × 10 cm on raised beds.',
    prep: 'Fine, level, well-drained beds with 4 tonnes of farmyard manure. Onion has shallow roots and will not push through a crust.',
    water: 'Every 8–10 days. Stop irrigating 15 days before harvest — this is what makes bulbs store.',
    feed: '45 kg urea, 50 kg DAP, 30 kg MOP per acre, plus 8 kg sulphur, which drives both pungency and storage life.',
    pests: 'Thrips are the main pest. Purple blotch and stemphylium blight in humid weather.',
    harvest: 'When 50–70% of tops have fallen over. Cure in the shade for two weeks before storing.',
    yield: '100–140 quintal per acre.',
    rotation: 'After a cereal or a legume, never after another onion.',
    loop: 'Stores for six months in a simple ventilated structure with no cold chain — one of the few vegetables that genuinely bridges the lean season.',
    bySoil: {
      black: 'The Nashik and Deccan onion belt. Excellent storage quality.',
      alluvial: 'High yielding; storage life is slightly shorter.',
      red: 'Good with organic matter and irrigation.'
    }
  },
  {
    id: 'potato', name: 'Potato', local: 'Aloo', cat: 'veg', sprite: 'potato',
    season: 'rabi', duration: '90–120 days',
    soils: ['alluvial', 'hill', 'black'],
    window: 'Plains: plant mid-October to mid-November, once soil temperature drops below 30°C. Hills: February–April.',
    seed: '600–800 kg of seed tubers per acre. Use certified seed — this is where most potato failures begin.',
    spacing: '60 × 20 cm on ridges.',
    prep: 'Deep, loose, friable soil. Ridge properly, and earth up at 30 days — exposed tubers turn green and are inedible.',
    water: 'Light and frequent, every 7–10 days. Never let ridges dry out and then flood them; that cracks tubers.',
    feed: '75 kg urea, 60 kg DAP, 40 kg MOP per acre. A heavy feeder.',
    pests: 'Late blight in cool damp weather is the destroyer — scout daily from December and act on the first lesion. Aphids spread viruses; potato tuber moth in storage.',
    harvest: 'When the haulm yellows. Dehaulm 10 days before lifting so skins set.',
    yield: '100–140 quintal per acre.',
    rotation: 'After rice or maize. Never after tomato or brinjal.',
    loop: 'Calorie-dense, high yield per acre, and stores for months in a cool dark room without processing.',
    bySoil: {
      alluvial: 'The main potato belt — deep loose soil, cool winter, irrigation to hand.',
      hill: 'Best seed potato comes from the hills, where aphid pressure and therefore virus load are low.',
      black: 'Grows, but heavy soil makes lifting hard and misshapes tubers.'
    }
  },
  {
    id: 'cauliflower', name: 'Cauliflower & cabbage', local: 'Phool gobhi / Patta gobhi', cat: 'veg', sprite: 'cauliflower',
    season: 'rabi', duration: '90–120 days',
    soils: ['alluvial', 'hill', 'black', 'red'],
    window: 'Early types nursery in May–June; main season nursery September–October, transplant a month later.',
    seed: '250 g per acre for cauliflower, 200 g for cabbage.',
    spacing: '45 × 45 cm.',
    prep: 'Rich, well-manured, moisture-retentive beds.',
    water: 'Every 8–10 days. Steady moisture — a check in growth produces buttoning, where the plant makes a tiny useless curd.',
    feed: '50 kg urea, 50 kg DAP, 25 kg MOP per acre, plus borax where hollow stem or browning curds appear.',
    pests: 'Diamondback moth is the major one and resistant to most chemistry — use Bt sprays and a mustard trap crop border. Aphids, and black rot in humid weather.',
    harvest: 'Cut when curds are compact and still white. Tie outer leaves over the curd a week before to keep it from yellowing.',
    yield: '80–120 quintal per acre.',
    rotation: 'Do not follow with another brassica, including mustard.',
    loop: 'Outer leaves and trimmings are excellent green fodder — nothing needs to leave the farm.',
    bySoil: {
      alluvial: 'The main winter belt.',
      hill: 'Summer cauliflower in the hills fills the plains gap and fetches a premium.',
      black: 'Good in winter with drainage.',
      red: 'Needs generous organic matter.'
    }
  },
  {
    id: 'gourds', name: 'Gourds & cucurbits', local: 'Lauki, tori, karela, kaddu', cat: 'veg', sprite: 'pumpkin',
    season: 'zaid', duration: '90–120 days',
    soils: ['alluvial', 'black', 'red', 'coastal', 'arid'],
    window: 'Summer sowing January–February, kharif sowing June–July.',
    seed: '1–2 kg per acre depending on species.',
    spacing: 'Pits 1.5–2 m apart, 3 seeds per pit thinned to 2.',
    prep: 'Pits filled with a bucket of compost each. Trellising doubles usable yield in a small garden and keeps fruit clean.',
    water: 'Every 5–7 days in summer.',
    feed: 'Compost in the pit plus 25 kg urea per acre in two splits.',
    pests: 'Fruit fly is the main problem — bait traps and prompt removal of stung fruit. Downy and powdery mildew. Red pumpkin beetle at the seedling stage.',
    harvest: 'Tender, every 2–3 days. Pumpkin and ash gourd can be left to mature for storage.',
    yield: '60–120 quintal per acre depending on species.',
    rotation: 'Fits after a rabi crop, using the summer gap.',
    loop: 'Grown vertically on a trellis over a path or pond edge, gourds produce food from space that is not costing you cropping area. Pumpkin and ash gourd store for months without processing.',
    bySoil: {
      alluvial: 'Excellent.', black: 'Good with drainage.', red: 'Responds to organic matter.',
      coastal: 'Year-round on trellises above the wet ground.',
      arid: 'Summer crop under drip; needs shade netting in extreme heat.'
    }
  },
  {
    id: 'greens', name: 'Leafy greens', local: 'Palak, methi, sarson ka saag, amaranth', cat: 'veg', sprite: 'lettuce',
    season: 'rabi', duration: '30–60 days, cut repeatedly',
    soils: ['alluvial', 'black', 'red', 'coastal', 'hill', 'arid'],
    window: 'Sow any month with irrigation. Best from September to February; amaranth carries the summer.',
    seed: '4–6 kg per acre for spinach, 8–10 kg for fenugreek.',
    spacing: 'Rows 20–25 cm apart, or broadcast on beds.',
    prep: 'Fine seedbed, heavily manured. These crops are all leaf, so nitrogen and moisture are everything.',
    water: 'Every 5–7 days. Never let them check, or the leaves toughen and bolt.',
    feed: '25 kg urea per acre after each cut. Biogas slurry is close to ideal here.',
    pests: 'Leaf miner and aphids. Very few serious problems in a 40-day crop.',
    harvest: 'First cut at 25–30 days, then every 15–20 days for three or four cuts.',
    yield: '40–60 quintal per acre across all cuts.',
    rotation: 'Slots into any gap. Sow a short strip every three weeks rather than one big bed.',
    loop: 'The fastest return of any crop on the farm and the most direct use for biogas slurry. This is where daily nutrition actually comes from — sow a little, often.',
    bySoil: {
      alluvial: 'Ideal.', black: 'Good.', red: 'Needs organic matter but responds fast.',
      coastal: 'Amaranth handles the monsoon better than spinach.',
      hill: 'Excellent in summer.', arid: 'Winter crop under drip.'
    }
  },
  {
    id: 'rootveg', name: 'Carrot, radish & beetroot', local: 'Gajar, mooli, chukandar', cat: 'veg', sprite: 'carrot',
    season: 'rabi', duration: '45–110 days',
    soils: ['alluvial', 'red', 'hill', 'black'],
    window: 'Radish from August to February. Carrot and beetroot sown October–November.',
    seed: '2 kg per acre carrot, 4 kg radish, 3 kg beetroot.',
    spacing: '30 × 8 cm on ridges or raised beds.',
    prep: 'Deep, loose, stone-free soil worked to 25 cm. Any clod or stone forks the root and makes it unsellable.',
    water: 'Every 8–10 days, evenly. Irregular water splits roots.',
    feed: '30 kg urea, 40 kg DAP, 30 kg MOP per acre. Do not use fresh manure — it forks the roots.',
    pests: 'Very few. Aphids on carrot foliage.',
    harvest: 'Radish from 45 days, carrot from 90, beetroot from 80. Do not leave radish in the ground — it turns pithy fast.',
    yield: '80–120 quintal per acre.',
    rotation: 'Excellent after a heavy feeder; they use residual fertility.',
    loop: 'Tops are good fodder. Radish sown thickly and dug in is also a useful biofumigant against soil pests.',
    bySoil: {
      alluvial: 'Ideal — deep and loose.',
      red: 'Well suited, being naturally light.',
      hill: 'Excellent carrot quality in cool weather.',
      black: 'Difficult — heavy clay forks the roots badly. Grow on raised, well-worked beds or skip it.'
    }
  },

  // =========================================================================
  // FRUIT AND TREES  — the boundary, planted once and cropping for decades
  // =========================================================================
  {
    id: 'mango', name: 'Mango', local: 'Aam', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: 'Fruits from year 4–5, cropping for 40+ years',
    soils: ['alluvial', 'black', 'red', 'coastal'],
    window: 'Plant grafted saplings with the monsoon in July–August, or in February where irrigation is reliable.',
    seed: 'Grafted plants only. A seedling mango takes 8 years and will not come true.',
    spacing: '10 × 10 m — about 40 trees an acre. On a boundary, 10 m apart in a single row.',
    prep: 'Pits 1 × 1 × 1 m dug a month ahead and refilled with topsoil, 15 kg of compost and a little single super phosphate.',
    water: 'Weekly for the first two years, then only during flowering and fruit set. Withhold water for two months before flowering — this is what triggers the crop.',
    feed: 'Scale with age: by year 10, roughly 50 kg compost, 1 kg urea, 1 kg single super phosphate and 1 kg muriate of potash per tree per year.',
    pests: 'Mango hopper at flowering, fruit fly at maturity, and powdery mildew on the panicles. Anthracnose in wet weather.',
    harvest: 'From year 4–5 for grafted trees, May–July depending on variety and region.',
    yield: 'A mature tree gives 100–200 kg a year.',
    rotation: 'Intercrop the alleys with pulses or vegetables for the first four years while the trees are small.',
    loop: 'Planted on the boundary it costs you no cropping land, gives shade and a windbreak, and produces for decades on almost no input. Prunings are fuel.',
    bySoil: {
      alluvial: 'Excellent — the Uttar Pradesh and Bihar mango belt.',
      black: 'Grows well if drainage is good; avoid low spots that hold water.',
      red: 'Very well suited, and the fruit quality is often better than on richer soil.',
      coastal: 'The Alphonso and Ratnagiri country; needs good drainage on laterite.'
    }
  },
  {
    id: 'guava', name: 'Guava', local: 'Amrud', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: 'Fruits from year 2–3',
    soils: ['alluvial', 'black', 'red', 'arid', 'coastal'],
    window: 'Plant with the monsoon.',
    seed: 'Grafted or air-layered plants.',
    spacing: '6 × 6 m, about 110 trees an acre. High-density planting at 3 × 3 m gives faster returns.',
    prep: 'Pits 60 cm cube with compost.',
    water: 'Every 10–15 days when young; a mature tree needs very little.',
    feed: '25 kg compost plus 500 g urea per tree a year at maturity.',
    pests: 'Fruit fly is the main one — bait traps and prompt collection of fallen fruit. Wilt in waterlogged soil.',
    harvest: 'Two crops a year. Prune after the monsoon crop to shift production to the better-quality winter crop.',
    yield: '50–80 kg per tree.',
    rotation: 'Nothing needed; it is a permanent planting.',
    loop: 'The most forgiving fruit tree in India. Bears in two to three years, tolerates poor soil, salinity and drought, and needs almost no care. If you plant one fruit tree, plant this.',
    bySoil: {
      alluvial: 'Excellent.', black: 'Very good with drainage.',
      red: 'Well suited and undemanding.',
      arid: 'One of the few fruit trees that genuinely produces in the desert districts.',
      coastal: 'Grows well; fruit fly pressure is heavy.'
    }
  },
  {
    id: 'banana', name: 'Banana', local: 'Kela', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: '12–15 months to first bunch, then ratoons',
    soils: ['alluvial', 'coastal', 'black', 'red'],
    window: 'Plant February–March or with the monsoon.',
    seed: 'Tissue-culture plants, or sword suckers from a healthy clump. 1,200–1,500 plants an acre.',
    spacing: '1.8 × 1.8 m.',
    prep: 'Pits 45 cm cube with 10 kg compost each. Deep, rich, well-drained soil.',
    water: 'Very thirsty and shallow-rooted — weekly, or drip. Drip plus fertigation roughly doubles water efficiency here.',
    feed: 'Heavy: 200 g nitrogen, 60 g phosphorus and 300 g potash per plant per year, in splits. Potash drives bunch weight.',
    pests: 'Panama wilt is the serious disease — it lives in the soil for decades, so use clean planting material and resistant types. Bunchy top virus spread by aphids; rhizome weevil.',
    harvest: 'Bunch at 12–15 months. Prop heavy bunches or the pseudostem snaps.',
    yield: '20–30 kg per bunch, 250–350 quintal an acre.',
    rotation: 'Two or three ratoon crops, then rotate the block out for a season.',
    loop: 'Produces food within a year of planting — far faster than any other fruit. Pseudostems and leaves are green fodder and excellent compost bulk.',
    bySoil: {
      alluvial: 'High yielding under irrigation.',
      coastal: 'Its natural home; abundant rain suits it.',
      black: 'Very good, given drainage.',
      red: 'Needs heavy organic matter and steady water.'
    }
  },
  {
    id: 'papaya', name: 'Papaya', local: 'Papita', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: 'Fruits from 8–10 months, productive 2–3 years',
    soils: ['alluvial', 'red', 'coastal', 'black'],
    window: 'Plant seedlings February–March or with the monsoon.',
    seed: '100 g of seed per acre raised in bags. Plant three per pit and keep one female or hermaphrodite after flowering.',
    spacing: '2 × 2 m, about 1,000 plants an acre.',
    prep: 'Pits 45 cm cube with compost. Absolutely requires free drainage — papaya collar-rots in a week of standing water.',
    water: 'Every 7–10 days. Never let water stand against the stem; irrigate in a ring, not at the collar.',
    feed: '250 g each of nitrogen, phosphorus and potash per plant per year in six splits.',
    pests: 'Papaya ring spot virus is the limiting factor almost everywhere — it is why plantations are replaced every three years. Mealybug, fruit fly.',
    harvest: 'From 8–10 months, continuously.',
    yield: '40–60 kg per plant a year.',
    rotation: 'Replant on fresh ground every 3 years.',
    loop: 'The fastest fruit on the farm and the best return per square metre in the kitchen garden. Green papaya is a vegetable, so it feeds you before it even ripens.',
    bySoil: {
      alluvial: 'Excellent with drainage.', red: 'Well suited, being naturally free-draining.',
      coastal: 'Grows fast; virus pressure is high.',
      black: 'Only on raised mounds — this soil holds too much water for papaya otherwise.'
    }
  },
  {
    id: 'lemon', name: 'Lemon & lime', local: 'Nimbu', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: 'Fruits from year 3, cropping 25+ years',
    soils: ['alluvial', 'black', 'red', 'arid', 'coastal'],
    window: 'Plant with the monsoon.',
    seed: 'Grafted or air-layered plants.',
    spacing: '5 × 5 m, about 160 trees an acre; 6 m apart on a boundary row.',
    prep: 'Pits 60 cm cube with compost. Good drainage is essential — citrus will not tolerate wet feet.',
    water: 'Every 10–15 days. Water in a basin away from the trunk to avoid collar rot.',
    feed: '20 kg compost, 500 g urea, 300 g single super phosphate and 300 g muriate of potash per mature tree per year. Citrus is prone to zinc and iron deficiency — a foliar micronutrient spray twice a year is worth it.',
    pests: 'Citrus canker in wet weather, leaf miner on new flushes, and the citrus psylla that spreads greening disease. Remove and burn affected shoots.',
    harvest: 'Main crop after the monsoon, with scattered fruit through the year.',
    yield: '1,000–1,500 fruit per mature tree annually.',
    rotation: 'Permanent planting.',
    loop: 'Crops nearly year round, needs little space, and fruit keeps well. Two or three trees by the kitchen door cover a household completely.',
    bySoil: {
      alluvial: 'Very good.', black: 'Needs raised planting and sharp drainage.',
      red: 'Well suited.', arid: 'Kagzi lime does well under drip in the desert districts.',
      coastal: 'Grows readily; canker pressure is heavy in the monsoon.'
    }
  },
  {
    id: 'moringa', name: 'Moringa', local: 'Sahjan / Drumstick', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: 'Pods from 8–12 months',
    soils: ['red', 'arid', 'black', 'alluvial', 'coastal'],
    window: 'Sow seed or plant cuttings with the monsoon. It grows from a stuck branch.',
    seed: 'Direct sow 2–3 seeds per pit.',
    spacing: '2.5 × 2.5 m for annual types, 5 m for perennial. Also planted as a live fence.',
    prep: 'A pit and some compost. This tree asks for very little.',
    water: 'Almost none once established. Extremely drought hardy.',
    feed: '10 kg compost per plant a year is generous.',
    pests: 'Hairy caterpillar, pod fly, and occasional bud worm. Rarely serious.',
    harvest: 'Pods from 8–12 months, then twice a year. Leaves can be picked continuously.',
    yield: '200–400 pods per tree a year.',
    rotation: 'Cut back hard after each harvest to keep pods within reach.',
    loop: 'Nutritionally the most valuable thing you can plant for the effort involved — the leaves are exceptionally high in iron, calcium, protein and vitamin A, and they are available in the lean months when nothing else is green. Leaves are also excellent fodder, and the seed cake clarifies muddy water.',
    bySoil: {
      red: 'Thrives.', arid: 'One of the best trees for dry land anywhere in India.',
      black: 'Grows well with drainage.', alluvial: 'Fast and productive.',
      coastal: 'Grows readily; prune to control its height.'
    }
  },
  {
    id: 'coconut', name: 'Coconut', local: 'Nariyal', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: 'Bears from year 5–7, productive 60+ years',
    soils: ['coastal', 'alluvial', 'red'],
    window: 'Plant with the monsoon, May–June.',
    seed: 'Nine to twelve-month-old seedlings from a reputable nursery. Dwarf types bear sooner and are far easier to harvest.',
    spacing: '7.5 × 7.5 m, about 70 palms an acre.',
    prep: 'Pits 1 m cube, refilled with topsoil, compost and sand if the soil is heavy.',
    water: 'Weekly for the first three years. A mature palm wants 600–800 litres a week in summer — drip basin irrigation is the efficient way to give it.',
    feed: '50 kg compost, 1 kg urea, 1.5 kg single super phosphate and 2 kg muriate of potash per palm per year. Coconut is a heavy potash feeder, and salt applied around the basin genuinely helps.',
    pests: 'Rhinoceros beetle and red palm weevil. Root wilt in Kerala. Keep the crown clean of decaying matter.',
    harvest: 'Every 45–60 days once bearing, roughly 8 harvests a year.',
    yield: '80–150 nuts per palm a year.',
    rotation: 'Intercrop the interspaces with banana, pineapple, turmeric or ginger — a coconut garden uses only about a quarter of its ground.',
    loop: 'Oil, food, drink, fibre, thatch, fuel and fencing from one tree. In coastal systems the coconut garden is the frame everything else is grown inside.',
    bySoil: {
      coastal: 'Its home. Sandy, saline-tolerant, high rainfall.',
      alluvial: 'Good in the deltas with drainage.',
      red: 'Grows with irrigation and heavy organic matter; yields lower than on the coast.'
    }
  },
  {
    id: 'cashew', name: 'Cashew', local: 'Kaju', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: 'Nuts from year 3–4',
    soils: ['coastal', 'red'],
    window: 'Plant grafted saplings with the monsoon.',
    seed: 'Grafted plants only.',
    spacing: '7 × 7 m, about 80 trees an acre.',
    prep: 'Pits 60 cm cube. Cashew grows on land nothing else will use — poor, stony laterite slopes are fine.',
    water: 'Only in the first two years. Rainfed thereafter.',
    feed: '10 kg compost, 500 g urea, 300 g single super phosphate per tree a year.',
    pests: 'Tea mosquito bug is the major pest, attacking flushes and panicles. Stem and root borer.',
    harvest: 'February to May. Collect fallen nuts; do not pick from the tree.',
    yield: '5–10 kg of raw nuts per mature tree.',
    rotation: 'Permanent.',
    loop: 'Produces a genuinely high-value crop on marginal laterite that would otherwise carry nothing. Also an effective windbreak on exposed coastal land.',
    bySoil: {
      coastal: 'The Konkan and Malabar cashew belt; ideal.',
      red: 'Grows well on poor plateau soil.'
    }
  },
  {
    id: 'apple', name: 'Apple', local: 'Seb', cat: 'fruit', sprite: 'tree',
    season: 'perennial', duration: 'Fruits from year 4–6',
    soils: ['hill'],
    window: 'Plant dormant saplings January–February.',
    seed: 'Grafted plants on a chosen rootstock. Plant at least two compatible varieties — apples need cross-pollination.',
    spacing: '4 × 4 m on semi-dwarf rootstock, about 250 trees an acre.',
    prep: 'Pits 1 m cube. Needs 1,000–1,600 chilling hours below 7°C, which effectively means above 1,500 m.',
    water: 'Weekly through the growing season. Critical during fruit sizing.',
    feed: '30 kg compost plus balanced fertiliser scaled to tree age, applied in late winter.',
    pests: 'Apple scab in wet springs, codling moth, San José scale, and woolly aphid on the roots.',
    harvest: 'August to October depending on variety and altitude.',
    yield: '40–80 kg per mature tree.',
    rotation: 'Permanent. Underplant with grass or clover to hold the terrace soil.',
    loop: 'The economic backbone of Himachal and upper Uttarakhand — but only viable above the chilling-hour line, and worth checking against your specific altitude before planting anything.',
    bySoil: {
      hill: 'The only soil and climate in India where apple is a serious proposition. Terracing and frost protection are what decide success.'
    }
  }
);
