# or-tourniquet — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `or-tourniquet.yaml`(A·B 합본, `.pre-fix.yaml`과 동일). 단어 177, 상황 21(문장 105), 뉘앙스 42(slider 21 · swap 17 · context 4 · pair 0).
비교: base·changes(89건: word-remove 16 · word 24 · sentence words 49 — 문장 en·ko·chunks·goal 변경 없음, diff로 확인)·in-json·notes-A·notes-B.
검사 `verify_one_theme.py or` 통과. 임시 스크립트 `rv_or-tourniquet_dump.py`(words/sents/nuance)·`rv_or-tourniquet_lencheck.py`(제안 오답 길이·은행 충돌), 출력 `_rv_or-tourniquet_{words,words2,sents,nuance}.txt`.
번호는 "상황.문장"(0부터). KP = in-json `keyPhrases`와 글자 그대로 같은 문장(상황마다 0~2번).

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 2 | 소리·철자는 닮았지만 **품사가 다른 오답이 57단어**, 그중 20단어는 두 오답이 모두 다른 품사(품사만 보고 정답을 고름). reperfusion의 `perfusion`, deficit의 `defect`는 정답과 거의 같은 뜻 |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과(스크립트). w-watch의 `확인하다`가 뜻이 가깝고 w-confirm의 ko와 같음 |
| 3 cue | 4 | 정답 영어 노출 없음(스크립트). ko 되풀이 8개, 사실이 틀린 cue 2개(w-small·w-short), 업무 범위 cue 1개(w-calculate) |
| 4 chips/decoyChips | 4 | 무기 `ax`, 비속어 `diss`×2, 모욕 `fool`×2. 나머지는 의미 있게 잘림. postoperatively `op.era.tively` 자르기는 권장 |
| 5 뉘앙스·문장 사실 | 3 | 뉘앙스 why·notes는 대체로 AORN 관행에 맞음(압력·시간은 집도의, 간호사는 알림·기록, 패딩, 소독액 고임, 감압 뒤 감시). 문장은 "가장 작은 커프"(4.3, KP 11.2), "재적용 시간이 짧아진다"(13.0 KP·13.3), 간호사가 감압을 단정(15.0·15.2 KP, 15.3·15.4). slider 20은 단단해진 다리를 '지켜볼 일'로 가르침(안전) |
| 6 뉘앙스 설계 | 3 | 약함→강함이 아닌 slider 4개(1·2·8·14), cue가 답을 드러낸 slider 2개(12·18), 일반인도 아는 말을 word로 고른 context 2개(call·document), swap 10이 물음인데 마침표, 스크럽에게 비멸균 일을 시키는 swap 3개 |
| 7 결정 11 | 4 | 쉬운 단어 16개 제거·ko 가르기는 타당. 남은 흠: `거혈`(표준어는 구혈), w-damage `훼손`, w-monitor ko가 동사 |

