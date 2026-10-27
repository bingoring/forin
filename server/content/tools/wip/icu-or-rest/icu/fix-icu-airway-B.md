# fix-icu-airway-B — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-airway.yaml` (상황 21, 문장 126, order 21장). 문장마다 `en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy, order 인접 교환을 스크립트로 전부 뽑아 한 줄씩 판정했습니다.
표기: S상황.문장(0부터), D1/D2 = distractorsKo 첫째/둘째. 안전 판정은 "앞·뒤 단계면 통과, 그 순간 정답 행동 대신 하는 일이면 실패"로 했습니다.

**아래 새 값 전체를 적용해 길이(1.25배 또는 3자 이내, 둘 중 하나는 정답 길이 이하)와 되풀이 상한(어간 기준 주제당 5회 이하)을 다시 셌고 모두 통과합니다.**
처음 초안은 "~전에/~뒤에" 틀에 몰려서 '전' 20회·'뒤' 17회가 나왔습니다. 그래서 "~하고 나서·~하면·~하는 동안·~하려고·참인 이유" 틀로 나눠 다시 썼습니다.
새 값을 바꿔 쓰면 상한을 꼭 다시 세세요. 지금 상한에 걸린 말은 장비·마스크·확인·목(각 5회)입니다.

## 항목별 점수
1. why — 4/5. 대부분 말하는 방식의 이유를 말합니다. 사실 문제 2건(S16.2 심정지 알고리즘, S10.4 스토마 압박)이 있고, 오타·꼬인 문장이 2건, 예외를 빠뜨린 것이 1건입니다.
2. 빈칸 — 2/5. 넣어 읽으면 위험한 지시가 되는 선택지가 13문장입니다(약 순서·끈 제거·흡인 깊이·감시 빈도·호출 대상·시작 기준). 정답이 둘인 선택지는 약 20문장, 문법으로 걸러지는 것은 5문장입니다.
3. decoy — 3/5. 시점을 뒤집는 decoy(`after you push`·`right before`·`after we start`·`after this gets worse`·`after it closes`·`after one hour`)가 조립하면 그대로 위험한 지시가 됩니다. 잘못 안심시키는 것(`is rare`·`to wait and see`)과 위험한 조립(`in one syringe`·`to the top`·`if I'm not busy`·`the sepsis algorithm`)도 있습니다.
4. distractorsKo — 2/5. **되풀이 상한은 통과**합니다(최대 5회: 산소·마스크·약물·모니터). 평상시 문장은 대체로 좋습니다. 그러나 **응급 묶음(S15~S20)의 오답 대부분이 "그 순간 정답 대신 하는 곁다리 행동"**입니다(시계·문·알람·전화기·의자·불·수건·장갑). 감시·확인 대상을 바꾼 오답도 많습니다(혈압→호흡·체온, SpO2→혈압, 양쪽→한쪽, 심박수→체온·혈당). 두 오답이 모두 정답보다 긴 문장은 10개입니다.
5. order — 3/5. 인접 교환을 해도 자연스러운 카드가 9장입니다(S0·S4·S6·S8·S9·S12·S13·S15·S18). 임상 순서가 틀린 카드도 1장 있습니다(S5: 새 드레싱을 붙인 뒤에 피부를 사정함).
6. tag·icon — 4/5. 태그는 역할을 말하고 일관됩니다. 아이콘은 성인 체위에 `baby`, 가습 산소에 `fire`를 썼습니다.
8. 파일럿 갈래 — 2/5. 응급 문장이 저자 메모대로 "곁다리 행동" 오답에 몰렸습니다. 같은 분야의 반대말을 빈칸 오답으로 쓴 것이 이 주제에서는 위험한 처치가 됩니다(deeply·loose·remove·rarely·last).

