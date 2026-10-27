#!/usr/bin/env python3
"""icu-pain-nonverbal 수정: fix-icu-pain-nonverbal-A.md·-B.md 반영.
원본(고치기 전)은 icu-pain-nonverbal.pre-fix.yaml, 변경 목록 원본은 changes-icu-pain-nonverbal.pre-fix.yaml, 정본 바탕은 base-icu-pain-nonverbal.yaml.
읽기: pre-fix + fix_icu-pain-nonverbal_data_{1,2,3}.yaml → 쓰기: icu-pain-nonverbal.yaml, changes-icu-pain-nonverbal.yaml (다시 돌려도 같은 결과)
"""
import copy, os, sys, yaml

D = os.path.dirname(os.path.abspath(__file__))
T = "icu-pain-nonverbal"
doc = yaml.safe_load(open(f"{D}/{T}.pre-fix.yaml", encoding="utf-8"))
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))
orig = copy.deepcopy(doc)
load = lambda n: yaml.safe_load(open(f"{D}/fix_{T}_data_{n}.yaml", encoding="utf-8"))
sits = doc["situations"]
wmap = {w["id"]: w for w in doc["words"]}
d1, d2, d3 = load(1), load(2), load(3)
notes = []

# ---- 문장
sentence_log = {}
for key, patch in d2.items():
    i, j = (int(x) for x in str(key).split("."))
    s = sits[i]["sentences"][j]
    old_en, old_ko = s["en"], s["ko"]
    for k, v in patch.items():
        if k == "dKo":
            assert len(v) == 2, key
            s["distractorsKo"] = list(v)
        elif k == "blank":
            ans, wr = v[0], v[1:]
            assert len(wr) == 3, key
            idx = [o["en"] for o in s["blank"]["options"]].index(s["blank"]["answer"])
            opts = list(wr[:idx]) + [ans] + list(wr[idx:])
            s["blank"] = {"answer": ans, "options": [{"en": o} for o in opts]}
        elif k == "blank_replace":
            opts = [o["en"] for o in s["blank"]["options"]]
            for a, b in v.items():
                assert a in opts and a != s["blank"]["answer"], (key, a)
                opts[opts.index(a)] = b
            s["blank"]["options"] = [{"en": o} for o in opts]
        elif k == "blank_opts":
            assert v["answer"] in v["options"] and len(v["options"]) == 4, key
            s["blank"] = {"answer": v["answer"], "options": [{"en": o} for o in v["options"]]}
        elif k == "words_add_front":
            for r in reversed(v):
                if r not in s["words"]:
                    s["words"].insert(0, r)
        elif k == "words_remove":
            for r in v:
                s["words"].remove(r)
        else:
            s[k] = v
    sentence_log[(i, j)] = (old_en, old_ko)


def retarget(obj, old_en, old_ko, new_en, new_ko, label):
    if obj.get("example") != old_en:
        return
    if new_en != old_en:
        obj["example"] = new_en
        obj["exKo"] = new_ko
    elif new_ko != old_ko:
        obj["exKo"] = new_ko


removed = list(d1["remove"])
for (i, j), (oen, oko) in sentence_log.items():
    s = sits[i]["sentences"][j]
    if s["en"] == oen and s["ko"] == oko:
        continue
    for w in doc["words"]:
        if w["example"] == oen and s["en"] != oen and w["id"] not in s["words"] and w["id"] not in removed:
            notes.append(f"  [손으로] {w['id']}: 예문이었던 문장 {i}.{j}에 더는 태그가 없다")
        retarget(w, oen, oko, s["en"], s["ko"], w["id"])
    for sit in sits:
        for n in sit["nuance"]:
            if n.get("kind") == "slider":
                retarget(n, oen, oko, s["en"], s["ko"], f"slider {n['words']}")

