# er-chest-abd-trauma — v46 보강 검토 (er)

대상: `er-chest-abd-trauma.yaml` (상황 21 · 문장 125 · order 21장 · 뉘앙스 swap 5 · context 16). 문장 125개·order 21장을 전부 봤다.
상황 번호는 파일 순서 0부터(S0 = 흉부외상 호흡 사정 … S20 = 흉복부외상 SBAR 인계), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 500줄, decoy를 청크 자리마다 바꿔 넣은 조립과 사이마다 끼운 조립 약 1,200줄,
order 인접 교환 63가지, context `word`가 세 장면의 `en`에 실제로 있는지(W14 0건), 저작자가 고친 장면을 base와 나란히(11상황 16장면 — 자기 보고 "11개 상황"과 맞음),
swap `ko` 5건, `distractorsKo` 부정·중복, decoy·빈칸 오답 중복, base와 v44 필드 비교(단어·문장·뉘앙스 모두 바뀐 것 없음, context 장면 `en`·`fix`·`why`만 예외로 바뀜).
`verify_one_theme.py` → `==> 통과`. W13 경고 4건(`tap`·`severed`·`tub`·`unity`)은 v44 단어 오답이라 이번 범위 밖(결정 11에 보고만).

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다.
문법도 맞고 장면상 그럴듯해도 `ko`가 걸러 주는 오답·decoy는 괜찮은 것으로 봤다(예: 0.0 `heartbeat`, 12.2 `dark`, 18.4 `ICU`, 20.5 `ICU`, 17.4 decoy `to measure`).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 거의 모두 말하는 방식의 이유(가능성으로 말하기·이유 먼저·비교로 말하기)와 임상 근거를 함께 짚고, 사실도 맞다(Kehr 징후, 폐좌상 지연 악화, 장 손상 지연 발현, 박힌 물체 제거 금지, scrubbed in, 혈액 단위 등). 고칠 것은 7.5(표현 오류)와 11.3(젖은 드레싱의 대상), order 카드 why 6건(아래 order 수정과 함께). |
| 2 | 빈칸 | 3 | 정답이 둘인 문장은 20.1 하나(`bike` — `ko` "교통사고"에 맞음). 문제는 세 갈래다. ① 간호사가 할 리 없는 말이 되는 뒤집기 동사 10문장(5.0 `forget/ignore/hide the pain`, 6.5 `skip/cancel/forget`, 10.4 `hide/skip/cancel`, 16.5 `avoid/hide/ignore`, 17.4 `refusing/forgetting` 등). ② 동떨어지거나 문법으로 걸러지는 오답 12문장(4.0 `cost`, 4.4 `speed`, 16.1 `urine/sweat`, 16.3 `dental/billing`, 12.1 `sneezing` 등). ③ 같은 오답 묶음 돌려쓰기 — `hungry/thirsty/sleepy`(2.3·8.4·10.5·19.3), 감각 동사(14.3·15.1), `quietly/rarely/privately`(2.0·6.3·13.5), 시간 단위(6.2·16.4). 관사·문법은 대체로 잘 지켰다. |
| 3 | `decoy` | 4 | 거의 모두 비문이 되거나 `ko`와 어긋난다. `ko`에 맞는 문장이 되는 것은 2.5 `right now` 하나(`I'll let the team know right now if anything changes.`가 `ko` "변화가 있으면 팀에 바로 알릴게요"와 같음). 경계선 3개(12.3·17.4·5.2)는 보고만. 같은 decoy를 여러 문장에 돌려쓴 것(`at night` 4회 등)은 사소하다. |
| 4 | `distractorsKo` | 4 | ER 앞 주제들과 달리 "정답 뒤집기"가 거의 없다(부정어 스캔 14건 모두 같은 상황에서 할 법한 다른 말). 고칠 것은 정답과 반만 다른 말 6개(8.5·16.4·11.4·14.1·19.4·18.1). 중복 4쌍은 사소하다. |
| 5 | `order` | 2 | 앞 줄을 가리키는 말로 묶은 설계는 좋다. 그러나 21장 중 10장에 고칠 것이 있다. 임상 흐름이 틀린 카드: S2(빈맥+저혈압인데 "변하면" 보고), S6(산소가 폐좌상 악화를 막는다고 함·보고 없음), S1(촉진 뒤에 시진), S18(수혈이 수술팀 대기에 달림), S20(배액 400 mL만으로 수술 요청), S13(통역 연결 전에 영어로 병력 질문), S17(brief가 "인지·보고"인데 보고 줄 없음). 인접 교환이 열린 카드: S6·S9·S13·S19(2↔3). 시간 한정: S5 L4. `ko` 머리말은 모두 카드 내용과 맞다. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 10자 안이다. 다만 125문장에 111가지로, 핸드오프의 "대화에서 하는 일"(공감·이유 설명)보다 문장마다 붙인 주제 이름(`장 손상 설명`, `목 정맥 소견`)에 가깝다(보고만). 아이콘은 목록 안에서 어울린다. 사소 1건(18.3). |
| 7 | context `word`·`ko`, swap `ko` | 3 | W14 0건, `ko` 16건 정확, swap `ko` 5건 모두 바꾼 문장의 뜻이다. 저작자가 고친 16장면 중 대부분은 자연스럽고 원래 학습 의도(임상어 ↔ 쉬운 말)를 지켰다. 고칠 것 6건: S1(why가 고친 장면과 모순), S15·S17(`word`를 끼워 넣다 영어가 어색해짐), S9(어색한 장면 영어가 비문에 가까움), S20(차트에 `(car crash)` 풀이를 끼움), S4(인계 장면 `side impact injury`). |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진·뒤집기 오답 약 22문장, 묶음 돌려쓰기 약 9문장. 관사는 잘 지켰다(`an interpreter`, `a seatbelt/helmet/backpack`). (3) order 못 박기: 인접 교환 열린 카드 4장. (4) 임상 순서·사실: order 7장. (5) 오답 뜻·decoy 겹침: dKo 6, decoy 1. |

