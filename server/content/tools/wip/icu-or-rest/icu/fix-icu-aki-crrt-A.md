# fix-icu-aki-crrt-A — A 검토 (v45 1~7 + 기계적 전수 확인 + context 모양·swap ko)

대상: `icu-aki-crrt.yaml`(A·B 합친 파일, 단어 266 · 상황 21). 상황 번호는 **1부터**(S1 = 소변량·크레아티닌 추세 사정), 문장 번호는 0부터.
저작자 메모의 "상황 N"은 0부터 센 번호입니다(메모 "상황 5" = 여기 S6).
`verify_one_theme.py icu …` 는 **통과**합니다 — 그런데도 아래 기계 형태 오류 2건(w-off decoyChips 중첩 목록, w-add-up 오답의 따옴표)을 잡지 못했습니다.

## 항목별 점수
1. distractorsEn — **3/5**. 대부분 철자·소리가 닮은 오답이지만 품사가 다른 오답이 많고(아래 표), 정답이 둘 되는 것 3건(track↔trace, warmer↔heater).
2. distractorsKo·길이 — **4/5**. 길이 규칙은 스크립트로 전부 통과. prime의 `세척하다`가 정답에 가까움.
3. cue — **4/5**. 정답 노출 없음. ibuprofen cue 사실 오류 1, medicine cue는 S6[3]와 같은 오류, ko를 되풀이하는 cue 몇 개.
4. chips/decoyChips — **3/5**. 자르기는 형태소 단위로 좋음. w-off decoyChips가 중첩 목록(형태 오류), 불쾌·술 조각 여럿.
5. 뉘앙스 사실성 — **4/5**. why·notes는 미국 ICU 관행(net even, 프로토콜 보충, 경보 대응, 저체온 보온, 용량 판단은 의사·약사)에 대체로 맞음. "fully effective" 과장 1, 가족 면담 fix의 "doing everything we can" 1.
6. 뉘앙스 설계 — **3/5**. **S9 swap은 이어 붙이면 문법이 깨짐**(아래). S3 slider "critically worse"는 어색한 영어. pair 문항은 이 주제에 없음.
7. v44 단어·문장(결정 11) — **3/5**. w-fluid `수액`(체액이어야 함), 부사로만 쓰이는 critical·different 헤드워드를 놓침, w-realistic 변경 항목은 실제로 바뀐 게 없음.

## 사실 오류·심각한 문제
1. **S6[3] "This medicine works only inside the circuit, not through his whole body."** — 시트르산(국소 항응고)에만 맞고 헤파린은 전신에 작용. 같은 상황의 KP가 일반 "blood thinner"이고 출혈 감시 문장이 이어지는데, 가족이 "몸에는 영향 없다"로 듣게 됨. 시트르산도 일부는 전신으로 넘어가서 전신 이온화 칼슘을 감시함. **안전.** (keyPhrase 아님 → 고침)
2. **S11[3] "Most alarms mean pressure, not an emergency."** — 공기 감지·혈액 누출 경보, 그리고 환류 압력이 낮게 뜨는 경보(라인 분리)는 바로 대응해야 함. 경보를 미뤄도 된다고 일반화하는 말. **안전.** (keyPhrase 아님 → 고침)
3. **S18 시트르산 축적과 알칼리증** — 축적(간 대사 장애·쇼크)의 전형은 총/이온화 칼슘 비 상승(>2.5) + 이온화 칼슘 저하 + **음이온차 대사성 산증**입니다. 대사성 알칼리증은 대사가 정상인데 시트르산이 과하게 들어갈 때(과부하) 나오는 쪽. S18[1]은 keyPhrase(→ 사용자 결정), **S18[5] "the risk of alkalosis drops too"는 keyPhrase가 아님 → 고침. 안전**(산염기 방향을 거꾸로 배움). in-json S18의 tagline·brief도 "대사 알칼리증"이라, 결정하면 거기까지 바뀝니다.
4. **S9 swap 문법 깨짐(기계 확인)** — `before[0]`이 `"We're checking your "`라서 정답이 "We're checking your how acidic or basic your blood is…", 오답이 "…your your ABG…"로 조립됨. 정답 문장이 틀린 영어로 화면에 나옵니다.
5. **S15[4] "We increase his calories to make up for what CRRT takes out."** — CRRT가 주로 빼내는 것은 아미노산·단백질·수용성 비타민·미량원소. 시트르산·포도당이 든 용액에서는 오히려 칼로리가 들어오고, 칼로리를 늘리면 과영양 위험. 영양 처방은 영양사·의료진이 정함. 사실 오류이면서 간호사가 정할 수 없는 일을 하겠다고 약속하는 문장. 안전 문제로는 세지 않음.
6. 형태 오류: w-off `decoyChips: [['of']]`(문자열 목록이 아니라 목록 안의 목록), w-add-up `distractorsEn`의 `add "on"`(값에 따옴표 문자가 그대로 들어감). 검사기가 통과시킴.

