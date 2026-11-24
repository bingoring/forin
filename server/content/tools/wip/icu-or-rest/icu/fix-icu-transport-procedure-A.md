# icu-transport-procedure — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `icu-transport-procedure.yaml`(A·B 합본). 단어 279, 상황 21(문장 147), 뉘앙스 43(context 21 · slider 20 · pair 1 · swap 1 · reel 0). 뉘앙스는 전부 이번에 새로 쓴 것(base에 없음).
임시 스크립트: `rv_icu-transport-procedure_dump.py`(words/sents/ctx/slider/pairfull/swap/checks), `rv_icu-transport-procedure_chunk.py`(청크 개수 검사), `rv_icu-transport-procedure_prop.py`(고칠 문장의 example·order·v46 필드 전파 확인).

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 철자·소리 닮음이 대체로 좋다. 품사가 다른 것 9개(★ 4), 정답으로도 읽히는 것 2개(lightly·clear) |
| 2 distractorsKo·길이 | 4 | 길이 규칙은 전부 통과. `수면`(sedation)·`한 판`(round)은 정답이 둘. ko가 정답 영어 그대로인 것 2개(MRI·SBAR) |
| 3 cue | 4 | 정답 노출 없음. ko를 되풀이한 것 2개(scan·give), ASA cue에 약어 풀이 |
| 4 chips/decoyChips | 4 | 자르기는 대체로 형태소 단위. 마약·성적·술 속어 조각 몇 개(pot·joint·hump·frisky·chick·rye·lit·sin) |
| 5 뉘앙스·문장 사실 | 3 | MRI `not scanned`(선별을 검사로 씀), MRI 심정지 때 압박 시작 시점(KP), 도움 요청 기준이 늦음, 재삽관 약속, slider MAP 62를 borderline으로 |
| 6 뉘앙스 설계 | 3 | context 4개는 일반인도 아는 말을 word로 골랐고 fix에도 그 말이 남는다. slider 2개는 정답이 둘(slipping/dropping, clean/dirty). pair·swap은 맞음 |
| 7 결정 11 | 4 | 42단어(약 15%)를 손댔지만 ko 중복 9쌍 가르기와 공통 쉬운 단어 빼기라 타당하다. 다만 hold의 새 ko가 stop·keep과 겹치고, unit의 새 ko에 문장 ko 4개가 안 따라왔고, 태그 2개가 ko와 어긋난다 |

## 사실 오류·심각한 문제
1. **MRI 중 응급상황 대응 3 "Everyone not scanned stays outside the room."** — MRI 안전 규칙은 "안전 선별(screening)을 받지 않은 사람은 Zone IV에 못 들어간다"입니다. `scanned`는 "검사(촬영)를 받은"이라 뜻이 틀렸고, ko `검사받지 않는 사람`이 오해를 그대로 가르칩니다. 코드 상황에서 선별 안 된 코드팀이 자석 방에 들어가는 것이 대표 사고라 안전 문제입니다(S1).
2. **MRI 중 응급상황 대응 2 (KP) "Start compressions the moment we clear the magnet."** — ACR MR 안전 지침은 Zone IV에서 심정지가 나면 MR 인력이 **환자를 Zone IV 밖으로 옮기는 동안** BLS·CPR을 바로 시작하라는 쪽입니다(가슴 압박에는 금속 장비가 필요 없음). 이 문장은 압박을 자석 구역을 벗어날 때까지 미룹니다. 같은 상황 slider `why`("밖으로 먼저 옮기고 거기서 소생을 이어가요")와 v46 `why`("손은 쓸 수 있으니 벗어나자마자 시작해요")가 서로 어긋나고, in-json tagline("get her out of the magnet before we do anything!")도 같은 생각입니다. KP라 en은 사용자 결정(아래 KP 목록 1).
3. **시술 진정 중 활력·기도 감시 4 "I'll call for help if she doesn't respond to stimulation."** — 호흡수가 느려지고 SpO2가 떨어지는 장면(같은 상황 1·3)인데, 도움 요청 기준이 "자극해도 반응이 없으면"입니다. 그때는 이미 깊은 진정·전신마취 수준이라 늦습니다. 같은 상황 slider `why`("숫자가 내려가는 동안 … 필요하면 바로 도움을")와도 다릅니다(S2).
4. **이송 중 발관·라인 이탈 위기 5 "We'll re-intubate as soon as we're back in the unit."** — 재삽관은 의사·마취·RT 팀이 하고 결정하는 일인데, 간호사가 약속하는 말입니다. order 4줄 "Once we get back, we'll re-intubate in the unit."도 같습니다(S3).
5. **원내 이송 전 안정성 평가 slider** — cue `MAP is 62 on the same pressor dose`를 `borderline`이라 하고, why가 "수치가 아직 목표 안이어도"라고 합니다. 보통 MAP 목표는 65 이상이라 62는 목표 **밖**입니다. 목표 밖인 환자를 "경계선"으로 가르쳐 이송해도 될 것처럼 읽힙니다(N1).

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en이나 ko를 바꾸면: `chunks`·`ko`·`words`를 함께 맞추고, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 그 문장을 `example`로 쓰는 단어의 `example`·`exKo`를 맞추고, order 줄에 같은 문장이 있으면 맞추고, `changes-icu-transport-procedure.yaml`에 적습니다. **ko만 바꿔도 distractorsKo 둘은 새 ko에 맞춰 다시 씁니다.**

