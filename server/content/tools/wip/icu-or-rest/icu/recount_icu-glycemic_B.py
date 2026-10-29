import yaml,re,collections,sys
sys.path.insert(0,'.')
from newko_icu_glycemic_B import NEW
d=yaml.safe_load(open('icu-glycemic.yaml'))
P=['에게도','에서는','으로는','에게','에서','으로','까지','부터','처럼','마다','보다','하고','과','와','을','를','이','가','은','는','도','만','에','의','로','엔']
def stem(w):
    w=re.sub(r'[.,?!—·\-]','',w)
    for p in P:
        if w.endswith(p) and len(w)>len(p): return w[:-len(p)]
    return w
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        key=f"{si}.{j}"
        ko=x['ko']; ks=set(stem(w) for w in ko.split())
        for k,dk in enumerate(x['distractorsKo']):
            if (key,k) in NEW:
                dk=NEW[(key,k)]
                r=len(dk)/len(ko)
                flag='' if (r<=1.25 or abs(len(dk)-len(ko))<=3) else ' **LEN**'
                if dk==ko or dk==x['distractorsKo'][1-k] : flag+=' **DUP**'
                print(f"{key} X{k+1} {len(dk)}/{len(ko)} {r:.2f}{flag}  {dk}")
            seen=set()
            for w in dk.split():
                st=stem(w)
                if st and st not in ks and st not in seen:
                    seen.add(st); cnt[st]+=1; where[st].append(f"{key}X{k+1}")
print('---')
for w,c in cnt.most_common(25): print(c,w,' '.join(where[w]))
print('--- length rule (min<=ko) & ratio, all sentences after NEW')
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        key=f"{si}.{j}"; ko=x['ko']
        xs=[NEW.get((key,k),dk) for k,dk in enumerate(x['distractorsKo'])]
        bad=[]
        if min(len(a) for a in xs)>len(ko): bad.append('MIN>KO')
        for a in xs:
            if not (len(a)/len(ko)<=1.25 or abs(len(a)-len(ko))<=3): bad.append('RATIO')
        if bad: print(key,bad,len(ko),[len(a) for a in xs], '(changed)' if any((key,k) in NEW for k in (0,1)) else '(orig)')
