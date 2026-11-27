---
build-spec: reputation
artifact: business-logic-model
updated: 2026-08-10
---

# Business Logic Model — 평판 획득

## 1. 워크플로 — `ApplyOnClear`

```
POST /conversation/{id}/complete  (채점 완료)
  1. 기존: 등급 산출 → RecordAttempt(xp, state, grade)
  2. 신규: 등급이 있으면(≥0)
       cat  := reputation.CatalogFor(scenario.Profession)   // 없으면 스킵(R-8)
       dim  := cat.Resolve(scenario.Persona.Role, scenario.Acuity)
       delta:= reputation.Delta(grade)
       repo.ApplyReputation(userID, dim, delta)             // 0~100 클램프
  3. 실패해도 클리어 결과는 그대로 반환 (R-9)
```

## 2. 알고리즘

### `Resolve(personaRole, acuity) → Dimension`

```
acuity != routine        → Urgent   (긴급 차원)   ← 부서 무관, 모든 병동
role ∈ ColleagueRoles    → Peer     (동료 차원)
그 외                     → Client   (환자/의뢰인 차원)
```

긴급도가 **먼저** 걸린다(R-4). 응급 상황에서 상대가 동료여도 평가받는 건 대응력이다.

### `Delta(grade) → int`

합격선(`economy.PassScore`)을 0점으로 놓고 위/아래로 선형:

```
grade ≥ pass:  +round( RepGainMax  × (grade − pass) / (100 − pass) )   // pass에서 0, 100에서 최대
grade <  pass: −round( RepLossMax  × (pass − grade) / pass )           // pass에서 0, 0점에서 최대
```

- 합격선에서 **정확히 0** — "겨우 통과"는 평판을 움직이지 않는다. 잘해야 오른다
- 상승 최대(+6)를 하락 최대(−4)보다 크게 둔다: 학습 앱에서 회복이 추락보다 쉬워야 한다
- 단조(INV-3)

## 3. 상태 전이

평판은 상태 기계가 아니라 스칼라다. 소비 측 밴드만 전이한다:

```
distrust(<25) ─┬─▶ wary(≥25) ─┬─▶ cordial(≥50) ─┬─▶ warm(≥75)
               └──────────────┴─────────────────┴── (하락 시 역방향)
```

기본값 50은 cordial의 하단 — **밴드가 실제로 움직이려면 상승이 필요**하다.

## 4. 통합 지점

| 기존 | 변경 |
|---|---|
| `conversation.Engine.complete` | 평판 적용 훅 1곳 추가 |
| `Engine.reputationDisposition` | 역할 분기를 `reputation.Resolve`로 교체 + 긴급 차원 지원 |
| `ports.ProgressRepo` | `ApplyReputation(ctx, userID, dim, delta)` 추가 |
| `economy` | `RepGainMax`/`RepLossMax` 추가 |
| 콘텐츠 로더 | `acuity` 파싱(미기재 = routine) |
