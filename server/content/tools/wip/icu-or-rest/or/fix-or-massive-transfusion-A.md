# or-massive-transfusion — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `or-massive-transfusion.yaml`(A·B 합본). 단어 137(base 148, 15 삭제·4 추가), 상황 21(문장 126), 뉘앙스 42(slider 20 · context 16 · swap 5 · pair 1).
비교: base·changes(64건: word-remove 15 · word 13 · word-add 4 · sentence words 32 — 문장 en·ko·chunks 변경 없음, diff로 확인)·in-json·notes-A·notes-B.
검사 `verify_one_theme.py or` 통과. 임시 스크립트 `rv_or-massive-transfusion_dump.py`(words/sents/nuance)·`rv_or-massive-transfusion_check.py`(길이·cue·태그·context 단어·swap·pair 전 조합), 출력 `_rv_or-massive-transfusion_nuance.txt`.
번호는 "상황.문장"(둘 다 0부터). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 철자·소리·같은 분야 오답이 고름(hypotension/hypertension, dilute/dilate, TRALI/TACO). w-id `DOB`는 정답으로도 맞음 ★, w-rightaway `right side` 품사 다름 ★ |
| 2 distractorsKo·길이 | 5 | 길이 규칙 전부 통과(스크립트). 동의어·정답 둘 없음 |
| 3 cue | 3 | 정답 영어 노출 없음. 그러나 ko 되풀이 9개, w-chart cue에 음역 '차트', 수치 틀림 2개(저체온 35도·발열 '38도 가까이') |
| 4 chips/decoyChips | 4 | 비속어·불쾌·술·장례·성적 조각 없음(전수). 의미 없는 자르기 몇 개(match `mat/ch`, urine `uri/ne`)는 권장 |
| 5 뉘앙스·문장 사실 | 3 | 뉘앙스 why는 대체로 미국 관행에 맞음(칼슘·가온·TACO·TRALI). 문장: 쿨러 구성 단정(6.3), 호전 단정(17.4), 수술실에서 'call anesthesia'(18.4), 순환 간호사가 지역 혈액 공급처에 직접 전화(19.5). swap 3 '혈압 떨어지면 속도 올림'이 수혈 반응 저혈압과 갈리지 않음(안전) |
| 6 뉘앙스 설계 | 3 | context 16개 중 6개가 일반인도 아는 말(confirm·sign·calcium·need·watch·trend)을 word로 고르고 어색함은 다른 전문어에서 옴. slider cue가 답을 드러냄 2개(amber·Routine)·오답을 담음 2개(tall·slower), slider 13 답 둘. pair는 정답 하나지만 동사 수일치로 답이 보이고 decoy가 사실상 참 |
| 7 결정 11 | 4 | 32건(단어의 2할)은 1할을 넘지만 대부분 기계적(활용형 헤드워드 6·같은 뜻 가르기 7·쉬운 단어 15)이라 타당. 남은 흠: w-drop ko를 바꾼 뒤 example이 타동사 문장, w-ph ko에 정답 `pH`, w-release `방출하다`·w-support `지지하다`가 한국 병원 용어와 다름 |

