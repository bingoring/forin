#!/usr/bin/env python3
"""core-safety-or A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, re, yaml

T = "core-safety-or"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

# ---- 결정 11: 쉬운 단어 빼기 --------------------------------------------------------------
LIST = "patient room now time know see today nurse".split()                      # 공통 목록
JUDGE = "thing first next later thirty short fine still yet right".split()      # 목록 밖 판단 10개
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"너무 쉬움 — 목록 밖 판단({x})" if x != "right" else \
        "한 카드에 뜻 셋(맞는/오른쪽/제대로)이 묶였고 correct와 ko가 같음 — 너무 쉬워 뺌"

# 뜻이 다른 문장에서 태그 빼기 (situation, index) -> word
UNTAG = {
    ("이물 잔류 위기 대응", 1): ("w-close", "'We can't close'는 닫다 — close call(아슬아슬한) 카드와 뜻이 다름"),
    ("수술 화재 발생 대응", 4): ("w-call", "'hear the call'은 명사(외침) — 동사 call(부르다) 카드와 뜻이 다름"),
    ("wrong-site 임박 저지", 3): ("w-second", "'for one second'(초)와 달리 이 문장은 아님 — 확인 결과 초 뜻과 맞음, 다른 문장과 겹쳐 태그 유지 여부 재검"),
    ("계수 기본 참여", 5): ("w-miss", "'nothing gets missed'(놓치다)는 은행 카드 missing(없어진)과 뜻이 다름"),
}
del UNTAG[("wrong-site 임박 저지", 3)]       # 'one second'는 초 뜻이라 태그를 유지한다
UNTAG[("수술 화재 발생 대응", 3)] = ("w-second", "'the second I see the flame'은 하자마자(순간) — 시간 단위 초 카드와 뜻이 다름")

touched = {}
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE]
        u = UNTAG.get((s["title"], i))
        if u and u[0] in new:
            new.remove(u[0])
        if new != x["words"]:
            assert new, (s["title"], i, x["en"])
            x["words"] = new
            touched[(s["title"], i)] = True
for wid in REMOVE:
    assert not any(wid in x["words"] for s in doc["situations"] for x in s["sentences"]), wid
doc["words"] = [w for w in doc["words"] if w["id"] not in REMOVE]
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움/뜻이 흐림 — {why}; 어느 문장도 태그하지 않게 됐다"})
bank = {w["id"]: w for w in doc["words"]}

# ---- 헤드워드·ko 정리 ---------------------------------------------------------------------
# 구 단위 헤드워드
bank["w-heart"].update({"en": "by heart", "ipa": "/baɪ hɑːrt/", "ko": "외워서"})
changes.append({"kind": "word", "id": "w-heart", "fields": ["en", "ipa", "ko"], "why": "문장은 know by heart — 단독 heart(마음)가 아니라 by heart 구(외워서)로"})
bank["w-away"].update({"en": "right away", "ipa": "/raɪt əˈweɪ/", "ko": "즉시"})
changes.append({"kind": "word", "id": "w-away", "fields": ["en", "ipa", "ko"], "why": "두 문장 모두 right away — 단독 away(멀리)가 아니라 right away 구(즉시)로"})
bank["w-miss"].update({"en": "missing", "ipa": "/ˈmɪsɪŋ/", "ko": "없어진",
                       "example": "We're still missing one sponge."})
changes.append({"kind": "word", "id": "w-miss", "fields": ["en", "ipa", "ko", "example"],
                "why": "태그된 문장 셋이 missing(없어진·빠진) — 놓치다(miss) 카드와 뜻이 다름. 'nothing gets missed' 문장은 태그를 뺌"})
KO_EDITS = {
    "w-speak": ("말을 꺼내다", "say(말하다)와 ko가 같아 정답이 둘 — 문장은 모두 speak up(말을 꺼내다)"),
    "w-check": ("점검하다", "confirm(확인하다)과 ko가 같아 정답이 둘 — check는 눈으로 살펴 점검"),
    "w-doublecheck": ("재차 확인하다", "re-verify와 ko(다시 확인하다)가 같아 정답이 둘 — 거듭 대조해 확인하는 쪽"),
    "w-reverify": ("재검증하다", "double-check와 ko가 같아 정답이 둘 — 근거와 맞춰 다시 검증하는 쪽"),
    "w-begin": ("개시하다", "start(시작하다)와 ko가 같아 정답이 둘 — begin은 격식 있는 개시"),
    "w-pause": ("잠시 멈추다", "stop·halt와 ko(멈추다)가 같아 정답이 셋 — pause는 잠깐 세워 두는 것"),
    "w-halt": ("중단하다", "stop·pause와 ko(멈추다)가 같아 정답이 셋 — halt는 진행하던 일을 완전히 중단"),
    "w-full": ("빠짐없는", "whole(전체의)과 ko가 같아 정답이 둘 — full safety checklist는 빠짐없는"),
    "w-field": ("수술 필드", "site(부위)·side(쪽)와 겹치는 '부위'를 빼고 수술 필드(멸균 구역)로"),
    "w-side": ("쪽(좌·우)", "site(부위)와 겹치는 '부위'를 빼고 좌·우 쪽으로"),
    "w-dry": ("마르다", "문장은 'Let the prep dry'(동사) — 형용사 '마른'이 아니라 마르다"),
    "w-drape": ("수술포(덮다)", "명사(drapes)와 동사(draping)가 섞여 쓰임 — 둘을 함께 표시"),
    "w-mark": ("표시(하다)", "명사(The mark)와 동사(marked)가 섞여 쓰임 — 둘을 함께 표시"),
    "w-report": ("보고(하다)", "동사(report it)와 명사(safety report)가 섞여 쓰임 — 둘을 함께 표시"),
    "w-call": ("부르다", "외치다/부르다 두 뜻을 하나로 — shout(외치다)과 겹치지 않게 부르다만. 명사 문장은 태그를 뺌"),
    "w-close": ("아슬아슬한", "아슬아슬한/닫다 두 뜻 — close call 문장만 남기고 닫다 문장은 태그를 뺌"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"],
                    "why": "쉬운 단어 태그 빼기 / 헤드워드와 뜻이 다른 태그 빼기"})

# ---- 같은 ko 점검 -------------------------------------------------------------------------
kos = {}
for w in doc["words"]:
    kos.setdefault(w["ko"], []).append(w["en"])
print("dup ko:", {k: v for k, v in kos.items() if len(v) > 1})

# ---- 단어 v45 필드 ------------------------------------------------------------------------
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

BAD = set("""ass arse anal anus butt cum cunt cock dick fag fuck homo jizz naff nig piss porn rape shit slut sux tit tits twat wank whore
bra bonzo dork dwarf flog grope hearse hell lust oriental slay sow stab strangle tomb tramp underwear witch nasty
ax fool diss cun kus mex fec pint rip pall kill crypt margin lit quack stiff ale missile dix spic gin die dead gun shoot
poop sex bomb kiss drunk beer wine vodka rum corpse grave coffin funeral murder suicide""".split())
issues = []
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
        issues.append(("CHIPS!=en", w["id"], joined, w["en"]))
    flat = [p for word in v["chips"] for p in word]
    flatl = {p.lower() for p in flat}
    for dc in v["decoyChips"]:
        if dc.lower() in flatl:
            issues.append(("decoy is own fragment", w["id"], dc))
    if w["en"].lower() in v["cue"].lower():
        issues.append(("CUE leaks", w["id"]))
    pool = flat + [str(x) for x in v["decoyChips"]]
    target = w["en"].replace(" ", "")
    for r in range(1, 7):
        for combo in itertools.permutations(range(len(pool)), r):
            s_ = "".join(pool[j] for j in combo).lower()
            if s_ == target.lower() and [pool[j] for j in combo] != flat:
                issues.append(("ALT PATH", w["id"], [pool[j] for j in combo]))
            if r <= 3 and s_ in BAD and s_ != target.lower():
                issues.append(("BANNED COMBO", w["id"], [pool[j] for j in combo], s_))
    for o in list(v["distractorsEn"]) + list(v["decoyChips"]):
        if str(o).lower() in BAD:
            issues.append(("BANNED OPTION", w["id"], o))
    # 같은 ko 은행 단어를 서로의 오답으로 쓰지 않았는지
    for o in v["distractorsEn"]:
        if str(o) == w["en"]:
            issues.append(("dist==answer", w["id"], o))
print("word issues:", len(issues))
for i in issues:
    print("  ", i)

# ---- 뉘앙스 -------------------------------------------------------------------------------
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
