# icu-raised-icp — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-raised-icp.yaml`(A·B 합친 파일), 21상황 · 105문장 · order 21장. 문장 전수를 스크립트로 뽑았습니다(`rev_icu-raised-icp_B.py` → `rev_icu-raised-icp_B.out`: `en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy를 청크 자리마다 넣은 조립, order 4줄과 인접 교환 63건). 되풀이 상한은 조사·어미를 떼고 **어간**으로 셌습니다(`repeat2_icu-raised-icp_B.py`, 알려/알릴/알리 → 알리다처럼 활용형을 묶음). 아래 새 값은 `newko_icu-raised-icp_B.py`에 모아 임시 사본에 넣어 보고 길이(1.25배·3자, 오답 하나는 정답 길이 이하)와 되풀이(어간 5회 이하)를 다시 셌습니다 — 모두 통과(하다·전하다 같은 가벼운 동사·동음어 제외).

안전 판정 기준(부르는 쪽 지시): 오답이 정답 행동의 **앞·뒤 단계면 통과**, 그 순간 정답 행동 **대신** 하는 일이면 실패. 확인·감시 대상만 바꾼 것, 판단 기준·호출 대상·용량·약·체위·EVD 조작·시점을 바꾼 것, 처치를 기록·설명·준비로 바꾼 것, 정답에 말을 덧붙인 것(정답 둘)은 실패. 가족에게 **원리·소견을 설명하는 문장**(1.0·1.1·1.4·2.0·3.0·4.0·4.1·5.0·5.1·12.0·12.1·12.3·12.4·17.0·18.0·18.1·20.x)에서 이유·장기 이름만 바꾼 것은 그대로 해도 다칠 일이 없어 통과로 두었습니다. 응급 판단 문장(15.0·15.1·16.1·19.0)은 판단이 곧 처치를 정하므로 실패로 봤습니다.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 105개 모두 어순·문법에 이유를 붙였고 `ko`를 되풀이하지 않음. 사실 오류는 없음. 다만 9.2 why는 ko 오역(점적 수액)과 맞물려 있고, order 14의 why·L2 ko에 `얕추어/얕춰서` 오타. 7.3 why("so 절로 확인하는 이유")는 "혈압을 재면 덜 마른다"는 어색한 인과를 굳힘(en은 A 몫). |
| 2 빈칸 | **2** | 정답이 둘인 곳 1개(8.4 `tilted` — 기울었으면 재위치가 맞는 대응). **장면과 동떨어진 오답이 약 50문장**(`loudly/fondly/proudly`, `hide/borrow/sell`, `consent/insurance/luggage`, `luck/faith/chance`, `insurance/parking/visitation`). 부사 빈칸에 같은 엉뚱한 묶음(gladly·proudly·quietly)을 여러 문장에 돌려씀. 관사로 걸러지는 오답은 없음. |
| 3 decoy | 3 | 대부분 장소·때 꼬리라 모양으로 걸러짐. **처치를 늦추거나 위험하게 읽히는 조립 12개**(6.2 `by tonight`, 10.3 `at midnight`, 12.4 `in an hour`, 17.3 `in an hour`, 18.4 `in a day`, 8.4 `with a syringe`, 16.2 `for now` 등). `ko`에 그대로 맞게 조립되는 것 2개(9.0 `with a drip`, 13.3 `in the cart`). |
| 4 distractorsKo | **2** | 설명 문장(S0~S5, S12, S20)은 대체로 좋음. **처치·호출·판단 문장 49곳이 ⑥ 실패**입니다 — 정답 행동 대신 "선배에게 말하기·라인/센서 보기·재확인·라벨·소독·훑어보기"를 하는 오답이 응급 상황(S6~S8, S13~S19)에 몰려 있음. 정답 둘 8곳. **오답 둘 다 정답보다 긴 문장 34개**(브리프: 하나는 정답 길이 이하). 되풀이 상한은 어간 기준 `보다` 12회, `손`·`팀`·`말하다`·`두다`·`-고 나서` 6회로 초과, `선배`·`약사`·`알람`·`라인`·`씻다`·`살피다` 5회(경계). |
| 5 order | 3 | 인접 교환이 읽히는 카드 4장(S1 2↔3, S12 2↔3, S15 2↔3, S16 2↔3), 약한 것 1장(S20 3↔4). **임상 순서가 틀린 카드 2장**: S9(승압제 먼저 → 모자라면 수액 — 9.2 문장·표준과 반대), S15(뇌탈출에서 신경외과 호출이 맨 끝 `Behind all of that`). 15단어 넘는 줄 없음. |
| 6 tag·icon | 5 | 10자 이하, 상황 안에서 일관, 아이콘도 뜻과 맞음. |
| 8 파일럿 갈래 | **2** | 갈래 2(동떨어진 빈칸 오답) 약 50문장, 갈래 5·"오답으로 위험한 처치 보이기"(16.2 플러싱 조건, 9.0 "이중으로", 2.2 "여유 있게"), decoy 반대말(15.3 `with a clamp`). order 임상 순서 2장. |

## 사실 오류·심각한 문제
1. **16.2 X1 `혼자 플러싱하지 말고`·X2 `서둘러 플러싱하지 말고`**(저작자 질문): 금지의 조건을 바꿔 "둘이 하면 / 천천히 하면 플러싱해도 된다"로 읽힙니다. EVD 플러싱은 신경외과 몫이라 간호사가 하지 않습니다 — 가장 위험한 오답입니다.
2. **응급 상황 오답이 그 순간의 처치를 다른 일로 바꿉니다**: 13.2(이송 전 EVD 잠금 → 높이 보기·소독 — 잠그지 않으면 이송 중 과배액), 14.3·14.4(재진정 → 선배에게 말하기·체위 보기), 15.3(두부 거상 → 신경외과에 말하기·산소 보기), 15.4(팀 소집 → 맞이·안내), 17.3(신경외과 호출 → 자료 가져오기), 18.2·18.4(신경외과·외과의 호출 → 영상 보내기·동의서 확인), 18.3(항응고 역전 → 목록 훑기·채혈), 14.1(진정제 보류 → 재확인), 12.2(적정 → 처방 재확인·라인 보기).
3. **판단 기준을 바꾼 오답**: 15.0(산대 동공 = 출혈/경련), 15.1(증명 전까지 뇌졸중/감염으로 봄), 16.1·8.2(막힘 판단을 새는 것·빠진 것·알람·모니터 문제로), 19.0(칼륨 기준, 요붕증 → 심부전 — 그대로 하면 수분 제한으로 탈수 악화), 19.1 X2(신부전).
4. **9.0 X1 `승압제 용량을 이중으로 맞춰 봐요`**: "용량을 두 배로"로 읽힙니다(용량 실패).
5. **9.2 ko 오역**: `before increasing the drip`의 drip은 이 상황(CPP 승압)에서 **승압제 점적**인데 ko가 `점적 수액을 늘리기 전에 충분히 채워졌는지`라서 "수액을 늘리기 전에 수액이 찼는지"가 됩니다. ko와 오답을 함께 고칩니다(A 검토와 겹치면 A 값과 맞추세요).
6. **order S9 임상 순서**: 카드가 "승압제로 받치고 → 모자라면 수액을 더함"인데, 뇌관류압 관리는 **정상 혈량을 먼저 맞추고 승압제**를 씁니다(같은 상황 9.2 문장도 "승압제를 올리기 전에 충분히 찼는지 확인"). 9.1 en `If pressor alone isn't enough, we add fluid too`도 같은 문제라 A에 넘깁니다.
7. **order S15**: 뇌탈출에서 신경외과 호출이 `Behind all of that`으로 맨 끝입니다. 호출은 처치와 동시에, 먼저 해야 합니다.
8. **decoy가 처치를 늦추는 조립**: 6.2 `…move to osmotic therapy by tonight`, 10.3 `return to normal at midnight`(과호흡 연장), 10.1 `This only works for the shift`(과호흡을 근무 내내), 12.4 `so we correct in an hour`(빠른 교정 → 반동 부종), 14.0 `lighten sedation for tonight`, 14.4 `climbs past twenty for a while`, 17.3 `to the bedside in an hour`, 18.4 `Notify the surgeon in a day`, 8.4 `reassess with a syringe`(EVD를 주사기로), 16.2 `Don't flush for now`(나중엔 해도 되는 것처럼), 15.3 `with a clamp`(배액의 반대 조작), 10.4 `every day`.
9. **20.4(사실, A에 넘김)**: 미국 병원에서 장기기증 이야기는 OPO 코디네이터(지정 요청자)가 꺼내고, 뇌사 설명과 떼어서 합니다(CMS 참여 조건). 병상 간호사가 `we can talk about organ donation`이라고 먼저 꺼내는 en은 관행과 어긋납니다 → 예: `When you're ready, our donation team can talk with you — there's no rush.` 20.1 `two separate exams`는 2023 AAN 등 성인 지침이 검사 1회도 허용하니 "이 병원 방침상"으로 읽히게 두면 됩니다(오류는 아님).

