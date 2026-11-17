# or-difficult-airway — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번)

대상: `or-difficult-airway.yaml`(A·B 합친 파일, pre-fix와 같음). 검사기 `verify_one_theme.py or` 통과(상황 21 · 단어 198).
기준: 미국 수술실에서 기도 계획·약물·시도 중단·FONA 결정은 마취과(또는 집도의)가 하고, 간호사는 장비 준비·건네기,
시도 횟수·포화도·시간 알리기, 도움 호출, 지시에 따른 BURP·윤상연골 압박 보조를 한다.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 대부분 철자·소리가 닮은 같은 품사. 정답으로도 맞는 오답 없음. 품사 어긋남은 아래 표, 꼭 바꿀 것은 없음 |
| 2 distractorsKo·길이 | 4 | 길이 위반 0(스크립트). 동의어 오답 없음. w-alert dKo가 w-record와 똑같은 묶음(일정표·처방전)인 것만 약함 |
| 3 cue | 4 | 정답을 드러내는 cue 없음. w-got cue가 사실과 다름(과거형), w-tracheal cue는 ko를 되풀이함 |
| 4 chips/decoyChips | 4 | 형태소 경계에서 잘 잘랐음. 비만 장면 옆 w-factor의 decoy `fat` 하나만 바꿈 |
| 5 뉘앙스 사실 | 3 | knife를 틀린 말로 가르침(수술실에서 흔한 말), 전산소화를 SpO2로 판단한다는 설명, "명령은 업무 범위 밖"은 과장 |
| 6 뉘앙스 설계 | 3 | slider 2개는 정답이 둘(S11·S20), swap 1개에 `?.`, swap 1개는 문법이 어긋남, context 고칠 문장의 시제가 맞지 않음 |
| 7 결정 11 | 4 | 변경 83건 대부분 타당. 남은 것: `away` 헤드워드, 억지 ko로 남긴 쉬운 말(have·begin), KP ko 번역투 |
| v46 7 context·swap ko | 4 | context 1개는 핸드오프 모양 맞음(word·ko·3장면·fix). swap ko 2개가 바꾼 문장 일부만 옮김 |

## 사실 오류·심각한 문제
1. **간호사 대사의 업무 범위(문장 en)** — 간호사가 결정·시행하는 말로 읽히는 문장이 keyPhrase 아닌 것만 7개 있다:
   S6.3(깨워서 다시), S7.3(국소 스프레이로 마취), S5.3(마스크 밀착 지시), S12.3(시도 중단·환기 지시), S15.4(FONA 프로토콜 개시),
   S18.4(실패 기도 계획 지휘), S19.4(곧장 cric). 같은 장면의 swap·slider가 "결정은 마취과"라고 가르쳐서 문장과 서로 맞지 않는다.
   keyPhrase에도 같은 문제가 있다 → 아래 "keyPhrase 결정 필요".
2. **S16 swap — `knife`를 틀린 말로 가르침.** 미국 수술실에서는 메스를 "knife"라고 흔히 부른다("Knife, please"). "일상어라 오해" 노트는 사실이 아니고,
   정답이 둘이다.
3. **S5 slider why — 전산소화가 됐는지를 산소포화도로 판단한다고 설명함.** 전산소화가 됐는지는 마취과가 호기말 산소 농도(EtO2 ≥ 약 90%)로 본다. 포화도는 전산소화 전에도
   거의 100%라 예비능을 보여 주지 못한다. 학습자가 "포화도 좋음 = 전산소화 끝"으로 믿을 수 있다(안전).
4. **S12 swap notes — "명령은 간호사의 업무 범위 밖이다".** 과장이다. 위험하면 간호사는 근거를 대며 더 강하게 다시 말하고(CUS·two-challenge) 윗선에 알려야 한다.
   지금 노트는 간호사가 말하기를 망설이게 만들 수 있다(안전).
5. **S11.2 `Repeated tries only cause trauma and edema.`** — "only"는 단정이다(저작자 메모와 같은 판단). 반복 시도가 외상·부종 위험을 키운다는 것까지만 사실이다.

