# forin — waypoint 현황

[PRD](prd.md) · [결정 로그](DECISIONS.md) · [지난 기록](HISTORY.md) · [최신 핸드오프](inputs/design-handoff_v49/README.md)

## 스테이지

| ID | 스테이지 | 상태 | 줄기 | 지금 | 기다림 | 링크 |
|---|---|---|---|---|---|---|
| 1-1 | Context Synthesis | MERGED | | | | [문서](01-inception/01-context-synthesis.md) |
| 1-2 | Domain Model | MERGED | | | | [문서](01-inception/02-domain-model.md) |
| 1-3 | Architecture Decision ⚠️ | MERGED | | | | [문서](01-inception/03-architecture-decision.md) |
| 2-1 | 서버 기반 | MERGED | | | | [문서](02-construction/01-server-foundation.md) |
| 2-2 | 도메인·콘텐츠 API + 계약 | MERGED | | | | [문서](02-construction/02-domain-content-api.md) |
| 2-3 | AI 레이어 | MERGED | | | | [문서](02-construction/03-ai-layer.md) |
| 2-4 | 모바일 기반 | MERGED | | | | [문서](02-construction/04-mobile-foundation.md) |
| 2-5 | 맵/탐험 엔진 | MERGED | | | | [문서](02-construction/05-map-engine.md) |
| 2-6 | 화면·플로우 | MERGED | | | | [문서](02-construction/06-screens-flows.md) |
| 2-7 | 성장·경제·복습·이벤트 전달 | MERGED | | | | [문서](02-construction/07-growth-economy-review.md) |
| 2-8 | 통합·E2E | AI_PROPOSED | | 결과 검토: 전체 여정 스모크 48/0, 남은 항목은 3단계로 이관 | | [문서](02-construction/08-integration-e2e.md) |
| 2-9 | 상황 학습 4단계 | IN_PROGRESS | 콘텐츠 | 구현: OR 묶음 7 검토 B 중지, 남은 OR 21주제 | | [문서](02-construction/09-lesson-four-steps.md) |
| R-1 | 독립 코드 리뷰: 맵 엔진 🔍 | MERGED | | | | [문서](0R-review/01-independent-review.md) |
| R-2 | 독립 코드 리뷰: 런타임·성장 🔍 | MERGED | | | | [문서](0R-review/02-independent-review.md) |
| 3-1 | Deployment | IN_PROGRESS | 출시 | 구현: iOS TestFlight 내부 배포, Android 미착수 | 오너 할 일 | [문서](03-operations/01-deployment.md) |
| 3-2 | Monitoring | PENDING | 출시 | | | |

## 오너 할 일

- [ ] Google Play 개발자 계정 신원확인 (막음: 3-1)
- [ ] Google Play 서비스 계정 키 발급 (막음: 3-1)
- [ ] 콘텐츠 배포 묶음(ICU 4~9·OR 1~6) staging 시드→승격→prod 시드 승인
