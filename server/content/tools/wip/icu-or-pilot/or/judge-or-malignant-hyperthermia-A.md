# judge — or-malignant-hyperthermia · A 범위 (Fable 독립 판정, 2026-10-16)

대상 `or-malignant-hyperthermia.yaml`(단어 182 · 상황 21 · 문장 105 · 뉘앙스 43). 비교 `base-…yaml`·`changes-…yaml`·`in-…json`·`notes-…-A/B.md`.
`fix-*.md`는 열지 않았다. 기계 검사: 길이 1.25배·3자 규칙 위반 0, chips 결합 = en 전부 일치, 아이콘 전부 목록 안, 은행 단어 전부 어느 문장에 태그됨, 뉘앙스 `words` 전부 그 상황 문장의 단어, 상황마다 STEP1·STEP2 1개 이상, keyPhrases 63문장 전부 글자 그대로 존재, `on`·`off` 따옴표 확인. **swap·reel 문항은 이 주제에 하나도 없다**(21상황 전부 slider|pair + context) — "swap ko 정확한가"는 해당 없음.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | **2** | 정답으로도 맞는 오답 1(w-rigidity `rigidness`), 같은 단어 변화형 1(w-crisis `crises`), 비단어 1(w-handoff `hand-on`). **품사 불일치가 36개 단어**에 퍼져 있다(소리만 닮은 말을 골라 품사를 안 봄). 길이 규칙은 전부 통과. |
| 2 | distractorsKo·En 정답 겹침 | **4** | 정답의 다른 뜻을 넣은 것 1(w-level `단계`). 은행 안 같은 ko 쌍은 없음. w-drug `약물`/w-medication `약물(투여용)`은 v44부터 겹친 ko(결정 11로). |
| 3 | cue | **4** | 정답 영어·파생형 노출 없음. ko를 거의 그대로 되풀이한 것 4(w-critical·w-first·w-mh·w-tempabbr), 부분 되풀이 6. |
| 4 | chips/decoyChips | **2** | **비속어·불쾌 조각 4**: `anal`×2(w-anesthesia·w-anesthetic), `ass`(w-assessment), `sux`(w-succinylcholine — "sucks"로 들리고 실제 OR 은어이기도 함). 경계: `git`×2(w-rigidity·w-rigid), `pot`. 형태소가 아닌 자름 1(w-anesthesia `an/es/the/sia`). |
| 5 | 뉘앙스 사실 정확성 | **4** | MHAUS와 맞는 것: 유발약 = 휘발성 가스+석시닐콜린, 원인 모를 EtCO2 상승·교근 강직 = 이른 징후, 체온은 늦게, 단트롤렌 체중 기준·반응할 때까지 반복, 고칼륨 = 칼슘→인슐린+포도당→중탄산염, 산증 = 과호흡+중탄산염, 기화기 제거/비활성화+기계 플러시, 위기 후 단트롤렌 지속·재발 감시, 콜라색 소변 = 미오글로빈뇨, 뾰족 T파. **틀린 것 1**: 상황17 pair `why` "목표 온도에 닿기 **전에** 멈춰야" — MHAUS는 심부 체온이 목표(<38°C)에 **닿으면** 능동 냉각을 멈추라고 한다(같은 상황 context 기록 장면 "stopped at target"과도 어긋남). 수치는 `why`·`notes`에 하나도 쓰지 않았음(안전). 문장 2.3 "twelve vials"는 MHAUS 권고(20 mg 바이알 36개 또는 Ryanodex 250 mg 3개)와 맞지 않는 예시 숫자(아래 결정 11). |
| 6 | 뉘앙스 설계 | **3** | pair 8건 전 결합(왼쪽 3 × 오른쪽 3+decoy) 출력해 판정: **정답 둘 1**(상황1 "Avoid everyone before we start" — 장면 밖에서는 자연스러운 영어; "Confirm volatile agents and succinylcholine"도 반쯤 선다). 나머지 7건은 유일. context 21건: `word`가 세 장면 `en`에 전부 있음·`ko`·`fix` 모두 있음. 그러나 **slider 14건 중 13건이 answerAt=1이고 13건에서 정답이 가장 긴 선택지** — 읽지 않고 고를 수 있다. context의 "어색한 장면"이 실제로는 괜찮은 말인 것 1(상황18 protect), 약한 것 3(상황11·16·17). STEP2가 21건 전부 "의료진→차트→보호자" 한 틀(위반은 아님). |
| 7 | v44 단어·문장(결정 11) | **4** | 48건 변경 전부 타당(쉬운 단어 13 제거·태그 정리·ko 가름 10). 문장 ko 오역 1(3.2 "유효기한도 지났어요" = 반대 뜻, 저작자 둘 다 지적·정당), 부자연 ko 4, reconstitute ko 부정확. `대사성 산증 교정`은 서로 다른 단어 정확히 8개(V3 바닥) — 더 빼면 안 됨. |

