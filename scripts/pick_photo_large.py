import json, os, urllib.parse, re

with open('/home/kalebooo/piccs-blog/scripts/photos_cache.json') as f:
    photos = json.load(f)

title = "Event Space untuk Kelompok Besar 500 Plus Pax: Realita Kapasitas & Tips Alokasi di Jakarta"
tags = ["kapasitas 500 pax", "event space besar jakarta", "venue hall jakarta", "sewa venue kapasitas besar", "event space jakarta"]

def norm(s):
    return re.sub(r'[^a-z0-9\s]', ' ', str(s).lower()).strip()

def tokenize(text):
    return set(norm(text).split())

article_tokens = tokenize(' '.join([title] + tags))

def jaccard(a,b):
    inter = len(a & b)
    return inter / (len(a) + len(b) - inter or 1)

scored = []
for p in photos:
    pt = tokenize(' '.join(p.get('tags', []) + [p.get('description', '') or '']))
    s = jaccard(article_tokens, pt)
    scored.append((s, p))

scored.sort(key=lambda x: x[0], reverse=True)

for s, p in scored[:10]:
    # reconstruct likely folder from filesystem if path missing folder
    path = p.get('path', '')
    if path and not path.startswith('/'):
        # try to find actual file
        import glob
        matches = glob.glob(f"/home/kalebooo/piccs-photos/**/{path}", recursive=True)
        if matches:
            path = matches[0]
    url = None
    if path:
        rel = path.replace('/home/kalebooo/piccs-photos/', '')
        url = 'https://photos.piccreativespace.id/' + urllib.parse.quote(rel)
    print(f"score={s:.3f} path={path} url={url} tags={p.get('tags')}")
