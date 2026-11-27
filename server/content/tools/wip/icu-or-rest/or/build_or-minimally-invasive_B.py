import yaml, glob, collections, zlib, sys, re, importlib.util
_sp=importlib.util.spec_from_file_location('ov','ov_or-minimally-invasive_B.py'); OV=importlib.util.module_from_spec(_sp); _sp.loader.exec_module(OV)
T='or-minimally-invasive'
SALT=sys.argv[1] if len(sys.argv)>1 else ''
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
pos=collections.Counter(); both=0; tot=0
for i,sit in enumerate(out['situations']):
    if i not in data: continue
    d=data[i]
    assert len(d['S'])==len(sit['sentences']),(i,len(d['S']))
    idx=0
    for s,v in zip(sit['sentences'],d['S']):
        v=v[:10]
        assert len(v)==10,(i,v)
        tag,icon,why,decoy,dk1,dk2,ans,w1,w2,w3=[x.strip() for x in v]
        key=f'{i}.{idx}'; idx+=1
        if key in OV.DK:
            o1,o2=OV.DK[key]; dk1=o1 or dk1; dk2=o2 or dk2
        for kk in (1,2):
            fk=f'{key}.{kk}'
            if fk in OV.FIX:
                if kk==1: dk1=OV.FIX[fk]
                else: dk2=OV.FIX[fk]
        if key in OV.BL: ans,w1,w2,w3=OV.BL[key]
        if key in OV.DECOY: decoy=OV.DECOY[key]
        ACT=re.compile(r'(게요|시다|세요|까요|나요|겠어요\?|고 있습니다)[.?]?$')
        if not (ACT.search(dk1) or ACT.search(dk2)): both+=1
        s['tag']=tag;s['icon']=icon;s['why']=why;s['decoy']=decoy
        s['distractorsKo']=[dk1,dk2]
        opts=[w1,w2,w3]; p=zlib.crc32((SALT+s['en']).encode())%4
        opts.insert(p,ans); pos[p]+=1; tot+=1
        s['blank']={'answer':ans,'options':[{'en':x} for x in opts]}
    assert len(d['L'])==4,i
    if OV.ORDER.get(i):
        oo=OV.ORDER[i]; d['O']=[oo[0],oo[1]]; d['L']=[list(x) for x in oo[2]]
    if i in OV.ORDER4: d['L'][3][0]=OV.ORDER4[i]
    sit['order']={'tag':'대화 흐름','icon':'compass','ko':d['O'][0],'why':d['O'][1],
      'lines':[{'en':l[0],'icon':l[1],'ko':l[2],'note':l[3]} for l in d['L']]}
yaml.safe_dump(out,open(f'{T}.B.yaml','w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=1000)
print('built',len(data),'sits',tot,'sents',dict(pos),'bothFact',both)
