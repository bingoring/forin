#!/usr/bin/env python3
"""icu-hemodynamics A — 결정 11 정리 + 단어 v45 필드 + 뉘앙스를 base에 얹어 .A.yaml과 changes를 쓴다."""
import glob, yaml, sys, copy
T = "icu-hemodynamics"
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
base = yaml.safe_load(open(f"{D}/base-{T}.yaml", encoding="utf-8"))

# 결정 11 — 단어 값 고치기 (id → 바꿀 값)
FIX = {
  "w-close": dict(en="closely", ipa="/ˈkloʊsli/", ko="자세히"),
  "w-check": dict(ko="점검하다"),
  "w-chart": dict(ko="차트에 기록하다"),
  "w-document": dict(ko="문서로 남기다"),
  "w-raise": dict(ko="올리다"),
  "w-elevate": dict(ko="높이 들다"),
  "w-injury": dict(ko="부상"),
  "w-damage": dict(ko="손상"),
  "w-hurt": dict(ko="아프게 하다, 해치다"),
  "w-heal": dict(ko="치유되다"),
  "w-hand": dict(ko="손, 일손"),
  "w-true": dict(ko="실제의, 참인"),
  "w-rate": dict(ko="속도, 횟수"),
}
FIXWHY = {
  "w-close": "문장 4개가 모두 부사 closely(watching … closely) — 형용사 헤드워드를 부사로, ko도 '자세히'로",
  "w-check": "ko '확인하다'가 w-confirm과 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — '점검하다'로 가름",
  "w-chart": "ko '기록하다'가 w-document와 같아 정답이 둘이 된다 — '차트에 기록하다'로 가름",
  "w-document": "ko '기록하다'가 w-chart와 같아 정답이 둘이 된다 — '문서로 남기다'로 가름",
  "w-raise": "ko '들어올리다'가 w-elevate와 같아 정답이 둘이 된다 — '올리다'로 가름",
  "w-elevate": "ko '들어올리다'가 w-raise와 같아 정답이 둘이 된다 — 팔을 심장보다 높이 두는 '높이 들다'로 가름",
  "w-injury": "ko '손상'이 w-damage와 같아 정답이 둘이 된다 — injury는 '부상'으로 가름",
  "w-damage": "ko '손상'이 w-injury와 같아 정답이 둘이 된다 — damage 쪽에 '손상'을 남김",
  "w-hurt": "문장 2개 중 하나는 'can hurt her organs'(해치다)라 ko '아프다'만으로는 모자라다",
  "w-true": "ko '정확한, 참인'의 '정확한'이 w-accurate와 같아 정답이 둘이 된다 — '실제의, 참인'으로 가름",
  "w-rate": "ko '속도, 수치'의 '수치'가 w-number와 같아 정답이 둘이 된다 — '속도, 횟수'(heart rate)로 가름",
  "w-hand": "문장 'extra hands'(일손)는 구의 값이 있어 은행에 남기고 ko에 '일손'을 더함 — 목록의 쉬운 단어지만 태그를 빼면 그 문장이 빈다",
  "w-heal": "ko '낫다, 회복하다'의 '회복하다'가 w-recover와 같아 정답이 둘이 된다 — '치유되다'로 가름",
}
# 쉬운 단어(공통 목록 6 + 판단 6) — 어느 문장도 태그하지 않게 하고 은행에서 지운다
REMOVE = {
  "w-hour": "공통 쉬운 단어 목록", "w-minute": "공통 쉬운 단어 목록", "w-time": "공통 쉬운 단어 목록",
  "w-now": "공통 쉬운 단어 목록", "w-family": "공통 쉬운 단어 목록",
  "w-arm": "간호사가 이미 아는 신체 부위 — 목록 밖 판단", "w-leg": "간호사가 이미 아는 신체 부위 — 목록 밖 판단",
  "w-heart": "간호사가 이미 아는 신체 부위 — 목록 밖 판단", "w-chest": "간호사가 이미 아는 신체 부위 — 목록 밖 판단",
  "w-red": "너무 쉬운 색 이름 — 목록 밖 판단", "w-old": "너무 쉬운 말 — 목록 밖 판단",
}

words = copy.deepcopy(base["words"])
ids = {w["id"] for w in words}
assert set(FIX) <= ids and set(REMOVE) <= ids
sent_by_en = {}
for s in base["situations"]:
    for x in s["sentences"]:
        sent_by_en.setdefault(x["en"], x["ko"])

out = copy.deepcopy(base)
sent_changes = []
for s in out["situations"]:
    for i, x in enumerate(s["sentences"]):
        nw = [w for w in x["words"] if w not in REMOVE]
        if nw != x["words"]:
            x["words"] = nw
            sent_changes.append({"kind": "sentence", "situation": s["title"], "index": i, "fields": ["words"],
                                 "why": "쉬운 단어 태그 빼기 (" + ", ".join(w for w in base_w if w in REMOVE) + ")"
                                 if False else "쉬운 단어 태그 빼기"})
        # 태그 비는 문장이 있는지 알려 준다
        if not x["words"]:
            print("태그 빈 문장:", s["title"], i, x["en"])
words = [w for w in words if w["id"] not in REMOVE]
for w in words:
    for k, v in FIX.get(w["id"], {}).items():
        w[k] = v

if glob.glob(f"{D}/add_{T}_A_words_*.yaml"):
    data = {}
    for f in sorted(glob.glob(f"{D}/add_{T}_A_words_*.yaml")):
        for e in yaml.safe_load(open(f, encoding="utf-8")):
            wid = "w-" + str(e["w"])
            assert wid not in data, wid
            data[wid] = e
    have = {w["id"] for w in words}
    assert set(data) == have, (sorted(have - set(data)), sorted(set(data) - have))
    for w in words:
        e = data[w["id"]]
        ex = w["example"]
        assert ex in sent_by_en, ex
        w["exKo"] = sent_by_en[ex]
        w["cue"] = e["cue"]
        w["tag"] = e["tag"]
        w["distractorsEn"] = [str(x) for x in e["dEn"]]
        w["distractorsKo"] = [str(x) for x in e["dKo"]]
        w["chips"] = [[str(c) for c in ch] for ch in e["chips"]]
        w["decoyChips"] = [str(x) for x in e["decoy"]]
out["words"] = words

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
miss = [t for t in titles if t not in nu]
if miss and nu:
    print("뉘앙스 빠진 상황:", miss)

with open(f"{D}/{T}.A.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)

changes = []
for wid, fx in FIX.items():
    changes.append({"kind": "word", "id": wid, "fields": list(fx), "why": FIXWHY[wid]})
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": why + " — 어느 문장도 태그하지 않게 됐다"})
changes += sent_changes
with open(f"{D}/changes-{T}.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump({"theme": T, "changes": changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print("words", len(words), "changes", len(changes), "sentence rows", len(sent_changes))
