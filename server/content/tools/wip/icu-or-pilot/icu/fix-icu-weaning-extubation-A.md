# fix — icu-weaning-extubation (A 검토)

범위: v45 절 1~7, 기계적 전수 확인(pair 전 조합·chunks 전수·distractorsEn 품사·swap 이어 읽기), v46 7번(context 핸드오프 모양·swap `ko`), 저작자 메모 A·B의 문장 지적.
대상: 단어 175개, 뉘앙스 42문항(slider 15·pair 6·context 15·swap 6), 문장 126개(base와 문장 차이 없음).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 대부분 철자·소리·분야가 닮아 좋음. 품사가 다른 오답 7건(swallow·critical·gentry·deploy·loose·maternal·alarm/alter, beside) |
| 2 | distractorsKo·길이 | 4 | 길이 규칙(1.25배·3자)은 175개 전부 통과. 동의어 오답은 없음. 품사가 어긋난 ko 오답 2건(경보음·모성의), w-stat/w-immediately ko가 같음 |
| 3 | cue | 4 | 정답 영어나 약어를 드러낸 cue는 없음. w-pause의 cue("끄지 않고 잠깐 세워")는 동작을 거꾸로 읽게 함 |
| 4 | chips/decoyChips | 4 | 형태소 단위로 잘 잘렸음. w-strength `streng/th`만 어색함(경미) |
| 5 | 뉘앙스 사실 정확성 | 3 | SAT 실패 때 절반 용량으로 재개(ABC 프로토콜) ✓, 커프 누출이 없으면 상기도 부종을 의심 ✓, 예방 NIV 후보(고령·COPD·장기 삽관) ✓, stridor가 조용해지는 것은 거의 막혔다는 신호 ✓. 다만 S10 context가 "reintubation failure"를 정식 용어로 가르침(틀림), S9 context는 어색한 장면이 사실과 다른 문장, S6 context fix는 아직 감별 중인 원인을 단정함(잘못된 안심) |
| 6 | 뉘앙스 설계 | 3 | slider 5장이 유의어 강도가 아니라 행동·장치·범주 저울(S2·S8·S10·S12·S17). S10은 cue에 답이 그대로 있고, S17은 답이 둘. S15 cue("barely see his chest move")는 '거의 막힘'과 '완전히 막힘'의 답이 둘. pair에 두 번째 정답이 되는 조합 2건(low pressors, pull his vitals) |
| 7 | v44 단어·문장(결정 11) | 3 | 16건은 대체로 타당함. 다만 w-deteriorate ko를 고치지 않았고, w-fail example 뜻이 어긋나며, w-vent ko가 뜻을 담지 못함. 공통 쉬운 단어 w-family가 남아 있음. 발관 실패에 rescue NIV, "HFNC keeps airway open", "하루 더 기다린다"를 간호사가 정하는 듯한 문장 같은 문장 흠이 있음 |

## 사실 오류·심각한 문제

