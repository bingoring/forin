# er-fever-infection — v46 보강 검토 (er)

대상: `er-fever-infection.yaml` (상황 21 · 문장 105 · order 21장 · 뉘앙스 context 13 · swap 8). 문장 105개와 order 카드 21장(84줄)을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 발열 시작·양상 문진 … S20 = 고위험 감염 이송 인계). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 420줄, decoy를 청크 자리마다 대신 넣은 조립과 끝에 덧붙인 조립(약 580줄),
order 인접 교환 63가지(21장 × 3)와 줄 단어 수, context `word`가 세 장면 `en`에 있는지와 base 대비 바뀐 장면·`fix`·`why`, swap 8건의 `ko`,
빈칸 오답·`distractorsKo`·decoy의 주제 안 중복, 상황별 `keyPhrases`.
`verify_one_theme.py er …/er-fever-infection.yaml` → `==> 통과`(W13 경고 5 — v45 단어 오답 `sometime`·`confusing`·`emergence`·`scared`·`tape`, 이번 범위 밖. W14 0).
빈칸을 옮기자고 한 새 answer(B1·B3·B4·B5·B6·B7·B8·B10·B12·B14)는 모두 `en`에 낱말 경계로 정확히 한 번 나오는지 스크립트로 확인했다.

판정 기준(앞 주제 검토와 같음):
- 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. decoy 조립은 덧붙은 말이 `ko`에 이미 담긴 뜻일 때만 "ko에 맞는 다른 문장"으로 셌다.
- 오답을 넣으면 **하면 안 되는 처치**가 되는 것(의식이 떨어지는 아이에게 입으로 먹이기, 고열 쇼크 환자를 덮기)은 브리프 "위험한 처치를 오답으로도 보이지 않기"로 셌다.
- `distractorsKo`의 **틀린 의학 설명**은 그 상황 간호사가 할 말이 아니고(TASK 8 ②) 학습자가 틀린 사실을 들으므로 고칠 것으로 셌다.
- context는 `review-ctx-A/B/C`와 같이 — 세 장면이 함께 쓰는 말을 `word`로, 어색함은 그 말 주변의 전문어·약어를 환자·가족에게 쓴 데. 같은 뜻을 겹쳐 붙여 W14를 맞춘 장면("rate … by quantifying")은 고칠 것.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 거의 다 사실이고 말하는 방식의 이유를 짚는다. 해열제 복용 시 체온이 낮게 나옴(0.4), 노인 요로감염의 비전형 발현(6.0), 항암 중 발열은 결과를 기다리지 않고 항생제(9.1), 단순 열성경련(10.1), 점막 침범과 중증 약물 반응(11.2), 예방약을 귀국 뒤에도 계속 먹음(14.1), 독감 항바이러스제 48시간(8.4), 패혈증 번들(19.4), 24시간제 시각(20.1) 모두 맞다. 고칠 것 4: 2.0(`have you wear`가 "함께하는 느낌"이라는 설명이 틀림), 13.2(sputum은 환자가 모르는 말이라 풀어 말한다면서 문장은 sputum을 그대로 씀), 10.3(why "몇 분 안에" ↔ 문장 "within a minute"), 15.1(한 시간의 기준은 배양 뒤가 아니라 도착 뒤). |
| 2 | 빈칸 | 3 | `ko`로 가르지 않으면 정답이 둘인 곳은 1곳(18.2 `bite`·`burn` — `ko` "상처"가 둘 다 덮음). 고칠 것 22문장: **오답이 하면 안 되는 처치 3**(16.2 졸린 아이에게 `feeding`, 17.1 수술 전 금식 환자에게 `feed`, 18.1 고열 쇼크에 `blankets`), **같은 묶음 돌려쓰기**(`lotion` 5·`vitamins` 5·`bandages` 2 — 7.4·15.1·16.1·17.2·18.1·19.1, `dietitian`·`chaplain` 각 3 — 15.2·19.2·19.4, `upstairs` 4.4·9.4, `expensive` 2.4·4.1·16.4, `rare` 5.4·6.3·10.1·10.3), **시간 단위 묶음**(3.1 `evening/afternoon/overnight`, 13.3 `days/months/years`), **관사·문법으로 걸러짐**(8.0 `the strep/the covid/the pinkeye`, 14.3 `When hopefully/probably/finally`, 10.3 `look rare`, 14.4 `the sprain/the fracture`), **동떨어진 말**(4.4 `upstairs/indoors`, 8.2 `annoy/scare`, 10.4 `pills/slices/bites of fluid`, 12.3 `toe/wrist/tongue`, 13.4 `light/door/floor`, 15.1 `broad-spectrum vitamins/antacids/laxatives`, 18.3 `nails/teeth`, 16.4 `herbal/expensive`). |
| 3 | `decoy` | 4 | `ko`에 맞는 다른 문장이 되는 조립은 없다. 고칠 것 1: 10.2 `and give him juice` — 조립하면 "깨우기 힘들어지면 주스를 먹이라"가 된다(흡인 위험, diabetic 검토의 '의식 저하 환자에게 입으로 당'과 같은 갈래). 사소: 7.4 `to prove`·8.0 `to clean your`는 어느 자리에도 안 들어가는 조각이라 헷갈리게 하지 못함, `how long ago`(0.0·4.0)·`a urine sample`(5.1·9.1) 재사용. |
| 4 | `distractorsKo` | 3 | "안/못/절대" 뒤집기는 없다. 고칠 것 12: **틀린 의학 설명 2**(9.1 "배양은 소변으로만" — 호중구감소성 발열은 혈액배양 2세트, 13.2 "가래는 아침에 한 번만" — 결핵 객담은 3회), **반만 다른 것 2**(0.0 "열이 며칠째 이어졌어요?" ↔ "언제 시작됐고", 7.3 "발적이 커지면 선을 새로 그을게요" ↔ "커지는지 보려고 선을 그을게요"), **잘못된 안심 1**(7.2 "통증은 약을 먹으면 가라앉을 거예요" — 이 문장이 가르치는 경고 신호를 지움), **그 상황에서 할 법하지 않은 말 3**(0.4 "열이 어디서부터 시작됐는지", 4.4 "지금 바로 예방접종을 할게요", 19.4 "번들 체크리스트를 같이 읽어 드릴게요"), **같은 상황·주제 안 중복 4**(8.1 "약은 식후에 드세요" ↔ 8.4 "약은 식사 후에 드세요", "열이 며칠째 이어졌어요?" 0.0·0.1, "체온을 다시 재볼게요" 0.4·9.0, "기침이 언제부터 시작됐어요?" 1.2·2.2). 경계: 18.2 "최근에 생리를 하셨어요?"(탐폰과 가까움). |
| 5 | `order` | 2 | 조건부 줄은 대부분 진짜 조건(S3 열 재상승, S8 양성·초기)이다. 그러나 **사실·임상 흐름이 틀린 카드 5장**(S20 L1 공기·접촉 격리, S14 L2 예방약을 귀국 전에 끝냄·L3 검사가 답에 달림, S10 L4 수분이 열을 내림·L1 1분, S16 위급 징후에 문진이 처치보다 먼저, S9 L4 "배양과 항생제를 보면 간호사가 옳았다"), **인접 교환이 열린 카드 3장**(S8 3↔4 — `Either way`가 L2에 붙음, S15 2↔3, S3 3↔4 약하게), **답을 전제한 줄 3장**(S0 L4 약을 먹었다고 전제, S11 L2 `Given that timing` — 약 뒤에 났다고 전제, S7 L4 `what you told me`), **조건을 엑스레이 하나로 좁힌 줄 1장**(S5 L4). 억지 연결어 선택 4장(S1·S2·S12·S17). |
| 6 | `tag`·`icon` | 4 | 태그는 한국어 10자 이하이고 상황 안에서 일관된다. order 21장 모두 `대화 흐름`·`compass`. 사소: 20.3 원내 이송에 `plane`, S20 L3 정맥로에 `pill`. |
| 7 | context `word`·`ko`, swap `ko` | 4 | 13문항 모두 세 장면에 `word`가 있다(W14 0). `ko` 13개 모두 정확하다. 정비 9건 중 7건은 받아들인다. 고칠 것 2: S6 XX `Your mother is confused — she has acute altered mental status.`(같은 뜻 겹치기), S13 XX `an AIIR for airborne isolation`(AIIR 안에 airborne isolation이 이미 있음 — 경미). swap `ko` 8건은 모두 정답을 넣은 문장의 뜻이다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘 없음(T8) 확인. (2) 빈칸: 같은 분야에서 틀린 말을 잘 고른 문장이 많다(8.1 `antihistamine/antibiotic/antacid` — 관사까지 맞춤, 8.4 `after/outside/beyond`, 15.4 `rising/steady/holding`). 그러나 `lotion/vitamins/bandages`·`dietitian/chaplain` 묶음 돌려쓰기와 시간 단위 묶음이 되풀이됐다. (3) order: `And/Also/Then`은 없지만 `Along with that`·`Based on all of that`이 여러 장에서 같은 일을 한다. (4) 임상: S14·S16·S20. (5) decoy·오답 뜻 겹침: 10.2, 0.0·7.3. |

