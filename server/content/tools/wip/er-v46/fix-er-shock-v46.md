# er-shock — v46 보강 검토 (er)

대상: `er-shock.yaml` (상황 22 · 문장 110 · order 22장 · 뉘앙스 swap 7 · context 16). 문장 110개와 order 22장을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 저혈압 초기 활력 인지 … S21 = 부신위기 저혈압). 문장은 `상황.문장`(0부터), order 줄은 L1~L4로 적는다.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 440줄, decoy를 청크 자리마다 바꿔 넣은 조립과 끼워 넣은 조립(약 860줄),
order 인접 교환 66가지(22장 × 3), order 줄 단어 수, swap 7건(정답 선택지를 넣은 문장과 `ko` 대조), context `word`가 장면에 나오는지,
decoy 중복, 빈칸 오답 반복. 빈칸을 다른 말로 옮기자고 한 6건(15.1 15.4 4.4 12.4 21.3 18.1)은 새 answer가 `en`에 낱말 경계로
**정확히 한 번** 나오는지 스크립트로 확인했다. 새 decoy 2개도 청크·`en`과 겹치지 않는지 확인했다.

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 문법이 맞고
장면상 그럴듯해도 `ko`가 걸러 주는 오답·decoy는 괜찮은 것으로 봤다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식의 이유를 짚는다. 저작자가 확신이 덜하다던 4건은 모두 맞다. 틀린 것은 18.1 하나다(O형 음성을 일률 규칙처럼 설명). 과장이나 어긋난 풀이가 몇 건 있다(20.2 central monitoring → "중심 라인", 14.1 짝 맞춤 오류, 20.3 "가장 강한 근거", 15.1 "늦어도"). |
| 2 | 빈칸 | 3 | `ko`로 다 걸러지지 않아 정답이 둘이 될 수 있는 것: 6.4 `drowsy`(ko "혼미"), 5.4 `send`, 18.4 `flushed`, 9.0 `back`. 관용구·문법으로 걸러지는 것: 12.3, 12.4, 21.3, 12.0. 장면과 동떨어진 것: 11.3 `loudly`, 18.1 `saline/oxygen`, 4.4 `allergy/rash/infection from the fall`. 시간 단위 묶음이 15.1·15.4 두 문장에 바로 이어 나온다. 증상 형용사 묶음(dizzy/nauseous/cold/sweaty/shaky)과 raise/hold 묶음도 되풀이되지만 `ko`가 걸러 준다. |
| 3 | `decoy` | 4 | 약 860줄 대부분은 비문이거나 `ko`와 어긋난다. `ko`에 맞는 다른 문장이 되는 것은 5.4 `to be safe` 하나다(`in case you need it` 자리). 12.1 `Hurts a lot`은 경계선이다. 중복이 많다: `on your own`·`for the doctor` 각 3번, 그 밖에 7개가 2번씩 나온다(사소). |
| 4 | `distractorsKo` | 3 | 같은 상황에서 할 법한 말이 절반이 넘는다(5.1, 8.x, 17.0, 19.0, 20.0은 좋다). 그러나 (a) 아무도 하지 않을 말·사실이 아닌 말이 약 20개 있다(`이 수액은 열을 내려 줘요`, `혈압이 낮으면 피가 묽다는 뜻이에요`, `퇴원을 권고합니다`, `소변량을 비우세요`, `정맥로를 소독하고 닫아 두세요` 등). (b) 정답과 반만 다른 말이 약 8개 있다(12.1, 17.2, 18.1, 18.3, 19.4, 21.4 등). 동료 장면에는 `그의/그녀의` 번역투도 있다. |
| 5 | `order` | 2 | 앞 줄을 가리키는 말로 묶는 설계는 잘 지켰다. 인접 교환이 자연스러운 카드는 S15·S20(2↔3) 두 장이고, S17(3↔4)·S12(2↔3)는 경계선이다. 문제는 **임상 흐름**이다. 모든 환자에게 하는 확인을 조건부로 만든 카드가 6장(S4 S6 S7 S11 S15 S16)이다. 앞뒤가 맞지 않는 카드는 S1·S9·S13이다. 15단어를 넘는 줄이 4개다(S8 L2 17, S21 L4 17, S14 L3 16, S17 L3 16). |
| 6 | `tag`·`icon` | 4 | 태그가 역할을 말하고 상황 안에서 일관된다. 사소한 것 둘: 0.3 `chartup`(혈압이 "낮다"는 문장), S20 order 태그 `SBAR`(영어 — 다른 카드는 `대화 흐름`). |
| 7 | context `word`·`ko`, swap `ko` | 4 | swap `ko` 7건은 모두 정답을 넣은 문장의 뜻이다. context에서 `ko`가 틀린 뜻인 것은 S3 `fluid` → `수액` 하나다(장면은 탈수·체액 부족이다). 그 밖에 `word`가 장면에 글자로 나오지 않는 것이 9개 있다. 뜻으로는 장면과 맞으니 낮은 우선순위로만 적는다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없다(T8) — 확인했다. (2) 동떨어진 오답 3문장, 문법·관용구로 걸러지는 오답 4문장, 시간 단위 되풀이 2문장. (3) order를 못 박는 연결어는 대체로 좋다. 2↔3 교환이 되는 카드가 2장이다. (4) 임상 순서·사실: order 조건부 6장, why 1건(18.1). (5) 반만 다른 오답 뜻 약 8개, `ko`에 맞는 decoy 1개. |

