# er-stroke 검토 — 전수 (단어 144, 상황 23, 뉘앙스 문항 전부)

대상: `er-stroke.yaml` · `changes-er-stroke.yaml` · `base-er-stroke.yaml` · `in-er-stroke.json` (모두 `wip/er-v45b-sonnet/`)

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 대부분 철자·소리·분야가 닮은 좋은 오답(meditation/mediation, aspirin/inspiration, flutter/palpitation). 정답으로 맞는 오답은 없음. 품사가 다른 오답이 9개 |
| 2 | distractorsKo | 4 | 대체로 같은 분야의 그럴듯한 뜻. w-numb의 `저린`은 numb의 흔한 우리말 풀이라 정답이 둘이 될 수 있음. w-sip의 `한 입`은 경계선 |
| 3 | cue | 4 | 정답·파생형 노출 없음, 장면이 잘 떠오름. 다만 w-sugar(주스: 안전 문제), w-level(사실 오류), w-call(방향이 모호함) |
| 4 | chips/decoyChips | 4 | 형태소 분할이 대체로 좋음. w-check `[ch, eck]`는 뜻 없는 분할. interpreter·understand·slurred는 더 나은 경계가 있음 |
| 5 | 뉘앙스 사실 정확성 | 3 | 핵심 수치(185/110, INR 1.7, LKW, tPA 중단+CT, AVPU, irregularly irregular, INR 2–3)는 정확함. 다만 동의 업무 범위, 210/118을 "high"로만 본 것과 지어낸 기준, CT가 혈전을 가려낸다는 주장, w-level을 "농도"로 한 것, 주스, life support 해설은 틀림 |
| 6 | 뉘앙스 설계 | 3 | pair는 모든 조합에서 정답이 하나뿐임. 그러나 어지럼 slider가 강도가 아니라 종류임, SBAR context가 같은 뜻이 아님, reel의 swap 카드가 바꿔 말한 것이 아님, swap 하나는 비문(hypoglycemic), exactly slider의 roughly≈about |
| 7 | v44 정리(결정 11) | 4 | 변경은 대체로 규칙에 맞고 필요함(아래 5번 판정). w-level 농도는 틀린 방향. w-speech·w-strain의 ko, w-intubation의 영국식 ipa, 젊은 환자 1번 문장의 ko는 놓침 |

---

## 저작자 보고 판정

### 1. keyPhrase 업무 범위 — **저작자 지적이 맞습니다(문제 있음)**
미국에서 혈전제거술의 설명동의(informed consent: 위험·이득·대안 설명과 동의 획득)는 **시술 의사의 책임**입니다. 간호사는 의사가 설명한 뒤 **서명에 입회**(witness)하고, 보호자가 이해했는지 확인하며, 질문이 남아 있으면 의사를 다시 부릅니다. 환자에게 의사결정능력이 없고 대리인도 곧바로 연락되지 않으면 응급 예외(emergency exception)로 진행하므로, 동의 때문에 시술을 늦추지도 않습니다. 문제는 keyPhrase 하나보다 넓습니다.
- (a) 장면 goal 2 "가족에게 시술을 설명하고 동의를 얻는다" — 간호사가 동의를 받는 장면으로 설계됨
- (b) context 문항이 "I need your consent so we don't lose time."을 가족에게 하는 말로 `ok: true` 처리함 → 업무 범위 밖의 말을 정답으로 가르침
- (c) 같은 계열: 문장 6 "Please sign here so we can move quickly."(의사 설명 뒤 입회라면 가능), 전형 좌MCA 문장 6 "I'm going to explain the risks of this medication now."(tPA 위험 설명도 의사 몫)
- 저작자 자신의 slider why("구체적인 비율은 시술 의사가 설명해요")가 이미 역할을 인정하고 있어, 문항끼리 서로 어긋납니다.

