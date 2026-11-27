---
artifact: domain-entities
build-spec: departments/womenkids-opd
updated: 2026-07-18
---

# Women & Kids OPD — Domain Entities

`WOMENKIDS_INTERIOR` (`fixtures/womenkids.ts`) · 28×40 · floorTheme `peds` · scale 0.9 · playerStart `{4,8}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| play | 키즈 놀이광장 | `{0,9,14,16}` |
| pedopd | 소아청소년과 외래 | `{13,9,15,16}` |
| obopd | 산부인과 외래 | `{0,24,15,16}` |
| usroom | 초음파실 | `{14,24,14,16}` |
| lobby | 로비 · 접수 · 계측 | `{0,0,28,10}` |

## Rooms (5)
lobby `{6,5}` · play `{6,17}` · pedopd `{20,17}` · obopd `{6,32}` · usroom `{21,32}`.

## 오브젝트 배치 (v16 1:1)
**구조**: door `d-campus{12,0 w3}`(↓ 캠퍼스/엘리베이터, **상단**) · threshold 4(→놀이 `{6,9}` · →소아외래 `{13,9}` · →산부인과 `{6,24}` · →초음파 `{14,24}`).
**로비**: baylabel(hl) · **clinicReception `{2,3 w5}`**(tone #DB2777) · babyscale `{9,3}` · stadiometer `{12,2}` · watercooler `{16,2}` · ichair×4 `{18/20/22/24,5}`(각 색상, up).
**키즈 놀이광장**: baylabel · **playmat `{1,12 w11 h10}`** · smallslide `{2,13}` · rockinghorse `{8,13}` · toychest `{9,18}` · blocks `{4,18}` · mural `{2,10 w3}` · iplant `{11,21}`.
**소아청소년과 외래**: baylabel(hl) · ibed(ward,occ,진찰1) `{15,12}` · ireception 진료 `{18,12 w3}` · tonguejar `{21,11}` · stickerroll `{23,11}` · ibed(peds,occ,진찰2) `{15,18}` · ireception `{18,18 w3}` · ichair `{22,19}` · iplant `{25,22}`.
**산부인과 외래**: baylabel(hl) · ibed(ward,occ,산전 진찰) `{2,28}` · **fetalmonitor `{5,28}`** · ireception 진료 `{8,29 w3}` · ichair `{11,30}` · iplant `{12,36}`.
**초음파실**: baylabel · ibed(ward,occ,초음파 베드) `{16,28}` · ultrasound `{20,28}` · imonitor `{19,27}` · iplant `{25,36}`.

## 핫스팟 (마커, 5 — 라벨만)
영유아 성장 계측(quest,3,3) · 놀이·대기(info,5,15) · 소아 진찰·성장상담(quest,16,12) · 산전 진찰·상담(quest,3,28) · 태아 초음파(info,17,28).

## NPC 캐스트 (12, mode idle)
lobby nurse+parent+child · play child×2+parent · pedopd doctor+child+parent · obopd doctor+parent · usroom doctor. seed 841–852. kinds: nurse·parent·child·doctor.