## 사실 오류·심각한 문제

"이어진 검토에서 되풀이된 것"의 **모든 환자에게 하는 확인을 조건부로** 갈래가 order 6장에서 나왔다. 학습자는 이 카드를 대화 순서로
외우므로, 조건문이 붙으면 "그럴 때만 한다"로 배운다.

1. **S7 L2 `If it does, that needs urgent attention, so we're getting an ECG now.`** — 통증이 팔·턱으로 퍼질 때만 심전도를 찍는다는 말이 된다.
   흉통 환자는 방사통이 없어도 도착 10분 안에 12유도 심전도를 찍는다(AHA/ACC). 심인성 쇼크 감별 장면이라 더 그렇다.
2. **S4 L4 `If you did, let's check your head and arms for any injury.`** — 다쳤다고 답해야 살펴본다는 흐름이다. 같은 상황 4.4의 why가 바로
   "환자 본인이 모르는 멍이나 상처가 있을 수 있어서 직접 살펴봐요"라고 한다. 실신 후 낙상 환자는 답과 상관없이 외상을 사정한다.
3. **S11 L3 `If any of those happened, we're checking your blood count and clotting right away.`** — 항응고제를 먹는 저혈압 환자의 CBC·응고 검사는
   넘어짐·멍·흑변이 있을 때만 하는 검사가 아니다. 11.2 문장도 조건 없이 말한다.
4. **S6 L4 `Once those are drawn, we'll start antibiotics and fluids.`** — 수액이 배양 채취를 기다리는 흐름이다. 배양을 먼저 하는 것은 **항생제**이고,
   수액은 곧바로 시작한다. 같은 상황 6.2(`drawing cultures and lactate and starting fluids fast`)와도 어긋난다.
5. **S15 L4 `Once the antibiotics are in, keep checking her blood pressure every few minutes.`** — 몇 분 간격 혈압 확인은 승압제를 시작한 순간부터 한다.
   항생제가 들어간 뒤로 미루는 말이 되면 안 된다.
6. **S16 L2 `If that's right, get a bedside echo to look at the right heart.`** — 초음파는 폐색전 의심이 맞는지 **확인하는** 검사다. "맞다면 초음파"는
   순서가 거꾸로다. 카드 why("그것이 맞는지 보려고 초음파")와도 다르다.
7. **18.1 why "혈액형을 확인하기 전에는 O형 음성 혈액을 쓰고"** — 미국에서 교차시험 전 응급 수혈은 O형 혈액이다. O형 음성은 가임기 여성(또는 성별·나이를 모를 때)에
   우선 쓰고, 남성과 고령 여성에게는 O형 양성을 흔히 쓴다. 이 상황의 환자는 `He`(18.3)다. 일률 규칙처럼 가르치면 안 된다.
