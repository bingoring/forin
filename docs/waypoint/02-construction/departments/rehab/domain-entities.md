---
artifact: domain-entities
build-spec: departments/rehab
updated: 2026-07-18
---

# Rehabilitation PT/OT — Domain Entities

`REHAB_INTERIOR` (`fixtures/rehab.ts`) · 28×44 · floorTheme `peds` · scale 0.9 · playerStart `{4,8}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| gait | 보행 훈련존 | `{0,9,14,18}` |
| mat | 매트 치료존 | `{13,9,15,18}` |
| cardio | 유산소 · 근력 존 | `{0,26,15,18}` |
| adl | OT · 일상생활 훈련 | `{14,26,14,18}` |
| reception | 재활 접수 · 평가 | `{0,0,28,10}` |

## Rooms (5)
reception `{5,5}` · gait `{6,17}` · mat `{21,17}` · cardio `{6,35}` · adl `{21,35}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,7 w1 h3}` · threshold(접수→gait `{5,9 w4}` · 접수→mat `{14,9 w4}` · gait\|mat `{13,14 h5}` · upper→lower `{13,26 w2}`).
**재활 접수**: baylabel · ireception 접수·평가 `{2,3 w4}` · imonitor `{6,2}` · compcart `{9,2}` · ichair(down) `{13,4}`/`{15,4}`/`{13,6}`/`{15,6}` · iplant `{17,5}`.
**보행 훈련존**: baylabel(hl) · **parallelbars `{2,12 w4}`** · **treadmill `{3,18}`** · **shoulderpulley `{10,11}`** · walkerrack `{9,22 w3}`.
**매트 치료존**: baylabel · **therapymat `{15,13}`/`{15,20}`** · shoulderpulley `{24,11}` · iplant `{25,24}`.
**유산소·근력 존**: baylabel · treadmill `{2,30}`/`{7,30}` · **gymballrack `{2,37}`** · parallelbars `{7,38 w4}`.
**OT ADL 훈련**: baylabel(hl) · adlkitchen `{15,30 w4}` · ibed(ward,이동 훈련) `{20,35}` · gymballrack `{24,37}` · iplant `{25,41}`.

## 핫스팟 (5 — 라벨만)
초기 기능 평가(quest,4,3) · 평행봉 보행 보조(quest,4,13) · 도수 치료·ROM(info,16,13) · 지구력 훈련(info,3,31) · 부엌 일상동작 훈련(quest,16,30).

## NPC 캐스트 (10, idle)
reception doctor+patient · gait patient+nurse · mat nurse+patient · cardio patient+nurse · adl nurse+patient. seed 1061–1070.
