# 대조 — 상황 허브(A·A'·A-b·A-c) · STEP 3 가이드 대화(D·D') · STEP 4 자유 대화(E) vs 핸드오프 v46

읽기 전용 감사(2026-10-07). 코드는 고치지 않았다.

**약칭**
- 핸드오프 (`docs/dlc/projects/forin/inputs/design-handoff_v46/reference/`):
  `lesson.jsx` = forin-notebook-lesson.jsx · `dialogue.jsx` = forin-notebook-dialogue.jsx ·
  `ui.jsx` = forin-notebook-ui.jsx · `nb.jsx` = forin-notebook.jsx · `07` = ../07_NOTEBOOK_REDESIGN.md
- 스펙: `spec` = docs/dlc/projects/forin/02-construction/lesson-four-steps-v44/build-spec-index.md ·
  `plan` = 같은 폴더 implementation-plan.md
- 우리 (`mobile/src/`): `hub` = app/scenario/[id]/index.tsx · `ST` = components/lesson/StepTrack.tsx ·
  `GT` = components/lesson/GuidedTarget.tsx · `dlg` = app/dialogue/[id].tsx · `NbUI` = components/nb/NbUI.tsx ·
  `MC` = components/dialogue/MissionCluster.tsx · `RH` = components/ResizeHandle.tsx · `ko` = i18n/catalog/ko.ts ·
  `nb.ts` = theme/nb.ts

**분류**
- **미구현** — 핸드오프에 있는데 우리에게 없다.
- **다름** — 있지만 값·모양·문구·동작이 다르다.
- **다름(구현기록)** — `plan`의 "구현하며 바꾼 것"이나 코드 주석에 이유가 적혀 있지만, **사용자 결정으로 기록된 것은 아니다**. 승인된 편차로 보지 않았다.
- **승인된 편차** — `spec` §5·§6(결정 1~4)에 사용자 결정으로 기록된 것.
- **추가** — 핸드오프에 없는 것이 우리에게 있다(참고로 적음, 지울지 물어볼 것).

---

## 1. 요약 — 큰 차이

1. **D/D' 가이드 대화의 입력부가 통째로 빠졌다(미구현).** 핸드오프의 `말하기 / 타이핑` 알약 스위치(dialogue.jsx:151-157), 84px 빨간 원형 큰 마이크 + "꾹 누르고 영어로 말하기"(:159-163), 타이핑 카드("영어로 적어보세요" 라벨 · 밑줄 필기란 · 커서 · 단어 칩 3개 · "단어 칩 탭 → 삽입", :164-176)가 하나도 없다. 우리는 STEP 4 자유 대화의 입력줄(38px 마이크 상자 + 한 줄 TextInput)을 그대로 쓴다(dlg:1082-1137). `plan` J에 "기존 입력 영역을 그대로 썼다"고만 적혀 있고 사용자 결정 기록은 없다.
2. **D/D' 하단 레일 구성이 다르다.** 핸드오프 D = `▷ 보내기 · 듣기(speaker) · 노트(board)`(:178-182). 우리 = `보내기(ink, pencil) · 힌트(bulb) · [퀴즈 있을 때만 board]`(dlg:1140-1170). 듣기는 목표 카드 안으로 옮겨졌고(GT:53-57), 힌트는 핸드오프 D에 없는 버튼이다. `보내기`는 핸드오프에서 종이 카드(비활성 soft/.6 → 타이핑 시 잉크 + 노란 배경)인데 우리는 잉크 NbButton이다. board는 핸드오프에선 '노트'(07:212), 우리는 퀴즈 링크다.
3. **대화 무대(Stage)가 핸드오프와 다른 구조다.** 핸드오프 = 고정 높이 236(E)/168(D, short) + 고정 배경 `#F6E3DC` + 폴라로이드 가운데 + 이름표·감정 태그는 **왼쪽(left 22)**, 스피커 버튼은 **오른쪽(right 26)** 독립 배치. 우리 = 사용자가 끌어 조절하는 분할(기본 `winH·0.41+34`), 부서색 워시(deptWash), 이름표가 폴라로이드 **아래**(또는 왼쪽 옆), 음성 토글이 폴라로이드 오른쪽에 붙음. D의 short 무대(168, 폴라로이드 92)는 없다.
4. **픽셀 라인 잔재가 수첩 대화 화면에 남아 있다.** 음성 토글 = `PixelIcon volume` + 하드 오프셋 그림자 + 2.5px 잉크 테두리(dlg:800-804; 핸드오프는 NbPaper rot 2 · 32×32 · NbIcon speaker 17), 최신 NPC 말풍선 테두리 = `moodBorder`가 픽셀 토큰 `colors.red` 반환, 그래버 = `RH`가 `colors.ink` 불투명도 .45·radius 3(핸드오프 rgba(62,54,43,.25)·radius 99), 로딩 배경 `#1F2937`, 이어하기/나가기 시트의 FIcon·2.5px 테두리·하드코딩 한국어.
5. **초상화가 다르다.** 핸드오프 대화 무대는 역할별 낙서 초상(Portrait svg 118×130, patient/medic, dialogue.jsx:14-27). 우리는 NbAvatar(110×scale) — 앱의 v34 결정이지만 이번 스펙에는 기록이 없다.
6. **허브 '진행 중' 티켓 강조 방식이 다르다.** 핸드오프는 1px 종이 테두리 + 그림자는 그대로 두고 바깥에 `0 0 0 2.5px 색` 링을 더한다(lesson.jsx:90). 우리는 테두리를 2.5px 색으로 **바꾼다**(hub:263) — 테두리가 안쪽으로 들어와 내용이 1.5px 밀리고 종이 가장자리가 사라진다.
7. **허브 표지·태그 세부가 여러 군데 다르다.** 태그 글자 10.5 → 우리 12.5(4곳), 레벨 태그의 shield 아이콘·위치 태그의 siren 아이콘 없음, 한 줄 상황에 형광펜(NbMark) 없음, 감정 칩이 `짜증남`(한국어) 대신 `ANGRY`(영어 대문자), `+60 XP`가 `+60XP`(공백 제거 regex), `노트 자동저장` → `노트 저장`, 부제 `ER · 투약 안전 · 오류 예방 · 3/34` → 부서명만, 완료 도장에 `✓` 윗줄 없음, 건너뜀 카드에 빗금 배경 없음.
8. **NbUI 공용 부품의 시각값이 핸드오프와 다르다(모든 화면에 퍼짐).** NbButton ink/yellow/danger의 **하드 오프셋 그림자**(`2.5px 2.5px 0 rgba(62,54,43,.3)` 등)가 우리에선 흐린 paperShadow, NbGauge 빗금이 2톤(66/3d)이 아니라 1톤 + 빈칸, 빗금 간격 다름, NbStamp 이중선 두께·간격, NbMark 형광 띠 위치(55%~100% → 50%~92%), NbTag 세로 패딩 1, `nbText.mono`의 letterSpacing 1(핸드오프 STEP 라벨·카운트에는 없음), 모노 굵기 700 → SemiBold(600).
9. **글리프가 아이콘으로 바뀌었다(다름(구현기록)).** `←`, `시작 ›`, `STEP n 이어서 ›`, `다시 풀기 ↺`, `✕`, `✓ 상황 종료`, `미션 4 ∨`, `▷ 보내기`, 완료 배지 `✓` — 저장소 규칙(theme/glyphs.test.ts, NbUI:184-185 주석)이 이유지만 스펙 결정은 아니다.
10. **StepTrack 연결선 규칙이 핸드오프와 다르다.** 핸드오프는 `i < done`일 때만 초록 실선(lesson.jsx:43). 우리는 그 단계까지 전부 `done|skip|empty`면 실선(ST:36) — 레벨 b·c에서 아무것도 안 했는데도 건너뛴 칸 뒤 연결선이 초록 실선이 된다.
11. **보기 3개(ReplyChoices)가 아직 살아 있다.** STEP 2 문장이 없는 상황에서 D가 핸드오프가 폐기한 '보기 3개 중 선택'으로 돌아간다(dlg:1048-1076). `plan` J 기록만 있다.
12. **애니메이션:** 핸드오프에서 이 화면들에 적용되는 건 `.nb-press`(0.06s ease) 하나뿐인데 우리 누름은 즉시 바뀐다(전환 없음). 반대로 우리에게는 핸드오프에 없는 움직임이 9가지 있다(§3).

