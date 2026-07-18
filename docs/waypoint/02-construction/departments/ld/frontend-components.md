---
artifact: frontend-components
build-spec: departments/ld
updated: 2026-07-18
---

# L&D — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/ldEquipment.tsx` (신규, 2종)
포팅 규약: `Box`+react-native-svg로 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). ld2의 잔여 obstetric 전용 2종만 — 나머지 ld2 컴포넌트는 nursery/womenkids 카탈로그가 이미 커버.

| 타입 | 컴포넌트 | 소스 | 비고 |
|---|---|---|---|
| `birthingbed` | BirthingBed | `interior-objects-ld2.jsx` | 분만대(등받이 각도·다리 거치대 stirrups·사이드 레일) |
| `deliverycart` | DeliveryCart | `interior-objects-ld2.jsx` | 분만 기구 카트(멸균 드레이프·겸자/클램프·2단 서랍) |

## 재사용 (기존 디스패치)
- **nursery(ld2)**: `bassinet`(tag)·`infantwarmer`·`nursingrecliner`·`warmercabinet`.
- **womenkids(ld2)**: `fetalmonitor`.
- **er**: `vitals`·`chartbinder`·`compcart`·`baylabel`. **ward**: `handrail`.
- **shared/struct**: `nursestation`·`deskphone`·`icabinet`·`ireception`·`iiv`·`imonitor`·`ibed`·`icurtain`·`glass`·`sinkor`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`LdObjectView`를 default 체인에 삽입(WomenKids 뒤, Shared 앞):
```
… ?? Nursery ?? WomenKids ?? Ld ?? Shared ?? Clinic
```
`LdObjectView`는 `birthingbed`·`deliverycart` 2종 switch, 그 외 `null`. bassinet/infantwarmer 등은 체인 앞단 Nursery가, fetalmonitor는 WomenKids가 처리.

## 렌더 z / footprint
- 전부 바닥(zFor(baseY), 접지 타원). glass는 struct(유리벽), nursestation은 개방 well(비충돌).
- 충돌: [business-rules](business-rules.md) — 신규 블로커는 props{w,h}로 차단.
