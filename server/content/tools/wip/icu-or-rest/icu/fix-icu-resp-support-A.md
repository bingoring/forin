# icu-resp-support — A 검토 (v45 1~7 + 기계적 전수 + context 모양·swap ko)

대상: `icu-resp-support.yaml`(단어 188 · 상황 21 · 문장 126 · 뉘앙스 42 = slider 14 · pair 7 · context 18 · swap 3).
비교: `base-icu-resp-support.yaml`, `changes-icu-resp-support.yaml`(변경 70건), `in-icu-resp-support.json`, `notes-icu-resp-support-A.md`·`-B.md`.
스크립트로 전부 뽑아 본 것: 단어 188개 전 필드(길이 1.25배·3자 규칙 — distractorsEn·distractorsKo 전부 통과), cue에 `ko`·정답 영어가 든 것,
문장 126개 chunks, pair 7개 전 결합, swap 3개 × 선택지 9줄, context 18개 세 장면의 `word` 포함(18/18), keyPhrase 26문장 대조(누락 없음),
단어별 사용 문장(헤드워드·태그 뜻 확인), decoyChips 전부(비속어 관점 포함).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 2 | 소리·철자가 닮은 오답은 고르게 좋음. 그러나 **품사가 다른 오답 45개 단어**(표 W-1), 정답으로도 맞는 오답 4(`percent`·`re-adjust`·`respirator`·`signal`)와 너무 가까운 것 2(`retch`·`suppressed`) |
| 2 | distractorsKo·길이 | 4 | 길이 규칙 전부 통과. 품사가 어긋난 오답 뜻 2(`간호`·`혼자`), 띄어쓰기로 정답이 드러나는 것 1(`최소로하다`) |
| 3 | cue | 4 | 정답 영어·약어 노출 없음. `ko`를 되풀이한 cue 6개(oxygen·listen·start·respond·match·flag) |
| 4 | chips/decoyChips | 4 | 대체로 형태소 단위. 뜻 없는 한 글자 decoy(`e`·`o`·`i`·`a`), 형태소 아닌 자르기 `str+ong`·`a+gainst`. **비속어·불쾌한 조각 없음**(decoy 전부 확인 — `dang`·`sack`·`mast`·`doe` 정도로 문제없음) |
| 5 | 뉘앙스·문장 사실 | 3 | 산소 단계(NC→단순→NRB), ROX 정의, NIV 금기(의식·분비물·협조), 흡인 예방(HOB·위 감압·구토 시 마스크 제거), 과산소, 대량 각혈 체위(출혈 쪽 아래)는 맞음. **안전 3**: 호흡정지 임박을 '심정지'로 다루게 하는 문장, "not breathing → 바로 심폐소생" why, 출혈 쪽 폐를 '보호'한다는 문장. 그 밖에 HFNC FiO2가 유량에 '맞춰' 설정된다, BiPAP이 날숨을 '도와준다' |
| 6 | 뉘앙스 설계 | 4 | context 18개 모두 핸드오프 모양(같은 뜻·✕ 장면은 전부 환자/보호자에게 임상어, `word` 세 장면 모두 포함). pair 정답 둘 1(CPAP: `push the call light`), context `ko` 품사 오류 1(target), swap `ko`가 문장 일부를 빠뜨린 것 1 |
| 7 | v44 정리(결정 11) | 3 | 쉬운 단어 14개 삭제·ko 5개 변경은 대체로 타당. 그러나 `relief`→`안도감`은 틀린 뜻, 남은 쉬운 말 `need`·`start`·`slow`·`nose`, 부사가 묶인 형용사 헤드워드 2(`dangerous`·`aggressive`), 틀린 ko 2(`rate` 속도, `fit` 핏), 뜻이 다른 태그 4. 구 경계를 끊은 chunks 5문장(keyPhrase 별도 4) |

## 사실 오류·심각한 문제

