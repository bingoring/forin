# or-timeout B 검토 (v46 절 1~6·8, 105문장 전수)

스크립트로 문장마다 `en | ko | 오답1 | 오답2`(길이 비율 포함), 빈칸 네 줄, decoy, order 인접 교환 3개를 모두 뽑아 한 줄씩 판정했다.
되풀이 상한은 "오답에는 있고 그 문장 정답 ko에는 없는 낱말"을 조사를 떼고 세고, 활용형은 어간으로 다시 셌다.

## 항목별 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 대부분 말하는 방식을 설명함. 사실 오류 2건(S7s2 드레이프, S11s2 재투여가 앞당겨진다는 말)과 과장 2건 |
| 2 빈칸 | 2 | 105문장 중 약 60문장의 오답이 장면과 상관없는 말(eat/lunch/parking/menu/sell/paint/sleeping)이거나, 확인을 뒤집는 말(forget/ignore/skip/hide/erase)이라서 읽기만 해도 걸러지고, 일부는 위험한 지시가 됨("We ignore significant blood loss", "Please pretend we're using latex-free") |
| 3 decoy | 4 | 104개는 괜찮음. 3개는 정답과 같은 뜻으로 조립됨(", okay", "Tell me when", ", while I"), 1개는 반대말("this alone") |
| 4 distractorsKo | 2 | ①②⑤는 대체로 지킴. 그러나 ⑥ 안전 시험 실패가 32문장임: 환자 확인 대상 바꾸기, "모두"를 한 역할로 좁히기, 확인 시점을 늦추기, 타임아웃이나 재확인을 다른 일로 바꾸기, 항생제 투여를 "도착"이나 "허가"로 바꾸기. 되풀이 상한도 넘음: "도착"이 8회(상한 5) |
| 5 order | 3 | 21장 중 9장이 인접 교환으로도 자연스럽거나 줄 문법이 어색함 |
| 6 tag·icon | 4 | 태그는 역할을 말하고 10자 이하. 초 단위 시간에 `calendar` 아이콘(S12s2·S16s1·S12s4)을 쓴 것만 약간 어긋남(바꿀 필수 사항 아님) |
| 8 파일럿 갈래 | 2 | 갈래 2(장면과 동떨어진 빈칸 오답)와 갈래 3(order를 못 박지 못함)이 되풀이됨. 빈칸에 반대말을 돌려쓴 묶음(forget/erase/hide, never/hardly/rarely)도 되풀이됨 |

## 심각한 문제
1. **distractorsKo 안전 시험 실패 32문장**(아래 A). 특히 다음이 문제다.
   - 환자 신원·알레르기의 주인을 보호자나 집도의로 바꿈: S0s0, S2s0, S10s0
   - 타임아웃 전원 확인을 마취과·집도의 한 역할로 좁힘: S1s2, S1s4, S2s2, S2s4, S12s1, S13s1, S15s3. S15s3 "마취과 멈추세요"는 wrong-site 직전에 나머지가 계속해도 되는 말이 됨
   - 재확인·안정화 시점을 "마무리/마치기/퇴실/퇴근 전"으로 늦춤: S13s2, S17s0, S17s4, S18s4, S20s1, S20s3, S20s4
   - 항생제 투여를 "도착"이나 "허가"로 바꿈: S4s3, S19s1 둘 다. S19s3은 "소독이 끝날 때까지"로 바꿔 항생제 누락 상태에서 절개하게 됨
   - S18s3 "가위를 내려놓으세요"(메스는 그대로), S8s0 "다음 케이스는 출혈"(이번 케이스에 대한 잘못된 안심), S8s4 "확보돼 있다고 전달"(확인 없이 전달)
2. **"도착" 되풀이 8회**(S3s2·S3s3·S4s1·S4s3·S8s1·S8s3·S19s0·S19s1). 아래 수정을 반영하면 4회가 된다. 수정 후 상한에 걸린 낱말은 집도의 5→3, 마취과 5→2, 설명·보고·전달·소독 각 5(그대로 두고 더하지 말 것), 분 5(숫자 상한 7 이내).
3. **why 사실 오류**: S7s2(표시는 드레이프 뒤에도 보여야 함, Joint Commission UP.01.02.01), S11s2(케이스가 길어져도 재투여 시점이 앞당겨지지 않음).
4. **빈칸 오답에 위험한 지시**: S8s0 ignore/disregard, S10s1 pretend/forget, S16s2 skip/delay, S14s0·S14s1 ignore/avoid, S11s3 delete/erase. 브리프가 금한 "하면 안 되는 처치를 오답으로 보이기"에 해당한다.

