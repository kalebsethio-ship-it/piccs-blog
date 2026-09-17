#!/usr/bin/env python3
"""Fetch candidate square PICCS logos from the main site and report their size."""
import os
import urllib.request

OUT = "/home/kalebooo/piccs-logo-candidates"
os.makedirs(OUT, exist_ok=True)

CANDIDATES = [
    "https://piccreativespace.id/wp-content/uploads/2025/07/cropped-SLIDE-LOGO-PICCS-NEW-270x270.jpg",
    "https://piccreativespace.id/wp-content/uploads/2025/07/cropped-SLIDE-LOGO-PICCS-NEW-192x192.jpg",
    "https://piccreativespace.id/wp-content/uploads/2025/07/SLIDE-LOGO-PICCS-NEW.jpg",
    "https://piccreativespace.id/wp-content/uploads/2025/07/SLIDE-LOGO-PICCS-NEW.png",
    "https://piccreativespace.id/wp-content/uploads/2025/07/SLIDE-LOGO-PICCS-NEW-scaled.jpg",
    "https://piccreativespace.id/wp-content/uploads/2025/07/cropped-Untitled-design-33-1.png",
]

try:
    from PIL import Image  # type: ignore[import-not-found]
except ImportError:
    Image = None  # type: ignore[assignment]

for url in CANDIDATES:
    name = url.rsplit("/", 1)[-1]
    dest = os.path.join(OUT, name)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        open(dest, "wb").write(data)
    except Exception as e:
        print(f"  FAIL  {name:48} {e}")
        continue

    dims = "?"
    if Image is not None:
        try:
            with Image.open(dest) as im:
                w, h = im.size
                ratio = round(w / h, 2) if h else 0
                dims = f"{w}x{h} ratio={ratio} {'SQUARE' if 0.97 <= ratio <= 1.03 else 'NON-SQUARE'}"
        except Exception as e:
            dims = f"ERR {e}"
    print(f"  OK    {name:48} {len(data):>9,}B  {dims}  -> {dest}")