## 고칠 것 — distractorsKo (새 값은 길이·어간 되풀이 확인 끝)

### A. distractorsKo — 안전(⑥) 실패 — 49문장

- **0.4** `I'll compare this with his earlier exam and update the team.` — ko `이전 사정과 비교해서 팀에 알릴게요.`  
  X1 `이전 사진과` 비교 대상 바꿈(확인 대상), X2 `가족에게` 알릴 대상 바꿈(호출 대상) → 앞·뒤 단계
  - X1 `이전 사진과 비교해서 팀에 알릴게요` → `이전 사정과 같은 순서로 또 해요`
  - X2 `이전 사정과 비교해서 가족에게 알릴게요` → `이전 사정과 비교하려고 지난 차트를 열게요`
- **1.2** `We avoid turning his neck to keep that drainage open.` — ko `배액이 잘 되도록 목을 돌리지 않게 해요.`  
  X1 `팔을` — 피해야 할 동작의 부위를 목에서 팔로 바꿈(목 돌리기를 막지 않게 됨) → 이유만 바꿈
  - X1 `배액이 잘 되도록 팔을 돌리지 않게 해요` → `잠이 잘 오도록 목을 돌리지 않게 해요`
- **1.3** `I check his alignment every time I turn him.` — ko `체위를 바꿀 때마다 정렬을 확인해요.`  
  X1 `침구를 갈 때마다`·X2 `교대할 때마다` — 정렬 확인 시점을 바꿈(교대 때만이면 확인 간격이 벌어짐) → 사람·앞 단계
  - X1 `침구를 갈 때마다 정렬을 확인해요` → `바꿀 때마다 둘이서 정렬을 맞춰요`
  - X2 `교대할 때마다 정렬을 확인해요` → `체위를 바꾸기 전에 가족께 먼저 말씀드려요`
- **2.2** `I keep it leveled precisely so it drains the right amount.` — ko `정확한 양만큼 배액되도록 수평을 정밀하게 맞춰요.`  
  X2 `여유 있게` — precisely의 반대말(⑤)이고 그대로 하면 EVD 수평이 부정확해짐 → 사람 바꾸기
  - X2 `정확한 양만큼 배액되도록 수평을 여유 있게 맞춰요` → `정확한 양만큼 배액되도록 수평을 둘이서 맞춰요`
- **3.3** `Let's check if his numbers are in the target range this hour.` — ko `이번 시간에 수치가 목표 범위 안에 있는지 확인해 봐요.`  
  X1 `알람 한도를 맞춰요`·X2 `센서부터 살펴봐요` — 수치 확인 대신 다른 일을 함 → 주어 바꾸기·앞 단계
  - X1 `이번 시간에 수치가 목표 범위 안에 있도록 알람 한도를 맞춰요` → `이번 시간 수치가 목표 범위 안인지 제가 혼자 확인할게요`
  - X2 `이번 시간에 수치가 목표 범위 안에 오도록 센서부터 살펴봐요` → `이번 시간에는 수치보다 환자 자세부터 바로 해 봐요`
- **4.4** `I check on him every hour and adjust his medicine if needed.` — ko `매시간 상태를 확인하고 필요하면 약을 조정해요.`  
  X1 `조명을`·X2 `소리를` 조정 — 조정 대상이 약에서 환경으로 바뀜(약을 바꾸지 않음 규칙) → 앞 단계
  - X1 `매시간 상태를 확인하고 필요하면 조명을 조정해요` → `약을 조정하려고 통증 점수부터 물어봐요`
  - X2 `매시간 상태를 확인하고 필요하면 소리를 조정해요` → `매시간 상태를 확인하려고 타이머를 켜 둬요`
- **6.0** `First let's optimize his position and deepen sedation.` — ko `먼저 체위를 최적화하고 진정을 깊게 할게요.`  
  X2 `진정 수준을 사정` — 진정을 깊게 하는 처치를 사정으로 바꿈(그 순간 처치가 늦어짐) → 뒤 단계
  - X2 `먼저 체위를 최적화하고 진정 수준을 사정할게요` → `체위와 진정을 조정한 다음에는 ICP를 다시 잴게요`
- **6.1** `Position first, then meds, in that order.` — ko `체위 먼저, 약은 그다음, 그 순서예요.`  
  (저작자 질문) X1 `소독은 그다음`·X2 `침구는 그다음` — 2단계 처치(약)를 다른 일로 바꿈 → 실패. 바꿀 세부가 없는 순서 규칙 문장이라 "참인 다른 이유" 방식으로 순서 꼬리만 바꿈. 더 나은 안이 없으면 이 문장은 빈칸·청크만 쓰는 것도 고려
  - X1 `체위 먼저, 소독은 그다음, 그 순서예요` → `체위 먼저, 약은 그다음, 부담이 적은 순서예요`
  - X2 `체위 먼저, 침구는 그다음, 그 순서예요` → `체위 먼저, 약은 다음, 쉬운 순서예요`
- **6.3** `No change after position and sedation, so call for mannitol.` — ko `체위와 진정 후에도 변화가 없어서 만니톨을 요청할게요.`  
  X2 `만니톨 용량을 계산` — 요청을 준비로 바꿈. X1 `처방을 살필게요`는 앞 단계라 통과 → X2만 뒤 단계로
  - X2 `체위와 진정 후에도 변화가 없어서 만니톨 용량을 계산할게요` → `변화가 없으면 만니톨을 단 뒤 소변량을 챙길게요`
- **6.4** `I'll drain the EVD per parameters and notify the team.` — ko `지시 기준에 따라 EVD를 배액하고 팀에 알릴게요.`  
  X1 `가족에` 알림(호출 대상·문법), X2 `신경외과에 말할게요`(팀 → 신경외과, 사실상 정답 둘) → 앞·뒤 단계
  - X1 `지시 기준에 따라 EVD를 배액하고 가족에 알릴게요` → `지시 기준에 따라 EVD를 배액하려고 높이부터 맞출게요`
  - X2 `지시 기준에 따라 EVD를 배액하고 신경외과에 말할게요` → `지시대로 EVD를 배액한 후 배액량을 적을게요`
- **7.0** `We'll give the ordered dose and watch the ICP response.` — ko `처방된 용량을 드리고 ICP 반응을 지켜볼게요.`  
  X2 `보호자께 말씀` — ICP 반응 감시를 설명으로 바꿈 → 뒤 단계
  - X2 `처방된 용량을 드리고 나서 보호자께 말씀드릴게요` → `처방된 용량을 드리고 네 시간 뒤 나트륨 검사를 보낼게요`
- **7.1** `Confirm weight-based dosing before we hang it.` — ko `달기 전에 체중 기반 용량인지 확인할게요.`  
  X1 `약사에게 물어볼게요` — 확인하는 방법만 바뀌어 정답 둘(④), X2 `정맥 라인이 열려 있는지` — 확인 대상이 용량에서 라인으로(빠뜨린 확인) → 앞·뒤 단계
  - X1 `달기 전에 체중 기반 용량인지 약사에게 물어볼게요` → `용량을 확인하려고 오늘 체중부터 다시 잴게요`
  - X2 `달기 전에 정맥 라인이 열려 있는지 확인할게요` → `용량을 확인하고 필터를 끼워서 달게요`
- **7.2** `Monitor his sodium, osmolality, and urine output closely.` — ko `나트륨과 삼투압, 소변량을 자세히 모니터할게요.`  
  X2 `결과를 따로 정리` — 감시를 기록으로 바꿈 → 뒤 단계(한도 넘으면 보고)
  - X2 `나트륨과 삼투압, 소변량 결과를 따로 정리해 둘게요` → `나트륨·삼투압·소변량이 한도를 넘으면 보고해요`
