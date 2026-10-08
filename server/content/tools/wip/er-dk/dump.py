import yaml,sys,re
t=sys.argv[1]
d=yaml.safe_load(open(f'base-er-{t}.yaml'))
for i,s in enumerate(d['situations']):
    print(f"## {i} {s.get('title')}")
    for j,x in enumerate(s['sentences']):
        n=len(re.sub(r'\s','',x['ko']))
        print(f"{i}.{j} [{n}] {x['en']} | {x['ko']}")
