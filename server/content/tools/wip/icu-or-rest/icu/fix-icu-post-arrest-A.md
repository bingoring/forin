# fix-icu-post-arrest-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번)

대상: `icu-post-arrest.yaml`(A·B 합친 파일, 단어 216 · 상황 21 · 문장 127). 비교: base·changes·in·notes A(B 메모 없음).
뉘앙스 종류: slider 19 · pair 2 · context 20 · swap 1 · reel 0. context 20개는 모두 핸드오프 모양(`word`·`ko`·장면 3·`ok:false` 1·`word`가 세 장면 `en`에 다 있음)을 스크립트로 확인함.
스크립트로 전부 뽑아 본 것: 단어 216개 필드 표, 문장 127개 chunks, pair 2개의 모든 결합(왼쪽 × 오른쪽 전부+decoy), swap 선택지 3개 이어 읽기, 길이 규칙(오답 en·ko 전부 — 위반 0), cue에 정답 영어(0), 은행 단어끼리 같은 ko(0).

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 소리·철자가 닮은 오답은 좋지만 품사가 다른 오답이 약 55개. `cardioverter`(제세동기와 같은 기계), `morrow`(tomorrow의 옛말 — 같은 뜻) |
| 2 distractorsKo·길이 | 4 | 길이 위반 0. `w-abcs` 오답 '의식-동공-반응(AVPU)'은 AVPU의 뜻이 틀림 |
| 3 cue | 4 | ko를 그대로 되풀이한 cue 5개(seizure '발작'·maintenance '유지'·organ '장기'·exam '진찰'·test '검사') |
| 4 chips/decoyChips | 4 | `bra`(정답 조각)·`nuts`·`slob`·`sob`·`kiss`·`fool`이 심정지·가족 상담 단어에 섞임 |
| 5 뉘앙스 사실 | 3 | 라벨 없는 드립에 "라벨부터 붙임", 32도를 '깊은 저체온'이라 함(목표체온 냉각 중 서맥은 흔함), "comfort measures"(연명 중단 뜻), 단형 VT를 "불규칙"하다고 함, 재가온 속도를 AHA 출처로 단정 |
| 6 뉘앙스 설계 | 3 | pair 2개 모두 정답이 둘(`send a potassium`·`watch for hyperkalemia`), swap `a excellent`(관사로 걸러짐), 예후 불량 상황의 slider 정답이 "아직 모른다"라 상황과 모순 |
| 7 결정 11 | 4 | 변경 목록은 대체로 타당. `w-tight` ko '팽팽하게'를 그대로 둠(뜻이 틀림), `w-outcome` '경과'는 outcome의 뜻이 아님, 쉬운 `tomorrow`가 남음 |

## 사실 오류·심각한 문제

