# icu-status-epilepticus — A 검토 (v45 1~7 + 기계적 전수 확인 + context 핸드오프 모양·swap ko)

대상: `icu-status-epilepticus.yaml`(A·B 합친 파일, `pre-fix`와 같음). 비교: base, changes(72건), in-…json, notes-A·B.
단어 243개·문장 105개·뉘앙스 45문항(slider 20·pair 1·context 21·swap 3)을 스크립트(`rev_icu-status-epilepticus_A.py`)로
전부 뽑아 표로 놓고 판정했습니다(pair 전 조합, chunks 전부, swap 이어 읽기 전부, distractorsEn 품사 전부, decoyChips 전부,
context 세 장면 `word` 포함 여부, 길이 1.25배·3자 — 위반 0건).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 철자·소리가 닮은 오답이 대부분. 정답으로도 맞는 오답 1건(clear↔clean), 품사가 다른 오답이 많음(★ 23건) |
| 2 | distractorsKo·길이 | 4 | 길이 위반 0. 정답 단어의 다른 뜻이 오답에 든 것 2건(sign '서명', agent '보호자'), 낙인 용어 '간질' 1건 |
| 3 | cue | 4 | 정답 노출 없음. 품사·장면이 ko와 어긋난 cue 4건(thank·trigger·target·clear) |
| 4 | chips/decoyChips | 4 | 형태소 분절은 좋음. 술 `ale`, 술 속어 `wrecked`, 죽음 동음 `dye`, 속어 `bust`·`troll` |
| 5 | 뉘앙스 사실 정확성 | 4 | 5분 기준·옆으로 눕히기·입에 아무것도 넣지 않기·NCSE와 지속 뇌파·혈당·마취성 주입 전 기도 확보 모두 정확. 틀린 것: 저나트륨 발작 교정을 "천천히"라고만 함(안전), 1차 벤조 반복 단계 생략, 간호사가 가족에게 예후를 단정 |
| 6 | 뉘앙스 설계 | 3 | pair 정답 하나(선택 1건만 경계). **slider 20개 중 12개가 약함→강함 순서가 아님**(정답이 끝에 있지만 논리상 가운데, 양 끝이 둘 다 소극 등), S5 의식 수준 순서 틀림. swap·context는 좋음 |
| 7 | 결정 11(v44 단어·문장) | 4 | 변경 72건은 타당(아래). `get`(쉬움·ko 불일치), `open`·`pressure` 두 뜻 태그 정리 필요, 문장 3개(절대 약속·가족 가치 기준·통증 단정) |

## 저작자 A의 변경 판정 (단어 수정 22·삭제 18, 문장 words 32)

**과하지 않고 대부분 옳습니다. 되돌릴 것은 없습니다.**
- 쉬운 말 삭제 18개(time·know·body·head·mouth·teeth·now·percent·come·pain·minute·again·tongue·fine·something·family·need·long)는 모두 타당.
- ko 가르기(correctly↔exactly, check↔confirm, stay↔hold, medication↔drug, sugar↔glucose, set off↔trigger 등) 타당.
- 뜻이 다른 쓰임에서 태그만 뺀 것(8.1 trigger 명사, 18.0 cause 동사, 20.3 hard to hear, 11.4 side) 옳음.
- **헤드워드 바꿈 3건 — 모두 승인.** `come back`(4.3·11.3 모두 "결과가 나오다" 구), `side effect`(11.4, ko '부작용'으로 한 뜻),
  `vitals`(2.4 명사 "Vitals are stable"). ipa(/kʌm ˈbæk/, /ˈsaɪd ɪˌfɛkt/, /ˈvaɪtlz/)·example·chips·오답도 맞게 바뀜.
- 남은 흠은 W1~W3(아래).

## 저작자가 짚은 문장·단어 판정

