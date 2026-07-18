---
artifact: business-rules
build-spec: departments/spd
updated: 2026-07-18
---

# SPD / Nutrition / Loading Dock — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 spd 고유(**cols=30 와이드**).

## 벽 (collision rects)
- 외벽: top `{0,0,30,1}` · 좌 `{0,1,1,6}`+`{0,10,1,33}`(문 y7-9) · 우 `{29,1,1,30}`+`{29,37,1,6}`(**하역장 게이트 y31-36 gap**) · bottom `{0,43,30,1}`.
- soiled/sterile\|kitchen divider(y11): `{1,11,5,1}`·`{8,11,6,1}`·`{16,11,13,1}` — 개구부 x6-7/x14-15(→배식).
- soiled\|sterile barrier 세로 x14: `{14,1,1,4}`+`{14,8,1,3}` — **세척→멸균 pass-through y5-7**(sterile threshold).
- kitchen\|dock divider(y25): `{1,25,6,1}`·`{10,25,19,1}` — 개구부 x7-9(→하역장).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: autoclave `2×2` · washerdisinfector `2×2` · foodcartcolumn `1×2` · palletstack `2×1` · cargotruck `2×3`.
- **신규 비충돌**: sterilerack(벽 부착 와이어 랙, props {w}만).
- **재사용 블로커(props{w,h})**: adlkitchen `4×1` · fridge `1×1` · icabinet · ireception.
- **재사용 자동 footprint**: sinkor · soiledcart · wastebin · medcart.
- **비충돌**: shelflabel(벽) · floortape(바닥 안전선) · tint(오버레이) · baylabel.

## 통행 가드(`spd-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,8}` 도달 & bottom `{13,43}` 차단 · 4 room 도달 · 4 threshold 통행 · sterile(세척→멸균 통해)/kitchen/dock 도달 · 솔리드 차단(autoclave `{16,2}`·foodcartcolumn `{2,19}`·cargotruck `{22,31}`).
