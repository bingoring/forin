---
artifact: business-rules
build-spec: departments/onco
updated: 2026-07-18
---

# Oncology / BMT — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 onco 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,13}`+`{0,17,1,32}`(문 y14-16) · 우 `{27,1,1,48}` · bottom `{0,49,28,1}`.
- 서비스 스트립(y10): `{1,10,5,1}`·`{8,10,5,1}`·`{15,10,12,1}` — 개구부 x6-7/x13-14.
- verify\|quiet 세로 x13: `{13,1,1,5}`+`{13,9,1,1}` — 개구부 y6-8.
- station\|infusion divider(y19): `{1,19,7,1}`·`{11,19,7,1}`·`{21,19,6,1}` — 개구부 x8-10/x18-20.
- infusion\|bmt divider(y34): `{1,34,3,1}`·`{5,34,4,1}`·`{9,34,18,1}` — **전실 게이트 x4**(handoff x8 봉인 → 이동).
- ante\|bmt: 벽 `{8,35,1,2}` + 에어록 Th `{8,37 h2}` + glass `{8,39 h10}`.
- BMT room1\|room2: glass `{18,36 h7}`+`{18,44 h5}` + **sterile 도어 `{18,43}`**(handoff 봉인 → 신설).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: fridge `1×1`.
- **신규 비충돌**: bmtpod(HEPA 천장 헤더, z=1) · chemohazardbin(소형 폐기통, props無).
- **재사용 블로커(props{w,h})**: infusionchair `2×2` · smartinfusionpump `1×1` · glass · ibed `2×3` · icabinet · sofa · coffeetable · ireception.
- **재사용 자동 footprint**: imonitor · compcart · watercooler · sinkor.
- **비충돌**: nursestation(skip) · warmercabinet/ppestation/walltv/framedpic(벽) · deskphone · chartbinder · handrail · handsanitizer · iplant · baylabel.

## 통행 가드(`onco-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,15}` 도달 & bottom `{13,49}` 차단 · 6 room 도달 · 7 threshold 통행 · verify/quiet/infusion/ante/bmt 도달 & BMT room glass `{18,42}` 차단 · 솔리드 차단(infusionchair `{2,22}`·bmt bed `{10,40}`·fridge `{10,6}`).
