# icu-delirium — A 검토 (v45 1~7 + 기계적 전수 + context 모양·swap ko + 저작자 메모 판정)

대상: `icu-delirium.yaml`(A·B 합친 파일, 단어 310 · 상황 21 · 문장 127 · 뉘앙스 42). 대상 파일은 고치지 않았다.
상황·문장 번호는 0부터(`상황-문장`). **KP** = in-…json의 keyPhrase와 글자 그대로 같은 문장(en은 사용자 결정 대상).

## 항목별 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 길이는 전부 통과. 그러나 품사 다른 오답이 약 110단어(아래 표), 불쾌·비속 오답(oriental·grope·lust·mad·dork·lover·stab·flog·fool·bonzo·die), 사전에 없는 말(tigger·dementor·intentive·prepose), 동의어 오답(dosage·continually·specially) |
| 2 오답 뜻 겹침·길이 | 4 | 길이 1.25배·3자 규칙 위반 0. 동의어 오답 3 + distractorsKo 1(w-reposition '옮겨 놓다'), 은행 안 같은 ko 3쌍(늘리다·말하다·완전히) |
| 3 cue | 2 | 정답 영어 노출은 없음. 그러나 약 50개가 ko를 그대로 되풀이한 사전식 정의("…안전한", "…점수")라 '언제·누구에게'가 안 떠오름. w-haloperidol cue 사실 부정확 |
| 4 chips/decoyChips | 3 | 자르기는 대체로 형태소 단위. w-alarm decoy `alarm`이 정답 전체와 같음(조각 하나로 정답 완성). 불쾌·부적절 decoy 다수(grope·lust·dwarf·leash·slay·mad·die·fool 등) |
| 5 뉘앙스 사실 | 3 | 상황 2 pair가 야간 알람을 `silence`(소리 끄기)로 가르침(안전). 상황 5 context 차트 장면이 섬망 개념을 거꾸로 씀. 나머지 why·notes(RASS 깊은 진정, Calm down 역효과, 사망 고지 외 예후 약속 금지, 억제대 최후 수단)는 미국 ICU 관행과 맞음 |
| 6 뉘앙스 설계 | 3 | pair 정답 둘: 상황 4·16·20. swap 8 문장부호·문법. context 4 `who`가 답을 드러냄. 상황 9 pair는 문법(주어-동사 일치)으로만 걸러져 약함 |
| 7 v44 단어·문장(결정 11) | 3 | CAM-ICU 주의력 문항 설명 틀림(0-3), 빠진 중심정맥관을 "reinsert"(16-5), QT 대안을 "shorter-acting"(17-4), 쉬운 단어 room·week 남음, w-clear 한 헤드워드에 동사·형용사·부사·다른 뜻 혼재, ko 오역 다수 |

## 사실 오류·심각한 문제
1. **[안전] 16-5 "I'll page the physician to reinsert the line."** — 빠진 중심정맥관은 다시 밀어 넣지 않는다(오염·색전). 새 부위에 새 라인을 잡는다. 단어 `w-reinsert`의 cue("빠진 관을 다시 몸 안으로 집어넣는 동작")도 바로 그 잘못된 행동을 가르친다.
2. **[안전] 상황 2 pair `silence / the alarm`** + why "알람은 silence(소리 끄기)" — 수면 위생을 위해 ICU 알람을 끄라고 가르친다(Joint Commission NPSG.06.01.01 알람 안전). KP 2-0도 *lower*(볼륨을 낮춤)이다.
3. **[안전·사실] 0-3 "He can't squeeze my hand twice when I ask him to."** — CAM-ICU 특징 2(부주의)는 글자 주의력 검사(“A가 들리면 손을 쥐세요”, SAVEAHAART 10글자 중 오류 >2개면 양성)이지 "두 번 쥐기"가 아니다. 잘못 배운 대로 하면 선별을 틀리게 한다. pair 0의 `squeeze / my hand twice`도 같은 오류.
4. **[사실·KP] 0-5 "If two features are positive, he screens delirious."** — CAM-ICU 양성은 특징 1(급성 변화·변동) **그리고** 2(부주의), 더하여 3(의식 수준 변화) 또는 4(와해된 사고). 이 문장의 why가 이미 실제 기준을 적어 en과 정면으로 모순된다 → 사용자 결정 필요.
5. **[사실] 17-4 "A shorter-acting option might be safer for him."** — QT 연장 맥락에서 대안의 기준은 작용 시간이 아니라 QT 위험이 적은 약이다(작용이 짧다고 QT가 덜 늘어나지 않는다).
6. **[사실] 상황 5 context 차트 장면 "Delirium not diagnosed until reversible causes are addressed."**와 5-4 "…before we assume delirium" — 통증·요저류·저산소증은 섬망의 *유발요인*이지 섬망의 대안이 아니다. CAM-ICU 양성이면 섬망이고, 원인 찾기는 그와 동시에 한다(5-3 KP "Treating the trigger often clears the confusion"이 맞는 틀). 태그라인 "Before we blame delirium…"은 json이라 보고만.
7. **[사실] w-haloperidol cue "초조할 때 쓰는 항정신병 계열 정맥 약물"** — 정맥 전용 약이 아니고(IV 투여는 오프라벨, IM·PO도 씀), 섬망 치료제로 확정된 것도 아니다(SCCM PADIS 2018: 일상적 사용 권고하지 않음, MIND-USA·AID-ICU에서 섬망 기간 단축 없음).
8. 불쾌·비속 오답이 학습 화면에 그대로 나온다: distractorsEn `oriental`(사람에게 쓰면 미국에서 차별어), `grope`(성추행 연상), `bonzo`(‘미친 사람’ 속어 — 섬망 주제), `mad`(같은 결), `dork`, `lover`, `stab`·`die`(폭력·죽음 — 초조·억제 주제), `flog`, `fool`. decoyChips `grope`·`lust`×2·`dwarf`·`leash`×2(억제대 주제에 '개 목줄')·`slay`·`mad`·`die`·`fool`.