## 사실 오류·심각한 문제
- **S16.2 문장·why(사실)**: "If the heart rate stays low, we start the arrest algorithm." 맥박이 있는 서맥에는 서맥 알고리즘(아트로핀·조율)을 씁니다. 심정지 알고리즘은 맥박이 없을 때 시작합니다(A 메모와 같음). en은 A 몫입니다. 예컨대 "If he loses his pulse, we start the arrest algorithm."으로 고치고, 그에 맞춰 why·D·빈칸을 다시 쓰세요. 아래 40번은 en을 그대로 둘 때의 값입니다.
- **약 순서·혼합(RSI)**: S1.0 decoy `in one syringe`(진정제와 근이완제를 한 주사기에), S1.3 빈칸 `last`(유도제를 마지막에), S1.4 D2 "진정제를"과 decoy `right before`(근이완제를 먼저). 깨어 있는 마비를 부르는 순서입니다.
- **응급 행동 대신 곁다리(저자가 판정을 부탁한 것 포함)**: S15.3(시계·문 앞), S16.0(알람·전화기), S20.1(카트·상체 — 기도팀 호출이 빠짐), S16.4(준비·병 가져오기 — 주입 대신), S15.1·S15.2·S15.4, S18.0·S18.3·S18.4, S17.1, S20.2·S20.4, S2.2. 모두 실패로 판정합니다.
- **호출 대상·시점을 바꾸는 빈칸·decoy**: S9.4 빈칸 `radiology/pharmacy/security`와 decoy `after this gets worse`, S9.2 D1 "가족에게"와 decoy `after it closes`, S14.4 decoy `if I'm not busy`.
- **탈관·점막 손상 지시가 되는 빈칸**: S4.4 `remove/cut/tear`(끈 제거), S4.0 `loose`, S4.2 `firmly/deeply`, S11.4 decoy `to the top`(커프 과팽창).
- **감시·확인을 빠뜨리는 오답**: S8.2·S10.5·S12.2·S16.3·S18.5(감시 대상 바꿈), S11.2(양쪽 대신 한쪽), S12.1(호흡 대신 삼킴), S16.5·S16.2(재시도·알고리즘 기준을 혈당·체온으로), S3.0 D1과 빈칸 `brief/slight`(캡노로 깊이까지 확인, 잠깐의 색 변화로 기관 확인).

