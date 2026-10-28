# fix-icu-stroke-icu-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번)

대상: `icu-stroke-icu.yaml`(A·B 합친 파일, 단어 254 · 상황 21 · 문장 126). 비교: base·changes(85건)·in·notes A/B.
뉘앙스: slider 21 · context 21 · swap 21 · pair 0 · reel 0.
스크립트(작업 폴더): `_rvA_icu-stroke-icu.py`(words/sent/nu/ex 덤프·swap 이어 읽기), `_rvA_icu-stroke-icu_chips.py`(decoyChips 재조립), `_rvA_icu-stroke-icu_chk.py`(길이·cue 영어·context 모양), `_rvA_icu-stroke-icu_bad.py`(불쾌 조각), `_rvA_icu-stroke-icu_chunks.py`(청크 경계). 덤프: `_rvA_icu-stroke-icu_{words,sent,nu,ex}.txt`.

기계 확인 결과: 오답 길이 위반 0, cue에 영어 0, **decoyChips로 정답을 다른 경로로 조립 2건**(w-usually·w-portable), context 21개 모두 `word`·`ko`·장면 3·`ok:false` 1(W14 MISS 1건은 `notified` 활용형이라 문제 아님), swap 21개 세 선택지 모두 이어 읽어 문법 맞음, pair 없음. 단어 example이 그 뜻으로 태그되지 않은 문장을 가리키는 것 3건(w-bring·w-clear·w-call).

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 소리·철자가 닮은 오답은 좋지만 품사가 다른 오답이 약 50개(동사 정답에 명사 오답 등), `intimately`(성적 뜻 — 앞 주제에서 지적된 말)가 또 있음 |
| 2 distractorsKo·길이 | 4 | 길이 위반 0, 동의어 오답 거의 없음. `w-stroke`의 `간질`(낙인 용어, 지금은 뇌전증) |
| 3 cue | 4 | 대체로 장면이 떠오름. `w-swab`(면봉 — 문장은 스펀지), `w-bump`(걷다가 — 문장은 발작 중), `w-respiratory`(문장은 호흡치료팀) |
| 4 chips/decoyChips | 3 | 재조립 2건(`us`·`able`), 마리화나·죄·거짓말·소송·술·장례 조각(`pot`×3·`sin`·`lie`×2·`sue`·`pint`·`pall`) |
| 5 뉘앙스 사실 | 4 | "처방·프로토콜대로", 출혈 의심 즉시 보고, 금식 중 구강 관리를 일관되게 씀. slider 0 why의 NIHSS 설명이 틀림 |
| 6 뉘앙스 설계 | 3 | slider 3(동의어 저울이 아니고 위험 행동이 선택지), 6·8(정답 둘), context 6개(정상 장면과 어색한 장면의 듣는 사람이 같음), context 13(어색한 장면만 뜻이 반대) |
| 7 결정 11 | 4 | 변경은 과하지 않음(D 참조). example 3건이 태그 뺀 문장에 남음, `w-sort`·`w-respiratory`·`w-swab` ko |

## 사실 오류·심각한 문제

