# B 검토 — or-massive-transfusion (v46 1~6·8, distractorsKo ①~⑥·되풀이 상한)

대상: `or-massive-transfusion.yaml`(A·B 합친 파일), 문장 126 · order 21장 전수. 검사기는 통과(`==> 통과`, 경고 0)지만 아래는 기계가 못 보는 것.
뽑은 표: `_reviewB_or-massive-transfusion_sent.txt`(en|ko|오답 둘|why) · `_blank.txt`(빈칸 네 줄) · `_decoy.txt`(decoy 자리마다 넣어 읽기) · `_order.txt`(인접 교환 3개).
스크립트: `_reviewB_or-massive-transfusion_dump.py`·`_count.py`·`_proposal.py`(새 distractorsKo 길이·W19 어간 재계산)·`_blankfix.py`(새 빈칸 오답 W18 재계산).

## 항목별 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 대체로 말하는 방식(어순·조동사·Let's)을 설명하고 사실 오류 없음. "못 박아요"가 20번 넘게 되풀이되고 6-4 call for 설명이 과함(1건). |
| 2 빈칸 | 2 | 126문장 중 74문장 고침. S11~S20은 거의 전부 동떨어진 오답(poster·plate·sticker·language·oven·yawning·dental…), 정답 둘 7건, 관사·문법으로 걸러지는 것 3건. |
| 3 decoy | 3 | 61/126이 장소·전치사구. 어느 청크 자리에도 안 맞는 것 10건, 정답 둘 3건, 위험 조립 2건(freezer plasma, overnight). |
| 4 distractorsKo | 1 | **59문장이 오답 둘 다 "~려고/~러/~도록" 목적절**(102회 + 러 13 + 도록 11) — 어간 두 글자 W19 검사가 못 봄. 위기 문장 24개는 오답 둘 다 "X는 ~예요" 교과서 사실로 틀을 버림. 안전 9건. |
| 5 order | 3 | 21장 중 7장에서 인접 교환이 자연스럽거나(S3·S7·S8·S17·S18·S20) 대화 논리가 깨짐(S10). |
| 6 tag·icon | 4 | 태그·아이콘 일관. 10-1 태그 1건. |
| 8 파일럿 갈래 | 2 | 동떨어진 빈칸 오답·re-○○ 오답 묶음 되풀이(recheck 정답 9문장에 rewrap/retire/reboot/rename…)가 파일럿 2번 그대로. order 임상 순서는 맞음. |

## 세어 본 것
- **오답 둘에만 조건·목적 표지가 붙은 문장: 60** — 목적절 둘 59(0-1 0-2 1-0 1-1 1-3 1-4 2-0 2-3 2-4 3-0 3-2 3-5 4-1 4-2 4-4 5-0 5-1 5-2 5-5 6-0 6-2 6-4 7-2 7-3 7-5 8-1 8-2 8-3 8-4 9-0 9-2 9-4 9-5 10-4 10-5 11-0 11-2 11-4 12-2 12-4 13-0 13-2 13-5 14-0 14-1 14-2 14-4 14-5 15-4 16-1 16-4 17-2 17-5 18-4 18-5 19-4 19-5 20-2 20-4) + 조건절 둘 1(18-2). 형태를 바꿔 상한을 피함: "확인하려고/짚으려고/보내려고…"는 어간이 앞 두 글자라 W19 표에 "려고"가 한 번도 안 잡힘. 실제 오답 전용 어미 빈도는 려고 102 · 러 13 · 도록 11 · 위해 1(주제 252개 오답 중 127개).
- **오답 둘 다 틀을 버린 일반 사실("X는 ~예요")**: 24문장(9-1 9-3 10-1 10-3 12-1 14-3 15-0 15-1 15-2 15-5 16-0 16-2 17-0 17-1 17-3 18-0 18-1 18-3 19-1 19-2 19-3 20-0 20-1 20-3).
- 제안값으로 바꾼 뒤: 목적절 오답은 문장당 많아야 하나(74개, 둘 다인 문장 0), 오답 전용 어간 최대 5(봐요·나와·기록·번호·넣으·다시), 길이 V20 위반 0, 모든 문장에서 오답 하나는 정답 길이 이하(`_proposal.py`로 확인).
- **decoy 모양**: 장소·전치사구 61/126. 낱말 몰림: after this ○○ 6(shift·call·meeting·alarm·page·scan), room 4, tray·pump·cooler·bedside·pole·cuff·lab 각 3 — W18(같은 decoy 4회) 미만이지만 "after this ○○" 틀은 낱말만 보고 걸러짐.
- 빈칸 오답 최다(현재): weigh·bed·room·height·language·empty·steady·schedule·crate·saline·albumin·high·late·paint·badge 각 3. 제안값 반영 후 4회 이상 0.

## 저작자가 판정을 부탁한 곳
1. **정답 동사를 종속절에 남긴 앞 단계 틀이 오답 둘에 다 쓰였는가** — 예, 59문장. 하나만이면 통과지만 둘 다면 모양으로 걸러지니 전부 실패. 하나는 남기고 다른 하나를 아래 표 값으로(비위기: 정답 ko 한 군데 바꾸기, 위기: 참인 이유·뒤 단계).
2. **15-0·18-1·20-1 참인 사실 오답** — 실패. 셋 다 오답 둘이 모두 "TRALI는/TACO는 ~예요"·"반응이 줄어요"로 멈추기·늦추기를 뺀 같은 모양(위기 문장인데 행동을 비움). 15-0 O2 "반응이 곧 줄어요"는 **잘못된 안심**. 새 값: 하나는 앞 단계(정답 동사를 종속절에), 하나는 참인 이유 — 아래 표.
3. **16-1 오답 둘 다 정답보다 김, 빈칸을 insulin으로 옮긴 것** — 오답: 둘 다 목적절+둘 다 김 → 실패. O1 "칼슘, 인슐린, 포도당 주려고 약 읽어요"(앞 단계) 유지, O2 → "칼슘은 먼저 심근을 안정시켜요"(참인 이유, 13자 ≤ 15). 빈칸 insulin 이동은 **통과**(saline·oxygen·albumin은 같은 분야의 틀린 말, bicarbonate·albuterol은 없어 정답 둘 아님).
4. **동떨어진 빈칸 오답(poster·plate·sticker·language·oven 등)** — 실패. 위기 문장에서 약·검사를 피한 것은 옳지만, 대신 같은 분야의 틀린 사물(OR 장비·서류: cautery·irrigation·drape·tag·slip·cooler 등)로. 74문장 새 값은 아래 표.
5. **"혈소판도 실온에 보관해요"(10-3 O2) — 정답 둘인가** — 정답 둘은 아님(뜻이 다름). 그러나 en "We're running low on platelets too."에 들리는 자리가 없고(③), O1과 함께 둘 다 보관 사실이라 모양으로 걸러짐 → O2를 "혈소판도 오는 중이에요"로.

