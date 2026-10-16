# judge — icu-eol-goals — B 검토 (Fable 독립 표본 판정)

대상 `icu-eol-goals.yaml`, 21상황 147문장 + order 21장 전수. 기준은 `lesson_author_brief.md` "v46" 절, REVIEW.md v46 1~6·8.
스크립트로 `en | ko | DK1 | DK2`, 빈칸 네 줄, order 인접 교환, distractorsKo 되풀이 수, decoy·빈칸 오답 되돌려쓰기 수를 뽑아 한 줄씩 봤습니다.
`fix-*.md`·`notes-*.md`는 열지 않았습니다.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 `why` | 5 | 147개 전부 "말하는 방식의 이유"를 말하고 `ko` 되풀이 없음. 사실 오류 없음(often 완곡·titrate·capacity 2인 등 정확). 어색한 문장 1건(S12 order why) |
| 2 빈칸 | 3 | 정답 둘 확실 1건(S1-5 delay), 문법·관사만으로 걸러지는 것 3건(S2-4·S7-5·S14-1), 장면과 동떨어진 오답 23문장(password·recipe·plumbers·glowing…), 같은 오답 되돌려쓰기(briefly·early·busy 5회, hungry·pay·rarely·hide 4회) |
| 3 `decoy` | 2 | 조립 시 `ko`와 같은 문장이 되는 것은 없음. 그러나 **"for the family"가 147문장 중 47개(32%)**, "for the X" 꼴이 76개 — 보기만 해도 오답으로 걸러짐 |
| 4 `distractorsKo` | 4 | ①②③ 거의 전부 통과, 되풀이 상한 통과(최대 5회 "식사"). ④ 정답 둘 1건(S4-1)·근접 3건, ⑤ 뒤집기 2건(S3-2·S19-1), ③ 1건(S2-5), ⑥ 안전 약함 1건(S10-1). 사망 고지 오답에 탓·감쌈·결정권 침해 없음 |
| 5 `order` | 4 | 21장 중 18장은 가리키는 말로 못 박힘. 바꿔도 자연스러운 인접 교환 2건(S7 3↔4, S15 2↔3), 약한 1건(S3 1↔2). `ko` 머리말 전부 카드와 맞음. 임상 순서 오류 없음. 15단어 초과 13줄 |
| 6 `tag`·`icon` | 5 | 태그 전부 10자 이하·한국어·역할 표현. 아이콘 어울림(사소: S19-2 임종 고지에 shield, S13-7 평안 묻기에 faceWorried) |
| 8 파일럿 갈래 | 3 | 갈래 2(동떨어진 오답)가 23문장에서 되풀이, 갈래 3(순서 못 박기)은 대체로 지킴, 갈래 4(임상 순서) 통과, 갈래 5(decoy 겹침) 없음 |

## 사실 오류·심각한 문제

- **없음**(안전 사고로 이어질 오답·decoy·order 없음). 아래 둘은 B 범위 밖이지만 보고만:
  - S9-4 `She won't suffer`, S9-5 `she won't feel that`, S19-2 `he's not in pain` — 보장형 안심(v44 원문, A 몫). `why`는 S9-4에서 "근거가 필요하다"고 적절히 다룸.
  - S3-1 `ko` "…살펴보고 있어요, 불편한 기색이 있는지요" 어순 어색(A 몫).

## 고칠 것

### 안전·정답 둘 (4건)
1. S1-5 `DNR doesn't mean we'll stop…` 빈칸 · 오답 `delay`를 넣은 "DNR doesn't mean we'll delay treating his pain"은 참인 문장 → 정답 둘. `forget/refuse treating`은 문법도 어색 · `delay`→`start`, `forget`→`finish`, `refuse`→`try`로.
2. S4-1 `Our whole focus now is her comfort…` DK2 "환자분의 편안함과 존엄" · "그분의"와 같은 사람 → 뜻이 같음(④) · "오늘 저희의 모든 초점은 그분의 편안함과 존엄이에요"(now 들림)로.
3. S10-1 `I'll titrate his medication until he looks settled.` DK2 "열이 내려 보이실 때까지 약물을 적정" · 적정 종료점을 편안함이 아닌 활력징후로 옮김 — 그대로 하면 과진정 위험(⑥). DK1 "맥박이 안정되어…"도 같은 결이나 덜함 · DK2를 "안정되어 보이실 때까지 약물 효과를 지켜볼게요"(titrate 들림, 해 없음)로.
4. S19-1 `I'm right here with you and I won't leave.` DK1 "…곧 돌아올게요" · "떠나지 않을게요"의 뒤집기(⑤), 위기 장면에서 자리를 뜨는 말 · "저는 바로 여기 곁에 있고, 소리는 낮출게요"로.

