---
phase: 02-construction
stage: 05-map-engine / 5g-c
status: IMPLEMENTED
updated: 2026-07-01
---

# 5g-c · ICU 중환자실

| | |
|---|---|
| interior id | `INT-ICU-00001` (deptId `DEPT-ICU-00001`) |
| fixture | `mobile/src/map/fixtures/icu.ts` (`ICU_INTERIOR`) |
| 핸드오프 소스 | `interior-icu.jsx` (레이아웃) + `interior-objects-icu2.jsx`·`interior-shared.jsx` (오브젝트) |
| 그리드 | 34 cols × 44 rows · floorTheme `ICU` · scale **0.85** |
| playerStart | `{16,26}` (허브 open floor; 16,23은 데스크라 회피) |

> 구조·규약은 [er.md](er.md) + [README](README.md) 공통. 여기선 ICU 고유(**유리벽 1인실 ×4** + 중앙 텔레메트리 허브)만 상세.

## 1. 개요 & 존 구조 — 유리벽 1인실 + 중앙 허브

```
┌ Room1 ┃ Room2 ┃ Room3 ┃ Room4 ┐   유리벽(glass) 1인실 y0-17
│ VENT  ┃ CRRT  ┃ EVD   ┃ TTM   │   x0-8 ┃ x8-16 ┃ x16-24 ┃ x24-34
│ 🫁    ┃ 🩸    ┃ 🧠    ┃ ❄     │   각 방 y17에 auto door로 허브와 연결
├──────╂───────╂──────╂────────┤   y17 유리 경계
│      중앙 제어 허브 (텔레메트리)      │   station y17-30 전폭
│      ORDER PC · CODE BLUE          │
├──────┬────────┬──────────────────┤   divider y30
│ 면회   │ Dirty  │  Med·장비 보관     │   family x0-13 | dirty x13-23 | equip x23-34
│ 대기   │ Utility│                   │
└───────┴────────┴───────────────────┘
```
- **핵심 규약**: 4개 1인실은 **투명 유리벽**(`glass`) — 허브에서 환자가 다 보임(ICU 감시 원칙). 벽은 정적 collision이 아니라 **glass 오브젝트의 objectCollision으로 차단**. 각 방 y17 경계에 **폭1 auto door**(g-glass … door … g-glass 패턴).
- 방 위 전체에 어두운 `tint`(#26354D .16) = ICU 저조도.
- 지원 3실(면회/Dirty/Med)은 일반 threshold로 허브와 연결.

## 2. regions[] / rooms[]

| id | name | bounds(x,y,w,h) | 앵커 |
|---|---|---|---|
| r1 | Room 1·인공호흡(A) | 0,0,9,18 | 3,7 |
| r2 | Room 2·CRRT 투석(A) | 8,0,9,18 | 11,7 |
| r3 | Room 3·뇌압/EVD(B) | 16,0,9,18 | 19,7 |
| r4 | Room 4·TTM 저체온(B) | 24,0,10,18 | 27,7 |
| station | 중앙 제어 허브 | 0,17,34,14 | 16,23 |
| family | 면회 대기실 | 0,30,14,14 | 5,36 |
| dirty | Dirty Utility·오염 | 13,30,11,14 | 18,36 |
| equip | Med·장비 보관실 | 23,30,11,14 | 28,36 |

## 3. collision (벽)
- 외벽: 상단 `{0,0,34,1}` · 좌우 `{0,1,1,42}{33,1,1,42}` · 하단 `{0,43,6,1}{9,43,24,1}`(캠퍼스 문 x6-8 gap).
- divider y30(허브/지원): `{1,30,4,1}{8,30,5,1}{16,30,6,1}{25,30,8,1}` — 통로 x5-7 / x13-15 / x22-24.
- 지원 세로: x13(gap y35-37) `{13,31,1,4}{13,38,1,5}` · x23(gap y35-37) 동형.
- **1인실 유리벽은 collision에 없음** — glass 오브젝트가 objectCollision으로 차단(세로 x8/x16/x24 + y17 경계).

## 4. threshold · door · glass · tint
- **glass(차단)**: 세로 `g-v1 x8 y1 h16` · `g-v2 x16` · `g-v3 x24`. y17 경계 각 방: `x1w3 · x5w3`(R1) / `x9w3 · x13w3`(R2) / `x17w3 · x21w3`(R3) / `x25w3 · x29w4`(R4).
- **door(auto)**: 각 방 y17 폭1 — `d-r1 x4` · `d-r2 x12` · `d-r3 x20` · `d-r4 x28`. 캠퍼스 `x6 y43 w3`.
- **threshold**: `x5 y30 w3 →면회` · `x13 y30 w3 →오염` · `x22 y30 w3 →MED` · 세로 x13 `y35 w1h3` · x23 `y35 w1h3`.
- **tint**: t-rooms `1,1,32,16 #26354D .16`.

## 5. 오브젝트 배치 (핸드오프 → type → 좌표; 마커=엔티티 속성)
- **Room1 VENT**: baylabel(1,1 hi) · ibed(2,3 ward occ) · ventilator(1,8) · ivpumptower(5,6, 6모듈) · imonitor(4,2 beep) · iiv(6,3) · foleybag(2,11).
- **Room2 CRRT**: baylabel(9,1) · ibed(10,3 ward occ) · imonitor(12,2 beep) · iiv(12,4) · crrt(13,7, 2×2).
- **Room3 EVD**: baylabel(17,1) · ibed(18,3 ward occ) · imonitor(20,2 beep) · evdstand(21,6) · icpmonitor(22,10).
- **Room4 TTM**: baylabel(25,1) · ibed(26,3 ward occ) · imonitor(28,2 beep) · ttmunit(29,7, 2×2).
- **중앙 허브**: baylabel(12,18 CENTRAL ICU STATION) · bankofmonitors(11,18, 배경) · icabinet(1,19 w4 linen PPE)(29,19 w4 equipment) · nursedeski(6,23 w6h2 ORDER PC)(15,23 w6h2) · phone(9,22)(18,22) · baylabel(23,20 CODE BLUE) · **crashcart(24,22, marker urgent "CODE BLUE"→icu-code-blue)**.
- **면회 대기실**: baylabel(1,31) · visitorscreen(9,31 w2) · gownbox(1,32) · intercom(3,39) · sanitizer(11,32) · sofa(2,35 w3 #9CB4C8) · coffeetable(3,37 w2) · watercooler(11,35) · iplant(12,41).
- **Dirty Utility**: baylabel(14,31) · **sinkor(14,34, marker info "오염 처리·C-line")** · wastebin(18,33)(21,33) infectious · soiledcart(18,37) · icabinet(20,40 w3 supply).
- **Med 장비**: baylabel(24,31) · pyxis(24,33) · icabinet(27,33 w3 drug DRUGS)(24,37 w4 equipment VENT)(28,37 w4 supply) · crashcart(31,40) · iplant(31,36).

## 6. NPC 캐스트 (11명, idle; 마커는 방 과제)
- Room 간호사: **r1 nurse(4,11) quest "승압제 적정"→icu-park-vent** · r2 nurse(10,11) info "필터 압력" · **r3 nurse(18,11) quest "동공·GCS 사정"→icu-psychosis** · r4 nurse(26,11) info "떨림 감시".
- 허브: **hub-n1 nurse(8,25) quest "SBAR/ABGA"→icu-monitor-alarm** · doctor(13,25) · doctor(18,25) info "RT·VENT 설정" · nurse(22,25).
- 면회: **visitor(6,37) info "면회 대기"→icu-eol-family** · visitor(9,40).
- Med: nurse(26,40) quest "투약 준비".
- → 5개 ICU 시나리오 연결: icu-park-vent · icu-psychosis · icu-monitor-alarm · icu-code-blue · icu-eol-family.

## 7. 오브젝트 카탈로그 포팅
- **`objects/icuEquipment.tsx`** (`IcuObjectView`): CRRTMachine(2×2)·IVPumpTower(6모듈)·EVDStand·ICPMonitor·TTMUnit(2×2)·FoleyBag·Intercom·GownBox·VisitorScreen. `<text>` 글리프는 도형 대체.
- **공용**: ibed(ward)/imonitor/iiv/icabinet/sinkor/pyxis/crashcart/ventilator/bankofmonitors/nursedeski/soiledcart + sofa/coffeetable/watercooler/iplant/sanitizer/phone/wastebin/glass/threshold.
- **footprint**: crrt/ttmunit{2,2} · ivpumptower/evdstand/icpmonitor{1,1} · glass는 props.w/h로 차단 · bankofmonitors CEILING(배경).

## 8. 엘리베이터 / 진입
- 타워 4F: `interior:'INT-ICU-00001'`, `entry:{x:7,y:42}`(캠퍼스 문 안쪽).

## 9. 검증 결과 & 편차
- `tsc` 0 · `jest`(icu-fixture: 유리벽 차단 x8,8 · 방 auto door 통행 x4,17 · ibed footprint x2,4 차단 · playerStart hub open · 8 room 도달·threshold 통행) · `expo export` OK · 시뮬 확인.
- **편차**: (a) scale 0.85 · (b) playerStart {16,23}(데스크)→{16,26}(허브 open floor) · (c) RoomMask 옅게 · (d) 오브젝트 컬링 off. 마커는 **엔티티 속성**(ER과 동일 모델). 좌표·오브젝트·NPC는 `interior-icu.jsx`와 1:1.