| 대상 | 판정 |
|---|---|
| 20.3 "I won't hide anything from you." (KP 아님) | **타당 — 고침(S1)**. 절대 약속이고(환자 본인 의사·개인정보 제한, 아직 모르는 것), 20.0 KP "I'll be honest with you"와 뜻이 겹칩니다. 지킬 수 있는 약속(새 소식을 계속 알림)으로 |
| 0.4 5분 기준 없음 | 문장 문제 아님 — 동의. S0 slider가 5분·도움 요청·처방된 1차 약으로 정확히 보강함 |
| w-open ('열린' / 17.0 "Open the airway" 명령형) | **고침(W2)** — 17.0에서 태그만 뺌(KP라 문장은 그대로). 1.2·1.4는 형용사라 ko '열린'이 맞음 |
| w-pressure (혈압 / 18.0 "raised pressure"·18.3 "rising pressure in his brain") | **고침(W3)** — 18.0·18.3은 뇌압이라 ko '혈압'이 틀림. 두 문장에서 태그만 뺌(나머지 9문장은 모두 혈압) |
| w-still ('아직도' / '가만히') | **그대로 둠**. 태그된 7.4·17.3 모두 "still seizing"(아직도)이 있어 ko가 맞음. 7.4의 "looks still"은 같은 문장 안의 다른 쓰임일 뿐 |
| come back·side effect·vitals | 위에서 승인 |
| B 메모 | 문장 수정 요청 없음 — 판단할 것 없음 |

## 사실 오류·심각한 문제

1. **[안전] S4 context(correct) fix·why** — fix "we're **slowly** bringing it back to normal"과 why "나트륨은 천천히 맞춘다는 점도 사실"이,
   장면이 말하는 고장성 식염수 볼루스와 어긋납니다. 발작을 일으킨 심한 저나트륨은 처방에 따라 **처음에 빠르게 조금(몇 mEq/L) 올려** 발작을
   멈추고, 그 뒤 하루 상승 폭을 제한합니다. "천천히"만 가르치면 볼루스를 늦추거나 잘못된 처치로 오해합니다(N1).
2. **S6 slider cue·why** — "첫 벤조디아제핀 뒤에도 발작하면 바로 2차 약"은 1차 단계(벤조디아제핀 충분 용량, 필요하면 한 번 반복)를 건너뜁니다(AES 2016). (N2)
3. **S20 context 어색한 장면** — 간호사가 가족에게 "his prognosis is poor and meaningful recovery is unlikely"라고 예후를 단정합니다. 예후 설명은 의사 몫이고,
   fix와 뜻도 달라 "같은 뜻·안 맞는 자리" 모양이 아닙니다(N3, 업무 범위).
4. **20.4 "whatever matters most to your family"** — 목표 설정 대화의 기준은 환자의 가치(20.2 KP "what matters most to him")인데, 가족이 원하는 것은
   무엇이든 지지하겠다고 약속합니다(S2). B의 why "가족의 가치가 기준"도 같은 오류.
5. **5.3 "he wasn't in pain during the seizure"** — 간호사가 확인할 수 없는 단정(S3).
6. **slider 12개 순서** — 약함→강함이 아니어서 저울 문항이 되지 않습니다(N4~N15). S5는 의식 수준 순서 자체가 틀림(confused는 drowsy보다 무거운 단계가 아님).

## 고칠 것

문장 en을 고치면 그 문장의 v46 필드(`why`·`decoy`·`distractorsKo` 둘·`blank`·`tag`·`icon`)를 새 문장에 맞춰 **새로 쓰고**(B 몫),
그 문장을 `example`로 쓰는 단어의 `example`·`exKo`도 바꿉니다. 바꾼 것은 전부 `changes-icu-status-epilepticus.yaml`에 적습니다.

### 문장 (KP 아님 — en·ko·chunks 고침)

