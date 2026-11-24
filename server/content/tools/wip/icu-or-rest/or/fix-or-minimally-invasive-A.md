# or-minimally-invasive — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번 context·swap ko)

대상: `or-minimally-invasive.yaml`(A·B 합본, `.pre-fix.yaml`과 같은 파일). 단어 191(base 204: 13개 삭제) · 상황 21(문장 126) · 뉘앙스 47(slider 21 · swap 21 · context 5 · pair 0 · reel 0).
검사기는 이미 통과(`==> 통과`, 변경 목록 59건). 아래는 기계가 못 보는 것만 적었다. 대상 파일은 수정하지 않았다.

표시: **[안전]** = 학습자가 그대로 따라 하면 환자가 다칠 수 있는 것. **[범위]** = 간호사 업무 범위 밖(기복 압력 값·전환은 집도의, 환기·혈역학·혈액은 마취과, 멸균 물건은 멸균 팀). **[3인칭]** = 대화 상대를 3인칭으로 부름. **[사실]** = 미국 수술실 관행·용어와 다름.
**★** = 꼭 바꿀 것. 문장 `en`·`ko`를 바꾸면 그 문장의 v46 필드(`tag`·`icon`·`why`·`decoy`·`distractorsKo` 둘·`blank`)는 **B가 새로 쓰고**, 그 문장을 `example`로 쓰는 단어의 `example`·`exKo`, order 줄도 맞춘다(항목마다 적음). 문장 `ko`만 고치면 그 문장의 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓴다.

**대화 상대(정본 `or.yaml` persona):** 마취과의사 = 7 Peter Hwang · 10 Rachel Owens · 15 Warren Fox · 19 Roger Kim / 외과의 = 16 Lisa Grant · 20 Julia Stein(여) / 소독간호사 = 0·2·4·9·12·14·17 / 순회간호사 = 1·3·5·6·8·11·13·18.
학습자의 역할은 장면마다 다르다. 소독간호사에게 "렌즈를 닦고 다시 넣을게요"(12.2·12.5)·순회간호사에게 "카트에서 팔 위치를 조정할게요"(8.2)처럼 **멸균 물건을 만지는 문장은 학습자가 멸균 팀(두 번째 소독간호사·보조)일 때만 맞다.** 그래서 문장은 유지하고, 뉘앙스 `who`가 그 행동을 '순회간호사'에게 붙인 곳만 고친다(N4·N5).

**미국 복강경·로봇 수술 관행(판정 기준):** 기복 압력 값과 개복 전환은 **집도의**가 정한다. 환기·혈역학·혈액 처방은 **마취과**가 맡는다. 순환간호사는 기복기·CO2 탱크·장비 고장 대처·포트 계수·전환 기구 개봉·사람 호출을 맡는다(기복기 설정은 집도의가 요청한 값으로). 가스 색전이 의심되면 기복을 멈추고 가스를 빼며(포트 개방은 집도의), 100% 산소를 주고 **좌측위 + 머리 낮춤(Durant)**을 한다. 체위는 팀 지시로 한다. 피하기종이면 기복 압력을 낮추거나 기복을 해제하고, 환기 조정과 기흉 확인은 마취과가 한다.

