---
build-spec: curriculum-v3-journey
stage: 02-construction/06-screens-flows
status: IMPLEMENTED
depth: comprehensive
updated: 2026-09-20
supersedes: 일터 탭의 장소 찾기 뷰 (장소→부서→시나리오)
depends-on: curriculum-v3-live (L2 포트·L4 은퇴), 핸드오프 v41 08_JOURNEY_RESOURCES
---

# Build Spec — 커리큘럼 v3 · 여정 지도 (P3-B)

> **구현 스펙(Build Spec)** = 코딩 전에 SoT를 라인 단위로 유도해 "다시 유도하지 않고 바로 구현 가능한"
> 수준으로 구체화한 것. (FRAMEWORK "구현 스펙")

## §0. 개요 & 범위

- **목표(한 줄):** 일터 탭을 **여정 지도**로 바꾼다 — 목표 부서의 정거장 경로와 자유 탐방 칩을 그리고,
  정거장을 탭하면 스텝 목록이 열린다. 이로써 L3(클라이언트 이행)가 닫히고, L2가 한 릴리스용으로 남겨 둔
  캠퍼스 프레젠터가 삭제된다.
- **SoT:** 핸드오프 v41 [`08_JOURNEY_RESOURCES.md`](../../inputs/design-handoff_v41/08_JOURNEY_RESOURCES.md)
  (화면 3종·컴포넌트·토큰·데이터 모델·설계 원칙) + L2가 만든 `learning.Journey` 포트 + 사용자 결정
  (2026-09-20, 아래 §3).
- **깊이 티어 & 사유:** `comprehensive` — 서버 계약(엔드포인트 2 + 사용자 필드 1)과 화면 하나를 동시에
  산출하고, 기존 탭 하나의 정체성을 교체한다.
- **범위 안:** 화면 A(여정 지도) · 화면 B(정거장 시트) · 그 둘을 먹이는 서버 계약 · 옛 장소 찾기 제거.
- **범위 밖:** 화면 C(면허 로드맵) — 국가 트랙은 **서버에 데이터 원천이 없다**(면허·비자 일정은 학습
  엔진과 결이 다르다). 별도 스펙으로 미룬다.

### 왜 지금 이 화면인가

| # | 사실 | 근거 |
|---|---|---|
| E1 | **같은 콘텐츠에 이르는 길이 두 갈래다.** 옛 탐험 모드가 남긴 장소→부서→시나리오와, v3의 부서→주제→시나리오가 공존한다 | 사용자 지적(2026-09-20): "둘 다 존재하는 것은 맞지 않다" |
| E2 | L2가 만든 tracks를 **소비하는 화면이 없다.** 모바일에는 타입과 호출 함수만 있다 | `src/api/client.ts:882` 외 참조 0 |
| E3 | 캠퍼스 프레젠터(`curriculum_legacy.go`)가 한 릴리스용으로 살아 있다 | L4.4가 "L3 이행 완료 시 삭제"로 갈라 둠 |
| E4 | 전체 트랙 응답은 **340KB**다. 화면이 한 번에 그리는 것은 한 부서(11.7KB)뿐이다 | 실측(2026-09-20) |

## §1. 분해

| 유닛 | 내용 | 산출물 |
|---|---|---|
| **U1** | 사용자 목표 부서 (마이그레이션 + 도메인 + 저장소 + `GET /me` 노출) | `goal_dept` |
| **U2** | `GET /me/journey` (목표 해석 · 트랙 한정 현재 정거장 · 자유 탐방 요약) | `journey_handler.go` |
| **U3** | `GET /me/journey/stations/{themeKey}` (정거장 시트 지연 로드) | 같은 핸들러 |
| **U4** | `PATCH /me/goal-dept` | 같은 핸들러 |
| **U5** | 모바일 여정 화면 A (`JourneyMap`·`Station`·`PathSegment`·`MilestoneFlag`·`FreeRoamRow`·`CurrentStationBar`) | `app/(tabs)/journey.tsx` |
| **U6** | 모바일 정거장 시트 B (`StationSheet`·`TierRow`·`StepRow`) | 오버레이 |
| **U7** | 옛 장소 찾기 제거 (campus.tsx · FloorList · DeptSheet) | 삭제 |
| **U8** | 구 커리큘럼 라우트 삭제 (`/me/curriculum` · `/me/curriculum/tracks` · `curriculum_legacy.go` · 홈의 사용처 이전) | 삭제 — **L4.4 완료** |
| **U9** | 탐험 모드 설정 토글 (기기 로컬) + 홈 병동 카드 연동 | 설정 |

## §2. 아티팩트 인덱스

