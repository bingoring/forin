import yaml, re
from _ctx_common import stem
def runfix(theme, edits):
    d = yaml.safe_load(open(f"{theme}.yaml"))
    used = set(); n = 0
    for sit in d["situations"]:
        for nu in sit.get("nuance") or []:
            if nu.get("kind") != "context": continue
            e = edits.get(nu["word"])
            if e:
                used.add(nu["word"]); n += 1
                for k in ("word", "ko", "why"):
                    if k in e: nu[k] = e[k]
                for i, sc in e.get("scenes", {}).items():
                    for k, v in sc.items():
                        assert k in ("en", "fix")
                        if k == "fix": assert nu["scenes"][i]["ok"] is False
                        nu["scenes"][i][k] = v
            for i, sc in enumerate(nu["scenes"]):
                assert stem(nu["word"]) in sc["en"].lower(), (nu["word"], i, sc["en"])
    assert used == set(edits), set(edits) - used
    open(f"{theme}.yaml", "w").write(yaml.dump(d, allow_unicode=True, sort_keys=False, width=10000))
    print(theme, "fixed", n)
