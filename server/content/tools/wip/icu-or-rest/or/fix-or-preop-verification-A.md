# or-preop-verification — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `or-preop-verification.yaml`(A·B 합본). 단어 188, 상황 21(문장 126), 뉘앙스 42(slider 18 · swap 11 · context 10 · pair 3).
비교: base · changes(75건: word-remove 18 · word ko/example 7 · sentence words 50) · in-json · notes-A · notes-B.
검사기: `verify_one_theme.py or or-preop-verification.yaml` → `==> 통과`.
임시 스크립트: `_reviewA_or-preop-verification_dump.py`(words/sents/nuance), `_reviewA_or-preop-verification_checks.py`(길이·cue·decoyChips·slider·pair 전 조합·swap 이어 읽기), 출력 `_reviewA_or-preop-verification_nuance.txt`·`_combos.txt`.
번호는 "상황.문장"(둘 다 0부터). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 철자·소리 닮음 대체로 좋음(conform·precede·herbal·induction/reduction). 품사 다른 오답 ★2(accept `except`, band `bend`), 낮음 2(anyone `anytime`, count `round`). 뜻이 겹치는 오답 1(go in `come in`) |
| 2 distractorsKo·길이 | 4 | 길이 위반 0(스크립트). 정답 둘 되는 ko 오답 1(ID `출입증` — ID 배지도 ID) |
| 3 cue | 3 | 정답 영어 노출 0. 그러나 약 20개가 `ko` 낱말을 그대로 되풀이한 사전 풀이(start·arrive·permission·send·must…). w-verify cue는 "두 사람이"라는 틀린 정의, w-loud cue는 뜻 자체가 틀림 |
| 4 chips/decoyChips | 3 | 대체 조립 경로 없음. **불쾌한 조각 ★3**: `cun`(consent·continue — 비속어 앞부분), `mex-`(mixup — 민족 비하 약칭), `ax`(무기). 낮음: `sin`·`vice`·`fist`·`bad`·`chick`·`dye`(die 동음). 술·장례·성적 조각은 그 밖에 없음 |
| 5 뉘앙스·문장 사실 | 2 | why·notes 대부분은 Universal Protocol에 맞음(환자 개방형 진술, 표시는 집도의·깨어 있는 환자 참여, 누구든 멈춤, 동의 범위는 집도의가 설명, 금식 판단은 마취과, 자격 통역사, 미확인 환자 임시 식별자). 그러나 **문장 17.4(모든 미확인 환자에게 같은 번호)·14.3(지킬 수 없는 약속)**, 역할 밖 3(6.5·16.4·10.5), 사실 과장 4(3.5·13.3·15.4·12.3), 그리고 v46 why가 이것들을 그대로 정당화 |
| 6 뉘앙스 설계 | 3 | **pair 7·19 decoy `the stretcher`가 `bring in`·`change`에 붙음(정답 둘)**. context 10개 중 듣는 사람이 같은 것 3(2·14·19), 19는 어색함이 말투가 아니라 압박(내용), 13 장면 3의 `ipsilateral first`는 의미 없는 말. slider 1 정답 둘, slider 3·13 순서 불분명, slider 11 why가 KP 11.1의 `note`를 깎아내림, slider 16 why가 같은 상황 16.4와 충돌 |
| 7 결정 11 | 4 | 쉬운 말 18 삭제·ko 가르기 7(check/confirm/verify, correct/exact, count/cover, note/record)은 타당. 남은 흠: w-loud ko 틀림, w-send(구동사), w-person 7.5 오태그, w-prep ko 너무 넓음, w-eye(or-count 기준과 맞춤), w-count `간주되다` 어색 |

