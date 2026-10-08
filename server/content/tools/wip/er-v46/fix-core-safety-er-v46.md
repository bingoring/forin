# core-safety-er — v46 보강 검토 (er)

대상: `core-safety-er.yaml` (상황 20 · 문장 122 · order 20장). 문장 122개·order 20장 전수.
기계로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 488줄, decoy를 청크 자리마다 넣은 조립, a/an 관사 일치,
문장 `icon` = 정답 선택지 `icon` 일치, order 인접 교환 60가지, distractorsKo.

판정 기준(앱 코드 확인): 문장장 머리의 앰버 원에는 **그 문장의 `icon`이 모든 유형(빈칸 포함)에서** 그려지고
(`SentPrompt.tsx` `SheetIconCircle icon`), 청크 조립은 **이은 문자열 == `en`** 으로만 채점하며 머리에 `ko`가 나온다.
따라서 decoy는 "`ko` 뜻에도 맞는 다른 문장이 조립되는가"로 봤다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 "말하는 방식의 이유"를 짚는다. 독립 이중 확인 모순(7.1), 침상 번호를 식별 근거로 삼는 해설(9.4·S9 order), 뜻 되풀이(2.5·18.3) 몇 건. |
| 2 | 빈칸 | 2 | 장면과 동떨어진 오답이 많고(약 45문장), 관사로 걸러지는 오답(18.2 `an weather`, 20.1 `a old`), 정답으로도 맞는 오답(1.1 `phone number`, 6.0·15.1 `sleepy`), **문장 아이콘 = 정답 아이콘 46/122**. |
| 3 | `decoy` | 4 | 대부분 자리 대체 시 `ko`와 뜻이 어긋나 좋은 함정. `ko`로 못 거르는 것 3건(1.0·13.0·13.5). |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황의 다른 말. 반만 다른 말 4건(7.2·8.5·11.5·17.2). "한 번만/가끔만" 같은 값 뒤집기 패턴이 많지만 뜻이 반대라 정답이 둘이 되지는 않음. |
| 5 | `order` | 2 | 20장 중 12장에서 인접 교환이 자연스럽다. S12는 **임상 순서가 거꾸로**(보호구 뒤에 손 씻기), S9는 **침상 번호를 첫 확인**으로 가르침. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 잘 말한다(`5 Rights`·`가까이`·`안내`만 손볼 것). 아이콘은 뜻과 어긋난 것 몇 개(11.5 calmer→faceWorried, 13.2 judge→scalpel). |
| 7 | context `word`·`ko`, swap `ko` | 5 | 전부 정확. swap `ko`는 정답 문장의 뜻. (S5 `secure` ↔ `고정하다`만 형용사·동사 차이, 고칠 정도는 아님) |

## 사실 오류·심각한 문제

1. **S12 감염 격리 설명 · order** — 정답 순서가 `보호구 착용(2) → 그리고 들어가기 전 손 씻기(3)`. 미국(CDC) 착용 순서는
   **손 위생 → 가운 → 마스크 → 장갑**이라 장갑을 낀 뒤 손을 씻으라는 순서를 정답으로 가르친다(교환한 쪽이 오히려 맞음).
   → 2·3줄을 바꿔 쓰기: 2 `First, wash your hands well before you go in.` / 3 `Then put on this gown, gloves, and mask.` /
   4는 그대로(`again`이 2줄을 가리킴). `why`도 "손 씻기 → 보호구 → 나올 때 다시 손 씻기"로.
2. **S9 검체 라벨 오류 방지 · order 1줄 + why** — `First, check the bed number.`를 라벨 전 첫 확인으로 가르친다.
   Joint Commission NPSG.01.01.01에서 **병실·침상 번호는 환자 식별자가 아니다**. → 1줄 `First, check her wristband — name and
   date of birth.`, `why`도 "손목밴드의 두 가지 식별자를 먼저 확인하고…"로. 같은 문제가 base 9.4에도 있다(아래 결정 11 보고).
