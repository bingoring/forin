# core-handoff-er — v46 보강 검토

대상 `core-handoff-er.yaml`(상황 20 · 문장 102 · order 20장). 문장 102개와 order 20장을 전부 봤습니다. 스크립트로 전부 뽑은 것:
빈칸 선택지 4개를 문장에 넣은 102×4줄, decoy를 청크 자리마다 넣은 조립 전부, order 인접 교환 20×3,
선택지 아이콘의 정답·오답 분포, `check`·`cross`에서 바뀐 28개(빌드 스크립트의 풀 치환).

판정 전제: 핸드오프 jsx(119행)를 보면 빈칸·조립 낱장 머리에 `ko`가 형광펜으로 뜹니다. 그래서 "정답이 둘"은
**`ko`까지 맞는 다른 선택지**를 기준으로 봤고, 장면상으로는 그럴듯해도 `ko`가 걸러 주는 것은 참고로만 적었습니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 사실 오류 없음. 14.1 tPA 근거가 약하고, 12.1·14.2는 뜻만 풀어 씀(ko 되풀이), 15.4는 뜻을 부풀림 |
| 2 | 빈칸 | 3 | ko까지 맞는 오답 1(resident), 경계 2(sign·stay). 문법으로 걸러지는 오답 2, 쉬운 단어 목록에 있는 정답 5, 가르치지 않는 숫자 정답 3, `blacks/whites` |
| 3 | `decoy` | 4 | 자리를 대신 넣었을 때 ko에 맞는 문장은 없음. `of the` 4개는 들어갈 자리가 없어 바로 걸러지고, 시간 부사(last night 10·at noon 8)가 너무 많음 |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 할 법한 말. 정답과 한 낱말만 다른 쌍 6개 |
| 5 | `order` | 3 | 인접 교환이 자연스러운 카드 4장(S8·S12·S19·S20), 순서를 억지로 묶은 접속어 2장(S5·S19), 임상 순서가 억지인 카드 1장(S3), 서수만으로 순서를 고정한 카드 1장(S10) |
| 6 | `tag`·`icon` | 3 | 태그는 좋음. 선택지 아이콘 27개가 낱말과 무관하고, 정답·오답에 따라 아이콘이 갈려 답이 드러남(아래 Q1) |
| 7 | context `word`·`ko`, swap `ko` | 4 | swap `ko`는 전부 맞음. context는 S3 `dose`=용량이 틀렸고, S4·S17은 `word`가 어색한 장면의 핵심 말을 가리키지 않음 |
| 8 | 파일럿 갈래 | 3 | 갈래 1(check/cross)은 해결했지만 바꾼 아이콘이 무관함. 갈래 3(order 고정)이 6장, 갈래 4(임상 순서) 1장, 갈래 5(오답 뜻 겹침) 6쌍 |

## 사실 오류·심각한 문제

- **사실 오류: 없음.** Joint Commission의 환자 식별 두 가지(이름+생년월일, 병상 번호는 식별자가 아님), 가족 통역 대신 자격 있는 통역사,
  미국 병원의 통역 제공 의무, SBP<90 저혈압 기준, 72시간 보류는 주마다 기간·절차가 다름, teach-back, down time, START 색 분류, accepting doctor는 모두 맞습니다.
- **심각 1 — 선택지 아이콘으로 답이 보인다.** 정답·오답에 따라 아이콘이 갈립니다. `handshake2`는 정답 6 / 오답 0, `redo`는 정답 1 / 오답 30,
  `lock` 1/22, `bandage` 0/10, `coffee` 1/15, `play` 1/14입니다. "자물쇠·되돌리기는 오답, 악수는 정답"만 익혀도 맞힐 수 있습니다(아래 Q1).
- **심각 2 — 20.0 `blacks`·`whites`.** 사람 수를 세는 복수형이라 미국 영어에서는 인종을 가리키는 말로 들립니다. 게다가 black은 실제 START
  분류(expectant)이므로 장면상 틀린 말도 아닙니다. 둘 다 바꿔야 합니다.
