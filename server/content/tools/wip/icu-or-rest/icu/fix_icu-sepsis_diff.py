import yaml
a=yaml.safe_load(open('icu-sepsis.pre-fix.yaml',encoding='utf-8')); b=yaml.safe_load(open('icu-sepsis.yaml',encoding='utf-8'))
aw={w['id']:w for w in a['words']}; bw={w['id']:w for w in b['words']}
print('REMOVED',set(aw)-set(bw))
n=0
for i,w in bw.items():
    for k,v in w.items():
        if aw[i][k]!=v: n+=1; print('W',i,k,'|',aw[i][k],'=>',v)
for si,(x,y) in enumerate(zip(a['situations'],b['situations'])):
    for i,(s,t) in enumerate(zip(x['sentences'],y['sentences'])):
        for k in t:
            if s[k]!=t[k] and k!='blank': n+=1; print(f'S{si}.{i}',k,'|',s[k],'=>',t[k])
            if k=='blank' and s[k]!=t[k]: n+=1
    for i,(s,t) in enumerate(zip(x['nuance'],y['nuance'])):
        for k in t:
            if s[k]!=t[k]: print(f'N{si}.{i}',k,'|',s[k],'=>',t[k])
    for k in y['order']:
        if k=='lines':
            for j,(s,t) in enumerate(zip(x['order'][k],y['order'][k])):
                if s!=t: print(f'O{si}.L{j}',s,'=>',t)
        elif x['order'][k]!=y['order'][k]: print(f'O{si}',k,'|',x['order'][k],'=>',y['order'][k])