## 사실 오류·심각한 문제

1. **S20 문장 20.0과 order L1 `he's on airborne and contact precautions`** — 수막구균(*Neisseria meningitidis*)은 CDC 격리 지침에서 **비말(droplet) 격리**이고, 효과적인 항생제 24시간 뒤까지 유지한다. 공기 격리(음압실·N95)도, 접촉 격리도 표준이 아니다. 이송 인계 첫 줄이라 받는 쪽이 방과 보호구를 잘못 준비하게 된다.
   - order L1은 v46 필드지만 20.0과 어긋나지 않게 G1 결정에 묶어 고친다 → O13.
   - 20.0은 **keyPhrase와 글자까지 같은 문장**이라 결정 11로 고칠 수 없다(V4). `in-er-fever-infection.json`의 keyPhrase까지 바꾸는 일이라 사용자 결정이 필요하다 → G1.
   - 이어지는 것: S20 pair `["contact", "precautions"]`(v45)와 그 why, 20.0의 `words`(`w-contact`). 20.0을 고치면 `w-contact` 태그가 사라지니 pair와 단어(`w-droplet` 새로)를 같이 고쳐야 V3가 맞는다.
2. **S14 order L2 `Before you came back that day, did you take any malaria prevention pills, and finish them?`** — 예방약은 귀국 **뒤에도** 1~4주 이어 먹어야 끝난다(아토바쿠온-프로구아닐 7일, 독시사이클린·메플로퀸 4주). "돌아오기 전에 … 끝까지 드셨나요"는 그 반대를 가르치고, 같은 상황 14.1 why("귀국 후에도 일정 기간 이어서 먹어야")와도 어긋난다.
   **L3 `Based on those answers, a fever after travel to a malaria area needs urgent testing.`** — 예방약을 다 먹었어도 말라리아를 배제할 수 없어 검사는 답과 상관없이 바로 한다. "그 답을 보면 검사가 필요하다"는 검사를 조건부로 만든다(TASK 10). → O11.