- **심각 3 — 10.3 정답이 둘.** `resident`(전공의)도 의사여서 ko "의사가 이미 봤나요"에 그대로 맞습니다. 게다가 정답 `doctor`는 쉬운 단어 목록에 있는 말입니다.

## 고칠 것 (68건)

### A. 빈칸 (15)
1. 10.3 빈칸 · 정답 `doctor`가 쉬운 말이고 `resident`도 ko에 맞음 · 빈칸을 태그 단어 `pending`으로 옮김: `pending / finished / canceled / charted`
2. 17.2 빈칸 · 정답 `see`가 쉬운 말이고, `go tell/call him`도 문법상 맞음 · 빈칸을 `reassess`로 옮김: `reassess / discharge / transfer / sedate`
3. 17.3 빈칸 · 정답 `now`가 쉬운 말 · 빈칸을 `wait`로 옮김: `wait / last / change / matter`
4. 13.3 빈칸 · 정답 `family`가 쉬운 말 · 빈칸을 태그 단어 `mentioned`로 옮김: `mentioned / hidden / changed / denied`
5. 6.3 빈칸 · 정답 `six`는 가르치지 않는 숫자 · 빈칸을 `antibiotic`으로 옮김: `antibiotic / insulin / heparin / steroid`
6. 16.1 빈칸 · 정답 `eight`는 가르치지 않는 숫자(태그 단어는 down·shock) · 빈칸을 `shocks`로 옮김: `shocks / breaths / doses / codes`
7. 20.0 빈칸 · `blacks`·`whites`는 인종을 가리키는 말로 들리고, black은 실제 분류색 · `yellows / blues / oranges / purples`로 바꿈(아이콘은 Q1 참고)
8. 20.2 빈칸 · 정답 `fifteen`은 가르치지 않는 말이고 숫자만 외우는 문제 · 빈칸을 `Reassess`로 옮김: `Reassess / Discharge / Sedate / Transfer`. 숫자를 남긴다면 `fifteen / fifty / five / fifty-five`처럼 teen/-ty를 대비
9. 19.3 빈칸 · `sign`(서명)은 퇴원 계획 확정과 거의 같은 뜻 · `sign`을 `reject`로 바꿈
10. 15.4 빈칸 · `stay with her`(곁에 있다)는 ko "함께 이동"과 겹침 · `stay`를 `talk`로 바꿈
11. 12.3 빈칸 · `one time you leave and return`은 문법이 틀려 바로 걸러짐 · `one time`을 `the next time`으로 바꿈
12. 19.2 빈칸 · `Let's argue who…`는 about이 없어 바로 걸러짐 · `argue`를 `ignore`로 바꿈
13. 12.2 빈칸 · 자해 위험 병실에서는 가방(bags)도 실제로 치움(장면상 정답) · `bags`를 `charts`로 바꿈
14. 11.3 빈칸 · `answer for him`(대신 대답)은 가족 통역의 위험과 같은 말이라 맞는 지시가 됨 · `answer`를 `care`로 바꿈
15. 16.2 빈칸 · 심정지 후 삽관 환자는 대개 진정 상태여서 `sedated`가 장면상 맞음 · `sedated`를 `ambulating`으로 바꿈

참고(ko가 걸러 주므로 고치지 않아도 됨): 11.0 `video`, 5.3 `admission`, 10.0 `medications`, 10.1 `charted`, 13.3 `patient`, 14.2 `belongings`,
20.3 `lobby`, 8.2 `away`, 12.4 `ready`, 6.0 `appendicitis/cellulitis`. 문장 안에서 맞는 말이지만 ko와 다릅니다.
선택: 5.1 정답 `afternoon`도 쉬운 단어 목록에 있습니다. 옮긴다면 `down`으로(`down / up / higher / flat`).