- **S1 [안전] MRI 중 응급상황 대응 3** · en `Everyone not screened stays outside the room.` · chunks `Everyone / not screened / stays / outside the room / .` · ko `MRI 안전 선별을 받지 않은 사람은 방 밖에 있어야 해요.` · words `[w-screen, w-stay]`. 이 문장을 example로 쓰는 단어 없음, order 없음. v46 필드 새로(why는 "screened = 금속·이식물 선별을 마쳤다는 뜻").
- **S2 [안전] 시술 진정 중 활력·기도 감시 4** · en `I'll call for help if her breathing doesn't improve with stimulation.` · chunks `I'll call for help / if her breathing / doesn't improve / with stimulation / .`(11낱말·4조각, 검사 통과) · ko `자극해도 호흡이 나아지지 않으면 도움을 부를게요.` · words `[w-call, w-help, w-improve, w-stimulation]`. w-respond는 시술 진정 깊이 적정 0에 남음. **example 전파:** w-call·w-help·w-respond·w-stimulation이 이 문장을 example로 씀 → w-call·w-help·w-stimulation은 새 문장으로, w-respond는 `At moderate sedation she responds to voice and keeps her airway.` / `중등도 진정에서는 목소리에 반응하고 스스로 기도를 유지해요.`로. 상황 단어 수 26 → 변화 없음(V3 안전). v46 필드 새로.
- **S3 [안전·범위] 이송 중 발관·라인 이탈 위기 5** · en `The airway team will meet us back in the unit to re-intubate.` · chunks `The airway team / will meet us / back in the unit / to re-intubate / .`(검사 통과) · ko `기도 팀이 중환자실에서 우리를 맞아 재삽관할 거예요.` · words `[w-airway, w-team, w-back, w-unit, w-reintubate]`. w-reintubate·w-back example/exKo를 새 문장으로. **order 4줄**(`Once we get back, we'll re-intubate in the unit.` / `돌아가면 병동에서 재삽관할게요`)도 `Once we're back, the airway team will re-intubate him.` / `돌아가면 기도 팀이 재삽관할 거예요`처럼 팀 주어로(order는 B 몫이지만 같은 문제라 함께). v46 필드 새로.
- **S4 [ko·결정 11] `the unit`의 ko** — w-unit ko를 `중환자실`로 바꿨는데 문장 ko가 `병동`에 남았습니다. ① 원내 이송 전 안정성 평가 6 ko → `뭔가 바뀌면 우리는 중환자실에 머물러요.` ② 이송 중 악화 대비 계획 3 ko → `중환자실을 나서기 전에 역할을 합의해요.`(order 0줄 ko도 같이) ③ 이송 중 발관·라인 이탈 위기 1 (KP, ko만) → `기도 키트를 불러 주고 중환자실로 돌아가게 해 주세요.` ④ 같은 상황 5는 S3에서 해결. w-unit exKo(`…병동에 머물러요`)도 ①에 맞춤. 각 문장 distractorsKo 둘 다시.
- **S5 [ko] 검사실 안전 6** · ko `그에게 있는 모든 건 스캐너용으로 확인됐어요.` → `몸에 지닌 것은 모두 스캐너에 들여도 된다고 확인을 마쳤어요.` (cleared = 통과·허가). w-scanner exKo 같이, distractorsKo 둘 다시.
- **S6 [ko] MRI 중 응급상황 대응 1 (KP, ko만)** · `…안전 구역으로 반출해요.` → `…안전 구역으로 대피시켜요.` 사람에게 `반출`은 물건 말입니다. w-evacuate·w-safe exKo 같이(단어 쪽은 W22). distractorsKo 둘 다시.

