import yaml,re,sys,collections
sys.path.insert(0,"/Users/ywyeom/private/forin/server/content/tools")
import verify_lesson_content as v
d=yaml.safe_load(open("icu-gi-bleed.yaml",encoding="utf-8"))
occ=collections.defaultdict(list)
for i,s in enumerate(d["situations"]):
    for j,x in enumerate(s["sentences"]):
        mine=v._ko_stems(x["ko"])
        for k,dk in enumerate(x["distractorsKo"]):
            for st in v._ko_stems(dk)-mine: occ[st].append(f"{i}.{j}.{k}")
for st,o in sorted(occ.items(),key=lambda a:-len(a[1]))[:40]:
    print(len(o),st,o if len(o)>=4 else "")
# raw-token pattern counts (endings/markers)
pat=collections.Counter()
for s in d["situations"]:
    for x in s["sentences"]:
        for dk in x["distractorsKo"]:
            for m in ["려고","하면","으면","면 ","전엔","직전","앞서","이전에","후에","뒤에","나면","마치면","끝나면","오면","부터","직후"]:
                if m in dk and m not in x["ko"]: pat[m]+=1
print(pat)
