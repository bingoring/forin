import glob, yaml
T = "icu-gi-bleed"
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
    assert len(d["s"]) == len(sit["sentences"]), sit["title"]
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
import os, re, itertools
PRE = itertools.cycle(["기 전에","기 직전에","기에 앞서","기 이전에"])
POST = itertools.cycle(["뒤에","후에","이후에","직후에"])
POST2 = itertools.cycle(["뒤","후","이후"])
def rot(t, ko=""):
    if "전에" not in ko:
        t = re.sub(r"기 전에", lambda m: next(PRE), t)
    t = re.sub(r"(?<=[가-힣])(?<!시간)(?<!쯤) 뒤에", lambda m: " " + next(POST), t)
    t = re.sub(r"(?<=[가-힣])(?<!시간)(?<!쯤) 뒤 ", lambda m: " " + next(POST2) + " ", t)
    return t
for fn in sorted(glob.glob(f"fixB_{T}_*.yaml")):
    for key, v in yaml.safe_load(open(fn, encoding="utf-8")).items():
        i, j = map(int, key.split("."))
        x = base["situations"][i]["sentences"][j]
        if "d" in v: x["distractorsKo"] = v["d"]
        if "decoy" in v: x["decoy"] = v["decoy"]
        if "blank" in v:
            b = v["blank"]; x["blank"] = {"answer": b[0], "options": [{"en": o} for o in b]}
for fn in sorted(glob.glob(f"substB_{T}_*.yaml")):
    for key, pairs in yaml.safe_load(open(fn, encoding="utf-8")).items():
        i, j, k = map(int, key.split("."))
        x = base["situations"][i]["sentences"][j]
        t = x["distractorsKo"][k]
        for old, new in zip(pairs[::2], pairs[1::2]):
            assert old in t, (key, old, t)
            t = t.replace(old, new)
        x["distractorsKo"][k] = t
for sit in base["situations"]:
    for x in sit["sentences"]:
        x["distractorsKo"] = [t if os.environ.get("NOROT") else rot(t, x["ko"]) for t in x["distractorsKo"]]
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote", f"{T}.B.yaml")
