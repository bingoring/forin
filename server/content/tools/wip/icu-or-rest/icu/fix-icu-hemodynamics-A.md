# fix-icu-hemodynamics-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번·swap ko)

대상: `icu-hemodynamics.yaml` (단어 171 · 상황 21 · 문장 147 · 뉘앙스 43: slider 17 · context 16 · swap 6 · pair 4).
비교: `base-icu-hemodynamics.yaml`, `changes-icu-hemodynamics.yaml`(단어 ko 가름 13 · 단어 삭제 11 · 문장 words 8 — 문장 en 변경 없음), `in-icu-hemodynamics.json`, `notes-icu-hemodynamics-A.md`·`-B.md`.
기계 확인(스크립트): 단어 전부 표, 문장 chunks 전부 `/` 연결, pair 전 결합(왼쪽 × 오른쪽+decoy), swap 전 선택지 연결, context 세 장면의 `word` 포함 여부, distractorsEn 품사, dKo·dEn 길이(1.25배·3자) — 전부 통과, decoyChips 전부 비속어·불쾌 조각 확인, 은행 안 같은 `ko` 검색, 쉬운 단어 뺀 뒤 상황별 서로 다른 단어 수(V3) 재계산.

## 항목별 점수
| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 품사가 다른 오답 16단어(아래 표), 정답으로도 맞는 오답 1개(line↔tube "관") |
| 2 | dKo·dEn 겹침·길이 | 4 | 길이는 전부 통과. 은행 안 뜻이 거의 같은 쌍 2개(drip 정맥 주입/infusion 주입, update 알려주다/tell 알리다) |
| 3 | cue | 4 | 정답 노출 없음. ko 되풀이 4개(small·low·reassess·restart) |
| 4 | chips/decoyChips | 3 | 자르기는 형태소 단위로 양호. 비속어·불쾌 조각 5개(prick·oaf·stab·gun·flab) |
| 5 | 뉘앙스·문장 사실 | 2 | "calling it"(사망 선언) 오용, 승압제 추가를 "악화 신호 아님"이라 단정, 노르에피 침윤을 "빨갛다"로, 공기 방울을 fast-flush로 밀어 넣는 순서, 감쇠 파형에 re-zero, 독립 이중 확인 설명 오류, 지킬 수 없는 약속 4개 |
| 6 | 뉘앙스 설계 | 3 | pair 4개는 정답 하나로만 성립(전 결합 확인). slider 5개 순서가 약→강이 아님, swap 선택지 1개 비문, context 1개(steroid) 어색한 장면에 단어가 없음, 동떨어진 decoy 3개 |
| 7 | 결정 11 | 3 | 저작자 변경(ko 가름·쉬운 단어 삭제)은 타당. 놓친 것: 틀린 ko 3(level·wean·KP ko 2), 쉬운 단어 3(blood·color·first), 문장 오류·약속 문장 9, 구 경계를 끊은 chunks 6 |

