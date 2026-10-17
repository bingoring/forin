# Build Spec — 홈 "달력 한 장 + 버튼 하나"(v47) · 설명 문구 배제 · 구 홈 진입점 재배치(v48)

    status: IMPLEMENTED (2026-10-17 — 브랜치 feat/home-calendar-v47, 결정은 §3, 검증·편차는 §4·§5)
    depth: standard
    inputs: inputs/design-handoff_v47/07_NOTEBOOK_REDESIGN.md (끝 두 절: 홈 전면 개편 · 화면 문구 원칙)
            inputs/design-handoff_v47/reference/forin-notebook-home3.jsx        (★ HomeCal — 새 파일)
            inputs/design-handoff_v47/reference/forin Notebook - Home.html      (nb-home3 아트보드 A·B)
            inputs/design-handoff_v48/07_NOTEBOOK_REDESIGN.md (끝 절: 구 홈 Extras 진입점 재배치)
            inputs/design-handoff_v48/reference/forin-notebook-lounge.jsx       (휴게실 카드)
            inputs/design-handoff_v48/reference/forin-notebook-lab.jsx          (자료 선반)
            inputs/design-handoff_v48/reference/forin-notebook.jsx              (NbIcon radio)
    diff:   v46 → v47: 07 문서 +11줄, home3.jsx 신규, 참조 16파일 문구 31곳 삭제·축약(그 밖의 변경 없음)
            v47 → v48: 07 문서 +7줄, lab·lounge·forin-notebook.jsx 3파일
    builds on: 02-construction/home-colleagues/ (홈 API·동료), live-ward/, 2-7 성장 달력(`GET /me/calendar`)

## §0. 개요 & 범위

v47은 홈을 **글자 없이 누를 곳이 보이는 화면**으로 바꾼다. 지금 홈(v37 HomeV2 계열)은 브리핑 데스크 한 장에 라이브 병동 ·
할 일 3칸 · 이어서 카드 · 호출 쪽지 · 과별 출근 카드 · 오늘의 문장 · 멘토 쪽지 · 복습 미리보기 · 쉬는 시간/은어/인수인계 입구 ·
일터/라운지 바로가기 · 동료 카드까지 열세 덩어리다. v47 홈은 세 요소뿐이다.

1. **상단 줄** — 아바타 원(48) · 연속 출근 알약(불꽃 + 숫자) · 호출 배지(호출이 있을 때만, 흔들리는 페이저 + 빨간 점).
2. **근무 달력** — 성장 리포트 달력을 옮겨 온다. 근무한 날 = 근무대 색 + 해·노을·달 글리프, 오늘 = 빨간 손그림 동그라미,
   미래 = 흐림, 범례는 글리프 칩만. 날짜를 누르면 아래에 그날 도장 줄(부서 아이콘 + 체크 + ×n).
3. **이어서 버튼 하나** — 잉크 바: 진행 링 안 부서 아이콘 · 5칸 진행 막대 · 노란 원 ▶, 숨 쉬는 노란 후광.

같은 원칙(**누구나 아는 조작 안내·메타 설명은 쓰지 않는다**)을 전 화면 문구에 적용해 31곳을 지웠다(§F4).
v48은 홈에서 빠지는 구 Extras를 탭으로 흡수한다 — 게임 허브 → 라운지 '휴게실' 카드, 인수인계 노트·슬랭 → 리뷰랩 '자료 선반'.

- **하는 것:** 홈 교체(T2), 홈·달력 데이터 보강(T1), 휴게실 카드·자료 선반(T3), 문구 정리(T4), 시뮬레이터 대조(T5).
- **안 하는 것:** 오늘의 문장·할 일 체크·멘토 쪽지·복습 미리보기의 새 자리(결정 3 — 다음 핸드오프에서), 게임 순위 서버(결정 4),
  나이트 라디오 화면·API 삭제(결정 6), 라이브 병동 재배치(보류 — v47 "HomeV2 아트보드에 유지").

