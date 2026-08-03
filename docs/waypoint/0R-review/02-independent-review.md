---
phase: 0R-review
stage: 02-independent-review
status: AI_PROPOSED
updated: 2026-08-03
scope: 시나리오 런타임 · 성장/경제 · 커리큘럼 · 캠퍼스(v19) — server + mobile
---

# [Stage R-2] Independent Code Review 🔍 — Construction→Operations 게이트

## 목적

작성자(구현 주체)와 **컨텍스트가 분리된** 독립·적대적 리뷰어가 2-6~2-8 신규 산출물(시나리오 런타임·성장/
경제·복습·이벤트 전달·커리큘럼·캠퍼스 v19)을 검토하여 설계 게이트가 놓치는 코드 레벨 결함을 잡고, 진짜
결함을 수정한다. (R-1은 2-5 맵 엔진만 스코프였음.)

## 방법

컨텍스트 분리된 **3개 서브에이전트**(code-reviewer)를 병렬 실행 — 작성자 세션과 완전히 분리된 fresh
context. 각 findings를 **채택 전 개별 검증**(맹목 수용 금지). 오탐 후보도 명시적으로 배제 기록.

- **A. 서버 도메인 로직** — conversation/engine.go, curriculum.go, economy.go, progress/progress.go
- **B. 서버 데이터·어댑터** — content_repo.go, progress_repo.go, http handlers(content/progress/me)
- **C. 모바일** — campus.tsx, data/{campus,titles,economy}.ts, route/growth/result/review 화면

## 체크리스트

- [x] 독립 리뷰어(작성자와 분리된 3 에이전트)로 적대적 리뷰 실행
- [x] findings 를 severity 별로 정리하고 **각 항목 검증**
- [x] 진짜 결함 수정 + 재검증(E2E/스모크)
- [x] 스테이지 문서화

## Findings & 처리

### 채택·수정 (진짜 결함)

**F1 (Critical) — 장착 warm 칭호 보너스가 동료 역할 NPC에서 유실**
`engine.go` reputationDisposition. `score += TitleWarmthBonus`가 차원 선택 루프보다 **먼저** 실행돼,
NPC 역할이 동료(nurse/doctor/charge/resident/attending…)면 `score = PeerTrust`로 덮여 보너스가 사라짐.
대다수 페르소나가 동료라 [온기] 칭호 효과가 사실상 무력화(문서화된 설계 의도 위반).
→ **수정**: 보너스를 차원 선택 **후**에 적용(선택된 score에 얹음). go test conversation green.

**F2 (Critical) — TopUpDailyPool check-then-act 레이스 / 상한 우회 · lost update**
`content_repo.go` TopUpDailyPool. read(ad_grants)→check(<cap)→write(UPDATE)가 트랜잭션/행락 없이 수행돼,
광고 더블탭(동시 요청) 시 둘 다 cap 통과→각자 +3 샘플→한쪽 UPDATE가 다른 쪽을 clobber. "일일 상한" 불변식
초과 + 한 top-up의 샘플 유실.
→ **수정**: `pool.Begin` + `SELECT … FOR UPDATE`로 read-check-write 직렬화, tx 내 UPDATE+Commit. 베이스 세트는
락 이전에 보장(idempotent). E2E: 12→15→18→21 후 4회차 429.

**F3 (Important) — dept 캡이 base+topup 누적이 아님**
`sampleDailyPool`의 deptCount가 호출마다 초기화돼, top-up이 이미 캡(2)에 도달한 부서에 최대 2개를 더 추가
가능(하루 dept당 4개). 문서화된 "부서당 최대 2" 보장 위반.
→ **수정**: sampleDailyPool에 `deptSeed` 인자 추가, top-up이 기존 세트의 부서 카운트를 시드로 전달. E2E:
21장 세트에서도 부서당 최대 2, 초과 0.

**F4 (Moderate) — convSeconds가 자정 걸친 세션의 전체 시간을 계상**
`progress_repo.go` GrowthStats. 세션 span(mx−mn)을 통째로 합산해, 어제 23:50~오늘 00:10 세션이 "오늘 대화
시간"에 20분 전체로 계상(과대).
→ **수정**: `mx − GREATEST(mn, since)`로 in-period 부분만 clip.

**F5 (하드닝, low-conf) — ProgressBar div-by-zero 잠재**
`campus.tsx` ProgressBar. `total===0`이면 `NaN%`. 현재 도달 불가(모든 total>0)지만 서버가 total:0 챕터를
반환하면 노출. → **수정**: `total>0 ? clamp(...) : 0` 가드(1줄).

### 검토했으나 결함 아님 (명시적 배제)

- **economy.Active 전역**: 시작 시 1회 설정·이후 read-only(값 복사 읽기), 동시 핸들러 데이터 레이스 없음.
- **progress.Review SM-2**: 표준 SM-2 수식 정합, gradeQ 버킷팅은 설계 선택.
- **curriculum.Resolve**: done/now/lock 파생 문서대로. "잠긴 챕터 강제 lock" 패스는 도달 불가(dead code)이나
  잘못된 출력 아님 — 수정 불필요.
- **minutesOf()**: "약 6분"→6·"6 min"→6·"10-15분"→10·""→0(가드로 무효) 정상.
- **dayStart/weekStart TZ 수학**: 로컬 자정을 절대 시각으로 정확 계산, Monday-first offset 정확.
- **rows.Close / SQL 인젝션**: 전 경로 close, `LIKE $1` 바인드 파라미터(주입 불가).
- **모바일 DeptSheet effect / alive 가드 / recorded.current / ECON 하이드레이션 게이트**: 방어적으로 정확.
  setTimeout 미정리는 RN(React 19) no-op·무해 — 비채택.

## 검증

- go build/test 0 · tsc 0 · jest 208/208.
- 전체 여정 스모크(`server/scripts/e2e_smoke.sh`) **24/0 재통과**(회귀 없음).
- F2/F3 전용 E2E: top-up 상한(4회차 429)·누적 dept 캡(21장에서 부서당 ≤2).

## 검토 게이트 (Human Gate)

- [x] 진짜 결함이 수정되고 재검증됐는가?
- [ ] Operations(Phase 3) 진입 승인 (사람)