1. **[안전] 3.4** `A little grogginess right after the medicine is normal.` — 혈전용해제(알테플라제)는 진정 작용이 없습니다. 투여 후 24시간 안에 새로 생긴 졸림·몽롱함은 증상성 뇌출혈을 먼저 의심해 사정·보고하는 신호인데, 간호사가 환자에게 '정상'이라고 단정합니다. 문장 `why`("'a little'로 정도를 한정하면…")와 order 3번째 줄("…is normal, though")이 같은 잘못을 굳힙니다. 저작자 지적 타당.
2. **[안전] 10.3** `He's on warfarin, so we need to check his INR first.` — 와파린 복용이 알려진 뇌출혈에서는 4F-PCC와 정맥 비타민 K를 INR 결과를 기다리지 않고 처방대로 시작하고, INR은 동시에 스탯으로 보냅니다. `first`가 역전을 늦추라는 순서로 들리고, 문장 `why`("'first'가 그 검사를 먼저 하라는 순서를 정해요")가 그것을 가르칩니다. order 10의 줄도 같은 문장. 저작자 지적 타당.
3. **[안전] 3.3** `I'll wake you every hour to check your strength and speech.`(재관류 후 감시, tPA 직후 환자) — 혈전용해 후 신경학적 사정은 프로토콜상 첫 2시간 15분마다 → 6시간 30분마다 → 이후 1시간마다입니다. '한 시간마다'로 약속하면 초기 간격을 잘못 배웁니다. 11.3 `every hour tonight`(혈전제거 후)도 같은 문제(덜 심각 — 시술 후 시간이 지난 밤일 수 있음).
4. **0.5** `I'll stand on your right side so you can see me.` — 장면 첫마디가 "오른팔이 무겁고 말이 엉켜요"(좌반구 뇌졸중 → 시야 결손이 있다면 오른쪽). 문장 `why`가 "보이는 쪽에 서야"라고 하므로 서야 할 쪽은 **왼쪽**입니다. 오른쪽에 서면 보이지 않는 쪽에 서는 셈.
5. **16.4** `Push the reversal agents while I page neurosurgery.` — tPA 후 출혈의 역전(크리오침전제, 트라넥삼산·아미노카프로산)은 정맥 **점적**이지 push가 아닙니다. 문장 `why`("'Push'는 정맥으로 직접 넣는 투여")가 이를 굳힘. 처방 표시도 없음.
6. **20.4** `We can focus on his comfort instead of more machines.` — 치료 목표를 편안함 중심으로 바꾸자는 제안을 간호사가 먼저 꺼냅니다(업무 범위 밖 — 의료팀과 가족이 정함). order 20 줄 "Because of how severe that is, we can focus…"는 가족 대신 결론까지 내려 더 나쁨. 저작자 지적 타당.
7. **15.5** `I'll stay right here and keep you updated every few minutes.` — 뇌탈출 위기에서 '몇 분마다' 알려 준다는 지킬 수 없는 약속이고, 간호사는 가족 곁이 아니라 환자 곁에 있어야 합니다. 저작자 지적 타당.
8. **slider 0 why** "NIHSS 운동 항목은 중력을 이기는지, **저항에 버티는지**를 보므로" — NIHSS 팔·다리 운동 항목은 들어 올린 자세를 10초(다리 5초) 버티는지(떨어짐·중력 대항)를 보고, 저항은 보지 않습니다(저항은 근력 검사 0~5점).
9. **slider 3** 저울 `[chart it later, tell the team soon, report immediately]` — tPA 후 '생애 최악의 두통'에 `chart it later`를 선택지로 보입니다(위험 처치를 오답으로 보이기). 또 단어의 강도 저울이 아닙니다.
10. keyPhrase 4.1·16.0 — **사용자 결정 필요**(아래 E).

## 고칠 것

[안전]을 붙인 것이 안전 항목입니다. 문장을 새로 쓰면 **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 2·blank)를 전부 새로 쓰고**, 바뀐 `words`는 `changes-icu-stroke-icu.yaml`에 적으세요. 그 문장이 어떤 은행 단어의 `example`·`exKo`이면(괄호에 적음) 새 문장으로 바꾸고, **같은 내용을 담은 그 상황의 `order` 줄도 고치세요**(B 몫이지만 A 수정과 어긋나면 안 됨 — 괄호에 적음). 문장 `ko`만 고친 경우에도 `distractorsKo` 둘을 새 ko 틀에 맞춰 다시 씁니다.

### A. 문장 (keyPhrase 아님)

1. **[안전] 재관류 후 감시 3.4** — 새 졸림을 '정상'으로 단정.
   - en: `Any new grogginess after the medicine isn't normal, so tell me right away.`
   - ko: `약을 맞은 뒤 새로 몽롱해지는 건 정상이 아니니 바로 말씀해 주세요.`
   - chunks: `Any new grogginess / after the medicine / isn't normal / , so tell me right away / .`
   - words: `[w-grogginess, w-medicine, w-normal, w-tell]`(w-little은 다른 문장에 남음). v46 필드 전부 새로(blank `normal`은 써도 됨 — 오답에 `scary` 같은 말 대신 같은 분야 형용사).
   - 딸린 것: `w-grogginess`·`w-normal` example/exKo. **order 3** 3번째 줄 → `Any new grogginess after the medicine isn't normal, though.`처럼 바꾸고 order `why`의 "대비되는 정상 반응" 설명도 고침.
2. **[안전] 출혈성 뇌졸중 응고 역전 10.3** — INR을 기다리며 역전 지연.
   - en: `He's on warfarin, so let's send his INR stat while we get the reversal ready.`
   - ko: `와파린을 복용 중이니, 역전제를 준비하는 동안 INR을 스탯으로 보내죠.`
   - chunks: `He's on warfarin / , so let's send his INR stat / while we get / the reversal ready / .`
   - words: `[w-warfarin, w-send, w-stat, w-reversal, w-ready]`. `w-first`는 이 문장에만 태그 → **word-remove**. v46 필드 전부 새로(blank `warfarin`은 그대로 가능, why에서 'first' 설명 삭제 — "역전은 INR을 기다리지 않고 처방대로, INR은 동시에").
   - 딸린 것: `w-warfarin` example/exKo. **order 10** 같은 줄도 새 문장으로.
