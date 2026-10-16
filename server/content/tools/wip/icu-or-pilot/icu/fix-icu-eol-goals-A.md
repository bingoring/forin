# icu-eol-goals — A 검토 (v45 1~7 + 기계적 전수 확인 + context 핸드오프 모양·swap ko)

대상: `icu-eol-goals.yaml`(254단어 · 21상황 · 147문장 · 뉘앙스 50문항). 비교: base, changes(73건, 덮어쓰이지 않음 — 단어 34 + 문장 39건 일치), in.json.
표기: `상황번호/문장index(0부터)`. 상황 번호는 파일 순서(1 사전연명의향·DNR 확인 … 21 젊은 환자 임종 특수 상황).

## 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 철자·소리 닮은 오답은 지시서대로지만 품사 불일치 20여 개, 낱말이 아닌 오답 2개(foc·incomfortable), 정답으로도 맞는 오답 1개(medication←medicine) |
| 2 distractorsKo | 3 | 길이 규칙은 전부 통과. 동의어 오답 3개(차트←기록지·기록표, 원하다←바라다, 확인하다←확정하다), 품사 어긋남(welcome) |
| 3 cue | 3 | 정답 영어 노출은 없음. 대신 "○○을 가리킬 때" 틀에 ko를 그대로 넣은 cue가 많고, 3개는 지킬 수 없는 약속을 cue로 가르침(suffer·hearing·faster) |
| 4 chips/decoyChips | 3 | 형태소 분할은 대체로 좋음. **비속어 decoy 4개**(ass·cum·butt·naff)는 반드시 고칠 것 |
| 5 사실 정확성 | 4 | OPO 분리, CPOT, GRIEV_ING(died를 분명히), child life, 임종기 초조 원인(요저류 포함)은 정확함. 과장 4건(철회는 "보통" 단계적, 분비물 소리는 약으로 줄일 수 있다고 단정, 윤리위원회가 "결정", 방문한 친구 장면) |
| 6 뉘앙스 설계 | 3 | pair 2문항은 결합 24개 전부 정답 하나. swap 11문항은 문법과 ko 모두 맞음(1·6 ko는 다듬기). 하지만 context 3문항은 어색한 장면의 **뜻이 달라짐**(같은 뜻·안 맞는 자리가 아님). slider 4문항은 척도 순서가 한 축이 아님 |
| 7 결정 11 | 4 | 73건 변경은 타당하고 과하지 않음(쉬운 단어 20개, ko 12개 모두 근거 있음). 남은 것은 뜻이 다른 자리에 같은 id를 붙인 태그 6건과 틀린 ko 몇 개 |

## 사실 오류·심각한 문제

1. **비속어 decoyChips** — 학습자 화면에 조각으로 나온다. w-grimace `ass`, w-welcome `cum`, w-better `butt`, w-enough `naff`.
2. **지킬 수 없는 약속을 하는 문장(keyPhrase가 아닌 것)** — 4/slider가 "never feel anything 같은 절대적 약속은 지킬 수 없다"고 가르치는데, 같은 주제의 문장은 그런 약속을 한다. 9/3 "She won't suffer", 9/4 "she won't feel that", 8/5 "Nothing will happen faster…", 16/5 "I won't leave this room until…". 아래 고칠 것 S1~S4.
3. **keyPhrase 문장의 같은 문제** — 아래 "사용자 결정 필요"(고치지 않고 보고만 함).
4. **context 3문항에서 어색한 장면의 뜻이 다름** — 5 stay(면회를 8시까지로 제한), 15 donation(오늘 안에 결정하라고 재촉), 17 both("calm down"이라는 무시). 말투가 안 맞는 게 아니라 **내용이 틀린** 장면이라 지시서(TASK 9)의 모양이 아니다. N3·N4·N5.
5. **20 context surrogate, 방문한 친구 장면** — fix가 친구에게 결정 절차(윤리위원회가 결정한다)를 알린다. why는 "개인정보는 필요한 범위만"이라고 하는데 그와 어긋난다. 또 미국 여러 주의 대리결정 순위에는 **가까운 친구**가 들어 있어서(예: NY FHCDA, IL), 친구는 오히려 환자의 뜻을 물어볼 사람이다. 윤리위원회는 결정 주체가 아니라 자문·검토 기구다. N6.

