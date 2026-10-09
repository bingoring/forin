# core-family-er — v46 보강 검토 (er)

대상: `core-family-er.yaml` (상황 20 · 문장 100 · order 20장). 문장 100개·order 20장 전수.
상황 번호는 파일 순서 0부터(S0 = 가족 대기 정보 제공 … S19 = 소아 사망 가족 지지), 문장은 `상황.문장`(0부터).

기계로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 400줄, decoy를 청크 자리마다 넣은 조립 약 370줄, order 인접 교환 60가지,
선택지 아이콘의 정답/오답 분포, 제안안의 V18 조건(넷 서로 다름·정답 아이콘 ≠ 문장 아이콘·NbIcon 목록·`check`/`cross` 없음)
— 아래 제안안을 전부 적용한 상태로 다시 돌려 위반 0을 확인했다.

판정 기준(앱 코드 확인): 빈칸·조립 낱장 머리에는 `sheetKo(card)` = **그 문장의 `ko`가 보인다**(`mobile/src/data/sentenceDrill.ts:178`).
그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 문법은 맞고 장면상 그럴듯해도 `ko`가 걸러 주는 오답
(1.0 `two visitors`, 5.2 `ask`, 6.1 `wrong`, 18.2 `calm`/`slow`, 18.3 `fear`, 16.0 `changed`, 아래 제안안의 11.2 `something`,
10.1 `help`/`time`, 4.1 `dose`, 16.1 `recovery`)은 괜찮은 오답으로 봤다. 이 판정은 `ko`가 머리에 보인다는 전제에 기대고 있다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 "말하는 방식의 이유"(Let me…, I can see…, might, rather than)를 짚는다. `ko` 되풀이 없음. 고칠 것은 10.2(머리맡 일반화)·2.1(근거가 약함) 둘뿐. 사망 고지의 `died` 권고는 맞다. |
| 2 | 빈칸 | 3 | `ko`로 걸러져 정답이 둘인 것은 사실상 11.2 하나. 그러나 **문법으로 걸러지는 오답**(3.4 `bothers to me`, 18.4 `laughing to all of it`, 15.3 `no many`, 1.0 `no visitors … at a time`, 13.2 `here like you`)과 **장면과 동떨어진 오답**(11.4 `shower`, 4.1 `find the doctor`, 10.1 `sugar`, 16.1 `profit`, 16.3 `cooked`, 19.0 `trip`, 13.1 `run away`)이 남았다. |
| 3 | `decoy` | 4 | 대부분 자리를 대신하면 비문이거나 `ko`와 어긋난다. `ko`에도 맞는 다른 문장이 되는 것 6건(6.0·8.3·13.4·14.0·14.4·15.3). |
| 4 | `distractorsKo` | 5 | 전부 같은 상황에서 할 법한 다른 말이고, 반만 다른 말 없음. 15.2 `준비가 안 되면 안 돼요`가 한국어로 어색한 정도(선택). |
| 5 | `order` | 3 | 20장 중 7장에서 인접 교환이 자연스럽다(S0 3↔4, S3 3↔4, S6 3↔4, S8 1↔2, S14 1↔2·3↔4, S17 3↔4, S18 2↔3·3↔4). 그 카드의 `why`에 있는 "순서가 하나예요"도 사실이 아니다. 새 줄 중 영어가 어색한 것 2(S13 3줄, S15 2줄), 논리가 약한 것 1(S9 4줄 `Until then`). 앞 줄을 가리키는 말로 묶은 설계는 13장에서 잘 됐다. |
| 6 | `tag`·`icon` | 3 | 태그는 역할을 잘 말한다. 선택지 아이콘은 **어긋난 것 약 45개**(400개 중) — 대부분 `lock`을 "부정"의 기본값으로 쓴 것. **정답만 긍정 아이콘(handshake2·star·chartup)인 문장 29개** — 정답 아이콘 분포가 handshake2 18/7, star 12/5, magnify 3/0, 오답 쪽은 lock 35/8, calendar 13/0, plane 10/0이라 아이콘만 보고 고를 수 있다. |
| 7 | context `word`·`ko`, swap `ko` | 4 | swap `ko` 10건은 전부 정답 선택지를 넣은 문장의 뜻. context `ko`도 정확. 다만 S4 `immediate`, S14 `tell`은 세 장면 어디에도 그 낱말이 없어 화면 제목("`immediate`가 어색한 장면은?")과 맞지 않는다. |
| 8 | 파일럿 갈래 | 3 | (1) 아이콘 — 위 6. (2) 동떨어진 오답 약 12문장, 문법으로 걸러지는 오답 5문장. (3) order — 위 5. (4) 임상 순서·사실 — order 순서는 임상적으로 맞다(SPIKES·GRIEV_ING·가족 입회). 다만 S17은 간호사가 기증을 직접 꺼내는 흐름이라 미국 관행과 어긋난다(base 설계 — 아래 결정 11 보고). (5) decoy·오답 뜻 겹침 — 위 3·4. |

