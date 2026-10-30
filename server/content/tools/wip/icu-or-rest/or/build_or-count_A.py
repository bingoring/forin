#!/usr/bin/env python3
"""or-count A(단어·뉘앙스): base를 읽어 v45 단어 필드·nuance를 얹고 결정 11 정리(쉬운 단어 태그 빼기·헤드워드·ko)를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, os, yaml

T = "or-count"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []
bank = {w["id"]: w for w in doc["words"]}

# ---- 결정 11 (1) 너무 쉬운 단어: 문장 words에서 태그를 빼고, 어느 문장도 안 쓰면 은행에서 지운다 ----
REMOVE = {
    "w-time": "공통 쉬운 단어 목록(time)", "w-see": "공통 쉬운 단어 목록(see)", "w-room": "공통 쉬운 단어 목록(room)",
    "w-patient": "공통 쉬운 단어 목록(patient)", "w-hand": "공통 쉬운 단어 목록(hand)", "w-know": "공통 쉬운 단어 목록(know)",
    "w-make": "너무 쉬움 — 목록 밖 판단(make)", "w-get": "너무 쉬움 — 목록 밖 판단(get)", "w-say": "너무 쉬움 — 목록 밖 판단(say)",
    "w-look": "너무 쉬움 — 목록 밖 판단(look)", "w-move": "너무 쉬움 — 목록 밖 판단(move)",
}
# ---- (2) 새 단어: 상황당 서로 다른 단어 8개(V3)를 지키려고, 문장에 이미 있는 말 ----
NEW = {"id": "w-done", "en": "done", "ipa": "/dʌn/", "ko": "끝낸", "icon": "check",
       "example": "Please hand me the needle as soon as you're done."}
ADD_TAG = {"Please hand me the needle as soon as you're done.": "w-done"}
touched = {}  # (situation, index) -> 이유
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE]
        if x["en"] in ADD_TAG:
            new.append(ADD_TAG[x["en"]])
        if new != x["words"]:
            x["words"] = new
            touched[(s["title"], i)] = True
for wid in REMOVE:
    used = any(wid in x["words"] for s in doc["situations"] for x in s["sentences"])
    assert not used
doc["words"] = [w for w in doc["words"] if w["id"] not in REMOVE] + [copy.deepcopy(NEW)]
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움 — {why}; 어느 문장도 태그하지 않게 됐다"})
changes.append({"kind": "word-add", "id": "w-done", "why": "바늘 회수 확인 상황이 hand 태그를 빼면 단어 6개(V3 8개 미만) — 그 상황 문장 'as soon as you're done'에 이미 있는 말"})
bank = {w["id"]: w for w in doc["words"]}

# ---- (3) 단어 ko·헤드워드 ----
KO_EDITS = {
    "w-begin": ("개시하다", "w-start와 ko(시작하다)가 같아 듣고 뜻 고르기에서 정답이 둘 — begin은 본격적으로 개시하는 쪽"),
    "w-check": ("점검하다", "w-confirm·w-verify와 ko(확인하다)가 같아 정답이 셋 — check는 눈으로 살펴 점검하는 쪽"),
    "w-verify": ("검증하다", "w-confirm·w-check와 ko(확인하다)가 같아 정답이 셋 — verify는 기준과 대조해 검증하는 쪽"),
    "w-note": ("메모하다", "w-record·w-log와 ko(기록하다)가 같아 정답이 셋 — note는 짧게 메모해 두는 쪽"),
    "w-log": ("기입하다", "w-record·w-note와 ko(기록하다)가 같아 정답이 셋 — log는 대장에 올려 기입하는 쪽"),
    "w-extra": ("여분의", "w-additional과 ko(추가의)가 같아 정답이 둘 — extra는 계획보다 더 나온 여분"),
    "w-call": ("부르다", "w-declare와 ko(선언하다)가 같아 정답이 둘 — call은 소리 내어 부르는 쪽(declare는 선언)"),
    "w-match": ("일치하다", "태그 문장이 모두 '목록·총계와 일치한다'는 뜻이라 대조하다보다 일치하다가 맞다"),
    "w-retain": ("잔류하다", "잔류시키다는 타동사 형태라 'retained sponge(잔류한 거즈)' 문장과 맞지 않는다"),
    "w-fragment": ("파편", "w-piece와 ko(조각)가 같아 정답이 둘 — fragment는 깨지거나 부러져 나온 파편"),
    "w-component": ("구성품", "w-part와 ko(부품)가 같아 정답이 둘 — component는 기구를 이루는 구성품"),
    "w-pick": ("이어 가다", "w-restart와 ko(다시 시작하다)가 같아 정답이 둘 — 'pick up'은 중단한 자리에서 이어 가는 것"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
HEAD = {  # 형용사 헤드워드에 부사 문장만 묶여 있던 것 → 부사로 (id는 그대로)
    "w-systematic": ("systematically", "/ˌsɪstəˈmætɪkli/", "체계적으로"),
    "w-careful": ("carefully", "/ˈkɛrfəli/", "조심스럽게"),
    "w-immediate": ("immediately", "/ɪˈmiːdiətli/", "즉시"),
    "w-proper": ("properly", "/ˈprɑːpərli/", "제대로"),
}
for wid, (en, ipa, ko) in HEAD.items():
    w = bank[wid]
    assert en in w["example"], wid
    w["en"], w["ipa"], w["ko"] = en, ipa, ko
    changes.append({"kind": "word", "id": wid, "fields": ["en", "ipa", "ko"], "why": f"태그된 문장이 모두 부사({en})로 쓰여 헤드워드를 부사로"})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어 태그 정리"})

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
    # 조각으로 정답 철자 다시 만들기: 한 낱말 단어의 조각(정답 조각 + 오답 조각)으로 en을 만드는 다른 조합
    if len(v["chips"]) == 1 and len(v["chips"][0]) > 1:
        pool = list(v["chips"][0]) + list(v["decoyChips"])
        target = w["en"]
        import itertools
        n = len(v["chips"][0])
        for r in range(1, 5):
            for combo in itertools.permutations(range(len(pool)), r):
                if "".join(pool[j] for j in combo) == target and [pool[j] for j in combo] != list(v["chips"][0]):
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
