#!/usr/bin/env python3
"""icu-nutrition A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-nutrition.A.yaml · changes 를 쓴다."""
import glob, re, sys, copy, yaml
from collections import defaultdict
T = "icu-nutrition"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

KO = {  # id -> (새 ko, 이유)
 "w-need": ("필요하다", "문장 대부분이 동사(he needs, we need to)라 명사 '필요'보다 동사가 맞는다"),
 "w-check": ("점검하다", "ko '확인하다'가 w-verify·w-confirm과 같아 듣고 뜻 고르기에서 정답이 셋이 된다 — check는 '점검하다'로 가름"),
 "w-verify": ("검증하다", "ko '확인하다'가 w-check·w-confirm과 같아 가름"),
 "w-placement": ("삽입 위치", "ko '위치'가 w-position과 같아 정답이 둘이 된다 — placement는 관을 넣은 자리라 '삽입 위치'"),
 "w-position": ("자세", "ko '위치'가 w-placement와 같아 가름 — 태그된 문장은 'comfortable in this position'(자세)이라 tube position 문장은 태그를 뺌"),
 "w-elevate": ("높이다", "ko '올리다'가 w-raise와 같아 정답이 둘이 된다 — 가름"),
 "w-reduce": ("감소시키다", "ko '줄이다'가 w-lower·w-cutback과 같아 정답이 셋이 된다 — 가름"),
 "w-lower": ("낮추다", "ko '줄이다'가 w-reduce·w-cutback과 같아 가름"),
 "w-alert": ("알려 주다", "ko '알리다'가 w-flag·w-notify와 같아 정답이 셋이 된다 — 가름"),
 "w-flag": ("짚어 알리다", "ko '알리다'가 w-alert·w-notify와 같아 가름"),
 "w-notify": ("통보하다", "ko '알리다'가 w-alert·w-flag와 같아 가름"),
 "w-document": ("기록으로 남기다", "ko '기록하다'가 w-chart와 같아 정답이 둘이 된다 — 가름"),
 "w-chart": ("차트에 기록하다", "ko '기록하다'가 w-document와 같아 가름"),
 "w-tense": ("단단히 긴장된", "ko '팽팽한'이 w-tight와 같아 정답이 둘이 된다 — 가름"),
 "w-rigid": ("경직된", "ko '단단한'이 w-hard와 같아 정답이 둘이 된다 — 가름 (rigid belly는 널빤지처럼 굳은 배)"),
 "w-listen": ("귀 기울이다", "ko '듣다'가 w-hear와 같아 정답이 둘이 된다 — listen for/to는 '귀 기울여 듣다(청진)'"),
 "w-suction": ("석션하다", "ko '흡인하다'가 w-aspirate와 거의 같아 정답이 둘이 된다 — 가름"),
 "w-aspirate": ("흡인되다", "'흡인하다(음식이)'는 w-suction과 겹친다 — 문장은 환자가 흡인되는 뜻(keeps aspirating)"),
 "w-bowel": ("창자", "ko '배변'은 bowel sounds·dead bowel 문장과 안 맞고 w-movement와도 겹친다 — 가름"),
 "w-tolerance": ("견디는 정도", "'내성'은 약물 내성으로 읽히기 쉽다 — feeding tolerance는 급식을 견디는 정도"),
 "w-slow": ("늦추다", "태그된 문장은 동사(we can slow it down)라 형용사 '느린'을 동사로"),
 "w-support": ("보조하다", "'혈압을 지지하다'는 어색하다 — support her pressure는 혈압을 보조(유지)하다"),
 "w-get": ("마련하다", "ko '~하게 되다'는 get an x-ray·get antibiotics 같은 문장에 안 맞는다 — '마련하다'로, 'get comfortable/get her sitting up' 문장은 태그를 뺌"),
 "w-change": ("바꾸다", "change the dressing·hold or change the rate는 '교체/변경' — 명사 문장(any new changes)은 태그를 뺌"),
 "w-respiratory": ("호흡치료팀", "'calling respiratory'는 호흡치료팀을 부른다는 뜻이라 '호흡기'보다 맞는다"),
}
DETAG_COMMON = ["w-body","w-hour","w-now","w-today","w-morning","w-know","w-go","w-see","w-family","w-time","w-bad","w-good"]
DETAG_JUDGE = ["w-eat","w-small","w-same","w-job","w-here","w-love","w-think","w-together","w-much","w-too"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10
SENT_UNTAG = {
 "w-position": [(2,2)],
 "w-get": [(3,2),(17,5)],
 "w-rule": [(14,2)],
 "w-keep": [],
 "w-down": [(12,3)],
 "w-hard": [(20,5)],
 "w-full": [(20,0)],
 "w-pressure": [(16,2)],
 "w-change": [(19,6)],
}
SENT_WHY = {
 "w-position": "position의 ko는 '자세' — tube position은 관의 위치라 태그를 뺌",
 "w-get": "get의 ko는 '마련하다' — get comfortable·get her sitting up은 '~하게 되다/하게 하다'라 태그를 뺌",
 "w-rule": "rule의 ko는 '규칙' — rule out은 '배제하다'라 태그를 뺌",
 "w-down": "down의 ko는 '아래로' — 'residuals are down'은 '줄었다'라 태그를 뺌",
 "w-hard": "hard의 ko는 '단단한' — hard to hear는 '듣기 힘든'이라 태그를 뺌",
 "w-full": "full의 ko는 '가득 찬' — full nutrition은 '충분한'이라 태그를 뺌",
 "w-pressure": "pressure의 ko는 '압력' — support her pressure는 혈압이라 태그를 뺌",
 "w-change": "change의 ko는 동사 '바꾸다' — any new changes는 명사라 태그를 뺌",
}
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
            assert nw, (s["title"], i)
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": "; ".join(dict.fromkeys(why)) + " — 문장은 그대로"})
    nd = len({w for x in s["sentences"] for w in x["words"]})
    assert nd >= 8, (s["title"], nd)
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
words = [w for w in out["words"] if w["id"] not in DETAG]
assert {w["id"] for w in words} == used, sorted({w["id"] for w in words} ^ used)
for w in words:
    if w["id"] in KO:
        w["ko"] = KO[w["id"]][0]
out["words"] = words
if "--ids" in sys.argv:
    g = defaultdict(list)
    for w in words: g[w["ko"]].append(w["id"])
    print("ko dups:", {k: v for k, v in g.items() if len(v) > 1})
    print(len(words))
    for i, w in enumerate(words): print(i + 1, w["id"][2:], w["en"], w["ko"], "|", w["example"])
    sys.exit()

sent_by_en = {x["en"]: x["ko"] for s in base["situations"] for x in s["sentences"]}

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
for w in words:
    e = data.get(w["id"])
    if not e: continue
    ex = w["example"]; assert ex in sent_by_en, ex
    w["exKo"] = sent_by_en[ex]
    w["cue"] = e["cue"]; w["tag"] = e["tag"]; tagc[e["tag"]] = tagc.get(e["tag"], 0) + 1
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
    if w["tag"] and len(w["tag"]) > 10: lint.append(f"{w['id']}: tag long")
if missing and "--partial" not in sys.argv and "--words-only" not in sys.argv: print("단어 데이터 빠짐:", len(missing), missing)
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
if "--words-only" not in sys.argv and "--partial" not in sys.argv and set(nu) != set(titles):
    print("뉘앙스 빠진 상황:", [t for t in titles if t not in nu])

with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
changes = []
for wid, (ko, why) in KO.items():
    if wid in {w["id"] for w in words}:
        changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
for wid in sorted(DETAG):
    changes.append({"kind": "word-remove", "id": wid, "why": ("너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다" if wid in DETAG_COMMON else "간호사가 이미 아는 쉬운 말이라 가르칠 값이 없다 — 어느 문장도 태그하지 않게 됐다")})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "data", len(data), "changes", len(changes), "nuance sits", len(nu))
