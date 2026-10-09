import yaml, copy, re, sys
def stem(w):
    w = str(w).strip().lower()
    return re.sub(r"(e|es|s|ed|ing)$", "", w) or w
def run(theme, edits):
    d = yaml.safe_load(open(f"base-{theme}.yaml"))
    orig = copy.deepcopy(d)
    used = set(); total = fixed = 0
    for sit in d["situations"]:
        for nu in sit.get("nuance") or []:
            if nu.get("kind") != "context": continue
            total += 1
            e = edits.get(nu["word"])
            if e:
                used.add(nu["word"]); fixed += 1
                for k in ("word", "ko", "why"):
                    if k in e: nu[k] = e[k]
                for i, sc in e.get("scenes", {}).items():
                    for k, v in sc.items():
                        assert k in ("en", "fix"); sc_ = nu["scenes"][i]
                        if k == "fix": assert sc_["ok"] is False
                        sc_[k] = v
            for i, sc in enumerate(nu["scenes"]):
                assert stem(nu["word"]) in sc["en"].lower(), (nu["word"], i, sc["en"])
    assert used == set(edits), set(edits) - used
    open(f"{theme}.yaml", "w").write(yaml.dump(d, allow_unicode=True, sort_keys=False, width=10000))
    print(theme, "context", total, "edited", fixed)