## 고칠 것 — 안전 (55)
1. S1.0 decoy `in one syringe`: "두 약을 한 주사기에"라는 조립이 됨 → `in the fridge`.
2. S1.2 D2 "이름을 같이 확인": 용량 확인이 빠짐 → "주입이 끝나면 용량을 같이 기록할게요". decoy `after you push`: 확인이 주입 뒤로 감 → `with the pharmacy`.
3. S1.3 빈칸 `first`의 `last/twice`: 유도제 순서·횟수가 바뀜 → 빈칸을 `ready`로, 선택지 `ready/sorry/late/afraid`.
4. S1.4 D2 "진정제를"(약 바꿈), D1 "전해 드릴게요"(건네드릴게요와 같은 뜻, 정답 둘), decoy `right before`(근이완제가 먼저) → D1 "그 다음에 근이완제 라벨을 바로 보여 드릴게요", D2 "그 다음에 근이완제 시각을 바로 적을게요", decoy `to the pharmacist`.
5. S1.5 D1 "라벨을"(라벨에 농도가 있으니 정답 둘), D2 "포장을"(농도 확인이 빠짐), decoy `after we start` → D1 "시작하기 전에 농도를 차트에 적어요", D2 "시작하기 전에 주사기를 나란히 놓아요", decoy `with the family`.
6. S2.2 D1 "표시를 해 주세요", D2 "목에 … 베개를": "지금" 해야 할 BURP 압박 대신 다른 일을 함 → D1 "지금 연골을 손끝으로 찾아 위치를 짚어 주세요"(앞 단계), D2 "튜브가 들어가면 연골 압박을 천천히 풀어 주세요"(뒤 단계).
7. S3.0 D1 "튜브 깊이를 확인": 캡노가 깊이까지 확인한다는 잘못된 안심 → "캡노그래피에서 색 변화가 지속되어 엑스레이를 처방해요". 빈칸 `sustained`의 `brief/slight/sudden`: 잠깐 바뀐 색으로 기관 삽관을 확인했다는 판단이 됨(식도 삽관을 놓침) → 빈칸을 `confirming`으로, 선택지 `confirming/cleaning/drying/warming`.
8. S3.2 D1 "복부 엑스레이": 검사가 바뀜 → "튜브 깊이를 확인하기 위해 흉부 엑스레이를 기다릴게요".
9. S3.3 decoy `at the end of shift`: 확인 결과 공유가 늦어짐 → `with a smile`.
10. S4.0 빈칸 `snug`의 `loose`(끈이 느슨하면 탈관)와 `tight`(snug와 같은 뜻, 정답 둘) → 빈칸을 `ties`로, 선택지 `ties/labels/sheets/gloves`.
11. S4.2 D1 "입안을"(흡인 부위), D2 "닦아요"(흡인 대신), 빈칸 `firmly/deeply`(점막 손상) → D1 "흡인하고 나서 양쪽 폐음을 다시 들어 봐요", D2 "흡인할 때는 맞는 크기의 카테터를 골라 써요". 빈칸을 `clear`로, 선택지 `clear/warm/dry/numb`.
12. S4.4 빈칸 `retie`의 `remove/cut/tear`: 끈을 제거하는 지시(탈관) → 빈칸을 `loose`로, 선택지 `loose/new/dry/white`.
13. S6.1 D1 "청진기", D2 "비강 캐뉼라": 구조 기도기를 다른 장치로 바꿈. 빈칸 `nasopharyngeal`은 실제 보조 기도기라 정답 둘·다른 처치. decoy `as a first choice`는 계획을 뒤집음 → D1 "구조 옵션으로 성문상 기도기 크기를 재 둘게요", D2 "성문상 기도기 옆에 윤활제도 함께 둘게요". 선택지는 `supraglottic/subglottic/sublingual/subcutaneous`, decoy는 `with the chart`.
14. S7.1 D1 "안면 마스크는 계속 씌워": 후두경 중에는 쓸 수 없는 장치로 바꿈 → "apneic 산소화를 위해 비강 캐뉼라 연결관도 살펴 둘게요". 빈칸 `catheter`(비강 카테터도 산소 장치, 정답 둘) → `swab`.
15. S7.3 D1 "담요를 덮어": 전산소화 마스크 대신 다른 일 → "약물을 주입하기 전에 흡인기를 켜 둘게요". decoy `after we push`(마스크를 주입 뒤에) → `with the blanket`.
16. S7.0 D1 "몇 번 전산소화"(경계): 전산소화 시간(3분 기준)이 줄어듦 → "몇 분간 전산소화하려고 마스크를 얼굴에 맞춰요".
17. S8.0 decoy `after we finish`: 승압제 준비가 끝난 뒤로 감 → `for the family`.
18. S8.1 decoy `is rare`: "삽관 전후 저혈압은 드물다"는 잘못된 안심 → `in the hallway`.
19. S8.2 D1 "호흡", D2 "체온": 삽관 전후 혈압 감시가 빠짐. 빈칸 `rarely/briefly`는 감시를 줄이는 지시 → D1 "시작하기 전에 혈압 기준치를 재 둘게요", D2 "전 과정 동안 혈압을 흐름표에 적을게요". 빈칸을 `watch`로, 선택지 `watch/explain/print/discuss`.
20. S8.5 D1 "모니터에 적어 둘게요": 떨어지는 혈압을 소리 내어 알리지 않음 → "혈압 숫자를 소리 내어 알리면 팀이 화면을 안 봐도 돼요"(참인 이유).
21. S9.0 D2 "조기 소독": 처치가 바뀜 → "기도 화상은 빠르게 부을 수 있어서 조기 삽관 카트를 침상에 둬요". decoy `so we wait and see`(대기) → `so his family is here`.
22. S9.1 D2 "기록해야 한다는": 행동 대신 기록 → "쉰 목소리와 협착음은 기도가 좁아진다는 경고 징후예요"(참인 이유). decoy `to wait and see`는 조립하면 "경고 징후니 지켜보자"가 됨 → `to rest at home`.
23. S9.2 D1 "가족에게"(호출 대상), D2 "모니터해야"(확보 대신 감시), decoy `after it closes`, 빈칸 `open`(정답 둘) → D1 "팀에 알리고 나서 기도 확보 장비를 침상 옆에 가져올게요", D2 "팀이 오는 동안 흡인기를 켜고 삽관 카트를 열어 둘게요". decoy는 `with the chart`, 빈칸 선택지는 `secure/weigh/mark/label`.
24. S9.4 빈칸 `anesthesia`의 `radiology/pharmacy/security`(호출 대상)와 decoy `after this gets worse` → 빈칸을 `worse`로, 선택지 `worse/busy/noisy/crowded`. decoy는 `at the nurses' station`.
25. S10.0 D1 "윤활제와", D2 "예비 거즈"(경계): 폐쇄자·예비관이 빠짐 → D1 "폐쇄자를 새 관에 끼우고 윤활제를 발라 둘게요", D2 "예비 기관절개관 커프에 바람을 넣어 새는지 볼게요".
26. S10.5 D1 "혈압 수치를", D2 "산소 통을": 교체 중 SpO2 감시가 빠짐 → D1 "새 기관절개관이 확인되면 산소 수치를 흐름표에 적어요", D2 "새 기관절개관이 확인되면 산소 유량을 원래대로 맞춰요".
27. S11.2 D1 "한쪽이", D2 "위쪽이": 양쪽 분리 확인이 빠짐 → D1 "청진하려고 한쪽 내강 잠금 장치를 챙길게요", D2 "양쪽이 분리되면 튜브 깊이를 기록할게요".
28. S11.4 decoy `to the top`: "커프를 끝까지 부풀린다"가 됨(점막 허혈) → `to the chart`.
29. S12.1 D1 "삼킬 수 있는지": 커프를 뺀 뒤 공기가 통하는지 보는 확인이 빠짐 → "밸브를 달려고 입안 분비물을 먼저 흡인해요".
30. S12.2 D1 "맥박을 지켜보다가": 발성밸브 중 호흡 감시가 빠짐 → "밸브를 빼고 나면 호흡과 맥박을 한동안 다시 지켜볼게요".
31. S12.4 decoy `after one hour`: 힘들어해도 한 시간 뒤에 밸브를 뺌 → `at the window`.
32. S12.5 D2 "가족이 곁에 있을 때만": 호흡 조건이 빠짐 → "밸브를 시도하려고 의식과 호흡을 흐름표에 적어요".
33. S13.1 D1 "끈 길이를"(경계): 커프압 확인이 빠짐 → "분비물이 새어 들어가지 않도록 커프압을 기록해요".
34. S14.4 decoy `if I'm not busy`: "바쁘지 않으면 호출하겠다"가 됨 → `with the chart`.
35. S15.1 D1 "포장지를 치워", D2 "위치를 보고 팀에": 외과 호출이 빠지거나 늦어짐 → D1 "목을 뒤로 젖혀야 윤상갑상막절개술 키트를 쓰기 쉬워요"(참인 이유), D2 "외과를 기다리며 윤상갑상막절개술 키트 옆에 메스를 펴 두세요"(뒤 단계).
36. S15.2 D1 "추가 모니터를", D2 "수액을": 외과적 기도 대신 다른 것을 준비함. 빈칸 `nasal`(CICO에서 비강 기도기를 준비) → D1 "외과적 기도가 열리면 그 길로 산소화를 시작할게요", D2 "외과적 기도를 준비하는 동안 산소화를 이어 가야 시간을 벌어요". 선택지는 `surgical/cardiac/dental/spinal`.
37. S15.3(저자 요청) D1 "시계를 봐 주세요", D2 "문 앞을 비워 주세요": 그 순간 호출 대신 하는 일 → **실패**. D1 "지원이 와야 산소화를 이어 가요"(참인 이유), D2 "지원팀이 오면 문에서 안내해 주세요"(뒤 단계).
38. S15.4 D1 "기도 카트의 위치를 표시", D2 "큰 소리로 읽고": 막 표시 대신 다른 일 → D1 "윤상갑상막 위치를 손가락으로 찾고 있어요"(앞 단계), D2 "윤상갑상막을 표시하면 메스를 건네 드릴게요"(뒤 단계).
39. S16.0(저자 요청) D1 "모니터 알람을 100퍼센트 켜", D2 "전화기를 100퍼센트 충전": 백마스크 환기 대신 하는 일 → **실패**. D1 "시도를 멈추고 머리를 젖히고 턱을 들어 기도를 여세요"(환기 앞 단계), D2 "시도를 멈추고 산소를 줘야 심박수가 돌아올 수 있어요"(참인 이유).
40. S16.2 D1 "혈당이", D2 "체온이": 심정지 알고리즘 시작 기준이 바뀜. 빈칸 `high/normal/steady`도 같은 문제이고, decoy `the sepsis algorithm`은 다른 프로토콜이 됨 → (en을 그대로 둘 때) D1 "심박수가 낮아지면 응급 카트를 침상 옆으로 당겨요", D2 "심박수가 계속 낮으면 제세동기 패드를 가슴에 대요". 빈칸을 `start`로, 선택지 `start/review/print/copy`. decoy는 `the lunch order`. en을 고치면 다시 쓰세요(위 사실 문제).
41. S16.3 D1 "체온을"(감시 대상), D2 "메모해 주세요"(소리 내어 알리기 대신) → D1 "누군가 심박수를 불러 줘야 시술자가 화면을 안 봐도 돼요"(참인 이유), D2 "누군가 모니터 리드가 잘 붙어 있는지 봐 주세요"(앞 단계).
42. S16.4(저자 요청) D1 "준비해 둬요", D2 "병을 가져와요": 산소에 반응이 없어 주입할 순간에 준비·가져오기를 함 → **실패**. D1 "아트로핀을 주입하고 나면 심박수를 다시 불러요"(뒤 단계), D2 "산소를 주는 동안 아트로핀을 주사기에 미리 뽑아 둬요"(앞 단계).
43. S16.5 D1 "체온이", D2 "혈당이": 재시도 기준에서 심박수가 빠짐. 빈칸 `sugar/weight/pain`도 같은 문제 → D1 "산소포화도와 심박수가 회복되면 팀에 숫자를 불러 줄게요", D2 "다시 시도할 때는 비디오 후두경으로 바꿀게요". 빈칸을 `try`로, 선택지 `try/chart/report/meet`.
44. S17.1 D1 "더 작은 장갑", D2 "기관절개관 끈": 재삽입용 작은 관이 빠짐 → D1 "재삽입을 위해 동일 크기 기관절개관에 폐쇄자를 끼우세요", D2 "재삽입하면 새 기관절개관 끈으로 관을 고정하세요".
45. S17.4 빈칸 `while`의 `after/before`(산소가 끊기거나 늦어짐), `until`(정답 둘) → 빈칸을 `holding`으로, 선택지 `holding/spraying/pouring/wiping`.
46. S18.0 D1 "커프 압력계를 연결", D2 "수건을 받쳐": 커프 과팽창 대신 하는 일 → D1 "커프를 과팽창시키면 관이 출혈 부위를 안쪽에서 눌러 줘요"(참인 효과), D2 "커프를 과팽창시키고 나서 압박을 유지하며 외과를 기다려요".
47. S18.2 D2 "정맥로는 계속 확보": 기도 유지가 빠짐 → "출혈이 멎으면 기도 위치를 다시 확인해 주세요".
48. S18.3 D1 "의자를", D2 "불을": 인력 요청 대신 하는 일 → D1 "외과가 오면 누군가 출혈 부위를 보여 주세요", D2 "사람이 더 모이면 누군가 압박을 교대해 주세요".
49. S18.4 D1 "장갑을", D2 "약물 카트를": 기도 카트 준비가 빠짐 → D1 "당신이 기도 카트를 준비하면서 흡인기 전원도 바로 켜요", D2 "제가 압박을 유지하는 동안 손이 지치면 당신이 교대해 주세요".
50. S18.5 D2 "통증이": 출혈 감시가 빠짐 → "출혈량을 보려고 흡인통 눈금을 지금 적어 주세요".
51. S19.2 decoy `after the break`: 재확인 장비 준비가 늦어짐 → `for the lecture`.
52. S20.1(저자 요청) D1 "기도 카트를 가져오세요", D2 "상체를 높이세요": 에피네프린을 주는 동안 해야 할 기도팀 호출이 빠짐 → **실패**. D1 "분무 에피네프린을 주고 나서 기도팀에 효과를 알려 주세요", D2 "분무 에피네프린이 부은 점막을 줄여 시간을 벌어요"(참인 효과).
53. S20.2 D1 "기관지 내시경"(백업 처치가 바뀜), D2 "산소와"(삽관 준비가 빠짐). 빈칸 `manual/simple`(외과적 기도 대신 단순 기도) → D1 "삽관하면서 목에 절개 위치를 표시해 두세요", D2 "삽관이 안 되면 외과적 기도로 넘어가세요". 빈칸을 `intubation`으로, 선택지 `intubation/discharge/transfer/feeding`.
54. S20.4 D1 "흡인기를", D2 "환자를 안심시키는": 에피네프린 준비가 빠짐 → D1 "누군가 어려운 기도팀을 부르면 제가 에피네프린 효과를 지켜볼게요", D2 "어려운 기도팀이 도착하면 제가 에피네프린 투여 시각을 알려 줄게요".
55. S13.0 D1 "침대 난간을 계속 올려"(경계): 흡인 예방의 핵심인 침상 머리 올리기가 빠짐(난간을 넷 다 올리면 억제대 문제도 있음) → "침대 머리를 높일 때 튜브가 당기지 않게 잡아요".

