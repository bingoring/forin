#!/usr/bin/env python3
"""한 번에 저작(pipeline/TASK.md)의 두 반쪽을 합친다.

    python3 combine_halves.py <작업 폴더> <주제>

A(`<주제>.A.yaml`)의 단어·뉘앙스를 바탕으로, B(`<주제>.B.yaml`)의 문장 v46 필드와 상황 `order:`를 얹어
`<주제>.yaml`을 쓴다. 두 파일의 상황 제목·문장 en·ko·chunks·goal이 어긋나면 멈춘다(둘 다 문장을 바꾸면 안 된다).
문장 `words`(단어 태그)는 A 것을 쓴다 — A가 결정 11 정리로 쉬운 단어 태그를 뺄 수 있다.
"""
import sys, yaml

V46 = ("tag", "icon", "why", "decoy", "distractorsKo", "blank")


def main(d: str, t: str) -> int:
    a = yaml.safe_load(open(f"{d}/{t}.A.yaml", encoding="utf-8"))
    b = yaml.safe_load(open(f"{d}/{t}.B.yaml", encoding="utf-8"))
    if len(a["situations"]) != len(b["situations"]):
        sys.exit("상황 수가 다르다")
    for sa, sb in zip(a["situations"], b["situations"]):
        if sa["title"] != sb["title"] or len(sa["sentences"]) != len(sb["sentences"]):
            sys.exit(f"상황이 어긋난다: {sa['title']} / {sb['title']}")
        for xa, xb in zip(sa["sentences"], sb["sentences"]):
            for k in ("en", "ko", "chunks", "goal"):
                if xa.get(k) != xb.get(k):
                    sys.exit(f"문장 {k}가 다르다: {sa['title']}: {xa.get('en')}")
            for k in V46:
                if k in xb:
                    xa[k] = xb[k]
        if "order" in sb:
            sa["order"] = sb["order"]
    with open(f"{d}/{t}.yaml", "w", encoding="utf-8") as f:
        yaml.safe_dump(a, f, allow_unicode=True, sort_keys=False, width=1000)
    print(f"{d}/{t}.yaml")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2]))
