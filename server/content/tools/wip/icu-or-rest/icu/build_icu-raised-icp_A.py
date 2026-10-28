#!/usr/bin/env python3
"""icu-sepsis A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 icu-sepsis.A.yaml과 changes-icu-sepsis.yaml을 쓴다.
데이터: add_icu-sepsis_A_words_N.txt (줄마다 `id | cue | tag | dEn,dEn | dKo,dKo | chips | decoy,decoy`),
        add_icu-sepsis_A_nuance_N.yaml (상황 제목 → nuance 목록)."""
import glob, re, sys, itertools, yaml, copy

T = "icu-raised-icp"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))
SIT = [s["title"] for s in base["situations"]]

# ---- 결정 11 -------------------------------------------------------------------
REMOVE_COMMON = "hand head hour minute time now room family know see".split()
REMOVE_JUDGE = ("thank help let other big too more very each yet then again much few because without together most away soon up "
                "ear neck eye water talk").split()
REMOVE = ["w-" + x for x in REMOVE_COMMON + REMOVE_JUDGE]

UNTAG = {  # (상황 번호, 문장 번호) → [(id, 이유)]
    (6, 1): [("w-order", "'in that order'는 '순서'라 헤드워드 order(처방하다)와 다른 쓰임")],
    (2, 3): [("w-position", "'is positioned exactly right'는 동사(위치시키다) — 헤드워드 position(체위)과 다름")],
    (5, 3): [("w-right", "'right now'는 '지금 당장' 관용구 — 헤드워드 right(적절한)와 다름")],
    (14, 4): [("w-right", "'right away'는 '즉시' 관용구 — 헤드워드 right(적절한)와 다름")],
    (15, 4): [("w-right", "'right now'는 '지금 당장' 관용구 — 헤드워드 right(적절한)와 다름")],
    (11, 1): [("w-level", "'check the level'은 약물 농도 — 헤드워드 level(수평)과 다름")],
    (12, 1): [("w-level", "'This level is higher'는 수치 — 헤드워드 level(수평)과 다름")],
    (12, 2): [("w-level", "'check levels'는 수치 — 헤드워드 level(수평)과 다름")],
    (11, 0): [("w-give", "'given his brain injury'는 '~를 감안하면' — 헤드워드 give(주다)와 다름")],
    (16, 3): [("w-call", "'call it truly blocked'는 '~라고 단정하다' — 헤드워드 call(부르다·연락하다)과 다름")],
    (6, 2): [("w-move", "'move to osmotic therapy'는 '단계로 넘어가다' — 헤드워드 move(움직이다)와 다름")],
    (18, 1): [("w-point", "'points to'는 동사(가리키다) — 헤드워드 point(지점)와 다름")],
    (19, 0): [("w-point", "'points to DI'는 동사(가리키다) — 헤드워드 point(지점)와 다름")],
    (18, 2): [("w-get", "'get a stat CT'는 '찍다' — 헤드워드 get(데려오다)과 다름")],
}

INFL = {  # id → (원형, ipa)
    "w-kink": ("kink", "/kɪŋk/"), "w-block": ("block", "/blɑːk/"), "w-dampen": ("dampen", "/ˈdæmpən/"),
    "w-respiration": ("respiration", "/ˌrɛspəˈreɪʃən/"), "w-fill": ("fill", "/fɪl/"),
    "w-increase": ("increase", "/ɪnˈkriːs/"), "w-overload": ("overload", "/ˌoʊvərˈloʊd/"),
    "w-sign": ("sign", "/saɪn/"), "w-crackle": ("crackle", "/ˈkrækəl/"), "w-twitch": ("twitch", "/twɪtʃ/"),
    "w-happen": ("happen", "/ˈhæpən/"), "w-elevate": ("elevate", "/ˈɛləveɪt/"), "w-swing": ("swing", "/swɪŋ/"),
    "w-drop": ("drop", "/drɑːp/"), "w-climb": ("climb", "/klaɪm/"), "w-max": ("max", "/mæks/"),
    "w-deeper": ("deep", "/diːp/"), "w-show": ("show", "/ʃoʊ/"), "w-suggest": ("suggest", "/səˈdʒɛst/"),
    "w-wait": ("wait", "/weɪt/"), "w-fall": ("fall", "/fɔːl/"), "w-expand": ("expand", "/ɪkˈspænd/"),
    "w-reverse": ("reverse", "/rɪˈvɜːrs/"), "w-rise": ("rise", "/raɪz/"), "w-result": ("result", "/rɪˈzʌlt/"),
    "w-wish": ("wish", "/wɪʃ/"), "w-loss": ("loss", "/lɔːs/"), "w-over": ("over-drain", "/ˌoʊvərˈdreɪn/"),
}
PLURALS = {"w-sign", "w-crackle", "w-swing", "w-drop", "w-respiration", "w-result", "w-wish", "w-loss"}

