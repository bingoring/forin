# core-safety-or — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번 context·swap ko)

대상: `core-safety-or.yaml`(A·B 합본, `core-safety-or.pre-fix.yaml`과 같은 파일). 단어 173(base 191: 18개 삭제), 상황 21(문장 126), 뉘앙스 63(slider 19 · context 21 · swap 21 · pair 2 · reel 0).
검사기는 이미 통과(`==> 통과`, 변경 목록 77건). 아래는 기계가 못 보는 것만 적었다. 대상 파일은 수정하지 않았다.

표시: **[안전]** = 학습자가 그대로 따라 하면 실무에서 문제가 되는 것. **[범위]** = 간호사 업무 범위 밖(영상 오더·봉합 여부는 집도의, 산소 조절은 마취과, 사건 공개는 집도의). **[사실]** = 미국 수술실 관행·용어와 다름.
**★** = 꼭 바꿀 것. 문장 `en`·`ko`를 바꾸면 그 문장의 v46 필드(`tag`·`icon`·`why`·`decoy`·`distractorsKo` 둘·`blank`)는 **B가 새로 쓰고**, 그 문장을 `example`로 쓰는 단어의 `example`·`exKo`, order 줄도 맞춘다(항목마다 적음). 문장 `ko`만 고치면 그 문장의 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓴다.

**미국 수술실 안전 관행(판정 기준):** 누구든 멈춤을 요청할 수 있다(Stop the line). 우려는 CUS(Concerned → Uncomfortable → Safety issue)로 올리고, 두 번 말해도 안 받아들여지면 지휘 체계로 올린다(Two-Challenge). 타임아웃 동안 모두 하던 일을 멈춘다. 부위 표시는 수술포를 덮은 뒤에도 보여야 한다(Universal Protocol). 계수는 두 사람(소독·순환간호사)이 함께 보고 소리 내어, 정해진 때(절개 전·체강 봉합 전·피부 봉합 전·인계 때)마다 한다. 불일치가 풀리지 않으면 집도의 오더로 수술 중 영상을 찍고, 음성이면 봉합할 수 있다(사건은 보고). 수술 화재 때 가스(산소) 차단은 마취과, 불붙은 물질 제거·식염수는 수술팀, 간호사는 즉시 외쳐 알리고 소화기·도움을 부른다. 폐쇄 루프 의사소통은 이름(역할)을 불러 지시하고 복창받는다. 근접오류·위해사건은 비난 없이 보고하고, 문제 기기·포장은 격리 보관하되 환자 처치가 먼저다. 사건의 환자·보호자 공개는 집도의가 이끈다.

**문장 판정 기준(묶음 4~6과 같음):** 간호사가 이름 붙은 결정(영상 촬영·봉합 여부·산소 조절)을 내리는 말은 "묻기·복창·연결·요청"으로 바꾼다. `Let's`로 시작해도 그 행동이 **다른 역할의 오더·조작**(영상은 집도의 오더, 산소는 마취과)이고 대화 상대가 그 역할이 아니면 같은 꼴로 본다(K1·K3). 팀이 실제로 함께 하는 일(계수·수색·확인)의 `Let's`·`We`, 요청(`Please hold …`), 상태 보고, 위급 시 외침(K4)은 유지한다.

---

## 1. 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 소리·철자가 닮은 같은 분야 말로 고름. 그러나 **정답으로도 맞는 오답 4개**(might ↔ `could`, material ↔ `matter`, right away ↔ `right after`, flame ↔ `flare`), 품사가 다른 오답 5개(oven·often·hair·cite·proceeds) |
| 2 distractorsKo·다른 뜻 | 3 | 길이 위반 없음. **정답 단어의 다른 뜻을 쓴 오답 3개**(time-out `휴식 시간`, step `계단`, backup `복사본`), **정답과 겹치는 오답 1개**(serial `개별의`), 두 오답이 같은 뜻이라 정답이 드러나는 것 4개(lower `높이다·올리다` 등) |
| 3 cue | 3 | 정답 노출 없음. 사실이 틀린 cue 3개(hear "모두가 같이 들어야 폐쇄 루프", check "확인보다 가볍게 훑어보는", X-ray cue에 CT도 맞음), ko를 되풀이한 cue 6개 |
| 4 chips·decoyChips | 4 | 다른 경로로 정답을 만드는 조합 0. 술 관련 조각 `lush`(술꾼)·`bar`, 약한 것 `come`·`chick` |
| 5 뉘앙스 사실 | 3 | **swap 1 정답이 "수술포 밑 표시를 보여 달라"**(표시는 덮은 뒤에도 보여야 함), **context 17 fix "no one was hurt"**(잘못된 안심), slider 3 why "불일치가 날 때만 다시 세요"(계수는 정해진 때마다), swap 3 note "독립 이중 확인", context 15 "adjudicated by the risk office" |
| 6 뉘앙스 설계 | 3 | **pair 7 decoy `the consent form`이 `hold`에 붙음(정답 둘)**. slider 19개 중 **4개가 약함→강함 순서가 아님**(9·11·16·18 — 정답을 0번 칸에 두려고 물러서는 말을 1번에 둠), slider 19는 0번 보기도 정답이 될 수 있음. context 21개 모두 word가 세 장면에 있고 어색한 장면은 모두 환자·보호자(듣는 사람)지만, 9는 어색한 이유가 틀린 내용. 위치 분포는 좋음 |
| 7 결정 11 | 4 | 변경 77건(삭제 18·헤드워드 3·ko 16·문장 태그 40)은 대체로 타당. 놓친 것: anything `아무것도`·sign off `서명하고 넘기다`(틀린 ko), loud·speak는 by heart·right away처럼 구 헤드워드로, side·field ko를 바꾸고 문장 ko는 옛 '부위'로 남김, missing example이 동사 용법, search `수색하다` |

---

## 2. 사실 오류·심각한 문제

1. **[사실] swap 1 정답** `I can't see the mark under the drape — could you show me where it is?` — Universal Protocol은 표시가 수술포를 덮은 **뒤에도 보여야** 한다. 덮인 표시를 어디 있는지 보여 달라는 것은 해결이 아니다(KP 1.2 `The mark is visible after draping.`과도 어긋남). → N8.
2. **[안전] context 17 fix** `There was a small fire, and we put it out quickly — no one was hurt.` — 수술 화재 직후 간호사가 보호자에게 "아무도 다치지 않았다"고 단정한다. 환자 화상 여부는 평가 전이고 사건 공개는 집도의가 이끈다. → C2.
3. **[안전] 문장 19.4** `Let's keep everything exactly as it happened.` — 위해사건 직후 "모든 걸 그대로"는 환자 처치가 먼저라는 단서가 없다(저작자 지적 동의). `as it happened`도 어색한 영어. → S1.
4. **[설계] pair 7 정답 둘** — decoy `the consent form`이 `hold the consent form`(동의서를 들다)으로 자연스럽게 붙고 `search the consent form`도 성립. → N1.
5. **[설계] slider 9·11·16·18 순서** — 정답을 0번 칸에 두면서 [1]에 물러서는 말(`Okay, if you've checked it…`·`Okay, we'll skip it…`·`Let's close now…`·`…it'll turn up soon`)을 둬서 약함→강함이 깨짐. → N2~N5.
6. **[사실] slider 3 why** `불일치가 날 때만 멈추고 다시 세요` — 계수는 정해진 때마다 다시 하고, 의심이 들면 누구든 재계수를 요청할 수 있다. slider 1 why도 "다시 확인하자는 말은 과하다"로 읽혀 상황 9("이미 물었어도 다시 물을게요")와 부딪힘. → N7.
7. **[범위] context 15** — 어색한 장면 `…adjudicated by the risk office`는 사실이 아니고, fix는 간호사가 보호자에게 부위 착오를 공개한다. → C3.
8. **정답이 둘인 단어 오답** — might ↔ `could`(`I could be wrong, but…`가 그대로 맞음), material ↔ `matter`(ko '물질'이 matter의 뜻), right away ↔ `right after`, flame ↔ `flare`, serial의 ko 오답 `개별의`(cue "제품 하나하나에 붙은"에 맞음). → W1·W2·W5·W6·W7.
9. **틀린 ko** — w-anything `아무것도`(정답 오답 `nothing`의 뜻, 영어 고르기에서 정답 둘), w-signoff `서명하고 넘기다`(sign off = 서명해 승인하다). → W3·W4.

