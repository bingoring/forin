#!/usr/bin/env python3
"""icu-weaning-extubation A — 단어 v45 필드 + 뉘앙스를 base에 얹어 .A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy
T = "icu-weaning-extubation"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-pilot/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# 결정 11 — 단어만. (id → 바꿀 값)
FIX = {
  "w-watch": dict(en="watch", ipa="/wɑːtʃ/"),
  "w-deflate": dict(en="deflate", ipa="/dɪˈfleɪt/"),
  "w-deteriorate": dict(en="deteriorate", ipa="/dɪˈtɪriəˌreɪt/"),
  "w-fail": dict(en="fail", ipa="/feɪl/", ko="실패하다"),
  "w-seal": dict(en="seal", ipa="/siːl/", ko="밀폐(밀착)"),
  "w-increase": dict(en="increase", ipa="/ɪnˈkriːs/", ko="늘리다"),
  "w-cause": dict(en="cause", ipa="/kɔːz/", ko="일으키다"),
  "w-spike": dict(en="spike", ipa="/spaɪk/"),
  "w-reorient": dict(en="reorient", ipa="/riˈɔːriˌɛnt/"),
  "w-obstruct": dict(en="obstruct", ipa="/əbˈstrʌkt/"),
  "w-delay": dict(en="delay", ipa="/dɪˈleɪ/", ko="지연"),
  "w-comeoff": dict(ko="(기계를) 떼다"),
  "w-vent": dict(ko="벤트(구어)"),
  "w-calm": dict(ko="차분한·가라앉히다"),
  "w-clear": dict(ko="맑은·없애다"),
  "w-support": dict(ko="보조(지지)"),
}
WHY = {
  "w-watch": "활용형(watching)을 원형으로 — 문장은 watch·watching 둘 다 쓴다",
  "w-deflate": "활용형(deflating)을 원형으로",
  "w-deteriorate": "활용형(deteriorating)을 원형으로",
  "w-fail": "활용형(failing)을 원형으로, ko도 원형에 맞춤 — 문장은 fail·failed·failing을 섞어 쓴다",
  "w-seal": "활용형(sealing)을 원형으로 — 문장은 sealing(형용)과 the seal(명사)이라 ko를 '밀폐(밀착)'로",
  "w-increase": "활용형(increasing)을 원형으로, ko도 원형에 맞춤",
  "w-cause": "활용형(causing)을 원형으로, ko도 원형에 맞춤",
  "w-spike": "활용형(spiked)을 원형으로",
  "w-reorient": "활용형(reorienting)을 원형으로",
  "w-obstruct": "활용형(obstructs)을 원형으로",
  "w-delay": "문장 3개 중 2개가 명사(the delay·without delay)라 형용 헤드워드(delayed/지연된)를 명사 원형으로",
  "w-comeoff": "ko '이탈하다'가 w-wean과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — '(기계를) 떼다'로 가름",
  "w-vent": "ko가 w-ventilator와 같아 정답이 둘이 된다 — 구어 줄임말임을 드러내 가름",
  "w-calm": "ko '진정시키다'가 w-sedation(진정)과 겹치고 형용사 용법(calm and quiet·calmer)을 못 담는다",
  "w-clear": "문장 5개 중 3개가 동사(clear his secretions·the material·doesn't clear)라 형용사 ko만으로는 모자라다",
  "w-support": "ko '지지'는 인공호흡 맥락(full support·more support)의 '보조'를 못 담는다",
}

words = copy.deepcopy(base["words"])
ids = {w["id"] for w in words}
assert set(FIX) <= ids, set(FIX) - ids
sent_by_en = {}
for s in base["situations"]:
    for x in s["sentences"]:
        sent_by_en.setdefault(x["en"], x["ko"])

data = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        wid = "w-" + e["w"]
        assert wid not in data, wid
        data[wid] = e
assert set(data) == ids, (sorted(ids - set(data)), sorted(set(data) - ids))

for w in words:
    for k, v in FIX.get(w["id"], {}).items():
        w[k] = v
    e = data[w["id"]]
    ex = w["example"]
    assert ex in sent_by_en, ex
    w["exKo"] = sent_by_en[ex]
    w["cue"] = e["cue"]
    w["tag"] = e["tag"]
    w["distractorsEn"] = list(e["dEn"])
    w["distractorsKo"] = list(e["dKo"])
    w["chips"] = [list(c) for c in e["chips"]]
    w["decoyChips"] = list(e["decoy"])

out = copy.deepcopy(base)
out["words"] = words

# 뉘앙스
nu = {}
for f in sorted(glob.glob(f"{D}/add_{T}_A_nuance_*.yaml")):
    for e in yaml.safe_load(open(f, encoding="utf-8")):
        assert e["situation"] not in nu, e["situation"]
        nu[e["situation"]] = e["items"]
titles = [s["title"] for s in out["situations"]]
assert set(nu) <= set(titles), set(nu) - set(titles)
for s in out["situations"]:
    if s["title"] in nu:
        s["nuance"] = nu[s["title"]]
if "--words-only" not in sys.argv and set(nu) != set(titles):
    print("뉘앙스 빠진 상황:", [t for t in titles if t not in nu])

with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)

changes = []
for wid, fx in FIX.items():
    changes.append({"kind": "word", "id": wid, "fields": list(fx), "why": WHY[wid]})
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "changes", len(changes))
