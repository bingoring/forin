# er-psych — v46 보강 검토 (er)

대상: `er-psych.yaml`(상황 21 · 문장 126 · order 21장 · 뉘앙스 context 9 · swap 12). 문장 126개와 order 21장을 **전부** 봤다.
번호는 **1부터** 센다. 상황은 파일 순서대로 S1(자살 사고 초기 선별) … S21(이송 중 급속 악화), 문장은 `상황.문장`(예: 10.4), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것:
- 빈칸 `before + 선택지 + after` 504줄
- decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립 약 990줄
- order 인접 교환 63가지(21장 × 3)와 줄 단어 수
- context `word`가 세 장면 `en`에 있는지, base 장면과의 차이(바뀐 장면 3곳)
- swap 12건의 `ko`
- decoy·빈칸 오답이 주제 안에서 몇 번 되풀이되는지, 아이콘 분포
- 위험한 처치·태도 낱말(비밀 약속·혼자 두기·위험 물건·위협·처벌·퇴원)과 낙인 표현 검색

`verify_one_theme.py er …/er-psych.yaml` → `==> 통과`(W13 경고 4건 `scarred`·`sore`·`of`·`ever`는 v44 단어 쪽이라 이번 범위 밖).

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 '정답이 둘'은 **`ko`에도 맞는가**로 판정했다. 같은 분야의 다른 맞는 말이라도 `ko`로 걸러지면 정답이 둘이 아니다. context는 `review-ctx-A/B/C.md`와 같은 기준이다.
- 같은 `word`가 세 장면에 같은 뜻으로 나와야 한다.
- 어색함은 듣는 사람 때문이어야 한다.
- base가 이미 세 장면에 공유한 말은 그대로 둔다(TASK 9번).
- W14를 맞추려고 끼워 넣어 영어가 틀린 것은 받아들이지 않는다.

