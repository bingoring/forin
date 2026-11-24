# core-handoff-icu — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `core-handoff-icu.yaml`(A·B 합본). 단어 204(base 249, 46 삭제·1 추가), 상황 21(문장 105), 뉘앙스 57(slider 20 · pair 16 · context 16 · swap 5 · reel 0).
비교: base·changes(122건: word-remove 46 · word 10 · word-add 1 · sentence 65 — 문장 65건은 전부 `words`만 바꿈, en·ko·chunks 변경 없음)·in-json·notes-A·notes-B.
임시 스크립트 `rv_core-handoff-icu_dump.py`(words / sents / nuance / checks / swap / context / stats), 출력 `_rv_core-handoff-icu_*.txt`.
번호는 "상황 번호.문장 번호"(둘 다 0부터, notes-A와 같음). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 철자·소리 닮음이 좋음(mg↔mL↔mcg, VF/AF, wean/wane). 품사가 다른 것 ★4, grab의 오답 grasp·grip이 거의 동의어 |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과(스크립트). 정답이 둘이 되는 뜻은 못 찾음 |
| 3 cue | 4 | 정답 노출 없음. ko를 되풀이한 것은 w-confirm("확인") 1개(w-med는 한 글자라 무시) |
| 4 chips/decoyChips | 3 | 자르기는 대체로 좋음. 술 조각 3(ale×2·gin)·대마 1(pot)★, 형태소와 어긋난 자르기 3 |
| 5 뉘앙스·문장 사실 | 3 | 뉘앙스 why는 대체로 정확(NSVT 30초, near miss, nasal cannula 6 L, RASS −1, 담당의 호출·RRT 안 씀). 문장: MRSA 격리 해제를 swab 음성 하나로 단정(4.4), 승압제 시작 지시(KP 14.0), 기관지경 뒤 X-ray를 '관 위치 확인'으로 설명(pair·KP 13.3) |
| 6 뉘앙스 설계 | 3 | OR pair 정답 둘(anesthesiologist keeps him sedated), ED pair decoy가 fluid·antibiotic에 붙음, context 3개(tolerate·line·site)는 그 낱말 자체가 아니라 덧붙인 다른 용어 때문에 어색 |
| 7 결정 11 | 4 | 46개 삭제(18%)는 거의 다 간호사가 이미 아는 말이라 과하지 않음. 남은 흠: vital 헤드워드, orient 헤드워드, hourly(문장은 two-hourly) |

