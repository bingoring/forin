# fix-icu-electrolytes-A — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `icu-electrolytes.yaml`(A·B 합친 파일, 단어 278 · 상황 21 · 문장 128 · 뉘앙스 42).
비교: `base-…`, `changes-…`(128건: word 61 · sentence 43 · word-remove 24), `in-…json`, `notes-…-A.md`, `notes-…-B.md`.
대상 파일은 수정하지 않았습니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 2 | `ECG`의 오답 `EKG`는 동의어(정답 둘). 품사가 다른 오답이 약 95개. `stripper`·`impotent`·`embalm`·`tigger` 같은 불쾌하거나 고유명사인 오답 |
| 2 | distractorsKo·정답 둘·길이 | 3 | 길이는 전부 통과(스크립트). `run`→`달리다`, `free`→`무료의`가 정답 단어의 다른 뜻. `phosphate`↔`phosphorus`는 임상에서 같은 말 |
| 3 | cue | 3 | 정답 영어 노출은 없음. `ko`를 그대로 되풀이한 cue 31개(`목표`→"…정해 놓은 목표" 등) |
| 4 | chips/decoyChips | 3 | 분절은 대체로 형태소 단위. decoyChips에 `chang`·`ape`·`sod`·`die`·`kill`·`fool`·`oaf` 같은 불쾌한 조각 |
| 5 | 뉘앙스 사실 | 3 | 칼륨·칼슘·나트륨 원칙은 맞음. S4 slider가 증상성 응급 교정과 충돌, S13 `NICE`는 영국 기준(미국은 ASPEN), S18 context `cardiovert`는 TdP에 안 맞음 |
| 6 | 뉘앙스 설계 | 2 | pair 10개 중 6개가 정답 둘(`flag the trend`·`central telemetry`·`QT monitoring`·`feeding trial`·`hypertonic hyponatremia`·`consider … first`). slider 11개 중 6개가 약→강 순서가 아님 |
| 7 | 결정 11 | 4 | 변경 128건은 대부분 타당(활용형→원형, ko 겹침 가르기). 빠진 것: `bring`(구 뜻 ko), `tingle` ko 품사, `yesterday`, 18.1 ko `응원`, 18.5 ko 인칭 |

## 사실 오류·심각한 문제

1. **[안전] 1.4** `She might feel a little burning in her arm, and that's normal with this medicine.` — "정상"이라고 끝내면 침윤·혈관 밖 누출·정맥염(부종·발적·심한 통증·주입 정지)을 가족이 알리지 않습니다. 바로 뒤 1.5가 있어도 낱장은 따로 나옵니다.
2. **[안전] 15.3** `Push calcium gluconate now — don't wait for the pump.` — 응급에서 주사기로 천천히 push하는 것은 맞습니다. 그러나 속도가 빠져 있어 7.6 "We never push potassium"과 나란히 "칼슘은 push"로만 외워집니다. 글루콘산칼슘은 응급에서도 보통 2~5분(또는 그 이상)에 걸쳐 주고, 너무 빠르면 서맥·저혈압이 옵니다.
3. **[안전] 16.4** `Push one hundred mLs of three percent saline now.` — 용량(3% 100 mL 볼루스, 필요하면 반복)은 미국 전문가 패널 권고와 맞습니다. 틀린 것은 ① 동사 push(보통 10분에 걸친 볼루스 주입) ② 처방·프로토콜 맥락이 없어 간호사 단독 지시처럼 읽히는 것.
4. **[안전] 18.4** `Push two grams of magnesium over one to two minutes.` — 1~2분 push는 **무맥성** TdP일 때만 맞습니다. 이 상황은 18.1 "defibrillator ready"·18.5 "this can recur"로 보아 **맥박이 있는** 장면이고(맥박 없음은 S18 slider cue뿐), 맥박이 있으면 1~2 g을 대개 15분 안팎(문헌상 5~60분)에 걸쳐 줍니다. 빠르게 주면 저혈압·서맥.
5. **[안전] S4 slider** cue `His sodium rose five points in four hours during correction.` → 정답 `faster than we want`, why "4시간에 5가 오르면 계획보다 빨라요". 같은 주제 S16(경련하는 급성 중증 저나트륨)에서는 처음 몇 시간에 4~6 올리는 것이 **목표**입니다. cue에 만성·무증상이 없으면 학습자가 증상성 응급 교정까지 "빠르다"로 배웁니다.
6. **pair 6개 정답 둘**(아래 "뉘앙스" 참조) — 학습자가 맞히고도 틀립니다.
7. **w-ECG 오답 `EKG`** — ECG와 EKG는 같은 말이라 정답이 둘입니다.

## 고칠 것 — 문장 (keyPhrase 아님 → en·ko·chunks 수정 가능)

문장 en·ko를 바꾸는 항목은 **그 문장의 v46 필드 `why`·`decoy`·`distractorsKo`(둘 다)·`blank`(answer·options 넷)를 새 문장에 맞춰 전부 새로** 씁니다. `tag`·`icon`은 맞으면 유지.

