# er-abdominal — v46 보강 검토 (er)

대상: `er-abdominal.yaml` (상황 21 · 문장 105 · order 21장 · 뉘앙스 context 10 · swap 11). 문장 105개와 order 21장을 전부 봤다.
상황 번호는 파일 순서 0부터(S0 = 초기 복통 문진 … S20 = 다발외상 동반 복강내출혈), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것:
- 빈칸 `before+선택지+after` 420줄
- decoy를 청크 자리마다 바꿔 넣은 조립과 사이마다 끼운 조립 약 1,000줄
- order 인접 교환 63가지
- context `word`가 세 장면의 `en`에 실제로 있는지(W14 0건)
- 저작자가 고친 장면을 base와 나란히(3문항 4장면 — S12는 장면0 `en`과 장면1 `fix`. 자기 보고 "3건"과 맞음)
- swap `ko` 11건
- 빈칸 오답·decoy·`distractorsKo`의 돌려쓰기 횟수
- base와 v44 필드 비교: 단어·문장(`en·ko·chunks·words·goal`)·뉘앙스 모두 바뀐 것이 없다. context 장면 `en`만 예외로 바뀌었다.
- order 줄 단어 수: 15단어를 넘는 줄이 12개다(아래 order 절).

`verify_one_theme.py` → `==> 통과`. W13 경고 5건(`paste`·`tub`·`tape`·`sever`·`bill`)은 v44 단어 오답이라 이번 범위 밖이다(결정 11에 보고만).

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다.
문법이 맞고 장면상 그럴듯해도 `ko`가 걸러 주는 오답·decoy는 괜찮은 것으로 봤다(예: 1.0 `nausea`, 0.0 `nausea`, 5.4 `an endoscopy`, 8.2 `chest`, 9.2 `blood`).
context 판정은 `wip/er-v46-ctx/review-ctx-A·B·C.md`와 같은 기준이다. 세 장면 모두에 `word`가 있어야 한다. 어색함이 곁의 임상어나 수치에서 오는 모양(묶음 B 총평 1, 묶음 A `understand`·`question`)은 허용했다. W14를 맞추려고 끼워 넣은 말은 고칠 것으로 봤다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 말하는 방식의 이유(쉬운 동사로 풀기, so·because로 이유 붙이기, 이름 대신 동작으로 말하기)와 임상 근거를 함께 짚는다. 사실도 맞다(Murphy 징후, CVA 압통, Charcot 삼징, 장간막 허혈의 진찰과 통증 불일치, 자격 있는 통역사, 고령자 비전형 증상, distracting injury). 고칠 것은 6건이다. 6.2·16.1은 문장을 설명하지 않고 그 문장이 모자라다고 비판한다. 2.3 `feel sick`은 영국식 뜻이다. 14.3은 서술문을 부탁이라고 한다. 19.2·19.4는 근거 없는 말투 주장이다. |
| 2 | 빈칸 | 3 | `ko`로 거르면 정답이 둘인 문장은 20.1(`fall` — `ko` "사고로"에 맞음) 하나다. 경계선은 19.1 `asking`(`ask for the team` ≈ 팀을 부르다)이다. 문제는 세 갈래다. ① 동떨어지거나 말이 안 되는 오답이 13문장이다(1.3·16.0 `longer/closer/faster`, 1.4·4.3 `buy/cook/order`, 2.0 `step/walk to`, 6.2 `bathing`, 13.0 `blame/judge`, 15.0 `tickling/freezing` 등). ② 돌려쓰기가 있다 — `itching/itchy` 11문장, `cough` 7문장, `rash` 4문장, 부를 사람 `pharmacist/chaplain/dentist` 4문장. ③ 관사·문법은 잘 지켰다(`an EKG/an MRI`, `a transfusion/an injection`, `an interpreter/a chaplain`). |
| 3 | `decoy` | 4 | 거의 모두 비문이 되거나 `ko`와 어긋난다. `ko`에 맞는 문장이 되는 것은 둘이다. 2.1 `your belly`(I2 `Does it hurt more when I press your belly or when I let go?`)와 15.2 `for you`(`…preparing blood for you right now`)다. 경계선 7개는 보고만 한다. 다만 105개 중 90개 남짓이 시간·장소 부사구(`in the morning` 5회, `since morning`·`this morning`·`in your arm`·`at home` 각 4회)라서, "시간·장소 구가 decoy"라는 요령이 생긴다(보고). |
| 4 | `distractorsKo` | 4 | ER 앞 주제들과 달리 정답 뒤집기가 없다(부정어 스캔 0건). 오답은 모두 같은 상황에서 할 법한 다른 말이다. 반만 다른 말은 6.3 [1] 하나다. 돌려쓰기는 사소하다("열이 있었나요?" 5회, "지금 통증이 몇 점인가요?" 4회, "가스는 나오나요?" 3회). |
| 5 | `order` | 2 | 앞 줄을 가리키는 말로 묶은 설계와 S0·S10·S16의 흐름은 좋다. 그러나 21장 중 17장에 고칠 것이 있다. 임상 흐름·인과가 틀린 카드: S6(수액이 금식 때문), S1(마지막 섭취를 통증 변화에 걸음), S12(통역사가 왔는데 끄덕임으로 문진), S17(안정 자세가 외과 대기 때문), S2(가장 아픈 곳부터 누름), S14(활력 재측정이 증상에 달림·L4 앞뒤가 안 이어짐), S20(혈액 준비가 "심각할 수 있어서"). "때문에"식 지시어로 억지로 묶어 원어민이 안 할 말이 된 줄: S5 L3, S8 L3, S11 L4, S15 L3·L4, S18 L3(비문), S19 L2. 인접 교환이 열린 카드: S3·S4·S6·S7(2↔3), S9·S17(3↔4). 15단어 넘는 줄 12개. `ko` 머리말은 모두 카드 내용과 맞다. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 모두 10자 안이다. 105문장에 95가지라 주제 이름에 가깝다(보고만). 아이콘은 대체로 어울린다. 사소 1건: 18.2 ERCP에 `scalpel`. |
| 7 | context `word`·`ko`, swap `ko` | 4 | W14 0건, context `ko` 10건 정확, swap `ko` 11건 모두 바꾼 문장의 뜻이다. 그대로 둔 7건은 규칙에 맞는다. 고친 3건 중 PO는 받아들인다. point는 방식은 허용하되 fix 문장을 고친다. VS는 인계 장면에 `VS`를 끼워 넣었으니 고친다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진 빈칸 오답 약 13문장, 돌려쓰기 약 9문장. 관사는 잘 지켰다. (3) order 못 박기: 인접 교환 열린 카드 6장, 앞 줄 말 되풀이 1장(S13 `To understand it`). (4) 임상 순서·사실: order 7장. (5) 오답 뜻·decoy 겹침: dKo 1, decoy 2. |