# ---- 뉘앙스
for i, items in d3["nuance"].items():
    nu = sits[i]["nuance"]
    for idx, spec in items.items():
        if "patch" in spec:
            nu[idx].update(spec["patch"])
        if "scene_patch" in spec:
            for k, p in spec["scene_patch"].items():
                nu[idx]["scenes"][k].update(p)

# ---- 단어
WK = {"dEn": "distractorsEn", "dKo": "distractorsKo"}
for wid, patch in d1["words"].items():
    w = wmap[wid]
    for k, v in patch.items():
        if k == "decoy_replace":
            for a, b in v.items():
                assert a in w["decoyChips"], (wid, a)
                w["decoyChips"] = [b if x == a else x for x in w["decoyChips"]]
        else:
            w[WK.get(k, k)] = v
for wid in removed:
    assert wid in wmap, wid
doc["words"] = [w for w in doc["words"] if w["id"] not in removed]
for before, nw in d1["add_before"].items():
    pos = next(n for n, w in enumerate(doc["words"]) if w["id"] == before)
    doc["words"].insert(pos, nw)
used = {t for sit in sits for s in sit["sentences"] for t in s["words"]}
for r in removed:
    assert r not in used, f"{r} 아직 태그됨"
for n_sit in sits:
    for n in n_sit["nuance"]:
        for t in n["words"]:
            assert t not in removed, (t, n_sit["title"])
unused = [w["id"] for w in doc["words"] if w["id"] not in used]
if unused:
    notes.append(f"  [확인] 어느 문장도 태그하지 않는 단어: {unused}")

# ---- order
for i, spec in d3["order"].items():
    o = sits[i]["order"]
    for k in ("ko", "why", "tag", "icon"):
        if k in spec:
            o[k] = spec[k]
    if "lines" in spec:
        o["lines"] = spec["lines"]
    for idx, p in spec.get("line_patch", {}).items():
        o["lines"][idx].update(p)

