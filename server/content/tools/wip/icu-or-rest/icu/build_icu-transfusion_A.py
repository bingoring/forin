#!/usr/bin/env python3
"""icu-transfusion A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹는다."""
import glob, re, sys, copy, yaml
T = "icu-transfusion"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# ---- 결정 11 ----
HEAD = {  # id -> (en, ipa, 이유)
 "w-desaturate": ("desaturate", "/diːˈsætʃəreɪt/", "활용형(desaturating)을 원형으로"),
 "w-wheeze": ("wheeze", "/wiːz/", "활용형(wheezing)을 원형으로"),
 "w-wish": ("wish", "/wɪʃ/", "복수형(wishes)을 단수 원형으로"),
 "w-belief": ("belief", "/bɪˈliːf/", "복수형(beliefs)을 단수 원형으로"),
 "w-tube": ("tube", "/tuːb/", "복수형(tubes)을 단수 원형으로"),
 "w-activate": ("activate", "/ˈæktɪveɪt/", "활용형(activating)을 원형으로"),
 "w-role": ("role", "/roʊl/", "복수형(roles)을 단수 원형으로"),
 "w-assign": ("assign", "/əˈsaɪn/", "활용형(assigned)을 원형으로"),
 "w-give": ("give", "/ɡɪv/", "활용형(given)을 원형으로"),
 "w-total": ("total", "/ˈtoʊtəl/", "복수형(totals)을 단수 원형으로"),
 "w-fluid": ("fluid", "/ˈfluːɪd/", "복수형(fluids)을 단수 원형으로"),
 "w-ooze": ("ooze", "/uːz/", "활용형(oozing)을 원형으로"),
 "w-setting": ("setting", "/ˈsɛtɪŋ/", "복수형(settings)을 단수 원형으로"),
 "w-level": ("level", "/ˈlɛvəl/", "복수형(levels)을 단수 원형으로"),
 "w-stretch": ("stretch", "/strɛtʃ/", "활용형(stretching)을 원형으로"),
 "w-compression": ("compression", "/kəmˈprɛʃən/", "복수형(compressions)을 단수 원형으로"),
 "w-matter": ("matter", "/ˈmætər/", "활용형(mattered)을 원형으로"),
}
KO = {  # id -> (새 ko, 이유)
 "w-verify": ("검증하다", "ko '확인하다'가 w-check·w-confirm과 같아 듣고 뜻 고르기에서 정답이 셋이 된다 — 가름"),
 "w-check": ("점검하다", "ko '확인하다'가 w-verify·w-confirm과 같아 정답이 겹친다 — 가름"),
 "w-unit": ("혈액 유닛", "ko '혈액 제제 단위'가 w-product '제제'와 겹치고 길다 — 가름"),
 "w-product": ("혈액 제제", "ko '제제'가 w-unit·w-agent와 겹친다 — 가름"),
 "w-agent": ("약제", "ko '제제'가 w-product와 같아 정답이 둘이 된다 — 가름"),
 "w-tell": ("알려 주다", "ko '말하다'가 w-say와 같아 정답이 둘이 된다 — tell은 '알려 주다'로 가름"),
 "w-notify": ("통보하다", "ko '알리다'가 w-update와 같아 정답이 둘이 된다 — 가름"),
 "w-update": ("경과를 알리다", "ko '알리다'가 w-notify와 같아 정답이 둘이 된다 — 가름"),
 "w-document": ("문서화하다", "ko '기록하다'가 w-record·w-log와 같아 정답이 셋이 된다 — 가름"),
 "w-log": ("기입하다", "ko '기록하다'가 w-record·w-document와 같아 정답이 셋이 된다 — 가름"),
 "w-run": ("돌리다", "ko '흐르게 하다'는 'run the rapid infuser'(기계를 돌리다)를 못 담는다 — '돌리다'로"),
 "w-lab": ("검사", "ko '검사실'은 'labs'(검사 결과)·'lab tubes'(검사용 튜브) 문장과 안 맞는다 — '검사'로"),
 "w-level": ("수준", "ko '수치'가 w-count와 같아 정답이 둘이 된다 — '수준'으로 가름"),
 "w-replace": ("보충하다", "ko '대체하다'는 'replace calcium/fibrinogen'(보충)과 안 맞는다 — '보충하다'로"),
 "w-epi": ("에피(약칭)", "ko '에피네프린'이 w-epinephrine과 같아 정답이 둘이 된다 — 줄임말임을 드러내 가름"),
 "w-after": ("그 뒤에", "ko '나중에'가 w-later와 같아 정답이 둘이 된다 — 가름"),
 "w-further": ("더 이상", "ko '더'가 w-higher('더 높은')와 겹친다 — 가름"),
 "w-dark": ("짙은", "'dark urine'은 어두운 소변이 아니라 짙은 소변 — 문장과 맞게"),
 "w-wish": ("희망", "복수형 헤드워드를 단수로 바꾸며 ko를 '희망'으로"),
 "w-desaturate": ("산소포화도가 떨어지다", "헤드워드를 원형으로 바꿔 ko도 동사로"),
 "w-activate": ("발동하다", "헤드워드를 원형으로 바꿔 ko도 동사로"),
 "w-ooze": ("스며 나오다", "헤드워드를 원형으로 바꿔 ko도 동사로"),
 "w-stretch": ("늘어나다", "헤드워드를 원형으로 바꿔 ko도 동사로"),
 "w-give": ("주다", "헤드워드를 원형으로 바꿔 ko도 동사로"),
 "w-assign": ("배정하다", "헤드워드를 원형으로 바꿔 ko도 동사로"),
 "w-matter": ("중요하다", "헤드워드를 원형으로 바꿔 ko도 동사로"),
 "w-call": ("부르다", "'call out'(소리 내어 알리다)은 이 뜻이 아니라 그 두 문장에서 태그를 뺐다"),
 "w-ask": ("묻다", "'ask for a chest X-ray'(요청)는 이 뜻이 아니라 그 문장에서 태그를 뺐다"),
 "w-monitor": ("모니터", "명사로 쓴 문장 기준 — 동사로 쓴 문장은 태그를 뺐다"),
}
FIX, WHY = {}, {}
for wid, (en, ipa, why) in HEAD.items():
    FIX[wid] = dict(en=en, ipa=ipa); WHY[wid] = why