### chunks (keyPhrase 아님 — 구 경계를 끊은 것만, 전부 V5 개수 검사 통과 확인)
chunks만 바꿔도 그 문장의 `decoy`가 새 청크와 겹치거나 대신 들어가지 않는지 다시 보고 changes에 `fields: [chunks]`로 적습니다.
- **K1 병원간 이송 인계·문서 4** `Right now / he's on / two liters / of oxygen and stable` → `Right now / he's on / two liters of oxygen / and stable / .`
- **K2 병원간 이송 인계·문서 3** `… / and a rising / troponin` → `He came in / with chest pain / and / a rising troponin / .`(order 0줄에 같은 말이 있으면 확인)
- **K3 시술 중 대량출혈 급변 6** `Surgery is / on their way down / right now` → `Surgery / is on their way down / right now / .`
- **K4 이송 위험-이익 판단 소통 3** `Right now / she's on / the edge / of needing more support` → `Right now / she's on the edge / of needing / more support / .`(관용구 on the edge of를 살림)
- **K5 이송 위험-이익 판단 소통 4** `… , we may not / catch it in time` → `If she gets worse / mid-scan / , we may not catch it / in time / .`
- **K6 이송 중 심정지 대응 6** `Rhythm / check / — everyone clear` → `Rhythm check / — everyone clear / .`
- **K7 이송 중 산소·전원 소진 위기 6** `We made it / back / before anything ran out` → `We made it back / before anything / ran out / .`
- **K8 MRI 중 응급상황 대응 4** `… / those double / doors` → `The safe zone / is / just past / those double doors / .`
- **K9 이송 중 악화 대비 계획 4** `… / the emergency / call button` → `If / the elevator stalls / , we hit / the emergency call button / .`
- **K10 베드사이드 시술 보조 5** `… / more local / anesthetic` → `Let me know / if you need / more / local anesthetic / .`
(`before I / step out`·`before we / move him`·`has plenty / of charge`·`to a regular / monitoring schedule`·`with each breath / I give`도 어색하지만 4조각 규칙을 지키며 구 경계로 다시 자를 방법이 마땅치 않아 그대로 둡니다.)