### B. 선택지 아이콘 (27, Q1)
아래 표는 문장마다 넷이 서로 다르고, 문장 `icon`과 겹치지 않고, `check`·`cross`가 없는 것을 확인한 값입니다.
접속사·전치사 빈칸은 어떤 아이콘이든 임의이므로 넷을 같은 계열(chevron 계열)로 맞춰 하나만 튀지 않게 했습니다.

| 문장 | 선택지 | 지금 → 제안 |
|---|---|---|
| 1.2 | stable* | compass → pushpin |
| 1.4 | over* | compass → chevronRight |
| 1.4 | minus | bulb → chevronLeft |
| 2.0 | stable* | compass → pushpin |
| 2.1 | chest | compass → monitor |
| 3.0 | skipped | compass → chevronRight |
| 3.1 | blood | compass → bandage |
| 3.4 | once* | compass → calendar |
| 3.4 | unless | bulb → chevronRight |
| 4.0 | correct* | compass → board |
| 4.1 | anemia | compass → lab |
| 4.2 | blood | compass → lab |
| 4.5 | unless | compass → chevronRight |
| 5.0 | closely* | compass → monitor |
| 7.0 | normal | bulb → shield |
| 7.0 | negative | compass → chevronDown |
| 7.1 | normal | compass → shield |
| 7.1 | negative | bulb → chevronDown |
| 7.2 | done* | compass → pushpin |
| 7.2 | canceled | bulb → lock |
| 7.4 | confirm* | bulb → magnify |
| 7.4 | cancel | compass → lock |
| 8.0 | normal | compass → shield |
| 8.2 | unsure | compass → faceWorried (함께: `unaware` faceWorried → me) |
| 8.3 | closely* | compass → monitor |
| 9.1 | stable* | compass → pushpin |
| 10.1 | refused | compass → faceAngry |

(* = 정답. 10.2 `unless` compass → chevronRight도 같은 원리라 함께 바꾸기를 권합니다. 표의 27건에는 넣지 않았습니다.)

### C. 정답·오답 아이콘 쏠림 (2)
1. `handshake2`가 정답에만 6번 · 셋을 다른 아이콘으로: 13.1 `wife` → me, 19.1 `arranging` → board, 14.3 `accepting` → hospital
2. `redo`·`lock`이 오답에만 몰림(52 대 2) · 정답 몇 개에 씀: 18.2 `scratch` pencil → redo. 앞으로 오답에 `lock`·`redo`를 더 얹지 않기(B의 7.2·7.4 `lock`은 다른 아이콘이 마땅치 않아 남겼으니, 수정 담당이 대체할 아이콘을 찾으면 그쪽을 쓰기)

### D. `distractorsKo` — 정답과 한 낱말만 다름 (6)
파일럿 기준(한 번↔매번도 영어로 구별되지만 지적됨)을 똑같이 적용했습니다.
1. 13.2 · "아드님은 지금 많이 화가 나 있어요, 조심하세요"는 지금↔아까, 조심↔부드럽게만 다름 · "아드님은 아까 면회를 마치고 돌아가셨어요"로
2. 14.4 · "전원 후 마지막 혈압은 안정적이었습니다"는 전↔후만 다름 · "이송 중에는 혈압을 재지 못했습니다"로
3. 16.3 · "첫 번째 제세동 이후 혈압은 안정적이었습니다"는 첫↔마지막만 다름 · "제세동 뒤 승압제를 끊었습니다"로
4. 6.3 · "다음 항생제 투여는 8시 예정입니다"는 시각만 다름 · "항생제 처방이 아직 나지 않았습니다"로
5. 20.0 · "적색 3명, 황색 8명, 녹색 5명입니다"는 숫자만 바꿈 · "적색 환자는 이미 모두 이송했습니다"로(우선순위 낮음)
6. 20.2 · "녹색 환자를 15분마다 재사정하세요"는 색만 다름 · "황색 환자는 녹색 구역으로 보내세요"로(우선순위 낮음)

