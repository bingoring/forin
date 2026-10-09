import yaml,re,sys
y=yaml.safe_load(open('er-alcohol-withdrawal.yaml'))
mode=sys.argv[1]
for si,s in enumerate(y['situations']):
    if mode=='blank':
        print('##',si,s['title'])
        for j,x in enumerate(s['sentences']):
            for o in x['blank']['options']:
                print('  ',o['en']==x['blank']['answer'] and '*' or ' ', x['en'].replace(x['blank']['answer'],'['+o['en']+']'))
            print('   decoy:',x['decoy'],'| chunks:',x['chunks'])
    if mode=='ko':
        print('##',si,s['title'])
        for j,x in enumerate(s['sentences']):
            print(' ',j,x['ko'],'  ||  ',x['distractorsKo'])
    if mode=='order':
        L=[l['en'] for l in s['order']['lines']]
        print('##',si,s['title'])
        for i,l in enumerate(L): print('  ',i+1,l)
        for i in range(3):
            M=L[:]; M[i],M[i+1]=M[i+1],M[i]
            print('  swap',i+1,i+2,'->',' / '.join(M[i:i+2]))
        for l in L:
            if re.match(r'(If|In that|While|Once|Until|After|Meanwhile)',l) or re.search(r'\b(while|once|until|meanwhile|if)\b',l,re.I): print('  COND:',l)