## 사실 오류·심각한 문제
1. **[안전] 4.4 "Keep her on isolation precautions until the swab comes back negative."** + why "until 뒤에 끝낼 기준(검체 음성)을 붙여야". 미국 병원에서 MRSA 접촉주의 해제는 **감염관리(infection prevention) 정책**으로 정합니다(여러 번 연속 음성 배양을 요구하거나, 아예 입원 중 해제하지 않는 곳이 많음). 간호사끼리 "swab 하나 음성이면 해제"로 넘기면 조기 해제로 전파 위험 → S1. (keyPhrase 아님 — 고침)
2. **[범위·KP] 14.0 "If his MAP drops below sixty-five, start pressors and call me."** 승압제 시작은 처방(또는 처방된 titration·프로토콜) 아래의 일인데 간호사 인계에서 조건부 지시로 넘김 → K3. why에도 처방 전제가 없음(S9).
3. **[범위·KP] 15.3 "I need you to push fluids while I call the doctor."** 수액 볼루스는 처방·프로토콜 하의 행동. pair why에는 "처방이나 프로토콜에 따라"가 있으나 문장 why에는 없음 → K4(유지 권고) + S8(why 보강).
4. **[사실] 기관지경 뒤 흉부 X-ray = "관 위치 확인"** — pair(상황 13) why "X-ray는 관의 위치를 확인할 때 쓰고"와 KP 13.3 "for placement". 기관지경(특히 생검) 뒤 흉부 X-ray는 보통 **기흉 확인**용입니다. 이 장면에 새로 넣은 관이 없으면 사실과 어긋남 → N3, K1.
5. **[문법·KP] 13.3 "Repeat her chest X-ray was ordered…"**(Repeat가 동사 자리) → K1. **[부자연·KP] 20.3 "If two go off at once"** — 환자에게 go off는 쓰지 않음(경보가 울린다는 뜻으로 들림) → K2.
6. **[ko 오역] 15.2 "a second pair of hands" → "손이 두 사람 더"** — 한 사람 더입니다 → S2. (distractorsKo "세/다섯 사람 더"도 같이 틀림)

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en을 바꾸면 `chunks`·`ko`·`words`도 함께 바꾸고, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 같은 문장을 쓰는 order 줄·단어 example도 맞추고, `changes-core-handoff-icu.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 그 문장의 **distractorsKo 둘을 새 ko에 맞춰 다시** 쓰세요.

- **S1 [안전] 4.4** · en `Keep her on isolation precautions until infection control reviews her swabs.` · chunks `Keep her on / isolation precautions / until infection control / reviews her swabs / .` · ko `감염관리팀이 검체 결과를 보고 판단할 때까지 격리주의를 유지해 주세요.` · words `[w-keep, w-isolation, w-precaution, w-swab]` → **w-negative는 어느 문장도 태그하지 않게 되어 은행에서 삭제**(word-remove; 상황 4는 서로 다른 단어 18개로 V3 충족). w-swab은 남으니 상황 4 pair(the swab ↔ sent to the lab)는 그대로. v46 전부 새로(blank 지금 answer `negative` — 새 문장에 없음). why 새로: "격리를 언제 풀지는 간호사가 검체 한 번으로 정하지 않고 감염관리팀이 병원 정책에 따라 정해요. 인계에서는 해제 기준을 누가 정하는지까지 넘겨요." order 4번 줄에는 이 문장이 없어 연쇄 없음.
- **S2 [ko·chunks] 15.2** · en 그대로 · chunks `His pressure's crashing / — I need / a second pair of hands / now / .`(지금 `a second pair / of hands`는 관용구를 끊음) · ko `혈압이 급격히 떨어지고 있습니다, 지금 도와줄 사람이 한 명 더 필요합니다.` · distractorsKo 새로(예: `심박수가 급격히 떨어지고 있습니다, 지금 도와줄 사람이 한 명 더 필요합니다.` / `혈압이 급격히 떨어지고 있습니다, 지금 장비가 한 세트 더 필요합니다.` — 사람 수를 바꾸는 오답은 "second"와 헷갈려 쓰지 말 것). chunks가 바뀌니 decoy도 확인 — 지금 decoy `of eyes`는 조립하면 "a second pair of eyes"(다른 사람이 봐 주기)라는 자연스러운 영어가 됨 → B 검토 참고, 다른 decoy로.
- **S3 [부자연] 14.4** "a full run of VT"는 쓰지 않는 말(지속성은 sustained VT) · en `Don't wait for sustained VT before you escalate.` · chunks `Don't wait / for sustained VT / before you escalate / .` · ko `지속성 심실빈맥이 될 때까지 기다리지 말고 먼저 상급 보고하세요.` · words 그대로 `[w-vt, w-escalate]`. v46 새로(why: "sustained VT는 30초 넘게 이어지거나 혈압이 떨어지는 VT예요. 그 전, 짧은 run이 보일 때 먼저 알려요."; distractorsKo는 새 ko 틀로). **order 14 둘째 줄** `Because of that, don't wait for a full run of VT…` → `Because of that, don't wait for sustained VT before you escalate.` 같은 상황 slider(`sustained VT`)와도 맞음.
- **S4 [ko·KP 문장의 ko만] 13.3** ko `위치 확인을 위해 흉부 엑스레이 재촬영이 오더났습니다.`(구어 '오더났다') → `위치 확인을 위해 흉부 엑스레이 재촬영이 처방되었습니다.` distractorsKo 둘도 "처방되었습니다"로. order 13 둘째 줄 ko `…재촬영이 오더났어요` → `…재촬영이 처방됐어요`. (en은 K1에서 결정. K1에서 기흉 쪽 대안을 고르면 ko도 그에 맞춤)
- **S5 [ko·KP 문장의 ko만] 0.0** ko `상황: 그는 60세, 패혈증 2일째입니다.` — 한국어 인계에서 "그는"은 번역투 → `상황: 60세 남자 환자, 패혈증 2일째입니다.` distractorsKo 둘 새 ko 틀로.
- **S6 [chunks] 구 경계를 끊은 조각(en 그대로; blank·decoy가 걸리면 함께 확인)**
  - 0.3 `I'll walk you / through the background` → `I'll walk you through / the background first / , then the assessment / .`
  - 1.2 `What's her current / pressor and sedation / dose` → `What's / her current / pressor and sedation dose / ?`
  - 2.4 `if suction stops / working` → `Watch the NG output / and let me know / if suction / stops working / .`
  - 3.1 `around the weaning / trial` → `Her biggest issue tonight / is anxiety / around / the weaning trial / .`
  - 6.4 `for the first / hour` → `Neuro checks are due / every fifteen minutes / for the first hour / .`
  - 7.1 `and a small / propofol drip` → `He's on norepinephrine / and a small propofol drip / right now / .`
  - 13.1 `since she / got back` → `Her oxygen / has been stable / since she got back / .`
  - 20.2 `and his / morning labs` → `Bed 8 / just needs routine checks / and his morning labs / .`
  - (15.2는 S2, 14.4는 S3에 포함)