정신과 특별 점검(자살 위험 환자에게 비밀 약속·퇴원 서류·혼자 두기·위험 물건 허용·위협·처벌 말투, 낙인 표현):
- **비밀 약속**: 없다. 7.1·7.6·S7 order·S7 swap이 모두 "일부만 우리끼리, 안전은 공유"로 맞게 쓴다. 다만 7.6 `tag: 비밀 허용`이 비밀을 허락하는 것처럼 읽힌다(W4).
- **혼자 두기**: 문장·order에는 없다. 오답에도 없다.
- **위험 물건 허용**: 2.4 빈칸 `return your belt and shoelaces`가 목을 맬 수 있는 물건을 돌려주는 말로 조립된다(B3).
- **퇴원·귀가**: 10.4 빈칸 `after you go home`(귀가한 뒤에 확인), 17.3 오답 뜻 '집까지는 어떻게 가실 거예요?'(AMA 귀가를 돕는 말), decoy `at home` 11회 중 6.6·13.4가 시도 직후·1:1 관찰 환자를 집에서 돌본다는 문장이 된다.
- **위협·처벌 말투**: 1.6 빈칸 `only blame/anger for you`, 3.3 `You're in the wrong place`(도움을 청한 환자를 돌려보내는 말), 6.3 `the last/final steps`(시도 직후 환자에게 '마지막 단계').
- **낙인 표현**: 새 필드에는 없다. `psych patient`·`frequent flyer`·`doing something silly`는 v44 swap의 오답으로, 왜 나쁜지 설명이 붙어 있다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식의 이유를 짚는다. 임상 근거도 맞다: 자살을 직접 묻는다고 생각을 심지 않음, PHQ-9 2주·PHQ-2 핵심 두 문항, 수단 제한, diagnostic overshadowing, 억제대 최단 시간·계속 재평가(CMS), 명령 환청, 긴장증의 감염·약물·대사 원인 배제. 고칠 것은 셋이다. 1.1 `why`는 "자살을 직접 묻는다"고 하는데 문장은 `hurting yourself`(자해)를 묻는다. 18.6 `why`는 어색한 `a bed for both of you`를 의도처럼 설명한다. 8.1은 "최대"와 "주마다 다름"을 넣어야 한다. 그 밖에 3.4 `me를 넣어 초대`는 근거가 약하고, 14.4 "핵심"·5.2 "가장 정확해요"는 과장이다. |
| 2 | 빈칸 | 2 | `ko`로 걸러지지 않는 '정답 둘'은 없다. 그러나 문제가 많다. **위험한 처치·처벌 말투를 오답으로 보인 것이 6문장**이다(10.1 재확인을 `forget/overlook/postpone`, 10.4 `after you go home`, 2.4 `return` 벨트·신발끈, 6.3 `last/final steps`, 1.6 `blame/anger`, 3.3 `wrong place`). **장면과 동떨어진 우스운 오답이 33문장**이다(`sing/whisper/stretch`, `cheap/tiny/simple`, `debts/pills/rooms`, `hire/tutor/pay`, `dress/drive/vote`, `paint/study/knit`, `swim/shop/dance`, `kneel/bow/pray`, `windy`, `owe/charge/earn`, `vote/travel/pay`, `classroom/kitchen/garage`…). **돈 낱말을 돌려쓴 것이 약 16곳**이다(money·bill·pay·costly·expensive·cost·cheap·affordable·owe·charge·earn). 정신과 장면에서 돈 말이 계속 나오면 우스울 뿐 아니라 강요처럼 읽힌다. `insurance/address`도 3곳, `legal`도 3곳에서 돈다. 3.2 `coach me what`은 비문이다. |
| 3 | `decoy` | 2 | 126개 중 53개가 다섯 구(`for you` 15 · `at home` 11 · `for the doctor` 9 · `at night` 9 · `at the desk` 9)를 돌려쓴다. 청크 자리와 대비가 없는 장소·시간 부사구다. 문제는 셋이다. **조립하면 위험한 지연·간격이 되는 것이 5개**다(16.1 억제 재평가를 `at night`, 16.5 억제 확인을 `in the morning`, 4.4 흉부 증상 활력징후를 `after lunch`, 6.6 시도 직후 `take good care of you at home`, 13.4 1:1 관찰을 `at home`). **넣으면 `ko`에 맞는 것이 5개**다(2.2 6.5 10.1 10.5 19.4). **안심 문장에 `for now`가 붙어 불길해지는 것이 3개**다(6.2 20.2 11.4). |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이다. 정답 뒤집기(안/못/절대)는 없다. 고칠 것은 5건이다. 위험한 것 1(17.3 '집까지는 어떻게 가실 거예요?' — 자살 시도 뒤 AMA 귀가를 돕는 말, 17.2와 '집에는 누가 계세요?'도 겹침), 정답과 반쯤 겹치는 것 4(18.2 19.5 19.6 14.6). |
| 5 | `order` | 3 | 조건절 줄은 S1 L4 하나이고 맞는 조건이다(자기 보고 2 판정 참고). S1 S5 S7 S11 S14 S18은 좋다. 그러나 **인접 교환이 열린 카드가 7장**이다(S2 3↔4, S3 3↔4, S4 3↔4, S6 3↔4, S10 3↔4, S16 2↔3·3↔4, S21 2↔3). **억지 연결어·논리가 어긋난 카드가 6장**이다(S3 `That tells me you're in the right place`, S8 `Part of that explanation:`·`With those rights`, S12 `That's why`가 거꾸로, S13 `That's why`가 되풀이·`With that support`, S20 `As I said`가 가리키는 말이 없음, S9 L3 `can't hear`가 보이는 것에는 맞지 않음). **S17 머리말 `ko`가 거꾸로다**(`퇴원 거부 환자` — 이 환자는 퇴원을 거부하는 게 아니라 치료를 거부하고 나가려 한다). S6 L3는 16단어다. |
| 6 | `tag`·`icon` | 4 | 태그는 모두 한국어, 10자 이하이고 상황 안에서 일관된다. 7.6 `비밀 허용`은 비밀을 약속하는 것처럼 읽혀 바꿔야 한다. 아이콘은 뜻과 맞지만 `shield`가 126개 중 32개로 많다(권장). |
| 7 | context·swap `ko` | 4 | 정비 3건(anhedonia·voices·psych eval)은 모두 받아들인다. 그대로 둔 6건도 TASK 9번에 맞다(base가 이미 세 장면에 공유). 다만 S10 `deny`의 `fix`(base 그대로)가 "…not having any thoughts…, right?" 꼴의 **부정형 확인 질문**이라, 자살 선별에서 피하는 유도 질문을 본보기로 가르친다. swap `ko`는 S14 하나가 뜻이 틀렸다("힘든 순간이 다시 오면" — 계획은 지금 세운다). |
| 8 | 파일럿 갈래 | 2 | 브리프의 다섯 갈래 중 아이콘(1)은 없고 임상 순서(4)는 대체로 맞다(S14가 Stanley-Brown 순서, S1이 C-SSRS 순서). 그러나 동떨어진 빈칸 오답(2)이 33문장으로 되풀이됐다. order 연결(3)이 7장에서 열렸다. decoy가 `ko`에 맞는 문장이 되는 것(5)도 5개다. 오답으로 위험한 처치를 보이기("이어진 검토" 갈래)는 빈칸 6 · decoy 5 · 오답 뜻 1이다. |

## 사실 오류·심각한 문제

