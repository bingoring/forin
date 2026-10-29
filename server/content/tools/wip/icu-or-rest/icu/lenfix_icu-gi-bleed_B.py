import yaml,re,sys
sys.path.insert(0,"/Users/ywyeom/private/forin/server/content/tools")
import verify_lesson_content as v
d=yaml.safe_load(open("icu-gi-bleed.B.yaml",encoding="utf-8"))
L=lambda t:len(re.sub(r"\s","",t))
for i,s in enumerate(d["situations"]):
    for j,x in enumerate(s["sentences"]):
        ko=x["ko"]; ds=x["distractorsKo"]
        bad=[k for k,t in enumerate(ds) if v.length_tell(ko,t)]
        short=min(L(t) for t in ds)>L(ko)
        if bad or short:
            print(f"{i}.{j} ko[{L(ko)}] {ko}")
            for k,t in enumerate(ds): print(f"    {'X' if k in bad else ' '}({L(t)}) {t}")
