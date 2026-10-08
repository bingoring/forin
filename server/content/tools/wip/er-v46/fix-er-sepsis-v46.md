# er-sepsis v46 보강 검토

대상은 `er-sepsis.yaml`(21상황, 문장 126개, order 21장, context 9건, swap 12건)입니다. 문장 126개는 전부 스크립트로 뽑아 봤습니다. 빈칸은 선택지 넷을 넣은 네 줄을, decoy는 청크 자리마다 바꿔 넣은 줄과 끝에 붙인 줄을, order는 인접 교환 세 가지(1↔2, 2↔3, 3↔4)를 출력해 한 줄씩 판정했습니다.
'정답이 둘'은 낱장 머리에 보이는 `ko`에도 맞는지를 기준으로 판정했습니다. 그 기준으로 정답이 둘인 빈칸은 없습니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 말하는 방식의 이유와 근거를 함께 줍니다. 사실을 고칠 곳이 8건입니다(9.0 패혈증=균혈증, 15.3 '2리터 이상' 기준, 14.0·14.2 통역 관행, 5.0에 승압제 빠짐 등). |
| 2 | 빈칸 | 2 | 장면과 동떨어진 오답이 약 50문장입니다(hungry/thirsty, door/window, pillows/blankets). 경로를 잘못 연결하는 그림(3.3·15.1·15.5)과 수액을 빼는 그림(6.1)도 있습니다. |
| 3 | `decoy` | 2 | 126개 중 약 90개가 시간·장소 부사구 틀(at home 11, for now 10, last night 10, for you 9, by hand 7)이라 읽기만 해도 걸러집니다. 위험한 문장이 되는 것 2건, `ko`에 맞는 문장이 되는 것 2건이 있습니다. |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말입니다. 역할을 뒤집은 것, 정답과 반만 다른 것, 위험한 처치가 9건입니다. |
| 5 | `order` | 3 | 인접 교환이 자연스러운 카드가 6장입니다. 임상 흐름의 빈틈도 있습니다(S12에 항생제 없음, S15에서 의사 요청 전에 승압제 시작, S14 3인칭 통역). |
| 6 | `tag`·`icon` | 4 | 태그는 짧고 상황 안에서 일관됩니다. S19 order 3번 줄의 `pill`(크래시카트) 하나가 어긋납니다. |
| 7 | context·swap `ko` | 4 | swap `ko` 12건은 모두 맞습니다. context는 `infection` 1건만 고치면 되고, `mottling`은 why만 다듬으면 됩니다. |
| 8 | 파일럿 갈래 | 2 | 갈래 2(동떨어진 오답)가 그대로 되풀이됐습니다. 갈래 3(순서를 못 박음) 6장, 위험한 처치를 오답으로 보이기 6곳이 있습니다. |

## 사실 오류·심각한 문제