## 사실 오류·심각한 문제

1. **S17 장기기증 대화 연계 (base 설계 + v46 order)** — order 2줄 `When you're ready, there's a sensitive option I'd like to gently mention.`과
   base 17.1·17.3은 **병상 간호사가 기증을 먼저 꺼내는** 흐름이다. 미국에서는 병원이 사망·임종 임박 환자를 OPO에 의무 통보하고(CMS
   조건 42 CFR 482.45), 가족에게 기증을 청하는 일은 **OPO나 교육받은 지정 요청자**가 하도록 정해져 있다. 같은 상황 swap의 `why`도
   그렇게 바르게 쓴다. 병상 의료진이 먼저 말을 꺼내지 않는 것이 권장 관행이다. 또 17.2 `it's entirely your family's choice`는 환자가
   **기증 등록자**이면 사실이 아니다(개정 UAGA의 본인 동의 — 가족이 법적으로 뒤집지 못함). keyPhrase(`a specialist can talk about donation`,
   `it's entirely your family's choice`)가 걸린 설계라 **결정 대기**로 둔다. v46에서 고칠 수 있는 것: order `why`와 17.1·17.3 `why`에
   "기증 요청은 OPO 담당자 몫이고 간호사는 연결만 한다"를 분명히(아래 order S17).
2. **11.2 빈칸** — `no one`/`nobody`는 부정 의문문(`Is there no one you'd like to have with you?`)으로 거의 같은 질문이 되고, 둘이
   동의어라 함께 지워진다. 저작자 자기 보고 2가 맞다. → 아래 빈칸 목록.
3. **10.2 `why`** — "머리맡은 대개 처치가 이뤄지는 몸 쪽과 겹치지 않는 자리예요". 기도 관리·소생 중에는 머리맡이 가장 붐비는 자리라 일반화가
   틀렸다. → "팔·다리 처치 때 머리맡은 팀의 손과 덜 겹치고, 환자가 보호자의 얼굴을 볼 수 있는 자리예요."

## 저작자 자기 보고 4건 판정

1. **`check`·`cross`를 바꾼 선택지 아이콘** — 맞는 지적이고 범위가 더 넓다. 어긋난 아이콘이 **약 45개**(400개 중)다. 가장 흔한 것은 `lock`을
   부정의 기본값으로 쓴 것이다(okay·good·better·happy·possible·died·easy·wrong·hurts·confirm에 `lock`). 그 밖에 facts→chevronDown,
   moment→chevronDown, run away→chartup, quiet→mic, confused→bulb, a month→pushpin. **정답만 긍정 아이콘인 문장이 29개**다
   (0.0 2.3 3.0 3.4 4.3 5.4 6.3 7.1 7.2 7.4 8.0 8.3 8.4 9.2 9.3 9.4 10.0 10.3 12.1 13.2 13.4 14.3 15.1 16.2 16.3 17.2 17.4 19.1 19.2).
   반대 방향 오답(love↔hate/fear)이면 낱말 느낌을 따른 아이콘이 저절로 답을 가리킨다. 고치는 방법은 두 가지다. **정답에는 뜻에 맞는 중립 아이콘**
   (speech·pushpin·board·monitor·me·home·shield·compass)을 주고, 몇 문장에서는 **오답 하나에 긍정 아이콘**(5.0 easy→star, 5.2 sell→handshake2,
   13.3 recovered→star, 10.1 help→handshake2, 18.4 agreeing→handshake2)을 준다. 구체안은 아래 "아이콘" 목록에 있다(89곳, 55문장 + 빈칸 낱말을 바꾼 14문장).
   적용하면 정답만 긍정 아이콘인 문장은 0이 되고, 분포는 handshake2 1/11, star 2/7, bell 7/6, speech 10/6, lock 2/25가 된다(정답:오답 기본 비가 1:3이라 정답 쪽으로 크게 기운 아이콘이 없다).
