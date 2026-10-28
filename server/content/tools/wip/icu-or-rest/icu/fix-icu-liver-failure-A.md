# icu-liver-failure — A 검토 (v45 1~7 + 기계적 전수 확인 + context 핸드오프 모양·swap ko)

대상: `icu-liver-failure.yaml`(A·B 합친 파일, `icu-liver-failure.pre-fix.yaml`과 같음). 비교: base, changes(85건 — word 24·word-remove 21·sentence 40, 문장 변경은 전부 `words` 태그만), in-…json, notes-A·B.
단어 298개, 문장 126개(21상황), 뉘앙스 63문항(slider 21·context 21·swap 21, **pair 0·reel 0**)을 스크립트로 전부 뽑아 표로 놓고 판정했습니다
(`rev_icu-liver-failure_A.py`(words·ex·sent·nu·chg), `rev_icu-liver-failure_A_extra.py`(단어 쓰임 수·상황별 서로 다른 단어 수·decoyChips 전부·cue에 ko가 되풀이되는지·order 줄), `rev_icu-liver-failure_A_dup.py`(같은 ko·은행 단어와 겹치는 오답·바꿀 문장을 example로 쓰는 단어)).
**이 주제에는 pair 문항이 없습니다** — pair 전 조합 확인은 대상이 없어서 건너뛴 것이 아닙니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 철자·소리가 닮은 좋은 오답이 대부분. 정답으로도 맞는 오답 2개(hard↔harsh, nutrition↔nutrient), 두 오답 모두 품사가 다른 것 2개(check·left), 하나만 다른 것 18개 |
| 2 | distractorsKo·길이 | 4 | 길이 규칙 위반 0건, 같은 ko 쌍 0건(스크립트). 정답과 거의 같은 뜻 1개(grade↔분류하다), 사실이 틀린 오답 1개(NAC 오답 `ACE (혈압약)`) |
| 3 | cue | 4 | 정답 노출 없음. ko를 그대로 되풀이한 cue 6개(gut·physician·still·news·trip·test), dextrose를 "설탕 성분"으로 |
| 4 | chips/decoyChips | 4 | 형태소 분절은 좋음. 가벼운 비하어 `fool`(2곳)·`mad`(3곳). 술·장례 조각은 없음 |
| 5 | 뉘앙스·문장 사실 정확성 | 3 | INR만 보고 시술 전 혈장(7.3·7.0 KP·S7 context), 단백질을 암모니아로 조정(13.1 KP·13.4), 간호사가 수액백에 칼륨을 넣는 말(4.3), NAC 알레르기를 검사로 본다(11.4), 진정 slider가 RASS와 어긋남, EMTALA 오용, 알부민 동의 |
| 6 | 뉘앙스 설계 | 3 | slider 정답 둘 3문항(level·low·response), 순서 1문항, swap 문법 3문항(defecation·hypokalemic status·tamponade the site at the site)과 정답 둘 1문항, context 어색함이 듣는 사람 때문이 아닌 것 3문항(dose·trigger·support) |
| 7 | 결정 11(v44 단어·문장) | 4 | 쉬운 말 21개 삭제·구 헤드워드 5개는 타당. `transport` '운송'은 틀린 ko, `vital` 헤드워드가 문장(vitals)과 다름, `clear` 쓰임이 아직 셋으로 갈림 |

## 저작자 A의 변경 판정 (단어 24개 수정·21개 삭제, 문장 40건은 태그만)

**결정 11 수정 폭은 과하지 않습니다. 되돌릴 것은 없습니다.**
- 삭제 21개(공통 목록 12 + thing·make·use·lot·much·talk·whole·want·new)는 모두 간호사가 아는 말입니다. 삭제 뒤에도 모든 상황에서 서로 다른 단어 15개 이상(V3 8개 이상)입니다.
- 구 헤드워드(look for·follow up·based on·right away·rule out)는 문장 쓰임과 맞습니다. 같은 ko를 가른 것(level 농도↔number 수치, lab 검사 결과↔test 검사, gut 창자↔bowel 장, sugar 당 수치↔glucose 혈당, fall 줄어들다↔drop 급락하다, confirm↔check, reaction 이상 반응↔response 반응)도 근거가 있습니다. 스크립트로 보니 은행에 같은 ko가 남은 쌍은 0개입니다.
- **흠(고칠 것 W):** `transport` '운송'은 화물에 쓰는 말이라 환자 이송에 맞지 않음(W1). `vital`은 문장이 모두 `vitals`(W2). `shut`은 문장이 `shutting down`인데 구 헤드워드로 바꾼 다섯 개와 달리 그대로(W8, 선택).
- 남은 쉬운 말: `eye`·`arm`·`leg`·`neck`은 공통 목록의 `hand`·`head`·`body`와 같은 부류, `help`·`tell`도 간호사가 아는 말(W7, 선택). `hand`는 18.4 "more hands"(일손)라 구로 가르칠 값이 있어 둡니다.

## 저작자가 짚은 문장 판정

