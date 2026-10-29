import yaml,re,collections
y=yaml.safe_load(open('icu-brain-death.A.yaml'))
W=y['words']
ko=collections.defaultdict(list)
for w in W: ko[w['ko']].append(w['id'])
print('dup ko',{k:v for k,v in ko.items() if len(v)>1})
ens={w['en'].lower():w for w in W}
for w in W:
    for d in w['distractorsKo']:
        if d in ko and w['id'] not in ko[d]: print('ko2 equals bank ko',w['id'],d)
    for d in w['distractorsEn']:
        if d.lower() in ens: print('en2 is bank word',w['id'],d,ens[d.lower()]['ko'])
    kk=re.sub(r'[\s()]','',w['ko'])
    if kk in w['cue'].replace(' ',''): print('cue has ko',w['id'])
tags=collections.Counter(w['tag'] for w in W); print(tags)
