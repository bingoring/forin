---
artifact: business-rules
build-spec: departments/morgue
updated: 2026-07-18
---

# Morgue & Autopsy — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 morgue 고유(28×40 · 4구역 분할).

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,4}`+`{0,7,1,32}`(**엘리베이터 문 y5-6**) · 우 `{27,1,1,38}` · bottom `{0,39,28,1}`.
- 접수\|냉장·부검 divider(y8): `{1,8,5,1}`·`{8,8,5,1}`·`{15,8,12,1}` — 개구부 x6-7(→냉장실)/x13-14(→부검실).
- **cold\|autopsy 세로 x13**: `{13,9,1,17}`(y9-25).
- 냉장·부검\|참관·기계 divider(y25): `{1,25,5,1}`·`{8,25,6,1}`·`{16,25,11,1}` — 개구부 x6-7(→참관실)/x14-15(→기계실).
- **viewing\|mech 세로 x14**: `{14,26,1,13}`(y26-38).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: cadaverfridge `4×2` · autopsytable `3×2` · viewingbier `2×1`.
- **재사용 블로커(props{w,h})**: ireception `5×1` · wastebin(props tone만 → 자동) · autoclave `2×2`.
- **재사용 자동 footprint(OBJECT_FOOTPRINT)**: gurney `2×3` · sinkor `2×2` · instrumenttray `2×1` · wastebin.
- **비충돌**: baylabel · tint(오버레이) · icabinet(equipment, props{w}만·벽 부착) · monitor · chair · plant · chartbinder · deskphone · handsanitizer.

> 참고: 냉장 뱅크 3기는 x6 통로(2·11 뱅크와 7·11 뱅크 사이)와 x11-12를 남겨 냉장실 하부까지 도달. 부검대는 x14 진입 통로를 막지 않음(x15부터).

## 통행 가드(`morgue-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,6}` 도달 & bottom `{13,39}` 차단 · 5 room 도달 · 4 threshold 통행 · cold/autopsy/viewing/mech 도달(참관←cold, 기계←autopsy 경유) · 솔리드 차단(cadaverfridge `{2,11}`·autopsytable `{15,12}`·autoclave `{15,32}`).