## 사실 오류·심각한 문제

1. **S6 order L4 `Since you won't be eating or drinking, we're starting IV fluids and medicine for the pain.`** — 수액과 진통제를 금식 때문에 하는 일로 가르친다.
   급성 췌장염에서 수액은 췌장염 자체의 기본 치료(소생)다. 진통제는 통증 때문에 준다. why("먹지 못하는 동안의 치료")도 같은 인과를 가르친다. 16단어이고, 2↔3 교환도 열려 있다(L3에 앞 줄을 가리키는 말이 없음).
2. **S1 order L4 `Because that change could mean a procedure, I need to know when you last ate or drank.`** — 마지막 섭취 시각을 통증 점수가 올랐을 때만 묻는 것처럼 가르친다(TASK 10번).
   수술 가능성이 있는 복통 환자에게는 모두 묻는다(1.1·2.2 why도 "꼭 적어 둬요"). 점수가 그대로라는 답이면 `that change`가 가리킬 것이 없다. 17단어다. L2 `With those numbers noted, how bad is the pain…`도 활력 수치와 통증 점수를 억지로 묶었다.
3. **S12 order L2·L3** — L1에서 통역사를 불렀다. 그런데 L2는 `With the interpreter's help, can you point…`이고, L3은 `For my other questions, please nod yes or shake your head no.`다.
   통역사가 있는데 나머지 문진을 끄덕임으로 받으라고 가르치는 셈이다. 12.0 why("자격 있는 통역사가 원칙")와 뉘앙스 pair why("중요한 답은 통역을 통해 다시 확인")와 어긋난다. 손으로 가리키기에는 통역이 필요 없다. 몸짓은 통역 연결 **전까지** 쓰는 것이다.
4. **S17 order L3 `Since you'll be waiting for the surgeon, we're going to keep you flat and still to reduce the pain.`** — 가만히 누워 있게 하는 이유가 "외과를 기다리니까"가 된다.
   실제 이유는 움직이면 복막이 자극되기 때문이다(17.1 why와 같음). 19단어다. 3↔4 교환도 열려 있다(L2 → L4 `Based on that report…` → L3이 자연스러움).
   L2 `…with an SBAR report`는 환자에게 보고 틀의 이름을 말하는 것이다(결정 11의 17.2와 같은 갈래).
