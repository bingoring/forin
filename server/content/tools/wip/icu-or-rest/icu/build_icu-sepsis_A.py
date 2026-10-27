#!/usr/bin/env python3
"""icu-sepsis A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-sepsis.A.yaml과 changes-icu-sepsis.yaml을 쓴다.
데이터: add_icu-sepsis_A_words_N.txt (줄마다 `id | cue | tag | dEn,dEn | dKo,dKo | chips | decoy,decoy`),
        add_icu-sepsis_A_nuance_N.yaml (상황 제목 → nuance 목록)."""
import glob, re, sys, itertools, yaml, copy

T = "icu-sepsis"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))
SIT = [s["title"] for s in base["situations"]]

# ---- 결정 11 -------------------------------------------------------------------
REMOVE_COMMON = "doctor body know hand minute hour time day see family".split()      # 공통 쉬운 단어 목록
REMOVE_JUDGE = "more new water yesterday put small wrong answer talk most".split()   # 목록 밖 판단분(10)
REMOVE = ["w-" + x for x in REMOVE_COMMON + REMOVE_JUDGE]

UNTAG = {  # (상황 번호, 문장 번호) → [(id, 이유)]
    (6, 3): [("w-call", "'is called a vasopressor'는 '불리다'라 헤드워드 call(부르다·연락하다)과 안 맞음")],
    (15, 2): [("w-line", "'next line of support'는 '라인(관)'이 아니라 '단계'")],
    (11, 3): [("w-once", "'at once'(동시에)는 헤드워드 once(~하면)와 다른 쓰임")],
    (19, 3): [("w-get", "'get him to the OR'는 '준비해 놓다'가 아님")],
    (19, 2): [("w-alert", "'alert the OR team'은 동사(알리다) — 헤드워드 alert(각성된)와 다름")],
    (5, 4): [("w-clear", "'clearly more stable'은 부사 — 헤드워드 clearer(더 맑은)와 다름")],
    (15, 3): [("w-hold", "'pressure won't hold'는 '유지되다' — 헤드워드 hold(붙들다)와 다름")],
    (16, 0): [("w-lab", "'clotting labs'는 검사 결과 — 헤드워드 lab(검사실)과 다름")],
}

INFL = {  # id → (원형, ipa, 이유)
    "w-check": ("check", "/tʃɛk/"), "w-watch": ("watch", "/wɑːtʃ/"), "w-change": ("change", "/tʃeɪndʒ/"),
    "w-tell": ("tell", "/tɛl/"), "w-handle": ("handle", "/ˈhændəl/"), "w-cause": ("cause", "/kɔːz/"),
    "w-help": ("help", "/hɛlp/"), "w-start": ("start", "/stɑːrt/"), "w-send": ("send", "/sɛnd/"),
    "w-respond": ("respond", "/rɪˈspɑːnd/"), "w-work": ("work", "/wɜːrk/"), "w-begin": ("begin", "/bɪˈɡɪn/"),
    "w-recheck": ("recheck", "/riːˈtʃɛk/"), "w-reassess": ("reassess", "/ˌriːəˈsɛs/"), "w-move": ("move", "/muːv/"),
    "w-add": ("add", "/æd/"), "w-call": ("call", "/kɔːl/"), "w-need": ("need", "/niːd/"), "w-fall": ("fall", "/fɔːl/"),
    "w-stay": ("stay", "/steɪ/"), "w-drop": ("drop", "/drɑːp/"), "w-plan": ("plan", "/plæn/"),
    "w-update": ("update", "/ˌʌpˈdeɪt/"), "w-show": ("show", "/ʃoʊ/"), "w-use": ("use", "/juːz/"),
    "w-reduce": ("reduce", "/rɪˈduːs/"), "w-lower": ("lower", "/ˈloʊər/"), "w-consider": ("consider", "/kənˈsɪdər/"),
    "w-trend": ("trend", "/trɛnd/"), "w-worsen": ("worsen", "/ˈwɜːrsən/"), "w-rise": ("rise", "/raɪz/"),
    "w-fail": ("fail", "/feɪl/"), "w-hold": ("hold", "/hoʊld/"), "w-enter": ("enter", "/ˈɛntər/"),
    "w-broaden": ("broaden", "/ˈbrɔːdən/"), "w-look": ("look", "/lʊk/"), "w-maintain": ("maintain", "/meɪnˈteɪn/"),
    "w-progress": ("progress", "/prəˈɡrɛs/"), "w-climb": ("climb", "/klaɪm/"), "w-double": ("double", "/ˈdʌbəl/"),
    "w-spread": ("spread", "/sprɛd/"), "w-die": ("die", "/daɪ/"), "w-arrive": ("arrive", "/əˈraɪv/"),
    "w-struggle": ("struggle", "/ˈstrʌɡəl/"), "w-matter": ("matter", "/ˈmætər/"),
    "w-sign": ("sign", "/saɪn/"), "w-surgery": ("surgery", "/ˈsɜːrdʒəri/"), "w-catheter": ("catheter", "/ˈkæθətər/"),
    "w-wound": ("wound", "/wuːnd/"), "w-line": ("line", "/laɪn/"), "w-foot": ("foot", "/fʊt/"), "w-leg": ("leg", "/lɛɡ/"),
    "w-unit": ("unit", "/ˈjuːnɪt/"), "w-site": ("site", "/saɪt/"), "w-result": ("result", "/rɪˈzʌlt/"),
    "w-germ": ("germ", "/dʒɜːrm/"), "w-glove": ("glove", "/ɡlʌv/"), "w-option": ("option", "/ˈɑːpʃən/"),
    "w-conversation": ("conversation", "/ˌkɑːnvərˈseɪʃən/"), "w-precaution": ("precaution", "/prɪˈkɔːʃən/"),
}
PLURALS = {"w-sign", "w-surgery", "w-catheter", "w-wound", "w-line", "w-foot", "w-leg", "w-unit", "w-site", "w-result",
           "w-germ", "w-glove", "w-option", "w-conversation", "w-precaution"}

