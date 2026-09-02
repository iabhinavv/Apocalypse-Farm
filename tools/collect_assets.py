#!/usr/bin/env python3
"""
Copy every source image the game actually uses into assets/.

The downloaded packs are large, nested and inconsistently named. This gathers
just the files build_atlas.py reads into one flat, predictable tree, so the
build has a single place to look and you can see at a glance what is in use.

Run this once after adding or replacing a pack:

    python3 tools/collect_assets.py

It also copies each pack's licence text into assets/licences/.
"""

import os
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DEST = os.path.join(ROOT, "assets")

FARMRPG = os.path.join(ROOT, "Farm RPG FREE 16x16 - Tiny Asset Pack",
                       "Farm RPG FREE 16x16 - Tiny Asset Pack")
FARMRPG_TOP = os.path.join(ROOT, "Farm RPG FREE 16x16 - Tiny Asset Pack")
CUTE = os.path.join(ROOT, "Cute_Fantasy_Free")
CRAFT_PLANTS = os.path.join(ROOT, "craftpix-net-200380-free-pixel-art-plants-for-farm", "PNG")
CRAFT_SUMMER = os.path.join(ROOT,
    "craftpix-net-381103-free-simple-summer-top-down-vector-tileset", "PNG")
SRR = os.path.join(ROOT, "SuperRetroRanch_FreeTier_v32")
VR = os.path.join(ROOT, "Valley Ruin Asset Pack V0.3")

# (source path, destination path under assets/)
FILES = [
    # --- Farm RPG: livestock, houses, fences, paths -----------------------
    (f"{FARMRPG}/Objects/House.png", "farm-rpg/House.png"),
    (f"{FARMRPG}/Objects/Maple Tree.png", "farm-rpg/MapleTree.png"),
    (f"{FARMRPG}/Objects/Fence's copiar.png", "farm-rpg/Fences.png"),
    (f"{FARMRPG}/Objects/Road copiar.png", "farm-rpg/Road.png"),
    (f"{FARMRPG}/Objects/chest.png", "farm-rpg/Chest.png"),
    (f"{FARMRPG}/Farm Animals/Female Cow Brown.png", "farm-rpg/Cow.png"),
    (f"{FARMRPG}/Farm Animals/Male Cow Brown.png", "farm-rpg/Bull.png"),
    (f"{FARMRPG}/Farm Animals/Chicken Red.png", "farm-rpg/ChickenRed.png"),
    (f"{FARMRPG}/Farm Animals/Chicken Blonde  Green.png", "farm-rpg/ChickenBlonde.png"),
    (f"{FARMRPG}/Farm Animals/Baby Chicken Yellow.png", "farm-rpg/Chick.png"),

    # --- Cute Fantasy: water, farmhouse, sheep, decor ---------------------
    (f"{CUTE}/Tiles/Water_Tile.png", "cute-fantasy/Water_Tile.png"),
    (f"{CUTE}/Tiles/Water_Middle.png", "cute-fantasy/Water_Middle.png"),
    (f"{CUTE}/Tiles/Path_Tile.png", "cute-fantasy/Path_Tile.png"),
    (f"{CUTE}/Tiles/FarmLand_Tile.png", "cute-fantasy/FarmLand_Tile.png"),
    (f"{CUTE}/Outdoor decoration/House_1_Wood_Base_Blue.png", "cute-fantasy/Farmhouse.png"),
    (f"{CUTE}/Outdoor decoration/Bridge_Wood.png", "cute-fantasy/Bridge_Wood.png"),
    (f"{CUTE}/Outdoor decoration/Oak_Tree.png", "cute-fantasy/Oak_Tree.png"),
    (f"{CUTE}/Outdoor decoration/Oak_Tree_Small.png", "cute-fantasy/Oak_Tree_Small.png"),
    (f"{CUTE}/Outdoor decoration/Outdoor_Decor_Free.png", "cute-fantasy/Outdoor_Decor.png"),
    (f"{CUTE}/Animals/Sheep/Sheep.png", "cute-fantasy/Sheep.png"),

    # --- Super Retro Ranch: terrain, props, farmer ------------------------
    (f"{SRR}/assets/tiles/ground_01_16x16.png", "super-retro-ranch/ground.png"),
    (f"{SRR}/assets/objects/objects_01_16x16.png", "super-retro-ranch/objects.png"),

    # --- Craftpix pixel plants: fruit trees and produce crates ------------
    (f"{CRAFT_PLANTS}/Plants.png", "craftpix/Plants.png"),
    (f"{CRAFT_PLANTS}/Supplies.png", "craftpix/Supplies.png"),

    # --- Craftpix summer tileset: the well, the cart, a barrel ------------
    (f"{CRAFT_SUMMER}/Top-Down Simple Summer_Prop - Well.png", "craftpix/Well.png"),
    (f"{CRAFT_SUMMER}/Top-Down Simple Summer_Prop - Wooden Cart.png", "craftpix/Cart.png"),
    (f"{CRAFT_SUMMER}/Top-Down Simple Summer_Prop - Wooden Barrel.png", "craftpix/Barrel.png"),

    # --- loose line-art illustrations, recoloured at atlas time -----------
    # macrovector / Freepik -- attribution required, see licences/
    (f"{ROOT}/beehive.webp", "freepik/beehive.webp"),
    (f"{ROOT}/bee.webp", "freepik/bee.webp"),
    (f"{ROOT}/tractor.webp", "freepik/tractor.webp"),

    # --- Valley Ruin: scrub, stones, flowers ------------------------------
    (f"{VR}/Objects/stone and bush.png", "valley-ruin/StoneAndBush.png"),
    (f"{VR}/FlowerAndGrass.png", "valley-ruin/FlowerAndGrass.png"),
]

