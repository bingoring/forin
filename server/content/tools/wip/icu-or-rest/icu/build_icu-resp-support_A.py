#!/usr/bin/env python3
"""icu-resp-support A(단어·뉘앙스) 빌더 — base에 v45 단어 필드·nuance·결정 11 정리를 얹는다."""
import glob, os, re, sys, yaml

D = os.path.dirname(os.path.abspath(__file__))
T = "icu-resp-support"
TAGS = {"O": "산소요법", "R": "호흡사정", "D": "기기·설정", "M": "마스크·핏", "A": "ABG·검사",
        "T": "지표·추세", "S": "위험·안전", "E": "삽관·응급", "C": "환자 소통", "P": "완화·돌봄"}

# 결정 11 — 공통 쉬운 단어(목록) + 판단분(easy give try use first help soon, 활용 동의어 climb)
REMOVE = {
    "now": "공통 쉬운 단어 목록", "patient": "공통 쉬운 단어 목록", "body": "공통 쉬운 단어 목록",
    "good": "공통 쉬운 단어 목록", "head": "공통 쉬운 단어 목록", "hour": "공통 쉬운 단어 목록",
    "climb": "rise와 같은 뜻(오르는)이라 듣고 뜻 고르기에서 정답이 둘이 됨",
    "easy": "너무 쉬움", "give": "너무 쉬움", "try": "너무 쉬움", "use": "너무 쉬움",
    "first": "너무 쉬움", "help": "너무 쉬움", "soon": "너무 쉬움",
}
# 같은 ko가 겹치거나 틀린 ko, 활용형 헤드워드
FIX = {
    "setup": ({"ko": "세팅해 두다"}, "prepare와 ko가 둘 다 '준비하다'라 듣고 뜻 고르기에서 정답이 둘이 됨"),
    "clear": ({"ko": "비우다"}, "remove와 ko가 둘 다 '제거하다'라 정답이 둘이 됨"),
    "relief": ({"ko": "안도감"}, "comfort와 ko가 둘 다 '편안함'이라 정답이 둘이 됨"),
    "control": ({"ko": "관리"}, "secure와 ko가 겹침('확보')"),
    "suction": ({"ko": "석션하다"}, "aspiration과 ko가 둘 다 '흡인'이라 정답이 둘이 됨"),
    "rise": ({"en": "rise", "ipa": "/raɪz/", "ko": "상승하다"}, "활용형 헤드워드(rising)를 원형으로, climb 정리와 함께 ko를 가름"),
    "fall": ({"en": "fall", "ipa": "/fɔːl/", "ko": "하락하다"}, "활용형 헤드워드(falling)를 원형으로, drop과 ko가 둘 다 '떨어지는'이라 가름"),
    "bleed": ({"en": "bleed", "ipa": "/bliːd/", "ko": "출혈하다"}, "활용형 헤드워드(bleeding)를 원형으로"),
}

base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))
info = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.txt")):
    for ln in open(f, encoding="utf-8"):
        if not ln.strip():
            continue
        p = ln.rstrip("\n").split("|")
        assert len(p) == 7, ln
        wid, cue, tag, den, dko, chips, dec = p
        assert wid not in info, wid
        info[wid] = dict(cue=cue, tag=TAGS[tag], den=den.split(";"), dko=dko.split(";"), chips=chips, dec=dec.split(";"))


def parse_chips(s):
    return [w.split(".") for w in s.split(" ")]


def join_chips(c):
    return " ".join("".join(w) for w in c)


errs = []
sent_ko = {}
for sit in base["situations"]:
    for x in sit["sentences"]:
        sent_ko[x["en"]] = x["ko"]


def nospace(s):
    return len(s.replace(" ", ""))


def lenok(a, b):
    la, lb = nospace(a), nospace(b)
    return max(la, lb) <= 1.25 * min(la, lb) or abs(la - lb) <= 3