- **S1 [약속] 지속 SE 예후·목표 소통 #3** · 절대 약속 → 지킬 수 있는 약속:
  en `I know this is hard to hear, and we'll keep you updated as we learn more.`
  ko `듣기 힘드시다는 거 알아요. 새로 알게 되는 것이 있으면 계속 알려 드릴게요.`
  chunks `["I know this", "is hard to hear,", "and we'll keep you updated", "as we learn more", "."]`
  words `[w-hear, w-update]` — w-hide는 이 문장에서만 쓰이므로 word-remove. **word-add w-update**: en `update`, ipa `/ʌpˈdeɪt/`, ko `새 소식을 알리다`,
  icon `speech`, tag `소통·팀`, example·exKo = 새 문장, cue `상태가 바뀔 때마다 가족에게 바뀐 내용을 전해 주는 동사`, distractorsEn `[upgrade, uphold]`,
  distractorsKo `[미뤄 두다, 감춰 두다]`, chips `[[up, date]]`, decoyChips `[op, data]`. w-hear example·exKo도 새 문장으로.
  v46 새로(why는 "keep you updated"가 결과 대신 소통을 약속한다는 점; distractorsKo 둘은 새 ko 틀로).
- **S2 [관행] 지속 SE 예후·목표 소통 #4** · 결정의 기준은 환자의 가치 →
  en `We'll support your family as we focus on what matters most to him.`
  ko `환자분께 가장 중요한 것에 집중하면서, 가족분들도 저희가 도와 드릴게요.`
  chunks `["We'll support your family", "as we focus", "on what matters most", "to him", "."]`
  words `[w-support, w-matter, w-most]` — w-whatever는 이 문장에서만 쓰이므로 word-remove(S20 서로 다른 단어는 그래도 15개 이상).
  v46 새로(why의 "가족의 가치가 기준" 삭제 → "기준은 환자(him)의 가치, 가족은 지지 대상").
- **S3 [단정] 발작 후 상태 사정 #3** · 확인할 수 없는 "통증이 없었다" →
  en `This is normal, and he most likely wasn't aware of anything during the seizure.`
  ko `정상적인 거예요. 발작하는 동안에는 아마 아무것도 의식하지 못하셨을 거예요.`
  chunks `["This is normal,", "and he most likely", "wasn't aware of anything", "during the seizure", "."]`
  words `[w-normal, w-anything, w-during, w-seizure]`. w-during example·exKo 새 문장으로. v46 새로(blank `pain` 없어짐 → 예: `aware`).

### chunks (KP 아님 — en·ko 그대로, chunks만)

- **C1** 0.4 `and how / his body moves` → `["I'll write down", "how long it lasts", "and how his body moves", "."]`
- **C2** 1.4 `anything between / his teeth` → `["I'll keep", "the airway open", "and never force anything", "between his teeth", "."]`
- **C3** 3.3 `and holding / steady` → `["His oxygen saturation", "is ninety-two percent", "and holding steady", "."]`
- **C4** 11.4 `No new / side effects` → `["No new side effects", "since we adjusted", "the dose", "."]`
- **C5** 12.3 `but that doesn't / rule out` → `["He looks calm,", "but that doesn't rule out", "a hidden seizure", "."]`
- **C6** 17.3 `while he's / still seizing` → `["His heart rate", "is dropping fast", "while he's still seizing", "."]`
- (선택) 2.4 `Vitals are / stable;` → `["Vitals are stable;", "no respiratory depression", "so far", "."]`
- chunks를 바꾼 문장은 B의 `decoy`가 새 청크 자리를 대신해 맞는 영어가 되지 않는지 다시 확인.

### keyPhrase 문장 — ko만 고침

- **K1** 비경련성 SE 인지 #1 · ko "응급 EEG를 받죠"는 동료에게 하는 말로 어색(검사를 받는 쪽은 환자) →
  ko `뇌 활동을 확인하게 응급 EEG를 하죠.` — distractorsKo 둘을 새 ko 틀에 맞춰 다시 씀.
- (선택) **K2** 뇌부종·ICP 위기 #2 · ko "영상 검사를 받고" → `영상 검사를 하고 삼투 치료를 고려하죠.`(distractorsKo 둘도).

### 뉘앙스

