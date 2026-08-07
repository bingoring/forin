# Generates the full forin icon set from the splash pixel art
# (mobile/src/components/onboardingArt.tsx) so every surface shows the same plane.
#
# Run: python3 mobile/scripts/mkicons.py   (writes straight into mobile/assets/images)
# Outputs:
#   icon.png                     1024  full-bleed sky + plane        (iOS / generic)
#   android-icon-background.png   512  sky gradient only             (adaptive bg)
#   android-icon-foreground.png   512  plane only, transparent       (adaptive fg)
#   android-icon-monochrome.png   432  plane silhouette, transparent (themed icons)
#   favicon.png                    48  downscale of icon
#   splash-icon.png               512  plane only, transparent
#
# Adaptive icons: Android crops the 512 canvas to a circle/squircle and only the
# centre ~66% is guaranteed visible, so the foreground plane is sized to that.
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE.parent / "assets" / "images"
TMP = HERE.parent / ".icon-build"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PEACH, MINT = (0xFF, 0xED, 0xD5), (0x6E, 0xE7, 0xB7)  # peach → mintDeep
MINT_DEEP, MINT_SHADOW = "#6EE7B7", "#4FC79D"
PEACH_DEEP, BLUE, INK = "#FED7AA", "#BAE6FD", "#2A2522"
BANDS = 16

CLOUD = f"""
<rect x="10" y="5" width="8" height="4" fill="#fff"/>
<rect x="6" y="8" width="10" height="4" fill="#fff"/>
<rect x="16" y="6" width="9" height="3" fill="#fff"/>
<rect x="4" y="11" width="28" height="4" fill="#fff"/>
<rect x="22" y="9" width="8" height="5" fill="#fff"/>
<rect x="14" y="9" width="10" height="2" fill="#fff"/>
<rect x="6" y="14" width="24" height="1" fill="{BLUE}"/>
<rect x="10" y="15" width="14" height="1" fill="{BLUE}" opacity="0.6"/>
<rect x="11" y="5" width="5" height="1" fill="#fff"/>
<rect x="4" y="11" width="28" height="1" fill="{INK}" opacity="0.12"/>
"""

PLANE = """
<rect x="8" y="4" width="4" height="6" fill="{ms}"/>
<rect x="8" y="4" width="4" height="2" fill="{md}"/>
<rect x="9" y="10" width="22" height="5" fill="#fff"/>
<rect x="31" y="10" width="5" height="5" fill="#fff"/>
<rect x="36" y="11" width="2" height="3" fill="{pd}"/>
<rect x="9" y="14" width="27" height="1" fill="{blue}"/>
<rect x="14" y="15" width="13" height="3" fill="{md}"/>
<rect x="14" y="18" width="9" height="2" fill="{ms}"/>
<rect x="16" y="7" width="9" height="3" fill="{md}"/>
<rect x="16" y="7" width="9" height="1" fill="#fff" opacity="0.5"/>
{windows}
<rect x="32" y="11" width="2" height="2" fill="#3E2E1C"/>
""".format(
    ms=MINT_SHADOW, md=MINT_DEEP, pd=PEACH_DEEP, blue=BLUE,
    windows="".join(f'<rect x="{x}" y="11" width="2" height="2" fill="{BLUE}"/>' for x in (12, 15, 18, 21, 24, 27)),
)


def lerp(a, b, t):
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def sky(size):
    out, h = [], size / BANDS
    for i in range(BANDS):
        r, g, b = lerp(PEACH, MINT, i / (BANDS - 1))
        out.append(f'<rect x="0" y="{i*h}" width="{size}" height="{h+1}" fill="rgb({r},{g},{b})"/>')
    return "".join(out)


def bbox(inner):
    xs, ys, xe, ye = [], [], [], []
    for m in re.finditer(r'x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"', inner):
        x, y, w, h = (float(v) for v in m.groups())
        xs.append(x); ys.append(y); xe.append(x + w); ye.append(y + h)
    return min(xs), min(ys), max(xe) - min(xs), max(ye) - min(ys)


def place(inner, width, x, y, opacity=1.0):
    bx, by, bw, _ = bbox(inner)
    k = width / bw
    op = f' opacity="{opacity}"' if opacity < 1 else ""
    return f'<g transform="translate({x},{y}) scale({k}) translate({-bx},{-by})"{op}>{inner}</g>'


def silhouette(inner, fill=INK):
    return re.sub(r'fill="[^"]*"', f'fill="{fill}"', re.sub(r' opacity="[^"]*"', "", inner))


def plane_with_shadow(width, canvas, cy_frac=0.52):
    """Plane centred horizontally, with the design system's 1-pixel-unit hard ink shadow."""
    _, _, bw, bh = bbox(PLANE)
    k = width / bw
    x = (canvas - width) / 2
    y = canvas * cy_frac - bh * k / 2
    return place(silhouette(PLANE), width, x + k, y + k) + place(PLANE, width, x, y)


def render(name, size, body, transparent=False):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
           f'viewBox="0 0 {size} {size}" shape-rendering="crispEdges">{body}</svg>')
    TMP.mkdir(exist_ok=True)
    html = TMP / f"{name}.html"
    html.write_text(f"<style>*{{margin:0;padding:0}}body{{width:{size}px;height:{size}px;overflow:hidden;"
                    f"background:{'transparent' if transparent else 'none'}}}</style>{svg}")
    cmd = [CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
           "--force-device-scale-factor=1", f"--window-size={size},{size}",
           f"--screenshot={OUT / name}", f"file://{html}"]
    if transparent:
        cmd.insert(2, "--default-background-color=00000000")
    subprocess.run(cmd, capture_output=True, check=True)
    print(f"  {name}  {size}x{size}")


print("rendering:")
# Full-bleed app icon — sky, two clouds, plane.
render("icon.png", 1024,
       sky(1024) + place(CLOUD, 270, 40, 150, 0.95) + place(CLOUD, 200, 730, 740, 0.8)
       + plane_with_shadow(720, 1024))

# Adaptive background: sky only (Android crops the edges).
render("android-icon-background.png", 512, sky(512))

# Adaptive foreground: plane inside the centre safe zone.
render("android-icon-foreground.png", 512, plane_with_shadow(300, 512, 0.5), transparent=True)

# Themed (monochrome) icon: flat silhouette, Android recolours it.
_MW = 280
_MH = _MW * bbox(PLANE)[3] / bbox(PLANE)[2]
render("android-icon-monochrome.png", 432,
       place(silhouette(PLANE, "#000"), _MW, (432 - _MW) / 2, (432 - _MH) / 2), transparent=True)

# Splash logo: plane alone over the native splash colour.
render("splash-icon.png", 512, plane_with_shadow(420, 512, 0.5), transparent=True)

# Favicon: downscale the full icon rather than re-render (keeps the composition).
subprocess.run(["cp", str(OUT / "icon.png"), str(OUT / "favicon.png")], check=True)
subprocess.run(["sips", "-Z", "48", str(OUT / "favicon.png")], capture_output=True, check=True)
print("  favicon.png  48x48")
