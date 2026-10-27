# fix-icu-pain-nonverbal-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번)

대상: `icu-pain-nonverbal.yaml`(A·B 합친 파일, 단어 212 · 상황 21 · 문장 121). 비교: base·changes·in·notes A/B.
뉘앙스: slider 20 · pair 4 · context 19 · swap 2 · reel 0.
스크립트로 전부 뽑아 본 것: 단어 212개의 cue·오답·조각 표, 길이 규칙(위반 0), cue에 정답·어간이 든 것(0), 조각·decoyChips 비속어 목록 대조,
pair 4개의 왼쪽 × (오른쪽 전부+decoy) 결합 전부, swap 2개의 `before[0]+선택지+before[2]` 전부, 문장 121개의 chunks를 `/`로 이은 것,
context 19개의 핸드오프 모양(`word`·`ko`·장면 3·`ok:false` 1개·`fix`·`word`가 세 장면 `en`에 다 있음 — `titrate`만 `titrating` 활용형으로 들어 있고 문제없음).

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 소리·철자가 닮은 오답은 좋음. 품사가 다른 오답이 약 60개(아래 표). `narcotic`·`neurologic`은 정답으로 읽힐 여지 |
| 2 distractorsKo·길이 | 4 | 길이 위반 0, 은행 안 ko 중복 0(drug·little·few를 changes에서 가른 것 타당). 정답 둘인 오답 뜻은 못 찾음 |
| 3 cue | 4 | 정답 노출 0. 다만 v44 `ko`에 `(CPOT)`·`(BPS)`·`(RASS)`·`(CAM-ICU)`가 붙어 영어 고르기에서 답이 보임(D 선택 항목) |
| 4 chips/decoyChips | 4 | 조각은 대체로 형태소 단위. 불쾌한 decoy 몇 개(`fat`·`sow`·`junk`·`hemp`·`fool`×2·`witch`), `minophen`·`nog` 조각이 형태소가 아님 |
| 5 뉘앙스 사실 | 3 | CPOT 차트 장면의 점수 합이 틀림, CPOT를 강도(mild/moderate/severe)로 읽게 함, RASS 단서 2곳이 두 점수 사이에 걸침. 문장 쪽은 처방·평가 없는 투약 약속 등 안전 4건 |
| 6 뉘앙스 설계 | 4 | pair 4개 모두 정답 하나(결합 전부 확인). swap 문법 이상 없음. slider 1개가 서로 다른 축(각성·인지)을 한 줄에 놓음 |
| 7 결정 11 | 4 | changes의 ko 가르기·활용형 헤드워드·쉬운 단어 제거는 타당. `w-time`(동사 '시간을 맞추다')은 되살릴 것, `little`이 `less`에만 쓰임, `rule`·`break`은 구동사 헤드워드여야 함 |

## 사실 오류·심각한 문제

1. **[안전] 급성 심한 통증 위기 #4** `I'm giving him something for pain right now, before we do anything else.` — 갑자기 CPOT가 최고점인 장면(허혈·급성 복증 의심)에서 사정·의사 호출보다 투약을 앞세우고, 처방 조건도 없습니다. 진통을 미루지 않는 것은 맞지만 "다른 무엇보다 먼저"는 틀린 우선순위입니다.
2. **[안전] 아편 유발 호흡억제 예방 #5** `I'll reverse it with naloxone the moment I see depression.` — 호흡억제의 첫 대응은 자극·아편 중단·환기 지원이고, 날록손은 프로토콜·처방대로 **소량 적정**합니다(한 번에 완전히 역전하면 통증 위기·금단·폐부종). "보이는 순간 역전"은 지킬 수 없고 틀린 약속입니다.
3. **[안전] 임종기 통증·호흡곤란 완화 #5** `We'll keep him calm and free of pain the whole time.` — 임종기 가족에게 하는 **보장**입니다. 지킬 수 없는 약속입니다(같은 상황 keyPhrase #0은 "목표" 진술이라 결이 다름).
4. **[안전] 투여 후 통증 재평가 #1** `It's been thirty minutes, so his level should be near peak now.` — 최고 효과 시점은 약·경로마다 다릅니다(정맥 펜타닐 수 분, 정맥 모르핀·하이드로모르폰 10~20분, 경구 60분 안팎). 30분이 "최고 농도 근처"라는 일반 규칙처럼 읽힙니다.
5. **[안전] CPOT 통증 사정 context 차트 장면** `CPOT score 4 at rest: grimacing, tense, fighting the vent.` — CPOT 점수로 grimacing 2 + tense 1 + fighting the ventilator 2 = **최소 5점**입니다. 척도 학습 장면에서 합이 틀립니다.
6. **[범위] 진통제 부작용 급변 #5** `Let's switch to a different opioid and watch his mental status.` — 아편유사제 교체(rotation)는 처방자 결정입니다. 같은 상황 keyPhrase #4가 "may need to"로 열어 둔 것을 간호사가 정해 버립니다.