---

## 고칠 것 — 문장 (결정 11)
문장 en·ko를 바꾸면 **그 문장의 v46 필드(why·decoy·distractorsKo·blank)를 새 문장에 맞춰 전부 다시 쓸 것**(ko만 바꾼 문장은 최소 distractorsKo 둘을 새 ko에 맞춰 다시). 모든 변경은 `changes-icu-delirium.yaml`에 기록(V16).

1. **[안전] 0-3** (비KP) — en `He can't squeeze my hand on the letter A when I ask him to.` · chunks `["He can't squeeze", "my hand", "on the letter A", "when I ask him to", "."]` · ko `글자 A가 들릴 때 손을 쥐라고 해도 쥐지 못해요.` · words 그대로 `[w-squeeze, w-ask]`. w-squeeze·w-ask의 `example`·`exKo`가 이 문장을 인용하므로 함께 갱신. v46 필드 새로.
2. **0-4** (비KP) — CAM-ICU 이름은 'Inattention' 특징. en `That means the inattention feature is positive.` · chunks `["That means", "the inattention feature", "is positive", "."]` · ko `그건 부주의 항목이 양성이라는 뜻이에요.` · words `[w-inattention, w-feature, w-positive]`. w-attention이 고아가 되므로 은행에서 삭제(word-remove). v46 필드 새로.
3. **[안전] 16-5** (비KP) — en `I'll page the physician to place a new line.` · chunks `["I'll page", "the physician", "to place", "a new line", "."]` · ko `새 라인을 잡도록 의사를 호출할게요.` · words `[w-page, w-physician, w-line]`. w-reinsert 고아 → 삭제. v46 필드 새로(현재 distractorsKo "라인을 다시 빼도록"도 위험한 오답이니 버림).
4. **17-4** (비KP) — en `An option with less QT risk might be safer for him.` · chunks `["An option", "with less QT risk", "might be safer", "for him", "."]` · ko `QT 위험이 적은 약이 더 안전할 수 있어요.` · words `[w-option, w-qt, w-risk, w-safe]`. w-short·w-acting 고아 → 삭제(상황 17 서로 다른 단어 23개 유지). v46 필드 새로.
5. **17-2** (비KP) — "pull an ECG"는 미국에서 어색하고, w-pull(뽑다) 태그도 뜻이 다름. chunk `before the first / dose`도 명사구를 끊음. en `I'll get a stat ECG before the first dose.` · chunks `["I'll get", "a stat ECG", "before", "the first dose", "."]` · ko `첫 투여 전에 당장 심전도를 찍을게요.` · words `[w-stat, w-ecg, w-first, w-dose]`(w-pull 뺌). w-stat·w-ecg `example`, 상황 17 slider `example`·`exKo`가 이 문장을 인용 → 함께 갱신. v46 필드 새로.
6. **5-4** (비KP, 사실 6번) — en `We correct the reversible causes of his delirium first.` · chunks `["We correct", "the reversible causes", "of his delirium", "first", "."]` · ko `섬망의 교정 가능한 원인부터 바로잡아요.` · words `[w-correct, w-reversible, w-cause, w-delirium, w-first]`. w-assume 고아 → 삭제. v46 필드 새로.
7. **7-2** (비KP, 메모 판정) — **유지 권고.** "No one is going to hurt you"는 섬망·편집 환자 진정에서 표준으로 가르치는 안심 표현이고 why가 범위를 지금으로 한정한다. 예후·기간 약속(19 context가 다루는 것)과는 다르다. (더 완곡히 하려면 `No one here is trying to hurt you.` — 그때는 w-right 태그를 7-3 `right beside you`로 옮김.)
8. **chunks만** (비KP, en 그대로) —
   - 1-2 `["You can look", "at the calendar", "anytime", "you feel confused", "."]`
   - 12-2 `["A sitter", "can watch him closely", "without", "tying him down", "."]`
   - 13-4 `["A higher CIWA score", "means", "we give", "more benzodiazepine", "."]`
   - 15-1 `["Everyone", ",", "step back", "and give him space", "right now", "."]` (현재 `give him / space right now`)
   - 20-5 `["I'll document this", "as a restraint-related injury", "."]`
   - 2-5 `["That way", "he can rest", "through most of the night", "."]`
   chunks를 바꾼 문장은 v46 `decoy`가 새 청크와 겹치지 않는지 다시 볼 것.
