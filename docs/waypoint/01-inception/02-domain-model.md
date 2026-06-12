---
phase: 01-inception
stage: 02-domain-model
status: HUMAN_APPROVED
updated: 2026-06-08
---

# [Stage 1-2] Domain Model

## 목적

forin의 핵심 도메인을 엔티티·관계·상태·불변식으로 모델링하여, 서버 데이터
모델과 모바일 게임 상태의 공통 기반을 정의한다.

## 입력 (Inputs)

- 이전 스테이지: [`01-context-synthesis.md`](01-context-synthesis.md)
- 제품 기획서: [`../prd.md`](../prd.md)
- 디자인 핸드오프(특히 시나리오·퀴즈·맵/인테리어):
  [`../inputs/design-handoff_v2/04_SCREENS.md`](../inputs/design-handoff_v2/04_SCREENS.md),
  [`05_MAP_AND_INTERIORS.md`](../inputs/design-handoff_v2/05_MAP_AND_INTERIORS.md),
  [`reference/scenarios-data.jsx`](../inputs/design-handoff_v2/reference/scenarios-data.jsx)

## 체크리스트

- [ ] 핵심 엔티티 정의: User, Profile, Department, Scenario, DialogueNode, Quiz(8유형),
      Progress/Clear, Growth(XP·평판·자격·스티커), ReviewItem, EventBoardEntry
- [ ] 엔티티 간 관계·카디널리티 정의
- [ ] 상태 머신(시나리오 진행, 다이얼로그↔퀴즈 전환, 클리어 조건) 정의
- [ ] enum류 필드는 코드측 허용집합으로 표현(확장성 우선, DB CHECK 지양)
- [ ] 콘텐츠(저작) vs 사용자 상태(영속) 경계 구분

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 0. 모델링 원칙

- **3계층 분리:** ① **저작 콘텐츠**(서버 fetch·읽기 전용·버저닝) ② **사용자 상태**(서버 영속)
  ③ **클라이언트 게임 상태**(휘발/로컬, Zustand). 저장 위치가 다르므로 엔티티도 분리.
- **enum류 = 코드측 허용집합**(DB CHECK 금지) — 확장성 우선 ([[feedback_extensibility]]).
- **AI는 포트/어댑터**로 격리(LLM·STT·TTS 교체 가능, 모델 티어링).
- **ID 규약:** 콘텐츠는 의미 있는 슬러그 + **최소 5자리 제로패딩 시퀀스**
  (`EVT-ER-00001`, `SCN-00001`, `QZ-00001`) — 3자리는 999에서 고갈되므로 넉넉히 잡는다. 사용자 데이터는 UUID.
- 콘텐츠는 `contentVersion`을 가져 사용자 진행도가 특정 버전을 참조(스키마 진화 대비).

### 1. 저작 콘텐츠 (Content — 읽기 전용, 서버/CDN)

| 엔티티 | 핵심 필드 | 관계 |
|---|---|---|
| `Department` | id, code(ward), name_ko/en, color, campusBuildingRef | 1—N `Interior`, `Event` |
| `Interior` | id, deptId, cols, rows, playerStart, floorTheme | 1—N `Region`,`Room`,`MapObject`,`Hotspot` |
| `Region` | id, name, icon, bounds{x,y,w,h} | 룸마스크 단위 |
| `Room` | id, name, sub, icon, x, y, locked? | fast-travel 목적지 |
| `MapObject` | id, type(objectType), x, y, props(occupied/beep/w/color…) | Interior 배치 |
| `Hotspot` | id, kind(quest/urgent/info), x, y, label, scenarioId | → `Scenario` |
| `NPC` | role, 결정적 외형(=hash(x,y,salt)) | 배치는 좌표·역할만 저장 |
| `Event` | id, title, ward, **category**, **tier(1–4)**, tags[], objectives[], `prerequisites[]`, `follow_ups[]`, `related[]`, **delivery**(main_route/daily_pool/both) | 1—N `Scenario`; self-ref 그래프 |
| `Scenario` | id, eventId, briefing(ribbon/title/tagline/portrait/difficulty/time/skills/rewards/entryReq), **goals/guardrails**, dialogueGraphId, quizRefs[] | → `DialogueGraph`,`Quiz` |
| `DialogueGraph` | id, nodes[], startNodeId | 1—N `DialogueNode` |
| `DialogueNode` | id, speaker, line(ko/en), expression, keyPhrases[], **branches**(choice 또는 free), quizInsertRef? | 그래프 엣지 |
| `Quiz` | id, type(**quizType** 8종), title, sub, config | N—N `Scenario` |
| `QuizItem` | id, quizId, ward/topic/difficulty tags, **variationVars**(다양성 샘플링), payload | 풀(pool); 1 Quiz—N Item |
| `Phrase` | id, ko, en, dept/topic tag, "왜?" note | 리뷰랩 큐레이션 표현 시드 |
| `HiddenMission` | id, 은닉 조건, 보상refs, 힌트 | 탐험·도전 보상 |
| `Title` | id, name, 획득조건(평판/자격/스티커/히든), **효과**(NPC 반응 가중치 등) | 칭호 |
| `EntryRequirement` / `Reward` | 조건(레벨·선행 클리어·**보유 칭호/평판**) / 산출(xp·평판·자격진척·스티커·칭호) | Scenario에 임베드 |

