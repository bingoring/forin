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
| `IReception` | plain **white** clinical **desk** (`Forin.Desk`) — doctor-facing prescribing desk; `w`/`h`; shows monitor + chart + mug. NOT a reception counter — the real reception desk is Clinic's `ClinicReception`. |
| `NurseDeskI` | straight **I-bar** white nurse/charting station — back monitor wall + keyboards + end drawer pedestals. Common hub furniture. `w`/`h`. |
| `NurseStationDesk` | large **ㄷ/U** white open nursing station (monitor wall, quartz top, drawer pedestals, label printer). Common hub furniture. `w`/`h`. |
| `IMonitor` | vitals monitor on stand; `beep` adds blinking alert. |
| `IIV` | IV pole + bag + drip + spider base. |
| `IChair` | `color`, `facing` (up/down/left/right). |
| `ICabinet` | `variant`: supply/drug/linen/chart/sterile/equipment/pharma — each renders different contents; `w`; `label`. Has 2.5D top + side faces. |

## Equipment by department

**ER** (`interior-objects-er.jsx`): `Gurney` (occupied?), `Defib`, `OxygenTank`,
`GloveDispenser`, `SharpsContainer`, `HandSanitizer`, `EKG`, `CompCart`, `Sink`,
`Whiteboard`, `Scale`, `BPCuff`, `SuctionUnit`, `Wheelchair`, `XrayMachine`.

**ER triage/station/critical** (`interior-objects-er2.jsx`): `TicketDispenser`,
`BrochureRack`, `DeskPhone`, `VitalsCart`, `WaitingDisplay`, `WaterCooler`,
`ChartBinder`, `IVPump`, `WasteBin` (`tone` general/infectious), `PressureGauge`,
`PPEStand`, `Otoscope`, `AnatomyPoster`, `DressingCart`, `TriageLine` (R/Y/G).

**ER blueprint additions** (`interior-objects-er3.jsx`): `IThreshold` (dark
open-doorway primitive used instead of door leaves between internal zones),
`SecurityScanner` (X-ray bag belt), `MetalDetector` (walk-through gate),
`BarcodePrinter`, `WallTV`, `MedFridge` (glass-door med/vaccine fridge),
`BoltedBed` (floor-bolted psych mattress), `CCTVCamera` (covered, REC LED),
`Sofa` (`w`/`color`), `CoffeeTable`, `TissueBox`, `FloorLamp`, `FramedPicture`
(landscape), `DeconShower`, `FloorDrain`, `ChemDrum` (`tone` chem/waste),
`NurseStationDesk` (large ㄷ/U open nursing station — birch body, raised quartz
ledge, drawer pedestals, back monitor wall + keyboards, side label-printer /
baskets / pen caddy; `w`/`h`).

**OR** (`interior-or.jsx`): `SurgicalLight`, `AnesthesiaMachine`,
`InstrumentTray`, `StatusBoard`, scrub `Sink`.

**OR blueprint additions** (`interior-objects-or2.jsx`): `BairHugger` (forced-air
warmer), `Bovie` (electrosurgical unit), `KickBucket`, `TimeoutBoard`,
`RoboticConsole`, `LapTower` (laparoscopic monitor/light/insufflator tower),
`CO2Insufflator`, `ScrubDispenser` (chlorhexidine/betadine + brush/towel),
`ScrubTimer` (5-min wall countdown), `ConsentClipboard`, `SoiledCart`,
`ORBoomMonitor` (ceiling-boom surgical display), `CArm` (mobile fluoroscopy).

**ICU** (`interior-icu.jsx`): `Ventilator`, `BankOfMonitors`, `CrashCart`,
`CoffeeMachine`, `PyxisMachine`.

**ICU blueprint additions** (`interior-objects-icu2.jsx`): `CRRTMachine`
(continuous renal replacement + 4 dialysate bags), `IVPumpTower` (6-stack
infusion pumps), `EVDStand` (external ventricular drain w/ leveling ruler),
`ICPMonitor`, `TTMUnit` (targeted-temperature cooling), `FoleyBag`, `Intercom`
(door buzzer + camera), `GownBox`, `VisitorScreen` (visiting-status display).