| 문장 | 판정 |
|---|---|
| 2.5 락툴로오스 용량 조정 (KP 아님) | **타당 — 고침(S1)**. 목표 배변 횟수에 맞춘 조정은 처방(또는 처방된 기준) 몫이고, 너무 묽으면 탈수·전해질 이상 때문에 알려야 합니다 |
| 4.0 KP 덱스트로스 | **유지 권고 — 사용자 결정 목록에 기록**. 저혈당 프로토콜(표준 처방)에 따라 간호사가 먼저 처치하는 것이 미국 병원의 일반적 관행. 원하면 "per protocol"을 붙임 |
| 4.3 칼륨을 다음 수액백에 (KP 아님) | **타당, 안전 — 고침(S2)**. 칼륨 보충은 처방이고, 병동에서 간호사가 진한 KCl을 수액백에 섞는 것은 ISMP·Joint Commission이 막아 둔 고위험 행위(미리 섞인 백 사용) |
| 7.3 INR 높아서 라인 전 혈장 (KP 아님) | **타당, 안전·관행 — 고침(S3)**. 간 질환에서는 INR이 출혈 위험을 잘 보여 주지 않아, INR만 보고 시술 전에 혈장을 주지 않는 것이 현재 권고(AGA 2021·AASLD 2024 지침). 혈장은 수혈 부작용(TACO 등)이 있고, 급성 간부전에서는 예후·이식 판단에 쓰는 INR을 가립니다 |
| 7.0 KP "correct with products" | **타당 — 사용자 결정(바꿈 권고)**. 7.3과 같은 문제 |
| 7.5 혈소판 수혈 (KP 아님) | **타당 — 고침(S4)**. 기준치와 시술에 따라 처방자가 정함 |
| 15.0 KP·15.4 고장성 식염수·CT | **15.4 타당 — 고침(S10)**("I need a repeat head CT"는 간호사가 CT를 정하는 말). **15.0은 사용자 결정(가볍게 바꿈 권고, "as ordered")** |
| 15.2 KP CO2 조절 | **유지 권고**. "Let's"는 팀에게 하는 제안이고, 환기 설정은 의사·호흡치료사가 바꿈(why에 그렇게 적으면 됨) |
| 14.4 진정제 감량 (KP 아님) | **부분 타당 — 고침(S9)**. 목표 RASS에 맞춘 진정 조절은 프로토콜 안에서 간호사가 하는 일이라 "per protocol"을 붙이면 됩니다 |
| 17.5 윤상연골 압박 (KP 아님) | **타당 — 고침(S11)**. 근거가 약해(2019 IRIS 시험 등) 일상적으로 하지 않는 곳이 많고, 하더라도 삽관하는 사람이 요청할 때 |
| 12.5 "won't wait to start treatment" (KP 아님) | **타당 — 고침(S7)**. 간호사가 치료 시작을 약속하는 말. 바로 보고하는 말로 |
| 13.1 KP 단백질을 암모니아로 조정 | **타당, 틀린 관행 — 사용자 결정(바꿈 권고)**. 간경변·간성뇌증에서 단백질을 제한하지 않고(EASL 2019·AASLD), 암모니아 수치는 식이 조절 지표가 아님 |
| 13.4 식후 혼란 시 암모니아 확인 (KP 아님) | **타당 — 고침(S8)**. 간성뇌증은 임상 진단이고 반복 암모니아는 관리 지표가 아니며(AASLD/EASL 2014), "식후에 혼란 → 단백질 탓"이라는 옛 관행을 되살림 |
| 11.5 NAC "the sooner, the better" | **유지**. 이 상황은 아세트아미노펜 중독이라 맞는 말 |
| 19.3 "status 1A, so the center wants him now" (KP 아님) | **타당 — 고침(S12)**. 1A는 가장 높은 긴급도일 뿐 장기 배정·즉시 수용을 뜻하지 않음 |
| ko "청소하지"(14.3)·"청소하기"(14.5) | **타당 — ko 고침(S16·S17)** |
| ko "맑게 배출"(2.0 KP)·"혼란을 맑게"(2.2 KP) | **타당 — ko 고침(K1·K2)** |
| ko 6.2 KP "그의 정신을 맑게" | **허용 — 선택(K7)**. en에 mind는 없지만 "help him clear"를 옮긴 자연스러운 의역. "그의"만 빼면 더 자연스러움 |
| w-clear·w-pressure·w-hard 쓰임 갈림 | **pressure·hard는 정리가 끝남**(pressure 3문장 모두 '압박', hard는 14.1 하나). **clear는 아직 셋으로 갈림** — 2.0(독소를 내보내다)·2.2(혼란을 걷어 내다)·6.2(맑아지다). 2.0·2.2 태그를 빼고 6.5 "his mind usually clears"에 태그(W3) |
| bring/get, quickly/fast/immediately | **유지**. 서로의 오답으로 쓰이지 않아(스크립트) 듣고 뜻 고르기에서 정답이 둘이 되지 않음. bring만 '챙겨 가다'로 더 가를 수 있음(W9, 선택) |
| 5.3 101.5도 | **타당 — ko 고침(S14)**. 한국 학습자는 섭씨로 읽음 |
| B 메모(distractorsKo 방식, 15.0·15.4) | distractorsKo 판단은 B 몫. 15.0·15.4는 위 판정 |

## 사실 오류·심각한 문제

1. **4.3 "Potassium is low too, so I'll add it to the next bag."** — 간호사가 처방 없이 칼륨 보충을 정하고, 수액백에 직접 섞는 말(진한 KCl 혼합은 ISMP·Joint Commission이 병동에서 막은 고위험 행위). 안전(S2).
2. **7.3 "His INR is high, so we'll give plasma before the line."**, KP 7.0, S7 context 장면 1 "before an invasive procedure" — INR만 보고 예방적 혈장을 주는 것을 규칙처럼 가르침. 현재 미국 권고와 반대(S3·N9·KP).
3. **11.4 "I'll watch his labs closely for any allergic reaction."** — NAC 아나필락시스양 반응(두드러기·쌕쌕거림·저혈압)은 검사가 아니라 환자를 보고 찾음. 학습자가 검사만 보면 반응을 놓침(안전, S6).
4. **13.1 KP·13.4** — 단백질을 암모니아 수치로 조정, 식후 혼란 때 암모니아 재검. 틀린 관행(S8·KP).
5. **S14 slider(w-response)** — cue "He opens his eyes and answers me when I say his name"은 RASS −1(drowsy: 부르면 깸)인데 정답이 alert, why도 "이름만 불러도 눈을 뜨고 대답하면 alert로 기록해요". 진정 조절 장면에서 깊이를 잘못 가르침(N14).
6. **S4 slider(w-low)** — 혈당 66(ADA 1단계 저혈당, 70 미만)을 `a bit low`로 가르치고 `low`도 맞음. 저혈당이 빨리 깊어지는 간부전 환자에게 가볍게 보이게 함(N5).
7. **S19 context 장면 3 "interfacility transfer under EMTALA"** — EMTALA는 응급실 환자의 안정화·이송 규정이고 입원 뒤에는 적용되지 않음(N17).
8. **15.4 "I'm pushing the saline now, and I need a repeat head CT."** — CT를 간호사가 정하는 말(S10). 17.5 윤상연골 압박을 일상 처치처럼(S11).

## 고칠 것

문장 en을 고치면 그 문장의 v46 필드(`why`·`decoy`·`distractorsKo` 둘·`blank`·`tag`·`icon`)를 새 문장에 맞춰 **새로 쓰고**,
그 문장을 `example`로 쓰는 단어의 `example`·`exKo`도 새 문장으로 바꿉니다. 문장 ko만 고친 경우도 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓰고
그 문장을 example로 쓰는 단어의 `exKo`를 바꿉니다. 바꾼 것은 전부 `changes-icu-liver-failure.yaml`에 적습니다.
(아래 "example 갱신"의 단어 목록은 `rev_icu-liver-failure_A_dup.py`로 뽑은 것입니다.)

