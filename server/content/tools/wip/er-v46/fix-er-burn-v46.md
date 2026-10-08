# er-burn — v46 보강 검토 (er)

대상: `er-burn.yaml` (상황 21 · 문장 105 · order 21장 · 뉘앙스 context 7 · swap 14). 문장 105개와 order 21장을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 화상 초기 사정 … S20 = 화상 SBAR 인계). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 420줄, decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립(약 900줄),
order 인접 교환 63가지(21장 × 3)와 줄 단어 수, context 7건(세 장면 `en`에 `word`가 있는지, base와 바뀐 `en`·`fix`·`why`), swap 14건(선택지를 넣은
문장과 `ko` 대조), decoy·빈칸 오답·`distractorsKo`의 주제 안 중복, base와 v44 필드 비교(**단어·문장 바뀐 것 없음, 뉘앙스는 context 7건의 장면·word·ko와 swap ko만**).
아래에서 빈칸을 옮기자고 한 것은 새 answer가 `en`에 낱말 경계로 **정확히 한 번** 나오는지 스크립트로 확인했고, 새 선택지 넷을 문장에 넣어 다시 읽었다.
`verify_one_theme.py er …/er-burn.yaml` → `==> 통과`(W13 경고 3: farther·lunge·cloths — v45 단어 오답, v46 범위 밖).

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 이 기준으로 빈칸 정답이 둘인 문장은 **없다**.
문제는 반대쪽이다 — 오답 대부분이 `ko`를 볼 필요도 없이 **문법·연어·상식으로 걸러진다**.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식의 이유를 먼저 짚는다. 저작자가 꼽은 다섯 가지(Parkland·9의 법칙·CO SpO2·화학 화상 중화 금지·횡문근융해 칼륨)는 모두 맞다(아래). 틀리거나 과장된 것: 16.4(혈압·맥박이 안정이면 수액이 충분 — 화상 소생의 기준은 소변량), 18.1·9.2(가피절개를 "작은 절개"라 함), 8.0(전기 화상 "대개" 모니터), 11.0(자기모순). |
| 2 | 빈칸 | 2 | `ko`로 정답이 둘인 것은 0. 그러나 **오답이 문법·연어·상식으로 걸러지는 문장 약 38개**(저작자 보고 1의 `nothing/everything else home`, `How tall`, `questions to medicine`, `will … yesterday`, `kidney rhythm`, `Teach me if` 등). 장면과 동떨어진 말(`painting`, `cooks`, `accountant`, `lunch`)도 많다. 돌려쓰기: `hide` 5문장, `wash`·`itchy`·`warm` 각 4, `height`·`dry`·`cooling`·`cool` 각 3, 시간 묶음(`tomorrow/next week/yesterday`) 2문장. |
| 3 | `decoy` | 4 | 대신 넣어 `ko`에 맞는 문장이 되는 것 1개(4.1 `Did you stay in`). 끼워 넣으면 뜻이 그대로인 것 2개(9.3 `right now`, 11.3 `just in case`). 경계선 5개(6.1 `right now`, 7.0 `from the label`, 7.3 `with scissors`, 7.4 `if possible`, 10.1 `by hand`). 동떨어진 것 2개(12.4 `in cooking`, 16.0 `pills daily`). 중복: `last night` 3, `right now`·`every day`·`if you ask` 각 2(사소). |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 간호사가 실제로 할 말이다(S8·S13·S15·S20은 아주 좋다). 고칠 것 7: 할 법하지 않은 말 3(7.1·7.4·19.4), 반만 다른 말 2(3.1·9.2), 사실이 틀린 말 1(9.0 "번질 수 있어요"), 글자까지 같은 중복 1(0.0·4.0). "높이 올려 둘게요"가 5문장에 돌려쓰였다(0.2·9.1·9.2·9.3·12.0, 사소). |
| 5 | `order` | 3 | 조건절로 시작하는 줄 0, `And/Also/Then` 0, 15단어 초과 0. 인접 교환이 열린 카드 4장(S0 2↔3, S5 1↔2, S16 3↔4, S19 3↔4). 영어가 어색하거나 논리가 꼬인 줄 5(S1 L2, S6 L3, S7 L3, S10 L3, S18 L2). 전제가 걸린 줄 1(S8 L2 `Those wounds look small`). 임상 순서 2(S0 덮은 것 제거가 범위 사정 뒤, S19 L3 시간 묶음). |
| 6 | `tag`·`icon` | 4 | 태그는 한국어·10자 이하·상황 안에서 일관된다. order 태그·아이콘은 21장 모두 `대화 흐름`·`compass`. 사소: 10.2 `전 아동 확인`(전=前으로 읽힘 → `모든 아이 확인`), 17.1 `me`(산소 투여), 3.0 `bandage`(헹굼). |
| 7 | context `word`·`ko`, swap `ko` | 2 | 7건 중 OK 2(enclosed, deep), 고칠 것 5. 그중 3건(percent·cold·chest)은 **`word`가 어색함의 원인이 아니다** — 어색한 것은 `TBSA`·`hypothermia`·`circumferential eschar`인데 그 옆의 쉬운 말을 `word`로 골랐다. 2건(percent·cold)은 W14를 맞추려고 낱말을 끼워 넣었다(TASK 9번 금지). thin은 why가 사라진 `fragile`을 아직 말한다. swap `ko` 14건은 모두 바꾼 문장의 뜻이고, S5만 "그의"가 번역투. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어지거나 문법으로 걸러지는 빈칸 오답 약 38문장 — 가장 큰 문제. 관사는 지켰다(`an interpreter`, `a full-thickness`). (3) order 못 박기: 열린 교환 4장. (4) 임상 순서·사실: 가피절개 크기, 화상 소생 지표, S0 순서. (5) decoy·오답 뜻 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **18.1 빈칸이 "가피절개는 작다"를 정답으로 가르친다** — `We may make [small/huge/giant/wide] cuts in the burned skin to let it expand.` 흉부 가피절개는
   양쪽 앞겨드랑선을 따라 가피 **전체 길이**로, 가피만 갈라질 만큼 **얕게** 내는 긴 절개다(필요하면 늑골 아래 가로 절개를 더해 방패 모양). `wide`·`huge`를
   오답으로 두면 "길게 내는 것이 틀렸다"고 배운다. why "조여든 가피에 작은 절개를 내면"과 9.2 why "의사가 작은 절개로 압력을 풀어요"도 같다.
   환자에게 하는 말로 `small cut`은 base 문장이라 v46에서 고치지 않지만(결정 11, 아래), **빈칸과 why는 고친다**.