### distractorsKo (5건)
5. S2-1 `The team wants to meet…` DK1 "이야기하고 싶어", DK2 "방문하고 싶어" · 둘 다 "만나고"의 근접 동의어라 ④ 약함 · DK1 "팀에서 다음 단계를 따로 계획하려고 만나고 싶어 해요"(together 들림), DK2 "의사 선생님이 다음 단계를 함께 계획하려고 만나고 싶어 해요"로.
6. S2-5 `Think about her values, not just the medical options.` DK2 "…가치관을 나중에 생각해보세요" · 바꾼 자리 "먼저→나중에"가 `en`에 없음(③), 뒤집기 성격 · "의학적 비용보다 그분의 가치관을 먼저 생각해보세요"(options 들림)로.
7. S3-2 `That sound is common at this stage…` DK1 "드물게 나는 것" · common→rare 뒤집기(⑤) · "그 소리는 이 시기에 흔히 나는 것이고 의사 선생님이 완화해드릴 수 있어요"(we 들림)로.
8. S7-7 `Let's pause and check…` DK2 "잠시 쉬고" · "잠시 멈추고"와 뜻이 거의 같음(④ 약함) · "잠시 멈추고 오늘 내용이 이해가 되시는지 확인해볼까요"(so far 들림)로.
9. S6-7 `…after death as before.` DK2 "돌아가신 날에도" · "후에도"와 갈리는 낱말이 `en`에서 안 들림(③ 약함) · 사람을 바꿔 "돌아가신 후에도 살아계실 때와 같은 존중으로 가족분을 대해드릴게요"(him 들림)로.

### 빈칸 — 문법·관사로 걸러짐 (3건)
10. S2-4 `…speak for herself?` 오답 himself/yourself/ourselves · 주어 mother와 안 맞아 문법만으로 걸러짐 · 빈칸을 `mother`로 옮겨 mother/sister/doctor/neighbor.
11. S7-5 `…more than once.` 오답 week/month/day · "more than week" 관사 없이 틀림 · 빈칸을 `same`으로 옮겨 same/first/last/next.
12. S14-1 `a normal part of loss` 오답 `early` · "a early" 관사 · `early`→`late` 또는 `rare`.

### 빈칸 — 장면과 동떨어진 오답 (파일럿 갈래 2, 23문장 → 같은 분야에서 틀린 말로)
13. S3-1 pride/laughter/boredom → fever/swelling/bleeding (sign of ~) · S11-1 humor/pride → fever/bleeding.
14. S5-4 `You can [stay]…day or night` shop/drive → `work`/`wait`(`sleep`·`sit`은 장면상 참이라 ✕). `pay`는 유지.
15. S7-3 landlord/driver → surgeon/chaplain(pharmacist는 유지) · S18-7 parking/laundry → billing/transport · S20-1 password/passport → diagnosis/allergy · S21-2 electricians/cooks → nurses(정답 둘 위험 없음: child life nurses 없음)/teachers.
16. S8-2 gloves/slippers → monitors/alarms(`stop the monitors that aren't helping him`은 장면상 참일 수 있음 → `alarms`/`lights`로) · S9-4 tea/paperwork → oxygen/fluids(“prepare oxygen before we start”는 참 → `paperwork`는 유지하고 `tea`→`fluids`).
17. S11-2 painted, S20-5 painted/framed → stiff/curled(자세), typed/signed(차트) · S11-6 brush/key → chart/clock.
18. S13-1 passwords/receipts → `holidays`/`dates`(`meals`는 DK에 이미 5회 쓴 "식사"라 ✕) · S13-5 banker/tailor → `pharmacist`/`surgeon`(`counselor`·`social worker`·`interpreter`는 장면상 참이라 ✕). `lawyer`는 유지.
19. S14-3 plumbers → volunteers · S14-5 whiter → longer · S16-1 walking/reading → swelling/coughing(`ease her coughing`는 참일 수 있음 → `swelling`/`itching`).
20. S16-5 month/season/decade → minute(정답 둘) 피해서 `week`/`year`/`night`(같은 단위군이지만 장면에서 틀림) — 시간 단위 돌려쓰기 자체가 갈래 2이므로 빈칸을 `Breathe`로 옮겨 Breathe/Walk/Wait/Pray 검토.
21. S17-5 recipe/vacation/weather → illness/surgery/hospital(“this kind of hospital”은 DK2와 겹침 → `treatment`) · S17-7 lunches/jokes → questions/requests.
22. S19-3·S9-5 smell/taste/copy 되돌려쓰기 → S19-3은 see/feel(참) 피해 `answer`/`follow`/`call` · S19-6 glowing/freezing/echoing → racing/stopping(“stopping”은 임종 장면에서 참 → `racing`/`rattling`은 참 → `racing`/`rising`/`shaking`).
23. S20-3 menu → policy(정답 둘 위험) → `calendar` · S15-3 `problem`("There's no problem — we'll follow…"도 말이 됨) → `hurry`.

