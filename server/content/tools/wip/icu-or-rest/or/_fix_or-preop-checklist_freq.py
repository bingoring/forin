import yaml,re,collections
d=yaml.safe_load(open('or-preop-checklist.yaml'))
rows=[]
stem=collections.Counter(); where=collections.defaultdict(list)
def tok(t): return re.findall(r'[가-힣]+',t)
for i,s in enumerate(d['situations']):
    for k,x in enumerate(s['sentences']):
        mine=set(t[:2] for t in tok(x['ko']))
        mine_full=set(tok(x['ko']))
        for o in x['distractorsKo']:
            for st in set(t[:2] for t in tok(o))-mine:
                stem[st]+=1; where[st].append(f'{i}.{k}')
        rows.append(f"{i}.{k} {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}")
open('_fix_or-preop-checklist_rows.txt','w').write('\n'.join(rows))
for st,c in stem.most_common(25): print(st,c,where[st] if c>=5 else '')
