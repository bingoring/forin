import yaml,re,collections,sys
d=yaml.safe_load(open('icu-glycemic.yaml'))
P=['에게도','에서는','으로는','에게','에서','으로','까지','부터','처럼','마다','보다','이랑','하고','과','와','을','를','이','가','은','는','도','만','에','의','로','엔','랑']
def stem(w):
    w=re.sub(r'[.,?!—·\-]','',w)
    for p in P:
        if w.endswith(p) and len(w)>len(p): return w[:-len(p)]
    return w
cnt=collections.Counter(); where=collections.defaultdict(list)
starts=collections.Counter()
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        ks=set(stem(w) for w in x['ko'].split())
        for k,dk in enumerate(x['distractorsKo']):
            toks=dk.split()
            starts[' '.join(toks[:2])]+=1
            seen=set()
            for w in toks:
                st=stem(w)
                if st and st not in ks and st not in seen:
                    seen.add(st); cnt[st]+=1; where[st].append(f"{si}.{j}X{k+1}")
for w,c in cnt.most_common(45):
    print(c,w,' '.join(where[w]))
print('--- endings with 면 in first 3 tokens')
n=0
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        c=any(t.endswith('면') or t.endswith('뒤') or t.endswith('뒤엔') or t.endswith('뒤에는') for t in x['ko'].split()[:3])
        xs=[any(t.endswith('면') or t.endswith('뒤') or t.endswith('뒤엔') or t.endswith('뒤에는') or t.endswith('후에') for t in dk.split()[:3]) for dk in x['distractorsKo']]
        if any(xs) and not c: n+=1; print(f"{si}.{j}", xs, x['ko'][:20])
print(n)
