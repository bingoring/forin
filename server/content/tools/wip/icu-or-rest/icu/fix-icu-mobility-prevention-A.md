# fix-icu-mobility-prevention-A — A 검토 (v45 1~7 + 기계적 전수 + v46 7번)

대상: `icu-mobility-prevention.yaml` (단어 191 · 상황 21 · 문장 127 · 뉘앙스 42).
뽑기 스크립트: `dump_icu-mobility-prevention_review.py` (words / sent / nu), 뉘앙스 덤프 `nu_icu-mobility-prevention.txt`.

## 항목별 점수
| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 철자·소리 닮은 오답이 대부분 좋음. 품사 불일치 ★1건(bleeding) |
| 2 | distractorsKo·길이·정답 둘 | 4 | 길이는 전부 통과. `w-ease`의 '세게 던지다'는 읽기만 해도 걸러짐 |
| 3 | cue | 4 | 정답·파생형 노출 없음. `w-weaken`만 ko를 그대로 되풀이 |
| 4 | chips/decoyChips | 4 | 형태소 분할 좋음. decoy에 가벼운 거슬림 7개(sin·stiff·dye·jin·sod·bleep·stag) |
| 5 | 사실 정확성 | 3 | ICU 안 신속대응팀 호출, 알람 '응급 아님' 단정, 중심정맥관 이탈 때 공기색전(밀폐 드레싱) 빠짐, comfort measures 뜻 |
| 6 | 뉘앙스 설계 | 4 | pair 4개는 전 조합을 봐도 정답 하나. slider [3] 답이 둘, slider [9]에 위험 처치 선택지, swap [3] 문법 |
| 7 | 결정 11 | 4 | 원형화 26건은 전부 맞음(승인). `w-call` 뜻 어긋남·문장 2개 고칠 것 |

## 사실 오류·심각한 문제
1. **[6] 인공호흡 환자 조기 이동 s6** `I told him the vent alarm during this move isn't an emergency.` — 원인을 확인하기도 전에 알람을 '응급 아님'으로 단정해 환자에게 말한다. 잘못된 안심이고 위험하다(안전).
2. **[18] 급성 폐색전 s5(그리고 keyPhrase s2)** — ICU 안에서 신속대응팀을 부른다. 미국 ICU에서는 상주 중환자 담당의(intensivist/ICU provider)를 침상으로 부른다. 신속대응팀은 병동처럼 ICU 밖에서 쓰는 체계다(실무 사실).
3. **[19] 라인 이탈 slider why** — 중심정맥관이 빠졌을 때 '세게 직접 압박'만 말한다. 공기색전을 막는 **밀폐(occlusive) 드레싱**이 빠졌다(안전).
4. **[20] s4** `I know this is realistic, but …` — 영어가 틀렸다(이런 뜻으로 쓰지 않는다).

## 고칠 것 (24건, 그중 안전 6건)

### 문장 (keyPhrase 아님 — en·ko·chunks와 그 문장의 v46 필드 why·blank·decoy·distractorsKo를 새로 쓴다. changes에 `kind: sentence` 기록)
1. **[안전] [6] 인공호흡 환자 조기 이동 · s6**
   - en: `I told him that if the vent alarms during this move, we'll check it right away.`
   - ko: `이동 중에 인공호흡기 알람이 울리면 바로 확인하겠다고 말했어요.`
   - chunks: `["I told him", "that if the vent alarms", "during this move", ", we'll check it", "right away", "."]`
   - words: `[w-tell, w-vent]` → `w-emergency`는 어느 문장도 태그하지 않게 되므로 **word-remove**(상황 [6]은 단어 17개라 V3 충분).
   - v46: why = "'if … we'll check it right away'로 알람이 울리면 원인을 바로 본다고 미리 알려요. '괜찮다'고 단정하지 않고 확인하겠다고 해야 안심도 되고 안전도 지켜요." / distractorsKo 예 `식사 중에 인공호흡기 알람이 울리면 바로 확인하겠다고 말했어요.` · `이동 중에 침대 알람이 울리면 바로 확인하겠다고 말했어요.` / blank는 `alarm`(동사가 됨)을 쓴다면 명사 오답(hose·cart·pole)을 버리고 다시 고른다. 'mute·ignore·reset'처럼 알람을 끄는 행동은 오답으로도 쓰지 않는다. decoy `during this meal`은 그대로 둬도 된다.
