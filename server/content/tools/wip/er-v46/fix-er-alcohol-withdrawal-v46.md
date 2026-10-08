# er-alcohol-withdrawal — v46 보강 검토 (er)

대상: `er-alcohol-withdrawal.yaml` (상황 21 · 문장 126 · order 21장 · 뉘앙스 context 11 · swap 11). 문장 126개와 order 카드 21장(84줄)을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 음주력·마지막 음주 문진 … S20 = 중증 금단 야간 급변 인계). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 504줄, decoy를 청크 자리마다 끼워 넣은 조립과 한 청크를 대신한 조립(약 1,300줄), order 인접 교환 63가지(21장 × 3),
context `word`가 세 장면 `en`에 있는지와 base 대비 바뀐 장면·`fix`·`why`, swap 11건(`ko`와 선택지), 빈칸 정답·오답·decoy 낱말의 주제 안 중복.
`verify_one_theme.py er …/er-alcohol-withdrawal.yaml` → `==> 통과`(W13 경고 3 — v45 단어 오답 `carry`·`plane`·`store`, 이번 범위 밖).
아래에서 새로 제안한 빈칸 answer(5.0·5.3 `medication`, 7.3 `seeing`)는 `en`에 낱말 경계로 정확히 한 번 나온다. 새 order 줄은 모두 15단어 이하이고 인접 교환 세 가지를 다시 읽었다.

