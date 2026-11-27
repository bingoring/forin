# core-family-or — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번 context·swap ko)

대상: `core-family-or.yaml` (단어 192 · 상황 21 · 뉘앙스 61 = slider 16 · pair 5 · context 21 · swap 20 · reel 0).
검사기는 이미 통과(`==> 통과`). 아래는 기계가 못 보는 것. 대상 파일은 수정하지 않았다.

표시: **[안전]** = 업무 범위 밖 행동·지킬 수 없는 약속·잘못된 안심·사실 오류(임상)처럼 학습자가 그대로 따라 하면 실무에서 문제가 되는 것.
**★** = 꼭 바꿀 것. 문장 `en`·`ko`를 바꾸면 그 문장의 v46 필드(`tag`·`icon`·`why`·`decoy`·`distractorsKo` 둘·`blank`)를 **B가 새로 쓰고**, 그 문장을 `example`로 쓰는 단어의 `example`·`exKo`도 맞춘다(항목마다 적어 둠).

---

## 1. 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 2 | 철자·소리만 보고 고른 오답이 많아 **품사가 다른 오답이 약 90단어**, 그중 둘 다 품사가 다른 것이 35단어(품사만 보고 고를 수 있음). 정답으로도 맞는 오답은 없음 |
| 2 distractorsKo·다른 뜻 | 4 | 길이는 맞음. `posted`의 오답 둘이 모두 posted의 다른 뜻(게시된·발송된), `care`의 '치료'도 다른 뜻 |
| 3 cue | 3 | 정답 노출은 없음. 그러나 약 20개가 사전 풀이(`person` "한 명의 사람")이거나 `ko`를 되풀이(`wait` "…기다리는 일") — 장면이 안 떠오름 |
| 4 chips·decoyChips | 4 | 정답을 다른 경로로 만드는 조각 없음. 약한 불쾌 조각 셋(cur·men+ace=menace·nam) |
| 5 뉘앙스 사실 | 3 | 수축기 70대를 'stable'로(2.n1), slider 정답이 cue의 절차와 어긋남(5.n0), 가족에게 '접수 선별 검사'(8.n1), 간호사가 '조금' 바뀐다고 판정(13.n1) |
| 6 뉘앙스 설계 | 3 | pair 5개 모두 정답 하나. 그러나 context 7개가 '같은 뜻·다른 말투'가 아니라 무례·압박·다른 내용, slider 2개 정답 둘, slider 5개가 정답만 가장 김, context 어색한 장면이 21/21 셋째·swap 정답이 20/20 둘째 |
| 7 결정 11 | 3 | 변경 102건은 대체로 타당. 그러나 ko만 고치고 `example`을 안 바꾼 2건(case·right), each/other를 두 카드로 쪼갠 것, stand(곁을 지키다), 틀린 ko 5개, 틀린 문장 ko 2개(4.4·11.0)가 남음 |

---

## 2. 사실 오류·심각한 문제

1. **[안전] 업무 범위 — keyPhrase가 간호사를 고지자로 만든다.** 술중 합병증 #0("There was a complication…"), 나쁜 소식 #0·#1, 위기 결정 #0("Let me explain the options…"). 미국 수술실에서 합병증·나쁜 소식 고지와 선택지 설명은 집도의(주치의) 몫이고, 간호사는 면담을 준비하고 동석해 지지한다. 같은 상황의 뉘앙스(15.n2·16.n0·16.n1·20.n0 why "선택지 설명은 집도의가 해요")가 오히려 이 원칙을 가르쳐서 **한 상황 안에서 문장과 뉘앙스가 서로 반대말**을 한다. → §9 사용자 결정.
2. **[안전] context 2.n1 ok:true 장면** "Is she stable? — Yes, stable, pressure in the seventies and sats fine." — 'pressure'는 보통 수축기 혈압으로 읽힌다. 수축기 70대는 안정이 아니다. ok 장면이 틀린 임상을 '맞는 말'로 가르친다. 같은 문항 ok:false 장면은 승압제를 쓰는 환자를 'stable'로 말해 세 장면의 뜻이 다르다.
3. **[안전] slider 5.n0** — cue는 "절차는 집도의가 찾을 때 호출"이라고 해 놓고 정답은 "We'll page you the moment anything changes."(무엇이든 바뀌는 즉시). why는 "절차를 있는 그대로 약속"이라 하지만 정답 문장은 절차와 다르다. 문장 5.4도 같은 약속.
4. **[안전] 10.3** "The interpreter can explain everything in your language." — 의료 통역사는 옮기기만 하고 설명하지 않는다(NCIHC 실무 기준: 정확·완전하게 전달, 내용 추가·설명 안 함). keyPhrase가 아니므로 고친다.
5. **[안전] 13.3·13.n1 fix** "This changes the plan a little" — 계획 변경의 정도를 간호사가 '조금'이라고 판정한다. 13.n1의 fix(정답 모범 문장)가 같은 말을 되풀이해 그대로 가르친다.
6. **[안전] 20.3** "There's no wrong choice here" — 집도의가 한쪽을 권하는 결정에서 대리 결정자에게 '틀린 선택이 없다'고 단정하는 것은 사실이 아닐 수 있다.
7. **word example이 ko와 다른 뜻** — w-case(ko 수술 건, example "…in case we have news" = ~할 경우), w-right(ko 바로, example "…to do things right" = 제대로). 결정 11로 ko를 고치면서 example을 안 바꿈. 카드가 틀린 뜻을 보여 준다.
8. **4.4 문장 ko가 방향을 거꾸로 옮김** — "We'll bring you back as soon as we can."(회복실 안으로 모시고 가겠다) → ko "다시 모시고 올게요". B의 order 4 줄 4("After you've seen her, we'll bring you back here.")도 같은 오해 위에 있다.

---

## 3. 고칠 것 — 단어 v45 필드

