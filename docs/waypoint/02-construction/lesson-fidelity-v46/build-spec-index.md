# Build Spec — 학습 화면 핸드오프 1:1 (v46)

    status: READY (2026-10-07 — 결정은 §3, 사용자 답변 반영)
    depth: comprehensive
    inputs: inputs/design-handoff_v46/07_NOTEBOOK_REDESIGN.md (L200~231 학습 절)
            inputs/design-handoff_v46/reference/forin-notebook-lesson-words-live.jsx   (★ STEP 1)
            inputs/design-handoff_v46/reference/forin-notebook-lesson-sent-live.jsx    (★ STEP 2 문장 — v46 신규)
            inputs/design-handoff_v46/reference/forin-notebook-lesson-nuance.jsx       (★ C0 릴 · ★ C5 · ★ C6)
            inputs/design-handoff_v46/reference/forin-notebook-lesson.jsx             (A 허브 · C' 완료 · D/D' · E)
            inputs/design-handoff_v46/reference/forin-notebook.jsx                    (공용 부품)
    audit:  audit/audit-step1-words.md (차이 95) · audit/audit-step2-sentences.md (160) · audit/audit-hub-dialogue.md (127)
    builds on: 02-construction/lesson-four-steps-v44/ (기능·데이터는 그대로, 겉모습과 흐름을 핸드오프에 맞춘다)

## §0. 개요 & 범위

사용자 요구(2026-10-07): **학습 화면을 핸드오프 그대로.** 조각 칩의 기본·선택 모양부터 정답 확인 뒤 다음 장으로 넘어가는
애니메이션까지, 핸드오프에 있는 것은 빼지 않는다. 지금 구현은 기능은 갖췄지만 겉모습이 전반적으로 다르고, 애니메이션은
STEP 1·2를 통틀어 하나도 없다(감사 3종, 차이 382건).

- **하는 것:** 감사 3종의 '미구현·다름' 전부. 아래 §3 결정으로 남긴 편차만 예외.
- **원칙:** 값은 참조 JSX에서 직접 옮긴다(px·색·각도·keyframes). 감사 표의 행 번호를 구현 체크리스트로 쓴다.
  핸드오프에 없지만 우리가 **더한** 것(키보드 연출, 타자 효과, 기분 개선 띠 등)은 빼지 않는다 — 빼는 것은 편차이고 더한 것은 아니다.

