# or-bleeding — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `or-bleeding.yaml`(A·B 합본). 단어 131(base 140, 9 삭제·0 추가), 상황 21(문장 105), 뉘앙스 42(slider 17 · swap 12 · context 9 · pair 4).
비교: base·changes(39건: word-remove 9 · word ko 6 · word en 1 · sentence words 23 — 문장 en·ko·chunks 변경 없음)·in-json·notes-A·notes-B.
검사 `verify_one_theme.py or` 통과. 임시 스크립트(스크래치패드): `rv_or-bleeding_words.py`·`rv_or-bleeding_sents.py`·`rv_or-bleeding_nuance.py`(pair 전 조합·swap 이어 붙이기·context word 포함 여부)·`rv_or-bleeding_chunkcheck.py`(아래 청크 대안 전부 V5 이음·V8 개수·V9 끝말을 `verify_lesson_content`로 확인).
번호는 "상황.문장"(둘 다 0부터). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

**업무범위 판정 기준(전 항목에 같게 적용):** 지혈 방법·혈액제제 주문·수혈·MTP 발동·손상통제·승압제는 집도의·마취과가 **정함**. 순환 간호사는 EBL·흡인통·거즈 무게 **보고**, 혈액은행 **연락**·혈액 가져오기, 지혈제·장비·흡인·가온기·신속 주입기 **준비**, 도움 **호출**, MTP·손상통제 **요청·제안**. "Let's"로 팀 전체를 가리키는 일반 제안(13.2 address both)은 허용, 간호사가 1인칭으로 결정·시술하는 말(I'm pushing / Let's clamp / Let's order)은 고침. 말초 정맥로 삽입은 미국에서 RN 업무범위 안이라 그 자체로는 범위 위반이 아님. **가르는 선:** 처방·시술·결정의 대상이 구체적으로 이름 붙은 것(order FFP · clamp that vessel · push pressors · shift to damage control)이면 간호사의 결정 말로 고치고, 방향만 정하는 일반 제안(address both · treat both possibilities · open another line and call for blood)은 팀의 말로 유지.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 철자·소리·같은 분야 오답이 고름(hypotensive형: hemolytic/hemorrhagic, neuropathy/nephropathy, cell sorter/counter). 폭력어 `kill`★, 장례어 `crypt`★, 품사 다름 `locate`★ |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과(스크립트). 정답 둘 없음. w-unit `용량(검사 수치)` 뜻이 뒤섞임, w-order ko를 고치면 dKo 길이가 깨짐(같이 고칠 것) |
| 3 cue | 3 | 정답 영어 노출 없음. 그러나 장면 없이 ko를 풀어 쓴 사전 뜻풀이가 많음(12개 고침), w-ratio `두 수 사이의 비 — 1대 1대 1` 자체 모순, w-drop `갑자기`가 w-crash와 겹침 |
| 4 chips/decoyChips | 4 | decoyChips에는 비속어·불쾌·술·장례·성적·무기·민족 비하 조각 없음(전수). 그러나 정답 chips w-margin `mar`+`gin`(술 이름)이 걸림 → W15. `ICE`(ICU)·`cow`(cautery)·`crass`·`shaft`는 일반어로 판단해 유지. 형태소 자르기 대체로 의미 있음 |
| 5 사실·업무범위 | 3 | 뉘앙스 why는 대체로 맞음. 문장: 간호사가 클램프(4.4)·FFP 주문(8.4)·승압제(16.3)·손상통제 결정(19.3)을 1인칭으로, 프라이밍 후 곧바로 반환(12.3, 순서 틀림). 뉘앙스: slider 10 "굵기를 bore로 말한다"(게이지가 맞음), slider 11 scalding→화상만(용혈 빠짐), swap 20 "기록은 나중에" |
| 6 뉘앙스 설계 | 2 | **pair 4개 중 3개가 정답 둘**(return the cooler·damage to the OR / correct the blood bank / capillary level). slider cue가 답을 흘림 4개(open·warmer·holding·"lightest step first"), slider 13 `surely surgical` 부자연. context fix 2개가 과한 안심, 4.1 fix는 간호사가 지혈한다는 말 |
| 7 결정 11 | 4 | 쉬운 단어 9개 삭제·ko 가르기 5개는 타당. 놓친 것: w-fast·w-second(쉬움, 형제 주제 massive-transfusion은 fast를 뺌), w-order ko `처방`, 약어 ko에 정답(EBL·FFP·INR), w-set이 7.2 `sets up`(굳다)에 태그, w-arrest ko가 명사인데 문장은 동사, w-closure ko를 폐쇄로 바꾸고 문장 ko는 `봉합` 그대로, `당신을 위해`·`그의/그를` 번역투 |

## 사실 오류·심각한 문제
1. **[안전·범위] 4.4 "Let's clamp that vessel before it gets worse."** — 혈관을 클램프로 잡는 것은 집도의의 멸균 필드 안 시술. 간호사가 "잡읍시다"라고 결정하는 말로 가르치면 안 됨. 게다가 w-clamp는 명사(클램프)인데 이 문장만 동사 → S1.
2. **[안전·범위] slider 5.0 cue "Anesthesia asks how the fluids are running. You open the clamp fully…"** — 마취 중 수액 속도는 마취과가 정함. 간호사가 조절기를 끝까지 여는 장면을 정답 근거로 가르침(과다 수액 위험). cue에 정답 `open`·오답 `running`도 들어 있음 → N4.
3. **[설계] pair 3개 정답 둘** — 19.0 `return the cooler`(MTP 쿨러를 혈액은행에 반납하는 실제 행동)·`damage the cooler`·`damage to the OR`·`return control`, 17.0 `correct the blood bank`, 14.0 `capillary level`("at the capillary level") → N1~N3.
4. **[범위] 8.4 "Let's order FFP now…"·16.3 "We're pushing pressors…"·19.3 "We'll shift to damage control…"** — 혈액제제 주문·승압제 투여·손상통제 전환을 간호사의 결정·행위로 → S2·S4·S5.
5. **[사실] 12.3 "Once it's primed, we'll return the red cells to him."** — 프라이밍은 수집 **전** 준비. 반환은 수집·세척(처리)이 끝난 뒤 → S6.
6. **[사실] slider 10.0 why "카테터는 굵기를 bore로 말해요"** — 미국에서 IV 카테터 굵기는 게이지(gauge)로 말함(숫자가 작을수록 굵음). large-bore는 굵은 것(대개 16~18G 이상)을 통틀어 부르는 묘사어 → N9.
7. **[약속] context 0.1 fix "She has lost a little blood"(EBL 400 mL)·context 19.1 fix "…save his life"** — 보호자에게 과한 안심·결과 단정 → N10·N12.

## 저작자가 짚은 것 — 판정
| 짚은 것 | 판정 |
|---|---|
| 클램프 거는 말 4.4(KP 아님) | **고침** → S1. 4.2 KP "Do you want a clamp or cautery for that?"는 묻는 말이라 문제없음 |
| FFP 주문 8.1(KP) | en은 **유지 권고**(간호사가 의사에게 주문 여부를 묻는 말 — 범위 안). ko `처방할까요`만 `주문할까요`로 → S7a |
| FFP 주문 8.4(KP 아님) | **고침** → S2 |
| ko "처방" → "주문" | **타당.** 문장 ko 8.1·8.4, w-order ko, exKo 3개, order 8 ko 2줄, 8.1 tag `처방 제안` 모두 → S7a·W4 |
| 대량수혈 프로토콜 발동 18.0(KP) | **사용자 결정** → K1. 실제로는 의사가 정하면 순환 간호사가 혈액은행에 전화해 "MTP 발동"을 알리는 일이 많아 "I'm activating"이 틀린 말은 아니나, 결정 주체가 흐려짐. 18.4 "as we activate the protocol"(팀)은 유지 |
| 손상통제 전환 19.0(KP)·19.3·19.2(KP) | 19.3 **고침** → S5. 19.0은 K4. 19.2 "Plan to get him to ICU…"는 계획 공유(전달)라 유지 |
| 승압제 투여 16.0(KP)·16.3 | 16.3 **고침** → S4. 16.0은 K2(context 16.1이 이미 같은 말을 `마취과 → 순환 간호사`로 씀) |
| 라인 삽입 5.4·10.3 | 말초 정맥로 삽입은 RN 업무범위라 **범위 위반은 아님.** 5.4 "I can place a second line if anesthesia wants one."은 마취과 요청이 조건이라 **유지**(chunks만 S8). 10.3은 KP 10.0 "I'll grab a large-bore catheter **for you**"(마취과가 놓음)와 바로 모순이라 **고침** → S3 |
| 진단성 표현 9.1·14.1(KP)·13.3·17.0(KP) | 9.1 "These look like…"·14.1 "That suggests…"는 이미 완곡 → **유지.** 다만 14.1 ko `…저하되고 있다는 뜻이에요`는 en보다 단정적 → S7g. 13.3 "This looks like surgical bleeding…"은 관찰에 근거한 완곡 표현이라 유지(B가 why에 "최종 판단은 집도의"). 17.0 "He's coagulopathic — I need…"은 K3 |
| 13.4 "Let's treat both possibilities…"·13.2 KP | 13.2 KP와 같은 팀 제안이라 **유지**(chunks만 S8) |
| 가온 수액기 → 수액 가온기 | **타당** → S7d |
| "Hold pressure while it sets up."·"Dry weight subtracted… 150 mL" | **유지 동의**(1 g ≈ 1 mL 근사는 표준) |
| slider 17개 | **문제 아님.** 상황마다 STEP 1 문항이 정확히 하나(slider 17 + pair 4 = 21)이고, 지시서도 유일한 pair가 어려우면 slider로 가라고 함. 오히려 pair 4개 중 3개가 정답 둘 → N1~N3. 같은 저울 두 번(9.0 dipping…crashing / 16.0 dipped…crashed)은 권장 R9 |
| 1:1:1 비율 cue(w-ratio) | **1:1:1 자체는 사실**(PROPPR 이후 흔한 MTP 목표 비율). 다만 cue `두 수 사이의 비`가 세 수 예시와 모순, "흔히"로 단정을 낮출 것 → W8 |
| 22게이지(slider 10.0 cue) | **맞음** — 22G는 가는 관이라 빠른 수혈에 부족. 틀린 것은 why의 "bore로 말해요" → N9 |
| (B) 오답 틀·빈칸·decoy | B 검토 몫 |

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en을 바꾸면 `chunks`·`ko`·`words`를 함께 바꾸고, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 같은 문장을 쓰는 order 줄·단어 example/exKo도 맞추고, `changes-or-bleeding.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 그 문장의 **distractorsKo 둘을 새 ko 틀에 맞춰 다시** 쓰세요. 아래 chunks는 전부 V5·V8·V9 통과를 스크립트로 확인함.

- **S1 [안전·범위] 4.4** · en `I'll have a clamp ready for that vessel.` · chunks `I'll have / a clamp / ready / for that vessel / .` · ko `그 혈관에 쓸 클램프를 준비해 둘게요.` · words `[w-clamp, w-vessel, w-ready]`(상황 4는 w-fast를 빼도 9). v46 새로(지금 blank `clamp`는 동사 자리라 그대로 못 씀, distractorsKo `…클램프로 잡으려고…` 교체). **w-vessel example/exKo** → 새 문장으로. **order 4 넷째 줄** `Whichever you choose, let's control that vessel before it gets worse.` → `Whichever you choose, I'll have it ready right away.`
- **S2 [범위] 8.4** · en `Once FFP is ordered, I'll call the blood bank.` · chunks `Once FFP / is ordered / , I'll call / the blood bank / .` · ko `FFP 주문이 들어가면 혈액은행에 전화할게요.` · words 그대로 `[w-order, w-ffp, w-call, w-bloodbank]`. v46 새로(dKo 둘 다 `처방` 들어 있음).
- **S3 [모순] 10.3** · en `Do you want the large-bore catheter placed in his other arm?` · chunks `Do you want / the large-bore catheter / placed / in his other arm / ?` · ko `대구경 카테터를 다른 쪽 팔에 놓으시겠어요?` · words 그대로 `[w-place, w-largebore, w-catheter]`. v46 새로(blank `other`·dKo `지혈대를 맬게요` 교체). **order 10 둘째 줄** `Once I have it, I'll place it in his other arm.` → `Here it is — ready for his other arm.`(질문으로 바꾸면 셋째 줄 "Second line is in…"이 '예'를 전제함)
- **S4 [범위] 16.3** · en `Pressors are going in, and volume is running at the same time.` · chunks `Pressors / are going in / , and volume is running / at the same time / .` · ko `승압제가 들어가고 있고, 동시에 수액도 들어가고 있어요.` · words `[w-pressor, w-volume, w-run]`(w-push는 16.0 KP에 남음, 상황 16은 12). 누가 투여하는지 말하지 않는 상태 보고라 K2를 바꾸든 말든 16.0과 겹치지 않음. v46 새로(blank `pushing` 교체).
- **S5 [범위] 19.3** · en `We may need to shift to damage control if we can't get control here.` · chunks `We may need / to shift / to damage control / if we can't get control here / .` · ko `여기서 지혈이 안 되면 손상통제로 전환해야 할 수도 있어요.` · words 그대로 `[w-shift, w-damagecontrol, w-control]`. 결정이 아니라 준비를 위한 예상이라 K4(질문형)를 받아들여도 겹치지 않음. v46 새로(blank `if`는 가르치는 말이 아님 — `shift` 등으로). **order 19 첫 줄** `If we can't get control here, we'll shift to damage control.` → `If we can't get control here, we may need to shift to damage control.`(평서문 유지 — 둘째 줄 "In that case…"가 그대로 이어지고 '예'를 전제하지 않음)
- **S6 [사실] 12.3** · en `Once the red cells are washed, we'll return them to him.` · chunks `Once the red cells / are washed / , we'll return them / to him / .` · ko `세척이 끝나면 적혈구를 환자에게 돌려줄게요.` · words `[w-return, w-redcell]`(w-prime은 12.0 KP에 남음, 상황 12는 9). v46 새로(blank `primed`·dKo `프라이밍은…` 교체).
- **S7 [ko — 결정 11, KP는 ko만]** 각 문장 distractorsKo 둘을 새 ko 틀로 다시 쓰고, 같은 ko를 쓰는 exKo·order 줄 ko도 맞출 것.
  - a. 8.1(KP) `지금 FFP와 혈소판을 처방할까요?` → `지금 FFP와 혈소판을 주문할까요?` · 연쇄: w-ffp·w-platelet·w-order exKo, order 8 셋째 줄 ko `지금 FFP와 혈소판을 주문할까요`, 넷째 줄 ko `주문되면 제제 준비를 위해 혈액은행에 전화할게요`, 8.1 tag `처방 제안` → `주문 제안`
  - b. 10.0(KP) `당신을 위해 대구경 카테터를 가져올게요.` → `대구경 카테터를 가져다 드릴게요.` · 연쇄: w-grab·w-largebore·w-catheter exKo
  - c. 3.4 `당신을 위해 여분의 클립과 결찰사를 손 닿는 곳에 둘게요.` → `여분의 클립과 결찰사를 손 닿는 곳에 놓아 드릴게요.`(dKo 둘 다 `당신을 위해` 들어 있음)
  - d. 11.0(KP) `지금 가온 수액기를 설치하고 있어요.` → `지금 수액 가온기를 설치하고 있어요.` · 연쇄: w-warmer exKo
  - e. 12.1(KP) `그의 적혈구를 회수해서 돌려줄 수 있어요.` → `환자 본인의 적혈구를 회수해서 돌려줄 수 있어요.` · 연쇄: w-salvage·w-return·w-redcell exKo, order 12 넷째 줄 ko `그게 끝나면 환자 본인의 적혈구를 돌려줄 수 있어요`
  - f. 19.2(KP) `그를 중환자실로 보내…` → `환자를 중환자실로 보내 소생시킨 뒤 다시 데려올 계획이에요.` · 연쇄: w-icu·w-resuscitate exKo
  - g. 14.1(KP) `그건 관류가 저하되고 있다는 뜻이에요.`(suggests보다 단정) → `관류가 저하되고 있다는 신호일 수 있어요.`
  - h. 14.0(KP) `소변량이 시간당 30 이하로 떨어졌어요.` → `소변량이 시간당 30 미만으로 떨어졌어요.`(under = 미만)
  - i. 19.1(KP) `패킹과 임시 봉합을 준비해 뒀어요.` → `패킹과 임시 폐쇄 물품을 준비해 뒀어요.`, 19.4 `패킹하기 전에 임시 봉합을 준비해 둘게요.` → `패킹하기 전에 임시 폐쇄 물품을 준비해 둘게요.` — 저작자가 w-closure ko를 `폐쇄`로 고친 이유(임시 폐복은 봉합이 아님)와 맞춤. 연쇄: w-temporary·w-closure exKo, order 19 둘째 줄 ko, dKo 4개(`임시 봉합` 들어 있음)
- **S8 [chunks — 구 경계를 끊은 조각, en 그대로]** 바뀐 조각에 걸린 decoy는 B가 다시 확인.
  - 5.4 `if anesthesia wants / one`(동사·목적어) → `I can place / a second line / if / anesthesia wants one / .`
  - 10.4 `once the line's / in` → `Let's hook up / the rapid infuser / once / the line's in / .`
  - 11.3 `at body / temperature`(복합명사) → `The warmer / keeps / all his fluids / at body temperature / .`
  - 13.3 `like surgical / bleeding`(명사구) → `This looks / like surgical bleeding / , not a coagulopathy / .`
  - 13.4 `Let's treat both / possibilities`(명사구) → `Let's treat / both possibilities / until the coags / come back / .`
  - 14.3 `for the last / hour`(명사구) → `His urine output / has been / low / for the last hour / .`
- **판정만 — 고치지 않음:** 5.4(위), 9.4 "Let's open another line and call for blood now."(팀 제안, swap 9.1 정답과 같은 말 — notes에 "결정은 마취과·집도의"가 이미 있음), 13.3·13.4(위), 17.3 "We need to correct this coagulopathy fast."(팀), 17.4 "I'll call the blood bank for more platelets and cryo."(혈액은행 연락은 간호사 몫 — B가 why에 "주문에 따라"), 18.4(팀), 20.4 "Get the crash cart to the bedside…"(도움 호출).

## 고칠 것 — 뉘앙스
- **N1 [pair 19.0 · 정답 둘]** 전 12조합 중 `return the cooler`(쿨러 반납은 실제 일)·`damage the cooler`·`damage to the OR`·`return control`이 모두 영어로 성립. → pairs `[damage, control]`, `[abdominal, closure]`, `[packing, removal]`, decoys `[transfusion]`, words `[w-damagecontrol, w-closure, w-pack]`(w-pack은 19.1 `packing`). 12조합 확인: damage closure/removal/transfusion ✕, abdominal control/removal/transfusion ✕, packing control/closure/transfusion ✕. why `damage control은 목숨에 필요한 지혈만 먼저 하는 방식, abdominal closure는 배를 닫는 단계, packing removal은 중환자실에서 안정시킨 뒤 수술방으로 돌아와 넣어 둔 패킹을 빼는 단계예요.`
- **N2 [pair 17.0 · 정답 둘]** `correct the blood bank`("혈액은행의 잘못을 바로잡다")가 성립. → pairs `[correct, the coagulopathy]`, `[thaw, the plasma]`, `[achieve, hemostasis]`, decoys `[the stretcher]`, words `[w-correct, w-coagulopathy, w-hemostasis]`. 12조합 확인(correct the plasma/hemostasis/the stretcher ✕, thaw the coagulopathy/hemostasis/the stretcher ✕, achieve the coagulopathy/the plasma/the stretcher ✕). why `correct the coagulopathy는 응고 이상을 바로잡는다, thaw the plasma는 얼려 보관한 혈장(FFP)을 혈액은행이 녹인다, achieve hemostasis는 출혈을 멎게 한다는 뜻이에요.`
- **N3 [pair 14.0 · 정답 둘]** `capillary level`("at the capillary level")이 성립(`urine level`도 애매). → pairs `[urine, output]`, `[capillary, refill]`, `[lactate, is climbing]`, decoys `[the clock]`(또는 R6), words 그대로. 12조합 확인. why 끝 `…lactate is climbing은 젖산 수치가 오르고 있다는 말이에요.`(14.4 `it climbs`와 이어짐)
- **N4 [안전 · slider 5.0 cue]** 정답 `open`·오답 `running`이 cue에 있고, 간호사가 마취과 수액 조절기를 엶 → cue `Anesthesia rolls the clamp all the way up, and the bag empties as fast as the tubing allows.`
- **N5 [slider 11.0 cue·why]** cue의 `warmer`(정답 warm)와 `cold`(오답)가 답을 흘림 → cue `Refrigerated blood should reach about the patient's own body temperature before it goes in — no hotter.` · why `가온기의 목적은 냉장 혈액·수액을 체온 가까이로 데우는 거예요. cold면 저체온을 부르고, scalding처럼 지나치게 뜨거우면 적혈구가 깨지고(용혈) 혈관을 다칠 수 있어요. 그래서 warm이 목표예요.`
- **N6 [slider 13.0 · 부자연 영어]** `surely surgical`은 임상 영어에서 쓰지 않음(surely는 반어·수사 의문 느낌) → scale `[possibly surgical, likely surgical, definitely surgical]`, example `This is definitely a surgical bleeder.`, why의 surely → definitely.
- **N7 [slider 18.0 cue]** `You offer the lightest step first.`가 자리(0)를 알려 줌 → cue `Blood loss is above plan, but he is stable and no one has ordered blood products yet.`(주문 전이라 send for units·activate가 빠지고 범위도 가르침)
- **N8 [slider 3.0 cue]** `You're holding a clip`이 정답 `in your hand`를 흘림 → cue `The surgeon will ask for a clip any second, so it's already between your fingers.`
- **N9 [사실 · slider 10.0 why]** → `IV 카테터 굵기는 게이지(gauge)로 말하고 숫자가 작을수록 굵어요. 16~18게이지처럼 굵은 것을 통틀어 large-bore라고 해요. 22게이지 같은 가는 관은 혈액을 빨리 넣기에 부족해요.`
- **N10 [약속 · context 0.1 fix]** 400 mL를 `a little blood`로 → fix `She's lost about as much blood as we expected, and we're keeping a close eye on it.`
- **N11 [context 4.1 · 어색한 장면과 fix]** 어색함이 word(clamp)가 아니라 `it's pumping`(겁주는 내용)에서 오고, fix `I'm just stopping a small bleed`는 간호사가 지혈한다는 말+뿜는 출혈을 "small"로 축소. → 어색한 장면 en `The surgeon is clamping a bleeder, so hold still.` · fix `You may feel some pressure or tugging. The surgeon is taking care of some bleeding, so please stay still.` · why `clamp·bleeder는 수술팀끼리 기구와 출혈 부위를 부르는 말이라, 깨어 있는 환자에게는 무엇을 하는지 알 수 없고 무섭게 들려요. 환자에게는 느낄 감각과 지금 다루고 있다는 것만 쉽게 말해요.`
- **N12 [약속 · context 19.1 fix]** `…save his life`는 결과 단정(환자는 중환자실로 가는 위중 상태) → fix `The surgeon controlled the bleeding as much as is safe for now and will finish the surgery later, once he's more stable.`
- **N13 [context 6.1 · word 선택]** `alert`는 보호자도 아는 일반어이고 어색함은 `EBL`·`blood bank`에서 옴(형제 주제 massive-transfusion N1~N6과 같은 기준). → word `trend`, ko `추세를 보이다`, words `[w-trend]`. 장면: 순환 간호사 → 마취과(speech) `EBL is trending up — 500 in the last ten minutes.` ok / 수술 기록(board) `EBL trending up; blood bank notified at 10:42.` ok / 대기실 보호자에게(me) `His blood loss is trending up faster than expected.` ok:false · fix 그대로 · why `trending up은 수치 흐름을 읽어 주는 의료진의 보고 말투예요. 보호자에게는 그래프를 읽듯 들리고 무엇을 하고 있는지가 빠져요. 쉬운 말로 상태와 대비를 함께 말해 줘요.`
- **N14 [swap 9.1 ko]** ko가 바꾼 뒤쪽만 옮김 → `심박수는 계속 오르고 혈압은 떨어지니, 라인을 하나 더 열고 혈액을 요청합시다`
- **N15 [swap 7.1 who]** 비멸균인 순환 간호사가 필드 위 수술 보조에게 압박을 지시 → who `스크럽 간호사 → 수술 보조 · 지혈제 적용 중`
- **N16 [사실 · swap 20.1 notes]** `writing it down`: `기록은 나중에 한다`는 틀림(심정지 중 기록은 맡은 사람이 실시간으로) → `기록은 따로 맡은 사람이 그 자리에서 한다. 맥박이 없으면 먼저 압박부터 시작해야 한다.`

## 고칠 것 — 단어
- **W1 [폭력어 ★] w-keep distractorsEn `kill`** → `[seep, kneel]`(seep은 출혈 장면의 동사, 4/5자 통과)
- **W2 [장례어 ★] w-cryo distractorsEn `crypt`** → `[crit, crown]`(crit = 헤마토크릿 줄임말, 같은 분야)
- **W3 [품사 ★] w-lactate distractorsEn `locate`(동사)** → `[lactose, lactase]`
- **W4 [결정 11 · ko] w-order ko `처방(주문)하다`** → `주문하다` · dKo `[취소하다, 반납하다]`(지금 dKo는 새 ko와 길이 규칙 위반) · exKo는 S7a. changes에 word ko 기록.
- **W5 [결정 11 · 태그 뜻] w-set(세팅하다)이 7.2 KP `while it sets up`(굳다)에 태그** → 7.2 words `[w-hold, w-pressure]`(상황 7은 9), swap 7.1 words `[w-hold, w-pressure]`. changes에 sentence words 기록.
- **W6 [결정 11 · ko에 정답] 약어 ko** — 영어 고르기에서 ko가 답을 보여 줌(형제 주제 `산도(pH)`와 같은 처리). changes에 word ko 기록.
  - w-ebl ko `추정실혈량(EBL)` → `추정실혈량` · dKo `[추정수액량, 추정소변량]`
  - w-ffp ko `신선동결혈장(FFP)` → `신선동결혈장` · dKo `[농축적혈구, 알부민용액]`
  - w-inr ko `국제표준화비율(INR)` → `국제표준화비율` · dKo `[활성응고시간, 산소포화도]`
- **W7 [결정 11 · 품사] w-arrest ko `심정지`(명사)인데 두 문장 모두 동사(`about to arrest`·`he arrests`)** → ko `심정지가 오다` · dEn `[seize, assess]` · dKo `[경련이 오다, 열이 오르다]` · cue `출혈이 계속돼 혈압이 바닥나면 곧 닥치는 일 — 크래시카트를 침상 곁에 부르는 이유`
- **W8 [cue 모순] w-ratio** `두 수 사이의 비 — 예를 들어 1대 1대 1` → `대량수혈 쿨러에 적혈구·혈장·혈소판을 몇 대 몇으로 맞춰 담는지 — 흔히 1대 1대 1`
- **W9 [cue 겹침] w-drop** `수치가 갑자기 아래로 내려가는 일`(w-crash와 같음) → `출혈이 이어지면서 모니터의 혈압 숫자가 아래로 — 심박수는 반대로 오른다`
- **W10 [cue가 ko 되풀이] w-ebl** `'추정 실혈량'의 약어` → `흡인통 눈금과 거즈 무게를 더해 수술 중 계속 부르는 출혈량 — 세 글자 약어`
- **W11 [cue가 장면 없이 ko만 풀어 씀 — 11개]**
  - w-total → `흡인통과 거즈에서 나온 양을 모두 더해 마취과에 부르는 숫자`
  - w-ready → `소작기를 켜 두고 클립을 열어 두어, 달라고 하면 바로 건넬 수 있는`
  - w-steady → `출혈이 뿜지도 멎지도 않고 같은 속도로 계속 흐르는 모양`
  - w-temporary → `손상통제 때 배를 완전히 닫지 않고, 며칠 안에 다시 열 것을 전제로 하는`
  - w-collect → `세포회수기 저장고에 흡인한 피가 차오르게 하는 일`
  - w-return → `세포회수기로 씻은 적혈구를 환자 몸에 다시 넣어 주는 일`
  - w-shift → `지혈이 안 돼 집도의가 수술 방식을 손상통제로 바꾸는 일`
  - w-bedside → `크래시카트를 끌고 와 세워 두는, 수술대 바로 옆 자리`
  - w-early → `저혈량에서 혈압이 떨어지기 전, 심박수부터 오르는 첫 단계의`
  - w-count → `대량수혈 중 들어온 혈액 단위를 하나하나 세어 맞춘 숫자`
  - w-reach → `스크럽이 몸을 돌리지 않고 팔만 뻗어 클립을 집을 수 있는 거리`
- **W12 [dKo 뜻 뒤섞임] w-unit** `용량(검사 수치)` → `용량(투여량)`
- **W13 [결정 11 · 쉬운 단어] w-fast 삭제** — 간호사가 아는 말, 형제 주제 massive-transfusion도 뺌. 3.3·4.3·6.0(KP)·6.3·15.3·17.3 words에서 빼고 은행에서 지움(V3 최소: 상황 4가 8, S1 반영 시 9). changes에 word-remove·sentence words 기록.
- **W14 [결정 11 · 쉬운 단어] w-second 삭제** — 서수 "두 번째". 10.1(KP)·15.1(KP)·15.4 words에서 빼고 은행에서 지움(상황 10은 11, 상황 15는 W13과 함께 9).
- **W15 [술 조각] w-margin chips `[[mar, gin]]`** — `gin`이 술 이름 조각 → chips `[[marg, in]]` · decoyChips `[merg, en]`(V12 이음 margin 확인)

## 품사가 다른 distractorsEn 전수 (★ = 꼭 바꿀 것)
정답 품사는 은행 문장에서 쓰인 대로 판정.
| 단어 | 정답 품사(쓰임) | 오답 | 판정 |
|---|---|---|---|
| w-lactate lactate | 명사 | lactose(명사)·locate(동사) | ★ → W3 |
| w-arrest arrest | 동사(about to arrest, he arrests) — ko는 명사 | asthma·seizure(명사) | 헤드워드 ko와 문장 쓰임이 어긋남 → W7(ko·dEn 함께) |
| w-wide wide | 부사(wide open) | wild·white(형용사) | 권장 R1(wild는 "run wild"로 부사도 됨, white는 아님) |
| w-extra extra | 형용사 | exact(형용사)·expert(주로 명사) | 유지(expert도 형용사로 쓰임) |
| w-second second | 형용사(서수) | single·secret(형용사) | 유지(W14로 삭제되면 해당 없음) |
| w-set set | 형용사·동사(on and set / set up) | seat·send(동사) | 유지(ko `세팅하다` 동사 기준) |
| w-fast fast | 형용사 | fat·last(형용사) | 품사는 같음. `fat`은 W13 삭제로 해소(남긴다면 body-shaming 소지 → 교체) |
| w-capillary capillary | 명사(수식어 자리) | capital·capsule(명사) | 유지 |
| w-pressor pressor | 명사 | pressure·processor(명사) | 유지 |
| w-patent patent | 형용사 | potent(형용사)·patient(형용사로도 쓰이나 대개 명사로 읽힘) | 유지 — 소리가 닮은 최선의 오답 |
| w-field field | 명사 | yield·feed(주로 동사, 명사도 됨) | 유지 |
| w-product product | 명사 | produce(명사·동사)·project(명사) | 유지 |
| w-closure closure | 명사 | closer(명사·형용사 비교급)·exposure(명사) | 유지 |
그 밖의 118개는 단어마다 은행 문장 쓰임과 오답을 함께 출력해 한 줄씩 봄 — 품사 같음.

## decoyChips·오답 불쾌어 전수
decoyChips 전부·정답 chips 전부·distractorsEn 262개를 비속어·불쾌·술·장례·성적·무기·민족 비하 관점에서 봄(목록 대조 스크립트+눈). **distractorsEn `kill`(W1)·`crypt`(W2), 정답 chips `gin`(w-margin, W15) 교체.** decoyChips에는 해당 없음 — `ICE`(ICU 짝, 일반어), `cow`(cautery 짝, 동물), `crass`·`shaft`·`rat`·`grub`·`worm`·`tar`·`mess`는 일반어로 그 뜻으로 읽히지 않아 유지. `fat`(w-fast)은 W13으로 사라짐. `pleasure`(w-pressure)는 소리 닮은 일반어로 유지(형제 주제와 같은 판정).

## context 핸드오프 모양 (v46 7번) 전수
word가 세 장면 en 모두에 있음(9/9, 스크립트), word·ko 둘 다 있음(9/9). 어색한 장면은 모두 보호자·깨어 있는 환자이고 나머지 두 장면(의료진끼리·차트)과 듣는 사람이 다름.
| 상황 | word | 판정 |
|---|---|---|
| 0 EBL · 8 coags · 12 salvage · 14 perfusion · 16 pressor · 17 coagulopathic | 의료진 말 | 유지(0은 fix만 N10, 17 fix는 권장 R12) |
| 4 clamp | 맞으나 어색함이 내용(pumping)에서 오고 fix가 범위 밖 | 고침 N11 |
| 6 alert | 일반어 | 고침 N13 |
| 19 damage control | 맞음, fix 결과 단정 | 고침 N12 |
swap ko 12개 중 9.1만 문장 일부만 옮김(N14), 나머지 11개는 바꾼 문장 뜻과 맞음. swap 이어 붙인 문법 36조합 모두 문법 맞고 정답 하나(스크립트).

## 권장 (고치면 좋음 — 개수에 안 셈)
- **R1** w-wide dEn `[wild, white]` → 부사로 쓰이는 닮은 말(예 `[wildly, widely]`는 동의 위험 — 판단에 맡김)
- **R2** 음역 괄호 ko `응고검사(코악스)`·`수량(카운트)`·`동결침전제제(크라이오)` — 영어 고르기에서 소리가 답을 비춤. 수술실에서 실제로 그렇게 부르니 판단에 맡기되 `(코악스)`는 흔한 발음도 아님 → `응고검사` 권장
- **R3** w-catheter dKo `스탬프`(의료 밖 물건) → `배액관`
- **R4** w-anesthesia tag `수액·라인` → `출혈 보고`(또는 `일반 표현`)
- **R5** w-free ko `자유롭게`(직역) → `막힘없이`
- **R6** pair 7.0·14.0 decoy `the clock` — 오른쪽 중 관사가 붙은 것이 이것뿐이라 형태로 걸러짐 → 관사 없는 명사(`gown` 등, 조합 재확인)
- **R7** slider 0.0 why `단계를 나눠 불러요` — 표준 분류처럼 들림 → `…처럼 정도를 붙여 말해요`
- **R8** swap 2.1 notes `look at` — 눈대중으로도 숫자를 말하긴 함 → `눈대중은 실제보다 적거나 많게 잡기 쉽다`
- **R9** slider 9.0(dipping/dropping/crashing)·16.0(dipped/dropped/crashed) 같은 저울 두 번 — 9.0을 w-heartrate 저울(`up a little / climbing / racing`)로 바꾸는 것도 가능
- **R10** 2.2 KP ko `우리의 누적 EBL` → `누적 EBL`, 11.3 ko `체온으로 유지` → `체온 가까이로 유지`
- **R11** changes why 문구가 `너무 쉬움 — 너무 쉬움 — …`으로 겹침
- **R12** context 17.1 fix `clotting products` → `blood products that help him clot`

## B 몫으로 넘김 (개수에 안 셈)
- order 16: 첫 줄(KP "pushing pressors now" — 마취과의 말)과 넷째 줄 "I'll let anesthesia know…"(간호사의 말)의 화자가 어긋남.
- order 12 넷째 줄 "When that's done, we can return his own red cells." — 수집 뒤 세척 단계가 빠짐(S6과 같은 사실).
- 위 S1·S3·S5·S7a·S7e·S7i의 order 줄 연쇄는 이 목록에 적어 두었으니 B와 겹치지 않게 반영.

## 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)
KP en을 바꾸기로 하면 `in-or-bleeding.json`의 `keyPhrases` 같은 문자열도 함께 바꿔야 V4가 통과합니다. chunks·ko·words·v46 필드·example·order 줄 연쇄는 위 문장과 같음. 대안 chunks는 전부 스크립트로 확인.
- **K1 18.0** `I'm activating the massive transfusion protocol.` · 문제: 발동 결정은 집도의·마취과, 간호사는 혈액은행에 발동을 알리는 쪽 · 대안 `I'm calling the blood bank to activate the massive transfusion protocol.`(chunks `I'm calling / the blood bank / to activate / the massive transfusion protocol / .`, 단어 넷 그대로+call·blood bank) · **권고: 바꾸기**(결정이 내려진 뒤 간호사가 하는 실제 행동이 됨). 유지한다면 B가 why에 "집도의·마취과가 발동을 정하면 순환 간호사가 혈액은행에 알린다"를 넣을 것.
- **K2 16.0** `Pressure has crashed — pushing pressors now.` · 문제: 승압제 투여는 마취과(context 16.1도 `마취과 → 순환 간호사`로 씀) · 대안 `Pressure has crashed — anesthesia is pushing pressors now.`(chunks `Pressure has crashed / — anesthesia / is pushing pressors / now / .`) · **권고: 바꾸기.** 유지한다면 "간호사가 듣는 마취과의 말"로 why를 쓸 것. (S4 16.3은 투여자를 말하지 않는 상태 보고로 고쳐 두어 어느 쪽이든 겹치지 않음)
- **K3 17.0** `He's coagulopathic — I need FFP and platelets now.` · 문제: 진단+혈액제제 요구가 마취과의 말(context 17.1도 마취과 장면) · 대안 `He looks coagulopathic — do you want FFP and platelets now?`(chunks `He looks coagulopathic / — do you want / FFP and platelets / now / ?`) · **권고: 바꾸기(약하게)** — 8.1 KP와 비슷해지는 것이 단점. 유지해도 "듣는 말"로 why를 쓰면 됨.
- **K4 19.0** `Let's pack and shift to damage control.` · 문제: 손상통제 전환은 집도의 결정(context 19.1도 `집도의 → 수술팀`) · 대안 `Should we pack and shift to damage control?`(chunks `Should we pack / and shift / to damage control / ?`) · **권고: 바꾸기(약하게)** — S5와 같은 기준(S5는 평서 예상문이라 겹치지 않음). **주의:** 바꾸면 order 19 셋째 줄(지금 이 문장)을 질문으로 바꾸게 되는데 그러면 넷째 줄 "After that, the plan is…"가 '예'를 전제함 — 그 경우 셋째 줄은 B가 평서문으로 다시 쓸 것(예 `If so, I'll have packing ready to go.`).
- **K5 5.1** `I've got fluids running wide open if we need it.` · 문제: "필요하면"인데 이미 최대 속도로 흐르는 중이라는 말 — 뜻이 어긋나고 그대로면 과다 수액. order 5 둘째 줄은 이미 대안으로 씀 · 대안 `I've got fluids ready to run wide open if we need it.`(chunks `I've got fluids / ready to run / wide open / if we need it / .`) · **권고: 바꾸기.**
- **유지 권고:** 9.2 "I'm opening up the fluids and calling for blood."·16.1 "Volume wide open…"·20.2 "Keep the blood going wide open…"(마취과 지시에 따른 보조로 읽힘 — B가 why에 "마취과 지시에 따라"), 6.2 "…alert anesthesia…"(마취과 전문의가 다른 방을 함께 볼 때 부르는 것은 실제 일), 9.1·14.1(완곡), 13.2·17.2(팀 제안), 19.2(계획 전달), 20.0(도움 호출), 8.1(묻는 말 — ko만 S7a).
- **K6 KP chunks 구 경계(보고만 — 대안은 V8 조각 수를 지킴)**
  - 2.1 `that's about / 150 milliliters` → `Dry weight subtracted / , that's / about 150 milliliters / .`
  - 6.2 `and get / blood ready` → `Do you want me / to alert anesthesia / and get blood / ready / ?`
  - 7.1 `against the bleeding / surface` → `Let me / pack it / against the bleeding surface / .`
  - 7.2 `while it / sets up` → `Hold pressure / while / it sets up / .`
  - 12.1 `his own / red cells` → `We can / salvage / and return / his own red cells / .`
  - 15.1 `more / lap pads` → `Second suction / coming / , and I've got / more lap pads / .`
  - 16.1 `through both / lines` → `Volume / wide open / through both lines / and the warmer / .`
  - 18.0 `the massive transfusion / protocol` → `I'm / activating / the massive transfusion protocol / .`
  - 18.2 `I'll track units / in` → `I'll track / units in / and keep / the counts straight / .`
  - 20.0 `He's about / to arrest` → `He's / about to arrest / — crash cart / at the bedside / .`

## 개수
고칠 것 **64** — 문장 21(S1~S6 6 + ko S7a~i 9 + chunks S8 6), 뉘앙스 16(N1~N16), 단어 27(W1~W5 5 + W6 3 + W7~W10 4 + W11 11 + W12~W15 4). 그중 **안전 2**(S1 간호사 클램프, N4 간호사가 마취과 수액 조절기 개방). ★ 3(W1·W2·W3). 권장 12, KP 결정 5(+chunks 보고 10).

## 종합
지혈·출혈량 추정·혈액은행 연락의 바탕 사실은 탄탄하고 기계 검사도 통과. 그러나 pair 4개 중 3개가 정답 둘이고, 간호사가 결정·시술하는 문장 4개(클램프·FFP 주문·승압제·손상통제)와 프라이밍 순서 오류가 있음. 안전 2건·pair 3건·문장 S1~S6과 ★ 3건을 반영하면 내보내도 됨. KP 5건(K1~K5)은 사용자 결정.