9. **ko만** (결정 11 범위, en 그대로; 각 문장 distractorsKo 둘을 새 ko에 맞춰 다시 쓸 것)
   - 7-0 (KP) `I hear you`는 '목소리 들려요'가 아니라 '말 잘 듣고 있다'는 인정 → `말씀 잘 듣고 있어요 — 안전하시고, 제가 도와드리려고 여기 있어요.`
   - 10-1 (KP) "얕추고"는 오타 → `진정을 가볍게 하고 비약물적 방법에 더 기대볼게요.`
   - 14-1 (KP) en의 permanent가 빠짐 → `영구적인 치매가 아니라 지금 앓는 병 때문에 생긴 거예요.`
   - 14-3 (KP) presence ≠ 목소리 → `곁에 계셔 주시는 것과 익숙한 물건이 회복에 정말 도움이 돼요.`
   - 15-2 (KP) 음차·'환자를 확보' 어색 → `긴장을 누그러뜨리고 환자를 안전하게 제지하는 동안 모두의 안전을 지켜 주세요.`
   - 16-3 (KP) → `손을 잠시 안전하게 붙잡아 주시고, 접근로는 서둘러 다시 확보할게요.`
   - 19-3 (비KP) '들려요' 직역 → `얼마나 지치셨을지 알아요, 충분히 그러실 만해요.`
   - 19-4 (KP) "뇌를 지지하면서" → `뇌가 회복되도록 계속 돕고, 소식도 계속 알려드릴게요.`
   - 20-4 (비KP, 낮음) "패딩하고" → `손목에 패드를 대고 맞음새를 다시 확인할게요.`
10. **태그 정리**(문장 그대로, `words`만)
    - w-clear: 헤드워드(맑아지다)와 맞는 5-3·19-1·10-5만 남기고 11-2(clearer 보임)·12-4(clearly 분명히)·15-0·18-1(clear the area 비우다)에서 뺌. 11-3은 새 단어 **w-clearly**로 태그(아래 새 단어). 상황 11 context `words: [w-clear]` → `[w-clearly]`(V15).
    - w-steady: 9-5 "A steady rhythm"(형용사)에서 뺌 — 헤드워드는 동사(붙잡아 안정시키다).
    - w-last: 19-0 "lasting"(지속되다)에서 뺌 — ko 마지막과 다름.
    - w-support: 19-4 "supporting his brain"에서 뺌 — ko '받쳐 주다'와 맞지 않음.
    - w-take: 19-1 "take weeks"(걸리다)에서 뺌. ko `하다` → `(숨을) 쉬다`, cue → `초조한 환자에게 같이 천천히 숨 한 번 쉬자고 할 때 쓰는 기본 동사`, distractorsKo `[(숨을) 참다, (약을) 먹다]` 식으로 같은 틀.
    - 쉬운 단어(공통 목록): w-room(10-4), w-week(19-1) 태그 빼고 은행에서 삭제. 선택: w-three(13-1, 숫자), w-tuesday(1-0) — 빼면 상황 1 pair `words`에서 w-tuesday 제거.
    - 각 상황 서로 다른 단어 수는 위 조정 뒤에도 15개 이상(V3 안전).
