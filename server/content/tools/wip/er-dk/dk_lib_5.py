"""dk 스크립트 공용(주제 5개 작업용): 사전 적용·길이 검사·표 출력."""
import re, yaml

def nspace(s): return len(re.sub(r"\s", "", s))
def tell(a, o):
    x, y = nspace(a), nspace(o)
    return bool(x and y) and max(x, y) / min(x, y) > 1.25 and abs(x - y) > 3

def run(path, sent, words=None, blanks=None):
    """sent: 문장 en -> [오답1, 오답2]; words: id -> {distractorsKo/En: [..]}; blanks: 문장 en -> [오답3개]"""
    d = yaml.safe_load(open(path))
    words, blanks = words or {}, blanks or {}
    seen_en, used = set(), set()
    problems = []
    for s in d["situations"]:
        for x in s["sentences"]:
            if x["en"] in seen_en: problems.append("dup en " + x["en"])
            seen_en.add(x["en"])
            if x["en"] not in sent: problems.append("missing " + x["en"]); continue
            used.add(x["en"])
            a = sent[x["en"]]
            if len(a) != 2 or a[0] == a[1]: problems.append("bad pair " + x["en"])
            for o in a:
                if o == x["ko"]: problems.append("same as answer " + x["en"])
                if o in used_opts: problems.append("repeat opt " + o)
                used_opts.add(o)
                if tell(x["ko"], o): problems.append(f"V20 {x['ko']} | {o}")
            x["distractorsKo"] = list(a)
            if x["en"] in blanks:
                b = x["blank"]; ans = b["answer"]
                it = iter(blanks[x["en"]])
                for o in b["options"]:  # 정답 위치 유지, 오답 자리만 교체
                    if o["en"] != ans: o["en"] = next(it)
                if len(set(o["en"] for o in b["options"])) != len(b["options"]): problems.append("dup blank " + x["en"])
    extra = set(sent) - used
    if extra: problems.append(f"unknown keys {extra}")
    for w in d["words"]:
        if w["id"] in words:
            for k, v in words[w["id"]].items(): w[k] = v
    out = yaml.dump(d, allow_unicode=True, sort_keys=False, width=10**6)
    open(path, "w").write(out)
    for s in d["situations"]:
        print("##", s["title"])
        for i, x in enumerate(s["sentences"]):
            print(f"{i} {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}")
    print("PROBLEMS:", *problems, sep="\n  ")
used_opts = set()