**Outpatient clinics** (`interior-clinics.jsx`): signature props
`UltrasoundCart` (내과), `XrayViewbox` · `CastCart` · `Crutches` · `BoneModel`
(정형외과), `DermLamp` · `LaserUnit` · `SkincareShelf` (피부과), and the shared
`ExamStool`. 외과 (Surgery) reuses OR equipment (`SurgicalLight`,
`InstrumentTray`, `IBed` or-variant).

**Pediatrics** (`interior-peds.jsx`): `PedsBed` (crib, optional `stuffie` emoji),
`Balloon`, `Mural`, `ToyChest`, `Blocks`, `SmallSlide`, `RockingHorse`, `Fridge`.

**Pediatrics blueprint additions** (`interior-objects-peds2.jsx`): `Incubator`
(isolette w/ temp+humidity), `PhototherapyLamp` (blue jaundice light),
`MetalCrib` (steel barred fall-prevention crib), `IVBoard` (character hand
splint), `BabyScale` (basket infant scale), `StadiometerScale` (character
height/weight), `TongueDepressorJar`, `StickerRoll`, `DosingChart`
(weight-based), `MilkFridge` (labeled breast-milk bottles).

**Pharmacy** (`interior-pharma.jsx`): `PharmaCounter`, `CounterSign`, `Kiosk`,
`QueueRope`, `ShelfLabel`, `CountingBench`, `CSSafe`, `MedCart`, `LaminarHood`,
`Centrifuge`, `PrintLabel`, `WallPhone`, `FloorTape`, `Fridge`.

**Internal Medicine WARD** (`interior-objects-ward2.jsx`): `O2Flowmeter`
(+nasal cannula), `Nebulizer`, `AirMattress` (pressure-relief pump),
`FallRiskSign`, `NPOBoard`, `IsolationCart` (yellow gowns/gloves), `LinenHamper`
(`tone` soiled/clean), `SluiceSink`, `SupplyBasketShelf`, `IVStorageCart`,
`Handrail` (`w`, `vertical`); plus in-file `MealCart`, `SharpsBin`, `IsoSign`,
`DedicatedBP`.

**Pharmacy blueprint additions** (`interior-objects-pharma2.jsx`): `PneumaticTube`
(기송관 send/receive), `TubeCapsuleRack`, `ReturnBox`, `BarcodeScanner`,
`ATCMachine` (auto tablet dispenser), `LASAShelf` (high-alert look-alike shelf),
`NarcoticsVault` (double-lock fingerprint safe), `BSC` (biological safety
cabinet), `MagnehelicGauge` (pressure-differential dial), `ChemoSpillKit`,
`TackyMat`, `MedWallShelf` (white floor-to-ceiling shelving packed with
bottles/boxes — `w`, `shelves`).

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

**Campus layout (rebuilt).** First entry now shows **FIVE pavilions**, all in the
new landmark architecture; the nine departments built so far (ER/OR/ICU/Pharmacy
+ 내·외·정형·피부) live INSIDE the Main Medical Tower, and the other pavilions
group the remaining services (detailed later):
- **본관 · 메인 메디컬 타워** (`MedCenter`, center, w9×h8) — ER · OR · ICU · Pharmacy · 내과/외과/정형외과/피부과. Rooftop `Helipad`.
- **암센터 · 재활관** (`MedCenterC` curved, left) — 종양(BMT) · 정신과 폐쇄 · 재활 · 호스피스 · 노인 · PT/OT.
- **여성소아 센터** (`MedCenterV`, right) — 산부인과(외래/분만/산후) · 신생아실 · NICU · PICU.
- **외래 · 진단 지원동** (`MedCenterH` horizontal monolith, lower-left) — 외래(안과·이비인후과 등) · 당일수술 · 내시경 · 인공신장 · 영상의학 · 진단검사.
- **행정 · 지원동** (`Building` arch `flat`, concrete/brick, lower-right) — SPD · 영양/배식 · 간호부 · 락커/휴게 · 시뮬랩 · 영안실(B1).

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
| 일반 내과 병동 WARD | `interior-ward.jsx` ScreenInteriorWard (inpatient — distinct from 내과 외래) |
| 일반 외과 병동 SURG WARD | `interior-surgward.jsx` ScreenInteriorSurgWard (inpatient perioperative — distinct from 외과 외래) |
| 정형외과 병동 ORTHO WARD | `interior-orthoward.jsx` ScreenInteriorOrthoWard (inpatient mobility care — distinct from 정형외과 외래) |
| 피부과 센터 DERM CENTER | `interior-dermcenter.jsx` ScreenInteriorDermCenter (full outpatient center — distinct from the lightweight 피부과 외래 ScreenInteriorDerm) |
| 내과 Internal | `interior-clinics.jsx` ScreenInteriorInternal |
| 외과 Surgery | `interior-clinics.jsx` ScreenInteriorSurgery |
| 정형외과 Ortho | `interior-clinics.jsx` ScreenInteriorOrtho |
| 피부과 Derm | `interior-clinics.jsx` ScreenInteriorDerm |

