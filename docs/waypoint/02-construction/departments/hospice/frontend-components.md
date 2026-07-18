---
artifact: frontend-components
build-spec: departments/hospice
updated: 2026-07-18
---

# Hospice / Palliative — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/hospiceEquipment.tsx` (신규, 4종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지).

| 타입 | 컴포넌트 | 소스 | 비고 |
|---|---|---|---|
| `hospicebed` | HospiceBed(occupied) | `interior-objects-hospice2.jsx` | 가정형 완화 침대(원목 헤드보드·패턴 퀼트·2 베개) |
| `comfortcart` | ComfortCart | `interior-objects-hospice2.jsx` | 아로마·음악 완화 케어 카트(디퓨저 미스트·티포트) |
| `syringedriver` | SyringeDriver | `interior-objects-hospice2.jsx` | 지속 피하주입 통증펌프(소형·폴대) |
| `adlkitchen` | ADLKitchen(w) | `interior-objects-rehab2.jsx` | 일상생활 훈련 주방(싱크·스토브 다이얼·하부장) — 재활과 공유 |

> ADLKitchen은 rehab2 원본 — rehab(재활치료실)도 이 컴포넌트 공유(체인상 Hospice가 처리). ReclinerDaybed는 picuEquipment에 존재.

## 재사용 (기존 디스패치)
- **picu**: `reclinerdaybed`. **onco**: `fridge`.
- **er**: `watercooler`·`sofa`·`coffeetable`·`framedpic`·`baylabel`.
- **shared/struct**: `nursestation`·`deskphone`·`chartbinder`·`imonitor`·`glass`·`tint`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`HospiceObjectView`를 default 체인에 삽입(Onco 뒤, Shared 앞):
```
… ?? Onco ?? Hospice ?? Shared ?? Clinic
```
`HospiceObjectView`는 4종 switch(hospicebed `props.occupied`, adlkitchen `props.w`), 그 외 `null`.

## 렌더 z / footprint
- 전부 바닥 접지 타원. tint(명상실·선룸 저조도/정원)는 InteriorScreen 오버레이. glass 정원뷰 벽.
- 충돌: [business-rules](business-rules.md).
