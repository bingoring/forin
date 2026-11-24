#!/usr/bin/env python3
"""or-bleeding A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko·chunks·goal은 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "or-bleeding"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

REMOVE = {
    "w-minute": "공통 쉬운 단어 목록(minute)",
    "w-blood": "너무 쉬움 — 목록 밖 판단(blood)", "w-show": "너무 쉬움 — 목록 밖 판단(show)",
    "w-tell": "너무 쉬움 — 목록 밖 판단(tell)", "w-start": "너무 쉬움 — 목록 밖 판단(start)",
    "w-add": "너무 쉬움 — 목록 밖 판단(add)", "w-moment": "너무 쉬움 — 목록 밖 판단(moment)",
    "w-number": "너무 쉬움 — 목록 밖 판단(number)", "w-check": "너무 쉬움 — 목록 밖 판단(check)",
}
touched = {}
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE]
        if new != x["words"]:
            x["words"] = new
            touched[(s["title"], i)] = True
for wid in REMOVE:
    assert not any(wid in x["words"] for s in doc["situations"] for x in s["sentences"])
doc["words"] = [w for w in doc["words"] if w["id"] not in REMOVE]
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움 — {why}; 어느 문장도 태그하지 않게 됐다"})
bank = {w["id"]: w for w in doc["words"]}

KO_EDITS = {
    "w-agent": ("약제", "w-product와 ko(제제)가 같아 듣고 뜻 고르기에서 정답이 둘 — agent는 특정 작용을 하는 약제"),
    "w-product": ("혈액제제", "w-agent와 ko(제제)가 같아 정답이 둘 — product는 혈액은행이 내주는 혈액제제('get products ready')"),
    "w-hold": ("누르고 있다", "w-keep와 ko(유지하다)가 같아 정답이 둘 — hold는 문장에서 압박을 누르고 있다는 뜻"),
    "w-rapid": ("급속한", "w-fast와 ko(빠른·신속한)가 가까워 정답이 둘 — rapid는 속도가 급격히 큰 쪽(rapid infuser)"),
    "w-update": ("경과를 전하다", "w-alert와 ko(알리다·알려주다)가 가까워 정답이 둘 — update는 경과를 계속 전하는 쪽"),
    "w-closure": ("폐쇄", "'temporary closure'는 봉합이 아니라 손상통제 때 하는 임시 폐쇄"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
w = bank["w-free"]
assert "freely" in w["example"]
w["en"], w["ipa"] = "freely", "/ˈfriːli/"
changes.append({"kind": "word", "id": "w-free", "fields": ["en", "ipa"], "why": "태그된 문장이 'flowing freely' 부사 하나뿐이라 헤드워드를 부사(freely)로"})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어 태그 정리"})

TAGMAP = {"세포회수": "혈액 제제", "준비물": "지혈 수단", "원인 감별": "응고·검사", "관류 감시": "쇼크 징후"}
KEYS = ["exKo", "cue", "tag", "distractorsEn", "distractorsKo", "chips", "decoyChips"]
add = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for wid, v in (yaml.safe_load(io.open(f, encoding="utf-8")) or {}).items():
        assert wid not in add, f"dup {wid} in {f}"
        add[wid] = v
print("missing:", [i for i in bank if i not in add], "extra:", sorted(set(add) - set(bank)))
sko = {}
for s in doc["situations"]:
    for t in s["sentences"]:
        sko.setdefault(t["en"], t["ko"])
for w in doc["words"]:
    v = add.get(w["id"])
    if not v:
        continue
    v = dict(v)
    v["tag"] = TAGMAP.get(v["tag"], v["tag"])
    for k in KEYS:
        if k in v:
            w[k] = v[k]
    w["exKo"] = sko[w["example"]]
    joined = " ".join("".join(p) for p in v["chips"])
    if joined != w["en"]:
        print("CHIPS!=en", w["id"], joined, "|", w["en"])
    flat = {p.lower() for word in v["chips"] for p in word}
    for dc in v["decoyChips"]:
        if dc.lower() in flat:
            print("decoy is own fragment", w["id"], dc)
    if w["en"].lower() in v["cue"].lower():
        print("CUE leaks", w["id"])
    pool = [p for word in v["chips"] for p in word] + list(v["decoyChips"])
    target = w["en"].replace(" ", "")
    own = "".join(p for word in v["chips"] for p in word)
    seq = [p for word in v["chips"] for p in word]
    for r in range(1, 6):
        for combo in itertools.permutations(range(len(pool)), r):
            if "".join(pool[j] for j in combo).lower() == target.lower() and [pool[j] for j in combo] != seq:
                print("ALT PATH", w["id"], [pool[j] for j in combo])

nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for title, lst in (yaml.safe_load(io.open(f, encoding="utf-8")) or {}).items():
        assert title not in nu, f"dup {title}"
        nu[title] = lst
titles = [s["title"] for s in doc["situations"]]
print("unknown nuance titles:", sorted(set(nu) - set(titles)))
for s in doc["situations"]:
    if s["title"] in nu:
        s["nuance"] = nu[s["title"]]
        tagged = {x for t in s["sentences"] for x in t["words"]}
        if len(tagged) < 8:
            print("V3 risk", s["title"], len(tagged))
        for q in s["nuance"]:
            off = [x for x in q.get("words", []) if x not in tagged]
            if off:
                print("V15 risk", s["title"], q["kind"], off)
print("nuance missing:", [t for t in titles if t not in nu])


class Dumper(yaml.SafeDumper):
    pass


def _str(d, s):
    q = s.lower() in ("on", "off", "yes", "no", "true", "false", "null", "y", "n")
    return d.represent_scalar("tag:yaml.org,2002:str", s, style='"' if q else None)


Dumper.add_representer(str, _str)
io.open(f"{D}/{T}.A.yaml", "w", encoding="utf-8").write(
    yaml.dump(doc, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
io.open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8").write(
    yaml.dump({"theme": T, "changes": changes}, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
print(f"words {len(doc['words'])} situations {len(doc['situations'])} changes {len(changes)}")
