#!/usr/bin/env python3
"""번역 TSV를 서버 i18n 카탈로그(Go)로 조립한다.

번역은 나눠서 만들고 코드는 한 번에 만든다. 묶음마다 Go 파일을 따로 쓰면 같은 파일을
여럿이 건드리게 되고, 그 충돌은 번역 품질과 아무 상관이 없는 비용이다.

    python3 assemble_locale_catalog.py theme \
        --in /tmp/theme_out_1.tsv /tmp/theme_out_2.tsv /tmp/theme_out_3.tsv \
        --expect /tmp/theme_keys.tsv

입력 TSV는 `key`·`ja`·`de` 세 열이고 헤더 한 줄로 시작한다. `--expect`를 주면 그 파일의
`key` 열과 집합이 정확히 같은지 확인하고, 다르면 **아무것도 쓰지 않고 멈춘다** — 빠진 번역은
화면에서 조용히 한국어로 나가기 때문에, 파일을 쓴 뒤에 알아차리기 어렵다.
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys

HANGUL = re.compile(r"[가-힣]")

HEADER = '''package i18n

// {loc_name} names for the {what}.
//
// 생성물이다. 손으로 고치지 말고 {tool}로 다시 만든다.
// 번역 원본은 저작 한국어와 영어 카탈로그이며, 여기 없는 키는 저작 한국어로 떨어진다 —
// 화면이 비는 것이 아니라 폴백이 설계대로 도는 것이다.
//
// 학습자의 모국어가 {loc_name}인 것이지 목적지가 바뀐 것이 아니다. 여기 담긴 이름은
// **미국 병원의** 그 주제를 {loc_name}로 부르는 이름이다.
func init() {{
	register("{loc}", map[string]string{{
'''

FOOTER = "\t})\n}\n"

LOC_NAME = {"ja": "Japanese", "de": "German"}


def read_rows(paths: list[pathlib.Path]) -> dict[str, tuple[str, str]]:
    rows: dict[str, tuple[str, str]] = {}
    for p in paths:
        lines = p.read_text().splitlines()
        if not lines:
            sys.exit(f"{p}: 비어 있다")
        for n, line in enumerate(lines[1:], start=2):
            if not line.strip():
                continue
            parts = line.split("\t")
            if len(parts) != 3:
                sys.exit(f"{p}:{n}: 열이 {len(parts)}개다 (3개여야 한다)")
            key, ja, de = (x.strip() for x in parts)
            if key in rows:
                sys.exit(f"{p}:{n}: 키가 겹친다 — {key}")
            for loc, v in (("ja", ja), ("de", de)):
                if not v:
                    sys.exit(f"{p}:{n}: {loc} 값이 비었다 — {key}")
                if HANGUL.search(v):
                    sys.exit(f"{p}:{n}: {loc} 값에 한글이 남았다 — {key}: {v}")
                if '"' in v:
                    sys.exit(f"{p}:{n}: {loc} 값에 큰따옴표가 있다 — {key}")
            rows[key] = (ja, de)
    return rows


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("catalog", help="카탈로그 이름 (theme | content | curriculum)")
    ap.add_argument("--in", dest="inputs", nargs="+", required=True)
    ap.add_argument("--expect", help="key 열을 비교할 원본 TSV")
    ap.add_argument("--unify-by-source", metavar="TSV",
                    help="같은 저작 원문(korean 열)은 같은 번역으로 통일한다. "
                         "번역을 나눠 만들면 같은 원문이 묶음마다 다르게 나올 수 있는데, "
                         "화면에서는 같은 이름이어야 하기 때문이다. 가장 짧은 것을 고른다 — "
                         "이 문자열은 정거장 라벨이라 길이가 곧 품질이다.")
    ap.add_argument("--out-dir", default="server/internal/i18n")
    args = ap.parse_args()

    rows = read_rows([pathlib.Path(p) for p in args.inputs])

    if args.expect:
        want = {l.split("\t")[0] for l in pathlib.Path(args.expect).read_text().splitlines()[1:] if l.strip()}
        missing, extra = sorted(want - set(rows)), sorted(set(rows) - want)
        if missing or extra:
            # 파일을 쓰지 않고 멈춘다: 반쯤 채운 카탈로그는 빈 카탈로그보다 나쁘다.
            # 커버된 것처럼 보이면서 일부만 한국어로 나가기 때문이다.
            sys.exit(f"키 집합이 다르다 — 빠짐 {len(missing)} {missing[:5]} / 남음 {len(extra)} {extra[:5]}")

    if args.unify_by_source:
        src = {}
        for line in pathlib.Path(args.unify_by_source).read_text().splitlines()[1:]:
            if not line.strip():
                continue
            cols = line.split("\t")
            src[cols[0]] = cols[2] if len(cols) > 3 else cols[1]
        groups: dict[str, list[str]] = {}
        for k in rows:
            groups.setdefault(src.get(k, k), []).append(k)
        unified = 0
        for ko, keys in groups.items():
            if len(keys) < 2:
                continue
            variants = {rows[k] for k in keys}
            if len(variants) < 2:
                continue
            pick = min(variants, key=lambda v: (len(v[0]) + len(v[1]), v))
            for k in keys:
                rows[k] = pick
            unified += 1
            print(f"  통일: {ko!r} → ja {pick[0]!r} / de {pick[1]!r}")
        print(f"같은 원문 {unified}건을 하나로 통일했다")

    what = {"theme": "955 curriculum themes", "content": "scenario and event titles",
            "curriculum": "labels and floor headings"}.get(args.catalog, args.catalog)
    out_dir = pathlib.Path(args.out_dir)
    for i, loc in enumerate(("ja", "de")):
        body = "".join(f'\t\t"{k}": "{v[i]}",\n' for k, v in sorted(rows.items()))
        path = out_dir / f"{args.catalog}_{loc}.go"
        path.write_text(HEADER.format(loc=loc, loc_name=LOC_NAME[loc], what=what,
                                      tool=pathlib.Path(__file__).name) + body + FOOTER)
        print(f"{path} — {len(rows)}키")


if __name__ == "__main__":
    main()
