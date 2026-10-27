import re, yaml, collections, sys
d = yaml.safe_load(open("icu-post-arrest.yaml", encoding="utf-8"))
def stems(t): return {k[:2] if len(k) >= 2 else k for k in re.findall(r"[가-힣]+", t)}
bw = collections.defaultdict(list); dec = collections.defaultdict(list); ko = collections.defaultdict(list)
L = lambda t: len(re.sub(r'\s', '', t))
for i, s in enumerate(d["situations"]):
    for j, x in enumerate(s["sentences"]):
        dec[x["decoy"].lower()].append(f"{i}.{j}")
        for o in x["blank"]["options"]:
            if o["en"] != x["blank"]["answer"]: bw[o["en"].lower()].append(f"{i}.{j}")
        mine = stems(x["ko"])
        for dk in x["distractorsKo"]:
            for t in stems(dk) - mine: ko[t].append(f"{i}.{j}")
        a = L(x['ko']); ls = [L(t) for t in x['distractorsKo']]
        if min(ls) > a: print('both-longer', i, j, a, ls)
print('blankwrong>=3', {k: v for k, v in bw.items() if len(v) >= 3})
print('decoy>=3', {k: v for k, v in dec.items() if len(v) >= 3})
print('ko-stems>=5', {k: v for k, v in ko.items() if len(v) >= 5})
