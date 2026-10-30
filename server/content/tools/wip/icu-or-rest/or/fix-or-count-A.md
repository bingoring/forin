# or-count — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `or-count.yaml`(A·B 합본). 단어 134(base 144, 11 삭제·1 추가), 상황 21(문장 105), 뉘앙스 42(slider 18 · swap 12 · context 9 · pair 3).
비교: base · changes(48건: word-remove 11 · word-add 1 · word 16 · sentence 20 전부 `words` 태그만) · in-json · notes-A · notes-B.
검사기: `verify_one_theme.py or or-count.yaml` → `==> 통과`.
임시 스크립트: `_reviewA_or-count_dump.py`(words/sents/nuance), `_reviewA_or-count_checks.py`(길이·cue·decoyChips·slider·pair 전 조합·swap 이어 읽기).
번호는 "상황.문장"(둘 다 0부터). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 철자·소리 닮음은 대체로 좋음(conform·incidence·radiolucent·precede). 품사 다른 오답 ★4(check `chest`, open `oven`·`often`, match `batch`, aloud `allowed`), **정답으로도 맞는 오답 1(protocol `procedure`)** |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과(스크립트). 정답 둘이 되는 ko 오답 없음. 어색한 한국어 2(`다시 끝내다`·`갈라 보다`) |
| 3 cue | 3 | 정답 영어·파생형 노출 0. 그러나 약 20개가 `ko` 낱말을 그대로 넣은 사전 풀이(장면 없음) |
| 4 chips/decoyChips | 4 | 대체 조각 경로 없음. 화면에 나오는 여러 조각 단어의 decoy 중 ★2(`gun` 무기, `bar` 술집), 낮음 몇 개 |
| 5 뉘앙스·문장 사실 | 3 | why·notes는 AORN 관행에 대체로 맞음(두 사람 소리 내어, 교대 시 전수 계수, 추가 물품은 투입 때 기록, 불일치면 집도의에게 알리고 닫기 보류·수색·영상, 영상·재개방 결정은 집도의, 전자 계수는 보조, 판독 전 "possible"). 문장: **중단 계수를 그 자리에서 이어 감(12.4)**, **전원 정지(17.4·KP 17.2)**, **간호사가 후속 영상을 요청하라는 말(19.4)**. slider 2 why "따로" 오류, slider 15 why와 KP 17.0이 서로 어긋남 |
| 6 뉘앙스 설계 | 3 | **pair 16 decoy `the stretcher`가 `take`에 붙음(정답 둘)**, 세 pair 모두 decoy가 같은 말. context 9개 중 핸드오프 모양 아닌 것 1(recount — 어색한 이유가 듣는 사람이 아니라 역할), 일반인도 아는 말 1(incision), fix가 화제를 돌림 1(incident). slider 4 순서, slider 7 example이 오답 보기 문장, swap 문법으로 걸러지는 보기 2 |
| 7 결정 11 | 4 | 쉬운 말 11 삭제·ko 가르기 10·부사 헤드워드 4는 타당. 남은 흠: w-loud ko 틀림(out loud ≠ 큰 소리로)·aloud와 겹침, w-eye 너무 쉬움, 구동사 헤드워드 4(rule·turn·pick·run), `miss`(문장은 missing), 18.3 `add up`에 w-add(추가하다) 오태그, 12.4 `left off`에 w-leave(남기다) 오태그 |

