# er-ortho-trauma — v46 보강 검토 (er)

대상: `er-ortho-trauma.yaml`(상황 21 · 문장 105 · order 21장 · 뉘앙스 context 12 · swap 9). 문장 105개와 order 21장을 **전부** 봤다.
번호는 **1부터** 센다. 상황은 파일 순서대로 S1(사지 손상 초기 사정) … S21(외상성 절단 지혈대 관리), 문장은 `상황.문장`(예: 14.5), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before + 선택지 + after` 420줄, decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립(약 1,000줄),
order 인접 교환 63가지(21장 × 3)와 줄 단어 수, context `word`가 세 장면 `en`에 있는지(W14와 같은 어간 비교), swap 9건(선택지마다 `before[0]+선택지+before[2]`),
decoy의 주제 안 중복, base와 v44 필드 비교(**단어 218개·문장·뉘앙스는 context 장면 `en`·`fix`·`why` 말고 바뀐 것 없음**).
아래에서 빈칸 선택지를 바꾸자고 한 것은 answer가 `en`에 낱말 경계로 정확히 한 번 있는지, 네 줄을 넣어 읽은 결과를 스크립트로 다시 봤다.
새 order 줄은 단어 수(15 이하)와 인접 교환 세 가지를 다시 읽었고, 새 context 장면은 W14 어간 비교를 통과하는지 확인했다.
`verify_one_theme.py er …/er-ortho-trauma.yaml` → `==> 통과`.

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 '정답이 둘'은 **`ko`에도 맞는가**로 판정했다. context는 `review-ctx-A/B/C.md`와 같은 기준
(같은 `word`가 세 장면에 같은 뜻으로, 어색함은 듣는 사람 때문 — 어색함이 장면 안 다른 낱말에서 와도 받아들임, 핸드오프 `deteriorate`처럼 의료진 말을 `word`로 쓰는 것도 허용).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 거의 다 사실이고 말하는 방식의 이유를 짚는다. 저작자가 꼽은 임상 사실(파상풍 5년, 지혈대 시각 기록·임의로 풀지 않음, 절단 조직 보관)은 맞다. 고칠 것: 14.5(통역사를 "함께 확인하는 사람"이라 함 — 역할이 틀림), 10.4(거즈 **또는** 비닐 — 둘 다 써야 함), 6.5(`ko` 되풀이), 4.5(간접의문문 어순을 "정중해진다"고 함), 7.5(경미). |
| 2 | 빈칸 | 2 | `ko`로 걸러지지 않는 '정답 둘'은 **없다**. 그러나 **장면과 동떨어진 우스운 오답이 33문장**(`menu`·`soap`·`dance`·`laugh/chew`·`drip/float`·`architect/electrician/uncle`·`painted`·`noisy`·`shave`·`drinking`…) — 파일럿 2번 갈래 그대로다. 묶음 돌려쓰기 `ignore/hide`(6.2·9.1·10.3), 문법으로 걸러지는 것(9.5 `barely`), 사실 위험 1(6.1 `wet` — 식염수 적신 멸균 드레싱은 개방골절의 표준 처치다). |
| 3 | `decoy` | 3 | 청크 자리를 **대신**해 `ko`에 맞는 다른 문장이 되는 것은 없다. **끼워 넣으면 뜻이 그대로**인 것 1(21.4 `on the chart`), 거의 그대로 1(11.2 `for your heart`), 경계선 11. 105개 중 대부분이 시간·장소 부사구라 대신할 자리가 없고, 같은 말 돌려쓰기 13종(`after the x-ray`·`since this morning`·`in the morning`·`after dinner` 각 3 등). |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이다(1.x, 5.1, 11.4, 16.x, 17.x는 아주 좋다). 정답 뒤집기는 없다. 고칠 것 6: 반만 다른 말 4(8.2 13.5 14.3 21.4), 장면에 안 맞는 말 1(20.2 "손가락" — 경골 골절), 가르친 내용과 엇갈림 1(10.5 "얼음 위에"). |
| 5 | `order` | 2 | 조건절(`If so`·`If not`)로 시작하는 줄은 0, 시간으로 미루는 줄도 없다. 그러나 **`Last,`가 혼자 4번 줄을 잠그는 카드 6장**(S4 S5 S9 S14 S19 + 선택 S16 S18, S21은 내용이 잠금) — 서수를 지우면 순서가 열린다. 인접 교환이 열린 카드 4장(S6 1↔2, S11 2↔3, S12 2↔3, S17 2↔3 약하게), 인과가 틀린 줄 1(S20 L3), 영어가 어색한 줄 2(S3 L3, S13 L3), 약속이 지나친 줄 1(S10 L2). S5는 RICE를 차례로 가르친다(아래). 15단어 초과 없음. |
| 6 | `tag`·`icon` | 4 | 태그는 한국어·10자 이하. 16.2 `신장 통증`은 '콩팥'으로 읽힌다(→ `신전 통증`), 9.3 `안심 시키기` 띄어쓰기. 아이콘은 대체로 맞고, 수혈 문장(17.2 19.2 19.5)의 `pill`은 목록에 피 아이콘이 없어 받아들인다. order 21장은 모두 `대화 흐름`·`compass`. |
| 7 | context `word`·`ko`, swap `ko` | 3 | `word`가 세 장면 모두에 있는 것 12/12(W14 0). 그러나 **끼워 넣기 갈래가 4건**: S18(XX에 쉬운 말 `shortness of breath`가 그대로 들어가 어색함이 흐려짐 — 심각), S16(`high compartment pressure`를 콜·차트에 넣음 — 임상적으로도 틀림), S14(`Interpreter, …` 호격 — 원어민이 하지 않는 말), S13(`malignancy or metastatic cancer` 중복). S4는 경미. swap `ko` 9건은 모두 정답을 넣은 문장의 뜻이다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8) 확인. (2) 동떨어진 빈칸 오답 33문장, 관사는 잘 지킴(`an interpreter/an x-ray/an open` 모두 모음). (3) order 못 박기: `And/Also/Then` 없음, 대신 `Last,`로 못 박기 6장. (4) 임상 순서·사실: S5 RICE 순서, S20 인과, 14.5 통역 역할. (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **S18 context `short of breath` — 어색한 장면에 쉬운 말이 그대로 있다.** XX `Any dyspnea on exertion, orthopnea, or shortness of breath?`는 고칠 말(`shortness of breath`)을 이미 품고 있어 어색함이 흐려지고, `dyspnea on exertion`·`orthopnea`는 만성 심부전 문진 말이라 지방색전(급성) 장면과 맞지 않는다. 차트 `Pt newly short of breath (dyspnea)`도 W14를 맞추려 끼워 넣은 말이다(차트는 `dyspnea`·`SOB`). TASK 9번이 금지한 갈래.
2. **S16 context `pressure` — `high compartment pressure`를 정형외과 콜·차트에 끼워 넣었다.** 구획증후군은 임상 진단이고 구획 압력은 측정해야 아는 값이다(측정은 대개 의사가 함). 장면은 아직 의사를 부르는 단계라, 간호사가 재지 않은 수치를 보고하는 말을 가르치게 된다.
3. **S20 order L3 `Given those findings, we updated tetanus and gave antibiotics` — 인과가 틀렸다.** "그 소견(원위부 맥박·감각 정상)에 맞춰" 파상풍·항생제를 줬다는 뜻인데, 둘은 **개방골절이라서** 준다. 신경혈관 소견과는 관계가 없다.
4. **S5 order — RICE를 `First … Last`로 차례 매김.** 휴식·얼음·압박·거상은 함께 하는 것이지 단계가 아니다. 카드는 "마지막으로 거상"이라는 순서를 정답으로 가르치고, 순서도 서수만이 잠근다(저작자 보고 3).
5. **14.5 why — 통역사를 "옆에서 거드는 사람이 아니라 함께 확인하는 사람"이라 함.** 의료 통역사는 사정·확인을 하지 않고 말을 정확히 옮기는 사람이다. 학습자가 통역사에게 문진을 맡겨도 된다고 읽을 수 있다.
6. **6.1 빈칸 오답 `wet` — 맞는 처치를 틀린 말로 가르친다.** 개방골절은 식염수에 적신 멸균 거즈로 덮는 것이 표준이다(`wet dressing`). `ko` "멸균"이 걸러 주지만, 오답으로 두면 "젖은 드레싱은 틀리다"로 배운다.

## 저작자 자기 보고 4건 판정

### 1. context 정비

| 상황 | 판정 | 근거 |
|---|---|---|
| S4 `fall` | **받아들임(경미 수정)** | 세 장면 모두 `fall`, 뜻도 같다. XX의 어색함은 `mechanism`·`landing position`에서 온다(장면 안 다른 낱말 — 묶음 B 기준). 다만 의사 보고 `He had a fall, about six feet off a ladder, and …`는 쉼표 위치가 어색하고, why가 차트 장면의 `FOOSH`를 더는 풀지 않는다. 원래 학습 의도(MOI 약어를 환자에게 쓰지 않기)는 `mechanism`으로 남았다. 아래 C5의 대안(`word: mechanism`)이 base에 더 가깝다. |
| S13 `cancer` | **받아들임(XX 수정)** | 차트 `breast cancer`는 실제로 쓰는 말이다. 원래 XX `Any hx of CA?`는 소리 내어 하는 사람이 없는 말이라 바꾼 방향은 좋다. 그러나 새 XX `a history of malignancy or metastatic cancer`는 W14를 맞추려 `cancer`를 덧붙인 중복(전이암은 악성종양의 하나)이다. 병적 골절 장면의 실제 관심사인 뼈 전이로 바꾸면 자연스럽다(C4). CA 약어라는 원래 의도는 사라지지만, 말로 하는 장면에서 CA는 애초에 맞지 않았다. |
| S18 `short of breath` | **받아들이지 않음(심각 1)** | 쉬운 말을 `word`로 고르면 XX에도 그 쉬운 말이 들어가야 해서 어색한 장면이 덜 어색해진다. 핸드오프 `deteriorate`처럼 **의료진 말 `dyspnea`를 `word`로** 쓰면 base 장면을 거의 그대로 살릴 수 있다(묶음 A `expired` 판정과 같은 근거). 원래 학습 의도(dyspnea를 환자에게 쓰지 않기)도 그대로 남는다. |
| S14 `interpreter` | **받아들이지 않음** | `Interpreter, please tell her …`처럼 직함을 호격으로 부르는 것은 원어민이 하지 않는 말이다. 실제로 흔한 실수는 base 그대로의 `Tell her I need to know …`(통역사에게 3인칭으로 말하기)다. 세 장면이 `interpreter`를 자연스럽게 공유하지 못하므로 TASK 9번대로 `word`를 바꾼다 — `allergies`(C3). 어색함은 3인칭 화법에서 오지만 묶음 B 기준으로 받아들일 수 있다. |
| S5 `ice` | **받아들임(fix 경미)** | 차트 `Ice 20 min TID-QID`는 실제 퇴원 지시 말투, XX의 어색함은 TID·QID에서 온다. fix의 `a few times today`는 RICE가 하루로 끝나는 것처럼 들린다 → `a few times a day`. |
| S12 `growth plate` | **받아들임** | 차트 `Salter-Harris II fx through the growth plate`는 조금 중복(SH 분류가 이미 성장판 골절)이지만 판독문에서 쓰는 말이다. XX의 어색함은 분류명에서 오고 fix도 좋다. (선택: `word: Salter-Harris`로 base 차트·XX를 그대로 살릴 수 있다.) |
| S16 `pressure` | **받아들이지 않음(심각 2)** | 위 심각 2. 어색한 말 `fasciotomy`가 의료진 사이에서는 맞는 말이라 `deteriorate`와 같은 모양으로 `word`가 될 수 있다(C2). |

### 2. `ko`로만 걸러지는 빈칸

**판정: 허용.** 낱장 머리에 `ko`가 보이니, 같은 분야의 다른 말(`foods`·`insects`↔"약", `absent`·`weak`↔"정상")이 `ko`로 걸러지는 것은 파일럿 2번이 바란
"같은 분야에서 틀린 말"이다. 14.2 `foods/insects/pets`, 20.2 `absent/weak/lost` 모두 그대로 둬도 된다. 같은 갈래로 2.3 `temperature`, 2.1 `see`, 4.3 `tingling`,
7.4 `dark`, 8.2 `grip`, 11.2 `refill/test`, 13.3 `hair`, 20.4 `sutured`, 21.4 `first`도 허용한다.
예외 하나: 6.1 `wet`은 `ko`로 걸러지지만 **맞는 처치**라 바꾼다(심각 6). 선택으로 20.2 `lost`(SBAR에서 덜 쓰는 말)를 `bounding`으로, 14.2 `pets`를 그대로 둬도 된다.

### 3. 순서가 자유로운 주제에 `First`·`Last`

**판정 방법(core-handoff Q3과 같음): 서수를 지우고도 내용만으로 순서가 하나인가.** `First,`는 브리프가 1·2줄을 고정할 때 허용한다. `Last,`가 혼자 4번 줄을 잠그면 학습자는 대화 흐름이 아니라 표지를 찾는다.

- **S5 RICE — 불허(심각 4).** 서수를 지우면 L4(거상)는 L1 뒤 어디에나 온다. 임상적으로도 차례가 없다. → O3: 앞 줄을 가리키는 말(`resting it` → `With it up` → `Between icing sessions`)로 묶는다. 순서는 "쉬기 → 쉬는 동안 올리기 → 올린 채 얼음 → 얼음 사이 압박"이라 내용이 잠근다.
- **S10 손가락 절단 이송 — 지금 카드에는 `First`·`Last`가 없다.** `They` → `For that reason` → `Through all of this`로 잘 묶였고 교환 셋이 모두 깨진다. 허용. 다만 L2 `They'll want to reattach it`이 10.2 why("가능성만 말하고 약속하지 않아요")와 엇갈린다 → O6. 지혈이 마지막 줄인 것은 `Through all of this`가 '내내'를 말하니 받아들인다.
- **S11 항응고제 — 지금 카드에는 서수가 없다.** 그러나 2↔3이 열린다(L1이 이미 이유를 담고 있어 `For the same reason`이 L1 바로 뒤에도 붙음) → O7.
- 같은 갈래로 더 찾은 것: **S4**(통증 점수가 `Last`로만 4번 — O2), **S9**(지남력 줄 — O5), **S14**(통역사 줄이 2번에도 맞음 — O10), **S19**(`Last, because both your legs are broken` — O12)는 고친다. **S16·S18**은 L4가 계속 확인·증상 알림이라 끝맺는 말로 자연스러워 선택. **S21**은 L2 `until it's safe` → L4 `once it's safe`가 내용으로 잠가 `Last` 없이도 거의 하나다(선택 O16).

