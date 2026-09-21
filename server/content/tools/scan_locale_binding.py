#!/usr/bin/env python3
"""목적지(미국) 제도에 기대는 상황 후보를 뽑는다.

설계는 `docs/dlc/projects/forin/02-construction/curriculum-v3-locale-binding/README.md`에 있다.
이 도구는 **판정하지 않는다.** 사람이나 검토자가 볼 후보와 근거를 낼 뿐이다. 키워드는 후보를
좁히는 수단이지 판정 기준이 아니다 — 제도를 언급하지 않으면서 제도를 전제하는 상황이 있고,
반대로 언급만 하고 제도와 무관한 상황도 있다.

    python3 scan_locale_binding.py --out /tmp/lb_candidates.tsv

오탐을 규칙에 박아 둔다. 처음 돌린 스캔이 이것들에 걸렸다.
  - `crrt`가 `rrt`에 걸린다. 신대체요법은 임상이고 신속대응팀은 제도다. 글자가 겹칠 뿐이다.
  - "연계"는 어디서나 쓴다. 전동·전과·의뢰 자체는 보편이라 신호가 아니다.
  - SBAR는 국제적으로 쓴다. 인계한다는 사실이 아니라 **누가 누구에게** 보고하는가가 제도다.
"""
from __future__ import annotations

import argparse
import collections
import glob
import pathlib
import re
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1] / "nurse"

# 축마다, 그 제도를 실제로 가리키는 말만 넣는다. 단어 경계를 강제해 부분 일치를 막는다.
# (`\b`는 한글에는 의미가 없으므로 한국어 신호는 그 자체로 충분히 특이한 말만 쓴다.)
AXES: dict[str, list[str]] = {
    "triage": [r"\bESI\b", r"\btriage level\b", r"\bacuity level\b", r"중증도 분류 단계"],
    "escalation": [r"\b911\b", r"\bcode blue\b", r"\brapid response\b", r"\bRRT\b",
                   r"신속대응팀", r"코드 블루"],
    "roles": [r"\bcharge nurse\b", r"\battending\b", r"\bnurse practitioner\b",
              r"\bhouse officer\b", r"\bLPN\b", r"\bCNA\b", r"수간호사", r"주치의 호출"],
    "law": [r"\bHIPAA\b", r"\badvance directive\b", r"\bPOLST\b", r"\bliving will\b",
            r"\bDNR order\b", r"사전연명의료", r"대리 의사결정자", r"대리 결정권자"],
    "payer": [r"\binsurance\b", r"\bMedicaid\b", r"\bMedicare\b", r"\bcase manager\b",
              r"\bsocial worker\b", r"\bcopay\b", r"\bdeductible\b", r"\buninsured\b",
              r"보험", r"무보험", r"사회복지사", r"본인부담"],
    "licensure": [r"\blicense renewal\b", r"\bcontinuing education\b", r"\bpayroll\b",
                  r"면허 갱신", r"급여 명세"],
}

# `\bRRT\b`는 CRRT를 걸러내지만 "CRRT"를 "C RRT"로 쓴 곳이 있으면 새므로, 임상 맥락이
# 확실한 말이 같은 줄에 있으면 그 매치는 버린다.
VETO = re.compile(r"CRRT|지속적\s*신대체|신대체요법|continuous renal replacement", re.I)

FIELDS = ("title", "tagline", "brief", "room")
LISTS = ("keyPhrases", "goals", "skills")


def blob(s: dict) -> str:
    parts = [str(s.get(f, "")) for f in FIELDS]
    for f in LISTS:
        parts.extend(str(x) for x in (s.get(f) or []))
    return " \n ".join(parts)


def scan(seed: dict) -> dict[str, list[str]]:
    text = blob(seed)
    found: dict[str, list[str]] = {}
    for axis, pats in AXES.items():
        ev = []
        for p in pats:
            for m in re.finditer(p, text, re.I):
                line = text[max(0, m.start() - 60):m.end() + 60]
                if axis == "escalation" and VETO.search(line):
                    continue  # CRRT가 RRT로 읽힌 자리
                ev.append(m.group(0))
        if ev:
            found[axis] = sorted(set(ev))
    return found


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", required=True)
    ap.add_argument("--dept", help="한 부서만 (예: GEN)")
    args = ap.parse_args()

    rows, per_axis, per_theme = [], collections.Counter(), collections.Counter()
    total = 0
    for path in sorted(glob.glob(str(ROOT / "topics" / "*.yaml"))):
        if args.dept and pathlib.Path(path).stem.upper() != args.dept.upper():
            continue
        for s in yaml.safe_load(open(path)) or []:
            if not isinstance(s, dict):
                continue
            total += 1
            hit = scan(s)
            if not hit:
                continue
            for a in hit:
                per_axis[a] += 1
            per_theme[s.get("theme")] += 1
            rows.append("\t".join([
                s.get("theme", ""), s.get("title", ""),
                ",".join(sorted(hit)),
                "; ".join(f"{a}:{'/'.join(v)}" for a, v in sorted(hit.items())),
                (s.get("brief") or "").replace("\t", " ").replace("\n", " ")[:120],
            ]))

    out = pathlib.Path(args.out)
    out.write_text("theme\ttitle\taxes\tevidence\tbrief\n" + "\n".join(rows) + "\n")
    print(f"{out} — 상황 {total} 중 후보 {len(rows)} ({len(rows)/max(total,1)*100:.1f}%)")
    print("축별:", dict(per_axis.most_common()))
    print("주제 상위 10:", per_theme.most_common(10))
    if not rows:
        sys.exit("후보가 없다 — 규칙이 너무 좁다")


if __name__ == "__main__":
    main()