2. **[안전] [18] 급성 폐색전 발생 위기 · s5**
   - en: `I called the provider to the bedside the moment his sats crashed.`
   - ko: `산소포화도가 급락하는 순간 주치의를 침상으로 불렀어요.`
   - chunks: `["I called the provider", "to the bedside", "the moment", "his sats crashed", "."]`
   - words: `[w-call, w-provider, w-sat]`
   - v46: why = "'the moment'는 알아챈 즉시라는 뜻이에요. ICU에는 담당의가 상주해서 신속대응팀이 아니라 담당의를 침상으로 바로 불러요." / distractorsKo `혈압이 급락하는 순간 주치의를 침상으로 불렀어요.` · `맥박이 급락하는 순간 주치의를 침상으로 불렀어요.` / blank `crashed`와 decoy는 그대로 둬도 된다.
   - 아래 keyPhrase 결정 1번에서 s2를 바꾸면 `w-rapid`·`w-response`도 word-remove 한다.
3. **[20] 다발성 욕창·불응 목표 소통 · s4**
   - en: `I know this is hard to hear, but I want you to know we're not giving up on his comfort.`
   - ko: `듣기 힘든 이야기라는 걸 알지만, 편안함을 포기하지 않는다는 것도 알아주셨으면 해요.`
   - chunks: `["I know this is hard to hear", ", but I want you to know", "we're not giving up", "on his comfort", "."]`
   - words: `[w-comfort]`(`w-realistic`은 s5에 남는다)
   - v46: why = "'I know this is hard to hear'로 듣기 힘든 소식임을 먼저 인정하고 'but'으로 지지를 덧붙여요. 'not giving up on his comfort'는 돌봄을 멈추지 않는다는 말이에요." / distractorsKo는 새 ko에서 한 군데만 바꾼다(예: `…수면을 포기하지 않는다는…` · `…식사를 포기하지 않는다는…`). blank `realistic`은 en에서 빠지므로 다시 고른다(`comfort` 권장, 회복을 약속하는 `recovery`·`cure`는 오답으로 넣지 않는다). decoy `on his heart`도 다시 쓴다.

### 문장 ko (keyPhrase, ko만 — 결정 11 범위. 그 문장의 distractorsKo 둘도 새 ko에 맞춰 다시 쓴다)
4. **[11] 재활팀 협업 계획 · s3** ko `매일 그의 내성 상태를 알려줄게요.` → `매일 그가 활동을 얼마나 견디는지 알려줄게요.` distractorsKo 예: `매일 그가 식사를 얼마나 하는지 알려줄게요.` · `매일 그가 잠을 얼마나 자는지 알려줄게요.` why의 '내성은 …'은 'tolerance는 그날 환자가 활동을 견딘 정도라 …'로 고친다.
5. **[13] 점진적 좌위·의자 이동 · s1** ko `먼저 침대 끝에 앉히고 내성을 확인할게요.` → `먼저 침대 끝에 앉히고 잘 견디는지 확인할게요.` distractorsKo: `먼저 침대 머리를 올리고 잘 견디는지 확인할게요.` · `먼저 침대 난간을 내리고 잘 견디는지 확인할게요.`

### chunks (keyPhrase 아님 — 구 경계를 끊은 것. changes에 `fields: [chunks]`. decoy가 새 조각 자리와 맞는지 다시 볼 것)
6. [2] s5 → `["I'll offload", "the pressure points", "again", "after this turn", "."]` (`again after` ✕)
7. [4] s0 → `["Let's inspect", "every pressure point", "for early", "skin changes", "."]` (`early skin / changes` ✕)
8. [4] s4 → `["It doesn't blanch", ", so", "I'll call this", "a stage-one injury", "."]` (`this a stage-one` ✕). 같은 문장의 words에서 `w-call`을 뺀다(아래 13번).
9. [7] s0 → `["Let's assess", "her fall risk", "before", "we help her up", "."]` (`help / her up` ✕)
10. [8] s0 → `["Let's stage", "this wound", "accurately", "before we treat it", "."]` (`this wound accurately`, `treat / it` ✕)
11. [9] s0 → `["Devices cause", "pressure injuries too", ", so let's check", "under his oxygen tubing", "."]` (`too, so let's check` · `oxygen / tubing` ✕)
12. [10] s0 → `["He's got", "a bleeding risk", ", so let's weigh it", "against VTE prevention", "."]`; [10] s4 → `["We'll use", "the sequential compression devices", "while chemical prophylaxis", "is contraindicated", "."]`; [11] s0 → `["Let's coordinate", "with PT", "and OT", "on a mobility plan", "."]`; [11] s5 → `["I'll set", "his mobility goals", "with", "the whole team", "."]`; [12] s4 → `["Less sedation", "means", "she can participate", "in her own care", "."]`; [13] s5 → `["She tolerated", "the chair well", ", with stable vitals", "the whole time", "."]`; [17] s0 → `["She's going down", ", so let's", "ease her", "to the floor", "."]` (같은 갈래라 한 항목으로 묶음)

