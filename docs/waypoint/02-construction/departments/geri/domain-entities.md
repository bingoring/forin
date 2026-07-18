---
artifact: domain-entities
build-spec: departments/geri
updated: 2026-07-18
---

# Geriatric / Dementia — Domain Entities

`GERI_INTERIOR` (`fixtures/geri.ts`) · 28×44 · floorTheme `peds` · scale 0.9 · playerStart `{4,8}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| station | 노인 간호 스테이션 | `{0,9,14,14}` |
| reminis | 회상 라운지 | `{13,9,15,14}` |
| roomA | 치매 병실 A | `{0,22,14,22}` |
| roomB | 치매 병실 B | `{13,22,15,22}` |
| daycommon | 데이 커먼 · 배회 안전존 | `{0,0,28,10}` |

## Rooms (5)
daycommon `{6,5}` · station `{6,15}` · reminis `{21,15}` · roomA `{6,34}` · roomB `{21,34}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,7 w1 h3}` · threshold(복도 `{5,9 w3}` · 회상실 `{14,9 w3}`/`{13,14 h4}` · 병실 A `{5,22 w3}` · 병실 B `{14,22 w3}`).
**데이 커먼**: baylabel · **handrailwall `{2,1 w8}`**(연속 손잡이) · **orientationboard `{2,3 w3}`** · **gerireclinechair `{12,3}`/`{18,3}`** · coffeetable `{15,4 w2}` · walltv `{23,1 w2}` · iplant `{25,7}`.
**노인 간호 스테이션**: baylabel(hl) · nursestation `{2,13 w9 h5}` · deskphone `{3,13}` · chartbinder `{9,13}` · vitals `{2,19}`.
**회상 라운지**: baylabel · sofa `{15,13 w3}`(#C4A578) · coffeetable `{19,14 w2}` · framedpic `{15,10 w2}`/`{21,10 w2}` · comfortcart `{23,13}` · iplant `{25,20}`.
**치매 병실 A**: baylabel · **memorybox `{1,24}`** · **lowbed(occ) `{3,27}`/`{9,27}`** · gerireclinechair `{3,38}` · framedpic `{11,23 w1}`.
**치매 병실 B**: baylabel · memorybox `{14,24}` · lowbed(occ) `{16,27}` · lowbed `{22,27}` · gerireclinechair `{16,38}` · iplant `{25,42}`.

## 핫스팟 (5 — 라벨만)
현실 인식 날짜·계절(info,3,3) · 배회·낙상 관찰(info,6,15) · 추억 회상 요법(info,16,14) · 초저상 낙상 사정(quest,4,27) · 야간 배회 관찰(info,17,27).

## NPC 캐스트 (10, idle)
daycommon patient×2 · station nurse+doctor · reminis patient+visitor · roomA nurse+patient · roomB nurse+visitor. seed 1021–1030.
