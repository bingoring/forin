import yaml,re,copy,json,sys
sys.path.insert(0,'.')
import importlib
P={};ORD={}
for m in ['_reviewB_core-safety-or_prop1','_reviewB_core-safety-or_prop2','_reviewB_core-safety-or_prop3']:
    mod=importlib.import_module(m); P.update(mod.P); ORD.update(mod.ORD)
src=yaml.safe_load(open('core-safety-or.yaml'))
d=copy.deepcopy(src)
def ln(s): return len(re.sub(r'\s','',s))
errs=[]
for k,v in P.items():
    si,j=map(int,k.split('.')); x=d['situations'][si]['sentences'][j]
    for f in v.get('c',{}):
        assert f in ('d0','d1','blank','decoy','tag','why'),(k,f)
        key={'d0':'d0','d1':'d1'}.get(f,f)
        assert key in v,(k,'classified but no value',f)
    for f in ('d0','d1','blank','decoy','tag','why'): 
        if f in v: assert f in v['c'],(k,'value without reason',f)
    dk=list(x['distractorsKo'])
    if 'd0' in v: assert v['d0']!=dk[0]; dk[0]=v['d0']
    if 'd1' in v: assert v['d1']!=dk[1]; dk[1]=v['d1']
    x['distractorsKo']=dk
    if 'blank' in v:
        a,ops=v['blank']; x['blank']={'answer':a,'options':[{'en':o} for o in ops]}
    if 'decoy' in v: x['decoy']=v['decoy']
    if 'tag' in v: x['tag']=v['tag']
    if 'why' in v: x['why']=v['why']
for k,v in ORD.items():
    o=d['situations'][int(k)]['order']
    for i,ch in v['lines'].items(): o['lines'][i].update(ch)
    if 'why' in v: o['why']=v['why']
# checks on every sentence
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        k=f'{si}.{j}'; ko=x['ko']; dk=x['distractorsKo']
        if len(set(dk))!=2 or ko in dk: errs.append((k,'dk dup'))
        for t in dk:
            a,b=ln(ko),ln(t)
            if abs(a-b)>3 and (max(a,b)>1.25*min(a,b)): errs.append((k,'V20',t))
        if min(ln(t) for t in dk)>ln(ko): errs.append((k,'both longer',dk))
        a=x['blank']['answer']; ops=[o['en'] for o in x['blank']['options']]
        if a not in ops or len(set(ops))!=4: errs.append((k,'blank ops'))
        if len(re.findall(r'(?<![A-Za-z])'+re.escape(a)+r'(?![A-Za-z])',x['en']))!=1: errs.append((k,'blank answer occurrences'))
        dc=x['decoy']
        if dc in x['chunks'] or dc.lower() in x['en'].lower(): errs.append((k,'decoy in en',dc))
    for l in s['order']['lines']:
        if len(l['en'].split())>15: errs.append((si,'order >15 words',l['en']))
# only B fields changed
for si,(a,b) in enumerate(zip(src['situations'],d['situations'])):
    assert a['title']==b['title'] and a['nuance']==b['nuance']
    for x,y in zip(a['sentences'],b['sentences']):
        for f in ('en','ko','chunks','words','goal'): assert x[f]==y[f]
    assert set(a['order'])==set(b['order'])
assert src['words']==d['words'] and src['theme']==d['theme']
print('errors',len(errs))
for e in errs: print('  ',e)
yaml.safe_dump(d,open('_reviewB_core-safety-or_after.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
json.dump({'P':{k:{kk:vv for kk,vv in v.items()} for k,v in P.items()},'ORD':ORD},open('_reviewB_core-safety-or_proposal.json','w'),ensure_ascii=False,indent=1)
print('changed sentences',len(P),'orders',len(ORD))
