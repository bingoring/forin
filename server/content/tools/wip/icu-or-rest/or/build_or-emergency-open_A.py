#!/usr/bin/env python3
"""or-emergency-open A(단어·뉘앙스): base에 v45 단어 필드·nuance를 얹고 결정 11 정리를 한다. 문장 en·ko는 건드리지 않는다."""
import copy, glob, io, itertools, os, yaml

T = "or-emergency-open"
D = os.path.dirname(os.path.abspath(__file__))
doc = copy.deepcopy(yaml.safe_load(io.open(f"{D}/base-{T}.yaml", encoding="utf-8")))
changes = []

LIST = "room minute go now come hand baby".split()
JUDGE = "two here when big both want done yet first out".split()
REMOVE = {}
for x in LIST:
    REMOVE["w-" + x] = f"공통 쉬운 단어 목록({x})"
for x in JUDGE:
    REMOVE["w-" + x] = f"너무 쉬움 — 목록 밖 판단({x})"
MERGED = {"w-over": "take over를 한 구(w-take)로 합침 — over는 따로 가르칠 값이 없다"}

UNTAG = {
    "I'll run the code timing and call it out.": [("w-run", "'진행하다(주관하다)' 뜻이라 누적되는 카드와 맞지 않음"), ("w-call", "call out(소리 내어 말하다)이라 요청하다 카드와 맞지 않음")],
    "I'll call out totals as we transfuse.": [("w-call", "call out(소리 내어 말하다)이라 요청하다 카드와 맞지 않음")],
    "We'll do a full reconciliation before closing.": [("w-full", "'전체의' 뜻이라 가득 찬 카드와 맞지 않음")],
    "Watch your hands — I'll guide you in.": [("w-watch", "'조심하다' 뜻이라 지켜보다 카드와 맞지 않음")],
    "Baby's on the warmer — starting resuscitation.": [("w-on", "'~ 위에' 뜻이라 켜진 카드와 맞지 않음")],
    "Tube and blade are set on your right.": [("w-on", "'~ 쪽에' 뜻이라 켜진 카드와 맞지 않음")],
    "You take the airway, I'll manage the transfusion.": [("w-take", "'맡다' 뜻이라 인계받다 카드와 맞지 않음")],
}
touched = {}
for s in doc["situations"]:
    for i, x in enumerate(s["sentences"]):
        new = [w for w in x["words"] if w not in REMOVE and w not in MERGED]
        for wid, _ in UNTAG.get(x["en"], []):
            if wid in new:
                new.remove(wid)
        if new != x["words"]:
            x["words"] = new
            touched[(s["title"], i)] = True
            assert new, (s["title"], i, x["en"])
for wid in list(REMOVE) + list(MERGED):
    assert not any(wid in x["words"] for s in doc["situations"] for x in s["sentences"]), wid
doc["words"] = [w for w in doc["words"] if w["id"] not in REMOVE and w["id"] not in MERGED]
for wid, why in REMOVE.items():
    changes.append({"kind": "word-remove", "id": wid, "why": f"너무 쉬움 — {why}; 어느 문장도 태그하지 않게 됐다"})
for wid, why in MERGED.items():
    changes.append({"kind": "word-remove", "id": wid, "why": why})
bank = {w["id"]: w for w in doc["words"]}

# (en, ipa, ko, 이유) — 값이 None이면 안 바꿈
HEAD = {
    "w-sharp": ("sharps", "/ʃɑːrps/", "날카로운 기구", "수술실에서는 늘 복수 sharps — 문장도 sharps"),
    "w-way": ("on the way", "/ɑːn ðə weɪ/", "오는 중인", "문장은 on the way(곧 도착) — way(길)보다 구로"),
    "w-take": ("take over", "/ˌteɪk ˈoʊvər/", "인계받다", "문장이 take over — w-over를 합쳐 한 구로"),
    "w-back": ("come back", "/ˌkʌm ˈbæk/", "다시 돌아오다", "문장이 come back — w-come 삭제에 맞춰 구로"),
    "w-stand": ("stand by", "/ˈstænd baɪ/", "대기하다", "문장이 standing by — 구로"),
    "w-word": ("say the word", "/ˌseɪ ðə ˈwɜːrd/", "신호만 주다", "문장이 Say the word — word(말)가 아니라 구로"),
}
for wid, (en, ipa, ko, why) in HEAD.items():
    w = bank[wid]
    w["en"], w["ipa"], w["ko"] = en, ipa, ko
    changes.append({"kind": "word", "id": wid, "fields": ["en", "ipa", "ko"], "why": why})