## 사실 오류·심각한 문제
1. **[안전] w-hypothermia cue "체온이 35도 아래로 내려간 상태"** — 수술 중 비의도적 저체온은 **심부 체온 36°C 미만**이 기준(ASPAN·NICE 수술 전후 저체온 지침). 35도를 기준으로 가르치면 36~35도 구간에서 가온을 늦출 수 있음 → W1.
2. **[안전] swap 3 "The pressure is dropping, so let's speed it up"(문장 3.3도 같은 내용)** — 정답 하나로 "혈압 떨어지면 수혈 속도 올림"을 가르치는데, 같은 주제의 상황 11·15는 **저혈압을 수혈 반응 징후**로 가르침(그때는 멈춤). 출혈로 인한 저혈압이라는 전제와 속도는 마취과가 정한다는 점을 who·notes·why에 못 박아야 함 → N7.
3. **[사실] 6.3 "Each cooler has six units of product."** — MTP 쿨러 구성은 병원 프로토콜마다 다름(예: RBC 6+FFP 6+혈소판 1, 4:4:1, 10:10:2). 총 '여섯 단위'라는 고정값은 없음 → S1.
4. **[약속] 17.4 "The heart function should improve after this dose." / ko "나아질 거예요"** — 위기 장면에서 결과를 단정. ko는 en보다 더 강함('나아질 거예요'). 투여 뒤 **다시 보자**는 말로 → S2.
5. **[범위] 19.5 "I'll call the regional blood bank."** — 지역 혈액 공급처(Red Cross·지역 혈액원)에 긴급 주문하는 것은 병원 혈액은행(수혈의학 부서)이고, 순환 간호사는 병원 혈액은행에 요청함 → S3.
6. **[장면] 18.4 "Let's stop this unit and call anesthesia."** — 수술 중 마취과는 이미 방 안에서 환기를 맡고 있음(18.2 KP "support ventilation"). '부른다'는 맞지 않음. TRALI 의심 시 제제 백·세트를 혈액은행에 돌려보내는 것이 실제 할 일 → S4.
7. **[사실] context 14 가족 장면 "consumptive coagulopathy"** — 상황 14는 대량수혈 희석성 응고장애(상황 12) 흐름인데 소모성 응고장애(DIC)로 진단을 바꿈 → 세 장면 뜻이 다름. N6에서 장면 교체로 사라짐.

