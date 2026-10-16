#!/usr/bin/env python3
"""B — 문장 낱장·순서. base에 v46 필드만 얹는다(주제: icu-weaning-extubation)."""
import glob, yaml
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-pilot/icu"
T = "icu-weaning-extubation"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))
add = {}
for f in sorted(glob.glob(f"{D}/add_{T}_B_*.yaml")):
    add.update(yaml.safe_load(open(f, encoding="utf-8")))
assert len(add) == len(base["situations"]), (len(add), len(base["situations"]))
for i, sit in enumerate(base["situations"]):
    a = add[i]
    assert len(a["s"]) == len(sit["sentences"]), i
    for x, v in zip(sit["sentences"], a["s"]):
        x["tag"], x["icon"], x["why"], x["decoy"] = v["tag"], v["icon"], v["why"], v["decoy"]
        x["distractorsKo"] = list(v["d"])
        opts = [v["a"]] + list(v["o"])
        x["blank"] = {"answer": v["a"], "options": [{"en": o} for o in opts]}
    sit["order"] = a["order"]
yaml.safe_dump(base, open(f"{D}/{T}.B.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("wrote", f"{T}.B.yaml")
