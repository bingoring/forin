import yaml
a=yaml.safe_load(open('core-safety-icu.pre-fix.yaml')); b=yaml.safe_load(open('core-safety-icu.yaml'))
AW={w['id']:w for w in a['words']}; BW={w['id']:w for w in b['words']}
nw=0
for k in AW:
    if k not in BW: print('WORD-REMOVED',k); continue
    f=[x for x in AW[k] if AW[k][x]!=BW[k].get(x)]
    if f: nw+=1
print('words changed',nw, 'of', len(AW))
cs=cn=co=0
for i,(sa,sb) in enumerate(zip(a['situations'],b['situations'])):
    for k,(ta,tb) in enumerate(zip(sa['sentences'],sb['sentences'])):
        f=[x for x in ta if ta[x]!=tb[x]]
        if f: cs+=1
    for n,(xa,xb) in enumerate(zip(sa['nuance'],sb['nuance'])):
        if xa!=xb: cn+=1; print('nuance',i,n,xa['kind'],[x for x in xa if xa[x]!=xb[x]])
    oa,ob=sa['order'],sb['order']
    if oa!=ob: co+=1; print('order',i,[ (n,[x for x in la if la[x]!=lb[x]]) for n,(la,lb) in enumerate(zip(oa['lines'],ob['lines'])) if la!=lb], 'why' if oa['why']!=ob['why'] else '')
print('sentences changed',cs,'nuance',cn,'orders',co)