## 고칠 것 (총 122건, 그중 안전 32·정답 둘 6)

### A. distractorsKo: 안전 시험 실패(32)
| # | 어디 | 문제 | 새 값 |
|---|---|---|---|
| A1 | S0s0 둘 다 | 보호자분, 집도의 선생님: 확인 대상이 환자가 아님(빠뜨린 확인). 집도의 생년월일은 말도 안 됨 | "환자분 이름과 생년월일 출력 부탁드립니다" · "환자분 이름과 생년월일은 차트 첫 장에 있습니다" |
| A2 | S0s2 오답1 | "새로 생긴 알레르기만" 물으면 이미 알려진 알레르기 확인이 빠짐 | "마취 유도 전에 알레르기 팔찌를 채웠나요?" |
| A3 | S1s0 오답1 | 타임아웃을 회의로 바꿈(확인을 다른 일로) | "지금 음악을 끄고 타임아웃을 합시다" |
| A4 | S1s2 오답2 | "마취팀이 확인할 때까지"로 전원 확인을 좁힘 | "다 함께 확인할 때까지 이동하지 않겠습니다" |
| A5 | S1s3 둘 다 | 타임아웃을 인계로 바꿈. "퇴근하기 전에 타임아웃"은 시점이 틀렸고 아무도 하지 않을 말 | "시작하기 전에 타임아웃을 위해 잠시 모입시다" · "시작하기 전에 타임아웃을 위해 음악을 끕시다" |
| A6 | S1s4 오답2 | "마취팀이 멈춰야"로 좁힘 | "이 회의를 시작하기 전에 모두 멈춰야 합니다" |
| A7 | S2s0 오답2 | 보호자는 John Miller: 신원 대상을 바꿈 | "환자는 John Miller이고, 생년월일은 확인 중입니다" |
| A8 | S2s1 둘 다 | 오답1 "첫 건"은 en에 없고 정답에 하나를 더한 말(③④, 정답 둘). 오답2 "오늘 오후"는 좌우를 지움(⑥). 메모가 지적한 문장 | "다음 케이스는 오른쪽 무릎 관절경 수술입니다" · "어제 시술은 오른쪽 무릎 관절경 수술이었습니다" |
| A9 | S2s2 오답1 | "집도의도 동의하시나요": 전원 동의를 한 사람으로 좁힘 | "…표시돼 있습니다 — 모두 들리시나요?" |
| A10 | S2s4 오답1 | "마취과는 … 동의하시죠": 좁힘 | "모두 이게 오른쪽 무릎이라는 걸 보셨죠, 맞나요?" |
| A11 | S4s3 오답2 | 항생제가 "도착했는지"만 확인하면 투여 확인이 빠짐(S19 사고의 모양 그대로) | "항생제가 제때 투여됐는지 화면에 띄웁시다" |
| A12 | S8s0 오답2 | "다음 케이스는 상당한 출혈": 이번 케이스에 대한 잘못된 안심 | "이번 케이스는 상당한 출혈이 있었습니다" |
| A13 | S8s4 둘 다 | 오답1 "확보돼 있다고 전달"은 확인하지 않고 전달하는 말(잘못된 안심). 오답2 "물어볼게요"는 확인하는 방법 자체라 정답 둘 | "정맥로 물품이 카트에 있는지 확인할게요" · "정맥로가 확보돼 있는지 확인해 주세요" |
| A14 | S10s0 오답1 | "이 보호자는 라텍스 알레르기": 환자의 알레르기가 빠짐 | "이 환자는 라텍스 알레르기가 오늘 처음 확인됐습니다" |
| A15 | S11s1 오답2 | 타이머 대상을 재투여에서 수액으로 바꿈(항생제 재투여를 놓침) | "재투여를 놓치지 않게 다음 팀에 말해 둘게요" |
| A16 | S12s1 오답1 | "집도의가 참여해야 효과": 전원 참여 원칙을 틀리게 가르침 | "타임아웃은 모두가 참여해야 기록이 됩니다" |
| A17 | S13s0 오답2 | 재타임아웃을 인계로 바꿈 | "계획이 바뀌었으니 타임아웃을 다시 적읍시다" |
| A18 | S13s1 오답1 | "마취과가 확인해 주세요": 좁힘 | "새 시술과 부위를 모두 적어 주세요" |
| A19 | S13s2 오답1 | "마치기 전에 일치": 시술이 바뀐 뒤 일치 확인을 끝까지 미룸 | "계속하기 전에 다 같이 앉았으면 합니다" |
| A20 | S13s3 오답2 | "새 가운이 필요": 새 타임아웃을 다른 일로 바꿈 | "시술이 바뀌었으니 새 타임아웃 양식이 필요합니다" |
| A21 | S15s3 오답2 | "마취과 멈추세요": wrong-site 직전에 나머지는 계속해도 되는 말. 메모가 지적한 문장 | "다들 멈추세요 — 부위가 동의서와 맞는지 봅시다" |
| A22 | S15s4 오답1 | "접수될 때까지 진행 안 함": 불일치를 해결하지 않고 접수만 되면 진행함 | "이 불일치가 완전히 해결될 때까지 이동하지 않겠습니다" |
| A23 | S17s0 오답2 | "마치기 전에 우려를": 우려 제기를 끝까지 미룸 | "더 나아가기 전에 질문을 드려야겠습니다" |
| A24 | S17s4 오답1 | "퇴근하기 전에 재확인": 시점이 틀렸고 아무도 하지 않을 말 | "진행하기 전에 잠시 불을 켜고 재확인합시다" |
| A25 | S18s1 둘 다 | wrong-site 직전에 재확인을 "다시 소독", "다시 세기"로 바꿈 | "건네주세요 — 다시 확인해야 합니다" · "뒤로 물러나 주세요 — 다시 확인해야 합니다" |
| A26 | S18s3 오답1 | "가위를 내려놓으세요": 메스는 손에 든 채로 남음 | "지금 당장 멈추세요 — 메스를 저에게 주세요" |
| A27 | S18s4 둘 다 | 오답1 "마무리하기 전에"는 시점이 너무 늦음. 오답2 "어느 쪽인지 다시 그려야"는 확인 없이 표시를 다시 그림 | "계속하기 전에 어느 쪽인지 영상을 띄워야 합니다" · "계속하기 전에 어느 쪽인지 동의서를 가져와야 합니다" |
| A28 | S19s1 둘 다 | "도착할 때까지", "허가될 때까지" 보류: 투여 전에 절개하게 됨 | "투여될 때까지 타임아웃을 보류할 수 있을까요?" · "투여될 때까지 드레이프를 보류할 수 있을까요?" |
| A29 | S19s3 오답1 | "소독이 끝날 때까지 보류": 항생제 누락 상태에서 절개함 | "항생제가 투여될 때까지 모두 손을 멈춥시다" |
| A30 | S20s1 둘 다 | 오답1 "마무리하기 전에"는 불안정한 채로 진행하게 함. 오답2 "소독해야"는 안정화를 다른 처치로 바꿈 | "진행하기 전에 마취과가 안정시켜야 합니다" · "진행하기 전에 안정됐는지 봐야 합니다" |
| A31 | S20s3 오답1 | "퇴실하기 전에 재평가": 재평가 없이 진행함 | "진행하기 전에 활력징후를 출력합시다" |
| A32 | S20s4 둘 다 | 오답1 "마치기 전에"는 시점이 틀림. 오답2 "정리할 시간"은 안정화를 다른 일로 바꿈 | "계속하기 전에 마취과에 안정시킬 시간을 주세요" · "계속하기 전에 안정시킬 자리를 주세요" |

