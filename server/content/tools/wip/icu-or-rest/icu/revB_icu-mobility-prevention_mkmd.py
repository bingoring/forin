import yaml,importlib.util
def load(n):
  spec=importlib.util.spec_from_file_location(n,n+'.py'); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
V=load('revB_icu-mobility-prevention_vals'); R=load('revB_icu-mobility-prevention_reasons')
d=yaml.safe_load(open('icu-mobility-prevention.yaml'))
def S(k): a,b=map(int,k.split('.')); return d['situations'][a]['sentences'][b]
o=[]
o.append("| 문장 | 분류 | 문제 | 지금 X1 / X2 | 새 X1 / X2 (— = 그대로) |\n|---|---|---|---|---|")
key=lambda k: tuple(map(int,k.split('.')))
for k in sorted(V.DK,key=key):
  c,why=R.DKR[k]; s=S(k); x=s['distractorsKo']; n=V.DK[k]
  cc=f"**{c}**" if c=='안전' else c
  o.append(f"| {k} | {cc} | {why} | {x[0]} / {x[1]} | {n[0] or '—'} / {n[1] or '—'} |")
A='\n'.join(o); o=[]
o.append("| 문장 | 문제 | 지금 정답·선택지 | 새 정답·선택지 |\n|---|---|---|---|")
for k in sorted(V.BL,key=key):
  s=S(k); a,opts=V.BL[k]
  o.append(f"| {k} | {R.BLR[k]} | {s['blank']['answer']} — {', '.join(x['en'] for x in s['blank']['options'])} | {a or s['blank']['answer']} — {', '.join(opts)} |")
B='\n'.join(o); o=[]
o.append("| 문장 | 문제 | 지금 | 새 decoy |\n|---|---|---|---|")
for k in sorted(V.DC,key=key):
  o.append(f"| {k} | {R.DCR[k]} | `{S(k)['decoy']}` | `{V.DC[k]}` |")
C='\n'.join(o)
open('revB_icu-mobility-prevention_tables.md','w').write(A+'\n\n@@B\n'+B+'\n\n@@C\n'+C+'\n')
print(len(V.DK),len(V.BL),len(V.DC))
from collections import Counter
print(Counter(R.DKR[k][0] for k in V.DK))
