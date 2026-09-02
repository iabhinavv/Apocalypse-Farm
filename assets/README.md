# assets/

Every image the game actually uses, copied out of the downloaded packs into one
flat tree. `tools/build_atlas.py` reads **only** from here — it never touches the
original pack folders — so this is the single place to look when you want to know
what art is in the build.

Regenerate this folder after adding or replacing a pack:

```bash
python3 tools/collect_assets.py
```

All art is third-party. **Nothing in this folder was drawn for this project.**

---

## cute-fantasy/ — Cute Fantasy (Free version)

Non-commercial use, modification allowed, redistribution not allowed.
Licence text: `licences/CuteFantasy-Free.txt`

| File | Used for |
|---|---|
| `Water_Tile.png` | The pond — 3×3 water autotile, bank on the outside |
| `Water_Middle.png` | Open-water fill inside the pond |
| `Farmhouse.png` | The farmhouse (`House_1_Wood_Base_Blue`) |
| `Bridge_Wood.png` | Plank bridge across the pond |
| `Sheep.png` | **Stands in for goats** — no pack here has a goat |
| `Oak_Tree.png`, `Oak_Tree_Small.png` | Boundary and orchard trees |
| `Outdoor_Decor.png` | Lantern, log, mushroom, flower pots, boulder |
| `Path_Tile.png` | Sand path autotile (available, lightly used) |
| `FarmLand_Tile.png` | Tilled-soil autotile (available, unused — the Super Retro Ranch furrows read better in rows) |

## farm-rpg/ — Farm RPG FREE 16x16 Tiny Asset Pack

| File | Used for |
|---|---|
| `House.png` | Two buildings: the unfinished shell becomes the **barn / cattle shed**, the finished cottage becomes **worker quarters** |
| `Cow.png`, `Bull.png` | Dairy cattle and the bull (also standing in for buffalo) |
| `ChickenRed.png`, `ChickenBlonde.png`, `Chick.png` | Backyard poultry, chicks, eggs |
| `MapleTree.png` | Trees at four growth sizes — sprout, sapling, small, full |
| `Fences.png` | Perimeter fence |
| `Road.png` | Stone and gravel — the house footprint before it is built |
| `Chest.png` | Grain storage |

Not used: `Free Premade houses.png`. Those buildings are 400–900 px tall at
native resolution and are two- and three-storey European village houses — far too
large for a 16 px tile farm map, and the wrong architecture for this plan.

## craftpix/ — Craftpix free packs

Craftpix free licence (see `licences/`). Two separate downloads: the pixel-art
plants pack and the vector summer tileset.

| File | Used for |
|---|---|
| `Plants.png` | Orchard trees with fruit — plum, lemon, apple, banana and palm. The map picks whichever suits the state's own fruit list, so a coastal plan gets coconut palms and a hill plan gets apple |
| `Supplies.png` | Produce crates — green and dark stand in for the **compost and vermicompost beds**, the grain crate for storage |
| `Well.png` | The **bore well** |
| `Cart.png` | The **power tiller** on smaller holdings |
| `Barrel.png` | The **water butt** |

Only the summer tileset's props are used. Its ground tiles are smooth
vector-derived fills that clash badly with the pixel terrain.

## freepik/ — line art, recoloured

**Attribution required: macrovector / Freepik.** These arrived as black outline
drawings on transparency, which shrink to an unreadable tangle. `build_atlas.py`
puts them through `solidify()` — flood the outside, fill the enclosed area with a
body colour, keep the strokes as the darker line — or `tint()`, which just
recolours the strokes. Both are modifications the licence allows.

| File | Used for | Treatment |
|---|---|---|
| `beehive.webp` | The **beehive** | `solidify()` to amber and dark brown |
| `bee.webp` | A bee by the hives | `solidify()` to yellow and near-black |
| `tractor.webp` | The **tractor** above 15 acres | `tint()` to dark red — solidifying turned it to mush |

## super-retro-ranch/ — Super Retro Ranch, free tier

Non-commercial only, no redistribution of the assets. **Credit: Gif.**
Licence text: `licences/SuperRetroRanch-FreeTier.txt`

| File | Used for |
|---|---|
| `ground.png` | Grass, dirt, sand, the zone autotiles, and the tilled/watered furrows |
| `objects.png` | Crates, sacks, barrels, bench, signpost (the survey marker), produce stall |
| `crops/*.png` | 20 crops, each sampled to four growth stages |
| `farmer/*.png` | The farmer — idle, walk, hoe, water, in four facings |

Only the free `assets/` tree is read. `assets_premium_preview/` is paid-tier art
and is deliberately ignored.

## valley-ruin/ — Valley Ruin Asset Pack V0.3

| File | Used for |
|---|---|
| `StoneAndBush.png` | Rocks and scrub on the wild edge |
| `FlowerAndGrass.png` | Reeds at the pond bank, sunflowers and flowering shrubs on the boundary |

---

## Still missing

Five farm objects have no sprite in any of these packs — the biogas dome, the
solar array, the poultry coop, the goat pen and fish. They render on the map as
survey markers, and the interface lists them under the meters. A sheep stands in
for goats.

See `../MISSING-ASSETS.md` for the full list, what each one needs to look like,
and how well the current substitutions hold up.