1. **위험한 처치·처벌 말투를 빈칸 오답으로 보인 것(브리프 "이어진 검토" 갈래).** 학습자는 오답도 문장으로 읽는다. 정신과에서는 말투 자체가 처치다.
   - 10.1 `I hear you say you're fine — I just want to forget/overlook/postpone a few things.` 자살 위험을 부정하는 환자에게 확인을 건너뛰겠다는 말이다. 이 상황이 가르치는 바로 그 실수다.
   - 10.4 `I want to double-check a few things after you go home.` 안전 확인을 귀가 뒤로 미룬다. 빈칸도 기능어(`before`)라 가르치는 것이 없다.
   - 2.4 `I need to return your belt and shoelaces …` 목을 맬 수 있는 물건을 돌려주는 말이다(그 문장 `why`가 바로 그 위험을 설명한다).
   - 6.3 `We'll get through the last/final steps together` — 자살 시도 직후 환자에게 '마지막 단계'는 죽음을 떠올리게 한다.
   - 1.6 `There's no judgment here, only blame/anger for you.` 처벌·비난 말투다.
   - 3.3 `You're in the wrong place` — 스스로 도움을 청하러 온 환자를 돌려보내는 말이다. 같은 줄 `the busy/crowded place`는 관사로 걸러진다.
2. **조립하면 위험한 지연·간격이 되는 decoy 5개.**
   - 16.1 `we'll reassess at night`, 16.5 `We check on you in the morning to see if the restraints can come off` — 억제 중인 환자를 밤에만, 아침에만 본다는 말이다. CMS 기준(계속 관찰, 가장 이른 때 해제)과 정면으로 어긋나고, 그 두 문장의 `why`와도 어긋난다.
   - 4.4 `I need to check your heart rate and oxygen after lunch` — 공황인지 심장인지 가리기 전인 환자다.
   - 6.6 `We're going to take good care of you at home` — 자살 시도 직후 환자를 집에서 돌본다는 말이 된다.
   - 13.4 `Someone will stay close by to keep you safe at home` — 1:1 관찰 환자를 집으로 보낸다는 말이 된다.
3. **17.3 오답 뜻 '집까지는 어떻게 가실 거예요?'** — 자살 시도 뒤 치료를 거부하고 나가려는 환자(S17)에게 귀가 방법을 묻는 것은 AMA 귀가를 돕는 말이다. 오답이라도 이 장면에서 들려주면 안 된다.
4. **S17 order 머리말 `ko: 퇴원 거부 환자 4문장 순서`가 거꾸로다.** 장면은 "I refuse treatment. Just let me sign out."이다. 퇴원을 거부하는 게 아니라 치료를 거부하고 나가려는 환자다.
5. **1.1 `why`가 문장과 다른 것을 주장한다.** `why`는 "자살을 직접 묻는다고 그 생각을 심어 주지 않는다"고 하는데 문장은 `thoughts of hurting yourself`(자해)를 묻는다. 같은 주제의 S1 swap은 "돌려 물으면 위험을 놓친다, '자살'을 분명히 넣어 묻는다"고 가르친다. 1.1 `why`가 그 교훈과 어긋난다.
6. **S10 context `deny`의 `fix`가 유도 질문이다(base 그대로).** `So you're not having any thoughts of ending your life right now?`는 "아니죠?"라고 묻는 꼴이라 '아니요'를 끌어낸다. 자살 선별은 긍정형으로 직접 묻는다(ASQ·C-SSRS 모두 "Are you having thoughts of killing yourself?" 꼴).

## 저작자 자기 보고 4건 판정

### 1. 장면과 동떨어진 빈칸 오답(sing/whisper/stretch, tiny/simple/cheap 등)

**받아들이지 않음 — 모두 고친다.** 낱장 머리에 `ko`가 보이므로, 같은 분야의 다른 맞는 말은 `ko`로 걸러져 정답이 둘이 되지 않는다. 그러니 우스운 말로 피할 이유가 없다. 아래 B7~B39에 문장마다 안을 적었다. 몇 가지는 빈칸을 그 문장이 가르치는 다른 말로 옮긴다.

| 문장 | 지금 | 판정 · 고칠 안 |
|---|---|---|
| 4.2 "숨을 쉬어요" | `breathe` / `sing/whisper/stretch` | 받아들이지 않음. `four`는 두 번 나와 빈칸이 될 수 없다. 오답만 같은 장면의 동작으로 → `breathe / talk / sit / walk`(`in for four`가 붙어 `breathe`만 맞고, `ko` "숨을"로 걸러짐) |
| 8.3 "부당하게" | `unfair` / `cheap/tiny/simple` | 받아들이지 않음 → `unfair / scary / confusing / sudden`(모두 억류된 환자가 실제로 느낄 말, `ko` "부당하게"로 걸러짐) |
| 3.3 "잘 오셨어요 … 한 단계씩" | `right` / `wrong/busy/crowded` | 받아들이지 않음. `wrong`은 도움을 청한 환자를 돌려보내는 말이고, `busy/crowded`는 관사 `the`로 걸러진다 → 빈칸을 `step`으로: `one step / one day / one question / one thing at a time`(`ko` "한 단계씩"으로 걸러짐) |
| 10.4 `before` | `after/unless/while` | 기능어이고 `after`는 위험하다(심각 1) → 빈칸을 `home`으로: `home / upstairs / outside / back` |
| 6.4 "시간" | `paper/coffee/snacks` | 받아들이지 않음 → `time / rest / space / sleep`(`ko` "시간"으로 걸러짐) |

