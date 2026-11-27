---
artifact: domain-entities
build-spec: departments/specialty
updated: 2026-07-18
---

# Specialty OPD — Domain Entities

`SPECIALTY_INTERIOR` (`fixtures/specialty.ts`) · 28×44 · floorTheme `clinical` · scale 0.9 · playerStart `{4,10}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| eye | 안과 진료실 | `{0,11,14,13}` |
| ent | 이비인후과 진료실 | `{13,11,15,13}` |
| uro | 비뇨의학과 진료실 | `{0,23,14,21}` |
| neuro | 신경과 진료실 | `{13,23,15,21}` |
| checkin | 통합 접수 · 대기 | `{0,0,28,12}` |

## Rooms (5)
checkin `{6,6}` · eye `{6,18}` · ent `{21,18}` · uro `{6,36}` · neuro `{21,36}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,9 w1 h3}` · threshold 4(안과 `{5,11}` · 이비인후과 `{13,11}` · 비뇨 `{5,23}` · 신경과 `{13,23}`).
**통합 접수**: baylabel · clinicReception(#2A7C8C) `{2,3 w5}` · waitingdisplay `{9,1}` · ichair 앞줄(down)×6 `{13..23,4}` + 뒷줄(up)×6 `{13..23,8}` · iplant `{25,2}`.
**안과**: baylabel(hl) · **slitlamp `{2,15}`** · **phoropterstand `{7,14}`** · **visionchart `{10,13}`** · ichair `{4,19}`.
**이비인후과**: baylabel · **enttowerchair `{15,14}`** · otoscope `{20,13}` · ireception 진료 `{22,19 w3}`.
**비뇨의학과**: baylabel · ibed(ward,검사베드) `{2,27}` · ultrasound `{6,28}` · ireception 진료 `{2,36 w4}` · imonitor `{9,27}` · icabinet(supply,요검사) `{9,31 w3}`.
**신경과**: baylabel · ibed(ward,occ,신경학 검사) `{15,27}` · ireception 진료 `{22,28 w3}` · imonitor `{22,31}` · compcart `{15,35}` · icabinet(equipment,EEG) `{22,35 w3}` · iplant `{25,39}`.

## 핫스팟 (5 — 라벨만)
전문외래 접수(info,3,3) · 세극등 검사 준비(quest,3,15) · 내시경 이경 처치(info,15,14) · 방광 초음파(info,3,27) · 신경학적 사정 GCS·반사(quest,16,27).

## NPC 캐스트 (11, idle)
checkin nurse+patient+visitor · eye doctor+patient · ent doctor+patient · uro doctor+patient · neuro doctor+patient. seed 961–971.
