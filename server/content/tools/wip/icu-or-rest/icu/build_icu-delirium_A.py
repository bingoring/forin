#!/usr/bin/env python3
"""icu-delirium A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-delirium.A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy, re
T = "icu-delirium"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

FIX = {
  "w-update": dict(ko="경과를 알리다"),
  "w-flag": dict(ko="(이상을) 짚어 알리다"),
  "w-document": dict(ko="기록으로 남기다"),
  "w-stat": dict(ko="당장"),
  "w-shorten": dict(ko="단축하다"),
  "w-cluster": dict(ko="몰아서 하다"),
  "w-group": dict(ko="한데 모으다"),
  "w-danger": dict(ko="위험한 상태"),
  "w-risk": dict(ko="위험성"),
  "w-med": dict(ko="복용약"),
  "w-lighten": dict(ko="가볍게 하다"),
  "w-calm": dict(ko="차분한"),
  "w-support": dict(ko="받쳐 주다"),
  "w-guide": dict(ko="이끌다"),
  "w-back": dict(ko="뒤로/되돌아"),
  "w-through": dict(ko="끝까지"),
  "w-replace": dict(ko="교체하다"),
  "w-turn": dict(ko="돌리다"),
}
WHY = {
  "w-update": "ko '알리다'가 w-flag와 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — 가름",
  "w-flag": "ko '알리다'가 w-update와 같아 정답이 둘이 된다 — 가름",
  "w-document": "ko '기록하다'가 w-note와 같아 정답이 둘이 된다 — 가름",
  "w-stat": "ko '즉시'가 w-immediately와 같아 정답이 둘이 된다 — '당장'으로 가름",
  "w-shorten": "ko '줄이다'가 w-reduce와 같아 정답이 둘이 된다 — shorten은 '단축하다'로 가름",
  "w-cluster": "ko '묶다'가 w-group·w-tie와 같아 정답이 셋이 된다 — 가름",
  "w-group": "ko '묶다'가 w-cluster·w-tie와 같아 정답이 셋이 된다 — 가름",
  "w-danger": "ko '위험'이 w-risk와 같아 정답이 둘이 된다 — danger는 '위험한 상태'로 가름",
  "w-risk": "ko '위험'이 w-danger와 같아 정답이 둘이 된다 — risk는 '위험성'으로 가름",
  "w-med": "ko '약'이 w-drug '약물'과 거의 같아 정답이 둘이 된다 — med는 '복용약'으로 가름",
  "w-lighten": "ko '얕추다'는 우리말이 아니다 — '가볍게 하다'로",
  "w-calm": "태그된 문장 대부분이 형용사('he's calm', 'keep the room calm')라 ko '진정시키다'는 맞지 않고, 같은 ko를 w-deescalate도 가졌다 — '차분한'으로",
  "w-support": "'support his lines/brain'의 뜻을 '지지하다'는 못 담는다 — '받쳐 주다'",
  "w-guide": "'use CIWA to guide dosing'의 '안내하다'가 어색 — '이끌다'",
  "w-back": "ko '다시'는 'step back'(뒤로)과 'get back to themselves'(되돌아)를 담지 못한다",
  "w-through": "'talking this through'의 뜻은 '통해'가 아니라 '끝까지'",
  "w-replace": "ko '재확보하다'가 w-secure '확보하다'와 거의 같아 정답이 둘이 된다 — '교체하다'로 가름",
  "w-turn": "태그된 문장 대부분이 '몸을 돌리다'이고 ko '끄다'는 turn off(w-off와 함께) 한 군데뿐 — '돌리다'로, 해당 두 문장 태그를 뺌",
}
DETAG_COMMON = ["w-hand","w-morning","w-see","w-body","w-time","w-minute","w-day","w-hour","w-night","w-today","w-home","w-patient","w-know","w-good","w-come"]
DETAG_JUDGE = ["w-here","w-now","w-also","w-just","w-much","w-really","w-every","w-even","w-get","w-put"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10
# 단어는 두되 한 문장에서만 태그를 뺀다: (상황 제목, index, 단어 id, 이유)
UNTAG = [
  ("수면 위생 중재", 1, "w-turn", "'turn off the TV'는 w-off와 묶인 표현 — turn의 ko를 '돌리다'로 맞추며 이 문장 태그를 뺌"),
  ("억제대 관련 손상·질식 위험 위기", 2, "w-turn", "'is turning red'는 '변하다'라 '돌리다'와 안 맞음 — 태그를 뺌"),
  ("섬망 중 진정 최소화", 2, "w-light", "'lighter sedation'의 light는 형용사 비교급 — 명사 헤드워드(빛)와 안 맞아 태그를 뺌(w-lighten이 따로 있다)"),
  ("가족 참여·안심", 1, "w-calm", "'can calm him'은 동사 — 헤드워드를 형용사 '차분한'으로 맞추며 이 문장 태그를 뺌"),
]
ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0

out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        nw = [w for w in x["words"] if w not in DETAG]
        for (t, j, wid, _) in UNTAG:
            if t == s["title"] and j == i:
                assert wid in nw, (t, j, wid)
                nw = [w for w in nw if w != wid]
        if nw != x["words"]:
            reasons = [r for (t, j, wid, r) in UNTAG if t == s["title"] and j == i]
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": ("; ".join(reasons) if reasons else "너무 쉬운 말(공통 쉬운 단어 목록 또는 간호사가 이미 아는 말) 태그를 뺌 — 문장은 그대로")})
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, s["title"]
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
assert DETAG.isdisjoint(used)
words = [w for w in out["words"] if w["id"] not in DETAG]
assert {w["id"] for w in words} == used, (sorted({w["id"] for w in words} ^ used))
for w in words:
    for k, v in FIX.get(w["id"], {}).items():
        w[k] = v

# example이 더는 그 단어를 태그하지 않는 문장이면 태그된 다른 문장으로
en2x = {}
tagged_sents = {}
for s in out["situations"]:
    for x in s["sentences"]:
        en2x.setdefault(x["en"], x["ko"])
        for wid in x["words"]:
            tagged_sents.setdefault(wid, []).append(x)
ex_changes = []
for w in words:
    sents = tagged_sents[w["id"]]
    if w["example"] not in {x["en"] for x in sents}:
        old = w["example"]
        w["example"] = sents[0]["en"]
        ex_changes.append({"kind": "word", "id": w["id"], "fields": ["example"], "why": f"example 문장 '{old}'에서 이 단어 태그를 뺐으므로 태그된 문장으로 바꿈"})
sent_by_en = en2x

def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return (n(b) <= max(n(a) * 1.25, n(a) + 3) and n(b) >= min(n(a) / 1.25, n(a) - 3)) or abs(n(a) - n(b)) <= 3
data = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        wid = "w-" + str(e["w"])
        assert wid not in data, ("dup", wid)
        data[wid] = e
ids = {w["id"] for w in words}
assert set(data) <= ids, ("모르는 id", sorted(set(data) - ids))
missing = sorted(ids - set(data))
lint = []
tagc = {}
for w in words:
    e = data.get(w["id"])
    if not e: continue
    w["exKo"] = sent_by_en[w["example"]]
    w["cue"] = e["cue"]; w["tag"] = e["tag"]
    w["distractorsEn"] = list(e["dEn"]); w["distractorsKo"] = list(e["dKo"])
    w["chips"] = [list(c) for c in e["chips"]]
    w["decoyChips"] = list(e["decoy"])
    tagc[e["tag"]] = tagc.get(e["tag"], 0) + 1
    joined = " ".join("".join(c) for c in w["chips"])
    if joined != w["en"]: lint.append(f"{w['id']}: chips {joined!r} != {w['en']!r}")
    for o in w["distractorsEn"]:
        if not okLen(w["en"], o): lint.append(f"{w['id']}: dEn {o!r} length vs {w['en']!r}")
        if o.lower() == w["en"].lower() or w["en"].lower() in o.lower().split(): lint.append(f"{w['id']}: dEn {o!r} == answer")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} length vs {w['ko']!r}")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    frags = [f for c in w["chips"] for f in c]
    if len(frags) > 6: lint.append(f"{w['id']}: >6 chips")
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for f in frags}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
        for k, f in enumerate(frags):
            alt = frags[:k] + [d] + frags[k+1:]
            if "".join(alt).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
if missing: print("단어 데이터 빠짐:", len(missing), missing[:10])
for l in lint: print("LINT", l)
print("tags", tagc)
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
changes += ex_changes
for wid in sorted(DETAG):
    changes.append({"kind": "word-remove", "id": wid, "why": ("너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다" if wid in DETAG_COMMON else "간호사가 이미 아는 기능어·쉬운 말이라 가르칠 값이 없다 — 어느 문장도 태그하지 않게 됐다")})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "data", len(data), "changes", len(changes), "nuance sits", len(nu))