---

## 3. 고칠 것 — 단어(v45 필드·결정 11)

| # | 어디 | 문제 | 고칠 것 |
|---|---|---|---|
| W1 ★ | w-might `distractorsEn` | `could`는 `I could be wrong, but…`로 그대로 맞고 ko '~일 수도 있다'도 같음 | `[must, shall]` |
| W2 ★ | w-material `distractorsEn` | `matter`는 ko '물질' 그 자체, cue "타는 것을 가리킬 때"(burning matter)에도 맞음 | `[mineral, memorial]` |
| W3 ★ | w-anything `ko` 아무것도 | 영어 고르기에서 오답 `nothing`도 '아무것도'. 문장 19.3도 `before anything gets moved`(무엇이든) | ko `무엇이든`(distractorsKo `[아무도, 어딘가]` 그대로 — 길이 통과). 19.3 문장 ko·exKo `아무것도 옮겨지기 전에…`는 자연스러운 한국어라 그대로 둠(카드 ko는 뜻, 예문은 문장 번역). cue `어느 것이든 가리지 않고 하나라도 — 기기든 포장이든 옮겨지기 전에 알린다는 말에 쓴다`. changes `{kind: word, id: w-anything, fields: [ko]}` |
| W4 ★ [사실] | w-signoff `ko` 서명하고 넘기다 | sign off는 '확인을 마쳤다고 서명해 승인하다'. '넘기다'(인계)가 아님 — 12.5 `Let's both sign off once the details are confirmed.` | ko `서명해 승인하다`(distractorsKo 그대로 — 7·7·7자). cue `확인을 마쳤다는 뜻으로 이름을 적어 승인한다는 동사구 — 둘이 함께 이렇게 해야 기록이 끝난다`. changes `fields: [ko]` |
| W5 ★ | w-away `distractorsEn` | `said so right after`는 '바로 뒤에'로 거의 같은 뜻 | `[right there, far away]` |
| W6 ★ | w-serial `distractorsKo` | `개별의`는 cue "제품 하나하나에 붙은 고유 번호"에 그대로 맞음 | `[무작위의, 대략의]` |
| W7 ★ | w-flame `distractorsEn` | `flare`는 '확 타오르는 불길' — 수술 화재 장면에서 거의 같은 뜻 | `[frame, fluke]` |
| W8 | w-timeout `distractorsKo` 휴식 시간 | time-out의 다른 뜻(운동 경기의 휴식) | `[회복 관찰, 인수인계]` |
| W9 | w-step `distractorsKo` 계단 | step의 다른 뜻(계단 한 칸) | `[방향, 결과]` |
| W10 | w-backup `distractorsKo` 복사본 | backup의 다른 뜻(백업 사본) | `[지원서, 일정표]` |
| W11 [사실] | w-xray `cue` | "방사선으로 몸속을 찍는 영상 검사"는 오답 `CT scan`에도 맞음 | `수술대 위에서 이동식 장비로 바로 찍는 방사선 사진 — 잔류가 의심되는 거즈를 찾을 때 쓴다` |
| W12 [사실] | w-check `cue` | "확인하다보다 가볍게 훑어보는 느낌" — 15.5(틀린 부위 직후 차트 전체 재확인)·18.4(검체 경로 전 단계)는 가볍게 훑는 일이 아님 | `빠짐이나 이상이 없는지 직접 들여다본다는 동사 — 차트나 한 가지 사항을 다시 볼 때` |
| W13 [사실] | w-hear `cue` | "모두가 같은 말을 같이 이렇게 해야 폐쇄 루프가 된다" — 폐쇄 루프는 듣고 복창·확인하는 것 | `귀로 말이 들어와 알아듣는다는 뜻 — 타임아웃 항목을 모두가 이렇게 하도록 소리 내어 읽는다` |
| W14 | w-open `distractorsEn` | `oven`(명)·`often`(부) — 둘 다 품사가 다름 | `[omit, offer]` |
| W15 | 품사 하나씩 | w-hear `hair`(명) · w-site `cite`(동) · w-procedure `proceeds`(동사·'수익') | hear `[heal, heat]` · site `[sight, size]` · procedure `[process, pressure]` |
| W16 | w-lower `distractorsKo` `[높이다, 올리다]` | 두 오답이 같은 뜻(반대말 둘)이라 듣지 않고 정답이 보임 | `[높이다, 유지하다]` |
| W17 (약) | 두 오답이 겹치는 distractorsKo | w-show `숨기다·가리다`(같은 뜻) · w-file `삭제하다·폐기하다`(같은 뜻) · w-skip `통과하다`('이 항목은 통과' = 건너뛰다와 겹침) | show `[숨기다, 설명하다]` · file `[삭제하다, 검토하다]` · skip `[반복하다, 확인하다]` |
| W18 (약) | cue가 ko를 되풀이 | w-sponge(거즈)·w-plan(계획)·w-package(포장)·w-packaging(포장재)·w-event(사건)·w-everything(모든 것) | sponge `수술 중 피와 체액을 닦고 막는 흡수성 천 — 하나라도 빠지면 안 되는 물품` · plan `무엇을 어떻게 할지 미리 정해 둔 방안 — 시작 전에 팀 모두가 알아야 하는 것` · package `무균 상태로 제품을 싸 놓은 꾸러미 — 열기 전에 이름과 크기를 눈으로 본다` · packaging `제품을 감싼 상자·비닐 같은 겉싸개 — 문제가 생긴 기기와 함께 그대로 두는 것` · event `어떤 일이 일어난 한 건 — 환자에게 해가 간 일을 가리킬 때` · everything `빠짐없이 전부를 한꺼번에 가리키는 대명사 — 멈추고 이것을 다시 확인한다` |
| W19 (약) | decoyChips | w-rush `lush`(속어 '술꾼') · w-number `bar`(술집) · w-comfortable `come`(형제 or-specimen이 약하게 지적한 것) · w-check `chick`(여성 비하 속어) | rush `rash` · number `burr` · comfortable `con` · check `chuck` |
| W20 (권장, 결정 11 헤드워드) | w-loud `loud`(ko 소리 내어) · w-speak `speak`(ko 말을 꺼내다) | by heart·right away를 구로 바꾼 것과 같은 이유 — loud는 7문장 모두 `out loud`, speak는 4문장 모두 `speak(ing) up`이고 ko도 구의 뜻. 단독 loud(시끄러운)·speak(말하다) 카드와 뜻이 다름 | **loud** → en `out loud`, ipa `/aʊt ˈlaʊd/`, chips `[[out], [loud]]`, decoyChips `[owl, load]`, distractorsEn `[out cold, out back]`, cue `속으로 읽지 않고 남들이 듣게 소리를 내서 — 항목·숫자·이름을 이렇게 읽는다`(정답 노출 없게). **speak** → en `speak up`, ipa `/spik ʌp/`, chips `[[speak], [up]]`, decoyChips `[peak, op]`, distractorsEn `[speed up, sneak up]`, cue `속에 담아 두지 않고 우려를 용기 내어 입 밖으로 꺼낸다는 구동사 — 안전한 팀이 서로 북돋는 일`. example 그대로. 검사기 `word_appears`가 `speaking up`·`out loud` 문장을 모두 잡음(확인함). changes `{kind: word, id: …, fields: [en, ipa]}` |
| W21 (결정 11) | w-miss `example` `We're still missing one sponge.` | 헤드워드 missing(형용사 '없어진')인데 example은 동사 용법(miss = 모자라다) | example `I noticed it was missing and said so right away.` · exKo `없어진 걸 알아채고 즉시 말했어요.`(18.3 문장). changes에 이미 `example`이 있음 |
| W22 (약, 결정 11 ko) | w-search `ko` 수색하다 | 경찰 수색 같은 말. 형제 or-specimen 검토가 `샅샅이 찾다`로 바꿈 — OR 안에서 맞춤 | ko `샅샅이 찾다`(distractorsKo `[지우다, 청소하다]` 그대로 — 길이 통과). exKo는 7.4 새 ko(S3)와 같게. changes `fields: [ko]` |
| W23 (약) | w-field `exKo` 수술 부위를 수색해요 | 카드 ko는 `수술 필드`(부위와 가르려고 바꿈)인데 예문 ko는 옛 '수술 부위' | 7.4 ko를 고치면(S3) exKo도 `누구든 방을 나가기 전에 수술 필드를 샅샅이 찾아봐요.` |
| W24 (약) [사실] | w-signin `ko` 입실 확인 | WHO 체크리스트 Sign In은 '마취 전' 단계(cue도 "마취를 시작하기 전에") | ko `마취 전 확인`(distractorsKo 그대로 — 5:4자). changes `fields: [ko]` |
| W25 (약) | w-heart `icon` stetho | 헤드워드가 by heart(외워서)인데 청진기 아이콘 | `bulb`. changes에 `icon` 추가 |

