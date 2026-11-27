---
artifact: frontend-components
build-spec: departments/dermcenter
updated: 2026-07-15
---

# Derm Center — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/dermEquipment.tsx` (신규, 11종)
포팅 규약: `interior-objects-derm2.jsx`(10) + `interior-dermcenter.jsx`의 로컬 `SkinAnatomy`를 `Box`+react-native-svg로 1:1(`S=TILE/16`, offX/offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`(LN₂)→shape. Dermatoscope의 회전 스코프 헤드는 `<G rotation={-30} originX originY>`로 재현.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `dermatoscope` | Dermatoscope | 피부 확대경(스탠드+관절암, 회전 헤드) |
| `woodslamp` | WoodsLamp | 우드등(자외선 진단, 보라 글로우) |
| `uvbooth` | UVBooth | 전신 광선치료 부스(311nm 청색 배열) |
| `handuvbox` | HandUVBox | 국소 손/발 UV 박스 |
| `gogglesanitizer` | GoggleSanitizer | 보호 고글 UV 소독함 |
| `biopsykit` | BiopsyKit | 조직검사 세트(메이요 스탠드: 펀치·포셉·봉합) |
| `biopsybottle` | BiopsyBottle | 포르말린 조직병리 병 |
| `cryotank` | CryoTank | 액체질소 냉동치료 dewar+스프레이 |
| `co2laser` | CO2Laser | CO2 레이저(관절암·Red Dot·비상정지) |
| `lesionchart` | LesionChart(w) | 병변 분류 벽 차트 |
| `skinanatomy` | SkinAnatomy | 피부 구조도 액자(표피/진피/피하) |

## 재사용 (기존 디스패치)
- **pharma**: `clinicReception`(분홍 톤).
- **er**: `sofa`·`coffeetable`·`walltv`·`watercooler`·`dressing`·`wastebin`·`baylabel`.
- **or**: `surgicallight`(OVERHEAD)·`instrumenttray`.
- **shared**: `ibed`(variant `ward`/`or`)·`imonitor`·`ireception`·`ichair`·`icabinet`(variant `sterile`)·`iplant`.

## 디스패치 (`objects/index.tsx`)
`DermObjectView`를 default 체인에 삽입(Ortho 뒤, Shared 앞):
```
Er ?? Or ?? Icu ?? Peds ?? Pharma ?? Ward ?? Surg ?? Ortho ?? Derm ?? Shared ?? Clinic
```
`DermObjectView`는 derm2 11종 switch, 그 외 `null`. clinicReception은 Pharma가(체인상 앞) 처리.

## 렌더 z / footprint
- 대부분 바닥(zFor(baseY)). `lesionchart`·`skinanatomy`는 벽 → `z:1`. `surgicallight` OVERHEAD. 마커는 핫스팟.
- 충돌: [business-rules](business-rules.md) — 신규는 props{w,h}로만 차단, 벽/소품류는 h 미부여로 비충돌.
