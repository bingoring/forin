# fix-icu-brain-death-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번)

대상: `icu-brain-death.yaml`(A·B 합친 파일, 단어 196 · 상황 21 · 문장 127). 비교: base·changes(74건 — 단어 삭제 15·추가 4)·in·notes A/B.
뉘앙스: slider 21 · context 15 · swap 21 · pair 0 · reel 0.
스크립트(작업 폴더): `_rvA_icu-brain-death.py`(words/sent/nu 덤프, swap 이어 읽기), `_rvA_icu-brain-death_chk.py`(cue 영어·decoyChips 재조립·context 모양). 덤프: `_rvA_icu-brain-death_words.txt`·`_sent.txt`·`_nu.txt`.
기계 확인 결과:
- 오답 길이 규칙(1.25배·3자) 위반 0(distractorsEn·distractorsKo 모두).
- cue에 영어 0.
- decoyChips 재조립 1건 — `w-donation`: `do`+`nation`(decoy)으로 정답이 다른 조각 경로로 만들어짐.
- **pair 0개 — 전 조합 확인 해당 없음.**
- context 15개 모두 `word`·`ko`·장면 3·`ok:false` 1(모두 가족 장면). `word`가 세 장면 `en`에 다 있음(16번 `escalating`은 어형 변화라 문제 아님).
- swap 21개 이어 읽기: 문법 틀린 것 1(상황 17 `is nuts in the last hour`). swap `ko` 21개 모두 바꾼 문장의 뜻과 맞음.
- chunks: keyPhrase 아닌 문장에서 구 경계를 끊은 것 3(6.5·7.3·16.3), keyPhrase 5(보고만, E절).

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 소리·철자가 닮은 오답은 좋음. 품사가 다른 오답 11개(★), 이 주제에 거슬리는 오답(`kidnap`·`cursed`·`intimately`·`joint`·`eerily`), 정답으로도 읽히는 오답(`sedative`·`elevate`) |
| 2 distractorsKo·길이 | 4 | 길이 위반 0. `point` 오답 '단위'가 정답에 가깝고, `escalate` 오답 '업무를 넘기다'가 정답과 겹침 |
| 3 cue | 4 | 정답 노출은 없음. ko를 되풀이한 cue 7개, `mean` cue는 사실과 다름(평균 동맥압은 단순 평균이 아님) |
| 4 chips/decoyChips | 3 | 재조립 1. 사망·장례 주제에서 거슬리는 조각이 많음(`die`·`dig`·`worm`·`dust`·`toll`·`hole`·`flesh`·`wood`, 마약 은어 `pot` 5번, `stud`·`tart`·`moan`·`come`·`cuss`·`rye`) |
| 5 뉘앙스 사실 | 4 | why는 대체로 미국 관행에 맞음(뇌사=법적 사망, died를 분명히, 기증 이야기는 OPO, 판정은 의사, "처방대로"). 다만 context 4 fix가 가족에게 기증을 넌지시 꺼내고, 14 fix가 DCD에서 심장이 반드시 멈춘다고 단정하며, 1 fix는 검사 중에 결과를 해석해 줌. slider 8 cue의 소변량이 비현실적 |
| 6 뉘앙스 설계 | 4 | slider 11·14·17은 정답 칸이 둘로 읽히고 19는 가운데 칸이 다른 축(`evenly`). context 17은 `immediately`가 가족에게 어색한 말이 아님. swap 17 문법 1 |
| 7 결정 11 | 4 | 변경 74건은 과하지 않고 타당(쉬운 말 삭제, 같은 ko 쌍 정리, 쓰임이 다른 태그 빼기). 남은 것: `map` 헤드워드(문장은 `map out`), `rescue` ko, `escalate` ko, 9.3 ko 화씨, 0.2 ko '합법적인' |

## 사실 오류·심각한 문제

