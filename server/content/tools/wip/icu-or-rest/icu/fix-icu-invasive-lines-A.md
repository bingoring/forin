# fix-icu-invasive-lines-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번)

대상: `icu-invasive-lines.yaml`(A·B 합친 파일, 단어 277 · 상황 21 · 문장 105). 비교: base·changes(104건 — sentence 29 · word 58 · word-remove 17)·in·notes A.
뉘앙스: slider 21 · context 21 · swap 5 · pair 0 · reel 0.
스크립트(작업 폴더): `_rvA_icu-invasive-lines.py`(words/sent/nu 덤프, swap 이어 읽기, pair 전 조합), `_rvA_icu-invasive-lines_chk.py`(decoyChips 재조립·거슬리는 조각·중복, cue 영어·ko 되풀이, 상황별 단어 수, context 모양). 덤프: `_rvA_icu-invasive-lines_words.txt`·`_sent.txt`·`_nu.txt`.

기계 확인 결과:
- 오답 길이 규칙(1.25배·3자) 위반 0(distractorsEn·distractorsKo 모두).
- decoyChips 재조립 0. 중복 decoy 1(`w-gauze` `[gaze, gaze]`).
- cue 영어: `mmHg`(pressure)·`1m`(centimeter)·`A·B·O`(type) — 단위·기호라 문제 없음. cue가 ko를 그대로 담은 것 15(아래 C절).
- **pair 0개 — 전 조합 확인 해당 없음.**
- 상황별 서로 다른 단어 14~23(V3 여유 있음, 가장 적은 상황 14 = 상황 14).
- context 21개 모두 `word`·`ko`·장면 3·`ok:false` 1, `word`가 세 장면 `en`에 다 있음. 다만 듣는 사람 갈래가 겹친 것 1(context 0), 어색한 말이 `word`가 아닌 것 8(아래 D절).
- swap 5개 이어 읽기: 문법 틀린 것 0. swap `ko` 5개 모두 바꾼 문장의 뜻과 맞음.
- chunks: keyPhrase 아닌 문장에서 구 경계를 끊은 것 4(0.4·3.3·8.4·16.3), keyPhrase 5(보고만, E절).

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 소리·철자가 닮은 오답은 대체로 좋음. 품사가 다른 오답이 많고(★ 40개 남짓), 정답으로도 맞는 오답 4(`embolus`·`re-inflate`·`letting go`·`dependant`), 없는 말 2(`order-in`·`nero`), 술 이름(`rum`·`wine`) |
| 2 distractorsKo·길이 | 4 | 길이 위반 0. 정답의 다른 뜻이나 근처 뜻을 오답에 넣은 것 5(`reserve` 따로 보관하다, `walk` 안내해 데려가다, `phlebostatic axis` 겨드랑이선, `balloon` 주머니, `moment` 한때) |
| 3 cue | 4 | 정답 노출 없음. ko를 되풀이한 cue 15개. `phlebostatic axis` cue "가슴 위"는 위치가 틀림(가슴 옆, 중액와선) |
| 4 chips/decoyChips | 3 | 재조립 0. 거슬리는 조각 `tart`×2·`rum`·`wine`·`death`·`bury`/`burier`·`moan`·`rotic`(erotic처럼 들림)·`lick`. 중복 1 |
| 5 뉘앙스 사실 | 4 | why는 미국 ICU 관행에 대체로 맞음(최대 멸균 차단, 감쇠 시 수축기는 낮게·이완기는 높게, 엑스레이가 위관 위치 확인의 기준, 풍선은 잴 때만, 좌측와위·트렌델렌부르크, 세 면 테이프, "지침·처방대로"). 다만 slider 0의 cue가 why와 모순되고(모자가 빠짐), 문장 7.3·10.4는 사실 오류·업무 범위 밖 |
| 6 뉘앙스 설계 | 3 | slider 16 순서가 틀렸고(`a trace of blood`가 맨 끝), 7은 칸 둘이 같은 말로 읽히며, 18은 한 축이 아님. context 8개는 어색한 말이 `word`가 아니라 같은 장면의 다른 전문어(`pressure`·`drip`·`pulse`·`wound`·`dressing`·`position`·`blood loss`·`sterile`). context 0은 환자(ok)와 가족(✕)으로 듣는 사람 갈래가 같음 |
| 7 결정 11 | 4 | 변경 104건은 대체로 타당. 원형화 44건은 과하지 않음(아래 F절). 빠진 것: `letting up`·`antibiotics` 원형화, 구동사 헤드워드 3(`lay`·`map`·`walk`), 쉬운 말 `need`·`wait`·`help`, 문장 ko `멸균 시야`(0.0·5.4) |

