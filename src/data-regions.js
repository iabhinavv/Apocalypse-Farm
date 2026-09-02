// ---------------------------------------------------------------------------
// Soils and states.
//
// Every figure here traces back to self-sufficient-farm.md sections 1 and 6.
// Land prices are indicative 2026 ranges in rupees per acre and swing wildly
// with irrigation and distance from a city -- they are here to size a budget,
// not to quote a market.
// ---------------------------------------------------------------------------

const SOILS = {
  alluvial: {
    name: 'Alluvial',
    tint: '#b08d57',
    short: 'Deep river-laid loam. The most forgiving soil in India.',
    long:
      'Laid down by the Indus, Ganga and Brahmaputra systems and their deltas. ' +
      'Deep, friable, naturally rich in potash and lime but often short of nitrogen ' +
      'and organic matter. Drains and works easily, holds moisture well, and takes ' +
      'almost any crop you put in it. This is the soil the wheat-rice belt is built on.',
    ph: '6.5 – 8.0',
    holds: 'Moderate to high',
    watch:
      'Low in nitrogen and organic carbon under continuous cereal cropping. ' +
      'Sodic patches appear where drainage is poor and irrigation is heavy.',
    build:
      'Feed it organic matter relentlessly -- 5 tonnes of farmyard manure per acre ' +
      'per year to start. Work a green manure (dhaincha or sunhemp) in before the ' +
      'kharif crop and knock it down at flowering.'
  },

  black: {
    name: 'Black (regur)',
    tint: '#4a4a52',
    short: 'Clay-rich cotton soil. Holds water like a sponge, cracks when dry.',
    long:
      'The Deccan trap soil -- dark, montmorillonite clay, high in lime, magnesium ' +
      'and iron, low in nitrogen and phosphorus. Its defining trait is moisture ' +
      'retention: it can carry a crop through a dry spell on stored water alone, ' +
      'which is why unirrigated cotton and jowar work here and nowhere else.',
    ph: '7.5 – 8.5',
    holds: 'Very high',
    watch:
      'Unworkable when wet -- it turns to glue and you will compact it badly. ' +
      'Shrinks and cracks deeply when dry. Your tillage window is narrow: ' +
      'work it at the right moisture or not at all.',
    build:
      'Deep summer ploughing to open the cracks, then gypsum where sodium is high. ' +
      'Broad-bed-and-furrow layout pays for itself in a wet year by getting ' +
      'standing water off the field.'
  },

  red: {
    name: 'Red & laterite',
    tint: '#a0522d',
    short: 'Iron-stained, light, hungry and acidic. Responds fast to feeding.',
    long:
      'Weathered from crystalline rock across the peninsular plateau. Red where ' +
      'iron oxide dominates, laterite where heavy rain has leached everything ' +
      'soluble out. Light, well-drained, easy to work, and poor -- low in nitrogen, ' +
      'phosphorus and organic matter, often acidic. Millets, groundnut and pulses ' +
      'evolved for exactly this.',
    ph: '5.0 – 6.5',
    holds: 'Low',
    watch:
      'Droughts out quickly because it holds so little water. Phosphorus gets ' +
      'locked up by iron and aluminium at low pH, so applied fertiliser can sit ' +
      'there unavailable.',
    build:
      'Lime to lift pH towards 6.5 before anything else -- it unlocks the ' +
      'phosphorus you are already applying. Then organic matter and mulch, heavily, ' +
      'to hold water. Tank silt spread on the field is the traditional fix and ' +
      'still a good one.'
  },

  arid: {
    name: 'Arid / desert',
    tint: '#d9b382',
    short: 'Sandy, thin on organic matter, high in soluble salts.',
    long:
      'Western Rajasthan and the dry fringes of Gujarat and Haryana. Coarse sand ' +
      'to sandy loam, very low organic carbon, high infiltration and near-zero ' +
      'water holding. Often carries free lime and, in canal command areas, a real ' +
      'salinity risk once irrigation starts.',
    ph: '7.5 – 8.8',
    holds: 'Very low',
    watch:
      'Wind erosion strips the topsoil. Flood irrigation on this soil brings salts ' +
      'to the surface within a few seasons -- the classic canal-command mistake.',
    build:
      'Windbreak first: a double row of khejri, neem or jujube on the windward ' +
      'edge before you plant anything you care about. Drip, never flood. ' +
      'Farmyard manure and tank silt to build any water-holding capacity at all.'
  },

  hill: {
    name: 'Hill / terraced',
    tint: '#6b8e6b',
    short: 'Shallow mountain soil on slopes. Fertile but always leaving.',
    long:
      'Himalayan and sub-Himalayan soils -- often high in organic matter from ' +
      'forest litter, acidic, stony, and shallow over rock. The constraint is ' +
      'never fertility, it is slope: everything you add washes downhill unless ' +
      'the land is terraced and bunded.',
    ph: '5.0 – 6.5',
    holds: 'Moderate',
    watch:
      'Erosion is the whole problem. A single unterraced monsoon can take a decade ' +
      'of soil building with it. Frost and hail limit what you can grow and when.',
    build:
      'Bench terraces with a slight inward slope, stone-faced risers, and a ' +
      'diversion drain above the cultivated block. Contour hedgerows of ' +
      'napier or Leucaena hold risers together and feed the animals.'
  },

  coastal: {
    name: 'Coastal laterite & delta',
    tint: '#8a9a5b',
    short: 'Heavy-rain leached laterite inland, saline alluvium at the shore.',
    long:
      'The Konkan, Malabar and delta coasts. Two soils really: leached, acidic ' +
      'laterite on the uplands, and rich but salt-threatened alluvium in the ' +
      'deltas and backwaters. Rainfall is enormous and concentrated, so drainage ' +
      'matters more than irrigation for much of the year.',
    ph: '4.5 – 6.5 upland, 6.5 – 8.0 delta',
    holds: 'Low upland, high delta',
    watch:
      'Acidity and aluminium toxicity on the uplands. Salt-water intrusion in the ' +
      'deltas, worsening as groundwater is drawn down. Waterlogging in monsoon.',
    build:
      'Lime the uplands. In the delta, get the drainage and bunding right before ' +
      'you plant -- and test for salinity in the dry season, not the wet, when it ' +
      'is at its worst.'
  }
};