## 사실 오류·심각한 문제

1. **S2 order L4 `Whatever you tell me, I'll let the team know if anything changes.`** — L2에서 이미 "맥박이 빨라지고 혈압이 낮다"고 말했다. 외상 환자의 빈맥+저혈압은
   출혈성 쇼크를 의심할 소견이라 **지금** 알릴 일이지, 더 변하면 알릴 일이 아니다. why("마지막에 변화를 팀에 알리겠다고 닫아요")도 같은 흐름을 가르친다.
2. **S6 order L3 `To keep it from getting worse, I'm putting this mask on you.`** — `it`은 L2의 폐좌상(bruised lung)이다. 산소는 저산소혈증을 치료할 뿐 폐좌상이
   나빠지는 것을 막지 않는다. 게다가 brief가 "재사정·**보고**"인데 산소포화도가 떨어지는 환자에게 보고 줄이 없고, L2 `That's common`이 악화를 가볍게 들리게 한다.
   2↔3 교환(`dropped` → `To keep it from getting worse…` → `That's common…`)도 자연스럽다.
3. **S18 order L4 `Since they're waiting, we're giving you blood and moving you to the OR now.`** — 수혈이 "수술팀이 기다리니까" 하는 일처럼 읽힌다. 수혈은 출혈 때문에
   하고, 팀이 기다리는 것은 이동의 이유일 뿐이다(TASK 10번의 같은 갈래).
4. **S20 order L4 `With that output, he needs the OR now…`** — 배액 400 mL만으로 수술이 필요하다고 가르친다. 외상에서 흉관 배액으로 수술을 정하는 기준(ATLS)은
   처음 1,500 mL 안팎이나 몇 시간 동안 시간당 200 mL 안팎, 또는 수혈을 계속해도 불안정한 경우다. 이 환자가 수술실로 가는 이유는 20.4의 "수혈 두 단위에도 혈압 하락"과 합쳐서다.
