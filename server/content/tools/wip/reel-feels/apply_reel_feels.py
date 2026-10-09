"""er-reel-feels.yaml 의 감상 칩(feels)과 해설(why)을 topics/<부서>.yaml 의 릴에 끼워 넣는다 (스펙 2-9 §11-8).

시드 파일은 주석이 많아 통째로 다시 쓰지 않는다 — 릴의 `word:` 줄 바로 뒤에 `feels:`(와 why 가 없던 릴이면
`why:`) 줄만 더한다. (주제, 상황 제목, 단어)가 정확히 하나의 릴과 맞아야 하고, 이미 feels 가 있으면 멈춘다.

    python3 apply_reel_feels.py er
"""
import json
import re
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
dept = sys.argv[1]
SEED = HERE.parents[2] / "nurse" / "topics" / f"{dept}.yaml"
want = {(e["theme"], e["title"], e["word"]): e for e in yaml.safe_load((HERE / f"{dept}-reel-feels.yaml").read_text(encoding="utf-8"))}

lines = SEED.read_text(encoding="utf-8").split("\n")
out, done = [], set()
theme = title = None
i = 0
while i < len(lines):
    line = lines[i]
    if m := re.match(r"^- theme:\s*(\S+)", line):
        theme, title = m.group(1), None
    elif m := re.match(r"^  title:\s*(.+?)\s*$", line):
        title = m.group(1).strip('"')
    out.append(line)
    if re.match(r"^  - kind: reel\s*$", line):
        # 이 릴 블록(다음 `  - ` 항목이나 들여쓰기 2 이하 줄 전까지)을 훑어 word·feels·why 를 본다.
        j = i + 1
        while j < len(lines) and (lines[j].startswith("    ") or lines[j].strip() == ""):
            j += 1
        block = lines[i + 1:j]
        word = next((re.match(r"^    word:\s*(.+?)\s*$", b).group(1) for b in block if re.match(r"^    word:", b)), None)
        key = (theme, title, word)
        if key in want:
            if any(re.match(r"^    feels:", b) for b in block):
                sys.exit(f"{key}: already has feels")
            e = want[key]
            has_why = any(re.match(r"^    why:", b) for b in block)
            if not has_why and not e.get("why"):
                sys.exit(f"{key}: no why in the seed and none given")
            add = ["    feels: " + json.dumps(e["feels"], ensure_ascii=False)]
            if not has_why:
                add.append("    why: " + json.dumps(e["why"], ensure_ascii=False))
            for b in block:
                out.append(b)
                if re.match(r"^    word:", b):
                    out += add
            done.add(key)
            i = j
            continue
    i += 1

missing = set(want) - done
if missing:
    sys.exit(f"not found in the seed: {sorted(missing)}")
SEED.write_text("\n".join(out), encoding="utf-8")
print(f"{len(done)} reels written")
