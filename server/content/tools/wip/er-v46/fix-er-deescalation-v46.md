# er-deescalation — v46 보강 검토 (er)

대상: `er-deescalation.yaml`(상황 20 · 문장 100 · order 20장 · 뉘앙스 context 5 · swap 15). 문장 100개와 order 20장을 **전부** 봤다.
번호는 **1부터** 센다. 상황은 파일 순서대로 S1(대기 지연 불만 환자) … S20(자의 퇴원(AMA) 갈등 완화), 문장은 `상황.문장`(예: 13.4), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것:
- 빈칸 `before + 선택지 + after` 400줄
- decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립 약 760줄
- order 인접 교환 60가지(20장 × 3)와 줄 단어 수
- context `word`가 세 장면 `en`에 있는지, base와 달라진 장면·`why`(S3 1곳, S13 1곳, S17 2곳+why)
- swap 15건의 `ko`
- 빈칸 오답·decoy·오답 뜻이 주제 안에서 몇 번 되풀이되는지, 아이콘 분포
- 위협·처벌·비꼬기·안전 거리 무시·혼자 대응·억제대를 벌로 쓰는 말, 낙인 표현 검색

`verify_one_theme.py er …/er-deescalation.yaml` → `==> 통과`(W13 경고 3건 `besides`·`scar`·`scared`는 v44 단어 쪽이라 이번 범위 밖).

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 '정답이 둘'은 **`ko`에도 맞는가**로 판정했다. 같은 분야의 다른 맞는 말이라도 `ko`로 걸러지면 정답이 둘이 아니다. context는 `review-ctx-A/B/C.md`와 같은 기준이다.
- 같은 `word`가 세 장면에 같은 뜻으로 나와야 한다.
- 어색함은 듣는 사람 때문이어야 한다("차트가 듣는 쪽인 반대 방향 대비"도 받아들인다).
- base가 이미 세 장면에 공유한 말은 그대로 둔다(TASK 9번).

이 주제의 설계상 버릇: 빈칸 오답과 decoy를 거의 모두 **정답의 반대말**로 만들었다. `ko`로 걸러지니 '정답 둘'은 생기지 않는다. 그러나 진정 대화의 반대말은 곧 **위협·무시·비꼬기·자리 뜨기·출구 막기**라서, 이 주제가 가르치지 말아야 할 말을 오답으로 계속 보인다. 그리고 반대말을 찾기 어려운 자리에는 돈·쇼핑·장소 같은 **동떨어진 말**을 넣었다.