## 고칠 것 — 문장 (keyPhrase 아님)
en을 바꾸는 항목은 전부 **chunks를 새 en에 맞게 다시, 그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)도 새로 쓸 것.** words 변화와 단어 사용 횟수도 적었습니다(V3는 모든 상황에서 여유가 있음).

| # | 어디 | 문제 | 고칠 en / ko / chunks / words |
|---|---|---|---|
| F1 | S6 항응고 기초 감시 [3] **(안전)** | 위 1 | en: `We dose this medicine carefully so it protects the filter without thinning his blood too much.` / ko: `이 약은 필터를 지키면서 피가 너무 묽어지지 않게 용량을 조심스럽게 맞춰요.` / chunks: `We dose / this medicine carefully / so it protects / the filter / without thinning / his blood too much / .` / words: [w-dose, w-medicine, w-protect, w-filter, w-blood] (w-work·w-circuit 태그 빠짐 — 둘 다 다른 문장에도 있음, w-medicine은 유지). 대안(시트르산을 밝히는 쪽): `If we use citrate, it works mostly inside the circuit, not his whole body.` |
| F2 | S11 회로 응고·압력 경보 대응 [3] **(안전)** | 위 2 | en: `Most alarms are pressure alarms, but an air or blood leak alarm is an emergency.` / ko: `알람은 대부분 압력 알람이지만, 공기나 혈액 누출 알람은 응급이에요.` / chunks: `Most alarms / are pressure alarms, / but an air or blood leak alarm / is an emergency / .` / words: [w-alarm, w-pressure, w-emergency, w-blood] (w-mean 빠짐 — 3→2회, w-emergency는 이 문장뿐이라 유지됨). why에 "어느 경보든 바로 확인한다"를 담을 것. |
| F3 | S18 시트르산 축적 위기 [5] **(안전)** | 위 3 | en: `Once the ratio comes down, the risk from low calcium drops too.` / ko: `비율이 내려가면 저칼슘으로 인한 위험도 함께 줄어요.` / chunks: `Once the ratio / comes down, / the risk from low calcium / drops too / .` / words: [w-ratio, w-risk, w-low, w-calcium, w-drop] (w-alkalosis 빠짐 → S18[1] KP에만 남음. KP 결정과 상관없이 맞는 문장) |
| F4 | S18 시트르산 축적 위기 [3] | 단독으로 읽으면 무슨 대비인지 흐림(저자 지적 타당) | en: `This comes from citrate building up, not from his kidneys getting worse.` / ko: `이건 시트르산이 쌓여서 생긴 것이지, 신장이 나빠져서가 아니에요.` / chunks: `This comes / from citrate building up, / not from his kidneys / getting worse / .` / words: [w-citrate, w-build, w-kidney, w-worse] (w-same 3→2, w-number 4→3, w-change 9→8회) |
| F5 | S15 CRRT 중 저체온·영양 손실 관리 [4] | 위 5 | en: `The dietitian adjusts his calories and protein to make up for what CRRT takes out.` / ko: `영양사가 CRRT가 빼내는 만큼 칼로리와 단백질을 조정해요.` / chunks: `The dietitian adjusts / his calories and protein / to make up / for what CRRT takes out / .` / words: [w-adjust, w-calorie, w-make, w-crrt, w-take] (w-increase 빠짐 — S19에 남음, w-calorie 유지) |
| F6 | S14 약물 투석 청소 고려 [3] (낮음) | "we dose them differently" — 동료에게 팀을 뜻하는 we는 미국 간호사 말로 자연스러워서 오류는 아님. 용량은 약사·의사가 정한다는 걸 드러내면 더 정확함(같은 상황 context why와도 맞음) | en: `Some antibiotics wash out fast on CRRT, so pharmacy may dose them differently.` / ko: `일부 항생제는 CRRT에서 빨리 빠져나가서 약국에서 용량을 다르게 정할 수 있어요.` / chunks: `Some antibiotics / wash out fast / on CRRT, / so pharmacy may dose them / differently / .` / words: 기존 + w-pharmacy |
| F7 | S7 CRRT 처방 파라미터 이해 [3] (낮음) | "Blood flow is 150" — 동료끼리 인계라 mL/min을 생략하는 건 실제로 흔하고 안전 문제는 아님. 바로 뒤의 "2 liters an hour"와 단위가 달라 학습자가 헷갈릴 수 있음 | (선택) en: `Blood flow is 150 a minute, and dialysate is running at 2 liters an hour.` / ko: `혈류는 분당 150이고, 투석액은 시간당 2리터로 돌고 있어요.` / chunks: `Blood flow is 150 a minute, / and dialysate / is running / at 2 liters an hour / .` |

