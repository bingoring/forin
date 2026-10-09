# er-geriatric v46 보강 검토

대상은 `er-geriatric.yaml`(21상황, 문장 129개, order 21장, context 12건, swap 9건)입니다. 문장 129개와 order 21장을 전부 스크립트로 뽑아 읽었습니다.
- 빈칸: 선택지 넷을 문장에 넣은 네 줄
- decoy: 청크 자리마다 바꿔 넣은 줄, 청크 사이·끝에 끼운 줄
- order: 인접 교환 세 가지(1↔2, 2↔3, 3↔4)

'정답이 둘'은 낱장 머리에 보이는 `ko`에도 맞는지를 기준으로 판정했습니다. context는 `review-ctx-A/B/C.md`와 같은 기준으로 봤습니다. 메모 "뜻은 셋 다 …"가 참인지, 어색함이 `word` 자체에 있는지, 차트 장면에 억지로 끼운 말이 없는지를 봤습니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 사실 관계는 대체로 맞고, 말하는 방식의 이유를 함께 줍니다. 다만 10.1·19.4·19.5는 base 문장의 사실 오류를 why에서 "실제로는 이렇게 하지 말라"로 덮었습니다. 19.5는 `moving`의 영어 뜻까지 바꿔 설명합니다. |
| 2 | 빈칸 | 2 | 장면과 동떨어진 오답이 약 60문장입니다(round/flat/rough, gardener/chef/janitor, taxes/rooms/bills). 비문으로 걸러지는 오답도 있습니다(`Has somewhere changed`, `Who did you first notice`, `You're busy to talk`). 0.4 `throw out`, 16.2 `raise the noise`처럼 하면 안 되는 처치를 그린 것도 있습니다. |
| 3 | `decoy` | 2 | 129개 중 124개가 시간·장소 부사구 틀입니다(in the morning 5, at the door·in the lab 각 4). `ko`에 그대로 맞는 문장이 되는 것 3건, 반대말 decoy 3건, 위험하거나 틀린 임상 그림 4건이 있습니다. |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이고, 위험한 처치를 그린 것은 없습니다. 정답과 반만 다른 것이 9건 있습니다. |
| 5 | `order` | 3 | 인접 교환이 자연스러운 카드가 11장(경미 3장 별도)입니다. 15단어를 넘는 줄이 6줄입니다. S7은 3번 줄이 앞 질문의 답을 '예'로 전제하고, S12는 태그라인(보청기를 집에 두고 옴)과 어긋납니다. |
| 6 | `tag`·`icon` | 4 | 짧고 상황 안에서 일관됩니다. 다만 `낙상 정황`·`위험약 확인`처럼 대화에서 하는 일보다 주제를 적은 태그가 많습니다(고칠 정도는 아님). 아이콘은 뜻과 맞습니다. |
| 7 | context·swap `ko` | 3 | swap `ko` 9건은 모두 맞습니다. context는 저작자가 정비한 5건 중 4건을 다시 고쳐야 합니다. 그중 2건은 같은 파일의 keyPhrase와 정면으로 어긋납니다. |
| 8 | 파일럿 갈래 | 2 | 갈래 2(동떨어진 오답)가 그대로 되풀이됐습니다. 갈래 3(순서를 못 박음)이 11장, 갈래 5(decoy가 `ko`에 맞는 문장이 됨)가 3건입니다. |

## 사실 오류·심각한 문제

