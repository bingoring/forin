# icu-transport-procedure — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-transport-procedure.yaml`(A·B 합친 파일), 21상황 · **147문장** · order 21장 전수. 번호는 0부터(상황.문장 / S상황 L줄).
스크립트(작업 폴더): `revB_icu-transport-procedure_dump.py`(→ `revB_icu-transport-procedure_full.txt`: `en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy를 청크 자리마다 넣은 조립, order 인접 교환 63건; `_compact.txt`는 조립 줄을 뺀 것),
`revB_icu-transport-procedure_stats.py`(표지·길이·decoy 낱말·빈칸 오답 빈도), `revB_icu-transport-procedure_rep.py`(오답 전용 어간 — 검사기 `_ko_stems` 그대로),
`revB_icu-transport-procedure_vals.py`(**아래 새 값 전부** — 수정 담당이 그대로 읽어 넣으면 됨; 뒤쪽 "2~4차 조정"이 앞 값을 덮어씀), `revB_icu-transport-procedure_apply.py`(새 값을 사본 `revB_icu-transport-procedure_new.yaml`에 넣음),
`revB_icu-transport-procedure_reasons.py`·`_mkmd.py`(아래 A~C 표 생성), `revB_icu-transport-procedure_notes.txt`(판정 메모).
새 값에는 마침표를 안 붙였습니다 — 지금 오답처럼 끝에 `.`을 붙여 넣으세요(길이 판정은 그대로). **새 값을 넣은 사본은 `verify_one_theme.py icu` 통과**(V20 0, W17 0, W18·W19·W21 0 — W13은 A 몫 단어 오답).

## 판정 기준 (수정 담당도 이 기준으로)
- 오답이 정답 행동의 **바로 앞·뒤 단계**(꺼내기·뽑기·준비·부르기 직전, 정답 행동이 조건절에 남은 것), **참인 다른 이유·효과**, 설명문의 해 없는 세부(물건·장소)면 통과.
- 그 순간 정답 행동 **대신** 하는 일, 판단·호출·멈춤 기준을 좁히거나 바꾼 것, 처치 시점·간격, 설정값, 담당 역할을 바꾼 것은 실패.
- **확인·보고 문장 규칙(저작자 질문):** 수치·작동 상태 **보고**(sats dropped · looks steady · battery has plenty)는 지표를 바꿔도 통과(행동을 시키지 않음).
  그러나 **확인·준비·기록 완료 문장**(confirm · double-check · documented · are ready · at the bedside · screened)에서 **확인 대상(기도·라인·펌프·금식·동의·흡인·역전제·BVM·튜브 깊이·자성·이식물)을 옆 물품으로 바꾼 것은 "정답 대상을 빼는 모양" = 빠뜨린 확인이라 실패**. 물류 확인(CT·엘리베이터·이송팀 준비, 경로)은 통과.
- **위기 장면(S15~S20, 10.0)** — 묶음 6·7 규칙대로 옆 일·잡무·장소 바꾸기도 실패, 오답은 바로 앞 단계나 참인 이유로만. 같은 상황 다른 문장의 정답(20.2↔20.4, 15.5↔15.6, 0.2↔0.6)은 정답 둘.
- 새 값 틀: 정답 행동을 남긴 앞·뒤 단계(조건 하나) 또는 표지 없는 참인 이유. **조건절을 X1·X2 어느 쪽에 둘지 섞었고**, "오답 둘에만 표지"는 0으로 유지.

## 기계적으로 센 것
- **오답 둘에만 조건·목적 표지가 붙은 문장: 0개**(지금). 새 값 뒤에도 **0개**.
- **오답 둘 다 정답보다 김: 19문장**(0.5 5.2 5.3 5.5 7.5 8.2 9.0 10.4 10.5 10.6 12.2 13.3 14.5 15.4 16.5 16.6 17.5 19.5 20.2) — 25주제 규칙 위반. 새 값 뒤 **0**. V20(길이 단서) 지금 0 · 새 값 뒤 0.
- 되풀이 상한(오답 전용 어간, 검사기 `_ko_stems`): 지금 최댓값 5(`이송`·`산소`·`알람`·`마스`). 새 값 뒤 최댓값 5(`둬요`·`호흡`·`금속`) — **수정 담당은 이 어간을 더 넣지 마세요**.
- **decoy 모양(147개)**: 어느 청크 자리에도 안 맞거나 문법으로 걸러짐 **10개**(1.2 3.3 5.0 5.5 6.5 11.2 11.5 15.6 17.0 17.2), 조립하면 안전 문제 **15개**(0.2 6.0 8.2 9.2 10.2 13.2 14.2 14.5 15.0 15.4 15.5 16.0 16.1 17.1 18.0 19.2 — 9.2는 실패 7의 `and sign` 그대로), 반대말 **3개**(0.5 9.5 10.4). 나머지는 같은 자리의 다른 뜻 구라 통과. 첫 낱말 분포 `and` 31 · `to` 14 · 쉼표 11 · `on` 10 — 장소 구 몰림은 없음.
- **decoy 낱말 몰림**: 최댓값 3(`sign` 0.2·9.2·11.0, `chart` 1.2·1.5·3.4, `if`) — W18 없음. 새 값 뒤 내용어 최댓값 3(`call`·`ready`·`pulse`·`cart`·`paperwork`·`scan`), 기능어 `if` 4.
- **빈칸 오답 되풀이**: 지금 최댓값 3(discharge·dialysis·dry·pain·broken·noise·alarm·cart·insurance·antibiotic·diuretic·stored·color·light·behind·labs·orders·up). 새 값 뒤 최댓값 3.

| 갈래 | 상위 5 (지금) |
|---|---|
| distractorsKo 전용 어간 | 이송 5 · 산소 5 · 알람 5 · 마스(크) 5 · 모니(터)/폴대/엘리(베이터)/막히/카트 4 |
| 빈칸 오답 | discharge 3 · dialysis 3 · insurance 3 · antibiotic 3 · diuretic 3 |
| decoy 낱말 | sign 3 · chart 3 · if 3 · call 2 · shift 2 |

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 3 | 147개에 큰 사실 오류는 드묾. 그러나 상당수가 낱말 뜻풀이("…는 …라는 뜻이에요")라 말하는 방식의 이유가 약함. 고칠 것 3: 10.2 동어반복("기도는 기도를 맡은 사람이 맡고"), 19.2 "손은 쓸 수 있으니 벗어나자마자 시작" — 손을 쓸 수 있으면 왜 미루는지 앞뒤가 안 맞고 ACR 지침과 어긋남(F), 13.5 탱크만 보고 조절기를 안 봄. |
| 2 빈칸 | **2** | **67문장 교체.** 정답 둘 33(장면에서 맞는 선택지 — drunk·Glasgow·telemetry·minimal·seizure·labs·pints·up/down…), **위험한 처치가 보이는 선택지 6**(10.0 faints→압박, 15.5 rest/pause/break 2분, 16.0 bent/loose에 마스크, 16.4 sips/drinks, 18.0 drains, 18.3 gentle/light pressure), 동떨어짐·소리 닮음 약 25(19.6 keys/phone/wallet은 TASK 실패 6의 예 그대로, 7.0 -tion, 5.5 re-), 관사·문법 4(12.0 an SOAP, 18.2 an pediatric, 2.2 floors, 4.3 doubled). |
| 3 decoy | 3 | 자리 없음 10, 조립 위험 15, 반대말 3. 나머지는 같은 자리의 구로 잘 씀. |
| 4 distractorsKo | **1** | **92문장 교체 — 안전 71 · 정답 둘 5 · 사실 1 · 길이 9 · 기타 6.** 확인·감시 문장의 대상 바꾸기(실패 1) 약 33, 처치·기준·시점·역할 바꾸기(실패 3) 약 39, 그중 **맥박 확인 없이 압박**(10.0·15.0)·**튜브가 있는데 마스크 환기**(16.0) 같은 심각 3. |
| 5 order | 3 | 고칠 것 12장: 인접 교환이 읽힘 6(S8 S9 S10 S13 S17 S20의 2↔3), 임상 4(S7 1초 하락에 승압제, S11 타임아웃이 준비보다 먼저, S15 압박 담당 없음, S16 기도 키트 호출을 가슴 오름 뒤로 미룸), 영어 2(S4 `On those`·`At that drop`, S14 `That's why let's`). S19는 사용자 판단(F). ko 머리말은 모두 카드와 맞음, 15단어 초과 없음. |
| 6 tag·icon | 4 | 태그 10자 이하·상황 안 일관. 아이콘 3: 4.3 떨어지는 값에 `chartup`, 16.5 재삽관에 `plane`, 18.6 외과 도착에 `plane`. 산소·숨에 `lab`(1.0 5.4 13.5 16.4 20.5)은 대체가 없어 둠. |
| 8 파일럿 갈래 | 2 | 갈래 2(동떨어진 빈칸) 약 25, 갈래 3(order) 6장, 갈래 5(오답·decoy 뜻 겹침) 정답 둘 38, "오답으로 위험한 처치 보이기" — 빈칸 6 · decoy 15 · distractorsKo 심각 3. |

## 사실 오류·심각한 문제
1. **오답이 그대로 위험한 처치(⑥) — 심각 3.** **10.0** X1 `구토하면 … 흉부압박을 시작`·X2 `알람이 울리면 … 흉부압박`, **15.0** X1 `알람이 울려요, 지금 흉부압박`·X2 `안색이 창백해요, 지금 흉부압박` — 맥박 확인 없이 맥박 있는 환자에게 압박. **16.0** X1 `막혔어요`·X2 `밀려 들어갔어요 — 마스크로 백을` — 튜브가 기도 안에 있는데 빼고 마스크로 짜는 말(막힘은 흡인·교체, 밀림은 당겨 맞추기). 같은 틀로 **17.0 X1** `의식이 없어요 — 백을 짜요`(진정 환자는 원래 의식이 낮음), **18.0 X2** `상처가 깊어요 — 수액 활짝`, **20.1 X2** `배터리가 다 되면 실내 공기로`(산소가 있는데 21%).
2. **확인·준비 문장의 대상 빼기(실패 1) 약 33문장** — 저작자가 판단을 부탁한 갈래. 0.1 0.4 1.5 2.0 2.5 3.0 3.1 3.2 3.4 4.0 4.2 5.5 6.1 6.2 8.1 9.2 9.3 9.4 11.1 11.4 12.1 13.0 13.3 13.4 13.5 13.6 16.1 16.6 17.4 19.5 20.2 — 특히 **MRI 묶음(13.x)**: `자성 없음`을 `가득 참·새것`으로(13.5), 금지 규칙을 `플라스틱·젖은 물품`으로(13.1) — 철 물품 반입은 MRI 발사체 사고의 원인.
3. **위기 장면의 처치·장소·시점 바꾸기.** 15.1(가장 가까운→큰·새 카트), 15.3(백보드 위치), 15.4(사람 대신 장갑·복도), 15.5(2분→3분·1분), 15.6(리듬→라인·시간 확인), 16.2(빠진 라인→막힌·꺾인 라인), 16.4(숨 대신 밀착·고개 젖힘), 18.1(대량수혈→응급 수혈·심정지 프로토콜), 18.4(혈액을 수술실·간호사실로), 19.1·19.4(소생·대피 장소), 19.2(압박 대신 브레이크·체위), 20.2·20.4(전원 대신 비상구·벽면 산소).
4. **빈칸·decoy로 위험한 처치가 보임.** 빈칸 10.0 `faints`(실신하면 압박), 15.5 `rest/pause/break`(2분 압박 중단), 16.4 `sips/pills/drinks`(무호흡 환자에게 입으로), 18.3 `gentle/light/slow pressure`(급격한 출혈에 약한 압박), 18.0 `drains`; decoy 16.0 `with the tube`(빠진 튜브로 짜기), 18.0 `— apply ointment`, 6.0 `default ones`(기본값 설정), 13.2 `and a clipboard`(MRI에 금속 클립), 17.1 `and sort`(진정제를 끊지 않음), 8.2 `and hold the door`, 10.2 `, I'll run the labs`.
5. **사실.** 9.1 X1 플루마제닐 `냉장 보관`(실온 보관 약). 19.2 why(위 1번 점수 칸). 사용자 판단 거리는 F.

## 저작자가 판정을 부탁한 곳
| 곳 | 판정 | 새 값 |
|---|---|---|
| 확인·보고 문장의 참인 옆 단계·다른 물품 오답 — 0.1(난간·가방/시트), 0.4(산소통·모니터/폴대·케이블), 4.0(혈압/심전도), 13.x(보호자·소독, 플라스틱·젖은, 신발·가운, 알레르기·신분증, 가득 참·새것, 가방) | **실패** — 옆 물품이 참인 준비라도 정답 대상(기도·라인·펌프·감시 항목·MRI 확인)을 빼면 그 확인을 놓침(실패 1). 보고문(2.3·4.3·6.4 등)은 통과 | A 표 — 정답 대상을 남긴 뒤 단계(조건) + 참인 이유 |
| 0.5(엘리베이터·이송팀) | **통과** — 물류 확인끼리라 환자에 붙은 장비를 빼지 않음. 길이만(둘 다 김) | X1 `옮기기 전에 병상이 준비됐는지 확인해요` |
| 15.5 압박 라운드 2분 → 3분·1분 | **실패(시점 바꾸기)** — 2분은 AHA의 교대·리듬 확인 간격이라 "처치 시점"에 해당. 3분은 압박 질 저하·리듬 확인 지연, 1분은 중단이 잦아짐 | `2분마다 흉부압박 담당을 바꿔야 깊이가 유지돼요` / `흉부압박은 분당 110번 안팎이에요`(둘 다 참인 이유; "첫 2분 뒤 리듬 확인"은 15.6 정답이라 쓰지 않음) |
| 16.4 5초마다 숨 → 밀착·고개 젖힘 | **실패** — 앞 단계 동사지만 `5초마다`가 붙어 "그 순간 환기 대신 되풀이하는 일"이 됨. 환기가 사라짐 | `숨은 한 번에 1초 동안 넣어요` / `숨을 세게 넣으면 위로 공기가 차요`(둘 다 참) — 간격 자체는 F 참고 |
| 10.2 역할 — 내 몫만 침대 몰기·문 잡기 | **실패(담당 역할 바꾸기·잡무)** — 위기 계획에서 약물 담당이 사라짐. 안전하게 바꿀 자리가 없어 둘 다 참인 이유로 | `위급한 순간 기도는 대개 호흡치료사가 맡아요` / `기도와 약물을 나눠 맡아야 둘 다 챙겨져요`. 빈칸도 fluids·calls 정답 둘 → `airway/family/billing/schedule`, decoy `, I'll run the labs` → `, I'll run the scan`, why 교체(E) |
| 15.0 이유(알람·창백) | **실패(심각)** — 위 사실 1 | `침대를 멈춰요 — 지금 10초 안에 맥박을 확인해요`(바로 앞 단계) / `침대를 멈춰요 — 움직이는 침대에선 압박이 얕아져요` |

## 실패 7가지 대조
1(대상·지표 바꾸기) **약 33문장** · 2(사람만 바꾸기) 0(10.2는 역할 바꾸기로 3에 셈) · **3(처치를 다른 일로·판단 기준·시점·역할) 약 39문장**(심각 3 포함) · 4(정답+덧붙임) 0 · 5(말투만) 0 · **6(동떨어진·소리 닮은 빈칸) 약 25문장** · **7(decoy) 자리 없음 10 + 조립 위험 15 + 반대말 3**.
남은 위험(새 값): 요청·지시 한 가지뿐인 문장(4.4 12.5 15.4 15.5 16.4 10.2)은 안전하게 바꿀 자리가 없어 오답을 참인 이유(평서문)로 썼습니다 — 정답만 요청문이라 모양 단서가 약하게 남습니다.

## A. distractorsKo 새 값 (92문장 — 안전 71 · 길이 9 · 기타 6 · 정답 둘 5 · 사실 1)

| 문장 | 분류 | 문제 | 지금 X1 / X2 | 새 X1 / X2 (— = 그대로) |
|---|---|---|---|---|
| 0.1 | **안전** | 저작자 질문. 확인 대상(기도·라인)을 난간·가방·시트로 바꿈 — 출발 전 확인이 빠짐(실패 1) | 먼저 침대 난간이 올라갔는지 확인할게요. / 먼저 이송 가방과 시트가 준비됐는지 확인할게요. | 기도와 라인은 움직이는 중에 가장 잘 빠져요 / 기도와 라인은 테이프와 고정기로 붙여 둬요 |
| 0.2 | **안전** | 멈춤 기준 '악화'를 열·졸림으로 좁힘(판단 기준). X1 대안 '병동으로 돌아가요'는 0.6 정답과 겹쳐 쓰지 않음 | 열이 나면 멈추고 다시 평가해요. / 졸려 하면 멈추고 다시 평가해요. | 악화되면 병상이 처치하기 쉬워요 / 악화 기준은 출발 전에 정해요 |
| 0.4 | **안전** | 저작자 질문. 진정제·승압제 펌프 재확인을 산소통·모니터·폴대로 바꿈 | 가기 전에 산소통과 이송 모니터를 다시 확인할게요. / 가기 전에 폴대와 모니터 케이블을 다시 확인할게요. | 진정제와 승압제는 잠깐만 끊겨도 위험해요 / 진정제와 승압제 펌프는 침대 쪽 폴대에 걸어요 |
| 0.5 | 길이 | 저작자 질문 — 내용은 통과(CT·엘리베이터·이송팀 준비는 물류 확인, 환자에 붙은 장비가 아님). 다만 오답 둘 다 정답보다 김 | 옮기기 전에 엘리베이터가 준비됐는지 확인해요. / 옮기기 전에 이송팀이 준비됐는지 확인해요. | 옮기기 전에 병상이 준비됐는지 확인해요 / — |
| 0.6 | **안전** | '뭔가 바뀌면'(환자 상태)을 늦어짐·막힘(물류)으로 좁힘 — 상태가 바뀌어도 떠나게 됨 | 뭔가 늦어지면 우리는 병동에 머물러요. / 뭔가 막히면 우리는 병동에 머물러요. | 뭔가 바뀌면 영상실에 연기를 알려요 / 뭔가 바뀌면 병상에서 처치하기가 더 쉬워요 |
| 1.0 | 기타 | X2 '충전 시간'은 산소통에 없는 말이고 예비분을 뺌 — 검사 시간(참인 추가분)으로 | 전체 근무 시간에 예비분까지 더해 산소 공급량을 계산했어요. / 전체 이동 시간에 충전 시간까지 더해 산소 공급량을 계산했어요. | — / 전체 이동 시간에 검사 시간까지 더해 산소 공급량을 계산했어요 |
| 1.5 | **안전** | 응급 가방(약·BVM) 재확인을 카트·전화로 바꿈 | 가기 전에 이송 카트를 한 번 더 확인해요. / 가기 전에 비상 전화를 한 번 더 확인해요. | 이송 가방은 가는 길에 열어 볼 틈이 없어요 / 가방을 확인하면 침대를 밀고 나가요 |
| 2.0 | **안전** | 이송 중 모니터 감시를 튜빙·폴대 감시로 바꿈(실패 1) | 이송하는 동안 산소 튜빙을 계속 지켜보고 있어요. / 이송하는 동안 폴대를 계속 지켜보고 있어요. | 이송 중에는 상태가 갑자기 바뀔 수 있어요 / 모니터에서 변화가 보이면 침대를 세울게요 |
| 2.5 | **안전** | 동료에게 맡긴 꼬임 감시를 물방울·얼룩으로 바꿈(실패 1) | 튜빙에 물방울이 보이면 알려 주세요. / 튜빙에 얼룩이 보이면 알려 주세요. | 튜빙에 꼬임이 보이면 곧장 펴 주세요 / 튜빙이 꼬이면 흐름이 끊겨요 |
| 3.0 | **안전** | 저작자 질문(확인·기록 문장). 진정 전 기록 항목을 알레르기·체중으로 — 금식·ASA 확인이 빠짐 | ASA 등급과 알레르기 목록을 기록했어요. / 체중과 마지막 경구 섭취를 기록했어요. | ASA 등급과 마지막 경구 섭취를 담당의에게 전했어요 / ASA 등급과 금식으로 흡인 위험을 봐요 |
| 3.1 | **안전** | 동의→설명(동의 없이 진행), 기도 사정→피부 사정 | 기도 사정과 설명이 끝났어요. / 피부 사정과 동의가 끝났어요. | 기도 사정과 동의를 마쳐야 시술해요 / 기도 사정과 동의는 필수예요 |
| 3.2 | **안전** | 구조 장비 흡인을 청진기·혈압계로 바꿈 | 역전제와 청진기가 침상 곁에 있어요. / 역전제와 혈압계가 침상 곁에 있어요. | 역전제와 흡인 장비를 지금 가져다 둘게요 / 역전제와 흡인은 급하면 찾을 틈이 없어요 |
| 3.4 | **안전** | 기도 사정(말람파티)을 체온·체중·혈압으로 바꿈 | 시작하기 전에 체온과 체중을 확인했어요. / 시작하기 전에 혈압과 맥박수를 확인했어요. | 말람파티 점수로 기도가 어려운지 가늠해요 / 말람파티는 입을 벌려 목젖이 보이는 정도로 매겨요 |
| 3.5 | **안전** | X1 '복사됐고' — 서명 안 된 동의서. X2(서랍)는 장소라 통과 | 동의서는 복사됐고 차트에 있어요. / 동의서는 서명됐고 서랍에 있어요. | 동의서는 서명됐고 보호자도 봤어요 / — |
| 3.6 | 기타 | X2 '마칠'은 시작 전 장면에서 말이 안 돼 듣지 않고 걸러짐 | 당신만 도착하면 바로 시작할 수 있어요. / 당신만 준비되면 바로 마칠 수 있어요. | — / 당신만 준비되면 바로 타임아웃을 할 수 있어요 |
| 4.0 | **안전** | 저작자 질문. 감시 항목 하나씩(산소포화도→혈압, 카프노→심전도) 바꿈(실패 1) | 카프노그래피와 혈압을 계속 감시하고 있어요. / 심전도와 산소포화도를 계속 감시하고 있어요. | 카프노그래피는 산소포화도보다 먼저 바뀌어요 / 카프노그래피 파형은 숨을 내쉴 때마다 올라와요 |
| 4.2 | **안전** | 역전제를 전극·거즈로 바꿈(구조 약물 준비 빠짐) | 흡인 장비와 심전도 전극이 준비돼 있어요. / 흡인 장비와 거즈가 준비돼 있어요. | 흡인과 역전제는 호흡이 나빠지면 써요 / 흡인 장비와 역전제를 손 닿는 곳으로 옮길게요 |
| 4.4 | **안전** | 도움 호출 기준을 체위 변경·알람으로 바꿈(호출 시점) | 체위를 바꿔도 반응하지 않으면 도움을 부를게요. / 알람이 계속 울리면 도움을 부를게요. | 자극에 반응하지 않으면 역전제 쓸지를 정해요 / 자극에 반응이 없으면 너무 깊은 거예요 |
| 5.0 | 기타 | X2 진정 직후 '복도를 걸어 다니고'는 우스워 걸러짐 | 이제 각성 가능하고 스스로 의자에 앉아 있어요. / 이제 각성 가능하고 스스로 복도를 걸어 다니고 있어요. | — / 이제 각성 가능하고 스스로 이름을 말하고 있어요 |
| 5.2 | 길이 | 오답 둘 다 김(내용 통과) | 회복 기준을 충족해서 면회를 허용할 수 있어요. / 회복 기준을 충족해서 식사를 시작할 수 있어요. | — / 회복 기준을 충족해서 식사를 할 수 있어요 |
| 5.3 | 길이 | 오답 둘 다 김(내용 통과 — 반응 보고) | 이름을 부르면 고개를 돌리고 있어요. / 어깨를 두드리면 눈을 뜨고 있어요. | 이름을 부르면 손을 쥐고 있어요 / — |
| 5.5 | **안전** | 나가기 전 환자 재확인을 체위 변경·난간 확인으로 바꿈 | 나가기 전에 한 번 더 체위를 바꿔 줄게요. / 나가기 전에 한 번 더 난간을 확인할게요. | 약 기운이 되살아나서 재확인해요 / 재확인을 마치면 호출벨을 쥐여 드릴게요 |
| 6.0 | **안전** | 이송 호흡기를 이전·어제 설정에 맞춤 — 설정값을 바꾸는 말 | 이송용 인공호흡기 설정을 이전 설정에 맞췄어요. / 이송용 인공호흡기 설정을 어제 설정에 맞췄어요. | 이송용 인공호흡기 설정을 호흡치료사와 같이 봤어요 / 이송용 인공호흡기가 다르면 환기량도 달라져요 |
| 6.1 | **안전** | 튜브 깊이 확인을 크기·제조일로 바꿈 | 호기말 이산화탄소와 기관튜브 크기를 확인했어요. / 호기말 이산화탄소와 기관튜브 제조일을 확인했어요. | 호기말 이산화탄소는 튜브가 기도에 있다는 증거예요 / 기관튜브 깊이는 흉부 사진으로도 맞춰 봐요 |
| 6.2 | **안전** | 백업 BVM을 후두경·산소통으로 바꿈 — 호흡기가 멈출 때 쓸 수단이 빠짐 | 백업으로 후두경과 블레이드를 준비해 뒀어요. / 백업으로 산소통과 연결관을 준비해 뒀어요. | 백업용 백-밸브 마스크를 지금 꺼낼게요 / 기계가 멈추면 손으로 짜야 해서 곁에 둬요 |
| 6.3 | **정답 둘** | X1 '조용하게'는 경보 없이 돈다는 smoothly 풀이(why)와 겹침 | 이송용 인공호흡기가 조용하게 작동하고 있어요. / 이송용 모니터가 순조롭게 작동하고 있어요. | 이송용 인공호흡기가 배터리로 작동하고 있어요 / — |
| 7.1 | **안전** | 적정 목표 MAP을 장기 관류·소변량으로 바꿈(판단 기준, 실패 3) | 장기 관류를 유지하도록 승압제를 적정할게요. / 소변량을 유지하도록 승압제를 적정할게요. | MAP을 목표치로 지켜야 장기에 피가 잘 돌아요 / MAP 목표치는 담당 의사가 처방한 값이에요 |
| 7.3 | **정답 둘** | X1 '초록색' = 배터리 넉넉 | 배터리 표시기는 아직 초록색이에요. / 충전기 표시기는 아직 수명이 넉넉해요. | 배터리 표시기는 아직 절반쯤 남았어요 / — |
| 7.5 | 길이 | 오답 둘 다 김(내용 통과 — 결과 보고) | 속도를 살짝 올렸더니 알람이 멎었어요. / 속도를 살짝 올렸더니 소변이 나왔어요. | — / 속도를 살짝 올렸더니 땀이 났어요 |
| 8.0 | **안전** | X1 중등도 정의를 '통증에 반응'(깊은 진정 기준)으로, X2 기도 유지를 체위 유지로 — 깊이 판단 기준을 틀리게 가르침 | 중등도 진정에서는 통증에 반응하고 스스로 기도를 유지해요. / 중등도 진정에서는 목소리에 반응하고 스스로 체위를 유지해요. | 중등도 진정에서는 목소리에 반응하고 심혈관 기능도 유지돼요 / 중등도 진정에서는 목소리에 반응하고 호흡도 충분히 유지돼요 |
| 8.1 | **안전** | 깊이 재평가를 통증·활력 재평가로(실패 1) | 천천히 적정하면서 통증을 다시 평가할게요. / 천천히 적정하면서 활력을 다시 평가할게요. | 천천히 적정해야 너무 깊어지지 않아요 / 깊이는 목소리와 자극 반응으로 가늠해요 |
| 8.2 | **안전** | 조치 기준 '너무 깊어지면'을 호흡·맥박으로 바꿈 | 호흡이 느려지면 기도를 지지하고 약물을 보류할게요. / 맥박이 느려지면 기도를 지지하고 약물을 보류할게요. | 너무 깊어지면 혀가 뒤로 처져 기도를 막아요 / 너무 깊어지면 숨이 얕아지고 포화도가 떨어져요 |
| 8.4 | **정답 둘** | X1 호흡 ⊂ 반응(정답 둘), X2 표정만 보기(실패 1) | 소량을 투여했고 호흡을 지켜보고 있어요. / 소량을 투여했고 표정을 지켜보고 있어요. | 소량을 주면 효과가 몇 분 뒤에야 나타나요 / 소량씩 나눠 줘야 깊이가 천천히 변해요 |
| 9.0 | 길이 | 오답 둘 다 김. 내용은 통과(침상 곁·카트에 두기는 뽑기의 앞 단계) | 오피오이드 역전을 위해 날록손을 침상 곁에 놔 뒀어요. / 오피오이드 역전을 위해 날록손을 카트에 실어 뒀어요. | — / 오피오이드 역전을 위해 날록손을 챙겨 뒀어요 |
| 9.1 | **사실** | X1 플루마제닐 '냉장 보관' — 실온 보관 약이고, '준비됐어요'가 빠짐 | 벤조디아제핀 과다진정에 대비해 플루마제닐도 냉장 보관돼 있어요. / 벤조디아제핀 과다진정에 대비해 플루마제닐도 처방됐어요. | 벤조디아제핀 과다진정에 대비해 플루마제닐도 약국에 요청했어요 / — |
| 9.2 | **안전** | 재진정 감시를 통증·구토로 바꿈(실패 1) | 효과가 날 때까지 역전제를 적정하고 통증을 지켜볼게요. / 효과가 날 때까지 역전제를 적정하고 구토를 지켜볼게요. | 효과가 날 때까지 기다리는 동안 백과 흡인을 곁에 둬요 / 역전제 효과는 진정제보다 짧아서 재진정이 오기도 해요 |
| 9.3 | **안전** | 구조 약물의 '라벨'·'손 닿는 곳'을 서명·날짜로 바꿈 | 두 용량 모두 라벨이 붙어 있고 날짜도 적혀 있어요. / 두 용량 모두 서명이 돼 있고 손 닿는 곳에 있어요. | 세 용량 모두 라벨이 붙어 있고 손 닿는 곳에 있어요 / 라벨을 붙여 두면 급해도 두 약을 구분해요 |
| 9.4 | **안전** | 농도 확인을 유효기간·라벨로 바꿈 — 용량 오류 확인이 빠짐 | 뽑기 전에 유효기간을 다시 확인했어요. / 뽑기 전에 라벨을 다시 확인했어요. | 뽑기 전에 농도를 봐야 용량이 맞아요 / 농도를 확인한 뒤에 천천히 뽑았어요 |
| 9.6 | **정답 둘** | 8.4와 같은 틀(호흡 ⊂ 반응, 피부색만 보기) | 천천히 주고 호흡을 자세히 지켜볼게요. / 천천히 주고 피부색을 자세히 지켜볼게요. | 천천히 줘야 부드럽게 깨어날 거예요 / 천천히 줘야 금단 증상과 통증이 덜 몰려요 |
| 10.0 | **안전** | **심각.** 압박 시작 조건을 구토·알람으로 — 맥박 있는 환자에게 흉부압박을 시작하라는 말 | 구토하면 멈추고 흉부압박을 시작하고 도움을 불러요. / 알람이 울리면 멈추고 흉부압박을 시작하고 도움을 불러요. | 심정지 계획은 나서기 전에 둘이 미리 같이 정해 둬요 / 심정지가 오면 멈추고 맥박이 없는지 10초 안에 봐요 |
| 10.2 | **안전** | 저작자 질문. 내 몫(약물)을 침대 몰기·문 잡기로 — 위기 계획에서 약물 담당이 사라짐(담당 역할 바꾸기·잡무) | 당신이 기도를 맡고, 저는 침대를 몰게요. / 당신이 기도를 맡고, 저는 문을 잡을게요. | 위급한 순간 기도는 대개 호흡치료사가 맡아요 / 기도와 약물을 나눠 맡아야 둘 다 챙겨져요 |
| 10.3 | **안전** | 역할 합의를 경로·속도 합의로 바꿈(담당 역할) | 병동을 나서기 전에 경로를 합의해요. / 병동을 나서기 전에 속도를 합의해요. | 역할이 정해져야 위기에 덜 헷갈려요 / 역할을 합의한 뒤에 경로를 같이 봐요 |
| 10.4 | 길이 | 오답 둘 다 김(내용 통과 — 물류 조건) | 엘리베이터 문이 안 열리면 비상 호출 버튼을 눌러요. / 엘리베이터 불이 꺼지면 비상 호출 버튼을 눌러요. | — / 엘리베이터에 불나면 비상 호출 버튼을 눌러요 |
| 10.5 | **안전** | 백(환기) 위 손을 폴대·베개로 — 위기 대비 중 환기 손을 비움 | 내내 폴대 위에 손을 얹고 있을게요. / 내내 베개 위에 손을 얹고 있을게요. | 백에 손을 얹어 둬야 곧장 짜요 / 출발 직전에 백을 침대 머리맡에 걸게요 |
| 10.6 | 길이 | 오답 둘 다 김(내용 통과) | 주된 경로가 막히면 쓸 예비 엘리베이터도 둘 다 알고 있어요. / 주된 경로가 막히면 쓸 예비 출입구도 둘 다 알고 있어요. | — / 주된 경로가 막히면 쓸 예비 문도 둘 다 알고 있어요 |
| 11.0 | **안전** | 타임아웃을 손 위생으로, 부위를 동의로 바꿈 — 잘못된 부위 예방이 빠짐 | 손 위생을 해요 — 환자, 시술, 부위를 확인했어요. / 타임아웃을 해요 — 환자, 시술, 동의를 확인했어요. | 타임아웃을 해요 — 모두 하던 일을 멈추고 들어 주세요 / 타임아웃은 다른 부위에 시술하는 걸 막아 줘요 |
| 11.1 | **안전** | 흡인을 조명·장갑으로 바꿈 | 무균 트레이와 조명이 준비돼 있어요. / 무균 트레이와 장갑이 준비돼 있어요. | 무균 트레이와 흡인 장비를 침상 쪽으로 옮길게요 / 흡인 장비는 시술 중 분비물이 차면 써요 |
| 11.4 | **안전** | 바늘 계수를 장갑·주사기 계수로 — 체내 잔류 확인이 빠짐 | 거즈와 장갑 개수를 세어 둘게요. / 거즈와 주사기 개수를 세어 둘게요. | 거즈와 바늘 수가 다르면 다시 세요 / 남은 거즈와 바늘은 몸 안에서 위험해요 |
| 12.1 | **안전** | X1 약물 목록을 동의서로 — 받는 병원이 투약을 모름. X2(검사 결과)는 기록끼리라 통과 | 차트와 영상자료, 동의서를 다 함께 챙겼어요. / 차트와 검사 결과, 약물 목록을 다 함께 챙겼어요. | 차트와 영상자료, 약물 목록을 받는 팀에 넘겼어요 / — |
| 12.2 | 길이 | 오답 둘 다 김 | 현재 주입 중인 약물과 용량이에요. / 현재 주입 중인 약물과 알레르기예요. | — / 현재 주입 중인 약물과 농도예요 |
| 12.5 | **안전** | X1 호출 기준을 '막히면'으로 좁힘 | 이동 중에 뭔가 막히면 전화 주세요. / 이동 중에 뭔가 필요하면 전화 주세요. | 이동 중 변화가 도착 뒤 처치를 바꿔요 / — |
| 13.0 | **안전** | 저작자 질문 13.x. 장비 MRI 선별을 보호자 선별·소독 기준으로 | MRI 호환성을 위해 모든 보호자를 선별했어요. / 소독을 위해 모든 장비를 선별했어요. | 모든 장비가 MRI에 호환되면 안으로 들여요 / MRI 자석은 철로 된 장비를 끌어당겨요 |
| 13.1 | **안전** | 금지 규칙을 플라스틱·젖은 물품으로 바꿈 — 철 물품 반입 | 플라스틱 물품은 구역선을 넘지 못해요. / 젖은 물품은 구역선을 넘지 못해요. | 자성이 있는 물품은 스캔 영상도 흐려요 / 자성이 있는 물품은 휴대용 자석으로 가려내요 |
| 13.3 | **안전** | 금속 빼기를 신발 벗기·가운으로 바꿈 | 검사실에 들어가기 전에 신발을 벗어 주세요. / 검사실에 들어가기 전에 가운으로 갈아입어 주세요. | 금속을 다 빼면 검사실에 같이 들어가요 / 금속은 자석에 끌려 빠르게 날아가요 |
| 13.4 | **안전** | 이식물 대조를 알레르기·신분증으로 | 선별 목록과 알레르기를 대조해서 확인했어요. / 선별 목록과 신분증을 대조해서 확인했어요. | 선별 목록과 이식물이 맞으면 스캔을 시작해요 / 이식물은 몸속이라 목록으로만 알아요 |
| 13.5 | **안전** | '자성 없음'을 가득 참·새것으로 — MRI 발사체 사고의 핵심 확인이 빠짐 | 쓰고 있는 산소 탱크는 가득 차 있어요. / 쓰고 있는 산소 탱크는 새것이에요. | 산소 탱크가 자성이 없으면 검사실로 들여요 / 쓰는 산소 탱크는 알루미늄으로 돼요 |
| 13.6 | **안전** | X1 '가방에 있는' — 몸에 붙은 것 확인 빠짐. X2 '복도용' 뜻이 안 됨 | 그의 가방에 있는 모든 건 스캐너용으로 확인됐어요. / 그에게 있는 모든 건 복도용으로 확인됐어요. | 그에게 있는 모든 건 스캐너용으로 확인되면 스캔해요 / 몸에 붙은 작은 금속도 하나하나 봐야 해요 |
| 14.1 | **안전** | 저울질의 '위험'을 비용·시간으로 바꿈 | 이송 비용과 이익을 저울질해 봐요. / 이송 시간과 이익을 저울질해 봐요. | 이송 위험이 이익보다 크면 미뤄요 / 이송 위험에는 가는 길의 악화도 포함돼요 |
| 14.2 | **안전** | 최적화를 서류 정리로, 문제 대비를 짐 챙기기로(잡무) | 가기로 하면 먼저 서류를 정리하고 문제에 대비해요. / 가기로 하면 먼저 상태를 최적화하고 짐을 챙겨요. | 상태가 최적화되면 이어서 장비를 챙겨 나가요 / 가기로 하면 이동하는 동안 문제가 생기기 쉬워요 |
| 14.3 | **정답 둘** | X1 수액 ⊂ 지지 | 지금은 수액이 더 필요해질 경계에 있어요. / 지금은 진정제가 더 필요해질 경계에 있어요. | 지금은 지지가 더 필요해질 경계를 넘었어요 / — |
| 14.5 | **안전** | X2 '내일까지' — 시점 바꾸기(검사 지연) | 차라리 한 시간 기다렸다가 가족이 오는지 보고 싶어요. / 차라리 내일까지 기다렸다가 좋아지는지 보고 싶어요. | — / 차라리 한 시간 기다렸다가 다시 상의하고 싶어요 |
| 15.0 | **안전** | **심각.** 압박 근거 '맥박 없음'을 알람·창백으로 — 맥박 확인 없이 압박 | 침대를 멈춰요 — 알람이 울려요, 지금 흉부압박을 시작해요. / 침대를 멈춰요 — 안색이 창백해요, 지금 흉부압박을 시작해요. | 침대를 멈춰요 — 지금 10초 안에 맥박을 확인해요 / 침대를 멈춰요 — 움직이는 침대에선 압박이 얕아져요 |
| 15.1 | **안전** | '가장 가까운' 카트를 큰·새 카트로 — 심정지 중 지연 | 코드를 부르고 가장 큰 응급 카트를 가져와요. / 코드를 부르고 가장 새 응급 카트를 가져와요. | 코드를 부르려고 가장 가까운 전화기를 잡아요 / 가장 가까운 응급 카트엔 제세동기가 실려요 |
| 15.2 | 기타 | X1(준비)·X2(섞기)가 같은 뜻. X1 '준비'는 바로 앞 단계라 통과(묶음 6·7) — X2만 교체 | 제가 백을 짜는 동안 당신이 코드 약물을 준비해요. / 제가 백을 짜는 동안 당신이 코드 약물을 섞어요. | — / 백과 약물을 둘이 나눠 맡아야 손이 덜 겹쳐요 |
| 15.3 | **안전** | 위기에서 백보드 위치를 침대 발치·카트 밑으로(찾는 지연) | 누가 침대 발치에서 백보드를 꺼내 주세요. / 누가 카트 밑에서 백보드를 꺼내 주세요. | 누가 백보드를 꺼내게 매트리스 한쪽을 들어 주세요 / 백보드를 깔아야 압박이 깊게 전해져요 |
| 15.4 | **안전** | 사람 요청을 복도 쪽·장갑으로 | 지금 당장 복도 쪽에 손이 더 필요해요. / 지금 당장 여기 장갑이 더 필요해요. | 코드팀이 오기 전까지 우리가 압박해요 / 코드 카트가 오면 패드부터 붙여요 |
| 15.5 | **안전** | 저작자 질문 — **실패.** 압박 라운드 2분을 3분·1분으로: 교대·리듬 확인 간격(AHA 2분)을 바꾸는 처치 시점 변경 | 제가 먼저 3분간 흉부압박 라운드를 맡을게요. / 제가 먼저 1분간 흉부압박 라운드를 맡을게요. | 2분마다 흉부압박 담당을 바꿔야 깊이가 유지돼요 / 흉부압박은 분당 110번 안팎이에요 |
| 15.6 | **안전** | 리듬 확인을 라인·시간 확인으로 — 압박을 멈추는 이유를 바꿈 | 라인 확인 — 모두 물러나세요. / 시간 확인 — 모두 물러나세요. | 물러나야 — 충격에 안전해요 / 리듬 확인 뒤 — 곧장 흉부압박을 이어요 |
| 16.0 | **안전** | **심각.** '빠졌어요'를 막힘·밀려 들어감으로 — 튜브가 안에 있는데 마스크로 짜는 말 | 기관튜브가 막혔어요 — 지금 마스크로 백을 짜고 있어요. / 기관튜브가 밀려 들어갔어요 — 지금 마스크로 백을 짜고 있어요. | 기관튜브가 빠졌어요 — 지금 마스크를 꺼내고 있어요 / 기관튜브가 빠졌어요 — 그래서 튜브로는 환기가 멈췄어요 |
| 16.1 | **안전** | 기도 키트를 흡인·응급 키트로 | 흡인 키트를 부르고 병동으로 돌아가게 해 주세요. / 응급 키트를 부르고 병동으로 돌아가게 해 주세요. | 기도 키트가 와야 병동에서 재삽관이 돼요 / 병동으로 돌아가면 그때 기도 키트를 열어요 |
| 16.2 | **안전** | 압박 대상(빠진 라인)을 막힌·꺾인 라인으로 | 막힌 라인에 압박을 유지해요. / 꺾인 라인에 압박을 유지해요. | 빠진 라인 자리에 거즈를 대요 / 빠진 라인 자리에서 피가 새기 쉬워요 |
| 16.4 | **안전** | 저작자 질문 — **실패.** 5초마다 숨 대신 밀착·고개 젖힘: 앞 단계가 아니라 그 순간 환기 대신 하는 일(되풀이 간격이 붙어 환기가 사라짐) | 5초마다 마스크를 밀착하고 있어요. / 5초마다 고개를 젖히고 있어요. | 숨은 한 번에 1초 동안 넣어요 / 숨을 세게 넣으면 위로 공기가 차요 |
| 16.5 | **안전** | X2 재삽관 대신 기구 소독(잡무). X1 기도 재평가는 앞 단계라 통과 | 병동으로 돌아가는 대로 기도를 재평가할게요. / 병동으로 돌아가는 대로 삽관 기구를 소독할게요. | — / 병동엔 재삽관 장비가 다 갖춰져요 |
| 16.6 | **안전** | 가슴 오름 확인을 마스크 밀착 확인으로(실패 1) | 제가 숨을 주기 전에 마스크가 밀착됐는지 지켜보세요. / 제가 숨을 줄 때마다 마스크가 밀착되는지 지켜보세요. | 제가 숨을 줄 때마다 가슴이 오르면 환기가 되는 거예요 / 가슴이 오르는지 보이게 옷을 젖혀 주세요 |
| 17.0 | **안전** | X1 백 짜는 근거를 '의식 없음'으로 — 진정 환자는 원래 의식이 낮음. X2 청색증은 통과 | 의식이 없어요 — 잘 밀착시켜서 백을 짜고 있어요. / 청색증이 보여요 — 잘 밀착시켜서 백을 짜고 있어요. | 무호흡 상태예요 — 백을 짜려고 마스크를 대고 있어요 / — |
| 17.2 | **안전** | X1 삽관 준비를 전원 이송 준비로 | 회복하지 않으면 전원 이송을 준비해요. / 경련하면 삽관을 준비해요. | 회복하지 않으면 백으로 버티기 어려워요 / — |
| 17.4 | **안전** | 환기 효과(가슴 오름)를 밀착·백 차오름으로 — 잘못된 안심 | 짤 때마다 마스크가 잘 밀착돼요. / 짤 때마다 백이 잘 차오르고 있어요. | 가슴이 오르면 환기가 되는 거예요 / 짤 때마다 포화도가 조금씩 오르고 있어요 |
| 17.5 | 길이 | 오답 둘 다 김(내용 통과 — 참인 이유) | 회복이 느려서 기도 카트를 불러 주세요. / 삽관이 필요해서 기도 카트를 불러 주세요. | 숨이 약해 기도 카트를 불러 주세요 / — |
| 18.0 | **안전** | X1 '멈추지 않아요' ≈ 급격(정답 둘), X2 '상처가 깊어요'로 수액 전개(기준 바꾸기) | 출혈이 멈추지 않아요 — 압박하고 수액을 활짝 열어요. / 상처가 깊어요 — 압박하고 수액을 활짝 열어요. | 출혈이 급격해요 — 압박할 거즈를 한 뭉치 주세요 / 출혈이 급격하면 — 혈압이 곧 크게 떨어져요 |
| 18.1 | **안전** | 대량수혈을 응급(소량) 수혈·심정지 프로토콜로 | 응급 수혈 프로토콜을 발동하고 외과에 연락해요. / 심정지 프로토콜을 발동하고 외과에 연락해요. | 대량수혈 프로토콜은 혈액을 묶음으로 계속 보내 줘요 / 외과가 와야 출혈 부위를 수술로 직접 막아요 |
| 18.3 | **안전** | X2 압박 대신 가운 덧입기. X1 거즈 대기는 앞 단계라 통과 | 지금 부위에 멸균 거즈를 열어 대고 있어요. / 지금 부위에 멸균 가운을 덧입고 있어요. | — / 직접 압박은 출혈 부위를 손으로 눌러 막아요 |
| 18.4 | **안전** | 혈액을 수술실·간호사실로 보냄 — 위기 지연 | 혈액 2유닛을 즉시 수술실로 가져다주세요. / 혈액 2유닛을 즉시 간호사실로 가져다주세요. | 혈액 2유닛이 오면 침상에서 둘이 확인해요 / 대량 출혈엔 혈액이 수액보다 먼저예요 |
| 19.1 | **안전** | X2 소생 장소를 '가장 가까운 문'으로 — 자기장 안일 수 있음 | 금속 물품은 MRI실에 들어갈 수 없어요 — 안전 구역으로 반출해요. / 코드 카트는 MRI실에 들어갈 수 없어요 — 가장 가까운 문으로 반출해요. | — / 코드 카트는 MRI실에 들어갈 수 없어요 — 자석에 끌려가요 |
| 19.2 | **안전** | 그 순간 압박 대신 브레이크·체위(대신 하는 일) | 자석 구역을 벗어나는 순간 브레이크를 잠가요. / 자석 구역을 벗어나는 순간 환자 몸을 평평하게 눕혀요. | 자석 구역에서는 금속 장비를 쓸 수 없어요 / 자석 구역을 벗어나면 코드 카트가 다가와요 |
| 19.3 | **안전** | 출입 규칙을 금속 소지자·보호자로 좁힘 | 금속을 가진 사람은 방 밖에 있어야 해요. / 보호자와 아이들은 방 밖에 있어야 해요. | 검사받지 않는 사람은 입구에서 먼저 선별해요 / 검사받지 않은 사람은 금속이 있을지 몰라요 |
| 19.4 | **안전** | 대피 위치를 문 앞·승강기로 — 위기 중 방향 오류 | 안전 구역은 저 이중문 바로 앞이에요. / 안전 구역은 저 승강기 바로 지나서예요. | 안전 구역에서는 제세동기를 써요 / 안전 구역에서 코드 카트가 기다려요 |
| 19.5 | **안전** | 백을 흡인·제세동기로 바꿈 | 벗어나는 순간 흡인을 준비해 둘게요. / 벗어나는 순간 제세동기를 준비해 둘게요. | 벗어나기 전에 백을 마스크에 끼워 둘게요 / 숨이 없으니 백이 가장 먼저 필요해요 |
| 20.0 | 기타 | X2 '덜컹거려요'는 교체 이유가 안 돼 걸러짐 — 바로 앞 단계(꺼내기)로 | 탱크 밸브가 새고 있어요 — 지금 예비 실린더로 전환해요. / 탱크가 덜컹거려요 — 지금 예비 실린더로 전환해요. | — / 탱크가 거의 비었어요 — 예비 실린더를 꺼내 주세요 |
| 20.1 | **안전** | X2 배터리 방전에 실내 공기로 짬 — 산소가 있는데 21%로 | 완전히 막히면 실내 공기로 백을 짤게요. / 배터리가 다 되면 실내 공기로 백을 짤게요. | — / 실내 공기에도 산소가 21퍼센트예요 |
| 20.2 | **안전** | 전원 찾기를 비상계단·비상구로 | 가장 가까운 벽면 산소와 비상 계단을 찾아요. / 가장 가까운 벽면 산소와 비상구를 찾아요. | 벽면 산소와 전원을 쓰면 탱크와 배터리를 아껴요 / 가장 가까운 벽면 산소는 복도 끝 방이에요 |
| 20.4 | **안전** | X1 엘리베이터에 콘센트(말이 안 됨), X2 벽면 산소 연결 = 20.2 정답(정답 둘)이자 전원 빠짐 | 엘리베이터에 들어가는 순간 벽면 콘센트에 꽂아요. / 방에 들어가는 순간 벽면 산소에 연결해요. | 방에 닿기 직전에 전원선을 풀어 둬요 / 벽면 전원에 꽂아야 모니터가 계속 켜져요 |
| 20.6 | 기타 | 점심·퇴근 — 듣지 않고 걸러짐 | 점심시간 전에 돌아왔어요. / 퇴근 전에 돌아왔어요. | 다 떨어지기 전에 바꿨어요 / 다 떨어지기 전에 엘리베이터를 탔어요 |

## B. 빈칸 새 값 (67문장)

| 문장 | 문제 | 지금 answer: 선택지 | 새 answer: 선택지 |
|---|---|---|---|
| 1.0 | delay는 '지연분까지'로 정답 둘, waste·noise 동떨어짐 | reserve: reserve, waste, delay, noise | reserve: reserve, sedation, suction, saline |
| 1.1 | signed·rented 동떨어짐 | charged: charged, labeled, signed, rented | charged: charged, labeled, cleaned, covered |
| 1.6 | blamed·paid·excused 동떨어짐 | accounted: accounted, blamed, paid, excused | accounted: accounted, asked, signed, cared |
| 2.1 | bubbles 정답 둘(공기 없는 라인도 보고함), dust 동떨어짐 | tension: tension, bubbles, dust, fluid | tension: tension, tape, slack, fluid |
| 2.2 | walls·doors도 장면에 맞음(정답 여럿), floors 수 일치로 걸러짐 | wheels: wheels, walls, floors, doors | wheels: wheels, mask, tank, flowmeter |
| 2.5 | splashes·labels 튜빙에 안 붙는 말 | kinks: kinks, stains, splashes, labels | kinks: kinks, flow, markings, stains |
| 3.3 | drunk 정답 둘(금식), tasted ≈ eaten | eaten: eaten, vomited, tasted, drunk | eaten: eaten, vomited, needed, asked for |
| 3.4 | Glasgow 정답 둘(진정 전 기준 의식 평가) | Mallampati: Mallampati, Apgar, Glasgow, Braden | Mallampati: Mallampati, Apgar, Framingham, Braden |
| 4.0 | telemetry 정답 둘(진정 중 심전도 감시) | capnography: capnography, telemetry, spirometry, radiography | capnography: capnography, temperature, spirometry, radiography |
| 4.3 | doubled a few points 문법 | dropped: dropped, climbed, jumped, doubled | dropped: dropped, climbed, jumped, rose |
| 5.2 | hourly 정답 둘(줄인 감시가 매시간일 수 있음) | reduced: reduced, hourly, constant, extra | reduced: reduced, intensive, constant, extra |
| 5.4 | wall air = 의료용 공기(21%)로 정답 둘, nasal air 말이 안 됨 | room: room, nasal, wall, bottled | room: room, warm, humid, bottled |
| 5.5 | rotate·relabel·reweigh re- 소리 닮음(실패 6) | recheck: recheck, rotate, relabel, reweigh | recheck: recheck, weigh, bathe, dress |
| 6.0 | changed ≈ matched(정답 둘), stored … to 문법 → 빈칸을 transport로 | matched: matched, changed, lowered, stored | transport: transport, home, anesthesia, ward |
| 6.1 | color·price 동떨어짐 | depth: depth, brand, color, price | depth: depth, size, brand, expiration |
| 6.2 | broken·missing 반대말 | ready: ready, broken, stored, missing | ready: ready, sealed, folded, cleaned |
| 7.0 | instruction·correction·infection -tion 소리 닮음 | interruption: interruption, instruction, correction, infection | interruption: interruption, batteries, tubing, labels |
| 7.2 | pumps … drawn 문법으로 걸러짐 | syringes: syringes, vials, pumps, tubes | syringes: syringes, vials, cultures, tubes |
| 7.3 | noise·dust·heat 동떨어짐 | life: life, noise, dust, heat | life: life, errors, alerts, signal |
| 8.0 | minimal 정답 둘(최소 진정도 목소리에 반응하고 기도 유지 — 참) | moderate: moderate, deep, minimal, general | moderate: moderate, deep, dissociative, general |
| 8.1 | pain 정답 둘(적정 중 통증 재평가) | depth: depth, pain, skin, color | depth: depth, weight, skin, color |
| 8.6 | there·upstairs·outside 장소 낱말 동떨어짐 → 빈칸을 depth로 | here: here, there, upstairs, outside | depth: depth, height, width, color |
| 9.1 | antibiotic·anticoagulant·diuretic oversedation 말이 안 됨 → 진정 계열 오답으로 | benzodiazepine: benzodiazepine, anticoagulant, antibiotic, diuretic | benzodiazepine: benzodiazepine, opioid, dexmedetomidine, propofol |
| 9.2 | seizure 정답 둘(플루마제닐 뒤 경련 감시) | resedation: resedation, seizure, itching, dryness | resedation: resedation, rebleeding, itching, dryness |
| 9.4 | thickness·fragrance 동떨어짐 | concentration: concentration, temperature, thickness, fragrance | concentration: concentration, temperature, pump rate, room number |
| 9.5 | worried·sorry·tired 감정어 동떨어짐 | ready: ready, worried, sorry, tired | ready: ready, charting, leaving, moving |
| 9.6 | pain·color 정답 둘(역전 뒤 통증·안색 감시) | response: response, skin, pain, color | response: response, skin, weight, mood |
| 10.0 | faints — '실신하면 압박 시작'(위험한 지시가 보임) | arrests: arrests, faints, coughs, vomits | arrests: arrests, sneezes, coughs, vomits |
| 10.2 | fluids·calls 정답 둘 → 빈칸을 airway로 | meds: meds, labs, fluids, calls | airway: airway, family, billing, schedule |
| 10.3 | routes 정답 둘, roles/routes/rules/rooms 소리 닮음 | roles: roles, routes, rules, rooms | roles: roles, shifts, breaks, charts |
| 10.4 | arrives·opens 말이 안 됨 | stalls: stalls, arrives, opens, descends | stalls: stalls, slows, beeps, descends |
| 10.5 | pole 정답 둘(이송 중 폴대 잡기) | bag: bag, pole, door, wall | bag: bag, chart, phone, clipboard |
| 11.0 | address·insurance 동떨어짐(room은 식별자 아님 — 좋은 오답) | site: site, weight, address, insurance | site: site, room, date, schedule |
| 11.1 | gloves·lamp 정답 둘 | suction: suction, chair, lamp, gloves | suction: suction, chair, printer, phone |
| 12.0 | an SOAP 관사로 걸러짐 | SBAR: SBAR, SOAP, MAR, ECG | SBAR: SBAR, MAR, ECG, MRI |
| 12.1 | labs 정답 둘(전원 때 함께 보냄) | imaging: imaging, labs, notes, orders | imaging: imaging, billing, staffing, schedules |
| 13.4 | allergies·medications 정답 둘(MRI 선별 항목) | implants: implants, allergies, wounds, medications | implants: implants, wounds, vitals, diet |
| 13.5 | cart·pump·tube 전부 non-ferrous여야 해 정답 여럿 → 빈칸을 non-ferrous로 | tank: tank, cart, pump, tube | non-ferrous: non-ferrous, non-latex, non-sterile, non-slip |
| 14.0 | insurance·schedule·menu 동떨어짐 + 관사(change menu) | management: management, insurance, schedule, menu | management: management, staffing, visiting, rounds |
| 14.3 | side·top·line 문법·관용 → 빈칸을 support로 | edge: edge, side, top, line | support: support, sleep, privacy, exercise |
| 14.6 | quickly 정답 둘 | together: together, alone, quietly, quickly | together: together, alone, quietly, privately |
| 15.1 | laundry·lunch·linen 동떨어짐 | crash: crash, laundry, lunch, linen | crash: crash, supply, isolation, procedure |
| 15.2 | rolling·turning 정답 둘(코드 중 백보드 깔 때 굴림) | bagging: bagging, lifting, turning, rolling | bagging: bagging, weighing, bathing, dressing |
| 15.5 | rest·pause·break — '2분 쉬기'(위험한 처치가 보임) | round: round, rest, pause, break | round: round, lecture, video, survey |
| 15.6 | still ≈ clear | clear: clear, calm, quiet, still | clear: clear, calm, quiet, seated |
| 16.0 | bent·loose — 그 상태에 마스크 환기(틀린 처치가 보임) | out: out, bent, dry, loose | out: out, labeled, sterile, new |
| 16.1 | up 정답 둘(병동이 위층이면) → 빈칸을 airway로 | back: back, up, out, off | airway: airway, dressing, suture, isolation |
| 16.4 | sips·pills·drinks — 무호흡 환자에게 입으로(위험한 처치가 보임) | breaths: breaths, sips, pills, drinks | breaths: breaths, updates, reports, signals |
| 16.5 | garage·cafeteria 동떨어짐 | unit: unit, lobby, garage, cafeteria | unit: unit, lobby, hallway, elevator |
| 17.0 | masking 정답 둘 | bagging: bagging, masking, tilting, bracing | bagging: bagging, weighing, tilting, bracing |
| 17.1 | vaccine·laxative 동떨어짐 | reversal: reversal, contrast, vaccine, laxative | reversal: reversal, contrast, numbing, cleaning |
| 17.2 | transfer·reposition 정답 둘 | intubate: intubate, reposition, transfer, isolate | intubate: intubate, shower, bathe, isolate |
| 17.5 | linen·laundry·dietary 동떨어짐(15.1 되풀이) | airway: airway, linen, laundry, dietary | airway: airway, supply, feeding, dressing |
| 17.6 | slowly·deeply·quietly 정답 둘 → 빈칸을 breathe로 | again: again, slowly, deeply, quietly | breathe: breathe, bleed, shiver, cry |
| 18.0 | drains — 출혈 중 배액관 열기(위험), curtains 동떨어짐 | fluids: fluids, drains, valves, curtains | fluids: fluids, curtains, windows, doors |
| 18.1 | tiny·small 동의어 묶음 | massive: massive, minor, tiny, small | massive: massive, routine, pediatric, minor |
| 18.2 | an pediatric 관사 | emergency: emergency, outpatient, elective, pediatric | emergency: emergency, outpatient, elective, optional |
| 18.3 | gentle·light·slow — 급격한 출혈에 약한 압박(위험한 처치가 보임) | direct: direct, gentle, light, slow | direct: direct, cuff, air, water |
| 18.4 | pints ≈ units(1유닛 ≈ 1파인트, 정답 둘) | units: units, liters, ounces, pints | units: units, liters, ounces, vials |
| 18.5 | chair·gown·pillow 동떨어짐 | line: line, chair, gown, pillow | line: line, chart, form, sheet |
| 18.6 | up 정답 둘(층에 따라) | down: down, up, out, back | down: down, home, out, to lunch |
| 19.2 | garage·parking·gate 동떨어짐 | magnet: magnet, garage, parking, gate | magnet: magnet, lobby, elevator, pharmacy |
| 19.4 | behind ≈ past(정답 둘) | past: past, before, near, behind | past: past, before, above, beside |
| 19.6 | keys·phone·wallet — TASK 실패 6의 예 그대로 | pulse: pulse, keys, phone, wallet | pulse: pulse, IV, voice, color |
| 20.1 | fresh ≈ room | room: room, fresh, cold, dry | room: room, cold, dry, hot |
| 20.4 | panel 정답 둘(헤드월 패널) | outlet: outlet, generator, switch, panel | outlet: outlet, switch, mirror, hook |
| 20.6 | down 정답 둘(made it down) | back: back, up, down, off | back: back, clear, worse, up |

## C. decoy 새 값 (41문장)

| 문장 | 문제 | 지금 | 새 decoy |
|---|---|---|---|
| 0.2 | ', we sign' — 조립하면 멈춤 대신 서명(실패 7 'and sign') | `, we sign` | `If he wakes up` |
| 0.5 | 'CT is closed' 반대말·빈칸 오답과 같은 낱말 | `CT is closed` | `MRI is ready` |
| 0.6 | ', we text' 뜻이 안 됨 | `, we text` | `Once the elevator comes` |
| 1.2 | 'are on the chart' 어느 자리에도 안 맞음 | `are on the chart` | `the side pocket` |
| 3.3 | 'until noon' 현재완료와 안 맞아 걸러짐 | `until noon` | `since breakfast` |
| 4.1 | 'and label the airway' 뜻이 안 됨 | `and label` | `Her heart rate` |
| 5.0 | 'and sitting her own airway' 자리 없음 | `and sitting` | `She's oriented` |
| 5.5 | 'until I step out' 문법 | `until I` | `go on break` |
| 6.0 | 'default ones' — 조립하면 기본값 설정(위험) | `default ones` | `the bed alarm settings` |
| 6.5 | 'so we'd swap any slip' 자리 없음 | `so we'd swap` | `at the chin` |
| 7.3 | 'plenty of dust' 동떨어짐(dust 되풀이) | `plenty of dust` | `The pump screen` |
| 8.1 | 'and rewrite her depth' 뜻이 안 됨 | `and rewrite` | `her dose` |
| 8.2 | 'and hold the door' — 조립하면 약물 보류가 빠지고 잡무 | `and hold the door` | `too pale` |
| 9.1 | 'for antibiotic' 빈칸 오답과 같은 말·뜻이 안 됨 | `for antibiotic` | `The cart is ready` |
| 9.2 | 'and sign' — 실패 7 예 그대로 | `and sign` | `for the next case` |
| 9.5 | ', we're done' 반대말(포기) | `, we're done` | `for the scan` |
| 9.6 | 'and mark' 다른 행동 | `and mark` | `I'll mix it` |
| 10.2 | ', I'll run the labs' — 조립하면 약물 담당이 사라짐 | `, I'll run the labs` | `, I'll run the scan` |
| 10.4 | ', we cover' 반대말 | `, we cover` | `, we read` |
| 11.2 | 'and tell you supplies' 문법 | `and tell you` | `and show you` |
| 11.5 | 'bandages' 자리 없음 | `bandages` | `more topical` |
| 13.2 | 'and a clipboard' — MRI에 금속 클립 | `and a clipboard` | `and a foam pad` |
| 13.5 | 빈칸을 non-ferrous로 옮겨 'is non-slip'이 선택지와 겹침 | `is non-slip` | `is half full` |
| 14.0 | 빈칸 오답 insurance와 겹침 | `change insurance` | `change shifts` |
| 14.2 | 'and pack for travel' — 문제 대비 대신 짐(잡무) | `and pack for travel` | `If we wait` |
| 14.3 | 빈칸을 support로 옮겨 sleep과 겹침 | `of needing more sleep` | `of needing a bath` |
| 14.5 | 'a week' — 검사를 미루는 시각 decoy | `a week` | `and call` |
| 15.0 | ', labeling' 잡무 | `, labeling` | `Stop the scan` |
| 15.1 | 'linen cart' 동떨어짐 | `linen cart` | `dressing cart` |
| 15.4 | 'up the hall' — 사람을 엉뚱한 곳으로 | `up the hall` | `more light` |
| 15.5 | 'of laundry' 잡무 | `of laundry` | `of bagging` |
| 15.6 | 'Rhythm break' 자리 없음 | `Rhythm break` | `Pulse` |
| 16.0 | 'with the tube' — 빠진 튜브로 짜기(위험) | `with the tube` | `in the hallway` |
| 16.1 | 'to the lab' 위기 중 엉뚱한 곳 | `to the lab` | `the IV kit` |
| 16.2 | 빈칸 오답 tangled와 겹침 | `on the tangled` | `on the feeding` |
| 17.0 | 'with a good pillow' 자리 없음 | `with a good pillow` | `grip` |
| 17.1 | 'and sort' — 진정제를 끊지 않음 | `and sort` | `all paperwork` |
| 17.2 | 'if she doesn't sleep' 자리 없음 | `if she doesn't sleep` | `eat` |
| 18.0 | '— apply ointment' — 출혈에 연고(위험) | `— apply ointment` | `Her skin is cold` |
| 18.6 | 빈칸 오답 home과 겹침 | `on their way home` | `Pharmacy is` |
| 19.2 | 'Start breathing' 다른 처치 | `Start breathing` | `Start the timer` |

## D. order (21장, 인접 교환 63건)
통과 9장: S0 S1 S2 S3 S5 S6 S12 S18(교환하면 앞 줄을 가리키는 말이 끊김), S19는 F. 고칠 것 12장 — 새 줄은 `vals.py`의 `ORD`·`ORDWHY`(15단어 이하 확인).

| 카드 | 문제 | 새 줄 (en / ko) |
|---|---|---|
| S4 L2·L3 | `On those, her sats…`·`At that drop, I'll…` 영어가 어색 | L2 `On that monitor, her sats just dropped a few points.` / L3 `With that drop, I'll stimulate and support the airway.`(ko 그대로) |
| S7 L3 | 임상 — `for a second` 하락에 승압제를 올리는 흐름(잠깐 떨어진 값은 기다려 다시 봄) | `While titrating, I saw his MAP dip when we moved the bed.` / 적정하는 중에 침대를 옮길 때 MAP이 떨어지는 걸 봤어요 |
| S8 L3 | 2↔3 읽힘(`With that reassessed`가 L1 뒤에도 붙음) | `On that reassessment, she's somewhere between moderate and deep.` / 다시 평가해 보니 중등도와 깊은 진정 사이 어디쯤이에요 |
| S9 L3 | `both doses` 가리킬 말 없음(카드엔 날록손만) + 2↔3 읽힘(L1 `drawing it up`) | `With the naloxone drawn up, the syringe is labeled and within reach.` / 날록손을 뽑았으니 주사기에 라벨을 붙여 손 닿는 곳에 뒀어요 |
| S10 L3 | 2↔3 읽힘(`With roles set`이 L1 뒤에도 붙음) | `With the airway and meds covered, I know where the nearest code cart is.` / 기도와 약물을 나눴으니 가장 가까운 코드 카트가 어디 있는지 알아요 |
| S11 전체 | 임상 — 타임아웃은 준비를 마친 뒤 시작 직전(Universal Protocol). 지금은 타임아웃 → 무균 준비 | L1 `The sterile tray and suction are set up and ready.`(준비·shield) → L2 `With that set, let's do the time-out — patient, procedure, and site.`(타임아웃·pushpin) → L3 `After the time-out, I'll monitor her vitals and hand you supplies.`(역할) → L4 그대로. why: `ORDWHY[11]` |
| S13 L3 | 2↔3 읽힘 + 시제(`Once the equipment's set, I checked`) | `With the monitor and pump chosen, I checked his implants against the list.` / 모니터와 펌프를 정했으니 목록과 이식물을 대조했어요 |
| S14 L2 | `That's why let's …` 비문 | `So let's weigh the benefit against the transport risk.` / 그러니 이송 위험과 이익을 저울질해 봐요 |
| S15 L3 | 임상 — L2에서 압박하던 내가 L3에서 백을 짜면 압박 담당이 없음 | `With the cart here, I'm bagging while you push meds and the team compresses.` / 카트가 왔으니 제가 백을 짜고 당신은 약물을, 팀은 압박을 맡아요 |
| S16 L2~L4 | 임상 — `With his chest rising, call for the airway kit`는 호출을 가슴 오름 확인 뒤로 미룸(발관이면 곧바로 부름) | L2 `While I bag, call for the airway kit and get us back.` / L3 `As we roll, watch his chest rise with each breath I give.` / L4 `Once we're back, we'll re-intubate in the unit.` — ko·why는 `vals.py` |
| S17 L3 | 2↔3 읽힘(`Given that`이 L1 뒤에도 붙음) | `With chest rise confirmed, give the reversal agent and stop all sedatives.` / 가슴이 오르는 걸 확인했으니 역전제를 주고 진정제를 끊어요 |
| S20 L3 | 2↔3 읽힘(`Until then`이 L1 뒤에도 붙음) | `Until we reach that, I'll bag him on room air if we run out.` / 거기 닿을 때까지 다 떨어지면 실내 공기로 백을 짤게요 |

## E. tag·icon·why
| 곳 | 문제 | 새 값 |
|---|---|---|
| 4.3 icon | 떨어지는 값에 `chartup` | `faceWorried`(7.4와 같게) |
| 16.5 icon | 재삽관에 `plane` | `stetho` |
| 18.6 icon | 외과가 내려옴에 `plane` | `run` |
| 10.2 why | 동어반복 | `You manage …, I'll run …처럼 쉼표로 두 사람 몫을 나란히 말하면 누가 무엇을 하는지 한 번에 들려요. 위기 때 기도와 약물을 동시에 하려면 떠나기 전에 나눠 둬야 해요.` |
| 19.2 why | "손은 쓸 수 있으니 벗어나자마자 시작" — 앞뒤가 안 맞음(F) | `the moment we clear …로 시점을 못 박아요. 자석 구역 안에는 코드 카트·제세동기를 들일 수 없어 장비를 쓰는 소생은 구역 밖에서 이어 가요.` |
| 13.5 why | 탱크만 — 조절기가 철인 경우가 흔함 | `non-ferrous는 철이 없어 자석에 끌리지 않는다는 뜻이에요. we're using으로 지금 쓰는 바로 그 탱크를 가리켜요 — 탱크와 조절기 모두 MR 표시를 봐요.` |

## F. 사용자 판단 (문장 `en`은 v44 정본이라 B는 고치지 않음 — 근거 확인 권장)
1. **19.0·19.2·order S19 — MRI 안 심정지에서 압박 시점.** ACR MR 안전 지침은 Zone IV에서 심정지가 나면 **기본 소생(압박)을 곧바로 시작하면서** 미리 정한 자기장 안전 장소로 빼내라고 합니다(카트·제세동기는 밖에서). "자석 구역을 벗어나는 순간 압박 시작"(19.2)·"안전 구역에 들어서면 압박"(S19 L4)은 압박을 늦추는 말로 읽힙니다. 사용자가 지침 쪽을 택하면 S19 카드를 `We lost her pulse right as the scan started.` → `Without a pulse, start compressions as we pull her out.` → `No code cart enters the suite, so we evacuate her to the safe zone.` → `Once she's in the safe zone, use the cart and pads.`로 바꾸고 19.2 문장도 다시 쓰는 것을 권합니다. (B는 판단 전이라 S19 카드는 그대로 둠.)
2. **16.4 "every five seconds".** AHA 2020 성인 구조 호흡(맥박 있음)은 **6초마다 1회(분당 10회)** — 5초는 2010 지침의 5~6초. 소아는 2~3초. 문장 `en`과 why는 v44 그대로 두었고, 새 오답은 간격을 말하지 않게 썼습니다.
3. **18.0 "open fluids wide".** 대량 출혈은 ATLS 10판이 결정질 수액을 1 L 안쪽으로 줄이고 혈액을 일찍 주라고 함(희석·응고 장애). "수액을 활짝"은 혈액이 오기 전 잠깐이라는 맥락이 없으면 오해를 부를 수 있음 — `en` 판단.
4. **6.0 "I've matched the transport vent settings".** 미국 병원은 대개 호흡치료사가 이송 호흡기를 맞추고 동행합니다. 간호사 말이면 "RT matched…"나 "I've checked the transport vent settings match"가 더 맞음.
5. **19.5 ko** `준비해 둘게요`(미래)는 en `I've got the bag ready`(이미 준비됨)와 시제가 다름 — A 몫(ko 고치면 distractorsKo도 다시).
6. chunks에서 구 경계를 끊은 조각(17.0 `with a good / seal`, 17.2 `if she doesn't / recover`, 19.4 `those double / doors`) — A 몫·keyPhrase 여부는 A가 확인(decoy는 위에서 바꿈).

## 종합
고친 뒤 내보내도 됩니다 — 다만 **distractorsKo 92·빈칸 67·decoy 41·order 12장**을 반영해야 하고, 그중 10.0·15.0·16.0(맥박 없이 압박·튜브 있는데 마스크)과 빈칸 15.5·16.4·18.3은 반드시 고칠 것. 수정 담당은 `revB_icu-transport-procedure_vals.py`를 그대로 넣고 `verify_one_theme.py`와 `revB_icu-transport-procedure_rep.py`로 상한(최댓값 5)을 다시 보세요. F-1은 사용자 결정 뒤 S19·19.2를 다시 엽니다.
