---
phase: 02-construction
stage: 06-screens-flows
status: PENDING
updated: 2026-06-12
---

# [Stage 2-6] 화면 · 플로우

## 목적

핸드오프의 전체 화면·플로우 구현 — 온보딩 → 캠퍼스 → 인테리어 → 브리핑 → 다이얼로그(AI) ⇄
미니 퀴즈(8종) → 클리어 → 상황판 → 프로필/성장 리포트 → 리뷰랩.

## 입력 (Inputs)

- 화면 명세: [`../inputs/design-handoff_v2/04_SCREENS.md`](../inputs/design-handoff_v2/04_SCREENS.md)
- 2-3 AI 레이어, 2-4 모바일 기반, 2-5 맵 엔진

## 하단 탭 IA (디자인 확정 — Option A, 2026-06-12)

4탭 **캠퍼스 / 상황판 / 리뷰랩 / 나**. 단, 현재 모바일 탭은 `campus/board/lab/me`로 **이미 일치**(`lab`=리뷰랩).
- **나(me) = Profile 홈**(`ScreenProfile`). **성장 리포트(`ScreenGrowth`)는 별도 탭이 아니라 나 탭의 푸시 하위뷰**
  (프로필의 "오늘의 성장 리포트" 행 / 하루·시나리오 종료 시 자동) — RN 스택 push.
- **리뷰랩(lab) = Review Lab**(`ScreenReviewLab`) 자체 탭. 프로필에 "리뷰랩 열기 ▶" 티저 딥링크.

## 체크리스트

- [ ] 온보딩(Splash↔Login·Locale·Job·Level)
- [ ] 캠퍼스/인테리어 화면(2-5 엔진 사용), 상황판(일일 이벤트)
- [ ] 브리핑 → 다이얼로그(AI 대화·🎤/🔊) ⇄ 미니 퀴즈 8종 → 클리어(컨페티·리워드)
- [ ] 프로필(나 홈) + 성장 리포트(푸시 하위뷰)
- [ ] **리뷰랩(설계 확정 2026-06-12, 04_SCREENS ⑨):** 일일 복습 hero · 통계 · 카테고리 필터칩 ·
      **PhraseCard**(✕원문→✓교정+🔊 · "왜?" 노트 · 3핍 마스터리 · 🎤 따라말하기 · ★) — 2-7 SM-2/서버 `/me/review`와 연동
- [ ] 화면-데이터 의존성 연동(API 클라이언트)

> ✅ **레퍼런스 JSX 확보(handoff v2, 2026-06-12):** `screens-review-lab.jsx`가 `design-handoff_v2/reference/`에 추가됨
> (이전 "부재" 플래그 해소). 구현은 이 JSX + 04_SCREENS ⑨ 명세 기준. 디자인 시스템은 v2에서 `ds-*` 모듈(`ds-foundations`/
> `ds-primitives`/`ds-characters`/`ds-faces`/`ds-equipment`/`ds-furniture`)로 재편 — 컴포넌트 포팅 시 참조.

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[승인 후 작성]*

## 검토 게이트 (Human Gate)

- [ ] 화면·카피·상호작용이 핸드오프와 일치하는가?
- [ ] 핵심 루프가 끊김 없이 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `07-growth-economy-review.md`