- **7.4** `Check his sodium again in four hours and trend the osmolality.` — ko `네 시간 뒤에 나트륨을 다시 확인하고 삼투압 추이를 볼게요.`  
  X1 `약사와 상의` — 삼투압 추이 확인이 빠짐, X2 `그래프로 그려 둘게요` — 정답에 말을 덧붙임(정답 둘) → 앞·뒤 단계
  - X1 `네 시간 뒤에 나트륨을 다시 확인하고 약사와 상의할게요` → `네 시간 뒤 나트륨을 다시 보려고 채혈 시각을 맞출게요`
  - X2 `네 시간 뒤에 나트륨을 다시 확인하고 삼투압 추이를 그래프로 그려 둘게요` → `나트륨을 다시 확인하고 다음 만니톨 투여를 의사와 정할게요`
- **8.1** `Confirm fluctuation with respirations before you trust the number.` — ko `수치를 믿기 전에 호흡에 따른 파동부터 확인하세요.`  
  X1 `센서 위치부터` — 확인 대상 바꿈, X2 `선생님께 보여 주세요` — 확인을 남에게 넘김 → 앞·뒤 단계
  - X1 `수치를 믿기 전에 센서 위치부터 확인하세요` → `호흡에 따른 파동을 확인하고 나서 수치를 적으세요`
  - X2 `수치를 믿기 전에 호흡에 따른 파동부터 선생님께 보여 주세요` → `파동을 확인하려고 환자 자세부터 바로 하세요`
- **8.2** `A dampened waveform can mean it's not draining well.` — ko `파형이 약해졌다면 배액이 잘 안 되고 있다는 뜻일 수 있어요.`  
  X1 `알람이 잘 안 울리고`·X2 `모니터가 잘 안 켜졌다` — 파형 약화의 뜻(판단 기준)을 바꿔 막힘을 놓치게 함 → 확신 정도·다음 단계
  - X1 `파형이 약해졌다면 알람이 잘 안 울리고 있다는 뜻일 수 있어요` → `파형이 약해졌다면 배액이 잘 안 되고 있는 게 분명해요`
  - X2 `파형이 약해졌다면 모니터가 잘 안 켜졌다는 뜻일 수 있어요` → `파형이 약해졌다면 배액관 높이와 튜빙부터 점검해야 해요`
- **8.3** `I'll check for fluctuation and notify neurosurgery if it's blocked.` — ko `파동을 확인하고 막혔으면 신경외과에 알릴게요.`  
  X1 `새고 있으면` — 알리는 기준 바꿈, X2 `신경외과 간호사에게` — 호출 대상 바꿈 → 앞·뒤 단계
  - X1 `파동을 확인하고 새고 있으면 신경외과에 알릴게요` → `신경외과에 알리려고 튜빙을 따라 꼬임부터 찾을게요`
  - X2 `파동을 확인하고 막혔으면 신경외과 간호사에게 알릴게요` → `신경외과에 알리고도 파동을 계속 지켜볼게요`
- **9.0** `To raise his CPP we support his blood pressure with a pressor.` — ko `CPP를 올리기 위해 승압제로 혈압을 지지해요.`  
  X1 `승압제 용량을 이중으로 맞춰` — "용량을 두 배로"로 읽힘(용량) → 동료와 함께 확인. X2는 줄여서 길이 맞춤
  - X1 `CPP를 올리기 위해 승압제 용량을 이중으로 맞춰 봐요` → `CPP를 올리기 위해 승압제 용량을 동료와 같이 확인해요`
  - X2 `CPP를 올리기 위해 승압제 라인을 먼저 살펴봐요` → `CPP를 올리려고 승압제 라인부터 살펴봐요`
- **9.2** `Let's ensure he's adequately filled before increasing the drip.` — ko `점적 수액을 늘리기 전에 충분히 채워졌는지 확인해요.`  
  ko 오역 — `the drip`은 승압제 점적인데 ko가 "점적 수액을 늘리기 전에"라서 뜻이 안 맞음 → ko를 고치고 오답 둘도 새 ko에 맞춤. 기존 X1 `라인이 막히지 않았는지`는 확인 대상을 바꿈
  - 새 ko → `승압제를 올리기 전에 수액이 충분히 들어갔는지 확인해요.`
  - X1 `점적 수액을 늘리기 전에 라인이 막히지 않았는지 확인해요` → `승압제를 올린 후에는 혈압을 오 분마다 기록해요`
  - X2 `점적 수액을 늘리기 전에 충분히 채워졌는지 팀과 상의해요` → `승압제를 올리기 전에 수액이 충분한지 의사와 상의해요`
- **9.4** `Watch for overload signs like crackles before you push more fluid.` — ko `수액을 더 밀어 넣기 전에 수포음 같은 과부하 징후를 살펴보세요.`  
  (저작자 질문) X1 `알레르기 목록`·X2 `정맥 라인 부위` — 과부하 징후 확인을 다른 대상 확인으로 바꿈 → 실패. 앞 단계(청진 준비)·뒤 단계(징후가 보이면 멈추고 연락)
  - X1 `수액을 더 밀어 넣기 전에 알레르기 목록을 살펴보세요` → `수액을 더 밀어 넣으려면 수포음을 듣게 병실 소음부터 줄여 주세요`
  - X2 `수액을 더 밀어 넣기 전에 정맥 라인 부위를 살펴보세요` → `수포음 같은 과부하 징후가 보이면 수액을 멈추고 연락하세요`
- **10.3** `We'll monitor his CO2 and return to normal soon.` — ko `CO2를 모니터하고 곧 정상으로 되돌릴게요.`  
  X1 `팀에 보고하고` — CO2 감시를 보고로 바꿈 → 앞 단계
  - X1 `CO2 수치를 팀에 보고하고 곧 정상으로 되돌릴게요` → `CO2 감시를 위해 센서부터 확인할게요`
- **11.0** `He's on a seizure-prevention medication given his brain injury.` — ko `뇌손상 때문에 발작 예방 약물을 쓰고 있어요.`  
  X1 `통증 예방 약물` — 약 종류를 바꿈(약 이름 규칙) → 이유(뇌손상 → 수술)만 바꿈
  - X1 `뇌손상 때문에 통증 예방 약물을 쓰고 있어요` → `수술 때문에 발작 예방 약물을 쓰고 있어요`
- **11.2** `Continuous EEG helps us catch seizures we can't see.` — ko `지속적인 EEG가 눈에 안 보이는 발작을 잡아내는 데 도움이 돼요.`  
  X2 `발작을 예방하는` — EEG가 발작을 막는다는 잘못된 안심 → 다른 대상(수면 상태)
  - X2 `지속적인 EEG가 눈에 안 보이는 발작을 예방하는 데 도움이 돼요` → `지속적인 EEG가 눈에 안 보이는 수면 상태를 잡아내요`
- **11.4** `Note the time and duration if a seizure happens on camera.` — ko `카메라에 발작이 찍히면 시간과 지속 시간을 기록하세요.`  
  X1 `시간과 장소` — 지속 시간(지속 발작 판단 근거)이 빠짐, X2 `가족에게 알리세요` — 기록을 가족 설명으로 → 앞·뒤 단계
  - X1 `카메라에 발작이 찍히면 시간과 장소를 기록하세요` → `발작이 찍히면 시간을 적기보다 기도부터 확보하세요`
  - X2 `카메라에 발작이 찍히면 시간과 지속 시간을 가족에게 알리세요` → `발작이 끝나면 시간과 지속 시간을 의료진에게 전하세요`
- **12.2** `I'll check levels frequently and titrate the hypertonic fluid.` — ko `수치를 자주 확인하면서 고장성 수액을 적정할게요.`  
  X1 `처방을 재확인`·X2 `라인을 둘러볼게요` — 적정 대신 확인을 함 → 결정 주체·앞 단계
  - X1 `수치를 자주 확인하면서 고장성 수액 처방을 재확인할게요` → `수치를 자주 확인하면서 속도는 의사와 정할게요`
  - X2 `수치를 자주 확인하면서 고장성 수액 라인을 둘러볼게요` → `고장성 수액을 적정하려고 중심정맥관부터 확인할게요`
- **13.0** `We'll keep his head up and sedation ready during transport.` — ko `이송하는 동안 머리를 세우고 진정 상태를 유지할게요.`  
  X1 `수술하는 동안`·X2 `침상에서 쉬는 동안` — 처치 시점을 바꿈 → 이송 중 인력·돌아온 뒤
  - X1 `수술하는 동안 머리를 세우고 진정 상태를 유지할게요` → `이송하는 동안 머리를 세우려고 둘이 같이 갈게요`
  - X2 `침상에서 쉬는 동안 머리를 세우고 진정 상태를 유지할게요` → `이송에서 돌아오면 머리를 세우고 RASS 점수를 매길게요`
