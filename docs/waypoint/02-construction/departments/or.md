---
phase: 02-construction
stage: 05-map-engine / 5g-b
status: IMPLEMENTED
updated: 2026-07-01
---

# 5g-b · OR 수술실 + PACU

| | |
|---|---|
| interior id | `INT-OR-00001` (deptId `DEPT-OR-00001`) |
| fixture | `mobile/src/map/fixtures/or.ts` (`OR_INTERIOR`) |
| 핸드오프 소스 | `interior-or.jsx` (레이아웃) + `interior-objects-or2.jsx`·`interior-shared.jsx` (오브젝트) |
| 그리드 | 40 cols × 52 rows · floorTheme `sterile` · scale **0.85** |
| playerStart | `{7,40}` (OR1 open floor) |

> 구조·규약은 [er.md](er.md) + [README](README.md) 공통. 여기선 OR 고유(3단계 존·양압·sterile threshold)만 상세.

## 1. 개요 & 존 구조 — 3단계 청정 존

```
┌──────── 비제한 (y0-14) ────────┐
│ 보호자 대기실     │ 탈의실·락커룸   │   x0-19 | x19-40 (gap y6-8)
├────── 준제한 (y14-31) ─────────┤   divider y14
│ Pre-Op   │ Clean │              │
│ Holding  ├───────┤  PACU 회복실  │   preop x0-13 | util x13-20 | pacu x20-40
│          │ Dirty │              │   clean|dirty y22
├──── 제한·양압 (y31-51, STERILE) ─┤   divider y31 (sterile threshold)
│  OR 1    │ Scrub │   OR 2       │   or1 x0-15 | scrub x15-23 | or2 x23-40
│ 일반/정형 │       │ 복강경/로봇   │
└──────────┴───────┴──────────────┘
```
- **핵심 규약**: 청정도 상승 방향(y14→y31)일수록 제한. 제한(OR) 진입 = **`tone:'sterile'`(파란) threshold**(가운/스크럽 필요 시각 신호). 준제한 진입은 일반 threshold.
- OR1/OR2 바닥에 초록 `tint`(#CDE3D6 .28) = 양압·수술 조도.

## 2. regions[] / rooms[]

| id | name | bounds(x,y,w,h) | 앵커(x,y) |
|---|---|---|---|
| family | 보호자 대기실(비제한) | 0,0,20,15 | 10,7 |
| locker | 탈의실·락커룸(비제한) | 19,0,21,15 | 28,7 |
| preop | 수술 전 대기실(준제한) | 0,14,14,18 | 5,20 |
| clean | Clean Utility·멸균 | 13,14,8,9 | 16,18 |
| dirty | Dirty Utility·오염 | 13,22,8,10 | 16,27 |
| pacu | 회복실 PACU(준제한) | 20,14,20,18 | 24,20 |
| or1 | 제1수술실(제한·양압) | 0,31,16,21 | 7,39 |
| scrub | 스크럽 스테이션 | 15,31,9,21 | 18,39 |
| or2 | 제2수술실(복강경/로봇) | 23,31,17,21 | 31,39 |

## 3. collision (벽)
- 외벽: 상단 `{0,0,17,1}{21,0,19,1}`(캠퍼스 문 x17-20 gap) · 좌우 `{0,1,1,50}{39,1,1,50}` · 하단 `{0,51,40,1}`.
- divider y14(비제한/준제한): `{1,14,4,1}{8,14,9,1}{20,14,9,1}{32,14,7,1}` — 통로 x5-7 / x17-19 / x29-31.
- divider y31(준제한/제한): 동형 좌표 — 통로 x5-7 / x17-19 / x29-31 (sterile).
- 세로: preop|util x13(gap y18-20) · util|pacu x20(gap y19-21) · clean|dirty y22(gap x16-17) · family|locker x19(gap y6-8) · or1|scrub x15(gap y36-38) · scrub|or2 x23(gap y36-38).

## 4. threshold · door · glass · tint
- **door**(auto): 캠퍼스 `x17 y0 w4`.
- **threshold y14**: `x5w3 →Pre-Op` · `x17w3 →복도` · `x29w3 →PACU`.
- **threshold y31 (sterile)**: `x5w3 STERILE→OR1` · `x17w3 →스크럽` · `x29w3 STERILE→OR2`.
- **세로 threshold**: x13 `y18w1h3` · x20 `y19w1h3` · clean/dirty `x16 y22 w2` · family/locker `x19 y6 w1h3` · or1/scrub `x15 y36 w1h3 sterile` · scrub/or2 `x23 y36 w1h3 sterile`.
- **tint**: t-or1 `1,32,14,19 #CDE3D6 .28` · t-or2 `24,32,15,19 #CDE3D6 .28`. glass 없음.

## 5. 오브젝트 배치 (핸드오프 → type → 좌표)
- **family**: baylabel(1,1) · walltv(9,1 w2) · sofa(2,4 w3 #9CB4C8)(2,9 w3 #C0A6B8) · coffeetable(3,6 w2) · ichair A열 10/12/14/16,y5 #FED7AA down · B열 동 x,y9 #FBCFE8 up · watercooler(17,3) · iplant(17,11).
- **locker**: baylabel(20,1) · icabinet(21/25/29/33,y3 w3 linen; 21은 GOWN)(21/25,y6 w3 linen) · sanitizer(37,3) · ichair(22/24/26/28,y10 #BAE6FD up) · iplant(37,11).
- **preop**: baylabel(1,15 hi) · [bed1] ibed(2,17 ward occ) imonitor(1,17 beep) compcart(5,16) consentclipboard(2,20) · [bed3] ibed(8,17 ward occ) iiv(10,17) imonitor(11,17) · icurtain(1,21 w11 #A7C7E7) · [bed2] ibed(2,23 ward occ) iiv(5,23) bairhugger(6,25) · iplant(11,29).
- **clean**: baylabel(14,15) · icabinet(14,17 w5 sterile STERILE)(14,19 w5 sterile)(14,20 w5 supply).
- **dirty**: baylabel(14,23) · soiledcart(14,26)(17,26) · wastebin(14,29)(18,29) infectious.
- **pacu**: baylabel(21,15) · ibed(22/26/30,y17 ward occ)(34,17 ward) · imonitor(21 beep/25 beep/29/33,y17) · suction(29,20) · bairhugger(28,19) · bankofmonitors(30,22) · nursedeski(30,24 w4h2) · compcart(34,24) · crashcart(36,25) · iplant(37,29).
- **or1**: baylabel(1,32 hi) · surgicallight(7,34) · orboommonitor(11,34 w2) · ibed(6,37 or occ) · anesthesia(4,36) · imonitor(3,37 beep) · instrumenttray(9,38) · bovie(12,38) · iiv(4,41) · kickbucket(8,41) · icabinet(1,34 w3 sterile STERILE)(1,45 w3 equipment) · compcart(12,42) · timeoutboard(1,48 w3).
- **scrub**: baylabel(16,32) · sinkor(16,35)(16,40) · scrubdispenser(19,35)(19,40) · scrubtimer(20,33).
- **or2**: baylabel(24,32 hi) · surgicallight(30,34) · orboommonitor(33,34 w2) · ibed(29,37 or occ) · anesthesia(27,36) · imonitor(26,37 beep) · laptower(25,37) · co2insufflator(26,41) · roboticconsole(33,42) · compcart(37,44) · icabinet(24,34 w3 sterile STERILE)(36,34 w3 drug) · statusboard(24,49 w6).

## 6. NPC 캐스트 (23명, idle)
family: parent(11,7) visitor(13,7) · locker: nurse(24,8) surgeon(30,8) · preop: nurse(5,19) doctor(5,25) · clean: nurse(16,20) · pacu: nurse(22,20)(24,20)(26,20)(31,27)(33,27) · or1: surgeon(5,39)(7,39) nurse(9,40) doctor(4,37) nurse순회(13,43) · scrub: surgeon(17,38) nurse(17,43) · or2: nurse(31,40) doctor(27,37) surgeon(34,45) nurse(37,45).

## 7. 오브젝트 카탈로그 포팅
- **`objects/orEquipment.tsx`** (`OrObjectView`): BairHugger·Bovie·KickBucket·TimeoutBoard·RoboticConsole·LapTower·CO2Insufflator·ScrubDispenser·ScrubTimer·ConsentClipboard·SoiledCart·ORBoomMonitor·CArm·AnesthesiaMachine·StatusBoard.
- **공용**: ibed(or variant)/imonitor/iiv/icurtain/icabinet(sterile·linen·drug·equipment·supply variant)/sinkor/surgicallight/instrumenttray/bankofmonitors/nursedeski/crashcart + sofa/coffeetable/walltv/watercooler/iplant/ichair/sanitizer/compcart/suction(er·shared).
- **footprint**: anesthesia/roboticconsole/carm/sinkor{2,2} · bairhugger/bovie/laptower/co2insufflator/soiledcart{1,2} · kickbucket{1,1} · orboommonitor는 CEILING(배경 z), surgicallight는 OVERHEAD(z8000).

## 8. 엘리베이터 / 진입
- 타워 3F: `interior:'INT-OR-00001'`, `entry:{x:18,y:1}`(캠퍼스 문 안쪽).

## 9. 검증 결과 & 편차
- `tsc` 0 · `jest`(or-fixture: room 도달·sterile threshold 통행·양압존 footprint) · `expo export` OK · 시뮬 확인(3단계 존/sterile 파란 통로/수술등 overhead).
- **편차**: (a) scale 0.85 · (b) 상호작용은 아직 **`hotspots[]` 배열** 사용(14개; family-update/garcia-consent/pacu-handoff/instrument-pass/timeout 등 시나리오 연결). ER/ICU의 엔티티-마커 모델로 후속 이관 후보(README §마커). 좌표·오브젝트·NPC는 `interior-or.jsx`와 1:1.
