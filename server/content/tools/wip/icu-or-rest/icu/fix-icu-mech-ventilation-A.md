# icu-mech-ventilation — A 검토 (v45 1~7 + 기계적 전수 + context 모양·swap ko)

대상: `icu-mech-ventilation.yaml`(단어 207 · 상황 21 · 문장 126 · 뉘앙스 42 = slider 14 · pair 7 · context 11 · swap 10).
비교: `base-icu-mech-ventilation.yaml`, `changes-icu-mech-ventilation.yaml`(39건), `in-icu-mech-ventilation.json`, `notes-icu-mech-ventilation-A.md`·`-B.md`.
스크립트로 전부 뽑아 본 것: 단어 207개 전 필드(길이 1.25배·3자 규칙은 전부 통과), cue에 정답 영어·`ko`가 든 것, 문장 126개 chunks,
pair 7개 전 결합, swap 10개 × 선택지 30줄 이어 읽기, context 11개 세 장면의 `word` 포함(11/11), distractorsEn 품사 전수,
decoyChips 전부(비속어 관점 포함), base 대비 단어·문장 변경 전부, order 줄 중 고칠 문장과 같은 주장을 하는 줄.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 철자·소리 닮은 오답은 대체로 좋음(`hypoxic`→`hypotonic`, `extubate`→`intubate`). 그러나 **품사가 다른 오답 60개 단어**, 정답으로도 맞는 동의어 오답 5(`alert`·`avert`·`overextend`·`reinsert`·`numeral`) |
| 2 | distractorsKo·길이 | 4 | 길이 규칙 전부 통과. 정답 둘 1(`tubing`↔`튜브`), 오타·없는 말 3(`말기호기이산화탄소`·`투관하다`·`재환기하다`), 품사 어긋남·어색 2 |
| 3 | cue | 3 | 정답 영어 노출 없음. 그러나 `ko`나 그 어간을 그대로 담은 cue 17개(`side`→"한 편", `point`→"가리키는 것", `call`→"전화로…", `intensivist`→"중환자실에서…전담"). 다수가 장면이 아니라 사전 뜻풀이 |
| 4 | chips/decoyChips | 4 | 대체로 형태소 단위. 어긋난 자르기 4(`hy.pox.ic`·`re.com.men.dation`·`Pa.CO.2`·`read.y`). **비속어·불쾌한 조각 없음**(decoy 전부 확인: `dagger`·`grief`·`sad`·`jury`·`ill` 정도, 문제없음. 정답 칩 `pox`(hypoxic)는 형태소 아님 — W-5에서 함께 고침) |
| 5 | 뉘앙스·문장 사실 | 3 | 폐보호 환기·permissive hypercapnia·DOPE·긴장성 기흉·자가발관·복와위 설명은 맞음. 틀린/과한 것: 고압 경보 "응급이 아니다"(안전), 흡인 후 하락 "문제 신호 아님"(안전), 회로 응축수 "문제 아님"(안전), "모니터에서 바로 알아챈다"(지킬 수 없는 약속), "매번 새 카테터를 every pass"(사실 아님), "부조화는 보통 설정 문제"(과함), slider cue "It's called gentle ventilation"(정식 명칭 아님) |
| 6 | 뉘앙스 설계 | 3 | slider 정답 위치 고름(0:4·1:6·2:4). pair 정답 둘 2(`document the wristband color`, `gather the ECMO team`·`gather the visitor list`), slider 척도 순서 1(`abruptly/gradually/completely`). **context 11개 중 8개가 핸드오프 모양이 아님** — `word`(stable·suction·dip·sync·trial·PEEP·condensation·sedation)는 그 듣는 사람에게도 자연스러운 말이고 어색함은 같이 붙은 다른 임상어에서 옴(같은 상황 keyPhrase가 가족에게 그 `word`를 쓰는 경우도 3). swap 10개 이어 읽기는 모두 문법 맞음, `ko` 2개 수정 |
| 7 | v44 정리(결정 11) | 4 | 쉬운 단어 9개 삭제·ko 8개 변경은 타당(`confirm`/`check`/`verify`, `rise`/`climb`, `drop`/`fall` 가르기 좋음). 그러나 아직 쉬운 말 12개 남음, `w-monitor` 동사 태그, `w-rsbi` 틀린 어순 ko, `w-change`가 변경 목록에 있으나 실제 변경 없음. 사실이 아니거나 지킬 수 없는 문장 6, 구 경계를 끊은 non-keyPhrase chunks 3 |

## 사실 오류·심각한 문제