| # | 어디 | 문제 | 고칠 것 |
|---|---|---|---|
| S-1 [안전] | 정맥 보충 안전 투여 · 문장 4 (1.4) | "that's normal"이 침윤·정맥염 신호를 묻음 | en `She might feel a little burning in her arm — tell me right away so I can slow it and check the site.` / ko `팔이 약간 따끔할 수 있어요 — 바로 말씀해 주시면 속도를 늦추고 주사 부위를 볼게요.` / chunks `She might feel` · `a little burning` · `in her arm` · `— tell me right away` · `so I can slow it` · `and check the site` · `.` / words `[w-feel, w-burn, w-arm, w-slow, w-check, w-site]`(w-normal·w-medicine 태그는 빠지나 4.2·3.0·3.3에 남음). why에 "따끔거림은 흔하지만 붓기·붉어짐·심한 통증이면 혈관 밖 누출일 수 있어 바로 알려 달라고 해요". 새 v46 필드 전부 |
| S-2 [안전] | 생명위협 고칼륨혈증 위기 · 문장 3 (15.3) | push 속도 없음 | en `Push the calcium gluconate slowly over a few minutes — don't wait for the pump.` / ko `글루콘산칼슘을 몇 분에 걸쳐 천천히 미세요 — 펌프 기다리지 마세요.` / chunks `Push the calcium gluconate` · `slowly` · `over a few minutes` · `— don't wait` · `for the pump` · `.` / words `[w-push, w-calcium, w-slow, w-wait, w-pump]`. why에 "응급이라 펌프를 기다리지 않지만 글루콘산칼슘도 2~5분에 걸쳐 밀어요 — 너무 빠르면 서맥·저혈압. 말초로도 줄 수 있고, 중심 라인이 꼭 필요한 것은 조직 손상이 큰 염화칼슘이에요". 새 v46 필드 전부 |
| S-3 [안전] | 급격 저나트륨 경련 위기 · 문장 4 (16.4) | push 동사·처방 맥락 없음 | en `Give the hundred-mL bolus of three percent saline over ten minutes, per the order.` / ko `오더대로 3% 식염수 100mL 볼루스를 10분에 걸쳐 주세요.` / chunks `Give the hundred-mL bolus` · `of three percent saline` · `over ten minutes` · `, per the order` · `.` / words `[w-give, w-percent, w-saline, w-order]`(w-push 빠짐 — 다른 6문장에 남음). why에 "16.1의 per protocol을 이어받아 오더를 확인한 볼루스라고 말해요. 경련이 계속되면 같은 용량을 반복하고, 목표는 처음 몇 시간에 4~6 올리는 것까지". 새 v46 필드 전부 |
| S-4 [안전] | 심한 저마그네슘 TdP 위기 · 문장 4 (18.4) | 맥박 있는 장면에 1~2분 push | en `Give two grams of magnesium over fifteen minutes — he still has a pulse.` / ko `마그네슘 2그램을 15분에 걸쳐 주세요 — 아직 맥박이 있어요.` / chunks `Give two grams` · `of magnesium` · `over fifteen minutes` · `— he still has` · `a pulse` · `.` / words `[w-give, w-gram, w-magnesium]`. why에 "맥박이 있으면 몇 분~십여 분에 걸쳐 주고, 맥박이 없으면 제세동과 함께 1~2분 push로 바꿔요". 새 v46 필드 전부. 15분은 흔한 기준이지만 병원 프로토콜마다 5~60분으로 다름 — "per the order"로 바꿔도 됨 |
| S-5 | 심한 저마그네슘 TdP 위기 · 문장 5 (18.5) | en은 명령형(`Stay at the bedside`)인데 ko는 1인칭 `침상 곁에 계속 있겠습니다` | ko `침상 곁에 계속 있어 주세요 — 빠르게 재발할 수 있습니다.` · distractorsKo 둘도 새 ko 틀로 다시 |
| S-6 | 심한 저마그네슘 TdP 위기 · 문장 1 (18.1, keyPhrase) | ko `응원 요청` — 응원은 '응원하다(cheer)'로 읽힘 | ko만 `제세동기 준비하고 도움을 요청하겠습니다.`(결정 11 범위) · distractorsKo 둘도 새 ko로 |
| S-7 | 저칼슘 후두경련·발작 위기 · 문장 1 (19.1, keyPhrase) | en 명령형 `Give … and protect`, ko 1인칭 `…보호하겠습니다` | (선택) ko만 `지금 정맥 칼슘 주고 기도를 보호하세요.` · distractorsKo 둘도 |
| S-8 | 심한 저마그네슘·부정맥 연계 · 문장 4 (10.4) | `antiarrhythmics that stretch the QT` — 임상에선 prolong을 씀(결정 11, 권고) | en `Check if she's on any antiarrhythmics that prolong the QT further.` / ko 유지 / chunks `Check if she's on` · `any antiarrhythmics` · `that prolong` · `the QT further` · `.` / words에서 w-stretch를 w-prolong으로 · w-stretch는 은행에서 지움(이 문장에만 쓰임) · changes에 기록. 새 v46 필드 전부 |
| S-9 | 삼투성 탈수초증 위기 · 문장 3 (17.3) | `twelve points`(단위)에 w-point(ko 가리키다) 태그 — 뜻이 다름 | words에서 w-point를 뺌(2.1에 남음). chunks `in the last ten` / `hours` 끊김 → `in the last ten hours` |
| S-10 | 고나트륨 자유수 결핍 교정 · 문장 5 (9.5) | chunks `every four to six` / `hours` 끊김 | `every four to six hours` 한 조각 |
| S-11 | 재영양증후군 예방 감시 · 문장 5 (13.5) | chunks `for the first couple` / `of days` 끊김 | `for the first` · `couple of days` |
| S-12 | 종양용해증후군 대사 관리 · 문장 3 (14.3) | chunks `for a high tumor` / `burden` — 복합명사 tumor burden을 끊음 | `for a high` · `tumor burden` |
| S-13 | 다중 전해질 붕괴 다장기 위기 · 문장 5 (20.5) | chunks `in order` / `of danger` 끊김 | `in order of danger` |
| S-14 | 생명위협 고칼륨혈증 위기 · 문장 3 / 저칼슘 위기 · 문장 5 (19.5) | 19.5 `Push calcium gluconate slowly through the central line.`와 order 19의 3줄 `That calcium is gluconate, pushed slowly through the central line.`이 "글루콘산칼슘은 중심 라인 필수"로 읽힘 | en은 틀리지 않음(중심 라인이 있으면 써도 됨). 19.5 `why`에 "글루콘산칼슘은 말초로도 되고, 중심 라인이 필요한 것은 염화칼슘"을 넣기(B 수정 담당과 함께) |
| S-15 | 이 상황 전체 (S18) | 맥박 유무가 문장마다 다름 | S-4로 문장을 "맥박 있음"으로 통일. S18 slider(맥박 없음 → 제세동)는 "만약 맥박이 없어지면"의 다른 장면으로 남겨도 됨 |