### 단어
13. **w-call** — [4] s4의 `call this a stage-one injury`는 '판정하다'라서 헤드워드 ko `부르다`와 맞지 않는다. 그 문장 words에서 `w-call`을 빼고, example을 `I'm calling the provider now because this infection can't wait.` / exKo `이 감염은 못 기다리니 지금 주치의를 부를게요.`로 바꾼다(changes 기록).
14. **★ w-bleed** distractorsEn `[blend, breed]` → `[breeding, blending]` (정답 bleeding만 -ing 꼴이라 품사·모양으로 골라진다).
15. **w-ease** distractorsKo `세게 던지다` → `빠르게 일으키다` (말이 안 되는 오답이라 읽기만 해도 걸러진다).
16. **w-weaken** cue `힘이 빠져 전보다 약해지다`가 ko를 되풀이한다 → `오래 누워만 지내면 팔다리 힘이 하루가 다르게 빠지는 변화`.
17. **decoyChips(낮음)** — `w-sit` sin → `sat`, `w-staff` stiff(시체를 뜻하는 속어) → `stuff`, `w-dietitian` dye(die와 소리가 같음) → `dee`, `w-oxygen` jin(gin과 소리가 같음) → `jan`, `w-sudden` sod(영국 비속어) → `sad`, `w-bleed` bleep(욕설을 가리는 소리) → `breed`, `w-stay` stag(stag film) → `stair`. 성적인 조각·술 이름 그 자체는 없다. 참고로 distractorsEn `deadly`(daily)·`fatal`(foul)은 죽음을 떠올리게 하지만 바꿀 것까지는 아니다.

### 뉘앙스
18. **[안전] [19] slider why** — 끝에 덧붙인다: "빠진 자리에는 공기가 들어가지 않게 밀폐 드레싱을 대요." (같은 상황 s1 `The central line pulled — …`의 v46 why에도 밀폐 드레싱 한 줄을 넣는다. B 검토와 겹칠 수 있음)
19. **[안전] [9] slider** — scale `stop her oxygen`은 하면 안 되는 처치를 선택지로 보인다 → `["leave it alone", "pad and move it", "call the wound team"]`, answerAt 1 그대로. why: "분홍빛만 돈다면 쿠션을 대고 위치를 옮기면 충분해요. 그냥 두면 손상으로 진행할 수 있고, 상처팀은 피부가 상했을 때 불러요."
20. **[안전] [20] pair why** — `comfort measures`는 미국에서 흔히 'comfort measures only(CMO)', 곧 연명 치료를 멈추고 편안함만 돌보는 결정을 가리킨다. why에 "치료 방향을 정하는 말이라 담당의·가족이 함께 정한 뒤에 써요."를 넣는다. 같은 문항 words의 `w-dignity`는 짝에 없으니 뺀다.
21. **[안전] [16] slider why** — "산소를 올려요" 앞에 "처방·프로토콜 범위 안에서"를 넣는다. keyPhrase s2(`increase her oxygen`)의 v46 why에도 같은 전제를 넣는다.
22. **[3] slider** — 지시를 따르는 환자에게 `exercise in bed`도 첫 단계로 맞을 수 있어 정답이 둘이다. cue `Colleague: "She passed the mobility screen today, but she hasn't been out of bed yet. What's her first step out of bed?"`, scale `["sit at the bed edge", "stand at the bedside", "walk down the hall"]`, answerAt 0으로 바꾸고 why는 그대로 쓴다.
23. **[3] swap** — `Your oxygen level and blood pressure look steady enough to sit up.`은 주어(수치)가 앉는 꼴이다. before[2]를 ` and blood pressure look steady enough for you to sit up.`으로 바꾼다(ko는 그대로).
24. **사실 표현 다듬기(묶음)**
    - [0] slider why `함께 쓰는 게 일반적이에요` → "약물 예방은 처방대로 쓰고, 병원 지침에 따라 압박기기를 함께 쓰는 경우가 많아요" (미국 지침은 약물 예방이 기본이고, 함께 쓰는 것은 기관 order set에 따른다)
    - [18] slider why `고유량 산소` → `고농도 산소` (비재호흡마스크는 FiO2가 높은 기구다)
    - [2] context 가족 장면 `to redistribute shear` → `to redistribute pressure and reduce shear` (어색한 장면이라도 용어는 맞게)
    - [10] context `word: contraindicate` → `contraindicated` (헤드워드 en·ko `금기인`과 맞춤)
    - [6] swap notes `ambulate` → "걷게 한다는 임상어라 가족에게 낯설고, 지금 하는 일보다 좁은 뜻이에요."
    - 문장 v46 why에 처방·프로토콜 전제를 넣는다. 모두 keyPhrase여서 en은 그대로 둔다(B와 겹칠 수 있음).
      - [8] s2: "드레싱 종류는 병원 상처 간호 프로토콜·처방 안에서 골라요."
      - [10] s1: "금기 판단은 처방자가 해요."
      - [10] s5: "재개는 처방자가 정해요."
      - [18] s2: 현재 `신속대응팀은 악화가 의심될 때 부르는 팀`. keyPhrase를 유지하면 "ICU 밖 병동의 체계이고, ICU 안에서는 보통 담당의를 불러요"로 바로잡는다.
      - [20] s3: "목표 전환은 담당의·가족과 함께 정해요."

