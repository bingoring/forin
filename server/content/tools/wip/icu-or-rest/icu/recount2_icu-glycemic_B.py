import yaml,re,collections,sys
sys.path.insert(0,'.')
from newko_icu_glycemic_B import NEW
use_new = len(sys.argv)>1
d=yaml.safe_load(open('icu-glycemic.yaml'))
def key(w):
    w=re.sub(r'[^가-힣0-9A-Za-z]','',w)
    return w[:2] if len(w)>=2 else w
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        k0=f"{si}.{j}"
        ks=set(key(w) for w in x['ko'].split())
        for k,dk in enumerate(x['distractorsKo']):
            if use_new and (k0,k) in NEW: dk=NEW[(k0,k)]
            seen=set()
            for w in dk.split():
                st=key(w)
                if st and st not in ks and st not in seen:
                    seen.add(st); cnt[st]+=1; where[st].append(f"{k0}X{k+1}:{w}")
for w,c in cnt.most_common(30):
    if c>=5: print(c,w,' '.join(where[w]))
