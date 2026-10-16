#!/usr/bin/env python3
"""icu-airway A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-airway.A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy, re
T = "icu-pain-nonverbal"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# ---- 결정 11 ----------------------------------------------------------------
HEAD = {  # id -> (en, ipa, 이유)  — 활용형 헤드워드를 원형으로(id는 그대로)
  "w-tense": ("tense", "/tɛns/", "활용형(tensing)을 원형으로"),
  "w-premedicate": ("pre-medicate", "/ˌpriːˈmɛdɪkeɪt/", "활용형(pre-medicating)을 원형으로"),
  "w-low": ("lower", "/ˈloʊər/", "문장 세 개가 모두 lower(동사·비교급)로 쓰는데 헤드워드가 low였다 — 문장의 모습으로"),
}
KO = {  # id -> (새 ko, 이유)
  "w-low": ("낮추다", "헤드워드를 lower로 바꾸면서 ko도 맞춤 (can lower his pain / lowers his dose / much lower)"),
  "w-tolerance": ("견딤(내성)", "ko '순응(견딤)'은 w-compliance '순응도'와 거의 같고, 12번 상황의 tolerance(약물 내성)를 담지 못한다 — 두 문장 모두 담게"),
  "w-medication": ("약제", "ko '약물'이 w-drug와 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — medication은 '약제'로 가름"),
  "w-control": ("조절", "ko '조절되다'는 'pain control'·'poor control'(명사)을 못 담는다 — 동사·명사 모두 담게"),
  "w-break": ("뚫고 나오다", "'break through'(통증이 뚫고 나오다)로 쓰이는데 ko가 '뚫다'였다"),
  "w-rate": ("(호흡·심박)수", "ko '수치'는 respiratory rate·heart rate의 '수'를 못 짚는다"),
  "w-monitor": ("모니터(하다)", "명사(on the monitor)와 동사(monitor closely) 두 문장에 쓰여 둘 다 담음"),
  "w-level": ("농도(수준)", "'his level should be near peak'은 약물 농도 — ko를 '수준'만 두면 흐리다"),
}
FIX = {}
WHY = {}
for wid, (en, ipa, why) in HEAD.items():
    FIX[wid] = dict(en=en, ipa=ipa); WHY[wid] = why
for wid, (ko, why) in KO.items():
    FIX.setdefault(wid, {})["ko"] = ko
    WHY[wid] = (WHY[wid] + " / " if wid in WHY else "") + why
# 너무 쉬운 말 — 문장은 그대로 두고 태그만 뺀다. 은행에서도 지운다.
DETAG_COMMON = ["w-hour","w-now","w-home","w-know","w-see","w-come","w-day","w-minute","w-hand","w-patient","w-doctor","w-good"]
DETAG_JUDGE = ["w-face","w-arm","w-word","w-heart","w-belly","w-pillow","w-little","w-few","w-small","w-long"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10
# 문장 단위로만 뺄 태그 (situation title, index, wid, 이유)
SENT_DETAG = [
  ("진통제 정규 투여·기록", 4, "w-time", "여기서 time은 명사('charting the time') — 은행의 w-time은 동사 '시간을 맞추다'라 뜻이 어긋나 태그를 뺌"),
  ("임종기 통증·호흡곤란 완화", 5, "w-time", "여기서 time은 명사('the whole time') — 은행의 w-time은 동사 '시간을 맞추다'라 뜻이 어긋나 태그를 뺌"),
  ("통증과 초조 감별", 0, "w-tell", "여기서 tell은 'tell A from B'(구별하다) — 은행의 w-tell은 '알려 주다'라 뜻이 어긋나 태그를 뺌"),
]
SD = {(a, b): c for a, b, c, _ in SENT_DETAG}
SDWHY = {(a, b, c): d for a, b, c, d in SENT_DETAG}

ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0, (set(FIX)-ids0, DETAG-ids0)

SENT_UNTAG = {("기관절개 발성밸브 적용", 4): ["w-off"]}  # take the valve off — 'off'는 이 문장에서 불변사(헤드워드 ko '이상한'과 안 맞음)
out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        drop = [w for w in x["words"] if w in DETAG or SD.get((s["title"], i)) == w]
        nw = [w for w in x["words"] if w not in drop]
        if drop:
            x["words"] = nw
            sp = [w for w in drop if w not in DETAG]
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": (SDWHY[(s["title"], i, sp[0])] if sp else "너무 쉬운 말(또는 가르칠 값이 없는 말) 태그를 뺌 — 문장은 그대로")})
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
