# core-language-er — v46 보강 검토 (er)

대상: `core-language-er.yaml` (상황 20 · 문장 103 · order 20장). 문장 103개·order 20장 전수.
기계로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 412줄, decoy를 청크 자리마다 넣은 조립(약 330줄), order 인접 교환
60가지, distractorsKo 206개, 선택지 아이콘 412개(오답 309개는 단어별 어울림 판정), base 대비 기존 키 변경 여부.
base 대비: v44 단어·문장 키는 한 글자도 안 바뀜, `nuance:` 그대로이고 context에 `word`·`ko`, swap에 `ko`만 더해짐 ✓.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 "말하는 방식의 이유"를 짚는다. 법·근거(Title VI·§1557·ADA·teach-back·자살 직접 질문)는 맞음. 과장·부정확 6건(2.5 today, 4.4 "예외 없는", 6.4 so=이유, 11.1, 17.2, 17.3). |
| 2 | 빈칸 | 2 | 문법으로만 걸러지는 오답 15문장(+8.3), 장면상 정답이 둘 될 수 있는 오답 8문장, 대명사·기능어 빈칸(가르치는 말 아님) 다수. **오답 아이콘 309개 중 295개가 낱말과 무관**하고, 정답에만 쓰이는 아이콘 묶음이 있어 답이 보인다(아래). |
| 3 | `decoy` | 4 | 대부분 자리 대체 시 문법이 깨지거나 `ko`와 어긋난다. `ko`에 맞는 다른 문장이 조립되는 것 4건(3.2·4.1·5.1·5.5), 약한 것 3건. |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황의 다른 말. 정답과 반만 다른 말 5건. |
| 5 | `order` | 2 | 20장 중 7장(S4·S7·S8·S10·S11·S13·S18)에서 인접 교환이 자연스럽다. `why`가 "앞 줄을 가리켜 순서가 하나"라 했지만 실제로는 안 묶이는 카드가 같은 7장. S11 4줄은 수어 통역 위치가 틀림, S16 3줄은 통역사의 역할을 넘음. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 잘 말하고 상황 안에서 일관. 문장 아이콘은 대체로 맞음. 19.3 문장 `icon: check`와 S19 order 3줄 `check`는 V18 대상은 아니지만 ✓ 판정 표시와 겹쳐 보여 바꾸기 권함. |
| 7 | context `word`·`ko`, swap `ko` | 5 | 전부 정확. swap `ko`는 정답 문장의 뜻. (`stay` ↔ `함께 있다`는 "stay with me" 장면 뜻이라 허용) |
| 8 | 파일럿 갈래 | 2 | 갈래 1(정답 아이콘이 튐)은 형태를 바꿔 재발, 갈래 2(동떨어진 오답·문법 거름)·3(order 연결어)이 남아 있음. 갈래 4(임상 순서)는 대체로 맞고 S11·S16 두 줄만. |

## 사실 오류·심각한 문제

1. **빈칸 아이콘 — 정답이 아이콘 종류로 보인다(구조 문제).** 빌드 스크립트(`build_core-language-er_v46.py` `POOL`)가 오답
   아이콘을 20개 풀(compass·gear·calendar·lock·bulb·trophy·plane·coffee·pushpin·scalpel·lab·monitor·home·hospital·siren·
   chartup·star·pencil·bell·board)에서 돌려 배정했다. 풀 밖 아이콘(me·speech·handshake2·shield·bandage·speaker·faceWorried·
   mic·redo·magnify)은 **오답에 한 번도 안 나오고 정답에만 나온다** → 그런 아이콘이 붙은 칸이 곧 정답(**33/103문장**). 또
   `faceAngry`·`stetho`·`pill`은 오답에 한 번도 안 쓰였다(blame·scold·angry·rude·fever·cough·pharmacist에 딱 맞는데도).
   → 아래 "빈칸 아이콘" 표대로 오답마다 낱말의 느낌으로 다시 배정. 풀 제한을 없애야 한다.
