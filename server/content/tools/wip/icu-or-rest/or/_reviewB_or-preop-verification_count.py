import yaml,re,collections,sys
f=sys.argv[1] if len(sys.argv)>1 else 'or-preop-verification.yaml'
d=yaml.safe_load(open(f))
P=re.compile(r'(려고|러 |러$|도록|위해|기 전에|[가-힣](면|으면) )')
both=[];one=[]
def st(t): return {w[:2] if len(w)>=2 else w for w in re.findall(r'[가-힣]+',t)}
def toks(t): return set(re.findall(r'[가-힣]+',t))
stems=collections.Counter(); where=collections.defaultdict(list)
wordc=collections.Counter(); wwhere=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    k=x['ko'];a,b=x['distractorsKo'];tag=f'{si}.{j}'
    pa=bool(P.search(a+' ')) and not P.search(k+' '); pb=bool(P.search(b+' ')) and not P.search(k+' ')
    if pa and pb: both.append(tag)
    elif pa or pb: one.append(tag)
    for dk in (a,b):
      for t in st(dk)-st(k): stems[t]+=1; where[t].append(tag)
      for t in toks(dk)-toks(k): wordc[t]+=1; wwhere[t].append(tag)
print('marker in both distractors (not in ko):',len(both),both)
print('marker in one:',len(one),one)
print('stem>=4:',[(k,v,where[k]) for k,v in stems.most_common() if v>=4])
print('word-only tokens >=3:',[(k,v,wwhere[k]) for k,v in wordc.most_common() if v>=3])
dec=[(f'{si}.{j}',x['decoy']) for si,s in enumerate(d['situations']) for j,x in enumerate(s['sentences'])]
pp=[t for t,x in dec if re.match(r'(on|at|in|from|to|past|against|through|with|of|off|after|for|under|without) ',x,re.I)]
print('decoy prep-phrase',len(pp),'/',len(dec),pp)
stop={'the','a','an','of','to','in','on','at','and','for','from','with','this','it','my','your','his','we','is','or','our'}
w=collections.Counter(t for _,x in dec for t in set(re.findall(r'[a-z]+',x.lower())) if t not in stop)
print('decoy words >=2',[(k,v) for k,v in w.most_common() if v>=2])
bo=collections.Counter(o['en'] for s in d['situations'] for x in s['sentences'] for o in x['blank']['options'] if o['en']!=x['blank']['answer'])
print('blank wrong >=2',[(k,v) for k,v in bo.most_common() if v>=2])
