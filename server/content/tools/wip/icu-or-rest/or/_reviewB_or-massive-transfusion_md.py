import runpy,io,contextlib
with contextlib.redirect_stdout(io.StringIO()):
    g=runpy.run_path('_reviewB_or-massive-transfusion_blankfix.py')
B=g['B']
import yaml
d=yaml.safe_load(open('or-massive-transfusion.yaml'))
X={f'{si}-{j}':x for si,s in enumerate(d['situations']) for j,x in enumerate(s['sentences'])}
brows=[]
for k in sorted(B,key=lambda x:tuple(map(int,x.split('-')))):
    x=X[k]; a=x['blank']['answer']; old=[o['en'] for o in x['blank']['options'] if o['en']!=a]
    newans=a
    if k=='15-4': newans='call'
    if k=='16-4': newans='potassium'
    brows.append(f"| {k} | {x['en']} | {a} | {', '.join(old)} | answer **{newans}** + **{', '.join(B[k][0])}** | {B[k][1]} |")
dk=open('_reviewB_or-massive-transfusion_dk.md').read()
md=f"""# B 검토 — or-massive-transfusion (v46 1~6·8, distractorsKo ①~⑥·되풀이 상한)

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
{dk}

### B. 빈칸 — 74문장 (정답 둘 7)
| 문장 | en | 정답 | 지금 오답 | 새 값 | 이유 |
|---|---|---|---|---|---|
""" + '\n'.join(brows) + """

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
"""
open('fix-or-massive-transfusion-B.md','w').write(md)
print(len(md))
