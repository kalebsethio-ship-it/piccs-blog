#!/usr/bin/env python3
"""Audit the voice-rewrite run: did it strip legitimate 'mimpi' content?"""
import glob
import os
import re
import subprocess

REPO = "/home/kalebooo/piccs-blog"
BEFORE = "e13f876"
CONTENT = os.path.join(REPO, "content")

os.chdir(REPO)

print("=== 1. 'mimpi' / 'impian' OCCURRENCES REMOVED BY THE REWRITE ===")
diff = subprocess.run(
    ["git", "diff", f"{BEFORE}..HEAD", "--", "content/"],
    capture_output=True, text=True, cwd=REPO,
).stdout
removed, added = [], []
for line in diff.split("\n"):
    if re.match(r"^-[^-]", line) and re.search(r"mimpi|impian", line, re.I):
        removed.append(line)
    if re.match(r"^\+[^+]", line) and re.search(r"mimpi|impian", line, re.I):
        added.append(line)

print(f"  lines REMOVED containing mimpi/impian: {len(removed)}")
for x in removed[:25]:
    print("   ", x[:160])
print(f"\n  lines ADDED containing mimpi/impian: {len(added)}")
for x in added[:12]:
    print("   ", x[:160])

print("\n=== 2. 'mimpi' STILL PRESENT PER ARTICLE (current state) ===")
files = sorted(glob.glob(os.path.join(CONTENT, "*.md")))
still = []
for f in files:
    t = open(f, encoding="utf-8").read()
    n = len(re.findall(r"mimpi|impian", t, re.I))
    if n:
        still.append((os.path.basename(f)[:-3], n))
print(f"  articles still containing the word: {len(still)}/{len(files)}")
for s, n in still:
    print(f"    {n}x  {s}")

print("\n=== 3. RITUAL COMPLIANCE ===")
def check(pattern, label, want_present=True):
    missing = []
    for f in files:
        t = open(f, encoding="utf-8").read()
        found = re.search(pattern, t, re.I)
        if want_present and not found:
            missing.append(os.path.basename(f)[:-3])
        if not want_present and found:
            missing.append(os.path.basename(f)[:-3])
    status = "OK" if not missing else f"FAIL ({len(missing)})"
    print(f"  {label:44} {status}")
    for m in missing[:6]:
        print(f"      - {m}")

check(r"Hi Creative Friends", "opens with 'Hi Creative Friends!'")
check(r"Do you need a space\? BOOK NOW!", "closes with the tagline")
check(r"\bAnda\b", "contains 'Anda' (should be none)", want_present=False)
check(r"[\U0001F300-\U0001FAFF\u2600-\u27BF]", "contains emoji (should be none)", want_present=False)

print("\n=== 4. INTERNAL LINKS PER ARTICLE ===")
slugs = {os.path.basename(f)[:-3] for f in files}
tot = 0
zero = []
for f in files:
    t = open(f, encoding="utf-8").read()
    links = set(re.findall(r"\]\((/[a-z0-9\-]+)\)", t))
    links = {x.strip("/") for x in links if x.strip("/") in slugs}
    tot += len(links)
    if not links:
        zero.append(os.path.basename(f)[:-3])
print(f"  total distinct internal article links: {tot}")
print(f"  articles with ZERO internal links: {len(zero)}")
for z in zero:
    print("      -", z)

print("\n=== 5. WORD COUNTS (before -> after) ===")
import statistics
after = []
for f in files:
    after.append(len(re.findall(r"\w+", open(f, encoding="utf-8").read())))
print(f"  articles: {len(after)}   median {int(statistics.median(after))}   mean {int(statistics.mean(after))}")
