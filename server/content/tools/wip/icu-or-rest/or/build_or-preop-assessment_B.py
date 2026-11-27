import yaml, glob
T = "or-preop-assessment"
D = {}
for f in sorted(glob.glob(f"data_{T}_B_*.py")):
    g = {}
    exec(open(f, encoding="utf-8").read(), g)
    D.update(g["D"])
base = yaml.safe_load(open(f"base-{T}.yaml", encoding="utf-8"))
PATCH = {}
try:
    exec(open(f"patch_{T}_B.py", encoding="utf-8").read())
except FileNotFoundError:
    pass
n = len(base["situations"])
assert len(D) == n, (len(D), n)
for i, sit in enumerate(base["situations"]):
    d = D[i]
    assert len(d["s"]) == len(sit["sentences"]) == 6, i
    for j, (x, r) in enumerate(zip(sit["sentences"], d["s"])):
        assert len(r) == 10, (i, j, r)
        tag, icon, why, decoy, d1, d2, ans, w1, w2, w3 = r
        if (i, j) in PATCH:
            w1, w2, w3 = PATCH[(i, j)]
        x["tag"] = tag; x["icon"] = icon; x["why"] = why; x["decoy"] = decoy
        x["distractorsKo"] = [d1, d2]
        x["blank"] = {"answer": ans, "options": [{"en": o} for o in (ans, w1, w2, w3)]}
    o = d["order"]; assert len(o["lines"]) == 4
    sit["order"] = {"tag": o["tag"], "icon": o["icon"], "ko": o["ko"], "why": o["why"],
        "lines": [{"en": l[0], "icon": l[1], "ko": l[2], "note": l[3]} for l in o["lines"]]}
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote", n)
