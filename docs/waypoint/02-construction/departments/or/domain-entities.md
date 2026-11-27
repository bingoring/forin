---
artifact: domain-entities
build-spec: departments/or
status: IMPLEMENTED
updated: 2026-07-01
---

# Domain & Entities — 5g-b OR

> 규칙은 [`business-rules.md`](business-rules.md), 흐름은 [`business-logic-model.md`](business-logic-model.md), 렌더는 [`frontend-components.md`](frontend-components.md).

## 1. regions[] / rooms[]
| id | name | bounds(x,y,w,h) | 앵커 |
|---|---|---|---|
| family | 보호자 대기실(비제한) | 0,0,20,15 | 10,7 |
| locker | 탈의실·락커룸(비제한) | 19,0,21,15 | 28,7 |
| preop | 수술 전 대기실(준제한) | 0,14,14,18 | 5,20 |
| clean | Clean Utility·멸균 | 13,14,8,9 | 16,18 |
| dirty | Dirty Utility·오염 | 13,22,8,10 | 16,27 |
| pacu | 회복실 PACU(준제한) | 20,14,20,18 | 24,20 |
| or1 | 제1수술실(제한·양압) | 0,31,16,21 | 7,39 |
| scrub | 스크럽 스테이션 | 15,31,9,21 | 18,39 |
| or2 | 제2수술실(복강경/로봇) | 23,31,17,21 | 31,39 |

## 2. 오브젝트 배치 (SoT → `type` → 좌표)
- **family**: baylabel(1,1) · walltv(9,1 w2) · sofa(2,4 w3 #9CB4C8)(2,9 w3 #C0A6B8) · coffeetable(3,6 w2) · ichair A열 10/12/14/16,y5 #FED7AA down · B열 동 x,y9 #FBCFE8 up · watercooler(17,3) · iplant(17,11).
- **locker**: baylabel(20,1) · icabinet(21/25/29/33,y3 w3 linen; 21=GOWN)(21/25,y6 w3 linen) · sanitizer(37,3) · ichair(22/24/26/28,y10 #BAE6FD up) · iplant(37,11).
- **preop**: baylabel(1,15 hi) · [bed1] ibed(2,17 ward occ) imonitor(1,17 beep) compcart(5,16) consentclipboard(2,20) · [bed3] ibed(8,17 ward occ) iiv(10,17) imonitor(11,17) · icurtain(1,21 w11 #A7C7E7) · [bed2] ibed(2,23 ward occ) iiv(5,23) bairhugger(6,25) · iplant(11,29).
- **clean**: baylabel(14,15) · icabinet(14,17 w5 sterile STERILE)(14,19 w5 sterile)(14,20 w5 supply).
- **dirty**: baylabel(14,23) · soiledcart(14,26)(17,26) · wastebin(14,29)(18,29) infectious.
- **pacu**: baylabel(21,15) · ibed(22/26/30,y17 ward occ)(34,17 ward) · imonitor(21 beep/25 beep/29/33,y17) · suction(29,20) · bairhugger(28,19) · bankofmonitors(30,22) · nursedeski(30,24 w4h2) · compcart(34,24) · crashcart(36,25) · iplant(37,29).
- **or1**: baylabel(1,32 hi) · surgicallight(7,34) · orboommonitor(11,34 w2) · ibed(6,37 or occ) · anesthesia(4,36) · imonitor(3,37 beep) · instrumenttray(9,38) · bovie(12,38) · iiv(4,41) · kickbucket(8,41) · icabinet(1,34 w3 sterile STERILE)(1,45 w3 equipment) · compcart(12,42) · timeoutboard(1,48 w3).
- **scrub**: baylabel(16,32) · sinkor(16,35)(16,40) · scrubdispenser(19,35)(19,40) · scrubtimer(20,33).
- **or2**: baylabel(24,32 hi) · surgicallight(30,34) · orboommonitor(33,34 w2) · ibed(29,37 or occ) · anesthesia(27,36) · imonitor(26,37 beep) · laptower(25,37) · co2insufflator(26,41) · roboticconsole(33,42) · compcart(37,44) · icabinet(24,34 w3 sterile STERILE)(36,34 w3 drug) · statusboard(24,49 w6).

## 3. NPC 캐스트 (23명, idle)
family: parent(11,7) visitor(13,7) · locker: nurse(24,8) surgeon(30,8) · preop: nurse(5,19) doctor(5,25) · clean: nurse(16,20) · pacu: nurse(22,20)(24,20)(26,20)(31,27)(33,27) · or1: surgeon(5,39)(7,39) nurse(9,40) doctor(4,37) nurse순회(13,43) · scrub: surgeon(17,38) nurse(17,43) · or2: nurse(31,40) doctor(27,37) surgeon(34,45) nurse(37,45).

## 4. Allowed-set
- npc kind: parent·visitor·nurse·surgeon·doctor. icabinet variant: linen·sterile·supply·equipment·drug. ibed variant: ward·or.