1. **[안전] 6.3** `If his numbers start to fall, I'll call it right away.` — `call it`은 관용적으로 "(검사를) 끝내다/선언하다"로 읽힙니다(in.json 장면 첫마디 `call it if he desaturates`도 그 뜻, order 6의 다음 줄 `When I do, we abort`도 그렇게 이어짐). 반면 ko·tag·why·distractorsKo는 "알리겠다"로 읽습니다. 무호흡 검사 중 "중단"과 "보고"가 한 말에서 갈리면 위험한 의사소통이고, 수치가 "떨어지기 시작할 때" 바로 중단하는 것도 실제 기준(프로토콜의 SpO2·혈압 중단 기준)과 맞지 않습니다.
2. **context 4(`protocol`) fix** `…someone will talk with you about it separately.` — 간호사가 가족에게 OPO 통보와 기증 상담이 있을 것을 넌지시 알립니다. 미국 관행(CMS·OPO)은 기증 이야기를 OPO 담당자·지정 요청자가 처음 꺼내고, 간호사는 OPO에 알리기만 합니다(이 주제 4.5 문장과 slider 4 why가 바로 그렇게 가르침). 어색한 장면(가족에게 OPO 통보 사실을 말하기)은 쉬운 말로 바꿔도 하면 안 되는 말이라, 이 문항은 뜻이 같고 듣는 사람만 다른 context 모양이 될 수 없습니다.
3. **context 14(`death`) fix** `His heart will stop, and the doctor will tell you the moment he has died.` — DCD에서는 생명유지장치를 거둔 뒤 정해진 시간 안에 심장이 멈추지 않을 수 있습니다. "반드시 멈춘다"는 거짓 확신이고, 사망 선언은 순환이 멈춘 뒤 관찰 시간(보통 몇 분)을 거쳐 하므로 "the moment"도 틀립니다.
4. **context 1(`response`) fix** `…and that tells the doctors his brain isn't working.` — 검사 준비 장면(상황 1)에서 간호사가 판정 전에 가족에게 결과를 해석해 줍니다. 판정과 설명은 의사가 합니다.
5. **slider 8 cue** `He has filled the urine bag twice in one hour` — 소변 백은 보통 2,000 mL라 시간당 약 4 L입니다. 요붕증 기준(시간당 약 250~300 mL 이상)과 너무 동떨어져 학습자가 감을 잘못 잡습니다.
6. 4.4 `The coordinator will call back within the hour.` · 13.3 `I can have the next set of labs drawn within the hour.` — 간호사가 지킬 수 없는 약속(코디네이터 회신 시각, 처방 전 채혈 시각).
7. 18.3 `You have every right to say no, …` — 무엇을 거절하는지 빠져 있어 상황 18 밖에서 읽으면 뇌사 판정·호흡기 유지 거절로도 읽힙니다(판정은 가족 동의가 필요 없음).
8. 20.5 `We're running out of time before the offer falls through.` — 장소가 BED 5(가족이 곁에 있을 수 있음)라 기증을 서두르는 압박으로 들립니다. 팀 사이라도 간호사 문장으로 가르칠 말은 아닙니다.
9. keyPhrase 16.0 `Max the pressors…`, 15.1 `Start pressors and give a fluid bolus.`, 17.0 `Give desmopressin now…` 등은 간호사가 처방 없이 투여를 정하는 말로 읽힙니다. 특히 16.0은 같은 상황 slider 16의 why("처방 범위 안에서만 올리고")와 모순됩니다. **사용자 결정 필요**(E절).

## 고칠 것

[안전]을 붙인 것이 안전 항목입니다. 문장을 새로 쓰면 **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 2·blank)를 전부 새로 쓰고**, 바뀐 `words`는 `changes-icu-brain-death.yaml`에 적으세요. 그 문장이 어떤 은행 단어나 slider의 `example`·`exKo`이면(딸린 것) 그것도 새 문장으로 바꿉니다. 문장 `ko`만 고쳐도 `distractorsKo` 둘을 새 ko 틀에 맞춰 다시 씁니다. 같은 내용이 그 상황 `order` 줄에 있으면 B 검토와 맞춰 그 줄도 고칩니다.

### A. 문장 (keyPhrase 아님)