## ER interior — Emergency Medical Center (`interior-er.jsx`)

`ScreenInteriorER` was rebuilt to a 40×60-tile master blueprint with much larger
zones (the big Derp characters needed room). Layout: a full-width **공공 로비**
across the top (앰뷸런스 인계 · 보안검색 게이트 + X-ray 검색대 · 원무과 · KTAS 트리아지 ·
대기), then a 3-column grid of generous rooms — **소생실 / 중앙 너스 스테이션(+약품실
Pyxis) / 제1진료실(내과)**, then **음압 격리실(전실+본실) / 소처치·봉합실 / 제2진료실(외상/
정형)**, then **정신과 안전 격리실 / 가족 상담·임종실 / 제염실(외부 연결)**.

**Doors between internal zones use `IThreshold`, not `IDoor`** — a dark open
doorway (no leaf) that reads clearly as "passage to a different zone". Only the
true exterior openings (앰뷸런스, 정문, 캠퍼스 출구, 제염 외부) use the auto `IDoor`.
Special rooms get a translucent floor `Tint` (psych = padded blue, quiet = warm,
decon = wet tile). Region bounds overlap the dividing walls so the player always
resolves to a region for the RoomMask.

## OR interior — Operating Suite & PACU (`interior-or.jsx`)

`ScreenInteriorOR` was rebuilt to a 40×52-tile master blueprint with strict
**3-stage zoning** (오염↔청정 동선 분리): **비제한**(보호자 대기실 · 탈의실/락커룸)
across the top, **준제한**(Pre-Op Holding · Clean/Dirty Utility · PACU 회복실)
in the middle, **제한·양압**(제1수술실 General/Ortho · 스크럽 · 제2수술실 Lap/Robotic)
across the bottom. Restricted (OR) entries use a blue **sterile** `IThreshold`
(`tone="sterile"`, gowning required); other internal passages use the plain dark
`IThreshold`. OR floors get a faint green `Tint`. OR1 carries the general/ortho
team (surgeon/assist/scrub/circulating/anesthesiologist) around a draped table
with twin `SurgicalLight`s, `AnesthesiaMachine`, `InstrumentTray`, `Bovie`,
`KickBucket`, `ORBoomMonitor`, `TimeoutBoard`; OR2 is the lap/robotic room with
`RoboticConsole`, `LapTower`, `CO2Insufflator`. PACU has 4 open beds + a nurse
desk (`BankOfMonitors`, `CrashCart`); Pre-Op has 3 curtained beds with
`BairHugger` + `ConsentClipboard`; the scrub corridor sits between the two ORs
with `SinkOR` + `ScrubDispenser` + `ScrubTimer`.

## ICU interior — Intensive Care Unit (`interior-icu.jsx`)

`ScreenInteriorICU` was rebuilt to a 34×44-tile blueprint of **glass-walled
private rooms** for radial monitoring. Four 1인실 across the top — **A pod**
(Room 1 인공호흡+다약물: `Ventilator`/`IVPumpTower`/`FoleyBag`, Room 2 CRRT
투석: `CRRTMachine`) and **B pod** (Room 3 뇌압/EVD: `EVDStand`/`ICPMonitor`,
Room 4 TTM 저체온: `TTMUnit`) — each sealed by `IGlass` walls + a sliding auto
door. The middle is a fortress-like **central hub** (`BankOfMonitors` telemetry
wall, twin order desks, center code-blue `CrashCart`, charge nurse + intensivist
+ RT). Bottom support rooms: **면회 대기실** (`Intercom` + `GownBox` +
`VisitorScreen` at the controlled entrance), **Dirty Utility** (clinical sink +
infectious waste + `SoiledCart`), **Med·장비** (`PyxisMachine` + cabinets). A
faint dark `Tint` over the rooms gives the calmer, dimmed ICU lighting.

