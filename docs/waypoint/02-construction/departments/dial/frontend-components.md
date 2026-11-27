---
artifact: frontend-components
build-spec: departments/dial
updated: 2026-07-18
---

# Hemodialysis — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/dialEquipment.tsx` (신규, 3종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지).

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `dialysismachine` | DialysisMachine | 혈액투석기(터치스크린·혈액펌프 회전자·앰버 다이알라이저·혈액라인) |
| `dialysischair` | DialysisChair(occupied) | 투석 리클라이너(AV-fistula 팔 지지대·담요·리클라인 등받이) |
| `rowaterunit` | ROWaterUnit | 역삼투(RO) 수처리(트윈 멤브레인 실린더·제어 캐비닛·매니폴드) |

## 재사용 (기존 디스패치)
- **er**: `compcart`·`waste`(wastebin)·`baylabel`. **peds**: `stadiometer`.
- **shared/struct**: `nursestation`·`sinkor`·`imonitor`·`ireception`·`ichair`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`DialObjectView`를 default 체인에 삽입(Endo 뒤, Shared 앞):
```
… ?? Rad ?? Endo ?? Dial ?? Shared ?? Clinic
```
`DialObjectView`는 3종 switch(dialysischair `props.occupied`), 그 외 `null`.

## 렌더 z / footprint
- 전부 바닥 접지 타원. DialysisMachine tall(offY -18). 중앙 nursestation 개방 아일랜드(비충돌).
- 충돌: [business-rules](business-rules.md) — 신규 props{w,h}.
