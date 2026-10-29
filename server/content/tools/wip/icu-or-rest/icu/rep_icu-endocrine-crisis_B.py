import yaml,re,sys,collections
f=sys.argv[1] if len(sys.argv)>1 else 'icu-endocrine-crisis.yaml'
d=yaml.safe_load(open(f))
P=['께서','에게','에서','으로','이랑','까지','부터','처럼','이나','께','가','이','을','를','은','는','도','만','에','로','랑','와','과','의','나']
E=['하고 있어요','하고','했어요','해요','할게요','해','할','하는','하면','하려고','해서','해야','하니까','하면서','합니다']
def stem(w):
    w=re.sub(r'[,.?!—]','',w)
    for p in sorted(P,key=len,reverse=True):
        if w.endswith(p) and len(w)>len(p)+1: return w[:-len(p)]
    return w
PERS=['동료','선배','후배','의사','주치의','전문의','레지던트','당직의','담당의','책임자','야간조','주간조','교대자','전담자','팀장','팀장님','과장','교수','인턴','사수','선임','수간호사','원장님','약사님','친구','병동','담당','제가']
cnt=collections.Counter(); where=collections.defaultdict(list); subj=[]
for si,s in enumerate(d['situations']):
  for i,x in enumerate(s['sentences']):
    ko=set(stem(w) for w in x['ko'].split())
    ss=0
    for k,dk in enumerate(x['distractorsKo']):
      new=set(stem(w) for w in dk.split())-ko
      for w in new: cnt[w]+=1; where[w].append(f"{si}.{i}X{k+1}")
      if any(stem(w) in PERS for w in dk.split() if stem(w) not in ko): ss+=1
    if ss: subj.append((f"{si}.{i}",ss))
print("subject-swap sentences:",len(subj), "both X:",sum(1 for _,n in subj if n==2))
print(' '.join(f"{a}({n})" for a,n in subj))
for w,c in cnt.most_common(40):
  if c>=3: print(c,w,where[w])
