---
artifact: frontend-components
build-spec: departments/rad
updated: 2026-07-18
---

# Radiology — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/radEquipment.tsx` (신규, 5종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`(⚠ MAGNET ON)→shape 블록.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `ctscanner` | CTScanner | CT 도넛 갠트리(동심 보어 링·시안 aperture glow·환자 커치) |
| `mriscanner` | MRIScanner | 대형 MRI(긴 보어 자석·블루 aperture·환자 테이블·자기안전 라인) |
| `xrayunit` | XrayUnit | 천장 레일 X선 튜브+콜리메이터+벽 Bucky+촬영 테이블 |
| `controlconsole` | ControlConsole | 촬영 제어 콘솔(납유리 차폐창·듀얼 모니터·노출 버튼) |
| `leadapronrack` | LeadApronRack | 납 방호복 걸이대(청/녹 앞치마 2벌) |

## 재사용 (기존 디스패치)
- **ortho**: `pacsviewer`. **er**: `waitingdisplay`·`vitals`·`baylabel`. **ward**: `handrail`.
- **shared/struct**: `ibed`·`imonitor`·`ireception`·`ichair`·`glass`·`tint`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`RadObjectView`를 default 체인에 삽입(Picu 뒤, Shared 앞):
```
… ?? Nicu ?? Picu ?? Rad ?? Shared ?? Clinic
```
`RadObjectView`는 5종 switch, 그 외 `null`.

## 렌더 z / footprint
- 스캐너류 바닥 접지 타원(대형). ControlConsole은 shadow rect. pacsviewer 벽 뷰어. tint는 InteriorScreen 오버레이(판독실 저조도).
- 충돌: [business-rules](business-rules.md) — 스캐너/콘솔 props{w,h}, 제어부스 glass.
