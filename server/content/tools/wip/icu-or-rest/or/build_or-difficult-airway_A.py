#!/usr/bin/env python3
"""or-difficult-airway A(단어·뉘앙스): base 위에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "or-difficult-airway"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

# ---- 쉬운 단어 태그 빼기 ----
REMOVE = {}
for x in "know see come go hand patient time now good".split():
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in "year look get make want tell back only too two".split():
    REMOVE["w-" + x] = f"목록 밖 판단({x})"
touched = {}
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE]
        if new != x["words"]:
            x["words"] = new
            touched[(s["title"], i)] = "쉬운 단어 태그 정리"
# 문장 뜻과 맞지 않는 헤드워드 태그 빼기
UNTAG = [
    ("w-right", "이 병력을 마취과에 곧바로 알릴게요."),
    ("w-right", "Everyone move"),
    ("w-on", "I'm on suction"),
]
for wid, key in UNTAG:
    for s in doc["situations"]:
        for i, x in enumerate(s["sentences"]):
            if wid in x["words"] and (key in x["en"] or key in x["ko"]):
                x["words"] = [w for w in x["words"] if w != wid]
                touched[(s["title"], i)] = f"{wid} 태그를 문장 뜻에 맞게 정리(right away·right now의 right, on suction의 on)"
for wid in REMOVE:
    assert not any(wid in x["words"] for s in doc["situations"] for x in s["sentences"]), wid
doc["words"] = [w for w in doc["words"] if w["id"] not in REMOVE]
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움 — {why}; 어느 문장도 태그하지 않게 됐다"})
bank = {w["id"]: w for w in doc["words"]}

# ---- 단어 ko 정리 ----
KO_EDITS = {
    "w-check": ("점검하다", "w-confirm과 ko(확인하다)가 같아 듣고 뜻 고르기에서 정답이 둘 — check는 살펴 점검하는 쪽"),
    "w-note": ("메모하다", "w-document·w-record와 ko(기록하다)가 겹쳐 정답이 셋 — note는 짧게 메모"),
    "w-document": ("문서로 남기다", "w-note와 ko(기록하다)가 같아 정답이 둘 — document는 차트·서류에 문서로 남기는 쪽"),
    "w-hard": ("힘든", "w-difficult와 ko(어려운)가 같아 정답이 둘 — hard는 '힘든'"),
    "w-begin": ("착수하다", "w-start와 ko(시작하다)가 같아 정답이 둘 — begin은 착수하다"),
    "w-have": ("보유하다", "w-got(가지고 있다)와 ko(가지다)가 겹쳐 정답이 둘 — have는 'a good reserve'를 보유하다"),
    "w-sats": ("포화도 수치(구어)", "w-saturation과 ko(산소포화도)가 같아 정답이 둘 — sats는 구어로 쓰는 수치"),
    "w-job": ("맡은 일", "w-role과 ko(역할)가 겹쳐 정답이 둘 — job은 각자 맡은 일"),
    "w-try": ("해 보다", "w-attempt(시도)와 ko(시도하다)가 겹쳐 정답이 둘 — try는 동사 '해 보다'"),
    "w-right": ("알맞은", "w-away(곧바로)와 ko(바로)가 겹쳐 정답이 둘 — right는 크기에 알맞은 쪽"),
    "w-advance": ("전진시키다", "w-railroad와 ko(밀어 넣다)가 같아 정답이 둘 — advance는 관을 앞으로 나아가게 하다"),
    "w-flag": ("짚어 알리다", "ko가 길어(알리다/표시하다) 오답과 길이가 맞지 않고 w-call·w-alert와도 겹침 — flag는 문제를 짚어 알리는 쪽"),
    "w-bag": ("백으로 환기하다", "ko가 길고 설명조(백을 짜서 환기시키다) — 백으로 환기하다"),
    "w-unsure": ("확신 없는", "확실하지 않은 → 오답과 길이를 맞추기 쉬운 짧은 말(확신 없는)"),
    "w-prep": ("대비하다", "w-ready(준비된)와 ko(준비하다)가 겹쳐 정답이 둘 — prep for code는 대비하다"),
    "w-code": ("심정지 코드", "코드(심정지 대응) → 심정지 코드(병원 코드 호출)"),
    "w-railroad": ("부지 따라 밀다", "ko가 길어(괄호 설명) 오답과 길이가 맞지 않고 w-advance와 겹침 — railroad는 부지를 따라 밀다"),
    "w-open": ("열다", "태그된 문장 대부분이 kit·cric kit를 '열다'(입을 벌리다는 한 문장뿐)"),
    "w-plan": ("계획", "태그된 문장 대부분이 명사 plan(plan A, next plan, failed airway plan)"),
    "w-move": ("넘어가다", "태그된 문장 대부분이 '다음 단계로 넘어가다'(move to the next plan 등)"),
    "w-work": ("통하다", "태그된 문장이 모두 'doesn't work·what worked'처럼 '통하다'"),
    "w-number": ("수", "'set number of attempts'·'attempt number two' — 횟수는 w-attempt와 겹친다"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
for (title, i), why in touched.items():
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": why})

# ---- v45 단어 필드 ----
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
    if len(v["chips"]) == 1 and len(v["chips"][0]) > 1:
        pool = list(v["chips"][0]) + list(v["decoyChips"])
        for r in range(1, 5):
            for combo in itertools.permutations(range(len(pool)), r):
                if "".join(pool[j] for j in combo) == w["en"] and [pool[j] for j in combo] != list(v["chips"][0]):
                    print("ALT PATH", w["id"], [pool[j] for j in combo])

# ---- 뉘앙스 ----
nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for title, lst in (yaml.safe_load(io.open(f, encoding="utf-8")) or {}).items():
        assert title not in nu, f"dup {title}"
        nu[title] = lst
titles = [s["title"] for s in doc["situations"]]
print("unknown nuance titles:", sorted(set(nu) - set(titles)))
for s in doc["situations"]:
    tagged = {x for t in s["sentences"] for x in t["words"]}
    if len(tagged) < 8:
        print("V3 RISK", s["title"], len(tagged))
    if s["title"] in nu:
        s["nuance"] = nu[s["title"]]
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
