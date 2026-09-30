#!/usr/bin/env python3
"""주제별 저작 산출물을 부서 정본에 합친다.

    python3 merge_dept_lessons.py <부서코드> <주제파일디렉터리> [--replace]

두 곳에 쓴다.
  content/nurse/lexicon/<부서>.yaml   — 주제 1건당 은행 1건.
  content/nurse/topics/<부서>.yaml    — 시드마다 `sentences:`(와 v45 `nuance:`)를 끼워 넣는다.

시드 파일은 **텍스트로** 손댄다. 통째로 다시 쓰면 섹션 주석과 손으로 맞춰 둔 배열이
전부 사라지기 때문에, 기존 줄은 한 줄도 건드리지 않고 삽입만 한다.

**주제 일부만 합쳐도 된다.** 디렉터리에 있는 주제만 바꾸고, 은행 파일의 나머지 주제와
나머지 시드는 그대로 둔다(v45 파일럿이 주제 3개로 돈다).

**보강 패스(v45).** 이미 `sentences:`가 붙은 시드는 문장이 정본과 한 글자도 다르지 않아야
하고(다르면 멈춘다 — verify 의 V16과 같은 조건), 그 뒤에 `nuance:`만 끼워 넣는다. 이미
`nuance:`가 있으면 멈춘다(두 번 합치기).

**`--replace`(결정 10·11).** 검토 후 수정본으로 **갈아 끼운다.** 들어온 주제의 시드에서 기존
`sentences:`·`nuance:` 블록을 지우고 새로 넣는다. 문장이 바뀌었는지는 여기서 막지 않는다 —
합친 뒤 `verify_lesson_content.py --baseline HEAD --changes <디렉터리>`가 변경 목록에 적힌
것만 바뀌었는지 본다. 그 검사를 건너뛰고 커밋하지 말 것.
"""
import glob, io, json, os, sys, yaml

KEEP = ("en", "ipa", "ko", "icon", "example")
# v45 (build-spec §11-2). 목록 값은 JSON 흐름 표기로 쓴다 — YAML 이 그대로 읽는다.
KEEP_V45_TEXT = ("exKo", "cue", "tag")
KEEP_V45_LIST = ("distractorsEn", "distractorsKo", "chips", "decoyChips")
SENTENCE_KEYS = ("en", "ko", "chunks", "words", "goal")


def qq(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def nurse_root() -> str:
    # NURSE_ROOT 는 도구를 실제 정본이 아닌 사본에 돌려 볼 때만 쓴다.
    return os.environ.get("NURSE_ROOT") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "nurse")


def write_bank(o: io.StringIO, b: dict) -> None:
    o.write("- theme: %s\n  words:\n" % b["theme"])
    for w in b["words"]:
        o.write("    - id: %s\n" % w["id"])
        for k in KEEP + KEEP_V45_TEXT:
            if w.get(k):
                o.write("      %s: %s\n" % (k, qq(str(w[k]))))
        for k in KEEP_V45_LIST:
            if w.get(k):
                o.write("      %s: %s\n" % (k, json.dumps(w[k], ensure_ascii=False)))


def nuance_block(items: list) -> list[str]:
    dumped = yaml.safe_dump({"nuance": items}, allow_unicode=True, sort_keys=False, width=1000)
    return ["  " + l for l in dumped.rstrip("\n").split("\n")]


def strip_lesson_blocks(block: list[str]) -> list[str]:
    """시드 한 건의 줄에서 `  sentences:`·`  nuance:` 블록을 뺀다. 블록은 키 줄부터, 들여쓰기가
    2보다 깊은 줄과 같은 깊이의 목록 항목(`  - `)이 이어지는 동안이다."""
    out, skipping = [], False
    for line in block:
        indent = len(line) - len(line.lstrip())
        if line.rstrip() in ("  sentences:", "  nuance:"):
            skipping = True
            continue
        if skipping:
            if not line.strip() or indent > 2 or (indent == 2 and line.lstrip().startswith("- ")):
                if not line.strip():
                    out.append(line)  # 빈 줄은 남긴다 — 다음 시드와의 간격
                continue
            skipping = False
        out.append(line)
    return out