2. **16.4 why — 혈압·맥박이 안정이면 수액이 충분하다** — 화상 소생에서 혈압·심박수는 믿을 만한 지표가 아니다(통증·카테콜아민으로 빈맥이 이어지고, 혈압은
   늦게 떨어진다). ABA/ABLS의 기준은 **시간당 소변량**(성인 0.5 mL/kg/h 안팎)이다. 같은 주제 16.1·20.1 why도 소변량을 기준으로 말한다.
3. **context S3 `cold`** — XX를 `You're getting cold, which means you're developing hypothermia.`로 바꿨다. (a) 추위·떨림은 저체온과 같지 않다(임상적으로 틀린 말을
   환자 장면에 넣었다), (b) 어색한 낱말은 `hypothermia`인데 `word`는 장면 셋 모두에서 바르게 쓰인 `cold`라 메모 "뜻은 셋 다 '추운' — 듣는 사람이 달라요"가 성립하지
   않는다, (c) `fix`에도 `cold`가 그대로 있다. W14를 맞추려고 끼워 넣은 경우다.
4. **context S1 `percent`** — 차트 장면을 `Est. TBSA 27%`에서 `27 percent`로 바꿨다. 차트는 `%`로 적지 `percent`로 풀어 쓰지 않는다 — 낱말을 맞추려고 차트 말을 바꿨다.
   어색한 것은 `TBSA`이고(why도 TBSA를 설명), fix에는 `percent`가 아예 없다.
5. **context S11 `thin`** — XX의 `fragile`을 `too thin`으로 바꿨는데 why는 여전히 "'elderly'·'fragile'을 환자 본인에게 붙이면…"이다(TASK 9번 "장면을 바꿨으면 why 다시 읽기").
   또 why가 "미국 의학 글쓰기에서도 'older adults'를 권해요"라고 하는데 ok 장면인 차트가 `Elderly pt`로 시작해, 학습자가 차트 장면을 어색하다고 고를 수 있다(정답 둘).
