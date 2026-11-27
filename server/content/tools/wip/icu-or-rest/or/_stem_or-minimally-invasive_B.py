import yaml,sys,re,collections
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
from verify_lesson_content import _ko_stems
d=yaml.safe_load(open('or-minimally-invasive.B.yaml',encoding='utf-8'))
c=collections.Counter(); w=collections.defaultdict(list)
c1=collections.Counter()
for si,s in enumerate(d['situations']):
    for i,x in enumerate(s['sentences']):
        if 'distractorsKo' not in x: continue
        mine=_ko_stems(x['ko'])
        for o in x['distractorsKo']:
            for st in _ko_stems(o)-mine:
                c[st]+=1; w[st].append(f'{si}.{i}')
        # raw word-level too: content tokens not in ko
        mt=set(re.findall(r'[가-힣]+',x['ko']))
        for o in x['distractorsKo']:
            for t in set(re.findall(r'[가-힣]+',o))-mt:
                c1[t]+=1
for st,n in c.most_common(30):
    if n>=3: print(st,n,w[st] if n>=5 else '')
print('---token')
print([ (t,n) for t,n in c1.most_common(25) if n>=3])