## 고칠 것 — 단어
| # | 단어 | 문제 | 고칠 것 |
|---|---|---|---|
| W1 | w-sedation | dKo `수면` — 한국 현장에서 "수면 내시경·수면 마취"처럼 진정을 `수면`이라 부르므로 정답 둘 | dKo `[마취, 진통]` |
| W2 | w-round | dKo `한 판`은 round의 한국어 그대로(정답 둘) | dKo `[휴식, 한 줄]` |
| W3 | w-slightly | dEn `lightly` — ko `살짝`의 번역으로도 맞음(정답 둘) | dEn `[tightly, slowly]` |
| W4 | w-clean | dEn `clear` — "the site looks clear"도 깨끗하다는 뜻으로 읽힘(정답 둘) | dEn `[lean, clammy]` |
| W5 | w-mri | ko `MRI`가 정답 영어 그대로 — 영어 고르기 카드에서 답이 보임 | ko `자기공명영상`(dKo `CT촬영`·`초음파` 길이 통과) |
| W6 | w-sbar | ko `SBAR 보고`가 정답을 담음 | ko `4단계 보고 틀`, dKo `[경과 기록 틀, 혈압 측정값]` |
| W7 ★ | w-unit | dEn `until`(전치사·접속사) — 명사 정답 | dEn `[union, unity]` |
| W8 ★ | w-asa | dEn `ASAP`(부사 약어). cue의 "미국마취과학회"는 약어 풀이라 답을 드러냄 | dEn `[ADA, AHA]`; cue `마취·진정을 받기 전 환자의 전신 건강을 1에서 6 등급으로 매기는 분류` |
| W9 ★ | w-stat | dEn `state`(명사·동사) — 부사 정답 | dEn `[static, still]` |
| W10 ★ | w-change | dEn `chance`(명사) — ko가 동사 `변하다·바꾸다`. chips `chan+ge`는 형태소가 아님 | dEn `[charge, chant]`, chips `[[change]]`, decoyChips `[chance]`(품사 다른 닮은 말은 decoy로) |
| W11 | w-dip | dEn `dot`(명사) — 동사 정답 | dEn `[dig, sip]` |
| W12 | w-point | dEn `joint`(대마초 속어), decoy `pint`(술 단위) | dEn `[paint, print]`, decoyChips `[pant]` |
| W13 | w-help | dEn `hump`(성적 속어) | dEn `[heap, yelp]` |
| W14 | w-brisk | dEn `frisky`(성적 뉘앙스) | dEn `[risky, brusque]` |
| W15 | w-power | decoy `pot`(대마초 속어) | decoyChips `[paw, ewe]` |
| W16 | w-recheck · w-check | decoy·dEn `chick`(여성을 낮춰 부르는 속어) | w-recheck decoyChips `[red, chuck]`; w-check dEn `[chuck, cheek]` |
| W17 | w-rhythm | decoy `rye`(위스키 곡물) | decoyChips `[ray, them]` |
| W18 | w-stimulate · w-stimulation | decoy `lit`(취했다는 속어, 약함) | decoyChips `[stem, lot]` |
| W19 | w-signature | decoy `sin`(종교 죄, 약함) | decoyChips `[sip, lure]` |
| W20 | w-scan | cue가 ko `검사`를 되풀이. tag `이송 장비`도 맞지 않음 | cue `CT·MRI처럼 기계 안에서 몸속을 영상으로 찍는 일 — 갈지 말지 위험과 이익을 따진다`, tag `인계·소통` |
| W21 | w-give | cue가 ko `주다`를 되풀이(`…넣어 주다`) | cue `내 손에서 상대 쪽으로 건네거나 넣어서 받게 하는 동작` |
| W22 | w-evacuate | ko `반출하다`는 물건에 쓰는 말 — 환자를 옮기는 문장 | ko `대피시키다`, dKo `[진입시키다, 고정시키다]`, exKo는 S6에 맞춤 |
| W23 | w-enter | dEn `enrol`은 영국 철자 | dEn `[ensure, enroll]` |

### distractorsEn 품사 표 (정답과 품사가 다른 것 전부)
| 단어(품사) | 오답 | 오답 품사 | 판정 |
|---|---|---|---|
| unit (명사) | until | 전치사·접속사 | ★ 바꿀 것(W7) |
| ASA (명사 약어) | ASAP | 부사 약어 | ★ 바꿀 것(W8) |
| stat (부사) | state | 명사·동사 | ★ 바꿀 것(W9) |
| change (동사) | chance | 명사 | ★ 바꿀 것(W10) |
| dip (동사) | dot | 명사 | 바꾸기 권함(W11) |
| blood (명사) | blond | 형용사·명사 | 그대로(명사로도 쓰임) |
| reading (명사) | leading | 형용사·동명사 | 그대로(명사 lead의 -ing로 읽힘) |
| switch (동사·명사) | swatch | 명사 | 그대로(문장에 명사 the switch도 있음) |
| crash (명사 수식어, ko 형용사) | trash / brash | 명사 / 형용사 | 그대로(crash cart 수식어라 둘 다 자리에 맞음) |

### W13 경고 9건 판정
poll/pole · CO/CO2 · roll/role · emergence/emergency · plane/plan · suit/suite · worst/worse · kite/kit · state/stat — 모두 철자·소리가 닮은 의도된 오답이고 뜻이 달라 정답으로 맞지 않습니다. 유지. 다만 state/stat은 품사 때문에 W9에서 바꿉니다.

