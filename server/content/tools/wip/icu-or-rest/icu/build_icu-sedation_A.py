#!/usr/bin/env python3
"""icu-sedation A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-sedation.A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy, re
T = "icu-sedation"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

FIX = {
  "w-light": dict(ko="가벼운"),
  "w-sustain": dict(ko="지속하다"),
  "w-hold": dict(ko="고수하다"),
  "w-target": dict(ko="목표치"),
  "w-check": dict(ko="점검하다"),
  "w-pause": dict(ko="잠시 멈추다"),
  "w-stop": dict(ko="중단하다"),
  "w-rise": dict(ko="올라가다"),
  "w-adequate": dict(ko="적절한"),
  "w-drip": dict(ko="점적 주입"),
  "w-settle": dict(ko="가라앉다"),
  "w-put": dict(ko="(수치에) 놓다"),
  "w-open": dict(ko="뜨다/열다"),
  "w-multimodal": dict(ko="다중 방식의"),
  "w-awareness": dict(ko="의식 인지"),
  "w-stay": dict(ko="머무르다"),
  "w-need": dict(ko="필요하다"),
  "w-climb": dict(ko="서서히 오르다"),
}
WHY = {
  "w-light": "ko '가벼운/얕은'의 '얕은'이 w-shallow '얕은'과 겹쳐 듣고 뜻 고르기에서 정답이 둘이 된다 — light는 '가벼운'으로 가름",
  "w-sustain": "ko '유지하다'가 w-hold·w-keep과 같아 정답이 셋이 된다 — sustain은 '지속하다'로 가름",
  "w-hold": "ko '유지하다'가 w-sustain·w-keep과 같다 — hold(속도·목표를 지키다)는 '고수하다'로 가름",
  "w-target": "ko '목표'가 w-goal과 같아 정답이 둘이 된다 — target은 '목표치'로 가름",
  "w-check": "ko '확인하다'가 w-confirm과 같아 정답이 둘이 된다 — check는 '점검하다'로 가름",
  "w-pause": "ko '멈추다'가 w-stop과 같아 정답이 둘이 된다 — pause는 '잠시 멈추다'로 가름",
  "w-stop": "ko '멈추다'가 w-pause와 같아 정답이 둘이 된다 — stop은 '중단하다'로 가름",
  "w-rise": "ko '오르다'가 w-climb과 같아 정답이 둘이 된다 — rise는 '올라가다'로 가름",
  "w-adequate": "ko '충분한'이 w-enough와 같아 정답이 둘이 된다 — adequate는 '적절한'으로 가름",
  "w-drip": "ko '(정맥) 주입'이 w-infusion '주입'과 거의 같다 — drip은 '점적 주입'으로 가름",
  "w-settle": "ko '안정되다'가 w-stable '안정적인'과 겹친다 — settle(들뜬 것이 가라앉다)은 '가라앉다'로 가름",
  "w-put": "ko '놓다/두다'는 'puts him at minus two'(점수에 해당시키다) 뜻을 못 담는다",
  "w-open": "ko '뜨다'는 'Open the airway'(기도를 열다) 문장을 못 담는다",
  "w-multimodal": "ko '다약제의/다중양식의'가 어색하고 뜻이 흐리다 — '다중 방식의'",
  "w-awareness": "ko '의식/각성 인지'가 w-awakening '각성'과 겹친다 — awareness는 '의식 인지'로 가름",
  "w-stay": "ko '머무르다/유지되다'의 '유지되다'가 w-keep·w-hold와 겹친다 — '머무르다'로",
  "w-need": "문장 대부분(We need to…, if needed)이 동사 쓰임이라 ko '필요'를 '필요하다'로",
  "w-climb": "ko '오르다'가 w-rise와 같아 정답이 둘이 된다 — climb은 '서서히 오르다'로 가름",
}
DETAG_COMMON = ["w-today","w-minute","w-name","w-hand","w-hour","w-morning","w-zero","w-patient"]
DETAG_JUDGE = ["w-fifteen","w-thirty","w-wife","w-sit","w-drink","w-thank","w-hear","w-sleep","w-eye","w-help"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10

ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0

out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        nw = [w for w in x["words"] if w not in DETAG]
        if nw != x["words"]:
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": "너무 쉬운 말(또는 가르칠 값이 없는 말) 태그를 뺌 — 문장은 그대로"})
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, (s["title"], len({w for x in s["sentences"] for w in x["words"]}))
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
assert DETAG.isdisjoint(used)
words = [w for w in out["words"] if w["id"] not in DETAG]
assert {w["id"] for w in words} == used, (sorted({w["id"] for w in words} ^ used))
for w in words:
    for k, v in FIX.get(w["id"], {}).items():
        w[k] = v

sent_by_en = {}
for s in base["situations"]:
    for x in s["sentences"]:
        sent_by_en.setdefault(x["en"], x["ko"])

def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return abs(n(a)-n(b)) <= 3 or (n(b) <= n(a)*1.25 and n(b) >= n(a)/1.25)
data = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        wid = "w-" + e["w"]
        assert wid not in data, ("dup", wid)
        data[wid] = e
ids = {w["id"] for w in words}
assert set(data) <= ids, ("모르는 id", sorted(set(data) - ids))
missing = sorted(ids - set(data))
lint = []
for w in words:
    e = data.get(w["id"])
    if not e:
        continue
    ex = w["example"]
    assert ex in sent_by_en, ex
    w["exKo"] = sent_by_en[ex]
    w["cue"] = e["cue"]; w["tag"] = e["tag"]
    w["distractorsEn"] = list(e["dEn"]); w["distractorsKo"] = list(e["dKo"])
    w["chips"] = [list(c) for c in e["chips"]]
    w["decoyChips"] = list(e["decoy"])
    joined = " ".join("".join(c) for c in w["chips"])
    if joined != w["en"]: lint.append(f"{w['id']}: chips {joined!r} != {w['en']!r}")
    for o in w["distractorsEn"]:
        if not okLen(w["en"], o): lint.append(f"{w['id']}: dEn {o!r} length vs {w['en']!r}")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} length vs {w['ko']!r}")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    if w["ko"] in w["distractorsKo"]: lint.append(f"{w['id']}: dKo is answer")
    if len(w["chips"][0]) > 4 and len(w["chips"]) == 1: lint.append(f"{w['id']}: >4 frags")
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for c in w["chips"] for f in c}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
    frags = [f for c in w["chips"] for f in c]
    for d in w["decoyChips"]:
        for k, f in enumerate(frags):
            alt = frags[:k] + [d] + frags[k+1:]
            if "".join(alt).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
if missing: print("단어 데이터 빠짐:", len(missing), missing)
for l in lint: print("LINT", l)
out["words"] = words

nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        assert e["situation"] not in nu, e["situation"]
        nu[e["situation"]] = e["items"]
titles = [s["title"] for s in out["situations"]]
assert set(nu) <= set(titles), set(nu) - set(titles)
for s in out["situations"]:
    if s["title"] in nu:
        s["nuance"] = nu[s["title"]]
        tagged = {w for x in s["sentences"] for w in x["words"]}
        for it in s["nuance"]:
            for wid in it["words"]:
                if wid not in tagged: print("V15?", s["title"], wid)
            if it["kind"] == "context":
                for sc in it["scenes"]:
                    if it["word"].lower() not in sc["en"].lower(): print("W14?", s["title"], it["word"], "|", sc["en"])
if "--words-only" not in sys.argv and set(nu) != set(titles):
    print("뉘앙스 빠진 상황:", [t for t in titles if t not in nu])

with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)

changes = []
for wid, fx in FIX.items():
    changes.append({"kind": "word", "id": wid, "fields": list(fx), "why": WHY[wid]})
for wid in sorted(DETAG):
    changes.append({"kind": "word-remove", "id": wid, "why": ("너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다" if wid in DETAG_COMMON else "간호사가 이미 아는 쉬운 말이라 가르칠 값이 없다 — 어느 문장도 태그하지 않게 됐다")})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "data", len(data), "changes", len(changes), "nuance sits", len(nu))