KO = {  # id → (새 ko, 이유)
    "w-check": ("점검하다", "ko '확인하다'가 w-confirm과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — check는 '점검하다'로 가름"),
    "w-update": ("최신 상황을 알리다", "ko '알리다'가 w-notify와 같아 정답이 둘이 된다 — 가름"),
    "w-exam": ("진찰", "ko '사정'이 w-assess '사정하다'와 겹친다 — exam은 '진찰'로 가름"),
    "w-testing": ("검사", "(변경 없음)"),
    "w-may": ("~일지도 모른다", "ko가 w-could와 같아 정답이 둘이 된다 — may는 '~일지도 모른다'로 가름"),
    "w-could": ("~일 수도 있다", "ko가 w-may와 같아 정답이 둘이 된다 — 가름"),
    "w-order": ("처방하다", "남은 문장이 전부 '처방(된)'이라 ko를 맞춤 — 'in that order' 문장은 태그를 뺌"),
    "w-level": ("수평", "남은 문장이 전부 '수평'(drain is level, keep it leveled)이라 ko를 맞춤 — 수치·농도 뜻 문장은 태그를 뺌"),
    "w-drain": ("배액관·배액하다", "문장에서 명사(배액관)와 동사(배액하다)로 둘 다 쓰여 ko를 맞춤"),
    "w-fluid": ("수액·체액", "문장에서 체액(뇌에서 끌어내는 물)과 수액(투여하는 액)으로 둘 다 쓰여 ko를 맞춤"),
    "w-med": ("약(줄임말)", "ko '약'이 w-medicine과 같아 정답이 둘이 된다 — med는 줄임말임을 드러내 가름"),
    "w-set": ("설정하다", "ko '맞추다'가 w-match와 같아 정답이 둘이 된다 — set은 '설정하다'로 가름"),
    "w-quickly": ("재빨리", "ko '빠르게'가 w-fast와 같아 정답이 둘이 된다 — quickly는 '재빨리'로 가름"),
    "w-soft": ("나지막한", "ko '부드러운'이 w-gentle과 같아 정답이 둘이 된다 — soft(voices)는 '나지막한'으로 가름"),
    "w-continuous": ("연속적인", "ko '지속적인'이 w-ongoing과 같아 정답이 둘이 된다 — 가름"),
    "w-ongoing": ("계속되는", "ko '지속적인'이 w-continuous와 같아 정답이 둘이 된다 — 가름"),
    "w-enough": ("넉넉한", "ko '충분한'이 w-adequate와 같아 정답이 둘이 된다 — enough는 '넉넉한'으로 가름"),
    "w-stat": ("긴급히", "ko '즉시'가 w-immediately와 같아 정답이 둘이 된다 — stat은 '긴급히'로 가름"),
    "w-wake": ("깨우기", "ko '각성'이 w-alert '각성한'과 겹친다 — wake-up은 '깨우기'로 가름"),
    "w-dry": ("수분이 부족한", "'too dry'는 혈관 내 수분 부족을 뜻해 ko를 맞춤"),
    "w-out": ("밖으로", "'out of range'·'draw fluid out' 두 문장에 맞게 ko를 맞춤"),
    "w-down": ("낮게", "문장에서 'keep pressure down'이라 ko를 맞춤"),
    "w-past": ("넘어서", "문장에서 'climbs past twenty'라 ko를 맞춤"),
    "w-lighten": ("얕게 하다", "ko '얕추다'는 없는 말 — '얕게 하다'로 바로잡음"),
    "w-dim": ("어둑한·어둡게 하다", "형용사(a dim room)와 동사(dim the lights)로 둘 다 쓰여 ko를 맞춤"),
    "w-drop": ("급강하", "(활용형 정리)"),
    "w-repeat": ("반복하는", "'repeat imaging'의 형용사 쓰임에 ko를 맞춤"),
    "w-max": ("최대한 쓰다", "활용형(maxed)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-deeper": ("깊은", "비교급(deeper)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-over": ("과배액되다", "활용형(over-drained)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-fill": ("채우다", "활용형(filled)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-kink": ("꼬이다", "활용형(kinked)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-block": ("막히다", "활용형(blocked)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-dampen": ("약해지다", "활용형(dampened)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-overload": ("과부하를 주다", "활용형(overloading)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-elevate": ("높이다", "활용형(elevated)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-climb": ("치솟다", "(활용형 정리)"),
    "w-fall": ("내려가다", "ko '떨어지는'이 w-drop과 겹친다 — fall은 수치가 '내려가다'로 가름"),
    "w-expand": ("확대되다", "활용형(expanding)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-reverse": ("역전시키다", "(활용형 정리)"),
    "w-rise": ("상승하다", "활용형(rising)을 원형으로 바꾸며 ko도 원형 뜻으로"),
    "w-increase": ("늘리다", "(활용형 정리)"),
}
for k in ("w-testing", "w-drop", "w-climb", "w-reverse", "w-increase"):
    KO.pop(k)
KO["w-drop"] = ("급강하", "(변경 없음)"); KO.pop("w-drop")

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