1. **[안전] 5.4** `Blood pressure dropped a bit, so I bumped the pressor.` — 승압제를 처방(적정 지시) 언급 없이 혼자 올린 말로 읽힙니다. 같은 상황 slider가 이 문장을 `ex`로 쓰는데, slider는 "환자를 보고 의사에게 알린다"를 가르쳐 서로 어긋납니다.
2. **[안전] 9.3** `His MAP dipped below sixty, so I'm titrating up now.` — 같은 상황 keyPhrase 9.0·slider `why`·`w-map` cue가 모두 MAP 65 이상을 목표로 합니다. 60을 기준으로 가르치면 60~64를 그냥 두게 됩니다.
3. **[안전] 상황 8 slider** — 라벨 없는 드립에 정답이 `label it before we roll`, `why`가 "라벨을 붙이고 확인해요"입니다. 무슨 약인지 모르는 드립에 라벨부터 붙이면 짐작으로 붙이게 됩니다. 순서는 **줄을 따라가 펌프·처방과 대조해 확인 → 라벨**이고, 확인이 안 되면 쓰지 않습니다.
4. **상황 17 slider** — 단서 "32도에서 맥박 38"에 `why`가 "깊은 저체온에서는 서맥이 올 수 있어서"입니다. 32~36도 목표체온 냉각은 깊은 저체온(28도 미만)이 아니고, 이 범위의 동서맥은 흔하며 혈압이 유지되면 보통 지켜봅니다. 단서에 혈압 정보가 없는데 정답이 "가온 상의"라서, 모든 서맥에 가온을 고려하는 것으로 배웁니다.
5. **상황 18(예후 불량 가족 상담) slider·문장 18.4** — keyPhrase 18.1이 "검사가 의미 있는 회복 가능성이 낮음을 가리킨다"고 말한 상황인데 slider 정답과 18.4가 "아직 알기 이르다"입니다. 같은 대화에서 두 메시지를 주면 가족이 헛된 희망을 붙듭니다(나쁜 소식 전달에서 피하라는 '섞인 메시지').
6. **context 19 `fix`** — 뇌사 고지를 "his brain has stopped working"으로 끝냅니다. 뇌사는 법적 사망이고, 이 지시서 자체가 사망 고지에서 "died"를 한 번은 분명히 말하라고 정합니다. 가족은 "뇌가 멈췄다"를 아직 살아 있다로 이해하기 쉽습니다. 같은 문항 ok 장면 `Two physicians must confirm…`도 미국 성인 기준(AAN 2023)은 의사 1인 1회 검사로 충분하고 2인은 주·병원 정책이라 "must"가 과합니다.
7. **context 4 어색한 장면** `Comfort measures include…` — 미국 병원에서 "comfort measures"는 연명 치료를 멈추고 편안함만 돌보는 것(comfort care)을 뜻합니다. 가족에게 이 말을 쓰면 뜻이 달라져서, "같은 뜻·안 맞는 자리" 원칙에도 어긋납니다.
8. **context 17 `fix`·`why`** — 정답 장면이 단형(monomorphic) VT인데 `fix`가 "fast and irregular", `why`가 "빠르고 불규칙해져"입니다. 단형 VT는 빠르고 **규칙적**입니다.
9. **20.4** `This decision belongs to your family, and we'll support whatever you choose.` — 지킬 수 없는 약속이고(법·윤리 범위 밖 요구도 '지지'한다는 말), 같은 상황 keyPhrase 20.1 "그분이 원했을 것에 집중"(대리 판단)과도 어긋납니다. 저작자 메모 A의 지적이 맞습니다.
10. keyPhrase **17.0** `Deep hypothermia is causing bradycardia and now VT.` — 위 4번과 같은 사실 문제(아래 keyPhrase 절).

## 고칠 것

[안전]을 붙인 것이 안전 항목입니다. 문장을 새로 쓰면 **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo·blank)를 전부 새로 쓰고**(distractorsKo 둘은 새 ko 틀에 맞춰), 바뀐 `words`는 `changes-icu-post-arrest.yaml`에 적으세요. 그 문장이 어떤 은행 단어의 `example`·`exKo`이거나 slider의 `ex`·`exKo`이면 그것도 새 문장으로 바꿉니다.

### A. 문장 (keyPhrase 아님)

1. **[안전] 상황 "지속 심전도·혈역학 감시" 5.4** — 처방 없이 승압제를 올리는 말(저작자 메모 A, 타당).
   - en: `Blood pressure dropped a bit, so I titrated the pressor up per the order.`
   - ko: `혈압이 조금 떨어져서 처방 범위 안에서 승압제를 올렸어요.`
   - chunks: `Blood pressure dropped / a bit / , so I titrated / the pressor up / per the order / .`
   - words: `[w-bloodpressure, w-drop, w-pressor, w-titrate]` (w-titrate 더함). v46 필드 전부 새로.
   - **딸린 것:** `w-pressor` example·exKo를 새 문장으로. 상황 5 slider의 `ex`·`exKo`는 이 문장 대신 5.1 `Watch for any rhythm change or dropping pressure.` / `리듬 변화나 혈압 하강을 살피세요.`로(slider는 "보고 알린다"를 가르침).
2. **[안전] 상황 "ROSC 후 혈역학 목표 유지" 9.3** — MAP 기준 60이 목표 65와 어긋남.
   - en: `His MAP dipped below sixty-five, so I'm titrating up now.`
   - ko: `MAP가 65 밑으로 떨어져서 지금 올리고 있어요.`
   - chunks: `His MAP dipped / below sixty-five / , so I'm titrating up / now / .`
   - words 그대로. v46 필드 전부 새로(blank를 숫자에 두려면 오답 숫자가 정답이 되지 않게). 상황 9 slider `ex`·`exKo`도 새 문장으로.
