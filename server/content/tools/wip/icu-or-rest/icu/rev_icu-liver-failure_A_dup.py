import yaml, collections
D='/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/'
y=yaml.safe_load(open(D+'icu-liver-failure.yaml'))
ws=y['words']
byko=collections.defaultdict(list)
for w in ws: byko[w['ko']].append(w['en'])
print('dup ko', {k:v for k,v in byko.items() if len(v)>1})
en={w['en'].lower():w['id'] for w in ws}; ko={w['ko']:w['id'] for w in ws}
for w in ws:
    for d in w['distractorsEn']:
        if d.lower() in en: print('dEn=bank', w['id'], d, en[d.lower()])
    for d in w['distractorsKo']:
        if d in ko: print('dKo=bank', w['id'], d, ko[d])
sents={}
for i,s in enumerate(y['situations']):
    for j,t in enumerate(s['sentences']): sents[t['en']]=f'{i}.{j}'
for w in ws:
    k=sents.get(w['example'])
    if k in ['2.0','2.2','2.5','4.3','5.3','6.2','6.4','7.0','7.3','7.4','7.5','8.3','8.4','11.1','11.3','11.4','12.1','12.5','13.1','13.4','13.5','14.3','14.4','14.5','15.0','15.4','16.4','17.0','17.5','18.1','18.3','19.1','19.3','19.4','9.3']:
        print('ex', w['id'], k)