---

## 4. 고칠 것 — 뉘앙스

### 4-1. slider·pair·swap

| # | 어디 | 문제 | 고칠 것 |
|---|---|---|---|
| N1 ★ | 상황 7 pair decoy `the consent form` | `hold the consent form`(동의서를 들다)이 자연스러운 영어, `search the consent form`도 성립 → 정답 둘 | decoy `the count is correct` — 왼쪽 셋 어디에 붙여도 절이 겹쳐 비문(`hold the count is correct`✗·`recount the count is correct`✗·`search the count is correct`✗). why의 `수술 부위를 수색해요(search the field)` → `수술 필드를 샅샅이 찾아요(search the field)` |
| N2 ★ | 상황 9 slider | 정답(인정하고 한 번 더 말하기)이 [0], 물러서는 말이 [1] — 약함→강함이 아님 | scale `["Okay, if you've checked it, I won't say anything else.", "I know, but I'd like to say the side out loud once more.", "We have to redo the whole verification from the start!"]`, answerAt `1` |
| N3 ★ | 상황 11 slider | 같은 문제(정답 [0], 넘어가는 말 [1]) | scale `["Okay, we'll skip it this once because we're busy.", "I hear you, but I'll read the checklist — it's quick.", "Skipping the checklist is against the rules, period!"]`, answerAt `1` |
| N4 ★ | 상황 16 slider | 같은 문제(정답 [0], `Let's close now…` [1]) | 정답 칸을 0에 두고 약한 보기를 넘치는 보기로: scale `["We shouldn't close yet — can we get an X-ray first?", "We stay here until we find it, however long it takes.", "Nobody closes anything — I'm calling risk management now!"]`(51·53·57자), answerAt `0`. why `거즈가 안 나왔으면 닫기 전에 영상으로 확인하자고 요청해요. 닫을지는 집도의가 정하지만, 확인되지 않았다는 사실과 방법을 말하는 것은 간호사의 몫이에요. 무한정 붙잡겠다거나 요청도 하기 전에 위로 보고부터 하겠다는 말은 도움이 안 돼요. 요청이 받아들여지지 않으면 그때 지휘 체계로 올려요.` |
| N5 ★ | 상황 18 slider | 같은 문제(정답 [0], 낙관하는 말 [1]) | scale `["One cup is missing, but I'm sure it'll turn up soon.", "One specimen is unaccounted for — let's search now.", "Someone threw away a specimen, and I'm reporting them!"]`, answerAt `1` |
| N6 | 상황 19 slider [0] `Could you put it aside? We can sort it out later.` | 문제 기기를 따로 빼 두는 것은 격리 보관(context 19 기록도 `device sequestered`) — 정답으로도 읽힘 | [0] `It's broken anyway, so toss it — I'll note it later.`(52자). why `문제가 된 기기와 포장은 조사를 위해 그대로 보존해야 해요. 무엇을 어떻게 두라고 구체적으로 말하면 되고, 어차피 고장 났다고 버리게 두면 원인을 밝힐 수 없고, 협박하면 팀 관계가 깨져요.` |
| N7 [사실] | 상황 3 slider why · 상황 1 slider why | 3: `불일치가 날 때만 멈추고 다시 세요` — 계수는 정해진 때마다 다시 하고 의심이 들면 누구든 재계수를 요청할 수 있음. 1: "맞는 것을 또 다시 확인하자는 말은 무겁다" — 상황 9와 부딪힘 | 3 why `둘이 함께 센 숫자가 맞으면 맞다고 분명히 말하고 기록해요. 근거 없이 '혹시 모르니'를 덧붙이면 확인이 끝났는지 흐려져요. 계수는 정해진 때마다 다시 하고, 의심이 들면 무엇이 의심스러운지 말하고 다시 세요.` · 1 why `표시가 분명하고 동의서와 맞으면 본 대로 짧게 말하면 돼요. 의심할 근거가 있으면 그 근거를 말하고 다시 확인하자고 해요. 근거 없이 '모두 멈춰요!'라고 하면, 진짜 불일치가 났을 때 써야 할 강한 말의 힘이 약해져요.` |
| N8 ★ [사실] | 상황 1 swap 정답 `I can't see the mark under the drape — could you show me where it is?` | 표시는 덮은 뒤에도 **보여야** 함. 덮인 표시를 가리켜 달라는 것은 해결이 아님 | 정답(보기 2번 자리 그대로) `I can't see the mark after draping — can we confirm the site first?` · note `표시가 안 보인다는 사실을 말하고, 진행하기 전에 부위를 확인하자고 요청해요.` · why `표시는 수술포를 덮은 뒤에도 보여야 해요. 안 보이면 짐작하지 않고 그 사실을 말한 뒤, 진행하기 전에 부위를 확인하자고 요청해요.` · ko `수술포를 덮은 뒤 표시가 안 보여요 — 먼저 부위를 확인할 수 있을까요?` · words `[w-mark, w-drape, w-confirm, w-site]`(w-show 빠짐, 모두 상황 1 문장에 있음) |
| N9 (약) [사실] | 상황 3 swap note(보기 2) `독립 이중 확인이 아니라…` · swap ko | 수술 계수는 '독립 이중 확인'(각자 따로)이 아니라 두 사람이 함께 보고 소리 내어 셈 — 보기 1 note("각자 세면…")와도 어긋남. ko `함께 소리 내어 세요`는 정답 `I'll count…`(1인칭)과 다름 | note `두 사람이 함께 보고 세는 것이 아니라 한 사람의 숫자를 믿는 거예요.` · ko `함께 소리 내어 셀게요 — 둘 다 같은 숫자를 듣도록요` |
| N10 | 상황 20 swap 정답 `Let's take thirty seconds to do this step right.` · note · ko | 시간을 못 박음 — 계수·확인이 30초 안에 끝난다는 보장이 없고 slider 20 cue는 계수 생략 압박(K6과 같은 문제, 이 문항은 KP가 아니라 지금 고칠 수 있음) | 정답 `Let's take a moment to do this step right.`(42자) · note `잠깐이면 된다고 하면서도 시간을 못 박지 않고 제대로 하자고 해요.` · why `시간 압박에는 건너뛰지 않고 잠깐 시간을 들여 제대로 하자고 해요. 나중으로 미루면 단계가 무의미해져요.` · ko `이 단계는 잠깐 시간을 들여 제대로 해요` · words: K6을 유지하면 `[w-skip, w-step]`, K6을 바꾸면 `[w-skip, w-step, w-moment]`(w-second가 상황 20 문장에서 사라져 V15) |
| N11 (약) | 상황 5 slider cue `…some prep has pooled near the drapes.` | 정답이 `before we drape`인데 cue는 이미 수술포가 있다고 함 | cue `The skin prep is alcohol-based, the cautery is about to be used, and some prep has pooled in the skin folds.` |
| N12 (약) | 상황 4 slider why `라벨은 이름만으로 되지 않고 검체 이름·부위·날짜까지` | 라벨에는 환자 식별자 두 가지가 들어감 | `라벨은 이름 하나로 되지 않고 환자 식별자 두 가지와 검체 이름·부위까지 채워져야 해요. …`(뒤 그대로) |

