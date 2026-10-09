# 검토 — er-sepsis (v45 보강)

대상: `/tmp/lesson-er-v45b/er-sepsis.yaml` (단어 206 · 상황 21 · 뉘앙스 45: slider 16 · pair 5 · context 10 · swap 14). 단어 전부·뉘앙스 전부를 읽었고, pair는 전 조합(좌×우, 좌×decoy)을, swap은 before+option을 이어 읽었다.

## 항목별 점수

| # | 항목 | 점 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 철자·접두사·분야가 닮은 오답이 대부분. 정답으로도 맞는 오답 2건(w-race `pound`, w-step `stage`), 경계 1건(w-burn `sting`). |
| 2 | distractorsKo | 4 | 같은 분야의 그럴듯한 뜻. 정답 단어의 다른 뜻이 들어간 것 1건(w-level `단계`). |
| 3 | cue | 4 | 정답·약어 노출 없음, ko 되풀이 없음. 단 w-little의 cue가 문장 실제 어형 `less`를 그대로 보여 준다. |
| 4 | chips/decoyChips | 5 | 형태소 단위로 잘랐고 decoy가 정답 조각과 닮았다(hypo/hyper식). `read-y`·`e-nough`처럼 비형태소 분할이 몇 개 있으나 학습에 해는 없다. |
| 5 | 뉘앙스 사실 정확성 | 5 | SSC·SEP-1 수치 전부 맞음(아래 사실 확인). 틀린 주장 없음. 표현을 다듬을 것 2건(w-antibiotic cue의 '1시간' 일반화, 폐렴 slider why의 '위험할 만큼은 아니에요'). |
| 6 | 뉘앙스 설계 | 4 | pair 5건 모두 교차 조합이 영어로 성립하지 않음, swap 14건 모두 이어 읽으면 문법 맞음, context 10건 모두 같은 뜻·자리 불일치. slider 2건의 축 낱말 품사가 틀 문장에 안 맞음(노인 `a fever`, 요로 `soon`). mottling keyPhrase와 그 상황 context가 서로 어긋남(아래 3). |
| 7 | v44·결정 11 | 4 | 쉬운 단어 16개 제거(221개의 7%) 전부 타당. 헤드워드 9건 변경·w-runfever 추가 모두 결정 11 안이고 형제 주제 선례와 맞음. ko 정리 중 w-level `농도`는 형제 18개 주제(`수치`)와 어긋남, `confused` ko 표기만 형제와 다름. 손대지 않은 흠 3건(w-place·w-crash·w-get). |

## 사실 오류·심각한 문제

**없음.** 환자 안전에 오해를 부를 주장은 찾지 못했다.

저작자 보고 사항 판정(1. 사실 확인):
- **100.4°F / 38.0℃ 발열 기준** — w-temperature·w-fever cue, 면역저하 slider 모두 38.0℃(100.4℉) 이상 = 발열. CDC·미국 병원 통용 기준과 일치. SIRS는 "38℃ 초과"라 38.0 자체는 SIRS 미충족이지만, 문항은 SIRS가 아니라 '발열이냐'를 묻고 있어 맞다. 노인 slider "36℃ 미만 저체온, SIRS는 >38·<36 모두 이상" ✓, 35.6℃=96.1℉ 환산 ✓.
- **30 mL/kg** — 1시간 번들 slider why "젖산 4 이상이면 … 30 mL/kg 수액 같은 적극 소생의 기준" = SEP-1(저혈압 또는 젖산 ≥4 → 30 mL/kg) ✓. 젖산 위기 cue "despite 30 mL/kg" ✓.
- **젖산 재측정** — "After fluids, we'll recheck", "in a couple hours"(SEP-1: 초기 >2면 6시간 안 재측정) ✓. slider 4.2→3.1 "좋아지지만 2 넘어 정상 아님" ✓. 젖산 2 이상/4 이상 구분 ✓.
- **MAP 65** — 수액반응성 slider "Goal MAP 65 or higher", w-map cue, ICU 인계 "holding at 66" ✓.
- **배양 후 항생제, 지연 금지** — 배양 slider why "항생제를 크게 늦추지 않는 한에서 배양 먼저"(SSC: 45분 넘게 늦추지 말 것) ✓. 언어장벽 slider "쇼크 의심이면 1시간 안 항생제" ✓. w-antibiotic cue "패혈증 인지 후 1시간 안에 들어가야 한다"는 SSC 2021이 1시간을 쇼크·고가능성에 두고 쇼크 없는 '가능 패혈증'은 3시간까지 허용하는 것보다 넓게 말했다 — 빠른 쪽으로 틀린 것이라 안전엔 문제 없으나 아래 고칠 것에 완화안.
- **노르에피네프린 1차** — w-norepinephrine cue "가장 먼저 쓰는 승압제, Levophed" ✓. "Pressor's running through the peripheral line until central access is in" = SSC 2021 말초 투여 허용 ✓.
- **mottling·모세혈관 재충전** — context "Mottling to bilateral knees, extremities cool, cap refill 5 sec"(정상 <2~3초) ✓. w-mottle cue(무릎·다리 그물 무늬) ✓.
- **qSOFA/SIRS** — context "SIRS 3/4 (T 38.4, HR 96, RR 22)" — 세 항목 모두 기준(>38, >90, >20) 충족 ✓. slider "HR 96은 SIRS 90 초과" ✓. qSOFA는 상황 제목에만 있고 문항 어디에도 없다 — 오류는 아니고 공백(소유자 참고).
- **면역저하에서 호중구감소 발열 기준을 넣지 않은 판단** — 타당. 장면이 신장이식 환자의 면역억제제이지 항암 호중구감소가 아니다. IDSA 발열성 호중구감소증 기준(ANC<500, 38.3℃ 1회 또는 38.0℃ 1시간 지속)은 이 장면에 적용되지 않으므로 넣지 않은 것이 맞다. 넣었다면 오히려 혼란.
- 그 밖에: UOP 0.5 mL/kg/hr 목표 ✓, 폐쇄성 신우신염 긴급 감압(스텐트/PCN) ✓, 라인 균혈증 paired cultures·rigors ✓, 32주 태아 지속 감시 ✓, A&O x3 ✓, AMA·AP의 older adults 권고 ✓, closed-loop communication ✓.

