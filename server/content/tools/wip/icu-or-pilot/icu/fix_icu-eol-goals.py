#!/usr/bin/env python3
"""A·B 검토(fix-icu-eol-goals-A/B.md)와 Fable 판정(judge-icu-eol-goals-A/B.md)을 icu-eol-goals.yaml 하나에 반영한다.
데이터: fix_icu-eol-goals_data_1~4.yaml (문장·단어·뉘앙스/order·chunks/태그/why).
고치기 전 원본은 PRISTINE(스크래치패드)에서 읽으므로 몇 번을 돌려도 같은 결과다."""
import collections, copy, os, sys, yaml

D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-pilot/icu"
SCR = "/private/tmp/claude-501/-Users-ywyeom-private-forin/4f761496-057c-44fb-9edf-c2b06d77c247/scratchpad"
T = "icu-eol-goals"
P = f"{D}/{T}.yaml"
PC = f"{D}/changes-{T}.yaml"
PRISTINE = f"{SCR}/orig.yaml"
PRISTINE_C = f"{SCR}/orig_changes.yaml"


class Loader(yaml.SafeLoader):
    pass


def _construct(loader, node):
    out = {}
    for k, v in node.value:
        key = loader.construct_object(k, deep=True)
        val = loader.construct_object(v, deep=True)
        if key in out and isinstance(out[key], dict) and isinstance(val, dict):
            out[key].update(val)
        else:
            out[key] = val
    return out


Loader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _construct)


def load_data(n):
    return yaml.load(open(f"{D}/fix_{T}_data_{n}.yaml", encoding="utf-8"), Loader=Loader)


d = yaml.safe_load(open(PRISTINE, encoding="utf-8"))
orig = copy.deepcopy(d)
ch = yaml.safe_load(open(PRISTINE_C, encoding="utf-8"))
changes = ch["changes"]
W = {w["id"]: w for w in d["words"]}
SIT = d["situations"]
KP = set()

import json
seed = json.load(open(f"{D}/in-{T}.json", encoding="utf-8"))
for s in seed["situations"]:
    KP.update(s["keyPhrases"])

# ------------------------------------------------------------------ 데이터 합치기
sent_patch = collections.defaultdict(dict)
for n in (1, 4):
    for k, v in load_data(n)["sentences"].items():
        sent_patch[k].update(v)
word_patch = collections.defaultdict(dict)
for k, v in load_data(2)["words"].items():
    word_patch[k].update(v)
data3 = load_data(3)

# ------------------------------------------------------------------ 문장
en_map, ko_map = {}, {}   # 옛 en -> (새 en, 새 ko) / 옛 en -> (옛 ko, 새 ko)
for key, p in sorted(sent_patch.items(), key=lambda kv: tuple(map(int, kv[0].split(".")))):
    i, j = map(int, key.split("."))
    x = SIT[i]["sentences"][j]
    if "was" in p:
        assert x["en"] == p["was"], (key, x["en"])
    old_en, old_ko = x["en"], x["ko"]
    is_kp = old_en in KP
    for f in ("en", "chunks"):
        if f in p and is_kp:
            assert p[f] == x[f], f"keyPhrase {key} {f} 는 바꾸지 않는다"
    for f in ("en", "ko", "chunks", "words", "why", "decoy", "tag", "icon"):
        if f in p:
            x[f] = p[f]
    if "drop_words" in p:
        for w in p["drop_words"]:
            assert w in x["words"], (key, w)
            x["words"].remove(w)
    if "dKo" in p:
        assert len(p["dKo"]) == 2
        x["distractorsKo"] = p["dKo"]
    if "blank" in p:
        b = p["blank"]
        assert len(b["wrong"]) == 3
        x["blank"] = {"answer": b["answer"], "options": [{"en": o} for o in [b["answer"]] + list(b["wrong"])]}
    if x["en"] != old_en:
        en_map[old_en] = (x["en"], x["ko"])
    elif x["ko"] != old_ko:
        ko_map[old_en] = (old_ko, x["ko"])

# ------------------------------------------------------------------ 단어·뉘앙스의 example/exKo 동기화
def sync_example(obj, tag):
    ex = obj.get("example")
    if ex in en_map:
        obj["example"], obj["exKo"] = en_map[ex]
        return True
    if ex in ko_map and obj.get("exKo") == ko_map[ex][0]:
        obj["exKo"] = ko_map[ex][1]
        return True
    return False

synced = []
for w in d["words"]:
    if sync_example(w, w["id"]):
        synced.append(w["id"])
for s in SIT:
    for nu in s.get("nuance", []):
        if "example" in nu:
            sync_example(nu, "nuance")
print("exKo/example 동기화한 단어:", len(synced), synced)

# ------------------------------------------------------------------ 단어
def sent_by_key(k):
    i, j = map(int, k.split("."))
    return SIT[i]["sentences"][j]

for wid, p in word_patch.items():
    w = W[wid]
    for f, v in p.items():
        if f == "example_from":
            x = sent_by_key(v)
            w["example"], w["exKo"] = x["en"], x["ko"]
            continue
        assert f in w, (wid, f)
        w[f] = v
# w-happen: w-faster 와 달리 새 문장(7.5)에 happen 이 없으므로 예문을 7.6 으로
x = sent_by_key("7.6")
assert "happen" in x["en"]
W["w-happen"]["example"], W["w-happen"]["exKo"] = x["en"], x["ko"]

