import yaml,sys
a=yaml.safe_load(open('core-safety-or.pre-fix.yaml'));b=yaml.safe_load(open('core-safety-or.yaml'))
out=[]
def lab(p): return p
def walk(x,y,p,ctx):
    if isinstance(x,dict) and isinstance(y,dict):
        for k in list(x)+[k for k in y if k not in x]:
            if k not in x: out.append(f'{ctx}{p}/{k}: (없음) -> {y[k]!r}')
            elif k not in y: out.append(f'{ctx}{p}/{k}: {x[k]!r} -> (삭제)')
            else: walk(x[k],y[k],p+'/'+str(k),ctx)
    elif isinstance(x,list) and isinstance(y,list) and len(x)==len(y):
        for i,(u,v) in enumerate(zip(x,y)): walk(u,v,p+f'[{i}]',ctx)
    elif x!=y: out.append(f'{ctx}{p}: {x!r} -> {y!r}')
wa={w['id']:w for w in a['words']}; wb={w['id']:w for w in b['words']}
assert list(wa)==list(wb)
for i in wa: walk(wa[i],wb[i],'','단어 '+i+' ')
for si,(sa,sb) in enumerate(zip(a['situations'],b['situations'])):
    for j,(x,y) in enumerate(zip(sa['sentences'],sb['sentences'])): walk(x,y,'',f'S{si}.{j} ')
    for k,(x,y) in enumerate(zip(sa['nuance'],sb['nuance'])): walk(x,y,'',f'S{si} nuance[{k}]({x["kind"]}) ')
    walk(sa['order'],sb['order'],'',f'S{si} order ')
open('_fixcheck_core-safety-or.txt','w').write('\n'.join(out)+'\n'); print(len(out))