### 빈칸 — 되돌려쓰기(보고)
24. 오답 낱말 재사용: briefly·early·busy 5회, quickly·hungry·pay·rarely·hide 4회, upstairs/downstairs 3회. 위 13~23을 고치면서 분산.

### decoy (1건, 체계적)
25. 전 문장 · `for the family` 47개(32%), `for the team` 11, `for the nurse/doctor/staff` 각 6 — "for the ~"만 보면 오답. 조립 결과가 `ko`와 같아지는 것은 없으나 변별력이 없음 · 상황마다 "같은 자리에 올 수 있는 다른 대상·장소·도구" 조각으로 바꾸기(예: S10-4 `his coughing`, S14-6 `at home`, S18-3 `to his recovery`는 ✕(참) → `to the schedule`, S20-2 `about his billing`). 최소한 한 상황 안에서 같은 decoy가 3개 이상 겹치지 않게.

### order (3건 + 보고)
26. S7 order 3↔4 · "If anything is unclear, we can go over it again… / Does that make sense so far?" 순서도 자연스러움 · 4줄을 "If that part isn't clear, we can go over it again"처럼 3줄의 답을 전제하는 말로("If not, …").
27. S15 order 2↔3 · 1→3→2→4("Whatever you decide, we'll follow it… / A specialized team can explain what it would involve")도 자연스러움 · 3줄을 "Whatever you decide after hearing them, we'll follow it…"로 2줄의 팀을 가리키게.
28. S3 order 1↔2 · "If I see any sign…, I adjust… / I'm keeping a close eye…" 순서도 읽힘(약함) · 2줄을 "While I watch, if I see any sign…"로.
29. (보고) 15단어 초과 13줄: S16-4(18), S18-4(19), S19-4(19), S13-3·S18-2·S19-3·S20-2(17), S7-4·S10-3·S12-3·S13-4·S14-2·S17-4(16). 카드 폭 기준이면 S16-4·S18-4·S19-4부터 줄이기.
30. S12 order `why` "2줄의 do that이 아니라 3줄의 To do that이 2줄의 일을 가리켜" 문장이 꼬임 · "3줄의 To do that이 2줄의 일을 가리켜 방법을 말하고"로.

### tag·icon (보고만)
31. S19-2 임종 고지에 `shield`, S13-7 평안 묻기에 `faceWorried` — 뜻과 어긋나진 않음, 바꾼다면 `star`/`speech`.

## 종합

안전·정답 둘 4건(그중 안전 1·정답 둘 3)과 distractorsKo 5건, 빈칸 문법 3건은 바로 고치면 됨. 큰 덩어리는 **decoy "for the family" 편중**과 **빈칸 동떨어진 오답 23문장**으로, 파일럿에서 이미 지적된 갈래가 그대로 되풀이된 것. 사망 고지·결정권·잘못된 안심 축에서는 B 산출물(오답·decoy·order)에 문제가 없고, 보장형 안심은 v44 원문(A 몫). 위를 고친 뒤 내보내도 됨.