3. **10.2 decoy `and give him juice`** — 조립하면 `Keep offering fluids and give him juice if he becomes hard to wake.` / `… hard to wake and give him juice.`. 깨우기 힘든 아이에게 입으로 먹이라는 말이라 흡인 위험이 있다. → D1.
4. **빈칸 오답이 하면 안 되는 처치**
   - 16.2 `We're feeding him …` — 졸리고 차가워지는 수막구균혈증 아이에게 먹이는 장면. → B13.
   - 17.1 `calling surgery urgently to feed you` — 응급 수술 전 금식 환자. `bathe/dress`와 함께 장면 밖 말이기도 하다. → B14.
   - 18.1 `starting blankets` — 고열 쇼크 환자를 덮는 말(poisoning 검토의 `heat/blankets`와 같은 갈래). 문법으로도 걸러진다. → B16.
5. **S16 order — 위급 징후 앞에 문진.** L1 `How quickly did the spots spread …?`를 먼저 묻고 L2에서야 "지금 움직인다". 보호자가 "보라 반점, 차갑고 졸려요"라고 한 장면(자반 + 의식 저하 + 쇼크 징후)에서는 항생제·수액이 먼저이고 문진은 그동안 한다. 게다가 L3 `For that dangerous sign`이 L2의 말을 되풀이한다. → O14.
6. **S10 order** — L4 `To help bring it down, keep offering fluids` — 수분은 열을 내리지 않는다(탈수를 막는다). L1 `within a minute`은 base 10.3과 같은 문제(아래 7). L3 `Since they rarely leave lasting harm`은 L2 `don't cause lasting harm`의 되풀이이고, 그래서 2↔3이 약하게 열린다. → O8.
7. **10.3 `they usually stop on their own within a minute`(base)** — 단순 열성경련은 15분 미만으로 정의하고 대개 몇 분 안에(대부분 5분 안) 멈춘다. "1분 안에"는 과장된 안심이라, 보호자가 2~3분 이어지는 경련을 비정상으로 받아들이게 만든다. why는 "몇 분 안에"라 문장과 어긋난다. keyPhrase가 아니니 결정 11로 고친다 → G2, 10.3 why → W3.
8. **틀린 의학 설명을 오답 뜻으로** — 9.1 "배양은 소변으로만 할게요"(호중구감소성 발열은 혈액배양 2세트가 기본), 13.2 "가래는 아침에 한 번만 뱉으시면 돼요"(결핵 객담 AFB는 3회, 그중 하나는 이른 아침). → K8·K9.
9. **S9 order L4 `Given the cultures and antibiotics, your nurse was right to send you in immediately.`** — 간호사가 옳았던 이유는 항암 중 발열의 위험이지, 배양과 항생제가 아니다. 인과가 거꾸로다. L2 `With chemo, that makes a fever an emergency`도 이유가 둘 겹친 비문에 가깝다. → O7.
10. **인접 교환이 열린 order** — S8 3↔4(`Either way`는 L2의 "양성이면"을 받는 말이라 L2 바로 뒤가 오히려 자연스럽다), S15 2↔3(L3 `this drop in pressure`가 L1의 hypotensive를 가리켜도 읽힘), S3 3↔4 약하게. 학습자가 맞히고도 틀린다. → O6·O12·O3.

## 저작자 자기 보고 4건 판정

### 1. base 문장 S20 `Suspected meningococcemia — he's on airborne and contact precautions.`

**판정: 사실 오류다. 결정 11로 보고하되, keyPhrase라 이 주제 안에서는 고칠 수 없다.** 수막구균은 비말 격리(CDC Isolation Guideline 부록 A: *Neisseria meningitidis* — Droplet, 효과적 치료 24시간 뒤까지)다. 위 심각 1 · G1. order L1은 G1 결정에 묶어 고친다(O13 — 보류되면 격리 종류를 뺀다). S16 문장들은 "isolating"만 말해 문제가 없다.

### 2. 남긴 조건부 order 줄