## 사실 오류·심각한 문제

1. **[안전] 10.4** `I'll pull the catheter back an inch and recheck the trace.` — PA 카테터를 당기는 것은 의사, 또는 병원 정책상 자격을 갖춘 간호사만 할 수 있습니다. 간호사가 혼자 판단해 당기는 말로 가르치면 안 됩니다. 저작자 지적이 맞습니다. (A1)
2. **[안전] 7.3** `A damped trace can hide how low his pressure really is.` — 방향이 반대입니다. 과도 감쇠는 수축기를 **낮게**, 이완기를 높게 보여 줍니다(같은 상황 slider 7 why도 그렇게 말함). "낮은 혈압을 감춘다"고 가르치면 감쇠된 파형의 낮은 수치를 실제보다 더 낮다고 읽어 승압제를 불필요하게 올릴 수 있습니다. (A2)
3. **slider 0** — why는 "모자·마스크·멸균 가운·장갑·큰 방포가 전부 갖춰져야 하고, 하나라도 빠졌으면 partly ready"라고 하는데, cue에는 모자가 없습니다. why대로라면 정답은 `fully ready`(answerAt 2)가 아니라 `partly ready`가 됩니다. example `…so we can start.`는 같은 상황 KP 0.2(시작 전 타임아웃)를 건너뜁니다. (N1)
4. **slider 16** scale `[a little blood, significant blood loss, a trace of blood]` — 약함→강함 순서가 아닙니다(`a trace`가 가장 약함). (N2)
5. keyPhrase 20.1 `…I'm activating the rapid response.`(ICU는 신속대응팀을 부르는 곳이 아님), 18.2 `…I'm calling the code team.`(맥박이 있으면 코드가 아님), 9.2 `I'll milk the tubing gently…`(흉관 훑기는 지침·처방으로 제한) — **사용자 결정 필요**(E절).

## 고칠 것

[안전]을 붙인 것이 안전 항목입니다. 문장을 새로 쓰면 **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 2·blank)를 전부 새로 쓰고**, 바뀐 `words`는 `changes-icu-invasive-lines.yaml`에 적으세요. 그 문장이 어떤 은행 단어의 `example`·`exKo`나 뉘앙스의 `example`이면(딸린 것) 그것도 새 문장으로 바꿉니다. 문장 `ko`만 고쳐도 `distractorsKo` 둘을 새 ko 틀에 맞춰 다시 씁니다. 같은 내용이 그 상황 `order` 줄에 있으면 B 검토와 맞춰 그 줄도 고칩니다.

### A. 문장 (keyPhrase 아님, 또는 keyPhrase의 ko만)

1. **[안전] PA 카테터 파형·관리 10.4** — 업무 범위 밖(위 1).
   - en: `I'll call the physician to pull the catheter back, then recheck the trace.`
   - ko: `의사에게 카테터를 당겨 달라고 연락하고, 파형을 다시 확인할게요.`
   - chunks: `I'll call the physician / to pull the catheter back, / then recheck / the trace / .`
   - words: `[w-call, w-physician, w-pull, w-catheter, w-recheck, w-trace]`. `w-inch`는 이 문장에만 쓰여서 은행에서 지움(word-remove). 상황 10 단어 17 → 18. v46 필드 전부 새로. distractorsKo는 부를 사람·확인할 대상이 아닌 쪽(예: "연락하고"→"문자로 알리고")으로, 당기는 동작 자체를 간호사가 하는 말로 바꾸지 말 것.
   - 딸린 것: `w-pull`·`w-recheck` example·exKo(지금 이 문장). order 10에 같은 줄이 있으면 B와 맞출 것.
2. **[안전] 동맥관 파형 이상 문제해결 7.3** — 감쇠 방향이 틀림(위 2).
   - en: `A damped trace can make his systolic read falsely low.`
   - ko: `감쇠된 파형은 수축기 혈압을 실제보다 낮게 보이게 할 수 있어요.`
   - chunks: `A damped trace / can make / his systolic / read falsely low / .`
   - words: `[w-damped, w-trace, w-low]`. `w-hide`는 이 문장에만 쓰여서 지움, `w-pressure` 태그 뺌(다른 문장에 남음). 상황 7 단어 18 → 16. v46 필드 전부 새로.
   - 딸린 것: `w-damped`·`w-hide`·`w-low` example(`w-low` example을 새 문장으로).