판정 기준(앞 주제 검토와 같음):
- 낱장 머리에 `ko`가 보이므로 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. `ko`로 걸러지는 임상적으로 맞는 오답은 "참고"로만 적었다.
- decoy는 한 청크를 대신하거나 끼워 넣어 **`ko`에 맞는 다른 문장**이 될 때만 고칠 것으로 셌다. 덧붙은 말이 `ko`에 없는 뜻이면 통과.
- context는 `review-ctx-A/B/C`와 같은 기준: `word`가 세 장면에 있고 XX가 듣는 사람에게 맞지 않는 말이면 된다. 어색함을 `word` 옆의 임상어(약어·용어)가 맡는 것도 허용(C의 `allergy`·`output`과 같음). "그냥 말투"만 다르거나 XX가 실제로 흔히 하는 말이면 고칠 것.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식의 이유를 짚는다. 금단 시작 6~24시간(0.5), 티아민 전 포도당 위험(3.1), CIWA 시각 항목(7.3), 베르니케 세 징후(8.0), 확진 전 티아민(8.1·8.5), K·Mg 교정 중 심장 감시(9.2), 간질환의 응고인자·진정제 선택(12.1·12.5), 자살 직접 질문(13.1), 작화(17.5), 배양 먼저(18.1) — 모두 맞다. 고칠 것 5: 3.4 "예외 없는 원칙"(저혈당이면 포도당을 미루면 안 됨 — 심각 1), 16.2 "삽관으로 넘어가는 것이 정해진 순서"(과장), 10.2·19.2·19.5는 `ko`를 영어 구문 풀이로 되풀이. |
| 2 | 빈칸 | 3 | `ko`로도 **정답이 둘**인 것 3(0.4 `anyone`, 8.4 `funny`, 17.4 `erased`). **처치 논리를 뒤집거나 위험한 감시 간격을 보이는 오답 3**(5.0·5.3 "점수가 낮으니 약을 더", 4.5 만취 환자 `forty/fifty minutes`). **문법·전치사로 걸러지는 것 3**(7.3 `hardly/barely`, 14.2 `in the weekends/vacations`, 18.5 `feel any noise`). **동떨어진 말 7**(5.1 `price/color`, 10.5 `paperwork/billing/laundry`, 13.2 `laundry/kitchen`, 13.5 `billing/front-desk/parking`, 15.3 `height/hearing/weight`, 16.4 `menu/ticket`, 19.1 `crowd/queue/budget`). 묶음 돌려쓰기: `hungry` 5문장, `briefly` 6·`quietly` 5, `quiet/busy/warm` 14.1·14.4 같은 셋, `oxygen/saline`이 약 자리마다. |
| 3 | `decoy` | 4 | `ko`에 맞는 다른 문장이 되는 것은 없다(0.2 `to quiz you`가 경계 — 참고). 고칠 것 2: 2.1 `once a day`(조립하면 "하루 한 번 떨림을 묻는다" — 감시 간격을 틀리게 보임), 10.3 `you can treat at home`(낙상을 "그냥 멍"이라 축소하는 환자에게 "집에서 치료할 부상"을 조립). `paperwork` 계열 decoy 5개(2.2·16.2·17.1·17.4·20.1)는 돌려쓰기(선택). |
| 4 | `distractorsKo` | 4 | 거의 다 같은 상황의 다른 문장 뜻이라 실제로 할 말이고, 정답을 뒤집은 것("절대 ~")이 없다. 고칠 것 2: 15.0 "지금 혈압과 심박수가 높아요"(정답 `hypertensive, tachycardic`의 반쪽 — 심각 4), 0.5 두 오답 "하루에 몇 잔 드세요?"·"보통 얼마나 드세요?"가 같은 질문. |
| 5 | `order` | 3 | `If` 줄 2개는 실제 조건부다(아래 자기 보고 2). 감시·투약을 다른 일 뒤로 미루는 시간 묶음은 없다. 그러나 **인접 교환이 열린 카드 7장**(S3 2↔3 약하게, S5 2↔3, S9 2↔3, S12 3↔4, S14 1↔2, S17 3↔4, S19 3↔4), **임상 인과가 틀린 줄 1**(S5 L4 환각 보고를 용량 변화 탓으로 — 심각 2), **답을 전제한 줄 1**(S1 L2 `With that timing … fit`), **듣는 사람이 바뀌는 카드 1**(S15 L2 "의사가 필요해요" → L3 의사에게 "오더해 주세요"), **억지 연결어 4**(S0 L3 `with that amount in mind`, S4 L3 `Because you'll be staying right there`, S8 L4 `Alongside that watching`, S11 L2 `That's true even though`). |
| 6 | `tag`·`icon` | 4 | 한국어 10자 이하, 상황 안에서 일관. order 21장 모두 `대화 흐름`·`compass`. 고칠 것 2: 4.4 `호출 요청`(부르라는 말이 문장에 없음), 8.0 `소견 보고`(보호자에게 하는 말 — `소견 설명`). |
| 7 | context `word`·`ko`, swap `ko` | 4 | 11문항 모두 `word`가 세 장면에 있다(W14 0). swap `ko` 11건은 모두 정답을 넣은 문장의 뜻이다. 고칠 것 4: S4 `fall`(XX `You are a high fall risk`는 간호사가 환자에게 실제로 흔히 하는 말이라 어색함이 약하고, why "fall risk는 의료진끼리의 말"은 사실과 다름), S0 `drink` `ko`(세 장면 모두 명사 drink(s)인데 `ko`가 동사 "술을 마시다"), S9 `magnesium` XX(`low magnesium and hypokalemia` — W14용 끼워 넣기), S20 `benzo` 차트(`Benzo:` 머리말 — 끼워 넣기). |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘 없음 — 확인. (2) 동떨어진 빈칸 오답 7문장과 `hungry`·`briefly`·`quietly` 돌려쓰기가 앞 주제와 같은 갈래로 남았다. 관사로 걸러지는 오답은 없다. (3) order: `And/Also/Then` 없음, 앞 줄을 가리키는 말을 쓰려 했으나 억지 연결어 4·열린 교환 7. (4) 임상: 티아민·포도당 순서와 즉시 티아민, 발작·DT의 벤조 즉시 투여, 기도 준비를 미루지 않는 흐름은 정답·order 모두 맞다. 어긋난 곳은 3.4 why, S5 L4, 5.0·5.3·4.5·2.1의 오답. (5) decoy·오답 뜻 겹침: 15.0 한 곳. |

## 사실 오류·심각한 문제