### B. distractorsKo: 정답 둘·뒤집기·어색함·되풀이(12)
| # | 어디 | 문제 | 새 값 |
|---|---|---|---|
| B1 | S1s1 오답2 | "선생님들 잠깐 주목해": "다들"과 같은 뜻이라 정답 둘 | "다들 잠깐 앉아 주시겠어요?" |
| B2 | S2s3 오답2 | "집도의와 확인합시다"는 together의 한 방법이라 정답 둘 | "시술과 부위를 함께 출력합시다" |
| B3 | S6s1 오답2 | "마취과와 확인"도 같은 이유로 정답 둘 | "동의서를 불러와서 함께 출력합시다" |
| B4 | S11s2 오답2 | "전화해 주세요"는 "알려 주세요"의 한 방법이라 정답 둘 | "케이스가 예정보다 길어지면 적어 주세요" |
| B5 | S11s4 오답1 | "예약"과 "계획"은 거의 같은 뜻이라 정답 둘 | "케이스가 길어지기 전에 항생제 재고를 계획합시다" |
| B6 | S7s4 오답2 | "각자 대조"는 together의 반대말(⑤) | "환자를 옮기기 전에 함께 대조합시다" |
| B7 | S8s2 오답2 | "굵은 카트"는 말이 안 됨 | "정맥로 카트가 준비되도록 하겠습니다" |
| B8 | S10s2 오답2 | "식사하기 전에 인지"는 아무도 하지 않을 말 | "진행하기 전에 다 함께 조용히 합시다" |
| B9 | S15s1 오답2 | 팔찌에는 좌우 정보가 없어 말이 안 됨. 메모가 지적한 문장 | "표시된 쪽과 수술 일정표가 일치하지 않습니다" |
| B10 | S18s0 오답2 | "잘못된 수술실"은 부위를 가리키며 하는 말로 어색함. 메모가 지적한 문장. 오답1 "잘못된 기구"는 수술실에서 실제로 멈추는 이유라 그대로 둬도 됨 | "멈추세요 — 그건 잘못된 환자입니다" |
| B11 | S3s3 오답1 | "도착" 되풀이(상한 초과) | "집도의와 마취팀 모두 들었습니다" |
| B12 | S4s1 오답2 | "도착" 되풀이. "도착 전 권장 시간 창"이라는 말은 없어서 읽기만 해도 걸러짐 | "그건 절개 전 권장 용량 범위 안이었습니다" |