3. **중심라인 삽입 중 기흉·혈흉 위기 15.4** ko — 번역 오류. `where you want it`은 "키트를 어디에 둘지"인데 ko는 "어디로 넣을지"입니다.
   - ko → `감압 키트 가져왔어요, 어디에 둘지 말씀해 주세요.` distractorsKo 둘을 새 틀로.
4. **중심정맥관 삽입 보조·준비 0.0(KP, ko만)·장치 제거 보조 준비 5.4** ko — `sterile field`는 멸균 영역입니다. `시야`는 틀린 뜻이고, 저작자도 `w-field` ko에서 같은 이유로 고쳤습니다.
   - 0.0 ko → `동의서 확인했고, 멸균 영역도 준비했어요.`
   - 5.4 ko → `필요한 건 다 멸균 영역에 늘어놓았어요.`
   - distractorsKo 둘씩을 새 틀로.
5. **동맥관 삽입 보조·영점 1.0(KP, ko만)** — `w-phlebaxis` ko를 고치면(B절 1) 문장 ko도 `트랜스듀서를 정맥정역학축에 맞춰 수평 잡고 영점 조정할게요.`로. distractorsKo 둘 새로.
6. **중심라인 삽입 중 기흉·혈흉 위기 15.1(KP, ko만)** — `흉관을 부를게요`가 어색함(흉관은 부르는 대상이 아님).
   - ko → `지금 바로 바늘 감압과 흉관 삽입을 요청할게요.` distractorsKo 둘 새로.
7. **라인 관련 대량출혈·혈종 위기 20.2(KP, ko만)** — `수혈도 오는 중이어야 해요`가 어색함.
   - ko → `응고 검사와 혈액형·교차시험이 필요하고, 혈액도 바로 받아야 해요.` distractorsKo 둘 새로.
8. **라인 개방 공기색전 위기 18.0(KP, ko만)** — en은 명령형(`Place him…`)인데 ko는 `눕힐게요`(제가 하겠다)로 화법이 다름.
   - ko → `지금 바로 좌측 측와위 트렌델렌버그 체위로 눕혀 주세요.` distractorsKo 둘 새로.
9. **중심라인 삽입 중 합병증 감시 6.3** ko — `call it out`은 "바로 말하다"인데 `소리쳐`가 지나치게 셉니다. ko → `뭐든 바뀌는 순간 바로 말씀드릴게요.` distractorsKo 둘 새로. (선택)
10. **chunks 0.4** `, but he can / still breathe fine` — 조동사와 본동사를 끊었고 쉼표로 조각이 시작함. → `I told him / the drape will cover / his face, / but he can still breathe fine / .`
11. **chunks 3.3** `I'll walk you / through each chamber / before we adjust / anything` — 구동사 `walk through`와 `adjust anything`을 끊음. → `I'll walk you through / each chamber / before we adjust anything / .`
12. **chunks 8.4** `isn't from him / breathing` — 동명사구 `him breathing`을 끊음. → `This much bubbling / isn't from / him breathing / — it's a leak / .`
13. **chunks 16.3** `and set it / back up` — 구동사 `set it back up`을 끊음. → `Someone grab / a fresh pressure bag / and set it back up / .`

판정만(고치지 않음):
- 16.4 `…but I want two large-bore IVs.` — 유지. 굵은 말초 정맥로를 잡는 것은 ICU 간호사 업무 범위이고, 수혈·수액은 처방이 정합니다. why가 "처방대로"를 말하면 충분합니다.
- 12.4 `I'll hold feeds until we confirm…` — 유지. 위치를 확인하기 전 급식 보류는 간호사가 할 수 있는 안전 조치입니다.
- 2.1 `I flushed each port…`(KP) — 유지. 용액·빈도가 지침을 따른다는 것은 사실 오류가 아닙니다.

### B. 단어

