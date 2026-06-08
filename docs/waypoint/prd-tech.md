# forin — Technical Decisions (prd-tech)

> 부트스트랩 단계에서 확정된 기술 방향. **확정(Locked)** 항목은 결정 완료,
> **게이트 승인 대상**은 Inception 1-3 Architecture Decision ⚠️ 에서 최종 비준한다.
> 본 문서는 Inception 스테이지의 기술 입력물 역할을 한다.

## 확정 (Locked)

### 레포 구조 — 모노레포
- 단일 공개 레포 `bingoring/forin`.
- 레이아웃:
  ```
  forin/
  ├── docs/dlc/            ← waypoint 서브모듈 (프레임워크 + 본 기획 문서 home)
  ├── mobile/              ← React Native + Expo 앱
  ├── server/              ← Go API 서버
  ├── packages/contract/   ← openapi.yaml + 생성된 TS 클라이언트
  └── (Makefile/CI 등)
  ```
- 이전 자산은 `archive/pre-waypoint` 브랜치에 보관, master는 새 출발.
- 분리 레포(`forin-mobile`/`forin-server`)는 미사용.

### 모바일 스택 — React Native + Expo (핸드오프 지정)
- 내비게이션: `expo-router`
- 게임 아트: `react-native-svg` (프로토타입의 SVG primitive를 1:1 포팅)
- 폰트: `expo-font` (DungGeunMo, Galmuri11 — 한글 픽셀 폰트)
- 애니메이션: `react-native-reanimated`
- 상태: Zustand (또는 Context)
- 픽셀 박스/하드 섀도우 등 토큰은 `01_DESIGN_TOKENS.md` 기준.
- **맵 / 이동 엔진 (중점 구현)** — 사용자가 캠퍼스·인테리어를 **자유롭게 돌아다니므로**,
  타일 기반 이동, **사물 충돌(collision)**, **자연스러운 방·부서 전환**을 높은 완성도로 구현한다
  (`05_MAP_AND_INTERIORS.md`의 `ITILE=16`·`ZOOM=2` 타일 그리드 기준). 부드러운 이동·카메라
  팔로우는 `react-native-reanimated`로. 게임 상태(위치·충돌맵·전환)는 Zustand로 관리.

### 서버 스택 — Go (stdlib 우선, 프레임워크 없음)
- 언어: Go. **웹 프레임워크 없이 `net/http`(stdlib) 기반**으로 구성한다.
  라우팅은 Go 1.22+ `net/http` 패턴 매칭(메서드+경로)을 사용하고, JSON 직렬화·응답도 직접 다룬다.
  프레임워크 의존을 피해 확장성·코드 구조 통제력을 확보한다.
- **필요한 부분만 전문 라이브러리를 선별 도입** — 예: 요청 본문 검증(`go-playground/validator`),
  OpenAPI 어노테이션(`swag`); 미들웨어는 `net/http` 핸들러 래핑으로 직접 또는 경량 라이브러리.
- 역할: 소셜 원탭 인증, 사용자/진행도 영속화(XP·평판·자격·스티커·리뷰랩 저장),
  시나리오/콘텐츠·이벤트 전달(상황판 일일 갱신). (자유 대화·LLM 교정 오케스트레이션은 **Patch 1**.)

### API 계약 — Go-first
- Go 핸들러에 swaggo 어노테이션 → `swag`으로 `openapi.yaml` 생성
  → `openapi-typescript`로 TS 클라이언트 생성.
- 산출물은 `packages/contract/`에 위치, 모바일이 import.
- 계약은 서버 구현을 따라간다(서버 리드). 드리프트 방지를 위해 코드젠은 모노레포 한곳에서 원자적으로 수행.

## 방향 확정 · 세부는 게이트 (1-3 Architecture Decision ⚠️ 에서 비준)

> 아래는 사용자 결정으로 **방향이 확정**된 항목들이다. 구체 구현·제공자·비용 등 **세부는 게이트**에서 비준한다.
> `권고`는 AI 예비 권장안(게이트에서 최종 확정).

- **데이터베이스**: **PostgreSQL**(주 저장소). 캐시·세션·일일 이벤트 리셋·레이트리밋 등에
  **Redis 선택 도입**. 쿼리 전략(`database/sql` + `sqlc`/`pgx` 등)·마이그레이션 도구는 게이트에서 확정.
- **인증·토큰 전략**: AI가 시중 사례를 조사해 제안·채택.
  `권고(예비)`: Apple/Google **OIDC 소셜 로그인** + 서버 발급 **단기 access JWT(~15분) + refresh 토큰 회전**,
  refresh는 `expo-secure-store`(Keychain/Keystore) 저장. **roll-own vs 매니지드(Clerk/Supabase/Auth0)** 비교 후 게이트 확정.
- **콘텐츠 전달**: **서버 fetch 확정**(번들 아님). 모바일은 `fetch` 직접 호출 대신
  **axios를 감싼 요청 모듈(client)**로 HTTP 구현을 교체 가능하게 추상화 — 새 상황/환자·타임이벤트 추가,
  향후 **CDN** 전환 등 확장성 대비. 상황판 일일 갱신·캐시 메커니즘은 게이트 확정.
- **호스팅/배포**: **개발=프로덕션 동일 환경**을 위해 **Docker 컨테이너화 확정**.
  `권고`: 솔로 MVP는 **Fly.io 또는 Render**(Docker 네이티브·관리형 Postgres/Redis·낮은 운영부담),
  앞단에 **Cloudflare를 CDN/DNS/엣지 캐시**로. AWS 중심 확장 시 **ECS Fargate + RDS/ElastiCache**.
  (Cloudflare Workers는 JS/엣지용 → Go 앱 런타임 부적합, CDN 용도만.) 모바일은 **EAS** 빌드/배포. 최종 선택 게이트.
- **CI/CD**: 모노레포 경로 필터(mobile/server 독립 배포) + 코드젠 검증 단계. (승인됨.)

## Patch 1 (post-MVP) — 음성 · LLM 레이어 (MVP 제외)

> 서버·비용·지연 복잡도가 커 MVP에서 분리. **다음 패치**에서 별도 설계·확정한다.
> (`prd.md` → Post-MVP 참고.)

- **LLM 활용**: 자유 발화 대화 = 고급 모델, 답안 교정·채점 = 저가 모델.
  모델·제공자·비용·지연·프롬프트/캐싱은 Patch 1 설계 시 확정.
- **TTS**(🔊): 최신·고사용성. `expo-speech` 우선, 부족 시 클라우드 TTS.
- **STT / 발음 비교**(🎤 + free-speak): `expo-av` 우선, 부족 시 최신 STT.

## 제약 / 비고

- 코드 컨벤션: enum류 필드는 DB CHECK 제약 대신 코드측 허용집합으로 확장성 우선.
- 커밋 스타일: Co-Authored-By 트레일러 미포함(솔로 작업 형태 유지).