### 4. `why` 임상 사실

| 주장 | 판정 |
|---|---|
| 6.3 · S6 context 파상풍 5년 | **맞다.** CDC: 오염된(파상풍 위험) 상처는 접종을 3회 이상 마쳤어도 마지막 접종이 **5년**을 넘었으면 Td/Tdap. 3회 미만이거나 모르면 TIG도. "추가 접종을 고려해요"는 맞는 수위다. S6 context 장면(10년 넘음 → Tdap)과도 맞는다. |
| 21.1·21.4 지혈대 시각 기록 | **맞다.** 채운 시각을 지혈대·차트에 적고 인계 때 전한다. 허혈 시간 판단의 기준이다. |
| 21.2 · S21 swap 임의로 풀지 않음 | **맞다.** 주기적으로 풀었다 채우는 것은 예전 관행이고(swap notes도 그렇게 말함), 출혈을 다른 방법으로 잡을 수 있을 때(대개 수술실) 의사가 판단해 푼다. 21.2 why의 "정해진 시점에"는 '주기적으로'로 읽힐 수 있어 선택으로 다듬는다(W6). |
| 10.1 · S10 swap 절단 조직 보관 | **맞다.** 식염수에 적신 거즈로 싸서 밀봉 봉투에 넣고, 그 봉투를 얼음(물)에 둔다. 물에 직접 담그거나 얼음에 직접 닿게 하지 않는다. **10.4 why만 틀렸다** — "거즈**나** 비닐로 싸서 얼음 위에"는 거즈만 싸서 얼음에 올려도 된다고 읽힌다(W2). |