**판정: 넷 중 둘은 그대로, 하나는 조건만 넓히고, 하나는 순서 때문에 바꾼다.**
- **S5 L4 `If the X-ray shows pneumonia, we'll start antibiotics promptly.` — 조건은 유지하되 엑스레이 하나로 좁히지 않는다.** 폐렴 항생제는 모든 발열 환자에게 주는 것이 아니니(바이러스·다른 원인) 조건부 자체는 맞다. 이 장면은 숨가쁨이 있지만 저혈압·의식 변화 같은 패혈증 징후는 아직 없다. 다만 "엑스레이에서 보이면"이라 하면 엑스레이 판독을 기다리는 것처럼 읽힌다. 산소가 낮거나 패혈증 선별이 양성이면 영상을 기다리지 않고 경험적 항생제를 시작한다(Surviving Sepsis 2021: 패혈증 가능성이 높으면 1시간, 쇼크가 없는 패혈증 가능성이면 3시간 안). base 문장 5.2 `If it's pneumonia`와 같이 진단에 거는 편이 맞다. → O5.
- **S8 L2 `If it's positive and it's early, an antiviral may help.` — 그대로.** base 문장이고, 이 장면은 건강한 직장인 외래 환자라 "양성이고 48시간 안"은 CDC 권고와 맞다. 고위험군·입원 환자는 검사를 기다리지 않고, 48시간이 지나도 치료한다는 것은 why에 한 줄 더하면 좋다(선택).
- **S3 L4 `If your fever goes back up before then, please let us know.` — 그대로.** 환자가 알려야 할 기준을 주는 조건이라 TASK 10에 걸리지 않는다. 다만 `before then`이 L2의 "30분"에도 붙어 3↔4가 약하게 열리니 `before that recheck`로 묶는다 → O3.
- **S8 L4 `Either way, please keep the mask on …` — 내용은 맞지만(결과와 상관없이 호흡기 증상이 있으면 마스크) 순서가 열린다.** `Either way`는 L2의 "양성이면"을 받아 L2 → L4가 더 자연스럽다. L4를 L3("이틀 안")을 가리키는 줄로 바꾼다 → O6.

### 3. 같은 범주 오답으로 채운 빈칸 중 `ko`를 보지 않으면 정답이 둘로 읽히는 곳

**판정: 영어만으로는 성립하는 오답이 약 20문장이다. `ko`로 갈리지 않는 곳은 18.2 하나다.**
- `ko`가 가르는 곳(그대로 둠): 0.0 `low`·`far`, 0.1 `chest tightness`, 1.2 `swallow`, 1.4 `blood`(혈류 감염도 맞는 말이지만 `ko` "피부"), 2.2 `relocated`, 4.0 `stay`, 4.1 `spicy`, 4.2 `tired`, 5.3 `dry`·`wet`, 6.3 `rare`, 6.4 `only`(노인 요로감염에서 혼란이 "유일한" 징후인 경우도 실제로 있음), 8.4 `after`, 11.3 `stopped`·`finished`, 11.4 `itching`, 12.2 `dim`, 13.3 `months`, 19.2 `family`, 20.2 `mean`(MAP 85), 20.3 `warm`(이송 중 보온은 맞는 말).
- **`ko`로도 갈리지 않음: 18.2 `any recent [bite]/[burn], surgery, or … tampons`** — `ko` "상처"가 물린 상처를 덮고, 화상은 실제로 독성쇼크의 대표 진입로다(특히 소아). → B19.

### 4. context 정비 9건

**판정: 7건은 받아들인다. S6은 고치고, S13은 경미하게 다듬는다.**
- 받아들임 — 묶음 검토 A·B·C와 같은 모양(세 장면이 함께 쓰는 말을 `word`로, 어색함은 주변 전문어·약어):
  - **S1 `pulse`** — 차트 `HR 112` → `pulse 112`, 동료 `heart rate` → `pulse`. XX `You're febrile and tachycardic — your pulse is 112.`의 어색함은 febrile·tachycardic에 있다. 차트는 `HR`·`P`가 더 흔하지만 `pulse`도 쓰이는 말이라 받아들인다. ✓
  - **S3 `recheck`** — XX `reassess` → `recheck` 한 낱말. 차트 말투를 환자에게 그대로 읽은 장면. ✓
  - **S4 `travel`** — 동료 장면에 `traveled`를 넣었다. 자연스럽다. ✓
  - **S9 `antibiotics`**·**S16 `purpura`**·**S18 `toxic shock`** — 약어(`abx`·`TSS`·`Purpuric rash`)를 풀어 쓴 것뿐이다. 장면 뜻은 그대로다. ✓
  - **S11 `rash`** — XX `You might have SJS` → `Your rash might be Stevens-Johnson syndrome.` 확인되지 않은 무서운 병명을 환자에게 먼저 꺼낸 장면이라는 why와 맞는다. ✓
- **S6 `confused` — 고칠 것.** XX `Your mother is confused — she has acute altered mental status.`는 앞 절이 fix와 같은 쉬운 말이고, 뒤 절이 같은 뜻을 전문어로 겹친 것이다(ctx-B `rate … by quantifying`과 같은 갈래). 차트 장면도 `confused`가 아니라 `confusion`이다(W14는 어간으로 통과). TASK 9의 `drowsy` 예시처럼 차트 말투를 그대로 보호자에게 쓰는 모양으로 바꾼다. → C1.
- **S13 `isolation` — 경미.** XX `You're being placed in an AIIR for airborne isolation.`에서 AIIR(airborne infection isolation room) 안에 airborne isolation이 이미 들어 있어 겹친다. → C2.

## 고칠 것