저자가 짚은 나머지 문장 판정:
- **S16[1] "Let's give calcium to protect the heart while we prepare CRRT."**(KP) — 심전도 변화가 있는 고칼륨에 정맥 칼슘을 주는 것은 표준 처치이고, 제안형("Let's")이라 오더를 대신하지 않음. **그대로.**
- **S14[2]·S14[1]**(KP)의 we도 같은 이유로 그대로.

## 고칠 것 — chunks (keyPhrase 아님, 구 경계를 끊음)
| 어디 | 지금 | 고칠 chunks |
|---|---|---|
| S2 수분·전해질 균형 기록 [4] | `Even small amounts / add up / over / a full day` | `Even small amounts / add up / over a full day / .` |
| S5 CRRT 회로·접근 관찰 [4] | `… / clean, dry, and free / of redness` | `The catheter site / should stay / clean, dry, / and free of redness / .` |
| S8 시간당 초여과량 적정 [3] | `… / than big, / fast ones` | `Small, slow changes / are safer / than big, fast ones / .` |
| S11 회로 응고·압력 경보 대응 [5] | `… / a new / circuit` | `If flushing doesn't help, / we prepare / a new circuit / .` |
| S14 약물 투석 청소 고려 [5] | `… / around the CRRT / schedule, / …` | `We time / doses / around the CRRT schedule, / not the clock alone / .` |
| S16 고칼륨혈증 응급 CRRT 연계 [4] | `… / while we / set up` | `I'll pull / the crash cart / while we set up / .` |

청크가 바뀌면 그 문장의 `decoy`가 새 청크와 같거나 그 안에 들어가지 않는지 확인하세요.

**keyPhrase라 보고만 함(구 경계 끊김):** S4[1] `than regular / dialysis` · S7[0] `and dialysate / settings` · S7[1] `His net fluid / removal goal` · S9[0] `the systemic / and circuit calcium ratio` · S9[1] `in his acid-base / status` · S12[1] `with the CRRT / settings` · S18[0] `The rising / total-to-ionized calcium ratio` · S18[1] `and low / ionized calcium`.
(KP여도 chunks는 en이 아니라서 결정 11 범위에서 고칠 수 있다고 보면, 위 7건은 같은 방식으로 합치면 됩니다 — 사용자 판단.)

