---
artifact: frontend-components
build-spec: departments/ward
updated: 2026-07-13
---

# Ward — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/wardEquipment.tsx` (신규, 16종)
포팅 규약: 핸드오프 `interior-objects-ward2.jsx`(11) + `interior-ward.jsx` 로컬 헬퍼(MealCart/SharpsBin/IsoSign/DedicatedBP) + DeskPhone(핸드오프 미정의 → 신규)을 `Box`+react-native-svg로 1:1. `S=TILE/16`, offX/offY = 핸드오프 `-N`, ground-shadow 타원 유지. SVG `<text>` → shape 블록; DIV 사인(IsoSign)만 RN View+Text(DungGeunMo).

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `o2flowmeter` | O2Flowmeter | 벽면 산소 유량계+가습병+캐뉼라 |
| `nebulizer` | Nebulizer | 흡입기+미스트 |
| `airmattress` | AirMattress | 에어매트 펌프(교대압 표시등) |
| `fallrisksign` | FallRiskSign | 낙상 경고 삼각(⚠️) |
| `npoboard` | NPOBoard | 'NPO 금식' 머리맡 보드 |
| `isolationcart` | IsolationCart | 접촉격리 카트(가운/장갑 박스) |
| `linenhamper` | LinenHamper(tone) | 바퀴 린넨 수거함(soiled/clean) |
| `sluicesink` | SluiceSink | 오물 처리 깊은 싱크 |
| `supplybasketshelf` | SupplyBasketShelf(w,shelves) | 라벨 바구니 선반(절차 생성) |
| `ivstoragecart` | IVStorageCart | 수액 보관 카트(D5/NS/HS) |
| `handrail` | Handrail(w,vertical) | 복도 손잡이 바(비충돌) |
| `mealcart` | MealCart | 배식 트레이 카트 |
| `sharpsbin` | SharpsBin | 주삿바늘 수거함 |
| `dedicatedbp` | DedicatedBP | 격리 전용 혈압계(스탠드) |
| `deskphone` | DeskPhone | 스테이션 데스크 전화(신규) |
| `isosign` | IsoSign | CONTACT ISOLATION 문 사인(View+Text) |

## 재사용 (기존 디스패치)
- **shared**: `ibed`(variant `ward`)·`imonitor`·`iiv`·`icurtain`(props w/h/color, 차단)·`icabinet`(variant `linen`/`supply`)·`ireception`·`ichair`·`iplant`·`nursestation`(ㄷ-데스크, skip=보행)·`nursedeski`(미사용).
- **er**: `vitals`·`walltv`·`sofa`·`wastebin`·`chartbinder`·`baylabel`.
- **pharma**: `pneumatictube`·`barcodescanner`(디스패치 체인에서 Pharma가 먼저 처리 → 타입명만으로 재사용).

## 디스패치 (`objects/index.tsx`)
`WardObjectView`를 default 체인에 삽입(Pharma 뒤, Shared 앞):
```
Er ?? Or ?? Icu ?? Peds ?? Pharma ?? Ward ?? Shared ?? Clinic
```
`WardObjectView`는 16종 switch, 그 외 `null`. `pneumatictube`/`barcodescanner`는 Pharma가 이미 처리(체인상 앞)라 Ward는 관여 안 함.

## 렌더 z / footprint
- 대부분 바닥(zFor(baseY)). `supplybasketshelf`는 벽 배경 → `z:1`. 마커(?/!)는 `InteriorScreen.allMarkers`(핫스팟).
- 충돌: [business-rules](business-rules.md) — 신규 타입은 props{w,h}로만 차단, 벽/바닥/걸이류는 h 미부여로 비충돌.