## 사용자 결정 필요 — keyPhrase 문장(en은 고치지 않음, V4)

| 위치 | 문장 | 문제 | 안전한 대안(참고용) |
|---|---|---|---|
| 16/2 | Stay with her — I'm right here and she'll settle. | 결과를 약속함 | "…and we'll help her settle." |
| 19/0 | I'm right here with you and I won't leave. | 다른 환자 때문에 못 지킬 수 있는 약속 | "I'm right here with you, and I'm staying." |
| 19/1 | His passing looks peaceful and he's not in pain. | 통증 없음을 단정함(평가 근거가 필요) | "…and he doesn't look to be in pain." |
| 19/2 | Take a breath — you can talk to him, he can hear you. | 청각이 남아 있다고 단정함. 5/1 KP("often the last sense")와 slider why는 "남을 수 있다"고 씀 | "…he may still hear you." |
| 15/0 (+ 상황 목표 "장기기증 옵션을 … 제안한다") | Donation is an option some families find meaningful. | 미국에서는 CMS CoP(42 CFR 482.45)에 따라 OPO나 지정 요청자만 기증을 꺼낸다. 이 상황의 slider why와 context도 그렇게 가르친다. 그런데 간호사가 먼저 기증을 제안하는 KP라서 앱 안에서 메시지가 서로 어긋난다 | 장면을 "가족이 먼저 기증을 물었을 때"로 brief/goal을 바꾸거나 KP를 교체 |
| 19/3·19 context fix (비KP지만 19/0과 묶임) | …and I'll stay right here with you through it. | 19/0과 같은 종류의 약속 | 19/0 결정을 그대로 따른다 |

KP 문장 ko는 고쳐도 된다(아래 K1~K2).
KP chunks에서 구 경계를 끊은 곳(보고만 함): 7/0 `that in`, 12/0 `comfort and / support`, 12/2 `is on / the same page`, 14/1 `is very / human`, 15/1 `what it / would involve`, 17/1 `what she / would have wanted`, 19/0 `and I won't / leave`, 20/1 `about his / prior wishes`, 21/0 `and you don't / have to face it`, 21/1 `talk with her / children`, 9/2 `right by / her side`.

## 고칠 것

### 문장 (메모의 지적 + 전수 확인) — **en을 바꾸면 그 문장의 B 필드(blank·decoy·distractorsKo 둘·why)도 새 문장에 맞춰 다시 쓸 것**(B 검토 범위. blank.answer는 새 en에 있어야 하고 decoy는 새 en에 없어야 함)