## 고칠 것 (v46 필드)

### why (5 + 선택 1)
- **W1** 14.5 · 통역사 역할(심각 5) → "help us check는 통역사가 확인을 대신한다는 뜻이 아니에요. 확인하는 사람은 간호사이고, 통역사는 통증과 병력처럼 정확해야 하는 말을 그대로 옮겨 줘요."
- **W2** 10.4 · "거즈나 비닐로 싸서 얼음 위에" → "directly를 넣어 얼음에 바로 닿지 않게 하라는 점을 짚어요. 절단 부위는 젖은 거즈로 싸서 밀봉 봉투에 넣고, 그 봉투를 얼음 위에 둬요 — 얼음에 바로 닿으면 조직이 얼어 상해요."
- **W3** 6.5 · `ko` 되풀이("피부를 닫기 전에 의사가 뼈를 직접 본다") → "before we close the skin으로 다음 단계를 알려 주면, 상처가 왜 아직 열려 있는지 환자가 이해해요. 개방골절은 씻어 내고 오염된 조직을 정리한 뒤에 닫아요."
- **W4** 4.5 · "평서문 어순으로 이으면 질문이 정중해져요"는 틀린 설명(간접의문문은 원래 평서문 어순) → "Tell me 뒤에 질문을 넣을 때는 how high you fell from처럼 평서문 어순으로 써요. 떨어진 높이는 부상 정도를 가늠하는 기준이에요."
- **W5** 7.5 (경미) · "move quickly로 서두르는 이유까지 전해져요" — move quickly는 이유가 아니라 급함이다 → "…move quickly로 맥박이 없는 발은 시간이 중요하다는 급함도 함께 전해요."
- (선택) **W6** 21.2 · "정해진 시점에" → "…지혈대는 출혈을 다른 방법으로 잡을 수 있을 때(대개 수술실)까지 그대로 둬요. 중간에 풀었다 채우지 않아요."