## 심각한 문제
1. **distractorsKo 모양 붕괴(84문장)** — 목적절 둘 59 + 조건 둘 1 + 일반 사실 둘 24. 듣지 않고 "~려고 ~해요"나 "~는 ~예요"가 아닌 쪽을 고르면 맞음. 앞 단계 틀을 문장마다 두 번 쓴 것이 근본 원인.
2. **안전(9)** — 15-0(잘못된 안심), 15-1·16-2·17-3·18-1·20-1(위기 문장 오답 둘 다 행동을 빼고 정의만), 12-2·18-4·20-4(두 행동 문장에서 첫 행동 — 혈장 투여·이 제제 멈추기·속도 늦추기 — 을 빼고 둘째 행동 준비만: 그 순간 대신 하는 일).
3. **decoy 위험 조립(2)** — 9-0 `from the freezer` → "give plasma from the freezer"(해동 안 한 혈장), 19-1 `overnight` → 응급 O형 방출을 밤새로 늦춤.
4. **빈칸 정답 둘(7)** — 0-4 slip, 1-0 phone, 7-3 resend, 8-5 infection, 10-0 O-pos, 10-2 closed, 19-3 O-positive.
5. **S10 order** — 1줄에서 이미 혈액은행과 통화 중인데 3줄이 "혈액은행에 전화하자", O형 음성 수량에서 혈장 필요로 넘어감 — 대화가 성립하지 않음.

## 고칠 것

### A. distractorsKo — 87문장 (안전 9 · 정답 둘 4)
바꾸지 않은 쪽은 그대로 둡니다. 새 값은 V20 길이·"하나는 정답 길이 이하"·W19 어간 상한(5)을 스크립트로 확인했습니다.