8. **S9 order의 시간·논리 충돌** — L1 `After the fluid, your pressure came up`(이미 수액을 줌) 다음에 L2 `We'll recheck … after the bolus`(볼루스가 아직 남은 것처럼)가 온다.
   L4 `If neither one improves`는 L1에서 이미 오른 혈압과 맞지 않는다.
9. **6.4 빈칸 `drowsy`** — 정답 문장의 `ko`가 "정신이 **혼미한**"이다. 혼미(의식이 흐림)는 drowsy로도 읽혀 `Feeling this drowsy can be an early sign of infection`이
   `ko`에 맞는다. 정답이 둘이 될 수 있다.

## 저작자 자기 보고 3건 판정

1. **현장에서 말이 되는 같은 분야 오답** —
   - `check your temperature`(0.0): 장면상 말이 되지만 `ko` "맥박을 확인할게요"가 거른다. **그대로 둬도 된다.**
   - `Are you stopping any blood thinners?`(5.1): 말이 되지만 `ko` "복용하고 계신가요"가 거른다. **그대로 둬도 된다.** (skipping/stopping/missing 셋이 모두
     "안 먹음" 쪽이라 고르기 쉽지만, 정답이 둘인 문제는 아니다.)
   - `as soon as practical`: **파일에 없다.** 12.4의 실제 오답은 `necessary/likely/helpful`이다. 이쪽 문제는 정답이 둘이 아니라 관용구 `as soon as possible`을 깨서
     읽기만 해도 걸러진다는 것이다 → 빈칸을 옮긴다(아래).
   - 같은 부류로 장면상 말이 되지만 `ko`가 걸러 주는 것: 1.2 `sitting`(기립 혈압은 앉은 자세도 잰다), 2.3 `blood`, 5.2 `warm`, 14.2 `echo/ultrasound`, 16.2 `pharmacy`,
     19.3 `cardiogenic/hypovolemic/septic`, 20.0 다른 쇼크 유형. 모두 그대로 둬도 된다.
   - 저작자가 꼽지 않았지만 `ko`가 다 걸러 주지 못하는 것: 6.4 `drowsy`(위 9), 5.4 `send`(`send labs`는 채혈해 보낸다는 말로 쓰여 `ko` "채혈하고"와 가깝다),
     18.4 `flushed`(`ko` "유지하세요"가 관 개통 유지로도 읽힘), 9.0 `back`(`came back a little`이 "조금 회복됐다"로 읽힘) → 고칠 것.
2. **확신이 덜한 `why` 4건 — 모두 맞다.**
   - 10.1 승압제 중심정맥관 선호: 맞다(혈관 밖 유출 시 조직 손상). 덧붙이면 SSC 2021은 중심정맥관을 기다리느라 승압제를 늦추지 말고 굵은 말초 정맥로로
     먼저 시작해도 된다고 한다. "보통 … 선호해요"라는 표현이 이 여지를 남기므로 고칠 필요는 없다(선택: 한 줄 덧붙임).
   - 15.2 MAP 65 이상 목표: 맞다(SSC 2021 초기 목표 65 mmHg).
   - 15.1 항생제 한 시간 안: 맞다(SSC 2021: 쇼크 가능성이 있으면 즉시, 가능하면 한 시간 안에). 다만 "늦어도"는 "이상적으로는"이 더 정확하다(사소).
   - 6.3 항생제를 늦추지 않으면서 배양 먼저: 맞다(SSC: 항생제를 크게 늦추지 않는 한 배양 먼저).