1. **`NIV 지연 호흡정지 임박` 문장 3 "His breathing is barely there now, so we treat this as an arrest." / ko "지금 호흡이 거의 없어서 심정지로 다뤄요."** — 안전. 숨이 '거의 없는' 환자(맥 있음)는 **호흡정지**로 보고 백밸브마스크 환기를 합니다. "심정지로 다룬다"는 맥이 있는 환자에게 흉부압박을 시작하라는 뜻으로 읽힙니다. keyPhrase 아님 → 고침(S-1).
2. **`NIV 지연 호흡정지 임박` slider why "not breathing은 숨이 없는 상태라 바로 심폐소생을 시작해요."** — 안전. AHA BLS/ACLS는 무호흡·헐떡임이면 **맥박부터 확인**하고, 맥이 있으면 구조 호흡(환기), 없으면 CPR입니다. 고침(S-2).
3. **`대량 각혈 동반 호흡부전` 문장 3 "We're turning him so the bleeding lung stays down and protected."** — 체위의 목적이 거꾸로입니다. 출혈 쪽을 아래로 두는 것은 **건강한 폐로 피가 넘어가지 않게** 하려는 것이지 출혈 쪽 폐를 보호하려는 것이 아닙니다(같은 상황 keyPhrase 문장 0이 바로 "to protect the good lung"). keyPhrase 아님 → 고침(S-3).
4. **`HFNC 설정·적용` 문장 3 "…the oxygen percentage is set to match it."** — FiO2는 유량에 '맞추는' 값이 아니라 목표 SpO2에 맞춰 따로 적정합니다. 고침(D-2).
5. **`고탄산 호흡부전 BiPAP` 문장 4 "…and helps you breathe out."** — EPAP은 날숨을 '도와주지' 않습니다(기도를 열어 두어 들숨 일을 줄임). 고침(D-3).
6. **`심인성 폐부종 CPAP` pair** — decoy `the call light`가 `push`에 붙습니다("push the call light"는 병동 표준 영어). 왼쪽 `ease`도 오른쪽 `fluid out of the air sacs`에 붙습니다("ease fluid out of…"). 정답 둘. 고침(N-1).

저작자 메모 A 판정:
- 심인성 폐부종 CPAP 문장 2 "you'll feel relief soon" — **타당, keyPhrase → 사용자 결정**(K-1).
- 같은 상황 문장 5 "You should feel some relief soon…" — **`en`은 그대로**("should"가 이미 완곡). `ko` "곧 편안해질 거예요"가 단정이라 ko만 고침(K11-5).
- 완화 목적 문장 5 "free of pain" — **타당, 고침**(D-4). 이 상황의 문제는 숨참이라 통증 보장보다 "최대한"이 맞습니다.
- NIV 지연 문장 5 "get him to the bedside kit" — **타당, 고침**(D-1).
- NIV 지연 문장 4 "I'm bagging him now" — **고치지 않음.** "bagging"은 미국 병원 표준 구어. 태그가 cart 하나여도 상황 단어 수는 충분(12개).
- 산소전달장치 문장 3 ko — **타당, 고침**(K11-2).
- 산소 목표 문장 2 "92 to 96" — **그대로.** "For him"으로 한정돼 있고 미국 ICU에서 흔한 목표.
- 대량 각혈 문장 0 "bleeding lung down" — **그대로**(출혈 쪽을 아는 장면). ko 조사 호응만 고침(K11-6, 메모 B와 같음).
- ABG 문장 3 ko에 "동맥" 누락 — **해당 없음.** 지금 ko "손목 동맥에서…"에 이미 있음. 대신 chunks가 `wrist / artery`를 끊음(C-3).
- 흡인 위험 문장 4 `low` 태그(동사 lower) — **타당, 고침**(W11-5).
- hard·work·rate ko — `rate`만 고침(W11-6). hard(부사 "how hard")·work는 그대로.
- `fit` 핏 — **타당, 고침**(W11-7).
- 신체 부위 8개 — `nose`만 뺌(W11-1). lung·wrist·cheek·shoulder·stomach는 가르칠 값이 있어 둠. heart·neck은 판단 보류(빼도 V3 문제없음).
- 슬라이더 2개(ideal/borderline/poor, worrying/dangerous/critical) — 단서가 각각 가운데 칸을 충분히 가리켜 **그대로**.

저작자 메모 B: 상황 16 문장 5 → D-1, 상황 19 문장 0 → K11-6. 나머지는 B 범위.
아래에서 `en`·`ko`를 바꾸는 문장(S-1·S-3·D-1~D-5·C-3·K11-1~6)은 **그 문장의 v46 필드(why·decoy·distractorsKo 둘·blank)를 새 문장에 맞춰 다시** 써야 합니다.

