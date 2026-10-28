import yaml,re,collections,sys
f=sys.argv[1] if len(sys.argv)>1 else 'icu-status-epilepticus.yaml'
d=yaml.safe_load(open(f))
P=['에게도','에서는','으로는','에게','에서','으로','까지','부터','처럼','마다','보다','이랑','과','와','을','를','이','가','은','는','도','만','에','의','로','엔','랑','께']
E=['하고 있어요','고 있어요','하고','해서','하죠','할게요','해요','했어요','하는','하기','하면','한','할','해','하세요','세요','게요','어요','아요','죠','고','서','는','은','을','면','며','지','기','게','어','아','니까','려고','러']
def stem(w):
    w=re.sub(r'[.,?!—·\-()]','',w)
    for _ in range(2):
        for p in P:
            if w.endswith(p) and len(w)>len(p)+0: w=w[:-len(p)]; break
    return w
def vstem(w):
    w=stem(w)
    for e in sorted(E,key=len,reverse=True):
        if w.endswith(e) and len(w)>len(e): return w[:-len(e)]
    return w
for fn,name in ((stem,'조사 뗀 낱말'),(vstem,'어간')):
    cnt=collections.Counter(); where=collections.defaultdict(list)
    for si,s in enumerate(d['situations']):
        for j,x in enumerate(s['sentences']):
            ks=set(fn(w) for w in x['ko'].split())
            for k,dk in enumerate(x['distractorsKo']):
                seen=set()
                for w in dk.split():
                    st=fn(w)
                    if st and st not in ks and st not in seen:
                        seen.add(st); cnt[st]+=1; where[st].append(f"{si}.{j}X{k+1}")
    print('=====',name)
    for w,c in cnt.most_common(40):
        if c>=3: print(c,w,' '.join(where[w]))