## 저작자가 짚은 것 — 판정
| 짚은 것 | 판정 |
|---|---|
| 16.1 KP "Let's give calcium, insulin, and glucose." 등 투약 제안 | 고칼륨혈증 표준 처치(칼슘으로 심근막 안정화, 인슐린+포도당으로 칼륨 세포 내 이동)로 **사실 맞음**. Let's는 팀이 함께 진행하는 말이고 수술실 위기에서 실제로 이렇게 말함 → KP는 유지 권고(아래 K1). 7.5 "Let's give another dose…", 14.5 "Let's dose the next unit…", 19.4 "Let's activate the emergency release now."도 유지 — 다만 B가 v46 why에 "마취과 의사의 처방·병원 프로토콜에 따라"를 넣을 것(19.4는 응급 방출에 의사 서명이 필요하다는 점도) |
| 17.4 호전 약속 | **고침** → S2 |
| 6.3 쿨러 여섯 단위 | **고침** → S1 |
| 2.5 "Warm blood is easier on the heart." | **유지.** 차가운 혈액을 빠르게(특히 중심정맥으로) 넣으면 저체온과 심실성 부정맥·심정지 위험이 커진다는 것이 가온의 근거(AABB). 뜻이 모호할 뿐 틀리지 않음. B가 why에 "차가운 피를 빨리 넣으면 부정맥 위험"을 짧게 넣으면 좋음 |
| 결정 11 수정 30여 건(1할 초과) | **타당.** 활용형 헤드워드 6(bind·dilute·climb·depress·fall·rise)은 필수, ko 가르기 7(sign/sign off, PRBCs/packed red cells, O-neg/O-negative, alongside/together, right away/immediately/stat)은 같은 뜻 쌍 정리, 쉬운 단어 15(공통 목록 5 + blood·cold·each·start·way·far·soon·fast·down·last)는 모두 간호사가 아는 말. 흠 2개만 → W5·W8 |
| 새 단어 setting·hypothermia·prevent·pH | **타당**(상황 2·8·13의 V3를 채우면서 배울 값이 있음). pH ko만 고침 → W5 |
| report 태그 `재고·보고` | 큰 문제 없음. example이 18.2(TRALI 보고)라 `수혈 반응`이 더 맞음 → 권장 R4 |
| 닮은 짝을 서로의 오답으로(calcium/potassium, TRALI/TACO, arterial/venous, plasma/platelet, warmer/cooler) | **허용.** 금지는 '같은 뜻' 짝이고 이것들은 뜻이 다름. 지시서도 "같은 주제 은행의 다른 단어 — 실제로 헷갈리는 말이 가장 좋은 오답"이라 함. 정답 둘 없음 |
| record·chart·log 모두 '기록하다' | **유지 가능.** 서로의 오답이 아니라 한 문제에 정답 둘이 생기지 않음, cue가 장면을 가름. 다만 w-chart cue에 음역 '차트'가 있어 답이 보임 → W6 |
| (B) 16.1 distractorsKo 길이, 빈칸 오답 poster·plate·sticker·oven 등 | B 검토 몫 |

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en을 바꾸면 `chunks`·`ko`·`words`를 함께 바꾸고, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 같은 문장을 쓰는 order 줄·단어 example도 맞추고, `changes-or-massive-transfusion.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 그 문장의 **distractorsKo 둘을 새 ko 틀에 맞춰 다시** 쓰세요.

- **S1 [사실] 6.3** · en `Let's count the units of product in this cooler.` · chunks `Let's count / the units / of product / in this cooler / .` · ko `이 쿨러에 든 제제 단위를 세어 봅시다.` · words `[w-unit, w-product, w-cooler]`(그대로). v46 새로(지금 blank `six`·오답 four/ten/twelve와 decoy `of ice`는 새 문장에 안 맞음; why 예: "쿨러에 무엇이 몇 단위 드는지는 병원 MTP 프로토콜마다 달라요. 그래서 받으면 세어 보고 목록과 맞춰요."). order 6은 이 문장을 안 써서 연쇄 없음.
- **S2 [약속] 17.4** · en `Let's see if the heart function improves after this dose.` · chunks `Let's see / if the heart function / improves / after this dose / .` · ko `이번 투여 후 심장 기능이 나아지는지 봅시다.` · words `[w-function]`. v46 새로 — **지금 distractorsKo 둘째 `…나아졌는지 지켜봐요`는 새 정답과 같은 뜻이 되므로 반드시 교체**, blank `improve`의 오답 `worsen`은 새 문장에 넣으면 그대로 맞는 말("나빠지는지 보자")이 되니 다른 빈칸으로 옮길 것. **order 17 넷째 줄** → `Let's see if the heart function improves after this dose.`(셋째 줄 calcium을 this dose가 가리켜 순서 고정 유지).
- **S3 [범위] 19.5** · en `I'll ask the blood bank to call the regional supplier.` · chunks `I'll ask / the blood bank / to call / the regional supplier / .` · ko `혈액은행에 지역 혈액 공급처로 연락해 달라고 할게요.` · words `[w-bank, w-call, w-regional]`(그대로). v46 새로(why 예: "지역 공급처에 긴급 주문을 넣는 건 병원 혈액은행이에요. 수술실은 혈액은행에 요청하고 상황을 알려요."). **order 19 넷째 줄** `I'll call the regional blood bank to start it.` → `I'll ask our blood bank to start it with the regional supplier.`, order why도 맞출 것.
- **S4 [장면] 18.4** · en `Let's stop this unit and save the bag for the blood bank.` · chunks `Let's stop / this unit / and save the bag / for the blood bank / .` · ko `이 제제를 멈추고 백은 혈액은행에 보낼 수 있게 남겨 둡시다.` · words `[w-stop, w-unit, w-bank]`(w-call 빠져도 상황 18은 12개). v46 새로(지금 distractorsKo 둘이 모두 '마취과 부르려고'라 교체; why 예: "수혈 반응이 의심되면 남은 백과 세트를 버리지 않고 혈액은행 조사용으로 돌려보내요."). **order 18 셋째 줄** `Let's support ventilation and call anesthesia.` → `Let's support ventilation and save the bag for the blood bank.`, **넷째 줄** `With help on the way, I'll report…` → `With the bag saved, I'll report this reaction right away.`
- **S5 [chunks] 구 경계를 끊은 조각(en 그대로; 바뀐 조각에 걸린 decoy는 B가 다시 확인)**
  - 0.5 `once we both / agree`(주어와 동사를 끊음) → `Let's hang this / once / we both agree / .` (V5가 3조각을 요구해 접속사 `once`가 홀로 남지만 구 경계는 맞음; decoy `once we all`은 새 조각과 안 맞으니 교체)
  - 9.3 `and no / plasma`(한정사 no와 명사를 끊음) → `We don't want / all red cells / and no plasma / .` (decoy `and some` 교체)
  - 11.3 `an early / sign`(명사구를 끊음) → `Oozing / from the line / can be / an early sign / .`
