#!/usr/bin/env python3
"""keyphrases.tsv(주제\t옛\t새)를 정본 topics/er.yaml의 keyPhrases 줄에 반영한다. --check는 찾기만."""
import json, sys, pathlib
root = pathlib.Path(__file__).resolve().parents[3]
er = root / "nurse/topics/er.yaml"
rows = [l.rstrip("\n").split("\t") for l in open(pathlib.Path(__file__).with_name("keyphrases.tsv")) if l.strip()]
only = [a for a in sys.argv[1:] if not a.startswith("--")]
if only: rows = [r for r in rows if r[0] in only]
lines = er.read_text().split("\n")
bad = 0
for theme, old, new in rows:
    pat = "    - " + json.dumps(old, ensure_ascii=False)
    hits = [i for i, l in enumerate(lines) if l == pat]
    if len(hits) != 1:
        print(f"!! {theme}: {len(hits)} hits: {old}"); bad += 1; continue
    lines[hits[0]] = "    - " + json.dumps(new, ensure_ascii=False)
if "--check" in sys.argv or bad:
    print(f"rows {len(rows)}, bad {bad}"); sys.exit(1 if bad else 0)
er.write_text("\n".join(lines)); print(f"applied {len(rows)}")
