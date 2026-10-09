# er-obgyn — v46 보강 검토 (er)

대상: `er-obgyn.yaml` (상황 21 · 문장 128 · order 21장 · 뉘앙스 context 13 · swap 8). 문장 128개와 order 21장을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 임신 초기 출혈 문진 … S20 = 패혈성 유산). 문장은 `상황.문장`(0부터), order 줄은 L1~L4로 적는다.

스크립트로 전부 뽑아 본 것:
- 빈칸 `before+선택지+after` 512줄
- decoy를 청크 자리마다 바꿔 넣은 조립과 끼워 넣은 조립 약 1,370줄
- order 인접 교환 63가지(21장 × 3)와 줄 단어 수
- context 13문항: base와 장면 diff, 세 장면에 `word`가 있는지
- swap 8문항: 정답 선택지를 넣은 문장과 `ko` 대조
- decoy·빈칸 오답·distractorsKo가 여러 문장에 되풀이되는지

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 문법이 맞고 장면상 그럴듯해도 `ko`가 걸러 주는 오답·decoy는 괜찮은 것으로 봤다. context 판정 기준은 `er-v46-ctx/review-ctx-A·B·C.md`와 맞췄다. 기준은 같은 임상어가 세 장면에 다 있는지, 어색한 장면이 듣는 사람에게 맞지 않아서 어색한지, 끼워 넣어 틀린 영어가 되지 않았는지다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식의 이유를 짚는다. 임상 근거도 맞다: 자궁이완증이 산후출혈의 가장 흔한 원인, 초음파가 임신 중 첫 영상, 황산마그네슘, 의료 통역사, 초기 유산의 염색체 원인. 고칠 것은 S17 카드 why·S17 context why(인과가 어긋남)다. 6.3(진단 고지 틀이 불완전함)과 사소한 15.5는 보강한다. |
| 2 | 빈칸 | 4 | 위험한 처치를 선택지로 보인 문장이 없다. `ko`로 다 걸러지지 않는 것은 6개다: 0.4 `staining`, 6.6 `sitting/waiting`, 9.3 `spread`, 12.3 `other`, 16.0(`ko`에 '분만'이 없어 `relax`도 맞음), 19.4 `has passed`. 방식 부사 묶음이 되풀이된다(`quietly` 8문장, `gently`·`quickly` 각 3문장). |
| 3 | `decoy` | 3 | 조립하면 위험한 지시가 되는 decoy가 4개다: 5.5 `ask a friend`, 17.5 `to start`(→ "start the bleeding"), 18.4 `to watch it`(산후출혈에서 지켜보기만), 16.4 `after this contraction`(수축 사이에 힘주기). `ko`에 다 걸러지지 않는 것이 셋이다: 15.1 `Tell the doctor`(`ko`에 받는 사람이 없음), 19.1 `and you couldn't`, 13.4 `you ask for it`. 반대말 decoy도 8개 있다(6.3 `I'm certain` 등, 위험하지 않음). |
| 4 | `distractorsKo` | 4 | 정답을 뒤집거나 "안/절대"를 붙인 오답은 없다. 거의 다 같은 상황에서 실제로 할 법한 말이다. 장면과 맞지 않는 것은 5.1·5.4의 '아기 심박'(자궁외임신 의심 장면) 둘이다. 같은 문구가 여러 문장에 되풀이된다(`이름이 어떻게 되세요?` 3번 등 16묶음, 사소). |
| 5 | `order` | 3 | 앞 줄을 가리키는 말로 묶는 설계는 잘 지켰다. `If`로 시작하는 줄은 없다. 문제는 임상 흐름이다. S17은 인과가 거꾸로다(배가 딱딱해서 혈압이 떨어진다). S19는 도플러로 심박을 못 찾은 것만으로 사망을 확정한다. S14는 배가 딱딱해서 수술실로 간다. S9·S12는 모든 환자에게 하는 검사를 답에 따라 하는 것처럼 묶었다. S1은 소변 검사로 주수를 안다고 한다. 그 밖에 S4 기록 대상, S5·S16 영어, S0 16단어가 있다. 인접 교환이 경계선인 카드는 3장이다(S2·S10·S20). |
| 6 | `tag`·`icon` | 4 | 태그가 역할을 말하고 상황 안에서 일관된다. 사소한 것: 10.3 `가족 통역 X`(라틴 X), S8 7문장 중 6문장이 `shield`. |
| 7 | context `word`·`ko`, swap `ko` | 4 | swap `ko` 8건은 모두 정답 문장의 뜻이다. context 13건 모두 `word`가 세 장면에 있다(W14 0건). 고칠 것: S15 차트의 끼워 넣은 `r/o eclampsia`(경련이 없는 환자 — 용어가 맞지 않음), S17 `hypotensive` why("공포만 커진다"는 바뀌기 전 `crashing` 설명이 남은 것). |
| 8 | 파일럿 갈래 | 4 | (1) 선택지 아이콘: 없다(T8). (2) 동떨어진 빈칸 오답이 거의 없고 같은 분야에서 골랐다. 부사 묶음이 되풀이된다. (3) `And`·`Then` 연결어가 없다. 경계선 교환 3장. (4) 임상 순서: S17·S19·S14 고칠 것. (5) 위험 decoy 4개, `ko`에 가까운 decoy 3개. |

