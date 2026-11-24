# core-safety-icu — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `core-safety-icu.yaml`(A·B 합본). 단어 250(base 272, 22 삭제), 상황 21(문장 146), 뉘앙스 42(slider 21 · context 16 · swap 5 · pair 0).
비교: base(뉘앙스 0 — 뉘앙스는 전부 A 새 저작)·changes(76건: sentence 48 전부 `words` 태그만 · word-remove 22 · word 6)·in-json·notes-A·notes-B.
임시 스크립트 `rv_core-safety-icu_A_dump.py`(words/sents/nuance/swap/stats), `rv_core-safety-icu_A_checks.py`(길이·cue·대체 조각 경로·청크 끝·헤드워드). 출력 `_rv_core-safety-icu_*.txt`.
번호는 "상황.문장"(둘 다 0부터). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 철자·소리 닮음은 대체로 좋음(conform/confine, hypertensive류, brake/break). 품사 다른 오답 5개(★4), 정답과 뜻이 겹치는 오답 3개(track·shame·skid) |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과(스크립트). 상위어·다른 뜻이 정답이 되는 것 3(w-bag `용기`, w-tailor `줄이다`, w-prompt `지시하다`). 괄호 ko 오답이 억지(w-drip·w-slip) |
| 3 cue | 2 | 정답 영어 노출 0. 그러나 **cue 45개가 `ko` 낱말을 그대로 넣은 사전 풀이**(장면 없음). w-label·w-full은 cue가 정답 품사·뜻과 어긋남 |
| 4 chips/decoyChips | 4 | 대체 조각 경로 0(스크립트). 화면에 나오는 조각 중 술·장례 조각 ★4(lit·bar·rip+rest·dye), 낮음 3묶음 |
| 5 뉘앙스·문장 사실 | 3 | why는 미국 관행에 대체로 정확(CUS 3단계, near-miss/error 3단계, hard·soft limit, 식별자 두 가지, 침상 번호 ✕, 공개는 담당의, 억제대 처방·재평가, 알람 한계는 규정·처방 범위). 문장: **독립확인을 깨는 말 2(12.5·2.5)**, 호출을 미루는 말(15.4), 처방 전 해독제(16.5), 일반화(9.5), 공개 순서(20.3), slider 6 why(mute) 부정확 |
| 6 뉘앙스 설계 | 2 | **context 16개 중 15개가 핸드오프 모양이 아님**(어색함이 word가 아니라 덧붙인 다른 전문어에서 옴; 0번은 ok 장면·어색한 장면 듣는 사람이 둘 다 일반인). slider 10 scale이 YAML에서 쪼개져 4칸·순서 깨짐, slider 9 순서 안 맞음, slider 16 강도 아닌 적절성, slider 3 cue에 정답 문구 |
| 7 결정 11 | 4 | 쉬운 말 22개 삭제(공통 12 + 판단 10)·ko 가르기 4·헤드워드 2는 타당. 남은 흠: w-alert가 `high-alert`에 태그됨, w-stand 헤드워드(stand out), 괄호 ko(drip·slip), w-feeding `급식용의` 오역, 20.3 `words: []` |

## 사실 오류·심각한 문제
1. **[안전] 12.5 "I'll say the dose out loud first, then you confirm it your own way."** — 값을 먼저 들려주면 독립 이중 확인이 깨집니다(ISMP: 두 번째 사람은 값을 미리 듣지 않고 각자 따로 계산한 뒤 비교). 같은 상황 KP 12.0·12.1, slider 12 why, order 12("neither of us hears… first")와 정면 충돌 → S1.
2. **[안전] 2.5 "So that's insulin, ten units, over one hour — did I get that right?"** — 고위험약 이중확인 상황에서 값을 말하고 '맞죠?'로 동의를 구하는 것은 12.5와 같은 유도(prompting) → S2. order 2의 3줄 "So that's what the order says — did I get that right?"도 같은 문제(B 참고).
3. **[안전] 15.4 "Let's act fast: airway first, then we call the physician."** — 치명적 라인 오류에서 담당의 호출을 기도 사정 뒤로 미루는 순서로 가르침. 실제로는 한 사람이 사정하는 동안 다른 사람이 즉시 호출 → S3.
4. **[범위·안전] 16.5 "We're preparing protamine now and calling the doctor before anything else."** — 처방 전에 해독제 준비를 먼저 말하고, "다른 무엇보다 먼저 부른다"와 문장 안에서 순서가 모순 → S4.
5. **[사실] 9.5 "…only the two of us hold the keys."** — 미국 ICU 마약은 대부분 자동 조제함(ADC)에 개인 로그인·지문으로 접근, '둘만 열쇠'는 일반화 → S5.
6. **[역할] 20.3 "We tell the family first, before anyone else outside this room."** — 공개는 담당의가 이끌고, 의사결정 능력이 있으면 환자 본인이 먼저. 게다가 `words: []`(태그 0) → S6. order 20의 1줄 "the family hears it first"도 같은 문제(B 참고).
7. **[설계·데이터] slider 10(섬망) scale이 4칸** — `person, place and time`을 따옴표 없이 써서 `person` / `place and time` 두 칸으로 쪼개짐. 3번째 칸 `person`이 2번째보다 약해 순서가 깨짐 → N1.
8. **[설계] context 15개가 핸드오프 모양이 아님** — word(alarm·line·check·connect·locked·stop·battery…)는 가족에게도 쓰는 말이고 어색함은 VT·lumen·Luer-lock·biometric·FiO2·sentinel event·supratherapeutic 같은 덧붙인 말에서 옴 → N10.
9. **[KP] 18.1 "Call for the rapid response…"** — ICU 안에서는 RRT가 아니라 담당의·당직 중환자의를 호출(대부분 병원의 RRT는 ICU 밖 환자용) → K2(사용자 결정).

