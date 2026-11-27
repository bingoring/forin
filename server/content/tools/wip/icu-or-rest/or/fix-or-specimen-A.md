# or-specimen — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번 context·swap ko)

대상: `or-specimen.yaml`(A·B 합본, `or-specimen.pre-fix.yaml`과 같은 파일). 단어 101(base 107: 9개 삭제·3개 추가), 상황 21(문장 127), 뉘앙스 63(slider 19 · context 21 · swap 21 · pair 2 · reel 0).
검사기는 이미 통과(`==> 통과`, 변경 목록 55건). 아래는 기계가 못 보는 것만 적었다. 대상 파일은 수정하지 않았다.

표시: **[안전]** = 학습자가 그대로 따라 하면 실무에서 문제가 되는 것. **[범위]** = 순환간호사 업무 범위 밖(냉동절편 결과 전달은 병리의 → 집도의, 절제 범위·재채취 여부는 집도의, 수술 중 순환간호사는 교대 없이 방을 비우지 않음). **[사실]** = 미국 수술실 관행·용어와 다름.
**★** = 꼭 바꿀 것. 문장 `en`·`ko`를 바꾸면 그 문장의 v46 필드(`tag`·`icon`·`why`·`decoy`·`distractorsKo` 둘·`blank`)는 **B가 새로 쓰고**, 그 문장을 `example`로 쓰는 단어의 `example`·`exKo`, order 줄도 맞춘다(항목마다 적음). 문장 `ko`만 고치면 그 문장의 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓴다.

**미국 수술실 검체 관행(판정 기준):** 검체 이름·부위·좌우·방향은 집도의가 말하고 순환간호사가 복창·확인한다. 라벨은 환자 식별자 두 가지와 검체 이름·부위. 보존 방식(포르말린·신선·얼음·특수 배지)은 요청서와 병리과 지침을 따른다. 냉동절편 결과는 병리의가 집도의에게 직접 전하고(수술방 전화·스피커), 간호사는 결과를 해석하거나 보호자에게 전하지 않는다. 라벨 오류·누락은 즉시 알리고 혼자 고치지 않으며 기관 절차(집도의·병리과 알림, 사건 보고)를 따른다. 백 테이블과 수술포 윗면은 **멸균 영역**이다.

**문장 판정 기준(묶음 4·5와 같음):** 결정의 대상이 이름 붙은 말(절제 확대·폐기·재라벨)을 간호사가 1인칭으로 결정하면 고친다. `Let's`·`We're`로 팀이 함께 하는 말, 집도의 결정을 전하는 말, 상태 보고는 유지한다.

---

## 1. 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 같은 분야·비슷한 철자로 고름. 그러나 **정답으로도 맞는 오답 2개**(container ↔ `canister`, kit ↔ `tray`), 품사가 다른 오답 5개(cheek·weight·torch·dare·eight) |
| 2 distractorsKo·다른 뜻 | 4 | 길이 위반 없음. **section의 오답 `절개`는 section의 다른 뜻**(C-section = 제왕절개). 다른 은행 단어의 ko를 오답으로 쓴 7곳은 뜻이 분명히 달라 문제 없음 |
| 3 cue | 4 | 정답 노출 없음. w-media "젤리 같은"(이송 배지는 대개 액체), w-identify가 15.2(검체가 무엇인지)와 어긋남, w-log cue가 ko '일지'를 되풀이 |
| 4 chips·decoyChips | 4 | 다른 경로로 정답을 만드는 조합 0. **w-appendix 정답 조각 `dix`**(속어 발음), 약한 것 `pot` 2번·`come`·`lick`·`pos` |
| 5 뉘앙스 사실 | 3 | **slider 18 cue "back table, which is not sterile"**(백 테이블은 멸균 영역), **slider 8·context 8·swap 8이 멸균 수술포에 닿은 면봉을 오염이라 함**, swap 14 정답("I'll fix it")이 slider 14가 오답으로 가르치는 '혼자 고치기'와 같음, swap 18 정답의 `recollect`(= 회상하다) |
| 6 뉘앙스 설계 | 2 | pair 9가 정답 둘(`right as it's out`·`right on the field`). **context 21개 중 17개가 핸드오프 모양이 아님**(어색한 장면이 듣는 사람에게 안 맞는 말투가 아니라 얼버무림·무시·단정으로 내용이 달라짐), context 4는 frozen을 다른 뜻(꽁꽁 언)으로 씀. slider 19개 중 4개는 강→약 거꾸로, 4개는 축이 없음. 위치 분포는 좋음(swap 7·7·7, context 7·7·7) |
| 7 결정 11 | 4 | 변경 55건(삭제 9·추가 3·헤드워드 2·ko 10·문장 태그 31)은 타당. 놓친 것: w-fresh가 8.0·18.4의 'fresh = 새'에 붙음, w-frozen ko '냉동된'(문장은 모두 '냉동절편'), w-label example이 동사 문장, 16.1·16.3 ko가 옛 뜻 '수색' |

---

## 2. 사실 오류·심각한 문제

1. **[사실] 멸균 영역을 비멸균으로 가르침** — slider 18 cue `A culture sample just touched the back table, which is not sterile.` 백 테이블은 멸균포를 깐 멸균 영역이다. slider 8 cue·context 8 장면 1·2·swap 8 세 보기는 면봉 끝이 **수술포(drape)**에 닿아 "no longer sterile"이라 한다 — 수술포 윗면은 멸균이다. 학습자가 '백 테이블·수술포 = 비멸균'으로 외운다. → N8·N9.
2. **[안전] 부위 불일치를 간호사가 고친다는 정답** — swap 14 정답 `The site doesn't match, so I'll fix it before sending.`, 비KP 14.5 `I'll correct this discrepancy right now.`, order 14 줄 3. 같은 상황 slider 14는 "I'll just change it myself to match"를 오답, "resolve that with you"를 정답으로 가르친다. 좌우·부위는 집도의와 함께 바로잡을 일. → N4·S7·KP K5.
3. **[범위] 냉동절편 결과를 간호사가 받아 전함** — 4.5 `I'll tell the surgeon as soon as I hear back.`, 7.5 `Let me know the result as soon as it's ready.`(이송 담당자에게 결과를 알려 달라 함), order 4 줄 4. 결과는 병리의가 집도의에게 직접 전한다. → S3·S6, KP K7.
4. **[범위] 수술 중 순환간호사가 직접 들고 감** — 7.4 `I'll carry it to the lab myself.`(냉동절편 = 수술 진행 중), slider 7 정답 `I'm carrying it to pathology right now.`, KP 20.2 `I'll hand-carry it to pathology myself.` → S5·N7·K1.
5. **[범위] 혼자 수색·재라벨·폐기** — 16.5 `I'll search the field systematically before we panic.`(수술 시야는 스크럽·집도의 몫, `before we panic`은 비전문적), 19.5 `I'll verify identity again before we relabel it.`(보고 없이 재라벨), 18.5 `I'll confirm the surface was touched before we discard it.`(순서가 거꾸로, 버릴지는 집도의). → S9·S12·S11.
6. **[사실] 보존액 단정** — 2.3 `This specimen goes straight into formalin.`, 12.4 `This specimen goes on ice, not in formalin.` 근거(요청서·지침) 없이 단정. → S1·S2.
7. **[설계] context 4** — 어색한 장면 `It's frozen, you know, like icy cold, just in case.`가 frozen을 '꽁꽁 언'이라는 **다른 뜻**으로 씀(같은 뜻·다른 자리가 아님). context `ko` '냉동된'과 why "뜻은 셋 다 '냉동절편(검체)'"도 어긋남. → C4·W2.
8. **[설계] pair 9 정답 둘** — `right` + `as it's out`("right as it's out" = 나오자마자)과 `right` + `on the field`("right on the field")가 모두 영어로 성립. → N1.
9. **영어 오류** — swap 18 정답 `…I'll tell the surgeon and recollect.` `recollect`는 '회상하다'(다시 채취는 `re-collect`). → N3.

