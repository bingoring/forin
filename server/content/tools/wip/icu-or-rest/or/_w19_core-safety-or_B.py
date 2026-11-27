import yaml,re,collections,sys
d=yaml.safe_load(open('core-safety-or.B.yaml'))
def stems(t): return set(tok[:2] if len(tok)>=2 else tok for tok in re.findall(r'[가-힣]+',t or ''))
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        mine=stems(x['ko'])
        for k,dk in enumerate(x['distractorsKo']):
            for st in stems(dk)-mine: cnt[st]+=1; where[st].append((si,j,k+1,dk))
lim=int(sys.argv[1]) if len(sys.argv)>1 else 4
for st,c in cnt.most_common():
    if c>lim:
        print(f"== {st} {c}")
        if len(sys.argv)>2:
            for w in where[st]: print('   ',w)