### E. order (7)
1. S8 · 1↔2를 바꿔도 자연스러움(경보 → 혈압 순서도 성립하고, "Given both"는 어느 순서든 받음) · 2줄을 "Because of that, her monitor alarm has gone off twice this hour."로
2. S12 · 3↔4를 바꿔도 자연스러움. 게다가 "1대1로 항상 관찰"인데 3줄은 "나갔다 돌아올 때마다"라고 해서 서로 맞지 않음 · 4줄을 "If he tries to leave during those checks, security is aware and will call."로. 3줄의 you를 sitter 교대 상황으로 고치기(예: "Whenever the sitter changes, please recheck the room.")
3. S19 · 1↔2를 바꿔도 됨(회의에서 간호·사회복지 보고 순서는 정해져 있지 않음). 4줄 "Since they already know"는 인과가 맞지 않음(가족이 안다고 담당을 정할 이유가 되지 않고, 앞 줄의 말을 되풀이함) · 2줄을 "Social work is arranging safe discharge to a shelter once her mobility improves."로, 4줄을 "With all of that, let's agree who follows up on each item."으로, why와 4줄 ko도 함께
4. S20 · 3↔4를 바꿔도 자연스러움("both groups"가 1줄의 적색·황색을 받음) · 4줄을 "While you do that, the greens can wait in the hallway."로, ko·why도 함께
5. S5 · 4줄 "Otherwise"는 조건으로 읽으면 말이 안 되고(더 떨어지지 않으면 나머지 셋이 안정?), ko "아니라면"은 틀린 번역. why가 이 오독을 근거로 듦 · "Other than her, the other three beds are stable and just waiting for discharge." / ko "그분 말고 나머지 세 병상은…" / why에서 Otherwise 문장을 지우고 "Other than her가 앞의 3번 병상을 받아요"로
6. S3 · 임상 순서를 억지로 묶음(혈압 재측정이 소변 검체 도착에 묶이고, 투약 시각이 기록 뒤에 옴) · 다음 4줄로 다시 씀: "His last dose of antibiotic was given on time." → "The next one is due at four." → "Before that, the urine sample still needs to go to the lab." → "Can you confirm the result once it's back?" (인접 교환 셋 모두 지시어 the next one·Before that·the result로 막힘). ko·note·why도 이에 맞게
7. S10 · 서수(Next/Last)와 "Thanks./Okay."만으로 순서를 고정함(Q3) · 다음처럼 앞 줄을 가리키는 말로 묶음: 1 "You didn't mention her allergies — any I should know?" → 2 "With no allergies, was the pain medicine actually given, or just ordered?" → 3 "Who ordered it — has the doctor already seen her, or is that still pending?" → 4 "With all of that, I'll go check the chart now so we don't miss anything." ko·why도 함께

선택(건수에 넣지 않음): S7 3줄 "Once you've confirmed it", S17 3줄 "Because of that drop"은 앞 줄의 말을 그대로 되풀이합니다(갈래 3). "Once you have it"·"Because of that"이면 충분합니다.
S1 3줄 "with that history, he's alert and stable"은 논리가 어색하고 ko "그 병력에 비해"와도 다릅니다. S11은 1↔2 교환이 약하게 성립합니다.

### F. `why` (4)
1. 14.1 · "tPA를 줬는지 알려야 중복 투여를 피한다"는 근거가 약함 · "tPA를 줬는지에 따라 받는 병원의 혈압 관리·출혈 감시·혈전제거술 결정이 달라져요"로. 앞 문장의 "증상이 시작된 시각"에 미국식 용어 last known well을 덧붙이면 더 좋음
2. 12.1 · 두 문장 모두 뜻풀이(ko 되풀이) · 말하는 방식의 이유로: "requires로 말하면 선택이 아닌 의무라는 게 분명해져요. at all times를 붙여 교대·휴식 중에도 끊기지 않게 해요."
3. 14.2 · 첫 문장이 ko를 그대로 되풀이 · "are traveling with the patient는 진행형으로 지금 함께 실려 간다는 걸 알려서, 받는 쪽이 따로 요청하지 않아도 돼요." + 둘째 문장은 유지
4. 15.4 · "travel with her는 환자가 불안정할 때 간호사가 동행한다는 뜻"은 뜻을 부풀림 · "travel with her로 간호사가 이송에 동행한다고 밝혀요. 불안정한 환자라 이송 중에도 간호사가 곁을 지킨다는 뜻이 돼요."

