#!/usr/bin/env python3
"""부서 시드를 주제별 입력 JSON으로 쪼갠다 — 저작 서브에이전트 1명당 1개.

    python3 split_theme_inputs.py <부서코드> <출력디렉터리>

저작에 필요한 것만 남긴다. difficulty·acuity·persona 는 대화 런타임이 쓰는 값이지
단어와 문장을 짜는 데 쓰이지 않으므로, 넘기면 저작자의 주의만 흩뜨린다.
"""
import json, os, sys, yaml

KEEP = ("title", "tagline", "room", "brief", "role", "skills", "keyPhrases", "goals")


def main(dept: str, outdir: str) -> int:
    here = os.path.dirname(os.path.abspath(__file__))
    seeds = yaml.safe_load(open(os.path.join(here, "..", "nurse", "topics", f"{dept}.yaml"), encoding="utf-8"))
    os.makedirs(outdir, exist_ok=True)

    by_theme: dict[str, list[dict]] = {}
    for s in seeds:
        by_theme.setdefault(s["theme"], []).append({k: s[k] for k in KEEP if k in s})

    for theme, sits in by_theme.items():
        path = os.path.join(outdir, f"in-{theme}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"theme": theme, "situations": sits}, f, ensure_ascii=False, indent=1)

    with open(os.path.join(outdir, "themes.txt"), "w", encoding="utf-8") as f:
        for theme, sits in by_theme.items():
            f.write(f"{theme}\t{len(sits)}\n")
    print(f"{dept}: 주제 {len(by_theme)}개 · 상황 {sum(len(v) for v in by_theme.values())}건 → {outdir}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1], sys.argv[2]))