| 문장 | 정답 ko | 바꿀 것 | 이유 |
|---|---|---|---|
| 0-1 | 제제 단위를 처방과 대조해 봅시다. | O2 "처방과 대조하러 장갑을 껴요." → **"제제 단위를 처방 옆에 놓아 봅시다."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 0-2 | 제제 종류를 소리 내어 확인할게요. | O2 "소리 내어 확인하러 손을 씻어요." → **"제제 종류를 소리 내어 물어볼게요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 1-0 | 제제 번호와 혈액형을 함께 대조 확인합시다. | O2 "함께 대조 확인하러 마스크를 씁시다." → **"제제 번호와 혈액형이 맞아야 수혈해요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 1-1 | 환자 이름과 신원이 제제와 일치하나요? | O2 "이름과 신원 맞는지 보도록 장갑 낄까요?" → **"환자 이름과 신원이 팔찌에 적혀 있나요?"** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 1-3 | 환자의 생년월일을 소리 내어 읽을게요. | O2 "소리 내어 읽도록 안경을 쓸게요." → **"환자의 생년월일을 소리 내어 물어볼게요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 1-4 | 수혈하기 전에 유효기한을 확인하세요. | O2 "유효기한을 확인하도록 불을 켜세요." → **"유효기한이 지나면 쓸 수 없어요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 2-0 | 이걸 가온기를 거치게 합시다. | O2 "거치게 하려고 호스를 폅시다." → **"가온기가 피를 데워 줘요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 2-3 | 지금부터 모든 제제는 가온기를 거칩니다. | O2 "모든 제제는 가온기를 거치려고 나와요." → **"지금부터 모든 수액도 가온기를 거칩니다."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 2-4 | 가온기의 온도 설정을 확인합시다. | O2 "설정 확인하러 전원 꽂읍시다." → **"온도가 맞아야 피가 데워져요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 3-0 | 환자의 혈압에 맞춰 주입 속도를 조정합시다. | O2 "혈압에 맞춰 속도를 조정하러 펌프를 봅시다." → **"환자의 혈압이 주입 속도의 기준이에요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 3-2 | 주입되는 동안 반응을 지켜볼게요. | O2 "반응 지켜보려고 기준값 볼게요." → **"반응은 대개 주입 초반에 나와요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 3-5 | 오 분 뒤에 혈압을 다시 확인할게요. | O2 "다시 확인하려고 커프 볼게요." → **"오 분이면 속도 조정 효과가 나와요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 4-1 | 각각을 처방과 대조해 확인합시다. | O2 "대조해 확인하러 쿨러를 열어요." → **"처방과 대조하면 실수를 막아요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 4-2 | 제가 서명하고 시각을 기록할게요. | O2 "서명하도록 팩 수를 세어 볼게요." → **"제가 서명하고 팩 수를 기록할게요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 4-4 | 제제 번호를 배송 전표와 대조합시다. | O2 "전표와 대조하도록 팩을 모아 둬요." → **"전표와 맞춰야 빠진 팩을 알아요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 4-5 | 남은 제제는 지금 쿨러에 보관할게요. | O1 "남은 포장지는 지금 쓰레기통에 버릴게요." → **"남은 거즈는 지금 카트에 보관할게요."** | O1이 세 군데(제제→포장지, 쿨러→쓰레기통, 보관→버리기)를 바꿈 — ① |
| 5-0 | 시작하기 전에 기준 활력징후를 기록합시다. | O2 "기준 활력징후를 기록하도록 모니터를 켜요." → **"기준 활력징후를 알아야 반응을 알아봐요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 5-1 | 십오 분마다 활력징후를 기록할게요. | O2 "기록하러 차트 종이를 꺼낼게요." → **"십오 분마다 활력징후를 읽어 줄게요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 5-2 | 주입 중에 변화가 있는지 지켜보세요. | O1 "변화 지켜보려고 자리 잡으세요." → **"변화를 일찍 보면 반응을 빨리 막아요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 5-5 | 뭔가 바뀌면 바로 알릴게요. | O1 "알리려고 메모할게요." → **"작은 변화도 중요한 신호예요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 6-0 | 적혈구, 혈장, 혈소판을 1대1대1 비율로 맞춥시다. | O2 "적혈구, 혈장, 혈소판을 1대1대1 비율로 맞추러 표를 펴요." → **"적혈구, 혈장, 혈소판 1대1대1은 출혈을 줄여요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 6-2 | 지금까지 준 것을 추적할게요. | O2 "준 것을 추적하러 펜을 챙길게요." → **"지금까지 받은 것을 추적할게요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 6-4 | 지금 다음 쿨러를 요청할게요. | O2 "요청하러 전화기로 가요." → **"지금 다음 쿨러를 받아 둘게요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 7-2 | 칼슘을 주고 다시 확인합시다. | O1 "칼슘 주려고 앰풀 확인합시다." → **"칼슘을 주면 혈압이 올라요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 7-3 | 십 분 뒤에 수치를 다시 확인할게요. | O1 "다시 확인하려고 채혈할게요." → **"십 분이면 칼슘이 수치에 반영돼요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 7-5 | 한 번 더 주고 다시 확인합시다. | O1 "더 놓으려고 손 씻읍시다." → **"한 번 더 주면 칼슘이 올라요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 8-1 | 모든 수액을 데우고 온풍 담요를 씁시다. | O2 "온풍 담요를 쓰려고 전원을 꽂읍시다." → **"모든 수액을 데우면 체온이 지켜져요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 8-2 | 실내 온도를 올릴게요. | O2 "올리러 갈게요." → **"방을 데우면 덜 식어요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 8-3 | 수술 내내 담요를 계속 틀어 둡시다. | O2 "담요 틀어 두려고 코드 살핍시다." → **"수술 내내 수액을 계속 데워 둡시다."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 8-4 | 십 분마다 체온을 다시 확인할게요. | O2 "확인하려고 알람 맞출게요." → **"자주 재야 변화를 놓치지 않아요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 9-0 | 적혈구와 함께 혈장을 줍시다. | O1 "혈장 주려고 해동을 확인합시다." → **"혈장을 같이 주면 피가 잘 굳어요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 9-1 | 비율상 다음은 혈소판이에요. | O1 "비율에는 혈소판도 포함돼요." → **"다음 혈소판은 오는 중이에요."** / O2 "혈소판은 비율의 한 축이에요." → **"혈소판 비율은 표에 적혔어요."** | **정답 둘** 둘 다 "혈소판이 비율에 든다"로 정답과 뜻이 겹침 |
| 9-2 | 투여 순서를 균형 있게 유지할게요. | O1 "균형 맞추려고 표를 만들게요." → **"순서가 쏠리면 피가 묽어져요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 9-3 | 적혈구만 주고 혈장은 안 주면 안 돼요. | O1 "적혈구만 주면 피가 묽어질 수 있어요." → **"적혈구만 데우고 혈장은 안 데우면 안 돼요."** / O2 "적혈구만 주면 응고가 떨어져요." → **"적혈구만 세고 혈장은 안 세면 안 돼요."** | **정답 둘** 둘 다 같은 경고의 참인 이유(피가 묽어짐·응고 저하) — 정답 둘 |
| 9-4 | 이번 쿨러 이후 비율을 확인합시다. | O1 "비율 확인하려고 수치 모읍시다." → **"쿨러마다 봐야 비율이 맞아요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 9-5 | 혈소판은 도착하는 대로 바로 줍니다. | O1 "도착하면 주려고 팩을 닦아요." → **"혈소판은 실온에서 흔들며 보관해요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 10-1 | 곧 혈장이 더 필요할 수도 있어요. | O1 "혈장은 해동에 시간이 걸릴 수 있어요." → **"곧 혈장이 더 도착할 수도 있어요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 10-3 | 혈소판도 부족해지고 있어요. | O2 "혈소판도 실온에 보관해요." → **"혈소판도 오는 중이에요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 10-4 | 혈액은행에 전화해서 상황을 알아봅시다. | O2 "혈액은행에 전화하려고 수화기를 듭시다." → **"혈액은행에 전화해서 쿨러를 부탁합시다."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 10-5 | 다음 쿨러가 도착하면 바로 알려 드릴게요. | O2 "도착하면 알려 드리려고 문을 열어 둘게요." → **"다음 쿨러가 도착하면 바로 서명할게요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 11-0 | 발열, 저혈압, 스며 나오는 출혈을 지켜보세요. | O2 "발열, 저혈압, 출혈을 지켜보도록 알람 맞추세요." → **"발열, 저혈압, 출혈은 수혈 반응의 징후예요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 11-1 | 소변 색깔에 변화가 있나요? | O1 "소변 색깔이 어떤가요?" → **"소변 양에 변화가 있나요?"** | **정답 둘** O1 "소변 색깔이 어떤가요?"는 같은 질문 — 정답 둘 |
| 11-2 | 활력징후가 바뀌면 즉시 알려 주세요. | O2 "바뀌면 알리려고 메모지를 쥐세요." → **"활력징후 변화는 첫 신호예요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 11-4 | 소변 색깔을 자세히 지켜봅시다. | O2 "색깔을 지켜보려고 주머니 비웁시다." → **"소변이 붉으면 용혈을 의심해요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 12-1 | 응고인자가 희석되고 있을 수 있어요. | O1 "응고인자는 간에서 만들어져요." → **"응고인자 결과가 늦어지고 있을 수 있어요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 12-2 | 혈장을 더 주고 응고검사를 확인합시다. | O2 "응고검사를 확인하려고 주사기를 꺼냅시다." → **"더 준 혈장이 응고인자를 채워 줘요."** | **안전** O2가 혈장 투여를 빼고 검사 준비만(그 순간 대신 하는 일); 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 12-3 | 외과의가 수술 부위가 축축해 보인다고 해요. | O1 "외과의가 수술 부위가 축축해서 걱정한다고 해요." → **"외과의가 수술 부위가 좁아 보인다고 해요."** | **정답 둘** O1 정답(축축해 보임)에 "걱정"을 더함 — 정답 둘 |
| 12-4 | 이번 혈장 이후 응고검사를 다시 보냅시다. | O1 "응고검사를 다시 보내려고 채혈관을 꺼냅시다." → **"응고검사는 결과가 나오기까지 시간이 걸려요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 13-0 | 동맥혈 가스검사를 합시다. | O2 "검사하려고 손을 씻읍시다." → **"가스검사로 산증을 봐요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 13-2 | 산증을 교정해야 해요. | O1 "교정하려고 봅시다." → **"산증은 응고를 해쳐요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 13-5 | 수치를 팀에 보고할게요. | O2 "보고하려고 종이를 꺼낼게요." → **"수치로 팀이 처치를 정해요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 14-0 | 지금 응고검사와 피브리노겐을 다시 채취합시다. | O2 "피브리노겐을 다시 채취하려고 라벨을 붙입시다." → **"응고검사와 피브리노겐으로 다음 제제를 정해요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 14-1 | 최신 결과에 따라 제제 용량을 정할게요. | O2 "용량을 정하려고 결과표를 펼게요." → **"최신 결과는 몇 분 사이에도 바뀌어요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 14-2 | 즉시 검사를 보내고 추이를 추적할게요. | O1 "즉시 보내려고 검체 라벨 붙일게요." → **"즉시 검사를 보내야 결과를 빨리 받아요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 14-3 | 피브리노겐도 낮아지고 있어요. | O1 "피브리노겐도 검사에 포함돼요." → **"피브리노겐도 다시 보내고 있어요."** / O2 "피브리노겐도 채혈관에 담겨요." → **"피브리노겐도 결과가 나왔어요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 14-4 | 한 시간 뒤에 응고검사를 다시 보냅시다. | O2 "응고검사 보내려고 라벨 뽑읍시다." → **"한 시간 뒤면 투여 효과가 응고검사에 나와요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 14-5 | 이 결과에 따라 다음 제제 용량을 정합시다. | O2 "다음 제제 용량을 정하려고 이 결과를 모읍시다." → **"이 결과로 용량을 정하면 과다 투여를 막아요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 15-0 | 즉시 수혈을 멈추세요. | O1 "수혈을 멈추면 반응이 줄어요." → **"멈춰야 용혈이 덜해요."** / O2 "반응이 곧 줄어요." → **"멈추려고 클램프를 잡으세요."** | **안전** O2 "반응이 곧 줄어요" 잘못된 안심 + 둘 다 멈추기를 뺌 |
| 15-1 | 발열, 저혈압, 짙은 소변—용혈을 의심하세요. | O1 "발열, 저혈압, 짙은 소변은 수혈 중에 나타나요." → **"발열, 저혈압, 짙은 소변은 용혈 때 나타나요."** / O2 "발열, 저혈압, 짙은 소변은 갑자기 나타나기도 해요." → **"발열, 저혈압, 짙은 소변—용혈을 보려고 소변을 받으세요."** | **안전** 둘 다 의심(판단)을 빼고 일반 사실만 |
| 15-2 | 생리식염수로 정맥주사 라인을 유지하고 혈액은행에 전화하세요. | O2 "생리식염수는 정맥주사 라인이 막히지 않도록 해 주는 거예요." → **"생리식염수로 라인을 유지하고 혈액은행에 전화하려고 번호를 찾으세요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 15-4 | 지금 바로 혈액은행에 전화합시다. | O1 "전화하려고 수화기를 듭시다." → **"알리면 검사가 바로 시작돼요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 15-5 | 생리식염수를 계속 흘리며 자세히 지켜볼게요. | O1 "생리식염수가 계속 흐르면 줄이 열린 채예요." → **"생리식염수를 계속 흘리려고 수액을 더 걸게요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 16-0 | 칼륨이 7.2이고 T파가 뾰족해요. | O1 "칼륨 수치는 피검사에 나와요." → **"칼륨이 7.2라고 검사실에서 전화 왔어요."** / O2 "T파는 심전도에서 보이는 파형이에요." → **"T파는 심전도의 파형이에요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 16-1 | 칼슘, 인슐린, 포도당을 줍시다. | O1 "칼슘 인슐린 포도당 쓰려고 약 읽어요." → **"칼슘, 인슐린, 포도당 주려고 약 읽어요."** / O2 "칼슘 인슐린 포도당 놓으려고 약 살펴요." → **"칼슘은 먼저 심근을 안정시켜요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐; 둘 다 정답보다 김 |
| 16-2 | 심장 리듬을 지켜보세요. 빠르게 악화될 수 있어요. | O1 "심장 리듬은 화면에 계속 나오는 파형이에요." → **"리듬을 보려고 화면을 키우세요. 빠르게 악화될 수 있어요."** / O2 "심장 리듬은 심전도로 보는 대표적인 파형이에요." → **"칼륨이 높으면 심장 리듬이 빠르게 나빠져요."** | **안전** 둘 다 리듬 감시를 빼고 교과서 정의만 |
| 16-4 | 이번 투여 후 칼륨을 다시 확인합시다. | O1 "칼륨 다시 보려고 주사기 쥡시다." → **"인슐린 뒤엔 칼륨이 내려가야 해요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 17-0 | 이온화 칼슘이 위험할 정도로 낮아요. | O1 "이온화 칼슘은 피 속 칼슘의 한 형태예요." → **"이온화 칼슘이 위험할 만큼 늦게 나왔어요."** / O2 "이온화 칼슘은 가스검사기로 재요." → **"이온화 칼슘이 방금 다시 나왔어요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 17-1 | 시트르산 부하가 심장 기능을 저하시키고 있어요. | O1 "시트르산은 보관한 피가 굳지 않게 하는 성분이에요." → **"시트르산 부하가 칼슘 수치를 떨어뜨리고 있어요."** / O2 "시트르산 부하는 빠르게 쌓일 때 생겨요." → **"시트르산 부하가 혈액이 굳는 것을 막고 있어요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 17-2 | 칼슘을 밀어 넣고 즉시 다시 확인하세요. | O2 "칼슘을 밀어 주입하려고 주사기를 잡으세요." → **"칼슘이 들어가면 수축력이 바로 나아져요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 17-3 | 지금 당장 라인으로 칼슘이 필요해요. | O1 "칼슘은 라인으로 들어가는 약이에요." → **"지금 당장 칼슘을 주려고 라인을 확인해요."** / O2 "칼슘은 정맥으로 주는 약이에요." → **"지금 칼슘이 들어가야 심장이 버텨요."** | **안전** 둘 다 지금 칼슘 투여를 빼고 정의만 |
| 17-5 | 오 분 뒤에 칼슘을 다시 확인합시다. | O1 "다시 확인하려고 솜을 챙깁시다." → **"오 분 뒤 수치가 다음 용량을 정해요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 18-0 | 산소포화도가 떨어지고 새로운 폐부종이 생겼어요. | O1 "산소포화도는 손가락 센서로 재고 폐는 소리로 봐요." → **"산소포화도가 떨어지고 새로운 알람이 울려요."** / O2 "산소포화도는 센서에 계속 뜨고 폐 소리는 청진으로 판단해요." → **"산소포화도가 떨어지고 새로운 제제가 걸렸어요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 18-1 | 수혈을 멈추세요. TRALI일 수 있어요. | O1 "TRALI는 수혈 중이나 직후에 생겨요." → **"멈추려고 줄을 잡으세요. TRALI일 수 있어요."** / O2 "TRALI는 폐에 물이 차는 반응이에요." → **"수혈을 멈추면 원인 제제가 더 안 들어가요."** | **안전** 둘 다 멈추기를 빼고 TRALI 정의만 |
| 18-2 | 환기를 지지하고 보고합시다. | O2 "보고하면 팀이 함께 알아요." → **"지지하려고 백을 잡읍시다."** | 둘 다 조건절(~하면) 이유 — 모양으로 걸러짐 |
| 18-3 | 양쪽 폐가 축축한 소리가 나요. | O1 "양쪽 폐 소리는 청진기로 청취해요." → **"한쪽 폐가 축축한 소리가 나요."** / O2 "양쪽 폐는 가슴 안에 자리해요." → **"양쪽 폐가 청진기로 잘 들려요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 18-4 | 이 제제를 멈추고 마취과를 부릅시다. | O1 "마취과 부르려고 수화기 듭시다." → **"제제를 멈추려고 클램프를 잠급시다."** / O2 "마취과를 부르려고 번호를 누릅시다." → **"TRALI면 마취과가 환기를 맡아요."** | **안전** 둘 다 이 제제 멈추기를 빼고 전화 준비만; 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 18-5 | 이 반응을 즉시 보고할게요. | O2 "보고하려고 순서 세울게요." → **"이 반응은 6시간 안에 생겨요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 19-1 | 응급 O형 음성을 방출해 줄 수 있나요? | O1 "응급 O형 음성은 교차시험 없이 써요." → **"응급 O형 음성이 몇 단위 남았나요?"** / O2 "응급 O형 음성은 혈액형을 모를 때 써요." → **"응급 O형 음성은 어디서 받아 가나요?"** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 19-2 | 지역 혈액 요청을 발동해야 할까요? | O1 "지역 혈액 요청은 혈액은행이 처리해요." → **"지역 혈액 요청을 누가 맡아야 할까요?"** / O2 "지역 혈액 요청은 시간이 걸려요." → **"지역 혈액 요청 양식이 어디 있나요?"** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 19-3 | O형 음성이 두 단위밖에 안 남았어요. | O1 "O형 음성은 응급용으로 두는 혈액이에요." → **"O형 음성이 두 단위 더 도착했어요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 19-4 | 지금 응급 방출을 발동합시다. | O2 "발동하려고 서류 폅시다." → **"응급 방출은 교차시험 없어요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 19-5 | 지역 혈액은행에 전화할게요. | O2 "전화하려고 연락처 열게요." → **"지역 혈액은행은 멀어 오래 걸려요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 20-0 | 정맥압과 부종이 올라가고 있어요. | O1 "정맥압은 중심정맥 라인으로 재요." → **"정맥압과 부종이 기록돼 있어요."** / O2 "부종은 피부를 눌러서 살펴요." → **"정맥압과 부종을 다시 재고 있어요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 20-1 | 수혈 속도를 늦추세요. TACO 같아요. | O1 "TACO는 수혈이 너무 빠를 때 흔해요." → **"늦추려고 펌프를 잡으세요. TACO 같아요."** / O2 "TACO는 폐에 물이 고이는 순환 과부하예요." → **"수혈 속도를 늦추면 심장 부담이 줄어요."** | **안전** 둘 다 늦추기를 빼고 TACO 정의만 |
| 20-2 | 이뇨제를 주고 다시 평가합시다. | O2 "이뇨제를 놓으려고 장갑 낍시다." → **"이뇨제를 주면 폐의 물이 빠져요."** | 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |
| 20-3 | 폐가 다시 축축한 소리가 나요. | O1 "폐 소리는 청진기로 다시 들어요." → **"폐가 처음으로 축축한 소리가 나요."** / O2 "폐는 다시 확인할 대상이에요." → **"폐가 다시 청진기로 잘 들려요."** | 둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐 |
| 20-4 | 속도를 늦추고 혈압을 다시 확인합시다. | O2 "혈압을 다시 확인하려고 커프를 감읍시다." → **"수혈 속도를 늦추면 폐에 물이 덜 차요."** | **안전** O2가 늦추기를 빼고 혈압 재기 준비만; 둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐 |

### B. 빈칸 — 74문장 (정답 둘 7)
| 문장 | en | 정답 | 지금 오답 | 새 값 | 이유 |
|---|---|---|---|---|---|
| 0-1 | Let's check the unit against the order. | order | clock, map, scale | answer **order** + **schedule, invoice, receipt** | clock/map/scale 동떨어짐(8번) |
| 0-3 | Can you read the unit number to me? | number | color, shape, size | answer **number** + **price, cost, count** | color/shape/size 동떨어짐 — unit ___ 복합어 자리의 틀린 말로 |
| 0-4 | The blood type on the label matches the order. | label | tray, rack, slip | answer **label** + **tray, rack, box** | **정답 둘** slip — 혈액은행 발급 전표·태그에도 혈액형이 있어 맞는 말(4-4 정답도 delivery slip) |
| 1-0 | Let's verify the unit number and blood type together. | unit | bed, room, phone | answer **unit** + **bed, room, case** | **정답 둘 위험** phone number — 파일럿 2번: 식별자인 phone number |
| 1-4 | Confirm the expiration date before we transfuse. | expiration | billing, invoice, holiday | answer **expiration** + **billing, surgery, admission** | holiday 동떨어짐 |
| 2-0 | Let's route this through the warmer. | warmer | freezer, sink, scale | answer **warmer** + **freezer, cooler, suction** | sink/scale 동떨어짐 |
| 2-1 | Cold blood can drop the patient's temperature. | temperature | height, weight, language | answer **temperature** + **sodium, hemoglobin, weight** | language·height 동떨어짐(language 주제 3회) |
| 2-3 | Every unit goes through the warmer from now on. | unit | cart, tray, chair | answer **unit** + **cart, tray, sample** | chair 동떨어짐 |
| 2-4 | Let's check the warmer's temperature setting. | temperature | speed, brightness, language | answer **temperature** + **speed, brightness, timer** | language 동떨어짐 |
| 3-0 | Let's adjust the rate to the patient's pressure. | rate | light, chair, sheet | answer **rate** + **warmer, suction, dressing** | light/chair/sheet 동떨어짐 |
| 3-5 | I'll recheck the pressure in five minutes. | pressure | cooler, ticket, schedule | answer **pressure** + **tag, slip, cart** | ticket/schedule 동떨어짐 |
| 4-5 | I'll store the extra units in the cooler for now. | cooler | freezer, oven, closet | answer **cooler** + **freezer, drawer, closet** | oven 동떨어짐 |
| 5-1 | I'll chart vitals every fifteen minutes. | vitals | weight, height, mood | answer **vitals** + **weight, height, allergies** | mood 동떨어짐 |
| 5-2 | Watch for any change during infusion. | change | noise, smell, visitor | answer **change** + **noise, smell, delay** | visitor 동떨어짐 |
| 5-3 | The vitals look stable after this unit. | stable | worse, odd, messy | answer **stable** + **worse, odd, mixed** | messy 동떨어짐 |
| 5-4 | Let's record the temperature at each check. | temperature | height, age, language | answer **temperature** + **height, allergy, diet** | age·language 동떨어짐 |
| 6-2 | I'll track what's been given so far. | given | spilled, broken, painted | answer **given** + **spilled, broken, ordered** | painted 동떨어짐 |
| 6-5 | We're staying close to the 1:1:1 ratio. | ratio | clock, wall, crowd | answer **ratio** + **label, schedule, budget** | clock/wall/crowd 동떨어짐 |
| 7-1 | Citrate from the blood is binding calcium. | calcium | sodium, chloride, insulin | answer **calcium** + **sodium, chloride, potassium** | insulin — 저칼슘 장면에 약 이름 선택지(브리프 "이어진 검토" insulin 사례) |
| 7-3 | We'll recheck the level in ten minutes. | recheck | resend, reset, retype | answer **recheck** + **reset, relabel, restock** | **정답 둘** resend the level = 검사를 다시 보냄(재확인과 같은 뜻) |
| 7-4 | Low calcium can weaken the heart. | heart | skin, hair, nail | answer **heart** + **liver, lungs, kidneys** | skin/hair/nail 동떨어짐 |
| 7-5 | Let's give another dose and check again. | dose | shift, visit, form | answer **dose** + **sample, tube, slip** | shift/visit/form 동떨어짐 |
| 8-0 | The temperature is dropping to 35. | dropping | rising, holding, spiking | answer **dropping** + **rising, settling, spiking** | holding to 35 — 전치사로 걸러짐(holding at) |
| 8-2 | I'll raise the room temperature. | raise | lower, dust, paint | answer **raise** + **lower, check, record** | dust/paint 동떨어짐 |
| 8-4 | We'll recheck the temperature every ten minutes. | temperature | ticket, menu, schedule | answer **temperature** + **drape, tag, form** | ticket/menu/schedule 동떨어짐 |
| 8-5 | Warm fluids help prevent hypothermia. | hypothermia | fever, allergy, infection | answer **hypothermia** + **fever, allergy, edema** | **정답 둘** infection — 정상체온 유지가 수술 부위 감염을 줄이는 것은 참 |
| 9-2 | I'll keep the sequence balanced. | balanced | reversed, erased, hidden | answer **balanced** + **uneven, random, reversed** | erased/hidden 동떨어짐 |
| 9-4 | Let's check the ratio after this cooler. | ratio | lid, wheel, handle | answer **ratio** + **strap, seal, lid** | wheel/handle 동떨어짐 |
| 10-0 | How many units of O-neg do you have left? | O-neg | O-pos, B-pos, A-neg | answer **O-neg** + **AB-pos, B-pos, A-neg** | **정답 둘** O-pos — 남성·폐경 후 여성 응급 수혈에 실제로 쓰는 제제라 재고 문의로 맞음 |
| 10-1 | We may need more plasma soon. | more | less, no, any | answer **more** + **less, no, old** | any — 긍정문 "need any plasma"는 문법으로 걸러짐 |
| 10-2 | Please keep the next cooler ready. | ready | closed, empty, lost | answer **ready** + **open, empty, lost** | **정답 둘** closed — 쿨러를 닫아 두라는 말도 맞음 |
| 10-4 | Let's call the blood bank for an update. | update | refund, invoice, receipt | answer **update** + **invoice, audit, apology** | an refund / an receipt — 관사로 걸러짐(pilot 2번) |
| 11-0 | Watch for fever, hypotension, or oozing. | oozing | yawning, humming, laughing | answer **oozing** + **constipation, snoring, blinking** | yawning/humming/laughing 동떨어짐(itching·chills는 실제 반응 징후라 쓰면 정답 둘) |
| 11-2 | Tell me right away if vitals shift. | vitals | visitors, lights, doors | answer **vitals** + **plans, staff, schedules** | visitors/lights/doors 동떨어짐 |
| 11-3 | Oozing from the line can be an early sign. | line | poster, badge, wall | answer **line** + **cuff, monitor, pump** | poster/badge/wall 동떨어짐(drain·dressing은 정답 둘 위험이라 피함) |
| 11-4 | Let's watch the urine color closely. | closely | loudly, lazily, blindly | answer **closely** + **briefly, rarely, loosely** | loudly/lazily/blindly 동떨어짐 |
| 11-5 | A fever this early worries me. | worries | bores, amuses, pleases | answer **worries** + **reassures, calms, relieves** | bores/amuses/pleases 동떨어짐 — 반대 방향(a)으로 |
| 12-0 | There's diffuse oozing from the field. | diffuse | dry, loud, cold | answer **diffuse** + **focal, arterial, dry** | loud/cold 동떨어짐 — diffuse의 반대(focal)로 |
| 12-2 | Let's give more plasma and check coags. | coags | scales, wheels, tubes | answer **coags** + **labels, coolers, slips** | scales/wheels 동떨어짐(sats는 정답 둘 위험) |
| 12-3 | The surgeon says the field looks wet. | wet | bright, narrow, messy | answer **wet** + **dry, narrow, bright** | messy — 피 묻은 수술 부위를 messy로 말할 수 있어 정답 둘 위험 |
| 12-4 | Let's send coags again after this plasma. | send | hide, paint, fold | answer **send** + **stamp, print, file** | hide/paint/fold 동떨어짐 |
| 12-5 | More plasma may help the oozing. | oozing | noise, smell, glare | answer **oozing** + **fever, rash, swelling** | noise/smell/glare 동떨어짐 |
| 13-0 | Let's get an arterial blood gas. | get | file, trim, stamp | answer **get** + **label, print, chart** | file/trim/stamp 동떨어짐(order는 정답 둘) |
| 13-1 | The lactate is climbing. | climbing | printing, leaking, melting | answer **climbing** + **falling, clotting, settling** | printing/leaking/melting 동떨어짐 |
| 13-2 | We need to correct the acidosis. | correct | blame, rename, frame | answer **correct** + **worsen, cause, chart** | blame/rename/frame 동떨어짐 |
| 13-3 | Let's draw another gas in twenty minutes. | draw | paint, bury, weigh | answer **draw** + **file, chart, waste** | paint/bury/weigh 동떨어짐 |
| 13-5 | I'll report the numbers to the team. | report | round, total, sort | answer **report** + **fax, mail, text** | round/total/sort — "total the numbers to the team" 문법으로 걸러짐 |
| 14-0 | Let's redraw coags and fibrinogen now. | coags | labels, bags, slips | answer **coags** + **cultures, labels, slips** | bags 동떨어짐 |
| 14-1 | We'll dose product off the latest results. | dose | ship, print, store | answer **dose** + **thaw, warm, store** | ship/print 동떨어짐 |
| 14-2 | I'll send it stat and track the trend. | track | trim, tear, trade | answer **track** + **fax, print, hide** | trim/tear/trade 동떨어짐(chart는 정답 둘 위험) |
| 14-3 | The fibrinogen is trending down too. | down | sideways, around, inside | answer **down** + **up, sideways, higher** | around/inside 동떨어짐 |
| 14-4 | Let's send another set of coags in an hour. | set | stack, pile, box | answer **set** + **tray, bag, box** | stack/pile 동떨어짐(round는 정답 둘) |
| 14-5 | Let's dose the next unit off these results. | unit | crate, slot, shelf | answer **unit** + **shift, form, case** | crate/slot/shelf 동떨어짐(cooler는 정답 둘 위험) |
| 15-0 | Stop the transfusion immediately. | transfusion | conversation, music, session | answer **transfusion** + **count, timer, cautery** | conversation/music/session 동떨어짐(pump는 정답 둘) |
| 15-2 | Keep the IV open with saline and call the blood bank. | saline | gauze, ink, foam | answer **saline** + **gauze, tape, caps** | ink/foam 동떨어짐(혈액·포도당·증류수는 위험 처치라 선택지로도 쓰지 않음) |
| 15-3 | The urine looks dark, and this could be hemolysis. | looks | feels, smells, sounds | answer **looks** + **stays, feels, sounds** | smells dark 동떨어짐 |
| 15-4 | Let's call the blood bank right now. | now | here, there, home | answer **call** + **thank, visit, email** | here/there/home — "right home" 문법으로 걸러짐, right away는 정답 둘 → 빈칸을 call로 옮김(answer: call) |
| 16-2 | Watch the rhythm—it could deteriorate fast. | rhythm | label, door, window | answer **rhythm** + **warmer, cooler, tubing** | label/door/window 동떨어짐 |
| 16-3 | Peaked T-waves mean we need to act now. | Peaked | Tiny, Smooth, Round | answer **Peaked** + **flat, tiny, normal** | smooth/round 동떨어짐 |
| 16-4 | Let's recheck the potassium after this dose. | recheck | rewrap, retire, reboot | answer **potassium** + **lactate, fibrinogen, hematocrit** | recheck ↔ rewrap/retire/reboot 동떨어짐 → 빈칸을 potassium으로 옮김(answer: potassium; glucose는 인슐린 뒤 재확인이 참이라 정답 둘) |
| 17-2 | Push calcium and recheck immediately. | recheck | restock, rename, retype | answer **recheck** + **restock, refill, reorder** | rename/retype 동떨어짐 |
| 17-3 | We need calcium in the line right now. | line | crate, badge, plate | answer **line** + **cooler, drawer, basin** | crate/badge/plate 동떨어짐(bag은 혈액 팩에 칼슘 — 위험) |
| 17-5 | Let's recheck the calcium in five minutes. | recheck | restate, resize, rewrite | answer **recheck** + **relabel, refill, reorder** | restate/resize/rewrite 동떨어짐 |
| 18-1 | Stop the transfusion—this could be TRALI. | transfusion | round, break, conference | answer **transfusion** + **irrigation, drill, recording** | round/break/conference 동떨어짐 |
| 18-2 | Let's support ventilation and report it. | report | recycle, reheat, refund | answer **report** + **label, file, bag** | recycle/reheat/refund 동떨어짐 |
| 18-4 | Let's stop this unit and call anesthesia. | unit | stand, pole, badge | answer **unit** + **warmer, drape, drill** | stand/pole/badge 동떨어짐(pump는 정답 둘) |
| 18-5 | I'll report this reaction right away. | reaction | schedule, bill, menu | answer **reaction** + **shortage, delay, price** | schedule/bill/menu 동떨어짐 |
| 19-3 | We only have two units of O-negative left. | O-negative | O-positive, A-negative, B-positive | answer **O-negative** + **AB-positive, A-negative, B-positive** | **정답 둘** O-positive — 10-0과 같음 |
| 19-4 | Let's activate the emergency release now. | release | rename, rewind, retire | answer **release** + **drill, review, meeting** | rename/rewind/retire 동떨어짐 |
| 19-5 | I'll call the regional blood bank. | bank | drive, label, sticker | answer **bank** + **drive, donor, type** | label/sticker 동떨어짐(center는 정답 둘) |
| 20-0 | The venous pressure and edema are rising. | venous | dental, nasal, facial | answer **venous** + **bladder, intraocular, compartment** | dental/nasal/facial 동떨어짐(arterial·airway는 TACO에서도 올라 정답 둘) |
| 20-1 | Slow the transfusion—this looks like TACO. | transfusion | elevator, meeting, break | answer **transfusion** + **irrigation, suction, cautery** | elevator/meeting/break 동떨어짐 |
| 20-2 | Let's give a diuretic and reassess. | reassess | reorder, refresh, reboot | answer **reassess** + **rewarm, restock, reroute** | refresh/reboot 동떨어짐(reorder는 주제 4회가 됨) |
| 20-4 | Let's slow the rate and recheck the pressure. | recheck | reroute, rewire, repaint | answer **recheck** + **raise, reset, reroute** | rewire/repaint 동떨어짐 |

