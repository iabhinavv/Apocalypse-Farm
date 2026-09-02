# Apocalypse Farm — A Self-Sustaining Farming Eco-System

A planning game built on `self-sufficient-farm.md`. You pick a state and an
acreage; it works out the whole farm from there — what to plant, in what order,
what it costs, how much water and power it needs — and the pixel farm builds
itself as you tick steps off.

**Play it:** double-click `Apocalypse-Farm.html`. That is the whole game — one
self-contained file, no server, no internet, no dependencies. Progress saves to
the browser. `index.html` just redirects to it, so the folder also works as a
static site root.

---

## ⚠ Publishing this

**The asset packs must not be pushed to a public repository.** Super Retro Ranch
(free tier) and Cute Fantasy (free) both state that you may not redistribute the
assets, modified or not. Using the art inside the game is fine — that is exactly
what the licences are for — but shipping the pack folders is redistribution.

The repository currently tracks the pack folders. A `.gitignore` now excludes
them going forward, but files already committed stay in the history until they
are untracked:

```bash
git rm -r --cached "Cute_Fantasy_Free" "Farm RPG FREE 16x16 - Tiny Asset Pack" "SuperRetroRanch_FreeTier_v32" "Valley Ruin Asset Pack V0.3" craftpix-net-* "honey-elements-set" assets *.webp
git commit -m "Untrack asset packs — licences forbid redistribution"
```

That leaves `Apocalypse-Farm.html` publishable on its own, which is all the game
needs: the sprites it draws are already baked into it as a single atlas. Anyone
rebuilding from source downloads the packs themselves and runs
`tools/collect_assets.py`.

Note that untracking does not purge history — for a repository that has already
been pushed public, rewriting it (`git filter-repo`) or starting a fresh one is
the thorough fix.

---

## What it does

**Input:** one of 29 states and union territories, and 3–250 acres.

**Output:** a build order of 28 steps (29 above 10 acres) across three years,
each personalised to the soil and climate that come with the state:

- **Year One — Foundation.** Soil test, fencing, zoning, compost, water source,
  rainwater harvesting, kitchen garden, poultry, boundary trees, house footings,
  first solar.
- **Year Two — The loop closes.** House, fodder plot, cattle shed, first dairy
  animal, biogas, drip, the kharif and rabi crops, pulses and oilseeds, goats.
- **Year Three — Scale and stabilise.** Pond, fish, more solar, the rest of the
  herd, bees, grain storage, machinery, and — above 10 acres — hired labour.

Steps gate on each other. You cannot buy a cow before the fodder plot is
cutting, or build the biogas plant before there are animals producing dung,
because that ordering is the thing most homestead plans get wrong.

Alongside the build order there are three reference tabs: **The land**
(allocation, soil, water, energy, full budget, purchase eligibility),
**Crop guides** (42 crops), and **Animal guides** (6).

## Playing it

**The ruler.** Metre scales run along the top and left edges of the plot, with
the true dimensions underneath — a 10-acre farm reads *229 × 177 m · 4.05 ha ·
40,469 m² · 4,35,600 sq ft*, and one map tile is about 6.5 m. The map keeps the
grid's aspect ratio, so both axes come out at the same metres per tile and the
ruler is honest at every acreage.

**Hover anything, click anything.** Passing the pointer over the map names what
is under it and gives the number that matters — the crop and its season, the
acres in that block, how much fodder feeds the herd, the kWp of the solar array,
the soil under the cereal field. Clicking opens the full guide: crops and animals
open their own guide, everything built opens the step that built it.

**Auto-build.** The button under the map completes one step every two minutes,
in order and respecting the prerequisites, so the farm assembles itself while you
read. The status line counts down and names what is coming next. Stop it at any
time and carry on ticking by hand.

**Steps stay short.** The build order shows just the step, its season and its
zone. Click the name to open the full method, cost and crop links; click the box
to mark it done. The two are separate, so reading ahead never marks anything off.

**The board is the landing area.** The farm spans the full width of the page
with the guide beneath it, so the map is what you see first and the build order
is a scroll away.

**Signboards.** Every major area carries a carved wooden nameplate — *Homestead*,
*Animal yard*, *Wheat*, *Fodder*, *Farm pond*, *Orchard*. Just the name; hover
for the size, the crop and the counts, click to open that guide. Each area gets a
different board, and a new farm deals out a different set.

**One fence per farm.** The perimeter is picked from eight wooden fence styles
and stays put for the life of that farm — reloading keeps it. Starting a new farm
rolls a new one, along with a new arrangement of signboards. Both are fixed by a
seed saved with the plan.

**The animals move.** Cattle, goats and poultry drift a couple of tiles around
the spot they were placed — two or three sideways, one or two up and down — and
turn to face the way they are walking. They stay penned inside the yard.

**Scale, honestly handled.** The board is deliberately **not** to scale — six
acres is not twice the size of three on screen. It grows just enough that
animals, buildings and crop rows never look jammed, and **width grows far faster
than height**, so a large farm becomes a wide board you pan across sideways
rather than a tall one that pushes everything else off the screen. Three acres
fits whole; from five acres up it side-scrolls, with the rulers pinned in place.
The ruler carries the real dimensions, and the tally line under it carries the
real livestock totals. At most ten of any species are drawn, however large the
herd — a 250-acre farm has 1,750 birds, and the tally says so while the yard
shows ten.

