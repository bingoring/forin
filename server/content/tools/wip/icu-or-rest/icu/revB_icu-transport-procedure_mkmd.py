import yaml,importlib.util,collections
def load(p,n):
  s=importlib.util.spec_from_file_location(n,p); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
V=load('revB_icu-transport-procedure_vals.py','v'); R=load('revB_icu-transport-procedure_reasons.py','r')
d=yaml.safe_load(open('icu-transport-procedure.yaml'))
S=lambda k:d['situations'][int(k.split('.')[0])]['sentences'][int(k.split('.')[1])]
key=lambda k:tuple(map(int,k.split('.')))
out=[]
cat=collections.Counter()
out.append("| 문장 | 분류 | 문제 | 지금 X1 / X2 | 새 X1 / X2 (— = 그대로) |\n|---|---|---|---|---|")
for k in sorted(V.DK,key=key):
  c,why=R.RDK[k]; cat[c]+=1; s=S(k); o=s['distractorsKo']; n=V.DK[k]
  out.append(f"| {k} | {'**'+c+'**' if c in ('안전','정답 둘','사실') else c} | {why} | {o[0]} / {o[1]} | {n[0] or '—'} / {n[1] or '—'} |")
A="\n".join(out)
out=["| 문장 | 문제 | 지금 answer: 선택지 | 새 answer: 선택지 |\n|---|---|---|---|"]
for k in sorted(V.BL,key=key):
  s=S(k); ans,opts=V.BL[k]; old=s['blank']
  out.append(f"| {k} | {R.RBL.get(k,'')} | {old['answer']}: {', '.join(o['en'] for o in old['options'])} | {(ans or old['answer'])}: {', '.join(opts)} |")
B="\n".join(out)
out=["| 문장 | 문제 | 지금 | 새 decoy |\n|---|---|---|---|"]
for k in sorted(V.DC,key=key):
  out.append(f"| {k} | {R.RDC.get(k,'')} | `{S(k)['decoy']}` | `{V.DC[k]}` |")
C="\n".join(out)
open('revB_icu-transport-procedure_tables.md','w').write(f"## A. distractorsKo 새 값 ({len(V.DK)}문장 — "+" · ".join(f'{a} {b}' for a,b in cat.most_common())+")\n\n"+A+f"\n\n## B. 빈칸 새 값 ({len(V.BL)}문장)\n\n"+B+f"\n\n## C. decoy 새 값 ({len(V.DC)}문장)\n\n"+C+"\n")
print(cat, len(V.DK), len(V.BL), len(V.DC))