3. **[안전] 재관류 후 감시 3.3** — 사정 간격 '한 시간마다'.
   - en: `I'll wake you often to check your strength and speech.`
   - ko: `자주 깨워서 힘과 말을 확인할게요.`
   - chunks: `I'll wake you often / to check / your strength and speech / .`
   - words: `[w-wake, w-often, w-check, w-strength, w-speech]`. why에 "간격은 tPA 프로토콜대로(처음엔 15분마다)"를 담아 새로.
   - 딸린 것: `w-wake`·`w-speech` example/exKo.
4. **[안전] 혈전제거 후 재관류 관리 11.3** — 같은 문제(덜 심각).
   - en: `I'll check your strength and speech often tonight.` / ko: `오늘 밤 힘과 말을 자주 확인할게요.`
   - chunks: `I'll check / your strength and speech / often / tonight / .` · words `[w-check, w-strength, w-speech, w-often, w-tonight]`. v46 필드 새로.
   - 딸린 것: `w-tonight` example/exKo. **order 11** 줄("…every hour tonight")도 `often tonight`로.
5. **NIHSS 신경 사정 0.5** — 서는 쪽이 반대(사실 오류 4).
   - en: `I'll stand on your left side so you can see me.` / ko: `제가 잘 보이시도록 왼쪽에 서 있을게요.`
   - chunks: `I'll stand / on your left side / so you can / see me / .` · words 그대로.
   - distractorsKo는 지금 `왼쪽`을 쓰므로 새로: 쪽을 바꾸지 말고 장소로 — `제가 잘 보이시도록 문 쪽에 서 있을게요.` · `제가 잘 보이시도록 침대 발치에 서 있을게요.` why는 "좌반구 뇌졸중이면 오른쪽 시야가 비므로 보이는 왼쪽에" 정도로.
   - 딸린 것: `w-side`·`w-stand` example/exKo.
6. **tPA 후 대량 뇌출혈 위기 16.4** — push가 아니고 처방 표시 없음(사실 오류 5).
   - en: `Give the ordered reversal agents while I page neurosurgery.`
   - ko: `제가 신경외과를 호출하는 동안 처방된 역전제를 투여해 주세요.`
   - chunks: `Give / the ordered reversal agents / while I / page neurosurgery / .`
   - words: `[w-give, w-reversal, w-agent, w-page, w-neurosurgery]`. `w-push`는 이 문장에만 → **word-remove**(태그 0). why의 'Push' 설명 삭제. decoy `the saline flush`는 다시 판정.
   - 딸린 것: `w-push` 지움.
7. **광범위 뇌손상 목표·예후 소통 20.4** — 간호사가 치료 목표 전환을 제안(사실 오류 6).
   - en: `If that's what he would want, the team can focus on his comfort instead of more machines.`
   - ko: `그분이 원하셨던 것이라면, 의료팀은 기계를 더 다는 대신 편안함에 집중할 수 있어요.`
   - chunks: `If that's what / he would want / , the team can focus / on his comfort / instead of more machines / .`
   - words: `[w-team, w-focus, w-comfort, w-instead, w-machine]`. v46 필드 새로.
   - 딸린 것: `w-focus`·`w-comfort`·`w-instead`·`w-machine` example/exKo. **N20 swap** `before[0]` → `If that's what he would want, the team can focus on `, swap `ko` → `그분이 원하셨던 것이라면, 의료팀은 기계를 더 다는 대신 편안함에 집중할 수 있어요`. **order 20** 줄 "Because of how severe that is, we can focus…" → 가족의 뜻을 묻는 줄로(예: `If that's what he would want, the team can focus on his comfort.`).
8. **악성 대뇌부종 뇌탈출 위기 15.5** — 지킬 수 없는 약속(사실 오류 7).
   - en: `I'll stay close to him, and we'll update you as soon as we know more.`
   - ko: `제가 그분 곁에 있을게요, 새로 알게 되는 대로 바로 알려 드릴게요.`
   - chunks: `I'll stay close / to him / , and we'll update you / as soon as we know more / .`
   - words: `[w-stay, w-close, w-update]`. v46 필드 새로. **order 15** 줄("While they decide, I'll stay right here…every few minutes")도 같은 뜻으로.
9. **삼킴장애 관리·영양 경로 9.4** — 재검 시점을 간호사가 약속.
   - en: `The therapist will decide when to try the swallow test again.`
   - ko: `삼킴 검사를 언제 다시 할지는 치료사 선생님이 정할 거예요.`
   - chunks: `The therapist will decide / when to try / the swallow test / again / .`
   - words: `[w-therapist, w-decide, w-try, w-swallow, w-test]`. v46 필드 새로.
10. **두부 거상·체위 4.5** — 모든 뇌졸중 환자의 뇌압을 낮춘다고 단정(BED 1은 재관류 후 허혈성 환자).
    - en: `For some patients, this also lowers the pressure inside the head.`
    - ko: `어떤 환자에게는 이게 머릿속 압력을 낮추는 데도 도움이 돼요.`
    - chunks: `For some patients / , this also lowers / the pressure / inside the head / .` · words 그대로. v46 필드 새로.
    - 딸린 것: `w-lower` example/exKo. **order 4** 줄("Raising it also lowers the pressure inside your head.")도 같게.
