# 수정 스크립트: pre-fix.yaml + fix_icu-raised-icp_data_N.yaml  ->  icu-raised-icp.yaml, changes-icu-raised-icp.yaml
import yaml, glob, re, copy, sys, os
T = "icu-raised-icp"
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def load(p): return yaml.safe_load(open(p, encoding="utf-8"))
d = load(f"{T}.pre-fix.yaml")
base = load(f"base-{T}.yaml")
chg0 = load(f"changes-{T}.pre-fix.yaml")["changes"]
datas = [load(p) for p in sorted(glob.glob(f"fix_{T}_data_*.yaml"))]
sits = d["situations"]
words = {w["id"]: w for w in d["words"]}
why_new = {}   # ('s', i, j) / ('w', id) -> [why...]

def sent(k):
    i, j = map(int, k.split("."))
    return sits[i]["sentences"][j]

old_en = {}  # 문장 en(수정 전) -> (새 en, 새 ko)
for D in datas:
    for k, f in (D.get("sentences") or {}).items():
        x = sent(k); oen = x["en"]
        f = dict(f)
        sw = f.pop("swhy", None)
        if sw: why_new.setdefault(("s", *map(int, k.split("."))), []).append(sw)
        b = f.pop("blank", None)
        if b: x["blank"] = {"answer": b["answer"], "options": [{"en": o} for o in b["options"]]}
        for a, v in f.items(): x[a] = v
        old_en.setdefault(oen, x)   # x 는 같은 객체 — 이후 en/ko 가 최종값
    for k, f in (D.get("blank") or {}).items():
        sent(k)["blank"] = {"answer": f["answer"], "options": [{"en": o} for o in f["options"]]}
    for k, f in (D.get("dko") or {}).items():
        sent(k)["distractorsKo"] = list(f)
    for k, f in (D.get("dko_partial") or {}).items():
        x = sent(k)
        if f.get("x1"): x["distractorsKo"][0] = f["x1"]
        if f.get("x2"): x["distractorsKo"][1] = f["x2"]
    for k, v in (D.get("decoy") or {}).items():
        sent(k)["decoy"] = v
    for i, o in (D.get("order") or {}).items():
        od = sits[int(i)]["order"]
        o = dict(o); ln = o.pop("lines", None); ow = o.pop("owhy", None)
        for a, v in o.items(): od[a] = v
        if ln:
            for n, l in ln.items():
                od["lines"][int(n)].update(l)
        if ow: why_new.setdefault(("o", int(i)), []).append(ow)
    for it in (D.get("nuance") or []):
        s = sits[it["s"]]
        t = [n for n in s["nuance"] if n["kind"] == it["kind"] and n["words"][0] == it["w"]]
        assert len(t) == 1, it
        n = t[0]
        for a, v in it["set"].items():
            if a == "before_i":
                for q, val in v.items(): n["before"][int(q)] = val
            elif a == "scene_fam":
                sc = [q for q in n["scenes"] if q["who"].startswith("가족") or q["who"].startswith("방문한 가족")]
                assert len(sc) == 1; sc[0].update(v)
            elif a == "rename_opt":
                for o, nw in v.items():
                    n["options"] = [nw if q == o else q for q in n["options"]]
                    n["notes"][nw] = n["notes"].pop(o)
                    if n["answer"] == o: n["answer"] = nw
            else: n[a] = v

# 단어: 지정 필드 / 삭제
removed = set()
for D in datas:
    for wid, f in (D.get("words") or {}).items():
        f = dict(f); ww = f.pop("why", None)
        w = words[wid]
        for a, v in f.items(): w[a] = v
        if ww: why_new.setdefault(("w", wid), []).append(ww)
    for wid in (D.get("word_remove") or {}):
        removed.add(wid); why_new.setdefault(("w", wid), []).append(D["word_remove"][wid])
    for k, v in (D.get("sent_words_remove") or {}).items():
        x = sent(k)
        x["words"] = [q for q in x["words"] if q not in v]
for wid in removed:
    for s in sits:
        for x in s["sentences"]:
            assert wid not in x["words"], (wid, x["en"])
d["words"] = [w for w in d["words"] if w["id"] not in removed]
words = {w["id"]: w for w in d["words"]}

# 연쇄: example/exKo  (명시한 단어는 건드리지 않음)
explicit_ex = {wid for D in datas for wid, f in (D.get("words") or {}).items() if "example" in f}
for oen, x in old_en.items():
    for w in d["words"]:
        if w["id"] in explicit_ex: continue
        if w["example"] == oen:
            w["example"] = x["en"]; w["exKo"] = x["ko"]
# 문장 ko 가 바뀌었는데 en 이 같은 경우도 exKo 맞춤
ko_of = {x["en"]: x["ko"] for s in sits for x in s["sentences"]}
for w in d["words"]:
    if w["example"] in ko_of and w["exKo"] != ko_of[w["example"]] and w["id"] not in explicit_ex:
        w["exKo"] = ko_of[w["example"]]

with open(f"{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(d, f, allow_unicode=True, sort_keys=False, width=1000)

# ---- changes: base(정본) -> 최종, v44 필드 diff. 기존 why 는 보존하고 새 why 를 덧붙임 ----
old = {}
for c in chg0:
    key = (c["kind"], c.get("situation"), c.get("index")) if c["kind"] == "sentence" else (c["kind"], c.get("id"))
    old[key] = c
out = []
bw = {w["id"]: w for w in base["words"]}
fw = {w["id"]: w for w in d["words"]}
for wid, w in bw.items():
    if wid not in fw:
        c = old.get(("word-remove", wid)) or {"kind": "word-remove", "id": wid, "why": "; ".join(why_new.get(("w", wid), [])) or "삭제"}
        if ("word-remove", wid) not in old and ("w", wid) in why_new: c["why"] = "; ".join(why_new[("w", wid)])
        out.append(c); continue
    fs = [a for a in ("en", "ko", "ipa", "icon", "example") if w.get(a) != fw[wid].get(a)]
    if fs:
        prev = old.get(("word", wid))
        ws = []
        if prev: ws.append(prev["why"])
        ws += why_new.get(("w", wid), [])
        out.append({"kind": "word", "id": wid, "fields": fs, "why": "; ".join(ws) or "수정"})
for si, (bs, fs_) in enumerate(zip(base["situations"], d["situations"])):
    for j, (bx, fx) in enumerate(zip(bs["sentences"], fs_["sentences"])):
        fs = [a for a in ("en", "ko", "chunks", "words") if bx.get(a) != fx.get(a)]
        if fs:
            prev = old.get(("sentence", bs["title"], j))
            ws = []
            if prev: ws.append(prev["why"])
            ws += why_new.get(("s", si, j), [])
            out.append({"kind": "sentence", "situation": bs["title"], "index": j, "fields": fs, "why": "; ".join(ws) or "수정"})
for wid in fw:
    if wid not in bw: print("WORD-ADD?", wid)
order = {"word-remove": 0, "word": 1, "sentence": 2}
out.sort(key=lambda c: 0)  # 안정 정렬 유지
yaml.safe_dump({"theme": T, "changes": out}, open(f"changes-{T}.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("wrote", len(out), "changes;", len(d["words"]), "words")