1. **`기도내압 상승 경보 감별` 문장 3 "This alarm isn't an emergency, it just means I need to look closer."** — 거짓 안심(안전). 고압 경보는 튜브 폐색·꺾임·긴장성 기흉·기관지 경련처럼 바로 처치해야 하는 원인의 첫 신호일 수 있습니다. 같은 주제의 `고평탄압 기흉 위기`가 바로 그 장면입니다. 같은 상황의 swap notes는 "위험하지 않다고 단정하지 않고"라고 가르치는데 문장이 정반대. keyPhrase 아님 → 고침(D-1). order 2줄 "It isn't an emergency, but…"도 같이(O-3). 저작자 메모 A·B 지적이 맞습니다.
2. **`흡인 후 산소화 회복 관리` 문장 5 "This dip is expected and temporary, not a sign that something's wrong."** — 회복되는지 보기 전에 "문제 신호가 아니다"라고 단정(안전). 하락이 오래가거나 다시 오르지 않으면 바로 그 신호입니다. 고침(D-2), order 4줄도(O-4).
3. **`회로 연결·습화 점검` 문장 4 "This water in the tubing is just moisture from his breath, not a problem."** — 회로 응축수는 오염된 액체라 환자 쪽으로 흘러들면 VAP 위험이 있어 비워야 하는 것입니다. 같은 상황 문장 5("empty the water trap… so it doesn't back up into his airway")와도 모순. 고침(D-3). 저작자 메모 B 지적이 맞습니다.
4. **`SpO2·EtCO2 모니터` 문장 5 "…I'll catch it right away on this monitor."** — 간호사가 늘 화면 앞에 있다는 지킬 수 없는 약속. 고침(D-4), order 4줄도(O-2).
5. **`기관 흡인 협조` 문장 5 "I always use a new sterile catheter for every pass…"** — 사실 아님. 개방식은 흡인 한 번(세션)마다 새 무균 카테터이고 한 세션의 여러 번 통과에는 같은 카테터를 씁니다. 인공호흡기 환자에게 흔한 폐쇄식(in-line)은 카테터를 계속 씁니다. 같은 문장의 v46 `why`("같은 카테터를 다시 쓰면…매번 새것")도 틀림. 고침(D-6).
6. **`폐보호 환기 적용` slider cue "It's called ___ ventilation."(정답 gentle)** — 정식 명칭은 lung-protective / low tidal volume ventilation이고 같은 상황 swap이 그것을 가르칩니다. "gentle ventilation이라고 부른다"는 틀린 용어 지식. 고침(N-1).

저작자 메모 판정:
- A: 튜브 고정 3 "won't move out of place" — **타당, keyPhrase → 사용자 결정(K-1)**. order 3줄 "so it won't shift"는 keyPhrase 아님 → 고침(O-1).
- A: 모니터 6 "catch it right away" — **타당, 고침**(위 4).
- A: 기도내압 경보 4 "isn't an emergency" — **타당, 고침**(위 1).
- A: 기도내압 경보 3 "still getting oxygen" — **타당, keyPhrase → 사용자 결정(K-2)**.
- A: 흡인 후 회복 6 — **타당, 고침**(위 2).
- A: 부조화 4 "usually means the settings need a small change" — **타당, 고침**(D-5). 가족에게 원인을 설정 하나로 좁히면 통증·분비물·기흉 확인을 가립니다.
- A: 기관 흡인 6 "every pass" — **타당, 고침**(위 5).
- A: `w-monitor` 동사 태그 — **타당, 태그 빼기**(D11-2).
- B: 회로 4 "not a problem" — **타당, 고침**(위 3).
- B: 심한 부조화 2 "while you draw up the medication" — keyPhrase. 응급에서 처방 직전 약을 준비하는 것은 흔하고 투여 전 확인이 따로 있으니 **낮은 우선 사용자 결정(K-3)**.
- B: 폐보호 3 ko "고평부압" — **그대로.** 국내 중환자 문헌에서 plateau pressure를 "고평부압"으로 씀.

저작자 메모 B의 오답 뜻은 B 범위라 판정하지 않음. 다만 아래에서 `en`·`ko`를 바꾸는 문장(D-1~D-6)은 그 문장의 v46 필드(`tag`·`icon`·`why`·`decoy`·`distractorsKo` 둘·`blank`)를 **새 문장에 맞춰 다시 써야** 합니다.

---

## 사용자 결정 필요 — keyPhrase 문장 (`en`은 고치지 않음)

**K-1** `기관튜브 위치·고정 확인` 문장 2 "The tape is secure, so the tube won't move out of place." — 가족에게 "밀려나지 않을 거예요"는 보장입니다(고정해도 계획되지 않은 발관·위치 이탈은 일어남). 대안: "The tape is secure, so the tube is much less likely to move out of place." ko "테이프가 잘 고정돼 있어서 튜브가 밀려날 가능성이 훨씬 적어요". chunks `The tape is secure, / so the tube / is much less likely / to move out of place / .` 바꾸면 v46 필드 다시(지금 why는 "계속 확인한다는 말을 함께 해야"라고 이미 보완 중).

**K-2** `기도내압 상승 경보 감별` 문장 2 "He's still getting oxygen while I work through the causes." — 고압 한계에 닿으면 기계가 흡기를 끊어 전달량이 줄 수 있어 항상 참은 아닙니다(가족에게 하는 안심). 대안: "I'm making sure he gets enough oxygen while I work through the causes." ko "원인을 찾는 동안에도 산소가 충분히 들어가는지 확인하고 있어요". 지금 v46 why("산소 공급이 이어진다고 알리면…")도 함께 다시.

**K-3**(낮음) `심한 부조화 진정 심화 판단` 문장 2 "I'll page the intensivist while you draw up the medication." — 처방 전 약 준비로 읽힐 수 있음. 응급에서는 흔한 분담이라 그대로 둬도 됨. 대안: "I'll page the intensivist for orders while you get the medication ready."