## 사실 오류·심각한 문제
1. **[안전] 4.3 "We choose the smallest cuff that still fits."(KP 11.2와 w-small cue도 같음)** — AORN 권고는 사지에 맞는 범위에서 **가장 넓은 커프**예요. 넓은 커프일수록 낮은 압력으로 혈류가 막혀 신경·피부 손상이 줄어요. "가장 작은 커프"를 그대로 배우면 필요 이상으로 높은 압력을 쓰게 돼요 → S1·W1·K1.
2. **[범위·안전] 15.3 "deflate it", 15.4 "we cannot go any longer"(KP 15.0 "we need to deflate now", 15.2 "we cannot exceed this time")** — 감압할지는 집도의가 정해요. 간호사는 경과 시간을 분명히 알리고 결정을 구하며, 응답이 없으면 지휘 체계로 올려요. 같은 주제의 swap 6·13·15와 slider 15는 바로 이것을 가르치는데, 이 문장들은 거꾸로 가르쳐요 → S3·S4·K3·K4.
3. **[사실] 13.3 "This time, we can't go as long as before."(KP 13.0 "resets shorter", w-short cue)** — 재관류 뒤 재팽창 시간이 반드시 짧아진다는 일반 규칙은 없어요. 시간은 집도의와 병원 정책이 정하고, 간호사는 재팽창 시간과 누적 시간을 따로 기록해요 → S2·W2·K2.
4. **[안전] slider 20** — cue "the leg feels tense afterward"에서 정답이 "A concern worth watching"이에요. 오래 감은 뒤 다리가 단단해지면 구획증후군의 이른 징후일 수 있어 **바로 집도의에게 보고**할 일이지, 지켜보기만 할 일이 아니에요 → N7.
5. **[사실] 9.4 "The proximal cuff is for the Bier block sequence."** — 내용이 비어 있고, 이중 커프에서 지켜야 할 안전 순서(원위 커프를 올린 **뒤에** 근위 커프를 내림 — 반대로 하면 국소마취제가 전신으로 들어감)를 놓쳐요 → S5.
6. **[장면] 18.3 "The field is still bleeding under the cuff."** — 수술 영역은 커프보다 원위에 있어요. "커프 아래(밑)에서 출혈"은 장면이 맞지 않아요 → S6.

## 저작자가 짚은 것 — 판정
| 짚은 것 | 판정 |
|---|---|
| "smallest cuff that still fits"(4.3)·"smallest appropriate cuff"(KP 11.2) | **틀림.** 4.3은 고침(S1), KP 11.2는 사용자 결정(K1, 바꾸기 권고) |
| "safe reinflation time resets shorter"(KP 13.0)·13.3 | **일반 규칙이 아님.** 13.3은 고침(S2), KP는 K2(바꾸기 권고) |
| "we cannot exceed this time"·"deflate it"·"need to deflate now" | **업무 범위 밖으로 읽힘.** 15.3·15.4는 고침(S3·S4), KP 15.0·15.2는 K3·K4(바꾸기 권고). 15.1 "I'm escalating this, the limb is at risk."는 집도의가 응답하지 않을 때 지휘 체계로 올리는 정당한 말이라 **유지**(K8) |
| 알람 60분(5.3) | **유지.** 이번 증례의 설정값으로 읽히고 60분 알림은 흔한 기본값이에요. B가 why에 "값은 집도의 지시·병원 정책에 따른다"를 넣을 것 |
| 15분마다 알림(KP 8.1, 8.3) | **유지.** 병원 정책의 예시 값으로 읽혀요. B의 why에 같은 단서를 넣을 것 |
| 간호사가 압력을 "계산"(0.3, KP 11.1) | **유지.** AORN은 압력을 사지 폐색압(LOP)에 안전 여유를 더해 정하라고 해서, 팀이 계산하는 것은 실제 관행이에요. 다만 w-calculate cue가 단독 결정처럼 읽혀 고침(W3). B가 0.3·11.1 why에 "최종 값은 집도의가 확인" |
| 의식 있는 환자에게 말하는 context 3곳 | baseline(마취 전 커프 부착)·deficit(수술 뒤)은 장면이 그럴듯해서 **유지**. call은 word가 일반어라 바꿈(N10). document(마취에서 깬 환자)도 word가 일반어라 바꿈(N11) |
| deficit fix "the surgeon will talk with you about it" | **타당.** 간호사는 증상을 받아 주고, 진단 설명은 집도의가 해요 |
| under/beneath·tight/pinch·alert/reminder·escalate/report | **유지.** ko가 다르고(아래/밑에, 조이는/끼이다, 경고 알림/알림), 서로의 오답으로 쓰이지 않아 정답이 둘이 되지 않아요(underneath·below도 확인) |
| 헤드워드 congested·prolonged | **타당.** 두 문장 모두 형용사로 쓰이고, 사전에 형용사 표제어로 올라 있어요. ipa·chips도 맞춰져 있음 |
| (B) 9.4 Bier block | **고침** → S5 |
| (B) 19.1 "labs or treatment drawn up" | 묻는 말이라 업무 범위는 괜찮지만, `labs … drawn up`은 영어가 어색해요(검사는 drawn, 약은 drawn up) → K5 |
| (B) 16.1·19.1 제안형 | 지시를 묻는 말이라 **유지** |
| 결정 11 제거 16개 | **타당**(모두 어느 문장도 태그하지 않게 됨, V3 유지). arm·leg·blood 같은 말이 남아 있지만 뉘앙스 words가 걸려 있어 더 빼라고 하지 않음 |