## 사실 오류·심각한 문제
1. **[안전] 12.4 "We pick up exactly where we left off."** — 응급으로 끊긴 계수를 확인 없이 멈춘 자리부터 이어 가라고 가르칩니다. 같은 상황 KP 12.0(마지막으로 확인된 지점부터 다시)·12.1(전부 다시 세기), slider 12 cue("the count must be redone")와 정면 충돌. AORN·대부분 병원 정책은 중단된 계수를 다시 셉니다 → S1. order 12 4줄·why도 같은 문제(B 참고).
2. **[안전·과장] 17.4 "We stop all movement until the needle turns up."**(비KP)·**17.2 KP "Nobody moves until we find it."** — 실제 규칙은 수색이 끝날 때까지 방에서 아무것도(쓰레기·린넨·물품) 나가지 않고 출입을 줄이는 것이지, 환자 처치까지 포함한 전원 정지가 아닙니다. 마취·지혈은 계속됩니다 → S3, K1(사용자 결정). order 17 2·3줄("Nobody moves"·"While everyone stays still")도 같은 말(B 참고).
3. **[역할] 19.4 "Please request a follow-up scan for the patient."** — 영상 처방은 집도의 몫인데 누구에게 무엇을 요청하라는지 불분명하고, 간호사가 독자적으로 영상을 청하는 것으로 읽힘. 수술실 잔류물 확인은 보통 단순 X선 → S2. order 19 4줄은 "사건 보고서 제출 뒤 스캔 요청" 순서인데, 영상은 환자가 방을 나가기 전이고 사건 보고서는 그 뒤라 임상 순서가 거꾸로임(B 참고).
4. **[설계] pair 16 decoy `the stretcher`** — `take the stretcher`가 자연스러운 영어라 `take`의 정답이 둘 → N1.
5. **[사실] slider 2 why** "'We both confirmed'는 두 사람이 **따로** 같은 숫자를 확인한 뒤" — 수술 계수는 두 사람이 **함께 동시에 소리 내어** 셉니다(AORN). 투약 독립 이중 확인(각자 따로)과 섞임 → N7.
6. **[일관성] slider 15 why** "모두 전부 멈추라는 말은 지나쳐요" vs KP 17.0 "hold everything"·swap 17 정답 "hold everything" — 학습자에게 서로 반대로 들림 → N10.

## 고칠 것 — 문장 (keyPhrase 아님 + KP의 ko·words)
문장 en을 바꾸면 `chunks`·`ko`·`words`를 함께 바꾸고, **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 그 문장을 example로 쓰는 단어의 `example`/`exKo`도 맞추고, `changes-or-count.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 그 문장의 **distractorsKo 둘을 새 ko에 맞춰 다시** 쓰세요.

- **S1 ★[안전] 12.4** · en `We don't just pick up where we left off — we go back to the last verified count.` · chunks `We don't just pick up / where we left off / — we go back / to the last verified count / .` · ko `멈춘 데서 그냥 이어 가지 않고, 마지막으로 확인된 계수로 돌아가요.` · words `[w-pick, w-count]`(**w-leave 뺌** — `left off`는 '남기다'가 아님; w-leave는 10.2·10.4·16.2·16.3에 남음. 상황 12는 서로 다른 단어 10개). v46 전부 새로(지금 why·blank `exactly`·decoy `slowly`는 잘못된 절차를 가르침). w-pick example/exKo를 새 문장으로.
- **S2 ★[역할] 19.4** · en `I'll request the follow-up X-ray the surgeon ordered.` · chunks `I'll request / the follow-up X-ray / the surgeon ordered / .` · ko `집도의가 처방한 후속 엑스선 촬영을 요청할게요.` · words `[w-request, w-xray, w-surgeon]`(w-scan 뺌 — w-scan은 14장 바코드 스캔에 남음; 상황 19는 서로 다른 단어 15개). v46 전부 새로(지금 distractorsKo "안내문/동의서를 요청"·decoy `a follow-up lunch`는 새 문장에 안 맞음). w-request example/exKo 맞춤.
- **S3 ★[안전·과장] 17.4** · en `We limit movement in the room until the needle turns up.` · chunks `We limit movement / in the room / until the needle / turns up / .` · ko `바늘이 나타날 때까지 방 안의 움직임을 줄여요.` · words `[w-movement, w-needle, w-turn]`(w-stop 뺌 — 12.3에 남음). v46 전부 새로(지금 distractorsKo "교대가/의사가 올 때까지 멈춰요"도 같은 과장). w-movement·w-turn example/exKo 맞춤.
- **S4 [ko] 15.3** ko `잠깐요 —` → `멈춰 주세요 — 해결될 때까지 닫을 수 없어요.`(`Please hold`는 '잠깐만요'가 아니라 진행을 멈추라는 요청; w-hold ko `보류하다`와도 맞춤) + distractorsKo 둘 다시. slider 15 exKo, order 15 3줄 ko도 같은 말로.
- **S5 [ko] 17.3** ko `방 구석구석을 조심스럽게 확인해요.` → `방 구석구석을 꼼꼼히 확인해요.`(수색의 carefully는 '빠짐없이'; '조심스럽게'는 살살 다룬다는 뜻) + distractorsKo 둘 다시. W10과 같이.
- **S6 [사실·ko] 14.3** ko `쓰레기통에 들어가기 전에` → `수거통에 들어가기 전에 거즈마다 스캔해요.` — 쓴 거즈는 최종 계수가 끝날 때까지 버리지 않고 킥 버킷→거즈 계수 주머니에 모아 둡니다. distractorsKo 둘 다시. W11과 같이.
- **S7 [청크·ko] 13.4** chunks `Let's both look / at the tray / at the same time / .`(`at the same / time` 끊김) · ko `같은 시간에` → `둘 다 동시에 쟁반을 봐요.` + distractorsKo 둘 다시. 청크가 바뀌니 decoy가 새 청크 자리에 맞는지도.
- **S8 [청크] 구 경계 끊김(비KP)** — en 그대로 chunks만(decoy 자리 확인):
  - 1.3 `Please confirm / each sponge / as I call it out / .`(`as I call / it out` — 구동사 끊김)
  - 5.4 `Everything needs / to be accounted for / now / .`(`to be accounted / for now` — `for now`(당분간)로 잘못 읽힘)
  - 15.4 `I'm calling / a discrepancy / — we're one short / .`(`— we're one / short` 끊김)