### 2. 사실 확인
| 주장 | 판정 |
|---|---|
| tPA 전 혈압 185/110 미만 (AHA/ASA 2019) | **맞음.** 투여 중·후 24시간은 180/105 이하 유지 |
| 와파린 INR > 1.7이면 금기 | **맞음** (PT > 15초도 같은 기준) |
| 기상 시 발견 뇌졸중의 LKW = 잠들기 전, 또는 밤중에 깼을 때 정상이 확인된 시각 | **맞음** (slider why·context why 모두 정확) |
| symptom onset과 LKW 구분, onset 불명이면 LKW로 시간창 계산 | **맞음.** 목격된 발현이면 LKW = 발현 시각 |
| tPA 중 두통·구토·악화 시 투여 중단과 응급 CT | **맞음** (AHA: discontinue infusion, emergent head CT) |
| 혈압 급상승 slider: 210/118 = `high`, "dangerously high는 출혈성 뇌졸중 등에" | **틀림.** 210/118은 고혈압 응급 범위입니다. "dangerously high는 출혈성 뇌졸중 등에 쓴다"는 실제 관행이 아니라 지어낸 구분입니다. 학습자가 "210/118은 위험하지 않다"고 받아들일 수 있습니다 |
| INR 2.4 = 심방세동 와파린의 치료 범위(2.0–3.0) | 맞음 |
| AVPU, "irregularly irregular", 박리에서 목 통증이 먼저 옴, 악성 부종 징후, regurgitating과 vomiting의 차이, 가족 통역을 피함 | 모두 맞음 |
| 좌MCA: right arm drift + aphasia + **left** gaze preference | 맞음 (병변 쪽으로 주시) |
| CT swap why "CT가 출혈과 혈전을 가려낸다는 사실" | **과장.** 비조영 CT는 출혈 배제가 주목적이고, 초기 허혈이나 혈전은 잘 보이지 않습니다(혈전은 CTA로 확인). keyPhrase는 환자용 단순화라 두더라도, why가 "사실"이라고 단정하면 안 됩니다 |
| w-level ko 농도, cue "약이 혈액 속에 얼마나 들어 있는지" | **틀림.** 와파린은 혈중 약물 농도가 아니라 INR(응고 효과)로 감시합니다 |
| 즉시 혈당 문장 6 "We'll give you some juice…"와 w-sugar cue "낮으면 주스로 올려 주는" | **환자 안전 문제.** 뇌졸중 의심 환자는 삼킴 선별 전까지 금식입니다(같은 주제 상황 4가 바로 그것). 응급실 stroke code의 저혈당은 IV dextrose(D50)가 기본입니다 |
| 뇌간 swap notes "life support는 실제보다 무거운 인상" | **사실로는 틀림.** 삽관과 인공호흡은 실제로 life support입니다. "틀린 말은 아니지만 연명치료 결정처럼 들려 가족이 더 무겁게 받아들인다"로 어조 문제로 고쳐야 합니다 |
| 삼킴 slider why "기침이나 사레가 나오면 바로 중단" | 맞음. 다만 삼킨 뒤 목을 가다듬거나 목소리가 젖는 것(wet voice)도 실패 신호인데, 척도 맨 아래에 두어 괜찮은 것처럼 읽힐 수 있습니다(경미) |

### 3. w-stay — **reel은 타당, 헤드워드 카드는 헷갈림**
- 태그 4문장: TIA "Please stay so we can find the cause."(머무르다, 맞음), 출혈성 0·6과 뇌간 0 "Stay with me…"(정신 놓지 마세요). 저작자 말대로 1/4만 맞습니다.
- reel(출혈성)은 "stay with me / stay(남다) / stay with him(곁에 있다)"의 다의를 보여 주므로 **설계로서 타당**합니다.
- 그러나 STEP 1 카드는 `머무르다`이고, 이 카드가 세 "Stay with me" 문장에 연결됩니다. 저작자가 문장 ko에서 바로잡은 오역("함께 있어 주세요")을 카드가 다시 심는 셈입니다. cue("곁에서 의식을 놓지 말라고 독려할 때")로는 부족합니다. → **헷갈립니다.**
- BRIEF 규칙("구의 일부로 가르칠 값이 있으면 구 단위로 둡니다")에 따라 **구 헤드워드 `stay with me`로 나누는 것이 맞습니다**(고칠 것 참조). 이때 V15를 지키려면 reel을 옮겨야 합니다.
- reel의 swap 카드("Look at me. I'm right here, and we're on it." / 공황 상태인 보호자에게)는 앞 카드들의 "stay"를 그 청자에 맞게 바꿔 말한 것이 아니라 다른 메시지입니다.

### 4. w-thinner / w-level / w-call
- **w-thinner → blood thinner: 찬성.** 태그된 5문장이 모두 "blood thinner(s)"이고, `thinner` 단독은 페인트 희석제입니다. 같은 문장의 w-blood 태그를 뺀 것도 일관됩니다. (참고: 일상어 blood thinner는 항혈소판제까지 넓게 가리키지만, ko `항응고제`로 두어도 됩니다.)
- **w-level 수치 → 농도: 반대.** 사실 오류입니다(위 표). 게다가 상황 문장 ko는 여전히 "수치"라서 카드 exKo("혈중 농도")와도 어긋납니다. 겹침은 w-value 쪽에서 풀어야 합니다(value = 검사값/값, level = 수치).
- **w-call 부르다 → 연락하다: 찬성.** 태그된 문장은 SBAR "Please call me if his exam changes at all." 하나뿐입니다. 다만 cue의 방향이 모호합니다(고칠 것 참조).

