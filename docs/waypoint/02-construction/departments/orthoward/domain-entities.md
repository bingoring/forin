---
artifact: domain-entities
build-spec: departments/orthoward
updated: 2026-07-14
---

# Ortho Ward — Domain Entities

`ORTHO_INTERIOR` (`fixtures/ortho.ts`) · 28×52 · floorTheme `ortho` · scale 0.9 · playerStart `{4,15}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| pt | 물리치료 연계 통로 | `{0,0,10,11}` |
| cast | 석고실 · 소처치실 | `{9,0,19,11}` |
| hip | 1인용 고관절 골절 병실 | `{0,35,28,17}` |
| room4 | 4인용 골절/견인 병실 | `{0,20,28,16}` |
| station | 중앙 간호 스테이션 · 보조기 | `{0,10,28,11}` |

## Rooms (5)
pt `{4,5}` · cast `{17,5}` · station `{13,15}` · room4 `{13,27}` · hip `{13,44}`.

## 오브젝트 배치 (v15 1:1)
**구조**: door `d-campus{0,14 w1 h3}`(← 캠퍼스) · threshold 7(서비스 x4-6/x12-15 sterile, 세로 x9 y5-8, 스테이션 x6-9/x16-19 광폭, 고관절 x9-12) · 커튼 3(x8/x16/x23, y22-32).
**PT 통로**: baylabel · handrail 세로 `{1,2 w7}` · **walkerrack `{2,2 w2}`** · **wheelchair `{2,6}`** · iplant `{7,8}`.
**석고실**: baylabel(hl) · ibed(or) 처치베드 `{11,3}` · **plastertrapsink `{15,3}`** · **castrollshelf `{18,2 w3}`** · **castcutter `{22,6}`** · dressing `{24,3}`.
**스테이션·보조기**: baylabel(hl) · handrail 세로 `{27,11}` · nursestation ㄷ `{6,13 w11 h5}` · **pacsviewer `{2,12}`** · deskphone `{7,13}` · **cmschart `{15,12}`** · **bracerack `{20,12 w3}`** · **walker `{24,16}`**.
**4인 골절/견인**: baylabel · A(견인): ibed`{2,23}`+**tractionframe`{4,22}`**+imonitor`{1,23}` · B(TKA): ibed`{9,23}`+**cpmmachine`{11,26}`**+iiv`{8,23}` · C(구획증후군): ibed`{17,23}`+fallrisksign`{20,22}` · D(석고): ibed`{24,23}`+ichair`{21,25}` · curtain×3.
**고관절실**: baylabel(hl) · ibed`{4,38}`+**abductionpillow`{6,40}`**+imonitor beep`{3,38}`+iiv`{9,38}`+**bedalarm`{4,42}`** · **elevatedtoiletguard`{24,37}`** · ichair`{11,43}` · sofa`{20,45 w3}` · iplant`{25,48}`.

## 핫스팟 (마커, 10 — 라벨만)
재활 이동(info) · 화이버글래스 깁스(quest,12,4) · PT 스케줄 콜(urgent,9,15) · X-ray 정렬 검토(info,13,15) · 목발 높이 조절(info,21,15) · 견인 추·줄 사정(quest,3,23) · CPM 각도 확인(info,9,23) · **CMS 사정 5P(urgent,17,23)** · 석고 부종 사정(info,24,23) · 탈구 방지 교육(quest,5,38).

## NPC 캐스트 (11, mode idle)
pt patient · cast surgeon+nurse · station nurse/doctor/nurse · room4 nurse(A)·nurse(C)·doctor(회진) · hip nurse·parent. kinds: patient·surgeon·nurse·doctor·parent.
