import yaml, copy, re
def _has(word, en):
    stems = [re.sub(r"(e|es|s|ed|ing)$", "", t) or t for t in re.findall(r"[a-z0-9]+", str(word).lower())]
    toks = re.findall(r"[a-z0-9]+", en.lower())
    return all(any(tk.startswith(st) or (len(st) >= 4 and st in tk) for tk in toks) for st in stems)
def run(theme, edits):
    d = yaml.safe_load(open(f"base-{theme}.yaml"))
    used = set(); total = fixed = 0; changed_words = []
    for sit in d["situations"]:
        for nu in sit.get("nuance") or []:
            if nu.get("kind") != "context": continue
            total += 1
            old = nu["word"]
            e = edits.get(old)
            if e:
                used.add(old); fixed += 1
                for k in ("word", "ko", "why"):
                    if k in e: nu[k] = e[k]
                if nu["word"] != old: changed_words.append((old, nu["word"]))
                for i, sc in e.get("scenes", {}).items():
                    for k, v in sc.items():
                        assert k in ("en", "fix"); sc_ = nu["scenes"][i]
                        if k == "fix": assert sc_["ok"] is False
                        sc_[k] = v
            for i, sc in enumerate(nu["scenes"]):
                assert _has(nu["word"], sc["en"]), (nu["word"], i, sc["en"])
    assert used == set(edits), set(edits) - used
    open(f"{theme}.yaml", "w").write(yaml.dump(d, allow_unicode=True, sort_keys=False, width=10000))
    print(theme, "context", total, "edited", fixed, "word changes", changed_words)
