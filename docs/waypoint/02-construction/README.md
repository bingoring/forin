# Phase 2 — Construction (stages TBD)

이 디렉토리의 스테이지 문서는 **Inception 1-3 Architecture Decision이
`HUMAN_APPROVED`된 후** 확정한다. 승인 시 도메인 모델·아키텍처에 맞춰
레이어별 구현 스테이지를 정의하고 `STATUS.md` Phase 2 테이블을 갱신한다.

잠정 레이어 분해(아키텍처 게이트에서 확정):

1. Go 서버 — 도메인·영속·인증·콘텐츠 API (swaggo 어노테이션)
2. 계약/코드젠 — `swag → openapi.yaml → openapi-typescript` (`packages/contract/`)
3. 모바일(RN/Expo) — 디자인 시스템·캐릭터/맵 엔진·화면·게임 상태
4. 통합 — 모바일↔서버 연동, E2E 플로우
