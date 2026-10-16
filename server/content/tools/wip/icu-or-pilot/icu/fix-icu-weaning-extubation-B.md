# B 검토 — icu-weaning-extubation (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-weaning-extubation.yaml` 21상황 × 6문장 = 126문장 전수, order 21장 전수.
스크립트로 `en | ko | 오답1 | 오답2`, 빈칸 `before+선택지+after` 넷, order 인접 교환 3가지를 전부 뽑아 한 줄씩 판정했습니다.
번호는 `상황.문장`(1부터). 저작자 메모 번호는 0부터라 상황·문장 모두 하나씩 밀립니다: 메모 "8번 상황 문장 3" = 9.4, "3번 상황 문장 5" = 4.6, "7번 상황 문장 2·5" = 8.3·8.6, 지시문의 "4·5번 상황" = 5·6번 상황.

저작자 메모 판정 — 5·6번 상황 빈칸(정답으로도 맞을 위험): 6.5 `loud` 하나만 정답 둘이고(28번), 나머지(5.1~5.6, 6.1~6.4, 6.6)는 정답 둘이 없습니다. 장면과 동떨어진 오답은 33번에 있습니다.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1. why | 4 | 거의 다 말하는 방식의 이유(어순·완곡·연결어)를 말함. 사실 오류는 없음. 4.3이 ko를 되풀이하는 쪽이고, 5.3 "confirm은 눈으로 직접 본다"는 조금 과장 |
| 2. 빈칸 | 2 | 정답 둘 4문장(3.6·6.5·8.1·16.3), 위험한 조립 2문장(8.3 unaware·8.6 sleepy), 장면과 동떨어진 오답 36문장, 문법으로 걸러지는 오답 3문장. loud 7회·painful 6회·wet 5회를 여러 문장에 돌려씀 |
| 3. decoy | 4 | ko에 맞는 다른 문장으로 조립되는 것은 없음. 5.3 `in storage`와 17.5 `in the hall`은 응급 장비 위치를 뒤집은 decoy. 같은 decoy를 많이 돌려씀(for the family 9회, for the rounds 7회) |
| 4. distractorsKo | 2 | 평시 상황(1~15)은 대체로 좋음. 응급 상황(16·18·21)과 8번은 처치를 늦추는 옆 단계로 바꿔 안전 시험에 실패하고, 16번은 호출 대상과 약 적응증을 바꿈. 되풀이 상한도 넘음(설명 7회·확인 6회) |
| 5. order | 3 | 대부분 앞 줄을 가리키는 말로 묶여 있음. 9·16·19·8번은 교환해도 자연스러움. 7번은 보고를 1시간 추이 뒤로 미루는 임상 순서 |
| 6. tag·icon | 4 | 태그는 상황 안에서 일관되고 10자 이하. 21.5 [자세 설명]에 stetho 아이콘은 뜻과 맞지 않음 |
| 8. 파일럿 갈래 | 2 | 갈래 2(장면과 동떨어진 빈칸 오답)가 그대로 되풀이됨(36문장). 갈래 3(order 고정)은 대체로 지킴. 응급 처치 오답은 "지시 동사 남기기"를 지키지 않음 |

## 사실 오류·심각한 문제