2. **정답으로도 맞는 오답** — `ko`가 머리에 보여서 실제로 정답이 둘이 되는 것은 **11.2 하나**다(no one/nobody). 그 밖에 장면상 그럴듯한 오답
   (5.2 ask, 16.0 changed, 18.2 slow, 18.3 fear, 19.4 sorry, 15.4 hide)은 `ko`가 걸러 준다. 대신 **문법으로 걸러지는 오답** 5문장이 더 문제다
   (3.4·18.4·15.3·1.0·13.2). 읽기만 해도 답이 나온다.
3. **order 맞바꿈** — 상황 14 3·4줄이 맞다. 1·2줄도 맞바꿀 수 있다(`You can be here with her…` → `The team is doing…`). 새로 쓴 줄은 대체로 대화로
   자연스럽다. 맞바꿔도 자연스러운 카드는 S0·S3·S6·S8·S14·S17·S18의 7장이다. 새 줄 가운데 영어가 어색한 것은 S13 3줄 `…after hearing that.`과
   S15 2줄 `However you feel in response to that, it's okay.`의 둘이다. S9 4줄 `Until then, we'll do our best…`는 "기도 전까지만 존중한다"로 읽혀
   논리가 약하다. 구체안은 아래 order 목록에 있다.
4. **`why`의 사실성** — 사망 고지에서 `died`·`dead`처럼 분명한 말을 한 번은 쓰라는 권고는 **맞다**. 사망 고지 교육(GRIEV_ING 등)이 완곡어
   (passed away·lost) 대신 그렇게 가르친다. 13.1·13.3·S13 swap·S13 context·S13 order(2줄 `he has died`)는 서로 맞고 사실이다. swap `why`의
   "미국 응급실 사망 고지의 **표준** 권고"는 "널리 가르치는 권고"로 누그러뜨려도 좋다(선택). 그 밖에 맞는 것: SPIKES의 Setting(사적인 방)과
   Perception(이미 아는 것 묻기), 근거 없는 안심(false reassurance) 피하기, `Why` 질문 피하기, 대리 결정의 substituted judgment,
   `withdraw care` 대신 "돌봄은 계속된다", 소생 중 가족 입회와 곁을 지키는 직원, 기념물(손도장·메모리 박스), 연락 담당자 한 명 정하기.
   틀리거나 과한 것은 10.2(머리맡)와 S17(기증 요청 주체 — 위 1)이다. 2.1 `why`는 근거가 약하다(아래).

## 고칠 것 (v46 필드)

### why (2)
- 10.2 · 머리맡 일반화(위 3) · "help most by -ing는 …하는 것이 가장 도움이 된다는 구조라, 막는 대신 할 수 있는 일을 쥐여 줘요. 팔·다리 처치 때 머리맡은 팀의 손과 덜 겹치고 환자가 보호자의 얼굴을 볼 수 있는 자리예요."
- 2.1 · "the patient's로 물으면 보호자가 자기 위치를 스스로 말하게 돼요"는 근거가 없다(예/아니오 질문) · "emergency contact는 차트에 등록된 연락 담당자라, 정보를 나눌 사람인지 가늠하는 첫 단서가 돼요. 예/아니오로 답하는 짧은 질문이라 긴장한 가족도 쉽게 대답해요."

