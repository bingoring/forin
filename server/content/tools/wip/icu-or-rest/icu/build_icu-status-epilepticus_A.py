#!/usr/bin/env python3
"""icu-status-epilepticus A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 .A.yaml과 changes를 쓴다."""
import glob, copy, re, sys, yaml
T = "icu-status-epilepticus"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))
ids0 = {w["id"] for w in base["words"]}

# ---- 결정 11 ---------------------------------------------------------------
COMMON = ["w-time","w-know","w-body","w-head","w-now","w-minute","w-family","w-come"]
JUDGE = ["w-mouth","w-teeth","w-tongue","w-need","w-long","w-pain","w-fine","w-again","w-something","w-percent"]
assert len(JUDGE) <= 10
REMOVE = {w: "공통 쉬운 단어 — 어느 문장도 태그하지 않게 됐다" for w in COMMON}
REMOVE.update({w: "너무 쉬운 말(간호사가 이미 안다) — 태그를 빼고 은행에서 지움" for w in JUDGE})
REMOVE["w-come"] = "구 'come back'으로 합쳐 w-back에 담았다 — 어느 문장도 태그하지 않게 됐다"
REMOVE["w-long"] = "너무 쉬움 + 'no longer'와 'how long'에 걸쳐 ko '긴'과 안 맞음 — 태그를 빼고 지움"

FIX = {  # id -> ({필드: 값}, 이유)
 "w-back": ({"en":"come back","ipa":"/kʌm ˈbæk/","ko":"(결과가) 나오다"}, "'came back'(결과가 나오다)이 두 문장에서 구로 쓰임 — come+back을 구 헤드워드로"),
 "w-effect": ({"en":"side effect","ipa":"/ˈsaɪd ɪˌfɛkt/","ko":"부작용"}, "'side effects'(부작용)를 구 단위로 — 헤드워드 effect의 ko '효과(부작용)'는 두 뜻이 섞임"),
 "w-vital": ({"en":"vitals","ipa":"/ˈvaɪtlz/","ko":"활력징후"}, "문장은 명사 'Vitals'인데 헤드워드가 형용사 vital — 명사로 맞춤"),
 "w-call": ({"ko":"부르다"}, "ko '전화하다'가 태그된 문장 4개 중 3개(마취과를 부르다·도움 요청·코드 호출)와 안 맞음"),
 "w-check": ({"ko":"점검하다"}, "ko '확인하다'가 w-confirm과 같아 듣고 뜻 고르기에서 정답이 둘이 됨 — 가름"),
 "w-correctly": ({"ko":"올바르게"}, "ko '정확하게'가 w-exactly '정확히'와 사실상 같아 정답이 둘이 됨 — 가름"),
 "w-therapy": ({"ko":"요법"}, "ko '치료(법)'가 w-treatment '치료'와 겹침 — 가름"),
 "w-medication": ({"ko":"처방약"}, "ko '약물'이 w-drug와 같아 정답이 둘이 됨 — 가름"),
 "w-steady": ({"ko":"일정한"}, "ko '안정적인'이 w-stable '안정된'과 사실상 같아 정답이 둘이 됨 — 가름"),
 "w-stay": ({"ko":"그대로 있다"}, "ko '유지되다'가 w-hold와 같아 정답이 둘이 됨 — 가름"),
 "w-push": ({"ko":"(약을) 밀어 넣다"}, "ko '주입하다'가 w-infusion '주입'과 겹침 — 가름"),
 "w-further": ({"ko":"그 이상의"}, "ko '추가의'가 w-add '추가하다'와 겹침 — 가름"),
 "w-set-off": ({"ko":"일으키다"}, "ko '유발하다'가 w-trigger와 같아 정답이 둘이 됨 — 가름"),
 "w-mass": ({"ko":"종괴"}, "ko '종양(덩어리)'가 w-tumor '종양'과 겹침 — 가름"),
 "w-stat": ({"ko":"당장"}, "ko '긴급 검사'는 'a stat glucose'의 부사적 뜻(당장)을 못 담고 w-urgent와 겹침"),
 "w-still": ({"ko":"아직도"}, "태그된 두 문장 모두 'still seizing'(아직도 발작 중) — ko '가만히 있는'과 안 맞음"),
 "w-depression": ({"ko":"저하"}, "ko '억제'가 w-suppression과 같아 정답이 둘이 됨 — 가름"),
 "w-decline": ({"ko":"감퇴하다"}, "ko '저하되다'가 w-depression '저하'와 겹쳐 가름"),
 "w-sugar": ({"ko":"당 수치"}, "ko '혈당(당)'이 w-glucose '혈당'과 같아 정답이 둘이 됨 — 가름"),
 "w-lab": ({"ko":"랩 검사"}, "ko '검사(랩)'가 w-test '검사하다'와 겹침 — 가름"),
 "w-persistent": ({"ko":"없어지지 않는"}, "ko '지속되는'이 w-last '지속되다'·w-continuous '지속적인'과 겹침 — 가름"),
 "w-continuous": ({"ko":"끊김 없는"}, "ko '지속적인'이 w-last·w-persistent와 겹침 — 가름"),
}
SENT_UNTAG = {  # (상황 제목, index) -> ([뺄 id], 이유)
 ("지속 SE 예후·목표 소통", 3): (["w-hard"], "'hard to hear'(듣기 힘든)는 헤드워드 hard '단단한'과 안 맞음 — 태그만 뺌"),
 ("발작 후 뇌부종·ICP 위기", 0): (["w-cause"], "여기 cause는 동사(일으키다)라 헤드워드 cause '원인'(명사)과 안 맞음 — 태그만 뺌"),
 ("유발원인 검사·교정", 1): (["w-trigger"], "여기 trigger는 명사(유발 요인)라 헤드워드 trigger '유발하다'(동사)와 안 맞음 — 태그만 뺌"),
 ("항경련제 혈중농도·부작용", 4): (["w-side"], "'side effects'는 w-effect(구 'side effect')에 담음 — w-side '옆'과 안 맞아 태그만 뺌"),
}
assert set(REMOVE) <= ids0 and set(FIX) <= ids0, (set(REMOVE)-ids0, set(FIX)-ids0)