| 아티팩트 | 상태 | 다루는 것 |
|---|---|---|
| [`domain-entities.md`](domain-entities.md) | ✅ | `Journey`·`FreeRoamEntry`·`StationDetail`·`goal_dept`, SoT 타입 매핑 |
| [`business-rules.md`](business-rules.md) | ✅ | J1~J10 · 검증 · 불변식 I1~I5 · 엣지케이스 |
| [`business-logic-model.md`](business-logic-model.md) | ✅ | W1~W3 · A1~A3 · 상태 전이 · 시퀀스 · 통합 지점 |
| [`frontend-components.md`](frontend-components.md) | ✅ | 컴포넌트 트리 · props · 화면 상태 · 디자인 SoT 매핑 |
| [`implementation-plan.md`](implementation-plan.md) | ✅ | 태스크 16개(TDD 단계 단위) · 파일 구조 · 자체 검토 |

## §3. 미해결 질문 → 해소된 결정 (2026-09-20)

| # | 질문 | 결정 | 결정자 |
|---|---|---|---|
| Q1 | 화면 3종 중 어디까지? | **A + B.** C(면허 로드맵)는 데이터 원천이 없어 별도 스펙 | 사용자 |
| Q2 | 목표 부서를 어떻게 정하나? | **여정 화면에서 고르고 서버에 저장.** 초기값은 진도에서 추론하되 저장하지 않음 | 사용자 |
| Q3 | 정거장을 잠그나? | **잠그지 않는다.** 잠금은 정거장 안(계단·스텝)에만 | 사용자(듀오링고 조사 후) |
| Q4 | 옛 장소 찾기는? | **제거.** 두 깊이 구조가 공존할 이유가 없다. 되돌리려면 git에서 꺼낸다 | 사용자 |
| Q5 | 인테리어 진입은? | **홈 탭**(이미 있음) + 탐험 모드 설정 토글. 직업군별로 홈이 달라지는 것은 기존 "값 없으면 숨김" 규칙의 적용 | 사용자 |
| Q6 | 전체 트랙 vs 한 부서? | **한 부서 + 자유 탐방 요약**(340KB → 11.7KB) | AI(실측 제시, 사용자 승인) |

**Q3의 조사 근거**: 듀오링고는 2022년 나무에서 한 줄 경로로 바꾸며 선택권을 없앴고 반발(해커뉴스·청원·
보도)이 컸다. CEO는 되돌리지 않았지만 `Jump here?`라는 탈출구를 남겼다. 다만 그 선형성은 **언어가
누적적**이라 성립한다. 우리 35개 주제는 대체로 병렬이고, 학습자는 마감이 있는 직업인이다. 듀오링고가
잠금으로 사려 한 "어디부터"의 답은 우리에겐 **이어하기**가 이미 준다.

## §4. 구현 체크리스트

- [x] U1.1 마이그레이션: `users.goal_dept text NOT NULL DEFAULT ''` (DB 제약 없음 — 허용 집합은 코드 쪽)
- [x] U1.2 도메인·저장소·`GET /me` 노출 + 단위 테스트
- [x] U2.1 `resolveGoalDept`(A1) — 저장값 → 최근 시도 부서 → 첫 부서, **추론값 미저장** + 테스트
- [x] U2.2 `rescopeCurrent`(A2) — `here`를 지어내지 않고 `resume`만 옮긴다 + 테스트
- [x] U2.3 `summariseFreeRoam`(A3) — 목표 제외 · 층 없는 부서 제외 · 도장 수 + 테스트
- [x] U2.4 `GET /me/journey` 배선 + 핸들러 테스트
- [x] U3.1 `GET /me/journey/stations/{themeKey}` (알 수 없는 주제 404) + 테스트
- [x] U4.1 `PATCH /me/goal-dept` (알 수 없는 부서 400) + 테스트
- [x] U4.2 계약 재생성 + 드리프트 0
- [x] U5.1 `Station` SVG 4상태 (반지름·도장·깃발 핸드오프 수치 그대로) + 렌더 테스트
- [x] U5.2 `PathSegment` Q-커브 + 완료 구간 색 + 테스트
- [x] U5.3 `JourneyMap` 배치(인덱스 → 좌표) · 하단 패딩 ≥96 · `MilestoneFlag`
- [x] U5.4 `FreeRoamRow` + 칩 탭이 목표를 바꾼다
- [x] U5.5 `CurrentStationBar` (`resume`/`next` 문구 분기)
- [x] U6.1 `StationSheet` + `TierRow` + `StepRow`(대화 두 행·자물쇠) + 테스트
- [x] U7.1 `campus.tsx` 장소 찾기 제거 · `FloorList`·`DeptSheet` 삭제
- [x] U8.1 홈이 `legacyCurricula` 대신 포트를 직접 읽도록 이전
- [x] U8.2 **`/me/curriculum` · `/me/curriculum/tracks` 라우트 + `curriculum_legacy.go`(+테스트) 삭제** → L4.4 완료
      `tracks`도 함께 지우는 이유: 여정이 그 자리를 대신하고 소비자가 0이 된다. 전체 29부서 340KB를
      돌려주는 엔드포인트를 부르는 사람 없이 남겨 두면 언젠가 누가 부른다.
