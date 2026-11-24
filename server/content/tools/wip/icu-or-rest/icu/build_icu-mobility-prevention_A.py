#!/usr/bin/env python3
"""icu-mobility-prevention A — 결정 11 정리 + 단어 v45 + 뉘앙스를 base에 얹어 .A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy, re
T = "icu-mobility-prevention"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

INFL = {  # id -> (원형 en, ipa, 이유)
 "w-explain": ("explain", "/ɪkˈspleɪn/", "활용형(explained)"), "w-follow": ("follow", "/ˈfɑːloʊ/", "활용형(following)"),
 "w-command": ("command", "/kəˈmænd/", "복수형(commands)"), "w-sit": ("sit", "/sɪt/", "활용형(sitting)"),
 "w-tell": ("tell", "/tɛl/", "활용형(told)"), "w-drop": ("drop", "/drɑːp/", "활용형(drops)"),
 "w-change": ("change", "/tʃeɪndʒ/", "복수형(changes)"), "w-check": ("check", "/tʃɛk/", "활용형(checking)"),
 "w-elbow": ("elbow", "/ˈɛlboʊ/", "복수형(elbows)"), "w-contracture": ("contracture", "/kənˈtræktʃər/", "복수형(contractures)"),
 "w-muscle": ("muscle", "/ˈmʌsəl/", "복수형(muscles)"), "w-wheel": ("wheel", "/wiːl/", "복수형(wheels)"),
 "w-improve": ("improve", "/ɪmˈpruːv/", "활용형(improves)"), "w-goal": ("goal", "/ɡoʊl/", "복수형(goals)"),
 "w-session": ("session", "/ˈsɛʃən/", "복수형(sessions)"), "w-participate": ("participate", "/pɑːrˈtɪsɪpeɪt/", "활용형(participating)"),
 "w-feel": ("feel", "/fiːl/", "활용형(feeling)"), "w-calorie": ("calorie", "/ˈkæləri/", "복수형(calories)"),
 "w-target": ("target", "/ˈtɑːrɡɪt/", "복수형(targets)"), "w-escalate": ("escalate", "/ˈɛskəleɪt/", "활용형(escalating)"),
 "w-culture": ("culture", "/ˈkʌltʃər/", "복수형(cultures)"), "w-pull": ("pull", "/pʊl/", "활용형(pulled)"),
 "w-hold": ("hold", "/hoʊld/", "활용형(holding)"), "w-vent": ("vent", "/vɛnt/", "활용형(vented)"), "w-dislodge": ("dislodge", "/dɪsˈlɑːdʒ/", "활용형(dislodged)"),
 "w-spread": ("spread", "/sprɛd/", "활용형(spreading)"),
}
KO = {
 "w-tell": ("말하다", "원형에 맞춰 과거형 ko를 원형으로"), "w-explain": ("설명하다", "원형에 맞춰 ko를 원형으로"),
 "w-follow": ("따르다", "원형에 맞춰 ko를 원형으로"), "w-sit": ("앉다", "원형에 맞춰 ko를 원형으로"),
 "w-pull": ("당겨져 빠지다", "ko '빠졌다'가 w-dislodge와 같아 정답이 둘 — pull은 '당겨져 빠지다'로 가름"),
 "w-dislodge": ("이탈하다", "ko '빠졌다'가 w-pull과 같아 정답이 둘 — dislodge는 '이탈하다'로 가름"),
 "w-check": ("점검하다", "ko '확인 중'이 w-confirm(확인하다)·w-recheck와 겹쳐 정답이 갈린다 — '점검하다'로 가름"),
 "w-hold": ("누르다", "원형에 맞춰 ko를 원형으로(hold pressure)"), "w-feel": ("느끼다", "원형에 맞춰 ko를 원형으로"),
 "w-escalate": ("상급에 보고하다", "원형에 맞춰 ko를 원형으로"), "w-spread": ("퍼지다", "원형에 맞춰 ko를 원형으로"),
 "w-participate": ("참여하다", "원형에 맞춰 ko를 원형으로"),
 "w-change": ("변화/교체", "'skin changes'(변화)와 'each change'(드레싱 교체) 두 뜻이 문장에 쓰여 둘 다 담음"),
 "w-step": ("과정 단계", "ko '단계'가 w-stage와 같아 정답이 둘 — step은 '과정 단계'로 가름"),
 "w-prophylaxis": ("예방 요법", "ko '예방(법)'이 w-prevention(예방(책))·w-prevent와 거의 같아 정답이 겹침 — '예방 요법'으로 가름"),
 "w-heal": ("아물다", "ko '낫다'가 w-recover(회복하다)와 겹침 — 상처가 '아물다'로 가름"),
 "w-tolerance": ("견디는 정도", "ko '내성'은 약물 내성으로 읽혀 활동 견딤을 못 담는다 — '견디는 정도'로"),
 "w-log": ("적어 두다", "ko '기록하다'가 w-document와 같아 정답이 둘 — log는 '적어 두다'로 가름"),
 "w-vent": ("인공호흡기", "문장 3개 중 2개가 명사 'the vent'(기계)라 헤드워드를 명사로 — vented(단)는 이 뜻의 활용"),
}
FIX, WHY = {}, {}
for wid,(en,ipa,why) in INFL.items():
    FIX[wid] = dict(en=en, ipa=ipa); WHY[wid] = why + "를 원형으로"
FIX_EX = {"w-vent": "We'll need enough hands to manage the vent and every line."}
for wid,(ko,why) in KO.items():
    FIX.setdefault(wid, {})["ko"] = ko
    WHY[wid] = (WHY[wid] + " / " if wid in WHY else "") + why

DETAG_COMMON = ["w-today","w-see","w-know","w-hour","w-family","w-hand","w-head","w-day"]
DETAG_JUDGE = ["w-bed","w-big","w-first","w-take","w-person"]
DETAG = set(DETAG_COMMON + DETAG_JUDGE)
SENT_UNTAG = {
 ("낙상 위험 관리", 4): ["w-on"],
 ("조기 이동 중 급성 악화", 3): ["w-set"],
 ("이동 중 라인·튜브 이탈 위기", 3): ["w-secure"],
 ("이동 중 라인·튜브 이탈 위기", 5): ["w-secure"],
}
SENT_UNTAG_WHY = {
 ("낙상 위험 관리", 4): "w-on 태그를 뺌 — 여기서 on은 '(벨트를) 채운'이라 헤드워드 ko(작동 중인)와 안 맞는다, 문장은 그대로",
 ("이동 중 라인·튜브 이탈 위기", 3): "w-secure 태그를 뺌 — 여기서는 're-secure'(고정하다, 동사)라 헤드워드 ko(고정된)와 안 맞는다, 문장은 그대로",
 ("이동 중 라인·튜브 이탈 위기", 5): "w-secure 태그를 뺌 — 여기서는 're-secure'(고정하다, 동사)라 헤드워드 ko(고정된)와 안 맞는다, 문장은 그대로",
 ("조기 이동 중 급성 악화", 3): "w-set 태그를 뺌 — 여기서 set은 '한 벌(full set of vitals)'이라 헤드워드 ko(정하다)와 안 맞는다, 문장은 그대로",
}
NEWW = [
 {"id":"w-sign","en":"sign","ipa":"/saɪn/","ko":"징후","icon":"magnify","example":"I'm checking her head for any sign of injury before we move her."},
 {"id":"w-stay","en":"stay","ipa":"/steɪ/","ko":"곁에 머물다","icon":"me","example":"I called for help right away and stayed with her."},
]
SENT_ADD = {("이동 중 낙상·손상 위기", 4): ["w-sign"], ("이동 중 낙상·손상 위기", 5): ["w-stay"]}
SENT_ADD_WHY = {
 ("이동 중 낙상·손상 위기", 4): "head 태그를 빼고(쉬운 말) 이 문장에 이미 있는 sign(징후)을 새 단어로 태그",
 ("이동 중 낙상·손상 위기", 5): "이 문장에 이미 있는 stayed(stay)를 새 단어로 태그 — V3 상황당 8단어 유지",
}

ids0 = {w["id"] for w in base["words"]}
assert set(FIX) <= ids0 and DETAG <= ids0, (set(FIX)-ids0, DETAG-ids0)
out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        key = (s["title"], i)
        nw = [w for w in x["words"] if w not in DETAG and w not in SENT_UNTAG.get(key, [])]
        nw += SENT_ADD.get(key, [])
        if nw != x["words"]:
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
               "why": SENT_UNTAG_WHY.get(key) or SENT_ADD_WHY.get(key) or "너무 쉬운 말 태그를 뺌 — 문장은 그대로"})
    assert len({w for x in s["sentences"] for w in x["words"]}) >= 8, (s["title"], len({w for x in s["sentences"] for w in x["words"]}))
used = {w for s in out["situations"] for x in s["sentences"] for w in x["words"]}
assert DETAG.isdisjoint(used)
words = [w for w in out["words"] if w["id"] not in DETAG] + NEWW
assert {w["id"] for w in words} == used, sorted({w["id"] for w in words} ^ used)
for w in words:
    for k, v in FIX.get(w["id"], {}).items(): w[k] = v
    if w["id"] in FIX_EX: w["example"] = FIX_EX[w["id"]]

sent_by_en = {}
for s in base["situations"]:
    for x in s["sentences"]: sent_by_en.setdefault(x["en"], x["ko"])

def n(s): return len(re.sub(r"\s", "", s))
def okLen(a, b): return (n(b) <= max(n(a)*1.25, n(a)+3) and n(b) >= min(n(a)/1.25, n(a)-3)) or abs(n(a)-n(b)) <= 3
data = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        wid = "w-" + e["w"]; assert wid not in data, ("dup", wid); data[wid] = e
ids = {w["id"] for w in words}
assert set(data) <= ids, sorted(set(data)-ids)
missing = sorted(ids - set(data)); lint = []
for w in words:
    e = data.get(w["id"])
    if not e: continue
    ex = w["example"]; assert ex in sent_by_en, ex
    w["exKo"] = sent_by_en[ex]; w["cue"] = e["cue"]; w["tag"] = e["tag"]
    w["distractorsEn"] = list(e["dEn"]); w["distractorsKo"] = list(e["dKo"])
    w["chips"] = [list(c) for c in e["chips"]]; w["decoyChips"] = list(e["decoy"])
    joined = " ".join("".join(c) for c in w["chips"])
    if joined != w["en"]: lint.append(f"{w['id']}: chips {joined!r} != {w['en']!r}")
    for o in w["distractorsEn"]:
        if not okLen(w["en"], o): lint.append(f"{w['id']}: dEn {o!r} length vs {w['en']!r}")
        if o.lower() == w["en"].lower(): lint.append(f"{w['id']}: dEn same")
    for o in w["distractorsKo"]:
        if not okLen(w["ko"], o): lint.append(f"{w['id']}: dKo {o!r} length vs {w['ko']!r}")
    if len(w["distractorsEn"]) != 2 or len(w["distractorsKo"]) != 2: lint.append(f"{w['id']}: need 2+2")
    if w["en"].lower() in w["cue"].lower(): lint.append(f"{w['id']}: cue has answer")
    for d in w["decoyChips"]:
        if d.lower() in {f.lower() for c in w["chips"] for f in c}: lint.append(f"{w['id']}: decoy {d!r} is an answer fragment")
    frags = [f for c in w["chips"] for f in c]
    for d in w["decoyChips"]:
        for k in range(len(frags)):
            alt = frags[:k] + [d] + frags[k+1:]
            if "".join(alt).lower() == "".join(frags).lower(): lint.append(f"{w['id']}: decoy {d!r} respells")
    if len(frags) > 6: lint.append(f"{w['id']}: >6 chips")
    if len(w["chips"]) == 1 and len(w["chips"][0]) > 4: lint.append(f"{w['id']}: >4 pieces")
if missing: print("단어 데이터 빠짐:", len(missing), missing[:10])
for l in lint: print("LINT", l)
cnt = {}
for w in words: cnt.setdefault(w["ko"], []).append(w["id"])
for k, v in cnt.items():
    if len(v) > 1: print("DUP ko", k, v)
out["words"] = words

nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        assert e["situation"] not in nu, e["situation"]; nu[e["situation"]] = e["items"]
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
if set(nu) != set(titles): print("뉘앙스 빠진 상황:", [t for t in titles if t not in nu])
with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
changes = []
for wid, fx in FIX.items(): changes.append({"kind": "word", "id": wid, "fields": list(fx) + (["example"] if wid in FIX_EX else []), "why": WHY[wid] + (" / 예시 문장도 명사 용례(the vent)로" if wid in FIX_EX else "")})
for nw in NEWW: changes.append({"kind": "word-add", "id": nw["id"], "why": "쉬운 말 태그를 뺀 문장에 이미 있는 배울 만한 말 — 상황 8단어 유지"})
for wid in sorted(DETAG):
    changes.append({"kind": "word-remove", "id": wid, "why": ("너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다" if wid in DETAG_COMMON else "간호사가 이미 아는 쉬운 말이라 가르칠 값이 없다 — 어느 문장도 태그하지 않게 됐다")})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "data", len(data), "changes", len(changes), "nuance sits", len(nu))