### why (W)
- W1 · 2.0 why · "have you wear는 시키기보다 함께하는 느낌"은 틀린 설명이다(사역 구문이고 함께한다는 뜻이 없음) · "I'll have you ~는 해 달라는 일을 정중하게 안내하는 틀이에요. make·force보다 덜 강압적으로 들려요."로(같은 상황 swap notes와 맞춤).
- W2 · 13.2 why · "sputum은 환자가 알아듣기 어려운 말이라 … 풀어서 설명해요"인데 문장은 sputum을 그대로 쓴다 · "sputum은 깊은 기침으로 뱉어 내는 가래예요. 환자에게는 '침이 아니라 깊이 기침해서 나오는 가래'라고 덧붙여 침이 섞이지 않게 해요."처럼 문장과 맞게.
- W3 · 10.3 why · 문장 "1분 안에"와 why "몇 분 안에"가 어긋난다 · G2와 함께 고치면 그대로 둬도 됨. G2를 하지 않으면 why를 문장에 맞추지 말고 G2를 하라고 보고(1분은 과장).
- W4 · 15.1 why · "배양 뒤 한 시간 안에" → "도착(분류)부터 한 시간 안에 — 배양은 그 전에 채취하되 항생제를 늦추지 않아요". 한 시간의 기준은 배양이 아니라 내원 시각이다.
- (선택) W5 · 8.1 why · "고위험군·입원 환자는 검사 결과를 기다리지 않고, 48시간이 지나도 줘요" 한 줄 추가.
- (선택) W6 · 6.0·6.4 why · "다른 원인(약·탈수 등)을 함께 따져요"를 더하면 '혼란 = 요로감염' 단정을 피한다(미국 노인의학회·IDSA는 배뇨 증상 없는 혼란을 소변 검사만으로 요로감염이라 하지 말라고 경고).

### 빈칸 (B)
- B1 · 3.1 · `in about an [evening/afternoon/overnight]` — 시간 단위 묶음, 뜻으로 바로 걸러짐 · 빈칸을 `temperature`로 옮기고 오답 `pulse`·`oxygen`·`blood sugar`(`ko` "체온"이 가름).
- B2 · 4.4 · `from [upstairs/nearby/indoors]` — 장면 밖 말 · `the hospital`·`daycare`·`the gym`(같은 '어디서 옮아 왔나' 갈래, `ko` "해외에서"가 가름).
- B3 · 8.0 · `the [strep/covid/pinkeye]` — `the`로 걸러짐 · 빈칸을 `the flu`로 넓히고 오답 `strep throat`·`COVID`·`RSV`(문법이 모두 맞고 같은 계절 검사).
- B4 · 8.2 · `to [annoy/scare/remind] others` — 장면 밖 말 · 빈칸을 `mask`로 옮기고 오답 `gown`·`gloves`·`face shield`(`ko` "마스크"가 가름).
- B5 · 9.4 · `send you in [separately/alone/upstairs]` — `upstairs` 재사용, 장면 밖 · 빈칸을 `right`로 옮기고 같은 판단 형용사(`wrong`, `unwise` 등 — 동의어 둘이 겹치지 않게)로. `tomorrow`처럼 내원을 미루는 말은 쓰지 말 것(위험한 지연).
- B6 · 10.4 · `small [pills/slices/bites] of fluid` — 셋 다 `of fluid`와 안 붙음 · 빈칸을 `hydrated`로 옮기고 오답 `cool`·`calm`·`full`.
- B7 · 12.3 · `bring your [toe/wrist/tongue] down` — 장면 밖 · 빈칸을 `chest`로 옮기고 오답 `shoulder`(목 돌리기 — 같은 목 사정의 다른 동작)·`knees`·`back`.
- B8 · 13.3 · `How many [days/months/years]` — 브리프가 이름을 든 시간 단위 묶음 · 빈칸을 `night sweats`로 옮기고 오답 `chills`·`headaches`·`hot flashes`.
- B9 · 13.4 · `keeps the [light/door/floor] from spreading TB` — 장면 밖 · 오답을 전파 경로 대비로 `water`·`blood`·`food`.
- B10 · 14.3 · `When [hopefully/probably/finally] did you …` — 셋 다 비문 · 빈칸을 `When`으로 옮기고 오답 `Where`·`How`·`Why`(`ko` "언제"가 가름).
- B11 · 14.4 · `like the [sprain/migraine/fracture]` — 장면 밖, `the sprain` 어색 · `measles`·`mumps`·`chickenpox`(열나는 병, `the`와 맞음).
- B12 · 15.1 · `broad-spectrum [vitamins/antacids/laxatives]` — `broad-spectrum`과 안 붙음, 묶음 돌려쓰기 · 빈칸을 `broad-spectrum`으로 옮기고 오답 `narrow-spectrum`·`oral`·`topical`.
- B13 · 16.2 · `We're [feeding/dressing/bathing] him` — `feeding`은 졸린 아이에게 먹이는 위험한 처치(심각 4), 셋 다 17.1과 같은 묶음 · `monitoring`·`admitting`·`weighing`.
- B14 · 17.1 · `to [bathe/dress/feed] you` — `feed`는 수술 전 금식 환자(심각 4), 장면 밖 · 빈칸을 `surgery`로 옮기고 오답 `dermatology`(발적만 보고 부르는 흔한 오진)·`physical therapy`·`social work`.
- B15 · 16.1 · `giving [cough syrup/vitamins/lotion] immediately` — 묶음 · 같은 분야 약으로 `Tylenol`·`an antihistamine`·`steroid cream` 등(`ko` "항생제"가 가름). 스테로이드 정맥 주사처럼 뇌수막염에 실제로 쓰이는 약은 피할 것.
- B16 · 18.1 · `starting [vitamins/lotion/blankets]` — `blankets`는 고열 쇼크 환자를 덮는 말(심각 4), 묶음 · `Tylenol`·`antihistamines`·`oxygen`(`starting oxygen`은 문법이 맞고 장면 안의 다른 처치 — `ko` "항생제"가 가름).
- B17 · 17.2·19.1 · `[lotion/bandages/vitamins]` 묶음 · 17.2 `and [fluids]` → `pain medicine`·`oxygen`·`a splint`, 19.1 `and [antibiotics]` → `steroids`·`blood`·`pain medicine`처럼 문장마다 다르게.
- B18 · 10.3 · `look [silent/loud/rare]` — `look rare` 비문, `rare` 4번째 재사용 · `calm`·`mild`·`harmless`(`but` 뒤와 뜻이 어긋나 걸러짐, `ko` "무서워"가 가름).
- B19 · 18.2 · `any recent [bite]/[burn]` — `ko` "상처"로도 갈리지 않는 정답 둘(자기 보고 3) · `cough`·`vaccine`·`fall`처럼 상처가 아닌 말로.
- B20 · 18.3 · `your [nails/teeth/bones] are under stress` — 장면 밖 · `joints`·`tendons`·`bones`(독성쇼크 기준에 들어가는 근육·점막·눈은 피할 것).
- B21 · 16.4 · `[expensive/herbal/topical] antibiotics` — `expensive`·`herbal` 장면 밖, `expensive` 세 번째 재사용 · `IV`·`topical`·`long-term`.
- B22 · 15.2·19.2·19.4 · `dietitian`·`chaplain` 세 문장 돌려쓰기 · 15.2 `a [physician]` → `pharmacist`·`transporter`·`scribe`, 19.2 `the [team]` → `family`(유지)·`patient next door`·`interpreter`, 19.4 `the [physician]` → `pharmacist`·`lab`·`charge nurse`처럼 문장마다 다른 같은 분야 역할로.
- (선택) B23 · 7.2 · `[rarely]`(묶음)·`[slightly] gets much worse`(앞뒤 모순) · `slowly`는 두고 나머지를 `ever`·`only` 등 문법이 서는 부사로.
- (선택) B24 · 2.4·4.1 `expensive`, 6.0 `hair loss`, 13.0 `skin loss`, 9.0 `irritation/error` · 같은 분야에서 틀린 말로.
- (선택) B25 · 5.2 `If it's [a virus], we'll start antibiotics`, 8.1 `an [antibiotic] may help`(독감) · 바이러스에 항생제를 쓰는 관행을 보인다. 급한 해는 없지만 항생제 남용을 가르치지 않게 바꾸면 좋다.