- **13.1** `Sedate him a little deeper before we head to CT.` — ko `CT로 가기 전에 조금 더 깊게 진정시킬게요.`  
  X1 `MRI로`·X2 `엑스레이로` — 검사를 바꿈(검사 바꾸지 않음) → 앞·뒤 단계
  - X1 `MRI로 가기 전에 조금 더 깊게 진정시킬게요` → `CT로 가기 전에 진정제 처방부터 챙길게요`
  - X2 `엑스레이로 가기 전에 조금 더 깊게 진정시킬게요` → `CT에서 돌아오면 신경학적 상태를 사정할게요`
- **13.2** `I'll clamp or manage the EVD per protocol before we move.` — ko `프로토콜에 따라 이동 전에 EVD를 잠그거나 관리할게요.`  
  (저작자 질문) X1 `높이를 보거나 훑어볼게요`·X2 `소독하거나 훑어볼게요` — 이송 전 EVD 잠금(과배액 방지)을 확인·소독으로 바꿈 → 실패. "훑어볼게요"가 둘 다에 있어 걸러지기도 함 → 잠그기 앞 단계(ICP 기록)·돌아온 뒤 단계(수평 다시 잡고 열기)
  - X1 `프로토콜에 따라 이동 전에 EVD 높이를 보거나 훑어볼게요` → `프로토콜에 따라 EVD를 잠그려고 ICP 값부터 적을게요`
  - X2 `프로토콜에 따라 이동 전에 EVD를 소독하거나 훑어볼게요` → `돌아오면 프로토콜대로 높이를 다시 잡고 EVD를 열게요`
- **13.4** `Keep the osmotic bolus ready to give the moment we're back.` — ko `돌아오는 순간 바로 줄 수 있게 삼투 볼루스를 준비해 두세요.`  
  X1 `출발하는 순간` — 투여 시점 바꿈, X2 `라벨을 읽어 두세요` — 준비를 라벨 확인으로 → 투여 앞·뒤 단계
  - X1 `출발하는 순간 바로 줄 수 있게 삼투 볼루스를 준비해 두세요` → `돌아와서 볼루스를 주려면 처방과 용량을 다시 읽으세요`
  - X2 `돌아오는 순간 바로 줄 수 있게 삼투 볼루스 라벨을 읽어 두세요` → `돌아와서 볼루스를 주면 ICP 반응을 기록해 주세요`
- **14.1** `Hold the sedative thirty minutes before the exam if ordered.` — ko `지시가 있으면 검사 삼십 분 전에 진정제를 보류하세요.`  
  X1 `용량을 재확인`·X2 `시간을 재확인` — 보류(처치)를 확인으로 바꿈 → 앞·뒤 단계
  - X1 `지시가 있으면 검사 삼십 분 전에 진정제 용량을 재확인하세요` → `진정제를 보류하기 전에 ICP가 안정적인지 점검하세요`
  - X2 `지시가 있으면 검사 삼십 분 전에 진정제 시간을 재확인하세요` → `지시대로 진정제를 보류한 후 ICP 변화를 눈여겨보세요`
- **14.3** `I'll watch his ICP closely and re-sedate if it climbs.` — ko `ICP를 자세히 지켜보다가 치솟으면 다시 진정시킬게요.`  
  X1 `선배에게 말할게요`·X2 `체위를 눈여겨볼게요` — 재진정 대신 다른 일 → 재진정 뒤 단계·감시 준비
  - X1 `ICP를 자세히 지켜보다가 치솟으면 선배에게 말할게요` → `ICP가 치솟아 다시 진정시키면 검사는 미룰게요`
  - X2 `ICP를 자세히 지켜보다가 치솟으면 체위를 눈여겨볼게요` → `ICP 감시를 위해 검사 전에 모니터 한도부터 맞출게요`
- **14.4** `If ICP climbs past twenty, stop and re-sedate right away.` — ko `ICP가 이십을 넘어서면 즉시 멈추고 다시 진정시키세요.`  
  (저작자 질문) 기준 20과 "즉시 멈추고"를 지킨 것은 좋음. 그러나 X1 `선배에게 말하세요`·X2 `체위를 살피세요` — 재진정 대신 다른 일 → 실패. 앞 단계(20에 가까워질 때 준비)·뒤 단계(재진정 뒤 ICP 하강 확인)
  - X1 `ICP가 이십을 넘어서면 즉시 멈추고 선배에게 말하세요` → `ICP가 이십에 가까워지면 진정제를 미리 준비해 두세요`
  - X2 `ICP가 이십을 넘어서면 즉시 멈추고 체위를 살피세요` → `다시 진정시킨 다음 ICP 숫자가 내려오는지 지켜보세요`
- **15.0** `A blown pupil means herniation — give hypertonic and hyperventilate now.` — ko `동공이 산대되면 뇌탈출을 뜻하니, 고장액을 주고 즉시 과호흡을 시작하세요.`  
  (저작자 질문) X1 `출혈을 뜻하니`·X2 `경련을 뜻하니` — 처치는 그대로지만 "산대 동공 = 뇌탈출"이라는 판단 기준을 바꿈(경련으로 알면 항경련제로 갈 수 있음) → 실패. 판단 대상 징후만 다른 뇌탈출 징후(쿠싱 징후)로 — 그대로 해도 같은 처치라 해가 없음
  - X1 `동공이 산대되면 출혈을 뜻하니, 고장액을 주고 즉시 과호흡을 시작하세요` → `호흡이 불규칙해지면 뇌탈출을 뜻하니, 고장액을 주고 즉시 과호흡을 시작하세요`
  - X2 `동공이 산대되면 경련을 뜻하니, 고장액을 주고 즉시 과호흡을 시작하세요` → `맥박이 느려지면 뇌탈출을 뜻하니, 고장액을 주고 즉시 과호흡을 시작하세요`
- **15.1** `One pupil is blown and fixed, and that's herniation until proven otherwise.` — ko `한쪽 동공이 산대되고 고정됐다면, 다른 게 증명되기 전까지는 뇌탈출로 봐요.`  
  X1 `뇌졸중으로 봐요`·X2 `감염으로 봐요` — "증명되기 전까지 뇌탈출로 본다"는 안전 쪽 판단을 바꿈 → 뒤 단계(호출 시간·고장액 준비)
  - X1 `한쪽 동공이 산대되고 고정됐다면, 다른 게 증명되기 전까지는 뇌졸중으로 봐요` → `한쪽 동공이 산대되고 고정됐다면, 몇 분 안에 신경외과가 와야 해요`
  - X2 `한쪽 동공이 산대되고 고정됐다면, 다른 게 증명되기 전까지는 감염으로 봐요` → `한쪽 동공이 산대되고 고정됐다면, 의사가 오는 동안 고장액을 준비해요`
- **15.3** `I'm draining the EVD and elevating his head immediately.` — ko `즉시 EVD를 배액하고 머리를 올릴게요.`  
  X1 `신경외과에 말할게요`·X2 `산소를 살필게요` — 두부 거상(처치)을 다른 일로 바꿈 → 앞 단계·같이 하는 일
  - X1 `즉시 EVD를 배액하고 신경외과에 말할게요` → `EVD를 배액하려고 높이부터 읽을게요`
  - X2 `즉시 EVD를 배액하고 산소를 살필게요` → `즉시 머리를 올리면서 양쪽 동공도 함께 비춰요`
- **15.4** `Get the anesthesiologist and OR team moving right now.` — ko `마취과 의사와 수술실 팀을 지금 바로 움직이게 하세요.`  
  X1 `맞이하세요`·X2 `안내하세요` — 팀을 움직이게 하는 대신 맞이·안내만 함(지연) → 같이 하는 일·뒤 단계
  - X1 `마취과 의사와 수술실 팀을 지금 바로 맞이하세요` → `마취과 의사와 수술실 팀이 올 때까지 기도를 지키세요`
  - X2 `마취과 의사와 수술실 팀을 지금 바로 안내하세요` → `마취과 의사와 수술실 팀을 부르고 보호자께도 연락하세요`
- **16.1** `No fluctuation and rising ICP together usually mean it's blocked.` — ko `파동이 없고 ICP가 함께 올라가면 보통 막혔다는 뜻이에요.`  
  X1 `새고 있다`·X2 `빠졌다` — 막힘 판단을 다른 판단으로 바꿈 → 판단 뒤 행동
  - X1 `파동이 없고 ICP가 함께 올라가면 보통 새고 있다는 뜻이에요` → `파동이 없고 ICP가 함께 올라가면 보통 바로 연락해야 해요`
  - X2 `파동이 없고 ICP가 함께 올라가면 보통 빠졌다는 뜻이에요` → `파동이 없고 ICP가 함께 올라가면 수평부터 확인해요`