## 사실 오류·심각한 문제

1. **S19 L2→L3 — 도플러만으로 사망 확정.** L2 `we're not able to find it`(장면 tagline: "Why can't you find the heartbeat? Please, keep looking.") 바로 다음이 L3 `That means your baby has died`다. 도플러로 심박을 못 찾는 것은 태아 사망의 근거가 아니다. 태아 사망은 초음파로 확인하고(보통 의사가) 그 뒤에 알린다. 학습자가 "심박을 못 찾으면 = 사망 고지"로 외우면 안 된다.
2. **S17 L2 — 인과가 거꾸로.** `That's because your belly is rigid and very tender`는 혈압이 떨어지는 이유를 딱딱한 배라고 말한다. 둘 다 복강 내 출혈의 결과다. 카드 why("그 이유(딱딱한 배)")도 같다.
3. **S14 L4 — `Because of that tightness, we're getting you to the operating room`.** 응급 제왕절개의 근거는 출혈량·산모 불안정·태아 상태다. 자궁이 딱딱한 것만이 근거가 아니다. 같은 상황 14.5 why("출혈이 많거나 태아가 위험하면")와도 어긋난다.
4. **decoy 조립이 위험한 지시가 되는 것**(브리프 "decoy를 반대말로 만들기"):
   - 5.5: 파열 의심 환자에게 `…gets much worse ask a friend right away`
   - 17.5: `The surgeon is on the way to start the bleeding inside`
   - 18.4: 산후출혈에서 `so we need to watch it contract`(지켜보기만 함)
   - 16.4: `Give me one more big push after this contraction comes`(수축 사이에 힘주기)

(심각 목록 밖이지만 고칠 것) S15 context 차트 장면의 `r/o eclampsia`는 저작자가 W14를 맞추려고 끼워 넣은 말이다(base에는 없었음). 자간증은 경련이 있어야 붙는 진단이라, 경련이 없는 환자의 차트에 `r/o`로 쓰는 것은 맞지 않다(C1). 6.3 why "간호사는 … 가능성으로 전해요"는 틀린 말이 아니지만 불완전하다. 진단 고지는 보통 의사가 하고 간호사가 함께 있는 틀로 보강한다(W1). S19도 같은 틀로 맞춘다(W1b).

## 저작자 자기 보고 3건 판정

### 1. 정말 조건부라 `If`로 둔 줄(부종·시야 이상), `treating it now` 빈칸을 `high`로 옮긴 것
- order 21장에 `If`·`If so`·`In that case`로 시작하는 줄은 **하나도 없다.** S15 카드에도 부종·시야 줄은 없다(혈압 → 약 → 조용한 방 → 두통 악화 시 알림).
- 남은 조건문은 5.2·5.5·15.1·S5 L4·S15 L4다. 모두 "~하면 바로 알려 주세요"라는 환자 알림 지시라 정말 조건부다. 모든 환자에게 하는 처치를 조건에 묶은 것이 아니다 → **그대로 둬도 된다.**
- 15.3(부종)·15.4(시야)는 조건 없이 묻는 문진이고, tagline("seeing spots")과도 맞다.
- 시간으로 묶은 줄(S17 L4 `With those fluids and blood going in`)은 수술을 미루지 않고 동시에 진행한다는 뜻이라 괜찮다.
- 다만 같은 눈으로 보면 **답이나 병력에 묶은 줄**이 둘 있다. S9 L4 `Based on your answers, we'll do an ultrasound first`, S12 L4 `With that history, we'll do a swab test`다. 둘 다 모든 환자에게 하는 검사라 고칠 것에 넣었다.
- 15.0 빈칸을 `high`로 옮긴 것: **타당하다.** `low/normal/steady`는 같은 분야의 틀린 말이고 `ko` "높아서"가 거른다. 위험한 처치를 보이지도 않는다.

