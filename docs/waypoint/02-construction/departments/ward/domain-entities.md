---
artifact: domain-entities
build-spec: departments/ward
updated: 2026-07-13
---

# Ward — Domain Entities

`WARD_INTERIOR` (`fixtures/ward.ts`) · 28×52 · floorTheme `internal` · scale 0.9 · playerStart `{4,15}` (v14: 좌측 ← 캠퍼스 문 앞).

## Regions (7)
| id | 이름 | bounds |
|---|---|---|
| linen | 린넨실 · 배식실 | `{0,0,10,11}` |
| clean | Clean Utility · 물품 | `{9,0,10,11}` |
| dirty | Dirty Utility · 오염 | `{18,0,10,11}` |
| private | 1인실 | `{0,35,14,17}` |
| iso | VRE 접촉 격리실 | `{13,35,15,17}` |
| room4 | 4인용 일반 병실 | `{0,20,28,16}` |
| station | 중앙 간호 스테이션 | `{0,10,28,11}` |
> 순서는 비-load-bearing(regionAt 최소면적 규칙). 명료성 위해 작은 방 먼저.

## Rooms (fast-travel, 7)
linen `{4,5}` · clean `{13,5}` · dirty `{22,5}` · station `{13,15}` · room4 `{13,27}` · private `{6,44}` · iso `{21,44}`.

## 오브젝트 배치 (핸드오프 1:1)
**구조**: door `d-campus{0,14 w1 h3}`(← 캠퍼스, v14 좌측) · threshold 10(서비스 x5-6/x13-14/x21-22, 세로 x9·x18 y6-8, 스테이션 x7-9/x18-20, 하단 x6-7 →1인실 / x19-20 →격리) · 커튼 3(x8/x16/x23, y22-32) · 격리 사인.

**린넨·배식**: baylabel · icabinet(linen)×2 `{1,2}`·`{5,2}` + supply `{6,6}` · mealcart `{2,5}`.
**Clean Utility**: baylabel · supplybasketshelf `{10,2 w4 s4}` · ivstoragecart `{10,6}` · ireception 투약준비 `{14,7 w3}` · barcodescanner `{16,6}`.
**Dirty Utility**: baylabel · sluicesink `{19,3}` · wastebin(infectious) `{22,2}` · sharpsbin `{24,2}` · linenhamper soiled `{19,6}`/clean `{22,6}`.
**간호 스테이션**: baylabel(highlight) · handrail 세로 `{1,11 w8}`·`{27,11 w8}` · nursestation ㄷ-데스크 `{8,12 w12 h5}` · pneumatictube `{5,11}` · chartbinder `{20,12}` · deskphone `{9,12}`·`{17,12}` · vitals `{3,16}`·`{23,16}`.
**4인실**: baylabel · A: ibed`{2,23}`+o2flowmeter`{1,23}`+nebulizer`{5,23}`+imonitor`{6,22}` · B(DM): ibed`{9,23}`+airmattress`{12,23}`+fallrisksign`{9,26}`+vitals`{13,25}` · C(간경변): ibed`{17,23}`+iiv`{20,23}`+ichair`{21,25}` · D(NPO): ibed`{24,23}`+npoboard`{24,22}`+imonitor beep`{26,23}` · curtain×3.
**1인실**: baylabel · ibed`{3,38}`+imonitor beep`{2,38}`+iiv`{6,38}` · walltv`{2,43 w2}` · ichair`{8,40}` · sofa`{8,45 w3}` · iplant`{11,49}`.
**VRE 격리실**: baylabel(highlight) · isosign`{19,35}` · isolationcart`{15,37}` · ibed`{22,38}`+imonitor`{26,38}` · walltv`{24,36 w2}` · dedicatedbp`{22,42}` · wastebin(infectious)`{20,43}`.

## 핫스팟 (마커, 11 — 라벨만)
식이 배식(info,2,5) · 수액 라벨 출력(quest,11,6) · 오염물 처리(info,20,3) · Critical Value 콜(urgent,11,14) · 구두 처방(info,15,14) · 산소 유량 확인(info,3,23) · 식전 혈당 BST(quest,9,23) · 복수 사정(info,17,23) · 면역저하 케어(info,4,38) · 가운·장갑 착용(quest,15,37) · 전용 의료기기(info,22,38).

## NPC 캐스트 (11, mode idle)
linen nurse`{4,8}` · clean nurse`{12,8}` · station nurse`{11,15}`·doctor`{15,15}`·nurse`{5,18}` · room4 nurse`{12,26}`·parent`{21,26}`·doctor`{3,27}` · private parent`{9,41}`·nurse`{5,42}` · iso nurse(gowning)`{17,39}`.