### 2. 사용자 상태 (User State — 서버 영속)

| 엔티티 | 핵심 필드 | 비고 |
|---|---|---|
| `User` | uuid, createdAt, status | 루트 |
| `AuthIdentity` | userId, provider(google/apple/kakao), subjectId | 1 User—N Identity |
| `Profile` | userId, job(nurse), nativeLang, destination, enLevel | 온보딩 산출 |
| `Settings` | userId, locale, 알림, 사운드 등 | |
| `UserProgress` | userId, xp, level, **rank**(careerStage), updatedAt | 단일 |
| `Reputation` | userId, 환자만족도, 동료신뢰도, 응급대응력 | 0–100 게이지 |
| `Certification` | userId, certId, progress, earnedAt? | 스티커로 언락 |
| `Sticker` | userId, stickerId, earnedAt | 칭찬 스티커 보드 |
| `Streak` | userId, current, longest, lastActiveDate | 출석 |
| `ScenarioAttempt` | id, userId, scenarioId, contentVersion, **state**, score, startedAt/clearedAt | 클리어 이력 |
| `QuizAttempt` | id, attemptId, quizItemId, correct, score | 세션 내 |
| `ConversationSession` | id, attemptId, modelTier, startedAt | 다이얼로그 대화 |
| `DialogueTurn` | id, sessionId, role(user/ai), text, audioRef?, timestamp | 대화 로그 |
| `CorrectionResult` | id, turnId, original, corrected, note, topicTag | → `ReviewCard` 생성 |
| `ReviewCard` | id, userId, sourceRef(correction/quiz), front/back, note, **masteryPips(0–3)**, favorite | 오답노트 |
| `ReviewSchedule` | cardId, **SM-2**(ease, interval, dueDate, reps) | 간격 반복 |
| `DailyEventSet` | userId, date, eventIds[], **resetsAt(00:00 local)** | 일일 풀 |
| `RewardedAdGrant` | userId, date, count, cap | 광고 보상 |
| `MainRouteProgress` | userId, currentNodeId, completed[] | 커리큘럼 위치 |
| `UserTitle` | userId, titleId, equipped? | 보유·장착 칭호 |
| `HiddenMissionProgress` | userId, missionId, state, foundAt? | 히든 미션 진행 |

### 3. 클라이언트 게임 상태 (휘발/로컬 — Zustand)

`PlayerPosition{x,y}`, `currentRegion`, `camera`, `collisionMap`(인테리어별), `missionTracker(N/total)`,
대화 UI(스트리밍 버퍼·녹음 상태), fast-travel 모달 등. 서버 영속 아님(진행 결과만 커밋).

### 4. AI 레이어 (포트/어댑터)