5. **S2 order L2 `I'm pressing there now — does it hurt more when I press or when I let go?`** — 환자가 L1에서 가리킨 가장 아픈 곳부터 바로 누른다.
   복부 촉진은 아프지 않은 곳에서 시작해 아픈 곳을 **마지막에** 만지는 것이 표준이다. 16단어이고, L4도 19단어다.
6. **S14 order L3·L4** — L3 `Let me recheck your vital signs, since those symptoms can matter.`는 재측정을 증상 답에 건다. 그러나 이 상황 brief("미묘한 징후와 활력 변화를 세심히")와 14.2 why는 고령자의 활력을 증상과 상관없이 다시 보라고 한다.
   L4 `A small change in them matters a lot, so tell me even if the pain is small.`는 "활력의 작은 변화가 중요하니 통증이 작아도 말하라"로 앞뒤가 이어지지 않는다. 17단어다.
7. **S18 order L3 `Together with your fever, that's why we'll start antibiotics right away…`** — 영어로 비문이다(`Together with X, that's why…`). 원어민은 이렇게 말하지 않는다.
8. **20.1 빈칸 `fall`** — `ko`가 "사고로"다. 한국어로 낙상도 "사고"라서 `Tell me where you hurt the most from the fall.`이 `ko`에 맞고 영어도 자연스럽다. 정답이 둘이다(chest-abd-trauma 20.1 `bike`와 같은 모양).
9. **6.2·16.1 why가 문장을 비판한다** — 학습자는 이 문장을 본보기로 외우는데, 해설은 "지시처럼 들려요, 이유를 덧붙이는 게 좋아요"(6.2)라고 하고, "피를 뽑는다는 말을 풀지 않은 표현이라 혈액검사라고 덧붙여 주면 더 쉬워요"(16.1)라고 한다.
   해설이 본보기 문장을 깎아내린다.

## 저작자 자기 보고 판정

1. **`ko`로만 걸러지는 빈칸(`how bad is the nausea` 등)과 장간막 허혈 첫 문장(`worse` ↔ `longer/closer/faster`)** — 둘로 갈린다.
   - `ko`로만 걸러지는 빈칸: **그대로 둬도 된다.** 1.0 `nausea/swelling/fever`, 0.0 `nausea/vomiting/bleeding`, 6.4 `nausea/fever`, 16.4 `fever/nausea/bleeding`, 5.4 `an endoscopy`, 8.2 `chest`(흉관도 말은 됨), 9.2 `blood sample`, 4.2 `urine` 모두 같은 분야에서 틀린 말이다. `ko`가 "통증"·"초음파"·"코로"처럼 정답을 하나로 정한다. 파일럿 2(b)에 맞는 오답이다.
   - 16.0 `longer/closer/faster`: **고칠 것.** `Your pain is much longer/closer/faster than what we feel on exam`은 영어로 말이 안 된다. 같은 분야에서 틀린 말이 아니라 읽기만 해도 걸러지는 말이다(파일럿 2 첫 줄). 같은 묶음이 1.3(`any longer/closer than it was an hour ago`)에도 있다. 두 문장 모두 아래 빈칸 절대로 고친다. 16.0은 이 문장의 `words`에 있는 `concern`으로 빈칸을 옮기는 안을 권한다.
2. **대동맥류 order 3·4줄처럼 "때문에" 식 지시어로 묶은 줄이 원어민이 실제로 할 말인지** — **아니다. 고칠 것.**
   L3 `Those answers and your low blood pressure mean this could be very serious.`는 문법은 맞지만, 원어민 간호사는 "그 답들이 뜻한다"로 긴급함을 설명하지 않는다. L4 `For that reason, we're calling…`는 글말이다.
   임상으로 봐도 찢는 통증과 저혈압이면 문진 답을 기다리지 않고 팀이 움직인다. 소견을 앞세워 말하는 쪽이 자연스럽다.
   L3 `With pain like that and your pressure this low, this could be very serious.` / L4 `That's why we're calling the surgeon and getting blood ready right now.`
   (`That's why`는 이유를 말한 줄 바로 뒤에만 붙는다. L2는 질문이라 3↔4가 잠긴다.)
   같은 눈으로 본 다른 줄에서 고칠 것: S5 L3 `Apart from your shoulder,`(어깨와 촉진은 관계가 없음), S8 L3 `That makes vomiting important, so…`(배변이 안 된다는 답이 구토를 중요하게 만들지 않음), S11 L4 `That check means urgent blood work…`(검사를 부르는 것은 임신 확인이 아니라 증상), S18 L3(비문, 위 심각 7), S19 L2 `Because of that, stay with me`(혈압이 떨어졌기 "때문에" 정신 차리라는 말은 안 함), S20 L4 `Because that could be serious`. 통과로 본 것은 S16 L2 `Because of that concern`(조금 딱딱하지만 실제로 하는 말)과 S10 L3 `Either way`(임신 검사는 답과 상관없이 한다는 뜻이라 임상으로도 맞음)다.