### decoy (D)
- D1 · 10.2 · `and give him juice` — 조립하면 깨우기 힘든 아이에게 주스(심각 3) · `if he gets hungry`(어느 자리에도 맞는 영어가 안 됨).
- (선택) D2 · 7.4 `to prove`, 8.0 `to clean your` · 어느 자리에도 그럴듯하지 않아 오답 구실을 못 함 · 같은 자리에 올 구(`to ease the pain`, `to check your`)로.

### distractorsKo (K)
- K1 · 0.0 · "열이 며칠째 이어졌어요?" — "언제 시작됐고"와 반만 다름, 0.1과 중복 · "가족 중에 아픈 분이 있나요?"
- K2 · 0.1 · "열이 며칠째 이어졌어요?" 중복 · 0.1은 그대로 두고 0.0만 바꾸면 해결.
- K3 · 0.4 · "열이 어디서부터 시작됐는지 알려주세요" — 말이 안 되는 질문 · "약은 몇 시에 드셨어요?"
- K4 · 0.4 / 9.0 · "체온을 다시 재볼게요" 중복 · 9.0을 "피검사 결과는 곧 나와요"로.
- K5 · 1.2 / 2.2 · "기침이 언제부터 시작됐어요?" 중복 · 2.2를 "가족도 기침을 하나요?"로.
- K6 · 4.4 · "지금 바로 예방접종을 할게요" — 열나는 여행자에게 할 말이 아님 · "결과는 오늘 안에 알려 드릴게요".
- K7 · 7.2 · "통증은 약을 먹으면 가라앉을 거예요" — 이 문장이 가르치는 경고 신호(겉보기보다 심한 통증)를 지우는 잘못된 안심 · "다리를 심장보다 높이 올려 두세요".
- K8 · 7.3 · "발적이 커지면 선을 새로 그을게요" — 정답과 반만 다름 · "선 주변이 가려우면 말씀해 주세요".
- K9 · 9.1 · "배양은 소변으로만 할게요" — 틀린 의학 설명(심각 8) · "항암제는 오늘 쉬어 갈게요"처럼 이 상황에서 할 법한 말로.
- K10 · 13.2 · "가래는 아침에 한 번만 뱉으시면 돼요" — 틀린 의학 설명(심각 8) · "가래 통은 뚜껑을 꼭 닫아 주세요".
- K11 · 8.1 / 8.4 · "약은 식후에 드세요" ↔ "약은 식사 후에 드세요" 같은 뜻 · 8.4를 "열이 나면 해열제를 드셔도 돼요"로.
- K12 · 19.4 · "번들 체크리스트를 같이 읽어 드릴게요" — 쇼크 환자에게 할 말이 아님 · "가족분께 지금 연락할게요".
- (선택) K13 · 8.0 · "독감 예방주사를 놓을게요" — 앓는 중에는 대개 미룸 · "코가 조금 간지러울 수 있어요".
- (경계) 18.2 "최근에 생리를 하셨어요?" — 탐폰과 가까워 듣고 고를 때 헷갈릴 수 있음. 바꾸면 "최근에 열이 난 적 있나요?" 같은 다른 질문으로.

