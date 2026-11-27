---
artifact: frontend-components
build-spec: departments/geri
updated: 2026-07-18
---

# Geriatric / Dementia — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/geriEquipment.tsx` (신규, 5종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지). OrientationBoard의 SVG `<text>` 날짜는 amber shape로 대체.

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `lowbed` | LowBed(occupied) | 초저상 낙상 방지 침대(양옆 크래시 매트 + 발치 센서 매트) |
| `memorybox` | MemoryBox | 병실문 옆 회상 상자(사진·추억 물건, 방 찾기 단서, 벽) |
| `orientationboard` | OrientationBoard(w) | 현실 인식 게시판(날짜·요일·계절·날씨, 벽) |
| `gerireclinechair` | GeriReclineChair(occupied) | 노인용 리클라이너(높은 팔걸이·발판) |
| `handrailwall` | HandrailWall(w) | 복도 연속 손잡이(배회 안전, 벽 부착) |

## 재사용 (기존 디스패치)
- **hospice**: `comfortcart`. **er**: `coffeetable`·`framedpic`·`vitals`·`walltv`·`baylabel`.
- **shared/struct**: `nursestation`·`deskphone`·`chartbinder`·`sofa`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`GeriObjectView`를 default 체인에 삽입(Hospice 뒤, Shared 앞):
```
… ?? Hospice ?? Geri ?? Shared ?? Clinic
```
`GeriObjectView`는 5종 switch(lowbed `props.occupied`, gerireclinechair `occupied!==false`, orientationboard/handrailwall `props.w`), 그 외 `null`.

## 렌더 z / footprint
- LowBed/GeriReclineChair 바닥 접지 타원. HandrailWall(z=1)·OrientationBoard·MemoryBox 벽 부착(비충돌).
- 충돌: [business-rules](business-rules.md).