11. **혈압 변동 정밀 조절 8.4** — 뇌출혈 혈압 목표 숫자를 정해진 값처럼 가르침(목표는 처방대로; 청크 `under / one-sixty`도 끊김).
    - en: `This is a bleed, so his ordered target is under one-sixty.`
    - ko: `이건 출혈이라 이 환자의 처방 목표는 160 미만이에요.`
    - chunks: `This is / a bleed / , so his ordered target / is under one-sixty / .`(9낱말이라 4조각; `under`와 숫자는 떼지 않음)
    - words 그대로. v46 필드 새로(order 8 줄은 이미 "Per the order"라 둠).
12. **발작 동반 관리 12.4** `It usually lasts less than two minutes.` — en은 사실이라 둡니다(저작자 지적은 일부만 타당). 대신 문장 `why`에 "5분 넘게 이어지면 응급(지속 발작)이라 바로 도움을 부른다"를 넣으세요. (선택) 문장을 `It usually lasts under two minutes, and past five minutes it's an emergency.`로 바꾸면 words `[w-usually, w-last, w-under, w-emergency]`, chunks `It usually lasts / under two minutes / , and past five minutes / it's an emergency / .` — 이때 slider 12 `example`·`exKo`와 `w-usually`·`w-last` example도 같이.
13. **chunks 구 경계(keyPhrase 아님)**:
    - 11.4 `once / more` → `The artery is open again / , but it could narrow / once more / .`
    - 14.4 `and / the bag-valve mask` → `I'll grab / the transport monitor / and the bag-valve mask / .`
    - 17.4 `now, so let's move` → `Angio's opening / the suite now / , so let's move / fast / .`
    - 19.3 `after he / aspirated` → `His sats dropped / into the seventies / after he aspirated / .`
    - 19.4 `a stat / chest X-ray` → `Let's get / a stat chest X-ray / and an ABG / .`
    - 14.3 `for a safe / transfer` → `We need / two staff members / for a safe transfer / .`
    - 13.5 `now makes / recovery easier / later` → `A little movement now / makes recovery easier / later / .`
14. **16.3 ko** `오른쪽 동공이 커졌어요` — `blew`는 크게 열리고 빛에 반응이 없어진 것. → `오른쪽 동공이 확 커지고 반응이 없어요, 지금 바로 보고하세요.` distractorsKo 둘도 새 틀로(`눈꺼풀`·`손` 바꿈은 그대로 쓸 수 있음). slider 16 `exKo`도 같게.
15. (선택) **9.5** `she can start with soft foods` — 식이 형태는 언어치료사·처방이 정합니다(퓌레부터일 수 있음). → `As soon as it's safe, she can start the foods her therapist recommends.` words `[w-soon, w-safe, w-start, w-food, w-therapist]`(w-soft는 태그 0이 되면 word-remove). order 9 줄도.
16. (선택) **4.4** `…raised about thirty degrees.` → `…raised about thirty degrees, as ordered.`(각도는 처방대로).

저작자 지적 중 **고치지 않는 것**: 2.4 `ice chips once the swallow test clears you`(간호사 침상 선별 통과 후 프로토콜대로 시작하는 것은 미국 관행 — 둠), 20.3 `There are no signs that he's aware…`(관찰 사실을 말하는 문장 — 둠), 16.0·16.4 지시 말투(16.4는 A-6, 16.0은 E).

### B. 뉘앙스