### 빈칸 (33문장 + 선택 2)
모두 `ko`로 걸러지지 않는 정답 둘은 없다. 문제는 **장면과 동떨어진 우스운 오답**(파일럿 2번)이다. 고칠 안은 같은 분야에서 틀린 말이고, 넣어 읽으면 문법이 맞으며 `ko`가 걸러 준다(스크립트로 네 줄 확인).

| # | 문장 | 지금 오답 | 고칠 오답(정답은 그대로) |
|---|---|---|---|
| B1 | 2.5 Squeeze | Tap / **Release / Drop** (as hard as you can과 뜻이 안 맞음) | `Push / Pull / Tap` |
| B2 | 3.2 weight | tape / **water / oil** | `ice / lotion / tape` |
| B3 | 3.4 color | **shape / weight / length** | `movement / swelling / length` (movement는 실제 순환·운동 확인 항목, ko "색"이 거름) |
| B4 | 4.2 scale | map / list / **menu** | `map / list / chart` |
| B5 | 4.4 heavy | wet / **loud** / hot | `sharp / soft / small` |
| B6 | 4.5 high | **warm / loud / wide**(how wide you fell from — 뜻이 안 됨) | 빈칸을 `fell`로 옮김: `fell / jumped / climbed / slipped` (ko "떨어졌는지"가 거름) |
| B7 | 5.2 ice | gauze / tape / **soap** | `heat / a brace / ointment` (heat ↔ ice는 급성 손상에서 실제로 헷갈리는 대비) |
| B8 | 5.5 rest | stretch / **bounce / scratch** | `stretch / massage / exercise` |
| B9 | 6.1 sterile | stiff / dirty / **wet**(심각 6) | `stiff / dirty / tight` |
| B10 | 6.2 prevent | spread / **hide** / cause (`hide` 돌려쓰기) | `treat / spread / cause` (예방 ↔ 치료, ko "예방"이 거름) |
| B11 | 7.2 pressing | tapping / sliding / **waiting** | `tapping / sliding / rubbing` |
| B12 | 8.1 relax | **walk / laugh / chew** | `heal / stand / cough` |
| B13 | 8.4 slide | **drip / float** / jump | `twist / roll / jump` (`pop`은 실제로 쓰는 말이라 넣지 말 것) |
| B14 | 9.1 manage | **ignore / delay / hide** (아무도 안 할 말, 돌려쓰기) | `check / record / ask about` |
| B15 | 9.3 oriented | **bored / excited / busy** | `sedated / awake / quiet` |
| B16 | 9.4 stand | kneel / jump / **dance** | `kneel / lean / sit` |
| B17 | 9.5 often | rarely / seldom / **barely**(문법으로 걸러짐) | `rarely / later / once` |
| B18 | 10.3 control | **ignore / hide / forget** (돌려쓰기) | `check / watch / report` |
| B19 | 11.3 tightness | dryness / wetness / **noise** | `dryness / numbness / wetness` |
| B20 | 12.4 worry | guess / **argue / smile** | `cry / ask / wait` |
| B21 | 13.5 scans | **meals** / casts / crutches | `casts / crutches / splints` (`labs`는 실제 검사라 넣지 말 것) |
| B22 | 14.1 interpreter | **architect / electrician / uncle** | `aide / orderly / EMT` (모두 `an`과 맞음) |
| B23 | 14.4 Nod | Frown / **Cough / Kneel** | `Wave / Blink / Point` |
| B24 | 15.1 elevated | **hidden / painted** / lowered | `lowered / covered / warm` |
| B25 | 15.2 fingers | elbows / **ears** / knees | `toes / elbows / nails` |
| B26 | 15.5 stiff | dirty / **noisy** / wet | `cold / numb / dirty` (`swollen`은 사실상 맞는 말이라 넣지 말 것) |
| B27 | 17.1 stabilize | measure / clean / **remove** | `measure / clean / lift` |
| B28 | 17.2 internally | **rarely** / externally / **softly** | `externally / slowly / again` |
| B29 | 17.5 fluids | pills / **gauze / ice** | `oxygen / pills / painkillers` |
| B30 | 18.2 oxygen | **height / hearing / weight** | `pulse / temperature / blood sugar` |
| B31 | 18.4 confused | **excited / relaxed / grateful** | `dizzy / nauseous / cold` |
| B32 | 19.3 splint | massage / measure / **shave** | `massage / measure / elevate` |
| B33 | 19.5 losing | saving / **drinking** / gaining | `saving / gaining / clotting` (`bleeding`은 ko에 맞아 넣지 말 것) |
- (선택) 20.2 `lost` → `bounding` (SBAR 말투). 21.2·21.5가 오답 셋 `tighten/cover/tie`를 같이 쓴다 → 21.5를 `tighten / adjust / cover`로.
- 그대로 둬도 되는 것: 1.5 `healed/rested/cleaned`(약하게 동떨어짐), 18.3 `feeding`, 19.2 `biopsy`, 21.1 `skipped/lost`, 7.1 `wait quickly`.