---

## 3. 고칠 것 — 단어 v45 필드

| # | 어디 | 문제 | 어떻게 |
|---|---|---|---|
| W1 ★ | w-section `distractorsKo` [절개, 봉합] | `절개`는 section의 실제 다른 뜻(C-section 제왕절개, 동사 section = 절단) — 정답 둘 | `[도말, 염색]` |
| W2 ★ | w-container `distractorsEn` [canister, catheter] | canister는 '통·용기'라 ko `용기`·cue "검체를 담아 뚜껑을 닫아 두는 통"에 그대로 맞음 — 정답 둘 | `[contaminant, catheter]` |
| W3 ★ | w-kit `distractorsEn` [tray, gown] | cue "한 가지 일에 필요한 도구를 한 묶음으로 담아 둔 세트"에 instrument tray가 그대로 맞음 — 정답 둘 | `[cot, gown]` |
| W4 ★ | w-appendix `chips` [[ap, pen, dix]] · `decoyChips` [pan, dice] | `dix`는 비속어(dicks) 발음 조각, `dice`는 도박 | chips `[[ap, pend, ix]]`, decoyChips `[pond, ex]` (다른 경로 조합 없음 확인) |
| W5 | w-frozen `ko` 냉동된 | 은행 문장 6개(4.0·4.3·4.4·7.0·7.3·17.0)가 모두 '냉동절편(용)'의 뜻. 7.0은 명사(This frozen). context 4 why도 '냉동절편'. 결정 11 '틀린 ko' | ko `냉동절편용의` (distractorsKo [밀봉된, 건조된] 그대로 — 6:3, 3자 이내). context 4 `ko`도 `냉동절편` (C4). changes에 `{kind: word, id: w-frozen, fields: [ko]}` |
| W6 | w-identify `ko` 신원을 밝히다 · cue · example | 유일한 KP 15.2 "Let's identify it now with the surgeon"의 it은 **검체**(무엇이고 어느 부위인지). 수술방 환자는 이미 확인된 사람이라 '신원'은 어긋남(15.5는 S8로 바뀜) | ko `식별하다`, cue `라벨 없는 용기를 앞에 두고 그것이 무엇이고 누구 것인지 알아내 분명히 하는 일`, distractorsKo 그대로, exKo는 KO1 새 ko. changes `fields: [ko]` |
| W7 | distractorsEn 품사 — §7 표의 5단어 | 오답 하나가 품사가 다름 | check `[chuck, chalk]` · wait `[want, wade]` · touch `[teach, tuck]` · date `[data, gate]` · right `[light, height]` |
| W8 | w-label `example` | ko를 명사 `라벨`로 바꾸고 동사 문장의 태그를 뺐는데 example은 동사 문장(0.0 "I'm labeling…") | example `I'll add the date and time on the label.` / exKo `라벨에 날짜와 시간을 적을게요.` (0.2, 태그 있음) |
| W9 (약) | decoyChips 약한 불쾌 조각 | w-protocol·w-report `pot`(마리화나 속어), w-compress `come`(성적 속어로도 쓰임), w-collect `lick`, w-positive 정답 조각 `pos`(비속어 약어) | w-protocol `pot`→`pat`, w-report `pot`→`part`, w-compress `come`→`comb`, w-collect `lick`→`lock`, w-positive chips `[[po, si, tive]]`(decoyChips 그대로) |
| W10 (약) [사실] | w-media cue "…영양분을 넣어 둔 **젤리 같은** 바탕" | 12.1의 특수 검체용 배지(림프종 RPMI·바이러스 이송 배지)는 대개 액체 | `검체를 살아 있는 상태로 담아 보내는 특수 용액이나 배양 바탕 — 검사마다 정해진 것을 쓴다` |
| W11 (약) | w-run `distractorsKo` [느리게 걷다, 쉬러 가다] | '달리다'의 반대를 그대로 써 듣지 않고도 걸러짐 | `[보관해 두다, 전화로 알리다]` (6:5·6) |
| W12 (약) | w-formalin `distractorsKo` 진통제 | 분야 밖이라 바로 걸러짐 | `[소독약, 조영제]` |
| W13 (약) | w-log cue "일지 같은 기록부에…" | ko `일지에 적다`를 cue가 되풀이 | `검체를 넘길 때 받은 사람과 시각을 인계 기록부에 한 줄 올려 두는 일 — 그 기록부도 같은 말로 부른다` |
| W14 (선택) | w-appendix `ko` 맹장 | 해부학 용어로는 충수(맹장은 cecum). context 1 why도 '맹장(충수)' | 바꾼다면 ko `충수`(distractorsKo [췌장, 비장] 그대로), KP 1.0 ko `이거 충수 맞는지 확인해 주시겠어요?`와 그 distractorsKo 둘, context 1 `ko`·why. 구어로 통하므로 선택 |
| W15 | exKo 연쇄 | §5 KO·S 항목으로 문장 ko·en이 바뀌면 그 문장을 example로 쓰는 단어의 example·exKo도 | w-identify(15.2, KO1) · w-extend·w-resection(17.1, KO2) · w-search(16.1, KO3) · w-lab·w-fresh·w-test(2.1, KO4) · w-carry(7.4, S5 — example `I'll find someone to carry it to the lab now.` / exKo `지금 검사실로 옮겨 줄 사람을 찾을게요.`) |

---

## 4. 고칠 것 — 뉘앙스

### 4-1. pair · swap · slider

