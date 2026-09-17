#!/usr/bin/env python3
"""Rebuild every PICCS blog logo / favicon asset from the official square lockup.

Problem being fixed: the previous assets were the WIDE logo (360x214, ratio 1.68)
force-fitted into square canvases, which squashed the artwork.

Master source: cropped-SLIDE-LOGO-PICCS-NEW.jpg (512x512, official square lockup,
white "PIC" + "creative space" on black).

Outputs two flavours:
  * transparent white-on-alpha  -> for dark UI (header, footer, cards)
  * opaque black-background     -> for favicons / OG images (white-on-transparent
                                   disappears against light browser chrome)
"""
import os
import shutil

from PIL import Image, ImageDraw

# Pillow >= 9.1 moved the resampling constants under Image.Resampling.
RESAMPLE = getattr(Image, "Resampling", Image).LANCZOS

SRC = "/home/kalebooo/piccs-logo-candidates/cropped-SLIDE-LOGO-PICCS-NEW.jpg"
PUB = "/home/kalebooo/piccs-blog/public"
APP = "/home/kalebooo/piccs-blog/src/app"
BACKUP = "/home/kalebooo/piccs-blog/.logo-backup"

os.makedirs(BACKUP, exist_ok=True)


def backup(path: str) -> None:
    if os.path.exists(path):
        shutil.copy2(path, os.path.join(BACKUP, os.path.basename(path)))


def lum_to_alpha(lum: Image.Image, lo: int = 18, hi: int = 248) -> Image.Image:
    """Map luminance to alpha, clipping JPEG background noise to fully transparent."""
    return lum.point(lambda v: 0 if v <= lo else (255 if v >= hi else int((v - lo) * 255 / (hi - lo))))


master = Image.open(SRC).convert("RGB")
assert master.size == (512, 512), f"unexpected master size {master.size}"

# --- transparent white-on-alpha version -------------------------------------
alpha = lum_to_alpha(master.convert("L"))
white = Image.new("RGB", master.size, (255, 255, 255))
transparent = white.convert("RGBA")
transparent.putalpha(alpha)

# --- opaque version (black background, exactly like the source lockup) ------
opaque = master.copy()


def save_png(img: Image.Image, name: str, size: int) -> str:
    path = os.path.join(PUB, name)
    backup(path)
    img.resize((size, size), RESAMPLE).save(path, "PNG", optimize=True)
    return path


def save_jpg(img: Image.Image, name: str, size: int, quality: int = 92) -> str:
    path = os.path.join(PUB, name)
    backup(path)
    img.resize((size, size), RESAMPLE).save(path, "JPEG", quality=quality, optimize=True)
    return path


print("=== transparent white-on-alpha (dark UI) ===")
for name, size in [
    ("logo-piccs-white.png", 512),
    ("logo-piccs.png", 512),
    ("logo-piccs-inline.png", 512),
]:
    print("  ", save_png(transparent, name, size))

print("\n=== opaque black-background (OG images, cards) ===")
for name, size in [
    ("logo-piccs-white.jpg", 512),
    ("logo-piccs.jpg", 512),
    ("logo-piccs-inline.jpg", 512),
]:
    print("  ", save_jpg(opaque, name, size))

print("\n=== favicons / app icons (opaque, so they read on light chrome) ===")
for name, size in [
    ("favicon.png", 64),
    ("apple-touch-icon.png", 180),
    ("icon-192.png", 192),
    ("icon-512.png", 512),
]:
    print("  ", save_png(opaque, name, size))

for name, size in [
    ("favicon-16.png", 16),
    ("favicon-32.png", 32),
    ("favicon-48.png", 48),
]:
    path = os.path.join(APP, name)
    backup(path)
    opaque.resize((size, size), RESAMPLE).save(path, "PNG", optimize=True)
    # also expose from public/ so layout.tsx can link each size correctly
    pub_path = os.path.join(PUB, name)
    backup(pub_path)
    opaque.resize((size, size), RESAMPLE).save(pub_path, "PNG", optimize=True)
    print("  ", path)
    print("  ", pub_path)

ico_path = os.path.join(APP, "favicon.ico")
backup(ico_path)
# Next.js decodes app favicons through its image pipeline and requires RGBA
opaque.convert("RGBA").resize((256, 256), RESAMPLE).save(
    ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)
print("  ", ico_path)

# --- preview sheet so the result can be eyeballed at real sizes -------------
sheet = Image.new("RGB", (700, 220), (10, 10, 10))
x = 20
for size in (16, 32, 48, 64, 128):
    sheet.paste(opaque.resize((size, size), RESAMPLE), (x, 20))
    x += size + 20
# transparent version composited on the blog background colour
bg = Image.new("RGB", (400, 160), (10, 10, 10))
comp = transparent.resize((128, 128), RESAMPLE)
bg.paste(comp, (140, 16), comp)
sheet.paste(bg, (280, 30))
sheet.save("/home/kalebooo/piccs-logo-candidates/preview.png")
print("\npreview -> /home/kalebooo/piccs-logo-candidates/preview.png")
print("backups ->", BACKUP)
