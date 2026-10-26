#!/usr/bin/env python3
"""icu-sedation 수정: fix-icu-sedation-A.md·-B.md 반영.
원본(고치기 전)은 icu-sedation.pre-fix.yaml, 변경 목록 원본은 changes-icu-sedation.pre-fix.yaml.
읽기: pre-fix + fix_icu-sedation_data_{1,2,3}.yaml → 쓰기: icu-sedation.yaml, changes-icu-sedation.yaml (다시 돌려도 같은 결과)
"""
import copy, yaml

D = "/Users/yeom-yeon-ung/repository/forin/server/content/tools/wip/icu-or-rest/icu"
doc = yaml.safe_load(open(f"{D}/icu-sedation.pre-fix.yaml", encoding="utf-8"))
orig = copy.deepcopy(doc)
load = lambda n: yaml.safe_load(open(f"{D}/fix_icu-sedation_data_{n}.yaml", encoding="utf-8"))
WK = {"dEn": "distractorsEn", "dKo": "distractorsKo"}
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
        elif k == "words_remove":
            for r in v:
                assert r in s["words"], (key, r)
                s["words"].remove(r)
        elif k == "words_add":
            for r in v:
                if r not in s["words"]:
                    s["words"].append(r)
        elif k == "chunks":
            s["chunks"] = list(v)
        else:
            s[k] = v
    sentence_log[(i, j)] = (old_en, old_ko)

# ---- 예문(example/exKo) 맞추기: 단어 은행과 뉘앙스 slider
def retarget(obj, old_en, old_ko, new_en, new_ko, tagged, label):
    if obj.get("example") != old_en:
        return
    if new_en != old_en:
        obj["example"] = new_en
        if obj.get("exKo") == old_ko:
            obj["exKo"] = new_ko
        else:
            notes.append(f"  [확인] {label}: exKo가 옛 ko와 다름 -> {obj.get('exKo')!r}")
    elif obj.get("exKo") == old_ko and new_ko != old_ko:
        obj["exKo"] = new_ko

for (i, j), (oen, oko) in sentence_log.items():
    s = sits[i]["sentences"][j]
    if s["en"] == oen and s["ko"] == oko:
        continue
    for w in doc["words"]:
        if w["example"] == oen and s["en"] != oen and w["id"] not in s["words"] and w["id"] not in d1["remove"]:
            notes.append(f"  [손으로] {w['id']}: 예문이었던 문장 {i}.{j}에 더는 태그가 없다")
        retarget(w, oen, oko, s["en"], s["ko"], s["words"], w["id"])
    for sit in sits:
        for n in sit["nuance"]:
            if n.get("kind") == "slider":
                retarget(n, oen, oko, s["en"], s["ko"], s["words"], f"slider {n['words']}")

# ---- 뉘앙스
for i, items in d3["nuance"].items():
    nu = sits[i]["nuance"]
    for idx, spec in items.items():
        if "replace" in spec:
            nu[idx] = spec["replace"]
        if "patch" in spec:
            nu[idx].update(spec["patch"])
        if "scene_patch" in spec:
            for k, p in spec["scene_patch"].items():
                nu[idx]["scenes"][k].update(p)

# ---- 단어
for wid, patch in d1["words"].items():
    w = wmap[wid]
    for k, v in patch.items():
        w[WK.get(k, k)] = v
for wid in d1["remove"]:
    assert wid in wmap, wid
removed = list(d1["remove"])
doc["words"] = [w for w in doc["words"] if w["id"] not in removed]
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
    for idx, p in spec.get("line_patch", {}).items():
        o["lines"][idx].update(p)

