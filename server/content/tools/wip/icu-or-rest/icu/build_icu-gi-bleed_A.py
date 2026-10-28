#!/usr/bin/env python3
"""icu-gi-bleed A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-gi-bleed.A.yaml · changes 를 쓴다."""
import glob, re, sys, copy, yaml
T = "icu-gi-bleed"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# ---- 결정 11: 단어 ---------------------------------------------------------
KO = {  # id -> (새 ko, 이유)
 "w-bleed": ("출혈", "문장 대부분이 명사·동명사(bleeding, variceal bleed)라 '피가 나다'보다 '출혈'이 맞는다"),
 "w-check": ("점검하다", "ko '확인하다'가 w-confirm과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — check는 '점검하다'로 가름"),
 "w-take": ("재다", None),  # 유지(태그 정리만)
 "w-fast": ("빠르게", "두 문장 모두 부사(run fluids faster, dropped fast)라 형용사 ko를 부사로"),
 "w-lab": ("검사", "문장 대부분이 labs=검사 수치·검사라 '검사실'보다 '검사'가 맞는다 — 'the lab'(검사실) 문장은 태그를 뺌"),
 "w-bank": ("혈액은행", "bank는 blood bank로만 쓰인다 — '은행'은 오해를 부른다"),
 "w-get": ("마련하다", "ko '가져오다'가 w-bring과 같아 정답이 둘이 된다 — get은 '마련하다'로 가름"),
 "w-gather": ("모으다", "ko '챙기다'가 w-grab('급히 챙기다')과 거의 같아 가름"),
 "w-cell": ("혈구", "packed cells는 '농축 혈구' — '세포'는 부정확"),
 "w-count": ("혈구 수", "ko '수치'가 w-number·w-value와 같아 정답이 셋이 된다 — blood count는 '혈구 수'"),
 "w-value": ("값", "ko '수치'가 w-number·w-count와 같아 가름"),
 "w-lightheaded": ("머리가 핑 도는", "ko '어지러운'이 w-dizzy와 같아 정답이 둘이 된다 — 가름"),
 "w-frightening": ("겁이 나는", "ko '무서운'이 w-terrifying과 같아 정답이 둘이 된다 — 가름"),
 "w-terrifying": ("소름 끼치게 무서운", "ko '무서운'이 w-frightening과 같아 가름"),
 "w-write": ("적다", "ko '기록하다'가 w-note·w-track·w-log와 같아 정답이 넷이 된다 — write는 '적다'로 가름"),
 "w-note": ("메모하다", "ko '기록하다'가 w-write·w-track·w-log와 같아 가름"),
 "w-track": ("파악하다", "ko '기록하다'가 w-write·w-note·w-log와 같아 가름 — keep track of은 양을 계속 파악해 둔다는 뜻"),
 "w-settle": ("가라앉다", "ko '안정되다'가 w-stable·w-stabilize·w-steady와 너무 가까워 가름"),
 "w-steady": ("꾸준한", "ko '안정적인'이 w-stable과 너무 가까워 가름"),
 "w-flag": ("짚어 알리다", "ko '알리다'가 w-notify와 같아 정답이 둘이 된다 — 가름"),
 "w-notify": ("통보하다", "ko '알리다'가 w-flag와 같아 가름"),
 "w-stat": ("당장", "ko '즉시'가 w-immediately와 같아 정답이 둘이 된다 — 가름"),
 "w-new": ("새로 생긴", "ko '새로운'이 w-fresh와 겹쳐 가름"),
 "w-clot": ("응고", "문장 4개 중 3개가 동사·동명사(clotting, clots)라 '혈전'(명사)보다 '응고'가 맞는다"),
 "w-warm": ("따뜻하게 하다", "'데우다'는 'warm the blood'만 담는다 — 'keep him warm'까지 담게"),
 "w-call": ("연락하다", "문장 대부분이 사람·부서에 연락하는 뜻 — '부르다'보다 '연락하다'"),
 "w-rate": ("속도", "주입 속도(infusion rate) 문장에 맞춘다 — heart rate 문장은 태그를 뺌"),
 "w-further": ("한층 더", "ko '더'가 w-anymore('더 이상')와 겹치지 않게 가름"),
 "w-below": ("미만의", "ko '아래'가 w-down('아래로')과 너무 가까워 가름 — 7.2는 8보다 낮다는 수 비교"),
 "w-frequently": ("수시로", "ko '자주'가 w-often과 같아 정답이 둘이 된다 — frequently는 '수시로'로 가름"),
}
KO = {k: v for k, v in KO.items() if v[0] and v[1]}
DETAG_COMMON = ["w-hour","w-minute","w-time","w-now","w-today","w-morning","w-name","w-doctor","w-family","w-body","w-know","w-go","w-see","w-come","w-good"]
DETAG_JUDGE = ["w-same","w-here","w-water","w-eat","w-want","w-talk","w-most","w-lot","w-okay","w-still"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10
# (상황 인덱스, 문장 인덱스) -> 뺄 단어 — 헤드워드 ko가 그 문장의 뜻과 안 맞는다
SENT_UNTAG = {
 "w-take": [(1,1),(5,1),(5,3),(17,0),(17,3)],
 "w-call": [(3,6)],
 "w-lab": [(1,4)],
 "w-turn": [(4,5),(9,4)],
 "w-right": [(16,2)],
 "w-pressure": [(17,3)],
 "w-rate": [(3,4),(12,5)],
 "w-hold": [(8,0),(10,6)],
 "w-wheel": [(14,6)],
 "w-repeat": [(18,5)],
 "w-place": [(16,5)],
 "w-clear": [(16,3)],
}
SENT_WHY = {
 "w-take": "take의 ko는 '재다'(take vitals) — 이 문장은 맡다·복용하다·데려가다·압력을 낮추다라 태그를 뺌",
 "w-turn": "turn의 ko는 '돌리다' — 이 문장의 turn은 '바뀌다'라 태그를 뺌",
 "w-right": "right의 ko는 '오른쪽의' — 이 문장의 right here는 부사라 태그를 뺌",
 "w-pressure": "pressure의 ko는 '혈압' — 이 문장의 pressure off는 정맥류 '압력'이라 태그를 뺌",
 "w-rate": "rate의 ko를 '속도'로 맞췄다 — heart rate 문장은 '심박수'라 태그를 뺌",
 "w-hold": "hold의 ko는 '유지되다' — 이 문장의 hold는 '따르다/미루다'라 태그를 뺌",
 "w-call": "call의 ko는 '연락하다' — call light는 호출 장치(명사)라 태그를 뺌",
 "w-lab": "lab의 ko는 '검사' — the lab은 검사실이라 태그를 뺌",
 "w-wheel": "wheel의 ko는 '이동시키다' — wheels up은 관용 표현이라 태그를 뺌",
 "w-repeat": "repeat의 ko는 동사 '반복하다' — 이 문장의 repeat는 형용사라 태그를 뺌",
 "w-place": "place의 ko는 '자리' — 이 문장의 place는 동사(삽입하다)라 태그를 뺌",
 "w-clear": "clear의 ko는 '명확한' — 이 문장의 clear는 동사(기도를 확보하다)라 태그를 뺌",
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
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, s["title"]
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
words = [w for w in out["words"] if w["id"] not in DETAG]
assert {w["id"] for w in words} == used, sorted({w["id"] for w in words} ^ used)
for w in words:
    if w["id"] in KO:
        w["ko"] = KO[w["id"]][0]
out["words"] = words
if "--ids" in sys.argv:
    from collections import defaultdict
    g = defaultdict(list)
    for w in words: g[w["ko"]].append(w["id"])
    print("ko dups:", {k: v for k, v in g.items() if len(v) > 1})
    print(len(words)); print(" ".join(w["id"][2:] for w in words)); sys.exit()

sent_by_en = {x["en"]: x["ko"] for s in base["situations"] for x in s["sentences"]}

# ---- 단어 v45 ------------------------------------------------------------------
def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return abs(n(a) - n(b)) <= 3 or max(n(a), n(b)) <= 1.25 * min(n(a), n(b))
def parse_chips(s):
    return [x.split("|") for x in s.split()]
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
tagc = {}
def spell_alt(frags, decoys, target):
    """chips 조각 ∪ decoyChips 로 target(공백 제거)을 정답 조각 열과 다른 조합으로 만들 수 있나."""
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
    w["distractorsEn"] = list(e["dEn"]); w["distractorsKo"] = list(e["dKo"])
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
if missing and "--words-only" not in sys.argv and "--partial" not in sys.argv: print("단어 데이터 빠짐:", len(missing), missing)
for l in lint: print("LINT", l)
print("tags:", tagc)
# ko 중복
from collections import defaultdict
g = defaultdict(list)
for w in words: g[w["ko"]].append(w["id"])
for k, v in g.items():
    if len(v) > 1: print("KO DUP", k, v)

# ---- 뉘앙스 ---------------------------------------------------------------------
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
            if it["kind"] == "slider":
                print("slider", it["answerAt"], [len(x) for x in it["scale"]]) if "--sl" in sys.argv else None
print("nuance kinds", dict(kinds))
if "--words-only" not in sys.argv and set(nu) != set(titles):
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
