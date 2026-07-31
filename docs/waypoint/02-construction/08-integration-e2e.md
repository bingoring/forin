---
phase: 02-construction
stage: 08-integration-e2e
status: AI_PROPOSED
updated: 2026-06-08
---

# [Stage 2-8] 통합 · E2E

## 목적

모바일↔서버 전체 통합, 핵심 사용자 여정 E2E 검증, 출시 전 안정화. Operations(Phase 3) 진입 준비.

## 입력 (Inputs)

- 2-1 ~ 2-7 전체 산출물
- 운영: [`../03-operations/01-deployment.md`](../03-operations/01-deployment.md)

## 체크리스트

- [x] 핵심 여정 E2E: 온보딩 → 시나리오(대화·교정) → 클리어 → 리뷰랩 → 성장 — `server/scripts/e2e_smoke.sh`(24 assert, 재실행 가능·상태 독립)
- [x] 일일 이벤트·광고·SM-2 복습 통합 동작 — 스모크에 일일풀(12)·광고 top-up(+3/상한 429)·SM-2 등급 포함
- [x] 에러 처리·토큰 만료·재시도 — refresh 회전(구 토큰 401)·401/400 경로 검증. 클라 401 인터셉터(refresh→dev 폴백) + 오프라인 폴백(campus/board bundled)은 코드 검증
- [ ] AI 비용·지연 모니터링 훅, 분석 이벤트 — **후속**(Phase 3 관측성)
- [ ] 출시 체크리스트(스토어 메타·권한·개인정보) — **후속**(Phase 3 배포)

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

**통합 스모크(구현·검증):** `server/scripts/e2e_smoke.sh` — dev 서버(ENV=dev) 대상 전체 여정 API E2E.
① 인증(dev 로그인) ② 온보딩(PATCH /me/profile → onboarded) ③ 토큰 refresh 회전(신규 발급·구 토큰 재사용 401) ④ 커리큘럼 구조(5챕터·상태 파생) ⑤ 대화 응답+백그라운드 교정→리뷰 카드 증가 ⑥ 클리어 XP 적립·성장 집계 ⑦ SM-2 등급 ⑧ 일일풀 12건+광고 top-up ⑨ 미션 영구 기록 ⑩ 부서 상황(완료 태그) ⑪ 에러 상태코드(401/400). 모든 단언 monotonic/구조적이라 어떤 상태에서도 통과. **결과: 24 passed / 0 failed.**

**발견·정합:** /auth/refresh는 TokenPair를 최상위로 반환(로그인은 {tokens} 래핑) — 클라 인터셉터가 두 형태를 각각 파싱함을 확인(회귀 없음).

**후속(Phase 3 관측성/배포로 이관):** AI 비용·지연 메트릭, 분석 이벤트 파이프라인, 성능/부하 프로파일링, 스토어 메타·권한·개인정보 처리방침. MVP 안정성 게이트는 위 스모크로 충족.

## 검토 게이트 (Human Gate)

- [ ] 핵심 여정이 끊김·치명 버그 없이 동작하는가?
- [ ] Phase 3(배포·모니터링) 진입 준비가 됐는가?

## 다음 단계

승인 후 → `STATUS.md` 갱신 → Phase 3 Operations
