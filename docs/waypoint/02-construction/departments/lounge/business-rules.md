---
artifact: business-rules
build-spec: departments/lounge
updated: 2026-07-18
---

# Staff Lounge / Locker / Cafeteria — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 lounge 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,11}`+`{0,14,1,25}`(문 y12-13) · 우 `{27,1,1,38}` · bottom `{0,39,28,1}`.
- locker\|lounge divider(y15): `{1,15,5,1}`·`{8,15,5,1}`·`{15,15,12,1}` — 개구부 x6-7(→휴게실)/x13-14(→식당).
- lockerA\|B 세로 x13: `{13,1,1,14}`.
- lounge\|cafe 세로 x13: `{13,16,1,11}`+`{13,28,1,11}` — **도어 y27**(핸드오프 `{13,16,1,23}` 전벽 → A+lounge와 B+cafe 단절이라 개구부 신설).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: vending `1×1` · diningtable `2×1` · serverycounter `4×1`.
- **신규 비충돌**: lockerbank(벽 부착 사물함, props {w}만).
- **재사용 블로커(props{w,h})**: coffeetable · sofa · nursingrecliner `2×2` · coffeemachine `1×1`.
- **재사용 자동 footprint**: sink · watercooler · handsanitizer.
- **비충돌**: walltv(벽) · ichair · iplant · baylabel.

## 통행 가드(`lounge-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,13}` 도달 & bottom `{13,39}` 차단 · 4 room 도달 · 3 threshold 통행(lounge↔cafe 도어 `{13,27}` 포함) · lockerB/lounge/cafe 도달 · 솔리드 차단(vending `{10,17}`·diningtable `{15,23}`·serverycounter `{15,18}`).
