---
artifact: business-rules
build-spec: departments/dial
updated: 2026-07-18
---

# Hemodialysis — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 dial 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,6}`+`{0,10,1,33}`(문 y7-9) · 우 `{27,1,1,42}` · bottom `{0,43,28,1}`.
- checkin\|floor divider(y9): `{1,9,5,1}`·`{9,9,18,1}` — 개구부 x6-8(→치료실).
- floor\|support divider(y34): `{1,34,5,1}`·`{8,34,6,1}`·`{16,34,11,1}` — 개구부 x6-7(→수처리) / x14-15(→격리 sterile).
- water\|iso 세로 x13: `{13,35,1,8}`.

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: dialysischair `2×2` · dialysismachine `1×1` · rowaterunit `2×2`.
- **재사용 자동 footprint**: compcart · sinkor · stadiometer · wastebin · imonitor.
- **재사용 블로커(props{w,h})**: ireception.
- **비충돌**: nursestation(skip-list, 중앙 아일랜드) · ichair · iplant · baylabel.

## 통행 가드(`dial-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,8}` 도달 & bottom `{13,43}` 차단 · 4 room 도달 · 3 threshold 통행 · 치료실/수처리/격리 도달 · 솔리드 차단(dialysischair `{2,13}`·dialysismachine `{6,13}`·rowaterunit `{2,38}`).