## 고칠 것 — 문장 (keyPhrase 아님 + KP의 ko·words)
문장 en을 바꾸면 `chunks`·`ko`·`words`도 함께 바꾸고, **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 같은 문장을 example로 쓰는 단어의 `example`/`exKo`도 맞추고, `changes-core-safety-icu.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 그 문장의 **distractorsKo 둘을 새 ko에 맞춰 다시** 쓰세요.

- **S1 ★[안전] 12.5** · en `You confirm the dose on your own first, then we compare.` · chunks `You confirm / the dose / on your own first / , then we compare / .` · ko `먼저 선생님이 혼자 용량을 확인하시고, 그다음 서로 맞춰 봐요.` · words `[w-dose, w-confirm]`. v46 전부 새로(지금 why "first와 then이 말하는 순서를 못 박아요"는 잘못된 절차를 설명).
- **S2 ★[안전] 2.5** · en `Tell me how many units of insulin you get before I say mine.` · chunks `Tell me / how many units of insulin / you get / before I say mine / .` · ko `제 걸 말하기 전에 인슐린이 몇 단위로 나왔는지 먼저 말해 주세요.` · words `[w-unit, w-insulin]`(w-right 태그 뺌 — 5.0·5.3·5.4 등에 남음). v46 전부 새로. w-insulin example/exKo는 이 새 문장으로, **w-right example은 5.3**("…— is that right?")으로.
- **S3 ★[안전] 15.4** · en `Let's act fast: you check his airway while I call the physician.` · chunks `Let's act fast: / you check his airway / while I call / the physician / .` · ko `빠르게 움직여요, 선생님은 기도를 확인하고 그동안 제가 의사를 부를게요.` · words 그대로 `[w-act, w-airway, w-call, w-physician]`. v46 전부 새로, w-act example/exKo 맞춤.
- **S4 ★[안전·범위] 16.5** · en `I'm calling the doctor now, and we'll prepare protamine if it's ordered.` · chunks `I'm calling the doctor now / , and we'll prepare protamine / if it's ordered / .` · ko `지금 의사를 부르고 있고, 처방이 나오면 프로타민을 준비할게요.` · words `[w-call, w-prepare, w-protamine, w-order]`. v46 전부 새로.
- **S5 [사실] 9.5** · en `The narcotics stay locked, and we never share our cabinet login.` · chunks `The narcotics stay locked / , and we never share / our cabinet login / .` · ko `마약은 늘 잠겨 있고, 보관함 로그인은 절대 같이 쓰지 않아요.` · words `[w-narcotic, w-locked]` → **w-key는 어느 문장도 태그하지 않게 되어 은행에서 삭제**(word-remove; 상황 9는 서로 다른 단어 15개 이상 남음, 뉘앙스 words에 w-key 없음). v46 전부 새로.
- **S6 ★[역할] 20.3** · en `The physician will talk with the family, and I'll be there to support them.` · chunks `The physician / will talk with the family / , and I'll be there / to support them / .` · ko `의사 선생님이 가족과 이야기하고, 저는 곁에서 가족을 도울게요.` · words `[w-physician, w-support]`(지금 `[]`). v46 전부 새로.
- **S7 [사실] 3.6** "…one less way to mix up a patient" — 라벨은 라인 혼동을 막지 환자 혼동을 막지 않음. en `A line labeled at both ends is one less chance of a mix-up.` · chunks `A line labeled / at both ends / is one less chance / of a mix-up / .` · ko `양쪽 끝에 라벨이 붙은 라인은 헷갈릴 위험을 하나 줄여 줘요.` · words 그대로 `[w-label, w-line, w-end, w-mix]`. v46 새로, w-mix example/exKo 맞춤.
- **S8 [문법] 15.5** "notify the team what happened" — notify는 `of`가 필요. en `I'll stay with him while you notify the team of what happened.` · chunks `I'll stay with him / while you notify / the team / of what happened / .` · ko 그대로. v46 why·blank 확인, w-stay·w-team example 맞춤.
- **S9 [청크] 구 경계 끊김(비KP)** — en 그대로 chunks만:
  - 2.4 `Let's stop / and check this together / before we give it / .`(`together before` 끊김)
  - 4.4 `Let's check / his call light works / before I step out / .`(`works before` 끊김)
  - 3.0 `I might be wrong, / but I want to check something / before / we go ahead / .`(`something before` 끊김)
  - 청크를 바꾼 문장은 decoy가 새 청크 자리에 맞는지 B 필드도 확인.
