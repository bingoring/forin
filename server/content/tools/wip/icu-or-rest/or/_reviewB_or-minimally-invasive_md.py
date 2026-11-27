import yaml,re,json
src=open('_reviewB_or-minimally-invasive_patch.py').read()
ns={}; exec(src.split("def L(s)")[0],ns)
P,B,C,O=ns['P'],ns['B'],ns['C'],ns['O']
pr=json.load(open('_reviewB_or-minimally-invasive_proposal.json'))
d=yaml.safe_load(open('or-minimally-invasive.yaml')); S=d['situations']
A=yaml.safe_load(open('_reviewB_or-minimally-invasive_after.yaml'))['situations']
lab={'S':'[안전]','T':'[정답둘]','F':'[기타]'}
SH={'f':'사실','d':'같은 틀 세부','p':'앞 단계','b':'뒤 단계'}
out=[]
for i,s in enumerate(S):
  items=[]
  for j,x in enumerate(s['sentences']):
    for k in (0,1):
      if (i,j,k) in P:
        v,w,c,sh=P[(i,j,k)]
        items.append(f"- **{i}.{j} 오답{k+1}** {lab[c]} \"{x['distractorsKo'][k]}\" — {w}\n  - 새 값({SH[sh]}): **\"{v}\"**")
    if (i,j) in B:
      a,o,r,c=B[(i,j)]; ob=x['blank']
      na=A[i]['sentences'][j]['blank']; items.append(f"- **{i}.{j} 빈칸** {lab[c]} {'/'.join(t['en'] for t in ob['options'])} (정답 {ob['answer']}) — {r}\n  - 새 값: answer `{a}` · {' / '.join(t['en'] for t in na['options'])}")
    if (i,j) in C:
      v,r,c=C[(i,j)]
      items.append(f"- **{i}.{j} decoy** {lab[c]} `{x['decoy']}` — {r}\n  - 새 값: `{v}`")
  if i in O:
    lines,why,r,c=O[i]
    t=[f"- **order** {lab[c]} {r}"]
    for k,(en,ko,note,icon) in sorted(lines.items()):
      parts=[]
      if en: parts.append(f"en \"{en}\"")
      if ko: parts.append(f"ko \"{ko}\"")
      if note: parts.append(f"note `{note}`")
      if icon: parts.append(f"icon `{icon}`")
      t.append(f"  - {k+1}줄: "+' · '.join(parts))
    if why: t.append(f"  - why: \"{why}\"")
    items.append('\n'.join(t))
  if items: out.append(f"### {i}. {s['title']}\n"+'\n'.join(items))
open('_reviewB_or-minimally-invasive_list.md','w').write('\n\n'.join(out)+'\n')
rows=['\n## 문장별 판정 (126문장 전수 — 통과/고침, 오답 모양 전→후)\n','| 문장 | en | 판정 | 모양 전→후 |','|---|---|---|---|']
for i,s in enumerate(S):
  for j,x in enumerate(s['sentences']):
    f=[]
    if (i,j,0) in P: f.append('오답1')
    if (i,j,1) in P: f.append('오답2')
    if (i,j) in B: f.append('빈칸')
    if (i,j) in C: f.append('decoy')
    o=pr['ORIG'][f'{i}.{j}']; n=pr['NEW'][f'{i}.{j}']
    sh=lambda z:'·'.join(SH[c] for c in z)
    rows.append(f"| {i}.{j} | {x['en']} | {'고침: '+', '.join(f) if f else '통과'} | {sh(o)} → {sh(n)}{' (사실 둘 유지)' if n=='ff' else ''} |")
open('_reviewB_or-minimally-invasive_table.md','w').write('\n'.join(rows)+'\n')
cnt=lambda D,cl: sum(1 for v in D.values() if v[-1]==cl) if D is not P else sum(1 for v in P.values() if v[2]==cl)
print('P',{c:sum(1 for v in P.values() if v[2]==c) for c in 'STF'},'B',{c:sum(1 for v in B.values() if v[3]==c) for c in 'STF'},'C',{c:sum(1 for v in C.values() if v[2]==c) for c in 'STF'},'O',{c:sum(1 for v in O.values() if v[3]==c) for c in 'STF'})
