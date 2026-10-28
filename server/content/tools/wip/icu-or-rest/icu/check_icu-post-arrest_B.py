import re, yaml, collections
d = yaml.safe_load(open("icu-post-arrest.B.yaml", encoding="utf-8"))
dec = collections.Counter(); bw = collections.Counter(); st = collections.Counter(); words = collections.Counter()
def stems(t): return {k[:2] if len(k) >= 2 else k for k in re.findall(r"[가-힣]+", t)}
rows = []
for i, s in enumerate(d["situations"]):
    for j, x in enumerate(s["sentences"]):
        dec[x["decoy"].lower()] += 1
        for o in x["blank"]["options"]:
            if o["en"] != x["blank"]["answer"]: bw[o["en"].lower()] += 1
        mine = stems(x["ko"])
        for dk in x["distractorsKo"]:
            for t in stems(dk) - mine: st[t] += 1
        rows.append(f"{i}.{j} | {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}")
print("decoy>=3", [(k,v) for k,v in dec.items() if v>=3])
print("blankwrong>=3", [(k,v) for k,v in bw.items() if v>=3])
print("stems>=4", [(k,v) for k,v in st.most_common() if v>=4])
open("/private/tmp/claude-501/-Users-ywyeom-private-forin/4f761496-057c-44fb-9edf-c2b06d77c247/scratchpad/postarrest_rows.txt","w").write("\n".join(rows))