1. **10.1(keyPhrase) "nothing leaves this room without your say"** — 노인 학대가 의심되면 미국 거의 모든 주가 의료인에게 성인보호서비스(APS) 신고를 의무로 정합니다. 그래서 이 문장은 지킬 수 없는 비밀 보장 약속입니다. why가 "비밀 보장은 약속하지 않고…"라고 써서, 학습자는 문장과 해설이 반대로 말하는 것을 봅니다. keyPhrase라 V4 때문에 결정 11로도 고칠 수 없으니 **사용자 결정**으로 올립니다(아래 J-1).
2. **19.4 "Drink some water to help stay hydrated before surgery."** — 수술을 기다리는 고관절 골절 환자에게 간호사가 물을 권하는 문장입니다. 금식(NPO) 지시는 마취팀이 정합니다. 맑은 물은 대개 마취 2시간 전까지 허용되지만(ASA), 지시를 확인하기 전에 권하면 안 됩니다. why의 "단, … 확인해요"는 문장과 반대입니다. keyPhrase가 아니라서 결정 11로 고칩니다(J-2).
3. **19.5 "Let's keep you moving and oriented while you wait."** — 수술 전 고관절 골절은 골절 부위를 고정하고 움직임을 제한합니다. why는 "moving은 … 눈과 손을 쓰도록 이끈다는 정도로 이해해요"라고 영어 뜻을 바꿔 설명합니다. 이는 틀린 해설입니다. 결정 11로 고칩니다(J-3).
4. **S11 context `start low`**: 환자 장면을 어색한 곳으로 둡니다. 그런데 같은 상황의 keyPhrase 11.0이 환자에게 "We'll start low and adjust carefully…"라고 말합니다. STEP 2에서 가르친 말을 뉘앙스에서 틀렸다고 하는 셈입니다. 차트의 `started low`도 억지로 끼운 말입니다(G-3).
5. **S14 context `sepsis`**: 따님 장면을 어색한 곳으로 둡니다. 그런데 keyPhrase 14.1이 가족에게 "In older adults sepsis can look different…"라고 말합니다. 가족에게 '패혈증'이라고 분명히 말하는 것은 맞는 관행입니다. 어색함은 `hypothermic·hypotensive·bundle`에 있습니다(G-4).
6. **decoy가 `ko`에 그대로 맞는 문장이 됨**
   - 1.1 `at the pharmacy`가 `over the counter` 자리에 들어가면 "…anything you buy at the pharmacy."가 됩니다. `ko` "약국에서 직접 사신 약"과 같은 뜻입니다.
   - 17.1 `in this room`이 `here` 자리에 들어가면 "There's no wrong choice in this room — …"가 됩니다. `ko` "여기엔"과 같은 뜻입니다.
   - 6.5 `in the lab`을 끼우면 "We'll check her urine in the lab and listen to her lungs."가 됩니다. `ko` "소변 검사를 하고"와 맞습니다.
7. **위험한 그림**
   - 0.4 빈칸 `throw out the medications you take`: 복용약을 버리라는 그림입니다.
   - 16.2 빈칸 오답 셋(boost/increase/raise)이 모두 섬망 환자 방의 소음을 키우는 말입니다.
   - 14.4 decoy `to her daughter`: "We're giving fluids and antibiotics to her daughter."로, 환자를 잘못 알아본 투약이 됩니다.
   - 19.3 decoy `in a cast`: 고관절 골절을 깁스로 고정한다는 틀린 그림입니다.
   - 10.3 decoy `from the fall`: 학대 사정에서 멍의 원인을 미리 붙여 버립니다.

## 저작자 자기 보고 판정

1. **base 문장 3건**: 세 건 모두 사실 오류가 맞습니다(위 1~3).
   - 10.1은 keyPhrase라 사용자 결정, 19.4·19.5는 결정 11입니다(J-1~J-3).
   - v46 필드는 대체로 안전하게 비켜 썼습니다. S10 order에 10.1 줄을 넣지 않았고, S19 order에 `drink`·`moving`이 없습니다.
   - 다만 why 세 건이 문장과 반대로 말해 학습자를 헷갈리게 합니다. 19.5 why는 영어 뜻까지 틀리게 설명합니다(E-3).
   - 19.4를 고치면 19.1 dKo "수술 전에 물을 드셔도 되는지 확인해 볼게요"가 새 정답과 같은 말이 됩니다. 19.3 dKo "금식이 필요한지 확인할게요"도 반만 다른 말이 됩니다. 함께 고칩니다(D의 19.1·19.3).
2. **엉뚱한 빈칸 오답**
   - 7.0: `sharp`를 그대로 두고 오답을 `dull`/`burning`/`crushing`으로 바꿉니다. 셋 다 흉통을 말하는 형용사라 같은 분야에서 틀린 말이고, `ko` "날카로운"으로 정답이 하나로 정해집니다. `crushing`은 오히려 전형적인 심근경색 표현이라 대비를 가르칩니다.
   - 4.1: 빈칸을 `do`로 옮기고 오답 `see`/`hear`/`eat`을 씁니다. "Has anything changed in what you can see lately?"처럼 문법이 맞고, 노인 기능 변화라는 같은 분야입니다.
3. **순서가 덜 잠긴 카드**: S7·S16 모두 맞습니다.
   - S7: 2↔3을 바꿔도 자연스럽고, 3번 줄 `That's why`가 앞 질문의 답을 '예'로 전제합니다.
   - S16: 1↔2를 바꿔도 자연스럽습니다.
   - 같은 문제가 9장 더 있습니다: S2·S4·S5·S6·S8·S10·S12·S13·S17(F).
