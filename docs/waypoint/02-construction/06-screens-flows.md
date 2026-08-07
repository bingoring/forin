---
phase: 02-construction
stage: 06-screens-flows
status: IN_PROGRESS
updated: 2026-06-12
---

# [Stage 2-6] 화면 · 플로우

## 목적

핸드오프의 전체 화면·플로우 구현 — 온보딩 → 캠퍼스 → 인테리어 → 브리핑 → 다이얼로그(AI) ⇄
미니 퀴즈(8종) → 클리어 → 상황판 → 프로필/성장 리포트 → 리뷰랩.

## 입력 (Inputs)

- 화면 명세: [`../inputs/design-handoff_v10/04_SCREENS.md`](../inputs/design-handoff_v10/04_SCREENS.md)
- 2-3 AI 레이어, 2-4 모바일 기반, 2-5 맵 엔진

## 하단 탭 IA (디자인 확정 — Option A, 2026-06-12)

4탭 **캠퍼스 / 상황판 / 리뷰랩 / 나**. 단, 현재 모바일 탭은 `campus/board/lab/me`로 **이미 일치**(`lab`=리뷰랩).
- **나(me) = Profile 홈**(`ScreenProfile`). **성장 리포트(`ScreenGrowth`)는 별도 탭이 아니라 나 탭의 푸시 하위뷰**
  (프로필의 "오늘의 성장 리포트" 행 / 하루·시나리오 종료 시 자동) — RN 스택 push.
- **리뷰랩(lab) = Review Lab**(`ScreenReviewLab`) 자체 탭. 프로필에 "리뷰랩 열기 ▶" 티저 딥링크.

## 체크리스트

- [ ] 온보딩(Splash↔Login·Locale·Job·Level)
- [ ] 캠퍼스/인테리어 화면(2-5 엔진 사용), 상황판(일일 이벤트)
- [ ] 브리핑 → 다이얼로그(AI 대화·🎤/🔊) ⇄ 미니 퀴즈 8종 → 클리어(컨페티·리워드)
- [ ] 프로필(나 홈) + 성장 리포트(푸시 하위뷰)
- [ ] **리뷰랩(설계 확정 2026-06-12, 04_SCREENS ⑨):** 일일 복습 hero · 통계 · 카테고리 필터칩 ·
      **PhraseCard**(✕원문→✓교정+🔊 · "왜?" 노트 · 3핍 마스터리 · 🎤 따라말하기 · ★) — 2-7 SM-2/서버 `/me/review`와 연동
- [ ] 화면-데이터 의존성 연동(API 클라이언트)

> ✅ **레퍼런스 JSX 확보(handoff v2, 2026-06-12):** `screens-review-lab.jsx`가 `design-handoff_v10/reference/`에 추가됨
> (이전 "부재" 플래그 해소). 구현은 이 JSX + 04_SCREENS ⑨ 명세 기준. 디자인 시스템은 v2에서 `ds-*` 모듈(`ds-foundations`/
> `ds-primitives`/`ds-characters`/`ds-faces`/`ds-equipment`/`ds-furniture`)로 재편 — 컴포넌트 포팅 시 참조.

> **Handoff v8 영향(2026-06-27):** v8의 **엘리베이터 화면**(빌딩→층 선택, 상황칩) + **부서 마스터블루프린트 인테리어 9종**
> (ER/OR/ICU/Peds/Pharma 재구성 + 내·외·정형 병동 + 피부과 센터)은 맵/인테리어 엔진+콘텐츠라 **2-5 재오픈(§5v 5f·5g)** 에서
> 다룬다. 2-6은 이들을 **소비**하는 화면-플로우(온보딩·브리핑·다이얼로그·퀴즈·상황판·프로필·리뷰랩)에 집중. **외래 클리닉 엔진
> (5d-iii)은 보존**(데이터구동 화면 유지) — bespoke 병동/센터가 대체하면 캠퍼스/엘리베이터 진입만 새 화면으로 전환.

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[승인 후 작성]*

## 온보딩 화면 구현 (2026-08)

핸드오프(screens-onboarding) 4단계 온보딩을 실제 UI로 구현. 진입 게이트(index.tsx):
미인증 → `/splash` → 로그인 → 로케일 → 직업 → 레벨 → 캠퍼스.

