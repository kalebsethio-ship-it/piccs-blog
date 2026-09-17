#!/usr/bin/env python3
"""Remove the dead `canonical:` frontmatter field from PICCS blog articles.

The field was never read by any code, and 7 of the 10 values now point at 404s.
Self-canonical is handled by `alternates.canonical` in src/app/[slug]/page.tsx.
Only touches the YAML frontmatter block; body content is left alone.
"""
import glob
import os
import re
import sys

CONTENT = "/home/kalebooo/piccs-blog/content"
PATTERN = re.compile(r'^canonical:\s*"?[^"\n]*"?\s*\n', re.MULTILINE)

changed = []
for path in sorted(glob.glob(os.path.join(CONTENT, "*.md"))):
    raw = open(path, encoding="utf-8").read()
    # split frontmatter: file starts with '---\n'
    if not raw.startswith("---"):
        print(f"SKIP (no frontmatter): {os.path.basename(path)}")
        continue
    end = raw.find("\n---", 3)
    if end == -1:
        print(f"SKIP (unterminated frontmatter): {os.path.basename(path)}")
        continue

    fm = raw[: end + 1]
    rest = raw[end + 1 :]

    new_fm, n = PATTERN.subn("", fm)
    if n:
        open(path, "w", encoding="utf-8").write(new_fm + rest)
        removed = PATTERN.findall(fm)
        changed.append((os.path.basename(path), [r.strip() for r in removed]))

print(f"\n=== REMOVED `canonical:` FROM {len(changed)} FILES ===")
for name, vals in changed:
    for v in vals:
        print(f"  {name[:52]:54} - {v}")

if not changed:
    print("  (nothing matched)")
    sys.exit(0)

# verification: no article may still have the field
leftovers = []
for path in sorted(glob.glob(os.path.join(CONTENT, "*.md"))):
    t = open(path, encoding="utf-8").read()
    end = t.find("\n---", 3)
    fm = t[: end + 1] if end != -1 else t
    if re.search(r"^canonical:", fm, re.M):
        leftovers.append(os.path.basename(path))
print(f"\n=== VERIFY: articles still holding a canonical field: {len(leftovers)} ===")
for x in leftovers:
    print("  ", x)
print("OK" if not leftovers else "FAIL")