### 2. 태아 사망 고지 선택지(`has passed`·`is gone`), base `en`↔`ko` 어긋남
- **선택지가 상처가 되는가**: `has passed`·`is gone`은 가족도 흔히 쓰는 완곡어라 그 자체로 잔인하지 않다.
  - 그러나 세 번째 오답 `is lost`는 '없어졌다'(아기를 잃어버렸다)로도 읽혀 혼란스럽고 상처가 될 수 있다.
  - 더 큰 문제는 두 가지다. ① `ko` "아기가 사망했어요"는 `has passed`로도 맞아, `ko` 기준으로 **정답이 둘**이다. ② 같은 상황 swap이 `has died / has passed / is gone`을 그대로 가르친다(중복).
  - → **사용자 판단**(B6): 현행 유지(`is lost`만 교체 검토) 또는 빈칸을 `so very sorry` 쪽으로 옮기기. 태위·하강 같은 대체어는 사망 고지 장면에서 농담처럼 읽혀 권하지 않는다.
- **19.5 `en` "nothing you could have done to cause this" ↔ `ko` "어떻게 해도 막을 수 없었던"** — 어긋남이 맞다. `en`은 "당신이 일으킨 것이 아니다", `ko`는 "막을 수 없었다"다.
  - 고칠 쪽은 **`ko`**다. 사산은 원인에 따라 막을 수 있었던 경우도 있어 "아무것도 막을 수 없었다"를 단정하면 사실이 아닐 수 있다. "당신이 한 일 때문이 아니다"가 사망 고지 교육이 권하는 말이다(S19 L4 `Nothing you did caused…`와도 맞음).
  - 19.5는 keyPhrase가 아니다. → 결정 11: `ko`를 `당신이 한 어떤 일도 이 일의 원인이 아니에요`로.
  - 같은 꼴의 6.5 `…to prevent this` / `막을 방법은 없었어요`는 서로 맞다(초기 유산은 대부분 염색체 이상이라 사실로도 괜찮음).

### 3. context 정비 4건(GA, ROM, hypotensive, sepsis)과 그대로 둔 9건
- base와 diff해 보면 **장면이 바뀐 문항은 7개**이고 그대로인 것은 6개다. 보고에 없던 3건은 S2 `LLQ`(보고 장면 `left lower quadrant`→`LLQ`), S4 `G3P2`(띄어쓰기), S15 `eclampsia`(차트에 `r/o eclampsia` 추가)다.
- **GA** — 받아들인다. 차트 `GA 8 wks by LMP`는 자연스럽다. 환자에게 `What's your GA?`는 듣는 사람에게 맞지 않아 어색한 것이다. 보고 장면 `Her GA is about eight weeks…`는 말로는 `she's about eight weeks`가 더 흔해 약간 억지스럽지만 틀린 영어는 아니다(낮음). base는 `gestational age`가 어색한 장면에만 있던 모양이라 고친 방향이 맞다.
- **ROM** — 받아들인다. `possible ROM`은 구두 보고에서 쓰인다. `Did you have ROM?`는 환자에게 맞지 않아 어색한 것이다.
- **hypotensive** — 장면은 받아들인다. `You're hypotensive.`는 문법이 맞다(review-ctx-B의 `Your BP is hypotensive`와 다름). 그러나 **why가 바뀌기 전 `crashing` 설명을 그대로 이어 썼다.** "그대로 하면 공포만 커지니"는 crashing에 맞는 말이고, hypotensive는 무섭기보다 환자가 못 알아듣는 말이다 → 고칠 것.
- **sepsis** — 받아들인다. `I'm worried about sepsis` ✓. `You have sepsis.`는 진단명을 단정해 던지는 어색함이라 교훈에 맞는다.
- **LLQ** — 받아들인다(구두 보고에서 `L-L-Q`를 말로 씀).
- **G3P2** — 문제없다.
- **eclampsia** — 차트 한 군데만 고칠 것(C1). 보고 `I'm worried about eclampsia`와 환자 `You're at risk for eclampsia`는 경련 위험을 걱정하는 말이라 용어가 맞다. 끼워 넣은 차트 `r/o eclampsia`만 틀렸다.
- **그대로 둔 6건**(`LMP`·`ectopic`·`LR`·`rebound`·`abruption`·`boggy`) — 모두 같은 임상어가 세 장면에 있고, 환자 장면만 듣는 사람에게 맞지 않는 핸드오프 `deteriorate` 모양이다. 그대로 둔 것이 맞다.

