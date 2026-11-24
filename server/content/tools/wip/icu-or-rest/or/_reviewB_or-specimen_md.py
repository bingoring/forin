import yaml,re,json
src=open('_reviewB_or-specimen_patch.py').read()
ns={}; exec(src.split("def L(s)")[0],ns)
P,B,C,O,W,G=ns['P'],ns['B'],ns['C'],ns['O'],ns['W'],ns['G']
d=yaml.safe_load(open('or-specimen.yaml')); S=d['situations']
A=yaml.safe_load(open('_reviewB_or-specimen_after.yaml'))['situations']
lab={'S':'[안전]','T':'[정답둘]','F':'[기타]'}
out=[]
for i,s in enumerate(S):
  items=[]
  for j,x in enumerate(s['sentences']):
    for k in (0,1):
      if (i,j,k) in P:
        v,w,c,sh=P[(i,j,k)]
        items.append(f"- **{i}.{j} 오답{k+1}** {lab[c]} \"{x['distractorsKo'][k]}\" — {w}\n  - 새 값: **\"{v}\"**")
    if (i,j) in B:
      a,o,r,c=B[(i,j)]; ob=x['blank']
      na=A[i]['sentences'][j]['blank']; items.append(f"- **{i}.{j} 빈칸** {lab[c]} {'/'.join(t['en'] for t in ob['options'])} (정답 {ob['answer']}) — {r}\n  - 새 값: answer `{a}` · {' / '.join(t['en'] for t in na['options'])}")
    if (i,j) in C:
      v,r,c=C[(i,j)]
      items.append(f"- **{i}.{j} decoy** {lab[c]} `{x['decoy']}` — {r}\n  - 새 값: `{v}`")
    if (i,j) in W:
      v,r=W[(i,j)]
      items.append(f"- **{i}.{j} why** [기타] {r}\n  - 새 값: \"{v}\"")
    if (i,j) in G:
      v,r=G[(i,j)]
      items.append(f"- **{i}.{j} tag** [기타] {r}\n  - 새 값: `{v}`")
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
open('_reviewB_or-specimen_list.md','w').write('\n\n'.join(out)+'\n')
print(len(out))
# 문장별 판정표
rows=['\n## 문장별 판정 (127문장 전수 — 통과/고침)\n','| 문장 | en | 판정 |','|---|---|---|']
for i,s in enumerate(S):
  for j,x in enumerate(s['sentences']):
    f=[]
    if (i,j,0) in P: f.append('오답1')
    if (i,j,1) in P: f.append('오답2')
    if (i,j) in B: f.append('빈칸')
    if (i,j) in C: f.append('decoy')
    if (i,j) in W: f.append('why')
    if (i,j) in G: f.append('tag')
    rows.append(f"| {i}.{j} | {x['en']} | {'고침: '+', '.join(f) if f else '통과'} |")
rows.append('\n| order | 판정 |'); rows.append('|---|---|')
for i,s in enumerate(S):
  rows.append(f"| S{i} {s['title']} | {'고침' if i in O else '통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘)'} |")
open('_reviewB_or-specimen_table.md','w').write('\n'.join(rows)+'\n')
