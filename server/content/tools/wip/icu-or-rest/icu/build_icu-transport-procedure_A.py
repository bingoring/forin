#!/usr/bin/env python3
"""icu-transport-procedure A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-transport-procedure.A.yaml · changes 를 쓴다."""
import glob, re, sys, copy, yaml
from collections import defaultdict
T = "icu-transport-procedure"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

KO = {  # id -> (새 ko, 이유)
 "w-level": ("수준", "ko '수치'가 w-reading과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — level은 'oxygen level'의 '수준'으로 가름"),
 "w-reading": ("측정값", "ko '수치'가 w-level과 같아 가름 — pulse ox reading은 기기가 잰 '측정값'"),
 "w-set": ("갖춰진", "ko '준비된'이 w-ready와 같아 정답이 둘이 된다 — all set·set up은 '갖춰진'"),
 "w-med": ("응급약", "ko '약물'이 w-drug·w-medication과 같아 정답이 셋이 된다 — 태그된 문장은 emergency meds·code meds라 '응급약'"),
 "w-medication": ("복용 약", "ko '약물'이 w-med·w-drug와 같아 가름 — medication list는 환자 약 목록"),
 "w-free": ("없는", "ko '벗어난'이 w-clear와 같아 정답이 둘이 된다 — free of tension은 '당김이 없는'"),
 "w-begin": ("개시하다", "ko '시작하다'가 w-start와 같아 정답이 둘이 된다 — 가름"),
 "w-sat": ("SpO2(줄임말)", "ko '산소포화도'가 w-saturation과 같아 정답이 둘이 된다 — sats는 SpO2를 부르는 줄임말"),
 "w-vent": ("벤트", "ko '인공호흡기'가 w-ventilator와 같아 정답이 둘이 된다 — vent는 현장 줄임말"),
 "w-manage": ("관리하다", "ko '맡다'가 w-take와 같아 정답이 둘이 된다 — manage the airway는 '관리하다'"),
 "w-take": ("담당하다", "ko '맡다'가 w-manage와 같아 가름 — take the first round는 '차례를 담당하다'"),
 "w-drip": ("드립(지속 주입)", "ko '주입'이 w-infusion과 같아 정답이 둘이 된다 — drips는 지속 주입 중인 약"),
 "w-change": ("변하다·바꾸다", "태그된 문장 셋이 모두 동사(anything changes는 변하다, could change management는 바꾸다)라 명사 '변화'를 동사로"),
 "w-unit": ("중환자실", "태그된 문장의 the unit은 우리 중환자실이라 '병동'보다 맞는다"),
 "w-hold": ("멈추다/유지하다", "태그된 8문장이 hold and reassess(멈추다)부터 hold pressure·sats are holding(유지하다)까지 걸쳐 '보류하다' 하나로는 안 맞는다"),
 "w-second": ("초·순간", "태그된 문장이 for a second(잠깐)·five seconds(초)·the second we are clear(~하는 순간)로 걸쳐 있어 '잠깐'만으로는 안 맞는다"),
 "w-moment": ("~하는 순간", "ko '순간'이 w-second와 겹쳐 가름 — the moment we clear는 '~하는 순간'"),
 "w-monitor": ("모니터·감시하다", "명사(transport monitor)와 동사(I'll monitor her vitals)로 모두 쓰여 둘 다 담는다"),
 "w-steady": ("일정한", "ko '안정적인'이 w-stable '안정된'과 사실상 같아 정답이 둘이 된다 — steady는 '일정한'"),
 "w-switch": ("교체(하다)", "ko '전환'이 w-convert '전환하다'와 겹쳐 가름 — switch to the backup cylinder는 바꿔 쓰는 것"),
 "w-pressure": ("압력(혈압·압박)", "태그된 문장이 blood pressure(혈압)·hold pressure(압박)라 '압력'만으로는 안 맞는다"),
 "w-call": ("부르다/전화하다", "call for help(부르다)와 call the attending·please call(전화하다)이 섞여 있다"),
 "w-support": ("보조하다", "support the airway·more support는 '지지'보다 '보조'가 자연스럽다"),
 "w-emergency": ("응급·비상", "emergency call button(비상)과 emergency procedure(응급)가 섞여 있다"),
}
DETAG_COMMON = ["w-name", "w-room", "w-time", "w-hour", "w-know", "w-come", "w-hand", "w-patient"]
DETAG_JUDGE = ["w-eat", "w-say", "w-make", "w-way", "w-door", "w-eye", "w-get", "w-use", "w-find", "w-behind"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10
SENT_UNTAG = {  # id -> [(상황 번호, 문장 번호)]
 "w-unit": [(18, 4)],
 "w-clear": [(13, 6)],
 "w-run": [(7, 2), (10, 2), (20, 1), (20, 6)],
 "w-keep": [(11, 4)],
 "w-route": [(12, 5)],
 "w-scan": [(19, 3)],
 "w-recovery": [(7, 5), (17, 2)],
 "w-bag": [(15, 2), (16, 0), (17, 0)],
}
SENT_WHY = {
 "w-unit": "unit의 ko는 '중환자실' — two units of blood는 혈액 단위라 태그를 뺌",
 "w-clear": "clear의 ko는 '벗어난' — cleared for the scanner는 '승인됐다'라 태그를 뺌",
 "w-run": "run의 ko는 '작동하다' — runs dry·run the meds·run out은 다른 뜻이라 태그를 뺌",
 "w-keep": "keep의 ko는 '유지하다' — keep count는 '세어 두다'라 태그를 뺌",
 "w-route": "route의 ko는 '경로' — en route는 '이동 중'이라는 관용 표현이라 태그를 뺌",
 "w-scan": "scan의 ko는 '검사' — 'not scanned'는 MRI 선별을 마치지 않았다는 뜻이라 태그를 뺌",
 "w-recovery": "recovery의 ko는 명사 '회복' — it recovered·doesn't recover는 동사라 태그를 뺌",
 "w-bag": "bag의 ko는 '백' — bagging은 백으로 환기하는 동사라 태그를 뺌",
}
EXAMPLE = {}  # id -> 새 예문(문장 en 그대로)
ids0 = {w["id"] for w in base["words"]}
assert set(KO) <= ids0 and DETAG <= ids0 and set(SENT_UNTAG) <= ids0, (set(KO)-ids0, DETAG-ids0, set(SENT_UNTAG)-ids0)

out = copy.deepcopy(base)
sent_changes = []
for si, s in enumerate(out["situations"]):
    for i, x in enumerate(s["sentences"]):
        nw, why = [], []
        for w in x["words"]:
            if w in DETAG:
                why.append("쉬운 말 태그를 뺌"); continue
            if (si, i) in SENT_UNTAG.get(w, []):
                why.append(SENT_WHY[w]); continue
            nw.append(w)
        if nw != x["words"]:
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": "; ".join(dict.fromkeys(why)) + " — 문장은 그대로"})
    nd = len({w for x in s["sentences"] for w in x["words"]})
    if nd < 8: print("V3: 상황", si, s["title"], "단어", nd)
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
words = [w for w in out["words"] if w["id"] not in DETAG]
zero = sorted({w["id"] for w in words} - used)
if zero: print("태그 0인 단어:", zero)
words = [w for w in words if w["id"] in used]
for w in words:
    if w["id"] in KO: w["ko"] = KO[w["id"]][0]
    if w["id"] in EXAMPLE: w["example"] = EXAMPLE[w["id"]]
tagged_in = defaultdict(set)
for s_ in out["situations"]:
    for x in s_["sentences"]:
        for wid in x["words"]: tagged_in[wid].add(x["en"])
# 예문이 태그를 잃은 단어는 태그된 첫 문장으로 (EXAMPLE 로 지정하지 않으면 알려 준다)
for w in words:
    if w["example"] not in tagged_in[w["id"]]: print("EXAMPLE not tagged:", w["id"], "|", w["example"], "| 후보:", sorted(tagged_in[w["id"]])[:2])
out["words"] = words
if "--ids" in sys.argv:
    g = defaultdict(list)
    for w in words: g[w["ko"]].append(w["id"])
    print("ko dups:", {k: v for k, v in g.items() if len(v) > 1})
    print(len(words))
    sys.exit()

sent_by_en = {x["en"]: x["ko"] for s in base["situations"] for x in s["sentences"]}
BAD = set("""ass arse anal anus butt cum cunt cock dick fag fuck homo jizz naff nig piss porn rape shit slut sux tit tits twat wank whore
bra bonzo dork dwarf flog grope hearse hell lust oriental slay sow stab strangle tomb tramp underwear witch nasty
beer wine rum gin booze pub bar shot shots liquor drunk vodka whisky whiskey ale brew keg cider sake toast cork tipsy sober wake coffin grave burial funeral urn casket dead die died kill sex sexy nude naked breast boob""".split())
BADSUB = ["ass", "tit", "butt", "cum", "dick", "anal", "sex", "hell", "lust", "die", "dead", "kill", "shot", "bar", "gin", "rum", "pub"]
TAGS = {"바이탈", "기도·호흡", "약물·주입", "이송 장비", "진정·시술", "응급 대응", "MRI 안전", "인계·소통", "일반 어휘", "시간·정도"}
def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return abs(n(a) - n(b)) <= 3 or max(n(a), n(b)) <= 1.25 * min(n(a), n(b))
def parse_chips(s): return [x.split("|") for x in s.split()]
data = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        wid = "w-" + str(e["w"])
        assert wid not in data, ("dup", wid)
        data[wid] = e
ids = {w["id"] for w in words}
assert set(data) <= ids, ("모르는 id", sorted(set(data) - ids))
missing = sorted(ids - set(data))
lint = []; tagc = {}
def spell_alt(frags, decoys, target):
    pool = {f.lower() for f in frags} | {d.lower() for d in decoys}
    t = target.lower().replace(" ", "")
    ways = [0] * (len(t) + 1); ways[0] = 1
    for i in range(len(t)):
        if ways[i]:
            for p in pool:
                if t.startswith(p, i): ways[i + len(p)] += ways[i]
    return ways[len(t)]
kobank = defaultdict(set)
for w in words: kobank[w["ko"]].add(w["id"])
for w in words:
    e = data.get(w["id"])
    if not e: continue
    ex = w["example"]; assert ex in sent_by_en, ex
    w["exKo"] = sent_by_en[ex]
    w["cue"] = e["cue"]; w["tag"] = e["tag"]; tagc[e["tag"]] = tagc.get(e["tag"], 0) + 1
    if e["tag"] not in TAGS: lint.append(f"{w['id']}: tag {e['tag']!r} not in set")
    for k in ("dEn", "dKo", "decoy"):
        for x in e[k]:
            if not isinstance(x, str): print("NOT STR", w["id"], k, x)
    w["distractorsEn"] = [str(x) for x in e["dEn"]]; w["distractorsKo"] = [str(x) for x in e["dKo"]]
    w["chips"] = parse_chips(e["chips"]); w["decoyChips"] = [str(x) for x in e["decoy"]]
    joined = " ".join("".join(c) for c in w["chips"])
    if joined != w["en"]: lint.append(f"{w['id']}: chips {joined!r} != {w['en']!r}")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    for o in w["distractorsEn"]:
        if not okLen(w["en"], o): lint.append(f"{w['id']}: dEn {o!r} length vs {w['en']!r}")
        if o.lower() == w["en"].lower(): lint.append(f"{w['id']}: dEn same")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} length vs {w['ko']!r}")
        if o == w["ko"]: lint.append(f"{w['id']}: dKo same")
        if o in kobank: lint.append(f"{w['id']}: dKo {o!r} is another bank word's ko {sorted(kobank[o])}")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    if not w["decoyChips"]: lint.append(f"{w['id']}: no decoy")
    frags = [f for c in w["chips"] for f in c]
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for f in frags}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
    if len(frags) > 6 or any(len(c) > 4 for c in w["chips"]): lint.append(f"{w['id']}: too many chips")
    if len(w["chips"]) == 1 and len(w["chips"][0]) == 1 and len(w["en"]) > 8: lint.append(f"{w['id']}: long word as one chip")
    if spell_alt(frags, w["decoyChips"], w["en"].replace(" ", "")) > 1: lint.append(f"{w['id']}: decoy respells the answer")
    ko_cue = re.sub(r"[\s·]", "", w["ko"])
    if len(ko_cue) >= 3 and ko_cue in re.sub(r"\s", "", w["cue"]): lint.append(f"{w['id']}: cue repeats ko")
    for t in [*w["distractorsEn"], *w["decoyChips"], *frags]:
        if t.lower() in BAD: lint.append(f"{w['id']}: offensive/alcohol {t!r}")
    for t in [*w["distractorsEn"], *w["decoyChips"]]:
        tl = t.lower()
        if len(tl) >= 3 and tl in BAD: pass
    if w["tag"] and len(w["tag"]) > 10: lint.append(f"{w['id']}: tag long")