## 고칠 것 (31건, 그중 안전 8건)
문장 en·ko를 바꾸면 그 문장의 v46 필드(`tag·icon·why·decoy·distractorsKo 둘·blank`)도 새 문장에 맞춰 다시 쓴다. 그 문장을 쓰는 `order` 줄도 함께 고친다.
아래 "order 같이" 참고. 고친 뒤 검사기로 V3(상황당 단어 8개 이상)·V5·V8·V9를 다시 확인한다.

### A. 문장 (keyPhrase 아님)
1. **[안전] S6 예측 어려운 기도 계획 · 3** `If we can't secure it safely, we wake him up and try later.` — 깨울지는 마취과가 결정하는데 간호사가 정하는 말로 읽힌다. → 계획을 복창해 확인하는 말로 바꾼다.
   en `So if we can't secure it safely, the plan is to wake him up and try later?` · ko `그러니까 안전하게 확보가 안 되면 깨워서 나중에 다시 시도하는 게 계획이죠?` ·
   chunks `So if we can't / secure it safely / , the plan is / to wake him up / and try later / ?` · words `w-secure w-safely w-plan w-wake w-try w-later`
2. **[안전] S7 각성 삽관 보조 · 3** `I'll numb the throat with local spray before we start.` — 국소마취는 마취과가 약을 골라 시행한다. 같은 상황의 swap 정답("Anesthesia will numb…")과도 어긋난다.
   en `Your anesthesia team will numb your throat with a local spray before we start.` · ko `시작하기 전에 마취 팀이 국소 스프레이로 목구멍을 마취해 드릴 거예요.` ·
   chunks `Your anesthesia team / will numb your throat / with a local spray / before we start / .` · words `w-anesthesia w-numb w-throat w-local w-spray w-start`
3. **S5 산소화 유지 보조 · 3** `Keep the mask sealed until he's fully asleep.` — 마스크를 쥔 마취과에게 간호사가 지시하는 말이다. → 보조하는 말로 바꾼다.
   en `I'll help keep the mask sealed until he's fully asleep.` · ko `완전히 잠들 때까지 마스크 밀착을 도울게요.` ·
   chunks `I'll help / keep the mask sealed / until he's / fully asleep / .` · words `w-help w-keep w-mask w-seal w-until w-fully w-asleep`
4. **[안전] S12 산소화 우선 원칙 · 3** `Stop trying to intubate and mask ventilate him now.` — 시도 중단을 간호사가 명령하는 말이다. → 수치를 대고 묻는다(같은 상황 swap 정답과 같은 방향).
   en `Sats are dropping — should we stop and mask ventilate him?` · ko `포화도가 떨어지고 있어요 — 멈추고 마스크로 환기할까요?` ·
   chunks `Sats are dropping / — should we stop / and mask ventilate him / ?` · words `w-sats w-stop w-mask w-ventilate` (w-intubate·w-try는 다른 문장에 남는다)
5. **[안전] S15 CICO 상황 · 4** `Let's start the front-of-neck access protocol now.` — FONA 개시는 마취과·집도의가 결정한다. → 간호사 몫(키트·프로토콜 따르기)으로 바꾼다.
   en `I'm opening the kit and following the front-of-neck access protocol.` · ko `키트를 열고 전경부 접근 프로토콜을 따르고 있어요.` ·
   chunks `I'm opening / the kit / and following / the front-of-neck access protocol / .` · words `w-open w-kit w-frontofneck w-access w-protocol`
6. **[안전] S18 예상외 어려운 기도 · 4** `Everyone move to the failed airway plan right now.` — 실패 기도 계획 전환을 간호사가 지휘하는 말이다. chunks `to the failed / airway plan`도 구를 끊는다. → 마취과의 결정을 팀에 전하는 말로 바꾼다.
   en `Heads up, everyone — anesthesia is moving to the failed airway plan.` · ko `모두 주목해 주세요 — 마취과가 실패 기도 계획으로 넘어가요.` ·
   chunks `Heads up / , everyone / — anesthesia is moving / to the failed airway plan / .` · words `w-everyone w-anesthesia w-move w-fail w-airway w-plan`
