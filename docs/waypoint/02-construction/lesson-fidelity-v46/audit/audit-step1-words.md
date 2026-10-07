# STEP 1 단어 — 핸드오프 v46 대조 감사 (읽기 전용)

작성 2026-10-07 · 브랜치 feat/journey-ia · 코드 변경 없음

## 0. 약어와 확인 범위

| 약어 | 파일 |
|---|---|
| WL | `docs/dlc/projects/forin/inputs/design-handoff_v46/reference/forin-notebook-lesson-words-live.jsx` (341줄, 전부 읽음) |
| UI | 같은 폴더 `forin-notebook-ui.jsx` (NbPaper·NbButton·NbTag·NbMark·NbStamp 등, L1–227) |
| NBJ | 같은 폴더 `forin-notebook.jsx` (NbIcon L7–49) |
| DOC | `design-handoff_v46/07_NOTEBOOK_REDESIGN.md` L200–231 (STEP 1 회상형, 뉘앙스 학습, 마감 규칙, 통일 규칙) |
| HTML | `forin Notebook - Dialogue.html` (스크립트 로드 순서, 폰트 링크 L9) |
| W | `mobile/src/app/scenario/[id]/words.tsx` (232줄, 전부) |
| RP | `mobile/src/components/lesson/RecallPrompt.tsx` (267줄, 전부) |
| NU | `mobile/src/components/nb/NbUI.tsx` (NbPaper·NbButton·NbTag·NbStamp·NbMark·NbGauge·nbText) |
| NI | `mobile/src/components/nb/NbIcon.tsx` (쓰이는 아이콘 경로 대조: speaker·bulb·pencil·speech·monitor·siren·chartup·shield·compass·pill·handshake2·star·check) |
| T | `mobile/src/theme/nb.ts` |
| R | `mobile/src/data/recall.ts`, i18n `mobile/src/i18n/catalog/ko.ts` L248–279 |

- `forin-notebook-lesson.jsx`의 keyframes(`nbl-flip`, `nbl-pop`, L13–14)는 WordStudyLive가 쓰지 않는다. WL은 공용 Frame도 쓰지 않고 자체 402×874 프레임을 그린다.
- HTML 폰트 링크는 `Gaegu:wght@400;700`, `IBM Plex Mono:wght@700`만 불러온다. 그래서 핸드오프의 MONO 글자(IPA 포함)는 굵기를 지정하지 않아도 전부 700으로 그려진다.
- 같다고 확인한 항목은 표에 적지 않았다. 확인했고 같았던 것: 색 토큰(ink/soft/red/blue/green/amber/paper/cream/paperEdge/placeholder), NbIcon 경로(check만 다름), 앰버 원 58px·테두리 2·`${amber}22` 배경·아이콘 32, 프롬프트 HW 23, 단서 HW 13.5 soft, 유형 라벨 HW 12.5 soft와 "· 해설" 접미, pick 옵션 테두리 1.6·색 규칙·배경 틴트·MONO 14·A/B/C 원 18/1.5, listen 스피커 원 62/2 blue/.1 배경·아이콘 30, 옵션 flex 1·패딩 9/4·HW 14·gap 6, fill 조립 라인 minHeight 42·밑줄 2(중립 .5 / 결과 초록·빨강)·빈 상태 문자열 규칙·형광펜 rgba(249,227,123,.55)·MONO 17, 칩 MONO 13.5·패딩 6/11·테두리 1.4(쓴 칩 dashed rgba .3)·±1° 회전·글자 투명, 저울 점 18/26·테두리 2·색 규칙, 짝 테두리 2.2/1.6·고정색 3개·번호 배지 16·HW 11 흰색·오른쪽 dashed/solid·`${pc}14` 틴트, 해설 mt 14·pt 12, 도장 56·right 0 top 6·-10°·종이 배경·RETRY/GOOD 7.5 ls 1·HW 15, paddingRight 64, 정답 MONO 19, 스피커 15, IPA 11 soft mt 3, 뉘앙스 메모(1.3 dashed blue, .05, 6/9, HW 13.5), 예문 박스(mt 9, 8/10, 좌측 2.5 blue, .06, 예문 13, 번역 HW 13 soft mt 2), 확인하기 버튼(ink lg full pencil, 답 없으면 opacity .4), 판정 버튼(NbPaper ±0.8°, 11/10, gap 10, 1.8 테두리, `${col}14`, 아이콘 30, HW 17, 보조 10.5 soft), 완료 도장 96·-10°·DONE 9 ls 2, 집계 HW 24 초록/빨강·라벨 10.5·세로 구분선 1px rgba .2, 진행 바 높이 5·r2·gap 4·색 규칙(맞힘 ink/틀림 red/뉘앙스 남은 칸 파랑 .25/단어 남은 칸 .15).

---

## 1. 요약 — 큰 구조 차이