3. **7.1 `why`** — "with me로 … 둘이 함께하는 **독립 이중 확인**을 청해요". 독립 이중 확인(ISMP)은 두 사람이 **각자 따로**
   대조하는 것이라 "함께"와 모순(같은 상황 swap `why`도 "각자 대조"라고 맞게 씀). → "with me로 혼자 확인하지 않고 두 번째
   간호사의 확인을 청해요. 고위험약은 두 사람이 각자 따로 대조하는 독립 이중 확인이 원칙이에요."

## 저작자 자기 보고 4건 판정

1. **동떨어진 빈칸 오답** — 맞는 지적. 약 45문장. 다만 같은 분야 말로 바꾸면 **동의어가 정답이 되는 함정**이 있다
   (press↔push, hit↔bump, scan↔CT, carry↔roll, grab↔pick, order↔label, role↔task, `sleepy`처럼 장면상 맞는 증상).
   세 가지 방식으로 고친다 — (a) 같은 분야의 **반대·엉뚱한 방향**(raising, lower, unlocked, clotting), (b) 같은 분야지만
   **그 자리엔 틀린 명사**(an annual/expense/audit report, room number), (c) 동사 동의어가 너무 많으면 **빈칸을 다른 가르치는
   말로 옮김**(4.0→allergic, 14.0→Time-out, 1.4→mixing up). 구체안은 아래 "빈칸" 목록. 제안안은 모두 앞뒤에 넣어 읽고
   관사를 확인했다.
2. **order 새 줄·연결어** — 새로 쓴 줄은 대화로 자연스럽다. 그러나 `And`·`Also`·`Then`은 **순서를 못 박지 못한다**
   — 어느 줄 뒤에 와도 읽힌다(S6 3줄 `And if you need anything…`, S15 2줄 `Also, …`, S10 2줄 `And did you hit…`).
   `First,`(S3·S9·S18)와 `So`(S16)는 1·2줄을 고정하는 데는 효과가 있다. S3 `So please press it…`은 바로 앞 줄의 `press it`을
   되풀이해 어색하고, S13 `So I'm going to remove…`는 "돕고 싶다 → 그래서 치운다"가 약간 억지. 연결어 대신 **앞 줄을 가리키는
   말**(it·them·that·"any of that"·"while they're on")로 묶어야 한다. 구체안은 아래 "order" 목록.
3. **임상 내용** — hydralazine(혈관확장 혈압약)/hydroxyzine(항히스타민제)은 ISMP 혼동 약명 목록에 있음 ✓. 타임아웃
   (Universal Protocol: 환자·시술·부위·동의서·표시 확인, 누구든 중단 가능)·5 rights ✓. 항응고제 복용자 두부 외상 후 신속 CT,
   이상 없어도 경과 관찰·악화 시 재촬영 ✓. 억제대 순환·피부 확인(주기는 정책 따라 다름이라고 단서를 단 것 ✓), 최소 사용·조기
   해제 ✓. 화재 시 문 닫기(RACE의 Confine)·거동 가능 환자 먼저 ✓. 신속대응 "기준 다 채우기 전에도 걱정되면 호출" ✓.
   **틀린 것은 위 S12 순서, S9 침상 번호, 7.1 독립 이중 확인.** 덧붙여 보고만: 3.0 `why`의 "난간을 올리는 것은 낙상 예방의
   기본" — 미국에서는 난간 4개를 모두 올리면 억제대로 간주(CMS)되고 넘어 나오다 더 다칠 수 있어 "병원 지침에 따라 난간을
   올리고"로 누그러뜨리면 좋다.
4. **상황 13(파일상 S14 오환자 시술 방지) "date of birth in 1962"** — `in-core-safety-er.json` keyPhrases[0]과 글자 그대로
   같다 → **결정 대기**. 자연스러운 말은 `born in 1962` 또는 생년월일 전체(`date of birth March 4, 1962`). 타임아웃 식별은 연도만이
   아니라 생년월일 전체가 정석이라 후자를 권함. (빈칸은 v46 필드라 따로 고칠 수 있음 — 아래 14.0)

