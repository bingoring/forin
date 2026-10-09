import yaml,re
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
o=yaml.safe_load(open(D+'er-fever-infection.yaml'))
b=yaml.safe_load(open(D+'base-er-fever-infection.yaml'))
print('--- BLANK lines')
for si,s in enumerate(o['situations']):
    for j,x in enumerate(s['sentences']):
        for op in x['blank']['options']:
            t=re.sub(r'\b'+re.escape(x['blank']['answer'])+r'\b',op['en'],x['en'],count=1)
            m='*' if op['en']==x['blank']['answer'] else ' '
            print(f"{si}.{j}{m} {t}")
print('--- DECOY assembled')
for si,s in enumerate(o['situations']):
    for j,x in enumerate(s['sentences']):
        print(si,j,'decoy:',x['decoy'],'| in en?',x['decoy'].lower() in x['en'].lower(),'| ==chunk?',x['decoy'] in x['chunks'])
print('--- DKO')
for si,s in enumerate(o['situations']):
    for j,x in enumerate(s['sentences']):
        print(f"{si}.{j} KO: {x['ko']}\n      X1: {x['distractorsKo'][0]}\n      X2: {x['distractorsKo'][1]}")
print('--- ORDER swaps')
for si,s in enumerate(o['situations']):
    L=[l['en'] for l in s['order']['lines']]
    print(f"## {si} {s['title']}")
    for i,l in enumerate(L): print('  ',i+1,l)
    for i in range(3):
        M=L[:]; M[i],M[i+1]=M[i+1],M[i]
        print(f"   swap{i+1}{i+2}:",' / '.join(x[:48] for x in M))
    for l in L:
        if re.match(r'^(If|In that case|While|Once|Until|After|Meanwhile|And|Also|Then)\b',l) or re.search(r'\b(meanwhile|while|once|until)\b',l,re.I): print('   !COND',l)
print('--- CTX')
for si,s in enumerate(o['situations']):
    for n in s['nuance']:
        if n['kind']=='context':
            print(si,n['word'],n['ko']); [print('    ',sc['ok'],sc['en']) for sc in n['scenes']]
        if n['kind']=='swap': print(si,'swap ko',n['ko'])
print('--- base preserved')
for sb,so in zip(b['situations'],o['situations']):
    for xb,xo in zip(sb['sentences'],so['sentences']):
        for k,v in xb.items(): assert xo[k]==v
    assert len(sb['nuance'])==len(so['nuance'])
    for nb,no in zip(sb['nuance'],so['nuance']):
        for k,v in nb.items():
            if k not in('scenes','why'): assert no[k]==v,(k)
print('ok')
