#!/usr/bin/env python3
"""core-language-or A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "core-language-or"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

LIST = "hour minute time now home patient family hand know go see zero ten".split()
JUDGE = "let here get use take say all way sorry okay".split()   # 목록 밖 판단 10개
PHRASE = {"away": "right away는 right에 묶고 away는 따로 가르치지 않음 — w-immediately(즉시)와 ko도 겹침",
          "over": "go over 구의 일부 — 단독 카드(살펴서)로는 뜻이 흐림",
          "down": "slow down을 w-slow 한 카드(속도를 늦추다)로 묶음 — 단독 down(아래로)은 뜻이 틀림"}
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"너무 쉬움 — 목록 밖 판단({x})"
for x, why in PHRASE.items():
    REMOVE["w-" + x] = why

UNTAG = {
    "Take all the time you need to process this.": ("w-process", "동사(받아들이다)라 명사(절차) 카드와 맞지 않음"),
    "We can't risk losing key information.": ("w-risk", "동사(무릅쓰다)라 명사(위험) 카드와 맞지 않음"),
    "Let's clarify this now, before we risk losing key information.": ("w-risk", "동사(무릅쓰다)라 명사(위험) 카드와 맞지 않음"),
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
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움/구에 묶음 — {why}; 어느 문장도 태그하지 않게 됐다"})
bank = {w["id"]: w for w in doc["words"]}

# 헤드워드를 제 모습으로
bank["w-set"].update({"en": "set up", "ipa": "/sɛt ʌp/"})
bank["w-slow"].update({"en": "slow down", "ipa": "/sloʊ daʊn/"})
changes.append({"kind": "word", "id": "w-set", "fields": ["en", "ipa", "ko"], "why": "문장은 set up the line — 구 단위 헤드워드로, 설치하다는 장비 설치로 읽혀 세팅하다로"})
changes.append({"kind": "word", "id": "w-slow", "fields": ["en", "ipa", "ko"], "why": "문장은 slow down(속도를 늦추다) — 형용사 slow 카드와 따로 뜻이 틀린 down 카드를 한 구로 묶음"})
bank["w-set"]["ko"] = "세팅하다"
bank["w-slow"]["ko"] = "속도를 늦추다"

KO_EDITS = {
    "w-back": ("되돌려", "w-again(다시)과 ko가 겹쳐 — explain it back·repeat back은 '되돌려' 말하기(teach-back)"),
    "w-check": ("점검하다", "w-confirm(확인하다)과 ko가 같아 정답이 둘 — check는 눈으로 살펴 점검하는 쪽"),
    "w-nothing": ("아무것도 없음", "w-anything과 ko(아무것도)가 같아 정답이 둘 — nothing은 하나도 없음"),
    "w-anything": ("무엇이든", "w-nothing과 ko(아무것도)가 같아 정답이 둘 — anything은 '무엇이든'(물음·부정문)"),
    "w-welcome": ("환영받는", "'is welcome to stay'는 머물러도 좋다는 뜻 — 환영하는이 아니라 환영받는"),
    "w-keep": ("계속하다", "keep trying·keep it simple — 유지하다보다 계속하다가 두 문장에 맞음"),
    "w-across": ("전달되어", "'get the essentials across'는 건너서가 아니라 상대에게 전달되는 것"),
    "w-flag": ("표시해 두다", "ko에 괄호로 뜻이 둘(표시하다/경고하다) — 차트에 눈에 띄게 표시해 두는 쪽으로 정리"),
    "w-arrange": ("마련하다", "w-prep(준비)과 ko가 겹쳐 — arrange a interpreter는 통역사를 마련·섭외"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어·구에 묶은 태그 정리 / 헤드워드와 뜻이 다른 태그 빼기"})

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
    pool = [p for word in v["chips"] for p in word] + list(v["decoyChips"])
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
