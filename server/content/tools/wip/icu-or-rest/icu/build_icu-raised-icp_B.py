import yaml, importlib
T = "icu-raised-icp"
base = yaml.safe_load(open(f"base-{T}.yaml", encoding="utf-8"))
data = {}
for n in (1, 2, 3, 4):
    for title, rows, order in importlib.import_module(f"addB_raised-icp_{n}").D:
        assert title not in data, title
        data[title] = (rows, order)
miss = [s["title"] for s in base["situations"] if s["title"] not in data]
assert not miss, miss
for sit in base["situations"]:
    rows, o = data[sit["title"]]
    assert len(rows) == len(sit["sentences"]), sit["title"]
    for x, r in zip(sit["sentences"], rows):
        assert len(r) == 10, (sit["title"], r)
        tag, icon, why, decoy, d1, d2, ans, w1, w2, w3 = r
        x["tag"] = tag; x["icon"] = icon; x["why"] = why; x["decoy"] = decoy
        x["distractorsKo"] = [d1, d2]
        x["blank"] = {"answer": ans, "options": [{"en": q} for q in (ans, w1, w2, w3)]}
    assert len(o["lines"]) == 4
    sit["order"] = {"tag": "대화 흐름", "icon": "compass", "ko": o["ko"], "why": o["why"],
        "lines": [{"en": l[0], "icon": l[1], "ko": l[2], "note": l[3]} for l in o["lines"]]}
from fixB_icu_raised_icp_1 import F
for k,v in F.items():
    i,j=map(int,k.split("."))
    x=base["situations"][i]["sentences"][j]
    if "d" in v: x["distractorsKo"]=v["d"]
    if "decoy" in v: x["decoy"]=v["decoy"]
    if "blank" in v: x["blank"]={"answer":v["blank"][0],"options":[{"en":q} for q in v["blank"]]}
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote")