def altsplit(en, chips, dec):
    """정답 낱말을 decoy 조각을 하나 이상 써서 만들 수 있는가."""
    frags = {f.lower() for w in chips for f in w} | {d.lower() for d in dec}
    decl = {d.lower() for d in dec}
    for word in en.split(" "):
        wl = word.lower()
        def dfs(i, used):
            if i == len(wl):
                return used
            for f in frags:
                if f and wl.startswith(f, i):
                    if dfs(i + len(f), used or f in decl):
                        return True
            return False
        if dfs(0, False):
            return word
    return None


words = []
removed_ids = set()
for w in base["words"]:
    wid = w["id"][2:]
    if wid in REMOVE:
        removed_ids.add(w["id"])
        continue
    w = dict(w)
    if wid in FIX:
        w.update(FIX[wid][0])
    i = info.pop(wid, None)
    if i is None:
        errs.append(f"missing data: {wid}")
        continue
    ex = sent_ko.get(w["example"])
    if ex is None:
        errs.append(f"example is not a sentence: {wid}")
        ex = ""
    chips = parse_chips(i["chips"])
    if join_chips(chips) != w["en"]:
        errs.append(f"chips {join_chips(chips)!r} != {w['en']!r}")
    for k, lst in (("en", i["den"]), ("ko", i["dko"])):
        ans = w["en"] if k == "en" else w["ko"]
        for o in lst:
            if not lenok(o, ans):
                errs.append(f"len {wid} {k}: {o!r} vs {ans!r}")
    bad = altsplit(w["en"], chips, i["dec"])
    if bad:
        errs.append(f"altsplit {wid}: {bad}")
    if re.search("[A-Za-z]", i["cue"]) and w["en"].lower() in i["cue"].lower():
        errs.append(f"cue has answer {wid}")
    w.update(exKo=ex, cue=i["cue"], tag=i["tag"], distractorsEn=i["den"], distractorsKo=i["dko"],
             chips=chips, decoyChips=i["dec"])
    words.append(w)
if info:
    errs.append(f"unknown ids: {sorted(info)}")

# 문장 태그 정리
changes = []
nuance = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for k, v in yaml.safe_load(open(f, encoding="utf-8")).items():
        assert k not in nuance, k
        nuance[k] = v

sits = []
for sit in base["situations"]:
    s2 = dict(sit)
    sents = []
    for idx, x in enumerate(sit["sentences"]):
        x = dict(x)
        nw = [t for t in x["words"] if t not in removed_ids]
        if nw != x["words"]:
            gone = [t[2:] for t in x["words"] if t in removed_ids]
            changes.append({"kind": "sentence", "situation": sit["title"], "index": idx, "fields": ["words"],
                            "why": "쉬운 단어 태그 빼기: " + ", ".join(gone)})
            x["words"] = nw
        sents.append(x)
    s2["sentences"] = sents
    nz = nuance.pop(sit["title"], None)
    if nz is None:
        errs.append(f"no nuance: {sit['title']}")
    else:
        s2["nuance"] = nz
    distinct = {t for x in sents for t in x["words"]}
    if len(distinct) < 8:
        errs.append(f"V3 {sit['title']}: {len(distinct)} words")
    sits.append(s2)
if nuance:
    errs.append(f"unknown nuance titles: {sorted(nuance)}")

ch = []
for wid, why in REMOVE.items():
    ch.append({"kind": "word-remove", "id": f"w-{wid}", "why": why + " — 어느 문장도 태그하지 않게 됨"})
for wid, (flds, why) in FIX.items():
    ch.append({"kind": "word", "id": f"w-{wid}", "fields": list(flds), "why": why})
ch += changes

if errs:
    print("\n".join(errs))
    sys.exit(1)

out = {"theme": base["theme"], "words": words, "situations": sits}
with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as fh:
    yaml.safe_dump(out, fh, allow_unicode=True, sort_keys=False, width=1000)
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as fh:
    yaml.safe_dump({"theme": base["theme"], "changes": ch}, fh, allow_unicode=True, sort_keys=False, width=1000)
print("ok", len(words), "words;", len(changes), "sentence changes")
