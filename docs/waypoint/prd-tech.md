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

### 서버 스택 — Go
- 언어: Go. (프레임워크는 Echo 제안 — 게이트 승인 대상.)
- 역할: 소셜 원탭 인증, 사용자/진행도 영속화(XP·평판·자격·스티커·리뷰랩 저장),
  시나리오/콘텐츠 전달(상황판 일일 갱신).

### API 계약 — Go-first
- Go 핸들러에 swaggo 어노테이션 → `swag`으로 `openapi.yaml` 생성
  → `openapi-typescript`로 TS 클라이언트 생성.
- 산출물은 `packages/contract/`에 위치, 모바일이 import.
- 계약은 서버 구현을 따라간다(서버 리드). 드리프트 방지를 위해 코드젠은 모노레포 한곳에서 원자적으로 수행.

## 게이트 승인 대상 (1-3 Architecture Decision ⚠️ 에서 비준)

- **Go 웹 프레임워크 확정**: Echo vs chi vs Fiber.
- **데이터베이스**: 종류(PostgreSQL 유력)·ORM/쿼리 전략·마이그레이션 도구.
- **인증 제공자**: 소셜 원탭(Apple/Google 등) 구체화·토큰 전략(JWT/세션).
- **콘텐츠 전달 방식**: 정적 시나리오의 저장·배포(번들 vs 서버 fetch vs CDN), 상황판 일일 갱신 메커니즘.
- **호스팅/배포 타깃**: 서버 호스팅, 모바일 배포(EAS), 환경 분리.
- **CI/CD**: 모노레포 경로 필터(mobile/server 독립 배포), 코드젠 검증 단계.
- **답안 AI 교정 파이프라인**: 리뷰랩 PhraseCard 생성을 위한 사용자 답안 교정 방식
  (LLM API vs 규칙/사전 기반)·비용·지연.
- **TTS**: 리뷰랩 🔊 음성 재생(expo-speech 등) 제공자.
- **STT / 발음 비교**: 리뷰랩 🎤 따라 말하기 + 다이얼로그 free-speak 연동 대상
  (expo-av 등, MVP 스텁 여부 포함).

## 제약 / 비고

- 코드 컨벤션: enum류 필드는 DB CHECK 제약 대신 코드측 허용집합으로 확장성 우선.
- 커밋 스타일: Co-Authored-By 트레일러 미포함(솔로 작업 형태 유지).
