# core-family-icu — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `core-family-icu.yaml`(A·B 합본). 단어 190(base 209, 19 삭제·추가 0), 상황 21(문장 129), 뉘앙스 42(slider 20 · context 13 · swap 6 · reel 2 · pair 1).
비교: base·changes(word-remove 19 · word ko 14 · sentence words 56 — 문장 en·ko·chunks 변경 없음)·in-json·notes-A·notes-B.
임시 스크립트 `rv_core-family-icu_dump.py`(words / sents / nuance / pair / swap / context / stats), 출력 `_rv_core-family-icu_*.txt`.
번호는 "상황.문장"(둘 다 0부터, notes와 같음). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 철자·소리 닮음은 좋음(monitor/mentor, surrogate/surrender, infection/injection). 그러나 품사가 다른 오답이 약 60개(★ 40) — 이 주제가 일상어라 소리만 맞춘 결과 |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과(스크립트). 정답 둘 없음. w-respond 오답 `효과를 숨기다`는 뜻이 안 되는 말 |
| 3 cue | 4 | 정답 영어 노출 없음. ko 되풀이 3개(son·video·response), 약한 것 3개 |
| 4 chips/decoyChips | 4 | 자르기 좋음. `pis`(piss) ★, distractorsEn `screw` ★·`orphan`(임종 장면) ★·`rehearse`(hearse) ★ |
| 5 뉘앙스·문장 사실 | 3 | 뉘앙스 why는 대체로 미국 관행에 맞음(결과 설명은 의사, 간호사는 곁·연결, 순서는 주마다). 문장: 간호사 통역(6.4), 윤리위원회가 '결정'(KP 18.2), 간호사가 환자 뜻 단정(7.5), 사후 머무름 무제한 약속(20.5), 이웃에게 '혼자 결정 안 하게'(18.5), 간호사 단독 예후 단정(15.5) |
| 6 뉘앙스 설계 | 3 | slider 3개(allow/require/forbid는 척도 아님, tough<hard 근거 없음, hide 단서가 hold back에도 맞음), context 2개 장면 뜻 불일치, swap 13 '엄마'(장면은 오빠), swap 16 before≠option, 대명사(상황 14·reel 12) |
| 7 결정 11 | 4 | 19개 삭제는 모두 타당. 남은 흠: 공통 쉬운 단어 목록의 `hand`가 그대로 있음, scared ko `무서운`(틀림), overwhelming ko `압도적인`, level ko `수준` |

