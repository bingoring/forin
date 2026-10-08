# er-arrest — v46 보강 검토 (er)

대상: `er-arrest.yaml` (상황 21 · 문장 105 · order 21장 · 뉘앙스 swap 8 · context 13). 문장 105개와 order 21장을 전부 봤다.
상황 번호는 파일 순서대로 0부터 셌다(S0 = 무반응 환자 초기 인지 … S20 = 외상성 심정지). 문장은 `상황.문장`(0부터), order 줄은 L1~L4로 적었다.

스크립트로 전부 뽑아 본 것:
- 빈칸 `before+선택지+after` 420줄
- decoy를 청크 자리마다 넣은 조립 약 330줄
- order 인접 교환 63가지
- context `word`가 세 장면에 실제로 나오는지
- swap `ko` 8건(정답 선택지를 넣은 문장과 대조)
- decoy·선택지 묶음·`distractorsKo` 중복
- 태그 길이

base와 비교해 v44 필드(`en`·`ko`·`chunks`)는 한 글자도 바뀌지 않았다(SAME). `changes-er-arrest.yaml`은 없다.

판정 기준: 빈칸·조립 낱장 머리에는 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 임상 설명은 대체로 정확하다(AHA 깊이·속도, 에피 1 mg 3~5분, IO 부위, 칼슘의 막 안정화, PEA 정의 등). 틀렸거나 오해를 부르는 것: 16.2(임산부 압박 위치 `high on the sternum`을 그대로 가르침), 19.0(DNR을 사전 지시서와 같은 것으로 씀). 한국어가 깨진 것: 13.1, S6 order why("두 분 뒤"), S8 order why. |
| 2 | 빈칸 | 3 | `ko`로 걸러지지 않아 정답이 둘인 것은 **없다**. 문제는 세 가지다. (a) 숫자 빈칸은 `ko`의 숫자가 답을 그대로 보여 준다: 0.3 `ten`, 6.2 `two`, 10.0 `eight`. (b) 문법으로 걸러지는 오답이 있다: 19.0 `his allergies not to be resuscitated`, 20.3 `bleeding never`, 11.4 `refuse explaining`, 12.4 `how many fluids`. (c) 장면과 동떨어졌거나 아무도 하지 않을 오답이 있다: 11.1 ignore/cancel/hide, 18.1 ignore/forget/skip, 20.2 ignoring/forgetting/hiding, 19.2 money/food, 9.2 lobby/nursery, 8.2 discharge/recovery, 15.0 breakfast, 5.2 tomorrow. |
| 3 | `decoy` | 3 | 조립 약 330줄은 대부분 비문이거나 `ko`와 어긋난다. `ko`에도 맞는 다른 문장이 되는 것은 1건이다: 19.2 `in the hall`. `ko`에 "그와 함께"가 없어서 `…take all the time you need in the hall`도 맞는다. 장면과 동떨어져 읽기만 해도 걸러지는 decoy는 14개다(`what's for lunch`, `the budget`, `his billing`, `to the cafeteria`, `to the roof`, `gaining his weight` 등). `later`는 세 번(0.4·6.1·16.4), `on the monitor`·`slowly`는 두 번씩 쓰였다. |
| 4 | `distractorsKo` | 2 | 기본 방식이 "정답을 뒤집은 말"이다. 이 패턴이 약 70문장에 걸쳐 있다. 하나는 **아무도 하지 않을 말**이다(`침대와 환자를 꼭 붙잡아 주세요`, `체온이 오를 때까지 압박을 멈추세요`, `칼륨을 줘서 심장을 보호하세요`). 다른 하나는 낱말 하나만 뒤집은 **반만 다른 말**이다(2.4 최소↔최대, 13.3 얕다↔깊다, 16.0·16.3 왼쪽↔오른쪽, 14.0·14.4 "따뜻해지면 바로 선언"). **틀린 의학 사실을 담은 오답**도 있다. 15.0 `인슐린을 걸러서 저혈당`은 사실과 반대다(거르면 고혈당). 10.2 `무수축이고, 충격이 필요해요`, 13.0 `분당 140회`도 틀린 말이다. |
| 5 | `order` | 2 | 앞 줄을 가리키는 말로 묶은 카드는 S0·S1·S3·S5·S7·S19 정도다. 인접 교환이 자연스러운 카드는 8장이다(S6 3↔4, S8 3↔4, S10 2↔3, S11 2↔3, S12 2↔3, S13 1↔2, S14 1↔2·2↔3, S15 3↔4). 이 카드들의 why에 있는 "순서가 하나예요"는 사실이 아니다. 임상 흐름이 틀린 카드는 6장이다. S4는 리듬 분석 없이 충전·방전한다. S16은 산과 호출을 "두 단계가 실패한 뒤"로 미룬다. S9는 12유도를 "혈압이 잡히면"이라는 조건에 묶는다. S17은 기도 확보를 "수액이 돈 뒤·붓기가 심해지면"이라는 조건에 묶는다. S20은 출혈이 잡힐 때까지 압박을 안 한다. S8은 확보를 선언한 뒤에 다시 "흘려보내기"를 한다. |
| 6 | `tag`·`icon` | 4 | 태그는 모두 10자 이하다. 문장의 역할을 말하고 상황 안에서 일관된다. 어긋나는 아이콘 몇 개는 사소하다: 9.4 `plane`(중환자실 이송), 15.4 `handshake2`(약 역할 설명), 20.1 `pill`(지혈·수혈). |
| 7 | context `word`·`ko`, swap `ko` | 4 | swap `ko` 8건은 전부 정답 선택지를 넣은 문장의 뜻과 맞는다. context 13건 중 3건은 `word`가 장면과 맞지 않는다. S0 `call`은 어색한 장면의 문제가 `code`라는 말인데 word가 call이다. S2 `push`는 장면 2·3에 없다. S18 `lose`는 장면 2·3에 없고, 문제의 말은 `re-arrest`다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8). (2) 동떨어진 빈칸 오답 약 8문장, 문법으로 걸러지는 오답 4문장, 숫자 빈칸 3문장. (3) order 연결: 위 5. (4) 임상 순서·사실: order 6장, base 문장 3건(결정 11). (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **S16 order — 산과·신생아팀 호출을 미룸.** L3 `If there's still no pulse after those two steps, call OB …`는 자궁 전위와 압박이 "실패한 뒤에" 산과를 부르라는 말이 된다.
   AHA의 임산부 심정지 대응은 반대다. 심정지를 인지하는 즉시 산과·신생아·마취팀을 함께 부른다. 임사 제왕절개(PMCD)는 "4분 안에 ROSC가 없으면 시작해 5분 안에 분만"을 목표로 시간 기준으로 정한다.
   같은 상황 16.1·16.4(`Call OB now`)와도 어긋난다. 간호사가 호출을 늦추는 흐름으로 배울 수 있다.
2. **16.2 `Keep compressions high on the sternum and continuous.` (base·keyPhrase) + why.** 2010 AHA는 "흉골에서 조금 높게"라고 했다. 2015년 AHA 임산부 심정지 성명과 ERC 2021에서는 이 권고가 빠졌다. 지금은 보통 환자와 같은 위치(가슴 중앙, 흉골 아래쪽 절반)에서 누른다.
   `ko` "흉골 위쪽에서"는 더 위쪽으로 읽힌다. why "위치를 high on the sternum처럼 짧게 말하고"는 틀린 위치를 가르치는 문장을 그대로 설명한다.
   문장은 keyPhrase라 결정 11로 보고한다(사용자 결정 필요). v46에서는 why로 바로잡는다(아래).
3. **S4 order — 리듬 분석 없이 충전.** L2 `Check that they're sticking to the skin, then I'll charge.`는 패드를 붙이고 바로 충전·방전하는 흐름이다.
   수동 제세동은 리듬 확인 → 제세동 가능 리듬이면 충전 순서다. 리듬을 보지 않고 충격을 준다고 배울 수 있다.
4. **S20 order L4 `Once it's controlled, start compressions.` + base 20.3 `Control the bleeding first, then start compressions.`** 외상성 심정지에서도 압박을 "출혈이 잡힐 때까지" 보류하지 않는다.
   원인 해결(감압·지혈·수혈)이 우선이지만, 손이 있으면 압박과 동시에 한다(ERC 2021 · ATLS). "압박은 지혈 뒤에 시작"으로 배울 수 있다. 20.3은 base라 결정 11로 보고하고, order와 why는 고친다.
5. **10.3 `We've given epi twice so far in this round.` (base)** 한 라운드는 2분인데 에피는 3~5분 간격이다. 한 라운드에 두 번 줬다는 말은 투약 간격을 틀리게 가르친다. 결정 11로 보고한다(`in this code`·`so far`로).
6. **S9 order L4 `Once the pressure holds, get a twelve-lead …`** ROSC 직후 12유도는 혈압과 상관없이 바로 찍는다(STEMI 확인 → 심도자실). 모든 환자에게 하는 확인을 조건에 묶은 경우다(이어진 검토에서 되풀이된 것).
7. **S17 order L3·L4** — `Once the fluids are running, prepare for a difficult airway`, `if the swelling gets worse, we secure that airway`. 무맥 환자의 기도 확보를 수액 뒤로 미루고 "붓기가 심해지면"이라는 조건을 붙였다. 아나필락시스 심정지에서는 붓기가 진행하기 전에 일찍 확보한다.
8. **틀린 의학 사실을 담은 `distractorsKo`** — 15.0 `인슐린을 걸러서 저혈당일 가능성이 높아요`(거르면 고혈당), 10.2 `무수축이고, 충격이 필요해요`, 13.0 `분당 140회`, 15.1 `칼륨을 줘서 심장을 보호하세요`. 오답이라도 듣기 화면에 그대로 나오므로 바꾼다.

## 저작자 자기 보고 판정

1. **`ko`로만 정답이 가려지는 약물·병력 선택지(예: 7.2 `Any history of clots, surgery, or bleeding?`)** — **문제없다.** 낱장 머리에 `ko` "혈전, 과다복용, 또는 출혈"이 보이므로 surgery·fainting·seizures는 걸러진다.
   이 오답들은 같은 분야에서 틀린 말이라 파일럿 2(a)(b)가 바라는 모양이다. 전수로 보니 `ko`로도 걸러지지 않는 빈칸은 **0건**이다(7.1 sodium/glucose/calcium, 10.1 amio/atropine/bicarb, 15.1 heparin/sodium/potassium 모두 `ko`가 거른다).
   고칠 것은 반대쪽, 곧 **읽기만 해도 걸러지는** 오답이다(아래 빈칸 목록).
2. **확신이 없어 "병원 지침에 따라"로만 쓴 세 가지**
   - **임사 제왕절개 시점(16.1·16.4·S16)** — 근거가 분명하니 why에 쓸 수 있다. AHA(2015 성명·2020 지침)는 심정지 4분 안에 ROSC가 없으면 PMCD를 시작해 5분 안에 분만하는 것을 목표로 한다(이른바 4분 규칙). 지금 why는 틀리지 않았지만, 시점을 빼고 S16 order가 호출을 늦추는 바람에 오히려 틀린 흐름이 됐다(사실 1). base 문장 16.1·16.4는 맞다.
   - **흉골 압박 위치(16.2 base `high on the sternum`)** — **base 문장이 사실과 다르다 → 결정 11 보고**(사실 2). 2010 지침의 "조금 높게"는 2015년 이후 빠졌고, 지금은 보통 환자와 같은 위치다. keyPhrase라 바꾸려면 사용자 결정이 필요하다. 바꾼다면 `Keep compressions in the center of the chest and continuous.`
   - **저체온에서 약물 간격(14.2 base `Space out the medications until his core temperature rises.`)** — **base 문장은 틀리지 않았다.** ERC 2021은 심부 체온 30°C 아래에서 에피네프린을 보류하고, 30~35°C에서는 간격을 두 배(6~10분)로 늘린다. AHA 2020은 재가온과 함께 표준 간격으로 주는 것을 "고려할 수 있다"고 해서 미국 병원마다 다르다. 그래서 "병원 지침에 따라"는 맞는 표현이다. 다만 why를 이 근거로 구체화하면 좋다(아래, 선택).

## 고칠 것 (v46 필드)

### why (11)
- 16.2 · 틀린 손 위치를 설명함(사실 2) → "continuous로 압박을 끊지 말라고 덧붙여요. 손 위치는 예전 지침의 '조금 높게'가 아니라 보통 환자와 같은 가슴 중앙(흉골 아래쪽 절반)이에요 — 병원 지침을 따라요."
- 16.1 · 시점이 빠짐(자기 보고 2) → 둘째 문장 뒤에 덧붙임: "심정지 4분 안에 자발순환이 없으면 시작해 5분 안에 아기를 꺼내는 것을 목표로 해서, 팀을 처음부터 같이 불러요."
- 19.0 · "사전 지시서(DNR)"는 두 가지를 섞음 → "소생을 원치 않는다는 뜻은 DNR 지시나 POLST, 사전 의료 지시서로 확인하고, 없으면 대리인(가족)에게 확인해요."
- 13.1 · 둘째 문장의 한국어가 깨짐("피가 다시 차서 기대지 않는 것이 핵심") → "압박 사이에 가슴이 완전히 올라와야 심장에 피가 다시 차요. 그래서 가슴에 기대지 않는 것이 핵심이에요."
- 20.3 · 압박 보류로 읽힘(사실 4) → "first와 then으로 우선순위를 말해요. 외상성 심정지에서는 큰 출혈을 잡는 일이 먼저지만, 손이 있으면 압박도 함께 해요."
- 20.1 · "압박만큼 중요"가 20.2("압박보다 원인")와 어긋남 → "…지혈과 수혈이 압박보다 앞서요."
- S6 order why · 한국어 깨짐 "두 분 뒤" → "2분 뒤".
- S8 order why · "Okay, Since access is secured의 again이 앞 줄을 가리켜"는 문장이 안 됨 → order를 고친 뒤 새로 씀(아래 S8).
- 12.0 · down time 정의가 S10(10.0 "쓰러진 뒤 흐른 시간")과 다름 → "down time은 쓰러진 뒤 흐른 시간이에요. before CPR started를 붙이면 CPR 없이 지난 시간을 묻는 말이 되고, 이 시간이 예후를 크게 좌우해요."
- 16.0 · "임신 후반"이 모호함 → "임신 20주쯤부터(자궁 바닥이 배꼽 높이 이상) 자궁이 큰 혈관을 눌러…" (낮음)
- 14.2 · (선택) 근거를 구체화 → "space out은 간격을 벌린다는 구동사예요. 저체온에서는 약이 몸에 오래 남아서, 유럽 지침은 30°C 아래에서 에피네프린을 미루고 그 위에서는 간격을 두 배로 늘려요. 미국은 병원 지침에 따라요."

### 빈칸 (blank) — 17문장
숫자 빈칸(`ko`의 숫자가 답을 보여 줌) → 가르치는 말로 옮긴다(새 answer는 `en`에 낱말 경계로 한 번만 나옴):
- 0.3 · `ten` → answer `breathing`: `breathing*/bleeding/swelling/sweating`
- 6.2 · `two` → answer `reassess`: `reassess*/intubate/transfer/sedate`
- (10.0 `eight`은 SBAR 숫자 듣기라 둔다. 낮음)

문법으로 걸러지는 오답:
- 19.0 · `his allergies/complaints/medications not to be resuscitated`는 비문. 그렇다고 `request/choice`를 넣으면 정답이 둘이 됨 → answer `confirmed`: `confirmed*/questioned/ignored/overridden`
- 20.3 · `the bleeding never/last` 비문 → `first*/quickly/briefly/partly`
- 11.4 · `refuse explaining` 비문 → `keep*/start/try/stop`
- 12.4 · `how many fluids` 비문 → `shocks*/doses/breaths/boluses`

장면과 동떨어졌거나 아무도 하지 않을 오답:
- 11.1 · ignore/cancel/hide → `explain*/watch/hear/follow`
- 18.1 · ignore/forget/skip → `fix*/chart/watch/explain`
- 20.2 · ignoring/forgetting/hiding → `fixing*/charting/explaining/discussing`
- 19.2 · medicine/money/food → answer를 `sorry`로 옮김: `sorry*/glad/proud/relieved`
- 9.2 · pharmacy/lobby/nursery → `ICU*/floor/PACU/radiology`
- 8.2 · recovery/discharge/surgery → `medications*/fluids/blood/labs`
- 15.0 · breakfast → `rehab` (`dialysis*/insulin/therapy/rehab`)
- 5.2 · later/eventually/tomorrow(시간 묶음) → answer `Shock`: `Shock*/Epi/Breath/Dose`

예측 가능성(낮음):
- 9.3 · `closely` ↔ rarely/briefly/lightly는 다른 주제와 같은 묶음 → answer `monitor`: `monitor*/chart/clock/door`
- 9.1 · under/beneath/below 셋이 같은 말 → `above*/below/at/near`
- 4.2 · someone/somebody가 같은 말 → `no one*/everyone/someone/the family`

### decoy (15)
`ko`에 맞는 다른 문장이 됨:
- 19.2 · `in the hall` → `I'm so glad` (`ko`에 "그와 함께"가 없어서 장소구는 무엇이든 맞으므로, 첫 청크 자리를 노림)

장면과 동떨어짐 → 같은 분야에서 틀린 조각으로:
- 3.2 `in the morning` → `the stomach to rise`
- 4.0 `the right knee` → `the right armpit`
- 7.3 `next week` → `his glucose level`
- 9.2 `to the roof` → `to the floor`
- 9.4 `to the lobby` → `to the OR`
- 10.3 `last night` → `in the field`
- 11.1 `what's for lunch` → `where to wait`
- 12.1 `last year` → `by the family`
- 15.1 `to lower the fever` → `to lower the potassium` (칼슘이 칼륨을 낮추지 않는다는 why와 맞물림)
- 18.1 `gaining his weight` → `getting his pulse back`
- 18.2 `to the cafeteria` → `to the CT scanner`
- 18.4 `sleeping` → `losing blood`
- 19.1 `his billing` → `his labs`
- 20.2 `the budget` → `the monitor`

### distractorsKo — 약 70문장
(a)는 아무도 하지 않을 말·뒤집기, (b)는 반만 다른 말, (c)는 틀린 사실이다. 모두 같은 상황에서 할 법한 다른 말로 바꾼다. 다음 목록은 "옛 것 → 새 것" 순서다.
- 0.3 (b) `30초 동안 호흡만 확인해 주세요` → `모니터 패드를 먼저 붙여 주세요`
- 1.3 (a) `역할은 나중에 정해 드릴게요` → `압박은 2분마다 교대해 주세요`
- 2.1 (a) 둘 다 → `압박 사이에 가슴이 다 올라오게 하세요` · `30번 누르고 두 번 불어 넣어요`
- 2.2 (a) 둘 다 → `다음 리듬 확인 때 에피네프린을 줄게요` · `압박이 얕아지고 있어요 — 더 깊게 눌러요`
- 2.4 (b) `최대 2인치`·(a) `가끔씩` → `분당 100~120회 속도를 지켜 주세요` · `손을 가슴 중앙에 두세요`
- 3.1 (b) `백은 제가 아니라 당신이 짜세요` → `마스크를 한 치수 큰 걸로 바꿔요`
- 3.2 (a) `가슴이 내려가는 속도를 재 보세요` → `흡인기를 켜 둬 주세요`
- 3.3 (a) 둘 다 → `산소를 15리터로 연결해 주세요` · `입안에 이물질이 있는지 봐 주세요`
- 3.4 (a) `밀착이 새도 계속 짜 주세요` → `입인두 기도기를 넣어 볼게요`
- 4.0 (a) 둘 다 → `패드를 앞뒤로 붙여도 돼요` · `가슴 털이 많으면 먼저 밀어 주세요`
- 4.2 (a) 둘 다 → `산소는 침대에서 떨어뜨려 두세요` · `충전하는 동안 압박을 계속하세요`
- 4.3 (a) `패드 위에 거즈를 덮어 주세요` → `약 패치가 있으면 먼저 떼어 주세요`
- 4.4 (b) `충격을 준 뒤에`·`패드를 떼세요` → `200줄로 충전할게요` · `방전 후 바로 압박을 재개해요`
- 5.1 (b) `심실세동이에요 — 압박을 멈추지 마세요` → `아미오다론 300을 준비해 주세요`
- 5.2 (a)(b) 둘 다 → `에피네프린 1mg 들어갔어요` · `2분 뒤에 리듬을 다시 볼게요`
- 5.4 (a) `방전된 뒤 2분 쉬고 압박하세요` → `다음 리듬 확인 때 압박자를 바꿔요`
- 6.1 (a) `에피네프린은 아직 주지 마세요` → `투여 시각을 기록해 주세요`
- 6.2 (a) 둘 다 → `에피네프린 다음 투여는 3분 뒤예요` · `H와 T를 하나씩 짚어 봐요`
- 6.4 (a) 둘 다 → `다음 투여 시각을 알려 주세요` · `정맥로가 잘 들어가는지 확인해 주세요`
- 7.3 (a) `나트륨 수치를 내일 확인해요` → `혈당도 같이 재 주세요`
- 7.4 (a) `가족에게 혈전약을 주라고 하세요` → `가족에게 복용 중인 약을 여쭤봐 주세요`
- 8.1 (b) `골내로는 들어갔는데 아직 안 흘러요` → `골내로에 가압백을 연결할게요`
- 8.2 (b) `라인은 됐고, 수액만 준비됐어요` → `에피네프린 지금 들어가요`
- 8.4 (a) 둘 다 → `골내로 위치와 시각을 기록해 주세요` · `다리를 움직이지 않게 잡아 주세요`
- 9.0 (a) `모니터를 모두 떼세요` → `산소포화도는 92~98%를 목표로 해요`
- 9.1 (a) `기도 삽관을 지금 제거해요` → `체온 관리를 준비해 주세요`
- 9.2 (a)(b) 둘 다 → `심장내과에 연락해 주세요` · `보호자에게 소식을 전해 주세요`
- 9.3 (a) `모니터는 꺼도 돼요` → `수축기혈압이 85예요`
- 9.4 (a) 둘 다 → `이송용 모니터와 산소를 챙겨 주세요` · `중환자실에 인계 전화를 해 주세요`
- 10.0 (a) `CPR은 아직 시작 안 했어요` → `정맥로는 오른팔에 있어요`
- 10.2 (c) `무수축이고, 충격이 필요해요` → `무수축이고, 압박 중이에요`
- 10.3 (a) `에피는 한 번도 안 줬어요` → `다음 에피는 1분 뒤예요`
- 10.4 (a) `리더에게 알리지 말고 기록만` → `기록자에게 시각을 확인해 주세요`
- 11.3 (a) `팀은 지금 쉬고 있어요` → `의자를 가져다 드릴게요`
- 13.0 (a)(c) 둘 다 → `손을 가슴 중앙으로 옮겨 주세요` · `압박 중단은 10초를 넘기지 마세요`
- 13.1 (a) 둘 다 → `팔꿈치를 곧게 펴 주세요` · `30번 누르고 두 번 환기해요`
- 13.2 (a) 둘 다 → `마스크가 새고 있어요` · `흡인기를 준비해 주세요`
- 13.3 (b) `압박이 너무 깊다고` → `압박 중단 시간이 길다고 나와요`
- 13.4 (a) `이완되기 전에 다시 누르세요`·(b) `손을 떼세요`(이완과 뜻이 겹침) → `2분이 되면 교대할게요` · `압박 속도는 지금이 좋아요`
- 14.0 (b) `따뜻해지면 바로 사망 선언`·(a) → `심부 체온을 식도 탐침으로 재 주세요` · `따뜻한 수액을 준비해 주세요`
- 14.1 (a) 둘 다 → `젖은 옷을 벗겨 주세요` · `가온 담요를 덮어 주세요`
- 14.2 (a) 둘 다 → `심부 체온을 15분마다 알려 주세요` · `체외순환(ECMO) 팀에 연락해 주세요`
- 14.3 (a) 둘 다 → `심부 체온은 28도예요` · `가족에게 상황을 알려 드릴게요`
- 14.4 (b) 둘 다(`바로 선언`·`전에 선언`) → `보호자분께 연락드렸어요` · `따뜻한 수액을 한 번 더 걸어 주세요`
- 15.0 (a)(c) 둘 다 → `투석 카테터가 오른쪽 가슴에 있어요` · `인슐린을 걸러서 고혈당일 수 있어요`
- 15.1 (c)(a) 둘 다 → `중탄산나트륨도 준비해 주세요` · `칼륨 수치가 몇이었나요?`
- 15.2 (a) 둘 다 → `알부테롤 흡입도 준비해 주세요` · `30분 뒤에 혈당을 다시 재 주세요`
- 15.3 (b) `다음 투석이 언제인지` → `투석 혈관이 어느 쪽 팔인지 물어보세요`
- 15.4 (b) 역할 뒤바꾸기·(a) `둘 다 칼륨을 올려요` → `포도당은 저혈당을 막으려고 같이 줘요` · `신장내과에 응급 투석을 요청할게요`
- 16.0 (b) `오른쪽으로`·(a) → `정맥로는 팔에 잡아 주세요` · `태아 모니터는 떼어 주세요`
- 16.2 (a)(b) 둘 다(`흉골 아래쪽`은 오히려 맞는 위치) → `2분마다 압박자를 바꿔요` · `에피네프린은 평소와 같은 용량이에요`
- 16.3 (b) `오른쪽으로` → `누군가 시각을 기록해 주세요`
- 16.4 (a) `산부인과는 부르지 않아도 돼요` → `자궁을 계속 왼쪽으로 밀고 있어요`
- 17.0 (a) 둘 다 → `원인이 된 약 주입을 멈춰 주세요` · `마취과에 기도 확보를 요청해 주세요`
- 17.1 (a) 둘 다 → `두 번째 정맥로를 잡아 주세요` · `원인이 된 약 이름을 확인해 주세요`
- 17.2 (a) 둘 다 → `수액을 최대로 열어 주세요` · `에피네프린 다음 투여는 3분 뒤예요`
- 17.3 (a) 둘 다 → `항히스타민제는 나중에 줄게요` · `산소를 100%로 올려 주세요`
- 17.4 (a) 둘 다 → `이 환자는 조영제를 맞았어요` · `에피네프린을 한 번 더 준비해 주세요`
- 18.0 (a) `잠시 기다리세요` → `에피네프린 다음 투여 시각을 알려 주세요`
- 18.1 (a) `원인은 나중에 찾아요` → `심장내과 선생님을 불러 주세요`
- 18.2 (b)(a) 둘 다 → `12유도를 다시 찍어 주세요` · `칼륨 수치를 다시 확인해 주세요`
- 18.3 (b) `처음부터 맥박이 없었어요 — …` → `리듬은 다시 심실세동이에요`
- 18.4 (a) 둘 다 → `아미오다론을 한 번 더 준비해 주세요` · `가족에게 상황을 알려 드릴게요`
- 19.0 (b) `소생시켜 달라는 그의 뜻` → `가족분이 지금 오고 계세요`
- 19.1 (a) `퇴원시킬 때라고 해요` → `원하시면 곁에 계셔도 돼요`
- 19.2 (a)(b) 둘 다 → `원하시면 원목(채플린)을 불러 드릴게요` · `장례 절차는 나중에 안내해 드릴게요`
- 19.3 (a) `이 소식이 반가우시리라` → `궁금한 게 있으면 언제든 물어보세요`
- 19.4 (b)(a) 둘 다 → `가족분들을 안으로 모실게요` · `사망 시각은 의사 선생님이 선언하실 거예요`
- 20.1 (a)(b) 둘 다 → `골반 고정대를 채워 주세요` · `초음파로 심낭을 봐 주세요`
- 20.2 (a) 둘 다 → `양쪽 가슴을 감압해 주세요` · `혈액을 데워서 주세요`
- 20.3 (a) 둘 다 → `골반 고정대를 채워 주세요` · `대량수혈 프로토콜을 켤게요`
- 20.4 (b) 둘 다 → `흉관을 넣을 준비를 해 주세요` · `산소를 100%로 연결해 주세요`

(0.1·0.2·0.4·1.0·1.1·1.2·1.4·3.0·5.0·5.3·6.0·6.3·7.0·7.1·7.2·8.0·8.3·10.1·11.0·11.1·11.2·11.4·12.x·20.0은 같은 상황에서 할 법한 말이라 그대로 둔다.)

### order (14장) — 줄을 고치면 `why`도 함께 고친다. why는 바뀐 연결어를 가리키게 쓰고, "순서가 하나예요"의 근거도 새로 쓴다.
- S4 · 사실 3. 리듬 분석 없이 충전함 → L2 `They're sticking well — that's V-fib, so I'm charging now.` (`They're`가 L1의 패드를 가리킴, 줄 ko·why도)
- S16 · 사실 1 →
  - L1 `Maternal arrest — call OB and neonatal now.`
  - L2 `While they come, manually displace the uterus to the left.`
  - L3 `With that held, keep compressions continuous.`
  - L4 `If there's no ROSC by four minutes, she may need a perimortem C-section.`
  - why: "호출이 먼저, 그사이 자궁 전위와 압박, 4분에 PMCD 판단".
- S20 · 사실 4 → L4 `Anyone free keeps compressions going while we fix it.` (`it`이 L3의 bleeding을 가리킴). why의 "출혈이 잡히면 압박을 시작해요"도 고침.
- S9 · 사실 6 → L4 `With that target set, get a twelve-lead now and prepare to move to the ICU.`
- S17 · 사실 7 →
  - L3 `While those run, prepare for a difficult airway — the swelling is bad.`
  - L4 `Secure that airway early, before the swelling closes it off.`
- S8 · L4가 L3를 그대로 되풀이하고(`access is secured`), 확보를 선언한 뒤 다시 "흘려보내기"를 해서 3↔4가 자연스럽다 →
  - L2 `Okay, the IO is in the tibia — flushing it now.`
  - L3 `It flushes well, so access is secured — ready for medications.`
  - L4 `Push the epi through that line and flush right after.`
- S6 · 3↔4가 자연스럽다(`If it's still not shockable`의 `still`이 L1을 가리킬 수 있음) → L4 `If that check is still not shockable, repeat it every three to five minutes.` (`that check`이 L3를 가리킴, 14단어) why의 "두 분 뒤"도 고침.
- S10 · 2↔3이 경계선이다(`After all of that`이 L1의 세 라운드를 가리킬 수 있음) → L3 `After those shocks, rhythm is still V-fib, no ROSC yet.` (낮음)
- S11 · 2↔3이 자연스럽다(`From where you're standing`은 지금 선 자리로도 읽힘) → L3 `From that spot, you can see the team doing everything they can for him.`
- S12 · 2↔3이 자연스럽다(`that person`이 L1을 가리킨 채 남음) → L3 `So how long was he down before that CPR started?`
- S13 · 1↔2가 자연스럽다(명령 → 근거 순서도 됨, 13.2 why가 바로 그 방식을 가르침) → L2 `That means push deeper — at least two inches every time.`
- S14 · 1↔2·2↔3이 자연스럽고, L1 `keep going`과 L2 `Keep compressions going`이 되풀이된다 →
  - L1 `Core temp is 27 — he's too cold to call it, so we keep going.`
  - L2 `That means compressions continue while we actively rewarm him.`
  - L3 `During that rewarming, space out the epi per our protocol.`
  - L4 `Once he's warm and those doses are in, we'll decide whether to stop.`
- S15 · 3↔4가 자연스럽다(`While that works`의 `that`이 L2의 칼슘으로 읽힘) → L4 `While the insulin works, ask exactly when his last dialysis was.`
- S19 · L4 `Now that we've stopped, I'm so sorry — …`가 어색하고, 같은 주제 swap이 가르치는 "died를 한 번은 분명히"도 빠졌다 → L4 `I'm so sorry, he has died — take all the time you need with him.` (줄 ko `정말 안타깝게도 돌아가셨어요 — 필요한 만큼 곁에 계세요`)

선택(낮음):
- S0: AHA BLS는 반응이 없으면 맥박 확인 전에 도움을 부른다 → L2 `Still nothing — get help! I'm checking his breathing and pulse.`
- S5: AHA는 충전하는 동안 압박을 이어 가라고 한다 → L2 `That's V-fib — keep pushing while I charge to 200.` L3는 `It's charged — everybody clear, delivering the shock.`
- S2 L3: `so you can hold that depth` → `so we keep that depth`
- S18 L3: `Since it keeps happening`은 심도자실 이송의 근거가 아니다 → `If the twelve-lead shows a STEMI, we may need urgent transfer to the cath lab.` L4는 L2를 되풀이하므로 → `Until we get there, keep running the H's and T's.`

(S1·S3·S7은 교환 셋 모두 어색해 그대로 둔다.)

### context `word`·`ko` (3)
- S0 · 어색한 장면의 문제는 `code`라는 말인데 `word: call`이고, 장면 2에는 call이 없다 → `word: code`, `ko: 코드(응급 호출)`
- S2 · `push`가 장면 2·3에 없다 → 장면 2 `Pushing at about 90 a minute — below target.`, 장면 3 `Excuse me, would you mind possibly pushing a little faster?` (fix는 그대로)
- S18 · `lose`가 장면 2·3에 없고, 어색한 장면의 말은 `re-arrest`다 → `word: re-arrest`, `ko: 재정지되다`. 장면 1은 `He re-arrested — restart compressions!`로 바꾼다.

### 문장 아이콘 (3, 낮음)
- 9.4 `plane` → `hospital`
- 15.4 `handshake2` → `bulb`
- 20.1 `pill` → `bandage`

## 결정 11 · base 보고 (v46 범위 밖, 고치지 않고 보고만)
- 16.2 `Keep compressions high on the sternum and continuous.` (**keyPhrase**) — 2015년 이후 지침과 어긋난다(사실 2). 바꾼다면 `Keep compressions in the center of the chest and continuous.`이고, `ko` `흉골 위쪽에서`도 함께 바꾼다. 사용자 결정이 필요하다.
- 10.3 `We've given epi twice so far in this round.` — 한 라운드(2분)에 에피 두 번은 3~5분 간격과 어긋난다(사실 5) → `…twice so far in this code.`
- 20.3 `Control the bleeding first, then start compressions.` — 압박을 보류하라는 말로 읽힌다(사실 4) → `Control the bleeding first — compressions come second here.` 같은 모양으로 바꾸거나 why로만 보완한다.
- 17.3 ko `근육이 아니라 정맥으로` — en `not just the muscle`은 "근육만이 아니라"라는 뜻이라 ko와 어긋난다(why도 "이미 하던 방식에 더해"). ko를 `근육주사만 하지 말고 정맥으로 바로 주세요`로 바꾼다.
- 17.4 `…watch his airway swell.` — 붓기를 기다려 지켜보라는 뜻으로 들려 부자연스럽다 → `…and watch for airway swelling.` (낮음)
- 19.2 ko `정말 죄송해요` — why는 "사과가 아니라 위로"라고 하는데, 한국어 `죄송해요`는 사과다. `정말 안타까워요`가 맞다(낮음).
- 8.2 ko `확보됐고, 투약 준비됐어요` — 주어가 없다 → `정맥로가 확보됐고, 투약 준비됐어요` (낮음)
- 문장 `chunks`가 구 경계를 끊은 것(보고만): 3.2 `with each / breath`, 10.4 `and time / down`, 14.2 `until his core / temperature rises`.
- 번역 투(낮음): 7.3 `그의 칼륨 수치`, 11.0 `그를 위해`, 11.2 `그가`, 19.0 `그의 뜻` → `환자분`으로.

## 고칠 것 개수
- why 11 · 빈칸 17문장 · decoy 15 · distractorsKo 약 70문장(오답 약 105개) · order 14장(선택 4장 별도) · context 3 · 아이콘 3
- **합계 약 133**
- 그중 사실·안전에 관한 것: order 6장(S4 S16 S20 S9 S17 S8), why 3건(16.2 19.0 20.3), 틀린 사실을 담은 distractorsKo 4건(15.0 10.2 13.0 15.1)
- 결정 11 보고 9 (그중 사실 오류 3: 16.2[keyPhrase] 10.3 20.3)

## 종합
문장 why의 임상 설명과 빈칸 정답의 유일성은 좋다(`ko`로도 걸러지지 않는 빈칸 0건, decoy가 `ko`에 맞는 것 1건).
그러나 다음은 고쳐야 내보낼 수 있다:
- order 6장의 임상 흐름: 리듬 분석 생략, 산과 호출 지연, 압박 보류, 12유도·기도를 조건에 묶음
- 인접 교환이 자연스러운 8장
- distractorsKo의 뒤집기·틀린 사실 패턴(약 70문장)
- 동떨어진 빈칸 오답·decoy

위 목록을 반영하고 V18·V19를 다시 통과시키면 내보내도 된다. 16.2(keyPhrase 손 위치)·10.3·20.3 문장 자체는 사용자 결정을 기다린다.
