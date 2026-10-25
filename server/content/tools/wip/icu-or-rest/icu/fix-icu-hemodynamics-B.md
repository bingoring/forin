# icu-hemodynamics — B 검토 (v46 1~6·8 + distractorsKo ①~⑥·되풀이 상한)

대상: `icu-hemodynamics.yaml` 21상황 147문장 + order 21장. 문장 전수를 스크립트로 뽑아(`en | ko | 오답1 | 오답2`, 빈칸 4줄, chunks+decoy, order 4줄) 한 줄씩 판정했습니다.
번호는 `상황.문장`(파일 순서, S1=동맥압 라인 파형·영점 사정 … S21=임계 저관류 기계보조). 저작자 메모의 "상황 13·16·20"은 파일에서 S14·S17·S21입니다.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 3 | 대체로 말투의 이유를 말함. 사실 오류 3건(19.4 calling it, 14.2 PPV 방향, 13.2 근위 정맥로) |
| 2 빈칸 | 3 | 장면상 맞는 오답(result·wet·size·wider·tested·night·sharply)이 있고, 문법으로 걸러지는 것(2.4·7.6·14.2·17.1 관사), 넣으면 위험한 것(3.6·13.2·15.5·18.6)이 있음 |
| 3 decoy | 5 | 147개 모두 장소·시간 조각이라 어느 자리에 넣어도 ko 뜻에 맞는 다른 문장이 되지 않음. 반대말 decoy 없음 |
| 4 distractorsKo | 3 | 틀·길이는 지킴. 빠뜨린 확인(3.2·15.4), 처치를 바꾼 것(13.3·17.2), 같은 뜻(8.6·15.1·7.4·11.3·11.7), 되풀이 상한 초과("약" 7, "팔" 6) |
| 5 order | 3 | 21장 중 2↔3 교환이 자연스러운 것 2장(S8·S20), 임상 순서가 위험한 것 2장(S10·S17), 에스컬레이션이 마지막인 것 1장(S16) |
| 6 tag·icon | 4 | 역할을 말함. `안심`/`안심 설명`이 섞임, 정맥로 문장(13.2·13.3)의 `cross` 아이콘은 오답 표시로 읽힐 수 있음(사소) |
| 8 파일럿 갈래 | 3 | 동떨어진 빈칸 오답(meal·lunch·shower·nap·speech·diet·politely·loudly)이 남아 있음. 관사로 걸러지는 것 1건 |

## 사실 오류와 심각한 문제
1. **19.4 `I'm calling it now, everyone move fast.`**: 미국 병원에서 "call it"은 소생술을 멈추고 사망 시각을 선언한다는 뜻으로 가장 흔히 쓰입니다. 서맥 응급 장면에서는 정반대 뜻으로 들립니다. why("상황을 선언하고 팀을 부른다")도 틀렸습니다. → en을 `I'm calling a code now, everyone move fast.`로 바꾸세요. ko는 "지금 코드를 부를게요, 다들 빠르게 움직여 주세요"로 쓰고, chunks·blank(answer `fast` 유지 가능)·distractorsKo 둘도 새로 씁니다. 결정 11에 해당하니 A와 공유해야 합니다.
2. **14.2 `If the pulse pressure variation drops, she's likely fluid responsive.`**(메모 질문): 메모의 판단이 맞습니다. 수액 반응성은 PPV가 **높을 때**(보통 >12~13%, 기계환기·동리듬 환자) 예측합니다. PPV가 줄어드는 것은 수액을 준 **뒤의 결과**입니다. → en `If the pulse pressure variation is high, she's likely fluid responsive.` / ko "맥압변이가 크면 수액에 반응할 가능성이 높아요". chunks는 `If the pulse pressure / variation is high / , she's likely / fluid responsive / .`, blank는 answer `high`·options `high / loud / late / clean`으로 하세요(기존 about/bound/ready는 셋 다 문법으로 걸러짐). distractorsKo는 "심박변이가 크면 수액에 반응할 가능성이 높아요"와 "맥압변이가 크면 약에 반응할 가능성이 높아요"로 씁니다. 결정 11에 해당합니다.
3. **S10 order 3줄 `While I do that, I'll look for air bubbles…`**: 플러시하는 동안 공기 방울을 찾으면 그 공기를 환자 쪽(동맥)으로 밀어 넣게 됩니다. 점검을 먼저 하고 플러시는 그다음입니다. 시간을 한정하는 While도 씁니다. → 1 그대로 / 2 `First, I'll look for air bubbles, kinks, or a loose connection.` / 3 `With those cleared, let me do a fast-flush test to check the system.` / 4 `If it looks right, the waveform should be sharper, and I'll recheck the number.` why도 이 순서에 맞춰 고칩니다.
4. **S17 order 3줄 `Once the physician is here, we'll likely need phentolamine…`**: 해독제를 의사가 도착할 때까지 미룹니다. 처방은 전화로도 나옵니다. → `With the physician on the phone, we'll likely need phentolamine to treat the extravasation.`
5. **17.2 distractorsKo**(메모 질문): "감염을 치료하려면 / 멍을 치료하려면 phentolamine이 필요해요"는 혈관확장제를 틀린 적응증에 묶습니다. 약·적응증 바꾸기라 안전 시험에 실패합니다. → 같은 틀에서 안전한 옆 단계로 바꾸세요. 예: "혈관외 유출 범위를 표시하려면 피부용 펜이 필요해요", "혈관외 유출 부위를 재려면 줄자가 먼저 필요해요".
6. **이중 확인 문장에서 확인 대상을 바꿈**(빠뜨린 확인):
   - 3.2 X1 "유효기간과 펌프 설정을", X2 "농도와 펌프 전원을": 고위험 약의 농도·설정 확인이 빠집니다.
   - 15.4 X1 "이전 백의 라벨과 농도를", X2 "새 백의 라벨과 유효기간을": 새 백의 농도 확인이 빠집니다.

