#!/usr/bin/env python3
"""
Cut the wooden signboard and fence sheets into sprites.

Both arrive as large JPEGs on a near-white ground, so there is no alpha to work
from and no reliable grid: the sheets are segmented by finding the gaps between
sprites, row band by row band, rather than assuming a fixed number of columns.

    python3 tools/extract_new_assets.py

Writes assets/new_assets/. build_atlas.py reads from there like any other pack.
"""

import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "assets", "new_assets")

INK = 70          # distance from the background colour that counts as drawing
GAP = 12          # blank columns needed before we call it a gap between sprites


def bands(mask, gap=GAP):
    """Runs of True, merging anything separated by less than `gap`."""
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        if not v and start is not None:
            out.append([start, i])
            start = None
    if start is not None:
        out.append([start, len(mask)])
    merged = []
    for b in out:
        if merged and b[0] - merged[-1][1] < gap:
            merged[-1][1] = b[1]
        else:
            merged.append(b)
    return [tuple(b) for b in merged]


def cut(path):
    """Every sprite on the sheet, as trimmed RGBA images, in reading order."""
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(int)
    bg = a[2, 2]
    ink = np.abs(a - bg).sum(axis=2) > INK

    rgba = np.dstack([np.asarray(im), np.where(ink, 255, 0).astype(np.uint8)])
    full = Image.fromarray(rgba, "RGBA")

    out = []
    for y0, y1 in bands(ink.any(axis=1)):
        for x0, x1 in bands(ink[y0:y1].any(axis=0)):
            cell = full.crop((x0, y0, x1, y1))
            bb = cell.getbbox()
            if bb:
                out.append(cell.crop(bb))
    return out


def shrink(im, w):
    """Down to sprite size. BOX averages whole source blocks, which keeps the
    flat colours of pixel art clean where LANCZOS would smear them."""
    h = max(1, round(im.height * w / im.width))
    small = im.resize((w, h), Image.BOX)
    # JPEG leaves a soft halo -- push the edge alpha back to on or off
    px = small.load()
    for y in range(small.height):
        for x in range(small.width):
            r, g, b, al = px[x, y]
            px[x, y] = (r, g, b, 255 if al > 128 else 0)
    return small


def main():
    os.makedirs(OUT, exist_ok=True)
    for old in os.listdir(OUT):
        os.remove(os.path.join(OUT, old))

    signs = cut(os.path.join(ROOT, "signboards.jpg"))
    for i, s in enumerate(signs):
        shrink(s, 34).save(os.path.join(OUT, "signboard_%d.png" % i))
    print("signboards: %d" % len(signs))

    # each fence sprite is a run of three pickets -> 48px, one 16px tile each
    fences = cut(os.path.join(ROOT, "fences.jpg"))
    for i, f in enumerate(fences):
        shrink(f, 48).save(os.path.join(OUT, "fence_%d.png" % i))
    print("fences: %d" % len(fences))


if __name__ == "__main__":
    main()
