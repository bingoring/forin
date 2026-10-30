#!/usr/bin/env python3
"""or-count A(단어·뉘앙스): base를 읽어 v45 단어 필드·nuance를 얹고 결정 11 정리(쉬운 단어 태그 빼기·헤드워드·ko)를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, os, yaml

T = "or-tourniquet"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []
bank = {w["id"]: w for w in doc["words"]}

# ---- 결정 11 (1) 너무 쉬운 단어 ----
REMOVE = {}
for x in "time now go know minute patient".split():
    REMOVE["w-"+x] = f"공통 쉬운 단어 목록({x})"
for x in "get make see let cannot ask need new every after".split():
    REMOVE["w-"+x] = f"목록 밖 판단({x})"
touched = {}
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE]
        if new != x["words"]:
            x["words"] = new
            touched[(s["title"], i)] = True
for wid in REMOVE:
    assert not any(wid in x["words"] for s in doc["situations"] for x in s["sentences"])
doc["words"] = [w for w in doc["words"] if w["id"] not in REMOVE]
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움 — {why}; 어느 문장도 태그하지 않게 됐다"})
bank = {w["id"]: w for w in doc["words"]}

# ---- (3) 단어 ko·헤드워드 ----
KO_EDITS = {
    "w-check": ("점검하다", "w-confirm과 ko(확인하다)가 같아 듣고 뜻 고르기에서 정답이 둘 — check는 살펴 점검하는 쪽"),
    "w-note": ("메모하다", "w-record·w-document와 ko(기록하다)가 같아 정답이 셋 — note는 짧게 메모"),
    "w-document": ("문서로 남기다", "w-record·w-note와 ko(기록하다)가 같아 정답이 셋 — document는 서류·차트에 문서로 남기는 쪽"),
    "w-damage": ("훼손", "w-injury와 ko(손상)가 같아 정답이 둘 — damage는 조직이 훼손된 것"),
    "w-underneath": ("바로 밑에", "w-below와 ko(아래에)가 같아 정답이 둘 — underneath는 바로 밑에 가려진 자리"),
    "w-below": ("아래쪽에", "w-underneath와 ko(아래에)가 같아 정답이 둘 — below는 기준 지점보다 더 아래쪽"),
    "w-call": ("소리 내어 알리다", "w-announce·w-flag·w-inform과 ko(알리다)가 같아 정답이 넷 — call은 소리 내어 알려 주는 쪽"),
    "w-announce": ("공지하다", "ko(알리다)가 call·flag·inform과 같아 정답이 넷 — announce는 모두에게 공지하는 쪽"),
    "w-flag": ("짚어 알리다", "ko(알리다)가 call·announce·inform과 같아 정답이 넷 — flag는 문제점을 짚어서 알리는 쪽"),
    "w-inform": ("알려 주다", "ko(알리다)가 call·announce·flag와 같아 정답이 넷 — inform은 모르는 사람에게 알려 주는 쪽"),
    "w-right": ("알맞은", "w-correct와 ko(맞는)가 같아 정답이 둘 — right는 크기·적절함에 알맞은 쪽"),
    "w-correct": ("정확한", "w-right와 ko(맞는)가 같아 정답이 둘 — correct는 틀림없이 정확한 쪽"),
    "w-alarm": ("알람", "w-alert와 ko(경보)가 같아 정답이 둘 — alarm은 정한 때 울리는 알람"),
    "w-alert": ("경고 알림", "w-alarm과 ko(경보)가 같고 w-reminder(알림)와도 겹쳐 정답이 둘 — alert는 주의를 끄는 경고 알림"),
    "w-max": ("최대의", "w-maximum과 ko(최대)가 같아 정답이 둘 — max는 형용사로 '최대의'(maximum은 최대치)"),
    "w-maximum": ("최대치", "w-max와 ko가 겹치지 않게 명사 '최대치'로"),
    "w-run": ("작동하다", "w-active와 ko(작동 중인)가 겹쳐 정답이 둘 — run은 돌아가며 작동하는 동작"),
    "w-active": ("켜져 있는", "w-run과 ko(작동)가 겹쳐 정답이 둘 — active는 켜져 활성인 상태"),
    "w-sit": ("놓이다", "'where the cuff will sit' — 위치하다보다 놓이다가 자연스럽다"),
    "w-pinch": ("끼이다", "w-tight(조이는)·w-compress와 겹쳐 정답이 둘 — 문장은 피부가 끼이는 뜻('isn't pinched')"),
    "w-field": ("수술 영역", "'필드'는 외래어 그대로라 뜻이 흐리다 — 수술 영역"),
    "w-block": ("(신경)차단", "블록은 외래어 그대로라 뜻이 흐리다 — 이중 커프 정맥 부위마취의 신경차단"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
HEAD = {  # 태그된 문장이 모두 분사형 형용사 → 그 모습으로 (id는 그대로)
    "w-congest": ("congested", "/kənˈdʒɛstɪd/", "울혈된"),
    "w-prolong": ("prolonged", "/prəˈlɔːŋd/", "장기간의"),
}
for wid, (en, ipa, ko) in HEAD.items():
    w = bank[wid]
    assert en in w["example"].lower() or any(en in x["en"].lower() for s in doc["situations"] for x in s["sentences"] if wid in x["words"]), wid
    w["en"], w["ipa"], w["ko"] = en, ipa, ko
    changes.append({"kind": "word", "id": wid, "fields": ["en", "ipa", "ko"], "why": f"태그된 문장이 모두 {en} 형태의 형용사로 쓰여 헤드워드를 그 모습으로"})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어 태그 정리"})

# ---- v45 단어 필드 ----
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
    # 조각으로 정답 철자 다시 만들기: 한 낱말 단어의 조각(정답 조각 + 오답 조각)으로 en을 만드는 다른 조합
    if len(v["chips"]) == 1 and len(v["chips"][0]) > 1:
        pool = list(v["chips"][0]) + list(v["decoyChips"])
        target = w["en"]
        import itertools
        n = len(v["chips"][0])
        for r in range(1, 5):
            for combo in itertools.permutations(range(len(pool)), r):
                if "".join(pool[j] for j in combo) == target and [pool[j] for j in combo] != list(v["chips"][0]):
                    print("ALT PATH", w["id"], [pool[j] for j in combo])

# ---- 뉘앙스 ----
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
        print(s["title"], "distinct words:", len(tagged))
        for q in s["nuance"]:
            off = [x for x in q.get("words", []) if x not in tagged]
            if off:
                print("V15 risk", s["title"], q["kind"], off)
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
