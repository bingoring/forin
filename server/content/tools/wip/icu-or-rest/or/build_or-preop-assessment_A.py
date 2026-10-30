#!/usr/bin/env python3
"""or-preop-verification A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리(쉬운 단어 태그 빼기·ko·태그)를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "or-preop-assessment"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

LIST = "time now today morning night home name room family body head know see bad good day".split()
JUDGE = "get make look bed back face which kind sure".split()
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"너무 쉬움 — 목록 밖 판단({x})"
# family·know: 문장 '...anyone else in the family' 가 다른 태그를 잃지 않게 anyone을 남기고 family는 뺀다 (아래 assert가 비는 문장을 잡는다)

# 특정 문장에서만 태그 빼기: 헤드워드 뜻과 다르게 쓰인 곳
UNTAG = {
    "It's easy to forget that even a sip of water counts as breaking your fast.": ("w-fast", "명사(금식)라 빠른(형용사) 카드와 맞지 않음"),
    "Being short of breath during daily activity is a big red flag for us.": ("w-flag", "명사(위험 신호)라 표시하다(동사) 카드와 맞지 않음"),
    "I'll make sure anesthesia has your full cardiac history.": ("w-full", "'전체의' 뜻이라 가득 찬 카드와 맞지 않음"),
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

KO_EDITS = {
    "w-count": ("(~로) 치다", "w-assume(간주하다)과 ko가 겹쳐 — count는 '그것도 한 것으로 친다'"),
    "w-flag": ("표시를 달다", "w-mark와 ko(표시하다)가 같아 정답이 둘 — flag는 눈에 띄는 표식을 다는 쪽"),
    "w-mark": ("표시해 두다", "w-flag와 ko(표시하다)가 같아 정답이 둘 — mark는 표시해 두는 쪽"),
    "w-whole": ("전체의", "w-full과 ko가 같아 정답이 둘 — whole은 빠짐없는 전체(그대로)"),
    "w-full": ("가득 찬", "w-whole과 ko(전체의)가 같아 정답이 둘 — 문장 대부분이 full stomach(가득 찬)라 예문도 그 문장으로", "We should treat this as a full stomach — RSI it is."),
    "w-right": ("알맞은", "w-exact·w-accurate와 ko(정확한)가 같아 정답이 셋 — right는 'the right dose·precautions'(알맞은)"),
    "w-accurate": ("정밀한", "w-exact와 ko(정확한)가 같아 정답이 둘 — accurate는 오차 없이 정밀한"),
    "w-note": ("메모하다", "w-write·w-record·w-document와 ko(기록하다)가 겹쳐 — note는 짧게 메모"),
    "w-write": ("적다", "w-note·w-record·w-document와 ko(기록하다)가 겹쳐 — write down은 받아 적다"),
    "w-record": ("기록으로 남기다", "w-note·w-write·w-document와 ko(기록하다)가 겹쳐 — record는 기록으로 남기다"),
    "w-document": ("문서로 남기다", "w-note·w-write·w-record와 ko(기록하다)가 겹쳐 — document는 문서에 남기다"),
    "w-hard": ("힘든", "w-difficult와 ko(어려운)가 같아 정답이 둘 — hard는 애가 쓰이는 힘든"),
    "w-difficult": ("까다로운", "w-hard와 ko(어려운)가 같아 정답이 둘 — difficult airway는 까다로운 기도"),
    "w-injection": ("주사제", "w-shot과 ko(주사)가 같아 정답이 둘 — injection은 주사제(약)"),
    "w-shot": ("주사(한 대)", "w-injection과 ko(주사)가 같아 정답이 둘 — shot은 맞는 주사 한 대"),
    "w-number": ("숫자", "w-level과 ko(수치)가 같아 정답이 둘 — number는 숫자·측정값"),
    "w-level": ("수준(농도)", "w-number와 ko(수치)가 같아 정답이 둘 — level은 산소 수준"),
    "w-drug": ("약제", "w-medication과 ko(약물)가 같아 정답이 둘 — drug은 마취약 같은 약제"),
    "w-check": ("점검하다", "w-confirm(확정하다)과 가까워 — check는 눈으로 살펴 점검하는 쪽"),
    "w-shift": ("밀리다", "'timing might need to shift'(시간이 밀리다)에 맞춰 — 옮기다는 물건 옮기기로 읽힘"),
    "w-away": ("즉시", "'right away' 한 구에서만 쓰이는데 ko에 영어를 섞어 길어서 즉시로"),
    "w-cpap": ("양압기", "CPAP은 수면무호흡기가 아니라 지속적 기도양압기"),
    "w-picture": ("전체 모습", "'honest picture'의 그림은 비유라 전체 모습으로"),
}
for wid, t in KO_EDITS.items():
    ko, why = t[0], t[1]
    bank[wid]["ko"] = ko
    fields = ["ko"]
    if len(t) > 2:
        bank[wid]["example"] = t[2]
        fields.append("example")
    changes.append({"kind": "word", "id": wid, "fields": fields, "why": why})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어 태그 정리 / 헤드워드와 뜻이 다른 태그 빼기"})

EXKO = {"w-thin": "일부 한약 보조제는 처방약처럼 피를 묽게 만들 수 있어요."}
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
    w["exKo"] = EXKO.get(w["id"]) or sko[w["example"]]
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
