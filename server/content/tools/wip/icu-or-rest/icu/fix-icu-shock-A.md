# fix-icu-shock-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번·swap ko)

대상: `icu-shock.yaml` (단어 254 · 상황 21 · 문장 126 · 뉘앙스 42 = context 20 · slider 17 · pair 4 · swap 1).
비교: `base-icu-shock.yaml`, `changes-icu-shock.yaml`, `in-icu-shock.json`, `notes-icu-shock-A.md`·`notes-icu-shock-B.md`(B 메모는 B 범위라 판정하지 않음).
기계 확인(스크립트): 단어 전부 표, 문장 chunks 전부 `/` 연결(관사·전치사·수식어로 끝나는 조각 자동 검색 포함), pair 전 결합, swap 선택지별 연결, context `word`가 세 장면 `en`에 있는지, distractorsEn 품사, decoyChips·오답 비속어 검색, 은행 안 같은 `ko`·cue에 ko 포함 검색, 고친 뒤 상황별 서로 다른 단어 수(V3) 재계산, 상황 tagline과 문장·뉘앙스의 환자 성별 대조.

## 항목별 점수
| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 2 | 품사가 다른 오답이 85단어(아래 표). 정답으로도 맞는 오답 2개(alertness↔awareness, grab↔grasp). Foley만 대문자라 오답(follow·hollow)이 글자로 걸러짐. circumcision은 장면 밖 |
| 2 | dKo·dEn 겹침·길이 | 4 | 길이 규칙은 전부 통과, 은행 안 같은 ko 없음(저작자가 10쌍을 가름). "숨기다"류 오답이 5단어에 되풀이돼 읽기만 해도 걸러짐 |
| 3 | cue | 3 | 정답 노출 없음. ko를 그대로 담은 cue 9개(stat·temperature·number·intervention·already·unit·sense·cause·physician), tongue cue 오타 |
| 4 | chips/decoyChips | 4 | 형태소 단위로 대체로 잘 자름. 욕설 없음. 약하게 불편한 조각 2개(fat, die) |
| 5 | 뉘앙스 사실 | 3 | 바늘 감압을 가족에게 "small/thin needle"로 설명(실제는 굵은 바늘, 문장 9.5와도 어긋남), 산증 slider 예문의 잘못된 안심 |
| 6 | 뉘앙스 설계 | 3 | pair 2개에서 decoy가 왼쪽 말에 붙음(pass the Foley, recommend a Foley bag), 분포성 slider가 강도 척도가 아님, 무의미성 context가 핸드오프 모양 아님, swap 선택지 하나가 뜻을 뒤집음, 환자 성별이 tagline과 다른 뉘앙스 4곳 |
| 7 | 결정 11 | 3 | 저작자 변경은 타당. 놓친 것: 사실 오류 문장 2(16.4 MTP 순서, 18.3 한쪽 산소포화도), 지킬 수 없는·범위 밖 말 2(7.4, 20.5), 틀린 ko·태그(rate·large·volume·eye·cause·give·flow·support), 문장 성별 불일치 3, 구 경계를 끊은 chunks 17 |

## 사실 오류·심각한 문제
1. **[환자 안전] 대량수혈 발동 · 문장 4** "We're giving packed cells first, then plasma." — 대량수혈 프로토콜은 적혈구와 혈장을(혈소판과 함께) 1:1(:1) 비율로 **함께** 주는 것이 원칙입니다. "먼저 적혈구, 그다음 혈장"은 혈장 투여를 늦추는 순서를 가르칩니다(저작자 메모 타당). → S28
2. **[환자 안전·범위] 분포성 쇼크 초기 소생 · 문장 4** "I'll start norepinephrine if fluids aren't enough." — 승압제 시작은 처방이 있어야 합니다. 같은 주제 13.1·13.2·13.5가 "의사에게 권하고 처방을 요청한다"를 가르치는데 이 문장만 간호사가 스스로 시작한다고 말합니다(B 저작자도 오답 ko를 "건의할게요"로 쓴 것을 보면 같은 판단). → S9
3. **[사실] 긴장성 기흉 응급 감압 · 문장 3** "His oxygen is dropping fast on one side." — 산소포화도는 한쪽 폐마다 재는 값이 아닙니다. 한쪽에서 떨어지는 것은 호흡음·흉곽 움직임입니다. → S31
4. **[사실] 폐색성 쇼크 context(decompression) fix "a small needle" · 긴장성 기흉 context(needle) fix "a thin needle"·why "가는 바늘"** — 바늘 감압은 굵은(14G 등 large-bore) 긴 바늘을 씁니다. 같은 주제 9.5가 "a large needle"이라 서로 어긋나고, 가족에게 사실과 다른 설명을 가르칩니다. → N6·N10
5. **[잘못된 안심] 산-염기 slider 예문** "That's a mild acidosis, nothing dramatic." — 쇼크 환자의 pH 7.34를 "크게 걱정할 정도 아님"으로 넘기는 말은 보상 중인 산증·상승하는 젖산을 놓치게 합니다. → N8
6. **[지킬 수 없는 약속] 무의미성 갈등 · 문장 5** "We'll support whatever decision feels right for all of you." — 무의미성 갈등에서 "어떤 결정이든 지지"는 의학적으로 무익한 처치 요구까지 약속하는 말로 들립니다(저작자 메모 타당). 문장 0 "we're not giving up on him"(keyPhrase)은 K1로 따로 보고합니다. → S35
7. **[설계] pair 정답 둘** — 쇼크 유형 병력 청취: decoy `the Foley`가 "pass the Foley"(폴리를 넣다/건네다)로 붙습니다. 승압제 시작 시점: decoy `a Foley bag`이 "recommend a Foley bag"으로 붙습니다. → N2·N7
8. **[일관성] 환자 성별** — 심장압전 상황 tagline은 "Her … she's tamponading"인데 문장 17.3·17.5와 slider·context가 his. 볼루스 상황(환자 he)의 slider cue가 "Her lungs", 소변량 상황(환자 she)의 slider가 "70 kg man"·"He's oliguric". 승압제 13.5 "ask him"은 환자(she)와 섞여 누구인지 모호합니다. → S21·S30·N1·N3·N9

