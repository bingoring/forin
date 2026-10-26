#!/usr/bin/env python3
"""icu-ards-proning A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-ards-proning.A.yaml과 changes를 쓴다."""
import glob, re, sys, copy, yaml
T = "icu-ards-proning"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# ---- 결정 11 : 단어 ko 고침 ----------------------------------------------------
FIX = {
  "w-prone": dict(ko="복와위(의)"),
  "w-call": dict(ko="부르다(연락하다)"),
  "w-count": dict(ko="카운트(셈)"),
  "w-move": dict(ko="움직이다"),
  "w-roll": dict(ko="굴려 돌리다"),
  "w-check": dict(ko="점검하다"),
  "w-keep": dict(ko="~한 채로 두다"),
  "w-mark": dict(ko="선을 그어 표시하다"),
  "w-flag": dict(ko="눈에 띄게 표시하다"),
  "w-grab": dict(ko="급히 가져오다"),
  "w-vent": dict(ko="벤트(호흡기 약칭)"),
  "w-sat": dict(ko="사트(수치)"),
  "w-breath": dict(ko="호흡(숨)"),
  "w-drop": dict(ko="떨어지다"),
  "w-stomach": dict(ko="배(몸 앞쪽)"),
  "w-belly": dict(ko="배(복부 겉)"),
  "w-care": dict(ko="돌봄"),
  "w-second": dict(ko="~하는 즉시"),
  "w-plateau-pressure": dict(ko="플래토압(고원압)"),
  "w-depth": dict(ko="삽입 깊이"),
}
WHY = {
  "w-prone": "ko가 동사구('엎드리다')인데 문장은 prone session·proning·prone responder라 형용사·명사로 쓴다 — 복와위(의)로",
  "w-call": "ko '외치다'는 call the count 한 곳뿐이고 나머지는 부르다·연락하다(call the code, call for help, call the doctor)",
  "w-count": "ko '구령'은 call the count 한 곳뿐 — TOF count(세어진 수)까지 덮도록 '카운트(셈)'로",
  "w-move": "ko '이동시키다'는 타동사 한 가지인데 문장은 moves him·isn't moving·before we move 등 '움직이다'가 대부분",
  "w-roll": "환자를 롤하는 뜻이라 '굴리다'는 어색 — '굴려 돌리다'로",
  "w-check": "ko '확인하다'가 w-confirm과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — check는 '점검하다'로 가름",
  "w-keep": "ko '유지하다'가 w-maintain과 같아 정답이 둘이 된다 — keep은 '~한 채로 두다'로 가름",
  "w-mark": "ko '표시하다'가 w-flag와 같아 정답이 둘이 된다 — 가름",
  "w-flag": "ko '표시하다'가 w-mark와 같아 정답이 둘이 된다 — 가름",
  "w-grab": "ko '가져오다'가 w-get과 같아 정답이 둘이 된다 — grab은 '급히 가져오다'로 가름",
  "w-vent": "ko '인공호흡기'가 w-ventilator와 같아 정답이 둘이 된다 — vent는 약칭임을 담아 가름",
  "w-sat": "ko '산소포화도'가 w-saturation과 같아 정답이 둘이 된다 — sat는 '사트(수치)'로 가름",
  "w-breath": "breath 자체는 '호흡(숨)'이고 '호흡음'은 breath sounds 전체의 뜻이라 ko가 틀렸다",
  "w-drop": "ko '떨어뜨리다'는 타동사 한 가지인데 문장 하나는 sats dropped(떨어지다) — '떨어지다'로 둘 다 덮음",
  "w-stomach": "ko '배(복부)'가 w-abdomen '복부'·w-belly '배'와 겹침 — stomach는 엎드릴 때 닿는 몸 앞쪽으로 가름",
  "w-belly": "ko '배'가 w-stomach·w-abdomen과 겹침 — 가름",
  "w-care": "ko '관리'가 w-manage '관리하다'와 겹침 — wound care는 '돌봄'으로 가름",
  "w-second": "ko '순간'이 w-instant '바로 그 순간'과 거의 같아 정답이 둘이 된다 — 가름",
  "w-depth": "ko '깊이'가 w-deeply '깊이'와 같아 정답이 둘이 된다 — depth는 튜브의 삽입 깊이로 가름",
  "w-plateau-pressure": "ko '고평부압'은 쓰이지 않는 표기 — 임상에서 쓰는 '플래토압(고원압)'으로",
}
# 너무 쉬운 말 — 문장은 그대로 두고 태그만 뺀다. 은행에서도 지운다.
DETAG_COMMON = ["w-now", "w-hour", "w-time", "w-afternoon", "w-doctor", "w-patient", "w-head", "w-go", "w-see", "w-come", "w-good"]
DETAG_JUDGE = ["w-five", "w-people", "w-person", "w-also", "w-new", "w-each", "w-tell", "w-put", "w-ago", "w-yesterday"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10
# 문장 하나에서만 태그를 뺀다: (상황 순번, 문장 순번) → 뺄 id  (그 ko가 이 문장 뜻과 어긋난다)
DETAG_AT = {
  (19, 2): ("w-set", "set up for decompression — 'set'은 설정하다·정하다 뜻인데 여기는 '준비하다'(set up)"),
  (17, 3): ("w-set", "while I set up — 'set'은 설정하다·정하다 뜻인데 여기는 '준비하다'(set up)"),
  (8, 4): ("w-hold", "hold the feeds는 '중단하다'라 ko '잡고 있다'와 어긋남"),
  (14, 1): ("w-hold", "oxygen holds는 '유지되다'라 ko '잡고 있다'와 어긋남"),
  (14, 1, "back"): ("w-back", "on his back의 back은 '등' — ko '다시(원래대로)'와 어긋남"),
  (16, 2): ("w-back", "on his back의 back은 '등' — ko '다시(원래대로)'와 어긋남"),
  (19, 1): ("w-lower", "Lower the tidal volume은 동사(낮추다) — ko '더 낮은'은 형용사 문장(0번 상황)에 맞춤"),
}
ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0

out = copy.deepcopy(base)
sent_changes = []
for si, s in enumerate(out["situations"]):
    for i, x in enumerate(s["sentences"]):
        drop = set(DETAG)
        reasons = []
        for key, (wid, w) in DETAG_AT.items():
            if key[0] == si and key[1] == i:
                drop.add(wid)
                reasons.append(w)
        easy = DETAG & set(x["words"])
        why = "; ".join(reasons + (["너무 쉬운 말 태그를 뺌 — 문장은 그대로"] if easy else []))
        nw = [w for w in x["words"] if w not in drop]
        if nw != x["words"]:
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"], "why": why})
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, s["title"]
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
assert DETAG.isdisjoint(used)
words = [w for w in out["words"] if w["id"] not in DETAG]
assert {w["id"] for w in words} == used, (sorted({w["id"] for w in words} ^ used))
for w in words:
    for k, v in FIX.get(w["id"], {}).items():
        w[k] = v
# 같은 ko 점검
kos = {}
for w in words:
    kos.setdefault(w["ko"], []).append(w["id"])
for k, v in kos.items():
    if len(v) > 1: print("DUP ko", k, v)

sent_by_en = {x["en"]: x["ko"] for s in base["situations"] for x in s["sentences"]}

# ---- 단어 v45 ------------------------------------------------------------------
def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return (n(b) <= max(n(a) * 1.25, n(a) + 3) and n(b) >= min(n(a) / 1.25, n(a) - 3)) or abs(n(a) - n(b)) <= 3
OFF = set("ass arse anal anus butt cum cunt cock dick fag fuck homo jizz naff nig piss porn rape shit slut sux tit tits twat wank whore".split())
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
    if sum(len(c) for c in w["chips"]) > 6: lint.append(f"{w['id']}: >6 chips")
    for o in w["distractorsEn"]:
        if not okLen(w["en"], o): lint.append(f"{w['id']}: dEn {o!r} length vs {w['en']!r}")
        if o.lower() == w["en"].lower(): lint.append(f"{w['id']}: dEn = answer")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} length vs {w['ko']!r}")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    if re.search(r"[A-Za-z]{3,}", w["cue"]): lint.append(f"{w['id']}: cue has english {re.findall(r'[A-Za-z]{3,}', w['cue'])}")
    frags = [f for c in w["chips"] for f in c]
    if not w["decoyChips"]: lint.append(f"{w['id']}: no decoy")
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for f in frags}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
        if d.lower() in OFF: lint.append(f"{w['id']}: decoy {d!r} OFFENSIVE")
        for k in range(len(frags)):
            alt = frags[:k] + [d] + frags[k + 1:]
            if "".join(alt).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