### decoy (2 + 경계선 보고)
- **D1** 21.4 `on the chart` → `for the lab` — 끼우면 `We wrote down on the chart the exact time…`이 `ko` "적어 두었어요"와 같다(파일럿 5번 `for the chart`와 같은 갈래).
- **D2** 11.2 `for your heart` → `for the pain` — `Which blood thinner do you take for your heart and when was the last dose?`가 자연스럽고 `ko`에 어긋나지 않는다.
- 경계선(`ko`에 없는 말을 덧붙이지만 어긋나지는 않음, 고치지 않아도 됨): 1.4 `with your good hand`, 4.2·16.4 `at rest`, 14.3 `on the paper`, 15.1 `at night`, 16.1 `in the leg`, 17.5 `through your arm`, 18.2 `on your legs`, 20.1 `from a fall`, 20.2 `on the left`, 20.3 `by the doctor`.
- 돌려쓰기(사소): `after the x-ray`·`since this morning`·`in the morning`·`after dinner` 각 3, `at rest`·`with a towel`·`after you eat`·`at home`·`next week`·`this afternoon`·`last week`·`this evening`·`at the desk` 각 2. 시간·장소 부사구는 대신할 청크 자리가 없어 쉽게 걸러진다 — 다음 주제부터는 브리프 예시처럼 **같은 자리에 올 구**(6.1 `with a towel` ↔ `with a sterile dressing`, 10.4 `in water` ↔ `directly on ice`가 좋은 예)를 늘리길 권한다.