## 사실 오류·심각한 문제
1. **[안전] 17.4 "Every unidentified patient gets the same temporary band and number."**(비KP) — 미확인 환자는 **환자마다 고유한** 임시 이름·번호를 받습니다(같은 번호면 두 미확인 환자가 섞임 — 이 주제가 막으려는 바로 그 사고). v46 why("Every와 the same으로 같은 틀로 부여")도 이를 강화 → S1.
2. **[지킬 수 없는 약속] 14.3 "If they find something else in there, they'll still ask you first."**(비KP) — 수술 중 환자는 마취 상태라 물을 수 없고, 동의서에 예기치 못한 소견 조항이 있는 경우도 많음. 간호사가 범위를 약속하는 것은 slider 14(정답 "The surgeon will explain what's covered")와도 정면 충돌. v46 why "약속해요"도 틀림 → S2.
3. **[역할] 6.5 "We correct the paperwork now"** — 동의서를 간호사가 고치는 것으로 읽힘. 동의서는 집도의가 환자와 다시 작성 → S3. **16.4 "I'm not comfortable inducing this patient"** — 유도는 마취과 몫(저자 지적 타당) → S4. **10.5 "we get a new consent"** — 동의는 시술자가 받음 → S11.
4. **[사실] 3.5 "not pen from the floor"** — 표시 주체는 시술 의사(또는 위임된 시술 참여 의료인)이고 기준은 "소독 후에도 보이는 표시". 병동 펜이라는 구분은 근거 없음(저자 지적 타당) → S5. **13.3 "We never mark … both eyes at the same moment"** — 양측 수술은 수술 전 양쪽을 다 표시하는 것이 원칙. 따로 하는 것은 소독·타임아웃·시술 → S7. **15.4 "Everyone stops talking until the site and the consent agree"** — 불일치는 말로 풀어야 하므로 "말을 멈춘다"는 틀림. 멈추는 것은 하던 일. v46 why("잡담까지 멈추고")도 → S8.
5. **[설계] pair 7·19 decoy `the stretcher`** — `bring in the stretcher`·`change the stretcher`가 자연스러운 영어 → N1·N2.
6. **[설계·일관성] slider 16 why** "'마음이 불편해요'처럼 돌려 말하지 말고" vs 같은 상황 16.4 문장(why: "위계가 있어도 말을 꺼내기 쉬워요"). TeamSTEPPS CUS에서 "I'm uncomfortable"은 정당한 상향 단계 → N6.

