---
artifact: domain-entities
build-spec: departments/morgue
updated: 2026-07-18
---

# Morgue & Autopsy — Domain Entities

`MORGUE_INTERIOR` (`fixtures/morgue.ts`) · **28**×40 · floorTheme `clinical` · playerStart `{4,7}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| reception | 접수 · 인수인계 | `{0,0,28,9}` |
| cold | 시신 냉장 보관실 | `{0,8,14,18}` |
| autopsy | 부검실 (Autopsy) | `{13,8,15,18}` |
| viewing | 유족 참관실 | `{0,25,15,15}` |
| mech | 시설팀 기계실 | `{14,25,14,15}` |

## Rooms (5)
reception `{6,4}` · cold `{6,16}` · autopsy `{20,16}` · viewing `{6,33}` · mech `{21,33}`.

## 오브젝트 배치 (v16 1:1)
**전면**: tint `{1,1 w26 h38}`(#1E2530 op0.14 저조도 지하).
**구조**: door `d-elev{0,5 w1 h2}`(← 엘리베이터) · threshold(냉장실 `{6,8 w2}` · 부검실 `{13,8 w2}` sterile tone · 참관실 `{6,25 w2}` · 기계실 `{14,25 w2}`).
**접수·인수인계**: baylabel(RECEPTION) · ireception 영안실 접수 `{2,3 w5}` · chartbinder `{9,2}` · deskphone `{11,2}` · handsanitizer `{14,2}` · plant `{25,5}`.
**시신 냉장 보관실**: baylabel(hl) · **cadaverfridge `{2,11 w4}`/`{7,11 w4}`/`{2,18 w4}`** · gurney(이송) `{8,19}`.
**부검실**: baylabel(AUTOPSY SUITE) · **autopsytable `{15,12}`** · sinkor `{22,11}` · instrumenttray `{22,16}` · monitor `{15,11}` · wastebin(infectious) `{25,20}`.
**유족 참관실**: baylabel(VIEWING ROOM) · **viewingbier `{2,29}`** · chair×3 `{2,34}`/`{4,34}`/`{6,34}`(down) · plant `{11,29}`.
**시설팀 기계실**: baylabel(MECHANICAL) · icabinet(equipment 설비) `{15,28 w4}`/`{19,28 w4}` · autoclave `{15,32}` · plant `{25,37}`.

## 핫스팟 (5 — 라벨만)
고인 신원 확인(quest,3,3) · 안치·라벨 대조(info,3,11) · 검안·부검 기록(quest,16,12) · 고별 참관(info,3,29) · 설비 점검(info,16,32).

## NPC 캐스트 (8, idle)
reception doctor+visitor · cold nurse · autopsy doctor+nurse · viewing visitor×2 · mech doctor. seed 1131–1138.
