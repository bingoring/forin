# er-peds v46 보강 검토

대상은 `er-peds.yaml`(21상황, 문장 125개, order 21장, context 7건, swap 14건)입니다. 문장 125개와 카드 21장은 전부 스크립트로 뽑아 봤습니다. 빈칸은 선택지 넷을 넣은 네 줄, decoy는 청크 자리마다 바꿔 넣은 줄과 앞뒤에 붙인 줄, order는 인접 교환 세 가지(1↔2, 2↔3, 3↔4)를 출력해 한 줄씩 판정했습니다.
'정답이 둘'은 낱장 머리의 `ko`에도 맞는지로 판정했습니다. 영어로만 성립하는 다른 선택지(0.1 `eating`, 6.1 `sleeping`, 9.1 `eat`, 13.5 `cold` 등)는 `ko`가 가려 주므로 정답이 둘로 치지 않았습니다. 예외는 '오답'으로 보이는 말이 실제로는 위험 신호인 경우입니다(20.4).

소아에서 특히 본 다섯 가지의 결론은 다음과 같습니다.
- **체중 기반 용량**: 맞습니다. 1.0·1.3 why가 mg/kg, '성인 최대 용량을 넘기지 않음'까지 맞게 말하고, 단위도 kg만 씁니다.
- **응급약을 체중 때문에 미루지 않기**: 맞습니다. 14.0과 S14 카드는 "right now"이고, 체중을 재느라 기다리는 줄은 없습니다.
- **깨우기 힘든 아이에게 먹이지 않기**: 먹이라고 하는 줄은 없습니다. 20.2의 오답 `feeding`만 가볍게 고칩니다(A-3).
- **학대 의심 시 의무 신고**: S18은 정확합니다. 그러나 S10의 10.5 "…nothing more"와 why가 신고를 말하지 않아 S18과 어긋납니다(심각 3).
- **청소년 비밀보장의 한계**: 정확합니다. 12.0·12.1 why와 S12 swap이 자해·타해·학대는 비밀이 아니라고 맞게 말합니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 말하는 방식의 이유와 근거를 함께 줍니다. 사실을 고칠 곳은 5건입니다. 17.3은 영아 돌연사를 '막을 수 없었다'고 단정하라고 하고, 17.5는 검시 사건임을 빠뜨렸습니다. 10.5는 신고 의무를 말하지 않고, 14.1은 `ko`와 어긋나며, 12.4는 묶어 묻기를 장점처럼 말합니다. |
| 2 | 빈칸 | 3 | 패혈증 주제보다 동떨어진 오답이 적습니다(12문장). 다만 `hungry`를 8번, `cold`를 4번 돌려썼습니다. 위험 신호를 오답으로 보인 곳이 20.4·14.3이고, `ko`로도 정답이 둘에 가까운 곳이 7.1·17.5·10.0입니다. |
| 3 | `decoy` | 2 | 125개 중 106개가 시간·장소 부사구입니다(`at night` 15, `in the hall` 12, `at school` 10, `at the door` 6). `ko`에 맞는 문장을 만드는 것이 1건(2.4), 위험한 문장을 만드는 것이 3건(19.0·15.4·14.0)입니다. |
| 4 | `distractorsKo` | 4 | 거의 모두 같은 상황에서 실제로 할 말입니다. 정답과 반만 다른 것이 3건입니다(20.2·16.2·14.1). |
| 5 | `order` | 3 | 앞 줄을 가리키는 말로 잘 묶었습니다. 그러나 인접 교환이 자연스러운 카드가 6장입니다(S2·S10·S13·S16·S18 + S6·S19 경미). 답을 전제한 줄이 2장이고, 15단어를 넘는 줄이 12줄입니다(최대 22단어). |
| 6 | `tag`·`icon` | 4 | 태그는 짧고 상황 안에서 일관됩니다. 크게 어긋난 아이콘은 없습니다. |
| 7 | context·swap `ko` | 3 | swap `ko` 14건은 모두 맞습니다. context는 `dose` 정비가 차트에서 약 이름을 지우고 XX 영어를 그대로 두었습니다. `heart rate`·`jaundice`는 어색함이 그 낱말에 있지 않습니다(sepsis H-1 `infection`과 같은 모양). |
| 8 | 파일럿 갈래 | 3 | 갈래 2(동떨어진 오답)는 줄었지만 같은 오답을 돌려쓰는 버릇이 남았습니다. 갈래 3(순서를 못 박음)이 6장, 갈래 5(decoy가 `ko`에 맞음)가 1건입니다. 위험한 처치를 보인 곳은 빈칸 2, decoy 3입니다. |