- **16.2** `Don't flush without an order; call neurosurgery now.` — ko `지시 없이 플러싱하지 말고, 지금 신경외과에 연락하세요.`  
  (저작자 질문) X1 `혼자 플러싱하지 말고`·X2 `서둘러 플러싱하지 말고` — 금지의 조건을 바꿔 "둘이면/천천히면 플러싱해도 된다"로 읽힘. 간호사는 EVD를 플러싱하지 않음 → 위험, 실패. 금지 조항은 그대로 두고 뒤 단계만 바꿈
  - X1 `혼자 플러싱하지 말고, 지금 신경외과에 연락하세요` → `지시 없이 플러싱하지 말고, 신경외과가 올 때까지 곁에 계세요`
  - X2 `서둘러 플러싱하지 말고, 지금 신경외과에 연락하세요` → `지시 없이 플러싱하지 말고, 연락한 시각을 기록하세요`
- **16.3** `Try repositioning once before you call it truly blocked.` — ko `정말 막혔다고 말하기 전에 한 번 재위치를 시도해 보세요.`  
  X1 `수평을 살펴보세요`·X2 `파형을 지켜보세요` — 재위치 시도를 확인으로 바꿈(가벼운 실패) → 앞 단계·뒤 단계
  - X1 `정말 막혔다고 말하기 전에 한 번 수평을 살펴보세요` → `재위치를 시도하려면 머리를 받쳐 줄 동료를 부르세요`
  - X2 `정말 막혔다고 말하기 전에 한 번 파형을 지켜보세요` → `재위치를 시도해도 계속 막혀 있으면 바로 알리세요`
- **16.4** `If it over-drained, we reposition and reassess immediately.` — ko `과배액됐다면 즉시 재위치하고 재평가할게요.`  
  X1 `선배에게 말할게요` — 재평가를 다른 일로, X2 `활력징후를 볼게요` — 재평가의 일부라 정답 둘 → 다른 뒤 단계·예방
  - X1 `과배액됐다면 즉시 재위치하고 선배에게 말할게요` → `과배액이면 즉시 재위치하고 신경외과에 알려요`
  - X2 `과배액됐다면 즉시 재위치하고 활력징후를 볼게요` → `과배액을 막으려고 옮길 때는 꼭 잠가요`
- **17.3** `I'll get neurosurgery to the bedside now.` — ko `지금 신경외과를 침상 곁으로 데려올게요.`  
  X1 `신경외과 자료를 가져올게요` — 호출 대신 자료(지연), X2 `침상 곁으로 안내할게요` — 데려오는 것과 같은 뜻(정답 둘) → 같이 하는 일·뒤 단계
  - X1 `지금 신경외과 자료를 침상 곁으로 가져올게요` → `신경외과가 오기 전에 CT를 띄울게요`
  - X2 `지금 신경외과를 침상 곁으로 안내할게요` → `신경외과가 오면 동공 변화를 말씀드릴게요`
- **17.4** `Loop in the family now that surgery is a real possibility.` — ko `수술이 실제 가능성이 된 만큼 가족도 합류시키세요.`  
  X1 `약사도`·X2 `영양사도` 합류 — 수술 가능성을 가족에게 알리는 일을 다른 사람으로 바꿈(호출 대상) → 앞·뒤 단계
  - X1 `수술이 실제 가능성이 된 만큼 약사도 합류시키세요` → `가족이 도착하시면 조용한 면담실로 모시세요`
  - X2 `수술이 실제 가능성이 된 만큼 영양사도 합류시키세요` → `가족이 합류하면 신경외과가 직접 설명하게 해 주세요`
- **18.2** `Let's get a stat CT and call neurosurgery.` — ko `즉시 CT를 찍고 신경외과에 연락해요.`  
  X1 `영상을 보내요`·X2 `결과를 팀과 봐요` — 신경외과 연락을 다른 일로(지연) → 앞·뒤 단계
  - X1 `즉시 CT를 찍고 신경외과에 영상을 보내요` → `CT를 찍으러 가려고 진정 상태부터 챙겨요`
  - X2 `즉시 CT를 찍고 결과를 팀과 봐요` → `CT를 찍은 후 동공 변화를 기록해요`
- **18.3** `I'm reversing any anticoagulation per protocol now.` — ko `지금 프로토콜에 따라 항응고를 역전시키고 있어요.`  
  X1 `약물 목록을 훑어보고`·X2 `검사를 채혈하고` — 역전(처치)을 확인·채혈로 → 앞·뒤 단계
  - X1 `지금 프로토콜에 따라 항응고 약물 목록을 훑어보고 있어요` → `역전시키려고 마지막 투여 시각을 확인하고 있어요`
  - X2 `지금 프로토콜에 따라 항응고 검사를 채혈하고 있어요` → `프로토콜대로 역전시킨 다음 응고 검사도 보낼게요`
- **18.4** `Notify the surgeon immediately if repeat imaging confirms growth.` — ko `재영상 검사에서 증가가 확인되면 즉시 외과의에게 알리세요.`  
  X1 `영상을 보내세요`·X2 `수술 동의서를 확인` — 외과의 호출을 다른 일로 → 앞 단계·뒤 단계
  - X1 `재영상 검사에서 증가가 확인되면 즉시 외과의에게 영상을 보내세요` → `재영상 검사 때 비교할 수 있게 지난 CT를 띄우세요`
  - X2 `재영상 검사에서 증가가 확인되면 즉시 수술 동의서를 확인하세요` → `재영상 검사에서 증가가 확인되면 외과의 다음으로 가족에게 알리세요`
- **19.0** `Massive dilute urine with rising sodium points to DI.` — ko `희석된 소변이 대량으로 나오고 나트륨이 오르면 요붕증을 가리켜요.`  
  X1 `칼륨이 오르면` — 판단 기준 수치 바꿈, X2 `심부전을` — 요붕증을 심부전으로 알면 수분 제한·이뇨로 탈수가 심해짐 → 뒤 단계·앞 단계
  - X1 `희석된 소변이 대량으로 나오고 칼륨이 오르면 요붕증을 가리켜요` → `희석된 소변이 대량으로 나오고 나트륨이 오르면 팀에 알려요`
  - X2 `희석된 소변이 대량으로 나오고 나트륨이 오르면 심부전을 가리켜요` → `희석된 소변이 대량으로 나오면 나트륨과 소변 비중부터 재요`
- **19.1** `Huge urine output with sodium climbing usually means DI, not SIADH.` — ko `소변량이 엄청나고 나트륨이 치솟으면 보통 SIADH가 아니라 요붕증을 뜻해요.`  
  X2 `신부전을` — 수분 제한 쪽으로 갈 수 있음 → 해가 없는 다른 원인. X1 `당뇨`는 DI/DM이 들리고 그대로 해도(혈당 확인) 해가 없어 통과
  - X2 `소변량이 엄청나고 나트륨이 치솟으면 보통 SIADH가 아니라 신부전을 뜻해요` → `소변량이 엄청나고 나트륨이 치솟으면 보통 SIADH가 아니라 갑상선 문제를 뜻해요`
- **19.3** `Let's match fluids to the pattern and recheck sodium closely.` — ko `양상에 맞춰 수액을 조정하고 나트륨을 자세히 다시 확인해요.`  
  X1 `팀과 나트륨을 의논` — 나트륨 재확인을 의논으로 → 뒤 단계(체중)
  - X1 `양상에 맞춰 수액을 조정하고 나서 팀과 나트륨을 의논해요` → `양상에 맞춰 수액을 조정하고 체중도 매일 달아요`
- **19.4** `Restrict free water if it's SIADH, or replace losses if it's DI.` — ko `SIADH면 수분을 제한하고, 요붕증이면 손실량을 보충하세요.`  
  (저작자 질문) 제한·보충을 서로 뒤집지 않은 것은 좋음. 그러나 X1 `수분을 계산하고`·X2 `적어 두고 … 계산하세요` — 처치를 계산·기록으로 바꿈 → 실패. 한쪽 갈래는 그대로 두고 다른 갈래만 앞 단계로
  - X1 `SIADH면 수분을 계산하고, 요붕증이면 손실량을 보충하세요` → `SIADH면 섭취량부터 계산하고, 요붕증이면 손실량을 보충하세요`
  - X2 `SIADH면 수분 섭취를 적어 두고, 요붕증이면 손실량을 계산하세요` → `SIADH면 수분을 제한하고, 요붕증이면 소변량부터 재세요`

### B. distractorsKo — 정답 둘(④) — 3문장