### decoyChips 비속어·불쾌 표현 전수
마약 `pot`·`joint`, 성적 `hump`·`frisky`, 비하 `chick`, 술 `rye`·`pint`·`lit` → 위 W12~W18에서 바꿉니다. `sin`은 약해서 권고(W19). `port`(transport·support)·`bed`는 정답 조각이라 해당 없음. `dye`(dry 오답, die와 소리 같음)·`pea`(pee와 소리 같음)·`bet`·`dice`·`mule`·`hot`·`fat`·`flesh`는 약하고 문맥상 문제 없어 그대로. 장례 관련 조각 없음.

## 고칠 것 — 뉘앙스
### context (v46 7번: word가 세 장면에 다 있음 — W14 0건; 듣는 사람은 21개 모두 서로 다름; ko 21개 정확)
아래 4개는 **일반인도 아는 말을 word로 골랐고 fix에도 그 말이 남습니다** — 어색함의 원인이 word가 아니라 주변 전문어라, "그 말이 듣는 사람에게 안 맞는 곳"이 아닙니다. 상황 문장이 이미 쓰는 임상어로 word를 바꾸고 세 장면을 다시 씁니다(who·icon·ok는 그대로).
- **N-C1 이송 장비·산소·약물 준비 (oxygen → reserve)** · word `reserve`, ko `예비분`, words `[w-reserve]` · 동료 간호사 `Can you double-check the oxygen reserve before we leave?` · 의사에게 보고 `He's on 4 liters, and I've calculated the oxygen for the trip plus reserve.` · 보호자에게(ok:false) `The portable cylinder has a calculated reserve of 1,200 PSI for the full trip.` fix `He'll have plenty of oxygen with him the whole way, plus some extra.` · why `의료진끼리는 reserve(예비분)를 숫자와 함께 말해도 통해요. 가족에게 calculated reserve, PSI는 어렵게 들려요. 충분히 챙겼고 여분도 있다고 쉬운 말로 알려요.`
- **N-C2 이송 중 승압·주입 유지 (pump → pressor)** · word `pressor`, ko `승압제`, words `[w-pressor]` · 동료 간호사 `Check that the pressor is on battery before we unplug it.` · 의사에게 보고 `The pressor is running on battery and his MAP is at goal.` · 보호자에게(ok:false) `His pressor is on a lithium battery that guarantees uninterrupted delivery.` fix `The medicine that supports his blood pressure has its own battery, so it keeps going while we move him.` · why `의료진끼리는 pressor처럼 짧게 말해도 통해요. 가족에게 pressor, lithium은 낯설고, guarantees는 지킬 수 없는 장담이에요. 혈압을 받치는 약이 배터리로 계속 들어간다고 쉬운 말로 알려요.`
- **N-C3 시술 중 대량출혈 급변 (bleeding → brisk)** · word `brisk`, ko `급격한`, words `[w-brisk]` · 시술 의사에게 `The bleeding is brisk, and I'm holding direct pressure.` · 동료 간호사 `It's brisk — where's it coming from? Hand me gauze.` · 보호자에게(ok:false) `Her bleeding is brisk with hemodynamic compromise.` fix는 지금 것 그대로 · why `의료진끼리는 brisk 한 단어로 출혈 속도를 바로 알아요. 가족에게 brisk, hemodynamic compromise는 낯설고 무섭게 들려요. 출혈이 예상보다 많아서 누르고 있고 도움을 더 부르고 있다고 쉬운 말로 알려요.`
- **N-C4 MRI 중 응급상황 대응 (safe → zone)** · word `zone`, ko `구역`, words `[w-zone]` · 의사에게 보고 `She's out of Zone IV, and the area is safe for the code cart.` · 동료 간호사 `Is the safe zone past those double doors?` · 보호자에게(ok:false) `We moved her out of Zone IV because of the ferromagnetic hazard.` fix `We're taking her out of the scanner room so we can help her safely.` · why `의료진끼리는 Zone IV·safe zone처럼 구역 이름으로 바로 통해요. 가족에게 Zone IV, ferromagnetic hazard는 낯설고 무섭게 들려요. 안전하게 도우려고 검사실 밖으로 옮긴다고 쉬운 말로 알려요.`
(stable·line·pulse·worse·tank·recovery도 일반인이 아는 말이지만 fix에서 그 말이 빠지고 전문어와 함께 쓰여 어색함이 생기는 모양이라 그대로 둡니다. 나머지 context의 사실은 맞습니다 — consent fix "시술 의사가 설명하고 동의하면 서명", time-out은 Universal Protocol, code는 은어.)