## 고칠 것 (47건: 안전 15, 정답 둘 16, order 4, 빈칸·동떨어짐 8, why 1, 되풀이 3)

### 안전 (15)
1. 19.4 en·why: "calling it"은 사망 선언으로 들림. 위 1번대로 고침(결정 11).
2. 14.2 en·ko·blank·distractorsKo: PPV 방향이 거꾸로임. 위 2번대로 고침(결정 11).
3. S10 order: 플러시 중 공기 점검. 위 3번대로 다시 씀.
4. S17 order 3줄: 해독제를 미룸. 위 4번대로 고침.
5. 17.2 distractorsKo 둘: phentolamine 적응증이 틀림. 위 5번대로 고침.
6. 3.2 distractorsKo 둘: 농도·설정 확인이 빠짐 → 앞 단계로 바꿈. "농도를 보기 전에 손부터 씻을게요" · "펌프 설정 전에 라벨부터 볼게요".
7. 15.4 distractorsKo 둘: 새 백 확인이 빠짐 → "새 백을 연결하기 전에 손부터 먼저 씻을게요" · "새 백 확인이 끝나면 이전 백 라벨을 뗄게요".
8. 3.1 X1 "백이 전용 중심라인 옆에 걸려 있는지": 들어가는 라인 대신 걸린 위치를 확인함(확인 대상 바꾸기, 경계) → 앞 단계로 바꿈. "노르에피네프린을 연결하기 전에 전용 중심라인을 같이 닦아요". 확인 위치를 바꾸는 식("펌프 앞에서")은 쓰지 마세요.
9. 3.6 blank `until/unless/though`: "sign off unless we both confirm"을 넣어 읽으면 확인 없이 서명함 → 빈칸을 `sign off`로 옮김. options `sign off / sign in / sign up / sign out`.
10. 13.2 blank `wrap`: "we wrap the site closely"는 승압제 말초 부위를 덮어 침윤을 가림 → `label`로 바꿈.
11. 13.3 X1 "말초정맥 확보가": 중심라인을 말초로 바꿔 중심정맥 확보가 늦어짐 → "그래도 중심정맥 확보 동의서가 최대한 빨리 필요해요".
12. 15.5 blank `stays/settles`: 혈압이 유지되는데 승압제 속도를 올리는 지시가 됨 → 빈칸을 `switch`로 옮김. options `switch / bath / meal / scan`.
13. 17.3 X1 "사진을 찍고"와 blank `photographing/measuring`: 팔 거상 대신 기록·측정을 함. measuring은 실제 침윤 처치 단계라 정답이 둘이기도 함 → X1은 "의사에게 연락하고 펌프를 멈춰 두었어요", blank 오답은 `labeling / weighing / brushing`.
14. 18.6 blank `other/extra`와 X2 "같은 농도로": 재개 용량을 바꾸거나(빈칸) 속도 조건을 빼 버림(X2) → 빈칸을 `restart`로 옮김(options `restart / relabel / rename / review`). X2는 앞 단계로 "확보되는 대로 같은 속도로 승압제 연결부를 닦을게요".
15. 19.2 X2 "산소통을 가져오세요": 서맥 30대에서 크래시카트(약·패드) 대신 다른 것을 가져옴 → 다음 단계로 "코드팀을 부르고 크래시카트 위 패드를 꺼내세요".