1. **[안전] 무호흡 검사 중 안전 감시 6.3** — `call it`의 뜻이 "중단"과 "보고"로 갈림(위 1).
   - en: `If his numbers start to fall, I'll call them out right away.`
   - ko: `수치가 떨어지기 시작하면 바로 소리 내어 알리겠습니다.`
   - chunks: `If his numbers / start to fall, / I'll call them out / right away / .`
   - words: `[w-start]` — `call out`(소리 내어 알리다)은 헤드워드 `w-call`(연락하다·전화)과 쓰임이 달라 태그를 뺌(상황 6 단어 수 충분). `changes-icu-brain-death.yaml`에 적을 것. v46 필드 전부 새로(지금 distractorsKo "직접/문자로 알리겠습니다"는 새 뜻에서 정답 둘이 되기 쉬움 — 알리는 대상·방식이 아닌 다른 세부로).
   - 딸린 것: order 6 2번 줄을 같은 문장으로, 3번 줄 `When I do, we abort…`는 "중단 기준에 닿으면 중단"으로(B와 맞출 것 — 떨어지기 시작했다고 바로 중단하지 않음).
2. **장기기증 기관 연계 인지 4.4** — 지킬 수 없는 약속.
   - en: `I'll let you know as soon as the coordinator calls back.`
   - ko: `코디네이터가 다시 연락하면 바로 알려 드릴게요.`
   - chunks: `I'll let you know / as soon as / the coordinator / calls back / .`
   - words: `[w-coordinator, w-call]`. v46 필드 전부 새로.
   - 딸린 것: `w-call` example·exKo. order 4 3번 줄(`…call back within the hour`)도 시각 약속을 빼고.
3. **기증 코디네이터 협업 13.3** — 처방 전 채혈 시각 약속.
   - en: `I'll have the next set of labs drawn as soon as they're ordered.`
   - ko: `다음 검사는 처방이 나는 대로 바로 채취해 둘게요.`
   - chunks: `I'll have / the next set of labs / drawn / as soon as they're ordered / .`
   - words: `[w-next, w-draw]`. v46 필드 전부 새로.
   - 딸린 것: `w-next` example·exKo. order 13 2번 줄(`…within the hour`)도.
4. **가족 갈등·기증 거부 상황 18.3** — 거절 대상이 빠져 판정 거절로도 읽힘.
   - en: `You have every right to say no to donation, and that's completely okay.`
   - ko: `기증을 거절하실 권리가 충분히 있고, 그것도 전혀 괜찮습니다.`
   - chunks: `You have every right / to say no / to donation, / and that's / completely okay / .`
   - words: `[w-completely, w-donation]`. v46 필드 전부 새로.
   - 딸린 것: `w-completely` example·exKo, slider 18 `example`·`exKo`. order 18 3번 줄(`say no to it`)은 이미 맞음 — 새 문장과 표현만 맞추면 됨.
5. **기증 장기 기능 유지 위기 20.5** — 가족 곁에서 기증 압박으로 들림.
   - en: `The coordinator needs updated numbers for the offers.`
   - ko: `코디네이터가 장기 제안에 쓸 최신 수치를 필요로 해요.`
   - chunks: `The coordinator needs / updated numbers / for the offers / .`
   - words: `[w-coordinator, w-need, w-offer]`. v46 필드 전부 새로.
   - 딸린 것: `w-offer` example·exKo(cue "기증 장기를 받겠느냐고 병원에 정식으로 건네는 연락"은 그대로 맞음).
6. **체온·전해질 유지 9.3** ko — `구십육`이 섭씨로 읽힘. ko → `한 시간 전 체온이 화씨 96도 아래로 떨어졌습니다.` distractorsKo 둘을 새 틀로.
7. **뇌사 후 순환 붕괴 위기 16.4** ko — `에스컬레이션하지` 외래어. ko → `지금 상급 대응을 요청하지 않으면 시간을 놓치게 됩니다.` distractorsKo 둘을 새 틀로(tag `에스컬레이션`도 B와 맞춰 `상급 보고`로).
8. **chunks 6.5** `right at / the bedside` — 전치사와 목적어를 끊음. → `We're staying / right / at the bedside / for the whole test / .`(9낱말 4조각 규칙 때문에 `right`가 한 낱말 조각)
9. **chunks 7.3** `a few minutes / ago` — 시간 부사구를 끊음. → `His mean pressure / dropped / below sixty / a few minutes ago / .`
10. **chunks 16.3** `despite the current / dose` — 명사구를 끊음. → `His pressure / is bottoming out / despite / the current dose / .`(조각 수 규칙 때문에 `despite`가 한 낱말 조각)