## 고칠 것 (v46 필드)

### order (10장 + 선택 5) — 줄을 고치면 카드 `why`도 바뀐 연결어를 가리키게 함께 고친다
- **O1 · S19 L2**(사실 1) `I'm so deeply sorry — we're not able to find it.` → `I'm so deeply sorry — the ultrasound shows it has stopped.`
  - 줄 ko: `정말 안타깝습니다, 초음파에서 심박이 멈춘 것이 보여요`
  - 카드 why "심박을 찾지 못했다는 사실을 말하고"를 "초음파로 확인한 사실을 말하고"로.
- **O2 · S17 L2·L3**(사실 2)
  - L2 → `That's because you may be bleeding inside — your belly is rigid and very tender.`(14단어, ko `배 안에서 출혈이 있을 수 있어서예요, 배가 딱딱하고 아주 아파요`)
  - L3 → `To replace what you're losing, we're giving you fluids and blood.`(ko `잃고 있는 만큼 채우려고 수액과 혈액을 드려요`)
  - 카드 why: "혈압이 떨어진다고 알리고, 그 이유(배 안의 출혈)를 설명하고, 잃는 피를 수액과 혈액으로 채우며, 그것이 들어가는 동안 수술실로 모셔요. 'That's because'·'what you're losing'·'those fluids and blood'가 앞 줄을 가리켜요."
- **O3 · S14 L4**(사실 3) `Because of that tightness, we're getting you to the operating room quickly.` → `With bleeding like this, we're getting you to the operating room quickly.`
  - ko `이렇게 출혈이 많아서 빠르게 수술실로 모실게요`. 카드 why의 'that tightness'도 함께 고친다.
- **O4 · S9 L4** `Based on your answers, we'll do an ultrasound first…` — 초음파는 답과 상관없이 첫 영상이다 → `After that exam, we'll do an ultrasound first, since it's safest for the baby.`(14단어, ko `그 진찰 다음에, 아기에게 가장 안전한 초음파부터 할게요`)
- **O5 · S12 L4** `With that history, we'll do a swab test…` — 분비물이 있으면 병력과 상관없이 면봉 검사를 한다 → `Whatever the answer, we'll do a swab test to find out exactly what's causing this.`(ko `답이 어떻든, 정확한 원인을 찾으려고 면봉 검사를 할게요`). 카드 why의 'that history'도 고친다.
- **O6 · S1 L4** `That date and the test will help us figure out how far along you are.` — 소변 임신 검사(정성)는 주수를 알려 주지 않는다 → `If it's positive, that date helps us figure out how far along you are.`
  - 주수는 임신일 때만 의미가 있어 정말 조건부다. ko `양성이면 그 날짜로 임신 주수를 알아볼 수 있어요`.