## Pediatrics interior — Pediatrics & Neonatal Center (`interior-peds.jsx`)

`ScreenInteriorPeds` was rebuilt to a 34×48-tile blueprint: colorful & friendly
up front, clinically precise inside. Top **외래 대기·놀이·계측** (real reception
`ClinicReception`, `BabyScale`/`StadiometerScale` growth station, play area with
slide/blocks/rocking-horse/mural/balloons); **소아 진료실** (exam bed, growth-curve
PC, `TongueDepressorJar`, `StickerRoll`); **소아 병동** (a `NurseDeskI` micro-
dosing station with `DosingChart`, a 4-bed room mixing `MetalCrib` fall-prevention
cribs + ward beds, `IVPump`/`IVBoard` per bed); innermost **NICU** behind a
gowning anteroom (`SinkOR` + `ScrubDispenser` + `GownBox`, sterile scrub
threshold) into an incubator zone (`Incubator` ×3 under `PhototherapyLamp`s,
neo `IMonitor`s, `MilkFridge`) with a faint dark `Tint` for the low-light NICU.

## Pharmacy interior — Central Pharmacy (`interior-pharma.jsx`)

`ScreenInteriorPharma` was rebuilt to a 36×42-tile blueprint with security
zoning. A top **수령 창구 · 기송관 허브** (glass pick-up window + `PharmaCounter` +
`BarcodeScanner` + `ReturnBox`, and a `PneumaticTube` station with
`TubeCapsuleRack`); a **일반 약품 조제실** (staff-only threshold) holding the
`ATCMachine`, `LASAShelf` high-alert shelf, a double-check verify desk, drug
shelves, and a walled **NarcoticsVault** alcove (fingerprint + lock + log); and
a **무균 조제실** entered through a gowning anteroom (`SinkOR` + `GownBox` +
`ScrubDispenser` + `TackyMat`) and a sterile air-shower threshold into the
cleanroom (`BSC` ×2, `MagnehelicGauge`, `ChemoSpillKit`, `Centrifuge`,
`PrintLabel`, ringing `WallPhone`, `FloorTape`).

## Ward interior — 일반 내과 병동 (`interior-ward.jsx`)

`ScreenInteriorWard` is the **inpatient** internal-medicine ward (6F 일반 병동) —
distinct from the outpatient 내과 clinic (`ScreenInteriorInternal`). A 28×52-tile
vertical-flow plan on the sage `internal` floor: a top **service strip** (린넨·
배식실 with `MealCart` · Clean Utility with `SupplyBasketShelf`/`IVStorageCart`/
label desk · Dirty Utility with `SluiceSink`/`SharpsBin`/`LinenHamper`); a
**central nursing station** (big ㄷ `NurseStationDesk`, `PneumaticTube` inbox,
two parked `VitalsCart`s, corridor `Handrail`s, charge nurse on a critical-value
call + resident giving a verbal order); a **4-bed chronic-care room** split by
curtains (Bed A COPD with `O2Flowmeter`+`Nebulizer`, Bed B diabetic/pressure-
ulcer with `AirMattress`+`FallRiskSign`+BST quest, Bed C cirrhosis, Bed D post-
endoscopy `NPOBoard`); and a lower row with a **1인실** and a **VRE 접촉 격리실**
(`IsoSign` on the door, `IsolationCart` + gowning student nurse outside,
dedicated `DedicatedBP` + isolation waste inside). DS catalog:
`ScreenDSEquipmentWard` (Ward Equipment).

## Surgery-ward interior — 일반 외과 병동 (`interior-surgward.jsx`)