## 사실 오류·심각한 문제
1. **상황17 `급속 냉각 시행` pair `why`** — "목표 온도에 닿기 전에 멈춰야 지나치게 식지 않아요" → 목표 체온에 **닿으면** 멈춘다(MHAUS: stop cooling when core temp <38°C). 학습자가 "목표 전에 멈춘다"로 외우면 냉각을 일찍 끊는다.
2. **문장 3.2 ko** "전부 구비되어 있고 유효기한도 지났어요" — `in date`(기한 안)의 반대. 카트 점검 문장이라 안전 직결. 같은 문장을 `example`로 쓴 w-stock·w-date의 `exKo`도 같은 오역.
3. **decoyChips `ass`·`anal`×2** — 조각 맞추기 화면에 그대로 뜬다.
4. w-rigidity distractorsEn `rigidness` — 정답과 같은 뜻, 정답 둘.

## 고칠 것 (v45 범위)

### 뉘앙스
- 상황1 유발 약물 인지 · pair · "Avoid everyone before we start"가 영어로 서서 Avoid 줄의 정답이 둘(Confirm 줄도 "Confirm volatile agents and succinylcholine"로 반쯤 섬) → Tell 줄 오른쪽을 "the whole team which drugs we're avoiding"로(Avoid·Confirm 어느 쪽에도 안 붙음), Avoid 오른쪽은 그대로.
- 상황17 급속 냉각 시행 · pair `why` · "목표 온도에 닿기 전에 멈춰야" → "목표 체온에 닿으면 멈춰요(지침상 38°C 아래) — 더 식히면 저체온으로 넘어가요".
- 상황18 고칼륨 부정맥 대응 · context(protect) · 장면3 "We gave calcium to protect his heart from the potassium surge."는 보호자에게 해도 괜찮은 말이라 어색한 장면이 아님 → 장면3을 "We pushed calcium to protect the myocardium from the hyperkalemia."처럼 임상어가 그대로 들어간 문장으로 바꾸고 `fix`는 그대로 둠.
- 상황17 급속 냉각 시행 · context(overshoot) · 장면3 "We're careful not to overshoot, so we stop the ice before he gets too cold."도 이미 풀어 쓴 말이라 어색함이 약함 → "We'll stop active cooling before we overshoot the target."처럼 팀 안 말투로 바꿈.
- 상황16 dantrolene 혼합 투여 · context(dose) 장면3, 상황11 유발약 회피 마취 · context(vaporizer) 장면3 — 어색함이 약하다(설명이 보호자에게 못 쓸 정도는 아님). 고치면: 16은 "We've dosed him at 2.5 per kilo and we'll keep repeating it." 같은 용량 말투로(수치 노출이 싫으면 "dosed him by weight and titrated"), 11은 "The vaporizers are off the machine and we're running TIVA."
- slider 14건 · 13건에서 정답이 가장 긴 선택지(answerAt=1 13건) → 오답 한쪽을 정답 길이에 맞춰 늘리거나(과잉 반응 쪽을 길게) 정답을 줄여 길이로 못 고르게. 최소 손질: 상황6·8·9(빈맥)·10·11·12·14·15의 오답을 정답의 0.8배 이상으로.
- 상황20 pair · "I'll walk the ICU team through MH handoff"가 관사 없이 반쯤 서고 "watch for everything that happened"도 시제만 어긋남 — 정답 둘은 아니나 왼쪽 "Give ICU a full" 대신 "Give ICU a full MH" / 오른쪽 "handoff"로 좁히면 깔끔.

### 단어 — distractorsEn (정답 둘·변화형·비단어)
- w-rigidity · `rigidness` 동의어 → `rapidity`.
- w-crisis · `crises` 복수형 → `cruise` 또는 `crease`.
- w-handoff · `hand-on` 비단어 → `handful`(`handover`는 동의어라 불가).

