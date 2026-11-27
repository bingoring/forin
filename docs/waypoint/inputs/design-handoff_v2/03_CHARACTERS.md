# 03 · Character & Face System

forin has a unified character system. There are **two render scales**:

1. **Sprites** — full-body figures placed on the map / in interiors (small,
   ~40–52px tall). Source of the MAIN style: `reference/forin-npcs-smooth.jsx`.
2. **Faces** — head-and-shoulders portraits for visual-novel dialogue & briefing
   (large, ~80px). Source: `reference/forin-faces.jsx`.

There is also a **legacy pixel style** (`reference/chibi-npcs.jsx`) — the app
originally used hard-pixel sprites. **These were replaced by the "smooth/derp"
style and are kept only as design-system reference. Do NOT use pixel characters
in the product** — use the Derp smooth style everywhere.

All characters share one identity vocabulary so a given NPC looks consistent
across map sprite and dialogue face.

## The MAIN style: "Derp" (소박한/하찮은) smooth vectors

Soft rounded vector art (not pixel), with a deliberately **goofy, vacant
expression** — small dot eyes, blank/wobbly mouth — which the team chose as the
brand's charm. Proportions are **top-heavy "가분수" chibi**: a big round head
over a small body and short legs.

`SmoothSprite` is the base. ViewBox `64 × 80`, head fills upper ~55%.
Outline color is a soft dark brown **`#3A2E26`** (NOT pure black — softer than
the UI ink).

### SmoothSprite props
```
hair         hex (see palette below)
hairStyle    'short'|'bob'|'long'|'pigtails'|'bun'|'curly'|'bald'|'mohawk'|'cap'|'peakedCap'
skin         hex (5-tone palette)
shirt, shirtDk, leg, shoe   hex
hatTone, hatTrim            hex (when hairStyle is cap/peakedCap)
chestCross   bool (red cross — the player's nurse mark)
chestMark    extra SVG node on chest
expression   one of the 12 expressions (see below)
width        px (height auto = width * 80/64)
tag          small label above head (e.g. 'YOU')
bob          bool — idle bob animation
```

### Hair color palette (13) — deterministic auto-pick pool
`#1F2937 #3C2A18 #5C3A1A #7C3F00 #9A6B3F #C28E5C #E2B16B #FACC15 #EF4444
#B45309 #D1D5DB #A78BFA #22D3EE` (black → browns → blondes → ginger → auburn →
silver → dyed purple/cyan).

### Skin tones (5)
`#FCE5C8 #F8D7B2 #E9BE93 #C99066 #9A6B45`.

### Deterministic variation
Each NPC's hair/skin/style/outfit is chosen by hashing its `(x, y)` map
position with a per-role salt, so the **same tile always renders the same
person** across reloads. Port the hash:
```
hash(x,y,salt) = abs( (x*73856093) ^ (y*19349663) ^ (salt*83492791) )
pick(arr,h)    = arr[h % arr.length]
```
Role salts: nurse 1, doctor 2, surgeon 3, paramedic 4, police 5, patient 6,
child 7, parent 8, visitor 9, pharmacist 10.

## Roles (10 + player)

Each role is a preset over SmoothSprite. Identity summary:

| Role | Hat / hair | Shirt | Notes |
|---|---|---|---|
| **Player** | white nurse `cap`, red trim | mint `#A7F3D0` | red chest cross, tag "YOU" |
| Nurse | white `cap`, red trim | mint (overridable) | small red cross chest mark |
| Doctor | hair (short/bob/curly) | white, gray shadow | stethoscope chest mark |
| Surgeon | blue `cap` `#A8DCEC` | blue scrubs | **surgical mask** over face |
| Paramedic | navy `peakedCap`, yellow badge | yellow `#FACC15` | — |
| Police | navy `peakedCap`, yellow badge | navy `#1E3A8A` | yellow badge chest |
| Patient | varied hair (incl. bald) | peach gown `#FED7AA` | — |
| Child | varied (pigtails/mohawk…) | bright random | smaller size (−6px) |
| Parent | bob/long/bun… | random soft | — |
| Visitor | varied | random | — |
| Pharmacist | short/bob/bun/curly | white coat | green Rx chest mark |

Preset component names (port these): `DerpPlayer`, `DerpNurse`, `DerpDoctor`,
`DerpSurgeon`, `DerpParamedic`, `DerpPolice`, `DerpPatient`, `DerpChild`,
`DerpParent`, `DerpVisitor`, `DerpPharmacist`. (The file also exports
"Smooth*" = same but cheerful smile; the **Derp** set is the chosen main look.)

### SmoothNpc placement wrapper
`SmoothNpc({ x, y, kind, hair?, shirt?, size? })` — positions a role sprite on
the tile grid at `left: x*ITILE - 12, top: y*ITILE - 30`. `kind` is the role
name lowercase. In the interiors, NPCs are placed with this.

## Hairstyle notes
8 hair styles + 2 hats. Hats (`cap` = surgical/nurse dome, `peakedCap` =
police/paramedic peaked cap) are drawn as a **solid filled dome** whose brim
sits **just above the eyes (~y21 of the head, eyes at ~y27)** — fully covering
the scalp with no gap, without covering the eyes. Get this right when porting:
the dome is one filled `<path>`, not a hollow crescent.

## The 12 expressions (faces AND smooth sprites)

`expression` prop. Each combines eyes / brows / mouth / extra marks:

| id | ko | Visual |
|---|---|---|
| `neutral` | 평온 | dot eyes, flat mouth |
| `happy` | 기쁨 | ^^ closed eyes, big smile |
| `sad` | 슬픔 | raised-inner brows, frown, **tear** |
| `worried` | 걱정 | raised-inner brows, wavy mouth |
| `pain` | 통증 | squinted >< eyes, gritted teeth, **sweat** |
| `surprised` | 놀람 | wide eyes, raised brows, "O" mouth |
| `angry` | 분노 | angled brows, grit, **anger vein mark** |
| `thinking` | 생각 | look-up eyes, **"?" bubble** |
| `sleepy` | 졸림 | half-lid eyes, yawn, **zzz** |
| `panic` | 당황 | wide eyes, "O" mouth, **big sweat drop** |
| `focused` | 집중 | narrow eyes, straight low brows, tight mouth |
| `shy` | 수줍음 | look-down eyes, small smile, **heavy blush** |

For the Derp sprites the eyes stay the small dot/derp base, but mouth + marks
follow the expression. For Faces (`forin-faces.jsx`) the eyes are fully drawn
per-expression at higher detail.

## Face portraits (`forin-faces.jsx`)
`Face` base + role presets `FacePlayer/FaceNurse/FaceDoctor/FaceSurgeon/…`.
ViewBox `16 × 18` (then scaled by `size`, default 80). Same hair/skin/cap
vocabulary as sprites. Surgeon face includes the mask. Used in **Dialogue** and
**Briefing** screens — the speaker's portrait reflects the current emotion via
`expression`.

> **NOTE on current product portraits:** the app screens (dialogue, briefing,
> quizzes) were migrated to use the **Derp smooth** look for portraits too. When
> porting, use the smooth/derp face style consistently. Keep the `expression`
> driven by the line of dialogue (e.g. patient in pain → `pain`).

## RN porting
All of the above is `react-native-svg`. Build one `<Sprite>` and one `<Face>`
component taking the prop set above; implement the role presets as thin
wrappers. The hair/expression "plates" are just groups of `<Path>`/`<Rect>`/
`<Ellipse>` — copy the path data from the reference JSX. Memoize the
deterministic pick so re-renders don't reshuffle.