**keyPhrase chunks — 구 경계를 끊은 것(보고만):**
| 상황 · 문장 | 지금 chunks | 끊긴 곳 |
|---|---|---|
| 인공호흡기 설정 확인·기록 [1] | I'll read / the numbers off / and you verify / them on the flowsheet | `verify them` |
| 인공호흡기 설정 확인·기록 [2] | … / with a PEEP / of 5 | `a PEEP of 5`(조각이 `of`로 시작) |
| 회로 연결·습화 점검 [0] | and I'll drain it / away / from him | `away from him` |
| 모드 전환 이해 [0] | lets him take / some of his own / breaths | `his own breaths` |
| 기도내압 상승 경보 감별 [2] | He's still / getting oxygen / while I work / through the causes | `work through` 구동사 |
| permissive hypercapnia 이해 [2] | It's a deliberate / trade-off, | `a deliberate trade-off` |
| 우발적 자가발관 대응 [1] | and bring the intubation cart / in | `bring … in` |
| 난치성 저산소증 구조요법 전환 [0] | despite maximal / ventilator support | `maximal ventilator support` |

---

## 고칠 것 — 문장 (D, 결정 11 범위 · 사실/안전) — 바꾸면 그 문장의 v46 필드 전부 새로

**D-1(안전)** `기도내압 상승 경보 감별` 문장 3 · 거짓 안심(위 심각 1) ·
en → "This alarm doesn't always mean an emergency, but I need to look closer right away."
ko → "이 경보가 늘 응급상황이라는 뜻은 아니지만, 지금 바로 자세히 봐야 해요."
chunks → `["This alarm doesn't", "always mean an emergency,", "but I need", "to look closer", "right away", "."]` · words 그대로 `[w-alarm, w-emergency, w-need]`(D11-1로 w-need를 지우면 빼기).
v46: why 새로(예: "doesn't always mean…, but…으로 겁주지 않되 응급이 아니라고 단정하지 않아요. right away로 바로 확인한다는 것을 알려요."), blank를 `emergency` 그대로 두면 오답 `error/accident/injury` 재검토, distractorsKo 둘 새 ko에 맞춰.

**D-2(안전)** `흡인 후 산소화 회복 관리` 문장 5 · 회복 확인 전 단정(위 심각 2) ·
en → "This dip is expected after suctioning, and I'm watching to make sure it comes back up."
ko → "흡인 후 이렇게 떨어지는 건 예상된 일이고, 다시 올라오는지 지켜보고 있어요."
chunks → `["This dip is expected", "after suctioning,", "and I'm watching", "to make sure", "it comes back up", "."]` · words → `[w-dip, w-expect, w-suction, w-watch]`(w-sign 태그 빠짐 — S11 문장 5가 계속 씀).
v46: why·blank(지금 정답 `temporary`가 없어짐 → `expected` 등)·decoy(`by itself` 재검토)·distractorsKo 둘 새로.

**D-3(안전)** `회로 연결·습화 점검` 문장 4 · 응축수 "문제 아님"(위 심각 3) ·
en → "This water in the tubing is just moisture from his breath, and I'll drain it before it builds up."
ko → "튜빙에 있는 물은 호흡에서 나온 수분이라, 고이기 전에 빼 드릴게요."
chunks → `["This water in the tubing", "is just moisture", "from his breath,", "and I'll drain it", "before it builds up", "."]` · words → `[w-water, w-tubing, w-moisture, w-breath, w-drain]`(w-problem 태그 빠짐 — S14 문장 3이 계속 씀).
v46: why(지금 "not a problem을 덧붙여…" 설명 삭제)·blank(`breath` 유지 가능)·distractorsKo 둘(지금 둘 다 "문제는 아니에요" 틀) 새로.

**D-4** `SpO2·EtCO2 모니터` 문장 5 · 지킬 수 없는 약속 ·
en → "If his oxygen dips or his carbon dioxide climbs, this monitor will alarm and I'll check on him right away."
ko → "산소가 떨어지거나 이산화탄소가 오르면 이 모니터가 경보를 울리고, 제가 바로 와서 확인할 거예요."
chunks → `["If his oxygen dips", "or his carbon dioxide climbs,", "this monitor will alarm", "and I'll check on him", "right away", "."]` · words → `[w-oxygen, w-carbondioxide, w-climb, w-monitor, w-check]`.
v46 why("right away on this monitor는 즉시성과 장소…") 등 새로.

**D-5** `인공호흡기 부조화 인지` 문장 3 · 원인 과단정 ·
en → "When he fights the vent like this, it can mean the settings need a small change, or that he needs suctioning or comfort."
ko → "이렇게 기계와 싸우듯 하는 건 설정을 조금 바꿔야 한다는 뜻일 수도, 흡인이나 편안하게 해 드리는 게 필요하다는 뜻일 수도 있어요."
chunks → `["When he fights the vent", "like this,", "it can mean", "the settings need a small change,", "or that he needs", "suctioning or comfort", "."]` · words → `[w-need, w-small, w-change, w-suction]`.
v46: blank 정답 `usually`가 없어짐 → 다른 말로, why 새로.

**D-6** `기관 흡인 협조` 문장 5 · 사실 아님(위 심각 5) ·
en → "I use sterile technique every time I suction to protect his airway."
ko → "기도를 보호하려고 흡인할 때마다 무균술을 지켜요."
chunks → `["I use sterile technique", "every time", "I suction", "to protect his airway", "."]` · words → `[w-sterile, w-suction, w-airway, w-protect]`(w-catheter·w-safe는 다른 문장이 계속 씀).
v46: why(틀린 "매번 새것" 설명 삭제)·blank(`pass` 없어짐)·decoy·distractorsKo 새로.