3. **`distractorsKo`가 같은 맥락이라 정답과 가까울 수 있음** — 정답이 둘인 것은 대부분 아니다. 6.0(`이불을 걷어 드릴게요`·`심전도를 붙일게요`)처럼 정답 문장의
   한 낱말만 겹치는 미끼는 들을 때 구별된다. 진짜 문제는 반대쪽이다. "같은 맥락"을 만들려다 **아무도 하지 않을 말·틀린 말**을 지어낸 것(약 20개)과
   정답 틀을 그대로 두고 한 부분만 바꾼 **반만 다른 말**(약 8개)이다. 아래 목록.

## 고칠 것 (v46 필드)

### why (11)
- 18.1 · O형 음성을 일률 규칙처럼 말함(사실 7) → "명사구와 지시를 짧게 이어 급박한 말투를 보여 줘요. 혈액형을 확인하기 전에는 교차시험 없이 O형 혈액을 쓰고(가임기 여성은 O형 음성), 굵은 정맥로 두 개로 빠르게 넣어요."
- 14.1 · "열은 감염, 출혈, 가슴 통증은 심장"에서 짝이 어긋남 → "열은 감염, 출혈은 혈액 손실, 가슴 통증은 심장, 새 약은 약물 반응 — 저혈압의 서로 다른 원인을 한 번에 훑어요."
- 20.2 · `central monitoring`을 "중심 라인"으로 풀어 문장 뜻(집중 감시, ko)과 어긋남 → "… 승압제를 둘이나 쓰는 환자는 중환자실 수준의 집중 감시가 필요해 입실을 권해요."
- 10.4 · "빨리 퍼져요"가 중심정맥관을 쓰는 주된 이유처럼 들림 → "… 중심정맥관은 큰 혈관으로 바로 들어가 약이 새어 조직을 상하게 할 위험이 적고, 효과도 고르게 나요."
- 14.4 · 원인 미상 저혈압에서 "불필요한 검사를 줄여요"는 근거가 약함(불안정하면 침상 초음파를 먼저 함) → "first, then으로 다음 단계를 알려 환자가 기다리는 이유를 알게 해요. 영상 검사는 결과를 보고 의사가 정해요."
- 15.1 · "늦어도 한 시간 안에" → "가능한 한 빨리, 이상적으로는 한 시간 안에".
- 20.3 · "가장 강한 근거" 과장 → "쇼크가 매우 심하다는 분명한 신호예요".
- 5.1 · "any를 붙이면 처방약과 약국에서 산 약을 모두" 근거 약함, "가장 먼저" 과장 → "any로 종류를 가리지 않고 묻는 거예요. 항응고제는 출혈을 오래 끌 수 있어서 출혈 환자에게 꼭 확인해요."
- 3.4 · "감시가 아니라 돌봄으로 들려요" 근거 약함 → "watch how much …로 마시는 양을 우리가 챙긴다고 알려요. 섭취량 기록은 …(뒷문장 유지)".
- 2.3 · 둘째 문장이 `ko`를 되풀이함 → 둘째 문장을 "그래서 굵은 정맥로 하나를 미리 잡아 두면 위급할 때 다시 바늘을 찌르지 않아도 돼요."로.
- 6.4 · "단정과 환자 탓을 피해요"의 "환자 탓"이 맥락에 없음 → "단정을 피해요".

### 빈칸 (blank, 13문장)
정답이 둘이 될 수 있음:
- 6.4 · `drowsy` ↔ ko "혼미한"(사실 9) → `drowsy` 대신 `thirsty` (`confused*/shaky/cold/thirsty`).
- 5.4 · `send labs`가 `ko` "채혈하고"와 가까움 → `send` 대신 `cancel` (`draw*/order/review/cancel`).
- 18.4 · `Keep … lines flushed`가 `ko` "유지하세요"로 읽힘 → `flushed` 대신 `paused` (`running*/labeled/clamped/paused`).
- 9.0 · `came back a little`이 "조금 회복"으로 읽힘(낮음) → `back` 대신 `out` (`up*/down/off/out`).