### 문장 (KP 아님 — en·ko·chunks 고침)

- **S1 [업무 범위] 락툴로오스 투여·배변 관리 #5** · 용량 조정을 간호사 쪽이 정하는 말 →
  en `If the stools get too watery, we'll let the doctor know to adjust the dose.`
  ko `변이 너무 묽어지면 용량을 조정하도록 의사에게 알릴게요.`
  chunks `["If the stools", "get too watery", ", we'll let the doctor know", "to adjust the dose", "."]`
  words 그대로(`w-stool, w-watery, w-adjust, w-dose`). v46 새로(why: 너무 묽으면 탈수·전해질 이상 위험, 용량은 처방자가 정함). example 갱신: w-watery·w-adjust·w-dose.
- **S2 [안전] 저혈당·전해질 감시 #3** · 위 심각 1 →
  en `Potassium is low too, so I'll get an order to replace it.`
  ko `칼륨도 낮아서 보충 처방을 받을게요.`
  chunks `["Potassium is low too", ", so I'll get", "an order", "to replace it", "."]`
  words `[w-potassium, w-low]` — w-add·w-bag은 이 문장에서만 쓰여 word-remove(S4 상황은 서로 다른 단어 20개 남음). v46 새로(why: 칼륨 보충은 처방이고, 미리 섞인 백이나 약제부 조제로 줌. 정맥 칼륨은 고위험 약). example 갱신: w-potassium(w-add·w-bag 삭제).
  (add·bag을 남기려면 `Potassium is low too, so I'll get an order for a premixed bag.` — words `[w-potassium, w-low, w-bag]`.)
- **S3 [안전·관행] 응고장애·출혈 위험 관리 #3** · 위 심각 2 →
  en `His INR is high, so I'll ask whether the team wants plasma before the line.`
  ko `INR이 높아서 라인 전에 혈장이 필요한지 팀에 물어볼게요.`
  chunks `["His INR is high", ", so I'll ask", "whether the team wants plasma", "before the line", "."]`
  words `[w-inr, w-high, w-team, w-plasma, w-line]` — w-give 태그 뺌(다른 6문장이 씀). v46 새로(why: 간 질환에서는 INR만으로 출혈 위험을 알 수 없어 시술 전 혈장은 처방자가 정한다). example 갱신: w-inr·w-plasma·w-line.
- **S4 [업무 범위] 응고장애·출혈 위험 관리 #5** · 혈소판 수혈을 간호사 쪽이 정함, chunk "Platelets are / also low"가 구를 끊음 →
  en `Platelets are also low, so I'll ask whether to transfuse before the procedure.`
  ko `혈소판도 낮아서 시술 전에 수혈할지 물어볼게요.`
  chunks `["Platelets are also low", ", so I'll ask", "whether to transfuse", "before the procedure", "."]`
  words 그대로. v46 새로. example 갱신: w-platelet·w-transfuse.
- **S5 [명료] 뇌부종 위험 감시 #4** · "tight neck lines"는 목의 중심정맥관으로 읽히는 어색한 말(뜻은 목을 조이는 끈·고정대가 정맥 배액을 막지 않게) →
  en `We'll keep his head at thirty degrees and avoid anything tight around his neck.`
  ko `머리를 30도로 유지하고 목을 조이는 것은 피할게요.`
  chunks `["We'll keep", "his head", "at thirty degrees", "and avoid anything tight", "around his neck", "."]`
  words `[w-keep, w-degree, w-avoid, w-tight, w-neck]` — w-line 태그 뺌(4문장이 씀; W7로 w-neck을 지우면 그것도 뺌). v46 새로. example 갱신: w-degree·w-tight·w-neck.
- **S6 [사실·안전] 원인별 치료 #4** · 위 심각 3 →
  en `I'll watch him closely for any allergic reaction.`
  ko `알레르기 반응이 있는지 자세히 지켜볼게요.`
  chunks `["I'll watch him", "closely", "for any allergic reaction", "."]`
  words `[w-watch, w-closely, w-allergic, w-reaction]` — w-lab 태그 뺌(1.5·12.1이 씀). v46 새로(why: NAC 반응은 주입 초반에 두드러기·쌕쌕거림·저혈압으로 나타나니 환자를 직접 봄). example 갱신: w-allergic.
- **S7 [약속·업무 범위] 감염 예방·조기 치료 #5** · 치료 시작을 간호사가 약속 →
  en `If his fever climbs, I won't wait — I'll call the team right away.`
  ko `열이 오르면 기다리지 않고 바로 팀에 연락할게요.`
  chunks `["If his fever", "climbs", ", I won't wait", "— I'll call the team", "right away", "."]`
  words `[w-fever, w-climb, w-wait, w-call, w-team, w-away]` — w-start·w-treatment 태그 뺌(각각 4문장·11.2가 씀). v46 새로. example 갱신: w-climb·w-wait.
- **S8 [틀린 관행] 영양·단백 관리 #4** · 위 심각 4 →
  en `Small, frequent meals and a bedtime snack help protect your muscles.`
  ko `조금씩 자주 드시고 자기 전에 간식을 드시면 근육을 지키는 데 도움이 돼요.`
  chunks `["Small, frequent meals", "and a bedtime snack", "help protect", "your muscles", "."]`
  words `[w-meal, w-protect, w-muscle]`(EASL 2019 간질환 영양 지침의 늦은 저녁 간식). v46 새로. example 갱신: w-meal.
  (S13 swap `smaller meals more often`과 겹치는 것이 싫으면 `If the confusion gets worse, we'll look for a trigger right away.` — words `[w-confusion, w-look, w-trigger, w-away]`, w-meal은 word-remove.)
- **S9 [업무 범위] 약물 대사·용량 조정 #4** · 진정제 감량에 근거가 없음 →
  en `Let's lower the sedative dose per protocol and check his response.`
  ko `프로토콜에 따라 진정제 용량을 낮추고 반응을 확인합시다.`
  chunks `["Let's lower", "the sedative dose", "per protocol", "and check", "his response", "."]`
  words `[w-sedative, w-dose, w-protocol, w-check, w-response]`. v46 새로. example 갱신: w-response.