**2. slider 16개** — 모두 한 축이다(속도·지연 정도·온도·젖산 수준·회복 정도·체온·긴급도·SpO2·혈압 회복·발열 정도·오한 강도·태동량·시급성·신기능 추이·젖산 추이·호흡 노력). 수액반응성 `[came up a little, came up a lot, back to normal]`과 젖산 해석 `[getting worse, improving, back to normal]`은 '정도 둘 + 끝점 하나' 구조로 같은데, 회복 정도의 축으로 둘 다 성립한다고 본다. 축은 맞지만 **낱말 품사가 틀 문장에 안 맞는 것 2건**(노인 `a fever`, 요로 `soon`)은 아래 고칠 것.

**3. "The mottling of your skin means your circulation is struggling."** — `mottling`은 임상어가 맞고, 환자에게 단독으로 쓰기엔 부적절하다. 이 문장은 **'젖산 지속상승 위기'의 keyPhrases[1]이라 V4로 못 바꾼다.** 문제는 같은 상황의 context 문항이 환자에게 한 "You have mottling to bilateral knees…"를 ok:false로 두고 "Your skin is getting blotchy and cold"로 고치게 가르친다는 것 — 학습자가 keyPhrase 문장과 뉘앙스 해설을 나란히 보면 어긋난다. 고칠 길: (a) 파일 안에서는 context `why`에 한 줄 보태 "mottling이라는 말을 환자에게 쓰더라도 keyPhrase처럼 바로 '순환이 힘겹다'고 풀어 주면 된다 — 틀린 건 범위·초 수치를 환자에게 그대로 말한 것"으로 모순을 풀고, (b) w-mottle의 example을 환자 말투에서 의료진 보고 말투로 바꿔 단어 카드가 임상어 자리를 보여 주게 하며(헤드워드 변경 규칙 안에서 example 조정 가능), (c) keyPhrase 자체가 그 상황의 뉘앙스 교육과 충돌한다는 점은 상류(keyPhrase 저작)로 보고.