| # | 문항 | 문제 | 어떻게 |
|---|---|---|---|
| N1 ★ | 9 pair `[[one at, a time], [right, away], [as soon, as it's out]]` decoy `on the field` | `right as it's out`(나오자마자)·`right on the field` 모두 성립 — 정답 둘 | `[right, away]` → `[in its own, container]`. 12조합 다시 확인: `one at container`·`in its own a time`·`in its own as it's out`·`as soon container`·decoy `on the field`를 붙인 셋 모두 불성립. why `'one at a time(하나씩)', 'in its own container(자기 용기에 따로)', 'as soon as(~하자마자)'는 서로 바꿔 끼울 수 없는 굳은 짝이에요. 검체가 여러 개일 때는 나오자마자 하나씩, 각자 자기 용기에 라벨을 붙여요.` / words에 `w-container` 더함(9.5에 있음) |
| N2 (약) | 1 pair `[on the, record]` · decoy `the room` | 'on the record'는 '공식 발언으로'라는 관용구라 why의 '기록으로 남겨'와 다름. `out the room`은 구어로 성립 | `[on the, record]` → `[write it, down]`, decoy → `a label`. 12조합(`out down`·`write it loud`·`write it word`·`word for a label` 등) 불성립 확인. why의 셋째 짝을 `'write it down(받아 적다)'`, words의 `w-record` → `w-write`(1.2에 있음) |
| N3 ★ | 18 swap 정답 `It touched the table, so I'll tell the surgeon and recollect.` · who `간호사 → 집도의` | `recollect` = 회상하다. 집도의에게 "tell the surgeon"(3인칭). 다시 채취할지는 집도의가 정함(slider 18 why와도 어긋남). `table`은 백 테이블(멸균)로 읽힘(N9) | who `간호사 → 동료 간호사`. 세 보기의 `It touched the table`을 `It touched the counter`로. 정답 `It touched the counter, so I'll tell the surgeon and open a new kit.` / ko `카운터에 닿아서 집도의에게 알리고 새 키트를 열게요` / notes 키를 새 문장으로(내용 `사실을 알리고 새 키트를 준비하는 올바른 대응이에요.`) / why `오염된 시료는 집도의에게 알리고 새 키트를 준비해요. 다시 채취할지는 집도의가 정해요.` before[1]도 새 오답 문장으로 |
| N4 ★ [안전] | 14 swap 정답 `The site doesn't match, so I'll fix it before sending.` | slider 14가 오답으로 가르치는 '혼자 고치기'와 같음. 좌우·부위는 집도의와 함께 | 정답 `The site doesn't match, so let's resolve it before sending.` / ko `부위가 일치하지 않으니 보내기 전에 함께 바로잡아요` / note `다른 점을 말하고 집도의와 함께 바로잡는 올바른 순서예요.` / why `부위가 요청서와 다르면 보내기 전에 집도의와 함께 바로잡아요. 비슷하다며 보내거나 병리과의 눈에 맡기지 않아요.` |
| N5 | 6 swap 정답 `…so I'll fix it first.` · context 6 ok:false `fix` `…so I'm correcting it before I send it.` | 어느 쪽(라벨·요청서)이 맞는지 확인 전에 고친다는 말. slider 19·swap 19가 '혼자 고치기'를 오답으로 가르침 | swap 정답 `The label doesn't match the requisition, so let's verify it before I fix it.` / ko `라벨이 요청서와 일치하지 않으니 고치기 전에 함께 확인해요` / note `다른 점을 말하고 확인한 뒤 바로잡는 올바른 순서예요.` (context 6 fix는 C6에서 바뀜) |
| N6 | 15 swap who `간호사 → 집도의` · 정답 `I'm holding it until the surgeon tells us whose it is.` | 집도의에게 집도의를 3인칭으로 말함 | who `간호사 → 동료 간호사` (나머지 그대로) |
| N7 [범위] | 7 slider 정답 `I'm carrying it to pathology right now.` | 냉동절편은 수술 진행 중 — 순환간호사가 방을 비우고 직접 가는 말(S5와 같은 문제) | `I'm sending it to pathology right now.`(37자, 다른 보기 39·39) / why 첫 문장 `…미루지 않고 바로 병리과로 보내요.` |
| N8 ★ [사실] | 8 slider cue `…its tip brushes the drape.` · scale[2] `It's only a drape…` · context 8 장면 1(ok) `The swab touched the drape, so it is no longer sterile.`·장면 2 fix · swap 8 세 보기 `The tip touched the drape…` · swap ko `가림포` | 수술포 윗면은 멸균 — 닿아도 오염이 아님. 학습자가 '수술포 = 비멸균'으로 외움 | 닿은 곳을 **포장지 바깥(비멸균)**으로: slider cue `…its tip brushes the outside of the wrapper.`, scale[2] `It's only the wrapper, so I'll use it as it is.`, context 8 장면 1 `The swab touched the outside of the wrapper, so it is no longer sterile.`, 장면 2 fix `The swab touched the outside of the wrapper, so it is no longer sterile — I'm opening a new one.`, swap 8의 `touched the drape` 둘(보기 0·2) → `touched the wrapper`, swap ko `끝이 포장지 바깥에 닿아서 새 무균 면봉을 열게요`, context why·swap notes의 '가림포' 표현도 '포장지 바깥'으로 |
| N9 ★ [사실] | 18 slider cue `A culture sample just touched the back table, which is not sterile.` | 백 테이블은 멸균 영역 — 사실 오류 | `A culture sample just touched the circulator's counter, which is not sterile.` (scale 그대로) |
| N10 | slider 6·8·11·17 순서 | 정답(가장 신중한 말)이 첫 칸이고 뒤로 갈수록 약해짐 — 강→약 거꾸로 | 6(정답 칸을 섞으려고 '혼자 고침'을 강한 끝에): `["It's probably a typo, so I'll send it.", "I'm holding it until we sort this out.", "I'll just reprint it to match the requisition."]` answerAt 1 (why는 아래) · 8(N8 반영): `["It's only the wrapper, so I'll use it as it is.", "I'll just wipe the tip off and use it.", "I'll open a new sterile swab and redo it."]` answerAt 2 · 11: `["A few bits, and the lab can count them.", "Several small pieces, sizes aren't needed.", "Three pieces, with each size on the form."]` answerAt 2 · 17: `["I'll prepare nothing until the result is final.", "I'll wait to see if the surgeon asks again.", "I'll get set up for a wider resection now."]` answerAt 2. 8·11·17의 why는 그대로 둬도 뜻이 맞음. 6의 why는 둘째 문장을 `오타일 거라 넘기면 다른 환자의 결과와 섞일 수 있고, 요청서에 맞춰 혼자 라벨을 다시 뽑으면 어느 쪽이 맞는지 확인되지 않아요.`로 |
| N11 | slider 2·4·14·19 축 없음 + 16 순서 + 13·20 정답 칸 재배치 | 2·4·14·19는 세 보기가 서로 다른 행동이라 약함→강함이 아님. 16은 가장 약한 말([2] counting mistake)이 끝에 있음. 축을 '덜 함 → 알맞음 → 혼자 넘침(결정·폐기·수정·자리 비움)'으로 맞추면 정답이 2번 칸에 몰리므로 20은 넘치는 끝을 더하고 13은 정답이 0번 칸인 축으로. **'멈춤(stop)'을 지나친 쪽으로 두지 않음** — KP 15.1·16.1·19.1과 tagline 16이 멈추라고 가르침 | **2** `["Maybe formalin? I'm not really sure.", "It goes in formalin, as the requisition says.", "Formalin, always — every specimen goes in formalin."]` answerAt 1 / why `요청서가 일반 병리라고 하면 포르말린이에요. 망설이면 집도의가 다시 확인해야 하고, '모든 검체는 포르말린'이라고 단정하면 냉동절편·배양·특수 검사용 검체를 망쳐요.` · **4** `["I'll send it once we're closing.", "It goes fresh with no fixative, straight to pathology.", "I'll leave the room and run it down myself right now."]` answerAt 1 / why 끝에 `…순환간호사가 방을 비우고 직접 뛰어가면 수술방에 사람이 비어요. 이송은 정해진 사람에게 맡겨요.` · **14** `["Hmm, okay — I'll send it as is.", "I'll resolve that with you before sending.", "I'll just change the requisition myself to match."]` answerAt 1 / why `그대로 보내면 잘못된 부위로 진단이 나가고, 혼자 요청서를 고치면 어느 쪽이 맞는지 확인되지 않아요. 보내기 전에 집도의와 함께 바로잡아요.` · **19** `["I'll just cross out the name and write ours in.", "I'm stopping to recheck the patient's identity.", "I'll throw the specimen out and start fresh."]` answerAt 1 / why `이름을 고쳐 쓰면 검체의 출처를 보증할 수 없고, 검체를 버리면 다시 얻지 못할 수 있어요. 멈추고 신원을 다시 확인한 뒤 기관 절차(집도의·병리과 알림, 사건 보고)를 따라요.` · **13**(조심의 세기, 정답 0) `["I'll carry it flat and keep it steady.", "I'll stop at every corner so it never tilts.", "I'll wrap it tight in gauze so it can't move."]` answerAt 0 / why `평평하고 흔들림 없이 옮기면 충분해요. 모퉁이마다 멈추면 늦어지고, 거즈로 꽁꽁 싸면 그 자체가 조직을 눌러요.` · **16**(순서만) `["I'll chalk it up to a counting mistake.", "I'll look for it quietly once the case is over.", "I'm stopping to search and tell the surgeon."]` answerAt 2 (why 그대로) · **20**(넘치는 끝을 더함 — K1과 같은 기준) `["I'll hand it to whoever is walking past.", "I'll have it signed for and confirm it arrived.", "I'll leave the case and walk it down myself."]` answerAt 1 / why 끝에 `…수술 중에 교대 없이 방을 비우고 직접 가면 수술방에 사람이 비어요.` → N7·N10·N11 반영 뒤 분포(스크립트로 셈) 0번 칸 1 · 1번 칸 9 · 2번 칸 9, 정답 길이 가장 김 5(동률 2 별도) · 가장 짧음 3(동률 1) · 가운데 8 — 쏠림 없음 |
| N12 | 7 swap why `…마냥 기다리겠다는 투도, 재촉하는 투도 아니에요.` | 재촉하는 보기가 없음 | `냉동절편은 집도의가 기다린다는 점을 분명히 하며 나오는 대로 수술방으로 알려 달라고 부탁해요. 아무 때나, 하루 끝에 알려 달라는 말이 아니에요.` |
| N13 | 17 swap why `…마무리하거나 아무것도 바꾸지 않지 않아요.` | 이중 부정 비문 | `양성 결과를 받으면 집도의의 결정을 전하고 추가 준비로 이어가요. 마무리하거나 준비를 그대로 두지 않아요.` |
| N14 (약) [사실] | 10 slider why `…병리과가 절제연의 방향을 알 수 있는 유일한 표지라서` | 잉크·요청서 그림도 방향 정보 — '유일한'은 과장 | `…병리과가 절제연의 방향을 알아보는 중요한 표지라서` |
| N15 (약) | 16 slider cue `The count shows two specimens went in…` | 검체는 'went in'이 아니라 '나왔다(came off/were passed off)' | cue `Two specimens were passed off the field, and you can find only one.` |
| N16 (약) [범위] | 16 context 장면 2(ok) `I'm searching the field and the containers for the missing one.` | 순환간호사 혼자 수술 시야를 수색 | `We're searching the field and the containers for the missing one.` |