- **S10 [업무 범위] 급성 간부전 뇌부종 뇌탈출 위기 #4** · CT를 간호사가 정하는 말 →
  en `I'm pushing the ordered saline now — can we get a repeat head CT?`
  ko `처방된 식염수를 지금 투여하고 있어요, 머리 CT를 다시 찍을 수 있을까요?`
  chunks `["I'm pushing", "the ordered saline", "now", "— can we get", "a repeat head CT", "?"]`
  words `[w-push, w-saline, w-repeat, w-ct]` — w-need 태그 뺌(4문장이 씀). v46 새로. example 갱신: w-push·w-ct.
- **S11 [관행] 급성 의식저하 기도 위기 #5** · 윤상연골 압박을 일상 처치처럼 →
  en `If you want cricoid pressure, tell me before you pass the tube.`
  ko `윤상연골 압박이 필요하면 튜브를 넣기 전에 말씀해 주세요.`
  chunks `["If you want", "cricoid pressure", ", tell me", "before you pass", "the tube", "."]`
  words `[w-cricoid, w-pressure, w-tell, w-pass, w-tube]` — w-hold 태그 뺌(7.1·7.4가 씀). v46 새로(why: 근거가 약해 일상적으로 하지 않는 곳이 많고, 하면 삽관하는 사람이 요청할 때 병원 지침대로). example 갱신: w-cricoid·w-pass·w-tube.
- **S12 [사실] 응급 이식 조율 위기 #3** · 1A를 장기 배정·즉시 수용으로 →
  en `He meets status 1A criteria, so the center wants him transferred now.`
  ko `1A 기준에 해당해서 센터가 지금 바로 이송을 원해요.`
  chunks `["He meets", "status 1A criteria", ", so the center", "wants him transferred now", "."]`
  words `[w-center, w-transfer]` — w-list(10.3이 씀)·w-status(여기서는 '상태'가 아니라 '등급', W4) 태그 뺌. v46 새로. example 갱신 없음(w-center는 19.1).
- **S13 (선택) [사실] 원인별 치료 #3** · 아세트아미노펜 농도는 늦게 재면 낮게 나올 수 있어 "confirms"는 과함 →
  en `His acetaminophen level supports this as the cause.` chunks `["His acetaminophen level", "supports this", "as the cause", "."]`, ko `아세트아미노펜 농도가 이것이 원인이라는 걸 뒷받침해요.`
  words `[w-acetaminophen, w-level, w-cause]`(w-confirm은 11.1·19.4가 씀). N21과 함께.

### 문장 ko·chunks만 (KP 아님)

- **S14 감염 징후 감시 #3** · ko `한 시간 전에 체온이 화씨 101.5도(약 38.6도)까지 치솟았어요.` distractorsKo 둘 새 ko에, w-temperature·w-spike exKo 갱신.
- **S15 간성뇌증 단계별 관리 #4** · "약 용량을 놓친 것"은 "a missed dose"(약을 거름)와 다름 → ko `감염, 출혈, 혹은 약을 한 번 거른 것이 이걸 일으킬 수 있어요.` distractorsKo 둘 새 ko에.
- **S16 약물 대사·용량 조정 #3** · ko `간이 예전처럼 이 약들을 잘 처리하지 못해요.` distractorsKo 둘 새 ko에.
- **S17 약물 대사·용량 조정 #5** · ko `몸에서 잘 빠져나가지 않는 약은 간격을 두고 줄게요.` distractorsKo 둘 새 ko에, w-space exKo 갱신.
- **S18 다장기부전 진행 위기 #3** · ko "혈압이 기능을 멈추고"는 어색, chunk "and pressure are / all failing"이 주어와 동사를 끊음 →
  ko `신장, 폐, 혈압이 한꺼번에 무너지고 있어요.` chunks `["His kidneys", ", lungs", ", and pressure", "are all failing", "at once", "."]`. distractorsKo 둘 새 ko에, w-lung·w-fail exKo 갱신.
- **S19 응급 이식 조율 위기 #4** · ko "받아들이는 팀"은 번역투, chunk "the transport / time"이 복합명사를 끊음 →
  ko `인수할 팀과 이송 시간을 확인할게요.` chunks `["I'll confirm", "the accepting team", "and the transport time", "."]`. distractorsKo 둘 새 ko에, w-accept·w-transport exKo 갱신.
- **S20 응고장애·출혈 위험 관리 #4** · chunk "after the line / goes in"이 절을 끊음 → `["We'll hold firm pressure", "at the site", "after the line goes in", "."]`.
- **S21 뇌부종 위험 감시 #3** · chunk "looks a little / sluggish"가 부사와 형용사를 끊음 → `["His right pupil", "looks", "a little sluggish", "compared to the left", "."]`.
- **S22 대량 출혈·응고붕괴 위기 #4** · "type and cross"는 한 검사 이름 → chunks `["Let's send", "another type and cross", "while we transfuse", "."]`.
- **S23 (선택) ko** · 9.3 `수액을 줬는데도 신장 기능이 멎어 가고 있어요.` · 13.5 `영양팀이 매일 찾아와 확인할 거예요.` · 0.5 `환자분이 못 알아보셨다고 말씀해 주시면 큰 도움이 돼요.`

### keyPhrase 문장 — ko만 고침 (en은 아래 '사용자 결정')

- **K1 락툴로오스 투여·배변 관리 #0** · "독소를 맑게 배출" → ko `네, 이 약은 장을 통해 독소를 몸 밖으로 내보내도록 도와줘요.` distractorsKo 둘 새 ko에, w-medicine·w-clear·w-toxin·w-bowel exKo 갱신(w-clear는 W3에서 이 문장 태그가 빠지므로 example도 6.2·6.5 문장으로).
- **K2 락툴로오스 투여·배변 관리 #2** · "혼란을 맑게 하는" → ko `그건 혼란이 걷히게 하는 데 중요한 부분이에요.` distractorsKo 둘 새 ko에, w-important·w-part exKo 갱신.
- **K3 감염 예방·조기 치료 #1** · "조기 패혈증을 위해"는 "패혈증을 위해서"로 읽힘(뜻이 반대) → ko `패혈증 초기 징후가 있는지 활력징후와 검사 결과를 지켜볼게요.` distractorsKo 둘 새 ko에, w-vital·w-sepsis exKo 갱신.
- **K4 급성 의식저하 기도 위기 #0** · "흡인 준비를 가져올게요"는 어색 → ko `삽관 트레이를 가져오고 흡인도 준비해 둘게요.` distractorsKo 둘 새 ko에, w-intubation·w-tray·w-suction·w-ready exKo 갱신.
- **K5 다장기부전 진행 위기 #1** · "더 많은 지지를 위해"는 번역투 → ko `치료 지원이 더 필요해서 의사에게 보고하고 있어요.` distractorsKo 둘 새 ko에, w-support exKo 갱신.
- **K6 원인별 치료 #1** · "reactions"는 원치 않는 반응(w-reaction ko '이상 반응') → ko `용량을 확인하고 이상 반응이 있는지 모니터링할게요.` distractorsKo 둘 새 ko에, w-confirm·w-reaction exKo 갱신.
- **K7 (선택) 간성뇌증 단계별 관리 #2** · ko `락툴로오스와 다른 조치들이 정신이 맑아지는 데 도움이 될 거예요.`("그의"를 뺌). w-step·w-help exKo.
- **K8 (선택) 응급 이식 조율 위기 #1** · "전체 인계" → ko `이식센터에 빠짐없이 인계할게요.` w-full·w-handoff·w-center exKo.