- **S10 ★[ko·KP] 9.0** ko `고농도 전해질은 따로 잠가서 보관해요.`(secured = 잠금 보관, '고정'은 오역) + distractorsKo 둘 다시. w-concentrated·w-electrolyte·w-store·w-separately·w-secure exKo와 order 9의 1줄 ko도 같은 말로.
- **S11 [ko·KP] 12.2** ko `이건 모든 고위험 약물에 꼭 해야 하는 절차예요.` · **12.6** ko `인슐린이나 헤파린 같은 고위험 약물은 항상 이 추가 단계를 거쳐요.`(ko에 영어 `high-alert`가 남음) + 각 distractorsKo 둘 다시, w-required·w-heparin exKo 맞춤.
- **S12 [ko·KP] 6.2** ko `원인을 해결하지 않고 알람 소리만 끄는 건 절대 안 돼요.`("절대 괜찮지 않아요"는 번역투) + distractorsKo 둘 다시. w-silence·w-cause·w-okay exKo 맞춤.
- **S13 [ko] 8.4** ko `잠깐요, 그건 경관영양 라인이에요, 정맥 포트는 여기고요.`(급식용 → 경관영양, W16과 같이) + distractorsKo 둘 다시, w-feeding·w-port exKo 맞춤.
- **S14 (낮음) [ko·KP] 20.1** ko `의사가 공개를 이끌고, 우리는 곁에서 뒷받침해요.`("지지해요"는 찬성으로 읽힘) + distractorsKo 둘 다시, w-lead·w-disclosure·w-support exKo, order 20의 2줄 ko 맞춤.
- **T1 ★[태그] 12.2(KP)·12.6** words에서 **w-alert 뺌** — 카드는 `alert` = 경고음(명사)인데 이 두 문장은 `high-alert`(고위험)라 뜻이 다름. w-alert는 6.3에 남음. 상황 12는 서로 다른 단어 8개 이상 유지.

## 고칠 것 — 단어
- **W1 ★ w-together** dEn `tougher`(형용사) → `otherwise`. ([altogether, otherwise])
- **W2 ★ w-trace** dEn `track` — "track the line from the bag"이 같은 뜻으로 성립 → `brace`.
- **W3 ★ w-bag** dKo `용기` — 수액백도 용기(상위어라 정답 둘) → `거즈`.
- **W4 ★ w-blame** dEn `shame` — "not about blame/shame"은 비난 없는 보고에서 같은 뜻으로 쓰임 → `blare`.
- **W5 ★ w-slid** dEn `skid`(미끄러지다 — 뜻이 같음) → `shed`. dKo `미끄러져 올라갔다`(있을 수 없는 일이라 바로 걸러짐) → `굴러떨어졌다`.
- **W6 ★ w-annoying** dEn `enjoying`·`avoiding`(동사 -ing, "because it's avoiding" 비문) → `[alarming, appealing]`.
- **W7 ★ w-document**(동사) dEn `monument`(명사만) → `augment`.
- **W8 ★ w-incident**(명사) dEn `insistent`(형용사) → `incentive`.
- **W9 w-transport**(명사) dEn `transform`(동사만) → `transcript`. (transfer는 뜻이 겹쳐 안 됨)
- **W10 w-tailor** dKo `줄이다` — tailor의 다른 뜻(옷을 줄이다) → `해제하다`.
- **W11 w-prompt** dKo `지시하다` — prompt의 다른 뜻(촉구·지시) → `방해하다`.
- **W12 w-stand 헤드워드** — ko `두드러지다`는 `stand out`의 뜻(문장 6.4 "stand out later"). 결정 11대로 en `stand out` · ipa `/stænd aʊt/` · chips `[[stand], [out]]` · decoyChips `[stan, oat]` · dEn `[stand by, stamp out]` · dKo 그대로(id 그대로; changes에 word en·ipa).
- **W13 w-label** — 카드는 동사 `라벨을 붙이다`인데 cue "이름과 내용을 적어 붙인 표"는 명사 → cue `라인 양 끝에 무엇이 흐르는지 적어 표시해 두는 일`. dEn `[table, lapel]`(명사) → `[level, ladle]`(동사로도 쓰임).
- **W14 w-drip** ko `점적(정맥주사)` → `지속 점적`, dKo `[심전도(검사기), 혈압계(측정기)]`(길이 맞추려 괄호를 지어 붙임) → `[일시 주사, 근육 주사]`(같은 분야, 뜻이 분명히 다름).
- **W15 w-slip** ko `빠지다(누락되다)` → `누락되다`, dKo `[채워지다(보충되다), 붙다(고정되다)]` → `[중복되다, 지연되다]`.
- **W16 w-feeding** ko `급식용의`(학교 급식) → `영양 공급용의`(S13과 같이). dKo 그대로(길이 통과).
- **W17 w-full** cue "가득 차서 빈 데가 없는"은 '가득 찬' 뜻이라 문장(the full review)과 어긋남 → `일부가 아니라 처음부터 끝까지 다 — 나중에 하는 사건 검토를 말할 때`.
- **W18(낮음) w-need** ko `필요`(명사) — 6문장 중 5문장이 동사(need to, needs, needed) → `필요하다`, dKo `[허락하다, 거부하다]`.
- **W19(낮음) w-call** ko `호출`(명사) — 15.4·16.5·17.2·17.5·18.1은 동사 → `부르다·호출`.
- **W20 decoyChips(조각 맞추기에 실제로 나오는 여러 조각 단어만)**:
  - ★ w-outlet `lit`(취한 — 속어) → `lat` · ★ w-number `bar`(술집) → `bur`
  - ★ w-rapidresponse `rip`+`rest`(둘이 같이 나와 RIP·rest in peace가 떠오름) → `rip` → `rep`
  - ★ w-immediate `dye`(die 소리) → `da`
  - (낮음) `tar`(담배) — w-enter·w-battery·w-later·w-after 넷 모두 → `tor` · w-checklist `chick`(여성 비하 속어) → `chuck` · w-control `troll` → `trawl`
  - (참고, 화면에 안 나오는 한 조각 단어·dEn): w-trust decoy `tryst`(밀회)·dEn `thrust`, w-reach dEn `retch`, w-drop dEn `drown`, w-schedule dEn `scaffold`, w-nearmiss dEn `near-death` — 바꾸면 더 좋음(수정 담당 판단: thrust→`truss`, retch→`teach`, drown→`droop`, scaffold→`scalpel`, near-death→`near-term` 외 `near-field`).