- **S1 9/3** · 단정적 약속 "She won't suffer" · en `We prepare medication before we start, so we can keep her from suffering.` / chunks `We prepare medication / before we start / , / so we can keep her / from suffering / .` / ko `시작 전에 약을 미리 준비해서 고통스럽지 않게 해 드릴 수 있어요.` / words `[w-prepare, w-medication, w-start, w-keep, w-suffer]`. 딸린 것: w-suffer·w-prepare의 example·exKo, w-suffer cue(아래 C2).
- **S2 9/4** · "she won't feel that" 단정 · en `Some breaths may look irregular, but that's expected and we'll keep her comfortable.` / chunks `Some breaths / may look irregular / , / but that's expected / and we'll keep her / comfortable / .` / ko `숨이 불규칙해 보일 수 있지만 예상된 일이고, 편안하게 해 드릴 거예요.` / words `[w-breath, w-look, w-irregular, w-expect, w-keep, w-comfortable]`. 딸린 것: w-breath·w-irregular의 example·exKo, 9 slider의 example·exKo.
- **S3 8/5** · 환자 상태는 가족의 준비를 기다려 주지 않음 · 의료진이 지킬 수 있는 약속으로: en `We won't take any step faster than your family is ready for.` / chunks `We won't take / any step / faster than / your family / is ready for / .` / ko `가족분들이 준비되시기 전에 서둘러 다음 단계로 넘어가지 않을게요.` / words `[w-step, w-faster, w-ready]`. w-happen은 8/6·16/1에 남는다. 딸린 것: w-happen·w-faster example·exKo, w-faster cue(C2).
- **S4 16/5** · "I won't leave this room until…" 무조건 약속 · en `I'm staying right here while we get her comfortable again.` / chunks `I'm staying / right here / while we get her / comfortable again / .` / ko `다시 편안해지시도록 하는 동안 제가 바로 여기 있을게요.` / words `[w-stay, w-comfortable]`. 16의 distinct는 17로 V3 통과.
- **S5 17/5** · "and still both be right to love her"가 부자연스럽고 ko와 안 맞음 · en `It's okay to disagree when you both love her this much.` / chunks `It's okay / to disagree / when you both / love her / this much / .` / ko `두 분 다 이만큼 사랑하시니 의견이 다를 수 있어요, 괜찮아요.` / words 그대로. 딸린 것: w-disagree example·exKo.
- **S6 10/3 ko** · `불안정한 느낌` → `초조함을 덜어 드릴 만큼만 약을 드려요.`(단어 ko는 이미 '초조함'으로 바뀜). 딸린 것: w-enough·w-restlessness exKo, 10 slider exKo. distractorsKo 둘도 새 ko에 맞출 것.
- **S7 2/4 ko** · "not just"를 "보다 먼저"로 옮김 · `의학적 선택지만이 아니라 그분의 가치관도 생각해 보세요.` (+distractorsKo 둘, w-value·w-option exKo)
- **S8 9/5 ko** · ko에 영어가 그대로 있고 '다정하게'가 처치에는 어색함 · `이 과정을 단계적 이탈(terminal weaning)이라고 하는데, 천천히 부드럽게 진행해요.` (+distractorsKo, w-process·w-weaning·w-slowly exKo)
- **S9 21/3 ko** · `그건 실제예요`가 번역투 · `이렇게 젊은 분을 잃는 건 다르게 느껴지고, 그 마음은 당연해요.` (+distractorsKo, w-young·w-real exKo)
- **S10 14/4 ko** · w-heavy ko를 '무거운'으로 바꿨는데 문장 ko는 '더 힘드실' · `어떤 날은 마음이 더 무겁게 느껴질 수 있고, 그것도 괜찮아요.` (+distractorsKo, w-heavy exKo)
- **K1 7/2 ko (KP, ko만)** · en은 질문인데 ko는 평서문 · `지금 의사 선생님께 어떤 질문을 하시도록 도와드릴까요?`
- **K2 10/1 ko (KP, ko만)** · `서두르는 게` → `목표는 편안함이지, 무언가를 앞당기려는 게 아니에요.` hasten = 임종을 앞당김. 이중효과 원칙의 핵심이다. (+w-hasten exKo, order 10에서 이 문장을 인용하면 그것도)

### chunks (비KP, 구 경계)
- 1/6 `matches what / your family understands` → `matches / what your family understands`
- 3/3 `but that doesn't / always mean` → `but that / doesn't always mean`
- 4/5 `right by / the bed` → `There's a chair / right by the bed / if you'd like / to sit / .`
- 9/6 `we do / this` → `I'm watching her / the entire time / we do this / .`
- 10/5 `how much / medication` → `His body / will guide / how much medication / he needs / .`
- 16/6 `calling me / over` → `You did / exactly / the right thing / calling me over / .`
- 17/6 `each / of your concerns` → `Let's / slow down / and hear / each of your concerns / .`
- 19/5 `and that's part / of how / this goes` → `His breathing is slowing / , / and that's part / of how this goes / .`