- **N1 [안전] 혈당·전해질 확인 · context(correct)** · 어색한 장면 en은 그대로.
  fix `His sodium is very low, so we're carefully bringing it up with a special IV fluid.`
  why `의료진끼리는 진단명과 약 이름을 그대로 써도 돼요. 가족에게는 낯선 말이 불안만 키우니, 무엇이 낮았고 어떻게 되돌리는지를 쉬운 말로 전해요. 발작을 일으킬 만큼 낮은 나트륨은 처방에 따라 고장성 식염수로 처음에 조금 빠르게 올리고, 그 뒤에는 하루에 올리는 폭을 넘지 않게 지켜봐요(너무 빨리 교정하면 삼투성 탈수초 위험).`
- **N2 [사실] 2차 항경련제 로딩 · slider** · 1차 단계 반복 생략 + 순서 →
  cue `Colleague: "He's still seizing after two doses of the benzodiazepine."`
  scale `[wait to see if it stops by itself, move on to the ordered second drug, keep repeating benzos with no limit]`, answerAt `1`
  why `벤조디아제핀을 충분히 주고(보통 한 번 반복)도 발작이 계속되면 기다리지 않고 처방된 2차 항경련제(예: levetiracetam)로 넘어가요. 저절로 멈추길 기다리거나, 벤조디아제핀만 끝없이 되풀이하지 않아요(호흡억제 위험).`
- **N3 [업무 범위] 지속 SE 예후·목표 소통 · context(honest)** · 같은 뜻·안 맞는 말 모양으로 →
  scene3 en `Honestly, his status epilepticus is refractory and his prognosis is guarded.`
  fix `I want to be honest: this is very serious. The doctors will sit down with you to talk about what it means, and we'll stay with you.`
  why `솔직하게 말하는 것은 중요하지만, 가족에게 refractory나 guarded prognosis 같은 말은 낯설고 차갑게 들려요. 예후는 의사가 가족과 함께 설명하고, 간호사는 심각하다는 사실과 곁에 있겠다는 말을 쉬운 말로 전해요.`

**slider 순서 (약함→강함 = 대응의 세기: 소극 → 알맞음 → 지나침/범위 밖)** — scale·answerAt만 바꾸고 why는 그대로(따로 적은 것만 고침).
바꾼 뒤 정답 칸 분포는 0:3·1:11·2:6(55%)라 W20(70%) 안쪽입니다. 반영 뒤 검사기로 W20 다시 확인.

- **N4 발작 중 기도·안전 확보** · cloth·spoon 뒤에 nothing(입에 넣는 정도가 단조롭지 않음) →
  `[nothing at all in his mouth, a soft cloth between his teeth, a spoon across his tongue]`, answerAt `0`
- **N5 벤조디아제핀 초기 투여 보조** · 셋째 "자리를 뜬다"는 더 센 대응이 아님 → 지나친 대응으로 바꿈:
  `[write it down and recheck it again much later, stay, support his breathing, call for help, give flumazenil on your own to reverse it]`, answerAt `1`
  why 끝에 덧붙임 `플루마제닐은 벤조디아제핀으로 발작을 누르고 있는 환자에게 발작을 다시 일으킬 수 있어 간호사가 혼자 주지 않아요.`
- **N6 [사실] 발작 후 상태 사정** · 의식 수준 저울에서 confused는 drowsy보다 무거운 단계가 아님(방향·내용의 문제) →
  scale `[drowsy, stuporous, unresponsive]`, answerAt `0`, words `[w-drowsy]`
  why `이름을 부르면 눈을 떴다가 다시 잠드는 건 졸린(drowsy) 상태예요. 세게 자극해야 잠깐 반응하면 stuporous, 자극해도 반응이 없으면 unresponsive예요. 발작 후 잠시 졸린 건 흔하지만, 깨우기 점점 어려워지거나 반응이 없으면 바로 보고해요.`