def main(dept: str, srcdir: str, replace: bool = False) -> int:
    nurse = nurse_root()
    topics_path = os.path.join(nurse, "topics", f"{dept}.yaml")
    lex_dir = os.path.join(nurse, "lexicon")
    lex_path = os.path.join(lex_dir, f"{dept}.yaml")

    incoming, per_seed = {}, {}
    for f in sorted(glob.glob(os.path.join(srcdir, "*.yaml"))):
        d = yaml.safe_load(io.open(f, encoding="utf-8"))
        if not isinstance(d, dict) or "theme" not in d:
            continue  # 저작 중 남은 찌꺼기 파일
        incoming[d["theme"]] = d
        for s in d["situations"]:
            per_seed[(d["theme"], s["title"])] = s

    # ── 은행 — 있던 주제는 **원문 텍스트 그대로** 옮기고, 들어온 주제만 새로 쓴다 ──
    # 다시 쓰면 의미는 같아도 글자가 바뀐다(손으로 고친 `icon: board`에 따옴표가 붙는다).
    # 건드리지 않은 주제가 diff 에 나오면, 보강이 무엇을 바꿨는지 읽을 수 없다.
    existing_text = io.open(lex_path, encoding="utf-8").read() if os.path.exists(lex_path) else ""
    ex_lines = existing_text.split("\n")
    ex_starts = [i for i, l in enumerate(ex_lines) if l.startswith("- theme:")]
    raw_blocks = {}  # theme -> 원문 줄 목록
    for n, i in enumerate(ex_starts):
        end = ex_starts[n + 1] if n + 1 < len(ex_starts) else len(ex_lines)
        raw_blocks[ex_lines[i].split(":", 1)[1].strip()] = ex_lines[i:end]
    existing = yaml.safe_load(existing_text) or []
    banks = [incoming.get(b["theme"], b) for b in existing]
    banks += [d for t, d in incoming.items() if t not in raw_blocks]

    os.makedirs(lex_dir, exist_ok=True)
    o = io.StringIO()
    o.write("# 커리큘럼 v3 / lesson-four-steps-v44 — %s 부서 단어 은행.\n" % dept.upper())
    o.write("# 주제 1건당 은행 1건. STEP 1은 이 은행을 직접 읽지 않고, 상황의\n")
    o.write("# sentences 가 참조한 id 를 거슬러 올라가 만들어진다.\n")
    o.write("# %d themes · %d words.\n\n" % (len(banks), sum(len(b["words"]) for b in banks)))
    for b in banks:
        if b["theme"] in incoming or b["theme"] not in raw_blocks:
            write_bank(o, b)
        else:
            block = raw_blocks[b["theme"]]
            o.write("\n".join(block) + ("" if block[-1] == "" else "\n"))

    # ── 시드 ────────────────────────────────────────────────────
    lines = io.open(topics_path, encoding="utf-8").read().split("\n")
    if replace:
        # 들어온 주제의 시드에서만 기존 블록을 지운다. 나머지 시드는 한 줄도 건드리지 않는다.
        starts0 = [i for i, l in enumerate(lines) if l.startswith("- theme:")]
        rebuilt = lines[: starts0[0]] if starts0 else list(lines)
        for n, i in enumerate(starts0):
            end = starts0[n + 1] if n + 1 < len(starts0) else len(lines)
            block = lines[i:end]
            theme = block[0].split(":", 1)[1].strip()
            rebuilt += strip_lesson_blocks(block) if theme in incoming else block
        lines = rebuilt
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

    edits, missing, n_backfill = [], [], 0
    for i, seed in enumerate(seeds):
        if seed["theme"] not in incoming:
            continue  # 이번에 합치지 않는 주제
        sit = per_seed.get((seed["theme"], seed["title"]))
        if sit is None:
            missing.append((seed["theme"], seed["title"]))
            continue
        b = []
        if "sentences" in seed:
            # 보강 패스 — 문장은 이미 정본에 있다. 한 글자라도 다르면 멈춘다.
            before = [{k: s.get(k) for k in SENTENCE_KEYS} for s in seed["sentences"]]
            after = [{k: s.get(k) for k in SENTENCE_KEYS} for s in sit["sentences"]]
            if before != after:
                sys.exit("보강 패스가 문장을 바꿨다: %s / %s" % (seed["theme"], seed["title"]))
            if "nuance" in seed:
                sys.exit("이미 nuance 가 붙어 있다: %s / %s" % (seed["theme"], seed["title"]))
            n_backfill += 1
        else:
            b.append("  sentences:")
            for s in sit["sentences"]:
                b.append("    - en: %s" % qq(s["en"]))
                b.append("      ko: %s" % qq(s["ko"]))
                b.append("      chunks: [" + ", ".join(qq(c) for c in s["chunks"]) + "]")
                b.append("      words: [" + ", ".join(s["words"]) + "]")
                b.append("      goal: %d" % s["goal"])
        if sit.get("nuance"):
            b += nuance_block(sit["nuance"])
        if b:
            edits.append((block_end(i), b))

    if missing:
        sys.exit("짝을 찾지 못한 시드 %d건: %s" % (len(missing), missing[:5]))

    io.open(lex_path, "w", encoding="utf-8").write(o.getvalue())
    for pos, b in reversed(edits):
        lines[pos:pos] = b
    io.open(topics_path, "w", encoding="utf-8").write("\n".join(lines))
    print("%s: 주제 %d개 합침(은행 전체 %d개) · 시드 %d건에 삽입, 그중 보강 %d건"
          % (dept, len(incoming), len(banks), len(edits), n_backfill))
    return 0


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--replace"]
    if len(args) != 2:
        sys.exit(__doc__)
    sys.exit(main(args[0], args[1], replace="--replace" in sys.argv[1:]))