---

## 고칠 것

### A. 문장 (결정 11) — `en`·`ko`·`chunks`를 바꾸면 그 문장의 v46 필드(`why`·`decoy`·`distractorsKo` 2개·`blank`·`tag`/`icon` 점검)도 새로 쓰고 `changes-icu-shock.yaml`에 적습니다. `ko`만 바꾸면 그 문장의 `distractorsKo` 둘을 새 ko에 맞춰 다시 씁니다. chunks만 바꾸면 `decoy`·`blank`가 옛 청크를 전제하는지 다시 봅니다.

**chunks — 구 경계를 끊은 것 (keyPhrase 아님)**
- **S1** 젖산 채혈·경향 추적 · 문장 3 · `was four / point two`가 수 "four point two"를 끊음 → `["His last lactate", "was", "four point two", "."]`
- **S2** 젖산 채혈·경향 추적 · 문장 5 · `to the first / draw`가 명사구를 끊음 → `["Let's", "compare it", "to the first draw", "."]`
- **S4** 쇼크 유형 병력 청취 · 문장 3 · `vomiting or having / diarrhea`가 "having diarrhea"를 끊음 → `["Have you been", "vomiting", "or having diarrhea", "?"]`
- **S5** 시간당 소변량 모니터 · 문장 5 · `on the flow / sheet`가 복합명사 "flow sheet"를 끊음 → `["I'll document it", "every hour", "on the flow sheet", "."]`
- **S7** 저혈량 쇼크 출혈원 감별 · 문장 3 · `than an hour / ago` 끊김 → `["His belly", "is getting", "firmer", "than an hour ago", "."]`
- **S8** 분포성 쇼크 초기 소생 · 문장 3 · `after two / liters` 끊김 → `["Her blood pressure", "is still low", "after two liters", "."]` (blank 정답 `liters`는 청크 일부로 그대로 둘 수 있음)
- **S10** 심인성 쇼크 감별 · 문장 3 · `since this / morning` 끊김 → `["His oxygen", "has been dropping", "since this morning", "."]`
- **S11** 폐색성 쇼크 인지 · 문장 3 · `on his / right side` 끊김 → `["I can't hear", "any", "breath sounds", "on his right side", "."]`
- **S13** 수액 과다와 부족 경계 판단 · 문장 3 · `in the last / hour` 끊김 → `["Her oxygen", "has dropped", "a little", "in the last hour", "."]`
- **S15** 아나필락시스 쇼크 대응 · 문장 5 · `for a second / reaction`이 명사구를 끊음 → `["I'll", "monitor her", "for a second reaction", "."]`
- **S18** 젖산 클리어런스 목표 평가 · 문장 3 · `in just / two hours` 끊김 → `["That's", "a good drop", "in just two hours", "."]`
- **S20** 승압제 시작 시점 소통 · 문장 4 · `to any / of it` 끊김 → `["Her pressure", "hasn't responded", "to any of it", "."]`
- **S22** 쇼크 중 산-염기 교정 판단 · 문장 3 · `is also / dropping`이 동사구를 끊음 → `["His pH", "is low", "and his CO2", "is also dropping", "."]`
- **S24** 쇼크 중 산-염기 교정 판단 · 문장 5 · `after the next / intervention` 끊김 → `["I'll recheck", "his gas", "after the next intervention", "."]`
- **S32** 쇼크 후 심정지 임박 · 문장 4 · `the defibrillator / pads now`가 "the defibrillator pads"를 끊음 → `["I'll grab", "the defibrillator pads", "now", "."]`
- **S34** 소생 목표와 무의미성 갈등 · 문장 3 · `for your / family` 끊김 → `["I know", "this is", "a very hard time", "for your family", "."]`
- (S3·S6·S12·S14·S16·S17·S19·S21·S23·S25~S31·S33·S35는 아래 내용 수정)

**ko만 고치는 것** — `distractorsKo` 둘을 새 ko에 맞춰 다시 씀
- **S3** 대량 수액 볼루스 · 문장 5 "I'll stop it early if his lungs sound wet." · ko "…바로 멈출게요"는 early(다 들어가기 전에)를 담지 못하고 "습성 음"은 쓰지 않는 말 → `폐에서 수포음이 들리면 다 들어가기 전에라도 멈출게요.` (저작자 메모 "의사에게 알림이 없다"는 en을 고칠 정도는 아님: 이 상황의 상대가 볼루스를 지시한 동료·의사이고 slider why와 order 3줄이 이미 멈춤의 기준을 말함)
- **S6** 말초·중심 체온차 · 문장 3 · ko "발이 지금 저에게는 많이 차게 느껴지네요"는 번역투(저작자 메모 타당) → `지금 만져 보니 발이 많이 차가워요.`
- **S12** 폐색성 쇼크 인지 · 문장 5 "a large needle" · 감압 바늘의 large는 굵기(large-bore) → ko `지금 바로 침상 옆에 굵은 바늘이 필요해요.` (W3과 짝. 기존 dKo "큰 바늘이 필요하대요"도 새 ko에 맞춤)
- **S14** 수액 과다와 부족 · 문장 2 (**keyPhrase — ko만**) · ko "충분한 용량을 원해요"는 어색하고 "용량"은 투여량(dose)으로 읽힘 → `폐부종으로 넘어가지 않게 하면서 충분한 용적을 채우고 싶어요.` (W4와 짝)
- **S16** 젖산 클리어런스 · 문장 0 (**keyPhrase — ko만**) · "회복되고 있어요"는 clearing(젖산이 씻겨 나감)의 뜻이 아님(저작자 메모 타당) → `젖산이 6에서 4로 떨어져서 잘 제거되고 있어요.`
- **S17** 젖산 클리어런스 · 문장 2 (**keyPhrase — ko만**) · "소생 반응을 재평가해요"는 en(our resuscitation = 소생 치료)과 다름 → `정체되면 소생 치료를 다시 평가해요.`
- **S25** 다장기부전 · 문장 1 (**keyPhrase — ko만**) · goals에 "재사정"은 어색함 → `치료 목표를 다시 검토해야 해요.`
- **S26** 다장기부전 · 문장 3 · ko "기능부전이 되고 있어요"는 어색함 → `신장과 간이 둘 다 지금 기능을 잃어 가고 있어요.`
- **S29** 대량수혈 발동 · 문장 5 · ko "매 단위마다 계속 개수를 세어 볼게요"는 running count(누적 합계)를 못 담음 → `들어가는 단위를 하나도 빠짐없이 누적해서 세어 둘게요.`

