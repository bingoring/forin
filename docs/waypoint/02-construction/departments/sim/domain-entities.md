---
artifact: domain-entities
build-spec: departments/sim
updated: 2026-07-18
---

# Sim Lab / Nursing Admin — Domain Entities

`SIM_INTERIOR` (`fixtures/sim.ts`) · 28×42 · floorTheme `clinical` · scale 0.9 · playerStart `{4,8}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| infection | 감염관리실 | `{0,11,14,14}` |
| debrief | 디브리핑 · 강의실 | `{13,11,15,14}` |
| simlab | 시뮬레이션 랩 | `{0,24,19,18}` |
| booth | 제어실 (Control) | `{18,24,10,18}` |
| admin | 간호부 총괄 사무실 | `{0,0,28,12}` |

## Rooms (5)
admin `{6,6}` · infection `{6,17}` · debrief `{20,17}` · simlab `{8,34}` · booth `{23,34}`.

## 오브젝트 배치 (v16 1:1 + booth staff 도어)
**구조**: door `d-elev{0,7 w1 h3}` · threshold(감염관리 `{5,11}` · 강의실 `{13,11}` · 시뮬랩 `{7,24}` · **제어실 `{18,37}`**(x18 벽 staff 도어, 신설)).
**간호부 사무실**: baylabel · **officedesk `{2,3}`/`{7,3}`/`{12,3}`** · icabinet(supply) `{18,2 w4}`/`{22,2 w4}` · shelflabel 인사·근무표 `{18,2}` · watercooler `{25,6}` · iplant `{25,9}`.
**감염관리실**: baylabel(hl) · **ppeboard `{2,13 w3}`** · gownbox `{2,16}` · scrubdispenser `{5,16}` · wastebin(infectious) `{8,16}` · officedesk `{2,19}`.
**디브리핑 강의실**: baylabel · walltv `{22,12 w2}` · coffeetable `{17,16 w3}` · ichair(down) `{16/18/20,14}`·(up) `{16/18/20,20}`.
**시뮬레이션 랩**: baylabel · **simmanikin `{2,28}`** · imonitor(beep) `{1,28}` · crashcart `{7,28}` · ivpump `{6,32}` · ventilator `{9,30}` · iplant `{16,38}`.
**제어실**: baylabel · **controlbooth `{19,27 w1}`**(원웨이 미러 관찰창) · officedesk `{20,33}`.

## 핫스팟 (5 — 라벨만)
근무 배치·행정(info,3,3) · PPE 착탈의 감사(quest,3,16) · 사례 디브리핑(info,18,16) · 응급 시나리오 실습(quest,3,28) · 마네킹 시나리오 조작(info,20,30).

## NPC 캐스트 (10, idle)
admin doctor+nurse×2 · infection nurse · debrief doctor+nurse · simlab nurse×2+doctor · booth doctor. seed 1081–1090.
