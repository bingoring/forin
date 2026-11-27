import yaml,re,collections,sys
f=sys.argv[1]; lim=int(sys.argv[2]) if len(sys.argv)>2 else 4
d=yaml.safe_load(open(f))
def stems(t): return set(tok[:2] if len(tok)>=2 else tok for tok in re.findall(r'[가-힣]+',t or ''))
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        mine=stems(x['ko'])
        for k,dk in enumerate(x['distractorsKo']):
            for st in stems(dk)-mine: cnt[st]+=1; where[st].append(f'{si}.{j}/{k}')
for st,c in cnt.most_common():
    if c>lim: print(f"{st} {c}: {' '.join(where[st])}")