11. **새 단어 w-clearly** — en `clearly` · ipa `/ˈklɪrli/` · ko `또렷하게` · icon `speaker` · example `Seeing and hearing clearly helps you stay oriented.` · exKo `잘 보이고 잘 들리면 지남력을 유지하는 데 도움이 돼요.` · cue `안경·보청기를 끼운 뒤 잘 보이고 들리는지 물을 때` · tag `소통·안심` · distractorsEn `[cleverly, closely]` · distractorsKo `[희미하게, 크게]` · chips `[[clear, ly]]` · decoyChips `[clean]`. (word-add로 기록)
12. **단어 ko**(결정 11)
    - w-bowel `배변` → `장(창자)` (cue·오답 방광·식도와도 맞음).
    - 같은 ko 가르기: w-escalate `늘리다` → `(단계적으로) 올리다`(w-increase와 겹침), w-tell `말하다` → `알려 주다`(w-speak와 겹침), w-fully `완전히` → `온전히`(w-completely와 겹침). 각 distractorsKo 길이 다시 확인.
    - w-deescalate `진정시키다` → `(긴장을) 누그러뜨리다` — '진정'은 이 주제에서 sedation(진정제)과 같은 말이라 약물 진정으로 오해.
    - w-secure `확보하다` → `(안전하게) 고정하다` — 15-2·16-3 모두 사람·손을 붙잡는 뜻. distractorsKo `[풀다, 버리다]` 유지 가능.
    - w-closely `자세히` → `면밀히`(상황 3 context ko와 일치).
    - 선택(낮음): w-medication `투약` → `약물`, w-measure `방법` → `조치`.

## 고칠 것 — 단어 v45 필드
13. w-alarm decoyChips `alarm`(정답 전체) → `arm`.
14. w-dose distractorsEn `dosage`(동의어) → `doze`.
15. w-continuously distractorsEn `continually`(사실상 동의어) → `contiguously`.
16. w-especially distractorsEn `specially`(동의어) → `eventually`.
17. w-reposition distractorsKo `옮겨 놓다`(reposition의 뜻 그 자체) → `흔들어 깨우다`.
18. w-haloperidol cue → `섬망 환자의 심한 초조에 단기간 쓰기도 하는 항정신병 약의 이름`.
19. w-anticholinergic cue가 "형용사"라 했으나 ko·문장(anticholinergics)은 명사 → `아세틸콜린 작용을 막아 노인에게 혼란을 잘 일으키는 약을 통틀어 부르는 말`.
20. w-reinsert·w-short·w-acting·w-attention·w-assume·w-room·w-week 삭제(위 문장 수정의 결과).
21. **불쾌·비속 distractorsEn** — w-oriented `oriental` → `organized`; w-group `grope` → `grout`(decoyChips `grope` → `grip`); w-benzo `bonzo` → `bento`; w-med `mad` → `mid`(decoyChips `mad` → `mod`); w-dark `dork` → `dart`(decoyChips `dart` → `park`); w-lower `lover` → `lever`; w-stat `stab` → `stack`; w-tie `die` → `tile`; w-flag `flog` → `flock`; w-full `fool` → `fill`.
22. **불쾌·부적절 decoyChips** — w-last `lust` → `lest`; w-list `lust` → `lost`; w-withdrawal `dwarf` → `drew`; w-least `leash` → `feast`; w-release `leash` → `loose`; w-stay `slay` → `sway`; w-direct `die` → `dye`; w-fully `fool` → `fuel`.
    선택(가벼움, 주제 탓에 거슬림): w-oxygen `gin`·w-potassium `pot`(알코올·약물 금단 주제), w-help `hemp`, w-quickly `quack`(의료 앱에서 '돌팔이'), w-control `troll`, w-thinking `thick`('멍청한'), w-watch `witch`, w-level dE `devil`, w-sun dE·w-central·w-physician decoy `sin`.
23. **사전에 없는·허구 distractorsEn** — w-trigger `tigger` → `tiger`; w-dementia `dementor` → `demeanor`; w-inattentive `intentive` → `inventive`; w-propose `prepose` → `suppose`.
24. **cue 체계 문제(항목 3)** — 아래 약 50개 cue가 ko를 그대로 되풀이한 사전식 정의다. '언제·누구에게' 장면으로 다시 쓸 것.
    w-status w-turn w-cluster w-edge w-support w-activity w-calm w-level w-lab w-often w-full w-contact w-shift w-safe w-hurt w-right w-through w-control w-physician w-block w-fix w-lighten w-measure w-goal w-injury w-reassess w-need w-symptom w-guide w-score w-quickly w-build w-slowly w-area w-everyone w-apply w-iv w-anything w-reduce w-stat w-proceed w-benzo w-seizure w-stop w-hope w-red w-safely w-plan w-recheck
    예: w-safe `초조한 환자에게 여기선 아무 일 없을 거라고 안심시킬 때` · w-score `CIWA를 매기고 동료에게 숫자를 보고할 때` · w-shift `인계 때 "이번 ○○ 내내 조용했어요"라고 할 때` · w-stat `처방에 '지금 바로'라고 붙은 심전도를 받았을 때`.

