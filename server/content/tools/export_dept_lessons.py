#!/usr/bin/env python3
"""부서 정본에서 주제별 산출물 모양(`base-<주제>.yaml`)을 뽑는다 — merge_dept_lessons.py 의 반대 방향.

    python3 export_dept_lessons.py <부서코드> <출력디렉터리> [<주제> ...]
    python3 export_dept_lessons.py --roundtrip <부서코드> [<주제> ...]   # 빈 합치기 검사(아래 2)

주제를 적지 않으면 문장이 있는 주제 전부. 한 파일의 모양은 저작 산출물과 같다:

    theme: core-safety-er
    words: [...]                  # lexicon/<부서>.yaml 의 그 주제 은행, 원래 키 그대로
    situations:
      - title: ...
        sentences: [...]          # topics/<부서>.yaml 의 시드 문장, v46 필드까지 그대로
        nuance: [...]             # 있으면
        order: {...}              # 있으면 (v46 순서 배열 카드)

쓰임은 둘이다.
  1. **보강 저작의 바탕(v46).** 저작자는 이 파일을 읽어 새 필드만 얹은 산출물을 만든다. 뉘앙스·order가 이미
     들어 있으니 `--replace`로 합쳐도 v45 콘텐츠가 사라지지 않는다.
  2. **빈 합치기 검사.** 이 파일을 손대지 않고 `merge_dept_lessons.py <부서> <디렉터리> --replace`로 합치면
     정본(lexicon·topics)이 **바이트 단위로 같아야** 한다. 다르면 합치기 도구가 무엇인가를 버리거나 바꾼다.

`--roundtrip`은 2를 한 번에 한다 — 정본을 임시 사본에 복사해 뽑고 `--replace`로 합친 뒤 두 파일을 바이트로
비교한다. 정본은 건드리지 않는다. 합치기 도구를 고쳤으면 커밋 전에 돌린다.

NURSE_ROOT 를 주면 그 사본에서 읽는다(merge 와 같다).
"""
import filecmp, io, os, shutil, subprocess, sys, tempfile, yaml

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from merge_dept_lessons import nurse_root  # noqa: E402


def export(dept: str, outdir: str, themes: list[str]) -> int:
    nurse = nurse_root()
    banks = yaml.safe_load(io.open(os.path.join(nurse, "lexicon", f"{dept}.yaml"), encoding="utf-8")) or []
    seeds = yaml.safe_load(io.open(os.path.join(nurse, "topics", f"{dept}.yaml"), encoding="utf-8")) or []
    by_theme = {b["theme"]: b for b in banks}
    want = themes or sorted({s["theme"] for s in seeds if s.get("sentences")})
    os.makedirs(outdir, exist_ok=True)
    for theme in want:
        if theme not in by_theme:
            sys.exit(f"주제 {theme!r}의 은행이 lexicon/{dept}.yaml 에 없다")
        sits = []
        for s in seeds:
            if s.get("theme") != theme or not s.get("sentences"):
                continue
            sit = {"title": s["title"], "sentences": s["sentences"]}
            for k in ("nuance", "order"):
                if s.get(k):
                    sit[k] = s[k]
            sits.append(sit)
        doc = {"theme": theme, "words": by_theme[theme]["words"], "situations": sits}
        with io.open(os.path.join(outdir, f"base-{theme}.yaml"), "w", encoding="utf-8") as f:
            yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=1000)
    print(f"{dept}: 주제 {len(want)}개 → {outdir}")
    return 0


def roundtrip(dept: str, themes: list[str]) -> int:
    nurse = nurse_root()
    with tempfile.TemporaryDirectory() as tmp:
        root = os.path.join(tmp, "nurse")
        for sub in ("lexicon", "topics"):
            shutil.copytree(os.path.join(nurse, sub), os.path.join(root, sub))
        out = os.path.join(tmp, "out")
        env = {**os.environ, "NURSE_ROOT": root}
        here = os.path.dirname(os.path.abspath(__file__))
        for cmd in (["export_dept_lessons.py", dept, out, *themes], ["merge_dept_lessons.py", dept, out, "--replace"]):
            subprocess.run([sys.executable, os.path.join(here, cmd[0]), *cmd[1:]], env=env, check=True)
        bad = [p for p in (os.path.join("lexicon", f"{dept}.yaml"), os.path.join("topics", f"{dept}.yaml"))
               if not filecmp.cmp(os.path.join(nurse, p), os.path.join(root, p), shallow=False)]
    print(f"{dept}: 빈 합치기 " + ("바이트 동일" if not bad else f"다름 — {bad}"))
    return 1 if bad else 0


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "--roundtrip":
        sys.exit(roundtrip(sys.argv[2], sys.argv[3:]))
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    sys.exit(export(sys.argv[1], sys.argv[2], sys.argv[3:]))
