---
phase: 03-operations
stage: 01-deployment
status: PENDING
updated: 2026-06-04
---

# [Stage 3-1] Deployment

## 목적

forin 서버(Go)와 모바일(RN/Expo)의 배포 파이프라인을 정의·구축한다.

## 입력 (Inputs)

- 아키텍처 결정: [`../01-inception/03-architecture-decision.md`](../01-inception/03-architecture-decision.md)
- Construction 산출물 (Phase 2)

## 체크리스트

- [ ] 모노레포 경로 필터 CI (mobile/server 독립 배포)
- [ ] 서버 배포 (호스팅 타깃·컨테이너·환경 변수·DB 마이그레이션)
- [ ] 모바일 배포 (EAS Build/Submit, 환경 분리, OTA 업데이트 정책)
- [ ] 계약 코드젠 검증을 릴리스 게이트에 포함

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[AI가 배포 설계를 여기에 작성]*

## 검토 게이트 (Human Gate)

- [ ] 배포 절차가 재현 가능하고 롤백 가능한가?
- [ ] 시크릿·환경 분리가 안전하게 구성되었는가?

## 다음 단계

승인 후 → `STATUS.md` 갱신 → `02-monitoring.md`로 이동