for wid, (ko, why) in KO.items():
    FIX.setdefault(wid, {})["ko"] = ko
    WHY[wid] = (WHY[wid] + " / " if wid in WHY else "") + why

DETAG_COMMON = ["w-patient", "w-name", "w-minute", "w-hour", "w-know", "w-see", "w-come"]
DETAG_JUDGE = ["w-four", "w-thousand", "w-together", "w-percent", "w-lip", "w-finger"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
assert len(DETAG_JUDGE) <= 10

# 문장 단위 태그 빼기: (상황 제목, 문장 번호) -> [id] — 그 문장에서는 헤드워드 뜻과 다르게 쓰였다
SENT_UNTAG = {
 ("수혈 반응 징후 인지", 1): ["w-back"],            # achy in your back (명사)
 ("급성 용혈반응 초기 대응", 0): ["w-back"],        # back pain (명사)
 ("대량수혈 비율 관리", 4): ["w-way"],              # on the way
 ("대량수혈 비율 관리", 5): ["w-call"],             # call out
 ("대량수혈 프로토콜 발동·조율", 6): ["w-call"],    # call out
 ("저칼슘·시트르산 독성 감시", 1): ["w-monitor"],   # I'll monitor (동사)
 ("응고검사 해석·성분 선택", 6): ["w-number"],      # numbers don't improve (수치)
 ("TACO와 TRALI 감별", 6): ["w-ask"],               # ask for a chest X-ray (요청)
 ("수혈 거부 환자 관리", 6): ["w-lab"],             # lab tubes
 ("대량수혈 프로토콜 발동·조율", 2): ["w-run"],     # (run the rapid infuser 은 유지하므로 빈 목록 아님 방지용 — 아래서 걸러짐)
}
SENT_UNTAG.pop(("대량수혈 프로토콜 발동·조율", 2))  # run the infuser 는 '돌리다'와 맞으므로 유지
SENT_UNTAG[("대량수혈 프로토콜 발동·조율", 6)] = ["w-call", "w-run"]  # running totals, call out
SENT_UNTAG[("대량수혈 프로토콜 발동·조율", 5)] = []

ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0, (set(FIX) - ids0, DETAG - ids0)

out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        un = SENT_UNTAG.get((s["title"], i), [])
        nw = [w for w in x["words"] if w not in DETAG and w not in un]
        if nw != x["words"]:
            assert nw, (s["title"], i)
            hit = [w for w in un if w in x["words"]]
            x["words"] = nw
            if hit:
                sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                     "why": f"{', '.join(hit)} 태그를 뺌 — 이 문장에서는 헤드워드 뜻과 다르게 쓰였다(문장은 그대로)"})
            else:
                sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                     "why": "너무 쉬운 말 태그를 뺌 — 문장은 그대로"})
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, s["title"]
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
assert DETAG.isdisjoint(used), DETAG & used
words = [w for w in out["words"] if w["id"] not in DETAG]
assert {w["id"] for w in words} == used, sorted({w["id"] for w in words} ^ used)
for w in words:
    for k, v in FIX.get(w["id"], {}).items():
        w[k] = v

