# icu-liver-failure 수정 — pre-fix 에서 다시 돌려도 같은 결과(멱등).
#   python3 fix_icu-liver-failure.py
# 읽는 것: icu-liver-failure.pre-fix.yaml, changes-icu-liver-failure.pre-fix.yaml,
#          proposed_icu-liver-failure_B.py(P) · decoy_icu-liver-failure_B.py(D) (ast로 사전만),
#          fix_icu-liver-failure_data_1~4.yaml
# 쓰는 것: icu-liver-failure.yaml, changes-icu-liver-failure.yaml
import ast, copy, os, sys, yaml

T = "icu-liver-failure"
os.chdir(os.path.dirname(os.path.abspath(__file__)))


def load(p):
    return yaml.safe_load(open(p, encoding="utf-8"))


def lit(path, name):
    tree = ast.parse(open(path, encoding="utf-8").read())
    for n in tree.body:
        if isinstance(n, ast.Assign) and any(getattr(t, "id", None) == name for t in n.targets):
            return ast.literal_eval(n.value)
    raise KeyError(name)


pre = load(f"{T}.pre-fix.yaml")
doc = copy.deepcopy(pre)
chg_pre = load(f"changes-{T}.pre-fix.yaml")
S = doc["situations"]
WB = {w["id"]: w for w in doc["words"]}
PRE_S = pre["situations"]


def sent(key):
    i, j = map(int, key.split("."))
    return S[i]["sentences"][j]


def set_blank(x, b):
    assert b[0] in x["en"] or b[0].lower() in x["en"].lower(), (x["en"], b)
    x["blank"] = {"answer": b[0], "options": [{"en": o} for o in b]}


# ---- B: distractorsKo · decoy
P = lit(f"proposed_{T}_B.py", "P")
D = lit(f"decoy_{T}_B.py", "D")
for key, v in P.items():
    x = sent(key)
    for k, val in enumerate(v):
        if val is not None:
            x["distractorsKo"][k] = val
for key, (dc, slot) in D.items():
    sent(key)["decoy"] = dc

# ---- B: blank · why · icon (data_3)
d3 = load(f"fix_{T}_data_3.yaml")
for key, b in d3["blank"].items():
    set_blank(sent(key), b)
for key, w in d3["why"].items():
    sent(key)["why"] = w
for key, ic in d3["icon"].items():
    sent(key)["icon"] = ic

# ---- A: 문장 (data_1) — B 값 위에 덮는다
d1 = load(f"fix_{T}_data_1.yaml")
changed = {}   # key -> (old en, old ko)
for key, v in d1["sentences"].items():
    x = sent(key)
    changed[key] = (x["en"], x["ko"], list(x["words"]))
    for f in ("en", "ko", "chunks", "words", "tag", "icon", "why", "decoy"):
        if f in v:
            x[f] = v[f]
    if "d" in v:
        x["distractorsKo"] = list(v["d"])
    if "blank" in v:
        set_blank(x, v["blank"])

# ---- 단어 제거 (4.3 문장에서만 쓰이던 add·bag)
removed = []
for wid in ("w-add", "w-bag"):
    assert not any(wid in t["words"] for s in S for t in s["sentences"]), wid
    assert not any(wid in n["words"] for s in S for n in s["nuance"]), wid
    del WB[wid]
    removed.append(wid)
doc["words"] = [w for w in doc["words"] if w["id"] in WB]

# ---- 예문 따라가기: 바뀐 문장을 예문으로 쓰던 단어
def tagging(wid, skip=None):
    for i, s in enumerate(S):
        for j, t in enumerate(s["sentences"]):
            if f"{i}.{j}" != skip and wid in t["words"]:
                return t
    return None

for key, (old_en, old_ko, old_words) in changed.items():
    x = sent(key)
    for w in doc["words"]:
        if w.get("example") != old_en:
            continue
        if w["id"] in x["words"]:
            w["example"], w["exKo"] = x["en"], x["ko"]
        else:
            t = tagging(w["id"], skip=key)
            assert t, (w["id"], key)
            w["example"], w["exKo"] = t["en"], t["ko"]

# ---- A: 단어·뉘앙스 (data_2)
d2 = load(f"fix_{T}_data_2.yaml")
for wid, v in d2["words"].items():
    w = WB[wid]
    for k, val in v.items():
        if k == "dEn_replace":
            w["distractorsEn"] = [val.get(a, a) for a in w["distractorsEn"]]
            assert all(a in w["distractorsEn"] for a in val.values()), (wid, val)
        elif k == "dKo_replace":
            w["distractorsKo"] = [val.get(a, a) for a in w["distractorsKo"]]
            assert all(a in w["distractorsKo"] for a in val.values()), (wid, val)
        elif k == "decoy_replace":
            w["decoyChips"] = [val.get(a, a) for a in w["decoyChips"]]
            assert all(a in w["decoyChips"] for a in val.values()), (wid, val)
        else:
            w[k] = val

for spec in d2["nuance"]:
    sit = S[spec["i"]]
    hits = [n for n in sit["nuance"] if n["kind"] == spec["kind"] and spec["w"] in n["words"]]
    assert len(hits) == 1, (spec, len(hits))
    n = hits[0]
    for k, val in (spec.get("set") or {}).items():
        n[k] = val
    for idx, en in (spec.get("scene_en") or {}).items():
        n["scenes"][idx]["en"] = en
    for idx, fx in (spec.get("scene_fix") or {}).items():
        n["scenes"][idx]["fix"] = fx
    if spec.get("why_append"):
        n["why"] = n["why"] + spec["why_append"]
    for old, new in (spec.get("option_replace") or {}).items():
        assert old in n["options"], (spec, old)
        n["options"] = [new if o == old else o for o in n["options"]]
    for old, (new, text) in (spec.get("note_replace") or {}).items():
        assert old in n["notes"], (spec, old)
        n["notes"] = {(new if k == old else k): (text if k == old else v) for k, v in n["notes"].items()}