## keyPhrase 결정 필요 (en은 고치지 않음 — 사용자 결정)
| # | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| K1 | 11.2 `We use the smallest appropriate cuff.` | AORN은 가장 넓은 커프를 권함(안전) | `We use the widest appropriate cuff.` | **바꾸기** — 바꾸면 words `w-small`→`w-wide`(S1에서 새로 만듦), w-small은 은행에서 지움. order 11 셋째 줄 `…I'll choose the widest appropriate cuff.`·order why, v46 필드 새로 |
| K2 | 13.0 `After reperfusion, the safe reinflation time resets shorter.` | 일반 규칙이 아님, `resets shorter`는 영어도 어색함 | `After reperfusion, we reset the timer for reinflation.` | **바꾸기** — words `[w-reperfusion, w-reset, w-reinflation]`. w-short는 은행에서 지움. order 13 첫 줄도 이 문장으로, v46 필드 새로 |
| K3 | 15.0 `We're at the maximum safe time — we need to deflate now.` | 감압을 간호사가 단정 | `We're at the maximum safe time — do we deflate now?` | **바꾸기** — order 15 첫·셋째 줄과 같이 고침(S4 참고) |
| K4 | 15.2 `Surgeon, we cannot exceed this time.` | 집도의에게 한계를 명령 | `Surgeon, we're about to exceed this time.` | **바꾸기** — w-exceed 그대로 |
| K5 | 19.1 `Anesthesia, do you need labs or treatment drawn up?` | `labs drawn up`은 어색함 | `Anesthesia, do you need labs drawn or meds drawn up?` | 바꾸기(약하게 권고) — words에서 w-treatment를 빼면 은행에서 지울지 확인 |
| K6 | 11.1 `Let me recalculate based on the child's size.` | 단독 결정처럼 읽힐 수 있음 | — | **유지** (위 판정) |
| K7 | 8.1 `I'll call out the time every fifteen minutes.` | 간격은 정책마다 다름 | — | **유지** |
| K8 | 15.1 `I'm escalating this, the limb is at risk.` | 판단처럼 들림 | (`…the limb may be at risk.`) | **유지** |
| K9 | 19.0 `We're seeing a metabolic surge after reperfusion.` | 표준 용어는 아님 | — | **유지**, why만 풀어 씀(N8) |
| — | 14.1 ko `거혈이 충분했는지 확인할게요.` | 표준어는 `구혈`(Esmarch 구혈대) | ko `구혈이 충분했는지 확인할게요.` | ko만 고침(결정 11 범위) → D1 |

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en을 바꾸면 `chunks`·`ko`·`words`를 함께 바꾸고, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 같은 문장을 쓰는 order 줄과 단어 example·exKo도 맞추고, `changes-or-tourniquet.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 그 문장의 **distractorsKo 둘을 새 ko 틀에 맞춰 다시** 쓰세요.

- **S1 [안전] 4.3** · en `We choose the widest cuff that still fits.` · chunks `We choose / the widest cuff / that still fits / .` · ko `맞는 것 중 가장 넓은 커프를 골라요.` · words `[w-choose, w-wide, w-cuff, w-fit]`. **새 단어 w-wide**(word-add): en `wide`, ipa `/waɪd/`, ko `넓은(폭이)`, icon `bandage`, tag `커프·부착`, example = 4.3, exKo = 새 ko, cue `커프의 폭이 큰 쪽 — 같은 사지라면 이쪽이 더 낮은 압력으로 피를 막는다`, distractorsEn `[wild, wise]`, distractorsKo `[좁은, 얇은]`, chips `[[wide]]`, decoyChips `[wade]`. v46 새로: blank `widest`(오답 cheapest·newest·oldest는 그대로 써도 됨), why 예: "같은 사지라면 넓은 커프가 더 낮은 압력으로 혈류를 막아 조직 손상이 적어요. 그래도 사지에 맞고 겹침이 알맞아야 해요." **order 4 둘째 줄** → `Here is the widest cuff that still fits.` / ko `맞는 것 중 가장 넓은 커프예요`, order why의 "가장 작은 커프"도 고침. w-small example은 11.2로 옮김(K1을 바꾸면 w-small 삭제).
- **S2 [사실] 13.3** · en `This time, let's ask the surgeon how long we can go.` · chunks `This time / , let's ask the surgeon / how long / we can go / .` · ko `이번에는 얼마나 오래 둘지 집도의에게 물어봅시다.` · words `[w-surgeon, w-long]`(상황 13에서 w-before가 빠져도 14개). v46 새로(지금 blank `long`의 오답 far·fast·high는 그대로 써도 됨, decoy `as loud`는 교체). **order 13 둘째 줄** → `So let's ask the surgeon how long this round can go.`, order why의 "안전한 시간이 짧아진다"도 고침(K2 결정과 같이).
- **S3 [범위] 15.3** · en `We need to act now — shall we deflate?` · chunks `We need to act / now / — shall we / deflate / ?` · ko `지금 조치해야 해요 — 공기를 뺄까요?` · words `[w-act, w-deflate]`. v46 새로(distractorsKo 둘을 새 ko 틀로; why 예: "감압은 집도의가 정해요. 시급함은 분명히 말하되 결정은 물어요.").
- **S4 [범위] 15.4** · en `This is the maximum time — how would you like to proceed?` · chunks `This is / the maximum time / — how would you like / to proceed / ?` · ko `최대 시간이에요 — 어떻게 진행할까요?` · words `[w-maximum]`(상황 13·15에서 w-long이 빠지면 상황 15는 9개 — V3 통과). v46 새로. **order 15** 둘째 줄 `I'm escalating this to the surgeon right away.` → `I'm telling the surgeon right away.`(집도의는 같은 방에 있음; 상급 보고는 그다음 단계), 셋째 줄 `We cannot go past that limit, so we need to deflate now.` → `So I need your decision on deflating now.` / ko `그래서 지금 공기를 뺄지 결정해 주셔야 해요`, order why도 맞춤.
- **S5 [사실] 9.4** · en `The proximal cuff comes down only after the distal one is up.` · chunks `The proximal cuff / comes down / only after / the distal one / is up / .` · ko `근위 커프는 원위 커프를 올린 뒤에야 내려요.` · words `[w-proximal, w-cuff, w-distal, w-up]`(w-block·w-sequence는 9.0·9.2에 남음). v46 새로(why 예: "근위 커프를 먼저 내리면 국소마취제가 한꺼번에 몸으로 들어갈 수 있어요. 그래서 원위 커프를 올린 것을 확인한 뒤에 내려요.").
- **S6 [장면] 18.3** · en `The field is still bleeding with the cuff up.` · chunks `The field / is still bleeding / with the cuff up / .` · ko `커프를 올렸는데도 수술 영역에서 여전히 출혈이 있어요.` · words `[w-field, w-bleed, w-cuff, w-up]`. v46 새로(지금 distractorsKo의 '필드' 표현도 함께 바뀜). w-field example·exKo 갱신. **order 18 첫 줄** `There's continued bleeding under the cuff.` → `There's continued bleeding in the field.` / ko `수술 영역에서 출혈이 계속돼요`.
- **S7 [결정 11 · KP의 ko만] 14.1** ko → `구혈이 충분했는지 확인할게요.` distractorsKo 둘을 새 ko 틀로(`구혈이 빨랐는지…`, `구혈이 깨끗했는지…`), tag `거혈 확인`→`구혈 확인`, order 14 둘째 줄 ko와 order why의 `거혈`도 고침 → D1과 함께.
- **판정만 — 고치지 않음:** 0.3 calculate(위 판정), 5.3 60분, 8.3 15분, 17.3 "compressed too long"(이 장면의 사실 진술이라 유지), 16.0 "this is reperfusion hypotension"(유지).

