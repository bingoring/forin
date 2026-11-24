import yaml,importlib.util
from collections import defaultdict
spec=importlib.util.spec_from_file_location('v','revB_icu-mobility-prevention_vals.py'); V=importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
t=open('revB_icu-mobility-prevention_tables.md').read()
A,rest=t.split('\n\n@@B\n'); B,C=rest.split('\n\n@@C\n')
head=open('revB_icu-mobility-prevention_head.md').read()
why=["| 문장 | 문제 | 새 why |","|---|---|---|"]
WR={"2.4":"사실(과장) — 2시간은 '표준'이 아니라 흔한 기본값, NPIAP는 위험·지지면에 따라 개인별","3.3":"사실(과장) — ICU 이동 사다리는 침상 내 운동·머리 올리기가 먼저, 걸터앉기는 초기 단계",
"4.5":"**사실 오류** — 팔꿈치(주두)는 바로 누운 자세에서 눌림. 옆으로 누우면 대전자·복사뼈·귀·어깨","6.6":"**안전** — '응급 아님'만 말하면 알람을 무시해도 된다고 읽힘. 직원은 알람마다 바로 확인한다는 말을 넣음","8.5":"정확성 — 낫는 욕창은 단계를 거꾸로 낮추지 않음(NPIAP)"}
for k in sorted(V.WHY,key=lambda k:tuple(map(int,k.split('.')))): why.append(f"| {k} | {WR[k]} | {V.WHY[k]} |")
why.append("\n아이콘: **2.0** `baby` → `redo`(체위변경), **S2 L1** `baby` → `redo`, **12.2** `stetho` → `pill`(진정 줄이기).")
OR={0:"3↔4 교환이 읽힘(`the order for it`은 L4 뒤에서도 L2를 가리키고, 기계적 예방이 약물 처방 확인 전에 돌아가도 말이 됨) — L4를 'While I check that'으로 L3에 묶음",
1:"2↔3 교환이 읽힘(`That score`가 L1에서 떨어져도 통함) — L3을 L2에 묶음",2:"2↔3 교환이 읽힘 + L1·L2는 you, L3은 his로 인칭이 섞임 — L3을 L2에 묶고 your로",
3:"3↔4 교환이 오히려 자연스러움(시작 전에 안내) — L4를 '앉으시면'으로 L3에 묶음",5:"2↔3 교환이 읽힘(멈춤 기준을 먼저 말해도 통함) — L3을 'as I do that'으로 L2에 묶음",
12:"3↔4 교환이 읽힘(`That's why`는 L2 뒤에도 붙음) — L4를 '참여'로 L3에 묶음",14:"3↔4 교환이 읽힘 — L4를 L3의 targets에 묶음",
15:"2↔3 교환이 읽힘(처치를 먼저 말하고 부르는 것도 통함) — L3을 'they'(주치의)로 L2에 묶음",16:"2↔3 교환이 읽힘(재확인을 먼저 해도 통함) — L3을 'in bed'로 L2에 묶음, 산소가 먼저라는 임상 순서도 고정",
18:"3↔4 교환이 읽힘 — `On top of that`은 And/Also류라 어느 줄 뒤에도 붙음. L4를 'they'(신속대응팀)로 L3에 묶음",
19:"**임상** — `With everything checked, call the provider`는 다른 관을 다 볼 때까지 호출을 미룸. 중심정맥관이 빠지면 누르는 동안 바로 부름 — L3·L4를 바꿔 호출을 앞으로, L4는 'they're on the way'로 L3에 묶음(아이콘 L3 pager·L4 magnify, why 교체)",
20:"3↔4 교환이 읽힘 + L3·L4 ko 머리말이 둘 다 '그러니' — L4를 'With comfort first'로 L3에 묶음"}
od=["| 카드 | 문제 | 새 줄 (en / ko) |","|---|---|---|"]
g=defaultdict(list)
for si,li,en,ko,note in V.ORD: g[si].append(f"L{li} `{en}` / {ko}"+(f" (note {note})" if note else ""))
for si in sorted(g): od.append(f"| S{si} | {OR[si]} | {'<br>'.join(g[si])} |")
od.append(f"\nS19 why 새 값: {V.ORDWHY[19]}")
n_ord=len(g)
tail=f"""
## B. 빈칸 새 값 (33문장 — 정답 둘 10 · 위험 보임 2 · 동떨어짐·문법 21)

{B}

## C. decoy 새 값 (31문장 — 자리 없음 11 · 몰림 7 · 조립 위험 6 · ko에 맞는 다른 문장 4 · 반대말 3)

새 decoy를 고를 때 피한 것: 반대말(9.2 `and secure` ↔ rotate, 2.0 `you're awake` ↔ sedated), 다른 동사로 정답 행동 대신하기(18.2 `and charting`). 같은 자리의 엉뚱한 명사·대상으로 골랐습니다.

{C}

## D. why·아이콘 (why 5 · 아이콘 3)

{chr(10).join(why)}

## E. order ({n_ord}장)

{chr(10).join(od)}

통과로 본 것: S4 S6 S8 S9 S10 S13 S17 — 앞 줄을 가리키는 말로 묶였고 임상 순서도 맞음. 약하게 읽히는 것(사용자 판단으로 둠): S7 3↔4(둘 다 앞으로의 계획이라 순서가 덜 고정), S11 3↔4.

## F. 사용자 판단 거리
1. **6.6 문장 자체** `I told him the vent alarm during this move isn't an emergency` — 환자 안심용이지만 "인공호흡기 알람 = 응급 아님"을 가르치는 문장이 됨(저작자 메모와 같은 지적). B는 why만 고쳤음(D). 문장을 `I told him the vent may alarm during this move, and we'll check it right away.`처럼 바꾸는 것은 문장 en·ko 변경이라 A·정본 결정 몫.
2. **S19 순서**(E) — 호출을 앞으로 당긴 것은 임상 판단(동시에 하는 일의 순서). 사용자가 "확인 먼저" 흐름을 원하면 L4의 `With everything checked`만 빼고 둬도 됨.
3. **20.4 en** `I know this is realistic, but …` — 영어로 어색(`I know this is hard to hear`가 자연스러움). 빈칸 정답이 이 낱말이라 A가 문장을 고치면 빈칸도 다시 골라야 함.
4. **7.1 빈칸** `two/three/four/six staff` — 세 명도 틀린 말은 아니나 ko가 "두 명"이라 둠. 숫자 빈칸을 피하려면 `gait`로 옮기는 안(gait/seat/wrist/neck belt).
5. **18.1·18.4 X1 '폐렴'** — 갑작스러운 호흡곤란·흉통·저산소에 "폐렴이 걱정돼요"는 판단을 바꾸지만 행동을 시키지 않는 우려 표현이라 통과로 봄. 18.4만 같은 상황 되풀이라 '심장 문제'로 바꿈.
6. **13.2 X2 새 값** `안정적이면 침대로 옮길게요` — 이미 침대 끝에 앉은 환자라 논리로 걸러지는 약한 오답(길이 맞추기용, 해는 없음). 더 나은 안이 있으면 바꿔도 됨.

## 종합
고칠 것 **{63+33+31+5+3+n_ord}건**(distractorsKo 63 · 빈칸 33 · decoy 31 · why 5 · 아이콘 3 · order {n_ord}장). 그중 **안전 56**(distractorsKo 46 · 빈칸 2 · decoy 6 · why 1 · order 1) · **정답 둘 18**(distractorsKo 4 · 빈칸 10 · decoy 4).
`_vals.py` 값을 넣은 사본이 검사기를 위반·경고 0으로 통과하고 "오답 둘에만 표지 0 · 둘 다 김 0 · 오답 전용 어간 최댓값 5"이므로, 그대로 반영하면 내보내도 됩니다. 반영 뒤 `_stats.py`·`_rep.py`로 다시 확인하세요.
"""
open('fix-icu-mobility-prevention-B.md','w').write(head+A+'\n'+tail)
print('ok',63+33+31+5+3+n_ord)
