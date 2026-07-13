---
artifact: frontend-components
build-spec: departments/pharma
updated: 2026-07-12
---

# Pharmacy — Frontend Components (카탈로그 · 렌더 · 디스패치)

## 카탈로그 `objects/pharmaEquipment.tsx` (신규, 21종)
포팅 규약: 핸드오프 `interior-pharma.jsx`(helpers) + `interior-objects-pharma2.jsx`(window.*)의 SVG를 `Box`+react-native-svg로 1:1. `Box`는 핸드오프의 `left:x*ITILE + off` / `top:y*ITILE - N`을 그대로 매핑(offX/offY = 핸드오프 `-N`, w/h = viewBox 치수, Svg `width={vb*S}`, `S=TILE/16`). v13 접지 그림자 타원은 각 바닥 오브젝트 첫 자식으로 유지.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `pharmacounter` | PharmaCounter(w) | 픽업 카운터(상판+전면 밴드) |
| `countersign` | CounterSign(text,color) | 걸이 사인(RN View+Text, DungGeunMo) |
| `shelflabel` | ShelfLabel(text,warn) | 약장 태그(View+Text) |
| `floortape` | FloorTape(w,text) | 무균 라인 바닥 테이프(View+Text) |
| `wallphone` | WallPhone(ringing) | 벽 전화 + ♪♫(RN View/Text) |
| `fridgepharma` | FridgePharma | 유리문 약품 냉장고(4°) |
| `medcart` | MedCart | AM/PM/HS 서랍 카트 |
| `centrifuge` | Centrifuge | 원심분리기(정적) |
| `printlabel` | PrintLabel | 라벨 프린터 |
| `pneumatictube` | PneumaticTube | 기송관 도킹(적색등) |
| `tubecapsulerack` | TubeCapsuleRack | 캡슐 거치대 6 |
| `returnbox` | ReturnBox | 반납함 |
| `barcodescanner` | BarcodeScanner | 스캐너+레이저 |
| `atcmachine` | ATCMachine | 자동 조제기(빌딩형) |
| `lasashelf` | LASAShelf(w) | 고위험 LASA 선반(적색 헤더) |
| `narcoticsvault` | NarcoticsVault | 이중잠금 금고(지문+다이얼) |
| `bsc` | BSC | 생물안전작업대 |
| `magnehelicgauge` | MagnehelicGauge | 차압계 다이얼 |
| `chemospillkit` | ChemoSpillKit | 항암 유출 키트 |
| `tackymat` | TackyMat(w) | 점착 매트 |
| `medwallshelf` | MedWallShelf(w,shelves) | 흰 약품 책장(절차 생성 병/박스) |

**SVG `<text>` 처리**: 기존 카탈로그 규약대로 react-native-svg text 미사용 → 라벨 글리프는 shape 블록으로 대체하거나 생략(NARCOTICS/HEPA/4°/SPIN 등). 단 핸드오프에서 **DIV 라벨**이던 것(CounterSign/ShelfLabel/FloorTape/WallPhone)은 RN `View+Text`(fontFamily `DungGeunMo`)로 1:1 재현.

## 렌더 z / footprint
- 대부분 바닥 오브젝트(zFor(baseY)). `medwallshelf`는 벽면 배경 → `z:1`(장비 뒤). 마커(?/!/→)는 `InteriorScreen`의 `allMarkers`가 오브젝트 `props.marker` + 핫스팟에서 생성.
- 충돌은 [business-rules](business-rules.md) 참조(skip 목록 + props{w,h}).

## 디스패치 (`objects/index.tsx`)
`PharmaObjectView`를 default 체인에 삽입(Peds 뒤, Shared 앞):
```
ErObjectView ?? OrObjectView ?? IcuObjectView ?? PedsObjectView ?? PharmaObjectView ?? SharedObjectView ?? ClinicObjectView
```
`PharmaObjectView`는 21종 switch, 그 외 `null`(체인 통과). 공용 프리미티브(baylabel·ireception·imonitor·icabinet·sinkor·scrubdispenser·gownbox·sanitizer·chartbinder·iplant)는 기존 뷰가 처리.

## 재사용 시 주의
- `icabinet` variant `pharma`(약장). `ireception` = 검수대(더블체크 데스크, w4). 둘 다 fixture `props{w,h}`로 충돌 rect 제공.
- 신규 `medwallshelf`는 **절차 생성**(병/박스 폭·높이·색을 인덱스 해시로) — 핸드오프 로직 그대로 이식(결정적, 렌더 안정).
