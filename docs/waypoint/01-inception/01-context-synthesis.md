---
phase: 01-inception
stage: 01-context-synthesis
status: HUMAN_APPROVED
updated: 2026-06-08
---

# [Stage 1-1] Context Synthesis

## 목적

forin의 제품 기획서·디자인 핸드오프·기술 방향을 통합하여, 도메인 모델링과
아키텍처 결정의 기반이 되는 **합의된 컨텍스트 요약**을 산출한다.

## 입력 (Inputs)

- 제품 기획서: [`../prd.md`](../prd.md)
- 기술 방향: [`../prd-tech.md`](../prd-tech.md)
- 디자인 핸드오프: [`../inputs/design-handoff_v8/README.md`](../inputs/design-handoff_v8/README.md)
  및 `01_DESIGN_TOKENS` ~ `05_MAP_AND_INTERIORS`, `reference/` 프로토타입
- (선택) 보관된 이전 자산: `archive/pre-waypoint` 브랜치의 `docs/` 기획 세트

## 체크리스트

- [ ] 제품 비전·타깃·핵심 루프를 한 페이지로 요약
- [ ] 핵심 엔티티/명사 후보 추출 (사용자·시나리오·다이얼로그·퀴즈·진행도·성장 등)
- [ ] 핵심 화면·플로우와 그 데이터 의존성 정리
- [ ] 미확정/리스크 항목 명시 (리뷰랩 범위, STT 연동, 콘텐츠 전달 방식)
- [ ] 이전 자산에서 재활용할 부분 vs 폐기할 부분 판단

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 1. 제품 컨텍스트 요약

미국 취업을 준비하는 한국 간호사를 위한 **모바일 게임형 임상 영어 학습 앱**. 픽셀아트가 아닌
**"데르프(Derp)" 스무스 벡터** 감성의 코지 레트로 병원을 탐험하며, 비주얼 노벨 다이얼로그와
미니 퀴즈로 실무 영어(통증 사정·SBAR·트리아지·투약 등)를 훈련한다.

**핵심 루프:** 캠퍼스 자유 이동 → 부서 건물 진입 → 인테리어(룸마스크·이동·충돌) →
`!` 핫스팟 → 브리핑 → VN 다이얼로그 ⇄ 미니 퀴즈 → 클리어(보상·컨페티) →
성장(XP·평판·자격·스티커) + 리뷰랩 저장.

**진입:** Splash↔Login(연속 카메라 팬, 소셜 원탭 — Google/Apple/Kakao) → Locale(언어/목적지)
→ Job(MVP는 간호사만) → Level 진단. **탭(4):** 캠퍼스 / 상황판 / 리뷰랩 / 나(프로필 홈 + 성장 리포트 푸시).

### 2. 핵심 도메인 명사 후보 (→ 1-2 도메인 모델 입력)

- **계정/사용자:** `User`, `AuthIdentity`(provider), `Profile`(job=nurse·nativeLang·destination·enLevel), `Settings`.
- **진행/성장:** `XP`, `Level/Rank`(커리어 패스 Learner→Junior→Senior→Head Nurse), `Reputation`(환자만족도·동료신뢰도·응급대응력), `Certification`(진척), `StickerBoard`(칭찬 스티커→cert 언락), `Streak`(출석), `DailyGrowthReport`(집계 파생).
- **저작 콘텐츠:** `Department`(ER/OR/ICU/Peds/Pharma + 캠퍼스 건물), `Interior`(regions·rooms·objects·hotspots), `Event`(상황·환자 이벤트, 300+, tier·category·tags·prerequisites·follow_ups·related·delivery), `Scenario`(event에 연결; briefing + dialogue 그래프 + quiz refs), `DialogueNode`(speaker·line·expression·branches·핵심표현), `Quiz`(8유형) + `QuizItem`(풀·태그·변형 변수), `Reward`/`EntryRequirement`, `NPC`(타일 해시 결정적).
- **학습 세션(런타임):** `ScenarioAttempt`/`Clear`, `QuizAttempt`/`Score`, `MissionTracker`(N/total), `ConversationSession`·`DialogueTurn`(user↔AI), `CorrectionResult`(→ ReviewCard).
- **AI 레이어:** `LLMAdapter`·`ModelTier`(대화=고급/교정=저가), `Prompt`·`Guardrail`, `STTAdapter`·`TTSAdapter` — 포트/어댑터로 추상화(제공자 교체 가능).
- **복습(MVP 텍스트):** `ReviewCard`(source dept·tag, original→corrected, "왜?" 노트, mastery 3-pip, favorite, SM-2 스케줄), `ReviewSession`.
- **전달/경제:** `DailyEventSet`(00:00 리셋·가중 샘플링), `MainRoute`(커리큘럼 그래프), `RewardedAdGrant`(일일 상한).
- enum류(`ward`·`category`·`tier`·`role`·`expression`·`urgency`·`quizType`)는 **코드측 허용집합**([[feedback_extensibility]]).