- **S7 [연동·order] order 20 넷째 줄** `If two of them go off at once, call for help early.` → `If two of them get worse at once, call for help early.`(같은 상황 swap `before`와 같은 말). K2를 유지로 정해도 order 줄은 keyPhrase가 아니니 바꿈. K2에서 crash 대안을 고르면 그 문장과 맞춤.
- **S8 [범위·KP 문장의 why] 15.3** why 새로(en은 K4): "I need you to …로 상대가 할 일을 하나로 정해 줘요. 수액 급속 주입은 처방이나 패혈증 프로토콜이 있을 때 하는 일이라, 의사를 부르는 일과 동시에 맡겨요." w-push cue "주사기나 백을 눌러 약이나 수액을 빠르게 넣는 일"에도 "처방대로"를 덧붙이면 좋음.
- **S9 [범위·KP 문장의 why] 14.0** why 새로(en은 K3): "If … drops below + 수치로 부르는 기준을 숫자로 정해요. 승압제는 처방된 기준(titration order)대로 시작·조절하고, 기준을 넘으면 바로 알려요." **order 14 셋째 줄** `…start pressors and call me.`도 K3 결정에 맞춤.
- **S10 [exKo] w-placement** example `The X-ray was ordered for placement.` exKo `위치 확인을 위해 엑스레이를 찍었어요.` — ordered ≠ 찍었다 → `위치 확인을 위해 엑스레이가 처방됐어요.`
- 판정만(notes-A): 상황 16.0 "round three" — 코드 주기를 round라고도 부름, 유지. 5.0 헤파린 12 U/kg/h — ACS 용량과 맞음, 유지. 15.4 "I'll page anesthesia"는 15.1 "Airway's secure"와 한 상황 안에서 어긋나 보이지만 문장끼리 독립이라 유지.

## 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)
KP en을 바꾸기로 하면 `in-core-handoff-icu.json`의 `keyPhrases` 같은 문자열도 함께 바꿔야 V4가 통과합니다. chunks·ko·words·v46 필드·example·order 줄 연쇄는 위 문장과 같음.