### 4-2. context — 핸드오프 모양(v46 7번)

21개 모두 `word`가 세 장면 `en`에 있다(19 `notify`는 `notified`·`notifying` 활용형이라 스크립트의 글자 일치만 False — 누락 아님). 어색한 장면은 21개 모두 환자·보호자이고 나머지 두 장면(의료진·기록)과 듣는 사람이 다르다. **핸드오프 모양 19개, 고칠 것 2개(9·15), fix만 고칠 것 2개(17·7), 작은 것 3개.**

| # | word | 문제 | 고칠 것 |
|---|---|---|---|
| C1 ★ | 9 consent | 어색한 장면 `Your consent indemnifies the hospital against procedural liability.`는 말투가 아니라 **틀린 내용**(why도 "이 서류의 목적과도 달라요") — 같은 뜻·다른 자리가 아님 | 장면(ok:false, 간호사 → 환자) `Your consent documents the laterality of the planned procedure.` · fix 그대로 · why `뜻은 셋 다 '동의서'예요. 같은 수술팀에는 동의서·표시·영상이 맞는다고 짧게, 기록에는 서명과 일치 여부를 건조하게 적어요. 하지만 환자에게 'laterality'나 'planned procedure' 같은 서류 말을 쓰면 무슨 뜻인지 몰라 불안해져요. 환자에게는 어느 쪽 무릎인지 적힌 서류라고 쉬운 말로 해요.` |
| C2 ★ [안전] | 17 extinguisher | fix `…we put it out quickly — no one was hurt.` — 화상 평가 전 단정(잘못된 안심), 사건 공개를 간호사가 함 | fix `There was a small fire on the drapes, and it was put out quickly. Your surgeon will talk with you about it.` · why 끝 문장 `보호자에게는 무슨 일이 있었고 빨리 껐다는 것만 쉬운 말로 하고, 다쳤는지와 자세한 경과는 집도의가 설명해요.` |
| C3 [범위·사실] | 15 halt | 어색한 장면 `…while a laterality discrepancy is adjudicated by the risk office.` — 위험관리실이 수술 중 판정하지 않음(틀린 내용). fix `We caught a mix-up before it caused any harm…`는 간호사가 부위 착오를 공개 | 장면 `We halted the case pending resolution of a laterality discrepancy.` · fix `We paused before starting to double-check some details, and your surgeon will talk with you.` · why `뜻은 셋 다 '중단하다'예요. 집도의에게는 짧고 분명하게, 기록에는 이유와 확인 내용을 건조하게 적어요. 하지만 보호자에게 'laterality discrepancy'나 'pending resolution'이라고 하면 무슨 일인지 알 수 없고 겁나요. 보호자에게는 확인하느라 잠시 멈췄다고 쉬운 말로 하고, 무슨 일이었는지는 집도의가 설명해요.` |
| C4 (약) | 7 recount | fix `One sponge count didn't match, so we're counting again to be sure — this is routine.` — 계수 불일치는 '일상'이 아님(가벼운 잘못된 안심), `One sponge count`도 어색 | fix `The sponge count didn't match, so we're counting again to be sure.` · why의 `숫자가 안 맞아 다시 세는 일상 절차라고` → `숫자가 안 맞아 확실히 하려고 다시 센다고` |
| C5 (약) | 3 count | 어색한 장면 `Our count reconciled against…`(reconcile은 타동사) · context `ko` `계수하다`인데 장면 둘은 명사 | 장면 `Our count was reconciled against the initial tally per protocol.` · ko `계수(하다)` |
| C6 (약) | 18 unaccounted | `word`가 헤드워드 `unaccounted for`와 다름(세 장면 모두 `unaccounted for`) | word `unaccounted for` |
| C7 (약) | 12 implant | 기록 장면 `Implant size 6; … verified with surgeon.` — 같은 상황 slider는 "5를 요청했는데 상자가 6" | 기록 `Implant size 5; serial and lot recorded; verified with surgeon.` |

**[사용자 결정, 권고 유지] context `word`가 대부분 일반어다.** 21개 중 임상·안전어는 time-out·specimen·prep·fixative·near-miss·extinguisher·unaccounted for 정도이고 나머지(concern·mark·count·proceed·recount·consent·oxygen·checklist·implant·briefing·halt·notice·notify·protect)는 보호자도 아는 말이라, 어색함이 그 말이 아니라 같은 문장의 다른 임상어(`perioperative risk variable`·`FiO2`·`UDI`)에서 온다. or-massive-transfusion은 word를 임상어로 바꿨지만, 같은 core 주제인 core-language-or 검토는 "세 장면이 같은 말을 공유하면 허용(TASK 9)"으로 **유지**를 권했다. 이 주제(안전 문화)도 세 장면이 함께 쓸 임상어가 적어 같은 기준으로 **유지**를 권한다. 일반어 word를 허용하지 않기로 하면 14개를 다시 써야 한다.