- **S6 [ko·KP 문장의 ko만] 2.0** ko `이걸 가온기를 거치게 합시다.`(목적어 둘이 겹쳐 어색) → `이건 가온기를 거쳐 들어가게 합시다.` distractorsKo 둘 새 ko 틀로. w-route exKo도 같이.
- **판정만 — 고치지 않음:** 3.3(KP 아님)은 en 유지하되 B가 v46 why에 N7과 같은 단서(출혈로 인한 저혈압일 때, 반응 징후면 멈춤, 속도는 마취과)를 넣을 것. 9.5 "Platelets go in as soon as they arrive."는 사실(혈소판은 실온 보관·바로 투여)이나 why에 "두 사람 확인을 마치면"을 넣을 것. 2.3 "Every unit goes through the warmer"는 신속 주입기·가온기 사용 관행상 유지. 4.5 남은 제제를 쿨러에 보관도 유지(쿨러는 정해진 시간 안에 닫아 두고 쓰지 않으면 혈액은행에 반납).

## 고칠 것 — 뉘앙스
- **N1 [context 0 · word 선택]** 지금 word `confirm`은 일반인도 아는 말이고 가족 장면의 어색함은 `ABO group`·`dual-RN verification`에서 옴. → word `product`, ko `(혈액) 제제`, words `[w-product]`. 장면: 간호사끼리(check) `Let's confirm the product type before we hang it.` ok / 차트 기록(board) `Product type and unit number confirmed by two RNs.` ok / 가족에게(me) `We confirmed the product with a second nurse.` ok:false · fix `We checked with a second nurse that this is the right blood for him.` · why `product는 혈액을 부르는 혈액은행·의료진 말이라 가족에게는 물건처럼 들려요. 가족에게는 '맞는 피인지 두 번째 간호사와 확인했다'로 말해요.`
- **N2 [context 4 · word 선택]** `sign`은 일반어, 어색함은 `signed for and logged on receipt`. → word `PRBCs`, ko `농축적혈구`, words `[w-prbc]`. 장면: 간호사끼리 `Sign here for the PRBCs and I'll log the time.` / 차트 `4 units PRBCs received and signed for by RN.` / 가족에게 `His PRBCs just arrived from the blood bank.` ok:false · fix 그대로(`The blood just arrived, and we're checking it carefully before it goes in.`) · why `PRBCs는 수술실·혈액은행끼리 쓰는 줄임말이에요. 가족에게는 '피가 도착했고 넣기 전에 꼼꼼히 확인한다'로 말해요.`
- **N3 [context 7 · word 선택]** `calcium`은 가족도 아는 말, 어색함은 `ionized`·`citrate`. → word `ionized`, ko `이온화된`, words `[w-ionized]`. 장면: 간호사끼리 `The ionized calcium is low — let's give calcium and recheck.` / 차트 `Ionized calcium 0.9; calcium given per protocol.` / 가족에게 `His ionized calcium is low, so we're replacing it.` ok:false · fix 그대로 · why `ionized calcium은 검사 이름이라 의료진끼리는 정확하지만 가족에게는 낯설어요. 가족에게는 '들어가는 피가 칼슘을 낮출 수 있어 보충한다'로 풀어요.` (차트의 `per MTP`→`per protocol`: 칼슘 보충이 MTP에 들어 있는지는 병원마다 다름)
- **N4 [context 10 · word 선택]** `need`는 일반어이고, 가족 장면의 어색함은 말이 아니라 '재고가 바닥'이라는 내용(불안)에서 옴 → 듣는 사람 문제가 아님. → word `O-neg`, ko `O형 음성`, words `[w-oneg]`. 장면: 혈액은행에게(speech) `How many units of O-neg do you have left?` / 차트 `2 units O-neg given; type-specific pending.` / 가족에게 `We're giving him O-neg until his own type is ready.` ok:false · fix `We're giving him blood that's safe for almost anyone until blood matched to him is ready.` · why `O-neg는 의료진이 혈액형을 줄여 부르는 말이에요. 가족에게는 '거의 누구에게나 쓸 수 있는 피를 먼저 쓰고, 맞춘 피가 준비되면 바꾼다'로 말해요.`
- **N5 [context 11 · word 선택]** `watch`는 일반어, 어색함은 `hemolytic or febrile reaction`. → word `hypotension`, ko `저혈압`, words `[w-hypotension]`. 장면: 간호사끼리(magnify) `Watch for fever, hypotension, or oozing.` / 차트 `No fever or hypotension during transfusion.` / 가족에게 `We're watching him for hypotension during the transfusion.` ok:false · fix `We're keeping a close eye on his blood pressure in case his body reacts to the blood.` · why `hypotension은 의료진끼리 쓰는 임상어예요. 가족에게는 '혈압을 계속 지켜본다'로 쉽게 말해요.`
- **N6 [context 14 · word 선택 + 사실]** `trend`는 일반어, 어색함은 `consumptive coagulopathy`(게다가 희석성 흐름과 다른 진단). → word `fibrinogen`, ko `피브리노겐`, words `[w-fibrinogen]`. 장면: 간호사끼리(chartup) `Let's watch the fibrinogen trend.` / 차트 `Fibrinogen trending down: 142, 118, 96.` / 가족에게 `His fibrinogen is trending down, so we're replacing it.` ok:false · fix 그대로(`His clotting numbers are slowly getting lower, so we're giving more of what helps him clot.`) · why `fibrinogen은 검사·성분 이름이라 의료진끼리 쓰는 말이에요. 가족에게는 '피를 굳게 하는 수치가 낮아져 보충한다'로 말해요.`
- **N7 [안전 · swap 3]** who `마취과 의사에게 · 출혈로 혈압이 떨어질 때`. notes `speed it up` → `출혈로 혈압이 떨어질 때는 마취과 의사의 판단으로 주입을 올려 따라잡아요.` why → `출혈로 혈압이 떨어질 때의 말이에요. 발열·짙은 소변·라인 출혈처럼 수혈 반응 징후가 같이 보이면 올리지 않고 멈추고 알려요. 얼마나 올릴지는 마취과 의사가 정해요.`
- **N8 [slider 15 cue가 답을 드러냄]** cue `"…normal amber…"`에 정답 `amber`가 그대로 → `Nurse: "The urine looks its usual honey-yellow — nothing unusual."`
- **N9 [slider 19 cue가 답을 드러냄]** cue `"Routine daily restock…"`에 정답 `routine` → `Blood bank order: "Daily shelf restock — no hurry."`
- **N10 [slider 16 cue에 오답이 그대로]** cue `"tall and narrow, pointed like tents"`에 선택지 `tall`이 들어 있어 tall도 맞는 답처럼 읽힘 → `ECG: "The T-waves are narrow and pointed, like tents."`
- **N11 [slider 13 답 둘]** 한 시간에 2→9는 spike로도 climb으로도 읽힘(두 점만 주면 '갑자기'인지 '꾸준히'인지 알 수 없음). KP 단어 climb을 정답으로: cue `Lab: "Lactate 2, then 3.5, then 5 over the last hour."` · answerAt `1` · why 끝 `…한 시간 동안 조금씩 꾸준히 올랐으니 climb이에요.`
- **N13 [slider 3 cue에 오답 어간]** cue `"…just a touch slower is enough."`의 `slower`가 선택지 `slow`로 이끔(정답은 ease off) → `Anesthesiologist: "Pressure is steady — back it off just a touch."` (slider 0 cue의 `checked`도 선택지 check와 겹치나, cue가 '둘이 맞다고 말했다'까지 가서 confirm으로 갈림 — 유지)
- **N12 [pair 6]** 정답은 하나로만 맞지만(전 12조합 확인) 오른쪽이 `carry`(복수)·`replaces`(단수)·`plug`(복수)라 수일치로 plasma 짝이 보이고, decoy `lower the temperature`는 차가운 혈액에 대해 사실상 참(KP 2.1). → pairs `[red cells, to carry oxygen]`, `[plasma, to replace clotting factors]`, `[platelets, to plug small leaks]`, decoys `[to dissolve clots]`.

