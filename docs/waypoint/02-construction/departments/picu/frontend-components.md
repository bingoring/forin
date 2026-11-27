---
artifact: frontend-components
build-spec: departments/picu
updated: 2026-07-18
---

# PICU — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/picuEquipment.tsx` (신규, 4종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지).

| 타입 | 컴포넌트 | 소스 | 비고 |
|---|---|---|---|
| `picubed` | PICUBed(occupied) | `interior-objects-picu2.jsx` | 소아 중환자 베드(높은 안전 사이드레일·별 담요) |
| `pedventilator` | PedVentilator | `interior-objects-picu2.jsx` | 소아 인공호흡기(듀얼 파형·가습·회로·폴대) |
| `broselowcart` | BroselowCart | `interior-objects-picu2.jsx` | 소아 응급 카트(색상 구획 Broselow 서랍 4단) |
| `reclinerdaybed` | ReclinerDaybed | `interior-objects-hospice2.jsx` | 가족 상주용 리클라이너 데이베드(hospice 공유) |

> ReclinerDaybed는 hospice2 원본 — hospice(완화의료) 구현 시 이 컴포넌트 공유 또는 shared 승격 검토.

## 재사용 (기존 디스패치)
- **shared/struct**: `bankofmonitors`·`imonitor`·`iiv`·`ireception`·`sinkor`·`nursestation`·`glass`·`door`·`tint`·`iplant`.
- **er**: `crashcart`·`handsanitizer`·`deskphone`·`baylabel`. **icu**: `gownbox`.

## 디스패치 (`objects/index.tsx`)
`PicuObjectView`를 default 체인에 삽입(Nicu 뒤, Shared 앞):
```
… ?? Nicu ?? Picu ?? Shared ?? Clinic
```
`PicuObjectView`는 4종 switch(picubed `props.occupied`), 그 외 `null`.

## 렌더 z / footprint
- 바닥 오브젝트 접지 타원. 유리 전면/방 divider는 struct glass. 슬라이딩 도어는 door(통행). tint는 InteriorScreen 오버레이.
- 충돌: [business-rules](business-rules.md).