### 2. 자살 사고 선별 order 마지막 줄 "If you have, do you have a plan…"

**받아들임 — 실제 조건부이고 전문 지침의 순서와 맞다.** C-SSRS 선별판은 1번(죽었으면 하는 바람)·2번(자살 생각)을 모두에게 묻고, **2번이 '예'일 때만** 3~5번(방법·의도·구체적 계획)으로 간다. 2번이 '아니요'면 6번(과거 행동)으로 건너뛴다. 그러니 계획 질문을 생각 유무에 매는 것은 TASK 10번이 금지한 "모든 환자에게 하는 확인을 조건부로"가 아니다. 장면 brief("콜롬비아 척도 순서로")와도 맞다.
- 인접 교환 세 가지 모두 닫힌다(`With that in mind`가 L1을, `If you have`가 L3을 가리킴).
- 덧붙임(고칠 것 아님): C-SSRS 6번(과거 시도)은 생각 유무와 상관없이 묻는다. 카드에는 없지만 4줄 카드라 빠져도 괜찮다.
- 1.2 `why`의 "방법과 계획을 따로 올려 물어요"는 뜻이 흐리다. "방법(3번)과 구체적인 계획(5번)을 따로 물어요"로 쓰면 정확하다(W7, 경미).

### 3. `why`에서 주법·병원 정책을 단정하지 않은 것

**대체로 받아들임.** 16.1·16.3·16.5(억제)는 "병원 기준"·"원칙"·"표준"으로 썼고 내용도 CMS 482.13(e)와 맞다. 13.3(1:1 관찰)은 "병원 정책에 따라"로 맞게 낮췄다. 8.2·19.5·S19 swap(Tarasoff)도 "주법과 기관 절차"로 썼다.
- 다만 8.1 `why`에는 "(캘리포니아 5150은 72시간)"이 있다. 사실은 맞다. 그러나 "최대"가 빠져 있고, 평가 뒤 연장·전환(예: 5250 14일)될 수 있다는 점이 빠져 "끝이 있다는 말이 사실"이 과하게 읽힌다 → W2.
- 5150 context `why`의 "캘리포니아 법의 조항 번호(주마다 이름이 달라요)"는 정확하다.

### 4. context 정비 3건과 그대로 둔 6건

- **anhedonia(정비)** — 받아들임. 의사 보고 `She reports anhedonia — hasn't enjoyed anything for about two weeks.`는 간호사가 의사에게 실제로 하는 말이다. `ko: 무쾌감증`도 맞다.
- **voices(정비)** — 받아들임. 차트 `Pt reports hearing voices; appears to be responding to internal stimuli.`는 실제 차트 문장이다. XX `Those voices aren't real.`은 듣는 환자에게 반박이라 어색하다. 모양이 맞다.
- **psych eval(정비)** — 받아들임. 응급실 차트에서 `psych eval`은 흔한 줄임말이다. XX `So you're a voluntary psych eval?`은 환자를 절차 이름으로 부른다.
- **belt·5150·deny·sitter·escalating·capacity(그대로)** — 받아들임. 모두 base가 이미 세 장면에 공유한 말이다(TASK 9번). `belt`는 어색함이 `belt`가 아니라 `confiscating`에서 오지만, 묶음 B의 "같은 사람·같은 말 안에서의 방법 대비"처럼 받아들인다. `word`를 `confiscate`로 바꾸면 세 장면 공유가 깨진다.
- **단, `deny`의 `fix`는 고친다(심각 6, C1).** 장면 정비 문제가 아니라 본보기 문장이 유도 질문이다.

## 고칠 것

### 빈칸 — 위험한 처치·처벌 말투 (B1~B6, 반드시)
- B1 · 10.1 `forget/overlook/postpone` → `double-check / explain / write down / mention`
- B2 · 10.4 기능어 `before` + 위험한 `after` → 빈칸을 `home`으로: `home / upstairs / outside / back`
- B3 · 2.4 `return/replace/repair` → `hold / check / label / replace`(`label`은 실제로 소지품에 하는 일, `ko` "맡아 둘게요"로 걸러짐. `return`은 빼기)
- B4 · 6.3 `last/final/same` → `next / first / same / usual`
- B5 · 1.6 `pity/blame/anger` → `concern / pity / curiosity / patience`(`blame`·`anger` 빼기)
- B6 · 3.3 `wrong/busy/crowded` → 빈칸을 `step`으로: `step / day / question / thing`

