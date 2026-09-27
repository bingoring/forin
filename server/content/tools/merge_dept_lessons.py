#!/usr/bin/env python3
"""주제별 저작 산출물을 부서 정본에 합친다.

    python3 merge_dept_lessons.py <부서코드> <주제파일디렉터리>

두 곳에 쓴다.
  content/nurse/lexicon/<부서>.yaml   — 주제 1건당 은행 1건. 새로 쓴다.
  content/nurse/topics/<부서>.yaml    — 시드마다 `sentences:` 를 끼워 넣는다.

시드 파일은 **텍스트로** 손댄다. 통째로 다시 쓰면 섹션 주석과 손으로 맞춰 둔 배열이
전부 사라지기 때문에, 기존 줄은 한 줄도 건드리지 않고 삽입만 한다.
"""
import glob, io, os, sys, yaml

KEEP = ("en", "ipa", "ko", "icon", "example")


def qq(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main(dept: str, srcdir: str) -> int:
    here = os.path.dirname(os.path.abspath(__file__))
    nurse = os.path.join(here, "..", "nurse")
    topics_path = os.path.join(nurse, "topics", f"{dept}.yaml")
    lex_dir = os.path.join(nurse, "lexicon")

    banks, per_seed = [], {}
    for f in sorted(glob.glob(os.path.join(srcdir, "*.yaml"))):
        d = yaml.safe_load(io.open(f, encoding="utf-8"))
        if not isinstance(d, dict) or "theme" not in d:
            continue  # 저작 중 남은 찌꺼기 파일
        banks.append(d)
        for s in d["situations"]:
            per_seed[(d["theme"], s["title"])] = s["sentences"]

    # ── 은행 ────────────────────────────────────────────────────
    os.makedirs(lex_dir, exist_ok=True)
    o = io.StringIO()
    o.write("# 커리큘럼 v3 / lesson-four-steps-v44 — %s 부서 단어 은행.\n" % dept.upper())
    o.write("# 주제 1건당 은행 1건. STEP 1은 이 은행을 직접 읽지 않고, 상황의\n")
    o.write("# sentences 가 참조한 id 를 거슬러 올라가 만들어진다.\n")
    o.write("# %d themes · %d words.\n\n" % (len(banks), sum(len(b["words"]) for b in banks)))
    for b in banks:
        o.write("- theme: %s\n  words:\n" % b["theme"])
        for w in b["words"]:
            o.write("    - id: %s\n" % w["id"])
            for k in KEEP:
                if w.get(k):
                    o.write("      %s: %s\n" % (k, qq(str(w[k]))))
    io.open(os.path.join(lex_dir, f"{dept}.yaml"), "w", encoding="utf-8").write(o.getvalue())

    # ── 시드 ────────────────────────────────────────────────────
    lines = io.open(topics_path, encoding="utf-8").read().split("\n")
    seeds = yaml.safe_load("\n".join(lines))
    starts = [i for i, l in enumerate(lines) if l.startswith("- theme:")]
    assert len(starts) == len(seeds), (len(starts), len(seeds))

    def block_end(i: int) -> int:
        """시드 i 의 마지막 내용 줄 다음 위치. 뒤따르는 빈 줄과 주석은 넘긴다."""
        stop = starts[i + 1] if i + 1 < len(starts) else len(lines)
        j = stop - 1
        while j > starts[i] and not lines[j].strip():
            j -= 1
        while j > starts[i] and lines[j].lstrip().startswith("#"):
            j -= 1
            while j > starts[i] and not lines[j].strip():
                j -= 1
        return j + 1

    edits, missing = [], []
    for i, seed in enumerate(seeds):
        if "sentences" in seed:
            sys.exit("이미 sentences 가 붙어 있다: %s / %s" % (seed["theme"], seed["title"]))
        sents = per_seed.get((seed["theme"], seed["title"]))
        if sents is None:
            missing.append((seed["theme"], seed["title"]))
            continue
        b = ["  sentences:"]
        for s in sents:
            b.append("    - en: %s" % qq(s["en"]))
            b.append("      ko: %s" % qq(s["ko"]))
            b.append("      chunks: [" + ", ".join(qq(c) for c in s["chunks"]) + "]")
            b.append("      words: [" + ", ".join(s["words"]) + "]")
            b.append("      goal: %d" % s["goal"])
        edits.append((block_end(i), b))

    if missing:
        sys.exit("짝을 찾지 못한 시드 %d건: %s" % (len(missing), missing[:5]))

    for pos, b in reversed(edits):
        lines[pos:pos] = b
    io.open(topics_path, "w", encoding="utf-8").write("\n".join(lines))
    print("%s: 은행 %d개 · 문장을 붙인 시드 %d건" % (dept, len(banks), len(edits)))
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1], sys.argv[2]))
