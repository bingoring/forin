import yaml,re,collections,sys
f=sys.argv[1]
d=yaml.safe_load(open(f))
def st(t): return {w[:2] if len(w)>=2 else w for w in re.findall(r'[가-힣]+',t)}
stems=collections.Counter(); where=collections.defaultdict(list)
P=re.compile(r'(려고|러 |도록|위해|기 전에|[가-힣](면|으면) |해서|어서|싶어서|려는 거|때문)')
both=[];ryeogo=[];typ=[]
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    k=x['ko'];a,b=x['distractorsKo'];tag=f'{si}.{j}'
    for dk in (a,b):
      for t in st(dk)-st(k): stems[t]+=1; where[t].append(tag)
    pa=bool(P.search(a+' ')) and not P.search(k+' '); pb=bool(P.search(b+' ')) and not P.search(k+' ')
    if pa and pb: both.append(tag)
    if ('려고' in a or '려고' in b) and '려고' not in k: ryeogo.append(tag)
    req=lambda t: t.rstrip().endswith(('?','주세요.','주실래요?','세요.','주시겠어요?','봅시다.','합시다.','읍시다.'))
    if req(k) and not (req(a) or req(b)): typ.append((tag,k,a,b))
print('both markers',both)
print('려고 sentences',len(ryeogo),ryeogo)
print('type tell',len(typ)); [print('  ',t) for t in typ]
print('stems>=4',[(k,v,where[k]) for k,v in stems.most_common() if v>=4])
