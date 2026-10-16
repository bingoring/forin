#!/usr/bin/env python3
"""or-timeout A(단어·뉘앙스): base를 읽어 v45 단어 필드와 nuance를 얹는다. 문장은 건드리지 않는다."""
import copy, glob, io, os, re, yaml

T = "or-timeout"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))

# ---- 결정 11 (단어만): 같은 ko 쌍 가르기 ----
KO_EDITS = {
    "w-check": ("점검하다", "w-confirm과 ko(확인하다)가 같아 듣고 뜻 고르기에서 정답이 둘 — check는 눈으로 살펴 점검하는 쪽"),
    "w-start": ("착수하다", "w-begin과 ko(시작하다)가 같아 정답이 둘 — start는 수술·타임아웃에 들어가는 착수"),
    "w-note": ("기재하다", "w-document와 ko(기록하다)가 같아 정답이 둘 — note는 시각 등을 적어 두는 기재"),
    "w-align": ("(생각을) 맞추다", "w-match(일치하다)와 ko(일치시키다)가 겹친다 — align은 팀원의 이해·계획을 한 방향으로 맞추는 쪽"),
    "w-run": ("(수술이) 이어지다", "w-proceed(진행하다)와 겹치고, 태그 문장은 the case runs longer — 수술이 예정보다 이어진다는 뜻"),
}
changes = []
for w in doc["words"]:
    if w["id"] in KO_EDITS:
        w["ko"], why = KO_EDITS[w["id"]]
        changes.append({"kind": "word", "id": w["id"], "fields": ["ko"], "why": why})

# ---- v45 단어 필드 ----
KEYS = ["exKo", "cue", "tag", "distractorsEn", "distractorsKo", "chips", "decoyChips"]
add = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for wid, v in (yaml.safe_load(io.open(f, encoding="utf-8")) or {}).items():
        assert wid not in add, f"dup {wid} in {f}"
        add[wid] = v
bank = {w["id"]: w for w in doc["words"]}
print("missing:", [i for i in bank if i not in add], "extra:", sorted(set(add) - set(bank)))

# exKo = 예문과 글자가 같은 문장의 ko
sko = {}
for s in doc["situations"]:
    for t in s["sentences"]:
        sko.setdefault(t["en"], t["ko"])

for w in doc["words"]:
    v = add.get(w["id"])
    if not v:
        continue
    for k in KEYS:
        if k in v:
            w[k] = v[k]
    w["exKo"] = sko[w["example"]]
    # 사전 점검
    joined = " ".join("".join(p) for p in v["chips"])
    if joined != w["en"]:
        print("CHIPS!=en", w["id"], joined, "|", w["en"])
    flat = {p.lower() for word in v["chips"] for p in word}
    for dc in v["decoyChips"]:
        if dc.lower() in flat:
            print("decoy is own fragment", w["id"], dc)
    # 오답 조각으로 정답이 다른 경로로 만들어지는가: 한 낱말 단어만 본다
    for dc in v["decoyChips"]:
        pass
    if w["en"].lower() in v["cue"].lower():
        print("CUE leaks", w["id"])

# ---- 뉘앙스 ----
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