## 사실 오류·심각한 문제

1. **20.4 빈칸 `quieter`·`slower`**: 중증 천식에서 숨소리가 조용해지는 것(silent chest)과 호흡이 느려지는 것은 호흡 부전 직전의 징후입니다. 삽관을 서두르는 신호입니다. 그래서 "If breathing gets any quieter, we'll help him with a breathing machine."은 임상적으로 **맞는 말**입니다. 이것을 오답으로 보이면 "조용해지면 나아진 것"이라는 위험한 오해를 가르칩니다(TASK 10 "조용한 흉부는 기다리지 않고 바로 부릅니다").
2. **S0 order 2번 줄 `ko` "101.2도라 열이 있네요"**: 한국 학습자는 섭씨로 읽습니다. "화씨 101.2도(약 38.4℃)"로 고쳐야 합니다.
3. **S10 10.5 "My job right now is to keep him safe, nothing more."와 why, S10 카드 4번 줄**: why가 "수사나 판단이 아니라는 점"만 말하고 신고 의무는 말하지 않습니다. 그래서 `nothing more`가 "신고는 하지 않는다"는 약속으로 읽힐 수 있습니다. 학대가 의심되면 간호사는 법에 따른 의무 신고자이고, S18이 바로 그 말("By law, I have to report…")을 가르칩니다. 두 상황이 서로 어긋납니다. 10.5는 keyPhrase가 아니므로 결정 11로 보고하고(결정 11 보고 1), why와 카드는 v46으로 고칩니다(F-1, G-1). 같은 문장의 빈칸 오답 `quiet`("keep him quiet")은 학대 장면에서 '아이 입을 막는다'로 들릴 수 있어 바꿉니다(B-5).
4. **17.3 why** "부모가 막을 수 있었던 일이 아니라고 분명히 말해 줘요": 미국에서 원인 불명의 영아 사망(SUID)은 검시관(ME)이 맡는 사건입니다. 사망 현장 조사(SUIDI)와 부검이 끝나야 원인이 정해지고, 안전하지 않은 수면 환경이 관여한 경우도 있습니다. 간호사가 '막을 수 없었다'고 단정하라고 가르치면 안 됩니다. 탓하지 않는 말로 죄책감을 덜되, 원인은 단정하지 않는다고 고칩니다(F-2). 문장 자체는 결정 11로 보고합니다(결정 11 보고 2). 17.5 why에도 검시 사건이라 튜브·라인을 그대로 두고 병원 지침 안에서 안는다는 점을 넣습니다(F-3).
5. **context `dose`**(저작자 정비): 차트 장면에서 약 이름(acetaminophen)을 지워 "Dose 15 mg/kg = 273 mg PO"가 됐습니다. 이건 차트 기록으로 성립하지 않습니다. XX "Dose is 15 mg/kg, so 273 mg per wt."는 base에서 물려받은 비문입니다(273 mg은 '체중당'이 아니라 총량). 게다가 부모에게 `dose`는 맞는 말이라, 어색함이 `dose`가 아니라 mg/kg·wt에 있습니다. 안은 H-1에 있습니다.
6. **2.4 decoy `of course`**: `here` 자리에 넣으면 "There's no blame, of course, we just want her protected."가 됩니다. 자연스럽고 `ko`("탓하려는 게 아니라, 그저 아이를 보호하고 싶은 거예요")와도 맞아 정답이 둘입니다.
7. **위험한 문장을 만드는 decoy**
   - 19.0 `in the morning`: "…we're correcting it carefully in the morning."이 되어 DKA 교정을 아침으로 미루는 그림입니다. 브리프가 든 '패혈증 항생제를 tomorrow morning'과 같은 갈래입니다.
   - 15.4 `after the bath`: "Her skin feels cool and looks a little blotchy after the bath."가 되어 패혈증의 얼룩덜룩한 피부를 목욕 탓으로 넘기는 그림입니다.
   - 14.0 `for his rash`: "We're giving him epinephrine for his rash"가 되어 적응증이 틀립니다(에피네프린은 아나필락시스에 쓰지, 발진에 쓰지 않습니다).

