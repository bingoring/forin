# fix-icu-airway-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번)

대상: `icu-airway.yaml`(A·B 합친 파일, 단어 337 · 상황 21 · 문장 126). 비교: base·changes·in·notes A/B.
뉘앙스 종류: slider·pair·context만 있음. **swap 없음 · reel 없음** — 확인했고 검토할 것이 없음(swap `ko` 검토 대상 없음).
context 21개는 모두 핸드오프 모양(`word`·`ko`·장면 3·`ok:false` 1·`word`가 세 장면 `en`에 다 있음)을 스크립트로 확인함.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 소리·철자가 닮은 오답은 좋지만 품사가 다른 오답이 약 70개, `crises`(정답의 복수형), `face-mask`(같은 뜻으로 통하는 말) |
| 2 distractorsKo·길이 | 4 | 길이 규칙 위반 0. `Peri-intubation`의 오답 '삽관 직전의/직후의'는 정답 뜻의 일부 |
| 3 cue | 4 | `epinephrine` 단서에 다른 이름 '아드레날린'이 들어감, `reoxygenate` 단서 "숨이 끊긴"(죽었다는 뜻), `overinflate` "터질 만큼" |
| 4 chips/decoyChips | 3 | 죽음·속옷·폭력을 떠올리는 조각(`die`×4·`tomb`·`bra`)이 응급 단어에 섞임 |
| 5 뉘앙스 사실 | 3 | CICO 슬라이더가 성문상 기도기 단계를 건너뜀, 기관절개관 교체 중 저산소에 "멈추고 산소", 발성밸브 호흡곤란에 커프 확인이 빠짐 |
| 6 뉘앙스 설계 | 4 | pair 1곳의 decoy가 붙음("clear the call light"), context에서 "의사에게 보고" 장면이 의사에게 내리는 명령인 곳 7곳, 뜻이 다른 `first` |
| 7 결정 11 | 4 | 변경 목록은 타당함. `surgery`의 ko '수술'이 "call surgery"(외과) 세 문장과 안 맞음, `drug` '약물(명)', 품사가 '일반 동사'가 아닌 단어에 그 태그 |

## 사실 오류·심각한 문제

1. **[안전] 10.4** `I'll hold pressure at the stoma while you remove the old tube.` / ko "스토마를 눌러 지혈할게요" — 기관절개관 교체에서 스토마를 누르는 단계는 없습니다. 새 관을 바로 넣으려면 스토마가 열려 있어야 하고, '지혈'은 출혈이 없는 장면에 없는 처치를 덧붙입니다.
2. **[안전] 17.5** `The new trach goes in easily once we're lined up right.` — 같은 상황 keyPhrase 17.2가 "새 스토마는 다시 넣기 어렵다"고 합니다. 이 문장은 지킬 수 없는 약속이고 서로 모순됩니다.
3. **[안전] 15.4** `I'm marking the cricothyroid membrane now.` — 윤상갑상막을 찾아 표시하는 것은 시술자(의사)의 일입니다. 간호사가 하면 업무범위 밖입니다.
4. **[안전] 16.4** `Push atropine if the bradycardia doesn't improve with oxygen.` — 아트로핀 투여를 간호사가 조건을 붙여 지시하는 말입니다. 투약 결정은 의사(코드 리더)의 판단입니다.
5. **[안전] 8.3** `I'll give a fluid bolus if his volume looks low.` — 간호사가 용적 상태를 혼자 판단해 볼루스를 주는 말입니다. 처방이 있어야 합니다.
6. **[안전] 상황 15 slider** — 단서가 "Two attempts failed, the bag-mask isn't working"인데 바로 CICO·윤상갑상막절개로 넘어갑니다. DAS·ASA 어려운 기도 알고리즘은 **성문상 기도기(SGA)로 구조하다 실패한 뒤**에 CICO를 선언합니다. 단서와 `why` 모두 이 단계를 빠뜨렸습니다.
7. **[안전] 상황 10 slider** — 교체 중 SpO₂ 86에 정답이 "pause and give oxygen"이고 `why`가 "멈춰서 산소를 먼저"입니다. 옛 관을 이미 뺀 뒤라면 멈출 수가 없습니다. 실제로는 산소를 얼굴과 스토마로 주고, 새 관을 넣었으면 가짜 길(false passage)을 의심해 EtCO₂로 위치를 확인해야 합니다.
8. **[안전] 상황 12 slider `why`** — 발성밸브를 단 뒤의 호흡곤란에 "밸브를 바로 빼요"까지만 씁니다. 가장 위험한 원인인 **커프가 부풀어 있는 채 밸브를 단 경우**를 확인하라는 말이 없습니다.
9. **[안전] `w-overinflate` cue** "터질 만큼 부풀리는 일" — 무명동맥 출혈에서 커프 과팽창은 출혈이 멎을 때까지 공기를 더 넣는 것이지 터뜨리는 것이 아닙니다. 그대로 믿으면 위험합니다.
10. keyPhrase **16.2** `If the heart rate stays low, we start the arrest algorithm.` — 사실 오류입니다(아래 keyPhrase 절). 같은 상황 slider `why`("맥박이 없으면 심정지 알고리즘")와도 모순됩니다.