### slider
- **N1 [안전] 원내 이송 전 안정성 평가** · cue `MAP is 62` → `His MAP is 66 on the same pressor dose, sat is 94, and his heart rate keeps creeping up.`(목표 안이지만 흔들림 → borderline; why와 맞음).
- **N2 시술 진정 중 활력·기도 감시** · scale `[slipping, dropping, plummeting]` — 98→96→93이면 slipping도 맞음(정답 둘). scale `[dipping, dropping, plummeting]`, why 앞에 `잠깐 내려갔다 돌아오면 dipping, ` 추가.
- **N3 시술 후 회복 관찰** · cue `She's eyes open` 문법 오류 → `Her eyes are open, she's answering clearly, and she's asking what time it is.`
- **N4 베드사이드 시술 보조** · scale `[sterile, clean, dirty]` 정답 dirty — 난간에 닿은 트레이는 "무균이 깨진(contaminated)" 것이고 clean으로도 읽혀 정답 둘. scale `[sterile, clean, contaminated]`, answerAt 2, why `무균 물품이 무균이 아닌 침대 난간에 닿으면 contaminated예요. 그대로 쓰지 말고 새것으로 바꾸고 시술자에게 알려요. clean은 눈에 보이는 오염이 없다는 정도라서 무균과는 달라요.`, example `The tray touched the rail, so it's contaminated now.` / `트레이가 난간에 닿아서 이제 오염됐어요.`
- **N5 이송 중 산소·전원 소진 위기** · why `20퍼센트쯤 줄어든 running low` → `20퍼센트쯤 남은 running low`.
- (낮음) 이송 장비 `[more than enough, just enough, not enough]`·회복 `[awake, arousable, hard to rouse]`는 강함→약함 순이라 지시서("약한 것부터")와 반대. 정답은 하나라 그대로 둬도 됨. 나머지 13개는 순서·cue·정답 모두 맞음(MR safe/conditional/unsafe 정의, ASA 깊이 기준, 청색증 순서 맞음).

### pair·swap
- **pair 진정 역전제 준비** 전 조합: naloxone×{reverses opioids ✔, reverses benzodiazepines ✕, lowers a fever ✕}, flumazenil×{reverses opioids ✕, reverses benzodiazepines ✔, lowers a fever ✕} — 정답 하나. **N6** why `둘 다 약효가 역전제보다 오래 갈 수 있어서` → `오피오이드·벤조디아제핀의 효과가 역전제보다 오래 갈 수 있어서`(지금 문장은 역전제의 약효가 역전제보다 길다는 뜻이 됨).
- **swap 원내 이송 전 안정성 평가** 세 문장 모두 문법 맞음, ko `가는 중에 나빠지면 멈추고 도움을 요청할 거예요` 정확, notes 맞음. 고칠 것 없음.