**order 카드 파급(B·수정 담당 참조)** — 위 문장을 바꾸면 같은 말을 쓴 order 줄도 맞춰야 합니다:
- S16 3줄 `That means pushing one hundred mLs of three percent saline now.` → S-3에 맞게(`That means a hundred-mL bolus of three percent saline over ten minutes.`).
- S18 2줄 `Push two grams of it over one to two minutes.` → S-4에 맞게(`Give two grams of it over fifteen minutes.`).
- S10 4줄 `…antiarrhythmics that stretch the QT further.` → S-8을 반영하면 `prolong`.
- S19 3줄 `That calcium is gluconate, pushed slowly through the central line.` → S-14의 경로 구분이 why에 드러나게.

## 고칠 것 — 단어 (v45)

| # | id | 문제 | 고칠 것 |
|---|---|---|---|
| W-1 | w-ECG | distractorsEn `EKG` = 동의어(정답 둘) | `EKG` → `EMG` |
| W-2 | w-run | distractorsKo `달리다` = run의 다른 뜻(정답 둘) | `달리다` → `희석하다` |
| W-3 | w-free | distractorsKo `무료의` = free의 다른 뜻(정답 둘). cue "물과 따로 떨어져…"는 free water 뜻(용질 없는 물)과 어긋남 | `무료의` → `농축된`. cue `용질이 하나도 녹아 있지 않은 순수한 물을 말할 때 water 앞에 붙는 말`(영어 water는 다른 은행 단어라 노출 아님) |
| W-4 | w-phosphate | distractorsEn `phosphorus` — 검사지·구두로 phosphate와 같은 뜻으로 씀 | `phosphorus` → `phosphatase` |
| W-5 | w-strip | distractorsKo `검사지` — rhythm strip(기록지)과 거의 같은 말 | `검사지` → `동의서` |
| W-6 | w-risk | distractorsKo `가능성` — risk는 '나쁜 일이 생길 가능성'이라 겹침 | `가능성` → `이점` |
| W-7 | w-risk / w-danger | ko `위험성`/`위험도`는 한국어로 거의 같아 changes가 의도한 가르기가 안 됨 | w-danger ko `위급한 정도`(20.5 "in order of danger" = 위급한 순서) |
| W-8 | w-stridor | distractorsEn `stripper` — 성적 함의 | `stripper` → `stertor`(같은 분야, 코골이 같은 호흡음) |
| W-9 | w-important | distractorsEn `impotent` — 성적 함의 | `impotent` → `imported` |
| W-10 | w-imbalance | distractorsEn `embalm`(시신 방부 처리, 동사) — 불쾌·품사 다름 | `embalm` → `ambulance` |
| W-11 | w-trigger | distractorsEn `tigger` — 사전에 없는 고유명사 | `tigger` → `tremor` |
| W-12 | w-fail | distractorsEn `fall`·`fall off` — 둘이 같은 말 | `fall off` → `flail` |
| W-13 | w-bring | ko `(수치를) 낮추다`는 bring 혼자의 뜻이 아님(듣고 뜻 고르기에서 틀린 뜻을 가르침). 문장 14.4에 `bring down`이 붙어 있음 | 결정 11: en `bring down`, chips `[[bring],[down]]`, ipa `/brɪŋ ˈdaʊn/`, distractorsEn `[bring up, break down]`, decoyChips `[brink, dawn]`, cue에서 `'___ down'` 표기 삭제(정답 노출) · changes에 기록 |
| W-14 | w-tingle | ko `저림`(명사)인데 헤드워드는 동사, distractorsKo `가렵다`·`붓다`는 동사 | ko `저리다`, cue 끝을 "…저리는 느낌이 드는 일" |
| W-15 | w-yesterday | `today`와 같은 급의 쉬운 말(공통 목록과 같은 기준) | 결정 11: 14.3 words에서 빼고 은행에서 지움(S14는 30단어라 V3 여유) · changes에 기록 |
| W-16 | w-help | 18.1 `call for help`는 명사 — ko `도움이 되다`와 어긋남 | 결정 11: 18.1 words에서 w-help를 뺌(0.2·3.2에 남음) |
| W-17 | w-seize | cue "온몸의 힘이 제멋대로 풀려" — 전신 발작은 굳고 떪 | cue `온몸이 굳거나 떨리면서 의식을 잃는 일 — 지금 진행 중일 때 쓰는 꼴` |
| W-18 | w-acid | cue 문장이 비문("혈액이 너무 많으면") | cue `신맛이 나는 성분 — 혈액에 너무 많으면 몸이 산성으로 기운다` |
| W-19 | cue가 ko 되풀이 (31개) | `ko`가 카드에 이미 있어 단서가 안 됨 | w-number·w-result·w-flag·w-slow·w-point·w-send·w-widen·w-page·w-resident·w-pressure·w-stop·w-lab·w-direction·w-squeeze·w-push·w-both·w-watch·w-quickly·w-rate·w-raise·w-case·w-weaken·w-try·w-goal·w-ensure·w-early·w-sine·w-wait·w-urgent·w-worse·w-start — 장면(언제·누구에게)으로 다시. 예: w-goal `영양팀과 하루 칼로리를 어디까지 채울지 정해 둔 값`, w-wait `펌프가 준비될 때까지 손을 놓고 있는 일 — 위기에서는 하면 안 됨`, w-start `영양 공급을 처음 켜는 순간` |
| W-20 | w-QT | cue "Q파 시작부터 T파 끝까지"가 철자를 그대로 줌 | cue `심실이 수축했다 회복하기까지의 심전도 간격 — 저마그네슘이면 길어진다` |
| W-21 | 태그 | 부사·한정사에 `일반 동사` 태그: w-close·w-soon·w-through·w-first·w-then·w-again·w-finally·w-both·w-down·w-case·w-never | 이것들을 `상태·정도`로(또는 `일반 표현`을 새로 두고 통일) |
| W-22 | chips | 형태소와 어긋난 분절 | w-telemetry `[[tele, me, try]]`, w-demyelination `[[de, myelin, ation]]`, w-hypertonic `[[hyper, ton, ic]]` |

