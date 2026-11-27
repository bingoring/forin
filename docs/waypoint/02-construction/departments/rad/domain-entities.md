---
artifact: domain-entities
build-spec: departments/rad
updated: 2026-07-18
---

# Radiology — Domain Entities

`RAD_INTERIOR` (`fixtures/rad.ts`) · 28×48 · floorTheme `clinical` · scale 0.9 · playerStart `{4,14}`.

## Regions (6)
| id | 이름 | bounds |
|---|---|---|
| checkin | 접수 · 대기 | `{0,0,14,11}` |
| reading | 판독실 · Reading Room | `{13,0,15,11}` |
| ct | CT 촬영실 | `{0,17,14,12}` |
| mri | MRI 촬영실 | `{13,17,15,12}` |
| xray | X-ray 촬영실 | `{0,28,28,20}` |
| hall | 중앙 복도 · 안내 | `{0,10,28,8}` |

## Rooms (5)
checkin `{4,5}` · reading `{20,5}` · ct `{6,23}` · mri `{20,23}` · xray `{13,40}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,13 w1 h3}` · threshold 6(복도 `{6,10}` · 판독 `{13,10}`/`{13,6 h3}` · CT `{6,17}` · MRI `{14,17}` · X-ray `{11,28}`).
**접수·대기**: baylabel · ireception 접수 `{2,3 w4}` · imonitor `{6,2}` · ichair×5 `{2/4/6/8/10,7}` · iplant `{11,8}`.
**판독실**: tint `{14,1 w13 h9}`(#1E2A40 저조도) · baylabel(hl) · **pacsviewer `{15,3}`/`{20,3}`** · ireception 판독데스크 `{23,5 w3}`.
**중앙 복도**: baylabel(hl) · handrail `{27,11 w1 h5}` · **leadapronrack `{3,12}`** · vitals `{22,13}` · waitingdisplay `{16,11}`.
**CT 촬영실**: baylabel · **ctscanner `{2,21}`** · glass `{11,19 w1 h8}`(제어부스) · **controlconsole `{8,24}`**.
**MRI 촬영실**: baylabel · **mriscanner `{14,21}`** · controlconsole `{22,24}`.
**X-ray 촬영실**: baylabel · **xrayunit `{4,33}`** · glass `{12,30 w1 h9}` · controlconsole `{14,33}` · leadapronrack `{20,31}` · ibed(ward,촬영대기) `{3,40}` · iplant `{25,45}`.

## 핫스팟 (6 — 라벨만)
검사 접수(info,3,3) · 영상 판독(quest,16,4) · 검사 안내(info,9,13) · 조영제·포지셔닝(quest,3,22) · 금속 반입 금지(info,15,22) · 흉부 촬영 포지셔닝(quest,5,34).

## NPC 캐스트 (11, idle)
checkin nurse+patient · reading doctor×2 · hall nurse+patient · ct doctor · mri nurse · xray doctor+nurse+patient. seed 901–911.
