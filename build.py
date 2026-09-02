#!/usr/bin/env python3
"""
Weld src/ into a single self-contained Apocalypse-Farm.html.

Run tools/build_atlas.py first if the sprite set has changed; this script only
assembles what is already in src/.
"""

import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
OUT = os.path.join(ROOT, "Apocalypse-Farm.html")

# order matters: data before the engine that reads it, engine before the UI
ORDER = [
    "gen-atlas.js",
    "data-regions.js",
    "data-crops.js",
    "data-crops-garden.js",
    "data-animals.js",
    "engine.js",
    "data-steps.js",
    "farm.js",
    "app.js",
]


def read(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as fh:
        return fh.read()


def main():
    if "--atlas" in sys.argv:
        subprocess.check_call([sys.executable, os.path.join(ROOT, "tools", "build_atlas.py")])

    missing = [n for n in ORDER if not os.path.exists(os.path.join(SRC, n))]
    if missing:
        sys.exit("missing source files: " + ", ".join(missing))

    scripts = []
    for name in ORDER:
        body = read(name)
        scripts.append("/* ===== " + name + " " + "=" * max(0, 58 - len(name)) + " */\n" + body)

    html = read("index.template.html")
    html = html.replace("/*__STYLES__*/", read("styles.css"))
    html = html.replace("/*__SCRIPTS__*/", "\n\n".join(scripts))

    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(html)

    size = os.path.getsize(OUT)
    print(f"built {os.path.basename(OUT)}  —  {size / 1024:.0f} KB")
    for name in ORDER:
        n = len(read(name).splitlines())
        print(f"    {name:24s} {n:5d} lines")


if __name__ == "__main__":
    main()
