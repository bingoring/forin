---
artifact: frontend-components
build-spec: departments/specialty
updated: 2026-07-18
---

# Specialty OPD — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/specialtyEquipment.tsx` (신규, 4종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). VisionChart의 SVG `<text>` Snellen 눈금표는 감소형 shape 바로 대체.

| 타입 | 컴포넌트 | 소스 | 비고 |
|---|---|---|---|
| `slitlamp` | SlitLamp | `interior-objects-eye2.jsx` | 세극등 현미경(턱/이마 받침·쌍안 현미경·슬릿 빔·조이스틱) |
| `phoropterstand` | PhoropterStand | `interior-objects-eye2.jsx` | 검안기 포롭터(쌍렌즈 다이얼·서스펜션 암·카운터웨이트) |
| `enttowerchair` | ENTTowerChair | `interior-objects-eye2.jsx` | ENT 진료 유닛(전동 체어 + 기구 타워·스코프 화면·행잉 스코프) |
| `visionchart` | VisionChart | `interior-objects-eye2.jsx` | 시력 검사표(벽 조명 박스, Snellen 행) |

## 재사용 (기존 디스패치)
- **er**: `otoscope`·`waitingdisplay`·`compcart`·`baylabel`. **clinic**: `clinicReception`·`ultrasound`.
- **shared/struct**: `ibed`·`imonitor`·`ireception`·`ichair`·`icabinet`(variant supply/equipment)·`iplant`.

## 디스패치 (`objects/index.tsx`)
`SpecialtyObjectView`를 default 체인에 삽입(Dial 뒤, Shared 앞):
```
… ?? Dial ?? Specialty ?? Shared ?? Clinic
```
`SpecialtyObjectView`는 4종 switch, 그 외 `null`. otoscope는 체인 앞단 Er가, clinicReception/ultrasound는 말미 Clinic가 처리.

## 렌더 z / footprint
- SlitLamp/Phoropter/ENTTowerChair 바닥 접지 타원. VisionChart는 벽(비충돌). ultrasound는 props{w,h}로 차단.
- 충돌: [business-rules](business-rules.md).