- **W21 cue가 ko를 되풀이(45개)** — ko 낱말을 빼고 장면으로(정답 영어 없음):
  - w-keep `섬망 환자의 수면 주기나 익숙한 물건을 그대로 이어 두겠다고 할 때`
  - w-reach `호출 버튼은 환자 손이 미치는 곳에, 고농도 칼륨은 미치지 않는 곳에 둘 때`
  - w-step `억제대 전에 대안을 먼저 써 보는 것처럼, 절차에서 건너뛰면 안 되는 한 부분`
  - w-off `억제대를 다 떼어 낸 뒤의 상태 — 그다음 자세를 바꿔요`
  - w-verify `처방·용량을 원본과 하나하나 맞춰 본 뒤에야 경고를 넘길 때`
  - w-unit `인슐린·헤파린 양에서 숫자 뒤에 붙는 말 — 50과 5를 헷갈리면 안 돼요`
  - w-stop `오류를 발견한 순간 주입을 바로 끊으며 하는 첫마디`
  - w-check `투약 전 알레르기, 이송 전 케이블처럼 빠짐없이 살펴볼 때`
  - w-right `투약 원칙에서 환자·약·용량·경로·시간 앞에 붙는 말, '제가 ○○ 이해했나요?'에도`
  - w-wrong `'제가 ○○ 수도 있지만…'으로 우려를 꺼낼 때, 엉뚱한 라인에 엉뚱한 약`
  - w-hear `이중확인에서 상대가 따로 계산한 값을 귀로 받아 맞춰 볼 때`
  - w-start `둘 다 서명한 뒤 펌프를, 급변 때 산소를 처음 켤 때`
  - w-end `라인 라벨은 백 쪽과 환자 쪽, 양쪽 ○에 붙여요`
  - w-lock `낙상 예방으로 침대를 낮춘 뒤 바퀴가 구르지 않게 할 때`
  - w-item `안경·전화기처럼 환자 손 닿는 곳에 둘 소지품 하나하나`
  - w-shift `낙상 위험을 다시 평가하는 간격 — 낮 번·밤 번 교대마다`
  - w-okay `원인 해결 없이 알람만 끄는 건 절대 ○○ 않다고 못 박을 때`
  - w-fit `연결부가 쉽게 들어가지 않으면 억지로 꽂지 말라고 할 때`
  - w-system `색 구분·라벨처럼 모두가 똑같이 따르는 장치와 규칙의 묶음`
  - w-alike `작은 색띠 말고는 구별이 안 되는 두 연결부를 보고`
  - w-separately `고농도 전해질 보관, 독립확인처럼 서로 섞이지 않게 할 때`
  - w-require `마약 규정이 두 간호사 확인과 잠금 보관을 꼭 하게 할 때`
  - w-count `교대 때 마약을 한 앰플씩 두 사람이 맞춰 볼 때`
  - w-log `마약을 센 뒤 두 사람이 서명하는 장부`
  - w-reduce `섬망 예방으로 밤의 소음과 불빛을 낮출 때`
  - w-clock `섬망 환자가 지금 몇 시인지 알도록 벽에 거는 것`
  - w-calendar `섬망 환자가 오늘 날짜를 알도록 침상 맞은편에 두는 것`
  - w-catch `펌프 약물 라이브러리가 잘못 입력된 용량을 걸러 낼 때`
  - w-move `기도·점적·모니터를 확인한 뒤 침대를 CT실로 출발시킬 때`
  - w-checklist `이송 전 산소·배터리·라인을 하나씩 소리 내어 짚는 종이`
  - w-miss `울린 알람을 아무도 못 알아챘을 때, 인계에서 빠뜨린 항목`
  - w-harm `아차 사고와 달리 환자에게 실제로 닿은 손상`
  - w-learning `보고는 비난이 아니라 이것을 위한 것 — 다음 환자를 위해 얻는 것`
  - w-save `10분 들여 쓴 보고서가 나중에 누군가의 목숨을 건질 수도`
  - w-lesson `아차 사고 하나가 병동 전체가 알게 되는 것으로 바뀔 때`
  - w-disconnect `잘못 연결된 주입을 멈춘 직후 튜브를 환자에게서 뗄 때`
  - w-physician `치명적 오류 직후 바로 알리고, 사건 공개를 이끄는 사람`
  - w-lab `헤파린 과량 뒤 PTT·혈색소처럼 피를 뽑아 확인하는 결과`
  - w-status `검사 결과와 함께 환자가 지금 어떤지 — 의식·활력징후 전체`
  - w-slid `억제대를 한 환자의 몸이 침대 아래쪽으로 쏠려 끈이 가슴에 걸렸을 때`
  - w-review `환자가 안정된 뒤 알람을 왜 놓쳤는지 팀이 되짚을 때`
  - w-stable `급변이 지나 활력징후가 더 흔들리지 않을 때 — 그때 원인을 따져요`
  - w-drop `정전으로 전기가 갑자기 나갔을 때 '전원이 ○○'`
  - w-fact `사건 공개 때 추측 대신 기록·로그로 확인된 것만`
  - w-lead `사건 공개 대화에서 의사가 맡는 역할 — 간호사는 곁에서 거들어요`

