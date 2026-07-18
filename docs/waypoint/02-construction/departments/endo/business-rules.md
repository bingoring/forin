---
artifact: business-rules
build-spec: departments/endo
updated: 2026-07-18
---

# Endoscopy — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 endo 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,6}`+`{0,10,1,33}`(문 y7-9) · 우 `{27,1,1,42}` · bottom `{0,43,28,1}`.
- checkin\|mid divider(y9): `{1,9,4,1}`·`{7,9,6,1}`·`{15,9,12,1}` — 개구부 x5-6(→전처치) / x13-14(→재처리 sterile).
- prep\|reproc 세로 x13: `{13,10,1,16}`.
- mid\|proc divider(y26): `{1,26,5,1}`·`{8,26,6,1}`·`{16,26,11,1}` — 개구부 x6-7(→시술1) / x14-15(→시술2).
- proc1\|proc2 세로 x13: `{13,27,1,16}`.

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: procedurebed `3×1` · endotower `2×1` · scopewasher `2×1` · scopecabinet `2×1`.
- **재사용 자동 footprint**: ibed `2×3` · oxygen · suction · sinkor · wastebin · imonitor · iiv.
- **재사용 블로커(props{w,h})**: icurtain `11×1`(가로 드레이프) · ireception.
- **비충돌**: ichair · iplant · baylabel.

## 통행 가드(`endo-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,8}` 도달 & bottom `{13,43}` 차단 · 5 room 도달 · 4 threshold 통행 · prep/reproc/proc1/proc2 도달 · 솔리드 차단(procedurebed `{2,31}`·endotower `{2,37}`·scopewasher `{14,13}`).
