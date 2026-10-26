#!/usr/bin/env python3
import sys, re, yaml, collections
sys.path.insert(0, "/Users/ywyeom/private/forin/server/content/tools")
import verify_lesson_content as v
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
b = yaml.safe_load(open(f"{D}/icu-airway.B.yaml", encoding="utf-8"))
L = lambda t: len(re.sub(r"\s", "", t))
mode = sys.argv[1] if len(sys.argv) > 1 else "sum"
ko_only = collections.Counter(); where = collections.defaultdict(list)
dec = collections.Counter(); bw = collections.Counter()
for si, s in enumerate(b["situations"]):
    for j, x in enumerate(s["sentences"]):
        ko = x["ko"]; d = x["distractorsKo"]
        if mode == "dump":
            print(f"{si}.{j} {ko} | {d[0]} | {d[1]}  [{L(ko)} {L(d[0])} {L(d[1])}] min<=ko:{min(L(d[0]),L(d[1]))<=L(ko)}")
        if min(L(d[0]), L(d[1])) > L(ko): print("LONGER-BOTH", si, j)
        mine = v._ko_stems(ko)
        for o in d:
            for st in v._ko_stems(o) - mine:
                ko_only[st] += 1; where[st].append(f"{si}.{j}")
        dec[x["decoy"].lower()] += 1
        for o in x["blank"]["options"]:
            if o["en"] != x["blank"]["answer"]: bw[o["en"].lower()] += 1
        if mode == "blank":
            ans = x["blank"]["answer"]
            print(f"{si}.{j} {x['en']}")
            for o in x["blank"]["options"]:
                print("    ", x["en"].replace(ans, "___") .replace("___", o["en"]) , "<--" if o["en"] == ans else "")
print("top stems", ko_only.most_common(10))
print("decoy>2", [k for k, c in dec.items() if c > 2], "blankwrong>2", [(k, c) for k, c in bw.items() if c > 2])
if mode == "order":
    for si, s in enumerate(b["situations"]):
        print(si, [l["en"] for l in s["order"]["lines"]])
