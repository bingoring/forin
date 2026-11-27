---
artifact: business-rules
build-spec: departments/rad
updated: 2026-07-18
---

# Radiology — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 rad 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,12}`+`{0,16,1,31}`(문 y13-15) · 우 `{27,1,1,46}` · bottom `{0,47,28,1}`.
- checkin\|hall divider(y10): `{1,10,5,1}`·`{8,10,5,1}`·`{15,10,12,1}` — 개구부 x6-7 / x13-14(→판독).
- checkin\|reading 세로 x13: `{13,1,1,5}`+`{13,9,1,1}` — 개구부 y6-8.
- hall\|scan divider(y17): `{1,17,5,1}`·`{8,17,6,1}`·`{16,17,11,1}` — 개구부 x6-7(→CT) / x14-15(→MRI).
- CT\|MRI 세로 x13: `{13,18,1,11}`.
- scan\|xray divider(y28): `{1,28,10,1}`·`{13,28,14,1}` — 개구부 x11-12(→X-ray).
- 제어 부스: **glass `{11,19 h8}`(CT)·`{12,30 h9}`(X-ray)**(objectCollision 차단).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: ctscanner `3×3` · mriscanner `4×3` · xrayunit `2×2` · controlconsole `2×1` · leadapronrack `1×1`.
- **재사용 블로커(props{w,h})**: glass · ireception.
- **재사용 자동 footprint**: ibed `2×3` · imonitor · vitals · waitingdisplay.
- **비충돌**: pacsviewer(벽 뷰어) · handrail(우측 벽) · ichair · tint(오버레이) · iplant · baylabel.

## 통행 가드(`rad-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,14}` 도달 & bottom `{13,47}` 차단 · 6 room 도달 · 6 threshold 통행 · 판독/CT/MRI/X-ray 도달 & CT 부스 glass `{11,22}` 차단 · 솔리드 차단(ctscanner `{2,21}`·mriscanner `{14,21}`·xrayunit `{4,33}`).
