# or-tourniquet — B 검토 (v46 절 1~6·8, 문장 105 전수)

## 종합
- **고칠 것 149건**(필드 단위): distractorsKo 62문장 · 빈칸 50문장 · decoy 25 · order 7장 · why 3 · tag/icon 2.
- **그중 안전·정답 둘 62건**: distractorsKo 55문장(안전 실패 42 · 정답 둘 7 · 둘 다 6), 빈칸 5(1-2 `reset`, 1-4 `stops/pauses`는 허혈 시간 재설정·중지를 보여 줌; 3-0 `tubing`, 13-3 `far`, 17-3 `hard`는 정답 둘), decoy 2(11-0 `avoid`는 "더 낮은 압력을 피한다" 반대말 조립, 17-4 `the night shift`는 알릴 사람을 야간조로 바꾸는 조립).
- 아래 새 값을 사본(`check_or-tourniquet_Brev/or-tourniquet.yaml`, `apply_or-tourniquet_Brev.py`로 생성)에 모두 넣어 `verify_one_theme.py or …` → **위반 0, 경고 0, `==> 통과`**(V20 길이·W18·W19 포함). 대상 파일은 손대지 않았습니다.

## 심각한 문제
1. **지키려던 값 대신 "무엇을" 확인·기록·알리는지를 바꿨다.** 압력·시간·커프 위치를 건드리지 않으려고 그 문장의 확인·기록·알림 **대상**을 다른 것으로 바꾼 오답이 상황 0·1·3·5·8·9·10·12·14·17·18·20에 몰려 있습니다(압력 설정→경보·크기, 알람 작동→소리·배터리, 시간 추적→징후·출혈 시간, 피부 확인→튜브·건조, 색 변화 보고→온도·맥박, 총 허혈 시간→예상·남은 시간, 압력 확인→번호·날짜). 그대로 따라 하면 그 순간 봐야 할 것을 놓칩니다(TASK 실패 유형 1·3).
2. **바꾼 대상이 참인 다른 행동이라서 정답이 둘인 경우**: 1-3 "푼 시각"(이것도 기록함), 2-2 이물·물기(12번 상황의 정답), 2-3 거즈(패딩 재료), 3-0 패드·드레이프 전(둘 다 참), 9-1 "원위 커프도 올려요"(전환의 일부), 9-3 "먼저 내려가는지"(Bier 블록에서 실제 확인), 12-0·12-3 튜브 끼임, 17-4 신경 점수, 20-0·20-3 신장 손상(장시간 허혈의 실제 우려).
3. **위기 문장에서 처치를 비움**: 16-1·16-4 수액·승압제→담요·거즈, 19-1 검사·치료제→서류(두 오답 모두 "서류"), 19-2 돕기→설명·기록, 19-4 검사→번역·휴식, 15-3 교대·이동(곁을 떠남), 18-0·18-2·18-4 출혈 중 압력 확인·장비 해결을 다른 일로.
4. **시점·상태 바꾸기**: 1-0 D2 "풀었어요", 6-0 D2 "넘었어요", 6-4 D1 "도달했다고", 7-2 D1 "곧"(Deflating now), 6-2·7-2 "천천히", 7-3 알림 시점을 수술 시작·교대 전으로. 6-1 "평균"·6-3 "안전 구역"은 잘못된 안심.
5. **빈칸 오답이 장면과 동떨어짐 — 41문장**(menu·invoice·billing·payroll·receipt·ledger·recipe·diet·vote·pay·buy·resell·lunch·weather·elevator·door·curtain·ceiling 등). 관사로 걸러지는 것 2건: 5-2 `an private`, 19-0 `a ocular`. 같은 묶음 돌려쓰기: 19-1=19-4(forms/badges/stamps), 10-1≈10-4(warm·early), 0-1≈11-3(volume·brightness).
6. **decoy가 두 갈래에 몰림**: 건물·문·커튼·엘리베이터·옷장·복도 18개(1-0, 1-1, 2-4, 4-0, 6-0, 6-1, 6-2, 6-3, 6-4, 7-2, 10-3, 12-1, 12-3, 12-4, 14-3, 15-2, 16-3, 18-2), 소리 갈래 10개(0-1 louder, 2-1 noise, 4-3 beeps, 8-2 loud, 10-4 loud, 12-2 sound, 13-1 loud, 13-3 loud, 14-1 audible, 15-4 louder). 자리 불일치 4개: 7-0 `— everyone seated`, 13-1 `a loud`(관사에서 끊김), 0-4 `when we agreed`(비문), 18-0 `the cuff smell`.