### 뉘앙스

- **N1 [설계] 암모니아·응고·간효소 추적 · slider(w-level)** · 80→120→190은 "조금씩"이 아니라 spiking으로도 읽힘(정답 둘) → cue `Ammonia came back 80, then 95, then 110 on three checks.` why 그대로(급성 간부전에서는 동맥혈 암모니아가 높으면 뇌부종 위험이 커서 추세를 봄 — 원하면 덧붙임).
- **N2 [설계] 락툴로오스 투여·배변 관리 · context(dose)** · 환자 장면 "Your dose is a nonabsorbable disaccharide…"는 dose가 당류라는 틀린 문장(뜻이 어긋남, 듣는 사람 문제가 아님) → `word: lactulose`, `ko: 락툴로오스`, `words: [w-lactulose]`;
  장면 1 `The lactulose dose is titrated to two or three soft stools a day.`(그대로), 장면 2 `The next lactulose dose is due at 0600, and he's had three stools.`(그대로),
  환자 장면 en `Lactulose is a nonabsorbable disaccharide that acidifies the colon.`, fix `Lactulose is a medicine that helps your bowels get rid of the toxins that cloud your thinking.`,
  why `의료진끼리는 nonabsorbable disaccharide 같은 약리 용어가 정확해요. 환자에게는 같은 lactulose를 무슨 일을 하는 약인지 쉬운 말로 풀어 주세요.`
- **N3 [문법] 락툴로오스 투여·배변 관리 · swap(w-bowel)** · "have a defecation"은 틀린 영어, "have a stool"도 어색 →
  before `["Please tell us each time you ", "have a bowel movement", "."]`, options `[have a bowel movement, pass stool, defecate]`, answer `have a bowel movement`,
  notes `{pass stool: "차트와 의료진 사이에서 쓰는 말이라 환자 대화에는 딱딱해요.", defecate: "격식을 갖춘 의학 용어라 환자에게는 어색해요."}`(정답 노트는 그대로). ko 그대로.
- **N4 [사실] 출혈 경향 감시 · context(bleed)** · 장면 1 "because his INR is already high"는 INR이 출혈 위험을 보여 준다는 오해 → `Any new bleed in liver failure needs a call, even a small one.`(why 그대로).
- **N5 [안전·설계] 저혈당·전해질 감시 · slider(w-low)** · 위 심각 6 → scale `[low-normal, low, critically low]`, answerAt 1,
  why `66은 70 미만이라 저혈당(ADA 1단계)이고 low예요. 54 미만이면 2단계로 critically low 쪽이에요. 간부전에서는 혈당이 빨리 더 떨어질 수 있어 증상이 없어도 병원 저혈당 프로토콜대로 바로 처치하고 다시 재요.`, example `Her glucose is low at 66.` / `혈당이 66으로 낮아요.`
- **N6 [문법] 저혈당·전해질 감시 · swap(w-potassium)** · "Your hypokalemic status is a little low"는 말이 안 됨 → 옵션 `hypokalemic status` → `serum potassium concentration`,
  note `정확하지만 긴 검사 용어라 환자에게는 딱딱해요.`
- **N7 [설계] 간성뇌증 단계별 관리 · context(trigger)** · trigger는 가족도 아는 쉬운 말이라 가족 장면의 어색함은 trigger가 아니라 precipitating factor에서 옴 →
  `word: precipitant`, `ko: 유발요인`(words `[w-trigger]` 그대로);
  장면 1 `Look for the precipitant: infection, a GI bleed, or electrolytes.`, 장면 2 `The precipitant is likely infection; cultures were sent and antibiotics ordered.`,
  가족 장면 `No precipitant has been identified yet.`(fix 그대로),
  why `의료진끼리는 precipitant가 짧고 정확한 말이에요. 보호자에게는 같은 precipitant를 무엇이 이걸 일으켰는지 찾고 있다는 쉬운 말로 풀어 주세요.`
- **N8 [사실] 응고장애·출혈 위험 관리 · slider(w-high)** · why 끝에 덧붙임 `다만 간 질환에서는 INR만으로 출혈 위험을 알 수 없어서, 수치만 보고 혈장을 주지는 않아요.`
- **N9 [관행] 응고장애·출혈 위험 관리 · context(plasma)** · 장면 1이 시술 전 혈장을 규칙처럼, 환자 장면 "Your plasma"는 환자 자신의 혈장으로 읽힘 →
  장면 1 `Give plasma if he's actively bleeding, not just for the INR.`, 환자 장면 `This plasma, specifically FFP, supplies exogenous coagulation factors.`(fix·why 그대로).
- **N10 [문법] 응고장애·출혈 위험 관리 · swap(w-hold, w-firm)** · "I'll tamponade the site at the site."(site 되풀이) → 옵션 `tamponade the site` → `achieve hemostatic tamponade`(note 키도).
- **N11 [사실] 간신증후군 감시 · swap(w-albumin) why** · "이 점은 의사가 동의 과정에서 설명해요"는 병원마다 다름(알부민은 대개 수혈 동의 대상이 아님) →
  `환자에게는 먼저 쉬운 설명을 하고 필요하면 이름을 덧붙여요. 알부민은 헌혈 혈장에서 만든 제제라, 종교적 이유로 혈액 제제를 거부하는 환자는 미리 확인해요.`
