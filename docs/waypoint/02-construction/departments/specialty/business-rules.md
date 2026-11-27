---
artifact: business-rules
build-spec: departments/specialty
updated: 2026-07-18
---

# Specialty OPD — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 specialty 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,8}`+`{0,12,1,29}`(문 y9-11) · 우 `{27,1,1,40}` · bottom `{0,41,28,1}`.
- checkin\|rooms divider(y11): `{1,11,4,1}`·`{7,11,6,1}`·`{15,11,12,1}` — 개구부 x5-6(→안과) / x13-14(→이비인후과).
- eye\|ent 세로 x13: `{13,12,1,11}`.
- upper\|lower divider(y23): `{1,23,4,1}`·`{7,23,6,1}`·`{15,23,12,1}` — 개구부 x5-6(→비뇨) / x13-14(→신경과).
- uro\|neuro 세로 x13: `{13,24,1,17}`.

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: slitlamp `2×1` · phoropterstand `1×1` · enttowerchair `3×2`.
- **신규 비충돌**: visionchart(벽 조명 박스, props에 h 없음).
- **재사용 블로커(props{w,h})**: clinicReception `5×2` · ireception · icabinet(w) · ultrasound `1×1`(props 부여).
- **재사용 자동 footprint**: ibed `2×3` · imonitor · compcart · otoscope.
- **비충돌**: waitingdisplay(벽) · ichair · iplant · baylabel.

## 통행 가드(`specialty-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,10}` 도달 & bottom `{13,41}` 차단 · 5 room 도달 · 4 threshold 통행 · 안과/ENT/비뇨/신경 도달 · 솔리드 차단(enttowerchair `{15,14}`·exam bed `{2,27}`·ultrasound `{6,28}`).