5. **S1 order — 시진을 촉진 뒤에 한다.** L1 누름 → L2 압통 → L3 `That tells me where to look, so can I see where the seatbelt crossed…`. 복부 진찰은 보고(시진) 나서
   만지는(촉진) 순서이고, 벨트 자국은 압통과 상관없이 확인한다. "압통이 볼 곳을 알려 준다"는 이유도 맞지 않는다.
6. **S13 order L4 `Now that I know how bad it is, do you have any medical problems or take any medicines?`** — L2 `Until they connect`로 통역사 연결 전이라고 해 놓고
   병력은 영어로 바로 묻는다. 상황 brief("통역과 함께")와 13.0 why(자격 있는 의료 통역사)와도 어긋나고, 병력 질문이 통증 확인에 달린 것처럼 읽힌다. 2↔3 교환도 열려 있다.
7. **S17 order — 보고 줄이 없다.** brief는 "Beck 삼징후를 인지·**보고**"인데 카드는 소견 → 뜻 → `preparing to relieve`로 끝난다. 17.3 `I'm reporting these three signs…`가 있으니 그 갈래를 카드에 넣어야 한다.
8. **20.1 빈칸 `bike`** — `ko`가 "교통사고로"이고 자전거 사고도 교통사고다. 낱장에서 걸러 주는 것이 없어 정답이 둘이다.
9. **S1 context — why가 고친 장면과 모순.** 장면0(환자에게, ok)을 `belly` → `abdomen`으로 바꿨는데 why는 "palpate·abdomen은 차트와 의료진 사이의 말이에요… 환자에게는 press on your belly"라고 한다.
   학습자는 ok 장면에서 쓴 말이 환자에게 안 맞는다는 해설을 읽게 된다.

## 저작자 자기 보고 판정

1. **장면 안에서 틀린 말을 고르기가 한계였던 빈칸(bike crash, ICU 등)** — 둘로 갈린다.
   - 20.1 `bike`: **고칠 것.** 위 심각 8. 빈칸을 `abdomen`으로 옮긴다: `abdomen*/pelvis/spine/skull`(`ko` "복부"가 거르고, 같은 외상 분야에서 틀린 부위). `train`·`horse`도 함께 바뀐다(`horse crash`는 영어로 어색했다).
   - 20.5 `ICU`·`CT`·`ward`: **그대로 둬도 된다.** `ko`가 "수술실"이라 정답이 하나로 정해지고, 셋 다 같은 분야(환자를 보낼 곳)에서 출혈을 멈출 수 없는 곳이라 파일럿 2(b)에 맞는 오답이다. 같은 이유로 괜찮은 것: 18.4 `ICU/lab/pharmacy`, 20.2 `fracture/laceration/pneumonia`, 9.0 `airbag/dashboard`, 4.2 `helmet`, 7.0 `ankle/wrist/knee`.
   - 같은 한계가 실제로 문제가 된 다른 문장은 8.1이다: `foot/leg/arm`인데 `ko`가 "오른쪽 여기를"이라 신체 부위를 거르지 못한다(장면만 거름). 아래 빈칸에서 옮긴다.
2. **시술(흉관·바늘 감압·심낭천자)은 의사/APP, 간호사는 준비·보조** — **맞다.** S14 L1 `The doctor will place a tube`, 14.5 why(시술은 의사, 간호사는 안심·관찰), 15.3 `I'm getting the team`과 why,
   15.4 why(바늘 감압은 의사나 APP), 17.4 why(간호사는 물품과 환자 준비), 17.5 why(심낭천자는 의사) 모두 미국 응급실 실제와 맞다. 14.2 `We'll numb`, 15.4 `We need to put a needle in`,
   17.5 `We need a needle`, 20.2 `We placed a chest tube`의 `we`는 팀을 가리키는 말이라 괜찮다. 덧붙이면 좋은 것(선택): 17.5 why에 "외상의 심낭압전에서 바늘 천자는 수술 전까지의 임시 처치예요".

