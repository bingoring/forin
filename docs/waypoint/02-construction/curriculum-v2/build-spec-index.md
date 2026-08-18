---
build-spec: curriculum-v2
stage: 02-construction/06-screens-flows
status: IMPLEMENTED
depth: comprehensive
updated: 2026-08-18
---

# Build Spec — 커리큘럼 v2 · 층별 테마 커리큘럼 + 탭 병합 + 이어하기

> **구현 스펙(Build Spec)** = 코딩 전에 SoT를 라인 단위로 유도해 "다시 유도하지 않고 바로 구현 가능한"
> 수준으로 구체화한 것. (FRAMEWORK "구현 스펙")

## §0. 개요 & 범위

- **목표(한 줄):** 층 1개 = 챕터 1개(6/10 주제만 사용)를 **층 1개 = 부서별 3단 테마 커리큘럼**으로 바꾸고,
  커리어 탭의 두 세그먼트를 하나의 계층으로 병합하고, 홈이 **사슬 선두가 아니라 내가 하던 곳**을 가리키게 한다.
- **SoT(진실 공급원):** TestFlight 피드백 #4 · #14 · #7 (2026-08-18 사용자 구술). 디자인 핸드오프 없음 —
  기존 v19 캠퍼스 허브 화면을 재구성하는 작업이므로 **현재 코드가 SoT**다.
- **사용자 결정(2026-08-18, 이 스펙의 전제):**
  1. **해금:** 층은 전부 열림. 순차는 커리큘럼 **안의 스텝**에만 적용
  2. **테마 축:** 근무 흐름 3단 — 다만 **이름과 배정 모두 층별로 저작한다.** 기계 배정은 29개 부서 중
     14개에서 깨진다(§0 조사 D6). 규칙은 **폴백으로만** 남는다
  3. **로드맵:** `CH.1~25` 전체 로드맵 목록은 삭제. 건물 → 층 → 커리큘럼 계층이 로드맵을 대체
- **깊이 티어 & 사유:** `comprehensive` — 서버 콘텐츠 모델 + 생성기 + 계약(contract) + 클라이언트 주 탭이
  동시에 바뀌고, **기존 사용자의 진도 표시가 달라진다**(회귀 위험). 신규 시나리오 저작도 포함된다.

### 조사에서 드러난 선결 결함 (이 스펙이 고친다)

| # | 결함 | 근거 |
|---|---|---|
| D1 | **손저작 챕터 1·2의 스텝 이름 11개가 실제 시나리오와 무관하다.** "출근 · 인사와 자기소개"를 누르면 `SCN-ER-00001` = **흉통 환자 트리아지**가 열린다 | `curriculum.go:30-46` vs `content/nurse/scenarios/scn-er-0000{1..11}.yaml`의 `title` |
| D2 | **도착·인사·인계받기 시나리오가 329개 중 하나도 없다.** #14가 요구하는 첫 커리큘럼은 라벨만이 아니라 **콘텐츠가 없다** | `grep -rl "출근\|오리엔테이션" content/nurse/scenarios` → 무관한 3건만 |
| D3 | 층당 주제 10개 중 **6개만** 커리큘럼에 쓰이고 4개는 부서 시트에서만 접근된다 | `gencontent/curriculum.go:52` `stepsPerChapter = 6` |
| D4 | 클라이언트 `BLD` 픽스처가 서버 `Floors`와 어긋난다 — `5-8F` 병합 행, `cur: 3`이 실제로는 P1 약제부 챕터 | `mobile/src/data/campus.ts:50-54` vs `gencontent/floors.go:26-` |
| D5 | 홈 "오늘의 한 가지"는 항상 **전역 사슬 선두**를 가리킨다. 사용자가 다른 층을 하던 중이면 홈이 딴 곳을 가리킨다 | `home_handler.go:178` `currentStep(chapters)` |
| D6 | **authored 필드만으로는 근무 흐름 3단이 안 나온다.** 29개 부서 중 14개에서 빈 밴드 또는 5스텝 이상이 나온다: `SIM`/`LOUNGE`/`SPD`는 환자가 없어 10개 주제가 전부 `colleague`(→ ①② 공백), `ER`은 긴급 주제 7개(응급실의 실제 성격이지 데이터 오류가 아니다), 9개 부서는 ①이 5스텝 | `Diff`/`Acuity`/`Role` 전수 계산 (2026-08-18) |
| D8 | **손저작 시나리오 57개 전부 `acuity`를 선언하지 않는다.** `Code Blue 콜 응대`·`아나필락시스`·`산후 출혈 대응`이 routine으로 취급된다 — 평판(reputation)의 응급 차원이 이 시나리오들로는 움직이지 않는다. 이번 범위에서는 그 데이터를 그대로 신뢰해 `dlg`로 저작했다(거짓 `event`를 만들지 않았다). **평판 로직에 영향을 주는 별건이므로 고치지 않았다** | `grep -L "^acuity:" scn-{er,or,icu,pharma}-000*.yaml` → 57/57 |
| D7 | 주제 제목이 부서 간 **중복** 2건(`다학제 회진 인계`, `검사실 인계`). `urgentTopics`처럼 **제목으로 키를 잡는 표는 두 부서에 동시 적용된다** — 기존 `urgentTopics`의 잠재 결함이기도 하다 | 290개 주제 중 서로 다른 것 288개 |

