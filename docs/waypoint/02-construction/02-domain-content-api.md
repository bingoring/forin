---
phase: 02-construction
stage: 02-domain-content-api
status: PENDING
updated: 2026-06-08
---

# [Stage 2-2] 도메인·콘텐츠 API + 계약

## 목적

도메인 엔티티·유스케이스를 구현하고 콘텐츠/진행 API를 노출하며, Go-first 계약 코드젠
(swag → openapi.yaml → openapi-typescript)을 확립한다.

## 입력 (Inputs)

- [`01-server-foundation.md`](01-server-foundation.md)
- 도메인 모델: [`../01-inception/02-domain-model.md`](../01-inception/02-domain-model.md)
- 이벤트 카탈로그: [`../events-catalog.md`](../events-catalog.md)

## 체크리스트

- [ ] 콘텐츠 적재: 버전드 파일(YAML/JSON) → 마이그레이션/시드 → Postgres
- [ ] 콘텐츠 API: departments·interiors·events·scenarios·quizzes 조회(서버 fetch, ETag/Redis 캐시)
- [ ] 진행/성장 API: progress·attempts·reputation·certs·stickers·streak
- [ ] enum류 코드측 허용집합 구현
- [ ] swag 어노테이션 → `packages/contract/openapi.yaml` → openapi-typescript 클라이언트
- [ ] CI 코드젠 최신성 검증 게이트

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[승인 후 작성]*

## 검토 게이트 (Human Gate)

- [ ] API가 도메인 모델·핵심 루프를 충족하는가?
- [ ] 계약 코드젠이 드리프트 없이 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `03-ai-layer.md`