## 고칠 것 (v46 필드)

### why (2, +사소 1)
- 7.5 · "혈압이 떨어지는 외상 환자의 변화는 모든 환자에게 즉시 보고해야 하는 소견이에요"가 말이 꼬임 → "외상 환자의 혈압이 떨어지면 기다리지 않고 바로 알려야 해요."
- 11.3 · 둘째 문장 → "멸균 드레싱은 오염을 막고, 젖은 드레싱은 밖으로 나온 장기가 마르지 않게 해 줘요." (젖은 드레싱은 장기 탈출 때 쓰는 것이라 대상을 밝힘)
- 17.5 (사소·선택) · 위 자기 보고 2의 한 문장 덧붙임.

### 빈칸 (blank) (28)
정답이 둘:
- 20.1 · `bike`가 `ko` "교통사고"에 맞음 → answer `abdomen`: `abdomen*/pelvis/spine/skull`.

간호사가 할 리 없는 말이 되는 뒤집기 동사(논리만으로 걸러짐) → 같은 분야에서 틀린 말로:
- 5.0 · `forget/ignore/hide` the pain → `manage*/measure/record/describe`.
- 5.1 · `deepens/fixes/improves` → `limits*/speeds/slows/shakes`.
- 6.5 · `skip/cancel/forget` → `recheck*/record/report/chart` (`ko` "확인"이 거름).
- 10.4 · `hide/skip/cancel` your labs → `repeat*/review/print/send`.
- 11.5 · `better/smaller/clearer` → 빈칸을 `still`로: `still*/up/awake/warm` (`calm`은 `ko` "가만히"에 가까우니 넣지 말 것).
- 14.5 · `leave/hide/run`(비문) → 동사를 같은 분야의 다른 일로: `stay*/work/look/check` (`wait`·`sit`은 `ko` "곁에 있을게요"에 맞으니 넣지 말 것).
- 15.3 · `raise/increase`(같은 뜻 둘)·`hide` → `release*/measure/check/record`.
- 16.5 · `avoid/hide/ignore` → `replace*/measure/count/check` (`match`는 `ko` "잃은 만큼"에 맞으니 넣지 말 것).
- 17.4 · `declining/refusing/forgetting` → `preparing*/waiting/trying/asking` (`planning`은 `ko` "준비"에 가까우니 넣지 말 것).
- 18.2 · `safer/better`(비문) → `faster*/slower/later/longer`.

동떨어지거나 문법으로 걸러지는 오답:
- 4.0 · `cost`(비문) → `happened*/stopped/ended/started`.
- 4.4 · `speed`(`Which speed … from` 비문) → `direction*/lane/street/exit` (`side`는 정답과 같은 뜻이니 넣지 말 것).
- 3.4 · `itching/swelling/bleeding`은 통증 양상이 아님 → `aching*/stinging/cramping/tingling` (decoy `or burning`은 그대로).
- 8.1 · `foot/leg/arm`은 `ko` "오른쪽 여기"가 거르지 못함 → answer `right`: `right*/left/other/far`.
- 8.2 · `itching/coughing` 동떨어짐 → `guarding*/bruising/swelling/bleeding`.
- 12.1 · `itching/coughing/sneezing` 동떨어짐 → `cramping*/vomiting/swelling/fever`.
- 13.0 · `forgive/greet/thank` 동떨어짐 → `understand*/trust/hear/reach`.
- 13.1 · `far/tall/old` 동떨어짐 → `bad*/long/often/soon`.
- 16.1 · `urine/sweat`(흉관에서 나올 수 없음) → `blood*/air/fluid/pus`.
- 16.3 · `dental/billing` 동떨어짐 → `surgical*/nursing/imaging/transport`.
- 18.5 · `resting/eating` 동떨어짐 → `waiting*/leaving/charting/calling`.
- 20.4 · `pills/tablets`(같은 말 둘)·`grams` → `units*/liters/doses/milligrams` (`bags`는 실제로 같은 뜻으로 쓰니 넣지 말 것).