정답 둘로 센 6건: B1·B2·B3·B4·B5, A13 오답2.

**고치지 않아도 되는 경계 사례**(판정만 적음): S5s0 바늘 계수, S5s1·S14s2·S14s4 포장, S8s3 수액 팩, S9s0 라벨과 일치, S16s2 장비 확보. 상태를 보고하는 문장에서 대상 물건을 하나 바꾼 것이라 위험한 지시가 되지 않는다.
메모가 지적한 S7s3(차트, 동의서 아직)과 S18s2(메스, 트레이)는 좌우·부위를 바꾸지 않아 안전 시험을 통과하고 자연스럽다. 그대로 둔다.

### C. 빈칸(60): 선택지 넷을 이 값으로 교체
읽기만 해도 걸러지거나, 반대말이거나, 위험한 지시가 되는 오답이다. 정답은 첫 번째 값이다.
"→ 빈칸 이동"이라고 적은 문장은 `blank.answer`도 바꾼다.
- S0s0 cancel/delay/skip(확인을 건너뛰는 지시) → confirm / print / file / scan
- S0s3 skip/erase/hide에 out loud가 붙어 문법이 깨짐 → 빈칸 이동 answer `sign-in`: sign-in / sign-out / time-out / consent
- S0s4 cancel/forget/erase → 빈칸 이동 answer `together`: together / quickly / again / later
- S1s3 eat → close
- S1s4 sleeping → gowned
- S2s1 Patient/Surgeon/Specimen은 "Surgeon is a … arthroscopy"처럼 말이 안 됨 → 빈칸 이동 answer `arthroscopy`: arthroscopy / arthroplasty / arthrocentesis / osteotomy
- S2s4 forgets → assumes
- S3s0 sleeping/waiting → circulating / scrub / charge / sterile
- S3s1 forgets/hides/leaves → 빈칸 이동 answer `role`: role / schedule / badge / shift
- S3s2 gone/late/tired → set / done / gowned / paged
- S3s3 absent/missing/sleepy → ready / scrubbed / paged / gowned
- S3s4 apron/locker → role / badge / count / tray
- S4s2 forgotten/ignored/lost → documented / scheduled / requested / ordered
- S4s4 erase/skip/lose → 빈칸 이동 answer `exact`: exact / usual / rough / planned
- S5s1 lost/spilled/expired는 "and ready to send"와 모순 → labeled / frozen / weighed / bagged
- S5s2 lunch/billing/parking → recovery / transport / pathology / radiology
- S5s4 slowly/quietly → correctly / partly / twice / neatly
- S6s1 invoice/menu → consent / schedule / roster / images
- S6s2 hidden/opened/packed → resolved / reported / recorded / posted
- S6s4 forget/ignore/shelve → resolve / schedule / document / report
- S7s0 forget/erase/delay는 문법이 깨지고 위험한 지시 → verify / announce / document / mention
- S7s1 budget/bed → plan / schedule / roster / team
- S7s2 eat → close
- S8s0 ignore/disregard/forget(위험한 지시) → anticipate / report / measure / record
- S8s3 empty/spoiled/lost → ready / stored / counted / labeled
- S9s1 dirty/broken/missing은 "and ready"와 모순 → open / wrapped / sorted / stacked
- S9s2 never/hardly/rarely(부정 부사 돌려쓰기, still은 가르치는 말이 아님) → 빈칸 이동 answer `bring`: bring / send / check / lock
- S9s4 doubt/deny/forget → check / note / announce / document
- S10s1 pretend/forget/hide(위험한 지시) → confirm / announce / record / mention
- S10s2 sorry → scrubbed
- S10s3 proud/tired/angry("angry of"는 문법 오류) → 빈칸 이동 answer `team`: team / floor / unit / list
- S11s0 days/weeks/months(시간 단위 돌려쓰기, 재투여 시점을 바꿈) → 빈칸 이동 answer `redosing`: redosing / extubation / discharge / suturing
- S11s1 hide/lose/sell → set / stop / pause / borrow
- S11s3 delete/hide/erase → document / change / shorten / round
- S11s4 paint/film → plan / order / chart / label
- S12s0 leave/eat/sleep → pause / move / rush / chat
- S12s1 leave/hide/disappear → participate / watch / wait / sit
- S14s0 avoid/forget/ignore → clarify / change / guess / copy
- S14s1 Forget/Ignore/Avoid → 빈칸 이동 answer `frozen`: frozen / culture / storage / cytology
- S14s2 loudly/rarely/randomly → carefully / quickly / twice / together
- S14s3 lunch/parking → specimen / staffing / imaging / transport
- S14s4 sell/drop → handle / count / weigh / bag
- S15s1 arrive/open/exist → 빈칸 이동 answer `consent`: consent / schedule / roster / films
- S15s2 barely/rarely/never → fully / partly / mostly / briefly
- S15s3 invoice/menu/wristband → consent / schedule / roster / imaging
- S15s4 sleep/talk → proceed / leave / sign / chart
- S16s2 skip/hide/delay(알레르기·혈액 확인을 건너뜀) → confirm / note / count / poll
- S16s3 blindly·loudly("확인은 소리 내어"라 정답 둘에 가까움) → quickly / privately / silently / separately
- S16s4 never/hardly/seldom(S9s2와 같은 묶음) → still / also / just / even
- S17s0 joke/song/secret → concern / complaint / compliment / preference
- S17s2 leave/hide/eat → pause / sit / wait / move
- S17s3 left up/slept up은 문법 오류 → spoke / stood / backed / showed
- S18s0 empty/loud → wrong / sterile / prepped / marked
- S18s1 forget/refuse/hope → 빈칸 이동 answer `re-confirm`: re-confirm / re-schedule / re-order / re-label
- S19s0 oral(경로)/expensive/old → prophylactic / therapeutic / discharge / outpatient
- S19s3 gloves/lights → antibiotics / fluids / consents / instruments
- S20s0 lights/tray/chart("His lights"는 말이 안 됨) → vitals / labs / meds / orders
- S20s1 celebrate/argue/pack → stabilize / discuss / document / reposition
- S20s3 bed/badge/tray → vitals / labs / meds / chart
- S20s4 Take/Sell/Hide("Take us a moment"는 문법 오류) → 빈칸 이동 answer `stabilize`: stabilize / organize / restock / relocate