1. **3.4 why `always를 넣어 예외 없는 원칙이라고 알려요`** — 문장(정본) `We always give thiamine before any glucose` 자체는 습관으로 가르칠 만하지만, why가 "예외 없음"을 못 박으면 **저혈당 환자에게 포도당을 티아민 뒤로 미루는** 해석을 부른다. 저혈당이면 포도당을 미루지 않고 티아민을 함께(또는 곧바로) 준다. → Y1.
2. **S5 order L4 `With the dose changing like that, tell me right away if you see or feel things that aren't there.`** — 환각을 "용량이 바뀌니까" 생기는 것처럼 묶었다. 환각은 금단이 심해지는 신호(같은 상황 5.2 why도 그렇게 말함)이지 용량 변화의 결과가 아니다. 게다가 L1 → L3 → L2로 바꿔 읽어도 자연스러워 2↔3이 열려 있다. → O5.
3. **8.4 빈칸 `funny`** — `watching … for anything funny`는 미국 구어에서 "이상한 것"이라는 뜻의 흔한 말이라 정답 `unusual`과 같다. `ko` "이상이 없는지"에도 그대로 맞는다. → B2.
4. **15.0 distractorsKo `지금 혈압과 심박수가 높아요`** — 정답 `hypertensive, tachycardic`이 바로 그 뜻이다. 듣고 고를 때 정답이 둘이다. → K1.
5. **처치·감시를 뒤집는 오답** — 5.0 `Your withdrawal score is low/normal/stable, so I'm giving you medication`, 5.3 `A low score means we need more medication right now`는 점수가 낮은데 벤조를 더 주는 말(과진정)을 조립한다. 4.5 만취 환자에게 `every forty/fifty minutes`, 2.1 decoy `Once a day I ask about shaking…`은 이 주제의 핵심인 감시 간격을 틀리게 보인다. → B14·B15·B16·D1.
6. **S15 order 듣는 사람이 바뀜** — L2 `I need a physician now`(의사를 부르는 말, 듣는 사람은 동료)와 L3 `please order aggressive benzodiazepine sedation`(의사에게 하는 말)이 한 카드에 이어진다. → O11.

## 저작자 자기 보고 3건 판정

### 1. 기능어·감정 형용사 자리에서 옮긴 빈칸(how much, in a day, heart rhythm, infection)과 `ko`로만 걸러지는 오답(tired/hungry/angry)
**판정: 넷 다 받아들인다. `tired/hungry/angry`도 둔다. 다만 `hungry` 돌려쓰기는 줄인다.**
- 0.0 `how much` ↔ `how long/how fast/how soon`: `how fast`는 문진으로도 의미가 있지만 `ko` "얼마나 드시는지"(양)가 가른다. `how soon`은 어색하지만 비문은 아니다. 유지.
- 0.3 `in a day` ↔ `in a week/month/hour`: `in a week`는 미국 문진에서 표준 질문(NIAAA 주당 기준)이라 영어로는 정답이지만 `ko` "하루에"가 가른다. 유지(참고).
- 9.2 `heart rhythm` ↔ `appetite/posture/vision`: 같은 자리의 신체 관찰 명사라 좋다. 유지.
- 18.0 `infection` ↔ `ulcer/injury/allergy`: 관사 `an`까지 맞춘 좋은 묶음. 다만 같은 상황 18.3·18.4도 정답이 `infection`이라 한 상황에 같은 빈칸이 셋이다(선택: 18.3은 `high`로 옮기기 — `low/mild/brief` fever).
- 11.1 `When you're tired/hungry/angry`: "준비되면"의 자리에 감정·몸 상태 형용사라 문법은 맞고 뜻은 틀린다. `sober`·`discharged`는 정답이 될 수 있어 피한 판단이 맞다. 유지. 그러나 `hungry`가 4.2·8.3·11.1·13.4·20.2 다섯 문장에 나온다 — 8.3·13.4·20.2는 바꾼다(B17).

### 2. 유지한 `If` 줄 2개(ICU 병상, 단계 상향)
**판정: 둘 다 실제 조건부다. 유지.**
- S16 L3 `If that dose doesn't break the seizure, we escalate.` — 2차 약(페노바르비탈·프로포폴 등)과 삽관으로 올리는 것은 벤조로 멈추지 않을 때만 한다. 기도 보호와 흡인·산소는 L2에서 조건 없이 지금 하고, L4 기도 카트도 "지금" 가져오라 해서 TASK 10의 "모든 환자에게 하는 일을 조건부로" 오류가 아니다. (L3↔L4 교환은 약하게 열려 있음 — 참고.)
- S15 L4 `If he doesn't respond to that sedation, we may need an ICU bed.` — 벤조 요구량이 많거나 반응이 없으면 ICU로 올리는 것이 실제 기준이고, `may`로 가능성만 말한다. 같은 상황 15.2·15.5의 `possibly ICU`와도 맞다. 유지. (다만 L2·L3은 심각 6으로 고친다.)