### decoyChips — 비속어·불쾌한 조각 (전수 268개 확인)

- **1차(바꿀 것):** w-change `chang`(성씨 — 아시아계 비하 흉내로 쓰임) → `chain` · w-acute `ape`(인종 비하로 쓰임) → `act` · w-sodium `sod`(영국 비속어) → `soda` · w-diuretic `die` → `dew` · w-dialysis `die` → `dial`(투석 환자 앞에서 "die") · w-muscle `kill` → `cell` · w-careful `fool`(욕) → `fill` · w-often `oaf`(욕) → `off`.
- **2차(권고):** w-flag `flab`(체형 비하) → `flat` · w-deficit `deaf`(장애) → `deft` · w-help `hemp`(대마) → `helm` · w-monitor `moan`(성적 함의 가능) → `moon` · w-control `troll` → `roll`.
- 그대로 둬도 됨: `gin`·`rum`·`ale`·`war`·`wart`·`mad`·`acne`·`ick` — 불쾌하지 않음. 사전에 없는 조각(`boid`·`wholl`·`wacht`·`clos`·`tass`·`sys`)은 해롭지 않으나 닮은 실제 낱말이 더 좋음.

### distractorsEn 품사 불일치 — 전부 (108개 단어)

정답 품사와 다른 오답 전부입니다(같은 철자 혼동이라도 품사가 다르면 brief상 `decoyChips` 몫). 대체 제안은 **문제의 오답만** 바꾸는 것이고, 같은 품사인 다른 오답은 그대로 둡니다. 대체어마다 길이 규칙(1.25배·3자 이내)과 은행 안 동의어 여부를 다시 확인하세요.

