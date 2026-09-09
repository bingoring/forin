---
build-spec: curriculum-v3-audit
stage: 02-construction/06-screens-flows
status: SPEC-DRAFT
depth: comprehensive
updated: 2026-09-09
part-of: curriculum-v3 (P2)
---

# Build Spec — 커리큘럼 v3 · P2 전수조사 (주제 태깅 · 정리 · 보강)

> **구현 스펙(Build Spec)** = 코딩 전에 SoT를 라인 단위로 유도해 "다시 유도하지 않고 바로 구현 가능한"
> 수준으로 구체화한 것. (FRAMEWORK "구현 스펙")

## §0. 개요 & 범위

- **목표(한 줄):** 전 시나리오(3,044개)를 정확히 한 주제로 편입(**고아 0**)하고, 주제당 상황 20개 이상을
  보장하며, 불필요·중복을 제거하고 과광범위를 세분화해, P1이 만든 조립 엔진이 실제 여정을 그릴 수 있는
  **주제 레지스트리(themes.yaml)와 태그된 콘텐츠**를 완성한다.
- **SoT:** 사용자 구술(2026-09-09) + P1 스펙([`../curriculum-v3/`](../curriculum-v3/build-spec-index.md)) +
  현재 콘텐츠·생성기 코드. P1의 §6 인터페이스(태그 스키마·R2·R3)를 채우는 단계다.
- **깊이 티어 & 사유:** `comprehensive` — 전 콘텐츠(3,044)를 대상으로 하는 대규모 콘텐츠 오퍼레이션이며,
  생성기(`cmd/gencontent`) 변경 + 손저작 태깅 + 품질 정리 + R3 게이트 활성화가 얽힌다.

### 핵심 통찰 — 태깅은 "3,044개 분류"가 아니라 "290 Topic 큐레이션"이다

전수조사를 "시나리오 3,044개를 하나씩 LLM으로 분류"로 보면 거대하고 비결정적이다. 그러나 실측하면:

- **생성 시나리오(≈2,741개, `gen-*.yaml` 29파일)** 는 `cmd/gencontent`가 **290개 Topic**을
  (환자 페르소나 × 난이도)로 전개해 만든다(`main.go:71` 혼합기수 전개, `Title: t.Title + " · " + p.Name`,
  `Skills: t.Skills`). **생성기는 각 시나리오의 소스 Topic을 알고 있다.** 따라서 생성기가 `theme`을
  **직접 emit**하면 2,741개가 수작업 0으로 태깅된다.
- **손저작 시나리오(≈303개, `scn-*.yaml`)** 만 개별 태깅이 필요하다. 이마저도 다수는 제목이 어느 Topic과
  대응되어 반자동 매핑 후 검수로 처리된다.

즉 큐레이션 대상은 **3,044 시나리오가 아니라 [290 Topic + ~100 주제 레지스트리 + 303 손저작]** 이다.
Topic이 이미 "같은 상황의 페르소나·난이도 변주 묶음"이므로 **Topic ≈ 미니 주제**이고, 주제는 Topic보다
한 단계 굵다.

### 규모 재산정 (실측, 2026-09-09)

| 항목 | 값 | 근거 |
|---|---|---|
| 전체 시나리오(SCN) | 3,044 | distinct SCN id |
| 생성(gen-*.yaml) | ≈2,741 (29파일) | `ls gen-*.yaml` |
| 손저작(scn-*.yaml) | 303 (파일=시나리오) | `ls scn-*.yaml` |
| 생성기 Topic | **290** | `grep 'Title: "' depts*.go` |
| 부서(Dept) | 29 | `Code:` distinct |
| 시나리오/Topic 평균 | ≈10.5 | 3044÷290 |
| 목표 주제 수 | **~100** (Topic 2~3개 묶음) | 3044÷~30(주제당 목표) |

**함의:** Topic당 평균 약 10개 시나리오는 "주제당 20~30개"(U2)에 못 미친다. 따라서 **주제 = 관련 Topic
2~3개의 묶음**으로 정의해야 깊이가 나온다(예: ER의 "흉통 트리아지"·"호흡곤란 트리아지"·"복통 트리아지"
Topic 3개 → 주제 "트리아지" ≈ 30개).

### 이 단계가 고치는 결함

| # | 결함 | 근거 |
|---|---|---|
| A1 | **주제 레지스트리가 비어 있다**(P1은 형식+샘플 2개만). 실제 ~100개 목록 없음 | `themes.yaml` 샘플 2개 |
| A2 | **시나리오에 theme 태그가 없다**(전량 `theme=''` = 고아). P1 조립이 빈 트랙을 낸다 | migration 000038 default '' |
| A3 | **중복·비현실·과광범위 상황이 섞여 있다.** v2도 지적: 생성기 혼합기수 이전 387제목이 1,050 시나리오에 중복(수정됐으나 잔여 점검 필요), 손저작 제목 부서 간 중복 2건(v2 D7) | `main.go:74-84`, v2 D7 |
| A4 | **thin 주제**(20개 미만) 존재 가능 — Topic이 얕거나 페르소나 풀이 작은 부서(NICU 등) | `main.go:90` "bank as deep as its content" |

