import yaml,sys,re
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
from verify_lesson_content import _ko_stems
T='or-preop-checklist'
d=yaml.safe_load(open(f'{T}.B.yaml',encoding='utf-8'))
stems=sys.argv[1:]
for si,s in enumerate(d['situations']):
    for i,x in enumerate(s['sentences']):
        mine=_ko_stems(x['ko'])
        for o in x['distractorsKo']:
            hit=[st for st in stems if st in (_ko_stems(o)-mine)]
            if hit: print(f'{si}.{i}',hit,'|',x['ko'],'|',o)