15-4·16-4는 빈칸 자리를 옮깁니다(answer와 options 정답도 함께). 15-0·18-1·20-1의 새 오답(cautery·irrigation·drill 등)은 OR에 실제 있는 장치·작업이지만 "Stop/Slow the ___—this could be TRALI"에서는 틀린 대상.

### C. decoy — 19문장 (정답 둘 3 · 위험 2)
| 문장 | 지금 | 문제 | 새 값 |
|---|---|---|---|
| 1-0 | one more time | together 자리를 대신하면 한 사람이 한 번 더 확인 — 두 사람 확인이 빠짐 | `and room number`(and blood type 자리: 방 번호는 식별자 아님) |
| 1-4 | with the label | "Confirm the expiration date with the label." 맞는 문장이고 ko에도 가까움 — 정답 둘 | `before we chart` |
| 2-0 | past the pump | 어느 청크 자리에도 안 맞음(through/the warmer) | `the cooler` |
| 2-1 | in the cooler | 어느 자리에도 안 맞음 | `the patient's sodium` |
| 2-3 | to the bedside | goes through to the bedside — 가온기가 빠진 다른 문장 | `the scanner` |
| 3-1 | once the cooler | the cooler stabilize — 수 일치로 걸러짐 | `if the lines` |
| 4-1 | in the order | "confirm each in the order" ≈ 처방에 있는지 확인 — 정답 둘에 가까움 | `against the invoice` |
| 4-2 | and tag them | and log 자리에 넣으면 "and tag them the time" 비문 | `and check` |
| 4-4 | against the pole | 어느 자리에도 안 맞음 | `the shift schedule` |
| 6-5 | with the team | to/the 1:1:1 ratio 어느 자리에도 안 맞음 | `the warmer` |
| 7-4 | the pump | "weaken the pump" = 심장을 이르는 현장어 — **정답 둘** | `the cooler` |
| 8-2 | the room lights | the room·temperature 어느 자리에도 안 맞음 | `lights`(temperature 자리 → "raise the room lights") |
| 9-0 | from the freezer | 어느 자리에도 안 맞고, 뜻은 해동 안 한 혈장 투여 — **위험** | `the albumin` |
| 11-3 | from the pole | 청크 "Oozing from the line"이 통째라 들어갈 자리 없음 | `a late`(an early 자리) |
| 12-0 | from the sink | from/the field 어느 자리에도 안 맞음 | `the dressing` |
| 14-2 | and shred the slip | and track 자리에 넣으면 비문 | `and file` |
| 15-1 | and dark roast | 동떨어짐, 청크 모양(—suspect hemolysis)과 다름 | `and clear urine—suspect hemolysis` |
| 15-3 | could be a dye | could be/hemolysis 어느 자리에도 안 맞음 | `dehydration`(hemolysis 자리) |
| 19-1 | overnight | "release overnight O-negative" — 응급 방출을 늦추는 시각 decoy — **위험** | `frozen` |