17. **slider 0 (w-strength) why** — 사실 오류 8. → "들어 올릴 수는 있어도 손으로 미는 힘을 못 이기면 힘이 줄어든 상태예요. NIHSS 운동 항목은 팔을 10초 들고 버티는지를 보고, 저항은 근력 검사로 따로 봐요. 본 대로 기록하고, 전보다 약해졌으면 바로 팀에 알려요."
18. **[안전] slider 3 (w-headache)** — 위험 처치를 선택지로 보이고 강도 저울이 아님. → scale `[a mild headache, a bad headache, the worst headache of my life]`, answerAt 2, cue 그대로, why "tPA 뒤 갑자기 '생애 최악'이면 출혈 징후일 수 있어 바로 의사에게 알리고, 영상 등은 지시대로 준비해요."
19. **slider 6 (w-sudden)** `[gradual, quick, sudden]` — 5분 만의 변화에 quick·sudden이 둘 다 맞음. → scale `[gradual, over several hours, sudden]`.
20. **slider 8 (w-drop)** `[small drop, steady drop, sharp drop]` — 크기와 모양 두 축이 섞였고, 10분에 25 내린 것은 steady·sharp 둘 다 됨. → scale `[slight drop, moderate drop, sharp drop]`, cue `After the last rate change, his pressure fell from 175 to 120 in five minutes.`, answerAt 2, why "짧은 시간에 크게 떨어지면 sharp — 뇌관류가 줄 수 있어 주입은 프로토콜대로 조절하고 바로 의사에게 알려요."
21. (선택) slider 16 (w-pupil) `equal`은 크기 축이라 반응 저울 `sluggish/blown`과 다름 → `[brisk, sluggish, blown]`.
22. (선택) slider 7 `deep` → `profound`(deep sleepiness는 어색). slider 11 cue `still near the ordered range` → `still within the ordered range`(범위 밖처럼 읽힘).
23. **context 3 (bleed) ko** `출혈되다` — 세 장면 모두 명사(`a bleed`·`any bleed`·`gum bleed`). → ko `출혈`.
24. **context 정상 장면과 어색한 장면의 듣는 사람이 같음**(어색한 이유가 듣는 사람이 아니라 용어뿐 — gi-bleed 검토와 같은 지적). 정상 쪽 일반인 장면을 의료진 장면으로 바꾸세요(word는 유지):
    - context 0 (point) 장면 1 `침상 옆에서` → who `의사 라운드`, icon monitor, en `Can she point to objects on command yet?`
    - context 2 (wait) 장면 1 `침상 옆에서` → who `야간 인계`, icon board, en `Still NPO — we're waiting on the swallow screen before anything by mouth.`
    - context 9 (tube) 장면 1 `가족 상담` → who `의사 라운드`, icon monitor, en `Let's confirm the feeding tube position before we start feeds.`
    - context 11 (watch) 장면 1 `침상 옆에서` → who `야간 인계`, icon board, en `Please watch his puncture site and distal pulses with every neuro check.`(혈전제거 후 천자 부위·말단 맥박 — 이 주제 문장에 빠진 감시 항목)
    - context 13 (support) 장면 1 `침상 옆에서` → who `동료에게`, icon monitor, en `Can you support her other side while we sit her up?`
    - context 20 (honest) 장면 1 `가족 면담` → who `의사 라운드`, icon monitor, en `Let's be honest with the family about the prognosis at today's meeting.`
    - 각 `why`가 바뀐 장면을 설명하는지 다시 읽기.
25. **context 13 (support) 어색한 장면의 뜻이 다름** — `Ambulation will be unsupported unless you fail the balance screen.`은 "도와주지 않는다"는 반대 뜻. → en `Mobilization will proceed with supported transfers per the PT protocol.`(같은 뜻·환자에게 차가운 말). fix는 그대로. (선택) ko `지지하다` → `받쳐 주다`.
26. N12 slider `example`·N16 `exKo`·N20 swap — A-12(선택)·A-14·A-7을 반영하면 같이 고침.

### C. 단어

27. **[필수] 재조립 2건**
    - `w-usually` chips `[u, su, al, ly]` + decoy `us` → `us+u+al+ly`로도 조립됨(한 글자 조각 `u`도). → chips `[[usu, al, ly]]`, decoyChips `[use, sum]`(`sue` 소송도 함께 해결).
    - `w-portable` chips `[port, a, ble]` + decoy `able` → `port+able`. → decoyChips `[part, ample]`.
28. **불쾌한 조각·오답(★ 꼭 바꿀 것)**

    | id | 조각/오답 | 왜 | 대안 |
    |---|---|---|---|
    | ★ w-immediately | `intimately`(dEn) | 성적인 뜻 — 앞 주제에서 지적됨 | `intensely` |
    | ★ w-protect | `pot`(decoy) | 마리화나 은어 | `pat` |
    | ★ w-position | `pot`(decoy) | 같음 | `pat` |
    | ★ w-procedure | `pot`(decoy) | 같음 | `pat` |
    | ★ w-sign | `sin`(decoy) | '죄' | `sine` |
    | ★ w-seriously | `lie`·`sir`(decoy) | '거짓말'(진지하게 받아들인다는 문장과 상극) | `lay`·`sea` |
    | ★ w-liter | `lie`(decoy) | 같음 | `lid` |
    | ★ w-usually | `sue`(decoy) | 소송 — 병원 앱에서 민감 | C-27로 해결 |
    | ★ w-point | `pint`(decoy) | 맥주 한 잔(술) | `pins` |
    | ★ w-pull | `pall`(decoy) | 관 덮는 천(장례) | `poll` |
    | (선택) w-eye | `dye`(decoy) | die와 소리가 같음(장례) | `aye` |
    | (선택) w-nicardipine | `nip`(decoy) | 술 한 모금 | `nick` |
    | (선택) w-bleed | `breed`(decoy) | 교배 | `bread` |
    | (선택) w-number | `bar`(decoy) | 술집 | `bee` |
    | (선택) w-bump | `dump`(dEn) | 배변 속어 | `thump` |
    | (선택) w-chest | `cheat`(dEn) | 부정행위 | `crest` |
    | (선택) w-decide | `deride`(dEn) | 조롱 | `decode` |
    | (선택) w-vitamin | `victim`(dEn) | 피해자 | `vision` |
    | (선택) w-control | `troll`(decoy) | 인터넷 비하어 | `role` |
    | (선택) w-surgery | `sorcery`(dEn) | 마술 | `surgeon`만 남기고 `scenery` |

    (`pleasure`·`warfare`·`angel`·`moan`은 흔한 일상어라 둠.) 바꾼 뒤 `_rvA_icu-stroke-icu_chips.py`로 재조립 검사를 다시 돌리세요.
