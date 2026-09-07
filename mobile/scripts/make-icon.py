from PIL import Image, ImageDraw, ImageFont
import math

FONTS = "assets/fonts"
GAEGU = f"{FONTS}/Gaegu-Regular.ttf"
MONO  = f"{FONTS}/IBMPlexMono-SemiBold.ttf"
GREEN = (46, 70, 54, 255)       # #2E4636
GOLD  = (212, 180, 106, 255)    # #D4B46A
def gold(a): return (212, 180, 106, int(a*255))

S = 2  # supersample
N = 1024 * S

def vignette(img):
    # radial: transparent to 28% black from 55%→100% of r=.75*N, centre (.5,.42)
    px = img.load()
    cx, cy = 0.5*N, 0.42*N
    R = 0.75*N
    inner = 0.55*R
    for y in range(N):
        for x in range(N):
            d = math.hypot(x-cx, y-cy)
            if d <= inner: continue
            t = min(1.0, (d-inner)/(R-inner))
            a = int(0.28*255*t)
            if a<=0: continue
            r,g,b,al = px[x,y]
            # composite black over
            f = a/255
            px[x,y] = (int(r*(1-f)), int(g*(1-f)), int(b*(1-f)), 255)

def draw_f(d, cx, cyBase, size):
    fnt = ImageFont.truetype(GAEGU, int(size))
    d.text((cx, cyBase), "f", font=fnt, fill=GOLD, anchor="ms")

def draw_forin(d, cx, yBase, size, tracking, fill=GOLD):
    fnt = ImageFont.truetype(MONO, int(size))
    letters = "FORIN"
    widths = [d.textlength(c, font=fnt) for c in letters]
    total = sum(widths) + tracking*(len(letters)-1)
    x = cx - total/2
    for c,w in zip(letters, widths):
        d.text((x, yBase), c, font=fnt, fill=fill, anchor="ls")
        x += w + tracking

def rings(d, cx, cy, rOuter, swOuter, rInner, swInner, outer=GOLD, inner=None):
    d.ellipse([cx-rOuter, cy-rOuter, cx+rOuter, cy+rOuter], outline=outer, width=int(swOuter))
    if inner is None: inner = gold(0.55)
    d.ellipse([cx-rInner, cy-rInner, cx+rInner, cy+rInner], outline=inner, width=int(swInner))

def base(bg=GREEN, vig=True):
    img = Image.new("RGBA", (N,N), bg)
    if vig: vignette(img)
    return img

# ── iOS full: passport cover (frame + rings + f + FORIN) ──
def ios_icon():
    img = base()
    d = ImageDraw.Draw(img)
    d.rectangle([118*S,100*S,(118+788)*S,(100+824)*S], outline=gold(0.85), width=14*S)
    d.rectangle([140*S,122*S,(140+744)*S,(122+780)*S], outline=gold(0.40), width=5*S)
    rings(d, 512*S, 462*S, 200*S, 19*S, 163*S, 9*S)
    draw_f(d, 512*S, 564*S, 330*S)
    draw_forin(d, 512*S, 812*S, 70*S, 34*S)
    return img.resize((1024,1024), Image.LANCZOS)

# ── Android adaptive foreground: the f-emblem, centred in the safe zone ──
# rings r200 → outer diameter 400; centre it at (512,512) so it sits inside the
# 66% safe circle (~676). f baseline offset kept the same as the full icon.
def android_fg(mono=False):
    img = Image.new("RGBA", (N,N), (0,0,0,0))
    d = ImageDraw.Draw(img)
    cx, cy = 512*S, 512*S
    fill = (255,255,255,255) if mono else GOLD
    innerRing = (255,255,255,140) if mono else gold(0.55)
    rings(d, cx, cy, 200*S, 19*S, 163*S, 9*S, outer=fill, inner=innerRing)
    # f: baseline sits ~102 below ring centre (same ratio as full icon: 564-462=102)
    fnt = ImageFont.truetype(GAEGU, int(330*S))
    d.text((cx, cy+102*S), "f", font=fnt, fill=fill, anchor="ms")
    return img.resize((1024,1024), Image.LANCZOS)

def android_bg():
    return base().resize((1024,1024), Image.LANCZOS)

out = "assets/images"
ios_icon().save(f"{out}/icon.png")
android_fg(False).save(f"{out}/android-icon-foreground.png")
android_bg().save(f"{out}/android-icon-background.png")
android_fg(True).save(f"{out}/android-icon-monochrome.png")
print("wrote icons")

# ── splash-icon + favicon + flatten (opaque) — see git history for rationale ──
def _finish():
    from PIL import Image as I, ImageDraw as D, ImageFont as F
    # flatten iOS icon + android background to opaque (Apple rejects an alpha channel)
    for f in ["assets/images/icon.png", "assets/images/android-icon-background.png"]:
        im = I.open(f).convert("RGBA"); bg = I.new("RGB", im.size, (46,70,54)); bg.paste(im,(0,0),im); bg.save(f)
    # splash-icon: gold emblem filling ~76% of a transparent canvas
    img = I.new("RGBA",(N,N),(0,0,0,0)); d = D.Draw(img); cx=cy=512*S; k=1.95
    d.ellipse([cx-200*S*k,cy-200*S*k,cx+200*S*k,cy+200*S*k], outline=GOLD, width=int(19*S*k))
    d.ellipse([cx-163*S*k,cy-163*S*k,cx+163*S*k,cy+163*S*k], outline=gold(0.55), width=int(9*S*k))
    d.text((cx, cy+int(102*S*k)), "f", font=F.truetype(GAEGU,int(330*S*k)), fill=GOLD, anchor="ms")
    img.resize((1024,1024), I.LANCZOS).save("assets/images/splash-icon.png")
    # favicon: the full icon at 256, opaque
    I.open("assets/images/icon.png").convert("RGB").resize((256,256), I.LANCZOS).save("assets/images/favicon.png")
_finish()
print("finished splash + favicon + flatten")