4. **context 정비 5건**
   - `oriented`: OK. XX의 어색함은 `times four`에 있고, why도 그것을 설명합니다.
   - `confused`·`interact`: **고칠 것.** fix가 같은 말("why you feel confused", "may be interacting")을 환자에게 그대로 써서, 메모 "뜻은 셋 다 …"가 성립하지 않습니다(ctx-A #10 passed away와 같은 모양). `interact`는 차트도 "adverse drug interaction"으로 억지로 바꿨습니다.
   - `start low`·`sepsis`: **고칠 것(심각 4·5).** keyPhrase와 모순됩니다.
   - 그대로 둔 7건
     - OK: `LOC`·`baseline`·`code status`·`pitting edema`·`delirium`. 어색한 장면에만 의료진 말이 몰려 있고, why가 그 말을 설명합니다.
     - 경미: `head CT`·`actively dying`. why가 짚는 어색한 말은 `stat·r/o·ICH`, `mottling·Cheyne-Stokes`이고 `word`가 아닙니다. 환자는 "CT"를 알아듣고, 호스피스는 가족에게 "actively dying"을 실제로 씁니다. 같은 기준으로 `word`를 바꾸기를 권합니다(G-5·G-6).

## 고칠 것 (v46 필드) — 모두 118건

### A. 위험한 그림 — 빈칸·decoy (10건)

| 어디 | 문제 | 고칠 안 |
|---|---|---|
| 0.4 빈칸 | `throw out`(복용약 버리기), `hand out`(동떨어짐) | 오답 `refill`/`pick up`/`order` |
| 16.2 빈칸 | 오답 셋이 모두 "소음을 키운다"(섬망 비약물 간호와 반대), 서로 같은 뜻 | 빈칸을 `noise`로 옮기고 오답 `lights`/`bed`/`temperature` |
| 14.4 decoy | `to her daughter` → 딸에게 수액·항생제(환자 오인) | `in the hallway` |
| 19.3 decoy | `in a cast` → "keep you in a cast"(고관절은 깁스하지 않음) | `by the window` |
| 10.3 decoy | `from the fall` → "bruises from the fall"(학대 사정에서 원인을 미리 정함) | `on your leg`(청크 변형, `ko` 팔과 다름) |
| 18.4 decoy | `one by one` — `at the same time`의 반대말, why("미루지 않는다")와 반대 | `in the hallway` |
| 2.3 decoy | `behind you` — 청력저하 환자 뒤에 앉기(반대말) | `by the door` |
| 1.2 decoy | `as fast as you can` — `Take your time`의 반대말 | `by the label` |
| 11.2 decoy | `after lunch` → "Tell me if you feel dizzy after lunch."(보고를 점심 뒤로 한정) | `for the doctor` |
| 10.1 빈칸 | `late`/`upset`/`busy` — `busy to talk`는 비문 | J-1 결정 뒤 다시 씁니다(문장을 바꾸면 그 문장에 맞춰). 바꾸지 않으면 오답 `ready`/`early`/`late` (`welcome`·`free`는 "말씀하셔도 돼요"와 같아 피함) |

### B. 장면과 동떨어지거나 문법으로 걸러지는 빈칸 오답 → 같은 분야의 틀린 말로 (62건)

모든 안은 `ko`로 정답이 하나로 정해지고, 넣어 읽으면 문법이 맞으며, 위험한 처치를 그리지 않는 말로 골랐습니다.

| 문장 | 지금 오답 | 안 |
|---|---|---|
| 0.1 | thirsty/silly/chatty | `numb`/`sleepy`/`thirsty` |
| 0.3 | arms/eyes/lungs | 빈칸을 `give out`으로 옮기고 오답 `go numb`/`cramp up`/`swell up` |
| 0.5 | forgotten/fractured(비문)/fainted | `fainted`/`been hospitalized`/`been dizzy` |
| 1.0 | glasses/insurance cards/house keys | `insurance cards`/`pharmacy receipts`/`discharge papers` |
| 1.2 | all at once/back to back/door to door | `all at once`/`from memory`/`in a hurry` |
| 1.4 | blood draw/blood type/blood bank | `blood sugar`/`cholesterol`/`thyroid` |
| 1.5 | billing office/security desk/cafeteria | `lab`/`blood bank`/`radiology desk` |
| 2.1 | hurt/matter/change(비문) | `hurt`/`matter`/`bother you` |
| 2.2 | lower/cover/hide | 빈칸을 `miss`로 옮기고 오답 `hear`/`want`/`know` |
| 2.3 | watch/badge/shoes | `watch`/`badge`/`chart` (`lips`·`mouth`는 정답이 둘이 되어 피함) |
| 3.0 | holiday/birthday/vacation | 빈칸을 `good`으로 옮기고 오답 `bad`/`busy`/`slow` |
| 3.1 | Where/Why/Who(비문) | 빈칸을 `notice`로 옮기고 오답 `mention`/`report`/`treat` |
| 3.2 | prescriptions/donations/signatures | `questions`/`records`/`photos` |
| 3.3 | finally/suddenly/recently | `currently`/`still`/`no longer` (기저 ↔ 지금을 대비) |
| 3.4 | size/price/brand | `news`/`season`/`plan` |
| 4.1 | somewhere/someone(비문)/everything | 빈칸을 `do`로 옮기고 오답 `see`/`hear`/`eat` (자기 보고 2) |
| 4.2 | charge/penalty/rush | 빈칸을 `help`로 옮기고 오답 `rest`/`time`/`space` |
| 4.4 | stove/mirror/pillow | `bed`/`bathtub`/`car` |
| 6.2 | errands/laps/drills | 빈칸을 `hidden`으로 옮기고 오답 `minor`/`contagious`/`skin` |
| 6.5 | ankles/shoulders/teeth | `heart`/`belly`/`neck` |
| 7.0 | round/flat/rough | `dull`/`burning`/`crushing` (자기 보고 2) |
| 7.1 | bored/chatty/cheerful | `dizzy`/`nauseous`/`thirsty` |
| 7.3 | thirst/cravings/hunger | `numbness`/`itching`/`chills` |
| 7.4 | itching/hiccups/snoring | `coughing`/`fever`/`swelling` |
| 7.5 | pregnant/sleeping/talkative | `younger`/`pregnant`/`athletic` |
| 8.1 | evaporate/dissolve/shrink | `expire`/`wear off`/`run out` |
| 8.2 | rename/restock/repackage | `refill`/`reorder`/`relabel` (`double`은 위험한 그림이라 피함) |
| 8.4 | unhappy/unlucky/unusual | `steady`/`quick`/`light` (`weak`는 `ko` "다리 힘"과 겹쳐 피함) |
| 9.1 | flowers/lunch/luggage | `belongings`/`insurance`/`visitors` |
| 9.2 | insurance/visitor/parking | `insurance`/`diet`/`code status` |
| 9.3 | financial/marital/legal | `functional`/`nutritional`/`fluid` |
| 9.4 | gardener/chef/janitor | `pharmacist`/`administrator`/`social worker` |
| 9.5 | rename/print/cancel | `print`/`fax`/`update` |
| 10.0 | borrowed/ordered/repaired | `heard`/`read`/`wrote` |
| 10.2 | fear/habit/hobby | `rule`/`request`/`fear` (`job`·`concern`은 정답이 둘이 되어 피함) |
| 11.0 | insurance/budget/calendar | `liver`/`heart`/`stomach` |
| 11.1 | hungry/lonely/cold | `itchy`/`nauseous`/`constipated` (`sleepy`는 `groggy`와 겹쳐 피함) |
| 11.2 | curious/proud/grateful | `nauseous`/`sleepy`/`warm` |
| 11.3 | bones/hands/eyes | `lungs`/`muscles`/`bones` (복수 주어라 `liver`는 비문) |
| 11.4 | visitors/bills/delays | `infections`/`falls`/`bleeding` |
| 12.1 | shadow/pocket/dream | 빈칸을 `clearly`로 옮기고 오답 `quickly`/`quietly`/`loudly` |
| 12.2 | coat/wallet/keys | `hearing aids`/`dentures`/`cane` |
| 12.3 | hats/gloves/jewelry | `dentures`/`hearing aids`/`a brace` |
| 13.0 | lease/mortgage/warranty | `will`/`DNR`/`power of attorney` |
| 13.2 | taxes/rooms/bills | 빈칸을 `honor`로 옮기고 오답 `record`/`explain`/`share` |
| 13.3 | amount/price/brand | 빈칸을 `talked`로 옮기고 오답 `worried`/`complained`/`joked` (`level`은 정답이 둘이 되어 피함) |
| 13.4 | passport/receipt/invoice | `will`/`insurance card`/`medication list` |
| 13.5 | lawyer/insurer/landlord | `decision`/`request`/`plan` |
| 14.0 | memory/speech(비문)/mood | `sugar`/`oxygen`/`sodium` |
| 14.2 | paperwork/registration/billing | `tests`/`monitoring`/`X-rays` (`fluids`는 치료라 정답이 둘이 되어 피함) |
| 14.4 | blankets/pillows/vitamins | `oxygen`/`Tylenol`/`blood` |
| 15.0 | hangnails/sunburns/blisters | `nosebleeds`/`bruises`/`skin tears` |
| 15.1 | allergies/hunger/fatigue | `a fracture`/`a stroke`/`swelling` |
| 15.2 | sneezing/hiccups/itching | `vomiting`/`weakness`/`dizziness` |
| 15.5 | proud/cheerful/cold | `sleepy`/`restless`/`pale` |
| 16.0 | ready/covered/early | `welcome`/`early`/`late` |
| 17.0 | weight/income/exercise | `time`/`strength`/`independence` |
| 17.1 | quick/cheap/easy | `quick`/`final`/`easy` |
| 18.1 | diet/mood/vision | `pain`/`sleep`/`swelling` |
| 18.2 | pillow/blanket/noise | `medicine`/`test`/`leg` |
| 18.5 | symptom/chart/bill | 빈칸을 `together`로 옮기고 오답 `later`/`quickly`/`today` (`symptom`은 `ko` "문제"와 거의 같아 정답이 둘에 가까움) |
| 19.1 | vaccinated/insured/employed | `warm`/`awake`/`upright` |

참고(그대로 둠)
- 15.4 `past/last/previous`는 시제로 걸러집니다. 다른 자리는 `briefly`·`minutes`처럼 관찰을 줄이는 위험한 대안밖에 없어 둡니다.
- 16.4 `warm/busy/awake`는 우습지만 억제대 사유를 그럴듯하게 만드는 말(`calm`)보다 안전해서 둡니다.
- 5.5·20.3은 `quiet`·`calm`의 반대 방향(갈래 a)이라 둡니다.

### C. decoy가 `ko`에 맞는 문장이 됨 (6건)

| 어디 | 문제 | 안 |
|---|---|---|
| 1.1 | `at the pharmacy` → "…anything you buy at the pharmacy." `ko`와 같은 뜻(심각 6) | `online` |
| 17.1 | `in this room` → "There's no wrong choice in this room — …" `ko` "여기엔"과 같은 뜻(심각 6) | `on the form` |
| 6.5 | `in the lab` → "check her urine in the lab and …" `ko`와 맞음(심각 6) | `in the hallway` |
| 4.2 | `in this room` → "…a little help in this room." `ko`에 거의 맞음 | `with the bills` (같은 분야의 다른 대상) |
| 13.1 | `in the hospital` → "What matters most to him in the hospital?"("치료에서"에 가까움) | `at the desk` |
| 20.2 | `in the room` → "…; we're here in the room." `ko` "곁에 있어요"에 가까움 | `for the paperwork` |

전반(개수만 셉니다): 124/129가 시간·장소 부사구 틀이라 붙여 읽으면 우습기만 해서 걸러집니다. 같은 상황 안에서 decoy가 겹치기도 합니다(9.1·9.2 `from the van`, 12.2·12.5 `in your purse`, 18.1 `in bed`·18.2 `in the bed`). 다음 수정에서 상황마다 두세 개라도 청크 변형형(10.3 `on your leg`처럼)으로 바꾸기를 권합니다.

### D. distractorsKo (11건)

| 어디 | 문제 | 안 |
|---|---|---|
| 5.1 | "이 혼란이 약 때문일 수도 있어요" — 정답과 앞뒤가 같음("이 혼돈은 … 수도 있어요") | "불을 조금 낮춰 드릴까요?" |
| 5.3 | "여기가 어디인지 제가 알려 드릴까요?" — 정답("어디에 계신지")과 반만 다름 | "제가 누구인지 아시겠어요?" |
| 12.3 | "지금 안경을 가지고 계신가요?" — 정답(평소에 안경을 쓰시나요)과 반만 다름 | "글씨가 잘 보이세요?" |
| 13.2 | "그분 뜻을 다시 확인할게요" — 정답("그분의 뜻을 지켜")과 겹침 | "서류 사본을 차트에 넣어 둘게요" |
| 15.1 | "영상 검사실로 이동할게요" — 정답("영상 촬영을 할게요")과 겹침 | "혈액 검사도 같이 할게요" |
| 17.2 | "완화 돌봄은 통증 관리도 포함해요" — 정답 주어("완화 돌봄도")와 같음 | "가족 회의 시간을 잡아 드릴게요" |
| 18.5 | "결정은 의사와 함께 내릴 거예요" — 정답("함께 정해볼게요")과 겹침 | "다리 부기를 먼저 볼게요" |
| 20.4 | "그분께 하고 싶은 말씀을 편하게 하세요" — 정답("편하게 작별 인사를")과 거의 같음 | "의자를 더 가져다 드릴게요" |
| 3.6 | "기다려 주셔서 감사해요" — 정답과 같은 감사 표현이라 겹침(경미) | "어머니 약 목록을 받아 볼게요" |
| 19.1 | "수술 전에 물을 드셔도 되는지 확인해 볼게요" — J-2 뒤에는 19.4 정답과 같은 말 | "달력을 잘 보이는 곳에 둘게요" |
| 19.3 | "수술 전에 금식이 필요한지 확인할게요" — J-2 뒤에는 19.4 정답과 반만 다름 | "수술 동의서는 곧 받을 거예요" |

경미(고치지 않아도 됨)
- "약은 어디서 받으세요/타 오세요"를 0.4·0.6·1.0에 세 번 돌려썼습니다.
- 14.0·14.1이 같은 오답 "환자분 병력을 알려 주시겠어요?"를 씁니다.
- 10.5의 두 오답("혼자 사세요?"·"같이 사는 분이 있으세요?")은 서로 같은 질문입니다.

### E. why (4건)

1. **10.1**: J-1 결정에 따릅니다. 문장을 바꾸면 why를 "who else needs to know로 신고 의무를 숨기지 않으면서 안전하게 말할 자리를 줘요."로 바꿉니다. 바꾸지 않으면 지금 why를 둡니다(이미 사실을 바로잡고 있음).
2. **19.4**: J-2 문장에 맞춰 바꿉니다. "Let me check if로 먼저 확인한다고 말해요. 수술 전 금식은 마취팀 지시를 따르고(맑은 물은 대개 마취 2시간 전까지), 간호사가 지시 없이 물을 권하지 않아요."
3. **19.5**: 지금 why는 `moving`을 '움직이는 것이 아니라 눈과 손을 쓰는 것'이라고 영어 뜻을 바꿔 설명합니다(틀린 해설). J-3 문장에 맞춰 바꿉니다. "oriented는 날짜와 있는 곳을 아는 상태, engaged는 말을 주고받으며 깨어 있게 한다는 뜻이에요. 골절 부위는 움직이지 않되 대화와 낮 시간 자극으로 섬망을 예방해요."
4. **5.0**: "짧은 두 문장으로" → "짧은 두 마디로"(실제로는 한 문장).

### F. order (19건)

1. **S0** — 4번 줄이 16단어입니다. 안: `Let's go over your medications, in case one is behind these falls.`
2. **S1**(경미) — 3↔4를 바꿔도 거의 자연스럽습니다(`the same` → `For that one`). 4번 줄 안: `After that one, let's do the same for vitamins and anything over the counter.`
3. **S2** — 2↔3을 바꿔도 자연스럽습니다(보청기 확인 → 손 신호 → 마주 보고 천천히).
   - 3번 줄 안: `Whatever your answer, raise your hand any time something isn't clear — I'll repeat it.`
   - `Whatever your answer`는 2번 줄의 질문(`is that clearer…?`)에만 붙습니다. 1번 줄은 질문이 아닙니다. 4번 줄 `If hearing it again doesn't help`는 진짜 조건이라 둡니다.
4. **S3**(경미) — 3번 줄 `did she usually know … where she is` → `where she was`(시제).
5. **S4** — 2↔3을 바꿔도 자연스럽습니다. "Does the same go for cooking…?"가 1번 줄 뒤에 바로 붙고, `either of those`가 cooking·chair를 받습니다.
   - 3번 줄 안: `Over that same stretch, has cooking or getting up from a chair changed?`
   - `that same stretch`는 2번 줄의 `lately`만 받습니다.
6. **S5** — 1↔2를 바꿔도 자연스럽습니다. `being here`의 here는 앞 줄 없이도 뜻이 통합니다.
   - 2번 줄 안: `I know that feels frightening right now, but you're not alone.` (`that`이 1번 줄의 '병원에 있음'을 받습니다)
7. **S6** — 3↔4를 바꿔도 자연스럽습니다(소변·폐 확인 → 열이 없는 이유 → 둘 다 검사).
   - 4번 줄 안: `It can stay hidden because older patients don't always get a fever.` (`It`이 3번 줄의 hidden infection을 받습니다)
8. **S7**(자기 보고 3) — 2↔3, 3↔4를 바꿔도 자연스럽습니다. 3번 줄 `That's why we take this seriously`는 질문 바로 뒤에 와서 답을 '예'로 전제합니다.
   - 3번 줄 안: `Those three can be heart signs, so we take this seriously, even without sharp pain.` (15단어. `Those three`는 2번 줄의 셋만 받고, 답을 전제하지 않습니다)
   - 4번 줄 안: `That's also why we'll do an EKG and some blood tests on your heart.`
9. **S8** — 2↔3, 3↔4를 바꿔도 자연스럽습니다. 네 줄이 keyPhrase 그대로라 서로 가리키는 말이 없습니다.
   - 2번 줄: `That timing matters — some medicines can interact and cause this.`
   - 3번 줄: `To find which ones, we'll review everything you take.`
   - 4번 줄: `Once the review is done, we may lower or stop one of them.`
   - 4번 줄의 `Once`는 약 조정을 검토 뒤로 미루는 말이라 임상 순서에 맞습니다. 모든 환자에게 할 일을 미루는 말이 아닙니다.
10. **S9** — 2번 줄이 20단어이고 `Beyond what you know`가 어색합니다. 안: `Thanks — the paperwork is thin, so can you help me reach the facility?`
11. **S10** — 2↔3을 바꿔도 자연스럽습니다(`To do that` = 더 이해하기). 4번 줄은 19단어입니다.
    - 3번 줄: `With that goal, I want to ask about some bruises I noticed on your arm.`
    - 4번 줄: `Whatever they turn out to be, I ask everyone: do you feel safe at home?`
12. **S11** — 3번 줄이 23단어이고, 4번 줄 `Part of that:`은 어색한 영어입니다.
    - 3번 줄: `Even with that small dose, tell me if you feel dizzy or groggy.`
    - 4번 줄: `Either way, please don't try to get up alone until we check on you.` (낙상 예방은 어지러움과 상관없이 모든 환자에게 하므로 조건 없이 `Either way`로 묶습니다)
    - why에 "적게 시작하되 통증을 참게 두지 않아요 — 조절되지 않는 통증도 섬망을 부릅니다."를 덧붙이기를 권합니다(태그라인이 "엉덩이가 너무 아프다"인데 카드에 통증 조절이 없음).
13. **S12** — 3↔4를 바꿔도 자연스럽습니다. 3번 줄 `Having them on`은 2번 줄 질문의 답을 '예'로 전제합니다. 4번 줄 "replace your hearing aid batteries"는 태그라인("I left my hearing aids at home")과 어긋납니다.
    - 3번 줄: `If you use either, having them here will help you feel less confused.`
    - 4번 줄: `Since they help that much, let's ask your family to bring yours from home.`
14. **S13** — 2↔3을 바꿔도 자연스럽습니다. "Has he ever talked about that"의 `that`이 1번 줄의 POLST를 받을 수 있습니다.
    - 2번 줄: `Whether or not there's a paper, has he ever talked about the care he'd want?`
    - 3번 줄: `From what he said, what matters most to him now?`
    - 4번 줄: `Whatever matters most, we'll honor it as best we can.`
    - `From what he said`는 태그라인("Dad always said…")이 이미 말한 사실이라 전제가 아닙니다.
15. **S16**(자기 보고 3) — 1↔2를 바꿔도 자연스럽습니다.
    - 2번 줄 안: `What I'm going to do is find what's causing this confusion.`
    - 1번 줄 `I'm not going to hurt you`와 대비되어 1번 줄 뒤에만 섭니다. 공격적인 환자에게 안전을 먼저 말하는 순서도 맞습니다.
16. **S17** — 2↔3을 바꿔도 자연스럽습니다(`Thinking about that` = 편안함).
    - 3번 줄 안: `With that option in mind, what matters most to him at this stage?`
17. **S18**(경미) — 3↔4를 바꿔도 거의 자연스럽습니다(`To fix that` = 가장 힘든 증상).
    - 4번 줄 안: `Even while we do that, tell me which symptom bothers you most.`
18. **S19**(경미) — 3↔4를 바꿔도 거의 자연스럽습니다.
    - 4번 줄 안: `For that clear head, I'll keep checking on you so you're not alone.`
19. **S20** — 3번 줄 22단어, 4번 줄 17단어이고 `whatever`가 겹칩니다.
    - 3번 줄: `Beyond that, you can hold her hand and talk to her; she may still hear.`
    - 4번 줄: `Whatever you say, there's no wrong way to say goodbye.`

### G. context (6건)

1. **G-1 S5 `confused`** — fix가 환자에게 "why you feel confused"라고 같은 말을 씁니다. 어색함은 진단명(`acute delirium`)에 있습니다. base에 이미 있던 `acute`로 바꾸면 base 장면을 거의 살립니다.
   - `word: acute`, `ko: 급성의`
   - 동료: `She's had an acute change — confused since this morning.`
   - 차트(base로): `Acute change in mental status, onset this AM; reoriented.`
   - XX(base로): `You have acute delirium.`
   - fix·why는 그대로입니다.
2. **G-2 S8 `interact`** — fix가 "may be interacting"을 환자에게 쓰고, 문장 8.1도 환자에게 `interact`를 씁니다. 차트는 표준어 "adverse drug reaction"을 "…interaction"으로 억지로 바꿨습니다.
   - `word: polypharmacy`, `ko: 다약제 복용`
   - 차트(base로): `Dizziness likely adverse drug reaction; polypharmacy — med review requested.`
   - 약사: `With her polypharmacy, I'm worried two meds are interacting — can you review her list?`
   - XX: base의 polypharmacy 문장 그대로
   - fix·why는 그대로입니다.
3. **G-3 S11 `start low`(심각 4)** — keyPhrase 11.0과 모순되고, 차트 `started low`는 억지로 끼운 말입니다.
   - `word: renal`, `ko: 신장의`
   - 동료: `Start low, go slow — she's 88 with poor renal function.`
   - 차트(base로): `Hydromorphone 0.2 mg IV given; reduced dose d/t age and renal function.`
   - XX: `Reduced dose due to your renal function — standard geriatric dosing.`
   - fix는 그대로입니다.
   - why: "renal·geriatric dosing은 의료진끼리의 말이에요. 환자에게는 kidneys처럼 쉬운 말로, 적은 양으로 시작해 조절한다고 풀어 말해요."
4. **G-4 S14 `sepsis`(심각 5)** — keyPhrase 14.1과 모순됩니다. 어색함은 `hypothermic·hypotensive·bundle`에 있습니다.
   - `word: hypotensive`, `ko: 저혈압인`
   - 동료: `Temp 35.6, BP 84 over 50 — she's hypotensive; let's start the sepsis bundle.`
   - 차트(base로): `Hypothermic, hypotensive; 30 mL/kg crystalloid bolus initiated.`
   - XX·fix·why는 그대로입니다(why가 이미 hypotensive를 짚음).
5. **G-5 S15 `head CT`(경미)** — why가 짚는 말은 `stat·r/o·ICH`이고, 환자도 "CT"는 알아듣습니다.
   - `word: stat`, `ko: 즉시`
   - 차트: `Stat head CT ordered to r/o ICH; pt on apixaban.`
   - 영상의학과 전화·XX·fix·why는 그대로입니다.
6. **G-6 S20 `actively dying`(경미)** — why가 짚는 말은 `mottling·Cheyne-Stokes`입니다. fix도 "She is dying"이라 `dying`은 가족에게도 맞는 말입니다.
   - `word: mottling`, `ko: 피부 얼룩(반점)`
   - 차트: `Pt actively dying; mottling noted; comfort measures only per POLST.`
   - 동료·XX·fix·why는 그대로입니다.

swap `ko` 9건(S1·S2·S4·S6·S7·S10·S12·S16·S17)은 모두 바꾼 문장의 뜻과 맞습니다.

### 집계

A 10 · B 62 · C 6 · D 11 · E 4 · F 19 · G 6 = **118건**. 경미 표시 7건(F 4건, G 2건, D 1건)은 선택입니다.

## 결정 11 · 사용자 결정 (따로)

- **J-1 (사용자 결정, keyPhrase) 10.1** "You're safe to talk with me — nothing leaves this room without your say." — 지킬 수 없는 비밀 보장 약속입니다(심각 1). keyPhrase라 V4로 막혀 있어, `in-er-geriatric.json` keyPhrases와 문장을 함께 바꿀지 사용자가 정해야 합니다.
  - 안 en: `You're safe to talk with me — I'll be honest about who else needs to know.`
  - 안 ko: "여기서는 안전하게 말씀하셔도 돼요 — 누가 더 알아야 하는지는 솔직하게 말씀드릴게요."
  - 청크: `You're safe` / `to talk with me` / `— I'll be honest` / `about who else` / `needs to know` / `.`
  - `w-leave`·`w-say` 태그가 빠지므로 S10의 V3(서로 다른 단어 8개 이상)을 확인해야 합니다.
- **J-2 (결정 11) 19.4** → `Let me check if you can drink water to stay hydrated before surgery.`
  - ko: "수술 전에 수분 유지를 위해 물을 드셔도 되는지 확인해 볼게요."
  - 청크: `Let me check` / `if you can drink water` / `to stay hydrated` / `before surgery` / `.`
  - `w-hydrated`·`w-surgery`는 그대로입니다.
  - v46 필드도 함께 바꿉니다: tag `금식 확인`, 빈칸 `before` → 오답 `after`/`during`/`without`(`until`은 "수술 직전까지 마셔라"라는 위험한 그림이라 피함), why는 E-2, dKo는 D의 19.1·19.3.
- **J-3 (결정 11) 19.5** → `Let's keep you oriented and engaged while you wait.`
  - ko: "기다리시는 동안 지남력을 유지하고 계속 이야기 나누며 지내시도록 도와드릴게요."
  - 청크: `Let's keep you` / `oriented` / `and engaged` / `while you wait` / `.`
  - `w-oriented`·`w-wait`는 그대로입니다.
  - 빈칸 `oriented` 오답 `dressed`/`shaved`/`warm`(`entertained`는 `engaged`와 겹쳐 피함), why는 E-3.
- **J-4 (결정 11, 경미) 8.4 ko** "이 약 조합이 다리 힘을 불안정하게 만들고 있을 수 있어요" — 어색한 한국어입니다. → "이 약 조합 때문에 걸을 때 휘청거리실 수 있어요."

## 종합

v46 필드 118건을 고친 뒤 내보내도 됩니다. 단, 10.1은 keyPhrase 수정에 대한 사용자 결정이 먼저이고, 19.4·19.5는 결정 11로 문장을 바꾼 뒤 v46 필드를 함께 맞춰야 합니다. 가장 큰 덩어리는 동떨어진 빈칸 오답(62)과 순서가 덜 잠긴 order 카드(11장)이고, context 2건은 같은 파일의 keyPhrase와 모순되므로 반드시 고칩니다.