29. **품사가 다른 distractorsEn**(대안은 길이 규칙 검사 통과). ★는 꼭 바꿀 것 — 고르기 화면에서 품사만으로 걸러짐.

    | id | 정답(품사) | 다른 품사 오답 | 대안 |
    |---|---|---|---|
    | ★ w-check | check(동) | chick·cheek(명) | `[chuck, choke]` |
    | ★ w-tell | tell(동) | tall(형) | `[sell, yell]` |
    | ★ w-follow | follow(동) | fellow(명)·hollow(형) | `[allow, bellow]` |
    | ★ w-answer | answer(동) | anger·ankle(명) | `[anchor, ensure]` |
    | w-mean | mean(동) | meal(명) | `[mend, lean]` |
    | w-little | little(형) | liter(명) | `[limited, brittle]` |
    | ★ w-swallow | swallow(동) | shallow(형) | `[wallow, swirl]` |
    | w-lung | lung(명) | long(형) | `[lunch, lump]` |
    | ★ w-thirsty | thirsty(형) | thirty(수) | `[thrifty, thorough]` |
    | w-try | try(동) | dry(형) | `[cry, pry]` |
    | w-wet | wet(동) | web(명) | `[wed, whet]` |
    | w-swab | swab(동) | swan(명) | `[swap, swat]` |
    | w-sign | sign(명) | sing(동) | `[sigh, sight]` |
    | w-discomfort | discomfort(명) | disconnect(동) | `[discontent, discount]` |
    | w-bed | bed(명) | bad(형) | `[bid, bud]` |
    | ★ w-small | small(형) | smell(명·동)·shall(조동) | `[smart, shallow]` |
    | ★ w-open | open(동) | oven(명) | `[offer, ripen]` |
    | ★ w-full | full(형) | fill(동)·foil(명) | `[foul, dull]` |
    | w-page | page(동) | sage(명) | `[pace, pave]` |
    | ★ w-equal | equal(형) | equip(동)·eagle(명) | `[eager, equine]` |
    | ★ w-well | well(부) | wall(명)·will(조동) | `[ill, still]` |
    | w-under | under(전) | upper(형) | `[until, after]` |
    | ★ w-soon | soon(부) | son·moon(명) | `[since, often]` |
    | w-safe | safe(형) | save(동) | `[sane, sage]` |
    | w-start | start(동) | smart(형) | `[stare, stall]` |
    | w-send | send(동) | sand(명) | `[spend, lend]` |
    | ★ w-stat | stat(부) | stack·stag(명) | `[PRN, daily]`(같은 분야 빈도 표현) |
    | w-pull | pull(동) | pill(명) | `[poll, peel]` |
    | w-back | back(부) | pack·bark(명) | `[aback, about]` |
    | w-steady | steady(형) | study(명·동) | `[sturdy, seedy]` |
    | ★ w-narrow | narrow(동) | arrow·marrow(명) | `[harrow, furrow]` |
    | w-write | write(동) | rite(명) | `[wrap, writhe]` |
    | w-early | early(부) | earn(동) | `[nearly, yearly]` |
    | w-pneumonia | pneumonia(명) | pneumatic(형) | `[ammonia, pneumothorax]` |
    | w-portable | portable(형) | portrait(명) | `[potable, notable]` |
    | w-member | member(명) | remember(동) | `[number, ember]` |
    | ★ w-transfer | transfer(명) | transform·transcribe(동) | `[transit, transfusion]` |
    | ★ w-get | get(동) | jet·gut(명) | `[set, let]` |
    | ★ w-imaging | imaging(명) | damaging(형)·managing(동) | `[imagining, paging]` |
    | ★ w-weak | weak(형) | week·wick(명) | `[meek, bleak]` |
    | w-suite | suite(명) | sweet(형) | `[suit, site]` |
    | ★ w-fast | fast(부) | fact·fist(명) | `[past, last]` |
    | ★ w-hold | hold(동) | hole·hood(명) | `[fold, halt]` |
    | w-chest | chest(명) | cheat(동) | `[chess, crest]` |
    | w-wish | wish(동) | wisp(명) | `[wash, whisk]` |
    | w-together | together(부) | tougher(형) | `[altogether, forever]` |
    | ★ w-focus | focus(동) | forum·locus(명) | `[force, fuss]` |
    | w-instead | instead(부) | insight(명) | `[indeed, inside]` |
    | (A-2·A-6 반영 시 지워짐) w-first·w-push | first(부)·push(동) | thirst·fist(명), plush·posh(형) | — |

    (`close`(부)↔`loose`, `blood`↔`blond`, `feel`↔`fell`처럼 같은 품사로도 쓰이는 것은 둠.)