### distractorsKo (6 + 선택 1)
- **K1** 8.2 `정복 전에 맥박을 확인했어요` — 정답("맞춘 뒤 맥박을 다시 확인")과 반만 다름 → `정복 뒤에는 팔걸이를 하실 거예요`
- **K2** 13.5 `지금 뼈 사진을 찍을 거예요` — scans ↔ 뼈 사진, 반만 다름 → `결과는 정형외과에서 설명해 드릴 거예요`
- **K3** 14.3 `손으로 숫자를 보여 주세요` — why가 말하는 정답의 절반("얼마나 아픈지 손가락 숫자로") → `통역사가 오면 다시 여쭤볼게요`
- **K4** 21.4 `시간은 차트에 기록할게요` — 정답("정확한 시각을 적어 두었어요")과 같은 행동 → `지혈대 아래쪽 피부색을 볼게요`
- **K5** 20.2 `손가락 색은 분홍색입니다` — 경골 골절 인계다 → `발가락 색은 분홍색입니다`
- **K6** 10.5 `손가락은 얼음 위에 올려 둘게요` — 10.4가 가르친 "얼음에 바로 두지 않기"와 엇갈려 읽힌다 → `이송 중에도 출혈을 계속 볼게요`
- (선택) 금식 돌려쓰기: 9.1 `지금은 금식 중이에요`·9.3 `저녁은 금식이에요`·9.5 `수술 전에 금식해 주세요`, 보호자 연락 9.3·9.5 → 9.3을 `침대 난간을 올려 둘게요`, 9.5를 `소변은 침상에서 보실 거예요`로.

