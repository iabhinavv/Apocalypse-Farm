#!/usr/bin/env python3
"""
Build the Apocalypse Farm sprite atlas.

Reads only from assets/ -- the flat tree that tools/collect_assets.py gathers
out of the downloaded packs -- crops the regions the game uses, shelf-packs them
into one PNG, and writes src/gen-atlas.js as a base64 data URI plus a
name -> [x, y, w, h] manifest.

Every sprite here is third-party pack art. Nothing is drawn for this project.
See assets/README.md for the per-file provenance and MISSING-ASSETS.md for the
farm objects no pack covers yet.

    python3 tools/collect_assets.py     # refresh assets/ from the packs
    python3 tools/build_atlas.py        # then rebuild the atlas
"""

import base64
import io
import json
import os
from collections import deque

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, "assets")
OUT_JS = os.path.join(ROOT, "src", "gen-atlas.js")
OUT_PNG = os.path.join(ROOT, "build", "atlas.png")

TILE = 16


def load(rel):
    path = os.path.join(ASSETS, rel)
    if not os.path.exists(path):
        raise SystemExit(
            "missing asset: assets/" + rel +
            "\nRun `python3 tools/collect_assets.py` first."
        )
    return Image.open(path).convert("RGBA")


def trim(im, box=None):
    """Crop to `box`, then shrink to the non-transparent content."""
    if box:
        im = im.crop(box)
    bb = im.getbbox()
    return im.crop(bb) if bb else im


def blob3(im, name, ox=0, oy=0, out=None):
    """Slice a 3x3 autotile block into <name>_tl .. <name>_br."""
    for j, row in enumerate(("t", "c", "b")):
        for i, col in enumerate(("l", "c", "r")):
            out["%s_%s%s" % (name, row, col)] = im.crop(
                (ox + i * TILE, oy + j * TILE, ox + (i + 1) * TILE, oy + (j + 1) * TILE))


def fit(im, target_w):
    """Trim, then scale to a target width, keeping the aspect ratio."""
    bb = im.getbbox()
    if bb:
        im = im.crop(bb)
    h = max(1, round(im.height * target_w / im.width))
    return im.resize((target_w, h), Image.LANCZOS)


