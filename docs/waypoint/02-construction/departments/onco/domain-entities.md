---
artifact: domain-entities
build-spec: departments/onco
updated: 2026-07-18
---

# Oncology / BMT — Domain Entities

`ONCO_INTERIOR` (`fixtures/onco.ts`) · 28×50 · floorTheme `internal` · scale 0.9 · playerStart `{4,15}`.

## Regions (6)
| id | 이름 | bounds |
|---|---|---|
| verify | 약물 조제 확인 | `{0,0,14,11}` |
| quiet | 상담실 · Quiet Room | `{13,0,15,11}` |
| station | 중앙 간호 스테이션 | `{0,10,28,10}` |
| infusion | 항암 주입 베이 | `{0,19,28,16}` |
| ante | BMT 전실 (Anteroom) | `{0,34,9,16}` |
| bmt | BMT 무균 이식실 | `{8,34,20,16}` |

## Rooms (6)
verify `{4,5}` · quiet `{20,5}` · station `{13,15}` · infusion `{13,26}` · ante `{4,43}` · bmt `{18,43}`.

## 오브젝트 배치 (v16 1:1 + 도달성 보정)
**구조**: door `d-elev{0,14 w1 h3}` · threshold(복도 `{6,10}`/`{13,10}` · quiet `{13,6 h3}` · infusion `{8,19 w3}`/`{18,19 w3}` · **전실 `{4,34}` sterile**(핸드오프 x8→x4) · 에어록 `{8,37 h2}` sterile · **BMT2 도어 `{18,43}` sterile**(신설)) · glass(에어록 `{8,39 h10}` · room divider `{18,36 h7}`+`{18,44 h5}`).
**약물 조제 확인**: baylabel(hl) · ireception 더블체크 `{2,3 w4}` · imonitor `{6,2}` · **chemohazardbin `{2,6}`** · icabinet(drug,CHEMO) `{8,2 w4}` · **fridge `{10,6}`**.
**상담실**: baylabel · sofa `{15,3 w3}`(#8FB59E)/`{22,3 w3}`(#B7A6C8) · coffeetable `{19,4 w2}` · iplant `{25,2}` · framedpic `{16,1 w2}`.
**중앙 스테이션**: baylabel(hl) · handrail `{27,11 w1 h7}` · nursestation `{8,12 w12 h5}` · deskphone `{9,12}` · chartbinder `{18,12}` · compcart `{4,12}`.
**항암 주입 베이**: baylabel · infusionchair×5(`{2,22}`occ·`{7,22}`occ·`{13,22}`occ·`{2,28}`occ·`{7,28}`) + smartinfusionpump×5(우측 +3) · warmercabinet `{20,22}` · watercooler `{24,22}` · walltv `{23,28 w2}` · iplant `{25,32}`.
**BMT 전실**: baylabel(hl) · ppestation `{1,37}` · sinkor `{2,41}` · handsanitizer `{6,40}` · chemohazardbin `{5,44}`.
**BMT 이식실**: baylabel · **bmtpod `{9,36 w18}`**(HEPA 헤더) · ibed(ward,occ,BMT 1) `{10,40}` · imonitor(beep) `{9,40}` · smartinfusionpump `{14,40}` · ibed(ward,occ,BMT 2) `{20,40}` · imonitor `{26,40}` · smartinfusionpump `{24,40}` · walltv `{20,48 w2}`.

## 핫스팟 (6 — 라벨만)
항암제 이중 확인(quest,3,3) · 가족 면담(info,19,5) · 주입 스케줄(info,11,14) · 주입 속도·부작용 관찰(quest,8,22) · 양압 손위생·방호(info,2,41) · 이식·생착 모니터(info,10,40).

## NPC 캐스트 (11, idle)
verify doctor+nurse · quiet doctor+parent · station nurse×2 · infusion nurse+parent · ante nurse · bmt nurse+parent. seed 981–991.
