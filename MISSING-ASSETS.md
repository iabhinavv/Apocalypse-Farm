# Missing assets

Five farm objects still have no sprite in any of the six packs. Wherever one is
called for, the map plants a **survey marker** (the Super Retro Ranch signpost)
at the spot, and the panel under the meters lists what is outstanding — so the
step still visibly does something, and the gap is never hidden.

Everything below wants **16×16-tile pixel art**, top-down or slight three-quarter
view, in a warm saturated palette, to sit beside Cute Fantasy and Farm RPG.

---

## Still needed

| # | Sprite | Rough size | What it is |
|---|---|---|---|
| 1 | **Biogas plant** | 32×24 | Deenbandhu fixed-dome digester: a low masonry dome flush with the ground, a small inlet mixing tank on one side, an outlet slurry chamber on the other. The most India-specific item on the list, and the least likely to exist in any pack. |
| 2 | **Solar panel array** | 32×24 | Two or three tilted PV panels on a steel frame, blue cells with a grid, legs and a small shadow. |
| 3 | **Poultry coop** | 24×24 | Small raised hen house on legs, pop-hole with a ramp, sloped roof. |
| 4 | **Goat pen** | 32×20 | Low shelter with a **raised slatted floor** — that raised floor is the detail that matters, it is what keeps goats healthy. |
| 5 | **Fish** | 8×8 | A couple of carp for the pond — catla, rohu, mrigal. Just a silhouette with a tail. |

## Substituted, and how well it works

| Want | Currently using | Good enough? |
|---|---|---|
| **Goat** | Cute Fantasy **sheep** | Passable at a glance, wrong on inspection — a goat is leaner, with a beard and a straighter back. Worth replacing. |
| **Bore well / hand pump** | Craftpix stone draw-well | Reads as a well, though an India Mark II hand pump is what a real farm would have |
| **Water storage tank** | Craftpix wooden barrel | Reads as a water butt; a Sintex tank on a stand would be truer |
| **Compost & vermicompost beds** | Craftpix produce crates, green and dark | Reads as bins of organic matter |
| **Tractor / power tiller** | Freepik line art, recoloured | Good — the tractor is clearly a tractor |
| **Beehive** | Freepik line art, solidified to amber | Good — reads as a straw skep |
| **Cattle shed** | Farm RPG unfinished house | Good — reads as a barn |
| **Buffalo** | Farm RPG brown bull | Passable; a Murrah buffalo is black with swept-back horns |
| **House foundation stage** | Farm RPG stone and gravel as a footprint | Fine |
| **Drip irrigation** | the pack's darker watered-soil tiles | Fine |
| **Farm gate** | a gap left in the fence run | Fine |

## Not usable

- **`Free Premade houses.png`** (Farm RPG folder) — 400–900 px tall at native
  resolution, and two- and three-storey European village houses. Far too large
  for a 16 px tile map and the wrong architecture. Verified it is not 2× art, so
  halving it would lose detail rather than fit.
- **Craftpix summer tileset ground tiles** — smooth vector-derived fills that
  clash with the pixel terrain. Only its props (well, cart, barrel) are used.
- **`honey-elements-set/48235.jpg`** — a JPG preview sheet with no alpha.

## Where to look

Searching itch.io for `farm`, `16x16`, `top-down` and `pixel` covers most of it.
Terms that tend to surface the remaining gaps:

- "solar panel pixel art", "modern farm 16x16" — the solar array
- "farm buildings 16x16", "barn coop pixel" — coop and goat pen
- "farm animals pixel pack", "goat sprite" — a real goat
- "fish sprite 16x16", "pond fish pixel"

## Adding a sprite

1. Drop the extracted folder beside `build.py`.
2. Add the files to `FILES` in `tools/collect_assets.py`.
3. Add the crop/trim call in `tools/build_atlas.py`. Line-art illustrations can
   go through `solidify()` or `tint()` there rather than being used raw.
4. Replace the matching `mark(...)` call in `src/farm.js` with a `put(...)`.
5. `python3 tools/collect_assets.py && python3 build.py --atlas`

Every `mark()` call sits in `featuresFor()` in `src/farm.js`, labelled with the
name that shows in the interface, so the list above maps one-to-one onto code.
