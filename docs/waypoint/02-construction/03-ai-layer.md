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
- [ ] 대화 엔진: 시나리오 goals·guardrails·keyPhrases 주입 → DialogueTurn 기록
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

### 7. 비용·안전

모델 티어링·max_tokens·턴 상한·교정 캐시. 가드레일은 시스템 프롬프트 주입 + 서버 검증. 키 server-only.

### 검증 방식

`.env`(`ANTHROPIC_API_KEY` 등)를 서버에 로드해 **실 호출**. 키 값은 env→서버로만 흐르며 코드·깃·로그에 남기지 않음.

## 검토 게이트 (Human Gate)

- [ ] 대화·교정 품질과 확장성(어댑터 교체)이 확보되는가?
- [ ] 비용·지연·가드레일이 통제되는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `04-mobile-foundation.md`