시간 단위 묶음 → 빈칸을 다른 가르치는 말로(새 answer는 `en`에 낱말 경계로 한 번만 나옴):
- 6.2 · `tomorrow/later/tonight` → answer `breathing`: `breathing*/sleeping/appetite/voice`.
- 16.4 · `hour/shift/day` → answer `drainage`: `drainage*/dressing/breathing/diet`. (`drainage`는 이 문장의 `words`에 없지만 브리프가 "대개"라 허용)

같은 오답 묶음 돌려쓰기(`hungry/thirsty/sleepy`가 2.3·8.4·10.5·19.3) → 2.3만 두고 나머지를 바꿈:
- 8.4 · `hungry/sleepy/thirsty` → `faint*/cold/itchy/full`.
- 10.5 · `itching/hunger/thirst` → `dizziness*/nausea/numbness/fever`.
- 19.3 · `hunger/thirst/fever` → `pain*/cough/fever/blood sugar`.

급하지 않은 것(같은 갈래, 바꾸면 좋음): 2.0·6.3·13.5 `quietly/rarely/privately` 돌려쓰기, 14.3·15.1 감각 동사(`smell/hear/taste`·`see/smell/taste`) 돌려쓰기,
3.1 `louder/faster`, 3.5 `waits`, 1.5 `weight`, 11.3 `dusty`, 9.2 `upstairs/overnight`, 19.5 `harder/tougher`(같은 말 둘), 0.4·5.3 `quick/short` 돌려쓰기.

### decoy (1, +경계선 3)
`ko`에 맞는 다른 문장이 되는 것:
- 2.5 · `right now` → 끼워 넣으면 `I'll let the team know right now if anything changes.`가 `ko` "변화가 있으면 팀에 바로 알릴게요"와 같음 → `tomorrow`.

경계선(보고만, 고쳐도 됨): 12.3 `on your leg`(`We'll put a monitor on your leg to check the baby's heartbeat.`가 문법이 맞고 `ko`에 위치가 없음 — 장면 상식으로만 걸러짐 → `for the nurse` 권장),
17.4 `to measure`(`We're preparing to measure the pressure around your heart.` — `ko` "풀어드릴"이 거름), 5.2 `on both sides`(`…listen to your lungs on both sides.` — `ko` "다시"가 거름).

### distractorsKo (6)
정답과 반만 다른 말 → 같은 상황에서 할 법한 다른 말로. [0]·[1]은 몇 번째 오답인지다.
- 8.5 [0] · "활력징후는 15분마다 잴게요"(정답 "활력징후를 계속 자세히 지켜보고 있어요"와 겹침) → "팔에 혈압 커프를 감아 둘게요"
- 16.4 [1] · "혈압은 모니터로 계속 보고 있어요"(정답 "배액량과 혈압을 매분 지켜보고"와 겹침) → "흉관이 꺾이지 않았는지 확인할게요"
- 16.4 [0] · "배액통은 비울 때 양을 기록할게요" — 흉관 배액통은 비우지 않고 눈금에 표시한다(가득 차면 통째로 바꿈) → "배액통 눈금에 지금 양을 표시해 둘게요"
- 11.4 [0] · "수술 전까지 드레싱은 열지 않을 거예요"(정답 "수술 전까지 이 드레싱이 장기를 보호"와 반만 다름) → "수술 동의서는 의사 선생님이 받으실 거예요"
- 14.1 [0] · "관을 넣으면 숨쉬기가 편해질 거예요"(정답 "폐가 펴진 상태를 유지"의 결과라 겹침) → "관을 넣은 뒤 가슴 사진을 다시 찍어요"
- 19.4 [1] · "호흡기가 필요하면 먼저 설명드릴게요"(정답 "인공호흡기가 필요할 수 있어요"와 겹침) → "지금은 산소 마스크로 지켜볼게요"
- 18.1 [1] · "배가 불러 오는 느낌이 있어요?"(정답 "부어 있어요"와 겹침) → "소변은 언제 마지막으로 보셨어요?"