**words 태그만 고치는 것** (문장은 그대로)
- **S23** 산-염기 · 문장 4 "Fixing the cause…" · cause가 명사인데 `w-cause`(ko 원인이 되다) 태그 → `words`에서 `w-cause` 빼기(3.2 "what's causing"에는 남음. 저작자 메모 타당)
- **S27** 대량수혈 · 문장 2 (keyPhrase, en 그대로) "keep flowing" · 동사인데 `w-flow`(ko 흐름, 명사) 태그 → `w-flow` 빼기(5.1·5.4에 남음)
- **S33** 무의미성 갈등 · 문장 0 (keyPhrase, en 그대로) "giving up on him" · give up(포기하다)에 `w-give`(주다) 태그 → `w-give` 빼기

**en을 고치는 것** — 이 문장들의 v46 필드를 모두 새로 씀
- **S9** 분포성 쇼크 초기 소생 · 문장 4 · **환자 안전**(위 2) → en `I'll have norepinephrine ready if fluids aren't enough.` / ko `수액만으로 충분하지 않을 때를 대비해 노르에피네프린을 준비해 둘게요.` / chunks `["I'll have", "norepinephrine ready", "if fluids", "aren't enough", "."]` / words `[w-norepinephrine, w-ready, w-fluid, w-enough]`(w-start는 7.0에 남음)
- **S19** 젖산 클리어런스 · 문장 4 "I'll recheck it again…" · recheck와 again이 겹친 중복 표현(ko "다시 재확인"도 같음, why가 이를 정당화함) → en `I'll check it again after the next bolus.` / ko `다음 볼루스 후에 다시 확인할게요.` / chunks `["I'll check it", "again", "after the next bolus", "."]` / words `[w-check, w-again, w-next, w-bolus]`(w-recheck는 14.5에 남음). `w-again`의 example·exKo도 이 문장으로
- **S21** 승압제 시작 시점 · 문장 5 "I'll ask him to order…" · 환자가 she인 상황에서 him이 누구인지 모호(저작자 메모 타당) → en `I'll ask the physician to order norepinephrine now.` / ko `지금 노르에피네프린을 처방해 달라고 의사에게 요청할게요.` / chunks `["I'll ask", "the physician", "to order norepinephrine", "now", "."]` / words `[w-ask, w-physician, w-order, w-norepinephrine]`
- **S28** 대량수혈 발동 · 문장 4 · **환자 안전**(위 1) → en `We're giving packed cells and plasma together, one to one.` / ko `농축적혈구와 혈장을 1:1로 함께 주고 있어요.` / chunks `["We're giving", "packed cells and plasma", "together", ", one to one", "."]` / words `[w-give, w-packed, w-cell, w-plasma, w-together]`(w-first는 이 상황에서 빠지고 1.5·3.0·7.0에 남음). 지금 blank 정답이 `first`, dKo가 "먼저 … 그다음"을 전제하므로 전부 새로
- **S30** 심장압전 · 문장 3·5 · tagline("Her … she's tamponading")과 성별이 다름 → 3 en `Her neck veins look distended too.`, 5 en `I'm charting the time and her vitals.` (ko·chunks의 his→her, 나머지 그대로). 같은 상황 뉘앙스 N9와 함께
- **S31** 긴장성 기흉 응급 감압 · 문장 3 · **사실 오류**(위 3) → en `His oxygen is dropping fast, and his chest isn't rising on one side.` / ko `산소포화도가 빠르게 떨어지고, 한쪽 가슴이 잘 올라오지 않아요.` / chunks `["His oxygen", "is dropping fast", ", and his chest", "isn't rising", "on one side", "."]` / words `[w-oxygen, w-drop, w-fast, w-side]` (지금 dKo "양쪽에서 산소포화도…"도 전제가 틀림)
- **S35** 소생 목표와 무의미성 갈등 · 문장 5 · **지킬 수 없는 약속**(위 6) → en `We'll support all of you as we work through this decision together.` / ko `이 결정을 함께 풀어 가는 동안 가족분들 모두를 도울게요.` / chunks `["We'll support", "all of you", "as we work through", "this decision", "together", "."]` / words `[w-decision, w-together]` (support는 여기서 동사라 `w-support`(지지 요법) 태그를 붙이지 않음). `w-whatever`·`w-feel`·`w-right`는 어느 문장도 태그하지 않게 되니 word-remove(W6). **order 4번 줄**도 같은 문장으로 바꿈(B 범위와 맞출 것)