2. **S11 수어 통역 준비 · order 4줄** — `When they sign, please keep facing me so you can see my expressions.` 수어 통역 중에는
   환자가 **통역사의 손과 얼굴을 봐야** 한다. 미국 관행은 통역사가 말하는 사람 바로 옆(약간 뒤)에 서서 환자가 둘을 함께
   보게 하는 것. "통역사가 수어할 때도 저를 보라"는 통역을 놓치게 하는 지시다. → `When they sign, they'll stand next to me so
   you can see us both.` / `ko` "수어할 때는 제 옆에 서서 둘 다 보이게 할게요", `why`도 그에 맞게.
3. **S16 동의능력 · order 3줄** — `the interpreter will check whether it's the language.` 이해·동의 능력을 판단하는 것은
   임상의이고 통역사는 말을 옮길 뿐이다(NCIHC 윤리·실무 기준; 같은 상황 16.2 `why`도 "동의 능력은 의사가 판단"). →
   `If he can't tell it back, I'll ask the interpreter whether it's the language.` (같은 문제가 v44 문장 16.2에도 — 아래 결정 11)
4. **2.5 `why`** — "today를 붙여 오늘 방문 기준의 질문임을 분명히 해요". 약물 알레르기는 방문마다 바뀌는 정보가 아니라 평생
   이력이라 "오늘 기준"이라는 설명은 틀린 개념을 심는다. → "같은 질문을 낱말 순서만 바꿔 다시 물으면 앞선 대답이 같은지
   확인할 수 있어요. 알레르기는 평생 이력이라 today는 '지금 다시 확인한다'는 뜻으로만 써요."

## 저작자 자기 보고 4건 판정

1. **오답 아이콘 자동 배정** — 맞는 지적이고 생각보다 크다. 오답 309개 중 낱말 느낌과 맞는 것은 **14개**(after lunch→calendar,
   five to ten→siren, form→pencil, bill→board, chart→pencil 등 우연히 맞은 것), **295개(95%)가 무관**. 게다가 풀 제한 때문에 정답이
   아이콘 종류로 드러난다(위 심각 1). 정답 아이콘도 `gear`(15개)처럼 뜻 없는 것이 섞여 있다(ready·understood·always·right·all·
   sign·In here·will·explained·serious → 아래 표의 [정답 …→…]). 구체안: 아래 "빈칸 아이콘".
2. **문법으로만 걸러지는 오답** — 15문장 남음(8.3 `a louder way`도 비문에 가까움): 2.2 `fever/cough/pain to medicine`, 3.5 `Seldom tell me`, 4.1 `Blame/Warn/Scold
   you for…`(주어 없는 비문), 5.1 `Why/Where/When language…`, 6.3 `so anything is missed`, 8.4 `repeat some/half/no word`,
   9.4 `unless/because/although you prefer`, 9.5 `covered unless/except the exam`, 10.3 `go too loud/soft/wide`, 14.5 `Turn/Hold
   your head no`, 15.3 `Forget/Hide me anything`, 15.4 `help you pay his condition`, 16.4 `Never/Stop/Don't me explain`, 20.4
   `Forget/Skip/Hide me each step`, 20.5 `Ask me nobody/never`. 예로 든 세 개는 —
   `I'll leave with you`(7.5)는 **문법은 맞음**("함께 나가다")·장면상 틀림이라 좋은 오답, 유지. 같은 문장의 `pay with you`가
   연어로 걸러지는 쪽이라 교체. `Please be angry`(7.4)는 문법은 맞지만 **장면과 동떨어진 우스운 말**(파일럿 갈래 2) → 교체.
   `explain it wrong`(18.3)은 문법·의미 모두 성립하는 반대말이라 유지(아이콘만).
3. **법·규정 근거** — 맞음. 1.2 연방 재정 지원 기관의 언어 지원은 무료(Title VI, ACA §1557) ✓. 4.2 의료 통역은 자격 있는
   통역사(§1557 2024 최종 규칙: qualified interpreter, 동반 성인·미성년자 의존 제한) ✓. 11.1 ADA(및 Rehabilitation Act §504)의
   효과적 의사소통 의무 ✓ — 다만 "청각장애 환자에게는 수어 통역" 일반화는 고칠 것(수어를 안 쓰는 청각장애인도 많음; 문자
   통역 CART 등). teach-back(3.2·16.1·20.1; AHRQ) ✓. 17.2 자살 위험을 직접 묻는 것이 권장되고 묻는다고 자살 생각이 늘지 않음 ✓
   — 다만 `hurting yourself`는 자해와 자살을 구분하지 못하니 `why`에 이어서 "killing yourself"를 직접 묻는다는 말을 더할 것.
   과장: 4.4 "예외 없는 방침"(§1557은 응급·환자 본인의 명시적 요청 시 동반 성인 허용). 14.1 번역 앱은 임시 수단 ✓(§1557은
   중요한 내용의 기계 번역을 자격 있는 사람이 검토하도록 함).
