#!/usr/bin/env python3
"""icu-arrhythmia 수정: A(fix-icu-arrhythmia-A.md)·B(-B.md) 반영. 원본은 scratchpad의 arr_orig.yaml(수정 전)."""
import copy, glob, sys, yaml
D = "/Users/yeom-yeon-ung/repository/forin/server/content/tools/wip/icu-or-rest/icu"
ORIG = sys.argv[1]
OUT = f"{D}/icu-arrhythmia.yaml"
doc = yaml.safe_load(open(ORIG, encoding="utf-8"))
orig = copy.deepcopy(doc)
load = lambda n: yaml.safe_load(open(f"{D}/fix_icu-arrhythmia_data_{n}.yaml", encoding="utf-8"))
WK = {"dEn": "distractorsEn", "dKo": "distractorsKo"}

# ---- 단어
wmap = {w["id"]: w for w in doc["words"]}
for n in (1, 2):
    for wid, patch in load(n)["words"].items():
        w = wmap[wid]
        for k, v in patch.items():
            w[WK.get(k, k)] = v

# ---- 문장
sent_edits = load(3)
sit_by_idx = doc["situations"]
sentence_log = {}   # (i,j) -> (old_en, old_ko)
for key, patch in sent_edits.items():
    i, j = (int(x) for x in str(key).split("."))
    s = sit_by_idx[i]["sentences"][j]
    old_en, old_ko = s["en"], s["ko"]
    for k, v in patch.items():
        if k == "dk":
            s["distractorsKo"] = list(v)
        elif k == "blank":
            ans, wr = v[0], v[1:]
            assert len(wr) == 3, key
            pos = (i * 3 + j * 5 + 1) % 4
            opts = wr[:pos] + [ans] + wr[pos:]
            s["blank"] = {"answer": ans, "options": [{"en": o} for o in opts]}
        elif k == "words":
            for r in v["remove"]:
                s["words"].remove(r)
        else:
            s[k] = v
    sentence_log[(i, j)] = (old_en, old_ko)

# example / exKo 맞추기 (문장 en·ko가 바뀐 경우)
for (i, j), (oen, oko) in sentence_log.items():
    s = sit_by_idx[i]["sentences"][j]
    if s["en"] == oen and s["ko"] == oko:
        continue
    for w in doc["words"]:
        if w["example"] == oen:
            w["example"] = s["en"]
            if w["exKo"] == oko:
                w["exKo"] = s["ko"]
            elif s["ko"] != oko:
                print(f"  [확인] {w['id']}: exKo가 옛 ko와 다름 -> {w['exKo']!r}")

# ---- 안 쓰는 단어 지우기
used = {t for sit in doc["situations"] for s in sit["sentences"] for t in s["words"]}
removed_words = [w["id"] for w in doc["words"] if w["id"] not in used and w["id"] in ("w-away", "w-eat", "w-drink")]
doc["words"] = [w for w in doc["words"] if w["id"] not in removed_words]

# ---- 뉘앙스·order
d4 = load(4)
for i, items in d4["nuance"].items():
    nu = sit_by_idx[i]["nuance"]
    for idx, spec in items.items():
        if "replace" in spec:
            nu[idx] = spec["replace"]
        if "patch" in spec:
            nu[idx].update(spec["patch"])
        if "scene_patch" in spec:
            for k, p in spec["scene_patch"].items():
                nu[idx]["scenes"][k].update(p)
for i, spec in d4["order"].items():
    o = sit_by_idx[i]["order"]
    for k in ("ko", "why", "tag", "icon"):
        if k in spec:
            o[k] = spec[k]
    if "lines" in spec:
        o["lines"] = spec["lines"]
    for idx, p in spec.get("line_patch", {}).items():
        o["lines"][idx].update(p)

yaml.safe_dump(doc, open(OUT, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)

# ---- changes 목록
WHY_W = {
    "w-artifact": "인공음영은 영상의학 용어 — 파형 아티팩트로 정정 (A D-2)",
    "w-noise": "소음 → 파형 잡음 (A D-3)",
    "w-replace": "교체하다 → 전해질 보충하다 (A D-4)",
    "w-bowel": "bowel은 명사 '장'이라 ko 정정 (A D-5)",
    "w-bear": "문장에서 bearing down — 헤드워드를 구 단위 bear down으로 (A D-6)",
    "w-rule": "문장에서 rule out — 헤드워드를 구 단위 rule out으로 (A D-7)",
    "w-board": "문장에서 on board — 헤드워드를 구 단위 on board로 (A D-8)",
    "w-update": "ko가 w-notify와 같아 더 정확하게 가름 (A D-9)",
}
WHY_S = {
    (4, 3): "구조 원인을 결과 전에 배제하는 말이라 not just structural로 (A D-14)",
    (5, 4): "급격한 심박 저하는 항상 진짜라는 틀린 사실 — never assume으로 (A D-11)",
    (6, 1): "'속도 조절'은 rate control의 직역 — 심박수 조절로 (A D-16)",
    (6, 3): "'심실 속도' → 심실 박동수 (A D-17)",
    (6, 4): "'속도가 내려오면서' → 심박수가 내려가면서 (A D-18)",
    (9, 3): "he's on은 ICU에서 투여 중 — 복용 중 → 투여 중 (A D-15)",
    (12, 4): "delivers one shock은 한 번으로 끝난다는 약속 — a shock으로 (A D-13)",
    (13, 3): "only fires는 지킬 수 없는 약속 — is designed to fire only when으로 (A D-12)",
}
chg_path = f"{D}/changes-icu-arrhythmia.yaml"
chg = yaml.safe_load(open(sys.argv[2], encoding="utf-8"))
new = []
o_words = {w["id"]: w for w in orig["words"]}
KEYS_W = ("en", "ko", "ipa", "icon", "example")
for w in doc["words"]:
    ow = o_words[w["id"]]
    f = [k for k in KEYS_W if ow.get(k) != w.get(k)]
    if f:
        why = WHY_W.get(w["id"]) or "고친 문장에 맞춰 예문을 새 문장으로 (A 결정 11)"
        new.append({"kind": "word", "id": w["id"], "fields": f, "why": why})
for wid in removed_words:
    why = "ko가 '당장'으로 away의 뜻이 아님 — w-right가 가르침 (A D-1)" if wid == "w-away" else "너무 쉬움 — 어느 문장도 태그하지 않게 됐다 (A D-10)"
    new.append({"kind": "word-remove", "id": wid, "why": why})
for i, sit in enumerate(doc["situations"]):
    for j, s in enumerate(sit["sentences"]):
        os_ = orig["situations"][i]["sentences"][j]
        f = [k for k in ("en", "ko", "chunks", "words") if os_.get(k) != s.get(k)]
        if f:
            if "en" in f or "ko" in f:
                why = WHY_S.get((i, j), "검토 반영")
            elif f == ["chunks"]:
                why = "구 경계를 끊은 chunks를 구 단위로 (A D-19)"
            else:
                why = "쉬운 단어 away 태그 빼기 (A D-1)" if "w-away" in "".join(os_["words"]) else "쉬운 단어 eat·drink 태그 빼기 (A D-10)"
            new.append({"kind": "sentence", "situation": sit["title"], "index": j, "fields": f, "why": why})
chg["changes"].extend(new)
yaml.safe_dump(chg, open(chg_path, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("changes +", len(new), "->", len(chg["changes"]), "removed", removed_words)
