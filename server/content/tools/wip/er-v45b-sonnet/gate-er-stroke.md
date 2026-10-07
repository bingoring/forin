# er-stroke 최종 판정 (gate) — 독립 전수 재검토 후 이전 목록 대조

대상: `er-stroke.yaml`(단어 145 · 상황 23 · 뉘앙스 49문항) · `changes-er-stroke.yaml`(84건) · `base-er-stroke.yaml` · `in-er-stroke.json`
방법: 이전 목록을 열기 전에 단어 145개 전부(7필드), 문장 161개, 뉘앙스 전부(pair 7건은 왼쪽×오른쪽×decoy 전 조합, swap 10건은 세 옵션 이어 읽기, context 14건, slider 17건, reel 1건)를 읽었고, 스크립트로 exKo↔문장 ko 일치·decoyChips 우회 경로·cue 정답 노출·고아 단어·V15·V3을 다시 돌렸다. 검사기 `verify_one_theme.py er`: 위반 0, 경고 W13 1건, `==> 통과`.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 이전 지적 9건 모두 반영됐고 정답으로 맞는 오답 없음. 남은 것: w-weak `week`(명사, decoyChips와 중복), w-choke `gag`(경계선) |
| 2 | distractorsKo | 5 | 정답 단어의 다른 뜻을 넣은 것 없음(w-numb·w-sip 수정 확인). 145개 전부 정답 하나 |
| 3 | cue | 4 | 정답 영어·파생형 노출 없음. w-nose cue가 `코`를 두 번 되풀이(경미) |
| 4 | chips/decoyChips | 4 | 우회 경로 없음(스크립트). w-check chips는 `[[check]]`로 고쳐졌으나 decoyChips `[cho, ack]`가 옛 분할의 찌꺼기 |
| 5 | 뉘앙스 사실 정확성 | 5 | 185/110·INR 1.7·INR 2–3·LKW 규칙·tPA 중단+stat CT·AVPU·irregularly irregular·박리 통증 선행·동의 업무 범위·가족 통역 회피·regurgitate/vomit 모두 맞음. 이전 사실 오류 6건 전부 바르게 고쳐짐. 남은 건 한국어 낱말 하나(`정각`) |
| 6 | 뉘앙스 설계 | 3 | swap 10건 이어 읽기 전부 문법 OK, context 14건 전부 "같은 뜻·안 맞는 자리". 그러나 pair 1건에서 이전 검토가 "모두 유일"이라 한 조합이 실제로 고를 법한 영어가 됨(아래 2번, 경계선 2건 별도), slider 2건이 강도 축이 아님(경계선) |
| 7 | v44 정리(결정 11) | 4 | 84건 모두 규칙 안. 다만 문장 ko를 고치면서 그 문장을 예문으로 쓰는 단어의 exKo를 **하나씩 빠뜨림**(w-neck·w-numbness), w-strain 새 ko의 괄호가 틀림 |

---

## 1. 남은 안전·사실 오류

**없음.** (이전 6건 — 동의 context 장면, 주스→IV 당, w-level 농도, 210/118, CT why, life support — 모두 바르게 반영된 것을 확인.)

다만 **역할 범위**로 미해결인 것(안전·사실 오류는 아니고 keyPhrase·원천이라 이번 패스에서 못 고침):
- 대혈관 폐색 keyPhrase s2 "I need your consent so we don't lose time."과 `in-er-stroke.json` goal 2 "가족에게 시술을 설명하고 동의를 얻는다" — 이전 검토가 "다음 수정 때"로 미룬 그대로. 원천 수정 담당에게 넘길 것. 내보내기를 막지는 않음.
- 같은 계열: 좌MCA s6 "I'm going to explain the risks of this medication now."(free)와 그 상황 swap("This medication can cause bleeding…")은 간호사가 tPA 위험을 설명하는 장면. 미국에서 위험·이득 설명은 의사 몫이고 간호사는 보강 설명. 틀린 말은 아니라 그대로 두되 참고.

## 2. 남은 정답이 둘인 문항