## 사실 오류·심각한 문제
1. **[범위] 6.4 "…and I'll help translate if needed."** 미국 병원은 언어 접근 규정(Title VI·ACA 1557)에 따라 **자격 있는 의료 통역사**를 씁니다. 간호사가 가족 회의 통역을 맡겠다고 약속하는 것은 자격 확인(이중언어 직원 인증) 없이는 하지 않는 일 → S1. order 6 셋째 줄 연쇄.
2. **[사실·KP] 18.2 "We'll involve the ethics committee to decide in his best interest."** 윤리위원회는 자문·권고 기구입니다. 대리인 없는 환자의 결정 절차는 주 법·병원 정책마다 다르고(주치의+2차 의견, 법원 후견인 등) 위원회가 '결정한다'고 가르치면 틀림 → K1.
3. **[범위] 7.5 "Based on what you've told me, here's what I think he'd want."** 대리 판단(substituted judgment)은 대리결정자가 하고, 간호사는 가치를 끌어내 돕는 역할. 간호사가 "그가 원할 것"을 말하는 장면 → S2.
4. **[지킬 수 없는 약속] 20.5 "You can stay with him for as long as you'd like."** 사후 이송·검시관 사례·OPO 일정·병원 정책으로 제한이 생길 수 있음. why도 "제한이 없다는 느낌"을 장점으로 설명 → S3.
5. **[범위] 15.5 "There's nothing more the treatments can do to reverse this."** 예후 고지는 의사 몫. 간호사가 단독으로 "더 할 게 없다"를 선언하는 꼴 → S4(의사 설명을 다시 짚는 말로). 15.0·15.1(KP)은 'We'로 팀 판단을 전하는 말이라 유지 권고(K4), 15.3은 관찰 묘사라 유지.
6. **[사실] 18.5 "You won't be making this decision alone."** 상황 18은 지정 대리인 없는 환자 곁의 **이웃**("I'm just a neighbor — I don't think I should be the one deciding")이고 18.1 KP가 "the team follows a set process"라 이웃은 결정자가 아님. 이 문장은 이웃이 결정한다고 전제 → S5.
7. **[장면] 상황 14 대명사** — tagline "His son is overseas … to see his dad"(환자=아버지). 14.3 "in her room", 14.4 "so he can see her face"는 환자를 여자로 만듦 → S6. context 14·단어 example 연쇄.
8. **[장면] swap 13 "helping Mommy breathe"** — 상황 13은 "Should I bring his little sister to see him?"(환자=아이의 오빠) → N3.

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en을 바꾸면 `chunks`·`ko`·`words`도 함께 바꾸고, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 같은 문장을 쓰는 order 줄·단어 example도 맞추고, `changes-core-family-icu.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 그 문장의 **distractorsKo 둘을 새 ko에 맞춰 다시** 쓰세요.

- **S1 [범위] 6.4** · en `The doctor will explain things, and an interpreter can translate if needed.` · chunks `The doctor will explain things / , and an interpreter / can translate / if needed / .` · ko `의사 선생님이 설명해 주실 거고, 필요하면 통역사가 통역해 드려요.` · words 그대로 `[w-explain, w-translate]`. v46 새로(why 예: "설명은 의사가, 통역은 자격 있는 의료 통역사가 맡아요. 간호사는 통역사를 부르고 가족이 다 알아들었는지 확인해요."; 지금 blank answer `translate`는 유지 가능하나 오답 `rehearse`는 바꿀 것 — W5). **order 6 셋째 줄** → `At that meeting, the doctor will explain things, and an interpreter can translate if needed.` ko `그 회의에서 의사 선생님이 설명하고, 필요하면 통역사가 통역해 드려요`, order why의 "내가 통역을 돕는다" → "통역사가 통역한다". **w-translate** example `An interpreter can translate if needed.` exKo `필요하면 통역사가 통역해 드려요.`
- **S2 [범위] 7.5** · en `Based on what you've told me, what do you think he would want?` · chunks `Based on what / you've told me / , what do you think / he would want / ?` · ko `말씀해 주신 걸 바탕으로 보면, 그분이라면 무엇을 원하셨을 것 같으세요?` · words `[]`(지금도 빈 목록; 상황 7은 10개로 V3 충족). v46 새로(why 예: "결정의 근거가 되는 환자의 뜻은 가족이 말하게 해요. 간호사는 들은 것을 되짚어 묻기만 하고 대신 정하지 않아요."). **order 7 넷째 줄** 같은 문장으로(셋째 줄도 질문이라 넷째 줄 앞에 `So,`를 붙여 순서 고정: `So, based on what you've told me, what do you think he would want?`).
- **S3 [약속] 20.5** · en `You can stay with him, and I'll tell you before anything needs to happen.` · chunks `You can stay / with him / , and I'll tell you / before anything / needs to happen / .` · ko `곁에 머무르셔도 돼요. 무엇이든 해야 할 때가 되면 미리 말씀드릴게요.` · words `[w-stay]`. v46 새로(why 예: "사후 이송 시각 같은 제약은 병원마다 있어요. 시간을 약속하는 대신, 무엇이 바뀌기 전에 먼저 알리겠다고 말해요."). **order 20 셋째 줄** → `In that time, you can stay with him, and I'll tell you before anything needs to happen.` ko 맞춤. w-stay example 같이.
- **S4 [범위] 15.5** · en `As the doctor explained, the treatments can't reverse this anymore.` · chunks `As the doctor explained / , the treatments / can't reverse this / anymore / .` · ko `의사 선생님이 설명하신 것처럼, 치료로는 더 이상 이걸 되돌릴 수 없어요.` · words 그대로 `[w-treatment, w-reverse]`. v46 새로. distractorsKo 예: `의사 선생님이 설명하신 것처럼, 수술로는 더 이상 이걸 되돌릴 수 없어요.` / `의사 선생님이 설명하신 것처럼, 치료로는 더 이상 이걸 확인할 수 없어요.` → **notes-B의 "방문으로 이걸 되돌릴 방법은…" 오답은 이 수정으로 사라짐**(판정: 방문을 탓하는 말로 직접 읽히지는 않지만, 임종 장면에서 방문과 '되돌리다'를 묶는 것은 부적절 — 바꾸는 게 맞음. 15.0 오답 `방문에 반응하지`도 같은 이유로 B 검토에서 교체 권장). w-reverse example `There's nothing more the treatments can do…` → 새 문장으로.
- **S5 [사실] 18.5** · en `You won't have to make this decision yourself.` · chunks `You won't have to / make this decision / yourself / .` · ko `이 결정을 직접 내리셔야 하는 건 아니에요.` · words `[w-decision]`(w-alone은 5.1·16.0에 남음). v46 새로. **order 18 넷째 줄** → `So you won't have to make this decision yourself.` ko `그러니 이 결정을 직접 내리시지 않아도 돼요`.
- **S6 [대명사] 14.3·14.4** · 14.3 en `The screen and camera are already set up in his room.`(chunks 마지막만 `in his room`, ko 그대로) · 14.4 en `I can angle the camera so his son can see his face clearly.` · chunks `I can angle / the camera / so his son can see / his face clearly / .` · ko `아드님이 아버님 얼굴을 잘 볼 수 있게 카메라 각도를 맞춰 드릴게요.` · words `[w-angle, w-camera, w-son, w-face]`. 두 문장 v46 새로(14.4 지금 오답 `그가 방을…`·decoy `the ceiling clearly` 확인). 연쇄: w-angle·w-face example `…so he can see her face clearly.` → 새 14.4, w-screen·w-camera example `…in her room.` → `in his room`. context 14도 N6. (keyPhrase 14.0·14.1은 남자 환자라 그대로.) 동의 판정(notes-A "I can angle the camera"): 환자를 영상에 비추는 것은 대리결정자 동의·병원 정책 아래 ICU에서 흔한 일 — 문장은 유지, B가 why에 "가족 동의 아래"를 넣으면 충분.
- **S7 [ko·KP 문장의 ko만] 2.1** ko `그에게 필요한 지지를 천천히 줄여가고 있어요.` — '지지'는 정서적 지지로 읽힘(여기 support는 호흡·순환 보조) → `그분께 필요한 보조 치료를 천천히 줄여 가고 있어요.` distractorsKo 둘 새 ko 틀로(지금 `그의 가족에게 필요한 지지를…`은 새 틀에 안 맞음). ('생명 유지'는 en보다 무거워 연명 중단으로 들리니 쓰지 말 것.)
- **S8 [ko·KP 문장의 ko만] 5.2** ko `…지지 서비스가 있어요` → `…지원 서비스가 있어요`(w-support ko '지원'과 맞춤). distractorsKo 둘의 '지지 서비스'도 '지원 서비스'로. why의 "지지 서비스"도.
- **S9 [ko] 0.3** ko `처음엔 압도적으로 느껴질 수 있지만…` → `처음엔 감당하기 벅차게 느껴질 수 있지만, 곧 익숙해지실 거예요.`(D2와 함께). distractorsKo 둘 새 ko 틀로.
- **S10 [ko] 4.3** ko `당신 때문이 아니라 — 그녀를…` — 가족에게 '당신'은 무례하게 들림 → `보호자분 때문이 아니라 — 환자분을 세균으로부터 안전하게 지키려는 거예요.` distractorsKo 둘 맞춤.
- **S11 [chunks] 구 경계를 끊은 조각(en 그대로; blank·decoy가 걸리면 함께 확인)**
  - 0.4 `of how we watch / over her`(구동사 watch over를 끊음) → `The sounds and lights / are just part / of how / we watch over her / .`
  - 2.5 `I'll let you / know`(let you know를 끊음) → `I'll let you know / as soon as / anything changes / .`
  - 10.3 `for a full / recovery` → `I hear that / your aunt / is hoping / for a full recovery / .`
  - 12.3 `how this will / go` → `No one can predict / exactly / how this / will go / .`
  - 1.5 `means something / different` → `Each color and sound / on the monitor / means / something different / .`
  - 7.4 `if he got / very ill` → `Did he ever talk / about what mattered / to him / if he got very ill / ?`