| # | 문장 | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| K1 | 13.3 `Repeat her chest X-ray was ordered for placement.` | 문법 오류(Repeat가 동사 자리). 기관지경 뒤 X-ray는 보통 기흉 확인용이라 "placement"도 장면과 어긋남 | ① `A repeat chest X-ray was ordered for placement.`(order 13 둘째 줄이 이미 이 꼴) ② `A repeat chest X-ray was ordered to rule out a pneumothorax.` | **바꾸기 — ①**(문법만 고치고 w-placement 유지). 장면을 기관지경에 맞추려면 ②(그때 w-placement 은행 삭제, pair 13 X-ray 짝도 N3대로) |
| K2 | 20.3 `If two go off at once, call for help early.` | 환자에게 go off는 안 씀(경보가 울린다로 들림) | `If two of them crash at once, call for help early.` (words `[w-crash, w-call]`) | **바꾸기**. order 20 넷째 줄도(S7) |
| K3 | 14.0 `If his MAP drops below sixty-five, start pressors and call me.` | 승압제 시작을 처방 전제 없이 인계로 지시(업무 범위) | `If his MAP drops below sixty-five, start pressors per the order and call me.` | **바꾸기(약)** — 유지하더라도 why는 S9대로. order 14 셋째 줄 함께 |
| K4 | 15.3 `I need you to push fluids while I call the doctor.` | 볼루스는 처방·프로토콜 하의 행동 | `I need you to start the fluid bolus while I call the doctor.`(범위 문제는 그대로) | **유지** — 급변 중 패혈증 프로토콜 아래 흔한 말이고 push가 가르칠 말. why만 S8대로 |
| K5 | 10.2 `Labs are due at four, and he's on a two-hourly neuro check.` | two-hourly는 영국·호주식. 미국은 `q2 neuro checks`·`neuro checks every two hours`. w-hourly(매시간의)와 문장 뜻(2시간마다)도 어긋남 | `Labs are due at four, and he's on neuro checks every two hours.` | **바꾸기(약)** — w-hourly 은행 삭제(상황 10은 20개 남음), w-hourly example `He's on a two-hourly neuro check.`도 사라짐. order 10 셋째 줄 함께 |
| K6 | 1.0 `She's on norepinephrine at eight, …` | 속도 단위가 없음(mcg/min) — 상황 5 slider가 "숫자와 단위를 함께"를 가르침 | `She's on norepinephrine at eight micrograms a minute, …` | 유지(현장 인계에서 흔한 생략) |
| K7 | 20.0 `…needs the closest eye.` | 관용구는 keep a close eye on; needs the closest eye는 약간 어색 | `…needs the closest watch.` | 유지 |
| K8 | chunks가 구를 끊은 KP(보고만): 1.0 `titrating to a MAP / of sixty-five`, 1.3 `for the last / two hours`, 2.0 `and a left / radial art line`, 2.1 `is to low / suction`, 3.0 `watch her / weaning trial`, 4.1 `allergy / flag on / her chart`, 7.2 `and last / pressor doses`, 8.4 `and hold / parameters`, **12.2 `pressors coming / up / from the ED`**(구동사를 끊음), 12.3 `and last / vitals` | — | — | chunks는 KP 문장도 en이 같으면 바꿀 수 있는지 규칙 확인 필요. 바꿀 수 있으면 12.2부터 |

## 고칠 것 — 뉘앙스

### pair (16개 전부 조합 출력해 판정 — `_rv_core-handoff-icu_checks.txt`)
- **N1 ★ [정답 둘] 상황 7 OR→ICU** `the anesthesiologist` + `keeps him sedated`도 맞는 영어이고 사실(수술 중 마취과 의사가 재움). `holds his pressure up`도 수술실에서는 성립. → 짝을 바꿈: pairs `[[propofol, keeps him sedated], [norepinephrine, holds his pressure up], [estimated blood loss, how much he bled in surgery]]`, decoys `[how long he was asleep]`, words `[w-propofol, w-norepinephrine, w-estimate, w-loss]`. why 새로("EBL은 수술 중 잃은 피를 어림한 값이라 '얼마나 흘렸나'와 짝").
- **N2 ★ [decoy가 붙음] 상황 12 ED→ICU** decoy `turned off at noon` — `fluid turned off at noon`(유지 수액을 정오에 끔)·`antibiotic turned off at noon`이 성립. → decoy `a type of white blood cell`.
- **N3 [사실·정답 둘] 상황 13 검사·시술 후** `the X-ray / checks tube placement` — `bronchoscopy checks tube placement`도 성립(기관지경으로 기관튜브 위치 확인)하고, 기관지경 뒤 X-ray는 보통 기흉 확인용. → `[the X-ray, rules out a pneumothorax]`, why "X-ray는 시술 뒤 기흉이 없는지 확인하려고 찍어요". (K1을 ①로 유지하면 장면 why와 어긋남 — 그때도 pair는 이렇게 바꾸는 것을 권장)
- **N4 [경계] 상황 8 cath lab** `the sheath monitored with the ACT` — 시스 제거 시점을 ACT로 정하므로 헷갈림. → heparin 짝을 `thins the blood`로(`the sheath thins the blood`·`a hematoma thins the blood`는 안 됨). why의 ACT 설명은 유지.
- **N5 [권장] 상황 0 SBAR** `what is happening right now`(S)와 `what I think is going on`(A)이 비슷하게 읽힘 → A 짝을 `what I think the problem is`로.
- **N6 [권장] 상황 15 급변** decoy `a cold coffee` — 한눈에 틀리고 장면과 동떨어짐 → `the lab results`(push/page/secure 어느 것에도 안 붙음).
- 나머지 10개(1·2·3·4·5·6·10·11·14·16)는 정답 하나만 성립. 1·10·15는 동사+목적어 짝과 명사+서술 짝이 섞여 문법으로 답이 보이는 약점이 있으나 고칠 정도는 아님.