### 4-2. context — 핸드오프 모양(v46 7번)

`word`는 21개 모두 세 장면 `en`에 있다(W14 0). 그러나 **어색한 장면 17개가 '같은 뜻을 그 자리에 안 맞는 말투로'가 아니라 얼버무림("I think"·"somewhere")·무시("whatever")·근거 없는 단정("I'm sure it's his")**이라 누구에게 해도 틀린 **다른 내용**이다(TASK 9: 어색한 장면은 그 말을 듣는 사람에게 맞지 않게 쓴 곳). 이 주제는 새로 저작한 뉘앙스라 `who`·`icon`도 바꿀 수 있다. 아래는 어색한 장면만 바꾸고(위치 그대로 — 7·7·7 분포 유지) ok 장면은 그대로 둔다. 바꾼 곳마다 why 셋째 문장을 새 장면에 맞게(형식: "하지만 ○○에게 '△△' 같은 말은 □□. ◇◇로 말해요.").

표의 19행 = 핸드오프 모양이 아닌 17개 + 경계 사례 2개(C2·C13: 차트에 구어라 자리는 어긋나지만 `I guess`·`no big deal`이 내용을 줄임 — 그 말만 빼면 됨).

유지: **7(pathology)·17(positive)** — 보호자에게 결과·추측을 말하는 장면이라 듣는 사람이 다르고, fix가 '집도의가 설명한다'로 바뀌는 것은 간호사가 결과를 전하지 않는 원칙이라 타당.

| # | word | 지금 어색한 장면 | 바꿀 장면 (who · icon · en · fix) | why 셋째 문장의 요지 |
|---|---|---|---|---|
| C0 | label | 병리 기사에게 "It's got a label on it somewhere, I think…" | `간호사 → 이송 담당자` · pager · `Label verified: two identifiers, site and laterality concordant.` · fix `It's labeled and checked — please take it straight to pathology.` | 이송 담당자에게 차트 말은 할 일을 알려 주지 못함. context `ko`를 `라벨(붙이다)`로(세 장면 중 둘이 동사) |
| C1 | appendix | 병리 기사에게 "It's an appendix, or something like that, I think." | `간호사 → 보호자` · faceWorried · `The appendix specimen was verbally confirmed and sent for histopathology.` · fix `Her appendix is out, and we've sent it to the lab to be checked.` | 보호자에게 'verbally confirmed·histopathology'는 낯선 차트 말 |
| C2 | formalin | 차트 "Plopped it in some formalin, I guess." | (차트 그대로) `So I just popped the gallbladder in formalin and sent it off!` · fix 그대로 | 같은 사실을 말하듯·감탄으로 적으면 기록 문체가 아님('I guess'는 빼서 내용을 같게) |
| C3 | handoff | 차트 "Gave the specimens to some guy, handoff whenever." | (차트 그대로) `Did the handoff to the courier — he signed, all good!` · fix 그대로 | 같음 — 차트에 구어 |
| C4 ★ | frozen | 병리 기사에게 "It's frozen, you know, like icy cold…"(다른 뜻) | `간호사 → 보호자` · faceWorried · `His tissue went for frozen section during the case.` · fix `We sent a small piece of tissue to the lab for a quick check during surgery.` · context `ko` `냉동절편` | 보호자에게 'frozen section'은 조직을 얼린다는 말로 들려 헷갈림 |
| C5 | orientation | 차트 "Orientation: the stuff on top is kinda up, I guess." | (차트 그대로) `Got the orientation from the surgeon — short one's up top, long one's on the side!` · fix 그대로 | 같음 — 차트에 구어 |
| C6 | label | 병리 기사에게 "The label is a bit off, whatever…" | `간호사 → 이송 담당자` · pager · `Label–requisition discrepancy on the first name; specimen pending reconciliation.` · fix `Please don't take this one yet — the label needs fixing first.` | 이송 담당자에게 필요한 것은 '아직 가져가지 말라'는 말 |
| C8 | sterile | 미생물 검사실에 "…then not really, probably fine." | `간호사 → 깨어 있는 환자` · me · `Sterile technique was breached, so the culture swab is compromised.` · fix `I'm just opening a new swab to keep everything clean.` | 깨어 있는 환자에게 'breached·compromised'는 겁을 줌 |
| C9 | specimen | 병리 기사에게 "…the left one and the other one." | `간호사 → 보호자` · faceWorried · `Bilateral specimens, A left and B right, are en route to pathology.` · fix `We've sent both samples, one from each side, to the lab.` | 보호자에게 'bilateral·en route'는 차가운 전문어 |
| C10 | margin | 병리 기사에게 "…a stitch somewhere on the edge, probably." | `간호사 → 깨어 있는 환자` · me · `Your margins are marked so pathology can check for residual tumor.` · fix `The surgeon marked the tissue so the lab can look at it carefully.` | 깨어 있는 환자에게 'residual tumor'는 결과를 단정하듯 들림 |
| C11 | fragment | 병리 기사에게 "…a fragment or two in there, or a bunch, I dunno." | `간호사 → 보호자` · faceWorried · `Three fragments were submitted in toto for histologic evaluation.` · fix `We sent three small pieces of tissue to the lab.` | 보호자에게 'in toto·histologic'은 못 알아듣는 말 |
| C12 | protocol | 이송 담당자에게 "…be careful or whatever." | `간호사 → 보호자` · faceWorried · `Her specimen requires special handling per lab protocol.` · fix `The lab has special steps for her sample, and we're following them.` | 보호자에게 'per lab protocol'은 딱딱함 |
| C13 | crush | 차트 "The tissue got crushed a bit, no big deal." | (차트 그대로) `Oops, the specimen got a little crushed on the way — told the surgeon and pathology!` · fix 그대로 | 같은 사실을 감탄·구어로 — '별일 아니다'(내용 축소)는 뺌 |
| C14 | site | 병리 기사에게 "The site? Somewhere on the left, or maybe right…" | `간호사 → 이송 담당자` · pager · `Site: left breast; laterality concordant with the requisition, verified.` · fix `It's checked and ready — please take it to pathology now.` | C0과 같음 |
| C15 | unlabeled | 병리 기사에게 "…but I'm sure it's his." | `간호사 → 이송 담당자` · pager · `Unlabeled container — specimen identification pending surgeon verification.` · fix `Please don't take this one — it isn't labeled yet.` | 이송 담당자에게 필요한 것은 '가져가지 말라' |
| C16 | field | 병리 기사에게 "It's somewhere in the field probably, who knows." | `간호사 → 이송 담당자` · pager · `Specimen unaccounted for; sterile field search in progress.` · fix `We're still looking for one sample — please wait here a moment.` | 같음 |
| C18 | surface | 미생물 검사실에 "It sat on a surface for a second, it's fine." | `간호사 → 깨어 있는 환자` · me · `The culture contacted a non-sterile surface and is contaminated.` · fix `We're taking a fresh sample so the result is accurate.` | 깨어 있는 환자에게 'contaminated'는 불안을 줌 |
| C19 | identity | 병리 기사에게 "Identity? It's one of ours, we'll figure it out." | `간호사 → 이송 담당자` · pager · `Identity discrepancy on the label — specimen on hold pending re-verification.` · fix `Please wait — this label needs fixing before it goes.` | 같음 |
| C20 | log | 이송 담당자에게 "Just log it somewhere, I guess, whatever." | (이송 담당자 그대로) `Log the chain-of-custody transfer with a timestamp and receiver attestation.` · fix 그대로 | 이송 담당자에게 'chain-of-custody·attestation'은 지나치게 딱딱해 무엇을 할지 흐림 |