## 고칠 것 — 문장 (keyPhrase 아님 + KP의 ko·words)
문장 en을 바꾸면 `chunks`·`ko`·`words`를 함께 바꾸고, **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 전부 새로** 쓰고, 그 문장을 example로 쓰는 단어의 `example`/`exKo`도 맞추고(V17), `changes-or-preop-verification.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 **distractorsKo 둘을 새 ko에 맞춰 다시** 쓰세요. 해당 상황 `order` 줄에 같은 말이 있으면 함께 맞추세요(B 참고: order 5·6·10·11·12·13·14·15·16·17).

- **S1 ★[안전] 17.4** · en `Every unidentified patient gets a temporary band with a unique number.` · chunks `Every unidentified patient / gets a temporary band / with a unique number / .` · ko `미확인 환자마다 고유 번호가 적힌 임시 밴드를 채워요.` · words `[w-every, w-unidentified, w-temporary, w-band, w-number]`. v46 전부 새로(지금 why "the same으로 같은 틀"·distractorsKo "같은 임시 병실/가운과 번호"는 같은 오류). w-number example/exKo를 새 문장으로. order 17 영향 없음.
- **S2 ★[약속] 14.3** · en `If you're worried they'll find something else, ask your surgeon first.` · chunks `If you're worried / they'll find something else / , ask your surgeon / first / .` · ko `안에서 다른 게 발견될까 걱정되시면, 먼저 집도의에게 물어보세요.` · words `[w-find, w-else, w-ask, w-surgeon, w-first]`. v46 전부 새로(지금 why "약속해요"). w-find example/exKo 맞춤.
- **S3 [역할] 6.5** · en `Your surgeon will redo the paperwork with you before anyone signs anything else.` · chunks `Your surgeon will redo / the paperwork with you / , before anyone signs / anything else / .` · ko `다른 서명을 하기 전에 집도의가 환자분과 서류를 다시 작성할 거예요.` · words `[w-surgeon, w-paperwork, w-anyone, w-sign, w-else]`. v46 전부 새로. w-paperwork·w-anyone·w-else example/exKo 맞춤. order 6 4줄 "we correct the paperwork"도.
- **S4 [역할] 16.4** · en `I'm not comfortable proceeding with induction without a signed form.` · chunks `I'm not comfortable / proceeding with induction / without / a signed form / .` · ko `서명된 서식 없이 마취 유도를 진행하는 건 마음이 편하지 않아요.` · words `[w-comfortable, w-proceed, w-induction, w-sign, w-form]`. v46 전부 새로(why에 CUS 우려 표현임을 그대로 두되 '완곡'이 아니라 '우려를 분명히 꺼내는 단계'로). w-comfortable example/exKo 맞춤.
- **S5 [사실] 3.5** · en `We only accept a mark in permanent ink that stays visible after the prep.` · chunks `We only accept / a mark in permanent ink / that stays visible / after the prep / .` · ko `소독 후에도 보이는, 지워지지 않는 잉크 표시만 인정해요.` · words `[w-accept, w-mark, w-permanent, w-ink, w-prep]`(w-floor 뺌 — 8.3에 남음). v46 전부 새로. w-accept·w-permanent·w-ink example/exKo 새 문장으로, **w-floor example은 8.3 `This patient came straight from the floor without a mark.` / `이 환자는 병동에서 곧장 올라왔고 표시가 없어요.`로**.
- **S6 [ko·저자 메모] 3.3** · en `Your surgeon marks the site with their initials while you're still awake.`(signs his → 성별 가정 없앰, '서명'이 아니라 '표시') · chunks `Your surgeon marks the site / with their initials / while you're still / awake / .` · ko `집도의가 환자분이 아직 깨어 계실 때 부위에 이니셜로 표시해요.` · words `[w-surgeon, w-mark, w-site, w-initial, w-awake]`(w-sign 뺌 — 다른 문장에 많음). v46 전부 새로. w-awake example/exKo 맞춤. *en을 그대로 둘 경우 최소 수정: ko `집도의는 환자분이 아직 깨어 계실 때 이니셜로 표시해요.` + distractorsKo 둘.*
- **S7 [사실] 13.3** · en `We never prep both eyes at the same moment — one eye at a time.` · chunks `We never prep / both eyes / at the same moment / — one eye at a time / .` · ko `두 눈을 동시에 소독하지 않아요 — 한 번에 한쪽씩이에요.` · words `[w-prep, w-both, w-moment]`(w-mark·w-eye 뺌; W5와 함께). v46 전부 새로. w-prep example/exKo 맞춤. order 13 3줄도.
- **S8 [사실] 15.4** · en `Everyone stops what they're doing until the site and the consent agree.` · chunks `Everyone stops / what they're doing / until the site / and the consent / agree / .` · ko `부위와 동의서가 일치할 때까지 모두 하던 일을 멈춰요.` · words 그대로. v46 전부 새로(blank `talking`·why "잡담까지"). order 15 3줄 "stops talking"도.
- **S9 [과장·저자 메모] 11.4** · en `Per policy, two clinicians witness and sign off on the verbal consent.` · chunks `Per policy / , two clinicians / witness and sign off / on the verbal consent / .` · ko `규정에 따라 임상의 두 명이 구두 동의를 증인으로 확인하고 서명해요.` · words 그대로. 판정: 구두·전화 동의에 증인 둘은 미국 병원에서 흔한 규정이라 내용은 맞지만, 정책마다 다르므로 'Per policy'로 단정을 풀고 why에도 "병원 규정에 따라". v46 전부 새로. w-clinician example/exKo 맞춤. order 11 3줄도.
- **S10 [사실·저자 메모] 12.3** · en `A parent or legal guardian must sign for a child who's a minor.` · chunks `A parent or legal guardian / must sign / for a child / who's a minor / .` · ko `미성년 아이는 부모나 법적 보호자가 대신 서명해야 해요.` · words 그대로. 판정: 성년 나이는 주마다 다름(앨라배마·네브래스카 19, 미시시피 21)·해방 미성년자 예외. v46 전부 새로(blank `eighteen/twelve/…` 못 씀). w-parent·w-must·w-child example/exKo 맞춤. order 12 2줄도.
- **S11 [역할] 10.5** · en `If the timing is wrong, the surgeon gets a new consent before we proceed.` · chunks `If the timing is wrong / , the surgeon gets / a new consent / before we proceed / .` · ko `시점이 잘못됐다면 진행하기 전에 집도의가 동의를 새로 받아요.` · words `[w-timing, w-wrong, w-surgeon, w-new, w-consent, w-proceed]`. v46 전부 새로. w-wrong·w-new example/exKo 맞춤. order 10 3줄도.
- **S12 [저자 메모·어조] 16.5** · en `We're holding everything here until the surgeon gets the consent signed.` · chunks `We're holding everything / here / until the surgeon / gets the consent signed / .` · ko `집도의가 동의서 서명을 받을 때까지 여기서 모든 걸 보류해요.` · words `[w-hold, w-surgeon, w-consent, w-sign]`. 판정: "Get me the consent now, or…"는 최후통첩이고 동의서를 '가져오는' 일이 아님. v46 전부 새로(why "요청과 결과를 함께 말하면 힘이 실려요"는 위협 어조를 칭찬함).
- **S13 [금식·저자 메모] 5.3** — 판정: en "counts"(먹은 것으로 친다 → 알려야 할 대상)는 그대로 둬도 됨. 문제는 ko/why가 "물 한 모금도 금식 위반"으로 단정하는 것(맑은 물·약과 한 모금 허용은 마취과 지침에 따라 다르고, 같은 상황 slider 5도 "판단은 마취과"). ko `사탕 하나, 물 한 모금도 해당되니 정확하게 말씀해 주세요.` + distractorsKo 둘 다시 + why를 "작은 것도 빠짐없이 말해야 마취과가 판단한다"로. w-candy·w-sip·w-count·w-exactly exKo 맞춤. order 5 2줄 ko도.
- **S14 [닫힌 질문·저자 메모] 5.5** — "You followed instructions and stopped eating after midnight, correct?"는 swap 5가 틀렸다고 가르치는 유도 질문 모양이고 why("correct?로 … 기회를 줘요")도 swap 5와 모순. 'midnight'는 환자가 받은 지시로 두면 사실 문제는 없음. en `Your instructions said nothing after midnight — when did you last eat?` · chunks `Your instructions said / nothing after midnight / — when did you / last eat / ?` · ko `안내에는 자정 이후 금식이라고 되어 있었는데요 — 마지막으로 언제 드셨어요?` · words `[w-instruction, w-midnight, w-eat]`(w-follow는 17.0, w-stop은 여러 곳에 남음). v46 전부 새로. **w-follow example → 17.0 `We follow the unidentified patient protocol.` / `저희는 미확인 환자 프로토콜을 따라요.`**, **w-stop example → 7.0 KP** 그대로 옮김, w-instruction·w-midnight example/exKo 새 문장으로.
- **S15 (낮음) [ko] 15.5** ko `이 방의 모든 목소리가` → `이 방의 모두가 쪽을 확인할 때까지 저희는 한 치도 움직이지 않아요.` + distractorsKo 둘, w-inch·w-voice exKo.
- **S16 (낮음) [과장] 14.4** en `Anything outside this scope would normally need a separate consent.` · chunks `Anything outside this scope / would normally need / a separate consent / .` · ko `이 범위 밖의 것은 보통 별도 동의가 필요해요.` words 그대로. v46 새로. w-outside·w-scope·w-separate example/exKo.
- **S17 [태그] w-person 7.5에서 뺌** — `in person`(직접)은 카드의 '사람'이 아님. 18.3에 남음. 상황 7은 18개.
- **S18 [청크] 비KP** — 18.4 `Nobody touches / this patient / until the name and chart / match / .`(`until the name / and chart match`가 주어를 끊음). (선택) en 과장("Nobody touches" — 모니터링·처치는 계속)도 손보려면 `Nothing starts on this patient until the name and chart match.`로, words `[w-nothing, w-start, w-chart, w-match]`, w-touch example → 20.4.
- **S19 [ko] KP 20.0** ko `반대 쪽을 준비하고 있어요` → `반대 쪽을 소독하고 있어요`(prep = 피부 소독; W6과 함께) + distractorsKo 둘.
- **S20 (낮음) [ko] 환자에게 '당신'** — 3.2 외 12.0 KP `당신이 법적 보호자이신가요?` → `법적 보호자 되시나요?`, 14.1 KP `당신의 허락` → `환자분의 허락`, 19.2 KP `당신의 동의` → `환자분 동의`, 19.5 `당신에게서 직접` → `환자분께 직접`. 각 distractorsKo 둘, 관련 exKo.
- **S21 (낮음) [swap 끝 문장부호]** swap 18 answer `Stop — this isn't the patient on my list`에 마침표 없음(before[2]가 빈칸) → before[2]를 `.`로.