### B. 단어

**distractorsEn — 품사가 다른 것 전부(★ = 꼭 바꿀 것)**

| id | 정답(품사) | 오답(품사) | 판정 | 대안 |
|---|---|---|---|---|
| w-rescue | rescue(명사 수식어) | rescind(동사) | ★ | `refuge` |
| w-target | target(명사) | tarnish(동사) | ★ | `tartan` |
| w-range | range(명사) | rinse(동사) | ★ | `rank` |
| w-climb | climb(동사) | limb(명사, decoyChips와 중복) | ★ | `cling` |
| w-bring | bring(동사) | brink(명사) | ★ | `wring` |
| w-talk | talk(동사) | tall(형용사) | ★ | `walk` |
| w-map | map(동사) | mat(명사) | ★ | `nap` |
| w-lose | lose(동사) | loose(형용사, decoyChips와 중복) | ★ | `lease` |
| w-honor | honor(동사) | hunger(명사) | ★ | `hover` |
| w-respect | respect(동사) | respite(명사) | ★ | `reject` |
| w-kidney | kidney(명사) | kidnap(동사 — 장기 기증 거부 장면과 겹쳐 "빼앗다"를 떠올림) | ★ | `chimney` |
| w-wish | wish(명사) | wash(명사·동사) | 유지 가능 | — |
| w-process | process(명사) | produce(명사·동사) | 유지 가능 | — |
| w-notify | notify(동사) | notice(명사·동사) | 유지 가능 | — |
| w-second | second(형용사) | secret(형용사·명사) | 유지 가능 | — |
| w-blanket | blanket(명사) | blank(형용사·명사) | 유지 가능 | — |
| w-side | side(명사) | sigh(명사·동사) | 유지 가능 | — |
| w-crash | crash(동사) | trash(명사·동사) | 유지 가능 | — |
| w-set | set(분사) | sit·sell(동사) | 유지 가능 | — |
| w-baseline | baseline(명사 수식어) | deadline·guideline(명사) | 유지 가능 | — |

**distractorsEn — 뜻·느낌 때문에 바꿀 것**

11. w-current `cursed` → `cursive`(사망 주제에서 저주).
12. w-immediately `intimately` → `immaturely`(성적인 뜻).
13. w-point `joint` → `print`(마약 은어).
14. w-entirely `eerily` → `eagerly`(사망 주제에서 으스스함).
15. w-escalate `elevate` → `estimate`(올리다 — 정답으로도 읽힘).
16. w-sedation `sedative` → `sensation`(문장 ko가 "진정제가 걷혔는지"라 sedative도 정답으로 읽힘).
17. w-saturation `saturday` → `maturation`(고유명사를 소문자로 씀).
18. w-call `toll` → `fall`(death toll).
19. (선택) w-tolerate `terminate`, w-internal `eternal`, w-sedation `salvation` — 사망 주제에서 무겁게 읽힘. 바꾼다면 `terminate` → `titrate`, `eternal` → `infernal` 말고 `intestinal`처럼 무겁지 않은 말, `salvation` → `sensation`과 겹치지 않게 `station`.

**distractorsKo**

20. w-point `단위` → `횟수`(포인트·단위가 거의 같은 뜻).
21. w-escalate `업무를 넘기다` → `상태를 지켜보다`(넘기는 것도 상급 대응의 한 형태라 겹침). ko를 바꾸면(아래 30) 길이 다시 확인.

**cue — ko를 되풀이한 것·사실이 틀린 것**