## 사실 오류·심각한 문제
1. **[환자 안전·사실] 서맥 심정지 전조 문장 3** "I'm calling it now, everyone move fast." — 미국 병원에서 "calling it"은 소생을 멈추고 사망 시각을 선언하는 말입니다. 위급한 순간에 팀에 정반대 신호가 됩니다. `why`("상황을 선언하고 팀을 부른다")도 틀렸습니다(저작자 메모 타당). → S17
2. **[환자 안전·잘못된 안심] 바소프레신 문장 3** "Adding a second pressor is a normal step, not a sign of worsening." — 승압제 두 번째 추가는 정의상 요구량이 늘었다는 뜻입니다. 같은 상황 slider `why`도 "그만큼 상태가 심하다는 뜻"이라 서로 어긋납니다. → S7
3. **[환자 안전] 말초 승압제 문장 3 · slider** "If the site looks red or swollen…" — 노르에피네프린 침윤은 혈관 수축으로 **창백(blanching)·차가움·부종**으로 나타납니다(같은 주제 context도 "the hand is blanched"). "빨갛다"만 가르치면 침윤을 놓칩니다. → S10·N12
4. **[환자 안전] 동맥압 감쇠 pair·context** — 공기 방울이 의심될 때 fast-flush부터 하면 방울이 동맥으로 들어갑니다. 방울은 환자 쪽을 잠그고 바깥 포트로 빼고, 그 뒤에 fast-flush(사각파) 검사를 합니다. context 장면 "let's fast-flush it and check for bubbles"는 순서가 거꾸로이고, pair `why`("방울은 플러시로 빼고")는 방향을 말하지 않습니다. → N9·N10
5. **[환자 안전] 시간당 활력징후 문장 6** "One low reading isn't alarming on its own…" — 승압제 환자의 낮은 수치 하나는 무시하지 않고 바로 다시 잽니다. → S4
6. **[사실] 승압 중 서맥 문장 5** "…even if she comes back with the first dose." — 맥박이 있는 서맥에서 "comes back"은 심정지에서 돌아온다는 뜻이 됩니다. `why`도 "맥박이 돌아와도"라고 씁니다. → S18
7. **[사실] 파형 context 장면 1** "dampened, so I'm re-zeroing" — 영점은 감쇠를 고치지 못합니다(방울·꼬임·연결부 점검). CVP context 장면 1 "Zero the line and re-level it"은 순서가 거꾸로입니다(높이 맞춘 뒤 영점, 같은 주제 keyPhrase도 re-level and zero). → N2·N7
8. **[사실] 이중 확인 swap notes** — "double-check … with me"를 "두 사람이 각자 다시 확인한다는 뜻"이라 설명합니다. 독립 이중 확인(ISMP)은 값을 불러 주지 않고 **각자 따로** 대조하는 것이라 with me와 맞지 않습니다. → N5
9. **[지킬 수 없는 약속]** "This won't hurt at all."(S1), "her hand should recover well"(ko "잘 회복될 거예요", S14), ECMO "while she recovers"(문장·context fix, S20·N17), "This swap keeps her pressure steady the whole time."(S12).
10. **[설계] slider 순서** — 5개(S1·S2·S14·S15·S19 상황)가 약→강 순서가 아니고, 그중 둘은 "sign off anyway"·"stop both pumps"처럼 하면 안 되는 처치를 선택지로 보입니다. → N3·N4·N13·N14·N15
11. **[비속어] decoyChips `prick`**(w-proximal) — 성적 비속어. → W7

---

## 고칠 것

### A. 문장 (keyPhrase 아님 · 결정 11) — `en`·`ko`·`chunks`를 바꾸면 그 문장의 v46 필드(`why`·`decoy`·`distractorsKo` 2개·`blank`, `tag`/`icon` 점검)도 새로 쓰고 `changes-icu-hemodynamics.yaml`에 적습니다. ko만 바꾼 문장도 `distractorsKo` 둘을 새 ko 틀에 맞춰 다시 씁니다.

