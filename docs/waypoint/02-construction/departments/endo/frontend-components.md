---
artifact: frontend-components
build-spec: departments/endo
updated: 2026-07-18
---

# Endoscopy — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/endoEquipment.tsx` (신규, 4종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`(CO₂)→shape.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `endotower` | EndoTower | 내시경 타워(뷰어향 점막 모니터·제논 광원·비디오 프로세서·CO2·키보드) |
| `scopewasher` | ScopeWasher | 자동 세척·재처리기 AER(원형 세척조 2개·코일 스코프·제어판) |
| `scopecabinet` | ScopeCabinet | 내시경 수직 걸이 보관장(유리문·행잉 스코프 3) |
| `procedurebed` | ProcedureBed | 전동 시술 베드(측와위 웨지·머리 받침·페달) |

## 재사용 (기존 디스패치)
- **er**: `oxygen`·`suction`·`waste`(wastebin)·`baylabel`.
- **shared/struct**: `sinkor`·`ibed`·`imonitor`·`iiv`·`ireception`·`ichair`·`icurtain`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`EndoObjectView`를 default 체인에 삽입(Rad 뒤, Shared 앞):
```
… ?? Rad ?? Endo ?? Shared ?? Clinic
```
`EndoObjectView`는 4종 switch, 그 외 `null`.

## 렌더 z / footprint
- 전부 바닥 접지 타원. EndoTower는 tall(offY -18). ScopeCabinet 유리문.
- 충돌: [business-rules](business-rules.md) — 신규 props{w,h}.