- **Splash**(앱 첫 화면): 밴드형 하늘 그라디언트(peach→mint) + 픽셀 구름·태양·비행기 +
  yellow 픽셀 그림자 `forin` 워드마크 + "▶ 처음 시작하기" + 로그인 링크.
- **Login**: mint→cream 그라디언트 + 워드마크 + 3개 One-Tap 버튼(Google/Apple/Kakao,
  크리스프 SVG 글리프 + 하드 픽셀 그림자) + 약관 문구 + 개발자 로그인(dev only).
  - **소셜 로그인 배선(2026-08)**: 서버 `/auth/social`이 OIDC id_token 검증(Google/Apple/
    Kakao). 클라이언트: Apple=expo-apple-authentication(완성). Google=expo-auth-session
    Google provider(id_token). Kakao=expo-auth-session code flow→토큰교환→id_token.
    클라이언트 ID는 env(`EXPO_PUBLIC_GOOGLE_IOS/ANDROID/WEB_CLIENT_ID`/
    `EXPO_PUBLIC_KAKAO_REST_API_KEY`, `.env.example` 참고). Google은 플랫폼별 client
    ID 별개(iOS=번들ID, Android=패키지명+SHA-1, Web=id_token audience) — `isProviderConfigured`가
    `Platform.OS`로 해당 플랫폼 ID를 확인. **미설정 시 해당 버튼은 훅을
    안 띄우고 "설정 필요" 안내**(훅에 빈 client ID를 넘기면 렌더 에러 → 프로바이더별
    버튼 컴포넌트를 configured일 때만 마운트). 서버 `GOOGLE/KAKAO_CLIENT_ID`(audience)와
    클라이언트 ID 일치 필요. expo-crypto 추가로 dev-client 재빌드 필요(pod install+ad-hoc 서명).
  - **앱 식별자 확정(2026-08-07)**: `com.anonymous.forin`(Expo placeholder) → **`app.forin.mobile`**
    (iOS bundleIdentifier = Android package). 스토어 등록 후엔 영구 불변이라 OAuth 클라이언트
    발급 전에 확정. Android 서명은 **EAS 관리 키스토어**(`eas.json` 신규 · `credentialsSource: remote`,
    앱당 키스토어 1개를 전 프로필 공유 → dev-client 빌드도 같은 SHA-1). 로컬 `expo run:android`를
    쓰면 `~/.android/debug.keystore` SHA-1이 달라 `DEVELOPER_ERROR(10)` → 그 경우 별도 등록 필요.
  - **서버 audience 목록화(2026-08-07)**: Google은 플랫폼별 클라이언트 ID가 따로라 id_token `aud`가
    플랫폼마다 다름 → 단일 audience 검증이면 한 플랫폼만 통과. `GOOGLE/APPLE/KAKAO_CLIENT_ID`를
    **콤마 구분 목록**으로 파싱(`config.splitList`), verifier는 `SkipClientIDCheck: true` 후
    `audienceAllowed`로 집합 대조(`oidc_verifier.go`). 빈 목록 = 프로바이더 비활성(기존과 동일).
    테스트 신규 2종(`config_test.go`·`oidc_verifier_test.go`).
- **Locale**: 이모지 국기 → **픽셀 국기**(태극기/일장기/성조기/독일기)로 교체(이모지 지양 방침).
- **Job/Level**: 기존 구현이 핸드오프와 이미 일치 → 유지.
- 공용 픽셀 아트: `components/onboardingArt.tsx`(VertGradient 밴드 그라디언트[native
  expo-linear-gradient 불필요] + Cloud/PixelSun/PixelPlane + 프로바이더 글리프 + FLAGS).
- 검증: tsc·jest 209 + 시뮬(splash/login/locale/job 렌더 확인).

## 소셜 로그인 검증 (2026-08-07)