| # | 어디 | 문제 | 어떻게 |
|---|---|---|---|
| W1 ★ | w-posted `distractorsKo` [게시된, 발송된] | 둘 다 posted의 실제 다른 뜻 — 정답 셋 | `[소식이 끊긴, 자리를 비운]` |
| W2 ★ | w-care `distractorsKo` [치료, 검사] | '치료'는 care의 다른 뜻(patient care) | `[기록, 검사]` |
| W3 ★ | distractorsEn 품사 — §6 표의 ★ 35단어 | 오답 둘이 모두 정답과 품사가 다름 | 표의 대안 칸대로(같은 품사·비슷한 철자) |
| W4 | decoyChips 불쾌 조각 | w-surgical `cur`(모욕어), w-manage `men`+`ace`=menace, w-number `nam`(전쟁 속어) | w-surgical `cur`→`ser`, w-manage `ace`→`ige`, w-number `nam`→`numb` |
| W5 | cue — 사전 풀이·ko 되풀이 | w-wait·w-vary·w-moment·w-call·w-pager·w-system·w-news·w-page·w-feel·w-alone·w-accurate·w-person·w-specialize·w-fast·w-available·w-condition·w-act·w-return·w-until·w-either | 그 말을 **언제·누구에게** 쓰는지로 다시 쓴다. 예) w-person "그 질문에 답할 '맞는 ○○'은 집도의라고 할 때", w-pager "자리를 비우는 가족에게 손에 쥐여 주는 진동 장치", w-alone "불안해 떠는 가족 곁에 앉으며 '혼자가 아니에요'라고 할 때" |
| W6 | w-wait `distractorsKo` 머무르다 | 은행 단어 w-stay의 ko와 같고, "wait right here"에서 거의 같은 뜻 | `[서두르다, 떠나다]` |
| W7 | w-system `distractorsKo` 장치 | "pager system"을 '호출기 장치'로도 읽을 수 있어 정답 근처 | `[규칙, 명단]` |
| W8 | w-track `distractorsEn` on time | ko '계획대로'와 거의 겹침(제시간에) | `[on call, on hold]` |

---

## 4. 고칠 것 — 뉘앙스

| # | 문항 | 문제 | 어떻게 |
|---|---|---|---|
| N1 ★ [안전] | 2.n1 context `stable` | 장면1 수축기 70대를 stable로, 장면3 승압제 사용(세 장면 뜻이 다름) | 장면1 en "Is she stable? — Yes, stable, BP one-twenty over seventy and sats fine." / 장면3 en "She's hemodynamically stable — MAP in the seventies, SpO2 ninety-eight." / why의 '승압제' 문구 빼고 "혈역학·MAP·SpO2 같은 말"로 |
| N2 ★ [안전] | 5.n0 slider | 정답이 cue의 절차와 다르고 지킬 수 없는 즉시 약속(문장 5.4와 함께 고침, §5 D1) | scale `["We'll find you when it's all over, one way or another.", "We'll page you when we have an update.", "We'll page you the moment anything at all changes."]`, answerAt 1, words `[w-page, w-update]`, example·exKo = 새 5.4, why "호출은 소식이 있을 때(집도의가 찾을 때 포함) 한다는 절차 그대로 말해요. '끝나면'은 막연하고, '무엇이든 바뀌는 순간'은 지킬 수 없는 약속이에요." |
| N3 ★ [안전] | 13.n1 context `plan` fix | fix가 "a little"로 변경 정도를 판정 | fix "The plan has changed, and the surgeon will explain." |
| N4 ★ | 8.n1 context `scared` | 가족은 '접수 선별 검사'를 받지 않음(사실 아님), 단어 ko '무서운'은 scary 뜻 | 장면3 en "Spouse presents as scared and tearful; anxiety appears moderate." / ko `겁먹은` / why "뜻은 셋 다 '겁먹은'… 가족 앞에서 차트 말투로 상태를 읽으면 환자 취급을 받는 기분…" |
| N5 | 6.n1 context `delay` 장면3 | 'turnover inefficiency'(방 정리)는 장면1·2의 사유(앞 수술이 길어짐)와 다름 | "The delay is attributable to the preceding case exceeding its scheduled block time." (why의 '회전 비효율' → '앞 수술이 예정 시간을 넘김') |
| N6 | 7.n1 context `careful` 장면2 | 차트에 "team careful"은 끼워 넣은 말 | "OR RN reports surgeon being careful; case running long, no concerns." |
| N7 | 10.n1 `understand` 장면3 | 말투가 아니라 무례함("Yes or no?") | "Do you understand the postoperative plan of care as discussed?" / why "영어가 서툰 보호자에게 '수술 후 간호 계획' 같은 말로 이해를 물으면 알아듣지 못해요." |
| N8 | 12.n1 `rule` 장면3 | 무례한 말투 | "Per unit rule, PACU visitation is limited to one visitor at a time." / why를 '규정 문구 그대로 읽기'로 |
| N9 | 14.n1 `request` 장면3 | 거절(다른 내용)이라 '같은 뜻' 아님 | "Your request for pre-transport religious accommodation is pending OR approval." / why를 '행정 용어로 들려 차갑다'로 |
| N10 | 16.n1 `honest` 장면3 | 외면하는 말(다른 내용) | "To be honest, the intraoperative findings are outside my scope to disclose." / why "솔직하되 업무 용어로 거절하면 차갑게 들려요…" |
| N11 | 17.n1 `loss` 장면3 | 서류 재촉(다른 내용) | "Sorry for the loss; the decedent's belongings will be released to next of kin." / why "유가족에게 '고인·직계'처럼 서류 말투를 쓰면…" |
| N12 | 18.n1 `angry` 장면3 | 가족 탓(다른 내용) | "You're angry re: the delay — noted." / why "차트 줄임말을 가족에게 그대로 말하면 감정을 기록 대상으로 다루는 것처럼 들려요." |
| N13 | 19.n1 `condition` 장면3 | 'critical·crashing'을 더해 뜻이 다름 | "Acute change in condition at 10:42; surgeon at bedside. Remain in the waiting area." / why를 '시각·용어를 그대로 읽어 줌'으로 |
| N14 | 20.n1 `decide` 장면3 | 다그치는 말(다른 내용) | "As the surrogate, you need to decide on informed consent for the additional procedure." / why "'대리인·사전 동의' 같은 말은 가족에게 법 문서처럼 들려요." |
| N15 | 11.n1 `pediatric` 장면3 | 체중별 용량 설명은 '듣는 사람이 다른 같은 뜻'이 아니고, why의 '약을 잘못 줄까 봐 무서워진다'는 근거 없음 | "She's in pediatric PACU, phase one, on continuous pulse oximetry." / why를 '회복실 단계·감시 용어'로 |
| N16 | 0.n1 context `ko` | 세 장면 모두 명사(an update·Update given·Update:)인데 ko가 동사 '알려주다' | ko `새 소식` |
| N17 | 9.n1 context why | ko는 '외과의'인데 why는 "뜻은 셋 다 '집도의'" | why를 '외과의'로(또는 context ko를 '집도의'로) 맞춤 |
| N18 | 10.n0 pair decoy `other` | "get an other" = 소리로 "get another" — 반쯤 맞는 결합 | decoy `each` (어느 왼쪽에도 안 붙음) |
| N19 | 17.n0 pair decoy `deeply` | 왼쪽 "I'm so deeply" 안에 이미 있는 말 | decoy `sorrow` |
| N20 | 10.n2 swap 오답 "Your teenage son can translate for us." | 이 상황의 환자가 아들(10.0 "Your son is doing well") | "Your teenage daughter can translate for us." — `before[1]`·`options[0]`·`notes` 키 세 곳을 함께 바꿈(notes 내용은 그대로) |
| N21 | 12.n2 swap `ko` "그분이…" | 어색한 지칭 | "환자분이 쉬고 회복하실 수 있게 한 번에 한 분만 면회하실 수 있어요" |
| N22 | 14.n0 slider | cue("약속할 수 없다")로는 "We might be able to fit something in."도 정답 | cue 끝에 "You want the family to feel the request is taken seriously, without promising." 추가 |
| N23 | 15.n0 slider | 1번 "I know this is hard news to hear, and I'm sorry."도 cue에 맞음 | cue 끝에 "She grabs your arm and asks, 'Are you leaving me here alone?'" 추가 |
| N24 | 14.n2 swap why | 정답에 없는 '확인하겠다는 말'을 설명 | "최선을 다하겠다는 말이 약속도 거절도 아닌 정직한 중간이에요." |
| N25 | slider 정답만 가장 김 | 11.n0(47 vs 36·35)·13.n0(47 vs 32·36)·18.n0(55 vs 37·30)·19.n0(43 vs 26·29)·20.n0(39 vs 22·27) — 읽지 않고 길이로 고름 | 오답 쪽에 구체 내용을 더해 길이를 맞춤. 예) 20.n0 "I can't help you with this decision, I'm sorry." / "Honestly, I would definitely say yes to it." |
| N26 | 6.n2 swap 정답 | 6.4를 고치면(§5 D7) 정답·notes 키·ko를 함께 | answer·options[1] "A delay like this doesn't usually mean anything is wrong." / ko "이렇게 지연된다고 해서 보통 뭔가 잘못됐다는 뜻은 아니에요" |
| N27 | (주제 공통, 1건) 위치 | context 어색한 장면이 21/21 셋째, swap 정답이 20/20 둘째. 앱이 파일 순서대로 그린다(`SentContext.tsx`·`SentSwap.tsx`에 섞기 없음). 형제 OR 주제도 context는 21/21 셋째 | 부서 공통 결정 — 앱에서 섞거나 저작에서 위치를 돌린다. 이 주제만의 결함으로 세지 않음 |