1. **12.5 decoy `by itself`**: 끝에 붙이면 "Once the line is out, the infection usually starts to clear by itself."가 됩니다. 영어로 자연스럽고 `ko`와도 거의 같아서 정답이 둘입니다. 게다가 "라인만 빼면 항생제 없이 낫는다"는 위험한 말이 됩니다. 카테터 관련 균혈증은 라인을 빼더라도 항생제를 씁니다(IDSA).
2. **S12 order 카드에 항생제가 없습니다.** 순서가 배양 → (감염이면) 제거 → 가라앉음이라, 항생제를 배양 결과까지 미루는 흐름으로 읽힙니다. 패혈증 의심이면 배양 직후 경험적 항생제를 시작합니다.
3. **6.1 빈칸 `Without`/`Instead of`/`Except for` fluids**: 조립하면 "Instead of fluids, we'll recheck it"이 되어, 젖산이 높은데 수액을 빼고 재검만 하는 그림이 됩니다. 1시간 번들에 반대되는 처치입니다.
4. **3.3 `oxygen`/`suction`/`ECG` line, 15.5 `urinary`/`feeding` line, 15.1 `oral`/`nasal`/`rectal` access**: 수액·승압제를 IV가 아닌 관이나 경로로 넣는 그림입니다(튜브 오연결은 Joint Commission 적신호 사건). 브리프가 금지한 "입으로 당"과 같은 갈래입니다.
5. **15.3 `Five`/`Ten`/`Twenty` liters in…, 15.0 dKo "수액을 한 팩 더 걸겠습니다"**: 수액 불응 쇼크에서 승압제를 미루고 수액을 더 주는 그림입니다.
6. **9.0 why** "폐렴이 혈류로 퍼져 전신 반응(패혈증)이 되면": 패혈증은 균이 혈류로 퍼진 것(균혈증)이 아닙니다. 감염에 대한 몸의 조절되지 않은 반응입니다(Sepsis-3). 균혈증이 없는 패혈증이 흔합니다.
7. **14.0·14.2 why**가 미국 통역 관행에 어긋나는 말투를 칭찬합니다. 14.0은 "Through the interpreter를 앞에 두어 밝힌다", 14.2는 "통역사에게 부탁하는 문장이라"입니다. 미국 병원 표준(NCIHC, 병원 통역 지침)은 통역사를 보지 않고 **환자·가족을 보며 1인칭으로 직접** 말하는 것입니다. 두 문장은 keyPhrase라 바꿀 수 없으니 why로 바로잡습니다(아래 F).
8. **5.3 "We have one hour to get all four of these done."**(+ S5 order 2번 줄, S5 context fix): 1시간 번들은 한 시간 안에 **시작**하는 것이지 끝내는 것이 아닙니다(SSC 2018 Hour-1). 5.3의 why는 "시작하는 것을 목표로"라고 맞게 써서 문장과 서로 어긋납니다. 문장은 결정 11, order·fix는 v46으로 고칩니다.

## 저작자 자기 보고 판정

1. **동떨어진 명사로 채운 자리**(3.1 rare/unusual/special, 5.4 thirsty/asleep/hungry, 12.5 light/door/bed): 위험한 처치를 피한 판단은 맞습니다. 다만 결과가 갈래 2(동떨어진 오답)여서 빈칸을 가르칠 말로 옮깁니다.
   - 3.1: `pass`로 옮깁니다 — 오답 `last`/`stay`/`return`.
   - 5.4: `stable`을 두고 오답만 바꿉니다 — `cured`/`discharged`/`awake`.
   - 12.5: `out`으로 옮깁니다 — 오답 `in`/`taped`/`open`.
   - 같은 이유로 5.1(hungry/thirsty/tired)은 `lactate`로 옮기고 오답 `sodium`/`potassium`/`calcium`을 씁니다.
2. **"Please ask her…" 3인칭 통역**: 미국 관행과 어긋납니다. 14.0·14.2는 keyPhrase라 결정 11로도 바꿀 수 없으니 보고만 하고, why를 관행에 맞게 고칩니다. S14 order 1·3·4번 줄은 1인칭으로 다시 씁니다(G-6). 14.3 "Ask the interpreter to find out…"은 keyPhrase가 아니라 결정 11 후보입니다(J-2).
3. **남긴 `If`/`Once` 줄**
   - S8 4번 "If we find one, we may need to drain it.": 진짜 조건입니다. 막힘이 있는 요로성 패혈증에서만 감압·배액을 합니다. 그대로 둡니다.
   - S12 3번 "If it is infected, … remove the line": 진짜 조건입니다. 제거 여부는 라인 감염 판단과 라인 종류에 따라 다릅니다. 다만 카드에 항생제가 없어서 고칩니다(G-5).
   - S15 4번 "Once they place it, I'll move the pressor…": 1번 줄에서 승압제를 이미 말초로 시작하므로 미루는 말이 아닙니다. 그러나 15.1(keyPhrase) "Prepare for central access to run the pressor safely."는 "중심라인이 들어올 때까지 기다린다"로 읽힐 수 있습니다. 15.1·15.5 why에 "말초로 먼저 시작하고 기다리지 않는다"를 넣습니다(F-6·F-7).