### 빈칸 — 장면과 동떨어진 오답 (B7~B39)
- B7 · 3.1 `luck/practice/money` → `courage / patience / time / luck`
- B8 · 3.2 `show/coach/ask` — `coach me what`은 비문, `ask me what`은 뜻이 뒤집힘 → `tell / show / remind / teach`
- B9 · 4.2 `sing/whisper/stretch` → `breathe / talk / sit / walk`
- B10 · 4.4 `insurance/allergies/address` → `oxygen / temperature / weight / pupils`
- B11 · 4.6 `moving/calling/dancing` → `staying / charting / typing / moving`(`calling right here`는 어색, `dancing`은 동떨어짐)
- B12 · 5.2 `repair/afford/regret` → `enjoy / avoid / fear / dislike`
- B13 · 5.4 `schedule/address/insurance` → `appetite / weight / energy / mood`(모두 PHQ에서 실제로 묻는 말, `ko` "식욕"으로 걸러짐)
- B14 · 6.4 `paper/coffee/snacks` → `time / rest / space / sleep`
- B15 · 8.2 `debts/pills/rooms` → `rights / privileges / duties / options`(정신과 병동에서 '권리'와 '특권'의 구별은 실제로 가르칠 말)
- B16 · 8.3 `cheap/tiny/simple` → `unfair / scary / confusing / sudden`
- B17 · 9.5 `hire/tutor/pay` → `hurt / trick / trap / rush`
- B18 · 9.6 `wearing/eating/reading` → `seeing / feeling / smelling / tasting`(환각의 감각들, `ko` "보이거나"로 걸러짐)
- B19 · 10.2 `traveling/eating/sleeping` → `struggling / joking / resting / working`
- B20 · 10.5 `rare/costly/legal` → `true / easier / normal / clear`
- B21 · 11.6 `costs/borrows/avoids` → `deserves / delays / hides / causes`(`needs`는 `ko` "필요해요"와 겹치니 쓰지 말 것)
- B22 · 12.2 `dress/drive/vote` → `feel / sign / leave / wait`(`grieve`는 정답과 거의 같으니 쓰지 말 것)
- B23 · 12.3 `paint/study/knit` → `sit / pray / plan / argue`
- B24 · 12.5 `swim/shop/dance` → `cry / scream / laugh / pray`(실제 애도 반응들, `ko` "우는"으로 걸러짐)
- B25 · 12.6 `blame/teach/bill` → `rush / guide / walk / talk`(`push`·`hurry`는 정답과 같은 뜻이라 쓰지 말 것)
- B26 · 13.2 `funny/expensive/legal` → `comfortable / polite / required / proper`(`right`는 `ko` "편한 대로"와 겹침)
- B27 · 13.6 `kneel/bow/pray` → `talk / listen / explain / complain`
- B28 · 14.1 `windy/loud/slow` → `dark / calm / bright / normal`. `ko`가 `dark`를 "힘든"으로 옮겼으니 `heavy`·`hopeless`·`hard`처럼 뜻이 나쁜 말은 모두 정답이 된다. 반대 방향의 말만 쓴다.
- B29 · 15.2 `owe/charge/earn` → `need / hear / see / mean`
- B30 · 15.4 `tired/busy/hungry` → `calm / tense / loud / stiff`
- B31 · 15.5 `faster/busier/colder` → `safer / calmer / sleepier / stronger`
- B32 · 16.1 `relocate/reschedule/redecorate` → `reassess / reposition / reschedule / relocate`(`restrain`·`sedate`는 위험한 처치라 쓰지 말 것)
- B33 · 16.6 `order/forget/borrow` → `need / refuse / skip / repeat`
- B34 · 17.3 `bleed/break/cost` → `happen / change / stop / improve`
- B35 · 17.6 `cheaply/slowly/privately` → `seriously / personally / calmly / literally`(`lightly`는 위험을 가볍게 본다는 말이라 쓰지 말 것)
- B36 · 19.1 `buying/cooking/wearing` → `carrying / causing / showing / sharing`
- B37 · 19.5 `noise/weather/delay` → `threat / anger / plan / delay`
- B38 · 20.1 `vote/travel/pay` → `respond / sleep / stand / see`(`answer`·`speak`는 `ko` "대답"과 겹침)
- B39 · 21.2 `classroom/kitchen/garage` → `hallway / elevator / room / bathroom`(이송 중 실제 장소들, `ko` "복도"로 걸러짐)
- (경미, 선택) 돈 낱말이 남은 7.5 `pays`, 18.1 `expensive`, 18.6 `affordable`, 8.4 `bill`, 13.3 `costly`도 같은 분야 말로(예: 13.3 → `temporary / permanent / regular / private`). 7.1 `fall/move/go`, 14.5 `photograph`, 16.2 `paperwork`, 17.4 `loudly/politely`, 20.3 `proudly`, 18.2 `leaks/errors`도 약하다.
- (경미) 12.1 `sorry for your trouble`은 아일랜드식 조의 인사라 뜻이 맞지만 `ko` "상실에"로 걸러진다. 그대로 둬도 된다.

