---
build-spec: reputation
artifact: domain-entities
updated: 2026-08-10
---

# Domain & Entities — 평판 획득

## 1. 엔티티 개요

| 엔티티 | 저장소 | 비고 |
|---|---|---|
| `Dimension` | 코드 allowed-set | 평판 축. 직업별 카탈로그로 묶인다 |
| `Acuity` | 콘텐츠(`Scenario.acuity`) | 시나리오가 스스로 선언하는 긴급도 |
| 평판 값 | PG `user_progress` 3컬럼 | 지금은 컬럼, 이음매는 이름 기반(§index §3) |

## 2. 엔티티 상세

### `Dimension`

```go
type Dimension string

const (
    DimPatientSatisfaction Dimension = "patient_satisfaction"
    DimPeerTrust           Dimension = "peer_trust"
    DimEmergencyResponse   Dimension = "emergency_response"
)
```

**직업별 카탈로그.** 간호사의 "환자 만족도"는 프로그래머에게 의미가 없다. 그래서 차원은
전역 상수가 아니라 **직업에 속한다**:

```go
type Catalog struct {
    Profession string
    Dims       []Dimension
    // Colleague roles that read the peer dimension for THIS profession
    // (nurse: doctor/charge/…; 다른 직업은 다른 어휘를 쓴다)
    ColleagueRoles []string
    Peer, Client, Urgent Dimension  // 역할군 → 차원
}

var catalogs = map[string]Catalog{ "nurse": {...} }
func CatalogFor(profession string) Catalog  // 미등록 직업은 nurse로 폴백하지 않고 zero → 적용 스킵
```

직업 #2를 추가하는 일 = **카탈로그 한 항목 추가**. 해석기·저장소·호출부는 그대로.

### `Acuity` (콘텐츠 선언)

```go
type Acuity string
const (
    AcuityRoutine  Acuity = "routine"   // 기본값(미기재 시)
    AcuityUrgent   Acuity = "urgent"    // 돌발 — 어느 병동에서나 일어난다
    AcuityCritical Acuity = "critical"  // 응급 — Code Blue, 급변
)
```

```yaml
# content/nurse/scenarios/SCN-WARD-00007.yaml
acuity: urgent   # 내과 병동이어도 돌발이면 응급 대응력이 움직인다
```

**왜 부서가 아니라 시나리오인가.** 부서로 판단하면 (a) ER 밖의 돌발이 잡히지 않고 —
병동 급변·투약 사고·수술장 위기는 어디서나 일어난다 — (b) 부서 문자열은 직업마다 달라
다음 직업에서 통째로 다시 써야 한다. 긴급도는 **상황의 성질**이라 직업과 무관하게 이식된다.

## 3. 관계

```
Scenario ──(acuity)──┐
                     ├──▶ Resolve(profession, personaRole, acuity) ──▶ Dimension
Persona.Role ────────┘
```

## 4. 열거형 / Allowed-set

전부 코드측. `acuity`는 콘텐츠 로딩 시 검증하되 **미기재는 에러가 아니라 `routine`** —
기존 시나리오 수백 개를 한꺼번에 태깅하지 않아도 동작해야 한다.

## 5. SoT 매핑

| 기존 요소 | 이 스펙에서 |
|---|---|
| `reputationDisposition`의 역할 분기 | `reputation.Resolve`로 이관(엔진은 차원만 받는다) |
| `economy.RepBand*` | 그대로 — 소비 측 밴드는 바뀌지 않는다 |
| `progress.PatientSatisfaction` 등 | 저장소가 `Dimension`→컬럼으로 매핑 |