### 3. context 정비(EtOH 대신 drink, 장면을 고친 6건, 그대로 둔 CIWA·fall·dose·spiders)
**판정: drink 선택과 장면 정비는 대체로 받아들인다. 그대로 둔 넷 중 `fall`만 고친다. 고친 6건 중 2건(magnesium XX, benzo 차트)은 끼워 넣기라 다시 쓴다.**
- S0 `drink`: `EtOH`는 ✓ 환자 장면에 넣을 수 없으니 세 장면에 자연스럽게 있는 `drink`를 고른 것이 맞다(C `allergy`처럼 어색함은 옆의 `EtOH`·`standard drinks`가 맡음). XX에 덧붙인 `in standard drinks`는 실제 문진 용어라 끼워 넣기로 보지 않는다. 다만 `ko`가 틀림 → C2.
- S14 `drink`: 차트 `Pt denies drinking EtOH`는 조금 겹치지만 실제 쓰는 기록이다. 유지.
- S12 `skin`: 차트 `Jaundiced skin, scleral icterus…`, XX `Your skin is jaundiced and you have ascites from your cirrhosis.` 둘 다 자연스럽다. 유지.
- S16 `status`: 차트 `Status epilepticus >5 min`은 정의(5분 이상)와도 맞고 base보다 정확하다. 유지.
- S18 `infection`: XX `septic from the infection`은 감염을 이미 확정한 듯하지만 영어로 자연스럽고 어색함은 `septic`·`pan-culturing`이 맡는다. 유지.
- S9 `magnesium` XX `Your low magnesium and hypokalemia are causing ectopy.` — 쉬운 말과 용어를 한 문장에 섞은 W14용 끼워 넣기 → C3.
- S20 `benzo` 차트 `Benzo: lorazepam 2 mg IV x3…` — 차트는 약 이름을 적지 `Benzo:` 머리말을 달지 않는다 → C4.
- 그대로 둔 넷:
  - `CIWA`(S1): ✓ 환자 장면이 `a checklist called CIWA`로 풀어 쓰는 방식(B 총평 1에서 허용). XX `CIWA-Ar … meet criteria for symptom-triggered dosing`은 분명히 어색. 유지.
  - `dose`(S5): 세 장면 `dose`/`dosing`이 같은 어간이고 XX는 `symptom-triggered dosing per the CIWA protocol`로 어색함이 분명. 유지.
  - `spiders`(S7): XX `There are no spiders. You're hallucinating.`의 어색함은 환자에게 붙인 임상 이름표(`hallucinating`)와 단칼 부정이다. 듣는 사람은 ✓ 장면과 같지만 의료진 말(차트 `visual hallucinations`)을 환자에게 그대로 쓴 대비라 C 기준으로 허용. 유지.
  - `fall`(S4): 고칠 것 → C1.

## 고칠 것 (44건)

### why (5)
- **Y1 · 3.4 why** · "예외 없는 원칙" — 저혈당에 포도당 지연을 부를 수 있음(심각 1) · → "always로 습관처럼 지키는 순서라고 알려요. 알코올 관련 환자에게는 포도당 수액 전에 티아민을 줘요 — 다만 저혈당이면 포도당을 미루지 않고 티아민을 함께 줘요."
- **Y2 · 16.2 why** · "약으로 발작이 멈추지 않으면 기도 확보(삽관)로 넘어가는 것이 정해진 순서예요" — 단계 상향은 2차 약이고 삽관은 그에 따르는 기도 확보이며, 기도가 위험하면 순서와 상관없이 한다 · → "If로 다음 단계를 미리 말해 두면 팀이 준비해요. 벤조로 멈추지 않으면 2차 약으로 올리고, 그때 기도를 지키려고 삽관을 준비해요."
- **Y3 · 10.2 why** · 첫 문장 "머리를 부딪혔는지와 넘어진 걸 기억하는지를 한 문장에 묻고 있어요"는 `ko` 되풀이 · → "두 가지를 한 번에 물어 머리 부상 가능성을 빨리 가려요. 넘어진 순간이 기억나지 않으면 의식을 잃었을 수 있다는 단서예요."
- **Y4 · 19.2 why** · 구문 뜻풀이뿐(`ko` 되풀이) · → "Keep him on으로 지금 하는 감시를 끊지 말라고 하고, call … back in으로 이미 봤던 의사를 다시 부른다는 걸 분명히 해요. 진정을 늘리는 중이라 감시와 호출을 한 문장에 묶어요."
- **Y5 · 19.5 why** · 구문 뜻풀이뿐 · → "going으로 감시를 멈추지 말라고 하고, 문장 끝의 now로 호출이 미룰 일이 아님을 못 박아요. 급변 중에는 지시를 짧게 둘로 나눠 말해요."