### decoy — 위험한 지연·간격 (D1~D5, 반드시)
- D1 · 16.1 `at night` → `until you're calm`(`until you're safe` 자리를 대신해도 `ko`와 다르고 위험하지 않음)
- D2 · 16.5 `in the morning` → `if you can eat`
- D3 · 4.4 `after lunch` → `your blood pressure`(청크를 살짝 바꾼 꼴. `your heart rate` 자리에 들면 `ko` "심박수"와 다름)
- D4 · 6.6 `at home` → `in this room`
- D5 · 13.4 `at home` → `this morning`(`tonight` 자리에 들면 `ko` "오늘 밤"과 다름)

### decoy — 넣으면 `ko`에 맞는 것 (D6~D10)
- D6 · 2.2 `from the desk` — `You'll get everything back from the desk when you're discharged`가 `ko`에 맞음 → `everything new`
- D7 · 6.5 `in this room` — `No one here in this room is judging you`가 `ko`에 맞음 → `for being late`
- D8 · 10.1 `for the doctor` — `…double-check a few things for the doctor`가 `ko`에 맞음(파일럿 `for the chart`와 같은 갈래) → `you're tired`
- D9 · 10.5 `to me` — `It's okay to say more than fine to me`가 `ko`에 맞음 → `if that's polite`
- D10 · 19.4 `with him` — `what you're planning to do with him`이 `ko` "그 사람에게"와 같음 → `for him`

### decoy — 불길해지는 `for now`, 돌려쓰기 (D11~D14)
- D11 · 6.2 `for now` — `You're not being judged for now`는 나중에는 판단한다는 말이 된다 → `how you got here`
- D12 · 20.2 `for now` — `you're safe for now` → `with the doctor`
- D13 · 11.4 `for now` — `I'm not going to assume this is only anxiety for now` → `your heart`
- D14 · 주제 전체 — `for you` 15 · `at home` 11 · `for the doctor` 9 · `at night` 9 · `at the desk` 9 = 126개 중 53개. 대비가 없는 부사구라 청크 조립에서 걸러지기만 하고 가르치는 것이 없다. 자살 위험 주제에서 `at home`은 귀가로 읽힌다(3.6 6.6 7.5 8.2 10.2 12.3 13.4 19.5 20.6 21.2 21.5). D1~D13을 고치면서, 남은 것도 같은 자리의 대비 조각(`for your safety` ↔ `for the doctor`, 청크를 살짝 바꾼 `check my`)으로 바꾸기를 권한다. 바꾼 뒤에는 자리마다 넣어 `ko`에 맞는지 다시 확인할 것.

### distractorsKo (K1~K5)
- K1 · 17.3 '집까지는 어떻게 가실 거예요?'(심각 3) → '지금 가장 걱정되는 게 뭐예요?'. 남은 '집에는 누가 계세요?'는 17.2에도 있어 겹친다 → 17.3에서는 '오늘 여기 오기 전에 무슨 일이 있었어요?'
- K2 · 18.2 '대기 중인 병원 목록을 확인할게요' — 정답 "빈자리를 확인하고 있어요"와 반쯤 같다 → '담요를 더 가져다 드릴까요?'
- K3 · 19.5 '이 내용은 의사 선생님도 확인하실 거예요' — 의사도 팀이라 정답 "팀의 다른 사람들에게도 알려야 해요"와 반쯤 같다 → '물 한 잔 드릴까요?'
- K4 · 19.6 '그분 이름을 알려 주시겠어요?' — "누구를 향한 건지 여쭤봐야 해요"와 거의 같다 → '오늘 잠은 좀 주무셨어요?'
- K5 · 14.6 '고칠 곳이 있으면 말씀해 주세요' — "실제로 당신에게 맞아야 해요"와 말하는 뜻이 겹친다(경계선) → '계획을 가족에게도 보여 드릴까요?'
- (선택) 10.4 '집에 가는 길에 도와주실 분이 있으세요?' — 자살 위험을 부정하는 환자에게 귀가를 전제한다. 문장 자체(`before you go home`)가 귀가를 전제하니 큰 문제는 아니지만, '오늘 밤 같이 계실 분이 있으세요?'가 더 안전하다.