---

## 5. 결정 11 — 문장(v44 필드) 고칠 것

### 5-1. 문장 en·ko·chunks (keyPhrase 아님) — 대안 chunks는 모두 `assembles_to`·`min_chunks_for`(V8)·`dangling_chunks`(V9)로 확인. words는 새 en에 있음, 고친 뒤 상황마다 서로 다른 단어 8개 이상(최소 상황 1·7·9·18이 8개), 고아 단어 0, 뉘앙스 `words`(V15) 모두 남음

| # | 문장 | 문제 | 고칠 en · ko · chunks · words | 딸린 것 |
|---|---|---|---|---|
| S1 [사실] | 보존액 #3 `This specimen goes straight into formalin.` | 근거 없이 단정 — 같은 상황 KP가 '요청서·병리과 확인' | en `Per the requisition, this specimen goes into formalin.` / ko `요청서대로 이 검체는 포르말린에 넣어요.` / chunks `["Per the requisition", ", this specimen", "goes into formalin", "."]` / words `[w-requisition, w-specimen, w-formalin]` | v46 필드 B가 새로 |
| S2 [사실] | 특수 취급 #4 `This specimen goes on ice, not in formalin.` | 같음 | en `Per the protocol, this specimen goes on ice, not in formalin.` / ko `지침대로 이 검체는 포르말린이 아니라 얼음에 놓아요.` / chunks `["Per the protocol", ", this specimen goes", "on ice", ", not in formalin", "."]` / words `[w-protocol, w-specimen, w-ice, w-formalin]` | B. 메모 B의 12.4 오답 고민도 함께 풀림 |
| S3 ★ [범위] | 냉동절편 준비 #5 `I'll tell the surgeon as soon as I hear back.` | 결과를 간호사가 받아 전함 | en `When pathology calls, I'll put them through to the surgeon.` / ko `병리과에서 전화가 오면 집도의에게 바로 연결할게요.` / chunks `["When pathology calls", ", I'll", "put them through", "to the surgeon", "."]` / words `[w-pathology, w-surgeon]` | B, order 4 줄 4 `When they reply, I'll tell the surgeon.` → `When they call, I'll put them through to the surgeon.` |
| S4 | 라벨 불일치 #5 `I'll correct the name and confirm it again.` | 고친 뒤 확인 — 순서가 거꾸로, 어느 쪽이 틀렸는지 모른 채 고침 | en `Let's confirm which one is wrong before we fix it.` / ko `고치기 전에 어느 쪽이 틀렸는지 확인해요.` / chunks `["Let's confirm", "which one is wrong", "before", "we fix it", "."]` / words `[w-confirm, w-fix]` | B. order 6 줄 3 `I'll correct the name to match the chart.`은 줄 2에서 차트와 대조한 뒤라 **유지** |
| S5 ★ [범위] | 냉동절편 이송 #4 `I'll carry it to the lab myself.` | 수술 중 순환간호사가 방을 비움, 같은 상황 KP 7.1(다른 사람에게 부탁)과 어긋남 | en `I'll find someone to carry it to the lab now.` / ko `지금 검사실로 옮겨 줄 사람을 찾을게요.` / chunks `["I'll find someone", "to carry it", "to the lab", "now", "."]` / words `[w-carry, w-lab]` | B, w-carry example·exKo(W15) |
| S6 ★ [범위] | 냉동절편 이송 #5 `Let me know the result as soon as it's ready.` | 이송 담당자에게 결과를 알려 달라 함 — 결과는 병리의 → 집도의 | en `Please have pathology call the room with the result.` / ko `결과가 나오면 병리과에서 수술방으로 전화하도록 전해 주세요.` / chunks `["Please have", "pathology", "call the room", "with the result", "."]` / words `[w-pathology, w-result]` | B |
| S7 ★ [안전] | 요청서 일치 #5 `I'll correct this discrepancy right now.` | 부위 불일치를 혼자 정정(slider 14와 모순) | en `Let's resolve this discrepancy before it goes.` / ko `보내기 전에 이 불일치를 함께 바로잡아요.` / chunks `["Let's resolve", "this discrepancy", "before it goes", "."]` / words `[w-discrepancy]` | B, order 14 줄 3 `I'll correct that discrepancy right now.` → `Let's resolve that discrepancy right now.` |
| S8 [사실] | 라벨 없는 검체 #5 `I'll label it as soon as we identify the patient.` | 환자는 이미 확인된 사람 — 모르는 것은 '무슨 검체인가'(저작자 메모와 같음) | en `I'll label it once the surgeon confirms what it is.` / ko `집도의가 무엇인지 확인해 주면 라벨할게요.` / chunks `["I'll label it", "once", "the surgeon confirms", "what it is", "."]` / words `[w-surgeon, w-confirm]` (같은 상황 KP 15.2가 이미 the surgeon을 3인칭으로 씀) | B |
| S9 ★ [범위] | 분실 #5 `I'll search the field systematically before we panic.` | 수술 시야 수색은 스크럽·집도의 몫, `before we panic`은 비전문적 | en `While you check the field, I'll search the containers.` / ko `수술 시야를 확인해 주시는 동안 저는 용기들을 찾아볼게요.` / chunks `["While you check", "the field", ", I'll search", "the containers", "."]` / words `[w-check, w-field, w-search, w-container]` | B |
| S10 (약) | 냉동절편 결과 #3 `Let's tell the team the margins came back positive.` | 결과의 출처(병리의 → 집도의)가 빠져 간호사가 결과를 퍼뜨리는 말로 읽힘 | en `Pathology told the surgeon the margins came back positive.` / ko `병리과에서 집도의에게 절제연이 양성으로 나왔다고 알렸어요.` / chunks `["Pathology told", "the surgeon", "the margins", "came back positive", "."]` / words `[w-pathology, w-surgeon, w-margin, w-positive]` | B |
| S11 ★ [범위] | 오염 재채취 #5 `I'll confirm the surface was touched before we discard it.` | '닿았는지 확인한 뒤 버린다'는 순서가 어색, 버릴지는 집도의 | en `I'll report it before we discard it.` / ko `버리기 전에 보고할게요.` / chunks `["I'll report it", "before", "we discard it", "."]`(V8 3/3) / words `[w-report, w-discard]` (상황 18은 KP가 집도의를 부르지 않아 3인칭 집도의를 피함) | B, order 18 줄 3·4 `Because of that, we'll discard it and open a new sterile kit.` · `I'll collect a fresh sample with that kit.`(간호사가 버리고 채취) → `Because of that, I'll report it and open a new sterile kit.` · `Then we'll collect a new sample with that kit.` |
| S12 ★ [안전] | 잘못된 라벨 #5 `I'll verify identity again before we relabel it.` | 보고 없이 혼자 재라벨 | en `I'll report this before we relabel it.` / ko `다시 라벨하기 전에 이 일을 보고할게요.` / chunks `["I'll report this", "before", "we relabel it", "."]` / words `[w-report]` | B, order 19 줄 4 `After that, I'll verify identity once more and relabel it.` → `After that, I'll report it before anyone relabels it.` |
| — (기준) | 직접 들고 가는 문장 | **수술 진행 중**(냉동절편 = 집도의가 기다림, 대체 불가 검체를 수술 도중 '내가 직접')에 순환간호사가 교대 없이 방을 비우는 말만 고친다(7.4·slider 7·20.2·20.5·slider 4·20의 넘치는 끝). 상황 13(손상 방지 이송)은 시점 표시가 없어 수술 뒤 검체를 가져가는 일로 읽히므로 13.5·slider 13·order 13 줄 4는 **유지**. 20.6 `before I go`·context 20 `before I leave the room`도 교대 뒤 나가는 말로 읽혀 유지 | — | — |
| S13 (약) [범위] | 대체 불가 #5 `I'll carry this to pathology and confirm it arrived safely.` | 수술 중 직접 가겠다는 약속(K1과 같은 문제) | en `I'll call pathology to confirm it arrived safely.` / ko `병리과에 전화해서 잘 도착했는지 확인할게요.` / chunks `["I'll call pathology", "to confirm", "it arrived safely", "."]` / words `[w-pathology, w-confirm]` | B |
| S14 | chunks 구 경계(비KP) | 2.5 `if we're / not sure` · 20.3 `this specimen—it can't / be replaced`(조동사와 본동사를 끊음) · 11.3 `before I write / them down`(구동사를 끊음) | 2.5 `["I'll call", "pathology", "if we're not sure", "."]` · 20.3 `["Let's not lose", "this specimen—it", "can't be replaced", "."]` · 11.3 `["Let's count", "the pieces", "before I", "write them down", "."]` | changes `fields: [chunks]` |
| S15 | 8.0(KP)·18.4 `words`의 w-fresh | 두 문장의 fresh는 '새것'(a fresh sterile swab·a fresh sample)인데 w-fresh 카드는 '고정액에 담그지 않은'. 18.4 ko `신선한 검체`도 같은 오역 | 8.0·18.4 words에서 w-fresh를 뺌(상황 8은 9개, 18은 8개로 V3 통과, 두 상황 뉘앙스는 w-fresh를 안 씀). 18.4 ko `새 키트로 새 검체를 다시 채취해요.` | changes `fields: [words]`·18.4 `[words, ko]`, 18.4 distractorsKo 둘 다시 |
| S16 | 분실 #3 ko `수술 시야의 용기를 전부 수색해야 해요.` | w-search ko를 '샅샅이 찾다'로 고치면서('수색'은 어색) 문장은 옛 말 | ko만 `수술 시야의 용기를 전부 샅샅이 찾아봐야 해요.` | distractorsKo 둘 다시 |
| S17 (약) | 다수 검체 #5 ko `각 용기는 바로 자기 라벨을 받아요.` | 번역투 | ko만 `용기마다 바로 따로 라벨을 붙여요.` | distractorsKo 둘 다시 |
| S18 (약) | 구두 확인 #5 ko `검체가 방을 떠나기 전에 함께 확인해요.` | '방을 떠나다' 직역 | ko만 `검체가 수술방을 나가기 전에 함께 확인해요.` | distractorsKo 둘 다시 |

