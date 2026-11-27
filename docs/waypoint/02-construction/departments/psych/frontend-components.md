---
artifact: frontend-components
build-spec: departments/psych
updated: 2026-07-18
---

# Inpatient Psych — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/psychEquipment.tsx` (신규, 3종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지).

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `safebed` | SafeBed(occupied) | 바닥 볼트 고정 안전 침대(자해 방지, 일체형 몰드 플린스·둥근 모서리·no ligature) |
| `seclusionpad` | SeclusionPad(w) | 안정실 패딩 매트(퀼트 완충, 바닥, 비충돌) |
| `grouptable` | GroupTable | 데이룸 원형 그룹 활동 테이블(모서리 없음·중앙 페데스탈) |

> ObsWindow는 nurseryEquipment에 존재(정신과 관찰창·안정실 관찰창 공유). MetalDetector는 er의 `detector`.

## 재사용 (기존 디스패치)
- **nursery**: `obswindow`. **er**: `detector`(MetalDetector)·`walltv`·`watercooler`·`compcart`·`baylabel`.
- **shared/struct**: `icabinet`(variant linen/drug)·`nursestation`·`deskphone`·`chartbinder`·`ichair`·`ireception`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`PsychObjectView`를 default 체인에 삽입(Geri 뒤, Shared 앞):
```
… ?? Geri ?? Psych ?? Shared ?? Clinic
```
`PsychObjectView`는 3종 switch(safebed `occupied!==false`, seclusionpad `props.w`), 그 외 `null`. obswindow는 체인 앞단 Nursery가 처리.

## 렌더 z / footprint
- SafeBed/GroupTable 바닥 접지 타원. SeclusionPad(바닥 매트, 비충돌)·ObsWindow(관찰창).
- 충돌: [business-rules](business-rules.md).
