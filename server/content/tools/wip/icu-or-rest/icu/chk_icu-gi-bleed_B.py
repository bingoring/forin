import yaml, re, collections, sys
sys.path.insert(0, "/Users/ywyeom/private/forin/server/content/tools")
import verify_lesson_content as v
d = yaml.safe_load(open("icu-gi-bleed.B.yaml", encoding="utf-8"))
ko_only = collections.Counter(); dec = collections.Counter(); bw = collections.Counter()
full = "-v" in sys.argv
for i, s in enumerate(d["situations"]):
    for j, x in enumerate(s["sentences"]):
        if "blank" not in x: continue
        if full:
            print(f"{i}.{j} {x['ko']}\n    1) {x['distractorsKo'][0]}\n    2) {x['distractorsKo'][1]}")
        mine = v._ko_stems(x["ko"])
        for dk in x["distractorsKo"]:
            for st in v._ko_stems(dk) - mine: ko_only[st] += 1
            if v.length_tell(x["ko"], dk): print("LEN", i, j, dk)
        dec[x["decoy"].lower()] += 1
        a = x["blank"]["answer"]
        for o in x["blank"]["options"]:
            if o["en"] != a: bw[o["en"].lower()] += 1
        if full:
            for o in x["blank"]["options"]:
                print("    B:", x["en"].replace(a, "[" + o["en"] + "]", 1) if True else "")
        L = [len(re.sub(r"\s", "", y)) for y in x["distractorsKo"]]
        if min(L) > len(re.sub(r"\s", "", x["ko"])): print("NOSHORT", i, j)
print("ko-only >=3:", [(k, c) for k, c in ko_only.most_common() if c >= 3])
print("decoy >=3:", [(k, c) for k, c in dec.most_common() if c >= 3])
print("blankwrong >=3:", [(k, c) for k, c in bw.most_common() if c >= 3])