## 부르는 쪽이 요구한 수치(원본 → 고친 사본)
| 항목 | 원본 | 고친 사본 |
|---|---|---|
| 오답 둘 다 같은 표지 틀(려고·도록·기 전에·게·동안 — ko에 없는 것) | 0 | 0(표지 틀은 29문장에 하나씩만) |
| 오답 둘 다 교과서 사실 | 2(3-0, 15-1 — 15-1은 소견 이유라 둠) | 3-0 해소. 새 값 중 "앞 단계+참인 이유" 짝(0-0, 9-1, 20-3 등)은 TASK가 허용하는 틀 |
| decoy 장소 갈래 / 소리 갈래 / 자리 불일치 | 18 / 10 / 4 | 9 / 4(2-1·4-3·12-2·14-1, 자리는 맞음) / 0 |
| 빈칸 동떨어짐 / 관사 오류 | 41 / 2 | 0 / 0(W18 0) |
| W19 오답 전용 어간 최댓값 | 소독 5 · 마취 4 · 비용 4 · 교대 3 · 평균 3 · 서류 3 | 패딩 5 · 알리 5 · 통증 5(전부 5 이하) |
| W18 · W19 경고 | 0 · 0 | 0 · 0 |

빈도표 상위 5(원본, 앞 2자 어간): 소독 5(0-3, 2-0, 5-3, 13-2, 19-0) · 마취 4 · 비용 4(10-0, 10-3, 17-1, 20-0) · 크기 3 · 미끄 3. 상한(5)은 넘지 않았지만 "비용·점심·일정·서류"가 들어간 오답은 뜻만으로 걸러져 듣기 문제가 되지 않습니다.

## 저작자가 판정을 부탁한 곳
- **0-1** 고침: D1 "매번"≈"보통"(정답 둘), D2 "저장"은 뜻이 없음. **0-3** 해는 없지만 "이걸(압력) 소독·주문"은 말이 되지 않아 걸러짐 → 복창·차트에 적기(앞·뒤 단계)로. **8-1** 둘 다 실패: 문자는 손을 씻은 팀이 못 보고, 방송은 알릴 사람이 병원 전체로 바뀜.
- **1-2·1-3·3-2·3-4·20-4 실패**(시각·기저 피부·총 시간 기록을 다른 기록으로 바꿈). **14-4**는 해는 없지만 "들리는 것·느끼는 것을 기록"은 아무도 하지 않을 말이라 D1 하나만 교체.
- **9-1 둘 다 실패**: "점검해요"는 전환 대신 하는 일, "도 올려요"는 전환의 앞 절반이라 정답 둘. → 참인 이유(지혈대 통증 감소) + 뒤 단계(전환 뒤 근위 커프 내리기).
- **16-1·16-4·19-1·19-2·19-4 실패**(위기에 약·검사·돕기를 담요·거즈·서류·설명·기록·번역·휴식으로 바꿈). **16-2** D1(수술 기사와 함께)은 감시가 그대로라 통과, D2 "혼자"는 with you 뒤집기라 실패.

## order (5번·8번)
| 장 | 문제 | 고칠 값 |
|---|---|---|
| S0 | 1줄 `based on the limb`는 사지압(LOP) 개념이 빠져 뜻이 틀림 | `I'm setting the cuff pressure based on limb occlusion pressure.` |
| S6 | 4줄: 한계에 닿은 뒤 "곧 빼야 할까요?"라고 물으면 감압이 선택처럼 들림(15번 상황은 "지금 빼야") | `Since we're there, the surgeon needs to plan deflation now.` |
| S7 | 2줄 `the changes that will bring` 비문(bring에 목적어가 없음) | `Anesthesia, be prepared for the changes release will bring.` |
| S10 | 3↔4를 바꿔도 자연스러움(4줄 `that`이 2줄도 가리킴) | 4줄 → `With that history flagged, let's ask the surgeon if it's still safe.` |
| S14 | 3↔4를 바꿔도 됨(`those color changes`가 1줄을 가리킴) | 4줄 → `Once that's documented, I'll report the color changes to the surgeon.` |
| S15 | 2↔3을 바꿔도 됨(보고와 감압 판단이 묶이지 않음) | 3줄 → `The surgeon agrees we can't go past it, so we deflate now.` |
| S17 | 2↔3을 바꿔도 됨 | 3줄 → `After that report, we'll need a neuro assessment postoperatively.` |
나머지 14장은 인접 교환 3개가 모두 어색하고, `ko` 머리말이 카드 내용과 맞으며 임상 순서도 맞습니다.

