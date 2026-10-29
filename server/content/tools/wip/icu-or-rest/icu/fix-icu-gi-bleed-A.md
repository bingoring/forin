# fix-icu-gi-bleed-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번)

대상: `icu-gi-bleed.yaml`(A·B 합친 파일, 단어 302 · 상황 21 · 문장 147). 비교: base·changes(114건)·in·notes A/B.
뉘앙스: slider 13 · pair 8 · context 20 · swap 1 · reel 0.
스크립트(작업 폴더): `_rvA_icu-gi-bleed.py`(words/sent/nu 덤프·pair 전 조합·swap 이어 읽기), `_rvA_icu-gi-bleed_chips.py`(decoyChips 재조립·불쾌 조각), `_rvA_icu-gi-bleed_chk.py`(길이·cue 영어·context 모양).
기계 확인 결과: 오답 길이 규칙 위반 0, decoyChips로 정답을 다른 경로로 조립하는 경우 0, context 20개 모두 `word`·`ko`·장면 3·`ok:false` 1·`word`가 세 장면 `en`에 다 있음, swap 1개 세 선택지 모두 문법 맞음, swap `ko` 정확.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 소리·철자가 닮은 오답은 좋지만 품사가 다른 오답이 약 30개, `intimate`·`intimately`(성적인 뜻)가 응급 단어 오답에 있음 |
| 2 distractorsKo·길이 | 4 | 길이 위반 0. `acidotic`의 오답 '산성의'가 정답에 가깝고, `med`의 오답 '땀·피'는 같은 분야가 아님 |
| 3 cue | 4 | `point` 단서가 손가락으로 가리키는 뜻(문장은 '시사하다'), `handoff`가 근무 교대만 말함, `make`·`away` 단서에 영어 |
| 4 chips/decoyChips | 4 | 재조립 0. 죄·악덕·마약 은어·사고를 떠올리는 조각(`sin`·`vice`·`joint`·`pot`·`wreck`·`gross`·`fat`), 중간 한 글자 조각 |
| 5 뉘앙스 사실 | 4 | 대체로 미국 ICU 관행에 맞고 "처방대로"를 일관되게 붙임. 상황 3 `dizzy`가 더 강하다는 주장, 상황 17 `liver shunt`, 상황 9·10 context fix가 장면과 다름 |
| 6 뉘앙스 설계 | 4 | pair 8개 모두 정답 하나. context 6(정상 장면과 어색한 장면의 뜻이 반대), 20(어색한 장면의 듣는 사람이 정상 장면과 같음), 16(ko 동사인데 두 장면이 명사) |
| 7 결정 11 | 4 | 변경 목록은 과하지 않음(아래 D). 다만 구에서만 뜻이 서는 헤드워드(`hand`·`make`·`mix`·`sort`·`away`·`catch`)의 ko·태그가 안 맞고, `ever`·`actively`·`through`·`steady` ko가 틀림 |

## 사실 오류·심각한 문제

1. **[안전] 8.3** `Seven point two is below eight, but he's not actively bleeding right now.` — 제한적 수혈 기준은 보통 Hb 7, 심혈관 질환이 있으면 8입니다. 8을 기준선으로 말하면서 7.2인데 수혈하지 않는다는 말은 서로 맞지 않습니다(8이 이 환자의 기준이면 수혈 대상). 학습자가 "8 아래여도 출혈만 없으면 안 준다"로 배웁니다.
2. **[안전] 8.4** `We only transfuse if he drops further or becomes symptomatic.` — 수혈 여부를 간호사 쪽에서 `only`로 못 박습니다. 수혈은 처방으로 합니다.
3. **[안전] 13.5** `A little tiredness is normal, it's the blood loss catching up with him.` — 재출혈 감시 장면에서 가족에게 피로를 '정상'이라고 단정합니다. 피로·기운 없음은 계속되는 실혈의 신호일 수 있어 잘못된 안심입니다. 확인하겠다는 말도 없습니다.
4. **[안전] 4.4** `Once your stomach settles, we'll try small sips of water.` — 내시경 전 금식(NPO) 환자에게 위가 가라앉으면 물을 주겠다고 간호사가 약속합니다. 식이 진행은 처방(보통 내시경 뒤)입니다.
5. **[안전] 18.3** `His pressure dropped fast, so we're pushing fluids wide open.` — 출혈성 저혈압에서 정질액을 처방 없이 최대로 미는 말입니다. 위장관 출혈은 혈액이 우선이고 정질액 과다(특히 정맥류)는 해롭습니다.
6. **[안전] 10.6** `We'll hold the scope until his numbers look safer.` — 내시경 시점은 GI가 정하고, 미국 지침(ACG)은 응고 교정·항응고 역전 때문에 내시경을 늦추지 말라고 합니다. 간호사가 내시경을 미룬다고 말하는 것은 업무범위 밖이고 사실과도 다릅니다.
7. 6.3 `This is a variceal bleed from her liver disease, not a stomach ulcer.` — 내시경 전에 원인을 단정합니다(장면 첫마디도 "looks like"). 가능성으로 말해야 합니다.
8. 18.6 ko `저랑 계속 계세요` — 역할이 뒤집힌 번역(TASK 7번). 환자에게는 "정신 놓지 마세요".
9. 14.6 `I'll call report the moment we're wheels up.` — `wheels up`은 항공 은어라 병원 내 이송에 어색하고, 보고는 이동하기 **전에** 하는 것이 관행입니다.
10. 14.3 `a pump bag` — 표준 용어가 아닙니다. 이송에 가져가는 것은 앰부백(BVM)입니다.
11. keyPhrase 6.0 `let's start the octreotide drip now`, 15.0 `Activate MTP…`, 18.0 `Open the fluids wide…` — 간호사가 약·프로토콜·수액을 정하는 어조. **사용자 결정 필요**(아래 E).