3. 상황 "재관류 PCI 이송·조율" 8.5 — 삽관 환자 이송 중 기도는 보통 호흡치료사(RT)가 맡고 간호사는 모니터·드립을 봅니다(저작자 메모 A, 타당 — 업무범위).
   - en: `I'll watch the monitor and drips while RT manages the airway during transport.`
   - ko: `이송하는 동안 호흡치료사가 기도를 맡고, 저는 모니터와 수액을 지켜볼게요.`
   - chunks: `I'll watch / the monitor and drips / while RT manages / the airway / during transport / .`
   - words: `[w-monitor, w-drip, w-airway, w-transport]`. v46 필드 전부 새로.
4. 상황 "연명과 중단 윤리 갈등" 20.4 — 지킬 수 없는 약속, 20.1과 어긋남(저작자 메모 A, 타당).
   - en: `You don't have to choose alone, and we'll support your family through this decision.`
   - ko: `혼자 고르지 않으셔도 돼요. 이 결정을 내리는 동안 저희가 가족분들 곁에 있을게요.`
   - chunks: `You don't have to / choose alone / , and we'll support / your family / through this decision / .`
   - words: `[w-choose, w-support, w-decision]`. v46 필드 전부 새로.
   - **딸린 것:** `w-belong`은 이 문장에만 있었으므로 은행에서 지우고 changes에 `word-remove`. `w-choose`·`w-support`의 example·exKo를 새 문장으로. 상황 20 서로 다른 단어는 incredibly·decision·focus·ethics·team·palliative·support·choose(+tomorrow) = 8개 이상 유지(D-5로 tomorrow를 빼도 8).
5. 상황 "TTM 목표체온 준비" 2.5 — 단위가 없어 학습자가 화씨로 읽을 수 있음(저작자 메모 A, 타당). 36도 자체는 AHA 범위(섭씨 32~37.5) 안이라 수치는 둡니다.
   - en: `Target is thirty-six degrees Celsius, and we start the timer now.`
   - ko: `목표는 섭씨 36도이고, 지금 타이머를 시작합니다.`
   - chunks: `Target is / thirty-six degrees Celsius / , and we start / the timer / now / .`
   - words 그대로. v46 필드 전부 새로(distractorsKo 둘에도 '섭씨'). (선택) context 2의 ok 장면 `cool to thirty-six degrees`도 `thirty-six Celsius`로.
6. 상황 "신경학적 예후 불량 가족 상담" 18.4 — 18.1과 모순되는 "아직 모른다"(위 5번).
   - en: `We won't rush that answer, but so far the signs are not good.`
   - ko: `그 답을 서두르지는 않겠지만, 지금까지 보이는 징후는 좋지 않아요.`
   - chunks: `We won't rush / that answer / , but so far / the signs / are not good / .`
   - words: `[w-rush, w-answer]` (w-early는 14.2에 남음). v46 필드 전부 새로. `w-rush`·`w-answer` example·exKo도 새 문장으로.
7. 같은 상황 18.5 — `We're not giving up`은 연명 치료를 계속한다는 뜻으로 들려, 치료 목표 대화(18.2)로 넘어가는 상황과 어긋납니다. 미국 완화의료 소통 교육은 '포기' 틀 대신 "계속 돌본다"(버리지 않음)로 말하라고 합니다.
   - en: `We'll keep caring for him, and we won't promise more than we know.`
   - ko: `그분을 계속 돌볼 거고, 아는 것보다 더 많이 약속하지는 않을게요.`
   - chunks: `We'll keep caring / for him / , and we won't promise / more than / we know / .`
   - words 그대로(`[w-promise]`). v46 필드 전부 새로(지금 blank `giving up`이 사라짐). `w-promise` example·exKo도.
8. 같은 상황 18.6 — 의문문인데 끝이 `.`입니다. en·chunks 끝을 `?`로(`… , so we can honor that?` / 마지막 조각 `?`). ko·나머지 그대로.
9. 상황 "발작·경련 감시" 12.3 — `flagged it`은 "(팀에) 알렸다"인데 ko가 "표시해 뒀어요"라 행동이 달라집니다(같은 상황 slider는 "바로 의사에게 보고"). en 그대로, ko만:
   - ko: `조금 전 눈 씰룩거림이 보여서 바로 알렸어요.` distractorsKo 둘도 새 ko 틀로 다시. 상황 12 slider `exKo`도 같이.