1. `w-phlebaxis` — ko `정맥정수압축`은 쓰이는 번역으로 보기 어렵습니다. → `정맥정역학축`(국내 중환자 간호 자료에서 쓰는 번역으로 보임, 확신 중간 — 사용자가 다른 용어를 정해 두었으면 그것으로). distractorsKo `겨드랑이선`은 정답의 한 부분(중액와선)과 겹칩니다 → `쇄골중앙선`. cue `가슴 위 기준 지점` → `가슴 옆, 네 번째 갈비뼈 사이 높이의 기준 지점 — 영점 맞출 때 센서를 대는 곳`.
2. `w-gauze` decoyChips `[gaze, gaze]` 중복 → `[gaze, cause]`.
3. 거슬리는 조각(술·성적·장례):
   - `w-start` decoy `tart` → `[star, stare]`; `w-restart` decoy `tart` → `[star, rest]`
   - `w-run` distractorsEn `rum`(술) → `[rub, ruin]`, decoy `[rum, rung]` → `[rung, ran]`
   - `w-wire` distractorsEn `wine`(술) → `[wing, tire]`, decoy `[wine, wide]` → `[wing, wide]`
   - `w-breath` decoy `death` → `[bath, bread]`
   - `w-barrier` distractorsEn `burier`(묻는 사람)·decoy `bury` → distractorsEn `[carrier, farrier]`, decoy `[berry, car]`
   - `w-mean` decoy `moan` → `[men, bean]`
   - `w-dicrotic` decoy `rotic`(erotic처럼 들림) → `[dia, crow]`
   - `w-leak` distractorsEn `lick` → `[leaf, lease]`
   - (선택) `w-fresh` decoy `flesh`, `w-culture` decoy `cult`, `w-grab` decoy `crab`, `w-ease` `tease` — 크게 문제는 아니지만 바꾸면 더 깔끔합니다.
4. 정답으로도 맞는 distractorsEn:
   - `w-embolism` `embolus` — `an air embolus`도 맞는 말 → `[emphysema, empyema]`
   - `w-rewedge` `re-inflate` — `Do not re-inflate the balloon`도 맞고 뜻도 같음 → `[re-weigh, re-wind]`
   - `w-letup` `letting go` — `so I'm not letting go`도 맞음 → `[letting in, setting up]`
   - `w-dependent` `dependant` — 같은 말의 다른 철자 → `[dependable, despondent]`
   - (선택) `w-red` `pink` — 부위가 `looks pink`도 그럴듯함 → `[pale, raw]` 정도로
5. 없는 말: `w-order` `order-in` → `[altered, offered]`; `w-zero` `nero` → `[zone, zoom]`(동사로, 아래 품사 표 참고).
6. 정답의 다른 뜻·근처 뜻이 들어간 distractorsKo:
   - `w-reserve` `따로 보관하다`(reserve의 다른 뜻) → `나눠 쓰다`
   - `w-walk` `안내해 데려가다`(walk의 다른 뜻) → `대신 처리하다`(F절의 헤드워드 변경과 함께)
   - `w-balloon` `주머니`(cue가 "얇은 주머니"라 정답처럼 읽힘) → `마개`
   - `w-moment` `한때`(cue가 "아주 짧은 한때") → `한참`
7. 품사가 다른 distractorsEn — 전부 표로(★ = 꼭 바꿀 것). 바꿀 말은 같은 품사로 소리·철자가 닮게.

