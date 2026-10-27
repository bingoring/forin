#!/usr/bin/env python3
"""icu-pain-nonverbal A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-pain-nonverbal.A.yaml과 changes를 쓴다."""
import glob, yaml, copy, re
T = "icu-pain-nonverbal"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

FIX = {
  "w-tolerance": dict(ko="내성(견딤)"),
  "w-score": dict(ko="점수(를 매기다)"),
  "w-level": dict(ko="농도"),
  "w-rate": dict(ko="분당 횟수"),
  "w-drug": dict(ko="약품"),
  "w-little": dict(ko="적은 양의"),
  "w-few": dict(ko="적은 수의"),
  "w-schedule": dict(ko="정해진 일정"),
  "w-tense": dict(en="tense", ipa="/tɛns/"),
  "w-premedicate": dict(en="pre-medicate", ipa="/ˌpriː ˈmɛdɪkeɪt/"),
}
WHY = {
  "w-tolerance": "ko '순응(견딤)'은 태그된 문장 3개 중 2개(오피오이드 내성)와 안 맞는다 — 인공호흡기를 견디는 뜻도 담도록 '내성(견딤)'으로",
  "w-score": "문장 대부분(his score dropped, compare this score)이 명사 쓰임이라 ko를 '점수(를 매기다)'로",
  "w-level": "문장(his level should be near peak)이 약 농도를 뜻해 ko '수준'을 '농도'로",
  "w-rate": "respiratory rate·heart rate의 rate는 '수치'가 아니라 분당 횟수라 ko를 '분당 횟수'로",
  "w-drug": "ko '약물'이 w-medication '약물'과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — drug는 '약품'으로 가름",
  "w-little": "ko '적은'이 w-few '적은'과 같아 정답이 둘이 된다 — little(양)은 '적은 양의'로 가름",
  "w-few": "ko '적은'이 w-little '적은'과 같아 정답이 둘이 된다 — few(수)는 '적은 수의'로 가름",
  "w-schedule": "ko '정규 일정'은 on schedule·scheduled dosing(정해진 시간에 맞춘)을 못 담는다 — '정해진 일정'으로",
  "w-tense": "활용형 헤드워드(tensing)를 원형 tense로",
  "w-premedicate": "활용형 헤드워드(pre-medicating)를 원형 pre-medicate로",
}
DETAG_COMMON = ["w-hour","w-time","w-know","w-now","w-good","w-patient","w-doctor","w-home","w-come","w-see","w-day","w-hand","w-minute"]
DETAG_JUDGE = ["w-face","w-arm","w-belly","w-heart","w-word","w-pick","w-talk","w-small","w-feel","w-team"]
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
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, s["title"]
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
assert DETAG.isdisjoint(used)
words = [w for w in out["words"] if w["id"] not in DETAG]
assert {w["id"] for w in words} == used, sorted({w["id"] for w in words} ^ used)
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
    w["distractorsEn"] = [str(x) for x in e["dEn"]]; w["distractorsKo"] = [str(x) for x in e["dKo"]]
    w["chips"] = [[str(f) for f in c] for c in e["chips"]]
    w["decoyChips"] = [str(x) for x in e["decoy"]]
    joined = " ".join("".join(c) for c in w["chips"])
    if joined != w["en"]: lint.append(f"{w['id']}: chips {joined!r} != {w['en']!r}")
    for o in w["distractorsEn"]:
        if not okLen(w["en"], o): lint.append(f"{w['id']}: dEn {o!r} length vs {w['en']!r}")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} length vs {w['ko']!r}")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    if w["ko"] in w["distractorsKo"]: lint.append(f"{w['id']}: dKo is answer")
    if any(len(c) > 4 for c in w["chips"]) or sum(len(c) for c in w["chips"]) > 6: lint.append(f"{w['id']}: too many frags")
    frags = [f for c in w["chips"] for f in c]
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for f in frags}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
        for k, f in enumerate(frags):
            alt = frags[:k] + [d] + frags[k+1:]
            if "".join(alt).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
    if set(map(str.lower, w["decoyChips"])) & set(map(str.lower, w["distractorsEn"])) and False: pass
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
if set(nu) != set(titles):
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