## 고칠 것

[안전]을 붙인 것이 안전 항목입니다. 문장을 새로 쓰면 **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 2·blank)를 전부 새로 쓰고**, 바뀐 `words`는 `changes-icu-gi-bleed.yaml`에 적으세요. 그 문장이 어떤 은행 단어의 `example`·`exKo`이면(괄호에 적음) 그것도 새 문장으로 바꿉니다. 문장 `ko`만 고친 경우에도 `distractorsKo` 둘을 새 ko 틀에 맞춰 다시 씁니다.

### A. 문장 (keyPhrase 아님)

1. **[안전] 제한적 수혈 목표 판단 8.3** — 기준 8 단정(사실 오류).
   - en: `Seven point two isn't below his ordered threshold, and he's not actively bleeding right now.`
   - ko: `7.2는 처방된 기준치보다 낮지 않고, 지금 활동성 출혈도 없어요.`
   - chunks: `Seven point two / isn't below / his ordered threshold / , and he's not / actively bleeding right now / .`
   - words: `[w-below, w-order, w-actively, w-bleed]`. v46 필드 전부 새로(blank `below`는 그대로 써도 됨 — `above`는 이제 뜻이 반대라 정답이 아님).
   - 딸린 것: `w-below`·`w-actively` example·exKo.
2. **[안전] 제한적 수혈 목표 판단 8.4** — 간호사 단독 수혈 결정.
   - en: `We'll transfuse as ordered if he drops further or becomes symptomatic.`
   - ko: `더 떨어지거나 증상이 생기면 처방에 따라 수혈해요.`
   - chunks: `We'll transfuse / as ordered / if he drops further / or becomes symptomatic / .`
   - words: `[w-transfuse, w-order, w-drop, w-further, w-symptomatic]`. v46 필드 전부 새로.
   - 딸린 것: `w-transfuse`·`w-further`·`w-symptomatic` example·exKo.
3. **[안전] 재출혈 감시·재평가 13.5** — 잘못된 안심(저작자 메모 A9 — 허용 범위 밖으로 판정).
   - en: `Some tiredness can be normal after blood loss, but tell me right away if it gets worse.`
   - ko: `피를 많이 흘린 뒤엔 어느 정도 피곤할 수 있지만, 더 심해지면 바로 말씀해 주세요.`
   - chunks: `Some tiredness / can be normal / after blood loss / , but tell me right away / if it gets worse / .`
   - words: `[w-tiredness, w-normal, w-blood, w-loss, w-tell, w-worse]`. `w-catch`는 어느 문장도 태그하지 않게 되니 **word-remove**(헤드워드 `catch`·ko '나타나다'도 원래 `catch up`과 안 맞았음). v46 필드 전부 새로.
   - 딸린 것: `w-tiredness`·`w-normal`·`w-loss` example·exKo. 상황 13 slider `example`·`exKo`도 → `Some tiredness can be normal, but tell me if you feel faint.` / `어느 정도 피곤할 수 있지만, 쓰러질 것 같으면 말씀해 주세요.`
4. **[안전] NPO·위관 관리 4.4** — 금식 환자에게 물 약속.
   - en: `Once your stomach settles and the doctor says it's okay, we'll try small sips of water.`
   - ko: `위가 가라앉고 의사 선생님이 괜찮다고 하면 물을 조금씩 드셔 볼게요.`
   - chunks: `Once your stomach settles / and the doctor says it's okay / , we'll try / small sips of water / .`
   - words 그대로 `[w-stomach, w-settle, w-try, w-sip]`. v46 필드 전부 새로.
   - 딸린 것: `w-settle`·`w-try`·`w-sip` example·exKo.
5. **[안전] 재출혈 급변 소생 18.3** — 처방 없는 wide-open 정질액.
   - en: `His pressure dropped fast, so we're pushing the ordered fluids until the blood arrives.`
   - ko: `혈압이 빠르게 떨어져서, 혈액이 올 때까지 처방된 수액을 밀어 넣고 있어요.`
   - chunks: `His pressure dropped fast / , so we're pushing / the ordered fluids / until the blood arrives / .`
   - words: `[w-pressure, w-drop, w-fast, w-push, w-order, w-fluid, w-until, w-blood]` (w-open은 18.0에 남음). v46 필드 전부 새로.
   - 딸린 것: `w-push` example·exKo.