**보호자 장면의 사건 공개 기준(or-count N5와 같음):** 간호사는 무슨 일이 있었는지 쉬운 말로 알리되 원인·결과 단정과 공개는 집도의에게 넘긴다. 13(근접오류)·16(거즈)·18(검체)·19(위해사건) fix는 "확인 중이고 알려 드리겠다"는 정직한 말이라 유지, 7·15·17만 고친다(C2~C4).

### 4-3. swap `ko`
21개 모두 `before[0]`·`before[2]`가 빈 문자열(문장 통째 고르기)이고 `before[1]`은 오답 보기 안에 있다. ko는 21개 모두 정답 문장의 뜻과 맞는다 — 고칠 것은 1(N8에서 정답이 바뀜)·3(N9 `셀게요`)·20(N10)뿐. (약) 15 ko `부위가 확인될 때까지 앞으로 나아가지 않을게요`는 side를 '부위'로 옮김 — `수술할 쪽이 확인될 때까지 앞으로 나아가지 않을게요`(S3의 15.4와 같이).

---

## 5. 고칠 것 — 문장(keyPhrase 아닌 것)·ko

### 5-1. 비KP 문장

| # | 문장 | 문제 | 고칠 것 | 딸린 것 |
|---|---|---|---|---|
| S1 ★ [안전] | 위해사건 즉시 보고 #4 `Let's keep everything exactly as it happened.` | 환자 처치가 먼저라는 단서 없이 "모든 걸 그대로" — 처치를 막는 말로 읽힘. `as it happened`도 어색 | en `Once the patient is safe, let's keep everything exactly as it was.` · ko `환자가 안전해지면, 모든 걸 그때 그대로 정확히 둬요.` · chunks `["Once the patient is safe,", "let's keep", "everything", "exactly as it was", "."]`(V5·V8·V9 함수로 확인) · words `[w-keep, w-everything, w-exactly]`(w-happen 빠짐 — 상황 19 뉘앙스는 w-happen을 안 씀, 상황 19 단어 19 → 18개) | **B가 v46 필드 새로**(tag·icon·why·decoy·distractorsKo 둘·blank — 지금 blank `keep`·decoy `just as planned`). w-keep·w-exactly `example`·`exKo`를 새 문장으로. changes `fields: [en, ko, chunks, words]` |
| S2 | chunks 구 경계(비KP) | 0.5 `if something feels / wrong`(동사와 보어를 끊음) · 1.4 `this against / the consent form`(전치사구를 끊음) · 5.3 `where the three elements / of fire are`(`elements of fire`를 끊음) · 20.3 `but I / still need`(주어와 동사를 끊음) | 0.5 `["This team wants", "to hear it", "if something", "feels wrong", "."]` · 1.4 `["I want to", "double-check", "this", "against the consent form", "."]` · 5.3 `["I always know", "where", "the three elements of fire", "are in this room", "."]` · 20.3 `["I hear that we're in a rush,", "but", "I still need", "this step", "."]` (모두 V5·V8·V9 확인) | changes `fields: [chunks]`. B는 decoy가 새 청크와 같지 않은지만 확인 |
| S3 | 문장 ko에 옛 '부위' | w-side ko를 `쪽(좌·우)`로, w-field ko를 `수술 필드`로 바꿨는데 문장 ko는 '부위'(= w-site): 1.5 `환자분께 직접 부위를 확인해…` · 9.3 `절개 전에 부위를 한 번 더…` · 15.4 `부위가 확인될 때까지 앞으로 나아가지 않을게요.` · 7.4 `…수술 부위를 수색해요.` · 16.4 `모든 곳을 수색하기 전에…`(W22) | ko만: 1.5 `환자분께 직접 수술할 쪽을 확인해 달라고 부탁해요.` · 9.3 `절개 전에 수술할 쪽을 한 번 더 소리 내어 말해요.` · 15.4 `수술할 쪽이 확인될 때까지 앞으로 나아가지 않을게요.`('앞으로 나아가지'는 w-forward·w-move 카드가 기대는 말이라 남김) · 7.4 `누구든 방을 나가기 전에 수술 필드를 샅샅이 찾아봐요.` · 16.4 `모든 곳을 샅샅이 찾기 전에 다시 세요.` | 다섯 문장 distractorsKo 둘씩 다시. exKo 맞출 것(스크립트로 뽑음): w-side(1.5)·w-incision(9.3)·w-forward·w-move(15.4)·w-search·w-field(7.4)·w-everywhere(16.4). changes `fields: [ko]` |

### 5-2. keyPhrase 문장의 ko만 (en·chunks 그대로, changes에 `fields: [ko]`)

| # | 문장(KP) | 문제 | 새 ko | 딸린 것 |
|---|---|---|---|---|
| KO1 | 계수 기본 참여 #1 `I'll count out loud with you.` | `당신과 함께` — 한국어 대화에서 쓰지 않는 말 | `같이 소리 내어 셀게요.` | distractorsKo 둘 다시 |
| KO2 | 이물 잔류 #2 `Let's search the field and get an X-ray.` | 옛 말 '수술 부위·수색'(S3과 같음). (K1로 en을 바꾸면 그 ko를 씀) | en 유지 시 `수술 필드를 샅샅이 찾아보고 엑스레이를 찍어요.` | distractorsKo 둘 다시, w-xray exKo |
| KO3 (약) | 검체 분실 #1 `Let's stop and search everywhere now.` | '수색'(W22) | `지금 멈추고 모든 곳을 샅샅이 찾아봐요.` | distractorsKo 둘 다시(이 문장을 example로 쓰는 단어 없음) |
| KO4 (약) | 안전 문화 #2 `We support each other in speaking up.` | `말을 꺼내는 서로를 지지해요` 번역투 | `우리는 서로가 말을 꺼낼 수 있게 지지해요.` | distractorsKo 둘 다시, w-support·w-eachother·w-speak exKo |

### 5-3. 변경 목록(`changes-core-safety-or.yaml`, 77건) 판정
- word-remove 18건: 공통 목록 8(patient·room·now·time·know·see·today·nurse) + 목록 밖 10(thing·first·next·later·thirty·short·fine·still·yet·right). 목록 밖 10개 상한 안. right는 '맞는/오른쪽/제대로'가 한 카드에 묶였던 것이라 **타당.**
- 헤드워드 3건: `by heart`(문장은 know by heart — 단독 heart '마음' 카드는 틀림)·`right away`(두 문장 모두 right away)·`missing`(태그된 세 문장 모두 '없어진·빠진', nothing gets missed는 태그를 뺌) **모두 타당.** 다만 missing example은 W21, by heart 아이콘은 W25, 같은 이유로 loud·speak도 구로(W20).
- ko 16건: speak/say, check/confirm, double-check/re-verify, begin/start, pause/stop/halt, full/whole, field/site/side 가르기, dry(동사)·drape·mark·report(명·동 함께)·call·close — **타당.** 다만 `개시하다`(begin)·`재검증하다`(re-verify)는 문장 ko(`시작 전에`·`다시 확인해요`)와 결이 다르나 정답 둘을 피한 값이라 둠. 놓친 것: anything(W3)·sign off(W4)·sign-in(W24)·search(W22), 그리고 side·field ko를 바꾼 뒤 문장 ko(S3).
- 문장 words 40건 타당(쉬운 단어 태그 빼기·뜻이 다른 태그 빼기).
- (보고만) 간호사가 이미 아는 말이 은행에 남음: say·read·write·send·stop·need·ask·hear·left·team·number·size·start·open·help·touch·find·move·keep. 1할 상한을 채웠으므로 이번에는 빼지 않는 것이 맞음.