- **S12 [판정만 — 고치지 않음]**
  - 9.4 `A spouse usually comes first, then adult children.` — 대부분 주의 대리결정 법은 (법원 후견인 다음) 배우자→성인 자녀 순. usually로 완화돼 있어 유지. 다만 v46 why(B 몫)에 "순위는 주 법마다 다르고, 확정은 팀이 해요"를 넣을 것.
  - 19.5 `Let me pull up the chart so we can look at it together.` — HIPAA상 환자 본인·대리결정자(personal representative)와 기록을 함께 보는 것은 허용되고, ICU에서 추이 화면을 함께 보는 일도 흔함. en 유지. v46 why에 "환자 본인이나 대리결정자일 때, 병원 규정 범위 안에서"를 넣을 것(context 19 why는 이미 그렇게 씀 — 좋음).
  - 15.3 `His organs are having a harder time keeping up.` — 가족이 보는 변화를 묘사하는 말이라 간호사도 함(유지).
  - 12.5 `I'll always tell you what we know and what we don't.` — 정직하게 알리겠다는 약속은 지킬 수 있는 약속(유지).
  - 4.4 면회 2명 — 병원 규칙을 알리는 말(유지).
  - 문장 6개 `words: []`(0.5·7.5·8.6·12.5·13.4·20.6) — 쉬운 단어만 있던 문장이라 태그를 비운 것. 검사 통과했으니 유지.