6. **[안전] 응고장애 교정 10.6** — 내시경 보류를 간호사가 정함·지침과 다름.
   - en: `GI will decide on the scope timing once they see his new numbers.`
   - ko: `새 수치를 보고 GI팀이 내시경 시점을 정할 거예요.`
   - chunks: `GI will decide / on the scope timing / once they see / his new numbers / .`
   - words: `[w-decide, w-scope, w-number]` (w-look·w-safe은 다른 문장에 남음). v46 필드 전부 새로.
   - 딸린 것: `w-number` example·exKo.
7. 정맥류 출혈 초기 관리 6.3 — 원인 단정(저작자 메모 B).
   - en: `With her liver disease, this is most likely a variceal bleed, not an ulcer.`
   - ko: `간질환이 있어서 궤양보다는 정맥류 출혈일 가능성이 커요.`
   - chunks: `With her liver disease / , this is most likely / a variceal bleed / , not an ulcer / .`
   - words: `[w-liver, w-disease, w-variceal, w-bleed, w-ulcer]` (w-stomach 태그를 뺌 — 다른 상황에 남고, 상황 6의 서로 다른 단어 8개 이상도 유지됨). v46 필드 전부 새로.
   - 딸린 것: `w-variceal`·`w-liver`·`w-disease` example·exKo.
8. 출혈 병력·항응고 검토 5.3 — 어색한 영어(저작자 메모 A2).
   - en: `You were taking it for a good reason, and pausing it now doesn't mean we're blaming you.`
   - ko: `필요해서 드시던 약이에요. 지금 잠시 끊는 건 탓하려는 게 아니에요.`
   - chunks: `You were taking it / for a good reason / , and pausing it now / doesn't mean / we're blaming you / .`
   - words: `[w-reason, w-mean, w-blame]` (w-stop은 다른 문장에 남음; `w-blame` ko '탓하다'가 동사로 맞게 됨). v46 필드 전부 새로.
   - 딸린 것: `w-reason`·`w-blame` example·exKo.
9. 출혈 병력·항응고 검토 5.4 — `We're just balancing it`은 간호사가 항응고제를 조절하는 것으로 들립니다.
   - en: `The doctors are balancing it against the bleeding for now.`
   - ko: `지금은 의사 선생님들이 출혈과 견주어 균형을 맞추고 있어요.`
   - chunks: `The doctors are / balancing it / against the bleeding / for now / .`
   - words 그대로. v46 필드 전부 새로. 딸린 것: `w-balance` example·exKo.
10. IR·내시경 이송 조율 14.6 — 은어·보고 순서(저작자 메모 A7·B).
    - en: `I'll call report to IR before we leave the unit.`
    - ko: `병동을 나서기 전에 IR팀에 전화로 인계할게요.`
    - chunks: `I'll call report / to IR / before we leave / the unit / .`
    - words: `[w-call, w-report, w-ir, w-before]`. `w-moment`는 어느 문장도 태그하지 않게 되니 **word-remove**. v46 필드 전부 새로.
    - 딸린 것: `w-report` example·exKo.
11. IR·내시경 이송 조율 14.3 — `pump bag`은 표준 용어가 아님.
    - en: `Monitor, oxygen, and an Ambu bag all need to travel with him.`
    - ko: `모니터랑 산소, 앰부백까지 다 같이 가져가야 해요.`
    - chunks: `Monitor, oxygen, / and an Ambu bag / all need / to travel with him / .`
    - words 그대로. v46 필드 전부 새로(distractorsKo의 '펌프백'도). 딸린 것: `w-oxygen`·`w-bag`·`w-travel` example·exKo, `w-bag` cue(C-3).
12. 재출혈 급변 소생 18.6 — **ko만** (저작자 메모 A1·B).
    - ko: `정신 놓지 마세요, 지금 혈압을 다시 올리고 있어요.`
    - words: `w-stay` 태그를 뺌(ko '머무르다'와 뜻이 다름; 3.2·16.2에 남음) → `[w-blood, w-pressure]`.
    - distractorsKo 둘을 새 ko 틀로 다시(예: `정신 놓지 마세요, 지금 수액 줄을 바꾸고 있어요.` — 안전 시험에 걸리지 않는 자리만 바꿀 것). why도 '곁에 있어 달라'가 아니라 '의식을 붙잡는 말'로.
13. 출혈 불응 목표·예후 소통 20.5 — 저작자 메모 A11. 간호사가 선택지를 소개하는 것은 허용하지만, `keep fighting`은 편안한 돌봄을 '포기'처럼 들리게 하는 전쟁 비유라 완화 돌봄 소통에서 피합니다.
    - en: `Some families choose more treatment, others choose comfort care, and both are okay.`
    - ko: `치료를 더 이어 가기로 하는 가족도 있고, 편안한 돌봄을 택하는 가족도 있어요. 둘 다 괜찮아요.`
    - chunks: `Some families choose / more treatment / , others choose comfort care / , and both are okay / .`
    - words 그대로 `[w-choose, w-comfort]`. v46 필드 전부 새로. 딸린 것: `w-choose`·`w-comfort` example·exKo.