선택: 4.0 "환자 식별은 이름과 생년월일로 해요"는 "보통 이름과 생년월일 두 가지로 해요"가 더 정확합니다(NPSG는 두 가지를 요구할 뿐 종류는 정하지 않음).

### G. context `word`·`ko` (3)
1. S3 context · `ko: 용량`이 틀림("dose is due"의 dose는 1회 투여분) · `ko: (1회) 투여분`
2. S4 context · `word: bed`인데 어색한 장면의 핵심은 환자에게 이름을 먼저 말하고 `correct?`로 묻는 것 · `word: correct`, `ko: 맞나요?(확인)`
3. S17 context · `word: status`인데 why·fix의 핵심은 "Forget what I just said" · `word: Forget what I just said`, `ko: 방금 한 말은 잊으세요`

### H. `decoy` (4)
`of the`는 어느 자리에도 들어가지 않아 바로 걸러집니다. 같은 자리에 올 수 있는 구로 바꾸세요.
1. 2.2 `of the` → `for the MRI`
2. 3.4 `of the` → `the X-ray report`
3. 14.3 `of the` → `after transport`
4. 19.2 `of the` → `by tomorrow`

참고: decoy 102개 중 시간 부사(last night 10, at noon 8, this morning 5, tomorrow 4, at night 4…)가 절반이 넘어 학습자가 "시간 말은 빼면 된다"를 익힙니다.
앞으로는 청크 자리에 맞춰 다양하게 쓰세요. 4.5 `outside the room`, 15.3 `right now`는 자리를 대신하지 않고 **끼워 넣으면** ko에 거의 맞는
문장이 됩니다(우선순위 낮음).

## 결정 11 — 보고만(이번 v46에서는 고치지 않음)
- 4.4 "Her diagnosis and bed number both match the chart." · 병상 번호를 확인 항목으로 보여 줌(NPSG.01.01.01과 어긋남). why가 바로잡지만 문장 자체가 잘못된 습관을 보여 줌 · 나중에 문장 정리 때 "Her name and date of birth both match the chart."로
- 4.2 "name band" · 미국 병원에서는 "ID band"·"wristband"를 더 흔히 씀 · 참고

---

## 저작자 보고 판정

### Q1. `check`·`cross`를 바꾼 아이콘
- 바뀐 것은 **28개**입니다(cross→오답 14, check→정답 11, check→오답 3). 빌드 스크립트가 풀을 앞에서부터 꺼내 써서 **모두 `compass` 아니면 `bulb`**가 됐습니다.
  낱말과 무관한 것이 **27개**이고, 8.2 `aware`→bulb(알아차림)만 봐 줄 만합니다. 위 B표가 바꿀 아이콘 27개입니다(NbIcon 목록 안, check·cross 없음).
- **정답만 긍정 아이콘을 받는 패턴이 있습니다.** `handshake2`는 정답 6/오답 0, `magnify` 6/3, `siren` 9/6입니다. 반대로 `redo`는 1/30,
  `lock` 1/22, `bandage` 0/10, `coffee` 1/15, `play` 1/14, `chevronDown` 1/11입니다. 파일 전체로 보면 아이콘만 보고도 답을 거를 수 있습니다 → C 2건.
- 저작자가 직접 고른 아이콘 가운데도 낱말과 무관한 것이 있습니다(선택, 건수에 넣지 않음): 3.1 stool→home, 11.1 male→bell, 5.1 night→lock,
  6.1 oxygen→speaker, 1.1 lung→monitor, 2.2 X-ray→scalpel, 20.3 parking lot→plane, 12.2 pillows→baby, 16.2 intubated→speaker, 20.0의 색 넷(lock·bell·home·star).