## 고칠 것 (v46 필드)

### 빈칸 (blank)
- **전체 · 아이콘** — 문장 `icon`과 정답 선택지 `icon`이 같은 문장 46개: 1.0 1.1 1.3 1.4 2.4 3.1 3.5 4.1 4.4 4.5 5.4 6.1 6.4 7.1 7.2
  8.0 8.2 8.3 9.1 9.5 10.0 10.1 10.4 11.2 11.4 12.0 12.1 12.4 13.0 13.1 13.2 14.1 14.2 15.2 16.0 16.3 16.5 17.0 17.1 17.2 17.3
  17.5 18.0 18.5 19.5 20.2. 머리 앰버 원과 같은 아이콘이 정답 칸에만 있어 바로 보인다 → 정답 선택지 아이콘을 다른 것으로
  (문장 아이콘은 그대로). 같은 아이콘이 둘인 선택지도: 11.1(calendar×2), 14.0(star×2).
- 1.1 · `phone number`·`home address`는 미국 병원에서 **인정되는 식별자**(전화번호 등)라 정답이 둘 → `room number`·`bed number`
  (식별자가 아닌 대표 오답, 학습 가치 큼). `insurance plan`은 유지.
- 1.3 · `almost confirm`은 문법이 깨져 걸러짐 → `sometimes`.
- 1.4 · `cause/allow/remind us from`은 전부 비문이라 문법으로 걸러지고, `keep/stop/save`는 정답이 됨 → 빈칸을 `mixing up`으로
  옮기고 오답 `picking up`·`cheering up`·`backing up`.
- 2.2 · `sell/paint/break` → `rent`·`store`·`fix` (`need`·`own`은 정답에 가까워 피함).
- 2.3 · `wash/paint/borrow` → `lower`·`measure`·`treat` (`affect`·`increase`는 정답이 됨).
- 2.5 · `hobby/address/lunch` → `discharge`·`diet`·`visitors` (`pain`·`medicines`는 장면상 맞음).
- 3.0 · `painting/breaking/selling` → `raising`·`moving`·`cleaning` (`locking`·`making`은 침상 안전 설정으로 실제 하는 일이라 피함).
- 3.3 · `tall`(비문에 가까움)·`wet` → `unlocked`·`empty` (`high`는 유지).
- 3.5 · `Hide/Break/Remove` → 빈칸을 `alone`으로 옮기고 오답 `together`·`slowly`·`later` (`Push`는 정답이 됨).
- 3.6 · `bills/noise` → `blood clots`·`delirium` (`infections` 유지).
- 3.7 · `brand/color/price` → `sheets`·`blanket`·`pillow` (`wheels`·`alarm`은 실제 점검 항목이라 피함).
- 4.0 · 꼬리 질문 자리의 `finished/tired/cold`는 의미 없는 말 → 빈칸을 `allergic`(가르치는 단어)으로 옮기고 오답 `addicted`·
  `immune`·`used`.
