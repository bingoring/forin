---
artifact: frontend-components
build-spec: departments/icu
status: IMPLEMENTED
updated: 2026-07-01
---

# Frontend Components — 5g-c ICU (렌더)

> 공통 파이프라인/디스패치는 [er/frontend-components.md](../er/frontend-components.md).

## 1. 카탈로그 (`objects/icuEquipment.tsx` = `IcuObjectView`)
CRRTMachine(2×2)·IVPumpTower(6모듈)·EVDStand·ICPMonitor·TTMUnit(2×2)·FoleyBag·Intercom·GownBox·VisitorScreen. `<text>` 글리프는 도형 대체.

## 2. 공용 프리미티브
ibed(ward)·imonitor·iiv·icabinet·sinkor·pyxis·crashcart·ventilator·bankofmonitors·nursedeski·soiledcart + sofa·coffeetable·watercooler·iplant·sanitizer·phone·wastebin·glass·threshold.

## 3. 렌더 특이 (z-order)
- `bankofmonitors` = CEILING(배경 저 z) · glass = 투명 벽(시야 투과, objectCollision 차단) · 마커 소스별 dy.

## 4. 디자인 SoT 매핑
`interior-objects-icu2.jsx` 각 컴포넌트 → §1 카탈로그 1:1.