## 고칠 것 — 단어
- **W1 [안전] w-hypothermia cue** → `수술 중 심부 체온이 36도 아래로 내려간 상태`
- **W2 [사실] w-fever cue** `체온이 38도 가까이 오르는 증상` → `수혈 중 체온이 38도 이상으로 오르는 증상`(발열성 반응 기준은 38°C 이상·1°C 이상 상승)
- **W3 [정답 둘 ★] w-id distractorsEn `DOB`** — 생년월일도 손목 밴드에 있는 환자 식별자라 cue("환자가 누군지 증명하는 손목 밴드…의 정보")에 맞음 → `[IV, IO]`
- **W4 [품사 ★] w-rightaway distractorsEn `right side`**(명사구) → `[far away, all right]`(부사, away가 소리로 닮음; 9/7자 통과)
- **W5 [결정 11 · ko에 정답] w-ph ko `산도(pH)`** — 영어 고르기에서 ko가 답을 보여 줌 → `산도`. changes에 word ko 기록.
- **W6 [cue 음역] w-chart cue `차트에 적어 남기다`** — '차트'가 정답 chart의 음역 → `수혈 중 잰 활력징후를 15분마다 적어 넣다`
- **W7 [cue가 ko 되풀이 — 9개]**
  - w-drop `수치가 아래로 내려가다` → `체온·혈압 같은 수치가 아래쪽으로 — 차가운 피가 체온을 이렇게`
  - w-fluid `정맥으로 들어가는 수액류` → `정맥 라인으로 들어가는 식염수·링거 — 대량수혈 때는 모두 데워서`
  - w-raise `수치나 온도를 위로 올리다` → `추운 수술방에서 온도 조절기 눈금을 위로`
  - w-alongside `따로가 아니라 곁에 나란히` → `적혈구가 다 들어간 뒤가 아니라 같은 때 곁에서`
  - w-left `아직 쓰지 않고 남은` → `혈액은행에 묻는 재고 — 아직 쓰지 않은 채 있는`
  - w-send `검사실로 보내다` → `검체를 기송관이나 러너 편에 검사실로`
  - w-stop `하던 것을 멈추다` → `반응이 의심되면 수혈을 그 자리에서 — 끝까지 넣지 않는다`
  - w-peaked `꼭대기가 높고 뾰족한 모양의` → `고칼륨혈증 심전도에서 T파가 텐트처럼 솟은 모양의`
  - w-onegative `O형 음성 혈액을 부르는 이름` → `혈액형을 모를 때 응급으로 먼저 내주는 혈액`