공격성 진정 특별 점검:
- **위협·처벌**: 10.2 빈칸·decoy `I won't forget being spoken to that way`(앙갚음으로 들림), 4.3 `what I can do right now against you`, 2.3 `Tell me what would hurt right now`. 억제대를 벌로 쓰는 말은 새 필드에 **없다**(S16 swap의 `because you wouldn't listen`은 v45 오답이고, 왜 나쁜지 설명이 붙어 있다).
- **비꼬기·무시**: 4.2 `that's amusing/convenient`(+decoy `— that's amusing`), 4.1 `forget/dismiss/ignore what you really need`(+decoy `I forget`), 9.3 `ignore/forget/skip this`(+decoy `I'll ignore this`), 5.4 `pain like this is easy/pleasant/comfortable to sit with`(통증 깎아내리기), 20.2 `I want you to forget/ignore/doubt what the risks are`.
- **낙인**: 11.1 `treated with caution`(인종 때문에 불신하는 환자에게 '조심해서 다룬다'), 8.1 `treat it reluctantly/secretly`(진통제 요구 환자를 마지못해 치료).
- **안전 거리·출구**: 3.4 빈칸 `[and]/[to]/[just to] block it` + decoy `, and block it`(직원이 출구를 막음. 환자는 갇혔다고 느끼고 직원도 피할 길을 잃는다), 9.4 `move into/toward/closer to the crowd`(+decoy), 18.4 `step forward/closer`(+decoy `to step forward`).
- **혼자 대응**: 빈칸의 `alone`은 모두 환자 쪽 말이다. 직원이 혼자 대응하는 장면은 **S15 context 동료 장면**(`Stay right outside the room — come in if I call you.`, base 그대로)이다. 말은 한 사람이 이끌고 팀은 바로 밖에 대기하는 것은 표준 방식이라 '혼자 대응'은 아니다. 다만 "부르면 들어와"는 문이 닫힌 채로 읽힌다. 문을 연 채 서로 보이는 곳에 있게 다듬는다(C2, 고칠 것).
- **자리 뜨기(감시·관찰 공백)**: 19.5 진정제 맞은 환자에게 `I'll be right outside/upstairs/downstairs`(+decoy `right upstairs`), 19.1 `while you walk/stand/eat`(+decoy `while you walk`), 16.5 억제 직후 `I'm leaving now`(+decoy `leaving now`), 2.1 decoy `— I'm leaving`, 7.1 치매 환자에게 `You're safe outside`(빈칸+decoy, 배회·이탈 위험).
- **흥분성 섬망(S17)**: 의학적 응급으로 다룬다. 냉각·체온 재측정·"도움이 오고 있다"가 문장과 order에 다 있고, 행동 문제로만 다루는 말은 없다. 엎드린 자세 억제 같은 위험한 말도 없다. 다만 17.1 빈칸·decoy `You're freezing — we're going to cool you down fast`는 체온 방향이 반대인 처치 문장이 된다(심각 8). 17.2 `why`의 "의식이 흐려지는 환자"는 경미한 어긋남이다(W2).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고, 말하는 방식의 이유(Let's의 공동 제안, I know·I hear의 감정 인정, not … just의 의도 설명, try to·as short as I can처럼 지킬 수 있는 만큼만 약속)를 짚는다. 임상 근거도 맞다: 트리아지는 도착 순이 아님, 억제는 최후 수단·억제 후 설명(debrief), 진정제 뒤 호흡·의식 지속 확인, 판단 능력 있는 환자는 붙잡을 수 없음, 치매 환자에게 짧은 반복. 고칠 것은 1.3 하나다. "막연한 soon 대신 shortly"는 근거가 없다(둘은 뜻이 같다). 17.2 "의식이 흐려지는 환자"는 경미하다. |
| 2 | 빈칸 | 2 | `ko`로 걸러지지 않는 '정답 둘'은 없다. 그러나 **위협·무시·비꼬기·낙인·위험한 처치를 오답으로 보인 것이 21문장**이다(위 특별 점검, B1~B21). **동떨어진 말·돈 말이 약 26문장**이다(`Dietary/Billing/Parking`, `offshore/downtown/abroad`, `colors/songs/jokes`, `bag/door/window`, `watch/hair/shirt`, `shop/pay/vote` 등). 돈·쇼핑 말(bill·charge·billing·bills·pay·debt·paid·shop·insurance)은 15문장에 돈다. **반대말 묶음 돌려쓰기**도 있다: `alone/separately/apart` 4문장, `forget/ignore` 4문장, `secretly/angrily/loudly` 각 3. **기능어 빈칸이 9문장**이다(3.1 `some`, 3.4 `not`, 4.3 `for`, 7.4 `with`, 8.2 `can't`, 12.3 `so`, 13.4 `before`, 14.4 `unless`, 1.5 `as soon as`). 이 중 12.3 `whether`, 12.1 `the different/separate thing`, 3.4 `just to block`은 문법만으로 걸러진다. |
| 3 | `decoy` | 2 | 100개 모두 청크 자리의 반대말이나 바꾼 말이다. 조립하면 `ko`에 맞는 문장이 되는 것은 **없다**(자기 보고 2 판정). 그러나 **조립하면 위협·자리 뜨기·출구 막기·위험한 처치가 되는 것이 19개**다(D1~D19). **동떨어진 말·돈 말이 18개**다(`the songs`, `right downtown`, `Dietary is close by`, `Your hair`, `your bag`, `we've paid`, `what the prices are`, `your bill` 등). |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이다(혈압·담요·물·서명·팔찌·통역). 정답 뒤집기(안/못/절대)는 없다. 정답과 반쯤 겹치는 것이 1건(18.5)이다. 경계선 2건(3.3, 14.4)과, `서류에 서명해 주세요` 4회·`지금 어디가 불편하세요?` 4회 돌려쓰기가 있다. |
| 5 | `order` | 3 | 임상 흐름은 대체로 맞다(S3 출구 비우기, S14 거리→보안→질문→허락 없이 다가가지 않음, S16 사과→설명→감정→선택권, S18 분리→보안→물러남→한 사람씩). 조건절 줄은 S20 L4 하나이고 진짜 조건부다(자기 보고 3). 시간으로 묶은 줄은 없다. 그러나 **인접 교환이 열린 카드가 7장**이다(S9 3↔4, S10 2↔3, S12 3↔4, S13 3↔4, S15 2↔3, S17 2↔3, S19 3↔4). **억지 연결어가 5장**이다(S1 `That's why:`, S7 `Besides me`, S8 `Beyond that`, S11 `That includes your concern:`, S13 L3의 비문에 가까운 이중 절). `Whatever …`로 묶은 줄이 9장에 있어 틀이 단조롭다. |
| 6 | `tag`·`icon` | 4 | 태그는 모두 한국어, 10자 이하이고 상황 안에서 일관된다. 아이콘은 대체로 뜻과 맞다. `handshake2` 15·`faceWorried` 12·`shield` 12로 쏠렸고, 14.4 `lock`(접근 허락)은 '잠금'으로 읽힌다(경미). |
| 7 | context·swap `ko` | 4 | 정비 3건(space·before·cool)과 그대로 둔 2건(outside·separate)은 모양이 맞다. 다만 고칠 것이 둘이다. S17 `cool` 장면 0(정비)은 간호사가 의사에게 `start cooling now`라고 명령형으로 보고한다. S15 `outside` 동료 장면(base)은 문이 닫힌 채로 읽혀 '서로 보이는 곳'으로 다듬기를 권한다. swap `ko` 15건은 모두 바꾼 문장의 뜻과 맞다. |
| 8 | 파일럿 갈래 | 2 | 아이콘(1)은 없고, 임상 순서(4)는 맞다. 그러나 동떨어진 빈칸 오답(2)이 약 26문장이다. order 연결(3)이 7장에서 열렸다. "이어진 검토" 갈래인 **오답으로 위험한 처치·위협 보이기**가 빈칸 21 · decoy 19로 이 주제의 가장 큰 문제다. decoy가 `ko`에 맞는 문장이 되는 것(5)은 없다. |

## 사실 오류·심각한 문제

1. **출구 막기(3.4).** 빈칸 `I'm going to stand by the door, [and]/[to]/[just to] block it.`과 decoy `, and block it`. 이 문장이 가르치는 바로 그 위험이다. 직원이 출구를 막으면 환자는 갇혔다고 느끼고, 직원도 피할 길을 잃는다. 빈칸이 기능어 `not`이라 가르치는 것도 없다.
2. **진통제 요구 환자에게 그 약을 주겠다는 말(8.2).** 빈칸 `I [can]/[will]/[must] give you that, but here's what I can offer`와 decoy `I will give you that`. 장면은 "just give me the good stuff"다. 한계를 긋는 문장이 오답에서 한계를 허문다. 빈칸도 기능어 `can't`다.
3. **진정제·억제 뒤 자리 뜨기.**
   - 19.5 `I'll be right outside/upstairs/downstairs if you need anything`, decoy `right upstairs` — 진정제를 맞은 환자를 혼자 둔다는 말이다. 이 상황(S19)이 가르치는 것은 지속 감시다.
   - 19.1 `keep checking on you while you walk/stand/eat`, decoy `while you walk` — 진정된 환자를 걷게 하거나 먹게 한다(낙상·흡인).
   - 16.5 `I'm here, and I'm leaving now`, decoy `leaving now` — 억제 직후 환자다.
   - 2.1 decoy `— I'm leaving` — 목소리가 높아지는 환자를 두고 떠난다.
4. **치매 환자에게 `You're safe outside`(7.1).** 빈칸 선택지와 decoy가 같다. 배회·이탈 위험이 있는 환자에게 '밖은 안전하다'는 말이 된다.
5. **편집적 의심이 있는 환자에게 '하고 나서 말해 준다'(13.4).** 빈칸 `I'll tell you everything [after]/[until] I do it`과 decoy `everything after`. 동의 없는 접촉이 되고, 이 문장의 `why`(미리 말해 불안과 의심을 줄인다)와 정면으로 어긋난다.
6. **AMA 환자에게 '위험은 잊어라'(20.2).** `I want you to forget/ignore/doubt what the risks are`. 위험 설명은 자의 퇴원의 핵심 절차다.
7. **위협·비꼬기·무시·낙인을 오답으로 보인 것.**
   - 10.2 `I won't forget being spoken to that way`(빈칸+decoy) — 앙갚음 예고로 들린다.
   - 4.2 `that's amusing/convenient`(빈칸+decoy) — 같은 말을 되풀이해야 했던 환자를 비꼰다.
   - 4.3 `right now against you`(빈칸+decoy).
   - 2.3 `Tell me what would hurt right now`(빈칸+decoy).
   - 4.1 `I forget/dismiss/ignore what you really need`, 9.3 `I'll ignore/forget/skip this` — 무시.
   - 5.4 `pain like this is easy/pleasant/comfortable to sit with` — 통증을 깎아내린다.
   - 11.1 `treated with caution` — 인종 때문에 불신을 말하는 환자에게 '조심해서 다룬다'는 말은 프로파일링으로 들린다. `pity`도 존중의 반대로 읽힌다.
   - 8.1 `treat it reluctantly/secretly` — 진통제를 요구하는 환자를 마지못해, 몰래 치료한다는 낙인이다.
8. **흥분성 섬망에서 체온 방향이 반대인 처치(17.1).** 빈칸·decoy `You're freezing — we're going to cool you down fast`. 오답이지만 '추운 환자를 빨리 식힌다'는 처치 문장이다.

## 저작자 자기 보고 4건 판정

### 1. 부정·안심 문장의 빈칸을 어색한 말(weighing, billing)로 채운 곳

**받아들이지 않음 — 빈칸을 옮기거나 같은 분야 말로 바꾼다.** 부정문(`Nobody's ___ you`, `No one here is ___ you`, `I'm not here to ___`)의 빈칸 자리에는 나쁜 동사가 무엇이든 들어가도 맞는 안심 말이 된다. 그래서 저작자가 우스운 말로 피했다. 그러나 낱장 머리에 `ko`가 보이므로, 같은 분야의 다른 안심 말은 `ko`로 걸러진다. 피할 이유가 없다. 아니면 빈칸을 부정 밖의, 문장이 가르치는 말로 옮긴다.

| 문장 | 지금 | 판정 · 고칠 안 |
|---|---|---|
| 6.1 "아무도 비난하지 않아요, 그저 돕고 싶을 뿐" | `judging` / `feeding/weighing/billing` | 빈칸을 `help`로 옮긴다: `I just want to [help / talk / ask / check]`. 모두 이 장면에서 할 말이고, `ko` "돕고"로 걸러진다. 빈칸을 그대로 두려면 같은 분야 안심 말로: `judging / rushing / ignoring / watching`(`ko` "비난"으로 걸러짐. `blaming`은 비난과 같아 쓰지 말 것). |
| 13.1 "아무도 반대하지 않아요, 안전하게 느끼시도록" | `against` / `around/opposite/over` | 빈칸을 `safe`(w-safe)로 옮긴다: `help you feel [safe / calm / better / heard]`. 편집적 의심 환자 장면에서 모두 실제로 할 말이고, `ko` "안전하게"로 걸러진다. |
| 6.4 "싸우려는 게 아니에요" | `fight` / `pay/sleep/shop` | 같은 부정문 문제다. 빈칸은 두고 같은 분야 말로: `fight / judge / lecture / rush`(`ko` "싸우려는"으로 걸러짐. `argue`는 '말다툼'이라 겹치니 쓰지 말 것). |
| 3.3 "압박하려는 게 아니라 그저 도우려는" | `help` / `watch/stare/hurry` | 받아들임(경미). 부정 밖의 자리이고 같은 분야 말이다. |

### 2. 조립하면 말은 되지만 `ko`와 어긋나게 고른 decoy

**원칙은 받아들임, 개별로는 37개를 고친다.** 자리마다 넣어 조립해 보면, `ko`에 맞는 다른 문장이 되는 decoy는 하나도 없다(파일럿 갈래 5는 통과). 그러나 `ko`와 어긋나게 하려고 거의 모두 반대말을 골랐다. 그래서 조립 결과가 이 주제가 가르치지 말아야 할 말이 된다(`, and block it`, `I will give you that`, `right upstairs`, `leaving now`, `I won't forget`, `— that's amusing`, `against you`, `You're safe outside`, `everything after`, `while you walk`, `You're freezing`). 반대말이 없는 자리는 동떨어진 말(`the songs`, `Your hair`, `Dietary`, `right downtown`)이나 돈 말이다. decoy는 브리프대로 "같은 자리에 올 수 있는, 그럴듯하지만 이 문장에는 안 맞는 조각"으로 바꾼다. 예: `for the doctor` ↔ `for your safety`. 위험하지 않은 반대말(`like a minute`, `that hurts more`, `get smaller`, `the opposite thing`)은 그대로 둬도 된다.

### 3. AMA 마지막 줄 "If you stay after that, I'll make the wait as short as I can."

**받아들임 — 실제 조건부다.** TASK 10번이 막는 것은 모든 환자에게 하는 행동(심전도·감시·보고)을 조건에 거는 것이다. 이 줄의 행동(기다림 줄이기)은 **남기로 한 환자에게만** 의미가 있다. 남을지는 환자가 정하고(L2 `it's your choice`), 이 줄은 답을 '예'로 전제하지도 않는다.
- `after that`은 L3(위험 설명)을 가리켜 3↔4 교환을 막는다. 교환하면 `To make that choice clear`가 마지막에 떠서 어색하다.
- L2 `I can't hold you`는 판단 능력이 있는 환자일 때 맞는 말이다. 20.2 `why`가 그 조건을 적었으니 됐다.
- 덧붙임(고칠 것 아님): AMA 대화에는 흔히 "언제든 다시 오셔도 된다"가 붙는다. 4줄 카드라 빠져도 괜찮다.

### 4. context 정비 3건(space, before, cool)과 그대로 둔 2건(outside, separate)

- **space(정비)** — 받아들임. 보안 요원 장면 `room`→`space` 한 낱말 바꿈은 자연스럽다. XX(차트) `I'll give you some space, okay? Is this better?`와 fix `Pt requested more personal space; staff stepped back, exit kept clear.`는 "차트가 듣는 쪽인 반대 방향 대비"(review-ctx-A `pneumo`, -B `ask for more`)와 같은 모양이다. 다만 XX가 장면 0과 거의 같은 문장이다. 같은 말이 ✓에도 ✕에도 있어 대비가 약하다(경미, C3).
- **before(정비)** — 받아들임(경미한 단서). base XX `prior to` → `before`로 세 장면이 같은 말을 공유한다. 어색함은 `notify`·`intervention` 같은 의료진 말을 편집적 의심 환자에게 쓴 데서 오고, 듣는 사람 기준에 맞는다. 다만 `word`가 기능어 `before`(`ko: ~하기 전에`)라, 화면 제목 "`before`가 어색한 장면은?"이 `before` 자체가 틀린 것처럼 읽힌다. psych 검토의 `belt`처럼 "어색함이 다른 말에서 오는" 경우로 받아들인다. 세 장면이 함께 쓸 다른 말이 없으니 그대로 둔다.
- **cool(정비)** — 모양은 받아들임, 장면 0은 고친다. XX `Your core temp is 40.5 — you're hyperthermic, so we're cooling you.`는 혼란스러운 환자에게 의료진 말을 쓴 꼴이라 좋다. `why`도 지금 장면의 말을 설명한다. 그러나 장면 0의 `start cooling now`는 의사에게 하는 명령형이다. 소생실에서 실제로 하는 말이긴 하지만, 보고의 본보기로는 "시작합니다"나 요청 꼴이 낫다(C1, 고칠 것).
- **outside(그대로)** — `word` 선택은 받아들임. base가 이미 세 장면에 공유한 말이다(TASK 9번). XX `Security is staged outside in case you become combative.`는 환자를 `combative`로 규정해 위협으로 들리니 모양이 맞다. 동료 장면 `Stay right outside the room — come in if I call you.`도 한 사람이 말을 이끄는 표준 방식이다. 다만 문이 닫힌 채로 읽혀, 문을 연 채 서로 보이는 곳으로 다듬기를 권한다(C2).
- **separate(그대로)** — 받아들임. base가 세 장면에 공유한 말이고, XX는 현장 외침을 차트에 그대로 옮긴 꼴이다(차트가 듣는 쪽인 대비). XX `en`이 장면 1과 `!` 하나만 다른 점은 space와 같다(경미, 고치지 않아도 됨).

## 고칠 것

### 빈칸 — 위험한 처치·위협·무시·낙인 (B1~B21, 반드시)
- B1 · 3.4 기능어 `not` + `and/to/just to` block → 빈칸을 `block`으로: `not [block / open / lock / close] it`(`ko` "막지 않고"로 걸러짐)
- B2 · 8.2 기능어 `can't` + `can/will/must` → 빈칸을 `offer`로: `here's what I can [offer / prescribe / order / promise]`(`prescribe`·`order`는 간호사 범위 밖이라 같은 분야에서 틀린 말, `ko` "제안"으로 걸러짐)
- B3 · 13.4 `after/unless/until` → `before / while / as / when`(위험하지 않고 `ko` "하기 전에"로 걸러짐)
- B4 · 7.1 `upstairs/downtown/outside` → `here / now / tonight / today`(`ko` "여기서는"으로 걸러짐)
- B5 · 19.5 `downstairs/outside/upstairs` → 빈칸을 `need`로: `if you [need / hear / see / feel] anything`(`want`는 `ko` "필요한"과 겹치니 쓰지 말 것)
- B6 · 19.1 `walk/stand/eat` → `rest / wait / talk / read`(`sleep`은 `ko` "쉬시는"과 겹침)
- B7 · 20.2 `forget/ignore/doubt` → 빈칸을 `risks`(w-risk)로: `what the [risks / rules / steps / options] are`
- B8 · 10.2 `forget` 빼기 → `accept / regret / deny / mind`(`allow`·`excuse`는 정답과 같은 뜻)
- B9 · 4.2 `amusing/unusual/convenient` → `frustrating / unusual / understandable / normal`(모두 형용사. `that's normal`은 불편을 대수롭지 않게 넘기는 실제 오답 응대, `ko` "답답"으로 걸러짐. `tiring`은 `ko`와 겹침)
- B10 · 4.3 기능어 `for` + `against` → 빈칸을 `do`로: `what I can [do / say / check / sign] right now`
- B11 · 4.1 `forget/dismiss/ignore` → `understand / repeat / check / order`
- B12 · 9.3 `skip/forget/ignore` → `address / explain / mention / document`
- B13 · 5.4 `easy/pleasant/comfortable` → `hard / strange / scary / new`
- B14 · 11.1 `haste/pity/caution` → `respect / speed / privacy / patience`(`caution`은 빼기)
- B15 · 8.1 `secretly/reluctantly/suddenly` → `safely / quickly / gently / fully`
- B16 · 1.3 `bill/charge/discharge` → `update / triage / register / move`(대기 환자를 진료 없이 `discharge`하는 말은 빼기)
- B17 · 16.5 `leaving/charting/rushing` → `listening / charting / typing / waiting`
- B18 · 17.1 `freezing/shaking/sleeping` → `overheating / dehydrated / shaking / confused`(흥분성 섬망에서 실제로 보이는 상태들, `ko` "체온"으로 걸러짐)
- B19 · 2.3 `hurt/delay/annoy` → `help / upset / scare / bother`(촉발 요인을 묻는 같은 분야 질문이 되고 `ko` "도움"으로 걸러짐)
- B20 · 9.4 `closer to/into/toward` the crowd — 셋 다 격앙된 사람을 군중 쪽으로 데려간다 → `away from / toward / around / behind`(`ko` "떨어져서"로 걸러짐, 군중 속으로 들어가는 말은 하나만)
- B21 · 18.4 `forward/closer/in` → `back / aside / down / out`(`ko` "뒤로"로 걸러짐, 몸싸움 중인 사람을 가까이 부르지 않음)

### 빈칸 — 동떨어진 말·돈 말·문법으로 걸러지는 말 (B22~B49)
- B22 · 1.1 `visit/shift/bill` → `wait / visit / shift / drive`
- B23 · 5.3 `by Friday/someday/next week` → 빈칸을 `something`으로: `something / someone / a doctor / the charge nurse`(`ko` "뭔가 가져다"로 걸러짐)
- B24 · 6.1 → 자기 보고 1(빈칸을 `help`로)
- B25 · 6.4 → 자기 보고 1(`fight / judge / lecture / rush`)
- B26 · 13.1 → 자기 보고 1(빈칸을 `safe`로)
- B27 · 7.3 `bills` → `photos / charts / forms / letters`
- B28 · 7.5 `insurance` → `family / diagnosis / surgery / medicines`
- B29 · 10.4 `list/floor/clock` → `team / shift / unit / floor`(`side`는 `ko` "편"과 겹침, `case`는 잔소리 관용구라 빼기)
- B30 · 13.2 `shop/pay/vote` → `see / sign / rest / wait`
- B31 · 13.5 `sign/pay/guess` → `stop / leave / repeat / explain`
- B32 · 14.2 `sleepy/ready/hungry` → `unsafe / angry / sick / dizzy`(`scared`는 `ko` "불안"과 겹침)
- B33 · 14.3 `point/bow/stoop` → `listen / reply / respond / react`
- B34 · 14.5 `Dietary/Billing/Parking` → 빈칸을 `close by`로: `Security is [close by / on call / on break / off duty]`(`ko` "가까이 있어요"로 걸러짐)
- B35 · 15.4 `offshore/downtown/abroad` → `outside / upstairs / downstairs / next door`
- B36 · 16.2 `bills` → `questions / forms / orders / family`
- B37 · 16.4 `debt` → `say / doubt / shift / test`
- B38 · 17.3 `passed/paid/met` → `got / paged / called / moved`
- B39 · 17.5 `height/weight/hearing` → `temperature / heart rate / oxygen / sugar`(흥분성 섬망에서 실제로 다시 재는 것들)
- B40 · 19.2 `bag/door/window` → `eyes / mouth / hand / fist`
- B41 · 19.4 `watch/hair/shirt` → `breathing / color / pulse / oxygen`
- B42 · 20.3 `shop/pay` → `stay / leave / sign / call`
- B43 · 20.4 `chart/name/bill` → `choice / turn / room / chart`(`decision`은 정답과 같은 뜻, `fault`는 비난이라 쓰지 말 것)
- B44 · 20.5 `colors/songs/jokes` → `risks / rules / results / options`
- B45 · 3.1 기능어 `some` + `less/little/no` → 빈칸을 `space`(w-space)로: `some [space / time / water / privacy]`(`room`은 정답과 같은 뜻)
- B46 · 3.5 `blankets/tests/pills` → `room / time / blankets / water`
- B47 · 6.3 `rush/hurry/race` → `sit / lie / calm / settle`(`ko` "앉아서"로 걸러짐)
- B48 · 12.3 기능어 `so` + `whether/unless/although`(문법으로 걸러짐) → 빈칸을 `calm`으로: `stay [calm / back / outside / close]`
- B49 · 7.4 기능어 `with` + `despite/without/against` → 빈칸을 `beside`(w-beside)로: `right [beside / behind / across from / outside] you`(`near`·`next to`는 정답과 같은 뜻)
- (경미, 선택) 12.1 `the different/separate thing`은 관사로 걸러짐 → `same / opposite / wrong / easy`. 14.4 `wherever/although` → `unless / if / because / when`. 18.3 `following you`(보안이 따라다님) → `involving`. 19.3 `notes/turns` → `breaths / steps / pauses / naps`. 4.4 `keep/shut it down`(입 다물라는 관용구). `alone/separately/apart`를 2.5·6.5·10.3·10.5 네 곳에 돌려쓴 것은 두 곳만 남긴다.

### decoy — 위협·자리 뜨기·출구 막기·위험한 처치 (D1~D19, 반드시)
- D1 · 3.4 `, and block it` → `by the window`
- D2 · 8.2 `I will give you that` → `I can't promise that`(`ko` "드릴 수 없지만"과 다름)
- D3 · 19.5 `right upstairs` → `if you hear`
- D4 · 19.1 `while you walk` → `while you wait`
- D5 · 16.5 `leaving now` → `charting now`
- D6 · 2.1 `— I'm leaving` → `to be tired`
- D7 · 7.1 `You're safe outside` → `You're safe with her`
- D8 · 13.4 `everything after` → `I leave`(`before I leave`는 `ko` "하기 전에"와 다름)
- D9 · 10.2 `I won't forget` → `I won't mind`
- D10 · 4.2 `— that's amusing` → `— that's on us`
- D11 · 4.3 `against you` → `about the wait`
- D12 · 2.3 `what would hurt` → `where it hurts`
- D13 · 4.1 `I forget` → `you understand`
- D14 · 9.3 `I'll ignore this` → `I'll explain this`
- D15 · 9.4 `closer to the crowd` → `from the TV`
- D16 · 18.4 `to step forward` → `to sit down`
- D17 · 17.1 `You're freezing` → `You're dehydrated`
- D18 · 8.1 `to treat it secretly` → `to treat it quickly`
- D19 · 5.4 `is easy` → `waiting like this`

### decoy — 동떨어진 말·돈 말 (D20~D37)
- D20 · 1.3 `and charge you` → `and move you`
- D21 · 3.1 `some forms` → `some time`
- D22 · 3.5 `more tests` → `more time`
- D23 · 6.3 `we jump down` → `we lie down`
- D24 · 6.4 `to pay` → `to judge`
- D25 · 7.3 `at these bills` → `at these cards`
- D26 · 7.5 `about your insurance` → `about your medicines`
- D27 · 13.2 `so you can pay` → `so you can rest`
- D28 · 14.5 `Dietary is close by` → `The doctor is close by`
- D29 · 15.4 `right downtown` → `right upstairs`
- D30 · 16.2 `your bills` → `your family`
- D31 · 17.3 `we've paid` → `we've called`
- D32 · 17.5 `your height` → `your heart rate`
- D33 · 19.2 `your bag` → `your mouth`
- D34 · 19.4 `Your hair` → `Your color`
- D35 · 20.2 `what the prices are` → `what the rules are`(돈 decoy는 'AMA면 보험이 안 된다'는 잘못된 통념까지 떠올리게 함)
- D36 · 20.4 `your bill` → `your turn`
- D37 · 20.5 `the songs` → `the results`
- (경미, 선택) 15.2 `and I'll refuse`, 14.3 `, and I'll object`는 공격 임박·무기 의심 환자 앞에서 도발로 읽힌다 → `and I'll check`, `, and I'll answer`.

### distractorsKo (K1~K3)
- K1 · 18.5 '이름을 한 명씩 말씀해 주세요.' — 정답 "한 사람씩 안전하게 해결해 나갈게요"와 '한 명씩'이 겹친다 → '다치신 분 있으세요?'
- K2 · 3.3 '도움이 필요하면 불러 주세요.' — 정답 "그저 도우려는 거예요"와 '도움'이 겹친다(경계선) → '불을 조금 줄여 드릴까요?'
- K3 · 14.4 '물이라도 드릴까요?'·'의자를 가져다 드릴까요?' — 무기가 의심되는 환자에게 물건을 건네려면 다가가야 한다. 오답이지만 S14가 가르치는 거리 원칙과 어긋난다 → '보안팀이 곧 와요.'·'다른 분들은 잠깐 나가 계시도록 할게요.'
- (경미) '서류에 서명해 주세요' 4회(8.3 10.4 12.5 20.3)·'지금 어디가 불편하세요?' 4회는 두 곳만 남긴다.

### order (O1~O13)
고친 카드는 모두 `why`의 "'…'가 앞 줄을 가리켜" 문구를 새 줄에 맞게 다시 쓰고, 줄 `ko`·`note`를 맞추고, 인접 교환 세 가지와 15단어를 다시 확인할 것.
- O1 · S9 — 3↔4가 열렸다(`That way, it won't get bigger …`가 L2 뒤에 와도 자연스럽다). → L4 `Keeping it calm means this won't get bigger than it needs to be.`(`calm`이 L3을 가리킴)
- O2 · S10 — 2↔3이 열렸다(L3 뒤의 `To do that, I need us to speak respectfully`에서 `that`이 '곁에 있기'를 가리켜도 읽힌다). → L3 `That way of speaking isn't respectful — I won't accept it, but I'm still here.`(14단어, `respectful`이 L2를 받음)
- O3 · S12 — 3↔4가 열렸다(`With that in mind, let's stay calm`이 L2 뒤에 와도 자연스럽다). → L4 `Now that you know the plan, let's stay calm so I can care for him.`(14단어, `the plan`이 L3을 가리킴)
- O4 · S13 — 3↔4가 열렸다. L3 `Along with that, anything I do, I'll tell you about it before I do it.`은 절이 겹친 어색한 영어이고, `Along with that`은 `Also`와 같다. → L3 `Before I do anything, I'll tell you what it is.`, L4 `You can ask me to stop any of that at any time.`(`any of that`이 L3을 가리킴. `If` 줄을 새로 만들지 않음)
- O5 · S15 — 2↔3이 열렸다(L3 `but let's try this way`가 L1 바로 뒤에 와도 읽힌다). → L3 `Whatever you tell me, we'll keep talking — my team is just outside.`(`Whatever you tell me`가 L2를 받음) + `why`에 "팀은 문이 열린 채로 보이는 곳에" 한 줄(C2)
- O6 · S17 — 2↔3이 열렸다(`That's a lot for your body`가 L1의 과열 바로 뒤에도 자연스럽다). → L3 `That temperature is a lot for your body — it's working very hard.`(`That temperature`가 L2를 가리킴)
- O7 · S19 — 3↔4가 열렸다(`Whatever changes`가 L2 뒤에도 읽힌다). → L4 `That's what I'm watching for — I'm staying right here.`(`That`이 L3의 '계속 지켜볼 호흡'을 가리킴. `If` 줄을 새로 만들지 않음)
- O8 · S1 — L2 `That's why: the sickest patients are seen first.`는 `That's why:`가 비문에 가깝고 인과 방향이 거꾸로다(대기가 결과, 트리아지가 원인). → `That's because the sickest patients are seen first.`
- O9 · S11 — L2 `That includes your concern: it's valid, …`는 어색한 영어다. → `Respect starts with saying your concern is valid — I'll do my best.`(12단어, L3의 `To do my best`가 계속 받음)
- O10 · S7 — L2 `Besides me, your daughter is on her way`는 어색하다. → `I'm not the only one — your daughter is on her way to see you.`(14단어)
- O11 · S8 — L2 `Beyond that`은 억지 연결이다. L2·L3이 15단어 꽉 찬다. → L2 `I believe that pain is real, and I want to treat it safely.`(`that pain`이 L1을 가리킴). L3의 `that`(요구한 약)은 장면 태그라인(`give me the good stuff`)으로만 뜻이 서니, 그대로 두되 L3 `ko`를 "그 약은 드릴 수 없지만 …"으로 분명히.
- O12 · S5 — L4 `Along with that`은 `Also`와 같아 3↔4가 반쯤 열렸다. → L4 `While you wait for it, let's find a position that hurts less.`(`it`이 L3의 '가져올 것'을 가리킴. 아무것도 미루지 않는 시간 묶음이라 TASK 10번에 걸리지 않음)
- O13 · S16(경미) — 2↔3이 반쯤 열렸다(`Hearing all that`이 L1 뒤에도 읽힌다). → L3 `Now that you've heard what happened, how are you feeling?`(`what happened`가 L2를 가리킴)
- (경미) `Whatever …` 줄이 9장(S1 S2 S5 S9 S13 S14 S17 S19 S20)이다. 위 수정으로 몇 장은 빠진다. 남은 것도 두세 장은 다른 가리키는 말로.
- (경미) S2 L3 `From down here`, S6 L2 `Because of that`(싸우지 않겠다 → 그래서 천천히)은 논리가 약하지만 교환은 닫혀 있다.

### context (C1~C3)
- C1 · S17 `cool` 장면 0(의사에게 보고) `…he's hyperthermic, start cooling now.` → `Temp is 40.5 and climbing — he's hyperthermic; I'm starting active cooling.`(`cooling` 유지, W14 통과)
- C2 · S15 `outside` 동료 장면 `Stay right outside the room — come in if I call you.` → `Stay right outside the open door, where I can see you.`(`outside` 유지). `why`에 "말은 한 사람이 이끌되 팀은 문이 열린 채 보이는 곳에 있어요" 한 줄. **정본(base) 장면 수정이고 T8의 '같은 말 세 장면' 사유가 아니라 임상 내용 사유이니, 사용자 확인 뒤 반영.**
- C3 · S3 `space` XX(경미, 선택) — XX가 장면 0과 거의 같다. 대비를 또렷하게 하려면 차트에 환자에게 하던 말투를 그대로 적은 꼴로: `Told pt I'll give you some space — is this better?` 아니면 그대로 둔다.

### why (W1~W2)
- W1 · 1.3 "막연한 soon 대신 shortly를 써서 곧 소식이 온다는 기대를 줘요" — 근거 없음(뜻이 같다) → "update you로 내가 다시 찾아가 알려 주겠다고 약속해요. 환자가 다시 물으러 오지 않아도 돼요."
- W2(경미) · 17.2 "의식이 흐려지는 환자에게" — 흥분성 섬망은 과흥분으로 오고(태그라인 "So hot — get it off me!") 갑자기 무너질 수도 있어 틀린 말은 아니다. 더 맞게 쓰려면 → "Stay with me는 혼란스러운 환자의 주의를 내 목소리에 붙잡아 두는 짧은 말이에요."

### tag·icon (경미, 선택)
- 14.4 `lock`(접근 허락) → '잠금'으로 읽힌다. `shield`나 `handshake2`.

## 고칠 것 개수
- 반드시: 빈칸 B1~B21(21) · decoy D1~D19(19) — **40**
- 고칠 것: 빈칸 B22~B49(28, 자기 보고 1의 3건 포함) · decoy D20~D37(18) · distractorsKo K1~K3(3) · order O1~O12(12) · context C1~C2(2, C2는 사용자 확인 뒤) · why W1(1) — **64**
- 경미·선택: O13, C3, W2, 아이콘 1, 빈칸·decoy·오답 뜻 경미 묶음
- 합계 **104건**(경미 제외)

## 종합
문장·`why`·순서 흐름은 진정 원칙(감정 인정, 출구 비우기, 거리, 억제는 최후 수단, 억제 후 설명, 진정 후 감시, AMA 선택권)에 맞고, 흥분성 섬망도 의학적 응급으로 다룬다. 그러나 빈칸 오답과 decoy를 반대말로 만든 탓에 출구 막기·약 주기·진정 환자 두고 떠나기·치매 환자 밖으로·하고 나서 말하기·위험 무시·앙갚음·비꼬기·낙인이 오답으로 40곳에 보인다. 이 40곳을 고치고 나머지 고칠 것을 반영한 뒤에 내보낸다.
