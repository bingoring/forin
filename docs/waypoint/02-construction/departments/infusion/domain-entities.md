---
artifact: domain-entities
build-spec: departments/infusion
updated: 2026-07-18
---

# Infusion Center — Domain Entities

`INFUSION_INTERIOR` (`fixtures/infusion.ts`) · 28×40 · floorTheme `clinical` · scale 0.9 · playerStart `{4,7}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| bay | 오픈 주입 베이 | `{0,8,20,21}` |
| private | 격리 주입실 (반응 관찰) | `{19,8,9,21}` |
| nourish | 간이 휴게 · 다과 | `{0,28,14,12}` |
| station | 주입 간호 스테이션 | `{13,28,15,12}` |
| check | 접수 · 조제 전달 | `{0,0,28,9}` |

> `regionAt` 최소면적 규칙 — check(전폭)이 bay/private와 y8에서 1칸 겹치나 더 작은 bay/private가 우선.

## Rooms (5)
check `{6,4}` · bay `{8,17}` · private `{23,17}` · nourish `{6,34}` · station `{20,34}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,5 w1 h2}`(← 엘리베이터, **좌측**) · threshold 3(→베이 `{6,8 w2}` · →격리 `{19,8 w2}` sterile · →휴게 `{6,28 w2}`).
**접수·조제 전달**: baylabel · ireception 접수 `{2,3 w5}` · **pneumatictube `{9,2}`** · icabinet(drug) 당일약품 `{13,2 w3}` · **medfridge `{17,2}`** · **handsanitizer `{21,2}`** · iplant `{25,5}`.
**오픈 주입 베이**: baylabel(hl) · **infusionchair×8**(`{2,11}`·`{7,11}`·`{12,11}`·`{2,17}`·`{7,17}`·`{12,17}`·`{2,23}`·`{7,23}`, `{7,17}` 외 occupied) + **smartinfusionpump×8**(각 체어 우측 +3: `{5,11}`·`{10,11}`·`{15,11}`·`{5,17}`·`{10,17}`·`{15,17}`·`{5,23}`·`{10,23}`).
**격리 주입실**: baylabel(hl) · infusionchair(occ) `{20,12}` · smartinfusionpump `{23,12}` · imonitor(beep) `{25,12}` · **crashcart `{24,17}`** · **ppestation `{20,20}`**.
**간이 휴게·다과**: baylabel · watercooler `{2,31}` · **coffeemachine `{4,31}`** · coffeetable `{6,33 w2}` · ichair(left) `{9,32}`·`{9,35}`.
**주입 간호 스테이션**: baylabel · nursestation `{15,31 w9 h5}` · deskphone `{16,31}` · **compcart `{22,31}`** · iplant `{25,37}`.

## 핫스팟 (마커, 5 — 라벨만)
예약·약품 대조(quest,3,3) · 주입 속도·부작용(quest,7,11) · 아나필락시스 관찰(urgent,20,12) · 수분·간식 보충(info,4,31) · 주입 일정·차팅(info,18,34).

## NPC 캐스트 (8, mode idle)
check nurse+patient · bay nurse+patient · private nurse · nourish visitor · station nurse+doctor. seed 821–828.