## 고칠 것 — 단어
- **W1 ★ w-accept** dEn `except`(전치사) → `adapt`. (`access` 유지)
- **W2 ★ w-band** dEn `bend`(주로 동사) → `bond`는 이미 있으니 `bend` → `brand`.
- **W3 w-anyone** dEn `anytime`(부사) → `everyone`. **w-count** dEn `round`(주로 형용사·명사) → `bounce`.
- **W4 w-goin** dEn `come in` — '들어오다'로 정답과 거의 같은 뜻 → `give in`.
- **W5 w-eye 삭제** — 간호사가 아는 말(or-count W7과 같은 기준). 13.1 KP·13.3·13.4·13.5 words에서 뺌 → word-remove. 상황 13 단어 수 충분.
- **W6 w-prep** ko `준비하다` → `(수술 부위를) 소독하다`(수술실에서 prep은 피부 소독; cue도 그 뜻). dKo `[취소하다, 반납하다]` → `[봉합하다, 표시하다]`. **w-mark dKo `소독하다`는 `덮다`로**(같은 은행 뜻과 겹침 피함). exKo들 맞춤.
- **W7 ★ w-loud** — ko `큰 소리로`는 `out loud`(소리 내어)의 뜻이 아니고 cue("시끄러운 방에서 소리를 키운다")도 틀림. 0.5가 이 단어만 태그하므로 삭제 대신 헤드워드를 구로(결정 11): en `out loud` · ipa `/ˌaʊt ˈlaʊd/` · ko `소리 내어` · chips `[[out], [loud]]` · decoyChips `[load]` · dEn `[out late, all out]` · dKo `[속으로, 글로 써서]` · cue `환자가 머릿속으로만 생각하지 말고 입 밖으로 말해 주길 바랄 때`. id 그대로, changes에 en·ipa·ko.
- **W8 w-send** `send` → `send back` · ipa `/ˌsɛnd ˈbæk/` · chips `[[send], [back]]` · dEn `[set back, send off]` · decoyChips `[sand]` · ko `돌려보내다` 그대로(이제 구의 뜻과 맞음).
- **W9 w-count** ko `간주되다`(법률 투) → `해당되다` · dKo `[제외되다, 거절되다]` → `[제외되다, 생략되다]` · exKo는 S13 새 ko로. (S13에서 en을 바꾸지 않는 전제)
- **W10 w-id** dKo `출입증` → `보험증`(ID 배지도 ID라 정답 둘).
- **W11 decoyChips ★** — w-consent·w-continue `cun` → `kon`·`cin`; w-mixup `mex-` → `max-`; w-exact `ax` → `ix`. 낮음: w-sign `sin` → `sine`, w-voice `vice` → `vote`, w-fast `fist` → `fest`, w-nobody `bad` → `bid`, w-check `chick` → `cheek`, w-eye `dye`(W5로 삭제되면 무관).
- **W12 cue** — ko 낱말을 되풀이만 하는 사전 풀이를 장면 단서로(정답 영어 금지):
  - w-verify `두 사람이 … 검증하는 일` → `기록과 기준을 맞대어 틀림없는지 따져 보는 일 — 동의 시각이 투약 전인지 볼 때`(지금 정의는 '두 사람'이 틀림)
  - w-start `새 일을 처음으로 시작하는 일` → `응급 수술에서 첫 처치에 들어간 시각을 적을 때의 동사`
  - w-arrive `도착하는 일` → `이송된 병원의 기록이 이쪽에 와 닿을 때`
  - w-permission `허락해 주는 일` → `계획 밖의 시술을 하려면 환자에게서 받아야 하는 것`
  - w-send `되돌려 보내는 일` → `잘못 올라온 환자를 원래 병동으로 내려보낼 때`
  - w-must `반드시 그렇게 해야 한다` → `미성년자 동의서에 누가 서명할지는 선택이 아니라고 말할 때`
  - w-separately `하나씩 따로따로` → `양쪽 수술에서 두 쪽을 한 번에 묶어 확인하지 않을 때`
  - w-comfortable `편안하게 느끼는` → `동의서 없이 유도하려는 마취과에 우려를 꺼낼 때 'not ~'로`
  - w-already `이미 끝났다` → `동의서를 받기 전에 진정제가 벌써 들어갔을 때`
  - w-paperwork `서류 일체` → `동의서·차트를 통틀어 말하는 행정 일감`
