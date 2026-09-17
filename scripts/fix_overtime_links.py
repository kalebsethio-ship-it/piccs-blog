#!/usr/bin/env python3
"""Repair internal links that point at the ghost overtime slug.

The voice-rewrite run briefly wrote the overtime article to a filename missing
the word "tetap". It merged the file back, but 3 articles had already been given
a link to the ghost slug, which would 404.
"""
import glob
import os
import re

CONTENT = "/home/kalebooo/piccs-blog/content"

BAD = "/overtime-di-venue-cara-hitung-biaya-dan-3-tips-biar-acara-tepat-waktu"
GOOD = "/overtime-di-venue-cara-hitung-biaya-dan-3-tips-biar-acara-tetap-tepat-waktu"

assert BAD not in GOOD, "BAD must not be a substring of GOOD"

slugs = {os.path.basename(f)[:-3] for f in glob.glob(os.path.join(CONTENT, "*.md"))}
assert GOOD.strip("/") in slugs, f"target slug missing: {GOOD}"

fixed = []
for path in sorted(glob.glob(os.path.join(CONTENT, "*.md"))):
    raw = open(path, encoding="utf-8").read()
    if BAD not in raw:
        continue
    n = raw.count(BAD)
    open(path, "w", encoding="utf-8").write(raw.replace(BAD, GOOD))
    fixed.append((os.path.basename(path), n))

print(f"=== REPAIRED {len(fixed)} FILES ===")
for name, n in fixed:
    print(f"  {n}x  {name}")

# --- verify no broken internal article links remain -------------------------
print("\n=== RE-CHECK ALL INTERNAL ARTICLE LINKS ===")
broken = {}
total = 0
for path in sorted(glob.glob(os.path.join(CONTENT, "*.md"))):
    t = open(path, encoding="utf-8").read()
    # only real links: [text](url) — NOT images ![alt](url)
    for target in re.findall(r"(?<!!)\[[^\]]*\]\((/[^)\s]+)\)", t):
        tgt = target.strip("/").split("#")[0].split("?")[0]
        if not tgt:
            continue
        total += 1
        if tgt not in slugs:
            broken.setdefault(os.path.basename(path)[:-3], []).append(target)

print(f"  total internal article links: {total}")
print(f"  broken: {len(broken)}")
for src, tgts in broken.items():
    for t in sorted(set(tgts)):
        print(f"    {src[:44]:46} -> {t}")
print("  OK — all resolve" if not broken else "  FAIL")
