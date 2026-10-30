import yaml,re,importlib.util,collections
spec=importlib.util.spec_from_file_location('p','_reviewB_or-preop-verification_proposal.py')
import io,contextlib
with contextlib.redirect_stdout(io.StringIO()):
  m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
d=yaml.safe_load(open('or-preop-verification.yaml'))
rows=[]
for (i,j,k),(v,w,c) in sorted(m.P.items()):
  x=d['situations'][i]['sentences'][j]
  rows.append(f"| {i}.{j} O{k+1} | {x['ko']} | \"{x['distractorsKo'][k]}\" → **\"{v}\"** | {({'S':'안전','T':'정답 둘','F':'모양·되풀이'})[c]} — {w} |")
open('_reviewB_or-preop-verification_dk.md','w').write('\n'.join(rows)+'\n')
print(len(rows),collections.Counter(c for v,w,c in m.P.values()),len({(i,j) for i,j,k in m.P}))
S={(i,j) for (i,j,k),(v,w,c) in m.P.items() if c=='S'}; T={(i,j) for (i,j,k),(v,w,c) in m.P.items() if c=='T'}
print('sent S',len(S),'sent T',len(T-S))