3. **context 정비 3건과 그대로 둔 7건**
   - **PO(S7) — 받아들인다.** 영상의학과 통화에서 `PO contrast`는 실제로 소리 내어 하는 말이다. 다만 `drinking the PO contrast`는 "입으로"를 두 번 말하는 셈이라, `She's finished her PO contrast for the CT.`로 줄이면 더 자연스럽다(사소).
   - **point(S12) — 방식은 허용, fix는 고칠 것.** XX `Ask him to point to where it hurts the most.`의 어색함은 `point`가 아니라 통역사에게 3인칭으로 말하는 데서 온다. 듣는 사람이 다르다는 메모와 맞고, 묶음 B의 "방법의 대비"와 같은 모양이라 허용한다. why(1인칭으로 환자를 보고 말하기)도 미국 의료 통역 표준(NCIHC)에 맞다.
     그런데 새 fix `Please point to the spot that hurts the most — I'll look at you while the interpreter helps.`의 뒷부분은 간호사가 환자에게 하지 않는 말이다(자기 시선을 해설함). → fix `(환자를 보며) Can you show me with one finger where it hurts the most?`(장면0과 겹치지 않게. base fix는 장면0과 같은 문장이었다)
     장면0의 앞 문장 `I'm speaking to you through the interpreter.`도 조금 딱딱하다. `I'll be talking with you through the interpreter.`로 바꾸면 좋다(선택).
   - **VS(S14) — 고칠 것.** 인계는 말로 한다. 말로는 `vitals`나 `vital signs`라고 하지 `VS`("브이에스")라고 하지 않는다. 인계 장면(ok) `Please recheck her VS every fifteen minutes.`는 W14를 맞추려고 끼운 말이다. 학습자가 이 장면도 어색하다고 고를 수 있어 정답이 둘로 읽힌다.
     → `word: recheck`, `ko: 다시 재다`로 바꾸고 인계 장면을 base(`Please recheck her vital signs every fifteen minutes.`)로 되돌린다. 세 장면 모두 `recheck`(`rechecked`)가 있다. W14 어간 비교(`verify_lesson_content.py`의 `_has`)를 통과하는지 확인했다. 어색함은 XX의 `VS·q15`에 그대로 남고 why도 그대로 맞는다(묶음 A `turn` → `closely`와 같은 수법).
   - **그대로 둔 7건 — 모두 규칙에 맞는다.**
     - radiate, rebound, Murphy's sign, LMP, pulsatile, out of proportion, BP 모두 `word`가 세 장면의 `en`에 있다.
     - 의료진 장면 둘은 정확한 임상어이고, 어색한 장면은 같은 말을 환자에게 쓴 곳이다(핸드오프 CTX와 같은 모양).
     - BP는 어색함이 `BP`가 아니라 환자에게 던진 수치(`78 over 40 and dropping`)에서 온다. 묶음 A·B가 허용한 "곁의 말" 모양이다.
     - Murphy's sign만 why를 조금 다듬는다(아래 context).

## 고칠 것 (v46 필드)

### why (6, +사소 3)
- 6.2 · 문장 비판 → "keep you from …ing은 '못 하게 막는다'는 뜻이라 금식을 분명하게 전해요. 췌장염 초기에는 구역과 통증이 가라앉을 때까지 금식하고, 견딜 수 있으면 일찍 다시 먹기 시작해요."
- 16.1 · 문장 비판 → "drawing은 지금 피를 뽑고 있다는 진행형이고, right away로 서두르는 검사임을 알려요. 젖산은 장으로 가는 피가 부족할 때 오를 수 있어 장간막 허혈을 의심하면 일찍 재요."
- 2.3 · "feel sick은 메스꺼움을 쉽게 부르는 말" — 미국 영어의 `feel sick`은 "몸이 안 좋다"는 넓은 뜻이고, 메스꺼움은 `sick to your stomach`·`nauseous`로 말한다 → "feel sick은 속이 안 좋거나 몸이 안 좋은 것을 넓게 묻는 쉬운 말이에요. 메스꺼움과 열이 복통에 더해지면 염증성 원인을 뒷받침해서 바로 알려 달라고 해요."
- 14.3 · "작은 통증도 말해 달라는 부탁이에요" — 서술문이지 부탁이 아니다 → "Even a little…로 작은 통증도 가볍게 넘기지 않는다고 알려요. 참는 성향의 환자는 증상을 줄여 말하기 쉬워서 미리 안심시켜요."
- 19.2 · "immediately는 right away보다 더 급박한 느낌" — 근거가 없다(둘은 거의 같은 말) → "immediately로 기다리지 않고 바로 시작한다고 알려요. 혈압이 떨어진 환자는 수액과 산소로 먼저 상태를 지지해요."
- 19.4 · "환자에게는 이 편이 덜 무섭게 들려요" — 근거가 없다 → "pressure는 대화에서 blood pressure를 줄여 부르는 흔한 말이에요."