## 저작자 자기 보고 판정

1. **기능어 빈칸과 정답과 같은 뜻의 오답을 `ko`로 구별하게 둔 곳**
   - 7.4 `instead of` ↔ `along with`/`as well as`/`together with`: 받아들입니다. 오답 셋은 "많이 한꺼번에도 함께"가 되어 논리로 틀리고, `ko`의 "~보다"가 정답을 정합니다. 다만 셋이 서로 같은 뜻이라 묶음으로 걸러집니다. 바꾸지 않아도 되지만, 바꾼다면 `because of`/`on top of`/`in front of`가 낫습니다.
   - 10.3 `before` ↔ `after`/`since`/`during`, 10.1 `yours` ↔ `mine`/`ours`/`theirs`: 받아들입니다(`ko` "직전", 말하는 상대가 부모라는 점이 정답을 정함).
   - 같은 뜻 오답 중 `ko`로도 갈리지 않는 곳은 셋입니다. 7.1 `cups`(조금씩), 17.5 `carry`(안고), 10.0 `bruise`/`burn`("다치신 경위"는 멍·화상도 포함)입니다. 고칠 것 A-5~A-7에 넣었습니다.
2. **인접 교환이 어색할 뿐 불가능하지 않은 order 카드**
   - S0 발열: 받아들입니다. 2↔3은 `Since then`이 시작 시점을, 3↔4는 `all that`이 앞의 대답들을 필요로 해서 막힙니다.
   - S10 경위 문진: 받아들이지 않습니다. 2↔3이 자연스럽습니다. "이 질문은 모든 아이에게 한다"는 말은 실제로 첫 질문 바로 뒤에 흔히 합니다. 3↔4도 `Beyond them`이 1·2번 줄을 받을 수 있습니다. G-1에서 고칩니다.
   - S14 아나필락시스 3·4줄: 받아들입니다. 4번 줄이 앞으로 가면 3번 줄 `That's why`가 받을 이유가 끊깁니다. 2↔3이 오히려 약하게 막혀 있지만(`That's why` → `That's because` 순서로도 읽힘) 고칠 것에는 넣지 않습니다.
3. **2.1 `missed`/`lost`/`forgotten`**: 받아들입니다. 다만 경계선입니다. "Let's go through which ones she's missed so far."는 바로 따라잡기 접종 대화에서 하는 말이라 브리프가 말한 '장면상 맞는 말'의 모양입니다. 낱장 머리 `ko` "맞은 것들"이 `had`로 정해 주므로 통과시킵니다. `lost`/`forgotten`은 문법은 맞고 뜻이 우스운 정도라 둡니다.
4. **context 정비 5건과 그대로 둔 2건** (ctx-C 기준: 고친 뒤에도 어색한 장면이 그 낱말 때문에 어색한가, why가 지금 장면을 설명하는가)
   - `dose`: **고칠 것**(심각 5, H-1).
   - `heart rate`: **고칠 것.** 부모에게 `heart rate`는 맞는 말이고, XX의 어색함은 `WNL`에 있습니다. why도 장면에서 사라진 `HR`을 아직 말합니다(ctx-C "why가 사라진 낱말을 아직 말하는 것"). H-2에서 고칩니다.
   - `jaundice`: **고칠 것(경미).** 부모도 `jaundice`를 흔히 압니다. XX의 어색함은 `to the chest`·`TSB`·`bili`에 있습니다(sepsis H-1 `infection`과 같은 모양). H-3에서 고칩니다.
   - `ingestion`: OK. `ingestion`은 부모가 쓰지 않는 임상어라 XX가 그 낱말 때문에 어색합니다. 의사 보고 "Coin ingestion around two o'clock — …"도 실제 말투입니다.
   - `intubate`: OK. 차트 `prep to intubate`는 `prep for intubation`보다 조금 덜 차트답지만 허용합니다.
   - 그대로 둔 `retractions`·`mottled`: OK. base가 이미 같은 임상어를 세 장면에 공유하는 모양이라(TASK 9 "그대로 두세요") 맞는 판단입니다.