- [x] U9.1 탐험 모드 토글(기기 로컬) + 홈 병동 카드 연동
- [x] U10 커밋: `feat(journey): 일터 탭을 여정 지도로 — 캠퍼스 프레젠터 은퇴`

## §5. 검증 계획

| 축 | 방법 | 통과 기준 |
|---|---|---|
| 서버 단위 | `go test ./...` | 그린. A1~A3 각각의 엣지(신규 학습자·트랙 밖 이어하기·전부 통과) 포함 |
| 계약 | `make contract` (고정 swag) | 드리프트 0 |
| 모바일 | `tsc` · `jest` | 0 · 전건 통과. 정거장 4상태·경로 색·시트 두 행·빈 상태 |
| 잔존 참조 | `grep -rn "/me/curriculum" mobile/src server/internal/adapters/http` | **0** — 라우트가 여정 네임스페이스로 통일됐다 |
| 어댑터 은퇴 | `ls server/internal/adapters/http/curriculum_legacy*.go` | **없음** |
| 스모크 | `e2e_smoke.sh` | **완료(Task 16, 2026-09-20)** — 로컬 postgres·redis·실 서버로 150/1 (아래 참고). `/me/journey`(목표 부서·정거장 수·현재 정거장 ≤1·잠금 없음·도장 ≤ 총수·목표 중복 없음), `PATCH /me/goal-dept`(400/200/읽기 반영), `/me/journey/stations/{themeKey}`(스텝 수·상태 집합·`now` ≤1), 두 핸들러 각각의 i18n(트랙 이름·정거장 이름·스텝 이름) |
| 실기기 | 여정 진입 · 정거장 탭 · 스텝 진입 · 부서 바꾸기 · 이어하기 | 수동 |

> ⚠️ **스모크에 tracks/journey 단정이 없던 것이 이번 전환에서 드러난 구멍이다.** `/me/curriculum/tracks`는
> P1 이후 한 번도 검사된 적이 없어, 여정 엔드포인트가 비어 있던 것을 아무도 보지 못했다. Task 16이 메웠다 —
> 그 과정에서 `/me/journey`가 T5에서 선 이래 `i18n.Tr`을 한 번도 부르지 않아 모든 로케일에 한국어 주제명을
> 내보내고 있던 결함이 드러났다(단위 테스트는 이름을 고정해 돌려주는 스텁을 써서 번역 경로를 지나가지
> 않았다). 함께 발견된 것: 실 카탈로그 영문 번역은 20386개 시나리오 중 303개뿐이라, 정거장 시트의 "첫
> 스텝"을 임의로 골라 번역을 단정하면 대부분 헛되이 실패한다 — 스모크는 번역이 확인된 고정 시나리오
> (`SCN-ER-00001`/`er-chestpain`)로 그 단정을 옮겼다. 남은 무관한 발견 1건: `⑮ REPUTATION`의
> `SCN-HOSPICE-00108` acuity 단정(2026-08-10)이 이후의 HOSPICE 콘텐츠 저작 커밋(2026-09-14)으로 깨져 있다
> (`critical` 기대 vs 실제 `routine`) — 여정과 무관해 이 태스크에서 고치지 않았다.

## §6. NFR · 성능

| 항목 | 목표 | 근거 |
|---|---|---|
| 여정 응답 크기 | **≤ 20KB** | 한 부서 11.7KB + 자유 탐방 28줄. 전체(340KB)를 보내지 않는 이유 |
| 여정 왕복 | **1회** | 홈 탭의 선례. 세 번 읽어 그리면 세 조각이 어긋날 수 있다 |
| 정거장 시트 | 열릴 때 1회 | 지도가 955개 주제의 스텝을 들고 다니지 않는다 |
| 진도 읽기 실패 | 오류 아님 | 진도 0으로 그린다 |
| 지도 스크롤 | 하단 패딩 ≥ 96px | 고정 바에 가리지 않게(핸드오프 §5) |

## §7. 편차 로그 — 구현 후

| # | SoT | 편차 | 사유 | 승인 |
|---|---|---|---|---|
| D1 | 핸드오프 `Station.state: locked` | `far`로 이름 변경, 잠기지 않음 | J3 — 누를 수 있는 것에 자물쇠를 그리면 화면이 거짓말을 한다 | 사용자(Q3) |
| D2 | 핸드오프 `Track.milestones[]` | 트랙당 하나 | 엔진이 구간 시험 하나를 낸다 | AI |
| D3 | 핸드오프 `Station.x/y` | 서버가 모름 | 배치는 표현이다(J10) | AI |
| D4 | 핸드오프 화면 C | 미구현 | 데이터 원천 없음 | 사용자(Q1) |
| D5 | 핸드오프 협업 링 | 렌더 분기만, 화면에 안 나옴 | `collab` 트랙 주제 0건 | AI |