## 고칠 것 — 뉘앙스
- **N1 [slider 1 · 순서]** 보기 셋이 약함→강함 줄이 아님(머리·보드·수술 뒤 차팅). → scale `[Keep it in my head, Jot it in my notes, Mark it on the board]`, answerAt `2`(혼자 기억 → 혼자 적음 → 모두가 봄). why 끝을 "머릿속이나 내 메모에만 두면 팀이 볼 수 없어요."로.
- **N2 [slider 2 · 순서]** "Ask the surgeon to smooth it"은 강도가 아니라 다른 사람에게 맡기는 일. → scale `[Leave it — the cuff will flatten it, Tug at the fold a little, Smooth the padding flat first]`, answerAt `2`. why에서 "집도의에게 맡길 일" 부분을 "조금만 당겨서는 접힌 곳이 남아요."로.
- **N3 [slider 8 · 순서]** `Tell the nearest person`과 `Tell the scrub only`는 둘 다 한 사람이라 같은 단계. → scale `[Tell the scrub only, Tell the surgeon and scrub, Call it out to the whole room]`(answerAt 2 그대로).
- **N4 [slider 12 · cue가 답을 드러냄]** cue의 `soaked … under the whole cuff`가 정답 보기와 같은 말. → cue `After the prep, you lift the cuff edge and the padding is wet from end to end.`
- **N5 [slider 14 · 순서]** `Cold and pale`은 반대 방향이라 줄이 아님. → scale `[Normal in color, Slightly flushed, Visibly congested]`, answerAt `2`. why: "검붉게 붓고 피가 찬 모습은 울혈(congested)이에요. 커프 압력이 동맥압보다 낮거나 구혈이 부족하면 정맥 피만 갇혀 이렇게 돼요. 색 변화는 집도의에게 보고해요."
- **N6 [slider 18 · cue가 답을 드러냄]** cue의 `ooze`가 정답 `oozing`. → cue `The field is mostly dry, with just a little blood seeping at the edges.`
- **N7 [안전 · slider 20]** cue → `The tourniquet was up longer than planned, but the leg looks and feels normal for now.` why 끝에 "다리가 단단하게 붓거나 통증이 심해지면 지켜보지 말고 바로 집도의에게 보고해요."를 더함.
- **N8 [사실 · slider 19 why]** metabolic surge는 정해진 임상 용어가 아님. → why `'surge'는 갑자기 크게 치솟는 것이에요. 지혈대를 풀면 막혀 있던 사지의 이산화탄소·칼륨·젖산이 한꺼번에 돌아와 수치가 확 뛰어요. 조금 바뀌거나 서서히 변하는 것과는 달라요.`
- **N9 [사실 · slider 17 cue]** 부위마취 중이면 발가락을 못 움직이는 것이 정상. → cue `In recovery, with the anesthesia worn off, the patient still can't wiggle the toes.`
- **N10 [context 8 · word 선택]** `call`은 일반어이고, 어색함은 `ischemia time`이라는 내용에서 옴. → word `ischemia`, ko `허혈`, words `[w-ischemia]`. 장면: 수술팀 전체에게 `I'll call out the ischemia time every fifteen minutes.` ok / 집도의에게 `Dr. Lee, ischemia time is at one hour.` ok / 깨어 있는 환자에게 `Your ischemia time is at one hour now.` ok:false · fix `The cuff has been on for a while, and we're keeping track of the time.` · why `ischemia는 피가 통하지 않는 상태를 뜻하는 임상어라 의료진끼리는 정확하지만, 깨어 있는 환자에게는 겁나게 들려요. 환자에게는 '커프를 감은 지 좀 됐고 시간을 지키고 있다'로 말해요.`
- **N11 [context 20 · word 선택]** `document`는 일반어이고, 어색함은 `your muscle damage`라는 단정에서 옴. → word `compartment`, ko `구획`, words `[w-compartment]`. 장면: 수술 기록 `Compartments soft; monitoring for compartment syndrome.` ok / 집도의에게 `Dr. Kim, the compartments feel soft so far — I'll keep checking.` ok / 마취에서 깬 환자에게 `We're checking your compartments for swelling.` ok:false · fix `We'll keep checking your leg for swelling and pain over the next few hours.` · why `compartment는 근육을 감싼 칸을 가리키는 임상어라 의료진끼리는 정확하지만 환자에게는 낯설어요. 환자에게는 '다리가 붓거나 아픈지 계속 볼게요'로 말해요.`
- **N12 [swap 2 ko]** 조각만 있음 → ko `피부가 아프지 않게 커프 밑에 부드러운 패드를 대요`.
- **N13 [swap 10 문법]** 정답을 이으면 `…shall we discuss whether it's safe.`(물음인데 마침표). before[2]를 `?`로 바꾸면 오답 둘이 물음이 되니 정답 보기를 고침 → `the leg has PVD — let's discuss whether it's safe`(answer·options·notes 키 같이), ko `다리에 말초혈관질환이 있어요 — 안전한지 의논해요`.
- **N14 [swap 4·11·12 who]** 스크럽은 멸균 상태라 커프를 가지러 가거나(11) 소독 전 커프·패딩을 감지(4·12) 않아요. → swap 4 `순환 간호사 → 레지던트 · 커프 감기`, swap 11 `순환 간호사 → 동료 간호사 · 커프 준비`, swap 12 `순환 간호사 → 레지던트 · 패딩 정리`.
- **N15 [사실 · slider 11 why]** "같은 압력이면 조직이 너무 눌려요" → `아이는 혈압이 낮고 사지가 가늘어 더 낮은 압력으로도 혈류가 막혀요. 필요 이상 압력은 신경·피부 손상을 키워요. 실제 값은 집도의가 정해요.`
- **N16 [사실 · slider 9 why]** "그제야 원위 커프로 넘어가요"는 자리 잡자마자 바꾸는 것처럼 읽힘 → `'established'는 마취가 자리 잡아 효과가 충분히 나는 상태예요. 원위 커프는 마취된 자리 위에 올려야 해서, 블록이 자리 잡은 뒤에야 바꿀 수 있어요. 막 시작했거나 풀리는 중이라고 말하면 순서 판단이 달라져요.`
- swap 17개 이어 붙인 문장의 문법은 swap 10 말고 모두 맞음. ko는 swap 2 말고 모두 바꾼 문장의 뜻. 나머지 slider는 순서·정답 하나·cue 모두 통과(0·3·4·5·6·7·9·10·11·13·15·16·17·19).