- **W8 [결정 11 · ko와 example 어긋남] w-drop** — ko를 `떨어뜨리다`→`내려가다`(자동사)로 바꿨는데 example은 타동사 문장 2.1 `Cold blood can drop the patient's temperature.` → example `The temperature is dropping to 35.` · exKo `체온이 35도까지 떨어지고 있어요.` changes에 word example 기록.

- **W9 [결정 11 · ko] w-release ko `방출하다`** — 혈액은행이 혈액을 내주는 것은 한국 병원에서 '불출'이라 함('방출'은 물리·화학 용어로 읽힘) → ko `불출하다`, dKo `[보관하다, 비축하다]` 유지, exKo `응급 O형 음성을 불출해 줄 수 있나요?`. 연쇄: 19.1 KP ko(ko만, 결정 11 범위) `응급 O형 음성을 불출해 줄 수 있나요?`, 19.4 ko `지금 응급 불출을 발동합시다.` → 자연스럽게 `지금 응급 불출을 요청합시다.`, context 19 `ko: 불출하다`, slider 19 exKo. 두 문장의 distractorsKo 둘씩 새 ko 틀로.
- **W10 [결정 11 · ko] w-support ko `지지하다`** — 호흡 보조를 '지지'라 하면 정서적 지지로 읽힘 → ko `보조하다`, dKo `[가정하다, 억제하다]` 유지, exKo `환기를 보조하고 보고합시다.`. 연쇄: 18.2 KP ko(ko만) `환기를 보조하고 보고합시다.`, slider 18 exKo, 18.2 distractorsKo 둘 새 ko 틀로. (처음엔 권장으로 두었던 것을 고칠 것으로 올림)