## 고칠 것

[안전]·[범위]를 붙인 것이 안전 항목입니다. 문장을 새로 쓰면 **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo·blank)를 전부 새로 쓰고**(distractorsKo 둘은 새 ko 틀에 맞춰, 안전 시험 — 약·용량·시점·확인을 바꾸지 않게), 바뀐 `words`·단어 추가/삭제는 `changes-icu-pain-nonverbal.yaml`에 적으세요. 그 문장이 어떤 은행 단어의 `example`·`exKo`이면 그것도 새 문장으로 바꿉니다. 문장 번호는 상황 안 0부터입니다.

### A. 문장 (keyPhrase 아님)

1. **[안전] 급성 심한 통증 위기 #4** — 사정·호출보다 투약 우선, 처방 조건 없음.
   - en: `I'll give his PRN pain dose as ordered while we call the physician.`
   - ko: `의사를 부르는 동안 처방대로 필요시 진통제를 드릴게요.`
   - chunks: `I'll give / his PRN pain dose / as ordered / while we call the physician / .`
   - words: `[w-give, w-prn, w-pain, w-dose, w-physician]`
   - v46 필드 전부 새로. blank 예: `as ordered`는 정답이 둘 될 말(`as needed`)을 피하고 `PRN`을 빈칸으로 하면 `STAT`이 정답처럼 읽히니 `physician`(오답 `pharmacist`·`family`·`chaplain` — 같은 분야에서 틀린 사람)이 안전함.
   - **딸린 것(B 몫 알림):** 이 상황 order 카드가 base #4를 따라 "진통 → 호출 → 원인 확인"으로 짜였습니다(B 메모 6). 새 문장은 호출과 투약이 동시이므로 B 검토가 order 정답 순서를 다시 보도록 하세요.
2. **[안전] 아편 유발 호흡억제 예방 #5** — 보이는 순간 완전 역전.
   - en: `If depression develops, we'll reverse it with naloxone per protocol.`
   - ko: `호흡억제가 생기면 프로토콜에 따라 날록손으로 역전시켜요.`
   - chunks: `If depression develops / , we'll reverse it / with naloxone / per protocol / .`
   - words 그대로 `[w-reverse, w-naloxone, w-depression]`. v46 필드 전부 새로(why에 "날록손은 프로토콜대로 소량씩 적정 — 한 번에 다 되돌리면 통증과 금단이 함께 돌아온다").
   - **딸린 것:** `w-reverse` example·exKo를 새 문장으로.
3. **[안전] 임종기 통증·호흡곤란 완화 #5** — 지킬 수 없는 보장.
   - en: `We'll do everything we can to keep him calm and free of pain.`
   - ko: `편안하고 통증 없이 지내시도록 할 수 있는 건 다 할게요.`
   - chunks: `We'll do everything we can / to keep him / calm / and free of pain / .`
   - words: `[w-calm, w-keep, w-free, w-pain]`(w-keep 태그 추가). v46 필드 전부 새로. distractorsKo에 "내내 통증이 없을 거예요" 같은 보장을 쓰지 말 것(잘못된 안심).
4. **[안전] 투여 후 통증 재평가 #1** — 30분 = 최고 농도라는 일반화.
   - en: `It's been thirty minutes, so his IV dose should be near peak effect.`
   - ko: `30분이 지났으니 정맥으로 준 약은 지금쯤 최고 효과에 가까울 거예요.`
   - chunks: `It's been thirty minutes / , so his IV dose / should be / near peak effect / .`
   - words: `[w-dose, w-peak, w-effect]`. `w-level`은 이 문장에만 쓰였으므로 **word-remove**(changes에 적고, 기존 `w-level` ko 변경 항목은 지움). v46 필드 전부 새로(why: "정맥 아편유사제는 15~30분, 경구는 30~60분 뒤에 재평가한다 — 경로를 말해야 시점이 맞는다").
5. **금단 통증 급증 관리 #3** `A clonidine dose can smooth out the withdrawal symptoms.` — 내용(클로니딘이 아편 금단 증상을 줄임)은 사실이지만 특정 약을 간호사 말로 권하고, chunks가 구동사 `smooth / out`과 `withdrawal / symptoms`를 끊습니다.
   - en: `Let's ask the physician about clonidine for his withdrawal symptoms.`
   - ko: `금단 증상에 클로니딘을 쓸지 의사에게 물어봐요.`
   - chunks: `Let's ask / the physician / about clonidine / for his withdrawal symptoms / .`
   - words: `[w-physician, w-withdrawal, w-symptom]`(w-dose 태그 뺌 — 다른 문장에 남음). `w-symptom` example·exKo를 새 문장으로. v46 필드 전부 새로(why에 저혈압·서맥 감시 언급 가능).