1. **단어장 묶음 연출이 통째로 없음.** 스프링 제본 9개, 뒷장 두께 2겹, 아래에 깔린 다음 장(dim), 뜯긴 자리 절취 조각(지그재그)이 하나도 없다. 우리는 종이 한 장(`View`)뿐이다. (WL L275–288 ↔ W L142–173)
2. **스크롤 영역과 하단 버튼 배치가 다름.** 핸드오프는 absolute `left/right 24 · top 172 · bottom 182`이고 내부 패딩 12/8, 스크롤바를 숨긴다. 판정 줄은 `bottom 98`, **"STEP 2 · 문장 학습으로 ›" 버튼은 `bottom 34`에 늘 떠 있다**(dashed, 끝나기 전엔 opacity .5, 끝나면 ink). 우리는 flex ScrollView(좌우 20, paddingBottom 150)에 하단 슬롯이 `bottom 30` 하나뿐이고, STEP 2 버튼은 완료 때만 확인 버튼 자리에 나온다.
3. **헤더가 다름.** 핸드오프: "‹ 나가기" 테두리 글자(HW 15) + 오른쪽 초록 NbTag "STEP 1 · 단어"(rot 1). 그 아래 진행 바, 그리고 HW 21 헤드라인(일부 형광펜). 우리: 32×32 종이 chevron, HW 21 제목과 상황 부제, **앰버 채운 n/N 태그**, **StepTrack**(WL엔 없음), HW 19 헤드라인(형광펜 없음).
4. **n / N 카운터 위치.** 핸드오프는 **각 낱장 헤더 오른쪽**(MONO 11 700 soft)에만 있다. 우리는 화면 헤더의 앰버 태그에만 있고 낱장 안에는 없다.
5. **낱장 자체**: 패딩 22/18/16(우리 16/18/16), 그림자 `0 4px 10px rgba(62,54,43,.16)`(우리 없음), 위쪽 13px 지점 점선 절취선(우리 없음), minHeight 300(우리 없음), 태그 rot -1(우리 0), 앰버 원 -4°(우리 0).
6. **애니메이션이 하나도 없음.** 뜯김(좌/우), 다음 장 떠오름, 절취 조각, 흔들림, 도장 찍힘, 해설 펼침, 진행 바 색 전환, 저울 점 전환이 전부 빠졌다(3절).
7. **배경 줄노트 없음.** 핸드오프 프레임은 28px 줄(`repeating-linear-gradient(transparent 0 27px, rgba(62,54,43,.06) 27px 28px)`)이다. 우리 W는 `NbSheet`가 아니라 단색 `nb.cream` View다.
8. **도장이 이중선이 아님.** GOOD/RETRY와 DONE 도장은 `3px double`인데 우리는 3px 실선 한 줄이다. NbStamp의 이중 링 방식이 이미 있다(NU L295–315).
9. **유형별 세부 누락.** fill은 조각별로 빼기, 빗금, 칩 그림자, "띄어쓰기는 자동", "내 답" 줄이 빠졌다. 저울은 그라디언트 축(36px 안쪽), 96px 라벨, 안내 한 줄, 콘텐츠 제목이 빠졌다. 짝은 기울기, 글로우, "→", 예고 점선 투명도가 빠졌다. listen은 ±0.6° 기울기와 버튼 그림자가 빠졌다.
10. **문구 차이**: "뜯고 다음 장"→"다음 장", "STEP 2 … ›"의 ›, "다시 나와요 ✎"의 ✎, 헤드라인 형광펜, 상황 접두("구급대 인계 — "), 저울 제목(콘텐츠 `ko` ↔ 고정 문구).
11. **결정이 필요한 충돌 2건**: (a) DOC L202는 "StepTrack은 STEP 화면 상단에 항상 노출"인데 WL JSX에는 StepTrack이 없다. (b) 저장소 글리프 금지 규칙(theme/glyphs.test.ts, NU L184–185 주석) 때문에 ✓ ✕ ✎ ‹ › 문자 대신 아이콘을 쓴다. 1:1로 할지 아이콘을 유지할지는 사용자가 정해야 한다.