1. **S17 발관 직후 호흡부전 급변 문장 3** "He's alert and his airway looks manageable, so let's try rescue NIV.": 발관 뒤 이미 생긴 호흡부전에 rescue NIV를 쓰는 것은 ERS/ATS 2017이 권하지 않습니다(재삽관이 늦어져 사망률이 오른다는 근거, Esteban 2004). 고탄산성 COPD 같은 선별된 환자만 예외입니다. 간호사가 조건 없이 "해 보자"고 정하는 문장이라 학습자가 '발관 실패엔 NIV 먼저'로 배울 수 있습니다. → 고칠 것 S-1
2. **S10 context**: 장면 en "risk factors for reintubation failure"와 why "reintubation failure는 의료진끼리의 정확한 말": 정식 용어는 **extubation failure**이고, "reintubation failure"는 틀린 말을 정답처럼 가르칩니다.
3. **S6 context fix** "You're breathing fast because you're nervous…": 같은 상황이 심장 원인을 아직 감별하는 중인데 fix가 원인을 불안으로 단정합니다. why("단정하듯 던지지 말고")와도 어긋나고, 환자에게 잘못된 안심을 줍니다.
4. **S9 context**: 어색한 장면 "because he's failing extubation"은 듣는 사람이 맞지 않는 것이 아니라 **사실이 틀린** 문장입니다(예방 마스크 상황). context 설계(같은 뜻·안 맞는 자리)를 어깁니다.
5. **S8 문장 3** "The high-flow cannula keeps his airway open": HFNC는 데우고 가습한 고유량 산소와 약한 양압을 주는 장치입니다. 기도를 열어 두는 장치가 아니므로 가족에게 틀린 설명이 됩니다. → 고칠 것 S-2
6. **S3 문장 5** "I'll tell the doctor if the leak is small, so we can wait a day." 및 ko "하루 더 기다릴 수 있게 할게요": 발관을 미룰지는 의사·팀이 정합니다. 누출이 작으면 스테로이드 투여나 재평가를 함께 판단합니다. 간호사가 미룸을 정하는 것처럼 읽힙니다. → 고칠 것 S-3

## 고칠 것

### 단어 (v45 필드)

- W-1 · w-criterion · distractorsEn · `critical`이 형용사(정답은 명사) · `[critique, crisis]`로 바꾸기. distractorsKo `[비평, 위기]`는 그대로 맞음
- W-2 · w-swollen · distractorsEn · `swallow`가 동사(정답은 과거분사형 형용사) · `[swallowed, bruised]`. distractorsKo `[삼킨, 멍든]`은 그대로
- W-3 · w-bedside · distractorsEn · `beside`가 전치사 · `[bedpan, bedrest]`, distractorsKo `[침상 변기, 침상 안정]`. `beside`는 decoyChips에 더하기 → `[bad, sigh, beside]`
- W-4 · w-gentle · distractorsEn · `gentry`가 명사이고 distractorsKo `일반적인`과도 안 맞음 · `gentry` → `general`
- W-5 · w-delay · distractorsEn · `deploy`가 동사(헤드워드는 이제 명사 delay) · `[relay, decay]`, distractorsKo `[중계, 감쇠]`
- W-6 · w-lose · distractorsEn · `loose`가 형용사(브리프가 decoyChips로 보내라고 한 짝이고, 이미 decoyChips에 있음) · `[loosen, load]`, distractorsKo `[느슨하게 하다, 싣다]`
- W-7 · w-material · distractorsEn/Ko · `maternal`·`모성의`가 형용사 · `[manual, matter]`, distractorsKo `[설명서(매뉴얼), 문제(사안)]`
- W-8 · w-alert · distractorsEn/Ko · `alarm`(명사)·`alter`(동사), `경보음`(명사) · `[alarmed, altered]`, distractorsKo `[놀란, 의식이 달라진]`
- W-9 · w-stat · ko·오답 · ko `즉시`가 w-immediately와 같음. distractorsEn `stay/stack`은 동사·명사 · ko `즉시(응급)`, distractorsEn `[PRN, BID]`, distractorsKo `[필요할 때, 하루 두 번]`(길이 6/4/4 통과). ko를 바꾸므로 changes에 `{kind: word, id: w-stat, fields: [ko]}` 적기
- W-10 · w-pause · cue · "점적을 끄지 않고 잠깐 세워 두는"은 멈추지 않는다는 뜻으로 읽힘 · "진정제 점적을 아주 끊지는 않고 잠깐 멈춰 두는 일 — 매일 아침 얼마나 깨는지 볼 때"
- W-11 · w-strength · chips · `streng/th`는 형태소가 아님(경미) · `[[strength]]` 한 조각, 또는 `[[stren, gth]]`보다 한 조각이 나음

### 뉘앙스