**차이 개수**: 대조표 167행 중 **차이 127건** — 미구현 15 · 다름 76 · 다름(구현기록) 12 · 승인된 편차 10 · 추가 14 (그 밖에 같음/비교대상 아님 39행, 질문 1행). 애니메이션 표 14행 — 다름 2 · 추가 9 · 해당 없음 3.

---

## 2. 대조표

### 2-A. 허브 — 프레임·헤더

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 1 | 프레임 하단 탭바 | ui.jsx:167-175 NbFrame nav=true, 높이 68, 탭 5개(일터 활성) | hub:136-220 탭바 없음 | 탭바 없음 | 승인된 편차 (spec 결정 4) |
| 2 | 스크롤 영역 | lesson.jsx:109 `top:44, bottom:68, paddingBottom:96` | hub:139 전체 화면, `paddingTop:52, paddingBottom:96` | 아래 68 예약 없음 | 승인된 편차 (결정 4) |
| 3 | 줄노트 배경 | ui.jsx:164 `repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)` → 선이 y=27,55,… | hub:297-308 선 top=(i+1)·28 → y=28,56,… (dlg:1282-1291 Rules 동일) | 선 위치 1px 아래 | 다름 |
| 4 | 상태바 | ui.jsx:165 9:41 ▮▮▮ 높이 44 (목업) | 시스템 상태바 | 목업 요소 — 구현 대상 아님 | — |
| 5 | 헤더 행 | lesson.jsx:52 `gap 10, padding '8px 20px 0'` (y=52) | hub:140 gap 10, paddingH 20, top 52 | 같음 | — |
| 6 | 뒤로 버튼 | lesson.jsx:50 NbPaper rot -1 32×32, 글자 `←` Gaegu 16 ink | hub:141-145 NbPaper rot -1 32×32, `chevronLeft` 아이콘 16 | 글리프 → 아이콘 | 다름(구현기록: 글리프 금지 규칙) |
| 7 | 제목 | lesson.jsx:55 Gaegu 21, lineHeight 1.1, nowrap+ellipsis | hub:147 hand(21), lineHeight 없음, 1줄 | lineHeight 1.1(23.1) 없음 | 다름 |
| 8 | 부제 | lesson.jsx:56/110 10.5 soft, marginTop 2, 내용 `ER · 투약 안전 · 오류 예방 · 3/34`(부서·주제·소주제·순번/전체) | hub:148 body(10.5) lineHeight 16.3, marginTop 1, 내용 `b.dept`만 | 커리큘럼 좌표 없음, marginTop 1, lineHeight 추가 | 다름 |
| 9 | 헤더 오른쪽 레벨 태그 | lesson.jsx:110 NbTag blue, **fontSize 10.5**, `shield` 아이콘 11 + `기초` | hub:150 NbTag blue 12.5, 아이콘 없음, `기초/중급/실전` | 글자 12.5, shield 없음 | 다름 |
| 10 | 레벨 판정 근거 | lesson.jsx:68-70 온보딩 입국심사 답 a/b/c | hub:41-44 CEFR 문자열에서(`A*`→기초, `B1`→중급, 그 외→실전) | 서버가 준 skip 집합과 라벨이 어긋날 수 있음 | 다름 |

### 2-B. 허브 — 표지 카드

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 11 | 표지 종이 | lesson.jsx:112-113 margin '14px 20px 0', NbPaper rot -0.6, tape left 120, padding 13/14 | hub:154-155 같은 값 | 같음 | — |
| 12 | 테이프 | ui.jsx:36 74×20, top -10, rot -4, `boxShadow 0 1px 2px rgba(0,0,0,.08)` | NbUI:61-67 74×20 top -10 rot -4, 그림자 없음 | 테이프 그림자 없음(전역) | 다름 |
| 13 | 표지 행 | lesson.jsx:114 gap 13, center | hub:156 gap 13 center | 같음 | — |
| 14 | 폴라로이드 종이 | lesson.jsx:115 NbPaper rot -2.5, padding 5/5/2 | hub:157 같음 | 같음 | — |
| 15 | 폴라로이드 그림 영역 | lesson.jsx:116 NbAvatar size 72 → 72×78.75 (viewBox 64×70) | hub:158-160 72×**84** 상자 + overflow hidden + 아래 정렬 | 위쪽 5.25px 빈 여백 | 다름 |
| 16 | 아바타 모양 | lesson.jsx:116 hair short, darkbrown, mouth frown, eyes angry, outfit hospitalGown sky, bg plain (예시) | hub:159 `npcAvatarSpec(kind, seed, expr)` | 데이터 기반 — 감정→표정 연결은 됨 | — (콘텐츠) |
| 17 | 폴라로이드 이름 | lesson.jsx:118 MONO 8.5 **700**, ink, 가운데, nowrap | hub:161 IBMPlexMono-**SemiBold** 8.5, 1줄 | 굵기 700→600 | 다름 |
| 18 | 태그 3개 행 | lesson.jsx:121 gap 5 wrap | hub:166 gap 5 wrap | 같음 | — |
| 19 | 위치 태그 | lesson.jsx:122 NbTag red **10.5**, `siren` 아이콘 11 + `ER BAY 2`(위치) | hub:167 NbTag red 12.5, 아이콘 없음, `b.dept`(부서명) | 글자 크기·아이콘·내용(위치→부서) | 다름 |
| 20 | 레벨 태그 | lesson.jsx:123 blue 10.5 `Lv.B1` | hub:168 blue 12.5 `Lv.{level}` | 글자 12.5 | 다름 |
| 21 | 시간 태그 | lesson.jsx:124 soft 10.5 `~12분` | hub:169 soft 12.5 `b.timeLabel`(없으면 생략) | 글자 12.5, 조건부 | 다름 |
| 22 | NbTag 공통 | ui.jsx:74 padding '0 6px', fontSize는 style로 덮어씀 | NbUI:239-252 paddingV **1**, style이 View에만 가서 글자 크기 못 바꿈 | 세로 +2px, 글자 크기 오버라이드 불가 | 다름 |
| 23 | 한 줄 상황 | lesson.jsx:126 Gaegu 15 soft, marginTop 8, lineHeight 1.4, `“인용” — … <NbMark>왜 매번 확인하는지</NbMark> 설명하기` | hub:171-173 hand(15) soft, marginTop 8, lineHeight 21, `b.brief`/tagline 평문 | **형광펜 강조 없음**, 인용+목표 형식 없음 | 미구현 |
| 24 | 감정·보상·노트 칩 행 | lesson.jsx:130 gap 8, marginTop 11, 항상 3개 | hub:176 gap 8, marginTop 11, 기분·XP 없으면 생략 | 칩 개수 가변 | 다름 |
| 25 | 칩 상자 | lesson.jsx:132 flex 1, gap 6, padding 6/8, 1.3 dashed 색, radius 4, bg 색+10 | hub:178-181 같음 | 같음 | — |
| 26 | 감정 칩 아이콘 | lesson.jsx:131 `faceAngry` | hub:48-55 angry→faceAngry, pain→bandage, panic/worried→siren, 그 외 speech | 가까운 아이콘 대체 | 승인된 편차 (결정 4) |
| 27 | 감정 칩 글자 | lesson.jsx:131 `짜증남` (한국어 감정) | hub:131 `String(p.mood).toUpperCase()` → `ANGRY` | 영어 대문자 | 다름 |
| 28 | 보상 칩 글자 | lesson.jsx:131 `+60 XP` | hub:118 rewards에서 `/xp/i` 찾아 **공백 제거** → `+60XP` | 공백 사라짐 | 다름 |
| 29 | 노트 칩 글자 | lesson.jsx:131 `노트 자동저장` | ko:238 `노트 저장` | 문구 | 다름 |
| 30 | 칩 글자 줄바꿈 | lesson.jsx:133 Gaegu 12.5 nowrap | hub:183 numberOfLines 1 + flexShrink (말줄임 가능) | 넘치면 말줄임 | 다름(사소) |