- **N12 [설계] 영양·단백 관리 · slider(w-little)** · 강→약 순서 → scale `[none, a little, plenty]`, answerAt 1, why 순서도 그렇게.
- **N13 [설계] 영양·단백 관리 · swap(w-meal)** · `small frequent meals`도 환자 교육에서 흔한 쉬운 말(정답 둘) → 옵션 `small frequent meals` → `frequent low-volume intake`,
  note `영양 기록에서 쓰는 말이라 환자에게는 딱딱해요.` (S8을 첫 안으로 고치면 문장과 내용이 겹치니 why 끝 "밤 간식"은 그대로 둬도 됨.)
- **N14 [사실] 약물 대사·용량 조정 · slider(w-response)** · 위 심각 5 →
  cue `His eyes are open on their own, and he answers my questions right away.`, scale `[unresponsive, drowsy, alert]`, answerAt 2,
  why `스스로 눈을 뜨고 있고 바로 대답하면 alert예요. 불러야 깨면 drowsy, 자극해도 반응이 없으면 unresponsive예요. 간 기능이 나쁘면 진정제가 오래 남을 수 있어, 깨우는 데 필요한 자극이 커지면 바로 알려요.`,
  example `He's alert and answering questions.` / `또렷하게 깨어 있고 질문에 대답해요.`
- **N15 [사실] 급성 간부전 뇌부종 뇌탈출 위기 · slider(w-immediately)** · ICU에서 "신속대응팀"을 부르지 않음(병동용) → why 둘째 문장 `중환자실 담당 의사에게 바로 연락하고 처방된 치료를 준비해요.`
- **N16 [설계] 다장기부전 진행 위기 · context(support)** · 가족 장면이 어색한 이유에 "with a poor prognosis"(내용)가 섞임 → 가족 장면 en `He's on maximal multiorgan support right now.`(fix·why 그대로).
- **N17 [사실] 응급 이식 조율 위기 · context(transfer)** · 위 심각 7 → 가족 장면 en `We're initiating an interfacility transfer to a tertiary transplant center.`,
  why `의료진끼리는 interfacility transfer 같은 용어가 정확해요. 보호자에게는 같은 transfer를 어디로 왜 옮기는지 쉬운 말로 풀어 주세요.`
- **N18 [자연스러움] 이식 평가 연계 · slider(w-urgency) example** · "The urgency is emergent."는 어색 → `His case is emergent.` / `응급으로 다뤄야 하는 경우예요.`
- **N19 (선택) 급성 간부전 뇌부종 뇌탈출 위기 · context(sluggish) fix** · "which tells us his brain is under pressure"는 단정 → `…, which can mean pressure is building in his brain.`
- **N20 (선택) 출혈 경향 감시 · slider(w-bruise)** · 커지는 멍은 피부 밑 출혈이 계속된다는 뜻이라 `active bleeding`과 겹쳐 보일 수 있음 → 마지막을 `open bleeding`, why "active bleeding은 피가 계속 새는 경우"를 "open bleeding은 상처나 바늘 자리에서 피가 밖으로 계속 나는 경우"로.
- **N21 (선택) 원인별 치료 · swap(w-acetaminophen)** · before[2] ` in your blood confirms the cause.` → ` in your blood points to the cause.`, ko `혈액 속 타이레놀 양이 원인을 가리켜요`(S13과 함께).

### 단어 (결정 11 — ko·헤드워드·태그·cue)

- **W1 w-transport** · '운송'은 화물에 쓰는 말 → ko `수송`(distractorsKo `[여권, 사본]`은 dEn passport·transcript 뜻이라 그대로).
- **W2 w-vital** · 문장(12.1)과 cue가 모두 `vitals` → en `vitals`, ipa `/ˈvaɪtəlz/`, chips `[[vi, tals]]`, decoyChips `[via, tails]`, distractorsEn `[vials, virals]`, example은 12.1. id는 그대로.
- **W3 w-clear** · 쓰임 셋 → 2.0·2.2 words에서 w-clear를 빼고 6.5 "his mind usually clears again" words에 더함(6.2·6.5 모두 '맑아지다'). example·exKo를 6.5로.
- **W4 w-status** · 19.3 "status 1A"는 '등급' — S12에서 태그를 뺌.
- **W5 (선택) w-stressed** · en은 "stressed"(부담을 받은)인데 ko '손상받은' → ko `부담을 받은`, 1.4 ko `간세포가 부담을 받고 있어서 간효소 수치가 높아요.`(distractorsKo 둘도 새 ko에).
- **W6 cue (ko를 되풀이·사실)** — 꼭 고칠 것:
  w-gut `락툴로오스가 암모니아를 끌어내는 배 속 소화관을 가볍게 부를 때` · w-physician `처방과 진단을 맡은 사람을 인계에서 격식 있게 부를 때` ·
  w-still `뇌압이 오르지 않게 환자가 몸부림치지 않도록 할 때` · w-news `이식이 어렵다는 결과를 가족에게 처음 전할 때` ·
  w-trip `이식센터로 가는 길에 쓸 혈액과 약을 챙길 때` · w-test `간이 어떻게 일하는지 알아보려고 피를 뽑아 하는 것 하나하나` ·
  w-dextrose `저혈당일 때 정맥으로 넣는 당 성분 수액`("설탕"은 sucrose — 사실).
  (lab·type·imaging·workup·flag·nutrition·med의 cue에 ko 낱말이 들어 있는 것은 정의 안의 일반어라 둠.)
- **W7 (선택) 쉬운 말** · `eye`(0.4)·`arm`·`leg`(3.3)·`neck`(8.4)은 공통 목록 hand·head·body와 같은 부류, `help`(6.2·10.2)·`tell`(0.2·0.5·3.2·S11)은 간호사가 아는 말 → 태그를 빼고 word-remove(빼도 S0 17개·S3 17개·S8 21개 이상).
- **W8 (선택) w-shut** · 문장이 `shutting down` → en `shut down`, chips `[[shut], [down]]`, distractorsEn `[shut in, shot down]`, ko `기능이 꺼져 가다`(w-fail '기능이 멈추다'와 겹치지 않게).
- **W9 (선택) w-bring** · ko `챙겨 가다`(get '가져오다'와 더 가름).

### distractorsEn·distractorsKo — 정답으로도 맞는 오답·틀린 오답

