# forin — 결정 로그 (Decision Log / Audit)

> **append-only 감사 추적.** 중요한 결정 1건 = 항목 1개. *왜/대안/결정자*를 남겨, 최종 문서엔
> 증류되지 않는 "결정 provenance"를 보존한다. 스테이지 문서(*무엇을/결과*)·git 커밋과 상호보완.
> 원시 대화 트랜스크립트는 적재하지 않는다(노이즈·시크릿 위험). AI가 결정 시점마다 한 항목씩 추가한다.

형식: `날짜 · 제목` → 결정 / 근거 / 대안(탈락) / 결정자.

---

## 2026-06-04 · 레포 토폴로지 = 모노레포
- **결정:** 단일 `bingoring/forin` 모노레포(mobile/ + server/ + packages/contract/ + docs/dlc 서브모듈).
- **근거:** Go↔TS 계약 코드젠을 한 커밋으로 원자적 동기화, 솔로 개발 오버헤드 최소.
- **대안(탈락):** 분리 레포(forin-mobile/forin-server) — 계약 드리프트·교차조율 부담.
- **결정자:** 사용자.

## 2026-06-04 · 기존 자산 보관 후 새출발
- **결정:** 기존 master를 `archive/pre-waypoint`로 보관 후 깨끗한 monorepo를 force-push. forin은 public.
- **근거:** 이전 forin 기획(DB스키마·API스펙 등)을 잃지 않으면서 새 구조로 출발.
- **결정자:** 사용자.

## 2026-06-04 · 서버 = Go, 계약 = Go-first
- **결정:** 서버 Go. API 계약은 Go-first(swag → openapi.yaml → openapi-typescript).
- **대안(탈락):** Node/NestJS·Python(언어 일원화 못함), gRPC(RN 부적합), OpenAPI-first(계약을 코드보다 앞세움).
- **결정자:** 사용자.

## 2026-06-08 · 서버 프레임워크 없음(stdlib)
- **결정:** 웹 프레임워크 없이 `net/http`(stdlib) + 필요한 라이브러리만 선별.
- **근거:** 확장성·코드 구조 통제. 프레임워크 락인 회피.
- **대안(탈락):** Echo/chi/Fiber.
- **결정자:** 사용자.

## 2026-06-08 · AI(LLM 대화+교정+음성)는 MVP 핵심
- **결정:** 실시간 LLM 대화·문맥 교정·음성(STT/TTS)을 모두 MVP에 포함.
- **근거:** "AI와 대화하며 상황 해결 + AI 교정"이 forin의 핵심 가치. 이전 'Patch 1 분리'를 사용자가 번복.
- **결정자:** 사용자.

## 2026-06-08 · 아키텍처 게이트(1-3, 비가역)
- **결정:** 헥사고날(포트/어댑터); Postgres + pgx/sqlc + golang-migrate + Redis; **자체 발급 인증**(Apple/Google/Kakao
  네이티브 → 서버 검증 → 자체 JWT+refresh); LLM=Claude 티어링(대화 Sonnet / 교정 Haiku); STT 온디바이스;
  발음=Azure; TTS expo-speech; 호스팅 Fly.io+Docker; CDN 후순위.
- **근거:** Kakao 1급 지원 위해 매니지드(Clerk) 대신 자체 발급; 포트/어댑터로 제공자 교체 국소화.
- **대안(탈락):** Clerk/Supabase(Kakao 비1급), GORM/ent(제어↓), ECS(솔로 운영부담), Cloudflare Workers(Go 런타임 부적합).
- **결정자:** 사용자(게이트 승인).

## 2026-06-08 · 콘텐츠 시스템 = 스키마 주도
- **결정:** 포맷이 아닌 **스키마+검증+적재 이음새**가 본질. git 버전드 파일(직군 네임스페이스) → Postgres.
  웹 CMS는 후속 패치 이음새. 시나리오는 타입 스텝(dialogue/quiz/**effect**/branch) + 선언적 디렉티브(클라 이펙트 레지스트리).
- **근거:** 도구 교체·확장성. 화재 같은 연출을 데이터로(스키마·엔진 불변, 핸들러만 추가).
- **결정자:** 사용자.

## 2026-06-08 · 진료과 확장 범위 = A
- **결정:** MVP는 디자인된 5개 워드(ER/OR/ICU/Peds/Pharmacy) 내 300+ 집중. 신규 진료과(내과/외과/…)는 로드맵(인테리어 art 준비 시).
- **근거:** 비주얼 완성도 100%로 즉시 출시 가능. 진료과는 데이터라 스키마 변경 없이 후속 확장.
- **대안(탈락):** B(상황판 전용)·C(진료과별 art 즉시 제작).
- **결정자:** 사용자.

## 2026-06-09 · persona는 콘텐츠
- **결정:** 대화 상대 persona(역할·연령대·성격·말투·감정)를 `Scenario.persona`(콘텐츠)로 저작. 모든 시나리오에 포함.
- **근거:** 현실적 롤플레이. 콘텐츠라 신규/기존 모두 일괄 적용 + 워크스트림에서 대량 작성.
- **결정자:** 사용자(제기).

## 2026-06-09 · LLM 프롬프트 언어 비하드코딩
- **결정:** 대화·교정 프롬프트를 프로필의 `nativeLang`+`targetLang`(+직군)로 구동. "English/Korean" 하드코딩 제거.
  Profile에 `target_lang` 추가, `en_level`→`target_level`.
- **근거:** 학습 언어 변경 시 깨지지 않도록. LLM 프롬프트는 engine.go 두 곳뿐 — 모두 수정.
- **결정자:** 사용자(제기).

## 2026-06-09 · 콘텐츠 다국어화 = 필수 후속(백로그)
- **결정:** persona·goals 등 **콘텐츠 텍스트 자체의 다국어화**는 반드시 수행할 후속 과제로 등재(현재 한국어 저작).
- **상태:** 백로그(미착수). 비한국어 모국어 사용자 지원에 필요.
- **결정자:** 사용자.

## 2026-06-10 · LLM 제공자 전환 = OpenAI(설정 가능)
- **결정:** LLM 제공자를 **설정으로 선택**(`LLM_PROVIDER`: anthropic|openai|auto). Anthropic 크레딧 결제가
  막혀 **현재 OpenAI**(gpt-4o / gpt-4o-mini) 사용. Claude는 config 한 줄로 복귀 가능.
- **근거(설계 검증):** `LLMPort` 포트/어댑터 추상화 덕분에 **OpenAI 어댑터 추가 + main 분기**만으로 전환 —
  도메인·대화 엔진·Strategy·핸들러 **무수정**. 추상화 목적이 실제로 입증됨.
- **상태:** ✅ **실 호출 검증 완료**(2026-06-10, OpenAI 크레딧 충전 후) — 페르소나 대화 + AI 교정 + 리뷰카드 생성 동작.
- **결정자:** 사용자.

## 2026-06-09 · 결정 로그 도입(본 문서)
- **결정:** 큐레이션 ADR 스타일 결정 로그를 forin 프로젝트에 도입(append-only). 원시 트랜스크립트 미적재.
- **근거:** AWS AI-DLC식 감사 추적 — "왜/대안" provenance 보존. 유용성 검증 후 waypoint 프레임워크 표준 승격 검토.
- **대안(탈락):** 원시 대화 적재(시크릿·노이즈), 현행 유지(맥락 휘발).
- **결정자:** 사용자.

## 2026-06-11 · 문서화 = 린 기본 + 적응형 깊이
- **결정:** waypoint 경량 구조를 기본 유지하되, **복잡·고위험 단계만 깊게** 쓴다 — 컴포넌트 분해 + **NFR/성능 목표**
  + **테스트·검증 계획** 섹션 추가. 단순 단계는 지금처럼 짧게. ("문서가 일에 맞춘다" — AI-DLC 적응형 깊이 원칙.)
- **근거:** AI-DLC의 전체 산출물(유저스토리·페르소나·유닛분해·유닛별 NFR/인프라/빌드지시 문서)은 팀·엔터프라이즈·
  브라운필드용 — 솔로 MVP엔 *안 읽는 문서로 속도만 깎는* 의식. 단, 균일하게 얇으면 복잡 단계의 설계/근거가 부족 →
  깊이를 복잡도에 맞춰 조절.
- **적용:** 2-5 맵 엔진 문서부터 보강(품질 축·고복잡). 이후 복잡 단계 동일.
- **대안(탈락):** AI-DLC 전면 채택(오버헤드↑·속도↓), 현행 균일 린 유지(복잡 단계 설계 부족).
- **결정자:** 사용자.

## 2026-06-11 · 결정 로그·적응형 깊이를 waypoint 프레임워크 표준으로 승격
- **결정:** 두 규약(결정 로그, 적응형 깊이)을 forin 전용에서 **waypoint 프레임워크 표준**으로 올림.
  `FRAMEWORK.md`에 두 섹션 추가, `STATUS.template.md`에 DECISIONS 링크, `_templates/decisions-template.md` 신설,
  `stage-template.md`에 적응형 깊이 안내. → shadow 등 모든 프로젝트가 동일 규약 사용.
- **근거:** forin에서 유용성 검증됨 → 전 프로젝트 공통화. (앞서 "유용성 검증 후 승격" 계획대로.)
- **결정자:** 사용자(제기).

## 2026-06-11 · 맵 충돌 = 서버 저작 collision 레이어(jsonb)
- **결정:** 인테리어 walkability를 클라이언트 추론이 아니라 **콘텐츠가 저작**한다 — Interior에 `collision`
  (blocked 타일 사각형 리스트, jsonb) 필드를 추가하고 엔진은 그 집합+맵 경계로만 판정. (마이그 000008 + ER 시드.)
- **근거:** 충돌은 콘텐츠(레벨 디자인)의 일부 — 부서별 맵마다 손으로 도어웨이·벽을 배치해야 자연스러움. 코드에
  맵별 규칙을 하드코딩하면 콘텐츠 300+ 확장 시 폭발. 다국어/콘텐츠-as-data 원칙과 일관.
- **대안(탈락):** 오브젝트 타일 자동 충돌만(벽·도어웨이 표현 불가), 클라이언트 하드코딩 맵(확장 불가).
- **결정자:** AI 제안(2-5 보강 시 승인됨).

## 2026-06-11 · 맵 엔진 5a 의존성·렌더링 최소화
- **결정:** 5a는 `react-native-svg` 없이 player/오브젝트를 **단순 View+이모지**로, 카메라/스텝을 **plain React state**로
  구현. SVG는 실제 사용처인 5b(캐릭터·오브젝트 카탈로그), reanimated 워클릿 카메라는 성능 패스로 이연.
- **근거:** 5a 목표는 "walkable 파이프라인 확립 + 충돌 정확성". 순수 로직(좌표·충돌·BFS·리전)을 jest로 검증해
  CLI에서 정확성 보장(시각 의존 최소화). 의존성/최적화는 효과가 보이는 단계에서 추가(YAGNI).
- **대안(탈락):** 5a부터 SVG·reanimated 전면 — 시각 검증 불가 환경에서 리스크·복잡도만 증가.
- **결정자:** AI 제안(적응형 깊이 — 테스트 계획대로).

## 2026-06-11 · 인테리어 충돌·오브젝트·문 모델 (5b-ii)
- **결정:** `collision` 필드 = **구조 벽만**. 솔리드 오브젝트(bed/monitor/reception)는 **타입별 footprint**
  (`OBJECT_FOOTPRINT`)로 엔진이 blocked 집합에 추가 → 아트 크기와 충돌이 항상 일치. **문은 type:'door' 오브젝트**
  로 표현(충돌에 없음 = 통행 가능, 클라이언트가 `IDoor` 렌더). 벽 비주얼은 `Walls.tsx`가 collision을 IWall로 렌더.
- **근거:** (1) 아트≠충돌 불일치(보이는 침대를 통과) 방지. (2) **서버 스키마 변경 0** — 기존 objects/collision 필드만으로
  벽·오브젝트·문을 모두 표현(`doors` 필드 신설 불필요). (3) 오브젝트 타입은 화이트리스트 없는 자유 데이터([[feedback_extensibility]]).
- **대안(탈락):** 오브젝트 footprint를 collision에 직접 박기(아트와 중복·드리프트), `doors` jsonb 필드 신설(마이그·sqlc churn).
- **검증:** ER 픽스처 도달성 jest 4건(트리아지/트라우마 도달·문 통행·footprint 차단) 18/18.
- **결정자:** AI 제안(5b-ii, 계획대로).

## 2026-06-12 · 디자인 핸드오프 v2 반영 (캐릭터 모션 + Review Lab)
- **결정:** 핸드오프 추가분을 스테이지 문서에 반영하고 계획을 갱신.
  (1) **`06_CHARACTER_MOTION.md`(신규)** → 2-5에 **5c 캐릭터 모션** 증분 신설(방향 전환 dir·걷기·아이들 호흡/깜빡임·
  앰비언트 NPC 엔진 `useGridMover` patrol/wander+이모트·**이동 정체성 고정 seed**), 기존 캠퍼스는 **5d**로(모션 소비). 순서 5c→5d.
  (2) **Review Lab 설계 확정**(04_SCREENS ⑨, 하단탭 IA **Option A**: 캠퍼스/상황판/리뷰랩/나, 나=Profile 홈, 성장리포트=푸시) →
  2-6 체크리스트에 PhraseCard 명세 반영, 2-7은 SM-2 데이터/스케줄(서버 `/me/review` 기존)·화면은 2-6에서 빌드로 정리.
- **방향 전환 재도입(5a 크래시 교훈):** 좌우 미러는 **부모 View 음수 scaleX(크래시) 금지**, 레퍼런스대로 **`<Svg>` 그룹 내부
  transform**(`translate(64,0) scale(-1,1)`)으로. 5a에서 제거했던 좌우반전을 이 안전한 방식으로 복원(9536cb1 보완).
- **주의(미해결):** README/04_SCREENS는 `screens-review-lab.jsx`를 가리키나 `reference/`에 **JSX 부재** — 명세만 존재.
  구현은 04_SCREENS ⑨ 명세 기준, 필요 시 사용자에게 JSX 요청.
- **결정자:** 사용자(핸드오프 추가) + AI(문서 반영·계획).

## 2026-06-12 · 디자인 핸드오프 v2 채택 (design-handoff_v2)
- **결정:** 사용자가 기존 `design-handoff/`는 그대로 두고 **`design-handoff_v2/`**(개정판)를 추가. **v2를 권위 소스로 채택** —
  모든 스테이지/PRD/STATUS 문서의 핸드오프 링크를 `design-handoff/` → `design-handoff_v2/`로 일괄 재지정. 원본은 이력용 보존.
- **v2 실질 변경:** (1) **외래 클리닉 엔진**(`interior-clinics.jsx`) — 내과/외과/정형외과/피부과를 config 기반 `ClinicInterior`로
  생성(부서=데이터), IP에 부서별 바닥 톤 추가 → 04/05 명세 갱신, 디자인된 인테리어 5→9개(content-workstream 범위 확장).
  (2) **`screens-review-lab.jsx` 추가** — 이전 "JSX 부재" 플래그 해소. (3) **디자인 시스템 `ds-*` 모듈 재편**
  (ds-foundations/primitives/characters/faces/equipment/furniture) + HTML 분할(Screens / Design System) — 레퍼런스/내비.
  (4) 스프라이트 엔진(`forin-npcs-smooth.jsx`) 갱신(06 모션 반영분) — 5c 구현 시 v2에서 포팅.
- **불변:** 01/02/03/06 .md는 v2와 동일(내용 변경 없음). prototype 전용(design-canvas/ios-frame/tweaks-panel)은 무시.
- **결정자:** 사용자(v2 제공) + AI(채택·재지정·반영).

## 2026-06-15 · 디자인 핸드오프 v3 (측면 프로필 보강)
- **결정:** 사용자가 `design-handoff_v3/` 추가(v2 대비 **06_CHARACTER_MOTION.md + forin-npcs-smooth.jsx만** 변경 — 캐릭터
  측면 뷰 보강). **v3를 권위 소스로 채택**, 스테이지/PRD/STATUS 링크 v2→v3 재지정(DECISIONS는 이력 보존). 원본·v2 유지.
