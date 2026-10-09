import yaml,sys,re
t=sys.argv[1]; quiet=len(sys.argv)>2
d=yaml.safe_load(open(f'/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-{t}.yaml'))
ns=lambda s:len(re.sub(r'\s','',s))
pat={'기록':'기록','확인':'확인','적다':r'적(어|으|고|혀|는|은|을|지|습)|써 |쓰(고|세|는)','메모':'메모','사진':'사진','제가':'제가','약사':'약사'}
cnt={k:0 for k in pat}; both=0; n=0
for s in d['situations']:
    for x in s['sentences']:
        n+=1; a,b=x['distractorsKo']
        if not quiet: print(f"{x['ko']} | {a} | {b}")
        if ns(a)>ns(x['ko']) and ns(b)>ns(x['ko']): both+=1
        for k,p in pat.items():
            for o in (a,b):
                if re.search(p,o) and not re.search(p,x['ko']): cnt[k]+=1
print('sentences',n,'sidestep',cnt,'sum',sum(cnt.values()),'both-longer',both)
for s in d['situations']:
    for x in s['sentences']:
        a,b=x['distractorsKo']
        if ns(a)>ns(x['ko']) and ns(b)>ns(x['ko']): print('BOTH',ns(x['ko']),ns(a),ns(b),'|',x['ko'],'|',a,'|',b)