### slider (20개)
- 전부 약함→강함 순서가 말이 되고 cue로 답이 하나. 사실 확인: 패혈성 쇼크(수액 뒤 승압제), CVC 드레싱은 젖거나 들뜨면 즉시 교체(CDC), NSVT ≥3박·<30초, near miss = 환자에게 닿기 전 잡은 오류, nasal cannula ≤6 L/min, RASS −1, 상황 10 "page the resident"(ICU 안에서는 RRT가 아니라 담당의 호출) — 모두 맞음. 고칠 것 없음.

### context (16개 — 듣는 사람이 모두 다름 확인: ok 두 장면은 동료·의사, 어색한 장면은 환자/가족)
- **N7 ★ [그 말이 어색하지 않음] 상황 11 `tolerate`** — "He's tolerating the breathing trial"은 가족에게도 흔히 쓰는 말. why도 spontaneous breathing trial·pressure support를 탓함. → word `extubation`, ko `발관`, words `[w-extubation]`: 회진 발표 `Plan: reassess extubation tomorrow.`(ok) / 인계받는 간호사 `Extubation is planned for tomorrow if she passes her trial.`(ok) / 가족에게 `We'll reassess extubation tomorrow.`(ok: false, fix `Tomorrow we'll see if she's ready to have the breathing tube taken out.`). why: "의료진끼리는 extubation이 정확하지만 가족에게는 낯선 말이라 '호흡관을 빼다'로 풀어요."
- **N8 [그 말이 어색하지 않음] 상황 7 `line`** — 가족에게도 "IV line"은 흔함. 어색함은 radial·IJ·zeroed에서 옴. → word `estimated blood loss`, ko `추정 출혈량`, words `[w-estimate, w-loss]`: 마취과 의사에게 `Estimated blood loss was about three hundred, right?`(ok) / 동료 간호사 `Estimated blood loss was minimal, and he got no blood.`(ok) / 가족에게 `His estimated blood loss was three hundred milliliters.`(ok: false, fix `He lost only a little blood during surgery, which is expected.`). N1과 같은 단어를 다루게 되니 N1을 다른 짝으로 하려면 이쪽만 바꿔도 됨.
- **N9 [권장] 상황 8 `site`** — 환자에게 "the site"는 쓸 수 있는 말. 세 장면에 모두 있는 `access site`를 word로(ko `접근부위`), 어색한 장면에서 hematoma·distal pulses를 빼고 `Your access site is intact.`로 — 그 말 하나로 어색해지게. why도 access site를 탓하게.
- **N10 [권장] 어색한 장면에 다른 용어를 덧붙여 답이 그 용어로 보이는 것** — 상황 3 (borderline·wean) → `Your respiratory status is still weak, so we'll go slowly today.`; 상황 4 (contraindicated) → `You had anaphylaxis to penicillin, so we won't give it to you.`; 상황 13 (lavage) → `Your bronchoscopy is done, and the samples are sent.`; 상황 14 (attending·MAP) → `I'm escalating his case to the doctor right away.`. 각 why도 대상 단어를 탓하게.
- 나머지(0 SBAR·1 titrate·2 NG·6 ROSC·9 wean·10 pressor·12 lactate·15 crash·16 PEA)는 같은 뜻·듣는 사람만 다름이 맞고 핸드오프 장면 모양도 맞음. why 사실 문제 없음(crash를 가족에게 쓰지 않는 이유, PEA 설명 정확).
- **판정(notes-A): 쉬운 말 상황 5·17·18·19·20을 context 대신 swap으로** — 타당. 이 상황들의 단어(catch·rate·stable·correction·DNR·call)는 듣는 사람에 따라 어색해지는 임상어가 아니거나(19 DNR은 swap이 이미 같은 내용) 낱말 자체가 쉬움. V14(STEP 2 1개 이상)도 swap으로 충족.