## 품사가 다른 distractorsEn 전수 (★ = 꼭 바꿀 것)
| 단어 | 정답 품사 | 오답 | 판정 |
|---|---|---|---|
| w-rightaway right away | 부사구 | right side(명사구) | ★ → W4 |
| w-alongside alongside | 전치사 | afterward·instead(부사) | 권장 → `against`·`across`(전치사, 7·6자 통과) |
| w-left left | 형용사(남은) | lost(과거분사)·less(한정사/형용사) | 유지(서술 자리에 둘 다 옴) |
| w-set set | 형용사(설정된) | sent·shut(과거분사) | 유지 |
| w-fluid fluids | 가산 명사 | oxygen(불가산) | 유지 |
그 밖의 132개는 품사 같음(스크립트 표 확인).

## decoyChips·오답 불쾌어 전수
비속어·불쾌한·술·장례·성적 조각 **없음**(decoyChips 137개, distractorsEn 274개 전부 확인). w-pressure 오답 `pleasure`는 소리 닮은 일반어로 성적 뜻이 아님 — 유지. 참고만: w-packedcell `pak`은 형태소가 아니라 `pick`·`back` 같은 닮은 조각이 나음(권장).

## context 핸드오프 모양 (v46 7번) 전수
word가 세 장면 en 모두에 있음(16/16, 스크립트). 어색한 장면은 모두 `가족에게`이고 나머지 두 장면의 듣는 사람과 다름.
| 상황 | word | 판정 |
|---|---|---|
| 0 confirm · 4 sign · 7 calcium · 10 need · 11 watch · 14 trend | 일반인도 아는 말 | 고침 N1~N6 |
| 2 warmer | 일반어에 가까움, 어색함은 in-line·outlet temperature | 권장 R1 |
| 9 ratio | 일반어, 어색함은 1:1:1 | 권장 R2 |
| 17 cardiac | 맞음. fix "The blood we're giving is weakening his heart's squeeze"는 가족에게 수혈이 심장을 해친다고 들림 | 권장 R3 |
| 5 baseline · 6 cooler · 12 coags · 13 acidosis · 16 deteriorate · 18 edema · 19 release | 맞음 | 유지 |
swap ko 5개는 모두 바꾼 문장의 뜻과 맞음. swap 이어 붙인 문법 15조합 모두 문법 맞음(스크립트).

