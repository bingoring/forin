---
artifact: domain-entities
build-spec: departments/pharma
updated: 2026-07-12
---

# Pharmacy — Domain Entities

`PHARMA_INTERIOR` (`fixtures/pharma.ts`) · 36×42 · floorTheme `pharma` · scale 0.8 · playerStart `{9,9}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| window | 수령 창구 · 기송관 허브 | `{0,0,36,13}` |
| dispense | 일반 약품 조제실 | `{0,12,21,30}` |
| vault | 마약류 보관고 | `{0,28,13,14}` |
| ante | 무균 전실 (Anteroom) | `{20,12,16,9}` |
| cleanroom | 무균 조제실 (Cleanroom) | `{20,19,16,23}` |

## Rooms (fast-travel anchors, 7)
window `{6,9}` · tube `{18,6}` · dispense `{6,20}` · lasa `{10,16}` · vault `{4,33}` · ante `{27,16}` · cleanroom `{27,28}`.

## 오브젝트 배치 (핸드오프 좌표 1:1)
**구조 개구부**: door `d-nurse{0,4 w1h2}`(간호사 출입)·`d-campus{15,41 w3h1}`(캠퍼스) · threshold `th-staff{6,12}`·`th-ante{20,12 sterile}`·`th-air{27,19 sterile}`·`th-vault{5,28 sterile}` · glass `g-counter{1,3 w11}`(카운터 배리어)·`g-ante1{22,19 w5}`·`g-ante2{29,19 w6}`.

**수령 창구(window)**: baylabel×2 · medwallshelf `{1,1 w11 s3}`·`{26,1 w8 s4}` · pharmacounter `{1,4 w11}` · countersign `PICK-UP{2,4}`·`DROP-OFF{6,4}` · barcodescanner `{9,4}` · returnbox `{11,3}` · pneumatictube `{16,3}` · tubecapsulerack `{19,7}` · fridgepharma `{32,5}` · iplant `{33,9}`.

**조제실(dispense)**: baylabel `MAIN DISPENSING{1,13}` · atcmachine `{2,16}`(marker info 자동 조제) · lasashelf `{8,15 w3}` · icabinet(pharma) `{14,14}`·`{17,14}`·`{14,25}`·`{17,25}` w3 + shelflabel A·ANTIBIOTICS/B·CARDIAC/C·INSULIN/D·PRN · ireception 검수대 `{13,19 w4}`(marker quest 처방 더블체크) · imonitor `{18,19}` · medcart `{9,23}`.

**마약류(vault)**: baylabel `NARCOTICS VAULT{1,29}` · narcoticsvault `{2,32}`(marker info 마약류 관리 대장) · chartbinder `{6,34}`.

**무균 전실(ante)**: baylabel `전실{22,13}` · sinkor `{22,15}` · gownbox `{26,14}` · scrubdispenser `{29,14}` · tackymat `{31,16 w2}` · sanitizer `{34,14}`(marker info 방진복·에어샤워).

**무균 조제실(cleanroom)**: baylabel `STERILE CLEANROOM{22,20}` · bsc `{23,25}`(marker quest 항암제 믹스)·`{23,31}` · magnehelicgauge `{34,22}` · chemospillkit `{34,27}` · centrifuge `{31,33}` · printlabel `{28,36}` · wallphone `{34,32 ringing}`(marker urgent STAT 콜) · floortape `{22,39 w12}`.

## 핫스팟 (standalone 마커, 2)
`hs-missing{4,6 quest}`(누락 약 확인) · `hs-tube{16,5 info}`(캡슐 송수신). 나머지 마커는 오브젝트 `props.marker`.

## NPC 캐스트 (9, mode idle)
window: doctor 약사`{4,3}` · nurse`{5,9}`·`{8,9}`·`{18,9}` / dispense: doctor`{14,22}`·`{16,22}` · nurse`{10,25}` / vault: doctor`{8,36}` / cleanroom: surgeon`{26,28}`.