- **S13 [권장·ko 번역투]** 문장 ko 34개가 `그/그녀/그의`(0.0·0.4·1.2·1.4·2.0·2.3·4.0·4.5·6.2·7.0~7.6·9.2·9.3·11.2·11.3·11.5·15.0~15.3·17.0·17.1·17.3·18.0·18.2·18.4). 저작자 exKo는 이미 '그분/환자분'을 씀. 일괄로 '그분/환자분'으로 바꾸면 좋으나 distractorsKo 68개 연쇄 — 적어도 임종 장면 15.0~15.3은 '그분'으로 권장.

## 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)
KP en을 바꾸기로 하면 `in-core-family-icu.json`의 `keyPhrases` 같은 문자열도 함께 바꿔야 V4가 통과합니다. chunks·ko·words·v46 필드·example·order 줄 연쇄는 위 문장과 같음.

| # | 문장 | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| K1 | 18.2 `We'll involve the ethics committee to decide in his best interest.` | 윤리위원회는 자문 기구 — '결정한다'고 가르침 | `We'll involve the ethics committee to help decide what's in his best interest.` | **바꾸기**. order 18 셋째 줄·w-involve/committee/decide/interest example·context 18 why 함께 |
| K2 | 19.1 `Nothing is being hidden — let me go through everything with you.` | 간호사가 병원 전체를 대신해 장담(사건 검토 중인 내용 등은 간호사가 모를 수 있음). 화난 가족에게 방어적으로 들림 | `I'm not hiding anything from you — let me go through what I know with you.` (words `[w-hide]` 유지) | **바꾸기(약)** — 유지하면 v46 why에 "간호사가 아는 범위에서"를 넣을 것. slider 19 example·w-hide example 함께 |
| K3 | 1.0 `Most alarms are just reminders, not emergencies.` | 일반화(notes-A) | `Many of these alarms are just reminders, not emergencies.` | **유지** — ICU 알람의 대부분이 즉시 조치가 필요 없는 것은 사실(연구상 70~90%대)이고, 1.4가 "정말 급하면 바로 간다"로 받쳐 줌. 가족이 알람에 대응할 사람도 아님 |
| K4 | 15.0 `…his body is no longer responding to treatment.` · 15.1 `We believe he is nearing the end of his life.` | 예후 고지는 의사 몫(notes-A) | `As the doctor shared, we believe he is nearing the end of his life.` | **유지** — 'We'로 팀 판단을 전하는 말이고, 의사 면담 뒤 간호사가 같은 말을 다시 해 주는 일은 미국 ICU에서 흔함. 대신 v46 why·order 15 why에 "의사 면담 뒤 팀의 판단을 다시 전할 때"를 넣을 것(15.5는 S4로 그렇게 고침) |
| K5 | 12.1 `His condition is serious, and the next days are critical.` | `the next days`는 비원어민 말투(보통 the next few days) | `His condition is serious, and the next few days are critical.` | **바꾸기(약)**. order 12 둘째 줄 함께 |
| K6 | 4.0 `The gown and gloves protect her from infection.` | 접촉주의 보호구는 주로 전파 차단(다른 환자·방문객 보호) | — | **유지** — 4.2 KP "keep both of you safe"가 양방향을 말함. swap 4·4.3도 같은 장면이라 유지 |
| K7 | chunks가 구를 끊은 KP(보고만): 0.0 `at her / bedside`, 2.0 `are a little / better`, 2.2 `in the right / direction`, 3.1 `in a way / that makes / sense`, 5.2 `whenever you / need them`, 9.0 `in any / documents`, 11.2 `is meaningful / care too`, 12.0 `a certain / answer`, **16.1 `to hold / it together`**(구동사), 17.0 `that's your / common ground`, 17.1 `on what / he would / have wanted`, 18.1 `a set / process`, **19.1 `let me go / through everything`**(구동사), 20.0 `for your / loss` | — | — | chunks는 KP 문장도 en이 같으면 바꿀 수 있는지 규칙 확인 필요. 바꿀 수 있으면 16.1·19.1부터 |

## 고칠 것 — 뉘앙스

