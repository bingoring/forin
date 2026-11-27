---
artifact: domain-entities
build-spec: departments/endo
updated: 2026-07-18
---

# Endoscopy — Domain Entities

`ENDO_INTERIOR` (`fixtures/endo.ts`) · 28×44 · floorTheme `clinical` · scale 0.9 · playerStart `{4,8}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| prep | 전처치 · 회복 베이 | `{0,9,14,18}` |
| reproc | 세척 · 재처리실 | `{13,9,15,18}` |
| proc1 | 내시경 시술실 1 | `{0,26,14,18}` |
| proc2 | 내시경 시술실 2 | `{13,26,15,18}` |
| checkin | 접수 · 대기 | `{0,0,28,10}` |

## Rooms (5)
checkin `{5,5}` · prep `{6,17}` · reproc `{21,17}` · proc1 `{6,36}` · proc2 `{21,36}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,7 w1 h3}` · threshold 4(전처치 `{5,9}` · 재처리 `{13,9}` sterile · 시술1 `{6,26}` · 시술2 `{14,26}`).
**접수·대기**: baylabel · ireception 접수 `{2,3 w4}` · imonitor `{6,2}` · ichair×5 `{15/17/19/21/23,6}` · iplant `{25,2}`.
**전처치·회복**: baylabel(hl) · ibed(ward,occ,전처치) `{2,12}` · imonitor(beep) `{1,12}` · iiv `{6,12}` · oxygen `{7,12}` · icurtain(pink) `{1,17 w11}` · ibed(ward,occ,회복) `{2,19}` · imonitor `{1,19}` · suction `{6,20}`.
**세척·재처리**: baylabel · **scopewasher `{14,13}`** · **scopecabinet `{22,12}`** · sinkor `{14,19}` · wastebin(infectious) `{19,20}`.
**시술실 1**: baylabel · **procedurebed `{2,31}`** · **endotower `{2,37}`** · imonitor(beep) `{9,30}` · suction `{11,31}`.
**시술실 2**: baylabel · procedurebed `{15,31}` · endotower `{23,37}` · imonitor(beep) `{14,30}` · suction `{22,31}` · iplant `{25,41}`.

## 핫스팟 (5 — 라벨만)
금식(NPO) 확인(quest,3,3) · 진정 회복 관찰(info,3,12) · 내시경 재처리 AER(info,15,13) · 진정 모니터·스코프(quest,3,31) · 대장내시경 진행(info,16,31).

## NPC 캐스트 (9, idle)
checkin nurse+patient · prep nurse · reproc nurse · proc1 doctor+nurse×2 · proc2 doctor+nurse. seed 921–929.