14. 대구경 정맥로 확보 협조 1.5 — **ko만**. `지금 들어갈게요`는 '방에 들어간다'로 읽힙니다.
    - ko: `지혈대 감았어요, 이제 바늘 넣을게요.` distractorsKo 둘을 새 ko 틀로. 딸린 것: `w-tourniquet` exKo.
15. chunks 구 경계(문장은 그대로, chunks만 다시 — 바꾼 문장은 `decoy`가 새 청크와 같지 않은지 다시 볼 것):
    - 0.3 `for any black or bloody / color` → `I'm also checking / your stool / for any black or bloody color / .`
    - 4.5 `I'll let / the team know right away` → `If the drainage turns / bright red again / , I'll let the team know / right away / .`
    - 9.3 `the doctor / ordered` → `The pump is set / to the exact rate / the doctor ordered / .`
    - 9.6 `trends / down again` → `I'll flag / the physician / if his pressure / trends down again / .`
    - 12.3 `, diverticulosis, or something / higher up` → `It could be / from hemorrhoids, / diverticulosis, / or something higher up / .`
    - 12.4 `the doctor look directly / at the bowel` → `A colonoscopy / will let the doctor / look directly at / the bowel / .`
    - 14.5 `and the last / hemoglobin / value` → `IR needs / his weight, allergies, / and the last hemoglobin value / .`
    - 15.5 `in equal / amounts` → `We give plasma, / platelets, and red cells / in equal amounts / .`
    - 18.4 `while type / and cross finishes` → `We need / emergency release blood / while type and cross / finishes / .`
    - 19.4 `A cold / , acidotic patient clots` → `A cold, acidotic patient / clots even worse / , so we fix / that too / .`
    - 19.5 `in a one-to-one-to-one / ratio` → `We're giving / products / in a one-to-one-to-one ratio / .`

저작자 메모 중 고치지 않는 것: A10(16.5 breathing tube — 문제 없음), A8(12.0)·A3/A4의 8.0은 keyPhrase라 E로.

### B. 뉘앙스

16. 상황 8 slider `why` — 기준을 아예 말하지 않으면 8.3을 고쳐도 학습자가 기준을 모릅니다. 끝에 "흔히 Hb 7 g/dL, 심혈관 질환이 있으면 8을 기준으로 쓰지만, 이 환자의 기준은 처방대로 따라요."를 더함.
17. 상황 3 slider `why` — "dizzy는 더 심한 어지러움"은 사실이 아닙니다(dizzy는 넓은 말이고 lightheaded가 더 약하다는 근거 없음). 강도는 수식어가 정합니다. → "같은 어지러움도 수식어로 강도가 갈려요. a little lightheaded는 살짝 핑 도는 정도, very dizzy는 심하게 어지러운 정도, about to faint는 곧 쓰러질 것 같은 단계예요. 눈앞이 어두워지고 쓰러질 것 같다고 하면 눕히고 바로 의사에게 알려요."
18. 상황 6 pair `why` — "둘 다 처방대로 투여하고 지켜봐요"는 출혈(variceal bleed)을 투여하는 말이 됩니다. → "prophylactic antibiotic은 감염을 미리 막는 예방적 항생제로, 간경화 환자의 위장관 출혈에서는 처방대로 바로 시작해요. variceal bleed는 식도·위 정맥류에서 나는 출혈이에요."
19. 상황 6 context(`airway`) — 정상 장면 `Her airway is protected for now`와 어색한 장면 `Her airway is compromised`는 뜻이 반대입니다(세 장면은 같은 뜻이어야 함). 어색한 장면 en → `Her airway is protected for now, but she's at high risk of aspiration.`(fix 그대로).
20. 상황 9 context(`rate`) `fix` — 어색한 장면은 주입 속도 이야기인데 fix가 약 설명으로 바뀝니다. → `The pump gives your medicine at the exact speed your doctor ordered.`
21. 상황 10 context(`coag`) `fix` — 이 장면에서 주는 것은 혈장·혈소판이지 'medicine'이 아닙니다. → `Your blood is taking longer than normal to clot, so we're giving you blood products to help.`
22. 상황 11 context(`balloon`) `fix` — `a small balloon`: 풍선은 둘이고 위 풍선은 큽니다. → `It's a soft tube with balloons that press on the bleeding veins to slow it down.`
23. 상황 16 context(`suction`) — `ko: 흡인하다`(동사)인데 장면 1·2의 suction은 흡인기(명사). 두 장면을 동사로:
    - 장면 1 → `He's bleeding from the mouth, so I'm suctioning and have the intubation tray ready.`
    - 장면 2 → `Can you suction his mouth while I turn him?`