10. chunks가 구를 끊은 문장(keyPhrase 아님) — 조각만 고침, en 그대로:
    - 13.3 `at three / point two`(숫자 하나를 끊음) → `His last potassium / came back / at / three point two / .`
    - 13.5 `one more / time` → `Once he's rewarmed / , I'll recheck / potassium / one more time / .`
    - 6.4 `to maintenance / mode` → `Once we hit / target / , I'll switch / to maintenance mode / .`
    - 6.5 `for the last / two hours` → `Temperature / is steady / within range / for the last two hours / .`

### B. 뉘앙스

11. **[안전] 상황 8 slider** — 선택지 `label it before we roll` → `verify it, then label it`. `why`: "라벨 없는 드립은 무슨 약인지 몰라 위험해요. 출발 전에 줄을 따라가 펌프 설정과 처방을 대조해 무슨 약인지 확인하고 라벨을 붙여요. 확인이 안 되면 쓰지 말고 처방대로 새로 걸어요. '식염수일 것'이라고 짐작하거나 나중에 붙이는 건 안 돼요."
12. 상황 17 slider — 단서 `Colleague: "His heart rate is thirty-eight at thirty-two degrees, and his MAP is down to fifty-five."`. `why`: "목표체온 냉각(32~36도) 중에는 서맥이 흔하고, 혈압이 유지되면 보통 지켜봐요. 혈압이 떨어지면 의사와 목표체온을 약간 올려 가온할지 상의해요. 계획대로만 계속하거나 진정만 늘리는 건 원인을 다루지 않아요." ('깊은 저체온'을 뺌)
13. 상황 18 slider — 척도를 진짜 저울로: `['He will be fine, I promise.', "The tests show it's very unlikely.", 'There is absolutely no chance.']`, `answerAt: 1`. `why`: "검사가 이미 나쁜 쪽을 가리킬 때 '아직 모른다'는 헛된 희망을 줘요. 가능성이 매우 낮다고 정직하게 말하되, 약속도 절대적인 단정도 하지 않아요." `ex`·`exKo`는 keyPhrase 18.1로.
14. 상황 4 slider `ex` — slider는 "진통제 먼저"를 가르치는데 `ex`가 진정 문장(4.3)입니다. → `ex` 4.4 `His pain score looks controlled on the current dose.` / `지금 용량에서 통증 점수가 잘 조절되는 것 같아요.`
15. pair 상황 3 — `send a` + `potassium`("send a potassium" — 미국 병동에서 칼륨 검사를 보낼 때 그대로 하는 말)도 맞아 정답이 둘. → 짝을 `['a full', 'metabolic panel']`로(전 결합 확인: a full temperature/potassium/the trend line 모두 안 됨). `why` 끝을 "full metabolic panel은 여러 수치를 한 번에 보는 종합 대사 검사예요"로.
16. pair 상황 11 — `watch for` + `hyperkalemia`가 keyPhrase 11.1 그대로라 정답이 둘. → 셋째 짝을 `['controlled', 'rewarming']`로, `words`에 `w-control` 더함(전 결합 확인: controlled slowly/hyperkalemia/the cooling, rewarm rewarming, rebound rewarming 모두 안 됨; decoy `the cooling` 그대로). `why`의 "(AHA는 시간당 0.25~0.5도)" → "(많은 병원 프로토콜이 시간당 0.25~0.5도)" — AHA 지침이 속도 숫자를 정해 두었다고 확신할 수 없습니다. 끝 문장은 "controlled rewarming은 속도를 정해 두고 조절하며 데운다는 말이에요"로.
17. swap 상황 18 — 선택지 `excellent`가 `a excellent`로 관사에서 걸러집니다. → `strong`(notes 키도 `strong`: "검사 결과와 반대로 헛된 희망을 줘요.").
18. context 4 — 어색한 장면 en → `His comfort target is minus two on the RASS sedation scale.`(comfort measures 삭제). `fix`·`why` 그대로.
19. context 8 — ok 장면 2 en → `Bring the bag valve; RT will manage the airway during transport.`(A-3과 맞춤). `fix` → `We're taking him to the heart lab now so the team can check for a blocked artery and open it if they find one.`(막힌 혈관이 있다고 단정·약속하지 않게).
20. context 11 — `rewarm`을 명사로 쓴 두 장면이 어색합니다("Hold the rewarm", "initiate controlled rewarm"). → ok 장면 2 `Don't rewarm him any faster until his pressure is back up.`, 어색한 장면 `We will rewarm him at zero point two five degrees Celsius per hour per protocol.`
21. context 17 — `fix` → `His heartbeat became dangerously fast, so we're treating it right away.`, `why`의 "빠르고 불규칙해져" → "위험하게 빨라져".
22. context 19 — ok 장면 1 → `Per our policy, two physicians must confirm brain death independently.` `fix` → `Two doctors have examined him separately and confirmed that his brain has completely stopped working. This means he has died. I'm so sorry.` `why` 끝에 "뇌사는 법적 사망이라 가족에게 'has died'를 한 번은 분명히 말해요."
23. context 20 — `fix` → `We'll help your family make the decision he would have wanted.` `why` 뒷문장 → "가족에게는 용어 대신, 그분이 원했을 결정을 함께 찾도록 돕겠다고 따뜻하게 전해요."(A-4와 같은 이유)
24. context 6 — 어색한 장면의 `thermoregulatory setpoint`는 시상하부의 설정점이라 냉각 장면에서 틀린 말입니다. → `His core temperature remains steady within the target band of thirty-six Celsius.`
25. context 14 — ok 장면 2 `Can you gather the result from radiology?`가 어색합니다. → `Can you pull up the result from radiology?`
26. (권함) 상황 6 slider — 자동 조절형(servo) 냉각기는 끄면 체온 조절이 멈춥니다. 선택지 `stop cooling and tell the doctor` → `check the device and tell the doctor`, `why`에 "목표 아래로 내려가면 탐침 위치와 기계 설정을 확인하고 의사에게 알려요"를 넣는 것을 권합니다.