- **8.4** `If it's blocked, don't flush, reposition and reassess first.` — ko `막혔다면 플러싱하지 말고 재위치와 재평가부터 먼저 하세요.`  
  (저작자 질문) 금지 조항은 둘 다 유지해서 좋음. X1(손 씻기, 앞 단계)은 통과. X2 `재위치와 재평가 후에 선생님께 보고`는 정답 행동을 그대로 담고 보고를 덧붙여 정답 둘 → 순서가 다른 안전한 말로
  - X2 `막혔다면 플러싱하지 말고 재위치와 재평가 후에 선생님께 보고하세요` → `막혔다면 플러싱하지 말고 신경외과에 먼저 연락하세요`
- **10.4** `Watch his CO2 trend so we don't overshoot and cut flow too much.` — ko `너무 과하게 혈류를 차단하지 않도록 CO2 추이를 지켜볼게요.`  
  X1 `호흡수를 올리지 않도록` — 과호흡을 과하게 하지 말라는 같은 뜻(정답 둘에 가까움) → 이유 바꾸기
  - X1 `너무 과하게 호흡수를 올리지 않도록 CO2 추이를 지켜볼게요` → `너무 과하게 혈압을 떨어뜨리지 않도록 CO2 추이를 지켜볼게요`
- **17.2** `Let's confirm sedation, osmotic doses, and CO2 are optimized.` — ko `진정, 삼투요법 용량, CO2가 다 최적화됐는지 확인해요.`  
  X1 `약사에게 물어봐요`·X2 `차트를 훑어봐요` — 확인 방법만 바뀌어 정답 둘 → 앞·뒤 단계
  - X1 `진정, 삼투요법 용량, CO2가 다 최적화됐는지 약사에게 물어봐요` → `진정, 삼투 용량, CO2를 점검하기 전에 동공부터 재요`
  - X2 `진정, 삼투요법 용량, CO2가 다 최적화됐는지 차트를 훑어봐요` → `진정, 삼투요법 용량, CO2가 최적화됐다면 신경외과를 불러요`

### C. distractorsKo — 길이(②)·되풀이·기타 — 15문장

- **0.0** `Can you squeeze my hand for me?` — ko `제 손을 좀 꽉 쥐어 보시겠어요?`  
  X1 길이(오답 둘 다 정답보다 김) — "높이"를 뺌
  - X1 `제 손을 좀 높이 들어 보시겠어요?` → `제 손을 좀 들어 보시겠어요?`
- **0.1** `I'm checking how alert he is, his pupils, and his hand strength.` — ko `각성 정도와 동공, 손 힘을 확인하고 있어요.`  
  오답 둘 다 정답보다 김, X2 `알려요`(알리다 되풀이) → 뒤 단계 기록으로
  - X1 `각성 정도와 동공, 손 힘을 보려고 손부터 씻어요` → `각성 정도와 동공, 손 힘을 확인하려고 손부터 씻어요`
  - X2 `각성 정도와 동공, 손 힘을 본 뒤 결과를 알려요` → `각성, 동공, 손 힘을 확인한 뒤 기록해요`
- **0.2** `His pupils are equal and reactive to light right now.` — ko `지금 동공은 양쪽이 같고 빛에 반응해요.`  
  X1·X2가 "동공이 소리/냄새에 반응" — 아무도 하지 않을 말이라 듣지 않고 걸러짐. X1만 들리는 자리(pupils)를 바꿈, 길이도 맞춤
  - X1 `지금 동공은 양쪽이 같고 소리에 반응해요` → `지금 눈은 양쪽이 같고 빛에 반응해요`
- **2.3** `The system only works if it's positioned exactly right.` — ko `이 시스템은 정확한 위치에 있어야만 작동해요.`  
  오답 둘 다 정답보다 김 → X1 줄임
  - X1 `이 시스템은 정확한 전원에 연결돼야만 작동해요` → `이 시스템은 전원에 연결돼야만 작동해요`
- **3.2** `We aim to keep the pressure low and the flow adequate.` — ko `압력은 낮게, 혈류는 충분하게 유지하는 게 목표예요.`  
  오답 둘 다 정답보다 김 → X2 줄임
  - X2 `압력은 낮게, 혈류는 충분하게 유지하려고 알람 한도부터 맞춰요` → `압력은 낮게, 혈류는 충분하게 하려고 알람을 맞춰요`
- **3.4** `I watch these closely and act if they move out of range.` — ko `이 수치들을 자세히 지켜보다가 범위를 벗어나면 조치할게요.`  
  오답 둘 다 정답보다 김 → X2 줄임
  - X2 `이 수치들을 자세히 지켜보다가 범위를 벗어나면 환자를 살필게요` → `이 수치들을 보다가 벗어나면 환자 상태부터 챙길게요`
- **6.2** `If it stays high, we'll move to osmotic therapy.` — ko `계속 높으면 삼투요법으로 넘어갈게요.`  
  X2 길이 1.26배·5자 → 줄임, 오답 하나는 정답 길이 이하로
  - X1 `계속 높으면 삼투요법 처방부터 볼게요` → `계속 높으면 삼투요법 처방을 찾아요`
  - X2 `계속 높으면 삼투요법 쓰려고 체중부터 잴게요` → `계속 높으면 삼투요법 쓰려고 체중을 달아요`
- **7.3** `Check blood pressure so he doesn't get too dry.` — ko `너무 건조해지지 않게 혈압도 확인할게요.`  
  오답 둘 다 정답보다 김 → X1 줄임
  - X1 `너무 건조해지지 않게 혈압 커프부터 점검할게요` → `너무 건조해지지 않게 커프부터 점검해요`
- **8.0** `Let's confirm the drain is level and the tubing isn't kinked.` — ko `배액관이 수평인지, 튜빙이 꼬이지 않았는지 확인해 봐요.`  
  X2 41자 — 1.37배(②) → X2 줄이고, X1을 정답 길이 이하로
  - X1 `배액관이 수평인지, 튜빙이 꼬이지 않았는지 보려고 손 위생부터 해요` → `배액관 수평과 튜빙 꼬임을 보려고 장갑부터 껴요`
  - X2 `배액관이 수평인지, 튜빙이 꼬이지 않았는지 본 뒤에 벽 쪽 알람을 켜 둬요` → `배액관이 수평인지, 튜빙이 꼬이지 않았는지 본 뒤 알람을 켜요`
- **9.1** `If pressor alone isn't enough, we add fluid too.` — ko `승압제만으로 충분하지 않으면 수액도 추가해요.`  
  X2 `선배에게` — 선배 되풀이(5회) → 팀과 계획
  - X2 `승압제만으로 충분하지 않으면 선배에게 먼저 물어봐요` → `승압제만으로 모자라면 팀과 계획을 정해요`
- **11.3** `I'll watch for subtle signs like twitching or eye deviation.` — ko `씰룩거림이나 눈 편위 같은 미묘한 징후를 지켜볼게요.`  
  X1 `선배께 말할게요` — 선배·말 되풀이, 둘 다 정답보다 김 → 줄임
  - X1 `씰룩거림이나 눈 편위 같은 미묘한 징후를 보면 선배께 말할게요` → `씰룩거림이나 눈 편위가 보이면 바로 보고할게요`
- **13.3** `Let's have osmotic therapy on hand in case it spikes.` — ko `혹시 급상승할 경우를 대비해 삼투요법을 준비해 둘게요.`  
  X2 `보호자가 찾을 경우` — 삼투요법과 상관없어 듣지 않고 걸러짐, 둘 다 김 → 이동 지연
  - X1 `혹시 길이 막힐 경우를 대비해 삼투요법을 준비해 둘게요` → `혹시 길이 막힐 때를 대비해 삼투요법을 준비해 둘게요`
  - X2 `혹시 보호자가 찾을 경우를 대비해 삼투요법을 준비해 둘게요` → `혹시 이동이 길어질 경우를 대비해 삼투요법을 준비해 둘게요`
- **14.0** `We'll briefly lighten sedation to assess his neuro status.` — ko `잠깐 진정을 얕춰서 신경학적 상태를 사정할게요.`  
  ko·오답의 `얕춰서/얕추려고/얕춘` 오타(저작자 메모) — "얕게 해서"로. 새 ko에 맞춰 오답 둘도 다시 씀. 길이도 맞춤
  - 새 ko → `잠깐 진정을 얕게 해서 신경학적 상태를 사정할게요.`
  - X1 `잠깐 진정을 얕추려고 신경학적 상태를 미리 적어 둘게요` → `진정을 얕게 하기 전에 신경 상태를 적어 둘게요`
  - X2 `잠깐 진정을 얕춘 뒤에 신경학적 상태를 보고할게요` → `잠깐 진정을 얕게 한 뒤에 신경학적 상태를 보고할게요`