22. w-mean `수축기와 이완기를 평균 낸 값을 가리킬 때 붙는 말` — 평균 동맥압은 단순 평균이 아니고(이완기 + 맥압의 1/3), ko '평균의'도 되풀이함. → `모니터 혈압 옆 괄호 안 숫자처럼, 장기로 가는 혈류를 가늠하는 혈압 값에 붙는 말`
23. w-restart `멈췄던 일을 처음부터 다시 시작할 때` → `중단한 검사를 환자가 안정된 뒤 처음부터 한 번 더 할 때`
24. w-wait `일이 일어나기를 자리에서 기다릴 때` → `생명유지장치를 거둔 뒤 심장이 멈출 때까지 곁에서 시간을 보낼 때`
25. w-call `전화나 호출로 담당자에게 연락할 때` → `전화를 들어 담당자에게 상황을 알릴 때`
26. w-follow `…규칙을 그대로 따를 때` → `기증이 순환정지 사망 뒤에 차례로 이어질 때`
27. w-page `호출기로 담당자를 불러 연락할 때` → `병원 무선 호출 시스템으로 담당자에게 신호를 보낼 때`
28. w-desaturate `산소포화도 수치가 평소보다 뚝 떨어질 때`(ko '산소포화도가 떨어지다' 되풀이) → `무호흡 검사 중 손가락 센서 숫자가 99에서 85로 내려갈 때`

**decoyChips — 재조립 1, 사망·장례·비속어·술·성적 조각**

29. 바꿀 조각(→ 대안):
    - 재조립: w-donation `nation` → `motion`
    - 사망·장례: w-sodium `die` → `day`(은행 단어 die 자체), w-die `dig` → `dim`, w-warm `worm` → `ward`, w-desmopressin `dust` → `desk`, w-tolerate `toll` → `tall`, w-hold `hole` → `hood`, w-flashlight `flesh` → `flush`, w-goodbye `wood` → `food`, w-entirely `end` → `and`
    - 마약 은어 `pot`(5개): w-protocol → `pat`, w-support → `part`, w-output → `pat`, w-potassium → `pit`, w-protect → `prod`
    - 성적·비속어·술: w-steady `stud` → `stood`, w-target `tart` → `tag`, w-moment `moan` → `moon`, w-completely `come` → `comb`, w-process `cuss` → `cast`, w-sorry `rye` → `ray`, w-careful `fool` → `full`, w-correct `wreck` → `rack`, w-watch `wat`(말이 안 되는 속어 표기) → `what`
    - (선택) w-bedside `bad`·`sad`, w-oxygen `ax`, -ly 조각 `lie` 4개(w-closely·gently·slowly·quickly — 가족 신뢰 장면에서 "거짓말") → `bid`·`site`, `ex`, `lay`/`lee`

### C. 뉘앙스

31. **context 4(`protocol`)** — 위 2. **삭제 권고**(상황 4는 slider·swap이 있어 V14 충족. base에 nuance가 없어 삭제해도 합치기에 걸리지 않음). 남기려면 `word`를 바꾸지 말고 어색한 장면 자체를 가족이 아닌 듣는 사람으로 바꿔야 하는데 자연스러운 자리가 없음.
32. **context 14(`death`) fix** → `When his heart stops, the doctor will wait a few minutes and then tell you that he has died.` why의 "심장이 멈추고 의사가 알려 줄 거라고"도 "심장이 멈추면 몇 분 지켜본 뒤 의사가 사망을 알려 준다"로.
33. **context 1(`response`) fix** → `He didn't react when we touched his eye or pressed on his nail. The doctor will explain what that means.` why는 그대로 맞음.
34. context 2(`baseline`) fix `…so we can begin.` → `…so the doctor can start the test.`(무호흡 검사는 의사가 진행) — 가벼움.
35. **context 17(`immediately`)** — `immediately`는 가족에게도 쉬운 말이라 어색한 장면이 그 말 때문에 어색하지 않음(어색함은 `hypernatremia`). `word`를 `correct`(ko `교정하다`, words `[w-correct]` — 17.1이 태그)로 바꾸고 장면 `en`을 고쳐 쓰세요(`who`·`icon`·`ok` 그대로):
    - 의사가 간호사에게: `Recheck the sodium and correct it slowly, as ordered.`
    - 동료 간호사에게: `We'll correct his sodium slowly, per the order.`
    - 가족에게(ok:false): `We're correcting his hypernatremia with free water.` / fix `We're slowly bringing the salt level in his blood back to normal.`
    - why: `의료진끼리는 correct가 수치를 바로잡는다는 정확한 말이지만, 가족에게 "교정"과 hypernatremia는 낯설어요. 혈액 속 염분 수치를 천천히 되돌린다고 풀어 주세요.`
