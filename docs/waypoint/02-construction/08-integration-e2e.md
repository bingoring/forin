---
phase: 02-construction
stage: 08-integration-e2e
status: PENDING
updated: 2026-06-08
---

# [Stage 2-8] 통합 · E2E

## 목적

모바일↔서버 전체 통합, 핵심 사용자 여정 E2E 검증, 출시 전 안정화. Operations(Phase 3) 진입 준비.

## 입력 (Inputs)

- 2-1 ~ 2-7 전체 산출물
- 운영: [`../03-operations/01-deployment.md`](../03-operations/01-deployment.md)

## 체크리스트

- [ ] 핵심 여정 E2E: 온보딩 → 시나리오(대화·교정) → 클리어 → 리뷰랩 → 성장
- [ ] 일일 이벤트·광고·SM-2 복습 통합 동작
- [ ] 에러 처리·오프라인·토큰 만료·재시도, 성능/지연 점검
- [ ] AI 비용·지연 모니터링 훅, 분석 이벤트
- [ ] 출시 체크리스트(스토어 메타·권한·개인정보)

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[승인 후 작성]*

## 검토 게이트 (Human Gate)

- [ ] 핵심 여정이 끊김·치명 버그 없이 동작하는가?
- [ ] Phase 3(배포·모니터링) 진입 준비가 됐는가?

## 다음 단계

승인 후 → `STATUS.md` 갱신 → Phase 3 Operations