| 어디 | 종류 | 무엇 | 어떻게 |
|---|---|---|---|
| 즉시 혈당·활력 측정 · N0 | pair | `bring up` × `your finger` → "bring up your finger"는 성립하는 영어(손가락을 들어 올리다). 이전 검토가 "모두 유일"로 통과시킴 | `[bring up, your sugar]` → `[give, sugar through your IV]`(give your finger 불가 · give a cuff 불가 · give a deep breath 불가). why도 "낮은 혈당은 IV로 당을 give"로 |

참고(경계선, 고칠 것에 넣지 않음): 두부 CT pair의 "rule out the weather"·"lie bleeding", 언어장벽 pair의 "call for the weekend"는 문법적으로는 성립하지만 이 장면에서 학습자가 정답으로 고를 콜로케이션이 아니다(BRIEF 기준 `dull pain`/`sharp pain`은 둘 다 고를 법한 짝). `rule out`은 어떤 명사구든 받으므로 decoy를 바꿔도 해결되지 않아 그대로 둔다.

distractorsEn·distractorsKo·swap: **없음.** (w-choke `gag`는 cue "켁켁거릴 때"로 보면 경계선이지만 ko `사레들리다`≠`구역질하다`라 정답 하나로 봄. 원하면 `gasp`로.)

## 3. 그 밖의 남은 고칠 것 — 11개 (필수 7 · 선택 4)

### v45 필드
1. **w-neck · exKo** "목에 부상이나 갑작스러운 긴장이 있었나요?" — 문장 ko는 "갑자기 무리하게 힘을 준 일이 있었나요?"로 고쳐졌는데 같은 예문을 쓰는 w-neck의 exKo는 옛 오역 그대로 → 문장 ko와 같게. **[필수]**
2. **w-numbness · exKo** "목 통증이 무감각보다 언제 먼저 시작됐나요?" — 문장 ko는 "목 통증은 무감각보다 먼저 시작됐나요, 나중에 시작됐나요?"로 고쳐졌는데 exKo는 옛 비문 그대로 → 문장 ko와 같게. **[필수]**
3. **w-check · decoyChips** `[cho, ack]` — chips를 `[[check]]`로 바꾸면서 남은 찌꺼기(정답이 한 조각이라 앱은 건너뛰지만 데이터로 말이 안 됨) → `[cheek]`. **[필수]**
4. **마지막 정상 시각 확정 · slider why** "exactly(정각)" — 정각은 '시(時) 정각'이라 8:15에는 틀린 말 → "exactly(정확한 시각)". **[필수]**
5. **w-nose · cue** "코와 내 손가락을 번갈아 짚게 하는 소뇌 검사의 동작" — ko `코`를 되풀이 → "얼굴 한가운데 튀어나온 부위. 손가락-손가락 검사 뒤에 자기 얼굴의 그곳을 짚게 한다". [선택]
6. **w-weak · distractorsEn** `week`(명사, 게다가 decoyChips와 같음) → `[weary, wobbly]`. [선택]
7. **대혈관 폐색 · slider** scale `[a small risk, a real risk, a high risk]` — `real`은 중간 강도가 아님 → `[a small risk, a moderate risk, a high risk]`. example도 이전 fix 20("at risk" 문장은 문항 뜻과 다름)이 반영 안 됨 → "Every minute…"를 두되 선택. [선택]
8. **FAST 초기 선별 · slider** `tingling → numb → no feeling at all` — tingling은 감각 이상의 *종류*라 후순환 slider를 지운 것과 같은 논리가 걸림(경계선). 바꾸면 `[slightly numb, numb, no feeling at all]`. [선택]

### 결정 11 (v44 — changes에 적을 것)
9. **w-strain · ko** "무리한 힘(염좌)" — 염좌는 sprain(인대)이고 같은 상황 swap note가 "sprain=염좌"라고 해 한 파일 안에서 염좌가 strain·sprain 둘 다를 가리킴 → "무리한 힘(근육 좌상)" 또는 괄호 삭제. **[필수]** (이번 수정이 만든 것)
10. **실어증 환자 소통 · s3 chunks**(free) `", one at" / "a time"` — 구 경계가 아님 → `["I'll ask", "yes or no", "questions", ", one at a time", "."]`. **[필수]**
11. **언어장벽 뇌졸중 · s3 chunks**(free) `", one" / "to five"` → `["Show me", "with your fingers", ", one to five", "."]`. **[필수]**

