---
artifact: business-rules
build-spec: departments/infusion
updated: 2026-07-18
---

# Infusion Center — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 infusion 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,4}`+`{0,7,1,32}`(← 엘리베이터 문 y5-6 gap) · 우 `{27,1,1,38}` · bottom `{0,39,28,1}`.
- y8 divider(접수\|베이): `{1,8,5,1}`·`{8,8,11,1}`·`{21,8,6,1}` — 개구부 x6-7(→베이) / x19-20(→격리, sterile).
- bay\|private 세로 x19: `{19,9,1,20}`.
- y28 divider(베이\|휴게): `{1,28,5,1}`·`{8,28,5,1}` — 개구부 x6-7(→휴게). x13-27은 벽 없음 → 스테이션이 베이/격리와 상단 개방(간호 동선).
- nourish\|station 세로 x13: `{13,28,1,11}`.

## objectCollision — footprint 정책
- **신규 비충돌**(props에 h 없음 → 자동 skip): ppestation(벽 부착 방호구 보드).
- **신규 블로커(props{w,h})**: infusionchair `2×2`(리클라이너, 시각 2.6×3.4 축소 — 휠체어 통로 확보) · smartinfusionpump `1×1`(폴대) · coffeemachine `1×1`.
- **재사용 footprint**: nursestation는 skip-list(개방 well, 비충돌) · crashcart/compcart/watercooler/medfridge/pneumatictube/imonitor/iplant OBJECT_FOOTPRINT · ireception/icabinet/coffeetable props.
- **nursestation**(`{15,31 w9 h5}`)는 objectCollision skip 대상 — 플레이어가 데스크 안에 서므로 미차단.

## 통행 가드(`infusion-fixture.test.ts`, 6)
playerStart open · 좌측 문 `{1,6}` 도달 & bottom `{13,39}` 차단 · 5 room 도달 · 3 threshold 통행 · bay/private/nourish/station 대표 타일 도달 · 솔리드 차단(infusionchair `{2,11}`·smartinfusionpump `{5,11}`·coffeemachine `{4,31}`).