문법·관용구로 걸러지는 오답:
- 12.3 · `Squeeze my hand never/always/again for yes` 비문 → `once*/three times/hard/gently` (`ko` "한 번"이 거름).
- 12.4 · `as soon as necessary/likely/helpful`은 관용구를 깨서 읽기만 해도 걸러짐 → 빈칸을 `interpreter`로 옮김: `interpreter*/doctor/pharmacist/chaplain`.
- 21.3 · `stop twice/partly/quietly` 비문·동떨어짐 → 빈칸을 `plan`으로 옮김: `plan*/reason/refill/warning`.
- 12.0 · `Vomiting? / Fever? Point to where.`는 가리킬 수 없어 걸러짐 → `Bleeding*/Swelling/Bruising/Rash`.

장면과 동떨어진 오답:
- 11.3 · `loudly drop` → `quietly*/visibly/rarely/suddenly` (`ko` "조용히"가 거름).
- 18.1 · `O-negative saline/oxygen` → 빈칸을 `O-negative`로 옮김: `O-negative*/AB-positive/A-negative/B-positive` (`ko` "O형 음성"이 거름).
- 4.4 · `any allergy/rash/infection from the fall`은 `from the fall`과 어울리지 않음 → 빈칸을 `arms`로 옮김: `arms*/legs/hips/ribs` (`ko` "팔"이 거름).

시간 단위 되풀이(두 문장이 이어서 hour/day/shift/week류):
- 15.1 · 빈칸을 `broad-spectrum`으로 옮김: `broad-spectrum*/narrow-spectrum/oral/topical` (`ko` "광범위"가 거름).
- 15.4 · 빈칸을 `blood pressure`로 옮김: `blood pressure*/temperature/blood sugar/urine output` (`ko` "혈압"이 거름).

(낮음, 선택: 10.2 `very quickly/quietly`, 16.3 `later right now`는 문법·논리로 걸러진다. 10.2 → `closely*/briefly/rarely/loosely`. 13.0의 시간 단위는 `ko` "오늘"이 바로 걸러 준다.)

### decoy (2)
- 5.4 · `to be safe` → `in case you need it` 자리에 넣은 `…get blood ready to be safe.`가 `ko` "혹시 필요할 경우를 대비해"에 그대로 맞음 → `for your surgery`.
- 12.1 · `Hurts a lot` → `Hurts a lot? Yes or no?`가 `ko` "여기가 아파요? 예, 아니오?"에 가까움(낮음) → `Can you walk`.
(중복 decoy `on your own`(0.0 2.0 4.4)·`for the doctor`(6.2 10.1 15.3)는 사소하다. 고칠 때 하나씩 다른 말로 바꾸면 좋다.)

### distractorsKo (24문장)
(a) 아무도 하지 않을 말·사실이 아닌 말 → 같은 상황에서 할 법한 다른 말로:
- 2.1 `이 수액은 통증을 줄여 줘요` → `수액은 한 시간쯤 들어가요` / `이 수액은 열을 내려 줘요` → `수액이 들어가는 동안 혈압을 자주 잴게요`
- 9.2 `호전되면 퇴원 준비를 할게요` → `호전되면 수액 속도를 줄일게요`
- 11.3 `혈압이 낮으면 피가 묽다는 뜻이에요` → `검사 결과가 나오면 바로 알려 드릴게요` / `항응고제를 오래 먹으면 혈압이 떨어져요` → `배가 아프거나 불러 오면 바로 말씀해 주세요`
- 13.0 `약은 약사에게 맡기셔도 돼요` → `드시는 약 목록을 가지고 오셨어요?`
- 15.3 `약국에 항생제를 반납하세요` → `약국에 신장 수치를 알려 주세요`
- 15.4 `그녀의 소변량을 비우세요` → `소변 주머니를 비우고 양을 적어 주세요` / `그녀의 체온을 계속 확인하세요` → `체온을 한 시간마다 재 주세요`
- 16.3 `그의 소변량을 비우세요` → `산소를 더 올려 주세요` / `그의 체온과 맥박을 기록하세요` → `보호자에게 상황을 알려 주세요`
- 17.1 `초음파를 끄고 환자를 눕히세요` → `심장내과에 연락하고 수액을 올리세요`
- 18.1 `정맥로는 하나만 잡고 천천히 주세요` → `혈액 가온기를 연결하세요`
- 18.4 `정맥로를 하나 빼서 채혈하세요` → `혈액이 오면 두 사람이 확인하세요` / `정맥로를 소독하고 닫아 두세요` → `혈압을 5분마다 알려 주세요`
- 19.2 `수액과 함께 이뇨제를 고려하세요` → `수액과 함께 혈액도 준비하세요`
- 19.4 `혈압이 오르면 수액을 더 빨리 줄게요` → `맥박이 더 느려지면 아트로핀을 줄게요`
- 20.2 `퇴원을 권고합니다` → `승압제 용량을 더 올리기를 권합니다`
- 20.4 `제 생각엔 그녀가 퇴원해도 될 것 같아요` → `제 생각엔 승압제를 하나 더 써야 할 것 같아요`
- 21.2 `스테로이드를 끊고 수액만 드릴게요` → `혈당을 먼저 재 볼게요`
- 21.4 `위기를 막기 위해 수액을 줄일게요` → `가족분께 연락드릴게요`
- 4.4 `다친 곳을 사진으로 남길게요` → `어디가 제일 아프신지 짚어 주세요` (낮음)