보고만(keyPhrase라 못 고침 · 원천 검토로): NIHSS s2 `"I'm holding" / "up"`, 출혈성 s0 `"to stay with me—can" / "you open"`, 출혈성 s2 `"is dangerously" / "high;"`, 뇌간 s0 `"Stay with me—can" / "you hear"` — 모두 구 경계가 깨진 조각. SBAR s1 "now up to 15"(keyPhrase)와 s5 "Repeat CT is scheduled in one hour"(free)는 tPA 뒤 3점 악화에 "예정된 재촬영"이 느슨해 보이나 4점 미만이라 틀렸다고 단정 못 함 — 이전 검토와 같이 확신 없음으로 둠. w-last(마지막으로, 부사)가 "last dose"(형용사) 2/4 문장에, w-repeat(반복하다)가 "repeat scan/CT" 2/4 문장에 붙은 것은 과반 규칙 안이라 둠.

## 4. 이전 검토가 놓친 것 / 수정이 만들었거나 안 반영한 것

**이전 검토가 놓친 것(새 발견)**
- pair 전 조합: "bring up your finger"(즉시 혈당)는 지시문으로 실제 나올 수 있는 결합인데 "모두 유일"로 통과시킴. ("rule out the weather"·"lie bleeding"·"call for the weekend"는 경계선으로만 기록.)
- chunks를 아예 안 봄: 실어증 s3·언어장벽 s3(고칠 수 있음) + keyPhrase 4건(보고만).
- w-nose cue의 ko 되풀이, w-weak `week` 품사(9건 목록에서 빠짐), 대혈관 slider의 `a real risk`, FAST slider의 종류/강도 문제.

**수정이 만들었거나 안 반영한 것**
- 안 반영(부분 반영): 결정 11-5 "exKo도 함께"에서 w-strain만 고치고 **w-neck을 빠뜨림**; 결정 11-7(문장 ko 수정)에서 **w-numbness exKo를 빠뜨림**(TASK 6번 규칙 위반); fix 20의 대혈관 slider example은 안 바뀜(선택이라 허용).
- 새로 만든 오류: w-strain ko의 "(염좌)"(sprain과 혼동); fix 17로 새로 쓴 slider why의 "정각"; w-check chips만 바꾸고 decoyChips `[cho, ack]`를 남김.
- 잘 반영된 것: 사실 오류 6건, SBAR context, 후순환 slider 삭제, reel의 TIA 이동(V15 유지), w-stay-with-me 분리(V3 유지), 오답 품사 9건, w-level/w-value, 주스 문장, speech·strain ko, intubation ipa.

## 5. W13 `w-worse` 오답 `worst` 판정

**문제 아님.** 카드 ko는 `더 나쁜`(비교급)이고 worst는 `가장 나쁜`(최상급)이라 '영어 고르기'에서 정답은 worse 하나다. 같은 어간·같은 분야의 실제 혼동어라 BRIEF가 권하는 좋은 오답(hypotensive→hypertensive와 같은 류)이고, decoyChips는 `worth`로 분리돼 있다. 검사기가 "another form"이라 하는 것은 어간이 같아서지 뜻이 겹쳐서가 아니다. 그대로 둔다.

## 6. 종합

**몇 개만 고치면 내보내도 된다.** 환자 안전·사실 오류는 남아 있지 않고(이전 6건 전부 바르게 고쳐짐), 검사기 통과. 필수 7건(exKo 2 · w-strain 괄호 · decoyChips 찌꺼기 · `정각` · chunks 2)과 pair 1건(즉시 혈당 `give sugar through your IV`)을 고치면 된다 — 모두 한 줄짜리 치환이고 keyPhrase를 건드리지 않는다. 동의 keyPhrase와 json goal 2는 원천 수정 담당에게 넘기되 이번 내보내기를 막지 않는다.
