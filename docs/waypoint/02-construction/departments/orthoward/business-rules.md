---
artifact: business-rules
build-spec: departments/orthoward
updated: 2026-07-14
---

# Ortho Ward — Business Rules (collision · 통행 · footprint)

내과·외과 병동과 동형. 여기선 ortho 고유.

## 벽 (collision rects)
- 외벽: top `{0,0,28,1}` · 좌 `{0,1,1,13}`+`{0,17,1,34}`(← 캠퍼스 y14-16) · 우 `{27,1,1,50}` · bottom `{0,51,28,1}`.
- 서비스 y10: `{1,10,3,1}`·`{7,10,5,1}`·`{16,10,11,1}` — 개구부 x4-6 / **x12-15(sterile →석고실, w4)**.
- pt\|cast 세로 x9: `{9,1,1,4}`+`{9,9,1,1}`, 개구부 y5-8.
- 스테이션 y20(**광폭 베이**): `{1,20,5,1}`·`{10,20,6,1}`·`{20,20,7,1}` — 개구부 x6-9 / x16-19(각 w4).
- 고관절 y35: `{1,35,8,1}`·`{13,35,14,1}` — 개구부 **x9-12(→고관절실, w4)**.

## 커튼
4인실 커튼 3(x8/x16/x23, y22, h11) = props 차단. 각 베이는 y21 개방 복도 + 스테이션 광폭 threshold로 접근(테스트로 4베이 도달 보장).

## objectCollision — footprint 정책
- **신규 ortho 비충돌**(props에 h 없음 → 자동 skip): tractionframe(오버헤드 프레임 — 침대가 차단)·castcutter·castrollshelf(벽 선반)·bracerack(벽)·abductionpillow(침대 위)·bedalarm(매트)·cmschart(벽)·pacsviewer는 props{w,h}로 차단(스탠드).
- **신규 ortho 블로커(props{w,h})**: plastertrapsink `2×2` · cpmmachine `2×1` · elevatedtoiletguard `1×1` · pacsviewer `2×1`.
- **surg2 재사용**: walker `1×1`(props) · walkerrack `w×1`(props).
- **재사용 footprint(기존)**: ibed `2×3` · imonitor/iiv/iplant `1×1` · wheelchair `1×2` · dressing `2×1`(props) · icurtain/sofa props · nursestation skip.

## 통행 가드(`ortho-fixture.test.ts`)
playerStart open · 좌측 문 `{1,15}` 도달 & 하단 `{13,51}` 벽 · 5 room 도달 · 7 threshold 통행 · 커튼 `{8,25}`/`{16,25}` 차단 & 4 베이 `{4/11/19/25,27}` 도달 · 고관절 병상`{4,39}`·석고싱크`{15,3}`·CPM`{11,26}` footprint.