- **S9 [태그] 오태그·쉬운 말**
  - 18.3 words에서 **w-add 뺌** — `don't add up`(맞아떨어지다)은 카드의 '추가하다'가 아님. w-add는 6.0에 남음. 상황 18은 14개.
  - 1.0(KP) words에서 **w-loud 뺌**(W6). 상황 1은 8개(V3 유지).
  - 13.3 words에서 **w-eye 뺌**(W7). 상황 13은 10개.
  - 20.3 words에서 **w-late 뺌**(W9의 run late 채택 시). 상황 20은 15개.
- **S10 (낮음) [ko·KP]** 1.0 ko `소리내어` → `소리 내어 하나씩 세요.`(띄어쓰기; 상황 제목은 그대로) · 3.1 ko `자석 위로 돌아가요`(번역투) → `바늘은 세기 위해 전부 자석 패드에 다시 꽂아 둬요.` 각 distractorsKo 둘 다시, w-magnet exKo·order 3의 2줄 ko 맞춤.

## 고칠 것 — 단어
- **W1 ★ w-protocol** dEn `procedure` — "following the procedure for a retained item"이 같은 뜻으로 성립(정답 둘) → `propofol`(같은 분야, 같은 길이).
- **W2 ★ w-open**(동사) dEn `oven`(명사)·`often`(부사) → `[own, omit]`.
- **W3 ★ w-check**(동사) dEn `chest`(명사) → `chase`.
- **W4 w-match**(동사) dEn `batch`(주로 명사) → `patch`.
- **W5 w-aloud**(부사) dEn `allowed`(과거분사 — 품사 다른 동음어는 decoyChips 몫) → `around`. decoyChips `lord` → `load`.
- **W6 ★ w-loud 삭제** — ko `큰 소리로`는 `out loud`(소리 내어)의 뜻이 아니고, 같은 뜻은 w-aloud가 가르침. 1.0 태그를 빼면(S9) 어느 문장도 태그하지 않으니 word-remove. **slider(상황 1) `words: [w-loud, w-count]` → `[w-count]`**(V15).
- **W7 w-eye 삭제** — `eye/눈`은 간호사가 아는 말(hand를 뺀 기준과 같음). `two sets of eyes`는 pair 13에서 구로 계속 가르침. 13.3 태그 뺌(S9) → word-remove. **pair 13 `words`에서 w-eye 뺌**.
- **W8 w-miss 헤드워드** — 문장은 `is still missing`, ko `없어진`은 형용사 뜻 → en `missing` · ipa `/ˈmɪsɪŋ/` · chips `[[miss, ing]]` · decoyChips `[mess, ion]` · dEn 그대로(`mixed`·`messy`, 형용사) · example 11.3 그대로. id 그대로, changes에 en·ipa.
- **W9 구동사 헤드워드**(ko가 구의 뜻이라 낱말만으론 틀림; 결정 11 "구 단위"). id 그대로, changes에 en·ipa(·ko):
  - w-rule `rule` → `rule out` · ipa `/ˌruːl ˈaʊt/` · chips `[[rule], [out]]` · dEn `[roll out, rub out]` · decoyChips `[role]`.
  - w-turn `turn` → `turn up` · ipa `/ˌtɝn ˈʌp/` · chips `[[turn], [up]]` · dEn `[turn in, tune up]` · decoyChips `[torn]` · example = S3 새 문장.
  - w-pick `pick` → `pick up` · ipa `/ˌpɪk ˈʌp/` · chips `[[pick], [up]]` · dEn `[pick out, pack up]` · decoyChips `[pink]` · cue는 W14 · example = S1 새 문장.
  - w-run `run` → `run late` · ipa `/ˌrʌn ˈleɪt/` · chips `[[run], [late]]` · dEn `[run low, run out]` · decoyChips `[rung]`. 이때 **w-late는 20.3 태그를 빼고 삭제**(S9; 같은 문장에서 같은 말을 두 카드가 가르침), **slider(상황 20) `words`에서 w-late 뺌**.
  - (선택) w-account `account` → `account for`(태그 4문장 모두 account for). 바꾸면 chips `[[ac, count], [for]]`·dEn `[accuse of, accept for]`는 어색하니, 수정 담당이 자연스러운 짝을 못 찾으면 그대로 둬도 됨.
