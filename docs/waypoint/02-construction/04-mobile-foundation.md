---
phase: 02-construction
stage: 04-mobile-foundation
status: PENDING
updated: 2026-06-08
---

# [Stage 2-4] 모바일 기반 (Expo · 디자인 시스템)

## 목적

`forin-mobile`(`/mobile`) Expo 앱 토대 — expo-router, 디자인 토큰·픽셀 컴포넌트, 폰트,
상태(Zustand), axios 래퍼 API 클라이언트(생성된 TS 계약 사용), 인증 플로우.

## 입력 (Inputs)

- 디자인 토큰/컴포넌트: [`../inputs/design-handoff/01_DESIGN_TOKENS.md`](../inputs/design-handoff/01_DESIGN_TOKENS.md), [`02_COMPONENTS.md`](../inputs/design-handoff/02_COMPONENTS.md)
- 계약: `packages/contract` (2-2 산출)

## 체크리스트

- [ ] Expo 앱 초기화, expo-router 네비게이션 골격(온보딩/탭)
- [ ] 디자인 토큰(`theme/tokens.ts`) + 픽셀 박스/하드 섀도우/버튼/칩 등 컴포넌트
- [ ] 폰트(DungGeunMo·Galmuri11) expo-font 번들
- [ ] **axios 래퍼 클라이언트**(교체 가능) + 생성된 TS 계약 연동, 토큰 저장(expo-secure-store)
- [ ] 인증 플로우(소셜 로그인 → 서버 토큰) + 상태(Zustand)

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[승인 후 작성]*

## 검토 게이트 (Human Gate)

- [ ] 디자인 토큰·컴포넌트가 핸드오프와 일치하는가(고정밀)?
- [ ] API 클라이언트·인증이 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `05-map-engine.md`
