---
phase: 02-construction
stage: 03-ai-layer
status: PENDING
updated: 2026-06-08
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

*[승인 후 작성]*

## 검토 게이트 (Human Gate)

- [ ] 대화·교정 품질과 확장성(어댑터 교체)이 확보되는가?
- [ ] 비용·지연·가드레일이 통제되는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `04-mobile-foundation.md`