## 권장 (고치면 좋음 — 개수에 안 셈)
- **R1 context 2** 가족 장면 `All products are infused through an in-line warmer at a set outlet temperature.` → `Every unit is routed through the in-line warmer.`(어색함을 warmer 쪽으로)
- **R2 context 9** 그대로 두어도 됨. 바꾼다면 가족 장면 `We're keeping his blood products at a set ratio.`
- **R3 context 17 fix** → `The blood we're giving lowers his calcium, which his heart needs, so we're giving calcium to help.`
- **R4 tag** — `수술 부위`는 w-field 하나뿐 → `응고·검사`. `응고·검사`에 산-염기 단어(arterial·gas·lactate·acidosis·pH)가 섞임 → `산-염기` 태그로 분리. w-venous(TACO 장면) → `수혈 반응`, w-level(칼슘 수치) → `전해질`, w-report(example TRALI) → `수혈 반응`.
- **R5 chips** — w-match `[[mat, ch]]` → `[[match]]`, w-urine `[[uri, ne]]` → `[[ur, ine]]`.
- **R6 w-cooler ko `(혈액) 쿨러`**는 음역이라 영어 고르기에서 답이 보임 — `(혈액) 운반 냉장 상자`도 가능하나 수술실에서 실제로 '쿨러'라 부르니 판단에 맡김.

## 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)
KP en을 바꾸기로 하면 `in-or-massive-transfusion.json`의 `keyPhrases` 같은 문자열도 함께 바꿔야 V4가 통과합니다. chunks·ko·words·v46 필드·example·order 줄 연쇄는 위 문장과 같음.
- **K1 16.1** `Let's give calcium, insulin, and glucose.` · 문제: 간호사 투약 결정으로 읽힐 수 있음 · 대안 `Calcium, insulin, and glucose are ordered—let's get them ready.` · **권고: 유지**(표준 처치로 사실 맞고, 수술실 위기에서 팀이 실제로 이렇게 말함; v46 why에 "마취과 의사의 처방에 따라"를 넣을 것)
- **K2 17.2** `Push calcium and recheck immediately.` · 문제: 명령형 투약 · 대안 `Calcium is going in now—let's recheck right after.` · **권고: 유지**(마취과가 지시하는 말로 듣고 따라 하는 장면으로도 맞음)
- **K3 19.2** `Should we activate a regional blood request?` · 문제: 미국에서 쓰는 절차 이름이 아님(병원 혈액은행이 지역 공급처에 긴급 주문) · 대안 `Should we ask the blood bank to order from the regional supplier?` · **권고: 바꾸는 쪽 약하게**(질문형이라 범위 문제는 없고 틀린 사실도 아님 — 유지해도 안전에는 지장 없음. 바꾸면 order 19 셋째 줄·S3와 맞추기 쉬움)
- **K4 KP chunks 구 경계(보고만)** — 6.1 `The next / MTP cooler`, 8.2 `the room / temperature`(복합명사), 13.0 `an arterial / blood gas`, 16.2 `the rhythm—it could / deteriorate fast`, 19.0 `We're down / to our last / two units`, 19.2 `a regional / blood request`.
- 7.2·12.2·20.2(`Let's give …`) 제안 문장은 유지 권고(K1과 같은 이유).

## 개수
고칠 것 **39**(문장 S1~S4·S6 5 + chunks 3, 뉘앙스 N1~N13 13, 단어 W1~W6·W8~W10 9 + W7 cue 9) — 그중 **안전 2**(W1·N7). 권장 6, KP 결정 3(+chunks 보고 6).

## 종합
사실 바탕(칼슘·가온·TACO·TRALI·균형 비율)은 탄탄하고 기계 검사도 통과. 안전 2건과 문장 4건(쿨러 구성·호전 단정·지역 공급처 직접 연락·수술 중 마취과 호출), context 6개 word 교체만 반영하면 내보내도 됨.