**차이 개수: 대조표 98행 중 실제 차이 95건(#23·#43·#56은 같음을 확인한 참고 행). 애니메이션 표 13항목 중 구현해야 할 것 10개(A1·A2·A4–A10)는 우리 쪽에 하나도 없다. A11 버튼 누름은 일부만 있고, A12 nb-flip은 쓰이지 않으며, A3·A13은 애니메이션이 아니다.**

---

## 2. 대조표

### 2-A. 화면 틀·헤더·진행 바

| # | 요소 | 핸드오프 (파일:줄, 값) | 우리 (파일:줄, 값) | 차이 |
|---|---|---|---|---|
| 1 | 배경 | WL:259 `c.bg` + 줄노트 28px(27px 투명, 1px rgba(62,54,43,.06)) | W:102 `nb.cream` 단색 View | 줄노트 없음(`NbSheet` 미사용) |
| 2 | 상단 여백 | WL:260 상태바 44 + 헤더 `padding 6px 24px 0` | W:102 `paddingTop TOP_INSET(52)`, 헤더 좌우 20 | 좌우 24→20, 상단 기준 다름 |
| 3 | 나가기 | WL:263 "‹ 나가기" HW 15 ink, 테두리 1.5 ink, r3, 패딩 1/8, rot -1, nowrap | W:105–109 NbPaper rot -1 32×32 + chevronLeft 16, 글자 없음 | 모양·문구 다름(글리프 규칙이면 chevronLeft 아이콘 + "나가기" 글자로) |
| 4 | 헤더 오른쪽 | WL:265 NbTag 초록 rot 1 "STEP 1 · 단어" | W:114 NbTag 앰버 **fill** `idx+1 / N` | 내용·색·채움 다름 |
| 5 | 헤더 제목 | 없음(태그가 STEP 이름) | W:110–113 HW 21 "STEP 1 · 단어" + 상황 제목 body 10.5 soft | 우리에게만 있는 요소 |
| 6 | StepTrack | WL 없음(DOC:202는 "항상 노출"이라 함) | W:123 StepTrack, mt 10 | 충돌. 사용자 결정 필요 |
| 7 | 진행 바 여백 | WL:267 mt 10(헤더 아래), 좌우 24 | W:126 mt 12, 좌우 20 | 여백 다름 |
| 8 | 진행 칸 기울기 | WL:268 `rotate(k%2 ? .7 : -.7deg)` | W:128–132 기울기 없음 | 없음 |
| 9 | 진행 칸 전환 | WL:268 `transition: background .3s` | 없음 | 없음 |
| 10 | 헤드라인(단어) | WL:270 HW 21 lh 1.25, mt 12: "구급대 인계 — 뜻을 보고 **[영어를 떠올려]**보세요"(NbMark) | W:136 HW 19, mt 10, `recall.headWords` "뜻을 보고 영어를 떠올려 보세요"(ko.ts:251) | 크기 21→19, 형광펜 없음, 상황 접두 없음, 띄어쓰기("떠올려보세요"↔"떠올려 보세요") |
| 11 | 헤드라인(뉘앙스) | WL:270 "이제 **[뉘앙스]**를 느껴봐요 — 비슷한 말, 다른 온도"(뉘앙스에 NbMark) | ko.ts:252 같은 글, 형광펜 없음 | 형광펜 없음 |
| 12 | 헤드라인(완료 때) | WL:270 done이어도 단어 헤드라인을 계속 보임 | W:135 `!done && card`일 때만 | 완료 때 사라짐 |
| 13 | 헤드라인 줄높이 | lh 1.25 | 지정 없음 | 없음 |

### 2-B. 단어장 묶음과 스크롤

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 14 | 스크롤 영역 | WL:274 absolute `left 24 right 24 top 172 bottom 182`, overflowY auto, overflowX hidden, pt 12 pb 8, 스크롤바 숨김(DOC:224) | W:141 `flex 1, mt 10`, 내용 좌우 20, pb 150, 스크롤바 숨김 | 고정 영역이 아니라 흐름 배치. 아래 끝이 버튼 위 182가 아님 |
| 15 | 묶음 래퍼 | WL:275 relative, **minHeight 360** | 없음 | 없음 |
| 16 | 스프링 제본 | WL:276–278 9개, absolute `left 14 right 14 top -9`, space-between, zIndex 5. 각 12×18, 테두리 2 ink, r6, 배경 cream | 없음 | 없음 |
| 17 | 뒷장 1(깊음) | WL:279 absolute `left 4 right -4 top 8 bottom 0`, `#F7F1E1`, 테두리 1 `#E0D6C0` | 없음 | 없음 |
| 18 | 뒷장 2 | WL:280 absolute `left 2 right -2 top 4 bottom 4`, `#FBF6E8`, 테두리 1 `#E0D6C0` | 없음 | 없음 |
| 19 | 절취 조각 | WL:281 `i>0`일 때. absolute top 0 높이 13, paper, 좌우 테두리 1 `#E0D6C0`, 아래 1.5 dashed rgba(62,54,43,.35), zIndex 4, clipPath 지그재그 16점 `polygon(0 0,100% 0,100% 70%,94% 100%,88% 70%,80% 100%,72% 68%,64% 100%,55% 72%,47% 100%,40% 70%,31% 100%,23% 72%,15% 100%,8% 68%,0 100%)` | 없음 | 없음 |
| 20 | 아래 깔린 다음 장 | WL:282 `ALL[i+1]` 전체 내용, absolute top 0, **dim**: 그림자 없음, opacity .85 | 없음 | 없음(뜯을 때 드러나는 장) |
| 21 | 현재 장 층 | WL:284–285 relative zIndex 3, `key='cur'+i` | W:143 단순 View | 층 순서 없음 |
| 22 | 뜯기는 장 복사본 | WL:288 tear 중 그 장(해설 포함)을 zIndex 6으로 그림 | 없음 | 없음 |
| 23 | 장 바뀔 때 스크롤 | WL 지정 없음 | 지정 없음 | 같음(참고: 다음 장에서 맨 위로 되돌리지 않음) |

### 2-C. 낱장(Sheet) 공통

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 24 | 패딩 | WL:156 `22 18 16` | W:143 `16 18 16` | 위 22→16 |
| 25 | 최소 높이 | WL:156 minHeight 300 | 없음 | 없음 |
| 26 | 그림자 | WL:156 `0 4px 10px rgba(62,54,43,.16)` | 없음 | 없음 |
| 27 | 절취 점선 | WL:157 absolute top 13, 좌우 끝까지, `1.5px dashed rgba(62,54,43,.3)` | 없음 | 없음 |
| 28 | 헤더 줄 위 여백 | WL:158 mt 4 | 없음 | 없음 |
| 29 | 태그 | WL:159 NbTag blue **rot -1**, 모든 장(뉘앙스 장은 "뉘앙스 · 강도"·"뉘앙스 · 콜로케이션") | W:145 rot 0, 단어 장만(`card.word.tag`) | 기울기 없음, 뉘앙스 장 태그 없음(`LessonNuance`에 tag 필드 없음) |
| 30 | 유형 라벨 nowrap | WL:160 `whiteSpace nowrap` | W:146 numberOfLines 없음 | 줄바꿈될 수 있음 |
| 31 | n / N | WL:161–162 flex spacer + MONO 11 700 soft nowrap flexShrink 0 `{idx+1} / {total}` | 없음 | 없음 |
| 32 | 아이콘 원 기울기 | WL:168 `rotate(-4deg)`(DOC:231 "-4° 기울임" 명시) | W:152 없음 | 없음 |
| 33 | 뉘앙스 아이콘 | WL:46–47 콘텐츠 `icon`(slider `faceWorried`는 NbIcon에 없어 **star**로 그려짐, pair `pill`) | W:153 고정: pair→handshake2, slider→chartup. `LessonNuance.icon` 무시 | 다름 |
| 34 | 프롬프트 줄높이 | WL:170 HW 23 lh 1.15 | W:156 lh 지정 없음 | 없음 |
| 35 | 저울 제목 | WL:170 `d.ko` = "통증의 세기"(콘텐츠) | W:159 고정 `recall.sliderAsk` "이 말에 맞는 세기는?" | 문구 다름. `LessonNuance`에 `ko` 없음(데이터 모델 차이) |
| 36 | 짝 제목 | WL:47 `d.ko` "무엇과 같이 쓰나요?" | ko.ts:263 같은 글(고정) | 글은 같고 출처가 다름(콘텐츠 ↔ i18n) |
| 37 | 단서 앞 표시 | WL:171 문자 "✎ " | W:163 pencil 아이콘 12 soft, mt 2 | 글리프 규칙 때문에 아이콘(결정 필요) |
| 38 | NbMark 모양 | UI:94–96 `linear-gradient(transparent 55%, #F9E37B 55%)`, 좌우 2px 패딩, 모서리 각짐 | NU:348–360 줄마다 띠, top 50%, 높이 42%, r1.5, 좌우 패딩 없음 | 띠 위치(55%↔50%)·높이(45%↔42%)·r·패딩 |

### 2-D. 영어 고르기(pick)

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 39 | 위 여백 | WL:57 mt 14 | RP:44 mt 12 | 14→12 |
| 40 | 정답/오답 표시 | WL:62 원 안 문자 "✓"/"✕" HW 12 | RP:70 check 11 / cross 10 아이콘 | 글리프↔아이콘(결정 필요) |
| 41 | 보기 순서 | WL:37 작성 순서(정답 먼저) | R:73 stableShuffle | 섞음(의도된 차이일 수 있음) |
| 42 | MONO 굵기 | MONO 700 | RP:74 `IBMPlexMono-SemiBold`(600) | 600 vs 700 (모든 MONO 700 항목 공통) |
| 43 | 원 라벨 줄 | WL:62 `display inline-flex`, 문자색 soft/초록/빨강 | 같음 | (같음, 참고) |

### 2-E. 듣고 뜻 고르기(listen)

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 44 | 스피커 버튼 그림자 | WL:71 `0 2px 5px rgba(62,54,43,.15)` | RP:47–50 없음 | 없음 |
| 45 | IPA | WL:73 MONO 11.5 soft 가운데, mt 6, 자간 없음(700) | RP:53 `nbText.mono(11.5)`: 자간 1, regular | 자간 1 추가, 굵기 |
| 46 | 보기 기울기 | WL:77 `±.6deg` | RP:66 `±.4deg`(pick과 공용) | .6→.4 |
| 47 | 보기 줄높이 | WL:77 lh 1.2 | 없음 | 없음 |
| 48 | 보기 순서 | 정답이 opts[0](작성 순서) | stableShuffle | 섞음 |

### 2-F. 조각 맞추기(fill)

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 49 | 조립 라인 패딩 | WL:140 `0 2px 6px` | RP:93 pb 6만 | 좌우 2 없음 |
| 50 | 붙인 조각 표시 | WL:142 조각마다 따로 `<span>`: 형광펜 배경, 패딩 1/5, gap 4 | RP:97–101 하나로 합친 Text(`assembled`, 단어 사이 공백) | 조각별 띠가 아니라 한 줄 띠 |
| 51 | 조각 빼기 | WL:142 누른 그 조각만 뺌(`filter j!==i`) | RP:97 맨 끝 조각만 뺌(`slice(0,-1)`) | 동작 다름 |
| 52 | 붙인 조각 세로 패딩 | 1px | 0 | 없음 |
| 53 | 쓴 칩 빗금 | WL:147 `repeating-linear-gradient(-45deg, rgba(62,54,43,.1) 0 3px, transparent 3px 6px)` | RP:111 `transparent` | 빗금 없음(DOC:231 "사용 시 빗금 dashed") |
| 54 | 안 쓴 칩 그림자 | WL:147 `1px 2px 0 rgba(62,54,43,.2)`(번지지 않는 그림자) | 없음 | 없음 |
| 55 | 안내 문구 | WL:150 "조각을 눌러 순서대로 붙여요 · 다시 누르면 빼요" + 여러 단어면 " · 띄어쓰기는 자동" | ko.ts:264 앞부분만 | 접미 없음 |
| 56 | 칩 사이 | WL:144 gap 7, mt 12 | 같음 | (같음) |
| 57 | "내 답" 줄 | WL:193 오답 + fill: "내 답: ~~조각들~~" HW 13 red mt 7 | 없음(`recall.myAnswer` 키는 ko.ts:279에 있으나 어디서도 안 씀) | 없음 |
| 58 | 칩 '사용' 판정 | WL:146 `built.includes(ch)` | RP:105–107 같은 칩이 여러 개면 개수만큼 | 동작 차이(우리 쪽이 더 정확, 참고) |

### 2-G. 뉘앙스 저울(slider)

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 59 | 틀 | WL:86 relative 높이 62 | RP:129 flex 행, 좌우 마진 8, 칸마다 높이 30 | 구조 다름 |
| 60 | 축 | WL:87 absolute **left 36 right 36**, top 20, 높이 4, r2, `linear-gradient(90deg, #7A9E7E, #C77E2E, #C75146)` 이어진 그라디언트 | RP:138–139 칸마다 단색 조각(초록/앰버/빨강), 첫 칸 중앙~끝 칸 중앙 | 그라디언트 아님, 36px 안쪽 규칙(DOC:226) 아님, r 없음 |
| 61 | 눈금 위치 | WL:93 `left: calc(36px + (100% - 72px) * x)`, 폭 72, translateX -50% | 칸 flex 1의 가운데 | 위치 다름 |
| 62 | 점 위치 | WL:94 margin-top 13(큰 점 9), 점 중심 y 22(축 중심) | 높이 30 칸 가운데(y 15) | 세로 위치 다름 |
| 63 | 점 그림자 | WL:94 on/ok일 때 `0 2px 5px rgba(62,54,43,.3)` | 없음 | 없음 |
| 64 | 점 반지름 | 50% | RP:140 `borderRadius 13` 고정(18px일 때도 13) | 작은 점에서 같은 모양이라 큰 문제는 없음(참고) |
| 65 | 라벨 | WL:95 MONO 11.5 700, mt 6, **lh 1.15, 폭 96, marginLeft -12**, 단어 중간 줄바꿈 허용 | RP:144 칸 폭만큼, lh 없음 | 폭·줄높이 다름(DOC:226 "96px 폭") |
| 66 | 양끝 라벨 | WL:100 HW 12 soft, mt 8, **좌우 패딩 4** | RP:150–153 패딩 없음 | 패딩 없음 |
| 67 | 안내 한 줄 | WL:101 "이 환자의 말에 맞는 위치를 골라요" HW 13 soft mt 8 | 없음 | 없음 |

### 2-H. 콜로케이션 짝(pair)

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 68 | 왼쪽 기울기 | WL:121 `rotate(-.4deg)` | RP:180–184 없음 | 없음 |
| 69 | 왼쪽 선택 글로우 | WL:121 `0 0 0 3px ${pc}33` | 없음 | 없음(DOC:217 "테두리+글로우") |
| 70 | 연결 화살표 | WL:121 flex spacer 뒤 "→" HW 13, 색 ok 초록/bad 빨강/pc | 없음 | 없음 |
| 71 | 오른쪽 기울기 | WL:129 `rotate(.4deg)` | 없음 | 없음 |
| 72 | 오른쪽 예고 테두리 | WL:129 고르는 중이면 `pc + '99'`(60%) dashed | RP:207 `pc` 100% | 투명도 없음 |
| 73 | 오른쪽 순서 | WL:107 짝 순서 + 디코이(섞지 않음) | RP:162 stableShuffle | 섞음(의도된 차이일 수 있음) |
| 74 | 색 목록 | WL:111 3색 | RP:16 5색(초록·빨강 추가) | 4번째부터는 핸드오프에 없음(참고) |
| 75 | 글자 | MONO 12.5 700 | monoBold(600) | 굵기 |

### 2-I. 해설 패널

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 76 | 위 점선 | WL:177 `borderTop 1.5px dashed rgba(62,54,43,.3)` | RP:236 `borderTopWidth 1.5 + borderStyle dashed` | iOS는 한쪽 테두리만 dashed면 실선으로 그릴 수 있음. 실기기 확인 필요 |
| 77 | 도장 선 | WL:179 `3px double` | RP:238 borderWidth 3 실선 | 이중선 아님(NbStamp 방식 참고) |
| 78 | 도장 글자 굵기 | 800 | bodyBold(700) | 굵기 |
| 79 | 도장 HW 15 줄높이 | lh 1 | 없음 | 없음 |
| 80 | 도장 최종 각도 | WL:178–179 래퍼 nb-ok 끝값 rotate(-10) + 안쪽 rotate(-10) = **실제 -20°** | -10° | 각도 다름(애니메이션을 넣으면 같이 맞춰야 함) |
| 81 | 정답 제목(저울) | WL:46 `d.w` = "discomfort · pain · agony" | RP:229 정답 하나("discomfort") | 다름 |
| 82 | 정답 제목(짝) | WL:47 "administer · titrate · en route" | RP:230 "administer + medication · …" | 다름 |
| 83 | 제목 줄높이 | MONO 19 lh 1.15 | 없음 | 없음 |
| 84 | 스피커 위치 | WL:185 글자 뒤 marginLeft 4, -2px, **뉘앙스 장에도 있음** | RP:246–248 gap 6, 단어 장만 | 간격·뉘앙스 장 차이 |
| 85 | IPA 자간 | MONO 11, 자간 없음 | `nbText.mono(11)` 자간 1 | 자간 |
| 86 | 예문 굵기 | WL:190 13 **600**, lh 1.5 | RP:261 bodyBold(700), lh 13×1.55 | 600→700(`bodyMid`=SemiBold 있음), 줄높이 |
| 87 | 뉘앙스 메모 줄높이 | HW 13.5 lh 1.45 (≈19.6) | lh 19 | 작음 |

### 2-J. 하단 버튼·판정·완료

| # | 요소 | 핸드오프 | 우리 | 차이 |
|---|---|---|---|---|
| 88 | 확인·판정 줄 위치 | WL:308 absolute `left/right 24, bottom 98` | W:199 `left/right 20, bottom 30` | 위치 |
| 89 | STEP 2 버튼 | WL:333–334 늘 보임, `bottom 34`. 끝나기 전: dashed + opacity .5, speech 아이콘(soft). 끝나면: ink + speech(paper) | W:200–204 완료 때만 확인 자리에 ink | 끝나기 전엔 없음, 위치 다름 |
| 90 | STEP 2 문구 | "STEP 2 · 문장 학습으로 ›" | ko.ts:278 › 없음(`iconRight` 안 씀) | › 없음(chevronRight `iconRight`로 가능) |
| 91 | NbButton ink 그림자 | UI:58 `2.5px 2.5px 0 rgba(62,54,43,.3)`(번지지 않는 오프셋) | NU:218 `paperShadow`(0/2/6 .14, 번짐) | 공용 부품 차이(확인하기·STEP 2 둘 다) |
| 92 | 판정 보조문 여백 | WL:325 mt 4 | W:220 mt 2 | 4→2 |
| 93 | 판정 라벨 줄높이 | WL:324 lh 1 | 없음 | 없음 |
| 94 | 판정 보조문 문구 | 오른쪽 "뜯고 다음 장" | ko.ts:273 "다음 장" | "뜯고" 빠짐 |
| 95 | check 아이콘 | NBJ:43 초록 수채 밑줄(굵기 5, `M6 13.5 L10 17.5 L18.5 7.5`) + 잉크 2.2(`M5 12.5 L10 17.5 L19 7`) | NI:102–103 잉크 2.4 한 줄(`…L19.5 6.5`) | 수채 밑칠 없음, 경로·굵기 다름(DOC:228 명시) |
| 96 | 완료 카드 | WL:290 패딩 `28 18 20`, 그림자 `0 4px 10px .16`, 묶음 안(제본·뒷장 위), zIndex 3 | W:176 패딩 28/18/28, 그림자 없음 | 아래 패딩·그림자 |
| 97 | DONE 도장 | WL:291–293 `3px double`, inline-block, 글자는 가운데 정렬이 아니라 DONE mt 24부터 흐름 배치, "단어 완료" HW **22** lh 1 | W:177–179 실선 3, 가운데 정렬, HW 20 | 이중선·크기·배치 |
| 98 | 완료 안내 | WL:300 `fuzzy.length>0`(오답만) 때 "틀린 단어는 STEP 2 문장에 다시 나와요 ✎" | W:192–193 `missed.size>0`(오답 + 헷갈려요), ✎ 없음 | 조건 범위·✎(✎는 글리프 규칙). 참고: 핸드오프의 프로토타입 "(처음부터)" 링크는 옮기지 않아도 됨 |

참고(차이로 세지 않음): 판정 동작에서 핸드오프의 진행 칸 빨강은 "오답"만이고, "아직 헷갈려요"는 뜯는 방향(왼쪽)만 바꾼다. 우리도 오답만 빨강이라 같다. 우리는 헷갈려요를 누르면 교정노트 API도 부른다(기능 추가). listen 스피커와 해설 스피커는 핸드오프에선 장식인데 우리는 TTS를 재생한다(기능 추가).

---

## 3. 애니메이션 표

CSS는 WL:12–33에 주입된다. CSS 애니메이션의 이징은 **키프레임 구간마다** 다시 걸린다(전체에 한 번이 아님). `both`라서 시작 전엔 0% 값, 끝난 뒤엔 100% 값을 유지한다.

| # | 이름 | 언제 | keyframes 값 | 시간 / 이징 / 기준점 | 우리 |
|---|---|---|---|---|---|
| A1 | `nb-tear-r` | "외웠어요/이제 알겠어요"(dir r). WL:251–255: tear 상태에 장 복사본(해설 포함, zIndex 6)을 그림. 620ms 뒤 idx+1, 답·결과 초기화. 그동안 현재 장은 숨김(`!tear`) | 0% `rotate(0) translate(0,0)` → 18% `rotate(-3deg) translate(3px,-6px)` → 100% `rotate(22deg) translate(300px,-80px)`, opacity 0 | .62s `cubic-bezier(.3,.6,.4,1)` both, `transform-origin: top left`, pointer-events none | 없음(바로 다음 장) |
| A2 | `nb-tear-l` | "아직 헷갈려요"(dir l) | 0% 0 → 18% `rotate(3deg) translate(-3px,-6px)` → 100% `rotate(-22deg) translate(-300px,-80px)`, opacity 0 | .62s 같은 곡선, `transform-origin: top right` | 없음 |
| A3 | (아래 장 드러남) | 뜯는 동안 dim 다음 장(opacity .85, 그림자 없음)이 보임 | 애니메이션 아님, 겹침 | — | 없음 |
| A4 | `nb-rise` | 새 현재 장이 mount될 때(`key='cur'+i`), 완료 카드 | 0% `translateY(6px) scale(.985)` → 100% none | .4s ease-out both | 없음 |
| A5 | `nb-stub` | i>0이 될 때마다 절취 조각 다시 mount(`key='stub'+i`) | 0% opacity 0 `scaleY(.4)` → 100% opacity 1 none | .3s ease-out both, `transform-origin: top` | 없음 |
| A6 | `nb-shake` | 확인 결과 오답. 현재 장 래퍼에 클래스를 걸고 320ms 뒤 해제 | 0%·100% `translateX(0)`, 25% `-5px`, 75% `+5px` | .3s `ease` both(구간마다) | 없음 |
| A7 | `nb-reveal` | 결과가 생길 때 해설 패널 mount | 0% opacity 0 `translateY(-6px)` → 100% opacity 1 none | .3s ease-out both | 없음 |
| A8 | `nb-ok` | 해설과 함께 도장 래퍼 mount | 0% `scale(.6) rotate(-20deg)` opacity 0 → 70% `scale(1.08) rotate(-10deg)` opacity 1 → 100% `scale(1) rotate(-10deg)`. 안쪽 rotate(-10)과 겹쳐 실제 -30°→-20°→-20° | .35s ease-out both | 없음(정적 -10°) |
| A9 | 진행 칸 색 | 장을 넘길 때 칸 색이 바뀜 | `transition: background .3s` | .3s ease(기본) | 없음 |
| A10 | 저울 점 | 위치 선택·결과 | `transition: all .15s`(폭·높이·여백·색·그림자) | .15s ease | 없음 |
| A11 | 버튼 누름 `.nb-press` | NbButton(확인하기·STEP 2) | `:active` → `translate(1.5px,2px) rotate(0)`, 그림자 없음 | `transform .06s ease, box-shadow .06s ease` | 일부: NU:216 누름 상태는 같지만 .06s 전환이 없음(즉시) |
| A12 | `nb-flip` | **쓰이지 않음**. WL:164 `true ? …`라 뒷면(L197–214)은 그려지지 않음. DOC:214 "뒤집기 없이" | 0% `rotateX(0)` → 45% `62deg` → 55% `-62deg` → 100% 0 | .5s ease-in-out, origin `center 40%` | 없음(옮기지 말 것) |
| A13 | 판정 줄 등장 | face front→back이면 확인 버튼 자리에 판정 두 개가 바로 바뀜 | 전환 없음 | — | 같음(전환 없음) |

참고: 선택지·칩·짝 버튼은 핸드오프에서 그냥 div라 `.nb-press`/`.nb-chip` 누름 효과가 없다. 우리 Pressable에도 없어서 같다.

---

## 4. RN 구현 주의점

**우리 앱의 애니메이션 방식(확인함)**
- 수첩 계열은 **RN 기본 `Animated` + `useNativeDriver: true`**를 쓴다. NbStampNode(L10, L53–58: 0/70/100% 3점 `interpolate`로 CSS 오버슈트 재현), PageCurl(L32, `Easing.bezier`), BinderExitOverlay. `useNativeDriver` 사용처는 63곳이다.
- `react-native-reanimated` 4.3.1이 설치돼 있지만 engine/map/onboardingArt에서만 쓴다. 화면 테스트는 reanimated를 mock한다(`screentests/lessonHub.test.tsx:20`). 이 화면은 **기본 Animated로 맞추는 쪽이 저장소 관례**다.
- `src/data/keyframes.ts`의 `keyframeSegments(total, stops)`는 바로 이 문제(CSS가 구간마다 이징을 거는 것)를 풀려고 만든 도구다. 구간마다 `Animated.timing`을 두고 `Animated.sequence`로 이으면 된다. tear(0/.18/1), shake(0/.25/.75/1), ok(0/.7/1)에 쓴다. NbStampNode처럼 한 timing에 `interpolate`만 걸면 이징이 전체에 한 번만 걸려 핸드오프와 달라진다.
- RN 0.85.3이라 `transformOrigin` 스타일을 쓸 수 있다(NbStampNode·NbCharacter·InteriorScreen이 이미 씀). tear는 `'0% 0%'`/`'100% 0%'`, stub는 `'50% 0%'`.

**옮길 때 조심할 것**
1. **transform 순서**: CSS `rotate(22deg) translate(300px,-80px)`는 회전한 좌표계에서 이동한다. RN `transform` 배열도 같은 순서로 쓰면 같다: `[{rotate}, {translateX}, {translateY}]`. 순서를 바꾸면 날아가는 방향이 달라진다.
2. **뜯기 상태 기계**: 핸드오프처럼 `tear = {idx, dir}`를 따로 두고, 떠나는 장의 복사본(답과 해설 포함)을 위에 그린 뒤 620ms(애니메이션 `.start(cb)` 콜백 권장) 후 idx를 넘긴다. 그동안 입력은 막는다. 다음 장은 미리 아래에 dim(opacity .85, 그림자 없음)으로 깔아 두어야 뜯을 때 드러난다.
3. **뜯김이 잘림**: 핸드오프도 스크롤 영역이 `overflowX hidden`이라 300px 날아가는 장이 영역 밖에서 잘린다. RN ScrollView도 잘리므로 같다. 1:1이면 그대로 두면 된다.
4. **`both` 채움**: rise·reveal·ok·stub는 mount 첫 프레임부터 0% 값이어야 깜빡이지 않는다. `useRef(new Animated.Value(0))`로 시작하고, 다시 mount되게 key를 붙인다(`'cur'+idx`, `'stub'+idx`).
5. **흔들림 재생**: 같은 장에서 다시 흔들 일이 없지만(확인 한 번), Value를 0으로 되돌린 뒤 시작한다. translateX만 쓰니 native driver를 쓸 수 있다.
6. **도장 각도**: nb-ok 래퍼 rotate(-20→-10→-10)와 안쪽 -10°가 겹쳐 최종 -20°다. 1:1이면 겹친 결과 그대로 둔다.
7. **native driver 한계**: 진행 칸 `backgroundColor`(.3s)와 저울 점의 width/height/margin(.15s)은 native driver로 못 돌린다. `useNativeDriver: false`인 별도 Value를 쓰거나, 점은 `scale`로 바꿔서(18→26 = scale 1.444) native로 돌린다. 색은 JS driver의 `interpolate`로 한다. transform·opacity와 같은 Value에 섞지 않는다.
8. **이중선 테두리(`3px double`)**: RN엔 double이 없다. NbStamp(NU:303–310)처럼 바깥 링과 안쪽 링 두 개로 그린다. CSS 3px double은 선 1px + 틈 1px + 선 1px이다.
9. **한쪽만 dashed**: 해설 위 점선, 절취선, 조각 아래 점선은 한쪽 테두리다. iOS는 네 변이 같지 않으면 dashed를 실선으로 그릴 수 있다. 저장소의 SVG `strokeDasharray` 방식(PathSegment·StationTrack 등)이나 1px 높이 View에 네 변 dashed를 주고 잘라내는 방식이 안전하다. 실기기로 확인할 것.
10. **지그재그 절취 조각(clip-path)**: View엔 clipPath가 없다. react-native-svg `Polygon`으로 같은 16점을 % 좌표로 그리고, 아래 점선도 같은 SVG에 그린다.
11. **그라디언트**: package.json에 그라디언트 라이브러리가 없다. 저울 축은 react-native-svg `LinearGradient`(stop 0 `#7A9E7E`, .5 `#C77E2E`, 1 `#C75146`)로 그린다. 빗금 칩은 NbGauge(NU:408–425)의 SVG 선 방식에 3px 선과 3px 틈, -45°로 그린다.
12. **그림자**: 번지지 않는 오프셋 그림자(`1px 2px 0`, NbButton `2.5px 2.5px 0`)는 iOS에서 `shadowRadius 0` + offset으로 된다. Android `elevation`은 오프셋을 못 준다. 뒤에 어두운 View를 겹치는 방식이 두 플랫폼에서 같다. 글로우 `0 0 0 3px ${pc}33`(spread)는 RN에 없어서, 바깥에 3px 테두리 View를 겹쳐 그린다.
13. **스크롤 영역 좌표**: 핸드오프 기준은 874 높이 프레임과 가짜 상태바 44다. 위쪽 172는 "TOP_INSET(52) − 44 + 172 = 180" 같은 식으로 옮기거나 헤더 실측으로 맞춘다. 아래 182는 화면 아래 기준이다(판정 줄 bottom 98, STEP 2 bottom 34). StepTrack을 남기면 위 기준이 더 밀리니 6번 결정과 함께 정한다.
14. **글꼴 굵기**: 핸드오프 MONO는 전부 700(폰트 링크가 700만 불러옴), 우리 `monoBold`는 IBMPlexMono-SemiBold(600)다. 예문 600은 `bodyMid`, 도장 800은 Pretendard ExtraBold 자산이 없으면 Bold로 둔다. 자산 추가 여부를 결정해야 한다. `nbText.mono`의 `letterSpacing: 1`은 IPA에 쓰지 않는다.
15. **React Compiler**: 애니메이션 Value는 `useRef`로 들고, 모듈 수준 상태에서 꺼내 쓰지 않는다(저장소 메모: 모듈 상태 읽기는 인스턴스당 한 번만 계산됨).
16. **테스트**: 기존 testID(`recall-sheet`, `recall-reveal`, `recall-stamp-*`, `recall-segment`, `recall-check`, `recall-to-step2` 등)를 유지한다. 뜯기 지연(620ms) 때문에 화면 테스트는 fake timer나 `act` 진행이 필요하다. 특히 STEP 2 버튼이 늘 보이게 되면, 완료 전 STEP 2 버튼을 눌러도 아무 일이 없어야 한다는 테스트를 더한다.