- **v3 변경:** 측면(left/right) 3/4 뷰가 제대로 된 실루엣 — `hatSide()`(측면 모자: 챙·간호 십자/경찰 배지가 앞쪽),
  좁은 측면 몸통+뒷면 음영, **가슴마크 숨김**, **팔 1개**(몸통에 붙임)·**다리 1개**(겹쳐 중앙). 정면/뒤통수는 불변.
- **구현 반영:** `Sprite.tsx`의 ARMS/BODY/LEGS/모자를 `facingSide` 분기로 갱신 + `hatSide()` 추가. 5c-i 범위 유지(정적).
  걷기 사지 스윙(측면은 단일 팔·다리 피벗)은 5c-ii(reanimated). tsc 0·jest 24/24·doctor 21/21.
- **결정자:** 사용자(v3 제공) + AI(채택·재지정·구현 반영).

## 2026-06-16 · 디자인 핸드오프 v4 + 5c 모션 피드백 R1
- **결정:** `design-handoff_v4/` 채택(v3 대비 **06 + forin-npcs-smooth.jsx만** 변경 — 측면 다리 모션 개선). 링크 v3→v4 재지정(DECISIONS 이력 보존). 사용자 디바이스 피드백 3건 반영:
  - **이동 속도 과도** → `useMovement` STEP_MS 110→330ms(한 보폭 ≈ 0.5s 스윙), WALK_MS 460ms.
  - **우측 이동 시 좌향**(이슈) → 좌우 미러를 SVG 문자열 transform(`translate/scale(-1,1)`)에서 **origin-aware `originX=32`/`scaleX`** 숫자 prop으로 교체. (기하상 기존도 우향이 맞아야 하므로 문자열 파싱 차이를 유력 원인으로 보고 견고화. 재확인 후 여전하면 `flip` 조건 반전.)
  - **측면 다리 부자연(v4)** → 단일 중앙 다리 → **2다리 ±22° 반대위상 교차**(먼 다리 어둡게=깊이) + 측면 팔 ±20°를 몸통 위로 분리. v4 `forin-npcs-smooth` 반영.
- **검증 한계:** 애니/방향/속도는 **시각 전용** → CLI(tsc/jest/doctor) 불가, 디바이스 반복 검증(사용자). tsc 0·jest 24/24·doctor 21/21.
- **결정자:** 사용자(v4 + 디바이스 피드백) + AI(반영).

## 2026-06-16 · 스텝 동기 보행 + 재사용 픽셀 엔진 추출(계획)
- **결정(보행):** 캐릭터 보행 모션을 **타일 스텝에 동기화**. 핸드오프 `forinWalkBob`(0.5s에 2번 -1.5px)처럼 한 칸 이동 =
  **2 포물선 hop + 2걸음(다리 교차)**. InteriorScreen이 `walkClock`(0→1, 스텝마다 재발화) 소유 → Sprite hop/다리 스윙이
  이동과 맞물림(기존 자유 클럭은 비동기라 한 칸에 깔끔히 2번이 안 나옴). 속도 300→240ms.
- **결정(엔진화·계획):** `src/map`+`src/characters`를 **재사용 가능한 RN 픽셀게임 엔진 패키지**(`packages/pixel-engine` 등)로
  추출하는 것을 **5e(맵 안정화 후) 계획**으로 등록(사용자 요청 — 타 프로젝트 재사용). 순수 모듈은 이미 forin 비의존, 인터페이스
  (`walkClock`/`dir`/`seed`)도 엔진 지향으로 설계. 콘텐츠 스키마·아트는 주입(의존성 역전).
- **검증 한계:** 보행 모션은 시각 전용(디바이스). reanimated 회전은 react-native-svg `transform` 배열로(=`rotation` prop no-op).
- **결정자:** 사용자(요청) + AI(반영).

## 2026-06-16 · 디자인 핸드오프 v5 (옆모습 입 위치)
- **결정:** `design-handoff_v5/` 채택(v4 대비 **forin-npcs-smooth.jsx만** 변경 — sideFace 입 위치). 링크 v4→v5 재지정(DECISIONS 이력 보존).
- **v5 변경:** 측면(3/4) 입을 얼굴 중앙(x39–45)에서 **앞쪽 가장자리·코 아래(x48–53)** 로 이동 — 기존 중앙 배치가 부자연스러웠던 것 교정. Sprite.tsx sideFace 입 경로 2줄만 반영. tsc 0·jest 24/24·doctor 21/21.
- **결정자:** 사용자(v5 제공) + AI(반영).

## 2026-06-16 · 앰비언트 NPC 엔진 화면 연결 (5d-i)
- **결정:** `useGridMover`(순수 patrol/wander+이모트 로직)를 **`AmbientNpc` 컴포넌트**로 화면에 연결 — NPC가 실제 이동
  (5c 보행 모션·글라이드 재사용)하고 `EmoteBubble`로 감정 이모지 표시. NPC는 인스턴스별 격리(자체 timer)로 틱마다 전체 맵
  리렌더 방지. Interior에 `npcs?` 필드 추가, ER+캠퍼스 fixture에 배치, 캠퍼스 탭 진입 추가.
- **임시(후속):** NPC 스펙은 **클라이언트 fixture**에 저작(서버 interior `npcs` jsonb 필드는 후속) · 캠퍼스 건물은 collision
  placeholder 블록(아트 5d-ii) · wander는 `bound`만 따르고 인테리어 collision 미참조(open bound로 회피). 이유: 5d-i는
  "움직이고 감정표현하는 NPC"를 빠르게 가시화·검증하는 게 목표(사용자 질문 대응). 서버 필드/아트/충돌연동은 증분 후속.
- **결정자:** 사용자(진행) + AI.

## 2026-06-18 · 디자인 핸드오프 v6 (캐릭터 머리 시스템 확장)
- **결정:** `design-handoff_v6/` 채택(v5 대비 forin-npcs-smooth.jsx·ds-derp.jsx·screens-explore-v2.jsx + 03/06 md). 링크 v5→v6 재지정.
- **v6 변경(머리 시스템):** hairStyle에 **`ponytail`·`balding`** 추가(8→10종 + 모자 2). 정면/측면/후면을 **각각 별도 플레이트**로 그림:
  **`hairSide()` 신규**(스타일별 측면 머리 — 귀 노출 + 뒤로 스윕), `backHead()`를 공통 돔에서 **스타일별**(short 나페·bob blunt·long
  시트·pigtails 묶음·curly 컬링·ponytail 꼬리 등)로 교체, hairBack은 정면(dir=down)에서만. 렌더: 측면 = `isHat?hatSide:hairSide`.
- **반영 판단:** Sprite.tsx에 타입+hairBack/hairFront/hairSide/backHead 포팅. **ROLES 자동배정은 v6도 불변**(patient는 bald 유지) →
  ponytail/balding은 "사용 가능한 스타일"로만 추가(명시 사용 시 노출). tsc 0·jest 25/25·doctor 21/21. 시각 = 디바이스.
- **결정자:** 사용자(v6 제공) + AI(반영).

## 2026-06-18 · 캠퍼스 아트 (5d-ii)
- **결정:** `screens-explore-v2.jsx`의 **Building**(2.5D 지붕+벽+창+문, 파라메트릭 w/h/roof/label/redCross/mainEntrance)과
  **Tree**(레이어 캐노피)를 오브젝트 타입(`building`/`tree`)으로 포팅. 캠퍼스 fixture를 placeholder 블록 → 실제 건물 3채(종합병원/
  외래클리닉/약국) + 나무로 재작성. **오브젝트 충돌 footprint를 `props.w/h`로** 확장(건물 가변크기), `collision` 필드는 외곽선만.
  나무는 trunk(1×1)만 차단(캐노피 오버행 = 통행). Building은 CSS 그라데이션 대신 View 단색+엣지로 근사.
- **후속:** 경로/플라자 바닥 타일·추가 prop(벤치·분수 등)·y기준 깊이정렬은 다음 증분.
- **결정자:** 사용자(진행) + AI.

## 2026-06-18 · 디자인 핸드오프 v7 (플래그십 랜드마크) — 경량 반영 + 베스포크 아트 계획
- **결정:** `design-handoff_v9/` 채택(v6 대비 05_MAP + screens-explore-v2.jsx). 링크 v6→v7 재지정. v7은 캠퍼스 **4종 플래그십
  랜드마크**(MedCenter 본관 / MedCenterH 외래 / MedCenterV 의과대 돔 / MedCenterC 암병원 곡면유리+접시) + `Building` `arch`
  변형(pitched/flat/tower/glass)을 추가.
- **반영 판단(경량 now + 베스포크 deferred):** 랜드마크는 **CSS 그라데이션·글로우·다중타워 합성**의 대형 정밀 아트이고, 캠퍼스
  화면은 아직 엔진/통합 placeholder(전용 캠퍼스 화면=후속)라 **충실 포팅은 크고 손실↑·시기상조**. → (1) 캠퍼스 fixture에 4종을
  **범용 `Building`으로 명명**(이름·지붕색·엠블럼 🎓🎗🩺, 본관=레드크로스+mainEntrance), `Building`에 `emblem` prop 추가.
  (2) **베스포크 MedCenter*/arch 아트는 5d-v(전용 캠퍼스 화면)로 정식 계획.** 핸드오프 SoT는 v7로 동기화.
- **결정자:** 사용자(v7 제공) + AI(경량 반영·계획 판단).

## 2026-06-18 · 외래 클리닉 엔진 (5d-iii)
- **결정:** `interior-clinics.jsx`를 **config 기반 생성기 `clinicInterior(cfg): Interior`**(src/map/clinic.ts)로 포팅 — 표준
  평면(접수+대기 → 진료실 3 → 처치실)을 데이터로 생성, **부서 추가 = config 객체 1개**(내과/외과/정형외과/피부과 4과). 장비 13종을
  `objects/clinicEquipment.tsx`로 포팅(Ultrasound/Xray/CastCart/Crutches/DermLamp/Laser/ExamStool/Shelf/BoneModel/ClinicReception/Cabinet/Chair/Plant),
  InteriorObjectView가 위임. 신규 바닥 테마 internal/surgery/ortho/derm. FIXTURES 등록 + 캠퍼스 탭 진입 버튼.
- **레이아웃 보정:** 레퍼런스의 y8 문이 분리벽 칼럼(x7/x14)에 있어 방 진입 불가 → **방마다 진입문(x3/x10/x17)** 으로 재배치(도달성 확보).
  jest 28/28(클리닉 진료실·처치실 도달·문 통행 검증). 충돌=벽만, 장비는 footprint(props.w/h) 있는 것만 차단.
- **임시:** NPC는 클라이언트 fixture·정적(1×1 wander로 제자리 호흡/이모트), 핫스팟 scenarioId는 placeholder.
- **결정자:** 사용자(진행) + AI.

## 2026-06-18 · 플래그십 랜드마크 베스포크 아트 (5d-v)
- **결정:** v7의 4종 랜드마크를 `src/map/objects/landmarks.tsx`로 포팅하고 **신규 오브젝트 타입 `landmark`** 추가. `props.landmark`로
  파사드 디스패치(default=본관 MedCenter 다중타워 / victorian=의과대학 MedCenterV / curved=암병원 MedCenterC / horizontal=외래
  MedCenterH). 캠퍼스 fixture 4동을 범용 Building→landmark로 교체(5d-v 계획대로 경량 Building 대체).
- **렌더 충실도 트레이드오프:** RN View는 **CSS 선형그라데이션·box-shadow 글로우 미지원** → MedCenter/H/C는 View 기반에 **솔리드+밝은
  코어 레이어로 그라데이션/글로우 근사**(실루엣·구성·창배치는 충실, 색 그라데이션 뉘앙스는 손실). 벽돌 `Pattern`+슬레이트 맨사드+구리
  돔이 핵심 시그니처인 **의과대학(MedCenterV)만 react-native-svg(`Pattern`/`Path`/`G`)로 직접 포팅**. 추후 `expo-linear-gradient`
  도입 시 고도화 여지.
- **배치 모델:** 파사드는 풋프린트보다 높이 솟음(facadeH > h·TILE, overflow visible) — 레퍼런스 동일. **차단은 `props.w/h` 풋프린트만**
  (솟은 파사드는 통행 무관). 레퍼런스 ~16px/타일 좌표를 S=TILE/16로 스케일.
- **검증:** jest 30/30(campus.test.ts: 랜드마크 풋프린트 비중첩 + 회랑 x7/x13/x19 도달성 2건 추가). tsc 0·doctor 21/21.
- **결정자:** 사용자(5d-v→5d-iv→5e 무허가 자율 진행 지시) + AI(렌더 충실도 판단).

## 2026-06-18 · 화면별 줌/스케일 (5d-iv)
- **결정:** `Interior.scale?`(기본 1)로 화면별 카메라 줌 지원. `InteriorScreen` 월드 컨테이너 transform에 `{scale}` 추가하고
  **`transformOrigin:'top left'`** 로 월드→스크린을 선형 매핑(`screen = translate + scale·world`)해 클램프/탭 수식을 단순화.
  카메라 중앙맞춤 클램프를 스케일드 px로 계산. 캠퍼스 `scale:0.7`(핸드오프: 캠퍼스는 멀리서·작게), 인테리어/클리닉/ER 기본 1.
- **탭 처리:** transform된 Pressable에서도 `locationX/Y`는 뷰의 **비변환 로컬 좌표** 로 보고되므로 `floor(locationX/TILE)` 변경 없음.
  ⚠️ 플랫폼별 locationX 좌표계 차이 가능성 → scale<1에서 탭 정합은 디바이스 검증 항목으로 표기.
- **검증:** tsc 0·jest 30/30·doctor 21/21.
- **결정자:** 사용자(5d-v→5d-iv→5e 자율 진행) + AI.

## 2026-06-18 · 재사용 픽셀 엔진 추출 (5e)
- **결정:** 제네릭 2.5D 타일맵/픽셀게임 커널을 **`mobile/src/engine/`** 로 추출하고 `@engine` 경로 alias(tsconfig paths + jest
  moduleNameMapper; Expo Metro가 `@/`처럼 런타임 해소) 부여. 이전: 순수(coords/collision/regions/gridmover/footprint)+types+훅
  (useMovement/useGridMover)+캐릭터(Sprite/Face)+무상태 레이어(TileFloor/Walls/RoomMask/AmbientNpc/EmoteBubble). forin 콘텐츠
  (objects 렌더러·fixtures·clinic·HUD·FastTravelModal·InteriorScreen)는 앱 잔류.
- **의존성 역전 = 합성:** 엔진은 forin을 import하지 않음(검증: src/engine 내 `@/`·상위상대 import 0). 앱 화면이 엔진 프리미티브 위에
  자기 콘텐츠를 합성. 디커플 2건: useMovement가 objects 배럴→footprint 직접 참조, EmoteBubble가 앱 토큰→로컬 INK 상수.
- **위치 결정(왜 `packages/pixel-engine`가 아닌가):** 레포에 루트 워크스페이스 부재·`node_modules`가 mobile/에 단 하나 → 런타임
  패키지를 앱 루트 밖에 두면 tsc·Metro가 react/react-native 미해소(워크스페이스 툴링 필요). `packages/contract`는 type-only라 무료지만
  엔진은 런타임. 시도했다가(packages/pixel-engine + metro watchFolders) tsc가 엔진 파일의 bare import를 해소 못 해 **`src/engine`으로
  확정**(무설정, 동일 경계). packages/로 물리 승격은 npm workspaces+루트 node_modules 필요한 인프라 후속으로 명시.
- **검증:** tsc 0·jest 30/30(순수 테스트는 deep `@engine/<mod>`로 RN 비적재)·`expo export` Metro 번들 성공(1601 modules)·doctor 21/21.
- **결정자:** 사용자(5d-v→5d-iv→5e 자율 진행 지시) + AI(위치 트레이드오프 판단).

## 2026-06-19 · NPC idle 모드 (정지·정면 고정)
- **문제(디바이스 피드백):** 클리닉의 제자리 의사/간호사 NPC가 `stand()`= **1×1 wander bound**로 만들어져, 이동은 막히지만
  `wanderStep`이 매 틱 무작위 방향을 반환 → **보는 방향(facing)만 상하좌우로 계속 바뀜**(가만히 못 서 있음).
