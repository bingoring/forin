#!/usr/bin/env python3
"""icu-airway B 반쪽 — base에 문장 v46 필드와 상황 order를 얹는다(add_icu-airway_B_*.yaml)."""
import glob, sys, yaml
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-icu-airway.yaml", encoding="utf-8"))
data = {}
for f in sorted(glob.glob(f"{D}/add_icu-airway_B_*.yaml")):
    data.update(yaml.safe_load(open(f, encoding="utf-8")))
partial = "--partial" in sys.argv
sits = []
for i, sit in enumerate(base["situations"]):
    d = data.get(i)
    if not d:
        if not partial:
            sys.exit(f"상황 {i} 데이터 없음")
        continue
    assert len(d["s"]) == len(sit["sentences"]), i
    for j, (s, a) in enumerate(zip(sit["sentences"], d["s"])):
        s["tag"], s["icon"], s["why"], s["decoy"] = a["tag"], a["icon"], a["why"], a["decoy"]
        dk = list(a["dk"])
        if s["ko"].endswith("."):
            dk = [x if x.endswith((".", "?", "!")) else x + "." for x in dk]
        s["distractorsKo"] = dk
        opts = list(a["opts"])
        assert len(opts) == 3, (i, j)
        pos = (i * 3 + j * 5 + 1) % 4
        opts = opts[:pos] + [a["ans"]] + opts[pos:]
        s["blank"] = {"answer": a["ans"], "options": [{"en": str(o)} for o in opts]}
    sit["order"] = d["order"]
    sits.append(sit)
if partial:
    base["situations"] = sits
yaml.safe_dump(base, open(f"{D}/icu-airway.B.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("ok", len(sits))
