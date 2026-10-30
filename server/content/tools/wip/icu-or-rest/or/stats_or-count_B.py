import yaml,re,collections
d=yaml.safe_load(open('or-count.yaml'))
S=[(f"{si}.{i}",x) for si,s in enumerate(d['situations']) for i,x in enumerate(s['sentences'])]
print("N",len(S))
# decoy substitution
print("=== DECOY ===")
for k,x in S:
    c=x['chunks'];dc=x['decoy']
    alts=[]
    for j,ch in enumerate(c):
        if ch=='.' : continue
        alts.append(' '.join(c[:j]+[dc]+c[j+1:]).replace(' .','.').replace(' ,',','))
    print(f"[{k}] decoy={dc!r} | chunks={c}")
# decoy words
wc=collections.Counter()
for k,x in S:
    for w in set(re.findall(r"[a-z']+",x['decoy'].lower())): wc[w]+=1
print("decoy words:",[(w,n) for w,n in wc.most_common(25) if n>=2])
# decoy shape
def shape(dc):
    t=dc.lower().split()
    if t[0] in('on','in','at','to','for','from','by','of','near','with','into','until','as'): return 'prep'
    if t[0] in('the','a','an','this','each','every','all','both','one','your','our','my','his','their'): return 'np'
    if t[0] in('i','we',"we've","i'm",'the nurse'): return 'clause'
    return 'other'
sc=collections.Counter(shape(x['decoy']) for k,x in S); print("decoy shapes:",sc)
# distractor ko only-words, stem-based crude
def toks(s):
    out=[]
    for w in re.findall(r"[가-힣A-Za-z0-9]+",s):
        w=re.sub(r"(을|를|이|가|은|는|에|에서|으로|로|와|과|도|만|의|까지|부터|마다|에는|에도|이에요|예요|해요|할게요|돼요)$","",w)
        out.append(w)
    return out
cnt=collections.Counter(); where=collections.defaultdict(list)
for k,x in S:
    base=set(toks(x['ko']))
    for dk in x['distractorsKo']:
        for w in set(toks(dk))-base:
            cnt[w]+=1; where[w].append(k)
print("=== distractor-only words >=3 ===")
for w,n in cnt.most_common():
    if n>=3: print(n,w,where[w])
# length
print("=== length ratio ===")
for k,x in S:
    L=len(x['ko'].replace(' ',''))
    ls=[len(z.replace(' ','')) for z in x['distractorsKo']]
    if min(ls)>L or max(ls)>L*1.25+0.01 and max(ls)-L>3: print(k,L,ls)
# condition/purpose markers only in distractors
mk=['려고','위해','때까지','면 ','기 전','후에','뒤에','때마다']
n=0
for k,x in S:
    for m in mk:
        if all(m in z for z in x['distractorsKo']) and m not in x['ko']:
            n+=1;print('marker-only',k,m)
print("marker-only count",n)
