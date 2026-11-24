# judge — or-massive-transfusion (A 범위, Fable 독립 판정)

대상 `or-massive-transfusion.yaml` (단어 137 · 상황 21). 검사기 통과 확인(`verify_one_theme.py or` → 통과, 변경 64건).
fix-*.md·pre-fix.yaml은 열지 않았다. 단어 137개 전부, 문장 126개 chunks 전부, 뉘앙스 43문항(slider 21·context 16·swap 5·pair 1) 전부를 스크립트로 뽑아 한 줄씩 봤다.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1. distractorsEn | 4 | 전부 같은 분야·닮은 꼴. 품사 불일치 1건(w-rightaway `right side` 명사구). 정답으로도 맞는 오답 없음. |
| 2. distractorsKo·길이 | 4 | 길이(1.25배·3자)는 전수 통과. 정답이 둘 되는 것 1건(w-level `층`). |
| 3. cue | 3 | 정답 영어 노출 없음. 그러나 w-chart cue가 `차트`로 정답을 음차하고, ko를 그대로 되풀이한 cue가 10건 안팎(cardiac·pulmonary·venous·regional·stop·dangerously·left 등), climb/rise·drop/fall이 같은 cue. |
| 4. chips/decoyChips | 4 | 형태소 단위로 잘 잘랐다. decoy에 비속어·불쾌어·술·성적 조각 없음. 장례 연상 가능한 `wake`(w-rightaway), 살해 과거형 `slew`(w-slow)는 바꾸는 편이 안전. |
| 5. 뉘앙스 사실성 | 4 | MTP 발동·속도·칼슘·TACO·TRALI 서술이 미국 관행에 맞고 "마취과 의사와 함께 정한다"로 역할을 지켰다. [3] swap의 "속도 줄이기" 주석이 반응성 저혈압을 빠뜨려 과일반화, [18] slider cue가 전신마취 수술실 장면과 안 맞음. |
| 6. 뉘앙스 설계 | 3 | [6] pair가 주어-동사 수일치만으로 풀리고 decoy `lower the temperature`가 red cells에 사실상 참. 나머지 context 16건은 word 3장면 모두 포함·어색 장면이 "같은 뜻·안 맞는 상대", swap 5건은 이어 읽어 문법 성립하고 `ko`가 바꾼 문장 뜻과 일치, slider 21건 순서 성립. |
| 7. 결정 11 | 4 | 쉬운 단어 제거·활용형 원형화는 타당. w-drop ko 변경(떨어뜨리다→내려가다)이 자기 example(타동)과 어긋남. |

## 사실 오류·심각한 문제
- **[6] MTP 비율 준비 · pair** — 오른쪽 `carry oxygen / replaces clotting factors / plug small leaks`: `plasma`에는 `replaces`만, `red cells`·`platelets`에는 복수 동사만 문법이 맞아 뜻을 몰라도 수일치로 풀린다. 또 decoy `lower the temperature`는 차가운 적혈구에 실제로 참(이 주제 [2]1 "Cold blood can drop the patient's temperature")이라 정답이 둘로 읽힐 수 있다. → 오른쪽을 부정사로(`to carry oxygen` · `to replace clotting factors` · `to plug small leaks`), decoy는 셋 다에 거짓인 `to raise the blood sugar`로.
- 환자 안전 오해를 부르는 why/notes는 없다. 수치(칼슘 0.9, pH 7.18, 피브리노겐 142→118→96, K 7.2)는 차트 예시이지 주장치가 아니고 범위도 맞다.

## 고칠 것 (결정 11 제외) — 16건

1. [6] MTP 비율 준비 · pair — 위 심각 항목. 오른쪽을 부정사로 통일하고 decoy 교체(why는 그대로).
2. w-level · distractorsKo `층` — `level`의 실제 뜻(층)이라 듣고 뜻 고르기에서 정답이 둘. → `검체`로.
3. w-chart · cue "차트에 적어 남기다" — `차트`가 정답 음차. → "활력징후를 15분마다 적어 남기다"처럼. (w-record cue의 `차트`도 chart로 유도하니 "기준 수치를 먼저 적어 두다"로.)
4. w-rightaway · distractorsEn `right side` — 명사구라 부사 정답과 품사 불일치. → `right there`.
5. w-rightaway · decoyChips `wake` — 장례 밤샘 뜻이 있어 안전하게 `weigh`로. (판단분)
6. w-slow · decoyChips `slew` — slay 과거형. → `slaw`. (판단분)
7. [3] 수혈 속도 조정 · swap `slow it down` note "혈압이 떨어지는데 속도를 줄이면 부족한 양이 더 커져요" — 수혈 중 저혈압은 반응 징후일 수도 있어 과일반화. → "출혈로 혈압이 떨어질 때 속도를 줄이면 부족한 양이 더 커져요. 반응이 의심되면 얘기가 달라요(상황 15)".
8. [18] TRALI · slider cue "He is still breathing, but we are helping every breath with the ventilator" — 전신마취·근이완 중이면 자발호흡이 없어 어색. 자발호흡을 cue에 남겨야 `take over`와 갈린다. → "He's breathing on his own under the LMA, and we're adding pressure support and oxygen." (근이완 없는 케이스면 원문도 성립하니 저작자 판단으로 유지 가능.)
9. [0] 혈액 제제 확인 · context 차트 장면 "confirmed by two RNs" — 수술실에서는 두 번째 확인자가 마취과인 경우가 흔하다. → "confirmed by two licensed staff" 또는 "by RN and anesthesia".
10. [6]3 "Each cooler has six units of product." (KP 아님) — 쿨러 구성은 병원 프로토콜마다 달라 확신 없는 수치. → "Each cooler has units of product in the ratio."처럼 `units`·`product`를 남겨 w-unit·w-product 태그를 유지할 것(이 상황 서로 다른 단어가 9개라 둘을 빼면 V3 미달). chunks·ko·distractorsKo 함께 갱신.
11. chunks(KP 아님) · [0]5 "once we both / agree" → "Let's / hang this / once we both agree".
12. chunks · [4]4 "against / the delivery slip" → "Let's check / the unit numbers / against the delivery slip".
13. chunks · [6]5 "to / the 1:1:1 ratio" → "We're staying / close to / the 1:1:1 ratio".
14. chunks · [9]3 "and no / plasma" → "We don't want / all red cells / and no plasma".
15. chunks · [11]3 "an early / sign" → "Oozing / from the line / can be / an early sign"(9낱말이라 4조각).
16. chunks · [20]5 "after / the diuretic" → "I'll / reassess / after the diuretic".