(b) 반만 다른 말 — 정답 틀을 그대로 두고 한 부분만 바꿔 들을 때 정답이 둘:
- 12.1 `여기를 눌러도 아파요?` → `물 마실 수 있어요? 예, 아니오?`
- 17.2 `혈압을 재면서 배액을 준비하세요` → `심낭천자 동의서를 받아 주세요` / `환자를 눕히면서 배액을 준비하세요` → `승압제를 준비해 주세요`
- 18.1 `정맥로 두 개를 잡고 채혈하세요` → `칼슘을 준비해 두세요`
- 18.3 `그는 피를 토하고 열이 많이 나요` → `혈압이 80까지 떨어졌어요` / `그는 구토를 하고 얼굴이 붉어요` → `구토를 하고 얼굴이 붉어요`(주어 빼기)
- 19.4 `수액으로 혈압이 오르면 승압제를 끊을게요` → `목은 계속 움직이지 않게 할게요`
- 21.4 `위기가 오면 하이드로코르티손을 드릴게요` → `혈압을 15분마다 잴게요`
- 16.4 `팀에 연락하고 환자를 안정시키세요` → `약국에 혈전용해제 용량을 물어보세요` (낮음)

(c) 번역투 `그의/그녀의`만 빼기(낮음): 17.3(두 개), 19.3(두 개), 20.1(두 개).