---

## 5. 결정 11 — 단어·문장(v44 필드) 고칠 것

### 문장 en·ko·chunks (keyPhrase 아님)

| # | 문장 | 문제 | 고칠 en · ko · chunks | 딸린 것 |
|---|---|---|---|---|
| D1 ★ [안전] | 연락 방법 #4 "We'll page you the moment anything changes." | 즉시 호출 약속. 실제 절차는 소식이 있을 때·집도의가 찾을 때 | en "We'll page you when we have an update." / ko "소식이 있으면 호출해드릴게요." / chunks `["We'll page you", "when we have", "an update", "."]` / words `[w-page, w-update]` | v46 필드 새로. w-page example·exKo = 새 문장. w-change example → 19.0 "Her condition changed and the team is acting fast." / exKo "환자분 상태가 바뀌어서 팀이 빠르게 움직이고 있어요." slider 5.n0(N2). order 5 줄 4("We'll reach you the moment anything changes.")도 B가 같은 뜻으로 |
| D2 ★ [안전] | 다국어 #3 "The interpreter can explain everything in your language." | 통역사는 설명하지 않고 옮김 | en "The interpreter can put everything I say into your language." / ko "제가 하는 말은 통역사가 전부 어머님 언어로 옮겨 드릴 거예요." / chunks `["The interpreter", "can put", "everything I say", "into your language", "."]` / words `[w-interpreter, w-everything, w-language]` | v46 필드 새로. w-language example·exKo. order 10 줄 3도 B가 |
| D3 ★ [안전] | 소아 #4 "You'll be able to see her very soon." | 시점 약속('very soon') | en "You'll be able to see her as soon as she's settled." / ko "따님이 자리를 잡는 대로 바로 보실 수 있을 거예요." / chunks `["You'll be able", "to see her", "as soon as", "she's settled", "."]` / words `[w-able, w-soon, w-settle]` | v46 필드 새로 |
| D4 ★ [안전] | 추가 시술 #3 "This changes the plan a little, but she's still stable." | 변경 정도를 간호사가 판정 | en "The plan has changed, but she's still stable." / ko "계획이 바뀌었지만, 여전히 안정적이세요." / chunks `["The plan has changed", ", but she's", "still stable", "."]` / words `[w-change, w-plan, w-still, w-stable]` | v46 필드 새로. w-still example·exKo = 새 문장. **w-little은 이 문장에만 쓰여 word-remove**(changes에 적기). 13.n1 fix(N3). order 13 줄 2도 B가 |
| D5 ★ [안전] | 위기 결정 #3 "There's no wrong choice here — we'll stand by you either way." | '틀린 선택이 없다' 단정 | en "There's no perfect choice here — we'll stand by you either way." / ko "여기엔 완벽한 선택은 없어요, 어느 쪽이든 저희가 곁을 지킬게요." / chunks `["There's no perfect choice", "here", "— we'll stand by you", "either way", "."]` / words `[w-choice, w-stand, w-either]` | v46 필드 새로(빈칸 answer `wrong`도 바꿔야 함). w-choice·w-stand·w-either example·exKo = 새 문장 |
| D6 | 면회 규정 #3 "This rule helps her rest and heal faster." | '더 빨리 회복' 인과 단정 | en "This rule helps her rest and heal." / ko "이 규칙은 환자분이 쉬고 회복하시는 데 도움이 돼요." / chunks `["This rule", "helps her rest", "and heal", "."]` / words `[w-rule, w-help, w-rest, w-heal]` | v46 필드 새로. w-rule·w-rest·w-heal example·exKo = 새 문장. w-fast example → 19.0(D1과 같은 문장) |
| D7 | 지연 사유 #4 "A delay like this doesn't mean anything is wrong." | 단정. 같은 상황 slider 6.n0은 '모르면 안심시키지 말라'고 가르침 | en "A delay like this doesn't usually mean anything is wrong." / ko "이렇게 지연된다고 해서 보통 뭔가 잘못됐다는 뜻은 아니에요." / chunks `["A delay like this", "doesn't usually mean", "anything", "is wrong", "."]` | v46 필드 새로. w-mean·w-wrong example·exKo. swap 6.n2(N26) |
| D8 ★ | 면회 안내 #4 "We'll bring you back as soon as we can." ko | "다시 모시고 올게요"는 방향이 반대. 이 상황 tagline이 "When can I go **back** and see her"이고 KP "A nurse will come get you"와 이어져, bring you back은 '안(회복실)으로 모시고 가다'(미국 병원 관용) | ko만 "저희가 가능한 한 빨리 안으로 모시고 갈게요." / chunks `["We'll", "bring you back", "as soon as", "we can", "."]` | distractorsKo 둘을 새 ko에 맞춰 다시. w-bring·w-soon exKo. order 4 줄 4("…we'll bring you back here")도 B가 |
| D9 | 소요 시간 #3 "Positioning and anesthesia take some time…" ko | "자세를 잡고 마취를 하는" — 순서가 반대(보통 마취 유도 뒤 체위). w-position cue("마취 뒤")와도 어긋남 | ko만 "마취와 자세 잡기에도 수술 자체가 시작되기 전에 시간이 좀 걸려요." / chunks `["Positioning and anesthesia", "take some time", "before", "the surgery itself starts", "."]` | distractorsKo 둘 다시. w-position·w-anesthesia·w-start exKo |
| D10 | chunks 구 경계(비KP) | 아래 목록 | 아래 목록 | — |