### 품사가 다른 distractorsEn (전부)
| 단어 | 정답 품사(문장) | 오답 | 판정 |
|---|---|---|---|
| ★ w-together | 부사 | tougher(형용사) | 걸러짐 → W1 |
| ★ w-annoying | 형용사 | enjoying·avoiding(동사 -ing) | "because it's avoiding" 비문 → W6 |
| ★ w-document | 동사 | monument(명사) | → W7 |
| ★ w-incident | 명사(incident report) | insistent(형용사) | → W8 |
| w-transport | 명사 | transform(동사) | → W9 |
| w-label | 동사(labeled) | table·lapel(명사) | table은 동사도 되나 약함 → W13 |
| w-need | ko 명사 / 문장 동사 | feed·heed(동사) | ko를 동사로 맞추면 해결 → W18 |
| w-locked | 형용사 | lacked(동사 과거) | 약함 — "stay lacked" 비문으로 걸러짐. (낮음) `lacked` → `docked` |
| w-silence | 동사(Silencing) | license·sentence | 둘 다 동사로도 쓰임 — 허용 |
| w-emergency | 명사 수식(emergency outlets) | immersion·emigration(명사) | 같은 명사 — 허용 |
| w-nearby·w-after·w-alike | 부사 | beyond(전치사)·during/except(전치사)·alive/alone(형용사) | 부사로도 쓰이거나 서술 자리라 허용 |