- **15.2** `Call neurosurgery stat and prep for the OR.` — ko `즉시 신경외과에 연락하고 수술실을 준비하세요.`  
  오답 둘 다 정답보다 김 → X2 줄임
  - X2 `즉시 신경외과에 연락하고 영상 자료를 준비하세요` → `즉시 신경외과에 연락하고 영상을 띄우세요`
- **20.4** `When you're ready, we can talk about organ donation, but there's no rush.` — ko `준비되시면 장기기증에 대해 이야기할 수 있지만, 서두르실 필요는 없어요.`  
  오답 둘 다 정답보다 김 → X2 줄임
  - X2 `준비되시면 병원 규정에 대해 이야기할 수 있지만, 서두르실 필요는 없어요` → `준비되시면 병원 규정을 이야기할 수 있지만, 서두르실 필요는 없어요`

### 저작자가 물은 곳 — 판정 요약
| 문장 | 판정 | 한 줄 |
|---|---|---|
| 6.1 체위 먼저·약 다음 | 실패 | 소독·침구가 2단계 처치(약)를 대신함. 바꿀 세부가 없는 순서 규칙이라 "참인 다른 이유"(부담이 적은·쉬운 순서)로 |
| 8.4 금지 조항 | X1 통과·X2 실패 | 금지 유지는 좋음. X2가 정답 행동을 다 담고 보고를 덧붙여 정답 둘 |
| 16.2 금지 조항 | **둘 다 실패(위험)** | `혼자`·`서둘러`가 "조건이 맞으면 플러싱 가능"으로 읽힘 |
| 9.4 확인 대상 바꾸기 | 둘 다 실패 | 과부하 징후 대신 알레르기·라인 부위를 봄 |
| 13.2 EVD 조작 | 둘 다 실패 | 이송 전 잠금을 높이 보기·소독으로 바꿈 |
| 14.4 기준 20·멈춤 | 둘 다 실패 | 기준·멈춤 유지는 좋으나 재진정을 선배 호출·체위 보기로 바꿈 |
| 15.0 진단 이름만 | 둘 다 실패 | 처치는 같아도 "산대 동공 = 뇌탈출" 판단을 바꿈. 다른 뇌탈출 징후로 바꾸면 해가 없음 |
| 10.1 반대·부정 | 통과 | 부정은 정답 쪽에 있고 오답은 `ongoing`만 바꿈(처음 하는·약물 요법) — 뒤집기 아님 |
| 19.4 반대·부정 | 실패(뒤집기 때문은 아님) | 제한↔보충을 뒤집지 않아 좋음. 처치를 계산·기록으로 바꾼 것이 실패 |

## 고칠 것 — 빈칸 (갈래 2·정답 둘) — 52문장
"→" 뒤는 새 오답 셋(정답은 그대로). 넣어 읽어 문법이 맞는지 확인했습니다.
- **정답 둘** 8.4 `If it's [blocked]` — `tilted`(기울었으면 재위치가 맞는 대응이라 정답 둘), `cold`·`loud` 동떨어짐 → `clear` / `draining` / `full`
- 1.1 `lower the [pressure]` noise/heat/color → `temperature` / `oxygen` / `activity`
- 1.3 `check his [alignment]` consent/diet/paperwork → `weight` / `temperature` / `appetite`
- 1.4 `instead of [pooling]` shrinking/burning/freezing → `clotting` / `bleeding` / `leaking`
- 2.2 `leveled [precisely]` loudly/quickly/randomly → `quickly` / `gently` / `firmly` (`roughly`·`loosely`는 위험한 관행으로 읽혀 피함)
- 2.4 `check the [drain]` doctor/window/clock → `dressing` / `monitor` / `pump`
- 3.1 `The [top] number` left/side/back → `left` / `right` / `middle`
- 3.4 `watch these [closely]` loudly/fondly/proudly → `briefly` / `remotely` / `silently`
- 4.0 `Keeping him [calm]` busy/angry/hungry → `awake` / `active` / `restless`
- 4.3 `assess his [comfort]` consent/insurance/luggage → `appetite` / `hearing` / `vision`
- 4.4 `[adjust] his medicine` hide/borrow/sell → `label` / `list` / `store` (`stop`·`double`·`skip`은 위험한 지시로 읽혀 피함)
- 5.2 `cluster his [care]` mail/laundry/paperwork → 빈칸을 `cluster`로 옮기고 `scatter` / `rush` / `repeat` (명사 자리는 visits·labs처럼 장면상 맞는 말이 많아 정답 둘이 됨)
- 6.0 `optimize his [position]` diet/shirt/name → `mobility` / `nutrition` / `hygiene` (`ventilation`·`fluids`는 실제 1단계라 정답 둘)
- 6.1 `in that [order]` gift/habit/rule(관용구라 문법으로 걸러짐) → 빈칸을 `first`로 옮기고 `last` / `later` / `again`
- 6.2 `move to [osmotic] therapy` speech/music/physical → `oxygen` / `antibiotic` / `physical` (`steroid`는 뇌손상에 금기라 피함, `cooling`은 실제 3단계라 정답 둘)
- 6.4 `per [parameters]` preference/tradition/impulse → `request` / `routine` / `estimate`
- 7.0 `the ICP [response]` price/brand/color → `cable` / `sensor` / `label` (`waveform`은 정답 둘)
- 7.1 `weight-based [dosing]` labeling/billing/storage → `labeling` / `feeding` / `fluids`
- 7.2 `urine output [closely]` quietly/gladly/slowly → `separately` / `manually` / `together`
- 7.3 `too [dry]` tall/loud/bored → `wet` / `cold` / `sleepy`
- 8.0 `the drain is [level]` early/silent/heavy → `tilted` / `full` / `warm`
- 8.1 `with [respirations]` footsteps/blinks/sneezes → `alarms` / `feedings` / `visitors` (`heartbeats`는 ICP 파형이 심박에도 오르내려 정답 둘)
- 8.2 `not [draining] well` charging/printing/freezing → `clotting` / `healing` / `cooling`
- 8.3 `[notify] neurosurgery` thank/greet/invite → 빈칸을 `blocked`로 옮기고 `clear` / `level` / `labeled` (notify 자리는 call·page가 모두 정답)
- 9.2 `he's [adequately] filled` partly/quietly/freely → `partly` / `barely` / `overly`
- 9.3 `without [overloading]` chilling/starving/bruising → `waking` / `turning` / `warming` (`drying`은 탈수를 피하는 것도 목표라 정답 둘)
- 10.1 `This only [works]` hurts/sleeps/waits → 빈칸을 `ongoing`으로 옮기고 `emergency` / `rescue` / `temporary` (`lasts`는 정답 둘)
- 10.2 `temporary [bridge]` cure/goal/habit → `cure` / `goal` / `test` (`fix`는 정답 둘)
- 10.4 `cut [flow]` sleep/hunger/speed → `sedation` / `fluids` / `feeds`
- 11.1 `if [ordered]` hoped/wanted/feared → `delayed` / `missed` / `refused` (`needed`는 정답 둘)
- 11.3 `[subtle] signs` loud/wet/sweet → `obvious` / `dramatic` / `late`
- 12.0 `pull [fluid]` heat/sugar/noise → `blood` / `oxygen` / `heat`
- 12.2 `the [hypertonic] fluid` chilled/scented/sweet → `isotonic` / `maintenance` / `irrigation` (`hypotonic`은 뇌부종에 위험한 수액이라 피함)
- 13.0 `during [transport]` dinner/visiting/laundry → `rounds` / `surgery` / `handoff`
- 13.1 `before we [head] to CT` drive/fly/sail → `talk` / `write` / `report` (`go`는 정답 둘, `lighter`로 옮기면 위험한 지시)
- 13.2 `per [protocol]` luck/faith/chance → `preference` / `schedule` / `memory`
- 14.0 `to [assess]` predict/announce/sketch → `predict` / `announce` / `report`
- 14.1 `before the [exam]` shower/visit/nap → `bath` / `meal` / `turn`
- 14.2 `most [stable]` hungry/busy/noisy → `sedated` / `agitated` / `febrile`
- 14.3 `his ICP [closely]` proudly/politely/gladly → 빈칸을 `climbs`로 옮기고 `drops` / `settles` / `stabilizes`
- 15.3 `I'm [draining]` labeling/cleaning/photographing → `labeling` / `cleaning` / `leveling` (`clamping`·`flushing`은 위험한 지시)
- 15.4 `Get the [anesthesiologist]` cardiologist/dermatologist/nutritionist → `radiologist` / `cardiologist` / `pharmacist`
- 16.0 `it may be [blocked]` dry/noisy/slow → `full` / `warm` / `dry` (`slow`·`loose`·`leaking`은 점검할 이유가 되어 정답 둘)
- 17.0 `[decompressive] surgery` reconstructive/cosmetic/dental → `elective` / `spinal` / `cardiac`
- 17.2 `[osmotic] doses` vitamin/iron/zinc → `insulin` / `antibiotic` / `vitamin`
- 17.4 `a real [possibility]` accident/mistake/surprise → `delay` / `cost` / `problem` (`option`은 정답 둘)
- 18.1 `A new [deficit]` dressing/visitor/order → `fever` / `rash` / `medication`
- 18.4 `repeat [imaging]` paperwork/charting/billing → `labs` / `vitals` / `EEG`
- 19.3 `recheck sodium [closely]` gladly/warmly/softly → 빈칸을 `pattern`으로 옮기고 `shift` / `budget` / `weight` (부사 자리에 later·tomorrow를 넣으면 지연 지시)
- 19.4 `replace [losses]` gains/charts/orders → `gains` / `lines` / `dressings` (`sodium`·`fluids`는 위험·정답 둘)
- 20.1 `two [separate] exams` painful/costly/brief → `joint` / `brief` / `costly` (`painful`은 가족을 겁줌)
- 20.2 `The team will [explain]` photograph/sell/borrow → `record` / `schedule` / `repeat`
- 20.4 `organ [donation]` insurance/parking/visitation → `function` / `failure` / `support` (`transplant`는 정답 둘)

