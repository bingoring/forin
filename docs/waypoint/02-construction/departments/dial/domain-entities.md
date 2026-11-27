---
artifact: domain-entities
build-spec: departments/dial
updated: 2026-07-18
---

# Hemodialysis — Domain Entities

`DIAL_INTERIOR` (`fixtures/dial.ts`) · 28×44 · floorTheme `clinical` · scale 0.9 · playerStart `{4,8}`.

## Regions (4)
| id | 이름 | bounds |
|---|---|---|
| floor | 투석 치료실 (오픈 플로어) | `{0,9,28,26}` |
| water | RO 수처리실 | `{0,34,14,10}` |
| iso | 격리 투석 스테이션 | `{13,34,15,10}` |
| checkin | 접수 · 체중 측정 | `{0,0,28,10}` |

## Rooms (4)
checkin `{5,5}` · floor `{13,20}` · water `{6,39}` · iso `{21,39}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,7 w1 h3}` · threshold 3(치료실 `{6,9 w3}` · 수처리 `{6,34}` · 격리 `{14,34}` sterile).
**접수·체중**: baylabel · ireception 접수 `{2,3 w4}` · stadiometer `{7,2}` · imonitor `{9,2}` · ichair×4 `{16/18/20/22,6}` · iplant `{25,2}`.
**투석 치료실**: baylabel(hl) · 좌열 **dialysischair(occ) `{2,13}`/`{2,20}`/`{2,27}`** + **dialysismachine `{6,13}`/`{6,20}`/`{6,27}`** · 중앙 nursestation `{10,16 w8 h5}` · compcart `{11,22}` · 우열 dialysischair `{20,13}`(occ)/`{20,20}`(occ)/`{20,27}` + dialysismachine `{24,13}`/`{24,20}`/`{24,27}`.
**RO 수처리실**: baylabel · **rowaterunit `{2,38}`** · sinkor `{8,38}`.
**격리 투석**: baylabel · dialysischair(occ) `{15,37}` · dialysismachine `{19,37}` · wastebin(infectious) `{23,37}` · iplant `{25,41}`.

## 핫스팟 (4 — 라벨만)
투석 전 체중 측정(quest,7,3) · 바이탈·천자(AVF) 확인(quest,3,20) · 역삼투 수질 점검(info,3,38) · 전용 격리 투석(info,15,37).

## NPC 캐스트 (7, idle)
checkin nurse+patient · floor nurse×2+doctor · water doctor · iso nurse. seed 941–947.
