---
artifact: frontend-components
build-spec: departments/er
status: IMPLEMENTED
updated: 2026-07-01
---

# Frontend Components — 5g-a ER (렌더)

> 오브젝트 렌더 컴포넌트·z-order. 배치 데이터는 [`domain-entities.md`](domain-entities.md). 공통 파이프라인은 [README](../README.md) §오브젝트 렌더.

## 1. 컴포넌트 트리 (렌더 셸)
```
InteriorScreen
├── TileFloor (clinical 팔레트)
├── Tint / TriageLine (바닥 오버레이)
├── objects[] → InteriorObjectView (z = baseY 정렬)
│   └── ErObjectView ?? SharedObjectView ?? ...
├── AmbientNpc[] (RoleSprite)
├── HotspotMarker[] (마커, z 9000)
└── RoomMask (최상, 현재 region 밖 옅게)
```

## 2. 디스패치
- `objects/index.tsx` `InteriorObjectView`: 구조 타입(door/threshold/glass/tint/…) 특수 처리, 나머지 → **`ErObjectView ?? OrObjectView ?? IcuObjectView ?? SharedObjectView ?? ClinicObjectView`**.

## 3. 카탈로그 (`objects/erEquipment.tsx` = `ErObjectView`)
SoT er/er2/er3 픽셀 1:1: Gurney·Defib·OxygenTank·GloveDispenser·SharpsContainer·HandSanitizer·EKG·Sink·Whiteboard·Scale·CompCart·BPCuff·SuctionUnit·Wheelchair·VitalsCart·IVPump·DressingCart·WaitingDisplay·WasteBin·PPEStand·MedFridge·SecurityScanner·MetalDetector·BoltedBed·DeconShower·FloorDrain·ChemDrum·Sofa·CoffeeTable·TissueBox·FloorLamp·FramedPicture·Otoscope·AnatomyPoster·PressureGauge·BarcodePrinter·WallTV·CCTVCamera·TicketDispenser·BrochureRack·DeskPhone·WaterCooler·ChartBinder·NurseStationDesk(ㄷ)·TriageLine·BayLabel.

## 4. 공용 프리미티브 (`objects/sharedEquipment.tsx`)
ibed·imonitor·iiv·ireception·ichair·iplant·icabinet·examstool·instrumenttray·xrayviewbox·castcart·surgicallight·ventilator·crashcart·pyxis·bankofmonitors + glass·threshold(`structures.tsx`).

## 5. 렌더 특이 (z-order / 화면 상태)
- `surgicallight` = **OVERHEAD**(z 8000, 오브젝트·스프라이트 위) — 천장 조명이 필드 위에 뜸 + 하향 빔/바닥 글로우.
- `bankofmonitors` = **CEILING**(배경 저 z).
- 마커 z 9000 / RoomMask 최상. 마커 소스별 dy(npc는 머리 위로 더 높게).
- 포팅 규약: `Box` 헬퍼(`S=TILE/16`) + `<Svg viewBox>`, `<text>` 글리프는 도형 대체.

## 6. 디자인 SoT 매핑
`interior-objects-er{,2,3}.jsx`의 각 컴포넌트 → 위 카탈로그 1:1. div 기반 레퍼런스는 SVG rect로 재구성.
