# or-emergency-open — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번 context·swap ko)

대상: `or-emergency-open.yaml` (단어 150 · 상황 21 · 문장 105 · 뉘앙스 42 = slider 20 · swap 19 · context 2 · pair 1 · reel 0).
검사기는 이미 통과(`==> 통과`, 변경 목록 91건). 아래는 기계가 못 보는 것. 대상 파일은 수정하지 않았다.

표시: **[안전]** = 학습자가 그대로 따라 하면 실무에서 문제가 되는 것(뜻이 뒤집힘·잘못된 안심 등). **[범위]** = 순환·스크럽 간호사의 업무 범위 밖(수술 방법·전환 결정은 집도의, 약·수혈·기도는 마취과). **[사실]** = 미국 수술실 관행·용어와 다름.
**★** = 꼭 바꿀 것. 문장 `en`·`ko`를 바꾸면 그 문장의 v46 필드(`tag`·`icon`·`why`·`decoy`·`distractorsKo` 둘·`blank`)를 **B가 새로 쓰고**, 그 문장을 `example`로 쓰는 단어의 `example`·`exKo`, order 줄도 맞춘다(항목마다 적어 둠). 문장 `ko`만 고치면 그 문장의 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓴다.

**업무 범위 판정 기준(묶음 4 or-bleeding과 같음):** 처방·시술·결정의 대상이 이름 붙은 말(let's deliver · we need FFP · I'll manage the airway · let's get her to ICU)을 간호사가 1인칭·Let's로 결정하면 고친다. 주어 없는 상태 보고(are drawn · are in · is drawn)와 팀 계획 전달(we'll … and come back)은 유지한다. 응급에서 간호사가 약을 준비하는 일은 병원·역할마다 있으므로 수동 상태 보고는 유지하되, **ko가 "뽑아 뒀어요"(내가 뽑았다)로 행위자를 더한 곳만** 고친다.

---

## 1. 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 같은 분야·비슷한 철자로 고름. 정답으로도 맞는 오답 없음. 두 오답이 모두 품사가 다른 것 1개(manage), 하나만 다른 것 8개 |
| 2 distractorsKo·다른 뜻 | 4 | 길이 위반 없음. `line`의 오답 둘이 모두 line의 다른 뜻(대기 줄·경계선), `each`의 '모든'은 정답 근처, DIC 오답에 영어 약어 `(DVT)` |
| 3 cue | 3 | 정답 노출 없음. 그러나 ko를 되풀이(w-up "세팅이 끝난 상태", w-start "시작할 때", w-check "확인하는 일" 등 9개)하거나 사전 풀이인 것이 약 20개. w-up "수술대 위"(기구대가 맞음), w-platelet "혈액 세포"(세포 조각), w-resuscitate가 19.1의 뜻(손상통제 뒤 소생 치료)과 다름 |
| 4 chips·decoyChips | 4 | 다른 경로로 정답을 만드는 조각 없음(스크립트 확인). 약한 불쾌 조각 셋: `lit`(취함 속어)·`quack`(돌팔이) 두 번·`stiff`(시신 속어) |
| 5 뉘앙스 사실 | 3 | swap 6.n1·10.n1이 순환간호사가 멸균 랩패드를 건네고 가운·장갑을 입혀 준다고 함(스크럽 일), 4.n1이 "계수 생략 = 알 길이 없다"고 단정(AORN은 생략 시 기록·영상 확인), 19.n1 fix의 성별이 문장과 다름(closed → covered는 권장) |
| 6 뉘앙스 설계 | 3 | pair 1개 정답 하나. 그러나 slider 19.n0이 **KP 19.0을 글자 그대로 오답**으로 가르치고, 19.n0·11.n0은 약함→강함 축이 없음, 2.n0 오답이 cue로는 참, **swap 정답이 19/19 첫째**, **slider 정답이 가장 짧은 보기 15/20**(W20은 가장 긴 것만 잡음) |
| 7 결정 11 | 4 | 변경 91건(삭제 18·헤드워드 6·ko 17·문장 태그 50)은 타당하고 목록 밖 쉬운 단어 10개로 상한 지킴. 놓친 것: w-stage ko를 바꾸고 문장 ko "단계별로"를 그대로 둠, w-run 헤드워드(문장은 running), w-pair(each pair of hands = 일손)·20.1 ko 직역, 4.1 ko에 영어 `sharp`, 7.2 ko 비문 |

---

## 2. 사실 오류·심각한 문제

1. **[안전] 15.3 "Compressions are started — someone call the code now."** — 미국 병원에서 *call the code*는 **소생술 중단(사망 시각 선언)**으로도 읽히는 모호한 말이다. 호출은 *call a code*·*call the code team*. 심정지 첫 순간에 중단 선언으로 들릴 수 있는 말을 가르친다. 또 `someone`은 이 주제 slider 20.n0의 why("'누군가'로 시작하면 아무도 안 맡아요")와 정면으로 어긋난다. → S4.
2. **[범위] 간호사가 결정·시술하는 비KP 문장 8개** — 6.3 "while **I** pack the quadrants"(패킹은 집도의), 8.3 "I'm drawing up an extra dose"(처방 없이 여분 약 준비), 13.4 "**let's deliver now**", 15.4 "I'll draw epinephrine **and** keep timing"(기록자와 투약 역할을 한 사람이 동시에), 18.4 "**we need** FFP and cryo now"(제제 요구 = 처방), 19.3 "Let's do a temporary closure **and get her to ICU**", 19.4 "We'll pack now…"(약), 20.3 "**I'll manage the airway**"(기도는 마취과, 같은 상황 KP 20.0 "You take the airway"와도 모순). → S1~S9.
3. **[설계·모순] slider 19.n0** — 오답 칸에 KP 19.0 "Let's pack and do a temporary closure"를 그대로 두고 why에서 "간호사의 몫이 아니에요"라고 한다. 같은 상황이 문장 단계에서는 이 말을 간호사 말로 외우게 한다. → N1, K1.
4. **[사실] swap 6.n1·10.n1의 `who`가 순환간호사** — 순환간호사는 비멸균이라 집도의에게 랩패드를 손으로 건네거나 가운·장갑을 입혀 줄 수 없다(스크럽이 함, 순환간호사는 등끈만 묶음). 은행의 w-circulator cue("소독하지 않은 손으로")와도 모순. → N2·N3.
5. **[사실] swap 4.n1 note·why** — "계수를 건너뛰면 몸 안에 남았는지 알 길이 없다", "건너뛰지 않고". AORN 지침은 생명이 급한 응급에서 계수를 못 하면 그 사실을 기록하고 방을 나가기 전 영상으로 확인하게 한다. 4.n0 why는 "병원 정책에 따라 다를 수 있어요"로 바르게 썼는데 4.n1만 단정. → N4.
6. **ko가 행위자를 더함** — KP 8.1 "Uterotonics are drawn up…"·15.1 "…epinephrine is drawn"은 주어 없는 상태 보고인데 ko는 "뽑아 준비해 뒀어요"·"뽑아 뒀어요"(간호사가 뽑았다는 말). 저작자가 짚은 '간호사가 약을 뽑는 말'은 en이 아니라 ko가 만든 것. → KO3·KO6.
7. **ko 오역** — 20.1 "each pair of hands"(= 일손 한 사람 한 사람)를 "손 하나하나에"로 직역(swap 20.n1 ko·order 20 줄 0 ko도), 7.2 "NICU팀이 **아직** 방에 왔나요?"(비문), 4.1 "거즈와 **sharp**가", 11.1·11.4 "단계별로"(w-stage ko를 '순서대로 미리 놓다'로 고치고 문장은 옛 뜻).

---

## 3. 고칠 것 — 단어 v45 필드

| # | 어디 | 문제 | 어떻게 |
|---|---|---|---|
| W1 ★ | w-line `distractorsKo` [차례(대기 줄), 선(경계선)] | 둘 다 line의 실제 다른 뜻 — 정답이 셋 | `[쪽지(메모 전달), 명단(연락처 목록)]` |
| W2 ★ | w-manage `distractorsEn` [manner, menace] | 둘 다 명사(동사 정답), menace는 '위협' | `[mandate, massage]` |
| W3 ★ | w-run 헤드워드 `run` · ko `진행 중인` | 카드가 "run = 진행 중인"을 가르침(틀림). 문장은 형용사 `Running count`, 오답 rapid·rough도 형용사 | en `running`, ipa `/ˈrʌnɪŋ/`, chips `[[run, ning]]`, decoyChips `[ran]`, 나머지 그대로. changes에 `{kind: word, id: w-run, fields: [en, ipa]}` (결정 11 — 형용사는 별도 낱말) |
| W4 ★ | w-pair `pair` · ko `짝(쌍)` | 유일한 문장 20.1 "each pair of hands"는 '일손(사람)'. 카드 뜻이 틀림 | en `pair of hands`, ipa `/ˌpɛr əv ˈhændz/`, ko `일손(한 사람)`, chips `[[pair], [of], [hands]]`, distractorsEn `[pair of gloves, pair of scissors]`, distractorsKo `[장갑 한 켤레, 가위 한 자루]`, decoyChips `[pail, hens]`, cue `위기 때 일할 수 있는 사람 하나하나를 손으로 세어 부르는 말`, exKo = KO8의 새 ko. changes `fields: [en, ipa, ko]` |
| W5 | distractorsEn 품사 — §7 표의 8단어 | 오답 하나가 품사가 다름 | 표의 대안 칸대로 |
| W6 | w-each `distractorsKo` 모든 | 14.0 each ↔ 14.3 every를 같은 뜻으로 쓰는 주제라 '모든'이 정답 근처 | `[몇몇의, 어떤]` |
| W7 | w-dic `distractorsKo` 심부정맥혈전증(DVT) | 오답에만 영어 약어 — 듣고 고를 때 'DIC ≠ DVT'로 바로 걸러짐 | `심부정맥혈전증` (길이 10:7, 3자 이내) |
| W8 (약) | w-instrument `distractorsKo` 장비 | instrument를 '기기·장비'로도 옮겨 정답 근처 | `봉합사` |
| W9 [사실] | w-up cue "…**수술대** 위에서…" | 기구는 수술대(환자)가 아니라 백 테이블·메이요대 위. 또 ko "세팅이 끝난"을 cue가 그대로 되풀이 | `스크럽이 백 테이블에 기구를 다 펼쳐 놓아 집도의가 바로 쓸 수 있게 된 상태` |
| W10 [사실] | w-platelet cue "작은 혈액 **세포**를 모은 제제" | 혈소판은 세포 조각(pair 18.n0 why도 '세포 조각') | `피가 엉기도록 돕는 작은 세포 조각을 모은 혈액 제제` |
| W11 [사실] | w-resuscitate cue "멎어 가는 숨과 맥박을 되돌리려…" | 유일한 문장 19.1은 손상통제 뒤 ICU에서의 소생 치료(체온·응고·산증·혈액량 교정) — 심폐소생이 아님 | `손상통제 뒤 중환자실에서 체온·응고·혈액량을 바로잡아 환자를 되살려 놓는 일의 동사` |
| W12 | cue — ko 되풀이·사전 풀이 | w-start·w-check·w-apply·w-next·w-rate·w-baseline(ko 되풀이), w-tell·w-need·w-heart·w-blood·w-change·w-drop·w-protect·w-every·w-each·w-else·w-whole·w-role(사전 풀이) | 그 말을 **이 주제에서 언제·누구에게** 쓰는지로. 예) w-start `맥박이 없을 때 흉부압박에, 아기가 숨을 안 쉴 때 소생술에 막 들어가며 하는 말` · w-check `쿨러 속 혈액 팩을 다시 들여다보며 이상이 없는지 볼 때` · w-apply `마취과가 "지금"이라고 하면 윤상연골에 손가락 힘을 주기 시작할 때` · w-next `지금 쓰는 쿨러가 비면 곧바로 이어 쓸 쿨러를 가리킬 때` · w-rate `태아 모니터의 1분당 박동 숫자를 말할 때 '심박' 뒤에 붙는 말` · w-baseline `칼을 대기 전에 처음 세어 두어 봉합 때 맞춰 볼 숫자` · w-tell `윤상연골 압박을 언제 풀지 마취과에게 알려 달라고 부탁할 때` · w-protect `급한 집도의가 기구대 너머로 손을 뻗을 때 지켜야 하는 것을 말하는 동사` · w-each `검체가 나올 때마다 한 개씩 따로 라벨을 붙인다고 할 때` · w-role `다중 위기에서 누가 기도, 누가 혈액을 맡을지 나눌 때의 몫` |
| W13 | decoyChips 불쾌 조각 | w-platelet `lit`(취함 속어), w-quick·w-quickly `quack`(돌팔이 의사), w-staff `stiff`(시신 속어) | w-platelet `lit`→`lot`, w-quick·w-quickly `quack`→`quirk`, w-staff `stiff`→`staph` |
| W14 (권장) | w-crash `crash` · ko `응급(카트)` + w-cart | `crash cart` 한 구를 두 카드로 쪼갬. crash의 ko '응급'은 crash의 뜻이 아니고 w-emergency `응급(상황)`과 ko가 겹침 | w-crash 헤드워드 `crash cart`, ipa `/ˈkræʃ kɑːrt/`, ko `응급 카트`, chips `[[crash], [cart]]`, distractorsEn `[code blue, supply cart]`(code cart는 실제 동의어라 쓰지 말 것), distractorsKo `[심정지 호출, 물품 카트]`, decoyChips `[crate, card]`, cue `심정지가 나면 약·제세동기·기도 기구를 싣고 방으로 밀고 오는 수레`. changes `fields: [en, ipa, ko]`. 15.1 words에서 w-cart 빼고 **w-cart word-remove**(15.1에만 쓰임, 상황 15는 서로 다른 단어 10개로 V3 충족) |
| W15 (약) | w-bleed `bleed` · ko `피가 나다` | 두 문장 모두 명사·형용사 bleeding(11.0 bleeding source, 20.3 the bleeding) — 동사 카드가 명사 문장에 붙음 | en `bleeding`, ipa `/ˈbliːdɪŋ/`, ko `피 흘림(출혈 중)`, chips `[[bleed, ing]]`, distractorsEn `[breeding, bleaching]`, distractorsKo `[지혈(피 멎음), 세척(피 닦음)]`, decoyChips `[bread]` |
| W16 (약) | w-pack ko `압박하다(패킹하다)` | 패킹은 거즈를 '채워 넣는' 일 — '압박'은 9의 cricoid pressure·손 압박과 헷갈림. 문장 ko는 모두 '패킹' | ko `패킹하다(채워 넣다)` |
| W17 | KO 연쇄 exKo | 아래 §5 KO1~KO9로 문장 ko를 고치면 그 문장을 example로 쓰는 단어 exKo도 같은 ko로 | w-sharp·w-record(4.1), w-nicu(7.2), w-uterotonic·w-draw(8.1), w-tone·w-soft·w-oxytocin(8.2), w-stage·w-injury(11.1), w-crash·w-cart·w-epinephrine(15.1), w-resuscitate·w-icu·w-back(19.1), w-assign·w-role·w-pair(20.1), w-set·w-fast(0.0) |

---

## 4. 고칠 것 — 뉘앙스

| # | 문항 | 문제 | 어떻게 |
|---|---|---|---|
| N1 ★ [범위] | 19.n0 slider | 오답 칸 [1]이 KP 19.0 그대로 — 문장 단계와 반대말. [2] "We're done operating"은 강도 축 밖(세 보기가 서로 다른 행동) | cue `The surgeon announces damage control: pack the abdomen, close it temporarily, then go to the ICU. The temporary closure supplies are already open on the back table. What do you tell the room?` / scale `["I think there are closure supplies somewhere", "The temp closure supplies are open and ready", "Every closure supply we own is open now"]` / answerAt 1 / why `손상통제 전환은 집도의가 정하고, 순환간호사는 준비 상태를 있는 그대로 알려요. '어딘가 있을 것'은 찾느라 늦어지고, '있는 걸 다 열었다'는 쓰지 않을 멸균 물품을 버리게 되는 과장이에요.` / example·exKo 그대로(19.2). words 그대로 |
| N2 ★ [사실] | 6.n1 swap `who` "순환간호사 → 집도의 · 랩패드 전달" | 멸균 랩패드를 집도의 손에 건네는 것은 스크럽 | who `스크럽 간호사 → 집도의 · 랩패드 전달` (notes·why 그대로) |
| N3 ★ [사실] | 10.n1 swap `who` "순환간호사 → 스크럽 요원 · 가운 입히기" | 가운·장갑을 입혀 주는(assisted gloving) 것은 이미 멸균 상태인 스크럽, 받는 사람은 집도의 | who `스크럽 간호사 → 집도의 · 가운 입히기` |
| N4 [사실] | 4.n1 swap note(skip)·why | "알 길이 없다"·"건너뛰지 않고" 단정. 응급 생략 시 기록·영상 확인이 실제 절차 | note(I'll skip…) `계수를 건너뛰면 몸 안에 남은 것을 계수로 확인할 수 없어, 병원 정책에 따라 기록하고 영상으로 확인하는 절차에 기대야 한다.` / why `병원 정책이 허락하는 한 응급에서도 시작 계수는 해요. 생략하면 병원 정책에 따라 그 사실을 기록하고 영상으로 확인하는 절차를 밟아요.` |
| N5 | 19.n1 context ok:false `fix` | 문장 19.3은 her, fix는 his(성별 불일치). (권장) "closed his belly"는 손상통제 임시 폐쇄가 대개 배를 덮어 두는 것(진공 드레싱 등)이라 covered가 더 정확 | fix `She's still very sick, so the surgeon covered her belly for now and will go back in later.` / why 둘째 문장 `…가족에게 '패킹 상태로 임시 봉합'이라고 하면 무슨 말인지 몰라 불안해요. 배를 덮어 두고 나중에 다시 들어간다고 쉬운 말로 풀어 줘요.` |
| N6 | 2.n0 slider 오답 [0] "Spares have not been put out yet" | cue "at the wall but not yet connected"로 읽으면 참 — 정답 둘 | `We don't have any spare canisters in here` |
| N7 | 11.n0 slider | 세 보기가 강도 축이 아님(혼자 정함·묻기·동시에) | scale `["I'll just wait until you tell me what to do", "Tell me your priority and I'll set up for it", "I'll set up for the leg first, then the abdomen"]` / answerAt 1 / why `무엇을 먼저 할지는 집도의가 정해요. 손 놓고 기다리면 늦고, 혼자 순서를 정하면 집도의의 순서와 어긋나요. 우선순위를 물어 그에 맞춰 세팅해요.` |
| N8 | 20.n0 slider 순서 | [0] "Somebody needs to…"가 [1] "Maybe someone could possibly…"보다 강한데 앞에 있음 | [0]↔[1] 바꿈(answerAt 2 그대로). K5를 바꾸면 scale[2]·example·exKo도 새 KP로 |
| N9 (약) | 8.n0 slider 순서 | [1] "I'll go ahead and give"(혼자 투여)가 [2] "oxytocin now, please, quickly"(지시)보다 더 역할을 넘음 | [1]↔[2] 바꿈(answerAt 0 그대로). example·exKo는 KO4 새 ko로 |
| N10 ★ | swap 19개 정답 위치 | **19/19 정답이 options[0]**. 앱(`SentSwap.tsx`)은 섞지 않음 → 위치로 맞힘 | 정답을 0·1·2에 고르게(예 6·7·6). `before[1]`은 오답 중 하나로 둔다 |
| N11 ★ | slider 정답 길이 | **15/20 정답이 가장 짧은 보기**(검사기 W20은 '가장 긴 것'만 셈). 특히 13.n0(15 vs 23·19)·3.n0(31 vs 39·40)·9.n0(41 vs 47·52)·12.n0(35 vs 39·41)·4.n0(35 vs 41·38)·20.n0(48 vs 57·50)·2.n0(26 vs 32·31)·11.n0 | 정답에 구체 내용을 더하거나 오답을 줄여 '가장 짧은 정답'을 10/20 아래로. 예) 13.n0 세 보기 앞에 `Fetal heart rate is dropping — `를 모두 붙임 · 3.n0 정답 `Units here, and more can come within minutes` · 2.n0 정답 `Two suctions on, spares standing by` |
| N12 (약) | 17.n0·3.n0 cue | cue가 정답 낱말을 그대로 씀("bag-mask ready and the suction set", "can send more within minutes") | cue를 상황으로: 17.n0 `…The bag-mask is checked at the warmer and suction is on at 80.` |
| N13 | 20.n1 swap `ko` "손 하나하나에 역할을 배정합시다" | each pair of hands = 사람마다 | ko `한 사람 한 사람에게 역할을 정해 줍시다` (KO8과 함께) |
| N14 (조건) | 16.n1·18.n1 swap | K4·K3를 바꾸면 정답이 새 KP가 되고 청자가 혈액은행이 아니게 됨 | 16.n1: who `순환간호사 → 수술팀 · 발동 알림`, answer = 새 KP, 오답 `I'll ask the blood bank if they have a few extra bags.` · `Let's see if she keeps bleeding first.`(notes: 각각 '발동인지 혈액은행이 모름'·'대량 출혈에서 기다리면 늦음'). 18.n1: who `순환간호사 → 집도의·마취과 · 제제 확인`, answer = 새 KP, 오답 `She might want some clotting stuff, I think.` · `I'll just order whatever blood bank has.`(notes: 막연함·처방 없이 주문). 바꾸지 않으면 그대로 |
| N15 (약, 부서 공통) | context 어색한 장면 위치 | 2/2 셋째(형제 OR 주제도 셋째에 몰림) | 8.n1의 ok:false 장면을 첫째로 옮김. 부서 공통으로 앱에서 섞을지 결정 |
| — (보고만) | swap 형태 | 19/19가 `before[0]`·`before[2]`가 빈 **문장 통째 바꾸기**(core-family-or도 같음). 지시서 swap은 '한 단어 바꾸기' | 이 주제만의 결함으로 세지 않음 — 부서 공통 결정 |

---

## 5. 결정 11 — 문장(v44 필드) 고칠 것

### 5-1. 문장 en·ko·chunks (keyPhrase 아님) — 대안 chunks는 전부 이어 붙임·V8 조각 수·V9를 스크립트로 확인

| # | 문장 | 문제 | 고칠 en · ko · chunks · words | 딸린 것 |
|---|---|---|---|---|
| S1 ★ [범위] | 복강 대량 출혈 #3 "Keep the suction going while I pack the quadrants." | 간호사가 패킹(집도의 일), 집도의에게 흡인을 지시 | en `I'll keep the suction going while you pack the quadrants.` / ko `선생님이 각 구역을 패킹하시는 동안 제가 흡인을 계속할게요.` / chunks `["I'll keep", "the suction going", "while you pack", "the quadrants", "."]` / words `[w-keep, w-suction, w-pack, w-quadrant]` | v46 새로. order 6 줄 3은 이미 이 뜻이라 연쇄 없음 |
| S2 [범위] | 제왕 산모 출혈 감시 #3 "I'm drawing up an extra dose just in case." | 처방 없이 여분 약을 주사기에 준비(무슨 약인지도 없음) | en `I'll have an extra uterotonic on hand just in case.` / ko `혹시 몰라서 자궁수축제를 하나 더 가까이 준비해 둘게요.` / chunks `["I'll have", "an extra uterotonic", "on hand", "just in case", "."]` / words `[w-extra, w-uterotonic]` | v46 새로(지금 chunks `just / in case`도 끊김). w-draw는 8.1·15.1에 남음 |
| S3 ★ [범위] | 태아 곤란 신속 분만 #4 "Her heart rate dropped again — let's deliver now." | 분만 결정을 간호사가 선언. `Her`는 산모 심박으로도 읽힘. slider 13.n0은 "We must deliver now"를 오답으로 가르침 | en `The baby's heart rate dropped again — ready to deliver when you are.` / ko `아기 심박수가 또 떨어졌어요 — 언제든 분만하실 수 있게 준비돼 있어요.` / chunks `["The baby's heart rate", "dropped again", "— ready to deliver", "when you are", "."]` / words `[w-heart, w-rate, w-drop, w-ready, w-deliver]` | v46 새로. **order 13 줄 3** "…let's deliver now"도 B가 같은 뜻으로(`…with all of that standing by, we're ready when you are.`) |
| S4 ★ [안전] | 개복 중 심정지 #3 "Compressions are started — someone call the code now." | *call the code*는 소생 중단 선언으로도 읽히는 모호한 말. `someone` 호출은 20.n0 why와 모순. "are started"도 어색 | en `Compressions are going — can you call for the code team now?` / ko `흉부압박 중이에요 — 지금 코드팀을 불러 주시겠어요?` / chunks `["Compressions are going", "— can you call", "for the code team", "now", "?"]` / words `[w-compression, w-call, w-code]` | v46 새로. **order 15 줄 1**도 같은 문장으로. w-start는 15.0에 남음 |
| S5 ★ [범위] | 개복 중 심정지 #4 "I'll draw epinephrine and keep timing the code." | 기록자(15.2 KP)가 투약 준비까지 동시에 — 코드 역할 분담에 어긋남, 약은 마취과 | en `I'll keep timing the code and call out when epinephrine is due.` / ko `코드 시간을 계속 재면서 에피네프린 줄 때가 되면 소리 내어 알릴게요.` / chunks `["I'll keep timing", "the code", "and call out", "when epinephrine is due", "."]` / words `[w-keep, w-timing, w-code, w-epinephrine]` | v46 새로 |
| S6 ★ [범위] | 파종성 응고장애 #4 "She's oozing from everywhere — we need FFP and cryo now." | 제제 요구 = 처방(묶음 4 S2와 같은 경우) | en `Once FFP and cryo are ordered, I'll call blood bank.` / ko `FFP와 크라이오 주문이 들어가면 혈액은행에 전화할게요.` / chunks `["Once FFP and cryo", "are ordered", ", I'll call", "blood bank", "."]` / words `[w-ffp, w-cryo, w-call, w-bloodbank]` | v46 새로. K2·K3를 어떻게 정하든 겹치지 않음. w-ooze·w-everywhere·w-need는 다른 문장에 남음 |
| S7 ★ [범위] | 손상통제 수술 전환 #3 "Let's do a temporary closure and get her to ICU." | 수술 방법·이송을 간호사가 결정 | en `After the temporary closure, I'll call ICU to get her bed ready.` / ko `임시 봉합이 끝나면 중환자실에 연락해 침상을 준비해 달라고 할게요.` / chunks `["After", "the temporary closure", ", I'll call ICU", "to get her bed ready", "."]` / words `[w-temporary, w-closure, w-icu, w-call, w-ready]` | v46 새로. **order 19 줄 2** "…let's get her to ICU after that closure."도 B가(`With those supplies ready, I'll call ICU for her bed after that closure.`) |
| S8 [범위] | 손상통제 수술 전환 #4 "We'll pack now and come back to close later." | 계획 전달로도 읽히나 간호사가 방법을 선언하는 꼴 | en `The plan is to pack now and come back to close later.` / ko `지금은 패킹하고 나중에 다시 와서 봉합하는 계획이에요.` / chunks `["The plan is", "to pack now", "and come back", "to close later", "."]` / words 그대로 `[w-pack, w-back, w-close]` | v46 새로 |
| S9 ★ [범위] | 다중 위기 동시 대응 #3 "I'll manage the airway while you handle the bleeding." | 순환간호사가 기도 관리 — 같은 상황 KP 20.0("You take the airway")과도 모순 | en `I'll manage the blood products while you handle the bleeding.` / ko `선생님이 출혈을 처치하시는 동안 저는 혈액제제를 관리할게요.` / chunks `["I'll manage", "the blood products", "while you handle", "the bleeding", "."]` / words `[w-manage, w-product, w-bleed]` | v46 새로. **w-manage example·exKo = 이 새 문장**(K5를 바꾸면 20.0에서 manage가 빠짐) |
| S10 | chunks 구 경계(비KP) | 3.4 `as units / go in` · 4.4 `before we / close` · 16.3 `for the massive / transfusion` · 20.4 `as the situation / changes` | 3.4 `["Let's keep", "the blood bank", "updated", "as units go in", "."]` · 4.4 `["We'll double check", "the sponge count", "before", "we close", "."]` · 16.3 `["Blood bank", "is sending", "units", "for the massive transfusion", "."]` · 20.4 `["We'll change", "roles", "as the situation changes", "."]` | — |
| S11 (약) | 긴급 팀 소집 #4 ko "이 방에 필요한 **여분의** 인력을 데려올게요." | '여분의 인력'은 남는 사람으로 들림 | ko만 `이 방에 필요한 추가 인력을 불러올게요.` | distractorsKo 둘 다시 |
| S12 | 다발성 외상 우선순위 #4 ko "…물품을 **단계별로** 준비해 둘게요." | w-stage ko를 '순서대로 미리 놓다'로 고치고 문장은 옛 뜻 | ko만 `두 우선순위 모두에 쓸 물품을 미리 꺼내 놓아 둘게요.` | distractorsKo 둘 다시 (KO5와 함께) |

### 5-2. keyPhrase 문장의 ko만 (결정 11 허용 범위 — en·chunks 그대로, changes에 `fields: [ko]`)

| # | 문장(KP) | 문제 | 새 ko | 딸린 것 |
|---|---|---|---|---|
| KO1 ★ | 신속 초기 계수 #1 "Sponges and sharps are counted and recorded." | ko에 영어 `sharp` | `거즈와 날카로운 기구를 세었고 기록했어요.` | distractorsKo 둘 다시, w-sharp·w-record exKo, order 4 줄 1 ko |
| KO2 ★ | 응급 제왕 신생아 준비 #2 "Is the NICU team in the room yet?" | "아직 … 왔나요?" 비문 | `NICU팀은 방에 와 있나요?` | distractorsKo 둘 다시, w-nicu exKo |
| KO3 | 제왕 산모 출혈 감시 #1 "Uterotonics are drawn up and ready if we need them." | en은 주어 없는 상태 보고인데 ko가 "뽑아 준비해 뒀어요"(내가 뽑음) | `자궁수축제가 주사기에 뽑혀 있어 필요하면 바로 쓸 수 있어요.` | distractorsKo 둘 다시, w-uterotonic·w-draw exKo, order 8 줄 1 ko |
| KO4 | 제왕 산모 출혈 감시 #2 "Her tone is soft — do you want oxytocin now?" | "긴장도가 부드러운데", "원하세요" 번역투 | `자궁 긴장도가 약해요 — 지금 옥시토신 쓰실까요?` | distractorsKo 둘 다시, w-tone·w-soft·w-oxytocin exKo, slider 8.n0 exKo, order 8 줄 2 ko |
| KO5 ★ | 다발성 외상 우선순위 #1 "I'll have supplies staged for both injuries." | '단계별로' — staged의 뜻이 아니고 w-stage 카드와 어긋남 | `두 부상 모두에 쓸 물품을 미리 꺼내 놓을게요.` | distractorsKo 둘 다시, w-stage·w-injury exKo |
| KO6 | 개복 중 심정지 #1 "Crash cart is here and epinephrine is drawn." | ko가 "뽑아 뒀어요"로 행위자를 더함 | `응급 카트가 왔고 에피네프린도 주사기에 뽑혀 있어요.` | distractorsKo 둘 다시, w-crash·w-cart·w-epinephrine exKo, order 15 줄 2 ko |
| KO7 | 손상통제 수술 전환 #1 "We'll resuscitate in ICU and come back." | "소생시키고 … 돌아올게요"는 간호사 1인칭·심폐소생으로 읽힘 | `중환자실에서 소생 치료를 한 뒤 다시 수술방으로 돌아올 거예요.` | distractorsKo 둘 다시, w-resuscitate·w-icu·w-back exKo, order 19 줄 3 ko |
| KO8 ★ | 다중 위기 동시 대응 #1 "Let's assign a role to each pair of hands." | "손 하나하나에" 직역 — pair of hands는 일손(사람) | `한 사람 한 사람에게 역할을 정해 줍시다.` | distractorsKo 둘 다시, w-assign·w-role·w-pair exKo, swap 20.n1 ko(N13), order 20 줄 0 ko |
| KO9 (약) | 응급 세팅 신속 준비 #0 "Let's get the room set up as fast as we can." | "우리가 할 수 있는 한" 번역투 | `최대한 빨리 방을 세팅합시다.` | distractorsKo 둘 다시, w-set·w-fast exKo |

### 5-3. 변경 목록(`changes-or-emergency-open.yaml`, 91건) 판정
word-remove 18건(공통 목록 7 + 목록 밖 10 + over를 take over로 합침)·헤드워드 6건(sharps·on the way·take over·come back·stand by·say the word)·ko 17건·sentence words 50건 모두 타당. 20.0에서 w-take(You **take** the airway ≠ take over), 9.2·17.0에서 w-on, 12.2·15.2에서 w-call(call out)을 뺀 것도 맞음. 놓친 것만 위(W3·W4·W14·W15·KO5·S12).

---

## 6. 저작자 메모 판정

| 메모 | 판정 |
|---|---|
| 손상통제 0·1·3·4 | 0(KP) → K1 바꾸기 권고 · 1(KP) 유지(팀 계획 전달, ko만 KO7) · 3 고침 S7 · 4 고침 S8(약) |
| 태아 곤란 4 let's deliver now | 고침 S3 |
| DIC 0 this is DIC · 1 I need FFP… | 둘 다 KP → K2·K3. 비KP 18.4는 S6 |
| 산모 대량 출혈 0 MTP 개시 | KP → K4(바꾸기 약하게) |
| drawing up an extra dose(8.3) | 고침 S2 |
| epinephrine is drawn(15.1 KP) | en 유지(주어 없는 상태), ko만 KO6 |
| I'll draw epinephrine(15.4) | 고침 S5 — 약보다 '기록자가 투약까지 겸함'이 더 큰 문제 |
| Uterotonics are in(16.1 KP) | 유지 — 누가 투여했는지 말하지 않는 상태 보고(묶음 4 "Pressors are going in"과 같은 꼴) |
| Uterotonics are drawn up(8.1 KP) | en 유지, ko만 KO3 |
| Her tone is soft(8.2 KP·8.4) | 유지 — 8.n0 cue처럼 집도의가 촉진한 소견을 받아 되말하고 묻는 말. 8.4 "Let's keep watching her tone"은 팀 제안 |
| 다중 위기 3 I'll manage the airway | 고침 S9 |
| 다중 위기 0 manage the transfusion | KP → K5(바꾸기 약하게) |
| 신속 초기 계수 1 ko sharp | 고침 KO1 |
| 윤상연골 압박 9.0·9.1·9.4 | **유지** — 마취과 요청에 따라 보조자가 대고 푸는 일이라 범위 안. 9.n0 why는 효과를 단정하지 않고 "마음대로 시작·끝까지 누르면 시야가 나빠질 수 있다"만 말해 사실에 맞음. 일상적 사용 논쟁은 문장이 다루지 않으므로 고칠 것 없음 |
| 혈액 확보 1 within minutes | KP → K6(바꾸기 약하게) |
| B 메모(오답 ko가 소견·장비를 바꿈 등) | B 검토 몫 |

---

## 7. 표 — distractorsEn 품사가 다른 것, 정답의 다른 뜻을 쓴 오답

★ = 오답 둘 다 품사가 다르거나 정답의 다른 뜻. 나머지는 권장(W5).

| 단어(품사) | 지금 오답 | 문제 | 대안 |
|---|---|---|---|
| ★ manage(동) | manner·menace(명) | 둘 다 명사 | mandate·massage |
| ★ line(명, 연락 경로) | dKo 차례(대기 줄)·선(경계선) | 둘 다 line의 다른 뜻 | 쪽지(메모 전달)·명단(연락처 목록) |
| ★ run(헤드워드 동사, 문장은 형용사) | rapid·rough(형) | 헤드워드와 오답 품사가 다름 → 헤드워드를 running으로(W3) | 그대로 |
| keep(동) | keen(형) | 하나 | seek·reap |
| circulator(명) | circular(형) | 하나 | calculator·coordinator |
| blood(명) | blond(형) | 하나 | flood·brood |
| track(동) | truck(명) | 하나 | trick·trim (trace는 '추적하다'라 정답 둘) |
| massive(형) | missive(명) | 하나 | passive·impressive |
| cryo(명) | cry(동) | 하나 | crop·crypt |
| whole(형) | widely(부) | 하나 | wild·hollow |
| change(동) | chance(명) | 하나 | charge·chafe |
| call(동) | calm(형·동) | 동사로도 쓰여 허용 | 그대로 |
| each(한정사) | dKo 모든 | 이 주제가 each·every를 같은 뜻으로 씀 | 몇몇의·어떤(W6) |

---

## 8. 기계적 전수 확인 결과

- **pair(1개, 18.n0)** — 왼쪽 3 × (오른쪽 3 + decoy 1) = 12조합 전부 출력. `FFP fresh frozen plasma`·`platelets tiny cell fragments`·`cryo cryoprecipitate`만 성립. cryo는 FFP로 만들지만 "cryo = fresh frozen plasma"는 아님. decoy `packed red cells`는 어느 왼쪽에도 안 붙음. **정답 하나.**
- **swap(19개)** — 19개 모두 `before[0]`·`before[2]`가 빈 문자열이라 이어 붙인 문장 = 선택지 문장 그대로, 문법 문제 없음. swap `ko` 19개는 정답 문장의 뜻과 맞음 — 20.n1만 직역(N13). 7.n1 ko는 yet 뉘앙스가 빠졌으나 뜻은 맞음.
- **context(2개)** — 8.n1 `hemorrhage`·19.n1 `closure` 모두 세 장면 en에 낱말이 있고, 어색한 장면이 듣는 사람(깨어 있는 산모·가족)에게 안 맞는 자리라 핸드오프 모양에 맞음. word·ko 짝 맞음. 19.n1 fix만 N5.
- **slider(20개) 약함→강함** — 0·1·2·3·4·5·6·7·10·12·13·14·15·16·17은 '덜 말함 → 정확 → 과장' 축으로 성립. 8.n0·20.n0은 가운데·처음 칸 순서가 뒤바뀜(N8·N9), 11.n0·19.n0은 축 없음(N1·N7), 9.n0은 '누르는 시간' 축으로 약하게 성립. cue로 정답이 둘인 것은 2.n0(N6).
- **정답 칸 분포** — slider `answerAt` 0:5 · 1:6 · 2:9(쏠림 없음), 그러나 **정답이 가장 짧은 보기 15/20**(N11). swap 정답 **options[0] 19/19**(N10). context 어색한 장면 **셋째 2/2**(N15).
- **chunks(105문장)** — 비KP 끊김은 S10 + S1~S9 문장 안(6.3 `while I / pack`, 8.3 `just / in case`, 15.3 `someone call / the code`, 18.4 등은 새 문장으로 해소). KP는 §9 끝 목록.
- **decoyChips × chips** — 1~2조각 모든 순열을 비속어·성적·술·장례·폭력·무기·민족 비하 목록과 대조. 걸린 것은 W13 셋(lit·quack·stiff)뿐. `grape`(drape)·`sore`(pressure)·`rag`(hemorrhage)·`men`(abdomen·specimen·manage)·`lie`·`sin`은 일상어라 둠. 다른 경로로 정답을 만드는 조합 0.
- **distractorsEn 품사** — §7 표.
- **문장을 고친 뒤 V3·고아 단어** — S1~S9·W14를 반영해도 상황마다 서로 다른 단어 8개 이상(최소 상황 15·19가 10개), 어느 문장도 태그하지 않게 되는 단어는 w-cart(W14에서 word-remove)뿐.

---

## 9. 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)

KP en을 바꾸기로 하면 `in-or-emergency-open.json`의 `keyPhrases` 같은 문자열도 함께 바꿔야 V4가 통과합니다. 바꾸면 그 문장의 chunks·ko·v46 필드, 그 문장을 example로 쓰는 단어의 example·exKo, 뉘앙스 options·scale·example, order 줄이 함께 바뀝니다(항목마다 적음). 상황 21건의 대화 상대(persona)는 모두 `colleague` — tagline의 화자는 9가 마취과, 13·16·19가 집도의, 18·20은 불분명. 아래 대안은 모두 상대에게 2인칭이거나 주어 없는 말이라 상대를 3인칭으로 부르지 않습니다. 대안 chunks는 전부 스크립트로 확인.

- **K1 19.0** `Let's pack and do a temporary closure.` · 문제: 손상통제 방법을 간호사가 Let's로 정함. 같은 상황 slider 19.n0이 이 문장을 그대로 오답으로 가르침 · 대안 `Got it — we're packing and doing a temporary closure.`(chunks `Got it / — we're packing / and doing / a temporary closure / .`, words 그대로 `[w-pack, w-temporary, w-closure]`) · **권고: 바꾸기.** 묶음 4 K4는 `Should we…?`였지만, 여기서는 tagline에서 집도의가 이미 "let's pack, close temporarily"라고 선언했으므로 되묻기보다 **복창(closed-loop)**이 맞는 대답이다. 연쇄: w-temporary·w-closure example·exKo, order 19 줄 0(→ 복창문), slider 19.n0은 N1로 이미 교체. **유지한다면** 19.n0에서 이 문장을 오답으로 쓰지 말고(N1), B가 why에 "집도의 선언을 되받는 복창"이라고 쓸 것.
- **K2 18.0** `She's oozing everywhere — this is DIC.` · 문제: 간호사의 진단 단정 · 대안 `She's oozing everywhere — are we treating this as DIC?`(chunks `She's oozing / everywhere / — are we treating / this as DIC / ?`, words 그대로) · **권고: 바꾸기(약하게)** — tagline에서 동료가 먼저 "looks like DIC"라 했으니 지금 문장은 동의로도 읽힘. 연쇄: w-ooze·w-everywhere·w-dic example·exKo, order 18 줄 0. **유지한다면** why에 "의사가 말한 DIC를 받아 확인하는 말".
- **K3 18.1** `I need FFP, platelets, and cryo now.` · 문제: 제제 요구 = 처방. swap 18.n1은 청자를 혈액은행으로 잡았지만 **order 18은 방 안에서 이 말을 한 뒤 "I'll call blood bank…"로 이어** 처방 요구로 읽힌다 · 대안 `Do you want FFP, platelets, and cryo now?`(chunks `Do you want / FFP / , platelets / , and cryo now / ?`, words `[w-ffp, w-platelet, w-cryo]`) · **권고: 바꾸기** — 묶음 4 K3(`…do you want FFP and platelets now?`)와 같은 꼴. 연쇄: w-ffp·w-platelet·w-cryo example·exKo, swap 18.n1(N14), order 18 줄 1. S6은 어느 쪽이든 겹치지 않음. **유지한다면** B가 tag·why에 "처방이 난 뒤 혈액은행에 전화로"를 쓰고 order 18 줄 1을 통화 장면으로.
- **K4 16.0** `Activating the OB massive transfusion protocol.` · 문제: 발동 결정은 집도의·마취과, 간호사는 혈액은행에 알리는 쪽 · 대안 `Calling the blood bank to activate the OB massive transfusion protocol.`(chunks `Calling / the blood bank / to activate / the OB massive transfusion protocol / .`, words `[w-activate, w-ob, w-massive, w-transfusion, w-protocol]` + `w-call`·`w-bloodbank`) · **권고: 바꾸기(약하게)** — tagline에서 동료가 "activate…"라고 지시했으니 지금 문장도 복창으로 읽히지만, 묶음 4 K1 확정 꼴과 맞춤. 연쇄: 다섯 단어 example·exKo, swap 16.n1(N14), order 16 줄 0. **유지한다면** swap 16.n1의 why처럼 "결정은 집도의·마취과, 순환간호사는 은행에 전한다"를 문장 why에도.
- **K5 20.0** `You take the airway, I'll manage the transfusion.` · 문제: 수혈(투여)은 마취과, 순환간호사는 혈액 조율 · 대안 `You take the airway, I'll coordinate the transfusion.`(chunks `You take / the airway / , I'll coordinate / the transfusion / .`, words `[w-airway, w-transfusion]`) · **권고: 바꾸기(약하게)** — slider 20.n0 why가 이미 "순환간호사는 혈액 상황 조율"이라고 함. 연쇄: w-airway example·exKo(그대로 이 문장), w-manage example → S9 새 문장, slider 20.n0 scale[2]·example·exKo, order 20 줄 1. **유지한다면** why에 "manage = 혈액은행 연락·제제 확인·쿨러 관리".
- **K6 3.1** `Blood bank can send more within minutes.` · 문제: '몇 분 안'은 병원·제제마다 달라 간호사가 보장할 수 없음 · 대안 `Blood bank says they can send more within minutes.`(chunks `Blood bank says / they can send / more / within minutes / .`) · **권고: 바꾸기(약하게)** — slider 3.n0 cue가 이미 "the blood bank says…"로 출처를 밝힘. 연쇄: w-bloodbank·w-send example·exKo, order 3 줄 1, slider 3.n0 scale[1]은 그대로 둬도 됨.
- **유지 권고:** 19.1(팀 계획 전달 — ko만 KO7), 16.1 "Uterotonics are in…"(상태 보고), 8.1·15.1(수동 상태 — ko만 KO3·KO6), 8.2(소견 복창+질문 — ko만 KO4), 9.0·9.1·9.4 윤상연골 압박(마취과 지시에 따른 보조), 11.0 "The biggest bleeding source comes first."(ATLS 원칙을 상기하는 말 — B가 why에 "결정은 집도의"), 6.0·6.1(상황 6은 스크럽 일과 순환 일(6.2 혈액 요청)이 섞여 있음 — who 표기로 정리, N2), 15.0 compressions·17.0 신생아 소생 시작(BLS·NRP 초기 단계는 간호사 범위).
- **KP chunks 구 경계(보고만 — 대안은 V8 조각 수를 지킴)**
  - 2.2 `and I'll swap / them out` → `Say the word / and I'll / swap them out / fast / .`
  - 5.2 `is on / the way`(헤드워드 on the way를 끊음) → `Anesthesia backup / is / on the way / .`
  - 7.1 `Neonatal / resuscitation supplies` → `Neonatal resuscitation supplies / are / set up / .`
  - 9.1 `and when / to release` → `Tell me / when to apply / and / when to release / .`
  - 10.0 `the sterile / field` → `Even in a rush / , we / protect / the sterile field / .`
  - 10.2 `I'll guide / you in` → `Watch your hands / — I'll / guide you in / .`
  - 15.2 `and call / it out` → `I'll run / the code timing / and / call it out / .`
  - 20.1 `to each pair / of hands`(W4 헤드워드를 끊음) → `Let's assign / a role / to / each pair of hands / .`
  - (약) 16.0 `the OB massive / transfusion protocol` → `Activating / the OB / massive transfusion protocol / .`

---

## 10. 종합

현장 흐름(세팅·계수·혈액·코드 기록)의 바탕 사실은 탄탄하고 pair·context·swap 문법도 맞다. 다만 **"call the code"(심정지 첫 순간에 '중단 선언'으로 읽힘)**, 간호사가 결정·시술하는 비KP 문장 8개, KP를 오답으로 가르치는 slider 19.n0, 멸균 역할을 순환간호사에게 준 swap 둘, 위치로 맞힐 수 있는 swap(19/19 첫째)·slider(정답이 가장 짧음 15/20)를 고쳐야 한다. ★ 항목과 [안전]·[범위]·[사실]을 반영하면 내보내도 됨. KP 6건(K1~K6)은 사용자 결정 — K1·K3는 같은 상황의 뉘앙스·order와 모순이 있어 바꾸기를 권함.

**개수:** 고칠 것 53건 = 단어 17(W1~W17) · 뉘앙스 15(N1~N15, N14는 K3·K4에 따른 조건부) · 문장 12(S1~S12) · KP ko 9(KO1~KO9) (W17·N13·S12 세 건은 KO 항목의 연쇄) — 그중 ★ 20건, 안전·범위·사실 16건([안전] S4 · [범위] S1~S3·S5~S9·N1 9건 · [사실] N2~N4·W9~W11 6건). KP 사용자 결정 6건.