## 고칠 것 — 뉘앙스
25. **[안전] 상황 2 pair** — `[[turn off, the TV], [lower, the alarm volume], [close, the door]]`, decoys `[the weekend]`, words `[w-off, w-lower, w-door]`, why `밤에는 TV는 끄고(turn off), 알람은 끄지 말고 볼륨만 낮추고(lower), 문은 닫아요(close).` (모든 결합 확인: close the TV ✕, lower the TV는 물리적 의미뿐, turn off the alarm volume ✕.)
26. **상황 0 pair** — `[squeeze, my hand twice]` → `[squeeze, my hand on the letter A]`(0-3 수정과 맞춤). 다른 결합(screen/document … on the letter A) 성립 안 함.
27. **상황 4 pair** — `hold him where he is`가 자연스러운 영어라 정답 둘. → `[[hold, his hand], [remind, him of the date]]`, why의 where he is도 고침.
28. **상황 16 pair** — `replace the physician`(장면 밖에서 자연스러움), decoy `the bleeding`이 `hold/assess the bleeding`로 붙음. → `[[hold, pressure], [assess, for bleeding], [page, the physician]]`, decoys `[the ceiling]`, words `[w-hold, w-assess, w-page]`, why `출혈 부위는 pressure를 hold, 출혈 여부는 assess for, 의사는 page해요.`
29. **상황 20 pair** — `recheck the wrists`·`recheck the injury`·`pad the injury`가 다 성립. → `[[pad, the wrists], [reposition, him safely], [document, the injury]]`, words `[w-pad, w-reposition, w-document]`, why 맞춰 고침.
30. **상황 8 swap** — 답이 질문인데 `before[2]`가 `" dose."`이고 `why did you order his lorazepam dose.`는 비문. → before `["Dr. Lee, ", "…", " his lorazepam dose."]`, options `[you need to change, I'd suggest we lower, you messed up]`, answer `I'd suggest we lower`, ko `리 선생님, 로라제팜 용량을 낮추면 어떨까 제안드려요.`, notes 셋 다시.
31. **상황 4 context** — `who: "딸에게 (딱딱한 설명)"`이 답을 드러냄 → `딸에게`.
32. **상황 5 context**(사실 6번) — ok 장면 둘: `He's CAM-ICU positive — let's find the cause of his delirium.` / `CAM-ICU positive for delirium; reversible causes being treated.` 어색 장면 `Don't worry, it's just delirium.`과 why는 그대로.
33. 낮음: 상황 1 pair `I'll open the hospital`이 문법상 성립(장면상 어색해 실해는 적음); 상황 9 pair는 주어-동사 일치로만 걸러져 콜로케이션 학습이 안 됨 — 여유 있으면 slider로.

