"""Retouche des photos de la maquette : étalonnage Atmospheric Precision et montages.

Exemples :
  python tools/grade.py grade source.jpg public/assets/photos-v2/sector-chimie.webp --size 1600x1000
  python tools/grade.py grade source.jpg out.webp --size 1200x900 --variant dark --focus 0.5,0.4
  python tools/grade.py montage fond.jpg public/assets/dropout-cutout.png out.webp --size 1600x1000 --anchor 0.7

Variantes : light (sections claires, brume pâle en haut), dark (bandeaux sombres), neutral.
--focus x,y (0-1) indique le point à garder au centre du recadrage.
"""
import argparse
import random

from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps

NAVY = (24, 52, 78)      # ombres, proche du bleu profond de la maquette
ICE = (238, 245, 251)    # hautes lumières, fond pâle #f3f7fa légèrement refroidi
BLUE = (67, 149, 209)    # bleu identité #4395d1


def parse_size(value):
    w, h = value.lower().split('x')
    return int(w), int(h)


def cover(img, size, focus=(0.5, 0.5)):
    """Recadre pour remplir `size` en gardant le point `focus` visible."""
    tw, th = size
    scale = max(tw / img.width, th / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    fx, fy = focus
    left = min(max(round(img.width * fx - tw / 2), 0), img.width - tw)
    top = min(max(round(img.height * fy - th / 2), 0), img.height - th)
    return img.crop((left, top, left + tw, top + th))


def split_tone(img, strength):
    gray = ImageOps.grayscale(img)
    toned = ImageOps.colorize(gray, black=NAVY, white=ICE, mid=(120, 150, 178))
    return Image.blend(img, toned, strength)


def grain(img, amount=7, seed=7):
    random.seed(seed)
    noise = Image.effect_noise(img.size, amount * 4).convert('L')
    noise = noise.point(lambda v: 128 + (v - 128) * 0.25)
    noise_rgb = Image.merge('RGB', (noise, noise, noise))
    return ImageChops.overlay(img, noise_rgb)


def mist(img, opacity=0.22):
    """Voile pâle descendant du haut, comme le ciel brumeux de la Hero."""
    w, h = img.size
    mask = Image.linear_gradient('L').resize((w, h)).point(lambda v: int((255 - v) * opacity))
    veil = Image.new('RGB', (w, h), ICE)
    return Image.composite(veil, img, mask)


def grade_image(img, variant='light'):
    img = img.convert('RGB')
    img = ImageEnhance.Color(img).enhance(0.72)
    if variant == 'dark':
        img = split_tone(img, 0.42)
        img = ImageEnhance.Brightness(img).enhance(0.82)
        img = ImageEnhance.Contrast(img).enhance(1.08)
    elif variant == 'light':
        img = split_tone(img, 0.30)
        img = ImageEnhance.Contrast(img).enhance(0.94)
        img = mist(img)
    else:
        img = split_tone(img, 0.25)
    # Noirs légèrement relevés : pas de noir pur dans la direction.
    img = img.point(lambda v: 14 + v * (241 / 255))
    return grain(img)


def cmd_grade(args):
    img = Image.open(args.source)
    focus = tuple(float(v) for v in args.focus.split(',')) if args.focus else (0.5, 0.5)
    out = grade_image(cover(img, parse_size(args.size), focus), args.variant)
    out.save(args.output, quality=args.quality, method=6)
    print('ok', args.output, out.size)


def cmd_montage(args):
    size = parse_size(args.size)
    bg = cover(Image.open(args.background), size)
    bg = grade_image(bg.filter(ImageFilter.GaussianBlur(args.blur)), 'dark')
    cut = Image.open(args.cutout).convert('RGBA')
    target_h = round(size[1] * args.height)
    cut = cut.resize((round(cut.width * target_h / cut.height), target_h), Image.LANCZOS)
    x = round(size[0] * args.anchor - cut.width / 2)
    y = size[1] - target_h - round(size[1] * 0.04)
    # Ombre portée douce, décalée vers le bas.
    shadow = Image.new('RGBA', bg.size, (0, 0, 0, 0))
    alpha = cut.getchannel('A').point(lambda v: int(v * 0.55))
    shadow.paste((8, 20, 34, 255), (x + 18, y + 26), alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    canvas = bg.convert('RGBA')
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.alpha_composite(cut, (x, y))
    canvas = grain(canvas.convert('RGB'), amount=5)
    canvas.save(args.output, quality=args.quality, method=6)
    print('ok', args.output, canvas.size)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest='cmd', required=True)

    g = sub.add_parser('grade')
    g.add_argument('source')
    g.add_argument('output')
    g.add_argument('--size', default='1600x1000')
    g.add_argument('--variant', choices=['light', 'dark', 'neutral'], default='light')
    g.add_argument('--focus')
    g.add_argument('--quality', type=int, default=82)
    g.set_defaults(func=cmd_grade)

    m = sub.add_parser('montage')
    m.add_argument('background')
    m.add_argument('cutout')
    m.add_argument('output')
    m.add_argument('--size', default='1600x1000')
    m.add_argument('--anchor', type=float, default=0.68, help='position horizontale du détourage (0-1)')
    m.add_argument('--height', type=float, default=0.86, help='hauteur du détourage / hauteur image')
    m.add_argument('--blur', type=float, default=5)
    m.add_argument('--quality', type=int, default=84)
    m.set_defaults(func=cmd_montage)

    args = parser.parse_args()
    args.func(args)


if __name__ == '__main__':
    main()