- **O7 · S4 L3** `Do you have records from that pregnancy with you?` — 이 장면에서 필요한 것은 이번 임신의 산전 기록이다(base 4.2 `your prenatal records`) → `Do you have prenatal records for this pregnancy and that one with you?`(ko `이번 임신과 그 임신의 산전 기록을 가지고 계신가요?`)
- **O8 · S5 L4** `Scan or no scan, …` — 초음파를 안 할 수도 있다는 말로 들리고 영어도 어색하다 → `During and after that scan, tell me immediately if the pain or dizziness gets worse.`(15단어, `that scan`이 L3을 가리킴). 카드 why도 고친다.
- **O9 · S16 L2** `You've done so well the head is showing — …` 비문(`that` 빠짐) → `You've done so well — the head is showing, so please stop pushing for a moment.`(15단어)
- **O10 · S0 L4** 16단어(카드 폭 초과) → `Thanks for all that — we'll check on you and the baby right away.`
- 선택(낮음):
  - S2 2↔3 교환(`How long has it been like that?`이 L1 뒤에도 붙음)이 경계선이다 → L3 `How long has that kind of pain been there?`
  - S10 3↔4 교환이 경계선이다(L3이 질문이 아니라 `For each question`이 앞뒤 어디에나 붙음).
  - S20 3↔4 교환이 경계선이다(`Those fluids`가 L2를 가리킨 채 맨 끝에도 옴).
  - S7 L3 `Either way`는 앞 줄(횟수 질문)이 양자택일이 아니다 → `Whatever the number, …`.
  - S18 L3 `With your uterus that soft, how much blood have you lost…`는 물렁한 자궁이 질문의 이유가 되지 않는다. 활동성 산후출혈에서 출혈량은 패드 무게로 잰다(QBL) → `While we do that, we're weighing the pads to measure how much blood you've lost.`(15단어)

### decoy (8)
- D1 · 5.5 `ask a friend` → `on the monitor`(어느 자리에 넣어도 비문)
- D2 · 17.5 `to start` → `to the OR`
- D3 · 18.4 `to watch it` → `your bladder`
- D4 · 16.4 `after this contraction` → `with your legs`
- D5 · 6.3 `I'm certain`(반대말, 단정 진단) → `in the chart`
- D6 · 15.1 `Tell the doctor`(`ko`에 받는 사람이 없어 걸러지지 않고, 알림도 늦어짐) → `or any itching`(`or more headache` 자리, `ko` "두통"이 거름)
- D7 · 19.1 `and you couldn't` → `…and you couldn't do anything wrong`이 `ko` "아무것도 잘못하지 않으셨어요"에 가깝다 → `at the clinic`
- D8 · 13.4 `you ask for it` → `The sooner you ask for it, the more effective it is.`가 `ko`와 거의 같다(낮음) → `, the cheaper`
- 반대말 decoy(위험하지 않음, 낮음 — 고칠 때 같은 분야의 다른 대상으로):
  - 0.4 `, or lighter` → `, or clotted`
  - 1.0 `to the day` → `in your diary`
  - 3.2 `to hurry you` → `to test you`
  - 6.6 `just outside` → `with your chart`
  - 7.3 `less than` → `at night`
  - 14.1 `is in the lobby` → `is on the phone`
  - 18.2 `is in the hall` → `is on the radio`
- 중복 decoy 6쌍(`in your back`·`for the doctor`·`to write down`·`to explain`·`to help the doctor`·`since the visit`)은 사소하다.

### 빈칸 (blank, 6문장 + 사용자 판단 1 + 묶음)
`ko`로 다 걸러지지 않아 정답이 둘이 될 수 있는 것:
- B1 · 0.4 `staining` ≈ `ko` "소량의 반점성 출혈" → `clots`(`spotting*/discharge/leaking/clots`)
- B2 · 6.6 `sitting/waiting right here with you` ≈ `ko` "곁에 있어 드릴게요" — 동사 동의어가 많다(파일럿 2c) → 빈칸을 `right here`로 옮김: `right here*/out front/at the desk/down the hall`
- B3 · 9.3 `spread` ≈ `ko` "옮겨갔는지" → `eased`
- B4 · 12.3 `any other sexual partners recently` ≈ `ko` "새로운" → `long-term`
- B5 · 16.0 `ko` "제가 바로 옆에서 도와드릴게요"에 '분만'이 없어 `help you relax`도 맞음 → 빈칸을 `right here`로 옮김: `right here*/at the desk/down the hall/out front`(또는 결정 11로 `ko`에 '분만' 추가)
- B6 · 19.4 `has passed` ≈ `ko` "사망했어요"이고 swap과 중복이다(자기 보고 2). 좋은 대체어가 사실상 없어 **사용자 판단**으로 둔다. (a) 현행 유지: swap과 같은 교훈을 두 유형에서 되풀이하는 것으로 받아들이되, `is lost`만 비완곡어 오답으로 바꾼다. (b) 빈칸을 `sorry` 쪽으로 옮긴다. 태위·하강 어휘(`has turned`·`has dropped`)는 사망 고지 낱장에서 농담처럼 읽히니 쓰지 않는다(core-family 13.1과 같은 꼴).