**D-7** `permissive hypercapnia 이해` 문장 3 · chunks `here could actually`가 구를 끊음 · → `["Chasing a normal number", "here", "could actually hurt", "his lungs more", "."]`.
**D-8** `급성 산소포화도 붕괴 DOPE 감별` 문장 4 · `while I run / through the causes`가 구동사를 끊음 · → `["Keep bagging steadily", "while I run through", "the causes", "fast", "."]`.
**D-9** `회로 연결·습화 점검` 문장 5 · `so it doesn't / back up into his airway`가 동사를 끊음 · → `["I'll empty", "the water trap now", "so it doesn't back up", "into his airway", "."]`.

### 같은 주장을 하는 order 줄 (v46 order — 위 문장과 함께 고칠 것)
- **O-1** `기관튜브 위치·고정 확인` 3줄 "The tape holds it there, so it won't shift when he moves." → "The tape holds it there, so it's much less likely to shift when he moves."
- **O-2** `SpO2·EtCO2 모니터` 4줄 "If either number changes, I'll catch it right away." → "If either number changes, the monitor will alarm and I'll check right away."
- **O-3(안전)** `기도내압 상승 경보 감별` 2줄 "It isn't an emergency, but I need to find out why." → "It may not be an emergency, but I need to find out why right away."
- **O-4(안전)** `흡인 후 산소화 회복 관리` 4줄 "So the dip was temporary, not a sign that something's wrong." → "So the dip was brief, and I'll keep watching his number." (order `why`가 이 줄을 설명하면 함께)

---

## 고칠 것 — 뉘앙스 (N)

**N-1(사실)** `폐보호 환기 적용` · slider · cue의 "It's called ___ ventilation."은 틀린 명칭 · cue → `Nurse to the family: "For injured lungs we use small breaths and a low plateau pressure. In plain words, we keep his ventilation ___."`(answerAt 0 유지). why 끝에 "정식 이름은 lung-protective(저일회호흡량) ventilation이에요." 추가.

**N-2** `모드 전환 이해` · slider · 척도 `[abruptly, gradually, completely]`가 한 축이 아님(속도와 정도가 섞임) · scale → `[gradually, quickly, abruptly]`, answerAt 0, why → "몇 시간에 걸쳐 조금씩 줄이면 gradually예요. quickly는 빨리, abruptly는 한꺼번에 갑자기라 이 장면과 달라요."

**N-3** `인공호흡기 부조화 인지` · slider · why가 "a bit off"라고 하지만 척도는 `slightly off` · why의 `a bit off` → `slightly off`.

**N-4**(낮음) `자발호흡 능력 사정` · slider · "Nurse to the family"인데 cue에 RSBI·extubated(가족에게 쓰지 않을 말) · cue → `Nurse to the family: "His breathing test is going well, but the tube isn't out yet. His numbers look ___."`

**N-5** `permissive hypercapnia 이해` · swap `ko` "일부러 이산화탄소가 조금 높게 두고 있고"·slider `exKo` "일부러 이산화탄소가 조금 높게 두고 있어요" — 조사 틀림 · → "폐를 보호하려고 일부러 이산화탄소를 조금 높게 두고 있고, pH를 자세히 보고 있어요" / "일부러 이산화탄소를 조금 높게 두고 있어요."

**N-6** `우발적 자가발관 대응` · swap `ko` "숨관을 뽑아 버려서"는 정답 문장보다 탓하는 느낌(notes가 피하라는 바로 그것) · → "숨관이 빠졌는데(직접 빼셨어요), 숨을 도와주면서 다시 넣을 준비를 하고 있어요" 또는 "직접 숨관을 빼셨는데, 숨을 도와주면서 다시 넣을 준비를 하고 있어요".

**N-7** `ABG 통합 환기 조정 소통` · pair · decoy `the wristband color`가 `document`에 붙음("document the wristband color"는 자연스러운 영어 — 정답 둘) · decoy → `into the cuff`(`increase/call/document into the cuff` 모두 안 됨. `for a few seconds`는 "increase for a few seconds"가 자동사로 성립해 ✕).

**N-8** `난치성 저산소증 구조요법 전환` · pair · `gather the ECMO team`(팀을 모으다)·`gather the visitor list`·`consult the visitor list`가 모두 자연스러운 영어 — 정답 셋 · pairs → `[[escalate, to proning], [consult, the ECMO team], [trend, the P/F ratio]]`, decoys → `[into the water trap]`, words → `[w-escalate, w-prone, w-consult, w-team, w-ratio]`, why → "산소가 오르지 않으면 조치 단계를 높이고(escalate), 전문팀에 자문을 구하고(consult), P/F 비율의 흐름을 계속 봐요(trend)."

**context 핸드오프 모양 (TASK 9)** — 아래 8개는 `word`가 그 듣는 사람에게도 자연스러운 말이어서 "`word`가 어색한 장면은?"에 답이 성립하지 않고, 어색함은 같이 붙은 다른 임상어(parameters·endotracheal tube·titrated·breath stacking·per protocol·transient·paralytic adjunct·expiratory limb)에서 옵니다. 세 장면이 자연스럽게 공유하는 **임상어**로 `word`를 바꿉니다(`who`·`icon`·`ok`·순서 그대로).

**N-9** `SpO2·EtCO2 모니터` · `stable` → word `EtCO2`, ko `호기말 이산화탄소`, words `[w-carbondioxide]`: ① 동료 "EtCO2 is 38 and holding on the monitor." ✓ ② 차트 "EtCO2 35–40 overnight, no alarms." ✓ ③ 가족 "His EtCO2 is 38 right now." ✕ fix "The number that shows how well he's breathing out carbon dioxide is right where we want it." why → "EtCO2는 의료진끼리 짧고 정확한 말이지만, 가족에게는 무엇을 보는 숫자인지부터 풀어 말해요."