### 빈칸 — 낱말 바꾸기 (14문장; 넣어 읽기·관사·`ko` 확인함, 아이콘까지 함께)
- 1.0 · `no visitors … at a time` 비문 · `no visitors` → `three visitors`(pushpin)
- 1.2 · `dark and calm`은 바라는 상태로도 읽힘 · `dark` → `busy`(gear)
- 3.4 · `bothers/scares/annoys to me` 셋 다 비문(타동사 + to me) · → `gets`(faceAngry: "gets to me" = 거슬린다), `comes`(compass), `belongs`(lock). 정답 `matters` star→pushpin, **문장 `icon` pushpin→speech**(V18)
- 4.1 · `find the doctor/room/nurse` 동떨어짐 · → `cure`(pill), `dose`(monitor), `bed`(home)
- 10.1 · `money/noise/sugar` 동떨어짐 · → `light`(bulb), `time`(calendar), `help`(handshake2) — `ko` "공간"이 걸러 줌
- 11.2 · `no one/nobody` 부정 의문문이라 정답이 둘에 가깝고 둘이 동의어 · `no one/nobody/nothing` → `something`(pushpin), `a blanket`(home), `a phone`(mic) — `ko` "분"이 걸러 줌. 정답 `someone`(me)은 그대로
- 11.4 · `picture/ticket/shower` 동떨어짐 · → `pill`(pill), `number`(board), `test`(lab); 정답 `moment` chevronDown→calendar. (`breath`·`seat`는 `ko`에 맞아 쓰지 말 것)
- 13.1 · `walked/run/moved away`는 사망 고지 장에서 농담처럼 읽힘 · → `pulled through`(chartup), `passed out`(home), `woken up`(bell)
- 13.2 · `I'm here like you` 비문 · `like` → `instead of`(redo); 정답 `with` handshake2→me
- 15.3 · `no many words` 비문 · `many` → `more`(chartup). (`easy`·`kind`·`perfect`는 정답과 뜻이 겹쳐 안 됨)
- 16.1 · `noise/speed/profit` 동떨어짐 · → `surgery`(scalpel), `recovery`(chartup), `discharge`(plane)
- 16.3 · `cooked/painted/bought` 동떨어짐 · → `refused`(lock), `signed`(pencil), `feared`(faceWorried); 정답 `wanted` star→bulb
- 18.4 · `laughing/shouting/leaving to all of it` 셋 다 비문 · → `objecting`(lock), `replying`(speech), `agreeing`(handshake2)
- 19.0 · `bill/trip` 동떨어짐 · → `illness`(pill), `injury`(bandage); `test`(lab)는 그대로

### 아이콘 (55문장 · 낱말은 그대로, `*`는 정답) — 정답만 긍정 아이콘인 29문장과 어긋난 약 45개를 함께 고침
- 0.0 `*stable` chartup→monitor, `confused` bulb→compass
- 0.1 `*an hour` monitor→bell, `a month` pushpin→calendar, `two days` calendar→pushpin
- 0.3 `*update` bell→mic
- 1.1 `weeks` pushpin→calendar, `hours` calendar→play
- 2.0 `*confirm` lock→magnify
- 2.2 `hide` monitor→lock, `delete` chevronDown→redo
- 2.3 `*relationship` handshake2→home
- 2.4 `delete` lock→chevronDown
- 3.0 `bad` lock→chevronDown, `*good` star→speech
- 3.1 `*okay` lock→pushpin
- 4.0 `*good` lock→stetho, `bad` redo→siren
- 4.3 `*stands` chartup→monitor
- 4.4 `quiet` mic→coffee, `*posted` bell→speech
- 5.0 `easy` lock→star
- 5.1 `quick` chartup→play, `ready` play→bell, `*honest` handshake2→shield
- 5.2 `charge` monitor→board, `sell` board→handshake2
- 5.4 `wrong` lock→chevronDown, `*alone` handshake2→hospital
- 6.1 `wrong` lock→chevronDown
- 6.2 `remove` lock→chevronDown
- 6.3 `wrong` lock→chevronDown, `*same` handshake2→pushpin
- 6.4 `*facts` chevronDown→board
- 7.1 `*honor` star→shield
- 7.2 `*involve` handshake2→speech
- 7.4 `doubt` bulb→faceWorried, `*love` star→home
- 8.0 `shake` play→handshake2, `*hold` handshake2→me
- 8.1 `*better` lock→baby
- 8.2 `hurts` lock→bandage
- 8.3 `outside` lock→home, `*close` handshake2→pushpin
- 8.4 `*softly` star→speech
- 9.2 `*coordinate` handshake2→board
- 9.3 `*honor` star→shield
- 9.4 `*most` star→pushpin, `less` lock→redo
- 10.0 `*care` star→bandage
- 10.2 `*softly` bell→speech
- 10.3 `stop` faceAngry→lock, `hurt` lock→bandage, `*help` handshake2→shield
- 12.0 `lecture` trophy→speaker, `*update` bell→mic
- 12.1 `confused` bulb→compass, `*stable` chartup→monitor
- 12.2 `refunds` pushpin→redo
- 12.4 `*direct` speaker→mic, `busy` siren→gear, `broken` lock→chevronDown
- 13.0 `happy` lock→trophy
- 13.3 `*died` lock→chevronDown, `recovered` chevronDown→star
- 13.4 `*stay` handshake2→pushpin
- 14.0 `*possible` lock→compass
- 14.3 `*side` handshake2→shield
- 14.4 `forget` lock→chevronDown, `stop` chevronDown→lock
- 15.0 `measure` monitor→magnify (magnify가 정답에만 나오던 것 풀기)
- 15.1 `rude` speaker→faceAngry, `wrong` faceAngry→chevronDown, `shameful` lock→faceWorried, `*okay` handshake2→coffee
- 16.2 `*decide` handshake2→compass
- 17.2 `*entirely` handshake2→pushpin
- 17.4 `*coordinator` handshake2→stetho
- 18.0 `sleepy` chevronDown→home
- 18.1 `stop` faceAngry→lock
- 19.1 `*can` handshake2→baby
- 19.2 `bill` pencil→board, `report` board→pencil, `*keepsake` star→baby
- 19.4 `hello` play→speech