### 정답 둘 (16)
16. 8.6 blank `result`와 X1 "결과가 보이면": "as soon as we see a result"도 맞음 → blank 오답 `visitor/delay`는 두고 `result`를 `receipt`로, X1은 "변화가 보이면 바로 기록해 둘게요"(동사 하나 바꿈).
17. 15.1 X2 "두 번째 펌프를": 새 펌프와 같은 것 → "이전 펌프를 멈추기 전에 새 백을 먼저 확인할게요"(앞 단계).
18. 7.4 X1 "하나씩 늘리면서", 11.3 X2 "하나씩 줄여요": "조금씩"과 뜻이 같음 → 7.4 X1은 시각을 바꿈. "용량을 한 시간마다 늘리면서 자세히 지켜보고 있어요". 11.3 X2는 "한 번에 줄이지 않고 내일부터 줄여요".
19. 11.7 X2 "좋은 신호예요": good start와 같은 뜻 → "고비를 넘기는 데는 시간이 걸리지만 이 추세는 가족 덕분이에요".
20. 3.7 X2 "다 정리됐네요": checks out과 가까움(경계) → "좋아요, 다 맞네요. 펌프 내일 인계받으셔도 돼요".
21. 5.1 blank `sharply/suddenly`: 장면이 속도를 정하지 않아 둘 다 맞음 → `nearly / rarely`로 바꿈(`briefly`는 둠).
22. 1.4 blank `raise`: 동맥압 라인 조정 중에 팔을 드는 것도 맞음 → `scan`.
23. 13.5 blank `tested`: 중심라인은 위치를 확인한 뒤 씀. 정답이 둘(경계) → `priced`.
24. 13.4 blank `wet/itchy`: 새는 자리나 가려운 자리도 중단 사유임 → `small` 외에 `dry / clean`.
25. 17.4 blank `size`: 붓기는 침윤 신호 → `sound`.
26. 19.5 blank `wider`: 넓은 QRS 서맥도 맞는 말(경계) → `louder`.
27. 21.7 blank `night`: "The night team is getting ready"도 맞음 → `spare`.
28. 2.7 blank `reports`: "as soon as the team reports which number"도 맞음(경계) → `forgets`.
29. 3.2 blank `expiration`: 유효기간도 이중 확인 항목 → `color`.
30. 9.7 X2 "수액이 효과가": 수액도 치료의 일부라 뜻이 겹침 → "이 관류 지표들이 치료가 효과가 있는지 저녁에 알려 줘요"(시각).
31. 21.2 X1 "발동할 수 있어요"(메모 질문): should와 거의 같은 뜻 → "ECMO 팀이 지금 도착해야 해요"(동사 하나, 지연·대상 변경 없음). X2 "발동하기로 했어요"는 써도 됩니다.

### order (4)
32. S8: 2↔3을 바꿔도 자연스러움 → 3줄 `That combination is a normal step, not a sign of worsening.`(2줄의 alongside를 받음).
33. S20: 2↔3을 바꿔도 자연스러움 → 3줄 `Adding it at that point is a standard step in this kind of shock, not a last resort.`
34. S16: `On top of that`은 어느 줄 뒤에나 붙고, 불응성 쇼크 에스컬레이션이 맨 끝에 옴 → 1 상황 / 2 `I'm escalating this now using SBAR.` / 3 `In my report, I'll say we should reassess for a reversible cause.` / 4 `That means checking for bleeding, infection, or anything else reversible.` why도 고침.
35. S5 2줄 `That is why I'm charting the vitals every hour`: ICU에서 매시간 기록은 기본이라 "그래서"가 어색함(사소) → `To keep watching it, I'm charting the vitals every hour.`

