#!/usr/bin/env python3
"""or-preop-verification A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리(쉬운 단어 태그 빼기·ko·태그)를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "or-preop-verification"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

LIST = "name today morning know see come patient body room time".split()
JUDGE = "make say look here put water red yesterday".split()
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"너무 쉬움 — 목록 밖 판단({x})"

# 특정 문장에서만 태그 빼기: 헤드워드 뜻과 다르게 쓰인 곳
UNTAG = {
    "You can change your mind at any point, even right now.": ("w-point", "'시점' 뜻이라 가리키다 카드와 맞지 않음"),
    "There's no time for a full consent — we need to move now.": ("w-full", "'완전한' 뜻이라 가득 찬 카드와 맞지 않음"),
    "You followed instructions and stopped eating after midnight, correct?": ("w-correct", "'맞나요' 뜻이라 올바른(형용사) 카드와 맞지 않음"),
    "I won't proceed until this is corrected.": ("w-correct", "동사(정정되다)라 올바른(형용사) 카드와 맞지 않음"),
    "We correct the paperwork now, before anyone signs anything else.": ("w-correct", "동사(정정하다)라 올바른(형용사) 카드와 맞지 않음"),
    "I'm halting everything until we correct this.": ("w-correct", "동사(정정하다)라 올바른(형용사) 카드와 맞지 않음"),
    "We proceed under emergency consent — I'm charting it now.": ("w-chart", "동사(기록하다)라 명사 카드와 맞지 않음"),
    "This helps us make sure we have the right patient before surgery.": ("w-right", "'맞는' 뜻이라 오른쪽의 카드와 맞지 않음"),
    "Can you look at the mark and tell me if that's the right spot?": ("w-right", "'맞는' 뜻이라 오른쪽의 카드와 맞지 않음"),
    "You have every right to change your mind.": ("w-right", "'권리' 뜻이라 오른쪽의 카드와 맞지 않음"),
}
touched = {}
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE]
        u = UNTAG.get(x["en"])
        if u and u[0] in new:
            new.remove(u[0])
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
for t, (wid, why) in UNTAG.items():
    pass

KO_EDITS = {
    "w-right": ("오른쪽의", "태그 문장 대부분이 right knee·right eye·right side(오른쪽)라 '맞는'보다 오른쪽의가 맞다 — 예문도 knee 문장으로"),
    "w-correct": ("올바른", "w-exact와 ko(정확한)가 같아 정답이 둘 — correct는 쪽·부위가 맞다는 올바른"),
    "w-mark": ("표시(하다)", "문장이 명사(mark·marking)와 동사(marked·mark)로 함께 쓰여 표시(하다)로"),
    "w-check": ("점검하다", "w-confirm·w-verify와 ko(확인하다)가 같아 정답이 셋 — check는 눈으로 살펴 점검하는 쪽"),
    "w-verify": ("검증하다", "w-confirm·w-check와 ko(확인하다)가 같아 정답이 셋 — verify는 기준과 대조해 검증하는 쪽"),
    "w-count": ("간주되다", "w-cover와 ko(포함하다/포함되다)가 거의 같아 정답이 둘 — count는 '그것도 한 것으로 친다'"),
    "w-note": ("적어 두다", "w-record(기록)·w-document와 ko가 겹쳐 — note는 짧게 적어 두는 쪽"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    fields = ["ko"]
    if wid == "w-right":
        bank[wid]["example"] = "So that's your right knee — let me confirm with your chart."
        fields.append("example")
    changes.append({"kind": "word", "id": wid, "fields": fields, "why": why})
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
    # 조각으로 정답 철자 다시 만들기(낱말 단위 + 전체 이어 붙이기)
    pool = [p for word in v["chips"] for p in word] + list(v["decoyChips"])
    target = w["en"].replace(" ", "")
    orig = [p for word in v["chips"] for p in word]
    for r in range(1, 7):
        for combo in itertools.permutations(range(len(pool)), r):
            if "".join(pool[j] for j in combo) == target and [pool[j] for j in combo] != orig:
                print("ALT PATH", w["id"], [pool[j] for j in combo])
    # 한 낱말 안에서 낱말 사이 칸이 안 맞는 경로 포함 위 검사로 충분

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
