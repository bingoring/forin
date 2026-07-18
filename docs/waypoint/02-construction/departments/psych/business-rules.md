---
artifact: business-rules
build-spec: departments/psych
updated: 2026-07-18
---

# Inpatient Psych — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 psych 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,4}`+`{0,7,1,36}`(문 y5-6) · 우 `{27,1,1,42}` · bottom `{0,43,28,1}`.
- sally\|ward divider(y8): `{1,8,5,1}`·`{8,8,19,1}` — 통제문 게이트 x6-7(sterile).
- station\|dayroom 세로 x13: `{13,9,1,2}`(y9-10)+`{13,14,1,10}`(y14-23) — **관찰 gap y11-13**(ObsWindow는 장식·비충돌, 개구부로 통행).
- upper\|lower divider(y23): `{1,23,5,1}`·`{8,23,6,1}`·`{16,23,11,1}` — 개구부 x6-7(→병실) / x14-15(→안정실 sterile).
- rooms\|seclusion 세로 x13: `{13,24,1,19}`.

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: safebed `2×3` · grouptable `2×1`.
- **신규 비충돌**: seclusionpad(바닥 패딩 매트, props {w}만 — 통행 가능) · obswindow(관찰창, {w}만).
- **재사용 블로커(props{w,h})**: icabinet · ireception.
- **재사용 자동 footprint**: compcart · walltv · watercooler.
- **비충돌**: detector(금속탐지 게이트 통과) · nursestation(skip) · deskphone · chartbinder · ichair · iplant · baylabel.

## 통행 가드(`psych-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,6}` 도달 & bottom `{13,43}` 차단 · 5 room 도달 · 4 threshold 통행 · station/dayroom(관찰 gap)/rooms/seclusion 도달 · 솔리드 차단(safebed `{2,27}`·grouptable `{15,12}`).