(S8s4 `line`은 words에 없는 말을 빈칸으로 썼지만 선택지가 장면과 맞아 그대로 둔다. S1s2 until, S12s4 only, S19s2 숫자는 기능어나 숫자 빈칸이지만 통과로 본다.)

### D. decoy(4)
- S2s4 `, okay`: ", correct" 자리에 넣으면 "맞나요?"와 같은 뜻이 됨 → `, for now`
- S11s2 `Tell me when`: "Let me know if"와 같은 뜻으로 조립됨 → `Tell me why`
- S17s3 `, while I`: "but"과 같은 대비라 ko에 맞는 문장이 됨 → `, and you`
- S0s4 `this alone`: together의 반대말 decoy → `Let's sign this`

### E. order(9)
- S5 3줄 "That's the counts — …"는 문법이 어색함 → "That covers the counts — the specimen is labeled and ready to send."
- S7 2↔3: "Does everyone agree that they match?"의 they가 1줄을 가리킬 수 있음 → 3줄을 "So both say right — does everyone agree?"로
- S10 2↔3: "With that in mind"가 1줄을 가리킬 수 있어 바꿔도 자연스러움 → 3줄을 "With everyone aware, please confirm we're using latex-free supplies."로
- S12 2↔3: 바꿔도 자연스러움 → 2줄 "It only takes thirty seconds."(설득), 3줄 "But it only works if we all participate."(이유)로 순서와 접속어를 바꿈
- S14 2↔3: 라벨을 먼저 붙이고 경로를 정해도 자연스러움 → 3줄을 "Once that's sorted, I'll label each one right away."로
- S15 1↔2: 불일치를 먼저 보고하고 멈춰도 자연스러움 → 2줄을 "It's the marked side — it doesn't match the consent."로. 4줄 "That's our plan"은 어색함 → "Until we've done that, nothing proceeds."
- S17 1↔2: "I need to voice a concern"과 "I think something's off" 순서를 바꿔도 자연스러움 → 2줄을 "So I need to voice a concern before we go further."로
- S19 2↔3: 준비 중이라고 알린 뒤 보류를 청해도 자연스러움 → 3줄을 "Yes — I'm drawing it up right now, thirty seconds."로
- S20 2↔3: 바꿔도 자연스러움 → 3줄을 "While we hold, give me a moment to reassess with anesthesia."로

