---
artifact: business-rules
build-spec: departments/surgward
updated: 2026-07-14
---

# Surgery Ward — Business Rules (collision · 통행 · footprint)

내과 병동([ward/business-rules](../ward/business-rules.md))과 동형 구조. 여기선 surg 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,13}`+`{0,17,1,34}`(← 캠퍼스 문 y14-16) · 우 `{27,1,1,50}` · bottom `{0,51,28,1}`.
- 서비스 y10: `{1,10,4,1}`·`{7,10,6,1}`·`{16,10,11,1}` — 개구부 x5-6 / **x13-15(sterile →처치실)**.
- 린넨\|처치 세로 x9: `{9,1,1,5}`+`{9,9,1,1}`, 개구부 y6-8.
- 스테이션 y20: `{1,20,6,1}`·`{10,20,8,1}`·`{21,20,6,1}` — 개구부 x7-9/x18-20.
- 중증실 y35: `{1,35,9,1}`·`{13,35,14,1}` — 개구부 **x10-12(→중증실)**.

## 커튼
4인실 커튼 3(x8/x16/x23, y22, h11) = props 차단. 각 베이(A/B/C/D)는 y21 개방 복도 + 스테이션 threshold로 접근(테스트로 4베이 도달 보장).

## objectCollision — footprint 정책
- **신규 surg 비충돌**: jpdrain·hemovac(침대 소품)·stapleremover(트레이)·opscheduleboard(벽 보드) → props에 h 없음 → 자동 skip.
- **신규 surg 블로커(props{w,h})**: pcapump `1×2`(폴대) · ngsuction `1×2` · scddevice `2×2` · walkerrack `w×1`.
- **재사용 footprint(기존)**: ibed `2×3` · imonitor/iiv/iplant/vitals/wastebin/suction `1×1` · dressing `2×1`(props) · instrumenttray `2×1`(props) · icabinet/icurtain/sofa/mealcart props · nursestation skip · surgicallight OVERHEAD(비충돌).

## 통행 가드(`surgward-fixture.test.ts`)
playerStart open · 좌측 문 `{1,15}` 도달 & 하단 `{13,51}` 벽 · 5 room 도달 · 7 threshold 통행 · 커튼 `{8,25}`/`{16,25}` 차단 & 4 베이 `{4/11/19/25,27}` 도달 · 중증 병상`{4,39}`·PCA`{6,16}`·SCD`{13,42}` footprint.