## 고칠 것

[안전]을 붙인 것이 안전 항목입니다. 문장을 새로 쓰면 **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo·blank)를 전부 새로 쓰고**, 바뀐 `words`는 `changes-icu-airway.yaml`에 적으세요. 그 문장이 어떤 은행 단어의 `example`·`exKo`이면 그것도 새 문장으로 바꿉니다.

### A. 문장 (keyPhrase 아님)

1. **[안전] 상황 "기관절개관 교체 보조" 10.4** — 교체 중 스토마 압박·지혈(사실 오류).
   - en: `I'll hold his head steady while you remove the old tube.`
   - ko: `기존 튜브를 빼는 동안 머리가 움직이지 않게 잡고 있을게요.`
   - chunks: `I'll hold / his head steady / while you remove / the old tube / .`
   - words: `[w-hold, w-remove, w-old, w-tube]` (w-pressure·w-stoma 태그 뺌 — 둘 다 다른 문장에 남음)
   - v46 필드 전부 새로(blank 예: `steady` / `still`·`upright`은 정답이 될 수 있어 피하고 `loose`·`flat`·`wet`처럼 같은 분야에서 틀린 말).
   - **딸린 것:** `w-hold`의 example·exKo가 이 문장이므로 새 문장으로. `w-hold` ko '누르다'→`잡고 있다`(17.4 "holding oxygen at his mouth"에도 맞음), cue→"손으로 붙잡아 움직이지 않게 받쳐 두는 동사", distractorsKo `[떼다, 문지르다]`→`[놓아 주다, 문지르다]`, distractorsEn `[hood, hall]`→`[fold, howl]`(동사). changes에 `w-hold` ko·example 적기.
2. **[안전] 상황 "기관절개관 우발적 탈관" 17.5** — 지킬 수 없는 약속, 17.2와 모순.
   - en: `The new trach goes in more easily once we're lined up right.`
   - ko: `방향이 제대로 맞춰지면 새 기관절개관이 더 쉽게 들어가요.`
   - chunks: `The new trach / goes in more easily / once we're / lined up right / .`
   - words 그대로. v46 필드 전부 새로(distractorsKo 둘을 새 ko 틀에 맞춰). `w-easily` example이 이 문장이면 함께.
3. **[안전] 상황 "삽관·환기 불가 CICO 위기" 15.4** — 윤상갑상막 표시는 시술자의 일.
   - en: `The scalpel is ready as soon as you mark the cricothyroid membrane.`
   - ko: `윤상갑상막 위치를 표시하시면 바로 쓸 수 있게 메스가 준비돼 있어요.`
   - chunks: `The scalpel is ready / as soon as / you mark / the cricothyroid membrane / .`
   - words: `[w-ready, w-mark, w-cricothyroid, w-membrane]`. v46 필드 전부 새로. `w-mark`·`w-cricothyroid`·`w-membrane` example이 이 문장이면 함께.
4. **[안전] 상황 "삽관 중 저산소·서맥 급변" 16.4** — 간호사의 투약 지시.
   - en: `Should I push atropine if the bradycardia doesn't improve with oxygen?`
   - ko: `산소를 줘도 서맥이 호전되지 않으면 아트로핀을 주입할까요?`
   - chunks: `Should I push atropine / if the bradycardia / doesn't improve / with oxygen / ?`
   - words 그대로. v46 필드 전부 새로(지금 distractorsKo "준비해 둬요"·"병을 가져와요"는 명령형이라 의문형 틀로 다시).
