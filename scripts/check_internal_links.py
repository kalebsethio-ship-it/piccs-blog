#!/usr/bin/env python3
"""Check every internal article link resolves to a real slug (no 404s introduced)."""
import glob
import os
import re

CONTENT = "/home/kalebooo/piccs-blog/content"
files = sorted(glob.glob(os.path.join(CONTENT, "*.md")))
slugs = {os.path.basename(f)[:-3] for f in files}

broken = {}
total = 0
for f in files:
    t = open(f, encoding="utf-8").read()
    for target in re.findall(r"\]\((/[^)\s]+)\)", t):
        tgt = target.strip("/").split("#")[0].split("?")[0]
        if not tgt:
            continue
        total += 1
        if tgt not in slugs:
            broken.setdefault(os.path.basename(f)[:-3], []).append(target)

print(f"internal article links total: {total}")
print(f"articles with broken internal links: {len(broken)}")
for src, tgts in broken.items():
    for t in sorted(set(tgts)):
        print(f"  {src[:46]:48} -> {t}")
if not broken:
    print("  ALL RESOLVE OK")

# also flag any surviving legacy wordpress URLs inline
print()
legacy = {}
for f in files:
    t = open(f, encoding="utf-8").read()
    hits = re.findall(r"https://piccreativespace\.id/wp-content/[^\s\)]+", t)
    if hits:
        legacy[os.path.basename(f)[:-3]] = hits
print(f"articles still inlining legacy WordPress image URLs: {len(legacy)}")
for k, v in legacy.items():
    print(f"  {k[:46]:48} {len(v)} url(s)")