KO = {  # id → (새 ko, 이유)
    "w-check": ("점검하다", "ko '확인하다'가 w-confirm과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — check는 '점검하다'로 가름"),
    "w-change": ("달라지다", "ko '변화하다'가 w-turn '변하다'와 거의 같아 정답이 겹친다 — '달라지다'로 가름"),
    "w-call": ("부르다·연락하다", "활용형(called, 불리다)을 원형으로 — 남은 문장 전부가 '불러 연락하다'(call the intensivist)라 ko를 맞춤"),
    "w-pressure": ("혈압(줄임말)", "모든 문장에서 'his pressure'는 혈압이다 — ko '압력'은 틀림"),
    "w-pressor": ("승압제(줄임말)", "ko '승압제'가 w-vasopressor와 같아 정답이 둘이 된다 — pressor는 vasopressor의 줄임말로 가름"),
    "w-germ": ("병균", "ko '세균'이 w-bacteria와 같아 정답이 둘이 된다 — 가름"),
    "w-bug": ("균(구어)", "ko '균(세균)'이 w-bacteria·w-germ과 겹친다 — 구어 표현임을 드러내 가름"),
    "w-chart": ("차트에 기록하다", "ko '기록하다'가 w-document와 같아 정답이 둘이 된다 — chart는 '차트에 기록하다'로 가름"),
    "w-document": ("문서화하다", "ko '기록하다'가 w-chart와 같아 정답이 둘이 된다 — 가름"),
    "w-number": ("숫자", "ko '수치'가 w-level과 같아 정답이 둘이 된다 — number는 '숫자'로 가름"),
    "w-update": ("최신 상황을 알리다", "ko '알려주다'가 w-tell과 같아 정답이 둘이 된다 — 가름"),
    "w-drug": ("약", "ko '약물'이 w-medication과 같아 정답이 둘이 된다 — drug는 '약'으로 가름"),
    "w-get": ("준비해 놓다", "ko '준비하다'가 w-prepare와 같아 정답이 둘이 된다 — 'get X ready'의 뜻으로 가름"),
    "w-steady": ("꾸준한", "ko '안정된'이 w-stable '안정적인'과 같아 정답이 겹친다 — 가름"),
    "w-precisely": ("정밀하게", "ko '정확하게'가 w-exact '정확한'과 거의 같아 정답이 겹친다 — 가름"),
    "w-begin": ("비롯되다", "ko '시작되다'가 w-start '시작하다'와 거의 같아 정답이 겹친다 — 가름"),
    "w-fall": ("내려가다", "ko '떨어지는'이 w-drop '떨어졌다'와 같아 정답이 둘이 된다 — fall은 수치가 '내려가다'로 가름"),
    "w-therapy": ("요법", "ko '치료(요법)'가 w-treatment '치료'와 겹친다 — '요법'으로 가름"),
    "w-once": ("~하고 나면", "남은 두 문장이 접속사 once(~하고 나면)라 ko를 맞춤 — 'at once'(동시에) 문장은 태그를 뺌"),
    "w-quickly": ("재빨리", "ko '빠르게'가 w-fast와 같아 정답이 둘이 된다 — quickly는 '재빨리'로 가름"),
    "w-fast": ("빠르게", "문장 대부분이 부사 용법(spreading fast, dropping fast)이라 ko를 부사형으로 맞춤"),
    "w-cause": ("일으키다", "활용형(causing)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-worsen": ("악화되다", "활용형(worsening)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-rise": ("상승하다", "활용형(rising)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-fail": ("기능이 멈추다", "활용형(failing)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-hold": ("붙들다", "활용형(holding)을 원형으로 바꾸며 ko도 원형 뜻으로 — 'pressure won't hold' 문장은 태그를 뺌"),
    "w-move": ("나아가다", "활용형(moving)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-progress": ("진행되다", "활용형(progressing)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-climb": ("오르다", "활용형(climbing)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-spread": ("퍼지다", "활용형(spreading)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-die": ("죽어가다", "활용형(dying)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-drop": ("떨어지다", "활용형(dropped)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-stable": ("안정적인", "(변경 없음)"),
}
KO.pop("w-stable")

def load_words_data():
    rows = {}
    for fn in sorted(glob.glob(f"{D}/add_{T}_A_words_*.txt")):
        for ln, line in enumerate(open(fn, encoding="utf-8"), 1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            p = [x.strip() for x in line.split(" | ")]
            if len(p) != 7:
                sys.exit(f"{fn}:{ln}: 7칸이 아님 ({len(p)}): {line[:60]}")
            wid = "w-" + p[0]
            if wid in rows:
                sys.exit(f"{fn}:{ln}: 중복 {wid}")
            rows[wid] = dict(cue=p[1], tag=p[2], dEn=[x.strip() for x in p[3].split(",")],
                             dKo=[x.strip() for x in p[4].split(",")], chips=p[5],
                             decoy=[x.strip() for x in p[6].split(",")])
    return rows

def parse_chips(s):
    return [w.split("/") for w in s.split(" ")]

def ln(s):
    return len(re.sub(r"\s", "", s))

def len_ok(a, b):
    return not (max(ln(a), ln(b)) / max(1, min(ln(a), ln(b))) > 1.25 and abs(ln(a) - ln(b)) > 3)

def alt_spelling(chips, decoys, en):
    """정답 조각 + 오답 조각으로 en을 다른 경로로 다시 만들 수 있나(오답 조각을 하나 이상 써서)."""
    frags = [f for w in chips for f in w]
    pool = frags + decoys
    target = en.replace(" ", "")
    target_l = target.lower()
    found = []
    def rec(rest, used, usedd):
        if not rest:
            if usedd:
                found.append(tuple(used))
            return
        for i, f in enumerate(pool):
            if i in used:
                continue
            fl = f.lower()
            if rest.startswith(fl):
                rec(rest[len(fl):], used + [i], usedd or i >= len(frags))
    rec(target_l, [], False)
    return found

def main():
    rows = load_words_data()
    data_mode = bool(rows)
    doc = copy.deepcopy(base)
    changes = []
    sents = {}
    for si, s in enumerate(doc["situations"]):
        for i, x in enumerate(s["sentences"]):
            sents[(si, i)] = x
    # 문장 태그 빼기
    removed_tags = {}
    for (si, i), lst in UNTAG.items():
        x = sents[(si, i)]
        for wid, why in lst:
            assert wid in x["words"], (si, i, wid)
            x["words"].remove(wid)
            removed_tags.setdefault((si, i), []).append(wid)
    for si, s in enumerate(doc["situations"]):
        for i, x in enumerate(s["sentences"]):
            before = x["words"]
            x["words"] = [w for w in before if w not in REMOVE]
            gone = [w for w in before if w in REMOVE]
            if gone or (si, i) in removed_tags:
                allgone = gone + removed_tags.get((si, i), [])
                why = []
                for w in gone:
                    why.append(f"쉬운 {w} 태그 뺌")
                for w in removed_tags.get((si, i), []):
                    why.append(dict((a, b) for a, b in UNTAG[(si, i)])[w])
                changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                "why": "; ".join(why)})
    # 단어
    words = []
    sent_by_en = {x["en"]: (si, i) for (si, i), x in sents.items()}
    tagged = {}
    for (si, i), x in sents.items():
        for w in x["words"]:
            tagged.setdefault(w, []).append((si, i))
    for w in doc["words"]:
        wid = w["id"]
        if wid in REMOVE:
            assert wid not in tagged, wid
            changes.append({"kind": "word-remove", "id": wid, "why": "너무 쉬움 — 어느 문장도 태그하지 않게 됐다"})
            continue
        assert wid in tagged, f"{wid} 태그 없음"
        fields = []
        if wid in INFL:
            en, ipa = INFL[wid]
            if w["en"] != en:
                w["en"] = en; w["ipa"] = ipa; fields += ["en", "ipa"]
                kind = "복수형" if wid in PLURALS else "활용형"
                w["_infl"] = f"{kind}을 원형으로"
        if wid in KO:
            w["ko"] = KO[wid][0]; fields.append("ko")
        ex = w["example"]
        if sent_by_en[ex] not in tagged[wid]:
            si, i = tagged[wid][0]
            w["example"] = sents[(si, i)]["en"]; fields.append("example")
        if fields:
            whys = []
            if "en" in fields: whys.append(w.pop("_infl"))
            if "ko" in fields: whys.append(KO[wid][1])
            if "example" in fields: whys.append("예문 문장에서 태그를 뺐으므로 이 말이 쓰인 문장으로 바꿈")
            changes.append({"kind": "word", "id": wid, "fields": fields, "why": "; ".join(whys)})
        words.append(w)
    doc["words"] = words
    # ko 중복 점검
    kos = {}
    for w in words:
        kos.setdefault(w["ko"], []).append(w["id"])
    for k, v in kos.items():
        if len(v) > 1:
            print("[ko 중복]", k, v)
    # v45 필드
    if data_mode:
        ex_ko = {x["en"]: x["ko"] for x in sents.values()}
        ids = {w["id"] for w in words}
        miss = ids - set(rows); extra = set(rows) - ids
        if miss:
            print(f"[단어 데이터 없음 {len(miss)}]", sorted(miss)[:300] if len(miss) < 400 else "전부")
        if extra:
            print("[남는 데이터]", sorted(extra))
        errs = 0
        for w in words:
            r = rows.get(w["id"])
            if not r:
                continue
            en = w["en"]
            chips = parse_chips(r["chips"])
            joined = " ".join("".join(wd) for wd in chips)
            if joined != en:
                print(f"[chips] {w['id']}: {joined!r} != {en!r}"); errs += 1
            for k in ("dEn", "dKo"):
                ans = en if k == "dEn" else w["ko"]
                if len(r[k]) != 2:
                    print(f"[{k} 개수] {w['id']}"); errs += 1
                for o in r[k]:
                    if not len_ok(ans, o):
                        print(f"[길이] {w['id']} {k}: {ans} / {o}"); errs += 1
                    if o.lower() == ans.lower():
                        print(f"[오답=정답] {w['id']} {k}"); errs += 1
            for d in r["decoy"]:
                if d in [f for wd in chips for f in wd]:
                    print(f"[decoy=정답조각] {w['id']} {d}"); errs += 1
            alt = alt_spelling(chips, r["decoy"], en)
            if alt:
                print(f"[decoy 다른 경로] {w['id']} {en} {r['decoy']}"); errs += 1
            if re.search(re.escape(en.lower()), r["cue"].lower()):
                print(f"[cue에 정답] {w['id']}"); errs += 1
            w["exKo"] = ex_ko[w["example"]]
            w["cue"] = r["cue"]
            w["tag"] = r["tag"]
            w["distractorsEn"] = r["dEn"]
            w["distractorsKo"] = r["dKo"]
            w["chips"] = chips
            w["decoyChips"] = r["decoy"]
        nu = {}
        for fn in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
            nu.update(yaml.safe_load(open(fn, encoding="utf-8")) or {})
        for si, s in enumerate(doc["situations"]):
            lst = nu.get(s["title"])
            if lst is None:
                print("[뉘앙스 없음]", s["title"]); continue
            used = {w for x in s["sentences"] for w in x["words"]}
            for j, n in enumerate(lst):
                for wid in n.get("words", []):
                    if wid not in used:
                        print(f"[V15] {s['title']} nuance[{j}] {wid}"); errs += 1
                if n["kind"] == "slider":
                    sc = n["scale"]
                    ls = [ln(x) for x in sc]
                    if max(ls) / min(ls) > 1.4 and max(ls) - min(ls) > 4:
                        print(f"[slider 길이] {s['title']} {sc}")
            s["nuance"] = lst
        print("오류", errs)
    # 파일
    for w in doc["words"]:
        w.pop("_infl", None)
    out = {"theme": T, "words": doc["words"], "situations": doc["situations"]}
    with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as f:
        yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
    with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
        yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
    print(f"단어 {len(doc['words'])} 변경 {len(changes)}")

main()