---

## 사용자 결정 필요 — keyPhrase 문장 (`en`은 고치지 않음)

**K-1** `심인성 폐부종 CPAP` 문장 2 "Try to breathe with the machine; you'll feel relief soon." — 호전 시점은 간호사가 보장할 수 없습니다(이뇨·혈관확장 반응에 달림). 대안: "Try to breathe with the machine; you should start to feel some relief soon." ko "기계에 맞춰 숨을 쉬어 보세요, 곧 조금씩 편해지실 거예요". 바꾸면 chunks `Try to breathe / with the machine; / you should start / to feel some relief / soon / .`, v46 필드 다시.

**K-2**(낮음) `면역저하 환자 NIV 선택` 문장 0 "For immunocompromised patients, NIV can avoid ventilator infections." — NIV가 감염을 '피하는' 주어가 아니라 삽관을 피해 VAP를 줄이는 것이고, 최근 RCT(Lemiale 2015 등)는 사망률 이득을 보이지 못했습니다. 대안: "For immunocompromised patients, NIV can help avoid ventilator-associated infections." ko "면역저하 환자에게는 NIV가 인공호흡기 관련 감염을 피하는 데 도움이 될 수 있어요".

**keyPhrase chunks — 구 경계를 끊은 것(보고만):**
| 상황 · 문장 | 지금 chunks | 끊긴 곳 |
|---|---|---|
| 산소전달장치 단계 이해 [1] | We step up / the device / as your oxygen / needs increase | `your oxygen needs` 명사구 |
| ABG 채혈·기초 해석 [2] | The result helps us / fine-tune / your oxygen / support | `your oxygen support` |
| NIV에서 삽관 전환 판단 [0] | His gas isn't improving / and his work / of breathing / is rising | `work of breathing` |
| 심한 고탄산 의식저하 위기 [0] | His depressed consciousness / is from / severe carbon dioxide / narcosis | `carbon dioxide narcosis` |
| (참고) 고탄산 BiPAP [2] | we'll ease / the settings / down | 구동사 `ease … down`(목적어가 끼어 있어 허용 범위) |

---

## 고칠 것 — 안전 (S)

**S-1** `NIV 지연 호흡정지 임박` 문장 3 · 호흡정지를 심정지로(위 심각 1) · en → "His breathing is barely there now, so we treat this as a respiratory arrest." · chunks `His breathing / is barely there now, / so we treat this / as a respiratory arrest / .` · ko "지금 호흡이 거의 없어서 호흡정지로 보고 대응해요." · words [w-breath, w-respiratory, w-arrest] · v46 필드 다시(distractorsKo에 '심정지'·'압박'을 쓰지 말 것).

**S-2** `NIV 지연 호흡정지 임박` · slider · why → "숨이 있지만 겨우 있는 정도(분당 6회·얕음)면 barely breathing — 바로 백밸브마스크로 환기를 도와요. not breathing이면 맥박부터 확인해 맥이 있으면 환기, 없으면 CPR을 시작해요."

**S-3** `대량 각혈 동반 호흡부전` 문장 3 · 체위 목적이 거꾸로(위 심각 3) · en → "We're turning him so the bleeding lung stays down and the good lung stays clear." · chunks `We're turning him / so the bleeding lung / stays down / and the good lung / stays clear / .` · ko "출혈하는 폐는 아래로, 좋은 쪽 폐는 깨끗하게 유지되도록 환자를 돌리고 있어요." · words [w-bleed, w-lung, w-clear] (w-protect 태그 뺌 — 상황 단어 16개 유지) · v46 필드 다시.

## 고칠 것 — 문장 사실·어색함 (D, keyPhrase 아님)

**D-1** `NIV 지연 호흡정지 임박` 문장 5 "…and get him to the bedside kit." — 환자를 키트로 데려간다는 뜻 · en → "Let's get the airway kit to the bedside and secure his airway immediately." · chunks `Let's get / the airway kit / to the bedside / and secure his airway / immediately / .` · ko "기도 키트를 침상 옆으로 가져오고 즉시 기도를 확보해요." · words 그대로 [w-secure, w-airway, w-immediately, w-bedside] · v46 필드 다시(airway가 두 번 → blank는 `bedside`나 `immediately`로).