5. **[안전] 상황 "삽관 전후 혈역학 붕괴 대비" 8.3** — 간호사가 혼자 판단해 볼루스를 줌.
   - en: `I'll have a fluid bolus ready to give if you order one.`
   - ko: `처방하시면 바로 줄 수 있게 수액 볼루스를 준비해 둘게요.`
   - chunks: `I'll have / a fluid bolus / ready to give / if you order one / .`
   - words: `[w-fluid, w-bolus, w-ready, w-give, w-order]` (w-volume·w-look은 다른 문장에 남음). `w-order`(처방하다)의 cue와 맞고, keyPhrase 3.2를 바꾸면 w-order가 쓰일 곳이 됩니다. v46 필드 전부 새로.
6. 상황 "기관절개관 교체 보조" 10.3 — `so I'll go slowly`는 첫 교체(보통 외과·이비인후과 의사가 함)를 간호사가 하는 것으로 읽힙니다(업무범위).
   - en: `This is his first change, so we'll go slowly and I'll explain each step to him.`
   - ko: `첫 교체라서 천천히 진행하고, 단계마다 환자에게 설명해 드릴게요.`
   - chunks: `This is / his first change, / so we'll go slowly / and I'll explain / each step to him / .`
   - words 그대로. v46 필드 전부 새로.
7. 상황 "특수 튜브 관리" 11.5 — 이중내강관 한쪽을 잠그는 것은 마취과·RT의 일(업무범위).
   - en: `I'll listen to each lung separately while you clamp one side.`
   - ko: `한쪽을 잠가 주시면 양쪽 폐를 따로따로 들어 볼게요.`
   - chunks: `I'll listen / to each lung / separately / while you clamp / one side / .`
   - words: `[w-lung, w-separately, w-clamp, w-side]` (w-check·w-sound는 다른 문장에 남음). v46 필드 전부 새로.
8. 상황 "특수 튜브 관리" 11.3 — `during surgery`가 장면(ICU BED 2)과 안 맞습니다. ICU의 이중내강관은 폐 격리용입니다.
   - en: `He needs this tube for one-lung ventilation to protect the good lung.`
   - ko: `건강한 쪽 폐를 보호하려고 한쪽 폐 환기가 필요해서 이 튜브를 써요.`
   - chunks: `He needs / this tube / for one-lung ventilation / to protect the good lung / .`
   - words: `[w-need, w-tube, w-ventilation, w-lung]` (w-surgery는 15.1·18.1·18.3에 남음). v46 필드 전부 새로.
9. 상황 "기관절개관 우발적 탈관" 17.3 (저작자 메모 A) — 듣는 사람이 모호하고, 숨을 못 쉬는 응급에 "환자 잘못이 아니다"는 어색합니다. 환자에게 하는 말로.
   - en: `Try to stay calm — I know you're scared and confused, and we're right here.`
   - ko: `진정하세요 — 무섭고 혼란스러우신 거 알아요. 저희가 바로 곁에 있어요.`
   - chunks: `Try to stay calm / — I know / you're scared and confused, / and we're right here / .`
   - words: `[w-stay, w-calm, w-scared, w-confused]`. `w-fault`는 어느 문장도 태그하지 않게 되니 은행에서 지움(word-remove). v46 필드 전부 새로(tag '침착 유지'→'환자 안심' 등).
10. chunks 구 경계(문장은 그대로, chunks만 다시):
    - 4.3 `I let him / know /` → `I let him know / it's suction time / before I start / .` ("let him know"를 끊음)
    - 12.3 `to talk now / that the cuff is down` → `I tell him / he can try to talk / now that / the cuff is down / .` ("now that" 접속사를 끊음)
    - 17.4 `while we get / set up` → `I'm holding / oxygen at his mouth / while we / get set up / .`
    - 18.4 `I'll keep firm pressure / on /` → `I'll keep firm pressure on / while you set up / the airway cart / .`
    - 5.4 `There's some / drainage, /` → `There's some drainage, / but the wound edges / look clean / .`
    - chunks를 바꾼 문장은 `decoy`가 새 청크와 같지 않은지 다시 봅니다.

### B. 뉘앙스

