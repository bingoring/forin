---
artifact: domain-entities
build-spec: departments/hospice
updated: 2026-07-18
---

# Hospice / Palliative — Domain Entities

`HOSPICE_INTERIOR` (`fixtures/hospice.ts`) · 28×44 · floorTheme `peds` · scale 0.9 · playerStart `{4,8}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| station | 완화 케어 스테이션 | `{0,9,14,14}` |
| reflection | 명상 · 추모실 | `{13,9,15,14}` |
| room1 | 1인 완화 병실 A | `{0,22,14,22}` |
| sunroom | 정원뷰 선룸 · 병실 B | `{13,22,15,22}` |
| lounge | 가족 라운지 · 키친 | `{0,0,28,10}` |

## Rooms (5)
lounge `{6,5}` · station `{6,15}` · reflection `{20,15}` · room1 `{6,34}` · sunroom `{21,34}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,7 w1 h3}` · threshold(복도 `{5,9 w3}` · 명상실 `{14,9 w3}`/`{13,14 h4}` · 병실 A `{5,22 w3}` · 선룸 B `{14,22 w3}`).
**가족 라운지·키친**: baylabel · **adlkitchen `{2,2 w3}`** · fridge `{6,2}` · watercooler `{8,2}` · sofa `{12,3 w3}` · coffeetable `{16,4 w2}` · reclinerdaybed `{19,3}` · framedpic `{13,1 w2}` · iplant `{25,2}`.
**완화 케어 스테이션**: baylabel(hl) · nursestation `{2,13 w9 h5}` · deskphone `{3,13}` · chartbinder `{9,13}` · **comfortcart `{2,19}`**.
**명상·추모실**: tint `{14,10 w13 h12}`(#2A2440 저조도) · baylabel · sofa `{15,13 w2}`/`{20,13 w2}` · coffeetable `{17,17 w2}` · framedpic `{23,11 w2}` · iplant `{25,19}`.
**완화 병실 A**: baylabel · **hospicebed(occ) `{2,26}`** · **syringedriver `{7,27}`** · imonitor `{1,26}` · reclinerdaybed `{2,37}` · framedpic `{9,23 w2}` · iplant `{11,30}`.
**정원뷰 선룸 B**: glass `{26,24 h18}`(정원뷰) · tint `{20,24 w7 h18}`(#EAF6DE) · baylabel · hospicebed(occ) `{15,27}` · syringedriver `{20,28}` · iplant `{24,26}`/`{24,33}`/`{24,40}` · reclinerdaybed `{15,38}`.

## 핫스팟 (5 — 라벨만)
가족 휴식 공간(info,13,4) · 통증·증상 관리(info,6,15) · 조용한 성찰(info,17,14) · 지속주입 통증 조절(quest,3,26) · 임종 돌봄·존엄 케어(info,16,27).

## NPC 캐스트 (9, idle)
lounge parent+visitor · station nurse+doctor · reflection visitor · room A nurse+parent · sunroom nurse+visitor. seed 1001–1009.
