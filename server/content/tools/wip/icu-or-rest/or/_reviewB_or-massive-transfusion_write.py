import yaml,re,runpy,io,contextlib
buf=io.StringIO()
with contextlib.redirect_stdout(buf):
    g=runpy.run_path('_reviewB_or-massive-transfusion_proposal.py')
P=g['P']; S=g['S']
d=yaml.safe_load(open('or-massive-transfusion.yaml'))
O={f'{si}-{j}':x['distractorsKo'] for si,s in enumerate(d['situations']) for j,x in enumerate(s['sentences'])}
both_p=['0-1','0-2','1-0','1-1','1-3','1-4','2-0','2-3','2-4','3-0','3-2','3-5','4-1','4-2','4-4','5-0','5-1','5-2','5-5','6-0','6-2','6-4','7-2','7-3','7-5','8-1','8-2','8-3','8-4','9-0','9-2','9-4','9-5','10-4','10-5','11-0','11-2','11-4','12-2','12-4','13-0','13-2','13-5','14-0','14-1','14-2','14-4','14-5','15-4','16-1','16-4','17-2','17-5','18-4','18-5','19-4','19-5','20-2','20-4']
fact=['9-1','9-3','10-1','10-3','12-1','14-3','15-0','15-1','15-2','15-5','16-0','16-2','17-0','17-1','17-3','18-0','18-1','18-2','18-3','19-1','19-2','19-3','20-0','20-1','20-3']
safety={'15-0':'O2 "반응이 곧 줄어요" 잘못된 안심 + 둘 다 멈추기를 뺌','15-1':'둘 다 의심(판단)을 빼고 일반 사실만','16-2':'둘 다 리듬 감시를 빼고 교과서 정의만','17-3':'둘 다 지금 칼슘 투여를 빼고 정의만','18-1':'둘 다 멈추기를 빼고 TRALI 정의만','20-1':'둘 다 늦추기를 빼고 TACO 정의만','12-2':'O2가 혈장 투여를 빼고 검사 준비만(그 순간 대신 하는 일)','18-4':'둘 다 이 제제 멈추기를 빼고 전화 준비만','20-4':'O2가 늦추기를 빼고 혈압 재기 준비만'}
dup={'9-1':'둘 다 "혈소판이 비율에 든다"로 정답과 뜻이 겹침','9-3':'둘 다 같은 경고의 참인 이유(피가 묽어짐·응고 저하) — 정답 둘','11-1':'O1 "소변 색깔이 어떤가요?"는 같은 질문 — 정답 둘','12-3':'O1 정답(축축해 보임)에 "걱정"을 더함 — 정답 둘'}
other={'4-5':'O1이 세 군데(제제→포장지, 쿨러→쓰레기통, 보관→버리기)를 바꿈 — ①'}
def reason(k):
    r=[]
    if k in safety: r.append('**안전** '+safety[k])
    if k in dup: r.append('**정답 둘** '+dup[k])
    if k in both_p: r.append('둘 다 목적절(~려고/러/도록) — 모양으로 걸러짐')
    if k in fact and k not in safety and k not in dup: r.append('둘 다 틀을 버린 일반 사실(“X는 ~예요”) — 모양·③으로 걸러짐' if k!='18-2' else '둘 다 조건절(~하면) 이유 — 모양으로 걸러짐')
    if k in other: r.append(other[k])
    if k=='16-1': r.append('둘 다 정답보다 김')
    return '; '.join(r)
keys=sorted({k.rstrip('b') for k in P},key=lambda x:tuple(map(int,x.split('-'))))
assert len(keys)==87
rows=[]
for k in keys:
    ko=S[k][0]; old=O[k]; new=S[k][1]
    ch=[i for i in (0,1) if old[i]!=new[i]]
    rows.append(f"| {k} | {ko} | " + ' / '.join(f"O{i+1} \"{old[i]}\" → **\"{new[i]}\"**" for i in ch) + f" | {reason(k)} |")
open('_reviewB_or-massive-transfusion_dk.md','w').write('\n'.join(rows))
print(len(rows))