## 고칠 것 — 뉘앙스
- **N1 ★ slider 10(섬망)** scale `["person only", "person and place", "person, place, and time"]`로(따옴표 필수). answerAt 1 그대로.
- **N2 ★ slider 3(라인 라벨)** cue가 정답 칸 `I might be wrong`을 그대로 담음 → cue `Nurse: "I'm not certain, but something about this line looks off — can we look before we push anything?"`.
- **N3 ★ slider 9(전해질)** `premixed`는 희석된 것이라 diluted와 concentrated 사이의 강도가 아님 → scale `[diluted, standard strength, concentrated]`(answerAt 2).
- **N4 slider 16(용량사고)** — 칸이 강도가 아니라 '적절한 말'이라 10배 헤파린 cue로는 `a total disaster`를 고를 수 있음 → scale `[near-miss, medication error, sentinel event]`, cue `Nurse, to the charge nurse: "The heparin reached him at ten times the ordered dose; no bleeding so far."`, answerAt 1, why `환자에게 닿기 전에 잡으면 near-miss, 닿았으면 medication error, 사망·영구 손상 같은 심각한 위해까지 가면 sentinel event(Joint Commission)예요. 확인된 사실로만 이름을 붙여요.`
- **N5 slider 7(억제대 모니터)** `nonstop`은 '풀어 주는' 빈도로 뜻이 안 됨 → scale `[now and then, on a schedule, continuously]`(관찰 빈도; cue 그대로 answerAt 1).
- **N6 slider 6(알람 피로) why** — "mute나 turn off는 알림 자체를 끊으니"는 기기마다 다르고 mute는 흔히 silence와 같은 뜻으로 씀 → `silence(또는 pause)는 정해진 시간만 소리를 멈추고 다시 울려요. mute는 다시 켤 때까지 소리를 끄는 뜻으로 쓰일 때가 많고(기기마다 이름이 달라요), turn off는 그 알람 자체를 끄는 거예요. 원인을 해결하지 않은 채 끄면 안 돼요.`
- **N7(낮음) slider 5(5R)** `chart says none`과 `he told me none` 사이 강약이 정해지지 않음 → scale `[not asked yet, chart says none, chart and patient agree]`.
- **N8 swap 20(사건 공개)** ko가 앞 절을 빠뜨렸고 '죄송해요'는 잘못 인정으로 읽힘 → ko `얼마나 속상하실지 알아요, 이런 일이 생겨서 정말 안타까워요`. (이어 붙인 문법 셋 다 맞음)
- **N9(낮음)** slider 2 exKo `이 용량이 불편해요` → `이 용량은 마음이 놓이지 않아요`. slider 8 example `look nearly alike` → `look nearly identical`(exKo 그대로).
- **N10 ★ context 15개 재작성(v46 7번)** — 지금 word는 가족·환자에게도 쓰는 말이고, 어색함은 어색한 장면에만 있는 다른 전문어에서 옵니다. 핸드오프처럼 **세 장면 모두에 있는 전문어**를 word로 삼아, 의료진·차트에는 맞고 가족·환자에게만 어색하게 고칩니다(이 주제 뉘앙스는 A 새 저작이라 who·icon도 맞춰 써도 됨). `words`는 지금 id 그대로 두되 표에 적은 것만 바꿉니다.

  | 상황 | 지금 word | 새 word · ko | ok 장면 2 | 어색한 장면 → fix |
  |---|---|---|---|---|
  | 0 알람 설정 | alarm (ok 장면이 '환자에게' — 어색한 '보호자에게'와 둘 다 일반인) | `artifact` · 잡음 신호 | 동료 "That alarm was artifact from him scratching at the leads." / 차트 "Alarm artifact from patient movement; leads reapplied." | 보호자 "Don't worry, that alarm was just artifact." → "That alarm went off because he moved and a sticker shifted — his heart rhythm is fine." |
  | 1 억제대 대안 | restraint | `least restrictive` · 가장 덜 제한적인 | 의사 "We've tried the least restrictive options; the sitter isn't enough." / 차트 "Least restrictive alternatives (sitter, mitts) tried first." | 보호자 "We tried the least restrictive alternatives first." → "Before using these soft ties, we tried having someone sit with him and covering his lines." |
  | 3 라인 라벨 | line | `lumen` · (중심정맥관의) 내강 | 동료 "Which lumen is the heparin running in?" / 차트 "Distal lumen labeled heparin; proximal lumen TPN." | 환자 "I'm checking which lumen each medicine goes into." → "I'm following each tube to make sure every medicine goes where it should." |
  | 5 투약 5R | check | `two identifiers` · 환자 식별자 두 가지 | 동료 "Did you use two identifiers before you scanned?" / 차트 "Two identifiers (name, DOB) verified before administration." | 환자 "I need two identifiers from you." → "Before I give this, can you tell me your full name and date of birth?" |
  | 7 억제대 모니터 | reposition | `bony prominences` · 뼈 돌출부 | 동료 "Check his bony prominences when we turn him." / 차트 "Skin over bony prominences intact, no redness." | 환자 "I'm checking your bony prominences for pressure." → "I'm checking the skin over your hips and heels, where pressure builds up." (words `[w-skin]`) |
  | 8 오연결 예방 | connect | `misconnection` · 오연결 | 동료 "This is how misconnections happen — trace it first." / 차트 "Tubing misconnection caught before infusion; feeding set traced and relabeled." | 환자 "I'm checking for misconnections." → "I'm making sure each tube is hooked to the right place." |
  | 9 전해질·마약 | locked | `waste` · (남은 마약) 폐기 | 동료 "Can you witness my waste of the leftover fentanyl?" / 차트 "Fentanyl 50 mcg wasted, witnessed by second RN." | 보호자 "I just need someone to witness my fentanyl waste." → "Another nurse is watching me throw away the leftover pain medicine — that's our safety rule." (words `[w-narcotic]`) |
  | 12 독립확인 | independent | `high-alert` · 고위험(약) | 동료 "Heparin is high-alert, so I need a second nurse." / 차트 "High-alert med; independent double-check done with second RN." | 환자 "Your heparin is a high-alert drug." → "This medicine needs extra care, so a second nurse will check it too." |
  | 13 이송 | checklist | `FiO2` · 흡입 산소 농도 | 동료 "What's his FiO2 before we switch to the transport vent?" / 차트 "Transported on FiO2 40%, sats 96%." | 보호자 "We're keeping his FiO2 at forty percent for the trip." → "We're bringing enough oxygen so he gets the same amount on the way to his scan." |
  | 14 보고 문화 | report | `sentinel event` · 적신호(중대 위해) 사건 | 동료 "If this caused harm, it may be a sentinel event." / 관리자 "Reporting a possible sentinel event on bed six." | 환자 "This is being reviewed as a sentinel event." → "We're looking closely at what happened so it doesn't happen again, and your doctor will talk with you." |
  | 15 라인 치명 오류 | stop | `wrong-route` · 경로 오류(투여) | 동료 "That's a wrong-route infusion — stop it now." / 의사 "Wrong-route infusion stopped at 1410; he's alert, vitals stable." | 가족 "There was a wrong-route infusion." → "We stopped one of his medicines and we're checking him closely; the doctor will come talk with you." |
  | 16 용량사고 | document | `supratherapeutic` · 치료 범위를 넘은 | 동료 "His PTT is supratherapeutic — hold the drip." / 차트 "PTT supratherapeutic at 150; drip held, MD notified." | 보호자 "His heparin level is supratherapeutic." → "His blood is thinner than we want, so we stopped that medicine and the doctor is on the way." |
  | 17 억제대 질식 | release | `positional asphyxia` · 자세성 질식 | 동료 "He slid down — that's how positional asphyxia happens." / 의사 "Restraint released; no signs of positional asphyxia." | 환자 "We released it to prevent positional asphyxia." → "I'm taking this off right away so you can breathe easier." |
  | 18 알람 무시 급변 | alarm | `desat` · 산소포화도가 떨어지다 | 동료 "He's desatting — look at him now." / 담당의 "He desatted to 82 at 0230; I turned up his oxygen and called you." | 보호자 "He desatted a few minutes ago." → "His oxygen level dropped, and we're giving him more oxygen right now." |
  | 19 전원 고장 | battery | `pressors` · 승압제 | 동료 "Keep the pressors running — move them to battery first." / 의사 "Pressors running on battery without a gap." | 보호자 "His pressors are on battery." → "The medicine holding up his blood pressure is still running on battery, and we're watching it closely." |
  - context 10(`reorient`)만 지금 모양이 맞음 — 그대로.
  - 각 why는 "의료진·차트에는 정확한 말, 가족·환자에게는 무엇을 하는지 쉬운 말로" 틀로 새 word에 맞춰 다시 쓰고, 5번 why의 "침상 번호는 식별자로 쓰지 않아요"는 살리세요.
