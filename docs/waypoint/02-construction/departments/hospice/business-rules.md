---
artifact: business-rules
build-spec: departments/hospice
updated: 2026-07-18
---

# Hospice / Palliative — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 hospice 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,6}`+`{0,10,1,33}`(문 y7-9) · 우 `{27,1,1,42}` · bottom `{0,43,28,1}`.
- lounge\|mid divider(y9): `{1,9,4,1}`·`{8,9,6,1}`·`{17,9,10,1}` — 개구부 x5-7/x14-16.
- station\|reflection 세로 x13: `{13,10,1,4}`+`{13,18,1,5}` — 개구부 y14-17.
- mid\|rooms divider(y22): `{1,22,4,1}`·`{8,22,6,1}`·`{17,22,10,1}` — 개구부 x5-7/x14-16.
- roomA\|sunroom 세로 x13: `{13,23,1,20}`.

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: hospicebed `2×3` · adlkitchen `3×1` · comfortcart `1×1` · syringedriver `1×1`.
- **재사용 블로커(props{w,h})**: reclinerdaybed `2×2` · fridge `1×1` · sofa · coffeetable · glass(정원뷰).
- **재사용 자동 footprint**: watercooler · imonitor.
- **비충돌**: nursestation(skip) · deskphone · chartbinder · framedpic(벽) · tint(오버레이) · iplant · baylabel.

## 통행 가드(`hospice-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,8}` 도달 & bottom `{13,43}` 차단 · 5 room 도달 · 5 threshold 통행 · station/reflection/roomA/sunroom 도달 & 정원뷰 glass `{26,30}` 차단 · 솔리드 차단(hospicebed `{2,26}`·adlkitchen `{2,2}`·reclinerdaybed `{19,3}`).