## 고칠 것 — 문장 ko (결정 11, en은 그대로; **ko를 고치면 그 문장의 distractorsKo 둘도 새 ko에 맞춰 다시 쓸 것**)
| 어디 | 지금 ko | 고칠 ko |
|---|---|---|
| S13 간헐 투석과 방식 비교 판단 [4] (저자 지적) | 지속 치료가 불안정한 심장에는 더 쉬워요. | 지속 치료가 불안정한 심장에 부담이 덜해요. |
| S4 CRRT 개념·목적 이해 [1] (KP, ko만) | 일반 투석보다 혈압에 훨씬 부드러워요. ("훨씬"은 en에 없음) | 일반 투석보다 혈압에 부담이 덜해요. |
| S5 CRRT 회로·접근 관찰 [0] (KP, ko만) | …혈액을 기계로 나르고 다시 데려와요. | 이 큰 카테터가 혈액을 기계로 보냈다가 다시 몸으로 돌려보내요. |
| S5 CRRT 회로·접근 관찰 [3] | 한 라인은 혈액을 빼내고 다른 라인은 다시 데려와요. | 한 라인은 혈액을 빼내고 다른 라인은 다시 돌려보내요. |
| S2 수분·전해질 균형 기록 [0] (KP, ko만) | 매일 체중을 재면 그녀가 여분의 체액을 붙들고 있는지 알 수 있어요. | 매일 체중을 재면 몸에 여분의 체액이 고여 있는지 알 수 있어요. |
| S12 저혈압 동반 CRRT 관리 [3] | 지금은 적은 용량 변화도… ("용량"은 이 주제에서 dose 뜻) | 지금은 적은 체액량 변화도 혈압을 떨어뜨릴 수 있어요. |
| S20 카테터 관련 대량출혈·감염 위기 [4] | 부위가 붉고 따뜻해 보이면 감염일 수 있어요. (en은 조건문이 아니라 지금 상태) | 부위가 붉고 따뜻해 보이는데, 감염일 수 있어요. |

## 고칠 것 — 단어 v45 필드
1. **w-off** `decoyChips: [['of']]` → `decoyChips: ["of"]`(문자열 목록). 형태 오류.
2. **w-add-up** `distractorsEn: add "on"` → `add on`(따옴표 문자 빼기).
3. **w-track** distractorsEn `trace` → `trap`. trace도 한국어 사전 뜻이 "추적하다"라 정답이 둘. 은행 단어 w-trace이기도 함.
4. **w-trace** distractorsEn `track` → `brace`. track(추적하다)이 "따라가다"와 겹쳐 정답이 둘.
5. **w-warmer** distractorsEn `heater` → `warden`. heater도 "열을 내는 장비"(cue 그대로)라 정답이 둘.
6. **w-prime** distractorsKo `세척하다` → `분리하다`. 프라이밍은 식염수로 회로를 채우면서 헹구는 일이라 "세척"이 반쯤 맞음.
7. **w-ibuprofen** cue `집에서 먹는 소염진통제로 신장에 쌓이면 해로운 약` — NSAID는 신장에 "쌓여서"가 아니라 프로스타글란딘을 억제해 신장 혈류를 줄여서 해로움. → `집에서 자주 먹으면 신장으로 가는 혈류를 줄여 해로울 수 있는 소염진통제`.
8. **w-medicine** cue `필터가 굳지 않게 회로 안으로 넣는 약을 가리킬 때` — S6[3]과 같은 국소 전용 함의. → `필터가 굳지 않게 쓰는 약을 가리킬 때`.
9. **w-acid-base** distractorsEn `base-line` — baseline의 틀린 철자를 보여 줌. → `acid-free`.
10. **w-large** distractorsEn `lager`(맥주)·`charge`(명사/동사) → `lean`, `lax`(형용사, 철자 닮음). decoyChips `lager` → `barge`.
11. **decoyChips — 불쾌·술·장례 연상(V21 목록 밖이지만 같은 성격):**
    | 단어 | 조각 | 바꿀 조각 |
    |---|---|---|
    | w-urgent | `urn`(유골함) | `err` |
    | w-recover | `lover` | `cover` |
    | w-share | `shame`(가족 면담 상황) | `shake` |
    | w-level | `evil` | `eel` |
    | w-prime | `crime` | `prim` |
    | w-dangerous | `dam`(damn처럼 들림) | `den` |
    | w-oxygen | `gin` | `gem` |
    | w-run | `rum` | `rug` |
    | w-medicine | `mead`(술) | `mend` |
    | w-certain | `cur`(잡종개·비열한 놈) | `car` |
    그대로 둬도 되는 약한 것: pot·ash(w-potassium), lie, sick, crush, wife, mess, horse, nut. distractorsEn `kidnap`(w-kidney)·`deadly`(w-daily)은 불쾌 판정은 아니지만 kidnap은 품사도 달라 아래 표에서 교체.
