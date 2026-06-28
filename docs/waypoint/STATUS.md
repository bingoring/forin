# forin — Waypoint Status

**Framework:** [Waypoint](https://github.com/bingoring/waypoint)
**PRD:** [prd.md](prd.md) | [prd-tech.md](prd-tech.md)
**Design handoff:** [inputs/design-handoff_v9/](inputs/design-handoff_v9/README.md)
**Decisions (audit):** [DECISIONS.md](DECISIONS.md)
**Last updated:** 2026-06-27

> ⚠️ **Handoff v8 채택(2026-06-27) — 맵/화면 대규모 재설계, 재계획 대기.** 5개 파빌리온 캠퍼스 + 엘리베이터 화면 +
> 부서 마스터 블루프린트(ER/OR/ICU/Peds/Pharma 대형화) + 입원 병동(내·외·정형)·피부과 센터 신설. **외래 클리닉 엔진(5d-iii)은 v8에서 폐기**(redundant).
> 순서·클리닉엔진 처리·증분 분해는 사용자 결정 후. 상세: [DECISIONS](DECISIONS.md) 2026-06-27.

---

## Phase 1 — Inception (What)

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 1-1 Context Synthesis | [01-context-synthesis.md](01-inception/01-context-synthesis.md) | HUMAN_APPROVED |
| 1-2 Domain Model | [02-domain-model.md](01-inception/02-domain-model.md) | HUMAN_APPROVED |
| 1-3 Architecture Decision ⚠️ | [03-architecture-decision.md](01-inception/03-architecture-decision.md) | AI_PROPOSED |

## Phase 2 — Construction (How)

> 1-3 아키텍처 승인으로 확정(2026-06-08). + 콘텐츠 워크스트림 병행.

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 2-1 서버 기반 | [01-server-foundation.md](02-construction/01-server-foundation.md) | HUMAN_APPROVED |
| 2-2 도메인·콘텐츠 API + 계약 | [02-domain-content-api.md](02-construction/02-domain-content-api.md) | HUMAN_APPROVED |
| 2-3 AI 레이어 | [03-ai-layer.md](02-construction/03-ai-layer.md) | HUMAN_APPROVED |
| 2-4 모바일 기반 | [04-mobile-foundation.md](02-construction/04-mobile-foundation.md) | HUMAN_APPROVED |
| 2-5 맵/탐험 엔진 | [05-map-engine.md](02-construction/05-map-engine.md) | 재오픈 · v8 계획 HUMAN_APPROVED (5a~5e ✅ 엔진코어 · **5f 캠퍼스/엔진델타 + 5g 부서 마스터블루프린트 ×9** — §5v; 5f ✅ · 5g-a ER ✅ · 5g-b OR ✅ **(전 부서 블루프린트 1:1 전수 구현 — 오브젝트·인테리어 전부)** · 다음 5g-c ICU…) |
| 2-6 화면·플로우 | [06-screens-flows.md](02-construction/06-screens-flows.md) | PENDING |
| 2-7 성장·경제·복습·이벤트 전달 | [07-growth-economy-review.md](02-construction/07-growth-economy-review.md) | PENDING |
| 2-8 통합·E2E | [08-integration-e2e.md](02-construction/08-integration-e2e.md) | PENDING |

**병행 트랙:** [콘텐츠 워크스트림](content-workstream.md) — AI 작성(조사→초안→검수), **2-2 포맷 확정 후 본격 착수**. PENDING.

## Phase R — Independent Code Review 🔍 (Construction → Operations 게이트)

> 작성자와 **컨텍스트가 분리된** 독립·적대적 리뷰어가 코드를 검토한다. FRAMEWORK "리뷰 게이트" 참조.

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| R-1 Independent Code Review (2-5 맵 엔진 스코프) | [01-independent-review.md](0R-review/01-independent-review.md) | AI_PROPOSED (HIGH 1·MEDIUM 3·LOW 3·NIT 2 채택·수정; +6 테스트) |

## Phase 3 — Operations (Ship)

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 3-1 Deployment | [01-deployment.md](03-operations/01-deployment.md) | PENDING |
| 3-2 Monitoring | [02-monitoring.md](03-operations/02-monitoring.md) | PENDING |

---

## AI 진입점

> AI는 위 테이블에서 `PENDING` 상태인 가장 앞 스테이지(1-1 Context Synthesis)부터 작업을 시작하세요.
> 규칙: [`FRAMEWORK.md`](../../FRAMEWORK.md) 참조
