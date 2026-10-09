import yaml,sys,re,collections
P=["에서","에게","한테","께서","으로","까지","부터","보다","처럼","이랑","랑","을","를","은","는","이","가","에","의","와","과","도","로","만","께","나","요"]
def stem(t):
    t=re.sub(r'[^\w]','',t)
    for p in sorted(P,key=len,reverse=True):
        if t.endswith(p) and len(t)>len(p)+1: return t[:-len(p)]
    return t
def toks(s): return {stem(t) for t in s.split() if stem(t)}
Q={'언제','어디','누가','누구','무엇','어디서','얼마나','몇','언제인가요','어떻게'}
t=sys.argv[1]
d=yaml.safe_load(open(f'base-er-{t}.yaml'))
c=collections.Counter(); where=collections.defaultdict(list)
sub=collections.Counter()
KW=['설명','가족','의사','어제','부모님','기록','확인','사진','약사','어디서','차트','알려','물어','적어','동료','보호자']
for si,s in enumerate(d['situations']):
    for xi,x in enumerate(s['sentences']):
        ck=toks(x['ko']); ckj=x['ko']
        for k,o in enumerate(x['distractorsKo']):
            for w in toks(o)-ck:
                c[w]+=1; where[w].append(f'{si}.{xi}d{k+1}')
            for w in KW:
                if w in o and w not in ckj: sub[w]+=1
print(t,'TOP',[(w,n) for w,n in c.most_common(15)])
print(' over5:',[(w,n) for w,n in c.items() if n>(7 if (w in Q or re.fullmatch(r'\d+\w*',w)) else 5)])
print(' SUB',dict(sub))
for w in sys.argv[2:]: print(w,where[w])