**4. 헤드워드 9건·w-runfever** — 모두 결정 11 안. 형용사→부사 5건(closely·thoroughly·continuously·urgently·immediately: 태그 문장이 전부 부사형 — 확인), 구 헤드워드 2건(short of breath: 태그 문장 셋 다 그 구 ✓ / come up: 공통 쉬운 말 come을 구 단위로 둔 것 — BRIEF의 `take the edge off` 예외 ✓), 어형 2건(confused·mottling: 동사 헤드워드인데 태그 문장·예문이 전부 형용사/명사 — '헤드워드를 제 모습으로'의 취지, 틀린 ko 교정 포함). 형제 선례: closely(er-chest-abd-trauma), thoroughly(er-bleeding-wound), short of breath(er-gi-bleed·er-ortho-trauma, ko도 '숨이 찬' 동일), confused(er-environmental·er-ortho-trauma, ko '혼란스러운'), 구 헤드워드(er-chestpain `heart rate`, er-poisoning `crash cart`). urgently·continuously·immediately는 형제 선례가 없으나 이 주제 문장이 전부 부사라 규칙대로다. **w-runfever**: w-run의 ko '(열이) 나다'가 태그 4문장 중 1개에만 맞았고 나머지 셋은 run the pressor — w-run을 '(약물을) 주입하다'로 고치고 run a fever를 따로 세운 것은 맞다(관용구로 가르칠 값 있음, 문장에 이미 있음, v45 필드 7개 완비, tag '증상 문진' 일관). BRIEF가 word-add의 계기로 적은 것은 V3 부족이지만 '틀린 ko 교정'의 결과로 생긴 추가라 범위 안으로 본다.

**5. 반복된 ko 오역 두 가지** — **없음.** "Stay with me"와 "keep … down"은 이 주제의 문장·뉘앙스·예문 어디에도 없다(grep). `곁에`는 전부 "at bedside = 침상 곁에"(맞는 번역)이고, `삼키다`는 w-breathe의 distractorKo일 뿐이다.

## 고칠 것 (v45 필드)

1. **w-race · distractorsEn** · `pound`는 정답으로도 맞다 — cue가 '쿵쿵 뛴다'라 "my heart is pounding"이 오히려 더 맞는 영어 · `pound`→`pace`로 바꾸고 cue를 "환자가 '심장이 너무 빨리 뛴다'고 할 때 쓰는 동사 — 'my heart is ___ing'"로.
2. **w-step · distractorsEn** · `stage`는 "each stage"로 성립하고 ko '단계'도 stage로 번역된다 · `stage`→`strip`(또는 `steep`).
3. **w-burn · distractorsEn/cue** · `sting`은 배뇨통 묘사로 "stinging when you urinate"가 성립하고 cue에도 '따갑고'가 있다 · `sting`→`bump`, cue를 "소변볼 때 뜨겁고 화한 느낌"으로.
4. **w-level · distractorsKo** · `단계`는 level의 다른 뜻(수준·단계)이라 정답이 둘 · `단계`→`비율`.
5. **w-little · cue** · "비교하면 'less than usual'"이 태그 문장의 실제 어형 `less`를 노출 · "양이 모자랄 때 — 평소보다 덜(비교급으로 쓴다)".
6. **노인 비전형 패혈증 · slider** · scale `[low, normal, a fever]`에서 `a fever`만 명사구라 틀 문장 "His temperature is ___"에 안 들어간다 · `a fever`→`high`; why의 발열 설명은 그대로.
7. **요로성 패혈증 · slider** · `[routine, soon, urgent]`의 `soon`은 부사라 "draining the kidney is ___"에 안 맞는다 · 미국 병원 일정 삼분법 `[routine, urgent, emergent]`, answerAt 2, example "With a blockage and an infection, draining the kidney is emergent.", exKo "막힘에 감염까지 있으면 신장 배액은 응급이에요."; why는 '긴급'을 쓰지 않도록 "…막힌 곳을 빼내는 감압이 필요한 응급이에요"로(새 축에서 urgent는 오답이라 why의 '긴급 감압'이 헷갈린다).
8. **젖산 지속상승 위기 · context why** · keyPhrase가 환자에게 `mottling`을 쓰는데 이 문항은 그 말을 환자에게 쓴 장면을 틀렸다고 가르쳐 어긋남 · why 끝에 한 문장: "mottling이라는 말을 쓰더라도 '순환이 힘겹다'고 바로 풀어 주면 되고, 환자에게 틀린 건 '무릎까지·5초' 같은 범위와 수치를 그대로 말한 것이에요."
9. **w-mottle · example/exKo** · 단어 카드 예문이 환자 말투라 임상어 자리를 못 보여 준다(위 8과 짝) · example "There's mottling up to her knees — I need you at bedside.", exKo "무릎까지 피부가 얼룩덜룩해요 — 침상으로 와 주세요." (헤드워드 변경 건이라 changes에 example 추가 기록).
10. **w-antibiotic · cue** · "패혈증 인지 후 1시간 안에 들어가야 한다"는 SSC 2021 범위보다 넓다(1시간은 쇼크·고가능성, 가능 패혈증은 3시간) · "세균 감염에 쓰는 약 — 패혈성 쇼크면 인지 후 1시간 안에, 그 밖에도 되도록 빨리 들어가야 한다".
11. **폐렴성 패혈증 · slider why** · SpO2 89%(4 L)에 "아직 위험할 만큼은 아니에요"는 환자 말투(a little low)의 근거로는 맞지만 간호사 행동을 가볍게 들리게 한다 · "환자에게는 'a little low'로 말하되, 간호사는 산소를 올리고 보고해요. 계속 떨어지거나 호흡이 힘들어지면 바로 알려요."
12. **w-level · exKo** · ko를 '농도'로 바꿨는데 exKo는 '젖산 수치' · 아래 결정 11-③을 따르면 자연히 맞춰진다(수치로 되돌리는 쪽 권고).

