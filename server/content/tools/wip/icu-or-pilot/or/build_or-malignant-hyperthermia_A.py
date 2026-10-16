#!/usr/bin/env python3
"""or-malignant-hyperthermia A(단어·뉘앙스): base를 읽어 v45 단어 필드와 nuance를 얹고 결정 11(단어) 정리를 한다."""
import copy, glob, io, os, yaml

T = "or-malignant-hyperthermia"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

# ---- 결정 11 ① 너무 쉬운 단어: 태그를 빼고 은행에서 지운다 ----
EASY = {
    "w-family": "공통 쉬운 단어", "w-room": "공통 쉬운 단어", "w-minute": "공통 쉬운 단어",
    "w-hour": "공통 쉬운 단어", "w-hand": "공통 쉬운 단어", "w-bad": "공통 쉬운 단어", "w-good": "공통 쉬운 단어",
    "w-water": "목록 밖 쉬운 말 — sterile이 가르칠 값", "w-get": "목록 밖 쉬운 말", "w-want": "목록 밖 쉬운 말",
    "w-need": "목록 밖 쉬운 말", "w-high": "목록 밖 쉬운 말 — critical이 가르칠 값", "w-lot": "목록 밖 쉬운 말(a lot of)",
}
# ---- ② 헤드워드·품사와 어긋난 태그만 뺀다: (상황, 순번) -> 뺄 id ----
UNTAG = {
    ("위기 후 중환자 이송", 0): ["w-monitor"],      # 문장은 monitoring(동명사) — 명사 카드(모니터)와 어긋남
    ("급속 냉각 시행", 3): ["w-pack"],               # pack ice(동사) — 명사 카드(팩)와 어긋남
    ("MH 위기 발동", 3): ["w-call"],                 # calling it = 선언 — 헤드워드(외치다·호출하다)와 어긋남
    ("냉각 물품 준비", 4): ["w-call"],               # call it = 선언
}
# ---- ③ 단어 ko ----
KO_EDITS = {
    "w-notify": ("통보하다", "알리다가 notify·call·tell 셋이라 듣고 뜻 고르기에서 정답이 여럿 — notify는 공식적으로 알리는 통보"),
    "w-call": ("외치다·호출하다", "알리다가 notify·tell과 같았고, 태그 문장은 call it out(외쳐 알림)·call for help(호출)"),
    "w-tell": ("말해 주다", "알리다가 notify·call과 같아 정답이 여럿 — tell은 입으로 전해 주는 말"),
    "w-respond": ("(치료에) 반응을 보이다", "w-react(반응하다)와 ko가 같아 정답이 둘 — respond는 치료에 대한 반응"),
    "w-prep": ("미리 준비해 두다", "w-prepare(준비하다)와 ko가 같아 정답이 둘"),
    "w-first": ("첫·먼저", "태그 문장이 the first MH sign(첫)과 push calcium first(먼저) — 형용사·부사 둘을 함께 담음"),
    "w-tight": ("꽉 조인", "w-rigid(뻣뻣한)와 ko가 같아 정답이 둘 — tight는 꽉 조여 열리지 않는 쪽"),
    "w-rigid": ("경직된", "w-tight와 ko(뻣뻣한)가 같아 정답이 둘 — rigid는 굳어 경직된 쪽"),
    "w-colored": ("색을 띤", "w-color(색깔)와 거의 같아 정답이 겹침 — colored는 ~색을 띤"),
    "w-case": ("수술 케이스", "증례(환자 사례)는 이 주제의 수술 한 건이라는 뜻과 다름 — 문장 ko는 케이스"),
}
for w in doc["words"]:
    if w["id"] in KO_EDITS:
        w["ko"], why = KO_EDITS[w["id"]]
        changes.append({"kind": "word", "id": w["id"], "fields": ["ko"], "why": why})

# 태그 정리
sent_changes = {}
for s in doc["situations"]:
    for i, t in enumerate(s["sentences"]):
        drop = [x for x in t["words"] if x in EASY] + UNTAG.get((s["title"], i), [])
        if drop:
            t["words"] = [x for x in t["words"] if x not in drop]
            sent_changes[(s["title"], i)] = drop
for (title, i), drop in sent_changes.items():
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"],
                    "why": "태그 빼기: " + ", ".join(drop)})
for wid, why in EASY.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움 — {why}; 어느 문장도 태그하지 않게 됨"})
doc["words"] = [w for w in doc["words"] if w["id"] not in EASY]
still = {x for s in doc["situations"] for t in s["sentences"] for x in t["words"]}
print("unused words:", [w["id"] for w in doc["words"] if w["id"] not in still])

# ---- v45 단어 필드 ----
KEYS = ["exKo", "cue", "tag", "distractorsEn", "distractorsKo", "chips", "decoyChips"]
add = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for wid, v in (yaml.safe_load(io.open(f, encoding="utf-8")) or {}).items():
        assert wid not in add, f"dup {wid} in {f}"
        add[wid] = v
bank = {w["id"]: w for w in doc["words"]}
print("missing:", [i for i in bank if i not in add], "extra:", sorted(set(add) - set(bank)))
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
    joined = " ".join("".join(p) for p in v["chips"])
    if joined != w["en"]:
        print("CHIPS!=en", w["id"], joined, "|", w["en"])
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