# ------------------------------------------------------------------ 뉘앙스
for e in data3["nuance"]:
    nu = SIT[e["sit"]]["nuance"][e["n"]]
    assert nu["kind"] == e["kind"], (e["sit"], e["n"], nu["kind"])
    for k, v in (e.get("set") or {}).items():
        nu[k] = v
    for k, v in (e.get("scene_en") or {}).items():
        nu["scenes"][k]["en"] = v
    for k, v in (e.get("scene_fix") or {}).items():
        nu["scenes"][k]["fix"] = v
    if "replace" in e:
        for k, v in e["replace"].items():
            nu[k] = v

# ------------------------------------------------------------------ order
for sit, p in data3["order"].items():
    o = SIT[sit]["order"]
    for idx, l in (p.get("lines") or {}).items():
        o["lines"][idx].update(l)
    for k in ("why", "ko"):
        if k in p:
            o[k] = p[k]

# ------------------------------------------------------------------ changes (v44 필드)
def add_change(c):
    changes.append(c)


def merge_sentence_change(title, index, fields, why):
    for c in changes:
        if c["kind"] == "sentence" and c["situation"] == title and c["index"] == index:
            for f in fields:
                if f not in c["fields"]:
                    c["fields"].append(f)
            c["why"] = c["why"] + " / " + why
            return
    add_change({"kind": "sentence", "situation": title, "index": index, "fields": list(fields), "why": why})


def merge_word_change(wid, fields, why):
    for c in changes:
        if c["kind"] == "word" and c["id"] == wid:
            for f in fields:
                if f not in c["fields"]:
                    c["fields"].append(f)
            c["why"] = c["why"] + " / " + why
            return
    add_change({"kind": "word", "id": wid, "fields": list(fields), "why": why})


SENT_WHY = {
    "8.3": "보장형 안심('She won't suffer')을 지킬 수 있는 약속으로 고침(검토 A S1)",
    "8.4": "'she won't feel that' 단정을 'expected + keep her comfortable'로 고침(검토 A S2)",
    "7.5": "환자 상태가 아니라 의료진이 정할 수 있는 단계의 속도만 약속하도록 고침(검토 A S3)",
    "15.5": "'I won't leave this room until…' 무조건 약속을 처치 중 곁에 있겠다는 말로 고침(검토 A S4)",
    "16.5": "부자연스러운 영어를 고침(검토 A S5)",
}
for i, s in enumerate(SIT):
    for j, x in enumerate(s["sentences"]):
        o = orig["situations"][i]["sentences"][j]
        fields = [f for f in ("en", "ko", "chunks", "words") if o[f] != x[f]]
        if fields:
            key = f"{i}.{j}"
            why = SENT_WHY.get(key)
            if not why:
                parts = []
                if "ko" in fields:
                    parts.append("ko 오역·어색한 번역 수정(검토)")
                if "chunks" in fields:
                    parts.append("chunks 구 경계 정리(검토)")
                if "words" in fields:
                    parts.append("뜻이 다른 자리에 붙은 태그를 뺌(결정 11)")
                why = " / ".join(parts) if parts else "검토 반영"
            merge_sentence_change(s["title"], j, fields, why)

WORD_WHY = {
    "w-best": "ko를 '가장 잘'에서 문장들(do our best·what's best)에 맞게 '최선·가장 좋은'으로(결정 11)",
    "w-choose": "ko '편들다'는 choose sides 라는 구의 뜻 — 헤드워드 뜻 '고르다'로(결정 11)",
    "w-once": "ko를 태그 문장(once helped·once meant)에 맞게 '한때'로, 예문도 같은 문장으로(결정 11)",
    "w-entire": "ko '온전한'이 the entire time 의 뜻과 어긋나 '꼬박·내내'로(결정 11)",
    "w-through": "ko '헤쳐서'가 with you through it·through every step 의 뜻과 어긋나 '거쳐서'로(결정 11)",
    "w-lack": "ko '없다'를 lack 의 뜻에 맞게 '결여하다'로(결정 11)",
    "w-rush": "문장이 명사(no rush)라 ko를 '서두름'으로(판정 A)",
    "w-clean": "문장에 형용사(keep her clean)와 동사(clean and dress)가 함께 있어 ko를 '깨끗한·씻다'로(판정 A)",
    "w-page": "헤드워드를 구(on the same page)로 — page 만으로는 '같은 내용'이라는 뜻이 안 나온다(결정 11)",
    "w-yourself": "헤드워드를 구(by yourself)로 — yourself 만으로는 '혼자서'가 안 나온다(결정 11)",
}
for w in d["words"]:
    o = {x["id"]: x for x in orig["words"]}[w["id"]]
    fields = [f for f in ("en", "ko", "ipa", "icon", "example") if o[f] != w[f]]
    if fields:
        why = WORD_WHY.get(w["id"]) or "예문이 바뀐 문장(검토 A S1~S5)을 따라 예문을 맞춤"
        merge_word_change(w["id"], fields, why)

# ------------------------------------------------------------------ 저장
yaml.safe_dump(d, open(P, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump(ch, open(PC, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("saved; changes:", len(changes))