- **W13 (낮음) w-glance** ko `흘낏 봄` — 문장은 `at a glance`(한눈에). 고치려면 en `at a glance` · ko `한눈에` · chips `[[at], [a], [glance]]` · dEn `[at a distance, at a time]` · dKo `[멀리서, 한 번에]`. 그대로 둬도 오류는 아님(저자 판단 존중 가능).
- **W14 (낮음) tag** — w-sedate·w-medicate·w-sedation이 `알레르기·금식`인 것은 맞지 않음 → `수술 단계`. w-freeze ko `얼어붙다`(겁에 질린 느낌) → `그 자리에 멈추다`.

## 고칠 것 — 뉘앙스
- **N1 ★ pair 7** decoy `the stretcher` → `at a glance`(`bring in at a glance`·`clarify at a glance` 둘 다 안 됨).
- **N2 ★ pair 19** decoy `the stretcher` → `at a glance`(`change at a glance`·`let at a glance` 안 됨). 다른 결합(`change your surgeon know`·`let your mind`) 성립 안 함 확인. pair 4는 12결합 전부 정답 하나.
- **N3 slider 1** — scale[0] `The chart says right too`도 cue("honestly say")에 맞는 참말 → `Sounds right to me`(확인 없이 동의, 약함)로.
- **N4 (낮음) slider 3** — scale[0] `I think there's a mark there`와 [1] `I can see something on your arm`의 강약 순서가 불분명 → [1]을 `There's a mark on your arm`으로. **slider 13** — [0] `We'll check it all later`와 [1] `Go ahead, we checked both earlier`의 순서가 불분명 → [0] `Let's just keep going`, [1] `We checked both earlier`, [2] 그대로.
- **N5 slider 11 why** "기억해 두기나 대충 적기만 하면" — 가운데 보기 `I'll note it on the record`를 '대충'이라 하면 KP 11.1 "I'll note the time and witnesses on the record"와 어긋남. → "가운데 보기는 무엇을 적는지(시각·증인)가 빠져 있어요"로.
- **N6 slider 16 why** → "'I'm not comfortable'은 우려를 꺼내는 정당한 표현(CUS)이지만, 약이 준비된 지금은 멈추라는 말까지 분명히 해야 해요."
- **N7 (낮음) slider 5 cue** 마지막 문장 "Whether it matters is the anesthesia team's call, not yours."가 정답을 알려 줌 → 빼기. why에 "경계 사례 판단은 마취과"를 남김(KP 5.2 결정과 함께).
- **N8 context 2 (`sign`)** — 장면 1(환자)과 3(불안한 환자)이 같은 듣는 사람, `sign`은 일반인도 아는 말, 간호사가 동의서 서명을 받는 장면은 역할도 어긋남. → word `signature`, ko `서명`, words `[w-signature]`: ① 간호사 → 집도의 `Her signature and the date are on the consent, and it matches the case.` ok ② 수술 기록 `Consent: pt signature, date and time verified.` ok ③ 불안한 환자에게 `Your signature has been authenticated and the instrument duly executed.` ok:false, fix `Your signature is right here, and everything matches what you told me.` why도 새로.
- **N9 context 14 (`consent`)** — 장면 1·3 모두 환자. 장면 1을 who `간호사 → 집도의`, en `Her consent covers the planned procedure only — she has questions about anything extra.`로.
- **N10 context 19 (`mind`)** — 장면 1·3 모두 환자이고 장면 3의 어색함이 말투가 아니라 압박(내용). → ① 간호사 → 집도의 `She's changed her mind and wants to talk with you before anything else.` ok ② 기록 그대로 ③ 환자에게 `Pt has changed mind; withdrawal of consent documented; case on hold.` ok:false, fix `You've changed your mind, and that's completely okay — I'll let your surgeon know.` why: 차트 말투를 환자에게 쓰면 결정이 서류 처리로 들린다.
- **N11 context 13 (`side`)** 장면 3 `Both sides are done sequentially, ipsilateral first.` — 양쪽 눈에서 'ipsilateral first'는 뜻이 없음 → `Each side undergoes independent laterality verification before the second procedure.`(fix 그대로).
- **N12 (낮음) context 20 (`wrong`)** fix `We caught a wrong mark…` — 장면은 표시가 아니라 반대 쪽 소독 → `We caught that the wrong side was being prepped before anything started, and your husband is safe.` context 17 fix는 도착한 가족이 신원을 도울 수 있으니 `We haven't been able to confirm who he is yet — could you help us?`로(낮음).
- **N13 (낮음) context 7 (`stop`)** — 일반인도 아는 말을 word로 골랐고 어색함은 `laterality discrepancy`에서 옴. 손보려면 swap으로 바꿈: who `간호사 → 불안한 환자`, before `["", "We have stopped due to a laterality discrepancy", "."]`, options `[We've stopped for a moment because what you said and the mark don't match, We have stopped due to a laterality discrepancy, Something's wrong with your surgery]`, words `[w-stop, w-mark, w-match]`. 같은 이유로 context 20 `wrong`·13 `side`도 일반 말(보고만).
- **N14 (낮음) swap 8 ko** `집도의가 표시할 때까지 보류해요` → `집도의가 표시할 때까지 보류합시다`(let's). 나머지 swap ko 10개는 정확. swap 이어 읽기 33줄 전부 문법 맞음(swap 15 `Let's keep moving: …`는 콜론 뒤가 어색하지만 오답 보기라 허용).

## 결정 11 판정
- changes 75건: 공통 목록 10(name·today·morning·know·see·come·patient·body·room·time)과 목록 밖 8(make·say·look·here·put·water·red·yesterday) 삭제 타당. ko 가르기 7건 타당(그중 count `간주되다`만 W9로 다듬기). changes why에 "너무 쉬움 — 너무 쉬움 —" 중복 표기(문구만).
- **저자 메모 판정**
  - 추가 시술 "먼저 물어본다"(14.3) → 맞음, S2(KP 14.1은 아래 결정).
  - "permanent ink, not pen from the floor" → 맞음, S5.
  - 응급 동의 "임상의 두 명" → 부분 맞음(흔한 규정이나 정책마다 다름), S9로 단정만 풂.
  - 금식 "midnight"·"a sip of water counts" → 5.5는 지시로 읽히면 사실 문제 없고 유도 질문 모양이 문제(S14), 5.3은 ko/why의 단정이 문제(S13).
  - "I'm not comfortable inducing" → 맞음, S4.
  - 소아 "under eighteen" → 맞음, S10.
  - 3.3 "이니셜에 서명" → 맞음, S6.
  - w-dob·w-dob-abbr 같은 뜻 → ko가 `(약자)`로 이미 갈리고 서로의 오답으로 쓰이지 않아 듣고 뜻 고르기에서 정답 둘이 되지 않음 → **유지**. (규정을 엄격히 적용하려면 w-dob-abbr word-remove가 대안 — 18.1은 w-match·w-case로 남고 상황 18은 13개)
  - eat·drink 남김 → 쉬운 말이지만 KP 5.0의 유일한 태그이고 결정 11 한도(1할)를 이미 거의 씀 → **유지 수긍**. (더 뺄 후보로만 적어 둠: knee·arm·skin·food·team·new·child·read·write)
  - count ko `간주되다` → 뜻은 맞지만 법률 투 → W9 `해당되다`.
  - note ko '적어 두 다' → 파일에는 `적어 두다`(표준 띄어쓰기)로 들어 있음. **문제 없음, 고칠 것 없음.**
  - w-glance `흘낏 봄` → W13(낮음).
  - 12.5 "this one procedure only"(B 메모) → 소아 단일 시술 장면이라 그대로 둬도 됨.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)
| KP | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 14.1 | Anything beyond that would need your permission. | 수술 중엔 물을 수 없고 동의서에 예기치 못한 소견 조항이 흔함 — 간호사가 범위를 단정 | Anything beyond that is something your surgeon will go over with you. | **유지**(비응급 추가 시술은 실제로 별도 동의가 필요해 틀린 말은 아님). why에 "예기치 못한 소견의 처리는 집도의가 미리 설명"을 덧붙이기 |
| 5.2 | Good — that means you've been fasting long enough. | 금식이 충분한지 판단은 마취과 지침(slider 5와 결이 다름) | Thank you — I'll pass that on to the anesthesia team. | **유지**(수술 전 체크리스트에서 간호사가 기준 충족을 확인하는 것은 일반적). slider 5 why와 함께 "경계 사례는 마취과"로 맞추기 |
| 0.1 | I just want to confirm who you are before we go in. | en은 문제없음. chunks `before we go / in`이 이 문장이 가르치는 구동사 `go in`을 끊음 | (chunks만) `I just want to / confirm who you are / before we go in / .` | **chunks 바꿈** 권고 |
| 8.2 | I'm reporting this as a missing site marking. | chunks `as a missing / site marking`이 명사구를 끊음 | (chunks만) `I'm reporting this / as a missing site marking / .` | **chunks 바꿈** 권고(V8 조각 수 확인) |
| 6.2·15.2·16.1·20.2 | …until this is corrected/resolved/signed/confirmed. | chunks `until this is / X`가 수동태를 끊음 | `until this / is X` | 낮음 — **유지 가능** |
| 12.0 | Are you his legal guardian? | chunks `his`가 홀로 조각 | `Are you / his legal guardian / ?` | 낮음 — **유지 가능** |

KP의 ko만 고치는 것(결정 11 범위)은 위 S19(20.0)·S20(12.0·14.1·19.2)에 넣었습니다.

## 종합
고칠 것 총 50건(문장 21 · 단어 14 · 뉘앙스 14 · KP chunks 1묶음), 그중 안전 1(S1). 핵심은 S1·S2·S3·S4·S5·S7·S8과 pair decoy 둘(N1·N2), 불쾌한 decoyChips(W11 ★)입니다. 이것들을 고친 뒤면 내보내도 됩니다. KP 결정은 모두 '유지' 권고(chunks 두 개만 바꿈 권고).
