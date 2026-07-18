---
artifact: frontend-components
build-spec: departments/nursery
updated: 2026-07-18
---

# Nursery — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/nurseryEquipment.tsx` (신규, 5종)
포팅 규약: `Box`+react-native-svg로 1:1(`S=TILE/16`, offX/offY=핸드오프 `-N`, ground-shadow 유지). 전용 objects2가 없어 소스 분산:

| 타입 | 컴포넌트 | 소스 | 비고 |
|---|---|---|---|
| `bassinet` | Bassinet(tag) | `interior-objects-ld2.jsx` | 투명 아크릴 통+신생아+네임카드+카트 |
| `infantwarmer` | InfantWarmer | `interior-objects-ld2.jsx` | 복사 히터 포스트+핑크 배시넷 트레이+제어판 |
| `nursingrecliner` | NursingRecliner | `interior-objects-ld2.jsx` | 수유 리클라이너+C자 수유쿠션 |
| `warmercabinet` | WarmerCabinet | `interior-objects-ld2.jsx` | 보온 담요 유리문 캐비닛(벽 부착=비충돌) |
| `obswindow` | ObsWindow(w) | `interior-objects-psych2.jsx` | 안전유리 관람창+멀리언(preserveAspectRatio none, 가로 스팬) |

> Bassinet/InfantWarmer/NursingRecliner/WarmerCabinet는 **L&D·산후 병동에서 재사용** 예정 — 해당 구현 시 이 카탈로그 공유 또는 ld 전용으로 승격 검토. ObsWindow는 정신과 폐쇄병동과 공유.

## 재사용 (기존 디스패치)
- **shared**: `sinkor`·`ireception`·`ichair`·`icurtain`·`iplant`.
- **or**: `scrubdispenser`. **icu**: `gownbox`. **er**: `compcart`·`sofa`·`coffeetable`·`baylabel`.
- **peds**: `babyscale`·`phototherapy`(w)·`milkfridge`.

## 디스패치 (`objects/index.tsx`)
`NurseryObjectView`를 default 체인에 삽입(Infusion 뒤, Shared 앞):
```
… ?? Derm ?? Infusion ?? Nursery ?? Shared ?? Clinic
```
`NurseryObjectView`는 5종 switch(bassinet `props.tag`, obswindow `props.w`), 그 외 `null`.

## 렌더 z / footprint
- 전부 바닥(zFor(baseY)). `obswindow`는 벽 창(Box z=3, 접지 타원 없음, preserveAspectRatio none으로 가로 신축).
- 충돌: [business-rules](business-rules.md) — 신규 블로커는 props{w,h}로만 차단, warmercabinet/obswindow는 비충돌(obswindow는 벽 rect가 차단).
