import yaml, re, collections
D='/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/'
y=yaml.safe_load(open(D+'icu-liver-failure.yaml'))
W={w['id']:w for w in y['words']}
use=collections.defaultdict(list)
for i,s in enumerate(y['situations']):
    ids=set()
    for j,t in enumerate(s['sentences']):
        for w in t['words']: use[w].append(f'{i}.{j}'); ids.add(w)
    print('S',i,len(ids))
print('--- usage')
for k in ['w-add','w-bag','w-push','w-need','w-meal','w-hold','w-give','w-list','w-center','w-wait','w-start','w-treatment','w-line','w-lab','w-vital','w-shut','w-hand','w-stressed','w-transport','w-transfer','w-tell','w-call','w-protocol','w-trigger','w-away','w-team','w-urgency','w-status','w-hard','w-clear','w-pressure','w-bring','w-get','w-quickly','w-fast','w-immediately','w-ammonia','w-physician']:
    print(k, W[k]['en'], W[k]['ko'], use.get(k))
print('--- unused', [k for k in W if k not in use])
print('--- decoyChips')
print(sorted({c for w in y['words'] for c in w['decoyChips']}))
print('--- cue contains ko word')
for w in y['words']:
    for tok in re.split(r'[\s,()]+', w['ko']):
        if len(tok)>=2 and tok in w['cue']: print(w['id'], w['ko'], '|', w['cue'])
print('--- order blocks sample')
for i,s in enumerate(y['situations']):
    o=s['order']; print(i, o.get('ko'), [l['en'] for l in o['lines']])