yaml.safe_dump(doc, open(f"{D}/icu-sedation.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)

# ---- changes 목록 (v44 필드: 단어 en·ko·ipa·icon·example / 문장 en·ko·chunks·words)
WHY_W = {
    "w-hold": "ko '고수하다'는 19.2 'hold the infusion'(주입을 보류하다)을 거꾸로 읽게 한다 — '지키다/보류하다' (A W2·안전)",
    "w-close": "7.3 'a close eye'의 close는 '면밀한'이지 거리가 아니다 (A W3)",
    "w-order": "ko '지시/처방'이 w-command '지시'와 겹쳐 정답이 둘 — 처방으로 가름 (A W4)",
}
WHY_S = {
    (2, 5): "ko의 영어 analgesia-first를 한국어로, chunks의 this를 명사에 붙임 (A S1)",
    (3, 5): "'wake toward us'는 성립하지 않는 영어 — 말을 걸면 깨어날 수 있다는 문장으로 (A S2)",
    (5, 4): "형용사와 명사를 끊은 chunks를 구 단위로 (A S3)",
    (6, 4): "ko의 영어 titrate를 한국어로, 명사구를 끊은 chunks를 바로잡음 (A S4)",
    (7, 3): "ko가 close를 거리로 옮긴 오역 — '면밀히' (A S5)",
    (8, 3): "복합명사 pain score를 끊은 chunks를 바로잡음 (A S6)",
    (10, 4): "[안전] 시험 직후 원래 설정으로 되돌린다는 말은 프로토콜과 반대 — 필요할 때만 다시 시작 (A S7)",
    (10, 5): "ko의 번역투 대명사 '그에게'를 '환자분께'로 (A S8)",
    (13, 3): "[안전] 깨어난다는 단정은 지킬 수 없는 약속 — can으로 (A S9)",
    (13, 4): "ko의 번역투 '그를 … 그 자체의 약으로'를 자연스럽게 (A S10)",
    (13, 6): "[안전] 알람을 미리 별일 아니라고 단정하지 않고 와서 확인한다고 (A S11)",
    (16, 3): "[안전] 어느 주입인지 밝혀 수액·승압제를 끄는 것으로 들리지 않게 (A S12)",
    (17, 4): "[안전] 마비 환자용 진정 척도는 없다 — 처리 뇌파(BIS) 감시를 더하는 문장으로 (A S13)",
    (18, 3): "ko의 번역투 '그가'를 '환자가'로 (A S14)",
    (1, 3): "check out의 w-check·쉬운 단어 w-number 태그 빼기 (A S15·W1)",
    (10, 1): "pair it with는 동사 — 명사 w-pair 태그 빼기 (A S16)",
    (15, 3): "trending the wrong way는 자동사 — w-trend 태그 빼기 (A S17)",
    (18, 0): "hold his hands는 '잡다' — w-hold 태그 빼기 (A S18)",
    (1, 2): "ko의 영어 titrate를 한국어로 (A K1)", (7, 1): "ko의 영어 titrate를 한국어로 (A K2)",
    (3, 0): "ko의 영어 light sedation을 한국어로 (A K3)", (4, 1): "end-tidal CO2는 분압이 아니라 호기말 값 (A K4)",
    (16, 0): "'백밸브마스크를 해줘요'를 자연스럽게 (A K5)", (20, 1): "w-multimodal ko와 맞춤 (A K6)",
    (20, 2): "번역투 '그와 라인들을'을 '환자와'로 (A K7)", (14, 1): "빠진 목적어를 더함 (A K8)",
}
chg = yaml.safe_load(open(f"{D}/changes-icu-sedation.pre-fix.yaml", encoding="utf-8"))
new = []
KEYS_W = ("en", "ko", "ipa", "icon", "example")
for w in doc["words"]:
    ow = next(x for x in orig["words"] if x["id"] == w["id"])
    f = [k for k in KEYS_W if ow.get(k) != w.get(k)]
    if f:
        why = WHY_W.get(w["id"]) or "고친 문장에 맞춰 예문을 새 문장으로 (A·B 반영)"
        new.append({"kind": "word", "id": w["id"], "fields": f, "why": why})
for wid in removed:
    why = {"w-emergency": "13.6을 고쳐 어느 문장도 태그하지 않게 됐다 (A S11)",
           "w-scale": "17.4를 고쳐 어느 문장도 태그하지 않게 됐다 (A S13)",
           "w-use": "너무 쉬움 — 17.4를 고치며 태그도 없어졌다 (A W1)"}.get(wid, "너무 쉬움 — 간호사가 이미 아는 말이다 (A W1)")
    new.append({"kind": "word-remove", "id": wid, "why": why})
for i, sit in enumerate(sits):
    for j, s in enumerate(sit["sentences"]):
        os_ = orig["situations"][i]["sentences"][j]
        f = [k for k in ("en", "ko", "chunks", "words") if os_.get(k) != s.get(k)]
        if f:
            if ("en" in f or "ko" in f or "chunks" in f) and (i, j) in WHY_S:
                why = WHY_S[(i, j)]
            elif f == ["words"]:
                why = "쉬운 단어 태그 빼기 (A W1)" if any(r in ("w-tell", "w-give", "w-put", "w-long", "w-second", "w-number") for r in set(os_["words"]) - set(s["words"])) else "태그 정리 (A)"
            else:
                why = WHY_S.get((i, j), "검토 반영")
            new.append({"kind": "sentence", "situation": sit["title"], "index": j, "fields": f, "why": why})
chg["changes"] = chg["changes"] + new
yaml.safe_dump(chg, open(f"{D}/changes-icu-sedation.yaml", "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print(f"words {len(orig['words'])} -> {len(doc['words'])}; changes {len(chg['changes']) - len(new)} + {len(new)} = {len(chg['changes'])}")
for n in notes:
    print(n)