### order (13 + 선택 4)
| # | 카드 | 문제 | 고칠 안(줄 ko·why도 새 줄에 맞게) |
|---|---|---|---|
| O1 | S3 L3 | `Even when careful, …`는 주어 없는 비문이고, 조심하지 않아서 조인다는 엉뚱한 인과. why는 `Even when you're careful`이라 줄과도 다름 | L3 `Even with no weight on it, tell me if it feels too tight or numb.`(15단어, ko "체중을 싣지 않아도 너무 조이거나 저리면 말씀해 주세요") — `no weight`가 L2를 받아 2↔3이 깨진다 |
| O2 | S4 | 서수를 지우면 통증 줄(L4)이 어디에나 온다 | L1 `On a scale of zero to ten, how bad is the pain?` / L2 `To understand that pain, did you fall, or did something land on it?` / L3 `Whichever it was, tell me exactly how high or how heavy.` / L4 `That much force can injure other spots too—does anything else hurt?` (ko: 0~10 중 얼마나 아프세요 / 그 통증을 알려면, 넘어지셨나요 뭔가 떨어졌나요 / 어느 쪽이든 정확히 얼마나 높거나 무거웠는지 / 그 정도 힘이면 다른 곳도 다칠 수 있어요, 다른 데 아픈 곳은요?) — 4.1 why "함께 다쳤을 수 있는 곳"과 맞음 |
| O3 | S5 | 심각 4 | L1 `For the next few days, stay off your foot as much as you can.` / L2 `While you're resting it, keep the ankle up above your heart.` / L3 `With it up, ice it for twenty minutes at a time.` / L4 `Between icing sessions, keep it wrapped, but not too tight.` (ko: 며칠 동안 최대한 딛지 마세요 / 쉬는 동안 발목을 심장보다 높이 / 올린 채로 한 번에 20분씩 얼음 / 얼음찜질 사이에는 붕대를 감되 너무 조이지 않게) |
| O4 | S6 | 1↔2가 열림(L2가 L1을 가리키지 않음). 고친 뒤 2↔3이 약하게 열려 L3도 | L2 `Even covered, it can get infected, so you'll get antibiotics.`(ko "덮어도 감염될 수 있어서 항생제를 맞으실 거예요") / L3 `That same infection risk is why I ask: when was your last tetanus shot?`(ko "같은 감염 위험 때문에 여쭤요, 마지막 파상풍 주사는 언제였나요?") |
| O5 | S9 L4 | `Last`만 4번을 잠금 | L4 `Each time we check, we'll remind you where you are and what day it is.`(15단어, ko "살펴볼 때마다 여기가 어디고 오늘이 무슨 요일인지 알려 드릴게요") — L3 `check on you often`을 받고, 섬망 예방의 재지남 그대로 |
| O6 | S10 L2 | `They'll want to reattach it`은 재접합을 약속하는 말로 들림(10.2 why와 엇갈림) | L2 `They may be able to reattach it, so we're keeping the finger cool and moist.`(15단어, ko "재접합할 수 있을지도 몰라서 손가락을 시원하고 촉촉하게 보관하고 있어요") |
| O7 | S11 | 2↔3이 열림(L1 → `For the same reason` → `That matters…`도 자연스러움). L1 `which one and when`의 `when`이 흐림 | L1 `You take a blood thinner—which one, and when did you last take it?` / L3 `Because it can grow, we'll check the limb often for tightness and color.`(ko "붓기가 커질 수 있어서 사지를 자주 확인해 조임과 색을 볼게요") — `it`이 L2의 swelling을 받는다 |
| O8 | S12 | 2↔3이 열림(L3 `Because we're watching it`이 L1을 받아 L2가 3번에도 옴). L2·L4가 둘 다 "잘 나아요" | L3 `To keep it healing well, we'll take an x-ray now and another at follow-up.` / L4 `Please don't skip that follow-up visit—it matters for growth.`(ko "그 추적 방문은 꼭 오세요, 성장에 중요해요") |
| O9 | S13 L3 | `Along with that history`는 어색한 영어 | L3 `Even without a diagnosis like that, have you had unexplained pain or weight loss lately?`(15단어, ko "그런 진단이 없더라도 최근 원인 모를 통증이나 체중 감소가 있었나요?"). L4 ko "검사를 지시할 거예요" → "검사를 할 거예요"(간호사가 지시하지 않음) |
| O10 | S14 L4 | 서수를 지우면 L4가 2번에도 맞음 | L4 `Once they're here, they'll help us check the rest of your pain and history.`(ko "통역사가 오면 나머지 통증과 병력을 함께 확인할 거예요") — `the rest`가 앞의 손짓 확인을 받는다 |
| O11 | S17 | 2↔3이 약하게 열림(`To slow it down`의 `it`이 L1의 혈압 하락으로도 읽힘) | L3 `To slow that bleeding, we're placing a binder around your pelvis.` |
| O12 | S19 L4 | `Last`만 잠금, 조심히 옮기는 것은 내내 하는 일 | L4 `With the splints on, we'll move you carefully so the bones stay still.`(ko "부목을 댄 채로 뼈가 움직이지 않게 조심히 옮길게요") |
| O13 | S20 | 심각 3 | L3 `With pulses confirmed, the leg is splinted and the wound dressed for transport.` / L4 `Before the splint, tetanus was updated and antibiotics went in at ten past.`(ko: 맥박을 확인하고 이송을 위해 다리를 부목하고 상처를 드레싱했습니다 / 부목 전에 파상풍을 갱신했고 항생제는 10분에 들어갔습니다). why "개방골절이라 파상풍·항생제를 먼저, 신경혈관 확인 뒤 부목" |
- (선택) **O14** S16 L4 → `Whatever the plan, I'll keep checking how tight and hard the muscle feels.` (`Last` 없이 L3 `the plan`을 받음)
- (선택) **O15** S18 L4 → `Even with the oxygen, tell me if you feel confused or more short of breath.` (15단어, `While you're on it`처럼 시간으로 묶지 않음)
- (선택) **O16** S21 L3·L4 → L3 `While we wait for that, tell me if the pain or numbness changes.` / L4 `When it is safe, we'll release it slowly and watch your leg.`
- (선택) S19 L2 ko "그래서 혈압이 낮고, 그래서 빠르게" → "그래서 혈압이 낮아 빠르게 수혈하고 있어요".

