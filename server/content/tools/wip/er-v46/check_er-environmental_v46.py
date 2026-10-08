import yaml, re
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
o=yaml.safe_load(open(D+'er-environmental.yaml'))
mode=__import__('sys').argv[1]
for s in o['situations']:
    print('\n##',s['title'])
    if mode=='blank':
        for j,x in enumerate(s['sentences']):
            b=x['blank']; a=b['answer']
            for opt in b['options']:
                print(('  *' if opt['en']==a else '   '), x['en'].replace(a,'['+opt['en']+']',1))
            print()
    if mode=='ko':
        for j,x in enumerate(s['sentences']):
            print(j,x['ko'],'| A:',x['distractorsKo'][0],'| B:',x['distractorsKo'][1],'| decoy:',x['decoy'])
    if mode=='order':
        L=[l['en'] for l in s['order']['lines']]
        print('  ORDER:'); [print('   ',i+1,l, f'({len(l.split())}w)') for i,l in enumerate(L)]
        for i in range(3):
            M=L[:]; M[i],M[i+1]=M[i+1],M[i]
            print(f'  swap {i+1}<->{i+2}:'); [print('     ',m) for m in M]
