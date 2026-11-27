---
artifact: domain-entities
build-spec: departments/spd
updated: 2026-07-18
---

# SPD / Nutrition / Loading Dock — Domain Entities

`SPD_INTERIOR` (`fixtures/spd.ts`) · **30**×44 · floorTheme `pharma` · scale 0.9 · playerStart `{4,8}`.

## Regions (4)
| id | 이름 | bounds |
|---|---|---|
| soiled | 오염 세척 구역 (Decon) | `{0,0,15,12}` |
| sterile | 멸균 · 보관 구역 | `{14,0,16,12}` |
| kitchen | 영양팀 · 배식실 | `{0,11,30,15}` |
| dock | 화물 하역장 (Loading Dock) | `{0,25,30,19}` |

## Rooms (4)
soiled `{6,6}` · sterile `{22,6}` · kitchen `{8,18}` · dock `{8,35}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,7 w1 h3}`(← 엘리베이터) · door `d-dock{29,31 w1 h6}`(하역장 게이트, 우측) · threshold(배식 `{6,11}`/`{14,11}` · **세척→멸균 `{14,5 h3}` sterile**(pass-through) · 하역장 `{7,25 w3}`).
**오염 세척**: baylabel(hl) · sinkor `{2,2}` · **washerdisinfector `{6,2}`** · soiledcart `{10,3}` · wastebin(infectious) `{2,7}`.
**멸균·보관**: baylabel · **autoclave `{16,2}`/`{20,2}`** · **sterilerack `{24,3 w3}`/`{16,8 w4}`**.
**영양팀 배식실**: baylabel · adlkitchen `{2,14 w4}` · fridge `{7,14}` · **foodcartcolumn `{2,19}`/`{5,19}`/`{8,19}`/`{20,19}`/`{23,19}`** · ireception 식단검수 `{12,14 w5}` · shelflabel DIET ORDERS `{19,13}` · icabinet(supply) `{19,14 w4}`/`{23,14 w4}`.
**화물 하역장**: tint `{1,26 w28 h16}`(#9CA3AF 저조도) · baylabel · **palletstack `{2,30}`/`{6,30}`/`{2,37}`** · **cargotruck `{22,31}`** · medcart `{12,33}` · floortape 안전선 `{1,41 w20}`.

## 핫스팟 (4 — 라벨만)
기구 세척·소독 사이클(quest,7,3) · 오토클레이브·팩 검수(quest,17,3) · 치료식 트레이 준비(info,12,14) · 물류 입·출고 검수(info,12,33).

## NPC 캐스트 (6, idle)
soiled nurse · sterile nurse · kitchen nurse×2 · dock nurse+visitor. seed 1121–1126.
