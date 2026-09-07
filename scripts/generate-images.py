"""Generates placeholder industrial artwork for the site (run once; outputs committed).

Usage: python3 scripts/generate-images.py
"""

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent.parent / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = (11, 18, 25)
STEEL = (51, 65, 79)
LIGHT = (163, 179, 194)
AMBER = (245, 158, 11)


def gradient(w, h, c1, c2):
    img = Image.new("RGB", (w, h), c1)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        col = tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3))
        for x in range(w):
            px[x, y] = col
    return img


def turbine(w=1600, h=1000, seed=1):
    random.seed(seed)
    img = gradient(w, h, NAVY, (26, 40, 56))
    d = ImageDraw.Draw(img, "RGBA")
    # grid
    for x in range(0, w, 48):
        d.line([(x, 0), (x, h)], fill=(255, 255, 255, 10))
    for y in range(0, h, 48):
        d.line([(0, y), (w, y)], fill=(255, 255, 255, 10))
    cx, cy = int(w * 0.62), int(h * 0.5)
    # runner rings
    for r, a in [(420, 60), (360, 40), (300, 90), (150, 120), (90, 160)]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(LIGHT + (a,)), width=2)
    # blades
    for i in range(13):
        ang = i * 2 * math.pi / 13
        pts = []
        for t in range(0, 21):
            tt = t / 20
            rr = 100 + tt * 280
            aa = ang + tt * 0.9
            pts.append((cx + rr * math.cos(aa), cy + rr * math.sin(aa)))
        for t in range(20, -1, -1):
            tt = t / 20
            rr = 100 + tt * 280
            aa = ang + tt * 0.9 + 0.12 * (1 - tt) + 0.05
            pts.append((cx + rr * math.cos(aa), cy + rr * math.sin(aa)))
        d.polygon(pts, fill=(STEEL + (170,)), outline=(LIGHT + (120,)))
    d.ellipse([cx - 60, cy - 60, cx + 60, cy + 60], fill=(AMBER + (230,)))
    d.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=NAVY)
    # dimension lines
    d.line([(cx - 420, cy + 470), (cx + 420, cy + 470)], fill=AMBER + (200,), width=2)
    for x in (cx - 420, cx + 420):
        d.line([(x, cy + 455), (x, cy + 485)], fill=AMBER + (200,), width=2)
    return img.filter(ImageFilter.GaussianBlur(0.4))


def fabrication(w=1600, h=1000, seed=2):
    random.seed(seed)
    img = gradient(w, h, (26, 40, 56), NAVY)
    d = ImageDraw.Draw(img, "RGBA")
    for i in range(0, w + h, 60):
        d.line([(i, 0), (i - h, h)], fill=(255, 255, 255, 8), width=1)
    # steel beams
    for k in range(6):
        x = 120 + k * 250
        d.rectangle([x, 120, x + 40, h - 120], fill=STEEL + (200,), outline=LIGHT + (90,))
        d.rectangle([x - 30, 120, x + 70, 150], fill=STEEL + (230,))
        d.rectangle([x - 30, h - 150, x + 70, h - 120], fill=STEEL + (230,))
        for y in range(200, h - 200, 90):
            d.ellipse([x + 12, y, x + 28, y + 16], fill=AMBER + (200,))
    for k in range(5):
        x = 160 + k * 250
        d.line([(x, 150), (x + 250, h - 150)], fill=LIGHT + (60,), width=3)
        d.line([(x + 250, 150), (x, h - 150)], fill=LIGHT + (60,), width=3)
    return img


def blueprint(w=1600, h=1000, seed=3):
    random.seed(seed)
    img = Image.new("RGB", (w, h), (16, 32, 52))
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, w, 24):
        d.line([(x, 0), (x, h)], fill=(255, 255, 255, 12 if x % 120 else 30))
    for y in range(0, h, 24):
        d.line([(0, y), (w, y)], fill=(255, 255, 255, 12 if y % 120 else 30))
    cx, cy = w // 2, h // 2
    # wicket gate / bushing section
    for r in (380, 300, 220, 140, 70):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(220, 230, 240, 200), width=2)
    d.line([(cx - 440, cy), (cx + 440, cy)], fill=(220, 230, 240, 120), width=1)
    d.line([(cx, cy - 440), (cx, cy + 440)], fill=(220, 230, 240, 120), width=1)
    for i in range(20):
        a = i * math.pi / 10
        x1, y1 = cx + 300 * math.cos(a), cy + 300 * math.sin(a)
        x2, y2 = cx + 380 * math.cos(a + 0.18), cy + 380 * math.sin(a + 0.18)
        d.line([(x1, y1), (x2, y2)], fill=AMBER + (220,), width=3)
    d.rectangle([80, h - 200, 520, h - 80], outline=(220, 230, 240, 200), width=2)
    for i in range(3):
        d.line([(100, h - 170 + i * 35), (500, h - 170 + i * 35)], fill=(220, 230, 240, 90))
    return img


def team(w=1600, h=1000, seed=4):
    img = gradient(w, h, (15, 23, 32), (58, 76, 93))
    d = ImageDraw.Draw(img, "RGBA")
    # penstock & powerhouse silhouette
    d.polygon([(0, h), (0, h * 0.62), (w * 0.3, h * 0.55), (w * 0.55, h * 0.7), (w, h * 0.6), (w, h)], fill=(9, 14, 20, 230))
    for k in range(4):
        x = int(w * 0.6) + k * 90
        d.rectangle([x, int(h * 0.42), x + 50, int(h * 0.7)], fill=STEEL + (220,), outline=LIGHT + (100,))
    d.rectangle([int(w * 0.55), int(h * 0.38), int(w * 0.96), int(h * 0.44)], fill=LIGHT + (140,))
    # water
    for y in range(int(h * 0.72), h, 14):
        d.line([(0, y), (w, y)], fill=(120, 160, 200, 40), width=3)
    d.ellipse([int(w * 0.12), int(h * 0.12), int(w * 0.22), int(h * 0.27)], fill=AMBER + (200,))
    return img.filter(ImageFilter.GaussianBlur(0.6))


for name, fn in {
    "hero-turbine.jpg": turbine,
    "fabrication.jpg": fabrication,
    "blueprint.jpg": blueprint,
    "powerhouse.jpg": team,
}.items():
    fn().save(OUT / name, quality=82, optimize=True, progressive=True)
    print("wrote", name)
