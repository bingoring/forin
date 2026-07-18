---
artifact: frontend-components
build-spec: departments/onco
updated: 2026-07-18
---

# Oncology / BMT — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/oncoEquipment.tsx` (신규, 3종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`(HEPA/CHEMO/VAX)→shape 블록. onco2의 InfusionChair/SmartInfusionPump/PPEStation은 이미 infusionEquipment에 존재 → 여기선 잔여 2종 + Fridge만.

| 타입 | 컴포넌트 | 소스 | 비고 |
|---|---|---|---|
| `bmtpod` | BMTPod(w) | `interior-objects-onco2.jsx` | 양압 이식실 HEPA 헤더(천장, preserveAspectRatio none, z=1, 비충돌) |
| `chemohazardbin` | ChemoHazardBin | `interior-objects-onco2.jsx` | 항암 폐기물 전용통(보라 라벨, 비충돌) |
| `fridge` | Fridge | `interior-peds.jsx` | 백신/약품 냉장고(VAX) |

## 재사용 (기존 디스패치)
- **infusion(onco2)**: `infusionchair`·`smartinfusionpump`·`ppestation`. **nursery(ld2)**: `warmercabinet`.
- **er**: `chartbinder`·`compcart`·`deskphone`·`framedpic`·`sofa`·`coffeetable`·`watercooler`·`walltv`·`handsanitizer`·`baylabel`. **ward**: `handrail`.
- **shared/struct**: `nursestation`·`sinkor`·`ibed`·`icabinet`·`imonitor`·`ireception`·`glass`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`OncoObjectView`를 default 체인에 삽입(Specialty 뒤, Shared 앞):
```
… ?? Dial ?? Specialty ?? Onco ?? Shared ?? Clinic
```
`OncoObjectView`는 3종 switch(bmtpod `props.w`), 그 외 `null`. infusionchair/pump/ppestation은 체인 앞단 Infusion이, warmercabinet은 Nursery가 처리.

## 렌더 z / footprint
- Fridge 바닥 접지 타원. BMTPod 천장 헤더(z=1, 비충돌). ChemoHazardBin 소형(비충돌). glass 에어록·room divider.
- 충돌: [business-rules](business-rules.md).