- **W10 w-careful** ko `조심스럽게` → `꼼꼼히`(S5와 같이), dKo `[서둘러, 대충]` 그대로(길이 통과), exKo 맞춤.
- **W11 w-bin** ko `쓰레기통` → `수거통`, cue `다 쓴 거즈를 넣어 버리는 통` → `다 쓴 거즈를 버리지 않고 모아 두었다가 세는 통`, exKo는 S6 새 ko.
- **W12 (낮음) w-board** ko `게시판`(공지 붙이는 판) → `화이트보드`. 바꾸면 0.4·4.0(KP)·4.4·6.4·14.2(KP) 문장 ko와 distractorsKo, exKo, slider 4·14 관련 문구도 함께 — 수정 담당 판단.
- **W13 decoyChips(조각 맞추기에 실제로 나오는 여러 조각 단어만)**:
  - ★ w-begin `gun`(무기) → `gan` · ★ w-number `bar`(술집, ICU 검토 선례) → `bur`
  - (낮음) w-resolve `soul` → `sole` · w-magnet `nut` → `not` · w-discrepancy `creep` → `crop` · w-surgeon `gone` → `gown` · w-separate `rite` → `rote`
  - (참고) w-begin 정답 조각 `gin`(술) — 정답 조각이라 그대로 둬도 되지만 바꾸려면 chips `[[begin]]` 한 조각.
- **W14 cue가 ko 되풀이 — 장면으로**(정답 영어 없음):
  - w-before `봉합·시작·인계보다 앞서 끝내야 하는 때를 말할 때`
  - w-begin `초기 계수를 마친 뒤 "이제 시작합시다"를 조금 격식 있게`
  - w-incision `집도의가 칼을 대기 직전 — 그보다 먼저 초기 계수가 끝나야 하는 순간`
  - w-check `쟁반 위 기구를 눈으로 하나씩 훑으며 이상 없는지 볼 때`
  - w-correct `두 사람이 센 숫자가 기록지와 들어맞아 집도의에게 보고할 때`
  - w-account `쓴 바늘이 하나도 빠짐없이 어디 있는지 다 맞췄다고 할 때`
  - w-verify `상대가 센 숫자를 기록지와 대조해 틀림없다고 확정할 때`
  - w-closure `계수가 다 맞아야 집도의가 실을 잡을 수 있는 마지막 단계`
  - w-field `멸균포로 둘러싼 안쪽 — 새 거즈는 여기 들어가기 전에 기록함`
  - w-recount `교대·중단·불일치 뒤 숫자를 믿을 수 없을 때 하는 일`
  - w-shake `접힌 소독포를 쥐고 털어 끼어 있는 거즈를 떨어뜨리는 동작`
  - w-finalize `수색까지 끝내고 계수를 최종 숫자로 확정할 때`
  - w-miss(missing) `바늘 반쪽은 찾았는데 나머지 반쪽이 아직 안 보일 때`
  - w-restart `응급이 가라앉은 뒤 끊겼던 계수를 확인된 지점부터 다시 돌릴 때`
  - w-stop `응급 상황이 터져 하던 계수가 중간에 끊겼을 때`
  - w-pick(pick up) `끊긴 일을 그 자리에서 이어 가는 구동사 — 계수에서는 확인 없이 쓰면 안 됨`
  - w-aloud `상대가 듣고 확인할 수 있게 숫자를 입 밖으로 내며 셀 때`
  - w-dual `두 사람이 짝을 이뤄 함께 세는 계수 방식 앞에 붙는 말`
  - w-xray `닫기 전 몸 안에 거즈가 남았는지 방사선으로 찍어 볼 때`
  - w-radiology `찍은 영상을 판독해 "안에 남은 게 없다"고 답해 주는 부서`
  - w-reopen `봉합 뒤 계수가 틀려, 이미 닫은 부위를 다시 벌려야 할지도 모를 때`
  - w-surgeon `계수가 틀리면 가장 먼저 알려야 하는, 수술을 이끄는 사람`
  - w-possible `판독 전이라 아직 확정할 수 없는 잔류를 기록할 때 붙이는 말`
  - w-protocol `잔류 이물이 의심될 때 병원이 정해 둔 단계를 그대로 밟을 때`
  - w-skip `늦었다고 계수를 빼고 넘어가자는 압박에 "그건 안 돼요"라고 할 때`