### 2-C. 허브 — 단계 머리·게이지

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 31 | 단계 블록 위치 | lesson.jsx:140 margin '16px 20px 0' | hub:192 같음 | 같음 | — |
| 32 | `{n}단계로 익혀요` | lesson.jsx:142 Gaegu 17 ink | hub:194 hand(17), ko:229 | 같음 | — |
| 33 | 레벨 설명 | lesson.jsx:143 10.5 soft nowrap `기초 · 4단계 모두` | hub:195 body(10.5) lineHeight 16.3, 1줄 | lineHeight 추가 | 다름(사소) |
| 34 | `done/total` | lesson.jsx:145 MONO 11 **700** soft, 자간 없음 | hub:197 `nbText.mono(11)` → **letterSpacing 1** + SemiBold | 자간 +1, 굵기 600 | 다름 |
| 35 | 분모 | lesson.jsx:142,145 `4 - skipped.length` | hub:120 `gauge(steps)` — skip·empty 제외 | empty도 뺌 | 승인된 편차 (결정 3) |
| 36 | 게이지 | lesson.jsx:147 marginTop 6, NbGauge green height 9 | hub:199 같음 | 같음 | — |
| 37 | NbGauge 채움 | ui.jsx:105 `repeating-linear-gradient(-45deg, color66 0 5px, color3d 5px 10px)` — 40%/24% 2톤, 빈칸 없음, 수직 주기 10px | NbUI:413-421 선 strokeWidth 5, opacity .4, **가로 간격 10**(수직 주기 7.07), 사이는 종이색 | 2톤 → 1톤+빈칸, 주기 다름 | 다름 |
| 38 | NbGauge 틀 | ui.jsx:104 1.5 ink, radius 2, bg paper | NbUI:411 같음 | 같음 | — |

### 2-D. 허브 — 단계 티켓

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 39 | 건너뜀 카드 틀 | lesson.jsx:79 marginTop 10, padding 8/12, gap 12, 1.4 dashed rgba(62,54,43,.3), radius 4, rot ±0.4 | hub:236-239 같음 | 같음 | — |
| 40 | 건너뜀 카드 빗금 배경 | lesson.jsx:79 `repeating-linear-gradient(-45deg, rgba(62,54,43,.05) 0 4px, transparent 4px 9px)` | hub:236-239 배경 없음 | **빗금 없음** | 미구현 |
| 41 | 건너뜀 아이콘 타일 | lesson.jsx:80 36×36 radius 8, 1.4 rgba(.25), opacity .5, flexShrink 0, 아이콘 20 | hub:240-242 같음, flexShrink 없음 | 좁을 때 줄어들 수 있음 | 다름(사소) |
| 42 | 건너뜀 `STEP n` | lesson.jsx:82 MONO 10 700 soft, 자간 없음 | hub:245 mono(10) soft → letterSpacing 1, SemiBold | 자간·굵기 | 다름 |
| 43 | 건너뜀 라벨 간격 | lesson.jsx:83 별도 span `marginLeft 6` | hub:245 문자열 끝 공백 두 칸 `STEP n  ` | 간격을 공백으로 | 다름(사소) |
| 44 | 건너뜀 라벨 | lesson.jsx:83 Gaegu 16 soft, line-through | hub:246 같음 | 같음 | — |
| 45 | 건너뜀 설명 | lesson.jsx:84 10.5 soft, marginTop 2, nowrap `내 레벨에선 건너뛰어요` | hub:248-250 body(10.5) lineHeight, marginTop 2, ko:230 | lineHeight 추가 | 다름(사소) |
| 46 | `그래도 할래요` | lesson.jsx:86 NbButton dashed sm | hub:252 NbButton dashed sm, 누르면 옵트인 | 같음 | — |
| 47 | 콘텐츠 없음 카드 | 핸드오프에 없음 | hub:233-251 같은 점선 카드, 빗금 없음, 취소선 없음, `이 상황은 아직 준비 중이에요`, 버튼 없음 | 새 상태 | 승인된 편차 (결정 3) |
| 48 | 일반 카드 종이 | lesson.jsx:90 NbPaper rot ±0.5, marginTop 10, padding 11/12, gap 12, todo opacity .6 | hub:259-262 같음 | 같음 | — |
| 49 | '진행' 강조 | lesson.jsx:90 `boxShadow: 0 2px 6px rgba(62,54,43,.14), 0 0 0 2.5px 색` — 1px 종이 테두리 유지 + **바깥** 링 | hub:263 `borderWidth 2.5, borderColor 색` — 테두리 **교체**, 안쪽으로 1.5px 침범 | 링 위치·종이 가장자리·내용 위치 | 다름 |
| 50 | 아이콘 타일 | lesson.jsx:91-92 46×46 radius 10, bg 색+22, 1.6 색, rot ±2, 아이콘 26 | hub:265-270 같음 | 같음 | — |
| 51 | 단계 색·아이콘 | lesson.jsx:20-25 pencil/amber, speech/blue, speech/purple, mic/red | hub:33-38 같음 | 같음 | — |
| 52 | `STEP n` | lesson.jsx:96 MONO 10 700 색, 자간 없음 | hub:273 mono(10) → letterSpacing 1, SemiBold | 자간·굵기 | 다름 |
| 53 | 단계 라벨 | lesson.jsx:97 Gaegu 18 ink | hub:274 hand(18) | 같음 | — |
| 54 | 메타 행 | lesson.jsx:99 gap **6**, marginTop 4, nowrap | hub:276 gap **8**, marginTop 4, flexWrap | 간격 8, 줄바꿈 허용 | 다름 |
| 55 | 메타 항목 | lesson.jsx:100 gap 3, 10.5 soft nowrap, 아이콘 12 | hub:278-281 gap 3, body(10.5) lineHeight 16.3, 아이콘 12 | lineHeight 추가 | 다름(사소) |
| 56 | 메타 — 단어 | lesson.jsx:148 `단어 8` · `듣기` | hub:60 `단어 {n}` · `듣기` | n은 실제 개수 | — |
| 57 | 메타 — 문장 | lesson.jsx:149 `문장 5` · `따라 말하기` | hub:61 같음(n 실제) | 같음 | — |
| 58 | 메타 — 가이드 대화 | lesson.jsx:150 `한국어 가이드` · `말하기·타이핑` · star `+20` | hub:62 … · check `목표 {n}` | XP → 목표 개수 | 승인된 편차 (결정 4) |
| 59 | 메타 — 자유 대화 | lesson.jsx:151 mic `실전` · star `+40` | hub:63 mic `실전` · check `목표 {n}` | XP → 목표 개수 | 승인된 편차 (결정 4) |
| 60 | 완료 도장 | lesson.jsx:103 NbStamp green 40, **top `✓`**, bottom `완료` | hub:286 bottom만 `완료` | 윗줄 ✓ 없음 | 미구현 |
| 61 | NbStamp 이중선 | ui.jsx:87 `3px double` → 바깥 1px · 틈 1px · 안 1px | NbUI:303-310 바깥 1.4 + 안쪽 링(2.2 안쪽, 1.4) → 안쪽 링이 3.6~5.0 | 선 굵기·틈 | 다름 |
| 62 | NbStamp 글자 | ui.jsx:88-89 top Pretendard **800** size·.17 / bottom Gaegu size·.32 lineHeight 1 | NbUI:311-312 top Pretendard-**Bold**(700) / bottom lineHeight size·.34 | 굵기·행간 | 다름(사소) |
| 63 | `시작` 버튼 | lesson.jsx:103 NbButton ink sm `시작 ›` | hub:288 NbButton ink sm `시작` + `chevronRight` 아이콘 13 | 글리프 → 아이콘 | 다름(구현기록: 글리프 금지) |
| 64 | 잠금 | lesson.jsx:103 NbIcon lock 18 | hub:289 같음 | 같음 | — |
| 65 | 카드 전체 탭 | lesson.jsx 정적 | hub:260 카드 전체 Pressable(잠금 제외), 누름 시각효과 없음 | 탭 영역 추가 | 추가 |
| 66 | 상태 판정 | lesson.jsx:74-77 done 개수 + firstActive | hub:88 서버 state + 옵트인 | 구조 차이(결과는 같게) | 승인된 편차 (결정 3 판정 순서) |