- N-1 · S2 SBT 중 호흡양상 관찰 · slider · 행동 저울(keep watching / call the doctor / stop the trial)이라 유의어 강도가 아님 · 아래로 교체
  - words `[w-effort, w-distress]`
  - cue `Colleague: "His rate is 28, but he's breathing easily — no neck muscles, sats holding."`
  - scale `[unlabored, labored, in distress]`, answerAt 0
  - why "호흡 노력은 unlabored(편안함) → labored(힘듦, 보조근 사용) → in distress(얼굴과 몸 전체로 괴로움이 드러남)로 올라가요. 호흡수가 28이어도 노력이 편해 보이면 unlabored라고 따로 말해야, 듣는 사람이 수치 하나로 시험을 멈추지 않아요."
  - example "Respirations are unlabored at a rate of 28." / exKo "호흡수 28, 호흡은 편안해요."
- N-2 · S10 재삽관 위험 평가·소통 · slider · cue("we're staying closer")에 답이 그대로 있고 행동 저울임 · 아래로 교체
  - words `[w-reintubation, w-closely]`
  - cue `Family: "Is he going to need the tube again?" — two risk factors, but doing well so far.`
  - scale `[might need it, is likely to need it, will need it]`, answerAt 0
  - why "위험인자가 있어도 지금 잘 지내고 있으면 might(그럴 수도 있음)가 사실에 맞아요. is likely to는 가능성이 더 크다는 판단이고, will은 확정이라 가족에게 사실보다 무겁게 들려요. 고위험은 '더 가까이 지켜본다'는 뜻이지 '실패한다'는 뜻이 아니에요."
  - example "He might need the tube again, so we're watching him closely." / exKo "튜브가 다시 필요할 수도 있어서 세심히 지켜보고 있어요."
- N-3 · S12 기관절개 전환 시점 논의 · slider · failure/setback/planned step은 강도가 아니라 범주이고, 가족이 물은 상황에서는 "a setback"도 사실로 맞을 수 있음 · 아래로 교체
  - words `[w-tracheostomy, w-comfortable]`
  - cue `Doctor: "Most patients find a trach easier to tolerate than the tube in the mouth."`
  - scale `[sometimes, usually, always]`, answerAt 1
  - why "대부분의 환자에게 맞는 말이면 usually예요. always는 예외를 지워 약속처럼 들리고, sometimes는 실제 장점을 깎아요. 가족에게 좋은 점을 말할 때도 사실의 강도를 맞춰요."
  - example "A tracheostomy is usually more comfortable than the tube through his mouth." / exKo "기관절개가 보통 입으로 넣는 튜브보다 더 편안해요."
- N-4 · S17 발관 직후 호흡부전 급변 · slider · 행동 저울이고 답이 둘("call the physician"도 맞음) · 아래로 교체
  - words `[w-deteriorate]`
  - cue `Two minutes after extubation: SpO2 78 and dropping fast, gasping, can't speak.`
  - scale `[slowly worsening, deteriorating, crashing]`, answerAt 2
  - why "slowly worsening은 시간을 두고 나빠지는 것, deteriorating은 분명히 악화되는 중, crashing은 몇 분 안에 무너지는 상태를 말하는 의료진 구어예요. crashing이라고 하면 듣는 사람이 바로 침상으로 와야 한다는 걸 알아요. 발관 직후 이런 모습이면 지체 없이 도움을 불러요."
  - example "He's crashing — I need help in here now." / exKo "급격히 무너지고 있어요, 지금 여기로 와 주세요."