사소(바꾸면 좋음):
- 5.3 · why가 열만 설명한다 → 끝에 "숨참은 심장·폐 쪽 원인을 함께 거르려는 질문이에요"를 더한다.
- 3.1 · 둘째 문장 "먹기 전과 후를 비교해 묻는 습관이 좋아요"가 첫 문장을 되풀이한다 → "먹고 나서 심해지면 담낭·궤양 쪽을, 나아지면 십이지장 궤양을 떠올리기도 해요."
- 17.4 · "시간이 중요"를 두 번 쓴다 → 둘째 문장을 "천공은 대개 응급 수술로 막아요"로 바꾼다.

### 빈칸 (blank) (22)
정답이 둘(경계 포함):
- 20.1 · `fall`이 `ko` "사고로"에 맞음 → `crash*/surgery/procedure/injection`(`ko` "사고"가 거르고, 같은 분야에서 아픔의 원인으로 틀린 말). `fight`·`lift`도 함께 빠진다.
- 19.1 · `asking`(`I'm asking for the team`)은 "팀을 요청하다"로 `ko` "팀을 부를게요"에 가깝다 → `calling*/waiting/looking/charting`.

동떨어지거나 말이 안 되는 오답 → 같은 분야에서 틀린 말로:
- 16.0 · `longer/closer/faster` 비문(자기 보고 1) → 빈칸을 `concerns`로 옮긴다: `concerns*/reassures/relieves/surprises`(`ko` "걱정시켜요"가 거름). 또는 `worse` 그대로 `worse*/milder/better/lighter`.
- 1.3 · `longer/closer` 비문 → `worse*/better/milder/easier`(`Is the pain any easier?`는 실제로 하는 말이고 `ko` "더 심해졌나요"가 거름).
- 0.2 · `stop/shrink/fade anywhere else` 비문에 가까움 → `spread*/start/burn/ache`.
- 1.4 · `order/buy/cook`(장보기 말) → 빈칸을 `today`로 옮긴다: `today*/lately/this week/recently`(`ko` "오늘"이 거름. 현재완료와 모두 문법이 맞음).
- 2.0 · `step/turn/walk to exactly where`는 말이 안 됨 → 빈칸을 `exactly`로 옮긴다: `exactly*/roughly/about/generally`(`point to about where it hurts`는 실제 구어. `ko` "정확히"가 거름).
- 2.1 · `step back/look away/sit down`은 진찰과 상관없음 → `let go*/hold it/tap/push deeper`(같은 진찰 동작이고 `ko` "뗄 때"가 거름).
- 4.3 · `cooking/buying/ordering`(장보기 말) → `drinking*/skipping/craving/avoiding`.
- 6.2 · `moving/talking/bathing` → `eating*/smoking/walking/getting up`.
- 13.0 · `blame/judge`는 간호사가 할 리 없는 뒤집기 → `understand*/measure/treat/ease`.
- 13.1 · `drinks/exercises/foods have you taken`(비문·동떨어짐) → `medications*/tests/scans/X-rays`.
- 13.4 · `warm/busy/cold` 동떨어짐 → `safe*/calm/comfortable/informed`(`ko` "안전하게"가 거름).
- 15.0 · `itching/tickling/freezing`은 통증 성질이 아님 → `tearing*/burning/cramping/aching`(`sharp`는 "찢어지는"과 가까우니 넣지 말 것).
- 20.3 · `weight/height/age`는 심각도와 상관없음 → `pulse*/temperature/oxygen/sugar`.

