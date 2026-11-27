---
artifact: frontend-components
build-spec: departments/rehab
updated: 2026-07-18
---

# Rehabilitation PT/OT — Frontend Components (카탈로그 · 재사용 · 디스패치)

## 카탈로그 `objects/rehabEquipment.tsx` (신규, 5종)
포팅 규약: `Box`+react-native-svg 1:1(`S=TILE/16`, offY=핸드오프 `-N`, ground-shadow 유지).

| 타입 | 컴포넌트 | 비고 |
|---|---|---|
| `parallelbars` | ParallelBars(w) | 평행봉 보행 훈련(양측 목재 손잡이·보행 매트·chrome uprights) |
| `therapymat` | TherapyMat | 승강식 치료 매트 테이블(유압 리프트·페달) |
| `treadmill` | Treadmill | 재활 트레드밀(손잡이·콘솔·러닝 벨트) |
| `shoulderpulley` | ShoulderPulley | 벽 부착 어깨 도르래 운동기(로프·핸들) |
| `gymballrack` | GymBallRack | 짐볼 크래들 랙(치료용 볼 2-3) |

> ADLKitchen은 rehab2 원본이나 hospiceEquipment에 이미 존재(hospice가 먼저 구현) → 체인상 Hospice가 처리. WalkerRack은 surg의 `walkerrack`.

## 재사용 (기존 디스패치)
- **hospice**: `adlkitchen`. **surg**: `walkerrack`.
- **er**: `compcart`·`baylabel`.
- **shared/struct**: `ibed`·`imonitor`·`ireception`·`ichair`·`iplant`.

## 디스패치 (`objects/index.tsx`)
`RehabObjectView`를 default 체인에 삽입(Psych 뒤, Shared 앞):
```
… ?? Psych ?? Rehab ?? Shared ?? Clinic
```
`RehabObjectView`는 5종 switch(parallelbars `props.w`), 그 외 `null`.

## 렌더 z / footprint
- Treadmill/TherapyMat/GymBallRack 바닥 접지 타원. ParallelBars(보행 매트, 비충돌)·ShoulderPulley(벽).
- 충돌: [business-rules](business-rules.md).
