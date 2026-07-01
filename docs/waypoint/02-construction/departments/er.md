---
build-spec: departments/er
stage: 02-construction / 05-map-engine (5g-a)
status: IMPLEMENTED
depth: compressed          # 콘텐츠 시리즈 압축형 — 네 아티팩트를 맵 도메인 섹션으로
updated: 2026-07-01
---

# Build Spec — 5g-a · ER 응급의료센터

| | |
|---|---|
| interior id | `INT-ER-00001` (deptId `DEPT-ER-00001`) |
| fixture | `mobile/src/map/fixtures/er.ts` (`ER_INTERIOR`) |
| SoT(핸드오프) | `inputs/design-handoff_v10/reference/interior-er.jsx` (레이아웃) + `interior-objects-er{,2,3}.jsx`·`interior-shared.jsx` (오브젝트) |
| 그리드 | 40 cols × 60 rows · floorTheme `clinical` · scale **0.85** |
| playerStart | `{19,28}` (중앙 너스 스테이션 well) · 엘리베이터 진입 시 `?ex&ey` 오버라이드 |

> **이 문서가 부서 Build Spec의 기준선.** [Build Spec 4 아티팩트](../../../../_templates/build-spec/)를 맵 도메인으로
> 압축: **A** domain-entities · **B** business-rules · **C** business-logic-model · **D** frontend-components + 인덱스(개요·검증·편차).
> 다른 부서 문서는 이 구조·밀도를 따른다.

## 개요 & 범위 (Index)

```
┌─────────────── 공공 로비 (y0-15) ───────────────┐
│  앰뷸런스 인계 · 보안검색 · 원무과 · KTAS 트리아지 · 대기  │  ← 상단 전폭
├──────────┬──────────────┬──────────────────────┤  y16 divider
│ 소생실    │ 중앙 너스      │ 제1진료실(내과)          │  밴드1 y16-32
│ (Resus)  │ 스테이션+약품실 │                        │
├──────────┼──────────────┼──────────────────────┤  y33 divider
│ 음압격리  │ 소처치·봉합실   │ 제2진료실(외상/정형)      │  밴드2 y33-48
├──────────┼──────────────┼──────────────────────┤  y49 divider
│ 정신과    │ 가족상담·임종실  │ 제염실 (외부 연결)        │  밴드3 y49-59
└──────────┴──────────────┴──────────────────────┘
   x0-13(좌열)   x13-26(중열)      x26-40(우열)
```
- **구획 원칙**: 내부 존 경계 = **`threshold`**(검은 열린 통로), 외부만 auto `door`. 컬럼 분리 = 세로 divider `x13`/`x26`.
- 특수실 `tint`: 정신(파랑) · 임종(웜) · 제염(wet). SoT를 1:1 유도(편차는 인덱스 §편차).

---

## A. Domain & Entities

### A.1 regions[] (bounds가 divider와 1칸 겹침 — 항상 region 판정)
| id | name | icon | bounds(x,y,w,h) |
|---|---|---|---|
| lobby | 공공 로비·접수·트리아지 | 🚑 | 0,0,40,17 |
| resus | 응급 소생실 | 🚨 | 0,16,14,18 |
| nurse | 중앙 너스 스테이션·약품실 | 🩺 | 13,16,14,18 |
| exam1 | 제1진료실·내과 | 🩺 | 26,16,14,18 |
| iso | 음압 격리실 | 😷 | 0,33,14,17 |
| suture | 소처치·봉합실 | 🩹 | 13,33,14,17 |
| exam2 | 제2진료실·외상/정형 | 🦴 | 26,33,14,17 |
| psych | 정신과 안전 격리실 | 🧠 | 0,49,14,11 |
| quiet | 가족 상담·임종실 | 🕊 | 13,49,14,11 |
| decon | 제염실(외부 연결) | 🚿 | 26,49,14,11 |

### A.2 rooms[] (빠른이동 앵커)
amb 6,4 · triage 4,10 · reg 31,6 · wait 19,12 · resus 5,26 · nurse 19,28 · pyxis 16,19 · exam1 33,22 · iso 4,44 · suture 18,44 · exam2 33,42 · psych 5,55 · quiet 19,55 · decon 32,55.

### A.3 오브젝트 배치 (SoT 컴포넌트 → fixture `type` → 좌표/props)
> 마커는 오브젝트 `props`(marker/markerLabel/scenarioId)에. 시나리오 연결은 §C.3.

