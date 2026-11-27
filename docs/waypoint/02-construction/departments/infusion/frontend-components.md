---
artifact: frontend-components
build-spec: departments/infusion
updated: 2026-07-18
---

# Infusion Center — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/infusionEquipment.tsx` (신규, 4종)
포팅 규약: `Box`+react-native-svg로 1:1(`S=TILE/16`, offX/offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`(커피 ☕)→shape. 전용 objects2가 없어 소스가 분산:

| 타입 | 컴포넌트 | 소스 | 비고 |
|---|---|---|---|
| `infusionchair` | InfusionChair(occupied) | `interior-objects-onco2.jsx` | 항암 리클라이너(팔걸이·헤드레스트·랩담요·IV라인) |
| `smartinfusionpump` | SmartInfusionPump | `interior-objects-onco2.jsx` | 이중채널 펌프+항암백(amber/clear·보라 hazard)+폴대 |
| `ppestation` | PPEStation | `interior-objects-onco2.jsx` | 방호구 보드(가운·마스크·장갑, 벽부착=비충돌) |
| `coffeemachine` | CoffeeMachine | `interior-icu.jsx` (미포팅분) | 원두 그라인더 커피머신(상단 호퍼·전면 디스플레이·컵) |

> InfusionChair/SmartInfusionPump/PPEStation는 **종양내과(onco) 병동에서 재사용** 예정 — onco 구현 시 이 카탈로그를 공유하거나 oncoEquipment로 승격 검토.

## 재사용 (기존 디스패치)
- **pharma**: `pneumatictube`.
- **er**: `medfridge`·`handsanitizer`·`crashcart`·`compcart`·`watercooler`·`coffeetable`·`deskphone`·`nursestation`·`baylabel`.
- **shared**: `ireception`·`icabinet`(variant `drug`)·`imonitor`·`ichair`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`InfusionObjectView`를 default 체인에 삽입(Derm 뒤, Shared 앞):
```
Er ?? Or ?? Icu ?? Peds ?? Pharma ?? Ward ?? Surg ?? Ortho ?? Derm ?? Infusion ?? Shared ?? Clinic
```
`InfusionObjectView`는 4종 switch(infusionchair는 `props.occupied`), 그 외 `null`.

## 렌더 z / footprint
- 전부 바닥(zFor(baseY)). `ppestation`는 벽 부착이나 접지 타원 유지, 비충돌(props에 h 미부여).
- 충돌: [business-rules](business-rules.md) — 신규 블로커는 props{w,h}로만 차단.
