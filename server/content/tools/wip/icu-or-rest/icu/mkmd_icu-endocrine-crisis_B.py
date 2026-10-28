import yaml,sys
sys.path.insert(0,'.')
from fixvals_icu_endocrine_crisis_B import NEW
d=yaml.safe_load(open('icu-endocrine-crisis.yaml'))
S=[x for s in d['situations'] for x in [s]]
SAFE_SUBJ="2.1 3.0 3.2 4.2 4.4 6.0 6.1 6.2 7.0 7.1 7.2 7.4 8.1 9.0 10.0 10.2 10.3 12.2 13.1 13.2 13.3 14.2 15.0 15.1 16.1 16.2 16.4 17.0 17.1 18.1 18.2 18.4 19.0 19.1 19.2".split()
WHY={
"17.3":"[안전] 진단을 쇼크·패혈증으로 바꿈 — 판단 기준이 바뀌어 스테로이드가 빠짐",
"18.0":"[안전] 처치 근거(반응 없음)를 땀·빠른 맥으로 바꿈 — 깨어 있는 환자에게 D50 정맥 주사를 미는 판단이 됨",
"2.0":"[안전·경] X2 `숨이 차시니까 빠르게 보충` — 숨참은 수액을 늦출 신호(2.2와 반대)라 오개념을 줌",
"20.2":"[안전·경] X1 `가족 곁`·X2 `의료진 곁` — 악화 중인 환자 침상을 떠나는 말로 읽힘",
"3.1":"[정답] X1 `따로 다시 확인` — ISMP 독립 이중 확인이 바로 '각자 따로'라 오히려 더 맞는 말",
"3.3":"[정답] X2 `이동할 준비` — ready to go를 글자대로 옮긴 말이라 정답과 겹침",
"4.0":"[정답] X1 `확인해 줄래요?`(말투만 바꿈), X2 `제가 먼저`(Let's→I, 뜻 같음)",
"6.4":"[정답] X1 `오늘 계획`·X2 `의사 선생님이 원하는` — exactly what we want와 뜻이 겹침(we에 의사 포함)",
"9.4":"[정답] X1 `약이 잘 맞는다` — responding well과 같은 뜻",
"10.4":"[정답] X2 `산도가 낮은 편이라서` — 케톤 제거 중과 같은 참인 이유(정답 둘). X1 `혈당이 높은 편이라서`는 흔한 오개념을 ✗로 바로잡으므로 유지",
"12.3":"[정답] X1 `혈압을 지지하려고` — support his body에 들어 있는 좁은 말(부분집합)이라 정답 둘",
"5.3":"[정답·경] `어제보다`·`아침보다` — than before에 들어가는 시각이라 뜻이 겹침. 설명문이니 목록 하나를 바꿈",
"5.4":"[정답·경] `교수님께도`·`약사에게도` — '도'가 팀에 더해 알린다는 뜻이라 정답+하나. '도'를 빼고 받는 사람만 바꿈(교수님 → 보호자)",
}
out=[]
def cat(k):
    if k in WHY: return WHY[k]
    if k in SAFE_SUBJ: return "[안전] 주체 바꾸기 — 그 순간 내가 하는 처치·감시를 다른 사람·다른 근무조에게 넘기거나 늦춤"
    return "[③⑤] 주체 바꾸기 — 영어에는 그 사람이 없고, 어미(할게요→해요)와 엉뚱한 주체로 듣지 않고 걸러짐"
for k in sorted(NEW,key=lambda t:tuple(map(int,t.split('.')))):
    si,i=map(int,k.split('.')); x=d['situations'][si]['sentences'][i]
    old=x['distractorsKo']
    parts=[]
    for j in (1,2):
        if j in NEW[k]: parts.append(f"X{j} `{old[j-1]}` → `{NEW[k][j]}`")
    out.append(f"- **{k}** {cat(k)}  \n  ko `{x['ko']}`  \n  "+"  \n  ".join(parts))
open('_mdtable_icu-endocrine-crisis_B.txt','w').write('\n'.join(out))
print(len(out))
import collections
c=collections.Counter(cat(k).split(']')[0]+']' for k in NEW); print(c)
