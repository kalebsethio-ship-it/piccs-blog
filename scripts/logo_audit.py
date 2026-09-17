#!/usr/bin/env python3
"""Audit the PICCS blog logo / favicon assets: dimensions, aspect ratio, usage."""
import glob
import os
import re

PUB = "/home/kalebooo/piccs-blog/public"
SRC = "/home/kalebooo/piccs-blog/src"

try:
    from PIL import Image  # type: ignore[import-not-found]
except ImportError:  # pragma: no cover
    Image = None  # type: ignore[assignment]

HAVE_PIL = Image is not None

print("=== IMAGE ASSETS IN public/ ===")
files = sorted(glob.glob(os.path.join(PUB, "**", "*"), recursive=True))
rows = []
for f in files:
    if not os.path.isfile(f):
        continue
    if not re.search(r"\.(png|jpg|jpeg|ico|webp|svg)$", f, re.I):
        continue
    rel = "/" + os.path.relpath(f, PUB)
    size = os.path.getsize(f)
    dims = "?"
    if HAVE_PIL and not f.lower().endswith(".svg"):
        try:
            with Image.open(f) as im:
                w, h = im.size
                ratio = round(w / h, 2) if h else 0
                dims = f"{w}x{h}  ratio={ratio}  {'SQUARE' if 0.97 <= ratio <= 1.03 else 'NON-SQUARE'}"
                dims += f"  mode={im.mode}"
        except Exception as e:
            dims = f"ERR {e}"
    rows.append((rel, size, dims))
for rel, size, dims in rows:
    print(f"  {rel:38} {size:>8,}B  {dims}")

print("\n=== WHERE LOGO / ICON ASSETS ARE REFERENCED IN src/ ===")
hits = {}
for f in glob.glob(os.path.join(SRC, "**", "*"), recursive=True):
    if not os.path.isfile(f) or not re.search(r"\.(tsx|ts|css)$", f):
        continue
    t = open(f, encoding="utf-8").read()
    for m in re.finditer(r'["\'\(](/?[A-Za-z0-9._\-/]*(?:logo|favicon|icon-|apple-touch|manifest|og-)[A-Za-z0-9._\-/]*)["\'\)]', t):
        hits.setdefault(m.group(1), set()).add(os.path.relpath(f, SRC))
for asset in sorted(hits):
    print(f"  {asset:38} <- {', '.join(sorted(hits[asset]))}")

print("\n=== manifest.json ===")
mp = os.path.join(PUB, "manifest.json")
if os.path.exists(mp):
    print(open(mp, encoding="utf-8").read())