12. **cue가 ko를 되풀이(낮음):** w-goal `치료로 이루고자 정해 둔 목표량`(ko "목표") → `치료로 하루·시간마다 빼기로 정해 둔 양`. w-off `정상 범위에서 멀어져 어긋나 있는`(ko "정상을 벗어난") → `보충한 뒤에도 기준선에 못 미치거나 넘는 수치를 두고`. w-temperature `체온계로 재는…`(ko "체온") → `열이 나거나 몸이 식었는지 재는 값`.
13. **w-alkalosis** cue (낮음) — 정의만 남기기: `혈액이 정상보다 염기성으로 기운 상태`. KP 결정이 "산증"으로 나면 w-alkalosis는 은행에서 빠지고 w-acidosis(산증)를 새로 만들어야 함.

### distractorsEn 품사가 다른 것 — 전수 표
(정답 품사는 예문 속 쓰임. ★ = 꼭 바꿀 것: 한눈에 품사로 걸러지거나 다른 문제와 겹침. 나머지는 철자가 매우 닮아 남겨도 되지만 같은 품사로 바꾸면 좋음.)

| 단어(품사) | 품사 다른 오답 | 바꿀 제안(같은 품사·철자 닮음) |
|---|---|---|
| ★ kidney(명) | kidnap(동) | chimney |
| hold(동) | hole(명) | hoard |
| ★ write(동) | wrist(명) | wipe |
| full(형) | fuel(명) | dull |
| ★ certain(형) | curtain·captain(명) 둘 다 | captain → curt (curtain은 철자가 닮아 유지 가능) |
| worse(형) | horse(명) | worn |
| ★ number(명) | numb(형) | lumber |
| give(동) | gift(명) | dive |
| safe(형) | save(동) | sage |
| choose(동) | choir(명) | chase |
| slow(형) | slot(명) | slim |
| way(명) | why(부) | ray |
| gentle(형) | gender(명) | genteel |
| regular(형) | regulator(명) | secular |
| remove(동) | remote(형/명) | remold |
| same(형) | seam(명) | tame |
| life(명) | live(동) | line |
| ★ large(형) | charge(명/동)·lager(명) | lean, lax (단어 v45 10번) |
| blood(명) | blond(형) | brood |
| work(동) | word·worm(명) | walk, worry |
| bring(동) | brine(명) | fling |
| loose(형) | loops(명) | close |
| thinner(명) | thicker(형) | tanner |
| ★ clot(동) | clock·cloth(명) 둘 다 | clog, clap |
| ★ sign(명) | sing·sigh(동) 둘 다 | song, sigil |
| medicine(명) | medical(형) | medley |
| gum(명) | glum(형) | gem |
| urine(명) | uric(형) | urea |
| net(형) | nut·nest(명) | neat, next |
| ★ current(형) | cursor·currency(명) 둘 다 | cursory, curious |
| ★ lower(동) | lawyer·flower(명) 둘 다 | loiter, follow |
| hourly(형) | hardly(부)·hourglass(명) | yearly, homely |
| ★ stable(형) | staple·table(명) 둘 다 | stale, able |
| fast(형/부) | fist·fest(명) | vast, last |
| further(부) | feather·father(명) | rather, hither |
| monitor(동) | motor(명) | muster (mentor는 동사로도 쓰여 유지) |
| mean(동) | mine(대) | moan |
| build(동) | guild(명) | bulge |
| problem(명) | probable(형) | probe |
| ★ cause(동) | clause·caution(명) 둘 다 | cease, coax |
| ★ often(부) | soften(동)·orphan(명) 둘 다 | soon, even |
| return(명) | retire·retain(동) | retort, retina |
| plan(동) | plain(형)·plank(명) | plant, plane |
| minimize(동) | minimum(명/형) | mobilize |
| later(부) | layer(명)·latter(형) | lately, latterly |
| hard(형) | hand·herd(명) | harsh, hardy |
| ill(형) | all(한정사)·oil(명) | idle, tall |
| basic(형) | basis(명) | basal |
| talk(동) | tall(형)·tale(명) | stalk, balk |
| next(형) | nest·text(명) | near, neat |
| cool(동) | coal·pool(명) | coil, cook |
| use(동) | ruse(명) | muse |
| feel(동) | fuel(명) | peel |
| add(동) | odd(형) | pad |
| high(형) | hair(명) | nigh |
| emergent(형) | emergence·emerald(명) | divergent, insurgent |
| act(동) | art·ant(명) | ask, aid |
| pull(동) | pool·pill(명) | poll, pour |
| lose(동) | loose·lone(형) | lease, loot (loose는 decoyChips가 맡음) |
| inside(부/전) | incite(동)·insight(명) | instead, beside |
| limit(동) | lime(명) | lilt |
| real(형) | reel·rail(명) | rear, regal |
| ★ stat(부) | star(명)·stay(동) | 같은 분야 약어 PRN, QID |
| prime(동) | crime·prism(명) | prise, prize |
| metabolic(형) | metabolism(명) | melodic |
| again(부) | against(전)·agent(명) | agape, apart |
| urgent(형) | agent(명) | urbane |
| breathe(동) | breeze(명) | wreathe |
| lung(명) | long(형) | rung |
| sit(동) | six(수) | sift |
| heavily(부) | heavenly(형) | heartily |
| firm(형) | farm·fern(명) | fine, fair |
| call(동) | hall(명)·tall(형) | cull, fall |
| long(부) | lung(명) | alone |
| want(동) | wand(명) | wane |
| together(부) | weather·tether(명) | altogether, thither |
| honest(형) | honor·hornet(명) | modest, earnest |
| ★ check(동) | cheek·chick(명) 둘 다 | chuck, choke |
| drug(명) | drag(동) | dreg |
| site(명) | cite(동) | side |
| dry(형) | dye(명/동)·try(동) | dire, wry |
| free(형) | tree(명)·fret(동) | fresh, frail |
| everything(대) | everywhere(부) | anything |
| alone(부) | atone(동) | aloof |
| ★ balance(동) | balloon·ballot(명) 둘 다 | balk, bounce |
| heart(명) | heard(동) | heat |
| list(명) | lost(형) | mist |
| fluid(명) | flush(동/명) | flute |
| weight(명) | eight(수) | freight |
| show(동) | shop·snow(명) | shove, stow |
| heal(동) | heel(명) | seal |
| flush(동) | flesh(명) | flash |
| shift(명) | swift(형) | sheaf |
| switch(동) | swatch(명) | stitch |
| renal(형) | rival(명) | venal |
| nutrient(명) | nurture(동) | nuisance |
| temperature(명) | temperate(형) | signature |
| pass(동) | past(형/전) | parse |
| loss(명) | toss(동) | moss |
| send(동) | sand(명) | tend |
| upright(부) | uptight(형) | outright |
| share(동) | shore(명) | snare |