`ScreenInteriorSurgWard` is the **inpatient** general-surgery ward (7F) on the
cool-steel `surgery` floor — distinct from the outpatient 외과 clinic
(`ScreenInteriorSurgery`). Same 28×52 vertical-flow structure as the medical
ward, retuned for perioperative care: a top **린넨·배식** strip beside a **중앙
처치실·드레싱룸** (treatment bed under a `SurgicalLight`, `DressingCart` +
`InstrumentTray` + `StapleRemover`, sterile threshold); a **central station +
ambulation corridor** (big `NurseStationDesk`, `OPScheduleBoard`, `WalkerRack`,
`Handrail`s, a post-op patient walking with a guardian, charge nurse on the OR
hand-off call); a **4-bed post-op room** (Bed A op-day `PCAPump`+`NPOBoard`+deep-
breathing quest, Bed B `JPDrain` management, Bed C flatus-confirmed happy patient,
Bed D discharge-waiting); and a **1-bed major-resection room** (`NGSuction` Levin
tube, twin `Hemovac` drains, `SCDDevice` DVT prophylaxis, `PCAPump`, drain-patency
quest). New objects: `interior-objects-surg2.jsx` (`PCAPump`, `JPDrain`, `Hemovac`,
`NGSuction`, `SCDDevice`, `Walker`, `WalkerRack`, `OPScheduleBoard`,
`StapleRemover`, `AbdoBinder`). DS catalog: `ScreenDSEquipmentSurgWard` (Surgery
Ward Equipment).

## Ortho-ward interior — 정형외과 병동 (`interior-orthoward.jsx`)

`ScreenInteriorOrthoWard` is the **inpatient** orthopedics ward (8F) on the warm-
bone `ortho` floor — distinct from the outpatient 정형외과 clinic
(`ScreenInteriorOrtho`). 28×52 vertical-flow with wide open bays for beds + DME:
a top **PT 연계 통로** (handrail, `WalkerRack`, `Wheelchair`) beside a **석고실·
소처치실** (procedure bed, `PlasterTrapSink`, `CastRollShelf`, `CastCutter`,
`DressingCart`); a **central station + DME bay** (ㄷ `NurseStationDesk`,
`PACSViewer` bone X-ray, `CMSChart`, `BraceRack` + `Walker`); a **4-bed
fracture/traction room** (Bed A `TractionFrame`, Bed B post-TKA `CPMMachine`,
Bed C compartment-syndrome CMS urgent quest, Bed D cast); and a **1-bed
geriatric hip-fracture room** (`AbductionPillow` dislocation precautions,
`BedAlarm` mat, `ElevatedToiletGuard`). New objects:
`interior-objects-ortho2.jsx` (`TractionFrame`, `CPMMachine`, `PlasterTrapSink`,
`CastCutter`, `CastRollShelf`, `BraceRack`, `AbductionPillow`,
`ElevatedToiletGuard`, `BedAlarm`, `PACSViewer`). DS catalog:
`ScreenDSEquipmentOrthoWard` (Ortho Ward Equipment).

## Dermatology-center interior — 피부과 센터 (`interior-dermcenter.jsx`)

`ScreenInteriorDermCenter` is the **full** dermatology clinic & center (2F) on
the soft-rose `derm` floor — distinct from the lightweight clinic-engine screen
(`ScreenInteriorDerm`). 28×52 vertical-flow, privacy-focused, bright white tone:
a top **로비·접수·대기** (`ClinicReception`, `LesionChart` wall, 1-seat sofa
lounge, itchy atopic/masked patients); twin **진료실** (Bed + `Dermatoscope` +
`WoodsLamp` + `LesionChart`/`SkinAnatomy`, mole ABCD quest); a **광선 치료실**
(`UVBooth` whole-body 311nm capsule, `HandUVBox`, `GoggleSanitizer`, dose console,
goggled patient); and a sterile **소수술·레이저 처치실** (adjustable surgical
chair under a `SurgicalLight`, `BiopsyKit` + `BiopsyBottle` punch-biopsy, `CryoTank`
liquid-N₂, `CO2Laser`, `DressingCart`). New objects: `interior-objects-derm2.jsx`
(`Dermatoscope`, `WoodsLamp`, `UVBooth`, `HandUVBox`, `GoggleSanitizer`,
`BiopsyKit`, `BiopsyBottle`, `CryoTank`, `CO2Laser`, `LesionChart`). DS catalog:
`ScreenDSEquipmentDerm` (Dermatology Equipment).

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