D5는 결정 1(층 전부 열림)과 맞물린다: 층 해금이 없어지면 "다음에 뭘 하지"를 알려줄 주체가 커리어 탭에서
사라지므로, **그 역할은 홈의 이어하기가 전담해야 한다.** 세 항목(#4/#14/#7)은 분리 배포할 수 없다.

### 범위 밖 (다음 단계)

| 항목 | 왜 지금이 아닌가 |
|---|---|
| D8(손저작 시나리오의 acuity 누락) 수정 | acuity는 평판 차원을 고르므로 57개에 값을 넣으면 기존 사용자의 평판 증가 경로가 바뀐다. 커리큘럼 개편과 같이 배포할 변경이 아니다 |
| `urgentTopics`의 제목 중복 결함(D7) 자체를 고치는 일 | 이번 저작본은 제목 키를 쓰지 않으므로 영향받지 않는다. `urgentTopics`는 acuity에만 쓰이고 그 두 주제는 둘 다 routine이라 **현재 오작동은 없다** — 별건으로 남긴다 |
| 다국어 커리큘럼 이름 (#2/#3) | D그룹. 지금은 한국어 문자열을 그대로 두고, **하드코딩 위치를 한 곳으로 모으는 것까지만** 한다 |
| 커리큘럼 완주 보상·칭호 (#10) | F그룹. 커리큘럼 경계가 확정돼야 보상 단위를 정할 수 있다 |
| 부서 시트(`DeptSheet`)의 상황 목록 개편 | 커리큘럼이 10개 주제를 다 쓰면 이 목록의 역할이 달라지지만, 상황 목록은 서버 페이지네이션까지 얽혀 있어 별건 |

## §1. 산출물 지도

| 파일 | 역할 | 신규/변경 |
|---|---|---|
| `server/internal/curriculum/curriculum.go` | `Curriculum` 모델 + `Resolve` (해금 규칙 변경) | 변경 |
| `server/internal/curriculum/handauthored.go` | 손저작 4개 층의 커리큘럼 (실제 제목으로) | 신규 (curriculum.go에서 분리) |
| `server/internal/curriculum/catalog_gen.go` | 생성물 — 20개 층 × 부서별 3단 | 재생성 |
| `server/cmd/gencontent/curriculum.go` | 3단 배정 규칙 | 변경 |
| `server/content/nurse/scenarios/scn-orient-0000{1,2,3}.yaml` | #14 도착 → 인사 → 인계받기 | 신규 |
| `server/internal/adapters/http/curriculum_handler.go` | 응답 셰이프 (건물/층 그룹) | 변경 |
| `server/internal/adapters/http/home_handler.go` | 이어하기 = 최근 시도한 커리큘럼 | 변경 |
| `server/internal/adapters/postgres/progress_repo.go` | 최근 시도 시나리오 1건 조회 | 변경 |
| `packages/contract/{openapi.yaml,types.ts}` | 계약 재생성 (CI 드리프트 게이트) | 재생성 |
| `mobile/src/app/(tabs)/campus.tsx` | 세그먼트 2개 → 단일 계층 | 변경 |
| `mobile/src/data/campus.ts` | 층 목록 제거, 건물 표시값(아이콘/색)만 남김 | 변경 |

## §2. 하위 스펙

- [`domain-entities.md`](domain-entities.md) — `Curriculum` / `CurriculumState` / `FloorGroup`
- [`business-rules.md`](business-rules.md) — R1~R14 (배정 규칙 · 해금 · 이어하기)
- [`business-logic-model.md`](business-logic-model.md) — 3단 배정 알고리즘 · 이어하기 판정
- [`frontend-components.md`](frontend-components.md) — 병합된 커리어 탭

## §3. 비기능 요구 (NFR)

- **왕복 수:** 커리어 탭은 `GET /me/curriculum` **1회**로 완성된다 (건물·층·커리큘럼·스텝 전부).
  현재도 1회이므로 증가 없음. 페이로드는 25챕터 → 약 66커리큘럼으로 커지므로 **스텝은 열린 층만** 보내지 않고
  전부 보낸다 (총량 추정 §business-logic-model §4에서 계산: 압축 전 약 40KB → 허용).
- **기존 사용자 회귀:** 진도는 `scenario_attempts`에서 파생되므로 **마이그레이션 불필요**. 다만 커리큘럼 경계가
  바뀌므로 "완료 챕터 수"는 달라진다. 이것은 표시 변화이지 데이터 손실이 아니다 — §business-rules R13.
- **결정성:** 같은 입력(banks + floors)에 같은 카탈로그가 나와야 한다. 정렬 키에 **맵 순회를 쓰지 않는다**.
