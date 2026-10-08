import yaml,re,collections
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
d=yaml.safe_load(open(D+'er-ortho-trauma.yaml')); b=yaml.safe_load(open(D+'base-er-ortho-trauma.yaml'))
norm=lambda x:re.sub(r'\s+',' ',x.lower()).strip()
# 1 base unchanged outside allowed fields
assert d['words']==b['words']
for s,t in zip(d['situations'],b['situations']):
    assert s['title']==t['title']
    for x,y in zip(s['sentences'],t['sentences']):
        for k in y: assert x[k]==y[k],(s['title'],k)
    assert [n['kind'] for n in s['nuance']]==[n['kind'] for n in t['nuance']]
    for n,m in zip(s['nuance'],t['nuance']):
        for k in m:
            if n[k]!=m[k]:
                assert (n['kind']=='context' and k in('scenes','why')) or k in(), (s['title'],n['kind'],k)
        if n['kind']=='context':
            for x,y in zip(n['scenes'],m['scenes']):
                for k in y:
                    if x[k]!=y[k]: assert k in('en','fix'),(k)
cnt=collections.Counter(); cond=[]; nflag=0; probs=[]
for si,s in enumerate(d['situations']):
    print('##',si,s['title'])
    for j,t in enumerate(s['sentences']):
        bl=t['blank']; a=bl['answer']; opts=[o['en'] for o in bl['options']]
        assert len(opts)==4 and len(set(opts))==4 and a in opts and all(set(o)=={'en'} for o in bl['options'])
        assert len(re.findall(r'(?<![\w\'-])'+re.escape(a)+r'(?![\w-])',t['en']))==1,(t['en'],a)
        assert len(t['tag'])<=10 and t['why'] and t['icon']
        assert t['decoy'] not in t['chunks'] and t['decoy'].lower() not in t['en'].lower()
        assert len(t['distractorsKo'])==2 and len(set(t['distractorsKo']))==2 and t['ko'] not in t['distractorsKo']
        print(f" [{j}] ko:{t['ko']}")
        for o in opts:
            m=re.search(r"\b(a|an)\s+"+re.escape(a)+r"(?![\w-])",t['en'],re.I)
            if m:
                art=m.group(1).lower(); need='an' if o[0].lower() in 'aeiou' else 'a'
                if art!=need: print('     !!ARTICLE',art,o,'|',t['en'])
        for o in sorted(opts,key=lambda x:x!=a):
            print('    ','*' if o==a else ' ',re.sub(r'(?<![\w\'-])'+re.escape(a)+r'(?![\w-])',o,t['en'],count=1))
        print('     DK:',t['distractorsKo'],'| decoy:',t['decoy'])
        for k in t['distractorsKo']:
            if re.search(r'안 |못 |절대|않|말고|말아|마세요',k): print('     !!DKneg',k)
        cnt[tuple(sorted(opts))]+=1
        if any(x in ' '.join(opts).lower() for x in('hungry','thirsty','sleepy','seconds','hours','days','minutes')): print('     !!optflag')
    o=s['order']; L=[l['en'] for l in o['lines']]
    assert len(L)==4 and len(set(L))==4 and o['ko'] and o['why'] and all(l['icon'] for l in o['lines'])
    for l in L:
        assert len(l.split())<=15,l
        if re.match(r"(If so|If it does|If not|In that case|If any of those|While|Once|Until|After\b|Then|And|Also)",l): cond.append((si,l))
    for k in range(3):
        M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',k+1,'|',' / '.join(M))
    for n in s['nuance']:
        if n['kind']=='context':
            w=n['word'].lower(); sc=n['scenes']; bad=[x for x in sc if not x['ok']][0]
            ens=[norm(x['en']) for x in sc]
            assert norm(bad['fix']) not in ens
            print('  CTX',w,'ko',n['ko'])
        if n['kind']=='swap': assert n['ko'] and not n['ko'].endswith('전해야 해요'); print('  SWAPKO',n['ko'])
print('cond',cond)
print('dup option sets',[k for k,v in cnt.items() if v>1])