**D-2** `HFNC 설정·적용` 문장 3 · FiO2를 유량에 맞춘다(위 심각 4) · en → "The flow rate is set first, and then the oxygen percentage is adjusted to your target." · chunks `The flow rate / is set first, / and then the oxygen percentage / is adjusted to your target / .` · ko "먼저 유량을 설정하고, 그다음 목표에 맞게 산소 퍼센트를 조정해요." · words [w-flow, w-oxygen, w-percentage, w-set, w-adjust, w-target] (w-rate·w-match 태그 뺌 — `flow rate`의 rate는 '분당 횟수'가 아님, W11-6과 함께) · v46 필드 다시.

**D-3** `고탄산 호흡부전 BiPAP` 문장 4 · 날숨을 도와준다(위 심각 5) · en → "The BiPAP gives you a push on every breath in and keeps your airways open as you breathe out." · chunks `The BiPAP gives you / a push on every breath in / and keeps your airways open / as you breathe out / .` · ko "BiPAP이 들숨마다 밀어주고 날숨에는 기도가 열려 있게 해줘요." · words [w-bipap, w-push, w-breath, w-airway] · v46 필드 다시.

**D-4** `완화 목적 호흡곤란 관리` 문장 5 "…comfortable and free of pain." — 보장 표현, 그리고 이 상황의 증상은 숨참 · en → "We're giving medication to keep him comfortable and breathing as easily as we can." · chunks `We're giving medication / to keep him comfortable / and breathing / as easily as we can / .` · ko "최대한 편하게 숨 쉬고 편안하시도록 약을 드리고 있어요." · words [w-medication, w-comfortable, w-breath] · v46 필드 다시.

**D-5** `완화 목적 호흡곤란 관리` 문장 4 "…without any tubes." — 비강 캐뉼러도 관이라 보호자가 보는 것과 어긋남 · en → "This gentle oxygen can ease his breathlessness without a breathing tube." · chunks `This gentle oxygen / can ease / his breathlessness / without a breathing tube / .` · ko "이 부드러운 산소가 호흡관 없이도 숨참을 완화해줄 수 있어요." · v46 필드 다시.

## 고칠 것 — 문장 ko (결정 11, keyPhrase여도 ko만은 됨)

ko를 바꾸면 그 문장의 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓰세요.

**K11-1** `HFNC 설정·적용` 문장 4 · "가습기가 이 따뜻한 공기가…" 주어 겹침 · → "가습기 덕분에 이 따뜻한 공기가 기도를 마르게 하지 않아요." (단어 w-humidifier·w-dry·w-airway의 exKo도 같은 문장이면 같이)
**K11-2** `산소전달장치 단계 이해` 문장 3 · "산소 수치가 더 지지가 필요해서" · → "산소 수치에 지금 더 많은 지지가 필요해서 장치를 바꿨어요." (w-switch exKo 같이)
**K11-3** `고탄산 호흡부전 BiPAP` 문장 2(keyPhrase, ko만) · "설정값을 낮춰서 완화할게요" — ease … down은 '서서히 낮추다' · → "호흡이 좋아지면 설정값을 조금씩 낮출게요." (w-setting·w-ease exKo 같이)
**K11-4** `고탄산 호흡부전 BiPAP` 문장 5 · 같은 문제 · → "진정되고 수치가 좋아지면 압력을 조금씩 낮출게요." (w-calm exKo 같이)
**K11-5** `심인성 폐부종 CPAP` 문장 5 · "곧 편안해질 거예요"는 단정, en은 should · → "폐에서 체액이 빠지면서 곧 조금 편해지실 거예요."
**K11-6** `대량 각혈 동반 호흡부전` 문장 0(keyPhrase, ko만) · "출혈하는 폐를 아래로 체위를 잡아줘요" 조사 호응 · → "좋은 쪽 폐를 보호하도록 출혈하는 쪽 폐가 아래로 가게 눕혀 주세요." (w-position·w-bleed exKo 같이)

## 고칠 것 — chunks (keyPhrase 아님)