### C. 단어

27. cue가 ko를 되풀이(뜻을 미리 보여 줌):

    | id | ko | 지금 cue의 문제 | 새 cue |
    |---|---|---|---|
    | w-seizure | 발작 | "…나타나는 발작" | 뇌의 전기 활동이 갑자기 폭주해 몸이 떨리거나 의식이 흐려지는 일 |
    | w-maintenance | 유지 | "…그 상태를 유지해 주는 단계" | 목표에 도달한 뒤 그 값을 그대로 지켜 가는 단계 |
    | w-organ | 장기 | "…일을 맡은 장기" | 심장·간·신장처럼 몸 안에서 맡은 일이 따로 있는 부분 — 기증 대상이 되기도 함 |
    | w-exam | 진찰(검사) | "…이상을 찾는 진찰" | 환자를 직접 보고 만지며 의식·반사 같은 이상을 찾는 일 |
    | w-test | 검사 | "…하는 검사 하나" | 피를 뽑거나 사진을 찍어 몸 상태를 알아보는 일 하나 |

28. `w-abcs` distractorsKo `의식-동공-반응(AVPU)` — AVPU는 의식 수준 척도(Alert·Voice·Pain·Unresponsive)라 뜻이 틀립니다. → `의식수준 척도(AVPU)`.
29. `w-defibrillator` distractorsEn `cardioverter` — 같은 기계가 제세동과 율동전환을 함께 합니다(정답 둘에 가까움). → `fibrillation`.
30. `w-tomorrow` distractorsEn `morrow` — '다음 날'이라는 옛말로 같은 뜻. → `marrow`. (D-5로 단어를 지우면 해당 없음)
31. `w-ecg` decoyChips `EKG` — 같은 검사의 다른 이름입니다(조각 하나라 지금은 건너뛰지만). → `ECT`.
32. `w-target` distractorsEn `garget`(소의 유방염, 아무도 모르는 말), `w-reading` `reeding` — 헷갈리지 않고 걸러집니다. → `gadget`, `heading`.
33. 조각·오답 중 심정지·가족 상담 단어에 섞이면 불쾌한 것(비속어·속어·상처 관점):

    | id | 조각/오답 | 왜 | 대안 |
    |---|---|---|---|
    | w-bradycardia | `bra`(정답 조각) | 속옷 | chips `[[brady, car, dia]]` |
    | w-bradycardia | `bro`(decoy) | 속어 | `broad` |
    | w-sinus | `nuts`(decoy) | 속어(미쳤다·고환) | `bus` |
    | w-slow | `slob`(decoy) | 모욕(게으름뱅이) | `blow` |
    | w-subtle | `sob`(decoy) | 흐느낌, 약어로 욕설 | `sun` |
    | w-meaningful | `fool`(decoy) | 예후 상담 단어에 '바보' | `fill` |
    | w-carefully | `fool`(decoy) | 가족 상황 단어에 '바보' | `fill` |
    | w-focus | `kiss`(decoy) | 가족 윤리 갈등 장면에 안 맞음 | `case` |
    | w-control | `troll`(decoy) | 인터넷 속어 | `trawl` |
    | w-stable | `bull`(decoy) | 속어(헛소리) | `bill` |
    | w-electrolyte | `lick`(decoy) | 어색한 신체 동작 | `lack` |
    | w-answer | `sewer`(decoy) | 하수구 | `sweet` |
    | w-ttm | `TNT`(decoy) | 폭약 | `TMT` |
    | w-honor | `horror`(오답) | 가족 상담 단어에 '공포' | `hover`(품사 표와 겹침) |
    | w-decision | `derision`(오답) | 갈등 가족 장면에 '조롱' | `revision` |
    | w-meaningful | `meaningless`(오답) | 예후 불량 가족에게 '무의미한' | `measurable` |
    | w-choose | `choke`(오답) | '숨 막히다·목 조르다' | `chase` |

    (참고 — 바꾸지 않아도 됨: `gin`·`ale`·`nun`)