## 고칠 것 — 결정 11
변경 목록 판정: ko 가르기 24건(level/reading·ready/set·med/drug/medication·free/clear·start/begin·saturation/sat·vent/ventilator·manage/take·drip/infusion 등)과 공통·쉬운 단어 18개 삭제는 모두 타당합니다. 15%로 1할을 넘지만 과한 손질은 아닙니다. 뜻 두 개를 담은 ko(call·monitor·pressure·emergency·switch·change)는 태그된 문장이 실제로 두 뜻에 걸쳐 있어 유지해도 됩니다. 아래만 고칩니다.
- **D1 w-hold** · ko `멈추다/유지하다`가 w-stop `멈추다`·w-keep `유지하다`와 겹칩니다(가르기를 하면서 새 중복이 생김). ko를 `보류하다` 한 뜻으로, dKo `[재개하다, 증량하다]`. 태그는 원내 이송 전 2(KP)·진정 깊이 적정 2(KP)·6에 남기고, **인공호흡 환자 이송 관리 4·이송 중 발관 2(KP)·3·대량출혈 급변 3에서 뺍니다**(그 문장의 hold는 "유지"). 남는 단어 수(스크립트로 셈): 인공호흡 28→27, 발관 19→18, 대량출혈 26→25 — 모두 8 이상. example(`If he deteriorates, we hold and reassess.`)은 그대로.
- **D2 w-supply** · 베드사이드 시술 보조 2 `hand you supplies`는 "물품"인데 ko `공급량` — 태그 뺌(상황 단어 22→21).
- **D3 w-bag** · 이송 중 산소·전원 소진 위기 1 `I'll bag him`은 동사인데 태그가 남음(저자가 다른 bagging 태그는 뺌) — 태그 뺌(상황 단어 22→21).
- (낮음) **D4 w-second** · ko `초·순간`의 `순간`이 w-moment `~하는 순간`과 겹칩니다. 앱이 은행 ko를 오답으로 섞지 않으면 그대로 둬도 됩니다. 가르려면 second ko `초·잠깐`으로 하고 `the second we're …` 두 문장(MRI 5·산소 4)의 second 태그를 뺍니다.
- (낮음) **D5 ko의 `당신`** · 시술 진정 전 6 `당신만 준비되면`, 이송 중 악화 대비 2(KP) `당신이 기도를 맡고`, 심정지 2(KP) `당신이 코드 약물을 투여해요` — 한국 병원 말로 어색합니다. `선생님 준비되시면 바로 시작할 수 있어요` / `선생님이 기도를 맡아 주시고, 저는 약물을 맡을게요` / `제가 백을 짜는 동안 코드 약물을 투여해 주세요`. 바꾸면 distractorsKo 둘 다시.
- **words가 빈 문장 3개**(진정 전 3 `She hasn't eaten anything since last night.`, 진정 깊이 5 `She still opens her eyes when I say her name.`, 이송 장비 6 `Everything we need is accounted for.`) — 상황 단어 수(V3)는 충분하고 남은 말이 다 쉬운 말이라 비워 둬도 됩니다. 원하면 이송 장비 6에 `accounted for`(모두 확인된)를 새 단어로 만들 수 있으나 필수는 아님.