11. **[안전] 상황 15 slider** — 단서: `Doctor: "Two intubation attempts and the supraglottic airway failed, bag-mask isn't working, and his sat is 70."` `why` 첫 문장을 "삽관도, 성문상 기도기도, 백마스크도 실패해 산소화가 안 되면…"으로. 척도는 그대로.
12. **[안전] 상황 10 slider** — 선택지 `pause and give oxygen`→`give oxygen to face and stoma`. `why`: "교체 중 포화도가 떨어지면 밀어붙이지 말고 산소부터 줘요(관이 빠져 있으면 얼굴과 스토마로). 새 관을 넣은 뒤라면 가짜 길로 들어갔을 수 있으니 EtCO₂로 위치를 확인해요. 커프를 내리는 것은 해결책이 아니에요." `ex`·`exKo`도 맞춰서.
13. **[안전] 상황 12 slider `why`** — 끝에 "밸브를 뺀 뒤 커프가 완전히 빠져 있었는지 다시 확인해요 — 커프가 부푼 채 밸브를 달면 숨을 내쉴 길이 없어요."를 덧붙임.
14. 상황 11 slider·context — ICU 장면과 안 맞음.
    - slider 척도 `go ahead to surgery`→`keep ventilating as planned`, `ex` `Placement is confirmed, so we keep ventilating as planned.` / `위치가 확인됐으니 계획대로 환기를 이어 가요.`, `why`의 "수술 준비를"→"계획대로 환기를".
    - context 장면 2 `Can you listen to each lung while I clamp?`(간호사가 잠금)→`Can you listen to each lung while the doctor clamps?`.
    - context 장면 3(환자에게, 수술 설명): 삽관된 ICU 환자에게 하는 수술 예고라 장면이 안 맞습니다. `who: 가족에게`, en `We are using one-lung ventilation to isolate the affected lung.`, fix `A special tube lets each lung get air separately, so the healthy lung stays protected.`, why도 맞춤.
15. 상황 10 context(`first`) — 장면 2 `Who is going to hold the tube first?`의 first는 '먼저'라 뜻이 다릅니다(세 장면은 같은 뜻이어야 함). → `Is this his first change since the surgery?`
16. context에서 `who: 의사에게 보고`인데 의사에게 내리는 명령인 장면 — 보고로 바꿔 어색한 장면이 하나만 남게:
    - 10 `This is his first trach change, so keep the airway cart close.` → `This is his first trach change, so I've kept the airway cart close.`
    - 12 `Confirm the cuff is deflated before placing the speaking valve.` → `I've confirmed the cuff is deflated before placing the speaking valve.`
    - 15 `This is an airway emergency, so open the cric kit.` → `This is an airway emergency — I'm opening the cric kit.`
    - 16 `His bradycardia is from hypoxia, so oxygenate first.` → `I think his bradycardia is from hypoxia — he needs oxygen first.`
    - 17 `He's scared and confused, so talk him through it.` → `He's scared and confused, so I'm talking him through it.`
    - 18 `Control the bleeding and keep the airway secured.` → `The bleeding is heavy, and I'm keeping the airway secured.`
    - 19 `The tube is not in the trachea, so pull it now.` → `There's no CO2 — I think the tube is not in the trachea.`
    - 20 `His airway is obstructing, so get the difficult airway team.` → `His airway is obstructing — I'm calling the difficult airway team.`
17. 상황 2 context(`view`) 장면 2 `Adjust the pressure, I am trying to improve my view.` — 삽관하는 사람의 말이라 간호사 장면이 아닙니다. → `Tell me if the pressure is helping your view.`
18. 상황 4 pair — decoy `the call light`가 `clear`에 붙습니다("clear the call light"는 병동에서 실제로 씀). → decoy `the wristband`.
19. 상황 3 context(`secure`) `why`의 "보관 위치 숫자"→"몇 cm에서 고정했는지 숫자". `fix`의 `taped`는 장면(commercial holder)과 다르니 `We've secured the breathing tube firmly so it stays in place.`
20. 상황 0 context `ko: 확인하다` — 은행 `w-check`의 ko를 '점검하다'로 바꿨으니 `점검하다`로 맞춤.
21. 상황 2 pair `why` — sniffing position을 "목을 살짝 굽혀"로만 씀 → "어깨 아래가 아니라 머리 밑을 받쳐 목은 앞으로 굽히고 머리는 뒤로 젖혀"(단어 cue와도 맞춤).
22. (선택) 상황 13 pair — decoy `the infusion pump`가 `elevate`·`swab`에 억지로는 붙습니다. `the call light`로 바꾸면 깔끔합니다.

pair 전 조합 판정:

