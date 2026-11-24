import glob, yaml
T = "or-specimen"
base = yaml.safe_load(open(f"base-{T}.yaml", encoding="utf-8"))
data = {}
POS = [0]
exec(open("patch_or-specimen_B.py").read())
for f in sorted(glob.glob(f"add_{T}_B_*.yaml")):
    for s in yaml.safe_load(open(f, encoding="utf-8"))["situations"]:
        assert s["title"] not in data, s["title"]
        data[s["title"]] = s
SI = {s["title"]: n for n, s in enumerate(base["situations"])}
missing = [s["title"] for s in base["situations"] if s["title"] not in data]
print("MISSING", missing)
for sit in base["situations"]:
    d = data.get(sit["title"])
    if not d: continue
    assert len(d["s"]) == len(sit["sentences"]), sit["title"]
    for ii, (x, r) in enumerate(zip(sit["sentences"], d["s"])):
        r = list(r)
        for c, v in P.get((SI[sit["title"]], ii), {}).items(): r[c] = v
        assert len(r) == 10, r
        tag, icon, why, decoy, d1, d2, ans, w1, w2, w3 = r
        x["tag"] = tag; x["icon"] = icon; x["why"] = why; x["decoy"] = decoy
        x["distractorsKo"] = [d1, d2]
        pos = POS[0] % 4; POS[0] += 1
        others = [w1, w2, w3]; opts = others[:pos] + [ans] + others[pos:]
        x["blank"] = {"answer": ans, "options": [{"en": o} for o in opts]}
    o = d["order"]
    assert len(o["lines"]) == 4
    sit["order"] = {"tag": o["tag"], "icon": o["icon"], "ko": o["ko"], "why": o["why"],
        "lines": [{"en": l[0], "icon": l[1], "ko": l[2], "note": l[3]} for l in o["lines"]]}
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote", f"{T}.B.yaml")