4. **order 인접 교환** — 스크립트로 60가지 전부 출력해 판정. 확실히 바꿔도 되는 것 9가지(7장): S4 3↔4, S7 2↔3, S8 1↔2,
   S10 1↔2·2↔3, S11 2↔3, S13 2↔3, S18 1↔2·2↔3. 경계선(읽기에 따라 됨): S5 3↔4, S6 3↔4, S8 3↔4, S9 2↔3, S14 1↔2, S15 3↔4,
   S18 3↔4, S19 2↔3. 나머지 11장(S1·S2·S3·S12·S16·S17·S20 등)은 잠김. 구체안: 아래 "order".

## 고칠 것 (v46 필드)

### 빈칸 (blank) — 선택지
아이콘은 `이름`으로 함께 적음(넷이 서로 다르고 정답 ≠ 문장 `icon`, `check`·`cross` 없음 확인).

문법으로 걸러짐 —
- 2.2 · `fever/cough/pain to medicine`은 `allergy to`만 되는 연어 → `objection`(faceAngry)·`access`(lock)·`exposure`(siren). 정답 `allergy`(shield) 유지.
- 3.5 · `Seldom tell me` 비문, `Please`는 가르치는 말도 아님 → 빈칸을 `understand`로: `understand`(bulb)·`sign`(pencil)·`pay`(board)·`own`(home).
- 4.1 · `Blame/Warn/Scold you for…`는 주어 없는 비문 → 빈칸을 `wanting`으로: `wanting`(star)·`refusing`(faceAngry)·`forgetting`(faceWorried)·`pretending`(lock).
- 5.1 · `Why/Where/When language` 비문 → 빈칸을 `language`(가르치는 말)로: `language`(mic)·`medicine`(pill)·`room`(home)·`form`(board).
- 6.3 · `so anything is missed` 비문 → `anything`을 `much`(chartup)로. 나머지 `something`(magnify)·`everything`(star), 정답 `nothing`(shield).
- 8.4 · `some/half/no word` 비문 → `one`(pushpin)·`the last`(calendar)·`that`(magnify). 정답 `every`(star).
- 9.4 · `unless/because/although you prefer`는 목적어 없는 미완 → 빈칸을 `prefer`로: `prefer`(handshake2)·`complain`(faceAngry)·`leave`(plane)·`pay`(board).
- 9.5 · `covered unless/except the exam` 비문 → `during`(shield)·`before`(calendar)·`after`(redo)·`until`(pushpin) (`before`는 distractorsKo "진찰 전에만"과 맞물려 좋은 오답).
- 10.3 · `go too loud/soft/wide`는 연어로 걸러짐 → `slow`(calendar)·`far`(plane)·`early`(play). 정답 `fast`(chartup).
- 14.5 · `Turn/Hold your head no` 비문 → `Bow`(handshake2)·`Tilt`(compass). `Nod`(me) 유지, 정답 `Shake`(redo). (머리 동작끼리 비교되게)
- 15.3 · `Forget/Hide me anything` 비문 → `bring`(handshake2)·`send`(plane)·`sell`(board). 정답 `ask`(speech).
- 15.4 · `help you pay his condition` 비문 → `pay`를 `change`(redo)로(distractorsKo "상태를 바꿔 줄 거예요"와 맞물림). `ignore`(lock)·`hide`(magnify), 정답 `understand`(bulb).
- 16.4 · `Never/Stop/Don't me explain` 비문 → 빈칸을 `again`으로: `again`(redo)·`later`(calendar)·`faster`(chartup)·`louder`(speaker)(장벽은 청력이 아니라 언어).
- 20.4 · `Forget/Skip/Hide me each step` 비문 → 빈칸을 `your`로: `your`(me)·`my`(speech)·`the doctor's`(stetho)·`his`(home) — "의사 말 그대로가 아니라 환자 말로"가 teach-back의 핵심.
- 20.5 · `Ask me nobody/never` 비문 → 빈칸을 `wrong`(가르치는 말)으로: `wrong`(faceWorried)·`easy`(coffee)·`second`(redo)·`extra`(chartup).
- 8.3 · `ask again a louder way` 비문에 가까움 → `louder`를 `faster`(chartup)로. `harder`(faceWorried)·`longer`(calendar), 정답 `different`(bulb).