| id (정답 품사) | 다른 품사 오답 | 대체 제안(같은 품사) |
|---|---|---|
| w-balance (v) | valance (n) | `bolster` |
| w-sodium (n) | sodden (adj) | `stadium` |
| w-safe (adj) | save (v) | `same` |
| w-follow (v) | fellow (n), hollow (adj) | `allow`, `swallow` |
| w-help (v) | held (과거형) | `heal` |
| w-high (adj) | hide (v), hi (감탄사) | `huge`, `light` |
| w-keep (v) | keen (adj) | `keel` |
| w-blood (n) | bold, blond (adj) | `bloom`, `flood` |
| w-number (n) | numb (adj) | `lumber` |
| w-move (v) | mode, mood (n) | `prove`, `mow` |
| w-right (adj) | rite (n) | `tight` |
| w-soon (adv) | seen (과거분사), sound (n) | `still`, `late` |
| w-back (adv) | pack (n/v), black (adj) | `away`, `behind` |
| w-document (v) | doctrine (n), dormant (adj) | `docket`, `comment` |
| w-give (v) | gift (n) | `dive` |
| w-slow (slowly, adv) | slope, snow (n) | `lowly`, `slightly` |
| w-through (prep) | though (conj), thorough (adj) | `toward`, `around` |
| w-vein (n) | vain (adj) | `vine` |
| w-heart (n) | heard (v) | `hearth` |
| w-monitor (v) | motor (n) | `mention` |
| w-pump (n) | plump (adj) | `lump` |
| w-fast (adj) | fist (n) | `vast` |
| w-medicine (n) | medicate (v) | `machine` |
| w-often (adv) | soften (v), orphan (n) | `seldom`, `oddly` |
| w-peak (peaked, adj) | peek (v), pique (n) | `piqued`, `packed` |
| w-wave (n) | wove (과거형) | `wage` |
| w-long (adj) | lung, loan (n) | `lone`, `wrong` |
| w-low (adj) | law, lot (n) | `slow`, `lone` |
| w-stat (adv) | staff, stall (n) | 수정 담당(같은 품사 후보가 마땅치 않음 — `stet`은 낯선 말) |
| w-tell (v) | tall (adj) | `toll` |
| w-show (v) | shoe (n) | `sow` |
| w-widen (v) | widow (n), wide (adj) | `weaken`, `wizen` |
| w-grab (v) | grad, crab (n) | `grip`, `grub` |
| w-page (v) | pad (n) | `paste` |
| w-resident (n) | residual (adj) | `residue` |
| w-change (v) | chance (n) | `chafe` |
| w-trigger (n) | tigger (고유명사) | `tremor` (W-11) |
| w-whole (adj) | hole, wheel (n) | `hollow`, `holy` |
| w-happen (v) | happy (adj) | `hasten` |
| w-again (adv) | against (prep), agent (n) | `around`, `along` |
| w-work (v) | word (n) | `worry` |
| w-frequent (adj) | fragment, frequency (n) | `fervent`, `fluent` |
| w-direction (n) | direct (v/adj) | `diction` |
| w-adjust (v) | adjunct (n) | `adapt` |
| w-plan (n) | plain (adj) | `plane` |
| w-new (adj) | now (adv), nine (수사) | `few`, `due` |
| w-imbalance (n) | imbibe, embalm (v) | `ambulance` (W-10), `imprudence` |
| w-strength (n) | strengthen (v) | `stretch` |
| w-race (v) | rice, rate (n) | `raise`, `rake` |
| w-muscle (n) | muscular (adj) | `muzzle` |
| w-strong (adj) | string (n) | `strung` |
| w-first (adv) | fist (n), forced (adj) | `last`, `fast` |
| w-stabilize (v) | stabilizer (n) | `sanitize` |
| w-then (adv) | than (conj), them (pron) | `there`, `thence` |
| w-insulin (n) | insulate, instill (v) | `inulin`, `inositol` |
| w-cell (n) | sell (v) | `sill` |
| w-remove (v) | remote (adj) | `reprove` |
| w-run (v) | rug (n) | `ruin` |
| w-both (det) | bath, booth (n) | `either`, `neither` |
| w-peripheral (adj) | peripheries, perimeter (n) | `perinatal`, `spherical` |
| w-telemetry (n) | telemarket (v) | `telemedicine` |
| w-normalize (v) | normalcy (n) | `nominalize` |
| w-limit (v) | lime (n) | `lift` |
| w-estimate (v) | estimator (n) | `emulate` |
| w-deficit (n) | deficient, definite (adj) | `defect`, `deposit` |
| w-guide (v) | guilt (n) | `glide` |
| w-down (adv) | gown, dawn (n) | `out`, `up` |
| w-choose (v) | shoes (n) | `chase` |
| w-regular (regularly, adv) | regional, singular (adj) | `regionally`, `singularly` |
| w-prolong (v) | profound (adj) | `prolapse` |
| w-climb (v) | clime, limb (n) | `clamp`, `cling` |
| w-stretch (v) | struck (과거형) | `strain` (S-8을 반영하면 단어 삭제) |
| w-further (adv) | father, feather (n) | `faster`, `fuller` |
| w-gram (n) | grim (adj) | `dram` |
| w-tingle (v) | single (adj) | `mingle` |
| w-careful (carefully, adv) | carefree, careless (adj) | `carelessly`, `cheerfully` |
| w-sign (n) | sing (v) | `sight` |
| w-weaken (v) | weapon (n) | `waken` |
| w-wean (weaning, n) | weigh, wane (v) | `weighing`, `waning` |
| w-tidal (adj) | title (n) | `total` |
| w-small (adj) | smell, smile (n/v) | `smart`, `tall` |
| w-try (v) | tray (n) | `cry` |
| w-crash (v) | brash (adj) | `clash` |
| w-advance (v) | advice (n), adverse (adj) | `advise`, `adhere` |
| w-calorie (n) | caloric (adj), colorize (v) | `calamine`, `gallery` |
| w-uric (adj) | urine, urea (n) | `ionic`, `lyric` |
| w-suggest (v) | sugar (n) | `sustain` |
| w-tumor (n) | tumble (v) | `tremor` |
| w-activate (v) | activity (n) | `captivate` |
| w-emergent (adj) | emergency (n) | `divergent` |
| w-wait (v) | weight (n), white (adj) | `wade`, `bait` |
| w-call (v) | cell (n) | `cull` |
| w-seize (seizing, v-ing) | seed, size (n) | `seeing`, `sizing` |
| w-convulse (v) | convulsion (n) | `convene` |
| w-urgent (urgently, adv) | surgery (n) | `currently` |
| w-slur (slurred, adj) | slurp, blur (v) | `blurred`, `slurped` |
| w-well (adv) | wall (n), will (조동사) | `still`, `ill` |
| w-worse (adj) | worm (n) | `wordy` |
| w-multiple (adj) | multiply (v) | `multiplex` |
| w-off (adj) | our (pron) | `oft` |
| w-treat (v) | trait (n) | `trek` |
| w-kidney (n) | kindly (adv) | `chimney` |
| w-liver (n) | livid (adj) | `river` |
| w-lung (n) | long (adj) | `lunge` |
| w-value (n) | vague (adj) | `venue` |
| w-tackle (v) | tackler (n) | `shackle` |
| w-never (adv) | nerve (n) | `nearly` |
| w-set (v) | sat (과거형) | `sew` |