- 5.3 · `eat/pray/argue` → `return`·`rest`·`chat`.
- 5.4 · `rumors/hobbies/snacks` → `factors`·`medications`·`injuries` (`signs`·`assessments`는 정답이 될 수 있어 피함).
- 6.0 · `sleepy` — 섬망·진정 환자 장면이라 "a bit sleepy, so let me help you move"가 맞는 말 → `talkative`.
- 7.2 · `color/price/shape` → `room`·`nurse`·`shift` ("right room"은 흔한 오해라 좋은 오답; `route`·`time`은 5 rights라 금지).
- 7.3 · `empty/cold/tall` → `different`·`familiar`·`safe`.
- 7.4 · `menu/music/weather` → `brand`·`price`·`color` (`label`·`chart`·`pump`는 대조 대상으로 맞는 말이라 피함).
- 8.2 · `sell` → `delete` (실제로는 지우지 않고 병합한다는 대비).
- 8.5 · `fake`는 임시 이름(가명)을 가리킬 수 있어 정답과 겹침 → `middle`.
- 9.1 · `shape/price/color` → `room`·`diagnosis`·`doctor`.
- 9.3 · `paint/kick/sing` → `shake`·`open`·`warm` (`label`·`draw`·`fill`·`pick`은 정답이 됨).
- 9.4 · `while`은 "라벨 붙이며 확인"으로 읽혀 맞을 수 있음 → `unless`.
- 10.0 · `sings/sleeps/smiles` → `itches`·`tickles`·`happened` (`aches`·`bleeds`는 정답이 됨).
- 10.1 · `paint/comb/wash` → `turn`·`lift`·`shake` (`bump`·`hurt`는 정답이 됨).
- 10.3 · `dessert/weather/visitor` → `fever`·`allergy`·`infection` (`bleeding`은 정답이 됨).
- 10.5 · `sing/laugh/joke` → `worry`·`forget`·`argue`.
- 11.2 · `wash/sell` → `replace`·`pad` (`tighten` 유지; `loosen`·`adjust`는 정답에 가까움).
- 13.3 · `add/paint/wash` → `leave`·`count`·`show` (`lock`·`check`는 정답에 가까움).
- 14.0 · 정답이 사람 이름(John Reyes)이라 영어로 추론할 수 없는 암기 문제 → 빈칸을 `Time-out`(w-timeout)으로 옮기고 오답
  `Hand-off`·`Check-in`·`Debrief`.
- 14.1 · `small` — small-bore 흉관이 있어 장면상 맞을 수 있음 → `bilateral`. (`new`도 → `spare`)
- 14.4 · `sing/laugh` → `continue`·`hurry` (`start` 유지).
- 15.0 · `flat` → `normal`.
- 15.1 · `sleepy` — 호흡 30에 기면은 그 자체로 악화 징후라 정답이 둘 → `comfortable`.
- 15.5 · `secret/funny` → `long`·`late` (`vague` 유지).
- 16.0 · `strange/famous/funny` → `different`·`long`·`short` (`same`은 정답에 가까움).
- 17.0 · `haircut/shampoo/tattoo` → `wrap`·`cover`·`bandage` (`CT`·`X-ray`·`MRI`는 맞거나 논쟁거리라 피함).
- 17.3 · `sleeping/laughing/singing` → `clotting`·`itching`·`sweating` (`bruising`·`swelling`은 정답이 됨).
- 18.0 · `zero the ordered dose`는 비문 → `only`.
- 18.2 · `an weather/lunch/menu` — 관사 `an`으로 바로 걸러짐 → `annual`·`expense`·`audit` (`accident`·`event`는 동의어라 금지).
- 18.3 · `angry/noisy/sticky` → `unstable`·`sedated`·`discharged` (`comfortable`은 정답에 가까움).
- 19.1 · `taxi/ladder` → `ramp`·`key` (`pillow` 유지).
- 19.3 · `sing/sleep/swim` → `talk`·`see`·`hear` (`stand`는 정답에 가까움).
- 19.4 · `paint/sell/drop` → `leave`·`wake`·`bathe` (`push`·`roll`·`move`는 정답이 됨).
- 19.5 · `menu/color/price` → `time`·`schedule`·`supplies` (`rooms`·`doors`는 실제 확인 항목이라 피함).
- 20.1 · `a old`는 관사로 걸러지고 `rare`는 어색함 → `moderate`·`minor` (`low` 유지).
- 20.2 · `color/seat/lunch` → `shift`·`break`·`schedule` (`task`·`job`은 정답이 됨).
- 20.5 · `sell` → `skip`.