- `LLMPort`(adapter: provider별) + `ModelTier`(dialogue=고급 / correction=저가) **라우팅**.
- `STTPort`·`TTSPort`(expo-av/expo-speech 또는 클라우드 어댑터), `PronunciationResult`.
- `PromptTemplate`·`Guardrail`(시나리오 goals/guardrails 주입) — 대화 엔진이 조립.
- **대화 엔진:** Scenario(goals·guardrails·keyPhrases) → LLMPort 스트리밍 → DialogueTurn 기록;
  사용자 발화는 **교정 파이프라인**(저가 모델)으로 → CorrectionResult → ReviewCard.
- 키·호출은 **서버(Go) 오케스트레이션**(모바일 키 노출 금지).

### 5. 핵심 상태 머신

- **ScenarioAttempt.state:** `available → in_progress → (dialogue ⇄ quiz) → cleared | abandoned`
  (entryRequirement 미충족 시 `locked`).
- **ReviewCard mastery (SM-2):** 복습 결과(again/hard/good/easy) → ease·interval 갱신 → dueDate;
  pips 0–3, 3 도달 시 `mastered`.
- **Event/진행:** `prerequisites` 충족 시 `available`; 클리어 시 `follow_ups` 언락 → 메인 루트 전진.
- **DailyEventSet:** 00:00(local) 신규 샘플(level·ward·진행도 가중); 소진 시 `RewardedAdGrant`로 +N(상한).

### 6. enum류 허용집합 (코드측, 확장 가능)

`ward`(er/or/icu/peds/pharma/general) · `eventCategory`(emergency_code/clinical/interpersonal/facility_safety/procedure) ·
`tier`(1–4) · `role`(player/nurse/doctor/surgeon/paramedic/police/patient/child/parent/visitor/pharmacist) ·
`expression`(12종) · `urgency`(urgent/quest/info) · `quizType`(8종) · `deliveryType`(main_route/daily_pool/both) ·
`modelTier`(dialogue/correction) · `provider`(google/apple/kakao) · `careerStage`(learner/junior/senior/head_nurse) ·
`attemptState` · `reviewGrade`(again/hard/good/easy).

### 7. 확장성 핵심 — 유기적 경제 · 콘텐츠 버전 · 탐험

- **유기적 보상 경제** — 평판/자격/스티커/칭호/히든미션은 **데드엔드가 아니라 서로·게임플레이로 환류**된다:
  좋은 `Reputation` → NPC 반응·대화 가드레일 가중, `Title`(칭호) 효과, `EntryRequirement`에 평판/칭호 사용,
  `HiddenMission`으로 추가 획득. 보상 타입은 **코드측 허용집합**으로 다양화 가능(신규 보상·효과 추가 용이).
- **콘텐츠 버전 관리(1급)** — 모든 콘텐츠 엔티티는 `contentVersion`. 사용자 진행도(Attempt 등)는 참조한
  버전을 기록. 발행 파이프라인은 **마이그레이션·롤백**을 지원(콘텐츠가 계속 진화하므로). 저작 워크스트림과 결합.
- **탐험 엔진(품질 축)** — 맵/이동·NPC·맵 간 전환의 자연스러움은 핵심 품질 축(1-1 #6). 게임 상태(위치·충돌·카메라)는
  클라이언트, 콘텐츠(맵·오브젝트·NPC 배치)는 저작. 충돌맵 데이터 소스·이동 방식·성능은 1-3에서 확정.

### 8. 1-3으로 넘길 결정

저장 기술(Postgres 스키마·sqlc/pgx·마이그레이션), 콘텐츠 fetch/캐시·CDN, 충돌맵 데이터 소스(저작 vs 자동),
Level 진단 알고리즘, 경제 밸런싱 수치, AI 제공자/모델·비용·지연·가드레일 구현, 대규모 콘텐츠 저작 워크스트림.

## 검토 게이트 (Human Gate)

> 아래 항목을 확인 후 frontmatter의 status를 `HUMAN_APPROVED`로 변경하세요.

- [ ] 도메인 모델이 PRD의 핵심 루프·성장 시스템을 빠짐없이 표현하는가?
- [ ] 콘텐츠/사용자상태 경계가 명확한가?
- [ ] 아키텍처 결정에 필요한 모델이 충분히 구체화되었는가?

## 다음 단계

승인 후 → `STATUS.md`에서 1-2 상태를 `HUMAN_APPROVED`로 업데이트 → `03-architecture-decision.md`로 이동
