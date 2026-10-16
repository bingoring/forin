#!/usr/bin/env python3
"""or-timeout 수정: fix_or-timeout_data_*.yaml 을 or-timeout.yaml 에 제자리 반영(여러 번 돌려도 같은 결과)."""
import glob, io, os, yaml
D = os.path.dirname(os.path.abspath(__file__))
T = "or-timeout"
P = f"{D}/{T}.yaml"
doc = yaml.safe_load(io.open(P, encoding="utf-8"))
data = {}
for f in sorted(glob.glob(f"{D}/fix_{T}_data_*.yaml")):
    for k, v in yaml.safe_load(io.open(f, encoding="utf-8")).items():
        data.setdefault(k, []).extend(v if isinstance(v, list) else [v])
sits = doc["situations"]
W = {w["id"]: w for w in doc["words"]}
changed_ko = {}   # en -> new ko

# 1. 문장
for p in data["sentences"]:
    x = sits[p["s"]]["sentences"][p["i"]]
    if "ko" in p:
        x["ko"] = p["ko"]; changed_ko[x["en"]] = p["ko"]
    if "dko" in p:
        cur = x["distractorsKo"]
        x["distractorsKo"] = [(n if n is not None else c) for n, c in zip(p["dko"], cur)]
    for k in ("why", "decoy", "chunks", "words"):
        if k in p: x[k] = p[k]

# 2. 빈칸(정답 위치를 돌려 놓는다)
for p in data["blanks"]:
    x = sits[p["s"]]["sentences"][p["i"]]
    ans = p.get("answer", x["blank"]["answer"])
    opts = list(p["opts"])
    assert ans in opts and len(set(opts)) == 4, p
    others = [o for o in opts if o != ans]
    pos = (p["s"] * 3 + p["i"] * 2 + 1) % 4
    others.insert(pos, ans)
    x["blank"] = {"answer": ans, "options": [{"en": o} for o in others]}

# 3. 쉬운 단어 지우기(문장·뉘앙스 words, 은행)
rm = set(data["remove_words"])
for s in sits:
    for x in s["sentences"]:
        x["words"] = [w for w in x["words"] if w not in rm]
    for n in s["nuance"]:
        if "words" in n: n["words"] = [w for w in n["words"] if w not in rm]
doc["words"] = [w for w in doc["words"] if w["id"] not in rm]
W = {w["id"]: w for w in doc["words"]}

# 4. 단어
for p in data["words"]:
    w = W[p["id"]]
    for k, v in p.get("set", {}).items(): w[k] = v
    for k, m in p.get("rep", {}).items():
        w[k] = [m.get(e, e) for e in w[k]]
    for d in p.get("add_decoy", []):
        if d not in w["decoyChips"]: w["decoyChips"].append(d)

# 5. 뉘앙스
for p in data["nuance"]:
    ns = [n for n in sits[p["s"]]["nuance"] if n["kind"] == p["kind"]]
    n = ns[p.get("n", 0)]
    if "set_pair" in p: n["pairs"][p["set_pair"]["idx"]] = p["set_pair"]["value"]
    for k, v in p.get("set", {}).items(): n[k] = v
    if "scene" in p:
        sc = n["scenes"][p["scene"]["idx"]]
        for k, v in p["scene"].items():
            if k != "idx": sc[k] = v
    if "scenes_en" in p:
        for sc, e in zip(n["scenes"], p["scenes_en"]): sc["en"] = e
    if "append_why" in p and p["append_why"].strip() not in n["why"]:
        n["why"] += p["append_why"]
    if "scale_idx" in p: n["scale"][p["scale_idx"]["idx"]] = p["scale_idx"]["value"]

# 6. order
for p in data["order"]:
    o = sits[p["s"]]["order"]
    L = o["lines"]
    if "swap_lines" in p and not p.get("_done"):
        a, b = p["swap_lines"]
        # 이미 바꾼 뒤라면(2번째 줄이 새 문장이면) 다시 바꾸지 않는다
        if not L[a - 1]["en"].startswith("It only takes"):
            L[a - 1], L[b - 1] = L[b - 1], L[a - 1]
    for k, v in p.get("set", {}).items(): L[p["line"] - 1][k] = v
    for k, v in p.get("order_set", {}).items(): o[k] = v

# 7. 문장 ko를 바꿨으면 그 문장을 example로 쓰는 단어의 exKo도
for w in doc["words"]:
    if w["example"] in changed_ko: w["exKo"] = changed_ko[w["example"]]
# nuance example 의 exKo 도 같은 규칙
for s in sits:
    for n in s["nuance"]:
        if n.get("example") in changed_ko: n["exKo"] = changed_ko[n["example"]]

with io.open(P, "w", encoding="utf-8") as f:
    f.write(yaml.safe_dump(doc, allow_unicode=True, sort_keys=False, width=1000))
print("ok")
