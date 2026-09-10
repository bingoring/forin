# forin — Waypoint Status

**Framework:** [Waypoint](https://github.com/bingoring/waypoint)
**PRD:** [prd.md](prd.md) | [prd-tech.md](prd-tech.md)
**Design handoff:** [inputs/design-handoff_v40/](inputs/design-handoff_v40/README.md) (최신) · [v39](inputs/design-handoff_v39/README.md) · [v38](inputs/design-handoff_v38/README.md) · [v22](inputs/design-handoff_v22/README.md)
**Decisions (audit):** [DECISIONS.md](DECISIONS.md)
**Last updated:** 2026-09-09

> 🔨 **커리큘럼 v3 P2 — 부서 콘텐츠 fan-out 진행 (2026-09-09~).** 각 부서를 동일 파이프라인으로 낸다: 택소노미 설계
> (서브에이전트) → 8클러스터 병렬 저작(seed 1건당 상황 1건, 페르소나 뻥튀기 없음) → 정규화·조립 `topics/<code>.yaml`
> → `themes.yaml` 부서별 코어 4 + 심화 31 → 재생성 → audit(주제 전부 ≥20·THIN 0·dup-title 0·부서 고아 0). 부서 구조는
> 11 도메인 · 35주제 · 각 21 상황(기초 6/응용 9/위기 6) = 735. **완료(4/29)**: ER(736) · ICU(735) · OR(735) · WARD(735).
> 누적 태깅 2941 · 140주제. 부서별 코어는 `core-*-<code>`(dept 스코프)로 그 부서 트랙을 이끈다(D-P2-D). ICU는 진정·삽관
> 환자가 많아 화자를 동료·가족 위주로, OR은 intraop 특성상 동료(집도의·마취과·소독/순회) 위주로, WARD는 깨어 있는 환자
> 위주(환자 502·동료 149·가족 84)로 배분했다. WARD 저작 시 선행 무대지시 괄호 tagline 49건을 정규화했다.
> **다음(사용자 요청으로 PEDS 앞에서 일시 정지)**: PEDS → 나머지 24부서 → DB 시드 + 라이브 `/me/curriculum` 계약 전환 → P3.
>
> ✅ **커리큘럼 v3 P2 — ER 정본 콘텐츠(기함) + 파이프라인 (2026-09-09).** 파이프라인과 첫 부서 콘텐츠를 함께 냈다.
> **① 파이프라인**: `cmd/gencontent`에 seed 경로를 신설했다(`seeds.go`) — `content/nurse/topics/<code>.yaml`이
> 있으면 seed 1건당 시나리오 **1건**만 생성하고(페르소나×난이도 뻥튀기 폐지), 없으면 기존 Topic 뱅크로 폴백한다.
> 이로써 D-P2-B(주제 = 구별 상황들의 경로)·D-P2-C(페르소나는 선택 재도전)를 코드로 실현했다. **② 접근 전환(스펙 대비
> 정직한 기록)**: P2 초안은 "290 Topic 재태깅·수작업 0"이었으나, 사용자의 "구별 상황=경로" 재정의로 실제 실행은
> **대규모 신규 저작**이 됐다 — 기존 콘텐츠는 부서당 구별 상황이 ~10개뿐이라 묶기만으로는 주제당 20+가 안 나오기
> 때문이다. **③ ER 산출**: 공통 코어 4주제 + 부서 심화 31주제 = **35주제 × 각 20~23 구별 상황 = 736 상황**을
> LLM 보조 서브에이전트 8클러스터 병렬 저작 → 정규화(빈 tagline·소아 나이·collabWith 정리) → 조립했다
> (`content/nurse/topics/er.yaml`, 저작 정본). `themes.yaml`을 35주제 레지스트리로 정본화했다. **④ 검증**(`cmd/audit`):
> ER 736 전부 태깅 · 35주제 전부 ≥20(THIN 0) · **dup-title 0**(뻥튀기 중복 소멸) · **ER 고아 0**. 전체 orphan 2944는
> 나머지 28부서가 legacy 뱅크를 유지 중이라 정상(부서별 vertical slice). 빌드·themed/gencontent 테스트 그린.
 **결정 D-P2-D(부서별 코어, 2026-09-09)**: 코어 4주제(인계·언어·가족·안전)는 부서 맥락이 실재하므로(ROSC 후 ICU 인계 vs
> ER→병동 인계, ICU 임종 상담 vs 소아 보호자, ICU 번들·억제 vs 병동 낙상) **부서별로** 둔다 — `track:core` + `dept:<코드>`,
> 키 `core-<주제>-<코드>`, 낮은 order로 그 부서 트랙을 이끈다(전역 공통 주제는 두지 않되 엔진은 `dept:""`로 지원). resolve
> 그룹핑을 "주제의 dept로 묶고 dept 비면 CORE"로 바꿨다(단일 라인 변경 + 부서별 코어 테스트 추가, 무회귀). ER을 이 모델로
> 정렬(`core-*-er`, dept:ER). **다음**: 나머지 28부서 fan-out(같은 파이프라인·부서별 코어 4 + 심화) → DB 시드 + 라이브
> `/me/curriculum` 계약 전환 → P3 여정 지도 UI.
>
> 🔨 **커리큘럼 v3 P1 구현 완료 (2026-09-09).** 주제 조립 엔진을 새 하위 패키지 `server/internal/curriculum/themed`에
> 격리해 구축했다(기존 하드코딩 89 커리큘럼·라이브 `/me/curriculum`은 그대로 서빙 — 회귀 0). 구성: `Assemble`
> (태그→주제→난이도 계단, 프록시 유추 없이 명시 `theme` 태그만 읽어 v2 D6 회피)·`Resolve`(트랙 그룹핑 CORE→부서,
> passed/here/open + 티어 해금 + 이어하기 + 협업 collabWith)·`Catalog`(부팅 시 1회 조립 캐시). DB는 마이그레이션
> 000038(`scenarios.theme`/`collab_with` + 인덱스), seed 적재, `ListScenarioTags` 조회 추가. 런타임 레지스트리는
> api가 이미 갖는 `cfg.ContentDir`의 `nurse/themes.yaml`을 slang·night와 동일 패턴으로 로드. **추가 엔드포인트**
> `GET /me/curriculum/tracks`(라이브 미교체) + 클라이언트 타입(UI 미배선). 태그가 비어도 빈 트랙(안전) — P2와 병행
> 개발 가능. 서버·모바일 전체 테스트 그린. **다음: P2 전수조사 태깅**(themes.yaml ~100개 확정 + 전 시나리오 태그
> 부여 → R3 고아-0 게이트 활성화), 이후 P3 여정 지도 UI + 라이브 계약 전환(promote+OTA).
>
> 📝 **P2 전수조사 스펙 초안(2026-09-09).** 핵심 통찰: 태깅은 "3,044개 LLM 분류"가 아니라 "290 Topic
> 큐레이션"이다 — 생성 시나리오(≈2,741)는 gencontent가 290 Topic을 페르소나×난이도로 전개해 만들고
> **소스 Topic을 알고 있으므로**, Topic에 `Theme`을 배정하면 생성기가 태그를 자동 emit(수작업 0). 손저작
> 303개만 반자동 매핑+검수. 주제 = Topic 2~3개 묶음(≥20 상황). 7단계 파이프라인(측정→묶음→배정→손저작
> 태깅→정리→보강→검증), audit 도구(읽기 전용 분포·고아·중복·thin 리포트), 부서 단위 vertical slice(ER
> 먼저). **핵심 제약**: 시나리오 id는 위치 순번이라 Topic 재배치가 진도를 깨므로 append-우선 or 정본 재발급
> (진도 리셋 수용) 중 착수 시 선택. 스펙: [`02-construction/curriculum-v3-audit/`](02-construction/curriculum-v3-audit/build-spec-index.md). **사용자 검토 대기.**

> 📝 **커리큘럼 v3 — 주제 기반 심화 커리큘럼 + 여정 지도 (스펙, 2026-09-09).** v41 여정 지도
> 입력을 계기로, 얕은 커리큘럼(부서당 3~6개·스텝 2~4개, 전체 상황의 10%만 편입)을 **주제 단위 심화
> 커리큘럼**(한 주제 = 상황 20~30개+, 난이도 계단)으로 재설계한다. 실측: 상황 3,044개 중 326개만 편입,
> 약 2,718개가 고아. 사용자 결정: 학습이 주 목적 → 커리큘럼을 깊게, **자유 탐방 없이 모든 상황을 주제로
> 편입**, 3계층(공통 코어·부서 심화·협업). 매핑을 Go 하드코딩 89개 나열에서 **상황이 `theme` 태그를
> 선언 → 주제가 자동 조립**으로 뒤집는다(v2가 D6로 하드코딩 후퇴했으나, v3는 프록시 유추가 아니라 명시
> 태그 그룹핑이라 재발 없음). **3단계 프로그램**: P1(주제 스키마+데이터 모델, 이번 스펙) → P2(전수조사
> 태깅·보강·정리) → P3(여정 지도 UI). 스펙: [`02-construction/curriculum-v3/`](02-construction/curriculum-v3/build-spec-index.md)
> (index+domain-entities+business-rules+business-logic-model). **사용자 검토 대기 → 승인 시 P1 구현 계획.**

> ✅ **리뷰랩 모범답안 v40 재구성 + 교정 설명 모국어화(2026-09-08).** 리뷰랩·인수인계의 모범답안
> 화면을 v40 핸드오프(`forin-notebook-lab.jsx` LabModel)대로 맞췄다. **① 인수인계 '표현 다시 보기'**가
> 그동안 일반 모범답안 목록으로만 이동해 어떤 대화였는지 볼 수 없던 문제 — 이제 해당 시나리오를 찾아
> 펼쳐 준다(`/model-answers?scenario=…` → 목록이 페이지를 넘겨가며 해당 그룹을 찾아 `scrollToIndex`).
> **② 모범답안 목록 v40 재디자인**: 각 행이 부서 두들(ER=사이렌·ICU=모니터·분만실=아기·약국=알약,
> `deptNbIcon`) + "날짜 · N단계 · 모범 일치 ok/st" + 교정이 있으면 '개선' 태그. 히어로 헤드도 '교정 N개'
> → 'N단계'로. **N단계**는 그 시나리오에서 학습자가 실제 발화한 턴 수(서버 신규 지표: `dialogue_turns`
> role='user'를 `conversation_sessions`로 조인해 집계), **모범 일치**는 `max(0, 단계−교정)` — 교정 없이
> 넘어간 턴 수. `Correct()`가 변경된 답변만 카드로 저장하므로 '일치'는 교정 카드만으로는 구할 수 없어
> 발화 턴 수를 원천으로 삼았다. **③ 교정 설명(왜?) 모국어화**: 모범답안·다이얼로그(보기 선택 후 교정)의
> 설명이 타겟 언어(영어)로 나오던 문제 — `engine.go` `Correct()` 시스템 프롬프트에서 note를 학습자의
> 모국어(`Native`)로 쓰도록 강제. **서버=promote(steps 쿼리 + note 프롬프트), 클라이언트=OTA.**
> 서버·모바일 전체 테스트 그린(mobile 904, i18n 4개 언어 키 패리티 포함).

> ✅ **앱 아이콘 v40 — 여권 커버(2026-09-07).** 딥그린 #2E4636 + 금장 #D4B46A 이중 테두리 + 금장 이중원
> 안 손글씨 f + FORIN. iOS 풀 커버(1024 불투명), Android 적응형(전경=금장 f 엠블럼·배경 딥그린·모노크롬),
> 스플래시·웹 파비콘까지 동일 브랜드. `mobile/scripts/make-icon.py`(Pillow, 번들 Gaegu·IBM Plex Mono)로
> 재현. 시안=v40 `forin Notebook - App Icon.html` 확정본 A. **아이콘은 네이티브 자산 → OTA 아님, EAS
> 빌드 + 스토어 제출 필요.** 렌더는 headless라 실기기 미검증(미리보기 HTML로만 확인).

> ✅ **다국어 — 콘텐츠 이름 영어 로컬라이즈 Phase 1 + 캠퍼스 버그(2026-09-07).** 서버 i18n 파이프라인
> (`Accept-Language` → `i18n.Tr(locale, 키, 한국어폴백)`)이 커리큘럼 이름·층 헤딩·상태 태그 3곳에만
> 연결돼 있고 카탈로그도 en 하나뿐이라, 콘텐츠(상황·시나리오·브리핑·이벤트·모범답안)가 비한국어에서도
> 한국어로 나오던 문제. **Phase 1(영어·이름류 먼저)**: `content_en.go` 신규(시나리오 303 + 이벤트 12 =
> 315개 제목, 콘텐츠 ID 키)를 en에 병합하고, 상황 카드(`/me/situations`)·시나리오 브리핑(`/scenarios/{id}`)
> ·모범답안(리뷰랩)·이벤트(`/events`)·홈 이어하기 title을 `Tr`로 배선. 건물 이름은 서버가 스타일 조회
> 키로도 쓰므로 **클라이언트 i18n**(BUILDING_STYLE.nameKey, 4개 언어). 스테이징 스모크에 상황명·브리핑
> 제목 검증 추가(그린). **남은 것(후속)**: ja/de 서버 카탈로그(현재 콘텐츠는 한국어 폴백), 브리핑 본문
> prose(페르소나·brief·quick-info)·조언, 커리큘럼 스텝명 ~400개. **캠퍼스 버그 2건 동시 수정**: 즐겨찾기
> 층 이름을 현재 커리큘럼에서 재해석(언어 전환 시 저장 시점 언어로 굳던 문제), floorPlace가 접두사만
> 벗겨 남던 선행 가운뎃점(`· Emergency Centre`) 제거. **클라이언트=OTA, 서버=promote(스테이징 검증됨).**
>
> ✅ **홈 개편 v37 + 라이브 병동 실시간 프레즌스(2026-09).** 홈 화면을 v37 시안으로 재구성하고, 병동에
> 실제 접속자를 최대 10명까지 익명 아바타로 반영한다. **폴링 + TTL** 방식(SSE 아님 — Cloud Run은 요청
> 지속시간과 동시성 슬롯으로 과금하므로 세션 내내 슬롯을 잡는 SSE가 더 비싸다): Redis zset `ward:live`
> (member=uid, score=마지막 접속 시각), 익명 id는 `hex(sha256(uid)[:6])`, `WARD_TTL=40s`. 포그라운드
> 하트비트(홈 6s GET · 그 외 15s POST), 접속=왼쪽 등장·이탈=오른쪽 퇴장, 앱 끄면 사라짐. 나 탭에 병동
> 노출 옵트아웃 토글. 클라이언트는 `lib/wardPresence.ts`(useSyncExternalStore) + `LiveWardNb`.
>
> ✅ **v38 재미 콘텐츠 3종 완료(2026-09) — 슬랭 도감 · 나이트 라디오 · 환자 인수인계 노트.**
> ①**병원 은어 도감**: 하루 1장씩 미국 임상 약어·은어를 수집한다. 카드는 **서버 콘텐츠**(`content/slang/us.yaml`
> 205장)라 앱 재배포 없이 배포만으로 늘어난다. `GET /slang`(당일 드롭)·`POST /slang/collect`, 마이그
> 000036. ②**나이트 근무 라디오**: 밤 10시~새벽 5시에 열리는 조용한 채널 — 앰비언트 루프(numpy로 직접
> 합성한 32s 심리스 WAV)와 '오늘 밤의 이야기'(하루 회전, 한 문장 따라 말하기). `content/night/stories.yaml`,
> `GET /night?i=N`. ③**환자 인수인계 노트**: 클리어한 환자에게서 후일담 쪽지가 온다(LLM 생성, 인카운터당
> 1회, 점수별 확률 게이트). 감사(답장→환자 되답장)·후속(다음 시나리오)·복습(모범답안) 3종. `GET /handoff`·
> `POST /handoff/{id}/read`·`POST /handoff/{id}/reply`, 마이그 000037. 홈에 세 진입점, 인수인계는 미읽음
> 배지. i18n 4개 언어. 스모크 ㉓ 추가. **prod 반영 완료**(서버 promote `55f519f` + production OTA).
>
> ✅ **v38 쉬는 시간 미니게임 허브 + v39 탭탭 농구(2026-09).** 홈의 '쉬는 시간' 진입점 아래 게임 허브
> (`app/games/`)를 붙였다. 게임 점수·플레이 제한은 **기기 로컬**(`lib/gameScores.ts`, SecureStore·부팅 시
> 재수화): 하루 20판(광고 보상형 top-up +5판 최대 3회), 게임별 최고기록. **①탭탭 농구**(`games/hoops.tsx`,
> v39 '왼오른 농구' 디자인) — 골대 하나만 보이고 넣으면 카메라가 반대편으로 슬라이드하며 새 높이의 골대가
> 등장. 자체 물리 루프(rAF·서브스텝 적분): 탭=전진+상승 홉·비대칭 중력(상승 1800/하강 2700)·바닥/림/백보드
> 튕김(림은 앞·뒤 z분리로 공이 통과하는 연출)·클린(림 미접촉, 백보드 뱅크는 클린)/뱅크/2연속 불(3점·궤적
> 불길)·6초 샷클락(0초 후 공중이면 라스트 찬스 슬로우모션). 효과음 3종(gen-sfx.py: 휙·림·게임오버). **②완벽한
> 원 그리기**(`games/circle.tsx`) — 한 붓 원, 편차 색상 획 + 잘한 곳/삐끗 콜아웃, 5초 제한, 로컬 최고기록.
> 나이트 라디오는 트랙 3종(합성 빗소리·여름·왈츠)으로 확장. **모바일 전용(OTA), 서버 변경 없음.** 상세 시안은
> [inputs/design-handoff_v39](inputs/design-handoff_v39/README.md) `forin-notebook-extras.jsx §H`.
> **미검증(headless):** 물리 감(중력·속도·튕김)·카메라 슬라이드·림 z순서·효과음은 실기기 확인이 정본이며
> 수치는 반복 튜닝 중. 게임 로직은 순수 함수(`pointsFor`/`nextStreak`)와 화면 렌더만 테스트가 커버한다.
>
> ✅ **TestFlight 피드백 19건 처리 완료 → prod 배포 + TestFlight build 2 제출(2026-08-19).**
> 그룹별: **A**(#1 이모지 제거 → 아이콘 42종) · **B**(#11 키보드·#6 DM 정렬·#18 바텀시트 제스처·
> #19 글자 크기 +15%) · **E**(#16 효과음 6종·#17 페르소나별 TTS) · **G**(#12 최근 10일 리듬·#15 이탈
> 연출+재개) · **C**([커리큘럼 v2](02-construction/curriculum-v2/build-spec-index.md) — 층별 테마
> 커리큘럼 **89개**·커리어 탭 병합·이어하기·신규 오리엔테이션 3편) · **D**([다국어](02-construction/i18n/build-spec-index.md)
> — P1~P5 완료, UI 4개 언어·서버 로케일 파이프라인·목적지 준비 상태) · **F**(#9 아바타 편집 + 얼굴
> 스캔·#10 배지→칭호 통합 + 코믹 히든 4) · **#8** 초상 애니메이션 · **#13** 첫 행동 우선 배치.
> 결정 근거는 [DECISIONS](DECISIONS.md) 2026-08-18~19 참조.
>
> **배포 결과(직접 확인):** prod가 마이그레이션 000023 + 새 계약을 서빙한다 — `/readyz` 200,
> `POST /auth/dev` 404, `/config/economy`의 `readyDestinations=['us']`(P5가 prod에 있다는 증거).
> 스테이징 스모크 **92/0**(단정 76 → 98). iOS build 2(커밋 `973856a`) TestFlight 제출 완료.
>
> ⚠️ **8커밋 동안 스테이징이 빨간 상태였다.** 계약 변경(`{chapters}`→`{buildings}`)과 10일 리듬으로
> 스모크 단정이 낡았는데 로컬 초록만 보고 푸시를 계속했다. 실패 4건 전부 옛 계약 검사였고 서버 회귀는
> 없었다. 남은 1건은 스모크 자체의 환경 의존 버그(`grep '[가-힣]'`가 러너 로케일에서
> `Invalid collation character`). **계약을 바꾸는 커밋은 파이프라인 확인을 같은 체크포인트에 넣는다.**
>
> ⚠️ **미검증(headless 한계):** ①얼굴 스캔의 실제 카메라 정확도 — 합성 JPEG로만 검증했고 타원 가이드
> 기준 머리 밴드 위치는 이마 높이에 따라 조정이 필요할 수 있다 ②언어 변경 시 화면 재렌더 ③ja/de 의료
> 용어의 임상 정확성(원어민 검수) ④89개 커리큘럼 목록의 스크롤 감각 ⑤마이그레이션·`/me/ui-lang` 실 DB
> 왕복은 스모크에서 통과했으나 CI 단위 테스트에는 `TEST_DATABASE_URL`이 없다.
>
> 🏗 **남은 작업:** [다국어](02-construction/i18n/build-spec-index.md) **P6**(인테리어 en 779 · ja/de 각
> 970 · 커리큘럼 스텝 400×3 — 앱은 폴백으로 정상 동작) · ja/de 임상 용어 원어민 검수 ·
> **D8**(손저작 시나리오 57개가 `acuity` 미선언 → `Code Blue`·`아나필락시스`가 routine으로 취급되어
> 평판의 응급 차원이 움직이지 않는다).
>
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
> 🎙 **핸드오프 v22 발음 루프 완료(2026-08-15~18)** — v21 대비 문서는 `04_SCREENS.md`만 +30줄이고 실질은
> **발음·스피킹 피드백** 신규(⑤b 4상태 + 리뷰랩 진입점)다. 감사 결과 `POST /pronunciation`은 있으나 **완전
> 무상태**였고 Azure 요청이 `Granularity: Word`라 음소가 없었다 — 서버 기능 추가로 T1~T9 구현, **T10(검증)이
> 실 Azure 왕복으로 실측**: `PhonemeAlphabet: IPA`가 REST에서 실제로 먹고(SAPI 아님) `Offset`/`Duration`도
> 실려 온다(문서만으론 불가했던 확인). 실측 중 결함 2건 발견·수정 — ①참조오디오 24kHz vs 채점 입력 16kHz
> 불일치(스모크가 리샘플로 우회) ②SoT의 "PhraseCard"가 실은 리뷰랩 탭(`lab.tsx`)인데 마이크 액션이 다른
> 동명 화면(`review.tsx`)에 붙어 있었음. 스모크 22 assert 추가(로컬 79/0·staging 76/0). staging의 레거시
> 백필 실적용 여부 1건은 DB 직접 접근이 막혀 미확인으로 남음(Build Spec §8). 11b/11c 목록·드릴 화면은 여전히
> 범위 밖(2주 이력 전제, §0). Build Spec [`pronunciation/`](02-construction/pronunciation/build-spec-index.md)
> `IMPLEMENTED`·`comprehensive`. 결정 근거는 [DECISIONS](DECISIONS.md) 2026-08-15 / 2026-08-18.

| 2-6 화면·플로우 | [06-screens-flows.md](02-construction/06-screens-flows.md) | **완료(2026-08-10)** — 온보딩(splash/login/locale/job/level) ✅ · 캠퍼스/인테리어/상황판 ✅ · 브리핑→**AI 다이얼로그**(🎤 STT/🔊 TTS·번역·QUICK INFO)⇄**퀴즈 10종**→클리어(result) ✅ · **프로필(나) + 성장 리포트(/growth 푸시)** ✅ · **리뷰랩**(PhraseCard·필터·복습 세션·맥락·등급 안내) ✅ · 뱃지/스티커 탭 상세 ✅. **소셜 로그인 마감(2026-08)**: Apple/Google/Kakao 실동작 확인 — Google은 iOS/Android 클라이언트 등록 검증, Kakao는 **공식 SDK(@react-native-kakao)로 전환**(직접 OIDC는 KOE033으로 차단됨). 프로필 탭 **로그아웃** 추가. 앱 아이콘·네이티브 스플래시를 브랜드 픽셀 아트로 교체(Expo 기본값 제거).
**홈 탭 + 동료 시스템 ✅(2026-08-10)**: 앱 진입 첫 화면을 목록(커리어 탭)에서 **오늘의 한 가지**로 교체. 홈 10모듈 전부 실데이터(`GET /me/home` 1왕복) — 값 없으면 모듈을 숨긴다(더미 금지). 동료는 초대 코드 기반이며 관계 타입 `peer/mentor/mentee`를 처음부터 데이터에 둬 **멘토–멘티 확장 시 화면 수정 불필요**. [Build Spec](02-construction/home-colleagues/build-spec-index.md)
**온보딩 저장/재진입 ✅(2026-08-10)** — 검증 중 결함 2건 발견·수정: ①선택값이 라우트 파라미터로만 존재해 **중간 이탈 시 3단계가 유실**됐다 → 기기 로컬 드래프트에 단계별 저장 + 게이트가 **중단 지점부터 재개**(부분 저장을 서버에 보내면 `onboarded=true`가 찍혀 나머지를 영영 건너뛴다) ②온보딩 완료·로그인 후 목적지가 여전히 `/campus`였다(홈 탭 도입 시 게이트만 고친 회귀) → `/(tabs)`. 재진입 스킵 자체는 정상이었다(`onboarded: null` 초기값 덕에 깜빡임 없음).
**2-6 완료.** (클리어 컨페티는 감사 결과 `result/[id].tsx`에 **이미 구현돼 있었음**)

**2026-08-18~19 TestFlight 피드백 반영:** 커리어 탭을 **건물 → 층 → 커리큘럼 한 계층**으로 병합(세그먼트
2개·`CH.N` 로드맵 25행 삭제) · 커리큘럼 **25 → 89**(24개 층 전수 손저작, 주제 290개 전부 사용, 신규
`SCN-ORIENT-*` 3개로 도착→인사→인계받기 저작) · 홈/커리어의 **이어하기**를 최근 시도 기준으로 · 효과음
6종 + 페르소나별 TTS · 앱 **UI 언어 설정**(ko/en/ja/de, 즉시 반영) · 글자 크기 +15%.
**선결 결함 D1:** 손저작 챕터 1·2의 스텝 이름 11개가 실제 시나리오와 무관했다(id는 존재해 시드 가드는
통과, 두 문자열을 비교하는 테스트가 없었음) → `catalog_content_test.go`가 89개 커리큘럼 전 스텝을 대조한다. |
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
| 3-1 Deployment | [01-deployment.md](03-operations/01-deployment.md) | **9-A 서버 배포 실배포 완료(2026-08-13) — staging 스모크 57/0**. 콘솔 클릭 0회로 66리소스 생성(Cloud Run 서비스2·Job4·Cloud SQL1+DB2·Upstash2·시크릿10·WIF·Artifact Registry). 파이프라인 전 단계 통과 + `staging-verified` 태그 부착 확인. **첫 실경로가 정적 검증이 못 잡은 결함 3종을 잡았다**(Cloud SQL 에디션 기본값 / gcloud 프로젝션의 `:` 부분매칭·리스트 래핑 / 시크릿 후행 개행) — §11.1. 남음: 첫 승격·prod 시드(미실행, prod는 hello 플레이스홀더). **9-B 모바일 배선 완료(2026-08-13~14)** — `mobile.yml` 신설(tsc·jest CI 게이트, [run 31692228156](https://github.com/bingoring/forin/actions/runs/31692228156) success·38 suites/213 tests → 최종 리뷰 픽스 웨이브 이후 **39 suites/219 tests**)·EAS 프로필 환경 분리(조용한 폴백 2종 차단: `client.ts`의 localhost 폴백 + gitignore된 `mobile/.env`)·`expo-updates`+fingerprint 정책(`eas fingerprint:generate`로 40자 해시 실측)·`ota.yml`(prod 승격과 같은 승인 게이트)·제출 트랙 `alpha`(비공개 테스트, `internal` 아님) — §12. **`EXPO_TOKEN` 등록 후 `preview` 채널로 첫 실제 OTA 발행 완료(2026-08-14, §12.1)** — `eas update`가 fingerprint 정책을 실제로 소비함을 실증(발행된 runtimeVersion이 40자 지문 해시. **단 지문은 플랫폼별로 다르고 당시 대조한 것은 android 한쪽뿐이었다** — §12.1 정정). 동시에 `eas.json` 자체가 지문 입력(파일 해시)이라 설정 편집만으로도 지문이 바뀌어 이전 빌드에 도달하지 못할 수 있음이 드러났다. **iOS 제출 절 배선 완료(2026-08-15, §12.3)** — Apple 멤버십 승인, capability는 entitlements 근거로 `Sign In with Apple` 하나, `eas.json`에는 `ascAppId` 하나. `eas config`가 없는 키는 거부하지만 `ascAppId` 형식은 검증하지 않음을 실측해 그 공백을 jest로 메웠다(39 suites/**221 tests**). **첫 iOS 빌드 성공(2026-08-15, §12.4)** — `eas build`가 지문 해시를 바이너리에 박음이 실증됐고(마지막 미증명 항목 닫힘), 동시에 `eas build`가 수출 규정 프롬프트로 `app.json`을 바꿔 **커밋 전이면 OTA가 출시 빌드에 도달하지 않는다**는 함정이 드러나 `0adfdc9`로 닫았다. **첫 `eas submit` 성공(2026-08-15, §12.5)** — 바이너리가 App Store Connect에 올라갔고 9-B 배선이 전 구간 실경로로 증명됐다. **TestFlight 내부 배포 개시(2026-08-17, §12.7)** — 빌드는 이미 `VALID`였고(문서만 "Apple 처리 대기"로 멈춰 있었다) 실제 병목은 **베타 그룹 0개**였다. 내부 그룹 생성 + 소유자 추가로 `internalBuildState`가 `IN_BETA_TESTING`이 됐다. 내부/외부는 **테스터가 ASC 사용자인지**로 갈리며(`buildBetaDetail`이 두 상태를 동시에 보고), 두 번째 테스터는 최소 권한(`MARKETING`·앱 한정)으로 ASC 초대했고 **수락 전 그룹 배정은 409로 막힌다**(초대와 배정은 원자적이지 않다). 이 시점 `master`의 iOS 지문이 출시 IPA와 **일치**해 OTA 도달성은 정상이다. 남은 건 실기기 검증·두 번째 테스터 수락과 **Android 전량** — Play 개발자 계정 신원확인 진행 중·서비스 계정 키 미발급이 막고 있다(키 부재 재확인, android 빌드 0개). 이전 설계 요약: AI_PROPOSED(2026-08-12) — 호스팅 게이트 확정: **Cloud Run + Cloud SQL(서울)**, Redis는 **Upstash(도쿄)**. staging+prod(Cloud SQL 인스턴스 1개에 DB 2개). **이미지 하나·엔트리포인트 셋**(`/api`·`/migrate`·`/seed`, 같은 다이제스트) · 코드는 트래픽 전환으로 즉시 롤백/**스키마는 전진만**(마이그레이션 하위호환 강제) · **무키 CI(WIF)** · staging 자동+스모크 57 → **prod 수동 승격** · 콘텐츠 시드는 ID 축소 금지 게이트 + 수동 트리거 · 모바일은 `mobile.yml` 신설(tsc·jest가 CI에 없었음)·EAS 환경 분리·**OTA fingerprint 정책**·내부 트랙까지 · **IaC 전량 Terraform**(자동화 불가 경계 3종 명시). 구현은 9-A 서버 → 9-B 모바일 순 |
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
> ****첫 `eas submit`도 성공해 바이너리가 App Store Connect에 올라갔다(§12.5)** — 9-B 배선이 전 구간 실경로로 증명됐다. 테스터가 붙을 prod도 확인했다(`/readyz` postgres·redis ok, `contentVersion 2026.06.08-seed1`, `/departments` 실데이터 — 시드 정상). 그 확인 중 **`/healthz`가 공개 URL로 컨테이너에 닿지 않음**을 발견해 3-2 입력에 경고로 남겼다(외부 업타임 체크에 쓰면 산 서비스를 죽음으로 보고한다). **TestFlight 내부 배포도 개시했다(2026-08-17, §12.7)** — 빌드는 이미 `VALID`였고
> 병목은 "Apple 처리"가 아니라 **베타 그룹 0개**였다(비동기 외부 상태는 문서가 아니라 API에 물어야 한다).
> 내부 그룹 생성 → `internalBuildState: IN_BETA_TESTING`. 남은 건 실기기 검증(소셜 로그인 3종·마이크·prod
> 커리큘럼)·두 번째 테스터 수락 후 배정과 **Android 전량** — Play 개발자 계정 신원확인 진행 중·Google Play 서비스 계정
> 키 미발급이 계속 막고 있다. **다음 진입점: 3-2 모니터링.** 위 자격증명이 갖춰지는 대로 첫 android `eas build`(네이티브
> 의존이 EAS 빌더에서 처음 컴파일되는 지점이라 새 실패가 나올 수 있음)→테스터 배포로 넘어간다. Android는 개인
> 계정이라 **비공개 테스트 12명/14일이
> 출시 경로의 선행 조건**(2주 임계 경로)이므로 그 시점부터 시계를 돌린다. 병행 **콘텐츠 워크스트림**(커리큘럼 챕터
> 스텝 시나리오 저작 · 평판 긴급도 250토픽 전수 검토 — 현재 14개만 태깅).
> 규칙: [`FRAMEWORK.md`](../../FRAMEWORK.md) 참조
