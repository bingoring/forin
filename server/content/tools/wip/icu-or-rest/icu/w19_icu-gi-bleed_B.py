import yaml,re,sys,collections
sys.path.insert(0,"/Users/ywyeom/private/forin/server/content/tools")
import verify_lesson_content as v
d=yaml.safe_load(open("icu-gi-bleed.B.yaml",encoding="utf-8"))
occ=collections.defaultdict(list)
for i,s in enumerate(d["situations"]):
    for j,x in enumerate(s["sentences"]):
        mine=v._ko_stems(x["ko"])
        for k,dk in enumerate(x["distractorsKo"]):
            for st in v._ko_stems(dk)-mine: occ[st].append((i,j,k))
over={st:o for st,o in occ.items() if len(o)>(7 if v._KO_QUESTION_OR_NUMBER.match(st) else 5)}
print(len(over),"over-cap stems:", {k:len(o) for k,o in sorted(over.items(),key=lambda a:-len(a[1]))})
if "-v" in sys.argv:
    for st,o in sorted(over.items(),key=lambda a:-len(a[1])):
        print(st, [f"{i}.{j}.{k}" for i,j,k in o])
