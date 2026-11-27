---
artifact: frontend-components
build-spec: departments/spd
updated: 2026-07-18
---

# SPD / Nutrition / Loading Dock — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/spdEquipment.tsx` (신규, 6종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). 배열 map(오토클레이브 볼트·랙 파우치·트럭 슬랫)은 RN 리스트로 재현.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `autoclave` | Autoclave | 대형 고압증기 멸균기(라운드 압력 도어·wheel-lock·제어판·게이지) |
| `sterilerack` | SterileRack(w) | 멸균 팩 보관 랙(peel-pouch 3열·블루 인디케이터, preserveAspectRatio none) |
| `washerdisinfector` | WasherDisinfector | 기구 세척 소독기(통과형 유리 도어·바스켓) |
| `foodcartcolumn` | FoodCartColumn | 배식 카트(다단 트레이 보온고·HOT 인디케이터) |
| `palletstack` | PalletStack | 하역장 물류 파렛트(카톤 적재·배송 라벨) |
| `cargotruck` | CargoTruck | 하역장 배송 트럭(롤업 화물칸 후면·슬랫·캡) |

## 재사용 (기존 디스패치)
- **hospice**: `adlkitchen`. **onco**: `fridge`. **pharma**: `medcart`·`floortape`·`shelflabel`. **or**: `soiledcart`.
- **shared/struct**: `sinkor`·`waste`·`icabinet`(variant supply)·`ireception`·`tint`·`baylabel`.

## 디스패치 (`objects/index.tsx`)
`SpdObjectView`를 default 체인에 삽입(Lounge 뒤, Shared 앞):
```
… ?? Sim ?? Lounge ?? Spd ?? Shared ?? Clinic
```
`SpdObjectView`는 6종 switch(sterilerack `props.w`), 그 외 `null`.

## 렌더 z / footprint
- Autoclave/Washer/FoodCart/Pallet/Cargo 바닥 접지 타원(산업 스케일). SterileRack(벽 부착, 비충돌).
- 충돌: [business-rules](business-rules.md).
