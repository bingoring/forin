# er-seizure-loc — v46 보강 검토 (er)

대상: `er-seizure-loc.yaml` (상황 21 · 문장 127 · order 21장 · 뉘앙스 context 15 · swap 6). 문장 127개와 order 21장을 전부 봤다.
상황 번호는 파일 순서 0부터(S0 = 경련 목격 문진 … S20 = 다약물 중독 혼수), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 508줄, decoy를 청크 자리마다 바꿔 넣은 조립과 청크 사이마다 끼운 조립(약 900줄),
order 인접 교환 63가지와 줄 단어 수(모두 13단어 이하), context 15건의 세 장면에 `word`가 있는지(검사기 W14와 같은 어간 규칙),
swap 6건(정답을 넣은 문장과 `ko` 대조), decoy 중복, base와 v44 필드 비교(단어·문장·뉘앙스 모두 바뀐 것 없음, context `word`·`ko`와 swap `ko`만 더해짐).
`verify_one_theme.py`는 통과하고 W14 경고가 14건 남아 있다.

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 문법도 맞고 장면상
그럴듯해도 `ko`가 걸러 주는 오답·decoy는 괜찮은 것으로 봤다(예: 0.0 `coughing`, 2.0 `raising`, 7.0 `on`, 7.5 `change`, 13.4 `feeding/chest`, 18.0 `right`, 19.5 `vitals`).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 말하는 방식의 이유(어순·완곡·공감·안전)를 짚고 임상 사실도 맞다. 저작자가 꼽은 사실(열성 경련 예후·해열제·20주·5분·날록손 재발·Todd 마비)은 모두 맞다. 틀린 것 1건: 10.2 "혈압은 전자간증과 자간증을 가르는 핵심 수치"(자간증은 경련으로 정의된다). 오해를 부를 것: 9.2(해열이 치료의 초점이라 해서 9.5와 어긋남), 15.1(정맥 약만 첫 약처럼), 20.5(지지 치료를 "알 때까지"로 한정), 16.1(산소포화도가 떨어지면 곧 백 환기). 다듬을 것: 10.1, 12.2, 17.2. |
| 2 | 빈칸 | 3 | `ko`까지 보면 정답이 둘인 문장은 없다. 그러나 **장면과 동떨어진 오답이 약 25문장**(4.2 `shower/walk/breakfast`, 5.2 `errands/laundry`, 11.1 `loudly/politely/angrily`, 13.3 `abroad/overseas/downtown`, 14.5 `shop/sing` 등), **뒤집기만 남은 빈칸 5**(3.0 `Never`, 3.3 `Don't`, 10.2 `calling`, 15.3 `more`, 18.5 `still`), **문법으로 걸러지는 것 6**(0.1 `front body`, 0.3 `instead of it`, 1.1 `why/when you are`, 2.3·16.3 `very normal/stable`, 8.1 `never drink`, 20.3 `when/who/where he took`). |
| 3 | `decoy` | 3 | `ko`에 맞는 다른 문장이 되는 decoy 6(1.0·3.5 `wide`, 3.1 `over`, 6.5 `once`, 13.0 `drink`, 20.5 `treating`) + 경계 1(4.2 `again`). 그리고 어떤 청크 자리에도 못 들어가는 낱말 decoy를 돌려쓴다(`ever` 6, `alone` 5, `twice`·`full`·`again`·`slowly` 각 4) — 읽지 않고도 걸러져 오답 노릇을 못 한다. 좋은 것도 많다(11.3 `afterward`, 11.4 `sleeping`, 19.2 `noisy`, 4.5 `less`). |
| 4 | `distractorsKo` | 4 | 같은 상황에서 실제로 할 법한 말이 대부분이다(0.3 실금·청색증, 3.0 옷 느슨하게, 10.x 전부). 고칠 것 6문장: 정답과 반만 다른 말 3(11.2·12.2·14.1), 아무도 하지 않을 말 3(5.5·17.4·18.5). 다른 ER 주제(약 45문장)보다 훨씬 적다. |
| 5 | `order` | 2 | 21장 중 14장을 고친다. **인접 교환이 열린 카드 9장**(S0 3↔4, S4 3↔4, S6 1↔2, S9 1↔2·2↔3, S10 3↔4, S11 2↔3, S17 3↔4, 약하게 S7 2↔3·S16 3↔4), **시간·원인으로 묶어 모든 환자에게 하는 일을 한정한 줄 5장**(S8 L4 `After that`, S12 L2 `because of that`, S13 L3 `While that works`, S15 L3 `while that works`, S20 L4 `until we know more`), 임상 순서 2장(S13 환기 지원 없이 날록손부터, S15 산소를 맨 뒤 미래형으로). 15단어 넘는 줄은 없고 `ko` 머리말은 모두 카드 내용과 맞다. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 상황 안에서 일관된다(`결과 안내`·`치료 설명` 등). 아이콘이 어긋나는 것은 사소하다: 1.5 `bell`(통증 반응), 3.4 `siren`(날카로운 물건), 15.5·16.4 `gear`(마스크·백). |
| 7 | context `word`·`ko`, swap `ko` | 2 | swap `ko` 6건은 모두 정답을 넣은 문장의 뜻이고, context `ko`도 `word`의 뜻으로는 정확하다. 그러나 **context 15건 중 14건은 `word`가 세 장면 모두에 있지 않다**(TASK 9번, W14 14건). 그대로 맞는 것은 S2 `glucose`뿐이다. 그중 11건(`restraint`·`workup`·S6 `postictal`·`photopsia`·`toxidrome`·`Ask`·`benzos`·`tanking`·`normalized`·`neuroimaging`·`ingestion`)은 어색한 표현 자체라 환자·가족이 듣는 ok 장면에 넣을 수 없어 `word`를 바꿔야 하고, 3건(S0 `seizure`·S7 `nonadherent`·S11 `postictal`)은 ok 장면에 그 말을 넣으면 된다. 아래 C 표. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진 빈칸 오답 약 25문장, 관사·문법으로 걸러지는 것 6. (3) order 못 박기: 열린 카드 9장. (4) 임상 순서·사실: order 7장, why 1건(10.2). (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **10.2 why "혈압은 전자간증과 자간증을 가르는 핵심 수치라 바로 재요"** — 전자간증과 자간증은 **경련 유무로** 나뉜다(자간증 = 전자간증에 생긴 경련). 혈압은
   임신 20주 이후의 경련을 자간증으로 의심하게 하는 단서이고, 자간증 중에도 중증 고혈압 치료가 필요해서 재는 것이다. 학습자가 "혈압 수치로 자간증을 판정한다"고 믿게 된다.
2. **S8 order L4 `After that, tell me right away if you see or feel anything strange.`** — 헛것·이상 감각은 금단 섬망의 신호라 약을 받기 전이든 후든 **언제든** 바로 말해야
   한다. "약을 준 뒤에"로 한정한다(TASK 10번 시간 한정). why("After that으로 이상을 알려 달라고")도 같다.
3. **S20 order L4 `We'll keep supporting him until we know more.` + 20.5 why** — 지지 치료(호흡·순환 유지)는 원인을 알아낸 뒤에도 이어진다. 카드와 20.5 why("계속할 기간을
   정보가 모일 때까지로 잡아요")가 "그동안만" 하는 일로 가르친다. 20.5 `en`은 v44라 두고 why만 고친다(W3), 카드 L4는 바꾼다(O14).
4. **S13 order L2·L3 — 환기 지원 없이 날록손부터, 기도 평가를 "약이 듣는 동안"으로 한정** — 호흡이 느린 아편류 과량은 백밸브마스크 환기(산소)로 호흡을 먼저/함께
   지원하고 날록손을 준다(AHA). 카드는 날록손 → "그게 듣는 동안 튜브가 필요한지 확인"이라 기도·호흡 지원이 약에 딸린 일처럼 읽힌다.
5. **S15 order L3·L4 — 기도 보호를 "약이 듣는 동안"으로, 산소를 맨 뒤 미래형(`We'll give oxygen`)으로** — 지속상태 대응은 0~5분에 기도·산소·혈당부터 안정시키고
   5분이 되면 벤조디아제핀을 준다. 카드는 약 → 기도(약이 듣는 동안) → 산소(앞으로)라 산소가 늦어지는 흐름을 가르친다.
6. **S12 order L2 `I'll check your electrolytes right now because of that.`, S10 L2 `Because of that, we're checking your blood pressure…`** — 의식저하 환자의 전해질,
   임신부 경련의 혈압은 답과 상관없이 모두 잰다. "물을 많이 마신다니까 전해질을 본다"·"주수 때문에 혈압을 잰다"는 모든 환자에게 하는 검사를 답에 딸린 것으로 만든다(TASK 10번).
   S10은 산과 호출이 주수에 딸린 것은 맞으니 혈압만 떼면 된다.
7. **9.2 why "열성 경련에서는 … 열을 내리는 것이 치료의 초점이에요"** — 같은 주제 9.5 why("해열제는 열성 경련을 막지 않아요", 맞다)와 어긋난다. 부모가 "열만 잘 내리면
   경련을 막는다"고 믿으면 귀가 후 해열제를 과하게 쓰거나 경련이 다시 오면 자책한다. 해열은 아이를 편하게 하려는 것이고 초점은 열의 원인 찾기다.
8. **context `word` 14/15가 세 장면 모두에 없다** — 화면 제목 "`toxidrome`이 어색한 장면은?"이 답을 말해 버린다(어색한 장면에만 있는 말). 아래 C 표.

## 저작자 자기 보고 판정

1. **대명사·연결어에 기댄 order 카드 — 넷 다 교환에 열려 있다(둘은 뚜렷, 둘은 약하게).**
   - 발작 후 혼돈(S6) **1↔2 열림**: L1(있는 곳·일어난 일)과 L2(`You're safe here, and this confusion will pass.`)는 서로를 가리키지 않아 안심을 먼저 해도 자연스럽다. → O3.
   - 열성 경련(S9) **1↔2 열림, 2↔3 약하게**: "지금 숨을 잘 쉬어요"를 먼저 해도 자연스럽고, 9.1 why는 오히려 "지금 상태를 **가장 먼저** 전하면"이라고 가르친다(카드와 모순).
     `That kind of seizure`는 L1의 `this`만으로도 받을 수 있어 2↔3도 약하게 열린다. → O6.
   - 약물 과량(S13) **3↔4 약하게**: `After that, his breathing should improve…`를 날록손 바로 뒤에 두고 `While that works…`를 뒤에 둬도 읽힌다. L4의 `that`이 무엇(튜브 확인? 날록손?)인지도
     모호하다. 임상 흐름도 고친다(심각 4). → O10.
   - 기도 위기(S16) **3↔4 약하게**: `That way we're ready to protect his airway.`가 L2의 백 환기 바로 뒤에도 붙는다. → O12.
   - 이 넷 말고도 S0·S4·S10·S11·S17이 열려 있다(아래 O 표).
2. **`ko`로만 구별되는 빈칸 — 둘 다 그대로 둬도 된다.**
   - 0.0 `How long did the [coughing] last?`: 목격자에게 물을 수 있는 같은 분야의 사건이고, 낱장 머리의 `ko` "떨림"이 정답을 하나로 정한다. 파일럿 2(b)에 맞는 좋은 오답이다.
   - 18.0 `Can you lift your [right] arm at all?`: 왼쪽 결손 장면에서 오른팔은 바로 "같은 분야의 반대 방향"(2(a))이고 `ko` "왼팔"이 거른다. 같은 문장의 `bad arm`은 장면상 왼팔과 같은
     팔을 가리키지만 `ko`가 "왼팔"이라 역시 걸러진다(고치지 않아도 됨).
3. **`why` 임상 사실 — 모두 맞다(보탤 것 하나).**
   - 9.4 "열성 경련은 어린 시기에만 생기고 대개 자라면서 멈춰요": 맞다. 대개 생후 6개월~5세에 생기고 5~6세쯤이면 멈춘다. 재발은 약 3분의 1에서 있지만 Most가 단정을 피한다.
   - 9.5 "해열제는 열의 불편함을 줄이지만 열성 경련을 막지는 않아요": 맞다(AAP 지침). 이 사실 때문에 9.2 why를 고친다(심각 7).
   - 10.0 "임신 20주 이후에 생긴 발작은 자간증을 의심": 맞다. 바꾼다면 "20주 이후부터 **출산 뒤 몇 주까지**"를 더하면 더 정확하다(산후 자간증, 고치지 않아도 됨).
   - 5분 기준(0.0·15.0·15.3·19.3, S9 swap): 맞다(작용적 정의 5분, 미국 가정 교육 "5분 넘으면 911").
   - 13.5 날록손 "다시 나빠질 수 있어서 계속 지켜봐요": 맞다. 날록손의 작용 시간이 많은 아편류보다 짧아 다시 잠들고 호흡이 느려질 수 있다.
   - 18.4 Todd 마비 "대개 수 시간에서 수일 안에 회복": 맞다(보통 하루 안, 길어도 이틀쯤). 문장의 "하루 이틀"과도 맞다.

## 고칠 것

### context 장면 정비 (14, C — TASK 9번)

`who`·`icon`·`ok`·`tone`과 문항 수·순서는 그대로. 장면은 [ok]/[XX] 순서 그대로 적는다. 아래 제안은 모두 검사기 W14의 어간 규칙으로 세 장면을 통과하는지 돌려 봤다.
**`word` 유지**: S0·S7·S11 (장면만 고침). **`word` 바꿈**: 나머지 11건. S2 `glucose`는 이미 맞다(고치지 않음).

| 상황 | `word` / `ko` | 장면 `en` (ok · ok · XX) 과 `fix` | `why` |
|---|---|---|---|
| S0 | `seizure` / 발작 (유지) | 차트 그대로 · 동료 간호사 → `His wife says he had a seizure — his whole body shook for about a minute.` · 가족 XX 그대로(`Was it a generalized tonic-clonic seizure or a focal seizure?`). `fix` → `During the seizure, was his whole body shaking, or just one side?` | 그대로 |
| S3 | `restraint` → `restrain` / 억지로 누르다 | 가족 → `Don't restrain him or put anything in his mouth — he can't swallow his tongue.` · 동료 그대로(`no restraints`) · 가족 XX 그대로(`physical restraint during ictal activity`). `fix` 그대로 | 그대로 |
| S5 | `workup` → `cause` / 원인 | 환자 → `We'll do some tests to find the cause of this.` · 의사 → `First-time seizure, no obvious cause — labs and CT pending.` · 환자 XX → `We need a workup to rule out structural or metabolic causes.` `fix` 그대로 | "workup·structural/metabolic은 의료진의 말이에요…"로(etiology 삭제) |
| S6 | `postictal` → `confused` / 혼란스러운 | 환자 → `You had a seizure, and you're a little confused. You're safe here.` · 차트 → `Postictal, confused, oriented x1, reoriented frequently.` · 환자 XX → `You're postictal, confused, and disoriented to time and place.` `fix` 그대로 | 그대로 |
| S7 | `nonadherent` / 복약을 안 지킨 (유지) | 차트 그대로 · 동료 → `He's been nonadherent — stopped his Keppra a week ago, and neuro wants it restarted.` · 환자 XX 그대로. `fix` 그대로 | 그대로 |
| S10 | `photopsia` → `vision` / 시야 | 산과 의사 → `34 weeks, BP 168/112, headache and vision changes — concern for preeclampsia with severe features.` · 환자 → `Is your vision blurry, or are you seeing spots or flashing lights?` · 환자 XX → `Any vision changes, such as scotomata or photopsia?` `fix` 그대로 | 그대로 |
| S11 | `postictal` / 발작 후 (유지) | 동료 간호사 → `Coworkers saw a few jerks, but she was back to baseline in seconds, no postictal phase.` · 차트 그대로 · 직장 동료 XX 그대로. `fix` 그대로 | 그대로 |
| S13 | `toxidrome` → `naloxone` / 날록손 | 동료 그대로 · 가족 그대로 · 가족 XX → `We're pushing naloxone to reverse the opioid toxidrome.` `fix` → `We're giving him a medicine called naloxone that can reverse the drugs he took.` | 그대로(push·toxidrome) |
| S14 | `Ask` → `medicine` / 약 | 통역 환자 그대로 · 차트 → `Seizure medicine history obtained via phone interpreter, ID 4721.` · 통역 XX 그대로(`Ask him if he takes any medicine for seizures.`). `fix` 그대로 | 그대로 |
| S15 | `benzos` → `stop` / 멈추다 | 가족 그대로(`to stop it`) · 팀 → `Seizing over five minutes — lorazepam 4 mg IV now to stop it, second dose ready.` · 가족 XX → `He's in status, so we're pushing benzos to stop it.` `fix` 그대로 | 그대로 |
| S16 | `tanking` → `dropping` / 떨어지는 | 팀 그대로 · 차트 → `SpO2 dropping, 84% on NRB; BVM ventilation initiated.` · 가족 XX → `His sats are dropping into the 80s, so we need to tube him.` `fix` 그대로 | "sats·tube him은 팀 안에서 쓰는 줄임말이에요…"(tanking 삭제) |
| S17 | `normalized` → `recheck` / 다시 확인하다 | 동료 그대로(`rechecking`) · 환자 → `Your sugar is back up. We'll keep rechecking it, because it can drop again.` · 환자 XX → `Your BG has normalized; we'll recheck and trend it for recurrent hypoglycemia.` `fix` → `Your sugar is back up, and we'll keep rechecking it in case it drops again.` (지금은 ok 장면과 글자까지 같다) | 그대로 |
| S18 | `neuroimaging` → `stroke` / 뇌졸중 | 환자 그대로 · 의사 그대로 · 환자 XX → `We need neuroimaging to exclude an acute ischemic stroke.` `fix` 그대로 | "neuroimaging·acute ischemic은 의료진의 말이에요…" |
| S20 | `ingestion` → `support` / 지지하다(돕다) | 가족 그대로(`supporting his breathing and heart`) · 동료 그대로(`supportive care`) · 가족 XX 그대로. `fix` → `We're testing his blood and urine for drugs and supporting his breathing and heart.` (지금은 ok 장면과 같다) | 그대로 |

(swap `ko` 6건 — S1·S4·S8·S9·S12·S19 — 은 모두 맞다.)

### order (14)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| O1 | S0 L4 | 3↔4 열림 — `Was he confused when it stopped?` 뒤에 `How long did that go on?`가 오면 "혼란이 얼마나 갔나"로 자연스럽다 | L4 `After those minutes, was he confused once it stopped?` (L3의 시간을 받음). why의 "it이 가리키는 멈춘 직후" → "those minutes가 앞 답을 받아 멈춘 직후를" |
| O2 | S4 L4 | 3↔4 열림 — L3·L4 모두 `it`(약)만 가리킨다 | L4 `Since that last dose, have you skipped or stopped any on your own?` why "마지막으로 임의 중단을 확인" → "그 마지막 복용 이후 거르거나 끊었는지 확인" |
| O3 | S6 L2 | 1↔2 열림(자기 보고 1) | L2 `You're safe here, and the confusion from it will pass.` (`it` = L1의 발작) |
| O4 | S7 L3 | 2↔3 약하게 — `So we'll check…`가 L1 바로 뒤에도 붙는다 | L3 `Because of that risk, we'll check your medication level in your blood.` |
| O5 | S8 L4 | `After that` — 이상 감각 보고를 약 뒤로 한정(심각 2) | L4 `Even with it, tell me right away if you see or feel anything strange.` why "After that으로" → "Even with it으로 약을 써도 이상하면 바로 알리게 해요" |
| O6 | S9 L2 | 1↔2 열림, 2↔3 약하게(자기 보고 1). 9.1 why와 모순 | L2 `Right now, though, she's breathing well and starting to recover.` (`though`가 L1의 "무서웠다"와 대비해 1번 뒤에 묶임) |
| O7 | S10 L2·L4 | L2 `Because of that` — 혈압을 주수에 딸린 검사로(심각 6). 3↔4 열림 — `…too`가 L2 뒤에도 붙는다 | L2 `We're checking your blood pressure, and at that stage we're calling OB.` (`at that stage`가 L1의 주수를 받고, 혈압은 조건 없이 잰다) L4 `Either way, we'll watch the baby's heart rate on the monitor too.` (L3의 질문을 받음). why 같이 |
| O8 | S11 L3 | 2↔3 열림 — 회복 질문과 목격 질문은 순서가 바뀌어도 자연스럽다 | L3 `Whatever they saw, how quickly did you feel clear afterward?` (`they` = L2의 목격자) |
| O9 | S12 L2 | `because of that` — 전해질은 모든 의식저하 환자에게(심각 6) | L2 `That answer helps us read the electrolyte test I'm sending now.` why "because of that으로 전해질 검사를 알리고" → "그 답이 지금 보내는 전해질 검사를 읽는 데 쓰인다고 알리고" |
| O10 | S13 L2·L3·L4 | 환기 지원 없이 날록손부터, 기도 평가를 약에 묶음(심각 4). 3↔4 약하게, L4 `that` 모호(자기 보고 1) | L2 `So we're helping him breathe and giving naloxone right now.` L3 `Even with that, we're checking if he needs a breathing tube.` L4 `It can wear off as he improves, so we'll keep watching closely.` why를 "환기를 도우며 날록손을 주고, 그래도 튜브가 필요한지 보고, 약이 풀릴 수 있어 계속 지켜본다"로 |
| O11 | S15 L2·L3·L4 | 기도를 약에 묶고 산소를 맨 뒤 미래형(심각 5). 3↔4 열림 | L2 `That makes it an emergency, so we're protecting his airway with oxygen.` L3 `Along with that, we're giving medication to stop the seizure.` L4 `Once it stops, he'll be very sleepy for a while.` why 같이 |
| O12 | S16 L4 | 3↔4 약하게(자기 보고 1) — `That way`가 L2 뒤에도 붙음 | L4 `With that tray ready, we can protect his airway.` |
| O13 | S17 L4 | 3↔4 열림. `ko` "낮았어서"는 어색한 한국어 | L4 `Good, you're answering—we'll still keep rechecking your sugar.` (`ko`: "좋아요, 대답하시네요. 그래도 혈당은 계속 다시 확인할게요") |
| O14 | S20 L3·L4 | 2↔3 약하게(`So…`가 L1 뒤에도 붙음). L4 `until we know more` — 지지 치료를 한정(심각 3) | L3 `Because we don't know, we're screening for toxins and supporting his breathing.` L4 `Whatever it turns out to be, we'll keep supporting him.` why "더 알 때까지 계속한다고 약속" → "무엇이든 계속 돕는다고 약속" |

(확인하고 그대로 둔 것: S3 L3 `As soon as it's safe` — 경련 중 억지로 돌리지 않고 가능해지면 옆으로 돌리는 것이 맞다. S14 L2 `Until then` — 통역이 오기 전의 몸짓 소통이라 "그동안만"이 옳다. S1·S2·S5·S18·S19는 교환이 모두 닫혀 있다.)

### why (7)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| W1 | 10.2 | 사실 오류(심각 1) | "지금 하는 일과 부르는 사람을 함께 알려요. 임신 20주 이후의 경련에서 혈압이 높으면 자간증을 먼저 생각하고, 산과와 함께 바로 대응해요." |
| W2 | 9.2 | 해열이 치료의 초점이라 함, 9.5와 모순(심각 7) | "Let's로 함께 한다는 느낌을 줘요. 열을 내리는 것은 아이를 편하게 하려는 것이고, 경련을 막지는 않아서 열의 원인을 찾는 일이 함께 가요." |
| W3 | 20.5 | 지지 치료를 "알 때까지"로 한정(심각 3) | "until we know more는 원인을 몰라도 치료를 멈추지 않는다는 뜻이에요. 원인을 알게 된 뒤에도 호흡·순환을 돕는 일은 이어져요." |
| W4 | 15.1 | "정맥으로 쓰는 약을 먼저" — 첫 약은 벤조디아제핀이고 정맥로가 없으면 근육주사(미다졸람)·코 안 투여도 같은 1차 | "now로 지금 바로 치료한다는 점을 알려요. 지속 발작에는 벤조디아제핀을 먼저 쓰고, 정맥로가 없으면 근육이나 코 안으로 줘요." |
| W5 | 16.1 | "수치가 떨어지는 중이면 백밸브마스크로" — 산소만으로 되면 백 환기가 아니다 | "…호흡이 약해 산소만으로 수치가 오르지 않으면 백밸브마스크로 직접 환기해요." |
| W6 | 10.1 | "얼굴과 손의 붓기는 전자간증의 흔한 징후" — 부종은 진단 기준이 아니다 | "갑자기 생긴 얼굴·손 부기는 진단 기준은 아니지만 전자간증의 경고 신호일 수 있어 함께 물어요. 발 부기는 임신 중 흔해서 구별 가치가 낮아요." |
| W7 | 12.2 · 17.2 | 12.2 첫 문장이 뜻풀이(`ko` 되풀이), 17.2 "때문의"는 어색한 한국어 | 12.2 "electrolytes 한 말로 나트륨·칼륨을 함께 말해 검사 이름을 늘어놓지 않아요. 의식이 흐린 환자에게…(뒷부분 그대로)". 17.2 "인슐린이나 당뇨약 때문에 생긴 저혈당은…" |

(보완 권장, 고칠 것 개수에는 넣지 않음: 12.5 why와 S12 swap why에 "경련이 있을 만큼 심하면 처음엔 고장성 식염수로 조금 빨리 올리고, 그 뒤 하루 상승 폭을 제한해요"를 더하면
"서두르지 않는 것이 전부"라는 오해를 막는다.)

### 빈칸 (28)

장면과 동떨어진 오답 — 같은 분야에서 틀린 말로:

| # | 어디 | 지금 오답 | 바꿀 오답 |
|---|---|---|---|
| B1 | 3.4 | `quiet`, `sweet` | `padded`, `warm` (`soft`는 그대로) |
| B2 | 4.1 | `snacks`, `drinks` | `precautions`, `steps` (`What precautions do you take for them?`) |
| B3 | 4.2 | `shower`, `walk`, `breakfast` | `temperature`, `pulse`, `blood pressure` |
| B4 | 5.0 | `quietly`, `quickly`, `loudly` | `poorly`, `less`, `more` |
| B5 | 5.1 | `yearly`, `upcoming`, `daily` | `chronic`, `childhood`, `past` |
| B6 | 5.2 | `errands`, `laundry` | `surgery`, `paperwork` (`rounds`는 그대로) |
| B7 | 9.0 | `deadly`, `contagious` (but 뒤에 논리로 걸러짐·동떨어짐) | `brief`, `inherited` (`ko` "무해"가 거름) |
| B8 | 9.3 | `boring`, `funny`, `easy` | `painful`, `serious`, `strange` |
| B9 | 10.0 | `pounds`, `inches` | `months`, `days` (`hours`는 그대로) |
| B10 | 11.0 | `embarrassed`, `excited` | `nauseous`, `sleepy` |
| B11 | 11.1 | `loudly`, `politely`, `angrily` | `well`, `completely`, `often` |
| B12 | 11.3 | `sleeping`, `laughing`, `resting` | `skipping`, `slowing`, `stopping` |
| B13 | 11.5 | `angry`, `hungry`, `cheerful` | `drowsy`, `dizzy`, `weak` |
| B14 | 13.0 | `wear`, `sell` | `smoke`, `inject` (`hide`는 그대로) |
| B15 | 13.3 | `abroad`, `overseas`, `downtown` | `upstairs`, `outside`, `elsewhere` |
| B16 | 14.5 | `argue`, `shop`, `sing` | `decide`, `agree`, `think` |
| B17 | 15.2 | `ignoring`, `blocking`, `closing` | `checking`, `clearing`, `suctioning` |
| B18 | 15.5 | `bandage`, `tray`, `belt` | `cannula`, `tube`, `monitor` |
| B19 | 16.0 | `closing`, `blocking`, `filling` | `checking`, `clearing`, `opening` |
| B20 | 16.4 | `feeding`, `washing`, `dressing` | `suctioning`, `positioning`, `sedating` |
| B21 | 20.5 | `stopping`, `ignoring`, `delaying` | `monitoring`, `testing`, `sedating` |
| B22 | 12.3 · 17.2 · 17.3 | 12.3 `boil/waste/spill`, 17.2 `reduce`(`lower`와 같은 뜻), 17.3 `left/woke/fell`(19.3과 같은 묶음) | 12.3 `boil` → `lose`, `spill` → `crave`. 17.2 `reduce` → `raise`. 17.3 `left` → `fainted`, `woke` → `ate` |

뒤집기만 남은 빈칸 — 가르치는 말로 옮기기:

| # | 어디 | 바꿀 빈칸 |
|---|---|---|
| B23 | 3.0 `Never` (`Always/Sometimes/Quickly`) | `answer: mouth`, 선택지 `mouth / hand / pocket / arms` |
| B24 | 3.3 `Don't` (`Just/Always/Please`) | `answer: fingers`, 선택지 `fingers / wallet / keys / phone` |
| B25 | 10.2 `calling` (`skipping/forgetting/canceling`) | `answer: pressure`, 선택지 `pressure / sugar / oxygen / count` |
| B26 | 15.3 `more` (`fewer/other/less` — 둘은 문법으로 걸러짐) | `answer: five`, 선택지 `five / two / ten / thirty` (5분 기준을 가르침) |
| B27 | 18.5 `still` (`never/hardly/barely`) | `answer: improving`, 선택지 `improving / spreading / worsening / returning` |

문법으로 걸러지는 오답:

| # | 어디 | 바꿀 것 |
|---|---|---|
| B28 | 0.1 · 0.3 · 1.1 · 1.4 · 2.3 · 16.3 · 8.1 · 20.3 | 0.1 빈칸을 `side`로(`side / arm / leg / hand`, `front body` 삭제). 0.3 `instead of` → `long after`. 1.1 `why`·`when` → `who`·`what`. 1.4 `Touch/Cover/Bend my finger with your eyes`는 말이 안 됨 → 빈칸을 `eyes`로(`eyes / head / hand / nose`). 2.3 빈칸을 `sugar`로(`sugar / pressure / oxygen / count`). 16.3 빈칸을 `oxygen`으로(`oxygen / sugar / sodium / potassium`). 8.1 `never` → `still`. 20.3 빈칸을 `took`로(`took / mixed / hid / bought`) |

(고치지 않아도 되는 것: 6.5 `hundred/thousand/dozen`, 3.2 `lost/wet/tired`, 16.5 `phone/chart/bed` — 같은 자리·같은 품사이고 `ko`가 거른다.)

### decoy (7 + 권장 묶음)

`ko`에 맞는 다른 문장이 되는 것:

| # | 어디 | 문제 | 바꿀 decoy |
|---|---|---|---|
| D1 | 1.0 `wide` | `Can you open your eyes wide for me?` = "눈을 떠 보시겠어요?" | `your mouth` (`Can you open your mouth for me?`) |
| D2 | 3.1 `over` | `We turn him over on his side…` = `ko` 그대로 | `on his back` |
| D3 | 3.5 `wide` | `keeps his airway wide open` = `ko` 그대로 | `closed` |
| D4 | 6.5 `once` | `the same questions once again` = "다시" | `different questions` |
| D5 | 13.0 `drink` | `What did he drink, and how much?` — `ko` "드셨나요"가 먹다·마시다를 다 덮는다 | `bring` |
| D6 | 20.5 `treating` | `We'll keep treating until we know more.` ≈ "계속 지지 치료를 할게요" | `waiting` |
| D7 | 4.2 `again` (경계) | `When did you last take your medication again?`(되묻는 말)로 뜻이 같다 | `start taking` (`When did you start taking your medication?`) |

권장(묶음, D8) — 어떤 청크 자리에도 못 들어가는 낱말을 돌려쓴 decoy. 같은 자리에 올 수 있는 구로:
`ever` 4.4 → `you started` · 5.3 → `any old pills` · 7.4 → `your doctor visits` · 8.1 → `smoke` · 10.3 → `a high fever` · 20.3 → `who he was with`;
`alone` 0.4 → `or angry` · 4.3 → `in the hospital` · 11.5 → `before` · 20.2 → `for infection` · 20.4 → `on the X-ray`;
`twice` 0.3 → `his lip` · 5.0 → `on time` · 7.5 → `to stop` · 11.2 → `vomiting`;
`full` 1.3 → `your address` · 5.4 → `a heart scan` · 6.1 → `your age` · 8.0 → `dose`;
`again` 1.5 → `when I talk` · 5.2 → `when` · 13.2 → `insulin`;
`slowly` 9.1 → `eating well` · 13.5 → `within an hour` · 18.1 → `Is the pain` · 20.1 → `and blood sugar`.

### distractorsKo (6)

| # | 어디 | 지금 | 바꿀 말 |
|---|---|---|---|
| K1 | 11.2 | `쓰러질 때 누가 옆에 있었나요?` ("본 사람이 있나요"와 거의 같음) | `쓰러지기 전에 가슴이 아팠나요?` |
| K2 | 12.2 | `전해질 주사를 놓을게요` ("전해질"이 겹침) | `정맥주사를 하나 잡을게요` |
| K3 | 14.1 | `오늘 아침에 약 먹었나요? 네, 아니요?` ("약 드시나요?"와 반만 다름) | `여기 아픈가요? 네, 아니요?` |
| K4 | 5.5 | `이건 곧 저절로 좋아질 거예요` (근거 없는 안심, 하지 않을 말) | `당분간은 운전하지 마세요` |
| K5 | 17.4 | `잠시 더 주무셔도 돼요` (저혈당 혼수 환자에게 하지 않을 말) | `정신이 들면 뭘 좀 드시게 할게요` |
| K6 | 18.5 | `지금 바로 퇴원하셔도 돼요` (같은 장면에서 나올 수 없는 말) | `스캔 전까지는 아무것도 드시지 마세요` |

### tag·icon (2, 사소)

| # | 어디 | 고칠 방법 |
|---|---|---|
| I1 | 1.5 | `bell` → `me` (누르며 통증 반응 확인) |
| I2 | 3.4 | `siren` → `cross` (치울 위험물) |

### 보고만 (v44, 고치지 않음)

- 1.1 `Do you know where you are right now?`, 15.3 `This has been going on for more than five minutes.`의 `words: []` — 은행 단어와 이어지지 않는다(v44 필드).
- 16.1 `ko` "백밸브마스크 지금" — 어색한 한국어지만 v44 필드.

## 고칠 것 개수

context 장면 14 · order 14 · why 7 · 빈칸 28 · decoy 7(+ 권장 묶음 D8 26문장) · distractorsKo 6 · icon 2 — **합계 78**(심각 8건은 이 안에 포함, D8 제외).

## 종합

문장 낱장은 `ko` 기준으로 정답이 둘인 빈칸이 없고 `distractorsKo`도 좋다. 그러나 context 14건(TASK 9번), order 14장(열린 교환 9장, 시간·원인 한정 5장, S13·S15 임상 순서),
10.2 why의 사실 오류는 **고친 뒤에 내보내야 한다.** 빈칸의 동떨어진 오답과 뒤집기 빈칸도 함께 고치면 내보내도 된다.