- N-5 · S8 slider(nasal cannula / high-flow / NIV mask) · **유지**: 유의어 저울은 아니지만 산소 지원 강도의 사다리로 사실이 맞고 답이 하나뿐임. 바꾸지 않음. 나머지 slider 10장(S0·5·6·9·11·13·15·16·18·20)은 강도 저울로 적합
- N-6 · S15 상기도 부종 stridor · slider cue · "I can barely see his chest move"면 '거의 막힘'도 답이 됨 · cue를 `RN: "The stridor was loud a minute ago. Now he's silent, his chest isn't rising, and I can't feel any air at his mouth."`로, why의 "가슴 움직임까지 거의 없으면"을 "가슴이 오르지 않고 입에서 공기가 느껴지지 않으면"으로
- N-7 · S1 이탈 준비도 스크리닝 · pair · `low` + `pressors`("on low pressors")도 ICU 구어로 성립해 정답이 둘 · 왼쪽 `low`를 `a low`로(`a low oxygen requirement`는 맞고 `a low pressors`·`a low commands`는 비문)
- N-8 · S7 진정 중단 안전 수행 · pair · `pull` + `his vitals`("pull his vitals" = 모니터에서 활력징후를 뽑다)가 구어로 성립 · 짝 `[watch, his vitals]`을 `[watch, for agitation]`으로, words의 `w-vitals`를 `w-agitation`으로(S7 문장 1·4에 있음), why의 "watch his vitals로 활력징후를 보며"를 "watch for agitation으로 초조해지는지 보며"로
- N-9 · S10 context · 장면 3 en `He has several risk factors for reintubation failure.` → `He has several risk factors for extubation failure.`, why의 `reintubation failure`도 `extubation failure`로(심각 2)
- N-10 · S9 context · 어색한 장면이 사실과 다름 · 장면 3 en을 `We placed him on prophylactic NIV given his high reintubation risk.`로(뜻은 같고 가족에게 맞지 않는 임상어), fix는 그대로. why: "prophylactic NIV, reintubation risk는 의료진끼리의 정확한 말이지만 가족에게는 무엇이 잘못된 것처럼 들려요. 가족에게는 다시 튜브가 필요하지 않도록 돕는 예방 장치라고 쉬운 말로 말해요."
- N-11 · S9 context · 장면 1 `he's leaking by the nose`가 부자연스러움 · `he's leaking at the bridge of his nose`
- N-12 · S6 context · fix가 원인을 단정함(심각 3) · fix를 `Feeling nervous can make you breathe faster — we're checking everything to be sure.`로
- N-13 · S8 swap · notes의 `warm oxygen in his nose` · "따뜻하고 많은 양의 산소라는 특징도 담겨요"는 선택지에 없는 말 · "따뜻한 산소라는 특징도 담겨요"로
- N-14 · S14 pair · words에서 `w-family` 빼기(D-1과 함께, V15)

### 문장 (메모 A·B 지적, keyPhrase 아님 — 고칠 것)

en·ko를 바꾸면 **그 문장의 `distractorsKo` 둘, `why`, `blank`(answer·options·before/after), `decoy`도 새 문장에 맞춰 다시 쓰세요.** changes에 `{kind: sentence, situation, index, fields: [en, ko, chunks, words]}`를 적습니다.

- S-1 · S17 발관 직후 호흡부전 급변 · 문장 3
  - en `He's alert and his airway looks manageable, but NIV shouldn't delay reintubation.`
  - ko `각성돼 있고 기도도 다룰 만해 보이지만, NIV 때문에 재삽관이 늦어지면 안 돼요.`
  - chunks `["He's alert", "and his airway looks manageable", ", but NIV", "shouldn't delay", "reintubation", "."]`
  - words `[w-alert, w-airway, w-manageable, w-niv, w-delay, w-reintubation]`. S17의 서로 다른 단어 수는 그대로 이상 유지
- S-2 · S8 발관 후 HFNC 전환 관리 · 문장 3
  - en `The high-flow cannula helps him breathe without needing the tube.`
  - ko `고유량 캐뉼라가 튜브 없이도 숨 쉬는 걸 도와줘요.`
  - chunks `["The high-flow cannula", "helps him breathe", "without needing", "the tube", "."]`
  - words `[w-highflow, w-breathe, w-tube]`. w-airway가 빠져도 w-breathe가 들어와 S8은 11개 유지