D10 chunks (모두 V5·V8·V9 통과 확인):
- 3.4 `if you / have more / questions` → `["Please", "let us know", "if you have", "more questions", "."]`
- 5.3 `, just let / the desk know` → `["If you step out", ", just", "let the desk know", "where you'll be", "."]`
- 7.4 `and let you / know` → `["I'll keep", "checking in", "and let you know", "right away", "."]`
- 11.3 `the whole / time` → `["She'll have", "a nurse", "watching her closely", "the whole time", "."]`
- 13.4 `as soon / as possible` → `["The surgeon", "will come speak", "with you", "as soon as possible", "."]`
- 15.3 `this is hard / news to hear` → `["I know", "this is", "hard news", "to hear", "."]`
- 16.4 `I'll stay right / beside you` → `["I'm not going", "anywhere", "— I'll stay", "right beside you", "."]`
- (약) 17.4 `about what / comes next` → `["Whenever you're ready", ", we can talk", "about", "what comes next", "."]`

### 단어 ko·헤드워드·example

| # | 단어 | 문제 | 어떻게 |
|---|---|---|---|
| D11 ★ | w-case example | ko '수술 건'인데 example은 "in case"(~할 경우) | example "The earlier case ran longer than expected." / exKo "앞 수술이 예상보다 길어졌어요." (changes에 fields [example]) |
| D12 ★ | w-right example | ko '바로'인데 example은 "do things right"(제대로) | example "Take a breath with me — I'm right here." / exKo "저와 함께 숨을 한 번 쉬어봐요, 제가 바로 여기 있어요." |
| D13 ★ | w-each·w-other | "each other" 한 구를 두 카드로 쪼갬 — other의 ko '서로'는 틀림 | w-each 헤드워드 `each other`, ko `서로`, ipa /iːtʃ ˈʌðər/, chips `[[each], [oth, er]]`, distractorsEn `[each one, every other]`, distractorsKo `[각자, 하나 걸러]`, decoyChips `[eech, ath]`. 10.1 words에서 w-other 빼고 **w-other word-remove**. swap 10.n2 words에서 w-other 뺌 |
| D14 ★ | w-stand | 헤드워드 stand에 ko '곁을 지키다'(stand by의 뜻), 오답 앉다·눕다는 '서다' 뜻에 맞춘 것 | 헤드워드 `stand by`, ipa /stænd baɪ/, chips `[[stand], [by]]`, distractorsEn `[stand in, stand out]`, distractorsKo `[자리를 뜨다, 대신 맡다]`, decoyChips `[bye, stan]`, cue "어떤 결정을 내리든 끝까지 가족 편에 있겠다고 할 때" |
| D15 ★ | w-scared ko `무서운` | 무서운 = scary. scared는 겁먹은 | ko `겁먹은` (context 8.n1 ko도, N4) |
| D16 | w-closely ko `가까이서` | 세 문장 모두 '면밀히'(manage pain closely·watching closely·monitor closely) | ko `면밀히`, distractorsKo `[대충, 가끔]` |
| D17 | w-earlier ko `아까` | 문장은 형용사 "the earlier case"(앞선) | ko `앞선`, distractorsKo `[나중의, 예정된]` |
| D18 | w-bring ko `데려오다` | 두 문장 모두 가족을 환자에게 데려가는 것(4.4·11.2), cue도 '함께 가는 일' | ko `모시고 가다` |
| D19 | w-care 태그 6.3 | ko '돌봄'인데 6.3은 "taking extra care"(주의) | 6.3 words에서 w-care 뺌(11.1만 남김) |
| D20 | w-fast ko `빠른` | 두 문장 모두 부사(acting fast·heal faster) | ko `빨리`, distractorsKo `[천천히, 조용히]` |
| D21 (약) | w-completely ko `충분히` | 충분히 = sufficiently. 문장 번역으로는 자연스럽지만 카드 뜻으로는 틀림 | ko `전적으로` (w-fully '온전히'와 갈림) |
| D22 (약) | w-monitor ko `감시하다` | 감시는 단속 느낌, 임상은 '관찰' | ko `관찰하다` |
| D23 (약) | w-coffee | 간호사에게 가르칠 말이 아님 | 목록 밖 쉬운 단어 10번째로 태그 빼고 word-remove(현재 판단분 9개) |
| D24 ★ | 소아 #0 (KP) "Your daughter is in very good hands." **ko만** | ko "따님은 아주 잘 돌봐드리고 있으니 안심하세요."가 en에 없는 '안심하세요'를 더함 | ko "따님은 아주 믿을 만한 분들이 돌보고 있어요." — en·chunks는 그대로. changes에 `{kind: sentence, …, fields: [ko]}`. distractorsKo 둘을 새 ko에 맞춰 다시, w-daughter exKo도 같은 ko로 |
| D25 | 추가 시술 #0 (KP) "They found something that needs to be addressed now." **ko만** | ko "…발견했어요"가 간호사가 발견한 것처럼 읽힘 | ko "수술팀이 지금 바로 처리해야 할 것을 발견했어요." — en·chunks 그대로. distractorsKo 둘 다시, w-something·w-address exKo도 같은 ko로 |

