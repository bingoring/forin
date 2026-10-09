import yaml,re,collections
d=yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-genitourinary.yaml'))
b=yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/base-er-genitourinary.yaml'))
nsent=0;cnt=collections.Counter();dec=collections.Counter();ks=collections.Counter();nord=0;nctx=0;nsw=0
for s,t in zip(d['situations'],b['situations']):
    assert s['nuance'][0:0]==[] and [n['kind'] for n in s['nuance']]==[n['kind'] for n in t['nuance']]
    for a,c in zip(s['sentences'],t['sentences']):
        for k in ('en','ko','chunks','words','goal'): assert a[k]==c[k]
        nsent+=1
        for k in('tag','icon','why','decoy','distractorsKo','blank'): assert a.get(k),(s['title'],k)
        ans=a['blank']['answer']
        for o in a['blank']['options']:
            line=re.sub(r'(?i)(?<![\w-])'+re.escape(ans)+r'(?![\w-])',o['en'],a['en'],count=1)
            for m in re.finditer(r'\b(a|an) (\w+)',line):
                art,w=m.groups(); v=w[0].lower() in 'aeiou' or w.lower() in('mri','x','ecg'.upper().lower()) and False
                v=w[0].lower() in 'aeiou' or w.lower().startswith(('mri','x-ray','eeg','ecg'))
                if (art=='an')!=v and w.lower() not in('hour',): print('ARTICLE',s['title'],line)
        dec[a['decoy']]+=1
        for k in a['distractorsKo']:
            if re.search(r'안 |못 |절대|않',k): print('NEG?',k)
    ords=[x for x in s['nuance'] if x['kind']=='context']
    for n in ords:
        nctx+=1; assert n['word'] and n['ko']
        bad=[x for x in n['scenes'] if not x['ok']]; assert len(bad)==1
    for n in s['nuance']:
        if n['kind']=='swap': nsw+=1; assert n['ko']
    nord+=1; assert len(s['order']['lines'])==4
    for l in s['order']['lines']:
        if re.match(r"(If |While|Once|Until|After|First|Last|Then|And|Also|Because|Going|In that|Next)",l['en']): print('ORDLEAD',s['title'],l['en'])
print('sentences',nsent,'orders',nord,'ctx',nctx,'swap',nsw)
print('dup decoys',[k for k,v in dec.items() if v>1])