7. **[안전] S19 기도 완전 폐쇄 · 4** `Let's go straight to the cric kit and call for the surgeon.` — 곧장 cric으로 가자는 것은 결정이다. 호출과 키트 준비만 간호사 몫이다.
   en `I've got the cric kit open, and I'm calling for the surgeon.` · ko `윤상절개 키트를 열어 뒀고, 외과의를 부르고 있어요.` ·
   chunks `I've got / the cric kit open / , and I'm calling / for the surgeon / .` · words `w-got w-cric w-kit w-open w-call w-surgeon`
8. **S17 저산소 서맥 진행 · 4** `Let's prep for code and push oxygen now.` — "push oxygen"은 쓰지 않는 말이다(push는 약을 정주할 때 쓴다). "for code"에는 관사가 빠졌다.
   en `Let's prep for a code — I'll bring the crash cart.` · ko `코드에 대비해요 — 제가 크래시 카트를 가져올게요.` ·
   chunks `Let's prep / for a code / — I'll bring / the crash cart / .` · words `w-prep w-code w-bring`
9. **S11 재시도 최소화 전략 · 2** `Repeated tries only cause trauma and edema.` — 단정한다(위 5). en `Repeated tries can cause trauma and edema.` · ko `반복된 시도는 외상과 부종을 일으킬 수 있어요.` ·
   chunks `Repeated tries / can cause / trauma and edema / .` · words 그대로
10. **S1 Mallampati 평가 · 3** `I'm looking at how much of your tonsils and palate I can see.` — 같은 상황 slider cue는 "Anesthesia needs a good look"라고 하는데, 이 문장은 간호사가 평가하는 말이다. 주어를 팀으로 바꾼다.
    en `We're looking at how much of your tonsils and palate we can see.` · ko 그대로 · chunks `We're looking at / how much of your tonsils / and palate / we can see / .`
11. **S3 비디오후두경 준비 · 4** `Tell me which blade size you want next time.` — 준비 장면에서 "next time"은 다음 증례라는 뜻으로 읽혀 어색하다(낮음).
    en `Tell me if you want a different blade size next.` · ko `다음에 다른 블레이드 크기가 필요하면 말해 주세요.` · chunks `Tell me / if you want / a different blade size / next / .` · words `w-blade w-size w-next`

### B. chunks (keyPhrase 아님 — 구 경계를 끊음)
12. S18 · 3 `than we / expected` → `The view is / much worse / than we expected / .`
13. S11 · 3 `attempt number / two` → `Call it / out loud / — this is / attempt number two / .`
14. S20 · 4 `as a difficult / airway alert` → `Let's flag / this / as a difficult airway alert / for next time / .`
(S18 · 4는 1-6번에서 다시 쓴다.)