# whole directories worth copying: the crop growth sheets and the farmer
CROPS = ["wheat", "tomato", "corn", "bamboo", "tallgrass", "eggplant", "pepper",
         "leek", "celery", "broccoli", "onion", "potato", "grape", "berry",
         "carrot", "radish", "beetroot", "lettuce", "cauliflower", "pumpkin"]

FARMER = [
    ("idle", "male_01_hat_idle_32x32.png", "idle.png"),
    ("walk", "male_01_hat_walk_32x32_3frames.png", "walk.png"),
    ("hoe", "male_01_hat_hoe_32x32_3frames.png", "hoe.png"),
    ("water", "male_01_hat_water_32x32_3frames.png", "water.png"),
]

LICENCES = [
    (f"{SRR}/info/License_SuperRetroRanch_FreeTier.txt",
     "licences/SuperRetroRanch-FreeTier.txt"),
    (f"{CUTE}/read_me.txt", "licences/CuteFantasy-Free.txt"),
    (f"{CRAFT_PLANTS}/../license.txt", "licences/Craftpix-Plants.txt"),
    (f"{CRAFT_SUMMER}/../license.txt", "licences/Craftpix-SummerTileset.txt"),
    (f"{ROOT}/honey-elements-set/License free.txt", "licences/Freepik-HoneySet.txt"),
]


def copy(src, rel):
    dst = os.path.join(DEST, rel)
    if not os.path.exists(src):
        print("  MISSING  " + os.path.relpath(src, ROOT))
        return 0
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    return 1


def main():
    n = 0
    for src, rel in FILES:
        n += copy(src, rel)

    for crop in CROPS:
        d = os.path.join(SRR, "assets", "crops", crop, "growth_basic")
        if not os.path.isdir(d):
            print("  MISSING  crops/" + crop)
            continue
        for fname in sorted(os.listdir(d)):
            if fname.endswith(".png"):
                n += copy(os.path.join(d, fname),
                          "super-retro-ranch/crops/%s.png" % crop)
                break

    for sub, fname, out in FARMER:
        n += copy(os.path.join(SRR, "assets", "characters", "males", "male_01", sub, fname),
                  "super-retro-ranch/farmer/%s" % out)

    for src, rel in LICENCES:
        n += copy(src, rel)

    print("collected %d files into %s/" % (n, os.path.relpath(DEST, ROOT)))


if __name__ == "__main__":
    main()