## 고칠 것 — 정답 둘 (22)
1. S0.3 빈칸 `hand over`: "필요할 때 건네려고 꺼내 둔다"로도 맞음 → `throw away`.
2. S0.4 D1 "옮겨 놓을게요" = 끌어다 놓을게요 → "시작하기 전에 기도 카트를 벽 쪽으로 밀어 놓을게요".
3. S0.5 D1 "알려 주세요" = 말해 주세요 → "트레이에 뭔가 빠져 보이면 말해 주세요".
4. S1.0 빈칸 `single`(낱개 주사기 = 따로), `sterile`(참) → `frozen`·`broken`.
5. S1.2 빈칸 `labels/names`(라벨 확인도 맞음) → 선택지 `doses/prices/colors/rooms`.
6. S1.5 빈칸 `write down/talk about`(둘 다 시작 전에 할 만한 말) → `double-check/give out/throw out/sell off`.
7. S3.2 빈칸 `review/repeat`(판독·재촬영도 맞음) → 빈칸을 `depth`로, 선택지 `depth/color/brand/price`.
8. S3.4 D2 "확인 방법을": the confirmation으로는 방법과 내용이 갈리지 않음(why도 "방법과 결과를 함께") → "확인 내용을 게시판에 기록해요". 빈칸 `describe/discuss`도 맞음 → `document/delete/fold/hide`.
9. S5.2 빈칸 `infection`(습기 관리로 감염도 줄어듦) → `tanning`.
10. S5.3 빈칸 `going/ready`(I'm going to = 곧) → `about/afraid/sorry/proud`.
11. S5.4 빈칸 `corners`(≈ edges). `center/floor`는 `look`과 수가 안 맞아 문법으로 걸러짐 → 빈칸을 `drainage`로, 선택지 `drainage/bleeding/swelling/crusting`.
12. S5.5 빈칸 `repeat`(근무마다 재사정은 맞음) → `document/delete/forget/hide`.
13. S6.0 빈칸 `bronchoscope`(비디오 기관지경은 실제 어려운 기도 장비) → `microscope`.
14. S7.5 빈칸 `steadier`(포화도를 더 안정되게 — 맞는 말) → `colder`.
15. S8.0 빈칸 `expand`(volume expansion = 같은 뜻)·`estimate` → 빈칸을 `ready`로, 선택지 `ready/hidden/away/returned`.
16. S9.1 빈칸 `wheezing/snoring`(흡입 손상에서 둘 다 경고 징후) → `stridor/sneezing/yawning/hiccups`.
17. S10.1 빈칸 `vomits`(구토 대비 흡인도 맞음) → `shivers`.
18. S10.4 빈칸 `oxygen/suction`(교체 중 스토마에 산소·흡인을 대는 건 맞는 처치) → 빈칸을 `remove`로, 선택지 `remove/label/clean/count`.
19. S12.1 빈칸 `speak/cough`(커프를 빼면 발성·기침으로 공기 흐름을 확인) → `breathe/sleep/eat/blink`.
20. S12.2 빈칸 `sleeps`(잘 때는 발성밸브를 빼는 게 맞음) → `struggles/eats/smiles/reads`.
21. S19.4 빈칸 `effort` → `money/space/paper`.
22. S20.3 빈칸 `see`(가슴 움직임이 덜 보인다 — 거의 같은 보고) → `hear/smell/taste/print`.

## 고칠 것 — 기타 (29)
길이(오답 둘이 모두 정답보다 긺, 25주제 규칙):
1. S0.0 D1 → "후두경 날을 테스트하고 튜브 커프를 확인할게요".
2. S3.3 D1 → "이 사진을 바로 팀과 공유할게요".
3. S4.5 D1 → "가습기에 물이 깨끗한지 확인해요".
4. S9.4 D1 → "점심 전에 지금 마취과를 호출하고 있어요".
5. S17.0 D1 → "목 거즈가 빠졌어요 — 스토마를 덮고 입과 코 위로 산소를 주세요".
6. S19.1 D2 → "튜브를 빼고 백으로 환기하며 다음 시도 전에 날을 바꿔요". (S2.2·S9.2·S15.1·S16.4는 위 안전 항목의 새 값으로 해결됩니다.)

문법으로 걸러지는 빈칸·장면과 동떨어진 빈칸:
7. S4.1 `causes/allows/needs … from`은 문법으로 걸러짐 → 빈칸을 `Humidified`로, 선택지 `Humidified/Filtered/Bottled/Portable`.
8. S9.5 `wear off/clean out/back off`는 목적어가 맞지 않음 → `close off/dry out/warm up/numb`.
9. S17.1 `a older`(관사) → `heavier`.
10. S17.2 `a old`(관사) → `large`.
11. S13.4 `on a request`(관용은 on request) → `dare`.
12. S15.0 `question/schedule/meeting`(동떨어짐) → `drill/consult/handoff`.
13. S16.0 `water/saline`(동떨어짐) → `oxygen/effort/humidity/volume`.
14. S16.4 `music/rest`(동떨어짐) → `oxygen/fluids/warming/positioning`.
15. S17.0 `water/lotion/heat`(동떨어짐) → `oxygen/gauze/tape/pressure`.

decoy 반대말(조립하면 틀린 보고, 위험은 낮음):
16. S3.5 `and loose` → `and labeled`. 빈칸 `loose`와도 겹침.
17. S4.3 `after I start` → `with a towel`.
18. S5.2 `can cause` → `in the drawer`.
19. S7.2 `less safe time` → `more paperwork`.

order(인접 교환·임상 순서):
20. S5: 3줄이 "새 드레싱을 붙였으니 피부를 본다"는 순서임. 피부 사정은 옛 드레싱을 뗀 뒤, 새 드레싱을 붙이기 전에 함 → 2 "With the old dressing off, I clean the stoma." 3 "While it's open, I check the skin for redness or breakdown." 4 "Then a fresh dressing goes on, and I document what I saw." why도 맞추세요.
21. S8: 1↔2를 바꿔도 자연스러움(위험 → 준비) → 1 "Sudden hypotension right after intubation is common." 2 "So let's have a pressor ready before we start." 3 "Once he's intubated, I'll watch his pressure closely." 4 "I'll call out the numbers if it keeps dropping."
22. S9: 1↔2를 바꿔도 자연스러움 → 2 "Those signs mean the burns are swelling, so early intubation is safer." 4 "If we wait for them, his airway could close off."(them = 3줄의 마취과).
23. S6: 3·4줄이 모두 1·2줄에만 기대어 3↔4·2↔3을 바꿔도 됨 → 4 "Once we've agreed on that, I'll keep it all within reach of the bed."
24. S12: 3↔4를 바꿔도 됨 → 4 "If talking makes him struggle, I take the valve off right away."
25. S18: 2↔3·3↔4를 바꿔도 됨 → 3 "Once they're here, I'll keep firm pressure on while you set up the airway cart." 4 "With the cart set up, keep watching for blood loss and call out the numbers."
26. S4·S0·S15(약함): S4는 3·4줄이 모두 2줄에 기댐 → 4 "With the ties done, I make sure the humidifier has enough water." S0은 3↔4 → 4 "If any of that looks off to you, tell me before we start." S15는 2↔3 → 3 "While backup comes, I'll keep oxygenating as we prepare the surgical airway." S13의 3줄 "That includes brushing…"는 앞 줄(자세 바꾸기)과 논리가 안 맞음 → "With him turned, we brush his teeth and swab his mouth on a schedule."

why·icon:
27. why: S2.1 "묻으면" → "물으면". S1.0 둘째 문장(진정제 → 근이완제 순서)은 이 문장을 왜 그렇게 말하는지와 상관없음 → "주사기를 나눠 두면 한 약씩 따로 주입할 수 있어요". S13.0 "위 내용물이 중력 때문에 올라와 기도로 넘어가는 일이 줄어요"는 문장이 꼬임 → "상체를 높이면 중력 덕분에 위 내용물이 기도로 넘어가는 일이 줄어요".
28. why 사실: S10.4 기관절개관을 교체할 때 스토마를 눌러 지혈하는 건 표준 역할이 아님. 보조자는 새 관·폐쇄자를 건네고 관을 잡아 줌(문장 ko "눌러 지혈"과 함께 A와 확인 필요). S17.0 why에 "위쪽 기도가 열려 있는 환자라면"을 붙이세요(후두적출 환자는 입·코로 산소가 가지 않음).
29. icon: S2.0·S13.3 `baby`(성인 체위) → `hospital`. S4.1 `fire`(가습 산소, 화재를 연상시킴) → `shield`. S15.4 `magnify` → `scalpel`. 그리고 S0.1 D1 "문 앞에"(흡인기를 침상에서 먼 곳에 둠, 경계) → "흡인기는 침상 곁에 설치돼 있고 충전돼요".

## 종합
고칠 것은 106건(안전 55, 정답 둘 22, 기타 29)입니다. 응급 묶음 S15~S20의 오답 뜻을 "앞·뒤 단계·참인 이유"로 바꾸고, RSI 약 순서를 지키고, 위험한 빈칸·decoy를 고친 뒤에 내보낼 수 있습니다. S16.2 en은 A와 함께 먼저 정해야 합니다.