돌려쓰기(`itching/itchy` 11문장: 3.2·3.3·4.4·7.1·9.3·11.0·11.3·14.1·15.0·17.0·18.0) → 3.3·4.4·11.0·18.0(담즙정체 가려움은 실제 증상)만 두고 나머지를 바꾼다(15.0은 위에서 고침):
- 3.2 · `itching` → `fever`(`ko` "식은땀"이 거름).
- 7.1 · `itching` → `nausea`.
- 9.3 · `bruising/itching` → `nausea/vomiting`.
- 11.3 · `itchy` → `sleepy`(`tired`는 "힘이 없으셨나요"와 겹치니 넣지 말 것).
- 14.1 · `itching/coughing/sneezing` → `fever/bleeding/swelling`.
- 17.0 · `itchy/pale` → `swollen/tender`.
- 11.1 · `sneeze/cough`(재채기는 동떨어짐) → `faint*/vomit/choke/shake`(`fall`은 "쓰러질"과 겹치니 넣지 말 것).

급하지 않은 것(같은 갈래, 바꾸면 좋음):
- `cough` 7문장, `rash` 4문장, 부를 사람 `pharmacist/chaplain/dentist/dietitian` 묶음(2.4·12.0·15.2·17.2)을 돌려쓴다.
- 2.2 `cook`, 3.4 `said`, 8.0 `allergies`(복부 알레르기), 9.4 `scan`, 7.2 `without`, 12.3 `voice/ear`, 14.4 `hurts/changes/helps a lot`, 15.1 `although/unless/until`(접속사로 걸러짐), 4.0과 10.0의 `first/normal/next` 돌려쓰기.
- 12.4 `sounds/tastes/smells`는 감각 동사 묶음이다(chest-abd-trauma에서 약하다고 본 갈래).

### decoy (2, +경계선 7)
`ko`에 맞는 다른 문장이 되는 것:
- 2.1 · `your belly` → I2 `Does it hurt more when I press your belly or when I let go?`가 `ko` "누를 때와 뗄 때 중 언제 더 아픈가요?"에 그대로 맞음 → `when you cough`.
- 15.2 · `for you` → I3 `We're calling the surgeon and preparing blood for you right now.`가 `ko`와 같음(`for you`는 한국어에 숨어 있는 말) → `for tomorrow`.

경계선(보고만, 고쳐도 됨). 끝에 붙이면 자연스러운 응급실 문장이 되고, 덧붙은 말이 `ko`에 없을 뿐인 것들이다.
- 3.1 `than before`: `Does it get better or worse after you eat than before?` — 영어가 조금 어색하지만 뜻은 `ko`와 같음 → `at night` 권장.
- 4.4 `after you eat`
- 12.1·12.3 `on the paper`: 언어 장벽 장면에서 신체 그림을 가리키는 것은 실제로 하는 일이다. 같은 상황에 두 번 쓴다.
- 1.4 `in the waiting room`
- 17.1 `in the hallway`
- 20.2 `for the OR`
- 0.1 `right now`

### distractorsKo (1, +경계선 1)
- 6.3 [1] · "술을 얼마나 드셨나요?"가 정답 "…그 전에 술을 드셨나요?"와 반만 다름 → "구토는 몇 번 하셨어요?"

경계선(보고만): 11.4 [1] "초음파실에서 곧 부를 거예요"(정답 "긴급 혈액검사와 초음파가 필요해요"와 초음파가 겹침).
돌려쓰기(사소): "열이 있었나요?"(3.2·5.1·7.0·9.0·17.0), "지금 통증이 몇 점인가요?"(0.3·1.1·1.4·6.3), "가스는 나오나요?"(4.0·8.0·8.3).

### order (17장, +약한 것 1)
고친 뒤 인접 교환 세 가지를 다시 돌려 볼 것. 15단어를 넘는 줄(S1 L4·S2 L2·S2 L4·S3 L3·S4 L4·S6 L4·S7 L4·S8 L2·S8 L4·S14 L4·S15 L2·S17 L3)은 아래 안에서 모두 15단어 안으로 줄였다.