### order (O1~O15)
고친 카드는 모두 `why`의 "'…'가 앞 줄을 가리켜" 문구를 새 줄에 맞게 다시 쓰고, 줄 `ko`·`note`를 맞추고, 인접 교환 세 가지와 15단어를 다시 확인할 것.
- O1 · S2 — 3↔4가 열렸다(`That's only temporary …`를 앞에, `I know this feels intrusive …`를 끝에 둬도 자연스럽다). L2 "이 방을 나갈 때까지"와 L4 "퇴원할 때"도 어긋난다. → L3 `I know giving those up feels intrusive, but it keeps you safe.`, L4 `That's the only reason — it isn't punishment, and you'll get it all back.`(`those`가 L2를, `That's the only reason`이 L3의 이유를 가리킴)
- O2 · S3 — L2 `That tells me you're in the right place`는 논리가 없다(용기가 '맞는 곳'의 근거가 아님). 3↔4도 열렸다(`Whatever it is, …`가 질문 앞에 와도 자연스럽다). → L2 `That was the right call, and I'm glad you're here.`, L4 `Thank you for sharing that — we'll take it one step at a time.`
- O3 · S4 — 3↔4가 열렸다(`…through all of it`이 심장 설명 앞에 와도 읽힌다). L1·L4가 `right here with you`를 되풀이한다. → L4 `I'm staying with you through every one of those checks.`(`those checks`가 L3을 가리킴)
- O4 · S6 — 3↔4가 반쯤 열렸다(`Whatever we talk about`). L3는 16단어다. → L3 `Take all the time you need before we talk — no one's judging you.`(13단어), L4 `When we do talk, we'll take the next steps together, at your pace.`
- O5 · S8 — L3 `Part of that explanation: …, and I'll explain each step`은 어색한 영어이고 설명을 두 번 말한다. 권리는 '왜'의 설명도 아니다. L4 `With those rights`도 억지다. → L3 `The short reason is safety, and you still have rights during the hold.`, L4 `One of them is having a say in how we do this together.`(`them`이 권리를 가리킴)
- O6 · S9 — L3 `I can't hear it`은 환자가 '보이는 것'을 말하면 맞지 않는다. → L3 `Even if I can't see or hear it, I believe it feels real.` (경미, 선택) L4 `Since it feels so real`이 문을 열어 두는 이유로는 약하다.
- O7 · S10 — 3↔4가 열렸다(`I only want to keep you safe.` 뒤에 `That's why there's no wrong answer`가 자연스럽다). → L4 `Whatever you say after that, I only want to keep you safe.`
- O8 · S12 — L3 `That's why some people cry …`는 인과가 거꾸로다(반응이 다양한 것이 '옳은 방식이 없다'의 근거이지 결과가 아님). → L3 `That means some people cry and some go quiet — both are okay.`
- O9 · S13 — L1에서 `This person`을 소개한 뒤 L2가 `someone`으로 되돌아간다. L2 `That's why`는 L1을 되풀이할 뿐이다. L4 `With that support, you can talk to them or not`은 억지이고, 3↔4가 반쯤 열렸다. → L1 `Tonight, someone will stay close by to keep you safe.` L2 `This person is here only for that, not to judge you.` L3 `Since that's their only job, you can talk to them or not.` L4 `Their time with you is temporary, while we work on next steps.`
- O10 · S16 — 2↔3과 3↔4가 열렸다(`Along with that`은 어느 줄 뒤에도 붙고, `they come off`도 L3 앞에 와도 읽힌다). → L2 `While they're on, we check on you constantly to see if they can come off.`(15단어) L3 `As soon as it's safe, they do.` L4 `For the medication we're giving, I'll tell you exactly what it is and why.`
- O11 · S17 — 머리말 `ko`가 거꾸로다(심각 4) → `치료 거부·귀가 요구 환자 4문장 순서`. 2↔3도 반쯤 열렸다(`From that`이 L1의 '위험'을 가리켜도 읽힌다). → L3 `Your answer helps me understand if you can think clearly about this decision.`
- O12 · S19 — L4 `Taking threats seriously means …`가 L3의 말을 그대로 되풀이한다(브리프 갈래 3). → L4 `That means I must tell a few other people on the team.`
- O13 · S20 — L3 `As I said`는 가리킬 말이 없다(L2는 눈을 본다고 말하지 않았다). → L3 `To start, I'll look at your eyes and check how your body responds.`
- O14 · S21 — 2↔3이 열렸다(이동을 먼저 말하고 `Whatever it is, you're not alone …`을 뒤에 둬도 자연스럽다). L2와 L4가 `alone`을 되풀이한다. → L2 `Whatever it is, I'm staying right here with you.` L3 `With me right here, let's get you somewhere safer while we sort this out.`
- O15 · S15 (경미) — L3 `In this space, …`가 억지 연결어다. 교환은 닫혀 있으니 선택.
- (경미, 선택) S18 L3 `Here it is:`는 말로는 `Here's where things stand:`가 더 자연스럽다.

### context·swap (C1~C3)
- C1 · S10 context `deny`의 `fix`(심각 6) → `Are you having any thoughts of ending your life right now?` `why` 끝에 "부정형으로 확인하듯 묻지 않고, 긍정형으로 직접 물어요"를 덧붙일 것.
- C2 · S14 swap `ko` "힘든 순간이 다시 오면 함께 계획을 세워요" — 계획은 지금 세우는 것이다 → "다음에 힘든 순간이 올 때를 위해 함께 계획을 세워요"
- C3 · S21 swap `ko` "잘 들으세요, …" — `Listen,`을 명령으로 옮겼다. 위기 환자에게 하는 부드러운 부름이다 → "있잖아요, 제가 바로 여기 곁에 있을게요 — 더 안전한 곳으로 모시는 동안에요"

