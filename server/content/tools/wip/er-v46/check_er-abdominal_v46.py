import yaml,re,collections
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
d=yaml.safe_load(open(D+'er-abdominal.yaml')); b=yaml.safe_load(open(D+'base-er-abdominal.yaml'))
assert d['words']==b['words']
cnt=collections.Counter(); cond=[]; neg=[]; sets=collections.Counter()
for s,t in zip(d['situations'],b['situations']):
    assert [n['kind'] for n in s['nuance']]==[n['kind'] for n in t['nuance']]
    for x,y in zip(s['sentences'],t['sentences']):
        for k in y: assert x[k]==y[k],k
    for n,m in zip(s['nuance'],t['nuance']):
        for k in m:
            if k=='scenes':
                for sc,sm in zip(n[k],m[k]):
                    for kk in ('who','icon','ok','tone'): assert sc.get(kk)==sm.get(kk),kk
            elif k not in('why',): assert n[k]==m[k],k
for si,s in enumerate(d['situations']):
    print('##',si,s['title'])
    for j,t in enumerate(s['sentences']):
        a=t['blank']['answer']; print(f" [{j}] ko:{t['ko']}")
        assert len(re.findall(r'(?<![\w-])'+re.escape(a)+r'(?![\w-])',t['en']))==1,(si,j)
        for o in sorted(t['blank']['options'],key=lambda x:x['en']!=a):
            print('    ',('*' if o['en']==a else ' '), re.sub(r'(?<![\w-])'+re.escape(a)+r'(?![\w-])',o['en'],t['en'],count=1))
        print('     DK:',t['distractorsKo'],'| decoy:',t['decoy'],'| tag',t['tag'])
        assert len(t['tag'])<=10
        for k in t['distractorsKo']:
            if re.search(r'안 |못|절대|않',k): neg.append((si,j,k))
        sets[tuple(sorted(o['en'] for o in t['blank']['options']))]+=1
        assert t['decoy'].lower() not in t['en'].lower()
    L=[l['en'] for l in s['order']['lines']]; assert len(L)==4 and len(set(L))==4
    for k in range(3):
        M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',k+1,'|',' / '.join(M))
    for l in L:
        if re.match(r"(If|In that case|While|Once|Until|After|And|Also|Then)\b",l): cond.append((si,l))
    for n in s['nuance']:
        if n['kind']=='context':
            w=n['word']; print('  CTX',w,[(x['ok'],x['en'],x.get('fix')) for x in n['scenes']])
print('cond',cond); print('neg',neg); print('dup option sets',[k for k,v in sets.items() if v>1])