1. **응급 처치 문장의 오답이 처치를 늦추는 행동으로 바뀜(안전 시험 실패).** 18.5 "모니터를 확인", 21.3 "동료에게 재삽관을 설명", 21.6 "동료에게 상황을 설명 / 시간을 기록", 8.3 "활력징후를 두 번 더 재볼게요". 정답은 모두 "지체 없이 재삽관 준비" 또는 "진정제 재개"인데, 오답대로 하면 그 처치가 늦어집니다.
2. **stridor 위기(16번)에서 호출 대상과 약 적응증을 바꿈.** 16.2 기도팀을 약사·간병인으로, 16.4 기도팀을 영양팀으로 바꿨고, 16.5는 에피네프린 분무의 목적을 열·통증으로 바꿨습니다(약 적응증이 틀림). 16.1 "하기도"는 반대말로 뒤집은 것이고, 학습자가 stridor를 하기도 문제로 이해하면 치료를 잘못 고를 수 있습니다.
3. **구조 NIV의 적용 조건을 바꿈.** 18.1 "보호자가 동의하면", 18.4 "아침이 되어서"는 기도를 다룰 수 있는지 보는 조건을 빼고 NIV를 시도한다는 뜻이 됩니다.
4. **처치 시점을 바꿈.** 21.4 "완전히 막힌 뒤에 흡인"(반대말이기도 함), 4.6 "한 시간 더 기다림"(커프리크가 작은데 발관을 1시간만 미룸).
5. **응급 장비 위치를 바꿈.** 5.3 오답 둘("복도 끝에", "병동 입구에")과 17.5 "입구에", decoy 5.3 `in storage`·17.5 `in the hall`. 이 두 문장이 가르치는 것이 바로 "손닿는 곳·침상 곁"이라는 위치입니다.
6. **빈칸 선택지로 위험한 처치가 조립됨.** 8.3 `unaware`("의식이 떨어지면 진정제 재개"), 8.6 `sleepy`("졸려하니 진정제 재개").

A 검토와 공유할 문장 사실 문제(B 범위 밖이라 고칠 것 개수에는 넣지 않음):
- 9.4 "The high-flow cannula keeps his airway open"은 저작자 메모대로 부정확합니다. HFNC는 가온·가습 고유량 산소와 약한 양압(PEEP 효과)·사강 세척을 줄 뿐 상기도 개통을 유지하는 장치가 아닙니다.
- 18번 구조 NIV: ERS/ATS 2017 지침은 발관 후 이미 생긴 호흡부전에 NIV를 권하지 않습니다(재삽관이 늦어지고 사망률이 오름. 고탄산혈증·COPD는 예외). 짧은 시간 제한과 즉시 재삽관으로 위험을 줄여 놓았지만 A가 확인해야 합니다.
- 4.6 "하루 더 기다림"의 결정 주체는 의사입니다. en이 "의사에게 알려서"이므로 그대로 둬도 됩니다(저작자 메모 판정: 문제 없음).

## 고칠 것

표시: **[안전]**은 안전 시험 실패, **[정답 둘]**은 정답이 둘이 되는 것, 표시가 없는 것은 품질 문제입니다.