### why·tag·icon (W1~W7)
- W1 · 1.1 why(심각 5) → `any thoughts of로 행동이 아니라 '생각'부터 물어요. hurting yourself는 자해를 묻는 말이라, 자살은 이어서 ending your life처럼 분명한 말로 따로 물어요.`
- W2 · 8.1 why → `temporary로 기한이 있다는 것을, while we assess로 끝나는 조건을 함께 알려요. 응급 억류는 법으로 최대 기한이 정해져 있어요(주마다 다르고, 캘리포니아 5150은 최대 72시간). 평가 뒤 연장될 수도 있어서 날짜는 약속하지 않아요.`
- W3 · 18.6 why — 어색한 `a bed for both of you`(병상은 환자 것)를 의도처럼 설명한다 → `everything possible로 노력의 범위를 말하되 결과는 약속하지 않아요. 언제 날지 모르는 병상을 두고 지킬 수 있는 말만 해요.`(문장 자체는 결정 11에서 보고)
- W4 · 7.6 tag `비밀 허용` → `사생활 인정`. 문장은 사생활을 원하는 마음을 인정할 뿐 비밀을 약속하지 않는다.
- W5 · 3.4 why `me를 넣어 나에게 들려 달라는 초대로` — 근거가 약하다 → `Tell me…는 짧고 열린 요청이라 환자가 어디서부터 말할지 스스로 정해요. lately로 범위를 최근으로 좁혀서 지금 왜 왔는지에 먼저 닿아요.`
- W6 · 14.4 why "안전 계획의 핵심" → "안전 계획의 한 단계". 5.2 why "가장 정확해요" → "도움이 돼요"(경미).
- W7 · 1.2 why "방법과 계획을 따로 올려 물어요" → "방법(3번)과 구체적인 계획(5번)을 따로 물어요"(경미).
- (경미, 선택) `shield`가 126개 중 32개다. 안심 문장 일부를 `handshake2`·`me`·`check`로. S11 L3 `stetho`와 11.4 `shield`가 서로 다르다.

### 결정 11 (v44 단어·문장)
- 바뀐 것 없음(단어 전부·문장의 v44 필드가 base와 같음, V16 통과). 보고만 한다.
- 1.1 `Have you had any thoughts of hurting yourself?` — 장면이 자살 사고 선별인데 자해를 묻는다. 같은 주제 swap이 가르치듯 선별 질문은 `killing yourself`·`ending your life`처럼 분명하게 묻는다(ASQ). 다음 정비 때 1.1을 `…thoughts of ending your life?`로 바꾸거나 자해 질문임을 장면에 맞게 두기를 권한다.
- 18.6 `…to get a bed for both of you` — 병상은 환자 것이다. `…to get a bed as soon as possible`이 맞다.
- 8.4 `We have to assess you before we can let you go` — 억류 중인 환자에게 평가 뒤 내보낸다고 약속하는 말로 읽힌다.
- 13.5 `They're not here to watch you like a punishment` — 시터는 실제로 지켜본다. 문장이 '감시가 아니다'로 오해될 수 있다.
- 10.4 `…before you go home` — 자살 위험을 부정하는 환자에게 귀가를 전제한다. 장면(`Can I just go home?`)에는 맞지만 결정은 평가 뒤에 난다.
- W13 경고 4건(`scared`↔`scarred`, `sorry`↔`sore`, `off`↔`of`, `every`↔`ever`)은 읽어 보니 모두 다른 낱말이라 그대로 둬도 된다.

**고칠 것 합계**: 빈칸 39(위험 6 · 동떨어짐 33), decoy 14(위험 5 · `ko`에 맞음 5 · 불길함·돌려쓰기 4), distractorsKo 5, order 15, context·swap 3, why·tag 7 → **83건**. 경미·선택·권장 항목은 따로.

## 종합

자살 위험 환자에게 확인을 건너뛰거나 귀가 뒤로 미루는 빈칸, 억제 환자를 밤·아침에만 보는 decoy, 시도 직후 귀가를 돕는 오답 뜻처럼 위험한 처치를 보이는 12건(빈칸 6 · decoy 5 · 오답 뜻 1)과 S17 머리말, 1.1 `why`, `deny` 유도 질문은 반드시 고쳐야 한다. 이것과 동떨어진 빈칸 33문장, 열린 order 7장을 고친 뒤 다시 검토하면 내보낼 수 있다. 지금 상태로는 내보내지 않는다. 비밀 약속·혼자 두기·낙인 표현은 새 필드에 없고, 정신과 임상 근거(C-SSRS 순서, 안전 계획, 억제·억류 설명)는 대체로 정확하다.