---

## 6. 저작자 메모 판정

| 메모 | 판정 |
|---|---|
| 이물 잔류 #2 `…get an X-ray.` (KP) — 영상은 집도의 오더 | **동의(약하게)** → K1. 대화 상대가 소독간호사라 `ask for`로 바꿔도 상대를 3인칭으로 부르지 않음 |
| 이물 잔류 #1 `We can't close until it's found.` (KP) — 봉합은 집도의 결정 | 범위보다 **사실**이 걸림: 못 찾아도 영상 음성이면 집도의가 봉합할 수 있음 → K2(약하게 바꾸기) |
| 화재 위험 사전 소통 #1 `Let's lower the oxygen…` (KP) — 산소는 마취과 몫 | **동의(약하게)** → K3. 대화 상대가 순회간호사라 두 간호사가 산소를 낮추자는 말로 읽힘 — K1(영상)과 같은 꼴이라 같은 권고. 같은 상황 context 10 의료진 장면(`Can we lower the oxygen if the patient tolerates it…?`)이 이미 요청 꼴을 가르침 |
| 수술 화재 #0 `Fire on the field—stop the oxygen.` (KP) — 외침인가 지시인가 | **외침으로 유지** → K4. 불을 본 사람이 즉시 알리고 각자 역할을 부르는 것이 수술 화재 대응. 이름(역할)을 넣는 대안은 K4에 |
| 계수 불일치 #2 `Please hold closure…` (KP) | **유지** → K5. 요청 꼴이고 slider·swap 7 why가 "닫을지는 집도의가 정함"을 가르침 |
| 압력 저항 #2 `Let's take thirty seconds…` (KP) — 시간 못 박기 | **동의(약하게)** → K6. 같은 말을 쓰는 swap 20은 KP가 아니라 지금 고침(N10) |
| 계수 기본 참여 #0 ko `함께` | **허용, 유지.** `Let's`가 함께 하자는 말이고, 계수는 실제로 두 사람이 함께 함(AORN). 고칠 것은 #1의 `당신과`(KO1) |
| 위해사건 #4 `Let's keep everything exactly as it happened.` | **동의** → S1(★ [안전]) |
| 검체 라벨 #1 `This is the right specimen and site?` (KP) | **유지 권고** → K7. 끝을 올려 묻는 구어 확인 꼴(9.1 `The consent, mark, and imaging all agree?`도 같음) |
| 헤드워드 by heart · right away · missing | **셋 다 타당**(§5-3). missing example·right away 오답·by heart 아이콘만 W21·W5·W25 |
| pair 2개만 씀 | **문제 없음.** STEP 1 최솟값은 slider 19개가 채우고, 구동사로 정답이 하나인 짝을 만들기 어려운 장면은 slider로 바꾸라는 지시서와 맞음. 형제 or-specimen도 2개. 다만 pair 7 decoy는 N1 |
| B 메모(오답 둘 다 사실문 24문장, 6.4 vote·15.3 wave) | B 검토 몫. 19.4는 이 검토에서 문장이 바뀌므로(S1) B가 새 문장 기준으로 다시 씀 |

---

## 7. 표 — distractorsEn 품사가 다른 것, 정답으로도 맞는 오답, 정답의 다른 뜻을 쓴 오답

★ = 꼭 바꿀 것(정답이 둘). 나머지는 권장.

| 단어(품사) | 지금 오답 | 문제 | 대안 |
|---|---|---|---|
| ★ might(조동사) | could | `I could be wrong, but…` 그대로 맞음, 뜻도 '~일 수도 있다'(W1) | must |
| ★ material(명) | matter | ko '물질' 그 자체, `burning matter`도 맞음(W2) | mineral |
| ★ right away(부) | right after | `said so right after` — 거의 같은 뜻(W5) | far away |
| ★ flame(명) | flare | 확 타오르는 불길 — 수술 화재에서 거의 같은 뜻(W7) | fluke |
| ★ serial(형) | dKo 개별의 | cue "제품 하나하나에 붙은 고유 번호"에 맞음(W6) | 대략의 |
| ★ anything(대) | (ko 자체) 아무것도 | 오답 `nothing`의 뜻 — 영어 고르기에서 정답 둘(W3) | ko 무엇이든 |
| time-out(명) | dKo 휴식 시간 | time-out의 다른 뜻(W8) | 회복 관찰 |
| step(명) | dKo 계단 | step의 다른 뜻(W9) | 결과 |
| backup(명) | dKo 복사본 | backup의 다른 뜻(W10) | 일정표 |
| X-ray(명) | CT scan | 오답 자체는 맞으나 cue가 CT에도 맞음(W11) | cue만 |
| open(동) | oven(명) · often(부) | 둘 다 품사 다름(W14) | omit · offer |
| hear(동) | hair(명) | 품사 다름(W15) | heat |
| site(명) | cite(동) | 품사 다름(W15) | size |
| procedure(명) | proceeds(동사·'수익') | 동사로 읽힘(W15) | pressure |
| (약) each other(대) | every other(한정사) | 품사 다름, 헷갈림은 좋음 | 그대로 둬도 됨 |
| (약) preserve(동) | reserve | '따로 남겨 두다'로 걸치나 cue "변하지 않도록 그대로"로 갈림 | 그대로 |
| (약) skip(동) | skim | `I won't skim the checklist`도 말이 되나 cue "하지 않고 넘어간다"로 갈림 | 그대로 |
| (약) sign-in · sign-out | check-in · check-out | 병원에 따라 쓰는 이름이나 cue(체크리스트 단계)로 갈림 | 그대로 |

---

## 8. 기계적 전수 확인 결과