## 고칠 것 — 뉘앙스

### pair — 모든 결합 출력 후 판정

| # | 상황 | 정답 말고 성립하는 결합 | 고칠 것 |
|---|---|---|---|
| N-1 | S0 전해질 패널 추세 사정 | `flag the trend`(0.6 문장 그대로 "flag it"), 결합 `draw the blanket`(커튼·담요를 끌어당기다)도 자연스러움 | pairs `[[safe, range], [draw, blood again], [flag, the critical value]]`, decoys `[the lunch tray]`, words `[w-safe, w-draw, w-flag]`, why를 새 짝에 맞게 |
| N-2 | S7 저칼륨혈증 보충 | `central telemetry`(중앙 모니터링실 — 실제 용어) | pairs `[[central, line], [low, potassium], [frequent, PVCs]]`, decoys `[diet tray]`(`low bedside light`가 되므로 decoy도 교체), words `[w-central, w-low, w-frequent]`, why에서 telemetry 설명 대신 저칼륨 |
| N-3 | S10 저마그네슘·부정맥 | `QT monitoring`·`magnesium monitoring` 모두 실제 표현 | pairs `[[QT, prolonging drugs], [magnesium, sulfate], [draw up, the dose]]`, decoys `[blood sugar]` 유지, words `[w-QT, w-magnesium, w-draw]`, why에 "draw up은 주사기에 미리 뽑아 두기" |
| N-4 | S12 저인산혈증 | `feeding trial`, `feeding volume` 성립 | pairs `[[tidal, volume], [phosphate, replacement], [weaning, trial]]`, decoys `[water bottle]` 유지, words `[w-tidal, w-phosphate, w-wean]` |
| N-5 | S16 급격 저나트륨 경련 | `hypertonic hyponatremia`(실제 진단명) | pairs `[[hypertonic, saline], [actively, convulsing], [seizure, protocol]]`, decoys `[heart rate]` 유지, words `[w-hypertonic, w-convulse, w-seizure]`, why에 actively convulsing |
| N-6 | S20 다중 전해질 붕괴 | `consider the deadliest problem first`, `escalate the deadliest problem first` 성립. `consider a blood sample`도 문법상 됨 | pairs `[[escalate, to the intensivist], [consider, dialysis], [critically, off]]`, decoys `[on the menu]`, words `[w-escalate, w-consider, w-critical]`, why에서 tackle 대신 critically off |

