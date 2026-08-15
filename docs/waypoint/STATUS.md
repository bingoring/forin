# forin — Waypoint Status

**Framework:** [Waypoint](https://github.com/bingoring/waypoint)
**PRD:** [prd.md](prd.md) | [prd-tech.md](prd-tech.md)
**Design handoff:** [inputs/design-handoff_v22/](inputs/design-handoff_v22/README.md) (최신) · [v21](inputs/design-handoff_v21/README.md)
**Decisions (audit):** [DECISIONS.md](DECISIONS.md)
**Last updated:** 2026-08-15

> ✅ **홈 탭 + 동료 시스템(핸드오프 v20→v21) 구현 완료(2026-08-10).** Build Spec U1~U10 전부.
> 서버(마이그레이션·도메인·저장소·`GET /me/home`·동료 API 13종·콘텐츠 시드) + 모바일(탭 5개·홈 10모듈·
> 동료 4화면·프로필 카드). 실 DB 2사용자 E2E + 시뮬레이터 렌더 검증 + **스모크 48/0**(기존 24) + 계약 재생성.
> Build Spec `IMPLEMENTED`. 상세는 [`home-colleagues/`](02-construction/home-colleagues/build-spec-index.md).
>
> ✅ **2026-08 마감분**: 온보딩 화면 · 소셜 로그인(Apple/Google/**Kakao 공식 SDK**) · 로그아웃 ·
> 앱 식별자 `app.forin.mobile` 확정 · 브랜드 아이콘/스플래시 교체.
>
> 🏗 **이전 초점(2026-07): 시나리오 런타임 + 화면 플로우 마감.** 맵/부서 인테리어(2-5)는 완결. 그 위로 실제 학습 루프를
> 배선 중 — 브리핑→AI 다이얼로그(교정→리뷰랩 자동 등록)⇄퀴즈→클리어→성장 리포트/리뷰랩. 상세 진행은 아래 표 및
> [DECISIONS](DECISIONS.md) 2026-07-18~29 참조.
>
> ⚠️ **Handoff v8 채택(2026-06-27) — 맵/화면 대규모 재설계.** 5개 파빌리온 캠퍼스 + 엘리베이터 + 부서 마스터
> 블루프린트(ER/OR/ICU/Peds/Pharma 대형화) + 입원 병동(내·외·정형)·피부과 센터. **외래 클리닉 엔진(5d-iii)은 폐기**(redundant).

---

## Phase 1 — Inception (What)

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 1-1 Context Synthesis | [01-context-synthesis.md](01-inception/01-context-synthesis.md) | HUMAN_APPROVED |
| 1-2 Domain Model | [02-domain-model.md](01-inception/02-domain-model.md) | HUMAN_APPROVED |
| 1-3 Architecture Decision ⚠️ | [03-architecture-decision.md](01-inception/03-architecture-decision.md) | AI_PROPOSED |

## Phase 2 — Construction (How)

> 1-3 아키텍처 승인으로 확정(2026-06-08). + 콘텐츠 워크스트림 병행.

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 2-1 서버 기반 | [01-server-foundation.md](02-construction/01-server-foundation.md) | HUMAN_APPROVED |
| 2-2 도메인·콘텐츠 API + 계약 | [02-domain-content-api.md](02-construction/02-domain-content-api.md) | HUMAN_APPROVED |
| 2-3 AI 레이어 | [03-ai-layer.md](02-construction/03-ai-layer.md) | HUMAN_APPROVED |
| 2-4 모바일 기반 | [04-mobile-foundation.md](02-construction/04-mobile-foundation.md) | HUMAN_APPROVED |
| 2-5 맵/탐험 엔진 | [05-map-engine.md](02-construction/05-map-engine.md) | 재오픈 · v8 계획 HUMAN_APPROVED (5a~5e ✅ 엔진코어 · **5f 캠퍼스/엔진델타 + 5g 부서 마스터블루프린트 ×9** — §5v; 5f ✅ · 5g-a ER ✅ · 5g-b OR ✅ · 5g-c ICU ✅ · **5g-d Peds+NICU ✅**(외래·놀이·계측→4bed 병동→NICU 유리 전실·인큐베이터; pedsEquipment 16종) · **5g-e Pharmacy ✅**(수령창구·기송관→조제실·마약류 금고→무균 전실·에어샤워·무균조제실; pharmaEquipment 21종; 엘리베이터 타워 P1 + ER portal) · **5g-f 내과 병동 ✅**(서비스 스트립→간호 스테이션→4인 만성질환 병실(커튼)→1인실·VRE 격리; wardEquipment 16종; 엘리베이터 타워 8F) · 장비 handoff **v13**(2.5D+접지그림자) 전 부서 반영 · **5g-g 외과 병동 ✅**(처치·드레싱룸→간호 스테이션·보행→4인 수술후 병실→대수술 중증실; surgEquipment 8종·ward2 재사용; 엘리베이터 타워 7F) · **5g-h 정형외과 병동 ✅**(PT통로·석고실→간호 스테이션·보조기→4인 골절/견인 병실→고관절 골절실; orthoEquipment 11종; 엘리베이터 타워 6F) · **입원 병동 3종 완결**(내과 8F·외과 7F·정형 6F) · **5g-i 피부과 센터 ✅**(로비→진료실1/2→광선치료실→레이저 처치실; dermEquipment 11종; 엘리베이터 타워 2F) · **🎉 5g 부서 마스터블루프린트 9종 전부 완결**) |
> 🎙 **핸드오프 v22 착수(2026-08-15)** — v21 대비 문서는 `04_SCREENS.md`만 +30줄이고 실질은 **발음·스피킹 피드백**
> 신규(⑤b 4상태 + 11b/11c 목록 + 리뷰랩 확장)다. 감사 결과 `POST /pronunciation`은 있으나 **완전 무상태**이고
> Azure 요청이 `Granularity: Word`라 음소가 없다 — 즉 UI 포팅이 아니라 **서버 기능 추가**가 필요하다.
> **범위 분할: 녹음→채점→결과 루프 먼저**(드릴은 "지난 2주 이력"을 전제해 지금 만들면 빈 화면).
> Build Spec [`pronunciation/`](02-construction/pronunciation/build-spec-index.md) `DRAFT`·`comprehensive`.
> 결정 근거는 [DECISIONS](DECISIONS.md) 2026-08-15.

| 2-6 화면·플로우 | [06-screens-flows.md](02-construction/06-screens-flows.md) | **완료(2026-08-10)** — 온보딩(splash/login/locale/job/level) ✅ · 캠퍼스/인테리어/상황판 ✅ · 브리핑→**AI 다이얼로그**(🎤 STT/🔊 TTS·번역·QUICK INFO)⇄**퀴즈 10종**→클리어(result) ✅ · **프로필(나) + 성장 리포트(/growth 푸시)** ✅ · **리뷰랩**(PhraseCard·필터·복습 세션·맥락·등급 안내) ✅ · 뱃지/스티커 탭 상세 ✅. **소셜 로그인 마감(2026-08)**: Apple/Google/Kakao 실동작 확인 — Google은 iOS/Android 클라이언트 등록 검증, Kakao는 **공식 SDK(@react-native-kakao)로 전환**(직접 OIDC는 KOE033으로 차단됨). 프로필 탭 **로그아웃** 추가. 앱 아이콘·네이티브 스플래시를 브랜드 픽셀 아트로 교체(Expo 기본값 제거).
**홈 탭 + 동료 시스템 ✅(2026-08-10)**: 앱 진입 첫 화면을 목록(커리어 탭)에서 **오늘의 한 가지**로 교체. 홈 10모듈 전부 실데이터(`GET /me/home` 1왕복) — 값 없으면 모듈을 숨긴다(더미 금지). 동료는 초대 코드 기반이며 관계 타입 `peer/mentor/mentee`를 처음부터 데이터에 둬 **멘토–멘티 확장 시 화면 수정 불필요**. [Build Spec](02-construction/home-colleagues/build-spec-index.md)
**온보딩 저장/재진입 ✅(2026-08-10)** — 검증 중 결함 2건 발견·수정: ①선택값이 라우트 파라미터로만 존재해 **중간 이탈 시 3단계가 유실**됐다 → 기기 로컬 드래프트에 단계별 저장 + 게이트가 **중단 지점부터 재개**(부분 저장을 서버에 보내면 `onboarded=true`가 찍혀 나머지를 영영 건너뛴다) ②온보딩 완료·로그인 후 목적지가 여전히 `/campus`였다(홈 탭 도입 시 게이트만 고친 회귀) → `/(tabs)`. 재진입 스킵 자체는 정상이었다(`onboarded: null` 초기값 덕에 깜빡임 없음).
**2-6 완료.** (클리어 컨페티는 감사 결과 `result/[id].tsx`에 **이미 구현돼 있었음**) |
| 2-7 성장·경제·복습·이벤트 전달 | [07-growth-economy-review.md](02-construction/07-growth-economy-review.md) | **체크리스트 전 항목 완료(2026-08-10)** — XP/레벨/커리어 패스 ✅ · SM-2 복습(스케줄·마스터리·세션) ✅ · 성장 집계 `GET /me/stats`(기기 TZ 버킷팅) ✅ · 칭찬 스티커(시나리오 클리어당) ✅. **평판→NPC 반응 가중 ✅(2026-08-10)** — 소비 측(NPC 톤 4밴드)은 이미 있었고 **생산 측이 통째로 없어** 전원이 기본값 50에 고정돼 있었다. 등급 기반 획득 + 차원 결정을 **부서가 아닌 시나리오 긴급도**로(모든 병동·직업 확장 대비) 구현. [Build Spec](02-construction/reputation/build-spec-index.md). **유기적 환류 ✅(2026-08-10)** — 보상이 **입장 조건**으로 재사용된다: 방·핫스팟이 `requires`를 선언하고 `GET /me/access/{interiorId}`가 학습자 스냅샷(레벨·클리어·칭호·평판·미션)으로 평가해 잠금과 **이유**를 돌려준다(`domain/access`). ER 트라우마 룸이 첫 사례.
**감사(2026-08-10):** 아래는 "남음"으로 적혀 있었으나 **실제로는 이미 구현돼 있었음** — 칭호·히든미션(서버 영속 확인) · 일일 풀 00:00 리셋+가중 샘플링(`content_repo.go:461`) · 메인 루트 그래프 · 보상형 광고 top-up · 경제 수치 테이블(25필드 `GET /config/economy`). 2-7 체크리스트 전 항목 완료. |
| 2-8 통합·E2E | [08-integration-e2e.md](02-construction/08-integration-e2e.md) | AI_PROPOSED — **전체 여정 스모크 `server/scripts/e2e_smoke.sh`(48 assert, 48/0 pass, 재실행 가능)**: 인증·온보딩·토큰 회전·커리큘럼·대화+교정·클리어(XP)·SM-2·일일풀+광고·미션·부서 상황·에러 경로. 남음(Phase 3 이관): AI 비용·지연 모니터링·분석 이벤트·성능/부하·스토어 메타·권한·개인정보 |

> 🎨 **UI 마감(2026-08-11)**: 핸드오프 타이포·아이콘 어휘를 런타임까지 연결. ①**픽셀 폰트 실제 번들·로드** — tokens는
> `DungGeunMo`/`Galmuri11`을 지정했지만 폰트 파일과 `useFonts`가 없어 **전 화면이 조용히 시스템 폰트로 폴백**하고 있었다
> (tsc·jest는 그린). TTF 3종 번들(둥근모꼴은 WOFF→TTF 변환) + 폰트 준비 전 렌더 보류(단 로드 실패가 시작을 막지는 않음) +
> 서브셋 없음(런타임 LLM 텍스트의 두부 방지). ②**이모지 → 아이콘 세트 31→73종**(범용 21 + 부서 21 신규 저작).
> `PixelButton`/`PixelChip`에 `icon` 슬롯(`▶`는 폰트 베이스라인에 얹혀 있었다), 장식용 이모지는 교체가 아니라 **제거**,
> 데이터의 이모지는 `EMOJI_ICON`+`iconFor()` 브리지로 흡수. **남은 것**: 맵 픽스처 방·층 아이콘 31파일
> (`ElevatorScreen.tsx:250`·`FastTravelModal.tsx:44`에서 렌더) · 국기(라인 아이콘화 불가). [DECISIONS](DECISIONS.md) 2026-08-11 참조.

> 📚 **커리큘럼 층 전수 커버(2026-08-11)**: 5챕터(본관 4개 층) → **25챕터 / 24개 층 전체**. 층 지도에서 생성(`cmd/gencontent/floors.go` → `catalog_gen.go`), 난이도 순 배치. 콘텐츠 공백이던 4개 층(내과·외과·정형·피부과)은 **뱅크 신규 저작**(29개 부서 3,200 시나리오). 층 표기 버그(존재하지 않는 "본관 5F") 정정.

**병행 트랙:** [콘텐츠 워크스트림](content-workstream.md) — AI 작성(조사→초안→검수), **2-2 포맷 확정 후 본격 착수**. PENDING.

## Phase R — Independent Code Review 🔍 (Construction → Operations 게이트)

> 작성자와 **컨텍스트가 분리된** 독립·적대적 리뷰어가 코드를 검토한다. FRAMEWORK "리뷰 게이트" 참조.

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| R-1 Independent Code Review (2-5 맵 엔진 스코프) | [01-independent-review.md](0R-review/01-independent-review.md) | AI_PROPOSED (HIGH 1·MEDIUM 3·LOW 3·NIT 2 채택·수정; +6 테스트) |
| R-2 Independent Code Review (2-6~2-8: 런타임·성장·커리큘럼·캠퍼스) | [02-independent-review.md](0R-review/02-independent-review.md) | AI_PROPOSED — 3 분리 에이전트 병렬 리뷰. **채택·수정 5**(Critical 2: warm 칭호 보너스 유실·top-up 레이스; Important 1: dept 캡 누적; Moderate 1: convSeconds 자정 clip; 하드닝 1). 스모크 24/0 재통과 |

## Phase 3 — Operations (Ship)

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 3-1 Deployment | [01-deployment.md](03-operations/01-deployment.md) | **9-A 서버 배포 실배포 완료(2026-08-13) — staging 스모크 57/0**. 콘솔 클릭 0회로 66리소스 생성(Cloud Run 서비스2·Job4·Cloud SQL1+DB2·Upstash2·시크릿10·WIF·Artifact Registry). 파이프라인 전 단계 통과 + `staging-verified` 태그 부착 확인. **첫 실경로가 정적 검증이 못 잡은 결함 3종을 잡았다**(Cloud SQL 에디션 기본값 / gcloud 프로젝션의 `:` 부분매칭·리스트 래핑 / 시크릿 후행 개행) — §11.1. 남음: 첫 승격·prod 시드(미실행, prod는 hello 플레이스홀더). **9-B 모바일 배선 완료(2026-08-13~14)** — `mobile.yml` 신설(tsc·jest CI 게이트, [run 31692228156](https://github.com/bingoring/forin/actions/runs/31692228156) success·38 suites/213 tests → 최종 리뷰 픽스 웨이브 이후 **39 suites/219 tests**)·EAS 프로필 환경 분리(조용한 폴백 2종 차단: `client.ts`의 localhost 폴백 + gitignore된 `mobile/.env`)·`expo-updates`+fingerprint 정책(`eas fingerprint:generate`로 40자 해시 실측)·`ota.yml`(prod 승격과 같은 승인 게이트)·제출 트랙 `alpha`(비공개 테스트, `internal` 아님) — §12. **`EXPO_TOKEN` 등록 후 `preview` 채널로 첫 실제 OTA 발행 완료(2026-08-14, §12.1)** — `eas update`가 fingerprint 정책을 실제로 소비함을 실증(발행된 runtimeVersion이 40자 지문 해시. **단 지문은 플랫폼별로 다르고 당시 대조한 것은 android 한쪽뿐이었다** — §12.1 정정). 동시에 `eas.json` 자체가 지문 입력(파일 해시)이라 설정 편집만으로도 지문이 바뀌어 이전 빌드에 도달하지 못할 수 있음이 드러났다. **iOS 제출 절 배선 완료(2026-08-15, §12.3)** — Apple 멤버십 승인, capability는 entitlements 근거로 `Sign In with Apple` 하나, `eas.json`에는 `ascAppId` 하나. `eas config`가 없는 키는 거부하지만 `ascAppId` 형식은 검증하지 않음을 실측해 그 공백을 jest로 메웠다(39 suites/**221 tests**). **첫 iOS 빌드 성공(2026-08-15, §12.4)** — `eas build`가 지문 해시를 바이너리에 박음이 실증됐고(마지막 미증명 항목 닫힘), 동시에 `eas build`가 수출 규정 프롬프트로 `app.json`을 바꿔 **커밋 전이면 OTA가 출시 빌드에 도달하지 않는다**는 함정이 드러나 `0adfdc9`로 닫았다. 남은 건 `eas submit`(TestFlight)와 **Android 전량** — Play 개발자 계정 신원확인 진행 중·Google Play 서비스 계정 키 미발급이 막고 있다. 이전 설계 요약: AI_PROPOSED(2026-08-12) — 호스팅 게이트 확정: **Cloud Run + Cloud SQL(서울)**, Redis는 **Upstash(도쿄)**. staging+prod(Cloud SQL 인스턴스 1개에 DB 2개). **이미지 하나·엔트리포인트 셋**(`/api`·`/migrate`·`/seed`, 같은 다이제스트) · 코드는 트래픽 전환으로 즉시 롤백/**스키마는 전진만**(마이그레이션 하위호환 강제) · **무키 CI(WIF)** · staging 자동+스모크 57 → **prod 수동 승격** · 콘텐츠 시드는 ID 축소 금지 게이트 + 수동 트리거 · 모바일은 `mobile.yml` 신설(tsc·jest가 CI에 없었음)·EAS 환경 분리·**OTA fingerprint 정책**·내부 트랙까지 · **IaC 전량 Terraform**(자동화 불가 경계 3종 명시). 구현은 9-A 서버 → 9-B 모바일 순 |
| 3-2 Monitoring | [02-monitoring.md](03-operations/02-monitoring.md) | PENDING |

---

## AI 진입점

> Construction(2-5~2-8) 완료 + Phase R 리뷰 게이트 통과(R-1 맵 엔진·R-2 런타임/성장/커리큘럼/캠퍼스, 채택 결함 수정·스모크 24/0).
> **현재: 3-1의 9-A 서버 배포 실배포 완료(2026-08-13) — staging 스모크 57/0.** 서울 Cloud Run + Cloud SQL에 콘솔 클릭
> 0회로 인프라를 세우고, `verify`(계약 드리프트 포함) → build → migrate → 배포 → 스모크 → `staging-verified` 태그까지
> 실경로로 통과했다. **9-B 모바일 배선도 완료(2026-08-13~14)** — `mobile.yml` CI green·EAS 프로필 환경 분리·
> `expo-updates` fingerprint·`ota.yml` 승인 게이트·제출 트랙 `alpha`(비공개)까지 배선됐다(§12). **`EXPO_TOKEN` 등록
> 후 `preview` 채널로 첫 실제 OTA도 발행했다(2026-08-14, §12.1)** — `eas update`가 fingerprint 정책을 실제로
> 소비함을 실증했고, 동시에 `eas.json` 자체가 지문 입력이라 설정 편집만으로 지문이 바뀔 수 있음도 드러났다. 단
> **Apple 멤버십 승인(2026-08-15) → iOS 제출 절 배선(§12.3) → 첫 실제 iOS 빌드 성공(§12.4).** 포털 capability는
> entitlements 근거로 `Sign In with Apple` 하나만, `eas.json`에는 `ascAppId` 하나만. **`eas build`가 지문 해시를
> 바이너리에 박는다는 마지막 미증명 항목이 닫혔다**(`runtimeVersion` = `fingerprintHash` = `020e92a8…`). 동시에
> **`eas build`가 지문 입력을 스스로 바꾼다**는 함정이 드러났다 — 수출 규정 프롬프트가 `app.json`에 필드를 추가하고
> 그게 커밋되지 않아, 그 상태로 OTA를 발행하면 출시된 IPA에 도달하지 않으면서 런은 green이었다(`0adfdc9`로 닫음).
> ****첫 `eas submit`도 성공해 바이너리가 App Store Connect에 올라갔다(§12.5)** — 9-B 배선이 전 구간 실경로로 증명됐다. 테스터가 붙을 prod도 확인했다(`/readyz` postgres·redis ok, `contentVersion 2026.06.08-seed1`, `/departments` 실데이터 — 시드 정상). 그 확인 중 **`/healthz`가 공개 URL로 컨테이너에 닿지 않음**을 발견해 3-2 입력에 경고로 남겼다(외부 업타임 체크에 쓰면 산 서비스를 죽음으로 보고한다). 남은 건 TestFlight 테스터 배포와 Android 전량** — Play 개발자 계정 신원확인 진행 중·Google Play 서비스 계정
> 키 미발급이 계속 막고 있다. **다음 진입점: 3-2 모니터링.** 위 자격증명이 갖춰지는 대로 첫 `eas build`(네이티브
> 의존이 EAS 빌더에서 처음 컴파일되는 지점이라 새 실패가 나올 수 있음)→테스터 배포로 넘어간다. Android는 개인
> 계정이라 **비공개 테스트 12명/14일이
> 출시 경로의 선행 조건**(2주 임계 경로)이므로 그 시점부터 시계를 돌린다. 병행 **콘텐츠 워크스트림**(커리큘럼 챕터
> 스텝 시나리오 저작 · 평판 긴급도 250토픽 전수 검토 — 현재 14개만 태깅).
> 규칙: [`FRAMEWORK.md`](../../FRAMEWORK.md) 참조
