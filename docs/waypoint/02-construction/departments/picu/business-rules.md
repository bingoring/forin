---
artifact: business-rules
build-spec: departments/picu
updated: 2026-07-18
---

# PICU — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 picu 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,4}`+`{0,7,1,36}`(문 y5-6) · 우 `{27,1,1,42}` · bottom `{0,43,28,1}`.
- 전실\|허브 divider(y7): `{1,7,5,1}`·`{8,7,19,1}` — sterile 게이트 x6-7.
- **허브\|방 divider(y17)는 정적 벽 없음** — 유리 전면(glass 오브젝트) + 슬라이딩 도어(door 오브젝트)로 구성. 유리는 objectCollision이 차단, 도어(x3/x12/x21)는 통행.
- **방 유리 divider**: glass `{9,18 w1 h25}`·`{18,18 w1 h25}`(objectCollision 차단).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: picubed `2×3` · pedventilator `1×1` · broselowcart `1×1` · reclinerdaybed `2×2`.
- **유리/도어**: glass props{w,h} 차단 · door skip(통행).
- **재사용 자동 footprint**: bankofmonitors·crashcart·iiv·imonitor·sinkor·iplant.
- **비충돌**: nursestation(skip-list) · ireception(props{w,h}로 차단하되 데스크) · deskphone · gownbox/handsanitizer · tint · baylabel.

## 통행 가드(`picu-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,6}` 도달 & bottom `{13,43}` 차단 · 5 room 도달 · 1 threshold 통행 · 3 유리방 슬라이딩도어 통해 도달 & glass front `{1,17}`·방 divider `{9,30}` 차단 · 솔리드 차단(picubed `{2,22}`·pedventilator `{1,30}`).