### Q2. 숫자·색 이름 빈칸
- **정답이 둘이 되지는 않습니다.** 낱장 머리에 ko(황색·15분)가 뜨므로 하나로만 맞습니다.
- `yellows`는 태그 단어(w-yellow)라 가르칠 값이 있습니다. 다만 `blacks`·`whites`는 바꿔야 합니다(위 심각 2, A7).
- `fifteen`은 태그 단어가 아니고(태그는 reassess·yellow·change) 오답도 숫자를 외우는지만 봅니다 → A8(빈칸을 `Reassess`로 옮기거나 fifteen/fifty 대비).
- 같은 기준으로 6.3 `six`, 16.1 `eight`(둘 다 태그 단어 아님)도 옮깁니다(A5·A6). 8.4 `twice`는 쓸모 있는 말이라 두고, 9.3 `noon`은 태그 단어라 두며, 5.1 `afternoon`은 선택입니다.

### Q3. `First/Next/Last` (부른 쪽의 "상황 8·9" = 0부터 센 번호로 **S9 다중 환자 동시 인계, S10 인계 정보 누락 확인**. 1부터 센 S8에는 서수가 없음)
판정 방법: 서수를 지우고도 내용만으로 순서가 하나로 정해지는가.
- **S9 — 조건부 허용.** 1줄 "start with the sickest and work down"이 위중도 순서라는 틀을 세우고, 여러 환자를 인계할 때 "First… Next… Last…"는
  실제 말투입니다. 가장 위중(3번) → 단순 업무(2번) → 퇴원 대기(1번)도 그 틀에 맞습니다. 다만 2번과 1번은 위중도 차이가 약해 3↔4를 서수가 혼자 막고 있습니다.
  고치지 않아도 되지만, 3줄(2번 병상)에 1번 병상보다 할 일이 남았다는 점(정오 항생제)이 이미 들어 있으니 지금 상태를 유지하세요.
- **S10 — 불허.** 질문 셋(알레르기·투여 여부·진료 여부)은 순서가 정해져 있지 않고, 순서를 묶는 것은 Next/Last와 "Thanks./Okay."뿐입니다.
  브리프가 금지한 경우(어느 줄 뒤에도 붙는 말로 고정)에 해당합니다 → E7처럼 앞 줄을 가리키는 말로 다시 씁니다.

### Q4. `why`의 임상 사실
- **Joint Commission 환자 식별 두 가지:** 맞습니다. NPSG.01.01.01은 식별자 두 가지를 요구하고 병실·병상 번호는 식별자가 아닙니다. 4.0·4.3·4.4·S4 order가 모두 이를 따릅니다(4.0 표현만 선택적으로 다듬기).
- **가족 통역 금지:** 맞습니다(Section 1557: 응급이거나 환자가 요청한 경우가 아니면 가족·미성년자 통역을 쓰지 않음, 자격 있는 통역사가 원칙). 11.0 "통역 제공 의무"도 맞습니다(Title VI/1557, 연방 지원을 받는 병원).
- **SBP<90:** 맞습니다(저혈압 기준으로 흔히 씀).
- **정신과 보류 시간은 주마다 다름:** 맞습니다(CA 5150은 72시간, 다른 주는 기간·요건이 다름).
- 그 밖에 틀린 사실은 없습니다. 약한 것은 14.1(tPA 근거)과 15.4(뜻을 부풀림)이고, 12.1·14.2는 뜻풀이에 그칩니다 → F.

## 종합
사실 오류는 없지만 **선택지 아이콘으로 답이 드러나고**(바꾼 27개는 무관하고, 정답·오답에 따라 아이콘이 갈림), `blacks/whites`, 10.3의 두 번째 정답,
order 7장이 걸립니다. A~H 68건을 고친 뒤 V18·V19를 다시 돌리면 내보내도 됩니다.
