---
artifact: domain-entities
build-spec: departments/icu
status: IMPLEMENTED
updated: 2026-07-01
---

# Domain & Entities — 5g-c ICU

> 규칙은 [`business-rules.md`](business-rules.md), 흐름은 [`business-logic-model.md`](business-logic-model.md), 렌더는 [`frontend-components.md`](frontend-components.md).

## 1. regions[] / rooms[]
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

## 2. 오브젝트 배치 (SoT → `type` → 좌표; 마커=엔티티 속성)
- **Room1 VENT**: baylabel(1,1 hi) · ibed(2,3 ward occ) · ventilator(1,8) · ivpumptower(5,6, 6모듈) · imonitor(4,2 beep) · iiv(6,3) · foleybag(2,11).
- **Room2 CRRT**: baylabel(9,1) · ibed(10,3 ward occ) · imonitor(12,2 beep) · iiv(12,4) · crrt(13,7, 2×2).
- **Room3 EVD**: baylabel(17,1) · ibed(18,3 ward occ) · imonitor(20,2 beep) · evdstand(21,6) · icpmonitor(22,10).
- **Room4 TTM**: baylabel(25,1) · ibed(26,3 ward occ) · imonitor(28,2 beep) · ttmunit(29,7, 2×2).
- **중앙 허브**: baylabel(12,18) · bankofmonitors(11,18, 배경) · icabinet(1,19 w4 linen PPE)(29,19 w4 equipment) · nursedeski(6,23 w6h2 ORDER PC)(15,23 w6h2) · phone(9,22)(18,22) · baylabel(23,20 CODE BLUE) · **crashcart(24,22, marker urgent "CODE BLUE"→icu-code-blue)**.
- **면회 대기실**: baylabel(1,31) · visitorscreen(9,31 w2) · gownbox(1,32) · intercom(3,39) · sanitizer(11,32) · sofa(2,35 w3 #9CB4C8) · coffeetable(3,37 w2) · watercooler(11,35) · iplant(12,41).
- **Dirty Utility**: baylabel(14,31) · **sinkor(14,34, marker info "오염 처리·C-line")** · wastebin(18,33)(21,33) infectious · soiledcart(18,37) · icabinet(20,40 w3 supply).
- **Med 장비**: baylabel(24,31) · pyxis(24,33) · icabinet(27,33 w3 drug DRUGS)(24,37 w4 equipment VENT)(28,37 w4 supply) · crashcart(31,40) · iplant(31,36).

## 3. NPC 캐스트 (11명, idle; 마커=방 과제)
- Room 간호사: **r1 nurse(4,11) quest "승압제 적정"→icu-park-vent** · r2 nurse(10,11) info "필터 압력" · **r3 nurse(18,11) quest "동공·GCS 사정"→icu-psychosis** · r4 nurse(26,11) info "떨림 감시".
- 허브: **hub-n1 nurse(8,25) quest "SBAR/ABGA"→icu-monitor-alarm** · doctor(13,25) · doctor(18,25) info "RT·VENT 설정" · nurse(22,25).
- 면회: **visitor(6,37) info "면회 대기"→icu-eol-family** · visitor(9,40). Med: nurse(26,40) quest "투약 준비".

## 4. Allowed-set
- npc kind: nurse·doctor·visitor. icabinet variant: linen·equipment·drug·supply. 마커 kind: urgent·quest·info.