- **N11(낮음) icon** — 이 주제는 환자·보호자 모두 `me`. 다른 ICU 주제처럼 보호자·가족은 `home`으로 가르면 화면에서 구분됩니다(N10에서 같이).

나머지 판정: slider 0·1·2·4·8·11·12·13·14·15·17·18·19·20은 약함→강함 순서가 맞고 cue로 정답이 하나. swap 2·4·6·11·20은 `before[0]+선택지+before[2]` 셋 다 문법 맞음, swap `ko`는 20만 N8, 나머지 넷은 바꾼 문장의 뜻과 맞음. pair 없음(전수 대상 0).

## 저작자 메모 판정
| 메모 | 판정 |
|---|---|
| A·B 12.5 값을 먼저 말함 | 타당 → S1(안전). 같은 문제인 2.5도 S2로 추가 |
| 2.0 "verify … together"(KP) | 타당 → K1 |
| 18.1 rapid response(KP) | 타당 → K2 |
| 15.4 airway first, then physician | 타당 → S3(안전) |
| 9.5 only the two of us hold the keys | 타당 → S5 |
| 16.1 Prepare protamine(KP) | 일부 타당 — 해독제를 꺼내 두는 것은 표준 대비, 투여는 처방 뒤 → K3(유지 + why). 비KP 16.5는 순서 모순까지 있어 S4 |
| 16.3 ten times the ordered dose | **유지** — "I think"로 판단임을 밝혔고, 위기 보고에서 크기(배수)를 말하는 것이 SBAR의 Assessment. distractorsKo(용기·포장·청구)는 B 몫 |
| 20.3 family first / 20.2 make it right | 20.3 타당 → S6. 20.2는 팀 원칙 진술이라 K4(유지 권고) |
| 6.1 widen thresholds(KP) | 판단은 맞음 — K5(유지 + v46 why 보강) |
| 7.0 every two hours(KP) | K6 유지 — 비폭력 억제대는 병원 정책(흔히 2시간)으로 정하고 CMS가 정책을 따르라고 함 |
| 괄호 ko w-order·w-fall·w-drip·w-slip | w-order `처방(오더)`·w-fall `낙상(하다)`은 유지. w-drip·w-slip은 오답까지 괄호를 지어내야 해서 W14·W15로 괄호를 없앰 |
| 은행 정리·헤드워드(prompt·crash)·ko 가르기 | 타당. w-stand(W12)·w-alert 태그(T1)가 남은 흠 |
| B 메모(오답 대상 바꾸기) | B 검토 몫 — 여기서 판정하지 않음 |