| id | 정답(품사) | 오답 | 문제 | 제안 |
|---|---|---|---|---|
| w-field ★ | field(명) | filed | 동사 과거 | `[fiend, fold]` |
| w-gown ★ | gown(명) | grown | 형용사·과거분사 | `[crown, clown]` |
| w-start ★ | start(동) | smart | 형용사 | `[stand, stare]` |
| w-cover ★ | cover(동) | clover | 명사 | `[hover, color]` |
| w-arterial ★ | arterial(형) | arteriole | 명사 | `[arteriolar, venous]` |
| w-sharp ★ | sharp(형) | shape, shark | 둘 다 명사 | `[harsh, shabby]` |
| w-document ★ | document(동) | doctrine | 명사 | `[doctor, decorate]`(doctor는 동사로) |
| w-note ★ | note(동) | nose, node | 둘 다 명사 | `[nod, vote]` |
| w-height ★ | height(명) | hate | 동사 | `[weight, sleight]` |
| w-label ★ | label(동) | lapel | 명사 | `[level, ladle]`(동사 ladle) |
| w-blood | blood(명) | bleed | 동사 | `[flood, brood]` |
| w-return ★ | return(명) | retain | 동사 | `[refund, retort]` |
| w-run ★ | run(동) | rum | 명사(술) | B3대로 `[rub, ruin]` |
| w-order ★ | ordered(형) | order-in, border | 없는 말·명사 | B5대로 `[altered, offered]` |
| w-dated ★ | dated(형) | data | 명사 | `[dotted, dazed]` |
| w-dry ★ | dry(형) | dray, drew | 명사·동사 | `[dewy, wry]` |
| w-intact ★ | intact(형) | infect, contact | 동사·명사 | `[infected, inexact]` |
| w-redness ★ | redness(명) | reduce | 동사 | `[readiness, rudeness]` |
| w-warmth | warmth(명) | warmer | 형용사 | `[worth, wealth]` |
| w-swelling | swelling(명) | swelter | 동사 | `[spelling, dwelling]` |
| w-place ★ | place(동) | plate, plane | 둘 다 명사 | `[plait, pace]` |
| w-ask | ask(동) | ark | 명사 | `[assist, bask]` |
| w-hold | hold(동) | hole | 명사 | `[fold, mold]` |
| w-entry | entry(명) | enter | 동사 | `[entity, entree]` |
| w-firm ★ | firm(형) | farm, form | 둘 다 명사 | `[fine, faint]` |
| w-apply | apply(동) | apple | 명사 | `[reply, supply]` |
| w-plan | plan(명) | plain | 형용사 | `[pain, clan]` |
| w-back ★ | back(형·부) | bark, pack | 둘 다 명사 | `[black, aback]` |
| w-check | check(동) | cheek | 명사 | `[chuck, choke]` |
| w-clean | clean(형) | clan | 명사 | `[clear, lean]` |
| w-patent ★ | patent(형) | patient | 명사(환자 — 장면에서 헷갈림은 좋지만 품사 다름) | `[potent, latent]` |
| w-leak | leak(명) | lick | 동사 | B3대로 `[leaf, lease]` |
| w-transition ★ | transition(동) | transaction, translation | 둘 다 명사 | `[translate, transmit]` |
| w-stat ★ | stat(부) | star, slat | 둘 다 명사 | `[stale, stark]`(15.2에서는 형용사로 쓰임) |
| w-concern | concern(명) | conserve | 동사 | `[concert, consent]` |
| w-cough | cough(동) | cuff | 명사 | `[choke, coast]` |
| w-down | down(형) | dawn, gown | 둘 다 명사 | `[dull, done]` |
| w-right | right(명, 오른쪽) | write | 동사 | `[rate, side]` |
| w-advance ★ | advance(동) | advice | 명사 | `[advise, adhere]` |
| w-zero ★ | zero(동) | hero, nero | 명사·없는 말 | B5대로 `[zone, zoom]` |
| w-dependent ★ | dependent(형) | dependant, descendant | 같은 말·명사 | B4대로 `[dependable, despondent]` |
| w-wire | wire(명) | wise | 형용사 | B3대로 `[wing, tire]` |
| w-lift | lift(동) | left, lit | 과거형 | `[lilt, list]` |
| w-collection | collection(명) | collecting | 동명사 | `[selection, collision]`(connection은 은행 단어라 피함) |

(표의 제안은 예시입니다 — 길이 규칙과 은행 안 ko 충돌만 다시 확인하세요. ★ 없는 줄은 바꾸면 좋지만 필수는 아님.)

### C. cue

- ko를 그대로 되풀이한 cue 15 — `w-loop`(고리)·`w-fluid`(액체)·`w-clean`(깨끗한)·`w-breath`(숨)·`w-apply`(붙이다)·`w-lay`(놓다)·`w-sound`(소리)·`w-tube`(관)·`w-deflate`(바람을 빼다)·`w-tip`(끝)·`w-absent`(없는)·`w-side`(쪽)·`w-give`(주다)·`w-grow`(커지다)·`w-letup`(늦추다). 장면(누구에게·언제)을 담아 다시 쓰세요. 예: `w-fluid` "흉관 튜빙의 처진 고리에 고이는 것", `w-tip` "엑스레이로 위 안에 있는지 확인하는 관의 그 부분", `w-letup` "혈종이 커지는 동안 누르던 손을 그러면 안 되는 것".
- distractorsKo가 cue 안에 들어간 것: `w-consent`(설명 — cue "설명을 듣고"), `w-site`(바늘 — cue "바늘이나 관이"). 오답 쪽을 바꾸는 게 쉽습니다(`설명`→`보류`, `바늘`→`방향`).
- `w-phlebaxis` cue 위치 수정(B1).

