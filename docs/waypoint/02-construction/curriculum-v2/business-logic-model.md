---
build-spec: curriculum-v2
part: business-logic-model
updated: 2026-08-18
---

# 비즈니스 로직 모델 — 커리큘럼 v2

## §1. 카탈로그 구성

```
catalog = authored(24개 층)  ++  fallback(저작 안 된 부서)
```

`authored`는 `internal/curriculum/floors_*.go`에 층별로 손저작한다(건물당 한 파일 — 파일 하나가 300줄을
넘지 않게, 그리고 한 건물을 고칠 때 다른 건물을 읽지 않게).

`generated`(현행 `catalog_gen.go`)는 **폴백 전용**으로 축소된다. 생성기는 저작본이 덮지 않은 부서만 처리한다.

```go
// missingDepts는 저작본이 한 스텝도 참조하지 않는 부서 코드를 돌려준다.
// 새 부서가 추가되면 여기 걸리고, 폴백 3단이 붙고, stderr에 경고가 남는다 (R7).
func missingDepts(authored []Curriculum, all []Dept) []string
```

## §2. 폴백 3단 규칙 (R7 — 저작 안 된 부서만)

기계 배정은 29개 부서 중 14개에서 깨진다(D6). 그래서 이것은 **품질 목표가 아니라 안전망**이다.
정직한 이름을 쓴다 — 근무 흐름을 흉내내지 않는다.

```
1. 주제를 (Diff 오름차순, 뱅크 순서) 로 안정 정렬
2. 3등분: ceil(n/3) / ceil(n/3) / 나머지  → 항상 비지 않는다
3. 이름: "<부서명> 기본" / "<부서명> 응용" / "<부서명> 고난도"
4. stderr: "WARN curriculum: <CODE> has no authored curricula — using difficulty fallback"
```

난이도 3분할은 `Acuity`/`Role`을 쓰지 않는다. 그 두 필드가 D6의 원인이었으므로 폴백에서 배제한다.

## §3. 이어하기 판정 (R11~R14)

```
resumeKey(userID):
    last ← 가장 최근 scenario_attempts 1건 (started_at DESC LIMIT 1)
    if last 있음:
        c ← last.scenario_id 를 스텝으로 갖는 커리큘럼
        if c 있고 c.State != done: return c.Key
    return 미완료 커리큘럼 중 카탈로그 순서상 첫 번째의 Key   // 없으면 "" (전부 완료)
```

- **새 테이블·컬럼 없음.** `scenario_attempts(user_id, scenario_id, started_at)`으로 충분하다.
  `idx_attempts_user`가 이미 있고 조회는 사용자당 1행이다.
- `started_at`을 쓴다(`cleared_at`이 아니라) — 시작만 하고 나온 것도 "하던 곳"이다 (R11).
- 시나리오 → 커리큘럼 역인덱스는 **프로세스 시작 시 한 번** 만든다(`map[scenarioID]curriculumKey`).
  카탈로그는 불변이므로 요청마다 만들 이유가 없다.

## §4. 페이로드 크기

| | v19 | v2 |
|---|---|---|
| 단위 수 | 25 챕터 | 약 72 커리큘럼 |
| 스텝 총계 | 약 170 | 약 290 + 퀴즈 |
| 추정 JSON | 약 22KB | **약 40KB** (압축 전) |

한 번의 왕복이고 gzip이 걸리므로 실제 전송은 약 6~8KB다. 층별 지연 로딩은 하지 않는다 — 왕복 수가
체감 지연이라는 홈 화면의 원칙(`index.tsx:6`)이 여기에도 적용된다.

## §5. D1을 막는 테스트

D1(스텝 이름이 실제 시나리오와 무관)은 **아무 테스트도 두 데이터를 대조하지 않았기 때문에** 살아남았다.
카탈로그와 콘텐츠를 실제로 붙여 보는 테스트가 이번 범위의 핵심 산출물이다.

```go
// TestEveryStepPointsAtRealContent는 카탈로그의 모든 스텝에 대해
//   1) 그 id의 YAML이 존재하고
//   2) YAML의 title 첫 조각(" · " / " — " 앞)이 스텝 Name과 일치함
// 을 확인한다. (1)만 있으면 D1은 다시 통과한다 — id는 전부 존재했다.
```

- 콘텐츠 경로: `../../content/nurse/scenarios`, `../../content/nurse/quizzes` (패키지 상대)
- 이 테스트는 **DB도 네트워크도 쓰지 않는다** — CI에 `TEST_DATABASE_URL`이 없어 실 DB 테스트가 항상
  스킵되는 기존 구멍(v22 미해결 항목)에 걸리지 않아야 한다
- 추가 불변식: 스텝 id **전역 중복 없음**(R3의 "정확히 한 번씩"), 층당 커리큘럼 3~5개(R1),
  커리큘럼당 스텝 2~4개(R2), 마지막 스텝은 `boss`(R6)

## §6. 손저작 4개 층 (D1·D2 수정)

| 층 | 지금 | v2 |
|---|---|---|
| 본관 1F (ER) | 챕터 1·2 — **스텝 이름 11개가 거짓** | 신규 3개 시나리오 + ER 15개를 4개 커리큘럼으로 |
| 본관 P1 (PHARMA) | 챕터 3 — 이름 일치, 7/14 사용 | 14개를 4개 커리큘럼으로 |
| 본관 3F (OR) | 챕터 4 — 이름 일치, 6/14 사용 | 14개를 4개 커리큘럼으로 |
| 본관 4F (ICU) | 챕터 5 — 이름 일치, 8/14 사용 | 14개를 4개 커리큘럼으로 |

### 신규 시나리오 3개 (#14 — 도착 → 인사 → 인계받기)

`SCN-ORIENT-0000{1,2,3}`. 손저작 YAML은 `briefing`을 자체 포함하므로 뱅크 항목이 필요 없다.

| id | 제목 | 상대 | 왜 필요한가 |
|---|---|---|---|
| `SCN-ORIENT-00001` | 첫 출근 · 자기소개 | colleague (선임 간호사) | 329개 중 "출근"이 없다 |
| `SCN-ORIENT-00002` | 인계 받기 · 오늘 배정 | colleague (야간 근무자) | 인계를 **주는** 시나리오만 있고 **받는** 것이 없다 |
| `SCN-ORIENT-00003` | 첫 환자에게 인사 · 신원 확인 | patient | 기존 `SCN-ER-00002`는 이름만 "신원 대조"였고 실제로는 통증 사정이다 |

**`reqs` 주의:** `SCN-ER-00001`은 `threshold: 3`("레벨 B1+")을 갖는다. 신규 3개는 **레벨 1에서 열려야
한다** — 첫 커리큘럼의 첫 스텝이 레벨 요구로 막히면 #13(명확한 첫 행동)이 다시 깨진다.
