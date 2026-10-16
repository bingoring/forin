#!/usr/bin/env python3
"""icu-arrhythmia B 반쪽 — base에 문장 v46 필드(tag·icon·why·decoy·distractorsKo·blank)와 상황 order를 얹는다."""
import glob, sys, yaml
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-icu-arrhythmia.yaml", encoding="utf-8"))
data = {}
for f in sorted(glob.glob(f"{D}/add_icu-arrhythmia_B_*.yaml")):
    data.update(yaml.safe_load(open(f, encoding="utf-8")))
fix = {}
for f in sorted(glob.glob(f"{D}/fix_icu-arrhythmia_B_*.yaml")):
    fix.update(yaml.safe_load(open(f, encoding="utf-8")) or {})
for key, patch in fix.items():
    i, j = (int(x) for x in str(key).split("."))
    data[i]["s"][j].update(patch)
out = []
for i, sit in enumerate(base["situations"]):
    d = data.get(i)
    if not d:
        sys.exit(f"상황 {i} 데이터 없음")
    assert len(d["s"]) == len(sit["sentences"]), i
    for j, (s, a) in enumerate(zip(sit["sentences"], d["s"])):
        s["tag"], s["icon"], s["why"], s["decoy"] = a["tag"], a["icon"], a["why"], a["decoy"]
        dk = list(a["dk"])
        if s["ko"].endswith("."):
            dk = [x if x.endswith((".", "?", "!")) else x + "." for x in dk]
        s["distractorsKo"] = dk
        opts = [a["ans"]] + list(a["opts"])
        pos = (i * 3 + j * 5 + 1) % 4
        opts = opts[1:pos + 1] + [a["ans"]] + opts[pos + 1:]
        s["blank"] = {"answer": a["ans"], "options": [{"en": o} for o in opts]}
    sit["order"] = d["order"]
yaml.safe_dump(base, open(f"{D}/icu-arrhythmia.B.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("ok")
