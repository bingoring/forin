# fix — icu-liver-failure · B 검토 (v46 1~6·8, distractorsKo ①~⑥·되풀이 상한)

대상 `icu-liver-failure.yaml`(A·B 합친 파일), 문장 126개·order 21장 **전수**. 대상 파일은 고치지 않았습니다.
뽑은 스크립트(작업 폴더): `review_icu-liver-failure_B.py`(sent·order·rep — en|ko|오답 둘, 빈칸 네 줄, decoy를 청크 자리마다 넣은 조립, order 인접 교환, 되풀이 셈),
`proposed_icu-liver-failure_B.py`(아래 새 distractorsKo를 넣은 상태로 V20 길이·"둘 중 하나는 정답 길이 이하"·되풀이 상한을 다시 셈 — **전부 통과, 상한 5 이하**),
`decoy_icu-liver-failure_B.py`(새 decoy의 V18 모양 확인 + 넣은 자리의 조립문 출력 — 통과).

## 안전 판정에 쓴 기준 (저작자 질문에 대한 답)
- **통과:** 오답 행동이 **문장에 말한 그 처치 자체의** 바로 앞·뒤 단계(칼륨 넣은 백에 라벨, 배양 검체 보내기, 수혈 동의서, 이미 있는 카트 바퀴 잠금, 알부민 빈 병 폐기, NAC 시작 뒤 활력징후).
- **실패:** 그 처치와 상관없는 일반 잡무가 처치 자리를 차지한 것(손 소독·마스크·가운·장갑·시트·베개·서랍·조명·담요·쓰레기통·카트 밀기·서류·짐),
  다른 시술의 단계(가운·키트·소독은 **라인 시술**의 단계이지 **혈장·교정**의 단계가 아님), 보관·기록·설명·준비로 바꾼 것, 보고 문장의 **알리는 내용**을 바꾼 것.
- **감시·사정 문장의 "참인 진술" 오답**(0.1·0.3·2.4·3.1·4.1·4.4·6.1·7.2·9.0·11.1·11.4·12.1·13.4·14.4·15.5·16.4·16.5·17.1·18.1·19.4·19.5 등): **조건부 통과.**
  해가 없고 정답과 뜻이 갈리며, 브리프의 "처치가 하나뿐인 문장은 참인 다른 효과·이유" 예외에 듭니다. 다만 행동 동사가 없어 "행동문 하나 + 설명문 둘"
  모양으로 걸러지는 약점(①③)은 남습니다 — 고칠 것에는 **사실이 틀렸거나(8.0·8.5) 정답과 같은 뜻(20.4)인 것만** 넣었습니다.
- **처치 문장을 "같은 틀 + 앞·뒤 단계"로 고칠 때의 함정(검증하며 확인):** 새 값을 처음 "~하기 전에/~한 뒤"로만 쓰자 '전에' 38회·'뒤' 21회로 상한을 크게 넘었습니다.
  아래 새 값은 단계를 구체 동사(녹이다·데우다·맞추다·뽑다·옮기다·붙이다)로 쓰고 알릴 사람을 바꾸는 식으로 섞어 **모든 낱말 5회 이하**로 맞췄습니다.
- **보고 문장(4.5·8.2·9.2):** 알리는 내용을 바꾼 것은 **실패**(보고할 것이 빠지고, 바꾼 말이 en에 들리지 않음). 알릴 **사람**만 바꿉니다.

