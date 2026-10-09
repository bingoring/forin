import yaml,sys,re
d=yaml.safe_load(open(f'/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-{sys.argv[1]}.yaml'))
pat=sys.argv[2]
for s in d['situations']:
    for x in s['sentences']:
        for o in x['distractorsKo']:
            if re.search(pat,o) and not re.search(pat,x['ko']): print(x['ko'],'|',o)