### 5. 정리 분량 25/154(16%) — **결정 11 범위 안**
- 의무: 공통 쉬운 단어 목록의 삭제 9건(time·night·today·morning·minute·name·hand·head·see), 활용형 헤드워드 원형화 6건(hurt·miss·respond·alert·pass·teeth→tooth)
- 틀린 문장 고침: 후순환 3·4(간호사 문장에 섞인 환자 대사)와 그에 따른 w-spin·w-double의 example
- 판단: yes·no·eat 삭제(간호사가 이미 아는 말이라 타당), w-exactly·w-protect 추가(문장에 이미 있고 배울 값이 있음), thinner·call의 ko(타당), level(틀림)
- "1할"은 기준치이지 상한이 아닙니다. 초과분은 대부분 의무 삭제에서 나왔고, 재량 변경은 적고 정당합니다. 이번 검토가 더하는 항목(stay with me, ko 고침)도 정확성을 바로잡는 것이지 불필요한 손질이 아닙니다.

### 6. pair 전 조합 / V3
- pair 7건(FAST·혈당·CT·후순환·실어증·언어장벽·SBAR)의 왼쪽×오른쪽×decoy를 전부 읽었습니다. **모두 정답이 하나로만 맞습니다.** 걸리는 조합은 언어장벽의 "nod … to the clock" 하나인데, 이것도 맞는 영어로 보기 어렵습니다.
- 실제 고유 단어 수: **출혈성 9, 침상 삼킴 14, 실어증 환자 소통 8(하한)**, 마지막 정상 시각 9, 두부 CT 9. 하한에 걸린 것은 침상이 아니라 실어증입니다. 아래 제안은 어느 상황에서도 태그를 줄이지 않습니다(stay with me 분리는 1:1 교체).

---

## 사실 오류·심각한 문제

1. **[업무 범위] 대혈관 폐색 혈전제거술 이송 — keyPhrase "I need your consent so we don't lose time."** 간호사가 설명동의를 받는 말입니다. 설명동의는 시술 의사의 몫이고 간호사는 서명에 입회합니다. keyPhrase 영어는 이번에 못 고치므로 **다음 수정 때 바꿀 것**으로 남깁니다. 제안: `"The doctor needs your consent so we don't lose time."` 또는 `"The doctor will explain the procedure, and then we'll need your signature."` 지금 고칠 수 있는 것은 context ok 장면, goal, why입니다(고칠 것 1·2).
2. **[환자 안전] 즉시 혈당·활력 측정 — 문장 6 "We'll give you some juice to bring your sugar up."과 w-sugar cue.** 삼킴 선별 전의 뇌졸중 의심 환자에게 경구 섭취를 안내합니다. 같은 주제의 침상 삼킴 선별과도 모순됩니다.
3. **[사실] w-level 농도와 cue.** 와파린 감시는 INR(효과)이지 혈중 농도가 아닙니다.
4. **[사실/안전] 혈압 급상승 slider.** 210/118을 `high`로, `dangerously high`는 "출혈성 뇌졸중 등"에만 쓴다고 지어낸 기준입니다.
5. **[사실] 두부 CT swap why.** 비조영 CT가 "출혈과 혈전을 가려낸다"는 단정은 과장입니다.
6. **[사실] 뇌간 swap notes `life support`.** "실제보다 무겁다"가 아니라 실제로 life support입니다.

## 고칠 것 (v45 필드)

