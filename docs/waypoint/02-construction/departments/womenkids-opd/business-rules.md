---
artifact: business-rules
build-spec: departments/womenkids-opd
updated: 2026-07-18
---

# Women & Kids OPD — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 womenkids-opd 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,12,1}`+`{15,0,13,1}`(↓ 캠퍼스 문 x12-14 gap, 상단) · 좌 `{0,1,1,38}` · 우 `{27,1,1,38}` · bottom `{0,39,28,1}`.
- y9 divider(로비\|중단): `{1,9,5,1}`·`{8,9,5,1}`·`{15,9,12,1}` — 개구부 x6-7(→놀이) / x13-14(→소아외래).
- play\|pedopd 세로 x13: `{13,10,1,15}`.
- y24 divider(중단\|하단): `{1,24,5,1}`·`{8,24,6,1}`·`{16,24,11,1}` — 개구부 x6-7(→산부인과) / x14-15(→초음파).
- obopd\|usroom 세로 x14: `{14,25,1,14}`.

## objectCollision — footprint 정책
- **신규 블로커(props{w,h})**: fetalmonitor `2×2`(CTG 카트).
- **재사용 블로커(props{w,h})**: clinicReception `5×2` · ireception `3×1`(진료 데스크).
- **재사용 자동 footprint**: ibed `2×3`(OBJECT_FOOTPRINT) · ultrasound·babyscale·stadiometer·watercooler·smallslide·rockinghorse·toychest·blocks·imonitor·iplant.
- **비충돌(skip-list/무 footprint)**: playmat(바닥 오버레이) · mural(벽화) · tonguejar/stickerroll(소품) · ichair.

## 통행 가드(`womenkids-fixture.test.ts`, 6)
playerStart open · 상단 문 `{13,1}` 도달 & bottom `{13,39}` 차단 · 5 room 도달 · 4 threshold 통행 · play/pedopd/obopd/usroom 도달 · 솔리드 차단(clinicReception `{2,3}`·ibed `{15,12}`·fetalmonitor `{5,28}`).