### swap (5개 — `before[0]+선택지+before[2]` 전부 출력, 문법 전부 맞음)
- 5 (Huh? / Sorry, could you say that again? / Okay, got it.) · 17 (okay / stable / doing great) · 19 (will stop all care / won't do CPR / will try everything) · 20 (tell somebody… / call for help early / handle it yourself) — ko·notes·why 정확. 19의 "DNR은 치료 중단이 아니다"·20의 "일찍 도움 요청" 모두 사실.
- **N11 [권장] 상황 18 ko** `제 인계를 정정해야 해요. 칼륨 수치는 실제로 6.2예요` — 정답 `Correction to my handoff:`는 명사 머리말이라 `제 인계 정정이에요. 칼륨 수치는 실제로 6.2예요`가 더 맞음. why "correct라고 분명히 말하고" → "correction이라고 먼저 분명히 말하고".

## 고칠 것 — 단어

### W1 품사가 다른 distractorsEn 전부 (★ = 꼭 바꿀 것)
| 단어(품사) | 오답 | 오답 품사 | 바꿀 말 |
|---|---|---|---|
| ★ stable (형) | staple | 명사 | `unstable` (stale은 유지) |
| ★ clean (형) | clamp | 명사·동사 | `lean` (clear 유지) |
| ★ bed (명) | bad | 형용사(쉬운 단어 목록) | `bud` (bid 유지) |
| ★ other (형·대) | mother | 명사(쉬운 단어 목록) | `outer` (either 유지) |
| drain (동) | drawn | 과거분사 | `strain` (drawn은 decoyChips에 이미 있음) |
| change (동) | chance | 명사 | `chafe` |
| fall (명 낙상) | fail | 동사 | `hall` |
| arrest (명) | assist, resist | 동사 | `access`, `unrest` |
| step (명) | steep | 형용사 | `strip` |
| lead (명 유도) | lean | 형용사·동사 | `leak` |
| pressure (명) | pressing | 형용사·동명사 | `posture` |
| feed (명) | feel | 동사 | `fee` |
| order (동) | border | 명사 | `orbit`(동사) |
| kilo (명) | kind | 형용사·명사 | `kiln` |
| respiratory (형) | laboratory | 명사(한정적 형용사 가능) | 유지 가능 |
| round (동·명) | rounder | 명사(사람) | 유지 가능 |

### W2~W8
- **W2 ★ [동의어] w-grab** distractorsEn `grasp`, `grip` — 둘 다 '움켜잡다'로 정답 grab과 뜻이 겹침(cue "얼른 집어 오는 일"을 보고 grasp를 골라도 틀렸다고 하기 어려움) → `[grade, drag]`.
- **W3 [권장·분야] w-imaging** distractorsEn `packaging`, `messaging` — 한눈에 분야 밖 → `[paging, staging]`, distractorsKo `[호출, 병기 판정]`. w-epi distractorsEn `ECG`는 약이 아님 → `epo`(단, w-epi는 듣기용이라 권장).
- **W4 [cue] w-confirm** cue `맞는지 다시 확인해 확실히 해 두는 일` — ko '확인하다' 되풀이 → `들은 값이 맞는지 되짚어 틀림없게 해 두는 일`.
- **W5 ★ [불쾌·술·대마 조각] decoyChips** — w-allergic `ale`→`ail`, w-allergy `ale`→`ail`, w-oxygen `gin`→`gem`, w-output `pot`→`pit`.
- **W6 [권장·조각]** w-xray `rye`(위스키 원료) → `rey`; w-unit `nut`(속어) → `knit`. w-dry·w-diuresis `dye`(die와 소리 같음)는 유지 가능. 나머지 decoyChips·distractorsEn 전부 비속어·성적·장례 조각 없음(전수 확인).
- **W7 [권장·자르기]** w-recommendation `rec+ommen+dation` → `[[re, commend, ation]]`; w-crash `cr+ash` → `[[crash]]`; w-trend `tr+end` → `[[trend]]`.
- **W8 [권장·tag]** w-diet·w-feed tag `동작`인데 명사(식이·급식) → `상태` 또는 `검사·시술` 쪽 기존 태그로.

## 고칠 것 — 결정 11 (v44 단어)
- **D1 ★ w-vital** 헤드워드 `vital`(형용사)인데 ko `활력징후`·문장 `last vitals` → en `vitals`, ipa `/ˈvaɪtəlz/`, chips `[[vi, tals]]`, distractorsEn `[visuals, vitamins]`(길이 맞음), example 그대로. id 유지.
- **D2 w-orient** 헤드워드 `orient`(동사 '방향을 잡다')인데 ko `지남력이 있다`·문장 `She's oriented` → en `oriented`, ko `지남력이 있는`, chips `[[ori, ent, ed]]`, distractorsEn `[disoriented, obtunded]`, distractorsKo `[지남력을 잃은, 반응이 둔한]`. (분사형이지만 임상에서 형용사로 굳은 말이라 활용형 원형화 규칙의 예외로 봄)
- **D3 w-hourly** — K5를 바꾸면 은행에서 삭제. K5를 유지하면 ko `매시간의`가 문장(2시간마다)과 어긋나니 10.2에서 태그를 빼고 삭제 권장(상황 10은 20개 남음).
- **D4 [권장] w-check** ko `점검하다` — 7문장 중 5문장이 명사(neuro checks, blood sugar checks, routine checks) → `점검(하다)`.
- **D5 [권장] w-estimate** 헤드워드 `estimate`(추정치)인데 문장은 `estimated blood loss` — N8에서 구로 다루면 충분, 헤드워드는 유지 가능.
- **판정: 46개 삭제(18%)** — 공통 목록 13개 + 목록 밖 33개(right·left·sorry·say·need·liter·blood·first·last 등) 모두 간호사가 아는 말이라 과하지 않음. 1할을 넘긴 것은 이 주제의 v44 은행이 쉬운 말로 많이 채워져 있었기 때문으로 타당. `down`(down time)은 코드 인계에서 가르칠 값이 있는 구라 `down time` 헤드워드로 살리는 선택지가 있으나 필수 아님. `second`(ko 초)는 15.2에서 '두 번째'로 쓰여 ko부터 틀렸으니 삭제가 맞음.
- **판정: 새 단어 go through** — 타당. 쉬운 낱말 go가 아니라 "Let's go through his SBAR"의 구동사로 가르칠 값이 있고 V3 맞춤에 필요. 오답(go along / go under)·ko도 맞음.
- **판정: ko 정리 10개** — 전부 타당(check/confirm, call/page, record/document 구별 등).

## 종합
고칠 것 35건(안전 1 — S1 격리 해제, 업무범위 2 — S8·S9 why). 꼭 고칠 것: S1·S2·S3, pair N1·N2·N3, context N7, W1★·W2·W5, D1. keyPhrase 결정 K1~K3·K5는 바꾸기 권고, K4·K6·K7은 유지 권고.
위를 반영하면 내보내도 됩니다. 뉘앙스 why·notes는 미국 ICU 인계 관행(SBAR, 침상 라인·드립 되읽기, read-back, 담당의 호출)과 대체로 맞습니다.