(16.4는 두 오답을 다 바꾸니 한 문장으로 셈.)
경계선(보고만): 7.2 [1] "통증이 오면 벨을 눌러 주세요", 3.5 [1] "통증이 심해지면 벨을 눌러 주세요", 12.4 [1] "아기 움직임을 세어 보세요".
중복(사소): "의사 선생님이 곧 오실 거예요"(7.5·14.5·17.3), "통증이 올라가면 바로 말씀해 주세요"(5.4·19.5), "산소 수치를 매시간 확인할게요"(5.1·6.0), "숨은 편하게 쉬세요"(11.5·14.4).

### order (10장, +약한 것 2)
고친 뒤 인접 교환 세 가지를 다시 돌려 볼 것.
- S2 · 조건부 보고(심각 1) → L4 `With those numbers and how you feel, I'm letting the team know right now.` (`how you feel`이 L3의 답을 받아 3↔4를 잠금); `ko` "그 수치와 지금 느낌을 보고 바로 팀에 알릴게요"; why "측정을 알리고, 그 수치를 전한 뒤, 증상을 묻고, 수치와 증상을 묶어 바로 팀에 알려요."
- S6 · 사실·보고·교환(심각 2) → L2 `A bruised lung can do that, and it may get worse over the next few hours.` / L3 `Because of that risk, I'm putting this mask on you and letting the doctor know.` / L4 그대로(`Once the mask is on, I'll recheck…`); why에서 "더 나빠지지 않게 마스크를 씌우고"를 "그 위험 때문에 마스크를 씌우고 의사에게 알린 뒤"로.
- S1 · 시진을 앞으로(심각 5) → L1 `Can I see where the seatbelt crossed your body?` / L2 `Thanks—that mark can tell us how hard the impact was.` / L3 `Below that mark, I'm going to gently press on your belly in a few spots.` (`Next`는 `Then`처럼 어느 줄 뒤에도 붙으니 L2의 자국을 가리키게) / L4 `Tell me if any of them feels tender or hard.`; why "먼저 보고, 자국의 뜻을 말한 뒤, 누르겠다고 알리고, 누른 곳 중 아픈 곳을 말하게 해요."
- S18 · 수혈이 팀 대기에 달림(심각 3) → L4 `Since they're waiting, we're moving you to the OR now, blood still running.`; why "팀이 기다리니 지금 옮기고, 수혈은 가는 내내 이어 가요."
- S20 · 400 mL만으로 수술 요청(심각 4) → L3 `Since then, output is 400 mL and rising, with BP dropping despite two units.` / L4 `With all of that, he needs the OR now to control the bleeding.`; why의 A를 "배액 추이와 수혈에도 떨어지는 혈압"으로.
- S13 · 통역 전 영어 병력·2↔3 열림(심각 6) → L3 `For the fingers, one means mild and ten means severe.` (`the fingers`가 L2를 받음) / L4 `With that scale done, the interpreter will ask about your history and medicines.` (`that scale`가 L3을 받음; 원안은 15단어를 넘어서 줄임); why를 맞춰 고침.
- S17 · 보고 없음(심각 7) → L4 `Since that fluid needs to be drained, I'm calling the doctor right now.` (`that fluid`가 L3을 받아 3↔4를 잠금); `ko` "그 액체를 빼야 하니 지금 바로 의사 선생님을 부를게요"; why 끝을 "그래서 바로 의사에게 알려요"로.
- S5 · L4 `While they stay open, I'm going to listen to your lungs again.`가 시간 한정이고 영어로도 어색함("폐가 펴져 있는 동안 듣는다") → `To check that they're opening up, I'm going to listen to your lungs again.` (`they`가 L3의 lungs를 받음); why "폐가 열린 동안 다시 듣겠다"를 "폐가 펴지는지 다시 들어 확인해요"로.
- S9 · 2↔3 열림(`To look for that`이 L1의 deeper injury에도 붙음) → L1 그대로 / L2 `To look for that, we'll take images of what's underneath.` / L3 `Even with clear images, a bowel injury can show up hours later.` / L4 `Because of that, we'll observe you here a while longer.`; why를 맞춰 고침.
- S19 · L4 `For your shallow breathing, we'll support it…`가 어색하고 L3의 말을 되풀이, 2↔3 열림(`Because of that`이 L1 뒤에도 붙음) → L3 `Sinking in like that is making your breathing shallow.` (`ko` "그렇게 안으로 꺼져서 숨이 얕아지고 있어요" — 역설 호흡은 들이쉴 때 그 부분이 안으로 꺼지는 것) / L4 `To make those breaths deeper, we'll support your breathing and control your pain.`; `ko`·why를 맞춰 고침.