(고친 뒤 상황별 서로 다른 단어 수를 다시 셌습니다. 가장 적은 상황이 시간당 소변량 12개, 소생 목표 12개, 쇼크 초기 14개라 V3 통과합니다.)

선택(점수에 넣지 않음): 0.3 `and where / you are`, 0.4 `how much / urine`, 4.3 `with the Foley / bag`도 구를 끊었지만 낱말 수 기준(9개→4조각, 7개→3조각) 때문에 더 나은 자름이 마땅하지 않아 두었습니다. 15.4 "This is despite maximal fluids and pressors."는 어색하지만 틀리지 않습니다(why의 "가족이 알 수 있어요"는 동료 상황이라 B가 봄).

### B. 단어 (결정 11)

- **W1** `w-eye` ko "주의(눈)"·dKo "귀(청각)/코(후각)"는 부자연스러움. 쓰인 곳이 "keep a close eye on" 하나뿐이라 결정 11대로 **구 단위로** → en `keep a close eye on`, ipa `/kiːp ə ˌkloʊs ˈaɪ ɑn/`, ko `주의 깊게 지켜보다`, chips `[[keep], [a], [close], [eye], ["on"]]`(on은 따옴표), decoyChips `[clothes, ear]`, dEn `[keep a close lid on, keep a cool head on]`, dKo `[단단히 덮어 두다, 침착하게 버티다]`, cue `징후가 바뀌는지 한 번 보고 끝내지 않고 내내 살피겠다고 할 때`, example 그대로. 문장 0.2 `words`에서 `w-keep` 빼기(w-keep은 5.5·11.4·16.2·16.5에 남음)
- **W2** `w-rate` ko "박동수" — 10.4 "breathing rate"(호흡수)에도 붙어 틀림 → ko `분당 횟수`
- **W3** `w-large` ko "큰" — 감압 바늘의 굵기(large-bore) → ko `굵은`, dKo `[작은, 가는]` → `[가는, 짧은]`, dEn은 표 44, cue `흉부 감압처럼 바늘의 굵기를 강조해 고를 때 붙이는 말`(S12와 짝)
- **W4** `w-volume` ko "용량" — 한국 간호 현장에서 용량은 투여량(dose)으로 읽힘. 여기서는 혈관 안 체액의 양 → ko `용적`(S14와 짝)
- **W5** `w-cause` cue "어떤 일의 원인이 되어 그 일을 일으키는 것을 가리키는 말"이 ko를 되풀이 → `증상과 병력을 들으며 쇼크를 일으킨 배경을 찾을 때 쓰는 동사`(S23과 짝)
- **W6** word-remove `w-whatever`·`w-feel`·`w-right` — S35로 어느 문장도 태그하지 않게 됨
- **W7** `w-compression` 헤드워드가 복수형 "compressions" — 같은 브랜치 icu-cardiogenic은 원형 compression으로 고쳤음(일관성). 저작자 메모는 "낱말로 굳은 복수"로 두었지만 vitals와 달리 단수가 표제어로 쓰임 → en `compression`, ipa `/kəmˈprɛʃən/`, chips `[[com, pres, sion]]`, dEn `[compensation, concession]`, example 그대로
- **W8** tag `일반 동사`가 동사 아닌 말에 붙음 — early·enough·instead·also·second·again·already·next·after(9개) → `일반 표현`(동사 15개는 그대로)

### C. 단어 v45 필드

**정답으로도 맞는 오답·장면 밖 오답·대문자**
- **D1** `w-grab` dEn `grasp` — "grab"과 거의 같은 뜻(쥐다)이라 뜻에서 영어 고르기에 정답 둘 → `[graze, grade]`
- **D2** `w-alertness` dEn `awareness` — "checking your skin, awareness…"도 성립하는 근사 동의어(품사 다른 alertly와 함께 표 1에서 바꿈)
- **D3** `w-circulation` dEn `circumcision` — 장면과 상관없는 생식기 시술 → `[circumference, calculation]`
- **D4** `w-foley` dEn `[follow, hollow]` — 정답만 대문자라 글자 모양으로 걸러지고 품사도 다름 → `[Fowler, Coudé]`(둘 다 병실에서 쓰는 고유명 용어, 표 20)

**dKo**
- **D5** "숨기다"류 오답이 5단어에 되풀이(update "경과를 숨기다", report "숨기다", call "숨기다", chart "차트에 숨기다", get "숨기다") — 간호사가 하지 않을 일이라 읽기만 해도 걸러짐 → update `[경과를 묻다, 경과를 적다]`, report `[확인하다, 기다리다]`, call `[기다리다, 기록하다]`, chart `[차트를 읽다, 차트를 출력하다]`, get `[치우다, 닦다]`

**cue**
- **D6** cue가 ko를 그대로 담거나 사전 뜻풀이만 함 → 장면 단서로:
  `w-stat`("…지금 당장 처리하라는…" → "검체를 보내며 차례를 건너뛰어 가장 먼저 처리해 달라고 붙이는 약어"), `w-temperature`("체온계로 재는…" → "가슴은 따뜻한데 발은 차가울 때 두 부위를 비교하는 값"), `w-number`("…숫자보다 원인이 중요하다고 할 때" → "pH 같은 검사 값 자체를 가리켜, 원인을 고치는 것보다 덜 중요하다고 할 때"), `w-intervention`("…처치나 조치" → "수액·승압제처럼 상태를 바꾸려고 한 일 — 그 뒤에 동맥혈가스를 다시 본다"), `w-already`("…이미 끝났거나…" → "수액을 3리터나 벌써 줬다고 강조할 때"), `w-unit`("…세는 단위" → "적혈구 팩을 하나, 둘 셀 때 쓰는 말"), `w-sense`("…이치에 맞고…" → "'make ___'로 이 돌봄이 지금 환자에게 맞는지 말할 때 쓰는 명사"), `w-physician`("…의료진을 격식 있게 부르는 말" → "수혈 처방을 받으려고 간호사가 전화하는 상대")