### 빈칸 (16)
정답이 둘(3)
- **B1 · 0.4** `anyone` — `I ask anyone these questions`는 "누구에게나 묻는다"로 정답과 뜻이 거의 같다 · → `anyone` → `only you`(반대 방향, 문법 맞음).
- **B2 · 8.4** `funny` = `unusual`(구어, 심각 3) · → `funny` → `pleasant`.
- **B3 · 17.4** `erased` — `some damage cannot be erased`는 "되돌릴 수 없다"와 같은 뜻 · → `erased` → `measured`.
문법·전치사로 걸러짐(3)
- **B4 · 7.3** `hardly/barely` 뒤에 `what`절이 와 비문(`secretly`만 성립) · → 빈칸을 `seeing`으로 옮김: `seeing / eating / reading / drinking`.
- **B5 · 14.2** `in the weekends`·`in the vacations`는 미국 영어 전치사가 틀려 걸러짐 · → `mornings / afternoons / evenings / summers`.
- **B6 · 18.5** `feel any noise`는 비문, `hunger/thirst`도 장면과 동떨어짐 · → `pain / relief / sleepiness / hunger`(`pressure`·`burning`은 정답이 될 수 있어 피함).
동떨어진 말(7)
- **B7 · 5.1** `price/color/label` · → `dose / label / brand / wristband`.
- **B8 · 10.5** `paperwork/billing/laundry` · → `withdrawal / discharge / transfer / visit`(같은 병원 업무 명사, 넣으면 틀린 말).
- **B9 · 13.2** `dental/laundry/kitchen` · → `psychiatry / dental / radiology / physical therapy`.
- **B10 · 13.5** `billing/front-desk/parking` · → `psychiatry / dermatology / orthopedic / radiology`(13.2와 겹치지 않게).
- **B11 · 15.3** `height/hearing/weight` · → `heart rate / oxygen level / urine output / weight`.
- **B12 · 16.4** `form/menu/ticket` · → `cart / chart / sign / bed`.
- **B13 · 19.1** `crowd/queue/budget` · → `storm / fever / bleeding / cough`(진정으로 조절하지 않는 같은 분야 말).
처치·감시를 뒤집는 오답(3, 심각 5)
- **B14 · 5.0** `low/normal/stable` — 점수가 낮은데 약을 주는 조립 · → 빈칸을 `medication`으로 옮김: `medication / a snack / a blanket / a brochure`.
- **B15 · 5.3** `low/small/short` — "점수가 낮으면 약이 더 필요" · → 빈칸을 `medication`으로 옮김: `medication / tests / blankets / visitors`.
- **B16 · 4.5** `forty/fifty` — 만취 환자에게 위험하게 긴 감시 간격 · → `fifteen / five / two / ten`(더 짧은 쪽은 틀려도 위험한 간격을 가르치지 않음; `ko` "십오 분"이 가름).
돌려쓰기(1)
- **B17 · 8.3·13.4·20.2** `hungry` 다섯 문장 돌려쓰기 · → 8.3 `steady / cheerful / hungry` → `steady / strong / fast`, 13.4 `rested / warm / hungry` → `rested / warm / dressed`, 20.2 `talkative / cheerful / hungry` → `talkative / cheerful / calm`.

