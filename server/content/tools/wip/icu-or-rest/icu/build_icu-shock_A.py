#!/usr/bin/env python3
"""icu-shock A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-shock.A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy, re
T = "icu-shock"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# ---- 결정 11 ----------------------------------------------------------------
FIX = {  # id → 바꿀 값
  "w-vasodilate": dict(en="vasodilate", ipa="/ˌvæsoʊˈdaɪleɪt/", ko="혈관이 확장되다"),
  "w-deviate": dict(en="deviate", ipa="/ˈdiːvieɪt/", ko="편위되다"),
  "w-develop": dict(en="develop", ipa="/dɪˈvɛləp/", ko="생기다"),
  "w-tip": dict(en="tip", ipa="/tɪp/"),
  "w-clear": dict(en="clear", ipa="/klɪr/", ko="제거되다"),
  "w-aim": dict(en="aim", ipa="/eɪm/"),
  "w-remain": dict(en="remain", ipa="/rɪˈmeɪn/"),
  "w-respond": dict(en="respond", ipa="/rɪˈspɑːnd/"),
  "w-fix": dict(en="fix", ipa="/fɪks/"),
  "w-fail": dict(en="fail", ipa="/feɪl/"),
  "w-muffle": dict(en="muffle", ipa="/ˈmʌfəl/", ko="둔탁하게 하다"),
  "w-chart": dict(en="chart", ipa="/tʃɑːrt/", ko="차트에 적다"),
  "w-feet": dict(en="foot", ipa="/fʊt/"),
  "w-legs": dict(en="leg", ipa="/lɛɡ/"),
  "w-lips": dict(en="lip", ipa="/lɪp/"),
  "w-feel": dict(en="feel", ipa="/fiːl/"),
  "w-document": dict(ko="기록으로 남기다"),
  "w-update": dict(ko="경과를 알리다"),
  "w-flag": dict(ko="(이상을) 짚어 알리다"),
  "w-cool": dict(ko="서늘한"),
  "w-value": dict(ko="측정값"),
  "w-number": dict(ko="숫자"),
  "w-target": dict(ko="목표치"),
  "w-fall": dict(ko="하락하다"),
  "w-breath": dict(ko="호흡(숨)"),
  "w-set": dict(ko="차려 놓다"),
  "w-prime": dict(ko="작동 준비시키다"),
  "w-stat": dict(ko="당장"),
  "w-adequate": dict(ko="적절한"),
  "w-start": dict(ko="시작하다"),
}
WHY = {
  "w-vasodilate": "활용형(vasodilated)을 원형으로, ko도 원형에 맞춤",
  "w-deviate": "활용형(deviated)을 원형으로, ko도 원형에 맞춤",
  "w-develop": "활용형(developing)을 원형으로 — 문장은 '증상이 생기다'(developing crackles)라 ko도 '생기다'로(기존 '나타내다'는 방향이 반대)",
  "w-tip": "활용형(tipping)을 원형으로",
  "w-clear": "활용형(clearing)을 원형으로 — ko '회복되다'는 젖산이 씻겨 나간다는 뜻을 못 담아 '제거되다'로",
  "w-aim": "활용형(aiming)을 원형으로",
  "w-remain": "활용형(remained)을 원형으로",
  "w-respond": "활용형(responded)을 원형으로",
  "w-fix": "활용형(fixing)을 원형으로",
  "w-fail": "활용형(failing)을 원형으로",
  "w-muffle": "활용형(muffled)을 원형으로, ko도 원형에 맞춤",
  "w-chart": "활용형(charting)을 원형으로 — ko '기록하다'가 w-document와 같아 정답이 둘이 되므로 가름",
  "w-feet": "복수형(feet)을 단수 원형으로",
  "w-legs": "복수형(legs)을 단수 원형으로",
  "w-lips": "복수형(lips)을 단수 원형으로",
  "w-feel": "활용형(feels)을 원형으로",
  "w-document": "ko '기록하다'가 w-chart와 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — 가름",
  "w-update": "ko '알리다'가 w-flag와 같아 정답이 둘이 된다 — 가름",
  "w-flag": "ko '알리다'가 w-update와 같아 정답이 둘이 된다 — 가름",
  "w-cool": "ko '차가운'이 w-cold와 같아 정답이 둘이 된다 — cool은 '서늘한'으로 가름",
  "w-value": "ko '수치'가 w-number와 같아 정답이 둘이 된다 — 가름",
  "w-number": "ko '수치'가 w-value와 같아 정답이 둘이 된다 — 가름",
  "w-target": "ko '목표'가 w-goal과 같아 정답이 둘이 된다 — target은 '목표치'로 가름",
  "w-fall": "ko '떨어지다'가 w-drop과 같아 정답이 둘이 된다 — 가름",
  "w-breath": "breath 자체는 '호흡(숨)'이고 '호흡음'은 breath sounds 전체의 뜻이라 ko가 틀렸다",
  "w-set": "ko '준비하다'가 w-prime과 겹친다 — 가름",
  "w-prime": "ko '준비하다'가 w-set과 겹친다 — 가름",
  "w-stat": "ko '즉시'가 w-immediate '즉각적인'과 거의 같아 정답이 둘이 된다 — '당장'으로 가름",
  "w-adequate": "ko '충분한'이 w-enough와 같아 정답이 둘이 된다 — adequate는 '적절한'으로 가름",
  "w-start": "ko '시작되다'는 start pressors(시작하다)를 못 담는다",
}
# 너무 쉬운 말 — 문장은 그대로 두고 태그만 뺀다. 은행에서도 지운다.
DETAG_COMMON = ["w-hour","w-minute","w-time","w-morning","w-name","w-doctor","w-family","w-body","w-hand","w-know","w-good"]
DETAG_JUDGE = ["w-have","w-would","w-make","w-up","w-three","w-any","w-just","w-nothing","w-too","w-all"]
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
assert {w["id"] for w in words} == used, (sorted({w["id"] for w in words} ^ used))
for w in words:
    for k, v in FIX.get(w["id"], {}).items():
        w[k] = v

sent_by_en = {}
for s in base["situations"]:
    for x in s["sentences"]:
        sent_by_en.setdefault(x["en"], x["ko"])

# ---- 단어 v45 ------------------------------------------------------------------
def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return n(b) <= max(n(a) * 1.25, n(a) + 3) and n(b) >= min(n(a) / 1.25, n(a) - 3) or abs(n(a)-n(b)) <= 3
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
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for c in w["chips"] for f in c}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
    # 철자 우회: 정답 조각 + 오답 조각 조합으로 정답 재현
    frags = [f for c in w["chips"] for f in c]
    for d in w["decoyChips"]:
        for k, f in enumerate(frags):
            alt = frags[:k] + [d] + frags[k+1:]
            if "".join(alt).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
if missing: print("단어 데이터 빠짐:", len(missing), missing[:6], "...")
for l in lint: print("LINT", l)
out["words"] = words

# ---- 뉘앙스 ---------------------------------------------------------------------
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
    changes.append({"kind": "word-remove", "id": wid, "why": ("너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다" if wid in DETAG_COMMON else "간호사가 이미 아는 기능어·쉬운 말이거나 뜻이 둘이라 가르칠 값이 없다 — 어느 문장도 태그하지 않게 됐다")})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "data", len(data), "changes", len(changes), "nuance sits", len(nu))