- **D7** `w-tongue` cue 오타 "붓으면" → "부으면"

**decoyChips (비속어·불쾌한 조각)** — 욕설은 없습니다. 약하게 불편한 것만:
- **D8** `w-fit` decoyChips·dEn `fat`(체형) → decoyChips `fist`(dEn은 표 84) · `w-diarrhea` decoyChips `die`(쇼크 주제에서 "죽다") → `day`
  (rum·wine·ugh·war·son·nay·lurge는 비속어가 아니라 그대로 둠)

**distractorsEn 품사 다름 — 전부 (85단어)** (정답 품사 기준. 바꿀 말은 모두 길이 규칙 1.25배·3자 이내를 지키고 정답·chips와 같지 않음을 스크립트로 확인함. 철자가 닮아 버리기 아까운 말은 decoyChips로 옮겨도 됨)

| # | id | 정답(품사) | 품사 다른 오답 | 지금 → 바꿀 dEn |
|---|---|---|---|---|
| 1 | w-alertness | alertness (명) | alertly (부) | ['alertly', 'awareness'] → [aloneness, lightness] |
| 2 | w-tell | tell (동) | tall (형) | ['tall', 'till'] → [till, toll] |
| 3 | w-pale | pale (형) | pile (명), pail (명) | ['pile', 'pail'] → [stale, pink] |
| 4 | w-lactate | lactate (명) | lactic (형) | ['lactose', 'lactic'] → [lactose, lactase] |
| 5 | w-run | run (동) | rug (명) | ['rub', 'rug'] → [rub, ram] |
| 6 | w-fluid | fluid (명) | fluent (형) | ['fluent', 'flush'] → [flood, flush] |
| 7 | w-bolus | bolus (명) | basal (형) | ['bonus', 'basal'] → [bonus, basis] |
| 8 | w-open | open (형) | oven (명), often (부) | ['oven', 'often'] → [even, oval] |
| 9 | w-heart | heart (명) | hurt (동), heard (동) | ['hurt', 'heard'] → [hearth, health] |
| 10 | w-rate | rate (명) | rare (형) | ['race', 'rare'] → [race, rote] |
| 11 | w-lung | lung (명) | lug (동), lurk (동) | ['lug', 'lurk'] → [lunge, lump] |
| 12 | w-early | early (부) | earl (명) | ['earl', 'nearly'] → [nearly, yearly] |
| 13 | w-fever | fever (명) | fewer (형) | ['fewer', 'feeder'] → [fervor, feeder] |
| 14 | w-chest | chest (명) | cheat (동) | ['cheat', 'chess'] → [crest, chess] |
| 15 | w-shock | shock (명) | shake (동) | ['shake', 'stock'] → [shack, stock] |
| 16 | w-pass | pass (동) | past (형·명) | ['past', 'pace'] → [pace, parse] |
| 17 | w-low | low (형) | law (명), row (명) | ['law', 'row'] → [slow, lone] |
| 18 | w-target | target (명) | forget (동) | ['market', 'forget'] → [market, tablet] |
| 19 | w-measure | measure (동) | pleasure (명) | ['treasure', 'pleasure'] → [treasure, massage] |
| 20 | w-foley | Foley (명(고유)) | follow (동), hollow (형) | ['follow', 'hollow'] → [Fowler, Coudé] |
| 21 | w-document | document (동) | monument (명), decrement (명) | ['monument', 'decrement'] → [torment, compliment] |
| 22 | w-warm | warm (형) | worm (명), swarm (명) | ['worm', 'swarm'] → [worn, wary] |
| 23 | w-blood | blood (명) | blond (형) | ['flood', 'blond'] → [flood, brood] |
| 24 | w-flow | flow (명) | flew (동 과거) | ['flaw', 'flew'] → [flaw, glow] |
| 25 | w-monitor | monitor (동) | motor (명) | ['mentor', 'motor'] → [mentor, motivate] |
| 26 | w-let | let (동) | lot (명) | ['lit', 'lot'] → [lit, get] |
| 27 | w-cold | cold (형) | colt (명) | ['colt', 'bold'] → [bold, old] |
| 28 | w-abdomen | abdomen (명) | abstain (동) | ['abduction', 'abstain'] → [abduction, abutment] |
| 29 | w-distend | distend (동) | distant (형) | ['distant', 'extend'] → [distract, extend] |
| 30 | w-type | type (동) | typo (명) | ['tape', 'typo'] → [tape, tip] |
| 31 | w-cross | cross (동) | cress (명), gross (형) | ['cress', 'gross'] → [crush, toss] |
| 32 | w-firm | firm (형) | form (명), farm (명) | ['form', 'farm'] → [fine, faint] |
| 33 | w-loss | loss (명) | toss (동) | ['boss', 'toss'] → [boss, moss] |
| 34 | w-give | give (동) | gift (명) | ['dive', 'gift'] → [dive, live] |
| 35 | w-stat | stat (부) | steak (명) | ['static', 'steak'] → [static, stale] |
| 36 | w-hold | hold (동) | hole (명), hood (명) | ['hole', 'hood'] → [fold, howl] |
| 37 | w-next | next (형) | nest (명) | ['nest', 'neat'] → [neat, near] |
| 38 | w-instead | instead (부) | instant (형) | ['instant', 'inside'] → [inside, indeed] |
| 39 | w-need | need (동) | deed (명) | ['nod', 'deed'] → [nod, heed] |
| 40 | w-emergent | emergent (형) | emergency (명) | ['emergency', 'resurgent'] → [resurgent, emerging] |
| 41 | w-needle | needle (명) | needy (형) | ['noodle', 'needy'] → [noodle, nettle] |
| 42 | w-hear | hear (동) | here (부) | ['here', 'heat'] → [heal, heat] |
| 43 | w-fast | fast (부) | fact (명) | ['fact', 'last'] → [last, vast] |
| 44 | w-large | large (형) | lunge (동·명), charge (동·명) | ['lunge', 'charge'] → [blunt, dull] |
| 45 | w-bedside | bedside (명) | beside (전) | ['beside', 'bedrock'] → [bedrock, bedsore] |
| 46 | w-develop | develop (동) | envelope (명) | ['envelope', 'deliver'] → [deliver, devalue] |
| 47 | w-also | also (부) | alto (명) | ['alto', 'almost'] → [almost, alone] |
| 48 | w-small | small (형) | smell (명·동), shall (조동) | ['smell', 'shall'] → [smooth, stale] |
| 49 | w-second | second (형) | segment (명), secure (형·동) | ['segment', 'secure'] → [secret, sudden] |
| 50 | w-clear | clear (동) | clever (형) | ['clean', 'clever'] → [clean, cheer] |
| 51 | w-stall | stall (동) | stool (명), still (형·부) | ['stool', 'still'] → [stalk, steal] |
| 52 | w-again | again (부) | agent (명), aging (명) | ['agent', 'aging'] → [ago, apart] |
| 53 | w-plan | plan (명) | plain (형) | ['plain', 'clan'] → [plant, clan] |
| 54 | w-despite | despite (전) | desire (명·동), despair (명·동) | ['desire', 'despair'] → [beside, except] |
| 55 | w-adequate | adequate (형) | advocate (명·동) | ['accurate', 'advocate'] → [accurate, adjacent] |
| 56 | w-already | already (부) | altered (형) | ['alright', 'altered'] → [alright, altogether] |
| 57 | w-ask | ask (동) | ash (명) | ['act', 'ash'] → [act, add] |
| 58 | w-matter | matter (동) | master (명) | ['mutter', 'master'] → [mutter, scatter] |
| 59 | w-support | support (명) | suppose (동) | ['sport', 'suppose'] → [sport, passport] |
| 60 | w-bring | bring (동) | broom (명) | ['broom', 'bridge'] → [wring, bridge] |
| 61 | w-kidney | kidney (명) | kindly (부·형) | ['kindly', 'kitchen'] → [kitchen, chimney] |
| 62 | w-liver | liver (명) | lively (형) | ['lively', 'river'] → [river, lever] |
| 63 | w-join | join (동) | joint (명) | ['joint', 'jolt'] → [jolt, jog] |
| 64 | w-massive | massive (형) | massage (명) | ['massage', 'passive'] → [passive, abrasive] |
| 65 | w-cooler | cooler (명) | colder (형) | ['cooker', 'colder'] → [cooker, collar] |
| 66 | w-packed | packed (형) | packet (명) | ['packet', 'backed'] → [backed, picked] |
| 67 | w-role | role (명) | rode (동 과거) | ['rule', 'rode'] → [rule, roll] |
| 68 | w-unit | unit (명) | until (전·접), undo (동) | ['until', 'undo'] → [unity, suit] |
| 69 | w-prime | prime (동) | prize (명), pride (명) | ['prize', 'pride'] → [prune, pry] |
| 70 | w-procedure | procedure (명) | produce (동) | ['produce', 'proceeding'] → [proceeding, procession] |
| 71 | w-get | get (동) | gut (명), jet (명) | ['gut', 'jet'] → [let, bet] |
| 72 | w-back | back (형·부) | bark (명·동), pack (명·동) | ['bark', 'pack'] → [black, bleak] |
| 73 | w-after | after (전) | alter (동), offer (동) | ['alter', 'offer'] → [above, amid] |
| 74 | w-arrest | arrest (명) | attest (동), wrest (동) | ['attest', 'wrest'] → [unrest, arrow] |
| 75 | w-manage | manage (동) | message (명) | ['damage', 'message'] → [damage, massage] |
| 76 | w-someone | someone (대) | somehow (부), sometime (부) | ['somehow', 'sometime'] → [something, nothing] |
| 77 | w-crash | crash (명(수식)) | crass (형) | ['crush', 'crass'] → [crush, clash] |
| 78 | w-hard | hard (형) | heard (동 과거) | ['heard', 'hurt'] → [hardy, hurt] |
| 79 | w-talk | talk (동) | tall (형) | ['tack', 'tall'] → [tack, stalk] |
| 80 | w-sense | sense (명) | since (접·전) | ['since', 'sensor'] → [sensor, scene] |
| 81 | w-most | most (부) | mist (명), must (조동) | ['mist', 'must'] → [least, almost] |
| 82 | w-push | push (동) | pouch (명) | ['pull', 'pouch'] → [pull, pinch] |
| 83 | w-vasodilate | vasodilate (동) | vasopressin (명) | ['vasoconstrict', 'vasopressin'] → [vasoconstrict, vacillate] |
| 84 | w-fit | fit (동) | fat (형) | ['fat', 'fix'] → [fix, fill] |
| 85 | w-cell | cell (명) | call (동), sell (동) | ['call', 'sell'] → [shell, gel] |