## 고칠 것 — 단어
- **W1 [안전] w-small cue** `…맞는 범위 안에서 가장 작은 것을 쓴다` → `크기가 작다는 뜻 — 아이 팔처럼 가는 사지에 맞춰 고르는 쪽` (K1을 바꾸면 w-small 자체를 지움)
- **W2 [사실] w-short cue** `…다시 올릴 때 허용 시간이 줄어든다` → `길이나 시간이 얼마 되지 않는다는 뜻` (K2를 바꾸면 w-short 자체를 지움)
- **W3 [범위·ko 되풀이] w-calculate cue** `측정값에서 계산식으로 압력을 구해 내는 일` → `사지 폐색압에 여유분을 더해 압력 값을 셈하는 일 — 최종 값은 집도의가 확인`
- **W4 [cue가 ko 되풀이 — 8개]**
  - w-check `…점검하는 동작` → `커프·장비·피부를 하나하나 눈으로 살펴 이상이 없는지 보는 일`
  - w-document `…문서로 남기는 일` → `일어난 일을 공식 차트에 글로 적어 남기는 일`
  - w-period `…일정한 기간` → `어떤 일이 시작해서 끝날 때까지 이어지는 한동안`
  - w-together `…같이 함께` → `서로 따로 하지 않고 같은 일을 나란히`
  - w-continue `…계속되는 일` → `멈추지 않고 이어지는 일 — 출혈이 아직 안 멎었을 때`
  - w-condition `…상태인지를 통틀어` → `피부나 사지가 지금 어떤 모양인지 통틀어 가리키는 말`
  - w-limit `…한계선` → `넘으면 안 되는 선 — 지혈대 시간의 상한`
  - w-adequate `…충분한 정도` → `필요한 만큼 모자람이 없는 정도 — 구혈이 잘 됐는지 볼 때`
