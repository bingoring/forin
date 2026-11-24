import yaml,re,sys,collections
d=yaml.safe_load(open(sys.argv[1])); th=int(sys.argv[2]) if len(sys.argv)>2 else 4
def st(t): return {w[:2] if len(w)>=2 else w for w in re.findall(r'[가-힣]+',t or '')}
C=collections.Counter(); W=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    m=st(x['ko'])
    for k,dk in enumerate(x['distractorsKo']):
      for t in st(dk)-m: C[t]+=1; W[t].append(f'{si}.{j}.{k}')
for t,c in C.most_common():
  if c>=th: print(t,c,' '.join(W[t]))
