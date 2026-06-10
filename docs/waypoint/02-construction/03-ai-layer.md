---
phase: 02-construction
stage: 03-ai-layer
status: AI_PROPOSED
updated: 2026-06-09
---

# [Stage 2-3] AI 레이어 (대화·교정·음성)

## 목적

forin 핵심 — LLM 대화 엔진, 답안 교정 파이프라인, STT/TTS/발음 평가를 **포트/어댑터**로
구현한다. 서버 오케스트레이션 + 스트리밍.

## 입력 (Inputs)

- [`02-domain-content-api.md`](02-domain-content-api.md)
- 아키텍처 §F: [`../01-inception/03-architecture-decision.md`](../01-inception/03-architecture-decision.md)

## 체크리스트

- [ ] `LLMPort` + Claude 어댑터, **모델 티어링**(대화=Sonnet/교정=Haiku), SSE 스트리밍
- [ ] 대화 엔진: 시나리오 goals·guardrails·keyPhrases **+ NPC 페르소나(역할·연령대·성격·말투·감정)** 주입 → 현실적 롤플레이, DialogueTurn 기록
- [ ] 교정 파이프라인(저가 모델) → CorrectionResult → ReviewCard
- [ ] `STTPort`(온디바이스 expo-speech-recognition) · `TTSPort`(expo-speech) 어댑터
- [ ] `PronunciationPort` → Azure Pronunciation Assessment 어댑터
- [ ] 비용 통제: 캐시·턴 상한·티어링, 가드레일 서버 검증

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 0. 범위 정리 (서버 vs 클라이언트)

- **서버(이 스테이지):** LLM **대화 엔진** + **답안 교정** 오케스트레이션(Anthropic) + **발음 평가 프록시**(Azure).
  키는 서버 env에만(모바일 노출 금지).
- **클라이언트(2-4/2-6):** 🎤 녹음·온디바이스 STT(`expo-speech-recognition`), 🔊 TTS(`expo-speech`).
  발음 평가는 디바이스가 오디오를 서버로 → 서버가 Azure 호출(키 보호).

### 1. 설정 (env)

`ANTHROPIC_API_KEY`, `ANTHROPIC_DIALOGUE_MODEL`(예: claude-sonnet), `ANTHROPIC_CORRECTION_MODEL`(예: claude-haiku),
`AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`. **비어 있으면 해당 어댑터 비활성**(스텁) — 키 없이도 구조 기동.

### 2. 포트 / 어댑터 (헥사고날 유지)

- `LLMPort`: `Reply(ctx, sys, history, userMsg)` · `Correct(ctx, utterance, context)` → 어댑터 `anthropic`(Messages API).
- `PronunciationPort`: `Assess(ctx, audio, referenceText)` → 어댑터 `azurespeech`(REST).
- 모델 티어링: 대화=고급, 교정=저가 (설정 주입). 어댑터 교체 가능.

### 3. 대화 엔진 (도메인)

- `Scenario`의 `goals`·`guardrails`·`keyPhrases`를 **시스템 프롬프트**로 조립 → LLM이 그 제약 안에서 대화.
- **NPC 페르소나(현실성 — 사용자 강조):** 시나리오는 대화 상대의 `persona`(역할·**연령대**·**성격**·말투·현재 감정/expression)를
  가진다. 이를 시스템 프롬프트에 주입해 LLM이 **그 인물로 자연스럽게 롤플레이**한다
  (예: 통증에 시달리는 60대 환자, 퉁명한 외과의). → `Scenario.persona`(콘텐츠) **✅ 구현됨**(모델·스키마 000005·sqlc·시드, 2026-06-09);
  콘텐츠 워크스트림의 모든 시나리오는 persona 포함, 03_CHARACTERS의 role/expression과 정합. (3a에서 시스템 프롬프트로 주입.)
- 세션·턴 영속: `ConversationSession`, `DialogueTurn`(user/ai). 턴 상한·토큰 상한으로 비용 통제.
- **교정 파이프라인:** 사용자 발화 → (저가 모델) 교정 → `CorrectionResult`(original→corrected + "왜?" note) → `ReviewCard` 생성(2-2 복습과 연결).

### 4. DB (마이그레이션 000005)

`conversation_sessions`(id, user_id, scenario_id, started_at), `dialogue_turns`(id, session_id, role, text, created_at),
`correction_results`(id, user_id, turn_id?, original, corrected, note, topic_tag, created_at). ReviewCard는 기존 테이블 재사용.

### 5. API (인증)

- `POST /scenarios/{id}/conversation` → 세션 시작(시스템 프롬프트 구성), 오프닝 반환.
- `POST /conversation/{sessionId}/message` `{text}` → LLM 대화 응답 + 턴 기록. (스트리밍은 3c)
- `POST /correct` `{text, context?}` → 교정 결과 + ReviewCard 생성.
- `POST /pronunciation` `{audio(base64/multipart), referenceText}` → Azure 점수 프록시.

### 6. 구현 증분 (실 호출 검증)

- **3a — LLM 대화 + 교정**: config·LLMPort·anthropic 어댑터·대화엔진·교정·000005·엔드포인트.
  **실 Anthropic 호출로 검증**(.env 키 로드 → converse/correct curl). ⬅ 먼저.
- **3b — Azure 발음 평가**: PronunciationPort·azurespeech 어댑터·엔드포인트. (오디오 필요 — 가능 범위서 검증, 본격은 모바일 연동 시.)
- **3c — 스트리밍(SSE)** 대화 응답.

