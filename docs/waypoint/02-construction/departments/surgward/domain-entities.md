---
artifact: domain-entities
build-spec: departments/surgward
updated: 2026-07-14
---

# Surgery Ward — Domain Entities

`SURGWARD_INTERIOR` (`fixtures/surgward.ts`) · 28×52 · floorTheme `surgery` · scale 0.9 · playerStart `{4,15}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| linen | 린넨실 · 배식실 | `{0,0,10,11}` |
| dressing | 중앙 처치실 · 드레싱룸 | `{9,0,19,11}` |
| major | 1인용 대수술 후 중증실 | `{0,35,28,17}` |
| room4 | 4인용 수술 후 병실 | `{0,20,28,16}` |
| station | 중앙 간호 스테이션 · 보행 | `{0,10,28,11}` |
> 순서는 비-load-bearing(regionAt 최소면적 규칙).

## Rooms (5)
linen `{4,5}` · dressing `{17,5}` · station `{13,15}` · room4 `{13,27}` · major `{13,44}`.

## 오브젝트 배치 (v15 1:1)
**구조**: door `d-campus{0,14 w1 h3}`(← 캠퍼스) · threshold 7(서비스 x5-6/x13-15 sterile, 세로 x9 y6-8, 스테이션 x7-9/x18-20, 중증실 x10-12) · 커튼 3(x8/x16/x23, y22-32).
**린넨·배식**: baylabel · icabinet linen×2+supply · mealcart `{2,5}`.
**처치·드레싱룸**: baylabel(hl) · **surgicallight `{14,2}`**(OVERHEAD) · ibed(or) 처치베드 `{12,3}` · **dressing(DressingCart) `{16,4}`** · instrumenttray `{19,3}` · **stapleremover `{22,3}`** · icabinet sterile `{24,2}` · wastebin(infectious) `{24,6}`.
**스테이션·보행**: baylabel(hl) · handrail 세로 `{27,11}` · nursestation ㄷ `{8,13 w12 h5}` · **opscheduleboard `{2,11 w5}`** · deskphone `{9,13}`·`{17,13}` · **walkerrack `{21,11 w3}`** · **pcapump `{6,16}`**.
**4인 수술후**: baylabel · A(OP day): ibed`{2,23}`+**pcapump`{5,22}`**+npoboard`{2,22}`+imonitor beep`{1,23}` · B(JP): ibed`{9,23}`+**jpdrain`{12,25}`**+iiv`{8,23}` · C(가스): ibed`{17,23}`+iiv`{20,23}` · D(퇴원): ibed`{24,23}`+ichair`{21,25}` · curtain×3.
**대수술 중증실**: baylabel(hl) · ibed`{4,38}`+**ngsuction`{1,38}`**+imonitor beep`{8,38}`+iiv`{9,38}`+**pcapump`{11,38}`** · **hemovac`{4,40.5}`·`{6,40.5}`** · **scddevice`{13,42}`** · suction`{16,39}` · ichair`{20,40}` · sofa`{20,45 w3}` · iplant`{25,48}`.

## 핫스팟 (마커, 10 — 라벨만)
식이 배식(info) · 복부 드레싱 교체(quest,13,4) · OR 인계 콜(urgent,11,15) · 수술 상처 오더(info,15,15) · 조기 이상 보행(info,23,16) · 심호흡·기침 교육(quest,3,23) · JP 배액량 측정(info,9,23) · 가스 배출 확인(info,17,23) · 퇴원 약 대기(info,24,23) · 배액관 개통성 확인(quest,5,38).

## NPC 캐스트 (14, mode idle)
linen nurse · dressing surgeon+nurse · station nurse/doctor/patient/parent(보행) · room4 nurse(A)·nurse(B)·patient(C)·parent(D)·doctor(회진) · major nurse·parent. kinds: nurse·surgeon·doctor·patient·parent.