## 저작자 메모 판정
| 메모 | 판정 |
|---|---|
| 진정 전 5 동의서(서명 받는 사람이 시술자) | 문장은 간호사가 서명 여부를 확인하는 보고라 맞음. 그대로 |
| MRI 3 scanned | 틀림 — S1로 고침(안전) |
| 검사실 6 cleared ko | 맞는 지적 — S5 |
| 대량출혈 0·1·4 명령문 | 0·1은 KP — 유지 권고(아래). 4 `Get me two units of blood to the bedside stat`은 MTP 발동 뒤 혈액을 가져오라는 요청이라 범위 안. 그대로 |
| 대량출혈 2 응급 전환 | KP — 팀 `we`로 시술자 결정을 전하는 말로 읽힘. 유지 |
| 호흡정지 1 역전제 명령 | KP — 유지(아래) |
| 진정 중 4 도움 요청 늦음 | 맞는 지적 — S2(안전) |
| 발관 5 재삽관 약속 | 맞는 지적 — S3 |
| 악화 대비 2 기도 맡기기 | KP — 상대가 RT/의사인 역할 분담이라 맞음. 유지 |
| 승압 1·5 titrate·bump | 처방된 범위 안의 적정은 미국 ICU 간호사 일. 1은 KP 유지, 5도 그대로(slider why가 처방 범위를 설명함) |
| 회복 2 감시 줄이기 | KP — 회복 기준(Aldrete 등) 점수로 간호사가 판정하는 것이 병원 정책상 맞음. 유지 |
| 위험-이익 5 I'd rather wait | 간호사 의견 표명 + 6에서 담당의와 결정 — 그대로 |
| 진정 깊이 2 hold the drug | 문제 없음 |
| 이송 장비 6 words 빔 | 그대로 |
| sat·vent ko 줄임말 | 타당 |
| W13 9건 | 위 표대로 유지 |
| 정리 범위 15% | 타당(결정 11 판정 참고) |
| 두 뜻 ko | hold만 D1로 고치고 나머지는 유지 |
| 빈 words 문장 | 그대로 |

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)
| # | 상황 · 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 1 | MRI 중 응급상황 대응 · `Start compressions the moment we clear the magnet.` | ACR MR 안전 지침은 Zone IV 밖으로 옮기는 **동안** BLS·CPR을 바로 시작하라는 쪽. 압박을 미루라는 말로 읽힘(안전). in-json tagline도 같은 생각 | `Start compressions now and keep going as we move her out.` | **바꿈 권고.** 바꾸지 않으면 ko·v46 why를 "자석 구역을 벗어나며 곧바로" 쪽으로 쓰고 slider why와 맞출 것 |
| 2 | 시술 중 대량출혈 급변 · `Bleeding is brisk — apply pressure and open fluids wide.` | 대량 출혈에서는 수액보다 혈액이 우선이고, 수액을 활짝 여는 것은 처방·프로토콜 안의 일 | `Bleeding is brisk — apply pressure and get blood hanging.` | 유지(현장에서 흔한 말). why에 "시술자 지시·프로토콜 안에서"를 담을 것 |
| 3 | 같은 상황 · `Activate the massive transfusion protocol and call surgery.` | MTP 발동은 의사 지시나 병원 정책에 따름 | `The doctor wants the massive transfusion protocol — I'm calling it now.` | 유지(시술자·팀장이 하는 말로 듣기 연습 가치) |
| 4 | 같은 상황 · `We're converting this to an emergency procedure.` | 전환 결정은 시술자 몫 | — | 유지(팀 `we`로 결정을 알리는 말) |
| 5 | 시술 진정 중 호흡정지 위기 · `Give the reversal agent and stop all sedatives.` | 역전제 투여는 지시·진정 프로토콜 필요. 순서상 진정제를 먼저 끊는 게 자연스러움 | `Stop all sedatives and give the reversal agent.` | 유지(낮음). 바꾸면 순서만 |
| 6 | 시술 후 회복 관찰 · `She meets the recovery criteria for reduced monitoring.` | 간호사 단독 판단처럼 읽힐 수 있음 | — | 유지(기준 점수 판정은 간호사 일, 정책이 정함) |
| 7 | 이송 중 승압·주입 유지 · `I'll titrate the pressor to keep his MAP at goal.` | 처방된 적정 범위 전제가 문장에 없음 | — | 유지(slider why가 범위를 설명) |
| 8 | 이송 중 악화 대비 계획 · `You manage the airway, I'll run the meds.` | 기도는 보통 RT·의사 몫 — `you`가 그 사람이라 맞음 | — | 유지 |
| 9 | 이송 중 악화 대비 계획 · `If he arrests, we stop, start compressions, and call for help.` | AHA는 도움 요청과 압박을 동시에 — 둘이면 한 명은 압박, 한 명은 호출 | — | 유지 |

### keyPhrase chunks — 구 경계를 끊은 것(보고만)
`His vitals are / stable enough` · `are in / the bag` · `is clear / of the wheels` · `for opioid / reversal` · `for benzodiazepine / oversedation` · `where the nearest / code cart and phone` · `to the transport / team` · `to his / current ones` · `but she's / borderline stable` · `starting / compressions now` · `the nearest / crash cart` · `the code / meds` · `on the dislodged / line` · `with a good / seal` · `if she doesn't / recover` · `and open / fluids wide` · `to an emergency / procedure` · `The tank is / almost empty` · `Find the nearest / wall oxygen`.

## 종합
고칠 것 52건(문장 6 · chunks 10 · 단어 23 · 뉘앙스 10(context 4 · slider 5 · pair why 1) · 결정 11 3; 낮음 D4·D5와 slider 순서는 셈에서 뺌), 그중 **안전 4건**(S1 MRI screened, S2 도움 요청 기준, S3 재삽관 약속, N1 MAP 62 borderline). keyPhrase 결정은 MRI 압박 시점 1건만 바꾸기를 권합니다. 위를 고친 뒤 내보내도 됩니다.
