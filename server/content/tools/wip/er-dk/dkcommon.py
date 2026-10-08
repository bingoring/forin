import yaml,re
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/'
def n(s): return len(re.sub(r'\s','',s))
def ok(a,b): 
    la,lb=n(a),n(b)
    return max(la,lb)<=1.25*min(la,lb) or abs(la-lb)<=3
def apply(theme,SENT,WORDS=None,BLANK=None):
    f=D+f'base-{theme}.yaml'
    d=yaml.safe_load(open(f))
    seen=set();cnt=0;bad=[]
    for s in d['situations']:
        for x in s['sentences']:
            en=x['en']
            if en not in SENT: bad.append(('MISSING',en));continue
            a,b=SENT[en]
            x['distractorsKo']=[a,b];seen.add(en);cnt+=1
            for o in (a,b):
                if not ok(o,x['ko']): bad.append(('LEN',x['ko'],o))
            if a==b or x['ko'] in (a,b): bad.append(('DUP',en))
    for k in SENT:
        if k not in seen: bad.append(('UNUSED',k))
    wc=0
    for w in d['words']:
        if WORDS and w['id'] in WORDS:
            ko,en=WORDS[w['id']]
            if ko: w['distractorsKo']=ko
            if en: w['distractorsEn']=en
            wc+=1
    bc=0
    for s in d['situations']:
        for x in s['sentences']:
            if BLANK and x['en'] in BLANK:
                bl=x['blank']; ans=bl['answer']; ds=list(BLANK[x['en']][1])
                assert len(ds)==3
                bl['options']=[{'en':ans} if o['en']==ans else {'en':ds.pop(0)} for o in bl['options']]
                bc+=1
    for b in bad: print(b)
    if any(b[0]in('MISSING','UNUSED') for b in bad): print('NOT SAVED');return
    open(f,'w').write(yaml.dump(d,allow_unicode=True,sort_keys=False,width=1000))
    print('saved',theme,'sent',cnt,'words',wc,'blanks',bc)