24. 상황 17 pair — `liver shunt`는 TIPS를 가리키는 말로 쓰지 않습니다(TIPS = transjugular intrahepatic **portosystemic shunt**). pairs `[[balloon, tamponade], [portosystemic, shunt]]`, words `[w-tamponade, w-shunt]`(w-liver 뺌). why 둘째 문장 → "TIPS는 간 안에 문맥과 간정맥을 잇는 portosystemic shunt를 만들어 문맥압을 낮추는 시술로, 앞선 치료로 조절되지 않을 때 IR팀이 해요."
25. 상황 20 context(`honest`) — 어색한 장면(보호자에게)과 정상 장면 1(가족에게)의 듣는 사람이 같아, "듣는 사람에게 안 맞는 말"이 아니라 내용 차이가 됩니다(v46 7번). 장면을 이렇게:
    - `{who: 의사에게 보고, icon: stetho, en: "I've been honest with his wife that the bleeding is very hard to control.", ok: true}`
    - 장면 2(동료 간호사) 그대로.
    - `{who: 가족에게, icon: me, en: "To be honest, refractory variceal hemorrhage with his MELD score carries a poor prognosis.", ok: false, fix: "I want to be honest with you: he is very sick, and the doctor will talk with you about what to expect."}`
    - why → "의료진끼리는 솔직하게 상황을 공유해요. 가족에게 refractory, MELD, prognosis 같은 말은 차갑고 어려워요. 아픈 정도는 솔직하게 말하되 예후 설명은 의사가 이어 간다고 알려 줘요."
26. 상황 13 slider `cue` — 상황 13은 가족 장면(in.json role family)인데 cue가 `Patient:`. → `Family: "He says he's a little tired, but otherwise he feels okay."`
27. 상황 15 slider `why` — "발동할지는 의사가 정하고"를 "보통 의사(또는 병원 지침이 정한 사람)가 정하고"로. 미국 병원 다수가 트리거 기준과 지정자를 둡니다.
28. (선택) 상황 14 slider `why` "멈추고 먼저 안정시킨 다음" → "그 자리에서 처치하고 도움을 부른 뒤 이동을 이어 가요" — 엘리베이터 안에서 '멈춘다'는 뜻이 흐립니다.

pair 전 조합 판정(왼쪽 × 오른쪽 전부 + decoys):

| 상황 | 왼쪽 | 결합(정답 굵게) | 판정 |
|---|---|---|---|
| 1 | large-bore | **catheter** · blood · a tourniquet · the pump | 정답 하나 |
| 1 | draw | catheter · **blood** · a tourniquet · the pump | 정답 하나 |
| 1 | apply | catheter · blood · **a tourniquet** · the pump | 정답 하나 |
| 5 | medication | **list** · thinner · ulcer · bed alarm | 정답 하나 |
| 5 | blood | list · **thinner** · ulcer · bed alarm | 정답 하나 |
| 5 | stomach | list · thinner · **ulcer** · bed alarm | 정답 하나 |
| 6 | prophylactic | **antibiotic** · bleed · a pump | 정답 하나 |
| 6 | variceal | antibiotic · **bleed** · a pump | 정답 하나 |
| 7 | blood | **on standby** · checklist · the cuff | 정답 하나 |
| 7 | pre-procedure | on standby · **checklist** · the cuff | 정답 하나 |
| 11 | traction | **weight** · port · the pump | 정답 하나 |
| 11 | balloon | weight · **port** · the pump | 정답 하나 |
| 12 | colonoscopy | **prep** · source · a pump | 정답 하나 |
| 12 | bleeding | prep · **source** · a pump | 정답 하나 |
| 17 | balloon | **tamponade** · shunt · the cooler | 정답 하나 |
| 17 | liver | tamponade · **shunt** · the cooler | 정답 하나이나 콜로케이션이 약함 → 24번 |
| 20 | honest | **answer** · measures · the pump | 정답 하나 |
| 20 | comfort | answer · **measures** · the pump | 정답 하나 |

slider 13개: 모두 약함→강함 순서가 맞고 cue로 정답이 하나만 맞음(상황 9는 사실 지식으로 정함 — PPI는 위산을 '완전히'는 못 없앰, 맞음).
swap(상황 13): `a guarantee`·`a good sign`·`a sure cure` 모두 문법 맞음, 정답 하나, `ko` 정확.
context: 위 19·20·21·22·23·25 말고는 같은 뜻·듣는 사람만 다름·`ko`가 은행 ko와 같음 — 문제 없음.

### C. 단어