## 결정 11 판정 (저작자 메모·변경 목록)
- **원형화 26건(1할 초과)**: 26건 모두 지시서의 '활용형 → 원형' 규칙에 맞고 틀린 것이 없다. 1할은 상한이 아니라 보통의 규모이므로 **승인**한다. `w-change`의 ko `변화/교체`는 문장 두 뜻을 담은 것이라 받아들인다.
- **w-vent 명사화**(vented → vent, ko 인공호흡기): 문장 3개 중 2개가 명사 `the vent`이고, s0의 `vented`는 같은 말의 동사형이다. **승인**한다.
- **새 단어 w-sign·w-stay**: 둘 다 문장에 이미 있고 가르칠 값이 있어(`any sign of injury`, 도움을 부른 뒤 `stay with her`) **승인**한다. 덧붙여 [7] s3 `the first sign of dizziness`에도 `w-sign`을 태그하면 좋다(선택).
- **w-tolerance ko '견디는 정도'**: **승인**한다. 문장 ko 두 곳은 고칠 것 4·5번에서 고친다.
- **wound bed 연어**: 새 단어로 만들지 않는다. 결정 11은 V3가 모자랄 때만 새 단어를 허용하는데, [8]은 단어가 충분하고 `w-wound`가 같은 문장에 태그돼 있다. 그대로 둔다.
- **w-provider ko 주치의**: 그대로 둔다(문장 ko와 일관됨).
- **w-plan·w-score 동사 용례**: 각각 한 문장뿐이고 어형 변화 범위라 그대로 둔다.
- **VTE 금기 [10] s1·s2, 드레싱 [8] s2, 산소 증량 [16] s2**: 모두 keyPhrase다. 팀 화법(we)이나 프로토콜 범위 안의 간호 행위라 en은 그대로 두고, why에 처방·프로토콜 전제를 넣는다(24번).
- **B 메모**: [17] s0 decoy, [3] s5·[6] s3 오답, [7] s2 오답은 B 검토 몫이다.

## 기계적 전수 확인 결과
- **pair 4개** (전 조합 출력): [7] gait/fall/lock, [13] transfer/sit/check, [14] wound/calorie/registered, [20] honest/comfort/wound. 정답 짝 말고 성립하는 결합이 **없다**. `sit to the chair`, `comfort conversation`, `wound measures`도 관용 결합이 아니다.
- **slider**: 21개 모두 약함 → 강함 순서다. 정답이 둘인 것은 [3]뿐이다(22번).
- **context 18개**: word가 세 장면 모두에 있다(W14 0건). 어색한 장면은 전부 환자·가족이 듣는 자리이고, 맞는 두 장면은 서로 다른 의료진(의사/동료, 책임간호사/상처팀 등)이다. 어색한 표현 자체를 word로 고른 문항은 없고, 일반인도 아는 말을 word로 고른 문항도 없다.
- **swap 3개** (이어 붙인 문장): [6]·[20]은 문법이 맞다. [3]은 23번. swap ko 3개는 모두 바꾼 문장의 뜻과 맞다.
- **distractorsEn 품사가 다른 것**