## 결정 11 — 저작자 변경 판정
- word-remove 22: 공통 목록 12(minute·patient·hour·time·now·room·name·day·doctor·family·know·night) + 판단 10(red·yellow·first·light·tonight·give·ask·say·bed·help) — 상한 지킴, 과하지 않음.
- word 6: verify 검증하다/confirm 재확인하다, trace 추적하다/follow 따라가다, afterward 그 후에/later 나중에 — 듣고 뜻 고르기의 정답 둘 문제를 푼 타당한 가르기. prompting→prompt, crashing→crash 타당.
- sentence 48: 전부 `words` 태그만, en·ko·chunks 변경 없음(스크립트 확인). w-off의 "sign off" 태그 빼기 타당.
- 추가로 필요한 것: T1(w-alert), W12(stand out), W14·W15(괄호 ko), W16(feeding ko), S6(20.3 words 빈 목록), S5에 따른 w-key 삭제, K2를 바꾸면 w-rapidresponse 삭제.

## keyPhrase — 사용자 결정 필요 (en·chunks는 고치지 않음)
| # | 문장(현재 en) | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| K1 | 2.0 Let's verify the drug, dose, rate, and pump settings together. | together가 함께 읽으며 확인하는 것으로 읽혀, 같은 주제 12장(각자 따로)과 어긋남 | `Let's each verify the drug, dose, rate, and pump settings, then compare.` | **바꿈(중)**. 유지한다면 v46 why에 "같은 자리에 있되 확인은 각자 따로 한 뒤 맞춰 봐요" |
| K2 | 18.1 Call for the rapid response and start oxygen. | ICU 안에서는 RRT가 아니라 담당의·당직 중환자의 호출. 산소포화도 알람이 난 ICU 환자는 대개 이미 산소 중 | `Call the ICU physician now and increase his oxygen.` | **바꿈(강)**. 바꾸면 w-rapidresponse 은행에서 삭제, order 18의 3줄 "call for the rapid response"도 같이 |
| K3 | 16.1 Prepare protamine and notify the physician immediately. | 프로타민 투여는 처방 필요 — '준비'가 단독 처치로 읽힐 수 있음 | `Notify the physician immediately and have protamine ready.` | **유지(약하게 바꿈 가능)**. 유지하면 v46 why에 "투여는 의사 처방 뒤, 지금은 꺼내 두는 것" |
| K4 | 20.2 We acknowledge what happened and our plan to make it right. | 간호사가 바로잡겠다고 약속하는 말로 읽힐 소지 | `We acknowledge what happened and explain our plan from here.` | **유지** — 20.1(의사가 이끔) 다음의 팀 원칙 진술. v46 why의 "앞으로의 약속"을 "앞으로의 계획"으로 |
| K5 | 6.1 We can widen non-critical thresholds without losing safety. | 간호사가 임의로 넓혀도 된다는 말로 읽힐 소지 | — | **유지**. v46 why에 "병원 규정과 처방(또는 승인된 범위) 안에서"를 넣기(지금 why에 없음) |
| K6 | 7.0 We check circulation and skin every two hours. | 간격은 억제대 종류·병원 정책마다 다름 | `We check circulation and skin as often as policy requires.` | **유지**. v46 why "every two hours가 주기를 숫자로 못 박아요" 뒤에 "간격은 병원 정책을 따라요" |
| K7 | 청크 구 끊김 | 19.0 `and the red / emergency outlets` · 10.1 `out of easy / reach` · 12.2 `for all high-alert / medications` | 19.0 `Switch to / battery backup / and the red emergency outlets / .`(8낱말·3조각 충족) · 10.1 `Secure and camouflage / his lines / out of easy reach / .` · 12.2 `This is required / for all / high-alert medications / .` | 바꿈(청크만) |

## 종합
고칠 것 115건 = 문장 18(S1~S8 8 · 청크 3 · KP ko 6 · 태그 1) + 단어 71(W1~W19 19 · decoy 7 · cue 45) + 뉘앙스 26(N1~N9 9 · context 재작성 15 · 기타 2). 그중 ★(꼭) 22, **환자 안전 4건(S1·S2·S3·S4)**. 가장 무거운 것은 독립확인을 깨는 두 문장(12.5·2.5)과 context 15개 재작성, slider 10 데이터 깨짐입니다. 이것들을 반영하고 K1·K2를 결정하면 내보내도 됩니다.