### 단어 — distractorsEn (항목 1)
- 정답으로도 맞음: **w-medication** `medicine` → `dedication`.
- 낱말이 아님: **w-focus** `foc` → `locus`. **w-uncomfortable** `incomfortable` → `unaccountable`.
- 품사 다름(정답 품사에 맞춰 바꿀 것):
  w-specialize `specialist, specialty`(명사) → `specify, socialize` · w-specialist `specialize`(동사) → `socialist` · w-withdraw `withdrawal` → `withstand`(withhold는 좋은 오답이니 유지) · w-meaningful `meaning` → `merciful` · w-laugh `laughter` → `cough` · w-dress `dresser` → `drape` · w-coordinate `coordinator` → `consolidate` · w-manage `manager` → `massage` · w-prior `pride, priority` → `proper, prime` · w-symptom `simple` → `syndrome` · w-distress `destroy` → `duress` · w-document `doctor, documentary` → `comment, torment` · w-organ `organic` → `organism` · w-life `live` → `line` · w-ethics `ethnic` → `optics` · w-physician `physical` → `physique` · w-ahead `ahem` → `aside` · w-listen `listing, lesson` → `glisten, lessen` · w-interest `interact` → `interval` · w-notice `novice` → `nourish` · w-honor `honest` → `hover` · w-goodbye `good` → `goodwill` · w-pressure `pressed` → `treasure` · w-keep `keen` → `peep` · w-ask `task` → `bask` · w-common `comment, commune` → `comic, solemn`(형용사) · w-calm `call` → `cold`(형용사) · w-long(부사 "as long as") `lung, song` → `along, lengthy` · w-sense `since` → `scent` · w-labored `laboratory` → `layered`(labeled는 유지) · w-differently `difficulty` → `defiantly`(diffidently는 유지) · w-matter `mater, mother` → `batter, natter`(동사).
- 같은 분야에서 헷갈리는 말이 더 나은 것(지시서 "가장 좋은 오답"): w-palliative `alliterative` → `curative` · w-titrate `tighten` → `taper` · w-dnr `ICU` → `POLST` · w-respond `spoon` → `respire` · w-moment `mom` → `momentum` · w-tomorrow `morrow`(고어) → `tonight`.
- "너무 쉬운가"에 대한 판정: 철자·소리가 닮은 오답 자체는 지시서가 허용한다. 하지만 분야 밖 명사(tomato·princess·carrot·farm·butter·costume·mussel·pasture)가 꽤 많아 읽지 않고도 걸러진다. 핵심 임상어(palliative·titrate·withdraw·weaning·hasten·surrogate·capacity·DNR)는 같은 분야의 헷갈리는 말로 우선 바꿀 것(위 목록). 나머지 일상어는 그대로 둬도 된다.

### 단어 — distractorsKo (항목 2)
- **w-chart** `기록지, 기록표`(동의어) → `처방전, 동의서`
- **w-want** `바라다`(= w-hope ko, 동의어) → `거절하다`
- **w-confirm** `확정하다`(confirm의 다른 뜻) → `추측하다`
- **w-meeting** `면담, 상담`(family meeting을 '가족 면담'이라고도 해서 정답이 둘) → `회진, 교대`
- **w-surrogate** `환자 가족`(대리결정자는 대개 가족이라 맞다고 할 수 있음) → `참관인`
- **w-welcome** ko `괜찮은`(형용사)인데 오답은 동사 → 오답을 `곤란한, 불편한`으로
- w-medicine `철학, 교육`(분야 밖) → `약학, 간호학`
- w-best: 아래 결정 11 D6에서 ko를 바꾸면 오답도 `가장 흔한, 가장 빠른` 식으로

### 단어 — cue (항목 3)
- **C1 ko를 감싸기만 한 cue** — 장면이 떠오르게 다시 쓸 것: w-light "병실 조명을 가리킬 때", w-chair, w-illness, w-symptom "환자가 겪는 증상을 가리킬 때", w-kid "어린 아이들을 가리킬 때", w-child, w-tube, w-space, w-posture, w-muscle, w-tomorrow "내일 일정을 잡는다고 말할 때", w-specialist, w-ethics, w-important. 예: w-light → "임종이 가까운 병실을 어둡고 차분하게 만들 때 줄이는 것".
- **C2 약속을 가르치는 cue**: w-suffer "고통스러워하지 않을 거라고 안심시킬 때" → "약을 미리 준비하는 이유를 가족에게 말할 때"(ko 되풀이도 같이 사라짐) · w-hearing "환자가 마지막까지 소리를 듣는다고" → "마지막까지 남을 수 있는 감각을 가족에게 알릴 때" · w-faster "빨리 진행되는 일은 없다고 약속할 때" → "가족이 준비되기 전에 서두르지 않겠다고 할 때" · w-settle "곧 가라앉을 거라고 안심시킬 때" → "급변한 증상이 약으로 가라앉기를 기다릴 때".
- w-yourself cue "가족이 스스로에게 말할 때 쓰는 말"은 틀림(간호사가 가족에게 by yourself) → D4와 함께.