| 단어 | 정답 | 오답 | 판정 |
|---|---|---|---|
| ★ w-bleed | bleeding(-ing 명사) | blend, breed(원형 동사) | 바꿀 것(14번) |
| w-before | before(접속사로 쓰임) | behind, below(전치사) | 그대로 — 철자로 헷갈리는 것이 목적 |
| w-instead | instead(부사) | indeed(부사), inside(전치사·부사) | 그대로 |
| w-feeding | feeding(형용사적) | feeling(명사), heeding(동사 -ing) | 그대로 — 모양이 같다 |

- **chunks — keyPhrase라서 보고만 하는 것(구 경계를 끊음)**: [0] s3 `and any / contraindications`, [1] s2 `are her biggest / factors`, [3] s1 `meet the mobility / criteria`, [4] s2 `a stage-one / injury`, [5] s1 `through its full / range`, [5] s3 `contractures while / he's immobile`, [8] s1 `with partial-thickness / loss`, [9] s3 `are common / pressure / points`, [12] s1 `prevent ICU-acquired / weakness`, [12] s2 `deep sedation to keep / her participating`, [13] s3 `at each / step`, [14] s1 `support wound / healing`, [15] s1 `with foul / drainage`, [15] s3 `debridement and / cultures`, [17] s3 `from head / to toe`, [20] s2 `honestly about / his overall / condition`.

## keyPhrase 결정 필요 (en은 고치지 않음 — 사용자 결정)
1. **[18] s2** `I'm giving high-flow oxygen and calling the rapid response.`
   - 문제: ICU 안에서 신속대응팀을 부른다. 미국 ICU는 담당의를 부른다. in-json의 goals `신속대응팀 소집`도 같은 전제다.
   - 대안: `I'm giving high-flow oxygen and calling the provider to the bedside.` (words `[w-oxygen, w-call, w-provider]`)
   - 권고: **바꿈**. 바꾸면 `w-rapid`·`w-response`를 word-remove 하고, 이 문장의 v46 필드(why·distractorsKo 둘째 `신속대응팀을 부르려고…`·blank `rapid`·decoy)를 새로 쓴다.
2. **[20] s3** `Let's focus on his comfort and dignity together.`
   - 문제: 간호사 혼자 목표를 편안함 중심으로 바꾸자고 제안하는 것처럼 들릴 수 있다.
   - 대안: `Whatever we decide together, his comfort and dignity come first.`
   - 권고: **유지**. 가족 면담에서 `together`로 함께 정한다는 말이고, 편안함·존엄은 어느 목표에서나 간호가 지키는 가치다. 대신 why에 "목표 전환은 담당의·가족과 함께 정해요"를 넣는다(24번).
3. **[8] s2** `I'll choose a dressing that keeps the wound bed moist.`
   - 문제: 드레싱 선택은 상처 간호 프로토콜·처방 범위 안의 일이다.
   - 권고: **유지**. 미국 간호사가 프로토콜 안에서 드레싱을 고르는 것은 흔하다. why만 보강한다.
4. **[16] s2** `Get her back to bed and increase her oxygen.`
   - 문제: 산소 증량은 처방·프로토콜(적정 범위 지시)이 전제다.
   - 권고: **유지**. ICU에는 SpO2 목표 범위로 산소를 조절하는 지시가 흔하다. why만 보강한다.
5. **[10] s1·s2** `… chemical prophylaxis is contraindicated for now.` / `We'll rely on mechanical prophylaxis instead.`
   - 문제: 금기 판단은 처방자 몫이다.
   - 권고: **유지**. 팀이 내린 판단을 전하는 문장이다. why에 처방자 판단을 넣는다.
- (참고) [11] s3·[13] s1은 en은 맞고 ko만 틀렸다. 결정 11 범위라 고칠 것 4·5번에서 처리한다.

## 종합
고칠 것 24건(안전 6건)을 반영하고 keyPhrase [18] s2를 결정하면 내보내도 된다. 가장 급한 것은 [6] s6(알람 '응급 아님' 단정), [18] s5(ICU 안 신속대응팀), [19] 공기색전 대비 빠짐이다.
