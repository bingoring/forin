import re, json, yaml, copy

def emit(s):
    try:
        if (not re.search(r"(: | #)|:$", s) and not re.match(r"^[-?:,\[\]{}#&*!|>'\"%@`]", s)
                and yaml.safe_load("- " + s) == [s]):
            return s
    except Exception:
        pass
    return json.dumps(s, ensure_ascii=False)

def ns(s):
    return len(re.sub(r"\s", "", s))

def len_ok(a, b):
    x, y = ns(a), ns(b)
    return max(x, y) <= 1.25 * min(x, y) or abs(x - y) <= 3

def apply(path, sent, words=None, blanks=None):
    """sent: list (per situation) of list of [a,b]; words: {id:{'ko':[..],'en':[..]}}; blanks: {(sit,idx):[o1,o2,o3]}"""
    words = words or {}; blanks = blanks or {}
    orig = yaml.safe_load(open(path, encoding="utf-8"))
    L = open(path, encoding="utf-8").read().split("\n")
    out = []
    i = 0
    n = len(L)
    # words section
    cur_word = None
    sit = -1; idx = -1
    in_sit = False
    cur_sent_stage = None
    while i < n:
        ln = L[i]
        m = re.match(r"^- id: (\S+)", ln)
        if m and not in_sit:
            cur_word = m.group(1)
        if ln.startswith("situations:"):
            in_sit = True; cur_word = None
        if in_sit:
            if re.match(r"^- title:", ln):
                sit += 1; idx = -1
            if re.match(r"^  - en:", ln):
                idx += 1
            if re.match(r"^    distractorsKo:", ln):
                new = sent[sit][idx]
                assert L[i+1].startswith("    - ") and L[i+2].startswith("    - ") and not L[i+3].startswith("    - "), (sit, idx)
                out.append(ln)
                out.append("    - " + emit(new[0])); out.append("    - " + emit(new[1]))
                i += 3; continue
            if (sit, idx) in blanks and re.match(r"^      options:", ln):
                opts = [L[i+1+k] for k in range(4)]
                assert all(o.startswith("      - en: ") for o in opts) and not L[i+5].startswith("      - "), (sit, idx)
                ans = None
                # find answer from preceding lines
                for back in range(1, 4):
                    mm = re.match(r"^      answer: (.*)$", L[i-back])
                    if mm: ans = yaml.safe_load("- " + mm.group(1))[0]; break
                assert ans is not None
                repl = iter(blanks[(sit, idx)])
                out.append(ln)
                for o in opts:
                    val = yaml.safe_load("- " + o[len("      - en: "):])[0]
                    if val == ans: out.append(o)
                    else: out.append("      - en: " + emit(next(repl)))
                i += 5; continue
        else:
            if cur_word in words:
                mm = re.match(r"^  distractors(Ko|En):\s*$", ln)
                if mm and mm.group(1).lower() in words[cur_word]:
                    new = words[cur_word][mm.group(1).lower()]
                    assert L[i+1].startswith("  - ") and L[i+2].startswith("  - ") and not L[i+3].startswith("  - ")
                    out.append(ln); out.append("  - " + emit(new[0])); out.append("  - " + emit(new[1]))
                    i += 3; continue
        out.append(ln); i += 1
    open(path, "w", encoding="utf-8").write("\n".join(out))
    new = yaml.safe_load(open(path, encoding="utf-8"))
    # diff check
    exp = copy.deepcopy(orig)
    for s, ss in zip(exp["situations"], sent):
        assert len(s["sentences"]) == len(ss)
        for x, (a, b) in zip(s["sentences"], ss): x["distractorsKo"] = [a, b]
    for w in exp["words"]:
        if w["id"] in words:
            if "ko" in words[w["id"]]: w["distractorsKo"] = list(words[w["id"]]["ko"])
            if "en" in words[w["id"]]: w["distractorsEn"] = list(words[w["id"]]["en"])
    for (si, xi), o in blanks.items():
        b = exp["situations"][si]["sentences"][xi]["blank"]
        it = iter(o)
        for opt in b["options"]:
            if opt["en"] != b["answer"]: opt["en"] = next(it)
    assert exp == new, "unexpected field difference"
    # report
    bad = 0
    print("situations:", len(sent), "sentences:", sum(len(x) for x in sent))
    for s, ss in zip(new["situations"], sent):
        print("##", s["title"])
        for j, (x, (a, b)) in enumerate(zip(s["sentences"], ss)):
            flag = ""
            for d in (a, b):
                if not len_ok(x["ko"], d): flag += " [LEN %d/%d]" % (ns(x["ko"]), ns(d))
                if d == x["ko"]: flag += " [SAME]"
            if a == b: flag += " [DUP]"
            if flag: bad += 1
            print(f"[{j}] {x['ko']} | {a} | {b}{flag}")
    print("length failures:", bad)