36. **slider 8 cue** → `He put out almost a liter of urine in the last hour, and it looks like clear water.`(정답 profuse 그대로).
37. **slider 11** — cue `I have to see him one more time`의 "have to"는 must 쪽이라 정답 need와 둘로 읽힘. `answerAt: 1 → 2`, why → `"have to"는 꼭 해야 한다는 말이라 must예요. want는 바람, need는 필요할 때예요. 가족이 꼭 해야 한다고 느끼는 작별은 병원 규칙과 안전 안에서 최대한 맞춰 주세요.` (다른 길: need를 정답으로 두려면 cue를 `"Could I stay a little longer? It would really help me," the son says.`처럼 must가 아닌 말로)
38. **slider 14** — `records the time of every single change`는 regularly로도 읽힘. cue → `During the waiting period, one nurse watches the monitor the whole time and writes down each change.`
39. **slider 17** — `one or two points at each check`는 creep으로도 읽힘. cue → `Sodium went 146, 149, 152, then 155 over the last four checks.`
40. **slider 19** — `evenly`는 속도 축이 아님. scale → `[slowly, at a normal pace, quickly]`.
41. **swap 17** — `is nuts in the last hour`는 시제가 맞지 않음. 선택지 → `has gone nuts`(notes 키도 함께).
42. **slider 18** — 18.3을 고치면 example·exKo를 새 문장으로(위 A4). why는 그대로 맞음.

### D. 결정 11 (기존 단어·문장의 흠)

30. w-escalate ko `상황을 격상시키다` → `상급 대응을 요청하다`(context 16 `ko`도 같이 — 화면 제목에 나옴). cue `상황이 심각해서 더 높은 단계의 도움을 요청할 때`는 새 ko를 되풀이하니 → `처방 범위로 혈압이 안 잡혀 선임 의사나 신속대응팀을 부를 때`.
43. w-map 헤드워드 `map` → `map out`(문장 13.0이 `map out`, ko '정리하다'는 구의 뜻). chips `[[map],[out]]`, distractorsEn `[mop up, max out]` 정도, example 그대로. id 유지.
44. w-rescue ko `구조의` → `응급용`(rescue equipment = 응급 장비. 오답 교체용·연습용과 틀도 맞음).
45. 0.2(keyPhrase — ko만 고침) `합법적인` → `법적인`. distractorsKo 둘을 새 ko로(지금 오답 둘도 '합법적인'을 씀).
46. 20.2(keyPhrase — ko만) `빠르게 에스컬레이션할 수 있도록` → `빠르게 상급 대응으로 올릴 수 있도록`. distractorsKo 둘을 새 틀로.
47. (선택) 3.0 ko `그는 사망했습니다` → `그분은 사망하셨습니다`(가족에게 하는 말이라 높임. "사망"은 그대로 분명하게). distractorsKo도 새 틀로.

변경 목록(74건) 판정: 과하거나 틀린 것 없음. `w-support` ko를 '지원하다'로 바꾼 것은 정서 지지(18.2·12.5)에 조금 딱딱하지만 틀리지 않아 그대로 둡니다.

### 저작자 메모 판정
- 1.3·1.4(동공·각막·구역 반사 소견): **유지** — 1.3은 `on my check`로 간호사 자신의 신경 사정임이 분명하고, 1.4는 침상 신경 사정 보고로 자연스럽습니다. 판정 소견처럼 쓰이지 않습니다.
- 4.4·13.3 시각 약속: **타당** → A2·A3.
- 6.3 `call it`: **타당** → A1(안전).
- 18.3 `say no`: **타당** → A4.
- 20.5 기증 압박: **타당**(BED 5라 청자 한정이 안 됨) → A5.
- 7·8·9·15·16 투여 문장, 3.1 `confirm`, 10.0 환기 설정, 11.0 시간 약속: 모두 keyPhrase → E절.
- context를 가족 대상 6상황(0·3·11·12·18·19)에 쓰지 않은 판단: **수용**. 상황마다 slider·swap이 있어 V14를 채우고, 세 장면이 자연스럽게 공유할 임상어가 없으며, 사망 고지에서 died를 어색한 말로 둘 수 없다는 이유가 맞습니다(브리프 "억지로 채우지 마세요").