**N-10** `기관 흡인 협조` · `suction` — 환자에게 "I'm going to suction you"는 미국 병원에서 그대로 쓰는 말(같은 상황 문장 3) · word `secretions`, ko `분비물`, words `[w-suction]`: ① 동료 "He has thick secretions, so let's suction him." ✓ ② 차트 "Suctioned for thick white secretions; SpO2 stable throughout." ✓ ③ 환자 "I'm going to clear your secretions now." ✕ fix "I'm going to clear the mucus from your breathing tube now, and you might cough." why → "secretions는 의료진끼리 정확한 말이지만 환자에게는 낯설어요. mucus(가래)처럼 쉬운 말과 어떤 느낌일지를 함께 말해요."

**N-11** `PEEP 적정 산소화 개선` · `PEEP` — 이 상황 keyPhrase(문장 1)와 문장 3이 가족에게 PEEP를 쓰며 설명함 · word `titrate`, ko `조금씩 맞춰 조정하다`, words `[w-peep]`: ① 동료 "We titrated the PEEP up by 2, and his sats came up." ✓ ② 차트 "PEEP titrated to 10; SpO2 improved to 94%." ✓ ③ 가족 "We titrated his PEEP to recruit more alveoli." ✕ fix "We slowly raised the pressure that keeps his air sacs open, and his oxygen got better." why → "titrate는 의료진끼리 '조금씩 맞춰 조정했다'는 정확한 말이지만 가족에게는 어려워요. 무엇을 어떻게 바꿨는지 풀어 말해요."

**N-12** `인공호흡기 부조화 인지` · `sync` — keyPhrase(문장 0)가 가족에게 "aren't quite in sync"를 씀 · word `double triggering`, ko `이중 촉발`, words `[w-trigger]`: ① 동료 "He's double triggering — look at the waveform." ✓ ② 차트 "Double triggering noted; flow adjusted per RT." ✓ ③ 환자 "You're double triggering the vent." ✕ fix "Your breaths and the machine aren't matching yet, and I'm adjusting it." why → "double triggering은 파형을 보고 의료진끼리 쓰는 말이에요. 깨어 있는 환자에게는 기계와 호흡이 아직 안 맞고 조정 중이라고 풀어 말해요."

**N-13** `자발호흡 능력 사정` · `trial` · word `SBT`, ko `자발호흡시험`, words `[w-trial]`: ① 동료 "He's on an SBT, so watch his rate and effort." ✓ ② 차트 "SBT 30 min on PS 5/PEEP 5, tolerated." ✓ ③ 가족 "He's on an SBT right now." ✕ fix "We're giving him a short test of breathing mostly on his own." why → "SBT는 의료진끼리 쓰는 약어예요. 가족에게는 스스로 숨 쉬어 보는 짧은 시험이라고 풀어 말해요."

**N-14** `흡인 후 산소화 회복 관리` · `dip` — keyPhrase(문장 0)가 가족에게 "a brief oxygen dip"을 씀 · word `desat`, ko `산소포화도 저하`, words `[w-dip]`: ① 동료 "He desatted to 85 with suctioning, but he's coming back up." ✓ ② 차트 "Desat to 85% with suctioning; recovered with bagging." ✓ ③ 가족 "He desatted after suctioning." ✕ fix "His oxygen dropped for a moment after the suction, and it's already coming back." why → "desat은 의료진끼리 쓰는 줄임말이라 가족은 알아듣지 못해요. 무엇이 얼마나 떨어졌다 돌아오는지 풀어 말해요."

**N-15** `회로 연결·습화 점검` · `condensation` — keyPhrase(문장 0)가 가족에게 "That condensation is normal"이라고 씀(why의 "가족에게는 낯설고"와 모순) · word `rainout`, ko `회로 응축수`, words `[w-condensation]`: ① 동료 "There's rainout in the circuit, so I'll drain the trap." ✓ ② 차트 "Rainout in tubing drained to water trap; no leak found." ✓ ③ 가족 "That's just rainout in his circuit." ✕ fix "That's just water from his warm breath, and I'll empty it away from him." why → "rainout은 호흡치료사·간호사가 회로에 맺힌 물을 부르는 말이라 가족은 알아듣지 못해요."

**N-16** `심한 부조화 진정 심화 판단` · `sedation` — 가족에게 sedation은 흔히 쓰는 말이고, 지금 fix는 근이완제를 빼 버려 세 장면의 뜻이 달라짐 · word `paralytic`, ko `근이완제`, words `[w-paralyze]`: ① 의사에게 "If deeper sedation doesn't work, should we add a paralytic?" ✓ ② 차트 "Sedation deepened, then paralytic started per order." ✓ ③ 가족 "We're starting a paralytic." ✕ fix "We're giving him medicine that relaxes all his muscles so the machine can breathe for him, along with medicine to keep him asleep." why → "paralytic은 의료진끼리 정확한 말이지만 가족에게는 무섭게 들려요. 근육을 쉬게 하는 약과 함께 재우는 약도 준다는 것을 같이 말해요."(진정 먼저 → 근이완 순서를 지킴)

