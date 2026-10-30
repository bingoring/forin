import glob, yaml
T = "core-language-icu"
base = yaml.safe_load(open(f"base-{T}.yaml", encoding="utf-8"))
data = {}
for f in sorted(glob.glob(f"addB_{T}_*.yaml")):
    for s in yaml.safe_load(open(f, encoding="utf-8"))["situations"]:
        assert s["title"] not in data, s["title"]
        data[s["title"]] = s
print("MISSING", [s["title"] for s in base["situations"] if s["title"] not in data])
exec(open(f"fix_{T}_B_data.py", encoding="utf-8").read())
for si, sit in enumerate(base["situations"]):
    d = data[sit["title"]]
    assert len(d["s"]) == len(sit["sentences"]), sit["title"]
    for ix, (x, r) in enumerate(zip(sit["sentences"], d["s"])):
        assert len(r) == 10, r
        r = list(r); r[3] = DECOYS[si][ix]
        ov = OVR.get((si, ix), {})
        if "ko1" in ov: r[4] = ov["ko1"]
        if "ko2" in ov: r[5] = ov["ko2"]
        if "ans" in ov: r[6] = ov["ans"]
        if "w" in ov: r[7:10] = ov["w"]
        tag, icon, why, decoy, d1, d2, ans, w1, w2, w3 = r
        x["tag"] = tag; x["icon"] = icon; x["why"] = why; x["decoy"] = decoy
        x["distractorsKo"] = [d1, d2]
        x["blank"] = {"answer": ans, "options": [{"en": o} for o in (ans, w1, w2, w3)]}
    o = d["order"]; assert len(o["lines"]) == 4
    sit["order"] = {"tag": o["tag"], "icon": o["icon"], "ko": o["ko"], "why": o["why"],
        "lines": [{"en": l[0], "icon": l[1], "ko": l[2], "note": l[3]} for l in o["lines"]]}
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote")
