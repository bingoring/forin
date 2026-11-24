import yaml,re,collections,sys
f=sys.argv[1] if len(sys.argv)>1 else 'core-safety-or.B.yaml'
d=yaml.safe_load(open(f))
def stems(t): return set(tok[:2] if len(tok)>=2 else tok for tok in re.findall(r'[가-힣]+',t or ''))
def toks(t): return set(re.findall(r'[가-힣]+',t or ''))
c2=collections.Counter(); ct=collections.Counter(); bw=collections.Counter(); dc=collections.Counter()
ryo=0; ryo_ko=0; jeon_d=0; jeon_k=0; myeon_d=0;myeon_k=0
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        ko=x['ko']; mine=stems(ko); mt=toks(ko)
        for dk in x['distractorsKo']:
            for st in stems(dk)-mine: c2[st]+=1
            for t in toks(dk)-mt: ct[t]+=1
            ryo+= '려고' in dk; jeon_d+='기 전에' in dk; myeon_d+= bool(re.search('면 ',dk))
        ryo_ko+='려고' in ko; jeon_k+='기 전에' in ko; myeon_k+=bool(re.search('면 ',ko))
        for o in x['blank']['options']:
            if o['en']!=x['blank']['answer']: bw[o['en']]+=1
        dc[x['decoy']]+=1
print('려고 d/k',ryo,ryo_ko,'기전에',jeon_d,jeon_k,'면',myeon_d,myeon_k)
print('stems>=4',[(k,v) for k,v in c2.most_common() if v>=4])
print('tokens>=4',[(k,v) for k,v in ct.most_common() if v>=4])
print('blank wrong>=3',[(k,v) for k,v in bw.most_common() if v>=3])
print('decoy>=2',[(k,v) for k,v in dc.most_common() if v>=2])
pos=collections.Counter()
for s in d['situations']:
    for x in s['sentences']:
        pos[[o['en'] for o in x['blank']['options']].index(x['blank']['answer'])]+=1
print('pos',pos)