**N-17**(낮음) pair decoy가 장면과 동떨어진 `wristband`(회로 pair)·`wristband`(경보 pair)·`a new wristband`(고장 pair) — 한눈에 걸러짐 · 같은 분야에서 어느 왼쪽 말에도 안 붙는 말로(전 결합 확인함): 회로 pair → `cuff`(`water cuff`·`breathing cuff` ✕), 경보 pair → `flowsheet`(`kinked flowsheet`·`he needs flowsheet`·`high flowsheet` ✕), 고장 pair → `to the bedside`(`disconnect/bag/page to the bedside` ✕). (`pressure`·`filter`·`monitor`는 `water pressure`·`water filter`·`breathing monitor`가 되어 안 됨)

**N-18**(낮음) `급성 산소포화도 붕괴 DOPE 감별` · pair `D/O/P/E`는 첫 글자만 보고 풀림 · 그대로 둬도 되나, 개선하려면 왼쪽을 증상으로: `[[tube moved, displacement], [mucus plug, obstruction], [one side silent, pneumothorax], [vent failed, equipment]]`, decoy `resuscitation` 유지.

swap 10개 이어 읽기: 30줄 모두 문법 맞음. swap `ko`는 N-5·N-6 외 8개 정확.
context 나머지 3개(`chart`·`displacement`·`bag`)는 핸드오프 모양 맞음.

---

## 고칠 것 — 단어 재료 (W, v45)

**W-1 품사가 다른 distractorsEn — 전부 60개.** 정답 품사는 이 주제 문장에서 쓰인 품사. 대안은 길이 규칙 통과 확인함. `distractorsKo`는 바꿀 필요 없음(— ). ※ 표시는 D11-1에서 단어를 지우면 무관.

| id | 정답(품사) | 문제 오답 | 바꿀 distractorsEn |
|---|---|---|---|
| w-hurt | hurt(동) | heart(명) | hunt, hurl |
| w-secure | secure(형) | assure(동) | obscure, severe |
| w-often | often(부) | offer(동)·after(전) | seldom, rarely |
| w-tell ※ | tell(동) | till(전) | yell, teach |
| w-touch ※ | touch(동) | couch(명) | torch, catch |
| w-drain | drain(동) | brain(명) | train, strain |
| w-circuit | circuit(명) | circular(형) | circle, conduit |
| w-lung | lung(명) | long(형) | lunch, lump |
| w-rise | rise(동) | rice(명) | raise, rinse |
| w-equal | equal(형) | equip·equate(동) | usual, unequal |
| w-change | change(동) | chance(명) | charge, chafe |
| w-even | even(형) | event(명)·ever(부) | uneven, steep |
| w-clear | clear(동) | clerk(명) | clean, cleave |
| w-stable | stable(형) | staple·stall(명) | unstable, sterile |
| w-suction | suction(동) | section·function(명) | suture, swallow |
| w-cough | cough(동) | cuff·couch(명) | coach, gasp |
| w-quick | quick(형) | quite(부) | quiet, quaint |
| w-safe | safe(형) | save(동) | same, sage |
| w-own | own(형) | owe(동) | only, other |
| w-support | support(명) | suppress(동) | supply, report |
| w-finetune | fine-tune(동) | fine-print(명); recalibrate는 뜻이 가까움 | finalize, define |
| w-open | open(형) | oven(명) | even, opaque |
| w-step | step(명) | steep(형) | stem, stamp |
| w-high | high(형) | hide(동)·hint(명) | huge, light |
| w-need ※ | need(동) | needle·nerve(명) | knead, heed |
| w-cause | cause(명) | cease(동) | course, case |
| w-stiff | stiff(형) | staff(명) | still, stuffy |
| w-sync | sync(명) | since(전) | sink, cinch |
| w-effort | effort(명) | afford(동) | effect, offer |
| w-against | against(전) | again(부)·agenda(명) | among, amid |
| w-small | small(형) | smell(명) | smart, smooth |
| w-damage | damage(명) | manage(동) | dosage, drainage |
| w-low | low(형) | lot·row(명) | loud, slow |
| w-heal | heal(동) | heel·health(명) | heave, heed |
| w-trial | trial(명) | trivial(형) | trail, triad |
| w-flag | flag(동) | flat(형) | flap, flash |
| w-ask ※ | ask(동) | task(명) | add, bask |
| w-steady | steady(형) | study(명) | steamy, sturdy |
| w-sign | sign(명) | singe(동) | sigh, site |
| w-purpose | purpose(명) | propose·purge(동) | proposal, purchase |
| w-deliberate | deliberate(형) | delegate(동/명) | delicate, desperate |
| w-common | common(형) | comment·command(명) | uncommon, comical |
| w-extra | extra(형) | extract(동)·extent(명) | external, extreme |
| w-fast | fast(부) | fact·fist(명) | first, last |
| w-expect | expect(동) | expert(명) | expand, export |
| w-drop | drop(동) | drum(명) | drip, droop |
| w-increase | increase(동) | increment(명) | decrease, incise |
| w-call ※ | call(동) | cell(명)·tall(형) | cull, tell |
| w-point | point(동) | joint(명) | paint, print |
| w-needle | needle(명) | nestle(동) | noodle, nozzle |
| w-ready | ready(형) | rarely(부)·reply(명) | heavy, rusty |
| w-shift | shift(동) | shaft·shirt(명) | sift, shirk |
| w-bedside | bedside(명) | beside(전) | roadside, bedrock |
| w-cart | cart(명) | curt(형) | card, chart |
| w-weak | weak(형) | week(명)·weep(동) | meek, bleak |
| w-calm | calm(형) | palm(명)·claim(동) | clammy, numb |
| w-despite | despite(전) | despair·desire(명) | beyond, except |
| w-gather | gather(동) | rather(부) | lather, gauge |
| w-sedated | sedated(형) | sedative(명) | seated, sated |
| w-dry | dry(동) | wet(형) | drip, dye |