### pair (1개 — 조합 전부 출력, `_rv_core-family-icu_pair.txt`)
- 상황 9 `power of / attorney`, `next of / kin`, `advance / directive`, decoy `the room` — 12조합 중 정답 셋만 성립(`advance the room` 안 됨). 정답 하나.
- **N1 [사실·why]** why "power of attorney는 '대리 권한'" — 재산 위임장(financial POA)은 의료 결정 권한이 없음. 의료 결정에는 **healthcare power of attorney**(의료 위임장)여야 함. next of kin도 자동으로 대리결정자가 아님 → why 새로: "power of attorney는 '위임장'(의료 결정에는 의료용 위임장), next of kin은 '가장 가까운 친족', advance directive는 '사전의료지시서'예요. 모두 굳어진 덩어리라 다른 말과 바꿔 붙이지 않아요. 가장 가까운 친족이 곧 대리결정자는 아니고 순서는 주 법이 정해요."

### slider (20개 — 순서·단서 전부 판정)
- **N2 ★ [척도 아님] 상황 4** `allow / require / forbid` — require(해야 함)와 forbid(하면 안 됨)는 한 축이 아님 → scale `[allow, encourage, require]`, answerAt 0, why "allow는 해도 된다는 허락, encourage는 그러라고 권하는 말, require는 반드시 해야 한다는 규칙이에요."
- **N3s ★ [순서 근거 없음] 상황 18** `tough / hard / heartbreaking` — tough와 hard는 같은 세기("tough는 버틸 만한 정도"는 사실 아님) → scale `[not easy, hard, heartbreaking]`, why 첫 문장 "not easy는 쉽지 않다는 완곡한 말이에요. hard는 분명히 힘들다는 뜻이고…".
- **N4 ★ [답 둘] 상황 19** cue `"You deliberately kept the mistake from us!"` — why가 hold back을 "일부러 말하지 않은 것"이라 설명하니 deliberately kept from이 hold back에도 맞음 → cue `Family: "You covered it up so we'd never find out!"`.
- 나머지 17개 순서·단서 맞음(normal·reminder·stable/better/recovered·ask·angry·welcome·value·slow·wish·enjoy·stable/serious/critical·nervous·set up/ready/live·slow/stop/reverse(의사 cue — 좋음)·in shock·differ·grief). 12의 "recovered는 ICU에서 함부로 쓰지 않아요", 15의 의사 단서 — 관행과 맞음.

### swap (6개 — `before[0]+선택지+before[2]` 전부 출력, 문법 전부 맞음)
- **N3 ★ [장면] 상황 13** before `…is helping Mommy breathe right now.` → `…is helping your brother breathe right now.`, ko `숨쉬기 기계가 지금 오빠가 숨 쉬는 걸 돕고 있어요`(tagline: 환자의 여동생에게).
- **N5 ★ [모양] 상황 16** before[1] `private, low-stimulus environment`(쉼표)인데 options·notes 키는 `private low-stimulus environment` — 화면에서 바꿀 말과 선택지가 안 맞음 → before[1]을 `private low-stimulus environment`로.
- **N5b [권장·why] 상황 2** notes `weaning: …가족은 무슨 뜻인지 못 알아들어요` — "weaning him off the ventilator"는 가족에게도 흔히 쓰고 알아듣는 가족도 많음(과장) → "의료진이 흔히 쓰는 말이라, 처음 듣는 가족에게는 쉬운 말로 풀어 줘요."
- 4(germs)·6(condition)·15(comfortable — sedated의 해설도 관행과 맞음) — ko·notes·why 정확.

### reel (2개)
- 0 normal — 장면·feels·why 사실 맞음("정상이 환자가 좋다는 뜻은 아님").
- **N6r [대명사] 12 hope** 둘째 장면 `I'm hoping she wakes up tomorrow.` — 상황 12는 남자 환자(His condition) → `I'm hoping he wakes up tomorrow.`, ko 그대로. why("간호사는 장담하지 않고") 관행과 맞음.