1. 대혈관 폐색 · context · 장면 1(가족에게, ok) "I need your consent so we don't lose time." 간호사 업무 범위 밖의 말을 정답으로 가르칩니다. → en을 `"The doctor will explain everything, then we'll need your signature."`로. why 끝에 "설명동의는 시술 의사가 받고, 간호사는 서명에 입회하며 보호자가 이해했는지 확인해요."를 더합니다.
2. 대혈관 폐색 · 장면 goal 2(`in-er-stroke.json`, 원천 데이터) "가족에게 시술을 설명하고 동의를 얻는다." → "의사의 시술 설명과 동의 과정을 돕고 서명에 입회한다"로(원천 수정 담당에게 넘김).
3. 혈압 급상승 · slider · cue `BP 210/118` 위험 수치를 `high`로 가르치고 근거를 지어냈습니다. → cue를 `"BP 192/104. Clot-busting medicine can't start until it's below 185/110."`(answerAt 1 high 유지)로. why는 "기준을 넘었으니 'a little high'로 줄여 말하지 않아요. 230/130처럼 훨씬 높고 즉각 위험하면 'dangerously high'예요."로 바꾸고 "출혈성 뇌졸중 등"은 지웁니다.
4. 두부 CT · swap · why "CT가 출혈과 혈전을 가려낸다는 사실은 그대로" → "CT의 첫 목적은 뇌출혈이 있는지 확인하는 것이에요. 무엇을 찾는지는 환자가 아는 쉬운 말로 전해요."
5. 뇌간 경색 · swap · notes `life support` → "틀린 말은 아니지만 연명치료 결정처럼 들려, 가족이 지금 상황보다 무겁게 받아들일 수 있어요."
6. 즉시 혈당 · swap · before `"Your blood sugar is ", "hypoglycemic", " right now."` "blood sugar is hypoglycemic"은 비문입니다(저혈당인 것은 환자). → 바꿀 말과 옵션을 `in the hypoglycemic range`로 바꿉니다(옵션 `[a little low, in the hypoglycemic range, critical]`, notes 키도 함께).
7. 후순환 · slider(lightheaded / off balance / spinning) 강도가 아니라 어지럼의 **종류**입니다(why도 "구분해야"라고 함). slider 순서가 성립하지 않습니다. → 이 slider를 지웁니다. pair가 있어 V14 STEP 1은 유지됩니다. 종류 구분 내용을 살리려면 why를 pair의 why 끝에 한 줄로 옮깁니다.
8. 뇌졸중 SBAR · context · 장면 2 "Call me if his exam changes at all." 요청이라 다른 두 장면(악화 보고)과 같은 뜻이 아닙니다. → `{who: 인계받는 간호사에게, icon: bell, en: "He's getting worse: NIHSS went from 12 to 15. Watch him closely.", ok: true}`. words는 `[w-deterioration, w-watch]`(둘 다 이 상황 문장에 있음)로 바꿉니다.
9. 출혈성 · reel · swap 카드("Look at me. I'm right here…" / 공황 상태인 보호자) 앞 카드의 stay를 바꿔 말한 것이 아닙니다. → `{who: "영어가 서툰 환자에게는…", en: "Open your eyes. Look at me.", ko: "눈 뜨세요. 저를 보세요.", tone: 또렷함, swap: true}`. 관용구 "stay with me" 대신 구체적인 지시로 바꾸는 카드입니다. (reel을 옮기는 것은 결정 11의 2번 참조)
10. w-sugar · cue "손끝 채혈로 재고, 낮으면 주스로 올려 주는 수치" → "손끝 채혈로 바로 재는 수치. 낮으면 뇌졸중처럼 보일 수 있어 먼저 확인한다".
11. w-level · cue·exKo 사실 오류 → cue "와파린 복용자가 정기 혈액검사로 확인하는 INR 같은 검사 결과의 높낮이", exKo "와파린은 수치를 확인하기 위해 정기적인 혈액검사가 필요해요." (ko는 결정 11의 1번)
12. w-call · cue "상태가 바뀌면 인계받은 쪽에 전화로 알려 달라고 할 때" 누가 누구에게 거는지 모호합니다. → "인계를 마치며, 상태가 바뀌면 나에게 전화해 달라고 당부할 때".
13. w-numb · distractorsKo `저린` numb의 흔한 우리말 풀이라 정답이 둘이 됩니다. → `화끈거리는`으로(`[화끈거리는, 뻣뻣한]`).
14. w-sip · distractorsKo `한 입` "물 한 입"이 sip과 겹칠 수 있습니다. → `[한 컵, 한 병]`.
15. distractorsEn 품사 불일치 → 바꿔 넣는 말: w-recent `resent`→`frequent` · w-quick `quite`→`slick` · w-follow `fellow`→`swallow` · w-worse `worry`→`worst`(decoyChips는 `worth`로) · w-wake `weak`→`wave` · w-double `[doubt, trouble]`→`[single, triple]` · w-point `pint`→`print` · w-hear `here`→`heed` · w-heart `hear`→`hearth`(decoyChips는 `hear`로).
16. w-check · chips `[[ch, eck]]` 뜻 없는 분할 → `[[check]]`. (선택) w-interpreter `[[inter, pret, er]]` · w-understand `[[under, stand]]` · w-slurred `[[slurr, ed]]`.
17. 1번 정상 시각 · slider `[roughly, about, exactly]` roughly와 about은 같은 강도입니다. → `[sometime, around, exactly]`.
18. tPA 금기 · context · 장면 2 "On apixaban, last dose this morning…" 결과 보고라 장면 1(묻는 이유 설명)과 뜻이 조금 어긋납니다(경미). → `"I'm screening him for bleeding risks before tPA."`.
19. 침상 삼킴 · slider · why 끝에 "목을 가다듬거나 목소리가 젖어도(wet voice) 흡인 신호일 수 있어 보고해요."를 더합니다.
20. (경미) 대혈관 폐색 slider와 젊은 환자 slider의 example이 문항 뜻과 다른 문장입니다(`at risk`, `sudden strain`). 가능하면 뜻이 맞는 상황 문장으로 바꿉니다.