KO_EDITS = {
    "w-bring": ("가져다주다", "w-grab과 ko(가져오다)가 같아 정답이 둘 — bring은 가져다주다"),
    "w-grab": ("집어 오다", "w-bring과 ko(가져오다)가 같아 정답이 둘 — grab은 급히 집어 오다"),
    "w-up": ("세팅이 끝난", "w-ready와 ko(준비된)가 같아 정답이 둘 — up은 펼쳐 세팅이 끝난"),
    "w-count": ("계수(하다)", "문장이 명사(count)와 동사(counted)로 함께 쓰여 계수(하다)로"),
    "w-unit": ("혈액 팩(단위)", "문장 ko가 '팩' — 혈액 한 팩이라는 뜻을 분명히"),
    "w-bleed": ("피가 나다", "w-hemorrhage(출혈)와 ko가 겹쳐 — bleed는 피가 나다"),
    "w-source": ("원인 부위(출처)", "bleeding source는 출혈이 나는 원인 부위"),
    "w-stage": ("순서대로 미리 놓다", "w-prepare(준비하다)·w-set(세팅하다)과 ko가 겹쳐 — stage는 쓸 순서대로 미리 놓아 두다"),
    "w-label": ("라벨을 붙이다", "ko가 너무 길어 보기 길이를 맞추기 어려워 — 뜻은 그대로 라벨을 붙이다"),
    "w-run": ("진행 중인", "run은 '누적되며 진행 중인(running count)' — 괄호 설명 줄임"),
    "w-document": ("문서화하다", "w-record(기록하다)와 ko가 같아 정답이 둘 — document는 문서화하다"),
    "w-cryo": ("동결침전제제", "크라이오는 cryoprecipitate의 줄임말 — 뜻은 동결침전제제"),
    "w-pace": ("진행 속도", "w-rate와 ko(속도)가 겹쳐 — pace는 진행 속도"),
    "w-rate": ("수치(율)", "w-pace와 ko(속도)가 겹쳐 — heart rate의 rate는 수치(율)"),
    "w-emergency": ("응급(상황)", "문장이 emergency setup처럼 형용사 자리에도 쓰여 응급(상황)으로"),
    "w-right": ("오른쪽", "오른쪽(바로)는 길이를 맞추기 어려워 — 문장은 on your right(오른쪽)"),
    "w-off": ("떨어져 나온", "off는 comes off(분리되어 나오다) — 뜻을 분명히"),
}
for wid, (ko, why) in KO_EDITS.items():
    bank[wid]["ko"] = ko
    changes.append({"kind": "word", "id": wid, "fields": ["ko"], "why": why})
for (title, i) in touched:
    changes.append({"kind": "sentence", "situation": title, "index": i, "fields": ["words"], "why": "쉬운 단어 태그 정리 / 헤드워드와 뜻이 다른 태그 빼기"})

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
    pool = [p for word in v["chips"] for p in word] + list(v["decoyChips"])
    target = w["en"].replace(" ", "")
    orig = [p for word in v["chips"] for p in word]
    for r in range(1, 7):
        for combo in itertools.permutations(range(len(pool)), r):
            if "".join(pool[j] for j in combo) == target and [pool[j] for j in combo] != orig:
                print("ALT PATH", w["id"], [pool[j] for j in combo])

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