## 저작자 메모 판정
| 문장 | 판정 |
|---|---|
| 0-5 CAM-ICU 단순화 | **사실 오류**, KP → 사용자 결정(아래) |
| 7-2 "No one is going to hurt you right now" | 유지(표준 안심 표현, 예후 약속 아님). 완화안은 위 7번 |
| 7-0 "you're safe" | 유지. ko만 고침(9번) |
| 10-1 "얕추고" | 오타 → ko 고침 |
| 10-2 "더 얕게" | 유지('얕은 진정'은 국내 ICU 용어) |
| 12-5 "every two hours" | 유지 — CMS는 비폭력 억제의 감시 간격을 병원 정책에 맡기고 2시간이 흔함, why가 "병원 지침에 따라" 단서를 둠 |
| 13-5 CIWA "every hour" | 유지 — 점수가 높을 때 매시간이 흔하고 why가 프로토콜 단서를 둠 |
| 14-1 섬망≠치매 | 유지 가능(KP). ko에 permanent 반영. why "함께 있을 수도" 단서 있음 |
| 14-3 presence≠목소리 | ko 고침 |
| 15-2 `secure him` | 폭력 위험이 임박한 이 장면에선 응급 억제가 허용됨(CMS: 1시간 안 처방·대면 평가). en 유지 가능, ko 고침. KP 목록에 선택안 |
| 16-3 "Secure his hands" | 주제(억제 최소화)와 결이 다름 → KP 결정 목록 |
| 18-0 "give the benzo now" | 증상 기반 PRN·프로토콜이면 범위 안. why가 처방 단서를 둠 → 유지 가능, 선택안 제시 |
| 18-3 "escalate the dose" | 간호사 단독 증량으로 읽히고 쉼표 접속 비문 → KP 결정 목록 |
| 19-4 "뇌를 지지하면서" | ko 고침 |
| w-clear 혼재 | 나눔(10·11번) |
| w-take ko '하다' | 고침(10번) |

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)
| 상황-문장 | 현재 en | 문제 | 대안 en |
|---|---|---|---|
| 0-5 | If two features are positive, he screens delirious. | CAM-ICU 양성 기준이 틀림(특징 1+2, 그리고 3 또는 4). 자기 why와 모순 | If features 1 and 2, plus 3 or 4, are positive, he screens delirious. |
| 16-3 | Secure his hands and we'll replace access urgently. | 손 '고정'은 억제 행위 — 처방·정책이 필요하고 억제 최소화(상황 12·20)와 충돌 | Gently hold his hands, and we'll replace access urgently. |
| 18-3 | This looks like delirium tremens, escalate the dose. | 간호사 단독 증량으로 읽힘 + 쉼표 접속 비문 | This looks like delirium tremens — let's get orders to escalate the dose. |
| 9-3 | The ABCDEF bundle ties sedation, mobility, and sleep together. | 수면은 ABCDEF의 글자가 아님(A 통증 B SAT/SBT C 진정 선택 D 섬망 E 조기 이동 F 가족) | The ABCDEF bundle ties pain, sedation, delirium, and mobility together. |
| 15-2 (선택) | Keep everyone safe while we de-escalate and secure him. | secure him = 신체 제지. 이 장면에선 허용되나 주제상 오해 소지 | Keep everyone safe while we de-escalate and keep him safe. |
| 18-0 (선택) | He's seizing — protect his airway and give the benzo now. | 처방 없이 투여로 읽힐 수 있음(PRN·프로토콜이면 정당) | He's seizing — protect his airway and give the PRN benzo now. |
| 14-1 (선택) | It's caused by his illness, not permanent dementia. | 기저 치매·장기 인지 저하 가능성을 배제하는 듯 들림 | It's caused by his illness, and it's different from dementia. |

keyPhrase 청크(보고만): 2-2 `lowers his / delirium risk`(한정사로 끝남), 5-1 `and last / bowel movement`(명사구 절단), 9-3 `ties sedation / , mobility, and sleep / together`(나열 절단), 15-2 `and secure / him`, 6-0 `Quiet doesn't / mean fine`, 2-3 `so we don't / wake him repeatedly`, 1-1 `where you can / see them`, 10-1 `and lean / on non-drug measures`(구동사 절단).

## 기계적 전수 결과
- **pair** 21개 상황 중 pair 11개, 모든 결합 출력해 판정: 정답 둘 = 상황 4·16·20, 안전 = 상황 2, 오류 내용 = 상황 0. 상황 8·14는 지식 짝이라 다른 결합은 사실상 틀린 문장이 되어 허용. 상황 1·9는 약함(33번).
- **swap** 4개를 이어 읽음: 7·17·20 문법·ko 정확. 8은 30번.
- **context** 17개: `word`가 세 장면 모두에 있음(누락 0). 어색 장면은 모두 '듣는 사람에 안 맞음'(같은 뜻). context `ko`: 3 `면밀히`(은행 ko와 불일치 → 12번), 11 `clearly`/`또렷하게`인데 words가 w-clear(→ 10·11번), 15 `위험`(은행 `위험한 상태`, 허용).
- **chunks** 127문장 전수: 비KP 절단 7건(위 1·5·8번), KP 8건 보고.
- **distractorsEn 품사** — 아래 표.

### distractorsEn 품사가 다른 것 전부
제안 원칙: 품사만 다른 닮은꼴(breath/breathe 류)은 `decoyChips`로 옮기고, distractorsEn은 같은 품사 닮은꼴로. 칸의 제안은 한 예.