### D. 뉘앙스

1. **slider 0** — cue에 모자를 넣어 why와 맞춤: `…the cap, mask, gown, gloves and drape are all on.` example·exKo는 시작 전에 타임아웃을 하도록: `Everything is ready — let's do the time-out.` / `다 준비됐어요, 타임아웃부터 할게요.`
2. **slider 16** — scale `[a trace of blood, a little blood, significant blood loss]`, answerAt 2.
3. **slider 7** — `damped`와 `overdamped`는 임상에서 거의 같은 뜻으로 써서 가운데와 끝 칸이 둘 다 맞게 읽힙니다. scale `[crisp trace, slightly damped, overdamped]`, answerAt 2(cue 그대로).
4. **slider 18** `[sighed, gasped, choked]` — 세기 축이 아니라 서로 다른 동작입니다(why도 "달라요"라고 함). scale `[took a deep breath, gasped, gasping for air]`, answerAt 1(cue "sudden, sharp breath in" 그대로)로 하면 한 축이 됩니다.
5. (선택) **slider 19** `a few streaks`와 `blood-tinged sputum`은 세기가 비슷합니다 → `[a few streaks, clots in the sputum, frank hemoptysis]`. **slider 6** cue `Extra beats keep firing every time the wire moves`는 하나씩 튀는 것으로도 읽힘 → `Three or four extra beats in a row every time the wire moves.`
6. **context 0(`sterile`)** — 환자(ok)와 가족(✕)으로 듣는 사람 갈래가 같고, 어색한 말이 `sterile`이 아니라 `bundle protocol`입니다. `word: field`, `ko: 멸균 영역`, `words: [w-field]`로 바꾸고 장면을 셋 다 새로:
   - 의사에게 보고(ok): `The sterile field is set up and the drape is on.`
   - 동료 간호사(ok): `Careful — don't reach over the field.`
   - 가족에게(✕): `Please stay back from the sterile field.` fix `Please stay back from the blue sheets so they stay germ-free.`
   - why: 의료진에게 field는 손대면 안 되는 구역을 가리키는 정확한 말이지만, 가족에게는 무엇을 피하라는 건지 보이지 않아 눈에 보이는 것(파란 천)으로 말해요.
7. 어색한 말이 `word`가 아닌 context — 일반인도 아는 말(`pressure`·`drip`·`pulse`·`wound`·`dressing`·`position`·`blood loss`·`leak`)을 `word`로 골랐고, ok:false 장면이 어색한 것은 같은 문장 속 다른 전문어 때문입니다. 아래처럼 `word`를 장면의 그 전문어로 바꾸고, 세 장면 `en` 모두에 넣으세요(`ko`·`words`도 함께).
   - context 7 `pressure` → `word: damped`, `ko: 감쇠된`, `words: [w-damped]`. 의사(ok) `The trace looks damped, so the pressure may be off.` 동료(ok) `It's damped again — can you check the pressure bag?` 환자(✕) `Your trace is damped right now.` fix 지금 것 그대로.
   - context 13 `drip` → `word: compatible`, `ko: 배합 가능한`, `words: [w-compatible]`. 장면 en의 `incompatible`이 이미 `compatible`을 담으니 장면 그대로 두어도 됨.
   - context 14 `pulse` → `word: distal`, `ko: 원위의`, `words: [w-distal]`. 동료(ok) `Can you check the distal pulse while I hold pressure?` 나머지 둘은 이미 `distal`이 있음.
   - context 17 `wound` → `word: occlusive`, `ko: 밀폐성의`, `words: [w-occlusive]`. 동료(ok) `Hand me the occlusive dressing and the tape.` 환자(✕) `I've put an occlusive dressing over your chest tube site.` fix 그대로.
   - context 4 `dressing` → `word: intact`, `ko: 온전한`, `words: [w-intact]`. 동료(ok) `Is his dressing still intact? The edges looked loose.` 환자(✕) `Your transparent semipermeable dressing is intact.` fix 그대로.
   - context 18 `position` → `word: Trendelenburg`, `ko: 트렌델렌버그`, `words: [w-trendelenburg]`. 동료(ok) `Help me get him into left lateral Trendelenburg.` 나머지 둘은 이미 있음.
   - context 16 `blood loss` → `word: large-bore`, `ko: 굵은 게이지의`, `words: [w-largebore]`. 의사(ok) `Her pressure's holding, but I'd like two large-bore IVs.` 동료(ok) `Grab two large-bore IV kits, please.` 가족(✕) `We're placing two large-bore IVs in her arms.` fix `We're putting in two bigger IVs so we can give fluids and blood quickly if she needs them.` why 새로.
   - context 8 `leak` (약함) → `word: output`, `ko: 배출량`, `words: [w-output]`. 의사(ok) `Output jumped to 200 mL of fresh blood in an hour.` 동료(ok) `Can you mark the output on the canister?` 환자(✕) `Your output just jumped to 200 mL.` fix `More fluid than before is coming out of your tube, so I'm letting your doctor know.` why 새로.