| 상황 | 왼쪽 | 결합(정답 굵게) | 판정 |
|---|---|---|---|
| 2 | sniffing | **position** · maneuver · the pulse | 정답 하나 |
| 2 | BURP | position · **maneuver** · the pulse | 정답 하나("BURP position"은 쓰지 않음) |
| 4 | retie | **the trach ties** · the oxygen · the secretions · the call light | 정답 하나 |
| 4 | humidify | the trach ties · **the oxygen** · the secretions · the call light | 정답 하나 |
| 4 | clear | the trach ties · the oxygen · **the secretions** · the call light | **"clear the call light" 성립 → 18번** |
| 8 | fluid | **bolus** · pressor · the sedation | 정답 하나 |
| 8 | push-dose | bolus · **pressor** · the sedation | 정답 하나 |
| 13 | elevate | **the head of the bed** · the mouth · the infusion pump | 약하게 성립(pump) → 22번(선택) |
| 13 | swab | the head of the bed · **the mouth** · the infusion pump | 약하게 성립(pump) |
| 14 | call | **for help** · the medications · the drawer | 정답 하나 |
| 14 | manage | for help · **the medications** · the drawer | 정답 하나 |

### C. 단어

23. `w-reoxygenate` cue "숨이 끊긴 뒤에" — '숨이 끊기다'는 죽었다는 뜻입니다. → "산소포화도가 떨어진 뒤에 다시 산소를 충분히 채워 주는 일".
24. **[안전]** `w-overinflate` cue → "출혈을 누르려고 커프에 평소보다 훨씬 많이 공기를 넣어 부풀리는 일".
25. `w-epinephrine` cue "아드레날린 계열의 약" — 아드레날린은 같은 약의 다른 이름이라 정답이 드러납니다. → "심정지나 아나필락시스·기도 부종 때 쓰는 강한 승압·기관지 확장 약".
26. `w-crisis` distractorsEn `[crises, crisp]` — crises는 정답의 복수형(정답으로도 맞음), crisp는 형용사. → `[critic, cursor]`.
27. `w-bagmask` distractorsEn `face-mask` — "face-mask ventilation"은 bag-mask ventilation과 같은 뜻으로 씁니다. → `gas-mask`.
28. `w-periintubation` distractorsKo `[삽관 직전의, 삽관 직후의]` — 둘 다 '삽관 전후'의 일부라 정답이 둘에 가깝습니다. → `[발관 전후의, 수술 전후의]`.
29. `w-label` distractorsEn `levelled`(영국식) → `leveled`.
30. `w-safer` chips `[safe, r]` — `r` 한 글자 조각은 형태소가 아닙니다. → `[[saf, er]]`, decoyChips `[sav, est]`.
31. `w-number` cue "0부터 9로 이루어진 값" → "모니터나 검사에서 측정해 나온 값".
32. decoyChips·조각 중 응급·임상 단어에 섞이면 불쾌한 것(비속어 관점) — 학습자가 위급 장면 단어를 조립하다 이 조각을 보게 됩니다.

    | id | 조각 | 왜 | 대안 |
    |---|---|---|---|
    | w-bradycardia | `die`(decoy) | 서맥 응급에 '죽다' | `dye` |
    | w-desaturate | `die`(decoy) | 저산소 응급에 '죽다' | `dee` |
    | w-deflate | `die`(decoy) | '죽다' | `dee` |
    | w-device | `die`(decoy) | '죽다' | `dee` |
    | w-cricothyrotomy | `tomb`(decoy) | CICO 응급에 '무덤' | `tome` |
    | w-bradycardia | `bra`(정답 조각) | '브래지어' | chips `[[brady, car, dia]]` |

    같은 관점에서 distractorsEn도 바꾸세요(품사 표에도 일부 겹침): `w-hoarse` hearse(영구차)→`hollow`, `w-struggle` strangle(목 조르다)→`straggle`, `w-swab` stab(찌르다)→`swap`(동사), `w-stay` slay(죽이다)→`sway`, `w-lower` lover→`loosen`, `w-underneath` underwear→`underway`, `w-nasal` nasty→`basal`, `w-swelling` shelling(포격)→`swallowing`.

