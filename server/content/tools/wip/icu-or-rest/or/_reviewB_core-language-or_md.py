import json,yaml
P=json.load(open('_reviewB_core-language-or_proposal.json')); R=json.load(open('_reviewB_core-language-or_rest.json'))
d=yaml.safe_load(open('core-language-or.yaml')); S=d['situations']
K={'S':'안전','T':'정답 둘','F':'모양·되풀이'}
def key(k): return tuple(int(x) for x in k.split('.'))
out=[]
out.append('| 문장 | 정답 ko | 지금 → **새 값** | 판정·이유 |\n|---|---|---|---|')
for k in sorted(P,key=key):
  o,n,w,c=P[k]; i,j,s=key(k)
  out.append(f"| {i}.{j} O{s+1} | {S[i]['sentences'][j]['ko']} | \"{o}\" → **\"{n}\"** | {K[c]} — {w} |")
A='\n'.join(out)
out=['| 문장 | 정답 | 지금 오답 → **새 선택지(정답 먼저)** | 판정·이유 |\n|---|---|---|---|']
for k in sorted(R['blank'],key=key):
  a,o,r,c=R['blank'][k]; i,j=key(k); x=S[i]['sentences'][j]
  old=[t['en'] for t in x['blank']['options'] if t['en']!=x['blank']['answer']]
  out.append(f"| {k} | {x['blank']['answer']}{' → **'+a+'**' if a!=x['blank']['answer'] else ''} | {' · '.join(old)} → **{' · '.join(o)}** | {K[c]} — {r} |")
B='\n'.join(out)
out=['| 문장 | 지금 → **새 decoy** | 판정·이유 |\n|---|---|---|']
for k in sorted(R['decoy'],key=key):
  v,r,c=R['decoy'][k]; i,j=key(k)
  out.append(f"| {k} | `{S[i]['sentences'][j]['decoy']}` → **`{v}`** | {K[c]} — {r} |")
C='\n'.join(out)
out=[]
for k in sorted(R['order'],key=int):
  lines,why,r=R['order'][k]
  out.append(f"- **S{k} {S[int(k)]['title']}** — {r}")
  for li,(en,ko,note,icon) in sorted(lines.items(),key=lambda t:int(t[0])):
    extra=f" · note {note} · icon {icon}" if note else ''
    out.append(f"  - {int(li)+1}줄 → \"{en}\" / \"{ko}\"{extra}")
  if why: out.append(f"  - why → \"{why}\"")
D='\n'.join(out)
out=[]
for k in sorted(R['why'],key=key):
  v,r=R['why'][k]; out.append(f"- **{k}** {r} → \"{v}\"")
E='\n'.join(out)
t=open('_reviewB_core-language-or_md_head.md').read()
t=t.replace('{{A}}',A).replace('{{B}}',B).replace('{{C}}',C).replace('{{D}}',D).replace('{{E}}',E)
open('fix-core-language-or-B.md','w').write(t)
print(len(P),len(R['blank']),len(R['decoy']),len(R['order']),len(R['why']))