# ---- 새 값 읽기 --------------------------------------------------------------
NEW = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        wid = "w-" + e["id"]
        assert wid not in NEW, wid
        NEW[wid] = e

out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        old = list(x["words"])
        new = [w for w in old if w not in REMOVE]
        extra = SENT_UNTAG.get((s["title"], i))
        if extra:
            new = [w for w in new if w not in extra[0]]
        if new != old:
            gone = [w for w in old if w not in new]
            why = []
            rm = [w for w in gone if w in REMOVE]
            if rm: why.append("쉬운 단어 태그 뺌: " + ", ".join(rm))
            if extra: why.append(extra[1])
            sent_changes.append({"kind":"sentence","situation":s["title"],"index":i,"fields":["words"],"why":" / ".join(why)})
            x["words"] = new
used = {t for s in out["situations"] for x in s["sentences"] for t in x["words"]}
sent_ko = {}
for s in out["situations"]:
    for x in s["sentences"]:
        sent_ko[x["en"].strip()] = x["ko"]

words_out, word_changes = [], []
for w in out["words"]:
    wid = w["id"]
    if wid in REMOVE:
        word_changes.append({"kind":"word-remove","id":wid,"why":REMOVE[wid]})
        continue
    if wid in FIX:
        vals, why = FIX[wid]
        for k, v in vals.items(): w[k] = v
        word_changes.append({"kind":"word","id":wid,"fields":list(vals),"why":why})
    n = NEW.pop(wid, None)
    if n is None:
        sys.exit(f"새 값이 없는 단어: {wid} {w['en']}")
    ex = w["example"].strip()
    if ex not in sent_ko:
        sys.exit(f"예문이 문장에 없음: {wid} {ex}")
    w["cue"] = n["cue"]; w["exKo"] = sent_ko[ex]; w["tag"] = n["tag"]
    w["distractorsEn"] = n["dEn"]; w["distractorsKo"] = n["dKo"]
    w["chips"] = n["chips"]; w["decoyChips"] = n["decoy"]
    if wid not in used:
        sys.exit(f"태그된 문장이 없는 단어: {wid}")
    words_out.append(w)
if NEW: sys.exit(f"은행에 없는 새 값: {sorted(NEW)}")
out["words"] = words_out

# ---- 칩 점검: 오답 조각으로 정답을 다른 경로로 만들 수 있으면 안 된다 ---------------
def alt_paths(word_chips, decoys):
    ans = "".join(word_chips).lower()
    pool = [c.lower() for c in word_chips] + [d.lower() for d in decoys]
    orig = sorted(c.lower() for c in word_chips)
    found = []
    def rec(rest, left, used):
        if not rest:
            if sorted(used) != orig: found.append(list(used))
            return
        for i, p in enumerate(left):
            if rest.startswith(p):
                rec(rest[len(p):], left[:i]+left[i+1:], used+[p])
    rec(ans, pool, [])
    return found
for w in out["words"]:
    pool_decoys = [d for d in w["decoyChips"]]
    for wc in w["chips"]:
        a = alt_paths(wc, pool_decoys)
        if a: print("칩 경고", w["id"], wc, pool_decoys, a[:2])

# ---- 뉘앙스 ------------------------------------------------------------------
titles = {s["title"] for s in out["situations"]}
nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        assert e["situation"] in titles, e["situation"]
        assert e["situation"] not in nu, e["situation"]
        nu[e["situation"]] = e["items"]
for s in out["situations"]:
    if s["title"] in nu: s["nuance"] = nu[s["title"]]

yaml.safe_dump(out, open(f"{D}/icu-status-epilepticus.A.yaml","w",encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({"theme":T,"changes":word_changes+sent_changes}, open(f"{D}/changes-{T}.yaml","w",encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("words", len(out["words"]), "removed", sum(1 for c in word_changes if c['kind']=='word-remove'), "ko/en fixed", sum(1 for c in word_changes if c['kind']=='word'), "sentences", len(sent_changes), "nuance sits", len(nu))
