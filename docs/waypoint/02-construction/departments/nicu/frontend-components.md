---
artifact: frontend-components
build-spec: departments/nicu
updated: 2026-07-18
---

# NICU — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/nicuEquipment.tsx` (신규, 4종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`(온·습도 36.8/65%)→shape 블록.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `nicuisolette` | NICUIsolette(occupied) | 폐쇄형 인큐베이터(아크릴 후드·포트홀·온습도 readout·swaddle) |
| `giraffewarmer` | GiraffeWarmer | 개방·폐쇄 겸용 워머(승강 후드 기둥·복사히터·배시넷) |
| `cpapunit` | CPAPUnit | 신생아 비강 CPAP(파형·가습 챔버·가열 회로·폴대) |
| `phototherapyled` | PhototherapyLED(w) | 황달 LED 광선판(오버헤드 청색광, preserveAspectRatio none) |

## 재사용 (기존 디스패치)
- **shared**: `bankofmonitors`·`imonitor`·`sinkor`·`nursestation`·`iplant`·`glass`·`tint`.
- **peds**: `milkfridge`. **er**: `crashcart`·`handsanitizer`·`deskphone`·`baylabel`. **or**: `scrubdispenser`. **icu**: `gownbox`. **nursery(ld2)**: `nursingrecliner`.

## 디스패치 (`objects/index.tsx`)
`NicuObjectView`를 default 체인에 삽입(Ld 뒤, Picu 앞):
```
… ?? Ld ?? Nicu ?? Picu ?? Shared ?? Clinic
```
`NicuObjectView`는 4종 switch(nicuisolette `props.occupied!==false` 기본 true, phototherapyled `props.w`), 그 외 `null`.

## 렌더 z / footprint
- 바닥 오브젝트 접지 타원. phototherapyled는 오버헤드(z=1, 비충돌). tint는 InteriorScreen이 별도 오버레이 렌더.
- 충돌: [business-rules](business-rules.md).