### decoy (6) — 자리를 대신하면 `ko`에도 맞는 문장이 됨
- 6.0 · `by now` → "…what we actually know by now"(= 지금까지) · → `next week`
- 8.3 · `of him` → "We're taking good care of him — you can stay close."(`ko`에 성별 없음) · → `for her`
- 13.4 · `for you` → "I'll stay right here for you."(≈ 곁에 있을게요) · → `from you`
- 14.0 · `for him` → "…doing everything possible for him."(`ko`에 대상 없음) · → `of her`
- 14.4 · `for him` → "…what the team is doing for him." · → `of her`
- 15.3 · `for you` → "There are no right words — I'm here for you." · → `to you`

### order (10장) — 줄을 고치면 `why`도 함께 고친다(바뀐 연결어를 가리키게, "순서가 하나예요" 근거 갱신)
- S0 · 3↔4 자연스러움(`they`가 2줄의 tests를 받음) · 4줄 → `When that hour is up, I'll come find you with the results.`(ko "그 한 시간이 지나면 결과를 들고 찾아뵐게요") — `that hour`는 3줄만 받는다(0.1이 가르치는 `about` 여지가 빠지는 것은 order 줄이라 감수)
- S3 · 3↔4 자연스러움(`Each time`이 2줄 뒤에도 붙음) · 4줄 → `Each time you do, I'll explain again until it makes sense.` — `do`가 3줄의 `ask`를 받는다(`Each time you ask`는 다시 교환이 됨)
- S6 · 3↔4 자연스러움(`That way`가 2줄 clarify 뒤에도 붙음) · 4줄 → `That person can then pass the same information to everyone.`(ko "그분이 모두에게 같은 정보를 전해 주실 수 있어요")
- S8 · 1↔2 자연스러움(묻고 나서 허락해도 됨) · 2줄 → `While you do, tell me what usually comforts her at home.` — `you do`가 1줄의 hold를 받는다
- S9 · 4줄 `Until then, we'll do our best…`는 "그때까지만 존중"으로 읽혀 논리가 약함 · 4줄 → `Once it's arranged, I'll come back and tell you the time.`(ko "준비되면 다시 와서 시간을 알려드릴게요", note `약속`, icon `bell`)
- S13 · 3줄 `Please take all the time you need after hearing that.` 영어가 어색함 · → `I know that's a lot to take in — take all the time you need.`(ko "받아들이기 힘드실 거예요, 필요한 만큼 시간을 가지세요")
- S14 · 1↔2·3↔4 둘 다 자연스러움(자기 보고 3 확인) · 2줄 → `While they work, you can stay with her — I'll be by your side.`(`they` = 1줄 the team), 4줄 → `As you talk to her, I'll keep telling you what the team is doing.`(`As you talk to her`는 3줄 뒤에만). `why`의 Meanwhile 설명도 바꿀 것. 2·3줄이 둘 다 While로 시작하는 게 거슬리면 3줄 → `From where you're standing, you can talk to her.`(선택)
- S15 · 2줄 `However you feel in response to that, it's okay.` 어색함 · → `Whatever you're feeling about it, that's okay.`(`it` = 1줄 this moment). 3줄 `Take your time getting ready`는 그대로 둬도 됨
- S17 · 3↔4 자연스러움(`If you choose to hear more` → `That said, no pressure`) · 4줄 → `If you do want to hear more, a donation coordinator can explain everything.` — 강조 `do`는 3줄의 "압박 없음"에 맞서는 말이라 3줄 뒤에만 선다. `why`에 "기증 이야기는 OPO 코디네이터가 하고 간호사는 연결만 한다"를 넣을 것(위 사실 1)
- S18 · 2↔3·3↔4 자연스러움(`Take your time — I'm listening`은 어디에 둬도 됨) · 2줄 → `Let's sit down, and tell me all of it.`(`it` = 1줄 anger), 3줄 → `Take your time — I'll just listen until you're done.`, 4줄 → `When you are, I'll explain what happened.` — `When you are`는 3줄의 done만 받는다(S15 4줄과 같은 방식)