- **W15 (낮음) w-restart** dKo `[다시 끝내다, 다시 멈추다]`(어색한 한국어) → `[다시 정리하다, 다시 기록하다]`.
- **W16 (낮음) w-interrupt** ko `방해하다` → `중단시키다`(문장 12.2는 "중단됐다"). dKo `[도와주다, 보조하다]` 그대로(길이 통과).
- **W17 (낮음) w-shake** ko `흔들다` → `털다`(문장은 shake out = 털어 내다). dKo `[찢다, 접다]` 그대로.

## 고칠 것 — 뉘앙스
- **N1 ★ pair 16** decoys `[the stretcher]` — `take the stretcher`가 성립 → `[an incision]`(take·rule out·call 어디에도 안 붙음).
- **N2 pair 0·13 decoy** — 세 pair가 모두 `the stretcher`라 낱말만 보고 걸러짐. pair 0 → `[the monitor]`, pair 13 → `[a pause]`(각 왼쪽 말 전부와 이어 봐도 성립 안 함).
- **N3 context 7(recount) → 핸드오프 모양 아님** — 어색한 장면("Dr. Chen, I'll need you to recount the sponges")은 듣는 사람에게 말투가 안 맞는 게 아니라 역할(집도의는 세지 않음)이 틀린 것이고, recount는 일반인도 아는 말. **swap으로 교체**: `words: [w-count, w-together, w-before]` · who `교대 간호사 → 순환 간호사 · 넘겨받기 전` · icon `speech` · before `["Let's do ", "a quick look", " together before I take over."]` · options `[a full count, a quick look, a rough tally]` · answer `a full count` · notes `{a full count: "교대 때는 둘이 함께 전부 세어 확인한 뒤 넘겨받는다.", a quick look: "훑어보기는 계수가 아니라 빠진 물품을 놓친다.", a rough tally: "어림셈은 계수 기록이 될 수 없다."}` · why `교대 간호사는 숫자를 전해 듣거나 훑어보는 데서 그치지 않고, 넘겨받기 전에 함께 전부 세어요.` · ko `제가 넘겨받기 전에 전체 계수를 함께 해요`. (STEP 2 최솟값은 swap으로 유지)
- **N4 context 0(incision)** — incision은 환자도 수술 안내·퇴원 교육에서 늘 듣는 말이라 '듣는 사람에게 안 맞는 말'이 아님. word를 `baseline`(`ko: 기저치`, `words: [w-baseline]`)로: 장면 en(who·icon·ok 그대로) ① `Let's get the baseline count before the incision.` ② `Baseline count correct x2 at 0905.` ③(불안한 환자, ok=false) `We're doing a baseline count before your surgery.` · fix `We count all our supplies before your surgery starts, to keep you safe.` · why `baseline count는 이후 계수의 비교 기준이 되는 첫 계수를 가리키는 팀 안의 말이에요. 환자에게는 낯선 업무 용어라, 물품을 모두 세어 안전을 지킨다고 쉽게 풀어요.`
- **N5 context 19(incident)** fix `The surgeon will talk with you about what we found.`는 같은 뜻을 쉽게 바꾼 게 아니라 화제를 돌림 → fix `Something unexpected came up during your surgery, and your surgeon will explain it to you.`(같은 뜻·집도의 공개 원칙). why 그대로.
- **N6 context 16(retained)** fix `We took a picture to make sure nothing was left behind.` — `picture`는 무엇을 찍었는지 흐림(엑스선은 환자도 아는 말) → `We took an X-ray to make sure nothing was left behind.`
- **N7 ★[사실] slider 2 why** "두 사람이 따로 같은 숫자를 확인한 뒤" → "두 사람이 함께 소리 내어 세어 같은 숫자를 확인한 뒤".
- **N8 slider 4 순서** — 약함→강함이 `board → told → documented`인데, 말로만 전한 것이 보드에 적은 것보다 가벼움. scale `[I told the team the count, I wrote it on the board, I documented it in the record]` · answerAt `1` · why `말로만 전하면 남지 않고, 정식 기록은 아직 필요 없어요. 모두가 볼 수 있게 보드에 적어 두는 것이 지금 맞아요.`(정답 칸 분포 0:5·1:8·2:5)
- **N9 slider 7 example** — 정답은 `Count everything with me`인데 example이 가운데 보기 문장(7.1 "Show me the current totals…") → example `Let's do a full count together before I take over.` · exKo `제가 넘겨받기 전에 전체 계수를 함께 해요.`
- **N10 ★[일관성] slider 15 why · swap 17 notes** — slider 15 why 끝 "모두 전부 멈추라는 말은 지나쳐요" → "'Everyone stop everything'은 마취·지혈 같은 환자 처치까지 멈추라는 말로 들려요 — 멈출 것은 봉합이에요." swap 17 notes `hold everything` → "봉합과 방 밖으로 나가는 물품을 멈추고 수색에 집중한다(환자 처치는 계속한다)."
- **N11 swap 4** 보기 `about the time` → "I always note about the time of each count"는 비문이라 문법으로 걸러짐 → `the approximate time`(before[1]·notes 키도 같이). notes `the approximate time: "어림 시각은 어느 계수 사이에 일이 있었는지 가리지 못한다."`
- **N12 swap 11** 보기 `the rest is likely fine` → "…the rest is likely fine before we close."가 어색 → `we only need the big half back`(notes 키·문구 "큰 조각만 찾으면 작은 끝이 몸 안에 남는다.").
- **N13 swap 6 who** `순환 간호사 → 스크럽` — 새 포장을 열어 필드에 내주는 쪽은 보통 순환 간호사 → `스크럽 → 순환 간호사 · 새 포장을 열 때`.
- **N14 (낮음) slider 9** 가운데 보기 `Count each piece twice`는 강도 단계가 아니라 다른 행동 → `Recount the parts now`.