### C. 뉘앙스
15. **[안전] S5 slider why** — 위 3. → `전산소화가 됐는지는 마취과가 호기말 산소 농도로 판단해요. 간호사는 본 것—마스크가 밀착돼 있고 포화도가 유지되는지—를 그대로 알려요. '아마 산소를 줬다'는 확인이 아니고, 몇 분 줬다는 말도 효과를 알려 주지는 않아요.`
16. **[안전] S12 swap notes `you have to stop and bag him`** — 위 4. → `지시하는 말투다. 처치 결정은 마취과가 하니, 간호사는 수치를 대며 우려를 분명히 말하고 반응이 없으면 다시 강하게 말한다.`
17. **S12 swap 문장부호** — 정답이 `…can we oxygenate first?` + before[2] `.` → 이어 붙이면 `first?.`가 된다. → before[2]를 `""`로 하고 각 선택지에 제 부호를 붙인다(`…first?` / `you have to stop and bag him.` / `it's your call whether to keep trying.`). before[1]과 notes 키도 같이 바꾼다.
18. **S16 swap `here's the knife`** — 위 2. → 오답을 `here's the sharp one`으로 바꾸고 notes `'sharp one'은 무엇인지 분명하지 않다. 날붙이는 이름과 건넨다는 말을 함께 해야 찔리지 않는다.`로 바꾼다. before[1]도 같이 바꾼다.
19. **S11 slider 정답이 둘** — cue는 "두 번 실패, 몇 번 더 할지 정하는 중"인데, 오답 `We make one more attempt and stop`은 DAS의 최대 3회와 맞아서 맞는 답이 된다. → scale `["We keep trying until it works", "We try a few more times first", "We limit the number of attempts"]`, answerAt 2로 바꾸고 why의 오답 설명을 새 scale에 맞춘다.
20. **S20 slider 정답이 둘** — 위기 후 장면이라 `I'll flag it as a difficult airway alert`도 맞는 답이다(S20.1·S20.4 문장이 바로 그 일). → cue를 `Anesthesia says the video scope worked well and asks you to write that down; the airway alert is already in the chart.`로 바꿔 정답을 0 하나로 고정한다.
21. **S4 slider `Extra hands are at your side`** — cue가 "아직 아무 일 없음"이라 곁에서 대기하는 것도 standing by가 된다. → `Extra hands are already helping you`로 바꾼다(why "이미 곁에서 돕고 있다면"과 맞음).
22. **S7 slider cue `you stand at his head`** — 각성 삽관 때 머리 쪽은 마취과 자리다. → `you stand at his side`.
23. **S15 slider why 끝 `선언과 결정은 마취과가 해요.`** — 학습자가 고르는 말 자체가 선언이라 서로 맞지 않는다. → `보통 마취과가 이렇게 선언하고, 간호사는 같은 말로 복창하며 도움을 부르고 키트를 열어요.`
24. **S15 swap 오답 `could someone maybe come when free`** + `.` — 의문문인데 마침표로 끝나 문법이 어긋난다. → `someone can come by when they're free`(notes는 그대로 쓸 수 있음).
25. **S17 context 보호자 장면 fix 시제** — 장면 en은 과거(`went bradycardic … on induction`)인데 fix는 `we're treating it right now`이다. → `His heart rate got very slow when his oxygen dropped during anesthesia, and the team treated it right away.`
26. **S1 swap 화자** — 정답 `I'm checking how much of your throat I can see…`가 10번과 같은 문제다. → before[0]을 `We're checking `으로, 정답을 `how much of your throat we can see so we can plan your breathing tube`로 바꾼다(ko는 그대로).
27. **S2 swap ko** — 바꾼 문장의 앞부분만 옮겼다. → `카트가 채워져 있는 걸 확인했어요 — 침상 곁에 있어요`
28. **S4 swap ko** → `보조할 사람이 한 명 더 준비돼 있어요 — 말씀만 하세요`

### D. 단어
29. **w-got cue** `…알릴 때 쓰는 말의 과거형` — "I've got"은 현재에 가지고 있다는 뜻이다. → `이미 손에 넣어 갖춰 두었다고 알릴 때 I've 뒤에 붙여 쓰는 말`
30. **w-factor decoyChips `fat`** — 비만 위험 인자 장면 바로 옆이라 체형을 비하하는 말로 읽힌다. → `fec`
31. **w-tracheal cue** `…기관에 관한` — ko(기관의)를 되풀이한다. → `목 앞쪽 공기 통로에 관한 말 — 부지가 지나갈 때 연골 고리가 걸리는 곳`

