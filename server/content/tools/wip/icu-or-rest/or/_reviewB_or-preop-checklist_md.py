import yaml,collections,importlib.util
spec=importlib.util.spec_from_file_location('P','_reviewB_or-preop-checklist_proposal.py');P=importlib.util.module_from_spec(spec);spec.loader.exec_module(P)
d=P.d;S=d['situations'];out=[]
K={'S':'안전','T':'정답 둘','F':'모양'}
bysent=collections.defaultdict(dict)
for (i,j,k),v in P.DK.items(): bysent[(i,j)][k]=v
cls=collections.Counter()
out.append('| 문장 | 정답 ko | 칸 | 지금 | 새 값 | 왜 | 갈래 |\n|---|---|---|---|---|---|---|')
for (i,j) in sorted(bysent):
    x=S[i]['sentences'][j];ks=[v[2] for v in bysent[(i,j)].values()]
    cls['S' if 'S' in ks else 'T' if 'T' in ks else 'F']+=1
    for k in sorted(bysent[(i,j)]):
        new,why,kind=bysent[(i,j)][k]
        out.append(f"| {i}.{j} | {x['ko']} | O{k+1} | {x['distractorsKo'][k]} | **{new}** | {why} | {K[kind]} |")
dk='\n'.join(out);out=[]
out.append('| 문장 | 지금 decoy | 새 decoy | 왜 | 갈래 |\n|---|---|---|---|---|')
for (i,j),(new,why,kind) in sorted(P.DECOY.items()):
    out.append(f"| {i}.{j} | `{S[i]['sentences'][j]['decoy']}` | **`{new}`** | {why} | {K[kind]} |")
dec='\n'.join(out);out=[]
out.append('| 문장 | 정답 | 지금 오답 | 새 정답·오답 | 왜 |\n|---|---|---|---|---|')
for (i,j),(ans,opts,why,kind) in sorted(P.BLANK.items()):
    b=S[i]['sentences'][j]['blank'];old=[o['en'] for o in b['options'] if o['en']!=b['answer']]
    out.append(f"| {i}.{j} | {b['answer']} | {', '.join(old)} | **{ans}** / {', '.join(o for o in opts if o!=ans)} | {why} |")
bl='\n'.join(out);out=[]
for (i,k),(line,why) in sorted(P.ORDER.items()):
    old=S[i]['order']['lines'][k]
    out.append(f"- S{i} {k+1}줄: \"{old['en']}\" → **\"{line['en']}\"** (ko: {line['ko']})" + (f" — {why}" if why else ''))
od='\n'.join(out);out=[]
for (i,j),(w,why) in sorted(P.WHY.items()):
    out.append(f"- {i}.{j}: {why} → **{w}**")
wy='\n'.join(out)
open('_reviewB_or-preop-checklist_tables.md','w').write(f"### DK\n{dk}\n\n### DECOY\n{dec}\n\n### BLANK\n{bl}\n\n### ORDER\n{od}\n\n### WHY\n{wy}\n")
print(cls, len(bysent))
