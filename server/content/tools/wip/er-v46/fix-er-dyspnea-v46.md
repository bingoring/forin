# er-dyspnea — v46 보강 검토 (er)

대상: `er-dyspnea.yaml` (상황 22 · 문장 110 · order 22장 · 뉘앙스 swap 10 · context 12). 문장 110개·order 22장을 전부 봤다.
상황 번호는 파일 순서 0부터(S0 = 호흡곤란 초기 문진 … S21 = 기관절개 튜브 폐쇄·이탈), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 440줄, decoy를 청크 자리마다(+끝 앞) 넣은 조립 약 500줄, order 인접 교환 66가지,
context `word`가 세 장면의 `en`에 실제로 나오는지, swap `ko` 10건(정답을 넣은 문장과 대조), decoy·`distractorsKo` 중복, base와 v44 필드 비교.

먼저 확인된 것: base와 v44 필드(단어·문장·뉘앙스)는 **한 글자도 다르지 않다**(차이 0). 빈칸 선택지에 `icon` 없음(T8). swap `ko` 10건은 모두
정답을 넣은 문장의 뜻이다. order `ko` 머리말 22개는 모두 카드 내용과 맞다.

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다.
문법도 맞고 장면상 그럴듯해도 `ko`가 걸러 주는 오답·decoy는 괜찮은 것으로 봤다(예: 3.4 `counting`, 5.2 `heart`, 10.0 `tapping on`, 16.0 `Light`, 11.2 `latex`).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 말하는 방식의 이유(어순·완곡·공감·범위)를 짚고 임상 사실도 맞다. 저작자가 꼽은 3건은 모두 맞다(자기 보고 3). 고칠 것: 14.3(천천히 숨 쉬어 나아져도 기질적 원인이 배제되지 않는다는 말이 빠짐 — 안전), 12.0(인과가 뒤엉킴), 20.1(`bleeding a lot`이 팀에게만 쓰는 말이라는 틀린 주장), 21.1(관 개통을 환자 느낌으로 확인한다고 읽힘), order why 다수(카드 수정에 따라). 1.1은 아래 결정 11. 뜻만 푸는 것(14.0, 19.0 둘째 문장)은 사소하다. |
| 2 | 빈칸 | 4 | chestpain보다 훨씬 깨끗하다. 뒤집기 동사 오답이 거의 없고 관사도 지켰다. `ko`까지 봐도 정답이 둘인 것은 2문장(15.4 `quiet`, 21.4 `smaller`)이고 경계선 1(5.0 `forward`). 문법으로 걸러지는 오답 2문장(4.0 `long/often`, 6.3 `stable/uneven`), 거저 맞히는 빈칸 1(16.3 `98`이 `ko`에 그대로), 동떨어진 오답 몇 개(15.1·15.2·11.4·8.4·12.1·3.0), 같은 묶음 돌려쓰기(시간·횟수 1.1·9.4·18.4·20.1, low/high 1.3·1.4·6.3·9.2). |
| 3 | `decoy` | 4 | 대부분 비문이 되거나 `ko`와 어긋난다. `ko`에도 맞는 다른 문장이 되는 것이 4개다: 6.4 `all the way`, 9.2 `on the screen`, 14.0 `so far`, 19.4 `slowly`. 경계선 3: 2.2 `with your lips closed`, 4.0 `since morning`, 16.4 `one by one`. 중복 4개(`when you cough`·`last night`·`by yourself`·`at night` — `at night`은 4문장)는 사소하다. |
| 4 | `distractorsKo` | 4 | 뒤집기 패턴(chestpain에서 약 45문장)은 **거의 없다** — 저작자 의도대로 같은 상황의 다른 말로 썼다. 남은 것은 정답과 가깝게 읽히는 것 약 9문장(자기 보고 2)과 임상적으로 틀린 그림 2개(8.0 "마스크가 가래를 빨아내 줘요", 16.1 "유도제와 근이완제를 섞을 겁니다"), 동떨어진 것 2개(13.0, 18.3), 중복 4쌍. |
| 5 | `order` | 2 | 앞 줄을 가리키는 말로 묶은 설계는 대부분 잠겼다. 그러나 **임상 흐름이 틀린 카드가 8장**이다: S5(산소가 맨 끝, 과거력에 달림), S18("동시에"를 "투여 뒤에"로), S20(도움 요청이 지혈 실패에 달림), S7(위험 인자를 "시작된 뒤로" 묻고 다리·가슴을 조건부로), S11(질식감을 흉통 "아니오"에 달아 묻고 알레르기 빠짐), S4(기침-호흡 질문을 열이 내렸을 때만), S2(산소를 코로 숨 쉬기 되면 튼다), S0(지금 호흡 상태를 맨 끝에 — 0.3 why와 어긋남). 논리 틈 1(S21 `still out of place`), 인접 교환이 약하게 열린 것 3장(S9 3↔4, S12 2↔3, S13 3↔4). |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 상황 안에서 일관된다. order 태그·아이콘(`대화 흐름`·`compass`)도 22장 같다. 아이콘 어긋남은 사소하다(아래). 산소 조치에 `pill`을 쓴 것은 목록에 산소 아이콘이 없어 그대로 둔다. |
| 7 | context `word`·`ko`, swap `ko` | 4 | swap `ko` 10건 모두 맞음. context `ko` 12건 모두 정확하다. 다만 S1 `oxygen level`과 S10 `listen`은 세 장면의 `en` **어디에도** 그 말이 없다(S1은 `SpO2/Sats`, S10은 `breath sounds`). 화면 제목 "`listen`이 어색한 장면은?"이 성립하지 않는다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진 오답 약 7문장, 묶음 돌려쓰기 8문장, 관사는 잘 지켰다(`a fever`·`an interpreter`). (3) order 못 박기: 대체로 잘 됐고 약하게 열린 것 3장. (4) 임상 순서: order 8장(위 5). (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **S5 order — 산소를 맨 끝에, 과거력 답에 달아 준다.** L3 `While I listen, have you ever coughed up anything pink or frothy?` → L4 `If so, it may be fluid in your lungs, so I'm getting oxygen on you.`
   급성 폐부종 숨찬 환자의 산소는 SpO2·호흡 곤란으로 바로 주지, "전에 분홍 거품 가래가 나온 적 있으면" 주는 것이 아니다. 같은 주제 5.2 why도 "폐 소리를 듣는 것과 산소 연결은 같이 시작해요"라고 한다.
   또 이 환자는 지금 분홍 거품 가래를 뱉고 있다(장면 tagline·5.1) — `have you ever`(과거력)는 장면과도 어긋난다.
2. **S18 order — brief의 "에피네프린과 응급기도를 동시에"를 순차로 가르친다.** L2 `After it goes in, call for the difficult airway cart and ENT.`, why "약이 들어간 뒤 기도 카트와 이비인후과를 부르고".
   후두부종으로 기도가 닫히는 중이면 에피네프린 투여와 기도 인력 호출은 동시에 한다. L4 `If her lips keep swelling once the kit is open, get epinephrine ready to give again.`도
   재투여를 "세트가 열린 뒤"라는 장비 상태에 단다. 재투여 시점은 반응(5~15분 뒤에도 호전 없음)으로 정한다.
3. **S20 order L4 — 도움 요청이 지혈 실패에 달렸다.** `If he keeps bleeding even then, prepare to intubate and call for help now.` 대량 객혈은 처음부터 도움(호흡기·마취·IR)을 부른다.
   삽관 준비는 조건부여도 되지만 호출은 아니다. 20.4 문장 자체(`Prepare to intubate and call for help now.`)는 조건이 없어 괜찮다.
4. **S7 order — 위험 인자를 "시작된 뒤로" 묻고, 다리·흉통을 조건부로 묻는다.** L2 `Since it started, have you traveled far or been immobile?`: 장거리 이동·부동은 호흡곤란 **이전**의 위험 인자다(시간이 거꾸로).
   L3 `If you were immobile, is one of your legs more swollen?`: 다리 부종(DVT 징후)은 폐색전 의심 환자 모두에게 묻는다(tagline에서 이미 종아리가 부었다고 함). L4 `Along with the leg`도 흉막통을 다리 소견에 엮는다.
5. **S11 order L3 — 질식감을 흉통 "아니오"일 때만 묻는다.** `If it's not your chest, is it a choking feeling?`. brief는 통증·질식감·알레르기를 **모두** 확인하라고 한다. 카드에는 알레르기도 빠졌다.
6. **S14 why 14.3 — 천천히 숨 쉬어 나아지면 "불안이 호흡을 빠르게 했을 가능성을 가늠"한다.** 호흡 코칭으로 나아져도 폐색전 같은 기질적 원인은 배제되지 않는다(brief: "기질적 원인을 배제하며").
   S14 order도 L1(산소·폐 진찰 정상) → L2(`With results like these`, 불안 때문인가)로 두 소견만으로 불안을 추정하는 흐름이다. 검사를 끝까지 한다는 말을 넣는다.
7. **8.0·16.1 `distractorsKo`의 틀린 임상 그림** — 8.0 `이 마스크는 가래를 빨아내 줘요`(BiPAP은 흡인하지 않는다), 16.1 `유도제와 근이완제를 곧 섞을 겁니다`(두 약은 따로 뽑아 따로 준다). 오답이어도 학습자에게 틀린 그림을 준다.

## 저작자 자기 보고 판정

1. **동의어가 많은 문장은 빈칸을 형용사·명사 쪽으로 옮김** — **효과가 있었다.** 동사 빈칸은 12문장만 남았고(0.0·0.1·0.4·1.2·8.0·8.4·9.1·16.4·17.3·20.4·21.0·21.2) 그중 정답이 둘인 것은 없다.
   옮긴 뒤 새로 생긴 문제는 두 가지다. ① 형용사·부사 자리에서 장면상 맞는 말이 남은 것: 15.4 `quiet`(기도 폐쇄에서 "조용히 계세요"는 맞는 지시이고 `ko` "가만히"가 둘 다 뜻함), 21.4 `smaller`(기관절개관 이탈 때 **한 치수 작은 관**을 같이 준비하는 것이 표준이라 `ko` "새 튜브"에도 맞음), 경계선 5.0 `forward`(기댄 자세는 실제 호흡곤란 자세지만 `ko` "앉혀"가 대체로 거름).
   ② 같은 묶음 돌려쓰기: `low/high/normal`(1.3·1.4·6.3·9.2), 신체 부위(4.3·7.1·7.3·7.4·18.1 — 장면이 달라 사소), `pharmacy/radiology`(17.4·18.2), `quiet/awake/warm`(11.4·15.2·15.3·15.4), 횟수·시간 부사 `first/later/twice/again/slowly`(9.4·18.4·19.1·20.1).
2. **`distractorsKo`가 일부 정답과 가깝게 읽힘** — **맞다, 다만 몇 개뿐이다.** 뒤집기는 피했다. 정답과 가까워 들을 때 정답이 둘이 되는 것:
   - 2.2 [0] `코가 막혀서 답답하세요?` — "코로 숨 쉬는 건 괜찮으세요?"와 묻는 내용이 거의 같다.
   - 12.4 [0] `오늘 폐활량도 다시 확인해 볼게요` — 명사 하나만 다르고, 호흡근 힘은 실제로 폐활량으로 잰다.
   - 8.4 [0] `마스크를 쓰면 더 편해질 거예요` — "폐를 쉬게 해 줄 거예요"의 결과라 같은 뜻으로 들린다.
   - 8.1 [0] `마스크 끈은 나중에 조여 드릴게요` — "먼저 살살 대 드릴게요"에 함축된 말이다(S8 order L3이 바로 그 말).
   - 15.4 [0] `가능하면 말은 하지 말고 계세요` — `ko` "가만히 계시고"와 겹친다(빈칸 `quiet` 문제와 같은 뿌리).
   - 7.4 [1] `다리에 힘이 빠지는 곳을 가리켜 주세요` — 정답과 낱말 하나만 다른 같은 틀.
   - 18.2 [0] `마취과에 전화해 주세요` — 18.2 why 스스로 "마취과나 이비인후과"라고 하니 임상적으로도 맞는 호출이다.
   - 15.1 둘 다 `지금 ~할 수 있으세요?` 틀 — 동사 하나만 다르다. 하나는 다른 말로.
   - 6.4 [0] `산소 수치를 다시 확인해 볼게요` — "다시 올려드릴게요"와 반만 다름.
   경계선(보고만): 1.3·9.3·21.2(정답과 앞 절이 같은 틀, 뒤 절은 다름), 4.2 [0], 9.4 [0], 14.3 [0], 18.1 [1].
3. **`why`의 임상 사실** — **모두 맞다.**
   - 폐부종은 앉힘(5.0·5.3): 맞다. 상체를 세우면 정맥 환류가 줄어 폐울혈이 덜하다. 5.3 dKo `다리를 침대 아래로 내려도 돼요`도 맞는 처치라 좋은 오답이다.
   - COPD 과산소로 이산화탄소 저류(13.0, swap S13 why 88–92%): 맞다. "저산소 호흡 자극" 같은 낡은 기전을 단정하지 않고 "일부는 쌓일 수 있다"로 쓴 것이 정확하다(BTS 목표 88–92%).
   - 삽관 전 산소화(16.3, context S16 `Preoxygenated to SpO2 98%`): 맞다. "전산소화(preoxygenation)"라는 말을 넣으면 더 좋다(선택).
   - 그 밖에 확인한 것: 9.1 손가락이 차거나 움직이면 측정값이 틀림, 18.0 아나필락시스 1차 치료는 IM 에피네프린, 18.4 처방에 따라 반복, 20.2 출혈 쪽을 아래로, 10.1 기흉은 갑자기·흉수는 점차, 15.3·swap S15 상기도 폐쇄는 편한 자세 유지·진정 금지, 16.1 약 라벨, 16.4·S19 swap closed-loop, S17 swap CUS — 모두 맞다.

## 고칠 것 (v46 필드)

### why (6 + order why는 아래 order 수정에 포함)
- 14.3 · 둘째 문장 → "천천히 숨 쉬어 나아지면 불안이 영향을 줬을 수 있어요. 다만 나아져도 기질적 원인 검사는 끝까지 해요." (심각 6)
- 12.0 · 둘째 문장 인과가 뒤엉킴 → "기침이 약해졌다는 건 호흡 근육이 약해진 신호일 수 있고, 그러면 가래를 뱉어 내기 어려워져요."
- 20.1 · "환자가 아닌 팀에게 짧게 말하는 표현"은 틀림 → "bleeding a lot처럼 쉬운 말로 상황을 먼저 보고하고, 바로 할 일(suction again)을 붙여 팀이 움직이게 해요."
- 21.1 · 관 개통을 환자 느낌으로 확인한다고 읽힘 → "환자 느낌을 물어 보조로 확인하고, 흡인 카테터가 들어가는지·관 입구로 공기가 나오는지를 직접 봐요. 공기가 안 통하면 막히거나 빠졌을 수 있어요."
- 11.4 · "가장 먼저 전해야 할 말이에요"는 과장이고 S11 order는 이 말을 맨 끝에 둔다 → "…지켜보며 안전을 지킨다고 약속하면 기다리는 동안 불안이 줄어요."
- 0.4 (사소) · "sitting up처럼 자세를 한 단어로" → "sitting up처럼 자세를 짧은 말로".

### 빈칸 (blank) (11)
정답이 둘:
- 15.4 · `quiet`는 "조용히 계세요"로도 맞는 지시이고 `ko` "가만히"가 거르지 못함 → `still*/flat/standing/warm` (`quiet`·`awake`를 빼고, `flat`은 같은 분야의 반대).
- 21.4 · `smaller`는 표준 준비물(한 치수 작은 관)이라 정답이 둘 → `new*/used/bigger/expired`.
경계선:
- 5.0 · `forward`(기댄 자세는 실제로 숨쉬기를 돕는다) → `upright*/still/sideways/lower`.
문법·뜻으로 걸러짐:
- 4.0 · `How long/How often has your fever been?`는 비문 → `high*/low/mild/bad`(`How bad`는 `ko` "얼마나 높았나요"가 거름).
- 6.3 · `a bit stable/a bit uneven`은 어색 → `low*/high/better/higher`.
거저 맞힘:
- 16.3 · 정답 `98`이 `ko` 머리에 그대로 나옴 → answer를 `ahead`로: `ahead*/back/away/home` (`go back`은 같은 분야의 반대).
동떨어진 오답(같은 분야에서 틀린 말로):
- 15.1 · `stand/walk/sleep` → `swallow*/speak/cough/lie down` (`ko` "침을 삼킬"이 거름).
- 15.2 · `home` → `upright` (`calm*/awake/quiet/upright`).
- 8.4 · `grow/dry/shrink` → `rest*/tire/strain/collapse`.
- 11.4 · `busy` → `safe*/warm/quiet/waiting`.
- 1.1 · `hour/second`(시간 단위 묶음) → answer를 `breaths`로: `breaths*/beats/coughs/words`.
묶음 돌려쓰기(급하지 않음, 보고만): 1.3·1.4·9.2 `low/high/normal`, 9.4·18.4·20.1 `first/later/twice/slowly`, 3.0 `late`·12.1 `reading`(동떨어짐), 16.1 `insulin/antacid`(RSI와 동떨어짐 → `pressor/reversal`), 17.0 `rising/climbing`(같은 말 둘).

### decoy (4 + 경계선 3)
`ko`에도 맞는 다른 문장이 되는 것:
- 6.4 · `all the way` → `We'll get your oxygen back up all the way.`가 `ko`와 같음 → `back down`.
- 9.2 · `on the screen` → `…but your numbers are low on the screen.`이 `ko`와 같음 → `are normal`.
- 14.0 · `so far` → `…look reassuring so far.`가 `ko`와 같음 → `and heart rate`.
- 19.4 · `slowly` → `Sats are climbing again slowly.`가 `ko`와 같음 → `are falling`.
경계선(고쳐도 됨):
- 2.2 · `with your lips closed` → `Can you breathe through your nose with your lips closed?`가 거의 같은 질문 → `through your mouth`.
- 4.0 · `since morning` → `How high has your fever been since morning?`이 `ko`와 크게 다르지 않음 → `has your cough`.
- 16.4 · `one by one` → `I'll call it out one by one.` ≈ "단계별로" → `all at once`.
중복(사소): `at night` 4.4·7.0·10.4·13.3, `when you cough` 0.1·7.3, `last night` 0.3·17.1, `by yourself` 3.0·15.1.

### distractorsKo (13문장)
정답과 가까움(자기 보고 2):
- 2.2 [0] `코가 막혀서 답답하세요?` → "산소 줄이 귀 뒤에서 아프지 않으세요?"
- 12.4 [0] `오늘 폐활량도 다시 확인해 볼게요` → "오늘 식사는 잘 삼키셨어요?"
- 8.4 [0] `마스크를 쓰면 더 편해질 거예요` → "마스크는 의사 선생님이 벗겨도 된다고 할 때까지 써요"
- 8.1 [0] `마스크 끈은 나중에 조여 드릴게요` → "숨이 차면 손을 들어 알려 주세요"
- 15.4 [0] `가능하면 말은 하지 말고 계세요` → "침이 나오면 뱉으셔도 돼요"
- 7.4 [1] `다리에 힘이 빠지는 곳을 가리켜 주세요` → "다리를 쭉 펴고 누워 계세요"
- 18.2 [0] `마취과에 전화해 주세요`(임상적으로도 맞는 호출) → "알부테롤 네뷸라이저를 준비해 주세요"
- 15.1 [1] `지금 입을 벌릴 수 있으세요?` → "목이 언제부터 부었나요?"
- 6.4 [0] `산소 수치를 다시 확인해 볼게요` → "가래 검사를 보내 드릴게요"
틀린 임상 그림:
- 8.0 [0] `이 마스크는 가래를 빨아내 줘요` → "이 마스크는 잘 때도 쓰고 계셔야 해요"
- 16.1 [0] `유도제와 근이완제를 곧 섞을 겁니다` → "유도제와 근이완제 용량을 다시 확인하겠습니다"
동떨어짐:
- 13.0 [1] `산소 마스크는 하루에 몇 번 바꿔요` → "숨이 차면 언제든 말씀해 주세요"
- 18.3 [1] `기관절개관을 교체해 주세요`(이 환자는 기관절개관이 없음) → "흡인기를 하나 더 준비해 주세요"
중복(사소): `어지러우면 바로 말씀하세요`(3.0·15.3), `숨이 안정되면 말씀해 주세요`(3.2·14.3), `기침할 때 가슴이 아픈가요?`(4.4·6.1), `의사 선생님이 곧 오실 거예요`(11.4·21.4) — 하나씩 바꾸면 좋다.

### order (13장)
임상 흐름(심각 1~5와 같은 것):
- S5 · 산소를 청진과 같이 앞으로, 과거력 조건 없애기 → L1 `Let's sit you upright to help you breathe.` / L2 `Now that you're sitting up, I'm listening to your lungs and starting oxygen.` / L3 `I hear crackles, and with that pink, frothy cough, it may be fluid.` / L4 `Because of that, I'm letting the doctor know right away.`; why "앉혀 숨을 돕고, 앉은 뒤 청진과 산소를 같이 시작하고, 들은 소리와 가래로 폐에 물이 찼을 수 있다고 설명하고, 그래서 바로 의사에게 알려요."
- S18 · 동시 진행으로 → L2 `While it goes in, call for the difficult airway cart and ENT.` / L4 `If her lips keep swelling in 5 minutes, get the next epinephrine dose ready.`; why "에피네프린을 주는 동시에 기도 카트와 이비인후과를 부르고, 카트가 오면 외과적 기도 세트를 열고, 5~15분 뒤에도 부종이 계속되면 재투여를 준비해요." L4 아이콘 `stetho` → `pill`.
- S20 · 호출을 조건 밖으로 → L4 `Call for help now — if he keeps bleeding even then, prepare to intubate.`; why "…그래도 출혈이 이어지면 삽관을 준비하고, 도움은 지금 바로 불러요."
- S7 · 시간·조건 바로잡기 → L2 `Before it started, had you traveled far or been stuck in bed?` / L3 `Either way, is one of your legs more swollen or painful?` / L4 `Besides your leg, does your chest hurt when you breathe in?`; why도 맞춰 고침.
- S11 · 셋 다 묻기 → L2 `First one: chest pain? Yes or no?` / L3 `Next one: choking feeling? Point to your throat if yes.` / L4 `Last one: allergy to medicine? An interpreter is on the way.`; why "짧게 묻겠다고 알리고, 통증·질식감·알레르기를 하나씩 차례로 묻고, 통역사가 오고 있다고 알려요."
- S4 · L4 조건 없애기 → `Either way, does the cough make it hard to breathe?`; why에서 "열이 내린 뒤에도"를 "열과 상관없이"로.
- S2 · 산소를 먼저 틀고 넣기(보통 유량을 맞춘 뒤 갈래를 넣는다), 코 호흡에 산소를 달지 않기 → L1 `I've set the oxygen to a low flow, so you'll feel a little air.` / L2 `These two soft prongs go just inside your nose.` / L3 `With them in, can you breathe through your nose okay?` / L4 `If not, or if it feels dry or tight, I'll adjust it.`; why 맞춰 고침.
- S0 · 지금 호흡 상태를 먼저(0.3 why "지금 어떤지를 먼저 확인"과 맞춤) → L1 `Are you having trouble breathing right now?` / L2 `When did it start?` / L3 `Since it started, is it worse when you lie down?` / L4 `When it gets worse like that, do you also have a cough or chest pain?`; why 맞춰 고침. (현재 L4 `with all of that`도 영어가 어색함.)
- S14 · L1에 검사를 계속한다는 말 → `Your oxygen and lung exam look reassuring, but we'll still finish your tests.` (심각 6)
논리 틈:
- S21 · L3 `If it's still out of place`는 앞에서 이탈을 말한 적이 없음 → `If air still isn't moving, we'll change the tube right away.`; why "흡인한 뒤에도 공기가 안 통하면 교체한다"로.
약하게 열린 교환(고친 뒤 다시 돌려 볼 것):
- S9 3↔4 · L1→L2→`Either way, we'll keep a close eye on you.`→`If it stays low, we'll give you oxygen.`도 자연스러움 → L4 `Whatever the oxygen does, we'll keep a close eye on you.`(L3을 가리킴).
- S12 2↔3 · `Because of that, we need to watch…`가 L1 답 뒤에도 붙음 → L3 `With both of those, we need to watch your breathing muscles closely.`(L1·L2 둘을 가리킴).
- S13 3↔4 · `Even then, turning it all the way up…`가 L2 바로 뒤에도 읽히고 L3 `that range`도 L2에 붙음 → L4 `Even with those checks, turning it all the way up wouldn't be safe for you.`(L3을 가리킴).
order why 22장은 모두 "…이 앞 줄을 가리켜 순서가 하나예요"로 끝난다. 위 카드를 고친 뒤 그 문장도 새 연결어에 맞춰 바꾼다. S16 why "진행을 허락하고"는 간호사가 허락하는 것이 아니니 "준비 완료를 알리고"로.

### context (2)
- S1 · `word: oxygen level`이 세 장면 어디에도 없음(`SpO2/Sats`만) → `word: SpO2`, `ko: 산소포화도`(세 장면 모두 그 수치를 말하고, 어색한 장면이 바로 `SpO2`를 환자에게 쓴 것).
- S10 · `word: listen`이 세 장면 어디에도 없고 세 장면의 뜻도 "듣다"가 아니라 "호흡음 감소" → `word: breath sounds`, `ko: 호흡음`(세 장면 모두에 나옴).

### tag·icon (사소)
- 7.2 `bulb` → `plane`(장거리 이동), 18.3 `bandage` → `scalpel`, 9.4 `play` → `monitor`, S18 L4 `stetho` → `pill`(위 order와 함께).

## 결정 11 (v44 문장·청크 — 보고만, 이번 범위 밖)
- 1.1 `I'm counting how many breaths you take per minute.` — 호흡수는 보통 환자가 의식하지 않게 맥박을 재는 척하며 센다. why가 "의식하면 달라질 수 있어서 짧게 말하고 조용히 센다"로 이를 메우려 하지만, 문장 자체가 환자에게 세고 있다고 알린다. keyPhrase라 그대로 두되 why에 "보통은 알리지 않고 세지만, 환자가 물으면 이렇게 답해요"를 넣는 것을 권한다.
- 11.4 `until help arrives` — 응급실 안에서 "도움이 올 때까지"는 어색하다(통역사를 뜻함). `until the interpreter arrives`가 정확하다.
- 12.3 청크 `watch your breathing / muscles closely`가 명사구 `breathing muscles`를 끊는다.
- 18.0 `Give IM epinephrine now` — 동료에게 하는 지시인데 투약은 처방·표준 지침(standing order)이 있어야 한다. 의사 발화로 읽히게 하거나 "per protocol"을 넣는 것을 권한다(선택).
- 21.1 `Can you feel air moving through it?` — 개통 확인은 간호사가 직접 한다(why 수정으로 보완).

## 고칠 것 개수
- why 6 · 빈칸 11 · decoy 4(+경계선 3) · distractorsKo 13문장 · order 13장(+why 문구) · context 2 · tag·icon 4 — **합계 53건**(경계선·사소 중복·결정 11 제외).

## 종합
v44 필드는 base와 같고, 빈칸·decoy·`distractorsKo`는 이전 주제들의 되풀이 패턴(뒤집기·동떨어짐)을 대부분 피했다. 고칠 것의 중심은
**임상 흐름이 틀린 order 8장**(특히 S5 늦은·조건부 산소, S18 "동시에"를 순차로, S20 조건부 호출)과 14.3 why의 안전 문구다. 이것과 빈칸 2건(15.4·21.4),
decoy 4건을 고친 뒤 order 인접 교환을 다시 돌려 보면 내보내도 된다.