// ---------------------------------------------------------------------------
// States. `buy` is the practical question for a non-agriculturist buyer:
//   open       -> any Indian citizen may purchase
//   caution    -> purchasable, but with a condition or an unsettled rule
//   closed     -> effectively unavailable without farmer or domicile status
// ---------------------------------------------------------------------------

const STATES = [
  // --- North --------------------------------------------------------------
  {
    id: 'punjab', name: 'Punjab', region: 'North',
    soils: ['alluvial'], rain: [500, 800], climate: 'Subtropical, hot summer, cool winter',
    price: [4000000, 8000000], priceNote: 'irrigated land, among the costliest farmland in the north',
    buy: 'caution',
    buyNote:
      'Generally accessible to Indian citizens. Land ceiling is 17.5 acres irrigated ' +
      'or 52 acres unirrigated per family, which caps the top of any expansion plan.',
    kharif: ['rice', 'maize', 'cotton'], rabi: ['wheat', 'mustard', 'chana'],
    fodder: ['berseem', 'napier'], oil: ['mustard'], cash: ['sugarcane'],
    fruit: ['guava', 'lemon', 'mango'],
    note:
      'The most productive soil-and-water combination in the country, and priced ' +
      'accordingly. Groundwater is falling fast across the central districts -- ' +
      'check the block\'s groundwater category before you commit.'
  },
  {
    id: 'haryana', name: 'Haryana', region: 'North',
    soils: ['alluvial', 'arid'], rain: [400, 700], climate: 'Semi-arid to subtropical',
    price: [2000000, 6000000], priceNote: 'steeply higher near the NCR, far lower in the south-west',
    buy: 'caution',
    buyNote:
      'Non-agriculturists may buy, but a change-of-land-use certificate is needed ' +
      'for any non-agricultural use of the plot.',
    kharif: ['rice', 'bajra', 'cotton'], rabi: ['wheat', 'mustard', 'chana'],
    fodder: ['berseem', 'napier'], oil: ['mustard'], cash: ['sugarcane'],
    fruit: ['guava', 'lemon', 'moringa'],
    note:
      'Two very different states in one: canal-fed alluvium in the north-east, ' +
      'sandy semi-arid land in the south-west. Price tracks distance from Delhi ' +
      'more than it tracks soil.'
  },
  {
    id: 'up', name: 'Uttar Pradesh', region: 'North',
    soils: ['alluvial'], rain: [700, 1100], climate: 'Subtropical monsoon',
    price: [200000, 800000], priceNote: 'eastern UP; western UP near the NCR runs many times higher',
    buy: 'open',
    buyNote:
      'Relatively liberal purchase laws -- a large part of why eastern UP is ' +
      'drawing new buyers.',
    kharif: ['rice', 'maize', 'tur'], rabi: ['wheat', 'mustard', 'potato'],
    fodder: ['berseem', 'napier'], oil: ['mustard'], cash: ['sugarcane'],
    fruit: ['mango', 'guava', 'banana'],
    note:
      'Cheap, fertile, well-watered land in the east of the state is one of the ' +
      'best value propositions in the country for this kind of project. ' +
      'Holdings are fragmented; expect to assemble a plot from several owners.'
  },
  {
    id: 'uttarakhand', name: 'Uttarakhand', region: 'North',
    soils: ['hill', 'alluvial'], rain: [1000, 2000], climate: 'Temperate hill and humid Terai',
    price: [500000, 3000000], priceNote: 'Terai plains; hill land is often not transferable at all',
    buy: 'closed',
    buyNote:
      'Purchase by non-domicile individuals is restricted across many hill ' +
      'districts. The Terai belt is the practical option, and even there the ' +
      'rules have been tightening.',
    kharif: ['rice', 'ragi', 'maize'], rabi: ['wheat', 'mustard', 'potato'],
    fodder: ['napier', 'berseem'], oil: ['mustard'], cash: ['sugarcane'],
    fruit: ['apple', 'mango', 'lemon'],
    note:
      'Two farming worlds: terraced hill agriculture with tiny holdings, and the ' +
      'flat, fertile, malaria-cleared Terai. Only the second is realistically ' +
      'buyable, and only by some.'
  },
  {
    id: 'himachal', name: 'Himachal Pradesh', region: 'North',
    soils: ['hill'], rain: [1000, 1800], climate: 'Temperate, cold winter',
    price: [1500000, 6000000], priceNote: 'high near the apple and tourist belts',
    buy: 'closed',
    buyNote:
      'Only local agriculturists may purchase. Outsiders need prior state ' +
      'government permission under section 118, which is rarely given for ' +
      'farming. Ceiling 32 acres.',
    kharif: ['maize', 'ragi'], rabi: ['wheat', 'potato', 'cauliflower'],
    fodder: ['napier', 'lucerne'], oil: ['mustard'], cash: [],
    fruit: ['apple', 'walnut'],
    note:
      'The best temperate horticulture land in India and effectively closed to ' +
      'outside buyers. Worth understanding as a model, not as a target.'
  },
  {
    id: 'jk', name: 'Jammu & Kashmir / Ladakh', region: 'North',
    soils: ['hill', 'alluvial'], rain: [600, 1200], climate: 'Temperate to cold desert',
    price: [1000000, 5000000], priceNote: 'thin, restricted market',
    buy: 'closed',
    buyNote:
      'Rules have been in flux since the 2019 reorganisation. Treat as ' +
      'effectively closed without local roots and take specific local legal advice.',
    kharif: ['rice', 'maize'], rabi: ['wheat', 'mustard'],
    fodder: ['lucerne', 'berseem'], oil: ['mustard'], cash: ['saffron'],
    fruit: ['apple', 'walnut'],
    note:
      'Saffron, apple and walnut are genuinely world-class here. The land market ' +
      'is not one an outside buyer should plan around.'
  },
  {
    id: 'rajasthan', name: 'Rajasthan', region: 'North',
    soils: ['arid', 'alluvial'], rain: [200, 650], climate: 'Arid to semi-arid',
    price: [50000, 2500000], priceNote: 'dry desert land at the bottom, canal-command land at the top',
    buy: 'open',
    buyNote:
      'Non-agriculturists can buy, but must apply for land-use conversion within ' +
      'one year and begin the intended use within three.',
    kharif: ['bajra', 'moth', 'guar'], rabi: ['wheat', 'mustard', 'chana'],
    fodder: ['napier', 'lucerne'], oil: ['mustard', 'sesame'], cash: ['guar'],
    fruit: ['moringa', 'lemon', 'guava'],
    note:
      'The cheapest land in this table by a wide margin, and the reason is water. ' +
      'Inside the Indira Gandhi Canal command it is a genuinely different ' +
      'proposition from dry desert land ten kilometres away.'
  },

  // --- West ---------------------------------------------------------------
  {
    id: 'maharashtra', name: 'Maharashtra', region: 'West',
    soils: ['black'], rain: [600, 1200], climate: 'Semi-arid Deccan, heavy on the Konkan',
    price: [600000, 1500000], priceNote: 'Vidarbha; land near Pune and Nashik is several times this',
    buy: 'closed',
    buyNote:
      'Only certified agriculturists may purchase -- one of the stricter states ' +
      'in the country on this point.',
    kharif: ['cotton', 'jowar', 'soybean'], rabi: ['wheat', 'chana', 'jowar'],
    fodder: ['napier', 'lucerne'], oil: ['soybean', 'groundnut'], cash: ['sugarcane', 'cotton'],
    fruit: ['mango', 'guava', 'banana'],
    note:
      'Deep black cotton soil and a long dry season. Excellent land if you can ' +
      'legally buy it, which as a non-agriculturist you generally cannot.'
  },
  {
    id: 'gujarat', name: 'Gujarat', region: 'West',
    soils: ['black', 'alluvial', 'arid'], rain: [400, 1200], climate: 'Semi-arid to arid',
    price: [800000, 3000000], priceNote: 'rising fast along the industrial corridors',
    buy: 'caution',
    buyNote:
      'Agriculturists only in principle, though the Gujarat High Court has held ' +
      'that a farmer from anywhere in India may buy here. Verify current practice ' +
      'in the district before committing.',
    kharif: ['cotton', 'groundnut', 'bajra'], rabi: ['wheat', 'chana', 'mustard'],
    fodder: ['napier', 'lucerne'], oil: ['groundnut', 'sesame'], cash: ['cotton'],
    fruit: ['mango', 'banana', 'lemon'],
    note:
      'Strong farmer institutions and the best dairy cooperative network in India ' +
      '-- which matters a great deal if milk is part of your plan.'
  },
  {
    id: 'goa', name: 'Goa', region: 'West',
    soils: ['coastal'], rain: [2500, 3500], climate: 'Humid tropical, very wet monsoon',
    price: [3000000, 15000000], priceNote: 'tourism demand, not farm economics, sets this price',
    buy: 'caution',
    buyNote: 'Standard state agricultural rules apply; availability is the real constraint.',
    kharif: ['rice'], rabi: ['moong', 'greens'],
    fodder: ['napier'], oil: ['sesame'], cash: ['cashew', 'coconut'],
    fruit: ['coconut', 'cashew', 'mango', 'banana'],
    note:
      'Tiny, wet, and priced by the second-home market. Coconut, cashew and ' +
      'monsoon paddy are what the land actually does well.'
  },

  // --- Central ------------------------------------------------------------
  {
    id: 'mp', name: 'Madhya Pradesh', region: 'Central',
    soils: ['black', 'alluvial'], rain: [800, 1400], climate: 'Subtropical monsoon',
    price: [100000, 800000], priceNote: 'the national low -- close to a lakh an acre across many districts',
    buy: 'open',
    buyNote:
      'No restriction on non-farmers. You simply inform the authorities within ' +
      '90 days of purchase. Among the most accessible large states in India.',
    kharif: ['soybean', 'jowar', 'tur'], rabi: ['wheat', 'chana', 'mustard'],
    fodder: ['napier', 'berseem'], oil: ['soybean', 'mustard'], cash: ['soybean'],
    fruit: ['mango', 'guava', 'lemon'],
    note:
      'The strongest combination of cheap land, workable soil, adequate rainfall ' +
      'and open purchase rules in the country. If the plan is to actually buy ' +
      'something, this is where to start looking.'
  },
  {
    id: 'chhattisgarh', name: 'Chhattisgarh', region: 'Central',
    soils: ['red', 'alluvial'], rain: [1200, 1600], climate: 'Subtropical, reliable monsoon',
    price: [150000, 900000], priceNote: 'similar to Madhya Pradesh',
    buy: 'caution',
    buyNote:
      'Relatively liberal, but Schedule V tribal-area restrictions apply in ' +
      'specific districts. Verify the district\'s status, not just the state rule.',
    kharif: ['rice', 'tur', 'ragi'], rabi: ['wheat', 'chana', 'mustard'],
    fodder: ['napier'], oil: ['groundnut', 'sesame'], cash: ['rice'],
    fruit: ['mango', 'guava', 'papaya'],
    note:
      'The rice bowl of central India, with dependable rain and cheap land. ' +
      'The tribal-land question is the thing to get a lawyer on before anything else.'
  },

  // --- South --------------------------------------------------------------
  {
    id: 'karnataka', name: 'Karnataka', region: 'South',
    soils: ['red', 'black', 'coastal'], rain: [600, 3000], climate: 'Ranges from dry plateau to wet coast',
    price: [800000, 5000000], priceNote: 'enormous district-to-district range',
    buy: 'caution',
    buyNote:
      'The core restriction on non-agriculturists was eased in 2020, but older ' +
      'income-threshold rules are still cited in places. Status is genuinely in ' +
      'flux -- verify the current rule before committing.',
    kharif: ['ragi', 'maize', 'cotton'], rabi: ['jowar', 'chana', 'groundnut'],
    fodder: ['napier', 'lucerne'], oil: ['groundnut', 'sesame'], cash: ['coffee', 'arecanut'],
    fruit: ['mango', 'banana', 'coconut'],
    note:
      'Three climates in one state. Ragi on the southern plateau is one of the ' +
      'best low-input staples in India and deserves a serious look.'
  },
  {
    id: 'kerala', name: 'Kerala', region: 'South',
    soils: ['coastal'], rain: [2500, 3500], climate: 'Humid tropical, two monsoons',
    price: [5000000, 30000000], priceNote: 'among the most expensive farmland in India',
    buy: 'closed',
    buyNote:
      'Land reform legislation restricts non-agriculturist purchase, and extreme ' +
      'population density limits what comes to market at all.',
    kharif: ['rice'], rabi: ['greens', 'urad'],
    fodder: ['napier'], oil: ['sesame'], cash: ['turmeric', 'ginger'],
    fruit: ['coconut', 'banana', 'mango'],
    note:
      'Spices, coconut and rubber on smallholdings, at land prices that make ' +
      'self-sufficiency arithmetic almost impossible. Wonderful farming, ' +
      'wrong economics for this plan.'
  },
  {
    id: 'tamilnadu', name: 'Tamil Nadu', region: 'South',
    soils: ['red', 'black', 'alluvial'], rain: [600, 1200], climate: 'Tropical, north-east monsoon',
    price: [1000000, 5000000], priceNote: 'Cauvery delta land at the top of the range',
    buy: 'open',
    buyNote:
      'No restriction on who may buy, but a ceiling of roughly 59.95 acres per ' +
      'buyer applies -- which directly caps the large end of any expansion plan.',
    kharif: ['rice', 'cotton', 'groundnut'], rabi: ['rice', 'pulses', 'groundnut'],
    fodder: ['napier', 'lucerne'], oil: ['groundnut', 'sesame'], cash: ['sugarcane', 'cotton'],
    fruit: ['banana', 'mango', 'coconut'],
    note:
      'Open purchase rules and outstanding agricultural extension -- the TNAU ' +
      'network is the best in the country. Water, not land, is the binding constraint.'
  },
  {
    id: 'telangana', name: 'Telangana', region: 'South',
    soils: ['red', 'black'], rain: [700, 1100], climate: 'Semi-arid Deccan',
    price: [800000, 1500000], priceNote: 'outer districts; land near Hyderabad runs 50–80 lakh',
    buy: 'open',
    buyNote:
      'Opened to any Indian citizen. No agriculturist certificate and no income ' +
      'cap required.',
    kharif: ['rice', 'cotton', 'chilli'], rabi: ['rice', 'chana', 'groundnut'],
    fodder: ['napier', 'lucerne'], oil: ['groundnut', 'sesame'], cash: ['cotton', 'chilli'],
    fruit: ['mango', 'guava', 'lemon'],
    note:
      'Open rules plus the Kaleshwaram scheme rapidly expanding irrigated area ' +
      'makes this the strongest southern option for an outside buyer.'
  },
  {
    id: 'ap', name: 'Andhra Pradesh', region: 'South',
    soils: ['red', 'black', 'coastal'], rain: [800, 1200], climate: 'Tropical, coastal humid',
    price: [800000, 2500000], priceNote: 'Krishna–Godavari delta land at the top',
    buy: 'open',
    buyNote: 'Opened to any Indian citizen, on the same footing as Telangana.',
    kharif: ['rice', 'cotton', 'chilli'], rabi: ['rice', 'chana', 'groundnut'],
    fodder: ['napier'], oil: ['groundnut', 'sesame'], cash: ['cotton', 'chilli'],
    fruit: ['mango', 'banana', 'coconut'],
    note:
      'Delta land is superb and expensive; the rain-shadow interior is cheap and ' +
      'hard. Inland aquaculture is a real option here in a way it is not elsewhere.'
  },

  // --- East ---------------------------------------------------------------
  {
    id: 'wb', name: 'West Bengal', region: 'East',
    soils: ['alluvial', 'red', 'hill'], rain: [1400, 2500], climate: 'Humid subtropical',
    price: [800000, 3000000], priceNote: 'high for the region, driven by population density',
    buy: 'caution',
    buyNote:
      'Verify local rules carefully. Delta holdings are extremely fragmented, ' +
      'which makes assembling a usable block slow.',
    kharif: ['rice', 'maize'], rabi: ['potato', 'mustard', 'wheat'],
    fodder: ['napier', 'berseem'], oil: ['mustard', 'sesame'], cash: ['jute', 'tea'],
    fruit: ['mango', 'banana', 'lemon'],
    note:
      'Three rice crops a year are possible in parts of the delta. The constraint ' +
      'is that almost nobody is selling a contiguous three acres.'
  },
  {
    id: 'bihar', name: 'Bihar', region: 'East',
    soils: ['alluvial'], rain: [1000, 1400], climate: 'Humid subtropical',
    price: [300000, 1200000], priceNote: 'among the lower-priced large states, rising with infrastructure',
    buy: 'open',
    buyNote:
      'Generally accessible. Holdings are heavily fragmented -- expect to buy ' +
      'from several small owners to assemble one block.',
    kharif: ['rice', 'maize', 'tur'], rabi: ['wheat', 'chana', 'mustard', 'potato'],
    fodder: ['berseem', 'napier'], oil: ['mustard'], cash: ['sugarcane', 'maize'],
    fruit: ['mango', 'banana', 'guava'],
    note:
      'Deep Gangetic alluvium and good rainfall at a fraction of Punjab prices. ' +
      'Fragmentation and the paperwork of multi-owner purchase are the real work here.'
  },
  {
    id: 'jharkhand', name: 'Jharkhand', region: 'East',
    soils: ['red'], rain: [1100, 1500], climate: 'Subtropical plateau',
    price: [200000, 900000], priceNote: 'low to moderate',
    buy: 'closed',
    buyNote:
      'Schedule V tribal-area land cannot be bought by non-tribals across the ' +
      'tribal-majority districts. Check the specific district status carefully -- ' +
      'this is not a state-level yes or no.',
    kharif: ['rice', 'ragi', 'tur'], rabi: ['chana', 'mustard', 'vegetables'],
    fodder: ['napier'], oil: ['groundnut', 'sesame'], cash: [],
    fruit: ['mango', 'guava', 'papaya'],
    note:
      'Good rainfall on poor plateau soil. The land-law question dominates ' +
      'everything else about buying here.'
  },
  {
    id: 'odisha', name: 'Odisha', region: 'East',
    soils: ['red', 'coastal'], rain: [1200, 1600], climate: 'Tropical, cyclone-exposed coast',
    price: [200000, 500000], priceNote: 'under 5 lakh across much of the interior',
    buy: 'caution',
    buyNote:
      'Relatively accessible, but verify tribal-belt restrictions in the western ' +
      'districts before proceeding.',
    kharif: ['rice', 'ragi', 'tur'], rabi: ['chana', 'mustard', 'groundnut'],
    fodder: ['napier'], oil: ['groundnut', 'sesame'], cash: ['rice'],
    fruit: ['mango', 'coconut', 'banana'],
    note:
      'Cheap land and dependable monsoon. The coastal strip takes cyclones ' +
      'regularly -- windbreaks and building orientation are not optional there.'
  },

  // --- Northeast ----------------------------------------------------------
  {
    id: 'assam', name: 'Assam', region: 'Northeast',
    soils: ['alluvial'], rain: [2000, 3000], climate: 'Humid subtropical, very wet',
    price: [100000, 400000], priceNote: 'around 1.5 lakh an acre on average -- among the cheapest in India',
    buy: 'open',
    buyNote:
      'Relatively accessible compared with the rest of the Northeast, though ' +
      'tribal-belt and tribal-block land carries its own restrictions.',
    kharif: ['rice', 'maize'], rabi: ['mustard', 'potato', 'pulses'],
    fodder: ['napier'], oil: ['mustard', 'sesame'], cash: ['tea', 'jute'],
    fruit: ['banana', 'papaya', 'lemon'],
    note:
      'Extremely cheap, extremely fertile, extremely wet. Brahmaputra flooding ' +
      'is an annual event, not a risk -- check the plot\'s flood history over ' +
      'a decade, not a season.'
  },
  ...[
    ['arunachal', 'Arunachal Pradesh'], ['manipur', 'Manipur'],
    ['meghalaya', 'Meghalaya'], ['mizoram', 'Mizoram'],
    ['nagaland', 'Nagaland'], ['sikkim', 'Sikkim'], ['tripura', 'Tripura']
  ].map(function (s) {
    return {
      id: s[0], name: s[1], region: 'Northeast',
      soils: ['hill'], rain: [1800, 3000], climate: 'Humid subtropical to temperate hill',
      price: [200000, 800000], priceNote: 'thin market; most land is not individually owned at all',
      buy: 'closed',
      buyNote:
        'Land is largely under community, tribal or customary ownership and is ' +
        'protected by special constitutional provisions. Purchase by outsiders -- ' +
        'including other Indian citizens -- is heavily restricted or effectively ' +
        'prohibited without local domicile or tribal status.',
      kharif: ['rice', 'maize', 'ragi'], rabi: ['potato', 'mustard', 'vegetables'],
      fodder: ['napier'], oil: ['mustard', 'sesame'], cash: ['ginger', 'turmeric'],
      fruit: ['banana', 'papaya', 'lemon'],
      note:
        'Terraced and shifting cultivation on community land. Not a practical ' +
        'target for this kind of project without local roots -- included here so ' +
        'the map is complete, and because the farming systems are worth studying.'
    };
  })
];

const BUY_LABEL = {
  open: 'Open to any Indian citizen',
  caution: 'Purchasable with conditions',
  closed: 'Effectively closed to outside buyers'
};
