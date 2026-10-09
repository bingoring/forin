#!/usr/bin/env python3
"""2차 — 상황 하나와 그 주제의 은행 전체를 함께 주고 문장 5개 이상을 받는다.

설계는 `docs/dlc/projects/forin/02-construction/lesson-four-steps-v44/`의
build-spec-index.md §6 결정 2, implementation-plan.md §B에 있다.

    python3 gen_sentences.py --dept er --theme core-safety-er --title "환자 2인 확인"
    python3 gen_sentences.py --dept er --theme core-safety-er        # 그 주제의 모든 상황
    python3 gen_sentences.py --dept er --theme X --title Y --dry-run # 파일에 쓰지 않고 눈으로만

**은행에 있는 단어로만 짓고, 쓴 단어의 id를 문장마다 적는다.** 시드의 keyPhrases 3개는 반드시
포함하고(청크 분해와 한국어 힌트를 붙여서), 나머지는 새로 짓는다. 문장마다 시드 goals의 몇
번째를 향하는지 적는다.

**모델 응답을 그대로 믿지 않는다.** 쓰기 전에 `verify_lesson_content.py`의 같은 판정 함수로
검증하고(V1·V2·V4·V5·V6를 이 자리에서 적용), 어긋나면 실패 사유를 모델에게 되돌려 한 번 더
시킨다. 그래도 어긋나면 파일에 쓰지 않고 실패로 끝낸다 — 검사 도구가 생성기가 만든 것을 믿을
근거이기 때문이다(과제 지시서 원문).

**YAML을 통째로 다시 쓰지 않는다.** 줄 단위로 끼워 넣는다 — `apply_locale_binding.py`가 같은
이유로 그렇게 한다(사람이 저작한 주석과 배열 서식을 보존해야 한다). 이 도구는 대상 시드 블록의
마지막 줄 다음에 `sentences:` 필드를 새로 끼운다.
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import re
import sys

import verify_lesson_content as vlc
from gen_lexicon import call_llm, DEFAULT_MODELS, DEFAULT_PROVIDER  # 같은 LLM 호출 규약을 재사용한다

TOOLS_DIR = pathlib.Path(__file__).resolve().parent
CONTENT_DIR = TOOLS_DIR.parent
LEXICON_DIR = CONTENT_DIR / "nurse" / "lexicon"
TOPICS_DIR = CONTENT_DIR / "nurse" / "topics"

MIN_SENTENCES = vlc.MIN_SENTENCES
NUM_KEY_PHRASES_EXPECTED = 3
MAX_ATTEMPTS = 3  # 1회 생성 + 검증 실패 시 피드백 재시도 2회


# ---------------------------------------------------------------------------
# 시드 블록 위치 찾기 (줄 단위 삽입을 위해)
# ---------------------------------------------------------------------------

def find_seed_starts(lines: list[str]) -> list[int]:
    return [i for i, l in enumerate(lines) if re.match(r"^- theme:\s*\S", l)]


def find_seed_index(seeds: list[dict], theme_key: str, title: str) -> int:
    matches = [i for i, s in enumerate(seeds) if s.get("theme") == theme_key and s.get("title") == title]
    if not matches:
        sys.exit(f"시드를 못 찾음: theme={theme_key!r} title={title!r}")
    if len(matches) > 1:
        sys.exit(f"theme={theme_key!r} title={title!r}가 {len(matches)}번 나온다 — title이 그 주제 안에서 유일해야 한다")
    return matches[0]


# ---------------------------------------------------------------------------
# 프롬프트
# ---------------------------------------------------------------------------

def build_prompt(seed: dict, bank: dict[str, dict], retry_feedback: str | None = None) -> tuple[str, str]:
    bank_list = [{"id": wid, "en": w.get("en"), "ko": w.get("ko")} for wid, w in bank.items()]
    goals = seed.get("goals") or []
    key_phrases = seed.get("keyPhrases") or []

    system = (
        "You are writing STEP-2 practice sentences for a Korean nurse learning US-hospital "
        "workplace English, for ONE specific clinical situation. You are given that situation's "
        "brief and goals, its 3 human-authored keyPhrases (clinically reviewed — must be kept "
        "verbatim), and the FULL word bank for its theme (words already generated in a separate "
        "pass; you may only build sentences out of these words).\n\n"
        f"Produce AT LEAST {MIN_SENTENCES} sentences. Requirements, all mandatory:\n"
        f"1. Exactly the {NUM_KEY_PHRASES_EXPECTED} given keyPhrases must each appear as one "
        "sentence's `en`, UNCHANGED, character for character (do not paraphrase, do not fix "
        "punctuation). For those, still add chunks/ko/words/goal like any other sentence.\n"
        "2. Every other sentence is newly written, natural, and something actually said in this "
        "situation.\n"
        "3. Every content word used in a sentence's `en` must be one of the bank words below — "
        "reference it by `id` in that sentence's `words` list. You MAY inflect the bank word's "
        "base form, but ONLY with these exact patterns, because the automated checker's "
        "morphology matcher recognizes ONLY these: add -s, add -es, add -ed, add -ing, or (word "
        "ending consonant+y) swap -y for -ies. Example: bank 'check' -> 'check'/'checks'/"
        "'checked'/'checking' are all fine. Do NOT use any OTHER derivation even if it is natural "
        "English — no -ation/-ment/-er/-ly nominalizations or agent nouns (bank 'identify' -> "
        "'identify'/'identifies'/'identified'/'identifying' are fine, but 'identification' or "
        "'identifier' are NOT recognized as the same word and will fail verification: use "
        "'identify' itself instead, e.g. \"...to identify you correctly\" not \"...for "
        "identification\"). Function words (a, the, your, is, please...) don't need bank "
        "entries.\n"
        "4. Across all sentences together, at least 8 distinct bank word ids must be used "
        "(union across sentences, not per-sentence).\n"
        "5. `chunks`: split `en` into SEVERAL natural spoken chunks. The learner assembles the "
        "sentence by tapping these in order, so the split is the exercise — a sentence handed "
        "over as one big chunk gives them nothing to do. Split at phrase boundaries the way a "
        "speaker would pause: subject+verb, verb+object, prepositional phrase, time phrase.\n"
        "   HOW MANY, by word count of `en`: up to 4 words -> at least 2 chunks; 5-8 words -> at "
        "least 3; 9 or more -> at least 4. Punctuation-only chunks do NOT count toward this.\n"
        "   GOOD: en \"I need to check your wristband every time.\" -> chunks [\"I need to\", "
        "\"check your\", \"wristband\", \"every time\", \".\"]  (8 words, 4 real chunks)\n"
        "   BAD:  chunks [\"I need to check your wristband every time\", \".\"]  (1 real chunk — "
        "rejected)\n"
        "   JOIN RULE — the chunks must reproduce `en` EXACTLY: they join with a single space by "
        "default, EXCEPT a chunk that STARTS with one of , . ? ! attaches directly to the previous "
        "chunk with NO space (English never puts a space before those). So the sentence's trailing "
        "punctuation mark is its OWN final chunk, not glued onto the last word. Another: en "
        "\"Wristband, right?\" -> chunks [\"Wristband\", \", right\", \"?\"]. Get both the "
        "split and the join exactly right — they are mechanically checked "
        "(verify_lesson_content.py V5/V8 / Go JoinChunks) and a mismatch fails the whole "
        "sentence.\n"
        "6. `goal`: which 1-indexed item of the given `goals` list this sentence works toward.\n"
        "7. `ko`: a natural Korean translation/hint for the sentence.\n\n"
        "Return ONLY a JSON array (no markdown fences, no commentary), each element:\n"
        '  {"en": "...", "ko": "...", "chunks": ["...", "..."], "words": ["w-id", ...], "goal": 1}\n'
    )
    if retry_feedback:
        system += (
            "\n\nYour previous attempt failed automated verification. Fix ALL of these and "
            "resend the full corrected JSON array (not a diff):\n" + retry_feedback
        )

    user = json.dumps(
        {
            "situation": {
                "title": seed.get("title"),
                "tagline": seed.get("tagline"),
                "brief": seed.get("brief"),
                "goals": goals,
                "keyPhrases": key_phrases,
            },
            "wordBank": bank_list,
        },
        ensure_ascii=False,
        indent=2,
    )
    return system, user


# ---------------------------------------------------------------------------
# 파싱 / 검증 (verify_lesson_content의 판정 함수를 그대로 재사용한다)
# ---------------------------------------------------------------------------

def extract_json_array(text: str) -> list[dict]:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        sys.exit(f"모델 응답이 JSON이 아니다: {e}\n--- 원문 ---\n{text[:2000]}")
    if not isinstance(data, list):
        sys.exit("모델 응답이 JSON 배열이 아니다")
    return data


def verify_sentences(seed: dict, bank: dict[str, dict], sentences: list[dict]) -> list[str]:
    """seed 하나 + sentences 제안분을 verify_lesson_content의 판정 규칙으로 검사한다.
    실패 사유 문자열 목록을 낸다(비어 있으면 통과)."""
    fake_lexicon = {seed.get("theme"): bank}
    fake_seed = dict(seed)
    fake_seed["sentences"] = sentences
    violations, _warnings, _cov = vlc.verify_dept("gen", fake_lexicon, [fake_seed], theme_filter=seed.get("theme"))
    return [str(v) for v in violations]


# ---------------------------------------------------------------------------
# 삽입
# ---------------------------------------------------------------------------

def format_sentence_block(sent: dict, indent: str = "    ") -> list[str]:
    lines = []
    lines.append(f"{indent}- en: {json.dumps(sent['en'], ensure_ascii=False)}\n")
    lines.append(f"{indent}  ko: {json.dumps(sent['ko'], ensure_ascii=False)}\n")
    chunks_str = "[" + ", ".join(json.dumps(c, ensure_ascii=False) for c in sent["chunks"]) + "]"
    lines.append(f"{indent}  chunks: {chunks_str}\n")
    words_str = "[" + ", ".join(sent["words"]) + "]"
    lines.append(f"{indent}  words: {words_str}\n")
    lines.append(f"{indent}  goal: {sent['goal']}\n")
    return lines


def format_sentences_field(sentences: list[dict]) -> list[str]:
    out = ["  sentences:\n"]
    for s in sentences:
        out.extend(format_sentence_block(s))
    return out


def insert_sentences(path: pathlib.Path, theme_key: str, title: str, sentences: list[dict]) -> None:
    lines = path.read_text().splitlines(keepends=True)
    starts = find_seed_starts(lines)
    seeds = vlc.parse_topics("".join(lines))
    if len(starts) != len(seeds):
        sys.exit(f"{path}: 항목 {len(seeds)}개인데 시작 줄이 {len(starts)}개다 — 서식이 예상과 다르다")

    idx = find_seed_index(seeds, theme_key, title)
    if seeds[idx].get("sentences"):
        sys.exit(f"{path}: theme={theme_key} title={title!r}에 이미 sentences가 있다 — insert_sentences를 부르면 안 됨")

    block_start = starts[idx]
    block_end = starts[idx + 1] if idx + 1 < len(starts) else len(lines)
    # 그 시드 블록의 마지막 "내용 있는" 줄 다음에 끼운다(그 뒤 빈 줄/주석은 다음 항목 앞이라 안 건드림).
    last_content = block_end - 1
    while last_content > block_start and not lines[last_content].strip():
        last_content -= 1
    insert_at = last_content + 1

    new_lines = format_sentences_field(sentences)
    lines[insert_at:insert_at] = new_lines
    path.write_text("".join(lines))


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dept", required=True, help="예: er")
    ap.add_argument("--theme", required=True, help="주제 key")
    ap.add_argument("--title", help="상황(시드) title 하나로 좁힌다 (생략하면 그 주제의 모든 상황)")
    ap.add_argument(
        "--provider", default=DEFAULT_PROVIDER, choices=("anthropic", "openai"),
        help=f"기본 {DEFAULT_PROVIDER}. 실제 콘텐츠 생성은 anthropic(Sonnet)을 쓴다 — openai는 비상구(gen_lexicon.py 주석 참고)",
    )
    ap.add_argument("--model", default=None, help="기본은 provider별 DEFAULT_MODELS")
    ap.add_argument("--dry-run", action="store_true", help="파일에 쓰지 않고 결과만 출력한다")
    args = ap.parse_args()

    topics_path = TOPICS_DIR / f"{args.dept}.yaml"
    if not topics_path.exists():
        sys.exit(f"{topics_path} 없음")
    lexicon_path = LEXICON_DIR / f"{args.dept}.yaml"
    if not lexicon_path.exists():
        sys.exit(f"{lexicon_path} 없음 — 먼저 gen_lexicon.py로 이 주제의 은행을 만들어라")

    lexicon = vlc.parse_lexicon(lexicon_path.read_text())
    bank = lexicon.get(args.theme)
    if not bank:
        sys.exit(f"{lexicon_path}: theme={args.theme!r} 은행이 없다 — 먼저 gen_lexicon.py를 돌려라")

    seeds = vlc.parse_topics(topics_path.read_text())
    theme_seeds = [s for s in seeds if s.get("theme") == args.theme]
    if args.title:
        theme_seeds = [s for s in theme_seeds if s.get("title") == args.title]
        if not theme_seeds:
            sys.exit(f"theme={args.theme!r} title={args.title!r} 시드를 못 찾음")

    for seed in theme_seeds:
        title = seed.get("title")
        if seed.get("sentences"):
            print(f"[skip] {args.theme}/{title!r}: 이미 sentences가 있음 — 건너뜀")
            continue

        model_label = args.model or DEFAULT_MODELS.get(args.provider, "?")
        print(f"[gen] {args.theme}/{title!r}: 문장 생성 중 (은행 {len(bank)}개, provider={args.provider} model={model_label})...")

        feedback = None
        sentences: list[dict] | None = None
        for attempt in range(1, MAX_ATTEMPTS + 1):
            system, user = build_prompt(seed, bank, retry_feedback=feedback)
            raw = call_llm(system, user, provider=args.provider, model=args.model)
            candidate = extract_json_array(raw)
            problems = verify_sentences(seed, bank, candidate)
            if not problems:
                sentences = candidate
                break
            print(f"  attempt {attempt}: 검증 실패 {len(problems)}건")
            for p in problems:
                print(f"    ! {p}")
            feedback = "\n".join(problems)

        if sentences is None:
            print(f"  [FAIL] {title!r}: {MAX_ATTEMPTS}회 시도 후에도 검증 통과 못함 — 파일에 쓰지 않음")
            continue

        print(f"  -> 문장 {len(sentences)}개 생성 + 검증 통과")
        for s in sentences:
            print(f"     en: {s['en']}")
            print(f"     ko: {s['ko']}")
            print(f"     chunks: {s['chunks']}")
            print(f"     words: {s['words']}  goal: {s['goal']}")
            print()

        if args.dry_run:
            print(f"  (dry-run) {title!r}: 파일에 쓰지 않음")
            continue

        insert_sentences(topics_path, args.theme, title, sentences)
        print(f"  written -> {topics_path} ({title!r})")


if __name__ == "__main__":
    main()