## keyPhrase 사용자 결정 필요 (en은 고치지 않음)
| | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| K1 | 17.2 `Nobody moves until we find it.` | 전원 정지로 읽힘. 실제는 방에서 아무것도(쓰레기·린넨·물품) 나가지 않게 하고 출입을 줄임 — 마취·지혈은 계속 | `Nothing leaves the room until we find it.` | **바꾸기**(words `[w-find]` 그대로; v46 필드·order 17 2·3줄도 함께) |
| K2 | 12.0 `Once things settle, we restart the count from a known point.` | "known point"가 어디인지 모호하고 12.1 "recount everything"과 긴장 | `Once things settle, we restart the count from the beginning.` | **유지**(마지막으로 확인된 계수로 읽으면 맞음; S1을 고치면 같은 상황 안 충돌이 풀림) |
| K3 | 16.0 `Let's get an X-ray before we close.` · 18.1 `Let's image before deciding on re-exploration.` · 18.0 `…we may need to reopen.` | 영상·재개방 결정은 집도의 — 지시처럼 읽힐 수 있음 | (16.0) `Should we get an X-ray before we close?` | **유지** — 간호사의 제안으로 자연스럽고, slider 16 why가 "결정은 집도의"를 이미 말함. order 18 4줄 "we decide together"만 B가 "the surgeon decides"로 |
| K4 | 10.1 `Shake out the drapes before we finalize the count.` | 환자를 덮은 멸균 소독포를 수술 중 터는 것은 표준 절차라기보다 불일치 수색·수술 뒤 반출 전 확인에 가까움 | `Check the drape folds before we finalize the count.` | **유지**(판단 낮음 — 바꾸면 w-shake 삭제, slider 10·swap 10 재작성 필요) |
| K5 | 20.2 `I won't sign off until the count is correct.` | 저작자: 상급 보고 없이 단독 거부 | — | **유지** — '맞지 않은 계수를 맞다고 서명하지 않는다'는 뜻이라 맞음. 상급 보고는 같은 주제 18.2·19.2가 가르침 |