## §1. 분해

    T1 서버: 홈 todayOne에 부서 코드·부서 진도 · 달력 항목에 부서 코드 · 계약 재생성
      ↘ T2 모바일 홈 HomeCal(아이콘 pager·fire 포함)
    T3 라운지 휴게실 카드 ‖ 리뷰랩 자료 선반          (T1과 무관)
    T4 문구 31곳 정리(ko·en·ja·de 키 삭제·축약)       (T1과 무관)
    T5 시뮬레이터 아트보드 대조(nbh3-a·nbh3-b, 라운지, 리뷰랩)

## §2. 아티팩트

| 아티팩트 | 위치 |
|---|---|
| domain-entities | §D |
| business-rules | §R |
| business-logic-model | §L |
| frontend-components | §F |

## §3. 결정 (2026-10-17)

1. **홈은 시안의 세 요소만** — 핸드오프(v47·v48 "진입점을 다시 붙이지 않는다"). 지금 홈의 나머지 덩어리는 홈에서 뺀다.
2. **과별 출근 카드는 입구 없이 제거** — 사용자. 이 카드는 부서 인테리어·엘리베이터·캠퍼스 맵으로 들어가는 **유일한 입구**였다
   (`index.tsx:292`, 다른 진입 경로 없음). 제거 뒤 맵 엔진은 코드로 남지만 앱에서 도달할 수 없다. 나 탭의 '탐험 모드' 스위치는
   켜도 바뀌는 것이 없어지므로 함께 숨긴다(설정 값과 `useExploreMode`는 남김 — 입구가 다시 생기면 그대로 쓴다).
3. **그림 없는 이관은 보류** — 사용자. v47은 오늘의 문장 → 리뷰랩, 할 일 체크 → 프로필, 동료 소식 → 라운지로 "이관"이라고만
   적었고 그림이 없다. 이번에는 **홈에서만 뺀다.** 서버 `/me/home`의 `phrase`·`brief`·`mentorNote`·`review` 필드와 기기 로컬
   `dailyBrief`는 그대로 둔다(다음 핸드오프가 자리를 정하면 그대로 붙인다). 동료 소식은 라운지에 이미 있다.
   멘토 쪽지·복습 미리보기는 시안에 언급이 없다 — 같이 홈에서만 뺀다.
4. **휴게실 카드는 있는 것만 그린다** — 사용자. 시안의 게임 칩 4개(종이비행기·원·달리기·농구)와 순위 `#4` 중, 앱에 있는 게임은
   2개(탭탭 농구·완벽한 원)이고 순위는 서버에 없다(점수는 기기 로컬, `lib/gameScores.ts`). 칩은 실제 게임 2개, 순위 자리는
   비우고 `›`만. 가짜 숫자를 넣지 않는다.
5. **반영 방식: 브랜치 + PR** — 사용자. `docs/dlc`는 먼저 커밋·push, 메인 레포는 `feat/home-calendar-v47` → PR → 머지.
6. AI: **나이트 라디오는 지금 상태 유지**(홈 입구는 10/15에 이미 뺐다). v48 "제외(폐기)"는 진입점이 없다는 뜻으로 읽고
   `/night` 화면·`GET /night`·콘텐츠 삭제는 별도 정리 작업으로 남긴다. NbIcon `radio`는 쓰는 곳이 없어 옮기지 않는다.
7. AI: **이어서 버튼의 링 = 부서 트랙 진도, 5칸 = 지금 주제 진도를 5등분.** 시안은 링 62%·막대 3/5를 두 개의 다른 양으로
   그렸다. 서버가 이미 아는 두 진도(부서 트랙 passed/total, 주제 done/total)를 각각 싣는다. 5칸은 `round(5·done/total)`칸을 채운다
   (done이 1 이상이면 최소 1칸, 끝나지 않았으면 최대 4칸 — 다 찬 막대가 '끝'으로 읽히지 않게).
