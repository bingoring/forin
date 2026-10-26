import yaml, glob, sys
D='/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/'
base=yaml.safe_load(open(D+'base-icu-delirium.yaml'))
add={}
for f in sorted(glob.glob(D+'add_icu-delirium_B_*.yaml')):
    for e in yaml.safe_load(open(f)):
        add[e['n']]=e
k=0
for si,sit in enumerate(base['situations']):
    e=add.get(si)
    if not e: print('missing',si); continue
    assert len(e['s'])==len(sit['sentences']),(si,len(e['s']))
    for x,a in zip(sit['sentences'],e['s']):
        x['tag']=a['tag']; x['icon']=a['icon']; x['why']=a['why']; x['decoy']=a['decoy']
        x['distractorsKo']=list(a['dko'])
        opts=[a['ans']]+list(a['wrong'])
        r=k%4; k+=1
        opts=opts[1:1+r]+[opts[0]]+opts[1+r:] if r else opts
        x['blank']={'answer':a['ans'],'options':[{'en':o} for o in opts]}
    sit['order']=e['order']
yaml.safe_dump(base,open(D+'icu-delirium.B.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