**W-2 정답으로도 맞는 distractorsEn(동의어·가까운 말)**
| id | 문제 오답 | 이유 | 바꿀 distractorsEn |
|---|---|---|---|
| w-alarm | alert | `경보`의 영어로 alert도 맞음 | charm, aroma |
| w-avoid | avert | `피하다·막다` — "to avert overstretching"도 성립 | await, avow |
| w-overstretch | overextend | `과팽창시키다`에 그대로 맞음 | overstate, overshoot |
| w-reintubate | reinsert | "reinsert the tube" = 다시 넣다 | reinstate, reiterate |
| w-number ※ | numeral | `숫자`의 영어로 numeral도 맞음 | member, lumber |
(낮음) w-emergency `urgency`도 `응급상황`에 가까움 — 바꾼다면 `emergence`.

**W-3 distractorsKo**
| id | 정답 ko | 문제 | 바꿀 distractorsKo |
|---|---|---|---|
| w-tubing | 튜빙 | `튜브`도 tubing의 뜻 — 정답 둘 | 파이프, 필터 |
| w-paco2 | 동맥혈 이산화탄소분압 | `말기호기이산화탄소` 어순 틀림 | 동맥혈산소분압, 호기말이산화탄소 |
| w-extubate | 발관하다 | `투관하다`는 없는 말 | 삽관하다, 절개하다 |
| w-team | 팀 | `혼자`는 부사 | 개인, 환자 |
| w-injure | 손상되게 하다 | `보호되게 하다` 어색 | 회복되게 하다, 감염되게 하다 |
| w-reintubate | 재삽관하다 | `재환기하다` 어색 | 재발관하다, 재흡인하다 |

**W-4 `ko`(또는 그 어간)를 되풀이하는 cue — 17개.** 장면(언제·누구에게)으로 바꿉니다.
| id | 지금 cue가 담은 말 | 바꿀 cue |
|---|---|---|
| w-side | "한 편"(쪽) | 청진 때 왼쪽과 오른쪽을 나눠 말하는 말 — 호흡음을 양쪽 비교할 때 |
| w-moment | "잠깐" | 흡인할 때 기침이 오래가지 않는다고 환자를 안심시키며 쓰는 말 |
| w-dip | "잠깐…꺼졌다가" | 흡인 직후 SpO2가 85로 내려갔다 곧 돌아왔을 때 동료에게 |
| w-fall | "내려가며" | 부조화가 심해지며 SpO2 숫자가 계속 낮아지는 걸 보고할 때 |
| w-rise | "올라오는" | 숨을 넣을 때 흉곽이 양쪽 똑같이 부푸는지 볼 때 |
| w-point | "가리키는 것" | 호흡음 소실과 높은 압력을 보고 기흉을 의심한다고 말할 때 |
| w-call | "전화로…연락" | ABG 결과와 제안을 들고 의사에게 연락할 때 |
| w-page | "호출기…불러내는" | 급할 때 중환자전담의·호흡치료팀을 무선으로 부를 때 |
| w-bedside | "침대 바로 옆" | 고장 난 인공호흡기 앞으로 도움을 불러올 때 '여기로' |
| w-intensivist | "중환자실…전담" | 부조화가 심해 진정 심화를 상의할 ICU 담당 의사 |
| w-maximal | "최대치" | FiO2 100%·높은 PEEP로도 산소가 안 오를 때 설정을 말하는 말 |
| w-escalate | "한 단계 더…올리는" | 복와위·ECMO처럼 다음 치료로 넘어가자고 할 때 |
| w-prone | "엎드려" | 난치성 저산소증에 등 쪽 폐를 열려고 자세를 바꿀 때 |
| w-carefully | "조심조심" | 기흉 의심 환자를 백으로 환기할 때 압력을 살피며 |
| w-gather | "모아 두는" | ECMO팀에 전화하기 전 최근 ABG와 P/F 비율을 챙길 때 |
| w-weak | "약해서" | 자가발관 뒤 공기가 거의 안 움직일 때 호흡 노력을 말하는 말 |
| w-paco2 | "동맥혈에…이산화탄소의 압력"(ko 그대로) | ABG에서 환기가 충분한지 보는 항목 — 오르면 호흡수를 늘림 |

**W-5 chips** — 형태소가 아닌 자르기
- w-hypoxic `[[hy, pox, ic]]` → `[[hyp, ox, ic]]` (decoyChips `hyper, poss` → `hyper, ax`)
- w-recommendation `[[re, com, men, dation]]` → `[[re, com, mend, ation]]`
- w-paco2 `[[Pa, CO, 2]]` → `[[Pa, CO2]]` (decoyChips `Pe, SO` → `Pe, O2`)
- w-ready `[[read, y]]` → `[[ready]]`(짧은 한 낱말 — 조각 맞추기 건너뜀)

---

## 고칠 것 — 결정 11 (단어·문장)