- **S1** 동맥압 라인 파형·영점 사정 · 문장 4 "This won't hurt at all." · 절대 약속(라인 조정은 불편할 수 있음, 저작자 메모 타당) → en `This shouldn't hurt, but tell me if it does.` · ko `아프지 않을 거예요. 혹시 아프면 말해 주세요.` · chunks `["This shouldn't hurt", ", but tell me", "if it does", "."]` · words `[w-hurt]` · v46 새로: why(약속 대신 알려 달라는 초대), decoy(`for you`는 "This shouldn't hurt for you"로 붙음 → 다른 조각), dKo 둘(예: `아프지 않을 거예요. 혹시 아프면 간호사를 불러 주세요` — 알릴 사람만 바꿈), blank `hurt` 유지 가능
- **S2** NIBP와 동맥압 값 불일치 확인 · 문장 3 · chunks `might read a little / differently than`이 "a little differently"를 끊음 → `["Your arm cuff", "might read", "a little differently", "than the line does", "."]` (decoy 다시 봄)
- **S3** MAP 목표 환자·가족 설명 · 문장 3 · chunks `a steady / blood supply`가 명사구를 끊음 → `["His organs need", "a steady blood supply", "to heal well", "."]`
- **S4** [안전] 시간당 활력징후 경향 기록 · 문장 6 · 낮은 수치를 넘기라는 뜻으로 읽힘 → en `One low reading gets rechecked right away, but the pattern is what counts.` · ko `낮은 수치가 하나 나오면 바로 다시 재요. 그래도 중요한 건 패턴이에요.` · chunks `["One low reading", "gets rechecked", "right away", ", but the pattern", "is what counts", "."]` · words `[w-low, w-reading, w-right]` · v46 전부 새로(why·decoy·dKo 2·blank·tag "안심 설명"→예 "확인 기준")
- **S5** 중심정맥압 측정 준비 · 문장 4 · chunks `when to / hold still`이 구를 끊음 → `["I'll tell you", "when to hold still", "for the reading", "."]`
- **S6** 노르에피네프린 적정 · 문장 4 · 쉼표 이음 비문 → en `The medication is working, and her pressure is staying steady now.` · ko 그대로 · chunks `["The medication is working", ", and her pressure", "is staying steady", "now", "."]` · v46 why("쉼표로 이어" 문장 고침), decoy·blank 다시 봄
- **S7** [안전] 바소프레신 병용 도입 · 문장 3 · 잘못된 안심(사실 2) → en `Adding a second pressor is a normal next step when one isn't enough.` · ko `약 하나로 부족할 때 승압제를 하나 더 쓰는 건 흔한 다음 단계예요.` · chunks `["Adding a second pressor", "is a normal next step", "when one", "isn't enough", "."]` · words 그대로(`w-add, w-second, w-normal, w-step` — 같은 상황 slider `words`의 w-normal 유지) · v46 전부 새로(why: 하나로 부족하다는 사실을 숨기지 않고 흔한 단계라고 말함, tag "오해 방지"→예 "솔직한 설명") · 같은 상황 slider `example`/`exKo`도 새 문장으로
- **S8** 바소프레신 병용 도입 · 문장 4 · chunks `and blood pressure closely`가 목적어와 부사를 묶음 → `["We watch", "her heart rate", "and blood pressure", "closely", "with this new medication", "."]`
- **S9** 동맥압 파형 감쇠 감별 · 문장 3 · 과감쇠는 수축기압을 낮게(이완기압은 높게) 보이게 하고 평균압은 비교적 유지됨 → en `An overdamped trace can make her systolic pressure look lower than it really is.` · ko `과감쇠된 파형은 실제보다 수축기압을 더 낮게 보이게 할 수 있어요.` · chunks `["An overdamped trace", "can make her systolic pressure", "look lower", "than it really is", "."]` · v46 why(평균압은 비교적 유지된다는 점 한 줄), dKo 둘(현재 "맥박"은 en에서 들리지 않음)
- **S10** [안전] 저용량 승압제 말초 일시 투여 판단 · 문장 3 · 사실 3 → en `If the site looks pale or swollen, we stop the infusion right away.` · ko `자리가 창백하거나 부으면 바로 주입을 멈춰요.` · chunks `["If the site looks pale", "or swollen", ", we stop the infusion", "right away", "."]` · v46 dKo 둘(현재 "빨갛거나…" 틀), why("침윤" 설명은 유지)
- **S11** 저용량 승압제 말초 일시 투여 판단 · 문장 5 · chunks `, not a long-term / plan`이 명사구를 끊음 → `["This is", "only a temporary bridge", ", not a long-term plan", "."]`
- **S12** 승압제 무중단 이중펌프 전환 · 문장 6 · 결과를 단정 → en `This swap is meant to keep her pressure steady the whole time.` · ko `이 교체는 과정 내내 압력을 안정적으로 유지하려는 거예요.` · chunks `["This swap", "is meant to keep", "her pressure steady", "the whole time", "."]` · v46 why·decoy(`like magic`은 동떨어짐)·dKo 둘·blank 다시
- **S13** 노르에피 말초 침윤 조직괴사 위험 · 문장 4 · ko "손상으로 이어질 수 있는 손상이에요"가 어색하고 en 구조와 다름 → ko `이런 부상은 빨리 대응하지 않으면 조직 손상으로 이어질 수 있어요.` · v46 dKo 둘 새 틀로
- **S14** [안전·약속] 노르에피 말초 침윤 조직괴사 위험 · 문장 6 · 결과 약속(ko "잘 회복될 거예요", 저작자 메모 타당) → en `The team acted fast, which gives her hand the best chance to recover.` · ko `팀이 빠르게 대응해서 손이 회복될 가능성을 가장 높였어요.` · chunks `["The team", "acted fast", ", which gives her hand", "the best chance", "to recover", "."]` · words 그대로 · v46 why(should를 기대라 설명하던 문장 교체)·dKo 둘·blank(`recover` 유지 가능)
- **S15** 승압제 급성 중단 혈압 붕괴 · 문장 4 · chunks `Call / for help`가 구를 끊음, ko "손이"는 extra hands(일손)와 어긋남 → chunks `["Call for help", ", we need", "extra hands", "on this", "."]` · ko `도움을 요청해 주세요. 일손이 더 필요해요.` · dKo 둘은 "장비가/시간이" 자리라 새 ko 틀에 그대로 맞음(확인만) · 같은 상황 slider `exKo`도 "일손이"
- **S16** 승압제 급성 중단 혈압 붕괴 · 문장 6 · ko가 약속처럼 읽힘(저작자 메모) → ko `약물이 다시 들어가면 혈압이 다시 올라올 걸로 봐요.` · dKo 둘을 새 끝말에 맞춤
- **S17** [안전·사실] 승압 중 급성 서맥 심정지 전조 · 문장 3 · 사실 1 → en `I'm calling a code now, everyone move fast.` · ko `지금 코드를 부를게요. 다들 빠르게 움직여 주세요.` · chunks `["I'm calling a code", "now", ", everyone move", "fast", "."]` · words `[w-code]`(지금 비어 있음) · v46 전부 새로(why: call a code = 소생팀 호출, "calling it"은 사망 선언이라 쓰면 안 됨)
- **S18** 승압 중 급성 서맥 심정지 전조 · 문장 5 · 사실 6 → en `We still prepare for CPR even if her rate picks up after the first dose.` · ko `첫 투여 뒤 심박수가 올라도 CPR 준비는 해 둬요.` · chunks `["We still prepare", "for CPR", "even if her rate picks up", "after the first dose", "."]` · words `[w-prepare, w-cpr, w-rate, w-first, w-dose]`(W12로 w-first를 빼면 그것만 제외) · v46 why("맥박이 돌아와도" → 심박수가 다시 떨어질 수 있어서), dKo 둘
- **S19** 승압 불응 하이드로코르티손 추가 · 문장 5 · ko "그녀만"은 번역투 → ko `쇼크 상태의 많은 환자들이 이 추가 보조가 필요해요. 이분만 그런 게 아니에요.` · dKo 둘 새 틀로
- **S20** [안전·약속] 임계 저관류 기계보조 고려 · 문장 4 · "while she recovers"가 회복을 전제(ECMO는 회복 또는 다음 결정까지의 다리) → en `ECMO can take over some of the heart's work to give it time to rest.` · ko `ECMO는 심장 일의 일부를 대신해서 심장이 쉴 시간을 줄 수 있어요.` · chunks `["ECMO can take over", "some of the heart's work", "to give it", "time to rest", "."]`(지금 `some of the heart's / work`도 끊김) · words `[w-ecmo]`(w-recover 빼도 상황 단어 12개, w-recover는 S14에 남음) · v46 전부 새로(blank `recovers` 없어짐 → 예 `rest`)
- **S21** (keyPhrase · ko만) 승압제 주입 라인·펌프 확인 · 문장 2 · ko가 en에 없는 "확인했어요"를 더함(저작자 메모) → ko `라벨이 처방, 백과 일치해요.` · en 무변경 · dKo 둘 새 틀로
- **S22** (keyPhrase · ko만) 노르에피 말초 침윤 조직괴사 위험 · 문장 1 · ko가 phentolamine을 영어로 둠(은행 ko 펜톨아민) → ko `혈관외 유출을 치료하려면 펜톨아민이 필요해요.` · en 무변경 · dKo 둘도 "펜톨아민"으로
- **S23** (keyPhrase · ko만) 불응성 쇼크 다중 승압 · 문장 2 · ko "에스컬레이션할게요"는 외래어 그대로 → ko `지금 SBAR로 상급자에게 보고할게요.` · en 무변경 · dKo 둘 새 틀로 · 같은 상황 slider `exKo`도 같게
- **S24** (keyPhrase · ko만) 바소프레신 병용 도입 · 문장 2 · ko "그녀가"는 번역투 → ko `환자분이 어떻게 반응하는지 자세히 지켜볼게요.` · en 무변경 · dKo 둘(지금 "그가/그녀가") 새 틀로