33. **distractorsEn 품사가 정답과 다른 것 — 전부**(대안은 같은 품사·비슷한 철자, 길이 규칙 안):

    | id | 정답(품사) | 다른 품사 오답 | 대안 |
    |---|---|---|---|
    | w-anything | anything(대명사) | anyway(부사) | anybody |
    | w-off | off(형용사) | out(부사), our(한정사) | okay, open |
    | w-agent | agent(명사) | ancient(형용사) | agenda |
    | w-after | after(부사) | alter(동사) | apart |
    | w-best | best(형용사) | bust(명사), vest(명사) | least, bent |
    | w-view | view(명사) | few(한정사) | value |
    | w-more | more(부사) | mole, mode(명사) | most, mere |
    | w-less | less(부사) | lens, lease(명사) | least, last |
    | w-sound | sound(명사) | sung(과거분사) | sand |
    | w-chest | chest(명사) | cheat(동사) | crest |
    | w-gastric | gastric(형용사) | garlic(명사) | gaseous |
    | w-tape | tape(동사) | tale(명사) | type |
    | w-snug | snug(형용사) | snub(동사) | smooth |
    | w-underneath | underneath(부사) | underwear(명사), understand(동사) | underway, overhead |
    | w-only | only(부사) | onion(명사), lonely(형용사) | openly, orally |
    | w-loose | loose(형용사) | goose, loop(명사) | close, lone |
    | w-site | site(명사) | cite(동사) | suite |
    | w-wound | wound(명사) | woven(분사) | mound |
    | w-look | look(연결동사) | luck(명사), book(명사) | leak, lurk |
    | w-talk | talk(동사) | talc(명사) | walk |
    | w-buy | buy(동사) | boy(명사) | bow |
    | w-safe | safe(형용사) | save(동사) | sane |
    | w-higher | higher(부사) | hiker(명사) | hotter |
    | w-common | common(형용사) | commune, comment(명사) | comic, combined |
    | w-watch | watch(동사) | watt(명사) | catch |
    | w-blood | blood(명사) | bold(형용사) | brood |
    | w-give | give(동사) | gift(명사) | live |
    | w-fluid | fluid(명사) | fluent(형용사) | flute |
    | w-bolus | bolus(명사) | basal(형용사) | bolts |
    | w-callout | call out(구동사) | callback(명사) | call in |
    | w-hoarse | hoarse(형용사) | hearse(명사) | hollow |
    | w-act | act(동사) | ant(명사) | ask |
    | w-swelling | swelling(명사) | swelter(동사) | swallowing |
    | w-call | call(동사) | hall(명사) | cull |
    | w-worse | worse(형용사) | wore(동사) | wiser |
    | w-wait | wait(동사) | weight(명사) | wade |
    | w-little | little(형용사) | litter(명사), listen(동사) | brittle, lithe |
    | w-longer | longer(부사) | linger(동사), lunge(동사) | louder, stronger |
    | w-samesize | same-size(형용사) | size-up(명사) | mid-size |
    | w-first | first(형용사) | forth(부사) | final |
    | w-step | step(명사) | steep(형용사) | stem |
    | w-hold | hold(동사) | hood, hall(명사) | fold, howl |
    | w-old | old(형용사) | owed(동사) | odd |
    | w-new | new(형용사) | knew(동사), few(한정사) | near, neat |
    | w-critical | critical(형용사) | cricket, critter(명사) | clinical, cynical |
    | w-verify | verify(동사) | verity(명사) | vilify |
    | w-right | right(형용사) | rite(명사), write(동사) | bright, tight |
    | w-must | must(조동사) | mist(명사), most | might, may |
    | w-monitor | monitor(동사) | monster(명사) | muster |
    | w-try | try(동사) | tray(명사) | pry |
    | w-down | down(형용사) | gown, town(명사) | done, drawn |
    | w-take | take(동사) | lake(명사) | make |
    | w-well | well(부사) | wall(명사) | wildly |
    | w-own | own(형용사) | owe(동사), oven(명사) | other, odd |
    | w-elevate | elevated(형용사) | elevator(명사) | alleviated |
    | w-past | past(전치사) | pass(동사), pace(명사) | apart, post |
    | w-regular | regular(형용사) | regulate(동사) | regal |
    | w-lower | lower(동사) | lover, power(명사) | loosen, lounge |
    | w-often | often(부사) | soften(동사), oven(명사) | oddly, openly |
    | w-instead | instead(부사) | insight(명사), instant(형용사) | indeed, inside |
    | w-flat | flat(형용사) | float(동사), flap(명사) | fast, flush |
    | w-brush | brush(동사) | brash(형용사) | blush |
    | w-device | device(명사) | devise(동사) | decoy |
    | w-crisis | crisis(명사) | crisp(형용사) | (26번) |
    | w-hit | hit(동사) | hut(명사) | hint |
    | w-drawer | drawer(명사) | drawn(분사) | drawl |
    | w-run | run(동사) | rug(명사) | ruin |
    | w-later | later(부사) | layer(명사), latter(형용사) | lately, lower |
    | w-open | open(동사) | oven(명사), upon(전치사) | opine, ripen |
    | w-stat | stat(부사) | static(형용사), steak(명사) | 같은 품사의 닮은 말이 마땅치 않음 — 그대로 두어도 됨 |
    | w-someone | someone(대명사) | somehow(부사) | no one |
    | w-loud | loud(부사) | cloud(명사), laud(동사) | proud, lightly |
    | w-stuck | stuck(형용사) | stack(명사) | stark |
    | w-heart | heart(명사) | hurt(동사), heard(동사) | hearth, heat |
    | w-low | low(형용사) | row, lot(명사) | slow, loud |
    | w-arrest | arrest(명사) | attest(동사) | unrest |
    | w-again | again(부사) | against(전치사) | aside |
    | w-out | out(형용사) | our(한정사), ouch(감탄사) | in, up |
    | w-fresh | fresh(형용사) | frost(명사), crush(동사) | frail, harsh |
    | w-hard | hard(형용사) | herd, hand(명사) | hardy, hairy |
    | w-calm | calm(형용사) | palm(명사), claim(동사) | balmy, clammy |
    | w-fault | fault(명사) | falter, fought(동사) | (9번으로 단어를 지우면 해당 없음) |
    | w-apply | apply(동사) | apple(명사) | supply |
    | w-firm | firm(형용사) | farm, form(명사) | faint, fine |
    | w-tamponade | tamponade(동사) | tampon, pontoon(명사) | tamper, barricade |
    | w-get | get(동사) | jet, gut(명사) | bet, set |
    | w-loss | loss(명사) | toss(동사) | moss |
    | w-mean | mean(동사) | meat(명사) | moan |
    | w-next | next(형용사) | text, nexus(명사) | neat, last |
    | w-recheck | recheck(명사) | reflect(동사) | request |
    | w-rise | rise(동사) | rice(명사) | rinse |
    | w-hear | hear(동사) | here(부사), hair(명사) | heal, heave |
    | w-full | full(형용사) | fall(동사), fool(명사) | foul, dull |
    | w-rightward | rightward(부사) | righteous(형용사) | rearward |

