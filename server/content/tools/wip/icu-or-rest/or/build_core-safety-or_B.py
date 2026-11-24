import yaml, glob, hashlib
T='core-safety-or'
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
    d=data[i]
    assert len(d['S'])==len(sit['sentences']),(i,len(d['S']))
    for s,v in zip(sit['sentences'],d['S']):
        assert len(v)==10,(i,v)
        tag,icon,why,decoy,dk1,dk2,ans,w1,w2,w3=[x.strip() for x in v]
        s['tag']=tag;s['icon']=icon;s['why']=why;s['decoy']=decoy
        s['distractorsKo']=[dk1,dk2]
        opts=[w1,w2,w3]
        pos=int(hashlib.md5(s['en'].encode()).hexdigest(),16)%4
        opts.insert(pos,ans)
        s['blank']={'answer':ans,'options':[{'en':x} for x in opts]}
    assert len(d['L'])==4,i
    sit['order']={'tag':'대화 흐름','icon':'compass','ko':d['O'][0],'why':d['O'][1],
      'lines':[{'en':l[0],'icon':l[1],'ko':l[2],'note':l[3]} for l in d['L']]}
import ovr_core_safety_or_B as O
for (si,j),v in O.DK.items():
    cur=out['situations'][si]['sentences'][j]['distractorsKo']
    out['situations'][si]['sentences'][j]['distractorsKo']=[v[0] or cur[0], v[1] or cur[1]]
for (si,j),w in O.BL.items():
    sn=out['situations'][si]['sentences'][j]
    pos=int(hashlib.md5(sn['en'].encode()).hexdigest(),16)%4
    opts=list(w[1:]); opts.insert(pos,w[0])
    sn['blank']={'answer':w[0],'options':[{'en':x} for x in opts]}
for (si,j),dc in O.DECOY.items(): out['situations'][si]['sentences'][j]['decoy']=dc
for sit in out['situations']:
    for l in sit['order']['lines']:
        if l['icon']=='ear': l['icon']='mic'
for (si,j),w in O.WHY.items(): out['situations'][si]['sentences'][j]['why']=w
for si,(ko,why,lines) in O.ORD.items():
    out['situations'][si]['order']={'tag':'대화 흐름','icon':'compass','ko':ko,'why':why,
      'lines':[{'en':l[0],'icon':l[1],'ko':l[2],'note':l[3]} for l in lines]}
# 정답 자리 균형 — 해시로 정한 자리가 한쪽에 몰리면 일부만 맞바꿔 네 자리를 고르게
import collections
allS=[x for sit in out['situations'] for x in sit['sentences']]
def posof(x): return [o['en'] for o in x['blank']['options']].index(x['blank']['answer'])
tgt=len(allS)/4
for _ in range(200):
    cnt=collections.Counter(posof(x) for x in allS)
    hi=max(range(4),key=lambda k:cnt[k]); lo=min(range(4),key=lambda k:cnt[k])
    if cnt[hi]-cnt[lo]<=2: break
    cands=[x for x in allS if posof(x)==hi]
    x=cands[int(hashlib.md5(x_en.encode()).hexdigest(),16)%len(cands)] if False else cands[(len(cands)*7+cnt[lo])%len(cands)]
    ops=x['blank']['options']; a=posof(x); ops[a],ops[lo]=ops[lo],ops[a]
yaml.safe_dump(out,open(f'{T}.B.yaml','w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=1000)
print('built',len(data))
