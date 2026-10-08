# er-stroke — v46 보강 검토 (er)

대상: `er-stroke.yaml` (상황 23 · 문장 161 · order 23장 · 뉘앙스 context 14 · swap 10). 문장 161개와 order 23장을 전부 봤다.
상황 번호는 파일 순서 0부터(S0 = FAST 초기 선별 … S22 = 악성 부종 감시), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 644줄, decoy를 청크 자리마다 바꿔 넣은 조립과 사이마다 끼운 조립(약 1,800줄),
order 인접 교환 69가지, order 줄 단어 수, context `word`가 어색한 장면(`ok: false`)의 `en`에 글자 그대로 있는지, swap `ko` 10건(정답을 넣은
문장과 대조), decoy·`distractorsKo` 중복, base와 v44 필드 비교(단어·문장·뉘앙스 모두 바뀐 것 없음).

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 문법도 맞고 장면상
그럴듯해도 `ko`가 걸러 주는 오답·decoy는 괜찮은 것으로 봤다(예: 2.6 `mouth`, 8.5 `doctor`, 10.2 `hear`, 18.4 `swelling`, 22.0 `bleeding`).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 말하는 방식의 이유(어순·완곡·공감·안전)를 짚고, 임상 사실도 맞다. 저작자가 꼽은 4건은 모두 맞다(자기 보고 4). 틀린 것 1건: 22.4 "동공은 뇌압 변화를 가장 빨리 보여 주는 신호"(가장 먼저 오는 것은 의식 저하이고, 동공 변화는 늦은 신호). 다듬을 것: 3.0(CT는 초기 경색을 잘 못 보여 준다), 4.2(선별 도구마다 시험량이 다르다), 1.6·7.3 둘째 문장이 문장과 상관없음. order why 7장은 아래 order 수정과 함께 고친다. |
| 2 | 빈칸 | 4 | `ko`까지 보면 정답이 둘인 문장은 없다. 같은 분야에서 틀린 말(2(a)·(b))이 대부분이고 관사도 잘 지켰다(18.2 `an urgent/an optional`). 고칠 것: 2.5 `a little normal`(문법으로 걸러짐)·`unsteady`, 10.4 `not` 빈칸(뒤집기만 남음), 장면과 동떨어진 비용·사람 묶음(3.1 `costly`, 5.2 `price`, 5.6 `costs`, 6.6 `costs`, 9.5 `free/cheap`, 4.6 `visitors/patients/nurses`, 20.6 `room/diet`, 22.6 `dietitian/chaplain`), 5.5 `easy`(논리로만 걸러짐). |
| 3 | `decoy` | 4 | `ko`에 맞는 다른 문장이 되는 decoy는 없다. 경계선 1개: 12.6 `tomorrow`(`ko` "다음에"와 거의 맞음). 돌려쓰기가 보인다: 시간 표현(`last night` 3, `what day`·`this morning`·`later today`·`tomorrow`·`tomorrow morning` 각 2)과 청구서 묶음(1.5 `to send a bill`, 5.6 `your bill`, 9.5 `for the bill`, 15.5 `your bill for`). |
| 4 | `distractorsKo` | 3 | 같은 상황에서 할 법한 말이 대부분이다(20.0·20.1처럼 아주 좋은 것도 많다). 고칠 것 23문장: 정답과 반만 다른 말 7(1.2·2.6·6.3·8.6·9.0·14.5·20.4), 뒤집기·아무도 하지 않을 말·틀린 사실 16(7.6·10.0·11.3·11.4·11.5·12.4·14.2·14.3·14.4·14.6·15.5·16.0·17.2·17.5·21.4·22.3·22.5 등). 다른 주제(약 45문장)보다 훨씬 적다. |
| 5 | `order` | 2 | 앞 줄을 가리키는 말로 묶은 설계는 잘 됐다(교환 69가지 중 열린 것 3가지: S15 1↔2·2↔3, S10 1↔2 약하게). 문제는 임상 흐름이다. **모든 환자에게 하는 확인을 조건부로 만든 줄 5장**(S1·S8·S9·S11·S21), **악화 뒤 한 시간 기다리는 인계**(S20), 시간 한정(S14 `Until then`, S22 `Until they arrive`), 간호사가 동의를 받는 흐름(S17), 억지 연결(S0 `keep that smile`, S7 `Even with that eye covered`, S12 `With that timing in mind`). 15단어 넘는 줄 9개. `ko` 머리말은 모두 카드 내용과 맞다. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 상황 안에서 일관된다. 아이콘이 어긋나는 것은 사소하다: 2.4 `gear`(산소포화도), 10.6 `gear`(손 쥐기 세기), 팔 검사·체위 변경에 `bandage`(0.1·5.4·16.4). |
| 7 | context `word`·`ko`, swap `ko` | 2 | swap `ko` 10건은 모두 정답을 넣은 문장의 뜻이고, context `ko`도 `word`의 뜻으로는 정확하다. 그러나 **context 14건 중 11건은 `word`가 어색한 장면 `en`에 없다**(TASK 자기 점검 9번 위반). 있는 것은 S5 `score`, S17 `consent`, S20 `deterioration`뿐이다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진 빈칸 오답 약 9문장, 관사·문법으로 걸러지는 것 1(2.5). (3) order 못 박기: 대체로 잘 됨, 열린 카드 2장(S15, S10 약함). (4) 임상 순서·사실: order 9장, why 1건(22.4). (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **S20 order L4 `Given that increase, repeat CT is in one hour, so please call me if his exam changes.`** — tPA를 시작한 뒤 NIHSS가 12 → 15로
   올랐으면 투여 중이면 멈추고, 의사에게 알리고, **응급(stat) 두부 CT**를 찍는다. "점수가 올랐으니 한 시간 뒤 재촬영"은 신경학적 악화를 보고도
   기다리라고 가르친다. 같은 주제 S18(악화 → 즉시 중단 → 긴급 재촬영)과도 어긋난다. why("그 증가를 근거로 후속 계획")도 같은 흐름이다.
2. **S11 order L4 `If you did miss any, let's check when you took your last dose.`** — 마지막 복용 시각은 항응고제를 먹는 뇌졸중 환자 **모두**에게
   확인한다(혈전용해제 적응 판단, DOAC는 48시간 안 복용 여부). 거른 적이 있을 때만 묻는 흐름은 틀렸다. why("걸렀다면 마지막 복용 시각을 확인해요")도 같다.
3. **모든 환자에게 하는 확인을 조건부로 만든 줄(TASK 10번)** — S9 L3 `If not, are you taking any blood thinners?`(뇌출혈 병력이 없을 때만 항응고제를 묻는다,
   항응고제는 누구에게나 묻는다), S8 L3 `If you did, when exactly did you notice the weakness…?`(밤중에 정상으로 깼을 때만 발견 시각을 묻는다),
   S21 L3 `If so, when did the neck pain start…?`(목 외상이 있을 때만 목 통증 시점을 묻는다, 경동맥 박리는 외상 없이도 흔하다),
   S1 L4 `If so, I'll need their phone number…`(목격자가 다시 봤을 때만 연락처를 받는다, 오히려 다시 보지 않았다면 그 사람 진술이 기준 시각이 된다).
   해당 카드의 why도 같은 조건을 가르친다.
4. **S22 order L4 `Until they arrive, check his pupils every fifteen minutes.`** — 장면 역할이 **가족**인데 가족에게 동공 확인을 지시하고, 새로 한쪽 동공이
   커진 응급 상황에서 "팀이 올 때까지 15분마다"는 간격도 너무 길고 시간 한정이다(이어진 검토에서 되풀이된 갈래).
5. **22.4 why "동공은 뇌압 변화를 가장 빨리 보여 주는 신호 중 하나"** — 뇌압 상승에서 가장 먼저 오는 것은 의식 수준 저하이고, 동공 변화(한쪽 산동)는
   비교적 늦은 신호다. 학습자가 동공만 보고 의식 저하를 놓칠 수 있다.
6. **S17 order L3 `With all of that explained, I need your consent…`** — 간호사가 시술을 설명하고(L1·L2) 동의를 요청하는 흐름이다. 같은 주제 17.2·17.6 why와
   S17 context why는 "설명 동의는 시술 의사가 받고, 간호사는 서명에 입회"라고 가르친다. 카드가 그 원칙과 어긋난다.
7. **context `word` 11/14가 어색한 장면에 없다** — 화면 제목 "`slurred`가 어색한 장면은?"이 성립하지 않는다(어색한 장면은 `dysarthria`를 쓴다). 아래 C1.

## 저작자 자기 보고 판정

1. **같은 분야 오답이 그럴듯한 빈칸** — **둘 다 그대로 둬도 된다.**
   - 15.1 `We need [medication/surgery/rest] to prevent a full stroke.`: `medication`(항혈소판제)·`surgery`(경동맥 내막 절제술)는 임상적으로도 맞는 말이지만,
     낱장 머리의 `ko` "검사가 필요해요"가 정답을 하나로 정한다. 같은 분야에서 틀린 말이라 파일럿 2(b)에 맞는 좋은 오답이다.
   - 18.4 `…could mean [infection/clotting/swelling] in the brain.`: `swelling`·`clotting`도 tPA 뒤에 생길 수 있지만 `ko` "뇌출혈"이 거른다. 같은 이유로
     22.0 `bleeding`, 12.4 `stroke`, 2.4 `sugar`, 8.5 `doctor`도 괜찮다.
2. **`distractorsKo`가 같은 상황의 다른 문장과 뜻이 비슷함** — **문제 아니다.** 브리프가 요구하는 것이 "같은 상황에서 실제로 할 법한 다른 말"이라 다른 문장의
   뜻과 닮는 것은 자연스럽다(10.5 ↔ 10.3, 21.5 ↔ 21.0, 2.4 ↔ 2.0). 문제가 되는 것은 **정답 `ko`와** 반만 다른 7문장뿐이다(아래 K1~K7).
3. **뒤집기 성격 오답을 남긴 여섯 문장** — 다섯은 허용, 하나는 고친다.
   - 허용: 15.0 `minor/harmless/common`(문장이 모순되지 않고 같은 분야의 크기 대비), 14.1 `raise` + decoy `quickly`(why가 가르치는 "안전하게 vs 빠르게"와 맞음),
     16.2 `low` + decoy `a little high`(방향·정도 대비, `ko`가 거름), 20.1 `down/back/close`(why가 가르치는 것이 바로 방향 `up`), 15.2(선택지 `explain/fix/report`와 decoy `relax`는 뒤집기가 아니다).
   - **고칠 것: 10.4 `Blink once if that's [not] right.`** — 선택지 `exactly/always/really`가 전부 "맞으면"이라 `not` 하나만 다르고, 가르치는 말이 `not`이다.
     decoy `twice`도 10.0의 약속(두 번 = 예)을 뒤집은 것이다. 빈칸을 `right`로 옮긴다(아래 B2).
4. **`why` 임상 사실** — **모두 맞다.**
   - 7.3 복시에서 한쪽 눈 가리기: 맞다. 한쪽을 가리면 사라지는 복시는 두 눈의 정렬 문제(뇌간·뇌신경 쪽)이고, 가려도 남으면 눈 자체의 문제다. 둘째 문장
     "환자의 답을 정확히 전달하는 것이 간호사의 몫"은 이유가 아니니 이 구분으로 바꾸면 좋다(W5).
   - 6.3 좌측 중대뇌동맥 폐색 → 오른쪽 위약·언어 문제: 맞다.
   - 12.2·12.3 와파린·INR: 맞다(음식의 비타민 K·다른 약에 따라 효과가 달라져 INR로 감시). 12.2가 "와파린 같은 약"이라고 한정한 것도 정확하다(DOAC는 INR로 보지 않는다).
     다만 S12 order는 약 종류와 상관없이 INR을 묻는 흐름이라 why에 "와파린이면"을 넣으면 좋다(O8).

## 고칠 것

### order (19)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| O1 | S0 L2 | `keep that smile and hold both arms straight out` — 웃음을 유지한 채 팔 검사를 하지 않는다. 순서를 못 박으려 만든 동작 | `Thank you. Now hold both arms straight out.` (L1 `First,`가 1번을 고정하고, L3 `While your arms are up`이 2↔3을 잠근다). why의 "얼굴 확인에서 만든 자세를 팔 검사가 이어받고"도 고친다 |
| O2 | S1 L4 | `If so,` — 목격자 연락처는 조건 없이 받는다(심각 3) | `Either way, I'll need that person's phone number so we can confirm the time.` why의 "맞다면 연락처를 받아요" → "어느 쪽이든 연락처를 받아요" |
| O3 | S2 L4 | 16단어 | `Once all of that is done, I'll recheck your sugar.` |
| O4 | S6 L3 | 16단어 | `Before we use it, any surgery or bleeding in the past two weeks?` |
| O5 | S7 L3 | `Even with that eye covered, does the room feel like it's spinning?` — 현훈 문진은 눈 가리기와 상관없다. 억지 연결 | `Along with the double vision, does the room feel like it's spinning?` why도 "그 상태에서 방이 도는지" → "복시와 함께 방이 도는지" |
| O6 | S8 L3·L4 | `If you did,` — 발견 시각은 누구에게나 묻는다(심각 3) | L3 `Either way, when exactly did you notice the weakness this morning?`, L4 `Since that still leaves the start time unclear, the scan will guide us.` why의 "깼다면" 삭제 |
| O7 | S9 L3·L4 | `If not,` — 항응고제는 누구에게나 묻는다(심각 3). L4 `with those answers in mind`도 부자연스럽다 | L3 `Are you taking any blood thinners?` (L2 `First,`와 L4 `Last,`가 자리를 고정한다), L4 `Last, do you know if you have any bleeding disorders?` why의 "아니라는 답을 이어받아" 삭제 |
| O8 | S10 L2 | `For your answers,`는 L1 없이도 첫 줄이 될 수 있어 1↔2가 약하게 열림 | `For those questions, blink twice for yes and once for no.` |
| O9 | S11 L4 | 마지막 복용 시각을 거른 경우에만 묻는다(심각 2) | `Either way, let's check when you took your last dose.` why "걸렀다면" → "거른 적이 있든 없든" |
| O10 | S12 L3·L4 | L3 `With that timing in mind`는 INR과 복용 시각을 억지로 묶는다. L4 16단어 | L3 `Besides that time, do you know your most recent INR value?`, L4 `If it's high and bleeding is severe, we may need to reverse it.` why에 "와파린이면 INR을 묻고"를 넣는다 |
| O11 | S14 L4 | `Until then` — 시간 한정, 16단어 | `Whatever that number shows, tell me right away if your vision changes or headache worsens.` why "그때까지" 삭제 |
| O12 | S15 L2·L3 | 1↔2(`It was likely…` ▸ `Even though it passed…`)와 2↔3(`That's why we need tests…`가 L1 바로 뒤에도 붙음)이 열림 | L2 `That warning was likely a mini-stroke, and it can happen again.`, L3 `To keep it from happening again, we need tests to find the cause.` |
| O13 | S16 L3·L4 | 16단어 둘 | L3 `If you vomit during that, we'll turn you on your side for your airway.`, L4 `On your side now, can you squeeze my hand and open your eyes?` |
| O14 | S17 L3 | 간호사가 동의를 받는 흐름(심각 6) | `Now that the doctor has explained all of that, we need your consent.` why "설명이 끝난 상태에서 동의를 요청" → "의사의 설명이 끝난 뒤 서명을 요청" |
| O15 | S18 L3 | 18단어 | `Now that it's stopped, we need an urgent head scan to check for bleeding.` |
| O16 | S20 L4 | 악화 뒤 한 시간 기다리는 인계(심각 1), 17단어 | `Given that increase, the tPA is stopped and a stat CT is ordered.` why "그 증가를 근거로 후속 계획과 연락 요청" → "그 증가 때문에 투여를 멈추고 응급 CT를 냈다고 알려요" |
| O17 | S21 L2·L3·L4 | L3 `If so,`(심각 3), L2 16단어, L3를 `Either way`로 바꾸면 L4와 겹침 | L2 `One cause is a torn neck artery—did you have any neck injury?`, L3 `Either way, when did the neck pain start compared to the numbness?`, L4 `To check for that tear, we'll image the neck vessels.` why "있었다면" 삭제 |
| O18 | S22 L4 | 가족에게 동공 확인 지시, "올 때까지 15분마다"(심각 4) | `While they come, I'll stay right here and keep checking his pupils.` why "팀이 오기 전까지 동공을 15분마다 확인하게 해요" → "팀이 오는 동안 곁에서 계속 지켜본다고 알려요" |
| O19 | S13 (참고) | 상황 brief는 "통역 확보 전이라도 **발병 시각을 우선**"인데 카드는 시각을 맨 끝에 묻는다 | 고치지 않아도 되지만, 바꾼다면 L3·L4 순서를 시각 → 근력으로 다시 묶는다 |

### why (5)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| W1 | 22.4 | "가장 빨리 보여 주는 신호" — 사실 오류(심각 5) | "동공 변화는 뇌압이 이미 많이 올랐다는 신호라, 의식 수준과 함께 간격을 정해 반복해서 봐요. for now는 …(뒷부분 그대로)" |
| W2 | 3.0 | "출혈인지 혈전인지부터 가려요" — 비조영 CT는 출혈은 잘 보지만 초기 경색·혈전은 잘 보이지 않는다 | "응급 두부 CT는 먼저 출혈이 있는지를 가려요. 초기 경색은 CT에 잘 안 보일 수 있지만, 출혈이 없어야 혈전용해제를 쓸 수 있어요." |
| W3 | 4.2 | "처음에는 아주 적은 양으로 시험해야" — 병원 선별 도구에 따라 다르다(Yale 선별은 90 mL를 끊지 않고 마시게 함) | "병원 선별 도구에 따라 양이 다르지만, small sip으로 시작하면 …"처럼 한정하거나 "small을 붙여 한 번에 많이 마시지 않게 해요"로 말하기 방식의 이유로 바꾼다 |
| W4 | 1.6 | 둘째 문장 "그 사람이 환자의 평소 모습을 아는지도 함께 확인해요"는 이 문장과 상관없다 | "the most recent로 '마지막으로 본 사람'을 한 번에 짚어요." |
| W5 | 7.3 | 둘째 문장이 이유가 아님 | "사라지면 두 눈의 정렬 문제(뇌간·뇌신경 쪽), 그대로면 눈 자체의 문제를 먼저 생각해요." |

### 빈칸 (8)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| B1 | 2.5 | `a little normal`은 문법으로 걸러지고 `a little unsteady`는 혈당에 쓰지 않는다 | `normal` → `elevated`, `unsteady` → `unstable` |
| B2 | 10.4 | `not` 빈칸 — 선택지가 전부 "맞으면"이라 뒤집기만 남음(자기 보고 3) | `answer: right`, 선택지 `right / clear / finished / comfortable` |
| B3 | 9.5 | `free/cheap` — 장면과 동떨어짐 | `free` → `effective`, `cheap` → `available` |
| B4 | 3.1 · 5.2 · 5.6 · 6.6 | 비용 묶음 돌려쓰기(`costly`, `price`, `costs`, `costs`) | 3.1 `costly` → `uncomfortable`, 5.2 `price` → `size`, 5.6 `costs` → `doses`, 6.6 `costs` → `benefits` |
| B5 | 4.6 | `visitors/patients/nurses` — 결과 자리에 사람 | `visitors` → `doctors`, `patients` → `therapists`(삼킴 평가를 하는 언어치료사), `nurses`는 그대로 (`labs`는 "결과"와 같은 뜻이라 쓰지 않는다) |
| B6 | 20.6 | `room/diet` — 인계에서 동떨어짐 | `room` → `vitals`, `diet` → `pressure` (`ko` "신경학적 검사"가 거름) |
| B7 | 22.6 | `dietitian/chaplain` — 뇌부종 보고와 동떨어짐 | `dietitian` → `radiologist`, `chaplain` → `cardiologist` |
| B8 | 5.5 | `even if it's easy` — 논리로만 걸러짐 | `easy` → `long` |

### decoy (2)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| D1 | 12.6 | `tomorrow`가 `next time` 자리에 들어가면 `ko` "다음에"와 거의 맞음 | `to the pharmacy` |
| D2 | 1.5 · 5.6 · 9.5 · 15.5 | 청구서 decoy 돌려쓰기 | 1.5 `to send your results`, 5.6 `your weight`, 9.5 `for the pharmacy`, 15.5 `of a heart attack` |

(시간 표현 decoy 돌려쓰기 — `last night`·`what day`·`this morning`·`later today`·`tomorrow`·`tomorrow morning` — 는 문장마다 `ko`가 걸러 주므로 고치지 않아도 된다.)

### distractorsKo (23)

정답 `ko`와 반만 다른 말:

| # | 어디 | 지금 | 바꿀 말 |
|---|---|---|---|
| K1 | 1.2 | `어젯밤에 식사를 하셨나요?` (정답의 "어젯밤 저녁식사"와 겹침, 보호자에게 '하셨나요'도 어긋남) | `그가 어젯밤 몇 시에 잠자리에 들었나요?` |
| K2 | 2.6 | `수액을 걸어 드릴게요` (정맥으로 당 주기와 겹침) | `혈당이 오를 때까지 옆에 있을게요` |
| K3 | 6.3 | `오른쪽 팔의 맥박이 약해요` ("오른쪽…약해"가 겹침) | `오른쪽 입꼬리가 처져 보여요` |
| K4 | 8.6 | `밤에 같이 주무신 분이 계셨나요?` (깨어 있던 사람 ↔ 같이 잔 사람) | `밤에 화장실에 몇 번 가셨나요?` |
| K5 | 9.0 | `약을 먹고 출혈이 있었던 적이 있나요?` (큰 출혈과 겹침) | `최근에 치과 치료를 받으셨나요?` |
| K6 | 14.5 | `시야가 좋아지면 알려 주세요` (좋아지는 것도 "변화") | `팔다리에 힘이 빠지면 알려 주세요` |
| K7 | 20.4 | `혈압은 안정적이었고 혈당도 정상이었습니다` (앞 절이 정답과 똑같음) | `산소포화도는 98%였고 산소는 쓰지 않았습니다` |

뒤집기·아무도 하지 않을 말·틀린 사실:

| # | 어디 | 지금 | 바꿀 말 |
|---|---|---|---|
| K8 | 7.6 | `이 증상은 대부분 곧 사라져요`, `이 증상은 약만 드시면 돼요` | `이 증상은 귀 문제일 수도 있어요`, `걷기 검사를 한 번 더 해 볼게요` |
| K9 | 10.0 | `눈을 깜빡이지 말고 가만히 계세요` (정답에 "말고"를 붙인 뒤집기) | `고개를 끄덕여서 대답해 주세요` |
| K10 | 11.3 | `빠른 심장박동은 위험하지 않아요` | `혈압이 높으면 혈관이 약해질 수 있어요` |
| K11 | 11.4 | `그 혈전은 혈액검사에서 바로 보여요` (틀린 사실) | `심전도로 리듬을 계속 지켜볼게요` |
| K12 | 11.5 | `약은 증상이 있을 때만 드시면 돼요` (위험한 복약 지도) | `약은 매일 같은 시간에 드세요` |
| K13 | 12.4 | `INR이 높으면 혈전이 더 잘 생겨요`, `INR이 높으면 약을 한 알 더 드셔야 해요` (둘 다 틀린 사실) | `INR은 피가 굳는 데 걸리는 시간을 보여 줘요`, `지금 피를 뽑아 INR을 다시 볼게요` |
| K14 | 14.2 | `약을 드시면 알려 주세요` (어색함) | `숨이 차면 바로 말씀해 주세요` |
| K15 | 14.3 | `혈전 치료는 수치와 상관없이 시작해요` (틀린 사실, 14.0과 모순) | `혈압약은 정맥으로 들어가요` |
| K16 | 14.4 | `혈압이 괜찮으면 퇴원할 수 있어요` (장면 밖) | `혈압약이 들어가면 조금 어지러울 수 있어요` |
| K17 | 14.6 | `갑작스러운 두통은 진통제만 드시면 돼요` (위험한 말) | `두통이 언제 시작됐는지 기록할게요` |
| K18 | 15.5 | `치료받지 않으면 약이 부족해요` (말이 안 됨) | `치료 계획은 신경과 의사가 정해요` |
| K19 | 16.0 | `눈을 감고 천천히 숨을 쉬세요` (의식 저하 환자에게 하지 않는 말) | `지금 어디가 제일 아프세요?` |
| K20 | 17.2 | `동의서는 시술 후에 받을게요` (하지 않는 말) | `시술 의사가 곧 와서 설명할 거예요` |
| K21 | 17.5 | `치료 시간이 지날수록 비용이 올라가요` | `시술은 한두 시간쯤 걸려요` |
| K22 | 21.4 | `이런 뇌졸중은 나이가 많을 때만 생겨요` (틀린 사실, 21.3과 모순) | `목 통증이 심해지면 바로 말씀해 주세요` |
| K23 | 22.3 · 22.5 | 22.3 `이런 일은 며칠에 걸쳐 서서히 좋아져요`·`약을 먹으면 바로 가라앉아요`, 22.5 `동공이 한쪽만 커지면 반드시 눈 질환이에요` (거짓 안심·단정) | 22.3 `뇌압을 낮추려고 침대 머리를 올릴게요`·`의사가 곧 와서 동공을 다시 볼 거예요`, 22.5 `동공 크기를 기록해 둘게요` |

### context `word`·`ko` (11, C1)

`word`가 어색한 장면(`ok: false`) `en`에 없는 11건. 그 장면에 실제로 있는 말로 바꾼다.

| 상황 | 지금 `word` / `ko` | 어색한 장면에 있는 말 | 바꿀 `word` / `ko` |
|---|---|---|---|
| S0 | slurred / 뭉개진 | dysarthria and facial palsy | `dysarthria` / 구음장애 |
| S1 | normal / 정상인 | premorbid baseline | `baseline` / 평소 상태 |
| S4 | drink / 마시다 | ingest fluids | `ingest` / 섭취하다 |
| S7 | stroke / 뇌졸중 | cerebellar infarct | `infarct` / 경색 |
| S8 | wake / 깨다 | neurologically intact moment | `intact` / (신경학적으로) 이상 없는 |
| S9 | safe / 안전한 | absence of contraindications | `contraindications` / 금기 사항 |
| S13 | interpreter / 통역사 | linguistic support personnel | `linguistic support` / 언어 지원(통역) |
| S14 | headache / 두통 | exacerbation of cephalalgia | `cephalalgia` / 두통 |
| S15 | stay / 머무르다 | Discharge is not recommended | `discharge` / 퇴원 |
| S18 | stop / 멈추다 | has been discontinued | `discontinued` / 중단된 |
| S22 | pupil / 동공 | anisocoria with impending herniation | `anisocoria` / 동공 부등 |

(S5 `score`, S17 `consent`, S20 `deterioration`은 어색한 장면에 있다. swap `ko` 10건은 모두 맞다.)

### tag·icon (2, 사소)

| # | 어디 | 고칠 방법 |
|---|---|---|
| I1 | 2.4 | `gear` → `monitor` (산소포화도 측정기) |
| I2 | 10.6 | `gear` → `me` (손 쥐기) |

### 보고만 (base 청크, 고치지 않음)

구 경계를 끊은 청크: 4.3 `dry, but we test`, 13.1 `This arm—when`, 16.0 `to stay with me—can`, 19.0 `Stay with me—can`, 22.1 `is now larger—that's`. v44 필드라 v46 보강에서는 손대지 않는다.

## 고칠 것 개수

order 19(참고 1 포함) · why 5 · 빈칸 8 · decoy 2 · distractorsKo 23 · context word 11 · icon 2 — **합계 70**(심각 7건은 이 안에 포함).

## 종합

문장 낱장(빈칸·decoy)은 `ko` 기준으로 정답이 둘인 것이 없고, 같은 분야에서 틀린 말을 고르는 원칙도 잘 지켰다. 그러나 order 카드의 임상 흐름
(조건부 확인 5장, S20 악화 뒤 대기, S22 가족 지시)과 context `word` 11건, 22.4 why는 **고친 뒤에 내보내야 한다.** 고치면 내보내도 된다.