def solidify(im, body, line, target_w):
    """Turn a black line-art illustration into a solid sprite.

    The Freepik pieces are outline drawings on transparency: shrink them
    directly and you get a black tangle. Flood the outside, paint the enclosed
    area as the body colour, keep the original strokes as the darker line, then
    drop to sprite size. Recolouring is expressly allowed by these licences.
    """
    bb = im.getbbox()
    if bb:
        im = im.crop(bb)
    work = im.resize((target_w * 4, max(1, round(im.height * target_w * 4 / im.width))),
                     Image.LANCZOS)
    w, h = work.size
    a = work.split()[3].load()
    drawn = [[a[x, y] > 90 for x in range(w)] for y in range(h)]

    outside = [[False] * w for _ in range(h)]
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not drawn[y][x] and not outside[y][x]:
                outside[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not drawn[y][x] and not outside[y][x]:
                outside[y][x] = True
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not drawn[ny][nx] and not outside[ny][nx]:
                outside[ny][nx] = True
                q.append((nx, ny))

    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = out.load()
    for y in range(h):
        for x in range(w):
            if drawn[y][x]:
                px[x, y] = line
            elif not outside[y][x]:
                px[x, y] = body
    return out.resize((target_w, max(1, round(h * target_w / w))), Image.NEAREST)


def tint(im, colour, target_w):
    """Keep a line drawing's own shape, just recolour the strokes."""
    im = fit(im, target_w)
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            px[x, y] = (colour[0], colour[1], colour[2],
                        255 if px[x, y][3] > 110 else 0)
    return im


sprites = {}


# ===========================================================================
# Cute Fantasy -- water, the farmhouse, sheep, decor
# ===========================================================================

# 3x3 water autotile: bank on the outside, open water in the middle
blob3(load("cute-fantasy/Water_Tile.png"), "water", 0, 0, sprites)
sprites["water_mid"] = load("cute-fantasy/Water_Middle.png")

# 3x3 sand path on grass
blob3(load("cute-fantasy/Path_Tile.png"), "path", 0, 0, sprites)

sprites["farmhouse"] = trim(load("cute-fantasy/Farmhouse.png"))

BRIDGE = load("cute-fantasy/Bridge_Wood.png")
sprites["bridge_l"] = BRIDGE.crop((0, 32, 16, 48))
sprites["bridge_m"] = BRIDGE.crop((16, 32, 32, 48))
sprites["bridge_r"] = BRIDGE.crop((32, 32, 48, 48))

sprites["oak"] = trim(load("cute-fantasy/Oak_Tree.png"))
sprites["oak_small"] = trim(load("cute-fantasy/Oak_Tree_Small.png"), (0, 0, 48, 48))

# 32x32 cells, 2x2 grid. Sheep stands in for goats -- no pack has a goat.
SHEEP = load("cute-fantasy/Sheep.png")
sprites["sheep_0"] = SHEEP.crop((0, 0, 32, 32))
sprites["sheep_1"] = SHEEP.crop((32, 0, 64, 32))

DECOR = load("cute-fantasy/Outdoor_Decor.png")
sprites["lantern"] = trim(DECOR, (5 * TILE, 5 * TILE, 6 * TILE, 7 * TILE))
sprites["log"] = trim(DECOR, (0, 7 * TILE, TILE, 8 * TILE))
sprites["mushroom"] = trim(DECOR, (TILE, 7 * TILE, 2 * TILE, 8 * TILE))
sprites["pot_red"] = trim(DECOR, (0, 8 * TILE, TILE, 9 * TILE))
sprites["pot_yellow"] = trim(DECOR, (TILE, 8 * TILE, 2 * TILE, 9 * TILE))
sprites["boulder"] = trim(DECOR, (0, 3 * TILE, 2 * TILE, 4 * TILE))


# ===========================================================================
# Farm RPG -- livestock, barn, fences, stone paths
# ===========================================================================

HOUSE = load("farm-rpg/House.png")
# two houses share the sheet: an unfinished shell on the left (used as the
# barn / cattle shed) and the finished cottage on the right (worker quarters)
sprites["barn"] = trim(HOUSE, (0, 0, 80, 96))
sprites["cottage"] = trim(HOUSE, (144, 0, 224, 112))

TREE = load("farm-rpg/MapleTree.png")
for name, box in (
    ("sprout", (8, 32, 24, 48)),
    ("sapling", (40, 28, 56, 48)),
    ("tree_small", (64, 8, 96, 48)),
    ("tree", (94, 0, 132, 48)),
    ("stump", (132, 32, 156, 48)),
):
    sprites[name] = trim(TREE, box)

FENCE = load("farm-rpg/Fences.png")
sprites["fence_l"] = FENCE.crop((0, 32, 16, 48))
sprites["fence_m"] = FENCE.crop((16, 32, 32, 48))
sprites["fence_r"] = FENCE.crop((32, 32, 48, 48))
sprites["fence_post"] = FENCE.crop((16, 64, 32, 80))
sprites["fence_v"] = FENCE.crop((0, 16, 16, 32))

ROAD = load("farm-rpg/Road.png")
sprites["stone_big"] = trim(ROAD, (0, 0, 16, 16))
sprites["stone_mid"] = trim(ROAD, (0, 16, 16, 32))
sprites["stone_bits"] = trim(ROAD, (32, 0, 48, 16))
sprites["gravel"] = trim(ROAD, (0, 32, 16, 48))

sprites["chest"] = trim(load("farm-rpg/Chest.png"), (0, 0, 32, 16))

# 32x32 cells, four frames across; row 0 is the side view
COW = load("farm-rpg/Cow.png")
BULL = load("farm-rpg/Bull.png")
for i in range(2):
    sprites["cow_%d" % i] = COW.crop((i * 32, 0, i * 32 + 32, 32))
    sprites["bull_%d" % i] = BULL.crop((i * 32, 0, i * 32 + 32, 32))

# 16x16 cells, four frames across
for key, fname in (("hen", "farm-rpg/ChickenRed.png"),
                   ("hen2", "farm-rpg/ChickenBlonde.png")):
    sheet = load(fname)
    for i in range(2):
        sprites["%s_%d" % (key, i)] = sheet.crop((i * 16, 0, i * 16 + 16, 16))

CHICK = load("farm-rpg/Chick.png")
sprites["chick_0"] = CHICK.crop((0, 0, 16, 16))
sprites["chick_1"] = CHICK.crop((16, 0, 32, 16))
sprites["egg"] = trim(CHICK, (0, 32, 16, 48))


# ===========================================================================
# Super Retro Ranch -- terrain, crops, props, the farmer
# ===========================================================================

GROUND = load("super-retro-ranch/ground.png")
OBJECTS = load("super-retro-ranch/objects.png")


def gtile(cx, cy):
    return GROUND.crop((cx * TILE, cy * TILE, (cx + 1) * TILE, (cy + 1) * TILE))


sprites["grass_a"] = gtile(1, 9)
sprites["grass_b"] = gtile(4, 9)
sprites["sand"] = gtile(1, 4)
sprites["dirt_red"] = gtile(4, 4)
sprites["dirt_pale"] = gtile(9, 8)
sprites["dirt_dark"] = gtile(9, 13)

for name, (bx, by) in {
    "field": (0, 3),    # pale plot on grass
    "earth": (3, 3),    # red-brown plot on grass
    "meadow": (3, 8),   # light grass on dark grass
}.items():
    blob3(GROUND, name, bx * TILE, by * TILE, sprites)

for i, col in enumerate(("l", "m", "r")):
    sprites["till_" + col] = gtile(i, 11)
    sprites["till_" + col + "2"] = gtile(i, 12)
    sprites["wet_" + col] = gtile(i, 13)
    sprites["wet_" + col + "2"] = gtile(i, 14)

sprites["crate"] = OBJECTS.crop((0, 32, 16, 48))
sprites["crate2"] = OBJECTS.crop((16, 32, 32, 48))
sprites["sack"] = OBJECTS.crop((0, 48, 16, 64))
sprites["barrel"] = OBJECTS.crop((16, 48, 32, 64))
sprites["bench"] = OBJECTS.crop((32, 64, 64, 80))
sprites["signpost"] = trim(OBJECTS, (13 * TILE, 5 * TILE, 15 * TILE, 7 * TILE))
sprites["stall"] = OBJECTS.crop((0, 128, 32, 144))

# crop name -> (frame width, frame height, frames on the sheet)
CROPS = {
    "wheat": (18, 32, 8), "tomato": (16, 32, 23), "corn": (16, 32, 8),
    "bamboo": (16, 32, 7), "tallgrass": (16, 32, 6), "eggplant": (16, 32, 7),
    "pepper": (16, 32, 11), "leek": (16, 32, 7), "celery": (16, 32, 7),
    "broccoli": (16, 32, 7), "onion": (16, 32, 7), "potato": (16, 32, 7),
    "grape": (18, 32, 7), "berry": (16, 16, 7), "carrot": (16, 16, 7),
    "radish": (16, 16, 7), "beetroot": (16, 16, 7), "lettuce": (16, 16, 7),
    "cauliflower": (16, 16, 7), "pumpkin": (16, 16, 7),
}
STAGES = 4

for name, (fw, fh, count) in CROPS.items():
    sheet = load("super-retro-ranch/crops/%s.png" % name)
    picks = [round(i * (count - 1) / (STAGES - 1)) for i in range(STAGES)]
    for s, fi in enumerate(picks):
        sprites["crop_%s_%d" % (name, s)] = sheet.crop((fi * fw, 0, (fi + 1) * fw, fh))

FACINGS = ("d", "l", "r", "u")
for act, fname, frames in (("idle", "idle.png", 1), ("walk", "walk.png", 3),
                           ("hoe", "hoe.png", 3), ("water", "water.png", 3)):
    sheet = load("super-retro-ranch/farmer/" + fname)
    for fi in range(frames):
        for di, face in enumerate(FACINGS):
            sprites["farmer_%s_%s_%d" % (act, face, fi)] = sheet.crop(
                (fi * 32, di * 32, fi * 32 + 32, di * 32 + 32))


# ===========================================================================
# Valley Ruin -- scrub, stones, flowers
# ===========================================================================

STONES = load("valley-ruin/StoneAndBush.png")
sprites["rock"] = trim(STONES, (0, 0, 32, 32))
sprites["shrub"] = trim(STONES, (0, 64, 32, 96))

FLOWERS = load("valley-ruin/FlowerAndGrass.png")
sprites["reeds"] = trim(FLOWERS, (0, 0, 16, 32))
sprites["grasstuft"] = trim(FLOWERS, (48, 16, 64, 32))
sprites["sunflower"] = trim(FLOWERS, (0, 32, 16, 64))
sprites["flowers_purple"] = trim(FLOWERS, (64, 32, 80, 64))
sprites["flowers_white"] = trim(FLOWERS, (112, 48, 128, 64))
sprites["flowers_pink"] = trim(FLOWERS, (64, 64, 80, 96))


# ===========================================================================
# Craftpix -- fruit trees, produce crates, the well, cart and barrel
# ===========================================================================

# The mature trees sit in columns 6 and 7 but do not line up with the 48px
# grid -- these are their measured vertical extents.
PLANTS = load("craftpix/Plants.png")
FRUITED, PLAIN = 336, 288          # x of the fruiting and plain tree columns

for name, col, y0, y1 in (
    ("fruit_plum", FRUITED, 14, 80),
    ("fruit_lemon", FRUITED, 82, 144),
    ("fruit_apple", FRUITED, 149, 208),
    ("banana_tree", FRUITED, 219, 288),
    ("palm", FRUITED, 298, 368),
    ("leafy_tree", PLAIN, 149, 208),
    ("leafy_tall", PLAIN, 14, 80),
):
    sprites[name] = trim(PLANTS, (col, y0, col + 48, y1))

SUPPLIES = load("craftpix/Supplies.png")      # 32px cells


def supply(cx, cy):
    return trim(SUPPLIES, (cx * 32, cy * 32, (cx + 1) * 32, (cy + 1) * 32))


sprites["crate_green"] = supply(8, 0)
sprites["crate_dark"] = supply(5, 0)
sprites["crate_grain"] = supply(3, 0)

sprites["well"] = fit(load("craftpix/Well.png"), 26)
sprites["cart"] = fit(load("craftpix/Cart.png"), 26)
sprites["barrel_big"] = fit(load("craftpix/Barrel.png"), 16)


# ===========================================================================
# Freepik line art, recoloured -- attribution: macrovector / Freepik
# ===========================================================================

sprites["hive"] = solidify(load("freepik/beehive.webp"),
                           (0xd8, 0x93, 0x2b, 255), (0x5f, 0x3a, 0x18, 255), 20)
sprites["bee"] = solidify(load("freepik/bee.webp"),
                          (0xf4, 0xb4, 0x1b, 255), (0x2e, 0x22, 0x18, 255), 10)
sprites["tractor"] = tint(load("freepik/tractor.webp"), (0x8a, 0x33, 0x2c), 34)
sprites["tiller"] = tint(load("freepik/tractor.webp"), (0x5f, 0x47, 0x2d), 22)


# ===========================================================================
# pack
# ===========================================================================

def pack(items, width=512, pad=1):
    """Greedy shelf packer, tallest first. Returns (manifest, height)."""
    ordered = sorted(items.items(), key=lambda kv: -kv[1].height)
    manifest, x, y, shelf = {}, pad, pad, 0
    for name, im in ordered:
        w, h = im.size
        if x + w + pad > width:
            x, y, shelf = pad, y + shelf + pad, 0
        manifest[name] = (x, y, w, h)
        x += w + pad
        shelf = max(shelf, h)
    return manifest, y + shelf + pad


manifest, height = pack(sprites)
atlas = Image.new("RGBA", (512, height), (0, 0, 0, 0))
for name, (x, y, w, h) in manifest.items():
    atlas.paste(sprites[name], (x, y))

os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
atlas.save(OUT_PNG)

buf = io.BytesIO()
atlas.save(buf, format="PNG", optimize=True)
raw = buf.getvalue()
b64 = base64.b64encode(raw).decode("ascii")

os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)
with open(OUT_JS, "w") as fh:
    fh.write("// generated by tools/build_atlas.py -- do not edit by hand\n")
    fh.write("// Art: Cute Fantasy (free); Farm RPG FREE 16x16 Tiny Asset Pack;\n")
    fh.write("// Super Retro Ranch free tier by Gif; Valley Ruin Asset Pack V0.3;\n")
    fh.write("// Craftpix free plants and summer tileset; line art by\n")
    fh.write("// macrovector / Freepik, recoloured.\n")
    fh.write("const ATLAS_SRC = 'data:image/png;base64," + b64 + "';\n")
    fh.write("const ATLAS = " + json.dumps(manifest, separators=(",", ":")) + ";\n")

print("packed %d sprites into 512x%d" % (len(manifest), height))
print("  png  %.0f KB   base64 %.0f KB" % (len(raw) / 1024, len(b64) / 1024))
print("  -> " + os.path.relpath(OUT_PNG, ROOT))
print("  -> " + os.path.relpath(OUT_JS, ROOT))
