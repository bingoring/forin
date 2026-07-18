---
artifact: domain-entities
build-spec: departments/psych
updated: 2026-07-18
---

# Inpatient Psych — Domain Entities

`PSYCH_INTERIOR` (`fixtures/psych.ts`) · 28×44 · floorTheme `internal` · scale 0.9 · playerStart `{4,7}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| station | 관찰 간호 스테이션 | `{0,8,14,16}` |
| dayroom | 데이룸 (공동 활동) | `{13,8,15,16}` |
| rooms | 안전 병실 | `{0,23,14,21}` |
| seclusion | 안정실 (Seclusion) | `{13,23,15,21}` |
| sally | 이중 통제문 · 소지품 보관 | `{0,0,28,9}` |

## Rooms (5)
sally `{5,4}` · station `{6,15}` · dayroom `{21,15}` · rooms `{6,35}` · seclusion `{21,35}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,5 w1 h2}` · threshold(통제문 `{6,8}` sterile · 병실 `{6,23}` · 안정실 `{14,23}` sterile) · **obswindow `{13,12 w1}`**(station\|dayroom 관찰창, y11-13 gap 통행).
**이중 통제문**: baylabel(hl) · **detector `{3,2}`**(MetalDetector) · icabinet(linen,LOCKER) `{7,2 w3}`/`{11,2 w3}` · ireception 보안데스크 `{16,3 w4}`.
**관찰 간호 스테이션**: baylabel(hl) · nursestation `{2,12 w9 h5}` · deskphone `{3,12}` · chartbinder `{9,12}` · compcart `{2,18}` · icabinet(drug,MED) `{2,20 w3}`.
**데이룸**: baylabel · **grouptable `{15,12}`/`{20,17}`** · walltv `{24,9 w2}` · ichair(up) `{15,15}`/`{17,15}`/`{19,20}`/`{23,20}` · watercooler `{25,13}` · iplant `{25,21}`.
**안전 병실**: baylabel · **safebed `{2,27}`/`{8,27}`/`{2,37}`/`{8,37}`**.
**안정실**: baylabel · **seclusionpad `{15,28 w4}`/`{15,34 w4}`** · obswindow `{20,26 w3}` · iplant `{25,41}`.

## 핫스팟 (5 — 라벨만)
반입 금지품 확인(quest,4,3) · 상시 관찰·라운드(info,6,15) · 집단 치료 프로그램(info,16,12) · 1:1 관찰(info,3,27) · CCTV 상시 관찰(urgent,16,28).

## NPC 캐스트 (10, idle)
sally nurse+patient · station nurse+doctor · dayroom patient+nurse · rooms nurse+patient · seclusion patient+nurse. seed 1041–1050.