변경 목록(`changes-core-family-or.yaml`) 판정: word-remove 25건·헤드워드 5건(on track·so far·make sure·sit down·step out)·ko 정리 14건·sentence words 58건 모두 타당. 다만 위 D11·D12처럼 ko를 바꾸면서 example을 그대로 둔 것이 빠짐.

---

## 6. 표 — distractorsEn 품사가 다른 것, 정답의 다른 뜻을 쓴 오답

★ = 오답 둘 다 품사가 다르거나(품사만 보고 고름) 정답의 다른 뜻. 나머지는 권장.

| 단어(품사) | 지금 오답 | 문제 | 대안 |
|---|---|---|---|
| ★ posted(형) | dKo 게시된·발송된 | 둘 다 posted의 다른 뜻 | 소식이 끊긴·자리를 비운 |
| ★ care(명) | dKo 치료 | care의 다른 뜻 | 기록 |
| ★ long(형) | loan·lung(명) | 둘 다 명사 | lone·lean |
| ★ well(부) | wall(명)·will(조) | 〃 | ill·still |
| ★ stable(형) | staple·table(명) | 〃 | unstable·sterile |
| ★ back(부) | bank·bark(명) | 〃 | away·ahead |
| ★ next(형) | text·nest(명) | 〃 | near·last |
| ★ again(부) | against(전)·gain(동) | 〃 | ago·aside |
| ★ manage(동) | manner·mortgage(명) | 〃 | massage·measure |
| ★ closely(부) | closet·closure(명) | 〃 | loosely·coldly |
| ★ ready(형) | reach(동)·really(부) | 〃 | steady·early |
| ★ common(형) | comment·commune(명) | 〃 | comical·uncommon |
| ★ worry(동) | worth·worse(형) | 〃 | hurry·marry |
| ★ more(한정) | mode(명)·mild(형) | 〃 | most·less |
| ★ after(전) | alter·offer(동) | 〃 | above·amid |
| ★ soon(부) | spoon·sound(명) | 〃 | once·too |
| ★ call(동) | coal(명)·tall(형) | 〃 | haul·cool |
| ★ safe(형) | save(동)·sage(명) | 〃 | same·sane |
| ★ wrong(형) | wring(동)·rung(명) | 〃 | strong·wry |
| ★ right(부, 바로) | rate·light(명) | 〃 | tight·nigh |
| ★ want(동) | wand·wasp(명) | 〃 | wane·wash |
| ★ able(형) | table·cable(명) | 〃 | liable·agile |
| answer(동) | anger(명) | 하나 | anchor 유지·anger→ensure |
| ★ whole(형) | whale·hole(명) | 〃 | holy·hollow |
| ★ calm(형) | clam(명)·claim | 〃 | clammy·cramped |
| ★ something(대) | somewhere·sometimes(부) | 〃 | nothing·somebody |
| ★ little(a little) | litter(명)·listen(동) | 〃 | lot·lesser |
| ★ still(부) | stall·steel(명) | 〃 | already·lately |
| honor(동) | honey(명) | 하나 | humor 유지·honey→hover |
| ★ also(부) | alto(명)·alas(감) | 〃 | else·alone |
| ★ like(동) | lake·lime(명) | 〃 | liken·hike |
| ★ during(전) | curing·daring(-ing) | 〃 | despite·along |
| ★ hear(동) | hair·heart(명) | 〃 | hire·heat |
| ★ until(전) | untie(동)·unit(명) | 〃 | unto·upon |
| ★ sorry(형) | sorrow·story(명) | 〃 | sore·surly |
| ★ quiet(형) | quite(부)·quit(동) | 〃 (quite·quit은 decoyChips로) | quick·quaint |
| ★ through(불변사) | though(접)·threw(동) | 〃 | throughout·thereby |
| ★ someone(대) | somehow·someday(부) | 〃 | anyone·no one |
| ★ fully(부) | funny·fussy(형) | 〃 | freely·firmly |
| (D13로 해소) each·other | beach/teach·bother/otter | 둘 다 품사 다름 | D13 |
| wait(동) | weight(명) | 하나 | wade |
| find(동) | fine(형) | 하나 | fend |
| vary(동) | very(부) | 하나(very는 decoyChips로) | veer |
| posted(형) | poster(명) | 하나 | pasted 유지·poster→potted |
| position(동) | potion(명) | 하나 | petition 유지·potion→posit |
| start(동) | smart(형) | 하나 | stare 유지·smart→stack |
| progress(동) | progeny(명) | 하나 | process |
| everything·everyone(대) | everywhere(부) | 하나 | everything→nothing, everyone→no one |
| check(동) | cheek(명) | 하나 | chuck 유지·cheek→chalk |
| pain(명) | plain(형) | 하나 | pail |
| medication(명) | medical(형) | 하나 | meditation 유지·medical→mediation |
| plan(동) | plank(명) | 하나 | plant 유지·plank→plane |
| sleepy(형) | sleeve(명) | 하나 | sloppy 유지·sleeve→sleepless |
| first(부) | thirst(명) | 하나 | fiscal 유지·thirst→finally |
| cell(명 수식) | sell(동) | 하나 | shell 유지·sell→cello |
| number(명) | numb(형) | 하나 | lumber |
| stay(동) | stairs(명) | 하나 | stray 유지·stairs→stain |
| earlier(형) | eagerly(부) | 하나 | easier 유지·eagerly→eerier |
| extra(형) | exit(명) | 하나 | extreme 유지·exit→exact |
| safely(부) | safety(명) | 하나 | sadly 유지·safety→sanely |
| thorough(형) | through(전) | 하나 | thoughtful |
| sometimes(부) | something(대) | 하나 | somewhat |
| completely(부) | completion(명) | 하나 | compactly 유지·completion→compliantly |
| help(동) | hello(감) | 하나 | held 유지·hello→hold |
| talk(동) | tall(형) | 하나 | tack 유지·tall→walk |
| alone(형) | alarm(명) | 하나 | along 유지·alarm→aloof |
| share(동) | shore(명) | 하나 | shave 유지·shore→shear |
| accurate(형) | accuse(동) | 하나 | adequate 유지·accuse→accrued |
| speak(동) | speck(명) | 하나 | sneak 유지·speck→spell |
| specific(형) | specify(동) | 하나 | pacific 유지·specify→scientific |
| slowly(부) | lowly(형) | 하나 | solely 유지·lowly→slyly |
| tell(동) | tall(형) | 하나 | sell 유지·tall→toll |
| clear(형) | clerk(명) | 하나 | clean 유지·clerk→clever |
| pediatric(형) | paramedic(명) | 하나 | periodic 유지·paramedic→psychiatric |
| visitor(명) | visual(형) | 하나 | investor 유지·visual→vendor |
| rule(명) | rude(형) | 하나 | role 유지·rude→rune |
| rest(동) | west(명) | 하나 | rust 유지·west→wrest |
| heal(동) | heel(명) | 하나 | hail 유지·heel→heat |
| fast | fact(명) | 하나 | last 유지·fact→past |
| together(부) | tougher(형) | 하나 | altogether 유지·tougher→thereafter |
| before(전) | begin(동) | 하나 | beyond 유지·begin→behind |
| practice(명) | predict(동) | 하나 | pretext 유지·predict→precinct |
| hard(형) | heard(동) | 하나 | hurt 유지·heard→hardy |
| honest(형) | honor(명) | 하나 | hopeful 유지·honor→modest |
| happen(동) | happy(형) | 하나 | hasten 유지·happy→harden |
| easy(형) | east(명) | 하나 | eager 유지·east→earthy |
| beside(전) | reside(동) | 하나 | bedside 유지·reside→below |
| upset(형) | upside(명) | 하나 | upright 유지·upside→upbeat |
| angry(형) | anger(명) | 하나 | hungry 유지·anger→angular |
| act(동) | apt(형) | 하나 | ache 유지·apt→add |
| choice(명) | choose(동) | 하나(choose는 decoyChips로) | voice 유지·choose→chalice |
| either(한정) | ether(명) | 하나 | neither 유지·ether→other |
| seem(동) | seam(명) | 하나 | seek 유지·seam→seep |

