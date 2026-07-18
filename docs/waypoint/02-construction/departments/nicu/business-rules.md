---
artifact: business-rules
build-spec: departments/nicu
updated: 2026-07-18
---

# NICU — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 nicu 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,4}`+`{0,7,1,36}`(문 y5-6) · 우 `{27,1,1,42}` · bottom `{0,43,28,1}`.
- 전실\|병동 divider(y8): `{1,8,5,1}`·`{8,8,19,1}` — sterile 게이트 x6-7.
- station\|resus 세로 x13: `{13,9,1,4}`+`{13,17,1,5}` — 개구부(threshold) y13-16.
- mid\|pods divider(y21): `{1,21,5,1}`·`{8,21,6,1}`·`{16,21,11,1}` — 개구부 x6-7(→A) / x14-15(→B).
- pod A\|B: **glass `{13,22 w1 h21}`**(objectCollision 차단).

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: nicuisolette `2×2` · giraffewarmer `2×2` · cpapunit `1×1`.
- **신규 비충돌**: phototherapyled(오버헤드 LED, props에 h 없음 → skip).
- **재사용 블로커(props{w,h})**: nursingrecliner `2×2` · glass `1×21`.
- **재사용 자동 footprint**: bankofmonitors·crashcart·milkfridge·imonitor·sinkor·iplant.
- **비충돌**: nursestation(skip-list) · deskphone · gownbox/scrubdispenser/handsanitizer(전실 부착) · tint(오버레이) · baylabel.

## 통행 가드(`nicu-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,6}` 도달 & bottom `{13,43}` 차단 · 5 room 도달 · 4 threshold 통행 · station/resus/A/B 도달 & glass `{13,30}` 차단 · 솔리드 차단(nicuisolette `{2,27}`·giraffewarmer `{16,12}`).