5. **유지한 `If` 줄 — S20 3번 "If breathing gets any harder even with that support, …"**: 받아들입니다. 기계 환기는 모든 환자에게 하는 일이 아니라 지지에도 나빠질 때만 하는 진짜 조건입니다. `even with that support`가 2번 줄을 받아 순서도 묶습니다(16단어라 G-9에서 가리키는 말을 남기고 줄입니다).

## 고칠 것 (v46 필드) — 모두 46건

### A. 위험한 그림·정답이 둘인 빈칸 (7건)

| 어디 | 문제 | 고칠 안 |
|---|---|---|
| 20.4 빈칸 | `quieter`·`slower`는 중증 천식에서 맞는 말이자 위험 신호(심각 1) | 오답을 `easier`/`better`/`calmer`로 |
| 14.3 빈칸 | `itching` — 땅콩 알레르기 아이의 목 가려움은 아나필락시스 초기 증상이라 "act immediately"가 맞음 | `itching`을 `healing`으로(`shaking`·`burning`은 두되 `burning`도 바꾸려면 `clearing`) |
| 20.2 빈칸 | `feeding` — 호흡곤란이 심한 아이에게 '먹이기'를 보임 | `feeding`을 `moving`으로 |
| 19.3 빈칸 | `oxygen … through an IV` — 경로 혼동 그림 | `oxygen`을 `blood`로 |
| 7.1 빈칸 | `cups`(small cups of fluid frequently)가 `ko` "조금씩 자주"에도 맞음. `bottles`도 비슷 | 오답을 `gulps`/`bags`/`bowls`로 |
| 17.5 빈칸 | `carry`가 `ko` "안고 계셔도"와 겹침 | `carry`를 `move`로 |
| 10.0 빈칸 | `bruise`/`burn`이 "다치신 경위"에 그대로 맞음 | 빈칸을 `understand`로 옮기고 오답 `prove`/`decide`/`guess` |

### B. 장면과 동떨어진 빈칸 오답 → 같은 분야의 틀린 말로 (12건)

| 문장 | 지금 오답 | 안 |
|---|---|---|
| 2.2 | ready/clear/closed | `early`/`extra`/`recent` (catch up 논리로 틀림) |
| 5.0 | cold/hungry/angry | `cured`/`discharged`/`immune` |
| 6.0 | quietly/happily/slowly | `easily`/`calmly`/`gently` |
| 10.2 | hungry/asleep/cold | `discharged`/`admitted`/`warm` |
| 10.5 | busy/hungry/quiet | `busy`/`awake`/`entertained` (`quiet`은 학대 장면에서 '입막음'으로 들림, 심각 3) |
| 11.0 | awake/hungry/busy | `hungry`만 `alert`로 |
| 12.5 | hungry/bored/tired | `bored`/`busy`/`sleepy` (`lonely`·`sick`은 간호사가 실제로 할 말이라 피함) |
| 13.5 | tired/cold/hungry | `bigger`/`stronger`/`heavier` (`cold`는 신생아에게 사실이라 빼기를 권함) |
| 15.5 | time/money/space | `time`/`tests`/`beds` |
| 17.1 | food/help/money | `help`/`blankets`/`tissues` |
| 17.4 | dentist/pharmacist/cashier | `surgeon`/`pharmacist`/`radiologist` |
| 20.0 | checkups/vitamins/questions | `tests`/`X-rays`/`fluids` |

참고: `hungry`가 8문장(0.3·5.0·10.2·10.5·11.0·12.5·13.0·13.5), `cold`가 4문장, `vitamins`가 4문장에 돌려 쓰였습니다. 위 B에서 대부분 빠집니다. 0.3·13.0은 수분·수유 장면이라 `hungry`가 같은 분야이므로 둡니다.

