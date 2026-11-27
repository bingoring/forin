---
artifact: frontend-components
build-spec: departments/womenkids-opd
updated: 2026-07-18
---

# Women & Kids OPD — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/womenkidsEquipment.tsx` (신규, 1종)
포팅 규약: `Box`+react-native-svg로 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`(FHR "142")→shape 블록.

| 타입 | 컴포넌트 | 소스 | 비고 |
|---|---|---|---|
| `fetalmonitor` | FetalMonitor | `interior-objects-ld2.jsx` | 태아 심박·자궁수축 CTG 카트(이중 파형 핑크/시안 + 트랜스듀서 2 + 프린트아웃) |

> FetalMonitor는 **L&D·산후 병동에서 재사용** 예정 — 해당 구현 시 이 카탈로그 공유 또는 ld 전용 승격 검토.

## 재사용 (기존 디스패치)
- **clinic**: `clinicReception`(핑크 톤)·`ultrasound`.
- **peds**: `babyscale`·`stadiometer`·`tonguejar`·`stickerroll`·`smallslide`·`rockinghorse`·`toychest`·`blocks`·`mural`·`playmat`.
- **er**: `watercooler`·`baylabel`.
- **shared**: `ibed`(variant `ward`/`peds`)·`ireception`·`ichair`·`imonitor`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`WomenKidsObjectView`를 default 체인에 삽입(Nursery 뒤, Shared 앞):
```
… ?? Infusion ?? Nursery ?? WomenKids ?? Shared ?? Clinic
```
`WomenKidsObjectView`는 `fetalmonitor` 단일 switch, 그 외 `null`. clinicReception/ultrasound는 체인 말미 Clinic가 처리.

## 렌더 z / footprint
- fetalmonitor 바닥(zFor(baseY), 접지 타원). playmat/mural은 비충돌 오버레이/벽.
- 충돌: [business-rules](business-rules.md) — fetalmonitor는 props{w,h} 2×2로 차단.