8. swap 5개 — ko·문법·notes 모두 맞음. 고칠 것 없음.

뉘앙스 사실 확인(미국 ICU 관행) — 위 D1~D4 말고는 why·notes가 맞습니다: 최대 멸균 차단 보호구(slider 0), 노치부터 무뎌지는 감쇠(slider 1), 수축기는 낮게·이완기는 높게 보이는 과도 감쇠(slider 7), 증발로 바뀌는 물 흡인(slider 3), 꺾임·막힘·폐 재팽창으로 멈추는 tidaling(slider 9), 잴 때만 부풀리는 풍선(slider 10), 배양 전에 라인 탓으로 단정하지 않기(slider 11), 엑스레이가 위치 확인의 기준이고 급식은 지침·처방대로 보류(slider 12), 세 면 테이프(slider 17), 지침대로 도움을 요청(slider 20). 시키신 대로 CLABSI 번들·매일 필요성 검토·엑스레이 확인 전 중심정맥관 사용 금지·처방대로 라인 제거도 확인했습니다. 어긋나는 why·notes는 없습니다(이 주제에서는 따로 가르치지 않음 — 빠진 것이지 틀린 것은 아님).

## E. keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| 문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 20.1 대량출혈 | His pressure is dropping — I'm activating the rapid response. | 신속대응팀은 ICU 밖 병동 환자를 위한 팀이고, ICU에서는 담당 집중치료 의사·팀을 곁으로 부릅니다. 틀린 관행을 그대로 외우게 됨 | His pressure is dropping — I need the physician at the bedside now. | **바꿈**. `w-activate`·`w-rapid`·`w-response`는 이 문장에만 있어 지우고 `w-physician`을 태그(상황 20 단어 20→18) |
| 18.2 공기색전 | This looks like an air embolism — I'm calling the code team. | 코드는 맥박이 없거나 정지 직전일 때 부릅니다. 맥박이 있으면 의사를 즉시 부르는 것이 먼저입니다(공기색전은 빠르게 무너질 수 있어 틀렸다고 단정하기는 어려움) | This looks like an air embolism — I need the physician here now. | **바꿈 권장(중간)**. `w-code`는 지우고 `w-team`은 19.3에 남음 |
| 9.2 흉관 | I'll milk the tubing gently and reassess. | 흉관 훑기(milking·stripping)는 흉강 음압을 크게 만들어 많은 병원이 일상적으로 하지 않거나 처방이 있을 때만 하게 합니다. chunks `gently and reassess`도 부사를 다음 동사에 붙여 끊음 | I'll check the tubing for clots and kinks and reassess. | **바꿈**. `w-milk`·`w-gently`를 지우고 `w-check`·`w-clot`·`w-kink`(은행에 있음)를 태그 |
| 0.1 멸균 차단 | Full barrier precautions are ready — gown, gloves, mask, drape. | 최대 멸균 차단에는 모자가 들어가는데 빠짐(slider 0 why와 어긋남) | Full barrier precautions are ready — cap, mask, gown, gloves, drape. | 바꿈 권장(약). 안 바꾸면 slider 0 why를 "모자까지"로 남기되 cue는 D1대로 |
| 6.2 엑스레이 | I'll get a post-procedure chest x-ray to rule out pneumothorax. | 간호사가 촬영을 정하는 것처럼 들릴 수 있음 | — | **유지**. 삽입 후 흉부 엑스레이는 표준 처방 세트에 들어 있고, `get`은 "찍게 하다"로 자연스러움. B가 why를 "처방대로 찍고 위치 확인 전에는 라인을 쓰지 않는다"로 쓰면 충분 |
| 12.1 급식 재개 | I'll verify placement with x-ray before restarting feeds. | 재개는 처방·지침을 따름 | — | **유지**. 사실과 맞고 안전한 순서 |
| 19.1 출혈 쪽 아래 | Position her bleeding-side down and call thoracic surgery stat. | 간호사가 혼자 정하는 일인지 | — | **유지**. PA 파열 때 출혈 쪽을 아래로 두어 건강한 폐를 지키는 것은 권장되는 응급 조치이고, 명령형이라 팀 리더의 말로 읽힘 |

