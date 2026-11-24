#!/usr/bin/env python3
"""or-specimen A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko·chunks는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "or-specimen"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

LIST = "patient name time go".split()                     # 공통 쉬운 단어 목록
JUDGE = "add call next open another".split()              # 목록 밖 판단 5개
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"너무 쉬움 — 목록 밖 판단({x})"

# (상황, 문장 번호) -> 뺄 태그, 이유
UNTAG = {
    ("검체 용기 라벨 부착", 0): ("w-label", "여기서 label은 동사(라벨을 붙이다)라 헤드워드(명사 라벨)와 품사가 다름"),
    ("다수 검체 혼동 방지", 0): ("w-label", "여기서 label은 동사라 헤드워드(명사 라벨)와 품사가 다름"),
    ("다수 검체 혼동 방지", 4): ("w-label", "여기서 label은 동사라 헤드워드(명사 라벨)와 품사가 다름"),
    ("라벨 없는 검체 발견", 5): ("w-label", "여기서 label은 동사라 헤드워드(명사 라벨)와 품사가 다름"),
    ("라벨 정보 불일치", 2): ("w-correct", "여기서 corrected는 동사(바로잡다)라 헤드워드(맞는)와 뜻이 다름"),
    ("라벨 정보 불일치", 5): ("w-correct", "여기서 correct는 동사(바로잡다)라 헤드워드(맞는)와 뜻이 다름"),
    ("병리 요청서 일치", 5): ("w-correct", "여기서 correct는 동사(바로잡다)라 헤드워드(맞는)와 뜻이 다름"),
    ("잘못된 환자 라벨", 1): ("w-correct", "여기서 corrected는 동사(바로잡다)라 헤드워드(맞는)와 뜻이 다름"),
    ("검체 크기·개수 기록", 3): ("w-count", "여기서 count는 동사(세다)라 헤드워드(명사 개수)와 품사가 다름"),
}
ADDTAG = {
    ("다수 검체 혼동 방지", 3): "w-mixup",
    ("라벨 없는 검체 발견", 1): "w-unlabeled",
    ("라벨 없는 검체 발견", 4): "w-figureout",
}
touched = {}
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE]
        u = UNTAG.get((s["title"], i))
        if u:
            assert u[0] in new, (s["title"], i, u)
            new.remove(u[0])
        a = ADDTAG.get((s["title"], i))
        if a:
            new.append(a)
        if new != x["words"]:
            assert new, (s["title"], i, x["en"])
            x["words"] = new
            touched[(s["title"], i)] = True
for wid in REMOVE:
    assert not any(wid in x["words"] for s in doc["situations"] for x in s["sentences"]), wid
doc["words"] = [w for w in doc["words"] if w["id"] not in REMOVE]
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움 — {why}; 어느 문장도 태그하지 않게 됐다"})

NEW = {
    "w-mixup": ("mix up", "/mɪks ʌp/", "헷갈리다", "check", "Let's not mix up these two specimens.", "문장 3에 이미 있는 말 — 상황 단어 수(V3)를 채우고 가르칠 값이 있는 구"),
    "w-figureout": ("figure out", "/ˈfɪɡjər aʊt/", "알아내다", "check", "Let's stop and figure out whose specimen this is.", "문장 4에 이미 있는 구 — 상황 단어 수(V3)를 채움"),
    "w-unlabeled": ("unlabeled", "/ʌnˈleɪbəld/", "라벨이 없는", "board", "Stop—we can't send an unlabeled specimen.", "문장 1에 이미 있는 말 — 상황 단어 수(V3)를 채움"),
}
for wid, (en, ipa, ko, icon, ex, why) in NEW.items():
    doc["words"].append({"id": wid, "en": en, "ipa": ipa, "ko": ko, "icon": icon, "example": ex})
    changes.append({"kind": "word-add", "id": wid, "why": why})
bank = {w["id"]: w for w in doc["words"]}

# 헤드워드·ko 정리
HEAD = {
    "w-hand": ({"en": "hand off", "ipa": "/hænd ɔf/", "ko": "넘겨주다"}, "문장은 handing off(넘겨주다) — 단독 hand(손)는 뜻이 틀리고 공통 쉬운 단어", ["en", "ipa", "ko"]),
    "w-way": ({"en": "on the way", "ipa": "/ɑn ðə weɪ/", "ko": "가는 중"}, "문장은 on the way(가는 중) — 단독 way(길)는 뜻이 틀림", ["en", "ipa", "ko"]),
}
for wid, (upd, why, fields) in HEAD.items():
    bank[wid].update(upd)
    changes.append({"kind": "word", "id": wid, "fields": fields, "why": why})
KO_EDITS = {
    "w-label": ("라벨", "tag된 문장 대부분이 명사(on the label·this label) — 동사 문장은 태그를 뺌"),
    "w-count": ("개수", "tag된 문장 대부분이 명사(the count) — 동사(count the pieces) 문장은 태그를 뺌"),
    "w-check": ("살펴보다", "w-confirm·w-verify와 ko(확인하다)가 같아 정답이 둘 — check는 눈으로 살피는 쪽"),
    "w-verify": ("대조하다", "w-confirm·w-check와 ko(확인하다)가 같아 정답이 둘 — verify는 기록과 맞춰 보는 쪽"),
    "w-identify": ("신원을 밝히다", "w-confirm 등과 ko가 겹치지 않게 — identify는 누구 것인지 밝히는 일"),
    "w-search": ("샅샅이 찾다", "수색하다는 간호 현장에 어색 — search the field는 빠짐없이 찾아보는 일"),
    "w-sample": ("시료", "w-specimen(검체)과 ko가 같아 정답이 둘 — sample은 덜어 낸 시료"),
    "w-fragment": ("단편", "w-piece(조각)와 ko가 같아 정답이 둘 — fragment는 떨어져 나온 단편"),
    "w-log": ("일지에 적다", "w-record(기록하다)와 ko가 같아 정답이 둘 — log는 기록부(일지)에 올리는 일"),
    "w-run": ("급히 가져가다", "run it to pathology는 '달리다'가 아니라 서둘러 가져가는 일"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어 태그 빼기 / 헤드워드와 품사·뜻이 다른 태그 빼기 / 새 단어 태그"})

KEYS = ["exKo", "cue", "tag", "distractorsEn", "distractorsKo", "chips", "decoyChips"]
add = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for wid, v in (yaml.safe_load(io.open(f, encoding="utf-8")) or {}).items():
        assert wid not in add, f"dup {wid} in {f}"
        add[wid] = v
print("missing:", [i for i in bank if i not in add], "extra:", sorted(set(add) - set(bank)))
sko = {}
for s in doc["situations"]:
    for t in s["sentences"]:
        sko.setdefault(t["en"], t["ko"])
for w in doc["words"]:
    v = add.get(w["id"])
    if not v:
        continue
    for k in KEYS:
        if k in v:
            w[k] = v[k]
    w["exKo"] = sko[w["example"]]
    joined = " ".join("".join(p) for p in v["chips"])
    if joined != w["en"]:
        print("CHIPS!=en", w["id"], joined, "|", w["en"])
    flat = {p.lower() for word in v["chips"] for p in word}
    for dc in v["decoyChips"]:
        if dc.lower() in flat:
            print("decoy is own fragment", w["id"], dc)
    if w["en"].lower() in v["cue"].lower():
        print("CUE leaks", w["id"])
    if w["ko"] in v["cue"]:
        print("CUE repeats ko", w["id"], w["ko"])
    pool = [p for word in v["chips"] for p in word] + list(v["decoyChips"])
    target = w["en"].replace(" ", "")
    orig = [p for word in v["chips"] for p in word]
    for r in range(1, 7):
        for combo in itertools.permutations(range(len(pool)), r):
            if "".join(pool[j] for j in combo) == target and [pool[j] for j in combo] != orig:
                print("ALT PATH", w["id"], [pool[j] for j in combo])
    for k, ans in (("distractorsEn", w["en"]), ("distractorsKo", w["ko"])):
        a = len(ans.replace(" ", ""))
        for d in v[k]:
            n = len(d.replace(" ", ""))
            if not (max(a, n) <= 1.25 * min(a, n) or abs(a - n) <= 3):
                print("LEN", w["id"], k, d, n, "vs", a)
kos = {}
for w in doc["words"]:
    kos.setdefault(w["ko"], []).append(w["id"])
print("same ko:", {k: v for k, v in kos.items() if len(v) > 1})

nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for title, lst in (yaml.safe_load(io.open(f, encoding="utf-8")) or {}).items():
        assert title not in nu, f"dup {title}"
        nu[title] = lst
titles = [s["title"] for s in doc["situations"]]
print("unknown nuance titles:", sorted(set(nu) - set(titles)))
for s in doc["situations"]:
    if s["title"] in nu:
        s["nuance"] = nu[s["title"]]
        tagged = {x for t in s["sentences"] for x in t["words"]}
        for q in s["nuance"]:
            off = [x for x in q.get("words", []) if x not in tagged]
            if off:
                print("V15 risk", s["title"], q["kind"], off)
            if q["kind"] == "context":
                for sc in q["scenes"]:
                    if q["word"].lower() not in sc["en"].lower():
                        print("W14 risk", s["title"], q["word"], "|", sc["en"])
# 정답 칸·어색한 장면 자리를 상황 순서로 돌려 0·1·2에 고르게
for si, s in enumerate(doc["situations"], 1):
    for q in s.get("nuance", []):
        if q["kind"] == "context":
            tgt = (si + 1) % 3
            odd = [k for k, sc in enumerate(q["scenes"]) if sc["ok"] is False][0]
            sc = q["scenes"].pop(odd)
            q["scenes"].insert(tgt, sc)
        elif q["kind"] == "swap":
            tgt = (si - 1) % 3
            k = q["options"].index(q["answer"])
            o = q["options"].pop(k)
            q["options"].insert(tgt, o)
print("nuance missing:", [t for t in titles if t not in nu])


class Dumper(yaml.SafeDumper):
    pass


def _str(d, s):
    q = s.lower() in ("on", "off", "yes", "no", "true", "false", "null", "y", "n")
    return d.represent_scalar("tag:yaml.org,2002:str", s, style='"' if q else None)


Dumper.add_representer(str, _str)
io.open(f"{D}/{T}.A.yaml", "w", encoding="utf-8").write(
    yaml.dump(doc, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
io.open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8").write(
    yaml.dump({"theme": T, "changes": changes}, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
print(f"words {len(doc['words'])} situations {len(doc['situations'])} changes {len(changes)}")