※ 표의 "바꿀 제안"은 V13(정답·서로 같음)·V21(금칙어)·길이 규칙을 수정 담당이 다시 확인하세요. 급하면 ★ 표시만이라도.

## 고칠 것 — 뉘앙스
1. **S9 시트르산 항응고 대사 감시 · swap (심각, 기계)** — `before: ["We're checking ", "your acid-base status", " every few hours."]`, `options: [your acid-base status, how acidic or basic your blood is, your ABG]`, `answer: how acidic or basic your blood is`, `notes` 키도 새 옵션 문자열로. `ko`는 지금 그대로 맞음.
2. **S3 신독성 약물 검토 · slider** — `critically worse`는 쓰지 않는 결합. scale `[a bit worse, clearly worse, much worse]`, answerAt 2 그대로, `example: "His labs are much worse this morning."`, why의 critically worse → much worse.
3. **S2 수분·전해질 균형 기록 · slider example** — `Her weight is steadily up since Monday.`(현재형 + since) → `Her weight has gone up steadily since Monday.` exKo 그대로.
4. **S4 CRRT 개념·목적 이해 · swap** (낮음) — 정답 `a slow gentle dialysis machine` → `a slow, gentle dialysis machine`(형용사 두 개 사이 쉼표). notes 키도 같이.
5. **S14 약물 투석 청소 고려 · slider** (낮음) — 농도가 목표 안이고 균이 감수성이 있다는 것만으로 "fully effective"라 단정하는 것은 과장(임상 반응도 봄). example `The antibiotic is fully effective at this level.` → `The level is in range, so the antibiotic should be fully effective.`, why에 "열·백혈구 같은 임상 반응도 함께 봐요" 한 줄.
6. **S21 신대체 지속 여부 목표 논의 · context fix** (낮음) — `…he is very sick, and we're doing everything we can.` 목표 논의 장면에서 "everything"은 처치를 끝까지 다 한다는 약속으로 들림(VitalTalk 등에서 피하라는 말). → `I want to be honest with you: he is very sick, and we'll keep you updated every step of the way.`