### 5-2. keyPhrase 문장의 ko만 (en·chunks 그대로, changes에 `fields: [ko]`)

| # | 문장(KP) | 문제 | 새 ko | 딸린 것 |
|---|---|---|---|---|
| KO1 | 라벨 없는 검체 #2 `Let's identify it now with the surgeon.` | it은 검체 — '신원'은 사람에게 쓰는 말 | `지금 집도의와 함께 이 검체를 식별해요.` (같은 상황 15.4·slider·swap·order가 '누구 것'을, S8이 '무엇'을 말하므로 둘을 다 덮는 말로) | distractorsKo 둘 다시, w-identify exKo(W6) |
| KO2 | 냉동절편 결과 #1 `We're extending the resection—let's set up.` | `확대할게요`는 간호사의 결정으로 들림. en은 팀 계획 전달 | `절제 범위를 넓히게 됐어요—준비해요.` | distractorsKo 둘 다시, w-extend·w-resection exKo |
| KO3 | 분실 #1 `Let's stop and search the field and containers.` | 옛 말 '수색'(S16과 같음) | `멈추고 수술 시야와 용기들을 샅샅이 찾아봐요.` | distractorsKo 둘 다시, w-search exKo |
| KO4 (약) | 보존액 #1 `The lab wants it fresh for this test.` | `검사실에서 신선한 상태로 원해요` 비문 | `이 검사는 검사실에서 신선한 상태로 받기를 원해요.` | distractorsKo 둘 다시, w-lab·w-fresh·w-test exKo |

### 5-3. 변경 목록(`changes-or-specimen.yaml`, 55건) 판정
- word-remove 9건(공통 목록 patient·name·time·go + 목록 밖 add·call·next·open·another) 타당 — 1할(10개) 안쪽.
- word-add 3건: `mix up`(9.3)·`figure out`(15.4)·`unlabeled`(KP 15.1) 모두 문장에 그대로 있고 가르칠 값이 있음. **타당.**
- 헤드워드 2건: `hand off`(3.0 handing off)·`on the way`(4.2) — 단독 hand(손)·way(길)는 뜻이 틀렸으므로 **타당.** `w-hand`(hand off)와 `w-handoff`(인계)가 같은 소리·같은 조각이지만 품사·ko가 달라 둘 다 둠.
- ko 10건 타당. check·verify·identify·confirm 정답 둘 해소, sample/fragment/log 분리도 맞음. 놓친 것: W5(frozen)·W6(identify의 '신원')·S15(fresh).
- 문장 words 31건 타당. w-label·w-count·w-correct를 품사가 다른 문장에서 뺀 기준도 맞음. 다만 w-log는 ko를 동사 '일지에 적다'로 바꾸고 명사 문장 3.5·20.6(handoff log)의 태그를 남김 — 빼면 상황 20 뉘앙스(context `log`·slider)가 V15에 걸리므로 그대로 두고 cue만 W13(명사도 같은 말이라고 밝힘).
- (보고만) 간호사가 이미 아는 말이 아직 은행에 있음: read·say·write·send·stop·need·wait·left·right·date·size·ice·together·touch. 1할 상한을 이미 채웠고 V3 여유가 적은 상황(1·7·9·18 = 8개)이 있어 이번에는 빼지 않는 것이 맞음.

---

## 6. 저작자 메모 판정