### B. 뉘앙스

- **N1** 동맥압 라인 파형·영점 사정 · pair · decoy `the patient's name`이 동떨어짐(어느 왼쪽에도 안 붙는 것은 맞음) → `into the vein`(zero/level/watch 모두 안 붙음 확인)
- **N2** 동맥압 라인 파형·영점 사정 · context(waveform) 장면 1 · 감쇠에 re-zero는 맞는 조치가 아님 → en `The waveform looks dampened, so I'm checking the line for bubbles.`
- **N3** NIBP와 동맥압 값 불일치 확인 · slider · 약→강 순서가 아니고 "move on"이 why("계속 지켜봐요")와 어긋남 → scale `[note it and keep watching, recheck the cuff size, call the doctor]`, answerAt `0`
- **N4** [안전] 승압제 주입 라인·펌프 확인 · slider · 순서 없음 + "sign off anyway"를 선택지로 보임 → scale `[note it for later, mention it at handoff, fix the rate before you start]`, answerAt `2`, why의 "그냥 서명하지 않아요" 문장 정리
- **N5** [안전·사실] 승압제 주입 라인·펌프 확인 · swap · notes `double-check`·`why` → "고위험 약 인수 때 쓰는 확인 요청 말이에요. 실제 독립 이중 확인은 값을 불러 주지 않고 두 사람이 각자 따로 처방·라벨·펌프를 대조해요." (`with me`와 '각자 따로'가 어긋나지 않게)
- **N6** 중심정맥압 측정 준비 · pair · decoy `into the sink` 동떨어짐 → `into the vein`(measure/lie/breathe 모두 안 붙음)
- **N7** 중심정맥압 측정 준비 · context(accurate) 장면 1 · 순서 거꾸로 → en `Re-level the line and zero it so the reading is accurate.`
- **N8** 바소프레신 병용 도입 · slider · `example`/`exKo`가 고칠 문장(S7)을 그대로 씀 → 새 S7 en/ko로
- **N9** [안전] 동맥압 파형 감쇠 감별 · pair · why "방울은 플러시로 빼고" → "공기 방울은 환자 쪽 밸브를 잠그고 바깥 포트로 플러시해서 빼요 — 환자 쪽으로 밀어 넣지 않아요." · decoy `the patient's name` → `the cuff size`(flush/tighten/straighten 모두 안 붙음)
- **N10** [안전] 동맥압 파형 감쇠 감별 · context(overdamped) 장면 1 → en `The trace looks overdamped, so let's check for bubbles before the fast-flush test.`
- **N11** 승압제 감량·이탈 시도 · swap · 선택지 `stopping cold`가 비문("We're stopping cold the medication…") → `switching off`(notes 키도: "끈다는 뜻이라 '조금씩'과 맞지 않아요")
- **N12** [안전] 저용량 승압제 말초 일시 투여 판단 · slider · cue "red and swollen" → `pale and swollen`, why "빨갛고 붓는" → "창백하고 붓는", example/exKo는 새 S10으로
- **N13** [안전] 승압제 무중단 이중펌프 전환 · slider · `stop both pumps`(위험 처치를 선택지로) → `call the doctor stat`(약→강: wait and see < titrate < call), why에서 "두 펌프를 다 멈추면…" 문장 정리
- **N14** 불응성 쇼크 다중 승압 · slider · 순서 → `[wait for rounds, keep watching, escalate now]`, answerAt `2`
- **N15** 승압 불응 하이드로코르티손 추가 · slider · 강→약 순서 → `[an optional extra, a standard step, a last resort]`, answerAt `1`
- **N16** 승압 불응 하이드로코르티손 추가 · context(steroid) · 어색한 장면에 `steroid`가 낱말로 없음(corticosteroid뿐) → en `We're starting a stress-dose steroid for relative adrenal insufficiency.` · fix `We're starting a steroid that helps her body respond to the blood pressure medicines.`
- **N17** [약속] 임계 저관류 기계보조 고려 · context(ECMO) fix "while she recovers" → `A machine can take over some of the heart's work to give it time to rest, and the team is getting ready for it.`