**기계 확인 결과**
- pair: 이 주제에 pair 문항 **없음**(slider·context·swap만) — 판정할 결합 없음.
- swap 6개 전부 이어 붙여 읽음: S9만 문법이 깨지고(위 1) 나머지 S2·S4·S7·S12·S16·S18은 문법이 맞고 정답이 하나뿐. swap `ko` 6개는 전부 바꾼 문장의 뜻과 맞음.
- context 14개: `word`가 세 장면 `en` 모두에 있음(14/14), 어색한 장면은 같은 말을 듣는 사람에게 안 맞게(전문어와 함께 가족·환자에게, 또는 겁주는 설명) 쓴 곳 — 핸드오프 모양에 맞음. S6 bleed의 어색한 장면("no big deal")은 말투보다 내용(축소 보고)이 어긋난 것이라 약하지만 why가 설명하므로 둠. S20 context `ko: 압박`은 은행 w-pressure `ko: 압력`과 다르지만 그 장면엔 압박이 정확함.
- slider 21개: 순서(약→강)는 모두 말이 됨. S17 `quickly`↔`right now`는 가깝지만 why가 구분을 설명.

## 결정 11 — v44 단어·문장 정리
1. **w-fluid `ko: 수액` → `체액`** — 12문장 거의 전부가 몸속 체액(extra fluid·fluid removal·holding on to fluid). 수액(IV fluid)은 틀린 뜻. distractorsKo(공기·혈전)는 그대로 써도 됨. (w-volume `체액량`과는 글자가 다름)
2. **w-apply `적용하다` → `가하다`** — 유일한 쓰임이 "apply firm pressure"(압박을 가하다). exKo·cue는 이미 누르는 뜻.
3. **w-critical 헤드워드 → `critically`**(id 그대로) — 두 문장 모두 부사(critically ill·critically high). ko `심각하게`, ipa `/ˈkrɪtɪkli/`, chips `[[crit, i, cal, ly]]`, distractorsEn `[cynically, practically]`, distractorsKo `[경미하게, 무해하게]`, example은 S16[0] 문장.
4. **w-different 헤드워드 → `differently`**(id 그대로) — 두 문장 모두 부사(S14[3]·S21[3]). ko `다르게`, ipa `/ˈdɪfrəntli/`, chips `[[dif, fer, ent, ly]]`, distractorsEn `[diffidently, decently]`, distractorsKo `[똑같이, 짧게]`.
5. **w-pull `당기다`**(낮음) — "pull the crash cart"(가져오다)·"pull fluid off"(빼내다) 둘 다 "당기다"가 아님. → `끌어오다`, cue `응급 카트를 가져오거나 몸에서 체액을 빼낼 때`.
6. **w-thinner**(낮음) — 헤드워드 `thinner`만으로는 페인트 시너. `blood thinner`로(id 그대로, chips `[[blood], [thin, ner]]`), S6[0]의 words에서 w-blood는 빼도 됨(다른 문장에 많음).
7. **w-hold**(낮음, 선택) — 체액을 붙들다(S2[0])·CRRT 보류(S20[2])·압박 유지(S20[3]) 세 뜻. S20[2]의 words에서 w-hold만 빼면 "붙들다"와 어긋나는 쓰임이 하나 줄어듦(S20 V3 여유 충분).
8. **changes 목록**: `w-realistic` 항목(fields en·ipa)은 base가 이미 `realistically`·같은 ipa라 실제 변경이 없음 → 항목 삭제. 나머지 쉬운 단어 23개 삭제·ko 가르기 6건·heavily 헤드워드는 타당.
9. (참고, 고치지 않아도 됨) 뜻이 거의 같은 ko 쌍: tell 알려주다 / notify 알리다, heal 회복되다 / recover 회복하다, stay 유지되다 / keep 유지하다, urgent 긴급한 / emergent 응급의, medication 약물 / drug 약 / medicine 약제. 지금 각 단어의 distractorsKo에 서로가 들어가 있지 않아 정답 둘은 아님. 앱이 은행의 다른 ko를 오답으로 끌어오면 문제가 됨.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)
| 상황·문장 | 현재 en | 문제 | 대안 en |
|---|---|---|---|
| S18 시트르산 축적 위기 [1] **(안전)** | He's developing metabolic alkalosis and low ionized calcium. | 시트르산 **축적**의 전형은 음이온차 대사성 **산증** + 이온화 칼슘 저하(총/이온화 비 >2.5). 알칼리증은 대사가 정상인 과부하 쪽. in-json S18 tagline·brief도 "대사 알칼리증"이라 함께 바뀌어야 함 | ① `He's developing metabolic acidosis and low ionized calcium.`(w-alkalosis → 새 단어 w-acidosis 산증) ② 방향을 말하지 않는 `His acid-base is shifting, and his ionized calcium is low.`(w-acid-base 재사용) |
| S9 시트르산 항응고 대사 감시 [0] (낮음) | We monitor the systemic and circuit calcium ratio closely. | 감시하는 비율은 전신 총/이온화 칼슘 비. 전신과 회로(필터 뒤) 이온화 칼슘은 각각 따로 재는 값이라 "systemic and circuit … ratio"는 둘 사이의 비처럼 읽힘 | `We monitor his systemic and circuit ionized calcium closely.`(w-ratio는 같은 상황 [3]·[5]에 남음, w-ionized 태그 추가) |
| (보고만) 구 경계 끊긴 KP chunks | S4[1]·S7[0]·S7[1]·S9[0]·S9[1]·S12[1]·S18[0]·S18[1] | 위 chunks 절 참고 | chunks만 합치는 것은 en을 바꾸지 않음 |

그 밖의 KP(S16[1] 칼슘 투여 제안 포함)는 사실·업무범위 문제 없음.

## 종합
고칠 것 **46건**(문장 en 7 — 그중 선택 2 · chunks 6 · 문장 ko 6건(7문장) · 단어 v45 13 · 뉘앙스 6 · 결정 11 8 — 품사 표 102행은 1건으로 셈), 그중 **안전 3**(S6[3], S11[3], S18[5]) + KP 결정 1(S18[1]).
S9 swap 문법과 안전 3건을 고치고 S18[1] 결정이 나면 내보내도 됩니다. 품사 표는 ★만 먼저 고쳐도 됩니다.
