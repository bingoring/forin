import yaml,re
d=yaml.safe_load(open("icu-gi-bleed.B.yaml",encoding="utf-8"))
L=lambda t:len(re.sub(r"\s","",t))
for i,s in enumerate(d["situations"]):
    for j,x in enumerate(s["sentences"]):
        print(f"{i}.{j} [{L(x['ko'])}] {x['ko']}\n   ({L(x['distractorsKo'][0])}) {x['distractorsKo'][0]}\n   ({L(x['distractorsKo'][1])}) {x['distractorsKo'][1]}")