**D11-1 아직 남은 쉬운 단어 — 태그를 빼고 은행에서 삭제(12개).** 상황별 서로 다른 단어 수를 스크립트로 셌고 전부 8 이상 유지(최소 S6 11).
`w-read`(S0[1]) · `w-number`(S0[1],[5], S4[0],[2], S7[5], S11[2], S12[3], S13[2], S14[2], S19[3]) · `w-tell`(S1[5], S4[3], S8[0], S14[4]) · `w-ask`(S11[3]) · `w-touch`(S1[5]) · `w-move`(S1[2],[3]) · `w-water`(S2[4],[5]) · `w-need`(S4[4], S8[1],[3],[4], S18[5], S19[1],[4]) · `w-call`(S14[2], S16[1], S17[1], S18[1],[4], S20[2],[5]) · `w-question`(S11[3]) · `w-problem`(S2[4], S14[3]) · `w-blood`(S12[1],[4]).
뉘앙스 `words`에서도 빼기: 회로 pair `w-water`, 경보 pair `w-need`, ABG pair `w-call`·`w-number`, ABG swap `w-call`.
(선택) `w-small`·`w-high`·`w-low`도 쉬운 말 — 지우면 폐보호 swap·경보 pair/swap·permissive slider의 `words`에서 함께 빼기.

**D11-2** `permissive hypercapnia 이해` 문장 2 · `w-monitor`(ko 모니터=장치)를 동사 "monitoring"에 태그 · 이 문장 `words`에서 `w-monitor` 빼기(S4 문장 5가 명사로 계속 씀).

**D11-3** `w-rsbi` ko "호흡얕고빠른지수" — 어순 틀림 · → "빠르고 얕은 호흡 지수"(distractorsKo 길이 규칙 통과).

**D11-4** `w-change` · 변경 목록에 ko 변경으로 적혀 있지만 실제로는 base와 같음("변화하다"). 문장은 타동사 "We change it"·명사 "the change"로 씀 · ko → "바꾸다"로 실제 바꾸거나, 변경 목록에서 이 항목 삭제.

**D11-5**(낮음) `w-flag` ko "표시해두다"가 `w-mark` "표시하다"와 겹치고 문장 ko는 "팀에 보고해둘게요" · ko → "알려 두다", distractorsKo → "지워 두다, 미뤄 두다".

**D11-6**(낮음) `w-heal` ko "회복되다"가 `w-recover` "회복하다"와 같음 · ko → "낫다".

**D11-7** `인공호흡기 설정 확인·기록` 문장 1(keyPhrase, ko만)·문장 5 ko "흐름기록지"는 직역이라 어색 · → "기록지"(단어 ko와 맞춤). 문장 ko를 바꾸면 그 문장 `distractorsKo` 둘도 새 ko 틀로.

**D11-8**(낮음) `난치성 저산소증 구조요법 전환` 문장 0(keyPhrase, ko만) "인공호흡기를 최대로 지원해도" → "인공호흡기 지원을 최대로 해도". distractorsKo 둘도 같은 틀로.

저작자의 변경 목록 판정: 쉬운 단어 9개 삭제(hour·hand·good·big·together·find·bring·soon·great) 타당. ko 8개 변경 타당. 문장 태그 정리 20건 타당(`w-respiratory`를 형용사 "respiratory effort"에서 뺀 것, `w-moment`를 "the moment"에서 뺀 것, `w-work` 동사 용법 정리 모두 좋음). 틀린 것은 D11-4 하나.

---

## 기계적 전수 확인 결과 요약

- **pair** 7개 전 결합 출력·판정: 정답 둘 — ABG `document the wristband color`(N-7), 구조요법 `gather the ECMO team`·`gather/consult the visitor list`(N-8). 나머지 5개는 정답 짝 하나만 성립.
- **chunks** 126문장: 구 경계 끊김 non-keyPhrase 3(D-7~D-9, 고침), keyPhrase 8(보고만, 위 표). 관사·`of`로 끝나는 조각 없음.
- **distractorsEn 품사**: 60개 단어(W-1). 동의어 5(W-2).
- **swap** 10개 × 3: 문법 모두 맞음.
- **context** 11개: `word` 세 장면 포함 11/11. 모양이 맞는 것 3, 바꿀 것 8(N-9~N-16).
- **decoyChips 비속어**: 없음.
- **cue**: 정답 영어 노출 0, `ko` 되풀이 17(W-4).

## 개수 요약

| 분류 | 개수 | 그중 안전 |
|---|---|---|
| 문장 D-1~D-9 | 9 | 3 (D-1·D-2·D-3) |
| order 연동 O-1~O-4 | 4 | 2 (O-3·O-4) |
| 뉘앙스 N-1~N-18 | 18 | 0 |
| 단어 W-1 60 · W-2 5 · W-3 6 · W-4 17 · W-5 4 | 92 | 0 |
| 결정 11 D11-1(12) · D11-2~8(7) | 19 | 0 |
| **합계** | **142** | **5** |
| 사용자 결정(keyPhrase en) | 3 (K-1~K-3) + chunks 보고 8 | K-1·K-2는 안전 관련 |

## 종합

사실·안전 문제는 base 문장(고압 경보·흡인 후 하락·응축수 단정)과 그 말을 되풀이한 order 줄에 몰려 있고, 새로 쓴 뉘앙스는 대체로 맞습니다.
D·O·N-1과 context 8개(N-9~N-16)를 고치고 W-1~W-3을 반영하면 내보내도 됩니다. keyPhrase K-1·K-2는 사용자 결정 전까지 그대로 두되, 같은 단정을 하는 order 줄(O-1)은 지금 고칩니다.