34. **distractorsEn 품사가 정답과 다른 것 — 전부**(대안은 같은 품사·닮은 철자, 길이 규칙 확인함):

    | id | 정답(품사) | 다른 품사 오답 | 대안 |
    |---|---|---|---|
    | w-breathe | breathe(동사) | breadth(명사) | breach |
    | w-adequate | adequate(형용사) | advocate(명사·동사) | adjacent |
    | w-equal | equal(형용사) | equip, equate(동사) | equable, equine |
    | w-document | document(동사) | doctor(명사) | comment |
    | w-initial | initial(형용사) | initiate(동사) | inertial |
    | w-activate | activate(동사) | activity(명사) | captivate |
    | w-trend | trend(명사) | tend(동사) | trench |
    | w-team | team(명사) | tame(형용사) | tram |
    | w-probe | probe(명사) | prove(동사), prone(형용사) | prose, robe |
    | w-comfort | comfort(명사) | comport(동사) | cohort |
    | w-reposition | reposition(동사) | repetition(명사) | recondition |
    | w-drop | drop(동사) | drug(명사) | drag |
    | w-stable | stable(형용사) | staple(명사) | feeble |
    | w-steady | steady(형용사) | study(명사·동사) | speedy |
    | w-fight | fight(동사) | flight, fright(명사) | blight, slight |
    | w-transport | transport(명사) | transfuse(동사) | transcript |
    | w-meds | meds(명사) | meets, mends(동사) | meals, beds |
    | w-fluid | fluid(명사) | fluent(형용사) | flute |
    | w-arrest | arrest(명사) | resist, wrest(동사) | unrest, array |
    | w-maximal | maximal(형용사) | maxima(명사) | marginal |
    | w-harm | harm(동사) | hard(형용사) | charm |
    | w-rate | rate(명사) | rare(형용사) | rake |
    | w-slowly | slowly(부사) | lowly(형용사) | sorely |
    | w-rebound | rebound(명사) | profound(형용사), rebuild(동사) | rebate, refund |
    | w-shift | shift(명사) | sift(동사) | shelf |
    | w-subtle | subtle(형용사) | subtitle(명사) | suitable |
    | w-cell | cell(명사) | sell(동사) | gel |
    | w-lower | lower(동사) | power, tower(명사) | cower, glower |
    | w-serum | serum(명사) | serene, severe(형용사) | sebum, septum |
    | w-multiple | multiple(형용사) | multiply(동사) | multiplex |
    | w-imaging | imaging(명사) | imagine(동사) | paging |
    | w-avoid | avoid(동사) | devoid(형용사) | avow |
    | w-outcome | outcome(명사) | overcome(동사) | outcast |
    | w-soon | soon(부사) | sun, soap(명사) | still, seldom |
    | w-follow | follow(동사) | fellow(명사), hollow(형용사) | swallow, wallow |
    | w-result | result(명사) | resolve(동사) | residue |
    | w-gather | gather(동사) | rather(부사), bather(명사) | lather, tether |
    | w-clear | clear(동사) | clerk(명사) | cheer |
    | w-crash | crash(동사) | brash(형용사) | clash |
    | w-slow | slow(동사) | slot(명사) | stow |
    | w-treat | treat(동사) | threat(명사) | trust |
    | w-warm | warm(동사) | worm, farm(명사) | warn, swarm |
    | w-convert | convert(동사) | convent(명사) | convict |
    | w-point | point(동사) | pint(명사) | print |
    | w-poor | poor(형용사) | pour(동사), power(명사) | pure, prior |
    | w-rush | rush(동사) | rash(명사·형용사) | gush |
    | w-promise | promise(동사) | premise(명사) | prompt |
    | w-honor | honor(동사) | horror, honey(명사) | hover, harbor |
    | w-neurologic | neurologic(형용사) | neurologist(명사) | neuronal |
    | w-exam | exam(명사) | exact(형용사) | exile |
    | w-organ | organ(명사) | organic(형용사) | argon |
    | w-approach | approach(동사) | apparatus(명사) | appease |
    | w-focus | focus(동사) | locus(명사) | fuse |
    | w-ethics | ethics(명사) | ethnic(형용사) | ethers |
    | w-choose | choose(동사) | loose(형용사) | lose |
    | w-belong | belong(동사) | beyond(전치사) | (A-4로 단어를 지우면 해당 없음) |

