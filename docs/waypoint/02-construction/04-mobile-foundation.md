---
phase: 02-construction
stage: 04-mobile-foundation
status: HUMAN_APPROVED
updated: 2026-06-10
---

# [Stage 2-4] 모바일 기반 (Expo · 디자인 시스템)

## 목적

`forin-mobile`(`/mobile`) Expo 앱 토대 — expo-router, 디자인 토큰·픽셀 컴포넌트, 폰트,
상태(Zustand), axios 래퍼 API 클라이언트(생성된 TS 계약 사용), 인증 플로우.

## 입력 (Inputs)

- 디자인 토큰/컴포넌트: [`../inputs/design-handoff_v10/01_DESIGN_TOKENS.md`](../inputs/design-handoff_v10/01_DESIGN_TOKENS.md), [`02_COMPONENTS.md`](../inputs/design-handoff_v10/02_COMPONENTS.md)
- 계약: `packages/contract` (2-2 산출)

## 체크리스트

- [ ] Expo 앱 초기화, expo-router 네비게이션 골격(온보딩/탭)
- [ ] 디자인 토큰(`theme/tokens.ts`) + 픽셀 박스/하드 섀도우/버튼/칩 등 컴포넌트
- [ ] 폰트(DungGeunMo·Galmuri11) expo-font 번들
- [ ] **axios 래퍼 클라이언트**(교체 가능) + 생성된 TS 계약 연동, 토큰 저장(expo-secure-store)
- [ ] 인증 플로우(소셜 로그인 → 서버 토큰) + 상태(Zustand)

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 0. 목표

`mobile/`에 RN+Expo 앱 토대 — expo-router 골격, 디자인 토큰·핵심 픽셀 컴포넌트, 폰트,
상태(Zustand), **타입세이프 axios 래퍼 API 클라이언트**(생성된 계약 사용), 인증 플로우.
화면 전체 구현은 2-6, 맵 엔진은 2-5.

### 1. 앱 스캐폴드

- **Expo(managed) + TypeScript + expo-router**. `mobile/`에 초기화.
- **네비게이션 골격**(핸드오프 구조): `app/(onboarding)/{splash,login,locale,job,level}` ·
  `app/(tabs)/{campus,board,lab,me}` · `app/interior/[dept]` · `app/scenario/[id]/...` — 라우트 셸만(내용은 2-6).
- 디렉토리: `src/{theme,components,api,store,lib}` + `assets/fonts`.

### 2. 디자인 시스템 (핸드오프 final)

- `theme/tokens.ts` — `01_DESIGN_TOKENS`의 색·타이포·스페이싱·반경(0)·하드 섀도우 토큰.
- **핵심 픽셀 컴포넌트**: `PixelBox`(하드 오프셋 섀도우=뒤에 ink 오프셋 View), `PixelButton`(press 시 섀도우로 dropping),
  `PixelChip`, `TopBar`, `BottomNav` 셸. (전체 컴포넌트 인벤토리는 2-6에서 확장.)
- **폰트**: `expo-font`로 DungGeunMo·Galmuri11 번들(`assets/fonts`), 폴백 모노스페이스.
- SVG 캐릭터/맵은 2-5(맵 엔진)에서.

### 3. API 클라이언트 (타입세이프 · 교체 가능)

- `src/api/client.ts` — **axios 인스턴스를 감싼 요청 모듈**(직접 `fetch` 금지, 라이브러리 교체 가능하게 추상화 — 1-3 결정).
- `packages/contract`의 **생성된 TS 타입**(`types.ts`) import → 엔드포인트 타입 안전.
- 인터셉터: access JWT 자동 첨부, 401 시 refresh 회전 → 재시도, 실패 시 로그아웃.
- 토큰 저장: `expo-secure-store`(Keychain/Keystore).

### 4. 상태 (Zustand)

`authStore`(토큰·사용자·로그인 상태), 게임/세션 스토어 placeholder. 휘발 게임 상태는 2-5에서.

### 5. 인증 플로우

소셜 로그인(`expo-apple-authentication`·`@react-native-google-signin`·Kakao SDK) → provider ID 토큰 →
`POST /auth/social` → 서버 JWT 수신·저장 → authed. 2-4는 **클라이언트 측 배선 + 로그인 화면 동작**까지(전체 온보딩 UI는 2-6).

### 6. 구현 증분

- **4a — ✅ 스캐폴드+디자인+클라이언트**(forin 커밋, 2026-06-10): Expo SDK56 + expo-router(`src/app`) 골격
  (온보딩 splash/login/locale/job/level + 4탭 campus/board/lab/me + interior/scenario 셸). 디자인 토큰
  (`theme/tokens.ts`) + 픽셀 컴포넌트(PixelBox/Button/Chip — 하드 오프셋 섀도우). Zustand `authStore`.
  **axios 래퍼 타입 클라이언트**(`@contract/types`·토큰 인터셉터·401 로그아웃), tsconfig `@contract` 경로.
  폰트는 family명 + `assets/fonts/README`(실 .ttf 후속). **검증: `tsc --noEmit` 통과 + `expo-doctor` 21/21.**
  시각 표시는 `npx expo start`(시뮬레이터/Expo Go, 사용자).
- **4b — ✅ 인증 플로우**(forin 커밋, 2026-06-10): `expo-secure-store` 토큰 영속 + authStore 하이드레이션
  (`restoreSession`→`/me`) + **client refresh 회전**(401→`/auth/refresh`→재시도, 실패 시 로그아웃) +
  인덱스 게이팅(authed→탭 / 미인증→로그인) + 로그인 화면 배선(`signIn(provider)`). **Apple**은
  `expo-apple-authentication`로 실구현; **Google/Kakao는 네이티브 SDK + provider 앱 등록 + dev build 필요**라
  인터페이스 스텁(설정 시 점등). 계약에 `/auth/refresh` 응답 타입 보강. 검증: `tsc` + `expo-doctor` 21/21.
  **2-4 구현 완료** — 실 소셜 로그인은 dev build/credential 준비 시점.

### ⚠️ 검증 제약(정직)

이 CLI 환경에선 **빌드/타입체크/번들(expo export)**까지 검증 가능하나, **화면 실표시는 iOS 시뮬레이터/기기/Expo Go**가 필요합니다
(사용자가 `npx expo start`로 확인). 비주얼 픽셀 정합은 사용자 디바이스에서 확인.

## 검토 게이트 (Human Gate)

- [ ] 디자인 토큰·컴포넌트가 핸드오프와 일치하는가(고정밀)?
- [ ] API 클라이언트·인증이 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `05-map-engine.md`