(S0~S4, S6, S8, S9, S11, S13, S16, S18은 순서가 하나로만 맞고 임상 순서도 맞음.)

### F. why(5)
- S7s2 **사실 오류**: "드레이프를 덮으면 부위가 가려지기 때문". 표시는 소독·드레이프 뒤에도 보여야 한다(Universal Protocol). → "I want everyone to …는 요청을 '내가 원한다'로 낮춰 말해 지시보다 부드러워요. 드레이프 전에 맞춰 두면 틀렸을 때 다시 소독·드레이프하지 않아도 돼요."
- S11s2 **사실 오류**: "길어지면 재투여 시점이 앞당겨질 수 있어". 재투여 시점은 수술 전 투여 시각에서 정해지므로 앞당겨지지 않는다. → "…케이스가 길어지면 재투여 시점이 수술 중에 돌아오니 미리 알려 달라는 거예요."
- S3s0 과장: "이름보다 역할을 먼저 밝히는 것이 틀". WHO 체크리스트는 이름과 역할을 함께 소개하게 한다. → "I'm + 직책 + for this case로 이번 수술에서 맡은 역할을 밝혀요 — 체크리스트는 이름과 역할을 함께 소개하게 해요."
- S10s4 과장: "confirmed는 누군가 말로 확인했다는 뜻". → "confirmed는 짐작이 아니라 실제로 확인을 마쳤다는 뜻이에요."
- S0s0 사소함: please는 문장 끝에 있지 않음. → "confirm 앞의 please가 지시를 정중한 부탁으로 바꿔요 — …"

## 종합
문장 en·ko, tag, 대부분의 why·decoy는 좋다. 그러나 수술 전 타임아웃 주제에서 distractorsKo 안전 실패가 32문장이고, 빈칸 오답의 절반 이상이 장면과 동떨어진 말이나 위험한 지시다. **A~F를 반영한 뒤 내보낼 것.** 고친 뒤에는 되풀이 상한(도착·집도의·마취과·설명·보고·전달·소독·분)을 다시 세고, 길이(V18)를 확인할 것.