### chips/decoyChips (항목 4)
- **비속어**: w-grimace `ass` → `ice` · w-welcome `cum` → `comb` · w-better `butt` → `bat` · w-enough `naff` → `nuff`
- w-differently `dyf`(소리만 흉내 낸 조각) → `fur`

### 뉘앙스 (항목 5·6, context 핸드오프 모양, swap ko)
- **N1 3 swap** notes(ease it with medication) · 임종기 분비물 소리(death rattle)는 항콜린제의 효과 근거가 약하고(Cochrane), 자세 바꾸기·구강 흡인이 먼저이며, 완전히 줄지 않을 수 있다 · 정답 option을 `…and we can ease it.`(KP 그대로)이나 `…and we can ease it with repositioning and medication.`로, notes를 "자세를 바꾸고 약을 써서 줄여 볼 수 있다"로. why의 "약으로 줄일 수 있어요"도 같은 식으로. 핵심은 "환자는 대개 이 소리로 괴로워하지 않는다"라고 why에 한 줄 더할 것.
- **N2 8 slider why** · "연명치료 철회는 **보통** 단계적으로" — 미국 ICU에서는 terminal extubation(즉시 발관)도 terminal weaning만큼 흔한 표준 선택이고, 승압제는 한 번에 끄는 일이 많다 · "이 장면처럼 증상을 조절하면서 순서대로 진행해요"로.
- **N3 5 context stay** · 어색한 장면 `Visitation hours state that you may stay only until 8 p.m.`은 뜻이 다름(제한) · `Per our end-of-life visitation policy, family members may stay at the bedside.`(규정 말투를 아내에게 읽어 줌) / fix 그대로. 또 context ko `곁에 머무르다`가 단어 ko `머무르다`와 다름 → `머무르다`로 맞출 것.
- **N4 15 context donation** · 어색한 장면 `We need your decision on donation by the end of the day.`은 재촉하는 내용이라 뜻이 다름 · `He may be eligible for donation after circulatory death per OPO criteria.`(OPO·DCD 용어를 아들에게) / fix 그대로 / why를 "의료진끼리의 기준·용어를 가족에게 그대로 말하면 결정을 재촉하는 것처럼 들려요. 기증 이야기는 별도 팀이…"로.
- **N5 17 context both** · `both`는 듣는 사람에 따라 온도가 달라지는 말이 아니고, 어색한 장면은 'calm down'이라는 내용 때문에 어색함 · word를 `disagree`로 바꾸기: 차트 `Son and daughter disagree on plan; ethics consult requested.` ✓ / 윤리팀 `We have two surrogates who disagree — can you see them today?` ✓ / 두 자녀에게 ✕ `Your disagreement is impeding the plan of care.` fix `It's okay to disagree — you both love her deeply.` / words `[w-disagree]`, ko `의견이 다르다`, why를 새 장면에 맞게.
- **N6 20 context surrogate 친구 장면** · fix를 `Did he ever tell you what he'd want if he got this sick? That would really help us.`로 바꿀 것(친구가 아는 환자의 뜻을 묻고 결정 절차는 알리지 않음). why에 "주에 따라 가까운 친구도 대리결정자가 될 수 있고, 윤리위원회는 결정이 아니라 자문·검토를 한다"를 반영. 어색한 장면 en(unbefriended·committee 용어)은 그대로 둬도 됨.
- **N7 slider 척도가 한 축이 아님** · 6 `quickly/carefully/gently`(carefully와 gently 둘 다 맞을 수 있음 → `briskly / carefully / tenderly`처럼 손길의 온도 한 축으로, 아니면 pair로) · 7 `in medical shorthand / in plainer terms / in writing`(writing은 축 밖 → `in clinical terms / in plainer terms / in the simplest words`, 정답 1 유지) · 9 `slightly uneven / irregular / labored`(why도 "서로 달라요"라고 함 → `slightly uneven / irregular / gasping`) · 17 `taking sides / staying neutral / avoiding the topic`는 관여 정도의 축으로 읽히니 둬도 됨.
- **N8 1 swap ko** · `소생술은 안 한다는 뜻이에요 — 심장이 멈추더라도요`는 바뀐 두 번째 문장만 옮겼고 '-더라도'는 if가 아님 → `DNR은 통증 치료를 멈춘다는 뜻이 아니라, 심장이 멈추면 심폐소생술을 하지 않는다는 뜻이에요`
- N9 6 swap ko · 꼬리 `— 편하신 대로요`가 빠짐(사소함).
- N10 18 context 윤리팀 장면 · `asks for more care that may cause harm` → `more treatment`(이 주제는 "돌봄은 멈추지 않는다"를 가르침).
- N11 11 context · 문장은 her인데 context는 He/His(사소함, 통일 권장).
- N12 16 context 의사 호출 장면 · `I need orders immediately`는 slider why("미리 정해 둔 증상 조절 약을 바로")와 어긋남 → `Pt gasping after extubation — PRN given, can you come immediately?`