if missing and "--partial" not in sys.argv: print("단어 데이터 빠짐:", len(missing), missing)
for l in lint: print("LINT", l)
print("tags:", tagc)
g = defaultdict(list)
for w in words: g[w["ko"]].append(w["id"])
for k, v in g.items():
    if len(v) > 1: print("KO DUP", k, v)

nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        assert e["situation"] not in nu, e["situation"]
        nu[e["situation"]] = e["items"]
titles = [s["title"] for s in out["situations"]]
assert set(nu) <= set(titles), set(nu) - set(titles)
kinds = defaultdict(int)
for s in out["situations"]:
    if s["title"] in nu:
        s["nuance"] = nu[s["title"]]
        tagged = {w for x in s["sentences"] for w in x["words"]}
        for it in s["nuance"]:
            kinds[it["kind"]] += 1
            for wid in it["words"]:
                if wid not in tagged: print("V15?", s["title"], wid)
            if it["kind"] == "context":
                for sc in it["scenes"]:
                    if it["word"].lower() not in sc["en"].lower(): print("W14?", s["title"], it["word"], "|", sc["en"])
print("nuance kinds", dict(kinds))
if "--partial" not in sys.argv and set(nu) != set(titles):
    print("뉘앙스 빠진 상황:", [t for t in titles if t not in nu])

with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
changes = []
for wid, (ko, why) in KO.items():
    if wid in {w["id"] for w in words}:
        fl = ["ko"] + (["example"] if wid in EXAMPLE else [])
        changes.append({"kind": "word", "id": wid, "fields": fl, "why": why + (" — 옛 예문 문장에서 태그를 뺐으므로 예문을 태그된 문장으로 바꿈" if wid in EXAMPLE else "")})
for wid in sorted(DETAG):
    changes.append({"kind": "word-remove", "id": wid, "why": ("너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다" if wid in DETAG_COMMON else "간호사가 이미 아는 쉬운 말이라 가르칠 값이 없다 — 어느 문장도 태그하지 않게 됐다")})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "data", len(data), "changes", len(changes), "nuance sits", len(nu))
