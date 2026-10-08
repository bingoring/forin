# er-anaphylaxis — v46 보강 검토 (er)

대상: `er-anaphylaxis.yaml` (상황 21 · 문장 105 · order 21장 · 뉘앙스 context 12 · swap 8). 문장 105개와 order 카드 21장(84줄)을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 알레르기력·노출원 문진 … S20 = 관찰 중 급변 야간 SBAR). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 420줄, decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립(약 1,000줄),
order 인접 교환 63가지(21장 × 3)와 줄 단어 수, context `word`가 세 장면 `en`에 있는지와 base 대비 바뀐 장면·`fix`·`why`, swap 8건(정답을 넣은 문장과 `ko`).
`verify_one_theme.py er …/er-anaphylaxis.yaml` → `==> 통과`(W13 경고 2 — v45 단어 오답 `lately`·`carry`, 이번 범위 밖).
아래에서 빈칸을 옮기자고 한 새 answer(`tighten`·`safe`·`different`·`bedside`·`pulse`·`trigger`)는 모두 `en`에 낱말 경계로 정확히 한 번 나온다. 새 order 줄은 15단어 이하이고, 인접 교환 세 가지를 다시 읽었다.

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. decoy를 끼워 넣은 조립은 덧붙은 말이 `ko`에 이미 담긴 뜻일 때만 "ko에 맞는 다른 문장"으로 셌다(앞 주제 검토와 같은 기준).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식의 이유를 짚는다. 확인해 맞는 것: 2.0 기도·혈압 증상의 치료는 에피네프린, 5.0 항히스타민·스테로이드를 기다리지 않음, 8.1 5~15분 간격 반복, 11.0·11.4 베타차단제와 글루카곤 기전, 12.0·12.1 임신 중에도 에피 1차·좌측위로 대정맥 압박 해소, 14.0 0.01 mg/kg, 16.0 근주 불응 시 지속 주입, 4.0·4.3 에피펜 파란 마개·주황 끝·딸깍. 고칠 것 5: **7.2("진행하면" 놓는다 — 어떤 신호에 바로 놓는지가 없음, 안전)**, 7.0(라인 flush 때 남은 항생제), 11.3(메타 문구 "사실이에요"), 16.4("is going in"을 수동태라 함 — 문법 오류), 17.3(크게 선언하는 것을 closed-loop라 함). |
| 2 | 빈칸 | 3 | `ko`로 걸러지지 않아 정답이 둘인 것은 경계 1개(5.3 `speech` ≈ voice). 그러나 **하면 안 되는 처치를 선택지로 보인 것 8문장**(6.0 `increasing/repeating` 조영제, 6.4 `ignoring/delaying/skipping` 활력 측정, 11.1 `nitroglycerin/aspirin`, 15.1 `stopping/delaying/ending` 에피, 17.3 `stopping/pausing/skipping` CPR, 19.2 `ignoring/delaying` 반응, 20.2 `sedate/discharge`, 5.4 `stop` "심장이 멈춰도 정상"), **시간 묶음 2문장**(1.4 `later today/tomorrow/next week`, 7.4 `later/tomorrow/eventually`), 브리프가 이름을 든 **`rarely/hardly/never` 묶음 3문장**(6.2·8.4·12.4), 연어로 걸러지는 것 1(0.3 `take … soap/perfume/jewelry`), 장면과 먼 것 약 4(8.3 `peel/bleed/shake`, 16.4 `digestion/vision/memory`, 18.4 `dressing/stitches/bandage`, 10.4 `nothing`). `bleeding/bruising`을 여섯 문장(0.2·1.3·2.0·3.1·6.3·8.3)에 돌려썼다. |
| 3 | `decoy` | 4 | 대신 넣어 `ko`에 맞는 다른 문장이 되는 것 1개(3.2 `around your wrist` — ko "채워드리고"). 에피를 미루는 조각 2개(12.0 `after the scan`, 17.1 `if there's time`). 끼워 넣어 맞는 것은 없다(경계 12.4 `by the doctors`). 다만 절반 가량(약 50/105)이 `last night`·`after lunch`·`tomorrow` 같은 시간 부사라 아무 문장 끝에나 붙는다(선택). |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이고 뒤집기는 없다. 고칠 것: 반만 다른 말 2(13.4 "다음 근무조에게 말로도 전할게요", 13.3 "라텍스가 든 물품은 전부 치웠어요"), 기도가 막혀 가는데 "에피네프린이 듣는지 지켜볼게요"(15.0), 목 조임이 돌아오는 환자에게 "물은 마셔도 돼요/천천히 드세요"(10.0·10.2), 같은 상황 안 중복 4쌍(1.0/1.2, 2.1/2.2, 4.1/4.3, 4.3/4.4). |
| 5 | `order` | 3 | `If so`류 조건절 줄은 0개. 그러나 **인접 교환이 열린 카드 3장**(S5 3↔4, S17 2↔3, S20 2↔3), 약하게 열린 카드 3장(S10 3↔4, S13 2↔3, S11 3↔4), **에피네프린을 막연히 미루는 카드 1장(S7 — 환자가 이미 가슴이 조인다는데 "필요한 순간 바로 드릴게요")**, 억지 연결어 3장(S5 `Thanks for squeezing my hand`·`Is that clear?`, S18 `Your answer helps`·`That's why`, S16 `Both of those take time`), 답을 전제한 줄 1장(S13 L4 `I'll add them to that chart`), 논리가 어긋난 줄 1장(S12 L4), 시간 모순 1장(S20 — base 상황 20). |
| 6 | `tag`·`icon` | 4 | 태그는 한국어 10자 이하이고 상황 안에서 일관된다. order 21장 모두 `대화 흐름`·`compass`. 고칠 것: 20.1 혈압 **저하**에 `chartup`. 사소: 13.2 알레르기 표시에 `bandage`. |
| 7 | context `word`·`ko`, swap `ko` | 4 | `word`가 열두 문항 모두 세 장면 `en`에 있다(W14 0). 어색한 장면은 모두 환자에게 임상어·차트 말투를 쓴 곳이거나(11문항) 같은 팀에게 돌려 말한 곳(S17 `give` — 묶음 C #17 `match`와 같은 사유로 받아들임)이다. 고칠 것: S15 fix "near your airway"(부정확), S18 XX `biphasic return`·S10 XX `symptom recrudescence`(낱말을 끼워 넣은 어색한 영어), S8 fix가 장면 0과 거의 같음. swap `ko` 8건은 모두 정답을 넣은 문장의 뜻이다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인. (2) 동떨어진·문법으로 걸러지는 빈칸 오답은 앞 주제보다 적지만(약 10문장), 대신 **정답 뒤집기형 위험 처치 오답**이 8문장 — 브리프 "위험한 처치를 오답으로도 보이지 않기"에 걸린다. `rarely/hardly/never` 묶음도 남았다. (3) order: `And/Also/Then`은 없지만 `Thanks`·`Is that clear?`·`Your answer helps`가 새 억지 연결어로 나왔다. (4) 임상: S7 에피를 막연히 미룸, 7.2 why, S17 기도 카트를 처치 뒤로 미룸. (5) decoy·오답 뜻 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **S7(항생제 IV 중 반응) — 에피네프린을 막연히 미루는 말투.** 장면 tagline이 "항생제를 막 시작했는데 가슴이 조여요"다. order L3은 환자가 이미 말한 가슴 조임을 다시 묻고, L4는 "에피네프린을 준비했고 **필요한 순간** 바로 드릴게요"로 닫는다 — 언제가 그 순간인지가 없다. 7.2 why도 "반응이 **진행하면** … 지체 없이"라 막연히 기다리는 것으로 읽힌다. 처음 쓰는 항생제는 그 환자에게 '알려진 알레르겐'이 아니어서 가슴 조임 하나만으로 아나필락시스 기준(WAO 2020 기준 2)을 깔끔히 충족한다고 하긴 어렵고, "멈추고 → 사정 → 에피를 곁에 준비"는 받아들일 수 있는 처치다. 그래서 사실 오류로 보지는 않는다. 다만 **어떤 신호가 오면 바로 근주하는지**(목이 막힘·가슴 조임이 심해짐·혈압 저하)를 말해야 한다. 7.2는 keyPhrase라 why와 order로 바로잡는다. → W1·O2. (tagline "가슴이 조여요"와 brief "에피네프린을 준비하세요"가 서로 당기는 것은 정본 쪽 문제로 따로 보고한다 — 아래 결정 11 '보고만'.)
2. **위험한 처치를 빈칸 선택지로 보임(8문장)** — 15.1 `I'm delaying epinephrine`, 19.2 `I'm ignoring/delaying the reaction now while we figure out the trigger`(원인을 찾느라 치료를 미루는 바로 그 오류), 17.3 `No pulse — stopping/skipping CPR now`, 6.0 `increasing the contrast`, 6.4 `ignoring/skipping your blood pressure`, 20.2 저혈압 환자를 `sedate`/`discharge`, 11.1 아나필락시스 저혈압에 `nitroglycerin`·`aspirin`, 5.4 `Your heart may stop after the shot, and that's expected`. 오답이라도 학습자는 넣어 읽는다(gi-bleed·bleeding-wound 검토와 같은 갈래). → B6·B7·B10·B13·B15·B16·B17·B19.
3. **인접 교환이 열린 order 3장** — S5 3↔4(`Is that clear?`가 L2 지시 뒤에도 자연스럽고 `Thanks for squeezing my hand`가 L4 뒤에도 읽힘), S17 2↔3(L1 → L3 "기도가 부었어요" → L2 "That's anaphylactic arrest"가 자연스럽고, 에피네프린이 기도 카트 뒤로 밀림), S20 2↔3(`That's when`이 L1의 혈압 저하를 가리켜도 읽힘). 학습자가 맞히고도 틀린다. → O1·O3·O4.
4. **base 상황 20의 시각 모순(결정 11)** — 20.0 "새벽 2시까지 안정"(keyPhrase) ↔ 20.3 "활력징후는 1시 반쯤까지 안정". order L2도 1시 반을 쓴다. → R1·O3.
5. **16.4 why — `is going in`을 "수동태"라 함.** `go in`은 자동사 진행형이고 수동태가 아니다(같은 주제의 12.4 `being watched`, 8.2 `been stung`은 바르게 수동태라 함). 문법을 가르치는 해설이라 틀린 문법 용어는 고친다. → W4.

## 저작자 자기 보고 4건 판정

### 1. 서수 대신 앞 줄을 가리키는 말로 순서를 잠근 것 — 억지 연결어인가

**판정: 넷 중 둘은 억지, 둘은 받아들이되 카드는 고친다.**
- `Thanks for squeezing my hand`(S5 L3) — **억지.** L2의 말(squeeze my hand)을 그대로 되풀이해 묶었다. 브리프 갈래 3이 금지한 "press it → So please press it"과 같은 모양이다.
- `Is that clear?`(S5 L4) — **억지.** 어떤 설명 뒤에도 붙는다. 실제로 L2(지시) 뒤에 붙여도 자연스러워서 3↔4 교환이 열린다. → O1.
- `Even then`(S10 L3) — **받아들인다.** "괜찮다고 느낀 뒤에도"를 가리키는 진짜 지시어다. 다만 L4("그 반응이 시작되면 호출")를 L3 앞에 둬도 "그때도 침대에 계세요"로 읽혀 약하게 열린다. L4 쪽을 잠근다. → O7.
- `That's when`(S20 L3) — **말은 자연스럽지만 카드가 열린다.** L2의 01:30을 가리키려 했으나 L1의 혈압 저하 시점도 가리킬 수 있어 2↔3이 열린다. → O3.
- 같은 갈래로 더 본 것: `Thanks.`를 줄머리 접착제로 다섯 장(S0·S3·S6·S7·S14)에 썼다. 앞 질문이 있으면 어디든 붙지만 이 다섯 장은 교환이 닫혀 있어 그대로 둔다(선택). `Your answer helps`·`That's why`(S18), `Both of those take time`(S16), `for that`(S15 L2)는 아래에서 고친다.

### 2. `ko`로만 걸러지는 숫자·색·방향·부정어 대비 오답

**판정: 대부분 받아들인다. `nothing` 하나는 바꾼다.**
- 낱장 머리에 `ko`가 보이므로 `three/ten`(4.1, ko "3초"), `red/blue`(3.2, ko "빨간"), `orange/yellow`(4.0, ko "주황색"), `rose/climbed/jumped`(20.1, ko "떨어졌고")는 `ko`를 듣고 맞히는 정상적인 대비다. 4.1의 `ten`은 예전 에피펜 설명서의 시간이라 오히려 좋은 오답이다.
- 다만 3.2 `red`·4.1 `three`는 `words`에 없는 말이라 가르치는 값이 작다(선택 — 고칠 의무 없음). 20.1은 셋이 모두 "올랐다" 한 가지 뜻이라 하나를 `held`(그대로였다)로 바꾸면 대비가 넓어진다(선택).
- **10.4 `nothing`은 바꾼다.** "아무것도 다르지 않으면 바로 호출하세요"는 `ko` 없이도 뜻이 안 맞아 걸러지는 정답 뒤집기다. `someone`·`everything`은 그대로 둬도 되지만, 대명사 자리는 `something`처럼 정답이 둘이 되기 쉬우므로 빈칸을 `different`로 옮긴다. → B13.
- 12.1 `lower/upper side`는 뜻이 없는 말이라 문법으로 걸러진다. 그러나 대신 넣을 말(`back`·`stomach`)이 임신 30주에 하면 안 되는 자세라 위험 처치 오답이 된다. `right`만으로도 대비가 되므로 그대로 둔다(경계로만 적음).

### 3. context 정비 12건과 의역이 들어간 fix

**판정: 여덟은 받아들인다. 넷(S15 fix, S18 XX, S10 XX, S8 fix)을 고친다.**
- 받아들임(묶음 A·B·C와 같은 모양 — 세 장면이 함께 쓰는 쉬운 말을 `word`로, 임상어는 어색한 장면에만):
  - **S0 `reaction`** — XX `Any prior history of anaphylactic reaction or angioedema?`는 자연스러운 임상 질문이다. why는 아직 `anaphylaxis`라고 쓰지만 같은 낱말 무리라 그대로 둬도 된다.
  - **S2 `drowsy`** — XX `Drowsy from diphenhydramine — sedation precautions, no driving.`는 TASK 9 예시(`Pt is drowsy, GCS 14…`)와 같은 모양이다. 새 fix "You may feel drowsy for a few hours, so please have someone else drive you home."는 의역이지만 장면에 맞고 장면 0과 겹치지 않는다. ✓
  - **S3 `rash`** — XX `urticarial or maculopapular`는 실제 임상어, 새 fix "raised and itchy like hives"도 정확하다. ✓
  - **S6 `stop`** — XX는 차트 문장을 환자에게 읽은 꼴이다(TASK 9 예시와 같은 `pt`). 새 fix "We've stopped the dye, and I'm staying right here with you."는 why가 설명하는 `dye`를 쓰고 장면 0과 겹치지 않는다. ✓
  - **S7 `ready`**, **S13 `food`**, **S19 `list`** — 자연스럽다. S13 차트 "Ask about foods…"는 차트보다 간호 계획 말투지만 base도 지시형이었다(경미).
  - **S17 `give`** — 세 장면 모두 팀에게 하는 말이라 대비가 "듣는 사람"이 아니라 돌려 말하기 ↔ 이름 불러 지시하기다. 묶음 C #17 `match`(같은 동료에게 돌려 말하기 ↔ 멈춰 세우기)와 같은 사유로 받아들인다. why의 closed-loop 설명이 맞다.
- 고칠 것:
  - **S15 `airway`** — 새 fix "The swelling is **near** your airway"는 해부학적으로 틀린 인상을 준다(후두 부종은 기도 **안**의 부종이다). base fix가 장면 1과 같아 바꾼 것으로 보이니 `throat`로 쓴다. → C1.
  - **S18 `return`** — XX `There's a biphasic return of anaphylactic symptoms.`의 `biphasic return`은 쓰지 않는 결합이다(쓰는 말은 biphasic reaction/recurrence). W14를 맞추려 끼워 넣은 낱말이다(TASK 9 경고). → C2.
  - **S10 `symptom`** — XX `symptom recrudescence`는 영어로는 맞지만 의료진도 아나필락시스에 거의 쓰지 않는 말이고, 어색함이 `symptom`이 아니라 `recrudescence`에 있다. → C3. 장면 0을 `the symptoms`로 바꾼 것은 base(문장 10.0과 같은 말)에도 이미 `symptoms`가 있어 필요 없었다(선택 — 되돌려도 됨).
  - **S8 `repeat`** — fix "If this keeps getting worse, we may need to give you another shot."가 장면 0 "…we may need to repeat the shot."와 낱말 하나만 다르다(review-ctx-A #4·#7과 같은 지적). → C4.

### 4. base 상황 20의 시각 모순

**판정: 맞다. 결정 11로 고친다.** 20.0 `stable until zero-two-hundred`는 keyPhrase라 바꿀 수 없으니 20.3을 02:00으로 맞추고, order L2도 같이 고친다. → R1·O3.

## 고칠 것

### why (5)
- **W1 · 7.2 why** · "반응이 진행하면 … 지체 없이"가 막연히 기다리는 것으로 읽힘(심각 1) · → "in case로 지금 쓸 약이 바로 곁에 있다고 알려 안심시켜요. 목이 막히거나 가슴 조임이 심해지거나 혈압이 떨어지면 기다리지 않고 바로 근육주사해요."
- **W2 · 7.0 why** · flush만 말하면 수액줄에 남은 항생제를 환자에게 밀어 넣는 것으로 읽힘 · → "stopping과 flushing을 and로 이어 두 행동을 한 번에 알려요. 반응이 의심되면 주입부터 멈추고, 약이 남은 수액줄은 떼어 식염수로 라인만 살려 둬요 — 응급 약을 넣을 길이 필요해서예요."
- **W3 · 11.3 why** · "~점은 사실이에요"는 해설이 스스로 사실이라고 보증하는 메타 문구이고, 왜 그렇게 말하는지가 없음 · → "might로 가능성만 열어 겁주지 않고, or로 두 경우를 나란히 알려요. 베타차단제를 먹는 환자는 에피네프린을 여러 번 맞거나 정맥 지속 주입이 필요할 수 있어요."
- **W4 · 16.4 why** · "is going in처럼 수동태로"는 틀린 문법 용어(심각 5) · → "is going in으로 지금 들어가고 있는 일을 진행형으로 말해요. support your circulation으로 목적을 밝혀요. 순환이 무너지는 쇼크에서는 수액이 혈압을 받쳐 줘요."
- **W5 · 17.3 why** · "크게 말하는 것이 closed-loop의 시작" — closed-loop는 지시 → 복창 → 확인이고, 상태를 크게 선언하는 것은 팀이 같은 그림을 갖게 하는 일(공유된 상황 인식)이다 · → "No pulse로 확인한 사실을 짧게 말하고 starting…now로 곧바로 행동을 선언해요. 크게 말해야 팀 전체가 같은 상황을 동시에 알아요."
- (선택) 3.2 why · 밴드 색은 병원·주마다 다를 수 있음 · → 끝 문장을 "많은 미국 병원에서 빨간 밴드는 알레르기 표시라, 다른 의료진이 약을 주기 전에 눈으로 알아봐요."로.

### 빈칸 (21)
- **B1 · 0.3** · `take any new soap/perfume/jewelry`는 연어로 걸러짐(`take`와 안 붙음) · → 선택지 `medication / vitamins / energy drink / protein powder`(모두 "먹는" 노출원이고 ko "약"이 가름).
- **B2 · 1.4** · `tell me later today/tomorrow/next week` — 시간 묶음, 기도 증상을 내일 말하라는 위험한 지시로 읽힘 · → 빈칸을 `tighten`으로: `tighten / itch / ache / burn`(ko "조여오는").
- **B3 · 1.2** (선택) · `occasionally/sometimes/gradually`는 빈도 부사 묶음으로 뜻만으로 걸러짐 · → `immediately / quietly / politely / directly`("바로" ko가 가름; 경계 — `directly`가 너무 가까우면 `in writing` 같은 구로).
- **B4 · 2.0** · `bleeding/bruising` — 항히스타민과 먼 말이고 주제 안에서 돌려씀 · → `itching / redness / flushing / fever`.
- **B5 · 5.3** · `speech sounds different` ≈ `voice sounds different`(ko "목소리"에도 거의 맞음 — 경계 정답 둘) · → `speech`를 `chest`로.
- **B6 · 5.4** · `Your heart may stop after the shot, and that's expected` — 위험한 거짓말을 정상이라고 보임 · → `stop`을 `settle`로(`race / ache / slow / settle`, ko "빨리 뛸"이 가름). `skip`은 `a beat` 없이는 어색하니 쓰지 말 것.
- **B7 · 6.0** · `increasing/repeating the contrast` — 반응 중에 조영제를 더 넣는 처치(심각 2) · → `stopping / checking / warming / changing`.
- **B8 · 6.2** · `rarely` — 브리프가 든 묶음 · → `rarely`를 `remotely`로.
- **B9 · 6.4** · `ignoring/delaying/skipping your blood pressure` — 정답 뒤집기이자 하면 안 되는 일(심각 2) · → `checking / raising / lowering / adjusting`(ko "확인할게요"가 가름).
- **B10 · 7.4** · `draw it up later/tomorrow/eventually` — 시간 묶음, 에피 준비를 미루는 말 · → `now / here / myself / separately`(ko "지금 미리"가 가름; `first`는 "미리"와 겹치니 쓰지 말 것).
- **B11 · 8.3** · `peel/bleed/shake` — 알레르기 장면과 먼 말 · → `swell / tingle / flush / burn`.
- **B12 · 8.4** · `never/hardly/rarely` — 브리프가 이름을 든 바로 그 묶음, `is never reacting`은 문법으로도 어색 · → 빈칸을 `safe`로: `safe / calm / awake / warm`.
- **B13 · 10.4** · `nothing` 정답 뒤집기(자기 보고 2) · → 빈칸을 `different`로: `different / normal / better / familiar`.
- **B14 · 11.1** · `nitroglycerin`(저혈압 악화)·`aspirin`(NSAID는 유발·악화 요인) — 이 환자에게 하면 안 되는 약(심각 2) · → `glucagon / ondansetron / acetaminophen / atropine`.
- **B15 · 13.2** · `hide/delete/cancel your latex allergy` — 정답 뒤집기 · → `flag / test / treat / confirm`(ko "표시해서"가 가름).
- **B16 · 15.1** · `stopping/delaying/ending epinephrine`(심각 2) · → 빈칸을 `bedside`로: `bedside / desk / station / unit`(ko "침상 곁"이 가름. 15.4가 이미 ENT 빈칸이라 ENT로 옮기지 말 것).
- **B17 · 17.3** · `stopping/pausing/skipping CPR`(심각 2) · → 빈칸을 `pulse`로: `pulse / response / rhythm / blood pressure`(ko "맥박"이 가름).
- **B18 · 18.4** · `dressing/stitches/bandage` — 상처 처치 묶음, 장면과 먼 말(gi-bleed 검토와 같은 묶음) · → `vitals / skin / rash / IV site`.
- **B19 · 19.2** · `ignoring/delaying the reaction while we figure out the trigger` — 원인 규명을 핑계로 치료를 미루는 그 오류(심각 2) · → 빈칸을 `trigger`로: `trigger / dose / plan / schedule`.
- **B20 · 20.2** · `sedate`(저혈압 환자 진정)·`discharge`(급변 환자 퇴원) · → `reassess / transfer / admit / move`.
- **B21 · 12.4** · `rarely/lightly/casually` — 묶음 돌려쓰기, `watched lightly`는 영어로 어색 · → `closely / briefly / remotely / occasionally`.
- (선택) 16.4 `digestion/vision/memory` → `circulation / breathing / kidneys / temperature`. 14.1 `slows a lot`(문법으로 걸러짐), 16.0 `very normal/steady`(같음), 20.4 정답 `doctor`가 공통 쉬운 단어이고 `dietitian/chaplain`이 먼 말(→ `charge nurse`처럼 ko "의사"가 가르는 말로).

### decoy (3)
- **D1 · 3.2** · `around your wrist`가 `on you` 자리에 들어가면 "빨간 알레르기 밴드를 **채워**드리고…"에 그대로 맞는 다른 문장 · → `on your door`(밴드를 차는 것이 아니라 문에 붙이는 것 — ko와 어긋남). 손목·발목 같은 몸 부위는 ko가 부위를 말하지 않아 모두 맞으니 쓰지 말 것.
- **D2 · 12.0** · decoy `after the scan`이 `now —` 자리에 들어가면 "에피네프린을 스캔 뒤에 놓을게요" — 에피를 미루는 조각을 학습자가 읽고 조립함 · → `for the baby`.
- **D3 · 17.1** · decoy `if there's time`이 "Give epinephrine if there's time"이 됨 — 심정지에서 에피를 미루는 조각 · → `and a sedative`.
- (선택) 약 50문장이 시간 부사 decoy다. 같은 자리 구(`for the doctor` ↔ `for your safety`) 쪽으로 늘리면 좋다.

### distractorsKo (6)
- **K1 · 13.4** · "다음 근무조에게 말로도 전할게요" — 정답("다음 근무조도 볼 수 있도록 차트에 적어 둘게요")과 반만 다름 · → "교대 전에 활력징후를 한 번 더 잴게요".
- **K2 · 13.3** · "라텍스가 든 물품은 전부 치웠어요" — 정답(라텍스가 닿으면 안 된다는 규칙)과 겹침 · → "가족분께도 고무 풍선은 가져오지 말라고 할게요".
- **K3 · 15.0** · "에피네프린이 듣는지 지켜볼게요" — 기도가 막혀 가는데 지켜보며 기다리는 태도를 보임 · → "앉아 있는 게 편하면 그대로 계세요".
- **K4 · 10.0** · "물은 마셔도 돼요" — 목 조임이 돌아오는 환자(tagline)에게 입으로 마시라는 말 · → "모니터 선은 그대로 두세요".
- **K5 · 10.2** · "물은 천천히 드세요" — 같은 이유 · → "보호자분께 연락해 드릴까요?".
- **K6 · 중복 정리** · 1.2 "가려운 곳은 긁지 말아 주세요"(1.0과 같음) → "두드러기 사진을 의사에게 보여 드릴게요"; 2.2 "퇴원 안내문은 나중에 드릴게요"(2.1과 같음) → "보호자분은 언제 오실 수 있어요?"; 4.3 "주사 뒤에 그 부위를 문질러 주세요"(4.1과 같음) → "연습용 펜에는 바늘이 없어요"; 4.4 "주사 맞은 시간은 적어 두세요"(4.3 둘째와 같음) → "다 쓴 펜은 뚜껑을 닫아 가져오세요".

### order (10)
- **O1 · S5** · 3↔4 열림 + 억지 연결어 둘(자기 보고 1) · → L1 그대로 / L2 `Your heart may race after the shot, and that's expected.`(note 안내) / L3 `That racing is from the medicine, but tell me if your voice changes.`(확인, 13단어) / L4 `While I listen to your voice, what did you eat or take right before this?`(원인, 15단어). 교환: 1↔2는 `after the shot`이 투여 전이라 닫히고, 2↔3은 `That racing`이 앞 말이 없어 닫히고, 3↔4는 L4의 `your voice`가 L3에서야 나오는 말이라 닫힌다. why도 "주사 → 흔한 반응 안내 → 그 반응과 위험 신호 구분 → 목소리를 들으며 원인 문진"으로.
- **O2 · S7** · L3이 환자가 이미 말한 가슴 조임을 다시 묻고, L4가 에피를 "필요한 순간"으로 막연히 미룸(심각 1) · 장면(brief "준비", keyPhrase 7.2) 안에서 고친다 → L1 `I'm stopping the antibiotic right now.` 그대로 / L2 `With the antibiotic stopped, are you feeling any swelling in your face or trouble swallowing?` 그대로 / L3 `Besides that, is your throat closing up, or is your chest getting tighter?`(추가, 13단어) / L4 `Thanks. Epinephrine is drawn up — if that tightness grows, it goes in right away.`(준비, 14단어). 3↔4는 `that tightness`가 L2에 없는 말이라 닫힌다(`if either happens`처럼 쓰면 L2의 두 증상을 가리켜 다시 열리니 쓰지 말 것). why는 "멈추고 → 얼굴·삼킴 → 그 밖에 목·가슴 → 조임이 심해지면 바로 근주"로. 정본에서 tagline을 그대로 두고 brief를 "즉시 근주"로 바꾸기로 하면 L4 대신 `Thanks. With your chest that tight, epinephrine goes in your thigh now.`를 쓴다.
- **O3 · S20** · 2↔3 열림(`That's when`) + 시각 모순(R1) · → L2 `Before that, vitals were steady all shift until about zero-two-hundred.` / L3 `After that steady stretch, hives came back, so I gave a second epi.`(13단어). 2↔3은 `that steady stretch`가 앞 말이 없어 닫힌다. L2 ko "새벽 2시쯤까지", why의 'That's when' 설명도 고침.
- **O4 · S17** · 2↔3 열림 + L3 `With that going`이 기도 카트를 약·수액 뒤로 미룸(TASK 10 시간 묶음) · → L2 `With this swelling, that's anaphylactic arrest — give epinephrine and hang a liter wide open.`(14단어) / L3 `That swelling means we need the difficult airway cart now.`(10단어) / L4 `I need one more set of hands on that airway cart.` 2↔3은 `That swelling`이 앞 말이 없어 닫힌다.
- **O5 · S13** · 2↔3 약하게 열림(`this`가 아무것이나 가리킴) + L4 `I'll add them to that chart`가 답을 '예'로 전제 · → L2 `With those swapped out, nothing with latex should touch you from now on.`(R2와 맞춤) / L3 `I'm writing that rule on your chart so the next shift sees it too.`(14단어) / L4 `For that chart, do foods like bananas or avocado bother you too?`(12단어).
- **O6 · S18** · `Your answer helps`는 억지, L4 `That's why`는 "모니터를 붙였다 → 그래서 곁에 있다"로 인과가 안 맞음 · → L3 `That tells me if the shot is working, and the monitor shows the rest.`(14단어) / L4 `Besides the monitor, I'm staying right here and checking your vitals every ten minutes.`(14단어). 3↔4는 `Besides the monitor`가 앞 말이 없어 닫힌다.
- **O7 · S10** · 3↔4 약하게 열림(자기 보고 1의 `Even then`) · → L4 `From there, push the call button right away if that wave starts.`(12단어). `From there`가 L3의 침대를 가리켜 L3 앞으로 못 온다.
- **O8 · S12** · L4 "그 두 수치(혈압·태아 심박)가 중요한 건 아기가 산모의 호흡이 필요해서"는 인과가 안 맞음 · → L4 `Those two numbers tell us the epinephrine is helping both of you.`(12단어), ko "그 두 수치로 에피네프린이 두 분 모두를 돕는지 봐요". (선택) L2 `With that in`은 좌측위를 투여 뒤로 미루는 말이라 `Right along with it`처럼 동시로 바꿔도 좋다.
- **O9 · S16** · L3 `Both of those take time`은 억지 연결어이고, 지속 주입은 수 분 안에 듣기 시작해 부정확 · → L3 `Stay with me through both — squeeze my hand if you can hear me.`(13단어).
- **O10 · S11** (경계) · 3↔4를 바꿔도 `It`이 여전히 글루카곤으로 읽혀 약하게 열림 · → L4 `Even working around it, you might need several doses to get a response.`(13단어) — L3의 `works around`를 가리켜 잠근다.
- (선택) S15 L2 끝의 `for that`은 덧붙인 말이라 빼도 L3 `Their`가 잠근다. S9 L1(`so I'm treating this right away`) 뒤 L2 `That's why I'm giving you epinephrine`은 이유를 두 번 말한다. S0 L3 `Your lips look fine so far`는 진찰 결과를 전제한다.

### tag·icon (1)
- **I1 · 20.1 icon** · 혈압 **저하** 보고에 `chartup` · → `monitor`.
- (선택) 13.2 `bandage` → `board`.

### context·swap (4)
- **C1 · S15 `airway` fix** · "near your airway"는 부정확 · → `Your throat is swelling, so we're getting ready to help you breathe.`
- **C2 · S18 `return` XX** · `biphasic return`은 쓰지 않는 결합(끼워 넣은 낱말) · → XX en `Your anaphylaxis is returning — this is a biphasic reaction.` why는 그대로(biphasic·anaphylaxis 설명).
- **C3 · S10 `symptom` XX** · `symptom recrudescence`는 거의 안 쓰는 말 · → XX en `We're monitoring for a biphasic recurrence of your symptoms.` why → "biphasic recurrence는 의료진과 차트의 말이에요. 환자에게는 '두 번째 파도' 또는 '다시 올 수 있다'처럼 풀어서 말해요."
- **C4 · S8 `repeat` fix** · 장면 0과 낱말 하나 차이 · → fix `It may take more than one shot — if you feel worse, tell me right away.`

## 결정 11 (기존 문장)
- **R1 · 20.3** · 20.0(keyPhrase) "02:00까지 안정"과 모순(자기 보고 4) · → en `Vitals were steady all shift until about zero-two-hundred.`, ko `활력징후는 새벽 2시쯤까지 근무 내내 안정적이었습니다.`, chunks `["Vitals were steady", "all shift", "until about zero-two-hundred", "."]`. 빈칸·decoy(`since noon`)는 그대로 둔다. order L2도 O3대로.
- **R2 · 13.3** (판단이 갈릴 수 있음 — 영어가 비문은 아니라 "확실한 것만" 기준에서는 경계) · `Nothing in this room should touch latex`는 "방 안의 물건이 라텍스에 닿으면 안 된다"는 뜻이 되어, 말하려는 "라텍스가 환자에게 닿으면 안 된다"와 어긋남(keyPhrase 아님) · → en `Nothing with latex should touch you from now on.`, ko `이제부터 라텍스가 든 어떤 것도 몸에 닿으면 안 돼요.`, chunks `["Nothing with latex", "should touch you", "from now on", "."]`. 빈칸 `latex`(낱말 경계로 한 번)·선택지 `nickel/iodine/perfume`·decoy `after dinner`는 그대로 맞는다. why의 "주어를 사물로 두어"도 그대로 맞다.
- **보고만(keyPhrase라 못 바꿈)** · 7.2 `I have epinephrine ready in case we need it.`와 상황 brief "에피네프린을 준비하세요"는 tagline("가슴이 조여요")과 어긋난다 — 정본 쪽에서 tagline을 "가려워요/얼굴이 화끈거려요"로 바꾸거나 brief를 "즉시 근주"로 바꾸는 것을 권한다. 7.0 `flushing your line`도 keyPhrase라 why(W2)로만 보완한다.

## 종합
고칠 것 **50건**(why 5 · 빈칸 21 · decoy 3 · distractorsKo 6 · order 10 · icon 1 · context 4) + 결정 11 두 건, 선택 약 12건. 에피네프린을 미루는 말은 S7(order L4·7.2 why)과 에피 지연 조각(빈칸 15.1·19.2, decoy 12.0·17.1)뿐이고, S5·S8·S9·S12·S14·S18은 에피가 먼저다(S14는 추정 체중으로 먼저 놓고 체중은 뒤에 물음). 사실 오류는 16.4의 문법 용어 하나이고, 나머지 심각한 문제는 위험한 처치를 빈칸 선택지로 보인 8문장과 열린 order 3장이다. 이것들을 고친 뒤에는 내보내도 된다.
