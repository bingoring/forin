---
artifact: domain-entities
build-spec: departments/lounge
updated: 2026-07-18
---

# Staff Lounge / Locker / Cafeteria — Domain Entities

`LOUNGE_INTERIOR` (`fixtures/lounge.ts`) · 28×40 · floorTheme `clinical` · scale 0.9 · playerStart `{4,14}`.

## Regions (4)
| id | 이름 | bounds |
|---|---|---|
| lockerA | 락커룸 A · 탈의 | `{0,0,14,16}` |
| lockerB | 락커룸 B · 탈의 | `{13,0,15,16}` |
| lounge | 의료진 휴게실 | `{0,15,14,25}` |
| cafe | 직원 식당 (배식·식사) | `{13,15,15,25}` |

## Rooms (4)
lockerA `{6,8}` · lockerB `{20,8}` · lounge `{6,28}` · cafe `{20,28}`.

## 오브젝트 배치 (v16 1:1 + lounge↔cafe 도어)
**구조**: door `d-elev{0,12 w1 h2}` · threshold(휴게실 `{6,15}` · 식당 `{13,15}` · **lounge↔cafe `{13,27}`**(신설)).
**락커룸 A**: baylabel(hl) · **lockerbank `{2,2 w3}`/`{7,2 w3}`/`{2,9 w3}`** · coffeetable(벤치) `{7,9 w2}` · handsanitizer `{11,2}`.
**락커룸 B**: baylabel · lockerbank `{15,2 w3}`/`{19,2 w3}`/`{23,2 w3}` · coffeetable `{18,9 w2}` · sink `{24,9}`.
**의료진 휴게실**: baylabel · walltv `{3,16 w2}` · sofa `{2,20 w3}`(#C0A6B8)/`{2,25 w3}`(#8FA9C4) · coffeetable `{6,22 w2}` · **vending `{10,17}`** · coffeemachine `{11,22}` · watercooler `{11,26}` · nursingrecliner `{2,31}`/`{7,31}` · iplant `{11,36}`.
**직원 식당**: baylabel · **serverycounter `{15,18 w4}`** · coffeemachine `{24,17}` · **diningtable `{15,23}`/`{21,23}`/`{15,30}`/`{21,30}`** · ichair(up)×8 `{15/17/21/23,26}`·`{15/17/21/23,33}` · iplant `{25,36}`.

## 핫스팟 (4 — 라벨만)
근무복 환복(quest,3,2) · 탈의·정리(info,16,2) · 교대 휴식(info,4,20) · 배식·식사(quest,16,18).

## NPC 캐스트 (9, idle)
lockerA nurse+doctor · lockerB nurse×2 · lounge nurse+doctor · cafe nurse+doctor+nurse. seed 1101–1109.