### order (O)
- O1 · S0 · L4 `Did your temperature change after you took it?`이 L3의 답을 '예'로 전제, L3 `bring it down from that level` 어색 · L3 `When it got that high, did you take anything to bring it down?`, L4 `If you did, did your temperature change afterward?`
- O2 · (선택) S1 · L3 `Since that pulse can point to infection`·L4 `Starting with those sources` 억지 연결어 · L3 `Since a fast pulse can come with infection, I'll ask about a few common sources.`, L4 `First — any pain when you pee, cough, or a wound anywhere?` 등.
- O3 · S3 · 3↔4 약하게 열림(`before then`이 L2의 30분에도 붙음) · L4 `If it goes back up before that recheck, please let us know.`
- O4 · (선택) S2 · L4 `I know that room feels uncomfortable` — 아직 들어가지 않은 방 · `I know a separate room may feel lonely, but it helps keep everyone safe.`
- O5 · S5 · L4 조건을 엑스레이 하나로 좁힘(자기 보고 2) · L4 `If those show pneumonia, we'll start antibiotics promptly.`(`those` = 엑스레이·산소), 카드 why에 "산소가 낮거나 패혈증 징후가 있으면 결과를 기다리지 않아요" 한 줄.
- O6 · S8 · 3↔4 열림(`Either way` ↔ L2) · L4 `To see if you're within that window, when did your aches start?`(L3의 이틀을 가리킴, 13단어). 마스크 안내는 문장 8.2에 있으니 카드에서 빠져도 된다. why 고쳐 쓰기.
- O7 · S9 · L4 인과가 거꾸로, L2 비문에 가까움(심각 9) · 예: L1 `Your nurse was right to send you in immediately.` L2 `With chemo, even a mild fever like this can turn serious quickly.` L3 `That's why we treat it as an emergency.` L4 `So we're drawing cultures and starting antibiotics right away.` — 바꾼 뒤 1↔2를 다시 읽을 것.
- O8 · S10 · L1 `within a minute`(G2), L3가 L2를 되풀이, L4 수분이 열을 내린다는 틀린 인과(심각 6) · L1 `… within a few minutes`, L3 `Bringing his fever down is mainly to keep him comfortable.`, L4 `Along with that, keep offering fluids, and tell me if he's hard to wake.` — 2↔3·3↔4를 다시 읽을 것. 해열제가 열성경련을 막지 못한다(AAP)는 사실과 어긋나는 줄은 쓰지 말 것.
- O9 · S11 · L2 `Given that timing`이 "약 뒤에 났다"를 전제 · `If it started after, that makes me wonder about a drug reaction.` (선택) L4 `Based on all of that` → `Because of that risk, we'll watch closely …`(L3의 `how serious`를 받음).
- O10 · (선택) S7 · L4 `what you told me` 전제, L3 `Along with the antibiotics` 억지 · L4 `If it does, I'll get the doctor right away — not wait for our next check.`(`it does` = L3의 통증 악화).
- O11 · S14 · L2 예방약을 귀국 전에 끝낸다는 틀린 사실, L3 검사를 답에 거는 조건(심각 2) · L2 `On that trip, did you take malaria prevention pills — and keep taking them after?`, L3 `Even if you took them all, a fever after a malaria area needs urgent testing.`(15단어). L4 그대로.
- O12 · S15 · 2↔3 열림, L3 `for this drop in pressure give … antibiotics` 인과 어색 · L3 `While you're on your way, cultures are drawn — give broad-spectrum antibiotics now.` (항생제를 미루는 줄이 아니라 TASK 10 시간 묶음에 걸리지 않음), L4 그대로(`that first dose`가 L3을 받음).
- O13 · S20 · L1 공기·접촉 격리(심각 1) · **G1과 함께 고친다** — 같은 상황의 20.0·pair가 `airborne and contact`로 남은 채 L1만 바꾸면 카드끼리 격리 종류가 어긋난다. G1이 승인되면 L1 `Suspected meningococcemia — he's on droplet precautions.`, `ko` "수막구균혈증 의심 — 비말 격리 중입니다". G1이 보류되면 L1에서 격리 종류를 빼고 `Suspected meningococcemia — he's isolated, and cultures are drawn.`처럼 쓴다(L2 `For that`이 그대로 받는지 다시 읽을 것).
- O14 · S16 · 위급 징후 앞에 문진, L3 되풀이(심각 5) · L1 `Those purple spots with drowsiness are a dangerous sign — we're acting now.` L2 `That means antibiotics immediately and fluids, starting right now.` L3 `While they go in, how quickly did the spots spread?` L4 `Anyone who's been close to him will need preventive antibiotics too.` — 질문은 처치와 함께 하므로 아무것도 미루지 않는다.
- (선택) O15 · S12 · L3 `Along with how that felt` 억지 · `After that, does bright light bother your eyes right now?` 등.
- (선택) O16 · S17 · L4 `Along with the antibiotics, we're calling surgery …` — 괴사성 근막염은 외과적 절제가 핵심이라 외과 호출을 덧붙임처럼 보이지 않게 L3·L4를 바꾸는 편이 낫다(`… and we're calling surgery now — that's the key treatment.`). 순서가 하나인지 다시 읽을 것.