### decoy
- 1.0 · `for the chart` → "Can you state your full name for the chart?"가 `ko`(성함을 정확히 말씀해 주시겠어요?)에도 맞음 → `your nickname`.
- 13.0 · `for visitors` → "I'm keeping the room safe for visitors right now"가 `ko`(지금 방을 안전하게 만들고 있어요)에 맞음 → `the room messy`.
- 13.5 · `to watch you` → "We just want to watch you"가 `ko`의 "지켜드리고 싶어요"와 거의 같은 뜻 → `to punish you`.

### distractorsKo
- 7.2 · `정확한 환자에게 정확한 약이에요` — 정답(정확한 환자, 정확한 용량…)과 반만 다르고 그 자체로 5 rights 문장 → `약은 제가 혼자 준비할게요`.
- 8.5 · `이름은 나중에 바꿔요` — 정답(신원이 확인되면 실명을 갱신)과 사실상 같은 뜻 → `임시 밴드를 지금 빼 드릴게요`.
- 11.5 · `풀기 전에 피부를 한 번 확인해요` — 정답(풀고 피부를 다시 확인)과 반만 다름 → `억제대를 더 단단히 묶을게요`.
- 17.2 · `시야는 잘 보이시죠?`는 정답(시야 문제)과 겹치고, `어지러운 곳이 있으세요?`는 한국어가 어색함 → `두통이 있으세요?`·`언제 넘어지셨어요?`.

### order
- S5 · 2↔3 교환이 자연스러움(`too`가 어디든 붙음) → 3줄 `With the oxygen on, please stay lying down while we move you.`
- S6 · 2↔3·3↔4 모두 자연스러움(`And if you need anything…`, `I'll also…`가 떠 있음) → 1 `You're a bit unsteady, so for now, please stay in bed.` /
  2 `If you need to get up, press this button.` / 3 `I'll come right away and help you move.` / 4 `Let me remind you again: stay in bed and call first.`
  (`why`도 맞춰서)
- S7 · 2↔3 자연스러움 → 3줄 `Good — the concentration matches. Now right patient, right dose — read it back to me.`
- S8 · 2↔3 자연스러움 → 3줄 `Then label all samples with the ID on that band.`
- S9 · (위 심각 2) 1줄 `First, check her wristband — name and date of birth.`
- S10 · 2↔3 자연스러움 → 3줄 `Okay, let me check your head and body before we move you up.`
- S11 · 2↔3 자연스러움(`In the meantime`이 "진정되면 풀게요" 뒤에서도 읽힘). 지금 `why`의 "시간 흐름 그대로라 순서가 하나" 주장과 어긋남 →
  1 그대로 / 2 `He's still pulling at his lines, so they stay on for now.` / 3 `As soon as he's calmer, we'll remove them.` / 4 `Then we'll check his skin again.`
- S12 · (위 심각 1) 손 씻기 → 보호구 → 나올 때 다시 손 씻기.
- S13 · 3↔4 자연스러움 → 4줄 `If you need anything, just tell them or me.` (`them`이 3줄 someone을 가리킴)
- S14 · 2↔3 자연스러움(`anything we just said`가 1줄만 받아도 됨) → 3줄 `If any of that — patient, procedure, consent, or site — doesn't match, we stop right there.`
  1줄에 생년월일도 넣으면 좋음(타임아웃 두 식별자): `Time-out: John Reyes, born 1962, right chest tube.`
- S15 · 2↔3 자연스러움(`Also,`가 호출 뒤에도 붙음) → 3줄 `With all of that, I need eyes on her now — this is a rapid response.`
- S16 · 3↔4 약하게 자연스러움, 그리고 MRN은 밴드에서 확인하는 것이라 순서가 어색 → 4줄 `Then match it to the wristband before we act.`
- S17 · 3↔4 자연스러움 → 4줄 `While we watch, tell us right away if anything changes.`
- S18 · 2↔3 약하게 자연스러움 → 3줄 `Once she's stable, I'll complete an incident report.`
- S3 · (선택) 3줄 `So please press it…`이 2줄의 `press it`을 되풀이 → `So please call me before you try to get up.`

