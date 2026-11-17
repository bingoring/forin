import yaml, glob, re, collections
T="or-preop-assessment"
D={}
for f in sorted(glob.glob(f"data_{T}_B_*.py")):
    g={}; exec(open(f,encoding="utf-8").read(),g); D.update(g["D"])
base=yaml.safe_load(open(f"base-{T}.yaml",encoding="utf-8"))
L=lambda s:len(s.replace(" ",""))
bad=0
dec=collections.Counter(); wr=collections.Counter(); stems=collections.Counter()
for i,sit in enumerate(base["situations"]):
    if i not in D: continue
    for j,(x,r) in enumerate(zip(sit["sentences"],D[i]["s"])):
        tag,icon,why,decoy,d1,d2,ans,w1,w2,w3=r
        en=x["en"]; ko=x["ko"]
        n=len(re.findall(r"(?<![A-Za-z'])"+re.escape(ans)+r"(?![A-Za-z'])",en))
        if n!=1: print("ANS",i,j,ans,n); bad+=1
        if len(tag)>10: print("TAG",i,j); bad+=1
        if decoy in x["chunks"] or decoy.lower() in en.lower(): print("DECOY",i,j,decoy); bad+=1
        for d in (d1,d2):
            ok = L(d)<=1.25*L(ko) and L(d)>=L(ko)/1.25 or abs(L(d)-L(ko))<=3
            if not ok: print("LEN",i,j,L(ko),L(d),d); bad+=1
        if min(L(d1),L(d2))>L(ko): print("ONE<=ans",i,j,L(ko),L(d1),L(d2)); bad+=1
        dec[decoy]+=1
        for w in (w1,w2,w3): wr[w.lower()]+=1
        kw=set(re.findall(r"[가-힣]+",ko))
        kstem={w[:2] for w in kw}
        for d in (d1,d2):
            for w in set(re.findall(r"[가-힣]+",d)):
                if w[:2] not in kstem: stems[w[:2]]+=1
        print(f"{i}.{j} {ko} | {d1} | {d2}")
print("bad",bad)
print("decoy>1",[k for k,v in dec.items() if v>1])
print("wrong>2",[(k,v) for k,v in wr.items() if v>2])
print("stems top",stems.most_common(12))