틀린 사실을 이끌 수 있는 것(낮음):
- B7 · 15.5 `stop/treat a seizure` — 황산마그네슘은 자간증 경련의 치료제이기도 하다. `ko` "예방"이 걸러 주니 선택지는 둔다. why의 "이미 시작된 경련을 멈추는 것이 아니라 막는 것"은 끝에 "(경련이 나면 같은 약을 더 써요)"를 붙인다.

되풀이 묶음(낮음):
- 방식 부사 `quietly`가 8문장(3.4 5.4 9.2 10.5 11.2 14.5 16.1 17.2)에 나온다. 그중 넷을 바꾼다.
  - 5.4 `quietly` → `slowly`
  - 9.2 `quietly` → `cheaply`
  - 11.2 `quietly` → `occasionally`
  - 14.5 `quietly` → `eventually`
- 그 밖에 `swelling` 6, `vitamins`·`nausea` 4는 `ko`가 걸러 주니 둔다.
- 4.3 `married`, 7.3 `sneezing/hiccuping`, 8.3 `receipts`는 동떨어진 편이다(낮음, 선택).

### distractorsKo (3문장 + 낮음)
- K1 · 5.1 `아기 심장 소리를 들어 볼게요` — 자궁외임신 의심(초기) 장면에 맞지 않는다 → `소변으로 임신 검사를 먼저 할게요`
- K2 · 5.4 `아기 심박을 확인해 볼게요` — 같은 이유 → `정맥 주사를 두 군데 잡을게요`
- K3 · 4.4 `진료 기록은 어디에서 받으셨나요?` — 하지 않는 말 → `지금 드시는 약이 있나요?`
- 낮음:
  - 15.2 `혈압을 계속 다시 재 볼게요`(어색한 한국어) → `혈압을 15분마다 잴게요`
  - 3.4 `검사 컵은 화장실에 있어요`는 3.1 `소변 컵은 화장실에 있어요`와 겹친다 → `결과는 보통 몇 분이면 나와요`
  - 14.1·17.1의 오답 쌍이 같다(`숨을 깊게 쉬어 보세요`·`이름이 어떻게 되세요?`, 18.1에도 하나) — 하나만 바꾼다: 17.1 → `수술실에 연락해 두었어요`

### why (3 + 다른 항목과 같은 것 2)
- W1 · 6.3(보강) → "Based on…으로 근거를 먼저 말하고 I believe로 단정을 피해요. 유산 진단과 고지는 보통 의사가 하므로, 간호사는 의사가 설명한 내용을 이어 받거나 함께 있을 때 이렇게 말해요."
- W1b · 19.4 why에도 같은 틀을 한 줄 덧붙인다(일관성): "… 사망 확인과 고지는 보통 의사가 초음파로 확인한 뒤 하고, 간호사는 곁에서 같은 말을 분명히 이어 가요."
- W2 · S17 카드 why → O2와 함께.
- W3 · 8.3(증거 보존, 선택이지만 권함) → 둘째 문장 뒤에 덧붙인다: "증거 채취를 원할 수도 있으니 정하기 전까지 씻거나 옷을 갈아입지 않도록 부탁하고, 검사는 보통 성폭력 전담 간호사(SANE)가 해요."
- W4 · 15.5 → B7과 함께.

### context `word`·`ko` (2)
- C1 · S15 `eclampsia` 차트 장면만 → `BP 168/112, HA, visual changes; high risk for eclampsia, seizure precautions.` `word`·`ko`·보고·환자 장면·fix·why는 그대로 둔다.
- C2 · S17 `hypotensive` why → "hypotensive(저혈압의)는 의료진끼리 쓰는 말이라 환자는 알아듣지 못해요. 환자에게는 무슨 일인지와 무엇을 하고 있는지를 쉬운 말로 함께 말해요."
- (낮음) S0 보고 장면 `Her GA is about eight weeks…` → `GA's about eight weeks by her last period — bleeding since six this morning.`처럼 더 말투답게(선택).