### why·tag·icon
- 2.5 · `why` 첫 문장이 문장 뜻을 되풀이하고 "먼저 말씀해 달라는 안내"로 잘못 풀이 → "혼자 일어나시기 전에 위험부터 함께 짚자는 말이에요" 식으로 말하는 이유만.
- 9.4 · `why` "침상 번호부터 보게 해요" → "라벨 전에 확인한다는 순서" 설명으로 줄이고, 식별은 손목밴드라는 단서 추가(base 문장 보고와 함께).
- 10.1 · `why` "가장 먼저 묻는 항목"은 과장(같은 상황에서 통증 부위를 먼저 물음) → "꼭 묻는 항목".
- 18.3 · `why` 둘째 문장이 `safe and stable` 뜻 풀이뿐 → "투약 사고 뒤 첫 순서는 보고가 아니라 환자 상태"처럼 이유로.
- 3.0 · `why` (보고·선택) "난간을 올리는 것은 기본 설정" → "병원 지침에 따라 난간을 올려요".
- 7.2 · `tag` `5 Rights`(영어) → `복창 요청`.
- 13.4 · `tag` `가까이` → `곁 지키기`. 6.2 `tag` `안내` → `침상 유지`.
- 11.5 · 정답 `calmer` 아이콘 `faceWorried`(걱정) → `me`. 13.2 오답 `judge` 아이콘 `scalpel` → `board`.

## 결정 11 · base 보고 (v46 범위 밖, 고치지 않고 보고만)
- **[결정 대기] S14 14.0** `Time-out: this is John Reyes, date of birth in 1962.` — keyPhrase. `born in 1962` 또는 생년월일 전체를 권함.
- S9 9.4 `Always check the bed number before you label the tube.` — 침상 번호는 식별자가 아님(환자 안전). keyPhrase 아님 →
  `Always check the wristband before you label the tube.` 같은 수정 검토. (9.0 `This tube is for bed four, not bed six`는 keyPhrase라 유지.)
- S11 11.3 `Restraints are only used when he might pull out his IV line or fall.` — 미국(CMS)에서 낙상 위험만으로는 억제대 사용 근거가 안 되고
  오히려 손상을 늘림. keyPhrase 아님 → `…pull out his IV line or breathing tube.` 검토.
- S3 3.4 `The rails will stay up whenever I'm not right beside you.` — 난간 전부 상시 올림은 억제대로 간주될 수 있음. 경미.
- S19 19.4 `Two of us will carry the intubated patient on the bed together.` — 침대는 "carry"가 아니라 밀어 옮김 → `move … on the bed` 검토. 경미.
- 청크 경계: 3.6 `correctly helps prevent`(주어의 부사+동사), 8.1 `on and label`, 18.0 `double the ordered / dose`, 15.0 `is up and / pressure is` — 구를 끊음.

## 고칠 것 개수
- 심각 3 (S12 order 순서, S9 order 침상 번호 — 둘은 order 목록에도 있음, 7.1 why)
- 빈칸 49 (아이콘 일괄 1 + 문장별 48) · decoy 3 · distractorsKo 4 · order 15 (S3 선택 포함) · why/tag/icon 9 (3.0 선택 포함)
- **합계 v46 고칠 것 81건**(빈칸 49 + decoy 3 + distractorsKo 4 + order 15 + why/tag/icon 9 + 심각 중 7.1 why 1) · 결정 대기 1 · base 보고 5 + 청크 경계 4

## 종합
`why`·context/swap `ko`는 거의 그대로 내보낼 수준이고 임상 내용도 대체로 미국 관행에 맞다. 다만 S12 order의 손 위생 순서와
S9의 침상 번호 식별은 **반드시** 고치고, 빈칸 오답·아이콘 일괄 수정과 order 12장의 순서 고정을 반영한 뒤 재검사하면 내보내도 된다.
