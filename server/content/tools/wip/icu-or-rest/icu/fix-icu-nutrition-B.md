# icu-nutrition — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-nutrition.yaml`(A·B 합친 파일), 21상황 · **150문장** · order 21장 전수. 번호는 0부터(상황.문장 / S상황.L줄) — 저작자 메모의 `18.2`는 여기서 **17.2**입니다.
스크립트(작업 폴더): `revB_icu-nutrition_dump.py`(인자 ko·blank·decoy·meta·order → `revB_icu-nutrition_<인자>.txt` — `en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy를 청크 자리마다 넣은 조립, order 인접 교환 63건),
`revB_icu-nutrition_rep.py`(오답 전용 어간 빈도·표지), `revB_icu-nutrition_vals.py`(아래 새 값 전부 — 수정 담당이 그대로 읽어 넣으면 됨; `revB_icu_nutrition_vals.py`는 import용 같은 파일),
`revB_icu-nutrition_chk.py`(인자 `old`=지금 파일, `new`=새 값을 넣은 사본 — V20(검사기 `length_tell`), "오답 하나는 정답 길이 이하", 표지, W18~W21(`check_theme_repetition`), 빈칸 answer 낱말 경계·선택지 4개, decoy가 en·청크와 겹치지 않는지, 아이콘·order 15단어), `revB_icu-nutrition_mkmd.py`(아래 A~F 표 생성).
**새 값을 넣은 사본은 위 검사를 모두 통과**합니다(`DECOY 19.5 before we rest`는 부분 문자열 오탐 — 검사기 V19는 통과).

## 판정 기준 (수정 담당도 이 기준으로)
- 오답이 정답 행동의 **앞·뒤 단계**(정답 행동이 종속절·조건에 남음), **참인 다른 이유·효과**, **함께 하는 옆 일**, 설명문의 해 없는 세부면 통과.
- 그 순간 정답 행동 **대신** 하는 일, 급식 속도·멈춤 기준·튜브 위치 확인·호출 대상·시점을 바꾼 것, 감시·확인·재확인·호출 기준 목록에서 **지표 하나만 옆 지표로 바꾼 것(실패 1)**은 실패.
- **보고문**(was high · has dropped · is twenty-two · worries me)은 지표를 바꿔도 통과 — 행동을 시키지 않음.
- 같은 상황의 다른 문장 정답(참인 처치)으로 바꾼 오답은 **정답 둘**.
- 감시 문장 새 값 틀: X1 = 감시 항목을 그대로 둔 뒤 단계(조건 `~면` 하나), X2 = 표지 없는 참인 이유 또는 그 상황의 함께 하는 일. 간격 문장은 간격을 **좁히기**(brain-death 5.4 선례). 기록·알림·질문으로 바꾸지 않음(실패 3).
- 저작자 판단 거리 중 "Call me → 의사를 불러 주세요"(1.6·5.6·14.6 X2): 부를 사람을 **처방하는 의사로 올린 것**은 호출이 약해지지 않아 통과로 봤습니다(약해지는 쪽 — 팀장·가족·방문객 — 은 실패). 사용자가 호출 대상 변경을 모두 실패로 본다면 이 셋은 참인 이유(예: "…면 흡인이 쉬워요")로 바꾸세요.

## 기계적으로 센 것
- **오답 둘에만 조건·목적 표지(~면·~려고·~전에·~도록·~위해·~뒤·~자마자·~면서·함께·따로·~때)가 붙은 문장: 0개**(지금). 새 값을 넣은 뒤에도 **0개**(서로 다른 표지가 둘에 하나씩 붙은 것도 0).
- 되풀이 상한: 지금 파일은 형식상 통과지만 `기록`·`구토`·`혈압`·`혈당`·`호흡`·`맥박`이 정확히 5회. 새 값 뒤 최댓값 5(`전에`·`신호`·`확인`·`줘요`·`출혈`·`급식`·`덜`·`알려`·`혈당`·`뒤`) — 수정 담당은 이 낱말을 더 넣지 마세요.
- 길이: V20 위반 0, "오답 둘 다 정답보다 김" **1문장(1.3)** — 새 값으로 해결.
- **decoy 모양(150개)**: 어느 청크 자리에도 안 맞음 **8개**(1.3 9.1 13.6 15.4 16.6 17.1 19.0 19.4 — 실패 7, 15.4는 시제로 걸러짐), 자리에 맞는 142개 중 조립하면 안전 문제 **10개**(2.4 2.5 6.4 7.2 7.5 14.5 16.0 16.2 17.0 17.5) · 반대말 **2개**(3.5 10.3) · ko 뜻과 같아지는 것 0. 나머지 130개는 다른 뜻의 문장이 되거나 말이 안 되어 통과.
- **되풀이 빈도표 상위 5(지금)** — 낱말만 보고 걸러지는 단서:

| 갈래 | 상위 5 |
|---|---|
| distractorsKo 전용 어간 | 기록 5 · 구토 5 · 혈압 5 · 혈당 5 · 호흡 5 (맥박 5) |
| 빈칸 오답 | rarely 3 · clean 3 · hair 3 · brand 3 · heart 3 (W18 경고 없음) |
| decoy 낱말 | **visitor(s) 10** · **sleep(-y/-ing) 9** · family 6 · bed 5 · lunch 5 (room 5) — W18은 같은 문자열만 세서 못 잡음 |

  새 값 뒤: decoy 낱말 최댓값 3, 빈칸 오답 최댓값 3, ko 전용 어간 최댓값 5.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 150개 대부분 사실 오류 없음·ko 되풀이 없음. 다만 상당수가 낱말 뜻풀이("…는 …라는 뜻이에요")라 말하는 방식의 이유가 약함. 사실: 8.4 "상태와 상관없이 교체"(젖거나 들뜨면 바로 갈아야 함 — CDC 2011), 5.4 `once`를 "시작 시점에 맞춰"로(재영양 저하는 시작 뒤 2~5일). 듣는 사람: 1.6 `보호자`·2.0 `환자와` — 두 상황 모두 동료 대화(F). |
| 2 빈칸 | **2** | **58문장 교체.** 동떨어짐(실패 6)이 대부분(insurance·receipt·sleeve·polish·whistle·rumor…), 소리만 닮음 4(1.1 d-, 12.0·19.5 re-, 16.0 -ation), 같은 묶음 돌려쓰기 2(10.3=14.4 smell/sound/texture, 7.3 시간 단위), 관사·문법 걸러짐 3(16.1 `an routine`, 18.4 `are either/neither`, 3.6 `burning down`), 정답 둘 12(0.1 0.3 0.5 0.7 0.9 1.5 2.0 2.2 3.5 6.4 19.5 20.0), 위험한 지시가 보임 1(17.0 `rinse the airway`). |
| 3 decoy | 3 | 자리 없음 8, 안전 10, 반대말 2, 되풀이 21(visitor·sleep·lunch·bed·family·room). 대부분은 같은 자리의 구로 잘 씀. |
| 4 distractorsKo | **2** | **73문장 교체 — 안전 54**(실패 1 감시·호출 지표 바꾸기 약 30, 처치·검사 바꾸기, 시점·속도, 당·열량 보충 같은 위험 처치), **정답 둘 18**, 길이 1. 오답끼리 같은 뜻 1(1.4). |
| 5 order | 3 | 인접 교환에도 읽히는 곳 8장(S2 3↔4, S6 2↔3, S7 3↔4, S9 3↔4, S15 3↔4, S16 3↔4, S18 2↔3, S19 3↔4 — `Alongside that`·`Because of that`·`all of it`·`Once that's done`이 어느 줄 뒤에도 붙음), 대명사 1(S1 L2 `his`), 임상 2(S15 L4 구획증후군에 수액 더, S18 인슐린 뒤 K·P — 아래). ko 머리말은 모두 카드와 맞음, 15단어 초과 없음. |
| 6 tag·icon | 4 | 태그 10자 이하·상황 안 일관. 떨어지는 값에 `chartup` 5문장+order 3줄(E), 3.4 `chevronUp`은 UI 글리프. |
| 8 파일럿 갈래 | 2 | 갈래 2(동떨어진 빈칸) 약 40, 갈래 3(order) 8장, 갈래 5(오답·decoy 뜻 겹침) 정답 둘 30, "오답으로 위험한 처치 보이기" 6(7.2 X1, 19.5 X1, 14.2·14.5 X1, 18.5 X1, 빈칸 17.0, decoy 19.0). 관사·문법 걸러짐 3. |

## 사실 오류·심각한 문제
1. **오답으로 위험한 처치를 보이기(⑥).** **7.2 X1 `혈당이 너무 떨어지기 전에 보충`·19.5 X1 `급식 전에 칼로리를 보충`·decoy 19.0 `the sugar`** — 재영양증후군(위험) 환자에게 당·열량을 더 넣는 말(ASPEN 2020: 위험군은 열량을 낮게 시작). **14.2·14.5 X1 `투약하지 않을/투약을 모두 보류`** — 장허혈 의심 환자의 약(항생제·승압제)을 전부 끊는 말. **18.5 X1 `고정 척도`** — 인슐린 용량 기준을 바꿈. **빈칸 17.0 `rinse the airway`** — 흡인 직후 기도를 헹구라는 지시.
2. **감시·확인·호출 문장의 지표 바꾸기(실패 1) 약 30문장** — 저작자가 판단을 부탁한 갈래. 1.1 1.6 4.0 4.1 4.6 5.5 5.6 6.0 6.2 6.6 7.1 7.5 8.1 9.0 9.2 9.5 10.1 10.2 10.6 12.0 14.6 17.6 18.0 18.6 19.2 19.6 등 — 그 순간 볼 것·부를 기준을 놓치게 함. 보고문(5.3 6.3 10.0 10.3 15.0 15.4 17.4 18.4 19.3)은 통과.
3. **처치·검사·시점·속도 바꾸기.** 1.0(속도→순서·방식), 1.2·3.4·12.1(머리 올리기→난간·이불·커튼), 5.0(일정→순서·장소), 5.1·8.5(감시 시점·범위), 5.2·7.0·7.2·15.6·16.2·16.5·18.0·18.1(처치를 다른 처치로), 12.6(속도 증량 전 관찰을 식사·활동으로), 13.5(유문후 관 확인 기준을 `위에 있는지`로), 14.0(멈춤 기준 젖산→혈당·열), 14.1(영상검사→영양검사·약물 변경), 16.6 X2(신속대응팀을 입구로), 19.0(`urgently`→정확하게·직접), 19.1(위기 속도 감소→면회 시간·조명).
4. **대량 흡인 위기(S17)의 정답 둘** — 17.0·17.1·17.5의 오답이 같은 상황 다른 문장의 정답(산소 올리기·입안 흡인·돌리기·앉히기·침대 올리기)이라 듣고도 고를 수 없음.
5. **사용자 판단(문장 `en`은 v44 정본이라 B는 고치지 않음).** **15.6 "I'll give more fluid while we wait for the surgeon"** — 복부구획증후군에서 수액을 더 주는 것은 WSACS 2013이 경계하는 처치(양의 수액 균형이 복강내압을 올림; 처방 없이 간호사가 말하는 것도 문제). order S15 L4는 B 몫이라 15.2 문장으로 바꿈(D). **13.4 "Interventional radiology will place the tube at the bedside"** — IR은 대개 투시 장비가 있는 시술실에서 넣고, 침상 곁 유문후 관은 훈련된 간호사·의사가 전자기 유도로 넣거나 내시경으로 넣음(S13 L3도 같은 말). **0.9 ko** `직접 해 드릴 수도 있어요`는 "so you can help too"(돕다)와 어긋남 — A 몫. 1.5 `his`·order S1 L2 `his` — S1 환자는 she(1.4·1.6).

## 저작자가 판정을 부탁한 곳
| 곳 | 판정 | 새 값 |
|---|---|---|
| 감시·확인 문장의 지표 하나만 바꾼 오답(1.1·7.1·7.5·8.1·10.1·10.6·19.2·19.6 등) | **실패(실패 1)** — "나열 항목 하나는 남김"도 성립 안 함: 바뀐 항목을 놓침. 보고문만 통과 | X1 뒤 단계(조건)·X2 참인 이유(A 표) |
| 17.2 호출 — X1 `간호팀장` | **실패** — 처방이 필요한 위기에 의사 호출이 빠짐 | `호흡치료팀과 의사가 오는 중이에요` |
| 17.2 호출 — X2 `마취팀` | **통과** — 의사는 남고 호흡치료팀만 기도 관리가 되는 옆 팀으로(brain-death 16.1 선례) | — |
| 위기 처치 오답을 다른 참인 처치로(17.0 산소·입안 흡인, 17.1 침대, 17.5 기도 흡인·돌리기) | **정답 둘** — 모두 같은 상황 다른 문장의 정답 | 흡인의 바로 앞 단계(흡인기 켜기·유량계 보기)·참인 이유 |
| 튜브 위치 확인 문장에서 급식 대신 투약·세척(2.1·2.5·13.1) | **정답 둘**(안전 문제는 아님) — 2.6 "확인 전엔 관으로 아무것도 안 넣어요"대로 투약·세척 보류도 참 | 관과 상관없는 일(목욕·면회·운동·재활) |
| 같은 틀의 14.2·14.5 `투약` 보류 | **안전 실패** — 위치 확인이 아니라 장허혈 의심이라 약 전부를 끊는 말 | 함께 하는 일(머리 올리기·배 살피기) |
| 2.0 X1 `영양제를` | 실패 — '무엇이든'을 좁혀 규칙이 약해짐 | `goes`가 들리는 자리를 `빼기`로 |
| 시각·장소 decoy `at lunch`(6.3)·`at noon`(9.3)·`in the room`(18.3) | **통과** — 마지막 부사 자리에 맞고 시각·장소만 다름(보고문이라 해 없음) | — |
| decoy `last night`(15.4) | **실패** — `He's making … last night` 시제가 안 맞아 문법으로 걸러짐 | `this shift` |
| decoy `this week`(7.2) | **실패** — 보충을 미루는 시각 decoy | `too loudly` |
| order 4번째 줄 `Alongside that`·`On top of all that` | 어느 줄 뒤에도 붙어 순서를 못 박음 — 8장에서 인접 교환이 읽힘(S1·S17은 교환하면 어색해 통과) | D 표 — 3줄의 낱말(`hold`·`ten minutes`·`resuscitation`·`rate`)을 가리키게 |

## 실패 7가지 대조
1(대상·지표 바꾸기) **약 30문장** · 2(사람만 바꾸기) 0(호출 대상 바꾸기는 3·17.2로 따로) · **3(처치를 다른 일로·판단 기준·시점) 약 24문장** · 4(정답+덧붙임) 0 · 5(말투만) 0 · **6(동떨어진·소리 닮은 빈칸) 약 44문장** · **7(decoy) 자리 없음 8 + 조립하면 안전 10 + 반대말 2 + 같은 낱말 되풀이 21**.
남은 위험(새 값): 환자에게 "말씀해 주세요"라고 하는 4.1·4.6, 동료에게 "불러 주세요"인 1.6·5.6·14.6은 안전한 바꿀 자리가 없어 X 하나를 참인 이유(평서문)로 썼습니다 — 요청문이 정답 하나뿐이라 모양 단서가 약하게 남습니다.

## order 판정(21장, 인접 교환 63건)
통과 12장(S0 S3 S4 S5 S8 S10 S11 S12 S13 S14 S17 S20 — S13은 위 사실 5만). 고칠 것 9장: S1(L2 `his`→`her`), S2(3↔4), S6(2↔3), S7(3↔4), S9(3↔4), S15(3↔4 + L4 사실), S16(3↔4), S18(2↔3 — 임상으로도 인슐린이 칼륨·인산을 세포 안으로 옮기니 3줄을 2줄에 묶음), S19(3↔4). 새 줄은 D.

## A. distractorsKo 새 값 (73문장 — 안전 54 · 정답 둘 18 · 길이 1)

| 문장 | 분류 | 문제 | 지금 X1 / X2 | 새 X1 / X2 (— = 그대로) |
|---|---|---|---|---|
| 1.0 | **안전** | 급식 속도(`ordered rate`)를 순서·방식으로 바꿈 — 속도 근거가 빠짐(사용자 실패 목록). X2 `방식`은 속도를 품는 말이라 정답 둘에 가까움. 속도는 두고 앞 단계(위치 확인)·함께 하는 일(머리 올리기)로 | 지시된 순서로 시작하고 위잔여량을 확인할게요. / 지시된 방식으로 시작하고 위잔여량을 확인할게요. | 지시된 속도로 시작하기 전에 관 위치를 확인할게요 / 지시된 속도로 시작하고 침대 머리를 올릴게요 |
| 1.1 | **안전** | 실패 1 — 관찰 항목 하나만 옆 항목(구토·부종)으로. 항목은 두고 뒤 단계(조건)·참인 이유로 | 팽만이나 구토가 있는지 지켜봐요. / 부종이나 불편감이 있는지 지켜봐요. | 팽만이나 불편감이 보이면 멈춰요 / 팽만이나 불편감은 내성 신호예요 |
| 1.2 | **안전** | 흡인 예방 체위(부위) 자체를 난간·이불로 바꿈 — 처치 대신 다른 일(실패 3). 앞 단계(몸을 위로 올려 바로 눕힘)·참인 이유로 | 침대 난간 쪽을 올려 둘게요. / 침대 이불 쪽을 올려 둘게요. | 침대 머리 쪽 각도를 확인할게요 / 머리 쪽은 흡인을 막아 줘요 |
| 1.3 | 길이 | 오답 둘 다 정답보다 김(25주제 규칙). 간격·대상은 두고 근거만 — X2를 같은 길이로 | 가족 요청대로 네 시간마다 위잔여량을 확인할게요. / 당직 일정대로 네 시간마다 위잔여량을 확인할게요. | — / 제 판단대로 네 시간마다 위잔여량을 확인할게요 |
| 1.4 | 정답 둘 | X1 `의사에게 보고`·X2 `팀에 알릴게요` — 오답끼리 같은 뜻이라 남는 하나가 정답. 보류는 둔 채 X2를 함께 하는 일로(X1은 뒤 단계라 통과) | 배가 팽창해 보이면 급식을 보류하고 의사에게 보고할게요. / 배가 팽창해 보이면 급식을 보류하고 팀에 알릴게요. | — / 배가 팽창해 보이면 급식을 보류하고 머리를 더 올릴게요 |
| 1.5 | 정답 둘 | X2 `감염 위험` — 머리 올리기는 인공호흡기 폐렴(감염) 예방 묶음의 하나라 참인 말(정답 둘). 빈칸 `infection`도 같은 이유로 바꿈(B). X1 난간·낙상은 주어가 달라 통과 | 침대 난간을 올려 두면 낙상 위험이 줄어요. / 침대 머리를 올려 두면 감염 위험이 줄어요. | — / 침대 머리를 올려 두면 출혈 위험이 줄어요 |
| 1.6 | **안전** | 실패 1 — 호출 기준 하나만 옆 증상(메스꺼움·붓기)으로. 기준은 두고 X1 참인 이유, X2 부를 사람을 처방하는 의사로(호출이 약해지지 않음 — 아래 판정) | 팽만이 보이거나 메스꺼워 보이면 불러 주세요. / 붓기가 보이거나 불편해 보이면 불러 주세요. | 팽만이 보이거나 불편해 보이면 흡인이 쉬워요 / 팽만이 보이거나 불편해 보이면 의사를 불러 주세요 |
| 2.0 | **안전** | X1 `영양제를` — '무엇이든'을 영양제로 좁혀 약·물은 확인 없이 넣어도 되는 말이 됨(규칙 약화). 넣는 쪽은 그대로 두고 `goes`(넣다)가 들리는 자리를 빼기로 | 관을 통해 영양제를 넣기 전에 위치부터 확인해요. / 입을 통해 무엇이든 넣기 전에 위치부터 확인해요. | 관으로 무엇이든 빼기 전에 위치부터 확인해요 / — |
| 2.1 | 정답 둘 | 투약·세척 보류는 2.6('아무것도 안 넣어요')대로 참인 말 — 정답 둘. 관과 상관없는 일로 | 엑스레이로 확인될 때까지 투약은 보류할게요. / 엑스레이로 확인될 때까지 세척은 보류할게요. | 엑스레이로 확인될 때까지 목욕은 보류할게요 / 엑스레이로 확인될 때까지 면회는 보류할게요 |
| 2.5 | 정답 둘 | 2.1과 같음 — 투약·세척도 확인 전엔 시작하지 않는 게 맞음(정답 둘) | 엑스레이로 위치를 확인할 때까지 투약은 시작하지 않아요. / 엑스레이로 위치를 확인할 때까지 세척은 시작하지 않아요. | 엑스레이로 위치를 확인할 때까지 운동은 시작하지 않아요 / 엑스레이로 위치를 확인할 때까지 재활은 시작하지 않아요 |
| 3.4 | **안전** | 머리 올리기를 난간·이불 올리기로 바꿈 — 체위(부위) 바꾸기. 체위는 두고 `feeding`이 들리는 자리를 다른 일로 | 급식을 시작하기 전에 침대 난간을 올려드릴게요. / 급식을 시작하기 전에 침대 이불을 올려드릴게요. | 양치를 시작하기 전에 침대 머리를 올려드릴게요 / 검사를 시작하기 전에 침대 머리를 올려드릴게요 |
| 4.0 | **안전** | 실패 1 — 사정 대상(배·장음)을 심음·등으로. 앞 단계(목적 표지 하나만)·뒤 단계(소견)로 | 배를 확인하고 심음을 들어볼게요. / 등을 확인하고 장음을 들어볼게요. | 장음을 들으려고 이불을 걷을게요 / 배를 확인하니 장음이 조용하네요 |
| 4.1 | **안전** | 실패 1 — 환자에게 알려 달라는 기준(통증)을 가려움·뜨거움으로. 기준은 두고 뒤 단계·참인 이유로 | 가렵거나 더 단단해지면 말씀해 주세요. / 아프거나 더 뜨거워지면 말씀해 주세요. | 아프거나 더 단단해지면 급식을 멈출게요 / 아프거나 더 단단해지면 안 좋은 신호예요 |
| 4.2 | **안전** | X1 `조금 부르면` — 조절 기준을 바꿈(멈춤 기준). X2 `급식 줄` — 조절 대상을 줄로. 참인 이유·앞 단계로 | 배가 조금 부르면 급식을 조절할게요. / 배가 너무 부르면 급식 줄을 조절할게요. | 배가 너무 부르면 급식이 많다는 신호예요 / 배가 너무 부른지 매일 여쭤볼게요 |
| 4.6 | **안전** | 실패 1 — 알려 달라는 기준(통증)을 구토·어지러움으로. 기준은 두고 뒤 단계·참인 이유로 | 구토가 심해지면 바로 알려주세요. / 어지러움이 심해지면 바로 알려주세요. | 통증이 심해지면 바로 와서 볼게요 / 통증이 심해지면 장이 나빠진 신호예요 |
| 5.0 | **안전** | X1 `순서대로`·X2 `정해진 장소에서` — 확인 시점(지시된 일정)이 빠짐(사용자 실패 목록: 시점). 일정·대상은 두고 뒤 단계·참인 이유로 | 지시된 순서대로 혈당을 확인해요. / 정해진 장소에서 혈당을 확인해요. | 지시된 일정에 혈당이 높으면 알려 줘요 / 급식 중에는 혈당이 오르기도 해요 |
| 5.1 | **안전** | X1 `줄어드는 동안`·X2 `약이 늘어나는 동안` — 감시 시점을 바꿈. 참인 이유 둘로(X2는 들리는 자리 `electrolytes`→인산염) | 급식이 줄어드는 동안 전해질을 지켜볼게요. / 약이 늘어나는 동안 전해질을 지켜볼게요. | 급식이 늘어나면 전해질이 떨어지기도 해요 / 급식이 늘어나는 동안 인산염이 먼저 떨어져요 |
| 5.2 | **안전** | 처치(인슐린)를 식사·수분 보충으로 바꿈(약 이름). 처치는 두고 참인 이유·뒤 단계로 | 필요에 따라 식사 보충을 조절할게요. / 필요에 따라 수분 보충을 조절할게요. | 급식량에 따라 인슐린 보충도 달라져요 / 인슐린 보충을 조절한 뒤 혈당을 다시 볼게요 |
| 5.5 | **안전** | 실패 1 — 재확인 대상을 기록·처방으로(빠뜨린 확인). 뒤 단계·참인 이유로 | 몇 시간 뒤에 기록을 재확인할게요. / 몇 시간 뒤에 처방을 재확인할게요. | 몇 시간 뒤 검사가 나쁘면 알릴게요 / 몇 시간 사이 전해질이 또 떨어져요 |
| 5.6 | **안전** | 실패 1 — 호출 기준(혈당)을 혈압·체중으로. 기준은 두고 참인 이유·처방하는 의사 호출로 | 혈압이 목표 범위를 넘으면 불러 주세요. / 체중이 목표 범위를 넘으면 불러 주세요. | 혈당이 목표 범위를 넘으면 위험해요 / 혈당이 목표 범위를 넘으면 의사를 불러 주세요 |
| 6.0 | 정답 둘 | X1 `증상을 다시 평가` — 내성 평가와 같은 일(정답 둘). X2 `식욕` — 평가 대상 바꾸기(실패 1). 앞 단계·함께 하는 일로 | 속도를 줄이고 증상을 다시 평가해요. / 속도를 줄이고 식욕을 다시 평가해요. | 속도를 줄이기 전에 위잔여량을 재요 / 속도를 줄이고 머리를 올려 둬요 |
| 6.2 | **안전** | X1 `침대를 올려` — 머리 올리기와 거의 같은 말(정답 둘). X2 `구토를 지켜볼게요` — 관찰 대상 바꾸기(실패 1) | 침대를 올려 두고 팽만을 지켜볼게요. / 머리를 올려 두고 구토를 지켜볼게요. | 머리 각도를 재고 팽만을 지켜볼게요 / 머리를 올려 두면 팽만이 덜 불편해요 |
| 6.4 | 정답 둘 | X1 `위치를`·X2 `배를` 재확인 — 영어에 대상이 없어 둘 다 정답 '재확인'에 들어감(③ 안 들림, 정답 둘). 시점(한 시간)은 건드리지 않고 앞 단계·참인 이유로 | 일단 급식을 보류하고 한 시간 뒤에 위치를 재확인해요. / 급식을 보류하고 한 시간 뒤에 배를 재확인해요. | 일단 급식을 보류하고 위잔여량부터 재요 / 일단 급식을 보류하는 이유는 흡인 예방이에요 |
| 6.6 | **안전** | 실패 1 — 기록 대상을 섭취량·배액량으로. 대상은 두고 앞 단계·뒤 단계로 | 섭취량을 기록하고 팀에 알릴게요. / 배액량을 기록하고 팀에 알릴게요. | 위잔여량을 다시 재고 팀에 알릴게요 / 위잔여량이 많으면 팀이 속도를 정해요 |
| 7.0 | **안전** | X1 `수액을 늘려요` — 처치(급식)를 수액으로 바꿈. 앞 단계(시작 전 전해질 — ASPEN 2020)로. X2 `활동`은 임상과 상관없는 말이라 통과 | 낮은 속도로 시작해서 천천히 수액을 늘려요. / 낮은 속도로 시작해서 천천히 활동을 늘려요. | 낮은 속도로 시작하기 전에 전해질을 확인해요 / — |
| 7.1 | **안전** | 실패 1 — 감시 목록 하나만 칼슘·나트륨으로. 목록은 두고 뒤 단계·참인 이유로 | 인산염과 칼륨, 칼슘을 자세히 감시할게요. / 인산염과 나트륨, 마그네슘을 자세히 감시할게요. | 인산염과 칼륨, 마그네슘이 낮으면 보충할게요 / 인산염과 칼륨, 마그네슘이 재영양에서 떨어져요 |
| 7.2 | **안전** | **X1 `혈당이 떨어지기 전에 보충` — 재영양 위험 환자에게 당을 보충하는 말(재영양을 악화).** X2 `수분` — 처치 바꾸기. 뒤 단계·함께 하는 감시로 | 혈당이 너무 떨어지기 전에 보충할게요. / 수분이 너무 떨어지기 전에 보충할게요. | 전해질이 너무 떨어지면 급식을 줄일게요 / 전해질이 너무 떨어지기 전에 자주 잴게요 |
| 7.5 | **안전** | 실패 1 — 확인 대상을 혈색·소변량으로. 뒤 단계(시작 전 교정)·참인 이유로 | 시작 전과 그 이후 몇 시간마다 혈색을 확인할게요. / 시작 전과 그 이후 몇 시간마다 소변량을 확인할게요. | 시작 전과 그 이후 전해질이 낮으면 먼저 보충할게요 / 시작 전과 그 이후 전해질은 재영양 위험을 알려 줘요 |
| 8.1 | **안전** | 실패 1 — 감시 대상 하나만 호흡수·맥박으로 | 혈당과 호흡수를 자세히 감시할게요. / 맥박과 전해질을 자세히 감시할게요. | 혈당과 전해질이 벗어나면 알릴게요 / TPN은 혈당과 전해질을 자주 흔들어요 |
| 8.5 | **안전** | 감시 범위(`while he's on TPN`)를 항생제·수액으로 — TPN 중 혈당 감시가 빠짐. 간격을 좁히기(선례 brain-death 5.4)·참인 이유로 | 항생제를 맞는 동안 여섯 시간마다 혈당을 확인할게요. / 수액을 맞는 동안 여섯 시간마다 혈당을 확인할게요. | TPN을 맞는 동안 네 시간마다 혈당을 확인할게요 / TPN을 맞는 동안에는 혈당이 오르기 쉬워요 |
| 9.0 | **안전** | 실패 1 — 측정 대상을 혈압·체온으로. 앞 단계(앙와위 — WSACS 2013 측정 조건)·참인 이유로 | 지금 혈압을 설치해서 측정할게요. / 지금 체온을 설치해서 측정할게요. | 지금 방광압을 재기 전에 환자를 눕힐게요 / 방광압은 배 속 압력을 알려 줘요 |
| 9.1 | 정답 둘 | X1 `기록하면서`·X2 `재면서` — 추세 보기에 들어가는 일이라 정답 둘(X1은 `기록` 상한 5) | 추세를 기록하면서 수치가 오르는지 지켜봐요. / 추세를 재면서 수치가 오르는지 지켜봐요. | 추세를 보면서 수치가 오르면 알려요 / 추세가 한 번 잰 값보다 훨씬 중요해요 |
| 9.2 | **안전** | 실패 1 — 보고할 값을 맥박·열로(방광압 보고가 빠짐). 앞 단계(재측정)·참인 이유로 | 맥박을 바로 의사에게 보고할게요. / 열을 바로 의사에게 보고할게요. | 값을 한 번 더 재고 의사에게 알릴게요 / 그 값은 의사가 바로 알아야 해요 |
| 9.5 | **안전** | 보고 기준을 소변량·체온으로 — 멈춤·호출 기준 바꾸기. 기준은 두고 참인 이유·앞 단계로 | 소변량이 계속 줄면 알릴게요. / 체온이 계속 오르면 알릴게요. | 수치가 오르면 장기가 위험해요 / 수치가 계속 오르는지 한 시간 뒤 볼게요 |
| 10.1 | **안전** | 실패 1 — 추적 대상을 식사량·피부로 | 장기 기능과 식사량을 자세히 추적해요. / 피부 기능과 압력을 자세히 추적해요. | 장기 기능과 압력이 나빠지면 보고할게요 / 장기 기능과 압력은 같이 움직여요 |
| 10.2 | **안전** | 실패 1 — 알릴 내용(추세)을 검사 결과·통증으로 | 검사 결과에 대해 의사에게 알릴게요. / 통증에 대해 의사에게 알릴게요. | 의사에게 알리기 전에 추세를 정리할게요 / 그 추세는 의사가 알아야 해요 |
| 10.6 | **안전** | 실패 1 — 재확인 목록 하나만 배액량·체액으로 | 한 시간 뒤에 압력과 배액량을 재확인해요. / 한 시간 뒤에 체액과 소변량을 재확인해요. | 한 시간 뒤에 압력과 소변량이 나쁘면 알려요 / 압력과 소변량은 같이 봐야 정확해요 |
| 11.0 | **안전** | X1 `계산`→`기록`(실패 3), X2 단백질→비타민(대상 바꾸기). 참인 방법·뒤 단계로 | 칼로리와 단백질 요구량을 다시 기록해요. / 칼로리와 비타민 요구량을 다시 계산해요. | 칼로리와 단백질 요구량은 체중으로 정해요 / 칼로리와 단백질 요구량이 바뀌면 영양액을 바꿔요 |
| 11.1 | 정답 둘 | X2 `식단을 미세 조정` — 영양 목표 조정과 거의 같은 일(정답 둘). 사람(`dietitian`이 들림)으로 | 영양사가 시간을 미세 조정하는 데 도움을 줄 수 있어요. / 영양사가 식단을 미세 조정하는 데 도움을 줄 수 있어요. | — / 약사가 목표를 미세 조정하는 데 도움을 줄 수 있어요 |
| 12.0 | **안전** | 실패 1 — 재평가 대상을 복부·배 소리로. 앞 단계·참인 효과로 | 촉진제를 시작하고 복부를 다시 평가해요. / 촉진제를 시작하고 배 소리를 다시 평가해요. | 촉진제를 시작하려고 처방을 확인해요 / 촉진제는 위잔여량을 줄이는 데 도움이 돼요 |
| 12.1 | **안전** | 1.2와 같음 — 체위를 난간·커튼으로 | 침대 난간을 올려 두고 감시할게요. / 침대 커튼을 올려 두고 감시할게요. | 침대 머리를 올려 두고 커튼은 열어 둘게요 / 침대 머리를 올려 두면 흡인이 줄어요 |
| 12.6 | **안전** | 속도 올리기 전 관찰을 식사·활동으로 옮김 — 속도 증량의 조건이 빠짐(급식 속도). 속도는 두고 뒤 단계·함께 하는 일로 | 식사를 더 늘리기 전에 계속 지켜봐요. / 활동을 더 늘리기 전에 계속 지켜봐요. | 속도를 더 늘리면 배를 더 자주 봐요 / 속도를 더 늘리기 전에 영양사와 상의해요 |
| 13.0 | 정답 둘 | X1 `감염 위험` — 흡인 폐렴 감소는 참(정답 둘, 1.5와 같음) | 유문후 관을 넣으면 감염 위험을 줄일 수 있어요. / 유문후 관을 넣으면 출혈 위험을 줄일 수 있어요. | 유문후 관을 넣으면 설사 위험을 줄일 수 있어요 / — |
| 13.1 | 정답 둘 | X2 `세척` — 세척 전에도 위치 확인이 맞음(정답 둘). X1 `처치`는 막연하지만 통과 | 처치를 재개하기 전에 위치부터 확인해요. / 세척을 재개하기 전에 위치부터 확인해요. | — / 운동을 재개하기 전에 위치부터 확인해요 |
| 13.2 | 정답 둘 | X1 `침대를`·X2 `베개를` 올려 — 둘 다 머리를 높이는 말이라 정답 둘. 함께 하는 일·참인 효과로 | 침대를 올려 두고 흡인 준비도 해둘게요. / 베개를 올려 두고 흡인 준비도 해둘게요. | 머리를 올려 두고 산소 준비도 해둘게요 / 머리를 올려 두면 토해도 덜 위험해요 |
| 13.5 | **안전** | 튜브 위치 확인 대상을 바꿈 — X1 `관이 위에 있는지`(유문후 관의 확인 기준이 반대), X2 `꼬였는지`(같은 사진에서 보는 참인 확인 — 정답 둘) | 관이 위에 있는지 엑스레이로 확인할게요. / 관이 꼬였는지 엑스레이로 확인할게요. | 유문을 지났는지 엑스레이로 확인한 뒤 급식할게요 / 유문을 지났는지는 엑스레이가 정확해요 |
| 14.0 | **안전** | 멈춤 기준(젖산)을 혈당·열로. 소견은 두고 참인 다음 일·참인 이유로 | 혈당이 오르고 배가 팽팽해서 급식을 보류하려고요. / 젖산이 오르고 열이 나서 급식을 보류하려고요. | 젖산이 오르고 배가 팽팽해서 영상검사가 필요해요 / 젖산이 오르고 배가 팽팽한 건 장허혈 신호예요 |
| 14.1 | **안전** | 검사(영상)를 영양검사·약물 변경으로 바꿈(처치·검사를 다른 것으로). 앞·뒤 단계로 | 의사에게 알리고 영양검사를 고려해요. / 의사에게 알리고 약물 변경을 고려해요. | 의사에게 알리고 젖산을 한 번 더 재요 / 의사에게 알리고 영상검사 결과를 기다려요 |
| 14.2 | **안전** | **X1 `투약하지 않을 거예요` — 장허혈 의심 환자의 약을 전부 끊는 말(항생제·승압제 포함).** 함께 하는 일로. X2 면회는 통과 | 허혈이 배제될 때까지 투약하지 않을 거예요. / 허혈이 배제될 때까지 면회하지 않을 거예요. | 허혈이 배제될 때까지 머리를 올려 둘 거예요 / — |
| 14.5 | **안전** | **X1 `투약을 모두 보류` — 14.2와 같음.** X2 면회는 통과 | CT 스캔을 찍을 때까지 투약을 모두 보류하고 있어요. / CT 스캔을 찍을 때까지 면회를 모두 보류하고 있어요. | CT 스캔을 찍을 때까지 배를 자주 살펴보고 있어요 / — |
| 14.6 | **안전** | 호출 기준(소견)을 순서·일정으로. 기준은 두고 참인 이유·처방하는 의사 호출로 | 검사나 진찰 순서가 바뀌면 바로 불러 주세요. / 검사나 진찰 일정이 바뀌면 바로 불러 주세요. | 검사나 진찰 소견이 바뀌면 수술일 수도 있어요 / 검사나 진찰 소견이 바뀌면 의사를 바로 불러 주세요 |
| 15.1 | 정답 둘 | X2 `긴급 진료를 위해` — 감압도 진료라 정답 둘. 뒤 단계(수술팀 쪽 일)로. X1 `이송`은 통과 | 긴급 이송을 위해 수술팀을 부르고 있어요. / 긴급 진료를 위해 수술팀을 부르고 있어요. | — / 긴급 감압을 위해 수술팀이 수술실을 준비해요 |
| 15.2 | 정답 둘 | X1 `통증과 수액` — 진통도 WSACS 2013 권고(정답 둘). X2 `식사 상태` — 구획증후군에 급식. 함께 하는 감시·참인 효과로 | 그동안 통증과 수액 상태를 최적화해요. / 그동안 진정과 식사 상태를 최적화해요. | 그동안 압력을 한 시간마다 다시 재요 / 그동안 진정을 깊게 하면 압력이 내려가요 |
| 15.6 | **안전** | X1 `산소를 더` — 처치를 다른 처치로. 함께 하는 감시로(정답 문장 자체의 사실 문제는 아래 심각한 문제 5). X2 마취의사는 통과(기다리는 사람, 호출 아님) | 외과의사를 기다리는 동안 산소를 더 드릴게요. / 마취의사를 기다리는 동안 수액을 더 드릴게요. | 외과의사를 기다리는 동안 소변량을 매시간 잴게요 / — |
| 16.0 | 정답 둘 | X1 `산소를 시작` — 소생술의 일부(정답 둘), X2 `이송을 시작` — 위기에 자리를 옮김(실패 3). 처치를 둔 채 함께 하는 호출·우선순위 말로 | 급식을 모두 중단하고 지금 산소를 시작해요. / 급식을 모두 중단하고 지금 이송을 시작해요. | 소생술을 시작하면서 수술팀을 부를게요 / 급식 중단과 소생술이 지금 가장 먼저예요 |
| 16.1 | 정답 둘 | X2 `응급 상담` — 평가와 같은 뜻(정답 둘). X1 `응급 수술`은 목적이 달라 통과 | 응급 수술을 위해 수술팀을 부르고 있어요. / 응급 상담을 위해 수술팀을 부르고 있어요. | — / 응급 평가를 위해 수술팀이 오는 중이에요 |
| 16.2 | **안전** | 처치 대상(혈압)을 호흡·체온으로. 앞 단계(수액 먼저 — SSC 2021)·참인 이유로 | 호흡을 지지하고 광범위 항생제를 투여해요. / 체온을 지지하고 광범위 항생제를 투여해요. | 혈압은 수액부터 충분히 주며 지지해요 / 광범위 항생제는 장 속 세균을 겨냥해요 |
| 16.5 | **안전** | 처치(수액)를 산소·약으로. 앞 단계·참인 효과로 | 산소를 드리면서 바로 의사에게 연락하고 있어요. / 약을 드리면서 바로 의사에게 연락하고 있어요. | 수액을 드리려고 정맥로를 확인하고 있어요 / 수액은 장으로 가는 혈류를 받쳐 주는 거예요 |
| 16.6 | **안전** | X1 `중환자실로` — 환자가 이미 중환자실이라 정답과 같은 뜻(정답 둘), X2 `입구로` — 위기에 팀을 다른 곳으로(지연). 함께 하는 일·뒤 단계로 | 신속대응팀을 지금 중환자실로 불러주세요. / 신속대응팀을 지금 입구로 불러주세요. | 신속대응팀을 부르는 동안 제가 곁에 있을게요 / 신속대응팀이 오면 바로 인계할게요 |
| 17.0 | 정답 둘 | 저작자 판단 거리 — X1 `산소를 올려요`(17.1 정답), X2 `입안을 흡인`(17.5 정답)은 같은 상황 다른 문장의 정답이라 정답 둘. 돌리기는 두고 흡인의 바로 앞 단계·참인 이유로 | 환자분을 돌려서 바로 산소를 올려요. / 환자분을 돌려서 바로 입안을 흡인해요. | 환자분을 돌려서 바로 흡인기를 켜요 / 환자분을 옆으로 돌려야 기도로 덜 넘어가요 |
| 17.1 | 정답 둘 | X1 `침대를 올려요` — 흡인 직후 참인 처치(정답 둘), X2 `모니터를 켜요` — 산소 대신 엉뚱한 일. 앞 단계·참인 이유로 | 급식을 멈추고 지금 침대를 올려요. / 급식을 멈추고 지금 모니터를 켜요. | 급식을 멈추고 산소 유량계부터 봐요 / 산소를 올리면 포화도가 올라요 |
| 17.2 | **안전** | 저작자 판단 거리 — X1 `간호팀장` — 의사 호출이 빠짐(처방이 필요한 위기, 실패). X2 `마취팀` — 의사는 남고 호흡치료팀만 옆 팀(기도 관리 가능) — 통과 | 호흡치료팀과 간호팀장을 부르고 있어요. / 마취팀과 의사를 부르고 있어요. | 호흡치료팀과 의사가 오는 중이에요 / — |
| 17.5 | 정답 둘 | X1 `기도를 흡인`(17.0 정답)·X2 `돌려 드리고`(17.0 정답) — 둘 다 참인 처치라 정답 둘 | 먼저 앉혀 드리고 기도를 흡인해요. / 먼저 돌려 드리고 입안을 흡인해요. | 먼저 앉혀 드리고 흡인기를 켜요 / 먼저 앉혀 드리면 흡인이 쉬워져요 |
| 17.6 | **안전** | 실패 1 — 흡인 뒤 폐 청진을 심음·장음으로(흡인 폐렴 사정이 빠짐) | 안정되면 심음을 들어볼게요. / 안정되면 장음을 들어볼게요. | 안정될 때까지 포화도를 계속 봐요 / 안정되면 폐음이 거칠 수 있어요 |
| 18.0 | **안전** | X1 처치(인슐린)를 수액으로, X2 재확인 대상(혈당)을 체중으로 | 수액을 조절하고 혈당을 재확인해요. / 인슐린을 조절하고 체중을 재확인해요. | 인슐린을 조절하려고 처방을 확인해요 / 인슐린은 혈당 수치에 맞춰 조절해요 |
| 18.1 | **안전** | 처치 대상(전해질)을 체액·혈당으로 | 체액을 바로잡고 자세히 감시할게요. / 혈당을 바로잡고 자세히 감시할게요. | 전해질을 바로잡고 신장 기능도 볼게요 / 전해질은 TPN으로 흔들리기 쉬워요 |
| 18.5 | **안전** | **X1 `고정 척도` — 인슐린 용량 기준을 바꿈(용량).** X2 `보여 드릴게요` — 투여를 설명으로(실패 3) | 고정 척도에 따라 인슐린을 드릴게요. / 가변 척도에 따라 인슐린을 보여 드릴게요. | 가변 척도를 쓰려고 혈당부터 재요 / 가변 척도는 혈당 구간마다 양이 달라요 |
| 18.6 | **안전** | 실패 1 — 재확인 대상을 기록·처방으로(5.5와 같은 틀) | 두 시간 뒤에 기록을 재확인하고 의사에게 연락해요. / 두 시간 뒤에 처방을 재확인하고 의사에게 연락해요. | 두 시간 뒤에 검사가 나쁘면 의사에게 연락해요 / 두 시간 뒤 검사는 교정이 됐는지 보려는 거예요 |
| 19.0 | **안전** | `urgently`를 `정확하게`·`직접`으로 — 처치 시점(긴급)이 빠짐. 앞 단계·참인 이유로 | 인산염과 칼륨을 정확하게 보충해요. / 인산염과 칼륨을 직접 보충해요. | 인산염과 칼륨을 보충하며 심전도를 봐요 / 인산염과 칼륨은 심장 리듬에 중요해요 |
| 19.1 | **안전** | 위기 처치(속도 감소)를 면회 시간·조명 밝기로 — 처치 대신 엉뚱한 일(brain-death 7.0 X2와 같음) | 지금 면회 시간을 줄여요. / 지금 조명 밝기를 줄여요. | 급식 속도를 줄이면 덜 위험해요 / 속도 감소가 첫 처치예요 |
| 19.2 | **안전** | 실패 1 — 감시 대상을 호흡·수면 리듬으로 | 호흡 리듬을 자세히 감시할게요. / 수면 리듬을 자세히 감시할게요. | 심장 리듬이 바뀌면 바로 알릴게요 / 심장 리듬은 낮은 인산염에 흔들려요 |
| 19.5 | **안전** | **X1 `칼로리를 보충` — 재영양증후군 위기에 열량을 더 넣는 말(그 위해 그대로).** 같은 표지(`전에`)의 앞 단계로. X2 `치료를`은 통과 | 급식을 다시 시작하기 전에 칼로리를 보충해요. / 치료를 다시 시작하기 전에 전해질을 보충해요. | 급식을 다시 시작하기 전에 심전도를 봐요 / — |
| 19.6 | **안전** | 실패 1 — 감시 대상을 호흡·혈압 모니터로 | 호흡 모니터에 새로운 변화가 있는지 지켜볼게요. / 혈압 모니터에 새로운 변화가 있는지 지켜볼게요. | 심장 모니터에 새로운 변화가 있으면 알릴게요 / 심장 모니터는 전해질 이상을 일찍 보여 줘요 |

## B. 빈칸 새 선택지 (58문장)

| 문장 | 문제 | 지금 answer / 선택지 | 새 answer / 선택지 |
|---|---|---|---|
| 0.1 | `always`는 일상 말에서 usually와 같게 쓰임(정답 둘) | usually / usually, rarely, always, never | usually / usually, rarely, later, never |
| 0.3 | roughly·loosely·vaguely 셋이 같은 뜻 — 남는 하나가 정답 | exactly / exactly, roughly, loosely, vaguely | exactly / exactly, roughly, weekly, quickly |
| 0.5 | `early` — 조기 장관영양(48시간 안)은 ASPEN·SCCM 2016 권고라 장면상 맞음(정답 둘) | slowly / slowly, quickly, early, late | slowly / slowly, quickly, late, suddenly |
| 0.7 | `ready` — '아직 (드릴) 때가 아니다'로 읽혀 정답 둘에 가까움 | safe / safe, ready, clean, cold | safe / safe, clean, cold, warm |
| 0.9 | 답 `how`에 when/where가 그대로 맞음(show you where to do it) — 가르치는 말 `help`로 옮김 | how / how, when, where, why | help / help, leave, sign, pay |
| 1.1 | dizziness·drowsiness·dryness — 철자·소리만 닮음(실패 6) | distension / distension, dizziness, drowsiness, dryness | distension / distension, bleeding, fever, itching |
| 1.5 | `infection` — 머리 올리기는 VAP 예방이라 참(정답 둘), `allergy` 동떨어짐 | aspiration / aspiration, infection, bleeding, allergy | aspiration / aspiration, fall, bleeding, clotting |
| 2.0 | `allergies` — 관으로 약을 넣기 전 알레르기 확인은 참(정답 둘), `insurance` 동떨어짐 | placement / placement, allergies, diagnosis, insurance | placement / placement, brand, price, schedule |
| 2.1 | `receipt` 동떨어짐 | x-ray / x-ray, chart, receipt, bag | x-ray / x-ray, bag, label, tray |
| 2.2 | `size` — 관 굵기(Fr)도 기록하는 항목(정답 둘) | position / position, color, size, brand | position / position, price, smell, owner |
| 2.5 | `lunch`·`insurance` 동떨어짐(실패 6) — 엑스레이로 보는 다른 것으로 | placement / placement, lunch, orders, insurance | placement / placement, fractures, pneumonia, fluid |
| 3.2 | `organized`·`busy` 동떨어짐 | comfortable / comfortable, sleepy, organized, busy | comfortable / comfortable, dressed, washed, weighed |
| 3.3 | `bed`·`chair`·`sleeve` 동떨어짐 | airway / airway, bed, chair, sleeve | airway / airway, stomach, bowel, tube |
| 3.4 | `polish`·`cover` 동떨어짐 | raise / raise, clean, cover, polish | raise / raise, lock, clean, label |
| 3.5 | `sleep` — 세운 자세로 잠드는 게 불편하다는 말도 장면상 참(정답 둘) | sit / sit, stand, sleep, read | sit / sit, stand, walk, kneel |
| 3.6 | `burning/spinning down` — `down`과 안 맞아 문법으로 걸러짐 | sliding / sliding, shaking, burning, spinning | sliding / sliding, calming, cooling, settling |
| 4.1 | `sleepy`(배가 졸리다) 동떨어짐 | painful / painful, itchy, noisy, sleepy | painful / painful, itchy, noisy, numb |
| 5.3 | `cleaned/labeled the rate` 동떨어짐 | increased / increased, reduced, cleaned, labeled | increased / increased, reduced, paused, stopped |
| 6.4 | `repeat` — 한 시간 뒤 다시 잰다는 같은 뜻(정답 둘) | recheck / recheck, repeat, record, reread | recheck / recheck, record, reread, reply |
| 7.3 | seconds·minutes·hours 시간 단위 돌려쓰기(브리프 되풀이 목록), `days`로 바꾸면 재영양 위험(5일↑)이라 정답 둘 — 빈칸을 `eaten`으로 옮김 | weeks / weeks, hours, seconds, minutes | eaten / eaten, slept, walked, worked |
| 7.6 | `heart hearing/vision/hunger` 동떨어짐 | rhythm / rhythm, hearing, vision, hunger | rhythm / rhythm, murmur, valves, size |
| 8.1 | `vision`·`hair` 동떨어짐(TPN 감시 항목인 체중·간기능은 정답 둘이라 피함) | glucose / glucose, hearing, vision, hair | glucose / glucose, pupils, reflexes, hearing |
| 8.4 | sticker·bracelet·curtain 동떨어짐(`tubing`은 TPN 수액세트 24시간 교체라 정답 둘이라 피함) | dressing / dressing, sticker, bracelet, curtain | dressing / dressing, pump, pole, monitor |
| 9.2 | price·rumor·nickname 동떨어짐 | value / value, price, rumor, nickname | value / value, height, allergy, mood |
| 9.5 | copy·praise·borrow 동떨어짐 — 방광압 측정의 다른 동작으로 | flag / flag, copy, praise, borrow | flag / flag, chart, zero, clamp |
| 9.6 | visitor·shower·delivery 동떨어짐 | measurement / measurement, visitor, shower, delivery | measurement / measurement, shift, meal, dose |
| 10.3 | smell·sound·texture — 14.4와 같은 묶음 돌려쓰기, 동떨어짐 | output / output, smell, sound, texture | output / output, sodium, pH, protein |
| 11.1 | `bill`·`shower` 동떨어짐 | goals / goals, menu, bill, shower | goals / goals, menu, room, visits |
| 11.5 | copy·clean·borrow 동떨어짐 | review / review, copy, clean, borrow | review / review, explain, draw, order |
| 12.0 | reorder·rename·restock — re- 소리만 닮음(실패 6) | reassess / reassess, reorder, rename, restock | reassess / reassess, dilute, heat, discard |
| 12.1 | relax·whistle·nap 동떨어짐 | monitor / monitor, relax, whistle, nap | monitor / monitor, wash, sit, sleep |
| 12.6 | room·bed·name 동떨어짐 | rate / rate, room, bed, name | rate / rate, oxygen, activity, sedation |
| 13.1 | mood·height·taste 동떨어짐 | placement / placement, mood, height, taste | placement / placement, allergies, pupils, dressing |
| 13.3 | sleeping·smiling·waving 동떨어짐 | aspirating / aspirating, sleeping, smiling, waving | aspirating / aspirating, vomiting, sweating, shivering |
| 13.6 | smiles·laughs·yawns 동떨어짐(`coughs`는 흡인기를 두는 참인 이유라 피함) | vomits / vomits, smiles, laughs, yawns | vomits / vomits, sneezes, sleeps, shivers |
| 14.1 | enjoy·borrow·fear 동떨어짐 | consider / consider, enjoy, borrow, fear | consider / consider, describe, print, file |
| 14.4 | 10.3과 같은 묶음 돌려쓰기 | flow / flow, smell, sound, texture | flow / flow, sugar, type, cell |
| 14.5 | meeting·snack·ride 동떨어짐(`report`는 CT 결과까지 보류라 정답 둘이라 피함) | scan / scan, meeting, snack, ride | scan / scan, tray, gown, badge |
| 15.2 | decorate·admire·praise 동떨어짐 | optimize / optimize, decorate, admire, praise | optimize / optimize, chart, explain, review |
| 15.5 | entertain·welcome·photograph 동떨어짐 | evaluate / evaluate, entertain, welcome, photograph | evaluate / evaluate, discharge, bathe, weigh |
| 16.0 | registration·relaxation·renovation — -ation 소리만 닮음(실패 6) | resuscitation / resuscitation, registration, relaxation, renovation | resuscitation / resuscitation, dialysis, sedation, teaching |
| 16.1 | `an routine`·`an casual` — 관사로 걸러짐 | emergent / emergent, routine, optional, casual | emergent / emergent, elective, outpatient, annual |
| 16.5 | snacks·visitors·gifts 동떨어짐(`oxygen`은 참인 처치라 피함) | fluids / fluids, snacks, visitors, gifts | fluids / fluids, blankets, lotion, directions |
| 16.6 | slow·casual·weekly 동떨어짐 — 팀 이름 자리로 옮김 | rapid / rapid, slow, casual, weekly | response / response, transport, cleaning, dietary |
| 17.0 | **`rinse the airway` — 흡인 직후 기도를 헹구라는 위험한 지시가 보임.** wipe·brush 동떨어짐 | suction / suction, rinse, wipe, brush | suction / suction, tape, measure, weigh |
| 17.5 | hand·foot·elbow 동떨어짐(`nose`는 참인 흡인 부위라 피함) | mouth / mouth, hand, foot, elbow | mouth / mouth, tube, chest, ear |
| 18.0 | `calendar`·`hunger` 동떨어짐(`potassium`은 인슐린 뒤 참인 재확인이라 피함) | glucose / glucose, pressure, hunger, calendar | glucose / glucose, temperature, pulse, sats |
| 18.2 | name·size·brand 동떨어짐(`bag`은 참이라 피함) | rate / rate, name, size, brand | rate / rate, color, pole, cap |
| 18.4 | `are either/neither off` — 문법으로 걸러짐. 빈칸을 전해질 이름으로 옮김(듣기) | both / both, either, neither, only | potassium / potassium, sodium, calcium, chloride |
| 18.6 | snacks·rooms·shifts 동떨어짐 | labs / labs, snacks, rooms, shifts | labs / labs, lines, drains, dressing |
| 19.1 | visiting·cleaning·shopping 동떨어짐 | feeding / feeding, visiting, cleaning, shopping | feeding / feeding, insulin, oxygen, breathing |
| 19.2 | dietary·visual·dental 동떨어짐 | cardiac / cardiac, dietary, visual, dental | cardiac / cardiac, breathing, sleep, bowel |
| 19.5 | `repeat` — restart와 같은 뜻(정답 둘), rename·reroute re- 소리 닮음 | restart / restart, repeat, rename, reroute | restart / restart, stop, flush, thicken |
| 19.6 | visitors·snacks·calls 동떨어짐(`alarms`는 참이라 피함) | changes / changes, visitors, snacks, calls | changes / changes, leads, batteries, screens |
| 20.0 | `With full nutrition, …isn't keeping up` — despite와 같은 뜻으로 읽힘(정답 둘) | Despite / Despite, Because of, Thanks to, With | Despite / Despite, Because of, Thanks to, Without |
| 20.2 | noise·trouble·distance 동떨어짐 — 같은 분야(영양을 더 줘도 안 되는 장면)의 틀린 말로 | comfort / comfort, noise, trouble, distance | comfort / comfort, nutrition, energy, strength |
| 20.5 | `fun`·`funny` — 예후 고지 장면에서 우스운 말 | hard / hard, easy, fun, funny | hard / hard, easy, strange, quick |
| 20.6 | `loudly`·`lazily` 동떨어짐 | together / together, alone, loudly, lazily | together / together, quickly, later, briefly |

## C. decoy 새 값 (41개 — 조립하면 안전 문제 11 · 반대말 2 · 어느 청크 자리에도 안 맞음 7 · 되풀이 21)

| 문장 | 분류 | 지금 | 새 값 | 문제 |
|---|---|---|---|---|
| 1.3 | 자리 없음 | the tubing | per the menu | `the tubing`은 세 청크(동사구·빈도·근거) 어느 자리에도 안 맞음 — `per protocol` 자리의 같은 모양으로 |
| 2.4 | **안전** | A few coughs | A few sighs | `A few coughs … but he tolerated it well` — 비위관 삽입 중 기침은 기도 오삽입 신호인데 잘 견뎠다는 잘못된 안심이 됨 |
| 2.5 | **안전** | on the label | on the whiteboard | `confirm placement on the label` — 관 바깥 눈금·표시로 위치를 확인한다는 말(인정된 확인법 아님, ASPEN 2016 — 엑스레이가 표준) |
| 3.5 | 반대말 | to lie | to eat | `not the most comfortable way to lie, but it keeps you safe` — 누운 자세가 안전하다는 반대 뜻 |
| 5.1 | 되풀이 | as the family arrives | as the sun sets | family 되풀이 |
| 5.3 | 되풀이 | a little sleepy | a little early | sleep 되풀이 |
| 5.4 | 되풀이 | once visitors arrive | once the shift ends | visitor 되풀이 |
| 6.4 | **안전** | and relabel | for the family | `hold the feed for now and relabel in an hour` — 재확인이 빠진 맞는 문장(실패 7 `and sign`). `for now` 자리의 다른 구로 |
| 6.6 | 되풀이 | the visitor name | the room number | visitor 되풀이 |
| 7.0 | 되풀이 | the visitors slowly | the pillows slowly | visitor 되풀이 |
| 7.1 | 되풀이 | , and lunch closely | , and laundry closely | lunch 되풀이 |
| 7.2 | **안전** | this week | too loudly | `before they drop this week` — 보충을 미루는 시각 decoy(실패 7) |
| 7.5 | **안전** | before we leave | and every few rooms | `check his electrolytes before we leave …` — 시작 전 기저 검사가 빠지고 시점이 바뀐 맞는 문장 |
| 7.6 | 되풀이 | his sleep | his posture | sleep 되풀이 |
| 9.1 | 자리 없음 | a ringing bell | for a missing | `a ringing bell`은 끊긴 조각 `for a rising` 자리에 안 맞음 — 같은 모양으로 |
| 9.2 | 되풀이 | to the visitor | to the cafeteria | visitor 되풀이(그리고 `report … to the visitor`는 보고 대상이 의사에서 빠짐) |
| 10.3 | 반대말 | has doubled | has been charted | `urine output has doubled` — 핍뇨 보고가 반대(잘못된 안심) |
| 10.6 | 되풀이 | and sleep pattern | and hair growth | sleep 되풀이 |
| 11.0 | 되풀이 | and sleep needs | and reading needs | sleep 되풀이 |
| 11.5 | 되풀이 | to visit his room | to water his plants | room 되풀이 |
| 12.0 | 되풀이 | the new bed | the new menu | bed 되풀이 |
| 12.6 | 되풀이 | her visitors further | her blinds further | visitor 되풀이 |
| 13.2 | 되풀이 | lunch ready | the TV ready | lunch 되풀이(그리고 흡인 환자 곁에 `lunch ready`) |
| 13.6 | 자리 없음 | in case he sleeps | he wakes | `in case he sleeps`는 두 청크를 합친 모양이라 어느 자리에도 안 맞음 — `he vomits` 자리로 |
| 14.0 | 되풀이 | with a quiet room | with a quiet hallway | room 되풀이 |
| 14.5 | **안전** | a family meeting | a phone number | `I'm holding a family meeting until we get a CT scan` — 급식 보류가 빠진 맞는 문장 |
| 15.3 | 되풀이 | is next to the bed | is next to the sink | bed 되풀이 |
| 15.4 | 자리 없음 | last night | this shift | 저작자 판단 거리 — `He's making … last night` 시제가 안 맞아 문법으로 걸러짐. 같은 시각 자리의 현재 구로(`at lunch`(6.3)·`at noon`(9.3)·`in the room`(18.3)은 마지막 부사 자리에 맞아 통과) |
| 15.6 | 되풀이 | for the visitors | for the elevator | visitor 되풀이 |
| 16.0 | **안전** | all visitors | all the menus | `Hold all visitors and start resuscitation now` — 급식 중단이 빠진 그럴듯한 위기 지시 |
| 16.2 | **안전** | her family | her heart rate | `Let's support her family and get broad antibiotics` — 혈압 지지가 빠진 맞는 문장(위기) |
| 16.6 | 자리 없음 | the cleaning team | to the lobby | `the cleaning team`은 `Get the rapid response team` 자리에 `Get`이 없어 안 맞음 — `here` 자리의 장소 구로(8.6과 같은 값 2회) |
| 17.0 | **안전** | Wake her | Turn the page | `Wake her and suction the airway` — 돌리기가 빠진 그럴듯한 위기 지시 |
| 17.1 | 자리 없음 | the volume | and raise the blinds | `the volume`은 `Stop the feed`·`and raise the oxygen` 어느 자리에도 안 맞음 |
| 17.5 | **안전** | and hold her hand | and fix her hair | `get her sitting up and hold her hand first` — 흡인이 빠진 그럴듯한 위기 지시 |
| 17.6 | 되풀이 | to her family | to her radio | family 되풀이 |
| 18.6 | 되풀이 | his visitors | his slippers | visitor 되풀이 |
| 19.0 | **안전** | the sugar | and the dressing | **`the sugar` — 재영양 위기에 당을 보충하라는 말로 읽힘**, 모양도 `and potassium` 자리에 안 맞음 |
| 19.3 | 되풀이 | and sleep | and his mood | sleep 되풀이 |
| 19.4 | 자리 없음 | a feeding schedule | contagious | 명사구 `a feeding schedule`은 형용사 청크 `severe` 자리에 안 맞음 |
| 19.6 | 되풀이 | his sleep tracker | his phone screen | sleep 되풀이 |

## D. order 새 줄 (10줄, 9장)

| 카드·줄 | 지금 en | 새 en / ko | 문제 |
|---|---|---|---|
| S1.L2 | Those checks include watching his belly for distension. | Those checks include watching her belly for distension. / 그 확인에는 배 팽만을 지켜보는 것도 들어가요 | S1 환자는 she(1.4·1.6·제목 장면) — `his belly`만 남자 |
| S2.L4 | Once that's done, I'll document the position. | Before I lift that hold, I'll document the position. / 그 보류를 풀기 전에 위치를 기록할게요 | 3↔4 교환해도 읽힘(`Once that's done`이 2줄 엑스레이에도 붙음). 3줄의 `hold`를 가리키게 |
| S6.L3 | A prokinetic may help her gut with that. | At that lower rate, a prokinetic may help her gut move the feed. / 그 낮춘 속도에서 촉진제가 장을 도울 수 있어요 | 2↔3 교환해도 읽힘(`with that`이 1줄 위잔여량에도 붙음). 2줄의 줄인 속도를 가리키게 |
| S7.L4 | Because of all this, I'm watching his heart rhythm for refeeding syndrome. | If those levels drop, his rhythm can change, so I'm watching it closely. / 그 수치가 떨어지면 리듬이 바뀔 수 있어서 자세히 지켜봐요 | 3↔4 교환해도 읽힘(`Because of all this`·`Along with that` 둘 다 어디에나 붙음). 3줄 전해질을 가리키게 |
| S9.L4 | I'll chart all of it, including the time. | After that call, I'll chart the value and the time. / 그 보고 뒤에 값과 시간을 기록할게요 | 3↔4 교환해도 읽힘(`all of it`). 3줄 보고를 가리키게 |
| S15.L3 | Surgery is on the way to evaluate him. | Surgery says they're ten minutes away. / 수술팀이 10분 뒤에 도착한대요 | 3↔4 교환해도 읽힘. 4줄을 3줄의 '10분'에 묶음 |
| S15.L4 | I'll give more fluid while we wait for the surgeon. | In those ten minutes, let's optimize his sedation and volume. / 그 10분 동안 진정과 수액 상태를 최적화해요 | **사실** — 복부구획증후군에 '수액을 더'는 WSACS 2013이 경계하는 처치(양의 수액 균형이 복강내압을 올림). 15.2 문장(진정·수액 최적화)으로 |
| S16.L4 | Alongside that, I'm calling surgery for an emergent evaluation. | While that resuscitation runs, I'm calling surgery for an emergent evaluation. / 그 소생술을 하는 동안 응급 평가를 위해 수술팀을 불러요 | 3↔4 교환해도 읽힘(`Alongside that`·`Because of that`). 3줄 소생술을 가리키게 |
| S18.L3 | His potassium and phosphate are both off today. | That insulin can drop his potassium and phosphate, which are already off. / 그 인슐린이 이미 벗어난 칼륨과 인산염을 더 떨어뜨릴 수 있어요 | 2↔3 교환해도 읽힘. 그리고 임상: 인슐린은 칼륨·인산을 세포 안으로 옮겨 더 떨어뜨림 — 3줄을 2줄 인슐린에 묶으면 순서와 이유가 함께 맞음 |
| S19.L4 | Alongside that, replace the phosphate and potassium urgently. | While the rate is down, replace the phosphate and potassium urgently. / 속도를 줄인 동안 인산염과 칼륨을 긴급하게 보충해요 | 3↔4 교환해도 읽힘(`Alongside that`). 3줄 속도 감소를 가리키게 |

## E. 아이콘 (9곳)

| 곳 | 지금 → 새 | 이유 |
|---|---|---|
| 5.4 | chartup → monitor | 떨어지는 수치에 `chartup`(방향 반대) |
| 10.3 | chartup → monitor | 소변량 감소 |
| 12.3 | chartup → monitor | 위잔여량 감소 |
| 15.4 | chartup → siren | 위기의 무뇨 |
| 19.3 | chartup → siren | 위기의 바닥 수치 |
| S10.L1 | chartup → monitor | 소변량 감소 |
| S12.L3 | chartup → monitor | 위잔여량 감소 |
| S19.L1 | chartup → siren | 바닥 수치 |
| 3.4 | chevronUp → gear | `chevronUp`은 UI 글리프(이 주제 말고는 문장 아이콘으로 쓴 곳이 없음 — brain-death `chevronDown`과 같은 판단) |

## F. why 새 값 (4문장)

| 문장 | 지금 | 새 값 |
|---|---|---|
| 1.6 | Call me if…로 판단을 미루지 말고 보이는 즉시 부르라고 안내해요. 보호자는 눈에 띄는 변화만 전하면 돼요. | Call me if…로 판단을 미루지 말고 보이는 즉시 부르라고 동료에게 맡겨요. 두 증상을 or로 묶어 하나만 보여도 부르면 된다고 알려요. |
| 2.0 | Let's로 환자와 함께 하는 확인처럼 말하고, before anything goes로 무엇이든 위치 확인 뒤에만 들어간다는 순서를 못 박아요. | Let's로 동료와 함께 하는 확인처럼 말하고, before anything goes로 무엇이든 위치 확인 뒤에만 들어간다는 순서를 못 박아요. |
| 5.4 | can drop은 반드시가 아니라 가능성을 말해요. once는 급식이 시작되는 시점에 맞춰 일어난다는 뜻이에요. | can drop은 반드시가 아니라 가능성을 말해요. once는 '일단 시작되면'이라는 뜻으로, 급식을 시작한 뒤 며칠 사이에 떨어질 수 있다는 경고예요. |
| 8.4 | on schedule은 상태와 상관없이 정해진 간격에 맞춰 교체한다는 뜻이에요. to lower infection risk로 교체하는 목적을 붙여요. | on schedule은 정해진 간격(투명 드레싱은 보통 7일)에 맞춰 교체한다는 뜻이에요. 젖거나 들뜨거나 더러워지면 그보다 일찍 갈아요. to lower infection risk로 목적을 붙여요. |

## 종합
고칠 것 **195건**(A 73 · B 58 · C 41 · D 10줄/9장 · E 9 · F 4) — 그중 **안전 69**(distractorsKo 54 · decoy 13 · 빈칸 1 · order 1), **정답 둘 30**(distractorsKo 18 · 빈칸 12). 새 값을 넣고 `revB_icu-nutrition_chk.py new`가 지금처럼 깨끗하면 내보내도 됩니다. 15.6·13.4 문장 `en`의 사실 문제는 사용자 판단으로 넘깁니다.