sent_ko = {}
for s in base["situations"]:
    for x in s["sentences"]:
        sent_ko.setdefault(x["en"], x["ko"])

# ---- 단어 v45 ----
def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return abs(n(a) - n(b)) <= 3 or (n(b) <= n(a) * 1.25 and n(b) >= n(a) / 1.25)
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
kos = {}
for w in words:
    kos.setdefault(w["ko"], []).append(w["id"])
for k, v in kos.items():
    if len(v) > 1: lint.append(f"ko dup {k}: {v}")
enset = {w["en"].lower(): w["ko"] for w in words}
for w in words:
    e = data.get(w["id"])
    if not e: continue
    ex = w["example"]; assert ex in sent_ko, ex
    w["exKo"] = sent_ko[ex]
    w["cue"] = e["cue"]; w["tag"] = e["tag"]
    w["distractorsEn"] = list(e["dEn"]); w["distractorsKo"] = list(e["dKo"])
    w["chips"] = [list(c) for c in e["chips"]]; w["decoyChips"] = list(e["decoy"])
    joined = " ".join("".join(c) for c in w["chips"])
    if joined != w["en"]: lint.append(f"{w['id']}: chips {joined!r} != {w['en']!r}")
    if sum(len(c) for c in w["chips"]) > 6: lint.append(f"{w['id']}: >6 chips")
    for o in w["distractorsEn"]:
        if not okLen(w["en"], o): lint.append(f"{w['id']}: dEn {o!r} len vs {w['en']!r}")
        if o.lower() in enset and enset[o.lower()] == w["ko"]: lint.append(f"{w['id']}: dEn {o!r} same ko")
        if o.lower() == w["en"].lower(): lint.append(f"{w['id']}: dEn = answer")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} len vs {w['ko']!r}")
        if o == w["ko"]: lint.append(f"{w['id']}: dKo = answer")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    stem = re.sub(r"(ing|ed|es|s|e|ion|ation)$", "", w["en"].lower())
    if len(stem) >= 4 and stem in w["cue"].lower(): lint.append(f"{w['id']}: cue has stem {stem!r}")
    frs = {f.lower() for c in w["chips"] for f in c}
    frags = [f for c in w["chips"] for f in c]
    for d in w["decoyChips"]:
        if d.lower() in frs: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
        for k, f in enumerate(frags):
            if "".join(frags[:k] + [d] + frags[k + 1:]).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
    if not w["decoyChips"]: lint.append(f"{w['id']}: no decoy")
if missing: print("단어 데이터 빠짐:", len(missing), missing[:10], "...")
for l in lint: print("LINT", l)
out["words"] = words

# ---- 뉘앙스 ----
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
                whos = [sc["who"] for sc in it["scenes"]]
                if len(set(whos)) < 3: print("who dup?", s["title"], whos)
            if it["kind"] == "slider":
                sc = it["scale"]
                if it["answerAt"] == 1 and len(sc) == 3: pass
if "--words-only" not in sys.argv and set(nu) != set(titles):
    print("뉘앙스 빠진 상황:", [t for t in titles if t not in nu])
with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
changes = []
for wid, fx in FIX.items():
    changes.append({"kind": "word", "id": wid, "fields": list(fx), "why": WHY[wid]})
for wid in sorted(DETAG):
    changes.append({"kind": "word-remove", "id": wid,
                    "why": "너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다" if wid in DETAG_COMMON else "너무 쉬운 말이라 가르칠 값이 낮다 — 어느 문장도 태그하지 않게 됐다"})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "data", len(data), "changes", len(changes), "nuance sits", len(nu))