- **결정:** 엔진에 **`NpcSpec.mode='idle'`** 추가 — 이동·방향전환 없이 정면(`dir:'down'`) 고정, 호흡/깜빡임·이따금 이모트는 유지
  (살아있는 느낌). useGridMover의 step 분기는 idle에서 no-op이라 dir이 'down'으로 고정. `clinic.ts stand()`를 1×1 wander→idle로
  전환. 캠퍼스/ER의 실제 bound wander(배회 NPC)는 그대로.
- **검증:** tsc 0·jest 30/30·doctor 21/21. ⚠️ idle 정지·정면 고정은 디바이스 확인 항목. 완전 무이모트가 필요하면 per-NPC `emoteChance:0`.
- **결정자:** 사용자(피드백) + AI.

## 2026-06-21 · 독립 코드 리뷰 게이트 R-1 (2-5 맵 엔진, 스코프드)
- **계기:** waypoint에 독립 코드 리뷰 게이트(Phase R) 신설. 2-5 맵 엔진(5d-v/iv/e+idle)은 AI가 자율 작성하며 "테스트 통과"를
  자기보고만 한 영역이라 우선 스코프드 적용.
- **실행:** 작성 세션과 **컨텍스트 분리된** 독립 서브에이전트 3개(엔진로직 / RN렌더·카메라 / 5e추출), refute 기본값 다관점 적대 리뷰.
  findings 17건(CRITICAL 0, HIGH 1) → **각 검증 후 9 채택·8 반박**.
- **채택(수정):** [HIGH] scale≠1 탭→타일 매핑 모호성 → InteriorScreen 구조 변경(Pressable=스케일드+translate만, 내부 wrapper=scale)로
  `⌊loc/(TILE·scale)⌋` 결정론화. [MED×3] useGridMover walkClear 레이스·idle 불필요타이머·patrol 스펙변경 재시드. [LOW×3] patrolStep
  post-advance 클램프·landmarks key·landmark w/h 가드. [NIT×2] 배럴/README 문구. + per-tick 결정을 순수 `moverStep`로 추출(idle/불변식
  결정론 테스트, +6).
- **반박(근거 기록):** 카메라=타일중심(의도)·오프스크린 컬링(기존·소규모라 보류)·gate 스냅(백로그)·memo 코어스의존(불변스펙)·moveDir
  facing(의도)·locationX edge(canEnter 검사)·AmbientNpc 재발화(deps상 미발생). → 스테이지 문서에 상세.
- **재검증:** tsc 0·jest 36/36·expo export 번들·doctor 21/21. 잔여: 캠퍼스 탭 시각정합 디바이스 확인 1건(게이트).
- **교훈:** 같은 컨텍스트 self-review였다면 HIGH 탭버그를 "괜찮다"고 합리화했을 것(실제로 직전 내 주석이 그랬음). 독립=구조가 값을 증명.
- **결정자:** 사용자(게이트 신설·2-5 적용 지시) + 독립 리뷰어 3 + AI(triage).

## 2026-06-27 · 디자인 핸드오프 v8 (대규모 재설계) — 채택 + 재계획 필요
- **채택:** `design-handoff_v9/` 카논. 전 문서 링크 v7→v8 재지정(10개). v8은 증분이 아니라 **맵/화면 대규모 재설계**.
- **주요 델타:**
  1. **캠퍼스 재구성:** 5개 랜드마크 파빌리온(본관 메인 메디컬 타워 `MedCenter` / 여성소아 `MedCenterWomen` / 암센터·재활 `MedCenterC`(=`MedCenterOnco`) / 외래·진단 `MedCenterH`(=`MedCenterDx`) / 행정 `Building flat`(=`MedCenterAdmin`)) + 중앙 시계탑 `ClockTower2D`. 빌딩 진입이 곧장 인테리어가 아니라 **엘리베이터**를 엶.
  2. **엘리베이터 화면 신설**(`screen-elevator.jsx` ScreenElevator): 건물 탭 5 + 픽셀 cab(층 표시·방향·도어 애니) + 층 디렉터리(층별 부서 + **실시간 상황칩 🔴/🟡/🟢** `getTodaysActiveScenarios()` 상황판과 동일 소스) + GO 바. InteriorScreen 내 **오버레이**(라우팅 없음, 🛗 버튼).
  3. **부서 인테리어 마스터 블루프린트 재구성:** ER 40×60·OR+PACU 40×52·ICU 34×44·Peds+NICU 34×48·Pharmacy 36×42 — 대형화 + 상세 존(3-stage zoning 등).
  4. **입원 병동/센터 신설(bespoke 28×52):** 내과 병동 `interior-ward` · 외과 병동 `interior-surgward` · 정형 병동 `interior-orthoward` · 피부과 센터 `interior-dermcenter`.
  5. **⚠️ 외래 클리닉 엔진(5d-iii) 폐기:** v8이 데이터구동 클리닉 화면(내·외·정형·피부 외래)을 "redundant"로 **제거**. 내가 5d-iii에서 만든 `clinicInterior`+4 config가 설계상 대체됨(병동/센터 bespoke로). → 코드 처리(삭제 vs 보존-후-은퇴)는 재계획 결정 사안.
  6. **신규 엔진 프리미티브/규약:** `IThreshold`(문짝 없는 어두운 통로, 내부 존 경계용; sterile tone) · `Tint`(반투명 바닥 오버레이, 특수실 조명) · `IGlass`(유리벽) · `NurseStationDesk`/`NurseDeskI`(허브 가구) · `IReception` 재정의(리셉션 카운터 아님 → 의사 처방 데스크; 진짜 접수는 `ClinicReception`). **2.5D 규약 명문화**(~70° 카메라, 모든 오브젝트 front+top face; 빌딩 top face는 직사각형).
  7. **신규 오브젝트 수십 종:** er2/er3·or2·icu2·peds2·ward2·pharma2·surg2·ortho2·derm2(.jsx) — 부서별 임상 장비.
- **스코프 영향(재계획):** v8 작업 대부분은 **신규 화면·콘텐츠(2-6)** + 대량 인테리어 저작 + 일부 엔진 추가(IThreshold/Tint/IGlass/엘리베이터 오버레이/빌딩 top-face/대형 맵). 2-5 엔진 자체는 유효하나 캠퍼스/랜드마크는 재작업 대상. **순서·클리닉엔진 처리·증분 분해는 사용자 결정 후 진행**(이번엔 문서 반영 + 링크 재지정까지).
- **결정자:** 사용자(v8 제공) + AI(델타 분석·재계획 제안 대기).

## 2026-06-27 · 5f-i 빌드 — 5-파빌리온 캠퍼스 + 2.5D top-face
- `buildings-v2.jsx`(MedCenter2D/H2D/V2D/C2D/ClockTower2D) RN 포팅 → `landmarks.tsx` 전면 재작성. 신규 `Block3D`(front+직사각형 top
  face)로 2.5D 규약 구현. 6 landmark kinds(main/horizontal/victorian/curved/admin/clock). 포팅: 레퍼런스 px로 그리고 부모 `scale(TILE/16)`.
  그라데이션은 솔리드+레이어 근사(무신규의존). 캠퍼스 40×28 5-파빌리온+시계탑 재작성(scale 0.6). jest 36/36·tsc 0·expo export·doctor 21/21.
- 클리닉 엔진 보존(미삭제) — 결정대로. 시각 충실도는 디바이스 확인. 다음: 5f-ii 엘리베이터.

## 2026-06-27 · 5f-ii 빌드 — 엘리베이터 진입 + 공유 시나리오 소스
- `src/content/scenarios.ts`: 공유 시나리오 소스(`getTodaysActiveScenarios` 날짜시드 결정적 회전, 쿼터 6/일, 28 메타). 상황판/엘리베이터/
  인테리어가 공유할 단일 진실원 — 현재 칩 구동, 풍부 콘텐츠는 2-6. `ElevatorScreen`(건물탭·픽셀cab·슬라이딩도어·층디렉터리+라이브칩·GO).
- **라우팅 결정:** reference는 in-screen overlay지만 RN 관용상 **route `app/elevator/[building]`** + 캠퍼스 파빌리온 핫스팟
  (kind:'elevator', Hotspot.building 추가)→push로 구현(동작 동등, 더 단순). 빌트 인테리어 층만 GO 이동, 나머지 "준비 중".
- 검증: tsc 0·jest 41/41(+5)·expo export·doctor 21/21. 칩은 실제 today 기준. 다음: 5f-iii(IThreshold/Tint/IGlass + 대형맵 컬링).

