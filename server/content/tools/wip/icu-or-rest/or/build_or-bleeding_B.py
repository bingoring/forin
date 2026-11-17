import yaml, glob
T='or-bleeding'
base=yaml.safe_load(open(f'base-{T}.yaml',encoding='utf-8'))
data={}
for f in sorted(glob.glob(f'add_{T}_B_*.txt')):
    cur=None
    for ln in open(f,encoding='utf-8'):
        ln=ln.rstrip('\n')
        if not ln.strip(): continue
        if ln.startswith('## '):
            cur=int(ln[3:]); data[cur]={'S':[],'O':None,'L':[]}; continue
        p=ln.split('|'); k=p[0]
        if k=='S': data[cur]['S'].append(p[1:])
        elif k=='O': data[cur]['O']=p[1:]
        elif k=='L': data[cur]['L'].append(p[1:])
out=yaml.safe_load(open(f'base-{T}.yaml',encoding='utf-8'))
for i,sit in enumerate(out['situations']):
    if i not in data: continue
    d=data[i]
    assert len(d['S'])==len(sit['sentences']),(i,len(d['S']))
    for s,v in zip(sit['sentences'],d['S']):
        assert len(v)==10,(i,v)
        tag,icon,why,decoy,dk1,dk2,ans,w1,w2,w3=[x.strip() for x in v]
        s['tag']=tag;s['icon']=icon;s['why']=why;s['decoy']=decoy
        s['distractorsKo']=[dk1,dk2]
        s['blank']={'answer':ans,'options':[{'en':x} for x in (ans,w1,w2,w3)]}
    assert len(d['L'])==4,i
    sit['order']={'tag':'대화 흐름','icon':'compass','ko':d['O'][0],'why':d['O'][1],
      'lines':[{'en':l[0],'icon':l[1],'ko':l[2],'note':l[3]} for l in d['L']]}
from ovr_or_bleeding_B import *
for (si,j),(a,b) in DK.items(): out['situations'][si]['sentences'][j]['distractorsKo']=[a,b]
for (si,j),w in BL.items():
    s=out['situations'][si]['sentences'][j]; s['blank']={'answer':w[0],'options':[{'en':x} for x in w]}
for (si,j),dc in DECOY.items(): out['situations'][si]['sentences'][j]['decoy']=dc
for (si,k),(en,ic,ko,nt) in ORDER.items(): out['situations'][si]['order']['lines'][k].update(en=en,icon=ic,ko=ko,note=nt)
for si,w in ORDER_WHY.items(): out['situations'][si]['order']['why']=w
yaml.safe_dump(out,open(f'{T}.B.yaml','w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=1000)
print('built',len(data))
