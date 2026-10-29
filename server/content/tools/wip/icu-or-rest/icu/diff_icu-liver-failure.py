import yaml
a=yaml.safe_load(open('icu-liver-failure.pre-fix.yaml')); b=yaml.safe_load(open('icu-liver-failure.yaml'))
import collections
def df(x,y,path,out):
    if isinstance(x,dict) and isinstance(y,dict):
        for k in x.keys()|y.keys(): df(x.get(k),y.get(k),path+[k],out)
    elif isinstance(x,list) and isinstance(y,list) and len(x)==len(y) and any(isinstance(i,(dict,list)) for i in x):
        for n,(p,q) in enumerate(zip(x,y)): df(p,q,path+[n],out)
    elif x!=y: out.append((path,x,y))
out=[]
WA={w['id']:w for w in a['words']}
for w in b['words']:
    df(WA[w['id']],w,['word',w['id']],out)
for i,(s,t) in enumerate(zip(a['situations'],b['situations'])):
    for j,(p,q) in enumerate(zip(s['sentences'],t['sentences'])): df(p,q,['S',f'{i}.{j}'],out)
    for n,(p,q) in enumerate(zip(s['nuance'],t['nuance'])): df(p,q,['N',i,p['kind']],out)
    df(s['order'],t['order'],['O',i],out)
cnt=collections.Counter()
for path,x,y in out:
    cnt[(path[0],path[-1] if path[0] in 'SW' else path[-1])]+=1
    print(path,'|',x,'->',y)
print('---',len(out),'changed fields; removed words',set(WA)-{w['id'] for w in b['words']})