6. **4.1 decoy `Did you stay in`이 `ko`에 맞는 문장을 만든다** — 청크 `Were you in` 자리에 넣으면 `Did you stay in an enclosed, smoky space?`. `ko` "밀폐되고 연기 찬 공간에 **있었나요**?"가 그대로 받는다.

## 저작자 자기 보고 판정

### 1. "어색하지만 확실히 틀린" 빈칸 선택지

**판정: 받아들이지 않는다.** 브리프 파일럿 갈래 2가 "관사·문법으로 걸러지는 오답도 바꾸라"고 한 것이 바로 이것이다. `Was nothing else home`은 `else`가 사람·사물을
가리지 않아 문법적으로 성립하지만 `home`과 맞지 않아 읽기만 해도 걸러지고, `How tall was your skin`은 영어가 되지 않는다. 같은 분야에서 틀린 말을 찾기 어려운 것은
**빈칸 자리가 기능어(`anyone`, `long`, `Tell`, `heart` in `heart rhythm`)라서**다. 이런 자리는 선택지를 바꾸지 말고 **빈칸을 가르치는 말로 옮긴다**.
옮길 자리와 선택지는 아래 "고칠 것 — 빈칸"에 문장마다 적었다. 대표 셋:

| 문장 | 지금 | 고칠 안 | 걸러 주는 것 |
|---|---|---|---|
| 10.3 | `Was [anyone/everything/something/nothing] else home…` | answer `home`, 선택지 `home / hurt / awake / burned` — `Was anyone else hurt/awake/burned when this happened?`는 모두 학대 감별 장면에서 실제로 묻는 말 | `ko` "집에 … 있었나요" |
| 13.2 | `How [long/far/tall/wide] was your skin…` | answer `skin`, 선택지 `skin / eye / clothing / hair` — 화학·열 접촉 부위로 모두 같은 분야 | `ko` "피부가" |
| 13.3 | `any [allergies/questions/insurance/plans] to medicine` (셋 다 `to`와 안 맞음) | answer `medicine`, 선택지 `medicine / food / latex / tape` — 모두 응급실이 묻는 알레르기 | `ko` "약에" |

`there`·`nobody`처럼 `ko`가 받아 줄 수 있는 말(10.3 `Was anyone else there` ≈ 집에 있었나요, `Was nobody else home`)은 넣지 않았다.

### 2. context 정비 7건