### order (15장 + 선택 3) — 줄을 고치면 카드 `why`도 바뀐 연결어를 가리키게 함께 고친다
- S1 · L2 `When that happens, how much have you had to drink today?`는 어지러울 때와 오늘 마신 양을 잇지 못하고, L3 `Based on that answer`는 기립 혈압 측정을 답에 따라 하는 것처럼 만든다. 고친 뒤 2↔3을 바꾸면 앞뒤가 맞지 않는다 → L2 `Since that started, how much have you been drinking each day?` (ko 그게 시작된 뒤로 하루에 물을 얼마나 드셨어요?) · L3 `Not drinking enough can do that, so I'll check your pressure lying down, then standing.` (ko 물을 덜 드시면 그럴 수 있어서, 누워서 재고 이어서 서서 잴게요)
- S4 · 사실 2 → L4 `Even if you didn't, let's check your head and arms for any injury.` (ko 안 다치셨더라도 머리와 팔에 다친 데가 있는지 볼게요)
- S6 · 사실 4 → L3 `While you think about that, we're starting fluids and drawing cultures and lactate.` · L4 `Once the cultures are drawn, we'll start antibiotics right away.` (ko 생각하시는 동안 수액을 시작하고 배양·젖산을 채취할게요 / 배양 채취가 끝나면 바로 항생제를 시작할게요)
- S7 · 사실 1 → L2 `Pressure like that needs urgent attention, so we're getting an ECG now.` (ko 그런 압박감은 급히 봐야 해서 지금 심전도를 찍을게요)
- S8 · L2 17단어 → `That could be a serious reaction, so I'm giving epinephrine in your thigh now.` (14단어)
- S9 · 사실 8 → L2 `That's a good sign, so we'll recheck it in fifteen minutes.` · L3 `Until then, we're also watching your urine output.` · L4 `If neither keeps improving, we'll add another treatment.` (ko 좋은 신호예요, 15분 뒤 다시 잴게요 / 그때까지 소변량도 지켜볼게요 / 둘 다 더 나아지지 않으면 다른 치료를 더할게요)
- S11 · 사실 3 → L3 `Even without any of those, we're checking your blood count and clotting now.` (ko 그런 일이 없었더라도 혈구 수와 응고 기능은 지금 확인할게요)
- S13 · L4 `If so, too many pills at once can make you feel very dizzy.`는 조건문 뒤에 일반론이 와서 어색하다 → `If so, that could explain why you feel so dizzy.` (ko 그렇다면 그래서 많이 어지러우신 걸 수 있어요)
- S14 · L3 16단어, `Based on what you've told me`가 L1 바로 뒤에도 붙음 → `To sort all of that out, we're running labs and an ECG.` (ko 그걸 가려내려고 피검사와 심전도를 할게요)
- S15 · 사실 5. 그리고 2↔3이 자연스럽다(L3 `While you do that`이 L1의 승압제 시작에도 붙음) → L3 `While you recheck it, I'll call the pharmacy and get antibiotics moving.` (`it`이 L2의 젖산을 가리킴) · L4 `While both are going in, keep checking her blood pressure every few minutes.`
- S16 · 사실 6 → L2 `To check that, get a bedside echo to look at the right heart.` (ko 그걸 확인하려면 침상 초음파로 우심장을 보세요). 카드 why의 "맞는지 보려고"와도 맞게 된다.
- S17 · L3 16단어 → `If it confirms tamponade, get the kit ready — we may need to drain now.` (14단어). 3↔4는 경계선이다(`the drain`이 L2의 심낭천자 키트에도 붙음) → L4 `While we prepare that drain, give a fluid bolus.`(선택)
- S18 · L4 `Once those lines are going, call GI`는 협진을 정맥로 뒤로 미룬다 → `While those lines run, call GI for emergent endoscopy.`
- S20 · 2↔3이 자연스럽다(L3 `Because of that`이 L1의 "still hypotensive"에도 붙고, 그 뒤 L2 `Since I started that`이 두 번째 승압제로 읽힘) → L3 `Because of those changes, we added a second pressor, but her pressure keeps dropping.` (`those changes`가 L2의 소변량·젖산을 가리킴)
- S21 · L4 17단어 → `After the hydrocortisone works, remember: don't stop steroids suddenly without a plan.` (12단어)

선택(낮음):
- S10 L2 `so it works quickly` — 중심정맥관을 쓰는 주된 이유는 안전이다 → `It goes through a line in your neck, the safest way to give it.`
- S12 2↔3 경계선(`Same way`가 L1의 짚기·예/아니오에도 붙음) — 그대로 둬도 된다.
- S19 L3 `While his neck stays still`은 시간 한정처럼 들리고, L3 `consider a pressor`와 L4 `we'll give a pressor`가 겹친다 → L3 `With his neck kept still, give fluids and consider atropine for the slow rate.`

(S0 S2 S3 S5 S8(길이 빼고) S10 S19는 교환 셋이 모두 어색해 순서가 고정된다. S5 L3 `With both of those answers`는 답을 근거로 삼는 말이지 "그럴 때만"이 아니어서 그대로 둔다.)