## Where the numbers come from

Everything traces to `self-sufficient-farm.md`:

| From the document | Used for |
|---|---|
| §1 state table | Soil, rainfall, land price, purchase eligibility |
| §2 allocation at 3 acres | Base land split |
| §3 scaling table | Livestock, biogas, solar, labour — interpolated between the 3/5/10/15/25/50/100/250 rows |
| §4 water | Rooftop harvest, irrigation demand, drip saving |
| §5 energy | Solar sizing by load profile, biogas by herd size |
| §6, §7 | Crop and animal selection |
| §9 zones | The map layout |
| §10 phasing | The three-year build order |
| §11 budget | Cost lines |

Crop and animal guides are written from general Indian agronomic practice, not
lifted from the document. **Sowing windows, varieties and land law shift by
district and change over time — verify with your local Krishi Vigyan Kendra,
the state agriculture department, and a lawyer before committing money.** The
app says this too, in the places where it matters.

## Art

Every sprite is third-party pack art. **Nothing is drawn for this project.**
The files actually used are collected into `assets/`, which is the only place
the build reads from — see `assets/README.md` for the per-file provenance.

| Pack | Used for | Licence |
|---|---|---|
| **Cute Fantasy** (free) | Pond water, the farmhouse, bridge, sheep, oak trees, lantern and decor | Non-commercial, no redistribution |
| **Farm RPG FREE 16x16 Tiny Asset Pack** | Cattle, bull, chickens and chicks, barn, worker cottage, maple trees, fences, stone paths, chest | As supplied |
| **Super Retro Ranch**, free tier — by **Gif** | Terrain and autotiles, 20 animated crops, props, the farmer | Non-commercial, no redistribution, credit requested |
| **Valley Ruin Asset Pack V0.3** | Rocks, scrub, reeds, sunflowers, flowering shrubs | As supplied |
| **Craftpix** free plants + summer tileset | Orchard fruit trees, produce crates, the well, cart and barrel | Craftpix free licence |
| Line art by **macrovector / Freepik** | Beehive, bee, tractor — recoloured at build time | **Attribution required** |
| Wooden signboard and fence sheets | 8 zone nameplates, 8 perimeter fence styles | supplied as `signboards.jpg` / `fences.jpg` |

The orchard adapts to the state: a coastal plan gets coconut palms, a hill plan
apple trees, the plains plum and lemon.

Five farm objects still have no sprite in any pack — the **biogas dome**, the
**solar array**, the **poultry coop**, the **goat pen** and **fish**. They show
on the map as **survey markers**, and the interface lists them under the meters,
so the gap is visible rather than hidden. A sheep stands in for goats.
**See `MISSING-ASSETS.md`** for what each one needs and how well the other
substitutions hold up.

**Because these licences are non-commercial and forbid redistributing the assets,
do not publish this to a public URL.** It is built to run locally.

## Rebuilding

`Apocalypse-Farm.html` is generated. Edit `src/`, then:

```bash
python3 build.py
```

To rebuild the sprite atlas as well:

```bash
python3 build.py --atlas
```

After adding or replacing an asset pack, re-collect first:

```bash
python3 tools/collect_assets.py && python3 build.py --atlas
```

The signboard and fence sheets are cut separately, since they arrive as JPEGs
with no alpha and no fixed grid:

```bash
python3 tools/extract_new_assets.py && python3 build.py --atlas
```

Optional local server, if you want an `http://` origin or to open it on your
phone over the same Wi-Fi (`HOST=0.0.0.0 python3 serve.py`):

```bash
python3 serve.py
```

## Layout

```
Apocalypse-Farm.html     the game — this is the deliverable
MISSING-ASSETS.md        the eleven sprites no pack covers
build.py                 welds src/ into that one file
serve.py                 optional local server
assets/                  every image the build uses, gathered in one place
  README.md              per-file provenance and licences
  cute-fantasy/  farm-rpg/  super-retro-ranch/  valley-ruin/  licences/
src/
  data-regions.js        6 soil families, 29 states
  data-crops.js          field crops — cereals, pulses, oilseeds, cash, fodder
  data-crops-garden.js   vegetables and orchard
  data-animals.js        livestock rearing guides
  engine.js              buildPlan(acres, state) — pure, no DOM
  data-steps.js          buildSteps(plan) — the three-year build order
  farm.js                tile map, ruler metrics, renderer and hit-testing
  app.js                 interface, rulers, tooltips, auto-build
  styles.css             light parchment, hard edges, no emoji
  gen-atlas.js           generated — base64 atlas + sprite manifest
tools/
  collect_assets.py      gathers used art from the packs into assets/
  extract_new_assets.py  cuts signboards.jpg / fences.jpg into sprites
  build_atlas.py         crops and packs assets/ into one atlas
```

`engine.js` is a pure function and `farm.js` touches only its own canvas, so the
plan can be tested without a browser and the map can be re-skinned without
touching the agronomy.

The original downloaded pack folders can stay where they are or be moved away —
once `assets/` is populated the build no longer needs them, except when you run
`collect_assets.py` again.