30. **`w-swab`** ko `면봉으로 닦다`·cue "막대 끝의 솜으로" — 문장 2.5는 스펀지를 적셔 닦음(구강 스펀지 스왑). → ko `닦아 내다`, cue "막대 끝 스펀지를 적셔 입 안을 문질러 닦을 때".
31. **`w-respiratory`** ko `호흡의` — 문장 19.1 `call respiratory`는 호흡치료팀(RT). → ko `호흡치료팀`, cue "산소·기도 장비를 맡는 치료팀을 줄여 부를 때", distractorsKo `[영상의학팀, 재활치료팀]`, distractorsEn은 그대로(`laboratory`가 명사로 맞음).
32. **`w-stroke`** distractorsKo `간질` — 낙인 때문에 바뀐 옛 용어. → `뇌전증`.
33. **`w-bump`** cue "걷다가 모서리 같은 곳에 쿵 닿을 때" — 문장 12.3은 발작 중. → "몸이 갑자기 움직이다 난간이나 물건에 쿵 닿을 때".
34. (선택) **`w-tube`** cue는 영양관만 — 18.4는 기관내관. → "몸속에 넣는 가늘고 긴 관 — 영양을 넣거나 숨길을 잡을 때".
35. (선택) **`w-second`** cue "시간의 가장 작은 단위" — 사실이 아님. → "1분을 예순으로 나눈 짧은 시간, '…하는 즉시'를 뜻할 때도 씀".
36. (선택) **`w-notify`** ko `연락해 알리다`가 `w-call`(연락하다)과 거의 같음 → ko `통보하다`.

### D. 결정 11

**판정: 저작자의 변경은 과하지 않습니다.** 쉬운 말 지움 20개 = 공통 목록 14개(hand·time·see·know·bad·hour·head·doctor·minute·go·day·come·room·good) + 판단분 6개(make·way·easy·later·talk·want, 모두 간호사가 아는 말). ko 조정 15건(약 6%)은 건마다 같은 ko 단어와 가르거나 문장 쓰임에 맞춘 것이고, 헤드워드 2건(`turn down`·`rule out`)은 옳습니다. 태그만 뺀 문장 49건 중 약 26건은 "헤드워드 뜻과 문장 쓰임이 다름"(bring down·keep -ing·call button·get ready·last known well 등)이라 오히려 정확해졌습니다. 은행에는 여전히 eye·mouth·nose·lip·water·bed·food 같은 아주 쉬운 말이 남아 있지만 V3(상황당 8단어) 때문에 더 빼라고 하지는 않습니다.

다만 고칠 것:

37. **example 3건이 그 뜻으로 태그하지 않는 문장을 가리킴**(태그를 뺀 문장이 예문으로 남음):
    - `w-bring` example 1.2(`bring the pressure down`) → 14.1 `I'll bring the portable oxygen and emergency meds.` / exKo `휴대용 산소와 응급 약을 챙겨 올게요.`
    - `w-clear` example 2.4(`clears you` — 동사) → 5.3 `Even though his words aren't clear, he can still understand you.` / exKo `말이 또렷하지 않아도 알아들으실 수 있어요.`
    - `w-call` example 3.5(`call button`) → 6.1 `I'm checking her neuro exam and calling the physician now.` / exKo `신경학적 검진을 확인하고 지금 의사 선생님께 연락드릴게요.`
38. **`w-sort`** ko `해결하다` — 문장 6.5는 `sort this out`. → en `sort out`, ipa `/sɔrt aʊt/`, chips `[[sort], [out]]`, decoyChips `[sore, "on"]`, distractorsEn `[set out, sit out]`, distractorsKo 그대로(`미루다`·`외면하다`). id 유지, changes에 `fields: [en, ipa]`.
39. (권장) **`last known well` 단어 추가** — 뇌졸중 인계의 핵심 용어인데 17.5에서 `w-last`·`w-well` 태그를 빼면서 가르치지 않게 됐습니다(뺀 것은 맞음). → word-add `w-last-known-well`: en `last known well`, ko `마지막 정상 확인 시각`, cue "증상이 없던 것이 마지막으로 확인된 때 — 재관류 치료 판단의 기준", chips `[[last], [known], [well]]`, decoyChips `[lost, know]`, distractorsEn `[last known dose, first known well]`(`last seen well`은 같은 뜻이라 쓰지 말 것), distractorsKo `[마지막 투약 시각, 첫 증상 발생 시각]`. 17.5 words에 추가.
40. (선택) 14.5 `Let's aim to leave in the next ten minutes.`는 words가 `[]` — 가르치는 말이 없습니다. 태그할 말이 없으면 그대로 둬도 되지만, `aim`(목표로 하다)을 단어로 만들어 태그할 수 있습니다.