### context (13개 — `word`가 세 장면 모두에 있음 13/13, W14 0건)
- **N7 ★ [뜻이 다름] 상황 1 alarm** — 두 장면은 펌프·수액백 알람인데 fix는 `Low SpO2 alarm; probe repositioned…`(다른 알람). 인계 장면 `a low-pressure pump alert`도 수액이 비었을 때 울리는 알람 이름이 아님 → 인계 en `The alarm was the pump's infusion-complete alert; I hung a new bag.`, fix `Pump alarm: infusion complete; new bag hung.`, why 끝 문장 "차트에는 '별일 아닌 듯' 같은 추측 대신 어떤 알람이었고 무엇을 했는지 남겨요." 유지.
- **N8 ★ [뜻이 다름] 상황 5 support** — 장면이 거절(declined)·수락(accepted)·의뢰(placed)로 셋이 다른 사실이고, 어색한 장면 영어 `on your family unit`도 어색 → 세 장면을 같은 사실(원목 연결)로: 인계 `Support arranged — the chaplain will see the family at three.`(ok) / 차트 `Spiritual support offered; family accepted a chaplain visit.`(ok) / 가족에게 `A spiritual support consult has been placed for your family.`(ok: false, fix `I've asked our chaplain to come see you at three — would that help?`). why 그대로 맞음.
- **N6 [대명사] 상황 14 camera** — `…so you can see her face.` → `…so you can see his face.`, `Can you move the camera toward the bed? He can't see her face.` → `Can you move the camera toward the bed? His son can't see his face.`(S6과 맞춤).
- **N9 [권장·why] 상황 9 surrogate** fix `In most states the law puts a spouse first, so you would speak for him.` — 간호사가 대리결정자를 확정하는 말 → `In most states the law puts a spouse first, so the team will likely ask you to speak for him.`
- **N10 [설계 — 판정]** 13개 중 8개(alarm·question·decision·care·camera·ethics·process·grief)는 어색한 장면이 그 낱말 때문이 아니라 동료·차트에게 쓴 **무성의한 말투**(`driving me crazy`·`lots of drama`·`fun care stuff`·`I guess`·`a mess`·`whatever`) 때문. 핸드오프 모양(같은 말이 듣는 사람에게 안 맞음)에서는 약하지만, 이 주제의 낱말이 전부 일상어라 임상어↔쉬운 말 대비가 성립하지 않고, "자리(차트·인계)에 맞지 않는 말"이라는 점은 TASK 9와 맞음 → **그대로 둠**(억지 임상어 끼워 넣기 금지 규칙). 핸드오프 모양이 바른 것: result·surrogate·update·chart·support(N8 뒤).
- 나머지 why 사실 확인: result("결과의 의미는 의사가 설명", 간호사는 곁) · chart("범위는 병원 규정과 대리결정자 권한 확인") · ethics("중립적으로 전함") · surrogate("순서는 주마다") — 모두 미국 관행과 맞음. context ko(알람·질문·지원·결정·결과·대리결정자·최신 소식·돌봄·카메라·윤리·절차·차트·애도) 모두 정확.

## 고칠 것 — 단어

