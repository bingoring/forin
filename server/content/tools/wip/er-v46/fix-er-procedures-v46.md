# er-procedures — v46 보강 검토 (er)

대상: `er-procedures.yaml` (상황 21 · 문장 126 · order 21장 · 뉘앙스 swap 17 · context 19). 문장 126개·order 21장 전수.
상황 번호는 파일 순서 0부터(S0 = 채혈 전 환자 확인 … S20 = 대량수혈 프로토콜), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

기계로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 504줄, decoy를 청크 자리마다 넣은 조립 441줄, order 인접 교환 63가지,
context `word`가 세 장면에 실제로 나오는지, swap `ko` 17건(정답 선택지를 넣은 문장과 대조), 시간 단위·`almost`류 선택지 반복,
문장·order 줄의 `check` 아이콘 위치, decoy·`distractorsKo` 중복.

판정 기준: 빈칸·조립 낱장 머리에는 그 문장의 `ko`가 보인다(`mobile/src/data/sentenceDrill.ts:178` `sheetKo`).
그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 문법은 맞고 장면상 그럴듯해도 `ko`가 걸러 주는 decoy·오답은 괜찮은 것으로 봤다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 3 | 대부분 사실이고 말투의 이유를 짚는다. 저작자가 확신이 약하다던 임상 설명 6건은 모두 맞다. 틀린 것: 9.4(항생제 시험 용량을 일상 절차로 설명), 18.2·18.0(ISMP 독립 이중 확인과 어긋남). 말투의 이유 대신 뜻만 풀거나 `ko`를 되풀이하는 것: 2.4·6.3·9.4는 고칠 것에 넣었고, 7.5·16.4·19.5·12.0은 낮아서 넣지 않았다. 한국어가 깨진 것: 11.4. |
| 2 | 빈칸 | 3 | `ko`로 걸러지지 않아 정답이 둘인 것: 5.0 `afraid`, 8.1 `because`. 문법으로 걸러지는 오답: 16.0(셋 다 `… to the contrast`에서 틀림), 17.3 `both way`, 20.2 `has any more`, 13.3 `last year`, 6.1 `never`, 9.2·10.2 `never/barely`. 장면과 동떨어진 오답: 7.3 pets/plans/hobbies, 10.1 hair loss/bad breath, 2.2 Drink, 5.4 photo/bath, 7.0 listened, 0.4 hide·staple. 같은 오답 묶음이 되풀이됨: 시간 단위 10문장, `almost`/`closely` ↔ `barely/hardly/never/rarely` 5문장. |
| 3 | `decoy` | 4 | 441줄 대부분은 비문이거나 `ko`와 어긋난다. `ko`에도 맞는 다른 문장이 되는 것: 6.2 `a loud`(ko에 "big"이 없음), 1.1 `after just`("잠깐"이 "잠시 뒤"로도 읽힘). 경계선: 14.0 `head tilted to`. 중복 `a few hours`(0.5·5.0), `after we`(4.2·5.5)는 사소한 문제. |
| 4 | `distractorsKo` | 2 | 저작자의 기본 방식이 "정답 문장을 거꾸로 뒤집은 말"이다. 그래서 (a) **아무도 하지 않을 말**(`라벨은 바뀌어도 괜찮아요`, `감염되지 않도록 소독은 생략할게요`, `활력징후는 보고하지 않을게요` 등 약 30개)은 듣지 않고도 걸러지고, (b) 낱말 하나만 뒤집은 **반만 다른 말**(2.1·8.1·10.2·10.3·13.5·14.1·17.1·18.4·19.4 등)은 들을 때 정답이 둘이 된다. 같은 상황에서 실제로 할 법한 다른 말은 절반 정도뿐이다. |
| 5 | `order` | 3 | 앞 줄을 가리키는 말로 묶은 설계는 14장에서 잘 됐다. 인접 교환이 자연스러운 것은 7장(S1 1↔2, S4 3↔4, S9 3↔4, S11 3↔4, S16 3↔4, S17 3↔4, S20 3↔4). 이 카드들의 `why`에 있는 "순서가 하나예요"도 사실이 아니다. 임상 순서·사실이 틀린 것은 5장(S7 `If not` 조건, S9 시험 용량, S10 "처음 15분 동안만" 증상 보고, S14 방포가 마취 뒤에 나옴, S19 RN이 흉관을 넣음). 영어 문제: S3 L3 `So … so`, S4 L3 `Once you have them`, S17 L3 시제. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 상황 안에서 일관된다. 아이콘이 어긋나는 것은 사소하다: 7.3 `siren`(알레르기 질문), 19.4 `chartup`(안심), 11.4 `handshake2`(다른 `공감`은 `faceWorried`). `check`·`cross`는 결과 표시와 헷갈리지 않는다(아래 자기 보고 4). |
| 7 | context `word`·`ko`, swap `ko` | 3 | swap `ko` 17건은 전부 정답 선택지를 넣은 문장의 뜻이다. context에서는 `word`가 **세 장면 어디에도 없는** 것이 7개다(S2 `sample`, S4 `test`, S9 `allergic`, S11 `tube`, S12 `okay`, S17 `bone`, S20 `vitals`). 화면 제목이 "`sample`이 어색한 장면은?"이 되는데 장면은 모두 `specimen`이다. S1 `start`의 `ko` "시작하다"는 `start an IV`의 뜻이 아니다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8) — 확인. (2) 동떨어진 오답 약 7문장, 문법으로 걸러지는 오답 7문장. (3) order: 위 5. (4) 임상 순서·사실: order 5장, why 3건. 침상 번호 식별자(0.0·10.0·13.0의 `room/bed number`)는 바르게 **오답** 쪽에 있다. (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **항생제 "시험 용량" (9.4 why, S9 order L2·why)** — 미국 ED에서 첫 항생제는 **정량으로** 주고 첫 투여 동안 가까이 지켜본다. 시험 용량(graded challenge)은
   알레르기 **병력이 있는** 환자에게 프로토콜과 처방에 따라 하는 것이다. order L2 `If not, I'll start with a small test dose of this antibiotic.`는
   "알레르기가 **없으면** 시험 용량"이라 거꾸로이고, 9.4 why는 시험 용량을 일상 절차처럼 설명한다. 간호사가 처방 없이 용량을 나눈다고
   배울 수 있다. 9.4 문장 자체는 base(결정 11 보고). v46에서 고칠 것: order L2와 why, 9.4 why(아래).
2. **독립 이중 확인 (18.0·18.2 why, S18 order)** — ISMP의 독립 이중 확인은 두 번째 사람이 **답을 미리 듣지 않고 각자 따로** 계산·확인하는 것이다.
   18.2 why는 "계산한 값을 먼저 말하고 … 독립적으로 한 번 더 계산하는 것이 오류를 막아요"라고 해서 앞뒤가 맞지 않는다(값을 먼저 말하면 독립이 아니다).
   18.0 why "둘이 함께 맞춰 보자"도 파일럿 4번과 어긋난다. 18.2 문장과 S18 L1은 base·v46 모두 "값을 먼저 말하는" 모양이다 → why로 바로잡고 문장은 결정 11 보고.
3. **S7 order (조영제 사전 확인)** — L2 `If not, do you have any kidney problems or take metformin?`은 "전에 반응이 없었으면 신장·메트포르민을 묻는다"로
   읽힌다. 신장 기능·메트포르민 확인은 **모든** 조영제 환자에게 한다. L3 `Whatever your answers, the dye may feel warm`은 반응 병력이 있어도 "따뜻할 뿐"으로 넘어가는
   흐름이 된다. why도 "아니라면 신장 문제와 약을 묻고, 어느 쪽이든"이라 같은 오해를 준다.
4. **S10 order L3 `During that time, tell me if you feel chills…`** — "처음 15분 동안만" 알리라는 말이 된다. 수혈 반응은 수혈 내내, 끝난 뒤에도 생길 수 있다.
5. **S19 order L1 `I'm placing the chest tube now`** — 흉관은 의사·APP가 넣는다. 간호사가 자기가 넣는다고 말하는 대사는 역할이 틀렸다.
6. **5.5 `We won't stop until we find a good vein.` (base) + why "끝까지 포기하지 않겠다는 약속"** — INS 표준은 한 사람이 2번 정도 시도하고 안 되면 넘기며,
   전체 시도 횟수도 제한한다. 같은 상황 5.2·order L3(동료에게 넘김)와도 어긋난다. 문장은 결정 11 보고, why는 고칠 것.
7. **5.0 빈칸 `afraid`** — `I'm afraid this is taking a few tries.`는 자연스러운 사과 표현이라 `ko` "죄송해요"에도 맞는다. 정답이 둘이다.
8. **8.1 빈칸 `because`** — `…touch the area because it's prepped`도 같은 요청이 된다("소독했으니 만지지 마세요"). 정답이 둘이다.

## 저작자 자기 보고 4건 판정

1. **시간 단위·`almost` 선택지 반복** — 맞는 지적이고 범위가 더 넓다. 시간 단위 오답 묶음이 **10문장**이다(0.5 1.1 3.5 8.4 9.5 13.3 15.1 15.3 15.5 20.5).
   그중 3.5와 15.5는 묶음이 **똑같고**(`minute/month/year/week`), 1.1·8.4도 `month/year/week`가 같다. `ko`가 "몇 초·잠깐·금방"이라 한 번 보면 답이 나온다.
   `almost`/`closely` ↔ `barely/hardly/never/rarely`는 **5문장**(1.5 11.5 19.4 · 9.2 10.2)이다. 정답이 둘인 문제는 아니고 예측 가능성의 문제다. 다만 9.2 `watching you never`,
   10.2 `very barely/very never`는 문법으로도 걸러진다. → 시간 단위 4문장(1.1 3.5 8.4 15.5)과 `almost` 2문장(11.5 19.4)은 빈칸을 가르치는 말로 옮기고(파일럿 2c),
   9.2·10.2는 오답만 바꾼다(아래 목록).
2. **확신이 약한 임상 `why` 6건** — **모두 맞다.** 16.1 에피네프린이 아나필락시스의 1차 약이고 기도 부종·혈압 저하에 쓴다는 것은 맞다(성인 IM 0.5 mg, context도 바름).
   10.2의 수혈 시작 직후 15분 집중 관찰은 맞다(중증 반응은 대개 초반에 생기고, 15분에 활력징후를 잰다). 19.0·19.2의 흉관(폐 주위 공기·액체를 빼 재팽창, 마취 뒤에도 압박감 남음)도 맞다.
   17.0의 IO(정맥 확보 실패 시 골수강으로 약·수액)도 맞다. 20.1의 1:1:1은 "쓰기도 해요"로 단정을 피했으니 맞다(PROPPR 근거의 균형 비율).
   12.1의 도뇨관 무균 술기(CDC CAUTI 지침)도 맞다. 틀린 임상 설명은 저작자가 꼽지 않은 **9.4 시험 용량**과 **18.0·18.2 독립 이중 확인**이다.
   덧붙여 고칠 것(사소): 10.1 "등 통증은 흔한 신호" → 등·옆구리 통증은 급성 용혈 반응의 신호(흔하지는 않음). 15.2는 "새 수액 세트로"를 덧붙이면 더 정확하다.
3. **order 인접 교환·빈칸 네 줄 점검을 스크립트로 하지 않음** — 이번 검토에서 스크립트로 전부 돌렸다(빈칸 504줄, 인접 교환 63가지, decoy 441줄).
   인접 교환이 자연스러운 카드는 7장, 빈칸 문제는 아래 목록에 있다.
4. **문장·order 줄의 `check` 아이콘** — **결과 ✓와 헷갈리지 않는다.** `mobile/src/components/lesson/SentPrompt.tsx`에서 문장 아이콘은 낱장 머리의 앰버 원
   (`SheetIconCircle`, 57행)에 답하기 전부터 그려진다. 결과 ✓는 A–D 고리 안의 초록 11~12px `check`(112·208행)와 도장이다. order 줄 아이콘은 줄 글 옆 17px(249행)이고,
   order 결과는 고리 안의 **숫자 색**으로만 나오며 ✓를 쓰지 않는다. 색·크기·자리가 모두 다르고, T8이 금지한 것은 빈칸 **선택지** 아이콘뿐이다. 그대로 둬도 된다
   (문장 6: 7.5 8.5 10.0 12.4 13.5 18.0 / order 줄 4: S7 L4, S10 L1, S12 L2, S13 L4). 8.3 `cross`도 같은 이유로 괜찮다.

## 고칠 것 (v46 필드)

### why (11)
- 9.4 · 시험 용량을 일상 절차처럼 설명함 → "test dose는 알레르기 병력이 있을 때 처방에 따라 소량부터 주는 방식이에요. 보통 첫 투여는 정량으로 주고 대신 가까이 지켜봐요."
- 18.2 · "먼저 말하고 … 독립적으로"가 모순됨 → "can you confirm?은 두 번째 확인을 청하는 말이에요. 고위험 약의 독립 이중 확인은 상대가 내 값을 듣기 전에 따로 계산하게 하는 것이 원칙이에요(ISMP)."
- 18.0 · "둘이 함께 맞춰 보자"는 파일럿 4와 어긋남 → "verify … with me는 두 번째 사람의 확인을 청해요. 항목을 약 이름·용량·농도로 나눠 말하면 빠뜨리기 어렵고, 고위험 약은 두 사람이 각자 따로 확인한 뒤 맞춰 봐요."
- 5.5 · "끝까지 포기하지 않겠다는 약속"은 시도 횟수 제한과 어긋남 → "won't stop until …은 환자를 두고 포기하지 않겠다는 뜻이에요. 실제로는 한 사람이 두 번쯤 시도하고 안 되면 능숙한 동료나 초음파 유도로 넘겨요."
- 11.4 · 둘째 문장의 한국어가 깨짐("환자가 가볍게 받아들여지지 않아요") → "먼저 공감한 뒤 정상이라고 말해야 불편을 가볍게 넘긴다는 느낌을 주지 않아요."
- 6.3 · `ko`를 되풀이함 → "보호자에게 '아주 짧다'를 알리는 말이에요. 다만 아이에게 직접 '아프지 않다'고 약속하지는 않아요 — 같은 상황 swap처럼 정직한 말이 신뢰를 지켜요."
- 2.4 · 뜻 풀이뿐 → "step out으로 내가 나가겠다고 먼저 말하면 환자가 혼자 채취해도 된다는 것을 알아요. give you some privacy는 '나가 드릴게요'를 환자 배려로 들리게 해요."
- 0.1 · "'채혈' 같은 용어보다"는 한국어 낱말이라 비교가 성립하지 않음 → "draw는 혈액에 쓰는 일상 동사라 venipuncture 같은 용어보다 환자가 알아듣기 쉬워요."
- 20.0 · `hanging`을 "병원 속어"라 함 → "병원 현장 표현"(표준 간호 용어이지 속어가 아님).
- 4.0 · "환자를 한 팀으로 만들어요" — `us`는 의료진이라 근거가 약함 → "help us find…는 검사가 원인을 찾는 도구라고 말해, 검사가 많아도 이유가 있다는 것을 알려요."
- 9.5 · 조사 오류 "check on you은" → "check on you는".

### 빈칸 (blank)
정답이 둘:
- 5.0 · `afraid`는 자연스러운 사과 표현(정답이 둘) → `afraid` 대신 `surprised` (`glad/proud/surprised/sorry*`).
- 8.1 · `because it's prepped`도 같은 요청 → `because` 대신 `before` (`once*/until/unless/before`; until·before는 둘 다 "소독 전까지만"이라 `ko`와 어긋남).

문법으로 걸러지는 오답:
- 16.0 · `a seizure/stroke/fever to the contrast`는 셋 다 전치사에서 틀림 → 빈칸을 `contrast`로 옮김: `contrast*/blood/antibiotic/morphine`.
- 17.3 · `using both way`, `using no way` 비문 → `another*/the same/the usual/the old`.
- 20.2 · `has any more coolers` 비문, `zero more` 어색함 → `two*/no/three/ten` (`ko` "두 개"가 거름).
- 13.3 · `gets … last year` 시제 비문 → `right now*/next week/tomorrow/later`.
- 6.1 · `count to three never` 비문 → `together*/alone/later/slowly`.
- 9.2 · `watching you never` 비문 → `closely*/briefly/occasionally/loosely`.
- 10.2 · `very barely/very never` 비문 → `closely*/briefly/rarely/loosely`.

장면과 동떨어진 오답:
- 7.3 · pets/plans/hobbies → `allergies*/surgeries/symptoms/implants`.
- 10.1 · hair loss/hearing loss/bad breath → `back pain*/knee pain/tooth pain/ear pain` (`ko` "등 통증"이 거름).
- 2.2 · `Drink the sample` → `Leave*/Throw/Pour/Flush`.
- 5.4 · photo/bath → `break*/test/look/walk`.
- 7.0 · `listened to contrast dye` → `reacted*/objected/agreed/consented` (`consented to contrast`는 같은 분야에서 틀린 말).
- 0.4 · `hide/staple this with your chart` → `compare*/replace/file/attach` (같은 분야, `ko` "대조"가 거름).

되풀이를 줄이려 빈칸을 옮기는 것(자기 보고 1, 파일럿 2c; 새 answer는 모두 `en`에 낱말 경계로 한 번만 나옴):
- 1.1 · 시간 단위 → answer `pinch`: `pinch*/itch/ache/cramp`.
- 3.5 · 15.5와 같은 묶음 → answer `results`: `results*/bill/room/discharge`.
- 8.4 · 시간 단위 → answer `still`: `still*/tight/up/back` (`hold tight`·`hold up`은 `ko` "가만히"와 어긋남).
- 15.5 · 시간 단위 → answer `doctor`: `doctor*/pharmacist/chaplain/transporter`.
- 11.5 · `almost` 묶음 → answer `swallows`: `swallows*/coughs/pushes/breaths`.
- 19.4 · `almost` 묶음 → answer `worst`: `worst*/best/easiest/quickest`.

### decoy (3)
- 6.2 · `a loud` → `A sticker and a loud high-five …`가 `ko`("스티커랑 하이파이브")에 그대로 맞음 → `A shot and` (`A shot and a big high-five …`는 `ko`와 어긋남).
- 1.1 · `after just` → `…a sharp pinch after just a second`가 "잠깐"을 "잠시 뒤"로 읽으면 `ko`에 맞음 → `a dull ache` (`ko` "날카로운"이 거름).
- 14.0 · `head tilted to` → "돌린"과 "기울인"이 가까워 경계선 → `hand turned to` (`ko` "머리"가 거름). (낮음)

### distractorsKo
(a) 아무도 하지 않을 말이라 듣지 않고도 걸러짐 — 같은 상황에서 할 법한 다른 말로 바꿈:
- 4.2 `결과는 알려 드리지 않을 거예요` → `결과는 의사 선생님이 알려 주실 거예요`
- 8.2 `결과가 정확하지 않아도 괜찮아요` → `결과는 이틀쯤 뒤에 나와요`
- 8.3 `오염되어도 결과는 정확해요` → `소독약이 마를 때까지 잠깐 기다릴게요`
- 9.2 `첫 투여는 혼자 해 보세요` → `한 시간쯤 걸려 들어가요`
- 10.0 `혈액형은 확인하지 않아요` → `수혈은 두 시간쯤 걸려요`
- 10.1 `열이 나도 괜찮으니 참아 주세요` → `수혈 중에도 물은 드셔도 돼요`
- 12.1 `감염되지 않도록 소독은 생략할게요` → `무릎을 세우고 다리를 벌려 주세요`
- 13.4 `라벨은 바뀌어도 괜찮아요` → `검사 결과는 한 시간쯤 걸려요`
- 14.2 `방포는 만져서 정리하셔도 돼요` → `얼굴 위로 천을 덮을게요`
- 15.1 `느끼시는 건 말씀 안 하셔도 돼요` → `혈압을 다시 재 볼게요`
- 15.2 `수액을 끊고 퇴원 준비를 할게요` → `혈액 팩은 혈액은행으로 돌려보낼게요`
- 16.1 `기도를 막으려고 약을 드릴게요` → `산소를 더 올려 드릴게요`
- 16.2 `제 목소리는 듣지 말고 숨을 참으세요` → `다리를 조금 올려 드릴게요`
- 17.2 `정신 놓으셔도 괜찮아요, 수액은 나중에 넣어요` → `가족분께 연락드렸어요`
- 18.0 `약물, 용량, 농도는 확인하지 않아도 돼요` → `약국에 농도를 물어볼게요`
- 18.2 `15유닛을 제가 정했으니 확인은 필요 없어요` → `혈당을 한 번 더 재 볼게요`
- 18.4 `확인은 건너뛰고 바로 투여해요` → `처방을 다시 띄워 볼게요`
- 18.5 `그건 괜찮아요, 속도가 우선이에요` → `이 일은 기록해 둘게요`
- 19.1 `제 손을 놓으세요, 진통제를 뺄게요` → `숨을 천천히 내쉬어 보세요`
- 19.3 `제 곁을 떠나도 괜찮아요, 잘 못하고 계세요` → `엑스레이를 곧 찍을 거예요`
- 20.3 `활력징후는 보고하지 않을게요` → `가온기를 연결할게요`
- 20.4 `지금 담당의 없이 비율을 정해요` → `칼슘 수치를 확인해 볼게요`
- 20.5 `다음 보냉함이 오면 말하지 마세요` → `빈 혈액 팩은 모아 두세요`
- 3.4 `기록이 끝나면 말씀하지 마세요` → `기록이 끝나면 스티커를 뗄게요`

(b) 반만 다른 말이라 들을 때 정답이 둘 — 같은 상황의 다른 말로 바꿈:
- 2.1 `처음 나오는 소변을 컵에 받아 주세요` → `뚜껑 안쪽은 만지지 마세요`
- 8.1 `소독 전에는 만지지 마세요` → `소독약이 조금 차가울 수 있어요`
- 10.2 `마지막 15분에만 지켜볼게요` → `수혈 중에도 화장실은 가실 수 있어요`
- 10.3 `이렇게 하면 혈액이 대략 맞는지 확인돼요` → `이렇게 하면 수혈이 더 빨리 끝나요`
- 13.5 `검사실로 보낸 뒤에 라벨을 확인할게요` → `결과는 담당 의사에게 갈 거예요`
- 14.1 `잠드는 약이 들어가고 나면 압박감이 있어요` → `시술은 30분쯤 걸려요`
- 14.1 `압박감이 먼저 오고 마취약이 들어가요` → `얼굴은 천으로 덮어 둘게요`
- 17.1 `강한 압박감이 느껴지면 알려 주세요` → `다리를 곧게 펴 주세요`
- 18.4 `투여한 다음에 멈추고 확인해봐요` → `약국에 전화해 볼게요`
- 19.4 `가장 좋은 부분은 거의 끝났어요` → `곧 엑스레이를 찍을 거예요`

(정답과 한 낱말만 다르지만 핵심 명사가 달라 들을 때 구별되는 2.0 `뒤에서 앞으로`, 15.3 `편안함이`, 20.0 `혈장 팩을`은 그대로 둬도 된다.)

### order (13장 + 선택 1) — 줄을 고치면 `why`도 함께 고친다(바뀐 연결어를 가리키게, "순서가 하나예요"의 근거를 새로 씀)
- S1 · 1↔2 자연스러움(공감 줄로 시작해도 됨) → L2 `I know that can feel scary, so I'll tell you each step.` (`that`이 L1의 바늘을 가리킴)
- S3 · L3 `So please stay still … so it can listen clearly`는 `so`가 두 번 → `Please stay still for ten seconds so it can listen clearly.`
- S4 · L3 `Once you have them` → `Once we have them`. 3↔4 자연스러움(`Until then`이 L2의 "결과 나오는 즉시"를 가리킬 수 있음) → L4 `Until the doctor does, you're not alone — we're working on this together.`
- S6 · L4 `…are waiting for that`이 어색함 → `He's earned a sticker and a big high-five for that.`
- S7 · 사실 3 → L2 `Good to know. Do you have any kidney problems or take metformin?`, L3 `If everything checks out, the dye may feel warm — that's normal.` why: "과거 반응을 묻고, 이어 신장·메트포르민을 묻고, 둘 다 괜찮으면 따뜻한 느낌을 안내한 뒤…"
- S9 · 사실 1, 그리고 3↔4가 자연스러움(`Meanwhile`) → L2 `If not, I'll start the first dose of this antibiotic now.`, L4 `While I do, tell me right away if you feel itchy or short of breath.` (`While I do`가 L3의 지켜보기를 가리킴) why도 "소량으로 시작" 삭제.
- S10 · 사실 4 → L3 `While it's running, tell me if you feel chills, itching, or back pain.` why의 "그 시간 동안"도 "수혈 내내"로.
- S11 · 3↔4 자연스러움(`Once it passes`의 `it`이 관으로 읽힘) → L4 `Once that feeling eases, we're almost through — just a few more swallows.`
- S14 · 방포는 마취 전에 덮이므로 순서가 임상과 어긋남 → L2 `Once you're in position, these drapes keep everything sterile, so try not to touch them.`, L3 `Under them, you'll feel some numbing medicine, then pressure.` (icon도 L2 bandage·L3 bulb로 맞바꿈). why도 고침.
- S16 · 3↔4 자연스러움(`While it works`의 `it`이 L2 에피네프린) → L4 `While that tightness eases, focus on my voice and try to breathe slowly.` L3 `already working`은 IM 에피네프린이 몇 분 걸리므로 `…but the medicine should start working soon.`이 정직함(선택).
- S17 · L3 시제 충돌(`Once it's in … now`), 3↔4 자연스러움 → L3 `Once it's in, we'll get fluids into you right away.`, L4 `Hang on — those fluids will work fast, I promise.`
- S19 · 사실 5, 3↔4가 약함(`From here`가 L3를 가리키지 않음; 2↔3도 경계선) → L1 `The doctor is placing the chest tube now, so you'll feel numbing medicine, then pushing pressure.`, L4 `That means the worst part is over — stay with me.`
- S20 · 3↔4 자연스러움(`the answer`가 L2의 질문을 가리킴), "답을 받기 전까지만" 활력징후를 보고한다는 논리도 이상함 → L4 `While the attending decides, I'll keep reporting vitals every five minutes.` L2가 누구에게 묻는 말인지(현장 의사 → 담당의 확인) why에 한 줄.

(S0 S2 S5 S8 S12 S13 S15 S18은 교환 셋 모두 어색해 순서가 고정됨 — 그대로. S15 L3 `Based on that`은 "증상에 따라 수액 전환"으로 읽혀 약간 조건적이다 → `Thank you. Now we're switching to fluids and calling the doctor.`(선택).)

### context `word`·`ko` (8)
`word`가 세 장면 어디에도 없음 → 장면이 실제로 쓰는 말로:
- S2 `sample` → `specimen` (ko 검체)
- S4 `test` → `labs` (ko (혈액) 검사)
- S9 `allergic` → `allergy` (ko 알레르기)
- S11 `tube` → `NG tube` (ko 비위관) — 장면은 `NG`·`NGT`
- S12 `okay` → `consent` (ko 동의)
- S17 `bone` → `IO` (ko 골내 주사) — 장면은 `IO`·`intraosseous`
- S20 `vitals` → 장면 1·3이 BP·HR 숫자, 2가 `VS`라 `vital signs`(ko 활력징후)로 바꾸거나 그대로 두고 장면 하나에 `vitals`를 넣음(낮음).
`ko`가 그 뜻이 아님:
- S1 `start` ko `시작하다` → `(정맥로를) 잡다`

### 문장 아이콘 (3, 낮음)
- 7.3 `siren` → `shield` (알레르기 질문은 위급 신호가 아님)
- 19.4 `chartup` → `star`
- 11.4 `handshake2` → `faceWorried` (같은 주제의 다른 `공감` 문장과 맞춤)

## 결정 11 · base 보고 (v46 범위 밖, 고치지 않고 보고만)
- 9.4 `This is a small test dose to start.` — 첫 항생제 투여를 시험 용량으로 소개하는 문장은 미국 관행과 어긋난다(사실 1). 바꾸려면 사용자 결정.
- 5.5 `We won't stop until we find a good vein.` — 시도 횟수 제한(INS)과 같은 상황 5.2와 어긋난다(사실 6).
- 18.2 `I calculated fifteen units; can you confirm?` — 값을 먼저 말해 독립 이중 확인이 아니게 된다(사실 2). keyPhrase급 문장이면 why로만 보완.
- 20.1 `Do you want one-to-one-to-one ratio …` — 관사 빠짐(`a one-to-one-to-one ratio`).
- 11.2 `it won't stop you breathing` — 미국 영어는 `stop you from breathing`이 자연스럽다(낮음).
- 6.3 `It'll be over before he even notices.`·17.4 `I promise` — 결과를 약속하는 말. 같은 주제 S6 swap이 "거짓 약속은 신뢰를 잃는다"고 가르치는 것과 결이 다르다(낮음).
- 0.0 ko `이름과 생년월일을 전부` → `성함 전체와 생년월일을`이 자연스럽다. 9.0 ko `복용해 보신`은 정맥 항생제라 `맞아 보신`이 맞다(낮음).
- 문장 `chunks`에 구 경계를 끊은 조각이 있다(0.4 `just to / be safe`, 6.2 `a big / high-five are / waiting after`, 8.0 `the site really / well first`). keyPhrase 여부와 상관없이 보고만.

## 고칠 것 개수
- why 11 · 빈칸 21문장(정답이 둘 2, 문법 7, 동떨어짐 6, 되풀이 옮김 6) · decoy 3 · distractorsKo 34 · order 13장(S15는 선택이라 빼고 셈) · context 8 · 아이콘 3
- **합계 93** (그중 사실·안전에 관한 것: why 4[9.4 18.2 18.0 5.5], order 5장[S7 S9 S10 S14 S19], 빈칸 정답이 둘 2)
- 결정 11 보고 8

## 종합
임상 설명은 대체로 정확하고(저작자가 걱정한 6건은 모두 맞음), 앞 줄을 가리키는 order 설계와 `ko`로 걸러지는 decoy도 대부분 잘 됐다.
그러나 항생제 시험 용량(9.4·S9)과 독립 이중 확인(18.0·18.2)은 사실이 틀렸고, order 5장의 임상 흐름, `distractorsKo`의 반대말 패턴(34개), 시간 단위·`almost` 묶음의 되풀이는
고쳐야 한다. 위 목록을 반영하고 V18·V19를 다시 통과시키면 내보내도 된다. 9.4·5.5·18.2 문장 자체는 사용자 결정 대기다.