### D. order — 7장
| 상황 | 문제 | 고칠 것 |
|---|---|---|
| S3 수혈 속도 조정 | 2↔3 교환("Once the numbers settle, we can slow it down." → "I'll watch how the patient responds to that.")도 자연스러움 | 3줄 → `If the numbers settle while I watch, we can slow it down.` (ko "지켜보는 동안 수치가 가라앉으면 늦출 수 있어요") |
| S7 저칼슘 보충 | 2↔3 교환("Ca low. That's why we're giving calcium now. Citrate … is binding it.")이 자연스러움 | 3줄 → `To replace what's bound, let's give calcium now.` (ko "결합된 만큼 지금 칼슘을 줘요") |
| S8 저체온 예방 | 3↔4 교환("As long as it helps…" → "We'll recheck … to see if that helps.") 자연스러움 | 4줄 → `If it does, let's keep the blanket running throughout the case.` (ko "도움이 되면 수술 내내 담요를 계속 틀어요") |
| S10 재고 조율 | 1줄에서 혈액은행과 통화 중인데 3줄이 "혈액은행에 전화하자"; O형 음성 수량 → 혈장 필요로 논리 비약; 2줄 ko가 en의 쿨러 준비를 뺌 | 4줄 교체: ① `How many units of O-neg do you have left?`(O형 음성이 몇 단위 남았나요/문의/lab) ② `At that count, please keep the next cooler ready.`(그 수량이면 다음 쿨러를 준비해 주세요/준비/pager) ③ `We're running low on platelets too, so add some to it.`(혈소판도 부족하니 거기에 넣어 주세요/추가/lab) ④ `Once they're packed, call me and I'll send someone.`(다 담기면 전화 주세요, 사람을 보낼게요/연락/pager). why → "남은 수량을 묻고, 그 수량에 맞춰 쿨러를 부탁하고, 혈소판도 넣어 달라고 한 뒤, 다 담기면 연락을 받기로 해요." |
| S17 시트르산 저칼슘 위기 | 2↔3 교환("We need calcium … right now. That's from the citrate load…")도 자연스러움 | 3줄 → `To reverse that effect, we need calcium in the line right now.` (ko "그 영향을 되돌리려면 지금 라인으로 칼슘이 필요해요") |
| S18 TRALI | 1↔2 교환("Stop the transfusion—this could be TRALI. Sats are falling…")이 자연스러움(지시 → 근거) | 2줄 → `With that picture, stop the transfusion—this could be TRALI.`, 3줄 → `Once it's stopped, let's support ventilation and call anesthesia.` (ko "멈췄으면 환기를 지지하고 마취과를 불러요") |
| S20 TACO | 1↔2 교환이 S18과 같은 이유로 자연스러움 | 2줄 → `With those rising, slow the transfusion—this looks like TACO.` (ko "그게 오르니 수혈 속도를 늦추세요, TACO 같아요") |

### E. tag · why — 2
- 10-1 tag `예측 요청` → `예측 알림` (문장은 요청이 아니라 알림).
- 6-4 why "call for는 사람을 부르는 것이 아니라 필요한 물건을 요청한다는 뜻" → "여기서 call for는 사람이 아니라 필요한 물건(쿨러)을 요청한다는 뜻" (call for help처럼 사람에게도 씀).

## 종합
고칠 것 **189건**(distractorsKo 87 · 빈칸 74 · decoy 19 · order 7 · tag/why 2), 그중 **안전 11**(distractorsKo 9 · decoy 2) · **정답 둘 14**(distractorsKo 4 · 빈칸 7 · decoy 3).
distractorsKo는 앞 단계 틀을 오답 둘에 다 쓴 문장이 절반이라 사실상 재저작 수준이고, S11~S20 빈칸 오답도 거의 전부 바꿔야 합니다. 위 목록을 반영하고 V20·W18·W19를 다시 돌린 뒤 2차 확인(특히 위기 문장 S15~S20)을 거쳐야 내보낼 수 있습니다.
