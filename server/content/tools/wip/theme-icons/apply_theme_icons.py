"""theme-icons.yaml(주제키: 아이콘)을 nurse/themes.yaml 의 각 항목에 `icon:` 줄로 끼워 넣는다.

레지스트리는 섹션 주석이 많아 통째로 다시 쓰지 않는다 — 항목마다 `order:` 줄 바로 뒤에 한 줄만
더한다(없으면 항목의 마지막 키 줄 뒤). 이미 `icon:`이 있는 항목은 값만 바꾼다. 두 번 돌려도 같다.

    python3 apply_theme_icons.py            # 쓰기
    python3 apply_theme_icons.py --check    # 쓰지 않고 바뀔 줄 수만
"""
import re
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
REG = HERE.parents[2] / "nurse" / "themes.yaml"
icons = yaml.safe_load((HERE / "theme-icons.yaml").read_text(encoding="utf-8"))

lines = REG.read_text(encoding="utf-8").split("\n")
out, seen = [], set()
i = 0
while i < len(lines):
    m = re.match(r"^- key:\s*(\S+)\s*$", lines[i])
    if not m:
        out.append(lines[i])
        i += 1
        continue
    key = m.group(1)
    j = i + 1
    while j < len(lines) and lines[j].startswith("  ") and not lines[j].startswith("- "):
        j += 1
    body = [l for l in lines[i + 1:j] if not re.match(r"^\s+icon:", l)]
    if key not in icons:
        sys.exit(f"{key}: no icon in theme-icons.yaml")
    at = next((k for k, l in enumerate(body) if re.match(r"^\s+order:", l)), len(body) - 1)
    body.insert(at + 1, f"  icon: {icons[key]}")
    out += [lines[i]] + body
    seen.add(key)
    i = j

extra = set(icons) - seen
if extra:
    sys.exit(f"keys not in the registry: {sorted(extra)[:5]}")
new = "\n".join(out)
old = REG.read_text(encoding="utf-8")
changed = sum(1 for a, b in zip(old.split("\n"), new.split("\n")) if a != b) + abs(len(new.split("\n")) - len(old.split("\n")))
if "--check" in sys.argv:
    print(f"{len(seen)} themes, ~{changed} lines would change")
else:
    REG.write_text(new, encoding="utf-8")
    print(f"{len(seen)} themes written")
