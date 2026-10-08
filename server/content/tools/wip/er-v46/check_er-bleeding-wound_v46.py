import yaml,re,collections
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
d=yaml.safe_load(open(D+'er-bleeding-wound.yaml'))
base=yaml.safe_load(open(D+'base-er-bleeding-wound.yaml'))
cnt=collections.Counter(); words=lambda s:len(s.split())
cond=re.compile(r"^\s*(If so|If it does|If not|In that case|If any of those|If )",re.I)
tot=0
for si,s in enumerate(d['situations']):
    print('##',si,s['title'])
    for j,t in enumerate(s['sentences']):
        tot+=1
        for f in ('tag','icon','why','decoy','distractorsKo','blank'):
            if t.get(f): cnt[f]+=1
        a=t['blank']['answer']
        for o in sorted(t['blank']['options'],key=lambda x:x['en']!=a):
            print('   ',('*' if o['en']==a else ' '),re.sub(r'(?i)(?<![\w-])'+re.escape(a)+r'(?![\w-])',o['en'],t['en'],count=1))
        cnt['ko_dup']+= t['ko'] in t['distractorsKo']
        print('     K:',t['ko'],'|',' / '.join(t['distractorsKo']),'| decoy:',t['decoy'])
    L=[l['en'] for l in s['order']['lines']]
    for l in L:
        if cond.match(l): print('  !! COND',l)
        if words(l)>15: print('  !! LONG',l)
    for k in range(3):
        M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',k+1,'|',' / '.join(M))
    cnt['order']+=1
    for n in s['nuance']:
        if n['kind']=='context':
            w=n['word']; bad=[x for x in n['scenes'] if not x['ok']][0]['en']
            ok=re.search(r'(?<![\w])'+re.escape(w)+r'(?![\w])',bad) is not None
            print('  CTX',w,n['ko'],'IN BAD SCENE' if ok else '!! NOT IN SCENE'); cnt['ctx']+=1
        if n['kind']=='swap':
            b=n['before']; print('  SWAP',b[0]+n['answer']+b[2],'=>',n['ko']); cnt['swap']+=1
# nuance unchanged
for sb,so in zip(base['situations'],d['situations']):
    for nb,no in zip(sb['nuance'],so['nuance']):
        for k,v in nb.items():
            if nb['kind']=='context' and k in ('scenes','why'):
                if k=='scenes':
                    for xb,xo in zip(v,no[k]):
                        for kk in ('who','icon','ok'): assert xb[kk]==xo[kk]
                continue
            assert no[k]==v
print(tot,dict(cnt))