### 단어 — distractorsEn 품사 불일치 (정답 품사 ≠ 오답 품사; 바꿀 쪽만)
- w-fever(명) `fewer`→`fiber` · w-agent(명) `urgent`→`reagent` · w-trigger(명) `trigeminal`→`tremor` · w-vial(명) `vital`→`dial` · w-low(형) `loan`→`loose` · w-inventory(동) `interval`→`invent` · w-sterile(형) `steroid`→`fragile` · w-temp(명) `temporal`→`temperament` · w-probe(명) `prove`/`prone`→`prop`/`globe` · w-call(동) `cell`/`coil`→`cull`/`crawl` · w-closely(부) `closet`→`coarsely` · w-sign(명) `sing`→`sigh` · w-climb(동) `clump`/`climate`→`cling`/`clip` · w-tell(동) `tall`/`tent`→`yell`/`sell` · w-abnormal(형) `anomaly`→`anomalous` · w-despite(전) `despise`/`deposit`→`beside`/`inside` · w-think(동) `thin`→`sink` · w-rigid(형) `rigor`→`frigid` · w-heart(명) `heard`→`heat` · w-rate(명) `rare`/`rave`→`ratio`/`gate` · w-add(동) `odd`→`adapt` · w-known(형) `knock`→`noted` · w-safe(형) `save`→`sane` · w-flush(동) `fresh`→`blush` · w-remove(동) `remote`→`resolve` · w-fast(부) `fact`→`far` · w-wave(명) `wove`→`wedge` · w-urine(명) `urgent`→`urea` · w-dark(형) `dart`/`dash`→`dull`/`stark` · w-help(명) `held`/`heal`→`health`/`heel` · w-weight(명) `wait`→`width` · w-mix(동) `mist`→`miss` · w-surface(명) `suffice`→`suture` · w-full(형) `fool`/`fall`→`foul`/`dull` · w-happen(동) `happy`→`hasten` · w-stable(형) `staple`/`stage`→`static`/`subtle` · w-core(형/명) `cord`/`score`는 명사라 통과로 봄.
- w-date(명) `dose`는 명사로도 읽혀 통과. w-severe `several`은 한정사지만 형용사로 통용 — 통과.

### 단어 — distractorsKo
- w-level · `단계`는 level의 다른 뜻 → `비율`.
- w-bicarb · `탄산가스(약칭)`·`이산화탄소(약칭)`가 같은 것 둘 → 둘째를 `탄산칼슘(약칭)`.

### 단어 — cue
- w-critical · "생명이 위험할 만큼 위중한"이 ko 되풀이 → "수치가 생명을 위협하는 범위에 들어갔다고 말할 때 (형용사)".
- w-first · "무엇보다 먼저일 때" 되풀이 → "순서의 맨 앞 — 징후도, 처치 순서도 (형용사·부사)".
- w-mh · "악성 고열을 줄여 부르는 약자" → "그 응급의 두 글자 약자 — 카트·프로토콜 이름에 붙는다".
- w-tempabbr · "체온을 빠르게 줄여 부르는 말" → "temperature를 한 음절로 줄인 수술실 말".
- 부분 되풀이(선택): w-start(시작) · w-continue(계속) · w-mix(섞) · w-send(보낼) · w-dark(어두운) · w-sudden(갑자기) · w-reach(닿는).

### 단어 — chips/decoyChips
- w-anesthesia · decoy `anal` → `ane` 또는 `ana`; chips `an/es/the/sia`는 형태소가 아님 → `[[an, es, the, sia]]`→`[[anes, the, sia]]`(또는 `[[an, esthe, sia]]`).
- w-anesthetic · decoy `anal` → `ana`.
- w-assessment · decoy `ass` → `sas`(정답 조각 `as`·`sess`·`ment`와 안 겹침).
- w-succinylcholine · decoy `sux` → `suk` 또는 `sin`.
- 경계(선택): w-rigidity·w-rigid decoy `git` → `gid`와 겹치니 `gat`; w-potassium decoy `pot`은 두되 판단.