29. **distractorsEn 품사가 정답과 다른 것 — 전부**(★ = 꼭 바꿀 것: 품사로 바로 걸러지거나 불쾌한 뜻). 대안은 같은 품사·닮은 철자·길이 규칙 안.

    | id | 정답(품사) | 다른 품사 오답 | 대안 |
    |---|---|---|---|
    | ★ w-tell | tell(동) | tall(형), tile(명) | yell, dwell |
    | ★ w-sick | sick(형) | sock(명), silk(명) | slick, thick |
    | ★ w-sample | sample(명) | simple(형), ample(형) | staple, saddle |
    | ★ w-below | below(전, '미만의') | bellow(동), elbow(명) | beyond, behind |
    | ★ w-stat | stat(부) | stack(명), stage(명) | prn, bid (차트에서 소문자로도 씀 — 대문자면 대소문자로 걸러짐) |
    | ★ w-chest | chest(명) | cheat(동) | crest |
    | ★ w-check | check(동) | cheek(명) | cheer |
    | ★ w-look | look(동) | luck(명) | lurk |
    | ★ w-intubate | intubate(동) | intimate(형, 성적인 뜻) | incubate |
    | ★ w-immediately | immediately(부) | intimately(성적인 뜻) | immensely |
    | w-sign | sign(명) | sing(동) | sine |
    | w-stomach | stomach(명) | stomp(동) | stoma |
    | w-stool | stool(명) | stole(동 과거) | stall |
    | w-black | black(형) | block(명·동) | bleak |
    | w-turn | turn(동) | torn(과거분사) | tune |
    | w-draw | draw(동) | draft(명) | drain |
    | w-mix | mix(동) | mist(명) | fix (헤드워드를 `mix up`으로 바꾸면 D-41의 오답) |
    | w-cell | cell(명) | sell(동) | shell |
    | w-bring | bring(동) | brim(명) | fling |
    | w-watch | watch(동) | wage(명) | fetch |
    | w-team | team(명) | tame(형) | tram |
    | w-give | give(동) | gift(명) | live |
    | w-long | long(부) | lung(명) | lately |
    | w-form | form(동) | fork(명) | foam |
    | w-resort | resort(명) | resolve(동) | retort |
    | w-tape | tape(동) | tale(명) | tamp |
    | w-track | track(동) | truck(명) | trick |
    | w-change | change(동) | chance(명) | chafe |
    | w-suction | suction(동) | section(명) | suture |
    | w-choke | choke(동) | chore(명) | poke |
    | w-everything | everything(대) | everywhere(부) | something |
    | w-recent | recent(형) | regent(명) | remote |
    | w-weight | weight(명) | eight(수사) | freight |

    (consent→consult, blood→blond, imaging→imagining 등은 같은 품사로도 쓰여 둠.)

30. decoyChips·오답 중 불쾌하거나 마약·사고·종교를 떠올리는 것(술·장례 조각은 없음 — `cola`는 음료라 둠):

    | id | 조각/오답 | 왜 | 대안 |
    |---|---|---|---|
    | w-sign | `sin`(decoy) | '죄' | `sine` |
    | w-variceal | `vice`(decoy) | '악덕·비행' | `vat` (`vari`는 var+i를 대신해 재조립되니 쓰지 말 것) |
    | w-varices | `vice`(decoy) | 같음 | `vat` |
    | w-point | `joint`(decoy) | 마리화나 은어 | `print` |
    | w-support | `pot`(decoy) | 마리화나 은어 | `pat` |
    | w-correct | `wreck`(decoy) | 사고 잔해 | `rack` |
    | w-cross | `gross`(decoy) | '역겨운' | `gloss` |
    | w-factor | `fat`(decoy) | 몸 비하로 읽힘 | `fan` |
    | w-hemorrhoid | `raid`(decoy) | 습격 | `road` |
    | w-lie | `lye`(decoy) | 양잿물(독극물) | `lid` |
    | (선택) w-warm | `harm`(decoy) | 해 | `worm` |
    | (선택) w-usually | `sue`(decoy) | 소송 — 병원 앱에서 민감 | `sum` |
    | (선택) w-colonoscopy·w-therapy | `spy`(decoy) | 첩보 | `pie` |
    | (선택) distractorsEn | w-label `libel`·w-insert `insult`·w-honest `hostile`·w-disease `disaster`·w-schedule `scandal`·w-finish `punish` | 부정적인 일상어 | `ladle`·`invert`·`humble`·`distance`·`scaffold`·`polish` |

    바꾼 뒤 `_rvA_icu-gi-bleed_chips.py`처럼 재조립 검사를 다시 돌리세요.