## 고칠 것 (결정 11 — v44 단어·문장, changes에 적을 것)

1. w-level · ko `농도` → `수치`로 되돌립니다. 겹침은 w-value 쪽에서 풉니다: w-value ko `수치` → `검사값`.
2. **w-stay 분리** · 출혈성 0·6, 뇌간 0의 "Stay with me"는 관용구라 `머무르다` 카드가 오역을 가르칩니다. → word-add `w-stay-with-me` (en `stay with me`, ko `정신 놓지 마세요`, tag 소통·지시, v45 필드 7개 전부. cue 예: "의식이 흐려지는 환자에게 계속 말을 걸며 깨어 있게 할 때"). 세 문장의 words에서 `w-stay`를 `w-stay-with-me`로 1:1 교체합니다(V3: 출혈성 9 유지, 뇌간 10 유지). w-stay는 TIA 문장에만 남깁니다(cue는 "퇴원하려는 환자에게 병원에 남아 달라고 할 때"로). **V15:** 출혈성 reel의 `words: [w-stay]`가 깨지므로, reel을 TIA 증상 소실의 nuance로 옮기고 words는 `[w-stay]`로 둡니다(TIA에는 reel이 없음). 출혈성은 slider와 swap이 남아 V14를 지킵니다. 각 문항의 words에 있는 w-stay도 바꿉니다(TIA context는 그대로).
3. 즉시 혈당 · 문장 6 "We'll give you some juice to bring your sugar up." 안전 문제(사실 오류 2) → `"We'll give you sugar through your IV to bring it up."` (ko "혈당을 올리기 위해 정맥으로 당을 드릴게요.", chunks `["We'll give you", "sugar", "through your IV", "to bring it up", "."]`, words `[w-sugar]` 유지)
4. w-speech · ko `말투` → `말(발음)`. "Your speech sounds slurred"의 speech는 말투(어조·말버릇)가 아니라 발화·발음입니다.
5. w-strain · ko `긴장` → `무리한 힘(염좌)`. 문장 젊은 환자 0의 ko "갑작스러운 긴장" → "갑자기 무리하게 힘을 준 일". exKo도 함께 고칩니다.
6. w-intubation · ipa `/ˌɪntjuˈbeɪʃən/`(영국식) → `/ˌɪntuˈbeɪʃən/`.
7. 젊은 환자 경동맥 박리 · 문장 1(keyPhrase라 ko만) "목 통증이 무감각보다 언제 먼저 시작됐나요?"는 부자연스럽습니다. → "목 통증은 무감각보다 먼저 시작됐나요, 나중에 시작됐나요?"
8. (경미) 출혈성 · 문장 2(keyPhrase라 ko만) "…높아요; 지금…"의 한국어 세미콜론 → 마침표.
9. (경미) 악성 부종 · 문장 5 ko "압력이 오른다는" → "뇌압이 오른다는".

참고(확실하지 않아 고칠 것에는 넣지 않음): SBAR 문장 5 "Repeat CT is scheduled in one hour"는 tPA 뒤 통상 24시간 추적 영상과 맞지 않지만, 다른 사유가 있을 수 있어 틀렸다고 단정하지 않습니다. 몸 부위(arm·eye·face·nose·mouth·finger·heart)와 phone·person·dinner는 쉬운 말이지만, 공통 목록 밖이라 주제끼리 기준을 맞출 일로 남깁니다.

## 종합
핵심 임상 수치와 기준은 정확하고, pair는 모든 조합에서 정답이 하나뿐이며, 오답 질도 좋습니다. 위 목록(특히 사실 오류 2~6, 그리고 SBAR context·후순환 slider·w-stay 분리)을 고치면 **내보내도 됩니다**. 동의 keyPhrase 영어는 다음 수정 때로 미루되, 그 전까지 context 정답 장면과 goal은 이번에 고쳐 둡니다.