# ---- B: order (data_4)
d4 = load(f"fix_{T}_data_4.yaml")
for i, spec in d4["order"].items():
    o = S[i]["order"]
    for f in ("ko", "why", "tag", "icon"):
        if f in spec:
            o[f] = spec[f]
    for n, ln in (spec.get("lines") or {}).items():
        L = o["lines"][n - 1]
        for k, val in ln.items():
            L[k] = val

# ---- 변경 목록
WHY_SENT = {
    "2.0": "독소를 맑게 배출은 번역투 — 몸 밖으로 내보내도록(K1); w-clear 태그를 6.5로(W3)",
    "2.2": "혼란을 맑게 하는은 번역투 — 혼란이 걷히게(K2); w-clear 태그를 6.5로(W3)",
    "2.5": "용량 조정은 처방자 몫 — 의사에게 알린다는 말로(S1)",
    "4.3": "간호사가 수액백에 칼륨을 넣는 말은 고위험 — 보충 처방을 받는다는 말로(S2); add·bag 태그 제거",
    "5.3": "한국 학습자는 섭씨로 읽는다 — 화씨 표기와 섭씨 환산을 ko에(S14)",
    "6.4": "약 용량을 놓친 것이 아니라 약을 한 번 거른 것(S15)",
    "6.5": "w-clear 쓰임을 6.2·6.5(맑아지다)로 모은다(W3)",
    "7.3": "INR만 보고 시술 전 혈장을 주는 것은 현재 권고와 반대 — 팀에 물어보는 말로(S3)",
    "7.4": "chunk가 절을 끊음(S20)",
    "7.5": "혈소판 수혈은 처방자가 정한다 — 물어보는 말로, chunk가 구를 끊음(S4)",
    "8.3": "chunk가 부사와 형용사를 끊음(S21)",
    "8.4": "tight neck lines는 목의 중심정맥관으로 읽힌다 — 목을 조이는 것으로(S5)",
    "11.1": "reactions는 원치 않는 반응 — 이상 반응(K6)",
    "11.4": "알레르기 반응은 검사가 아니라 환자를 보고 찾는다(S6)",
    "12.1": "조기 패혈증을 위해는 뜻이 반대로 읽힌다(K3)",
    "12.5": "치료 시작을 간호사가 약속하는 말 — 바로 팀에 연락하는 말로(S7)",
    "13.4": "식후 혼란에 암모니아를 재검한다는 틀린 관행 — 조금씩 자주와 밤 간식으로(S8)",
    "14.3": "청소하지는 번역투 — 처리하지(S16)",
    "14.4": "진정제 감량은 프로토콜 안에서 — per protocol(S9)",
    "14.5": "청소하기 어려운 약은 번역투 — 몸에서 잘 빠져나가지 않는 약(S17)",
    "15.4": "CT를 간호사가 정하는 말 — 처방된 식염수와 요청하는 말로(S10)",
    "16.4": "type and cross는 한 검사 이름 — chunk(S22)",
    "17.0": "흡인 준비를 가져올게요는 어색(K4)",
    "17.5": "윤상연골 압박을 일상 처치처럼 — 삽관하는 사람이 원하면(S11)",
    "18.1": "더 많은 지지는 번역투(K5)",
    "18.3": "혈압이 기능을 멈추고는 어색하고 chunk가 주어와 동사를 끊음(S18)",
    "19.3": "1A는 긴급도일 뿐 즉시 수용이 아니다(S12); w-list·w-status 태그 제거",
    "19.4": "받아들이는 팀은 번역투, chunk가 복합명사를 끊음(S19)",
}
changes = list(chg_pre["changes"])
for i, s in enumerate(S):
    for j, t in enumerate(s["sentences"]):
        b = PRE_S[i]["sentences"][j]
        fields = [f for f in ("en", "ko", "chunks", "words") if b[f] != t[f]]
        if fields:
            key = f"{i}.{j}"
            why = WHY_SENT.get(key)
            if not why:
                why = "쉬운 단어·쓰임이 안 맞는 태그를 정리(" + ",".join(fields) + ")"
            changes.append({"kind": "sentence", "situation": s["title"], "index": j, "fields": fields, "why": why})
WHY_WORD = {
    "w-transport": "운송은 화물에 쓰는 말 — 환자 이송에는 수송(W1)",
    "w-vital": "문장은 모두 vitals — 헤드워드를 맞춘다(W2)",
    "w-clear": "예문을 쓰임이 맞는 6.5 문장으로(W3)",
}
for w in doc["words"]:
    b = next((x for x in pre["words"] if x["id"] == w["id"]), None)
    fields = [f for f in ("en", "ko", "ipa", "icon", "example") if b[f] != w[f]]
    if fields:
        changes.append({"kind": "word", "id": w["id"], "fields": fields,
                        "why": WHY_WORD.get(w["id"], "바뀐 문장에 맞춰 예문을 옮긴다")})
for wid in removed:
    changes.append({"kind": "word-remove", "id": wid, "why": "4.3 문장을 처방 요청으로 고치면서 쓰이지 않게 됐다(S2)"})

with open(f"{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=1000)
with open(f"changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote; changes", len(changes), "(이전", len(chg_pre["changes"]), ")")
