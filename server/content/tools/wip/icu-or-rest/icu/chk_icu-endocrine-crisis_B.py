import yaml,re,collections,sys
sys.path.insert(0,'.')
from fixvals_icu_endocrine_crisis_B import NEW
d=yaml.safe_load(open('icu-endocrine-crisis.yaml'))
P=['께서','에게','에서','으로','이랑','까지','부터','처럼','이나','께','가','이','을','를','은','는','도','만','에','로','랑','와','과','의','나']
def stem(w):
    w=re.sub(r'[,.?!—]','',w)
    for p in sorted(P,key=len,reverse=True):
        if w.endswith(p) and len(w)>len(p)+1: return w[:-len(p)]
    return w
L=lambda s: len(s.replace(' ',''))
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
  for i,x in enumerate(s['sentences']):
    k=f"{si}.{i}"; ko=x['ko']; ds=list(x['distractorsKo'])
    for j,v in NEW.get(k,{}).items(): ds[j-1]=v
    for j,v in enumerate(ds):
      a,b=L(ko),L(v)
      bad = (b/a>1.25 or a/b>1.25) and abs(a-b)>3
      if k in NEW and (j+1) in NEW[k]:
        if bad: print("LEN FAIL",k,j+1,a,b,v)
      kos=set(stem(w) for w in ko.split())
      for w in set(stem(t) for t in v.split())-kos: cnt[w]+=1; where[w].append(f"{k}X{j+1}")
    if k in NEW and not any(L(v)<=L(ko) for v in ds): print("NONE<=",k,L(ko),[L(v) for v in ds])
    if ds[0]==ds[1] or ko in ds: print("DUP",k)
for w,c in cnt.most_common(30):
  if c>=5: print(c,w,where[w])