### 2-E. 허브 — CTA

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 67 | CTA 위치 | lesson.jsx:154 `bottom 84`, left/right 20, zIndex 31 | hub:211 `bottom 30`, left/right 20, zIndex 31 | 84 → 30 | 승인된 편차 (결정 4) |
| 68 | CTA 버튼 | lesson.jsx:63 NbButton ink lg full, icon = 다음 단계 아이콘(없으면 star), iconColor #FFFdf4 | hub:212-218 같음 | 같음 | — |
| 69 | CTA 문구 — 시작 전 | lesson.jsx:154 `STEP n · {라벨}부터 시작` | ko:235 같음 | 같음 | — |
| 70 | CTA 문구 — 진행 중 | lesson.jsx:154 `STEP n 이어서 ›` | ko:236 `STEP n 이어서` | `›` 없음 | 다름(구현기록: 글리프 금지) |
| 71 | CTA 문구 — 전부 끝 | lesson.jsx:154 `다시 풀기 ↺` | ko:237 `다시 풀기` | `↺` 없음 | 다름(구현기록: 글리프 금지) |
| 72 | NbButton ink 그림자 | ui.jsx:58 `2.5px 2.5px 0 rgba(62,54,43,.3)` (하드 오프셋) | NbUI:130,218 paperShadow(0 2 6 .14 흐림) | 하드 → 흐림 (모든 ink/yellow/danger 버튼) | 다름 |
| 73 | NbButton 아이콘 간격 | ui.jsx:66 아이콘 marginRight 5 | NbUI:207 gap 5 | 같음 | — |
| 74 | CTA `dim` | lesson.jsx:61-63 dim이면 opacity .45 (허브에선 안 씀) | 없음 | 허브에선 해당 없음 | — |

### 2-F. StepTrack (STEP 화면 공통 머리 — 허브에는 핸드오프·우리 모두 없음)

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 75 | 입력 | lesson.jsx:26 `done`(개수)·`active`·`skipped` | ST:28 단계별 state 배열 | 구조 | 다름(구현기록: plan F) |
| 76 | 바깥 패딩 | lesson.jsx:28 padding '0 26px' | ST:31 paddingH 26 | 같음 | — |
| 77 | 칸 너비 | lesson.jsx:33 width 58 | ST:42 width 58 | 같음 | — |
| 78 | 원 | lesson.jsx:34 44×44 원, rot ±3 | ST:22,45,102 같음 | 같음 | — |
| 79 | 원 — now | lesson.jsx:35-36 2.2 색, bg 색+18 | ST:104 같음 | 같음 | — |
| 80 | 원 — done | lesson.jsx:35-36 2 green, bg rgba(95,141,90,.12) | ST:105 같음 | 같음 | — |
| 81 | 원 — skip | lesson.jsx:35-36 1.4 rgba(.25), 빗금 `rgba(62,54,43,.07) 0 3px, transparent 3px 7px` (수직 주기 7) | ST:106,114-128 1.4 rgba(.25), SVG 선 가로 간격 7(수직 주기 4.95), 굵기 3 | 빗금 밀도 1.4배 | 다름 |
| 82 | 원 — todo | lesson.jsx:35 1.6 dashed soft | ST:109 같음 (lock·empty 공통) | empty도 같은 모양 | 승인된 편차 (결정 3) |
| 83 | 아이콘 흐림 | lesson.jsx:37 todo·skip opacity .4 | ST:34,47 lock·skip·empty .4 | 같음 | — |
| 84 | 완료 배지 | lesson.jsx:38 17×17 원 green, 1.5 paper 테두리, 글자 `✓` 11 흰색 | ST:49-54 같은 원, `check` 아이콘 11 흰색(아이콘에 초록 워시 획 포함) | 글리프 → 아이콘 | 다름(구현기록: 글리프 금지) |
| 85 | 사선 | lesson.jsx:39 left/right -4, top 50%, 2px soft, rot -20 | ST:56-60 같음(top D/2-1) | 같음 | — |
| 86 | 라벨 | lesson.jsx:41 Gaegu 12.5, todo·skip soft, marginTop 4, now **700**, skip 취소선 | ST:63-73 같음, `fontWeight '700'`을 Gaegu에 줌 | iOS에서 커스텀 폰트 굵기 합성 안 될 수 있음(`Gaegu-Bold` 아님) | 다름(렌더 확인 필요) |
| 87 | 연결선 실선 조건 | lesson.jsx:43 `i < done` → 2px solid green | ST:36 그 단계까지 전부 done/skip/empty → green | 레벨 b(done 0)에서 1번 연결선이 초록 실선이 됨 | 다름(구현기록: plan F) |
| 88 | 연결선 점선 | lesson.jsx:43 borderTop 2px dashed rgba(.25), marginTop -18 | ST:88-99 4×2 조각 12개, 간격 3, marginTop -18 | 브라우저 점선 대신 조각(이유: iOS 한쪽 점선 불가) | 다름(구현기록: plan H) |
| 89 | 대화 화면 상단 노출 | 07:202 "STEP 화면 상단에 항상 노출", spec §3 "모든 STEP 화면 위에" / 그러나 D·E 아트보드엔 없음 | dlg 에 StepTrack 없음 | 핸드오프 내부 불일치 | 질문 |