## 고칠 것 (결정 11 — v44 단어·문장)
- 상황3 MH 카트 점검 · 문장2 `ko` "전부 구비되어 있고 유효기한도 지났어요" → "전부 구비되어 있고 유효기한도 안 지났어요". **B 범위 알림**: 이 문장 `distractorsKo` 둘도 새 ko 틀로 다시 쓸 것. 같은 문장을 쓰는 w-stock·w-date `exKo`도 같은 문구로.
- 상황2 dantrolene 위치 확인 · 문장3 `en` "This room stocks twelve vials of dantrolene in the cart." — MHAUS 비치 권고는 20 mg 바이알 36개(또는 Ryanodex 250 mg 3개). 예시 수치로 두면 학습자가 12를 기준으로 외운다 → `en` "This room stocks thirty-six vials of dantrolene in the cart."로 바꾸고 chunks `twelve vials`→`thirty-six vials`, `ko` "열두"→"서른여섯", w-cart `example`·`exKo`도 같이. (제품 차이를 살리고 싶으면 `ko`에 "(20 mg 기준)" 대신 B의 `why`에서 밝히는 쪽이 낫다.)
- w-reconstitute `ko` "재구성하다" → "(가루약을) 용해하다" — 한국 임상에서 reconstitute는 믹스/용해; 상황16 문장0 `ko` "모두 손을 보태 지금 단트롤렌을 재구성합니다" → "모두 지금 단트롤렌 용해에 붙습니다". distractorsKo `재분류하다`·`재계산하다` → `(가루약을) 희석하다`·`(가루약을) 폐기하다`.
- w-medication `ko` "약물(투여용)"이 w-drug "약물"과 겹침 → "약(투약하는)" 같은 표기로 가르고 distractorsKo `처방전(발급용)`·`치료법(시술용)` → `처방전`·`치료법`(괄호 제거).
- 상황6 EtCO2 상승 조기 인지 · 문장1 `ko` "이 양상을 보면 조기 MH가 생각나요" → "이 양상을 보면 초기 MH가 의심돼요".
- 상황18 고칼륨 부정맥 대응 · 문장1 `ko` "포도당을 곁들인 인슐린" → "인슐린과 포도당".
- 상황13 고칼륨 감시 · 문장0 `ko` "지금 칼륨 수치를 보냅시다" → "지금 칼륨 검사를 보냅시다"(send a level = 검사 의뢰).
- 상황10 MH 감수성 환자 준비 · 문장2 `ko` "안전한 손에 맡겨져 있어요" → "안심하셔도 돼요".
- 상황11 유발약 회피 마취 · 문장2 `ko` "TIVA는 준비되어 뽑아 두었어요" → "TIVA는 뽑아 놓고 준비됐어요".
- 상황17 급속 냉각 시행 · 문장3 `en` "Let's pack ice to the groin and axillae right now." — "pack ice **in/around**"가 자연스러움 → "Let's pack ice around the groin and axillae right now.", chunks `to the groin`→`around the groin`.
- 상황15 MH 위기 발동 · 문장3 "I'm calling it — this is MH, and we start the protocol now." — 간호사 입으로 MH를 선언하는 문장인데 이 주제 slider 넷(6·7·15·5)이 "선언·단트롤렌 결정은 마취과"라고 가르친다. 비 keyPhrase라 바꿀 수 있음 → "Anesthesia's calling it — this is MH, and we start the protocol now."(chunks `I'm calling it`→`Anesthesia's calling it`). 두면 상황 역할(colleague=마취과 목소리)로 설명 가능 — 결정 요망.
- chunks 구 경계(비 keyPhrase, 고칠 것 — 9낱말 이상은 4조각 유지): 상황5 문장3(10낱말) `The EtCO2 / has been climbing / for the last / few minutes` → `The EtCO2 / has been / climbing / for the last few minutes`; 상황8 문장3(11낱말) → `His heart rate / jumped / ten points / in the last two minutes`; 상황14 문장3(8낱말) → `The color's / gotten darker / over the last hour`; 상황7 문장4(11낱말) → `I'm reporting this / early / in case / it's an MH warning sign`.
- 쉬운 단어 추가 후보(확실한 것만): w-happen(상황20, 13단어), w-think(상황6, 14단어) — 빼도 V3 여유 있음. w-safe·w-plan·w-team·w-help는 환자 안내 문장의 뼈대라 둠.
- w-stay `ko` "유지하다"는 "staying on top of it"의 뜻과 멀다 → "(놓치지 않고) 계속 붙어 있다"류. 선택.

## keyPhrase 문장 — 사용자 결정 필요 (en은 고치지 않음)
- 상황3 `Everything's stocked and in date.` — "in date"는 영국식에 가깝고 미국 병원에선 "nothing's expired / all within date"가 흔함. 유지 여부.
- 상황15 `This is malignant hyperthermia — I'm declaring it.` — 마취과의 말을 간호사 역할 앱에서 1인칭으로 학습. 유지 여부(상황 slider cue가 "anesthesiologist … speaks to the whole room"으로 이미 풀어 둠).
- 상황2 `I want it accessible before we induce.` — 간호사가 "we induce"라 말하는 것도 같은 문제(경미).
- chunks 구 경계가 끊긴 keyPhrase(보고만): 상황4 문장0 `is in / place`; 상황9 문장2 `into the crisis / assessment`; 상황10 문장0 `Because of your / MH history`; 상황16 문장2 `a lot / of vials`; 상황13 문장2 `for peaked / T waves`; 상황5 문장1·상황7 문장1 `the first / MH sign`·`an early / MH sign`.

## 종합
사실 오류는 냉각 중지 시점 `why` 하나와 카트 점검 ko 오역 하나뿐이고 둘 다 한 줄 수정이다. 그 외는 품질 문제 — distractorsEn 품사 불일치(36)·slider 길이 편향(13)·decoy 비속어(4)가 묶음으로 커서 수정 한 바퀴는 필요하다. 위 목록을 반영하면 내보내도 된다. 고칠 것 수: 뉘앙스 7 · 단어 distractorsEn 39 · distractorsKo 2 · cue 4(+7 선택) · chips 4(+3 선택) · 결정 11 14 — 약 **70건(선택 제외)**.