### D. 결정 11 (기존 단어·문장의 가벼운 정리)

34. `w-surgery` ko '수술' — 15.1·18.1·18.3이 "call surgery"(외과 팀을 부름)입니다(11.3을 8번대로 바꾸면 네 문장 모두). → ko `외과`, cue "수술을 맡는 진료과 — 급할 때 전화로 부르는 팀", distractorsKo `[마취, 소생]`→`[내과, 영상의학과]`. changes에 적기.
35. `w-drug` ko '약물(명)' — 어색하고 `w-medication` '약물'과 뜻이 겹칩니다. → `약(성분)`.
36. `w-periintubation` en `Peri-intubation` — 문장 첫머리라 대문자가 됐을 뿐 헤드워드는 소문자 `peri-intubation`(chips·decoyChips `Pre-`도 소문자로).
37. tag `일반 동사`가 동사가 아닌 단어에 붙음: closer·anything·after·best·more·less·only·first·safe·easier·higher·common·closely·process·little·longer·slowly·step·old·new·different·right·separately·must·fully·well·own·regular·care·often·instead·chance·later·easily·next·again·safer. → 이들은 `일반 표현`으로 나눔. `w-bedside`·`w-past`의 tag `기도 장비`도 맞지 않음(→`체위·시야`·`일반 표현`).
38. **keyPhrase 14.1의 ko만**(en 그대로): `흡인은 당신이, 약물은 응급 상황 동안 제가 관리할게요.` → `응급 상황에서는 흡인은 당신이 맡고, 약물은 제가 관리할게요.` distractorsKo 둘도 새 ko 틀로 다시(예: `…흡인은 당신이 맡고, 모니터는 제가 관리할게요.` / `…산소는 당신이 맡고, 약물은 제가 관리할게요.`).
39. 2.4 ko `압박을 더 세게 하거나 덜 필요하면 알려 주세요.` → `압박을 더 세게 하거나 약하게 해야 하면 알려 주세요.` distractorsKo 둘도 새 ko에 맞춰 다시.
40. 9번을 반영하면 `w-fault` word-remove를 changes에 적기.

