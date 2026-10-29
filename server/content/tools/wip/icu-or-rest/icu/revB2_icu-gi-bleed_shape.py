import yaml,re
d=yaml.safe_load(open("icu-gi-bleed.yaml",encoding="utf-8"))
M=re.compile(r"(려고|[가-힣]면[ ,]|전엔|전에|직전|앞서|이전|후에|직후|이후|나면|마치면|끝나면|부터)")
both=[];one=[];none=[]
for i,s in enumerate(d["situations"]):
    for j,x in enumerate(s["sentences"]):
        ko=x["ko"]+" "
        k=bool(M.search(ko))
        xs=[bool(M.search(t+" ")) for t in x["distractorsKo"]]
        tag=f"{i}.{j}"
        if all(xs) and not k: both.append(tag)
        elif any(xs) and not k: one.append(tag)
        else: none.append(tag)
print("both-marked, ko unmarked:",len(both),both)
print("one-marked:",len(one),one)
print("other:",len(none))