약한 것(바꾸면 좋음):
- S10 · 2↔3이 약하게 열림(`that one`이 L1의 a blood thinner에도 붙음) → L3 `How many times a day do you take the one you just named?`
- S8 · L4 `Based on all of that, we'll keep a close eye on your vital signs.` — 활력 감시는 사정 결과와 상관없이 하는 일 → `Whatever I find, we'll keep a close eye on your vital signs.`

**`While`·`Once`·`Until`·`Since`로 묶은 줄 전부(호출자 요청):**
- S0 L2 `While I do, point…` — 통과(청진하는 동안 가리키기, 미루는 것 없음).
- S5 L4 `While they stay open, I'm going to listen…` — **고칠 것**(위).
- S6 L4 `Once the mask is on, I'll recheck…` — 통과(재측정은 산소를 준 뒤가 맞음). 단 보고는 L3에 넣을 것(위).
- S8 L3 `While you tell me, I'm watching for any guarding…` — 통과.
- S11 L3 `Once it's taped, I'm covering the wound…` — 통과. L4 `Until surgery, this dressing will protect…` — 통과(임시 처치라는 뜻).
- S13 L2 `Until they connect, point… and hold up fingers…` — 통과(몸짓은 통역 전까지가 맞음). 단 L4가 이것과 어긋남(위).
- S15 L4 `While they get ready, try to stay still…` — 통과(팀 준비 중 안정). `this will help you breathe`의 `this`가 "가만히 있기"로 읽힐 수 있음(사소).
- S16 L4 `While the blood goes in, the surgical team is on the way…` — 통과(수혈과 수술팀 도착이 동시).
- S18 L4 `Since they're waiting, we're giving you blood…` — **고칠 것**(위).
- S20 L3 `Since then, chest tube output…` — 통과(시간 순서 표지). L4는 위에서 고침.