31. `w-point` cue "손가락이나 사물로 어느 방향이나 대상을 짚어 보이는 일" — 문장(12.0)은 '시사하다'. → "증상이나 소견이 어느 쪽이 원인인지 짚어 보이는 일".
32. `w-handoff` cue "근무가 바뀔 때" — 이 주제의 문장은 IR 이송 인계(14.2·17.1). → "근무 교대나 이송 때 환자 상황을 다음 사람에게 넘겨주는 말".
33. `w-bag` cue "손으로 눌러 공기나 수액을 짜 넣는 주머니"(가압백인지 앰부백인지 모호) → A-11과 함께 "숨을 못 쉴 때 손으로 짜서 공기를 불어 넣는 주머니".
34. `w-acidotic` distractorsKo `산성의` — 정답(산증이 있는)과 거의 같은 뜻으로 고를 수 있습니다. → `[알칼리증이 있는, 염기성의]`.
35. `w-med` distractorsKo `[땀, 피]` — 같은 분야가 아니라 한눈에 틀림(문장 14.1은 이송에 챙길 것). → `[장비, 서류]`.
36. `w-ir` ko `영상의학과` — IR은 중재영상의학(인터벤션)입니다. → ko `중재영상의학과`, distractorsKo `[소화기내과, 응급의학과]`(길이 규칙 안).
37. `w-light` ko `불빛` — 문장(3.6)은 call light(호출등). → ko `호출등`, distractorsKo `[호출음, 경고문]`.
38. (선택) `w-aware` distractorsEn `alert` — '경계하는/깨어 있는'이 '알고 있는'에 가까워 고를 수 있습니다. → `afraid`.
39. (선택) 중간 한 글자 조각(airway 검토의 `[safe, r]`와 같은 기준): `w-catheter [cath,e,ter]`→`[cathe, ter]`, `w-medication [med,i,ca,tion]`→`[medi, ca, tion]`, `w-octreotide [oc,tre,o,tide]`→`[oc, treo, tide]`, `w-variceal [var,i,ce,al]`→`[vari, ce, al]`, `w-varices [var,i,ces]`→`[vari, ces]`, `w-usually [u,su,al,ly]`→`[usu, al, ly]`, `w-monitor [mon,i,tor]`→`[moni, tor]`, `w-regularly [reg,u,lar,ly]`→`[regu, lar, ly]`, `w-emergency [e,mer,gen,cy]`→`[emer, gen, cy]`, `w-elevator [el,e,va,tor]`→`[ele, va, tor]`, `w-esophagus [e,soph,a,gus]`→`[eso, pha, gus]`, `w-acidotic [ac,i,dot,ic]`→`[acid, ot, ic]`, `w-oxygen [ox,y,gen]`→`[oxy, gen]`, `w-unit [u,nit]`→`[un, it]`, `w-therapy [ther,a,py]`→`[thera, py]`. 접두사 `a-`(again·aware·away·alone·amount), 접미사 `-y`(bloody·ready·steady), 결합 모음 `fibrin-o-gen`은 형태소라 둠. 바꾸면 decoyChips가 재조립하지 않는지 다시 검사.

### D. 결정 11

**판정: 저작자의 변경 목록은 과하지 않습니다.** 쉬운 말 지움 25개 = 공통 목록 15개 + 판단분 10개(상한 10에 딱 맞음, 허용). ko 조정 29건은 302단어의 약 9.6%(1할 안쪽)이고 건마다 듣고 뜻 고르기 정답 겹침이나 문장과의 불일치라는 근거가 있습니다. 태그 제거 60건은 문장을 건드리지 않은 `words`만의 변경이라 타당합니다. `w-steady` '꾸준한'과 `w-flag` '짚어 알리다'는 아래처럼 고치거나 다듬을 여지가 있지만 방향은 맞습니다.

다만 저작자가 남긴 것 가운데 고칠 것:

40. `w-hand` — 공통 쉬운 단어 목록의 `hand`인데 ko '건네다'로 남았고, 문장(17.6)은 `hand off`(인계하다)입니다. 메모의 "인계 구라 가르칠 값"이 맞다면 **구 단위 헤드워드로**: en `hand off`, ipa `/hænd ɔf/`, ko `인계하다`, cue "다른 팀에게 환자를 넘기며 상황을 알려 주는 동작", chips `[[hand], ["off"]]`, decoyChips `[hang, "of"]`, distractorsEn `[hand out, hold off]`, distractorsKo `[나눠 주다, 미뤄 두다]`. id 유지, changes에 `fields: [en, ko, ipa]`.
41. `w-mix` ko '헷갈리다' — 문장은 `mix … up`. → en `mix up`, ko `혼동하다`, chips `[[mix], [up]]`, distractorsEn `[make up, mark up]`, distractorsKo `[구분하다, 정리하다]`.
42. `w-make` ko '확실히 하다'는 `make sure`의 뜻입니다(cue에 영어 'sure'도 있음). → en `make sure`, chips `[[make], [sure]]`, distractorsEn `[make way, make over]`, cue "빠짐없이 챙겨서 틀림없게 해 두겠다고 말할 때 쓰는 말". 5.2(keyPhrase)의 `words`에서 `w-sure`를 빼고(words만 — en은 그대로) `w-sure`는 word-remove.
43. `w-sort` ko '해결하다'는 `sort out`의 뜻. → en `sort out`, chips `[[sort], [out]]`, distractorsEn `[set out, sit out]`, 나머지 그대로.
44. `w-away` ko '바로'는 `right away`의 뜻이고 cue에 영어 'right'. 태그된 문장은 13.4 하나 → 13.4 `words`에서 빼고 **word-remove**(상황 13은 단어가 넉넉함).
45. `w-catch` → A-3에서 word-remove. `w-moment` → A-10에서 word-remove.
46. `w-ever` ko '예전에' — "Have you ever had…"의 ever는 '한 번이라도'. → ko `한 번이라도`, distractorsKo `[요즘 들어, 방금 전에]`.
47. `w-actively` ko '활동적으로' — 사람의 성격·움직임을 말하는 말이라 "actively bleeding"과 안 맞습니다. → ko `활발히`(문장 ko '활동성 출혈'과 통함). distractorsKo 그대로.
48. `w-through` ko '통해' — 20.6 "support you … through it"은 '그 과정 내내'. → ko `내내`, distractorsKo `[~하기 전에, ~한 뒤에]`.
49. `w-steady` ko '꾸준한'(저작자가 '안정적인'에서 바꿈) — 혈압·수치에 쓰는 steady는 '변동 없는'이지 '꾸준한'(끈기)이 아닙니다. → ko `변동 없는`(w-stable '안정된'과도 갈림).
50. (선택) `w-birth` ko '생일' → `출생`(date of birth = 생년월일; '생일'은 birthday). `w-way` ko '길' → 구 헤드워드 `on the way`(오는 중인), chips `[["on"], [the], [way]]`, distractorsEn `[in the way, by the way]`.