변경 목록(changes) 판정: 활용형→원형 35건, ko 가르기 10건, 쉬운 단어 제거 19건 모두 타당합니다. `w-close`(닫히다/가까운)·`w-place`(놓다)를 두 뜻에 맞춘 것도 맞습니다. `w-off` 태그를 4번 문장에서 뺀 것도 맞습니다. 과하거나 틀린 변경은 없습니다.
참고(바꾸지 않아도 됨): `w-bagmask`(백마스크)와 `w-bagvalvemask`(백밸브마스크)는 같은 기구입니다. 서로의 오답은 아니라서 문제가 되지 않습니다.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| 문장 | 현재 en | 문제 | 대안 en |
|---|---|---|---|
| 16.2 | If the heart rate stays low, we start the arrest algorithm. | **사실 오류.** 맥박이 있는 성인 서맥은 서맥 알고리즘(아트로핀·페이싱·에피/도파민 점적)으로 가고, 심정지 알고리즘(CPR)은 맥박이 없어졌을 때 시작합니다. 같은 상황 slider `why`와 모순되고 저작자 메모 A의 지적도 같습니다 | `If he loses his pulse, we start the arrest algorithm.` 또는 `If the heart rate stays low, we move to the bradycardia algorithm.` |
| 3.2 | I'll order the chest X-ray to check the tube depth. | 업무범위. 흉부 X선 처방은 의사의 일입니다(프로토콜이 없으면). ko도 "처방할게요" | `Let's get the chest X-ray to check the tube depth.` (w-order가 빠지면 8.3 새 문장이 받음) |
| 3.0 | We have sustained color change on capnography, confirming the airway. | 색 변화는 비색식 CO₂ 감지기이고 capnography는 파형입니다. 같은 상황 slider는 파형을 표준으로 가르칩니다. "confirming the airway"도 어색함 | `We have sustained color change on the CO2 detector, confirming tracheal placement.` 또는 `We have a sustained waveform on capnography, confirming tracheal placement.` |
| 19.0 | No sustained capnography means the tube is not in the trachea. | "capnography가 없다"는 말이 어색함(측정법이지 값이 아님) | `No sustained CO2 on capnography means the tube is not in the trachea.` |
| 7.2 | This buys us more safe time during the intubation attempt. | "more safe time"이 어색함(보통 "safe apnea time"). chunks `during the intubation / attempt`가 명사구를 끊음 | `This buys us more safe apnea time during the intubation attempt.` |
| 20.1 | Give nebulized epinephrine while we call the difficult airway team. | (선택) 원인이 아나필락시스면 1차는 근주 에피네프린이고 분무는 보조입니다. 원인이 정해지지 않은 장면이라 그대로 두어도 됩니다 | `Give the epinephrine as ordered while we call the difficult airway team.` |

chunks만 문제인 keyPhrase(보고만, 고치지 않음): 2.2 `Backward / , upward / , rightward pressure`(쉼표로 시작하는 조각) · 6.1 `as a rescue / option` · 11.0 `and cuff / positions` · 13.2 `Regular mouth / care` · 16.0 `with 100 percent / oxygen` · 10.0 `and a same-size / backup trach ready` · 17.1 `Get the same-size / and a smaller / trach ready` · 20.1 `the difficult airway / team` · 20.2 `and a surgical / airway backup` · 15.0 `a can't-intubate, / can't-oxygenate emergency`.

## 저작자 메모 판정
- A: 16.2 → 사실 오류로 keyPhrase 결정에 올림. 17.3 → 타당함, 9번. w-clean·w-hold·w-alert의 두 뜻 → w-hold만 10.4 수정에 딸려 ko를 바꿈(1번), 나머지는 그대로 둬도 됨. w-off·cords·sats → 타당함.
- B: 문장 수정 없음, distractorsKo 관련 메모는 B 검토 몫입니다.

## 개수
고칠 것 **40건**(A 문장 10 · B 뉘앙스 12 · C 단어 11(품사 표와 조각 표는 각각 1건) · D 결정 11 7), 그중 **[안전] 9건**(1·2·3·4·5·11·12·13·24). keyPhrase 16.2(사실 오류)는 고칠 것이 아니라 결정 목록에 둠. keyPhrase 결정 필요 6건(+chunks 보고 10곳).

## 종합
사실 오류 몇 개(교체 중 스토마 압박, 쉽게 들어간다는 약속, CICO에서 SGA 단계를 건너뜀, 교체 중 저산소 대응)와 업무범위 문장 4개를 고치고, keyPhrase 16.2를 사용자가 결정하면 내보내도 됩니다. 품사 표와 조각 정리는 기계적인 일이라 수정 담당이 한 번에 반영할 수 있습니다.
