---
artifact: business-rules
build-spec: departments/nursery
updated: 2026-07-18
---

# Nursery — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 nursery 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,4}`+`{0,7,1,34}`(← 엘리베이터 문 y5-6 gap) · 우 `{27,1,1,40}` · bottom `{0,41,28,1}`.
- y8 divider(입구\|병동): `{1,8,5,1}`·`{8,8,19,1}` — sterile 손위생 게이트 x6-7.
- **nursery\|admit 세로 x18**: `{18,9,1,8}`+`{18,19,1,9}` — **doorway y17-18 추가**(핸드오프는 `{18,9,1,19}` 전벽 → admit 봉인이라 개구부 신설).
- y27 divider(상\|하): `{1,27,5,1}`·`{8,27,5,1}` — 개구부 x6-7(→수유실). **ObsWindow 구간 `{13,27,5,1}`**(창이지만 통과 불가 → 벽으로 차단) · `{18,27,9,1}`(x18-26).
- **viewing\|feeding 세로 x13**: `{13,28,1,6}`+`{13,36,1,5}` — **doorway y34-35 추가**(핸드오프는 `{13,28,1,13}` 전벽 → viewing 봉인이라 개구부 신설).

## objectCollision — footprint 정책
- **신규 비충돌**: warmercabinet(벽 캐비닛, props에 h 없음) · obswindow(창 — 위 벽 rect가 차단하므로 오브젝트 자체는 비충돌) · phototherapy(skip-list).
- **신규 블로커(props{w,h})**: bassinet `2×2`(카트) · infantwarmer `2×2` · nursingrecliner `2×2` · icurtain `1×8`(프라이버시 드레이프, 열린 끝 개구).
- **재사용 footprint**: sinkor/scrubdispenser/gownbox/babyscale/milkfridge/compcart/iplant OBJECT_FOOTPRINT · ireception/sofa/coffeetable props · ichair.

## 통행 가드(`nursery-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,6}` 도달 & bottom `{13,41}` 차단 · 5 room 도달 · 4 threshold 통행 · 배시넷존/admit/feeding/viewing 도달 & ObsWindow `{15,27}` 차단 · 솔리드 차단(bassinet `{2,11}`·infantwarmer `{20,12}`·nursingrecliner `{2,31}`).
