---
artifact: business-rules
build-spec: scenario-runtime
updated: 2026-07-18
---

# 시나리오 런타임 — Business Rules

## 콘텐츠 로드/검증
- `content.Scenario.Briefing`·`Persona.Sub/Hair/HairStyle`는 **optional** — nil/빈값 허용. 기존 `SCN-ER-00001`·`SCN-GEN-00003` yaml은 필드 없이 그대로 로드돼야 함(회귀 금지).
- seed는 upsert(id 기준). `er-hopkins-pain` 신규 추가는 기존 2건에 영향 없음.
- validation: id·title 필수. briefing 있으면 difficulty ∈ 1..3.

## 진입/권한
- 브리핑·대화 API는 **인증 필요**(`auth` 미들웨어). 모바일은 기존 토큰 인터셉터(`api/client.ts`) 재사용.
- `reqs.met` 계산: 클라이언트가 `/me`의 레벨/스탯을 threshold와 대조. **미충족이어도 진입 차단 안 함**(파일럿) — 표시만. 차단 정책은 후속.

## 대화 규칙 (기존 엔진 준수)
- 시스템 프롬프트는 서버 `buildSystemPrompt`(persona·언어·guardrails·goals)로 생성 — 클라이언트가 프롬프트를 만들지 않음.
- 응답 1~3문장·캐릭터 유지·메타 금지(엔진 규약). 모바일은 delta만 append.
- 언어: `/me` 프로필의 native/target로 서버가 구동(engine.langFor). 클라이언트 지정 불필요.

## 실패/엣지
- `GET /scenarios/{id}` 404 → 브리핑에서 "시나리오를 찾을 수 없음" fallback.
- 스트리밍 중 네트워크 끊김 → 부분 텍스트 유지 + 재시도 버튼. 세션ID는 유지.
- 빈 입력 전송 금지. 전송 중 중복 전송 잠금.

## 회귀 가드
- 서버: `go test ./...`(engine_test·content 로드) 통과. 신규 필드 optional 로드 테스트.
- 모바일: tsc 0 · 기존 jest 스위트 통과(인테리어 회귀 없음).
