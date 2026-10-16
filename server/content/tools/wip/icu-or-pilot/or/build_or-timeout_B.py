#!/usr/bin/env python3
"""or-timeout B(문장 낱장·순서): base를 읽어 v46 문장 필드와 order를 얹는다. nuance·단어는 건드리지 않는다."""
import copy, glob, io, os, re, yaml, zlib, collections

T = "or-timeout"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))

add = {}
for f in sorted(glob.glob(f"{D}/add_{T}_B_*.yaml")):
    for sit in yaml.safe_load(io.open(f, encoding="utf-8")):
        assert sit["t"] not in add, sit["t"]
        add[sit["t"]] = sit
titles = [s["title"] for s in doc["situations"]]
print("missing:", [t for t in titles if t not in add], "extra:", sorted(set(add) - set(titles)))

def wb(ans, en):
    return len(re.findall(r"(?<![\w-])" + re.escape(ans) + r"(?![\w-])", en))

for s in doc["situations"]:
    a = add[s["title"]]
    assert len(a["s"]) == len(s["sentences"])
    for i, (t, v) in enumerate(zip(s["sentences"], a["s"])):
        t["tag"], t["icon"], t["why"], t["decoy"] = v["tag"], v["icon"], v["why"], v["decoy"]
        t["distractorsKo"] = list(v["dko"])
        opts = [v["ans"]] + list(v["wr"])
        k = zlib.crc32(f'{s["title"]}{i}'.encode()) % 4
        opts.insert(k, opts.pop(0))
        t["blank"] = {"answer": v["ans"], "options": [{"en": o} for o in opts]}
        if wb(v["ans"], t["en"]) != 1:
            print("ANS!=1", s["title"], i, v["ans"], wb(v["ans"], t["en"]))
    s["order"] = a["o"]

io.open(f"{D}/{T}.B.yaml", "w", encoding="utf-8").write(
    yaml.safe_dump(doc, allow_unicode=True, sort_keys=False, width=1000))
print("wrote")