## why · tag · icon (1번·6번)
- why: 13-1·13-4·20-2는 "~가 방식을 부사로 덧붙여요"라는 같은 틀이라 왜 그렇게 말하는지가 없음 →
  13-1 "carefully를 붙여, 재관류 뒤 짧아진 간격이라 놓치면 안 된다는 긴장을 전해요." /
  13-4 "closely는 눈을 떼지 않는다는 강도예요 — 재적용 간격은 첫 회보다 짧아 여유가 없어요." /
  20-2 "carefully가 이 숫자가 근손상 평가의 근거라는 무게를 실어요."
  나머지 why는 사실과 맞고 ko를 되풀이하지 않습니다.
- tag 16-1 `가져올까요`(역할이 아닌 말 조각) → `도움 제안`. icon 0-1 `chartup`(올라가는 그래프)은 "더 낮게"와 반대 → `gear`.
- 참고(B 범위 밖, 문장 en 사실): 4-3·11-2 "the smallest cuff that still fits"는 AORN 권고(맞는 것 중 **넓은** 커프가 더 낮은 압력으로 막음)와 어긋날 수 있습니다. A/부르는 쪽이 판단해 주세요.

## 빈칸·decoy 바꾼 이유(갈래)
- 동떨어진 오답 → 같은 분야에서 틀린 말: 1-1, 2-3, 5-3, 6-4, 7-1, 7-4, 8-1, 8-2, 9-2, 9-3(wh절을 못 받는 clean/buy/wash), 9-4, 10-2, 10-4, 11-1, 12-0, 12-1, 12-2, 13-1, 13-2, 14-1, 14-4(concealing은 숨기기를 보여 줌), 15-2, 15-3, 16-4, 17-1, 17-2, 17-4, 18-2, 19-1, 19-4, 20-1, 20-3, 20-4, 0-1, 6-0, 6-1, 6-3, 3-4, 13-4, 16-0, 5-1.
- 5-0: greet/train/charge는 동떨어지고 동사 동의어가 많음 → 빈칸을 `limit`으로 옮김(start/incision/induction). 14-3: `leg` 자리는 arm이 정답 둘이 됨 → `below`로 옮김(above/inside/behind).
- decoy는 같은 분야의 다른 대상·같은 청크 자리 모양으로(표 참고).

## 문장별 판정 (105)
판정 기호: S = 안전 실패, T = 정답 둘, Q = 품질(동떨어짐·되풀이). 통과 = ①~⑥ 통과. 새 값은 사본에서 V20·W18·W19 통과를 확인한 값입니다.

