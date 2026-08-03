---
artifact: business-rules
build-spec: scenario-runtime
updated: 2026-07-18
---

# 시나리오 런타임 — Business Rules

## 콘텐츠 로드/검증
- `content.Scenario.Briefing`·`Persona.Sub/Hair/HairStyle`는 **optional** — nil/빈값 허용. 기존 `SCN-ER-00001`·`SCN-GEN-00003` yaml은 필드 없이 그대로 로드돼야 함(회귀 금지).
- seed는 upsert(id 기준). `er-hopkins-pain` 신규 추가는 기존 2건에 영향 없음.
- validation: id·title 필수. briefing 있으면 difficulty ∈ 1..3.

## 진입/권한
- 브리핑·대화 API는 **인증 필요**(`auth` 미들웨어). 모바일은 기존 토큰 인터셉터(`api/client.ts`) 재사용.
- `reqs.met` 계산: 클라이언트가 `/me`의 레벨/스탯을 threshold와 대조. **미충족이어도 진입 차단 안 함**(파일럿) — 표시만. 차단 정책은 후속.

## 대화 규칙 (기존 엔진 준수)
- 시스템 프롬프트는 서버 `buildSystemPrompt`(persona·언어·guardrails·goals)로 생성 — 클라이언트가 프롬프트를 만들지 않음.
- 응답 1~3문장·캐릭터 유지·메타 금지(엔진 규약). 모바일은 delta만 append.
- 언어: `/me` 프로필의 native/target로 서버가 구동(engine.langFor). 클라이언트 지정 불필요.

## 실패/엣지
- `GET /scenarios/{id}` 404 → 브리핑에서 "시나리오를 찾을 수 없음" fallback.
- 스트리밍 중 네트워크 끊김 → 부분 텍스트 유지 + 재시도 버튼. 세션ID는 유지.
- 빈 입력 전송 금지. 전송 중 중복 전송 잠금.

## 성과 연동 채점·보상 (2026-08)

대화 없이 상황종료해도 "참 잘했어요"+동일 보상이 뜨던 문제를 성과 연동으로 해결.
**대화마다 이미 AI를 쓰므로 종료 시 채점 1회 추가 비용은 무시할 수준** → 그냥 AI 채점.

- **중단(0턴):** 대화를 한 번도 안 했으면 결과 화면 자체가 안 뜸. 모바일이 `상황 종료` 시
  턴 수 0 → 확인 알럿 후 뒤로(기록·보상 없음, 상황은 '신규' 유지). 서버도 `/complete`가
  0턴이면 **422**(방어).
- **채점(`POST /conversation/{sessionId}/complete`):** 세션 소유 확인 → 전체 transcript
  로드(`History(sid,100)`) → LLM 1회(`Engine.Correct`와 동일 JSON 패턴, 강한 dialogue 모델)
  → `{score 0-100, goals[{goal,met}], headline, feedback, tips[{en,ko}]}`. LLM/파싱 실패 시
  **중립 합격(passScore)로 폴백** — 인프라 문제로 성의 있는 시도를 벌하지 않음.
- **보상 스케일:** `xpAwarded = round(baseXP × score/100)`, 하한 `ScenarioMinXP`(10), 상한 baseXP.
- **판정(attempts.state):** score ≥ `ScenarioPassScore`(60) → **`cleared`(완료)** = 스티커·완료태그·
  커리큘럼 done. 미만 → **`attempted`(재도전)** = 스티커·완료 없음. **1턴 이상 진짜 시도면 점수
  비례 XP·streak은 인정**(연습 존중, 사용성 유지). 기존 소비자는 전부 `state='cleared'`만 보므로
  `attempted` 행은 자연히 미완료 처리 — 무손상. `grade`(0-100) 컬럼 추가(nullable, 분석용).
- **리뷰랩 연결:** 채점 tips를 `review.CreateCard(Source:"grade")`로 저장 → 약점이 SM-2 리뷰
  카드로 리뷰랩에 등장(기존 실시간 교정 카드와 공존).
- **결과 화면:** 세션 있으면 `/complete` 호출해 점수 뱃지·목표 체크리스트·피드백·팁·스케일 축하
  (합격=참잘했어요+스티커 / 재도전=조금 더!+스티커 없음). 세션 없으면(레거시 딥링크) 기존
  `/attempts` 폴백(state='cleared', grade NULL).
- **경제 단일 소스:** `economy.ScenarioPassScore`·`ScenarioMinXP`(GET /config/economy 노출).
- **검증:** E2E — 0턴→422, 충실한 대화→85점·XP102·cleared, 성의없음→10점·XP16·attempted;
  DB state/grade/cleared_at·리뷰카드 확인; 시뮬레이터 합격·재도전 결과 화면 스크린샷; E2E 24/0.

## 회귀 가드
- 서버: `go test ./...`(engine_test·content 로드) 통과. 신규 필드 optional 로드 테스트.
- 모바일: tsc 0 · 기존 jest 스위트 통과(인테리어 회귀 없음).