**C-1** `산소전달장치 단계 이해` 문장 5 · `we can step / back down` 구동사를 끊음 · → `As you improve, / we can / step back down / to a smaller device / .`
**C-2** `호흡노력·보조근 사용 관찰` 문장 3 · `for extra breathing / effort` · → `I'm also checking / your shoulders / and belly / for extra breathing effort / .`
**C-3** `ABG 채혈·기초 해석` 문장 3 · `from your wrist / artery` — 10낱말이라 4조각이 필요해 en을 조금 바꿈 · en → "I'm drawing a small blood sample from the artery in your wrist." · chunks `I'm drawing / a small blood sample / from the artery / in your wrist / .` · ko 그대로 · v46 decoy·blank 확인.
**C-4** `NIV 중 흡인 위험 관리` 문장 3 · `for aspiration / risk` · → `His stomach / looks distended, / so I'm watching / for aspiration risk / .`
**C-5** `면역저하 환자 NIV 선택` 문장 4 · `before we started / NIV` · → `I'm comparing / his numbers now / to how they looked / before we started NIV / .`

## 고칠 것 — 뉘앙스 (N)

**N-1** `심인성 폐부종 CPAP` · pair · 정답 둘(위 심각 6) · → pairs `[[push, fluid out of the air sacs], [reduce, the strain on your heart]]`, decoys `[the lab results]`, words `[w-push, w-strain]`, why "CPAP의 압력이 폐포의 체액을 밀어내고(push), 심장의 부담을 줄여줘요(reduce)." (교차: reduce fluid out of… ✕, push the strain… ✕, push/reduce the lab results ✕)
**N-2** `산소 목표 개별화` · context · `ko` "목표로 하다"(동사)인데 세 장면 모두 명사(`Target SpO2`, `a target SpO2`, `target sat`) · ko → "목표치".
**N-3** `NIV에서 삽관 전환 판단` · swap · `ko`가 첫 문장("I'm calling about Mr. Lee.")을 빠뜨림 · → "이 씨 건으로 전화드렸어요. BiPAP 한 시간 뒤 ABG가 더 나빠졌어요".
**N-4** `ABG 채혈·기초 해석` · swap · `ko`에 주어(혈액가스)가 없음 · → "혈액가스 검사에서 지금 이산화탄소가 너무 많게 나와요".
**N-5** `마스크 불내성 극심 저산소` · slider · example "His oxygen is dangerous right now…"는 어색한 영어(산소가 위험한 게 아님) · → example "This is getting dangerous, so let's prepare for intubation." exKo "점점 위험해지고 있으니 삽관을 준비해요."
**N-6** `완화 목적 호흡곤란 관리` · context · ✕ 장면 `fix` "…we'll keep treating anything that bothers him" — CMO에서 '무엇이든 치료'는 다시 적극 치료로 들림 · → "We're focusing on keeping him comfortable, and we'll keep treating any symptom that bothers him."

(context 18개 모양: `word`가 세 장면 `en` 모두에 있음 18/18, ✕ 장면은 전부 환자·보호자에게 임상어를 쓴 곳, ok 장면과 듣는 사람이 겹치는 것 없음 — 문제없음. pair 나머지 6개 전 결합 판정: 정답 하나뿐. swap 3개 이어 읽기 문법 모두 맞음.)

## 고칠 것 — 단어 v45 필드 (W)

**W-1 품사가 다른 distractorsEn (전부, 바꿀 말 제안 — 길이 규칙 확인함)**