4. **context 정비 5건**(ctx-C #7 기준: 고친 뒤에도 어색한 장면이 어색하고, why가 지금 장면을 설명하는가)
   - `tachycardic`: OK. 차트 장면 "Febrile 38.9, tachycardic at 118, tachypneic at 26."의 `at`은 말투라 차트에는 조금 길지만 허용합니다.
   - `urine output`: OK. XX에 `0.5 mL/kg/hr`이 남아 어색함이 살아 있고, why도 수치를 말합니다(ctx-C #7과 같은 모양).
   - `baseline`: OK. 장면 1 "his baseline is fully oriented"는 "at baseline he's fully oriented"가 더 자연스럽습니다(선택).
   - `infection`: **고칠 것.** XX의 어색함은 `nasty…hang in there`라는 관용어에 있지 `infection`에 있지 않습니다. 가족에게 `infection`은 맞는 말이라 메모 "뜻은 셋 다 '감염' — 듣는 사람이 달라요"가 성립하지 않습니다(ctx-A #10 passed away와 같은 모양). 차트도 `urinary source`를 `urinary infection`으로 바꿔 차트 말에서 멀어졌습니다. 안은 H-1에 적었습니다.
   - `organ failure`: OK. 가족에게 AKI·shock liver·DIC를 늘어놓은 장면이라 어색함이 분명합니다.

## 고칠 것 (v46 필드) — 모두 93건

### A. 위험한 그림 — 빈칸·decoy·오답 뜻 (11건)

| 어디 | 문제 | 고칠 안 |
|---|---|---|
| 3.3 빈칸 | oxygen/suction/ECG line으로 수액을 혈액에 넣는 그림 | 빈칸을 `straight`로 옮기고 오답 `slowly`/`partly`/`gently` |
| 6.1 빈칸 | Without/Instead of/Except for fluids → 수액을 빼는 그림 | 오답을 `Before`/`During`/`Besides`로 |
| 15.1 빈칸 | oral/nasal/rectal access로 승압제를 주는 그림 | 빈칸을 `pressor`로 옮기고 오답 `antibiotic`/`saline`/`blood` |
| 15.3 빈칸 | Five/Ten/Twenty liters → 승압제를 미루고 수액만 더 주는 그림 | 빈칸을 `pressor`로 옮기고 오답 `monitor`/`warmer`/`timer` |
| 15.5 빈칸 | 승압제를 urinary/feeding line으로 주는 그림, central은 모순 | 빈칸을 `central`로 옮기고 오답 `arterial`/`dialysis`/`IO` |
| 12.5 decoy | `by itself` → "저절로 낫는다"이면서 `ko`와도 맞음(심각 1) | `at the desk` 같은 장소구로 |
| 3.3 decoy | `by mouth` → "IV 라인으로 입으로 수액" — 경로 혼동 | `for pain`, `into the bag` 같은 말로(`straight into your blood` 자리 대비) |
| 15.0 decoy | `for pain` → "start norepinephrine … for pain"(적응증이 틀림) | `in the hall` 같은 말로 |
| 4.1 decoy | `by itself` → "Measuring it by itself helps us know…"(소변량만 보면 된다 — 4.5 why의 "수치 하나만 보지 않고"와 반대) | `at night` 같은 말로 |
| 15.0 dKo | "수액을 한 팩 더 걸겠습니다" — 수액 불응 쇼크에서 승압제를 미루는 처치 | "중심라인 키트를 가져올게요" |
| 19.1 dKo | "카트는 문 밖에 두세요" — 정답("여기로")을 뒤집었고, 임박한 심정지에 하면 안 되는 말 | "모니터 알람 소리를 키울게요" |

### B. 장면과 동떨어진 빈칸 오답 → 같은 분야의 틀린 말로 (49건)

모든 안은 `ko`로 정답이 하나로 정해지고, 넣어 읽으면 문법이 맞으며, 위험한 처치를 그리지 않는 말로 골랐습니다.

| 문장 | 지금 오답 | 안 |
|---|---|---|
| 1.2 | hungry/thirsty/sleepy | 빈칸을 `belly`로 옮기고 오답 `back`/`throat`/`head` |
| 3.1 | rare/unusual/special | 빈칸을 `pass`로 옮기고 오답 `last`/`stay`/`return` (자기 보고 1) |
| 3.5 | tired/new/early | `alone`/`stuck`/`done` |
| 4.0 | teeth/nails/ears | 빈칸을 `output`으로 옮기고 오답 `culture`/`sample`/`smell` |
| 5.0 | vision/hearing (pregnancy는 둠) | `stool`/`urine`/`pregnancy` |
| 5.1 | hungry/thirsty/tired | 빈칸을 `lactate`로 옮기고 오답 `sodium`/`potassium`/`calcium` |
| 5.4 | thirsty/asleep/hungry | `cured`/`discharged`/`awake` (자기 보고 1) |
| 7.1 | hungry/thirsty/bored | `pale`/`shaky`/`sweaty` |
| 7.2 | holiday/birthday/wedding | `vaccine`/`allergy`/`fracture` |
| 7.4 | Hunger/Thirst/Boredom | `Dizziness`/`Tiredness`/`Weakness` |
| 7.5 | meals/visits/naps | `fevers`/`coughs`/`rashes` |
| 8.2 | forms/visits/meals | `oxygen`/`Tylenol`/`pain medicine` |
| 8.4 | cover/freeze/rub | `scan`/`numb`/`test` (`watch`·`clamp`는 위험한 그림이라 피함) |
| 8.5 | Pillows/Gloves/Blankets | `Vitamins`/`Painkillers`/`Antacids` |
| 9.1 | pillows/gowns/blankets | `Tylenol`/`cough medicine`/`breathing treatments` |
| 9.4 | ears/knees/eyes | `kidneys`/`heart`/`liver` |
| 10.1 | family/room/chart | 빈칸을 `fluid`로 옮기고 오답 `oxygen`/`rest`/`blood` |
| 10.2 | hope/food/money | 빈칸을 `start`로 옮기고 오답 `stop`/`try`/`fail` |
| 11.2 | maps/pictures/circles | `labs`/`a lactate`/`a blood gas` |
| 12.0 | Hiccups/Yawning/Sneezing | `Cramps`/`Itching`/`Nausea` (투석 중 증상) |
| 12.1 | plans/pictures/stories | `a CBC`/`a lactate`/`electrolytes` |
| 12.3 | breakfast/bathing/visiting | `a transfusion`/`surgery`/`an X-ray` |
| 12.4 | Freckles/Wrinkles/Tattoos | `Bruising`/`Itching`/`Dryness` |
| 12.5 | bed/light/door | 빈칸을 `out`으로 옮기고 오답 `in`/`taped`/`open` (자기 보고 1) |
| 13.1 | summer/school/winter | `children`/`infants`/`older adults` |
| 13.2 | weight/size/name | `movements`/`position`/`growth` |
| 13.5 | forms/rooms/visitors | 빈칸을 `safe`로 옮기고 오답 `strong`/`cheap`/`quick` (`pills`·`shots`는 정답과 같은 뜻이라 피함) |
| 14.3 | cousins/pets/hobbies | `implants`/`children`/`insurance` |
| 15.4 | door/floor/window | `consent`/`dressing`/`X-ray` (`kit`·`cart`는 정답이 둘이 되어 피함) |
| 16.0 | friends/nurses/relatives | `joints`/`muscles`/`bones` |
| 16.2 | hallway/elevator/kitchen | `family`/`chaplain`/`lab` |
| 16.4 | growing/aging/shrinking | `flowing`/`circulating`/`moving` |
| 16.5 | painting/counting/drawing | `recording`/`checking`/`watching` |
| 17.0 | mood/hunger/thirst | `potassium`/`sugar`/`temperature` |
| 17.3 | hair/nails/eyebrows | `knees`/`lips`/`ears` |
| 17.5 | lights/towels/curtains | `antibiotics`/`oxygen`/`blood tests` |
| 18.0 | blanket/pen/pill | `mask`/`nebulizer`/`nasal cannula` |
| 18.1 | painting/selling/counting | `checking`/`cleaning`/`moving` |
| 18.2 | loud/busy/tall | `awake`/`upright`/`seated` |
| 18.3 | laughing/sleeping/playing | 빈칸을 `hard`로 옮기고 오답 `slowly`/`quietly`/`gently` (`trying`·`struggling`은 정답이 둘이 되어 피함) |
| 19.0 | appetite/voice/mood | `temperature`/`oxygen`/`breathing` |
| 19.1 | chair/door/lamp | 빈칸을 `pads`로 옮기고 오답 `gloves`/`masks`/`gowns` |
| 19.2 | oven/radio/faucet | `suction`/`monitor`/`warmer` |
| 19.3 | Smell/Taste/Sound | 빈칸을 `thready`로 옮기고 오답 `bounding`/`strong`/`regular` (가르칠 임상어) |
| 19.5 | door/window/ceiling | `pump`/`IV site`/`clock` |
| 20.2 | lunch/breakfast/dinner | `intubation`/`dialysis`/`surgery` |
| 20.3 | Visitors/Meals/Forms | `Labs`/`X-rays`/`Consents` |
| 20.4 | floor/chair/window | `pump`/`bag`/`line` (`rate`는 정답이 둘이 되어 피함) |
| 0.1 | old/ordinary (obvious는 둠) | `obvious`/`unusual`/`isolated` (관사 `an`이 맞도록 모음으로 시작하는 말) |

### C. 문법으로 걸러지는 오답 (3건)

| 어디 | 문제 | 안 |
|---|---|---|
| 5.3 | `all two of these` — 비문(both) | `two`를 `six`로 |
| 2.5 | `Whether we know …, we can …` — or not이 없으면 비문 | `Whether`를 `Until`로 |
| 17.2 | `losing/hiding/leaving the physician back in` — 비문 | 빈칸을 `escalating`으로 옮기고 오답 `documenting`/`watching`/`rechecking` |

참고: 3.4의 `full/free/empty of breath`는 숙어 `short of breath`를 가르치는 자리라 둡니다.

### D. decoy (3건 + 전반 1건)

| 어디 | 문제 | 안 |
|---|---|---|
| 2.1 | `for you`가 `for your infection` 자리에 들어가 "That helps us pick the best medicine for you." — `ko`와 거의 같음 | `for the pain` |
| 5.4 | `from here`를 끼우면 "Each step from here moves you closer to being stable." — 자연스럽고 `ko`에 맞음 | `by tonight` |
| 15.5 | `all day`를 끼우면 "…peripheral line all day until central access is in" — 말초 승압제를 오래 두는 그림 | `in the hall` |
| 전반 | 약 90개가 시간·장소 부사구 틀이라 문장 끝에 붙여도 우습기만 해서 걸러집니다. 브리프가 권하는 것은 "같은 자리에 올 수 있는 구"나 "이 문장의 청크를 살짝 바꾼 것"입니다. | 다음 수정에서 상황마다 두세 개라도 청크 변형형으로 바꾸기를 권합니다(예: 9.4 `one by one` ↔ `at the same time`처럼). 이번 목록에서는 개수만 셉니다. |

### E. distractorsKo (10건)

| 어디 | 문제 | 안 |
|---|---|---|
| 15.4 | "제가 의사에게 전화할게요"·"트레이는 선생님이 가져오세요" — 둘 다 역할을 뒤집은 말이라 정답과 반만 다름 | "말초라인 부위를 확인할게요", "승압제 펌프를 세팅할게요" |
| 11.5 | "열이 없어도 계속 확인할게요" — 정답과 앞부분("열이 없어도")이 같음 | "체온은 한 시간마다 잴게요" |
| 6.5 | "내려가면 의사에게 알릴게요" — 정답의 "떨어지는"과 겹침 | "다음 채혈은 두 시간 뒤예요" |
| 12.2 | "제거는 의사가 정해요" — 정답의 "제거"와 겹침 | "드레싱을 새로 바꿀게요" |
| 17.5 | "승압제가 필요할 수도 있어요" — 정답("수액만으로는 부족")에서 바로 나오는 결론이라 겹침 | "소변량도 같이 확인할게요" |
| 19.5 | "모니터는 끄지 마세요" — 정답("모니터로 계속 지켜봐")과 겹치는 뒤집기 | "패드는 이미 붙였어요" |
| 20.4 | "승압제를 한 시간 전에 시작했습니다" — 정답의 "지난 한 시간"·"승압제"와 겹침 | "중심라인 위치는 X선으로 확인했습니다" |
| 5.2·8.2 | "팔에 따끔할 수 있어요" — 조사가 틀림 | "팔이 따끔할 수 있어요" |
| 9.4·10.4 | 두 문장이 같은 오답 짝("가슴 소리를 들어 볼게요"·"소변량을 확인할게요")을 씀 | 10.4는 "다리를 올려 드릴게요"·"수액 속도를 의사에게 확인할게요"로 |

(15.0·19.1은 A에 넣었습니다.)

### F. why (9건)

1. **9.0**: "폐렴이 혈류로 퍼져 전신 반응(패혈증)이 되면" → "폐렴 같은 감염에 몸이 지나치게 반응해 온몸의 장기가 영향을 받는 것이 패혈증이라 빠른 치료가 필요해요."
2. **14.0**(keyPhrase): "Through the interpreter를 문장 앞에 두어 … 먼저 밝혀요"를 뺍니다. 안: "believe로 확진 전의 판단임을 정직하게 말하면서 serious로 긴급성은 분명히 해요. 통역을 쓸 때도 통역사가 아니라 가족을 보며 직접 말해요."
3. **14.2**(keyPhrase): "통역사에게 부탁하는 문장이라"를 바꿉니다. 안: "where와 when 두 질문을 짧게 나눠 통역에서 뜻이 덜 흐려져요. 다만 미국 병원 표준은 통역사에게 'ask her'로 넘기기보다 환자를 보며 'Where do you feel pain?'처럼 직접 묻는 거예요."
4. **5.0**: 번들 요소에 승압제가 없습니다. 끝에 "수액 뒤에도 혈압이 낮으면 승압제까지가 1시간 번들이에요."를 덧붙입니다.
5. **15.3**: "수액 2리터 이상에도 혈압이 낮으면" → "충분한 수액(대개 체중 1 kg당 30 mL)을 준 뒤에도 MAP이 65 미만이면 승압제로 넘어가요. 수액 도중이라도 혈압이 너무 낮으면 미루지 않아요."
6. **15.1**(keyPhrase): 끝에 "다만 중심라인을 기다리느라 승압제를 미루지는 않아요 — 그동안은 굵은 말초정맥으로 먼저 시작해요."를 덧붙입니다(자기 보고 3).
7. **15.5**: "말초로 승압제를 먼저 시작하기도 하며" → "말초로 승압제를 먼저 시작하는 것이 권고돼요(SSC 2021). 그동안 주사 부위가 새는지 자주 살펴요."
8. **6.1**: "소생 처치 뒤 젖산을 다시 재서 … 표준이에요" → "처음 젖산이 높았으면(2 mmol/L 넘게) 소생 처치 뒤 다시 재서 내려가는지 확인해요."
9. **4.4·9.5**: "가장 빨리 보여 줘서", "가장 빠른 신호예요"는 과장입니다 → "일찍 보여 줘서", "중요한 신호예요".

### G. order (11건)

1. **S0** — 3↔4를 바꿔도 자연스럽습니다("That's why I'll recheck them"이 2번 줄 결과 뒤에 바로 이어짐). 또 SIRS 양성에 감염 의심이면 다시 재는 것만이 아니라 알려야 합니다.
   - 4번 줄 안: `So because of that warning sign, I'm letting the doctor know right now.` (`that warning sign`이 3번 줄을 가리킵니다)
2. **S5** — 3↔4를 바꿔도 자연스럽습니다(네 가지 → "그래서 하나씩 설명할게요" → "하나하나가 안정에 가깝게"). 2번 줄의 `done`은 사실 오류 8입니다.
   - 2번 줄 안: `Within the hour, we'll start four things: cultures, antibiotics, fluids, and a lactate test.`
   - 4번 줄 안: `When it does, tell me, and I'll explain each part as we go.` (`it does`가 3번 줄의 `feels like a lot`을 받습니다)
   - why에 승압제를 덧붙입니다("혈압이 계속 낮으면 승압제가 더해져요").
3. **S7** — 2↔3을 바꿔도 자연스럽습니다("To check for that"의 `that`이 1번 줄의 혼란을 가리킬 수 있음).
   - 3번 줄 안: `To find the infection behind it, has he had any recent infection, catheter problem, or wound?` → 고친 안이 `infection`을 두 번 써서 어색하므로 `To find where it's coming from, has he had a recent catheter problem, wound, or infection?`보다는 다음 안을 권합니다: `To find the source of that sepsis, has he had any recent catheter problem or wound?` (`that sepsis`가 2번 줄을 가리킵니다)
4. **S9** — 3↔4를 바꿔도 자연스럽습니다(`too`가 2번 줄 치료 뒤에도 맞음).
   - 4번 줄 안: `You can help me with that — tell me right away if breathing gets harder.` (`that`이 3번 줄의 지켜보기를 가리킵니다)
5. **S12** — 항생제가 없습니다(심각 2).
   - 2번 줄 안: `We'll draw cultures from the line and your arm, then start antibiotics right away.`
   - 3번 줄 안: `If the line turns out to be the source, we may need to remove it.`
   - 4번 줄은 그대로 두고, why를 고친 줄의 가리키는 말에 맞춥니다.
6. **S14** — 1·3·4번 줄이 3인칭 통역 부탁입니다(자기 보고 2). 미국 표준대로 환자를 보며 1인칭으로 말합니다(통역사가 옮김).
   - 1: `We believe you have a serious infection.`
   - 2: 그대로 둡니다.
   - 3: `Before I give you the antibiotic, do you have any allergies?`
   - 4: `Thank you. Now, where do you feel pain, and when did this start?`
   - why: "'That's why'가 1번 줄을, 'the antibiotic'이 2번 줄을, 'Thank you'가 알레르기 대답을 받아요. 통역을 써도 통역사가 아니라 환자를 보고 1인칭으로 말해요."
   - 교환 확인: 2↔3은 `That's why`가 알레르기 질문을 받게 되어 안 맞고, 3↔4는 `Thank you`가 받을 대답이 없어 안 맞습니다.
7. **S15** — 간호사가 의사를 부르기 전에 "I'm starting the pressor"라고 합니다. 승압제는 처방이 있어야 하니 평가·요청을 먼저 하고, 처방을 받으면 말초로 바로 시작합니다(자기 보고 3과 연결).
   - 1: `Two liters in and her MAP is still under sixty-five.`
   - 2: `That's septic shock — I need the physician at bedside for a pressor order.`
   - 3: `With that order, I'll start norepinephrine in her peripheral IV right away.`
   - 4: `Once the central line is in, I'll move the pressor over to it.`
   - 교환 확인: 1↔2는 `That's`가, 2↔3은 `that order`가, 3↔4는 `the pressor`를 옮기기 전에 시작한 적이 없다는 점이 막습니다.
8. **S18** — 3↔4를 바꿔도 자연스럽습니다("through all of that"의 `that`이 2번 줄 삽관을 가리킬 수 있음).
   - 3번 줄 안: `We'll give you medicine so you're asleep and comfortable for it.`
   - 4번 줄 안: `Until you fall asleep, I'll be right here — try to stay calm.` (`fall asleep`이 3번 줄을 받습니다. 시간으로 묶었지만 처치를 미루는 말이 아닙니다)
9. **S19** — 2↔3을 바꿔도 자연스럽습니다(3번 줄의 `it`이 1번 줄의 심정지를 가리킬 수 있음). 3번 줄 아이콘 `pill`도 어긋납니다.
   - 3번 줄 안: `When it gets here, put the pads on him right away.` (`it`은 2번 줄의 제세동기, 아이콘 `bolt` 또는 `siren`)
   - 4번 줄 안: `With the pads on, stay on the pressor and watch the monitor for arrest.`
10. **S20** — 4번 줄 "Holding like that, he's alert…"는 현수 분사라 영어가 어색합니다.
    - 안: `With pressure holding like that, he's alert, urine output's improving — ready for report.` (13단어)
11. **S16** — 3번 줄 "doing everything possible about those changes"가 어색한 영어입니다.
    - 안: `This is very serious, and the team is doing everything possible to support those organs.`

### H. context (2건)

1. **S14 `infection`** — base로 돌리고, 세 장면이 모두 쓰는 임상 줄임말 `urinary source`를 `word`로 합니다.
   - `word: urinary source`, `ko: 요로 감염원`
   - 장면 0(차트): `Suspected sepsis, likely urinary source. Family updated via Spanish interpreter.` (base 그대로)
   - 장면 1(의사): `She's likely septic from a urinary source — I updated the family through the interpreter.` (base 그대로)
   - XX(통역을 거쳐 가족에게): `She's septic from a urinary source, but hang in there.`
   - fix: base 그대로(`We believe she has a serious infection, and we are treating it now.`)
   - why: "septic·urinary source 같은 임상 줄임말과 hang in there 같은 관용어는 통역에서 그대로 옮겨지지 않아요. 가족에게는 짧고 분명한 말로 해요."
2. **S17 `mottling` why** — "mottling이라는 말을 쓰더라도 … 되고"는 핸드오프 CTX 모양(같은 말을 듣는 사람에게 맞지 않게)과 어긋나는 말입니다.
   - 안: "mottling·bilateral knees·cap refill 5초는 차트와 보고의 말이에요. 환자에게는 '피부가 얼룩덜룩하고 차가워진다, 순환이 힘겹다'고 쉬운 말로 풀어요."

참고(고칠 것에 넣지 않음): S5 context fix "four important things done"은 사실 오류 8과 같은 이유로 `started`가 맞습니다(장면 fix는 T8 범위라 고칠 수 있음). S0 `sepsis`는 세 장면 모두에 있고 어색함이 SIRS 기준·스크린 양성에 있습니다. ctx-C #7(수치·기준을 말한 것이 어색함)과 같은 모양이라 OK입니다.

### I. 아이콘 (1건)

- S19 order 3번 줄 `pill` → `siren`(G-9와 함께).

## 결정 11 — 보고(v44 문장, 수정 담당 판단)

1. **5.3** "We have one hour to get all four of these done." → `…all four of these started.` keyPhrase가 아니라 고칠 수 있습니다. 청크 `done`을 `started`로 바꾸고, `words`의 `w-done`을 `w-start`로 다시 태그합니다(사실 오류 8).
2. **14.3** "Ask the interpreter to find out if she has any allergies." — 통역사에게 문진을 맡기는 말입니다(통역사는 따로 정보를 캐지 않고 말을 옮기는 역할). keyPhrase가 아니라 고칠 수 있습니다. 안: `Through the interpreter, I'll ask her about any allergies.` / ko "통역을 통해 알레르기가 있는지 여쭤볼게요." (청크·words를 함께 맞춥니다)
3. **14.0·14.2**는 keyPhrase라 바꿀 수 없습니다(V4). why만 고칩니다(F-2·F-3).
4. **9.0** "Your pneumonia has spread to your whole body…"도 keyPhrase라 둡니다. 환자에게 하는 쉬운 말로는 허용되는 수준이고, why만 고칩니다(F-1).

## 종합

교정된 고칠 것은 v46 필드 93건(A 11, B 49, C 3, D 3, E 10, F 9, G 11, H 2, I 1 — 일부는 서로 겹침)이고, 결정 11 보고 2건(+keyPhrase 3건 보고)입니다. 사실 오류·위험한 그림 8건(특히 12.5 decoy와 S12 카드에 항생제 없음, 6.1·3.3·15.1·15.5 빈칸, 15.3 수액만 더 주기)을 먼저 고친 뒤 B의 동떨어진 오답을 바꾸면 내보낼 수 있습니다. 지금 상태로는 내보내지 않는 것을 권합니다.
