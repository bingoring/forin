---
artifact: domain-entities
build-spec: departments/nursery
updated: 2026-07-18
---

# Nursery — Domain Entities

`NURSERY_INTERIOR` (`fixtures/nursery.ts`) · 28×42 · floorTheme `peds` · scale 0.9 · playerStart `{4,7}`.

## Regions (5)
| id | 이름 | bounds |
|---|---|---|
| nursery | 신생아실 (배시넷 존) | `{0,8,19,20}` |
| admit | 신생아 사정 · 워머 | `{18,8,10,20}` |
| feeding | 수유 · 모유 수유실 | `{0,27,14,15}` |
| viewing | 면회 관람창 | `{13,27,15,15}` |
| entry | 손위생 · 가운 착의 | `{0,0,28,9}` |

## Rooms (5)
entry `{5,4}` · nursery `{8,17}` · admit `{22,17}` · feeding `{6,35}` · viewing `{21,35}`.

## 오브젝트 배치 (v16 1:1 + doorway 2)
**구조**: door `d-elev{0,5 w1 h2}`(← 엘리베이터, 좌측) · threshold 4(손위생게이트 `{6,8 w2}` sterile · →수유실 `{6,27 w2}` · **→사정워머 `{18,17 w1 h2}`**(추가) · **→관람창 `{13,34 w1 h2}`**(추가)) · **obswindow `{13,27 w5}`**(면회창, 비충돌 — collision은 `{13,27,5,1}` 벽이 담당).
**손위생·가운**: baylabel(hl) · sinkor `{2,2}` · scrubdispenser `{6,2}` · gownbox `{9,2}` · **warmercabinet `{13,2}`** · ireception 신생아실데스크 `{18,3 w4}`.
**신생아실 배시넷**: baylabel(hl) · **bassinet×10**(`{2,11}`A-1·`{6,11}`A-2·`{10,11}`A-3·`{14,11}`A-4·`{2,16}`B-1·`{6,16}`B-2·`{10,16}`B-3·`{14,16}`B-4·`{2,21}`C-1·`{6,21}`C-2) · compcart `{11,22}`.
**신생아 사정·워머**: baylabel · **infantwarmer `{20,12}`** · babyscale `{23,17}` · warmercabinet `{25,11}` · phototherapy `{20,20 w2}` · iplant `{25,25}`.
**수유·모유 수유실**: baylabel · **nursingrecliner `{2,31}`·`{7,31}`·`{2,36}`** · milkfridge `{10,31}` · icurtain(pink) `{6,31 w1 h8}`.
**면회 관람창**: baylabel · sofa `{15,33 w3}`(A7C7E7) · coffeetable `{16,36 w2}` · ichair(down) `{20,33}`·`{22,33}`(BAE6FD) · iplant `{25,39}`.

## 핫스팟 (마커, 5 — 라벨만)
손위생 3분·가운(quest,3,2) · 신생아 활력징후(quest,2,11) · 입원 사정·계측(info,20,12) · 모유 수유 교육(info,3,31) · 가족 면회(info,16,33).

## NPC 캐스트 (9, mode idle)
entry nurse+parent · nursery nurse×2 · admit nurse · feeding parent+nurse · viewing visitor+parent. seed 831–839. kinds: nurse·parent·visitor.
