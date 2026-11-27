import yaml,re,sys,collections
for f in sys.argv[1:]:
  d=yaml.safe_load(open(f)); S=[x for s in d['situations'] for x in s['sentences']]
  dec=[x['decoy'] for x in S]; sh=collections.Counter()
  for dc in dec:
    w=dc.split()
    if re.match(r'(on|at|in|from|to|past|with|of|for|under|by|after|before|without|as|into|up|during) ',dc,re.I): s='전치사구'
    elif re.match(r'(and|but|or|if) ',dc,re.I) or dc.startswith(','): s='접속·if 구'
    elif len(w)==1: s='한 낱말'
    elif re.search(r"\b(is|are|has|isn't|knows|writes|waits)\b",dc): s='동사 포함 구'
    else: s='명사구'
    sh[s]+=1
  stop={'the','a','an','of','to','in','on','at','and','for','from','with','this','it','my','your','we','is','or','i','ll','s','you','that','by','if','let','all','very','has'}
  w=collections.Counter(t for dc in dec for t in set(re.findall(r'[a-z]+',dc.lower())) if t not in stop)
  print(f,dict(sh),'낱말 3회 이상',[(k,v) for k,v in w.most_common() if v>=3],'2회',[(k) for k,v in w.most_common() if v==2])
