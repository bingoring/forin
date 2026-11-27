---
artifact: business-rules
build-spec: departments/sim
updated: 2026-07-18
---

# Sim Lab / Nursing Admin — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 sim 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,6}`+`{0,10,1,31}`(문 y7-9) · 우 `{27,1,1,40}` · bottom `{0,41,28,1}`.
- admin\|mid divider(y11): `{1,11,4,1}`·`{7,11,6,1}`·`{15,11,12,1}` — 개구부 x5-6/x13-14.
- infection\|debrief 세로 x13: `{13,12,1,13}`.
- mid\|sim divider(y24): `{1,24,6,1}`·`{9,24,18,1}` — 개구부 x7-8(→시뮬랩).
- sim\|booth 원웨이 미러 벽 x18: `{18,25,1,12}`+`{18,38,1,3}` — **staff 도어 y37**(핸드오프 `{18,25,1,17}` 봉인 → 개구부 신설).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: simmanikin `2×3` · officedesk `2×1`.
- **신규 비충돌**: ppeboard(벽 보드, props {w}만) · controlbooth(관찰창+카운터, {w}만 — x18 벽이 차단).
- **재사용 블로커(props{w,h})**: icabinet · coffeetable.
- **재사용 자동 footprint**: watercooler · gownbox · scrubdispenser · wastebin · imonitor · crashcart · ivpump · ventilator.
- **비충돌**: shelflabel(벽 라벨) · walltv(벽) · ichair · iplant · baylabel.

## 통행 가드(`sim-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,8}` 도달 & bottom `{13,41}` 차단 · 5 room 도달 · 4 threshold 통행(staff 도어 `{18,37}` 포함) · infection/debrief/simlab/booth 도달 · 솔리드 차단(simmanikin `{2,28}`·officedesk `{2,3}`).