- **W5 [distractorsEn 품사 — 전부]** ★ = 꼭 바꿀 것(두 오답이 모두 다른 품사이거나 정답과 거의 같은 뜻). ★ 없는 줄은 권장. 제안은 길이 규칙 통과(스크립트).

| 단어 | 정답 품사 | 지금 오답(품사) | 제안 |
|---|---|---|---|
| ★ smooth | 형 | smoke(명·동), sooth(명·옛말) | smoky, smug |
| ★ underneath | 부·전 | underline(동), undertake(동) | overhead, underway |
| ★ safe | 형 | save(동), safety(명) | sane, same |
| ★ fine | 형 | fire(명), fund(명) | faint, fiery |
| ★ first | 부 | fist(명), firm(형) | fast, last |
| ★ well | 부 | wall(명), will(조동) | badly, wildly |
| ★ small | 형 | smell(명·동), shall(조동) | smart, stale |
| ★ loose | 형 | lose(동), loop(명) | loud, lone |
| ★ soon | 부 | song(명), soap(명) | seldom, still |
| ★ total | 형 | toll(명), topic(명) | tonal, tidal |
| ★ long | 형·부 | lung(명), loan(명) | lone, lame |
| ★ block | 명 | black(형), blink(동) | bloc, flock |
| ★ high | 형 | hide(동), hype(명) | shy, dry |
| ★ low | 형 | law(명), flow(명·동) | slow, raw |
| ★ child | 명 | chide(동), chill(동·명) | chili, chain |
| ★ short | 형 | shirt(명), shore(명) | sharp, stout |
| ★ period | 명 | perish(동), partial(형) | peril, pellet |
| ★ troubleshoot | 동 | troublemaker(명), trouble-free(형) | overshoot, outsource |
| ★ reperfusion | 명 | reperform(동), perfusion(정답과 거의 같은 뜻) | repercussion, reinfusion |
| ★ deficit | 명 | deficient(형), defect(결함 — 정답과 가까운 뜻) | deposit, default |
| base | 동 | vase(명) | bake, chase |
| agree | 동 | agency(명) | argue, accrue |
| wrinkle | 명 | wrinkly(형) | twinkle, winkle |
| apply | 동 | apple(명) | reply, supply |
| check | 동 | chest(명) | chuck, change |
| size | 명 | seize(동) | sign, side |
| overlap | 동 | overall(형·명) | overlook, overload |
| tight | 형 | tide(명) | tidy, tough |
| warn | 동 | warm(형) | warp, ward |
| reminder | 명 | reminded(동) | remainder, rejoinder |
| run | 동 | rug(명) | rub, ruin |
| approach | 동 | apology(명) | approve, reproach |
| release | 동 | relief(명) | relate, relapse |
| proximal | 형 | proximity(명) | approximate, maximal |
| add | 동(added) | odd(형) | aid, nod |
| whether | 접 | weather(명) | whereas, whenever |
| flag | 동 | flat(형) | flap, flash |
| pediatric | 형 | paramedic(명) | podiatric, geriatric |
| appropriate | 형 | appreciate(동) | approximate, proprietary |
| under | 전 | upper(형) | until, upon |
| beneath | 전 | benefit(명·동) | between, beyond |
| interval | 명 | internal(형) | interview, interior |
| allow | 동 | alloy(명) | allay, follow |
| closely | 부 | closet(명) | clearly, coarsely |
| adequate | 형 | advocate(명·동) | accurate, adjacent |
| below | 전·부 | blow(동), bellow(동) | beside, beyond |
| grab | 동 | grad(명) | grin, grub |
| cause | 동 | clause(명) | cease, coax |
| inform | 동 | infirm(형) | conform, deform |
| neuro | 형 | nature(명) | neutral, natural |
| device | 명 | devise(동) | advice, office |
| field | 명 | filed(동) | fuel, feud |
| metabolic | 형 | mechanic(명) | metallic, melodic |
| muscle | 명 | muscular(형) | mussel, muster |
| sign | 명 | sing(동) | sigh, sight |
| damage | 명 | manage(동) | dam, dosage |
| alert | 명(6.0에선 동) | alter(동), avert(동) | 유지 가능(alert가 두 품사로 쓰임) |

