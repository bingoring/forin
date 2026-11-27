# 05 · Map & Interior Engine

The campus and the 5 department interiors share a **tile-based top-down
engine**. This doc covers the engine, the coordinate system, and the full
catalog of interior objects.

## Coordinate system

- `ITILE = 16` logical px per tile (interiors). Campus uses `TILE = 16` too.
- Interiors render at `ZOOM = 2` → **32 screen px per tile**. Implementation:
  an inner div sized `cols*16 × rows*16` is `transform: scale(2)`; all children
  position at `x*16, y*16`. (In RN: either pre-multiply coordinates by 32, or
  wrap in a scaled container — RN supports `transform:[{scale:2}]`.)
- Objects place absolutely at `left: x*ITILE, top: y*ITILE` (often with small
  negative offsets so taller objects rise above their tile).

## Interior screen shell  (`interior-shared.jsx` → InteriorScreen)

`InteriorScreen` is the reusable wrapper every department uses. Props:
`label, deptCode, deptColor, floor, cols, rows, playerStart, render, rooms,
regions, missionText, missionUrgent, topRight`.

Renders, top→bottom:
1. **TopBar** (dept code, hearts/HP on right).
2. **Mission banner** (yellow normal / red urgent) — see `02_COMPONENTS.md`.
3. **Scrollable viewport** (height ~540) containing the scaled tile world:
   - floor tiles (checkerboard of the dept's two floor tones),
   - everything from the screen's `render()` (walls, furniture, NPCs, hotspots),
   - the **player** sprite,
   - a **RoomMask** — 4 black panels that darken everything outside the player's
     current `region` bounds, so only the current room is lit (+ inner vignette).
4. **Region transition overlay** — when the player crosses into a new region, a
   0.7s dark fade shows the region name ("➜ 트라우마 룸").
5. **Region badge** (top-left of viewport) — current room name + icon.
6. **HUD** (bottom): ZONE card, 🗺 빠른이동 (fast-travel) button, D-pad, A button.
7. **BottomNav** (active campus).
8. **Fast-Travel modal** (`FastTravelModal`) — opened by 빠른이동: a full
   overlay with a 2-col grid of room cards (icon, name, sub, quest-count badge,
   HERE badge, 🔒 LOCKED). Tap a room → teleport player to its `{x,y}`.

`regions` = array of `{ id, name, icon, bounds:{x,y,w,h} }` (which room you're
in). `rooms` = fast-travel destinations `{ id, name, sub, icon, color, x, y,
questCount?, locked? }`.

### Movement
Player `pos {x,y}` in tile coords; D-pad arrows change it (clamped to bounds).
Stepping into a `region` triggers the mask/label. Stepping on a hotspot tile
opens the **Briefing** (④). In the prototype movement is button-driven; for the
product you may add tap-to-path or swipe — but keep the room-mask "one room lit"
mechanic, it's core to the feel.

## Map atoms (`interior-shared.jsx`)

| Component | Notes |
|---|---|
| `IFloor` | one floor tile; `theme` picks dept palette; checkerboards on (x+y) |
| `IWall` | wall block, `w`/`h` tiles; chunky top edge + side/shadow borders |
| `IGlass` | translucent ICU partition wall |
| `IDoor` | `kind`: `wood` / `sterile` / `auto`; auto-orients vertical if h>w; optional `label` |
| `ICurtain` | bay curtain, `color`, `w`/`h` |
| `IPlant` | potted plant decor |
| `IHotspot` | quest marker: `kind` quest(!)/urgent(!)/info(?)/police; bobbing; optional label |
| `BayLabel` | small room/zone label tag (`highlight` = yellow) |

## Furniture (`interior-shared.jsx`)

| Component | Notes |
|---|---|
| `IBed` | hospital bed. `variant`: `ward`/`or`/`peds`; `occupied` adds a sleeping patient head + blanket; `label` tag. SVG, 2×3 tiles. |
| `IReception` | desk/counter, `w`/`h`; shows monitor + clipboard + mug; `label`. |
| `IMonitor` | vitals monitor on stand; `beep` adds blinking alert. |
| `IIV` | IV pole + bag + drip + spider base. |
| `IChair` | `color`, `facing` (up/down/left/right). |
| `ICabinet` | `variant`: supply/drug/linen/chart/sterile/equipment/pharma — each renders different contents; `w`; `label`. Has 2.5D top + side faces. |

## Equipment by department

**ER** (`interior-objects-er.jsx`): `Gurney` (occupied?), `Defib`, `OxygenTank`,
`GloveDispenser`, `SharpsContainer`, `HandSanitizer`, `EKG`, `CompCart`, `Sink`,
`Whiteboard`, `Scale`, `BPCuff`, `SuctionUnit`, `Wheelchair`, `XrayMachine`.

**OR** (`interior-or.jsx`): `SurgicalLight`, `AnesthesiaMachine`,
`InstrumentTray`, `StatusBoard`, scrub `Sink`.

**ICU** (`interior-icu.jsx`): `Ventilator`, `BankOfMonitors`, `CrashCart`,
`CoffeeMachine`, `PyxisMachine`.

**Outpatient clinics** (`interior-clinics.jsx`): signature props
`UltrasoundCart` (내과), `XrayViewbox` · `CastCart` · `Crutches` · `BoneModel`
(정형외과), `DermLamp` · `LaserUnit` · `SkincareShelf` (피부과), and the shared
`ExamStool`. 외과 (Surgery) reuses OR equipment (`SurgicalLight`,
`InstrumentTray`, `IBed` or-variant).

**Pediatrics** (`interior-peds.jsx`): `PedsBed` (crib, optional `stuffie` emoji),
`Balloon`, `Mural`, `ToyChest`, `Blocks`, `SmallSlide`, `RockingHorse`, `Fridge`.

**Pharmacy** (`interior-pharma.jsx`): `PharmaCounter`, `CounterSign`, `Kiosk`,
`QueueRope`, `ShelfLabel`, `CountingBench`, `CSSafe`, `MedCart`, `LaminarHood`,
`Centrifuge`, `PrintLabel`, `WallPhone`, `FloorTape`, `Fridge`.

All are SVG primitives drawn at 45° "2.5D" (visible top + front faces). Port to
`react-native-svg` by copying the `<rect>/<path>/<ellipse>` data. They take
`{x, y}` tile coords (+ a few extras like `occupied`, `beep`, `w`, `color`).

## Campus props (`screens-explore-v2.jsx`)

`Building` (2.5D, roof+wall+door+emblem+sign). The **`arch`** prop picks the
architectural style: `'pitched'` (default — gabled roof + chimney, for small/
residential blocks like the dorm & some clinics), `'flat'` (modern concrete
block: parapet roof + rooftop HVAC units + cornice facade), `'tower'` (tall
multi-story ward: two ribbon-window rows + flat roof), `'glass'` (curtain-wall
facade: mullion grid + sky reflection). `helipad` puts a rooftop **H** pad on a
flat-roof building (used on the ER). Big hospital blocks (MAIN/ER/OR/ICU/
MATERNITY/LAB/CARDIO…) use flat/tower/glass; only the dorm and a few small
clinics stay pitched.

**Flagship landmarks** — `arch: 'landmark'` renders a dedicated landmark
component instead of `Building`, picked by the `landmark` field:
- default (`MedCenter`) — a dusk multi-tower complex: dark-glass tower + glowing
  amber glass atrium (rounded crown) + white-stone tower, lit dusk windows,
  rooftop penthouses, glass bridge, podium + lit entrance canopy. → **본관 MAIN**.
- `landmark: 'horizontal'` (`MedCenterH`) — a sleek daytime block: bold white
  horizontal sun-shade bands over dark-glass ribbon windows, rooftop signage
  parapet (logo + name band), ground-floor pilotis columns. → **외래 클리닉 OPD**.
- `landmark: 'victorian'` (`MedCenterV`) — a historic Johns-Hopkins-style hall:
  red-brick body, dark slate mansard roofs + lit dormers, corner turrets, and a
  great green copper dome on a windowed stone drum (lantern + finial). Drawn
  entirely WITHIN the footprint (no overhang) so it is safe even at the map's
  top edge. → **의과대학 (Medical School)** (top row, footprint widened to w9×h5).
- `landmark: 'curved'` (`MedCenterC`) — a Severance / Yonsei-Cancer-Center-style
  convex curved glass tower: horizontal glass bands that bow outward (center-lit,
  edge-shaded), a rounded crown, rooftop sign band, and a small white dish
  sculpture on the roof. → **암병원 (Cancer Center)** (new dept, old 재활센터 slot).

Landmark facades rise above the tile footprint for grandeur (placed where there
is clearance to the north). Reserved for marquee / high-traffic departments;
more landmark variants will be added over time from real-hospital references.
Then: `Tree`, `Bench`, `Streetlamp`,
`TrashCan`, `Mailbox`, `Hydrant`, `VendingMachine`, `PicnicTable`, `Hedge`,
`BusStop`, `Statue`, `Bush`, `Flowers`, `ParkedCar`, `Ambulance`, `Fountain`,
`BikeRack`, `Helipad`, `LilyPad`, `BBallCourt`, plus ground `Tile` types
(grass/path/plaza/road/sidewalk/garden) and the hand-painted `MAP` array.

## Department → interior mapping

| Building (campus) | Interior screen |
|---|---|
| 응급실 ER | `interior-er.jsx` ScreenInteriorER |
| 수술실 OR | `interior-or.jsx` ScreenInteriorOR |
| 소아과 PEDS | `interior-peds.jsx` ScreenInteriorPeds |
| ICU | `interior-icu.jsx` ScreenInteriorICU |
| 약국 PHARMA | `interior-pharma.jsx` ScreenInteriorPharma |
| 내과 Internal | `interior-clinics.jsx` ScreenInteriorInternal |
| 외과 Surgery | `interior-clinics.jsx` ScreenInteriorSurgery |
| 정형외과 Ortho | `interior-clinics.jsx` ScreenInteriorOrtho |
| 피부과 Derm | `interior-clinics.jsx` ScreenInteriorDerm |

## Outpatient clinic engine (`interior-clinics.jsx`)

`ClinicInterior` renders one standard outpatient floor plan from a config, so
new clinic departments are cheap to add:

```
reception + waiting (front)  →  3 exam rooms (middle)  →  procedure/treatment (back)
```

Config shape (`cfg`): `label, code, deptCode, deptColor, floor` (a dept tone in
`IP` — see below), `accent, chairColor, cabinet`, `examLabels[3]`,
`procedureLabel/Icon/Sub`, `mission/missionUrgent`, and `renderProcedure()`
(the department-specific back room — places the signature equipment + staff +
hotspot). Four configs ship: `ScreenInteriorInternal/Surgery/Ortho/Derm`.

New dept floor tones were added to `IP` (interior palette):
`floorInternal` (sage), `floorSurgery` (steel), `floorOrtho` (bone),
`floorDerm` (rose) — each with an `*Alt` checkerboard partner.

To add a department: add a floor tone pair to `IP`, write one `cfg`, and add a
campus building that enters it. Reflected in the DS catalog under
"Clinic Equipment".

Each interior file defines its own `regions`, `rooms`, and a `render()` that
places walls/doors/furniture/NPCs/hotspots, then passes everything to
`InteriorScreen`. Read those files for exact room layouts and object placements.

## RN porting strategy for the map

1. Build the tile renderer: a sized container, render the floor as a grid (or a
   single pre-baked image per dept for perf), then absolutely-positioned object
   components.
2. Port each object as an `react-native-svg` component taking `{x,y}` →
   `left:x*32, top:y*32` (pre-multiplied for ZOOM 2) inside the container.
3. Camera = a `ScrollView`/`Animated` translate that centers on player; or use a
   gesture-driven pan. Keep the room-mask overlay.
4. Consider performance: at 26×60 tiles, render only visible tiles or bake the
   floor to an image; keep objects as components (there aren't that many per room).