- S-3 · S3 발관 전 커프리크 확인 · 문장 5
  - en `If the leak is small, I'll let the doctor know before we extubate.`
  - ko `새는 정도가 작으면 발관 전에 의사에게 알릴게요.`
  - chunks `["If the leak is small", ", I'll let", "the doctor know", "before we extubate", "."]`
  - words `[w-leak, w-extubate]`. why에 "발관을 미룰지, 스테로이드를 줄지는 의사·팀이 정하고 간호사는 결과를 알린다"는 역할을 담기
- S-4 · S7 진정 중단 안전 수행 · 문장 5 · "getting restless"만으로 진정제를 다시 시작하는 것은 SAT 실패 기준(지속되는 초조·불안, 호흡수 >35, SpO2 <88, 부정맥 등)보다 낮음. 가벼운 안절부절은 통증·섬망을 먼저 봄
  - en `He's agitated and pulling at his lines — I'll restart sedation at half dose.`
  - ko `초조해하며 라인을 잡아당기고 있어서 절반 용량으로 진정제를 재개할게요.`
  - chunks `["He's agitated", "and pulling at his lines", "— I'll restart", "sedation", "at half dose", "."]`
  - words `[w-pull, w-line, w-restart, w-sedation, w-halfdose]`. B가 이 문장 blank를 `restless`로 옮겼으니 blank를 다시 정해야 함(B의 안전 메모대로 용량·약 자리는 피하기)

### chunks (keyPhrase 아님 — 고칠 것)

- C-1 · S4 문장 3 · `the oxygen / flow meter`가 복합명사를 끊음 · `["Let's double-check", "the oxygen flow meter", "before we start", "."]`
- C-2 · S10 문장 3 · `and he was / intubated`가 수동태를 끊음 · `["His cough", "is weak", ", and he was intubated", "a long time", "."]`
- C-3 · S17 문장 4 · `past`가 홀로 떨어져 전치사와 목적어를 끊음 · `["If he", "keeps deteriorating", "past the time limit", ", we reintubate", "."]`
- C-4 · S20 문장 5 · `if this doesn't / clear`가 조동사와 동사를 끊음 · `["We'll prepare", "to reintubate immediately", "if this", "doesn't clear", "."]`

## 결정 11 (v44 단어·문장)

저작자의 changes 16건 판정: watch·deflate·fail·seal·increase·cause·spike·reorient·obstruct·delay의 원형화, comeoff·calm·clear·support의 ko는 타당합니다. 아래는 고칠 것입니다.

- D-1 · **w-family**(공통 쉬운 단어) · S14 문장 0·4의 `words`에서 `w-family` 빼기, S14 pair `words`에서도 빼기(N-14), 은행에서 지우기(`word-remove`). S14의 서로 다른 단어는 13 → 12(tonight도 빼면 11)로 V3 통과. changes에 `word-remove` 1건과 `sentence`(fields: [words]) 2건 적기. **V3 확인 필수**
- D-2 · **w-tonight** · 목록의 today·night와 같은 급의 쉬운 말 · S10 문장 2·5, S14 문장 3의 `words`에서 빼고 은행에서 지우기(S10 14→13, S14 →11)
- D-3 · **w-team·w-stop·w-heart·w-strong·w-reason** · 간호사가 이미 아는 A1 낱말 · 태그 빼고 은행에서 지우기:
  - team: S12 문장 5, S13 문장 2, S15 문장 1·3, S16 문장 3, S18 문장 2·5. **S12는 9 → 8로 하한**이라 w-plan은 S12에서 빼지 말 것
  - stop: S2 문장 2(12→11)
  - heart: S19 문장 1·4, **S19 pair words에서도 `w-heart` 빼기**(12 유지 이상)
  - strong: S11 문장 4(11→10)
  - reason: S13 문장 2
  - 나머지 후보 plan·warm·side·turn·chart는 **유지**합니다. plan은 S12 slider·S18 context가, warm은 S8 swap이 가리키고, `turn … on his side`는 구로 가르칠 값이 있습니다. 바꾸고 나면 V3·V15를 다시 돌리세요