### C. 문법으로 걸러지는 오답 (1건)

| 어디 | 문제 | 안 |
|---|---|---|
| 9.5 | `to see slightly where it is` — 비문 | `slightly`를 `later`로 |

### D. decoy (6건 + 전반 1건)

| 어디 | 문제 | 안 |
|---|---|---|
| 2.4 | `of course` → `ko`에 맞는 다른 문장(심각 6) | `her records` |
| 19.0 | `in the morning` → DKA 교정을 미룸(심각 7) | `at the desk` |
| 15.4 | `after the bath` → 얼룩덜룩함을 목욕 탓으로(심각 7) | `in the photo` |
| 14.0 | `for his rash` → 에피네프린 적응증이 틀림(심각 7) | `for the doctor` |
| 14.5 | `from school` → "keep him from school" — 음식 알레르기 아이를 학교에 보내지 말라는 그림 | `on the shelf` |
| 19.5 | `at lunch` → "We'll check her levels at lunch until…" — DKA 수치를 점심때만 보는 그림 | `in the lobby` |
| 전반 | 106/125개가 시간·장소 부사구 틀이라 문장 끝에 붙여도 우습기만 해서 걸러집니다. 브리프가 권하는 것은 "같은 자리에 올 수 있는 구"나 "이 문장의 청크를 살짝 바꾼 것"입니다. | sepsis와 같이 다음 수정에서 상황마다 두세 개라도 청크 변형형으로 바꾸기를 권합니다(예: 8.4 `or the music`, 0.4 `your tummy`, 12.3 `for this call`처럼). 이번 목록에서는 개수만 셉니다. |

참고(고치지 않음): 7.1 `with a straw`는 끝에 붙이면 `ko`에 '빨대로'가 더해질 뿐이라 둡니다.

### E. distractorsKo (3건)

| 어디 | 정답과 반만 다른 오답 | 안 |
|---|---|---|
| 20.2 | "산소 수치를 계속 보고 있어요" ↔ 정답 "매 순간 아이를 지켜보고 있어요" | "아이가 편하게 앉도록 침대를 세울게요" |
| 16.2 | "결과는 나오는 대로 알려 드릴게요" ↔ 정답 "매 단계마다 … 계속 말씀드릴게요" | "다른 가족분께 연락해 드릴까요?" |
| 14.1 | "아이는 저희가 계속 지켜보고 있어요" ↔ 정답 "기도는 저희가 확실히 챙기고 있어요" | "아이가 먹은 음식 포장지를 가지고 계세요?" |

### F. why (5건)

1. **10.5**(심각 3): "My job…to keep him safe로 지금 하는 일을 아이 보호에 모아요. 수사나 판단은 간호사 몫이 아니지만, 학대가 의심되면 간호사는 법에 따른 의무 신고자예요 — 신고도 아이를 지키는 일의 일부예요."
2. **17.3**(심각 4): "not something you caused로 부모의 죄책감을 덜어요. 다만 원인 불명의 영아 사망은 검시관 조사가 끝나야 원인이 정해지니, 원인을 단정하는 말은 하지 않고 탓하지 않는 데 집중해요."
3. **17.5**: 끝에 덧붙입니다. "원인 불명의 영아 사망은 검시 사건이라, 튜브·라인은 그대로 두고 직원이 곁에 있는 등 병원 지침 안에서 안게 해요."
4. **14.1**: why가 "곁에 있어 달라고"라 하지만 `ko`는 "저한테 집중해 주세요"입니다. 여기서 `Stay with me`는 '제 말에 집중하세요'라는 뜻이라 `ko`가 맞습니다. 안: "Stay with me로 당황한 보호자의 주의를 간호사에게 붙잡고, on top of…로 기도를 챙기고 있다고 전해요. 아나필락시스에서 가장 급한 것이 기도라는 점도 함께 알려요."
5. **12.4**: "Are you…, or…?로 … 한 번에 묻는 말투예요"는 묶어 묻기를 장점처럼 말합니다. 청소년 위험 문진(HEADSS)은 하나씩 묻는 것을 권합니다. 안: "성·약물·술을 돌려 말하지 않고 판단 없는 말투로 물어요. 청소년 진료에서는 이런 위험 요인을 보호자 없이 본인에게 따로, 하나씩 묻는 것이 표준이에요."

