---
phase: 01-inception
stage: 03-architecture-decision
status: PENDING
updated: 2026-06-04
---

# [Stage 1-3] Architecture Decision ⚠️

> 비가역 게이트. 승인 전 `_templates/gate-template.md`의 추가 체크리스트를 반드시 확인한다.

## 목적

도메인 모델을 실제로 구현할 시스템 아키텍처를 확정한다. `prd-tech.md`의
**게이트 승인 대상** 항목을 모두 결정하고, Construction 스테이지를 정의한다.

## 입력 (Inputs)

- 이전 스테이지: [`02-domain-model.md`](02-domain-model.md)
- 기술 방향: [`../prd-tech.md`](../prd-tech.md)

## 결정 대상 (prd-tech.md 게이트 항목)

> 서버 프레임워크(stdlib 확정)·콘텐츠 전달(서버 fetch)·오디오 MVP 포함 등 방향은
> `prd-tech.md`에서 사용자 확정. 본 게이트는 그 **세부 구현·제공자·비용**을 비준한다.

- [ ] 서버: stdlib `net/http` 위에 도입할 전문 라이브러리 선별(검증/미들웨어/라우팅 보강)
- [ ] 데이터베이스: 쿼리 전략(sqlc/pgx 등)·마이그레이션 도구 + Redis 도입 범위
- [ ] 인증·토큰 전략: 시중 사례 조사 → roll-own vs 매니지드(Clerk/Supabase/Auth0) 확정
- [ ] 콘텐츠 전달: 서버 fetch + axios 래퍼 클라이언트, 상황판 일일 갱신·캐시 메커니즘
- [ ] 호스팅: Docker 기반 dev=prod, 플랫폼 확정(Fly.io/Render vs ECS Fargate) + Cloudflare CDN
- [ ] CI/CD: 모노레포 경로 필터, 코드젠 검증
- [ ] 이벤트 전달: 메인 루트 + 일일 풀 + 보상형 광고 모델 확정, 300+ 작성 워크스트림 계획
- [ ] (Patch 1 — MVP 게이트 범위 밖) 음성·LLM 레이어(자유 대화·STT/TTS·LLM 교정)는 다음 패치에서 별도 설계
- [ ] 계약/코드젠 파이프라인 구체화 (swag → openapi.yaml → openapi-typescript)
- [ ] Construction 스테이지 분해 및 STATUS.md 갱신

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[AI가 아키텍처 결정안과 대안 비교를 여기에 작성]*

## 검토 게이트 (Human Gate) ⚠️ 비가역

기본 게이트:
- [ ] AI 제안이 PRD 요구사항과 일치하는가?
- [ ] Construction 진행에 필요한 결정이 모두 내려졌는가?

비가역성 확인:
- [ ] 결정 번복 시 영향받는 파일/레이어 목록을 작성했는가?
- [ ] 대안 접근법을 검토하고 탈락 이유를 문서화했는가?
- [ ] 외부 API 의존성 및 비용 구조(인증·STT·호스팅·DB)를 확인했는가?
- [ ] 잠기는(lock-in) 기술 스택이 수용 가능한가?

## 다음 단계

승인 후 → `STATUS.md`에서 1-3 상태를 `HUMAN_APPROVED`로 + Construction 스테이지 확정
→ Phase 2 첫 스테이지로 이동