yaml.safe_dump(doc, open(f"{D}/{T}.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)

# ---- changes 목록: 정본 바탕(base)과 최종을 견주어 다시 만든다. 옛 why는 같은 항목이면 그대로 쓴다.
KEYS_W = ("en", "ko", "ipa", "icon", "example")
KEYS_S = ("en", "ko", "chunks", "words")
old_chg = yaml.safe_load(open(f"{D}/changes-{T}.pre-fix.yaml", encoding="utf-8"))
old_why = {}
for c in old_chg["changes"]:
    key = (c["kind"], c.get("id") or (c.get("situation"), c.get("index")))
    old_why[key] = c["why"]

WHY_W = {
    "w-time": "ko '시간을 맞추다'(동사)는 3.4·9.2의 time(투여 시점을 맞추다)에 필요하다 — 쉬운 말이 아니라 되살림. 예문을 그 문장으로 (A D27)",
    "w-rule": "쓰임이 구동사 하나(rule out)라 헤드워드를 rule out으로 (A D30)",
    "w-level": "5.1을 고쳐(약 농도 일반화 삭제) 어느 문장도 태그하지 않게 됐다 (A 안전 4)",
    "w-oversedated": "6.1을 고쳐(과진정은 초조의 원인이 아니라 반대 상태) 어느 문장도 태그하지 않게 됐다 (A 8)",
}
WHY_S = {
    (15, 4): "[안전] 사정·호출보다 투약을 앞세우고 처방 조건이 없던 문장을, 처방대로 의사를 부르는 동안 주는 것으로 (A 1)",
    (13, 5): "[안전] 호흡억제를 보는 순간 날록손으로 완전 역전한다는 약속은 틀림 — 프로토콜대로 (A 2)",
    (18, 5): "[안전] 임종기 가족에게 통증 없음을 보장하는 말을 할 수 있는 건 다 하겠다는 말로 (A 3)",
    (5, 1): "[안전] 30분을 최고 농도 시점으로 일반화함 — 정맥 투여 최고 효과 근처라고 경로를 밝혀 (A 4)",
    (17, 3): "[범위] 간호사가 특정 약을 권하지 않고 의사에게 묻는 문장으로, 구동사 smooth out을 끊던 chunks 정리 (A 5)",
    (12, 3): "단정(will)을 가능성(can)으로 (A 6)",
    (20, 5): "[범위] 아편 교체는 처방자 결정 — 바꾼다면 관찰한다는 조건문으로 (A 7)",
    (6, 1): "과진정은 초조의 원인이 아니라 반대 상태라 논리가 어긋남 — 진정이 더 필요하다는 단정으로 (A 8)",
    (3, 3): "복합명사 dressing change를 끊은 chunks를 바로잡음 (A 9)",
    (12, 5): "명사구를 끊은 chunks를 바로잡음 (A 10)",
    (14, 5): "구동사 check in을 끊은 chunks를 바로잡음 (A 11)",
    (11, 1): "명사구 high opioid doses를 끊은 chunks를 바로잡음 (A 11-2)",
    (19, 3): "명사구 a different opioid를 끊은 chunks를 바로잡음 (A 11-3)",
    (4, 1): "so you're more comfortable을 한 조각으로 (A 11-4)",
    (16, 5): "ko: 날록손이 사라진다가 아니라 효과가 먼저 떨어진다는 뜻으로 (A 12)",
    (0, 2): "ko: you를 가리키는 말·현재 상태 진술로 바로잡음 (A 31)",
    (9, 2): "ko: 어색한 '볼루스 시간을 맞춰요'를 자연스럽게, 동사 time 태그 되살림 (A 31·27)",
    (14, 0): "ko: you를 3인칭 '가족'으로 옮긴 것을 바로잡음 (A 31)",
    (14, 4): "ko: 번역투 '가족의'를 보호자분이 보신 것으로 (A 31)",
    (12, 2): "ko: 무엇이 부족한지 풀어 씀 (A 31)",
    (19, 4): "ko: 무엇을 올리는지 밝힘 (A 31)",
    (3, 4): "w-time 태그 되살림 (A 27)",
}
new = []
bw = {w["id"]: w for w in base["words"]}
fw = {w["id"]: w for w in doc["words"]}
for w in doc["words"]:
    if w["id"] not in bw:
        new.append({"kind": "word-add", "id": w["id"], "why": "검토 반영"})
        continue
    f = [k for k in KEYS_W if bw[w["id"]].get(k) != w.get(k)]
    if f:
        why = old_why.get(("word", w["id"])) or WHY_W.get(w["id"]) or "고친 문장에 맞춰 예문을 새 문장으로 (A·B 반영)"
        if w["id"] in WHY_W:
            why = WHY_W[w["id"]]
        new.append({"kind": "word", "id": w["id"], "fields": f, "why": why})
for wid in bw:
    if wid not in fw:
        why = WHY_W.get(wid) or old_why.get(("word-remove", wid)) or "너무 쉬움"
        new.append({"kind": "word-remove", "id": wid, "why": why})
for i, sit in enumerate(sits):
    bsit = base["situations"][i]
    assert bsit["title"] == sit["title"]
    for j, s in enumerate(sit["sentences"]):
        bs = bsit["sentences"][j]
        f = [k for k in KEYS_S if bs.get(k) != s.get(k)]
        if f:
            ow = old_why.get(("sentence", (sit["title"], j)))
            was = [k for k in KEYS_S if orig["situations"][i]["sentences"][j].get(k) != bs.get(k)]
            why = WHY_S.get((i, j)) or (ow if ow and was == f else None) or ow or "태그 정리 (A)"
            new.append({"kind": "sentence", "situation": sit["title"], "index": j, "fields": f, "why": why})
chg = {"theme": old_chg["theme"], "changes": new}
yaml.safe_dump(chg, open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print(f"words {len(orig['words'])} -> {len(doc['words'])}; changes {len(old_chg['changes'])} -> {len(new)}")
for n in notes:
    print(n)