keyPhrase **ko만** 고칠 것(결정 11 범위 — changes에 `fields: [ko]`, 딸린 단어 exKo도, distractorsKo 둘도 새 ko 틀로):
41. 19.2 `Keep bagging while we prepare for support.` ko `지지 치료를 준비하는 동안…` — 여기 support는 호흡 보조(삽관·기계환기). → `호흡 보조를 준비하는 동안 계속 백으로 호흡시켜 주세요.`
42. (선택) 2.2 ko `건조한 게 낫도록` → `입이 마른 게 나아지도록 입술과 입 안을 촉촉하게 해 드릴게요.`(swap ko도 이미 '나아지도록'). 17.0 ko `즉시 혈관조영을 위해 준비시키죠` → `지금 바로 혈관조영 준비를 하죠.`

### E. keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| 문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 4.1 | `This position also helps blood flow to your brain.` | 허혈성 뇌졸중에서 머리 거상이 뇌혈류에 도움이 된다는 근거가 약함(HeadPoST: 눕힘과 30° 차이 없음, 눕히면 오히려 혈류 속도가 오른다는 보고). BED 1은 재관류 후 허혈성 환자 | `This is the position your team ordered to keep you safe.` (words `[w-position]`; w-flow는 11.2에 남음) | **바꿈** |
| 16.0 | `Stop the tPA and start reversal immediately.` | 점적 중단은 프로토콜상 간호사가 하지만, 역전 시작은 처방. 간호사 학습자가 명령형으로 역전을 지시 | `Stop the tPA and get the reversal orders now.` (words `[w-stop, w-tpa]` + w-start·w-reversal·w-immediately 중 남는 것) — N16 swap `before`(`Stop the tPA and ` + `start reversal` + ` immediately.`)도 같은 틀이라 함께 | **바꿈** |
| 10.0 | `Yes, let's prepare the reversal agent and vitamin K now.` | 준비는 처방 전에 해 둘 수 있음 | — | **유지** |
| 8.1 | `Please titrate the nicardipine slowly and recheck in five minutes.` | 동료에게, 적정은 처방·프로토콜 안에서 | — | **유지** |
| 16.2 | `Let's control his blood pressure right now.` | 목표 수치 없음(처방대로) | — | **유지** |
| 19.0 | `Suction his airway and let's raise the FiO2.` | 산소 설정은 처방·RT와 | — | **유지** |
| 9.2 | `A speech therapist will evaluate her swallowing soon.` | `soon`이 약속처럼 들릴 수 있으나 가벼움 | — | **유지** |

keyPhrase chunks 구 경계 — **보고만**(en·chunks 고치지 않음): 2.0 `safely before / you drink`, 5.1 `letting me / know`, 5.2 `how he / responds`, 11.0 `to watch / you closely`, 13.1 `the whole / time`, 17.2 `I'll call / report`, 20.0 `I'll be / honest`, 20.2 `he would have / wanted`.

## 태그 정리 확인 (V15)

지우는 단어(`w-first`·`w-push`, 선택 시 `w-soft`)를 뉘앙스 `words:`와 스크립트로 대조했습니다 — 어느 뉘앙스도 이들을 가리키지 않아 깨지는 것 없음. `w-normal`은 새 3.4에 남고, `w-little`은 1.3·4.3·13.5와 N1 slider에 남습니다. 새로 태그하는 `w-team`(20.4)·`w-close`(15.5)·`w-send`·`w-stat`·`w-ready`(10.3)·`w-therapist`·`w-decide`(9.4)·`w-give`(16.4)는 모두 은행에 있는 단어입니다.

## 종합

고칠 것 42건(그중 안전 5건: A-1·A-2·A-3·A-4·B-18; 선택 표시 포함). keyPhrase 결정 7건(바꿈 권고 2·유지 5). 뉘앙스 why·notes는 혈전용해 후 출혈 의심 즉시 보고, 금식 중 구강 관리, 역전·혈압 적정은 처방대로, 신경외과 판단을 대체로 바르게 다룹니다. 위 안전 5건과 A-5~11, B-17·19·20·23~25, C-27·28·29의 ★·30~33, D-37·38·41을 반영하면 내보내도 됩니다.