### tag·icon (T)
- (선택) T1 · 20.3 `plane` → `shield`(원내 이송·격리), S20 L3 `pill` → `monitor`.

### context (C)
- C1 · S6 `confused` · XX가 같은 뜻 겹치기, 차트는 `confusion` · 차트 `Pt confused, oriented to self only; baseline A&Ox3 per daughter.` XX `Acutely confused, A&Ox1 — rule out delirium from a UTI.`(차트 말투를 보호자에게 그대로 — TASK 9 `drowsy` 예시와 같은 모양). fix 그대로. why를 "차트에는 A&Ox·delirium·UTI 같은 약어와 용어로 적지만 보호자에게는 …"로 지금 장면에 맞게.
- C2 · (경미) S13 `isolation` · XX `an AIIR for airborne isolation` 겹침 · `You're on airborne isolation — AIIR, negative pressure, N95 only.`
- (선택) C3 · S20 `drawn`(base) · XX `BCx x2 drawn; ceftriaxone 2 g IV at 1900.`가 차트 장면과 `given` 한 낱말만 다르다. 보호자에게 말로 읽는 장면으로(`Two BCx drawn, ceftriaxone 2 grams IV went in at nineteen-hundred.`) 바꾸면 차이가 듣는 사람에게 있다는 것이 더 분명해진다.

### 결정 11 (base 문장 — 따로)
- G1 · S20 문장 20.0 · `airborne and contact precautions` → `droplet precautions`(심각 1). **keyPhrase와 같은 문장이라 V4 — 이 주제 안에서는 바꾸지 말고 사용자 결정으로 올린다.** 바꾸게 되면 `in-er-fever-infection.json` keyPhrase, 20.0 `en`·`ko`("비말 격리 중입니다")·`chunks`(`Suspected meningococcemia / — he's on / droplet precautions / .`)·`words`(`w-contact` 빼고 `w-droplet` 새 단어), S20 pair `["contact","precautions"]`와 why를 함께 고치고 V3를 다시 본다. 20.0 blank(`Suspected`)·decoy(`Probable measles`)는 그대로 쓸 수 있다.
- G2 · S10 문장 10.3 · `within a minute` → `within a few minutes`(심각 7). keyPhrase 아님. `chunks` 끝 조각 `within a minute` → `within a few minutes`. why는 그대로 맞게 된다.
- (선택) G3 · 3.3 · `within thirty minutes or so` — 아세트아미노펜 해열 효과는 30~60분에 시작되니 `within an hour or so`가 더 정확하다(order S3 L2도 같음). `or so`가 있어 틀렸다고까지는 하지 않는다.
- (선택) G4 · 15.2 `ko` "수액을 흘리고", 18.4 `ko` "수액을 빠르게 흘릴게요" — 한국어로 어색 · "수액을 달고", "수액을 빠르게 넣을게요".
- (선택) G5 · 8.3 `ko` "이것도 그럴 가능성이 커요" · "독감일 가능성이 아주 커요".
- (보고만) 12.0 `concerns me about meningitis`, 17.0 `worries me about a deep infection` — `X concerns/worries me about Y`는 자연스러운 영어가 아니다(`makes me worried about`). 둘 다 keyPhrase라 바꾸지 않는다.

## 고칠 것 개수

why 4(+선택 2) · 빈칸 22(+선택 3) · decoy 1(+선택 1) · distractorsKo 12(+선택 1, 경계 1) · order 11(+선택 5) · tag·icon 0(+선택 1) · context 2(+선택 1) — **필수 52건**, 선택 14건. 결정 11: 필수 2(G1은 사용자 결정), 선택 3, 보고 1.

## 종합

why·context·swap은 거의 다 맞고 빈칸 오답도 같은 분야에서 고른 문장이 많다. 다만 사실 오류 2(수막구균 공기·접촉 격리, 말라리아 예방약을 귀국 전에 끝냄)와 과장된 안심 1(열성경련 "1분 안에"), 위험한 오답 4(주스 decoy, `feeding`·`feed`·`blankets`), 위험 징후 앞의 문진(S16), 그리고 순서가 열리거나 인과가 틀린 order 카드가 있다. **위 필수 52건을 고친 뒤 내보내도 된다.** 20.0은 keyPhrase라 사용자 결정이 필요하고, order L1은 그 결정에 맞춰 고친다(보류되면 격리 종류를 뺀다).