8. AI: **부서 아이콘은 서버가 부서 코드를 싣고 클라이언트가 그린다.** 지금 이어서 카드는 `siren`을 하드코딩했다. 시나리오 id에서
   부서를 추측하지 않는다(`SCN-ORIENT-*` 같은 손저작 id가 있다) — 달력 항목에도 서버가 `dept`를 싣는다. 아이콘 표는 기존
   `DEPT_NB_ICON`(`data/campus.ts`)을 코드로 조회한다(id에서 추측하는 `deptNbIcon`과 같은 표).
9. AI: **호출 배지를 누르면 지금 호출 쪽지와 같은 흐름** — 서버에 수락을 먼저 묻고(`POST` accept) 답을 받은 뒤 시나리오로 간다.
   시안 프로토타입의 "누르면 배지가 꺼짐"은 데모 동작이다. 수락했지만 끝내지 않은 호출은 배지를 계속 그린다(다시 들어갈 길).

## §D. 데이터 (T1)

### D1. `GET /me/home` — `todayOne` 보강 (추가만, 하위호환)

    todayOne {
      chapter, title, kind, scenarioId?, progress?{done,total}   // 기존
      dept?:          string            // 부서 코드(ER·ICU·…). currentStep의 deptCode. GEN이어도 코드는 싣는다
      deptProgress?:  {done, total}     // 그 부서 트랙의 필수 스텝 진도(여정 freeRoam과 같은 계산)
    }

### D2. `GET /me/calendar` — 항목 보강 (추가만)

    CalendarEntry { scenarioId, title, cleared, hour, dept?: string }   // dept = scenarios.dept

### D3. 모바일 타입

`HomeTodayOne`·`CalendarEntry`에 같은 선택 필드. 계약(`make contract`) 재생성.

## §R. 규칙

- R1. 홈은 `/me/home`과 `/me/calendar`(이번 달)를 **병렬로** 읽는다. 달력이 실패해도 홈은 뜬다(빈 달력 = 칸만 있는 달).
- R2. 달력의 날짜 칸은 **활동이 있는 날만 누를 수 있다.** 같은 날을 다시 누르면 닫힌다. 미래 날짜는 흐림(.45), 누를 수 없다.
- R3. 도장 줄은 그날 **클리어한** 상황만(`cleared`), 부서 아이콘 하나씩 + ×n. 클리어 0이고 세션만 있는 날은 근무대 칩만 보이고
  도장 자리는 비운다(글자 없음).
- R4. 연속 출근 알약은 `streak ≥ 1`일 때만. 0이면 그리지 않는다(지금 도장과 같은 규칙 — 빈 기록을 보여 주지 않는다).
- R5. 호출 배지는 `page`가 있고 만료되지 않았거나(`secondsLeft > 0`) 이미 수락했고 아직 답하지 않은 동안만.
- R6. 이어서 버튼은 `todayOne`이 있을 때만 눌린다. 없으면(모두 끝남) 같은 자리에 쉬는 날 카드(지금 문구 `home.restToday` 재사용).
- R7. 달 이동(‹ ›)은 성장 리포트와 같은 API·같은 규칙(서버가 답한 달을 표시).
- R8. 근무대 이름은 직업별(`data/shifts.ts`), 색·글리프는 공통 — 지금 달력 규칙 그대로. 홈에는 이름을 쓰지 않고 글리프만.

## §L. 흐름

- 홈 진입(포커스) → R1 병렬 로드 → 콜드스타트 재시도·`home.waking`은 지금 로직 유지.
- 호출 배지 탭 → `api.acceptPage()` → 성공 시 해당 시나리오(QZ-면 퀴즈) push → 실패면 다음 로드가 배지를 지운다(결정 9).
- 이어서 탭 → 지금 `startToday` 그대로.
- 아바타 탭 → 나 탭(`/me`). 불꽃 알약은 누르지 않는다(시안에 동작 없음).
- 날짜 탭 → 선택 토글 → 도장 줄 nbh3-pop(.32s, translateY 14 → 0, opacity 0 → 1).