- **pair 7(계수 불일치)** — 왼쪽 3 × (오른쪽 3 + decoy 1) = 12조합: `hold closure until we resolve this`✓ · `hold the sponges out loud together`✗ · `hold the field for the missing sponge`✗ · **`hold the consent form`✓** · `recount closure…`✗ · `recount the sponges out loud together`✓ · `recount the field…`✗ · `recount the consent form`✗ · `search closure…`✗ · `search the sponges out loud together`✗ · `search the field for the missing sponge`✓ · **`search the consent form`△**. **decoy가 붙음 → 정답 둘**(N1). 대안 decoy `the count is correct`는 12조합 모두 불성립 확인.
- **pair 13(근접오류)** — 12조합: `file a safety report today`✓ · `file it from happening again`✗ · `file from the near-miss`✗ · `file the person who spoke up`✗ · `prevent a safety report today`△(문법은 되나 뜻이 엉뚱 — 장면 밖에서도 자연스럽지 않음) · `prevent it from happening again`✓ · `prevent from the near-miss`✗ · `prevent the person who spoke up`✗(from 없이 불완전) · `learn a safety report today`✗ · `learn it from happening again`✗ · `learn from the near-miss`✓ · `learn the person who spoke up`✗. 정답 하나.
- **swap(21개)** — 21개 모두 `before[0]`·`before[2]`가 빈 문자열이라 이어 붙인 문법은 맞고, `before[1]`은 모두 오답 보기 안에 있음. 정답 모두 하나. '한 단어 바꾸기'가 아니라 '문장 고르기'인 것은 형제 OR 주제와 같아 결함으로 세지 않음. ko 판정은 §4-3.
- **context(21개)** — §4-2. word 21/21 세 장면에 있음(19는 활용형), word·ko 짝: 3(`계수하다` ↔ 명사 장면)·18(`unaccounted` ↔ 헤드워드 `unaccounted for`)만 어긋남(C5·C6).
- **slider(19개) 약함→강함** — 성립 15개(0·1·2·3·4·5·6·8·10·12·14·15·17·19·20), 깨짐 4개(9·11·16·18, N2~N5). cue로 정답이 둘인 것 1(19, N6). 축이 없는 것 0.
- **정답 칸·장면 위치 분포** — slider `answerAt` 0:6 · 1:6 · 2:7. swap 정답 칸 0:7 · 1:7 · 2:7. context 어색한 장면 0:7 · 1:7 · 2:7. **N2~N5를 반영한 뒤 slider는 0:3 · 1:9 · 2:7**(9·11·18이 0→1로 옮김 — 넷을 뒤집기만 하면 0:2 · 1:10 · 2:7로 가운데가 몰려서, 16은 정답을 0번 칸에 두고 약한 보기 대신 넘치는 보기를 넣음).
- **slider 정답 길이(19개)** — 혼자 가장 김 7(4·5·9·10·11·14·17) · 동률 가장 김 2(6·12) · 혼자 가장 짧음 4(1·3·18·19) · 동률 가장 짧음 1(8) · 가운데 5(0·2·15·16·20). 가장 긴 것이 정답일 확률 9/19로 우연(1/3)보다 조금 높지만 길이만으로 맞힐 수는 없음. N4·N6 반영 뒤에도 같음(16은 가장 짧음으로 바뀜).
- **chunks(126문장)** — 비KP 끊김은 S2 넷(+19.4는 새 문장으로 해소). KP는 §9 끝 목록.
- **decoyChips × chips** — 정답 조각·decoy의 1~3조각 모든 순열을 금칙어 목록(비속어·성적·술·마약·장례·폭력·무기·민족 비하)과 대조하고 decoy 하나하나를 눈으로 봄. 걸린 것: `lush`·`bar`(술)·`come`·`chick`(W19). 일상어라 둠: `mount`·`hole`·`rite`·`nun`·`tear`·`sick`·`rat`. **정답 단어 `alcohol`(w-alcohol)은 소독용 알코올이라는 임상어라 문제 없음.** decoy로 정답 철자를 다른 경로로 만드는 조합 0.
- **distractorsEn 품사** — §7 표.
- **cue에 ko 되풀이(스크립트)** — 12개 중 뜻풀이 안에 ko 낱말만 되풀이한 6개를 W18로(나머지 confirm·start·say·procedure·each other·understand는 다른 단서가 있어 둠). 정답 영어 노출 0.
- **대화 상대(persona, 정본 or.yaml 21개 전부)** — 외과의 3(1 David Hunt·9 Paul Nguyen·14 Kevin Shaw), 소독간호사 4(3·7·12·16), 순회간호사 14(0·2·4·5·6·8·10·11·13·15·17·18·19·20). 문장이 대화 상대를 3인칭으로 부르는 곳은 없음(18.2 `…and the surgeon`·12.1 `the surgeon's request`는 상대가 간호사). 7·16(소독간호사)의 `Please hold closure`·`We can't close`, 17(순회간호사)의 `stop the oxygen`은 상대가 아니라 방 전체에 하는 말로 읽어 판정함. 아래 KP 대안은 상대가 외과의인 1·9·14에서 `the surgeon`을 쓰지 않게, 7·16·17에서는 상대가 아닌 역할만 부르게 썼다.
- **고친 뒤 확인(모의 반영 스크립트)** — S1의 words, K1·K2·K3·K6 대안의 words, swap 1(N8)·swap 20(N10, K6을 바꾼 경우) words를 모두 얹어 돌림: 상황마다 서로 다른 단어 8개 이상(상황 1: 13 · 10: 19 · 16: 15 · 19: 18 · 20: 11), 뉘앙스 `words`가 모두 그 상황 문장에 있음(V15 위반 0), 고아 단어 0. K6을 바꾸면 swap 20 `words`에서 w-second를 빼야 함(N10). 변경 목록 내역도 스크립트로 셈(삭제 18 · 헤드워드 3 · ko 16 · 문장 40 = 77).

---

## 9. 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)

KP en을 바꾸기로 하면 **정본 `server/content/nurse/topics/or.yaml`의 `keyPhrases`**(검사기 V4가 여기서 읽음 — `verify_one_theme.py`가 정본 상황에 주제 파일을 덮어 검사)와 `in-core-safety-or.json`의 같은 문자열을 함께 바꿔야 한다. 바꾸면 그 문장의 chunks·ko·v46 필드(B), 그 문장을 example로 쓰는 단어의 example·exKo, 뉘앙스 보기·example, order 줄이 따라 바뀐다(항목마다 적음). 대안 chunks는 모두 V5·V8·V9 함수로 확인했다. 대안은 대화 상대를 3인칭으로 부르지 않는다(§8 persona).