### 빈칸 문법·동떨어짐 (8)
36. 2.4 `gradually/randomly/suddenly … than`: 셋 다 문법으로 걸러짐 → 빈칸을 `cuff`로 옮김. options `cuff / cast / sling / brace`.
37. 7.6 `last/half/one time`: 문법으로 걸러짐 → 빈칸을 `updated`로 옮김. options `updated / uploaded / upgraded / upset`.
38. 17.1 `an fracture`: 관사로 걸러짐 → `abrasion`.
39. 6.5 `shower/meal/nap`: 장면과 동떨어짐 → `x-ray / dressing / blood draw`.
40. 4.6 `quietly/politely/loudly`: 동떨어짐 → `slowly / late / alone`.
41. 8.4 `lunch`, 8.5 `speech`, 15.3 `meal/visit`, 12.2 `weight/height/diet`: 같은 분야의 틀린 말로 바꿈. 예: 8.4 `trial`, 8.5 `sound`, 15.3 `x-ray/scan`, 12.2 `oxygen/urine/fluids`.
42. 13.7 `few/only knows`: 문법으로 걸러짐 → `the family / the patient`.
43. 11.3 빈칸이 `all`("not all at once")에 있음: 가르치는 말이 아니고 `some`은 문법으로 걸러짐 → 빈칸을 `small`로 옮김. options `small / rapid / giant / random`.

### why (1)
44. 13.2 "proximal IV는 … 약이 새어도 위험이 덜해요"는 부정확함 → "굵고 흐름이 좋은 근위부 정맥이라 약이 잘 희석되고 샐 위험이 줄어요. 손·손목·팔오금은 보통 피해요."

### 되풀이 상한 (3)
스크립트로 셌습니다(조사를 떼고, 오답에만 있는 낱말).
45. **"약" 7회**(상한 5): 11.7X1, 14.2X2, 14.3X2, 14.5X2, 14.6X2, 17.3X2, 17.6X1. S14의 "수액→약" 틀이 네 번 되풀이됨 → 14.3X2·14.5X2·14.6X2를 다른 세부(시각·횟수·사람)로 바꿈.
46. **"팔" 6회**(상한 5): 13.2X2, 14.1X1, 14.4X2, 14.5X1, 14.7X2, 17.4X2. S14에서 "다리→팔" 같은 틀이 네 번 나옴 → 14.4X2·14.7X2를 시각·숫자 바꾸기로.
47. **같은 틀 "조용히 ~"** 4회(11.2X2, 12.2X2, 17.7X2, 20.5X2): 상한 안이지만 "자세히→조용히"만 듣고 거를 수 있음. 응급 문장(17.7)을 포함해 둘은 다른 세부로 바꿈.
   이미 상한(5)에 닿은 낱말: 빠른·알람·맥박·펌프·세·체온·혈당. 고칠 때 이 낱말을 더 쓰지 마세요.

## 메모 질문 판정
- S14(메모의 상황 13) PPV: 방향이 거꾸로입니다. 위 2번대로 en·ko를 고치세요(결정 11).
- S17(메모의 상황 16) phentolamine 오답: 실패입니다. 위 5번대로 옆 단계로 바꾸세요.
- S21(메모의 상황 20) ECMO: X1 "할 수 있어요"는 정답과 같은 뜻이라 바꾸세요(31번). X2는 써도 됩니다.
- order를 지시어로 묶은 방식은 대부분 잘 됐습니다. S8·S20·S16은 예외(32~34번)입니다. 응급 4장 가운데 S17은 3줄의 "Once the physician is here"가 지연을 만듭니다(4번).

## 종합
decoy와 order 대부분은 쓸 만합니다. 안전 15건(특히 19.4 calling it, 14.2 PPV, S10 order, 17.2·3.2·15.4)과 정답 둘 16건을 고친 뒤에는 내보내도 됩니다. 19.4와 14.2는 v44 문장을 바꾸는 일이라 A 검토·결정 11 절차와 함께 처리해야 합니다.