## §F. 화면

### F1. 홈 `app/(tabs)/index.tsx` 교체 — 값은 `forin-notebook-home3.jsx`에서 그대로

- 배경: 크림 `#F1EBDD` + 27/28px 줄(지금 `Sheet` 재사용). 스크롤 없음 — 달력과 버튼이 한 화면(작은 기기는 달력 영역만 스크롤).
- 상단 줄(padding 10 22 0, gap 10): 아바타 48 원(2px 잉크 테두리, `NbCharacter` 얼굴 — 사용자의 AvatarSpec) · 불꽃 알약
  (paper, 1.6px 잉크, 99 radius, -1.5°, `fire` 22 + 손글씨 22) · flex · 호출 배지 46 원(`rgba(199,81,70,.12)` 배경, 1.8px 빨강,
  `pager` 26이 ±8° .5s 흔들림, 우상단 13px 빨간 점 + 2px 배경색 테두리).
- 달력(padding 18 20 0): `NbPaper rot -0.4 tape tapeLeft 150`, padding 16 13 13. 머리 ‹ 월 › (손글씨 24, 화살표 30×30 soft 19).
  요일 7칸(월~일, 토·일 빨강, .8), 칸 높이 44 · gap 5 · radius 6. 근무한 날: 근무대 배경 + 1.3px `rgba(62,54,43,.18)` 테두리,
  날짜 MONO 11/700 + 글리프 13. 빈 날: 1.3px dashed `.12`, 날짜 `#B9AE97`. 선택: 2px 잉크 · -2° · 1.06배 · 2px 2px 그림자.
  오늘: 빨간 손그림 원(시안 path 그대로, stroke 2.4, 칸보다 5px 바깥). 범례 26×20 칩 3개(gap 18).
- 도장 줄(minHeight 64, marginTop 12): paper · 1.5px 잉크 · .4°. 왼쪽 40 칩(근무대 배경 + 날짜 + 글리프), 도장 38 원
  (2px dashed 초록 .6, ±6°, 부서 아이콘 22 + 우하단 check 16), 오른쪽 `×n` 손글씨 22 초록.
- 이어서 버튼(탭바 위 bottom 98 자리, 좌우 20): 잉크 바 radius 6 · -0.5° · padding 14 16 · gap 14. 링 58(r 25, 바탕 paper,
  트랙 `rgba(255,253,244,.25)` 5, 진행 `#F9E37B` 5 round, -90°부터) 안 부서 아이콘 30. 5칸 막대(높이 9, radius 3, ±2°,
  채움 `#F9E37B` / 빈칸 `rgba(255,253,244,.22)`). ▶ 원 54(`#F9E37B`, 2px paper 테두리, 삼각형 26). 후광: 2.4s 숨쉬기
  (그림자 + 0 0 0 7px `rgba(249,227,123,.45)`), 누르면 translate(2,3) rotate(-1°).