정답이 둘 될 수 있음 —
- 3.4 · `explain each step until we start`는 성립하고 `although/unless`는 비문 → 빈칸을 `step`으로: `step`(play)·`result`(lab)·`bill`(pencil)·`meal`(coffee).
- 10.4 · `I'll draw it first / again`도 장면상 맞음 → 빈칸을 `draw`로: `draw`(pencil)·`skip`(plane)·`erase`(lock)·`sign`(board).
- 12.3 · `you're smiling — is it worse than you're saying?`는 통증을 참는 문화 장면에서 오히려 맞는 말 → `smiling`→`relaxing`(star), `laughing`→`resting`(home), `sleeping`(coffee) 유지, 정답 `tensing`(faceWorried).
- 13.1 · `Left or right?`(흉통 좌우)·`Hot or cold?`(작열감)는 흉통 문진으로 성립하고 선택지가 3.3과 똑같음 → 빈칸을 `Point`로: `Point`(pushpin)·`Sign`(pencil)·`Wait`(coffee)·`Sit`(home).
- 13.4 · `Is the heat in your chest?`(가슴 열감)는 성립, `fever/chill in your chest`는 연어로 걸러짐 → `bleeding`(bandage)·`itch`(faceWorried)·`swelling`(chartup). 정답 `pain`(me).
- 13.5 · `Squeeze my hand twice if you disagree/refuse`도 유효한 손 신호 약속 → `cough`(stetho)·`itch`(faceWorried). `forget`(redo) 유지, 정답 `understand`(bulb).
- 19.5 · `ko`에 횟수가 없어("거부하신 적이 있으니") `twice/often`도 맞고 `declined care never`는 비문 → 빈칸을 `understanding`으로: `understanding`(bulb)·`insurance`(board)·`address`(home)·`diet`(coffee).
- 2.5 · `today`의 오답 `yesterday/tomorrow/last year`가 정답만큼 어색하거나 덜하지 않음(알레르기에 날짜) → 빈칸을 `allergy`로: `allergy`(shield)·`refill`(redo)·`bill`(board)·`delivery`(plane).

(이 목록의 교체 선택지는 모두 문장에 넣어 다시 읽고, 장면상 맞는 말이 되지 않는지·관사·문법을 확인했다.)

대명사 빈칸 — 문법은 맞지만 가르치는 말이 아니고 아이콘으로 느낌을 줄 수 없음:
- 5.2 · `for you/them/me/us` → `listen`: `listen`(speaker)·`type`(pencil)·`draw`(board)·`count`(chartup) (`write`는 문해 질문으로 성립하고 decoy `or to write`와 겹쳐 피함).
- 5.5 · `to you/me/us/them` → `comfortable`: `comfortable`(home)·`difficult`(faceWorried)·`foreign`(plane)·`formal`(board).
- 6.1 · `to you/him/her/them` → `speaking`: `speaking`(mic)·`pointing`(pushpin)·`waving`(handshake2)·`walking`(plane).
- 12.2 · `for me/them/him/her` → `strong`: `strong`(shield)·`loud`(speaker)·`dressed`(me)·`early`(calendar).

장면과 동떨어진 우스운 말(파일럿 갈래 2) —
- 7.3 · `doing terrible/wrong/awful`(간호사가 할 리 없는 막말, `doing wrong`은 비문에 가까움) → 빈칸을 `time`으로: `time`(calendar)·`coat`(home)·`turn`(redo)·`temperature`(stetho).
- 7.4 · `Please be angry/rude/upset` → `quick`(chartup)·`ready`(play)·`brief`(pushpin). 정답 `patient`(coffee).
- 7.5 · `pay with you` 연어 어색 → `check`(magnify). `argue`(faceAngry)·`leave`(plane) 유지, 정답 `wait`(coffee).
- 6.5 · `drink/sleep/eat` → `read`(board)·`sign`(pencil)·`type`(monitor). 정답 `speak`(mic).
- 14.4 · `shout/jump/cry` → `sign`(pencil)·`call`(bell)·`leave`(plane). 정답 `nod`(me).
- 17.4 · `forget/hide/cancel if you want…` → `guess`(bulb)·`decide`(pushpin)·`judge`(scalpel)(통역사의 역할이 아닌 일). 정답 `ask`(speech).