### 3. 콘텐츠 ↔ 사용자 상태 경계

- **저작 콘텐츠**(서버 fetch, 추후 CDN): departments·interiors·objects, events 카탈로그, scenarios·dialogue 그래프, quiz 풀, rewards·requirements.
- **사용자 상태**(서버 영속): account·profile, progress(xp·level·reputation·certs·stickers·streak), attempts·clears, reviewCards+schedule, dailySet·adGrants.
- **클라이언트 게임 상태**(휘발/로컬, Zustand): player 위치·region·카메라·충돌, mission tracker, UI 상태.

### 4. 주요 결정 · 미확정 리스크

1. **[결정됨] MVP 다이얼로그 = AI(LLM) 자유 대화** — **AI와 대화하며 상황을 해결**하는 것이 forin의
   핵심. 다이얼로그 Free 모드(LLM 대화) + **AI 문맥 교정** + 음성(🎤/🔊)을 **전부 MVP에 포함**한다.
   시나리오는 목표·가드레일·핵심표현을 제공하고 LLM이 그 제약 안에서 대화. → 이 레이어는 **확장성
   설계·디자인 패턴(포트/어댑터·모델 티어링)에 리소스를 집중**하는 핵심 영역.
2. **[결정됨] 리뷰랩 카드 = AI 문맥 교정 결과** — 사용자 발화 교정에서 카드 생성(+ 퀴즈 오답 보조).
   🎤 따라 말하기·🔊 TTS·"왜?" 노트 포함.
3. **대규모 콘텐츠 워크스트림 + 버전 관리** — 이벤트 300+, 퀴즈 1000+(고다양성), 시나리오/다이얼로그
   저작 = 조사·작성·임상 검수 필요. 별도 트랙·도구·일정. **콘텐츠 버전 관리가 1급 관심사** —
   콘텐츠가 계속 진화하고 사용자 진행도가 특정 버전을 참조하므로, `contentVersion`·마이그레이션·롤백 전략을 포함한다.
4. **비상 코드 지역차** — canonical 세트를 임상 레퍼런스로 검증(현재 카탈로그는 잠정).
5. **Level 진단** — 문항·채점·시작 레벨 매핑 알고리즘 미정의.
6. **맵/이동·탐험 엔진 (품질 핵심 축)** — forin의 퀄리티를 좌우하는 **3대 축: ① LLM 대화 퀄리티
   ② 맵 비주얼 ③ 탐험 요소**. 학습 우선 사용자는 빠른 이동(fast-travel)을 쓰지만, 탐험을 원하는
   사용자를 위해 **자연스러운 이동·NPC·맵 간 전환**이 중요하다. Unity를 포기하고 학습 우선 앱
   (RN/Expo)으로 가므로 게임 정체성은 낮추되, **흥미는 높이고 마찰은 줄이도록** 엔진을 신중히 구현한다.
   미해결: 26×60 타일 성능, **충돌맵 데이터 소스**(저작 vs 자동), 이동 방식(D-pad/탭패스/스와이프). 룸마스크 유지.
7. **유기적 성장·보상 경제** — 평판/자격/스티커는 **다양할수록 좋고, 서로 유기적으로 맞물려
   쓰임새**를 가져야 한다(데드엔드 금지). 예: **좋은 평판이 NPC 반응에 영향**, 자격/스티커를
   **칭호(Title)**처럼 활용, **히든 미션**으로 추가 획득. 보상이 다른 보상·게임플레이로 환류되도록
   설계. 수치·획득 규칙·상호작용 구체화는 1-3/도메인.

### 5. 이전 자산 재활용 판단

`archive/pre-waypoint`의 `docs/`(06_database_schema·07_api_spec·03_feature_spec·content/stages yaml)는
새 방향(Go stdlib·이벤트 중심·MVP 경계 변경)과 부분 상충 가능. → **1-2에서 명사·스키마 참고용으로 재검토하되 그대로 채택하지 않음.** content/stages yaml은 콘텐츠 구조 참고로 활용.

### 산출물

위 컨텍스트 요약 + 도메인 명사 후보 + 콘텐츠/상태 경계 → **Stage 1-2 Domain Model**의 입력.
**AI 대화·문맥 교정이 핵심으로 확정**됐으므로, 1-2는 대화/교정/시나리오-가드레일 경계와
확장성(포트·어댑터·모델 티어링)을 1급으로 다룬다.

## 검토 게이트 (Human Gate)

> 아래 항목을 확인 후 frontmatter의 status를 `HUMAN_APPROVED`로 변경하세요.

- [ ] AI 제안이 PRD 요구사항과 일치하는가?
- [ ] 다음 스테이지(도메인 모델) 진행에 필요한 컨텍스트가 충분한가?
- [ ] 산출물(컨텍스트 요약)이 명확하게 정의되었는가?

## 다음 단계

승인 후 → `STATUS.md`에서 1-1 상태를 `HUMAN_APPROVED`로 업데이트 → `02-domain-model.md`로 이동
