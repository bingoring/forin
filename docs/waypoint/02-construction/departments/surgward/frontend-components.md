---
artifact: frontend-components
build-spec: departments/surgward
updated: 2026-07-14
---

# Surgery Ward — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/surgEquipment.tsx` (신규, 8종)
포팅 규약: `interior-objects-surg2.jsx`를 `Box`+react-native-svg로 1:1(`S=TILE/16`, offX/offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`→shape.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `pcapump` | PCAPump | 무통주사 펌프(IV 폴대+데맨드 버튼) |
| `jpdrain` | JPDrain | JP 배액관(수류탄 벌브) |
| `hemovac` | Hemovac | 원반형 음압 배액관 |
| `ngsuction` | NGSuction | 비위관→벽 흡인(담즙색 캐니스터) |
| `scddevice` | SCDDevice | 간헐 공기압박(DVT, 다리 슬리브) — split ground-shadow |
| `walkerrack` | WalkerRack(w) | 워커 보관대 |
| `opscheduleboard` | OPScheduleBoard(w) | 수술 스케줄 화이트보드(상태 칩) |
| `stapleremover` | StapleRemover | 스킨 스테이플 제거기(트레이) |

> surg2의 `Walker`·`AbdoBinder`는 핸드오프 render에 미배치 → 미구현(정의만).

## 재사용 (기존 디스패치)
- **ward2**(내가 5g-f에서 구현): `mealcart`·`npoboard`·`ivstoragecart`·`supplybasketshelf`·`handrail`·`deskphone`·`sharpsbin`·`linenhamper`·`sluicesink`.
- **shared**: `ibed`(variant `or`/`ward`)·`imonitor`·`iiv`·`ichair`·`icurtain`·`icabinet`(variant `linen`/`supply`/`sterile`)·`nursestation`(ㄷ)·`vitals`·`sofa`·`iplant`.
- **OR**: `surgicallight`(OVERHEAD z)·`instrumenttray`.
- **ER**: `dressing`(=DressingCart)·`suction`(=SuctionUnit)·`wastebin`·`baylabel`.

## 디스패치 (`objects/index.tsx`)
`SurgObjectView`를 default 체인에 삽입(Ward 뒤, Shared 앞):
```
Er ?? Or ?? Icu ?? Peds ?? Pharma ?? Ward ?? Surg ?? Shared ?? Clinic
```
ward2 재사용 타입은 Ward가(체인상 앞) 처리 → Surg는 surg2 8종만 관여.

## 렌더 z / footprint
- 대부분 바닥(zFor(baseY)). `opscheduleboard`·`walkerrack`는 벽/바닥 배경 → `z:1`(walkerrack은 z 기본). `surgicallight` OVERHEAD. 마커는 핫스팟.
- 충돌: [business-rules](business-rules.md) — 신규는 props{w,h}로만 차단.