### G. order (9건)

1. **S10** — 2↔3·3↔4가 자연스럽습니다(자기 보고 2). 4번 줄 `Beyond them`은 어색한 영어이고, `nothing more`는 심각 3과 같은 문제입니다.
   - 3번 줄 안: `Both of those questions are part of our routine exam for every child.` (`Both of those`가 1·2번 두 질문을 요구해 2번 앞으로 갈 수 없음)
   - 4번 줄 안: `My job right now is to keep him safe — that's what they're for.` (`they`가 3번 줄의 질문들, `nothing more` 삭제)
   - why를 고친 가리키는 말에 맞춥니다.
2. **S2** — 3↔4가 자연스럽습니다(`the rest`가 2번 줄 "맞은 것들"의 나머지로도 읽힘).
   - 4번 줄 안: `I'll note today's visit, and we can schedule those catch-up shots.` (`those catch-up shots`가 3번 줄 `catch up`을 받음)
3. **S13** — 3↔4가 자연스럽습니다(`That's why`가 2번 줄 `right away`를 받을 수 있음). 또 처지고 잘 안 먹는 신생아를 빌리루빈 하나로만 좁혔습니다. 신생아에서는 감염(패혈증) 평가가 더 큰 걱정입니다.
   - 3번 줄 안: `To check it, we'll test her blood for jaundice and infection.` (11단어)
   - 4번 줄 안: `Those tests are quick — newborns need fast care, and you were right to come.` (`Those tests`가 3번 줄을 받음)
4. **S16** — 3↔4가 자연스럽습니다("I'll stay beside you…" 다음에 "You can stay right here…"도 맞음).
   - 4번 줄 안: `While you're here with her, I'll stay beside you and tell you each step.` (`here with her`가 3번 줄 허락을 받음. 처치를 미루는 시간 묶음이 아님)
5. **S18** — 2↔3이 자연스럽습니다(`that process`가 1번 줄 '신고'를 받을 수 있음).
   - 3번 줄 안: `That process includes a specialist who will help us figure this out together.` (`That process`가 2번 줄 `the process`를 요구)
6. **S9** — 4번 줄 "where the coin is"는 1번 줄 "what he swallowed"의 답을 전제합니다(브리프 '답을 전제한 order 줄').
   - 4번 줄 안: `Thanks for all that — an X-ray will show exactly where it is.`
7. **S6** — 2↔3이 약하게 바뀝니다("To help with that"이 1번 줄을 받을 수 있음). 산소도 조건 없이 줍니다(세기관지염은 포화도가 낮을 때만, 6.4 why와 맞춤).
   - 3번 줄 안: `To ease that pulling, we'll clear her nose and give oxygen if she needs it.` (`that pulling`이 2번 줄을 받음)
8. **S0 · S4** — 2번 줄 `ko`·전제
   - S0 2번 줄 `ko`(심각 2): "화씨 101.2도(약 38.4℃)라 열이 있네요. 언제 시작됐나요?"
   - S4 2번 줄 "Great!"은 아이의 '예'를 전제합니다. 안: `Let's pretend he needs a checkup too — you can hold him.` (`he`가 1번 줄 teddy를 받음)
9. **15단어를 넘는 줄 12줄**(브리프 "한 줄은 15단어 안쪽")
   - S11 4번(22): `With those, we'll go at his pace — tell me if anything's too much.`
   - S15 1번(19): `Her signs worry me — is she harder to wake up than an hour ago?`
   - S15 4번(18): `The team will want to know — when did this change start?`
   - S5 4번(18): `The most important of those: over five minutes, call 911 right away.`
   - S9 4번(18)은 G-6 안으로 줄어듭니다.
   - S20 3번(16): `If breathing gets harder even with that support, we'll use a breathing machine.` (가리키는 말 `even with that support`는 남김)
   - 16~17단어인 S0 4번, S4 4번, S6 2번, S7 4번, S8 4번, S18 4번은 군말(`Thank you for telling me all that.`의 앞부분, `so`, `okay` 등)을 덜어 15단어 안으로 맞춥니다. 가리키는 말(`all that`, `all of that`, `the sips`, `Whatever the specialist asks`)은 남기세요.