### D. 결정 11 (기존 단어·문장의 가벼운 정리)

35. `w-tight`(헤드워드 tightly) ko `단단히(팽팽하게)` — 체온을 "tightly" 유지한다는 것은 '좁은 범위로 엄격하게'라는 뜻이고 '팽팽하게'는 틀린 뜻입니다. → ko `엄격하게(빈틈없이)`, distractorsKo `[느슨하게(헐겁게), 불규칙하게(들쑥날쑥)]`는 그대로 둬도 됨. exKo도 아래 새 ko로.
36. **keyPhrase 6.1의 ko만**(en 그대로): `도달하면 체온을 팽팽하게 안정적으로 유지합니다.` → `도달하면 체온을 좁은 범위에서 엄격하게 유지합니다.` distractorsKo 둘도 새 ko 틀로 다시(예: `도달하면 혈당을 좁은 범위에서 엄격하게 유지합니다.` — 단, 들리는 자리여야 하니 B 검토 기준으로).
37. **keyPhrase 1.1의 ko만**: `트로포닌과 대사 패널을 전부 보내세요.` — "full metabolic panel"은 종합 대사 패널(CMP)이지 '전부 보내라'가 아닙니다. → `트로포닌과 종합 대사 패널을 보내세요.` distractorsKo 둘도 새 ko 틀로. (B 몫 참고: 같은 문장 `why`의 "full을 붙이면 일부가 아니라 패널 전체"도 CMP 뜻으로 고치면 좋음)
38. `w-outcome` ko `경과(결과)` — 저작자 변경. '경과'는 진행 과정(course)이라 outcome의 뜻이 아닙니다. → `최종 결과`(cue "최종 상태"와 맞고, `w-result` '결과'와도 갈림). changes의 why도 고쳐 적기.
39. `w-control` ko `조절되다(제어)` — 7.2 `can help control it`은 능동입니다. → `조절하다(제어)`, distractorsKo → `[악화시키다(진행), 중단하다(멈춤)]`.
40. `w-rearrest` ko `재정지`(명사)인데 문장 5.2는 `he re-arrests`(동사)이고 distractorsEn `rearrange·rehearse`도 동사입니다. → ko `재정지되다`, distractorsKo → `[재가온되다, 재삽관되다]`.
41. `w-tomorrow` — 공통 목록의 `today`·`morning`과 같은 급의 쉬운 말입니다. 14.4·20.5에서 태그를 빼고 은행에서 지움(changes에 sentence 2건 + word-remove). 상황 14는 17개, 상황 20은 A-4를 반영해도 8개로 V3를 지킵니다.

