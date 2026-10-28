import yaml,re,collections
d=yaml.safe_load(open('_tmp_icu-raised-icp_B_applied.yaml'))
P=['에게도','에서는','으로는','에게','에서','으로','까지','부터','처럼','마다','보다','이랑','하고','과','와','을','를','이','가','은','는','도','만','에','의','로','엔','랑','께']
E=['하시는','하려고','하면서','할게요','하세요','했어요','해요','하고','하면','한','할','해','시킬게요','시키세요','시켜요','될','된','돼요','되면','하기','하는','하지','할지','드릴게요','드려요','둘게요','두세요','둬요','볼게요','봐요','보세요','보고','보려고','본','봐','살필게요','살피세요','살펴보세요','살펴봐요','씻을게요','씻으세요','씻어요','말할게요','말하세요','알릴게요','알리세요','알려요','물어볼게요','물어봐요','적어','기록']
def stem(w):
    w=re.sub(r'[.,?!—·\-]','',w)
    for p in P:
        if w.endswith(p) and len(w)>len(p): w=w[:-len(p)];break
    for e in sorted(E,key=len,reverse=True):
        if w.endswith(e) and len(w)>len(e): return w[:-len(e)]
    return w
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        ks=set(stem(w) for w in x['ko'].split())
        for k,dk in enumerate(x['distractorsKo']):
            seen=set()
            for w in dk.split():
                st=stem(w)
                if st and st not in ks and st not in seen:
                    seen.add(st); cnt[st]+=1; where[st].append(f"{si}.{j}X{k+1}")
for w,c in cnt.most_common(40):
    if c>=3: print(c,w,' '.join(where[w]))
print('--- length checks (ratio>1.25 and diff>3, or both distractors longer than ko)')
L=lambda t: len(re.sub(r'[.?!]$','',t.strip()))
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        k=L(x['ko']); ls=[L(t) for t in x['distractorsKo']]
        bad=[l for l in ls if (max(l,k)/min(l,k)>1.25 and abs(l-k)>3)]
        if bad or min(ls)>k: print(f"{si}.{j} ko={k} X={ls}", 'RATIO' if bad else '', 'BOTH_LONGER' if min(ls)>k else '')
