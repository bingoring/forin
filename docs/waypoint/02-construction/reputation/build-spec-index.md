---
build-spec: reputation
stage: 02-construction/07-growth-economy-review
status: READY
depth: standard
updated: 2026-08-10
---

# Build Spec — 평판 획득 (NPC 반응 가중의 나머지 절반)

## §0. 개요 & 범위

### 발견 — 소비 측은 이미 있고, 생산 측이 없다

`conversation.Engine.reputationDisposition`(engine.go:154)이 **이미** 평판을 NPC 톤에 반영한다:
NPC 역할로 차원을 고르고(동료→동료 신뢰도, 그 외→환자 만족도), 착용 칭호 보너스를 더한 뒤
4개 밴드(warm/cordial/wary/distrust)로 시스템 프롬프트에 한 줄을 주입한다. 임상 사실이나
"역할 유지·코칭 금지" 규칙은 건드리지 않는다.

**그런데 평판을 쓰는 코드가 전 코드베이스에 없다.** `patient_satisfaction`/`peer_trust`/
`emergency_response`는 마이그레이션 기본값 50으로 태어나 읽히기만 한다(`UpsertProgressOnAttempt`는
xp·level·streak만 갱신). 결과:

- 모든 사용자가 영구히 50/50/50 → NPC는 **항상 cordial 밴드**. 밴드 4개가 실질 1개로 동작
- 프로필의 평판 바 3개는 장식
- `emergency_response`는 **소비 측에서도 미사용** — 어떤 NPC 역할에도 매핑돼 있지 않다

따라서 이 스펙의 범위는 "NPC 반응 가중"이 아니라 **평판이 실제로 움직이게 만드는 것**이다.

### 범위 (In)
- 시나리오 클리어 등급 → 평판 차원별 증감
- 차원 결정을 **부서가 아니라 시나리오가 선언한 긴급도**로 (모든 병동 적용 · 직업 확장 대비)
- `emergency_response`를 소비 측에도 연결
- 경제 수치는 `economy` 설정으로 (하드코딩 금지)

### 범위 밖 (Out)
- 시간 감쇠 (확정: 없음)
- 평판을 XP/보상에 연동 (톤에만 영향)
- 직업별 차원 세트의 **저장소 일반화** — §3 선결정 참조

## §1. 분해

| # | 유닛 | 산출물 |
|---|---|---|
| U1 | `reputation` 도메인 | 차원 allowed-set · 직업별 카탈로그 · 해석기 · 등급→델타 |
| U2 | 콘텐츠 스키마 | `Scenario.acuity` (`routine`\|`urgent`\|`critical`) |
| U3 | 저장소 | `ApplyReputation` (차원명 → 컬럼, 0~100 클램프) |
| U4 | 배선 | 클리어 시 적용 · 소비 측에 긴급도 차원 연결 |
| U5 | 경제 수치 | 델타·클램프를 `economy`로 |

## §2. 아티팩트

| 아티팩트 | 상태 |
|---|---|
| [domain-entities](domain-entities.md) | ✅ |
| [business-rules](business-rules.md) | ✅ |
| [business-logic-model](business-logic-model.md) | ✅ |
| frontend-components | **N/A** — 프로필 평판 바가 이미 존재하고 값만 살아난다. 새 화면·컴포넌트 없음 |

## §3. 결정 (2026-08-10)

| 질문 | 결정 |
|---|---|
| 무엇이 평판을 움직이나 | **시나리오 등급 기반.** `ScenarioGrade.Score`(0~100)를 델타로 환산. 추가 입력이 필요 없고 "잘했는가"가 그대로 반영된다 |
| `emergency_response` | **긴급/돌발 시나리오에 매핑.** 단 **부서가 아니라 시나리오가 선언하는 `acuity`** 로 판단 — ER에 묶으면 다른 병동의 돌발이 잡히지 않고, 직업이 늘면 무너진다 |
| 하락 | **저점수·실패 시 하락. 시간 감쇠 없음.** 학습 앱에서 감쇠는 복귀 장벽이 된다 |

**선결정 — 직업 확장의 이음매(seam):**
차원 저장소는 지금은 기존 3컬럼을 유지한다. 대신 **모든 호출부가 차원을 이름으로 다룬다**
(`reputation.Dimension`), 컬럼 매핑은 저장소 안에만 있다. 직업 #2가 실제로 들어오는 시점에
`user_reputation(user_id, dimension, value)` 키-값으로 바꾸면 **호출부는 그대로**다.
지금 키-값으로 가는 것은, 쓰지 않을 일반성을 위해 마이그레이션과 API·UI를 먼저 흔드는 일이다.

## §4. 구현 체크리스트

- [ ] U1 `reputation` 도메인 + 테스트
- [ ] U2 `Scenario.acuity` + 기존 콘텐츠 태깅
- [ ] U3 저장소 `ApplyReputation` (클램프 0~100)
- [ ] U4 클리어 훅 + 소비 측 긴급도 연결
- [ ] U5 economy 수치화
- [ ] 검증(단위·E2E) · STATUS/DECISIONS

## §5. 검증 계획

| 대상 | 방법 |
|---|---|
| 차원 해석 | 긴급도 우선 · 동료 역할 · 기본값. 부서 문자열에 의존하지 않음을 테스트로 고정 |
| 델타 | 만점/합격선/실패 경계, 0·100 클램프 |
| 통합 | 클리어 → 해당 차원만 이동 · 다른 차원 불변 |
| E2E | 스모크에 "클리어 후 평판이 움직인다" 추가 |
