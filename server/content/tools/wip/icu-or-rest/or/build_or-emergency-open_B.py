import yaml, glob, re, sys
BASE='base-or-emergency-open.yaml'
OUT='or-emergency-open.B.yaml'
d=yaml.safe_load(open(BASE))
add={}
for f in sorted(glob.glob('add_or-emergency-open_B_[0-9].yaml')):
    for sit in yaml.safe_load(open(f)):
        add[sit['title']]=sit
patch=yaml.safe_load(open('patch_or-emergency-open_B.yaml'))
n=0
for si,sit in enumerate(d['situations']):
    a=add[sit['title']]
    for k,v in patch.items():
        m=re.fullmatch(r'(\d+)\.(\d+)',k)
        if m and int(m.group(1))==si:
            x=a['s'][int(m.group(2))]
            for kk,vv in v.items(): x[kk]=vv
    assert len(a['s'])==len(sit['sentences']),sit['title']
    for i,(s,x) in enumerate(zip(sit['sentences'],a['s'])):
        s['tag']=x['tag']; s['icon']=x['icon']; s['why']=x['why']; s['decoy']=x['decoy']
        assert len(x['dk'])==2
        s['distractorsKo']=x['dk']
        ans,*wr=[str(v) for v in x['bl']]
        assert len(wr)==3
        opts=[ans]+wr
        pos=(i+n)%4
        opts=wr[:pos]+[ans]+wr[pos:]
        s['blank']={'answer':ans,'options':[{'en':o} for o in opts]}
        n+=1
    o=a['order']
    sit['order']={'tag':o['tag'],'icon':o['icon'],'ko':o['ko'],'why':o['why'],'lines':o['lines']}
yaml.safe_dump(d,open(OUT,'w'),allow_unicode=True,sort_keys=False,width=1000)
print('wrote',OUT,n)
