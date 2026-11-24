#!/usr/bin/env python3
"""or-minimally-invasive A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "or-minimally-invasive"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

LIST = "patient know head room".split()
JUDGE = "want need high help face neck skin down move".split()
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"목록 밖 판단({x})"

# 뜻이 갈리는 태그 빼기: (문장 en) -> [(단어 id, 이유)]
UNTAG = {
    "We may need to lower the insufflation pressure.": [("w-low", "'낮추다'(동사 lower)라 '낮은' 카드와 품사가 다름")],
    "We need to lower the pressure immediately.": [("w-low", "'낮추다'(동사 lower)라 '낮은' 카드와 품사가 다름")],
    "Let's release the clamps by hand.": [("w-hand", "'손으로'는 쉬운 뜻 — w-hand는 '일손'(extra hands)으로 정리")],
}
touched = {}
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE]
        for wid, _ in UNTAG.get(x["en"], []):
            if wid in new:
                new.remove(wid)
        if new != x["words"]:
            x["words"] = new
            touched[(s["title"], i)] = True
            assert new, (s["title"], i, x["en"])
for wid in REMOVE:
    assert not any(wid in x["words"] for s in doc["situations"] for x in s["sentences"]), wid
doc["words"] = [w for w in doc["words"] if w["id"] not in REMOVE]
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움 — {why}; 어느 문장도 태그하지 않게 됐다"})
bank = {w["id"]: w for w in doc["words"]}

KO_EDITS = {
    "w-check": ("점검하다", "w-confirm과 ko(확인하다)가 같아 정답이 둘 — check는 살펴 점검하다"),
    "w-prep": ("준비 작업을 하다", "w-prepare와 ko(준비하다)가 같아 정답이 둘 — prep은 소독·정리 같은 준비 작업"),
    "w-quickly": ("신속하게", "w-fast와 ko(빠르게)가 같아 정답이 둘 — quickly는 신속하게"),
    "w-lock": ("잠그다", "w-secure와 ko(고정하다)가 겹쳐 — lock은 잠그다"),
    "w-tuck": ("몸 옆에 끼워 넣다", "w-secure·w-lock과 ko(고정하다)가 겹쳐 — tuck은 끼워 넣다"),
    "w-keep": ("유지하다(두다)", "w-stay·w-hold와 ko(유지하다)가 겹쳐 — keep은 유지하다(두다)"),
    "w-stay": ("~한 채로 있다", "w-keep·w-hold와 ko(유지하다)가 겹쳐 — stay는 그 상태로 있다"),
    "w-hold": ("누르고 있다", "w-keep·w-stay와 ko(유지하다)가 겹쳐 — hold pressure는 누르고 있다"),
    "w-grab": ("집어 오다", "w-bring과 ko(가져오다)가 겹쳐 — grab은 집어 오다"),
    "w-read": ("(눈금이) 가리키다", "w-show와 ko(나타내다)가 같아 정답이 둘 — gauge reads는 눈금이 가리키다"),
    "w-show": ("보이다(표시하다)", "w-read와 ko(나타내다)가 같아 정답이 둘 — show는 화면에 보이다"),
    "w-site": ("자리(곳)", "w-area와 ko(부위)가 겹쳐 — site는 자리"),
    "w-pneumoperitoneum": ("복강 내 가스(기복 상태)", "w-insufflation(기복)과 ko가 같아 정답이 둘 — 복강 안에 가스가 찬 상태"),
    "w-call": ("부르다(호출하다)", "w-tell과 ko(알리다)가 겹쳐 — call은 호출하다"),
    "w-tell": ("말하다(알려 주다)", "w-call과 ko(알리다)가 겹쳐 — tell은 말로 알려 주다"),
    "w-clear": ("맑은(선명한)", "w-sharp와 ko(선명한/또렷한)가 겹쳐 — clear는 맑은"),
    "w-tubing": ("튜빙(관)", "w-connection(연결부)과 ko(연결부)가 겹쳐 — tubing은 관"),
    "w-bleed": ("출혈(하다)", "문장은 bleeding(명사) — 헤드워드 뜻을 명사 쪽으로"),
    "w-pad": ("패딩(패드)", "문장은 padding(명사) — 헤드워드 뜻을 명사 쪽으로"),
    "w-hand": ("일손", "extra hands·set of hands(일손) 구로 남김 — 'by hand' 태그는 뺌"),
    "w-complete": ("빠짐없는", "w-intact(온전한)와 뜻이 겹쳐 — complete는 빠짐없는"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어 태그 정리 / 헤드워드와 뜻이 다른 태그 빼기"})

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
    w["cue"], w["tag"] = v["cue"], v["tag"]
    w["distractorsEn"], w["distractorsKo"] = v["dEn"], v["dKo"]
    w["chips"], w["decoyChips"] = v["chips"], v["dc"]
    w["exKo"] = sko[w["example"]]
    joined = " ".join("".join(p) for p in v["chips"])
    if joined != w["en"]:
        print("CHIPS!=en", w["id"], joined, "|", w["en"])
    flat = {p.lower() for word in v["chips"] for p in word}
    for dc in v["dc"]:
        if dc.lower() in flat:
            print("decoy is own fragment", w["id"], dc)
    if w["en"].lower() in v["cue"].lower():
        print("CUE leaks", w["id"])
    pool = [p for word in v["chips"] for p in word] + list(v["dc"])
    target = w["en"].replace(" ", "")
    orig = [p for word in v["chips"] for p in word]
    for r in range(1, 7):
        for combo in itertools.permutations(range(len(pool)), r):
            if "".join(pool[j] for j in combo) == target and [pool[j] for j in combo] != orig:
                print("ALT PATH", w["id"], [pool[j] for j in combo])

nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for title, lst in (yaml.safe_load(io.open(f, encoding="utf-8")) or {}).items():
        assert title not in nu, f"dup {title}"
        nu[title] = lst
titles = [s["title"] for s in doc["situations"]]
print("unknown nuance titles:", sorted(set(nu) - set(titles)))
for s in doc["situations"]:
    tagged = {x for t in s["sentences"] for x in t["words"]}
    print(s["title"], "distinct words:", len(tagged))
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