swap `ko` 6개는 모두 바꾼 문장의 뜻과 맞음. context 16개 중 15개는 핸드오프 모양(같은 말이 세 장면에, 어색한 장면은 듣는 사람에게 맞지 않는 임상어) — 예외 N16.

### C. 단어 (v45)

- **W1** w-level · ko "수평/눈금" — 문장 4개 모두 "높이"(at the level of your heart, right level, marking the level) → ko `높이, 수평` (결정 11)
- **W2** w-line · dEn `tube`는 "관"으로 정답 둘 → `lane`
- **W3** w-drip · ko "정맥 주입"이 w-infusion "주입"과 거의 같음 → `점적 약물` (결정 11)
- **W4** w-update · ko "알려주다"가 w-tell "알리다"와 같음 → `새 소식을 알려 주다`, dKo `[소식을 미뤄 두다, 소식을 물어보다]`(길이 맞춤) (결정 11)
- **W5** w-wean · ko "(약을) 이탈하다"는 어색한 한국어 → `(약을) 서서히 끊다` (결정 11)
- **W6** w-off · decoyChips `oaf`(모욕어) → `of`
- **W7** w-proximal · decoyChips `prick`(비속어) → `proc`
- **W8** w-restart · decoyChips `stab`(폭력) → `star`
- **W9** w-organ · decoyChips `gun` → `gum`
- **W10** w-flat · decoyChips `flab`·dEn `fat`(몸매 비하 뉘앙스) → decoyChips `flap`, dEn `flaky`
- **W11** cue 되풀이 4개 — w-small "크기나 정도가 얼마 안 되는" → `두 수치가 몇 점밖에 안 벌어졌을 때 붙이는 말` · w-low "기준보다 아래에 있는" → `목표선에 못 미치는 혈압을 말할 때` · w-reassess → `처치 뒤 처음 사정한 항목을 한 번 더 살피는 일` · w-restart → `라인이 빠져 끊겼던 승압제를 새 라인으로 다시 돌리는 일`
- **W12** (결정 11) 쉬운 단어 태그 빼기 — `w-blood`(11문장)·`w-color`(침윤 문장 3)·`w-first`(CVP 1, 바소프레신 1, 이중펌프 3, 서맥 5): heart·red·old를 뺀 저작자 기준과 같은 수준. 문장 `words`에서 빼고 은행에서 삭제, changes에 적음. 뺀 뒤 상황별 서로 다른 단어 최소 10개(소변량·젖산 상황)로 V3 통과(스크립트 확인). nuance `words`에 이 셋은 없음.