### decoy (2)
- **D1 · 2.1** `once a day` — `Once a day I ask about shaking, sweating, and how you feel.`로 조립돼 감시 간격을 틀리게 보임(심각 5) · → `about your job`.
- **D2 · 10.3** `you can treat at home` — `…causes an injury you can treat at home right away.`가 "그냥 멍"이라는 환자의 축소를 거든다 · → `you can see in a mirror`.

### distractorsKo (2)
- **K1 · 15.0** `지금 혈압과 심박수가 높아요` — 정답의 반쪽(심각 4) · → `1:1 안전 관리가 필요해요`.
- **K2 · 0.5** 두 오답이 같은 질문 · → 둘째 `보통 얼마나 드세요?` → `혼자만 여쭤보는 게 아니에요`.

### order (13)
- **O1 · S0 L3** · `with that amount in mind, when was your last drink?` — 마지막 음주 시각은 양과 상관없이 묻는 말이라 억지 연결 · → `Thanks for telling me that. When was your last drink?` (10, `that`이 L2의 답을 가리킴).
- **O2 · S1 L2** · `With that timing, your shaking and sweating fit early alcohol withdrawal.` — 환자가 답할 시각이 금단 초기에 맞는다고 전제 · → `Depending on that time, the shaking and sweating may be early withdrawal.` (12).
- **O3 · S3 L3 (2↔3 약하게 열림)** · `That's why`가 L1 "뇌를 보호해요" 바로 뒤에도 읽힘 · → `Because you may be low, we give it before any sugar or glucose fluids.` (14, `low`가 L2를 가리킴).
- **O4 · S4 L3** · `Because you'll be staying right there, I'll be checking on you often` — 자주 보는 이유는 침대에 있어서가 아니라 의식 저하 · → `While you rest there, I'll be checking on you often to make sure you're okay.` (15). L4는 `That means every fifteen minutes, until you're more awake.` (9)로 L3에 묶기.
- **O5 · S5 L3·L4 (심각 2, 2↔3 열림)** · → L3 `If you start to see or feel things that aren't there, tell me right away.` (15) / L4 `Whatever you notice, I'll check again and adjust the dose each time.` (12). 교환: 1↔2 `It will calm`이 먼저 오면 가리킬 것이 없음, 2↔3 L1 바로 뒤 L3은 되지만 그다음 `It will calm`이 환각을 가리켜 깨짐, 3↔4 `Whatever you notice`가 앞에 오면 깨짐.
- **O6 · S8 L4** · `Alongside that watching`은 부자연스러운 영어 · → `While I watch, how long has he been confused, and has he eaten?` (13, 식사 질문 유지).
- **O7 · S9 L3 (2↔3 열림)** · `To see how your heart responds to that`의 `that`이 L1의 낮은 수치도 가리켜 L2와 바꿔도 읽힘 · → `As those go in, we're watching your heart rhythm on the monitor.` (12, `those`가 L2의 보충을 가리킴).
- **O8 · S11 L2** · `That's true even though you've been here before.`는 "그 말이 맞다"로 읽혀 어색 · → `That goes for every visit, even if you've been here before.` (11).
- **O9 · S12 L4 (3↔4 열림)** · `So we'll treat…`가 L2 바로 뒤에도 자연스럽고, L3을 뒤로 보내도 `both of those signs`가 성립 · → `Because of that risk, we'll treat the withdrawal carefully and support your liver.` (13, `that risk`가 L3을 가리킴).
- **O10 · S14 L1 (1↔2 열림)** · L2 질문 뒤에 `Whatever you tell me is fine`이 와도 자연스러움 · → `I'm going to ask you something, and whatever you tell me is fine.` (13, L2보다 앞서야만 성립).
- **O11 · S15 L2·L3 (심각 6)** · 듣는 사람을 의사로 통일 · → L2 `On top of that, CIWA is off the scale — please come now.` (11) / L3 `Given all that, please order aggressive benzo sedation and one-to-one safety.` (11).
- **O12 · S17 L2~L4 (3↔4 열림)** · L4 `That's why … urgent thiamine`이 L2 바로 뒤에 더 자연스럽고, 작화 설명(L3)은 thiamine의 이유가 아님 · → L2 `From what you describe, he's filling memory gaps with stories — not on purpose.` (13) / L3 `That pattern suggests the thiamine deficiency has advanced.` (8) / L4 `So we're giving urgent high-dose thiamine, though some damage may be lasting.` (12).
- **O13 · S19 L4 (3↔4 열림)** · `Call the physician back in now`이 L2 바로 뒤에도 자연스럽고 `the monitor`는 L3 없이도 성립 · → `Call the physician back in now and report what that monitoring shows.` (12, `that monitoring`이 L3을 가리킴).

