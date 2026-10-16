#!/usr/bin/env python3
"""or-malignant-hyperthermia 수정: fix_or-malignant-hyperthermia_data_*.yaml 을 제자리 반영(여러 번 돌려도 같은 결과)."""
import glob, io, os, yaml
D = os.path.dirname(os.path.abspath(__file__))
T = "or-malignant-hyperthermia"
P = f"{D}/{T}.yaml"
doc = yaml.safe_load(io.open(P, encoding="utf-8"))
data = {}
for f in sorted(glob.glob(f"{D}/fix_{T}_data_*.yaml")):
    for k, v in yaml.safe_load(io.open(f, encoding="utf-8")).items():
        data.setdefault(k, []).extend(v if isinstance(v, list) else [v])
sits = doc["situations"]
W = {w["id"]: w for w in doc["words"]}

def set_blank(x, s, i, ans, opts):
    assert ans in opts and len(set(opts)) == 4, (s, i, opts)
    others = [o for o in opts if o != ans]
    pos = (s * 3 + i * 2 + 1) % 4
    others.insert(pos, ans)
    x["blank"] = {"answer": ans, "options": [{"en": o} for o in others]}

# 1. 문장
for p in data.get("sentences", []):
    s, i = p["s"], p["i"]
    x = sits[s]["sentences"][i]
    old_en = x["en"]
    for k in ("en", "ko", "chunks", "words", "why", "decoy"):
        if k in p: x[k] = p[k]
    if "dko" in p: x["distractorsKo"] = list(p["dko"])
    if "blank_rep" in p:
        for o in x["blank"]["options"]:
            if o["en"] in p["blank_rep"]: o["en"] = p["blank_rep"][o["en"]]
    if "blank" in p:
        set_blank(x, s, i, p["blank"]["answer"], p["blank"]["opts"])
    # 문장 ko가 바뀌면 그 문장을 예문으로 쓰는 단어의 exKo도 같은 ko로(V17)
    if "ko" in p or "en" in p:
        for w in doc["words"]:
            if w["example"] in (old_en, x["en"]) and "ko" in p:
                w["exKo"] = x["ko"]

# 2. 단어
for p in data.get("words", []):
    w = W[p["id"]]
    for k, v in p["set"].items(): w[k] = v

# 3. 뉘앙스
for p in data.get("nuance", []):
    ns = [n for n in sits[p["s"]]["nuance"] if n["kind"] == p["kind"]]
    n = ns[p.get("n", 0)]
    for k, v in p.get("set", {}).items(): n[k] = v
    if "pair" in p: n["pairs"][p["pair_idx"]] = p["pair"]
    if "scene" in p:
        sc = n["scenes"][p["scene"]["idx"]]
        for k, v in p["scene"].items():
            if k != "idx": sc[k] = v
    if "scenes" in p: n["scenes"] = p["scenes"]
    if "append_why" in p and p["append_why"].strip() not in n["why"]:
        n["why"] = n["why"].rstrip() + p["append_why"]

# 4. order
for p in data.get("order", []):
    o = sits[p["s"]]["order"]
    for k in ("ko", "why"):
        if k in p: o[k] = p[k]
    for idx, f in p.get("lines", {}).items():
        for k, v in f.items(): o["lines"][int(idx) - 1][k] = v

io.open(P, "w", encoding="utf-8").write(yaml.safe_dump(doc, allow_unicode=True, sort_keys=False, width=1000))
print("applied")
