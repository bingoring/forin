---
artifact: frontend-components
build-spec: departments/or
status: IMPLEMENTED
updated: 2026-07-01
---

# Frontend Components — 5g-b OR (렌더)

> 공통 파이프라인/디스패치는 [er/frontend-components.md](../er/frontend-components.md).

## 1. 카탈로그 (`objects/orEquipment.tsx` = `OrObjectView`)
BairHugger·Bovie·KickBucket·TimeoutBoard·RoboticConsole·LapTower·CO2Insufflator·ScrubDispenser·ScrubTimer·ConsentClipboard·SoiledCart·ORBoomMonitor·CArm·AnesthesiaMachine·StatusBoard.

## 2. 공용 프리미티브
ibed(or)·imonitor·iiv·icurtain·icabinet(sterile·linen·drug·equipment·supply)·sinkor·surgicallight·instrumenttray·bankofmonitors·nursedeski·crashcart + sofa·coffeetable·walltv·watercooler·iplant·ichair·sanitizer·compcart·suction.

## 3. 렌더 특이 (z-order)
- `surgicallight` = OVERHEAD(8000) · `orboommonitor` = CEILING(배경 저 z).

## 4. 디자인 SoT 매핑
`interior-objects-or2.jsx` 각 컴포넌트 → §1 카탈로그 1:1.
