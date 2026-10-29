# 어간 기준 되풀이 세기(동사 활용형 묶음) — 사용: python3 repeat2_icu-raised-icp_B.py <yaml>
import yaml,re,collections,sys
d=yaml.safe_load(open(sys.argv[1]))
P=['에게도','에서는','으로는','에게','에서','으로','까지','부터','처럼','마다','보다','이랑','과','와','을','를','이','가','은','는','도','만','에','의','로','엔','랑','께']
VERB={'알리':['알려','알릴','알리','알린'],'보':['봐','볼','보','본','봅','봐야'],'살피':['살펴','살필','살피'],'재':['잴','재','잰'],
'적':['적어','적을','적으','적'],'맞추':['맞춰','맞출','맞추','맞춘'],'지키':['지켜','지킬','지키'],'두':['둘','둬','두'],'씻':['씻을','씻어','씻으','씻'],
'말하':['말할','말하','말해'],'부르':['부르','불러','부를'],'정하':['정할','정해','정하'],'챙기':['챙길','챙겨','챙기'],'묻':['물어','물을','묻']}
INV={v:k for k,vs in VERB.items() for v in vs}
END=sorted(['하려고','하면서','할게요','하세요','했어요','해요','하고','하면','하기','하는','한','할','해','려고','려면','면서','게요','세요','어요','아요','고','면','서','는','은','을','요','야','지'],key=len,reverse=True)
def stem(w):
    w=re.sub(r'[.,?!—·\-]','',w)
    for p in P:
        if w.endswith(p) and len(w)>len(p): w=w[:-len(p)];break
    if w in INV: return INV[w]
    for e in END:
        if w.endswith(e) and len(w)>len(e):
            r=w[:-len(e)]
            return INV.get(r,r)
    return w
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        ks=set(stem(w) for w in x['ko'].split())
        for k,dk in enumerate(x['distractorsKo']):
            seen=set()
            for w in dk.split():
                st=stem(w)
                if st and st not in ks and st not in seen:
                    seen.add(st); cnt[st]+=1; where[st].append(f"{si}.{j}X{k+1}")
for w,c in cnt.most_common(30):
    if c>=5: print(c,w,' '.join(where[w]))