## §1. 분해

    T1 공용 부품·애니메이션 기반 → T2 낱장 묶음(제본) 부품 → T3 STEP 1 단어장
                                                       ↘ T4 STEP 2(릴 C0 · 문장장 · C5 · C6 · 완료 C')
    T5 콘텐츠(새 필드·순서 배열 세트·검사기·지시서·ER 저작)  ‖  T6 허브  ‖  T7 대화 D/D'/E
    T8 시뮬레이터 아트보드 대조(화면마다 핸드오프 캡처와 나란히)

T3·T4는 T1·T2 위에 선다. T5는 T4의 데이터를 채우지만 T4는 필드가 없어도 돌아야 한다(§R3).

## §2. 아티팩트

| 아티팩트 | 위치 |
|---|---|
| domain-entities | §D |
| business-rules | §R |
| business-logic-model | §L (STEP 2 흐름) |
| frontend-components | §F + 감사 3종의 대조표(값의 정본) |

## §3. 결정 (2026-10-07)

1. **StepTrack은 STEP 화면(단어·문장·가이드 대화·자유 대화)에서 뺀다** — 사용자. 아트보드에 없고, 사용자는 이미 그 단계를
   골라 들어왔다. 07 문서의 "STEP 화면 상단에 항상"보다 아트보드를 따른다. 허브에는 남는다.
2. **STEP 2는 아트보드 순서대로 화면을 나눈다** — 사용자. 릴(C0) → 문장 플래시카드(끝에 DONE 장) → 같은 뜻 다른 장면(C5) →
   한 단어 바꾸기(C6) → 완료(C' PASSED + 문장별 발음 점수). 각 화면이 핸드오프의 태그·진행 바·제목·CTA를 갖는다.
3. **허브의 결정 4(탭바 없음, CTA bottom 30)는 유지** — 사용자. 나머지 허브 차이는 전부 고친다.
4. **글리프(✓ ✕ ✎ ‹ › ▷ ∨ ↺ ←)는 NbIcon으로 그린다** — 사용자. 자리·크기·색은 핸드오프 값. 저장소 규칙(glyphs 테스트) 유지.
5. **대화 무대는 핸드오프 모양(E 236 · D 168 · `#F6E3DC` · 이름표 왼쪽 · 스피커 오른쪽) + 끌어 조절 유지** — 사용자.
   처음 높이가 핸드오프 값이고, 사용자가 경계를 끌면 그만큼 바뀐다.
6. **STEP 3 레일 `노트` = 이 상황의 교정노트를 바텀시트로** — 사용자. 대화를 떠나지 않는다.
7. **콘텐츠에 없는 필드는 화면을 먼저 만들고 ER을 저작한다** — 사용자. 화면은 필드가 없어도 빈자리 없이 돈다(§R3).
8. **순서 배열은 상황마다 따로 저작한다** — 사용자. 문장 목록의 순서는 목표별로 묶어 적은 것이라 대화 순서로 쓸 수 없다.
   저작도 결정 14 파이프라인 — **Sonnet 저작·수정, Opus 검토**, Fable은 중요할 때만 표본 판정(사용자, 2026-10-07). T5의 다른 새 필드도 같다.
9. AI: 문장장 장 수는 상황의 문장 수(핸드오프 6장은 예시 — V6), "다시 듣기 · 2회"는 실제로 2회 제한, `faceWorried` 아이콘은 새로
   그림, 공용 부품 값은 모든 수첩 화면에 한꺼번에, 감정 칩은 한국어 감정어(기분 값 → 라벨 표), 우리가 더한 움직임은 유지.

## §D. 데이터 (T5) — 확정 (2026-10-07, 참조 `forin-notebook-lesson-sent-live.jsx` `SENTS` · `-nuance.jsx` `CTX`/`SWAP` 대조)

전부 **선택 필드**. 없으면 §R3 대체, 있으면 검사기가 모양을 본다(Go `content/lessonv46.go` · 파이썬 `verify_lesson_content.py`, 같은 규칙).
보고: [`t5-report.md`](t5-report.md).

**문장 `content.Sentence`** (DB `scenarios.sentences` jsonb 안 — 컬럼 추가 없음)

| 필드 | 모양 | 핸드오프 자리 | 규칙(V18) |
|---|---|---|---|
| `tag` | string | 낱장 머리 파란 NbTag (SL:110) | 비어 있지 않음, ≤10자 |
| `icon` | string (NbIcon) | 앰버 원 58px (SL:117, listen은 스피커라 안 씀) | 비어 있지 않음 · NbIcon 이름(파이썬, 모바일 테스트) |
| `why` | string | 해설 "왜?" 박스 (SL:137) | 비어 있지 않음 |
| `decoy` | string | build 풀의 오답 조각 1개 (SL:14 `pool` − `chunks`) | 비어 있지 않음, 그 문장 청크가 아니고 `en` 안에 없음 |
| `distractorsKo` | string[2] | listen 3지의 오답 뜻 (SL:13 `opts`) | 정확히 2, 서로 다르고 `ko`와 다름 |
| `blank` | `{answer, options: [{en, icon}]×4}` | blank 빈칸 + 2×2 (SL:15 `before/answer/after/opts`) | `answer`가 `en`에 낱말 경계로 정확히 한 번(화면이 그 자리로 `before`/`after`를 나눔), 선택지 4개·서로 다름·`answer` 포함·저마다 `icon` |

- 초안의 `blankIcons`(아이콘만, 문구는 런타임)는 **폐기** — 참조는 문구와 아이콘을 함께 저작하고(`['annoying','faceAngry']`),
  감사 §4-5가 짚은 "같은 품사 대비"는 저작해야 나온다.
- listen 선택지의 아이콘(SL:13 `opts[i][0]`)은 v46이 그리지 않으므로(감사 #52) 싣지 않는다. 문장 `type`(유형 배정)도 싣지 않는다 — R4대로 런타임.

**상황 `content.Scenario.order`** → `content.SentenceOrder` (DB **새 컬럼 `scenarios.lesson_order` jsonb NULL**, 마이그레이션 000043;
`order`는 SQL 예약어) → `GET /me/lesson/{id}`의 `order`(없으면 키 없음)

| 필드 | 모양 | 핸드오프 자리 | 규칙(V19) |
|---|---|---|---|
| `tag` | string, 선택 | 낱장 머리 태그 "대화 흐름" (SL:17) | 있으면 비어 있지 않음, ≤10자 |
| `icon` | string, 선택 | 앰버 원 compass (SL:17) | 있으면 NbIcon |
| `ko` | string, 필수 | 머리 형광펜 "불만 환자 응대 4문장 순서" (SL:17·119) | 비어 있지 않음 |
| `why` | string, 필수 | 해설 "왜?" (SL:17) | 비어 있지 않음 |
| `lines` | `[{en, icon, ko?, note?}]` ×4 | 줄 글자·아이콘 17px (SL:17·96·97), 정답 = 적힌 순서 | 정확히 4, `en`·`icon` 필수, `en` 서로 다름, `ko`·`note` 있으면 비어 있지 않음 |

- 참조의 줄은 `[en, icon]`뿐이다. `ko`(줄 뜻)·`note`(역할 2~4자: 공감·이유·확인·감사)는 **선택** — 교정노트와, 참조 카드 `en`
  "공감 → 이유 → 확인 → 감사"(v46이 그리지 않음)를 쓸 때의 재료. 참조 `shuffled`는 싣지 않는다(런타임 stableShuffle, 감사 #89).
- 문장 없는 상황에 order만 있으면 오류(STEP 2가 없다).

**뉘앙스 `content.Nuance`** — `ko` 하나를 더한다(`word`는 이미 있음, context에 저작이 안 됐을 뿐)

| kind | 필드 | 핸드오프 자리 | 규칙(V14 더함) |
|---|---|---|---|
| context | `word` + `ko` | C5 제목 "`deteriorate`가 어색한 장면은?" + 메모 “악화되다” (NU:126·139·142) | 둘 다 있거나 둘 다 없음 |
| swap | `ko` | C6 카드 아래 "어젯밤 어머니가 돌아가셨어요 — 라고 전해야 해요" (NU:201) | 있으면 비어 있지 않음. **꼬리 "— 라고 전해야 해요"는 화면이 붙인다** |

**아이콘 집합**은 코드 쪽: 모바일 `theme/contentIcons.test.ts`가 `sentences:`·`order:`·`nuance:` 블록의 `icon:`을 NbIcon 유니온과 대조한다
(보상 아이콘 스캔에서는 뗀다). 파이썬 검사기는 `NbIcon.tsx`에서 유니온을 직접 읽는다. Go는 비어 있지 않은지만(테마 아이콘 관례).
Go는 `omitempty` 문자열이라 `why: ""`와 키 없음을 구별하지 못해 공백만 있는 값을 잡고, 파이썬은 빈 문자열도 잡는다.

저작: 지시서 `server/content/tools/lesson_author_brief.md` "v46" 절, 파이프라인 `pipeline/TASK.md`·`REVIEW.md`·`FIX.md` "v46 보강" 절
(결정 14: Sonnet 저작·수정, Opus 검토). 보강 = `export_dept_lessons.py`로 바탕 → 새 필드만 얹음 → `merge_dept_lessons.py --replace`.

## §R. 규칙

| | 규칙 |
|---|---|
| R1 | 값의 정본은 참조 JSX다. 감사 표의 핸드오프 열이 가리키는 파일:줄에서 옮기고, 옮긴 자리에 그 출처를 주석으로 남긴다 |
| R2 | 애니메이션은 RN `Animated` + `useNativeDriver`(수첩 화면 관례). 여러 단계 keyframes는 `src/data/keyframes.ts`의 `keyframeSegments`. 모션 줄이기 설정이면 즉시 최종 상태 |
| R3 | 새 콘텐츠 필드가 없을 때: `tag` → 상황 제목의 짧은 이름, `icon` → 부서 대표 아이콘, `why` → 해설 박스를 그리지 않음, `decoy` → 같은 상황 다른 문장의 청크 1개, `distractorsKo` → 같은 상황 다른 문장의 ko 2개, `blank` → 런타임 빈칸(가르치는 단어가 든 청크, 오답은 다른 문장 청크)의 아이콘 없는 2×2 글자 카드, context `word`/`ko` → 제목의 단어 자리·메모를 그리지 않음, swap `ko` → 한국어 줄을 그리지 않음, `order` 없음 → 순서 배열 장을 건너뜀, 릴 없음 → C0 건너뜀, C5·C6 항목 없음 → 그 화면 건너뜀. 빈 자리·지어낸 문구 없음 |
| R4 | 장 수·유형 배정은 콘텐츠 수에서 나온다(V6). 유형은 핸드오프 순서(listen·build·blank·listen·order·build)를 주기로 돌리되, 그 문장에 필요한 데이터가 없으면 다음 유형으로 |
| R5 | 학습 기록(STEP 1·2 클리어, missed, 헷갈린 단어·문장의 교정노트)은 v44 동작 그대로. 문장 '헷갈려요'는 새 API로 교정노트에 한 장(단어와 같은 규칙) |
| R6 | 결정 4(허브)·결정 4(글리프) 등 §3 편차 외에는 핸드오프와 다르면 결함이다 |

## §L. STEP 2 흐름 (T4)

    허브 → [C0 릴: 장면 n장 스와이프 → 감상 카드 → "STEP 2 · 문장 학습 시작 ›"]
         → [문장장: 장마다 프롬프트 → 확인 → 해설 → 헷갈려요(좌로 뜯김)/알겠어요(우로 뜯김) → … → DONE 장(집계)]
         → [C5 같은 뜻 다른 장면] → [C6 한 단어 바꾸기]
         → [C' PASSED + 문장별 발음 점수 → STEP 2 기록 → STEP 3]
    없는 화면은 건너뛴다(R3). 뒤로 가기는 허브로.

## §4. 구현 체크리스트

- [x] T1 공용 부품(NbUI 버튼 하드 그림자·게이지 2톤 빗금·도장 3px double·형광펜 띠 위치·태그 패딩·모노 자간/굵기) + `.nb-press` 0.06s + keyframes 모듈(reveal·ok·shake·tear-l/r·rise·stub·swipe-in/out·pop)
- [x] T2 낱장 묶음 부품(스프링 링 9 · 뒷장 2겹 · 아래 다음 장 .85 · 지그재그 절취 조각 · 점선 절취선 · 낱장 그림자 · 줄노트 28px 배경)
- [x] T3 STEP 1 — 감사 step1 표 전 행 (2026-10-08, [`t3-report.md`](t3-report.md) — 남은 차이 표 포함, 저울·짝 `ko`·`icon` ER 저작은 T5 몫)
- [x] T4 STEP 2 — 감사 step2 표 전 행, §L 흐름, 문장 '헷갈려요' API (2026-10-08, [`t4-report.md`](t4-report.md) — 남은 차이 표 포함, API `POST /me/lesson/{id}/sentences/confused`)
- [ ] T5 콘텐츠 — [x] §D 스키마·검사기·지시서·적재·응답·모바일 타입(2026-10-07, [`t5-report.md`](t5-report.md)) · [ ] ER 저작(결정 14, 순서 배열 세트 포함)
- [x] T6 허브 — 감사 hub 표의 허브 행(결정 4 제외), StepTrack 연결선 규칙 (2026-10-08, [`t6-report.md`](t6-report.md) — 남은 차이 표 포함, `briefing.line` ER 저작은 T5 몫)
- [x] T7 대화 D/D'/E — 감사 hub 표의 대화 행(무대 결정 5, 노트 결정 6), 픽셀 라인 잔재 제거, STEP 화면 StepTrack 제거(결정 1) (2026-10-08, [`t7-report.md`](t7-report.md) — 남은 차이 표 포함, 노트 API `GET /me/review/scenarios/{id}`)
- [ ] T8 시뮬레이터 대조 — 아트보드마다 핸드오프 캡처와 우리 화면을 나란히 저장(`audit/screens/`)

## §5. 검증

화면마다: 감사 표의 해당 행이 전부 '같음'이 될 것 · 애니메이션은 시뮬레이터 녹화나 연속 캡처로 확인 · 기존 학습 기록 테스트
(STEP 클리어·missed·교정노트) 그린 유지 · 새 동작은 변이로 실패 확인.

## §7. 편차 로그

§3의 1·3·4·5(끌어 조절 유지)·9(장 수) — 사용자/AI 결정. 그 밖의 편차는 구현 중 생기면 여기에 사용자 승인과 함께 적는다.

| 편차 (T1·T2, 2026-10-07) | 상태 |
|---|---|
| MONO 700 → SemiBold 600, 도장 윗줄 Pretendard 800 → Bold 700 (글꼴 자산 없음) | 미승인 — 자산 추가 여부 사용자 결정 대기 ([t1-t2-report](t1-t2-report.md) '옮기지 못한 것' 1) |
| `nbText.mono` 기본 자간 1 유지(자간은 인자로, 학습·대화 화면은 0을 넘김) | 미승인 — 보고서 2 |
| paper 버튼 흐린 그림자 0.06s 전환이 Android에선 즉시 | 미승인 — 보고서 3 |
| 테이프 그림자 iOS만 | 미승인 — 보고서 4 |
| CSS dashed 점 길이를 선 굵기 ×3 점·×3 틈으로(Chromium 근사) | 미승인 — T8 대조에서 확인 |
| 하드 그림자의 면 둥근 모서리 바깥 1px 미만 틈 생략 | 미승인 — 보고서 6 |
| STEP 1 보기·짝 오른쪽 순서를 섞음(핸드오프는 정답이 늘 첫째) — 그대로면 답이 늘 A (T3) | **승인** 2026-10-08 사용자 "섞는다" — [t3-report](t3-report.md) #41·#48·#73 |
| 문장 안 형광펜의 `<mark>` 좌우 2px가 글자를 밀어내는 것 생략(띠만 2 넓게) (T3) | 미승인 — t3-report '남은 차이' |
| 허브 부제가 세 토막 `ER · 주제 · n/N`(핸드오프 네 토막) — 우리 커리큘럼에 소주제 층이 없음 (T6) | 미승인 — [t6-report](t6-report.md) #8 |
| 허브 위치 태그 내용 = `briefing.dept`(`ER · TRAUMA BAY #4`), 핸드오프 `ER BAY 2` 꼴 아님 — `room` 필드 없음 (T6) | 미승인 — t6-report #19 |
| 허브 감정·XP 칩은 데이터가 없으면 생략(핸드오프 항상 3개) — §R3 (T6) | 미승인 — t6-report #24 |
| 대화 무대: 두 아트보드(236·168) 사이·밖 위치는 직선 보간, D 아래는 인화 축소, 667pt 화면은 D 무대 124로 열림 (T7) | 미승인 — [t7-report](t7-report.md) '무대'·'짧은 화면' |
| D 보내기 활성 = 보낼 줄이 있으면(말하기로 받아쓴 줄 포함; 핸드오프 "타이핑 + 입력") · 받아쓴 줄은 작성 중 말풍선 (T7) | 미승인 — t7-report #147·#117 |
| D 단어 칩 = 힌트 청크 머리 낱말(3글자 이하면 두 낱말), 최대 3 — 핸드오프 예시 3개를 그대로 만드는 규칙 (T7) | 미승인 — t7-report #144 |
| E 그래버 ②는 그림만 · `상황 종료`는 화면 가운데 · 끈 크기는 실행 종류별로 기억(키 v2) (T7) | 미승인 — t7-report #122·#93 |
| 문장장 아래 다음 화면 버튼 문구 "다음 ›"(핸드오프 "STEP 3 · 가이드 대화로 ›") — 결정 2로 DONE 뒤에 C5·C6·C'가 온다 (T4) | 미승인 — [t4-report](t4-report.md) #39 |
| 문장장 아래 다음 화면 버튼을 진행 중엔 그리지 않고 DONE 장에서만 잉크로 보임(핸드오프는 진행 중에도 점선 .5로 상시, 누르면 아무 일 없음) (T8) | **승인** 2026-10-08 사용자 "버튼을 없앤다" — t4-report #39·#40·#116 |
| 아래 깔린 다음 장을 현재 장이 잰 높이로 자름(핸드오프는 다음 장이 더 길면 현재 장 아래로 비어져 나옴 — 핸드오프에도 있는 현상) (T8) | **승인** 2026-10-08 사용자 "현재 장 높이로 자른다" |
| 빈칸 선택지를 아이콘 2×2 카드(SL:69-77·lesson.jsx L267) 대신 STEP 1 고르기(WL:56-67)와 같은 A–D 세로 줄로 — 선택지 `icon` 필드는 저작·검사·표시 모두 폐지(V18이 있으면 오류) (T8) | **승인** 2026-10-08 사용자 "문장이 있는데 아이콘이 왜 있어 … 기존 빈칸 채우는 비슷한 문제 유형의 디자인을 참고" |
| C5·C6 태그·바의 k/K = 이 상황 C5+C6 화면 수 중 순번(핸드오프 "2/5·4/5"는 v45 순번) (T4) | 미승인 — t4-report #145 |
| "틀림 → 노트" 집계는 틀린 장 포함, 노트에는 '아직 헷갈려요' 누른 장만(단어 규칙) (T4) | 미승인 — t4-report #108 |
| C' 점수 원은 따라 말하기 기록의 마지막 점수, 없으면 빈 원(지어내지 않음) (T4) | 미승인 — t4-report #115 |