### order 같이 (B 검토와 맞출 것 — 위 문장과 같은 문제가 줄에 있음)
S5 줄4(keep the mask sealed), S6 줄3(wake him up), S7 줄1(I'll numb), S8 줄1(Hand me the LMA), S11 줄1(only cause), S12 줄2(stop trying…now),
S15 줄2·4(we move / let's start the protocol), S16 줄2·3(stabilize the larynx), S17 줄3·4(push the airway rescue / push oxygen),
S18 줄3(we switch to the failed airway algorithm), S19 줄2(we go straight), S3 줄4(next time).

## 결정 11 (따로)
- **w-away 헤드워드** — `away`의 ko가 `곧바로`인데 away에는 그 뜻이 없다(right away 전체의 뜻이다). → en `right away`, chips `[[right],[away]]`,
  ipa `/ˌraɪt əˈweɪ/`, dEn `right after`·`later on`, cue의 "부사" 설명을 구로 고친다. id는 그대로 둔다.
- **w-have 제거** — 쉬운 말인데 정답이 둘 되는 것을 피하려고 ko를 `보유하다`로 억지로 붙였다. S5.4 words에서 빼고 은행에서도 지운다(S5 단어는 여전히 8개를 넘는다).
- **w-begin 제거** — 쉬운 말에 억지 ko(`착수하다`)를 붙였고 cue가 start를 말한다. S13.4 words에서 빼고 은행에서도 지운다.
- **keyPhrase ko 번역투**(ko만 고치는 것은 허용 범위. distractorsKo 둘도 새 ko에 맞춰 다시 쓴다):
  - S1.2 `이건 당신의 기도를 안전하게 계획하는 데 도움이 됩니다.` → `기도를 안전하게 관리할 계획을 세우는 데 도움이 돼요.`
  - S10.0 `짧은 목과 비만이 우리의 어려움을 늘려요.` → `짧은 목과 비만 때문에 더 어려워져요.`
  - S10.1 `시야를 개선하려고 램핑 자세로 위치시켜요.` → `시야가 좋아지도록 램핑 자세를 잡아요.`
- (선택) 아래는 있어도 크게 문제없다:
  - w-great·w-ask·w-again은 쉬운 말이다. w-great의 ko `잘하는`은 "doing great"의 뜻과 어긋난다.
  - w-sure → `make sure`로 바꾸는 것(ko `확실히`는 부사인데 문장에서는 형용사로 쓰였다).
  - w-number ko `수`는 너무 막연하다.
  - w-alert dKo가 w-record와 같은 묶음이다.
  - ko의 `그의`·`당신`(S5.1·S20.2·S20.3·S3.2·S4.3·S13.0)은 번역투다.
- 저작자 변경 83건: 타당하다. 과하거나 틀린 것은 없다.

## keyPhrase 결정 필요 (en — 고치지 않고 사용자 결정)
| 상황·번호 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| S6.0 | Let's define plan A, B, and C before induction. | 간호사가 안을 정하는 말로 읽힘. chunks `plan / A, B, and C`가 구를 끊음 | Let's go over plan A, B, and C before induction. (slider 예문과 같음. w-define은 은행에서 빠짐) | 바꿈 |
| S12.0 | Oxygenation comes before intubation — let's bag him. | 처치를 간호사가 지시하는 말이고, 같은 상황 swap의 "지시 말투 ✕"와 어긋남 | Oxygenation comes before intubation — can we bag him? | 바꿈(약) |
| S18.1 | Let's switch to the failed airway algorithm now. | 실패 기도 전환은 마취과가 결정함 | Should we switch to the failed airway algorithm now? | 바꿈 |
| S15.1 | We move to emergency front-of-neck access now. | FONA 결정 | Understood — we're moving to emergency front-of-neck access now. (복창) | 바꿈 |
| S19.1 | We go straight to front-of-neck access. | FONA 결정 | Understood — we're going straight to front-of-neck access. | 바꿈 |
| S16.1 | I'll stabilize the larynx for you. | 후두를 잡는 것(laryngeal handshake)은 시술자의 손 동작임 | I'll stabilize his head and neck for you. (w-larynx는 은행에서 빠짐) | 바꿈 |
| S17.2 | Push the airway rescue and prep for code. | 영어가 부자연스럽고 지시하는 말이며 관사가 빠짐 | I'm prepping for a code — the crash cart is coming. | 바꿈 |
| S8.0 | Hand me the LMA — we're rescuing the airway. | 화자가 뒤바뀜(LMA를 건네는 쪽이 간호사) | Here's the LMA — we're rescuing the airway. | 바꿈 |
| S5.0 | I'm holding the mask seal for pre-oxygenation. | 마스크는 보통 마취과가 잡음 | I'm helping hold the mask seal for pre-oxygenation. | 유지(두 손 밀착 보조는 흔함. why에 "마취과 지시로" 추가) |
| S7.0 | I'll help keep the airway topicalized. | help라서 보조로 읽힘 | — | 유지 |
| S15.0 | This is a can't-intubate-can't-oxygenate situation. | 선언에 가까움 | Is this a can't-intubate-can't-oxygenate situation? | 유지(상황을 알아차려 말하는 것. 누구든 CICO를 말할 수 있음) |
| S13.0 | You take cricoid pressure, I'll manage the cart. | 윤상연골 압박은 근거가 엇갈리고 마취과 요청으로만 함 | — | 유지(간호사끼리 나누는 말. why에 "요청 시") |
| S11.0 | We limit ourselves to a set number of attempts. | 횟수는 마취과·병원이 정함 | — | 유지(팀 원칙을 말하는 것) |
| S17.1 | We need to oxygenate immediately or he'll arrest. | "he'll"은 단정 | …or he could arrest. | 유지(위기에서 말하는 것이 정당함) |
| S9.0 | Here's the bougie — railroad the tube over it. | 시술자에게 방법을 지시하는 듯함 | — | 유지(약) |
| S9.2 | Tell me if you feel the tracheal clicks. | 클릭은 시술자가 느낌 | — | 유지(협업 질문으로 자연스러움) |
| S5.2 | Saturation is good before we proceed. | 조금 어색함 | Saturation is good — we're ready to proceed. | 유지 |

**keyPhrase chunks가 구를 끊는 곳(보고만):** S6.0 `plan / A, B, and C` · S5.2 `before we / proceed` · S17.1 `immediately or / he'll arrest` ·
S20.1 `as a difficult / airway alert` · S2.0 `I'm / bringing` · S4.2 `Extra hands / are / standing by` · S8.0 `— we're / rescuing the airway` · (약) S1.0 `as wide as / you can`.

## 기계적 전수 확인 결과
- **pair:** 0개(해당 없음). **reel:** 0개.
- **swap 20개 이어 붙이기:** 문법 문제는 S12(`?.`)·S15(마침표로 끝난 의문문)뿐이다. 같은 주제 다른 문항과의 모순은 S1(간호사가 평가), S7(문장 3과 반대), S12(문장 0·3과 반대)이고,
  문장 쪽을 고치면 풀린다.
- **slider 21개:** 약함→강함 순서는 모두 말이 된다. 정답이 둘인 것은 S11·S20, 약하게 둘인 것은 S4.
- **context 1개(S17 bradycardic):** word가 세 장면 en에 모두 있다. 어색한 장면은 듣는 사람(보호자) 때문이다. ko `서맥의`는 정확하다. fix 시제만 고친다(25번).
- **decoyChips 전수(비속어·불쾌·술·장례·성적·무기·민족 비하):** `fat`(w-factor) 하나만 바꾼다. `bar`·`gut`·`bush`·`gone`·`hole`·`lie`·`void`는 일반적인 말이라 그대로 둔다.
  (선택) w-great의 distractorsEn `grave`는 무덤을 떠올리게 하니 `green`으로 바꿔도 된다.
- **distractorsEn 품사가 다른 것:**

| 단어 | 정답(품사) | 오답 | 판정 |
|---|---|---|---|
| w-until | until(접속사·전치사) | unlike(전치사·형용사) | 약간 다름, 유지 |
| w-score | score(명사) | scare(주로 동사) | 명사도 있음, 유지 |
| w-position | position(동사) | petition(주로 명사) | 동사도 있음, 유지 |
| w-mean | mean(동사) | mask(주로 명사) | 동사도 있음, 유지 |
| w-extra | extra(형용사) | expert(명사·형용사) | 유지 |
| w-wide | wide(부사, as wide as) | wise·wild(형용사) | 유지 |
| w-got | got(과거분사) | gave(과거형) | 회상용이라 유지 |
| w-sure | sure(형용사, make sure. ko는 부사 '확실히') | pure·sore(형용사) | 결정 11의 make sure 안과 함께 |
| w-surgeon | surgeon(사람 명사) | surgery·suggestion(사물 명사) | 유지 |

  ★(꼭 바꿀 것): 없음.

## 종합
- 고칠 것 31건(그중 안전 8건)과 keyPhrase 결정을 반영하면 내보내도 된다.
- 핵심은 간호사 대사의 업무 범위다. 문장 7개(+order 줄)를 지금 쓰면, 학습자는 간호사가 FONA·시도 중단·국소마취를 결정하거나 시행한다고 배운다.