정답 하나로 확인된 pair: S2(`peaked T waves`·`widened QRS complex`·`long QT interval`), S13, S14, S17.

### slider — 약→강 순서

| # | 상황 | 문제 | 고칠 것 |
|---|---|---|---|
| N-7 | S1 정맥 보충 | `[slow…check, ignore…faster, take the line out]` 순서 아님 | `[ignore it and run it faster, slow it down and check the site, take the line out right away]`, answerAt 1 |
| N-8 | S3 원인 병력 | `[no effect, can change, only overdose]` 순서 아님 | `[no effect on her levels at all, only matters in an overdose, can change her potassium and sodium]`, answerAt 2 |
| N-9 | S6 고칼륨 단계 | 대응 강도 순서 아님 | `[wait for the dialysis team to arrive, recheck the lab again in an hour, give calcium to protect the heart]`, answerAt 2 |
| N-10 | S8 저나트륨 교정 | `[normal by tonight, 8~10, by twenty]` 양 순서 아님 | `[raise it by eight to ten at most, raise it by twenty to be on the safe side, raise it to a normal sodium by tonight]`, answerAt 0 |
| N-11 | S15 고칼륨 위기 | 순서 아님 | `[send a routine lab and wait for it, recheck the potassium in an hour or so, treat now and prepare dialysis]`, answerAt 2 |
| N-12 | S19 저칼슘 위기 | 순서 아님 | `[watch him for another hour or so, order a chest x-ray before anything else, give IV calcium and prepare to intubate]`, answerAt 2 |
| N-13 [안전] | S4 교정 중 재검 | cue에 만성·무증상이 없어 증상성 응급 교정(S16: 처음 몇 시간 4~6)까지 "빠르다"로 배움 | cue `Colleague: "Chronic, no symptoms — his sodium rose five points in four hours."`, why에 "증상 없는 만성 저나트륨이라 하루 한도 8~10에 비해 빨라요(경련 같은 중증 증상이면 처음 몇 시간 4~6을 올리는 것이 목표)" |
| N-14 | S5 증상 사정 | cue "only for a little while"(금방 떨어짐)은 a little / very weak 어느 쪽도 됨 | cue `Patient: "My arms feel a bit tired, but I can lift them fine."` |

순서가 맞는 slider: S4, S5, S9, S11, S18.

### context (v46 7번 — 핸드오프 모양)

word가 세 장면 en 모두에 있음(21/21), 어색한 장면이 전부 "듣는 사람에게 안 맞는 임상어"로 같은 뜻 — 모양은 맞습니다. 고칠 것:

| # | 상황 | 문제 | 고칠 것 |
|---|---|---|---|
| N-15 | S10 | word `monitor`가 세 장면 모두 명사(cardiac monitor)인데 ko `모니터링하다` | context `ko: 모니터` |
| N-16 | S13 | 어색 장면·why의 `NICE criteria`는 영국 지침. 미국 병원은 ASPEN 기준 | 장면 en `He meets ASPEN criteria for high risk of refeeding syndrome.`, why의 NICE → ASPEN |
| N-17 | S18 | 어색 장면 `ready to cardiovert` — TdP(다형성 VT)는 동기화 심율동전환이 아니라 제세동 | `The unit is charged and ready to defibrillate per the ACLS algorithm.`, why의 cardiovert → defibrillate |
| N-18 | S11 | 어색 장면 `Symptomatology includes … QT prolongation` — QT 연장은 증상이 아니라 소견 | `Symptomatology includes perioral paresthesia and carpopedal spasm, so symptom monitoring continues.` |

swap 문항은 이 주제에 없습니다 — swap `ko` 점검 해당 없음.

## 칼륨 투여 원칙 점검 (요청 사항)

- IV push 금지: 7.6 `We never push potassium — it always goes in slowly through the pump.`와 why "밀어 넣으면 심정지" — 맞음.
- 말초 농도·속도 상한: 콘텐츠에 **수치가 없습니다**(틀린 것이 아니라 없음). 1.0(keyPhrase) "slowly and at a safe concentration", 7.4 "central line since peripheral would burn", S7 pair why "진한 칼륨은 … 중심 라인" 모두 정성적으로 맞음. 넣고 싶으면 1.0의 `why`(en은 keyPhrase라 그대로)에 "말초는 대개 시간당 10 mEq·100 mL당 10 mEq 이하, 중심 라인은 시간당 20 mEq 안팎까지(지속 심전도 감시, 병원 지침 따라)"를 더하는 안. 수치는 병원마다 다르니 "병원 지침에 따라"를 꼭 붙이세요.
- 고칼륨 응급 순서(칼슘 → 인슐린+포도당 → 이뇨제·투석): 6.0~6.2·15.1·S6 slider why — 맞음. "칼슘은 칼륨을 낮추지 않는다"도 맞음.
- 저나트륨 교정 상한: 8.3 "eight to ten over twenty-four hours"·S8 slider why "8~10" — 미국 전문가 패널(대개 10~12, 고위험 8)보다 보수적이라 안전 쪽. S16 context "eight over twenty-four"와 숫자가 조금 다르지만 둘 다 허용 범위.
- 칼슘 글루콘산 vs 염화칼슘: 콘텐츠에 염화칼슘 언급 없음. S-2·S-14로 why에 경로 구분을 넣기를 권합니다.