- **N7 혈당·전해질 확인** · `[recheck it at the next vitals, treat the low glucose now per the order, delay the seizure drugs until it's normal]`, answerAt `1`
- **N8 지속 EEG 모니터 연계** · 확실성 저울 → `[the seizure is definitely over, the EEG will show if it continues, the seizure is definitely still going]`, answerAt `1`
- **N9 유발원인 검사·교정** · `[assume it's only the seizure, send cultures and look for an infection, stop seizure drugs until the fever is gone for good]`, answerAt `1`
- **N10 반복 발작 약물 단계화** · `[wait and see what happens next, tell the team, start the next step, double the second drug on your own now]`, answerAt `1`
- **N11 기도확보 준비·삽관 판단** · `[just keep watching him for now and chart it, call the team, ready airway equipment, try to intubate him yourself]`, answerAt `1`
- **N12 항경련제 혈중농도·부작용** · `[treat it as fine because the level is normal, report the new sleepiness to the team, raise the dose to be safe]`, answerAt `1`
- **N13 원인별 치료 연계** · 가능성 저울 → `[no there is no chance of that, we won't know until the imaging is read, yes it is most likely going to be a tumor]`, answerAt `1`
- **N14 발작 중 심한 저산소·서맥 위기** · 소극 둘이 양 끝 → `[wait for the seizure to stop on its own first, just keep watching the heart rate drop, open airway, bag with oxygen, call for help]`, answerAt `2`
- **N15 발작 후 뇌부종·ICP 위기** · `[keep his head flat so he can rest, recheck at the next routine vitals, report it to neuro right now]`, answerAt `2`
- **N16 항경련 마취 중 혈역학 붕괴 · slider** · 보기 영어 "faster still" 어색 → `turn the infusion up to stop the seizure faster`
  (순서는 강→약으로 단조로워 둬도 됨; 맞추려면 뒤집고 answerAt 1 그대로).
- **N17 발작 후 상태 사정 · swap ko** · "그는"이 부자연스러움 → `한동안 졸리고 혼란스러워하는 건 정상이에요`
- **N18 기도확보 준비·삽관 판단 · swap ko** · "그가 … 숨 쉬도록"은 원문(to keep him safe)에 없는 말 → `안전을 위해 호흡관이 필요할 수 있어요`
- (선택) **N19 초불응성 SE 관리 · pair** · `deepen` + `suppression`("deepen the suppression")도 말이 될 여지가 있음 →
  셋째 짝을 `[deepen, the sedation]`에서 `[deepened, the sedation]`처럼 바꿔도 남으므로, 최소 수정은 why 끝에 `suppression은 burst와 붙어 한 패턴 이름이 돼요.`를 더하는 것. 우선순위 낮음.

### 단어 (결정 11 — 태그·ko·cue·오답)