통과로 둔 것(같은 분야에서 틀린 말): 0.0·0.1·0.2·0.3·0.4·1.0·1.2·2.0·2.1·2.3·3.0·3.2·3.3·4.1·4.2·5.0·5.1·5.3·5.4·7.4·9.0·9.1·9.4·10.0·10.3·11.0·11.2·11.4·12.1·12.3·12.4·13.3·13.4·14.4·15.0·15.1·15.2·16.1·16.2·16.3·16.4·17.1·17.3·18.0·18.2·18.3·19.0·19.1·19.2·20.0·20.3. (16.2 `remove/raise/open`은 "지시 없이 하지 말 것"으로 모두 참이지만 장면의 유혹이 flush라 둠.)

## 고칠 것 — decoy — 17문장
- **처치를 늦추거나 위험하게 읽힘(12)**
  - 6.2 `by tonight` → `…move to osmotic therapy by tonight`(삼투요법 지연) → `to the ward`
  - 8.4 `with a syringe` → `reposition and reassess with a syringe`(EVD를 주사기로), `don't flush with a syringe first` → `in the hallway`
  - 10.1 `for the shift` → `This only works for the shift`(과호흡을 근무 내내) → `for the family`
  - 10.3 `at midnight` → `return to normal at midnight`(정상화 지연) → `in the lab`
  - 10.4 `every day` → `Watch his CO2 trend every day`(감시 간격) → `at the nurses' station`
  - 12.4 `in an hour` → `so we correct in an hour`(빠른 교정은 반동 부종) → `at the desk`
  - 14.0 `for tonight` → `lighten sedation for tonight`(밤새 얕게) → `by the window`
  - 14.4 `for a while` → `If ICP climbs past twenty for a while, stop…`(멈춤 지연) → `on the phone`
  - 15.3 `with a clamp` → 배액의 반대 조작(브리프 "decoy를 반대말로") → `with a pen`
  - 16.2 `for now` → `Don't flush for now; call…`(나중엔 해도 되는 것처럼) → `on the whiteboard`
  - 17.3 `in an hour` → `get neurosurgery to the bedside in an hour` → `with the scans`
  - 18.4 `in a day` → `Notify the surgeon in a day` → `on the unit`
- **`ko`에 그대로 맞는 다른 문장(정답 둘, 2)**
  - 9.0 `with a drip` → `support his blood pressure with a drip`(승압제가 곧 점적) → `with a cuff`
  - 13.3 `in the cart` → `have osmotic therapy in the cart in case it spikes`("준비해 둘게요"에 맞음) → `at the front desk`
- **가벼움(3)**: 4.3 `at night`(`assess his comfort at night` — 사정 간격이 밤으로 줄어듦) → `on the form`; 7.4 `at noon`(재검 시각이 바뀐 맞는 문장) → `in his urine`; 14.3 `at times`(`I'll watch at times`) → `in the notes`

## 고칠 것 — order — 6장
- **S9 (임상 순서, 심각)** 수액(정상 혈량) 먼저, 승압제 다음으로 바꿉니다. 제안:
  L1 [수액] `To raise his CPP, we first make sure he's adequately filled.` (CPP를 올리려고 먼저 수액이 충분한지 확인해요)
  L2 [감시] `Before I push more, I'll watch for crackles and other overload signs.` (더 넣기 전에 수포음 같은 과부하 징후를 살펴볼게요)
  L3 [승압] `If that's still not enough, we support his pressure with a pressor.` (그래도 모자라면 승압제로 혈압을 받쳐요)
  L4 [균형] `That's how I balance flow to his brain without overloading him.` — why도 "수액으로 채우고, 과부하를 보며, 모자라면 승압제로 받치고, 균형으로 맺어요"로. 9.1 en은 A에 넘김.
- **S15 (임상 순서 + 2↔3)** 신경외과 호출을 앞으로, `To support that`/`For that` 고리를 없앱니다:
  L1 `One pupil is blown and fixed — that's herniation until proven otherwise.`
  L2 [호출] `Call neurosurgery stat while I drain the EVD and raise his head.` (제가 EVD를 배액하고 머리를 올리는 동안 신경외과에 즉시 연락하세요)
  L3 [지시] `As they're paged, give hypertonic and hyperventilate per order.` (호출하는 대로 지시대로 고장액을 주고 과호흡을 시작하세요)
  L4 [소집] `With surgery likely, get the anesthesiologist and OR team moving.` (수술 가능성이 크니 마취과와 수술팀을 움직이게 하세요)
- **S1 (2↔3)** L3 `To protect it, we avoid turning his neck.`는 L1 뒤에도 읽힘(`it` = 머리 자세) → `To keep that drainage open, we avoid turning his neck.` (그 배액이 잘 되도록 목을 돌리지 않게 해요)
- **S12 (2↔3)** L2 `That's why…`와 L3 `So I check…`가 서로 자리를 바꿔도 읽힘 → L2 `So the high number on his labs is on purpose.` (그래서 검사지의 높은 수치는 일부러예요) / L3 `To hold that number, I check levels often and titrate the hypertonic fluid.` (그 수치를 지키려고 자주 보며 고장성 수액을 적정해요)
- **S16 (2↔3)** L3 `Try repositioning once…`가 L1 바로 뒤에도 자연스러움 → `If so, try repositioning once before you call it truly blocked.` (그렇다면 정말 막혔다고 하기 전에 한 번 재위치를 시도하세요)
- **S20 (3↔4 약함)** L4 → `Until then, we'll support you and talk about his wishes when you're ready.` (그때까지 곁에서 지지하며, 준비되시면 환자분의 바람을 이야기할게요)
- 가벼움(고치지 않아도 됨): S11 L3 `With that confirmed,`는 EEG가 약 확인에 달린 것처럼 들림 → `Alongside that,` 권장. S6 why·L4는 신경외과 연락을 만니톨 뒤로 두지만 만니톨 요청 자체가 담당의 호출이라 둠.

## 고칠 것 — why·ko
- 14.0 ko `얕춰서` 오타(위 C에 새 ko). order S14 why `얕추어`·L2 ko `얕춰서`도 `얕게 해서`로.
- 9.2 ko 오역(위 A에 새 ko) — why `before increasing으로 늘리기 전에`는 그대로 써도 됨.
- 14.2 ko `각성 창을 맞춰요`는 한국어로 어색함(A 몫, 참고) — `깨워서 사정할 시간을 맞춰요`.

## 종합
빈칸 52문장·distractorsKo 67문장·decoy 17개·order 6장을 고치면 내보낼 수 있습니다. 가장 급한 것은 16.2(플러싱 조건), 13.2·14.x·15.x·17.3·18.x(응급 처치를 다른 일로 바꾼 오답), order S9·S15(임상 순서), 처치를 늦추는 decoy 12개입니다.