(대안은 같은 품사·비슷한 철자·길이 규칙(1.25배·3자 이내)을 기준으로 고른 예. 수정 담당이 길이·은행 단어 중복을 한 번 더 확인할 것.)

---

## 7. 기계적 전수 확인 결과

### chunks — 구 경계를 끊은 조각
- **keyPhrase(보고만, 사용자 결정)** — §9 표 끝에 V8을 지키는 대안까지 적음: 0.0·1.0·1.2·2.0·2.2·3.2·4.1·4.2·5.0·5.1·9.0·10.0·11.0·14.1·17.0·17.2·20.1. 약한 것(유지 가능): 7.0 `doesn't always / mean a problem`, 12.2 `gets to see / her`, 16.1 `about what / happened`, 16.2 `, and I'm / right here`, 20.0 `as clearly / as I can`.
- **비KP** — §5 D10에 대안.

### pair — 왼쪽 × (오른쪽 + decoys) 전 조합
| 문항 | 조합 | 판정 |
|---|---|---|
| 2.n0 | on: track✓ far in along / so: track far✓ in along / check: track far in✓ along | **정답 하나.** 저작자가 짚은 `on in`은 "come on in" 안에서만 나오는 조각이라 단독 결합이 아님. 유지 |
| 8.n0 | take a: breath✓ down mood / sit: breath down✓ mood | **정답 하나.** `mood`는 어느 쪽에도 안 붙음(take a mood ✕). 미끼로는 약하지만 바꿀 후보(rest·seat·up)는 모두 정답이 둘이 되므로 **유지** |
| 10.n0 | speak/get an/make × slowly·interpreter·sure·other | `get an other` ≈ "get another"(소리 같음) → N18 |
| 12.n0 | rest and/switch × heal·out·alone | 정답 하나 |
| 17.n0 | I'm so deeply/There are no × sorry·words·deeply | 정답 하나. decoy가 왼쪽 안의 말 → N19 |

### swap — before[0] + 선택지 + before[2]
20문항 모두 before가 `['', 문장 전체, '']`라 이어 붙인 문법은 전부 맞고, 정답은 모두 하나. swap `ko` 20개는 바꾼 문장의 뜻과 맞음(12.n2 지칭만 N21). 오답 중 사실과 다른 것은 10.n2(N20). 모두 '한 단어 바꾸기'가 아니라 '문장 고르기'라는 점은 형제 OR 주제와 같은 모양이라 지적만 함.

### context 21 — 듣는 사람
21개 모두 장면1 동료·장면2 차트·장면3 가족(ok:false)으로 **듣는 사람은 셋 다 다름**(통과). `word`는 21개 모두 세 장면 `en`에 있음(W14 0). 그러나 장면3이 '같은 뜻을 가족에게 맞지 않는 말투로'가 아닌 것 — 다른 내용·무례·압박: 6.n1·8.n1·10.n1·11.n1·12.n1·14.n1·16.n1·17.n1·18.n1·19.n1·20.n1(N5·N4·N7·N15·N8·N9·N10·N11·N12·N13·N14), ok 장면 사실 오류 2.n1(N1), 끼워 넣은 차트 문장 7.n1(N6). 0.n1·1.n1·3.n1·4.n1·5.n1·9.n1·13.n1·15.n1은 모양이 맞음(13.n1은 fix만, 9.n1은 why만).

### slider 16 — 약함→강함과 정답 하나
순서는 16개 모두 '아무 말 안 함 → 알맞은 말 → 장담'의 한 축으로 말이 됨. 정답 둘: 14.n0(N22)·15.n0(N23). 정답이 cue와 어긋남: 5.n0(N2). 정답 칸 분포 1번 9·2번 4·0번 3(섞임). 정답만 가장 긴 것 5개(N25).

