import yaml,re,sys,collections,json
def L(s): return len(re.sub(r'\s','',s))
M={'려고':r'려고','기 전에':r'기 전에','고 나서':r'고 나서','면(조건)':r'[가-힣]면 |[가-힣]면,','니(이유)':r'니 |으니','게(목적)':r'(하시게|있게|고르게|찾게) ','동안':r'동안','먼저/우선/일단':r'먼저|우선|일단','~부터':r'부터','뒤/후':r'(?<![가-힣])뒤 |[가-힣] 뒤','때':r'때'}
for f in sys.argv[1:]:
  d=yaml.safe_load(open(f)); S=[(f'{i}.{j}',x) for i,s in enumerate(d['situations']) for j,x in enumerate(s['sentences'])]
  print('==',f)
  for n,p in M.items():
    ko=sum(1 for _,x in S if re.search(p,x['ko']+' '))
    dk=sum(1 for _,x in S for t in x['distractorsKo'] if re.search(p,t+' ') and not re.search(p,x['ko']+' '))
    both=[t for t,x in S if all(re.search(p,y+' ') and not re.search(p,x['ko']+' ') for y in x['distractorsKo'])]
    print(f'  marker {n}: ko {ko} / DK-only {dk} / both {len(both)} {both}')
  print('  both DK longer:',[t for t,x in S if all(L(y)>L(x['ko']) for y in x['distractorsKo'])])
  pos=collections.Counter(next(k for k,o in enumerate(x['blank']['options']) if o['en']==x['blank']['answer']) for _,x in S)
  print('  blank answer position',sorted(pos.items()))
  dec=[x['decoy'] for _,x in S]; sh=collections.Counter()
  for dc in dec:
    w=dc.split()
    if re.match(r'(on|at|in|from|to|past|with|of|for|under|by|after|before|without|as) ',dc,re.I): s='전치사구'
    elif re.match(r'(and|but|or) ',dc,re.I): s='and/or 구'
    elif len(w)==1: s='한 낱말'
    elif re.match(r"(I'll|I|We|You|Let's|Should|Place|Avoid|How|This|It|The|A|An)\b",dc) and len(w)>=2 and re.search(r"\b(is|are|goes|holds|will|needs|isn't|can|it|this)\b",dc): s='절'
    else: s='명사구 등'
    sh[s]+=1
  print('  decoy shapes',dict(sh))
  stop={'the','a','an','of','to','in','on','at','and','for','from','with','this','it','my','your','we','is','or','i','ll','s','you','that','by','if','let'}
  w=collections.Counter(t for dc in dec for t in set(re.findall(r'[a-z]+',dc.lower())) if t not in stop)
  print('  decoy words>=3',[(k,v) for k,v in w.most_common() if v>=3])
  bo=collections.Counter(o['en'].lower() for _,x in S for o in x['blank']['options'] if o['en']!=x['blank']['answer'])
  print('  blank wrong >=3',[(k,v) for k,v in bo.most_common() if v>=3])
p=json.load(open('_reviewB_or-specimen_proposal.json'))['P']
d=yaml.safe_load(open('_reviewB_or-specimen_after.yaml'))
bf=[f'{i}.{j}' for i,s in enumerate(d['situations']) for j,_ in enumerate(s['sentences']) if all(p.get(f'{i}.{j}.{k}',[0]*5)[4]=='fact' for k in (0,1))]
print('both fact (after):',len(bf),bf)
print('fact cells',sum(1 for v in p.values() if v[4]=='fact'),'of',len(p))
