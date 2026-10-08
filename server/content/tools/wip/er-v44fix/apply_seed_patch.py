#!/usr/bin/env python3
"""seed-patch-*.yaml을 정본 topics/er.yaml 시드에 반영한다. old가 현재 값과 같아야 바꾼다. --check는 대조만."""
import json, sys, pathlib, yaml
here = pathlib.Path(__file__).resolve().parent
er = here.parents[2] / "nurse/topics/er.yaml"
files = [pathlib.Path(a) for a in sys.argv[1:] if not a.startswith("--")] or sorted(here.glob("seed-patch-*.yaml"))
lines = er.read_text().split("\n")
starts = [i for i, l in enumerate(lines) if l.startswith("- theme: ")]
def block(theme, title):
    for k, s in enumerate(starts):
        e = starts[k + 1] if k + 1 < len(starts) else len(lines)
        if lines[s] == f"- theme: {theme}" and lines[s + 1].startswith("  title: "):
            if yaml.safe_load(lines[s + 1][2:])["title"] == title:
                return s, e
    raise SystemExit(f"!! no seed {theme} / {title}")
def dump(v):
    if isinstance(v, dict):
        return "{ " + ", ".join(f"{k}: {json.dumps(x, ensure_ascii=False)}" for k, x in v.items()) + " }"
    return json.dumps(v, ensure_ascii=False)
bad = n = 0
for f in files:
    for p in yaml.safe_load(f.read_text()) or []:
        s, e = block(p["theme"], p["title"])
        cur = (yaml.safe_load("\n".join(lines[s:e])) or [{}])[0].get(p["field"])
        if cur != p["old"]:
            print(f"!! {p['theme']}/{p['title']}/{p['field']}: old mismatch\n   cur={cur!r}\n   old={p['old']!r}"); bad += 1; continue
        i = next(j for j in range(s, e) if lines[j].startswith(f"  {p['field']}:"))
        j = i + 1
        while j < e and lines[j].startswith("    "): j += 1
        if isinstance(p["new"], list):
            new = [f"  {p['field']}:"] + [f"    - {dump(x)}" for x in p["new"]]
        else:
            new = [f"  {p['field']}: {dump(p['new'])}"]
        lines[i:j] = new; n += 1
        starts = [k for k, l in enumerate(lines) if l.startswith("- theme: ")]
if "--check" in sys.argv or bad:
    print(f"patches ok {n}, bad {bad}"); sys.exit(1 if bad else 0)
er.write_text("\n".join(lines)); yaml.safe_load(er.read_text()); print(f"applied {n}")