### tag·icon (2)
- 16.2 `신장 통증` → `신전 통증`(수동 신전 시 통증; '신장'은 콩팥으로 읽힘)
- 9.3 `안심 시키기` → `안심시키기`

### context·swap (6)
- **C1** S18(심각 1) · `word: dyspnea`, `ko: 호흡곤란` — 차트 `New-onset dyspnea, SpO2 88% RA, petechiae across chest.`(base) / 의사 보고 `He has new dyspnea, satting 88 on room air, with petechiae across his chest.` / XX `Are you experiencing any dyspnea?`(base) / fix 그대로 / why는 base why로.
- **C2** S16(심각 2) · `word: fasciotomy`, `ko: 근막절개술` — 정형외과 콜 `Calf is tense with pain on passive stretch—can you evaluate her for a fasciotomy?` / 차트 `Pain w/ passive stretch, compartments tense; ortho notified 2140, plan fasciotomy.` / XX `You need an emergent fasciotomy.`(base) / fix·why 그대로. (`pressure`를 지키려면 콜·차트에서 `high compartment pressure`를 빼고 `concern for rising compartment pressure`처럼 재지 않은 말로.)
- **C3** S14 · `word: allergies`, `ko: 알레르기` — 차트 `Pt Indonesian-speaking; allergies reviewed via video interpreter, ID 4471.` / 동료 `She speaks Indonesian, so I'm getting a video interpreter to check her allergies.` / XX `Tell her I need to know if she's allergic to anything.`(base) / fix 그대로 / why는 base why로(`'Tell her…'처럼`). W14 어간 `allerg`로 세 장면 통과 확인.
- **C4** S13 · XX `Any history of cancer, or known bone mets?` / why "bone mets(뼈 전이) 같은 말은 의료진끼리 쓰는 말이고 환자에게는 겁을 줘요. 환자에게는 cancer를 그대로, 치료받은 적이 있는지처럼 담담하게 물어요."
- **C5** S4 (경미) · 의사 보고를 `He had a fall off a ladder, about six feet, and landed on an outstretched hand.`로, why 끝에 "FOOSH는 fall on outstretched hand의 차트 약어예요." 추가. (대안: `word: mechanism`, `ko: 손상 기전` — 차트 `Mechanism: fall from ladder, approx. 6 ft, FOOSH.` / 의사 `Mechanism is a fall about six feet off a ladder onto an outstretched hand.` / XX `What was your mechanism of injury?`(base) / fix `How did the injury happen exactly?`(base) / why base — base에 가장 가깝고 MOI 의도를 그대로 지킴.)
- **C6** S5 (경미) · fix `… a few times today.` → `… a few times a day.`
- swap 9건(S3 S7 S9 S10 S11 S15 S17 S19 S21)의 `ko`·notes·why는 모두 맞다. S21 notes(15분마다 푸는 것은 예전 관행)도 사실이다.

## 결정 11 보고 (base 문장 — v46이 고칠 수 없음, 따로 판단)
- 2.5 `Squeeze my fingers … on both hands` → `with both hands`가 자연스럽다.
- 10.3 `while we prepare transfer` → `prepare for the transfer`.
- 13.5 `ko` "검사를 지시할게요" — 간호사가 지시하는 말로 읽힌다 → "검사를 할 거예요"(ko만).

## 개수
고칠 것 **67** = why 5 · 빈칸 33 · decoy 2 · distractorsKo 6 · order 13 · tag 2 · context 6 (+ 선택: why 1, 빈칸 2, distractorsKo 1, order 4, 결정 11 보고 3).

## 종합
문장 `why`와 `distractorsKo`, swap은 좋고 임상 사실도 대부분 맞다. 다만 빈칸 오답의 3분의 1이 장면과 동떨어진 말이고, order 절반 가까이가 `Last`·인접 교환으로 순서가 열리며,
context 정비 4건이 W14를 맞추려 낱말을 끼워 넣었다(S18·S16 심각). 심각 6건과 위 목록을 고친 뒤에는 내보내도 된다.