| 단어(문장 속 품사) | 지금 | 품사 다른 것 | 제안 |
|---|---|---|---|
| check (동) | chart, cheek | cheek(명) | chart, choke |
| low (형) | slow, load | load(명) | slow, loud |
| hard (부) | heard, hand | 둘 다(동·명) | hardly, harshly |
| work (동) | walk, word | word(명) | walk, worry |
| rate (명) | race, rare | rare(형) | race, rank |
| warm (형) | warn, worm | 둘 다 | worn, wary |
| strong (형) | string, strange | string(명) | strict, strange |
| effort (명) | effect, afford | afford(동) | effect, export |
| dry (형) | dye, cry | 둘 다 | dim, wry |
| fit (명) | fix, fill | 둘 다(동) | fist, kit |
| edge (명) | ledge, urge | urge(동) | ledge, hedge |
| skin (명) | skim, shin | skim(동) | sink, shin |
| rub (동) | rib, tub | 둘 다(명) | rob, rip |
| device (명) | devise, advice | devise(동) | divider, advice |
| increase (동) | decrease, increment | increment(명) | decrease, encase |
| high (형) | hide, sigh | 둘 다 | huge, light |
| tire (동) | tide, wire | 둘 다(명) | tie, hire |
| result (명) | resolve, consult | 둘 다(동) | remnant, resort |
| wrist (명) | waist, twist | twist(동) | waist, crest |
| move (동) | mode, movie | 둘 다(명) | mope, prove |
| mean (동) | mine, meat | 둘 다 | moan, lean |
| warn (동) | ward, warm | 둘 다 | wane, earn |
| flag (동) | flat, flash | flat(형) | flash, flap |
| trend (명) | tread, tend | tend(동) | tread, trench |
| alert (형) | alter, alarm | 둘 다 | inert, overt |
| poor (형) | pour, pure | pour(동) | pure, proud |
| instead (부) | instant, inside | instant(형) | instantly, inside |
| identify (동) | identity, modify | identity(명) | intensify, modify |
| safe (형) | save, safety | 둘 다 | same, sane |
| build (동, built up) | guild, bold | 둘 다 | bulge, bind |
| calm (동) | calf, palm | 둘 다(명) | claim, cram |
| fluid (명) | fluent, flush | fluent(형) | flute, flush |
| coach (동) | couch, coast | couch(명) | crouch, coast |
| remove (동) | remote, remind | remote(형) | renew, remind |
| fast (부) | fact, last | fact(명) | last, vastly |
| harm (명) | hard, farm | hard(형) | charm, farm |
| target (동) | market, carpet | carpet(명) | forget, budget |
| cause (동) | pause, clause | clause(명) | pause, accuse |
| bedside (명) | beside, bedpan | beside(전치사) | bedtime, bedpan |
| consciousness (명) | conscience, conscientious | conscientious(형) | conscience, conciseness |
| position (동) | possession, portion | 둘 다(명) | petition, partition |
| honor (동) | horror, humor | 둘 다(명; humor는 동사면 '비위 맞추다'로 정답 근처) | hover, hone |
| wish (명) | wash, wise | 둘 다 | dish, wisp |
| focus (동) | locus, forum | 둘 다(명) | fuss, foster |
| comfort (명) | comport, compost | comport(동) | compost, conflict |

(`need`·`start`는 W11-1로 빠지므로 표에서 뺌. `suction`의 section·function은 동사로도 쓰여 둠.)

**W-2 정답으로도 맞거나 너무 가까운 distractorsEn**
- `percentage` · `percent` = 같은 뜻("oxygen percent") → `percentile, parentage`
- `fine-tune` · `re-adjust` = 문장에 넣어도 맞음 → `fast-track, front-load`
- `ventilator` · `respirator` = 미국에서 오래 쓴 동의어 → `incubator, nebulizer`
- `sign` · `signal` = "an early signal you need more help"도 맞음 → `design, sigh`
- `vomit` · `retch` = 헛구역질, 같은 장면에서 정답처럼 들림 → `omit, cough`
- `depressed` · `suppressed` = "suppressed consciousness"도 뜻이 통함 → `depressive, compressed`

**W-3 distractorsKo**
- `physician` `간호`(행위 명사) → `간호사`
- `team` `혼자`(부사) → `가족`
- `max` `최소로하다`·`그대로두다` 띄어쓰기가 정답(`최대로 하다`)과 달라 걸러짐 → `최소로 하다`·`그대로 두다`

**W-4 cue가 ko를 되풀이**
- `oxygen` "벽 산소나 산소통으로…" → "벽 배관이나 통에서 공급해 포화도를 올리는 기본 치료 기체 — 수치가 떨어지면 가장 먼저 거는 것"
- `listen` "청진기를 대고…" → "가슴에 도구를 대고 폐에서 나는 소리에 귀 기울이는 동작"
- `respond` "…반응을 보이는 것" → "마스크를 대고 나서 몸이 나아지는 기색을 보이는지 지켜볼 때"
- `match` "…알맞게 맞추는 것" → "장비 값을 몸이 필요로 하는 양과 꼭 들어맞게 하는 일"
- `flag` "…표시해 두어…" → "수치가 떨어지면 팀이 놓치지 않게 눈에 띄게 알려 두는 일"
(`start`는 W11-1로 빠짐)