### D. 뉘앙스

- **N1** 대량 수액 볼루스 · slider(stop) cue "Her lungs just started to crackle, and her oxygen level…" — 이 상황 환자는 he(2.1·2.2·tagline) → `Nurse: "His lungs just started to crackle, and his oxygen level is falling."`
- **N2** 쇼크 유형 병력 청취 · pair — decoy `the Foley`가 "pass the Foley"(폴리 카테터를 넣다/건네다)로 붙어 정답 둘 → decoy `a deep breath` (전 결합 확인: pass / figure out / started + a deep breath 모두 ✕)
- **N3** 시간당 소변량 모니터 · slider(oliguria) — 이 상황 환자는 she(tagline·4.0) → cue `Foley bag: only 8 mL over the past hour for a 70 kg woman.`, example `She's oliguric — only 8 mL this hour.`
- **N4** 말초·중심 체온차 · swap — 선택지 `distal perfusion deficit`를 넣으면 "…because distal perfusion deficit is down"(결손이 줄었다)이 되어 **뜻이 거꾸로**입니다. swap은 같은 뜻의 말투 차이여야 함 → option·notes 키를 `distal extremity perfusion`으로(notes 내용 "더 어렵고 차가운 말이라 겁만 줄 수 있어요" 그대로). swap `ko`("발이 차가운 건 그쪽으로 가는 피가 줄었기 때문이에요")는 바꾼 문장의 뜻과 맞음
- **N5** 분포성 쇼크 초기 소생 · slider(pressor) — scale `[more fluids, a pressor, a diuretic]`는 약함→강함 척도가 아니라 서로 다른 처치 셋이라 slider가 아님 → words `[w-hypotensive]`, cue `Colleague: "Her MAP is 48 after two liters, and her knees are mottled."`, scale `[borderline, hypotensive, profoundly hypotensive]`, answerAt 2, why `MAP가 목표(대개 65) 바로 아래면 borderline, 65 아래로 머물면 hypotensive, 50 아래로 떨어지고 무릎에 얼룩(모틀링)까지 보이면 profoundly hypotensive예요. 정도를 수치와 함께 말해야 승압제 결정이 빨라져요.`, example `She's profoundly hypotensive — MAP 48 after two liters.` / exKo `심한 저혈압이에요 — 2리터를 주고도 MAP 48이에요.`
- **N6** 폐색성 쇼크 인지 · context(decompression) fix "We put a small needle into his chest…" — **사실**(위 4) → `We put a needle into his chest to let the trapped air out so his lung can open up.`
- **N7** 승압제 시작 시점 · pair — decoy `a Foley bag`이 "recommend a Foley bag"으로 붙음 → decoy `off the monitor` (recommend / ask / respond + off the monitor 모두 ✕)
- **N8** 산-염기 교정 · slider(acidosis) example "That's a mild acidosis, nothing dramatic." — **잘못된 안심**(위 5) → example `That's a mild acidosis, but let's keep watching the trend.` / exKo `경미한 산증이지만 추세는 계속 지켜봐요.`
- **N9** 심장압전 · 성별(S30과 같이) — slider cue `Nurse: "Her heart sounds are faint, as if I'm hearing them through a pillow."`, slider example `Her heart sounds are muffled, and her neck veins are up.`, context(tray) fix `…to drain the fluid around her heart.`
- **N10** 긴장성 기흉 응급 감압 · context(needle) — **사실**(위 4) → fix `We put a needle into his chest to let the trapped air out.`, why의 "가슴에 가는 바늘을 넣어" → "가슴에 바늘을 넣어"
- **N11** 소생 목표와 무의미성 갈등 · context(decision) — 핸드오프 모양이 아님. 장면 1 "The family needs time with this decision"과 장면 3 "You must make a decision now…"는 **뜻이 다름**(시간을 줌 ↔ 지금 결정하라고 재촉) → 장면 3 en `We're awaiting your decision on withdrawal of life-sustaining therapy.`(같은 사실을 차가운 임상어로 가족에게), fix `Take the time you need — we'll talk through this decision together.`, why `의료진끼리는 decision, code status, withdrawal 같은 말로 상황이 간결하게 통해요. 가족 앞에서 withdrawal of life-sustaining therapy처럼 말하면 차갑고 통보처럼 들리니, 시간을 주고 함께 이야기하겠다고 말해요.`

