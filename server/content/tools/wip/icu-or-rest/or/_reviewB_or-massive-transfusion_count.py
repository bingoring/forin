import yaml,re,collections
d=yaml.safe_load(open('or-massive-transfusion.yaml'))
P=re.compile(r'(려고|러 |러$|도록|위해|기 전에)')
C=re.compile(r'[가-힣](면|으면) ')
both_p=[];one_p=[];both_pc=[];cond=[]
stems=collections.Counter(); where=collections.defaultdict(list)
def st(t): return {w[:2] for w in re.findall(r'[가-힣]+',t)}
endings=collections.Counter()
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    k=x['ko'];a,b=x['distractorsKo'];tag=f'{si}-{j}'
    pa,pb=bool(P.search(a+' ')),bool(P.search(b+' '))
    ca,cb=bool(C.search(a+' ')),bool(C.search(b+' '))
    kp=bool(P.search(k+' ')) or bool(C.search(k+' '))
    if pa and pb: both_p.append(tag)
    elif pa or pb: one_p.append(tag)
    if (pa or ca) and (pb or cb) and not kp: both_pc.append(tag)
    if (ca or cb) and not C.search(k+' '): cond.append(tag)
    for dk in (a,b):
      for t in st(dk)-st(k): stems[t]+=1; where[t].append(tag)
      for m in re.findall(r'[가-힣]*(려고|도록|위해|하러|러 )',dk+' '): endings[m]+=1
print('both purpose',len(both_p),both_p)
print('one purpose',len(one_p),one_p)
print('both purpose-or-cond (ko has none)',len(both_pc))
print('cond in distractor',len(cond),cond)
print('endings',endings)
print('stem top:',[(k,v) for k,v in stems.most_common(25)])
# decoys
dec=[x['decoy'] for s in d['situations'] for x in s['sentences']]
pp=[x for x in dec if re.match(r'(on|at|in|from|to|past|against|throughout|with|of|off|after|for) ',x)]
print('decoy prep-phrase',len(pp),'/',len(dec))
w=collections.Counter(t for x in dec for t in re.findall(r'[a-z]+',x.lower()) if t not in {'the','a','an','of','to','in','on','at','and','for','from','with','this','it'})
print('decoy words',w.most_common(15))
bo=collections.Counter(o['en'] for s in d['situations'] for x in s['sentences'] for o in x['blank']['options'] if o['en']!=x['blank']['answer'])
print('blank wrong top',bo.most_common(15))
