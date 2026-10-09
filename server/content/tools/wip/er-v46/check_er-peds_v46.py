import yaml,re
d=yaml.safe_load(open('er-peds.yaml'))
for si,s in enumerate(d['situations']):
    print('\n##',si,s['title'])
    for j,x in enumerate(s['sentences']):
        print(f" [{j}] ko: {x['ko']}\n     dK: {x['distractorsKo']}\n     decoy: {x['decoy']}")
        a=x['blank']['answer']
        for o in x['blank']['options']:
            print('     -',x['en'].replace(a,'['+o['en']+']',1) if True else '', '<<' if o['en']==a else '')
    L=[l['en'] for l in s['order']['lines']]
    print(' ORDER:'); [print('  ',i,l) for i,l in enumerate(L)]
    for i in range(3):
        M=L[:]; M[i],M[i+1]=M[i+1],M[i]
        print('  swap',i,i+1,'->',' / '.join(M))
    for l in L:
        if re.match(r"(If|While|Once|Until|After|In that case|Meanwhile|First|Last|And|Also|Then)\b",l) or re.search(r"\b(meanwhile|until|once|while)\b",l,re.I): print('  FLAG',l)
