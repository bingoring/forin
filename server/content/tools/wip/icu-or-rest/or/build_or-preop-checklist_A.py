#!/usr/bin/env python3
"""or-preop-checklist A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "or-preop-checklist"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

LIST = "name today time minute morning patient family know go".split()
JUDGE = "both help high low short left right second".split()
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"목록 밖 판단({x})"

UNTAG = {
    "We should hold the case until this is corrected.": [("w-correct", "'바로잡다'(동사) 뜻이라 '맞는' 카드와 맞지 않음")],
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

HEAD = {
    "w-heavy": ("heavily", "/ˈhɛvɪli/", "심하게", "문장은 bleeding heavily(부사) — 헤드워드를 부사로"),
}
for wid, (en, ipa, ko, why) in HEAD.items():
    w = bank[wid]
    w["en"], w["ipa"], w["ko"] = en, ipa, ko
    changes.append({"kind": "word", "id": wid, "fields": ["en", "ipa", "ko"], "why": why})

KO_EDITS = {
    "w-check": ("점검하다", "w-confirm(확인하다)·w-verify와 ko가 겹쳐 — check는 살펴 점검하다"),
    "w-flag": ("표시해 두다", "w-label과 ko(표시하다)가 같아 정답이 둘 — flag는 눈에 띄게 표시해 두다"),
    "w-label": ("이름표를 붙이다", "w-flag와 ko(표시하다)가 같아 정답이 둘 — label은 이름표를 붙이다"),
    "w-run": ("들어가다", "w-flow와 ko(흐르다)가 같아 정답이 둘 — IV가 running은 수액이 들어가는 중"),
    "w-burn": ("화끈거리다", "문장은 burning(화끈거림 증상) — 타는 듯하다보다 화끈거리다"),
    "w-critical": ("중대한", "문장 ko가 '꼭 필요한 수치' — critical은 위중이 아니라 결정적으로 중대한(w-critically와도 가름)"),
    "w-timing": ("시점", "w-time(삭제)과 겹치던 '시각' 대신 시점"),
    "w-number": ("숫자", "w-level·w-value와 ko(수치)가 같아 정답이 셋 — number는 숫자"),
    "w-value": ("측정값", "w-level·w-number와 ko(수치)가 같아 정답이 셋 — value는 측정값"),
    "w-replacement": ("치환술", "joint replacement는 인공관절 치환술"),
    "w-correct": ("맞는", "문장은 correct side(형용사) — 괄호의 동사 뜻은 뺌(동사 문장은 태그를 뺌)"),
    "w-clear": ("트인", "문장은 airway clear(트여 있다) — 괄호 줄임"),
    "w-release": ("불출하다", "혈액은행이 혈액을 내주는 말은 불출하다(방출은 어색)"),
    "w-cut": ("가르다", "w-incision(절개)과 ko가 겹쳐 — cut은 피부를 가르다"),
    "w-push": ("밀어 넣다", "w-give·w-infuse와 ko가 겹쳐 — push는 주사기를 밀어 넣다"),
    "w-give": ("투여하다", "w-push와 ko(투여하다)가 겹쳐 push를 가르며 give를 투여하다로 정리"),
    "w-draw": ("약을 뽑다", "괄호 줄임 — 주사기로 약을 뽑다"),
    "w-record": ("기록 문서", "w-document(기록하다)와 ko가 겹쳐 — record는 기록 문서"),
    "w-reach": ("연락하다", "문장은 reach the family(연락하다) — 연락이 닿다보다 연락하다"),
    "w-prevention": ("예방 조치", "w-prevent(예방하다)와 ko가 겹쳐 — prevention은 예방 조치"),
    "w-risk": ("위험성", "w-dangerous(위험한)와 ko가 겹쳐 — risk는 위험성"),
    "w-order": ("지시", "괄호 줄임 — 의사의 지시(오더)"),
    "w-treat": ("다루다", "괄호 줄임 — 취급하다는 뜻이 같다"),
    "w-bipolar": ("양극성의", "괄호 줄임 — bipolar(양극성) 소작"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어 태그 정리 / 헤드워드와 뜻이 다른 태그 빼기"})

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
    if s["title"] in nu:
        s["nuance"] = nu[s["title"]]
        tagged = {x for t in s["sentences"] for x in t["words"]}
        print(s["title"], "distinct words:", len(tagged))
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