| # | 오답 판정 | 새 distractorsKo (바뀐 쪽만) | 빈칸 | decoy |
|---|---|---|---|---|
| 0-0 | S 압력 설정 대상을 경보·크기로 바꿈(그 순간 볼 것 바꾸기) | D1 사지압을 재려고 도플러를 대고 있어요. / D2 사지압을 기준으로 하면 커프 압력이 낮아져요. |  |  |
| 0-1 | T D1 매번≈보통; D2 "저장" 무의미 | D1 팔이면 보통 더 좁은 띠를 써요. / D2 다리면 보통 더 높게 설정해요. | volume,brightness,speed → volume,alarm,speed | a louder setting → a wider cuff |
| 0-2 | S D1 확인 상대를 간호사로 바꿈(알림 대상 규칙); D2 통과 | D1 올리기 전에 압력을 맞추려고 화면을 돌려요. |  |  |
| 0-3 | Q 소독·주문은 압력에 붙지 않는 무의미 동사 → 앞·뒤 단계로 | D1 올리기 전에 항상 이걸 복창해요. / D2 올리기 전에 항상 이걸 차트에 적어 둬요. |  |  |
| 0-4 | Q D2 알람값 = 확인 대상 바꾸기(경미) | D2 이 설정값은 우리가 합의해서 바꾸지 않아요. |  | when we agreed → what we ordered |
| 1-0 | S D2 "풀었어요" 뒤집기+상태 오보; D1 통과(이른 시각, 해 없음) | D2 이 시각에 커프를 감았어요 — 기록할게요. |  |  |
| 1-1 | 통과 |  | floor,ceiling,bed → drape,tray,gown |  |
| 1-2 | S 시간 추적을 징후·출혈 시간 추적으로 바꿈 | D1 추적하려고 지금 시계를 볼게요. / D2 허혈 시간이 길면 신경이 다쳐요. | erase,reset,cancel → guess,print,hide |  |
| 1-3 | S/T D1 푼 시각도 실제 기록(정답 둘·뒤집기), D2 시각 기록→사람 기록 | D1 올린 시각은 시계로 먼저 봐요. / D2 올린 시각을 적어야 알람을 맞춰요. |  |  |
| 1-4 | 통과 |  | stops,ends,pauses → slows,doubles,ends |  |
| 2-0 | S 패딩을 소독포·눈 패딩으로 — 사지 보호 단계 빠짐 | D1 커프를 감기 전에 패딩을 대려고 다리를 들어요. / D2 커프를 감은 뒤 패딩이 삐져나왔는지 봐요. |  |  |
| 2-1 | 통과 |  |  |  |
| 2-2 | T 이물·물기 확인은 12번 상황의 정답 행동 | D1 밑에 주름이 없게 패딩을 당겨 놓을게요. / D2 밑에 주름이 있으면 피부가 눌려요. |  |  |
| 2-3 | S/T D1 거즈는 패딩 재료(정답 둘), D2 끈 = 보호 빠짐 | D1 뭘 대기 전에 이 부위부터 말려 두고 있어요. / D2 패딩을 먼저 대야 그 아래 물집이 안 생겨요. | table,room,chart → tray,drape,pole |  |
| 2-4 | 통과 |  |  |  |
| 3-0 | T 둘 다 참(패드 전·드레이프 전 피부 살핌) | D1 커프를 감기 전에 조명부터 켤게요. / D2 커프를 감기 전에 패딩부터 꺼낼게요. | tubing,screen,label → gown,screen,label |  |
| 3-1 | 통과 |  |  |  |
| 3-2 | S 기저 피부 기록→체온·신경 기록(피부 확인 다른 일로; 신경은 참) | D1 기저 피부 상태를 적으려고 소매를 걷어요. / D2 기저 피부 상태는 지혈대를 풀고 다시 봐요. |  |  |
| 3-3 | 통과 |  |  |  |
| 3-4 | S D1 최종 상태=기저 기록 빠짐, D2 호흡=대상 바꾸기 | D1 기저 상태를 먼저 적어야 변화를 알아요. / D2 기저 상태를 적고 나서 패딩을 대요. | final,rough,random → final,partial,hourly |  |
| 4-0 | 통과 |  |  |  |
| 4-1 | 통과 |  |  |  |
| 4-2 | 통과 |  |  |  |
| 4-3 | 통과 |  |  |  |
| 4-4 | 통과 |  |  |  |
| 5-0 | 통과 |  | 정답 warn→limit; greet,train,charge → start,incision,induction |  |
| 5-1 | S 알람 작동 확인→소리·배터리 확인 | D1 알람을 켜고 타이머를 맞출게요. / D2 알람이 켜져 있어야 한계를 안 넘겨요. | expired,yellow,silent → expired,paused,silent |  |
| 5-2 | 통과 |  | invisible,expensive,private → inaudible,optional,internal |  |
| 5-3 | S 지혈대 알람 대신 소독·마취 타이머 설정 | D1 알람을 육십 분으로 맞추려고 타이머를 열어요. / D2 육십 분 알람이 울리면 집도의에게 알려요. | curtain,bed,door → pressure,cuff,monitor | the curtain → the suction |
| 5-4 | S 타이머 작동 확인→충전·연결 확인 | D1 시작하기 전에 타이머를 먼저 켜 두세요. / D2 시작하기 전에 타이머가 돌아야 시간이 맞아요. |  |  |
| 6-0 | S D2 "넘었어요" 한계 상태 오보; D1 통과 | D2 안전 시간 한계에 왔어요 — 곧 공기를 뺄 수도 있어요. | lunch,visiting,shift → fasting,visiting,shift |  |
| 6-1 | S D1 "평균" 잘못된 안심; D2 통과 | D1 허혈 시간이 최대치에 가까워서 알람이 울려요. | minimum,entrance,window → minimum,midpoint,closure | to the entrance → to the average |
| 6-2 | S D2 "천천히" 감압 방식 변경(7-2와 되풀이); D1 통과 | D2 빼면 혈압이 떨어질까요? |  | upstairs → again |
| 6-3 | S D1 "안전 구역" 잘못된 안심; D2 통과(엉뚱하나 해 없음) | D1 지금 안전 한계라서 집도의를 불러요. | leaving,painting,ordering → leaving,exceeding,recording | the red door → the closure |
| 6-4 | S D1 도달 = 상태 오보, D2 봉합 = 한계 알림 빠짐 | D1 한계에 가까워졌다고 알리려고 타이머를 볼게요. / D2 한계에 가까워지면 집도의가 마무리를 서둘러요. | exit,corner,elevator → closure,count,dressing | to the closet → to closure |
| 7-0 | S 재관류 예고를 붕대·브레이크 예고로 바꿈 | D1 지혈대를 곧 풀 거예요 — 끝나면 시각을 적을게요. / D2 지혈대 밸브를 잡았어요 — 다들 준비됐나요? |  | — everyone seated → release the drape |
| 7-1 | S D1 체위 변화 = 대비 대상 바꾸기; D2 온도(참인 재관류 효과) 통과 | D1 마취과는 승압제를 미리 꺼내 주세요. | staffing,billing,menu → staffing,positioning,lighting |  |
| 7-2 | S D1 "곧" 실시간 알림 미룸, D2 천천히 방식 변경 | D1 지금 공기를 빼요 — 혈압이 떨어질 수 있어요. / D2 지금 공기를 빼요 — 모니터 소리를 키워요. |  | the corridor → the urine output |
| 7-3 | S 감압 전 알림을 수술 시작·교대 전 알림으로 | D1 공기를 빼기 전에 팀에 알리려고 모두를 불러요. / D2 공기를 빼는 시점은 집도의가 정해요. |  |  |
| 7-4 | 통과 |  | tired,paid,seated → scrubbed,gowned,seated |  |
| 8-0 | S 총 시간 기록·공유를 평균·남은 시간으로 | D1 총 허혈 시간이 이제 기록되고 집도의가 확인했어요. / D2 총 허혈 시간이 이제 기록되고 인계지에 들어갔어요. |  |  |
| 8-1 | S 문자 = 손 씻은 팀이 못 봄, 방송 = 대상 바뀜(병원 전체) | D1 십오 분마다 시간을 알리려고 타이머를 맞춰요. / D2 십오 분마다 알리면 모두가 같은 시간을 알아요. | date,name,weather → date,name,count |  |
| 8-2 | 통과 |  | high,tight,loud → high,tight,wide | how loud → how wide |
| 8-3 | S D1 총 인원 = 시간 알림 빠짐; D2 남은 시간 통과 | D1 총 시간을 알리면 계획이 쉬워요. |  |  |
| 8-4 | S D1 점심(동떨어짐), D2 마취 시간 = 대상 바꾸기 | D1 허혈 시간을 팀 전체와 나누려고 게시판에 적어요. / D2 허혈 시간을 공유해야 풀 시점을 같이 정해요. |  |  |
| 9-0 | 통과 |  |  |  |
| 9-1 | S/T D1 점검 = 전환 대신, D2 "도 올려요" = 전환의 일부(정답 둘) | D1 블록이 확립되면 지혈대 통증이 줄어들어요. / D2 원위 커프로 전환한 뒤 근위 커프를 내려요. |  |  |
| 9-2 | S 순서 확인→일정·장비 확인(Bier 순서는 핵심 안전) | D1 순서를 커프에 표시해 둘게요. / D2 순서가 틀리면 약이 퍼져요. | invoice,menu,ticket → incision,count,positioning |  |
| 9-3 | T D1 먼저 내려가는 커프도 실제 확인(정답 둘·뒤집기); D2 통과 | D1 어느 커프가 먼저 올라가는지 색으로 구분해요. | clean,buy,wash → guess,debate,change |  |
| 9-4 | 통과 |  | recipe,ledger,diet → consent,audit,training |  |
| 10-0 | Q D1 비용(되풀이 4회·동떨어짐) | D1 말초혈관질환이 있으면 지혈대로 회복이 더뎌요. |  |  |
| 10-1 | 통과 |  |  |  |
| 10-2 | S 혈관 병력이 집도의에게 안 감 | D1 혈관 병력을 알리려고 집도의를 부를게요. / D2 혈관 병력은 수술 전 면담에서 나왔어요. | dental,visitor,billing → dental,social,travel |  |
| 10-3 | Q D1 비용 되풀이 | D1 말초혈관질환 환자는 지혈대를 풀어도 맥박이 약해요. |  | with elevators → with sedation |
| 10-4 | 통과 |  | loud,warm,early → sterile,warm,early | still loud → still sterile |
| 11-0 | 통과 |  |  | avoid → show |
| 11-1 | T D2 키≈체구 | D2 아이의 체구를 재려고 줄자를 가져올게요. | mood,toy,shirt → name,allergy,bed |  |
| 11-2 | 통과 |  |  |  |
| 11-3 | 통과 |  |  |  |
| 11-4 | 통과 |  |  |  |
| 12-0 | S/T D1 튜브 끼임 확인(실제 점검), D2 미끄러짐 = 피부 확인 다른 일로 | D1 커프를 감기 전에 패딩을 고르게 대 주세요. / D2 커프 아래에서 피부가 조이면 물집이 생겨요. | painted,dyed,framed → marked,shaved,numbed |  |
| 12-1 | 통과 |  | dust,light,noise → dust,lint,heat | behind the curtain → inside the drape |
| 12-2 | 통과 |  | sound,taste,smell → drops,alarms,readings |  |
| 12-3 | S/T 12-0과 같음(튜브 꼬임·건조) | D1 커프 아래 어디서도 피부가 끼지 않게 패딩을 대세요. / D2 커프 아래 피부가 조이면 압박 손상이 남아요. |  |  |
| 12-4 | S 액체 고임 확인→먼지·접착제 확인 | D1 시작 전에 커프 아래 액체가 고이지 않게 방수포를 대요. / D2 시작 전에 커프 아래 액체가 고이면 화상이 생겨요. |  | inside the cooler → on the tray |
| 13-0 | 통과 |  |  |  |
| 13-1 | 통과 |  | diet,menu,route → incision,roster,dressing | a loud → the old count |
| 13-2 | 통과 |  | lunch,speech,vote → prep,scrub,teaching |  |
| 13-3 | 통과 |  | far,fast,high → wide,fast,high | as loud → as wide |
| 13-4 | 통과 |  | rarely,gently,loudly → rarely,briefly,casually |  |
| 14-0 | 통과 |  |  |  |
| 14-1 | 통과 |  | loud,famous,annual → excessive,partial,delayed |  |
| 14-2 | S 색 변화 보고→온도·맥박 보고(지표 바꾸기) | D1 색 변화를 보고하려고 집도의를 부를게요. / D2 색 변한 자리를 집도의에게 짚을게요. |  |  |
| 14-3 | 통과 |  | 정답 leg→below; room,wall,screen → above,inside,behind | beside the bed → above the knee |
| 14-4 | Q 들리는/느끼는 것 기록은 아무도 안 할 말 — 하나 교체 | D1 지금 보이는 것은 커프 아래 울혈이에요. | concealing,rehearsing,decorating → estimating,delegating,timing |  |
| 15-0 | Q 위기 문장 오답이 점심·거리(동떨어져 걸러짐) | D1 최대 안전 시간에 왔어요 — 공기를 빼기 전에 마취과에 알려요. / D2 최대 안전 시간에 왔어요 — 공기를 빼면 혈압이 떨어져요. |  |  |
| 15-1 | 통과 |  |  | is on sale → is draped |
| 15-2 | Q D2 예산 동떨어짐 | D2 집도의, 이 시간을 넘기면 신경이 다쳐요. | enter,move,buy → enter,move,open |  |
| 15-3 | S 위기에 교대·이동 = 곁을 떠남 | D1 지금 당장 조치해야 해요 — 시간이 다 됐어요. / D2 지금 당장 공기를 빼려고 밸브를 잡아요. | sign,pay,vote → chart,scrub,pause |  |
| 15-4 | 통과 |  |  | go any louder → go any higher |
| 16-0 | 통과 |  | rising,steady,flashing → rising,steady,recovering |  |
| 16-1 | S 위기 처치(수액·승압제)를 담요·거즈로 | D1 마취과, 수액이나 승압제를 가져오게 카트를 열어 둘까요? / D2 마취과, 혈압 때문에 수액이나 승압제를 쓰실 건가요? |  |  |
| 16-2 | S D2 "혼자" = with you 뒤집기; D1 통과 | D2 당신과 함께 보려고 모니터 소리를 키웠어요. |  |  |
| 16-3 | 통과 |  |  | inside the pump → Temperature's dropping |
| 16-4 | S 수액→담요·거즈(위기 처치 비움) | D1 함께 수액을 걸고 모니터를 지켜봅시다. / D2 제가 수액을 가져오는 동안 모니터를 봐 주세요. | tape,pens,forms → tape,gauze,sutures | snacks → gauze |
| 17-0 | 통과 |  |  |  |
| 17-1 | S 결손 기록→비용·일정 기록 | D1 결손을 기록하고 집도의에게 부위를 보여 줍시다. / D2 결손을 기록하기 전에 감각을 한 번 더 봅시다. | receipt,invoice,payroll → budget,staffing,supply |  |
| 17-2 | S 신경 평가→교육·서류 | D1 수술 후 신경학적 평가는 회복실에 넘겨요. / D2 수술 후 신경학적 평가는 깨어난 뒤에 해요. | schedule,textbook,invoice → schedule,handoff,supply |  |
| 17-3 | 통과 |  | hard,often,early → gently,often,early |  |
| 17-4 | T D1 신경 점수 기록은 참 | D1 집도의에게 알리고 감각을 다시 살필게요. | night,bank,cart → budget,staffing,supply | the night shift → the skin tear |
| 18-0 | S 출혈 중 압력 확인→크기·배터리 확인 | D1 출혈이 계속되고 있어요 — 커프 압력이 낮을 수 있어요. / D2 출혈이 계속되고 있어요 — 압력을 보려고 장비를 돌릴게요. |  | the cuff smell → tubing |
| 18-1 | 통과 |  |  |  |
| 18-2 | S 출혈 중 장비 해결→전화·조명 | D1 지금 예비 장비를 가져오고 있어요. / D2 지금 장비 문제로 압력이 새고 있어요. | elevator,printer,phone → printer,phone,lights | the elevator → the lights |
| 18-3 | 통과 |  |  |  |
| 18-4 | S 압력 확인→번호·날짜 | D1 압력이 맞는지 보려고 장비 화면을 켭시다. / D2 장비를 확인하면 압력이 왜 낮은지 알아요. |  |  |
| 19-0 | 통과 |  | dermal,dental,ocular → thermal,visual,seasonal |  |
| 19-1 | S 검사·치료제→서류(두 오답 같은 낱말) | D1 마취과, 검사용 주사기부터 꺼내 드릴까요? / D2 마취과, 검사는 동맥혈로 보내 드릴까요? | forms,badges,stamps → films,scans,consults |  |
| 19-2 | S 돕기→설명·기록(ICU 3번) | D1 필요한 약은 카트에 다 준비돼 있어요. / D2 필요한 건 뭐든 도우려고 곁에 있어요. |  |  |
| 19-3 | 통과 |  |  |  |
| 19-4 | S 검사 제안→번역·휴식(동떨어짐) | D1 지금 검사가 필요하면 바로 보낼게요. / D2 지금 검사 결과가 나오면 알려 주세요. | forms,badges,stamps → films,towels,drapes |  |
| 20-0 | T D1 신장 손상은 실제 우려; D2 비용 되풀이 | D1 그 정도 허혈 시간이면 근육이 붓기 시작해요. / D2 그 정도 허혈 시간이면 피부 물집이 우려돼요. |  |  |
| 20-1 | S 구획 징후 감시→위치·크기(감시 빠짐) | D1 수술 후에 구획 징후를 인계합시다. / D2 수술 후에 구획 징후는 통증부터 나타나요. | dental,visual,financial → allergic,septic,withdrawal |  |
| 20-2 | S D2 총 시간 기록→개수 기록; D1 통과 | D2 총 지혈대 시간을 적으려고 시작 시각을 찾아요. |  |  |
| 20-3 | S/T 근손상 평가→신장(참)·연골 | D1 지금 근손상 보려고 담요를 걷어요. / D2 근손상이 있으면 소변이 변해요. | reorder,resell,repaint → reorder,bill,reschedule |  |
| 20-4 | S 총 허혈 시간→예상·남은 시간 기록 | D1 총 허혈 시간을 기록하려고 게시판을 읽어요. / D2 총 허혈 시간은 근손상 평가에 쓰여요. | recite,rename,resell → recite,print,file |  |