- **W6 [distractorsKo] w-watch** `확인하다`는 뜻이 가깝고 w-confirm의 ko와 같음 → `[외면하다, 씻다]`(오답 영어 wash와 이어짐).
- **W7 [decoyChips — 비속어·불쾌·무기]** (술·장례·성적 조각은 없음, 전수 확인)
  - w-exceed `[ax, seed]` → `[ac, seed]` (ax = 도끼, 무기)
  - w-distal `[diss, tel]` → `[dys, tel]` (diss = 깎아내리는 속어)
  - w-discuss `[diss, cass]` → `[dys, cass]`
  - w-carefully `[cure, fool]` → `[cure, full]` (fool = 모욕)
  - w-fully `[fool]` → `[fill]`
- **권장:** w-quickly decoy `quack`(돌팔이 의사) → `quake`; w-nerve 오답 `nerd`(낮잡는 말) → `[nurse, verve]`; w-postoperatively chips `[post, op, era, tively]` → `[post, oper, ative, ly]`; swap 15 ko `최대 안전 시간이에요` → `최대 안전 시간에 이르렀어요`.

## 고칠 것 — 결정 11 (changes에 기록)
- **D1 w-exsanguination ko** `거혈(피 빼기)` → `구혈(피 짜내기)` — 한국 수술실 표준어는 구혈(Esmarch 구혈대). exKo(w-exsanguination·w-adequate, 둘 다 14.1)와 S7을 함께 고침. 정본 lexicon/topics에도 `거혈`이 있으니 합칠 때 같이 반영.
- **D2 w-damage ko** `훼손` → `손상(망가짐)` — 조직에는 '훼손'이라 하지 않음. w-injury(손상)와는 서로의 오답이 아니어서 정답이 둘이 되지 않음.
- **D3 w-monitor ko** `감시하다(모니터)` → `모니터(감시 화면)` — 문장(16.2·16.4)과 cue·distractorsKo가 모두 명사.

## 개수
고칠 것 **62건**(문장 7 · 뉘앙스 16 · 단어 36[cue 11 · ★오답 20 · distractorsKo 1 · decoyChips 5] · 결정 11 3). 그중 **안전 5건**: S1·W1(가장 작은 커프), S3·S4(감압 단정), N7(단단해진 다리). KP 결정 필요 5건(K1~K5 바꾸기 권고) + 유지 판정 4건(K6~K9). 권장(★ 없는 품사 37단어 등)은 따로.

## 종합
뉘앙스 why·notes의 방향(압력·시간·감압은 집도의, 간호사는 알리고 기록)은 맞아요. 다만 문장 쪽에 "가장 작은 커프"·"감압 단정"·"재적용 시간 단축"이 남아 있어 뉘앙스와 서로 다른 것을 가르쳐요. 위 목록과 K1~K4 결정을 반영하고 품사 ★ 20개를 고치면 내보내도 돼요.