## E. keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| 문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 16.0 | Max the pressors and give volume now. | 처방 최대치를 넘겨 올리라는 말로 읽힘. 같은 상황 slider 16 why와 모순 | Titrate the pressors to the ordered max and give volume as ordered. | **바꾸기(안전)**. 바꾸면 `w-max`가 어느 문장도 태그하지 않게 됨 → `max`를 살려 태그하거나 word-remove |
| 15.1 | Start pressors and give a fluid bolus. | 간호사가 명령형으로 투여를 정함 | Should we start pressors and give a fluid bolus? | **바꾸기** — 태그 단어(start·pressor·give·fluid·bolus) 그대로 |
| 17.0 | Give desmopressin now and start matching the losses. | 명령형 투여 지시 | Can we get desmopressin ordered now and start matching the losses? | **바꾸기** — 태그 단어 그대로 |
| 8.0 | Let's give desmopressin and match the fluid losses. | 처방 근거 없음(Let's로 팀 결정처럼은 읽힘) | Let's give the desmopressin as ordered and match the fluid losses. | 바꾸기(약) — 태그 단어 그대로 |
| 7.1 | I'll give a fluid bolus and reassess. | 단독 투여처럼 읽힘 | I'll give the ordered fluid bolus and reassess. | 바꾸기(약) — 태그 단어 그대로 |
| 9.1 | Let's replace the potassium and recheck. | 칼륨 보충은 처방·프로토콜 | Let's replace the potassium per protocol and recheck. | 유지 가능(ICU 전해질 프로토콜이 흔하고 Let's는 팀 결정). 바꾸면 태그 그대로 |
| 7.0 | Let's start the pressor and titrate to the target pressure. | target pressure가 처방 목표를 전제하나 시작 결정은 처방 | Let's start the pressor as ordered and titrate to the target pressure. | 유지 |
| 10.0 | Let's keep tidal volumes low and PEEP optimized. | 설정 변경은 의사·호흡치료사 | Let's ask respiratory to keep tidal volumes low and PEEP optimized. | 유지(목표를 함께 말하는 문장, 10.5가 호흡치료팀 협력을 따로 가르침) |
| 18.1 (+18.4) | There is no pressure — this is entirely your decision. | 본인이 기증 등록(first-person authorization, UAGA)했으면 가족이 뒤집을 수 없어 "전적으로 가족 결정"이 틀릴 수 있음. 18.4(keyPhrase 아님) `belongs to you and your family alone`도 같은 주장 | There is no pressure — take all the time you need. | **유지** — 상황 18은 OPO가 가족에게 물은 장면이라(등록이 없는 경우) 맞는 말. 18.4도 같은 이유로 유지. 원하면 B가 18.1·18.4 why에 "등록 기증자는 OPO가 따로 안내" 한 줄 |
| 3.1 | That's right, and I'm so sorry to confirm this for you. | confirm이 판정처럼 읽힐까 | — | 유지(의사 선언 뒤 가족 질문에 사실을 확인해 주는 말) |
| 11.0 | Take all the time you need to be with him. | 기증 일정상 시간 제한이 있을 수 있음 | — | 유지(사별 지원의 표준 표현) |
| 20.0 | Let's optimize his perfusion and urine output now. | — | — | 유지 |

**keyPhrase chunks(보고만)** — 2.2 `Everything is / set`(→ `Everything is set / for the apnea test / to begin`은 조각 수 부족이라 어려움), 6.2 `is at / the bedside and ready`, 12.2 `to speak with all / of you together`(→ `to speak / with all of you / together`), 15.2 `before anything / else`, 18.0 `and your family's / wishes`(→ `and your family's wishes / will be / respected`), 3.3 `anything that's still / unclear`, 11.0 `Take all / the time you need`.

## 종합

고칠 것 58건(번호 항목 47 + 품사 ★ 11; 선택 3 포함, 29번은 decoyChips 조각 묶음, 번호 30은 D절) — 그중 안전 1(6.3). keyPhrase 결정 12건(그중 안전 1 — 16.0). 사실·관행 문제는 context 4·14·1 fix와 시각 약속 두 문장이 핵심이고, 나머지는 오답·조각의 품사·느낌 정리입니다. 위를 고치고 E절의 keyPhrase(특히 16.0) 결정을 받으면 내보내도 됩니다.
