---
phase: 01-inception
stage: 02-domain-model
status: PENDING
updated: 2026-06-04
---

# [Stage 1-2] Domain Model

## 목적

forin의 핵심 도메인을 엔티티·관계·상태·불변식으로 모델링하여, 서버 데이터
모델과 모바일 게임 상태의 공통 기반을 정의한다.

## 입력 (Inputs)

- 이전 스테이지: [`01-context-synthesis.md`](01-context-synthesis.md)
- 제품 기획서: [`../prd.md`](../prd.md)
- 디자인 핸드오프(특히 시나리오·퀴즈·맵/인테리어):
  [`../inputs/design-handoff/04_SCREENS.md`](../inputs/design-handoff/04_SCREENS.md),
  [`05_MAP_AND_INTERIORS.md`](../inputs/design-handoff/05_MAP_AND_INTERIORS.md),
  [`reference/scenarios-data.jsx`](../inputs/design-handoff/reference/scenarios-data.jsx)

## 체크리스트

- [ ] 핵심 엔티티 정의: User, Profile, Department, Scenario, DialogueNode, Quiz(8유형),
      Progress/Clear, Growth(XP·평판·자격·스티커), ReviewItem, EventBoardEntry
- [ ] 엔티티 간 관계·카디널리티 정의
- [ ] 상태 머신(시나리오 진행, 다이얼로그↔퀴즈 전환, 클리어 조건) 정의
- [ ] enum류 필드는 코드측 허용집합으로 표현(확장성 우선, DB CHECK 지양)
- [ ] 콘텐츠(저작) vs 사용자 상태(영속) 경계 구분

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[AI가 도메인 모델을 여기에 작성]*

## 검토 게이트 (Human Gate)

> 아래 항목을 확인 후 frontmatter의 status를 `HUMAN_APPROVED`로 변경하세요.

- [ ] 도메인 모델이 PRD의 핵심 루프·성장 시스템을 빠짐없이 표현하는가?
- [ ] 콘텐츠/사용자상태 경계가 명확한가?
- [ ] 아키텍처 결정에 필요한 모델이 충분히 구체화되었는가?

## 다음 단계

승인 후 → `STATUS.md`에서 1-2 상태를 `HUMAN_APPROVED`로 업데이트 → `03-architecture-decision.md`로 이동