### W1 품사가 다른 distractorsEn 전부 (★ = 꼭 바꿀 것; 바꾼 말은 길이 규칙 확인함)
| 단어(품사) | 오답 | 오답 품사 | 바꿀 말 |
|---|---|---|---|
| ★ talk (동) | tall | 형 | `balk` |
| ★ light (명) | tight | 형 | `flight` |
| ★ rate (명) | rare | 형 | `rite` |
| ★ pump (명) | plump | 형 | `pulp` |
| ★ bag (명) | bad | 형(쉬운 단어 목록) | `rag` |
| ★ urgent (형) | parent | 명 | `pungent` |
| ★ better (형) | batter | 명·동 | `wetter` |
| ★ slow (형) | snow, slope | 명 | `slack`, `low` |
| ★ soon (부) | noon, spoon | 명 | `once`, `seldom` |
| ★ sense (명) | since | 접속·부 | `tense` |
| ★ find (동) | fine | 형 | `fend` |
| ★ small (형) | smell, stall | 명·동 | `smart`, `stale` |
| ★ write (동) | white, wrist | 형, 명 | `wipe`, `writhe` |
| ★ same (형) | some, game | 한정사, 명 | `sane`, `tame` |
| ★ gown (명) | gone, grown | 분사 | `gauze`, `crown` |
| ★ visit (동) | visual | 형 | `vanish` (vision 명사는 유지 가능 — 13.0 `the visit`) |
| ★ angry (형) | angel | 명 | `antsy` |
| ★ meet (동) | meek | 형 | `mend` |
| ★ welcome (형) | welfare, wellness | 명 | `winsome`, `wholesome` |
| ★ sick (형) | sink, silk | 명 | `slick`, `thick` |
| ★ healthcare (명) | housecare | 없는 말 | `childcare` |
| ★ document (명) | dominant | 형 | `monument` |
| ★ follow (동) | fallow, hollow | 형 | `swallow`, `wallow` |
| ★ order (명) | older | 형 | `odor` |
| ★ agree (동) | agent, agile | 명, 형 | `argue`, `accrue` |
| ★ bring (동) | brink, brine | 명 | `wring`, `cling` |
| ★ sibling (명) | spilling | 동명사 | `sapling` |
| ★ social (형) | sooner | 부 | `vocal` |
| ★ angle (동) | ankle | 명 | `tangle` |
| ★ sorry (형) | story, surely | 명, 부 | `soggy`, `surly` |
| ★ near (동) | neat, nerve | 형, 명 | `veer`, `rear` |
| ★ end (명) | and | 접속 | `bend` |
| ★ get (동) | jet, gel | 명 | `set`, `bet` |
| ★ quiet (형) | quite, quit | 부, 동 | `quaint`, `quick` (quite·quit는 decoyChips로 옮겨도 좋음) |
| ★ common (형) | commit, combat | 동, 명 | `comely`, `cosmic` |
| ★ ground (명) | around | 전·부 | `grout` |
| ★ ethics (명) | ethnic | 형 | `ethos` |
| ★ move (동) | movie, mode | 명 | `rove`, `mope` |
| ★ thank (동) | tank, thick | 명, 형 | `think`, `thaw` |
| ★ together (부) | toward | 전치사 | `altogether` |
| change (동) | chance | 명 | `chafe` |
| ask (동) | ash | 명 | `bask` |
| allow (동) | alloy | 명 | `allot` |
| list (동) | lint | 명 | `lisp` |
| hear (동) | hare | 명 | `heave` |
| join (동) | joint | 명 | `jog` |
| life (명) | live | 동·형 | `lore` |
| speak (동) | speck | 명 | `sneak` |
| guide (동) | guilt | 명 | `glide` |
| pause (동) | pulse | 명 | `parse` |
| share (동) | shore | 명 | `spare` |
| mean (동) | meal | 명 | `wean` |
| give (동) | gift | 명 | `drive` |
| name (동) | nape | 명 | `nail` |
| align (동) | alien | 명·형 | `malign` |
| hope (동) | hose | 명 | `cope` |
| read (동) | road | 명 | `reap` |
| zone (명) | done | 형 | `cone` |
| love (동) | lava | 명 | `lure` |
| process (명) | procure | 동 | `prowess` |
| hard (형) | harm | 명·동 | `hardy` |
| stay (동) | stair | 명 | `sway` |
| loss (명) | toss | 동 | `moss` |
| alone (형·부) | along | 전·부 | 유지 가능 |

### W2~W6
- **W2 [cue가 ko 되풀이]** w-son `부모에게서 난 아들` → `멀리 있어 화상으로 아버지를 보는 남자 자녀`; w-video `움직이는 화면과 소리를 담은 영상` → `화상 통화에서 움직이는 모습을 보여 주는 것`; w-response `어떤 충격에 몸이 보이는 반응 그 자체` → `큰 충격을 받은 사람에게 저절로 나타나는 몸과 마음의 모습`. 권장: w-same `다를 것 없이 똑같은` → `몇 번이고 되풀이해도 바뀌지 않는 그대로의`, w-moment `아주 짧은 한순간…` → `숨 돌릴 아주 짧은 틈`, w-healthcare `병원과 의료진이…` → `병원과 간호사·의사가 건강을 돌보는 체계 전반`.
- **W3 [cue 사실]** w-child `부모에게서 태어난 어린 사람` — 문장은 `adult children`(성인 자녀) → `나이와 상관없이 부모에게서 난 아들이나 딸`.
- **W4 [distractorsKo]** w-respond `효과를 숨기다`·`속도를 높이다` — 뜻이 안 되는 말 → `부작용을 보이다`, `내성을 보이다`.
- **W5 ★ [불쾌·장례 조각]** decoyChips w-visit `pis`(piss) → `ves`. distractorsEn w-screen `screw`(성적 속어) → `spleen`; w-organ `orphan`(임종·소아 방문 장면에서 아이를 고아로 연상) → `origin`; w-reverse `rehearse`(hearse 영구차를 품음, 임종 태그 단어) → `revise`. 6.4 blank 오답 `rehearse`도 B 검토에서 교체 권장.
- **W6 [권장·조각]** w-thank decoyChips `thang`(속어) → `thenk`; w-member `bar`(술집) → `bor`; w-mean distractorsEn `moan`(성적 연상 가능) → W1의 `wean`과 함께 `[wean, mend]`처럼. 나머지 decoyChips·distractorsEn 전부 비속어·술·장례·성적 조각 없음(스크립트 전수: sale·sink·classify·assign·instrument·scrape는 온전한 낱말이라 문제없음).
- **W7 [권장·자르기]** w-scared `[[scar, ed]]`는 scar(흉터)+ed로 잘못 자름 → `[[scare, d]]` 또는 `[[scared]]`.