pair 4개 전 결합: 심인성 쇼크 감별(listen/worsen/instead + a sterile tray)과 긴장성 기흉(absent/tension/needle + a fluid bolus)은 정답 짝 말고 성립하는 결합이 없습니다. context 20개는 모두 `word`가 세 장면 `en`에 있고, N11을 뺀 19개는 어색한 장면이 같은 내용을 가족·환자에게 임상어로 말한 곳이라 TASK 9번 모양에 맞습니다. swap 1개는 세 선택지를 이어 읽으면 문법은 맞습니다(뜻은 N4). slider 순서는 N5 말고는 말이 됩니다(볼루스 stop/slow/finish는 행동 강도 순으로 읽힘).

---

## keyPhrase — 사용자 결정 필요 (en을 고치지 않고 보고만 함)
- **K1** 소생 목표와 무의미성 갈등 · 문장 0 "I understand how hard this is, and we're not giving up on him." — 저작자 메모 1. 무의미성 갈등에서 "포기하지 않는다"는 치료를 끝까지 이어 가겠다는 약속으로 들릴 수 있습니다. 같은 상황 tagline("I'm not ready to give up on him")에 응답하는 말이라 "환자를 버리지 않는다(돌봄은 계속)"로 읽히면 성립합니다. 선택지: (a) en 그대로 두고 v46 `why`를 "치료 강도와 상관없이 곁을 지키고 돌봄을 멈추지 않는다는 뜻"으로 좁힘(지금 why가 거의 이 방향) (b) keyPhrase를 `…, and we're not giving up on caring for him.`처럼 고침. ko("저희는 포기하지 않아요")는 en 그대로라면 맞음. (태그 `w-give`는 S33에서 뺌)
- **K2** 젖산 클리어런스 · 문장 1 "We're aiming for at least a 10 percent clearance." — 저작자 메모 6. 10% 클리어런스(대개 2시간)는 연구에서 쓰인 목표치이고 병원마다 프로토콜이 다릅니다(SSC 2021은 젖산 감소를 지표로 쓰라고만 권함). 사실 오류는 아님. 선택지: (a) 그대로 두고 v46 `why`에 "병원 프로토콜에 따라, 보통 2시간 간격으로"를 넣음 (b) 고침
- **K3** 심장압전 · 문장 1 "…prime the monitor." — 프라이밍하는 것은 압력 라인·트랜스듀서이지 모니터가 아닙니다. 현장 구어로 통하기는 함. 선택지: (a) 그대로 두고 why에 "모니터에 연결할 압력 라인을 채워 둔다"로 풀어 줌(w-prime cue는 이미 압력 라인으로 씀) (b) `…and prime the pressure line.`로 고침. order 2번 줄도 같은 표현
- **K4** 다장기부전 · 문장 1 "reassess our goals of treatment" — 미국 병원 표준어는 "goals of care". 틀리지는 않음. ko는 S25로 고침
- **K5** chunks가 구 경계를 끊은 keyPhrase(보고만 함):
  - 대량 수액 볼루스 문장 1 `as it / goes in`
  - 말초·중심 체온차 문장 1 `about your / blood flow`
  - 분포성 쇼크 문장 2 `to a MAP / target`
  - 폐색성 쇼크 문장 2 `for an emergent / needle decompression`
  - 수액 과다와 부족 문장 0 `before the next / bolus`, 문장 2 `without tipping her / into / pulmonary edema`
  - 젖산 클리어런스 문장 1 `for at least / a 10 percent / clearance`
  - 승압제 시작 시점 문장 0 `despite adequate / fluids`
  - 산-염기 문장 0 `with a high / lactate`, 문장 2 `only in / specific situations`
  - 다장기부전 문장 0 `despite maximal / support`, 문장 1 `reassess our goals / of treatment`
  - 대량수혈 문장 0 `the massive transfusion / protocol`
  - 소생 목표 문장 0 `, and we're not / giving up on him`, 문장 1 `about what / he would have / wanted`
  - 쇼크 초기 관류 문장 2 `and update / the team`(약함)