참고(고치지 않아도 됨): ICU 이송 pair가 소변량 상황 pair와 `urine output` 짝을 되풀이한다 — 틀린 건 아니다. w-ready `[read, y]`, w-enough `[e, nough]`는 형태소 분할이 아니지만 짧은 낱말이라 둔다.

## 고칠 것 (결정 11 · v44 필드)

① **w-confuse · ko** · 형제 2개 주제가 `혼란스러운` · `혼란스러워하는`→`혼란스러운`(changes-er-sepsis.yaml 기록은 이미 있음).
② **w-place · ko** · `거치하다`는 "place the tube"에 안 맞는 말이고 형제 4개 주제가 `삽입하다` · `삽입하다`로. changes에 `{kind: word, id: w-place, fields: [ko]}` 추가.
③ **w-level · ko** · `농도`는 형제 18개 주제(`수치`)와 어긋나고 "oxygen level"(포화도)에도 어색 · w-level을 `수치`로 되돌리고 대신 **w-number ko를 `숫자`로**(태그 문장 "kidney numbers", "the higher the number" 모두 환자용 쉬운 말; 형제 er-burn·er-peds도 `숫자`). 그러면 w-level/w-number/w-rate 셋의 ko 충돌이 풀린다. changes의 w-level 항목을 w-number 항목으로 교체.
④ **w-crash · ko** · `응급의`는 crash의 뜻이 아니다(crash cart의 수식어) · 1차 권고: ko만 `(crash cart의) 응급`으로 바꾸고 cue는 그대로. changes에 `{kind: word, id: w-crash, fields: [ko]}`. 대안(더 크게 가려면): 형제 er-poisoning처럼 en `crash cart` / ko `응급 카트`(ipa `/ˈkræʃ kɑːrt/`, chips `[[crash], [cart]]`, decoy `[crush, card]`, distractorsEn `[cash cart, crash card]` — `code cart`는 실제 동의어라 쓰지 말 것) — 이때는 w-cart가 중복이라 은행에서 지우고 심정지 전조 #1 words에서 빼야 하며, **같은 상황 pair words `[w-crash, w-cart, …]`와 swap words `[w-get, w-crash, w-cart]`에서도 w-cart를 빼야 V15를 통과한다**(pair의 `[crash, cart]` 짝 자체는 그대로 둬도 된다). 그 상황 서로 다른 단어 25개라 V3 여유.
⑤ **w-get · example/exKo** · ko '(그 상태가) 되다'인데 예문은 "Your organs are getting enough blood"(받다) · example "Her kidney numbers are getting worse.", exKo "신장 수치가 나빠지고 있어요." changes에 `{kind: word, id: w-get, fields: [example]}`.
⑥ (선택) **정맥로 s4 · 수액반응성 s2·s5 · words** · "short of breath"가 구 헤드워드가 되면서 같은 자리에 w-breathe(숨쉬다, 동사)도 태그돼 명사 breath를 동사로 가르친다 · 세 문장에서 w-breathe 태그만 빼기(두 상황 모두 V3 여유). 같은 이유로 노인 s3의 w-fever(run a fever와 중복)는 둬도 무방.

저작자의 변경 목록 중 **과하거나 틀린 것은 없다.** 쉬운 단어 16개 제거는 공통 목록(now·minute·hour·body·hand·doctor·baby·bad·good·know·go·see)과 그에 준하는 말(have·do·thing·four)뿐이고, 태그를 뺀 문장 55건 모두 문장은 그대로다. 유일한 ko 문장 수정("노르에피네프린 8로 투여 중이고")도 맞다.

## 종합

사실 오류 없음, 설계 결함은 작은 것 12건 + 결정 11 정리 5~6건. 위 목록을 반영하고 검사기를 다시 통과하면 **내보내도 된다.** mottling keyPhrase와 뉘앙스의 충돌은 파일 안에서 8·9로 봉합하되, keyPhrase 저작 쪽에도 전달할 것.