| 메모 | 판정 |
|---|---|
| 냉동절편 결과 #0 `The frozen margins are positive.` (KP) | **en 유지** — 집도의가 이미 받은 결과를 팀에게 되말하는 상태 보고. slider 17 cue·context 17이 출처를 가르침. chunks만 §9 |
| 냉동절편 결과 #3 (비KP) | 동의(약) → S10 |
| 냉동절편 결과 #1 `We're extending…` (KP) · #4·#5 | #1은 `We're`(팀)로 집도의 결정을 전하는 말 — en 유지, ko만 KO2. #4 `if we're extending`·#5 `I'll prep for a wider resection`은 준비 행동이라 유지 |
| 오염 재채취 #1 `Let's discard it and re-collect cleanly.` (KP) | **en 유지 권고** — 상황이 배양 면봉(다시 얻을 수 있음)이고 `Let's`는 집도의에게 하는 제안. B가 why에 "다시 채취할지는 집도의가 정함"을 적을 것 |
| 오염 재채취 #3 `…let's discard it.` | 유지 — #1과 같은 꼴(팀 제안, 면봉) |
| 오염 재채취 #5 | 동의 → S11 |
| 보존액 #3 · 특수 취급 #4 | 동의 → S1·S2 |
| 잘못된 라벨 #2 `Let's re-verify identity and relabel now.` (KP) | §9 K4(바꾸기 약하게) |
| 잘못된 라벨 #5 | 동의 → S12 |
| 라벨 없는 검체 #5 | 동의 → S8 |
| 라벨 불일치 #5 | 동의 → S4 |
| 대체 불가 #2 `I'll hand-carry it to pathology myself.` (KP) | §9 K1(바꾸기) |
| 대체 불가 #5 | 동의(약) → S13 |
| 분실 #5 | 동의 → S9 |
| `This is gallbladder, correct?` (KP) | §9 K2(바꾸기 약하게) — 수술방 구어로 통하지만 관사 없는 영어를 외우게 함 |
| `This frozen needs to go now.` (KP) | **유지 권고** — 'a frozen'은 미국 수술방의 실제 말(tagline도 같음). 학습자가 들어야 할 말 |
| 방향 표시 #0 `Which suture marks the superior margin?` | 유지 — 집도의에게 묻는 말이라 역할이 맞음 |
| 다수 검체 #1 `specimen A, left; specimen B, right` (KP) | 유지 — 구두 확인 형식. 라벨에는 부위가 들어간다는 것은 context 9·slider가 가르침. chunks만 §9 |
| 다른 은행 단어의 ko를 오답으로 쓴 곳(메모는 6곳, 실제 7곳) | **문제 없음** — write `읽다`(read)·fresh `냉동된`(frozen)·log `서명하다`(sign)·`보고하다`(report)·orientation `크기`(size)·carry `버리다`(discard)·fragment `표면`(surface). 모두 정답과 뜻이 분명히 달라 정답이 둘이 되지 않음(금지는 '같은 뜻'끼리). 실제로 헷갈리는 말이라 오히려 좋은 오답 |
| w-identity 정답 조각 `tit` | **문제 없음** — 지금 chips는 `[[i, den, ti, ty]]`로 `tit` 조각이 없음(w-identify도 `[[i, den, ti, fy]]`). 조각을 다시 자를 때 `tit`을 만들지 않도록만 |
| 새 단어 mix up·figure out·unlabeled | 타당(§5-3) |
| 헤드워드 hand off·on the way | 타당(§5-3) |
| B 메모(오답 ko가 확인 동사를 옆 단계로 바꾼 것 등) | B 검토 몫. 단 4.5·7.5·12.4·20.2·20.5는 이 검토에서 문장이 바뀌므로 B가 새 문장 기준으로 다시 씀 |

---

## 7. 표 — distractorsEn 품사가 다른 것, 정답으로도 맞는 오답, 정답의 다른 뜻을 쓴 오답

★ = 꼭 바꿀 것(정답이 둘). 나머지는 권장.

| 단어(품사) | 지금 오답 | 문제 | 대안 |
|---|---|---|---|
| ★ container(명) | canister | '통·용기' — ko·cue에 그대로 맞음(W2) | contaminant |
| ★ kit(명) | tray | 기구 세트 — cue에 그대로 맞음(W3) | cot |
| ★ section(명, 절편) | dKo 절개 | section의 다른 뜻(제왕절개·절단)(W1) | 도말·염색 |
| check(동) | cheek(명) | 하나 | chalk |
| wait(동) | weight(명) | 하나 | wade |
| touch(동) | torch(명) | 하나(동사로는 '불 지르다') | tuck |
| date(명) | dare(동) | 하나 | gate |
| right(명, 오른쪽) | eight(수사) | 하나 | height |
| (약) appendix(명) | appendage | cue "작은 돌기"에 사전 뜻이 걸치나 ko 맹장으로 갈림 | 그대로 둬도 됨 |
| (약) handle(동) | tackle | '처리하다'로 겹치나 tackle은 문제·과제에 씀 | 그대로 둬도 됨 |
| left(명) | lift·loft | 둘 다 명사로 쓰임 | 그대로 |

---

## 8. 기계적 전수 확인 결과

- **pair 1(조직명 구두 확인)** — 왼쪽 3 × (오른쪽 3 + decoy 1) = 12조합: `out loud`✓ · `out word`✗ · `out record`✗ · `out the room`△(구어로 성립) · `word for word`✓ · `word for loud`✗ · `word for record`✗ · `word for the room`✗ · `on the record`✓ · `on the loud`✗ · `on the word`✗ · `on the the room`✗. 정답 하나지만 decoy가 구어로 붙고 `on the record`의 뜻이 why와 다름 → N2.
- **pair 9(다수 검체)** — 12조합: `one at a time`✓ · `one at away`✗ · `one at as it's out`✗ · `one at on the field`✗ · `right a time`✗ · `right away`✓ · **`right as it's out`✓** · **`right on the field`✓** · `as soon a time`✗ · `as soon away`✗ · `as soon as it's out`✓ · `as soon on the field`✗. **정답 둘** → N1. 대안 짝도 12조합 불성립 확인.
- **swap(21개)** — 21개 모두 `before[0]`·`before[2]`가 빈 문자열(문장 통째 고르기)이라 이어 붙인 문법은 맞고 `before[1]`은 모두 오답 보기 안에 있음. 정답은 모두 하나. swap `ko` 21개는 정답 문장의 뜻과 맞음 — 18(recollect, N3)·14(N4)·6(N5)은 정답을 바꾸면서 ko도 새로, 8은 '가림포'(N8). 7의 ko '방으로'는 '수술방으로'가 자연스러움(B·수정 담당 재량). '한 단어 바꾸기'가 아니라 '문장 고르기'인 것은 형제 OR 주제와 같아 결함으로 세지 않음.
- **context(21개)** — word 21/21이 세 장면 `en`에 있음. 핸드오프 모양 2개(7·17), 경계 2개(2·13 — C2·C13), 아님 17개(§4-2). `word`·`ko` 짝: 4(frozen ↔ 냉동된, why는 '냉동절편')·0(동사·명사 섞임)만 어긋남.
- **slider(19개) 약함→강함** — 성립 9개(0·3·5·7·12·15·18·20 + 10은 약하게). 강→약 거꾸로 4개(6·8·11·17, N10). 축 없음 4개(2·4·14·19, N11). 16은 [2]가 가장 약한데 끝에 있음(N11에서 순서를 바꿈), 13은 세 보기가 서로 다른 행동(N11). cue로 정답이 둘인 것 0. 정답이 KP와 어긋나는 것 1(7, N7).
- **정답 칸·장면 위치 분포** — slider `answerAt` 0:6 · 1:6 · 2:7(고르게). slider 정답 길이(19개): 혼자 가장 김 4(3·4·5·10) · 동률 가장 김 2(18·19) · 혼자 가장 짧음 1(17) · 동률 가장 짧음 1(6) · 셋이 같음 2(7·13) · 가운데 9 — 길이로 맞힐 수 없음. swap 정답 칸 0:7 · 1:7 · 2:7. context 어색한 장면 0:7 · 1:7 · 2:7. N7·N10·N11을 반영한 뒤 slider는 0:1 · 1:9 · 2:9(스크립트로 셈 — 거꾸로 된 넷을 뒤집기만 하면 2번 칸이 11개로 몰려서 6·20에 넘치는 끝을, 13에 정답 0번 칸 축을 둠).
- **chunks(127문장)** — 비KP 끊김은 S14 셋 + 바뀌는 문장 안(16.5·18.5 등은 새 문장으로 해소). KP는 §9 끝 목록.
- **decoyChips × chips** — 정답 조각·decoy의 1~3조각 모든 순열을 금칙어 목록(비속어·성적·술·마약·장례·폭력·무기·민족 비하)과 대조. 걸린 것: `dix`(W4) · `pot` 2·`come`·`lick`·`pos`(W9) · `lay`·`bud`·`cul`(일상어·외국어라 둠). decoy로 정답 철자를 다른 경로로 만드는 조합 0.
- **distractorsEn 품사** — §7 표.
- **고친 뒤 확인(모의 반영 스크립트)** — S1~S13·S15를 반영해도 상황마다 서로 다른 단어 8개 이상, 뉘앙스 `words`가 모두 그 상황 문장에 남음(V15), 고아 단어 0.

---

## 9. 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)

