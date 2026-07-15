---
artifact: business-rules
build-spec: departments/dermcenter
updated: 2026-07-15
---

# Derm Center — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 derm 고유.

## 벽 (collision rects)
- 외벽: top **`{0,0,13,1}`+`{16,0,12,1}`(↓ 캠퍼스 문 x13-15 gap, 상단)** · 좌 `{0,1,1,50}` · 우 `{27,1,1,50}` · bottom `{0,51,28,1}`.
- y13 divider(로비\|진료): `{1,13,4,1}`·`{8,13,5,1}`·`{16,13,11,1}` — 개구부 x5-7 / x13-15.
- exam1\|exam2 세로 x13: `{13,14,1,4}`+`{13,21,1,5}` — 개구부(threshold) y18-20.
- y25 divider(진료\|광선): `{1,25,6,1}`·`{10,25,17,1}` — 개구부 x7-9.
- y37 divider(광선\|레이저): `{1,37,6,1}`·`{10,37,17,1}` — 개구부 x7-9(sterile).

## objectCollision — footprint 정책
- **신규 derm 비충돌**(props에 h 없음 → 자동 skip): woodslamp(핸드헬드)·biopsybottle(소품)·lesionchart(벽)·skinanatomy(벽)·walltv(벽).
- **신규 derm 블로커(props{w,h})**: dermatoscope `1×2`(스탠드) · uvbooth `2×3`(부스) · handuvbox `1×1` · gogglesanitizer `1×1` · biopsykit `1×1`(메이요) · cryotank `1×2` · co2laser `1×2`.
- **재사용 footprint**: clinicReception `6×2`(props) · ibed `2×3` · imonitor/iplant/watercooler `1×1` · ireception/icabinet/dressing/sofa/coffeetable props · surgicallight OVERHEAD(비충돌).

## 통행 가드(`dermcenter-fixture.test.ts`)
playerStart open · 상단 문 `{14,1}` 도달 · 5 room 도달 · 6 threshold 통행 · exam divider `{13,15}` 차단 & 양 진료실 도달 · 접수`{3,3}`·UV부스`{3,29}`·수술의자`{4,42}` footprint.