**distractorsEn 품사가 다른 것 (전부)**

| 단어 | 정답 품사 | 다른 오답 | 바꿀 것 |
|---|---|---|---|
| w-right | 형/부 | write(동) | bright |
| w-soon | 부 | since(접/전) | once |
| w-enough | 형 | though(접/부) | rough |
| w-first | 부 | fist(명), thirst(명) | fast, forth (W12로 삭제하면 불필요) |
| w-increase | 동 | increment(명) | incline |
| w-second | 형 | segment(명) | secure |
| w-bubble | 명 | double(형/동) | rubble |
| w-flush | 동 | flesh(명) | flinch |
| w-rate | 명 | rare(형) | ratio |
| w-site | 명 | cite(동) | side |
| w-access | 명 | assess(동) | abscess |
| w-place | 동 | plate(명), plane(명) | pace, plan |
| w-response | 명 | responsible(형) | repose |
| w-elevate | 동 | elevator(명) | alleviate |
| w-hand | 명 | hard(형) | land |
| w-document | 동 | doctor(명) | comment |
| w-crash | 동 | brash(형) | clash |
| w-matter | 동 | mature(형) | batter |

(경계선으로 두는 것: w-catch cash, w-setup upset, w-position portion/petition, w-reassuring reassessing/reassigning — 바꿔도 좋음)