| 상황 | word | 판정 | 고칠 안 |
|---|---|---|---|
| S1 | `percent` / 퍼센트 | **고칠 것(심각 4)** | `word: TBSA`, `ko: 화상 체표면적(TBSA)`. 장면 0은 base로 되돌림(`Est. TBSA 27%, partial thickness, rule of nines.`). 세 장면 모두 `TBSA`가 이미 있고, 의료진끼리는 맞고 환자에게만 못 알아듣는 말이라 핸드오프 `deteriorate`와 같은 모양. fix·why 그대로. |
| S3 | `cold` / 추운 | **고칠 것(심각 3)** | `word: hypothermia`, `ko: 저체온`. 장면 0: `Pt shivering, reports feeling cold. Cooling stopped for hypothermia risk; warm blankets applied.` 장면 1: `She's cold and shivery — let's stop the water before hypothermia sets in.` XX: base로 되돌림(`You're developing hypothermia.`). fix: base로 되돌림(`You're getting cold, so I'm going to stop the water and warm you up.`). why 그대로(이미 hypothermia를 설명). |
| S4 | `enclosed` / 밀폐된 | OK | 장면 셋에 모두 있고, XX `enclosed-space smoke exposure`는 의료진 기록어를 환자에게 그대로 쓴 곳. fix `closed room`이 그 말을 풀었다. |
| S8 | `deep` / 깊은 | OK(경계) | `deep tissue injury`가 의료진 말, fix가 `deeper inside`로 푼다. 어색함의 중심은 `occult necrosis`지만 why가 둘을 함께 설명해 메모가 거짓이 되지는 않는다. |
| S11 | `thin` / 얇은 | **고칠 것(심각 5)** | 장면 0: `Older adult, thin skin; burn depth may be underestimated.`(why의 older adults와 맞춤). XX는 지금대로(`Because you're elderly, your skin is too thin and burns go deeper.`). fix: `Skin gets thinner as we all get older, so a burn can be deeper than it looks — we'll check it closely.`(지금 fix는 base가 주던 이유 "겉보다 깊을 수 있다"를 뺐다). why: "'elderly'로 부르고 피부가 'too thin'이라고 하면 환자 본인에게는 늙고 약하다는 딱지처럼 들려요. 미국 의학 글쓰기도 'older adults'를 권해요. 나이 드는 일을 '우리'의 일로 말하고 이유는 사실대로 전해요." 장면 1 `thinner`는 W14 어간 비교로 잡힌다(검사 경고 0). |
| S16 | `urine` / 소변 | 고칠 것(경미) | `UOP`를 풀면서 XX `Your urine output is 20 mL per hour, below goal.`은 환자도 대강 알아듣는 말이 되어 어색함이 약해졌다(묶음 C shock #7과 같은 판정). XX: `Your urine output is only 20 mL an hour, under 0.5 per kilo.` why: "mL·per kilo 같은 수치와 기준은 의료진끼리의 말이에요. 환자에게는 소변이 기대만큼 나오지 않는다는 사실과 다음 조치를 쉬운 말로 전해요." 장면 1 `Urine's only 20 this hour`는 자연스럽다. |
| S18 | `chest` / 가슴 | **고칠 것** | 어색한 것은 `circumferential eschar`·`chest wall excursion`인데 `word`는 fix에도 그대로 있는 `chest`다. `word: circumferential`, `ko: 둘레를 감싼(원주형)`. 장면 0 `Circumferential chest eschar…`, 장면 1 `…is circumferential…`, XX `Your circumferential eschar…` — 세 장면 모두 이미 있고 fix에는 없다. 장면·fix·why 그대로. |

영어 자연스러움: 바뀐 장면 중 S3 XX(`which means`로 이은 틀린 인과)와 S1 장면 0(차트의 `percent`)만 부자연스럽다. 나머지는 자연스럽다.

### 3. `why` 임상 사실

| 주제 | 문장 | 판정 |
|---|---|---|
| Parkland | 1.4, 6.3, 20.1 why, 20번 context why | **맞다.** 체중과 화상 면적으로 첫 24시간 양을 잡고(4 mL × kg × %TBSA, 절반을 첫 8시간) 소변량으로 속도를 조절한다. 숫자를 쓰지 않아 틀릴 곳이 없다. |
| 성인 9의 법칙 | 1.1, 1.3 why, 1.1·1.3 distractorsKo, S1 context why | **맞다.** 팔 하나 9%, 다리 하나 18%, 몸통 앞·뒤 각 18%, 머리 9%(=팔과 같음, 1.3 오답 뜻도 맞다), 손바닥(손가락 포함) 약 1%. "성인은"이라고 한정한 것도 좋다(소아는 머리가 더 크다). |
| CO의 SpO2 오독 | 17.0, 17.4, 17.1 why, S17 swap | **맞다.** 일반 2파장 맥박산소측정기는 COHb를 O2Hb로 읽어 SpO2가 정상·높게 나온다. 확인은 CO-oximetry의 COHb, 고농도 산소는 결과 전에 먼저 — 모두 맞다. |
| 화학 화상 중화 금지 | 7.1 why, S7 swap notes | **맞다.** 중화 반응이 열을 내고 세척을 늦춘다. 7.4 "알칼리는 더 오래" 도 맞다. 마른 가루를 먼저 털어낸다(7.1 오답 뜻)도 맞는 처치다. |
| 횡문근융해의 칼륨 | 19.2 why | **맞다.** 근육 세포가 깨지면 칼륨이 혈액으로 나와 부정맥을 일으킬 수 있다. 19.0(미오글로빈 콜라색 소변), 19.1(소변을 충분히 내보내 세관을 막지 않게)도 맞다. |

이 밖에 틀리거나 고칠 why: 16.4·18.1·9.2(위 심각 1·2), 8.0, 11.0, 11.2, 8.3(아래).

## 고칠 것 — `why`

1. **16.4** · 혈압·맥박을 수액 충분의 기준처럼 말함 · "We want…to로 목표를 함께 정한 것처럼 말해 환자가 협력자가 돼요. 혈압과 맥박도 보지만, 화상 수액이 충분한지는 주로 시간당 소변량으로 판단해요."
2. **18.1** · "작은 절개" · "We may…로 확정이 아닌 가능성으로 말해요. 가피절개는 조인 가피를 따라 길고 얕게 갈라서 가슴이 다시 부풀 수 있게 해요."
3. **9.2** · "작은 절개로" · "may need로 아직 결정이 아니라 가능성이라고 알려 줘요. 가피가 붓는 조직을 조이면 의사가 가피를 따라 갈라 압력을 풀어요(가피절개)."
4. **8.0** · "전기 화상 환자는 대개 심전도 모니터를 붙여요"는 과장 · "…전류가 심장을 지나면 부정맥이 생길 수 있어서 전기 손상 환자는 심전도를 찍고, 고전압·의식 소실·심전도 이상이 있으면 계속 모니터해요."
5. **11.0** · "나이 탓이 아니라 피부의 특성"은 자기모순(얇아지는 것이 나이 때문) · "so로 이유를 먼저 대고 결과를 말해 겁주지 않고 설명해요. 나이가 들면 진피가 얇아져서 같은 열에도 더 깊이 손상될 수 있어요."
6. **11.2** · "당뇨약 같은 복용약은 … 수액 계획에 영향" — 근거가 약함 · "…혈액 희석제는 출혈과 수술 계획에, 당뇨약은 혈당 관리에 영향을 줘요."
7. **8.3** · "환자가 기다리지 않아요"는 말이 어색함 · "now로 바로 시작한다고 알려 무엇이 붙는지 미리 알게 해요. …"(뒤 문장은 그대로).
8. **18.4** · 뜻은 맞음, 1과 맞추려면 "가슴 둘레의 가피를 길게 절개해"로(선택).

## 고칠 것 — 빈칸 (문법·연어·상식으로 걸러지거나 동떨어진 오답, 돌려쓰기)

빈칸을 옮기는 것은 ★. 모두 새 answer가 `en`에 정확히 한 번 나오는지 확인했다.

1. ★ **10.3** · `nothing/everything/something else home` 문법·의미로 걸러짐(저작자 보고) · answer `home`, `home / hurt / awake / burned`.
2. ★ **13.2** · `How tall/far/wide was your skin` 영어가 안 됨(저작자 보고) · answer `skin`, `skin / eye / clothing / hair`.
3. ★ **13.3** · `questions/insurance/plans to medicine` 셋 다 `to`와 안 맞음 · answer `medicine`, `medicine / food / latex / tape`.
4. ★ **19.2** · `liver/lung/kidney rhythm` 연어로 걸러짐 · answer `potassium`, `potassium / sodium / sugar / calcium`.
5. ★ **8.3** · `will … yesterday/last week` 문법, 시간 묶음 돌려쓰기 · answer `monitor`, `monitor / pump / medicine / drip`(`a heart pump/medicine/drip`).
6. ★ **8.2** · 빈칸이 기능어 `Tell`, `Teach me if` 문법 · answer `dizzy`, `dizzy / hungry / sleepy / chilly`.
7. ★ **5.4** · `after lunch/tomorrow/next week` 시간 묶음(8.3과 돌려씀) · answer `harder`, `harder / easier / deeper / calmer`.
8. ★ **2.3** · `rarely/never/hardly` 부사 묶음 · answer `serious`, `serious / mild / minor / harmless`.
9. ★ **1.3** · `separate … than` 문법, `softer` 동떨어짐 · answer `legs`, `legs / hands / face / feet`(손·얼굴·발은 팔보다 넓지 않음).
10. ★ **7.2** · `adds/spreads/hides … from your skin` `from`과 안 맞음 · answer `chemical`, `chemical / soot / oil / blood`.
11. ★ **10.1** · `cooling/wrapping the shape and edges` 목적어와 안 맞음 · answer `edges`, `edges / color / smell / size`.
12. ★ **15.3** · `taste/touch/smell a change in how you sound` 감각 동사가 `sound`로 걸러짐(17.4와 돌려씀) · answer `breathe`, `breathe / talk / cough / swallow`(`ko` "숨쉴 때"가 걸러 줌).
13. ★ **17.4** · `smell/sound/taste fine` `number`와 안 맞음 · answer `oxygen`, `oxygen / sugar / potassium / blood pressure`.
14. ★ **18.1** · 사실 문제(심각 1), `huge/giant` 겹침 · answer `expand`, `expand / shrink / harden / close`.
15. **0.2** · `painting/bleeding the burned skin` · `covering / cooling / soothing / protecting`.
16. **1.0** · `water/blood is burned` 동떨어짐 · `skin / muscle / hair / fat`.
17. **1.4** · `this bed/name/room to plan your fluids` · `number / bag / pump / line`.
18. **4.2** · `map/clock/list` 동떨어짐 · `scale / chart / form / test`(약함 — 고정 표현이라 대안이 적다. 옮기려면 `ten`은 `ko`에 숫자가 있어 안 됨, 그대로 두는 것도 가능).
19. **4.3** · `cream/medicine/bandage`(불·물과 나란히 놓인 원인으로 동떨어짐) · `chemical / wire / spark / heater`.
20. **5.0** · `hands and throat` · `mouth / nose / ears / eyes`.
21. **5.3** · `pollen/paint/chalk` · `soot / blood / vomit / mucus`.
22. **6.2** · `greasy/sticky`, `itchy` 4문장 돌려쓰기 · `thirsty / hungry / dizzy / hot`.
23. **6.4** · `expiring/freezing/spilling`(16.1과 돌려씀) · `working / leaking / failing / pooling`.
24. **16.1** · `melting/spilling/freezing` · `working / leaking / dripping / stopping`.
25. **7.0** · `price/age/address` · `name / smell / color / strength`.
26. **8.0** · `knee/wrist/tooth … monitoring it` · `heart / liver / stomach / bladder`.
27. **9.1** · `height/age/weight … in your fingers` · `pulse / color / swelling / temperature`(장면에서 보는 것이지만 `ko` "맥박"이 걸러 줌).
28. **10.2** · `toys/shoes/lunch` · `injury / vaccines / weight / diet`.
29. **11.4** · `sell/wash/borrow` · `take / keep / buy / skip`.
30. **12.3** · `hide/paint` · `move / count / touch / wash`.
31. **12.4** · `visitors/cooks` · `specialists / volunteers / interpreters / students`.
32. **13.0** · `accountant/electrician/engineer` · `interpreter / aide / educator / officer`.
33. **13.4** · `hide/ignore/delete` · `repeat / summarize / shorten / write` — `summarize`는 why("줄이거나 바꾸지 않고")가 가르치는 바로 그 틀린 말이라 좋다.
34. **15.2** · `angry/busy/loud` · `calm / flat / awake / busy`(`stay flat`은 기도 부종에서 틀린 자세).
35. **16.2** · `vision/hearing/height` · `pressure / temperature / oxygen / weight`.
36. **16.4** · `loud/dark/empty` · `stable / low / high / fast`.
37. **20.1** · `painful/bloody`는 `output`과 안 맞음 · `adequate / low / absent / excessive`.
38. **20.3** · `double/hidden thickness`는 없는 말 · `partial / full / split / total`.

경미(그대로 두어도 됨): 3.4 `warm/heal/calm`, 4.4 `clean/cool`, 9.2 `hide`(→ `measure`), 9.3 `warm`, 12.1 `worst/cheapest`, 14.3 `forget/ignore/avoid`(→ `treat / cool / cover / clean`),
17.2 `nap/meal/trip`(→ `fire / fall / seizure / meal`), 19.0 `Cold urine`, 19.1 `warm/cool/feed`, 19.3 `hairs/teeth/nails`(→ `muscles / bones / nerves / vessels`).
잘 된 것: 2.1 `numb/dry/dark`, 2.4 `chemical/full-thickness/deep`, 3.0 `hot/soapy/icy`, 3.1 `add/need/prefer`, 7.1 `soap/alcohol/vinegar`, 14.1 `freeze/shave/peel`, 15.1, 20.0 `BMI/BUN/INR`, 20.2.

## 고칠 것 — `decoy`

1. **4.1** · `Did you stay in`이 `Were you in` 자리에서 `ko`에 맞음(심각 6) · `Were you near`로(`Were you near an enclosed, smoky space?` — "있었나요"와 다름).
2. **9.3** · `right now`를 끝에 붙이면 뜻이 그대로 · `to the doctor`(청크 `cool to me`를 대신해도, 사이에 끼워도 `ko` "제가 만져보니 차가워요"와 어긋남).
3. **11.3** · `just in case`를 끝에 붙이면 "놓치는 게 없도록"과 겹침 · `only today`.
4. **7.4** · `if possible`을 붙이면 "적어도"를 약하게 만들어 임상적으로도 틀린 말(경계) · `until it stings`.
5. **12.4** · `in cooking` 동떨어짐 · `in eye and ear`.
6. **16.0** · `pills daily` 동떨어짐 · `fluids slowly`(`so we're giving fluids slowly` — `ko` "빠르게"와 반대).
7. 경계(보고만): 6.1 `right now`, 7.0 `from the label`, 7.3 `with scissors`(실제로 옷을 잘라 벗기므로 장면상 맞는 말), 10.1 `by hand` — 끼워 넣으면 `ko`에 없는 말을 덧붙이지만 어긋나지는 않는다. 7.3은 `in a bag`으로 바꾸기를 권한다.

## 고칠 것 — `distractorsKo`

1. **7.4** · "물이 닿지 않게 비닐로 덮어 드릴게요" — 세척 중에 할 리 없는 말 · "헹군 물이 눈에 튀지 않게 할게요".
2. **7.1** · "물이 닿는 부위를 잘 봐 주세요" — 누가 누구에게 하는 말인지 불분명 · "눈에도 들어갔으면 바로 씻을게요".
3. **19.4** · "소변 색은 이제 걱정 안 하셔도 돼요" — 횡문근융해 장면의 거짓 안심 · "소변 색이 맑아질 때까지 지켜볼게요"(19.1 오답과 겹치면 "소변량은 시간마다 잴게요").
4. **9.0** · "화상이 팔 전체로 번질 수 있어요" — 화상은 번지지 않고, "팔을 둘러싸고"와 반만 다름 · "팔이 많이 부을 수 있어요".
5. **3.1** · "얼음 대신 마른 거즈로 덮을게요" — "얼음은 피해요"와 반만 다름(얼음 대신) · "다 헹군 뒤에 깨끗한 거즈로 덮을게요".
6. **9.2** · "붕대를 조금 느슨하게 다시 감을게요" — 압력을 풀어 준다는 뜻이 겹침(경계) · "손가락 색을 자주 볼게요".
7. **4.0** · 0.0과 오답 "파상풍 주사는 언제 맞으셨어요?"가 글자까지 같음 · "불을 끄려고 뭘 하셨어요?".
8. 사소: 2.0·11.0 "깊이는 시간이 지나야 정확히 알 수 있어요" 거의 같음, 1.1·1.3 "손바닥 1퍼센트" 거의 같음, "높이 올려 둘게요" 5문장.

## 고칠 것 — `order`

1. **S0 2↔3 열림 + 임상 순서** · `Which spot hurts the most?`는 L1 뒤에도 바로 온다. 또 덮은 옷·장신구를 벗기기 전에 범위·깊이를 볼 수 없다(L4가 L2 뒤) · 
   L2 `Thanks. First, let me gently remove anything covering the burn.` / L3 `Now I can look at how large and deep it is.` / L4 `Of all those areas, which spot hurts the most?`
2. **S5 1↔2 열림** · 입 주변 그을음을 먼저 보고 입안을 보겠다고 하는 순서도 자연스럽다 · L2 `Inside, I can see soot at the back of your throat.`(`Inside`가 L1을 가리킴. `ko`: 입안 뒤쪽에 그을음이 보여요).
3. **S16 3↔4 열림** · `Along with that`이 L2(수액)를 받아도 자연스럽다 · L4 `Besides that number, we're watching your pressure and heart rate closely.`(`that number` = 소변량).
4. **S19 3↔4 열림 + 시간 묶음** · `We'll give extra fluids as needed`는 L2 바로 뒤에도 오고, L3 `With the fluids running`은 칼륨 감시를 "수액이 들어가는 동안"으로 묶는다(칼륨은 근육에서 나온다) · 
   L3 `If your urine stays dark, we'll give even more.`(실제로 소변 색·양으로 조절하는 조건이라 TASK 10번에 걸리지 않음) / L4 `Through all of it, we'll watch your potassium and heart rhythm closely.`
5. **S10 L3** · `Your answers help me, because I'm noting the shape and edges of the burn.` 인과가 꼬였다 · `Alongside your answers, I'm noting the shape and edges of the burn.`
6. **S18 L2** · `That makes it hard to take a full breath when your chest feels tight.` — "그것이 … 가슴이 조일 때 숨쉬기 힘들게 한다"로 겹친다 · `I know it's hard to take a full breath with your chest this tight.`(`ko`: 가슴이 이렇게 조이면 숨을 다 들이쉬기 힘드시죠)
7. **S8 L2 전제** · `Those wounds look small`은 상처가 작다는 전제를 깐다 · `Even if those wounds look small, electricity can damage deep tissue.`
8. **S1 L2** · `In those regions, each arm counts as…` 팔이 곧 부위라 어색 · `Of those regions, each arm counts as about nine percent.`
9. **S6 L3** · `To check that amount, we measure your urine.` 어색 · `To check it's the right amount, we measure your urine.`
10. **S7 L3** · `rinse your skin … not neutralize it`에서 `it`이 피부로 읽힌다 · `…with lots of water — we won't try to neutralize it.`보다 `…not try to neutralize the chemical.`
11. 사소: S11 L4 `What medicines do you take for it at home?`는 당뇨약만 묻는다(11.2 why는 혈액 희석제를 중요하게 말함) · `What medicines do you take at home, for that or anything else?`. S20은 인계에서 기도(A)를 수액(C)보다 먼저 말하는 편이 ABC 순서에 맞다(L2·L3 맞바꾸고 `Besides the airway,`로 묶기, 선택).

## 고칠 것 — swap `ko`·`tag`

1. **S5 swap ko** · "그의 입과 코 주변에" 번역투 · "환자 입과 코 주변에 그을음이 보여요".
2. **10.2 tag** · `전 아동 확인` · `모든 아이 확인`.

## 결정 11 — base 문장(보고만, v46에서 고치지 않음)

1. **9.2·9.4·18.1·18.4** · 가피절개를 `a small cut`·`small cuts`로 말함. 환자에게 겁주지 않으려는 말이지만 실제 절개는 길다. 또 9.2/9.4, 18.1/18.4가 거의 같은 문장이다. 하나씩 남기고 `a cut along the burned skin`처럼 바꾸기를 권한다.
2. **17.3** · `We'll check a blood test` — `run/do a blood test`가 자연스럽다.
3. **17.0/17.4** · 거의 같은 문장(측정기가 정상으로 나온다).
4. **13.4 ko** · "당신의 언어로" 번역투 → "쓰시는 말로".
5. **19.3** · `Your muscles broke down after the electrical burn.` 환자에게 단정 과거형 — `may be breaking down`이 맞다.
6. 청크: 20.3 `mostly partial / thickness`가 용어 `partial thickness`를 끊는다. 7.2 `Keep rinsing—this removes`, 15.2 `stay calm—this`는 대시를 넘어 두 절을 묶는다(keyPhrase 여부와 무관하게 보고만).
7. 단어 `w-output` 예문 exKo가 "충분합니다", 문장 20.1 ko가 "적정합니다"로 다르다(사소).

## 개수

- 사실 오류·심각한 문제 6
- why 8 · 빈칸 38(★ 빈칸 옮기기 14) · decoy 6(+경계 4) · distractorsKo 7(+사소) · order 10(+사소 2) · context 5(심각 3) · swap ko 1 · tag 1
- 결정 11 보고 7

## 종합

문장 낱장의 why·distractorsKo·tag는 앞 주제 수준으로 좋고 저작자가 짚은 임상 사실 다섯 가지도 모두 맞다. 그러나 빈칸 오답의 약 3분의 1이
읽기만 해도 걸러지고, context 정비 7건 중 5건이 규칙(어색한 말을 `word`로, 낱말 끼워 넣기 금지, why 다시 읽기)에 어긋나며, 가피절개를 "작다"고 가르치는
빈칸과 혈압·맥박을 소생 지표로 말하는 why가 있다. 위 목록을 반영한 뒤 내보내면 된다.