- 접근성 라벨: 글자가 없으므로 각 요소에 `accessibilityLabel`(아바타 = 나, 불꽃 = "연속 출근 n일", 호출 = 호출 줄, 날짜 = "m월 d일 ·
  근무대 · 클리어 n", 이어서 = chapter·title). 기존 i18n 키를 재사용하고 없으면 4개 언어로 더한다.
- 지우는 것: `TodayBrief`·`PageNote`·과별 출근 카드·오늘의 문장·멘토 쪽지·복습 미리보기·쉬는 시간/은어/인수인계 입구·일터/라운지
  버튼·동료 카드·`LiveWardNb`(컴포넌트·presence 로직은 남김, 홈의 `setHomeActive` 하트비트도 함께 뺀다 — 홈에 병동이 없으면
  홈 6s 폴링은 필요 없다. 그 밖 화면의 15s POST는 그대로). 고아가 되는 i18n 키는 T4에서 함께 정리.
- 나 탭 '탐험 모드' 행 숨김(결정 2).

### F2. 라운지 휴게실 카드 `app/(tabs)/lounge.tsx` (v48 lounge.jsx L83~99)

- `lounge.subtitle`("…동료들의 휴게실") 줄을 카드로 대체. 피드 헤더 바로 아래, marginTop 12.
- paper -0.6° · 압정(64) · 배경 `rgba(169,203,227,.22)` · padding 11 13 · gap 11. 커피 원 46(1.8px 잉크, `coffee` 28) ·
  "휴게실" 손글씨 19 · 칩 26×26(paper, 1.2px `#E0D6C0`, ±3°, 아이콘 17) **실제 게임 2개만**(결정 4) · 오른쪽 `›` 손글씨 18 soft.
- 누르면 `/games`.

### F3. 리뷰랩 자료 선반 `app/(tabs)/lab.tsx` (v48 lab.jsx L66~77)

- 교정 노트 견출지 탭 아래, 목록 위. 2칸 타일(gap 9, marginBottom 14): ① 인계 노트 `board` 28, 배경 `rgba(249,227,123,.38)`,
  배지 = 인수인계 미읽음(`api.handoff().unread`) → `/handoff` ② 슬랭 `speech` 28, 배경 `rgba(95,141,90,.16)`, 배지 = 오늘 모을 수
  있는 카드(`collectableToday ? 1 : 0`) → `/slang`. 배지는 0이면 그리지 않음. 타일 ±0.7°, padding 10 0 8, 이름 손글씨 14.5.
- 견출지 탭 수는 3개 유지. 선반은 교정 노트 탭에서만.

### F4. 설명 문구 정리 (T4) — 시안 31곳 ↔ 앱

앱에 대응 문구가 있는 것만 고친다. 키를 지우면 4개 언어 카탈로그에서 함께 지우고, 쓰던 자리는 줄째 없앤다(빈 줄 금지).

| 시안 | 앱 키 | 처리 |
|---|---|---|
| dialogue L94 `SPEAK FREELY · 마이크를 눌러 말하기` | `dialogue.speakFreely` | `SPEAK FREELY`로 축약 |
| extras L340 원 그리기 채점 메모 | `games.circleScoring` | 삭제 |
| journey2 L416 `주제 2/6 완료 · 지금 …` | `journey.goalTopics`·`journey.goalNow` | 삭제 |
| journey2 L434~435 서가 제목·힌트 | `journey.shelfHeading`·`journey.shelfHint` | `서가` / 힌트 삭제 |
| journey2 L318·551 `실전 첫 상황 · 직접 말하기 · 약 6분 · +60 XP` | 앱에 없음 | — |
| journey2 L242 우표 줄 부제(모든 우표 모음·n번째 상황 · 약 6분·잠김 사유) | 앱에 없음 | — |
| journey L288 `스피킹 4/6 — 발음 연습이 여기에 반영돼요` | 앱에 없음 | — |
| sent-live L31 `탭해서 다시 듣기 · 2회` | `sent.replay` | 삭제(파형 + 횟수 표시는 유지) |
| sent-live L60 / words-live 빈칸 | `sent.buildHint`·`recall.fillHint` | 삭제 |
| sent-live L86 | `sent.orderHint` | 삭제 |
| sent-live L226 | `sent.doneNote` | 삭제 |
| words-live L300 | `recall.missedNote` | 삭제 |
| lounge L156 | `lounge.shareSub` | 삭제 |
| lounge L257 `동료가 되면 서로의 학습 현황을…` | `colleagueAdd.note` | 삭제 |
| mainloop L133 `이번 미션 ✎` | 앱에 없음 | — |
| onboarding-flow L380·448·483 태그 3 | `onb.flight.tag`·`onb.flight.backTag`·`onb.commute.tag` | 삭제 |
| onboarding-flow2 L184 | `onb.id.readyRest` | 삭제 |
| onboarding L74 | `onb.job.sub` | 삭제 |
| profile L222 | `growth.bandHint` | 삭제 |
| profile L274 | `colleagueAdd.sub` | 삭제 |
| quiz2·quiz3·session·social·placement·mainloop L193 | 앱에 없음(grep) | — |
| (원칙 적용) words 빈칸 `띄어쓰기는 자동` | `recall.fillAutoSpace` | 삭제 — fillHint와 한 줄 |

T4 결과: 21키 삭제·2키 축약(4개 언어), 홈 교체로 고아가 된 키 30개(홈 모듈·탐험 모드 설정)도 삭제. 시안에만 있고 앱에 없는 문구는 할 일이 없었다.

## §4. 체크리스트

- [x] T1 서버 `todayOne.dept`·`deptProgress`, `CalendarEntry.dept`(events.ward 조인) + 단위 테스트·DB 테스트 · `go test ./...`(실 DB 포함) · `make contract`(swag rc5) 재생성 — 커밋 `ce02786`
- [x] T1 스모크 단정 2(todayOne dept/deptProgress, 클리어 항목 dept) — 로컬 실서버에서 통과
- [x] T2 NbIcon `pager`·`fire` · 검사기 폴백 목록에도 추가
- [x] T2 HomeCal(F1) + `homeCal.test`(R2~R6·결정 7·8) · 호출 배지 `pagingCall.test` 재작성 · 콜드스타트 테스트 기준 교체 · 나 탭 탐험 모드 행 숨김 — 규칙 2개는 일부러 깨뜨려 테스트가 잡는 것 확인 — `d5efe4e`
- [x] T3 휴게실 카드(F2) · 자료 선반(F3) + `oldHomeDoors.test` — `3b88834`
- [x] T4 문구 표(F4) · i18n 4개 언어 · 텍스트 글리프 → NbIcon chevron — `59a1ef9`
- [x] mobile `tsc --noEmit` 0 · jest 177 스위트 1,335건 그린
- [~] T5 시뮬레이터 대조 — **이 Mac에 iOS 시뮬레이터 런타임이 없어(런타임 0개) Expo 웹으로 대신 확인**: 로컬 Postgres·Redis·시드·API(ENV=dev) +
  `expo start --web`, 402×874. 웹은 `expo-secure-store`가 없어 부팅이 멈추므로 브라우저 안에서만 저장소를 localStorage로 바꿔 끼운 뒤
  개발 로그인(앱 코드 무변경). 홈(상단 줄·호출 배지·10월 달력·오늘 동그라미·이브닝 글리프·선택 칸·도장 줄 ER×2·이어서 버튼 후광)·
  라운지 휴게실·리뷰랩 자료 선반 확인. **실기기/시뮬레이터 미확인**: 페이저 흔들림·후광 숨쉬기 네이티브 드라이버, 작은 기기(SE) 높이.
- [ ] PR · CI 4종 그린 · 머지 → staging(서버) · prod promote 뒤 OTA(모바일이 새 서버 필드를 읽는다 — 서버 먼저)

## §5. 편차·미해결

- 맵 엔진 도달 불가(결정 2) — 앱 크기·유지보수 비용은 그대로 남는다. 다시 열지 지울지는 따로 정한다.
- 이관 보류 4종(결정 3)의 서버 필드는 홈이 읽지 않는 채로 남는다.
- 휴게실 순위 자리 비움(결정 4).
- **오늘의 상황판(`/board`) 입구가 사라짐(구현 중 발견).** 홈의 '라운지' 바로가기 버튼은 라운지 탭이 아니라 `/board`(일일 상황판·광고
  보상 판 충전)로 가는 유일한 입구였다. 시안대로 홈에서 빼면서 상황판은 도달 불가. **결정(사용자, 2026-10-17): 다음 핸드오프까지
  입구 없이 둔다**(화면·API는 유지).
- 로컬 스모크 123/9: 실패 9는 환경(Azure 음성 키 없음 7, LLM 공급자 없음 1, 빈 DB 새 계정의 여정 클리어 0 1). 홈·달력 단정은 통과.
