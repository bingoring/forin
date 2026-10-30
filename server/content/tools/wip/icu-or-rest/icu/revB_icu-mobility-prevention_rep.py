import yaml,sys,collections
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
from verify_lesson_content import _ko_stems
f=sys.argv[1] if len(sys.argv)>1 else 'icu-mobility-prevention.yaml'
d=yaml.safe_load(open(f))
c=collections.Counter(); w=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    m=_ko_stems(x['ko'])
    for dk in x['distractorsKo']:
      for st in _ko_stems(dk)-m: c[st]+=1; w[st].append(f"{si}.{j}")
print([(k,n,w[k]) for k,n in c.most_common(14)])