### tag (2)
- **T1 · 4.4 tag** `호출 요청` — 문장에 부르라는 말이 없음 · → `낙상 예방`.
- **T2 · 8.0 tag** `소견 보고` — 보호자에게 하는 말 · → `소견 설명`.

### context (4)
- **C1 · S4 `fall` XX** · `You are a high fall risk. Remain in bed.` — `fall risk`는 환자에게도 흔히 말하고(노란 양말·표지) 어색함이 명령조에만 있음, why "fall risk는 차트와 의료진끼리의 말"은 사실과 다름 · → en `Your Morse score makes you a high fall risk. Remain in bed.` / why "Morse 점수 같은 평가 이름과 명령조 remain은 환자에게 딱딱하게 들려요. 넘어질까 걱정하는 이유와 함께 부탁해요." (fix 그대로).
- **C2 · S0 `drink` ko** · 세 장면 모두 명사(drinks·last drink·standard drinks)인데 `ko`가 동사 · → `ko: 술(한 잔)`.
- **C3 · S9 `magnesium` XX** · W14용 섞어 쓰기 · → en `Your magnesium and potassium are low, so you're having ventricular ectopy on tele.` / why "ectopy·tele 같은 말은 의료진끼리의 말이에요. 환자에게는 '칼륨·마그네슘이 낮아서 심장이 두근거릴 수 있어요'처럼 풀어 말해요." (fix 그대로).
- **C4 · S20 `benzo` 차트(장면 1)** · `Benzo:` 머리말은 차트에 쓰지 않음 · → en `CIWA 12 to 22 despite benzo x3 (lorazepam 2 mg IV since 0200).`

## 참고 (고칠 것 아님)
- `ko`로 걸러지지만 영어·임상으로는 맞는 오답: 0.3 `in a week`, 5.2 `smell/taste`(환각 감각), 14.0 `headache`(CIWA 항목), 14.1 `warm`(warm and safe), 15.4 `aggressive hydration`(DT에 실제 필요), 17.1 `daily`(고용량 티아민은 하루 여러 번), 18.2 `headache`·`rash`(발열 환자의 감염원 질문). 학습자가 `ko`를 보고 고르므로 둔다.
- 경계 decoy: 0.2 `to quiz you`(`I'm not here to quiz you`는 "캐묻다"라 `ko` "판단"과 다름), 0.4 `feel left out`.
- 덜 걸리는 order 교환: S6 1↔2(`I'm keeping the rails up`이 먼저 와도 뜻은 통함), S7 L2 `Even so`(약간 어색), S16 3↔4(위 자기 보고 2).
- 빈칸이 기능어인 곳: 12.3 `because`(`although/unless/until`) — 걸러지긴 하나 가르치는 말이 아님. 1.5 `receipt`, 9.3 `freezing/shrinking/glowing`, 12.4 `teeth`는 동떨어진 편(선택).
- 한 상황에 같은 정답 빈칸: S1 `checklist` 2, S18 `infection` 3, S16 `intubate` 2(오답 `vaccinate`도 겹침).

## 종합
고칠 것 **44건**(why 5 · 빈칸 16 · decoy 2 · distractorsKo 2 · order 13 · tag 2 · context 4). 사실 오류는 3.4 why와 S5 order L4 두 곳이고, 정답이 둘인 곳은 빈칸 3(`anyone`·`funny`·`erased`)과 오답 뜻 1(15.0)이다.
티아민 먼저·즉시 티아민, 발작·DT의 벤조 즉시 투여, 기도 준비를 미루지 않는 흐름은 정답과 order에서 일관되고 `If` 줄 둘도 실제 조건부라 뼈대는 좋다. 심각 1~6을 반영하면 내보내도 된다.