| id | 정답(품사) | 다른 품사 오답 | 바꿀 오답(같은 품사) |
|---|---|---|---|
| w-mental | mental (형) | metal (명) | mortal |
| w-team | team (명) | tease (동) | tram |
| w-look | look (동) | luck (명) | lurk |
| w-ask | ask (동) | mask (명) | bask |
| w-open | open (동) | oven (명), often (부) | opine, offend |
| w-blind | blind (명) | blend (동), blond (형) | blink, blimp |
| w-dark | dark (형) | dork (명), dock (명) | dank, damp |
| w-quiet | quiet (형) | quite (부), quit (동) | quaint, quick |
| w-dim | dim (동) | din (명) | dub |
| w-lower | lower (동) | lover (명), power (명) | lever, loosen |
| w-close | close (동) | cloth (명) | clone |
| w-door | door (명) | dear (형) | deer |
| w-wake | wake (동) | weak (형), wick (명) | walk, wade |
| w-vital | vital (형) | vial (명) | viral |
| w-bed | bed (명) | bad (형) | bid |
| w-steady | steady (동) | sturdy (형) | steer |
| w-mobility | mobility (명) | mobile (형) | nobility |
| w-shorten | shorten (동) | shorter (형), shortage (명) | sharpen, soften |
| w-increase | increase (동) | increment (명) | incur |
| w-keep | keep (동) | deep (형), keen (형) | peep, leap |
| w-seem | seem (동) | seam (명), seen (과거분사) | seek, steam |
| w-calm | calm (형) | clam (명), claim (동) | clammy, cool |
| w-talk | talk (동) | tall (형) | stalk |
| w-hold | hold (동) | hole (명) | hoard |
| w-thing | thing (명) | think (동), thin (형) | ring, theme |
| w-hypoxia | hypoxia (명) | hypoxic (형) | hysteria |
| w-often | often (부) | soften (동), offer (동) | seldom, offhand |
| w-reversible | reversible (형) | reversal (명) | revisable |
| w-fine | fine (형) | fire (명), find (동) | firm, fond |
| w-speak | speak (동) | speaker (명), speck (명) | sneak, speed |
| w-eye | eye (명) | aye (감) | dye |
| w-withdrawn | withdrawn (형) | withdrawal (명) | withered |
| w-easy | easy (형) | east (명) | eerie |
| w-though | though (접) | through (전), thought (명) | unless, thus |
| w-still | still (부) | stall (명·동), steel (명) | soon, steadily |
| w-safe | safe (형) | save (동), sale (명) | sane, sage |
| w-slow | slow (형) | slot (명), sloe (명) | low, slim |
| w-together | together (부) | tougher (형), tether (명) | forever, thereafter |
| w-hurt | hurt (동) | heart (명) | hurl |
| w-right | right (부) | light (명), night (명) | straight, quite |
| w-stay | stay (동) | stag (명) | sway |
| w-beside | beside (전) | decide (동), reside (동) | inside, behind |
| w-through | through (부·전) | thorough (형) | throughout |
| w-worsen | worsen (동) | worsted (명), warden (명) | worry, lessen |
| w-med | med (명) | mad (형) | mod |
| w-high | high (형) | hug (동), hi (감) | huge, nigh |
| w-age | age (명) | ago (부) | cage |
| w-propose | propose (동) | purpose (명) | suppose |
| w-well | well (부) | wall (명), will (조동) | still, wildly |
| w-soon | soon (부) | son (명), sun (명) | seldom, anon |
| w-block | block (명) | black (형) | blot |
| w-deep | deep (형) | deer (명), keep (동) | deaf, cheap |
| w-feed | feed (동) | fee (명) | heed |
| w-lighten | lighten (동) | lightning (명) | frighten |
| w-break | break (동) | bread (명) | breed |
| w-sedative | sedative (명) | sensitive (형) | stimulant |
| w-orientation | orientation (명) | orientate (동) | orchestration |
| w-instead | instead (부) | instant (형·명) | indeed |
| w-aid | aid (명) | add (동), aim (동) | maid, raid |
| w-lens | lens (명) | lends (동), lent (동) | lungs, lids |
| w-tell | tell (동) | tall (형), till (전) | toll, sell |
| w-need | need (명) | feed (동), kneed (동) | seed, deed |
| w-sweat | sweat (명) | sweet (형), swept (동) | sweater, swab |
| w-withdrawal | withdrawal (명) | withdrawn (형), withdraw (동) | withholding, drawback |
| w-guide | guide (동) | guilt (명) | glide |
| w-give | give (동) | gift (명) | dive |
| w-call | call (동) | cell (명) | cull |
| w-order | order (명) | other (형·대) | border |
| w-extra | extra (형) | extract (동), exit (명) | external, exact |
| w-apply | apply (동) | apple (명) | imply |
| w-direct | direct (형) | direction (명) | distinct |
| w-urgently | urgently (부) | urgency (명) | largely |
| w-stat | stat (부) | stab (동), stay (동) | 부사 닮은꼴이 마땅치 않음 → `stately`·`static`처럼 철자가 닮은 형용사보다, 같은 쓰임의 병원 약어 `prn`·`q4h`(뜻 대비)를 권함 |
| w-against | against (전) | again (부), agent (명) | amongst, along |
| w-seize | seize (동) | seed (명), size (명) | cease, sneeze |
| w-side | side (명) | sigh (동) | tide |
| w-seizure | seizure (명) | seizing (동명사) | leisure |
| w-note | note (동) | nose (명) | quote |
| w-long | long (형) | lung (명), song (명) | lone, wrong |
| w-hope | hope (동) | hole (명), hose (명) | cope, mope |
| w-fully | fully (부) | fuel (명), folly (명) | fairly, freely |
| w-gradual | gradual (형) | graduate (동·명), gradient (명) | granular, casual |
| w-tired | tired (형) | tried (동), tide (명) | timid, tiresome |
| w-release | release (동) | relief (명) | relapse |
| w-breathing | breathing (명) | breathless (형) | bleeding |
| w-safely | safely (부) | safety (명) | sagely |
| w-recheck | recheck (동) | recess (명), receipt (명) | recharge, rehearse |
| w-document | document (동) | decrement (명) | decorate |
| w-repeatedly | repeatedly (부) | repeatable (형) | reportedly |
| w-closely | closely (부) | closet (명) | coolly |
| w-trigger | trigger (명) | trickle (동) | trigram (+ tigger → tiger) |
| w-back | back (부) | pack (명), black (형) | aback, abroad |
| w-red | red (형) | rod (명), rug (명) | rosy, raw |
| w-cut | cut (동) | cup (명), cat (명) | shut, cuff |
| w-pad | pad (동) | pod (명) | paddle |
| w-fit | fit (명) | fix (동) | fist |
| w-tangle | tangle (동) | angle (명) | mangle |
| w-choke | choke (동) | chalk (명) | croak |
| w-pull | pull (동) | pill (명), pool (명) | poll, pall |
| w-step | step (동) | stem (명) | stamp |
| w-hear | hear (동) | hair (명), head (명) | heal, sear |
| w-help | help (동) | held (과거) | yelp |
| w-turn | turn (동) | torn (형) | churn |
| w-try | try (동) | dry (형), tray (명) | cry, pry |
| w-face | face (동) | fact (명) | pace |
| w-miss | miss (동) | mess (명), mist (명) | mix, mash |
| w-mean | mean (동) | meal (명) | moan |
| w-full | full (형) | fall (동), fool (명) | foul, dull |
| w-rest | rest (동) | risk (명), west (명) | rust, wrest |
| w-support | support (동) | sport (명) | supply |
| w-cluster | cluster (동) | luster (명) | bluster |
| w-strap | strap (명) | stray (동·형) | strand |
| w-wrist | wrist (명) | wrest (동) | wrinkle |
| w-least | least (형) | lease (명) | latest |
| w-reassess | reassess (동) | recess (명) | reassign |
| w-build | build (동) | bill (명) | bulge |
| w-slowly | slowly (부) | slovenly (형) | lowly |
| w-secure | secure (동) | secret (명), sure (형) | rescue, secrete |
| w-else | else (부) | elf (명) | also |
| w-awake | awake (형) | awhile (부) | afraid |
| w-list | list (명) | lest (접) | lint |
| w-alternative | alternative (명) | alternate (형·동) | alliteration |
| w-take | take (동) | tack (명), tape (명) | make, rake |
| w-short·w-three·w-week | — | — | 삭제 대상이라 불필요 |

빠진 품사 오답은 `decoyChips`로 옮겨 써도 된다(지시서 v45: 품사가 달라 헷갈리는 짝은 decoyChips에). 바꾼 뒤 길이 규칙(1.25배·3자)을 다시 잴 것.

## 종합
- 고칠 것: 문장 1~12번(결정 11) + 단어 13~24번 + 뉘앙스 25~33번. 그중 **안전 3건**(16-5 reinsert + w-reinsert 단어, 상황 2 pair 알람 silence, 0-3 CAM-ICU 주의력 검사 + pair 0).
- KP 결정 필수 4건(0-5·16-3·18-3·9-3), 선택 3건(15-2·18-0·14-1).
- 위를 반영하면 내보내도 된다. 0-5는 사용자 결정 전까지 why와 en이 모순인 채로 남으니, 결정이 늦어지면 최소한 why 앞머리에 "이 문장은 줄여 말한 것"이라는 단서를 두는 것이 낫다.