- D-4 · **w-deteriorate** · en을 원형으로 바꾸고 ko(`악화되는`)는 그대로 둠 · ko를 `악화되다`로 바꾸고 changes의 fields에 `ko` 추가
- D-5 · **w-fail** · ko는 `실패하다`인데 example이 S9 문장 0("he's failing" = 상태가 나빠지다, exKo도 그렇게 옮김) · example을 S18 문장 0 `He's failed repeated trials, so we need a longer-term weaning plan.` / exKo `반복해서 시험에 실패해서 장기적인 이탈 계획이 필요해요.`로 바꾸고 changes fields에 `example` 추가
- D-6 · **w-vent** · 바꾼 ko `벤트(구어)`는 음차일 뿐이라 뜻을 고르는 문제에서 뜻을 알려 주지 않음 · `인공호흡기(줄임말)`. w-ventilator `인공호흡기`와도 구분됨
- 남긴 활용형 판정: rising·prolonged·repeated·nebulized·aspirated·intubated는 형용사로 쓰인 분사, swelling은 명사(`the swelling`)라 그대로 둡니다. tiring·narrowing·moving은 진행형 덩어리(`he's tiring`, `is swelling and narrowing`, `getting him moving`)로 가르치는 값이 있어 고치지 않습니다(확실하지 않음)

## keyPhrase 문장 — 사용자 결정 필요 (en은 바꾸지 않음)

- K-1 · S17 발관 직후 호흡부전 급변 · 문장 0 `If he's alert with a manageable airway, we can trial rescue NIV briefly.` · 발관 뒤 이미 생긴 호흡부전에 rescue NIV를 쓰는 것은 일반적으로 권하지 않습니다(고탄산성 COPD 등 선별된 환자만 짧게). 조건("alert", "manageable airway", "briefly")이 붙어 있고 문장 1("계속 악화되면 지체 없이 재삽관")·2(시간 제한)와 짝을 이뤄 균형은 있습니다. 상황 tagline·goals도 구조 NIV 판단을 전제로 합니다. 선택지는 (a) 그대로 두고 S-1로 균형 잡기, (b) keyPhrase를 `…we can trial NIV briefly if the physician agrees.`처럼 바꾸기(사용자·임상 검토 필요)입니다
- 보고만 하는 chunks(keyPhrase): S2 문장 0 `his rate, effort, / and oxygen`, S3 문장 2 `once`가 홀로, S11 문장 0 `after being / on the vent`, S16 문장 1 `the tube, laryngoscope, / and suction`, S17 문장 1 `But if he keeps / deteriorating`

## 기계적 전수 확인 결과 요약

- pair 6개 × (오른쪽 전부 + decoys) 전 조합: 두 번째 정답이 되는 조합은 S1 `low pressors`, S7 `pull his vitals` 2건입니다(N-7·N-8). S4 `high-flow suction`은 쓰지 않는 말이라 문제없습니다. S3·S14·S19는 깨끗합니다
- chunks 126문장 전수: keyPhrase가 아닌 문장의 구 경계 끊김 4건(C-1~4), keyPhrase 5건은 보고만 합니다
- distractorsEn 품사 불일치: W-1~W-9
- swap 6개 × 선택지 3: 모두 문법이 맞습니다. swap `ko` 6개는 바꾼 문장의 뜻과 맞습니다
- context 15개: `word`가 세 장면 en 모두에 있습니다. 어색한 장면이 '같은 뜻·안 맞는 자리'가 아닌 것은 S9 1건(N-10)입니다

## 종합

고칠 것 38항목: 단어 11, 뉘앙스 13(N-5는 유지 판정), 문장 4, chunks 4, 결정 11 6항목(D-1~D-3에서 쉬운 단어 7개를 지움). 사용자 결정 1건(K-1).
사실 오류(extubation failure 용어, 원인 단정 fix, rescue NIV·HFNC 문장, 커프 누출 뒤 결정 주체)를 고치고 slider 4장을 바꾸면 내보내도 됩니다.