### decoyChips·정답 chips 조합(불쾌 조각)
decoy가 들어간 조각 1~3개 순열을 사전(`/usr/share/dict/words`)과 맞춰 전부 읽고, 정답 조각만의 순열까지 넣어 금칙어 목록(V21 목록+α)으로 한 번 더 돌림. 정답 철자를 다른 경로로 만드는 조합 0. 비속어·성적·술·장례·무기·민족 비하 0. 약한 것: `cur`(모욕어), `men`+`ace`=menace(위협), `nam`(베트남전 속어) → W4. `vas`·`mad`·`sob`·`lye`(5회)·`bust`(w-best 오답)는 문제 삼지 않음.

---

## 8. 저작자 메모 판정

| 메모 | 판정 |
|---|---|
| 합병증 #0 (KP) | **동의** — §9 15번 |
| 합병증 #1 (KP) "managing it… stable right now" | 15.0을 바꾸면 'it'이 가리킬 것이 없어짐 → §9에서 함께 |
| 나쁜 소식 #0·#1 (KP), #3 (비KP) | **동의** — §9 16번(#3은 그 묶음에 딸린 고침) |
| 추가 시술 #0 (KP) | **en 유지 권고** — tagline에서 집도의가 이미 가족에게 알린 내용을 되짚는 말. ko만 D25 |
| 추가 시술 #3 (비KP) | **동의** — D4 |
| 위기 결정 #0 (KP) | **동의** — §9 20번 |
| 위기 결정 #1 (KP) "would have wanted" | '대리 결정자에게만'은 이 장면이 바로 그 경우라 문제 아님(대리 판단 원칙). 다만 과거완료가 이미 숨진 사람처럼 들림 → §9 20번(약) |
| 다국어 #3 (비KP) | **동의** — D2 |
| 정보 공유 — 제한된 정보 #0, 다국어 #0 (KP) | **유지** — HIPAA 45 CFR 164.510(b): 환자가 반대하지 않았거나 의식이 없을 때 진료에 관여하는 가족에게 판단으로 알릴 수 있고, 수술 전 연락받을 사람을 정해 두는 것이 관행. 9.n0 cue("approved contact list")가 전제를 이미 가르침. 다국어 #0은 짧은 안부라 통역 전이어도 됨(자세한 정보는 통역으로) |
| 진행 #3 "on track so far" (비KP) | **유지** — 2.0 KP("The team just let me know…")가 출처를 줌 |
| 지연 #1 (KP) | **유지** — 6.0이 사유를 확인한 장면이고, 앞 수술 뒤 방 준비는 일반적으로 참. slider 6.n0이 '모르면 단정하지 말라'를 따로 가르침 |
| 지연 #4 (비KP) | **약하게 동의** — D7('usually') |
| 장시간 #1·#2 (KP) | **유지** — #2는 '확인했다'를 전제로 한 사실 보고, #1은 일반적 안심. 결과 약속 아님 |
| 가족 질문 #1 (KP) "the moment he needs it" | **유지(약)** — 회복실에는 PRN 처방이 있고 사정 후 바로 준다. 바꾼다면 "He'll have pain medication ready when he needs it." |
| 회복실 면회 #2 (KP) | **유지** — 'Usually·about'으로 이미 범위로 말함 |
| 소아 #4 (비KP) | **동의** — D3 |
| 면회 규정 #3 (비KP) | **동의** — D6 |
| 종교 #1 (KP) "I can arrange a moment…" | **유지** — 수술 전 대기실에서 짧은 기도 시간은 흔히 맞춰 줌. 'can arrange'는 확약이 아니라 가능성 |
| 위기 #3 (비KP) | **동의** — D5 |
| 연락 #4 (비KP) | **동의** — D1 |
| 소아 #0 (KP) ko "안심하세요" | **동의** — D24. #1 소아팀은 장면 전제라 유지 |
| B 메모 7.4·19.1·15.1·10.0·17.0 | 문장은 유지. 7.4 chunks만 D10 |

---

## 9. keyPhrase — 사용자 결정 필요

persona는 21상황 모두 **가족**. 아래 대안은 모두 가족에게 2인칭으로 말하고, 3인칭은 제3자(집도의·팀)만 가리킨다.
상황 15·16·20은 in-json의 제목·목표가 간호사를 고지자로 적고 있어(15 "합병증 소식을 신중히 전달한다", 16 "나쁜 소식을 … 전달한다", 20 목표2 "선택지를 명확히 전하고") **장면 묶음으로** 결정하는 것이 맞다. 묶음 안 비KP 고침은 KP를 바꿀 때만 한다(조건부).

### 묶음 A — 15 술중 합병증 소식 전달 → "합병증 — 집도의 면담 연결·동석"
| 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|
| There was a complication during the surgery. | 합병증 고지는 집도의 몫(사건 고지 정책·CANDOR). tagline "did something go wrong?"에 간호사가 먼저 확인해 줌 | (가) "The surgeon wants to talk with you in person about the surgery." — 장면 유지 / (나) "As the surgeon told you, there was a complication during the surgery." — tagline을 '집도의 설명 뒤'로 바꿀 때 | **바꾸기.** (가)를 권함. (가)는 w-complication·w-during이 이 문장에만 있어 word-remove가 따름 — 'complication'을 남기고 싶으면 (나)+tagline 변경 |
| The team is managing it and she's stable right now. | (가)를 고르면 'it'이 가리킬 것이 없음 | "The team told me she's stable right now." | (가)일 때 **바꾸기**, (나)면 유지 |
| The surgeon will explain everything in detail. | 문제 없음 | — | 유지 |
목표 대안: "가족의 질문에 정직하게 답하되 고지는 집도의에게 연결한다 / 면담에 동석해 가족을 지지한다". order 15(B)도 함께.