pair·swap 전수 결과: pair 1(advance directive/code status/chest compressions + paperwork), pair 20(next of kin/ethics consult/decision-making capacity + the chart)는 결합 24개 중 정답 말고 성립하는 영어가 없음. swap 11문항은 before[0]+선택지+before[2] 33줄 모두 문법이 맞음.

## 결정 11 (항목 7)
저작자 변경 73건은 모두 타당하다(쉬운 단어 20개를 지우고 thing·other·over·again은 판단해서 지움, speak·meeting 추가, ko 12개 수정). **더 지우라고 하지 않는다.** 넓게 지우면 상황 2가 V3 아래로 떨어진다. 남은 것은 아래뿐이다(각 상황 distinct가 8을 넉넉히 넘어 태그를 빼도 안전함).
- **D1 w-sense** 7/6 "makes sense"(감각 아님) → 그 문장에서 태그만 빼기(상황 7: 19→18)
- **D2 w-side** 17/3 "choosing sides"(곁 아님) → 태그 빼기. w-choose ko `편들다`는 choose sides라는 구의 뜻이라 헤드워드 뜻으로는 틀림 → ko `고르다`(cue는 "누구 편에 설지 고르라는 압박을 받을 때")
- **D3 w-once** 18/1·18/4 "once helped / once meant" = 한때 → ko를 `한때`로 바꾸고 7/4("more than once")에서 태그 빼기. distractorsKo `늘, 다시`, cue·example을 18/1로
- **D4 w-work** 12/6 "work alongside", 13/5 "work around" = '효과가 있다'가 아님 → 두 문장에서 태그 빼기. 대신 w-around 헤드워드를 `work around`로(ko `~에 맞춰 조정하다`, chips `[[work],[a,round]]`) 바꾸는 것도 좋음
- **D5 w-look** 11/3 "look closely" = 살펴보다(보이다 아님) → 태그 빼기
- **D6 w-best** ko `가장 잘`은 10/6에만 맞고 13/1 "do our best", 18/6 "what's best", 20/2 "best interest"는 '최선·가장 좋은' → ko `최선(의)·가장 좋은`으로(10/6은 태그를 빼도 상황 10이 20개)
- **D7 틀린 ko**: w-page `같은 내용` → 헤드워드를 `on the same page`로(ko `같은 이해를 공유하는`, chips `[[on],[the],[same],[page]]`) · w-yourself `혼자서` → 헤드워드 `by yourself`(ko `혼자서`, chips `[[by],[your,self]]`, 오답 `to yourself, for yourself`) · w-entire `온전한` → `전체의`(w-whole과 겹치면 `꼬박·내내`) · w-through `헤쳐서` → `(끝까지) 거쳐` · w-lack `없다` → `결여하다`
- w-speak 추가는 쉬운 말이지만 2/3 문장에 다른 태그가 없어 받아들일 만함.

## 종합
사실 오류는 적고 핵심 관행(OPO 분리, DNR≠치료 중단, died를 분명히, CPOT, child life)은 정확하다. 다만 이 주제가 슬라이더로 가르치는 "절대 약속은 하지 말 것"을 문장들이 어기고 있다. 비KP 4문장(S1~S4)과 비속어 decoy 4개, context 3문항(N3~N5)을 고치면 내보내도 된다. KP 4문장과 15/0의 기증 제안 KP는 사용자 결정 뒤에 반영한다.