## 항목별 점수
1. why — 4/5. 대부분 "왜 그렇게 말하는지"를 말함. 7.1이 엉킨 문장, 7.3·순서 7이 낡은 FFP 관행을 정당화, 8.0이 "동공이 가장 먼저", 10.0·13.2가 ko 되풀이.
2. 빈칸 — 3/5. 정답 둘 11(6.0 explain, 11.1 labeling/expiry/storage가 전부 실제 확인 항목, 20.2 think, 10.2 transplant pharmacist 등), 관사·수 일치로 걸러짐 5(10.3 an visit/bill/rest, 8.5 a older, 11.5 kidneys does, 3.4 nose don't, 16.2 hormone), 동떨어짐·묶음 돌려쓰기 14.
3. decoy — 1/5. **126개 중 73개가 끝이 관사·전치사·대명사로 끊긴 조각**(that your, every so, as for, one by, on top …)이고 그 밖에도 어느 청크 자리에도 맞지 않는 것이 많아 **118개가 모양으로 걸러짐**(TASK 실패 7). 그중 8개는 거꾸로 **ko와 같은 문장을 조립**(20.5 as long → "stay with him as long as you want", 10.0 if he is, 6.1 for the cause 등).
4. distractorsKo — 2/5. 되풀이 상한은 통과(최대 5). 그러나 처치·위기 문장 오답 대부분이 일반 잡무로 처치를 대신(안전 42), 정답 둘 2, 사실 오류 2.
5. order — 3/5. 순서가 둘인 카드 4(5·14·16·20) + 약한 곳 4(1·8·9·19), 임상 논리 오류 1(4 "after both fixes" — 칼륨은 혈당을 올리지 않음), 역할 모순·범위 1(15).
6. tag·icon — 4/5. 태그는 일관. 아이콘 `baby`를 머리 거상(8.1·8.4)에, `lock`을 칫솔(3.4)에 씀.
8. 파일럿 갈래 — 2/5. 동떨어진 빈칸 오답, 관사로 걸러짐, decoy 조립, order 임상 순서(5 보고 전에 배양·천자, 7 예방적 FFP, 15 간호사가 고장성 식염수 지시) 모두 남음.

## 사실 오류·심각한 문제
1. **위기 처치 오답이 처치를 잡무로 대신**(15.0 서랍, 15.1 문 열기·길 비우기 = 아무도 부르지 않음, 15.2 시트, 16.0 담요·장갑으로 제제 바꿈, 17.0 담요, 17.5 테이프) — 학습자가 그대로 하면 뇌탈출·대량 출혈·기도 위기에서 처치가 빠집니다.
2. **8.0 X1·8.5 X1 "동공 변화는 뇌압이 오르는 첫 신호/가장 먼저 반응"** — 틀림. 동공 변화는 늦은 신호이고 의식 변화가 먼저입니다(오답이라도 틀린 지식을 읽힘).
3. **20.1 X2 "편안하게 해 드릴 수 있는 시간이 아직 많아요"** — 이식 불가 환자 가족에게 잘못된 안심.
4. **order 15 역할 모순·범위:** 3줄 "give the hypertonic saline"(동료에게 지시) ↔ 4줄 "I'm pushing it now"(내가 투여). 처방·프로토콜 없이 간호사가 삼투요법을 지시하는 흐름(저작자 메모와 같은 지적).
5. **예방적 FFP로 INR 교정(7.0·7.3 문장, order 7, 7.3 why)** — AASLD ALF 지침·SCCM 2020 ALF·AGA 2021은 출혈이 없거나 저위험 시술(중심 정맥관) 전 일상적 FFP 교정을 권하지 않습니다(INR은 간부전 출혈 위험을 반영하지 않고, 수액 과부하, 예후 지표 INR을 가림). 문장은 A 몫 — why·order는 B에서 고칩니다.
6. **order 4 "after both fixes"** — 포도당과 칼륨 보충을 혈당을 올리는 "두 조치"로 묶음(칼륨은 혈당과 무관).
7. 참고(A 몫, v44 문장): 4.3 병동에서 수액백에 KCl을 직접 넣는 말(ISMP·TJC는 농축 KCl을 병동에서 뺌 — 프리믹스), 11.4 알레르기 반응을 "labs"로 본다(임상 관찰), 17.5 윤상연골 압박은 일상 권고가 아님(DAS 2018 ICU), 16.0 대량 출혈에서 적혈구 없이 혈장·혈소판·동결침전제제만, 13.1 암모니아로 단백 조정, 15.0·15.4 간호사의 지시·CT 요청.

## 고칠 것

### A. distractorsKo — 49문장 (안전 42 · 정답 둘 2 · 사실 오류 2 · ③ 1 · 길이 2)
(굵게 = 새 값. 한 칸만 바뀐 문장은 나머지를 그대로 둠. 이 값을 넣은 상태로 V20·"하나는 정답 길이 이하"·되풀이 상한을 다시 세어 모두 통과)

| id | 정답 ko | 지금 오답 | 새 오답 | 이유 |
|---|---|---|---|---|
| 0.2 | 더 졸려하거나 초조해하면 저에게 알려 주세요. | 더 배고파하거나 초조해하면 저에게 알려 주세요. / 더 졸려하거나 목말라하면 저에게 알려 주세요. | **더 졸려하거나 초조해하면 의사께 말해 주세요.** / **더 졸려하거나 초조해하면 간호사실에 알려 주세요.** | 안전(실패 1) — 알릴 증상(졸림·초조) 하나를 배고픔·목마름으로 바꿔 지켜볼 것을 놓침 → 알릴 사람만 바꿈 |
| 1.1 | 암모니아 수치는 저희가 지켜보는 혼란과 관련이 있어요. | 암모니아 수치는 저희가 지켜보는 어지럼과 관련이 있어요. / 콜레스테롤 수치는 저희가 지켜보는 혼란과 관련이 있어요. | **암모니아 수치는 저희가 지켜보는 어지럼과 관련이 있어요.** / **철분 수치는 저희가 지켜보는 혼란과 관련이 있어요.** | 길이 — 두 오답 모두 정답보다 김(둘 중 하나는 정답 길이 이하) |
| 1.2 | 좋아지고 있는지 보려고 반복해서 검사해요. | 퇴원해도 되는지 보려고 반복해서 검사해요. / 좋아지고 있는지 보려고 반복해서 팔을 소독해요. | **퇴원해도 되는지 보려고 반복해서 검사해요.** / **간이식이 필요한지 보려고 반복해서 검사해요.** | ③ — "팔을 소독"은 en에 없는 말 → 들리는 자리(improving)를 참인 다른 목적으로 |
| 1.3 | 응고 수치는 피가 얼마나 잘 굳는지 알려 줘요. | 응고 수치는 피가 얼마나 빨리 굳는지 알려 줘요. / 소변 수치는 피가 얼마나 잘 굳는지 알려 줘요. | **응고 수치는 피가 얼마나 잘 도는지 알려 줘요.** / **소변 수치는 피가 얼마나 잘 굳는지 알려 줘요.** | 정답 둘 — PT/INR은 "얼마나 빨리 굳는지"를 재므로 X1 "빨리 굳는지"도 참 |
| 3.2 | 새로운 출혈이 있으면 바로 저에게 알려 주세요. | 새로운 통증이 있으면 바로 저에게 알려 주세요. / 새로운 가려움이 있으면 바로 저에게 알려 주세요. | **새로운 출혈이 있으면 바로 담당 의사에게 알려 주세요.** / **새로운 출혈이 있으면 바로 거즈로 눌러 주세요.** | 안전(실패 1) — 알릴 대상(출혈)을 통증·가려움으로 바꿈 → 알릴 사람·바로 앞 단계(누르기)로 |
| 3.4 | 잇몸에서 피가 나지 않게 부드러운 칫솔을 써 주세요. | 입술에서 피가 나지 않게 부드러운 연고를 써 주세요. / 코에서 피가 나지 않게 부드러운 휴지를 써 주세요. | **잇몸에서 피가 나지 않게 치실은 잠시 쉬어 주세요.** / **피부에서 피가 나지 않게 전기면도기를 써 주세요.** | 안전 — 지시의 핵심 물건(부드러운 칫솔)을 연고·휴지로 바꿈 → 참인 다른 출혈 예방(치실 쉬기·전기면도기) |
| 3.5 | 주사 부위에서 더 배어 나오는 게 있는지 확인할게요. | 주사 부위에서 더 배어 나오는 게 있는지 알려 드릴게요. / 주사 부위에서 더 배어 나오는 게 있는지 사진 찍을게요. | **주사 부위에서 더 배어 나오면 바로 눌러 지혈할게요.** / **주사 부위에서 배어 나온 거즈는 새것으로 갈게요.** | 안전(실패 3) — 확인을 "알려 드릴게요"·"사진"으로 바꿈 → 확인 바로 뒤 단계(지혈·거즈 교체) |
| 4.0 | 혈당을 재확인하고 낮으면 포도당을 줍시다. | 혈당을 재확인하고 나면 손 소독제를 씁시다. / 혈당을 재확인하고 남은 포도당은 냉장고에 넣읍시다. | **혈당을 재확인하고 다 쓴 검사지는 버립시다.** / **포도당을 준 뒤 15분에 혈당을 다시 잽시다.** | 안전 — X1 손 소독제(일반 잡무)·X2 남은 포도당 냉장(사실도 틀림)이 포도당 투여 자리를 차지 → 그 처치의 앞·뒤 단계 |
| 4.3 | 칼륨도 낮아서 다음 수액백에 추가할게요. | 칼륨도 낮아서 다음 수액백에 라벨을 붙일게요. / 칼륨도 낮아서 다음 수액백은 선반에 올릴게요. | **칼륨도 낮아서 다음 수액백에 라벨을 붙일게요.** / **칼륨도 낮아서 펌프 속도를 맞출게요.** | 안전 — X2 수액백을 선반에(보관) → 칼륨 주입의 단계(속도). X1 라벨은 첨가 뒤 단계라 통과 |
| 4.5 | 혈당이 오르지 않으면 의사에게 알릴게요. | 혈당이 오르지 않으면 의사에게 소변량을 알릴게요. / 혈당이 오르지 않으면 의사에게 체중을 알릴게요. | **혈당이 오르지 않으면 영양사에게 알릴게요.** / **혈당이 오르지 않으면 약사에게 알릴게요.** | 안전·③ — 보고 내용을 소변량·체중으로 바꿔 저혈당 보고가 빠짐, en에 들리지 않음 → 알릴 사람만 |
| 5.1 | 배양 검사를 하고 진단적 천자를 고려합시다. | 배양 검사를 하고 장갑을 벗고 손을 씻읍시다. / 배양 검사를 하고 검체 라벨을 확인합시다. | **배양 검사를 하고 천자 동의서를 받아 둡시다.** / **배양 검사를 하고 검체 라벨을 확인합시다.** | 안전 — X1 장갑 벗고 손 씻기(일반 잡무)가 천자 고려를 대신 → 천자의 앞 단계(동의서). X2 검체 라벨은 배양 뒤 단계라 통과 |
| 5.2 | 의사에게 알리고 검사 절차를 시작할게요. | 의사에게 알리고 병실 위치를 확인할게요. / 의사에게 알리고 보호자 연락처를 확인할게요. | **약사에게 알리고 검사 절차를 시작할게요.** / **감염관리실에 알리고 검사 절차를 시작할게요.** | 안전 — 병실 위치·보호자 연락처가 검사 시작을 대신 → 알릴 사람만 바꿈 |
| 7.0 | 시술 직전에 제제로 교정합시다. | 시술 직전에 마스크를 착용합시다. / 시술 직전에 부위를 소독합시다. | **시술 직전에 수혈 동의서를 받읍시다.** / **시술 직전에 제제를 데워 둡시다.** | 안전 — 마스크·소독(시술의 단계, 교정의 단계 아님)이 제제 교정을 대신 → 교정 자체의 단계(동의서·제제 데우기) |
| 7.1 | 혈액을 준비해 두고 압박을 조심스럽게 유지할게요. | 혈액을 준비해 두고 손 위생을 조심스럽게 할게요. / 혈액을 준비해 두고 장갑을 조심스럽게 갈아 낄게요. | **혈액을 준비해 두고 압박 부위를 손끝으로 찾을게요.** / **혈액은행에 연락해 두고 압박을 조심스럽게 유지할게요.** | 안전 — 손 위생·장갑 교체가 압박 유지를 대신 → 압박·혈액 준비의 단계 |
| 7.3 | INR이 높아서 라인을 넣기 전에 혈장을 줄게요. | INR이 높아서 라인을 넣기 전에 가운을 입을게요. / INR이 높아서 라인을 넣기 전에 키트를 펼게요. | **INR이 높아서 먼저 혈장을 녹일게요.** / **INR이 높아서 혈장 번호를 둘이 맞춰 볼게요.** | 안전 — 가운·키트(라인 시술 단계)가 혈장 투여를 대신 → 혈장 투여의 단계(녹이기·번호 이중 확인) |
| 7.4 | 라인을 넣은 뒤 부위에 단단히 압박을 유지할게요. | 라인을 넣은 뒤 부위에 날짜 스티커를 붙일게요. / 라인을 넣은 뒤 시술 카트를 벽 쪽으로 밀게요. | **라인을 넣은 뒤 부위에 지혈 거즈를 댈게요.** / **라인을 넣은 뒤 압박을 풀고 부위를 살필게요.** | 안전 — 날짜 스티커·카트 밀기가 압박을 대신 → 압박의 단계(지혈 거즈·압박 푼 뒤 관찰) |
| 7.5 | 혈소판도 낮아서 시술 전에 수혈할게요. | 혈소판도 낮아서 시술 전에 동의서 받을게요. / 혈소판도 낮아서 시술 전에 손 씻을게요. | **혈소판도 낮아서 시술 전에 동의서 받을게요.** / **혈소판도 낮아서 수혈 뒤 수치를 볼게요.** | 안전 — X2 손 씻기가 수혈을 대신 → 수혈 뒤 단계. X1 동의서는 수혈 앞 단계라 통과 |
| 8.0 | 신경학적 검진과 동공을 자세히 지켜봅시다. | 동공 변화는 뇌압이 오르는 첫 신호예요. / 신경학적 검진은 의식과 반사를 함께 봐요. | **동공은 펜라이트로 양쪽을 비교해 봐요.** / **신경학적 검진은 의식과 반사를 함께 봐요.** | 사실 오류 — X1 "동공 변화는 뇌압이 오르는 첫 신호"는 틀림(동공은 늦은 신호, 의식 변화가 먼저) → 참인 진술로 |
| 8.1 | 머리를 높이고 압력이 치솟는 걸 피하세요. | 머리를 높이고 시트를 매끈하게 펴세요. / 머리를 높이고 베개 커버를 교체하세요. | **머리를 높이고 목이 꺾이지 않게 하세요.** / **머리를 높이고 침대 각도 표시를 맞추세요.** | 안전 — 시트·베개 커버가 "압력 급상승 피하기"를 대신 → 참인 다른 뇌압 조치·거상 단계 |
| 8.2 | 정신 상태가 악화되면 팀에 알릴게요. | 정신 상태가 악화되면 팀에 체온을 알릴게요. / 정신 상태가 악화되면 팀에 맥박을 알릴게요. | **정신 상태가 악화되면 가족에게 알릴게요.** / **정신 상태가 악화되면 약국에 알려요.** | 안전·③ — 보고 내용을 체온·맥박으로 바꿈(정신 상태 보고 빠짐), 들리지 않음 → 알릴 사람만 |
| 8.4 | 머리를 30도로 유지하고 목이 조이는 라인을 피할게요. | 머리를 30도로 유지하고 침상 옆 조명을 낮출게요. / 머리를 30도로 유지하고 발치 담요를 정리할게요. | **머리를 30도로 유지하고 각도 표시를 침대에 붙일게요.** / **머리를 30도로 유지하고 무릎 밑 베개를 뺄게요.** | 안전 — 조명·담요가 "목 조이는 라인 피하기"를 대신 → 30도 유지의 단계 |
| 8.5 | 더 큰 문제가 되기 전에 지금 에스컬레이션할게요. | 뇌압이 오르면 동공이 가장 먼저 반응하기 시작해요. / 뇌압이 더 오르면 의식이 빠르게 떨어져요. | **더 큰 문제가 되기 전에 지금 가족에게 연락할게요.** / **뇌압이 더 오르면 의식이 빠르게 떨어져요.** | 사실 오류·틀 — X1 "동공이 가장 먼저 반응"은 틀림 → 알릴 사람을 바꾼 같은 틀 |
| 9.2 | 배출량이 떨어지는 것에 대해 의사에게 알릴게요. | 배출량이 떨어지는 것에 대해 의사에게 혈압을 알릴게요. / 배출량이 떨어지는 것에 대해 의사에게 체중을 알릴게요. | **배출량이 떨어지는 것에 대해 보호자에게 알릴게요.** / **배출량이 떨어지는 것에 대해 약국에 알릴게요.** | 안전·③ — 보고 내용을 혈압·체중으로 바꿈(배출량 보고 빠짐), 한국어도 어색 → 알릴 사람만 |
| 9.5 | 알부민 시험적 투여를 하고 배출량이 반응하는지 봅시다. | 알부민 시험적 투여를 하고 남은 병은 폐기합시다. / 알부민 시험적 투여를 하고 라인 연결부를 닦읍시다. | **알부민 시험적 투여를 하고 남은 병은 폐기합시다.** / **알부민 병을 둘이 확인하고 배출량이 반응하는지 봅시다.** | 안전 — X2 연결부 닦기(일반 잡무)가 반응 관찰을 대신 → 투여 앞 단계 + 관찰 유지. X1 빈 병 폐기는 투여 뒤 단계라 통과 |
| 11.0 | 네, 프로토콜에 따라 NAC 주입을 시작합시다. | 네, 프로토콜에 따라 NAC 주입 후 활력징후를 잽시다. / 네, 프로토콜에 따라 NAC 주입 후 가운을 벗읍시다. | **네, 프로토콜에 따라 NAC 주입 후 활력징후를 잽시다.** / **네, 프로토콜에 따라 체중부터 잽시다.** | 안전·모양 — X2 가운 벗기(일반 잡무); 두 오답이 모두 "주입 후"라 모양으로 걸러짐 → 앞 단계(체중) |
| 12.0 | 철저한 손 위생과 라인 관리를 유지합시다. | 철저한 손 위생과 침실 청소를 유지합시다. / 철저한 장비 청소와 라인 관리를 유지합시다. | **철저한 손 위생은 라인을 만지기 전에 해요.** / **라인 관리에는 매일 드레싱 확인이 들어가요.** | 안전(실패 1) — 나열 항목(라인 관리·손 위생)을 하나씩 청소로 바꿈 → 참인 다른 세부(처치가 하나뿐인 예외) |
| 12.2 | 징후가 나타나면 항생제를 빠르게 시작할게요. | 징후가 나타나면 활력징후 기기를 빠르게 가져올게요. / 징후가 나타나면 소독 솜을 빠르게 챙길게요. | **징후가 나타나면 항생제 알레르기를 빠르게 확인할게요.** / **징후가 나타나면 배양을 빠르게 뽑을게요.** | 안전 — 기기 가져오기·소독 솜 챙기기(준비)가 항생제 시작을 대신 → 항생제의 앞 단계(알레르기·배양) |
| 12.4 | 드레싱을 교체하고 부위에 발적이 있는지 확인합시다. | 드레싱을 교체하고 부위에 날짜를 적읍시다. / 드레싱을 교체하고 쓰레기통 뚜껑을 닫읍시다. | **드레싱을 교체하고 부위에 날짜를 적읍시다.** / **드레싱을 교체하고 떼어 낸 거즈는 버립시다.** | 안전 — X2 쓰레기통 뚜껑(일반 잡무) → 교체 뒤 단계. X1 날짜 적기는 교체 뒤 단계라 통과 |
| 12.5 | 열이 오르면 치료 시작을 기다리지 않을 거예요. | 열이 오르면 치료 시작을 가족에게 알릴 거예요. / 열이 오르면 시원한 물을 가져다 드릴 거예요. | **열이 오르면 치료 시작 전에 배양부터 할 거예요.** / **열이 오르면 바로 담당 의사를 부를 거예요.** | 안전 — 가족에게 알리기(설명)·시원한 물이 치료 시작을 대신 → 치료의 앞 단계(배양·의사 부르기) |
| 14.0 | 어떤 약이 용량 조정이 필요한지 검토합시다. | 어떤 약이 냉장 보관이 필요한지 검토합시다. / 어떤 약이 새 라벨이 필요한지 검토합시다. | **어떤 약이 용량 조정이 필요한지 출력합시다.** / **어떤 약이 용량 조정이 필요한지 간 수치를 봅시다.** | 안전(실패 1) — 검토 대상(용량 조정)을 냉장 보관·라벨로 바꿈 → 검토의 단계 |
| 14.1 | 간에 부담이 되는 약물은 피해야 해요. | 간에 부담이 되는 약물은 앞칸에 둬야 해요. / 간에 부담이 되는 약물은 보관해야 해요. | **간에 부담이 되는 약물은 약사가 봐요.** / **간에 부담이 되는 약물은 대체품을 찾아요.** | 안전 — "피해야"를 앞칸에 두기·보관으로 바꿈(약을 곁에 둠) → 참인 다른 세부 |
| 14.2 | 혼란을 악화시킬 수 있는 진정제는 표시해 둘게요. | 혼란을 악화시킬 수 있는 진정제는 서랍에 보관할게요. / 혼란을 악화시킬 수 있는 진정제는 카트 위에 올릴게요. | **혼란을 악화시킬 수 있는 진정제는 처방을 볼게요.** / **혼란을 악화시킬 수 있는 진정제는 대체 약을 찾을게요.** | 안전 — 표시를 서랍·카트 위 보관으로 바꿈 → 표시와 이어지는 단계 |
| 14.5 | 청소하기 어려운 약은 간격을 두고 줄게요. | 청소하기 어려운 약은 간격을 두고 보관할게요. / 청소하기 어려운 약은 따로 상자에 담을게요. | **청소하기 어려운 약은 농도를 재고 줄게요.** / **청소하기 어려운 약은 준 다음 졸림을 더 살필게요.** | 안전 — 간격 투여를 보관·상자 담기로 바꿈 → 투여의 앞·뒤 단계 |
| 15.0 | 고장성 식염수를 주고 머리를 높이세요. | 고장성 식염수를 주고 조명을 어둡게 하세요. / 고장성 식염수를 주고 머리맡 서랍을 닫으세요. | **고장성 식염수를 주고 나트륨을 재세요.** / **고장성 식염수를 주고 정맥관 위치를 보세요.** | 안전(위기) — 조명·서랍이 머리 거상을 대신 → 식염수 투여의 단계 |
| 15.1 | 신경팀과 의사에게 즉시 연락하고 있어요. | 신경팀과 의사를 맞을 문을 즉시 열어요. / 신경팀과 의사 올 길을 즉시 비우고 있어요. | **신경팀과 약국에 즉시 연락하고 있어요.** / **영상의학과와 의사에게 즉시 연락하고 있어요.** | 안전(위기) — 문 열기·길 비우기가 호출 자체를 대신(아무도 부르지 않음) → 부를 사람만 바꿈 |
| 15.2 | CO2를 조절하고 그를 가만히 있게 합시다. | CO2를 조절하고 그의 시트를 정리합시다. / CO2를 조절하고 침상 옆 불빛을 낮춥시다. | **CO2를 조절하고 호흡기 설정을 봅시다.** / **CO2를 조절하고 동맥혈 가스를 다시 봅시다.** | 안전(위기) — 시트 정리·불빛이 "가만히 있게"를 대신 → CO2 조절의 단계 |
| 15.4 | 지금 식염수를 투여하고 있고, 머리 CT를 다시 찍어야 해요. | 지금 식염수를 투여하고 있고, 머리 CT 결과를 다시 봐야 해요. / 지금 식염수를 투여하고 있고, 머리 CT 영상을 보호자께 보여 드려야 해요. | **지금 식염수를 투여하고 있고, 머리 CT로 갈 이송을 불러야 해요.** / **지금 식염수를 투여하고 있고, 나트륨을 다시 재야 해요.** | 안전 — X1 새 CT를 옛 CT 결과 보기로(실패 3), X2 보호자에게 영상 보여 주기 → CT·식염수의 단계 |
| 16.0 | 혈장, 혈소판, 동결침전제제를 지금 가져오세요. | 혈장, 혈소판, 보온 담요를 지금 가져오세요. / 혈장, 새 장갑, 동결침전제제를 지금 가져오세요. | **혈장, 혈소판, 동결침전제제 들어갈 라인을 확보하세요.** / **혈장, 혈소판, 동결침전제제는 둘이 맞춰 보세요.** | 안전(위기, 실패 1) — 나열 제제(동결침전제제·혈소판)를 담요·장갑으로 바꿈 → 제제 투여의 단계 |
| 17.0 | 삽관 트레이와 흡인 준비를 가져올게요. | 삽관 트레이와 흡인 점검표를 가져올게요. / 삽관 트레이와 보온 담요를 가져올게요. | **트레이를 가져오며 도움을 부를게요.** / **삽관 트레이와 흡인이 되면 의사에게 알릴게요.** | 안전(위기) — 점검표·담요가 흡인 준비를 대신 → 도움 요청·뒤 단계 |
| 17.4 | 혹시 몰라서 어려운 기도 카트를 침상 옆에 둡시다. | 혹시 몰라서 어려운 기도 카트 점검표를 침상 옆에 붙입시다. / 혹시 몰라서 어려운 기도 카트 바퀴를 잠급시다. | **혹시 몰라서 어려운 기도 카트를 열어 내용물을 봅시다.** / **혹시 몰라서 어려운 기도 카트 바퀴를 잠급시다.** | 안전 — X1 점검표 붙이기(기록)가 카트 두기를 대신 → 카트가 있다는 전제의 뒤 단계. X2 바퀴 잠금은 통과 |
| 17.5 | 당신이 튜브를 넣는 동안 윤상연골 압박을 유지할게요. | 당신이 튜브를 넣는 동안 고정 테이프를 자를게요. / 당신이 튜브를 넣는 동안 흡인 카테터를 잡고 있을게요. | **당신이 튜브를 넣기 전에 윤상연골 위치를 찾아 둘게요.** / **당신이 튜브를 넣은 뒤 윤상연골 압박을 풀게요.** | 안전 — 테이프 자르기·흡인 카테터가 윤상연골 압박을 대신 → 압박의 앞·뒤 단계 |
| 18.0 | 혈압과 산소화에 우선순위를 둡시다. | 혈압과 산소화 장비를 곁에 놓읍시다. / 혈압과 산소화 일정에 우선순위를 둡시다. | **혈압과 산소화 목표를 정합시다.** / **혈압과 산소화를 보려고 동맥관을 봅시다.** | 안전·③ — 장비 놓기(준비)·"일정"(엉뚱) → 우선순위의 단계 |
| 18.4 | 상황이 급격히 악화돼서 일손을 더 부르고 있어요. | 상황이 급격히 악화돼서 장비를 더 부르고 있어요. / 상황이 천천히 악화돼서 일손을 더 부르고 있어요. | **상황이 급격히 악화돼서 보호자를 더 부르고 있어요.** / **상황이 천천히 악화돼서 일손을 더 부르고 있어요.** | 안전 — "장비를 부르고"(사람 대신 장비, 한국어도 어색) → 부를 사람만 |
| 19.0 | 즉각적인 이송을 위해 그를 안정시킵시다. | 즉각적인 이송을 위해 그의 서류를 챙깁시다. / 즉각적인 이송을 위해 그의 짐을 챙깁시다. | **즉각적인 이송을 위해 산소통을 채웁시다.** / **즉각적인 이송을 위해 수액을 이송 펌프로 옮깁시다.** | 안전 — 서류·짐 챙기기가 안정화를 대신 → 이송 안정화의 단계 |
| 19.1 | 이식센터에 전체 인계를 할게요. | 이식센터에 전체 일정을 요청할게요. / 이식센터에 전체 비용을 문의할게요. | **이송팀에 전체 인계를 할게요.** / **다음 근무조에 전체 인계를 할게요.** | 안전 — 일정 요청·비용 문의가 인계를 대신 → 인계 받는 곳만 |
| 19.2 | 이동을 위해 혈액과 응급 약을 가져오세요. | 이동을 위해 혈액과 응급 약 목록을 가져오세요. / 이동을 위해 혈액과 응급 약 서류를 가져오세요. | **이동을 위해 혈액과 응급 약은 침대 발치에 두세요.** / **이동을 위해 혈액은 상자에 담아 오세요.** | 안전 — 약 목록·서류가 응급 약을 대신 → 가져온다는 전제의 세부(놓는 곳·운반 상자) |
| 19.4 | 받아들이는 팀과 이송 시간을 확인할게요. | 받아들이는 팀은 그의 상태를 미리 알아야 해요. / 이송 시간은 거리와 교통 상황에 따라 달라져요. | **받아들이는 팀은 상태를 미리 알아야 해요.** / **이송 시간은 거리와 교통 상황에 따라 달라져요.** | 길이 — 두 오답 모두 정답보다 김 |
| 20.1 | 하지만 그를 편안하게 해 드릴 수 있는 게 아직 많아요. | 하지만 그를 깨어 있게 해 드릴 수 있는 게 아직 많아요. / 하지만 그를 편안하게 해 드릴 수 있는 시간이 아직 많아요. | **하지만 그를 깨어 있게 해 드릴 수 있는 게 아직 많아요.** / **하지만 그를 시원하게 해 드릴 수 있는 게 아직 많아요.** | 안전(잘못된 안심) — X2 "시간이 아직 많아요"는 이식 불가 환자 가족에게 거짓 안심 → 들리는 자리(comfortable)만 |
| 20.4 | 편안함에 집중하고 통증과 호흡을 조절할게요. | 완화 치료는 편안함과 증상 조절이 목표예요. / 호흡곤란은 약으로 꽤 많이 덜어 드려요. | **완화 치료는 가족의 마음을 돌보는 일도 포함해요.** / **호흡곤란은 약으로 꽤 많이 덜어 드려요.** | 정답 둘 — X1 "완화 치료는 편안함과 증상 조절이 목표예요"가 정답과 같은 뜻 → 다른 참인 진술 |

### B. 빈칸 — 30문장
정답 둘(11)
- 4.2 `salt`·`water` — 전해질 장면이라 "keep the salt stable"이 맞게 읽힘 → `sugar / oxygen / pulse / heat`
- 5.5 `thoracentesis` — 간성 흉수의 감염 확인으로 성립 → `paracentesis / biopsy / colonoscopy / transfusion`
- 6.0 `explain` — "infection or bleeding can explain the confusion"도 참 → `worsen / relieve / prevent / measure`
- 9.2 `daily` — "about the daily output"도 보고 내용으로 성립 → `falling / rising / normal / stable`
- 10.2 `pharmacist` — transplant pharmacist는 실제 직무(+ janitor/driver는 5.2와 돌려쓰기·동떨어짐) → `coordinator / donor / budget / schedule`
- 11.1 `labeling / expiry / storage` — 셋 다 실제 투약 전 확인 항목이라 정답 둘 → `dosing / diet / discharge / visitors`
- 12.2 `tests` — "start tests quickly"가 장면에 맞음 → `antibiotics / vitamins / antacids / eyedrops`
- 16.5 `allergy` — 수혈 중 알레르기 징후 관찰은 실제 일, `arthritis/dementia`는 동떨어짐 → `shock / fatigue / insomnia / constipation`
- 17.4 `spare` — "the spare airway cart at the bedside"가 성립 → `difficult / pediatric / dental / old`
- 18.2 `transfusion` — 다장기부전에서 필요할 수 있음 → `dialysis / surgery / rehab / imaging`
- 20.2 `think` — "Let's think about what would matter most to him"이 그대로 맞음 → `talk / write / argue / guess`
관사·수 일치로 걸러짐(5)
- 3.4 `nose`("your nose don't") → `gums / lips / cheeks / nostrils`
- 8.5 `older`("a older") + newer/older 동떨어짐 → `bigger / smaller / simpler / milder`
- 10.3 `visit / bill / rest`("an visit") → `organ / invoice / upgrade / award`
- 11.5 `kidneys / lungs`("kidneys does") → `liver / heart / brain / pancreas`
- 16.2 `hormone`(관사 없는 가산명사) → `fibrinogen / cholesterol / ferritin / lipase`
동떨어짐·묶음 돌려쓰기(14)
- 0.1 `hungry / thirsty / chilly`가 0.2와 같은 묶음 → `oriented / feverish / bloated / nauseous`
- 0.2 같은 묶음 → `agitated / calm / rested / cheerful`
- 5.2 `clerk / janitor / driver` → `physician / pharmacist / registrar / chaplain`
- 7.0 `lunch` → `procedure / scan / bath / rounds`
- 7.3 `water / ice` → `plasma / saline / albumin / dextrose`
- 8.2 `thank / join / praise`는 동떨어짐, 동사 동의어(page/call/notify)가 많아 빈칸을 **`worsens`로 옮김** → `worsens / improves / stabilizes / normalizes`
- 10.1 `color` → `urgency / cost / diet / room`
- 12.5 `lunch / class` → `treatment / rounds / dialysis / rehab`
- 14.5 `chairs / towels / notes` → `doses / meals / visits / tests`
- 15.3 `experiment / opportunity` → `emergency / exception / error / estimate`
- 16.0 `towels / gowns` → `cryo / saline / albumin / dextrose`
- 17.2 `Music` → `Suction / Heater / Fan / Light`
- 17.3 `rename` → `protect / measure / replace / relax`
- 19.4 `color`(10.1과 돌려쓰기) → `time / cost / noise / weight`

### C. decoy — 118문장
원칙: 같은 자리에 올 수 있는 구(청크 하나를 대신해 문법이 맞음)이되, 조립하면 장면에 틀리고 해가 없으며 **ko와 같은 문장도, 그럴듯한 다른 처치 문장도 되지 않게**.
(새 값은 V18 모양 확인 통과. 조립문 = 새 decoy를 그 청크 자리에 넣은 문장)

| id | 지금 | 문제 | 새 decoy | 조립문 |
|---|---|---|---|---|
| 0.1 | `to the family` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `how hungry` | I'll check how hungry and oriented he is now. |
| 0.2 | `so that he` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `more hungry` | Please tell me if he becomes more hungry or agitated. |
| 0.3 | `than before` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `against his lab results` | I'm grading his mental status against his lab results. |
| 0.5 | `that you saw` | **ko와 같은 문장이 됨** | `when you forget` | It's very helpful when you forget he didn't recognize you. |
| 1.1 | `that we check` | **ko와 같은 문장이 됨** | `the fever` | The ammonia level relates to the fever we watch for. |
| 1.2 | `to see why` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `if you're sleeping` | We repeat them to see if you're sleeping. |
| 1.3 | `that your` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `your blood can flow` | Your clotting numbers tell us how well your blood can flow. |
| 1.4 | `even if the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `because the kidney cells` | Your liver enzymes are high because the kidney cells are stressed. |
| 1.5 | `as for` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `these meals` | We check these meals every morning to track any change. |
| 2.1 | `no more than` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `hard stools` | We aim for a few hard stools a day. |
| 2.2 | `one piece of` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `of clearing the bleeding` | It's an important part of clearing the bleeding. |
| 2.3 | `that is pulling` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `by pulling sugar` | The lactulose works by pulling sugar out through your gut. |
| 2.5 | `even though` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `get too cold` | If the stools get too cold, we can adjust the dose. |
| 3.0 | `that it has` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `Your kidney makes` | Your kidney makes clotting factors, and it's struggling now. |
| 3.1 | `to look at` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `for any freckles` | We watch closely for any freckles or bleeding. |
| 3.3 | `to notice` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `more wrinkles` | You may notice more wrinkles on your arms and legs. |
| 3.4 | `an electric` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `an electric razor` | Please use an electric razor so your gums don't bleed. |
| 3.5 | `for any` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `your shoes` | We'll check your shoes for extra oozing. |
| 4.0 | `after it was` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `Let's warm` | Let's warm the glucose and give dextrose if it's low. |
| 4.1 | `every so` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `her visitors` | I'll monitor her visitors closely. |
| 4.2 | `for her` | **ko와 같은 문장이 됨** | `in the fridge` | Her liver can't keep the sugar stable in the fridge. |
| 4.3 | `yet again` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `to the blue` | Potassium is low too, so I'll add it to the blue bag. |
| 4.4 | `to watch` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `her breathing` | Let's watch her breathing for potassium swings. |
| 4.5 | `once the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `for the chaplain` | I'll flag this for the chaplain if the sugar doesn't come up. |
| 5.0 | `that could` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `can cause` | Fever and belly tenderness can cause SBP. |
| 5.1 | `if we are` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `a dental tap` | Let's get cultures and consider a dental tap. |
| 5.2 | `then keep` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the cafeteria` | I'll notify the cafeteria and start the workup. |
| 5.3 | `to be` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `to 98.6` | His temperature spiked to 98.6 an hour ago. |
| 5.4 | `at one` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `times three` | I'll draw blood cultures times three from different sites. |
| 5.5 | `if we` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `a dental X-ray` | We may need a dental X-ray to check the fluid for infection. |
| 6.0 | `such as the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `or allergies` | Things like infection or allergies can worsen the confusion. |
| 6.1 | `for the cause` | **ko와 같은 문장이 됨** | `for the doctor` | We're looking for the doctor and treating it. |
| 6.2 | `to help` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and other tests` | The lactulose and other tests should help him clear. |
| 6.3 | `on the way` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `of bleeding` | This kind of bleeding comes in stages, and it can improve. |
| 6.4 | `might be` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `, or a cold drink` | Infection, bleeding, or a cold drink can all trigger this. |
| 6.5 | `as soon` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `, his skin usually clears` | Once we treat the trigger, his skin usually clears again. |
| 7.0 | `so that we` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `with fluids` | Let's correct with fluids just before the procedure. |
| 7.1 | `ready for` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and hold the tray` | I'll have blood available and hold the tray carefully. |
| 7.2 | `to watch` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the menu` | We'll recheck the menu and watch for bleeding. |
| 7.3 | `after we` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `ice` | His INR is high, so we'll give ice before the line. |
| 7.4 | `in the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `at the wrist` | We'll hold firm pressure at the wrist after the line goes in. |
| 7.5 | `even if` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `Sodium is` | Sodium is also low, so we'll transfuse before the procedure. |
| 8.0 | `to watch` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his hairline` | Let's watch his hairline and pupils closely. |
| 8.1 | `be sure` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `in noise` | Keep his head elevated and avoid spikes in noise. |
| 8.2 | `so that` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the chaplain` | I'll alert the chaplain if his mental status worsens. |
| 8.3 | `than the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `compared to his ear` | His right pupil looks a little sluggish compared to his ear. |
| 8.4 | `at the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and avoid tight wrist lines` | We'll keep his head at thirty degrees and avoid tight wrist lines. |
| 8.5 | `as soon` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `a family matter` | I'm escalating now before this becomes a family matter. |
| 9.0 | `to track` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his hair growth` | Let's track his hair growth and creatinine trend. |
| 9.1 | `might have` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and new glasses` | We may need albumin and new glasses. |
| 9.2 | `of the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the cashier` | I'll notify the cashier about the falling output. |
| 9.3 | `even with` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `His lungs` | His lungs are shutting down despite the fluids we've given. |
| 9.4 | `when other` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `if the labs` | This can be hepatorenal syndrome if the labs are ruled out. |
| 9.5 | `to give` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the walking challenge` | Let's give the walking challenge and see if his output responds. |
| 10.0 | `if he is` | **ko와 같은 문장이 됨** | `with the family` | The transplant team will evaluate whether he's with the family. |
| 10.1 | `to decide` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `helps lower` | His severity score helps lower the urgency. |
| 10.2 | `to meet` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `with the billing` | I'll help connect you with the billing coordinator. |
| 10.3 | `does not` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `he'll get a bill` | Being listed doesn't mean he'll get a bill right away. |
| 10.5 | `after the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `your calls` | We'll answer your calls as the process moves forward. |
| 11.0 | `at the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `per his wish` | Yes, let's start the NAC infusion per his wish. |
| 11.1 | `to the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the diet` | I'll confirm the diet and monitor for reactions. |
| 11.2 | `a good` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the kidneys` | Early treatment gives the kidneys the best chance. |
| 11.3 | `that this` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `His ammonia level` | His ammonia level confirms this was the cause. |
| 11.4 | `if any` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his diet` | I'll watch his diet closely for any allergic reaction. |
| 11.5 | `as soon` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his kidney does` | The sooner we start NAC, the better his kidney does. |
| 12.0 | `keep to` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and room care` | Let's keep up strict hand hygiene and room care. |
| 12.1 | `in the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his meals` | I'll watch his meals and labs for early sepsis. |
| 12.2 | `once the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `We'll start vitamins` | We'll start vitamins quickly if signs appear. |
| 12.3 | `likely to` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and nails` | His skin and nails are prone to infection right now. |
| 12.4 | `and then` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `Let's change his gown` | Let's change his gown and check the site for redness. |
| 12.5 | `so we` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `to start rounds` | If his fever climbs, we won't wait to start rounds. |
| 13.0 | `so that` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `your bones` | We usually keep protein up to protect your bones. |
| 13.1 | `by the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `your weight` | We adjust it carefully based on your weight. |
| 13.2 | `to make` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `A pharmacist` | A pharmacist will tailor a plan for you. |
| 13.3 | `far too` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `your bones` | Too little protein can weaken your bones even more. |
| 13.4 | `after the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `your sodium` | We'll check your sodium if the confusion gets worse after meals. |
| 13.5 | `as a` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `with your family` | The nutrition team will follow up with your family daily. |
| 14.0 | `to see` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `need cold storage` | Let's review which meds need cold storage. |
| 14.1 | `keep from` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `on the teeth` | We should avoid drugs that are hard on the teeth. |
| 14.2 | `to mark` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `any vitamins` | I'll flag any vitamins that could worsen confusion. |
| 14.3 | `as it` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `these foods` | His liver can't clear these foods the way it used to. |
| 14.4 | `to raise` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his shoes` | Let's lower the sedative dose and check his shoes. |
| 14.5 | `on top` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `meals` | We'll space out meals that are hard to clear. |
| 15.0 | `to his side` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and wash` | Give the hypertonic saline and wash his head. |
| 15.1 | `to the unit` | **ko와 같은 문장이 됨** | `for the family` | I'm calling neuro and the physician for the family. |
| 15.2 | `to keep` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his diet` | Let's control his diet and keep him still. |
| 15.3 | `that is` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `brighter` | His pupil just became brighter, and this is an emergency. |
| 15.4 | `to the CT` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `a hearing test` | I'm pushing the saline now, and I need a hearing test. |
| 15.5 | `as long` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his lights steady` | We'll keep his lights steady so he doesn't buck the vent. |
| 16.0 | `from the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `, and saline now` | Get plasma, platelets, and saline now. |
| 16.1 | `in equal` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and keep him calm` | Transfuse in balanced ratios and keep him calm. |
| 16.2 | `as often` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `with the menu` | Recheck fibrinogen and coags with the menu. |
| 16.3 | `for the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `from the nose` | He's bleeding from the nose, so we need products fast. |
| 16.4 | `once we` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `another culture` | Let's send another culture and cross while we transfuse. |
| 16.5 | `for any` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the coffee` | I'll warm the coffee and watch for signs of shock. |
| 17.0 | `with the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the dressing tray` | I'll get the dressing tray and suction ready. |
| 17.2 | `to be` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `Music is` | Music is on and I'm ready to assist. |
| 17.3 | `and it` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `His appetite` | His appetite just dropped, and he can't protect his airway. |
| 17.4 | `next to` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the pediatric airway cart` | Let's have the pediatric airway cart at the bedside just in case. |
| 17.5 | `when you` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `chest pressure` | I'll hold chest pressure while you pass the tube. |
| 18.0 | `first of` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `his diet` | Let's prioritize his diet and oxygenation now. |
| 18.1 | `to ask` | **ko와 같은 문장이 됨** | `to the family` | I'm escalating to the family for more support. |
| 18.2 | `might be` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and a new bed` | We may need dialysis and a new bed. |
| 18.3 | `one by` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `, and skin are` | His kidneys, lungs, and skin are all failing at once. |
| 18.4 | `as the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `for more chairs` | This is spiraling, so we're calling for more chairs. |
| 18.5 | `any of` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `every family` | We're supporting every family we can while we stabilize him. |
| 19.0 | `to make` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `for immediate discharge` | Let's stabilize him for immediate discharge. |
| 19.1 | `with the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `a full refund` | I'll give a full refund to the transplant center. |
| 19.2 | `to take` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `and his family` | Bring blood and his family for the trip. |
| 19.3 | `and then` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `as status 2A` | He's listed as status 2A, so the center wants him now. |
| 19.4 | `over the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the cleaning team` | I'll confirm the cleaning team and the transport time. |
| 19.5 | `for the` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `the pump closely` | We'll monitor the pump closely during the whole transfer. |
| 20.0 | `does not` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `a cheap option` | It means transplant isn't a cheap option for him. |
| 20.1 | `yet there` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `to keep him awake` | But there is still a lot we can do to keep him awake. |
| 20.2 | `to ask` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `most to us` | Let's talk about what would matter most to us. |
| 20.3 | `that is` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `good news` | This is good news, and I'm so sorry. |
| 20.4 | `to keep` | 어느 자리에도 안 맞음(모양으로 걸러짐) | `on his diet` | We'll focus on his diet and control his pain and breathing. |
| 20.5 | `as long` | **ko와 같은 문장이 됨** | `as little` | You can stay with him as little as you want. |

바꾸지 않아도 되는 decoy(자리에 맞고 ko와 다름): 0.0 `from the stomach`, 0.4 `by the window`, 1.0 `in the lab`, 2.0 `from the blood`, 2.4 `how long`, 3.2 `at the front`, 10.4 `as well`, 17.1 `to help`.

### D. order — 11장
필수
- **4** 3·4줄: "after both fixes"가 칼륨을 혈당 조치로 묶고, 칼륨 줄은 `too`로 어디든 붙음 →
  3 `Let's recheck it fifteen minutes after the dextrose.`(ko 포도당을 주고 15분 뒤 다시 재 봅시다 · note 재확인 · icon redo)
  4 `If it still won't come up after that, I'll flag this for the physician.`(ko 그래도 오르지 않으면 의사에게 알릴게요 · 보고 · pager)
  ko 머리말 `저혈당 대응 4문장 순서`, why `간이 혈당을 못 지킨다는 이유를 말하고, 낮으면 포도당을 준 뒤 15분에 다시 재며, 그래도 안 오르면 의사에게 알려요.`
- **5** 3↔4가 자연스럽고 임상 순서도 거꾸로(배양·천자는 처방이 필요 — 알림이 먼저) →
  3 `I'll notify the physician about that right now.`(ko 그걸 지금 바로 의사에게 알릴게요 · 보고 · pager)
  4 `Once they're aware, let's get cultures and consider a diagnostic tap.`(ko 의사가 알고 나면 배양 검사를 하고 진단적 천자를 고려합시다 · 검사 · lab)
  why `열이 오른 사실과 그 의미를 말한 뒤, 먼저 의사에게 알리고, 그다음 배양과 진단적 천자를 함께 정해요.`
- **14** 2↔3 교환이 자연스러움(3줄에 앞을 가리키는 말이 없음) → 3 `Starting with the sedative, let's lower that dose and check his response.`(ko 진정제부터 용량을 낮추고 반응을 확인합시다)
- **15** 역할 모순(3줄 "give" ↔ 4줄 "I'm pushing")·지시 범위 →
  3 `While I'm on the phone, elevate his head and get the hypertonic saline per protocol.`(ko 제가 통화하는 동안 머리를 높이고 프로토콜대로 고장성 식염수를 가져와 주세요 · 지시 · siren)
  4 `Once you have it, I'll push it and ask for a repeat head CT.`(ko 가져오면 제가 투여하고 머리 CT를 다시 요청할게요 · 투여 · pill)
  why `동공 변화를 알리고 바로 호출한 뒤, 통화하는 동안 머리를 높이고 프로토콜대로 식염수를 가져오게 하고, 받으면 투여하며 CT를 요청해요.`
- **16** 1↔2 교환이 자연스러움(지시 → 이유도 됨) → 2 `So get plasma, platelets, and cryo now.`(ko 그러니 혈장, 혈소판, 동결침전제제를 지금 가져오세요)
- **20** 1↔2 교환이 자연스러움(뜻 설명 → 공감도 흔한 순서) → 2 `That news means transplant isn't a safe option for him.`(ko 그 소식은 이식이 그에게 안전한 선택지가 아니라는 뜻이에요)
권고(약한 교환)
- **1** 1↔2(두 줄 모두 첫 줄이 됨) → 2 `One of them, the ammonia level, relates to the confusion we watch for.`(ko 그중 암모니아 수치는 저희가 지켜보는 혼란과 관련이 있어요)
- **8** 3↔4(`Alongside that`·`Through all of it` 둘 다 어디든 붙음) → 3 `While we wait for them, keep his head elevated and avoid spikes in pressure.`(ko 그들을 기다리는 동안 머리를 높이고 압력이 치솟는 걸 피하세요)
- **9** 2↔3 → 3 `I'll notify the physician about that possibility now.`(ko 그 가능성을 지금 의사에게 알릴게요)
- **19** 3↔4 → 3 `While we do that, bring blood and emergency meds for the trip.`(ko 그동안 이동에 쓸 혈액과 응급 약을 가져오세요)
- **17** 2줄 ko "삽관 트레이와 흡인 준비를 가져올게요"가 어색 → `삽관 트레이를 가져오고 흡인을 준비할게요`. (4줄 윤상연골 압박은 위 사실 7 — A와 함께 정할 일)
- **7** why `INR을 교정하고 혈소판까지 채운 뒤…`는 예방적 FFP를 정당화(심각 5) — A가 7.0·7.3 문장을 바꾸면 order 1줄·why를 그에 맞춰 다시 씁니다.

### E. why — 6문장
- 7.1 "'carefully'는 압박을 조심스럽게도 단단히 유지한다는 뜻" — 엉킨 문장 → `'carefully'는 서두르지 않고 빈틈없이 누른다는 뜻이에요. 응고가 약하면 부위가 오래 새서 압박을 끝까지 유지해요.`
- 7.3 "왜 혈장을 주는지 팀이 한 번에" — 예방적 FFP 정당화(심각 5). A가 문장을 고치면 그에 맞춰, 안 고치면 최소 `'so'로 이유와 행동을 이어요. 혈장은 출혈이 있거나 고위험 시술일 때 처방에 따라 줘요.`
- 8.0 "동공은 뇌압 변화를 가장 먼저 보여 줘요" → `… 신경학적 검진의 의식 변화가 먼저 오고, 동공 변화는 더 늦은 신호라 둘을 함께 봐요.`
- 13.1 "조정의 근거가 수치" — 단백 섭취를 암모니아로 맞춘다는 주장이 지침과 어긋날 수 있음(A의 문장과 함께 확인) — 권고.
- 10.0 둘째 문장 "이식팀이 대상 여부를 판단해요" = ko 되풀이 → `'whether'는 결과를 미리 말하지 않아서 가족이 섣부르게 기대하거나 실망하지 않게 해요.`
- 13.2 둘째 문장 "영양사가 환자마다 계획을 따로 짜요" = ko 되풀이 → `영양사가 간 상태와 근육량을 함께 보고 정한다는 점을 한 단어로 전해요.`

### F. tag·icon — 4문장
- 8.1·8.4 `baby`(머리 거상) → `shield`  · 3.4 `lock`(칫솔 안내) → `shield`  · 1.1 `pill`(암모니아 수치 설명) → `lab`

## 종합
고칠 것 **218건**(distractorsKo 49 · 빈칸 30 · decoy 118 · order 11 · why 6 · icon 4). 그중 **안전 47**(distractorsKo 42 + 사실 오류 오답 2 + order 4·5·15),
**정답 둘 25**(distractorsKo 2 · 빈칸 11 · decoy 8 · order 4).
decoy가 거의 전부 모양으로 걸러지는 것과 위기 처치 오답이 잡무로 처치를 대신하는 것이 가장 큽니다. 위 목록을 반영하면 내보낼 수 있습니다 —
단 7.0·7.3의 예방적 FFP, 15.0·15.4의 지시 범위는 A 검토와 함께 문장부터 정해야 합니다.