**문장 판정 기준(묶음 4~6과 같음):** 결정의 대상이 이름 붙은 말(압력 값 15 · 전환 · 분당 환기량 · 혈액 · 패킹)을 간호사가 1인칭이나 `We'll`·`Let's`로 결정하면 고친다. 대안은 **묻기**(Should I…? / Do you want…?), **복창**(Understood—…), **연결**(I'll tell the surgeon…) 셋 중에서 고른다. 막연한 팀 목표(`Let's not let it climb too high`), tagline의 팀 계획을 되받는 말, 준비(prep·keep ready), 상태 보고는 유지한다. 임상 call-out의 `Suspect X`는 주어를 뺀 "(I) suspect X"이고 명령이 아니다. 그래서 진단을 단정하는 말로 보지 않는다(en 유지, 명령형 ko만 고침).

---

## 1. 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 같은 분야·비슷한 철자로 잘 골랐다. 그러나 **정답으로도 맞는 오답이 4개**다(insufflation↔`inflation`, insufflator↔`inflator`, normal↔`nominal`, clamp↔`clip`). 품사가 다른 오답은 1개(blood↔`blond`)다 |
| 2 distractorsKo·다른 뜻 | 4 | 길이 위반 0, 다른 은행 단어의 ko와 겹친 것 0(스크립트로 확인). 약한 것은 site의 `소리`(분야 밖), standby의 `당직 근무` 정도 |
| 3 cue | 3 | 정답 노출 0. 그러나 장면보다 사전 풀이에 가까운 것이 많다(clean·ready·calm·full 등). clamp cue(혈관 겸자)가 18.4의 로봇 클램프와 뜻이 다르다. example 두 개가 어긋난다(w-low는 태그가 없는 동사 lower 문장, w-call은 다른 뜻의 "calls it") |
| 4 chips·decoyChips | 3 | **w-pneumoperitoneum의 decoy `thora` + `peri` = "thoraperi"에 rape가 들어 있다.** `peri`+`pneu`에는 rip이 있다. 약한 것: `ball`(decoy), vent+i+tion의 tit. 다른 경로로 정답을 만드는 조합은 0 |
| 5 뉘앙스 사실 | 3 | swap 8의 why가 멸균 로봇팔을 "순회간호사가 조정한다"고 한다. swap 2·12의 who가 멸균 스코프를 순회간호사에게 맡긴다. slider 7의 why("원인을 단정하는 말은 간호사 몫 아님")가 같은 상황 KP 7.0("as we absorb CO2")과 어긋난다. swap 20 정답은 혈액 준비를 간호사가 정한다 |
| 6 뉘앙스 설계 | 4 | context 5개가 모두 핸드오프 모양이다(어색한 장면 = 환자에게 전문어). swap 정답 칸은 7·7·7. 그러나 **slider 7은 정답이 둘**, slider 16은 강한 말이 약한 끝에 있다. slider 6의 0번 칸이 cue에 대한 바른 답으로도 읽힌다. swap 17 ko에 꼬리가 빠졌고, swap 2 보기의 `it`은 가리키는 말이 없다. slider 정답이 가장 긴 것이 8/21이다 |
| 7 결정 11 | 3 | 변경 59건(삭제 13 · ko 20 · 문장 태그 26)은 타당하다. 놓친 것: **15.3·15.5 가스 색전 문장 [안전]**, 3인칭 4문장(저작자 지적), 업무 범위 문장 4개(6.4·9.4·20.3·20.4), 13.5의 "calls it"에 w-call(호출) 태그, 바뀐 단어 ko와 어긋난 문장 ko(1.3·3.4·5.4·9.0·9.3·14.2·14.4) |

---

## 2. 사실 오류·심각한 문제

1. **[안전] 가스 색전 체위가 문장끼리 반대** — 15.2(KP) `Left lateral, head down, and 100% oxygen.` 바로 뒤 15.3 `Let's get him flat and turn him left-side down.` "flat"은 머리를 낮추지 말라는 뜻이 된다. Durant 체위는 좌측위 + 머리 낮춤이다. → S1.
2. **[안전] 15.5 `We need to lower the pressure immediately.`** — 저혈압 장면이라 "the pressure"가 **혈압**으로 읽힌다("혈압을 즉시 낮춰야 해요"). 가스 색전에서 할 일은 기복을 **멈추고 가스를 빼는 것**이지 압력을 조금 낮추는 것이 아니다. → S2.
3. **[3인칭] 상대에게 상대를 3인칭으로** — 7.5 `I'll tell anesthesia…`·19.4 `Let's tell anesthesia…`(상대가 마취과의사), 16.4 `I'll call the surgeon back…`·20.5 `We need the surgeon back…`(상대가 외과의). order 20 줄 3의 `For when he's back`은 상대 Julia(여, 외과의) 본인을 3인칭 남성으로 부른다. → S3~S6.
4. **[범위] 간호사가 결정하는 말** — 6.4 `Let's keep it under 15`(압력 값; 6.0·slider 6의 "at 15"와도 어긋남), 9.4 `We'll convert if…`(전환), 20.3 `Let's get two more units on the way`(혈액), 20.4 `I'll pack the area and hold pressure`(복강 안 패킹은 집도의·보조). KP 7.1 `Let's increase minute ventilation.`은 같은 상황 swap 7·slider 7이 가르치는 것("환기는 마취과의사에게 묻는다")과 정반대다. → S7~S10, K1.
5. **[사실] swap 8의 why** — `카트 쪽 팔 위치 조정은 순회간호사가 하는 일이에요.` 로봇팔은 멸균 포로 덮여 있어 비멸균인 순회간호사는 만질 수 없다. → N4.
6. **chips ★** — w-pneumoperitoneum decoy `thora` + 정답 조각 `peri` = "thoraperi"(rape). → W5.
7. **정답이 둘인 오답 4개** — `inflation`은 cue "부풀리는 과정"에 그대로 맞는다. `inflator`는 "불어넣는 장비"에, `nominal`은 공학 영어에서 '정상 범위인'이라는 뜻이라 "reads nominal"이 성립한다. `clip`은 cue "혈관을 꽉 물어 막는 기구"에 맞는다. → W1~W4.
8. **slider 7 정답 둘 + 해설이 KP와 모순** — 오답 `The EtCO2 is climbing — is it from the CO2?`는 질문이라 마취과의사에게 해도 되는 말이다. 그런데 why는 이것을 "원인 단정"이라 하고, 그 기준이면 KP 7.0 `…as we absorb CO2`도 틀린 말이 된다. → N1.
9. **13.5 `if the surgeon calls it`** — "call it"은 '결정하다·선언하다'인데 w-call(부르다·호출하다)이 태그되어 있다. 이 문장이 w-call의 example이고, ko `집도의가 알리면`도 오역이다. → S11·W7.

---

## 3. 고칠 것 — 단어 v45 필드

| # | 어디 | 문제 | 어떻게 |
|---|---|---|---|
| W1 ★ | w-insufflation `distractorsEn` [inflation, insulation] | inflation(부풀림)이 cue "복강 안에 가스를 천천히 불어넣어 공간을 부풀리는 과정"에 그대로 맞음 — 정답 둘 | `[inspiration, insulation]` (12:11) |
| W2 ★ | w-insufflator `distractorsEn` [insulator, inflator] | inflator(공기 주입기)가 cue "CO2를 천천히 불어넣어 … 장비"에 맞음 | `[insulator, incubator]` (11:9) |
| W3 ★ | w-normal `distractorsEn` [nominal, formal] | nominal = (계기·수치가) 정상 범위인. "The gauge reads nominal"이 성립함 | `[natural, formal]` (6:7) |
| W4 ★ | w-clamp `distractorsEn` [clasp, clip] · `cue` | clip(혈관 클립)이 cue "혈관이나 관을 꽉 물어 흐름을 막는 집게 모양 기구"에 맞음. 유일한 태그 문장 18.4 `release the clamps by hand`(로봇 고장 언도킹)는 혈관 겸자보다 로봇 쪽 고정부·기구 집게로 읽힘 — 무엇을 가리키는지는 **확인 필요** | distractorsEn `[clasp, cramp]` (5:5) / cue는 뜻을 좁히지 않게 `수술 중 무언가를 꽉 물어 붙잡아 두는 장치` |
| W5 ★ | w-pneumoperitoneum `chips` [[pneu, mo, peri, toneum]] · `decoyChips` [thora] | `thora`+`peri` = "thoraperi"(rape), `peri`+`pneu` = "peripneu"(rip, 장례) | chips `[[pneumo, periton, eum]]`, decoyChips `[thorac]` — 1~4조각 모든 순열을 금칙어와 대조해 0건, decoy로 정답을 만드는 다른 경로 0건 확인(`cardi`·`medi`는 +`eum`에서 die가 나와 탈락) |
| W6 | w-low `example` `We may need to lower the insufflation pressure.` | 7.2에서 w-low 태그를 뺐는데 example은 그대로. 동사 lower라 '낮은'과 품사도 다름 | example `The pressure looks low in this position.` / exKo `이 체위에서 혈압이 낮아 보입니다.` (10.3, 태그 있음) |
| W7 | w-call `example` `We'll undock quickly if the surgeon calls it.` | "calls it" = 결정하다(S11에서 태그를 뺌) | example `I'll call for help right now.` / exKo `지금 바로 도움을 요청할게요.` (15.4) |
| W8 | w-flat 삭제 | S1에서 15.3의 flat이 빠져 어느 문장도 태그하지 않음 | 은행에서 지우고 changes에 `{kind: word-remove, id: w-flat}` (상황 15는 고친 뒤에도 단어 17개, 뉘앙스는 w-flat을 안 씀) |
| W9 | w-blood `distractorsEn` [blond, flood] | blond는 형용사(품사 다름) | `[bloom, flood]` (5:5) |
| W10 (약) | w-defog `distractorsEn` [defrost, deflect] | 미국 차의 defrost 버튼은 김서림 제거에도 쓰여 cue에 걸침 | `[deflate, deflect]` (같은 은행의 다른 뜻 단어라 괜찮음) |
| W11 (약) | w-minute `distractorsEn` [minimal, minuscule] | 둘 다 minute의 다른 뜻(아주 작은)의 동의어 — ko '분당의'로 갈리긴 하나 같은 철자 다른 뜻을 오답으로 둔 꼴 | `[mental, mineral]` (6:6·7) |
| W12 (약) | w-distend `distractorsEn` [distort, extend] | extend(늘어나다)가 cue "밖으로 부풀어 늘어나는 일"에 걸침 | `[distort, descend]` (7:7) |
| W13 (약) | w-crepitus `ko` 염발음(피하기종) | 징후(염발음)와 병명(피하기종)을 섞음 | ko `염발음(피부 밑 공기)` (distractorsKo 그대로 — 11:9·10). changes `fields: [ko]` |
| W14 (약) | w-support `ko` 지원하다 | 호흡 '지원'은 어색함. 묶음 5 massive-transfusion W10은 같은 말을 `보조하다`로 고쳤음 | ko `보조하다` (distractorsKo [반대하다, 철회하다] 그대로). 19.2 ko는 KO5 |
| W15 (약) | w-open `ko` 열다(개방하다) | 은행 문장 8개 중 5개(9.0·9.3·16.2·17.0·18.2)가 '개복' 뜻. cue는 두 뜻을 다 담았지만 ko 카드에는 '개방'만 보임 | ko `열다(개복의)` (distractorsKo 그대로, 7:8·8). changes `fields: [ko]` |
| W16 (약) | 약한 불쾌 조각 | w-embolism decoy `ball`(성적 속어 balls), w-ventilation `vent`+`i`+`tion` = "ventition"(tit), w-deflate 정답 조각 `te`(형태소 아님) | w-embolism decoyChips `[bowl]` · w-ventilation chips `[[vent, il, ation]]` · w-deflate chips `[[de, flate]]` (셋 다 금칙어 0·다른 경로 0 확인) |
| W17 | example·exKo 연쇄 (바뀌는 문장의 옛 en·ko를 yaml 전체에서 스크립트로 찾아 뽑음) | §5·§9에서 문장이 바뀌면 그 문장을 example로 쓰는 단어·slider example·order 줄도 맞춘다 | **en이 바뀜(example·exKo 둘 다):** w-anesthesia(7.5 → 20.3 새 문장) · w-field(16.4 → 17.4 `I'll open the tray while you prep the field.` / `필드를 준비하는 동안 트레이를 열게요.`) · w-fast(19.4) · w-immediately(15.5) · w-bleed·w-stop(9.4) · w-pack·w-area·w-hold(20.4) · w-insert·w-scope(2.5, S12를 하면) / **ko만 바뀜(exKo):** w-surgeon(13.5, S11 — w-call은 W7) · w-gauge·w-read·w-normal + **slider 1 exKo**(1.3, S14) · w-lock·w-wheel(3.4, S14) · w-tuck·w-safely·w-side(5.4, S14) · w-standby(9.0, KO1) · w-sudden·w-hypotension·w-suspect·w-embolism + **slider 15 exKo**(15.1, KO2) · w-major·w-vessel·w-injury(16.1, KO3) · w-pneumoperitoneum(15.0, KO4) · w-support(19.2, KO5) · w-complete + **slider 14 exKo**(14.2, KO6) / **KP를 바꾸면:** w-increase·w-minute·w-ventilation(7.1, K1) · w-role(13.1, K2) · w-pneumoperitoneum(15.0, K3) |

---

## 4. 고칠 것 — 뉘앙스

### 4-1. slider · swap

| # | 문항 | 문제 | 어떻게 |
|---|---|---|---|
| N1 ★ | slider 7 `[EtCO2 looks a bit different…, The EtCO2 is climbing — is it from the CO2?, EtCO2 is climbing; what's your call on ventilation?*]` | 1번 칸은 질문이라 마취과의사에게 해도 되는 말이다 — 정답 둘. why "원인을 단정하는 말도 간호사가 정할 일이 아니에요"는 그 칸과 맞지 않고, KP 7.0 `…as we absorb CO2`와 모순된다 | scale `["The EtCO2 looks a bit different from before.", "EtCO2 is climbing; what's your call on ventilation?", "EtCO2 is climbing from the CO2 — turn up the ventilator."]` answerAt `1` (44·51·56자, 정답 가운데) / why `마취과의사에게는 막연한 느낌이 아니라 수치가 어느 쪽으로 가는지 말하고, 환기를 어떻게 할지는 그쪽에 물어요. 환기기를 올리라고 지시하는 것은 간호사가 할 말이 아니에요.` |
| N2 | slider 16 `[There's brisk bleeding at the trocar.*, There's a lot of blood — maybe more than usual., Everything is bleeding…!]` | 얼버무린 말(1번)이 가장 약한데 가운데에 있고, 정답(위치·속도를 짚은 보고)이 약한 끝에 있음 — 약함→강함이 아님 | scale `["There's a lot of blood — maybe more than usual.", "There's brisk bleeding at the trocar.", "Everything is bleeding and we're losing him!"]` answerAt `1` (why 그대로) |
| N3 | slider 6 0번 칸 `Nothing has changed at all, really.` | cue가 수치를 주지 않으니 압력이 그대로면 이 말도 사실 — 정답과 구체성만 다름 | 0번 칸 `I haven't looked lately, but probably not.` (42자) / why 둘째 문장 `안 보고 짐작으로 답하면 감시가 아니고, 오르지도 않는데 급하게 멈추라고 하면 팀이 혼란스러워요.` |
| N4 ★ [사실] | swap 8 why `카트 쪽 팔 위치 조정은 순회간호사가 하는 일이에요.` · 보기 3 note `…순회간호사가 건드릴 부분이 아니에요.` | 로봇팔은 멸균 포로 덮여 있어 비멸균 순회간호사가 만질 수 없다. 학습자가 '순회간호사 = 로봇팔 조정'으로 외운다 | why `멸균 포를 덮은 팔은 멸균 팀(보조·소독간호사)이 카트 쪽에서 맞춰요. 내가 무엇을 맞출지 구체적으로 말해야 해요.` / 보기 3 note `콘솔 설정은 집도의가 다루는 것이라 간호사가 건드릴 부분이 아니에요.` |
| N5 [범위] | swap 2 who `순회간호사 → 소독간호사 · 렌즈 준비` · swap 12 who `순회간호사 → 소독간호사 · 스코프 재삽입` | 김서림 처치·닦기·재삽입은 멸균 스코프를 손에 드는 일이라 순회간호사가 할 수 없다 | 두 who 모두 `간호사 → 소독간호사 · …`(뒤는 그대로) |
| N6 | swap 2 보기 `Megan, the lens will be fine without it.` | `it`이 가리킬 말이 없음(앞에 김서림이 나오지 않음) | `Megan, the lens will be fine without defogging.` (note 그대로) |
| N7 | swap 17 ko `케빈, 빠르게 움직이되 침착함을 유지합시다` | 바꾼 문장의 꼬리 `while I get the tray open`이 빠짐 | `케빈, 제가 트레이를 여는 동안 빠르게 움직이되 침착함을 유지합시다` |
| N8 (약) [범위] | swap 20 정답 `Julia, I'll get suction and more blood units ready.` | 혈액을 더 준비할지는 마취과가 정함(S9와 같은 기준) | 정답 `Julia, I'll get more suction and ask anesthesia about blood.` / ko `줄리아, 석션을 더 준비하고 혈액은 마취과에 물어볼게요` / note 키를 새 문장으로(`지금 할 수 있는 준비를 하고, 혈액은 처방하는 마취과에 물어요.`) / why `대량 출혈에서는 간호사가 먼저 챙길 수 있는 석션을 준비하고, 혈액은 마취과와 맞춰요.` / words `[w-suction, w-blood, w-anesthesia]` (S9로 상황 20에 anesthesia가 생김 — V15 확인) |
| N9 (약) | swap 3 ko `저스틴, 바퀴를 고정했으니 도킹해도 됩니다` | w-lock의 ko를 '잠그다'로 바꿨음(변경 목록) | `저스틴, 바퀴를 잠갔으니 도킹해도 돼요` |
| N10 (약) | slider 정답 길이 — 17·12 | 17 정답(46자)이 오답(28·28)보다 눈에 띄게 김. 12 정답(36)도 오답(26·27)보다 김 | 17: `["We could use another person in here.", "We'll need another person pretty soon.", "We need extra hands right now."]` answerAt 2 (36·38·30자 — 정답은 17.5와 같은 말, why 그대로). 12: 0번 칸 `Let's try something quick to clear it up.`, 1번 칸 `Let's clean the lens off again.` (41·31·36자) |

### 4-2. context — 핸드오프 모양(v46 7번)

5개(1 insufflation · 4 trocar · 7 EtCO2 · 9 laparotomy · 10 Trendelenburg) 모두 **같은 `word`가 세 장면 `en`에 있다**(W14 0). 어색한 장면은 모두 같은 임상어를 **환자에게** 그대로 쓴 곳이고 fix는 쉬운 말로 풀었다 — 핸드오프 모양이다. `word`·`ko` 짝(기복(가스 주입)·트로카·호기말 이산화탄소·개복술·트렌델렌버그 체위)도 정확하다. **고칠 것 없음.**
- **개수 5개(15·19 뺌)** — 타당하다. TASK·브리프에 context 개수 기준은 없고, 상황마다 STEP 2 최솟값(V14)은 swap 21개가 채운다. 15(가스 색전)·19(피하기종)는 환자가 마취 중인 위기라 '듣는 사람이 다른' 장면을 억지로 만들면 끼워 넣기가 된다.
- 다섯 개가 모두 '환자에게 전문어' 한 틀이지만 주제 안에서 문제가 될 만큼은 아니다(선택: 차트 기록에 구어를 쓰는 틀을 하나 섞을 수 있음).

---

## 5. 결정 11 — 문장(v44 필드) 고칠 것

### 5-1. 문장 en·ko·chunks (keyPhrase 아님)
대안 chunks는 모두 `assembles_to`·`min_chunks_for`(V8)·`dangling_chunks`(V9)로 확인했다. words는 새 en에 있고(`word_appears`), 모의 반영 뒤 상황마다 서로 다른 단어는 최소 11개, 뉘앙스 `words`(V15) 누락 0, 고아 단어는 w-flat 하나뿐이다(W8).

| # | 문장 | 문제 | 고칠 en · ko · chunks · words | 딸린 것 |
|---|---|---|---|---|
| S1 ★ [안전] | 기복 가스 색전 #3 `Let's get him flat and turn him left-side down.` | 바로 앞 KP 15.2 `head down`과 반대. Durant 체위는 좌측위 + 머리 낮춤 | en `Let's tip his head down and turn him left-side down.` / ko `머리를 낮추고 왼쪽이 아래로 가게 돌립시다.` / chunks `["Let's tip", "his head down", "and turn him", "left-side down", "."]` / words `[w-turn]` | B 새로, W8(w-flat 삭제) |
| S2 ★ [안전] | 기복 가스 색전 #5 `We need to lower the pressure immediately.` | 저혈압 장면이라 '혈압을 낮춘다'로 읽힘. 할 일은 기복을 끄는 것 — 순환간호사가 실제로 하는 일(상대가 tagline에서 "stop insufflation now"라 지시) | en `I'm turning off the insufflator immediately.` / ko `지금 즉시 기복기를 끌게요.` / chunks `["I'm turning off", "the insufflator", "immediately", "."]` / words `[w-insufflator, w-immediately]` (turn off는 '끄다'라 w-turn 카드 `켜다(돌리다)`와 뜻이 반대 — 태그하지 않음. w-turn의 오답이 바로 `끄다(멈추다)`) | B, w-immediately example·exKo |
| S3 ★ [3인칭] | CO2 흡수 #5 `I'll tell anesthesia if the pressure needs to come down.` | 상대가 마취과의사 | en `I'll tell you right away if the pressure goes up.` / ko `압력이 오르면 바로 말씀드릴게요.` / chunks `["I'll tell you", "right away", "if the pressure", "goes up", "."]` / words `[w-tell, w-pressure]` | B. w-anesthesia example은 S9로 |
| S4 ★ [3인칭] | 피하기종 #4 `Let's tell anesthesia the pressures are rising fast.` | 상대가 마취과의사 | en `I'll tell the surgeon the pressures are rising fast.` (연결) / ko `압력이 빠르게 오르고 있다고 집도의에게 알릴게요.` / chunks `["I'll tell", "the surgeon", "the pressures", "are rising fast", "."]` / words `[w-tell, w-surgeon, w-pressure, w-fast]` | B, w-fast exKo |
| S5 ★ [3인칭] | 트로카 혈관 손상 #4 `I'll call the surgeon back to the field.` | 상대가 외과의 | en `Should I call a vascular surgeon now?` (묻기 — 큰 혈관 손상의 실제 지원 요청) / ko `지금 혈관외과 의사를 부를까요?` / chunks `["Should I call", "a vascular surgeon", "now", "?"]` / words `[w-call, w-surgeon]` | B, w-field example(W17) |
| S6 ★ [3인칭] | 시야 상실 #5 `We need the surgeon back at the table now.` | 상대가 외과의 | en `Should I call another surgeon to the table now?` / ko `지금 다른 외과의를 테이블로 부를까요?` / chunks `["Should I call", "another surgeon", "to the table", "now", "?"]` / words `[w-call, w-surgeon, w-table]` | B, **order 20** 줄 2 `With the view gone, we need the surgeon back at the table now.` → `With the view gone, should I call another surgeon to the table?`, 줄 3 `For when he's back, …` → `While we wait, let's apply pressure and prepare to convert.` (상대 Julia를 he로 부르던 것도 풀림) |
| S7 [범위] | 기복 압력 #4 `Let's keep it under 15 if we can.` | 압력 값은 집도의가 정함. 6.0·slider 6·swap 6은 "at 15"를 정상으로 보고함 | en `If it goes over 15, let's tell the surgeon.` / ko `15를 넘으면 집도의에게 알립시다.` / chunks `["If it", "goes over 15", ", let's tell", "the surgeon", "."]` / words `[w-tell, w-surgeon]` | B |
| S8 [범위] | 개복 전환 대비 #4 `We'll convert if the bleeding doesn't stop.` | 전환은 집도의 결정(상대는 소독간호사라 집도의를 3인칭으로 써도 됨) | en `The surgeon may convert if the bleeding doesn't stop.` / ko `출혈이 멈추지 않으면 집도의가 전환할 수도 있어요.` / chunks `["The surgeon", "may convert", "if the bleeding", "doesn't stop", "."]` / words `[w-surgeon, w-convert, w-bleed, w-stop]` | B, w-bleed·w-stop exKo, **order 9** 줄 4 `With everything within reach, we'll convert if the bleeding doesn't stop.` → `With everything within reach, we're ready if the surgeon converts.` (ko `다 닿는 곳에 있으니 집도의가 전환해도 준비됐어요`) |
| S9 [범위] | 시야 상실 #3 `Let's get two more units on the way.` | 혈액은 마취과 처방. ko `…오는 중으로 합시다`도 어색(저작자 메모) | en `Should I ask anesthesia for two more units?` (상대가 외과의라 anesthesia 3인칭 가능) / ko `마취과에 혈액 두 팩을 더 요청할까요?` / chunks `["Should I ask", "anesthesia", "for two more units", "?"]` / words `[w-anesthesia, w-unit]` | B, w-anesthesia example `Should I ask anesthesia for two more units?` / exKo 위 ko (w-anesthesia가 은행에 남음) |
| S10 [범위] | 시야 상실 #4 `I'll pack the area and hold pressure.` | 복강 안 패킹·압박은 집도의·보조의 일 | en `Do you want to pack the area and hold pressure?` / ko `부위를 패킹하고 압박을 유지하시겠어요?` / chunks `["Do you want", "to pack", "the area", "and hold pressure", "?"]` / words 그대로 `[w-pack, w-area, w-hold, w-pressure]` | B, w-pack·w-area·w-hold exKo |
| S11 | 로봇 응급 언도킹 준비 #5 `We'll undock quickly if the surgeon calls it.` | "calls it" = 결정하다. w-call(호출하다) 태그가 다른 뜻에 붙었고 ko `알리면`은 오역 | en·chunks 그대로 / ko `집도의가 결정하면 빠르게 언도킹할게요.` / words `[w-undock, w-quickly, w-surgeon]` (w-call 뺌 — 상황 13 단어 15개 남음) | distractorsKo 둘 다시, W7, w-surgeon exKo(이 문장이 example), order 13 줄 4 ko `해제가 준비되면 집도의가 결정할 때 언도킹해요`. changes `fields: [ko, words]` |
| S12 (약) [범위] | 카메라·광원 #5 `I'll insert the scope slowly.` | 스코프를 환자 트로카에 넣는 것은 보통 집도의·카메라 보조. 상대가 소독간호사라 학습자가 넣는다는 말이 됨 | en `Let's insert the scope slowly.` / ko `스코프를 천천히 삽입합시다.` / chunks `["Let's insert", "the scope", "slowly", "."]` / words 그대로 | B, w-insert·w-scope example·exKo, order 2 줄 4 `…so I'll insert the scope slowly.` → `…so let's insert the scope slowly.` |
| S13 | 개복 전환 대비 #3 ko `개방 트레이가 방에 있는지 확인합시다.` | '개방'은 '개복'의 뜻(저작자 메모). '방'은 수술방 | ko `개복 트레이가 수술방에 있는지 확인합시다.` + chunks는 S15 | distractorsKo 둘 다시. order 9 줄 1·2 ko의 `개방 세트`도 `개복 세트`로 |
| S14 (약) | 바뀐 단어 ko와 어긋난 문장 ko | 1.3 `게이지가 정상으로 나타납니다`(w-read → 가리키다), 3.4 `바퀴를 고정합시다`(w-lock → 잠그다), 5.4 `팔은 옆에 안전하게 고정돼 있습니다`(w-tuck → 끼워 넣다), 14.4 `온전하고 완전해 보입니다`(w-complete → 빠짐없는) | 1.3 `탱크 압력 게이지가 정상을 가리킵니다.` · 3.4 `도킹 전에 바퀴를 잠급시다.` · 5.4 `팔은 몸 양옆에 안전하게 끼워 넣어 두었습니다.` · 14.4 `검체가 온전하고 빠진 데 없어 보입니다.` | 문장마다 distractorsKo 둘 다시. exKo: 1.3 → w-gauge·w-read·w-normal·slider 1 / 3.4 → w-lock·w-wheel / 5.4 → w-tuck·w-safely·w-side. order ko: 3 줄 3 `정렬됐으니 도킹 전에 바퀴를 잠급시다`, 5 줄 3 `거기에 패딩하고 팔을 몸 옆에 안전하게 끼워 넣어요`. changes `fields: [ko]` |
| S15 | chunks 구 경계(비KP) | 0.4 `before we plug / everything in`(구동사), 1.5 `that everything's / connected`, 9.3 `is in / the room`, 12.5 `before we go / back in`, 14.3 `before we seal / it`, 18.3 `The console isn't / responding` | 0.4 `["Let's check", "the cables", "before", "we plug everything in", "."]` · 1.5 `["I'll double-check", "that", "everything's connected", "."]` · 9.3 `["Let's", "confirm", "the open tray", "is in the room", "."]` · 12.5 `["I'll wipe", "the lens", "before", "we go back in", "."]` · 14.3 `["Let's double-check", "the bag", "before", "we seal it", "."]` · 18.3 `["The console", "isn't responding", "to any input", "."]` | changes `fields: [chunks]` (V8·V9 확인) |

### 5-2. keyPhrase 문장의 ko만 (en·chunks 그대로, changes에 `fields: [ko]`)

| # | 문장(KP) | 문제 | 새 ko | 딸린 것 |
|---|---|---|---|---|
| KO1 | 개복 전환 대비 #0 `Let's have the open set on standby.` | `개방 세트`(저작자 메모) | `개복 세트를 대기시켜 둡시다.` | distractorsKo 둘 다시, w-standby exKo, order 9 줄 1 ko `개복 세트를 대기시켜 둡시다` |
| KO2 | 기복 가스 색전 #1 `Sudden drop in EtCO2 with hypotension—suspect gas embolism.` | ko `…의심하세요`는 마취과의사에게 하는 명령. en은 주어를 뺀 call-out("(I) suspect") | `저혈압과 함께 EtCO2가 갑자기 떨어졌어요 — 가스 색전증이 의심돼요.` | distractorsKo 둘 다시, w-sudden·w-hypotension·w-suspect·w-embolism exKo, slider 15 exKo |
| KO3 | 트로카 혈관 손상 #1 `Suspect a major vessel injury.` | 같음(외과의에게 명령) | `주요 혈관 손상이 의심돼요.` | distractorsKo 둘 다시, w-major·w-vessel·w-injury exKo |
| KO4 (약) | 기복 가스 색전 #0 `Stop insufflation and release the pneumoperitoneum.` | '가스를 해제'는 어색함(en을 K3대로 바꾸면 불필요) | `기복을 멈추고 복강 내 가스를 빼세요.` | distractorsKo 둘 다시, w-pneumoperitoneum exKo |
| KO5 (약) | 피하기종 #2 `Let's release the pneumoperitoneum and support ventilation.` | 같음 + W14 | `복강 내 가스를 빼고 환기를 보조합시다.` | distractorsKo 둘 다시, w-support exKo, order 19 줄 3 ko `압력이 오르니 가스를 빼고 환기를 보조해요` |
| KO6 (약) | 검체 회수 #2 `I'll confirm the specimen is complete.` | w-complete ko를 '빠짐없는'으로 바꿨는데 문장은 `완전한지` | `검체가 빠짐없이 다 나왔는지 확인할게요.` | distractorsKo 둘 다시, w-complete exKo, slider 14 exKo, order 14 줄 3 ko `꺼내면 검체가 빠짐없이 다 나왔는지 확인할게요` |
| KO7 (약) | 기복 압력 감시 #0 `The insufflation pressure is at 15.` | `15에 있습니다` 직역 | `기복 압력은 15예요.` | distractorsKo 둘 다시, order 6 줄 1 ko `기복 압력은 15예요` |

### 5-3. 변경 목록(`changes-or-minimally-invasive.yaml`, 59건) 판정
- **word-remove 13건** 타당하다. 공통 목록 4개(patient·know·head·room)와 목록 밖 9개(want·need·high·help·face·neck·skin·down·move)로, 191개의 1할 안쪽이다. 남은 상황은 모두 V3를 넉넉히 넘는다.
- **ko 20건** 타당하다. confirm/check·prepare/prep·fast/quickly·keep/stay/hold·read/show·call/tell·insufflation/pneumoperitoneum·connection/tubing 겹침을 모두 풀었다. 놓친 것: 바뀐 단어 ko를 문장 ko에 반영하지 않은 곳(S14·KO6), w-crepitus·w-support·w-open(W13~W15).
- **문장 words 26건** 타당하다(쉬운 단어 태그 빼기). 놓친 것: 13.5 w-call(S11), w-low example(W6).
- (보고만) 간호사가 이미 아는 말이 아직 은행에 있다: use·start·stop·bring·keep·clean·ready·full·side·number·team·blood·arm·table. 1할 상한에 가깝고 V3 여유도 있지만, 이번에는 빼지 않는 것이 맞다.

---

## 6. 저작자 메모 판정

| 메모 | 판정 |
|---|---|
| 3인칭 7.5·19.4·16.4·20.5 | **동의** → S3~S6. 저작자가 뉘앙스 정답에서 이 문장들을 쓰지 않은 것도 맞다. order 20 줄 2·3도 함께 고친다(S6) |
| 6.1 KP `Let's not let it climb too high.` | **유지** — 값이 없는 팀 목표 |
| 6.4 `Let's keep it under 15 if we can.` | 동의 → S7 |
| 7.1 KP `Let's increase minute ventilation.` | 이름 붙은 환기 설정 결정이고 같은 상황 swap·slider와 모순 → **K1 바꾸기** |
| 7.2 KP `We may need to lower the insufflation pressure.` | **유지** — `may need`는 제안이고, 마취과의사에게 압력 문제를 꺼내는 자연스러운 말 |
| 15.5 | 동의, 그리고 **[안전]**으로 올린다 → S2 |
| 9.4 | 동의 → S8 |
| 15.0 KP | 마취과의사(상대)의 지시를 간호사가 명령형으로 되말함 → **K3 약하게 바꾸기(복창)** |
| 15.1·16.1 KP `…suspect …` | **en 유지** — 임상 call-out은 주어를 뺀 "(I) suspect"이고 진단을 단정하는 말이 아니다(slider 19 why가 금하는 것은 단정). ko의 명령형만 고친다(KO2·KO3) |
| 18.1 KP `Let's emergency undock all arms now.` | **유지** — tagline("we need to undock")을 되받는 팀 계획. 언도킹은 팀 절차 |
| 19.2 KP · 19.5 | **유지** — `Let's`·`We'll`로 팀 계획을 말함. ko만 KO5 |
| 20.1 KP `Let's apply pressure and prepare to convert.` | **유지** — 준비는 간호사 몫, 압박은 팀 제안 |
| 15.2 · 15.3 어긋남 | **동의, [안전]** → S1 |
| 9.0·9.3 ko `개방` | 동의 → KO1·S13 |
| 20.3 ko | 동의 — en도 범위 문제라 함께 고침 → S9 |
| 13.1 KP `Everyone knows their role…`(B 메모) | 확인 안 된 사실 진술(잘못된 안심), 상황 목표 '팀 역할을 점검한다'와 어긋남 → **K2 바꾸기** |
| w-open 여러 뜻 | cue로 두 뜻을 가르친 것은 타당. 그러나 ko 카드에 '개복'이 보이게 → W15(약) |
| w-unit 여러 뜻 | **유지** — ko `유닛(단위)`와 cue(장비 한 대·혈액 한 팩)로 충분, 오답(세트·부품)이 어느 뜻과도 겹치지 않음 |
| w-pressure 여러 뜻 | **유지** — ko `압력`이 가스압·압박점·혈압·압박을 덮고, 오답 온도·습도가 어느 뜻과도 겹치지 않음 |
| w-minute·w-hand 남김 | 타당 — `minute ventilation`·`set of hands`로 가르칠 값이 있음. w-minute 오답만 W11 |
| context 5개 | 타당 → §4-2 |

---

## 7. 표 — distractorsEn 품사가 다른 것, 정답으로도 맞는 오답, 정답의 다른 뜻을 쓴 오답

★ = 꼭 바꿀 것(정답 둘·금칙). 나머지는 권장.

| 단어(품사) | 지금 오답 | 문제 | 대안 |
|---|---|---|---|
| ★ insufflation(명) | inflation | 부풀리는 과정 — cue에 그대로 맞음(W1) | inspiration |
| ★ insufflator(명) | inflator | 공기를 불어넣는 장비 — cue에 맞음(W2) | incubator |
| ★ normal(형) | nominal | (계기 값이) 정상 범위인 — "reads nominal" 성립(W3) | natural |
| ★ clamp(명) | clip | 혈관 클립 — cue "혈관을 꽉 물어 막는 기구"에 맞음(W4) | cramp |
| blood(명) | blond(형) | 품사 다름(W9) | bloom |
| (약) minute(형, 분당의) | minimal·minuscule | minute의 다른 뜻(아주 작은)의 동의어(W11) | mental·mineral |
| (약) defog(동) | defrost | 차의 defrost는 김서림 제거에도 씀(W10) | deflate |
| (약) distend(동) | extend | '늘어나다'가 cue에 걸침(W12) | descend |
| tense(형) | tender | 배에 쓰는 형용사지만 뜻(압통)이 분명히 다름 | 그대로 |
| input(명) | intake | 기계 신호에는 쓰지 않음 | 그대로 |
| clearance(명) | clearing | 숲속 빈터·치움 — 틈의 뜻 아님 | 그대로 |
| flow(명) | float | 명사(부표)로도 쓰임 | 그대로 |
| dock(동) | deck | 동사(때려눕히다)로도 쓰임 | 그대로 |
| standby(명) | dKo 당직 근무 | 사람의 대기(on call)와 가깝지만 ko '대기 상태'와 구별됨 | 그대로 |

---

## 8. 기계적 전수 확인 결과

- **pair 0개 · reel 0개** — 해당 없음.
- **swap 21개** — `before[0] + 보기 + before[2]`를 보기 63개 모두 이어 읽음. 문법은 모두 맞고, `before[1]`은 21개 모두 오답 보기 안에 있다. 정답은 모두 하나다. 걸린 것은 swap 2 보기의 가리킬 말 없는 `it`(N6). swap `ko` 21개 중 17은 꼬리가 빠졌고(N7) 3은 '고정'(N9)이며 나머지는 바꾼 문장의 뜻과 맞는다. who가 멸균 일을 순회간호사에게 붙인 것 2개(N5). 정답 칸은 0:7 · 1:7 · 2:7.
- **context 5개** — word 5/5가 세 장면 `en` 모두에 있다. 어색한 장면은 모두 듣는 사람(환자) 때문이다. 어색한 장면 위치는 0:2 · 1:2 · 2:1이다.
- **slider 21개 약함→강함** — 성립 18. 강한 말이 약한 끝에 있는 것 1(16, N2). 정답 둘 1(7, N1). 약하게 둘 1(6, N3). 2·4·12는 '막연 → 구체'라는 축이라 강도보다 구체성이지만 말은 된다. 정답 칸은 0:6 · 1:7 · 2:8이다.
- **slider 정답 길이** — 혼자 가장 김 8(1·2·7·9·11·12·17·20, 그중 2번 칸 정답이 6) · 동률 가장 김 1(18) · 혼자 가장 짧음 5(5·6·8·13·16) · 동률 가장 짧음 1(15) · 가운데 6. 2번 칸 정답이 길이로 짐작된다. N1·N2·N10을 반영하면 가장 김 5 + 동률 1 · 가장 짧음 6 + 동률 1 · 가운데 8, 정답 칸은 0:5 · 1:9 · 2:7이 된다(스크립트로 셈).
- **chunks(126문장)** — 비KP 끊김 6개는 S15. 바뀌는 문장 안의 끊김(7.5 `needs to come / down`, 15.3 `left-side / down`)은 새 문장으로 풀린다. KP는 §9 끝.
- **decoyChips × chips** — 정답 조각과 decoy의 1~3조각 모든 순열을 금칙어(비속어·성적·술·마약·장례·폭력·무기·민족 비하)와 대조했다. 걸린 것은 `thora+peri`(rape) ★, `peri+pneu`(rip)(W5), `ball`, `vent+i+tion`(tit)(W16)이다. 정답 낱말 안에 원래 들어 있는 것(instrument의 rum, hypotension의 pot, periodically의 dic)과 `al+er`(ale)·`crack`(형태소)은 그대로 둔다. decoy로 정답 철자를 만드는 다른 경로는 0이다. 대안 조각·오답(W1~W5·W9~W12·W16)은 검사기 `check_word_v45`(V21 `OFFENSIVE_CHIPS`)에도 통과시켜 0건을 확인했다.
- **distractorsEn 품사** — §7 표(blond 하나).
- **길이** — distractorsEn 382개·distractorsKo 382개 모두 1.25배·3자 이내(위반 0). 대안 오답도 모두 확인.
- **example** — 191개 중 태그 없는 문장을 example로 쓴 것 1(w-low, W6), 다른 뜻 문장 1(w-call, W7).
- **연쇄 전수(W17)** — 바뀌는 문장 27개의 옛 en·ko를 yaml 전체(단어 example·exKo, slider example·exKo, order 줄, swap 보기)에서 스크립트로 찾아 W17과 각 행의 '딸린 것'에 모두 적었다.
- **모의 반영(S1~S11·S13·S15 + W8)** — 상황마다 서로 다른 단어는 최소 11개(V3). 뉘앙스 `words` 누락 0(V15, N8 반영 시 상황 20에 w-anesthesia 있음). 고아 단어는 w-flat 하나(W8로 삭제). 대안 chunks 모두 V5·V8·V9 통과.

---

## 9. 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)

KP en을 바꾸기로 하면 `in-or-minimally-invasive.json`의 `keyPhrases` 같은 문자열도 함께 바꿔야 V4가 통과합니다. 바꾸면 그 문장의 chunks·ko·v46 필드, 그 문장을 example로 쓰는 단어의 example·exKo, 뉘앙스 example, order 줄이 함께 바뀝니다(항목마다 적음). 대안은 **대화 상대를 3인칭으로 부르지 않게** 썼습니다(상대가 마취과의사인 7·10·15·19에서는 the surgeon, 외과의인 16·20에서는 anesthesia를 써도 됩니다). 대안 chunks는 모두 V5·V8·V9 함수로 확인했습니다.

| # | 현재 en | 문제 | 대안 en (chunks) | 권고 |
|---|---|---|---|---|
| K1 | 7.1 `Let's increase minute ventilation.` | 마취과의사(상대)에게 환기 설정을 간호사가 정함. 같은 상황 swap 7(`I'd like your call on the ventilation`)·slider 7이 가르치는 것과 정반대 | `Should we increase minute ventilation?` (`Should we / increase / minute ventilation / ?`) | **바꾸기.** 연쇄: w-increase·w-minute·w-ventilation exKo `분당 환기량을 늘릴까요?`, order 7 줄 2 `To bring it down, should we increase minute ventilation?` |
| K2 | 13.1 `Everyone knows their role if we need to convert.` | 확인하지 않은 사실 진술(잘못된 안심). 상황 목표가 '팀 역할을 점검한다' | `Does everyone know their role if we need to convert?` (`Does everyone know / their role / if we need / to convert / ?`) | **바꾸기.** 연쇄: w-role exKo `전환해야 할 경우 모두 자기 역할을 알고 있나요?`(w-convert의 example은 9.1이라 영향 없음) |
| K3 | 15.0 `Stop insufflation and release the pneumoperitoneum.` | 상대(마취과의사)의 지시(tagline "stop insufflation now")를 간호사가 명령형으로 되말함. 기복기를 끄는 것은 순환간호사 일이라 복창이 실제 역할과 맞음 | `Understood—stopping insufflation, and let's release the pneumoperitoneum.` (`Understood—stopping insufflation / , and let's release / the pneumoperitoneum / .`) — 기복기를 끄는 것은 간호사가 복창하고, 가스 빼기(포트 개방은 집도의)는 팀에 제안하는 꼴. words 넷 모두 `word_appears` 확인 | **약하게 바꾸기**(묶음 6 difficult-airway의 FONA 복창과 같은 틀). 연쇄: w-pneumoperitoneum exKo, order 15 줄 3 `As I call, stop insufflation so no more gas goes in, and release the pneumoperitoneum.` → `As I call, I'm stopping insufflation so no more gas goes in, and let's release the pneumoperitoneum.` 바꾸지 않으면 ko만 KO4 |
| K4 | 20.2 `Suction and get more units in the room.` | 외과의(상대)에게 하는 명령이고 혈액을 정함(S9와 같은 기준) | `Do you want more suction and more units in the room?` (`Do you want / more suction / and more units / in the room / ?`) | **약하게 바꾸기.** 연쇄: order 20 줄 4 `With pressure on, do you want more suction and more units in the room?` |
| K5 | 16.1 `Suspect a major vessel injury.` | 외과의에게 하는 명령으로 읽힐 수 있음 | (필요하면) `Do you suspect a major vessel injury?` (`Do you / suspect / a major vessel injury / ?`) | **유지** — 주어를 뺀 call-out. ko만 KO3 |
| K6 | 15.1 `Sudden drop in EtCO2 with hypotension—suspect gas embolism.` | 같음. tagline(상대의 말)과 같은 문장이라 복창으로 읽힘 | — | **유지**, ko만 KO2 |
| K7 | 15.2 `Left lateral, head down, and 100% oxygen.` | 체위·산소는 팀 지시 | — | **유지** — 지시를 짧게 되받는 복창, 내용(Durant)은 맞음. S1이 15.3을 이것과 맞춤 |
| K8 | 10.1 `Watch the pressure and facial swelling.` | 마취과의사(상대)에게 명령형 | `Let's watch the pressure and facial swelling.` | **유지(약)** — 감시는 결정이 아님 |
| K9 | 17.1 `Open the laparotomy tray immediately.` | 소독간호사에게 지시하는데 17.4는 `I'll open the tray` — 누가 여는지 엇갈림 | — | **유지(약)** — 긴급 전환에서는 순환(바깥 포장)과 소독(안쪽 펼치기)이 같이 연다 |
| K10 | 6.1 · 7.2 · 9.1 · 10.2 · 16.2 · 17.0 · 18.1 · 19.2 · 20.1 | 저작자가 범위 후보로 짚은 것 포함 | — | **유지** — 값 없는 팀 목표, `may need` 제안, 준비, tagline의 팀 계획. 10.2는 swap 10이 '집도의 동의'를 가르침 |
| K11 | 2.2 · 8.2 · 12.2 `I'll defog/adjust/clean … reinsert` | 멸균 물건을 다룸 | — | **유지** — 학습자가 멸균 팀일 때 맞음. 뉘앙스 who만 N4·N5 |
| K12 | 7.0 `The EtCO2 is rising as we absorb CO2.` | 흡수하는 것은 환자(we는 팀을 가리키는 구어) | `…as he absorbs CO2.` | **유지(약)** |

**KP chunks 구 경계(보고만 — 대안은 V8 조각 수를 지킴, 함수로 확인)**
- 1.1 `the insufflation pressure / limit`(복합명사를 끊음) → `Let's / set / the insufflation pressure limit / .`
- 13.0 `the emergency / undocking steps` → `Let's / review / the emergency undocking steps / .`
- 17.2 `another set / of hands` → `Let's / get / another set of hands / in the room / .`
- 19.0 `up to / the neck` → `There's / crepitus / up to the neck / .`
- 12.0 `is fogging / up`(구동사) → `The scope / is / fogging up / .`
- 16.2 `and call / for help`(구동사) → `Let's prep / for open conversion / and / call for help / .`
- 5.1 `Are all / pressure points` → `Are / all pressure points / protected / ?`
- 20.2 `Suction and get / more units`(K4를 하지 않을 때) → `Suction / and get more units / in the room / .`
- (약) 20.0 `is full / of blood` → `We've / lost / the view—the field / is full of blood / .`(조동사를 끊는 대가가 있어 선택)
- (피할 수 없음) 15.1 `with hypotension—suspect` — 엠대시 앞뒤에 공백이 없어 조각이 대시로 시작할 수 없음. 16.1 `a major vessel / injury` — 다섯 낱말이라 조각이 3개 필요한데 구를 지키면 2개(K5 대안이면 풀림).

---

## 10. 종합

장비 세팅·기복·카메라·로봇 도킹·검체 회수의 바탕 사실은 탄탄하다. context 5개는 모두 핸드오프 모양이고, swap 정답 칸도 고르다. 다만 다음을 고쳐야 한다.
- 가스 색전 장면의 **체위 모순(15.3 flat)**과 **혈압으로 읽히는 "lower the pressure immediately"(15.5)**
- 상대를 3인칭으로 부르는 4문장
- 압력 값·전환·혈액·패킹을 간호사가 정하는 4문장과, 같은 상황의 뉘앙스와 모순되는 KP 7.1
- 멸균 로봇팔·스코프를 순회간호사에게 맡기는 swap 해설·who
- 정답이 둘인 단어 오답 4개
- `thora+peri` 조각
- slider 7의 정답 둘

★와 [안전]·[범위]·[3인칭]·[사실] 항목을 고친 뒤 다시 검사를 통과하면 내보내도 된다.

**개수:** 고칠 것 **49건**:
- 단어 17(W1~W17, W17은 S·KO의 연쇄)
- 뉘앙스 10(N1~N10)
- context 0
- 문장 15(S1~S15)
- KP ko 7(KO1~KO7) — 문장과 KP ko를 합치면 22

그중 ★ **13건**(W1~W5, N1·N4, S1~S6).

**안전·범위·3인칭·사실 15건:**
- [안전] 2: S1·S2
- [3인칭] 4: S3~S6
- [범위] 7: S7·S8·S9·S10·S12·N5·N8 (그 밖에 KP K1은 사용자 결정)
- [사실] 2: N4·W4 (그 밖에 W13은 약함)

**KP 사용자 결정 12건:** 바꾸기 2(K1·K2) · 약하게 바꾸기 2(K3·K4) · 유지 8(K5~K12). 여기에 KP chunks 보고 11곳이 있다.
