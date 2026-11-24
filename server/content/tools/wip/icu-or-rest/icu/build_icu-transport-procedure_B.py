import glob, yaml
T = "icu-transport-procedure"
base = yaml.safe_load(open(f"base-{T}.yaml", encoding="utf-8"))
data = {}
for f in sorted(glob.glob("addB_transport-procedure_*.yaml")):
    for s in yaml.safe_load(open(f, encoding="utf-8"))["situations"]:
        assert s["title"] not in data, s["title"]
        data[s["title"]] = s
print("MISSING", [s["title"] for s in base["situations"] if s["title"] not in data])
for sit in base["situations"]:
    d = data.get(sit["title"])
    if not d: continue
    assert len(d["s"]) == len(sit["sentences"]), sit["title"]
    for x, r in zip(sit["sentences"], d["s"]):
        assert len(r) == 10, r
        tag, icon, why, decoy, d1, d2, ans, w1, w2, w3 = r
        x.update(tag=tag, icon=icon, why=why, decoy=decoy, distractorsKo=[d1, d2],
                 blank={"answer": ans, "options": [{"en": o} for o in (ans, w1, w2, w3)]})
    o = d["order"]; assert len(o["lines"]) == 4
    sit["order"] = {"tag": o["tag"], "icon": o["icon"], "ko": o["ko"], "why": o["why"],
        "lines": [{"en": l[0], "icon": l[1], "ko": l[2], "note": l[3]} for l in o["lines"]]}
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
