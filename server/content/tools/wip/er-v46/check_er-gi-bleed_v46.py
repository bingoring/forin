import yaml,re,collections
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
d=yaml.safe_load(open(D+'er-gi-bleed.yaml'))
b=yaml.safe_load(open(D+'base-er-gi-bleed.yaml'))
for s,t in zip(d['situations'],b['situations']):
    assert [n['kind'] for n in s['nuance']]==[n['kind'] for n in t['nuance']]
cnt=collections.Counter(); flags=[]
COND=r"(If so|If it does|If not|In that case|If any of those|While|Once|Until|After (the|that|it|we)|When (it|that|they))"
for si,s in enumerate(d['situations']):
    print('##',si,s['title'])
    for j,t in enumerate(s['sentences']):
        a=t['blank']['answer']; print(f" [{j}] ko:{t['ko']}")
        for o in sorted(t['blank']['options'],key=lambda x:x['en']!=a):
            sub=re.sub(r'(?i)(?<![\w-])'+re.escape(a)+r'(?![\w-])',o['en'],t['en'],count=1)
            print('    ',('*' if o['en']==a else ' '),sub)
            if re.search(r'\ba [aeiou]|\ban [^aeiouAEIOU\W]',sub): flags.append(('article',si,j,sub))
        print('     DK:',t['distractorsKo'],'| decoy:',t['decoy'])
        for dk in t['distractorsKo']:
            if re.search(r'안 |못 |절대|않|말고',dk) or dk[:6]==t['ko'][:6]: flags.append(('dk',si,j,dk))
        cnt[tuple(sorted(o['en'] for o in t['blank']['options']))]+=1
        for k in ('tag','icon','why'): assert t[k]
        assert len(t['tag'])<=10,(si,j,t['tag'])
    L=[l['en'] for l in s['order']['lines']]
    for k in range(3):
        M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',k+1,'|',' / '.join(M))
    for l in L:
        if re.match(COND,l): flags.append(('cond',si,l))
        if len(l.split())>15: flags.append(('long',si,l))
    for n in s['nuance']:
        if n['kind']=='context':
            w=n['word']
            stems=[re.sub(r"(e|es|s|ed|ing|y|ies|ied)$","",t) or t for t in re.findall(r"[a-z0-9]+",w.lower())]
            def has(en):
                toks=re.findall(r"[a-z0-9]+",en.lower())
                return all(any(tk.startswith(st) or (len(st)>=4 and st in tk) for tk in toks) for st in stems)
            print('  CTX',w,[has(x['en']) for x in n['scenes']])
            for x in n['scenes']: print('     ',x['ok'],x['en'],'|',x.get('fix',''))
            print('     why:',n['why'])
            if not all(has(x['en']) for x in n['scenes']): flags.append(('ctx',si,w))
print('FLAGS'); [print(' ',f) for f in flags]
print('dup option sets',[k for k,v in cnt.items() if v>1])
