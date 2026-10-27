import glob, random, yaml
T = "icu-post-arrest"
base = yaml.safe_load(open(f"base-{T}.yaml", encoding="utf-8"))
data = {}
for f in sorted(glob.glob(f"add_{T}_B_[123].yaml")):
    data.update(yaml.safe_load(open(f, encoding="utf-8")))
fix = yaml.safe_load(open(f"fixB_{T}_1.yaml", encoding="utf-8"))
orders = yaml.safe_load(open(f"add_{T}_B_order.yaml", encoding="utf-8"))
n = 0
for i, sit in enumerate(base["situations"]):
    for j, x in enumerate(sit["sentences"]):
        r = data.pop(f"{i}.{j}")
        x["tag"] = r["tag"]; x["icon"] = r["icon"]; x["why"] = r["why"]; x["decoy"] = r["decoy"]
        assert len(r["dk"]) == 2
        x["distractorsKo"] = list(r["dk"])
        opts = [str(r["ans"])] + [str(o) for o in r["o"]]
        assert len(opts) == 4
        rnd = random.Random(f"{i}.{j}")
        rnd.shuffle(opts)
        x["blank"] = {"answer": str(r["ans"]), "options": [{"en": o} for o in opts]}
        fx = fix.get(f"{i}.{j}", {})
        if "o" in fx:
            opts = [str(r["ans"])] + [str(o) for o in fx["o"]]
            random.Random(f"{i}.{j}").shuffle(opts)
            x["blank"] = {"answer": str(r["ans"]), "options": [{"en": o} for o in opts]}
        for k in (0, 1):
            if f"dk{k}" in fx: x["distractorsKo"][k] = fx[f"dk{k}"]
        n += 1
    o = orders[f"o{i}"]
    assert len(o["lines"]) == 4
    sit["order"] = {"tag": o["tag"], "icon": o["icon"], "ko": o["ko"], "why": o["why"],
                    "lines": [{"en": l["en"], "icon": l["icon"], "ko": l["ko"], "note": l["note"]} for l in o["lines"]]}
assert not data, list(data)
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote", n)