6. **만성통증·내성 환자 관리 #3** `If we don't give enough, his pain and cravings will spike.` — 단정. `will` → `can`.
   - en: `If we don't give enough, his pain and cravings can spike.` / ko: `충분히 안 드리면 통증과 갈망이 급증할 수 있어요.`
   - chunks: `If we don't give enough / , his pain / and cravings / can spike / .`
   - words 그대로. `w-craving` example·exKo도 새 문장으로. v46 필드 전부 새로(blank가 `spike`면 오답에 `drop` 같은 반대 방향 대신 `settle`·`shift`처럼 같은 분야의 틀린 말).
   - (선택) 집에서 처방 아편을 쓰던 통증 환자에게 `cravings`는 중독을 전제하는 말로 들릴 수 있습니다. 바꾸려면 `his pain and withdrawal can spike`(w-craving은 word-remove).
7. **[범위] 진통제 부작용 급변 #5** — 아편 교체를 간호사가 결정.
   - en: `If we switch to a different opioid, let's watch his mental status.`
   - ko: `다른 아편유사제로 바꾸면 정신 상태를 지켜봐요.`
   - chunks: `If we switch / to a different opioid / , let's watch / his mental status / .`
   - words 그대로. `w-mental`·`w-status` example이 이 문장이면 함께. v46 필드 전부 새로.