- **K1 이물 잔류 16.2** `Let's search the field and get an X-ray.` · 문제: 수술 중 영상은 집도의 오더 — 간호사가 찍자고 정하는 말로 읽힘(묶음 4~6의 '요청' 기준) · 대안 `Let's search the field and ask for an X-ray.`(chunks `["Let's search", "the field", "and ask for", "an X-ray", "."]`, words `[w-search, w-field, w-ask, w-xray]`, ko `수술 필드를 샅샅이 찾아보고 엑스레이를 요청해요.`) · 상대는 소독간호사라 `ask for`의 대상(집도의)이 상대가 아님 · **권고: 바꾸기(약하게).** 연쇄: w-xray example·exKo, order 16 줄 3 `…let's search the field and ask for an X-ray.`
- **K2 이물 잔류 16.1** `We can't close until it's found.` · 문제: 못 찾아도 수술 중 영상이 음성이면 집도의가 봉합할 수 있음(사건은 보고) — "찾을 때까지 못 닫는다"는 절대 규칙은 사실이 아님 · 대안 `We shouldn't close until it's found or the X-ray is clear.`(chunks `["We shouldn't close", "until it's found", "or the X-ray", "is clear", "."]`, words `[w-find, w-xray]`, ko `찾거나 엑스레이에서 이상이 없을 때까지는 닫으면 안 돼요.`) · slider 16 정답(`We shouldn't close yet — can we get an X-ray first?`)과 맞물림. **유지하면 slider 16 오답 `We stay here until we find it, however long it takes.`(지금 [2], N4 뒤 [1])가 '찾을 때까지 붙잡기'를 넘치는 말로 가르쳐 KP와 부딪히므로, 그 보기를 `We'll keep the patient open until I say otherwise!`처럼 다른 넘치는 말로 바꿔야 함** · **권고: 바꾸기(약하게).** 연쇄: w-find example이 16.1이 아니면 그대로(지금 w-find example은 16.1 — example·exKo 바꿈).
- **K3 화재 사전 소통 10.1** `Let's lower the oxygen and let prep dry.` · 문제(저작자): 산소 조절은 마취과 몫. 덧붙여 `let prep dry`는 관사가 빠짐 · 대안 `Let's ask anesthesia to lower the oxygen and let the prep dry.`(chunks `["Let's ask", "anesthesia", "to lower the oxygen", "and let the prep dry", "."]`, words `[w-ask, w-lower, w-oxygen, w-prep, w-dry]`) · 상대는 순회간호사라 `anesthesia`는 3인칭이어도 됨 · **권고: 바꾸기(약하게)** — K1과 같은 꼴(상대가 그 역할이 아닌데 `Let's`로 다른 역할의 조작을 정함)이라 같은 권고. context 10 의료진 장면·why와도 맞물림. 연쇄: w-lower example·exKo, order 10 줄 2 `So let's ask anesthesia to lower the oxygen and let the prep dry.`
- **K4 수술 화재 17.0** `Fire on the field—stop the oxygen.` · 문제(저작자): 외침인가 지시인가 · 대안(이름 지정 폐쇄 루프) `Fire on the field—anesthesia, stop the oxygen.`(chunks `["Fire", "on the field—anesthesia,", "stop", "the oxygen", "."]`) · **권고: 유지** — 불을 본 사람이 즉시 외치고 역할을 부르는 것이 대응 순서이고 상대(순회간호사)에게 하는 지시가 아님. 바꾸면 slider 17 정답·example `Fire on the field! Anesthesia, stop the oxygen and get the extinguisher!`, order 17 줄 1.
- **K5 계수 불일치 7.2** `Please hold closure until we resolve this.` · **권고: 유지**(요청 꼴, 집도의 결정은 why가 가르침).
- **K6 압력 저항 20.2** `Let's take thirty seconds to do it right.` · 문제: 계수·확인이 30초 안에 끝난다는 보장이 없음(slider 20 cue는 계수 생략 압박) — 지킬 수 없는 시간 약속 · 대안 `Let's take a moment to do it right.`(chunks `["Let's take", "a moment", "to do it", "right", "."]`, words `[w-moment]`, ko `제대로 하게 잠깐만 시간을 들여요.`) · **권고: 바꾸기(약하게).** 연쇄: w-second가 상황 20 문장에서 빠짐 → swap 20 `words`에 w-second 금지(N10), 상황 20 단어 11개 유지. order 20 줄 3 `Instead, let's take a moment to do it right.`, 줄 4 `we'll be right back on schedule`도 약속이라 B가 함께 보기.
- **K7 검체 라벨 4.1** `This is the right specimen and site?` · 문제(저작자): 평서문 끝을 올린 구어 질문 · 대안 `Is this the right specimen and site?`(chunks `["Is this", "the right specimen", "and site", "?"]`) · **권고: 유지** — 미국 수술방에서 흔한 확인 말투이고 9.1도 같은 꼴.
- **유지 권고(검토함):** 15.3 `I need everyone to stop for one second.`(`for a second`는 '잠깐'이라는 관용 — K6처럼 걸리는 시간을 약속하는 말이 아님), 3.0 ko `함께`(§6), 15.2 `We halt now and re-verify everything.`(누구든 멈춤 요청 가능), 9.2 `I won't proceed until we all confirm.`, 17.1·17.2(화재 때 각자 역할), 18.2 `I'm reporting this to pathology and the surgeon.`(상대는 순회간호사), 14.0 `Let's brief the plan…`(구어).
- **KP chunks 구 경계(보고만 — 대안은 V8 조각 수를 지킴, 모두 함수로 확인)**
  - 1.0 `Is the surgical / site`(surgical site를 끊음) → `["Is", "the surgical site", "marked", "?"]`
  - 3.2 `The initial / count` → `["The initial count", "is", "correct", "."]`
  - 5.1 `together are / a risk`(동사와 보어를 끊음) → `["Oxygen,", "prep alcohol,", "and cautery together", "are a risk", "."]`
  - 9.0 `the correct / side` → `["Let's", "re-verify", "the correct side", "."]`
  - 10.0 `a high / fire-risk case` → `["This", "is", "a high fire-risk case", "."]`
  - 11.0 `the full / safety checklist` → `["Let's", "complete", "the full safety checklist", "."]`
  - 12.2 `the implant / details` → `["I'll", "document", "the implant details", "."]`
  - 18.0 `is unaccounted / for`(unaccounted for를 끊음) → `["One specimen", "is", "unaccounted for", "."]`
  - 20.0 `this safety / step` → `["I can't", "skip", "this safety step", "."]`
  - 17.0 `Fire on / the field—stop`(전치사를 명사구에서 떼어 냄) → `["Fire", "on the field—stop", "the oxygen", "."]`
  - (약) 2.1 `Patient, procedure, and / site—everyone`(and로 끝남) → `["Patient,", "procedure,", "and site—everyone agree", "?"]`
  - (약) 2.2 `before we / start` · 14.1 `before we / begin`(주어와 동사를 끊음) → `["Any concerns", "before", "we start", "?"]` · `["Any concerns", "before", "we begin", "?"]`
  - (피할 수 없음) 15.0 `Stop—this / is` — 엠대시 앞뒤에 공백이 없어 조각이 대시로 시작할 수 없음. en을 바꾸지 않는 한 그대로.

---

## 10. B에게 넘길 것(참고)
- 문장이 바뀌어 v46 필드를 새로 쓸 곳: 19.4(S1). KP를 바꾸면 16.1·16.2·20.2(·10.1·17.0).
- 문장 ko만 바뀌어 distractorsKo 둘을 다시 쓸 곳: 1.5·9.3·15.4·7.4·16.4(S3), 3.1·16.2·18.1·0.2(KO1~KO4).
- order(이 검토 범위 밖, 눈에 띈 것): 7 줄 4 `If the number still doesn't match, we'll search the field.`·16 줄 3 `If it's still gone after that, …` — 수색은 재계수와 함께 하는 일이라 조건으로 미루는 꼴(TASK 10번), 20 줄 4 `we'll be right back on schedule` — 시간 약속.

---

## 11. 종합

안전 문화의 바탕(누구든 멈춤 요청, CUS, 타임아웃, 함께 소리 내어 계수, 화재 삼각형, 비난 없는 보고)은 맞게 가르치고, swap·context 위치 분포도 고르다. 다만 **수술포 밑 표시를 보여 달라는 swap 1 정답, 보호자에게 "아무도 안 다쳤다"는 context 17, 처치 우선 단서 없는 19.4, pair 7의 정답 둘, 약함→강함이 깨진 slider 넷, 정답이 둘인 단어 오답 6개(could·matter·right after·flare·개별의·아무것도), 틀린 ko(sign off)**를 고쳐야 한다. ★와 [안전]·[범위]·[사실] 항목을 고친 뒤 다시 검사를 통과하면 내보내도 된다.

**개수:** 고칠 것 **51건** = 단어 25(W1~W25) · 뉘앙스 12(N1~N12) · context 7(C1~C7) · 문장 3(S1~S3 — S2는 4문장, S3는 5문장) · KP ko 4(KO1~KO4). 그중 **★ 16건**(W1~W7 · N1~N5 · N8 · C1 · C2 · S1). **안전·범위·사실 11건:** [안전] C2·S1 2 · [범위] C3 1 · [사실] W4·W11·W12·W13·W24·N7·N8·N9 8. (약)·(권장) 표시 17건(W17~W20·W22~W25·N9·N11·N12·C4~C7·KO3·KO4). 이와 별도로 KP 사용자 결정 7건(바꾸기 약하게 4: K1·K2·K3·K6 · 유지 3: K4·K5·K7), KP chunks 보고 13건, context 일반어 word 1건(권고 유지).