변경 목록(changes) 판정: ko 가르기 10건 중 9건은 타당(drip·fight·level·meds·pressor·vasopressor·shift·steady·target). `w-outcome`은 38번처럼 다시. 헤드워드 2건(tight→tightly, neurological→neurologically)과 ipa는 맞음 — 다만 `w-tight`의 ko는 고쳤어야 함(35번). 쉬운 단어 제거 12건 모두 타당. 과한 변경은 없습니다.
참고(바꾸지 않아도 됨): 4.0 keyPhrase `adequately`가 형용사 헤드워드 `w-adequate`에 태그돼 있음(0.3은 형용사라 헤드워드는 그대로가 맞음). 20.3은 태그가 하나도 없는 문장이 됐음(쉬운 말만 남아서 — 문제 아님). `pain`·`brain`·`test`·`team`·`ready`도 쉬운 편이지만 확실하지 않아 두었습니다.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| 문장 | 현재 en | 문제 | 대안 en |
|---|---|---|---|
| 17.0 | Deep hypothermia is causing bradycardia and now VT. | **사실 문제.** 목표체온 냉각(32~36도)이나 그보다 조금 넘친 정도는 깊은 저체온(28도 미만)이 아닙니다. 장면은 "목표 아래로 너무 식은" 경우입니다(저작자 메모 A, 타당) | `Overcooling below our target is causing bradycardia and now VT.` |
| 6.1 | Once there, we hold the temperature tightly stable. | `tightly stable`이 어색한 영어(저작자 메모 A, 타당). ko는 36번으로 따로 고침 | `Once there, we keep the temperature tightly controlled.` (w-stable은 5.3에 남음) |
| 11.1 | Watch for vasodilation, hypotension, and hyperkalemia shifts. | `hyperkalemia shifts`가 어색함(이동하는 것은 칼륨). 뜻은 맞아 바꾸지 않아도 됨 | `Watch for vasodilation, hypotension, and potassium shifts.` |

chunks만 문제인 keyPhrase(보고만, 고치지 않음): 1.0 `to look / for STEMI`(구동사 look for를 끊음) · 11.2 `protects his / recovery`(소유격과 명사를 끊음) · 18.2·20.1 `what he / would have wanted`(주어와 동사를 끊음 — 약함).

## 저작자 메모 판정
- 2.5 단위 → 타당, A-5. 8.5 이송 중 기도 → 타당, A-3(context 8도 B-19). 5.4 bumped → 타당, [안전] A-1. 20.4 → 타당, A-4(대안은 메모의 "support your family through this decision"을 살림). 17.0 Deep hypothermia → 타당, keyPhrase 결정(slider 17도 B-12). 6.1 tightly stable → 타당, keyPhrase 결정 + ko만 D-36. 19.3 → 동의, `per policy`로 한정돼 그대로 둠(context 19의 "must"는 B-22로 같은 한정을 붙임).
- 결정 11 정리 메모 → 위 changes 판정대로.

## 개수
고칠 것 **41건**(A 문장 10 · B 뉘앙스 16(26번은 권함) · C 단어 8(품사 표와 조각 표는 각각 1건) · D 결정 11 7), 그중 **[안전] 3건**(A-1 5.4 승압제, A-2 9.3 MAP 기준, B-11 라벨 없는 드립). keyPhrase 결정 필요 3건(+chunks 보고 4곳).

## 종합
심각한 것은 처방 없는 승압제 조절(5.4), 목표와 어긋난 MAP 기준(9.3), 확인 없이 라벨부터 붙이는 slider, 예후 불량 상황에서 "아직 모른다"는 섞인 메시지, 뇌사 고지에서 "died"가 빠진 것입니다. 이것들과 pair 2개의 정답 둘을 고치고 keyPhrase 17.0을 사용자가 정하면 내보내도 됩니다. 품사 표·조각 표·cue는 기계적인 일이라 수정 담당이 한 번에 반영할 수 있습니다.
