#!/usr/bin/env python3
"""icu-electrolytes A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-electrolytes.A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy, re
T = "icu-electrolytes"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# ---- 결정 11 ----------------------------------------------------------------
def L(wid, en, ipa, why): return (wid, (en, ipa, why))
INFL = dict([
  L("w-balance","balance","/ˈbæləns/","활용형(balancing)을 원형으로"),
  L("w-follow","follow","/ˈfɑːloʊ/","활용형(following)을 원형으로"),
  L("w-help","help","/hɛlp/","활용형(helps)을 원형으로"),
  L("w-problem","problem","/ˈprɑːbləm/","복수형(problems)을 단수 원형으로"),
  L("w-keep","keep","/kiːp/","활용형(keeping)을 원형으로"),
  L("w-number","number","/ˈnʌmbər/","복수형(numbers)을 단수 원형으로"),
  L("w-move","move","/muːv/","활용형(moving)을 원형으로"),
  L("w-result","result","/rɪˈzʌlt/","복수형(results)을 단수 원형으로"),
  L("w-document","document","/ˈdɑːkjəˌmɛnt/","활용형(documented)을 원형으로"),
  L("w-monitor","monitor","/ˈmɑːnɪtər/","활용형(monitoring)을 원형으로"),
  L("w-infuse","infuse","/ɪnˈfjuːz/","활용형(infuses)을 원형으로"),
  L("w-control","control","/kənˈtroʊl/","활용형(controls)을 원형으로"),
  L("w-irritate","irritate","/ˈɪrɪˌteɪt/","활용형(irritating)을 원형으로"),
  L("w-wave","wave","/weɪv/","복수형(waves)을 단수 원형으로"),
  L("w-show","show","/ʃoʊ/","활용형(shows)을 원형으로"),
  L("w-widen","widen","/ˈwaɪdən/","활용형(widened)을 원형으로"),
  L("w-grab","grab","/ɡræb/","활용형(grabbed)을 원형으로"),
  L("w-diuretic","diuretic","/ˌdaɪjəˈrɛtɪk/","복수형(diuretics)을 단수 원형으로"),
  L("w-level","level","/ˈlɛvəl/","복수형(levels)을 단수 원형으로"),
  L("w-review","review","/rɪˈvjuː/","활용형(reviewing)을 원형으로"),
  L("w-drug","drug","/drʌɡ/","복수형(drugs)을 단수 원형으로"),
  L("w-pill","pill","/pɪl/","복수형(pills)을 단수 원형으로"),
  L("w-happen","happen","/ˈhæpən/","활용형(happening)을 원형으로"),
  L("w-work","work","/wɜːrk/","활용형(working)을 원형으로"),
  L("w-lab","lab","/læb/","복수형(labs)을 단수 원형으로"),
  L("w-update","update","/ʌpˈdeɪt/","활용형(updated)을 원형으로"),
  L("w-imbalance","imbalance","/ɪmˈbæləns/","복수형(imbalances)을 단수 원형으로"),
  L("w-cramp","cramp","/kræmp/","활용형(cramping)을 원형으로"),
  L("w-race","race","/reɪs/","활용형(racing)을 원형으로"),
  L("w-cell","cell","/sɛl/","복수형(cells)을 단수 원형으로"),
  L("w-run","run","/rʌn/","활용형(running)을 원형으로"),
  L("w-arrhythmia","arrhythmia","/əˈrɪðmiə/","복수형(arrhythmias)을 단수 원형으로"),
  L("w-PVC","PVC","/ˌpiː viː ˈsiː/","복수형(PVCs)을 단수 원형으로"),
  L("w-raise","raise","/reɪz/","활용형(raises)을 원형으로"),
  L("w-prolong","prolong","/prəˈlɔːŋ/","활용형(prolonging)을 원형으로"),
  L("w-climb","climb","/klaɪm/","활용형(climbing)을 원형으로"),
  L("w-antiarrhythmic","antiarrhythmic","/ˌæntiəˈrɪðmɪk/","복수형(antiarrhythmics)을 단수 원형으로"),
  L("w-gram","gram","/ɡræm/","복수형(grams)을 단수 원형으로"),
  L("w-spasm","spasm","/ˈspæzəm/","복수형(spasms)을 단수 원형으로"),
  L("w-tingle","tingle","/ˈtɪŋɡəl/","활용형(tingling)을 원형으로"),
  L("w-suspect","suspect","/səˈspɛkt/","활용형(suspecting)을 원형으로"),
  L("w-drop","drop","/drɑːp/","활용형(drops)을 원형으로"),
  L("w-volume","volume","/ˈvɑːljuːm/","복수형(volumes)을 단수 원형으로"),
  L("w-seizure","seizure","/ˈsiːʒər/","복수형(seizures)을 단수 원형으로"),
  L("w-convulse","convulse","/kənˈvʌls/","활용형(convulsing)을 원형으로"),
  L("w-fail","fail","/feɪl/","활용형(failing)을 원형으로"),
  L("w-organ","organ","/ˈɔːrɡən/","복수형(organs)을 단수 원형으로"),
  L("w-struggle","struggle","/ˈstrʌɡəl/","활용형(struggling)을 원형으로"),
  L("w-kidney","kidney","/ˈkɪdni/","복수형(kidneys)을 단수 원형으로"),
  L("w-lung","lung","/lʌŋ/","복수형(lungs)을 단수 원형으로"),
  L("w-pull","pull","/pʊl/","활용형(pulling)을 원형으로"),
  L("w-start","start","/stɑːrt/","활용형(starting)을 원형으로"),
  L("w-fluid","fluid","/ˈfluːɪd/","복수형(fluids)을 단수 원형으로"),
])
FIX = {}; WHY = {}
for wid, (en, ipa, why) in INFL.items():
    FIX[wid] = dict(en=en, ipa=ipa); WHY[wid] = why
# close → closely (문장 7곳 중 6곳이 부사 closely, 'a close eye'는 헤드워드와 안 맞아 그 문장 태그만 뺀다)
FIX["w-close"] = dict(en="closely", ipa="/ˈkloʊsli/", ko="유심히", example="I'm monitoring her closely while it infuses.")
WHY["w-close"] = "형용사 헤드워드(close)에 부사 closely 문장이 묶였다 — 헤드워드를 부사로, ko·example도 맞춤"
KO = {
  "w-help": ("도움이 되다", "ko '돕다'가 w-support와 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — 가름"),
  "w-support": ("뒷받침하다", "ko '돕다'가 w-help와 같아 정답이 둘이 된다 — 가름"),
  "w-number": ("숫자", "ko '수치'가 w-level·w-value와 같아 정답이 셋이 된다 — number는 '숫자'로 가름"),
  "w-value": ("측정값", "ko '수치'가 w-level과 같아 정답이 겹친다 — 가름"),
  "w-risk": ("위험성", "ko '위험'이 w-danger와 같아 정답이 둘이 된다 — risk는 가능성 쪽 '위험성'으로 가름"),
  "w-danger": ("위험도", "ko '위험'이 w-risk와 같아 정답이 둘이 된다 — 가름"),
  "w-spasm": ("근육 경련", "ko '경련'이 w-seizure와 같아 정답이 둘이 된다 — spasm은 '근육 경련'으로 가름"),
  "w-seizure": ("발작", "ko '경련'이 w-spasm과 같아 정답이 둘이 된다 — seizure는 '발작'으로 가름"),
  "w-page": ("호출하다", "(그대로)"),
  "w-call": ("부르다", "ko '호출하다'가 w-page와 같아 정답이 둘이 된다 — call은 '부르다'로 가름"),
  "w-pressure": ("혈압(압력)", "'blood pressure medicine'에서만 쓰이는데 ko '압력'은 그 문장과 안 맞는다 — 혈압을 함께 담음"),
  "w-cramp": ("쥐가 나다", "원형으로 바꾸면서 ko도 동사형으로"),
  "w-run": ("주입하다", "원형으로 바꾸면서 ko를 두 문장(칼슘이 들어가고 있다·칼륨을 주입하고 있다)에 맞춤"),
  "w-bring": ("(수치를) 낮추다", "'bring down the uric acid'(요산을 낮추다) 한 문장에서만 쓰여 ko를 구 뜻에 맞춤"),
  "w-pull": ("뽑아내다", "원형으로 바꾸면서 ko를 'pull a full panel'(패널을 뽑다)에 맞춤"),
  "w-monitor": ("모니터링하다", "ko '관찰하다'가 w-watch(지켜보다)와 가깝고 모니터 문장에 더 맞는 '모니터링하다'로 가름"),
}
del KO["w-page"]
for wid, (ko, why) in KO.items():
    FIX.setdefault(wid, {})["ko"] = ko
    WHY[wid] = (WHY[wid] + " / " if wid in WHY else "") + why
DETAG_COMMON = ["w-body","w-hour","w-know","w-doctor","w-go","w-home","w-hand","w-now","w-today","w-week","w-day","w-minute","w-come"]
DETAG_JUDGE = ["w-other","w-way","w-lot","w-each","w-far","w-once","w-away","w-great","w-done","w-part","w-eye"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 11

ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0, (set(FIX)-ids0, DETAG-ids0)

SENT_UNTAG = {("전해질 패널 추세 사정", 3): ["w-close"]}  # 'a close eye'(형용사) — 헤드워드 closely(부사)와 안 맞음
out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        nw = [w for w in x["words"] if w not in DETAG and w not in SENT_UNTAG.get((s["title"], i), [])]
        if nw != x["words"]:
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": ("w-close 태그를 뺌 — 'a close eye'는 형용사라 헤드워드 closely(부사)와 안 맞는다, 문장은 그대로" if (s["title"], i) in SENT_UNTAG else "너무 쉬운 말 태그를 뺌 — 문장은 그대로")})
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, (s["title"], len({w for x in s["sentences"] for w in x["words"]}))
    for i, x in enumerate(s["sentences"]):
        assert x["words"], (s["title"], i)
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
        wid = "w-" + e["i"]
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
        if o.lower() == w["en"].lower(): lint.append(f"{w['id']}: dEn same")
    if len(set(w["distractorsEn"])) != 2 or len(set(w["distractorsKo"])) != 2: lint.append(f"{w['id']}: dup distractor")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} length vs {w['ko']!r}")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for c in w["chips"] for f in c}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
    frags = [f for c in w["chips"] for f in c]
    for d in w["decoyChips"]:
        for k, f in enumerate(frags):
            alt = frags[:k] + [d] + frags[k+1:]
            if "".join(alt).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
# 은행 안 ko 겹침
import collections
kc = collections.Counter(w["ko"] for w in words)
for k, c in kc.items():
    if c > 1: lint.append(f"ko dup {k}")
# distractorsKo가 은행의 다른 단어 ko와 같은지(정답이 둘이 되는 경우)
bank_ko = {w["ko"]: w["en"] for w in words}
for w in words:
    for o in w.get("distractorsKo", []):
        if o in bank_ko and bank_ko[o] != w["en"]: lint.append(f"{w['id']}: dKo {o!r} is bank ko of {bank_ko[o]}")
    for o in w.get("distractorsEn", []):
        pass
if missing: print("단어 데이터 빠짐:", len(missing), missing)
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
    changes.append({"kind": "word-remove", "id": wid, "why": ("너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다" if wid in DETAG_COMMON else "간호사가 이미 아는 쉬운 말·기능어이거나 가르칠 값이 없다 — 어느 문장도 태그하지 않게 됐다")})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "data", len(data), "changes", len(changes), "nuance sits", len(nu))