keyPhrase chunks(보고만): 9.2 `gently and reassess`(위 표), 14.0 `for at least / five minutes`(`at least five minutes`를 끊음), 17.1 `as I seal / it`(동사와 대명사 목적어), 18.0 `in left lateral Trendelenburg / position now`(명사구), 19.0 `about pulmonary artery / rupture`(명사구).

## F. 결정 11

- **원형화 44건 판정: 과하지 않고 타당합니다.** 복수·3인칭·진행·과거만 원형으로 바꿨고, `ordered`·`bubbling`·`tidaling`·`rigoring`·`dated`·`timed`·`damped`·`kinked`·`smudged`·`inflated`·`protected`·`taped`·`estimated`처럼 형용사로 쓰이는 분사는 그대로 두었습니다(맞음). `w-mark`(marked→mark, ko 표시(하다))·`w-lift`·`w-drop`·`w-shift`·`w-grow`는 ko도 원형에 맞춰 바꿨습니다(맞음). `coags`·`sats`·`PVCs`는 굳은 복수형이라 그대로가 맞습니다.
- 빠진 원형화 2: `w-letup` `letting up` → `let up`(ipa·chips `[[let],[up]]`·distractorsEn `[let in, set up]`·example 맞춤). `w-antibiotic` `antibiotics` → `antibiotic`(`vasopressors`를 원형으로 바꾼 것과 맞춤).
- 구동사 헤드워드 3: 문장은 구동사인데 헤드워드는 동사 하나라 ko가 흐립니다. `w-lay` → `lay out`, ko `늘어놓다`. `w-map` → `map out`, ko `정리해 두다`. `w-walk` → `walk through`, ko `차근차근 설명하다`(distractorsKo B6과 함께). chips·ipa·오답도 맞춤.
- **`w-zero` 태그 유지 — 동의합니다.** 공통 쉬운 단어 목록의 `zero`는 숫자이고, 여기서는 `zero the transducer`라는 ICU 기술 동사라서 구 단위로 가르칠 값이 있습니다. 다만 1.4 `document the zero`는 명사(영점)입니다 — ko `영점을 맞추다`로도 통하니 그대로 둡니다.
- **phlebostatic axis ko** — `정맥정수압축`은 바꾸세요(B1, 문장 1.0 ko 함께).
- 쉬운 말(목록 밖 판단 — 저작자가 지운 `want`·`tell`·`get`과 같은 수준): `w-need`(13.3·17.2·20.2), `w-wait`(19.3), `w-help`(20.4)는 태그를 빼고 은행에서 지웁니다. 상황 13·17·19·20의 단어는 V3를 충분히 넘습니다. (선택: `give`·`ask`·`right`·`start`·`back`·`down`도 쉬운 쪽이지만 같이 쓰는 말(`give oxygen`, `on the right`)로 가르칠 값이 있어 두어도 됩니다.)
- 단어 삭제 17건·태그 빼기 29건 — 타당합니다(`level`·`trace`·`hold`·`run`·`back`·`place`처럼 헤드워드와 쓰임이 다른 문장에서 태그를 뺀 것 포함). `crisp`(sharp와)·`second`(moment와) 삭제와 `verify`·`check`·`trace`·`correlate`·`continuous`의 ko 가름도 맞습니다.

## 종합

고칠 것 **약 70건**(문장 13 · 단어 오답·조각·ko 약 55 · cue 17 · 뉘앙스 13 · 결정 11 7; B절 품사 표의 ★ 26 포함). 그중 **안전 2건**(10.4 PA 카테터 당기기, 7.3 감쇠 방향). 그 밖에 slider 0(why·cue 모순)·slider 16(순서)·context 8개(`word` 고르기)가 설계상 큰 문제입니다. 위 목록을 반영하고 E절 keyPhrase 3개(20.1·18.2·9.2)를 사용자가 정하면 내보내도 됩니다.