---

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

- **K1 [안전] 수액 반응성 평가 · 문장 1** "If the pulse pressure variation drops, she's likely fluid responsive." — 수액 반응성은 PPV가 **높을 때**(대개 >12~13%) 예측합니다. 수액 뒤 PPV가 내려가는 것은 반응의 결과일 뿐이고, 다리 거상 판정은 주로 박출량·심박출량 변화로 봅니다. 문장대로 배우면 판단 방향이 거꾸로 됩니다(저작자 A·B 메모 모두 지적). 제안: `If the pulse pressure variation is high, she's likely fluid responsive.` (chunks도 `If the pulse pressure / variation drops`로 끊겨 있음)
- **K2 승압 중 급성 서맥 · 문장 2** "Start atropine and prepare for CPR." — 아트로핀은 정맥 일시 주입(push)이라 "start"보다 "give"가 맞고, ACLS에서는 팀 리더·처방(프로토콜)에 따른 지시입니다. 제안: `Give atropine and prepare for CPR.`
- **K3 동맥압 파형 감쇠 감별 · 문장 0** "…so the reading may be falsely low." — 과감쇠는 수축기압만 낮게 보이고 평균압은 비교적 유지됩니다. 단순화로 둘 수 있으나, MAP으로 적정하는 맥락이라 판단 필요(낮은 우선).
- **K4 chunks가 구 경계를 끊은 keyPhrase 문장 9개** (en은 그대로, chunks만 고칠지 결정)
  - 승압제 주입 라인·펌프 확인 0 `through the dedicated / central line` → `through / the dedicated central line`
  - MAP 목표 0 `if his organs are / getting enough blood` → `if his organs / are getting enough blood`
  - 중심정맥압 0 `I'll position / you flat` → `I'll position you / flat`
  - 노르에피 적정 0 `in a safe / range` → `in a safe range`
  - 노르에피 적정 2 `is our / main target` → `is / our main target`
  - 말초 투여 1 `It has to be a good / , proximal IV` → `It has to be / a good, proximal IV`
  - 말초 투여 2 `placed as soon as / possible` → `placed / as soon as possible`
  - 수액 반응성 0 `and watch the pressure / response` → `and watch / the pressure response`
  - 수액 반응성 1 `If the pulse pressure / variation drops` → K1과 함께

(keyPhrase의 ko만 고치는 것은 S21~S24로 고칠 것에 넣었습니다.)

## 저작자 메모 판정
- A 메모: calling it(S17), second pressor(S7), hand recover·pressure come back(S14·S16), won't hurt(S1), 라벨 ko(S21), phentolamine ko(S22) — 모두 타당, 반영. PPV(K1)는 keyPhrase라 결정 필요. 과감쇠(S9·K3) 반영. 말초 승압제·atropine 지시는 참고(K2).
- B 메모: PPV 방향(K1) 타당. 침윤 dKo·ECMO 오답은 B 검토 몫.
- 저작자 changes(ko 가름 13·삭제 11): 모두 타당. w-zero·w-hand 유지 판단도 타당.

## 종합
고칠 것 **74건**(아래 집계), 그중 **안전 14건**. 안전 항목(calling it, 승압제 추가 단정, 침윤 색, 공기 방울 플러시 순서, 낮은 수치 무시, 위험 처치 선택지, 이중 확인 설명, 약속 문장)을 고치고 K1을 결정하면 내보내도 됩니다.

집계: 문장 S1~S24 = 24 · 뉘앙스 N1~N17 = 17 · 단어 W1~W10·W12 = 11 · cue(W11) 4 · 품사 표 18 → 74(+keyPhrase 결정 4 별도). 안전: S4·S7·S10·S14·S17·S20·N4·N5·N9·N10·N12·N13 + S18(사실·처치 판단)·W7(비속어) = 14.
