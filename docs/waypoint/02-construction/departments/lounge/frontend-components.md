---
artifact: frontend-components
build-spec: departments/lounge
updated: 2026-07-18
---

# Staff Lounge / Locker / Cafeteria — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/loungeEquipment.tsx` (신규, 4종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). 배열 map(락커 칸·자판기 상품 그리드·배식 온장 웰)은 RN 리스트로 재현.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `lockerbank` | LockerBank(w) | 직원 사물함 뱅크(2단×여러 칸·환기구·손잡이, preserveAspectRatio none) |
| `vending` | Vending | 자판기(유리 상품 디스플레이 4×3·키패드·배출구) |
| `diningtable` | DiningTable | 식당 4인 테이블(둥근 상판·트레이 2·다리) |
| `serverycounter` | ServeryCounter(w) | 배식 카운터(sneeze-guard 유리·온장 웰·트레이 레일) |

## 재사용 (기존 디스패치)
- **infusion(onco2/icu)**: `coffeemachine`. **nursery(ld2)**: `nursingrecliner`.
- **er/or**: `sink`. **er**: `coffeetable`·`sofa`·`walltv`·`watercooler`·`handsanitizer`·`baylabel`.
- **shared**: `ichair`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`LoungeObjectView`를 default 체인에 삽입(Sim 뒤, Shared 앞):
```
… ?? Sim ?? Lounge ?? Shared ?? Clinic
```
`LoungeObjectView`는 4종 switch(lockerbank/serverycounter `props.w`), 그 외 `null`.

## 렌더 z / footprint
- Vending/DiningTable/ServeryCounter 바닥 접지 타원. LockerBank(벽 부착, 비충돌).
- 충돌: [business-rules](business-rules.md).