### 묶음 B — 16 나쁜 소식 준비·전달 → "나쁜 소식 — 집도의 면담 준비·동석"
| 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|
| Let's sit down together — I have some difficult news. | 간호사가 나쁜 소식의 전달자 | "Let's sit down together — the surgeon is coming to talk with you." | **바꾸기** |
| I want to be honest with you about what happened. | 'what happened'을 간호사가 설명하겠다는 말. 같은 상황 slider 16.n0("I don't know the details; the surgeon is coming")과 반대 | "I'll be honest with you about what I know." (w-happen은 이 문장에만 있어 word-remove) | **바꾸기** |
| Take whatever time you need, and I'm right here. | 문제 없음 | — | 유지 |
조건부 비KP: 16.3 "There's no easy way to say this."(고지자의 서두) → "I know this is difficult — take a moment before the surgeon comes in." / ko "힘드신 거 알아요, 선생님이 들어오시기 전에 잠시 숨을 고르세요." / chunks `["I know this is difficult", "— take a moment", "before the surgeon", "comes in", "."]` / words `[w-difficult, w-moment, w-before, w-surgeon]`(w-difficult를 살림, **w-easy word-remove**). slider 16.n0 example = 새 16.1, **words `[w-honest, w-happen, w-news]` → `[w-honest, w-surgeon]`**(w-happen·w-news가 이 상황 문장에서 빠지므로 V15). 새 16.0 words `[w-sit, w-together, w-surgeon, w-talk]`, 새 16.1 words `[w-honest]` — 상황 단어 14개(V3 통과). 묶음 A·C는 남은 뉘앙스 words가 모두 그대로 문장에 있음(확인). order 16 대안(B 몫, 순서 하나로 묶임): "Let's sit down together — the surgeon is coming to talk with you." → "Until then, I'll be honest with you about what I know." → "When the surgeon comes, I'll stay right beside you." → "Afterward, take whatever time you need — I'm right here."
목표 대안: "집도의의 나쁜 소식 면담을 준비하고 동석한다 / 가족의 감정을 지지하며 곁을 지킨다".

### 묶음 C — 20 위기 중 가족 결정 지원
| 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|
| Let me explain the options as clearly as I can. | 선택지 설명은 집도의. 같은 상황 slider 20.n0 why와 반대 | "I'll make sure the options are explained as clearly as possible." (chunks `["I'll make sure", "the options", "are explained", "as clearly as possible", "."]`, 단어 explain·option·clearly·make sure 그대로) | **바꾸기** |
| Think about what he would have wanted. | 대리 판단은 맞는 원칙. 다만 과거완료가 이미 숨진 사람처럼 들림 | "Think about what he would want." | **바꾸기(약)** — 유지해도 오류는 아님 |
| Whatever you decide, we'll support you fully. | 문제 없음 | — | 유지 |
목표2 대안: "집도의가 설명한 선택지를 이해하도록 돕고 정서적으로 지지한다". order 20 줄 1·2(B)도 함께.

### 그 밖의 keyPhrase
| 상황·현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|
| 추가 시술 "They found something that needs to be addressed now." | 집도의가 이미 알린 것을 되짚는 말이라 범위 안 | (원하면) "The surgeon found something that needs to be addressed now." | **유지** (ko만 §8) |
| 제한된 정보 "I can share that he's stable and doing well." | HIPAA상 허락된 가족이면 됨 | — | **유지** |
| 다국어 "Your son is doing well — he's stable." | 〃 | — | **유지** |
| 지연 "The delay is to make sure everything's ready and safe." | 6.0이 사유를 줌 | — | **유지** |
| 장시간 "The team is being thorough and careful." / "I checked in, and things are progressing steadily." | 결과 약속 아님 | — | **유지** |
| 가족 질문 "He'll have medication ready the moment he needs it." | '즉시'가 약간 강함 | "He'll have pain medication ready when he needs it." | **유지(약)** |
| 면회 "Usually that's about thirty minutes after surgery." | 범위로 말함 | — | **유지** |
| 종교 "I can arrange a moment before we take him back." | 가능성 표현 | — | **유지** |
| 소아 "Your daughter is in very good hands." | en은 문제 없음(ko만 §8) | — | **유지** |

### keyPhrase chunks — 구 경계를 끊음(V8 지키는 대안, 모두 V5·V8·V9 통과 확인)
| 문장 | 지금 | 대안 |
|---|---|---|
| 0.0 | `in the surgical / waiting area` | `["You can", "wait", "right here", "in the surgical waiting area", "."]` |
| 1.0 | `takes about / two to three / hours` | `["The surgery", "usually", "takes", "about two to three hours", "."]` |
| 1.2 | `we'll keep / you posted` | `["Times can vary", ", and", "we'll keep you posted", "."]` |
| 2.0 | `The team just / … / things are going / well` | `["The team", "just", "let me know", "things are going well", "."]` |
| 2.2 | `with the next / update` | `["I'll", "come back", "with the next update", "."]` |
| 3.2 | `That's a common / concern` | `["That's", "a common concern", ", and we plan", "for it", "."]` |
| 4.1 | `when she's / ready` | `["A nurse", "will come", "get you", "when she's ready", "."]` |
| 4.2 | `that's about / thirty minutes` | `["Usually that's", "about thirty minutes", "after surgery", "."]` |
| 5.0 | `and I'll / call you` | `["Leave me", "your cell number", "and", "I'll call you", "."]` |
| 5.1 | `There's a pager / system` | `["There's", "a pager system", "if you prefer", "."]` |
| 9.0 | `and doing / well` | `["I can share", "that", "he's stable", "and doing well", "."]` |
| 10.0 | `Your son is doing / well` | `["Your son", "is doing well", "— he's stable", "."]` |
| 11.0 | `in very good / hands` | `["Your daughter", "is", "in very good hands", "."]` |
| 14.1 | `before we take him / back` | `["I can arrange", "a moment", "before", "we take him back", "."]` |
| 17.0 | `for your / loss` | `["I'm", "so deeply sorry", "for your loss", "."]` |
| 17.2 | `with the next / steps` | `["When", "you're ready", ", I can help", "with the next steps", "."]` |
| 20.1 | `what he would / have wanted` | `["Think about", "what he", "would have wanted", "."]` |

---

## 10. 종합

고칠 것 — 뉘앙스·단어 v45 34건(§3 W1~W8 — W3은 표의 품사 ★ 35단어를 1건으로 셈, §4 N1~N26) + 결정 11 25건(D1~D25, D10은 8문장) = **59건, 그중 [안전] 8건**(N1·N2·N3·D1~D5). 이 수에는 가장 심각한 문제인 keyPhrase 묶음(15·16·20)과 그 조건부 고침(16.3 등)이 빠져 있다. 주제 공통 위치 문제(N27)는 따로.
keyPhrase는 15·16·20 세 묶음이 사용자 결정 대상(바꾸기 권고 6문장, 약 1문장). 고친 뒤 내보내도 됨 — 단, 15·16·20을 그대로 두면 같은 상황의 문장과 뉘앙스가 서로 반대말을 하므로 결정 전에는 이 세 상황을 내보내지 않는 것을 권함.
