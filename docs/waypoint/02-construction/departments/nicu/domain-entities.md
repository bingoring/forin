---
artifact: domain-entities
build-spec: departments/nicu
updated: 2026-07-18
---

# NICU — Domain Entities

`NICU_INTERIOR` (`fixtures/nicu.ts`) · 28×44 · floorTheme `peds` · scale 0.9 · playerStart `{4,7}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| station | 중앙 모니터 스테이션 | `{0,8,14,14}` |
| resus | 신생아 소생 베이 | `{13,8,15,14}` |
| podA | A 포드 (인큐베이터) | `{0,21,14,23}` |
| podB | B 포드 · 캥거루 케어 | `{13,21,15,23}` |
| ante | NICU 전실 · 스크럽 | `{0,0,28,9}` |

## Rooms (5)
ante `{5,4}` · station `{6,14}` · resus `{21,14}` · podA `{6,33}` · podB `{21,33}`.

## 오브젝트 배치 (v16 1:1)
**저조도**: tint `{1,22 w26 h21}` (#1E2A40, op 0.15).
**구조**: door `d-elev{0,5 w1 h2}` · threshold 4(스크럽 `{6,8}` sterile · resus `{13,13 h4}` · A포드 `{6,21}` · B포드 `{14,21}`) · glass `{13,22 w1 h21}`(포드 분리).
**전실**: baylabel(hl) · sinkor `{2,2}` · gownbox `{6,2}` · scrubdispenser `{9,2}` · handsanitizer `{12,2}` · baylabel `{15,2}`.
**중앙 스테이션**: baylabel(hl) · bankofmonitors `{2,11}` · nursestation `{2,15 w9 h4}` · deskphone `{3,15}`.
**소생 베이**: baylabel · **giraffewarmer `{16,12}`** · crashcart `{22,11}` · **cpapunit `{24,13}`**.
**A 포드**: baylabel · **phototherapyled `{2,25 w2}`** · **nicuisolette `{2,27}`/`{2,37}`** · imonitor(beep) `{7,27}`/`{7,37}` · cpapunit `{9,26}` · milkfridge `{11,40}`.
**B 포드**: baylabel · nicuisolette `{15,26}`/`{15,37}` · imonitor `{20,26}`(beep)/`{20,37}` · phototherapyled `{15,24 w2}` · nursingrecliner `{20,33}` · iplant `{25,43}`.

## 핫스팟 (5 — 라벨만)
손위생·가운 착용(quest,3,2) · 중앙 활력 감시(info,6,17) · 미숙아 소생·기도(**urgent**,16,12) · 온·습도·활력 확인(quest,3,27) · 캥거루 케어 지지(info,20,33).

## NPC 캐스트 (8, idle)
ante nurse+visitor · station nurse · resus doctor+nurse · podA nurse · podB parent+nurse. seed 881–888.
