#!/usr/bin/env python3
"""판정 결과를 seed YAML의 `localeBound` 필드로 반영한다.

설계는 `docs/dlc/projects/forin/02-construction/curriculum-v3-locale-binding/README.md`에 있다.
표식은 **저작 시점의 메타데이터**다. DB에도 API에도 계약에도 넣지 않는다 — 런타임이 읽을 일이
없는 것에 마이그레이션 비용을 치를 이유가 없다.

    python3 apply_locale_binding.py --in /tmp/lb_out_*.tsv            # 미리보기
    python3 apply_locale_binding.py --in /tmp/lb_out_*.tsv --write    # 반영

입력 TSV는 `theme`·`title`·`axes` 세 열이고 헤더 한 줄로 시작한다. `axes`가 비면 표식을 달지
않는다는 뜻이다(스캔이 걸었으나 판정에서 뺀 것).

**YAML을 다시 덤프하지 않는다.** 줄 단위로 필드를 끼워 넣는다. `yaml.dump`는 따옴표·줄바꿈·
키 순서를 제 방식대로 다시 쓰기 때문에, 표식 하나를 더하려고 2만 줄짜리 저작 파일의 서식을
통째로 바꾸게 된다. 그 diff는 읽을 수 없고, 읽을 수 없는 diff는 검토할 수 없다.
"""
from __future__ import annotations

import argparse
import collections
import glob
import pathlib
import re
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1] / "nurse" / "topics"

# 코드 쪽 허용 집합. DB 제약이 아니라 여기서 검증한다(이 저장소의 확립된 방침).
AXES = ("triage", "escalation", "roles", "law", "payer", "licensure")


def read_decisions(patterns: list[str]) -> dict[tuple[str, str], list[str]]:
    out: dict[tuple[str, str], list[str]] = {}
    seen: set[tuple[str, str]] = set()
    for pat in patterns:
        for path in sorted(glob.glob(pat)):
            p = pathlib.Path(path)
            for n, line in enumerate(p.read_text().splitlines()[1:], start=2):
                if not line.strip():
                    continue
                cols = line.split("\t")
                if len(cols) != 3:
                    sys.exit(f"{p}:{n}: 열이 {len(cols)}개다 (3개여야 한다)")
                theme, title, axes = (c.strip() for c in cols)
                key = (theme, title)
                if key in seen:
                    sys.exit(f"{p}:{n}: 같은 상황이 두 번 판정됐다 — {theme} / {title}")
                seen.add(key)
                if not axes:
                    continue
                vals = [a.strip() for a in axes.split(",") if a.strip()]
                bad = [a for a in vals if a not in AXES]
                if bad:
                    sys.exit(f"{p}:{n}: 허용되지 않은 축 {bad} — 허용은 {AXES}")
                out[key] = sorted(set(vals))
    return out


def apply_file(path: pathlib.Path, want: dict[tuple[str, str], list[str]], write: bool) -> tuple[int, int]:
    """파일 한 개에 표식을 끼워 넣는다. (반영 수, 이미 있던 수)를 낸다."""
    lines = path.read_text().splitlines(keepends=True)
    seeds = yaml.safe_load("".join(lines)) or []

    # 각 상황의 `theme:` 줄 번호를 찾는다. 항목은 `- theme: <key>`로 시작한다.
    starts = [i for i, l in enumerate(lines) if re.match(r"^- theme:\s*\S", l)]
    if len(starts) != len(seeds):
        sys.exit(f"{path}: 항목 {len(seeds)}개인데 시작 줄이 {len(starts)}개다 — 서식이 예상과 다르다")

    edits: list[tuple[int, str]] = []
    done = already = 0
    for idx, seed in enumerate(seeds):
        key = (seed.get("theme"), seed.get("title"))
        axes = want.get(key)
        if not axes:
            continue
        if seed.get("localeBound"):
            already += 1
            continue
        # `theme:` 바로 다음 줄에 끼운다 — 항목의 맨 앞이라 어디에 붙었는지 한눈에 보인다.
        edits.append((starts[idx] + 1, f"  localeBound: [{', '.join(axes)}]\n"))
        done += 1

    if write and edits:
        for at, text in sorted(edits, reverse=True):
            lines.insert(at, text)
        path.write_text("".join(lines))
    return done, already


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--in", dest="inputs", nargs="+", required=True)
    ap.add_argument("--write", action="store_true", help="없으면 미리보기만 한다")
    args = ap.parse_args()

    want = read_decisions(args.inputs)
    print(f"판정된 표식 {len(want)}건")

    total = already = 0
    per_dept: collections.Counter = collections.Counter()
    per_axis: collections.Counter = collections.Counter()
    for path in sorted(ROOT.glob("*.yaml")):
        done, dup = apply_file(path, want, args.write)
        total += done
        already += dup
        if done:
            per_dept[path.stem.upper()] += done
    for axes in want.values():
        for a in axes:
            per_axis[a] += 1

    print(f"{'반영' if args.write else '반영 예정'} {total}건" + (f" / 이미 있던 것 {already}건" if already else ""))
    print("축별:", dict(per_axis.most_common()))
    print("부서별:", dict(per_dept.most_common(10)))
    if total != len(want) - already:
        # 판정된 상황을 YAML에서 못 찾았다는 뜻이다. 조용히 넘기면 표식이 빠진 채로 끝난다.
        sys.exit(f"판정 {len(want)}건 중 {total + already}건만 찾았다 — theme/title이 어긋난 것이 있다")
    if not args.write:
        print("\n미리보기다. 반영하려면 --write를 붙인다.")


if __name__ == "__main__":
    main()