### context (6)
저작자가 고친 장면(11상황 16장면)의 판정: S5·S6·S11·S12·S18은 자연스럽고 규칙에 맞는다(같은 `word`가 세 장면에, 어색한 장면은 환자에게 임상어). 아래 6건을 고친다.
- S1 · why가 장면0(환자에게 `abdomen`, ok)과 모순(심각 9) → why "palpate는 차트와 의료진 사이의 동사예요. 환자에게는 같은 abdomen이라도 press on처럼 쉬운 동사로 말하고, belly라고 하면 더 편하게 들려요."
- S4 · 인계 장면 `Restrained driver, MVC, side impact injury.` — `injury`를 끝에 붙여 어색함 → `Restrained driver, side-impact MVC, L chest injury.`
- S9 · 어색한 장면 `You're being admitted to be observed with serial abdominal exams.`가 임상어로도 비문에 가까움 → `We'll observe you with serial abdominal exams.`
- S15 · 의사 장면 `Absent breath sounds on the left lung` → `over the left lung`; 어색한 장면 `Your lung has a tension pneumothorax.`(폐가 기흉을 "가진다"는 말은 안 함) → `Your lung collapsed from a tension pneumothorax.`
- S17 · 어색한 장면 `Your heart shows Beck's triad.`(아무도 안 하는 말) → `You have Beck's triad—muffled heart sounds, JVD, and hypotension.`
- S20 · 차트 장면 `Pt s/p MVC (car crash), restrained driver.` — 차트는 약어를 괄호로 풀지 않음(W14를 맞추려 끼운 것) → `Pt s/p MVC, restrained driver, car vs. car, side impact.` (이 주제의 수상기전은 옆에서 받힌 사고 — S4)
  덧붙여(보고만, 사용자 결정): `word: car`는 너무 쉬운 말이고 어색함이 `car`가 아니라 막연한 구어에서 온다. `word: trauma`(`ko` 외상)로 바꾸면 세 장면 모두 자연스럽게 넣을 수 있다
  (어색한 장면 예: `So this poor guy has, like, some trauma from a car thing.`).

참고: S0 `deep`(어색함은 `Inspire`), S3 `pain`(NRS), S5 `breath`(splinting), S14 `tube`(thoracostomy)처럼 `word`는 세 장면에 있고 어색함은 곁의 임상어에서 오는 모양은
TASK 9번 `drowsy` 예시와 같은 방식이라 괜찮은 것으로 봤다.

swap `ko` 5건(S2·S7·S10·S13·S16): 모두 정답을 넣은 문장의 뜻이다. 고칠 것 없음.

### tag·icon (사소 1)
- 18.3 `hospital` → `scalpel`(수술 필요). 태그 111가지는 보고만(위 6).

## 결정 11 (v44 문장·청크 — 보고만, 이번 범위 밖)
- 청크가 대시를 넘어 구를 끊음: 7.1 `belly—tell me`, 11.0 `remove the object—we'll`, 15.5 `stay still—this`. keyPhrase 여부에 따라 둘 것.
- 6.5 `I'll recheck your oxygen level again` — `recheck`와 `again`이 겹침(`I'll check … again` 또는 `I'll recheck …`).
- 7.4 `has been dropping the last few minutes` → `over the last few minutes`가 자연스러움.
- 2.5 `ko` "팀에 **바로** 알릴게요" — 영어에 `right away`가 없음(decoy 문제의 원인).
- 11.3·11.4 · 상황이 "박힌 물체"와 "장기 탈출"을 한 환자에 섞음. 젖은 멸균 드레싱은 탈출 장기용이라, 박힌 물체 상처를 덮는 문장으로만 읽히면 오해할 수 있음.
- W13 단어 오답 4건: `tape`↔`tap`, `severe`↔`severed`, `tube`↔`tub`, `unit`↔`unity` — 다른 낱말이라 의도한 철자 대비일 수 있으니 확인만.
- 5.4와 19.5가 거의 같은 문장(`Good pain control will help you breathe…`)이고 dKo도 겹침 — 상황이 달라 둬도 됨.

## 고칠 것 개수
- why 2 · 빈칸 28 · decoy 1(+경계선 3) · distractorsKo 6문장(16.4는 오답 둘) · order 10장(+약한 것 2) · context 6 · tag·icon 1 — **합계 54건**(경계선·사소·결정 11 제외).

## 종합
v44 필드는 base와 같고(context 정비 예외만), why·distractorsKo·decoy는 ER 앞 주제들보다 단단하다. 고칠 것의 중심은 order 10장
(특히 S2 조건부 보고, S6 산소가 폐좌상 악화를 막는다는 사실 오류, S18·S20 수혈·수술 판단의 근거)과 빈칸의 뒤집기·동떨어진 오답 약 22문장, 20.1 `bike`이다.
이것들과 context 6건을 고치고 order 인접 교환을 다시 돌려 보면 내보내도 된다.