8. **통증과 초조 감별 #1** `Being agitated doesn't always mean he's over-sedated or delirious.` — 과진정은 초조의 흔한 원인이 아니라 반대 상태라 문장의 논리가 어긋납니다(이 장면의 요점은 "초조 = 진정 부족이 아니라 통증일 수 있다").
   - en: `Being agitated doesn't always mean he needs more sedation or is delirious.`
   - ko: `초조하다고 해서 항상 진정이 더 필요하거나 섬망인 건 아니에요.`
   - chunks: `Being agitated / doesn't always mean / he needs more sedation / or is delirious / .`
   - words: `[w-mean, w-need, w-sedation, w-delirious]`. `w-oversedated`는 이 문장에만 쓰였으므로 **word-remove**(같은 상황 #4가 `w-oversedation`을 가르침). `w-delirious` example·exKo를 새 문장으로. v46 필드 전부 새로.
9. **처치 전 예방 진통 #3** chunks `before the dressing / change starts` — 복합명사 dressing change를 끊음.
   - chunks: `I'm giving you medicine now / , before / the dressing change / starts / .` (en·ko 그대로, v46 decoy가 새 청크와 겹치지 않는지 확인)
10. **만성통증·내성 환자 관리 #5** chunks `than most / patients` — 명사구를 끊음.
    - chunks: `His tolerance means / he needs / a higher baseline dose / than most patients / .`
11. **가족의 대리 통증 관찰 활용 #5** chunks `We'll keep checking / in with you` — 구동사 check in을 끊음.
    - chunks: `We'll keep / checking in with you / throughout / the shift / .`
11-2. **신경병증성 통증 인지 #1** chunks `even at high / opioid doses` — 명사구를 끊음. → `His pain / isn't improving / even at / high opioid doses / .`
11-3. **통증 조절 실패·불응 #3** chunks `or a different / opioid` — 명사구를 끊음. → `Pain service / might suggest / a nerve block / or a different opioid / .`
11-4. (경계선, 선택) 편안한 체위 #1 `so you're / more comfortable` → `so you're more comfortable`를 한 조각으로(`I'm going to reposition you / now / so you're more comfortable / .`), 처치 관련 #5 `and he did / well` → `I'll let him know / it's finished / and he did well / .`, 급성 #5 `this isn't / routine` → `Let's get the doctor / here fast / — this isn't routine / .`
12. **아편 과량 호흡억제 위기 #5** ko `날록손이 아편유사제보다 더 빨리 사라져요` — 약이 "사라진다"가 아니라 효과가 먼저 떨어진다는 말(재진정 위험의 근거).
    - ko: `자세히 지켜봐요 — 날록손 효과가 아편유사제보다 먼저 떨어져요.` distractorsKo 둘도 새 ko 틀로(날록손·아편·"먼저"는 바꾸지 말 것 — 안전 시험).

### B. 뉘앙스

13. **[안전] CPOT 통증 사정 context, 차트 장면** — 점수 합 오류(위 5번).
    - en: `CPOT score 4 at rest: grimacing, tense, coughing but tolerating the vent.` (2+1+1 = 4) — `score`가 남아 있어 핸드오프 모양 유지.
14. **처치 관련 통증 관리 slider** `why` "CPOT는 0~8점이라 7점이면 심한 통증에 가까워요… 이보다 약하면 moderate나 mild" — CPOT·BPS는 통증이 **있는지**(CPOT 3점 이상)를 가려내는 도구로 검증됐고, 점수를 mild/moderate/severe 강도로 옮기는 것은 검증되지 않았습니다(PADIS 2018). 학습자가 "CPOT 7 = severe"를 규칙으로 믿게 됩니다.
    - 고칠 방향: scale을 강도 대신 변화로 — `scale: [no change, a small rise, a big spike]`, `answerAt: 2`, why: "쉴 때 1에서 흡인 때 7로 뛰면 처치 때 통증이 크게 솟는 것이에요. CPOT는 3점 이상이면 통증이 있다고 보는 도구라 점수로 강도를 나누지는 않지만, 처치 때만 뛰면 미리 진통하는 근거가 돼요." example `His CPOT spikes during suctioning, then settles.` / exKo `흡인할 때 CPOT가 확 올랐다가 가라앉아요.`
15. **통증-진정-섬망 통합 평가 slider** cue `He opens his eyes to my voice, but only for a few seconds.` — 눈 맞춤 여부가 없어 RASS −2(눈 맞춤 10초 미만)와 −3(눈 맞춤 없이 눈만 뜸) 사이에 걸칩니다. why가 바로 이 차이로 둘을 가릅니다.
    - cue: `Nurse: "He opens his eyes and looks at me when I call him, but only for a few seconds."`
16. **금단 통증 급증 관리 slider** cue `He can't lie still and keeps shifting, but he isn't pulling at anything.` — "가만히 못 있고 계속 움직임"은 RASS +2(잦은 목적 없는 움직임)에 더 가깝고, scale에 `agitated`(+2)가 있는데 why가 +2를 설명하지 않습니다.
    - cue: `Nurse: "He looks anxious and fidgets now and then, but his movements aren't vigorous."`
    - why에 한 줄 더: "잦고 목적 없는 움직임이나 호흡기와 씨름하면 agitated(+2)예요."
17. **진통제 부작용 급변 slider** scale `[alert, drowsy, confused, obtunded]` — 각성(alert·drowsy·obtunded)과 인지(confused)를 한 줄에 놓아 순서가 성립하지 않습니다(혼란 환자도 완전히 깨어 있을 수 있음 — 단서가 바로 그 환자).
    - scale: `[oriented, a bit muddled, confused]`, `answerAt: 2`, why: "쉽게 깨어나는데 어디인지 계속 묻는다면 각성 문제가 아니라 지남력이 흐린 confused예요. 가끔 헷갈리다 바로잡으면 a bit muddled, 사람·장소·시간을 다 알면 oriented예요. 새로 생긴 혼란은 약 부작용이나 다른 원인(섬망 포함)을 확인해요."
18. **처치 전 예방 진통 swap** `ko: 처치 전에 통증약을 드릴게요` — 문장은 `before the dressing change`. → `ko: 드레싱 교환 전에 통증약을 드릴게요`.
19. **임종기 통증·호흡곤란 완화 swap** `ko: 숨쉬기가 편해지도록 돕고 있어요` — `so he isn't struggling`이 빠짐. → `ko: 힘들어하지 않으시게 숨쉬기 편하도록 돕고 있어요`.
20. **급성 심한 통증 위기 slider** example `His pain is routine now, so we'll keep checking.` — "pain is routine"은 어색한 영어. → example `This is routine now, so we'll keep checking on schedule.` / exKo `지금은 일상적인 상황이라 정해진 간격으로 계속 확인할게요.`
21. (가벼움) **처치 전 예방 진통 pair** decoy `at the clock` — 영어 구가 아니라 보기만 해도 걸러집니다. → `blood pressure`(✕pre-medicate blood pressure, ✕procedural blood pressure, ✕turn blood pressure — 어느 왼쪽에도 안 붙음). `with a pillow`(turn에 붙음)·`sedation`(procedural sedation이 됨)은 피할 것.

pair 결합 전수 판정: BPS(`validated tool`·`vent compliance`·`facial expression`), 처치 전(`pre-medicate with an analgesic`·`procedural pain`·`turn onto his side`), 아편유사제(`stool softener`·`side effect`·`heart rate`), 신경병증(`neuropathic pain`·`opioid dose`·`ask the physician`) — 정답 말고 성립하는 결합 없음, decoy(`speaking`·`at the clock`·`vent`·`gabapentin`)는 어느 왼쪽에도 붙지 않음.
swap 전수: 6개 이어 읽기 모두 문법 맞음. notes 사실 확인 — `suppressing his respiratory drive` note("목적과 다르게 들려")는 맞는 설명.
context 19개: 모두 '보호자에게'가 어색한 장면이고 같은 뜻·다른 청자 구조가 맞음. 13번 외에 사실 문제 없음.

### C. 단어

22. **품사가 다른 distractorsEn — 전부.** 정답 품사(문장에서의 쓰임) 기준. 대안은 길이 규칙 안.

    | id | 정답(품사) | 다른 품사 오답 | 대안 |
    |---|---|---|---|
    | w-furrow | furrow(동) | furry(형)·flurry(명) | `[furl, burrow]` |
    | w-tense | tense(동) | tent(명)·tenth(서수) | `[tend, tease]` |
    | w-fight | fight(동) | sight·flight(명) | `[bite, sigh]` |
    | w-total | total(동) | tidal(형) | `[toll, tote]` |
    | w-scale | scale(명) | stale(형) | `[scare, scalp]` |
    | w-speak | speak(동) | speck(명) | `[sneak, spike]` |
    | w-tell | tell(동) | tall(형) | `[yell, sell]` |
    | w-keep | keep(동) | keen(형) | `[kneel, peep]` |
    | w-break | break(동) | bleak(형) | `[brake, breed]` (D 30번으로 헤드워드가 바뀌면 거기 대안) |
    | w-change | change(동) | chance(명) | `[charge, chafe]` |
    | w-medicine | medicine(명) | medical(형) | `[medic, medal]` |
    | w-start | start(동) | smart(형) | `[stare, stall]` |
    | w-reposition | reposition(동) | repossession·requisition(명) | `[repossess, recondition]` |
    | w-comfort | comfort(명) | comport·commit(동) | `[compost, cohort]` |
    | w-low | low(형) | law·lot(명) | `[loud, lone]` (D 29번으로 lower(동)가 되면 `[loiter, lodge]`) |
    | w-pull | pull(동) | pill·pool(명) | `[peel, poll]` |
    | w-calm | calm(형) | clam(명)·claim(동·명) | `[clammy, balmy]` |
    | w-work | work(동) | word(명) | `[walk, warp]` |
    | w-plan | plan(명) | plain(형) | `[plant, plank]` |
    | w-check | check(동) | cheek(명) | `[chase, chew]` |
    | w-high | high(형) | hug(동)·hill(명) | `[huge, hazy]` |
    | w-first | first(부) | fist·thirst(명) | `[forth, fast]` |
    | w-add | add(동) | odd(형) | `[aid, nod]` |
    | w-titrate | titrate(동) | nitrate(명) | `[tolerate, irritate]` |
    | w-little | little(형) | litter·liter(명) | D 28번(less)로 바꾸면 `[lean, lax]` |
    | w-few | few(형) | flew(동)·fee(명) | `[fine, faint]` |
    | w-need | need(동) | neat(형) | `[seed, heed]` |
    | w-influence | influence(동) | inference·inflation(명) | `[inflame, inflict]` |
    | w-shift | shift(명) | swift(형) | `[shirt, shelf]` |
    | w-resistant | resistant(형) | resident(명) | `[resilient, reluctant]` |
    | w-adjuvant | adjuvant(명) | adjacent(형) | `[adjutant, adjustment]` |
    | w-poor | poor(형) | pour(동)·pool(명) | `[pure, sore]` |
    | w-help | help(동) | kelp(명) | `[heap, yelp]` |
    | w-early | early(부) | earn(동) | `[yearly, eerily]` |
    | w-sedate | sedate(동) | senate(명) | `[seclude, secede]` |
    | w-notice | notice(동) | novice·notion(명) | `[notify, notate]` |
    | w-max | max(동) | mat(명) | `[mix, mask]` |
    | w-happen | happen(동) | happy(형) | `[hasten, deepen]` |
    | w-rule | rule(동, rule out) | rude(형)·role(명) | D 30번 `[roll out, rule in]` |
    | w-urgent | urgent(형) | agent(명) | `[urban, ardent]` |
    | w-serious | serious(형) | series(명) | `[serial, spurious]` |
    | w-abdomen | abdomen(명) | abandon(동) | `[absence, addendum]` |
    | w-barely | barely(부) | barley·barrel(명) | `[bravely, merely]` (`rarely`는 뜻이 겹쳐 피함) |
    | w-pupil | pupil(명) | purple(형) | `[pupa, puppy]` |
    | w-taper | taper(동) | paper(명) | `[tamper, cater]` |
    | w-sweat | sweat(동) | sweet(형)·swept(과거형) | `[swear, sweep]` |
    | w-adjunct | adjunct(명) | adjourn(동) | `[advent, adjective]` |
    | w-free | free(형) | tree(명)·flee(동) | `[frail, fresh]` |
    | w-refractory | refractory(형) | repository(명) | `[satisfactory, reflexive]` |
    | w-current | current(형) | curtain·currency(명) | `[recurrent, curious]` |
    | w-hurt | hurt(동) | heart(명) | `[hunt, hurry]` |
    | w-suffer | suffer(동) | sulfur(명) | `[differ, buffer]` |
    | w-long | long(부) | lung·song(명) | `[along, wrong]` |
    | w-swollen | swollen(형) | swallow(동) | `[stolen, sullen]` |
    | w-worry | worry(동) | wary(형)·worth(형·명) | `[worsen, wobble]` |
    | w-breathe | breathe(동) | breath(명) | `[bathe, breed]`, `breath`는 decoyChips로 옮김 → `decoyChips: [breath, breadth]` (브리프: 품사가 달라 헷갈리는 짝은 decoyChips에) |
    | w-spike | spike(동) | spice·spine(명) | `[spill, spin]` |
    | w-aim | aim(동) | arm(명) | `[aid, ail]` |
    | w-slow | slow(동) | slot(명) | `[slap, stow]` |
    | w-hold | hold(동) | hood(명) | `[hide, fold]` |

23. `w-sedative` distractorsEn `narcotic` — 단서 "차분하고 졸리게 만드는 약"에 마약성 진통제도 들어맞아 정답처럼 읽힙니다. → `[laxative, diuretic]`.
24. `w-neuropathic` distractorsEn `neurologic` — '신경의'라 "신경이 손상돼 생기는 통증"이라는 단서와 겹칩니다. → `[nociceptive, neurotoxic]`.
25. **decoyChips·조각 비속어·불쾌 관점 — 전부 확인.** 비속어는 없음. 장면과 섞여 불쾌하거나 약물 은어인 것만:

    | id | 조각 | 왜 | 대안 |
    |---|---|---|---|
    | w-comfortable | `fat`(decoy) | 환자 몸을 두고 '뚱뚱한' | `ford` |
    | w-swollen | `sow`(decoy) | 부은 배 장면에 '암퇘지'(여성 비하 은어) | `sew` |
    | w-adjunct | `junk`(decoy) | 아편 금단 주제에서 헤로인 은어(junk·junkie) | `just` |
    | w-help | `hemp`(decoy) | 대마 | `helm` |
    | w-carefully | `fool`(decoy) | 모욕어 | `fell` |
    | w-helpful | `fool`(decoy) | 모욕어(가족에게 하는 문장의 단어) | `full` |
    | w-watch | `witch`(decoy) | 여성 비하로 쓰이는 말 | `watt` |
    | w-fast | `fat`(distractorsEn) | 몸 묘사 — 정답 후보로 화면에 뜸 | `[vast, last]` |

    그대로 둬도 되는 것: `sin`·`lie`·`rap`·`mad`·`sad`·`cut`·`crab`·`nag`·`moan`(뜻이 장면과 이어지지 않거나 가벼움).
26-2. (선택) `w-point` distractorsKo `[선, 면]` — 기하 용어라 점수 맥락에서 바로 걸러짐. → `[칸, 등급]`.
26. 조각이 형태소가 아님: `w-acetaminophen` `[a, ce, ta, minophen]` → `[[a, ce, ta, min, o, phen]]`은 6개 넘으니 `[[acet, a, mino, phen]]`; `w-capnography` `[cap, nog, ra, phy]` → `[[cap, no, gra, phy]]`(decoyChips `nag`는 그대로 가능).

### D. 결정 11 (기존 단어·문장의 가벼운 정리)

27. **`w-time` 되살림 — 판정: 되살립니다.** 저작자는 공통 쉬운 단어 목록이라 뺐지만 base의 `w-time` ko가 이미 **'시간을 맞추다'(동사)**였고, keyPhrase 두 문장 `We'll time the dose to peak during the procedure.`·`Time a small bolus just before the procedure.`의 time은 명사 '시간'이 아니라 투약 시점을 맞추는 동사입니다. 목록의 취지(이미 아는 말)에 해당하지 않고, 브리프의 "구의 일부로 가르칠 값이 있으면 둔다"와 같은 경우입니다.
    - `w-time`: en `time`, ipa `/taɪm/`, ko `시간을 맞추다`, icon `calendar`, example `We'll time the dose to peak during the procedure.`, exKo `처치 중에 효과가 최고조에 이르도록 투여 시간을 맞출게요.`, cue `약 효과가 가장 셀 때 처치가 겹치도록 투여 시점을 미리 계산해 두는 동사`, tag `투여·기록`, distractorsEn `[tame, tune]`, distractorsKo `[양을 맞추다, 순서를 바꾸다]`, chips `[[time]]`, decoyChips `[tine]`.
    - 태그는 두 동사 문장에만: 처치 전 예방 진통 #4, 처치 관련 통증 관리 #2. 명사 쓰임(진통제 정규 #4 `the time`)과 임종기 #5에는 다시 달지 않음. changes에서 `word-remove w-time`을 지우고 두 문장의 words 변경을 적습니다.
28. (선택) `w-little` — 두 문장 모두 `less`로만 쓰입니다(little→less는 명사화만큼 큰 형태 변화). 헤드워드를 `less`로: ipa `/lɛs/`, ko `더 적은`, example `Multimodal analgesia lets us use less opioid.`(그대로), chips `[[less]]`, distractorsEn `[lean, lax]`, distractorsKo `[더 많은, 같은 양의]`, cue "양을 지금보다 줄여서, 'use ___ opioid'처럼" 쪽으로. id는 그대로. (w-few의 ko '적은 수의'와도 더 분명히 갈림) **주의:** 브리프의 헤드워드 정리는 원형 쪽으로 가는 것이고 little은 V2를 통과했으니, 바꾸지 않아도 됩니다. 바꾸면 verify로 V2·V16을 확인하세요.
29. (선택) `w-low` — 세 문장 모두 `lower`(동사 둘 `can lower`·`lowers`, 비교급 하나). 헤드워드 `lower`, ko `낮추다`, ipa `/ˈloʊər/`, chips `[[low, er]]`, distractorsKo `[높이다, 넓히다]`, distractorsEn `[loiter, lodge]`. 
30. `w-rule` → 헤드워드 `rule out`(쓰임이 구동사 하나), chips `[[rule], [out]]`, distractorsEn `[roll out, rule in]`(rule in은 '확진 쪽으로 포함'이라 dKo `확진하다`와도 맞물림 — 정답 둘 아님), cue에서 `'___ out'으로 쓰여`를 "검사로 가능성을 하나씩 지워 없애는 일"로(정답 일부 노출 방지).
    (선택) `w-break` → 헤드워드 `break through`(쓰임 `breaking through` 하나), ko `(통증이) 뚫고 올라오다`, chips `[[break], [through]]`, distractorsEn `[break down, bleed through]`, decoyChips `[bread, though]`. 구 안의 활용형(`breaking through`)을 V2가 받는지 확인되지 않았으니, verify가 거절하면 `break`를 두고 22번 표의 오답만 고칩니다.
31. **keyPhrase 문장의 ko만 고침(결정 11 범위).** ko를 고치면 그 문장의 distractorsKo 둘도 새 ko 틀로 다시 씁니다.
    - CPOT 통증 사정 #2 `His brow is furrowed and he's tensing — that scores points.` ko `이마를 찌푸리고 뻣뻣해지면 그것도 점수에 들어가요` → `이마를 찌푸리고 몸에 힘이 들어가 있어요 — 점수에 들어가요.` (현재 상태를 말하는 문장, "뻣뻣"은 rigid 쪽)
    - 처치 관련 통증 관리 #2 `Time a small bolus just before the procedure.` ko `처치 직전에 소량의 볼루스 시간을 맞춰요` → `소량 볼루스를 처치 바로 전에 맞춰 줘요.`
    - 가족의 대리 통증 관찰 활용 #0 ko `가족이 가장 잘 아세요 — 찌푸린 이마를 알아보시는 게 도움이 돼요` → `누구보다 잘 아시잖아요 — 이마를 찌푸리신다는 걸 알려 주셔서 도움이 돼요.` (you를 3인칭 '가족'으로 옮긴 것을 바로잡음 — 저작자 A 메모 타당)
    - 가족의 대리 통증 관찰 활용 #4 ko `가족의 관찰이 저희 통증 사정에 더해져요` → `보호자분이 보신 것이 저희 통증 사정에 보태져요.` (같은 이유)
    - 만성통증·내성 환자 관리 #2 ko `충분히 안 주면 금단과 부족한 조절의 위험이 있어요` → `충분히 치료하지 않으면 금단이 오고 통증이 잘 조절되지 않을 위험이 있어요.`
    - 통증 조절 실패·불응 #4 ko `고통받지 않도록 상향 조정해요` → `고통받지 않도록 치료 단계를 올려요.` (무엇을 올리는지 — 저작자 A 메모 타당)
32. (선택) `w-cpot`·`w-bps`·`w-rass`·`w-camicu`의 ko 끝 `(CPOT)` 등 — 영어 고르기에서 ko가 카드에 있으므로 정답이 그대로 보입니다. `중환자 통증관찰척도`·`행동통증척도`·`진정평가척도`·`섬망평가도구`로(distractorsKo의 `(GCS)` 등도 같이 떼어 길이를 맞춤). base부터 있던 값이라 선택으로 둡니다.
33. (선택) 남은 쉬운 단어: `speak`·`help`·`need`·`happen`·`high`·`first` — 간호사가 아는 말이지만 이미 22개를 뺐으니(1할) 이번에는 두어도 됩니다.

changes 목록 판정: ko 가르기 8건(tolerance·score·level·rate·drug·little·few·schedule), 활용형 헤드워드 2건(tense·pre-medicate), 쉬운 단어 제거 22건 모두 타당. 예외는 `w-time`(27번)과, 4번으로 지워질 `w-level`의 ko 변경(무의미해짐).

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| 상황·문장 | 현재 en | 문제 | 대안 en |
|---|---|---|---|
| 급성 심한 통증 위기 #1 | Let's rule out ischemia and give urgent analgesia. | 처방·프로토콜 조건이 없는 진통 지시(팀끼리의 "Let's"라 정도는 가벼움). 진통을 미루지 않는 내용 자체는 맞음 | `Let's rule out ischemia and get urgent analgesia ordered.` (그대로 둬도 됨) |
| 임종기 통증·호흡곤란 완화 #4 | You can stay close and talk to him — he can feel your presence. | 의식 없는 환자가 "느낀다"는 단정은 확인할 수 없음. 미국 호스피스 교육은 "청각은 마지막까지 남을 수 있다"로 가르침 | `You can stay close and talk to him — he may still hear you.` |
| 임종기 통증·호흡곤란 완화 #0 | Our goal now is to keep him comfortable and free of pain. | "목표" 진술이라 약속은 아님 — 유지 권고. 더 조심하려면 | `Our goal now is to keep him as comfortable and pain-free as possible.` |
| 통증 조절 실패·불응 #4 | We escalate to keep him from suffering. | 무엇을 올리는지 없음(영어도 모호). ko는 31번에서 고침 | `We escalate his treatment to keep him from suffering.` (선택) |
| 가족의 대리 통증 관찰 활용 #0 | You know him best — that furrowed brow is helpful to know. | "is helpful to know"가 조금 어색함. ko는 31번에서 고침 | `You know him best — telling us about that furrowed brow helps.` (선택) |
| 아편 과량 호흡억제 위기 #0 | He's barely breathing — bag him and give naloxone now. | 판정: 위기 장면의 팀 지시이고 BVM 환기가 먼저 나와 순서도 맞음 — 그대로 둬도 됨. why·order의 "per protocol"(B)로 충분 | (변경 불필요) |

chunks만 문제인 keyPhrase(보고만, 고치지 않음): 다중양식 #1 `adds baseline pain / control`(pain control을 끊음) · 아편유사제 적정 #4 `against opioid / side effects` · 진통제 부작용 급변 #0 `may be opioid / side effects` · 만성통증 #0 `his baseline / requirement` · 통증 조절 실패 #0 `to our current / regimen` · 신경병증 #4 `need different / medications` · 통증과 초조 #2 `before adding / sedation` · BPS #2 `let us assess / pain`.

## 저작자 메모 판정

- "다른 걸 하기 전에 바로 통증 약을 드릴게요"(급성 #4) → 타당, 고칠 것 1번[안전].
- "긴급 진통제를 드려요"(급성 #1, keyPhrase) → 결정 목록. 가벼운 문제.
- "날록손으로 역전시킬게요"(예방 #5) → 타당, 고칠 것 2번[안전].
- 임종기 "free of pain the whole time"(#5) → 타당, 3번[안전]. keyPhrase #0 "free of pain"은 목표 진술이라 유지 권고.
- "he can feel your presence"(keyPhrase #4) → 결정 목록, 대안 `he may still hear you`.
- 클로니딘 문장(금단 #3) → 내용은 사실, 처방자 경유로 바꾸고 chunks도 고침(5번).
- "30분이면 최고 농도"(재평가 #1) → 타당, 4번[안전].
- "급증할 거예요"(만성 #3) → 타당, 6번(will→can).
- w-time 되살림 → 되살림(27번).
- ko 두 건(escalate·furrowed brow) → 타당, 31번.
- w-breathe의 `breath` → 오답에서 decoyChips로 옮김(22번 표).
- B 메모 1·2·4·7(why·distractorsKo의 처방 경유) → why는 사실과 맞음. 5(장소 꼬리 decoy)·6(order 순서)은 B 검토 몫. 다만 1번 수정으로 급성 #4가 바뀌므로 order 카드를 B가 다시 봐야 함.

## 개수

고칠 것 **37건**(A 문장 15(11-2~11-4 포함) · B 뉘앙스 9 · C 단어 6(품사 표·조각 표는 각 1건) · D 결정 11 7(선택 4 포함)), 그중 **안전 6건**(1·2·3·4·7·13). keyPhrase 결정 필요 6건(그중 실질 2건: 급성 #1, 임종기 #4) + chunks 보고 8곳.

## 종합

안전 6건(사정·호출보다 앞선 투약 약속, 보이는 순간 날록손 역전, 임종기 보장, 30분 최고 농도 일반화, CPOT 점수 합 오류, 간호사가 정하는 아편 교체)을 고치고 w-time을 되살리면 내보내도 됩니다. 뉘앙스 why는 미국 ICU 관행(CPOT·BPS로 통증 먼저, 진통 우선 진정, 적정 중 호흡수·capnography 감시, 날록손 프로토콜)과 대체로 맞고, CPOT를 강도로 읽게 한 slider 하나만 손보면 됩니다. 품사 표와 조각 정리는 기계적인 일이라 한 번에 반영할 수 있습니다.