## 저작자 메모 판정

- A① 15.3 칼슘 push — **타당**, S-2.
- A② 16.4 3% 100 mL — **타당**(용량은 맞고 동사·처방 맥락이 문제), S-3.
- A③ 18.4 Mg 1~2분 — **타당**, 상황이 맥박 있음이라 S-4·S-15.
- A④ 1.4 "that's normal" — **타당**, S-1.
- A⑤ 삼투성 탈수초증 1·3번 서술문 — 이상 없음(팀 보고 문장).
- A⑥ `seizing`·`rounds`·`electrolytes`·`salts`·`free` 관용형 유지 — 동의. 단 w-free distractorsKo·cue는 W-3.
- A⑦ `close`→`closely` — 타당.
- A⑧ ko 겹친 7쌍 가르기 — 대체로 타당. 단 risk/danger는 `위험성`/`위험도`로 실제로 갈리지 않음(W-7).
- B① push 표현(16.4·18.4·19.5) — 16.4·18.4는 위와 같음. 19.5는 en 유지, why만(S-14).
- B② 8.3 단위 생략 — 구두 지시에서 자연스러움, **유지**.
- B③ 처치 지시문 distractorsKo 두 개 모두 정답보다 김 — B 검토 범위. A는 언급만.
- B④ order S4 2↔3 — `each draw`/`If one shows`로 고정돼 이상 없음.

## changes 목록 판정

61 word·43 sentence·24 word-remove — 활용형→원형, 쉬운 말 태그 빼기, ko 겹침 가르기 모두 타당합니다. 과하거나 틀린 변경은 없음. 다만 `w-bring` ko 변경은 헤드워드가 그대로라 반쪽(W-13), `w-monitor` ko `모니터링하다`는 명사로 쓰인 2.5·7.3·10.2와 어긋남(context는 N-15로 해결, 은행 ko는 `모니터(링하다)`도 고려).

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

**청크 경계 끊김**

| 문장 | 현재 chunks | 문제 | 대안 |
|---|---|---|---|
| 1.0 `We give potassium slowly and at a safe concentration.` | `slowly` / `and at` / `a safe concentration` | 전치사 at을 목적어와 떼어 놓음 | `slowly` / `and` / `at a safe concentration` |
| 4.1 `Frequent labs help us avoid over- or under-correcting.` | `avoid over-` / `or under-correcting` | over-를 혼자 떼어 놓음 | `avoid` / `over- or under-correcting` |
| 16.0 `He's seizing from acute severe hyponatremia.` | `from acute` / `severe hyponatremia` | 수식어 둘을 갈라 놓음 | `from` / `acute severe hyponatremia` |
| 19.2 `Let's monitor his heart and recheck the ionized calcium.` | `the ionized` / `calcium` | 형용사-명사를 끊음 | `the ionized calcium` |

**en이 어색함 (선택)**

| 현재 en | 문제 | 대안 en |
|---|---|---|
| 0.0 `We check his electrolytes to see how his body is balancing.` | 자동사 `balancing`은 어색(무엇의 균형인지 없음) | `We check his electrolytes to see how well his body is keeping them balanced.` |
| 14.1 `Let's ensure aggressive fluids and check for low calcium.` | `ensure aggressive fluids`는 잘 안 쓰는 결합 | `Let's start aggressive fluids and check for low calcium.` |
| 15.2 `Let's activate emergent dialysis to remove the potassium.` | `activate`는 팀·코드에 쓰고 투석에는 잘 안 씀 | `Let's call for emergent dialysis to remove the potassium.` |

**결정 불필요:** 18.0 `This is Torsades — give IV magnesium now.` — 맥박이 있는 TdP에 마그네슘이 첫 약이라 맞음. 맥박이 없을 때의 제세동은 S18 slider가, 투여 속도는 S-4가 보완.

## 종합

고칠 것 **68건**(문장 15 · 단어 22 · decoyChips 13 · 뉘앙스 18; 품사 불일치 표 108단어는 별도) 중 **안전 5건**(S-1·S-2·S-3·S-4·N-13). 칼륨·고칼륨·나트륨 교정의 큰 원칙은 맞으나, push 세 문장·"정상" 안심 문장·S4 slider는 고친 뒤에 내보내야 합니다. pair 6개와 slider 6개는 설계를 다시 해야 정답이 하나가 됩니다. 이것들을 반영하면 내보내도 됩니다.