### tag·icon (2, 낮음)
- 10.3 tag `가족 통역 X` → `가족 통역 안 함`(9자)
- S8 아이콘: 7문장 중 6문장이 `shield`라 단조롭다. 8.1 → `handshake2`, 8.5 → `speech` 정도(선택).

## 결정 11 · base 보고 (v46 범위 밖, 고치지 않고 보고만)
- **19.5 `ko`** — `en` "nothing you could have done to cause this" ↔ `ko` "어떻게 해도 막을 수 없었던". 고칠 것은 `ko`다 → `당신이 한 어떤 일도 이 일의 원인이 아니에요`(keyPhrase 아님). 위 자기 보고 2.
- **6.3 `en`**·**19.4 `en`**·S19 L3 — 간호사가 진단(유산·사망)을 전하는 문장이다. 미국 실무에서는 의사가 확인하고 고지하며, 간호사는 함께 있거나 이어 받는다. 문장은 두고 why로 틀을 보강했다(W1·W1b). 6.3을 `I'm worried this may be a miscarriage — the doctor will talk with you about it.`로 바꿀지는 사용자 판단이다(swap `before`도 함께 바꿔야 함).
- **8.3 `en`** `Would you like to have an exam and collect evidence, or not?` — 증거를 모으는 사람이 환자처럼 읽힌다. order L3의 `an exam and evidence collection`이 더 정확하다(낮음).
- **15.1 `en`**(keyPhrase라 못 바꿈) `…feel a seizure coming or more headache` — 자간증 경련은 전조 없이 오는 경우가 많고, `more headache`도 어색하다. 보고만 한다.
- **`words: []`인 문장 3개**: 6.0, 15.4, 19.2(v44부터).
- **청크가 구를 끊는 것**(보고만): 17.1·18.1 `Stay with / me`, 4.1 `in your / last pregnancy`, 10.4 `about your / pregnancies`, 6.5·19.5 `nothing you could / have done`.
- **특히 보라고 한 산과 안전 항목 — 틀린 곳 없음**:
  - 임신 가능성 확인: 1.1 why와 S1 L3(예든 아니오든 소변 검사)이 맞다.
  - 좌측위(반듯이 눕히지 않기)·Rh 면역글로불린: 이 주제 어디에도 나오지 않는다. 틀린 곳도 없다. 넣으려면 S14 why·S5/S7 why 보강감이다(선택).
  - 파열·박리·자간증·산후출혈에서 산과 호출과 처치를 미루는 order 줄이나 빈칸은 없다. 위험한 것은 decoy 조립뿐이다(위 D1~D6).
  - 성폭력: 동의·중단권·신고 선택은 정확하다. 증거 보존은 빠졌다(W3).

## 고칠 것 개수
- order 10장 · decoy 8 · 빈칸 6문장(B1~B5 + B7; B6는 사용자 판단) · distractorsKo 3 · why 3(W1·W1b·W3; W2·W4는 O2·B7과 같은 항목) · context 2 · tag 1
- **합계 33** (그중 사실·안전: S19 L2, S17 L2·why, S14 L4, 위험 decoy 4[5.5 17.5 18.4 16.4])
- 사용자 판단: B6(19.4 빈칸), 6.3 `en`
- 선택·낮음: order 5, 반대말 decoy 7, 부사 묶음 4, distractorsKo 3, S0 GA 보고 장면, S8 아이콘, 동떨어진 빈칸 오답 3
- 결정 11 보고 6(그중 19.5 `ko`는 고치기를 권함)

## 종합
문장 `why`·`distractorsKo`·빈칸은 ER 주제 중 좋은 편이다. 위험한 처치를 선택지로 보인 문장이 없고, 오답 뜻도 같은 상황에서 할 법한 말이다. 고쳐야 하는 것은 order 세 장의 임상 논리(S19 도플러만으로 사망 확정, S17 인과 거꾸로, S14 수술 근거)와 조립하면 위험한 지시가 되는 반대말 decoy 4개다. 그 밖에 끼워 넣은 차트 `r/o eclampsia`, 19.5 `ko` 어긋남도 고친다. 위 목록을 반영하고 V18·V19를 다시 통과시키면 내보내도 된다.
