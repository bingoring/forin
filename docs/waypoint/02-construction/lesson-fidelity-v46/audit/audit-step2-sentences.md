# STEP 2 문장 — 핸드오프 v46 대조 감사 (읽기 전용)

- 날짜: 2026-10-07 · 브랜치 `feat/journey-ia` (be5123e)
- 핸드오프 경로 약칭: `H/` = `docs/dlc/projects/forin/inputs/design-handoff_v46/reference/`
  - `SL` = `H/forin-notebook-lesson-sent-live.jsx` (SentStudyLive, v46 신규)
  - `NU` = `H/forin-notebook-lesson-nuance.jsx` (ImmersionReel · ContextMatch · SwapOne + keyframes)
  - `LS` = `H/forin-notebook-lesson.jsx` (C1~C4 정적, C' LessonSentenceDone)
  - `WL` = `H/forin-notebook-lesson-words-live.jsx` (단어장 — 통일 기준, nb-tear/rise/stub/shake/ok/reveal keyframes 정의처)
  - `UI` = `H/forin-notebook-ui.jsx` (NbPaper·NbButton·NbTag·NbMark·NbMemo) · `NB` = `H/forin-notebook.jsx` (NbIcon)
  - `07` = `docs/dlc/projects/forin/inputs/design-handoff_v46/07_NOTEBOOK_REDESIGN.md`
- 우리 쪽 약칭: `S` = `mobile/src/app/scenario/[id]/sentences.tsx` · `P` = `mobile/src/components/lesson/SentPrompt.tsx` · `D` = `mobile/src/data/sentenceDrill.ts` · `U` = `mobile/src/components/nb/NbUI.tsx` · `I` = `mobile/src/components/nb/NbIcon.tsx` · `W` = `mobile/src/app/scenario/[id]/words.tsx` · `R` = `mobile/src/components/lesson/RecallPrompt.tsx` · `K` = `mobile/src/i18n/catalog/ko.ts`

---

## 1. 요약 — 큰 구조 차이

1. **화면 구성이 다르다.** 핸드오프의 STEP 2는 *따로 그린 화면 여러 개*다 — ① C0 `ImmersionReel`(자기 Frame, 태그 "STEP 2 · 워밍업", 보조 "30초", 파란 5칸 진행 바, CTA "STEP 2 · 문장 학습 시작 ›") ② `SentStudyLive`(스프링 제본 낱장 묶음 6장, 잉크/빨강 진행 바, 하단 판정 버튼 + 늘 보이는 STEP 3 버튼) ③ C5 `ContextMatch` / C6 `SwapOne`(각자 Frame, 태그 "STEP 2 · 문장 2/5"·"4/5", 잉크+앰버 5칸 진행 바, 자기 제목줄) ④ 완료. **우리는 전부 한 장짜리 공용 시트 안에서** 돌린다(`S:134-145`) — 릴·C5·C6도 같은 시트 안의 "카드 한 장"이고, 화면 제목·진행 바·하단 버튼이 모두 공용. 핸드오프 STEP 2에는 진행 바 스타일이 3가지(파랑 릴 / 잉크·빨강 낱장 / 잉크·앰버 C5·C6)가 있다는 점도 함께 기록.
2. **흐름 순서.** 핸드오프 아트보드 순서(`forin Notebook - Dialogue.html:41-49`): C0 릴 → ★ 낱장 6장 → (C1~C4 정적 참고) → C5 → C6 → C' 완료. 단 v46 `SentStudyLive`의 6장에는 C5/C6가 **들어 있지 않고**, C5/C6의 "문장 2/5·4/5" 표기는 v45 시절의 5장 시퀀스 기준이라 v46에서 어디에 끼는지 **핸드오프 안에서 정해져 있지 않다**. 우리: 릴(있으면) → 문장 전부(review 먼저, 5~10장) → 순서 1장(조건부) → context → swap (`D:37-55`).
3. **유형 배정.** 핸드오프는 장마다 `type`을 **저작**한다: listen · build · blank · listen · order · build (`SL:12-19`). 우리는 **위치로 계산**한다: `ROTATION[i%3]` = listen → chunks → blank 반복, 조각이 2개 미만이면 listen(`D:24,42-47`), order는 문장 카드가 아니라 별도 카드 1장(`D:48-49`).
4. **order 카드는 실제 콘텐츠에서 사실상 나오지 않는다.** `orderAnswer`는 goal당 1문장을 골라 3개 이상일 때만 order 카드를 만든다(`D:31-35,49`). 측정 결과 문장이 있는 상황 2,206개 중 **2,205개가 goal 2개뿐** → order 카드 0장(§4-1).
5. **진행 바·스텝트랙.** 핸드오프 낱장 화면에는 **장별 진행 바**(잉크=맞힘, 빨강=헷갈림/틀림, 회전 ±0.7°)가 있고 **StepTrack이 없다**. 우리 `S`에는 장별 진행 바가 **아예 없고**(`W:124-132`에는 있음) 대신 StepTrack이 있다(`S:132`). 07은 "StepTrack — STEP 화면 상단에 항상 노출"(07:202)이라 해 핸드오프 안에서 충돌.
6. **뜯어냄 루프 없음.** 핸드오프: 확인하기 → 같은 장 아래 해설 펼침 → **아직 헷갈려요(왼쪽 뜯김, 노트 저장) / 외웠어요·이제 알겠어요(오른쪽 뜯김)** → 다음 장이 올라옴. 우리: 확인하기 → 해설 → **[따라 말하기][다음]** (`S:177-186`). 헷갈림 표시·노트 저장·뜯김 애니메이션 전부 없음. 문장 노트 저장 API도 없음(§4-6).
7. **완료 화면이 두 종류.** v46 `SentStudyLive` 완료 = 묶음 안 낱장, 파란 DONE 이중 도장 + 바로 맞힘/틀림→노트 집계 + "이 문장들이 STEP 3 가이드 대화의 정답이 돼요 ✎"(`SL:215-229`). C' `LessonSentenceDone` = PASSED 도장 + 문장별 발음 점수 원 + 스피커(`LS:374-405`). 우리는 C'을 반쯤 따름(점수 원 없음, 스피커 대신 마이크, `S:146-159`).
8. **해설 구성.** 핸드오프 문장 해설 = 정답 문장 + 스피커 + 한국어 + **"왜?" 파란 좌측 바 박스** + 가운데 **따라 말하기 필(노란 .45, radius 99)** + GOOD/RETRY **이중선** 도장(nb-ok). 우리 = 문장 + 스피커 + 한국어(문장 카드에는 '왜?' 없음 — 데이터 없음), 도장은 **단선** 3px, 따라 말하기는 하단 버튼.
9. **애니메이션 0개.** 핸드오프 STEP 2에 쓰이는 키프레임 9종(nb-swipe-out/in, nb-reveal, nb-ok, nb-shake, nb-tear-l/r, nb-rise, nb-stub) + 진행 바 `transition: background .3s` — 우리 `S`/`P`에는 **하나도 없다**.
10. **제본 묶음 연출 없음.** 스프링 링 9개, 뒷장 두 겹, 뜯긴 자국(stub), 다음 장 흐리게 깔림, 절취선 — 우리 시트는 테두리 1px 흰 박스 하나(`S:135`), 그림자도 없음.

**차이 개수: 대조표 173행 중 실제 차이 160행 (참고·일치 12행, 구현 규칙 1행 제외) + STEP 2 애니메이션 10종 전부 미구현.**

---

## 2. 대조표

### 2-A. 흐름 · 화면 틀 (SentStudyLive 프레임)

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 |
|---|---|---|---|---|
| 1 | STEP 2 구성 | C0 릴 화면 → 낱장 6장 화면 → C5/C6 → 완료 (Dialogue.html:41-49) | 한 화면 한 덱: reel → 문장 N → order → context → swap (D:37-55) | 화면 분리 없음, 순서·구성 다름 |
| 2 | 낱장 장 수 | 고정 6장 (SL:12-21) | 문장 수(5~10) + reel + order + nuance (D:37-55) | 장 수 가변 |
| 3 | 유형 배정 | 장마다 저작된 type, listen·build·blank·listen·order·build (SL:13-18) | 위치 순환 listen→chunks→blank, 조각<2면 listen (D:24,45-46) | 규칙이 다름 |
| 4 | order 위치 | 덱 안의 한 유형(5번째) (SL:17) | 문장 카드 다 끝난 뒤 별도 1장, goal 3단계 이상일 때만 (D:48-49) | 위치·조건 다름 |
| 5 | 유형 이름 build | `build`, 라벨 "청크 조립" (SL:20) | `chunks`, "청크 조립" (D:13, K:282) | 키 이름만 다름(표시는 같음) — 참고 |
| 6 | 화면 배경 | 크림 #F1EBDD + 27px 줄노트 반복선 rgba(62,54,43,.06) (SL:185) | 크림 단색 View, 줄 없음 (S:111) — `NbSheet`(U:36) 미사용 | 줄노트 없음 |
| 7 | 나가기 | "‹ 나가기" 손글씨 15, 1.5px 잉크 테두리, radius 3, 패딩 1/8, -1° (SL:189) | 32×32 NbPaper(-1°, 그림자) 안 chevronLeft 16 (S:114-118) | 모양·문구 다름 (‹ 는 글리프 규칙상 아이콘으로 — §5) |
| 8 | 헤더 우측 태그 | NbTag 파랑 **외곽선** rot 1 "STEP 2 · 문장" (SL:191) | 제목 Text hand 21 "STEP 2 · 문장"(S:120) + NbTag 파랑 **채움** "n / N"(S:123) | 태그 대신 큰 제목, 채움 태그 |
| 9 | 헤더 카운터 | MONO 12 bold soft "n / N", nowrap, 태그 옆 (SL:192) | 채움 NbTag 안 hand 12.5 흰색 (S:123, U:231-251) | 글꼴·색·형태 다름 |
| 10 | 헤더 카운터 완료 시 | `min(i+1,total)/total` 그대로 6/6 표시 (SL:192) | 완료 시 숨김 `!done` (S:123) | 완료 시 사라짐 |
| 11 | 상황 제목 줄 | 없음 (헤더에 상황명 미표시) | 상황 title body 10.5 soft (S:121) | 우리에만 있음 |
| 12 | StepTrack | 없음 (SL 전체) | 있음 marginTop 10 (S:132) | 우리에만 있음 (07:202와 핸드오프 충돌 — 질문 Q3) |
| 13 | 진행 바 | 장마다 1칸, flex1 h5 r2 gap4 marginTop10, rot ±0.7°, 지난 장 = 헷갈림이면 빨강 아니면 잉크, 앞 = rgba(.15), `transition background .3s` (SL:194-196) | **없음** (S 전체) | 진행 바 자체가 없음 |
| 14 | 진행 바 색 기준 | `fuzzy`(틀렸거나 헷갈려요 누른 장)=빨강 (SL:174,195) | — | 헷갈림 개념 없음 |
| 15 | 화면 제목줄 | hand 21 lh 1.25 marginTop 12: "반복 신원확인 — 뜻을 보고 **문장을 만들어**보세요" (형광펜) (SL:197) | 없음 — 시트 안에 유형별 ask 한 줄 hand 18(S:139) | 제목줄 없음, 문구·형광펜 없음 |
| 16 | 묶음 영역 | absolute left/right 24, top 172, bottom 182, 내부 세로 스크롤·스크롤바 숨김, paddingTop 12 / Bottom 8 (SL:200) | ScrollView flex1 marginTop 12, 좌우 20, paddingBottom 150 (S:133) | 위치·여백 다름(좌우 24 vs 20) |
| 17 | 스프링 링 | 9개, 12×18, 2px 잉크, radius 6, bg 크림, top -9, left/right 14, space-between, zIndex 5 (SL:202-204) | 없음 | 없음 |
| 18 | 뒷장 1 | left 4 right -4 top 8 bottom 0, #F7F1E1, 1px #E0D6C0 (SL:205) | 없음 | 없음 |
| 19 | 뒷장 2 | left 2 right -2 top 4 bottom 4, #FBF6E8, 1px #E0D6C0 (SL:206) | 없음 | 없음 |
| 20 | 뜯긴 자국(stub) | i>0일 때 top 0 h13 종이색, 좌우 1px 테두리, 아래 1.5px dashed rgba(.35), 톱니 clipPath 16점, zIndex 4, nb-stub (SL:207) | 없음 | 없음 |
| 21 | 다음 장 깔림 | 다음 Sheet를 dim(opacity .85, 그림자 없음)으로 현재 장 밑에 렌더 (SL:208, 107) | 없음 | 없음 |
| 22 | 현재 장 래퍼 | relative zIndex 3, 틀리면 nb-shake (SL:209-213) | 없음 | 없음 |
| 23 | 낱장 본체 | 종이 #FFFdf4, 1px #E0D6C0, 그림자 0 4px 10px rgba(.16), padding 22/18/16, minHeight 300 (SL:107) | 종이, 1px paperEdge, **그림자 없음**, padding 16 사방, minHeight 없음 (S:135) | 그림자·패딩(위 22, 좌우 18)·최소높이 |
| 24 | 절취선 | absolute top 13 좌우 끝까지 1.5px dashed rgba(.3) (SL:108) | 없음 | 없음 |
| 25 | 시트 헤더 태그 | NbTag 파랑 rot -1, 문장별 `tag`(환자 안심·이유 설명…) (SL:110) | 없음 (데이터 없음) | 태그 없음 |
| 26 | 시트 헤더 유형 라벨 | hand 12.5 soft nowrap, 해설 시 "{유형} · 해설" (SL:111) | hand 12.5 soft, " · 해설" 접미사 없음 (S:136-138) | 해설 접미사 없음 (W:144는 있음) |
| 27 | 유형 라벨 문구 listen | "듣고 뜻 고르기" (SL:20) | "듣고 고르기" (K:281) | 문구 |
| 28 | 유형 라벨 문구 order | "대화 순서" (SL:20) | "순서 배열" (K:284) | 문구 |
| 29 | 시트 우상단 카운터 | MONO 11 bold soft nowrap "n / N" (SL:113) | 없음 | 없음 |
| 30 | 앰버 원 아이콘 | 58×58 원, bg amber 22, 2px amber, -4°, NbIcon 32 (문장별 icon) (SL:117) | 없음 (S:139는 Text 한 줄) | 없음 — W:150-152에는 있으나 -4° 회전 빠짐 |
| 31 | listen 헤더 원 | 같은 자리 원이 **파란 스피커 버튼**: bg rgba(74,111,165,.1), 2px 파랑, -4°, 그림자 0 2px 5px .15, speaker 32, 탭=재생 (SL:117, 07:231) | 시트 가운데 86×86 원, 2.5px 파랑, bg blue18, speaker 42, 그림자·회전 없음 (P:228-233) | 위치·크기·스타일 (C1 정적 96px 형태에 가까움) |
| 32 | 헤더 큰 문구 | NbMark 형광펜, hand 18.5 lh 1.25 = 문장 ko; listen은 hand 21 "이 문장의 뜻은?" (SL:119) | Text hand 18, 형광펜 없음, 유형별 지시문(K:288-291) (S:139) | 내용(ko 대신 지시문)·형광펜·크기 |
| 33 | ✎ 단서 줄 | hand 13.5 soft marginTop 4 lh 1.35 "✎ 이 뜻을 영어로 만들어요" / listen "✎ 스피커를 눌러 듣고 뜻을 골라요" (SL:120) | 없음 | 없음 (W:157-162처럼 pencil 아이콘 + 문구로) |
| 34 | 확인 버튼 위치 | absolute bottom **98**, left/right 24 (SL:233) | absolute bottom **30**, left/right 20 (S:162) | 위치 |
| 35 | 확인 버튼 | NbButton ink lg full pencil "확인하기", 답 없으면 opacity .4 (SL:234-238) | 같음, 래퍼 opacity .4 (S:172-175) | 위치만 다름(위 #34) |
| 36 | 해설 후 버튼 | 좌 "아직 헷갈려요"(앰버, bulb, 보조 "노트에 저장", -0.8°) / 우 "외웠어요"·틀렸으면 "이제 알겠어요"(초록, check, 보조 "뜯고 다음 장", 0.8°) (SL:239-256) | [따라 말하기 paper mic][다음 ink chevronRight] (S:177-186) | 버튼 종류·의미 전부 다름 |
| 37 | 판정 버튼 모양 | NbPaper padding 11/10, row gap 10, 1.8px 색 테두리, bg 색+14, 아이콘 30, 라벨 hand 17 색 lh 1 nowrap, 보조 10.5 soft marginTop 4 (SL:246-251) | (우리 S엔 없음; W:211-221에 같은 모양 있음) | 재사용 가능한데 안 씀 |
| 38 | 판정 보조문 | "뜯고 다음 장" (SL:243) | W용 K:273 "다음 장" | 문구("뜯고" 빠짐) |
| 39 | STEP 3 버튼 상시 | bottom 34에 **늘** 보임: 진행 중 dashed opacity .5, 완료 시 ink + speech 아이콘 흰색, "STEP 3 · 가이드 대화로 ›" (SL:258-260) | 완료 때만 등장 (S:163-167) | 상시 표시·dashed 상태 없음 |
| 40 | STEP 3 버튼 문구 | "… 가이드 대화로 ›" (끝에 ›) | "STEP 3 · 가이드 대화로" (K:305), 화살표 없음 | `iconRight="chevronRight"` 필요 |
| 41 | 버튼 2단 배치 | 확인/판정 줄(bottom 98) + STEP 3 줄(bottom 34) 두 줄 | 한 줄(bottom 30) | 배치 |
| 42 | 버튼 눌림 | `.nb-press` transition transform/box-shadow .06s ease (UI:17-18) | Pressable pressed 즉시 전환 (U:205-219) | 0.06s 전환 없음(미세) |

### 2-B. listen (듣고 뜻 고르기)

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 43 | 프롬프트 여백 | marginTop 12 (SL:27) | marginTop 10 (P:227) | 2px |
| 44 | 파형 | 18막대 높이 [6,12,18,24,14,20,10,22,16,8,18,12,6,16,10,20,12,8], 폭 4, gap 3, radius 2, 앞 11개 파랑·나머지 rgba(.2), 컨테이너 h26 padding 0/6, 왼쪽 정렬 (SL:28-29) | 없음 | 없음 |
| 45 | 다시 듣기 | 파형 오른쪽 hand 12 soft nowrap "탭해서 다시 듣기 · 2회" (SL:31) | 없음, 재생 무제한 (P:228) | 문구·횟수 제한 없음 |
| 46 | 선택지 목록 여백 | 목록 marginTop 12, 항목 간 8 (첫 항목 0) (SL:33,37) | 항목마다 marginTop 8 (P:25) — 스피커 아래 8 | 여백 |
| 47 | 선택지 패딩 | 10/12 (SL:37) | 11/12 (P:25) | 1px |
| 48 | 선택지 회전 | ±0.4° 교대 (SL:37) | 없음 (P:24-29) | 회전 없음 (R:66에는 있음) |
| 49 | A/B/C 원 | 18×18 원 1.5px (soft/초록/빨강), hand 12, 'A'/'B'/'C' → 정답 ✓ / 오답 ✕ (SL:38) | 원 없음; 정답에 check 14, 오답에 cross 12만, 평소엔 아무것도 없음 (P:30-31) | 원 라벨 없음 (R:69-72에 있음) |
| 50 | 선택지 글자 | hand 15.5 lh 1.25 flex1 (SL:39) | hand 16 (P:32) | 0.5pt |
| 51 | 선택지 수 | 3지 (SL:13) | 3지 (D:93-96) | 같음 — 오답 출처만 다름(핸드오프 저작, 우리 같은 상황 다른 문장 ko) |
| 52 | 선택지 아이콘 | 데이터엔 있으나 v46은 **안 그림** (SL:13 opts[0], 36-40) · C1 정적은 42px 타일 (LS:363) | 없음 | v46 기준 일치 — 참고 |
| 53 | listen 헤더 단서 | "✎ 스피커를 눌러 듣고 뜻을 골라요" (SL:120) | "들은 문장의 뜻을 고르세요"(K:288)가 큰 글씨 | 문구·위계 |

### 2-C. build (청크 조립)

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 54 | 헤더 큰 문구 | 문장 ko를 형광펜 (SL:119) | "조각을 순서대로 붙이세요"(K:289) | ko가 헤더가 아니라 아래 박스로 내려감(#64) |
| 55 | 조립 라인 | minHeight 42, **아래 테두리만 2px** rgba(.5) → 결과 시 맞으면 초록/틀리면 빨강, row wrap, alignItems flex-end, gap 4, padding 0/2/6 (SL:50) | 박스: minHeight 64, marginTop 8, padding 12, **사방 1.6px dashed** faint, bg 종이 (P:44-46) | 형태 전혀 다름, 결과색 없음 |
| 56 | 빈 상태 | hand 15 #B4A88F "{첫 단어} _ _ _ _ _" (SL:51) | 빈 박스 (텍스트 없음) (P:47) | 플레이스홀더 없음 (R:96에 있음) |
| 57 | 붙인 조각 | 조각마다 따로: MONO 15 bold, bg rgba(249,227,123,.55) 형광, padding 1/5 (SL:52) | 한 덩어리 문자열 MONO 15 lh 22, 형광 없음 (P:47) | 개별 칩·형광펜 없음 |
| 58 | 조각 빼기 | 붙인 조각 **아무거나** 탭하면 그 조각만 빠짐 (SL:52) | 박스 탭 = **마지막 조각만** 빠짐 (P:44) | 동작 다름 |
| 59 | 풀 간격 | gap 7, marginTop 12 (SL:54) | gap 8, marginTop 12 (P:49) | 1px |
| 60 | 풀 칩 | MONO 13.5 bold, 종이 bg, 1.4px **잉크 solid**, padding 6/11, ±1° 교대, 그림자 1px 2px 0 rgba(.2) (SL:57) | MONO 13.5, 1.4 solid ink, padding **8/12**, ±1°, **그림자 없음** (P:55-61) | 패딩·하드 그림자 |
| 61 | 사용한 칩 | 글자 투명, **빗금 bg** repeating -45° rgba(.1) 3px/3px, 1.4px **dashed** rgba(.3), 그림자 없음 (SL:57) | 글자 투명, dashed faint, bg 투명 — **빗금 없음** (P:56-60) | 빗금 없음 (R:110도 없음) |
| 62 | 풀 구성 | 정답 4조각 + 디코이 **1개**(저작, 예 "for the doctor") (SL:14,18) | 정답 조각 + 다른 문장 조각 **2개** (D:58-62) | 디코이 수·출처 |
| 63 | 조각 단위 | 구두점이 조각 안에 붙음 "for your safety,", "I forgot." (SL:14) | 구두점 조각 분리, 자동으로 끝에 붙임 (D:25-28,65-68) | 콘텐츠 규칙 차이(정답 판정 방식도: 핸드오프 문자열 비교 SL:164, 우리 조각열 비교 D:106) |
| 64 | 힌트 줄 | hand 12.5 soft marginTop 8 "조각을 눌러 순서대로 붙여요 · 다시 누르면 빼요" (SL:60) | 없음; 대신 ko 파란 좌측바 박스 marginTop 12 padding 7/10 hand 14.5 (P:246-248) | 힌트 없음, 우리에만 ko 박스 |

### 2-D. blank (빈칸 채우기)

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 65 | 헤더 큰 문구 | 문장 ko 형광펜 (SL:119) | "빈칸에 맞는 말은?"(K:290) | 내용 |
| 66 | 문장 줄 | 기본 글꼴 17 **700** lh 1.9 (=32.3) (SL:66) | Pretendard-Bold 17 lh 30 (P:258) | lh 2pt |
| 67 | 빈칸 | inline-block minWidth **110**, 아래 2.5px 파랑, 가운데 정렬, padding 0/6 (SL:67) | Text 밑줄(textDecoration) 파랑, " ______ " (P:260) | 폭·두께·정렬 |
| 68 | 빈칸 글자 | 미선택 hand 19 "?" / 선택 MONO 16 (SL:67) | 미선택 "______" / 선택 본문 굵게 그대로 (P:260) | "?"·글꼴 전환 없음 |
| 69 | 빈칸 결과색 | 맞으면 초록, 틀리면 빨강 (밑줄·글자 모두) (SL:67) | 늘 파랑 (P:260) | 결과색 없음 |
| 70 | 오답 시 빈칸 | **정답 단어를 빨강으로** 채워 보여 줌 (SL:67) | 고른 오답 그대로 | 정답 노출 없음 |
| 71 | 한국어 줄 | 없음(헤더에 형광펜) | hand 14.5 soft marginTop 6 (P:263) | 위치 |
| 72 | 선택 배치 | CSS grid 2열 gap 9 marginTop 12 (SL:69) | wrap, 각 48%, gap 8, marginTop 6 + 항목 marginTop 8 (P:264-266) | 간격 |
| 73 | 선택 카드 | 가운데 정렬 세로: padding 10/8, 1.6px 상태 테두리, 상태 bg, ±0.8° (SL:73) | Option 가로 행 padding 11/12, 회전 없음 (P:20-35) | 형태 |
| 74 | 선택 아이콘 | NbIcon 22 (옵션별 아이콘, 예 compass/star/faceAngry/chartup) (SL:15,74) | 없음 (데이터 없음) | 아이콘 없음 |
| 75 | 선택 글자 | MONO 12.5 bold marginTop 5 (SL:75) | MONO 13.5 (P:32) | 1pt |
| 76 | 선택 수 | 4 (2×2), 저작 오답 (SL:15) | 4, 다른 문장 조각에서 (D:88-89) | 출처 |

### 2-E. order (대화 순서)

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 77 | 헤더 | 앰버 원에 compass, 형광펜 "불만 환자 응대 4문장 순서"(카드 ko) (SL:17,117-119) | "대화 흐름대로 놓으세요"(K:291) | 저작 설명 없음 |
| 78 | 안내 줄 | hand 13 soft "말할 순서대로 탭하세요 · 다시 누르면 취소" (SL:86) | 없음 | 없음 |
| 79 | 위젯 | 섞인 4줄이 **제자리에 고정**, 줄을 탭하면 왼쪽 원에 번호 매김 (SL:87-101) | Assemble 재사용 — 위 박스에 "1. …\n2. …" 텍스트, 아래 풀 칩 (P:152-161) | 위젯 자체가 다름 |
| 80 | 번호 원 | 26×26, 1.8px (미선택 rgba(.35)/선택 잉크/정답 초록/오답 빨강), bg 선택 시 종이·결과색, hand 14, 미선택 "?" (SL:94) | 없음 | 없음 |
| 81 | 줄 상자 | flex1 padding 8/10, 1.5px **미선택 dashed·선택 solid**, bg 선택 시 종이·아니면 투명, ±0.4°, gap 8 (SL:95) | 풀 칩 padding 8/12 1.4px (P:55-59) | 형태 |
| 82 | 줄 아이콘 | NbIcon 17 (줄별 faceWorried/shield/board/star) (SL:96) | 없음 | 없음 |
| 83 | 줄 글자 | 12.5 weight 600 lh 1.35, 미선택 soft (SL:97) | MONO 13.5 (P:60) | 글꼴(본문 vs 모노)·크기 |
| 84 | 줄 간격 | gap 9 marginTop 8 (SL:93) | wrap gap 8 | 배치 |
| 85 | 취소 | 매겨진 줄 아무거나 다시 탭 → 그 번호 취소 (SL:93) | 마지막만 취소 (P:44) | 동작 |
| 86 | 결과 표시 | 줄마다 위치 맞으면 초록·틀리면 빨강 (SL:91) | 줄별 결과 없음 | 없음 |
| 87 | 줄 수 | 4 (SL:17) | goal 수만큼 최대 4, 3 미만이면 카드 없음 (D:31-35,49) | 콘텐츠상 0장(§4-1) |
| 88 | 해설 문장 | 4줄을 **공백으로 이어** 한 문단 (SL:133) | "1. …\n2. …" 줄바꿈 번호 목록 (P:281) | 형식 |
| 89 | 문장 섞기 | 저작된 `shuffled` (SL:17) | stableShuffle (P:153) | 참고 |

### 2-F. 해설 (같은 장 아래 펼침) — 공통

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 90 | 펼침 애니메이션 | `nb-reveal` .3s (SL:125) | 없음 (P:287) | 애니 없음 |
| 91 | 구분선 | marginTop 14 paddingTop 12, 위 1.5px dashed rgba(.3) (SL:125) | 같음 (P:287) | 일치 (참고, 개수 제외) |
| 92 | 도장 테두리 | 56 원 **3px double**(이중선) (SL:127) | 56 원 **3px 단선** (P:288-291) | 이중선 아님 (U:295 NbStamp는 두 링) |
| 93 | 도장 애니 | `nb-ok` .35s (SL:126) | 없음 | 애니 없음 |
| 94 | 도장 위 글자 | 7.5 weight **800** letterSpacing 1 (SL:128) | Pretendard-Bold(700) 7.5 ls 1 (P:292) | 굵기 800 vs 700 |
| 95 | 도장 아래 글자 | hand 15 **lineHeight 1** (SL:129) | hand 15, lineHeight 미지정 (P:293) | 줄높이 |
| 96 | 정답 문장 | 본문 15 bold lh 1.5 + 스피커 15 inline (marginLeft 2, -2px) (SL:133) | 14.5 bold, row gap 6 스피커는 옆 열 (P:296-299) | 0.5pt, 인라인 아님 |
| 97 | 정답 문장 재생 | 아이콘만 (프로토타입 동작 없음) | 문장 전체 Pressable = 재생 (P:296) | 참고(우리가 더 함) |
| 98 | 한국어 | hand 13.5 soft **marginTop 3** (SL:134) | hand 13.5 soft marginTop 4 (P:300) | 1px |
| 99 | "왜?" 박스 | marginTop 9, padding 8/10, **좌측 2.5px 파랑 바**, bg rgba(74,111,165,.06), hand 13.5 lh 1.45, **굵은 파랑 "왜?"** + why (SL:136-138) | 문장 카드: 없음. context/swap: 점선 1.3 파랑 박스, NbMark "뉘앙스" 줄 + why (P:301-306) | 문장 해설에 '왜?' 없음(데이터 없음), 스타일 다름 |
| 100 | 따라 말하기 필 | 해설 안 가운데 marginTop 10: padding 7/16, 1.6px 잉크, radius **99**, hand 14.5, bg rgba(249,227,123,.45), mic 17 gap 7 (SL:139-141) | 해설 안에 없음; 하단 NbButton paper lg "따라 말하기" (S:178-182) | 위치·모양 |
| 101 | context 해설 머리 | (C5는 낱장 아님) | "이렇게 고쳐요" hand 13 soft (P:295, K:306) | 우리 고유 |
| 102 | 해설 시 시트 라벨 | "{유형} · 해설" (SL:111) | 변화 없음 (S:136-138) | (#26과 동일 원인, 해설 쪽에서 확인) |
| 103 | 틀린 장 흔들림 | 오답 시 `nb-shake` 320ms (SL:174,210) | 없음 | 없음 |
| 104 | 결과 후 선택지 유지 | 정답 초록/오답 빨강으로 남음 (SL:35) | 같음 (P:235) | 일치 (참고, 개수 제외) |

### 2-G. 장 넘김 · 완료 (SentStudyLive)

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 105 | 장 넘김 | 판정 버튼 → `nb-tear-l`(헷갈려요) / `nb-tear-r`(알겠어요) 620ms 후 다음 장 (SL:177-181,214) | `next()` 즉시 교체 (S:80-87) | 뜯김 없음 |
| 106 | 뜯기는 장 | 결과·답이 남은 채 렌더(zIndex 6) (SL:214) | — | 없음 |
| 107 | 새 장 등장 | `nb-rise` .4s (SL:211) | 없음 | 없음 |
| 108 | 헷갈림 기록 | 틀리거나 헷갈려요 → fuzzy 목록, 진행 바 빨강, 완료 집계 (SL:156-157,174) | 기록 없음 (S 전체) | 없음 |
| 109 | 맞힘 기록 | 맞으면 known (SL:174) | 없음 | 없음 |
| 110 | 완료 카드 위치 | 제본 묶음 안 낱장, nb-rise, 종이·테두리·그림자 0 4px 10px .16, padding 28/18/20, 가운데 (SL:216) | 묶음 없음, View alignItems center paddingTop 12 (S:147) | 낱장 아님 |
| 111 | 완료 도장 | 96 원, 3px **double 파랑**, -10°, "DONE" 9 800 ls 2 marginTop 24, hand 22 "문장 완료" (SL:217-220) | NbStamp **초록** 92 "STEP 2"/"PASSED" -8° opacity .9 (S:148, U:295-318) | 색·크기·문구 (C' 쪽 디자인) |
| 112 | 완료 문구 | 없음(도장 안 "문장 완료") | hand 21 "문장 {n}개, 입에 붙었어요" (S:149, K:304) | C' 문구(C'은 hand 22) |
| 113 | 집계 | 두 칸: hand 24 초록 바로 맞힘 / hand 24 빨강 "틀림 → 노트", 10.5 soft 라벨, 사이 1px rgba(.2), gap 12 marginTop 18 (SL:221-225) | 없음 | 없음 (W:180-190에 있음) |
| 114 | 완료 안내 | hand 13.5 soft marginTop 10 "이 문장들이 STEP 3 가이드 대화의 정답이 돼요 ✎" (SL:226) | 없음 | 없음 |
| 115 | 문장 목록 | 없음 (SentStudyLive) · C'은 5행 점수 원 34px(80↑ 초록, 미만 앰버) + 문장 12.5 + **스피커** 17 (LS:383-397) | NbPaper ±0.4 행 + 문장 body 12.5 + **마이크** 17(→발음 화면) (S:150-157) | 점수 원 없음, 아이콘 다름 |
| 116 | 완료 CTA | STEP 3 버튼(상시, 완료 시 ink) (SL:258-260) | 완료 시 ink 버튼 + 저장 실패 문구 (S:163-167) | 상시 표시 없음(#39) |
| 117 | C' 헤더 | Head "STEP 2 · 문장" + 보조 상황명 + 채움 태그 "5 / 5" + StepTrack (LS:378-379) | 상황명·StepTrack은 있음, 완료 시 n/N 숨김 (S:121-123) | C'과도 다름 |
| 118 | C' 도장 등장 | `nbl-pop` .35s cubic-bezier(.3,.7,.4,1.2) (LS:14-15,381) | 없음 | 없음 |

### 2-H. C0 ImmersionReel (문장 릴) + 끝의 '감상 하나'

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 119 | 릴 화면 | 자기 Frame: 태그 "STEP 2 · 워밍업" + 보조 hand 12.5 soft "30초" (NU:73,36-37) | 공용 시트 안 유형 라벨 "워밍업 · 문장 릴"(K:285) (S:136) | 화면 분리 없음 |
| 120 | 릴 진행 바 | 장면 수만큼 파랑(k<i) / rgba(.15), ±0.7°, transition .3s (NU:74) | 없음; 헤더 n/N은 덱 전체 기준(릴 = 1장) (S:123) | 진행 바·카운트 기준 |
| 121 | 릴 제목 | hand 21 "외우지 말고 **다섯 장면**에서 그냥 만나보세요" (형광펜) (NU:73) | 시트 안 hand 18 "외우지 말고 장면에서 그냥 만나보세요"(K:292), 형광펜 없음 | 크기·형광펜·"다섯" |
| 122 | 본문 위치 | absolute left/right 24 top 176 (NU:75) | 시트 padding 16 안 | 위치 |
| 123 | 단어 | MONO **24** bold + speaker 16, baseline 정렬 gap 8 (NU:76-78) | monoBold **22** + 탭 재생 speaker 16, center 정렬 (P:125-127) | 2pt·정렬 |
| 124 | 장면 카운터 | MONO 11 **bold** soft (NU:80) | nbText.mono(11) = 일반 굵기 + letterSpacing 1 (P:129, U:588) | 굵기·자간 |
| 125 | 카드 영역 | relative **height 300** marginTop 14 (NU:82) | marginTop 12, 높이 고정 없음 (P:132-133) | 높이·여백 |
| 126 | 뒷카드 2장 | i+2<n: inset 0 -8 auto 8, h240, #F7F1E1, 1px, **rotate 2°** / i+1<n: inset 0 -4 auto 4, h240, #FBF6E8, **-1.2°** (NU:84-85) | 없음 | 없음 |
| 127 | 장면 카드 | NbPaper rot 0 **테이프**(tapeLeft 130) + 그림자, padding 18/16/16, minHeight **240** (NU:88) | Pressable padding 16, minHeight **180**, 테이프·그림자 없음 (P:132-135) | 테이프·그림자·크기 |
| 128 | swap 장면 카드 | 1.5px dashed 앰버 (NU:88) | 같음 (P:133-134) | 일치 (참고, 개수 제외) |
| 129 | 누가 태그 | NbTag (1.4px, radius 2, hand 12.5, padding 0/6) 파랑/앰버 **rot -1** (NU:90, UI) | Text에 1.3px 테두리 hand **13**, 회전 없음, radius 없음 (P:137) | 굵기·크기·회전 |
| 130 | 톤 라벨 | hand 12.5 soft, 1.3px rgba(.3), **radius 2**, padding 0/6, nowrap (NU:92) | 같으나 radius 없음 (P:139) | radius |
| 131 | 장면 문장 | 본문 17 **600** lh 1.6 (=27.2) marginTop **16** (NU:94) | Pretendard-**Bold** 16 lh 25 marginTop 14 (P:141) | 크기·굵기·줄높이·여백 |
| 132 | 단어 형광펜 | `<mark>` linear-gradient(transparent 55%, #F9E37B 55%) padding 0/2 — 글자 상자의 **아래 45%만** (NU:71) | Text bg rgba(249,227,123,.7) — 글자 상자 **전체 높이** (P:142) | 형광펜 높이 (U:338 주석이 같은 문제 설명) |
| 133 | 한국어 | hand 14.5 soft marginTop 10 lh 1.4 (NU:95) | hand 14.5 soft marginTop 10, lh 미지정 (P:144) | 줄높이 |
| 134 | 넘김 안내 | absolute right 14 bottom 12 hand 12.5 soft "탭 → 다음 장면", **늘** 표시 (NU:96) | 흐름 안 오른쪽 정렬 marginTop 12 "탭하면 다음 장면"(K:293), 마지막 장(감상 없을 때) 숨김 (P:145) | 위치·문구 |
| 135 | 넘김 동작 | 탭 → nb-swipe-out 380ms → 다음 장면 nb-swipe-in (NU:69,87) | 즉시 교체 (P:132, S:141) | 애니 없음 |
| 136 | 마지막 장면 다음 | 장면 다 넘기면 자동으로 감상 카드 (NU:68,100) | 감상 칩 있는 릴만 감상 카드, 없는 옛 릴은 장면 끝 (S:63-68) | 콘텐츠 분기(17개 모두 칩 있음 — 참고) |
| 137 | 감상 카드 | nb-swipe-in 래퍼 + NbPaper rot -0.5 (그림자) padding 16/16/14 (NU:101-102) | View padding 16 rot -0.5, 1px 테두리, **그림자 없음**, marginTop 12 (P:86) | 그림자·애니·아래 패딩 |
| 138 | 감상 질문 | hand 18 "다섯 번 만난 **deteriorate**, 어떤 느낌이었나요?" — 단어만 **MONO bold** (NU:103) | hand 18 한 문자열 "{n}번 만난 {word}, …" — 단어 MONO 아님 (P:87, K:294) | 단어 글꼴 |
| 139 | 감상 힌트 | 11 soft marginTop 3 "정답 없음 — 감상 하나만 남겨요" (NU:104) | body 11 soft marginTop 3 (P:88) | 일치 (참고, 개수 제외) |
| 140 | 감상 칩 | padding 7/12, 1.6px (on 잉크 / rgba(.35)), on bg 잉크·글자 종이, hand 14.5, ±0.8°, **nowrap**, gap 8 marginTop 14 (NU:105-107) | 같음 단 미선택 테두리 rgba(.3), nowrap 없음 (P:89-106) | .35 vs .3, 줄바꿈 가능 |
| 141 | 감상 다시 고르기 | 언제든 다른 칩으로 바꿀 수 있음 (NU:107) | 첫 선택 후 잠금 (S:69-71) | 동작 (서버 저장 1회 정책 — 의도된 차이일 수 있음) |
| 142 | 감상 해설 | nb-reveal, marginTop 12, padding 7/10, 1.3 dashed 파랑, bg .05, hand 13.5 lh 1.45, 한 문단: **굵은 파랑 "뉘앙스"** + "맞아요 — …(고정 문구)… 이 느낌이 노트에 저장됐어요 ✎" (NU:110) | 애니 없음; "뉘앙스" 따로 한 줄 hand 13.5 파랑(굵지 않음) + why(콘텐츠) 별도 줄 lh 20 + 저장됨/실패 줄 hand 12.5 (P:110-116) | 인라인 한 문단 아님, 굵기, 저장 문구 위치 |
| 143 | 프로토타입 다시 보기 | "(프로토타입: 다시 보기)" (NU:112) | 없음 | 프로토타입 전용 — 구현 불필요(참고, 개수 제외) |
| 144 | 릴 CTA | bottom 34 "STEP 2 · 문장 학습 시작 ›" speech 아이콘, 감상 전 dashed .5 → 감상 후 ink (NU:117-119) | bottom 30 "다음" ink chevronRight, 끝나기 전 opacity .4 (S:168-171) | 문구·아이콘·dashed 상태 |

### 2-I. C5 ContextMatch (같은 뜻, 다른 장면)

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 145 | 화면 틀 | 자기 Frame: 태그 "STEP 2 · 문장 2/5" + 보조 "같은 뜻, 다른 장면", 5칸 바(지난 잉크·현재 **앰버**) (NU:139-140) | 공용 시트, 라벨 "같은 뜻 다른 장면"(K:286, 쉼표 없음) | 틀·바·문구 |
| 146 | 제목 | hand 21 "**deteriorate**(MONO)가 **어색한 장면**(형광펜)은 어디일까요?" (NU:139) | "이 자리에 안 맞는 말 하나는?"(K:299) hand 18 | 문구·단어 표시 (데이터에 word 없음 §4-4) |
| 147 | 메모 | NbMemo 파랑 rot -0.3 "뜻은 셋 다 “악화되다” — 듣는 사람이 달라요" (NU:142) | 없음 | 없음 (데이터에 ko 없음) |
| 148 | 장면 카드 | NbPaper(그림자) ±0.5° marginTop 11 padding 11/12, row gap 11 (NU:148) | Pressable marginTop 8 padding 11, 회전·그림자 없음 (P:173-176) | 회전·그림자·여백 |
| 149 | 선택 표시 | **boxShadow 링**: 선택 잉크 2px / 정답 초록 2.5px / 오답 빨강 2px (NU:148) | 테두리 1.6: 정답 장면 **빨강** + bg 빨강 .08, 오답 선택 **잉크** (P:174-175) | 정답 색이 반대(초록↔빨강), 오답 빨강 없음 |
| 150 | 아이콘 타일 | 42×42 radius 10, bg blue18, 1.5px 파랑, ±2°, 아이콘 24 (NU:149) | 아이콘 15 인라인 (P:178) | 타일 없음 |
| 151 | 누가 | hand 13.5 **soft** (NU:151) | hand 13 **파랑** (P:179) | 색·크기 |
| 152 | 장면 문장 | 14 weight 600 lh 1.5 marginTop 2 (NU:152) | body 13.5 marginTop 4 (P:181) | 크기·굵기 |
| 153 | 정답 장면 취소선 | line-through **빨강** 두께 2 + 글자 soft (NU:152) | line-through 기본색 (P:181) | 색·두께 |
| 154 | 고친 문장 | nb-reveal, marginTop 6, 13.5 700 lh 1.5, 빨강 hand "→" + 형광펜 mark(55%) (NU:153) | marginTop 4, 줄 전체 bg .55, 화살표 없음, 애니 없음 (P:182-184) | 화살표·형광펜·애니 |
| 155 | 도장 위치 | 정답 장면 카드 **안 오른쪽**에 Stamp(nb-ok) (NU:155) | 시트 아래 공용 해설의 도장 (P:288) | 위치 |
| 156 | 해설 | 장면 목록 아래 nb-reveal 점선 메모 "뉘앙스 + why" (NU:160) + 고친 문장은 카드 안 | 공용 해설: "이렇게 고쳐요" + 고친 문장 + 스피커 + why 메모 (P:295-306) | 구성 |
| 157 | 하단 | 확인하기 → [고친 문장 따라 말하기 paper mic flex1][다음 › ink speech] (NU:163-165) | 확인하기 → [다음] 만 (repeatText는 문장 카드만, S:108,178) | 따라 말하기 없음, 다음 버튼 아이콘(speech vs chevron) |

### 2-J. C6 SwapOne (한 단어 바꾸기)

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 158 | 화면 틀 | 태그 "STEP 2 · 문장 4/5" + 보조 "한 단어 바꾸기", 5칸 바(현재 앰버), 제목 "밑줄 친 말을 **더 어울리는 말**로 바꿔요" (NU:185-186) | 공용 시트, 지시문 "이 자리에 맞는 말로 바꾸세요"(K:300) | 틀·바·문구 |
| 159 | 문장 카드 | NbPaper rot -0.5 **테이프** 130 padding 16/16/14 (NU:188) | 카드 없음 — 시트 안 바로 (P:197) | 카드·테이프 |
| 160 | 누가 | 40×40 radius10 앰버 타일 + 아이콘 22 + NbTag **앰버** rot -1 (NU:189-192) | 아이콘 15 + hand 13 **파랑** (P:198-203) | 타일·색·태그 |
| 161 | 문장 | 19 **600** lh 1.7 marginTop 14 (NU:193) | body 16 lh 26 marginTop 8 (P:204) | 크기·굵기·여백 |
| 162 | 대상 단어 | 빨강 밑줄 두께 2.5 offset 5 → 결과 후 **취소선** + soft (NU:196) | 굵은 기본 밑줄 → 고르면 **대체**되어 사라짐 (P:206-208) | 색·두께·취소선 |
| 163 | 고른 말 | 대상 단어 **위에 얹힘**: absolute top -26 가운데, rotate -3°, hand 17, 파랑→결과 초록/빨강, 종이 bg, 아래 1.5px currentColor, nb-reveal (NU:197) | 대상 자리에 handBold 파랑으로 **치환**, 결과색 없음 (P:206-207) | 표현 방식 전혀 다름 |
| 164 | 한국어 줄 | hand 13.5 soft marginTop 8 "어젯밤 어머니가 돌아가셨어요 — 라고 전해야 해요" (NU:201) | 없음 (데이터 없음 §4-4) | 없음 |
| 165 | 안내 줄 | hand 14.5 soft marginTop 14 "바꿀 말 — 하나만 골라 위에 얹어요" (NU:203) | 없음 | 없음 |
| 166 | 후보 | 가로 wrap 칩 gap 8 marginTop 8: padding 8/14, 1.6px 잉크(결과 초록/빨강), bg 선택 노랑 .5 / 결과색 / 종이, MONO 13.5 bold, ±1°, 미선택 그림자 1px 2px 0 .2 (NU:204-209) | 세로 Option 행 (padding 11/12, 회전·그림자 없음, 선택 시 노랑 없음) (P:211-217) | 형태·선택색 |
| 167 | 후보별 해설 | 결과 후 목록: MONO 11.5 bold(정답 초록·나머지 soft) 폭 84 + hand 13 해설, 옆에 Stamp (NU:210-222) | 각 Option 밑에 hand 13 soft 해설 (P:215) | 배치·색 |
| 168 | 뉘앙스 메모 | marginTop 10 점선 메모 (NU:223) | 공용 해설 why 메모 (P:301-306) | 위치 |
| 169 | 하단 | [바꾼 문장 따라 말하기][다음 ›] (NU:228-231) | [다음] 만 | 따라 말하기 없음 |
| 170 | Stamp 회전 | Stamp 컴포넌트엔 회전 없음 → nb-ok 키프레임의 rotate(-10°)로 기울어짐 (NU:22,46-51) | 도장 -10° 고정 (P:290) | 일치 결과 — 참고(개수 제외) |

### 2-K. 아이콘 · 공용 부품

| # | 화면/요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 171 | faceWorried | SL에서 쓰지만(SL:15,17) NbIcon 세트에 **없음** → star로 떨어짐 (NB:49) | NbIcon 세트에도 없음 (I:19-57) — 이름 넣으면 같은 star 폴백 | 핸드오프 자체 결함 — 질문 Q8 |
| 172 | 기타 SL 아이콘 | bandage·shield·board·compass·star·speaker·mic·pencil·bulb·check·speech·pill·monitor·chartup·faceAngry (SL 전체) | 전부 있음 (I:19-57) | 차이 없음 (참고, 개수 제외) |
| 173 | ✎ / ✓ / ✕ / › / ‹ / → | 글리프 문자로 씀 (SL:38,120,226; NU:153; 버튼 ›) | 글리프 래칫(theme/glyphs.test.ts: src/app 0, components ≤1)으로 금지 — 아이콘으로 대체해야 함 | 구현 규칙 (§5) |

> 표의 #는 순번이다. "참고/일치(개수 제외)"로 표시한 12행(5, 51, 52, 89, 91, 97, 104, 128, 139, 143, 170, 172)과 규칙 행 173을 빼면 **실제 차이 160행**.

---

## 3. 애니메이션 표

| 이름 | 언제 | keyframes 값 | 시간 / 이징 / 기타 | 우리 쪽 |
|---|---|---|---|---|
| `nb-swipe-out` (NU:16-17) | 릴: 장면 카드 탭 → 나감 | 0% translateX(0) rotate(0) → 100% translateX(-120%) rotate(-8deg) opacity 0 | .38s cubic-bezier(.4,.05,.6,1) both, pointer-events none; 380ms 뒤 다음 장면 (NU:69) | **없음** |
| `nb-swipe-in` (NU:18-19) | 릴: 새 장면 카드 등장(key=i), 감상 카드 등장 | 0% translateX(30px) scale(.96) opacity 0 → 100% none opacity 1 | .3s ease-out both | **없음** |
| 뒷카드 두 장 (NU:84-85) | 릴: 남은 장면이 1장/2장 이상일 때 | 정적: rotate 2° / -1.2°, 남은 수가 줄면 사라짐(전환 없음) | — | **없음** |
| `nb-reveal` (NU:20-21, WL:31-32) | 해설 펼침 · 감상 해설 · C5 고친 문장/뉘앙스 · C6 얹힌 말/해설 | 0% opacity 0 translateY(-6px) → 100% opacity 1 none | .3s ease-out both | **없음** |
| `nb-ok` (NU:22-23, WL:29-30) | GOOD/RETRY 도장 찍힘 | 0% scale(.6) rotate(-20deg) opacity 0 → **70%** scale(1.08) rotate(-10deg) opacity 1 → 100% scale(1) rotate(-10deg) | .35s ease-out both (CSS라 구간마다 ease-out) | **없음** |
| `nb-shake` (WL:25-26) | 오답 확인 시 현재 장 래퍼 | 0%,100% translateX(0); 25% -5px; 75% +5px | .3s ease both; 320ms 뒤 클래스 해제 (SL:174) | **없음** |
| `nb-tear-l` (WL:16,18) | "아직 헷갈려요" → 장이 왼쪽으로 뜯김 | 0% rotate(0) translate(0,0) → **18%** rotate(3deg) translate(-3px,-6px) → 100% rotate(-22deg) translate(-300px,-80px) opacity 0 | .62s cubic-bezier(.3,.6,.4,1) both, **transform-origin top right**, pointer-events none, zIndex 6; 620ms 뒤 다음 장 (SL:180) | **없음** |
| `nb-tear-r` (WL:15,17) | "외웠어요/이제 알겠어요" → 오른쪽 | 0% → 18% rotate(-3deg) translate(3px,-6px) → 100% rotate(22deg) translate(300px,-80px) opacity 0 | .62s cubic-bezier(.3,.6,.4,1) both, **transform-origin top left** | **없음** |
| `nb-rise` (WL:19-20) | 새 현재 장(key='cur'+i) · 완료 낱장 | 0% translateY(6px) scale(.985) → 100% none | .4s ease-out both | **없음** |
| `nb-stub` (WL:21-22) | i>0 될 때마다 뜯긴 자국(key='stub'+i) | 0% opacity 0 scaleY(.4) → 100% opacity 1 none | .3s ease-out both, transform-origin top | **없음** |
| 진행 바 색 전환 (SL:195, NU:74) | 장/장면 넘길 때 칸 색 | background 전환 | transition background .3s | **없음**(바 자체 없음) |
| `nbl-pop` (LS:14-15) | C' 완료 도장 · C1 스피커 | 0% scale(.6) opacity 0 → 70% scale(1.08) → 100% scale(1) opacity 1 | .35s cubic-bezier(.3,.7,.4,1.2) both | **없음** (C' 쪽 완료를 택하면 필요) |
| `.nb-press` (UI:17-18) | 모든 NbButton 눌림 | :active translate(1.5px,2px) rotate(0) 그림자 제거 | transition transform/box-shadow .06s ease | 즉시 전환만 (U:205-219) |
| `nb-flip` (WL:23-24) | 정의만 있고 SL·WL에서 **안 씀** | — | — | 해당 없음 |

> 핸드오프 STEP 2 화면에서 실제로 쓰는 애니메이션 10종(swipe-out, swipe-in, reveal, ok, shake, tear-l, tear-r, rise, stub, 진행 바 전환) **전부 미구현**. C'을 택하면 nbl-pop까지 11종.

---

## 4. 우리 콘텐츠 · 서버와 충돌하는 점

측정: `server/content/nurse/scenarios/*.yaml` 333파일 파싱 — 상황 20,386개 중 **문장이 있는 상황 2,206개, 문장 12,516개**.

1. **order 카드가 사실상 0장.** 문장 있는 상황 2,206개 중 2,205개가 **서로 다른 goal 2개**(1개 1건). `orderAnswer`(D:31-35)는 goal당 1문장 → 최대 2문장 → `>= 3` 조건(D:49) 미달 → order 카드가 안 만들어진다. 단위 테스트(`mobile/src/data/sentenceDrill.test.ts:8-22`)는 goal 1·1·2·3·4 픽스처라 order 카드가 나와 통과하지만, 실제 콘텐츠와 다르다. 핸드오프 order는 "공감→이유→확인→감사" 4줄. 같은 goal 안의 문장 순서를 쓰든, order 전용 저작을 하든 규칙이 필요. **(질문 Q5)**
2. **문장마다 필요한 필드가 콘텐츠에 없다.** `Sentence`는 en·ko·chunks·words·goal 5개뿐(server/internal/domain/content/content.go:288-303, mobile/src/api/client.ts:68-72; 12,516문장 전부 이 5개만). 핸드오프 낱장에는 문장별 **tag**(시트 헤더 파란 태그), **icon**(앰버 원), **why**("왜?" 박스)가 매 장 필요하고, blank는 **옵션별 아이콘**, order는 **줄별 아이콘 + 카드 설명(ko "불만 환자 응대 4문장 순서")**, build는 **저작 디코이 1개**가 필요. 1:1 구현의 가장 큰 막힘. **(질문 Q6)**
   - 화면 제목줄(#15)의 **짧은 상황 이름**("반복 신원확인", "구급대 인계")도 없다 — `situation.title`은 "통증 척도 초기 사정 · Marcus Bell"처럼 긴 이름 + 인물명이다. 레이아웃이 아니라 콘텐츠 공백.
3. **문장 수 ≠ 6.** 상황당 문장 5개 959곳 · 6개 1,015곳 · 7개 227곳 · 8개 4곳 · 10개 1곳. 핸드오프는 6장 고정. 우리 덱은 여기에 reel·order·nuance가 더해져 6~10장. **(질문 Q1과 함께)**
4. **릴·C5·C6 데이터 모양 차이.**
   - 릴(reel)은 **17개 상황(ER)에만** 있고 장면이 전부 **4개**(핸드오프 5). 감상 칩은 17개 모두 있음. 나머지 2,189개 상황은 워밍업이 없다. **(질문 Q4)**
   - context 414개: 키 = kind·words·why·scenes(장면 = who·icon·en·ok·fix). 핸드오프 제목의 **단어**(`word`)와 메모의 **한국어 뜻**(“악화되다”)이 없다.
   - swap 373개: 키 = kind·words·why·who·icon·before·options·answer·notes. 핸드오프의 **한국어 번역 줄**("…라고 전해야 해요")이 없다.
   - 상황당 nuance는 slider/pair(STEP 1용) + context **또는** swap 1~2개 조합이라, C5·C6가 둘 다 있는 상황은 일부뿐.
5. **오답 디코이 출처.** 핸드오프는 listen 3지·blank 4지·build 디코이를 **저작**한다. 우리는 같은 상황의 다른 문장에서 뽑는다(D:57-96) — 그래서 blank 선택지 아이콘·의미 대비가 핸드오프처럼 되지 않는다(예: "repetitive / important / annoying / quick" 같은 같은 품사 대비가 아니라 다른 문장 조각).
6. **문장을 노트에 남길 API가 없다.** 핸드오프 "아직 헷갈려요 → 노트에 저장", 완료 집계 "틀림 → 노트". 서버엔 단어용 `POST /me/lesson/{id}/words/{wordId}/confused`(client.ts:852-855)와 감상용 `/reel/feel`(client.ts:858-862)만 있고, 문장용은 없다. `clearLessonStep(id,'sentences')`도 missed 없이 호출(S:99). 서버 작업 필요.
7. **"다시 듣기 · 2회" 제한.** 우리 재생은 expo-speech 무제한(P:18,228). 2회 제한을 실제로 걸지, 문구만 둘지. **(질문 Q7)**
8. **C' 완료의 발음 점수.** C'은 문장별 따라 말하기 점수(91·88·76…)를 보여 주는데, STEP 2 안에서 문장별 점수를 모으는 흐름이 지금 없다(따라 말하기는 발음 화면으로 나갔다 돌아옴, S:88-91). C'을 택하면 점수 수집·전달이 필요.

### 사용자에게 물어야 할 것 (이것만)

- **Q1. STEP 2 덱 구성** — v46 `SentStudyLive`처럼 "문장 낱장 N장(4유형 교대)"만 하고 C0/C5/C6는 별도 화면으로 앞·뒤에 붙일지, 지금처럼 한 덱에 섞을지. C5/C6를 넣는다면 위치(낱장 사이 vs 낱장 뒤). 핸드오프의 "문장 2/5·4/5"는 v45 기준이라 v46에서 자리가 정해져 있지 않다.
- **Q2. 완료 화면** — v46 낱장 완료(DONE 파란 도장 + 바로 맞힘/틀림→노트 + "STEP 3 정답이 돼요") vs C'(PASSED + 문장별 발음 점수). 
- **Q3. StepTrack** — 07은 "STEP 화면 상단에 항상"인데 v46 낱장 화면(단어장 포함)에는 없다. 뺄지 둘지.
- **Q4. 워밍업 릴이 없는 상황(2,189개)** — 릴 없이 바로 낱장으로 갈지, 릴을 전 상황에 저작할지. 장면 수 4 vs 5도.
- **Q5. order 유형** — goal이 2개뿐이라 지금 규칙으론 안 나온다. 규칙을 바꿀지(예: 같은 goal 문장 순서), order 전용 저작을 할지, 유형에서 뺄지.
- **Q6. 문장별 tag·icon·why 등 새 필드** — 12,516문장에 저작할지(생성 파이프라인), 없을 때의 대체 표시(예: 상황 아이콘·태그 생략·'왜?' 박스 생략)로 갈지. 유형 배정도 저작(핸드오프) vs 계산(우리)?
- **Q7. "다시 듣기 · 2회"** — 실제 제한인지 표시만인지.
- **Q8. faceWorried 아이콘** — 핸드오프에 그림이 없다(star로 폴백). 새로 그릴지, 다른 아이콘으로 바꿀지.

---

## 5. RN 구현 시 주의할 점

1. **애니메이션 방식 — 앱 관례는 RN 코어 `Animated` + `useNativeDriver: true`.** 수첩 부품이 이 방식이다: `mobile/src/components/nb/NbStampNode.tsx:58,139-144`, `mobile/src/components/nb/PageCurl.tsx:124,190`(`Easing.bezier`). Reanimated 4.3.1 + worklets 0.8.3도 설치돼 있지만 map/engine(`src/map/*`, `src/engine/*`)에서만 쓴다. 수첩 화면은 `Animated`로 맞추는 게 일관적.
2. **다단 키프레임은 `src/data/keyframes.ts`의 `keyframeSegments`로.** 이 파일 주석대로 CSS는 키프레임 **구간마다** 이징을 다시 거는데 `Animated.timing`+`interpolate` 하나로 하면 전체에 한 번만 걸려 "팝"이 사라진다. 해당: `nb-ok`(0/70/100), `nb-tear-l/r`(0/18/100), `nb-shake`(0/25/75/100), `nbl-pop`(0/70/100). 구간별 timing을 `Animated.sequence`로.
3. **이징 값 그대로**: swipe-out `Easing.bezier(.4,.05,.6,1)`, tear `Easing.bezier(.3,.6,.4,1)`, nbl-pop `Easing.bezier(.3,.7,.4,1.2)`(오버슈트), ease-out = `Easing.out(Easing.ease)` 근사, ease = `Easing.ease`.
4. **transform-origin**: RN 0.85는 `transformOrigin` 스타일 지원 — tear는 `'top left'`/`'top right'`, stub은 `'top'`. NbStampNode.tsx:130 주석에 Animated.View에서 동작 확인 기록 있음.
5. **`translateX: -120%`** (swipe-out)는 RN transform에 % 불가 → `onLayout`으로 카드 폭을 재서 `-1.2 * width`.
6. **타이밍 의존 상태**: 핸드오프는 setTimeout 380/620/320ms로 상태를 바꾼다. RN에선 `Animated.timing(...).start(({finished}) => …)` 콜백에서 다음 장으로 넘기고, 뜯기는 장은 결과가 남은 채 별도로 렌더(zIndex 위)해야 한다(SL:214).
7. **CSS 대체물 — 이미 선례가 있다.**
   - `3px double` 도장 → `NbStamp`(U:295-318)처럼 링 2개 View. 지금 SentReveal(P:288)·RecallReveal(R:240)은 단선.
   - 빗금(사용한 칩) `repeating-linear-gradient(-45deg…)` → SVG 선(NbGauge 선례, U:408 이후).
   - stub 톱니 `clipPath: polygon(...)` → react-native-svg `ClipPath`/`Path`(StepTrack.tsx 선례).
   - 줄노트 배경 → `NbSheet`(U:36).
   - 형광펜 `linear-gradient(transparent 55%, #F9E37B 55%)` → `NbMark`(U:338, 줄마다 아래 45% 밴드). 릴 단어처럼 **문장 중간의 일부 단어**는 NbMark가 블록이라 인라인이 어려움 — `markInline`(U:372)은 Text backgroundColor라 글자 상자 **전체 높이**를 칠한다(핸드오프는 아래 45%만) — 1:1이 아님. 인라인 부분 형광펜 방법이 따로 필요.
   - `boxShadow: 0 0 0 2px color`(C5 선택 링) → RN엔 spread 그림자가 없음 → 바깥 테두리 View로.
   - 하드 그림자 `1px 2px 0 rgba(.2)`(칩) → iOS `shadowRadius: 0` + offset, Android는 elevation이 블러라 맞지 않음 → 아래에 깔린 오프셋 View가 안전.
   - `text-decoration-color`/`thickness`/`underline-offset`(C6) → iOS만 `textDecorationColor` 지원, 두께·오프셋은 없음 → 밑줄/취소선은 View 선으로 그려야 1:1.
8. **글리프 래칫** (`mobile/src/theme/glyphs.test.ts`): `‹ › ✓ ✕ → ★` 등이 src/app 0개, src/components ≤1개로 묶여 있다. 핸드오프의 "‹ 나가기", "다음 ›", "STEP 3 … ›", A/B/C 원의 ✓/✕, C5의 "→", 완료 문구의 "✎"는 NbIcon(chevronLeft/chevronRight/check/cross/pencil)으로 그린다. ✎는 정규식엔 없지만 W:157-162가 이미 pencil 아이콘으로 바꿨으니 같은 관례로.
9. **STEP 1 부품 재사용** — 통일 규칙상 같은 모양: A/B/C 원 선택지(R:56-77), 형광 조립 라인 + 플레이스홀더(R:92-101), 판정 버튼 2개·진행 바·DONE 집계(W:124-132,180-190,211-221). 단 STEP 1 쪽도 링·뒷장·stub·tear·shake·rise 애니가 없고, 앰버 원 -4° 회전·이중선 도장·조각별 형광/개별 빼기도 빠져 있으니 **공용 Sheet 부품으로 뽑아 두 화면에 함께 적용**하는 편이 맞다.
10. **React Compiler 켜짐** (`mobile/app.json:107`). 모듈 상태를 렌더 중에 읽으면 인스턴스당 한 번만 계산된다 — 장 인덱스·fuzzy 목록 등은 훅 반환값에서 파생. 번역도 컴포넌트 안에서(`askKey` 주석 S:30-31, useT.test).
11. **스크롤 영역 고정**: 핸드오프는 묶음 영역 top 172~bottom 182 고정 + 내부 스크롤(07:226). RN은 safe-area에 따라 top이 바뀌므로 숫자 대신 헤더 아래부터 판정 버튼(bottom 98) 위까지로 잡고, 뒷장 두 겹은 현재 장 높이를 따라 늘어나도록 `absolute` inset으로.
12. **Pressable 눌림 전환**: 핸드오프 .06s 전환은 Pressable로는 즉시 — 미세하지만 1:1을 원하면 Animated로.
