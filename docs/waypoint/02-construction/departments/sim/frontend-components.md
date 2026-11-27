---
artifact: frontend-components
build-spec: departments/sim
updated: 2026-07-18
---

# Sim Lab / Nursing Admin — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/simEquipment.tsx` (신규, 4종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). PPEBoard의 SVG `<text>` 단계 번호는 dark shape 바로 대체.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `simmanikin` | SimManikin | 고성능 시뮬 마네킹 베드(전신 마네킹·흉부 센서 리드·제어 태블릿) |
| `controlbooth` | ControlBooth(w) | 원웨이 미러 제어실 부스(관찰 유리·디브리핑 모니터, preserveAspectRatio none) |
| `officedesk` | OfficeDesk | 사무 데스크(모니터·키보드·서류·필통) |
| `ppeboard` | PPEBoard(w) | 감염관리 방호구 착탈의 보드(4단계 색상: 가운·마스크·고글·장갑) |

## 재사용 (기존 디스패치)
- **shared/struct**: `icabinet`(variant supply)·`imonitor`·`ichair`·`iplant`.
- **pharma**: `shelflabel`. **er**: `watercooler`·`waste`·`walltv`·`coffeetable`·`crashcart`·`ivpump`·`baylabel`. **or**: `scrubdispenser`·`ventilator`. **icu**: `gownbox`.

## 디스패치 (`objects/index.tsx`)
`SimObjectView`를 default 체인에 삽입(Rehab 뒤, Shared 앞):
```
… ?? Psych ?? Rehab ?? Sim ?? Shared ?? Clinic
```
`SimObjectView`는 4종 switch(controlbooth/ppeboard `props.w`), 그 외 `null`.

## 렌더 z / footprint
- SimManikin/OfficeDesk 바닥 접지 타원. ControlBooth(z=3 관찰 부스)·PPEBoard(벽 보드) 비충돌.
- 충돌: [business-rules](business-rules.md).
