---
artifact: frontend-components
build-spec: departments/orthoward
updated: 2026-07-14
---

# Ortho Ward — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/orthoEquipment.tsx` (신규, 11종)
포팅 규약: `interior-objects-ortho2.jsx`(10) + `interior-orthoward.jsx`의 로컬 `CMSChart`를 `Box`+react-native-svg로 1:1(`S=TILE/16`, offX/offY=핸드오프 `-N`, ground-shadow 유지). SVG `<text>`→shape.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `tractionframe` | TractionFrame | 골격 견인(철제 틀+도르래+추) — 오버헤드, 침대 위 |
| `cpmmachine` | CPMMachine | 무릎 CPM(다리 거치 크래들) |
| `plastertrapsink` | PlasterTrapSink | 석고 트랩 싱크(하단 필터) |
| `castcutter` | CastCutter | 깁스 절단 전기톱 |
| `castrollshelf` | CastRollShelf(w) | 석고/화이버글래스 롤 보관장(색상별) |
| `bracerack` | BraceRack(w) | 보조기 거치대(목발·지팡이·무릎보조기·CAM부츠) |
| `abductionpillow` | AbductionPillow | 외전 베개(파란 쐐기) |
| `elevatedtoiletguard` | ElevatedToiletGuard | 변기 높이조절+안전 가드 |
| `bedalarm` | BedAlarm | 낙상 경보기(매트+알람 박스) |
| `pacsviewer` | PACSViewer | PACS 듀얼 모니터(뼈 정렬 X-ray) |
| `cmschart` | CMSChart | 신경혈관(CMS) 사정 벽 기록판 |

## 재사용 (기존 디스패치)
- **surg2**: `walker`(**이번에 surgEquipment에 추가** — 외과 병동 render엔 미사용이었음)·`walkerrack`.
- **ward2**: `handrail`·`deskphone`·`fallrisksign`.
- **shared**: `ibed`(variant `or`/`ward`)·`imonitor`·`iiv`·`ichair`·`icurtain`·`nursestation`(ㄷ)·`sofa`·`iplant`.
- **ER**: `dressing`(=DressingCart)·`wheelchair`·`baylabel`.

## 디스패치 (`objects/index.tsx`)
`OrthoObjectView`를 default 체인에 삽입(Surg 뒤, Shared 앞):
```
Er ?? Or ?? Icu ?? Peds ?? Pharma ?? Ward ?? Surg ?? Ortho ?? Shared ?? Clinic
```
재사용 타입은 앞선 뷰(Surg=walker/walkerrack, Ward=handrail 등)가 처리 → Ortho는 ortho2 11종만.

## 렌더 z / footprint
- 대부분 바닥(zFor(baseY)). `castrollshelf`·`bracerack`·`cmschart`는 벽 배경 → `z:1`. `tractionframe`은 침대 위로 솟는 프레임(zFor). 마커는 핫스팟.
- 충돌: [business-rules](business-rules.md) — 신규는 props{w,h}로만 차단.
