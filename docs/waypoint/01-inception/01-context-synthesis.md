---
phase: 01-inception
stage: 01-context-synthesis
status: PENDING
updated: 2026-06-04
---

# [Stage 1-1] Context Synthesis

## 목적

forin의 제품 기획서·디자인 핸드오프·기술 방향을 통합하여, 도메인 모델링과
아키텍처 결정의 기반이 되는 **합의된 컨텍스트 요약**을 산출한다.

## 입력 (Inputs)

- 제품 기획서: [`../prd.md`](../prd.md)
- 기술 방향: [`../prd-tech.md`](../prd-tech.md)
- 디자인 핸드오프: [`../inputs/design-handoff/README.md`](../inputs/design-handoff/README.md)
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

*[AI가 분석 결과를 여기에 작성]*

## 검토 게이트 (Human Gate)

> 아래 항목을 확인 후 frontmatter의 status를 `HUMAN_APPROVED`로 변경하세요.

- [ ] AI 제안이 PRD 요구사항과 일치하는가?
- [ ] 다음 스테이지(도메인 모델) 진행에 필요한 컨텍스트가 충분한가?
- [ ] 산출물(컨텍스트 요약)이 명확하게 정의되었는가?

## 다음 단계

승인 후 → `STATUS.md`에서 1-1 상태를 `HUMAN_APPROVED`로 업데이트 → `02-domain-model.md`로 이동
