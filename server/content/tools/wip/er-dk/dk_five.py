import sys, os, re, yaml
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dk_common import apply, ns
def go(topic, S, W=None, B=None):
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"base-{topic}.yaml")
    d = yaml.safe_load(open(p, encoding="utf-8"))
    sent = []; missing = []; seen = set(); blanks = {}
    for si, s in enumerate(d["situations"]):
        row = []
        for xi, x in enumerate(s["sentences"]):
            if x["en"] not in S: missing.append(x["en"]); row.append(["", ""]); continue
            row.append(list(S[x["en"]])); seen.add(x["en"])
            if B and x["en"] in B: blanks[(si, xi)] = B[x["en"]]
        sent.append(row)
    assert not missing, missing
    assert not (set(S) - seen), set(S) - seen
    words = {}
    for k, v in (W or {}).items(): words[k] = {kk: vv for kk, vv in v.items()}
    apply(p, sent, words, blanks)