KP chunks 끊김(보고만): 8.1 `has the radiopaque / marker` · 9.1 `All / the small parts` · 15.1 `We're one sponge / short` · 17.1 `the field, / drapes, and floor` · 17.2 `until we find / it` · 19.0 `— I'm documenting / it` · 20.1 `document and resolve / this properly`.

## 저작자가 짚은 것 — 판정
- **12.4 "We pick up exactly where we left off."** — 틀림(S1). 12.0·12.1(KP)은 서로 모순 아님(K2).
- **19.4 "Please request a follow-up scan"** — 고침(S2, 집도의 처방을 요청하는 말로).
- **"Nobody moves until we find it."** — 관행보다 강함 맞음 → K1(바꾸기 권고), 같은 뜻의 17.4는 S3.
- **영상·재개방을 간호사 제안으로** — 16.0·18.0·18.1은 제안으로 읽히고 why가 결정권을 바로잡으니 유지(K3). 19.4만 고침.
- **loud/aloud 같은 ko** — loud의 ko가 틀렸고 aloud가 같은 뜻을 가르치니 w-loud 삭제(W6).
- **exact·manual·safe 품사 혼재** — exact는 태그된 문장(3.4·4.3)이 모두 형용사라 혼재 아님. manual(14.0 부사·14.1 형용사)·safe(12.1 형용사·20.4 부사)는 섞여 있어 결정 11 조건(전부 부사)에 안 걸림 → 그대로.
- **숫자 낱말 number·twice·half·total·short** — 계수 어휘라 유지 동의.
- **새 단어 w-done** — 쉬운 말이지만 빼면 상황 3이 7개(V3 미달)라 유지 가능(낮음). 더 나은 대안: 3.2(KP)·1.4의 `move on`(다음으로 넘어가다)을 새 단어로 태그하고 w-done을 빼는 것 — 수정 담당 판단.
- **헤드워드 부사화 4개**(systematically·carefully·immediately·properly) — 태그 문장이 전부 부사라 타당. 다만 carefully의 ko는 W10.
- **6.0 "Ten additional sponges"** — 예시 수치로 읽히고 10장 묶음도 흔함 → 그대로.
- 쉬운 말 더 빼기(show·wait·find·write·open·before 등)는 1할 원칙과 V3(상황 3) 때문에 이번엔 권하지 않음.

## B에 넘길 것(order·문장 낱장 — A 범위 밖, 같은 사실 문제)
- order 12 4줄 `From there, we pick up exactly where we left off.`·why "멈춘 바로 그 지점부터 이어 가요" — S1과 같은 문제.
- order 17 2·3줄 `Nobody moves…`·`While everyone stays still…` — K1·S3와 같은 문제.
- order 19 4줄 `Please request a follow-up scan … once it's filed.` — 영상은 사건 보고서 뒤가 아니라 환자가 방을 나가기 전. S2 문장에 맞춰 순서·문장 재작성.
- order 18 4줄 `Once he's back in the room, we decide together.` — 재개방 결정은 집도의.
- order 15 3줄 ko `잠깐요` — S4와 같이.

## 종합
고칠 것 **41건**(문장 S 10 · 단어 W 17 · 뉘앙스 N 14, 낮음 포함; 그중 **안전 3**: S1·S3·S2(역할), 사실·일관성 N7·N10) + B에 넘길 order 5건 + KP 결정 5건(K1 바꾸기 권고). 문장 세 개(12.4·17.4·19.4)와 pair 16 decoy·slider 2·15 why를 고치면 내보내도 됩니다. why·notes의 계수 관행 설명은 대체로 정확합니다.
