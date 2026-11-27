---
artifact: domain-entities
build-spec: departments/peds
status: DRAFT
updated: 2026-07-10
---

# Domain & Entities — 5g-d Peds+NICU

> 규칙은 [`business-rules.md`](business-rules.md), 흐름은 [`business-logic-model.md`](business-logic-model.md), 렌더는 [`frontend-components.md`](frontend-components.md). SoT: v13 `interior-peds.jsx`.

## 1. regions[] (bounds가 divider와 1칸 겹침)
| id | name | icon | bounds(x,y,w,h) | anchor |
|---|---|---|---|---|
| welcome | 외래·대기·놀이 | 🌈 | 0,0,34,15 | 16,6 |
| exam | 소아 진료실 | 🩺 | 0,14,12,16 | 5,22 |
| ward | 소아 병동 | 🛏 | 11,14,23,16 | 22,24 |
| ante | NICU 전실·세척 | 🧼 | 0,29,10,19 | 4,38 |
| nicu | NICU 인큐베이터 존 | 👶 | 9,29,25,19 | 20,38 |

## 2. 오브젝트 배치 (SoT 컴포넌트 → fixture `type` → 좌표/props)
> 마커는 §business-logic-model 시나리오 배선 참조. 신규 type은 소문자.

**외래·계측(좌)**: BayLabel(1,1 "환영·외래·4F")·BayLabel(1,2 "계측") · ClinicReception→`clinicreception`(13,3 w6 tone#DB2777 "접수") · BabyScale→`babyscale`(2,4) · StadiometerScale→`stadiometer`(5,4) · BPCuff→`bpcuff`(1,6) · **[마커 info 성장 계측 @3,7]**.
**외래·놀이(우)**: BayLabel(26,1 PLAY hi) · 놀이매트(tint/rect #FED7AA 20,3 w12 h8) · SmallSlide→`smallslide`(29,3) · Blocks→`blocks`(24,5) · RockingHorse→`rockinghorse`(21,6) · ToyChest→`toychest`(30,6) · Mural→`mural`(20,1 w4h2) · Balloon→`balloon`(22,2 red)(23,1.5 blue)(24,2.5 green) · **[마커 info 놀이방 @25,7]**.
**외래·대기**: IChair→`ichair`(2/4/6/8, y11, colors #FBCFE8/#BAE6FD/#FEF08A/#BBF7D0, up) · IPlant(1,12)(31,11).
**소아 진료실(exam)**: BayLabel(1,15) · IBed→`ibed`(2,17 ward "EXAM") · IMonitor(1,17) · IReception(6,18 w3 "진료") · IMonitor(9,17) · TongueDepressorJar→`tonguejar`(6,16) · StickerRoll→`stickerroll`(8,16) · IChair(9,24 #BAE6FD up) · IPlant(10,27) · **[마커 quest 성장 문진 @3,17]**.
**소아 병동(ward)**: BayLabel(12,15 PEDIATRIC WARD) · NurseDeskI→`nursedeski`(12,16 w6h2 "PEDS STATION") · DosingChart→`dosingchart`(19,15 w2) · StickerRoll(22,16) · MetalCrib→`metalcrib`(13,23 occ 🐻)(17,23 occ 🦊) · IBed(24,23 ward occ)(28,23 **peds** occ) · IVBoard→`ivboard`(13,24) · IVPump(16,23)(20,23)(27,23) · IMonitor(12,23 beep) · IPlant(32,27) · **[마커 quest 투약 소분 @14,19]** · **[마커 info 회진·촉진 @24,23]**.
**NICU 전실(ante)**: BayLabel(1,30 "NICU 전실·SCRUB")·BayLabel(1,41 "3분 스크럽 후 입장" hi) · SinkOR→`sinkor`(2,33) · ScrubDispenser→`scrubdispenser`(6,33) · GownBox→`gownbox`(1,37) · HandSanitizer→`sanitizer`(7,36) · **[마커 info 손 위생 3분 @3,36]**.
**NICU 인큐베이터 존(nicu)**: BayLabel(10,30 "NICU·INCUBATOR ZONE") · PhototherapyLamp→`phototherapy`(11,32 w2)(18,32 w2)(25,32 w2) · Incubator→`incubator`(11,35)(18,35)(25,35) · IMonitor(10,35 beep)(17,35 beep)(24,35 beep) · MilkFridge→`milkfridge`(30,34) · **[마커 quest 위관영양 @12,35]** · **[마커 info 바이탈 차팅 @22,40]**.

## 3. NPC 캐스트 (idle; 마커 있는 것은 §logic)
welcome: nurse(14,6)(16,6) · nurse(3,8) · child(25,8)(27,8) · parent(29,9) · parent(3,10.5) · child(5,10.5).
exam: doctor(4,24) · child(6,25) · parent(7,24).
ward: nurse(13,20)(15,20)(17,20) · parent(19,21)(22,26)(31,26) · doctor(23,25) · nurse(25,26).
ante: nurse(4,43).
nicu: nurse(14,40)(22,41).

## 4. Allowed-set
- npc kind: nurse·doctor·child·parent(+patient 필요 시). marker: quest·info(·urgent 미사용).
- ibed variant: ward·**peds**(주황 프레임·핑크 매트리스). floorTheme `peds`(#FDE6BB/#FAD79A).
- 신규 object type(전부 소문자): babyscale·stadiometer·tonguejar·stickerroll·dosingchart·metalcrib·ivboard·incubator·phototherapy·milkfridge·smallslide·blocks·rockinghorse·toychest·mural·balloon.

## 5. SoT 매핑 노트
`interior-peds.jsx`의 IWall/IGlass/IThreshold/tint → business-rules; 오브젝트 컴포넌트 → 위 §2 + frontend 카탈로그. 놀이방 오브젝트(SmallSlide/RockingHorse/ToyChest/Blocks/Mural/Balloon/PedsBed)는 `interior-peds.jsx` 내부 정의, 나머지는 `interior-objects-peds2.jsx`.
