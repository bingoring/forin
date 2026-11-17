#!/usr/bin/env python3
"""core-family-or A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "core-family-or"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

LIST = "come time hour minute nurse family hand good know go see now".split()          # 공통 쉬운 단어 목록
JUDGE = "let here get take say way okay thing give".split()                           # 목록 밖 판단 9개
PHRASE = {
    "away": "right away는 right에 묶고 away는 따로 가르치지 않음",
    "down": "sit down을 w-sit 한 카드로 묶음 — 단독 down(아래로)은 뜻이 틀림",
    "out": "step out을 w-step 한 카드로 묶음 — 단독 out은 뜻이 흐림",
    "sure": "make sure를 w-make 한 카드로 묶음 — 단독 sure(확실한)와 make(만들다)는 이 구의 뜻이 아님",
}
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"너무 쉬움 — 목록 밖 판단({x})"
for x, why in PHRASE.items():
    REMOVE["w-" + x] = why

UNTAG = {
    "The surgeon is the right person to answer that question.": ("w-right", "여기서 right는 '알맞은'이라 바로(강조) 카드와 뜻이 다름"),
    "Sometimes it just takes extra time to do things right.": ("w-right", "여기서 right는 '제대로'라 바로(강조) 카드와 뜻이 다름"),
    "When you're ready, I can help with the next steps.": ("w-step", "여기서 step은 '절차(명사)'라 step out(자리를 비우다) 카드와 뜻이 다름"),
    "Please stay reachable in case we have news.": ("w-case", "in case는 '~할 경우를 대비해'라 수술 건(case) 카드와 뜻이 다름"),
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

# 구 단위 헤드워드로
PH = {
    "w-track": ("on track", "/ɑn træk/", "계획대로", "문장은 on track(계획대로 순조롭게) — 단독 track(궤도)은 뜻이 틀림"),
    "w-far": ("so far", "/soʊ fɑr/", "지금까지", "문장은 so far(지금까지) — 단독 far(멀리)는 뜻이 틀림"),
    "w-make": ("make sure", "/meɪk ʃʊr/", "확실히 하다", "세 문장 모두 make sure — 구 단위 헤드워드로(w-sure는 흡수)"),
    "w-sit": ("sit down", "/sɪt daʊn/", "앉다", "세 문장 모두 sit down — 구 단위 헤드워드로(w-down은 흡수)"),
    "w-step": ("step out", "/stɛp aʊt/", "자리를 비우다", "문장은 step out(자리를 비우다) — w-out은 흡수, 나가다(단계)는 뜻이 둘로 갈려 정리"),
}
for wid, (en, ipa, ko, why) in PH.items():
    bank[wid].update({"en": en, "ipa": ipa, "ko": ko})
    changes.append({"kind": "word", "id": wid, "fields": ["en", "ipa", "ko"], "why": why})

KO_EDITS = {
    "w-back": ("되돌아", "w-again(다시)과 ko가 같아 정답이 둘 — come/bring/take back은 '되돌아(오다·가다)'"),
    "w-run": ("진행되다", None),
    "w-progress": ("진척되다", "w-run(진행되다)과 ko가 같아 정답이 둘 — progress는 일이 앞으로 나아가는 쪽"),
    "w-completely": ("충분히", "w-fully와 ko(완전히)가 같아 정답이 둘 — 두 문장 모두 '충분히 이해할 만한·충분히 정당한'"),
    "w-fully": ("온전히", "w-completely와 ko(완전히)가 같아 정답이 둘 — fully support는 '온전히 지지'"),
    "w-like": ("~하고 싶다", "w-want(원하다)와 ko가 같아 정답이 둘 — if you'd like는 '~하고 싶으시면'"),
    "w-tell": ("전하다", "w-speak와 ko(말하다)가 같아 정답이 둘 — tell은 내용을 상대에게 전하는 쪽(say는 은행에서 뺌)"),
    "w-honor": ("지켜 주다", "w-respect와 ko(존중하다)가 같아 정답이 둘 — honor your request는 요청을 지켜 주는 것"),
    "w-matter": ("의미가 있다", "w-important(중요한)와 뜻이 겹쳐 — matter to you는 그 사람에게 의미가 있다는 뜻"),
    "w-settle": ("자리를 잡다", "w-stable(안정된)과 ko(안정되다)가 거의 같아 정답이 둘 — settled in recovery는 회복실에 자리를 잡은 것"),
    "w-afterward": ("나중에", "w-after(~후에)와 ko(그 후에)가 거의 같아 정답이 둘 — afterward는 '나중에·그 뒤에'"),
    "w-everyone": ("모든 사람", "w-everything(모든 것)과 ko(모두)가 겹쳐 — everyone은 사람 전부"),
    "w-sorry": ("안타까운", "'sorry for your loss'는 사과(미안한)가 아니라 애도 — 안타까운으로 정리"),
    "w-right": ("바로", "tag된 문장 대부분이 right here·right now·right beside처럼 '바로'(강조) — '제대로(된)'는 두 문장뿐이라 그 둘은 태그를 뺌"),
    "w-case": ("수술 건", "earlier case는 앞 수술(건)을 뜻함 — in case(경우) 문장은 태그를 뺌"),
}
for wid, (ko, why) in KO_EDITS.items():
    if why is None:
        continue
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
        for q in s["nuance"]:
            off = [x for x in q.get("words", []) if x not in tagged]
            if off:
                print("V15 risk", s["title"], q["kind"], off)
            if q["kind"] == "context":
                for sc in q["scenes"]:
                    if q["word"].lower() not in sc["en"].lower():
                        print("W14 risk", s["title"], q["word"], "|", sc["en"])
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