**Google — 등록 검증 완료.** 시뮬레이터 탭 입력이 불가(osascript 보조접근 `-1719`)해서, 앱이 보내는
것과 동일한 인가 요청을 Google 엔드포인트에 직접 던져 검증. redirect는 expo-auth-session이
만드는 `app.forin.mobile:/oauthredirect`(`providers/google.js:144` = `${applicationId}:/oauthredirect`),
Info.plist에 `forin`·`app.forin.mobile` 스킴 등록 확인.
- iOS 클라이언트: 처음부터 통과(로그인 페이지 반환).
- Android 클라이언트: `Error 400: invalid_request — "Custom URI scheme is not enabled for your
  Android client."` → **콘솔 Advanced Settings에서 "Enable Custom URI scheme" ON** 후 통과.
  (신규 Android 클라이언트는 기본 비활성. iOS는 기본 활성이라 통과했던 것.)
- 남음: 실제 계정 로그인 → `/auth/social` (사람이 눌러야 함).

**Kakao — 커스텀 스킴 제약으로 네이티브 앱 키 방식 채택.** 콘솔의 REST API 키 Redirect URI 란은
`forin://`·`forin://oauth` 모두 "유효하지 않은 URL"로 거부(http/https만 허용). 반면
`kakao<NATIVE_APP_KEY>://oauth`는 콘솔 등록 없이 **네이티브 앱 키에 암묵적으로 귀속**된 리디렉트
(카카오 자체 SDK가 쓰는 값)라, expo-auth-session을 유지한 채 **client_id를 네이티브 앱 키로** 교체:
- `app.json` `scheme`를 배열로 → `["forin", "kakao<NATIVE_KEY>"]` (prebuild+네이티브 재빌드 필요)
- `SOCIAL_CONFIG.kakaoNativeAppKey` + `kakaoRedirectUri`(auth.ts) 신설, REST 키 참조 제거
- 서버 `KAKAO_CLIENT_ID` = 네이티브 앱 키 (id_token의 aud)
- ⚠️ **미검증**: 카카오는 redirect_uri를 인가 요청이 아니라 **로그인 완료 후** 검증하므로,
  Google 때처럼 사전 probe로 판별 불가(대조군까지 로그인 페이지를 반환). 실패 시 `KOE006`이
  뜨며, 그 경우 대안은 (a) 네이티브 SDK `@react-native-kakao/user` 전환, (b) 서버 https 콜백 경유.
- ⚠️ 콘솔 Client Secret은 **켜지 말 것** — `exchangeCodeAsync`가 시크릿을 보내지 않아 토큰 교환 실패.

## 로그아웃 (2026-08-07)

`lib/auth.ts`에 `signOut()`은 있었으나 **호출하는 화면이 하나도 없었다** — 정상 경로로는 로그인
화면에 돌아갈 방법이 없었고(계정 전환 불가), 소셜 로그인 검증도 딥링크 우회로만 가능했다.
프로필 탭(`(tabs)/me.tsx`) 맨 아래 **계정 섹션**에 로그아웃 행 추가:
- `Alert` 확인 → `signOut()`(secure-store 토큰 삭제 + authStore 초기화) → `router.replace('/login')`
- 진행 중 `ActivityIndicator` + `disabled`(중복 탭 방지). 성공 시 화면이 언마운트되므로
  `signingOut`은 **실패 시에만** 해제.
- 참고: `bootstrapSession()`은 `__DEV__`에서 세션이 없으면 dev 자동 로그인을 한다(앱 루트 1회).
  같은 실행 중 로그아웃은 유지되지만, **앱을 재시작하면 dev 자동 로그인이 다시 걸린다**.

## 탭 명칭 직무 무관화 (2026-08)

'캠퍼스'는 병원 한정이라(프로그래머·변호사 등엔 부적합) 직무 무관 명칭으로 변경:
- **캠퍼스 → 커리어** (탭·화면 헤더·"커리어 탐험 모드"·인테리어 복귀 라벨 "↓ 커리어로"/"‹ 커리어" 전부).
- **나 → 프로필**.
아이콘(병원 아웃라인/사람)은 유지. 하단 탭: 커리어 / 상황판 / 리뷰랩 / 프로필.

## 검토 게이트 (Human Gate)

- [ ] 화면·카피·상호작용이 핸드오프와 일치하는가?
- [ ] 핵심 루프가 끊김 없이 동작하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `07-growth-economy-review.md`