KP en을 바꾸기로 하면 `in-or-specimen.json`의 `keyPhrases` 같은 문자열도 함께 바꿔야 V4가 통과합니다. 바꾸면 그 문장의 chunks·ko·v46 필드, 그 문장을 example로 쓰는 단어의 example·exKo, 뉘앙스 보기·example, order 줄이 함께 바뀝니다(항목마다 적음). 상황 21개의 대화 상대(persona)는 모두 `colleague`이고, tagline이 집도의를 3인칭으로 부르는 상황(4·7·15·17)이 있어 대화 상대가 집도의가 아닌 경우가 많지만 상황 18·19·20은 불분명합니다. 그래서 아래 대안은 **대화 상대를 3인칭(the surgeon)으로 부르지 않게** 썼습니다. 대안 chunks는 모두 V5·V8·V9 함수로 확인했습니다.

- **K1 20.2** `I'll hand-carry it to pathology myself.` · 문제: 수술 중 순환간호사가 교대 없이 방을 비우는 약속 — 지키지 못할 수 있음. 대체 불가 검체를 사람이 직접 들고 가는 것 자체는 맞는 관행 · 대안 `I'll make sure it's hand-carried to pathology.`(chunks `I'll make sure / it's hand-carried / to pathology / .`, words `[w-carry, w-pathology]`) · **권고: 바꾸기.** 연쇄: order 20 줄 3 `Once we both agree, I'll make sure it's hand-carried to pathology.`, 20.6 `before I go`는 그대로 둬도 됨.
- **K2 0.1** `This is gallbladder, correct?` · 문제: 관사 없는 영어(수술방 구어로는 통함) · 대안 `This is the gallbladder, correct?`(chunks `This is / the gallbladder / , correct / ?`) · **권고: 바꾸기(약하게).** 연쇄: w-gallbladder·w-correct example.
- **K3 7.0** `This frozen needs to go now.` · 문제: frozen을 명사로 쓰는 구어 · 대안 `This frozen section needs to go now.`(chunks `This frozen section / needs to go / now / .`) · **권고: 유지** — 미국 수술방의 실제 말이고 tagline도 같은 말. W5로 카드 뜻이 '냉동절편'이 되면 맞물림.
- **K4 19.2** `Let's re-verify identity and relabel now.` · 문제: 보고 없이 그 자리에서 재라벨 — 라벨 오류는 알리고 기관 절차대로 정정 · 대안 `Let's re-verify identity, report it, and then relabel.`(chunks `Let's re-verify identity / , report it / , and then relabel / .`, words `[w-verify, w-identity, w-report]`) · **권고: 바꾸기(약하게)** — `Let's`라 혼자 하는 말은 아님. 연쇄: w-identity example·exKo, order 19 줄 4.
- **K5 14.2** `I'll fix any discrepancy before sending.` · 문제: 부위·좌우 불일치를 간호사 혼자 고친다는 말로 읽힘(slider 14 오답과 겹침, slider 14 example이 이 문장) · 대안 `We'll fix any discrepancy before sending.`(chunks `We'll fix / any discrepancy / before sending / .`) · **권고: 바꾸기(약하게).** 연쇄: slider 14 example.
- **K6 17.0** `The frozen margins are positive.` · 문제(저작자 지적): 간호사가 결과를 전함 · 대안 `Pathology says the frozen margins are positive.`(chunks `Pathology says / the frozen margins / are positive / .`) · **권고: 유지** — 집도의가 받은 결과를 팀에 되말하는 상태 보고. chunks만 아래.
- **K7 7.2** `Call me the moment you have a result.` · 문제: 결과를 간호사에게 달라는 말 — 결과는 병리의가 집도의에게(수술방 전화) · 대안 `Call the room the moment you have a result.`(chunks `Call / the room / the moment / you have a result / .`) · **권고: 바꾸기(약하게).** 연쇄: order 7 줄 4 `Call the room the moment you have it.`
- **K8 17.1** `We're extending the resection—let's set up.` · **권고: 유지**(팀 계획 전달) — ko만 KO2. 대안이 필요하면 `The surgeon is extending the resection—let's set up.`(대화 상대는 tagline상 집도의가 아님).
- **K9 18.1** `Let's discard it and re-collect cleanly.` · **권고: 유지**(배양 면봉·팀 제안). 대안이 필요하면 `Let's flag it and re-collect cleanly.`
- **K10 12.1** `Does it go on ice or in a specific media?` · 문제: media는 복수(단수는 medium) — 검사실 구어로는 'media'를 단수처럼 씀 · 대안 `Does it go on ice or in specific media?`(chunks `Does it go / on ice / or / in specific media / ?`) · **권고: 바꾸기(약하게).** 연쇄: w-ice·w-media example, order 12 줄 2.
- **유지 권고:** 0.0 `…with the patient's name.`(이름은 식별자 하나 — 두 식별자는 context 0·chart 장면이 가르침), 16.1 `Let's stop and search…`(팀, ko만 KO3), 15.2(ko만 KO1), 2.0~2.2, 9.1, 13.2 `Carry it steady…`(구어 부사, 통함).
- **KP chunks 구 경계(보고만 — 대안은 V8 조각 수를 지킴)**
  - 4.0 `for frozen / section—no fixative`(복합명사를 끊음) → `This is / for / frozen section—no fixative / .`
  - 9.1 `specimen A, left; specimen B / , right`(세미콜론 경계를 넘음) → `This is / specimen A, left; / specimen B, right / .`
  - 16.0 `is unaccounted / for`(unaccounted for를 끊음) → `One specimen / is / unaccounted for / .`
  - 17.0 `The frozen / margins` → `The frozen margins / are / positive / .`
  - 12.1 `or in / a specific media` → `Does it go / on ice / or / in a specific media / ?`
  - 15.0 `has no / label` → `This container / has / no label / .`
  - (약) 6.2 `until this / is corrected` → `I won't / send it / until this is corrected / .`
  - (약) 8.2 `before it / dries out` → `I'll get it / to micro / before / it dries out / .`
  - (약) 3.1 `that you / received them` → `Can you / sign / that you received them / ?`
  - (약) 13.1 `so it / doesn't fold` → `Place it / flat / so it doesn't fold / .`
  - (피할 수 없음) 17.1 `the resection—let's`·15.1 `Stop—we can't`·19.1 `Stop—do not` — 엠대시 앞뒤에 공백이 없어 조각이 대시로 시작할 수 없음. en을 바꾸지 않는 한 그대로.

---

## 10. 종합

검체 흐름(복창·라벨·고정액·인계 서명·방향 표시)의 바탕 사실은 탄탄하고 swap·context 위치 분포와 slider 길이 분포도 고르다. 다만 **백 테이블·수술포를 비멸균으로 가르치는 뉘앙스 4곳**, slider 14와 모순되는 '부위 불일치를 간호사가 고친다'는 정답(swap 14·14.5), 냉동절편 결과를 간호사가 받아 전하는 문장, 수술 중 직접 들고 가겠다는 문장, pair 9의 정답 둘, `recollect`, 핸드오프 모양이 아닌 context 17개를 고쳐야 한다. ★와 [안전]·[범위]·[사실] 항목을 고친 뒤 다시 검사를 통과하면 내보내도 된다.

**개수:** 고칠 것 72건 = 단어 15(W1~W15) · 뉘앙스 16(N1~N16) · context 19(C0~C20 중 7·17 제외) · 문장 18(S1~S18) · KP ko 4(KO1~KO4) (W15는 KO·S의 연쇄) — 그중 ★ 17건(W1~W4, N1·N3·N4·N8·N9, C4, S3·S5·S6·S7·S9·S11·S12). 안전·범위·사실 18건: [안전] N4·S7·S12 3 · [범위] N7·N16·S3·S5·S6·S9·S11·S13 8 · [사실] N8·N9·N14·W10·S1·S2·S8 7. KP 사용자 결정 10건(바꾸기 권고 1 · 약하게 바꾸기 5 · 유지 4).