| id | 정답 | 문제 오답 | 이유 | 바꿀 말 |
|---|---|---|---|---|
| w-hard | hard (on the liver) | harsh | "harsh on the liver"도 같은 뜻으로 자연스러움(정답 둘) | hardy |
| w-nutrition | nutrition | nutrient | '영양소'라 '영양'과 거의 같음 | intuition |
| w-nac | NAC | ACE / `ACE (혈압약)` | ACE는 효소 이름이고 혈압약은 ACE 억제제(틀린 뜻) | ASA / `ASA (아스피린)` |
| w-grade | grade (등급을 매기다) | dKo `분류하다` | 등급 매기기와 거의 같은 뜻 | `보고하다` |
| (선택) w-tailor | tailor | alter | "alter a plan"도 계획을 고친다는 말로 통함 | taper |

### distractorsEn — 품사가 다른 것 (전수, ★ = 두 오답 모두 품사가 달라 읽기만 해도 걸러짐, 꼭 바꿀 것)

| id | 정답(품사) | 품사가 다른 오답 | 바꿀 말(길이 규칙 확인함) |
|---|---|---|---|
| ★ w-check | check(동) | chick·cheek(명) | chuck, choke |
| ★ w-left | left(명, "the left") | lift·lent(동) | loft, cleft |
| w-work | work(동) | word(명) | worry |
| w-monitor | monitor(동) | minor(형) | muster |
| w-fever | fever(명) | fewer(형) | fiber |
| w-mean | mean(동) | meal(명, 은행 단어이기도 함) | meet |
| w-fluid | fluid(명) | fluent(형) | flood |
| w-stage | stage(명) | stare(동) | stake |
| w-degree | degree(명) | degrade(동) | debris |
| w-pressure | pressure(명) | preserve(동) | measure |
| w-interview | interview(명) | intercept(동) | interface |
| w-early | early(형) | nearly(부) | earthly |
| w-soon | soon(부) | since(접·전) | once |
| w-position | position(동) | portion(명) | petition |
| w-procedure | procedure(명) | produce(동) | prescription |
| w-safe | safe(형) | save(동) | sage |
| w-tell | tell(동) | tall(형) | teach |
| w-blood | blood(명) | blond(형) | brood |
| w-cell | cell(명) | sell(동) | gel |
| w-gut | gut(명) | cut(동) | gust |

나머지는 같은 품사이거나 명사·동사로 함께 쓰이는 말(scare·urge·trace·stop·pace·access·spare 등)이라 둡니다.

### decoyChips (비속어·불쾌한·술·장례 조각 전수 확인, 고유 조각 약 450개)

- **D1** w-helpful·w-carefully `fool`(바보) → `fill`.
- **D2** w-medicine·w-medication·w-med `mad`(미친) → `mod`(w-med는 distractorsEn `mud`와 겹치지 않게 `mod`).
- **D3 (선택)** w-early `lye`(가성소다 — 중독·화상 주제를 떠올림) → `lay`; w-syndrome `sin`(죄) → `sim`; w-number `bar`(음주 관련 주제라 술집으로 읽힘) → `bur`; w-oxygenation `ax`(도끼) → `ex`.
- 술 조각(gin·rum·ale·beer·wine·pub·booze 등)과 장례 조각(die·dead·grave·coffin·tomb·mourn·bury)은 없음. distractorsEn에도 없음. 그 밖은 일상어로 둠(lie·moan·cry·tear·void·wreck·rat 등).

## chunks (전수) — keyPhrase는 보고만

- 비 KP: 4.3·7.3·7.5·8.4·11.4·15.4·17.5·19.3(문장을 고치면서 함께), 7.4(S20)·8.3(S21)·16.4(S22)·18.3(S18)·19.4(S19).
- KP: 3.2 `about any new / bleeding`(any new bleeding을 끊음), 10.2 `with the transplant / coordinator`, 12.0 `strict hand / hygiene`, 19.1 `to the transplant / center`(복합명사를 끊음), (선택) 2.1 `for a few / soft stools`. → 아래 사용자 결정.

## slider·swap·context 전수

- **pair 0문항** — 이 주제에는 없음.
- **slider 21문항**: cue로 정답이 하나만 맞는지·약→강 순서를 하나씩 판정. 정답 둘 N1(level)·N5(low)·N14(response), 순서 N12(little; N14도 순서를 함께 바꿈). S0 `fully→partly→not oriented`는 장애가 커지는 쪽으로 한 방향이라 둠. 나머지(watery·bruise·fever·improve·high·sluggish·fall·urgency·reaction·redness·immediately·frequently·difficult·spiral·handoff·pain)는 맞음(bruise는 N20 선택).
- **swap 21문항**: `before[0] + 선택지 + before[2]`를 모두 이어 읽음. 문법 N3(defecation)·N6(hypokalemic status)·N10(site 되풀이), 정답 둘 N13(small frequent meals). swap `ko` 21개는 모두 바꾼 문장의 뜻과 맞음(N3·N21만 고친 문장에 맞춰 확인).
- **context 21문항**: `word`가 세 장면 en 모두에 있음(W14 0건). 모양은 모두 핸드오프 모양(의료진 장면 둘 ok + 환자·보호자 장면 하나 not ok + fix). 어색한 이유가 듣는 사람이 아닌 것 N2(dose — 뜻이 틀린 문장)·N7(trigger — 어색함이 다른 말에서 옴)·N16(support — 예후 내용). 장면 내용의 사실 문제 N4·N9·N17. `ko`는 모두 정확.

## 뉘앙스 why·notes — 미국 ICU 관행 대조

