---
artifact: business-rules
build-spec: departments/ward
updated: 2026-07-13
---

# Ward — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 ward 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌우 `{0,1,1,50}`/`{27,1,1,50}` · bottom `{0,51,12,1}`+`{15,51,13,1}`(캠퍼스 문 x12-14 gap).
- **서비스 스트립 y10**: `{1,10,4,1}`·`{7,10,6,1}`·`{15,10,6,1}`·`{23,10,4,1}` — 개구부 x5-6/x13-14/x21-22.
- **세로 분리벽 x9·x18**: `{9,1,1,5}`+`{9,9,1,1}` / `{18,1,1,5}`+`{18,9,1,1}` — 개구부(threshold) y6-8. (린넨\|클린\|더티 구분)
- **스테이션 y20**: `{1,20,6,1}`·`{10,20,8,1}`·`{21,20,6,1}` — 개구부 x7-9/x18-20.
- **하단 y35**: `{1,35,5,1}`·`{8,35,11,1}`·`{21,35,6,1}` — 개구부 x6-7(→1인실)/x19-20(→격리).
- **1인실\|격리 분리벽 x13**: `{13,36,1,15}`(y36-50).

## 커튼 · 격리
- 4인실 커튼 3개 `icurtain{x8/x16/x23, y22, w1, h11}` = **props로 차단**(세로 분리). 각 베이(A x0-7 / B x9-15 / C x17-22 / D x24-27)는 **y21 개방 복도 행 + 스테이션 threshold**로 접근(커튼은 y22부터). 테스트로 4 베이 도달 보장.
- VRE 격리실: 분리벽 x13으로 1인실과 격리. 진입은 하단 threshold x19-20. 격리 사인(isosign)·격리 카트(isolationcart)·전용 혈압계(dedicatedbp).

## objectCollision — footprint 정책
- **신규 ward 타입은 대부분 비충돌**: o2flowmeter·fallrisksign·npoboard·isosign·deskphone·sharpsbin·handrail·walltv는 props에 `h` 없음(또는 props 없음) → `objectCollision`이 자동 skip(w·h 둘 다 필요). footprint.ts 편집 불필요.
- **블로커는 fixture props{w,h}**: mealcart `2×2` · supplybasketshelf `w×1` · ivstoragecart `2×2` · sluicesink `2×2` · linenhamper `1×1` · nebulizer/airmattress `1×1` · isolationcart `2×2` · dedicatedbp `1×2` · sofa `3×2` · icabinet `w×1` · icurtain `1×11`.
- **재사용 footprint**: ibed `2×3` · imonitor/iiv/iplant/vitals/wastebin `1×1`(기존 OBJECT_FOOTPRINT). `nursestation`은 skip 목록(ㄷ-데스크 open well = 보행 가능).

## 통행 가드(`ward-fixture.test.ts`)
playerStart open · 엘리베이터 도착 `{12,50}` open+도달 · 7 room 도달 · 10 threshold 통행+도달 · 커튼 `{8,25}`/`{16,25}` 차단 & 4 베이 앞 `{4/11/19/25,27}` 도달 · 분리벽 `{13,44}` 차단 & 1인실/격리 도달 · 병상`{9,24}`/싱크`{19,3}`/격리카트`{15,37}` footprint.