### context `word`·`ko` (1 + 낮음 9)
- S3 · `word: fluid`, `ko: 수액` — 장면은 `dehydrated`·`volume-depleted`(체액 부족)이고 `ko` "수액"(정맥 수액)은 다른 뜻이다 → `word: volume-depleted`, `ko: 체액이 부족한` (장면 2·3에 그대로 나옴).
- (낮음) `word`가 장면에 글자로 나오지 않는다. 뜻으로는 맞으니 고칠 여유가 있을 때 장면에 실제로 나오는 말로 바꾼다:
  S0 `circulation` → `capillary refill`(세 장면) · S6 `infection` → `sepsis`(세 장면) · S10 `hold` → `MAP`(세 장면) · S14 `cause` → `etiology`(세 장면) ·
  S17 `drain` → `pericardiocentesis`(세 장면) · S15 `norepinephrine` → `refractory`(장면 1·3) · S9 `output` → `UOP`(장면 1·3, ko 소변량) ·
  S5 `ready` → `crossmatched`(장면 1·3) · S19 `precaution` → `immobilized`(장면 2·3).

### tag·icon (2, 낮음)
- 0.3 `chartup` → `monitor` (혈압이 "낮다"는 문장).
- S20 order `tag: SBAR` → `보고 흐름` (태그는 한국어로, 다른 카드는 `대화 흐름`).

## 결정 11 · base 보고 (v46 범위 밖, 고치지 않고 보고만)
- 9.1 `We're watching your urine output as a good sign.` / ko `소변량을 좋은 신호로 보고 지켜보고 있어요` — 영어·한국어 모두 어색하다. `…for signs that you're improving`이 자연스럽다.
- 11.4 `Let's ask if you missed a dose or took extra medicine.` — 환자에게 직접 묻는 자리에서 `Let's ask`는 제3자에게 묻자는 말로 들린다. `Can I ask if you…`가 자연스럽다.
- 19.2 en은 명령(`Give fluids and consider…`)인데 ko는 `수액 주고 있고요 — … 고려해야 할 것 같아요`(진행·제안)여서 뜻이 어긋난다.
- 21.3 `Steroids can't just stop suddenly without a plan.` — 주어가 어긋난다(스테로이드가 스스로 멈추는 말). `You can't just stop steroids suddenly without a plan.`
- 20.2·20.4 `central monitoring` — 미국 병원에서 central monitoring은 중앙 원격 모니터(텔레메트리 스테이션)를 뜻하기 쉽다. `close monitoring`이 `ko` "집중 감시"에 맞는다.
- 21.4 `…to help prevent a crisis` — 이 상황은 이미 부신위기 저혈압이다(낮음).
- 3.2·3.4, 7.2·7.4, 16.2·16.4, 19.0·19.3은 같은 상황 안에서 뜻이 거의 겹친다(낮음).
- 청크가 구 경계를 끊는 것: 15.1 `in within / the hour`, 18.0 `Activate the massive / transfusion protocol`, 0.3 `Your blood / pressure is`, 3.0 `your blood / pressure`, 10.3 `about a new / medicine`.

## 고칠 것 개수
- why 11 · 빈칸 13문장(정답이 둘 4, 문법·관용구 4, 동떨어짐 3, 시간 단위 되풀이 2) · decoy 2 · distractorsKo 24문장 · order 15장 · context 1 · tag·icon 2
- **합계 68** (그중 사실·안전: order 조건부 6장[S4 S6 S7 S11 S15 S16], S9 시간 충돌, why 1[18.1], 빈칸 정답이 둘 1[6.4])
- 선택·낮음: order 3장, context `word` 9, 빈칸 2, 중복 decoy
- 결정 11 보고 8

## 종합
임상 설명은 정확한 편이다(저작자가 걱정한 4건은 모두 맞다). swap `ko`와 decoy도 대부분 잘 됐다. 그러나 order 6장이 모든 환자에게 하는 확인(심전도·외상 사정·CBC/응고·혈압 감시·수액·초음파)을
조건부로 만들어 고쳐야 한다. 18.1의 O형 음성 일률 규칙, `distractorsKo`의 지어낸 말·반만 다른 말 약 30개, 시간 단위·관용구 빈칸도 고쳐야 한다.
위 목록을 반영하고 V18·V19를 다시 통과시키면 내보내도 된다.
