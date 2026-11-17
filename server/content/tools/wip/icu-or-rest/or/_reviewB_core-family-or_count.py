import yaml,re,collections,sys
d=yaml.safe_load(open(sys.argv[1]))
S=[(f'{si}.{j}',x) for si,s in enumerate(d['situations']) for j,x in enumerate(s['sentences'])]
def toks(t): return set(re.findall(r'[가-힣]+',t))
def st2(t): return {w[:2] if len(w)>=2 else w for w in re.findall(r'[가-힣]+',t)}
def L(t): return len(re.sub(r'\s','',t))
# W19-style
c2=collections.Counter(); w2=collections.defaultdict(list)
c1=collections.Counter(); w1=collections.defaultdict(list)
for tag,x in S:
  k=x['ko']
  for dk in x['distractorsKo']:
    for t in st2(dk)-st2(k): c2[t]+=1; w2[t].append(tag)
    for t in toks(dk)-toks(k):
      c1[t[0]]+=1; w1[t[0]].append((tag,t))
print('W19 stems>=4:',[(k,v,w2[k]) for k,v in c2.most_common() if v>=4])
print('1st-syllable of DK-only tokens >=5:')
for k,v in c1.most_common():
  if v>=5: print('  ',k,v,w1[k])
# markers
M={'려고':r'려고','러(목적)':r'[가-힣]러 ','도록':r'도록','기 전에':r'기 전에','고 나서':r'고 나서','면(조건)':r'[가-힣]면 |[가-힣]면,','때까지':r'때까지'}
for name,p in M.items():
  ko=sum(1 for _,x in S if re.search(p,x['ko']+' '))
  dko=sum(1 for _,x in S for dk in x['distractorsKo'] if re.search(p,dk+' ') and not re.search(p,x['ko']+' '))
  print(f'marker {name}: ko {ko} / DK-only {dko}')
# length: both DK longer than ko
both=[t for t,x in S if all(L(dk)>L(x['ko']) for dk in x['distractorsKo'])]
print('both DK longer than ko:',len(both),both)
# V20
v20=[(t,dk) for t,x in S for dk in x['distractorsKo'] if not (L(dk)<=L(x['ko'])*1.25 and L(x['ko'])<=L(dk)*1.25 or abs(L(dk)-L(x['ko']))<=3)]
print('V20:',v20)
# decoys
dec=[(t,x['decoy']) for t,x in S]
shape=collections.Counter()
for t,dc in dec:
  w=dc.split()
  if re.match(r'(on|at|in|from|to|past|against|through|with|of|off|after|for|under|without|by|before|during|about|behind) ',dc,re.I): sh='prep'
  elif re.match(r'(and|but|or) ',dc,re.I): sh='conj'
  elif len(w)==1: sh='1word'
  elif re.match(r"(I'll|I|We'll|You|Take|There's|He'll|She|The|A|that|what|who|when|if|Before)\b",dc): sh='clause/NP'
  else: sh='other'
  shape[sh]+=1
print('decoy shapes',shape)
stop={'the','a','an','of','to','in','on','at','and','for','from','with','this','it','my','your','his','we','is','or','our','you','i','s','ll','she','her','he','by','if'}
w=collections.Counter(t for _,x in dec for t in set(re.findall(r'[a-z]+',x.lower())) if t not in stop)
print('decoy content words >=2',[(k,v) for k,v in w.most_common() if v>=2])
print('decoy prep heads',collections.Counter(x.split()[0].lower() for _,x in dec))
bo=collections.Counter(o['en'].lower() for _,x in S for o in x['blank']['options'] if o['en']!=x['blank']['answer'])
print('blank wrong >=3',[(k,v) for k,v in bo.most_common() if v>=3])
