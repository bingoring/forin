import yaml,re
d=yaml.safe_load(open('or-preop-checklist.B.yaml',encoding='utf-8'))
for si,s in enumerate(d['situations']):
    for i,x in enumerate(s['sentences']):
        en=x['en']; b=x['blank']; a=b['answer']
        reads=[en.replace(a,o['en']) if o['en']!=a else '*' for o in b['options']]
        print(f"{si}.{i} {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]} || decoy={x['decoy']} | pos={[o['en'] for o in b['options']].index(a)}")
        for r in reads:
            if r!='*': print('     ',r)