**W-5 decoyChips 정리(낮음)** — 한 글자 decoy는 뜻 없는 조각이라 바꿈: `identify`의 `e` → `ad`, `avoid`의 `o` → `ov`, `against`의 `i` → `un`, `emergent`의 `a` → `im`.

## 고칠 것 — 결정 11 (단어·태그)

**W11-1** 쉬운 단어 태그 빼기·은행에서 지우기: `w-need`(8문장), `w-start`(7문장), `w-slow`(1), `w-nose`(1). 모두 공통 쉬운 단어 목록 수준이고, 빼도 상황마다 서로 다른 단어 12개 이상(V3 문제없음, 스크립트 확인). 뉘앙스 `words`에 이 id를 쓰는 문항 없음. changes에 word-remove·sentence(words) 기록.
**W11-2** `w-dangerous` 헤드워드 → `dangerously`(쓰이는 문장은 "dangerously low" 하나뿐) · ipa /ˈdeɪndʒərəsli/ · ko `위험할 정도로` · chips `[[dan, ger, ous, ly]]` · distractorsEn `generously, anxiously` · distractorsKo `적당할 정도로, 충분할 정도로` · cue "수치가 생명을 위협할 만큼 낮다고 강조할 때 쓰는 말" · example "His oxygen is dangerously low." exKo "산소가 위험할 정도로 낮아요." (slider [18]의 scale은 형용사 그대로 둬도 됨)
**W11-3** `w-aggressive` 헤드워드 → `aggressively`(두 문장 모두 부사) · ipa /əˈɡrɛsɪvli/ · ko `적극적으로` · chips `[[ag, gres, sive, ly]]` · distractorsEn `progressively, excessively` · distractorsKo `소극적으로, 수동적으로`.
**W11-4** `w-relief` ko `안도감`(changes의 변경) — 틀린 뜻. 이 주제의 relief는 숨이 편해지는 증상 완화이지 마음의 안도가 아님 · ko → `편해짐` · distractorsKo `답답함, 어지럼` · cue는 그대로 둬도 되나 "숨 막히던 답답함이 풀리는 것"이 더 맞음. changes의 why도 고칠 것.
**W11-5** `NIV 중 흡인 위험 관리` 문장 4 `w-low` 태그 빼기 — 문장은 동사 `lower`(낮추다), 헤드워드는 형용사.
**W11-6** `w-rate` ko `속도` → `분당 횟수`(heart rate·respiratory rate·"His rate is down" 모두 횟수) · distractorsKo `지속 시간, 깊이`. `HFNC 설정·적용` 문장 3(flow rate)의 태그는 D-2에서 뺌.
**W11-7** `w-fit` ko `핏` → `적합도`(마스크 핏 "a good fit"과 "a good fit for NIV" 둘 다) · exKo "적합도가 좋으면 가장자리로 바람이 새지 않아요."
**W11-8** 뜻이 다른 태그 빼기: `HFNC 설정·적용` 문장 5 `w-adjust`("your body adjusts" = 적응하다, 헤드워드는 조정하다), `마스크 불내성 극심 저산소` 문장 1 `w-move`("we move to intubation" = 넘어가다). 두 상황 단어 수 16·15로 충분.

changes-icu-resp-support.yaml 판정: 쉬운 단어 14개 삭제·`setup`/`clear`/`control`/`suction` ko 변경·`rise`/`fall`/`bleed` 원형화는 **타당**. `relief` ko 변경만 **틀림**(W11-4).

---

## 종합

고칠 것 93건(안전 3: S-1·S-2·S-3) = S 3 · D 5 · K11 6 · C 5 · N 6 · W-1 45 · W-2 6 · W-3 3 · W-4 5 · W-5 1 · W11 8. 사실 문제는 NIV 지연 상황(호흡정지↔심정지, CPR why)과 대량 각혈 체위 목적에 몰려 있고, 나머지는 품사가 다른 영어 오답 45개가 가장 큰 덩어리입니다.
위 목록을 반영하고 바뀐 문장의 v46 필드를 다시 쓰면 내보내도 됩니다. keyPhrase K-1·K-2는 사용자 결정 대기.