### E. keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| 문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 6.0 | `Yes, let's start the octreotide drip now.` | 간호사가 약 시작을 정하는 어조, `as ordered` 없음(같은 상황 6.1에는 있음) | `Yes, I'll start the octreotide drip as ordered.` (words에 w-order 추가) — 장면 첫마디("do you want … started?")에 더 맞추려면 `Yes, the order's in, so I'll start the octreotide drip now.` | **바꿈** |
| 15.0 | `Activate MTP and get the cooler now.` | 장면 첫마디가 동료의 "I'm activating MTP"인데 다시 명령형으로 발동을 지시 — 발동은 보통 의사(또는 지침의 지정자) | `MTP is activated — I'll get the cooler now.` (words 그대로) | **바꿈** |
| 18.0 | `Open the fluids wide and call for blood now.` | 처방 없이 정질액을 최대로 여는 명령형. 위장관 출혈은 혈액 우선, 정질액 과다는 해로움(정맥류면 더) | `Let's run the ordered fluids and call for blood now.` (w-open·w-wide는 18.3도 고치면 태그가 없어져 word-remove) | 바꾸면 더 안전(유지도 가능 — 소생 프로토콜 아래 개방은 흔함) |
| 8.0 | `For a stable bleed, we usually hold to the restrictive target.` | 간호사 단독 결정처럼 들릴 수 있음 | `For a stable bleed, we follow the ordered restrictive target.` | **유지** — 동료에게 하는 팀 관행 설명이고 `usually`가 붙음. 단 B-16으로 why에 기준을 보충 |
| 12.0 | `Bright red blood usually points to lower down in the gut.` | 대량 상부 출혈도 선홍색일 수 있음 | `Bright red blood often comes from lower in the gut, but not always.` | **유지** — `usually`가 단정을 막음 |
| 10.2 | `We want him corrected before the procedure.` | 지침은 교정 때문에 내시경을 늦추지 말라고 함 | `We want him corrected as much as possible before the procedure.` | **유지** — 장면 전제(시술 전 교정 협력)와 맞고 `want`라 지연 결정이 아님 |

keyPhrase **ko만** 고칠 것(결정 11 범위 — changes에 `fields: [ko]`, 그 문장을 예문으로 쓰는 단어 exKo도 같은 ko로, distractorsKo 둘도 새 ko 틀로):
51. 2.2 `Let's confirm consent and the armband now.` ko `동의서랑 팔찌 확인하고 이제 시작하죠` — en에 없는 '시작'을 덧붙임. → `지금 동의서랑 팔찌를 확인하죠.` (딸린 것: `w-confirm`·`w-consent`·`w-armband` exKo)
52. (선택) 9.2 ko `주입이 흐르는 동안 금식을 유지하죠` → `주입하는 동안 금식을 유지하죠.`

keyPhrase chunks 구 경계 — **보고만**(en·chunks 고치지 않음): 0.4 `or want to / vomit again`, 3.0 `when the blood / count drops`, 3.1 `and your lab / trends`, 7.1 `and the pre-procedure / checklist done`, 8.0 `to the restrictive / target`, 8.1 `signs of ongoing / bleeding`, 9.0 `at the ordered / rate`, 12.1 `where it's coming / from`, 12.2 `while we sort / this out`, 13.0 `, labs, and any new / bleeding`, 13.1 `or feels / faint`.

## 태그 정리 확인 (V15)

위에서 문장 태그를 빼거나 지우는 단어(w-stay·w-sure·w-away·w-catch·w-moment·w-stop·w-stomach·w-open·w-wide·w-look·w-safe·w-liver)를 뉘앙스 `words:`와 스크립트로 대조했습니다. 걸리는 것은 상황 17 pair의 w-liver뿐이고 B-24에서 뺍니다. 상황 4 context의 w-stomach는 4.x 문장에 남고, 상황 13 slider의 w-tiredness·w-normal은 새 13.5에 남습니다 — 깨지는 것 없음.

## 종합

고칠 것 52건(그중 안전 6건: A-1~6). keyPhrase 결정 6건(바꿈 권고 2·약한 권고 1·유지 3). 뉘앙스 why·notes는 굵은 정맥로 둘·형·교차시험·두 사람 확인·MTP·PPI/옥트레오타이드/예방 항생제 "처방대로"·내시경 전 기도 보호를 대체로 바르게 다룹니다. 위 안전 6건과 B-16~25, C-29의 ★, D-40~49를 반영하면 내보내도 됩니다.