if missing: print("단어 데이터 빠짐:", len(missing), missing[:10], "...")
for l in lint: print("LINT", l)
out["words"] = words

# ---- 뉘앙스 ---------------------------------------------------------------------
nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        assert e["sit"] not in nu, e["sit"]
        nu[e["sit"]] = e["items"]
assert set(nu) <= set(range(len(out["situations"])))
for si, s in enumerate(out["situations"]):
    if si in nu:
        s["nuance"] = nu[si]
        tagged = {w for x in s["sentences"] for w in x["words"]}
        for it in s["nuance"]:
            for wid in it["words"]:
                if wid not in tagged: print("V15?", si, wid)
            if it["kind"] == "context":
                for sc in it["scenes"]:
                    if it["word"].lower() not in sc["en"].lower(): print("W14?", si, it["word"], "|", sc["en"])
            if it["kind"] == "swap":
                if it["before"][1] == it["answer"]: print("swap same", si)
                if "".join(it["before"]) .count("  "): print("swap spacing", si)
            if it["kind"] == "slider":
                sc = it["scale"]; print("slider", si, it["answerAt"], [len(x) for x in sc])
if "--words-only" not in sys.argv and set(nu) != set(range(len(out["situations"]))):
    print("뉘앙스 빠진 상황:", [i for i in range(len(out["situations"])) if i not in nu])

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