### 2-G. 대화 공통 — 상단 바·무대 (D·D'·E)

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 90 | 상단 바 위치 | dialogue.jsx:31 absolute **top 50**, left/right 16, **alignItems center**, zIndex 5 | dlg:699 paddingTop **52**, paddingH 16, **alignItems flex-start**, zIndex 5 | 2px 아래, 세로 정렬 | 다름 |
| 91 | 나가기 | dialogue.jsx:32 paper(-1) 34×34, 글자 `✕` Gaegu 17 red | dlg:719-724 NbPaper rot -1 34×34, `cross` 아이콘 17 red | 글리프 → 아이콘 | 다름(구현기록: 글리프 금지) |
| 92 | 나가기 누름 | 정적 | dlg:713-721 누르면 translate(1.5,2), 회전 0 | 누름 효과 추가 | 추가 |
| 93 | 상황 종료 | dialogue.jsx:34 paper(0.5) padding 6/**16**, Gaegu 15 green `✓ 상황 종료` | dlg:749-756 padding 6/**14**, `check` 아이콘 14 + gap 5 + 글자 | 좌우 패딩 -2, 글리프 → 아이콘 | 다름 |
| 94 | 미션 칩 | dialogue.jsx:36 paper(1) padding **6**/10, Gaegu 14 ink, bg rgba(249,227,123,.5), `미션 4 ∨` | MC:69-85 padding **5**/10, `미션 {n}` + 완료수 `k/n`(12.5 soft) + chevron 아이콘 13 | 세로 -1, `∨` → 아이콘, 진행수 추가 | 다름 |
| 95 | 미션 펼침 패널 | 없음 | MC:97-134 NbPaper rot -0.5, 너비 240, 목표 목록·체크·취소선 | 추가 | 추가 |
| 96 | 무대 높이 | dialogue.jsx:43 **236**(E) / **168**(D short), 상태바(44) 아래부터 | dlg:190,687 사용자 분할 `winH·0.41+34`(874 기준 ≈392, 화면 맨 위부터), 드래그 가능 | 고정 → 가변·훨씬 큼, D short 없음 | 다름 |
| 97 | 무대 배경 | dialogue.jsx:6,43 `#F6E3DC` 고정 | dlg:604,687 `deptWash(부서색)` = 크림에 부서색 14%, 없으면 픽셀 토큰 peach | 색 | 다름 |
| 98 | 무대 아래선 | dialogue.jsx:43 1.5 #E0D6C0 | dlg:687 1.5 paperEdge | 같음 | — |
| 99 | 폴라로이드 위치 | dialogue.jsx:44 가운데, 무대 안 top **54**(E)/**38**(D) → 화면 y 98/82 | dlg:772 top **96** 가운데 | D에서 14px 아래, E 2px 위 | 다름 |
| 100 | 폴라로이드 종이 | dialogue.jsx:45 paper(-1.5) padding 8/8/4 | dlg:1322 같음 | 같음 | — |
| 101 | 폴라로이드 테이프 | dialogue.jsx:46 top **-9**, 가운데, **58×16**, rot **-3** | dlg:1322 NbTape left w/2-29, **74×20**, top -10, rot -4 | 크기·각도, 58 기준으로 가운데라 74폭은 8px 오른쪽 치우침 | 다름 |
| 102 | 그림 영역 | dialogue.jsx:47 높이 **120**(E)/**92**(D), 폭 = svg 118, 배경 없음(종이색) | dlg:1323 110·s × 130·s, bg `#F6E3DC` | 크기·배경 | 다름 |
| 103 | 초상 그림 | dialogue.jsx:14-27 낙서 Portrait 118×130 (patient: 갈색 머리·X눈·물결입·땀 / medic: 모자·볼터치) | dlg:811 NbAvatar 110·scale (avatar 시스템) | 그림 체계 다름 | 다름 (v34 결정, 이번 스펙 기록 없음) |
| 104 | 땀방울 | 초상 안 파란 획(patient만) | dlg:1327-1333 별도 땀방울 18px, 기분 따라 | 위치·조건 다름 | 다름 |
| 105 | 이름표 위치 | dialogue.jsx:50 absolute **left 22**, top 88(E)/60(D) — 무대 왼쪽 | dlg:1349-1353 폴라로이드 **아래**(marginTop 8) 또는 왼쪽 옆(right w+22) | 위치 | 다름 |
| 106 | 이름표 | dialogue.jsx:51 paper(-2) padding 3/9, MONO 11 **700** nowrap | dlg:1355-1356 NbPaper rot -2 3/9, monoBold(600) 11, 1줄 | 굵기 | 다름(사소) |
| 107 | 감정 태그 | dialogue.jsx:52 marginTop 6, bg red, 흰색, **Pretendard 9.5 800 자간 1**, padding 2/7, rot -2, 모서리 각짐 | dlg:1358 NbTag fill red rot -2 → **Gaegu 12.5**, padding 1/6, radius 2 | 서체·크기·자간·패딩 | 다름 |
| 108 | 스피커 버튼 | dialogue.jsx:54-55 absolute **right 26**, top 96(E)/66(D), paper(2) **32×32**, NbIcon speaker 17 | dlg:792-805 폴라로이드 오른쪽 -38, 세로 가운데, **30×30**, 2.5 잉크 테두리, 하드 그림자 2, **PixelIcon volume** 15, 켜짐 bg 연두 | 위치·크기·재질(픽셀 라인)·아이콘 | 다름 |
| 109 | 그래버 ① (무대 아래) | dialogue.jsx:11,83/120 52×5, rgba(62,54,43,.25), radius 99, margin 7 auto | RH:77-79 padding 7/13, 52×5, `colors.ink` opacity .45, radius 3 | 색 진함·모서리·아래 여백 13 | 다름 |
| 110 | QUICK INFO 행 | dialogue.jsx:63 gap **7**, padding '2px 16px 0' | dlg:873-880 marginTop 8, gap **6**, 가로 스크롤, 열 inset 14 | 간격·여백 | 다름 |
| 111 | QUICK INFO 라벨 | dialogue.jsx:64 MONO 9 700 자간 1 soft, 1.3 soft 테두리, padding 2/6 | dlg:884-885 같음(SemiBold) | 굵기 | 다름(사소) |
| 112 | 차트·약물·활력 칩 | dialogue.jsx:65-66 paper(±0.8: 차트 -0.8·약물 0.8·활력 -0.8), padding 4/9, gap 4, Gaegu 14, 아이콘 14 | dlg:889-899 같음, 선택 시 노란 bg | 선택 상태·팝업 추가 | 추가 |
| 113 | QUICK INFO 팝업 | 없음 | dlg:819-834 어두운 막 + 테이프 종이 | 추가 | 추가 |

### 2-H. 대화 공통 — 메시지

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 114 | 메시지 영역 | E dialogue.jsx:85 flex 1, padding 10/16/4, gap **10** / D :122 **높이 128 고정**, padding 10/16/2 | dlg:905-908 flex 1, paddingTop 12 · bottom 6, 말풍선 간격 marginBottom **8**, 좌우 14 | 간격 8, D 고정 높이 없음 | 다름 |
| 115 | 내 말풍선 | dialogue.jsx:72 paper(**0**), **marginLeft 40**(폭 = 남은 전체), padding 9/12, Pretendard 13.5 lineHeight 1.5 | dlg:919-950 rot **0.35**, **maxWidth 86%, 내용 폭**, 오른쪽 정렬, lineHeight 20 | 회전·폭 규칙 | 다름 |
| 116 | NPC 말풍선 | dialogue.jsx:73 paper(0) bg #FCEEDC, 테두리 #E8D2B0, **marginRight 40** | dlg:931-937 rot **-0.35**, maxWidth 86%, 최신만 테두리 = moodBorder(픽셀 `colors.red` 등) | 회전·폭·최신 테두리 색 | 다름 |
| 117 | 작성 중 말풍선 | dialogue.jsx:90 내 말풍선 opacity .6 `When did it start, and does…` | 없음 | 말하는 중 미리보기 없음 | 미구현 |
| 118 | 대답 대기 말풍선 | 없음 | dlg:1000-1007 스피너 + `{이름} 님이 대답하고 있어요…` | 추가 | 추가 |
| 119 | 타자 효과 | 없음 | dlg:943-946 Typewriter 20ms/글자 | 추가 | 추가 |
| 120 | `tap to 번역` | dialogue.jsx:125 marginTop **7**, bg rgba(95,141,90,.2), 1.5 green, radius 3, padding 2/8, Gaegu 12.5 green | dlg:983-990 marginTop **8**, 같은 모양 + 켜면 노란 bg·ink 테두리·`원문 보기` | 1px, 토글 상태 추가 | 다름(사소) |
| 121 | 교정 표시 | D·D'·E 아트보드에 **없음** | dlg:956-979 내 말풍선 아래 점선 아닌 1px 선, pencil/check 아이콘, `이렇게 하면 더 자연스러워요`/`잘 말했어요`, 교정문 12.5, 설명 10.5 | 핸드오프에 기준 없음 | 추가 |
| 122 | 그래버 ② (메시지 아래) | dialogue.jsx:92(E), :128(D) | 없음 (보기 3개 경로에만 choices-handle) | 없음 | 미구현 |

### 2-I. D·D' — STEP 3 가이드 대화

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 123 | 가이드 영역 | dialogue.jsx:130 flex 1, padding '2px 16px 0' | GT:24 marginTop 12, 열 inset 14 | 위 여백 12(그래버 대신), 좌우 14 | 다름 |
| 124 | 머리 행 | dialogue.jsx:131-133 speech 16 + Gaegu 15.5 `이렇게 말해보세요`, gap 6 | GT:25-27 같음, ko:307 | 같음 | — |
| 125 | `STEP 3 · 가이드` 태그 | dialogue.jsx:135 Gaegu 12.5 soft, 1.3 soft, **radius 2**, padding 0/6, nowrap | GT:29 같음, radius 없음, 줄바꿈 제한 없음 | 모서리·nowrap | 다름(사소) |
| 126 | 목표 카드 | dialogue.jsx:137 paper(-0.5), marginTop 9, padding 13/14/11 | GT:31 같음 | 같음 | — |
| 127 | 목표 카드 테이프 | dialogue.jsx:138 top -10, left 120, **70×20**, rot -4, 그림자 없음 | GT:31 NbTape **74×20** | 폭 +4 | 다름(사소) |
| 128 | 한국어 목표 | dialogue.jsx:139-140 Gaegu 20, lineHeight 1.35, 형광 `linear-gradient(transparent 55%, #F9E37B 55%)`, padding 0 2px | GT:32 NbMark hand(20) lh 27; NbUI:351-357 띠 top 50%·높이 42%(→92%)·radius 1.5, 좌우 패딩 없음 | 띠 위치·높이·좌우 2px | 다름 |
| 129 | 힌트 칩 행 | dialogue.jsx:143 wrap, gap 6, marginTop 10 | GT:33 같음 + center | 같음 | — |
| 130 | 힌트 칩 — 열림 | dialogue.jsx:145 MONO 11.5 700 ink, bg blue+18, 1.3 solid blue, radius 3, padding 3/8, rot ±0.8 | GT:37-42 같음(SemiBold) | 굵기 | 다름(사소) |
| 131 | 힌트 칩 — 가림 | dialogue.jsx:145 글자 투명, bg `repeating-linear-gradient(-45deg, rgba(62,54,43,.12) 0 3px, transparent 3px 6px)`, 1.3 **dashed** blue | GT:39 글자 투명, bg **단색 rgba(62,54,43,.06)**, dashed blue | **빗금 없음** | 미구현 |
| 132 | `힌트 더` | dialogue.jsx:147 bulb 13 + Gaegu 12.5 blue 밑줄(offset 3), center, 항상 보임 | GT:46-51 같음(밑줄 offset 불가), 다 열면 사라짐 | 동작 추가 | 다름(사소) |
| 133 | 듣기 (카드 안) | 없음 — 듣기는 하단 레일(:180) | GT:52-57 카드 오른쪽 끝 speaker 15 + Gaegu 13 `듣기` | 위치 이동 | 다름(구현기록: plan J) |
| 134 | 말하기/타이핑 스위치 | dialogue.jsx:151-157 marginTop 12, 가운데, gap 8; 알약 padding 6/14, radius 99, 1.6 테두리(활성 ink / 비활성 rgba(62,54,43,.3)), 활성 bg ink·글자 paper, 비활성 투명·soft, Gaegu 14, 아이콘 mic/pencil 15 | 없음 | 없음 | 미구현 (plan J 기록) |
| 135 | 스위치 아래 여백 | dialogue.jsx:158 flex 1 spacer — 마이크/타이핑을 바닥으로 | 없음 | 배치 | 미구현 |
| 136 | 큰 마이크 (말하기) | dialogue.jsx:161 **84×84 원**, 2.5 red, bg rgba(199,81,70,.12), 그림자 0 3 8 rgba(62,54,43,.18), mic 40 | 없음 — 38×38 사각 마이크 상자(dlg:1107-1116) | 없음 | 미구현 |
| 137 | 마이크 안내 | dialogue.jsx:162 Gaegu 14 soft, marginTop 7, `꾹 누르고 영어로 말하기` | dlg:1100 mono 9.5 `영어로 말하거나 적어보세요`(ko:311) | 문구·서체·위치 | 미구현 |
| 138 | 마이크 조작 | 07:212 "큰 마이크 **홀드**" | dlg:284-314 탭 시작 / 탭 종료 | 홀드 → 탭 토글 | 다름 |
| 139 | 마이크 녹음 상태 | 없음 | dlg:1109-1116 녹음 중 빨간 bg + 정지 사각 12, 변환 중 스피너, 라벨 `듣는 중…` | 추가 | 추가 |
| 140 | 타이핑 카드 | dialogue.jsx:165 paper(0.3), padding 10/12, marginBottom 6 | 없음 — 입력줄 NbPaper rot 0 (dlg:1103) | 없음 | 미구현 |
| 141 | 타이핑 라벨 | dialogue.jsx:166 Pretendard 10 **800** blue 자간 1 `영어로 적어보세요` | 없음 | 없음 | 미구현 |
| 142 | 필기란 | dialogue.jsx:167 밑줄 2px rgba(62,54,43,.45), padding 6/2, marginTop 4, **Pretendard 15** ink, minHeight 30 | dlg:1119-1125 TextInput **Gaegu 16**, 밑줄 없음, 상자 안 | 밑줄·서체 | 미구현 |
| 143 | 커서 | dialogue.jsx:168 2×17 ink, verticalAlign -3 | 시스템 커서 | 모양 | 다름(사소) |
| 144 | 단어 칩 | dialogue.jsx:170-171 gap 6, marginTop 8, MONO 11 ink, 1.3 #E0D6C0, radius 3, padding 2/7, bg #fff (`mechanism`·`vital`·`Can you`), 탭하면 삽입 | 없음 | 없음 | 미구현 |
| 145 | 칩 안내 | dialogue.jsx:173 Gaegu 12.5 soft `단어 칩 탭 → 삽입` | 없음 | 없음 | 미구현 |
| 146 | 하단 레일 | dialogue.jsx:178 padding '0 16px 22px', gap 9 | dlg:1140 marginTop 12, gap 9, 열 bottom 20, inset 14 | 아래 22→20, 좌우 16→14 | 다름 |
| 147 | 보내기 | dialogue.jsx:179 paper(0) flex 1, padding 9/0, Gaegu 15 `▷ 보내기`; 비활성 soft·opacity .6; 타이핑+입력 있으면 ink·opacity 1·bg rgba(249,227,123,.5) | dlg:1145-1147 NbButton **ink** md(15.5) full, flex **2**, `pencil` 아이콘, 비활성 opacity .45 | 재질·색·활성 표현·비율·아이콘 | 다름 |
| 148 | 듣기 (레일) | dialogue.jsx:180 paper(0.5) padding 9/16, speaker 15 + `듣기` | 없음(카드 안으로, #133) | 없음 | 다름(구현기록: plan J) |
| 149 | 노트 (레일) | dialogue.jsx:181 paper(-0.5) padding 9/13, board 15, 숫자 없음 — 07:212 "노트" | dlg:1161-1169 퀴즈가 있을 때만, board + 퀴즈 수, rot 0 | 의미(노트→퀴즈)·조건 | 다름 |
| 150 | 힌트 (레일) | D에 **없음** | dlg:1149-1153 NbButton paper/yellow flex 1 bulb `힌트` → 목표 영어문 공개 | 추가 | 추가 |
| 150b | 힌트 켜면 목표 카드 숨김 | 해당 동작 없음(목표 카드는 항상 보임) | dlg:1046 `target && !hintOn`일 때만 GuidedTarget — 힌트를 켜면 한국어 목표가 사라지고 노란 힌트 종이(영어 정답)만 남음 | 목표 문장 사라짐 | 다름 |
| 151 | 보기 3개 대체 경로 | 07:212 폐기 | dlg:1048-1076 STEP 2 문장 없는 상황에서 ReplyChoices + choices-handle | 폐기된 UI가 남음 | 다름(구현기록: plan J) |
| 152 | 선택한 의도 줄 | 없음 | dlg:1084-1095 (보기 경로) `이렇게 말해보세요` + 의도 + × | 추가(대체 경로 전용) | 추가 |

### 2-J. E — STEP 4 자유 대화

| # | 화면/요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 | 분류 |
|---|---|---|---|---|---|
| 153 | 무대 | dialogue.jsx:82 높이 236, 폴라로이드 120 | #96·#102와 같음 | (위 참고) | 다름 |
| 154 | 입력부 여백 | dialogue.jsx:93 padding '0 16px 22px' | dlg:844 열 left/right 14, bottom 20 | 좌우·아래 | 다름 |
| 155 | `SPEAK FREELY` 라벨 | dialogue.jsx:94 MONO 9.5 700 자간 1 soft | dlg:1099-1101 같음(SemiBold), marginBottom 6, 녹음 중엔 문구 바뀜 | 굵기 | 다름(사소) |
| 156 | 입력 상자 | dialogue.jsx:95 paper(0), marginTop **7**, gap 10, padding 10/12 | dlg:1083,1103 바깥 marginTop 14 + 라벨 아래 6, gap 10, padding 10/12 | 라벨→상자 7→6 | 다름(사소) |
| 157 | 마이크 상자 | dialogue.jsx:96 38×38, bg rgba(95,141,90,.15), 1.7 ink, radius 4, mic 20 | dlg:1107-1116 같음 | 같음 | — |
| 158 | 자리표시 글 | dialogue.jsx:97 Gaegu 16 #B4A88F lineHeight 1.3, **두 줄(`<br/>`)** `자유롭게 영어로 답하거나 / 마이크로 말해보세요…` | dlg:1123-1125 Gaegu 16 placeholder, 한 문자열(자연 줄바꿈), lineHeight 없음 | 줄 끊는 자리·행간 | 다름(사소) |
| 159 | 버튼 행 | dialogue.jsx:99 gap 9, marginTop **10** | dlg:1140 gap 9, marginTop **12** | +2 | 다름(사소) |
| 160 | 보내기 | dialogue.jsx:100 paper(0) flex 1, padding 9/0, Gaegu 15 soft opacity .6 `▷ 보내기` | dlg:1145 NbButton ink flex 2, pencil, 입력 있으면 활성 | 재질·비율·아이콘 | 다름 |
| 161 | 힌트 | dialogue.jsx:101 paper(**0.5**), padding 9/**16**, Gaegu **15**, bulb 15 | dlg:1150 NbButton paper rot **0**, md padding 9/**15**, **15.5**, bulb 15.5; 켜면 yellow | 회전·패딩·크기 | 다름 |
| 162 | 노트 `3` | dialogue.jsx:102 paper(**-0.5**), padding 9/13, board 15 + `3` | dlg:1161-1169 퀴즈 있을 때만, rot 0, md, 숫자는 퀴즈 2개 이상일 때만 | 의미·조건·회전 | 다름 |
| 163 | 힌트 펼침 | 없음 | dlg:1022-1038 노란 종이 rot 0.4, bulb 16 + 이유 한 줄 + × | 추가 | 추가 |
| 164 | 기분 개선 띠 | 없음 | dlg:1012 MoodLift 연두 종이 rot -0.8 | 추가 | 추가 |
| 165 | 마무리·이어하기·나가기 시트 | 없음 | dlg:1174-1260 BottomSheet 3종(FIcon, 2.5 테두리, 하드코딩 한국어 `이어서 대화할까요?` 등) | 추가, 수첩 문법과 다른 재질 | 추가 |
| 166 | 로딩 화면 | 없음 | dlg:623-629 배경 **#1F2937**(픽셀 라인 남색) | 수첩 크림 아님 | 다름 |

> `—` 행(같음·목업·콘텐츠)은 확인했다는 기록으로 남겼고 차이 개수에서 뺐다. #89는 질문(§4-8).

---

## 3. 애니메이션 표

핸드오프에서 이 네 화면(A·D·D'·E)에 실제로 걸리는 애니메이션은 `.nb-press`뿐이다. `nbl-pop`·`nbl-flip`(lesson.jsx:13-15)은 정의돼 있지만 **B LessonWords에서만** 쓰인다(lesson.jsx:188). 대화 jsx(dialogue.jsx)와 Dialogue.html에는 keyframes·transition이 하나도 없다. 아트보드라서 화면 전환·등장 연출도 정의돼 있지 않다.

| # | 대상 | 핸드오프 (값) | 우리 (값) | 차이 | 분류 |
|---|---|---|---|---|---|
| A1 | NbButton 누름 (허브 CTA·`시작`·`그래도 할래요`) | ui.jsx:17-18 `.nb-press{transition:transform .06s ease, box-shadow .06s ease}` / `:active{transform:translate(1.5px,2px) rotate(0deg); box-shadow:none}` | NbUI:201-218 pressed 시 translate(1.5,2)·회전 0·그림자 제거, **전환 시간 없음(즉시)** | 60ms ease 없음 | 다름 |
| A2 | NbChip 누름 | ui.jsx:19-20 `.nb-chip{transition:transform .06s ease}` / `:active{scale(.94)}` | NbUI:272 즉시 scale .94 | 이 화면들엔 칩 없음(탭바만 사용, 허브 탭바 제거) | 해당 없음 |
| A3 | `nbl-pop` | lesson.jsx:14-15 0%{scale .6, opacity 0} 70%{scale 1.08} 100%{scale 1, opacity 1}, .35s cubic-bezier(.3,.7,.4,1.2) both | — | B에서만 사용 | 해당 없음 |
| A4 | `nbl-flip` | lesson.jsx:13 rotateY 0→180deg (사용처 없음) | — | — | 해당 없음 |
| A5 | 대화 상단 요소 누름(✕·상황 종료·미션 칩) | 정적 div(누름 없음) | dlg:713-721, 747-753, MC:68-72 즉시 translate(1.5,2)·회전 0 | 누름 추가 | 추가 |
| A6 | 화면 전환 (허브·대화) | 정의 없음 | transitions.ts TASK_SCREEN `animation:'fade', animationDuration:250`(iOS; 실제 페이드 ≈145ms), Android 기본 | 추가 | 추가 |
| A7 | 키보드 올라올 때 무대 페이드 | 없음 | dlg:223-232 chromeOpacity 1→0, 시간 = 키보드 이벤트 duration(없으면 220ms), 이징 Animated 기본(easeInOut), native driver | 추가 | 추가 |
| A8 | 키보드 — 대화 열 위로 | 없음 | dlg:227-228,238-246 threadTop restingTop→raisedTop, keyboardLift 0→키보드 높이, 같은 시간, JS driver | 추가 | 추가 |
| A9 | 미션 패널 펼침 | 없음 | Collapsible 190ms `Easing.out(Easing.cubic)`, 높이, JS driver | 추가 | 추가 |
| A10 | 기분 개선 띠 | 없음 | MoodLift:56-61 opacity 0→1 260ms → 유지 2200ms → 1→0 260ms, native | 추가 | 추가 |
| A11 | NPC 대사 타자 효과 | 없음 | Typewriter:36-41 setInterval 20ms/글자 | 추가 | 추가 |
| A12 | 메시지 자동 스크롤 | 없음 | dlg:912 `scrollToEnd({animated:true})` | 추가 | 추가 |
| A13 | 바텀시트 | 없음 | BottomSheet:184,214 spring damping 24 · stiffness 190 · mass 0.9, native | 추가 | 추가 |
| A14 | 분할 드래그 | 핸드오프 그래버는 그림만(07 "영역 조절 grabber 3곳") | RH PanResponder 2pt 이상에서 잡음, 손가락 따라 즉시 | 그래버 3곳 중 1곳만 동작 | 다름 |

---

## 4. 사용자에게 물어야 할 것

1. **결정 4 되돌리기?** 허브에 탭바(일터 활성)를 다시 넣고 CTA `bottom 84`·스크롤 `bottom 68`로 핸드오프대로 갈지, 지금처럼 탭바 없이 `bottom 30`을 유지할지. (spec 결정 4는 "되돌릴 수 있는 결정"이라고 적었다.)
2. **D/D' 입력부를 핸드오프대로 새로 만들까?** 말하기/타이핑 스위치 + 84px 홀드 마이크 + 타이핑 카드(밑줄 필기란·단어 칩 탭 삽입). 지금은 `plan` J의 구현 메모로 자유 대화 입력줄을 재사용 중이다. 홀드(꾹 누르기)로 바꾸면 현재 탭 토글 STT와 동작이 달라진다.
3. **D 하단 레일**을 `보내기 · 듣기 · 노트`로 맞출까? 그러면 (a) 카드 안 `듣기`를 레일로 옮기고, (b) D의 `힌트` 버튼을 빼고, (c) board를 퀴즈가 아니라 '노트'(교정노트?)로 바꿔야 한다 — **노트가 무엇을 여는지** 핸드오프에 정의가 없다. E의 `board 3`도 같은 질문.
4. **대화 무대**: 핸드오프의 고정 무대(236/168, `#F6E3DC`, 이름표 왼쪽·스피커 오른쪽 독립 배치, D short)로 돌아갈까, 지금의 드래그 분할 + 부서색 워시 + 아래 이름표를 유지할까?
5. **초상 그림**: 대화 무대를 핸드오프 낙서 Portrait로 바꿀까, 앱 전체 NbAvatar를 유지할까? (v34 결정이 있으나 v46 핸드오프와 다름.)
6. **글리프 규칙**: 핸드오프의 `← › ↺ ✕ ✓ ∨ ▷`를 글자 그대로 쓸까, 저장소 규칙(theme/glyphs.test.ts)대로 아이콘을 유지할까? 유지한다면 그 사실을 spec에 결정으로 적을지.
7. **보기 3개 대체 경로**(STEP 2 문장 없는 상황): 핸드오프가 폐기한 ReplyChoices를 남길까, 그 상황에선 STEP 3를 `empty`로 막을까?
8. **StepTrack을 대화 화면(D/E) 위에 둘까?** 07·spec은 "모든 STEP 화면 위에"라고 하는데 D·E 아트보드엔 없다.
9. **StepTrack 연결선**: 건너뛴 단계 뒤 연결선을 초록 실선으로 둘지(지금), 핸드오프처럼 실제로 끝낸 단계 뒤만 실선으로 할지.
10. **핸드오프에 없는 움직임·요소(§3 A5~A13, 표의 '추가')** — 키보드 연출, 타자 효과, 기분 개선 띠, 미션 펼침, 교정 표시, 바텀시트 3종 — 전부 유지해도 되는지. 교정 표시는 핸드오프에 기준 그림이 없어 지금 모양이 정답인지 확인이 필요하다.
11. **허브 부제의 커리큘럼 좌표**(`ER · 투약 안전 · 오류 예방 · 3/34`)와 **위치 태그**(`ER BAY 2`)를 보일 데이터가 서버에 있는지 — 없으면 지금처럼 부서명으로 둘지.
12. **감정 칩 문구**를 한국어 감정어(`짜증남`)로 바꿀지 — 기분 값 → 한국어 라벨 표가 필요하다.
13. **NbUI 공용 값 정정**(버튼 하드 그림자, 게이지 2톤 빗금, 도장 이중선, 형광펜 띠, 태그 세로 패딩, mono 자간·굵기)은 허브·대화뿐 아니라 **모든 수첩 화면**을 바꾼다. 한꺼번에 고칠지, 화면 단위로 고칠지.