### P2 범위 밖 (P3/후속)

| 항목 | 왜 지금이 아닌가 |
|---|---|
| 여정 지도·정거장 시트 렌더 | P3 |
| 라이브 `/me/curriculum` 트랙 전환 | P2 완료·검수 후 별도(promote+OTA) |
| 다국어 주제 이름 번역 | 레지스트리에 `nameKey`만 채우고 실제 번역은 i18n 후속 |
| 손저작 57개 acuity 누락(v2 D8) | 평판 차원 영향 별건. 태깅과 무관하면 손대지 않음 |

## §0.5 결정 전제 (사용자, 2026-09-09) + 실행 중 결정 필요

**전제(확정):** U1~U7(P1 index §0.5) 그대로. 특히 주제당 ≥20(U2), 깊이 고정·주제 수 자유(U5),
자유 탐방 없음(U4), 공통 코어+부서 심화+협업(U3).

**실행 중 사용자 판단이 필요한 지점(스펙은 기준·프로세스를 정하고, 실제 취사는 검수에서):**
- **불필요 상황 제거 기준의 적용**: "비현실적"의 판정은 임상 도메인 판단(사용자=간호 도메인 오너). 스펙은
  제거 후보를 규칙(중복·저품질·주제 미귀속)으로 뽑고, **최종 삭제는 부서별 검수에서 승인**한다(R-P2-7).
- **협업 정거장의 조합**: 어떤 부서→부서 접점을 협업 주제로 세울지(ER→ICU 등)는 큐레이션 선택.

## §1. 산출물 지도

| 파일 | 역할 | 신규/변경 |
|---|---|---|
| `server/cmd/gencontent/banks.go` | `Topic`에 `Theme string`(소속 주제 key) 필드 추가 | 변경 |
| `server/cmd/gencontent/depts*.go` | 290개 Topic 각각에 `Theme` 배정(2~3 Topic → 1 주제) | 변경 |
| `server/cmd/gencontent/main.go` | 생성 시 시나리오에 `theme`(소스 Topic.Theme) + collab이면 `collabWith` emit | 변경 |
| `server/content/nurse/scenarios/gen-*.yaml` | 재생성 — `theme` 태그 포함 | 재생성 |
| `server/content/nurse/scenarios/scn-*.yaml` | 손저작 303개에 `theme` 태그 부여(반자동 매핑 후 검수) | 변경 |
| `server/content/nurse/themes.yaml` | 주제 레지스트리 ~100개 확정(key·name·nameKey·track·dept·order·exam) | 채움 |
| `server/cmd/audit/main.go` | **전수조사 도구** — 분포 실측·고아 탐지·중복/thin 리포트(아래 §logic) | 신규 |
| `server/internal/curriculum/themed/orphan_gate_test.go` | R3 고아-0 테스트 활성화(P1의 skip 해제) | 변경 |
| `server/cmd/gencontent/*_test.go` | "모든 Topic에 Theme 있음", "모든 Theme가 레지스트리에 있음" 불변식 | 신규 |

## §2. 하위 스펙

- [`business-logic-model.md`](business-logic-model.md) — 전수조사 파이프라인(7단계)·audit 도구·자동/수동 태깅 경로
- [`business-rules.md`](business-rules.md) — 태깅·묶음·정리(중복/thin/세분화)·검수 게이트 규칙

## §3. 비기능 요구 (NFR)

- **결정성:** 생성기는 같은 입력에 같은 출력(기존 불변식). `theme` emit도 결정적(Topic.Theme는 정적).
- **재현성:** themes.yaml + depts*.go의 Theme 배정만으로 전체 태깅이 재생성된다 — 손저작 303개 태그를
  제외하면 태깅은 코드에서 파생된다.
- **게이트:** 최종 상태에서 `TestNoOrphans_fullContent`(R3)와 "주제당 ≥20"(R2) 테스트가 그린이어야
  P2 완료. thin 주제가 남으면 실패로 드러난다.
- **점진 배포 가능:** 부서 단위로 태깅·검수를 진행해도 P1 조립은 태그된 부서만 트랙으로 낸다(부분 태깅
  안전). 라이브 전환은 전체 완료 후.

## §4. 리스크 & 완화

| 리스크 | 완화 |
|---|---|
| Topic→주제 묶음이 주관적 | audit 도구가 (부서×Topic×난이도) 분포를 실측해 "20 넘는 자연 묶음"을 제안. 큐레이션은 그 위에서 |
| 손저작 303개 태깅 누락 | 고아-0 게이트(R3)가 CI에서 잡음. 반자동 매핑(제목→Topic 유사도) 리포트로 후보 제시 |
| thin 주제(20 미만) | audit가 thin 리스트를 내고, 규칙(R-P2-4)이 인접 주제 병합 또는 Topic/페르소나 추가로 보강 |
| 대규모 재생성이 기존 진도 무효화 | 진도는 `scenario_attempts`(scenario_id)에서 파생 — id가 유지되면 무손실. **id 재배치를 피한다**(R-P2-8) |