### 7. 비용·안전 · 모델 전략 (확장성 핵심 — 사용자 강조)

기본 대화 모델은 **Sonnet**. 단 **모델 교체·비용 최적화가 잦을 것**이므로 단일 1회 호출에 묶지 않고,
**생성 전략(generation strategy)을 추상화**한다 — **Strategy 패턴 + LLMPort 어댑터**:
- `DialogueStrategy` 인터페이스(컨텍스트 → 응답), 구현 교체 가능:
  - `SingleModel`(기본: Sonnet 1회)
  - `DraftRefine` / `CheapEnsemble`(**저가 모델 다회 호출 → 병합·정제**) — 저비용+고품질 가능성 실험 대상
  - `Router`(난이도·턴별 모델 선택)
- 전략·모델을 **설정으로 주입** → 운영 중 교체. "최고 UX + 서비스 존속(비용)"을 코드 구조로 보장.
- 통제: 모델 티어링·max_tokens·턴 상한·교정 캐시. 가드레일은 시스템 프롬프트 주입 + 서버 검증. 키 server-only.

### 검증 방식

`.env`(`ANTHROPIC_API_KEY` 등)를 서버에 로드해 **실 호출**. 키 값은 env→서버로만 흐르며 코드·깃·로그에 남기지 않음.

## 구현 증분 (Implementation Increments)

- **3a — ✅ LLM 대화 + 교정 구현**(forin 커밋, 2026-06-09): config(ANTHROPIC_API_KEY/모델, ANTHROPIC_KEY도 허용)
  · `LLMPort` + **anthropic 어댑터**(Messages API, stdlib) · **`DialogueStrategy`(Strategy 패턴) + SingleModel**
  · **대화 엔진**(persona·goals·guardrails → 시스템 프롬프트, 세션/턴 영속) · **교정**(저가 모델 → CorrectionResult → ReviewCard)
  · 마이그레이션 000006(conversation_sessions/dialogue_turns/correction_results) · 엔드포인트 4개 · sqlc · 계약 재생성.
  - **검증:** `go build/vet/test` 통과. docker+`.env`로 기동 → 세션 생성·인증·DB 경로 OK.
    실 Anthropic 호출은 **키 인증·요청 형식·모델 ID(claude-sonnet-4-6) 모두 유효 확인**,
    단 **계정 크레딧 부족**으로 생성 거부(빌링 이슈, 코드 무관). 크레딧 충전 후 실 대화·교정 재검증 예정.
- **3a 보강 — ✅ 언어 비하드코딩**(사용자 지적, 2026-06-09): 대화·교정 프롬프트가 **사용자 프로필의
  `nativeLang`+`targetLang`(+job)로 구동**된다(English/Korean 하드코딩 제거). Profile에 `target_lang` 추가,
  `en_level`→`target_level` 일반화(마이그 000007). 프로필 없으면 출시 시장(Korean→English)으로만 폴백.
  단위테스트로 "다른 언어 시 하드코딩 누출 없음" 고정. (참고: persona/goals 등 **콘텐츠 텍스트의 다국어화**는 별도 후속.)
- **3a 제공자 전환 — ✅ OpenAI 어댑터 추가**(forin, 2026-06-10): `LLMPort` 두 번째 구현(OpenAI Chat Completions) +
  `LLM_PROVIDER` 설정 분기(anthropic|openai|auto). **도메인·엔진·Strategy·핸들러 무수정** — 추상화 검증.
  현재 OpenAI 사용(Anthropic 결제 이슈). provider 선택·세션 생성 확인.
- **3a 실호출 — ✅ 검증 완료**(OpenAI, 2026-06-10): docker+`.env`로 실 LLM 호출 성공.
  페르소나 대화(흉통 환자 김복순 롤플레이: "My chest... Feels tight. Like someone's sitting on me." / "It's an 8.")
  + AI 교정("My chest is hurt very much since one hour" → "My chest has been hurting a lot for the past hour." + 한국어 노트)
  → **리뷰 카드 자동 생성** 확인. 대화·교정·복습 연결 end-to-end 동작. **3a 완료.**
- **3c — ✅ SSE 스트리밍**(forin, 2026-06-10): `LLMPort.CompleteStream`(anthropic·openai 양 어댑터) +
  `Strategy.GenerateStream`(SingleModel) + `Engine.SendMessageStream` + `POST /conversation/{sessionId}/stream`(SSE,
  JSON 인코딩 청크). 실 OpenAI로 토큰 단위 스트리밍 검증(청크 수신·done 이벤트), 전체 응답은 턴으로 영속.
  (로깅 미들웨어 래퍼에 Flush 통과 추가.)
- **3b — ✅ Azure 발음 평가**(forin, 2026-06-10): `PronunciationPort` + azurespeech 어댑터(REST) +
  `POST /pronunciation`(base64 WAV→점수). locale은 프로필 `targetLang` 기반. **실 Azure 검증 완료** —
  macOS `say`로 생성한 음성을 16kHz mono WAV로 변환해 평가: recognized 정확, accuracy 91·fluency 96·
  completeness 100·overall 93.8 + 단어별 점수. (응답 점수는 NBest/Word에 평면 필드.)

**→ 2-3(3a 대화·교정 / 3c 스트리밍 / 3b 발음) 구현·실검증 완료. 사용자 승인 시 `HUMAN_APPROVED`.**

## 검토 게이트 (Human Gate)

- [ ] 대화·교정 품질과 확장성(어댑터 교체)이 확보되는가?
- [ ] 비용·지연·가드레일이 통제되는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `04-mobile-foundation.md`