참고(고칠 것에 넣지 않음): S19는 3↔4가 약하게 바뀝니다. 바꾼다면 4번 줄을 `Between the IV and the checks, it's a lot — I'll walk you through it.`로 합니다. S1 3번 줄 "with a second nurse"는 독립 이중 확인(각자 따로)으로 읽히게 why에 한마디 덧붙이면 좋습니다.

### H. context (3건)

1. **S1 `dose`**(심각 5) — `word`를 세 장면이 함께 쓰는 임상 표기 `mg/kg`로 바꿉니다.
   - `word: mg/kg`, `ko: 체중 1 kg당 mg`
   - 차트: base로 되돌립니다. `Wt 18.2 kg; acetaminophen 15 mg/kg = 273 mg PO.`
   - 이중 확인: `Weight is 18.2 kilos, so at 15 mg/kg the dose is 273 milligrams.`
   - XX(부모에게): `Dose is 15 mg/kg, so 273 mg PO.`
   - fix·why: 그대로 둡니다(why는 이미 mg/kg·wt를 말함).
2. **S3 `heart rate`** — 어색함이 `WNL`에 있고, why가 사라진 `HR`을 말합니다.
   - `word: within normal limits`, `ko: 정상 범위 내`
   - 차트: `HR 128, within normal limits for age.`
   - 의사 보고: 그대로 둡니다(`…within normal limits for his age.`).
   - XX: `His HR's 128 — within normal limits for age.`
   - why: "HR·within normal limits는 차트와 의료진끼리의 말이에요. 불안한 부모에게는 풀어서 '이 나이에 완전히 정상'이라고 말해야 안심이 돼요."
3. **S13 `jaundice`**(경미) — 어색함이 `TSB`·`bili`에 있습니다.
   - `word: bili`, `ko: 빌리루빈(수치)`
   - 차트: `Jaundice to chest; bili sent.`
   - 의사 보고: 그대로 둡니다(`…the bili's been sent.`).
   - XX: base로 되돌립니다. `TSB's been sent to check her bili.`
   - why: 그대로 둡니다(TSB·bili를 말함).

## 결정 11 — 보고(v44 문장, 수정 담당 판단)

1. **10.5** "My job right now is to keep him safe, nothing more." — keyPhrase가 아니라 고칠 수 있습니다(심각 3). 안: `My job right now is to keep him safe.`(청크 `, nothing more` 삭제). ko "지금 제 역할은 아이를 안전하게 지키는 거예요."
2. **17.3** "This is not something you caused or could have prevented." — keyPhrase가 아닙니다. 검시 전에는 `could have prevented`를 단정하지 않는 편이 맞습니다(심각 4). 안: `This is not your fault.` / ko "부모님 잘못이 아니에요." (청크·words를 함께 맞춥니다.) 바꾸지 않는다면 why만 F-2대로 고칩니다. 이 경우 S17 카드 2번 줄도 그대로 둡니다.
3. **3.4** "I'll double-check her numbers against the chart for her age." — S3의 다른 문장과 카드는 모두 `his`인데 이 문장만 `her`입니다. `his`로 맞추기를 권합니다.

## 종합

고칠 것은 v46 필드 46건(A 7, B 12, C 1, D 6, E 3, F 5, G 9, H 3 — D 전반 1건은 개수에서 뺌)이고, 결정 11 보고는 3건입니다. 먼저 고칠 것은 사실 오류·위험한 그림 7건입니다(20.4 `quieter`·`slower`, S0 카드 화씨 표기, S10 신고 의무, 17.3 단정, `dose` context, 2.4·19.0·15.4·14.0 decoy). 그다음 S10·S2·S13·S16·S18 카드의 순서를 못 박고 긴 줄을 줄이면 내보낼 수 있습니다. 소아 핵심(체중 기반 용량, 응급약 지연 없음, 청소년 비밀보장의 한계, S18 의무 신고)은 정확합니다. 지금 상태로는 내보내지 않는 것을 권합니다.