## 고칠 것 — 결정 11 (v44 단어)
- **D1 ★ w-hand** — 공통 쉬운 단어 목록에 있는 `hand`가 남아 있음. 0.2·4.1(둘 다 KP — words만 바꿈)에서 태그를 빼고 은행에서 삭제(word-remove). 상황 0은 11개, 상황 4는 14개 남아 V3 충족. (`name`은 목록에 있지만 `name a healthcare proxy`의 '지정하다'라 구로 가르칠 값이 있어 유지 — 타당.)
- **D2 w-overwhelming** ko `압도적인` → `감당하기 벅찬`(exKo는 이미 그렇게 씀). 0.3 ko는 S9.
- **D3 ★ w-scared** ko `무서운`(=scary, 남을 무섭게 하는) → `겁먹은`. exKo `형제자매도 무서울 수 있어요`는 맞으니 유지.
- **D4 w-level** ko `수준` → `수치`(산소 수치; rate를 `속도·율`로 바꿔 겹침이 이미 풀렸으니 base로 되돌림). exKo `산소 수준이` → `산소 수치가`.
- **D5 [권장] w-bring** ko `데려오다` — 11.5 `bring some of that here`는 '가져오다' → `데려오다·가져오다`.
- **D6 [권장] w-zone** 헤드워드 `zone`(구역)인데 ko `시간대`·문장 `time zones` → en `time zone`, ipa `/ˈtaɪm zoʊn/`, chips `[[time], [zone]]`, distractorsEn `[time frame, comfort zone]`(time slot은 '시간대'라 정답 둘 — 쓰지 말 것). id 유지.
- **D7 [권장] w-aunt** ko `이모` → `이모·고모`(aunt는 둘 다).
- **판정: 19개 삭제** — 공통 목록 12개(time·day·home·room·body·doctor·family·know·see·come + 같은 성격 say·tell·think·want·help·feel·need·people·person)는 모두 간호사가 아는 말이라 타당. 추가로 yesterday·sick·small·same·give·sit·get·son·face·easy도 쉬운 말이지만 1할(19/209) 상한과 V3를 생각해 이번엔 두는 것이 맞음.
- **판정: ko 정리 14개** — level(D4)만 되돌리고 나머지(rate·support·sense·result·update·wish·outcome·social·worker·respond·get·look·rush) 타당.

## 저작자 메모 판정 요약
| 지적 | 판정 |
|---|---|
| 6.4 "I'll help translate" | **고침**(S1) |
| 18.2 윤리위원회가 결정 | **KP — 바꾸기 권고**(K1) |
| 19.5 차트 함께 보기 | 유지, why 보강(S12) |
| 19.1 Nothing is being hidden | **KP — 바꾸기(약)**(K2) |
| 1.0 Most alarms | **KP — 유지**(K3) |
| 7.5 간호사가 환자 뜻 단정 | **고침**(S2) |
| 15.1·15.3·15.5 예후 | 15.5 **고침**(S4), 15.0·15.1 KP 유지(K4), 15.3 유지 |
| 20.5 원하는 만큼 머무름 | **고침**(S3) |
| 14.4 카메라 동의 | 유지(대명사만 S6) |
| 9.4 배우자 먼저 | 유지(usually), why 보강 |
| 2.1 ko '지지' | **고침**(S7) |
| 상황 14 대명사 혼재 | **고침**(S6·N6) |
| 15.5 오답 "방문으로…" | S4로 사라짐(15.0 `방문에 반응` 오답도 교체 권장) |

## 종합
고칠 것 57건(문장 S1~S11 11건 · 뉘앙스 11건 · 단어 W1 ★40 포함 표 1건+W2~W7 6건 · 결정 11 D1~D7 7건 — W1 표를 낱개로 세면 오답 교체 약 75개). 그중 **안전·업무범위 6건**(S1 통역, S2 환자 뜻 단정, S3 머무름 약속, S4 예후 단정, S5 이웃 결정 전제, N1 POA why).
꼭 고칠 것: S1~S7, N2·N3·N3s·N4·N5·N7·N8, W1★, W5, D1·D3. keyPhrase 결정 K1·K2·K5는 바꾸기 권고, K3·K4·K6은 유지 권고.
위를 반영하면 내보내도 됩니다. 뉘앙스 why·notes는 미국 병원 가족 소통 관행(결과 설명은 의사, 간호사는 곁·연결, 대리 순서는 주 법, 장담 금지)과 대체로 맞습니다. 장기기증(OPO) 이야기는 이 주제에 없음(확인).
