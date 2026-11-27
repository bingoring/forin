---
artifact: domain-entities
build-spec: departments/dermcenter
updated: 2026-07-15
---

# Derm Center — Domain Entities

`DERMCENTER_INTERIOR` (`fixtures/dermcenter.ts`) · 28×52 · floorTheme `derm` · scale 0.9 · playerStart `{14,11}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| exam1 | 제1진료실 · 병변 진단 | `{0,13,14,13}` |
| exam2 | 제2진료실 | `{13,13,15,13}` |
| laser | 소수술 · 레이저 처치실 | `{0,37,28,15}` |
| photo | 광선 치료실 | `{0,25,28,13}` |
| lobby | 로비 · 접수 · 대기 | `{0,0,28,14}` |

## Rooms (5)
lobby `{14,6}` · exam1 `{6,19}` · exam2 `{20,19}` · photo `{13,31}` · laser `{13,44}`.

## 오브젝트 배치 (v15 1:1)
**구조**: door `d-campus{13,0 w3}`(↓ 캠퍼스, **상단**) · threshold 6(진료실 x5-7/x13-15, exam 세로 x13 y18-20, 광선 x7-9, 처치실 x7-9 sterile).
**로비**: baylabel · **clinicReception `{3,3 w6}`**(tone #DB2777) · **lesionchart `{10,1 w3}`** · sofa `{18,3}`/`{21,3}`/`{24,3}`(각 색상) · coffeetable `{20,6}` · ichair `{18/20/22/24,9}` · watercooler `{26,6}` · walltv `{1,9 w2}` · iplant `{26,10}`.
**제1진료실**: baylabel(hl) · ibed(ward) `{2,16}` · **dermatoscope `{6,16}`** · **woodslamp `{8,17}`** · imonitor `{10,16}` · ireception 진료 `{9,20}` · lesionchart `{1,22 w2}`.
**제2진료실**: baylabel · ibed(ward) `{15,16}` · dermatoscope `{19,16}` · ireception 진료 `{22,20}` · imonitor `{25,16}` · **skinanatomy `{24,14}`** · ichair `{20,22}` · iplant `{26,23}`.
**광선 치료실**: baylabel(hl) · **uvbooth `{3,29}`** · **handuvbox `{9,31}`** · **gogglesanitizer `{12,29}`** · ireception 조사콘솔 `{15,31 w4}` · imonitor `{19,30}` · sofa `{22,33 w3}` · iplant `{25,29}`.
**레이저 처치실**: baylabel(hl) · surgicallight `{6,39}` · ibed(or) 수술의자 `{4,41}` · **biopsykit `{8,41}`** · **biopsybottle `{10,44}`** · **cryotank `{13,41}`** · **co2laser `{16,42}`** · dressing `{20,41}` · icabinet(sterile) `{23,39 w4}` · wastebin(infectious) `{23,44}` · iplant `{25,48}`.

## 핫스팟 (마커, 6 — 라벨만)
발진 히스토리 문진(quest,4,5) · 아토피 대기 환자(info,19,5) · 점 ABCD 사정(quest,3,16) · UV 강도·시간 세팅(quest,15,31) · 전신 UVB 부스(info,4,29) · 펀치 생검 처치(quest,5,41).

## NPC 캐스트 (11, mode idle)
lobby nurse+patient×2+visitor · exam1 doctor+nurse · exam2 doctor · photo nurse+patient · laser surgeon+nurse. kinds: nurse·patient·visitor·doctor·surgeon.
