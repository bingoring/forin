import yaml, re, collections, sys
sys.path.insert(0, "/Users/ywyeom/private/forin/server/content/tools")
import verify_lesson_content as v
d = yaml.safe_load(open("icu-nutrition.B.yaml", encoding="utf-8"))
bw = collections.defaultdict(list); dec = collections.defaultdict(list); occ = collections.defaultdict(list)
for i, s in enumerate(d["situations"]):
    for j, x in enumerate(s["sentences"]):
        a = x["blank"]["answer"]
        for o in x["blank"]["options"]:
            if o["en"] != a: bw[o["en"].lower()].append(f"{i}.{j}")
        dec[x["decoy"].lower()].append(f"{i}.{j}")
        mine = v._ko_stems(x["ko"])
        for k, dk in enumerate(x["distractorsKo"]):
            for st in v._ko_stems(dk) - mine: occ[st].append(f"{i}.{j}.{k}")
        L = [len(re.sub(r"\s", "", y)) for y in x["distractorsKo"]]
        if min(L) > len(re.sub(r"\s", "", x["ko"])): print("NOSHORT", i, j)
print("BLANK>=3:", {k: len(o) for k, o in bw.items() if len(o) >= 3})
print("DECOY>=3:", {k: o for k, o in dec.items() if len(o) >= 3})
over = {st: o for st, o in occ.items() if len(o) > (7 if v._KO_QUESTION_OR_NUMBER.match(st) else 5)}
print("W19 over:", {k: len(o) for k, o in over.items()})
if "-v" in sys.argv:
    for st, o in occ.items():
        if len(o) >= 4: print(st, o)
    for k, o in bw.items():
        if len(o) >= 3: print(k, o)