### cue 가벼운 손질 (한 묶음, 판단분)
- ko 되풀이: w-cardiac "심장에 관한" · w-pulmonary "폐에 관한" · w-venous "정맥에 관한" · w-regional "한 지역 범위의" · w-stop "하던 것을 멈추다" · w-dangerously "위험할 만큼" · w-left "아직 쓰지 않고 남은" → 장면이 떠오르게("심전도·심장 기능 앞에 붙는 말"처럼).
- 같은 cue: w-climb·w-rise "수치가 위로 올라가다", w-drop·w-fall "수치가 아래로 내려가다/떨어지다" → 서로 다르게(climb은 젖산처럼 꾸준히, rise는 정맥압처럼).

### 결정 11 항목 — 2건
- w-drop · ko `내려가다`(변경분) — 태그 문장 4개 중 3개가 자동사("is dropping")라 방향은 맞지만, 카드 example이 타동 KP("can drop the patient's temperature" / "떨어뜨릴 수 있어요")라 ko와 어긋난다. → ko `떨어지다`로, example을 "The pressure is dropping, so let's speed it up." / exKo "혈압이 떨어지고 있어요. 속도를 올립시다."로 바꾸고 changes에 추가.
- [18]2 ko "환기를 지지하고 보고합시다"(KP ko, en은 그대로) — 한국어가 어색. → "호흡을 보조하고 보고합시다". 바꾸면 이 문장 distractorsKo 둘도 새 ko에 맞춰 다시 쓸 것.
- (참고, 고치지 않아도 됨) record·chart·log가 모두 `기록하다` — 서로 오답으로 안 써서 정답 둘은 아니다. 가르고 싶으면 log `일지에 적다`, chart `차트에 적다`.

## keyPhrase 결정 필요 (en은 고칠 대상 아님)
- [20] "Slow the transfusion—this looks like TACO." — 미국 관행은 반응 의심 시 **일단 멈추고** 평가. swap why는 "늦추거나 멈추고"로 보완돼 있으나 KP 자체는 "늦추기"만 말한다. 사용자 결정.
- [3]1 "We can slow it if the numbers stabilize." — chunks "if the numbers / stabilize"가 주어·동사를 가른다(보고만).
- KP chunks 구 경계 보고(고치지 않음): [2]0 "through" 단독, [7]0 "is" 단독, [8]2 "the room / temperature", [11]1 "in the urine / color", [12]0 "from" 단독, [13]0 "an arterial / blood gas", [16]2 "the rhythm—it could", [17]0 "is / dangerously low", [18]0 "with new / pulmonary edema", [19]0 "to our last / two units", [19]2 "a regional / blood request", [14]1 "product" 단독.
- notes-A가 지적한 KP·문장: "Let's give calcium, insulin, and glucose." · "Push calcium and recheck immediately." · "Let's give calcium and recheck." — 협업 제안 문장으로 수술실에서 통용되고 why가 단독 결정으로 읽히지 않게 썼으므로 유지 권고. "The heart function should improve after this dose."는 `should`가 이미 완곡이라 유지.

## 저작자 메모 판정
- notes-A "Each cooler has six units" 사실 확인 필요 → 타당, 고칠 것 10번.
- notes-A "Warm blood is easier on the heart" 근거 약함 → 저체온·부정맥 위험 감소로 읽혀 유지 가능, 기각.
- notes-A "should improve" 보장 말투 → `should`가 완곡이라 기각.
- notes-A "Platelets go in as soon as they arrive" 쿨러 오해 → 문장은 맞고 상황이 다르니 기각.
- notes-A 두 사람 확인 절차는 정책마다 다름 → why에 절차를 단정한 곳 없음, 기각(단 [0] 차트 장면 "two RNs"는 9번).
- notes-B 문장 지적 없음.

## 비속어·불쾌어 전수 결과
decoyChips 137개·distractorsEn 274개 전부 훑음. 비속어·성적·술 조각 없음. 눈에 띄는 것만: `pleasure`(w-pressure dEn) — 소리 닮은 보통 단어, 통과. `wake`(w-rightaway decoy) — 장례 밤샘 뜻 있음, 교체 권고(5번). `slew`(w-slow decoy) — slay 과거형, 교체 권고(6번). `bed`·`doze`·`oven`·`cell`·`lord` 통과.

## 종합
pair 한 문항(수일치·참인 decoy)과 w-level·w-drop·w-chart 세 단어가 실질 결함이고 나머지는 다듬기. 위 16건 + 결정 11 두 건을 고치면 내보내도 된다. TACO KP는 사용자 결정.