### 문장 아이콘·태그 (3)
- 1.4 · 문장 `icon` faceWorried가 "쉬고 차분하게"와 반대 · → `hospital`
- 3.4 · 태그 `경청 약속`은 문장(질문이 중요하다)과 어긋남 · → `질문 존중` (아이콘은 위 빈칸 3.4에서 speech로)
- 2.4 문장 `icon`과 order S2 4줄·S8 3줄 줄 `icon`이 `check`다. V18은 통과하지만 ✓/✕ 결과 표시와 같은 앰버 원에 그려진다 · → `monitor`(2.4 — `board`는 선택지 print가 쓰고 있음), `magnify`(S2 4줄), `play`(S8 3줄) — 선택

### context (2, 낮음)
- S4 · `word: immediate` — 세 장면 어디에도 immediate가 없다(in extremis·critical). 메모 "뜻은 셋 다 '즉각적인'"이 맞지 않는다 · 장면을 고치지 않는다면 `word: danger`, `ko: 위험`이 낫다(세 장면이 모두 "당장 위험하지 않다"를 말함)
- S14 · `word: tell` — 세 장면이 CPR 상황 보고라 tell이 없다 · `word: CPR`(ko `심폐소생술`)이나 `word: team`(ko `팀`)이 장면과 맞다. V14는 word가 은행 id일 것을 요구하지 않으니(`verify_lesson_content.py`) 쉬운 말인 team보다 CPR을 권함

## 결정 11 — 기존 문장(보고만, 고치려면 사용자 결정)
- 3.4 `ko` "환자분이 하시는 모든 질문이" — 말하는 상대는 가족(S3 role family) · "하시는 모든 질문이 저에게는 중요해요"
- 10.4 `ko` "아이에게", 14.2 `ko` "아이에게" — S10·S14는 소아 장면이 아니다(10.0 `ko`는 "환자분을") · "환자분께"
- 10.3 `let me guide how` (+ S10 swap 정답 같은 말) — 부자연스러운 영어. 자연스러운 말은 `let me show you how`. 고치면 swap의 options/answer/notes 키도 같이
- 18.3 `you have every right to it` — 쓸 수는 있지만 `you have every right to feel that way`가 더 자연스러움(낮음)
- S17 기증(위 사실 1) — keyPhrase가 걸린 설계라 결정 대기

## 개수
v46 필드 고칠 것 **92건**: why 2 · 빈칸 낱말 14문장 · 아이콘 55문장(89곳) · decoy 6 · order 10장 · 문장 아이콘·태그 3 · context 2.
결정 11 보고 5건(S17 포함).

## 종합
`why`·`distractorsKo`·swap `ko`는 그대로 내보내도 되는 수준이다. 빈칸 아이콘(정답만 긍정 아이콘 29문장, `lock` 남용), 문법으로 걸러지는 오답,
order 7장의 교환 가능성을 고쳐야 한다. 위 목록을 반영하면 내보내도 된다. S17 기증 흐름은 결정을 따로 받을 것.
