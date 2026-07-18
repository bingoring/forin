---
artifact: business-rules
build-spec: departments/ld
updated: 2026-07-18
---

# L&D — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 ld 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,13}`+`{0,17,1,32}`(← 엘리베이터 문 y14-16 gap) · 우 `{27,1,1,48}` · bottom `{0,49,28,1}`.
- 서비스 스트립 divider(y10): `{1,10,5,1}`·`{8,10,5,1}`·`{15,10,12,1}` — 개구부 x6-7 / x13-14(→복도).
- triage\|anes 세로 x13: `{13,1,1,5}`+`{13,9,1,1}` — 개구부(threshold) y6-8.
- station\|ldr divider(y20): `{1,20,6,1}`·`{10,20,8,1}`·`{21,20,6,1}` — 개구부 x7-9 / x18-20.
- ldr\|lower divider(y35): `{1,35,5,1}`·`{8,35,9,1}`·`{19,35,8,1}` — 개구부 x6-7(→산후) / x17-18(→신생아 sterile).
- postpartum\|nursery: 벽 `{14,36,1,2}` + **glass `{14,38 w1 h11}`**(objectCollision이 유리로 차단).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: birthingbed `3×2`(분만대) · deliverycart `2×1`.
- **재사용 블로커(props{w,h})**: fetalmonitor `2×2` · infantwarmer `2×2` · bassinet `2×2` · nursingrecliner `2×2` · icabinet(w) · ireception `3×1` · icurtain `1×12` · glass `1×11` · handrail `1×8`(우측 벽 겹침, 무해).
- **재사용 자동 footprint**: ibed `2×3` · iiv · imonitor · vitals · compcart · chartbinder · sinkor · iplant.
- **비충돌**: nursestation(skip-list, 개방 well) · deskphone · warmercabinet(벽 캐비닛) · baylabel.

## 통행 가드(`ld-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,15}` 도달 & bottom `{13,49}` 차단 · 6 room 도달 · 7 threshold 통행 · 6구역 도달 & glass `{14,42}` 차단 · 솔리드 차단(birthingbed `{2,23}`·deliverycart `{2,29}`·bassinet `{16,38}`).