- S6 · 수액·진통제가 금식 때문(심각 1), 2↔3 열림 → L3 `With pain like that after drinking, we'll keep you from eating or drinking for now.`(`after drinking`이 L2를 받음) / L4 `With no food or drink, IV fluids and pain medicine are your main treatment.`; why "통증 방향을 묻고, 시작과 음주를 확인하고, 그 양상 때문에 금식을 안내한 뒤, 금식 중 치료의 중심이 수액과 진통제라고 알려요."
- S1 · 섭취 확인이 조건부(심각 2) → L1 그대로 / L2 `While I do, how bad is the pain from zero to ten?`(`While I do`가 L1의 측정을 받음. 측정하면서 묻는 것이라 미루는 것이 없음) / L3 `Is that number any higher than it was an hour ago?` / L4 `Whichever way it's changed, I also need to know when you last ate.`; why를 맞춰 고친다.
- S12 · 통역사가 있는데 끄덕임으로 문진(심각 3) → L1 그대로 / L2 `Until they connect, can you point to where it hurts the most?` / L3 `When I press that spot, nod if it hurts, shake your head if not.` / L4 `Once the interpreter is on, tell them if anything feels new or different.`; why "통역사를 부르고, 연결 전까지는 가리키기와 끄덕임으로 받고, 연결되면 통역사를 통해 말하게 해요."
- S17 · 자세 이유가 대기(심각 4), 19단어, 3↔4 열림, 환자에게 SBAR → L2 `Because of that sign, I'm calling the surgeon right now.` / L3 `Until they come, lie as still as you can — moving makes it hurt more.` / L4 `When they see you, they may need to operate as soon as possible.`(`they`가 L2·L3의 외과를 받고, 시간 순서가 3↔4를 잠금); why를 맞춰 고친다.
- S2 · 가장 아픈 곳부터 누름(심각 5), 16·19단어 → L2 `I'll start away from that spot — tell me if letting go hurts more than pressing.` / L4 `Because of those findings, nothing to eat or drink until the surgeon sees you.`; why에 "가리킨 곳에서 먼 데부터 누르고"를 넣는다.
- S14 · 재측정이 조건부, L4가 앞뒤가 안 이어짐(심각 6) → L3 `Whatever you feel, let me recheck your vital signs to be safe.` / L4 `Even a small change in them matters, so I'll keep checking often.`(`them`이 L3의 활력을 받음); why를 맞춰 고친다.
- S18 · L3 비문(심각 7) → L3 `With that and your fever, we'll start antibiotics right away for the infection.`(`that`이 L2의 황달을 받음); `ko` "그것과 열을 보면 감염이라 바로 항생제를 시작할게요".
- S15 · L2 16단어, L3·L4 억지(자기 보고 2) → L2 `Along with that pain, have you ever felt a pulsing lump in your belly?` / L3 `With pain like that and your pressure this low, this could be very serious.` / L4 `That's why we're calling the surgeon and getting blood ready right now.`; why를 맞춰 고친다.
- S20 · L4 `Because that could be serious` 억지, 혈액 준비를 조건에 건다 → L4 `In case those show bleeding, we're getting blood ready for a transfusion.`(`those`가 L3의 검사와 활력을 받음. 대비라는 뜻은 20.2 `in case`와 같음).
- S19 · L2 `Because of that, stay with me` 억지, 3↔4가 약하게 열림(`Whatever they do`는 L2 뒤에도 붙음) → L2 `I'm calling for the team right now — stay with me.` / L4 `Even with those fluids, tell me right away if you feel any worse.`(`those fluids`가 L3을 받음).
- S5 · L3 `Apart from your shoulder,` 억지 → L2 `Since that meal, has it spread to your back or right shoulder?` / L3 `To find where it starts, does pressing here hurt as you breathe in?` (`where it starts`가 L2의 퍼짐과 짝을 이룸, 13단어); why를 맞춰 고친다.
- S8 · L3 억지, L2 17·L4 18단어 → L2 `Since that surgery, have you been able to pass gas or have a bowel movement?` / L3 `With your bowels stopped like that, how many times have you vomited today?` / L4 `With all of that, a tube through your nose may relieve the pressure.`
- S11 · L4 `That check means…` 억지 → L4 `Along with that test, we need urgent blood work and an ultrasound right now.`(`that test`가 L3의 임신 확인을 받음).
- S3 · L3 18단어, 2↔3 열림(L4 `those symptoms`가 두 줄 위 L3에도 닿음) → L3 `Whether or not food changes it, any chest pain, sweating, or shortness of breath?`(`food changes it`이 L2를 받음); 심장 원인을 거른다는 이유는 why로 옮긴다.
- S4 · 2↔3 열림(`Since then`·`In that time`이 모두 L1을 가리킴), L4 17단어 → L2 `Since then, has your belly felt swollen or tight?` / L3 `With that swelling, are you passing any gas at all?` / L4 `To find the cause of all that, what have you eaten and drunk this week?`; note·why 순서를 맞춘다.
- S7 · 2↔3 열림(`Besides the pain`이 어디에도 붙음), L4 16단어 → L3 `Besides that movement pain, have you had fever, chills, or a change in stools?` / L4 `With those symptoms, you may need to drink contrast before the CT.`
- S9 · 3↔4 열림(L4 → L3 `with those symptoms`가 L2를 그대로 받음) → L4 `Since fever can mean a kidney infection, we'll send your urine for a culture.`(열은 L3에서 처음 나와 3↔4가 잠김). 소변 배양은 신우신염이 의심되면 열과 상관없이 보내니, why에는 "열까지 있으면 콩팥 감염을 더 의심해요"로만 쓴다.

