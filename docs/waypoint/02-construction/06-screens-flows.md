---
phase: 02-construction
stage: 06-screens-flows
status: PENDING
updated: 2026-06-08
---

# [Stage 2-6] 화면 · 플로우

## 목적

핸드오프의 전체 화면·플로우 구현 — 온보딩 → 캠퍼스 → 인테리어 → 브리핑 → 다이얼로그(AI) ⇄
미니 퀴즈(8종) → 클리어 → 상황판 → 프로필/성장 리포트 → 리뷰랩.

## 입력 (Inputs)

- 화면 명세: [`../inputs/design-handoff/04_SCREENS.md`](../inputs/design-handoff/04_SCREENS.md)
- 2-3 AI 레이어, 2-4 모바일 기반, 2-5 맵 엔진

## 체크리스트

- [ ] 온보딩(Splash↔Login·Locale·Job·Level)
- [ ] 캠퍼스/인테리어 화면(2-5 엔진 사용), 상황판(일일 이벤트)
- [ ] 브리핑 → 다이얼로그(AI 대화·🎤/🔊) ⇄ 미니 퀴즈 8종 → 클리어(컨페티·리워드)
- [ ] 프로필/성장 리포트(푸시 하위뷰), 리뷰랩(PhraseCard·SM-2·🎤/🔊)
- [ ] 화면-데이터 의존성 연동(API 클라이언트)

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[승인 후 작성]*

## 검토 게이트 (Human Gate)

- [ ] 화면·카피·상호작용이 핸드오프와 일치하는가?
- [ ] 핵심 루프가 끊김 없이 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `07-growth-economy-review.md`
