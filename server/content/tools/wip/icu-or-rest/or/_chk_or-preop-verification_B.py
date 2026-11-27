import yaml,re,collections,sys
T='or-preop-verification'
d=yaml.safe_load(open(f'{T}.B.yaml',encoding='utf-8'))
stems=sys.argv[1:]
for si,s in enumerate(d['situations']):
    for i,x in enumerate(s['sentences']):
        for o in x['distractorsKo']:
            for st in stems:
                if st in o and st not in x['ko']:
                    print(si,i,st,'|',x['ko'],'|',o)
