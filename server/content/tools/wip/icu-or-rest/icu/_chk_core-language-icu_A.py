import yaml, collections, itertools
d=yaml.safe_load(open('core-language-icu.A.yaml'))
W=d['words']
# alt chip paths: segment each en word with pieces (correct+decoy), flag segmentations that use a decoy
for w in W:
    pieces=set(p for wd in w['chips'] for p in wd)|set(w['decoyChips'])
    dec=set(w['decoyChips'])
    en=w['en']
    words=en.split(' ')
    for wd in words:
        # all segmentations
        res=[]
        def rec(s,used):
            if not s: res.append(used); return
            for p in pieces:
                if s.startswith(p): rec(s[len(p):],used|({p} if p in dec else set()))
        rec(wd,set())
        if any(u for u in res): print('ALT', w['id'], wd, [u for u in res if u])
tags=collections.Counter(w['tag'] for w in W); print(tags)
kos=collections.defaultdict(list)
for w in W: kos[w['ko']].append(w['en'])
print({k:v for k,v in kos.items() if len(v)>1})
bank_ko={w['ko'] for w in W}
for w in W:
    for k in w['distractorsKo']:
        if k in bank_ko: print('dKo=bankko',w['id'],k)
    for e in w['distractorsEn']:
        if e in {x['en'] for x in W}: print('dEn=bank',w['id'],e)
# decoy usage count
c=collections.Counter(p for w in W for p in w['decoyChips']); print([x for x in c.items() if x[1]>2])
cd=collections.Counter(e for w in W for e in w['distractorsEn']); print([x for x in cd.items() if x[1]>1])
ck=collections.Counter(e for w in W for e in w['distractorsKo']); print([x for x in ck.items() if x[1]>1])
