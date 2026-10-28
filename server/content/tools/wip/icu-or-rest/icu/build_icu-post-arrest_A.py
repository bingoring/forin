#!/usr/bin/env python3
"""icu-post-arrest A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-post-arrest.A.yaml과 changes를 쓴다."""
import glob, yaml, copy, re
T = "icu-post-arrest"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# ---- 결정 11 -----------------------------------------------------------------
DETAG_COMMON = ["w-family", "w-patient"]
DETAG_JUDGE = ["w-heart", "w-cold", "w-love", "w-want", "w-help", "w-best", "w-hard", "w-sorry", "w-move", "w-deep"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
FIX = {
  "w-tight": dict(en="tightly", ipa="/ˈtaɪtli/"),
  "w-neurological": dict(en="neurologically", ipa="/ˌnʊrəˈlɑːdʒɪkli/", ko="신경학적으로"),
  "w-target": dict(ko="목표치"),
  "w-level": dict(ko="농도(수준)"),
  "w-pressor": dict(ko="승압제"),
  "w-vasopressor": dict(ko="혈관수축성 승압제"),
  "w-fight": dict(ko="거스르다(맞서다)"),
  "w-meds": dict(ko="약들"),
  "w-shift": dict(ko="변동"),
  "w-drip": dict(ko="지속주입(드립)"),
  "w-outcome": dict(ko="경과(결과)"),
  "w-steady": dict(ko="일정한"),
}
WHY = {
  "w-tight": "형용사 헤드워드(tight)에 부사 문장(tightly)이 묶여 있어 부사로",
  "w-neurological": "문장 14.3의 neurologically에 맞춰 부사로 바꾸고, w-neurologic(신경학적인)과 ko가 겹치지 않게 가름",
  "w-target": "ko '목표'가 w-goal과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — 설정값 뜻의 '목표치'로 가름",
  "w-level": "ko '수치'가 w-value와 같아 정답이 둘이 된다 — level은 '농도(수준)'로 가름",
  "w-pressor": "ko가 w-vasopressor와 겹쳐 정답이 둘이 된다 — pressor는 그대로 두고 vasopressor를 가름",
  "w-vasopressor": "ko '승압제'가 w-pressor와 겹쳐 정답이 둘이 된다 — 가름",
  "w-fight": "ko '저항하다'가 w-resist와 같아 정답이 둘이 된다 — fight는 '거스르다(맞서다)'로 가름",
  "w-meds": "ko '약물'이 w-drug와 같아 정답이 둘이 된다 — meds는 '약들'로 가름",
  "w-shift": "ko '이동'이 w-trip과 같아 정답이 둘이 된다 — shift는 '변동'으로 가름",
  "w-drip": "ko '수액'이 w-fluid와 같아 정답이 둘이 된다 — drip은 '지속주입(드립)'으로 가름",
  "w-outcome": "ko '결과'가 w-result와 같아 정답이 둘이 된다 — outcome은 '경과(결과)'로 가름",
  "w-steady": "ko '안정적인'이 w-stable(안정된)과 거의 같아 정답이 둘이 된다 — '일정한'으로 가름",
}
ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0, (set(FIX) - ids0, DETAG - ids0)

out = copy.deepcopy(base)
changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        nw = [w for w in x["words"] if w not in DETAG]
        if nw != x["words"]:
            x["words"] = nw
            changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                            "why": "너무 쉬운 말(공통 목록 또는 판단분) 태그를 뺌 — 문장은 그대로"})
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, s["title"]
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
assert DETAG.isdisjoint(used)
words = [w for w in out["words"] if w["id"] not in DETAG]
assert {w["id"] for w in words} == used, sorted({w["id"] for w in words} ^ used)
for w in words:
    for k, v in FIX.get(w["id"], {}).items():
        w[k] = v
for wid in sorted(FIX):
    changes.append({"kind": "word", "id": wid, "fields": [k for k in FIX[wid]], "why": WHY[wid]})
for wid in sorted(DETAG):
    changes.append({"kind": "word-remove", "id": wid, "why": "너무 쉬움 — 어느 문장도 태그하지 않게 됐다"})
# 변경 목록은 단어·삭제 먼저
changes.sort(key=lambda c: {"word": 0, "word-remove": 1, "sentence": 2}[c["kind"]])

sent_by_en = {}
for s in base["situations"]:
    for x in s["sentences"]:
        sent_by_en.setdefault(x["en"], x["ko"])

# ---- 단어 v45 -----------------------------------------------------------------
def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return (n(b) <= max(n(a) * 1.25, n(a) + 3) and n(b) >= min(n(a) / 1.25, n(a) - 3)) or abs(n(a) - n(b)) <= 3
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
    w["decoyChips"] = [str(c) for c in e["decoy"]]
    joined = " ".join("".join(c) for c in w["chips"])
    if joined != w["en"]: lint.append(f"{w['id']}: chips {joined!r} != {w['en']!r}")
    for o in w["distractorsEn"]:
        if not okLen(w["en"], o): lint.append(f"{w['id']}: dEn {o!r} length vs {w['en']!r}")
        if o.lower() == w["en"].lower(): lint.append(f"{w['id']}: dEn {o!r} is answer")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} length vs {w['ko']!r}")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for c in w["chips"] for f in c}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
    frags = [f for c in w["chips"] for f in c]
    for d in w["decoyChips"]:
        for k, f in enumerate(frags):
            alt = frags[:k] + [d] + frags[k + 1:]
            if "".join(alt).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
if missing: print("단어 데이터 빠짐:", len(missing), missing[:8], "...")
for l in lint: print("LINT", l)
out["words"] = words

# ---- 뉘앙스 -------------------------------------------------------------------
nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        assert e["situation"] not in nu, e["situation"]
        nu[e["situation"]] = e["items"]
titles = [s["title"] for s in out["situations"]]
assert set(nu) <= set(titles), sorted(set(nu) - set(titles))
for s in out["situations"]:
    if s["title"] in nu:
        s["nuance"] = nu[s["title"]]
miss_n = [t for t in titles if t not in nu]
if miss_n: print("뉘앙스 빠짐:", len(miss_n), miss_n[:5])

yaml.safe_dump(out, open(f"{D}/{T}.A.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({"theme": T, "changes": changes}, open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "changes", len(changes))
