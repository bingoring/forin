#!/usr/bin/env python3
"""icu-infection-prevention A — 결정 11 정리 + 단어 v45 + 뉘앙스를 base에 얹어 icu-infection-prevention.A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy, re
T = "icu-infection-prevention"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

INFL = {  # id -> (en, ipa, why)
  "w-require": ("require", "/rɪˈkwaɪər/", "활용형(required)을 원형으로"),
  "w-germ": ("germ", "/dʒɜːrm/", "복수형(germs)을 단수 원형으로"),
  "w-visit": ("visit", "/ˈvɪzɪt/", "활용형(visiting)을 원형으로"),
  "w-glove": ("glove", "/ɡlʌv/", "복수형(gloves)을 단수 원형으로"),
  "w-kill": ("kill", "/kɪl/", "활용형(kills)을 원형으로"),
  "w-medication": ("medication", "/ˌmɛdɪˈkeɪʃən/", "복수형(medications)을 단수 원형으로"),
  "w-lower": ("lower", "/ˈloʊər/", "활용형(lowers)을 원형으로"),
  "w-round": ("round", "/raʊnd/", "복수형(rounds)을 단수 원형으로"),
  "w-raise": ("raise", "/reɪz/", "활용형(raised)을 원형으로"),
  "w-lung": ("lung", "/lʌŋ/", "복수형(lungs)을 단수 원형으로"),
  "w-step": ("step", "/stɛp/", "복수형(steps)을 단수 원형으로"),
  "w-surface": ("surface", "/ˈsɜːrfɪs/", "복수형(surfaces)을 단수 원형으로"),
  "w-spread": ("spread", "/sprɛd/", "활용형(spreading)을 원형으로"),
  "w-device": ("device", "/dɪˈvaɪs/", "복수형(devices)을 단수 원형으로"),
  "w-wipe": ("wipe", "/waɪp/", "활용형(wiped)을 원형으로"),
  "w-move": ("move", "/muːv/", "활용형(moving)을 원형으로"),
  "w-notice": ("notice", "/ˈnoʊtɪs/", "활용형(noticing)을 원형으로"),
  "w-meet": ("meet", "/miːt/", "활용형(met)을 원형으로"),
  "w-break": ("break", "/breɪk/", "복수형(breaks)을 단수 원형으로"),
  "w-course": ("course", "/kɔːrs/", "복수형(courses)을 단수 원형으로"),
  "w-precaution": ("precaution", "/prɪˈkɔːʃən/", "복수형(precautions)을 단수 원형으로"),
  "w-spore": ("spore", "/spɔːr/", "복수형(spores)을 단수 원형으로"),
  "w-measure": ("measure", "/ˈmɛʒər/", "복수형(measures)을 단수 원형으로"),
  "w-contact": ("contact", "/ˈkɑːntækt/", "복수형(contacts)을 단수 원형으로"),
  "w-case": ("case", "/keɪs/", "복수형(cases)을 단수 원형으로"),
  "w-decision": ("decision", "/dɪˈsɪʒən/", "복수형(decisions)을 단수 원형으로"),
  "w-report": ("report", "/rɪˈpɔːrt/", "활용형(reported)을 원형으로"),
  "w-evaluate": ("evaluate", "/ɪˈvæljueɪt/", "활용형(evaluated)을 원형으로"),
  "w-hospital": ("hospital", "/ˈhɑːspɪtəl/", "소유격(hospital's)을 원형으로"),
  "w-bleach": ("bleach", "/bliːtʃ/", "문장 첫머리 대문자(Bleach)를 소문자 원형으로"),
  "w-need": ("need", "/niːd/", "활용형(needed)을 원형으로"),
  "w-follow": ("follow", "/ˈfɑːloʊ/", "활용형(following)을 원형으로"),
  "w-mean": ("mean", "/miːn/", "활용형(means)을 원형으로"),
}
KO = {
  "w-check": ("점검하다", "ko '확인하다'가 w-confirm과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — check는 '점검하다'로 가름"),
  "w-document": ("문서화하다", "ko '기록하다'가 w-log와 같아 정답이 둘이 된다 — 가름"),
  "w-log": ("기재하다", "ko '기록하다'가 w-document와 같아 정답이 둘이 된다 — 가름"),
  "w-notify": ("통지하다", "ko '알리다'가 w-alert와 같아 정답이 둘이 된다 — 가름"),
  "w-alert": ("긴급히 알리다", "ko '알리다'가 w-notify와 같아 정답이 둘이 된다 — 가름"),
  "w-risk": ("위험성", "ko '위험'이 w-danger와 같아 정답이 둘이 된다 — risk는 '위험성'으로 가름"),
  "w-danger": ("위해 요소", "ko '위험'이 w-risk와 같아 정답이 둘이 된다 — danger는 '위해 요소'로 가름"),
  "w-tighten": ("더 조이다", "ko '강화하다'가 w-reinforce와 같아 정답이 둘이 된다 — 가름"),
  "w-tighter": ("더 촘촘한", "ko '더 엄격한'이 w-strict와 겹쳐 정답이 둘이 된다 — 가름"),
  "w-require": ("요구하다", "ko '필요로 하다'가 w-need와 거의 같아 정답이 둘이 된다 — 가름"),
  "w-put": ("놓다/입다", "ko '착용하다'가 w-wear와 같아 정답이 둘이 된다 — 가름"),
  "w-clean": ("깨끗이 하다", "ko '씻다'가 w-wash와 같아 정답이 둘이 된다 — clean은 '깨끗이 하다'로 가름"),
  "w-report": ("보고하다", "활용형 정리에 맞춰 ko를 '보고되다'에서 '보고하다'로"),
  "w-meet": ("충족하다", "활용형 정리에 맞춰 ko를 '충족되다'에서 '충족하다'로"),
  "w-evaluate": ("평가하다", "활용형 정리에 맞춰 ko를 '평가받다'에서 '평가하다'로"),
  "w-hospital": ("병원", "소유격 정리에 맞춰 ko를 '병원의'에서 '병원'으로"),
  "w-give": ("전달하다", "문장 'give them the onset date'에 맞게 — '주다'는 정보 전달을 못 담는다"),
}
FIX = {}; WHY = {}
for wid, (en, ipa, why) in INFL.items():
    FIX[wid] = dict(en=en, ipa=ipa); WHY[wid] = why
for wid, (ko, why) in KO.items():
    FIX.setdefault(wid, {})["ko"] = ko
    WHY[wid] = (WHY[wid] + " / " if wid in WHY else "") + why

DETAG_COMMON = ["w-day","w-today","w-room","w-doctor","w-patient","w-head","w-hand","w-go","w-week","w-hour","w-minute","w-morning"]
DETAG_JUDGE = ["w-bed","w-water","w-mouth","w-teeth","w-skin","w-flower","w-plant","w-color","w-first","w-ask"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10
ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0, (set(FIX)-ids0, DETAG-ids0)

out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        nw = [w for w in x["words"] if w not in DETAG]
        if nw != x["words"]:
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": "너무 쉬운 말 태그를 뺌 — 문장은 그대로"})
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

def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return (n(b) <= max(n(a) * 1.25, n(a) + 3) and n(b) >= min(n(a) / 1.25, n(a) - 3)) or abs(n(a)-n(b)) <= 3
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
        if o.lower() == w["en"].lower(): lint.append(f"{w['id']}: dEn equals answer")
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
if "--words-only" not in sys.argv and set(nu) != set(titles):
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
