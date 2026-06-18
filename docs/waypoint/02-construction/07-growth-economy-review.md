---
phase: 02-construction
stage: 07-growth-economy-review
status: PENDING
updated: 2026-06-12
---

# [Stage 2-7] 성장 · 경제 · 복습 · 이벤트 전달

## 목적

성장/보상 경제(XP·평판·자격·스티커·칭호·히든미션), 리뷰랩 SM-2 간격 반복, 이벤트 전달
(메인 루트 + 일일 풀 + 보상형 광고)을 구현·연결한다.

## 입력 (Inputs)

- 도메인 §진행/성장·복습·전달: [`../01-inception/02-domain-model.md`](../01-inception/02-domain-model.md)
- 경제 §J·K, 이벤트 전달: [`../01-inception/03-architecture-decision.md`](../01-inception/03-architecture-decision.md)
- **리뷰랩 화면 명세(설계 확정 2026-06-12):** [`../inputs/design-handoff_v7/04_SCREENS.md`](../inputs/design-handoff_v7/04_SCREENS.md) ⑨

## 체크리스트

- [ ] XP/레벨/커리어 패스, 평판(→NPC 반응 가중), 자격·스티커·칭호·히든미션
- [ ] **유기적 환류**(보상이 입장 조건·NPC 반응·칭호로 재사용), 보상 타입 코드측 허용집합
- [ ] 리뷰랩 SM-2 스케줄·마스터리·복습 세션 — **화면(`ScreenReviewLab`)은 2-6에서 빌드**, 2-7은 데이터·스케줄링
      (서버 `/me/review` 기존). PhraseCard = 시나리오 AI 교정문 → 카드(원문→교정·"왜?"·마스터리·🎤). 카테고리 필터·복습 큐.
- [ ] 이벤트 전달: 메인 루트 그래프, 일일 풀(00:00 리셋·가중 샘플링), 보상형 광고(+N·상한)
- [ ] 경제 수치 설정 테이블(하드코딩 금지)

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[승인 후 작성]*

## 검토 게이트 (Human Gate)

- [ ] 보상이 유기적으로 맞물려 동기를 유발하는가?
- [ ] 복습·이벤트 전달이 의도대로 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `08-integration-e2e.md`
