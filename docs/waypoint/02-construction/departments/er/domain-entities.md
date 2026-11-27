---
artifact: domain-entities
build-spec: departments/er
status: IMPLEMENTED
updated: 2026-07-01
---

# Domain & Entities — 5g-a ER

> ER 인테리어에 존재하는 **엔티티(region·room·오브젝트·NPC)와 그 데이터**. 통행/차단 규칙은 [`business-rules.md`](business-rules.md),
> 흐름은 [`business-logic-model.md`](business-logic-model.md), 렌더는 [`frontend-components.md`](frontend-components.md).

## 1. 엔티티 개요
| 엔티티 | 설명 | 영속성 |
|---|---|---|
| Interior | 40×60 그리드 컨테이너(id/scale/playerStart) | `fixtures/er.ts` `ER_INTERIOR` |
| Region | 방 판정 bounds(첫 매치) | `regions[]` |
| Room | 빠른이동 앵커 | `rooms[]` |
| MapObject | `{id,type,x,y,props}` 배치 인스턴스 | `objects[]` |
| NpcSpec | `{id,kind,mode,seed,start,marker?}` | `npcs[]` |

## 2. regions[] (bounds가 divider와 1칸 겹침 — 항상 region 판정)
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

## 3. rooms[] (빠른이동 앵커 x,y)
amb 6,4 · triage 4,10 · reg 31,6 · wait 19,12 · resus 5,26 · nurse 19,28 · pyxis 16,19 · exam1 33,22 · iso 4,44 · suture 18,44 · exam2 33,42 · psych 5,55 · quiet 19,55 · decon 32,55.

## 4. 오브젝트 배치 (SoT 컴포넌트 → fixture `type` → 좌표/props)
> 마커 props(marker/markerLabel/scenarioId)는 business-logic-model §시나리오 배선에서 흐름으로 다룸. 여기선 배치 데이터.

**로비·앰뷸런스**: BayLabel(2,1 hi) · Gurney→`gurney`(4,3 occ, **marker urgent "핸드오프 SBAR"**) · IVPump→`ivpump`(7,3) · OxygenTank→`oxygen`(3,3).
**로비·보안**: BayLabel(15,1) · MetalDetector→`detector`(18,2) · SecurityScanner→`scanner`(21,3).
**로비·원무과**: BayLabel(28,1) · IReception→`ireception`(29,4 w4h1, **marker quest "접수 등록"**) · CompCart→`compcart`(34,3) · BarcodePrinter→`barcodeprinter`(35,6) · TicketDispenser→`ticket`(37,6) · BrochureRack→`brochure`(28,6) · DeskPhone→`phone`(31,3) · HandSanitizer→`sanitizer`(37,2).
**로비·트리아지**: BayLabel(1,6 hi) · IReception→`ireception`(2,8 w3h1, **marker quest "KTAS 분류"→er-hopkins-pain**) · VitalsCart→`vitals`(6,7) · BPCuff→`bpcuff`(1,7) · HandSanitizer→`sanitizer`(1,9) · Wheelchair→`wheelchair`(6,10)(7,11) · **[폴리시]** 의자 `ichair`(9,11)(11,11) + 화분(12,8)(10,4).
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

## 5. NPC 캐스트 (idle; 마커 있는 것 **강조**)
로비: paramedic(3,7)(7,7) · police(16,4)(24,4) · nurse(30,6)(32,6) · patient(30,8) · visitor(33,8) · nurse(4,10) · patient(2,11) · visitor(3,12) · patient(16,11) · parent(20,11) · child(21,11) · visitor(24,13).
소생실: doctor(3,21) · nurse(5,21)(6,20) · paramedic(3,29)(6,29).
스테이션: nurse(16,20) · nurse(16,27) · **doctor(18,27) urgent "Dr. Patel"→er-mental-health** · nurse(20,27) · doctor(22,27).
exam1: doctor(28,23) · patient(34,24). iso: nurse(6,45). suture: nurse(15,44) · doctor(20,44). exam2: doctor(29,41) · nurse(34,41).
psych: patient(5,55) · visitor(2,56). quiet: **doctor(16,54) info "가족 상담"** · visitor(22,56) · parent(23,56). decon: **paramedic(31,56) info "제염 처치"**.

## 6. Allowed-set (코드 측 관리 — 확장 시 추가만)
- **object `type`**: 구조(door/threshold/glass/tint/triageline/nursestation/baylabel) + 카탈로그(frontend-components §카탈로그 목록).
- **npc `kind`**: paramedic·police·nurse·doctor·patient·visitor·parent·child.
- **marker `kind`**: `urgent`(빨,!) · `quest`(노,?) · `info`(파,?).
- **tint color/op**: 방별 값(business-rules §tint).

## 7. SoT 매핑 노트
`interior-er.jsx`의 IWall/IGlass/IThreshold/tint = business-rules로, 오브젝트 컴포넌트 = 위 §4 배치 + frontend 카탈로그로 1:1 유도.