약한 것(바꾸면 좋음):
- S13 · L2 `To understand it`가 L1의 `understand`를 되풀이함(파일럿 3) → `So, what medications have you taken for this already?`(`So`는 1·2줄 고정에 허용).

통과: S0, S10, S16.

### context (2, +사소 2)
- S14 VS · 인계 장면에 `VS`를 끼움 → `word: recheck`, `ko: 다시 재다`. 인계 장면을 base `Please recheck her vital signs every fifteen minutes.`로 되돌린다(자기 보고 3).
- S12 point · fix의 `I'll look at you while the interpreter helps`는 하지 않는 말 → fix `Can you show me with one finger where it hurts the most?`(환자를 보며. 장면0과 겹치지 않게). 장면0의 앞 문장은 선택으로 바꾼다(자기 보고 3).

사소:
- S7 PO · 통화 장면 `She's finished drinking the PO contrast…` → `She's finished her PO contrast for the CT.`
- S5 Murphy's sign · XX는 검사 **결과**를 환자에게 이름으로 전하는 장면인데, why는 "무엇을 할지 말해 줘야 협조를 얻어요"(검사 **전** 안내)라고 한다 → "Murphy's sign은 진찰 소견의 이름이에요. 환자에게는 결과도 이름 대신 무엇을 느꼈는지(숨을 들이쉴 때 누르면 아픈 것)로 말해요."

swap `ko` 11건(S1·S3·S4·S6·S8·S9·S11·S13·S17·S18·S20): 모두 정답을 넣은 문장의 뜻이고, 이어 읽으면 문법도 맞다. 고칠 것 없음.

### tag·icon (사소 1)
- 18.2 · ERCP는 수술이 아니라 내시경 시술이다 → `scalpel` 대신 `hospital`. 태그 95가지는 보고만(위 6).

## 결정 11 (v44 문장·청크 — 보고만, 이번 범위 밖)
- 16.0 `ko` "그게 저희를 걱정시켜요"는 번역투다 → "그래서 걱정이 돼요".
- 17.2 `I'm calling the surgeon now with an SBAR report.` — 환자에게 보고 틀의 이름(SBAR)을 말하는 것은 어색하다. why "환자 앞에서 보고한다고 알리면"도 이 문장을 본보기로 삼는다.
- 17.1 `keep you flat and still` — 복막염 환자는 무릎을 굽힌 자세를 편해하는 경우가 많다. 반드시 똑바로 눕힐 일은 아니다(`still`이 핵심).
- 15.0 `in quality`는 의료진 말투인데 환자에게 하는 문장이다(`Does the pain feel tearing or ripping?`가 자연스러움).
- 5.3과 17.3은 같은 문장이다(`Have you had a fever or felt short of breath with this pain?`). 상황이 달라 둬도 된다.
- 1.1·1.4·2.2는 마지막 섭취를 묻는 비슷한 문장 셋이고, 0.1·2.0·12.1은 가리키기·보여 주기 문장 셋이다(사소).
- W13 단어 오답 5건: `past`↔`paste`, `tube`↔`tub`, `tap`↔`tape`, `severe`↔`sever`, `bile`↔`bill` — 철자 대비를 의도한 것일 수 있으니 확인만.

## 고칠 것 개수
- why 6 · 빈칸 22 · decoy 2(+경계선 7) · distractorsKo 1(+경계선 1) · order 17장(+약한 것 1) · context 2 · tag·icon 1 — **합계 51건**(경계선·사소·결정 11 제외).

## 종합
v44 필드는 base와 같다(context 장면 정비만 예외). distractorsKo·decoy·context는 ER 앞 주제들보다 단단하다.
고칠 것의 중심은 order 17장이다. 특히 S6 수액의 인과, S1 조건부 섭취 확인, S12 통역 중 끄덕임 문진, S17 대기 때문의 안정, S2 아픈 곳부터 촉진이 있고, "때문에"식으로 억지로 묶은 줄 7개와 15단어 넘는 줄 12개도 있다.
여기에 빈칸의 동떨어진·비문 오답 약 13문장과 20.1 `fall`이 있다. 이것들과 why 2건(6.2·16.1)을 고치고 order 인접 교환을 다시 돌려 보면 내보내도 된다.
