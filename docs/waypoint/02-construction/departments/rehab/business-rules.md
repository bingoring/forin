---
artifact: business-rules
build-spec: departments/rehab
updated: 2026-07-18
---

# Rehabilitation PT/OT — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 rehab 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,6}`+`{0,10,1,33}`(문 y7-9) · 우 `{27,1,1,42}` · bottom `{0,43,28,1}`.
- reception\|gym divider(y9): `{1,9,4,1}`·`{9,9,5,1}`·`{18,9,9,1}` — 넓은 개구부 x5-8/x14-17(개방형 gym).
- gait\|mat 세로 x13(부분): `{13,10,1,4}`+`{13,19,1,7}` — 개구부 y14-18(threshold). **h7로 트림**(핸드오프 h8은 y26 lower threshold와 겹침).
- upper\|lower gym divider(y26): `{1,26,12,1}`·`{15,26,12,1}` — 개구부 x13-14. cardio↔adl 사이 세로벽 없음(개방).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: treadmill `2×1` · therapymat `2×1` · gymballrack `2×1`.
- **신규 비충돌**: parallelbars(보행 매트 apparatus, props {w}만 — 통행) · shoulderpulley(벽 도르래).
- **재사용 블로커(props{w,h})**: adlkitchen `4×1` · walkerrack(w) · ibed `2×3`.
- **재사용 자동 footprint**: compcart · imonitor.
- **비충돌**: ireception(데스크는 props로 차단하나 여기 w4h1) · ichair · iplant · baylabel.

## 통행 가드(`rehab-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,8}` 도달 & bottom `{13,43}` 차단 · 5 room 도달 · 4 threshold 통행(th-lower `{13,26}` 포함) · gait/mat/cardio/adl 도달 · 솔리드 차단(treadmill `{3,18}`·therapymat `{15,13}`·adlkitchen `{15,30}`).
