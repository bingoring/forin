---
artifact: domain-entities
build-spec: departments/ld
updated: 2026-07-18
---

# L&D — Domain Entities

`LD_INTERIOR` (`fixtures/ld.ts`) · 28×50 · floorTheme `peds` · scale 0.9 · playerStart `{4,15}`.

## Regions (6)
| id | 이름 | bounds |
|---|---|---|
| triage | 산모 분류 · OB Triage | `{0,0,14,11}` |
| anes | 무통 · 마취 준비 | `{13,0,15,11}` |
| station | 중앙 간호 스테이션 | `{0,10,28,11}` |
| ldr | LDR 분만실 | `{0,20,28,16}` |
| postpartum | 산후 모아동실 | `{0,35,15,15}` |
| nursery | 신생아실 Nursery | `{14,35,14,15}` |

## Rooms (6)
triage `{4,5}` · anes `{20,5}` · station `{13,15}` · ldr `{8,27}` · postpartum `{7,44}` · nursery `{21,44}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-elev{0,14 w1 h3}`(← 엘리베이터, 좌측) · threshold 7(복도 `{6,10}`/`{13,10}` · triage `{13,6 h3}` · ldr `{7,20}`/`{18,20}` · 산후 `{6,35}` · 신생아실 `{17,35}` sterile) · glass `{14,38 w1 h11}`(산후\|신생아 뷰창).
**OB Triage**: baylabel(hl) · ibed(ward,occ,TRIAGE) `{2,3}` · **fetalmonitor `{5,2}`** · iiv `{7,3}` · vitals `{9,5}`.
**무통·마취**: baylabel · icabinet(drug,EPIDURAL) `{14,2 w3}` · icabinet(sterile) `{17,2 w3}` · ireception 마취기록 `{21,3 w3}` · compcart `{24,2}`.
**중앙 스테이션**: baylabel(hl) · handrail `{27,11 w1 h8}` · nursestation `{8,12 w12 h5}` · deskphone `{9,12}`/`{17,12}` · chartbinder `{20,12}` · fetalmonitor `{4,12}` · vitals `{23,16}`.
**LDR**: baylabel(hl) LDR1/LDR2/INFANT WARMER · **birthingbed `{2,23}`/`{11,23}`** · fetalmonitor `{6,23}`/`{15,23}` · **deliverycart `{2,29}`** · iiv `{10,23}` · infantwarmer `{21,24}` · warmercabinet `{25,23}` · icurtain(pink) `{10,22 h12}`/`{19,22 h12}`.
**산후 모아동실**: baylabel · ibed(ward,occ,산모) `{2,38}` · bassinet(girl) `{6,38}` · imonitor `{1,38}` · nursingrecliner `{9,40}` · iplant `{12,47}`.
**신생아실**: baylabel · bassinet×5(`{16,38}`·`{19,38}`·`{22,38}`·`{16,43}`·`{19,43}`, boy/girl) · infantwarmer `{23,44}` · sinkor `{25,37}`.

## 핫스팟 (마커, 8 — 라벨만)
자궁수축·태동 사정(quest,3,3) · 무통 카트 점검(info,15,4) · 분만 임박 콜(**urgent**,11,14) · 태아 심박 CTG(quest,3,23) · 분만 진행(info,12,23) · 아기 보온·아프가(info,21,24) · 모유수유 교육(quest,3,38) · 신생아 관찰·수유(info,17,38).

## NPC 캐스트 (13, mode idle)
triage nurse+patient · anes doctor · station nurse×2+doctor · ldr nurse+doctor+parent+nurse · postpartum nurse+parent · nursery nurse. seed 861–873.