### 빈칸 아이콘 — 위에서 선택지를 바꾸지 않은 문장 (오답 `현재→제안`, [정답 현재→제안])
정답 아이콘이 `gear`처럼 뜻 없는 것과, 오답 아이콘 전부. 위 "선택지" 목록에 든 문장은 거기 적은 아이콘을 쓴다.
- 1.1 a pharmacist compass→pill; a phlebotomist gear→lab; a radiologist calendar→monitor
- 1.2 extra coffee→chartup; costly trophy→board; expensive plane→trophy
- 1.3 badge monitor→pushpin; wristband home→bandage; chart lab→board
- 1.4 [정답 gear→play] unable chartup→lock; unwilling star→faceAngry; reluctant pencil→faceWorried
- 1.5 tomorrow morning compass→coffee; next week gear→play (after lunch calendar 유지)
- 2.1 Chills trophy→stetho; Fever lock→siren; Cough bulb→speaker
- 2.3 [정답 pencil→me] one to five hospital→chartup; ten to twenty star→trophy (five to ten siren 유지)
- 2.4 elbow bell→bandage; knee board→pushpin; foot compass→stetho
- 3.1 send coffee→plane; take pushpin→handshake2; give plane→pill
- 3.2 [정답 gear→bulb] forgot monitor→faceWorried; signed home→pencil; paid hospital→board
- 3.3 Up or down star→chartup; Hot or cold pencil→siren; Left or right board→compass
- 4.2 cheap siren→pushpin; casual chartup→coffee; quick star→chartup
- 4.3 tires gear→coffee; scares board→faceWorried; blames compass→faceAngry
- 4.4 [정답 gear→redo] rarely trophy→calendar; seldom plane→pushpin; never bulb→lock
- 4.5 [정답 bell→mic] interrupt scalpel→siren; leave lab→plane; rest monitor→coffee
- 5.3 sell lock→board; refuse bulb→faceAngry; lose calendar→magnify
- 5.4 [정답 compass→home] old coffee→calendar; next pushpin→play; last scalpel→redo
- 5.6 [정답 compass→board] lose gear→magnify; forget bell→faceWorried; cancel board→lock
- 6.2 hang up gear→speaker; argue calendar→faceAngry; leave compass→plane
- 6.4 long lab→chartup; loud monitor→speaker; soft home→coffee
- 7.1 [정답 gear→star] old board→calendar; cheap calendar→pushpin; wrong bell→faceWorried
- 7.2 [정답 coffee→magnify] lose lock→faceWorried; pay bulb→board; thank trophy→handshake2
- 7.6 forgets lock→faceWorried; fears bulb→siren; sells trophy→board
- 7.7 wrong pushpin→faceWorried; late scalpel→calendar; small lab→pushpin
- 8.1 [정답 gear→star] none calendar→lock; half lock→pushpin; most bulb→chartup
- 8.2 shorten coffee→pencil; hide pushpin→lock (skip plane 유지)
- 8.5 loud gear→speaker; rude lock→faceAngry (late calendar 유지)
- 9.1 avoid bulb→lock; refuse trophy→faceAngry; fear plane→faceWorried
- 9.2 naked monitor→faceWorried; exposed scalpel→siren; uncovered lab→lock
- 9.3 safe chartup→shield; comfortable siren→coffee (happy star 유지)
- 10.1 drag scalpel→plane; rush coffee→siren; hurry pushpin→chartup
- 10.2 [정답 bulb→board] hide hospital→lock; hang siren→pushpin; erase home→pencil
- 10.5 Kill lab→scalpel; Waste pushpin→redo; Lose scalpel→magnify
- 11.1 refusing monitor→faceAngry; charging home→board; canceling lab→lock
- 11.2 Ignore chartup→lock; Leave star→plane; Avoid pencil→faceAngry
- 11.3 never compass→lock; hardly gear→faceWorried (rarely calendar 유지)
- 11.4 [정답 gear→handshake2] cancel coffee→lock; delete trophy→redo; forget plane→faceWorried
- 11.5 slower monitor→calendar; worse home→chartup; harder lab→faceWorried
- 12.1 [정답 gear→hospital] Outside hospital→plane; At home siren→home; Out there chartup→compass
- 12.4 wrong scalpel→faceWorried; bad lab→faceAngry; rude pushpin→speaker
- 12.5 doubt hospital→magnify; hope siren→star; forget chartup→faceWorried
- 13.2 Wash lock→bandage; Release gear→handshake2; Drop calendar→redo
- 13.3 canceled coffee→lock; lost pushpin→compass (leaving plane 유지)
- 14.1 [정답 pencil→board] pay gear→chartup; erase board→pencil; hide compass→lock
- 14.2 [정답 gear→me] roll trophy→redo; bow plane→handshake2; wave bulb→play
- 14.3 alone scalpel→faceWorried; lost lab→compass; late monitor→calendar
- 15.1 [정답 gear→play] didn't bulb→redo; won't calendar→faceAngry (can't lock 유지)
- 15.2 stable coffee→shield; good pushpin→star; mild scalpel→coffee
- 15.5 happy lock→star; proud bulb→trophy; glad calendar→play (happy·glad가 거의 같은 말이라 glad를 `lucky`로 바꿔도 좋음)
- 16.1 [정답 gear→bulb] forgot trophy→faceWorried; lost plane→compass; broke coffee→scalpel
- 16.2 barely lab→faceWorried; hardly monitor→lock; rarely home→calendar
- 16.3 forget pencil→faceWorried; avoid chartup→lock; ignore star→faceAngry
- 16.5 rarely trophy→calendar; loudly plane→speaker; blindly coffee→lock
- 17.1 [정답 gear→siren] funny pushpin→star; silly scalpel→trophy; easy lab→coffee
- 17.2 dressing chartup→me; helping hospital→handshake2; feeding siren→coffee
- 17.3 late board→calendar; hungry compass→coffee; lost bell→compass
- 17.5 alone pushpin→faceWorried; lost scalpel→compass; late lab→calendar
- 18.1 deny hospital→faceAngry; ignore monitor→lock; dismiss home→plane
- 18.2 wrap pencil→bandage; mix bell→redo; cover star→lock
- 18.3 [정답 gear→star] wrong calendar→faceWorried; backward lock→redo; loudly bulb→speaker
- 18.4 alone plane→faceWorried; later coffee→calendar; tomorrow pushpin→play
- 18.5 must hospital→lock; will monitor→play; can home→chartup
- 19.1 declines chartup→faceAngry; hates star→siren; refuses siren→lock
- 19.2 [정답 pencil→lock] accepted board→handshake2; requested compass→bell; received gear→home
- 19.3 Never bulb→lock; Rarely trophy→calendar; Seldom plane→redo
- 19.4 doubt home→magnify; deny scalpel→faceAngry; forget lab→faceWorried
- 20.1 chart bell→monitor (form pencil·bill board 유지)
- 20.2 quickly lock→chartup; rarely bulb→redo; badly trophy→faceWorried
- 20.3 few scalpel→pushpin; some coffee→chartup; many pushpin→trophy

### decoy
- 3.2 · `again slowly` → "Please tell me again slowly what you understood."가 `ko`(이해하신 내용을 다시 말씀해 주세요)에 그대로 맞음 → `if you signed`.
- 4.1 · `for coming` → "Thank you for coming to help translate."가 `ko`(도와주려는 마음, 감사해요)와 거의 같음 → `for leaving`.
- 5.1 · `for your visit` → "What language would you like for your visit?"가 `ko`(어떤 언어를 사용해 드릴까요?)에 맞음 → `us to avoid`.
- 5.5 · `at home` → "Tell me which language feels most at home."(feel at home = 편하다)이 `ko`에 맞음 → `comfortable to them`.
- 11.4 · `for you` → "The interpreter will sign for you."가 `ko`(수어로 전달해 드릴 거예요)와 가까움(게다가 sign=서명으로도 읽힘) → `the consent form` (통역사는 동의서에 서명하지 않음 — 역할 대비).
- 12.2 · `to stay quiet` → "You don't need to stay quiet for me."가 `ko`(강한 척하지 않으셔도)와 뜻이 가까움 → `to be here`.
- 15.1 · `to tell the doctor` → "…help me to tell the doctor something serious."가 받는 사람이 없는 `ko`에 맞음 → `ask you`.

### distractorsKo
- 2.2 · `음식 알레르기가 있나요?` — 정답(약물 알레르기 있나요?)과 반만 다름 → `지금 약을 드릴게요`.
- 4.5 · `도와주셔서 감사해요, 이제 쉬세요` — 앞 절이 정답과 같음 → `가족분이 대신 통역해 주세요`.
- 13.5 · `한 번 쥐면 이해한 거예요` — 정답(두 번 쥐면 이해)과 숫자만 다름 → `아프면 손을 들어 주세요`.
- 14.5 · `숨을 못 쉬시면 손을 드세요` — 조건이 같고 동작만 다름 → `가슴이 아프면 가리켜 주세요`.
- 18.5 · `걱정은 이해해요, 곧 설득할게요` — 앞 절이 정답과 같음 → `오늘 꼭 치료를 받으셔야 해요`.

### order (줄 `en`·`ko`와 `why`의 "가리키는 말" 설명을 함께 고칠 것)
- S4 · 3↔4 자연스러움("…stay with her? That way, … you can just be family.") → 3 `That way, everything stays accurate, and the medical words aren't on you.` (ko "그러면 정확하고, 의학 용어는 가족분이 맡지 않으셔도 돼요") / 4 `With those words off your plate, would you stay with her as family?` (ko "그 말들은 맡기시고, 가족으로 곁에 계시겠어요?")
- S7 · 2↔3 자연스러움(`While we wait`는 1줄 뒤에도 됨) → 3 `While you wait those extra minutes, please rest.`(← 2줄 "a little longer") (ko "늘어난 몇 분 동안 편히 쉬세요").
- S8 · 1↔2 자연스러움("That felt short … You said a lot …") → 2 `For so much, that felt short — can the interpreter repeat it in full?`(so much ← 1줄 "a lot"; 첫 줄로 오면 가리킬 것이 없음) (ko "그렇게 많이 하신 말씀치고 짧았는데, 전부 다시 말해 줄 수 있나요?").
- S10 · 1↔2·2↔3 모두 자연스러움 → 1 `First, I'll explain this out loud, so you won't need to read anything.` (ko "먼저 소리 내어 설명할 테니 읽으실 필요 없어요") / 2 `As I explain, I'll go step by step and draw each step.` (ko "설명하면서 한 단계씩, 단계마다 그림을 그릴게요") / 3 `While I draw, tell me if I go too fast.` (ko "그리는 동안 제가 너무 빠르면 말씀해 주세요")
- S11 · 2↔3 자연스러움 → 3 `Once they're here, they'll sign everything I say, so we can stop writing.` (ko "통역사가 오면 제 말을 전부 수어로 옮기니 그때는 그만 써도 돼요") / 4는 위 "심각 2"대로 `When they sign, they'll stand next to me so you can see us both.`
- S13 · 2↔3 자연스러움(`Good, I understand`가 1줄 가리키기에 대한 답으로도 읽힘) → 3 `Good, I felt that squeeze. The interpreter is coming, so stay with me.` (ko "네, 꽉 쥐신 거 느꼈어요. 통역사가 오고 있으니 곁에 계세요")
- S16 · 3줄 역할 → `If he can't tell it back, I'll ask the interpreter whether it's the language.` (ko "다시 말하지 못하면 언어 때문인지 통역사에게 물어볼게요")
- S18 · 1↔2·2↔3 자연스러움(2줄이 1줄을 안 가리키고, 3줄 `it`은 치료로도 읽힘) → 2 `Maybe there's a misunderstanding behind that concern that I can clear up.` (ko "그 걱정 뒤에 제가 풀어드릴 오해가 있을지도 몰라요") / 3 `As I clear it up, the interpreter will make sure I explain it right.` (ko "오해를 푸는 동안 통역사가 제 설명이 정확한지 도와줄 거예요")
- S19 · 2↔3 경계선 → 3 `With that video interpreter, confirm his understanding each time, since he declined care once.` (ko "그 화상 통역사와 함께 매번 이해를 확인하세요, 한 번 거부하셨거든요") / 3줄 아이콘 `check`→`magnify`.
- (보고만) S5 3↔4, S6 3↔4, S8 3↔4, S9 2↔3, S14 1↔2, S15 3↔4는 읽기에 따라 됨 — 위 수정 뒤 다시 돌려 볼 것.

### why
- 2.5 · 위 "심각 4".
- 4.4 · "always로 예외 없는 병원의 방침" — 과장(§1557은 응급·환자 본인 요청 시 동반 성인 허용) → "always로 개인 판단이 아니라 병원 방침이라는 것을 알려요. 방침이라고 말하면 가족이 덜 서운해해요."
- 6.4 · "so는 이유를 이끌어" — 여기 so(that)는 **목적** → "so the interpreter can follow는 목적을 덧붙여, 문장을 짧게 해 달라는 부탁이 통역을 위한 것임을 알려요."
- 11.1 · "청각장애 환자에게는 수어 통역을 제공해야 해요" — 일반화 → "수어를 쓰는 환자에게는 자격 있는 수어 통역사를 불러요. ADA는 병원에 효과적인 의사소통 수단(수어 통역·문자 통역 등)을 요구해요."
- 17.2 · 사실은 맞음. 덧붙임 → "…늘어나지 않는다고 알려져 있어요. hurting yourself만으로는 자해와 자살이 구분되지 않아 이어서 killing yourself를 직접 물어요."
- 17.3 · "keep you safe는 감시가 아니라 보호" — 자살 위험 환자는 실제로 관찰(1:1 sitter 등)을 받으니 오해 소지 → "keep you safe는 곁에서 지켜보는 것도 벌이 아니라 보호를 위한 것이라는 뜻이에요."
- order `why` — S4·S7·S8·S10·S11·S13·S18은 현재 "…이 앞 줄을 가리켜 순서가 하나예요"가 사실과 다름. 위 줄 수정 뒤 가리키는 말을 새로 적을 것.

### tag·icon
- 19.3 문장 `icon: check` → `redo`(매번 확인) 또는 `magnify`. 낱장이 결과를 ✓/✕로 그려 판정 표시와 헷갈림.

## 결정 11 보고 (v44 문장 — 이번 보강 범위 밖, 판단 요청)
- 2.5 `Any medicine allergy today? Yes or no?` — 알레르기에 today가 부자연스럽고 2.2와 사실상 같은 문장. `Any allergies to medicine? Yes or no?`로 바꾸거나 한 문장을 다른 핵심 질문으로.
- 7.6 `The interpreter is looking for someone who speaks your dialect.` — 통역사가 통역사를 찾는 꼴. `The interpreter service is looking for…`가 맞음.
- 16.2 `The interpreter will check if he truly understands.` — 통역사의 역할을 넘음(위 심각 3과 같음). `We'll check with the interpreter if he truly understands.`
- 8.4 `Please ask the interpreter to repeat every word.` — 3자 대화에서는 간호사가 통역사에게 직접 말하는 게 원칙이라 누구에게 하는 말인지 어색.
- 청크 경계: 11.1 `a sign language / interpreter now`, 16.3 `his next / of kin`, 18.2 `I can clear / up`, 13.1 `. Yes or no`(구두점이 청크 머리). keyPhrase 아님.
- 빈칸 정답이 그 문장의 `words`가 아닌 문장이 많음(What·Please·Let·Tell·before·if·during·for you 등). 위에서 빈칸을 옮긴 것으로 대부분 해소.

## 종합
고칠 것 v46 필드 131건(빈칸 선택지 34문장 · 빈칸 아이콘 69문장 · decoy 7 · distractorsKo 5 · order 9장 · why 6 · tag/icon 1).
사실 오류는 위 넷(아이콘 구조 누설, S11 수어 통역 위치, S16 통역사 역할, 2.5 why)이고 법 근거는 맞다. 빈칸 아이콘을 풀 제한
없이 다시 배정하고 문법 거름 오답·order 7장을 고친 뒤 V18·V19와 인접 교환 스크립트를 다시 돌리면 내보내도 된다.
