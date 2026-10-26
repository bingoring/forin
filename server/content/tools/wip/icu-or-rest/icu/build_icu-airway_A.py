#!/usr/bin/env python3
"""icu-airway A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-airway.A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy, re
T = "icu-airway"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# ---- 결정 11 ----------------------------------------------------------------
INFL = {  # 활용형 헤드워드 → 원형 (id는 그대로)
  "w-tie": ("tie", "/taɪ/", "복수형(ties)을 단수 원형으로"),
  "w-secretion": ("secretion", "/sɪˈkriːʃən/", "복수형(secretions)을 단수 원형으로"),
  "w-edge": ("edge", "/ɛdʒ/", "복수형(edges)을 단수 원형으로"),
  "w-result": ("result", "/rɪˈzʌlt/", "복수형(results)을 단수 원형으로"),
  "w-sound": ("sound", "/saʊnd/", "복수형(sounds)을 단수 원형으로"),
  "w-centimeter": ("centimeter", "/ˈsɛntəˌmiːtər/", "복수형(centimeters)을 단수 원형으로"),
  "w-number": ("number", "/ˈnʌmbər/", "복수형(numbers)을 단수 원형으로"),
  "w-sign": ("sign", "/saɪn/", "복수형(signs)을 단수 원형으로"),
  "w-level": ("level", "/ˈlɛvəl/", "복수형(levels)을 단수 원형으로"),
  "w-device": ("device", "/dɪˈvaɪs/", "복수형(devices)을 단수 원형으로"),
  "w-burn": ("burn", "/bɜːrn/", "복수형(burns)을 단수 원형으로"),
  "w-help": ("help", "/hɛlp/", "활용형(helps)을 원형으로"),
  "w-prevent": ("prevent", "/prɪˈvɛnt/", "활용형(prevents)을 원형으로"),
  "w-worsen": ("worsen", "/ˈwɜːrsən/", "활용형(worsens)을 원형으로"),
  "w-desaturate": ("desaturate", "/diːˈsætʃəreɪt/", "활용형(desaturates)을 원형으로"),
  "w-struggle": ("struggle", "/ˈstrʌɡəl/", "활용형(struggles)을 원형으로"),
  "w-fail": ("fail", "/feɪl/", "활용형(fails)을 원형으로"),
  "w-buy": ("buy", "/baɪ/", "활용형(buys)을 원형으로"),
  "w-lower": ("lower", "/ˈloʊər/", "활용형(lowers)을 원형으로"),
  "w-hesitate": ("hesitate", "/ˈhɛzɪteɪt/", "활용형(hesitates)을 원형으로"),
  "w-ventilate": ("ventilate", "/ˈvɛntɪleɪt/", "활용형(ventilates)을 원형으로"),
  "w-hit": ("hit", "/hɪt/", "활용형(hits)을 원형으로"),
  "w-mean": ("mean", "/miːn/", "활용형(means)을 원형으로"),
  "w-work": ("work", "/wɜːrk/", "활용형(working)을 원형으로"),
  "w-dry": ("dry", "/draɪ/", "활용형(drying)을 원형으로"),
  "w-call": ("call", "/kɔːl/", "활용형(calling)을 원형으로"),
  "w-mark": ("mark", "/mɑːrk/", "활용형(marking)을 원형으로"),
  "w-drop": ("drop", "/drɑːp/", "활용형(dropping)을 원형으로"),
  "w-rise": ("rise", "/raɪz/", "활용형(rising)을 원형으로"),
  "w-bring": ("bring", "/brɪŋ/", "활용형(bringing)을 원형으로"),
  "w-obstruct": ("obstruct", "/əbˈstrʌkt/", "활용형(obstructing)을 원형으로"),
  "w-escalate": ("escalate", "/ˈɛskəleɪt/", "활용형(escalating)을 원형으로"),
  "w-wait": ("wait", "/weɪt/", "활용형(waiting)을 원형으로"),
  "w-tape": ("tape", "/teɪp/", "활용형(taped)을 원형으로"),
  "w-become": ("become", "/bɪˈkʌm/", "활용형(becomes)을 원형으로"),
  "w-close": ("close", "/kloʊz/", "활용형(closes)을 원형으로"),
}
KO = {  # id → (새 ko, 이유)
  "w-check": ("점검하다", "ko '확인하다'가 w-confirm·w-verify와 같아 듣고 뜻 고르기에서 정답이 셋이 된다 — check는 '점검하다'로 가름"),
  "w-verify": ("검증하다", "ko '확인하다'가 w-check·w-confirm과 같아 정답이 겹친다 — 가름"),
  "w-tell": ("알려 주다", "ko '말하다'가 w-say와 같아 정답이 둘이 된다 — tell은 '알려 주다'로 가름"),
  "w-line": ("나란히 맞춰진", "ko '정렬된'이 w-align과 같아 정답이 둘이 된다 — 가름"),
  "w-stay": ("그대로 있다", "ko '유지하다'가 w-keep과 같아 정답이 둘이 된다 — stay는 '그대로 있다'로 가름"),
  "w-hard": ("쉽지 않은", "ko '어려운'이 w-difficult와 같아 정답이 둘이 된다 — 가름"),
  "w-monitor": ("모니터링하다", "ko '지켜보다'가 w-watch와 같아 정답이 둘이 된다 — monitor는 '모니터링하다'로 가름"),
  "w-close": ("닫히다/가까운", "ko '막히다'가 w-obstruct와 같고, 이 말은 'airway closes'(닫히다)와 'keep the cart close'(가까운) 두 문장에 쓰여 둘 다 담음"),
  "w-review": ("훑어보다", "ko '점검하다'가 새 w-check와 겹친다 — 가름"),
  "w-place": ("놓다", "ko '눕히다'는 'place the speaking valve'(밸브를 달다)를 못 담는다 — 두 문장에 다 맞게 '놓다'로"),
  "w-stat": ("당장", "ko '즉시'가 w-immediate와 거의 같아 정답이 둘이 된다 — '당장'으로 가름"),
}
FIX = {}
WHY = {}
for wid, (en, ipa, why) in INFL.items():
    FIX[wid] = dict(en=en, ipa=ipa); WHY[wid] = why
for wid, (ko, why) in KO.items():
    FIX.setdefault(wid, {})["ko"] = ko
    WHY[wid] = (WHY[wid] + " / " if wid in WHY else "") + why
# 너무 쉬운 말 — 문장은 그대로 두고 태그만 뺀다. 은행에서도 지운다.
DETAG_COMMON = ["w-name","w-time","w-now","w-head","w-hand","w-know","w-go","w-patient","w-minute","w-see","w-come"]
DETAG_JUDGE = ["w-got","w-one","w-water","w-bed","w-nose","w-mouth","w-finger","w-teeth"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10

ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0, (set(FIX)-ids0, DETAG-ids0)

SENT_UNTAG = {("기관절개 발성밸브 적용", 4): ["w-off"]}  # take the valve off — 'off'는 이 문장에서 불변사(헤드워드 ko '이상한'과 안 맞음)
out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        nw = [w for w in x["words"] if w not in DETAG and w not in SENT_UNTAG.get((s["title"], i), [])]
        if nw != x["words"]:
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": ("w-off 태그를 뺌 — 여기서 off는 take off의 불변사라 헤드워드 ko(이상한)와 안 맞는다, 문장은 그대로" if (s["title"], i) in SENT_UNTAG else "너무 쉬운 말(또는 가르칠 값이 없는 말) 태그를 뺌 — 문장은 그대로")})
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
