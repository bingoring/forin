---
artifact: domain-entities
build-spec: departments/picu
updated: 2026-07-18
---

# PICU — Domain Entities

`PICU_INTERIOR` (`fixtures/picu.ts`) · 28×44 · floorTheme `peds` · scale 0.9 · playerStart `{4,6}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| station | 중앙 모니터 허브 | `{0,7,28,11}` |
| room1 | PICU 1 (유리 격리실) | `{0,17,10,27}` |
| room2 | PICU 2 (유리 격리실) | `{9,17,10,27}` |
| room3 | PICU 3 · 가족 상주 | `{18,17,10,27}` |
| ante | 전실 · 손위생 | `{0,0,28,8}` |

## Rooms (5)
ante `{5,4}` · station `{14,12}` · room1 `{5,30}` · room2 `{14,30}` · room3 `{23,30}`.

## 오브젝트 배치 (v16 1:1)
**저조도**: tint `{1,18 w26 h25}` (#232C48, op 0.12).
**구조**: door `d-elev{0,5 w1 h2}` · threshold(손위생 게이트 `{6,7}` sterile) · **유리 전면 y17**(glass `{1,17 w2}`+door `{3,17}`+glass `{4,17 w5}` / glass `{10,17 w2}`+door `{12,17}`+glass `{13,17 w5}` / glass `{19,17 w2}`+door `{21,17}`+glass `{22,17 w5}`) · **방 유리 divider** glass `{9,18 w1 h25}`/`{18,18 w1 h25}`.
**전실**: baylabel(hl) · sinkor `{2,2}` · gownbox `{6,2}` · handsanitizer `{9,2}`.
**중앙 허브**: baylabel(hl) · bankofmonitors `{9,9}` · nursestation `{2,11 w6 h4}` · ireception PICU DESK `{20,10 w5}` · crashcart `{24,13}` · deskphone `{3,11}`.
**PICU 1**: baylabel · **picubed(occ) `{2,22}`** · **pedventilator `{1,30}`** · imonitor(beep) `{7,21}` · iiv `{7,24}`.
**PICU 2**: baylabel · picubed(occ) `{11,22}` · imonitor(beep) `{16,21}` · **broselowcart `{11,31}`**.
**PICU 3**: baylabel · picubed(occ) `{20,22}` · imonitor `{25,21}` · **reclinerdaybed `{20,31}`** · iplant `{25,42}`.

## 핫스팟 (5 — 라벨만)
가운·손위생(info,3,2) · 3-방 활력 감시(quest,5,13) · 소아 vent·진정 사정(quest,3,22) · 집중 감시(info,12,22) · 가족 상주 지지(info,20,31).

## NPC 캐스트 (6, idle)
ante nurse · station nurse+doctor · room1 nurse · room2 nurse · room3 parent. seed 891–896.