- **간성뇌증 등급과 기도 보호** — 등급은 지남력·졸림으로 보고(S0·S6 slider), 의식이 떨어져 기도를 못 지키면 삽관(S17 context·17.3) — 맞음. West Haven 3~4단계에서 기도 보호를 위해 삽관하는 흐름과 맞습니다.
- **락툴로오스·리팍시민은 처방대로** — S2 slider why "목표는 보통 하루 두세 번의 무른 변… 용량 조정은 처방자가 해요" 맞음. 문장 2.5만 S1로 고침. 리팍시민은 이 주제에 나오지 않음(틀린 서술 없음).
- **저혈당 감시** — 프로토콜대로 처치·자주 재기(S4 slider·context) 맞음. 다만 66을 `a bit low`로(N5).
- **응고장애** — S7 slider why "교정은 처방과 시술 계획에 따라" 맞음, 그러나 문장 7.3·KP 7.0·context 장면 1·S3 context 장면 1이 "INR이 높으면 혈장"으로 가르침 → S3·N4·N8·N9·KP. 대량 출혈의 균형 비율 수혈·가온·피브리노겐 자주 재검(S16)은 맞음.
- **뇌부종·암모니아** — 머리 30도·자극 피하기·동공 변화 즉시 보고(S8·S15) 맞음. 급성 간부전에서 암모니아 추세를 보는 것(S1)은 맞으나, 간경변 환자 식사·단백질과 암모니아를 묶은 13.1·13.4는 틀림. 고장성 식염수는 처방(15.0·15.4).
- **NAC** — 일찍 시작할수록 좋음(S11) 맞음, 반응 대처(멈추고 도움 요청, 가벼운 반응도 처방자에게) 맞음. 반응 감시를 검사로 한다는 11.4만 틀림(S6).
- **이식 평가** — 이식팀이 평가·1A는 가장 높은 긴급도·명단 등록 ≠ 장기 배정(S10 slider·swap why) 맞음. 19.3만 S12. 간신증후군의 알부민 시험 투여·소변량 0.5mL/kg/h 기준(S9) 맞음, 알부민 동의 서술만 N11.
- 감염: 100.4°F 이상 발열 기준(S5), 간경변·복수에서 SBP 의심·배양·진단 천자(S5) 맞음.

## B 검토와 맞물림 (v46 order·장면 — B 몫이지만 같은 주장을 담은 곳)

문장을 고치면 아래 order 줄도 같은 내용으로 바꿔야 합니다: S4 줄 3(칼륨 수액백), S7 줄 1·2(혈장·혈소판), S13 줄 2(암모니아로 단백질 조정 — KP 결정에 따름), S14 줄 3(진정제 감량), S15 줄 3·4(고장성 식염수·CT), S17 줄 4(윤상연골 압박), S19 줄 1(1A). S11 줄 1의 "confirms"는 S13(선택)을 반영하면 함께.

## 사용자 결정 필요 — keyPhrase en (고치지 않음)

| 상황 #문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 응고장애·출혈 위험 관리 #0 | Let's correct with products just before the procedure. | INR만 보고 시술 전 교정하는 것은 현재 권고와 반대(AGA 2021·AASLD 2024), 간호사가 교정을 정하는 말 | If products are ordered, we'll give them just before the procedure. | **바꿈** |
| 영양·단백 관리 #1 | We adjust it carefully based on your ammonia. | 단백질을 암모니아로 조정하지 않음(틀린 관행) | We adjust it carefully based on your needs. | **바꿈** |
| 급성 간부전 뇌부종 뇌탈출 위기 #0 | Give the hypertonic saline and elevate his head. | 처방 단서 없이 동료에게 고장성 식염수 지시 | Give the hypertonic saline as ordered and elevate his head. | 바꿈(가벼움) |
| 저혈당·전해질 감시 #0 | Let's recheck the glucose and give dextrose if it's low. | 덱스트로스는 저혈당 프로토콜(표준 처방)로 간호사가 먼저 줌 — 허용 | Let's recheck the glucose and give dextrose per protocol if it's low. | **유지**(바꿔도 됨) |
| 급성 간부전 뇌부종 뇌탈출 위기 #2 | Let's control his CO2 and keep him still. | 환기 설정은 의사·호흡치료사 몫이나 "Let's"는 팀 제안 | Let's have RT adjust the vent for his CO2 and keep him still. | **유지** |
| 감염 예방·조기 치료 #2 | We'll start antibiotics quickly if signs appear. | "We"는 팀, 빠른 항생제는 표준 | — | **유지** |
| 출혈 경향 감시 #2 (chunks) | Please tell me / about any new / bleeding / right away | any new bleeding을 끊음 | en 그대로, chunks `["Please tell me", "about any new bleeding", "right away", "."]` | 바꿈 |
| 이식 평가 연계 #2 (chunks) | I'll help connect you / with the transplant / coordinator | transplant coordinator를 끊음 | en 그대로, chunks `["I'll help connect you", "with", "the transplant coordinator", "."]` | 바꿈 |
| 감염 예방·조기 치료 #0 (chunks) | Let's keep up / strict hand / hygiene / and line care | hand hygiene을 끊음 | en 그대로, chunks `["Let's keep up", "strict", "hand hygiene", "and line care", "."]` | 바꿈 |
| 응급 이식 조율 위기 #1 (chunks) | I'll give / a full handoff / to the transplant / center | transplant center를 끊음 | en 그대로, chunks `["I'll give", "a full handoff", "to", "the transplant center", "."]` | 바꿈 |
| 락툴로오스 투여·배변 관리 #1 (chunks) | We aim / for a few / soft stools / a day | a few soft stools를 끊음 | en 그대로, chunks `["We aim for", "a few", "soft stools", "a day", "."]` | 선택 |

(KP 2.0·2.2·12.1·17.0·18.1·11.1은 en이 맞고 ko만 K1~K6으로 고칩니다. 16.0 "Get plasma, platelets, and cryo now."·19.2 "Bring blood…"는 대량수혈·이송 준비 지시로 자연스러워 유지.)

## 종합

고칠 것 **82개**(선택 제외) — 문장 en 12(S1~S12) · 문장 ko·chunks 9(S14~S22) · KP ko 6(K1~K6) · 뉘앙스 18(N1~N18) · 단어 결정 11 4(W1~W4) · cue 7(W6) ·
오답 뜻·틀린 오답 4(distractorsEn 3 + distractorsKo 1) · 품사 ★ 2 + 품사 비★ 18 · decoyChips 2(D1·D2 — 단어 5개). 선택은 S13·S23·K7·K8·N19~N21·W5·W7~W9·D3·tailor.
그중 **안전 6개**: S2(4.3 수액백에 칼륨), S3(7.3 INR만 보고 혈장), S6(11.4 NAC 반응을 검사로), N5(혈당 66을 a bit low로), N14(RASS와 어긋난 alert), S10(15.4 CT를 간호사가 정함·업무 범위).
사실·관행 오류는 S8·S11·S12·N4·N8·N9·N11·N15·N17과 KP 7.0·13.1.
keyPhrase는 7.0·13.1을 바꾸기를 권하고(관행), 15.0은 가볍게 바꿈, 4.0·15.2·12.2는 유지를 권합니다. KP chunks 4개는 바꿈.
위 목록을 반영하면 내보내도 됩니다.
