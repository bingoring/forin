import yaml,sys,re,collections
t=sys.argv[1]
d=yaml.safe_load(open(f'/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-{t}.yaml'))
ws=sys.argv[2:] 
for w in ws:
    l=[]
    for si,s in enumerate(d['situations']):
        for xi,x in enumerate(s['sentences']):
            for k,o in enumerate(x['distractorsKo']):
                if re.search(w,o) and not re.search(w,x['ko']): l.append(f'{si}.{xi}d{k+1}')
    print(w,len(l),l)