- **W1 w-get** · 너무 쉬운 말이고 ko '받다'가 네 쓰임(get an EEG=하다, get … ordered=처방받다, I've got the bag ready=준비해 두다, get imaging=하다) 어디에도 맞지 않음 →
  12.1·12.4·17.4·18.2 words에서 빼고 word-remove(각 상황 서로 다른 단어 17개 이상 남음, nuance `words`에 없음).
- **W2 w-open** · 17.0 words에서 w-open을 빼고, S17 slider `words`에서도 w-open을 뺌.
- **W3 w-pressure** · 18.0·18.3 words에서 w-pressure를 뺌(뇌압).
- **W4 w-clear** · 1.1 "keep the area clear"는 형용사인데 ko·cue가 동사, 오답 `clean`은 "치우다"로도 정답이 됨 →
  ko `(물건 없이) 비워 둔`, cue `침대 둘레에 부딪힐 만한 물건이 하나도 없이 비워진 상태`, distractorsEn `[close, clever]`, distractorsKo `[붐비는, 어질러진]`.
- **W5 w-thank cue** · "전화를 걸어 준"은 장면(침대 곁에서 불러 준 보호자)과 다름 → `발작을 보자마자 간호사를 불러 준 보호자에게 고마움을 전하는 동사`.
- **W6 w-trigger cue** · "방아쇠 같은 계기"는 명사 → `발작 같은 일이 방아쇠를 당기듯 터지게 만드는 동사`.
- **W7 w-target cue** · "겨냥해 정해 둔 지점"은 명사 → `치료가 이르러야 할 수준을 겨냥해 정하는 동사`.
- (선택) w-anesthesia ko '마취' → `마취과(마취)`(10.4 "calling anesthesia"는 진료과).
- (선택) 저자가 come back·side effect를 구로 바꾼 것과 같은 결로 `make`→`make sure`, `far`→`so far`, `case`→`in case`, `while`→`for a while`
  (cue가 이미 "___ sure"·"so ___"·"in ___"·"for a ___"로 구를 가르침). id 유지.
- (선택) 두 품사로 쓰이는 헤드워드 ko: w-help(0.1 동사·17.1 "call for help" 명사) `돕다(도움)`, w-load(6.0 동사·6.2 명사) `로딩(하다)`, w-bag(17.0 동사·17.4 명사) `백(으로 환기하다)`.

### distractorsKo — 정답 단어의 다른 뜻·낙인 용어

- **DK1 w-sign** · 오답 `서명`은 sign의 실제 뜻(서명하다/표지) → `원인`.
- **DK2 w-agent** · 오답 `보호자` — 미국 병원에서 health care agent는 의료 대리인(보호자)이라 정답이 둘 → `용량`.
- **DK3 w-stroke** · 오답 `간질`은 2014년에 '뇌전증'으로 바뀐 낙인 용어(이 주제가 바로 뇌전증 지속 상태) → `뇌전증`.

### distractorsEn — 정답으로도 맞는 오답

| id | 정답 | 문제 오답 | 이유 | 바꿀 말 |
|---|---|---|---|---|
| w-clear | clear | clean | ko·cue "치우다"에 그대로 맞음 | close (W4) |

### distractorsEn — 품사가 다른 것 (전수, ★ = 꼭 바꿀 것)

| id | 정답(품사·문장 기준) | 오답(품사) | 바꿀 말 |
|---|---|---|---|
| ★ w-thank | thank (동) | thick (형) | thaw |
| ★ w-steady | steady (형) | study (동·명) | speedy |
| ★ w-stat | stat (형·부, "a stat glucose") | stack·stair (명) | static, stale |
| ★ w-trigger | trigger (동) | tiger (명) | trickle |
| ★ w-while | while (명, for a while) | white (형) | whiff |
| ★ w-since | since (접·전) | sense·science (명) | until, unless |
| ★ w-first | first (형) | fist (명) | firm |
| ★ w-together | together (부) | tougher (형) | forever |
| ★ w-fever | fever (명) | fewer (형) | favor |
| ★ w-next | next (형) | text·nest (명) | neat, near |
| ★ w-urgent | urgent (형) | agent (명) | urban |
| ★ w-flag | flag (동) | flat (형) | flash |
| ★ w-calm | calm (형) | clam·palm (명) | clammy, balmy |
| ★ w-identify | identify (동) | identity (명) | intensify (identity는 decoyChips 쪽 짝) |
| ★ w-stroke | stroke (명) | stoke (동)·struck (동 과거) | strobe, stripe |
| ★ w-imaging | imaging (명) | imagine (동)·imaginary (형) | aging, imprint |
| ★ w-target | target (동) | market (명) | barter |
| ★ w-third | third (형) | thirst·throat (명) | thirsty, thorough |
| ★ w-fluid | fluid (명) | fluent (형) | fluke |
| ★ w-serious | serious (형) | series (명) | curious |
| ★ w-honest | honest (형) | honor (명) | hollow |
| ★ w-secure | secure (동) | second·secret (형·명) | sedate, seclude |
| ★ w-still | still (부) | stall·steal (동) | seldom, steadily |
| w-clear | clear (형) | clamp (명·동) | W4로 해결 |
| w-stepwise | stepwise (형) | likewise (부) | streetwise |
| w-order | order (동) | border (명) | obey |
| w-bite | bite (ko 동) | bike (명) | bide |
| w-heart | heart (명) | heard (동) | heat |
| w-exam | exam (명) | exact (형) | exile |
| w-might | might (조동) | mind (동·명) | should (may는 동의어라 ✕) |
| w-hear | hear (동) | hair (명) | heed |
| w-fast | fast (부) | vast·faint (형) | 둬도 됨(fast도 형용사) |
| w-anything | anything (대) | anywhere (부) | 둬도 됨 |
| w-get | get (동) | gut (명) | W1로 단어 삭제 |

나머지 오답은 같은 품사입니다.

### decoyChips (비속어·불쾌한·술·장례 조각 전수 확인 — 약 480개)

- **D1** w-level `ale`(맥주) → `eel`.
- **D2** w-correctly `wrecked`(만취 속어) → `rocked`.
- **D3** w-immediately `dye`(die와 같은 소리, 중환자 장면) → `lay`.
- **D4** w-burst `bust`(속어: 가슴·체포) → `burnt`.
- **D5** w-control `troll`(모욕 속어) → `toll`.
- (선택) w-rhythm·w-serious `rye`(호밀 위스키) → `ray`·`sear`; w-since `sins` → `sinks`; w-far `fat`(외모) → `fan`; w-show `shot`(술잔·총) → `shoe`.
- 그 밖에 장례 관련(coffin·urn·grave·wake 등) 조각 없음. lie·tear·mad·rude·kid 등은 일상어로 둠.

## pair·swap·context 전수

- **pair 1문항**(초불응성: burst/third/deepen + decoy stable): 3×4 결합 중 정답 말고 성립하는 것은 `deepen suppression`(경계, N19 선택)뿐. decoy `stable`은 어느 왼쪽에도 붙지 않음.
- **swap 3문항**(S5 postictal, S10 intubation, S12 nonconvulsive): 선택지마다 이어 읽으면 문법이 모두 맞고 정답 하나. ko는 S12 정확, S5·S10은 N17·N18.
- **context 21문항**: `word`가 세 장면 en 모두에 있음(15번 titrating은 어형). 어색한 장면은 20개가 같은 뜻을 가족에게 임상어·약어로 말한 곳 — 핸드오프 모양에 맞음.
  예외는 S20(N3: 뜻이 다르고 예후 단정). S4는 모양은 맞지만 fix·why가 사실 오류(N1). word `ko`는 21개 모두 정확.
- **slider 20문항**: cue로 정답이 하나인 것은 20개 모두. 순서가 단조로운 것은 S0·S3·S12·S13·S15·S19(강→약)·S20, 나머지 12개는 N4~N15.

## 뉘앙스 why·notes — 미국 ICU 경련 지속 상태 관행 대조

| 관행 | 해당 문항 | 판정 |
|---|---|---|
| 시작 시각 기록 | S0 context(note) | 맞음 |
| 5분 기준 | S0 slider | 맞음("5분 넘으면 저절로 멈추길 기다리지 않음") |
| 1차 벤조·2차는 처방·프로토콜대로 | S0·S2·S6·S9 slider | S0·S9 맞음, S6은 반복 단계 빠짐(N2) |
| 옆으로 눕히기·입에 아무것도 넣지 않기 | S1 slider·context | 맞음("혀를 삼킬 위험은 없다"도 정확) |
| NCSE와 지속 뇌파 | S7·S12 slider, S7 context, S12 swap | 맞음 |
| 혈당 확인 | S4 slider | 맞음. 전해질 교정 속도는 N1 |
| 마취성 주입 전 기도 확보 | S15 slider | 맞음 |
| 그 밖에 | S10(간호사 단독 삽관 ✕), S11·S19(임의 증량 ✕), S18(머리 올림), S20(결과 장담 ✕) | 맞음 |

## 사용자 결정 필요 — keyPhrase en (고치지 않음)

| 상황 #문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 항경련 마취 중 혈역학 붕괴 #0 | Start a pressor and give fluid to support his pressure. | 간호사가 동료에게 승압제 시작을 지시하는 말로 읽힘(업무 범위). 같은 상황 slider why는 "처방대로" | Let's start the ordered pressor and give fluid to support his pressure. | **바꿈**(약) |
| 초불응성 SE 관리 #1 | Let's keep his pressure supported as we deepen the infusion. | "deepen the infusion"은 어색한 영어(깊게 하는 것은 진정) | Let's keep his pressure supported as we deepen the sedation. | **바꿈**(약). 바꾸면 KP 아닌 19.3 "deepened the infusion"과 S19 slider cue·context 장면·S16 context 장면도 `sedation`/`increased the infusion`으로 맞춤 |
| 혈당·전해질 확인 #2 | If we find a cause, we correct it immediately. | 나트륨은 '즉시 다' 교정하지 않음 | If we find a cause, we start correcting it right away. | **유지**(시작을 서두른다는 뜻으로 읽힘, N1 why가 보완) |
| 초불응성 SE 관리 #0 | We add another agent and target burst suppression on EEG. | 목표(발작 억제 vs burst suppression)는 기관마다 다름 | — | **유지**(pair why가 "처방에 따라 … 삼기도"로 단서) |
| 항경련제 혈중농도·부작용 #0 | Let's check his drug levels to confirm they're therapeutic. | levetiracetam은 보통 농도를 재지 않음(phenytoin·valproate는 잼) | — | **유지**(약 이름을 말하지 않음) |
| 벤조디아제핀 초기 투여 보조 #2 (chunks) | I'll watch / his breathing closely / after we / give it | 절을 끊음 | chunks `["I'll watch", "his breathing closely", "after we give it", "."]` | 바꿈 |
| 활력·산소 감시 #2 (chunks) | Let's keep suction / and airway / equipment ready | 복합명사 airway equipment를 끊음 | `["Let's keep", "suction and airway equipment", "ready", "."]` | 바꿈 |
| 2차 항경련제 로딩 #1 (chunks) | … / and infusion / rate | infusion rate를 끊음 | `["Let's confirm", "the weight-based dose", "and infusion rate", "."]` | 바꿈 |
| 지속 EEG 모니터 연계 #1 (chunks) | … / those hidden / seizures | 명사구를 끊음 | `["Continuous EEG", "lets us catch", "those hidden seizures", "."]` | 바꿈 |
| 불응성 SE 마취약 주입 위기 #1 (chunks) | … / and close / hemodynamic monitoring | 명사구를 끊음 | `["This requires", "the airway secured", "and close hemodynamic monitoring", "."]` | 바꿈 |
| 지속 SE 예후·목표 소통 #1 (chunks) | … / might look / like | look like를 끊음 | `["The team will explain", "what recovery", "might look like", "."]` | 바꿈 |

## 종합

고칠 것 **66개**(선택 빼고) — 문장 3(S1~S3) · chunks 6(C1~C6) · KP ko 1(K1) · 뉘앙스 18(N1~N18) · 단어 7(W1~W7) ·
distractorsKo 3(DK1~DK3) · 품사 ★ 23 · decoyChips 5(D1~D5). (정답으로도 맞는 오답 clean은 W4에 포함.)
그중 **안전 1개**: N1(저나트륨 발작 교정을 "천천히"로만 가르침). 사실·관행·업무 범위로 따로 셀 것: N2(벤조 반복 단계), N3(간호사의 예후 단정), N6(의식 수준 순서), S1(절대 약속), S2(가족 가치 기준), S3(통증 단정).
위 목록을 반영하면 내보내도 됩니다. keyPhrase 결정은 승압제 #0·deepen the infusion #1을 바꾸길(약하게) 권하고, 나트륨 #2는 유지, chunks 6건은 바꾸길 권합니다.
