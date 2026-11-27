---
artifact: business-rules
build-spec: departments/pharma
updated: 2026-07-12
---

# Pharmacy — Business Rules (collision · 통행 · footprint)

공통 규약은 [er/business-rules](../er/business-rules.md). 여기선 pharma 고유 규칙만.

## 벽 (collision rects)
- 외벽: top `{0,0,36,1}` · 좌 `{0,1,1,3}`+`{0,6,1,35}`(간호사문 y4-5 gap) · 우 `{35,1,1,40}` · bottom `{0,41,15,1}`+`{18,41,18,1}`(캠퍼스문 x15-17 gap).
- **y12 divider**(허브|조제실/전실): `{1,12,5,1}`·`{8,12,12,1}`·`{22,12,13,1}` — 개구부 STAFF `x6-7`, 무균전실 `x20-21`.
- **x21 divider**(조제실|무균조제실): **`{21,20,1,21}`**(y20-40만). ⚠ 핸드오프 원본은 y13-40 → 무균 전실 밀봉 버그 → y20+로 보정([index §7](build-spec-index.md)).
- **마약류 alcove**: `{1,28,4,1}`·`{7,28,6,1}`(개구부 x5-6)·`{12,29,1,12}`(우측벽 y29-40).

## 청정 단계 게이팅
- 무균 전실↔무균 조제실은 **유리벽(glass)** 으로 분리: `g-ante1{22,19 w5}`·`g-ante2{29,19 w6}` 차단, 사이 **에어샤워 threshold `{27,28→ x27-28}`** 만 통행. 즉 조제실 안쪽(항암/TPN)은 전실 경유 필수.
- 카운터 배리어 `g-counter{1,3 w11}` + `pharmacounter{1,4 w11 h1}` = 창구 뒤(y3-4 x1-11) 차단 → 환자/간호사는 앞(y5+)에서만 응대.

## objectCollision — footprint 정책
`engine/footprint.ts`:
- **skip(비충돌)** 신규 추가: `countersign · shelflabel · floortape · tackymat · wallphone · magnehelicgauge · chemospillkit · barcodescanner · medwallshelf` (걸이 사인·라벨·바닥테이프·매트·벽부착·카운터탑·벽면 약장 = 시각 span, 충돌 아님).
- **블로커**는 fixture에서 `props{w,h}` 부여 → objectCollision가 그 rect 차단: pharmacounter `11×1` · glass(배리어/전실) · returnbox `1×1` · pneumatictube `2×1` · tubecapsulerack `2×1` · fridgepharma `1×1` · atcmachine `2×2` · lasashelf `3×1` · icabinet `3×1`(×4) · ireception 검수대 `4×1` · medcart `2×1` · narcoticsvault `2×2` · bsc `2×2`(×2) · centrifuge `1×1` · printlabel `2×1`.
- 재사용 공용(sinkor `2×2`·imonitor `1×1`·iplant `1×1`)은 기존 `OBJECT_FOOTPRINT`. 벽부착 공용(gownbox·scrubdispenser·sanitizer·chartbinder)은 footprint 없음 = 비충돌.

## 통행 가드(테스트로 고정 — `pharma-fixture.test.ts`)
playerStart open · 캠퍼스문 도착타일 `{16,40}` open+도달 · 7 room nearestOpen 도달 · 모든 threshold 통행+도달 · 전실 유리벽 `{23,19}`/`{31,19}` 차단·에어샤워 `{27,19}` 통행 · 카운터 `{5,3}`/`{5,4}` 차단·앞 로비 `{6,9}` 도달 · 금고 `{2,32}`/ATC `{2,16}` 차단·금고 옆 `{4,33}` 도달.
