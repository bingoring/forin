#!/usr/bin/env python3
"""목적지 의존 표식을 읽어 갈아 끼울 목록을 낸다.

표식만 달고 읽을 방법이 없으면 반쪽이다. 이 도구가 그 목록을 낸다 — 새 목적지를 붙일 때
"무엇을 다시 써야 하는가"에 답하는 것이 표식의 존재 이유다.

    python3 report_locale_binding.py                      # 현황 요약
    python3 report_locale_binding.py --axis payer          # 한 축만
    python3 report_locale_binding.py --dept GEN --list     # 부서별 목록
    python3 report_locale_binding.py --themes              # 주제 단위 밀도

설계는 `docs/dlc/projects/forin/02-construction/curriculum-v3-locale-binding/README.md`에 있다.
"""
from __future__ import annotations

import argparse
import collections
import pathlib

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1] / "nurse" / "topics"
AXES = ("triage", "escalation", "roles", "law", "payer", "licensure")


def load() -> list[dict]:
    out = []
    for path in sorted(ROOT.glob("*.yaml")):
        for s in yaml.safe_load(path.read_text()) or []:
            if isinstance(s, dict):
                s["_dept"] = path.stem.upper()
                out.append(s)
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--axis", choices=AXES)
    ap.add_argument("--dept")
    ap.add_argument("--list", action="store_true", help="상황 제목까지 낸다")
    ap.add_argument("--themes", action="store_true", help="주제 단위 밀도를 낸다")
    args = ap.parse_args()

    seeds = load()
    sel = [s for s in seeds if s.get("localeBound")]
    if args.axis:
        sel = [s for s in sel if args.axis in s["localeBound"]]
    if args.dept:
        sel = [s for s in sel if s["_dept"] == args.dept.upper()]

    print(f"전체 상황 {len(seeds)} / 표식 {len([s for s in seeds if s.get('localeBound')])} "
          f"({len([s for s in seeds if s.get('localeBound')])/len(seeds)*100:.1f}%)")
    if args.axis or args.dept:
        print(f"고른 것 {len(sel)}건")

    per_axis: collections.Counter = collections.Counter()
    for s in sel:
        for a in s["localeBound"]:
            per_axis[a] += 1
    print("축별:", dict(per_axis.most_common()))
    print("부서별:", dict(collections.Counter(s["_dept"] for s in sel).most_common()))

    if args.themes:
        # 주제 안에서 표식 비율이 높으면 주제째 다시 써야 한다는 신호다.
        total: collections.Counter = collections.Counter()
        marked: collections.Counter = collections.Counter()
        for s in seeds:
            total[s.get("theme")] += 1
            if s.get("localeBound"):
                marked[s.get("theme")] += 1
        rows = sorted(((marked[t] / total[t], marked[t], total[t], t) for t in marked),
                      reverse=True)
        print("\n주제 단위 밀도 (비율 높은 순, 상위 20):")
        print("  비율   표식/전체  주제")
        for ratio, m, n, t in rows[:20]:
            flag = "  ← 주제째 다시 쓸 후보" if ratio >= 0.5 else ""
            print(f"  {ratio*100:4.0f}%   {m:3d}/{n:3d}   {t}{flag}")

    if args.list:
        print()
        for s in sorted(sel, key=lambda x: (x["_dept"], x.get("theme", ""), x.get("title", ""))):
            print(f"  [{','.join(s['localeBound'])}] {s['_dept']} · {s.get('theme')} · {s.get('title')}")


if __name__ == "__main__":
    main()