- keyPhrase의 ko 오류는 S14·S16·S17·S25로 고칠 것에 넣었습니다. 그 밖의 keyPhrase 사실 오류는 찾지 못했습니다.

## 저작자 메모 판정
- A 메모 문장 1(20.0 포기하지 않아요): keyPhrase라 K1
- A 메모 문장 2(20.5 어떤 결정이든 지지): 타당 → S35
- A 메모 문장 3(2.5 의사에게 알림 없음): en은 유지, ko만 고침 → S3 (상대가 볼루스를 지시한 사람이고 slider why가 알림을 말함)
- A 메모 문장 4(13.5 him): 타당 → S21
- A 메모 문장 5(16.4 순서): 타당, 환자 안전 → S28
- A 메모 문장 6(12.1 10%): keyPhrase라 K2
- A 메모 한국어(5.3, 12.0): 타당 → S6·S16
- A 메모 "정리하지 않고 둔 것": w-cause는 S23으로 반쪽 태그를 뺌, w-eye는 W1로 구 단위로, compressions는 W7(일관성). vitals·breathing·running·packed·MAP·IM·pH·CO2는 그대로 두는 데 동의
- B 메모는 B 범위(v46 필드)라 판정하지 않음. 다만 B 메모가 꼽은 7.0·7.4·16.4·19.4는 이 목록의 S9·S28 등과 겹치니 B 수정 때 새 문장 기준으로 다시 씀

## changes-icu-shock.yaml 판정
word-remove 21개(all·any·body·doctor·family·good·hand·have·hour·just·know·make·minute·morning·name·nothing·three·time·too·up·would)는 공통 쉬운 단어 목록이거나 가르칠 값이 없는 기능어라 타당합니다. 헤드워드를 원형으로 바꾼 13개(vasodilate·deviate·develop·tip·clear·aim·remain·respond·fix·fail·muffle·chart·feel, foot·leg·lip)와 ko 가름 13개(document/chart, update/flag, cool/cold, value/number, target/goal, fall/drop, breath, set/prime, stat, adequate, start)도 타당합니다. 놓친 것은 W1~W8과 문장 S9·S19·S21·S28·S30·S31·S35입니다.
선택(점수에 넣지 않음): look·give·tell·want·talk·think·ask·get·take·need처럼 간호사가 이미 아는 동사가 여럿 남았지만, 0.3·3.5·20.1처럼 그 말 하나만 태그한 문장이 있어 빼면 대신 태그할 말이 없습니다. 이번에는 두는 쪽이 낫습니다.

## 종합
고칠 것 **145건**(문장 S 35 · 단어 W 8 · 단어 필드 D 6(D1·D3·D5·D6·D7·D8; D2·D4는 품사 표와 겹쳐 뺌) · 품사 표 85 · 뉘앙스 N 11 — 품사 표는 한 줄을 1건으로 셈). 그중 **환자 안전 3건**(S28 대량수혈 순서 · S9 처방 없는 승압제 시작 · N8 잘못된 안심). 사실 오류 3건(S31, N6·N10)도 함께 고쳐야 합니다. 고치고 K1~K3을 결정하면 내보내도 됩니다. en을 바꾼 S9·S19·S21·S28·S30·S31·S35와 ko를 바꾼 문장은 v46 필드(B 범위)를 새로 써야 하고, S35는 order 4번 줄도 같이 바꿔야 합니다.