## 2026-06-27 · PixelButton 디자인시스템 정렬 (피드백)
- 사용자 지적: 엘리베이터 GO 버튼/공용 버튼이 DS와 다름. 원인 = 2-4의 단순 PixelButton을 그대로 사용(의도 아님) — DS 버튼의
  **lit-from-above 베벨**(윗변 하이라이트 mix(bg,#fff,.45) / 아랫변 음영 mix(bg,ink,.30))과 **누름 시 베벨 swap(recess)**, full-width 처리가 빠짐.
- 수정: 공용 `components/PixelButton.tsx`를 DS(forin-ui PixelButton) 스펙으로 정렬 — 베벨 스트립 + press swap + `full` prop(정확한
  전폭). border3/radius0/heading/13은 이미 일치. 콜러(elevator GO·campus·login) full prop으로 갱신. 앱 전체 버튼에 반영.
- 검증: tsc 0·jest 41/41·expo export·doctor 21/21.

## 2026-06-27 · PixelButton 최종 — 플랫 캡 + 드롭 섀도우 (피드백 반복)
- 위 "DS 정렬"(베벨+swap)은 뒤쪽 하드 섀도우와 신호가 충돌(섀도우 정지 + 베벨만 swap)해 어색. 반복 정리:
  **누름 = 캡이 오프셋만큼 섀도우 속으로 내려앉기**(유일 신호) → 안쪽 베벨(음영) 중복이라 제거, 윗변 하이라이트도 사용자 선호로 제거.
- **최종: 평평한 3px 아웃라인 캡 + 하드 오프셋 섀도우 + 누름 드롭.** forin 플랫 픽셀 톤(PixelBox/Chip)과 일관. full prop.
  (핸드오프의 베벨/swap은 섀도우 없는 평면 버튼 전제였음 — forin은 섀도우를 유지하므로 드롭으로 누름을 표현하는 게 더 forin다움+명확.)
- 검증: tsc 0·jest 41/41·expo export·doctor 21/21.

## 2026-06-27 · 5f-iii 빌드 — 대형맵 컬링 + 구조 프리미티브
- **컬링**(`src/engine/cull.ts` 순수): InteriorScreen이 플레이어+뷰포트+scale로 가시 윈도를 구해 objects/hotspots/NPC를 그 안만 렌더
  (tall 아트 rise 여유 landmark16/기타5). R-1에서 이연했던 컬링을 v8 대형맵(40×60) 대비로 회수.
- **구조 프리미티브**(`objects/structures.tsx`): threshold(IThreshold walkable)·glass(IGlass 차단)·tint(Tint non-blocking 오버레이).
  objectCollision이 door/threshold/tint skip, glass/footprint 차단.
- **가구 폴드:** NurseStationDesk/NurseDeskI/IReception 재정의는 5f-iii가 아니라 **5g-a(ER) 등 첫 사용처**에서 부서 장비와 함께 추가(적응형).
- 검증: tsc 0·jest 47/47(+6)·expo export·doctor 21/21. **5f 완료.** 다음: 5g-a ER 마스터 블루프린트.

## 2026-06-27 · 탭-투-워크 회귀 정정 (R-1 #1 되돌림)
- 디바이스: 캠퍼스(scale 0.6) 탭 이동 안 됨. 원인 = R-1 #1 수정으로 만든 작은-Pressable+내부-scale-래퍼 구조에서 내부 콘텐츠가
  Pressable을 넘쳐 터치 미수신. 리뷰어 HIGH는 **오탐**, 내 수정이 회귀 유발.
- 정정: 5d-iv 원래 **단일 transform** 구조 복원(Pressable worldW×worldH + transform[translate,scale] origin TL, 탭 ÷TILE).
  locationX는 비변환 로컬 좌표라 ÷TILE이 정답. tsc 0·jest 47/47·expo export·doctor 21/21.
- 교훈: 불확실한 런타임 동작(transform 하 locationX)은 speculative 코드 수정 대신 디바이스 검증으로 확정. 게이트의 디바이스 항목이 안전장치였음.

## 2026-06-27 · 디바이스 피드백 3건 (빠른이동·HUD·엘리베이터)
- **ER 트리아지 빠른이동 안 됨:** 룸 anchor(5,4)가 bed1 풋프린트 위라 warpTo의 canEnter가 막아 no-op. → collision에 `nearestOpen`
  (막히면 바깥 링 탐색해 가장 가까운 통행 타일) 추가, warpTo가 사용. 모든 방에 견고.
- **캠퍼스 HUD:** 방/리전 없는 캠퍼스에도 ZONE 배지·빠른이동 노출. → HUD `showZone`(regions>0)·`showFastTravel`(rooms>0)로 조건부 숨김.
- **엘리베이터 시퀀스:** GO→ **문 닫힘(탑승)→탑승 중→문 열림(도착)** 풀 사이클(reanimated withSequence, rest=open). 라이드 중
  `api.prefetchInterior`로 목적지 맵 프리로드(api에 interior 캐시 추가) → 문 열릴 때 즉시 진입. 그 외 층은 "준비 중".
- 검증: tsc 0·jest 48/48(+nearestOpen)·expo export·doctor 21/21.

## 2026-06-27 · 엘리베이터→인테리어 도어 리빌 전환 (피드백)
- 사용자 제안: 문 닫힌 채 이동→목적지 맵을 문 뒤에서 로드→문이 좌우로 열리며 맵을 드러냄.
- 구현: 엘리베이터는 **문 닫고(보딩) 닫힌 채 navigate**(router.replace `?via=elevator&c=wall`). 인테리어 라우트는 **풀스크린 닫힌
  `DoorReveal` 오버레이**를 띄우고 그 뒤에서 맵 로드(프리로드 캐시로 즉시) → 준비되면 문 좌우 슬라이드로 **맵을 리빌**. 닫힘=엘리베이터,
  열림=인테리어 → 끊김 없는 한 사이클. (라우트 간 shared-element 모핑 없이 "둘 다 닫힌 픽셀 문"으로 연속감 확보.)
- 검증: tsc 0·jest 48/48·expo export·doctor 21/21.

## 2026-06-27 · 엘리베이터 진입 라우트 슬라이드 제거 (피드백)
- 증상: 병동 진입 시 native-stack 기본 **옆 슬라이드** + DoorReveal 문 열림이 겹쳐 어색.
- 수정: 인테리어 라우트가 `via=elevator`면 `Stack.Screen animation:'none'`(그 외 진입은 기본 슬라이드 유지) → 슬라이드 없이 문 리빌만.
  부수효과로 닫힌 cab 문 → (즉시 컷) 풀스크린 닫힌 문으로 "문이 커지는" 느낌도 남(사용자가 언급한 효과). tsc 0·jest 48/48·expo export.

## 2026-06-28 · 2.5D 깊이 정렬 (z-순서) — 캠퍼스 건물 뒤 캐릭터
- 증상: 캠퍼스에서 player/NPC가 건물 뒤(북쪽)로 가도 건물 위에 보임(스프라이트를 항상 오브젝트 뒤에 그려서).
- 수정: 모든 월드 요소에 **발/풋프린트-바닥 타일 y 기반 `zIndex`** 부여(`zFor(baseY)=round(baseY*10)+10`). 오브젝트=y+footprint.h,
  스프라이트=feet y(player=pos.y+1, derived/ambient NPC=현재 y+1). 핫스팟 마커 z9000·RoomMask z99999(항상 위). 바닥/틴트/벽은 하위.
  → base-y 큰 쪽이 앞(카메라 근처). 건물보다 북쪽이면 가려지고 남쪽이면 앞에 보임. AmbientNpc는 내부 y로 자기 zIndex 설정(이동 중에도 정렬).
- 검증: tsc 0·jest 48/48·expo export·doctor 21/21. (인테리어에도 일반 적용 — 침대 등도 깊이 정렬.)

## 2026-06-28 · 건물 그림자 수정 (피드백)
- 증상: 캠퍼스 건물 우측 그림자가 건물 전체 높이만큼의 일자 스트립이라 부자연.
- 수정(광원 좌상단 기준): 그림자 = 우측 **폭 1칸(16px) 고정** + **높이 = 평지붕(top face) 깊이 td** (건물 앞뒤 길이). 바닥 앵커.
  랜드마크별 td 적용(MedCenter 26·H 32·암센터/행정 30·여성소아 sh*0.22·시계탑 22). tsc 0·jest 48/48·expo export.

## 2026-06-28 · 5g-a 빌드 — ER 마스터 블루프린트
- 40×60 ER_INTERIOR 재작성: 공공 로비(상단 전폭) + 3열×3밴드 룸 그리드(소생/스테이션+Pyxis/진료 // 음압격리/봉합/진료 // 정신격리/임종/제염).
  내부 경계=`threshold`(음압·제염 sterile tone), 외부만 auto `door`, 특수실 `tint`(정신 파랑/임종 웜/제염 wet). 컬럼당 lobby→band1→2→3 연결.
- 장비 16종 컴팩트 포팅(`objects/erEquipment.tsx` + ErObjectView, InteriorObjectView default에서 Er→Clinic 순). NurseStationDesk 포함
  (5f-iii에서 폴드했던 가구). NPC idle/배회 + 핫스팟 4(시나리오 연결). 캠퍼스/엘리베이터 진입 모두 INT-ER-00001로.
- 검증: tsc 0·jest 48/48(ER 도달성/threshold/footprint)·expo export·doctor 21/21. ⚠️ 소품 ~15종 + 음압 IGlass 분할 + 제염 외부문은 폴리시 후속.
- 다음: 5g-b OR(+PACU).

## 2026-06-28 · 5g-a ER 피드백 3건 (컬링·충돌·엘리베이터 spawn)
- **"가까이 가면 안 보임" = 컬링 버그:** 컬링 창을 플레이어 타일 기준으로 계산해, 맵 가장자리에서 카메라가 클램프되면 실제 가시 영역과
  어긋나 가장자리 오브젝트가 사라짐. → InteriorScreen이 **클램프된 카메라 tx/ty**(worldStyle와 동일 식)로 가시 윈도를 도출하도록 수정.
- **"그냥 통과" = 충돌 누락:** 솔리드 ER 장비에 footprint 부여(OBJECT_FOOTPRINT: vitals/ivpump/dressing/medfridge/scanner/chemdrum/
  ppestand/wastebin) + 소파 props.h:1. (walk-through detector·벽걸이 display·바닥 triageline/tint는 비차단 유지.)
- **엘리베이터 진입 spawn:** ElevFloor.entry 추가 → 라우트가 `?ex&ey` 전달, 인테리어가 playerStart 오버라이드(메모이즈). 타워 1F→ER (20,11) 도어 앞.
- **트리아지 바닥선(빨/노/초):** KTAS 중증도 안내선(실제 ER 요소) — 유지(필요시 제거/라벨).
- 검증: tsc 0·jest 48/48·expo export·doctor 21/21.

## 2026-06-28 · 디자인 핸드오프 v9 채택 (DS 카탈로그 갱신만)
- `design-handoff_v9/` 카논. 전 문서 링크 v8→v9 재지정(9개). v9 = v8 + **DS 카탈로그 레퍼런스 3개 갱신만**(stale 동기화):
  `ds-equipment.jsx`(+카탈로그 화면 3: ScreenDSEquipmentDerm/OrthoWard/SurgWard — 5g-g/h/i 부서 장비 쇼케이스), `ds-furniture.jsx`·
  `app-ds.jsx`(사소). **스펙(.md)·인테리어/오브젝트 소스 변경 0** — surg2/ortho2/derm2 장비는 이미 v8에 존재(해당 병동 빌드 시 포팅).
- 앱 반영 코드 없음(카탈로그는 디자인 레퍼런스 전용). 링크 재지정 + 기록만.
- 결정자: 사용자(v9 제공·동기화) + AI(델타 무시-가능 판정).

## 2026-06-28 · 5g-a ER — 전체 픽셀 1:1 재포팅 + 인테리어 블루프린트 1:1 재구성
- **계기:** 사용자가 "정말 핸드오프와 동일하게 구현됐냐"고 질의 → ER이 구조충실하나 단순화본임을 인정.
  너스스테이션 데스크 모양 지적("ㄷ자인데 너무 대충") 후 **"전체 픽셀 1:1 재포팅"** 선택.
- **방법:** 감사 에이전트로 erEquipment 전 오브젝트를 레퍼런스(interior-objects-er/er2/er3) 대비 요소 단위 대조 →
  배치 3건으로 누락/오류 채움. NurseStationDesk를 진짜 1:1(우드그레인·쿼츠엣지·모니터베이스+CT배경·키보드내부·
  라벨프린터용지·바스켓점선·펜캐디·커피컵)로 완성. 누락 4종(EKG/Sink/Whiteboard/Scale) 신규 추가.
- **Phase 2(인테리어 1:1):** `sharedEquipment.tsx` 신설 — interior-shared 프리미티브(IBed 3변형/IMonitor/IIV/
  ICurtain/IReception/IChair 4방향/IPlant/ICabinet/ExamStool) + 타부서 오브젝트(SurgicalLight/InstrumentTray
  /Ventilator/CrashCart/PyxisMachine/BankOfMonitors/XrayViewbox/CastCart) 충실 포팅. div 레퍼런스는 SVG로 재구성.
  **회귀 회피:** `i*` 접두 신규 타입 + SharedObjectView로 분리 → 기존 clinic bed/monitor/reception 불변.
- **ER_INTERIOR 재작성:** interior-er.jsx 1:1 — 40×60, y16/y33/y49 + x13/x26 그리드(밴드별 threshold 갭),
  앰뷸런스/정문/캠퍼스/제염외부 도어, IGlass 분할(약품실·음압전실), 10존 전체 오브젝트 배치, ICurtain 베이 분할,
  트리아지 바닥선, NPC ~40, 핫스팟 12, playerStart 19,28. floorTheme clinical.
- **충돌:** 신규 솔리드 타입 footprint 추가; nursestation(ㄷ 빈 공간)·triageline·icurtain은 walkable 처리.
- **근거:** 핸드오프 충실도가 제품 정체성. "안 보이던 오브젝트 다수"는 픽스처가 블루프린트의 일부만 배치한 탓 → 1:1 재구성으로 해소.
- **검증:** tsc 0 · jest 48/48 · expo export. 커밋 5건(5376b58/da411ba/c59b0a6/+컴포넌트/73c1c30).
- **결정자:** 사용자(1:1 재포팅 지시·"이대로 진행, 완료 후 보고") + AI(감사·배치 실행).

## 2026-06-28 · 5g-b OR(+PACU) — 전체 블루프린트 1:1 구현 (원칙 확립)
- **원칙 확립(사용자):** "엔진 데모는 일부 구현이 이해되지만, 이제 진짜 층별 병동을 구현하니 **블루프린트 전부** 구현. 앞으로도."
  → 5g-* 부서/병동은 핸드오프 블루프린트를 전수 구현(오브젝트·NPC·핫스팟·파티션 전부), 데모 부분구현 금지.
- **OR 오브젝트 전수 포팅:** `orEquipment.tsx` 신설 — interior-objects-or2 카탈로그 13종(BairHugger/Bovie/KickBucket/
  TimeoutBoard/RoboticConsole/LapTower/CO2Insufflator/ScrubDispenser/ScrubTimer/ConsentClipboard/SoiledCart/
  ORBoomMonitor/CArm) + OR-native AnesthesiaMachine/StatusBoard. div 레퍼런스는 SVG 재구성, text 글리프는 도형 대체.
  공용 SinkOR·NurseDeskI는 sharedEquipment로(타부서 재사용). ICabinet 7변형 타일(supply/drug/linen/chart/sterile/
  equipment/pharma) 충실화.
- **OR_INTERIOR 1:1:** interior-or.jsx 전수 — 40×52, 3단 동선존(비제한/준제한/제한·양압), OR 진입은 sterile threshold,
  9존 전체 오브젝트(보호자/락커/preop/clean/dirty/PACU/OR1/scrub/OR2), ICurtain, NPC ~24, 핫스팟 14(OR 시나리오 5종 연결),
  playerStart 7,40. 타워 3F 엘리베이터 → INT-OR-00001(entry 18,1).
- **디스패치:** Er→Or→Shared→Clinic. 신규 솔리드 footprint 추가, 벽/천장/탁상 피스는 walkable.
- **검증:** tsc 0 · jest 52/52(OR 도달성·threshold·footprint 신규 4) · expo export. 커밋 b6602a0.
- **다음:** 5g-c ICU.
- **결정자:** 사용자(전수 구현 지시·"이대로 진행, 완료 후 보고") + AI(포팅·픽스처 실행).

## 2026-07-01 · 디자인 핸드오프 v10 채택 (수술등 재디자인만)
- `design-handoff_v10/` 카논. v9 전체 복사본(스펙 6 + reference 63) + **SurgicalLight 재디자인만** 델타.
  전 문서 링크 v9→v10 재지정(prd·STATUS·01·02 스테이지 8개; DECISIONS는 이력 보존).
- **SurgicalLight v10(interior-or.jsx):** 2.5D 사선-위 뷰 — **매끈한 상단 하우징(전구 없음)** + 그 아래 **기울어진 발광
  언더사이드 밴드에 전구**(외곽 8 + 내부 4, cos/sin 배치) + **하향 원뿔형 빔(#FEF3C7) + 바닥 글로우(#FEF08A)**.
  구버전(평면 돔 + 상단 전구 링)에서 교체.
- 앱 반영: `sharedEquipment.tsx` SurgicalLight 재작성(viewBox 64×48, offY -12). ER 소생/봉합 + OR1/OR2에서 공용 사용.
  시뮬레이터(ER 소생실)에서 렌더 확인 — 상단 매끈 돔 + 언더사이드 노란 전구. tsc 0·jest 52/52. 커밋 6e2e324.
- 결정자: 사용자(v10 제공·조명 수정·reference 동기화) + AI(포팅·검증).

## 2026-07-01 · 5g-c ICU — 전체 블루프린트 1:1 구현
- **ICU 오브젝트 전수 포팅:** `icuEquipment.tsx` 신설 — interior-objects-icu2 카탈로그 9종(CRRTMachine·IVPumpTower(6단)·
  EVDStand·ICPMonitor·TTMUnit·FoleyBag·Intercom·GownBox·VisitorScreen). text 글리프는 도형 대체.
- **ICU_INTERIOR 1:1:** interior-icu.jsx 전수 — 34×44, **유리벽 4인 병실**(VENT/CRRT/EVD/TTM, 병실별 y17 유리경계 오토도어)
  + 중앙 텔레메트리 허브(모니터뱅크 + 차팅데스크 2 + 코드블루 크래시카트) + 지원동(면회/오염/약품). 유리벽은 objectCollision으로 차단.
  NPC ~11, 마커는 베드/NPC 속성(ICU 시나리오 5종 연결: park-vent/psychosis/monitor-alarm/code-blue/eol-family).
  playerStart 허브(16,26 — 16,23은 데스크 위라 이동). 타워 4F 엘리베이터 → INT-ICU-00001(entry 7,42).
- **디스패치:** Er→Or→Icu→Shared→Clinic. 신규 솔리드 footprint(crrt/ivpumptower/evdstand/icpmonitor/ttmunit).
- **검증:** tsc 0 · jest 56/56(ICU 도달성·threshold·glass·footprint 신규 4) · expo export · **시뮬레이터 전 구역 렌더 확인**. 커밋 71c435d.
- **다음:** 5g-d Peds.
- **결정자:** 사용자("다음 프로세스 진행" + 핸드오프 충실 지시) + AI(포팅·픽스처·시뮬 검증).

## 2026-07-01 · waypoint에 "구현 스펙(Build Spec)" 도입 (프레임워크 표준)
- **결정:** 실제 로직/화면/알고리즘/콘텐츠를 산출하는 스테이지는 코딩 전 **Build Spec**을 쓴다. 한 문서·**고정 정규
  섹션**(개요·분해·도메인/데이터·동작/규칙·UI/상호작용·엣지케이스·명세표·미해결질문·체크리스트·검증·편차) +
  적응형 깊이 티어(minimal/standard/comprehensive) + Plan-first 옵션형 질문 루프(AskUserQuestion→DECISIONS) +
  체크리스트 실행추적 + 편차 로그. `FRAMEWORK.md` "구현 스펙" · `_templates/build-spec-template.md` · stage-template 링크.
- **근거:** 설계(무엇을/왜)만으론 구현 시 SoT(핸드오프/PRD)를 매번 재해석 → 누락·불일치가 조용히 발생(부서 맵의
  "핸드오프엔 있는데 앱엔 없는 오브젝트"의 문서판). AI-DLC functional-design의 "구현 없이 다시 유도 안 해도 될 상세"
  + "고정 카테고리 완결성 체크" + "plan-first 객관식 질문"을 차용. `departments/`가 선행 실사례.
- **대안(탈락):** (a) 자유 섹션 1문서 — 완결성 강제 못함(누락 재발). (b) AI-DLC 4-문서 분할
  (business-logic/rules/entities/frontend) — 솔로 MVP엔 파일 오버헤드. (c) user-stories/persona/units 병렬분해/
  raw audit.md — 팀·엔터프라이즈용, 속도 저해(기존 방침 유지, 미채용).
- **결정자:** 사용자(2번=한 문서·고정 정규 섹션 선택, "상세하게 템플릿화") + AI(AI-DLC 조사·차용 설계).

## 2026-07-01 · Build Spec = 네 아티팩트 + 인덱스 (구성 정정)
- **결정:** Build Spec을 "한 문서·고정 정규 섹션"이 아니라 **네 개의 1급 아티팩트**(domain-entities · business-rules ·
  business-logic-model · frontend-components) **각각 자체 상세 템플릿** + 이를 묶는 인덱스로 재정의.
  `_templates/build-spec/`에 5파일(인덱스+4). 적응형 깊이 = 생성 아티팩트 수(minimal 인덱스만 → comprehensive 4개+NFR).
  콘텐츠 시리즈(부서 맵)는 항목당 1문서에 네 아티팩트를 도메인 섹션으로 압축.
- **근거:** 사용자 지적 — AI-DLC functional-design의 핵심은 그 네 영역을 *각각 정밀하게* 다루는 것인데, 직전
  build-spec-template(단일·정규섹션)이 넷을 generic 섹션으로 뭉개고 이름을 바꿔 정밀함을 잃었다. 관심사 분리로
  각 영역을 독립 템플릿화해 완결성을 강제.
- **대안(탈락):** (a) 단일 문서·정규 섹션(직전 안) — 영역 정밀함 상실(정정 대상). (b) 한 문서 내 4 상세 섹션 —
  사용자가 4파일 분리를 명시 선택.
- **관계:** 2026-07-01 "Build Spec 도입" 항목을 대체하는 구성이 아니라 그 구성 세부를 확정. 트리거·질문루프·
  체크리스트·편차·위치(하이브리드)·리뷰게이트는 유지.
- **결정자:** 사용자(네 아티팩트 각각 상세 템플릿화 + 4파일 분리 선택) + AI(AI-DLC 매핑·템플릿 작성).

## 2026-07-01 · 부서 Build Spec = 부서당 디렉토리 + 5파일 (인스턴스 형태 확정)
- **결정:** 부서 구현 스펙을 압축 단일 `<dept>.md`가 아니라 **부서마다 `<dept>/` 디렉토리**로 두고, 네 아티팩트
  (domain-entities·business-rules·business-logic-model·frontend-components)를 **각각 별도 파일** + build-spec-index.md
  로 인스턴스화. er/·or/·icu/ 전환 완료. `er/`가 기준 인스턴스.
- **근거:** 사용자 기대 — 템플릿을 4파일로 나눈 것과 동일하게, 실제 부서 스펙도 각 아티팩트가 자체 파일로 존재해야
  "각각을 구체적으로 정의"한다는 의도에 부합. 압축 단일 문서는 그 정밀함/분리를 다시 뭉갬.
- **대안(탈락):** 압축 단일 `<dept>.md`(직전 형태) — 아티팩트 분리 상실로 정정.
- **영향:** README 인덱스·템플릿·FRAMEWORK "위치" 예시를 폴더 형태로 갱신. 콘텐츠·좌표는 fixture와 1:1 재검증(불변).
- **결정자:** 사용자(부서당 디렉토리·아티팩트별 파일 명시) + AI(인스턴스화).

## 2026-07-01 · OR·ICU 화면 단위 핸드오프 대조 검증 (재사용 하네스 도입)
- **결정:** OR·ICU를 ER과 동일하게 화면 단위로 핸드오프와 대조 검증. **핸드오프 렌더 하네스**(`inputs/design-handoff_v10/
  reference/_hoff-harness.html` — 디자인 JSX를 Chrome headless로 flat-render, URL 해시로 부서 선택)를 도입해 ground truth
  이미지를 확보하고, iOS 시뮬레이터 구역별 캡처와 대조.
- **결과:** OR 8구역·ICU 8구역 전부 **핸드오프와 충실히 일치**(오브젝트 1:1·좌표·NPC·마커·바닥 팔레트). 재포팅이 정상 반영됨
  확인. 편차 없음 — 유일한 의도적 편차는 OR 수술등 70% 크기(사용자 재확인 유지).
- **근거:** 사용자가 OR/ICU를 ER처럼 철저히 검증 요청("전부 다시 구현하며 검증"). 소스 대조상 이미 1:1이라 재구현 대신
  화면 검증으로 충실성 실증. 하네스는 Peds 이하 전 부서 재사용.
- **결정자:** 사용자(수술등 70% 유지·더 깊은 대조 요청) + AI(하네스 구축·전 구역 검증).

## 2026-07-07 · design-handoff_v11 채택 — 장비 2.5D 재포팅
- **결정:** 핸드오프 v11(장비를 평면 2D→RPG-Maker 2.5D로 개정: 통합 둥근 실루엣 fill+재stroke, 명시적 상단면,
  seam, viewer-facing 전면 패널, 어두운 바퀴)을 현행 SoT로 채택. 구현된 부서 장비를 v11로 대대적 재포팅.
- **재포팅 범위:** `sharedEquipment`(IPlant·SinkOR·InstrumentTray·Ventilator·CrashCart·PyxisMachine),
  `icuEquipment`(CRRT·TTM), `orEquipment`(BairHugger·Bovie·RoboticConsole·LapTower·CO2Insufflator·
  ScrubDispenser·SoiledCart·AnesthesiaMachine), `erEquipment`(Defib·OxygenTank·EKG·CompCart·Sink·SuctionUnit·
  Wheelchair·VitalsCart·IVPump·DressingCart·WaterCooler·PPEStand·Otoscope·TicketDispenser·SecurityScanner·
  MetalDetector·MedFridge·CoffeeTable). **그림자-방향만 바뀐 오브젝트는 미변경**(RN 포팅은 CSS drop-shadow 생략).
- **검증:** tsc 0 · ER viewBox parity 자동 대조(전 오브젝트 v11 일치) · iOS 시뮬레이터 렌더 확인(ER resus/lobby,
  OR1/OR2, ICU CRRT). ER은 서브에이전트 포팅 후 viewBox 대조+시뮬로 검증.
- **문서:** departments README에 "v11 2.5D 장비 규약" 명문화(신규 부서는 v11 따름) + SoT 경로 v10→v11.
  렌더 하네스(_hoff-harness.html)를 v11 reference dir로 이관.
- **미구현 부서(peds/pharma/ward/surgward/orthoward/derm):** 코드 미구현 → 계획 문서(README)가 v11을 가리키도록
  갱신, 착수 시 v11 2.5D 규약으로 포팅.
- **결정자:** 사용자(v11 반영·대대적 수정 지시) + AI(재포팅·검증·문서).

## 2026-07-10 · handoff v12·v13 diff 확인 + v13 접지 그림자 반영
- **v11→v12:** 인테리어/장비 변화 없음(캠퍼스 건물 `buildings-v2.jsx`/신규 `ds-buildings.jsx` + explore 화면만). 우리 작업 무관.
- **v12→v13:** 장비 그림자 모델 교체 — 하드 CSS `drop-shadow` 제거(RN 포팅은 이미 생략) + 각 **바닥형 오브젝트** svg 첫 자식으로
  **접지 그림자 타원** `rgba(0,0,0,.16)` 추가(벽걸이/천장/얇은 것 제외). 레이아웃·픽스처·NPC 변경 0(interior-er.jsx는 아예 무변경).
- **결정:** v13을 현행 SoT로. 구현 4파일에 접지 그림자 반영 — er 38 · or 12 · icu 8 · shared 12개 바닥 오브젝트에 `<Ellipse>` 첫 자식 추가
  (핸드오프 좌표 그대로, 커스텀 viewBox는 밑면 맞춤). er/or은 서브에이전트 포팅 후 tsc+시뮬 검증, icu/shared는 직접.
- **검증:** tsc 0 · jest 56/56 · 시뮬레이터(ER resus·ICU CRRT 접지 그림자 확인). 문서 SoT v11→v13, README에 v13 접지 규약 추가, 하네스 v13로.
- **결정자:** 사용자(v13 적용 지시) + AI(diff·반영·검증).

## 2026-07-10 · 5g-d Peds+NICU 구현 (v13)
- **결정:** Peds+NICU 인테리어를 v13 핸드오프에서 1:1 구현. 34×48, floorTheme 'peds', 5구역(welcome/exam/ward/ante/nicu),
  NICU 유리 전실 + sterile 3분 스크럽 threshold + 인큐베이터 존(저조도 tint). 신규 `pedsEquipment.tsx` 16종
  (incubator·phototherapy·metalcrib·ivboard·babyscale·stadiometer·tonguejar·stickerroll·dosingchart·milkfridge + 놀이방
  smallslide·rockinghorse·toychest·blocks·mural·balloon). `ibed variant='peds'` 재사용. phototherapy = OVERHEAD z.
- **해소된 질문:** Q1 시나리오=**라벨만**(scenarioId 후속) · Q2 엘리베이터=**타워 5F 신설**(entry 16,1) · Q3 = ibed peds 변형 기존 재사용.
- **검증:** tsc 0 · jest 61/61(peds-fixture 5: 도달성·threshold·유리벽·footprint) · 시뮬레이터 welcome/ward/NICU 렌더 확인.
- **편차:** scale 0.85 · 놀이매트 tint 근사 · Mural clipPath 평면 근사 · RockingHorse/Balloon 정적(bob 후속) · 시나리오 라벨만.
- **결정자:** 사용자(5F·라벨만 선택, "Peds 진행") + AI(Build Spec·구현·검증). Peds 카탈로그는 서브에이전트 생성 후 tsc+시뮬 검증.

## 2026-07-12 · 인테리어 로딩 fixture-first (서버 구버전 시드로 오브젝트 누락 버그)
- **증상:** 엘리베이터로 층 이동 시 간헐적으로 인테리어 오브젝트 누락(방 사이 threshold 가림막·접수대 안 보임). 사용자는 문 여닫힘 애니(DoorReveal) 의심.
- **원인:** 라우트(`app/interior/[id].tsx`)가 `api.interior(id)`를 **서버 우선** 로드, throw 시에만 번들 FIXTURE 폴백. dev Go 서버가 켜져 있으면 **구버전/부분 시드**를 200으로 반환 → 폴백 없이 그대로 렌더 → 오브젝트 누락(서버 상태·캐시 따라 간헐적). 오브젝트 컬링은 이미 off라 렌더 문제 아님. DoorReveal은 결과를 드러낼 뿐 원인 아님(무서버 환경 3/3 정상 재현으로 확인).
- **결정:** 부서 인테리어는 **번들 FIXTURE가 정본**(클라이언트 저작, 서버 미시드) → `FIXTURES[id]` 있으면 **동기 로드(fixture-first)**, 서버 미조회. 비번들 id만 서버 조회. 서버 시드가 최신화되면 재검토.
- **효과:** stale-server-data로 인한 오브젝트 누락 원천 차단 + 엘리베이터 DoorReveal 뒤 async 레이스 제거. tsc 0·jest 61/61·엘리베이터 진입 재검증.
- **결정자:** 사용자(직접 확인 요청) + AI(진단·fixture-first 수정).

## 2026-07-12 · 엘리베이터 전환 재설계 + 재진입 렌더 안정화
- **결정:** 엘리베이터 층 이동 연출을 재설계 — (a) 층 선택 화면의 작은 문 미리보기 제거, "이동" 시 **화면 전체 캡 도어**가 닫힘 → 목적지 `DoorReveal`로 seamless 인계. (b) 상단 **LCD 층수 표시**(RIDING/ARRIVED·방향 화살표·부서) + 층 티커(from→to). (c) 문은 **맵이 완전 렌더된 후에만** 개방(`InteriorScreen.onReady` = onLayout+2×rAF) + 최소 이동 비트. (d) 층 선택 버튼은 네모 숫자(동그라미 제거)+하드 그림자, **선택 시 눌린 상태 유지**(그림자 속으로 latch).
- **재진입 오브젝트 소실 버그(중대):** 급속 엘리베이터 재진입 시 오브젝트가 사라지거나 배치가 어긋남. 카메라/vp/pos는 정상(온스크린 디버그로 확인)인데도 오브젝트 레이어만 통째로 페인트 실패 → **react-native-svg 동시 마운트 레이스**로 규명. 수정: ① 카메라 워클릿이 vp를 **shared value로 라이브 read**(stale JS 클로저 제거) + 진입 시 카메라 스폰 스냅 ② 정적 레이어를 `StaticWorld`(interior 메모)로 격리(NPC 이모트 재렌더와 분리) ③ 오브젝트 깊이 정렬(DOM 순서=painter) ④ **오브젝트 레이어 1프레임(rAF) 지연 마운트**(레이스 회피, 결정적 수정).
- **딥링크 함정:** 벽 색상 파라미터의 `#`(%23)이 URL fragment를 시작시켜 뒤 파라미터 전부 유실 → 색상 hash-free 전달 후 라우트에서 `#` 재부착.
- **검증:** tsc 0 · jest 62/62 · 시뮬레이터 재진입 6+회 전부 완전·일관 렌더.
- **결정자:** 사용자(연출·버튼 피드백 지시, "직접 테스트하고 수정") + AI(진단·수정·검증).

## 2026-07-12 · 5g-e Central Pharmacy 구현 (v13)
- **결정:** 중앙 약제부 인테리어를 v13 핸드오프에서 1:1 구현. 36×42, floorTheme 'pharma', 5구역(window/dispense/vault/ante/cleanroom). 수령창구(픽업 카운터+유리 배리어)·기송관 허브 → 조제실(ATC·LASA·약장 A~D·검수대) + 마약류 이중잠금 금고 alcove → 무균 전실→에어샤워→무균 조제실(BSC×2·차압계·유출키트·원심·프린터). 신규 `pharmaEquipment.tsx` 21종 + `PharmaObjectView` 디스패치.
- **해소된 질문:** Q1 진입=**둘 다**(엘리베이터 타워 **P1층 신설** entry{16,40} + ER 약품실 **portal 문** entry{9,9}) · Q2 시나리오=**라벨만**. `Hotspot`에 `target`/`entry` 추가 + 라우트 `kind:'portal'` 분기(push, 뒤로가기 ER 복귀). HotspotMarker `portal → '→'`.
- **검증:** tsc 0 · jest 69/69(pharma-fixture 7) · 시뮬레이터 5구역 렌더 + 엘리베이터 P1 + ER portal 마커 확인.
- **편차:** scale 0.8 · **x21 divider y13→y20 보정**(핸드오프대로면 무균 전실 밀봉 → 진입 불가; 오브젝트 좌표 1:1 유지, 충돌만 보정) · SVG text→shape/생략 · 미배치 helper(Kiosk/QueueRope/CountingBench/CSSafe/LaminarHood) 스킵 · Centrifuge/WallPhone 애니 정적 · 시나리오 라벨만.
- **결정자:** 사용자("약국 진행", 진입 둘 다) + AI(Build Spec·구현·검증).

## 2026-07-13 · RoomMask "잘못된 방에 고정" 버그 — regionAt 최소면적 규칙
- **증상:** 방 포커스 마스크가 현재 방이 아닌 엉뚱한(더 큰) 구역에 고정. 약국 마약류 보관고에 들어가도 조제실로 표시·마스크됨. 사용자: "현재 방이 마스크되면 안 되는데 이동해도 고정".
- **원인:** `regionAt`이 regions 배열의 **첫 매칭**을 반환. 큰 구역의 사각형이 그 안에 든 작은 방을 덮고 배열에서 먼저 나오면(예: dispense{0,12,21,30} ⊃ vault{0,28,13,14}), 작은 방에 서 있어도 큰 구역이 반환됨 → ZONE·RoomMask가 큰 구역에 고정.
- **수정(엔진 전역):** `regionAt`을 **가장 작은(가장 구체적인) 면적의 포함 구역 반환**으로 변경(`engine/regions.ts`). 배열 순서와 무관하게 항상 실제 서 있는 방으로 해석 → "겹침 그림자" 버그 클래스 원천 제거. 약국 regions 재배치는 이제 불필요하나 무해하게 유지.
- **검증:** 전 9개 인테리어 **중심-타일 감사 통과**(각 방 중심이 자기 방으로 해석) · tsc 0 · jest 69/69 · 시뮬레이터에서 약국 마약류 보관고·ER 너스스테이션·ER 제1진료실 각 방 포커스 정상(강한 dim 0.55로 밝은 영역=현재 방 확인 후 0.2 원복).
- **결정자:** 사용자(직접 테스트·수정 지시) + AI(진단·전역 수정·감사).

## 2026-07-13 · 5g-f Internal Medicine Ward 구현 (v13)
- **결정:** 일반 내과 병동을 v13 핸드오프에서 1:1 구현. 28×52, floorTheme 'internal'(sage), 7구역(린넨/클린/더티 서비스 스트립 → 중앙 간호 스테이션 복도 → 4인 만성질환 병실(커튼 분리) → 1인실 + VRE 접촉 격리실). 신규 `wardEquipment.tsx` 16종(ward2 11 + local MealCart/SharpsBin/IsoSign/DedicatedBP + DeskPhone) + `WardObjectView`. 공용(ibed ward·nursestation ㄷ-데스크·icurtain·vitals·walltv·sofa 등) + pharma의 pneumatictube/barcodescanner 재사용.
- **해소된 질문:** Q1 스코프=**내과 병동만**(외과/정형은 후속 5g-g/h, 같은 카탈로그 재사용) · Q2 진입=**엘리베이터 타워 8F**(entry {12,50}; 하단 캠퍼스 문이 1인실\|격리 분리벽 x13을 걸쳐 1인실 쪽 스폰) · Q3 시나리오=**라벨만**.
- **검증:** tsc 0 · jest 76/76(ward-fixture 7: 도달성·threshold·4인실 커튼 차단+4베이 도달·1인실\|격리 분리벽·footprint) · 시뮬레이터 전 구역 렌더 확인.
- **편차:** scale 0.9 · IBed label 생략(공용 dispatch 미지원, peds와 동일) · SVG text→shape/생략 · 캠퍼스 문이 분리벽 걸침(1:1 유지, entry만 조정) · 시나리오 라벨만.
- **결정자:** 사용자("5g-f 입원 병동 진행") + AI(Build Spec·구현·검증).

## 2026-07-13 · 5g-f 내과 병동 v14 방 배치 정정 (사용자 피드백)
- **결정:** handoff **v14**로 SoT 갱신 후 내과 병동(INT-WARD) 방 배치 정정. v13→v14 diff = 구조 3건: ① playerStart {13,14}→{4,15} ② 캠퍼스 문 하단(↑ x12-14 y51)→**좌측(← x0 y14-16)**, 하단 벽 채움 ③ 좌측 세로 핸드레일 제거(우측만). 오브젝트 카탈로그(ward2)·각 방 오브젝트 좌표는 v13=v14 동일(80+개 전수 대조로 확인) — 제 v13 포팅이 오브젝트 좌표상 이미 handoff와 1:1이었고, 실제 diff는 위 구조 + 핸드레일뿐.
- **반영:** `fixtures/ward.ts`(playerStart·좌측 문 벽 갭·하단 벽·핸드레일 제거) · `ElevatorScreen` 8F entry {12,50}→{1,15} · `ward-fixture.test.ts`(좌측 문 도달·하단 벽 차단) · Build Spec SoT v14.
- **검증:** tsc 0 · jest 76/76(ward 7) · 시뮬레이터 좌측 문·스테이션 진입·전 구역 렌더 확인.
- **결정자:** 사용자(v14 방배치 정정·오브젝트 diff 확인 지시) + AI(v13↔v14 diff·전수 대조·수정·검증).

## 2026-07-14 · 5g-g General Surgery Ward 구현 (v15)
- **결정:** 일반 외과 병동을 v15 핸드오프에서 1:1 구현. 28×52, floorTheme 'surgery'(steel), 5구역(린넨/처치·드레싱룸 → 간호 스테이션·보행 → 4인 수술후 병실(커튼) → 1인 대수술 중증실). 내과 병동과 동형(좌측 문·세로 흐름). 신규 `surgEquipment.tsx` 8종(PCAPump·JPDrain·Hemovac·NGSuction·SCDDevice·WalkerRack·OPScheduleBoard·StapleRemover) + `SurgObjectView`. **ward2 카탈로그 + shared/OR(surgicallight·instrumenttray)/ER(dressing·suction·wastebin) 대거 재사용**.
- **해소된 질문:** Q1 진입=**엘리베이터 타워 7F 신설**(deptCode 7F; 8F=내과·7F=외과·6F=정형(예정)), entry {1,15} · Q2 시나리오=라벨만 · Q3 미배치 helper(Walker·AbdoBinder) 스킵.
- **검증:** tsc 0 · jest 82/82(surgward 6) · 시뮬레이터 전 구역(스테이션 OP보드·PCA·워커랙, 처치실 수술등·드레싱카트, 4인 수술후 JP·PCA·커튼, 중증실 NG흡인·Hemovac×2·SCD) 렌더 확인.
- **편차:** scale 0.9 · IBed label 생략 · SVG text→shape · Walker/AbdoBinder 미구현 · NPC 소수 좌표 반올림(y17.5→18) · 시나리오 라벨만.
- **결정자:** 사용자("다음 작업 시작") + AI(Build Spec·구현·검증).

## 2026-07-14 · 5g-h Orthopedics Ward 구현 (v15) — 병동 3종 완결
- **결정:** 정형외과 병동을 v15 핸드오프에서 1:1 구현. 28×52, floorTheme 'ortho'(bone), 5구역(PT 연계 통로/석고실·소처치 → 간호 스테이션·보조기 베이 → 4인 골절/견인 병실(커튼) → 1인 고령 고관절 골절실). 신규 `orthoEquipment.tsx` 11종(TractionFrame·CPMMachine·PlasterTrapSink·CastCutter·CastRollShelf·BraceRack·AbductionPillow·ElevatedToiletGuard·BedAlarm·PACSViewer·CMSChart) + `OrthoObjectView`. surg2 `Walker`를 이번에 `surgEquipment`에 추가(외과 render 미사용이라 미구현이었음). ward2/surg2/shared/OR/ER 대거 재사용.
- **해소된 질문:** Q1 진입=엘리베이터 타워 **6F**(기존 "정형외과 병동" 라벨) → 타워 병동 3개 완비(8F 내과·7F 외과·6F 정형), entry {1,15} · Q2 시나리오=라벨만 · Q3 Walker surg2 추가.
- **검증:** tsc 0 · jest 88/88(ortho 6) · 시뮬레이터 전 구역(PT통로·석고실·스테이션·견인병실·고관절실) 렌더 확인.
- **편차:** scale 0.9 · IBed label 생략 · SVG text→shape · BedAlarm 점멸 정적 · deptCode 8F→엘리베이터 6F(라벨 정합) · 시나리오 라벨만.
- **결정자:** 사용자("외과 병동 확인 후 일치 시 정형 바로 시작") + AI(외과 5방 전수 검증(일치)·정형 Build Spec·구현·검증).
- **비고:** 입원 병동 3종(5g-f/g/h) 동일 골격(28×52·좌측 문·서비스→스테이션→4인실→특수실)에 부서 카탈로그만 교체.

## 2026-07-15 · 5g-i Dermatology Center 구현 (v15) — 5g 부서 9종 완결
- **결정:** 피부과 센터를 v15 핸드오프에서 1:1 구현. 28×52, floorTheme 'derm'(rose), **상단 캠퍼스 문**, 5구역(로비·접수·대기 → 제1/제2 진료실 → 광선 치료실 → 소수술·레이저 처치실). 신규 `dermEquipment.tsx` 11종(Dermatoscope·WoodsLamp·UVBooth·HandUVBox·GoggleSanitizer·BiopsyKit·BiopsyBottle·CryoTank·CO2Laser·LesionChart·SkinAnatomy) + `DermObjectView`. clinicReception(pharma)/sofa/coffeetable/walltv/watercooler/surgicallight/dressing/shared 재사용.
- **해소된 질문:** Q1 진입=엘리베이터 타워 **2F를 경량 CLINIC-IM에서 INT-DERM 정식 인테리어로 교체**(외래 클리닉 엔진 v8 redundant), 상단 문 entry {14,1} · Q2 시나리오=라벨만.
- **검증:** tsc 0 · jest 94/94(dermcenter 6) · 시뮬레이터 전 구역(로비·진료실1/2·광선치료실·레이저 처치실) 렌더 확인.
- **편차:** scale 0.9 · IBed label 생략 · SVG text→shape · 2F 클리닉엔진→정식 인테리어 교체(내과/외과 외래 후속) · 시나리오 라벨만.
- **결정자:** 사용자("나머지 5g 파빌리온 진행") + AI(Build Spec·구현·검증).
- **마일스톤:** **5g 부서 마스터블루프린트 9종 전부 구현 완료**(ER·OR·ICU·Peds·Pharmacy·내과병동·외과병동·정형병동·피부과센터).

## 2026-07-18 · v16 핸드오프 반영 + 5g-j Infusion 구현 (v16, Phase 1 착수)
- **결정 A (기존 부서 v16 압축):** design-handoff_v16을 SoT로 승격. 병동 3종(내과/외과 rows 52→46, 정형 52→44)·피부과(52→50) 압축, 하단 특수실 −4 상향·room4 h16→11·커튼 h11→6, surg/ortho 소파·의자·화분·변기가드 재배치, orthoEquipment PlasterTrapSink·surgEquipment NGSuction 접지 그림자 정정. jest 94/94·tsc 0·시뮬레이터 4부서 확인.
- **결정 B (신규 20종 계획):** v16 신규 인테리어 20종을 엘리베이터 4개 건물(WOMEN·DX·ONCO·ADMIN) 빈 층에 매핑, 5-Phase 순서 수립([departments/v16-new-departments-plan.md](02-construction/departments/v16-new-departments-plan.md)). Phase 1=재사용 quick-win(infusion·nursery·womenkids-opd).
- **결정 C (5g-j Infusion 구현):** 외래 주사센터를 v16 핸드오프 1:1 구현. 28×40, floorTheme `clinical`, 좌측 엘리베이터 문, 5구역(접수·조제전달 → 오픈 주입 베이(리클라이너×8+스마트펌프×8) → 격리 주입실(과민반응) → 다과 + 간호 스테이션). **전용 objects2 부재** → onco2 3종(InfusionChair·SmartInfusionPump·PPEStation) + icu CoffeeMachine 1종만 신규 `infusionEquipment.tsx`로 포팅, 나머지(pneumatictube·medfridge·handsanitizer·crashcart·compcart·watercooler·coffeetable·nursestation·deskphone·ireception·icabinet·imonitor·ichair·iplant) 재사용.
- **해소된 질문:** Q1 진입=엘리베이터 **DX 3F**(외래 주사센터 선두 배선, entry {1,6}); 3F 인공신장실 병존 → Dialysis 구현 시 층당 sub-선택 도입 · Q2 objects2 부재=onco2/icu 재사용 · Q3 시나리오 라벨만 · 착수순서=사용자 선택 "Phase 1 재사용 quick-win".
- **검증:** tsc 0 · jest 100/100(infusion 6) · 시뮬레이터 5구역(접수·베이·격리·다과·스테이션) 렌더 확인.
- **환경:** Expo Go `exp://` 딥링크로 검증(네이티브 dev client `forin://`는 iOS26 열기확인창+osascript 차단으로 불가). 데브클라이언트 재빌드로 MessageQueue 부팅 실패 해소.
- **편차:** scale 0.9 · InfusionChair footprint 2×2(휠체어 통로) · SVG text(☕)→shape · 3F 라벨 순서 변경 · 시나리오 라벨만.
- **결정자:** 사용자("이어서 해줘" + 착수순서 Phase 1 선택) + AI(v16 diff 반영·계획·Build Spec·구현·검증).

## 2026-07-18 · 5g-k Nursery 구현 (v16, Phase 1 계속)
- **결정:** 신생아실을 v16 핸드오프 1:1 구현. 28×42, floorTheme `peds`, 좌측 엘리베이터 문, 5구역(손위생·가운 → 배시넷 존(배시넷×10) → 신생아 사정·워머 → 수유실 + 면회 관람창). NICU(중환자)와 구분. **전용 objects2 부재** → ld2 4종(Bassinet·InfantWarmer·NursingRecliner·WarmerCabinet) + psych2 ObsWindow 1종만 신규 `nurseryEquipment.tsx`로 포팅, 나머지(sinkor·scrubdispenser·gownbox·babyscale·phototherapy·milkfridge·compcart·sofa·coffeetable·icurtain·ireception·ichair·iplant) 재사용.
- **핸드오프 버그 보정:** admit(사정 워머)·viewing(관람창)이 핸드오프에서 **개구부 없이 완전 봉인**(x18·x13 divider 전벽) → 도달 불가. 임상 동선에 맞춰 **doorway 2개 신설**(nursery↔admit th{18,17} · feeding↔viewing th{13,34}). 봉인 유지는 명백한 버그이므로 reachability 원칙 우선.
- **해소된 질문:** Q1 진입=엘리베이터 **WOMEN 3F**(신생아실 선두 배선, entry {1,6}); L&D·산후 병존 → Phase 2 구현 시 sub-선택 · Q2 objects2 부재=ld2/psych2 재사용 · Q3 봉인방=doorway 신설 · Q4 시나리오 라벨만.
- **검증:** tsc 0 · jest 106/106(nursery 6) · 시뮬레이터 5구역(입구·배시넷·워머·수유·관람창, ObsWindow 렌더) 확인.
- **편차:** scale 0.9 · doorway 2개 추가 · Bassinet/InfantWarmer/NursingRecliner footprint 2×2 · 3F 라벨 순서 변경 · 시나리오 라벨만.
- **결정자:** 사용자("이어서 해줘"·Phase 1 quick-win) + AI(Build Spec·구현·봉인방 진단/보정·검증).

## 2026-07-18 · 5g-l Women & Kids OPD 구현 (v16, Phase 1 완결)
- **결정:** 소아·산부인과 외래 + 키즈광장을 v16 핸드오프 1:1 구현. 28×40, floorTheme `peds`, 상단 캠퍼스 문, 5구역(로비·접수·계측 → 키즈 놀이광장 → 소아청소년과 외래 → 산부인과 외래 + 초음파실). 신규 오브젝트 **FetalMonitor 1종**(ld2)만 포팅, 나머지(clinicReception·ultrasound·babyscale·stadiometer·tonguejar·stickerroll·smallslide·rockinghorse·toychest·blocks·mural·playmat·watercooler·ibed·ireception·ichair·imonitor·iplant) 재사용.
- **peds 1F 교체:** 사용자 지시("핸드오프상 peds를 대체하는 게 womenkids-opd면 대체"). v16 핸드오프가 monolithic peds 센터(외래+병동+NICU)를 **층별 분리**(interior-peds.jsx 34×48 = OPD+ward+NICU → v16: OPD=1F womenkids-opd·병동=2F·NICU=4F). 엘리베이터 WOMEN 1F를 `INT-PEDS-00001`→`INT-WOMENKIDS-OPD-00001`로 교체(entry {13,1}). `INT-PEDS`는 FIXTURES 잔존 — 병동/NICU가 Phase 2에서 2F/4F로 정식화될 때까지 딥링크 접근. 피부과 2F 교체 선례.
- **해소된 질문:** Q1 peds 교체=사용자 지시로 1F 정식 교체 · Q2 신규=FetalMonitor 1종만 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 112/112(womenkids 6) · 시뮬레이터 5구역(로비·놀이·소아외래·산부인과·초음파, FetalMonitor 렌더) 확인.
- **마일스톤:** **v16 Phase 1(재사용 quick-win) 3종 전부 완료**(infusion·nursery·womenkids-opd). 재사용 파이프라인 검증 — 신규 부서당 신규 오브젝트 1~5종만 포팅, 나머지 기존 카탈로그 재사용으로 성립.
- **편차:** scale 0.9 · SVG text→shape · FetalMonitor footprint 2×2 · WOMEN 1F peds→womenkids-opd 교체(peds ward/NICU는 Phase 2 복원) · 시나리오 라벨만.
- **결정자:** 사용자(peds 교체 지시) + AI(peds↔womenkids-opd 핸드오프 관계 분석·Build Spec·구현·검증).

## 2026-07-18 · 5g-m L&D 구현 (v16, Phase 2 착수 · WOMEN 3F 통합)
- **결정:** 가족 분만실 L&D를 v16 핸드오프 1:1 구현. 28×50, floorTheme `peds`, 좌측 엘리베이터 문, **6구역 통합**(OB 분류 · 무통 준비 · 중앙 스테이션 · LDR 분만실×2 + 신생아 워머 · 산후 모아동실 · 유리 신생아실). ld2 잔여 2종(BirthingBed·DeliveryCart)만 신규 `ldEquipment.tsx`로 포팅, 나머지 ld2(Bassinet·InfantWarmer·NursingRecliner·WarmerCabinet·FetalMonitor)는 nursery/womenkids 카탈로그 재사용 + er/ward/shared 재사용.
- **3F 통합 판단:** `interior-ld.jsx`가 3F 전체 산과 층을 한 인테리어로 통합(L&D+산후+신생아) → 엘리베이터 3F 라벨과 정확히 일치. Phase 1에서 임시로 3F에 걸었던 `INT-NURSERY-00001`을 **`INT-LD-00001`로 교체**. standalone nursery(+미구현 postpartum)는 ld 존이 subsume → FIXTURES/딥링크로만 잔존.
- **해소된 질문:** Q1 3F=INT-LD 통합 배선(nursery 교체) · Q2 postpartum/nursery 중복=ld가 통합 포함 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 118/118(ld 6) · 시뮬레이터 6구역(분류·마취·스테이션·LDR·산후·신생아, BirthingBed/DeliveryCart 렌더) 확인.
- **편차:** scale 0.9 · BirthingBed footprint 3×2·DeliveryCart 2×1 · 3F INT-NURSERY→INT-LD 교체 · standalone postpartum 미배선 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 2 계속 진행") + AI(ld.jsx 통합 구조 분석·Build Spec·구현·검증).

## 2026-07-18 · 5g-n NICU + 5g-o PICU 구현 (v16, Phase 2 완결 · WOMEN 4F)
- **결정:** NICU·PICU를 v16 핸드오프 1:1 구현. 둘 다 28×44, floorTheme `peds`, 좌측 엘리베이터 문, **저조도 tint**.
  - **NICU**(INT-NICU-00001, 5구역): 전실 스크럽 게이트 → 중앙 모니터 스테이션 · 소생 베이 → A/B 포드(유리 분리). nicu2 4종(NICUIsolette·GiraffeWarmer·CPAPUnit·PhototherapyLED) 신규 `nicuEquipment.tsx`.
  - **PICU**(INT-PICU-00001, 5구역): 전실 → 중앙 허브 → 유리벽 격실 3(vent·진정/집중감시/가족상주). picu2 3종(PICUBed·PedVentilator·BroselowCart) + hospice2 ReclinerDaybed 신규 `picuEquipment.tsx`. 유리 전면 + 슬라이딩 도어.
- **층당 복수부서 미해결:** WOMEN 4F=NICU+PICU. **NICU만 4F 정식 배선**(entry {1,6}), **PICU는 FIXTURES/딥링크**(정식 배선은 층당 sub-dept 선택 UI 필요 — 사용자 결정 대기). 동일 이슈: DX 3F(infusion+dialysis), ONCO 4F(hospice+geri).
- **해소된 질문:** Q1 4F=NICU 선두 배선·PICU 딥링크 · Q2 ReclinerDaybed=hospice2 차용 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 130/130(nicu 6·picu 6) · 시뮬레이터(NICU A포드 인큐베이터·소생 베이 기린워머 / PICU 베드·vent·broselow·유리) 확인.
- **마일스톤:** **v16 Phase 2(WOMEN 건물) 완결** — ld(3F 통합)·nicu(4F)·picu. 여성소아 센터 1F(OPD)·3F(L&D)·4F(NICU) 정식 배선 + PICU 딥링크. (2F 소아 일반 병동은 기존 peds ward가 후속 정식화 대기.)
- **편차:** scale 0.9 · SVG text→shape · 저조도 tint · 신규 footprint props{w,h} · PICU 4F 미배선(딥링크) · ReclinerDaybed hospice2 차용 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 2 계속 진행") + AI(Build Spec·구현·검증·복수부서 이슈 문서화).

## 2026-07-18 · 엘리베이터 층당 복수부서 sub-선택 UI
- **결정:** `ElevatorScreen`의 `ElevFloor`에 `rooms?: {dept, interior?, entry?}[]` 추가. 층 선택 시 해당 층에 `rooms`가 있으면 부서 sub-picker(칩 행)를 노출, 선택한 방의 interior/entry로 라이드. 미구현 방은 `준비 중` 표시(라이드 시 기존 준비중 alert). GO 바 라벨에 선택 부서명 표기.
- **적용:** WOMEN 4F=[NICU(INT-NICU), PICU(INT-PICU)] → **PICU 정식 엘리베이터 접근**. DX 3F=[외래 주사센터(INT-INFUSION), 인공신장실(준비 중)]. 향후 복수부서 층(ONCO 4F hospice+geri 등)은 `rooms[]`로 추가만 하면 자동 지원.
- **근거:** 층당 인테리어 1슬롯 한계로 두 번째 부서가 딥링크로만 접근되던 문제 해소. 사용자 "지금 만들기" 선택.
- **검증:** tsc 0 · jest 130/130 · 시뮬레이터 엘리베이터(WOMEN 4F 두 부서 표기·GO 라벨) 확인. sub-picker 탭 상호작용은 osascript 접근성 차단으로 육안 탭검증 불가(조건부 렌더·상태 로직은 tsc/구조로 검증).
- **결정자:** 사용자("지금 만들기") + AI(rooms[] 모델·sub-picker·ride 해소 구현).

## 2026-07-18 · 5g-p Radiology 구현 (v16, Phase 3 착수 · DX 1F)
- **결정:** 영상의학과를 v16 핸드오프 1:1 구현. 28×48, floorTheme `clinical`, 좌측 엘리베이터 문, 6구역(접수·대기 + 저조도 PACS 판독실 → 중앙 복도 → CT·MRI 촬영실(각 유리 제어 부스) → X-ray 촬영실). rad2 5종(CTScanner·MRIScanner·XrayUnit·ControlConsole·LeadApronRack) 신규 `radEquipment.tsx`; pacsviewer(ortho)·waitingdisplay/vitals(er)·handrail(ward)·shared 재사용.
- **해소된 질문:** Q1 진입=DX 1F(lobby) 단일 배선(진단검사/혈액은행 후속 rooms[] 전환 여지) · Q2 시나리오 라벨만.
- **검증:** tsc 0 · jest 136/136(rad 6) · 시뮬레이터 CT(도넛 갠트리·제어콘솔·유리부스)·MRI(대형 보어·납방호복) 화면단위 대조 확인.
- **편차:** scale 0.9 · SVG text(MAGNET ON)→shape · 스캐너 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 3 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-q Endoscopy 구현 (v16, Phase 3 · DX 4F)
- **결정:** 내시경실을 v16 핸드오프 1:1 구현. 28×44, floorTheme `clinical`, 좌측 엘리베이터 문, 5구역(접수·대기 → 전처치·회복 베이 · 세척·재처리실 AER → 시술실 1 상부·2 대장). endo2 4종(EndoTower·ScopeWasher·ScopeCabinet·ProcedureBed) 신규 `endoEquipment.tsx`; oxygen/suction(er)·sinkor·wastebin·shared 재사용.
- **해소된 질문:** Q1 진입=DX 4F 단일 배선(Cath/IR 후속) · Q2 시나리오 라벨만.
- **검증:** tsc 0 · jest 142/142(endo 6) · 시뮬레이터 시술실1(EndoTower 점막모니터·ProcedureBed)·재처리실(ScopeWasher·ScopeCabinet·biohazard) 화면단위 대조 확인.
- **편차:** scale 0.9 · SVG text(CO₂)→shape · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 3 계속 진행") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-r Hemodialysis 구현 (v16, Phase 3 · DX 3F sub-선택)
- **결정:** 인공신장실을 v16 핸드오프 1:1 구현. 28×44, floorTheme `clinical`, 좌측 엘리베이터 문, 4구역(접수·체중 측정 → 오픈 투석 치료실(체어+투석기 6스테이션, 중앙 간호 아일랜드) → RO 수처리실 · 격리 투석 스테이션). dial2 3종(DialysisMachine·DialysisChair·ROWaterUnit) 신규 `dialEquipment.tsx`; nursestation·compcart·sinkor·stadiometer·wastebin·shared 재사용.
- **엘리베이터:** DX 3F sub-picker의 두 번째 방(인공신장실)을 준비 중 → **INT-DIAL로 정식 배선**(외래 주사센터와 3F 공유). sub-선택 UI 실사용 첫 정식 케이스.
- **해소된 질문:** Q1 진입=DX 3F sub-선택 배선 · Q2 시나리오 라벨만.
- **검증:** tsc 0 · jest 148/148(dial 6) · 시뮬레이터 투석 치료실(체어+투석기)·RO 수처리실(트윈 멤브레인) 화면단위 대조 확인.
- **편차:** scale 0.9 · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 3 계속 진행") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-s Specialty OPD 구현 (v16, Phase 3 완결 · DX 2F)
- **결정:** 전문 외래(안과·이비인후과·비뇨·신경과)를 v16 핸드오프 1:1 구현. 28×44, floorTheme `clinical`, 좌측 엘리베이터 문, 5구역(통합 접수 → 안과·이비인후과 → 비뇨·신경과). eye2 4종(SlitLamp·PhoropterStand·ENTTowerChair·VisionChart) 신규 `specialtyEquipment.tsx`(objects2 부서명 불일치=eye2); otoscope(er)·clinicReception/ultrasound(clinic)·waitingdisplay/compcart·shared 재사용.
- **해소된 질문:** Q1 진입=DX 2F 단일 배선(4과 통합) · Q2 objects2=eye2 확인 후 포팅 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 154/154(specialty 6) · 시뮬레이터 안과(SlitLamp·PhoropterStand·VisionChart)·ENT(ENTTowerChair·Otoscope) 화면단위 대조 확인.
- **마일스톤:** **v16 Phase 3(DX 진단동) 완결** — rad(1F)·specialty(2F)·dial(3F sub)·endo(4F). 진단동 4개 층 전부 정식 엘리베이터 배선.
- **편차:** scale 0.9 · VisionChart text→shape · ultrasound footprint props 부여 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 3 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-t Oncology/BMT 구현 (v16, Phase 4 착수 · ONCO 3F)
- **결정:** 종양학·BMT를 v16 핸드오프 1:1 구현. 28×50, floorTheme `internal`, 좌측 엘리베이터 문, 6구역(약물 조제 확인·상담실 → 중앙 스테이션 → 개방형 항암 주입 베이 → BMT 전실·양압 무균 이식실 2). onco2 잔여 2종(BMTPod·ChemoHazardBin) + Fridge(peds) 신규 `oncoEquipment.tsx`; infusionchair/smartinfusionpump/ppestation(infusion)·warmercabinet(nursery)·er/ward/shared 대거 재사용.
- **봉인 방 보정(핸드오프 버그):** ① 전실 진입 Th가 x8(ante\|bmt 경계 열)에 있어 anteroom 봉인 → x4로 이동. ② BMT 이식실 2 유리 완전 봉인 → room1↔room2 sterile 도어(y43) 신설. reachability 원칙.
- **해소된 질문:** Q1 진입=ONCO 3F 단일 배선 · Q2 봉인 방=게이트 이동+도어 신설 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 160/160(onco 6) · 시뮬레이터 주입 베이·BMT 이식실(HEPA 헤더·유리 격리)·조제확인(Fridge·ChemoHazardBin) 화면단위 대조 확인.
- **편차:** scale 0.9 · SVG text(HEPA/CHEMO/VAX)→shape · 봉인 방 2건 도달성 보정 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·봉인방 진단/보정·검증).

## 2026-07-18 · 5g-u Hospice/Palliative 구현 (v16, Phase 4 · ONCO 4F sub-선택)
- **결정:** 완화의료·호스피스를 v16 핸드오프 1:1 구현. 28×44, floorTheme `peds`(가정형 따뜻한 톤), 좌측 엘리베이터 문, 5구역(가족 라운지·키친 → 완화 케어 스테이션·명상/추모실 → 가정형 1인 완화 병실 A·정원뷰 선룸 병실 B). hospice2 3종(HospiceBed·ComfortCart·SyringeDriver) + ADLKitchen(rehab2) 신규 `hospiceEquipment.tsx`; ReclinerDaybed(picu)·Fridge(onco)·er/shared 재사용.
- **엘리베이터:** ONCO 4F sub-picker 첫 번째 방을 INT-HOSPICE로 배선(노인성 질환 병동=geri는 준비 중, 다음). 임상 병동이 아닌 존엄 케어 공간(명상실·정원 선룸 저조도 tint).
- **해소된 질문:** Q1 진입=ONCO 4F sub-선택 · Q2 ADLKitchen=rehab2 공유 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 166/166(hospice 6) · 시뮬레이터 완화 병실 A(HospiceBed·SyringeDriver·ReclinerDaybed)·가족 라운지(ADLKitchen·Fridge)·명상실 화면단위 대조 확인.
- **편차:** scale 0.9 · 신규 footprint props · ONCO 4F sub-선택 배선 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-v Geriatric/Dementia 구현 (v16, Phase 4 · ONCO 4F sub-선택)
- **결정:** 치매·노인성 질환 병동을 v16 핸드오프 1:1 구현. 28×44, floorTheme `peds`, 좌측 엘리베이터 문, 5구역(데이 커먼 배회 안전존 → 노인 간호 스테이션·회상 라운지 → 치매 병실 A·B). geri2 5종(LowBed·MemoryBox·OrientationBoard·GeriReclineChair·HandrailWall) 신규 `geriEquipment.tsx`; ComfortCart(hospice)·er/shared 재사용.
- **엘리베이터:** ONCO 4F sub-picker 두 번째 방을 INT-GERI로 배선(hospice와 4F 공유) → **ONCO 건물 완비**(3F onco·4F hospice+geri·1F/2F rehab/psych 예정).
- **해소된 질문:** Q1 진입=ONCO 4F sub-선택 · Q2 시나리오 라벨만.
- **검증:** tsc 0 · jest 172/172(geri 6) · 시뮬레이터 데이 커먼(HandrailWall·OrientationBoard·GeriReclineChair)·치매 병실 A(LowBed) 화면단위 대조 확인.
- **편차:** scale 0.9 · OrientationBoard text→shape · 신규 footprint props(벽 부착 3종 비충돌) · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-w Inpatient Psych 구현 (v16, Phase 4 · ONCO 2F)
- **결정:** 정신과 폐쇄병동을 v16 핸드오프 1:1 구현. 28×44, floorTheme `internal`, 좌측 엘리베이터 문, 5구역(이중 통제문·소지품 보관 → 관찰 간호 스테이션·데이룸 → 안전 병실·패딩 안정실). psych2 3종(SafeBed·SeclusionPad·GroupTable) 신규 `psychEquipment.tsx`; ObsWindow(nursery)·MetalDetector(er 'detector')·shared 재사용.
- **관찰창 동선:** station|dayroom x13 divider에 ObsWindow(y12) + 상하 통행 gap(y11/y13). 관찰창은 장식(비충돌), 개구부가 실제 스테이션↔데이룸 동선.
- **해소된 질문:** Q1 진입=ONCO 2F 단일 배선(정신과 외래 후속) · Q2 관찰창=창+gap · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 178/178(psych 6) · 시뮬레이터 안전 병실(SafeBed×4)·안정실(SeclusionPad·ObsWindow·CCTV) 화면단위 대조 확인.
- **편차:** scale 0.9 · 신규 footprint props(seclusionpad 비충돌) · 관찰 gap · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-x Rehabilitation 구현 (v16, Phase 4 완결 · ONCO 1F)
- **결정:** 대형 재활치료실 PT/OT Gym을 v16 핸드오프 1:1 구현. 28×44, floorTheme `peds`, 좌측 엘리베이터 문, **하나의 개방형 gym** 5구역(재활 접수·평가 → 보행 훈련존·매트 치료존 → 유산소·근력 존·OT ADL 훈련). rehab2 5종(ParallelBars·TherapyMat·Treadmill·ShoulderPulley·GymBallRack) 신규 `rehabEquipment.tsx`; ADLKitchen(hospice)·WalkerRack(surg)·shared 재사용.
- **개방형 gym 보정:** gait|mat 세로벽(h8)이 y26 lower-gym threshold와 1칸 겹쳐 → h7로 트림(도달성).
- **해소된 질문:** Q1 진입=ONCO 1F 단일 배선 · Q2 개방형 gym 구획 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 184/184(rehab 6) · 시뮬레이터 보행 훈련존(ParallelBars·Treadmill·WalkerRack)·OT ADL(ADLKitchen·GymBallRack) 화면단위 대조 확인.
- **마일스톤:** **v16 Phase 4(ONCO 암센터) 완결** — onco(3F)·hospice+geri(4F sub)·psych(2F)·rehab(1F). ONCO 4개 층 전부 정식 배선. 메인 타워·여성소아·외래진단·암센터 4개 건물 완비.
- **편차:** scale 0.9 · 신규 footprint props · gait|mat 세로벽 트림 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-y Sim Lab / Nursing Admin 구현 (v16, Phase 5 착수 · ADMIN 3F)
- **결정:** 간호부·감염관리·시뮬레이션 랩을 v16 핸드오프 1:1 구현. 28×42, floorTheme `clinical`, 좌측 엘리베이터 문, 5구역(간호부 총괄 사무실 → 감염관리실·디브리핑 강의실 → 시뮬레이션 랩·원웨이 미러 제어실). sim2 4종(SimManikin·ControlBooth·OfficeDesk·PPEBoard) 신규 `simEquipment.tsx`; shared/er/or/icu 재사용.
- **봉인 제어실 보정:** 제어실이 원웨이 미러 벽(x18)+y24 벽으로 완전 봉인 → x18 벽에 staff 도어(y37) 신설. reachability 원칙.
- **해소된 질문:** Q1 진입=ADMIN 3F 단일 배선 · Q2 봉인 제어실=staff 도어 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 190/190(sim 6) · 시뮬레이터 시뮬랩(SimManikin·크래시카트)·간호부(OfficeDesk×3)·감염관리(PPEBoard) 화면단위 대조 확인.
- **편차:** scale 0.9 · PPEBoard text→shape · 제어실 staff 도어 신설 · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 5 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·봉인방 보정·검증).

## 2026-07-18 · 5g-z Staff Lounge/Locker/Cafeteria 구현 (v16, Phase 5 · ADMIN 2F)
- **결정:** 직원 락커룸·의료진 휴게실·식당을 v16 핸드오프 1:1 구현. 28×40, floorTheme `clinical`, 좌측 엘리베이터 문, 4구역(락커룸 A·B → 의료진 휴게실 · 직원 식당). lounge2 4종(LockerBank·Vending·DiningTable·ServeryCounter) 신규 `loungeEquipment.tsx`; coffeemachine(infusion)·nursingrecliner(nursery)·sink·shared 재사용.
- **단절 보정(핸드오프 버그):** lockerA|B(x13)·lounge|cafe(x13) 세로벽 전벽 봉쇄로 엘리베이터 쪽(A+lounge)과 반대쪽(B+cafe)이 단절 → lounge↔cafe 도어(y27) 신설로 전체 순환.
- **해소된 질문:** Q1 진입=ADMIN 2F 단일 배선 · Q2 단절=lounge↔cafe 도어 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 196/196(lounge 6) · 시뮬레이터 락커룸(LockerBank)·휴게실(Vending)·식당(DiningTable) 화면단위 대조 확인.
- **편차:** scale 0.9 · lounge↔cafe 도어 신설 · ServeryCounter footprint 부여 · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 5 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·단절 보정·검증).

## 2026-07-18 · 5g-aa SPD/Nutrition/Dock 구현 (v16, Phase 5 · ADMIN 1F)
- **결정:** 중앙공급실·영양팀·하역장을 v16 핸드오프 1:1 구현. **30×44 와이드**, floorTheme `pharma`, 좌측 엘리베이터 문 + 우측 하역장 롤업 게이트, 4구역(오염 세척 Decon → 세척→멸균 pass-through → 멸균·보관 → 영양팀 배식실 → 화물 하역장). spd2 6종(Autoclave·SterileRack·WasherDisinfector·FoodCartColumn·PalletStack·CargoTruck) 신규 `spdEquipment.tsx`; adlkitchen(hospice)·fridge(onco)·medcart/floortape/shelflabel(pharma)·soiledcart(or)·shared 재사용.
- **해소된 질문:** Q1 진입=ADMIN 1F 단일 배선 · Q2 30-와이드 산업 라인(세척→멸균 sterile pass-through·우측 하역 게이트) · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 202/202(spd 6) · 시뮬레이터 멸균(Autoclave×2·SterileRack)·배식(FoodCartColumn)·하역장(PalletStack·FloorTape 안전선) 화면단위 대조 확인.
- **편차:** scale 0.9 · cols 30 · icabinet kind→variant supply · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 5 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-ab Morgue & Autopsy 구현 (v16, Phase 5 완결 · ADMIN B1) — 🎉 **v16 전체 완결**
- **결정:** 영안실·부검실을 v16 핸드오프 1:1 구현. 28×40, floorTheme `clinical`, 좌측 엘리베이터 문, **전면 저조도 Tint(#1E2530 op0.14)로 지하·통제 구역 무드**. 5구역(접수·인수인계 → 시신 냉장 보관실 → 부검실 → 유족 참관실 → 시설팀 기계실). morgue2 3종(CadaverFridge 다단 냉장 뱅크·AutopsyTable 천공 배수대·ViewingBier 드레이프 catafalque+백합+촛대) 신규 `morgueEquipment.tsx`; gurney(er)·autoclave(spd)·sinkor/instrumenttray(or)·shared 재사용.
- **해소된 질문:** Q1 진입=ADMIN **B1** 단일 배선(ADMIN 건물 완결: 1F spd·2F lounge·3F sim·B1 morgue) · Q2 톤=전면 저조도 Tint · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 208/208(morgue 6) · 시뮬레이터 5개 방(접수·냉장보관 CadaverFridge×3·부검실 AutopsyTable·참관실 ViewingBier·기계실 Autoclave) 화면단위 대조 확인.
- **편차:** 전면 Tint · 신규 footprint props(cadaverfridge 4×2·autopsytable 3×2·viewingbier 2×1) · icabinet variant equipment(비충돌) · 시나리오 라벨만.
- **🎉 마일스톤:** **v16 20개 신규 부서 전체(Phase 1–5) 완결.** WOMEN·DX·ONCO·ADMIN 4개 건물 모든 층 정식 배선. morgue가 마지막 부서. 다음: 시나리오(`scenarioId`) 연결·콘텐츠.
- **결정자:** 사용자("Phase 5 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 서버 스택 = Go 유지 (FastAPI/LangChain 재작성 반대)
- **질문(사용자):** AI 활용성(langchain/langgraph) 위해 서버를 파이썬 FastAPI로 바꿔야 하나?
- **결정:** **Go 유지.** 대화 엔진이 이미 Go로 완성(`conversation/{engine,strategy}.go` — 페르소나 롤플레이·스트리밍·교정 + anthropic/openai/azurespeech 어댑터). forin의 AI 요구는 단일 페르소나 롤플레이+스트리밍+교정 = Messages API 위 얇은 래퍼(API glue); 추론은 벤더에서 일어나므로 서버는 I/O·SSE 오케스트레이션 → Go가 유리. LangChain/LangGraph는 현 요구 초과(over-engineering). 재작성은 순수 손해(OIDC·pgx·redis·sqlc·헥사고날 4,800줄).
- **향후:** RAG/에이전트 그래프/파이썬 전용 ML 필요 시 **파이썬 사이드카 마이크로서비스**로 분리(Go가 호출). 재작성 아님.
- **결정자:** 사용자(질문·최종 승인) + AI(코드베이스 근거 기반 권고).

## 2026-07-18 · 시나리오 런타임 착수 — 브리핑→AI 다이얼로그 (ER 파일럿 버티컬 슬라이스)
- **결정:** 퀘스트 핫스팟 → 실제 시나리오 → AI 페르소나 대화 런타임. 착수전략 **버티컬 슬라이스**(ER `SCN-ER-00002` 1개 A→B→C 관통), 화면 **핸드오프 1:1 포팅**.
- **A 서버:** `content.Scenario`에 optional `Briefing`(dept·brief·difficulty·timeLabel·skills·rewards·reqs·tone) + `Persona` 표시필드(sub·hair·hairStyle). 마이그레이션 `000009_scenario_briefing`(briefing jsonb). sqlc 생성코드 수동 편집(CLI 부재). `SCN-ER-00002.yaml` 저작 + 로드 회귀 테스트.
- **B 모바일:** `api/client.ts` scenario/startConversation/sendMessage/sendMessageStream(XHR SSE 파서).
- **C 화면:** `scenario/[id].tsx`(브리핑, 스텁 교체) + `dialogue/[id].tsx`(신규). RoleFace·PixelButton·tokens 재사용.
- **ID 컨벤션:** 서버 검증기 `^[A-Z]+(-[A-Z]+)*-\d{5,}$` 강제 → v16 케밥 폐기, 서버 `SCN-*` 채택(인테리어 `INT-*`와 동일). ER 핫스팟 `o-tri-recep` → `SCN-ER-00002`.
- **검증(실 스택 E2E):** DB seed→`GET /scenarios/SCN-ER-00002`(briefing 왕복)→devtoken(실 user UUID)→`POST conversation`→`message`(NPC 페르소나 응답)→`stream`(SSE 형식 = 모바일 파서). 시뮬레이터: 브리핑 실데이터 렌더, 대화 세션오픈+오프닝 렌더(임시 devtoken 주입 후 원복). go test·tsc 0·jest 208/208.
- **후속:** 힌트모드·마이크 STT·발음 채점·결과화면·미니퀴즈·나머지 시나리오 저작·`scenarios.ts` Dept 20부서 확장·dev-login.
- **결정자:** 사용자("Go 유지하고 시나리오 연결 착수") + AI(Build Spec·구현·검증).

## 2026-07-19 · 힌트모드 + dev-login (인증 우회, ENV=dev 게이트)
- **힌트모드:** 대화 화면 💡 힌트 토글 → scenario.keyPhrases를 추천 답변 ChoiceRow로(1번 ★AI추천). 탭하면 입력창 채움. 핸드오프 screens-dialogue hint 1:1. 시뮬레이터 렌더 확인.
- **dev-login(문제 해결):** 임시 devtoken 원복 후 앱에 유효 세션이 없어 대화가 401. 매번 수동 토큰 주입 대신 **서버 `POST /auth/dev`**(provider 검증 없이 고정 dev 유저 upsert+토큰 발급)를 **`ENV=dev`일 때만 라우트 등록**(prod 미등록). 모바일 `api.devLogin()`+로그인 화면 "🛠 개발자 로그인" 버튼이 실 토큰 저장(setSession+secureStore). 기존 가짜 `authStore.devLogin`('dev' 문자열→401 유발) 제거.
- **보안:** dev-login은 비프로덕션 전용(라우트가 prod에 없음). 로컬 개발에서 OIDC 없이 인증 플로우(대화·퀴즈·발음) 검증 가능.
- **검증:** `POST /auth/dev`→실 토큰→conversation/message 페르소나 응답 OK. tsc 0·go build 0. 로그인 화면 dev 버튼 렌더 확인.
- **결정자:** 사용자("api 에러가 났어, 이어서") + AI(원인 진단·dev-login 구축).

## 2026-07-19 · 미니퀴즈 — sentence_build (문장완성) 버티컬 슬라이스
- **결정:** 서버에 quiz 조회 경로가 전무 → 전체 구축. `content.Quiz`에 optional `QuizContent`(sub·zone·context·hint·template(`__` 빈칸)·answers·wordBank). 마이그레이션 `000010_quiz_content`(content jsonb). sqlc 수동편집(GetQuiz 신규 + InsertQuiz). `ContentReader.GetQuiz` + `GET /quizzes/{id}`(public). `QZ-ER-00001` 문장완성 저작. scn-er-00002에 quiz step(QZ-ER-00001) 추가(기존 steps jsonb 활용, 신규 필드 없음).
- **모바일:** `api.quiz()` + `ScenarioDetail.steps`/`QuizDetail` 타입 · `useQuizData` 훅 · `quiz/[id].tsx`(핸드오프 ScreenQuizSentence 1:1: CONTEXT·슬롯 문장·단어카드 탭 채우기·제출·정오답). 대화 화면 action rail에 quiz step 있으면 "📝" 버튼→quiz.
- **범위:** 6종 중 sentence_build 1종만(가장 관련·자족적). match_pairs·vitals·listen·sbar·triage는 후속(동일 패턴 확장).
- **검증:** go test(로더: template/answers/wordBank·answer⊆wordBank)·jest 208/208·tsc 0. `GET /quizzes/QZ-ER-00001` 콘텐츠 왕복 OK. 시뮬레이터 문장완성 화면 렌더(슬롯·단어카드 shuffle·CONTEXT) 확인.
- **결정자:** 사용자("순서대로 작업, 너가 하고싶은대로") + AI(구축·검증).

## 2026-07-19 · 세션 부트스트랩(반복 401 해결) + 발음 채점(클라이언트)
- **반복 401 근본원인:** `restoreSession`이 진입 게이트(index.tsx)에서만 실행 → 대화 화면 딥링크/Fast-Refresh 리로드 시 in-memory 세션 소실, secureStore 토큰이 있어도 복원 안 됨. **루트 `_layout`으로 이동 + `bootstrapSession`**(복원 실패 시 __DEV__에서 auto devSignIn). 검증: 대화 딥링크 conversation 200(이전 401).
- **발음 채점:** expo-audio(16kHz mono PCM WAV) 녹음 → base64(expo-file-system/legacy) → `POST /pronunciation`(기존) → 점수. `PronunciationScore`(recognized·4개 바·단어칩) + `PronunciationPractice`(녹음→채점, 힌트 패널의 추천 문장 발음 연습). `api.assessPronunciation`.
- **⚠️ 외부 블로커:** (1) **서버 `AZURE_SPEECH_KEY`가 401**(무효/만료) — 라이브 채점 불가, 유효 키 필요. (2) iOS 시뮬레이터 마이크 없음 — 실제 녹음은 실기기/dev-build 필요. 코드는 계약대로 정확·graceful degrade. 검증: 앱 부팅(expo-audio 번들 OK)·발음 연습 UI 렌더·tsc 0·jest 208/208.
- **범위:** 발음 연습(레퍼런스 문장 채점)만. STT-as-input(자유발화→텍스트)은 후속.
- **결정자:** 사용자("api 에러가 났어, 이어서") + AI(진단·부트스트랩·발음 클라이언트 구축).

## 2026-07-19 · 결과/리워드 화면 + 시나리오 제작(ER 세트 완성)
- **결과 화면:** `result/[id]`(핸드오프 ScreenDialogueResult 1:1) — SCENARIO CLEAR·참잘했어요 스티커·REWARDS(서버 briefing.rewards)·따뜻한 메시지·리뷰랩/다음. 컨페티는 RN Animated 버스트. 퀴즈 클리어(✓ 완료)→result 연결.
- **시나리오 제작:** ER 인테리어 4개 핫스팟 전부 실 시나리오로 완성 — SCN-ER-00002(통증·Mrs.Hopkins, 기존), SCN-ER-00001(흉통·Mr.Robinson, briefing 보강), SCN-ER-00003(아나필락시스·Tyler's Mom, 신규), SCN-ER-00004(자해위험 안전사정, 신규·민감 임상콘텐츠→공감·비판단·안전 가드레일). 케밥 핫스팟 3개 → SCN-* 정렬. persona 표시필드·briefing(dept·brief·difficulty·skills·rewards·reqs)·keyPhrases·steps 완비.
- **검증:** go test(로더: 5 시나리오·briefing 왕복·무-briefing 회귀는 SCN-GEN-00003)·jest 208/208·tsc 0. `GET /scenarios/SCN-ER-000{1,3,4}` 200. 시뮬레이터 아나필락시스 briefing 실데이터 렌더 확인.
- **후속:** ER 나머지(police·paramedic·language·fever) + OR/PEDS/ICU/PHARMA + 신규 20부서 시나리오 저작. quiz 타입 확장(match_pairs 등). Azure 키·발음 실기기 검증.
- **결정자:** 사용자("순서대로 작업, 너가 하고싶은대로") + AI(구축·검증).

## 2026-07-19 · ER 시나리오 세트 완결 (8/8)
- SCN-ER-00005 경찰 인계(Officer Davis·SBAR)·00006 교통사고 핸드오프(Paramedic Ruiz·MVA)·00007 언어장벽 통역호출(Mrs.Patel·Hindi)·00008 고열 아동 부모 안심(Mrs.Kim). v16 소스 1:1(persona role police/paramedic/patient/parent·briefing·rewards·reqs·keyPhrases). ER 8개 시나리오 전부 저작 완료(총 9 시나리오 seed).
- 인테리어 핫스팟(4개)은 00001~00004에 배선됨; 00005~00008은 상황판/데일리 로테이션으로 도달(후속 배선 가능).
- 검증: go test(로더 전체 검증)·`GET /scenarios/SCN-ER-000{5,6,7,8}` 200·시뮬레이터 police briefing 렌더(경찰 초상·SBAR·보상).
- **결정자:** 사용자("ER 나머지 시나리오도 만들어줘") + AI(저작·검증).

## 2026-07-19 · OR/PEDS/ICU/PHARMA 시나리오 20종 저작
- v16 scenarios-data.jsx의 OR(5)·PEDS(5)·ICU(5)·PHARMA(5) 전부 저작. 부서별 이벤트 4개(EVT-{OR,PEDS,ICU,PHARMA}-00001, delivery daily_pool) 신설(scenario.eventId 참조 필수). 총 29 시나리오·7 이벤트 seed.
- 생성 방식: 소스에서 briefing(brief·difficulty·time·skills·rewards·reqs)·persona(name·sub) 추출 + 언어 핵심(role·mood·keyPhrases 3개·오프닝 대사 EN/KO·player 라인)은 시나리오별 수기 저작. dept 테마색(OR 보라·PEDS 파랑·ICU 청록·PHARMA 초록).
- 검증: 로더 전체 번들 검증(id·eventId 참조·enum·briefing 왕복) 통과 · seed 29 · `GET /scenarios` 스팟체크(role·mood·keyPhrases·rewards) · 시뮬레이터 OR 동의 briefing 렌더(보라 테마·콧수염 초상).
- 후속: 각 부서 인테리어 핫스팟 배선 · quiz 타입 확장.
- **결정자:** 사용자("OR/PEDS/ICU/PHARMA 시나리오도 만들어줘") + AI(저작·검증).