**로비·앰뷸런스**: BayLabel(2,1 hi) · Gurney→`gurney`(4,3 occ, **marker urgent "핸드오프 SBAR"**) · IVPump→`ivpump`(7,3) · OxygenTank→`oxygen`(3,3).
**로비·보안**: BayLabel(15,1) · MetalDetector→`detector`(18,2) · SecurityScanner→`scanner`(21,3).
**로비·원무과**: BayLabel(28,1) · IReception→`ireception`(29,4 w4h1, **marker quest "접수 등록"**) · CompCart→`compcart`(34,3) · BarcodePrinter→`barcodeprinter`(35,6) · TicketDispenser→`ticket`(37,6) · BrochureRack→`brochure`(28,6) · DeskPhone→`phone`(31,3) · HandSanitizer→`sanitizer`(37,2).
**로비·트리아지**: BayLabel(1,6 hi) · IReception→`ireception`(2,8 w3h1, **marker quest "KTAS 분류"→er-hopkins-pain**) · VitalsCart→`vitals`(6,7) · BPCuff→`bpcuff`(1,7) · HandSanitizer→`sanitizer`(1,9) · Wheelchair→`wheelchair`(6,10)(7,11) · **[폴리시]** 대기 의자 `ichair`(9,11)(11,11) + 화분(12,8)(10,4).
**로비·대기**: BayLabel(14,7) · WaitingDisplay→`waitingdisplay`(14,8 w3) · WallTV→`walltv`(22,8 w2) · WaterCooler→`watercooler`(25,9) · IChair→`ichair` A열 15/17/19/21/23,y10 down · B열 동 x,y13 up · IPlant→`iplant`(25,13).
**소생실**: BayLabel(1,17 hi) · [Bay1] SurgicalLight→`surgicallight`(4,17) · IBed→`ibed`(3,18 or occ, **marker urgent "CODE"→er-anaphylaxis**) · IMonitor→`imonitor`(1,18 beep) · Ventilator→`ventilator`(6,18) · CrashCart→`crashcart`(8,18) · Defib→`defib`(10,18) · IVPump(2,17) · SuctionUnit→`suction`(1,21) · ICurtain→`icurtain`(1,23 w11) · [Bay2] SurgicalLight(4,24) · IBed(3,25 or occ) · IMonitor(1,25 beep) · Ventilator(6,25) · IVPump(2,24) · OxygenTank(10,25) · WasteBin→`wastebin`(10,28 infectious).
**너스스테이션+약품실**: BayLabel 약품실(14,17) · PyxisMachine→`pyxis`(14,18) · MedFridge→`medfridge`(17,18) · ICabinet→`icabinet`(14,21 w2 drug "마약 보관") · SharpsContainer→`sharps`(18,21) · IGlass→`glass`(19,18 w1h4) · BayLabel NURSE STATION(21,17) · BankOfMonitors→`bankofmonitors`(21,17) · NurseStationDesk→`nursestation`(14,23 w10h6) · ChartBinder→`chartbinder`(14,25) · BarcodePrinter(23,26) · DeskPhone(14,27) · ExamStool→`examstool`(16,31) · DressingCart→`dressing`(19,30)(22,30).
**제1진료실**: BayLabel(27,17) · Otoscope→`otoscope`(27,17) · AnatomyPoster→`anatomy`(37,17) · IReception(28,20 w3h1) · CompCart(27,19) · IMonitor(31,19) · ExamStool(30,22) · IBed→`ibed`(34,20 ward occ, **marker quest "복통 문진"→er-chest-pain**) · IChair(32,24 #A8C7DC up) · IPlant(37,30).
**음압격리**: [전실] BayLabel(1,34) · PPEStand→`ppestand`(2,34) · WasteBin(5,35 infectious) · PressureGauge→`pressuregauge`(8,34) · HandSanitizer(10,35) · IGlass(1,38 w4)+Th(5,38 w2 "격리실")+IGlass(7,38 w5) · [본실] BayLabel(1,39) · IBed(3,41 ward occ, **marker info "감염 관리"**) · IMonitor(1,41 beep) · IIV→`iiv`(6,41) · DressingCart(8,42) · WasteBin(10,46 infectious) · CCTVCamera→`cctv`(10,39).
**소처치·봉합**: BayLabel(14,34) · SurgicalLight(18,34) · IBed(17,37 or occ, **marker quest "봉합 처치"**) · DressingCart(14,38) · InstrumentTray→`instrumenttray`(21,37) · SuctionUnit(23,35) · SharpsContainer(23,46) · GloveDispenser→`glovebox`(14,46).
**제2진료실**: BayLabel(27,34) · XrayViewbox→`xrayviewbox`(35,34) · IReception(28,37 w3h1) · CompCart(27,36) · CastCart→`castcart`(28,40) · IBed(34,37 ward occ, **marker quest "부목 고정"**) · ExamStool(32,41) · IPlant(37,46).
**정신과**: BayLabel(1,50) · BoltedBed→`boltedbed`(4,51 occ, **marker info "1:1 관찰 (Sitter)"**) · CCTVCamera(10,50) · IChair(2,55 #94A3B8 down).
**가족상담·임종**: BayLabel(14,50) · FramedPicture→`framedpic`(18,50 w2) · Sofa→`sofa`(15,52 w3 #8FA9C4)(21,55 w3 #C0A6B8) · CoffeeTable→`coffeetable`(17,54 w2) · TissueBox→`tissuebox`(18,53) · FloorLamp→`floorlamp`(24,51) · IPlant(25,57).
**제염실**: BayLabel(27,50) · DeconShower→`deconshower`(29,50)(33,50) · FloorDrain→`floordrain`(29,53 w2)(32,53 w2) · ChemDrum→`chemdrum`(37,51 chem)(37,54 waste).

### A.4 NPC 캐스트 (idle; 마커 있는 것 **강조**)
로비: paramedic(3,7)(7,7) · police(16,4)(24,4) · nurse(30,6)(32,6) · patient(30,8) · visitor(33,8) · nurse(4,10) · patient(2,11) · visitor(3,12) · patient(16,11) · parent(20,11) · child(21,11) · visitor(24,13).
소생실: doctor(3,21) · nurse(5,21)(6,20) · paramedic(3,29)(6,29).
스테이션: nurse(16,20) · nurse(16,27) · **doctor(18,27) urgent "Dr. Patel"→er-mental-health** · nurse(20,27) · doctor(22,27).
exam1: doctor(28,23) · patient(34,24). iso: nurse(6,45). suture: nurse(15,44) · doctor(20,44). exam2: doctor(29,41) · nurse(34,41).
psych: patient(5,55) · visitor(2,56). quiet: **doctor(16,54) info "가족 상담"** · visitor(22,56) · parent(23,56). decon: **paramedic(31,56) info "제염 처치"**.

---

## B. Business Rules (통행/차단 규칙)

### B.1 collision (벽) — SoT `IWall` 1:1 (문/통로 = gap)
- **외벽**: 상단 `{0,0,4,1}{8,0,10,1}{22,0,18,1}`(앰뷸 x4-7·정문 x18-21 gap) · 좌우 `{0,1,1,58}{39,1,1,58}` · 하단 `{0,59,18,1}{22,59,12,1}{37,59,3,1}`(캠퍼스 x18-21·제염외부 x34-36 gap).
- **가로 divider**(통로 gap x5-7/x17-20/x31-33): y16 `{1,16,4,1}{8,16,9,1}{21,16,10,1}{34,16,5,1}` · y33·y49 동형.
- **세로 divider**(통로 gap y21-23/y38-40/y53-55): x13 `{13,17,1,4}{13,24,1,9}{13,34,1,4}{13,41,1,8}{13,50,1,3}{13,56,1,3}` · x26 동형.
- **ㄷ 너스스테이션 데스크**: `{14,23,10,2}{14,25,2,4}{22,25,2,4}` — 등판+양팔만 차단, well(x16-21 y25-28)은 통행(직원이 안에 섬).

### B.2 threshold·door·glass·tint·triageline — 통행 규칙
- **threshold**(통행): y16 `x5w3→소생실`·`x17w4→스테이션`·`x31w3→내과` / y33 `x5w3→격리`·`x17w4→처치실`·`x31w3→외상` / y49 `x5w3→정신과`·`x17w4→상담실`·`x31w3→제염실` / 세로 x13·x26 각 `y21w1h3`·`y38w1h3`·`y53w1h3` / 음압 전실 `x5 y38 w2 "격리실"`.
- **door**(auto, 통행): 앰뷸 `x4 y0 w4` · 정문 `x18 y0 w4` · 캠퍼스 `x18 y59 w4` · 제염외부 `x34 y59 w3`.
- **glass**(objectCollision **차단**): 약품실 `x19 y18 w1h4` · 음압 전실 `x1 y38 w4`·`x7 y38 w5`.
- **tint**(비차단): psych `1,50,11,8 #C7D6E8 .32` · quiet `14,50,12,8 #F1DCC0 .4` · decon `27,50,12,8 #BFD8DE .4`.
- **triageline**(바닥선, 비차단): 빨 `x6 y13 w1h3` · 노 `x18 y13 w2h3`(정문 통로 중앙) · 초 `x32 y13 w1h3`.

### B.3 footprint (솔리드 차단 — `objectCollision`)
차단: bed/monitor/reception/vitals/ivpump/dressing/medfridge/scanner/chemdrum/ppestand/wastebin/gurney/defib/compcart/oxygen/suction/wheelchair/watercooler/ekg/sink/scale/boltedbed/ibed/imonitor/iiv/iplant/examstool/instrumenttray/castcart 등. **skip(통행)**: door·threshold·tint·icurtain·triageline·nursestation(ㄷwell). 벽걸이(anatomy/cctv/xrayviewbox 등)는 미등록.

---

## C. Business Logic Model (흐름)

### C.1 진입 (엘리베이터/캠퍼스)
- 타워 1F(`ELEVATOR_BUILDINGS.tower`): `interior:'INT-ER-00001'`, `entry:{x:20,y:11}`(정문 안쪽 로비). 캠퍼스 "응급실 입장"도 동일 interior. fixture `FIXTURES['INT-ER-00001']`.

### C.2 이동·카메라·마스크
- 공통 규약([README](README.md) §렌더): scale 0.85로 방 하나가 뷰포트에 맞음 · 오브젝트 컬링 off · RoomMask 옅게(0.2) · 마커 소스별 dy로 머리 위.

### C.3 시나리오 배선 (마커 → scenarioId)
| 엔티티 | 마커 | scenarioId |
|---|---|---|
| 트리아지 접수(2,8) | quest "KTAS 분류" | `er-hopkins-pain` |
| 소생실 Bay1 베드(3,18) | urgent "CODE" | `er-anaphylaxis` |
| exam1 베드(34,20) | quest "복통 문진" | `er-chest-pain` |
| Dr. Patel NPC(18,27) | urgent "Dr. Patel" | `er-mental-health` |

라벨만(시나리오 후속): 앰뷸 SBAR · 원무 접수 · 감염 관리 · 봉합 처치 · 부목 고정 · 1:1 관찰 · 가족 상담 · 제염 처치.

---

## D. Frontend Components (렌더)

### D.1 오브젝트 카탈로그 포팅
- **`objects/erEquipment.tsx`** (`ErObjectView`, SoT er/er2/er3 픽셀 1:1): Gurney·Defib·OxygenTank·GloveDispenser·SharpsContainer·HandSanitizer·EKG·Sink·Whiteboard·Scale·CompCart·BPCuff·SuctionUnit·Wheelchair·VitalsCart·IVPump·DressingCart·WaitingDisplay·WasteBin·PPEStand·MedFridge·SecurityScanner·MetalDetector·BoltedBed·DeconShower·FloorDrain·ChemDrum·Sofa·CoffeeTable·TissueBox·FloorLamp·FramedPicture·Otoscope·AnatomyPoster·PressureGauge·BarcodePrinter·WallTV·CCTVCamera·TicketDispenser·BrochureRack·DeskPhone·WaterCooler·ChartBinder·NurseStationDesk(ㄷ)·TriageLine·BayLabel.
- **공용**(`sharedEquipment.tsx`): ibed/imonitor/iiv/ireception/ichair/iplant/icabinet/examstool/instrumenttray/xrayviewbox/castcart/surgicallight/ventilator/crashcart/pyxis/bankofmonitors + glass/threshold(structures.tsx).

### D.2 렌더 특이(z-order)
- `surgicallight` = **OVERHEAD**(z 8000, 오브젝트·스프라이트 위) · `bankofmonitors` = CEILING(배경 저 z) · 마커 z 9000 / RoomMask 최상.

---

## 검증 & 편차 (Index)
- **검증**: `tsc` 0 · `jest`(er-fixture: playerStart open · 14 room 도달 · threshold 통행 · footprint/ㄷwell 차단) · `expo export` OK · **시뮬레이터**(2026-06-29~30): 전 방·통로 라벨·마커(머리 위)·수술등(overhead) 렌더 확인.
- **의도적 편차/폴리시**: (a) scale 0.85(SoT는 뷰 무관) · (b) 로비 트리아지-대기 사이 의자2+화분2 추가(동선 — 사용자 승인) · (c) 노란 트리아지선 w1→w2(정문 통로 중앙 정렬) · (d) RoomMask 옅게(0.2) · (e) 오브젝트 컬링 off(경계 통로 누락 방지). 나머지 좌표·오브젝트·NPC는 `interior-er.jsx`와 1:1.
