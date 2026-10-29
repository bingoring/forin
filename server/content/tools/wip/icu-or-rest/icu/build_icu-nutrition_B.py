import glob, yaml
T = "icu-nutrition"
base = yaml.safe_load(open(f"base-{T}.yaml", encoding="utf-8"))
data = {}
for f in sorted(glob.glob(f"add_{T}_B_*.yaml")):
    for s in yaml.safe_load(open(f, encoding="utf-8"))["situations"]:
        assert s["title"] not in data, s["title"]
        data[s["title"]] = s
print("MISSING", [s["title"] for s in base["situations"] if s["title"] not in data])
for sit in base["situations"]:
    d = data.get(sit["title"])
    if not d:
        continue
    assert len(d["s"]) == len(sit["sentences"]), (sit["title"], len(d["s"]))
    for x, r in zip(sit["sentences"], d["s"]):
        assert len(r) == 10, r
        tag, icon, why, decoy, d1, d2, ans, w1, w2, w3 = r
        x["tag"] = tag; x["icon"] = icon; x["why"] = why; x["decoy"] = decoy
        x["distractorsKo"] = [d1, d2]
        x["blank"] = {"answer": ans, "options": [{"en": o} for o in (ans, w1, w2, w3)]}
    o = d["order"]
    assert len(o["lines"]) == 4
    sit["order"] = {"tag": o["tag"], "icon": o["icon"], "ko": o["ko"], "why": o["why"],
        "lines": [{"en": l[0], "icon": l[1], "ko": l[2], "note": l[3]} for l in o["lines"]]}
for fn in sorted(glob.glob(f"fixB_{T}_*.yaml")):
    for key, v in yaml.safe_load(open(fn, encoding="utf-8")).items():
        i, j = map(int, key.split("."))
        x = base["situations"][i]["sentences"][j]
        if "d" in v: x["distractorsKo"] = v["d"]
        if "decoy" in v: x["decoy"] = v["decoy"]
        if "blank" in v:
            b = v["blank"]; x["blank"] = {"answer": b[0], "options": [{"en": o} for o in b]}
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote", f"{T}.B.yaml")
