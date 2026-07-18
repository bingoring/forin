---
artifact: frontend-components
build-spec: departments/morgue
updated: 2026-07-18
---

# Morgue & Autopsy — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/morgueEquipment.tsx` (신규, 3종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). 배열 map(냉장 챔버 도어·부검대 배수공)은 RN 리스트로 재현.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `cadaverfridge` | CadaverFridge(w) | 시신 냉장 다단 캐비닛(스테인리스 뱅크·cols×3 챔버 도어·핸들·ID 카드 슬롯, preserveAspectRatio none) |
| `autopsytable` | AutopsyTable | 부검대(천공 배수판 7×11·rim·헹굼 수전·배수 스파우트·중앙 페데스탈) |
| `viewingbier` | ViewingBier | 유족 참관 안치대(catafalque·백색 드레이프·주름·백합 한 송이·양측 촛대 은은한 조명) |

## 재사용 (기존 디스패치)
- **er**: `gurney`(이송 트롤리). **spd**: `autoclave`(설비). **or**: `sinkor`·`instrumenttray`.
- **shared/struct**: `ireception`·`chartbinder`·`deskphone`·`handsanitizer`·`monitor`·`wastebin`(infectious)·`icabinet`(variant equipment)·`chair`·`plant`·`baylabel`·`tint`.

## 디스패치 (`objects/index.tsx`)
`MorgueObjectView`를 default 체인에 삽입(Spd 뒤, Shared 앞):
```
… ?? Lounge ?? Spd ?? Morgue ?? Shared ?? Clinic
```
`MorgueObjectView`는 3종 switch(cadaverfridge `props.w`), 그 외 `null`.

## 렌더 z / footprint
- CadaverFridge/AutopsyTable/ViewingBier 바닥 접지 타원. 전면 저조도 Tint가 지하 무드.
- 충돌: [business-rules](business-rules.md).
