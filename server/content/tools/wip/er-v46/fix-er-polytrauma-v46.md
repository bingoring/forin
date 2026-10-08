# er-polytrauma — v46 보강 검토 (er)

대상: `er-polytrauma.yaml` (상황 21 · 문장 105 · order 21장 · 뉘앙스 context 16 · swap 10). 문장 105개와 order 21장을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 1차평가 ABCDE 순서 … S20 = 기도 화상·안면외상 기도위기). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 420줄, decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립(약 800줄),
order 인접 교환 63가지(21장 × 3)와 줄 단어 수, context `word`가 세 장면 `en`에 나오는지(W14 경고 8건 포함), swap 10건(정답 선택지를 넣은
문장과 `ko` 대조), decoy·빈칸 오답·`distractorsKo`의 주제 안 중복, base와 v44 필드 비교(**단어·문장·뉘앙스 모두 바뀐 것 없음**).
아래에서 빈칸을 옮기거나 선택지를 바꾸자고 한 것은 새 answer가 `en`에 낱말 경계로 **정확히 한 번** 나오는지, 새 decoy는 청크와 같지 않고
`en` 안에 없는지 스크립트로 확인했다. 새 order 줄은 단어 수(15 이하)와 인접 교환 세 가지를 다시 읽었다.
`verify_one_theme.py er …/er-polytrauma.yaml` → `==> 통과`(W14 경고 8).

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 정답이 둘이라고 한 것은
어느 한국어 낱말이 오답도 받아 주는지, 괜찮다고 한 것은 어느 낱말이 걸러 주는지 적었다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식의 이유를 짚는다. 저작자가 꼽은 임상 사실 7가지는 모두 맞다(아래). 틀린 것은 0.2 하나(head-to-toe를 1차평가 E 단계라 함 — 2차평가다). 고칠 것: 13.0 "같은 혈액으로", 11.0 `ko` 되풀이, 19.2 동의 주체. |
| 2 | 빈칸 | 3 | `ko`로 걸러지지 않아 **정답이 둘**인 것 2개: 9.2 `shot/stabbed`(ko "맞으셨나요"), 13.4 `see`(ko "찾아뵐게요"). 경계선 2개: 14.1 `fully`(ko "제대로"), 11.2 `for us`. 문법·연어로 걸러지는 것: 4.0 `heavy/old`, 2.3 `fast/strong`. 장면과 동떨어진 것: 4.4 `standing/kneeling`, 5.0 `thanking`. **부사 묶음 돌려쓰기**가 크다: `slowly`가 9문장(3.0 5.1 7.4 9.4 13.0 14.1 15.4 19.1 20.1), `gently`·`rarely` 각 3, `visit/warn/thank` 묶음이 5.4·19.4(+13.4). |
| 3 | `decoy` | 3 | 대신 넣기로는 `ko`에 맞는 다른 문장이 없다. **끼워 넣으면 뜻이 그대로인 것 6개**: 2.0·3.1 `for you`, 4.1 `at the time`, 9.3 `with your hand`, 10.0 `on the floor`, 17.3 `for ten`. 경계선 7개(`ko`에 없는 말을 덧붙이지만 어긋나지는 않음): 0.0 `at the scene`, 3.0·11.0 `if you can`, 3.4 `for the doctor`, 4.0 `on the road`, 7.1 `on your own`, 9.1 `in the bed`. 중복: `for you`·`this morning`·`by hand` 각 4, `in the car`·`all day`·`all night`·`on the road` 각 3(사소). |
| 4 | `distractorsKo` | 4 | **앞 주제들보다 크게 좋아졌다.** 대부분 같은 상황에서 실제로 할 말이다(4.x, 12.x, 13.x, 17.x, 18.x는 아주 좋다). 고칠 것 15문장: 뒤집기 5(0.4 3.0 6.4 11.0 14.0), 할 법하지 않은 말 7(3.4 8.2 8.3 10.3 12.4 15.0 20.1), 반만 다른 말 3(1.4 15.2 19.4). 11.0은 3.0과 오답 둘이 글자까지 같다. |
| 5 | `order` | 3 | **조건절로 시작하는 줄이 0개**다(자기 점검 10 효과). 앞 줄을 가리키는 말로 묶는 설계도 잘 됐다. 남은 것: 시간 한정·조건이 남은 줄 3장(S6 L4 `While they're being done`, S19 L4 `Once you've agreed`, S17 L4 `Scan done—pulse check`), 인접 교환이 열린 카드 1장(S15 3↔4)과 약하게 열린 2장(S1 3↔4, S19 2↔3), 사실이 틀린 줄 1(S14 L4 떨림이 응고를 악화), 전제가 걸린 줄(S4 L3 벨트를 맸다는 전제), 영어가 어색한 줄(S8 L3 `besides that last dose`). 15단어 초과 없음. |
| 6 | `tag`·`icon` | 4 | 태그는 한국어·10자 이하이고 상황 안에서 일관된다. order 태그·아이콘은 21장 모두 `대화 흐름`·`compass`. 사소: 2.3 `chartup`(혈압이 "낮다"는 문장), 4.0 `gear`(속도 질문). |
| 7 | context `word`·`ko`, swap `ko` | 3 | `word`가 **어색한 장면에 글자로 있는 것 16/16**(자기 점검 9 효과). `ko`도 뜻으로 모두 정확하다. 그러나 4개(`owie`·`belt thing`·`language access services`·`stat`)는 **어색한 장면에만** 있어 제목이 답을 말한다(저작자 보고 1, 아래). swap `ko` 10건 중 9건은 정답을 넣은 문장의 뜻이고, S1은 `ko`가 의료진 말투로 바뀌었다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진 빈칸 오답 약 4문장, 문법으로 걸러지는 것 2문장, 부사 묶음 돌려쓰기 9문장. 관사는 잘 지켰다(`an interpreter`). (3) order 못 박기: `And/Also/Then` 없음, 열린 교환 1장+약한 2장. (4) 임상 순서·사실: S17 순차화, S6 시간 한정, S14 L4, why 0.2. (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **9.2 빈칸 정답이 둘** — `How many times were you [shot/stabbed/kicked]?` 관통상 장면(S9)이고 `ko` "몇 번이나 **맞으셨나요**"는 총에 맞다·칼에 찔리다(관통상에서 흔히 "맞다"로 말함)·발로 차이다를 모두 받는다. `shot`은 `ko`로도 장면으로도 정답이다.
2. **13.4 빈칸 정답이 둘** — `I'll come [see] you as soon as we know more.` `ko` "찾아**뵐**게요" = come see you. `find`와 뜻이 같다.
3. **0.2 why — head-to-toe를 1차평가 E 단계라 함.** ATLS에서 머리부터 발끝까지 훑는 것은 **2차평가**다. 1차평가 E(Exposure)는 옷을 벗겨 몸 전체를 드러내 보고 **저체온을 막는** 단계다. 같은 주제의 단어 `w-toe` cue("2차평가에서 온몸을 빠짐없이…")와 S0 swap(`who: 2차평가 알림`)과도 어긋난다. S0 order L4 note `노출`도 같은 문제.
4. **S17 order — 외상성 심정지 가역 원인 교정을 순차로, 맥박 확인을 "스캔이 끝난 뒤"로.** 상황 brief가 "가역 원인을 **동시에** 교정"이다. 감압은 압박을 이어 가며 하고, 맥박 확인은 2분 주기로 오며, 심장 초음파는 **맥박 확인 멈춤 동안** 짧게 본다(압박 중단 최소화). 카드는 `Decompression done → ultrasound → Scan done → pulse check`로 맥박 확인을 시술 완료에 묶는다.
5. **S6 order L4 — 복부 사정을 "스캔하는 동안"으로 한정** (저작자 보고 2). 배의 압통·팽만은 모든 외상 환자에게 **영상 전에** 사정하고, 스캔 중인 환자는 CT 안에 혼자 있어 대화할 수 없다. "그동안만 알려 달라"는 시간 한정 갈래다.
6. **S14 order L4 `Shivering can make it worse`** — `it`이 L3의 응고를 받아 "떨림이 응고를 악화시킨다"는 새 인과 주장이 된다. 응고를 떨어뜨리는 것은 **저체온**이고, 떨림은 체온이 떨어진다는 신호다(떨림은 산소 소모를 늘린다). base 14.3 문장의 같은 문제를 why는 잘 피했는데 order 줄에서 되살렸다.
7. (결정 11, base 문장) **15.4 `this side is losing pressure quickly`** — 긴장성 기흉은 그쪽 흉강 압력이 **올라가는** 것이다. `ko` "압력을 잃고 있어서"도 같다. v46이 고칠 수 없는 base 문장이라 따로 보고한다(아래).

## 저작자 자기 보고 4건 판정

### 1. context `word`를 어색한 말 자체로 고른 경우

**판정: `word`는 세 장면이 같은 뜻으로 가리키는 말이어야 한다.** 화면 제목이 "`word`가 어색한 장면은?", 메모가 "뜻은 셋 다 '{ko}'"다.
어색한 말(`owie`) 자체를 고르면 (a) 그 말이 어색한 장면에만 있어 **제목이 답을 말하고**, (b) 메모 "뜻은 셋 다 '아픈 곳(아이 말투)'"가 거짓이 된다
(다른 두 장면에는 `owie`가 없다). 이 판정은 이미 고쳐진 TASK 9번(b9c0937, 이 저작 뒤)과 W14 문구와도 같다.

다만 **v46 보강에서는 장면을 고칠 수 없어서**, 어색함이 낱말 자체인 문항은 세 장면 모두에 글자로 있는 말이 없다. 그때는 **다른 두 장면이 쓰는 바른 말**
(어색한 장면이 엉터리로 부르는 그 대상)을 `word`로 쓰고 W14 경고 1건(어색한 장면)을 받아들인다. 제목 "`binder`가 어색한 장면은?"은 "binder를 엉터리로
부른 장면"으로 읽히고 메모 "뜻은 셋 다 '골반 바인더'"는 참이다.

| 상황 | 지금 | 고칠 안 | W14 |
|---|---|---|---|
| S3 | `owie` / 아픈 곳(아이 말투) | `side` / `옆구리(옆쪽)` — 장면 1 `left side`, 장면 3 `her side`(팀에 모호하게), 장면 2는 `L flank`. why가 말하는 것도 "해부학 용어(left flank)로 정확히"다 | 장면 2 경고 |
| S7 | `belt thing` / 벨트 같은 것 | `binder` / `골반 바인더` — 장면 1·2에 있고, 장면 3은 그것을 `belt thing`이라 부름 | 장면 3 경고 |
| S11 | `language access services` / 언어 지원 서비스 | `interpreter` / `통역사` — 장면 1·2에 있고 장면 3의 `fix`도 interpreter | 장면 3 경고 |
| S19 | `stat` / 즉시 | `OR` / `수술실` — 장면 1 `OR is ready`(팀), 장면 2 `operating room`(보호자), 장면 3 `OR stat`(보호자에게 약어) | 장면 2 경고(`operating room`은 `OR`로 잡히지 않음 — 스크립트로 확인) |
| S14 | `lethal triad` | **그대로.** 장면 1(팀)·3(환자)에 있고 장면 2(기록)에만 없다. 제목이 답을 말하지 않는다 | 장면 2 경고(그대로) |

TASK 9번에 덧붙일 문구(제안): "**보강 모드에서 장면을 바꿀 수 없고 어색함이 낱말 자체(`owie`·`belt thing`)이면**, 다른 두 장면이 쓰는 바른 말(`binder`)을
`word`로 쓰고 W14 경고 1건을 둔다. 어색한 말을 `word`로 쓰지 않는다. 이때도 `ko`는 세 장면이 가리키는 대상의 뜻."
제안한 6개는 W14와 같은 방식(어간 부분 문자열)으로 스크립트 확인: `side`[1]·`binder`[2]·`interpreter`[2]·`OR`[1] 경고 1건씩, `shock index`·`occult` 경고 없음.
(참고: W14는 소문자 부분 문자열이라 `OR`·`IV` 같은 짧은 말은 `for`·`drive` 안에서도 걸린다 — 낱말 경계로 바꾸는 것이 좋다, 검사기 쪽.)

### 2. 조건절로 시작하지는 않지만 조건이 남은 order 줄

- **S6 L4 `While they're being done, tell me if your belly feels tender or full.`** — 고친다(심각 5). 시간 한정이고 임상 순서도 거꾸로다. 아래 O1의 4줄로.
- 같은 갈래로 더 찾은 것: **S19 L4 `Once you've agreed, …`**(소식 약속이 동의에 달림 → O2), **S17 L4 `Scan done—pulse check now`**(맥박 확인이 스캔 완료에 달림 → 심각 4, O3),
  **S9 L4 `Until then, try to stay very still`**(스캔 전까지만 → O5), **S7 L3 `While the binder is on`**(`ko` "대는 동안"과도 어긋남 → O6).
- 그대로 둬도 되는 것: S20 L4 `Until then`(삽관 전까지 알려 달라 — 삽관 뒤에는 말할 수 없으니 맞음), S16 L2 `While I hold it`(동시 진행을 말함), S12 L3 `Either way`(조건을 없앤 좋은 예).

### 3. 시간 순서를 못 박기 어려웠던 카드

- **S8 항응고제 문진 — 순서는 이대로 맞다.** 약 이름 → 마지막 복용 → 다른 약 전부 → 그래서 세심히 감시. 되돌림 약 결정에 약 종류와 마지막 복용 시각이 먼저
  필요하니 임상 순서도 맞고, 교환 세 가지도 모두 깨진다. 고칠 것은 L3 영어 하나다: `besides that last dose`는 "복용(dose) 말고 다른 약"이라 말이 안 된다
  → `Good to know when you took it—now tell me every other medication you take.`(14단어, `when you took it`이 L2의 답을 받아 2↔3이 깨짐). O8.
- **S19 수술실 이송 조율 — 고친다.** 2↔3이 약하게 열린다(`To do that, I need your consent` → `Because of that, we're taking him…`가 "동의 때문에 바로 간다"로 읽힘).
  L4는 소식 약속이 동의에 달린다. 그리고 수술 동의는 **외과의가 설명하고 받는다**(간호사는 확인·증인) — S19 swap why도 그렇게 말한다. O2의 4줄로.

### 4. `why` 임상 사실 — 7가지 모두 맞다

| 주장 | 판정 |
|---|---|
| 12.1·12.4 왼쪽으로 기울이기 | 맞다. 임신 20주쯤부터 자궁이 하대정맥을 눌러 정맥 환류가 준다. 왼쪽 15~30° 기울임(척추 보호 중이면 판째 기울이거나 자궁을 손으로 왼쪽으로 밀기). 12.1 "임신 후반"은 "임신 20주쯤부터"가 더 정확(선택, S12 swap why와도 맞춤). |
| 7.0 골반 바인더 | 맞다. 골반 부피를 줄이고 골절편을 맞대 출혈을 줄인다. S7 context why의 "대전자 높이"도 맞다. |
| 14.1·14.3 저체온과 응고 | 맞다. 체온이 떨어지면 응고 효소·혈소판 기능이 떨어진다. 14.3 why가 "떨림 = 체온 하락의 신호"로 푼 것도 정확하다(문장 자체의 인과는 결정 11 보고). |
| 15.0·15.1·15.3 긴장성 기흉 | 맞다(폐쇄성 쇼크: 흉강 압력↑ → 정맥 환류↓). 15.0 "기흉을 의심"은 혈흉도 같은 소견이지만 장면이 긴장성 기흉이니 괜찮다. |
| 20.1·20.2 기도 화상 조기 확보 | 맞다. 부종이 몇 시간에 걸쳐 진행해 늦으면 삽관이 어려워진다. |
| 17.4 압박자 2분 교대 | 맞다(AHA: 약 2분마다, 리듬 확인 때 교대). |
| 19.2 응급 동의 예외 | 맞다(동의할 사람을 구할 시간이 없는 응급은 묵시적 동의·응급 예외). 다만 "동의를 구하는" 주체가 외과의라는 점을 넣는 것이 좋다(W4). |

## 세 갈래 비교 — 자기 점검 8~10 뒤 첫 주제

타임라인: 자기 점검 8·9 = cdd4e6b(14:08), 10 = 8ee0728(15:38), 9번 문구 바로잡음 = b9c0937(16:03). polytrauma 저작분은 231ea0e(15:57)로
**8~10을 모두 받은 첫 주제**이고, stroke(7ca52fe 15:37)는 8·9만 받았다. 앞 주제 숫자는 각 검토 목록의 것을 그대로 옮겼다(대부분 문장 수, arrhythmia는 "약 60~65문장").

| 주제 | 받은 점검 | distractorsKo 뒤집기·지어낸 말 | context `word`가 어색한 장면에 없음 | order 모든 환자 확인을 조건부·시간 한정 |
|---|---|---|---|---|
| procedures | — | 약 30 | 7(세 장면 어디에도 없음) | 2(S7 `If not`, S10 "처음 15분만") |
| chestpain | — | 약 45 | 2 | 3(S9 S21, S15 호출) |
| arrhythmia | — | 약 60 | 4/7 | 1(S0) |
| arrest | — | 약 70 | 3/13 | 6장 임상 흐름(조건부 포함) |
| shock | — | 약 20 (+반만 다른 8) | 9/16 | 6 |
| dyspnea | — | 거의 없음(13문장은 주로 겹침) | 2 | 8장 임상 흐름(조건부 다수) |
| asthma-copd | — (점검 1분 전) | 약 8 (+겹침 3) | 4/11 | 6 |
| stroke | 8·9 | 16 (+반만 다른 7) | 11/14 | 5 |
| **polytrauma** | **8·9·10** | **12** (뒤집기 5 + 지어낸 7) (+반만 다른 3) | **0/16** (단, 어색한 말 자체를 고른 4건) | **조건절 시작 0** · 남은 조건·시간 한정 **3장**(S6 S17 S19) |

- **distractorsKo**: 줄었다. 뒤집기 갈래가 주던 45~70문장 → 12문장. 다만 3.0의 `아프지 않은 곳도 가리켜 주세요`를 11.0에 그대로 복사했다.
- **context `word` 장면 부재**: 사라졌다(0/16). 대신 규칙 문구를 글자대로 지키려다 어색한 말 자체를 고르는 새 갈래가 4건 생겼다 — 9번 문구가 바로잡힌 뒤라 다음 주제에서는 줄 것으로 본다.
- **order 조건부**: `If so`·`If not` 류로 시작하는 줄은 0. 조건이 다른 꼴(`While…`·`Once…`·`Until then`·`Scan done—`)로 옮겨 남은 것이 3장이다(앞 주제 5~8장). 10번 점검이 "시작하는 말"만 보게 되어 있어서다 — 10번에 `While …`·`Once …`·`Until then`도 넣을 것을 제안한다.
- 숫자 비교는 검토자·주제 길이가 달라 대략이다. 인과를 단정하지는 않는다.

## 고칠 것 (v46 필드)

### why (4 + 선택 4)
- **W1** 0.2 · head-to-toe를 1차평가 E라 함(심각 3) → "head to toe로 빠짐없이 훑는다는 틀을 주면 환자가 손길을 미리 예상해요. 1차평가 E에서는 옷을 벗겨 몸 전체를 드러내 보고 체온을 지키며, 머리부터 발끝까지 자세히 보는 것은 2차평가예요."
- **W2** 13.0 · "같은 혈액으로"가 같은 혈액형으로 읽힘(응급 수혈은 교차시험 전 O형도 씀) → "…많이 잃은 피를 수액이 아니라 혈액으로 빨리 채우는 것이 출혈성 쇼크 치료의 기본이에요."
- **W3** 11.0 · 둘째 문장 "worst는 통증이 가장 심한 곳을 가리키라는 뜻"이 `ko` 되풀이 → "…worst로 한 곳만 고르게 하면 통역 없이도 먼저 볼 곳이 정해져요."
- **W4** 19.2 · 동의 주체 → "I need your consent로 필요한 것을 분명히 말해요. 수술 동의는 외과의가 설명하고 받으며, 보호자를 구할 시간이 없는 응급에서는 응급 예외로 진행하기도 해요."
- (선택) 6.2 · 저혈압 장면(S6)에서 "CT 같은 영상" → "침상 초음파나 CT 같은 영상으로 … (혈압이 불안정하면 침상 초음파를 먼저 해요)".
- (선택) 8.3 · "환자가 자기 탓이라고 느끼지 않아요"는 근거가 약함 → "…약 때문이라고 밝히면 감시가 이유 있는 조치로 들려요."
- (선택) 12.1 · "임신 후반" → "임신 20주쯤부터".
- (선택) 5.2 · "환자마다 한 명씩 붙이는" → "환자마다 팀을 나눠 붙이는".

### 빈칸 (17문장)
| # | 문장 | 문제 | 고칠 안(스크립트로 확인함) |
|---|---|---|---|
| B1 | 9.2 | `shot/stabbed/kicked`가 ko "맞으셨나요"에 맞음 — 정답 둘 | 선택지 `struck / treated / checked / asked` (ko "맞다"는 struck만) |
| B2 | 13.4 | `see` = "찾아뵐게요" — 정답 둘 | `see` → `wake` (`find / help / wake / thank`) |
| B3 | 14.1 | `fully`가 ko "제대로"와 가까움 | `fully` → `less` (`properly / slowly / less / rarely`) |
| B4 | 11.2 | `for us`가 자연스럽고 ko "연결해 드릴게요"가 다 거르지 못함, 대명사 바꾸기뿐 | 빈칸을 `interpreter`로: `interpreter / x-ray / IV / ice pack`(모두 `an`과 맞음, ko "통역사"가 거름) |
| B5 | 4.0 | `heavy/old`는 `How … was the car going`에 문법으로 걸러짐 | `fast / far / long / slowly` |
| B6 | 0.2 | `tomorrow/twice/later/now` 시간 묶음, 가르치는 말이 아님 | 빈칸을 `head to toe`로: `head to toe / side to side / front to back / heel to toe` |
| B7 | 2.3 | `fast/strong`은 혈압과 연어가 안 맞아 걸러짐 | `low / high / better / unstable` |
| B8 | 4.4 | `standing/kneeling`(차 안) 동떨어짐 | `sitting / trapped / sleeping / lying` |
| B9 | 5.0 | `thanking/warning/calling` 동떨어짐 | `assessing / moving / transferring / discharging` |
| B10 | 5.1 | 부사 묶음(`slowly/rarely`) | `heavily / lightly / internally / a little` |
| B11 | 13.0 | 부사 묶음(`slowly/gently`) | `fast / later / partly / carefully` |
| B12 | 20.1 | 부사 묶음(`slowly/gently`) | `early / late / loosely / later` |
| B13 | 19.1 | `slowly` 되풀이 | `straight / first / later / back` |
| B14 | 7.4 | `slowly` 되풀이, `briefly/rarely`도 3.0·5.1과 겹침 | `closely / rarely / briefly / hourly` |
| B15 | 19.4 | 5.4와 오답 셋(`visit/warn/thank`)이 같음 | `update / find / call / meet` |
| B16 | 15.1 | `cover the pressure` 연어로 걸러짐 | `release / increase / measure / check` |
| B17 | 12.1 | `back side/front side`가 관용으로 걸러짐(사소) | `left / right / other / far`(선택) |

(3.0·9.4·14.1·15.4의 `slowly`는 위로 9 → 4로 줄어 그대로 둬도 된다. 15.4는 문장 자체가 결정 11 보고 대상.)

### decoy (6 + 경계선 7)
- 2.0 `for you` → `your temperature` (끼우면 `…blood pressure for you now`가 ko와 같음)
- 3.1 `for you` → `when you sit up` (`Does it hurt for you when I press here?`)
- 4.1 `at the time` → `a helmet` (`Were you wearing a seatbelt at the time?`가 ko와 같음)
- 9.3 `with your hand` → `the dressing` (`…pull on the object with your hand`가 ko와 같음)
- 10.0 `on the floor` → `your hip` (`Did you hit your head on the floor when you fell?`가 ko와 같음)
- 17.3 `for ten` → `Rhythm check` (`hold compressions for ten` = "잠깐 멈춰")
- 경계선(선택): 0.0 `at the scene` → `your address` · 3.0 `if you can` → `when you cough` · 11.0 `if you can` → `the bleeding` · 3.4 `for the doctor` → `on the monitor` · 4.0 `on the road` → `how far` · 7.1 `on your own` → `your arms` · 9.1 `in the bed` → `very awake`
  (새 decoy 13개 모두 청크와 다르고 `en` 안에 없음을 확인)

### distractorsKo (15문장 + 사소 3)
| 문장 | 문제 | 바꿀 오답 |
|---|---|---|
| 0.4 | 둘 다 외상 원칙을 뒤집은 말(`가장 아픈 곳부터 치료할게요`·`보이는 상처부터 소독할게요`), 첫째는 정답과 반만 다름 | `숨쉬기 불편한 데가 있는지 말씀해 주세요` · `가족분 연락처를 알려 주세요` |
| 3.0 | `아프지 않은 곳도 가리켜 주세요` 뒤집기 | `언제부터 아팠는지 말씀해 주세요` |
| 11.0 | 3.0과 오답 둘이 글자까지 같음 + 뒤집기 | `통증이 몇 점인지 손가락으로 보여 주세요` · `통역사가 곧 연결돼요` |
| 6.4 | `작은 부상은 저절로 낫는 경우가 많아요` 정답 뒤집기 | `상처는 소독하고 붕대를 감을게요` |
| 14.0 | `얼음주머니를 대 드릴게요` 반대말(저체온 장면) · `땀을 닦아 드릴게요` 어색 | `젖은 옷을 벗겨 드릴게요` · `수액을 데워서 넣을게요` |
| 3.4 | `아픈 부위마다 진통제를 놓을게요` 할 법하지 않음 | `아픈 부위에 얼음을 대 드릴게요` |
| 8.2 | 둘 다 외상 문진 장면 밖(`식후에 드셔야`·`보호자께 맡겨 둘게요`) | `이 약은 언제부터 드셨어요?` · `피 검사로 응고 수치를 볼게요` |
| 8.3 | `약 때문에 금식은 하지 않아도 돼요` 장면 밖 | `약 때문에 머리 CT를 찍을 거예요` |
| 10.3 | `천천히 일어나셔도 괜찮아요` — 낙상 외상 환자에게 사정 전 할 말이 아님(안전) | `검사 결과가 나오면 알려 드릴게요` |
| 12.4 | `왼쪽으로 누우면 혈압이 더 쉽게 재져요` 지어낸 말 | `아기 심장 소리를 들어 볼게요` |
| 15.0 | `오른쪽 어깨가 많이 아픈지 말씀해 주세요` 긴장성 기흉 악화 장면 밖 | `산소를 더 올릴게요` |
| 20.1 | `기도가 부어서 약을 먹으면 안 돼요` 지어낸 말 | `얼굴에 차가운 거즈를 대 드릴게요` |
| 1.4 | `답답하신 건 알지만 숨은 편히 쉬어도 돼요` — 앞 절이 정답 "불편하신 건 알지만"과 같음 | `곧 엑스레이를 찍으러 갈게요` |
| 15.2 | `눈을 감지 마세요` ≈ `Stay with me`(정신 차리세요) | `산소마스크를 씌워 드릴게요` |
| 19.4 | `수술 중에 경과를 알려 드릴게요` — 정답과 때만 다름 | `대기실 위치를 알려 드릴게요` |
- 사소(선택): 9.0 `물체 크기를 재고 있어요` → `물체 주변을 거즈로 받칠게요`, 16.1 `붕대를 풀고 상처를 확인하고 있어요`(대량 출혈에 붕대를 풀지 않음) → `상처 사진을 찍고 있어요`, 18.3 `기도에 튜브가 들어가 있고 인공호흡 중`(`Airway is secure`가 삽관 상태로도 쓰여 반 겹침, 경계선).
- 되풀이(사소): `어지러우면 바로 말씀해 주세요` 3문장(10.3 14.2 20.3), `혈액형 검사는 이미 끝났어요` 2문장(7.2 13.0).

### order (10장 + 참고 1)
교환 세 가지는 새 4줄로 다시 읽었다. `ko`·`note`는 줄에 맞춰 같이 바꾼다. 카드 why의 "가리키는 말" 목록도 새 줄에 맞춘다.
- **O1 S6** (심각 5, 보고 2) → L1 그대로 / L2 그대로 / **L3 `To find it, tell me—does your belly feel tender or full anywhere?`**(ko: 그걸 찾으려면, 배가 어디 아프거나 팽만한지 말씀해 주세요, note 문진) / **L4 `Whatever you feel, we're getting scans to look inside.`**(ko: 어떻게 느끼시든 안쪽을 보는 스캔을 찍을 거예요, note 검사). `it`이 L2의 문제를, `Whatever you feel`이 L3의 답을 받는다. 1↔2·2↔3·3↔4 모두 깨짐.
- **O2 S19** (보고 3) → L3 **`To take him there, the surgeon needs your consent first.`**(ko: 그리 모시려면 먼저 외과 선생님이 동의를 받아야 해요) / L4 **`After that, I'll come back and update you as soon as he's out of surgery.`**(15단어). `there`가 L2의 수술실을 받아 2↔3이 깨지고, 동의 주체가 바로잡힌다.
- **O3 S17** (심각 4) → L1 그대로 / L2 **`Bilateral chest decompression now, while compressions continue.`** / L3 **`Two minutes—hold compressions for a pulse check.`** / L4 **`During that pause, ultrasound for cardiac tamponade.`** 2↔3은 "압박 멈춤 뒤 압박 계속 중 감압"으로 모순, 3↔4는 `that pause`가 갈 곳이 없어 깨짐. why: "압박을 이어 가며 감압하고, 2분이 되면 맥박 확인 멈춤에 초음파로 압전을 봐요 — 가역 원인을 동시에 다루면서 압박 중단을 줄여요."
- **O4 S15** 3↔4가 열림(`while that's happening`이 L2의 "압력이 차오르는 중"도 받음) → L4 **`Stay with me—once that's done, we'll check your breathing again.`**(12단어, `that`이 L3의 감압만 받음).
- **O5 S9** L4 `Until then`(스캔 전까지만 가만히 — 시간 한정, 3↔4도 약하게 열림) → **`Through those scans and until surgery, try to stay very still for me.`**(13단어, `those scans`가 L3에 묶임).
- **O6 S7** L3 `While the binder is on`(ko "대는 동안"과 어긋남, 시간 한정) → **`With the binder on, we're getting blood ready for you.`** / L4 혈압 하나로 수혈을 정한다는 말(순환 불안정 장면, 출혈성 쇼크에서 혈압은 늦게 떨어짐) → **`Your pulse and blood pressure will tell us how soon you need that blood.`**(14단어).
- **O7 S14** L4 사실 문제(심각 6), 2↔3 경계선 → L3 **`Keeping that temperature up helps your blood clot properly.`**(ko: 그 체온을 지키면 피가 제대로 굳어요) / L4 **`Since clotting depends on it, tell me right away if you start shivering.`**(ko: 응고가 체온에 달려 있으니 떨리기 시작하면 바로 말씀해 주세요). why에서 "떨림이 더 나쁘게"를 "떨림은 체온이 떨어진다는 신호"로.
- **O8 S8** (보고 3) L3 → **`Good to know when you took it—now tell me every other medication you take.`**(14단어).
- **O9 S4** L3 `Did the belt hold you in, or…`는 L2에 "예"라고 답했다는 전제 → **`Belted or not, were you thrown from the vehicle at all?`** / L4 `how the crash ended` → **`After all of that, do you remember how the crash happened?`**(기억 상실을 묻는 문장 4.3과 같은 말).
- **O10 S1** 3↔4가 약하게 열림(`So please bear with us`는 L3 없이도 붙음) → L4 **`Please bear with that discomfort until the doctor clears your neck.`**(`that discomfort`가 L3에 묶임).
- 참고: S0 L4 note `노출` → `전신`(심각 3과 맞춤). S11 L3 `Now that you see it`은 어색(선택: `Now that you've seen how, point to where the pain is worst.`).

### context `word`·`ko`, swap `ko` (5 + 선택 2)
- S3 `owie` → `side` / `옆구리(옆쪽)` · S7 `belt thing` → `binder` / `골반 바인더` · S11 `language access services` → `interpreter` / `통역사` · S19 `stat` → `OR` / `수술실` (위 보고 1의 표)
- S1 swap `ko` "의사가 경추 손상이 없다고 확인할 때까지…" — 정답 `make sure your neck is okay`(쉬운 말, 주어 we)와 말투·주어가 다름 → `목에 이상이 없다고 확인될 때까지 목 보호대는 그대로 둡니다`
- (선택) S2 `tachycardic` → `shock index` / `쇼크지수`(세 장면 모두에 있어 W14 해소) · S6 `hemorrhage` → `occult` / `숨은(겉으로 안 보이는)`(세 장면 모두)

### tag·icon (사소 2)
- 2.3 icon `chartup` → `monitor` · 4.0 icon `gear` → `siren`(선택)

## 결정 11 보고 (base 문장 — v46이 고치지 않음, 따로 판단)

1. **15.4 `We're moving fast because this side is losing pressure quickly.`** / ko "이쪽이 빠르게 압력을 잃고 있어서" — 긴장성 기흉은 그쪽 흉강 압력이 **오른다**. 사실이 거꾸로다. 제안: `…because the pressure on this side is building quickly.` / "이쪽 압력이 빠르게 차오르고 있어서". (why도 이유만 말하고 임상 설명이 없음)
2. **2.1 `Do you feel dizzy when you lift your head?`**(+ S2 order L3) — 다발외상에서 경추가 확인되기 전 환자에게 머리를 들게 하는 질문이다(S1이 바로 "목을 움직이지 마세요"). 제안: `Do you feel dizzy or lightheaded right now?`
3. **14.3 `Shivering can make it harder for your blood to clot.`** — 응고를 떨어뜨리는 것은 저체온이고 떨림은 그 신호다. why가 잘 풀었으니 급하지 않음. 제안: `Getting cold can make it harder for your blood to clot.`
4. **19.2 `I need your consent to proceed immediately.`** — 수술 동의는 외과의가 받는다. 간호사 말로는 `The surgeon needs your consent to proceed immediately.`가 맞다(W4로 why만 보완).
5. 청크가 구 경계를 끊은 것(대부분 keyPhrase라 보고만): 0.1 `for me—does it hurt`, 1.0 `your neck—hold still`, 2.2 `high—we're watching you`, 6.1 `pale—we're watching for`, 15.2 `me—we're helping you`, 16.2 `me—open your eyes`, 17.0 `compressions—checking for`, 17.3 `now—hold compressions`, 17.4 `compressors—continue at`, 18.4 `internal bleeding—next scan`.
6. 그 밖: 8.4 `even the small dose ones`(어색한 영어), 4.4·16.4 `words: []`.

## 개수

why 4(+선택 4) · 빈칸 17 · decoy 6(+경계선 7) · distractorsKo 15(+사소 3) · order 10(+참고 1) · context·swap 5(+선택 2) · tag·icon 2(사소)
= **고칠 것 59건**(선택·경계선·사소 제외). 그중 사실·안전: 빈칸 정답 둘 2(9.2 13.4), why 1(0.2), order 3장(S17 S6 S14). 결정 11 보고 6건(그중 사실 2: 15.4, 2.1).

## 종합

자기 점검 8~10은 효과가 있었다. distractorsKo 뒤집기(45~70 → 12문장), context `word` 장면 부재(→ 0), 조건절로 시작하는 order 줄(→ 0)이 모두 줄었다.
남은 것은 꼴만 바뀐 같은 갈래들이다: 어색한 말을 `word`로 고른 4건, `While/Once/Until then`으로 남은 시간 한정 3장, 그리고 부사 `slowly` 묶음 9문장.
**빈칸 2건(9.2·13.4), 끼우면 `ko`와 같은 문장이 되는 decoy 6건(2.0 3.1 4.1 9.3 10.0 17.3), why 0.2, order S17·S6·S14를 고치면 내보내도 된다**
(빈칸·decoy는 학습자가 맞는 뜻을 만들고도 틀리는 같은 갈래). base 15.4의 거꾸로 된 압력은 결정 11로 따로 고쳐야 한다 — `en`이 바뀌므로 chunks·words·keyPhrase도 다시 맞춰야 한다.