### distractorsKo
1. **[안전]** 4.6 dK2 "한 시간 더 기다릴" · 처치(발관) 시점을 바꿈 · 다음으로 교체: "새는 정도가 작으면 의사에게 알려서 오후에 다시 볼 수 있게 할게요". dK1 "팀장에게"는 알릴 사람을 바꾼 것이라 둬도 됩니다(저작자 메모 판정: 어색하지만 해가 없음).
2. **[안전]** 5.3 dK 둘 "복도 끝에"·"병동 입구에" · within reach가 이 문장의 핵심인데 그 위치를 바꿈 · 위치는 두고 동사·사람을 바꾸기: "흡인기와 재삽관 세트가 손닿는 곳에 있는지 동료가 볼 거예요" / "…손닿는 곳에 있는지 사진으로 남길게요".
3. **[안전]** 17.5 dK1 "입구에" · 침상 곁이라는 위치가 핵심 · 다음으로 교체: "흡인기와 후두경을 침상 곁에서 닦아 뒀어요".
4. **[안전]** 8.3 dK2 "활력징후를 두 번 더 재볼게요" · 환자가 안전하지 않은데 처치를 늦춤 · 다음으로 교체: "안전하지 않거나 불안정해지면 곁에 남아 라인을 지켜 볼게요". dK1 "의사에게 즉시 연락"은 안전한 옆 단계라 둬도 됩니다(저작자 메모 판정: 문제 없음).
5. **[안전]** 8.6 dK1 "먼저 호흡치료사에게 보고" · 진정제 결정은 호흡치료사 몫이 아니라서 임상적으로 어색하고, "먼저"는 처치를 늦춤 · 다음으로 교체: "안절부절못하고 있어서 조명을 낮추고 말을 걸어 볼게요"(비약물 조치, 해가 없는 옆 단계). dK2 "활력징후 다시 확인"은 저산소 배제라는 참인 다음 단계이고 해가 없어 둬도 됩니다.
6. **[안전]** 16.1 dK1 "하기도가" · 반대말로 뒤집었고, stridor를 하기도 문제로 오해하게 함 · 소리 쪽을 바꾸기: "저 가래 소리는 상기도가 붓고 좁아지고 있다는 뜻이에요"(dK2 "기침"과는 다른 소리).
7. **[안전]** 16.2 dK 둘 "약사를"·"간병인을" · 응급 호출(911에 해당)의 대상을 바꿈 · 에피네프린 분무는 두고 안전한 옆 단계로: "에피네프린을 분무하고 지금 침대 머리를 올려 주세요" / "에피네프린을 분무하고 지금 보호자를 내보내 주세요".
8. **[안전]** 16.4 dK2 "영양팀이" · 응급 호출 대상을 바꿨고 장면과도 동떨어짐 · 다음으로 교체: "협착음이 점점 커지고 있어요, 지금 재삽관 카트가 필요해요".
9. **[안전]** 16.5 dK 둘 "열을"·"통증을 줄이려고" · 약 적응증이 틀림 · 목적은 두고 사람을 바꾸기: "부기를 줄이려고 지금 동료가 에피네프린을 분무하고 있어요" / "…지금 호흡치료사가 에피네프린을 분무하고 있어요"(길이 확인 필요).
10. **[안전]** 18.1 dK1 "보호자가 동의하면" · NIV 적용 조건(기도)을 뺌 · 다음으로 교체: "각성돼 있고 기도가 다룰 만하면 잠시 구조 NIV를 준비해 둘 수 있어요".
11. **[안전]** 18.4 dK2 "아침이 되어서" · 기도 조건을 빼고 NIV를 시도 · 다음으로 교체: "각성돼 있고 기도도 다룰 만해 보여서 구조 NIV 기계를 가져옵시다".
12. **[안전]** 18.5 dK2 "모니터를 확인할게요" · 시간 제한을 넘겼는데 재삽관을 늦춤 · 다음으로 교체: "시간 제한을 넘어 계속 악화되면 마취과에 연락할게요".
13. **[안전]** 21.3 dK2 "동료에게 재삽관을 설명할게요" · 처치를 늦춤 · 다음으로 교체: "완전히 막히면 즉시 호흡치료사를 부를게요".
14. **[안전]** 21.4 dK1 "완전히 막힌 뒤에" · 처치 시점을 바꿨고 반대말이기도 함 · 다음으로 교체: "완전히 막히기 전에 동료가 적극적으로 흡인해서 내용물을 없애고 있어요"(사람만 바꿈, en의 I'm으로 갈림).
15. **[안전]** 21.6 dK 둘 "동료에게 상황을 설명"·"시간을 기록" · 재삽관 준비를 늦춤 · 다음으로 교체: "이게 없어지지 않으면 즉시 마취과를 부를게요" / "이게 없어지지 않으면 즉시 기도팀을 부를게요".
16. **[정답 둘]** 14.4 dK2 "직원이 같은 내용을" · 이 장면에서 everyone과 직원은 뜻이 같음 · "가족이 같은 내용을 알도록…"으로 교체.
17. **[정답 둘]** 17.4 dK1 "팀이 장비를 준비하는 동안" · 장비 준비가 곧 재삽관 준비라 뜻이 같음 · "팀이 엑스레이를 준비하는 동안…"으로 교체.
18. 9.1 dK 둘 "강한 지지"·"시원한 산소" · 둘 다 반대말로 뒤집음(⑤) · "따뜻한 산소와 부드러운 마사지를" / "따뜻한 물과 부드러운 지지를"처럼 다른 세부를 바꾸기.
19. 13.1 dK1 "단기 지지" · 반대말(⑤) · "장기 지지에서 더 편안하게"는 두고 "기관절개가 오히려 장기 지지에서 더 저렴하게…"처럼 바꾸기.
20. 20.3 / 20.6 · 오답 넷 중 셋이 "팀장"이고, 20.3에서는 팀장과 수간호사가 뜻이 겹침. 허혈 보고에서 의사를 간호 관리자로 바꾸는 것도 어색함(저작자 메모 판정: 해는 없지만 어색함) · 20.3 dK2 "수간호사에게"를 "보호자에게"로 바꾸기(알릴 사람만 바꾸는 것은 브리프가 허용하고, 보고 동사는 남음). 20.6 dK1 "팀장에게"는 둬도 됨. 한 문장에 간호 관리자 둘이 함께 나오지 않게 하기.
21. 21.2 dK 둘 "호출벨을 눌러"·"도움을 요청해" · 두 오답의 뜻이 같음(호출벨 = 도움 요청) · 둘 중 하나를 "옆으로 돌리고 입안을 닦아 주세요"처럼 다른 옆 단계로 바꾸기. 고유량 산소를 뺀 것 자체는 처치 지시문의 옆 단계 규칙 안에 있음(저작자 메모 판정: 허용).
22. 6.5 dK1 "소변을 배출" · 말이 안 되어 듣지 않고도 걸러짐 · "기침이 충분히 길어서 스스로 분비물을 배출할 수 있어요"로 교체.
23. 16.3 dK1 "퇴원할 경우를 대비해 재삽관 카트" · 장면과 동떨어짐 · "기침할 경우를 대비해…"로 교체.
24. **되풀이 상한:** "설명" 7회(9.3, 13.2, 18.1, 18.4, 19.6, 21.3, 21.6), "확인" 6회(8.6, 17.6, 18.5, 19.3, 21.1, 21.4). 위 10·11·12·13·15번을 고치면 설명은 5회, 확인은 5회가 됩니다. 의사(5)·통증(5)·혈압(5)·내일(5)·비용(5)은 상한에 걸려 있으니 더 쓰지 마세요. 위 교체안은 의사를 더 쓰지 않게 골랐습니다. 교체안을 모두 적용하면 "부를게요" 4회(18.2·13·15번 둘), 보호자 4회, 동료 5회, 호흡치료사 3회, 마취과 2회입니다. **동료는 상한에 걸리니 더 쓰지 마세요.** 수정 담당이 다른 말을 고르면 그 뒤에 rep 스크립트로 다시 세세요.

### 빈칸
25. **[정답 둘]** 3.6 `still`·`today` · "That fast rate still isn't a failure sign yet"는 맞는 영어이고 장면에도 맞음 · 빈칸을 `failure`로 옮기고 선택지 failure / recovery / success / comfort.
26. **[정답 둘]** 8.1 `tell` · "to tell how he wakes up"(= 알아보다)도 정답 · `tell`을 `chart`로 교체(또는 ask/chart/guess).
27. **[정답 둘]** 16.3 `open` · 재삽관 카트를 "열어 두는" 것도 실제 준비 행동 · `locked`로 교체.
28. **[정답 둘]** 6.5 `loud` · "loud enough to clear his secretions"도 말이 됨 · `weak`로 교체(장면 안의 반대말).
29. **[안전]** 8.3 `unaware` · "의식이 떨어지면 진정제 재개"라는 위험한 처치가 조립됨. `unwilling`도 진정제를 억제 수단으로 쓰는 쪽으로 읽힘 · `unhappy`·`unclear`·`untidy`처럼 해가 없는 un- 형용사로 바꾸기. 저작자 메모 판정: 용량·약 자리를 피한 것은 옳지만, 이 오답들은 형태만 닮은 말이라 뜻으로 걸러지고 그중 unaware는 위험함.
30. **[안전]** 8.6 `sleepy` · "졸려하니 진정제 재개"라는 위험한 처치가 조립됨. hungry·chilly는 3.2를 재사용한 것이고 장면과 동떨어짐 · 세 오답을 talkative / bored / chatty처럼 진정제가 필요 없는 상태로 바꾸기(sweaty·confused는 정답 둘 우려가 있어 쓰지 말 것).
31. 14.5 · 14.2와 정답(`next`)과 선택지 묶음(last/first/same)이 같음 · 우선순위 낮음. 바꾼다면 다른 가르치는 말로 옮기세요. 의문사 묶음은 쓰지 마세요("whether we're holding off"는 정답 둘).
32. 문법으로 걸러지는 빈칸 · 1.4 never/almost/often(뜻이 모순되거나 어색함) → 같은 분야의 틀린 말로, 고르는 것은 수정 담당이 합니다(빈칸을 `ready`로 옮긴다면 awake·stable은 정답 둘이라 쓰지 마세요); 6.4 hardly/rarely/barely는 "how much is hardly there"가 비문 → 빈칸을 `suctioning`으로 옮기고 suctioning / charting / listening / repositioning; 7.6 `sleeps` 비문 → `worsens`(장면 안의 반대).
33. 장면과 동떨어진 오답(갈래 2) · 각 문장에서 우스운 선택지를 같은 분야의 틀린 말로 교체:
    - 2.1 allergy/supplier → saturation / tubing / mask
    - 2.2 painful/swollen → low / labile
    - 2.3 painful/expensive → impaired / altered
    - 2.5 bath/meal/nap → transfer / scan / bath
    - 2.6 label/design → consent / bill (cost 유지)
    - 3.2 hungry/thirsty/chilly → improving / recovering / relaxing
    - 3.3 hunger/interest/thirst → improvement / progress / comfort
    - 4.4 knee/ear → chest / back / stomach
    - 4.5 rash/smell → cough / gag
    - 5.1 loud → locked
    - 5.2 bonus/habit/gift → routine / default / replacement
    - 5.4 steam/ink → air / suction (saline 유지)
    - 5.5 pillow/towel/blanket → gown / gloves / tape
    - 5.6 heavy/quiet/late → off / missing / loose
    - 6.6 week/year/month(시간 단위 묶음 돌려쓰기) → 빈칸을 `secretions`로 옮기고 secretions / stitches / bandages / wristband
    - 7.3 memorize/publish/translate → continue / finish / skip
    - 7.5 hunger/curiosity → silence / sunlight
    - 9.2 walking/eating/sleeping → 빈칸을 `oxygen`으로 옮기고 oxygen / sugar / sodium / weight
    - 9.4 eyes/hands → 빈칸을 `cannula`로 옮기고 cannula / catheter / dressing / splint
    - 10.4 late/loud/cold → 같은 분야의 틀린 말로 고르기(수정 담당 선택, 예: 마스크를 쓰는 이유 자리라면 `punish`는 피하고 `rush`·`quiet`처럼)
    - 10.5 curious/polite/quiet → relaxed / hopeful / brief
    - 10.6 scale/stamp/sink → alarm / tubing / chart
    - 11.3 quickly/loudly/politely → rarely / briefly / remotely
    - 11.5 lunch/dinner/bedtime → discharge / admission / transfer
    - 13.1 hungry/thirsty → exhausted 유지 + anxious / restless
    - 13.2 lower/louder/lighter → shorter / easier / quicker
    - 13.4 sadly/quickly/partly → rarely / never / barely
    - 13.6 name/color/shape → cost / visitors / discharge
    - 14.3 price/size/color → time / room / bed
    - 14.6 price/party/pump → visitors / diet / bill
    - 15.6 hungrier/warmer/thinner → drowsier / sicker / weaker
    - 17.6 label/rename → measure 유지 + inspect / photograph
    - 18.1 boldly/blindly/bravely → slowly / quietly / regularly (overnight·indefinitely는 NIV를 끄는 위험한 조립이라 쓰지 말 것)
    - 19.2 painful/public/formal → sudden / rapid / forced
    - 19.3 bills/beds/doors → rooms / meds / visitors
    - 20.3 hire → 같은 분야의 틀린 동사로 고르기(수정 담당 선택; page·call은 정답 둘, email은 보고 지연이라 쓰지 마세요)
    - (12.1 itch, 18.2 rename, 21.2 couch는 가벼움, 고치면 좋음)

### decoy
34. **[안전]** 5.3 decoy `in storage` · 17.5 decoy `in the hall` · 조립하면 "응급 장비가 창고·복도에"가 되어 within reach·at the bedside를 뒤집음 · `in the drawer`는 정답 둘 우려 → `for the audit`처럼 자리가 다른 조각이나 `on the monitor`로 교체.
35. 11.4 decoy `for a while ago` · 영어 구가 아니라 바로 걸러짐 · `a short time`으로 교체.
36. 같은 decoy를 많이 돌려씀(for the family 9, for the rounds 7, for the doctor 6, in the unit 6, 14번 안에 for the audit 3) · 상황마다 같은 분야의 다른 대상·장소 조각으로 나누기(가벼움).

### order
37. 7번 임상 순서 · "1시간 추이를 본 뒤 결과와 상관없이 보고"는 SBT 실패에 심박·혈압이 급등한 상황에서 보고를 늦춤(20번 허혈과 같은 양상) · 3·4줄을 "I'll report that pattern now so we can adjust the weaning plan." → "Meanwhile, I'll trend his vitals to see if it settles."로 바꾸고 why도 고치기.
38. 9번 · 2↔3을 바꿔도 자연스러움(장치 → "So far … on it" → 관찰 → 목적) · 3줄을 "So far, both of those look good."로 바꿔 2줄에 묶기.
39. 16번 · 3↔4를 바꿔도 자연스러움(`Alongside that`·`Beyond that`은 Also처럼 어디에나 붙음) · 4줄을 "Keep it at the bedside in case he obstructs completely."로 바꿔 3줄의 카트를 it으로 받기. why의 "악화를 바로 알리라는 말로 닫아요"도 함께 고치기.
40. 19번 · 1↔2를 바꿔도 말이 됨(제안 → 근거) · 2줄을 "For that, a gradual wean with a tracheostomy might suit him better."로.
41. 8번 · 1↔2를 바꿔도 말이 됨 · 2줄을 "While he's off it, I'm watching for agitation so he doesn't pull at his lines."로.

### tag·icon
42. 21.5 [자세 설명]의 icon `stetho` · 체위 배액과 맞지 않음 · `gear` 또는 `shield`로 교체(가벼움).

### why
43. 4.3 why가 ko를 되풀이함 · "once가 '빠진 뒤'라는 시점을 정해서 검사 목적이 발관 후의 호흡이라는 점을 짚어요"처럼 말하는 방식으로. 5.3 "confirm은 눈으로 직접 본다"는 "confirm은 있다고 가정하지 않고 확인한다"로(가벼움).

## 개수
- 고칠 것 43건(빈칸 갈래 2는 33번 한 건에 36문장, 문법 3문장은 32번 한 건으로 묶음)
- 그중 **안전 18건**(1·2·3·4·5·6·7·8·9·10·11·12·13·14·15·29·30·34), **정답 둘 6건**(16·17·25·26·27·28)

## 종합
평시 상황(1~15)의 distractorsKo·order·why는 대체로 내보낼 수준입니다. 그러나 응급 상황(8·16·18·21)의 처치 지시문 오답이 처치를 늦추는 옆 단계, 호출 대상, 약 적응증을 바꿔 안전 시험에 실패합니다. 빈칸은 갈래 2(장면과 동떨어진 오답)가 그대로 되풀이됩니다. 안전 18건과 정답 둘 6건을 고친 뒤에 내보내는 것이 맞습니다. 빈칸 갈래 2도 같은 수정에서 함께 고치기를 권합니다.
