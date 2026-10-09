import yaml,sys,re,collections
t=sys.argv[1]
d=yaml.safe_load(open(f'/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-{t}.yaml'))
pats={'확인':r'확인','기록':r'기록','적다':r'적(어|으|고|혀|는|은|을|지)|써 |쓰(고|세|는)','메모':'메모','사진':'사진','설명':'설명','알려':'알려|말씀드','전화':'전화|문자'}
c=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for xi,x in enumerate(s['sentences']):
        for k,o in enumerate(x['distractorsKo']):
            for n,p in pats.items():
                if re.search(p,o): c[n].append((si,xi,k+1,bool(re.search(p,x['ko']))))
for n,l in c.items(): print(n,len(l),'new-only',sum(1 for a in l if not a[3]),[a[:3] for a in l if not a[3]])
