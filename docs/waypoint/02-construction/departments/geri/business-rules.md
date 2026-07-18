---
artifact: business-rules
build-spec: departments/geri
updated: 2026-07-18
---

# Geriatric / Dementia — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 geri 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,6}`+`{0,10,1,33}`(문 y7-9) · 우 `{27,1,1,42}` · bottom `{0,43,28,1}`.
- daycommon\|mid divider(y9): `{1,9,4,1}`·`{8,9,6,1}`·`{17,9,10,1}` — 개구부 x5-7/x14-16.
- station\|reminis 세로 x13: `{13,10,1,4}`+`{13,18,1,5}` — 개구부 y14-17.
- mid\|rooms divider(y22): `{1,22,4,1}`·`{8,22,6,1}`·`{17,22,10,1}` — 개구부 x5-7/x14-16.
- roomA\|roomB 세로 x13: `{13,23,1,20}`.

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: lowbed `2×3` · gerireclinechair `2×2`.
- **신규 비충돌**: handrailwall(벽 부착 손잡이, props {w}만) · orientationboard(벽 게시판, {w}만) · memorybox(벽 회상 상자).
- **재사용 블로커(props{w,h})**: comfortcart `1×1` · sofa · coffeetable.
- **재사용 자동 footprint**: vitals · walltv(벽이지만 footprint 有).
- **비충돌**: nursestation(skip) · deskphone · chartbinder · framedpic · iplant · baylabel.

## 통행 가드(`geri-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,8}` 도달 & bottom `{13,43}` 차단 · 5 room 도달 · 5 threshold 통행 · station/reminis/roomA/roomB 도달 · 솔리드 차단(lowbed `{3,27}`·gerireclinechair `{12,3}`).
