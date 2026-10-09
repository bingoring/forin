#!/usr/bin/env python3
"""1차 — 주제(theme) 하나가 품은 상황 전부를 모델에 주고 단어 은행 30개 이상을 받는다.

설계는 `docs/dlc/projects/forin/02-construction/lesson-four-steps-v44/`의
build-spec-index.md §6 결정 2, implementation-plan.md §B에 있다.

    python3 gen_lexicon.py --dept er --theme core-safety-er
    python3 gen_lexicon.py --dept er                 # er의 모든 주제, 이미 있는 것은 건너뜀
    python3 gen_lexicon.py --dept er --theme X --dry-run   # 파일에 쓰지 않고 눈으로만 본다

한 주제 안의 상황들은 같은 어휘를 쓰므로(wristband·verify·allergy) 은행을 주제 단위로 한 번만
만들고, 2차(gen_sentences.py)가 상황마다 그 은행에서 골라 쓴다 — 반복 노출이 생겨 오히려
외워진다(스펙 §6).

**모델은 Sonnet.** 런타임 대화가 쓰는 값싼 모델보다 나은 결과를 미리 확보하는 것이 선생성을
고른 이유다.

**이미 그 주제가 렉시콘 파일에 있으면 건너뛴다.** 시드가 늘어도 다시 도는 비용이 늘어난 만큼만
되게 한다(스펙 §6).

**YAML을 통째로 다시 쓰지 않는다.** 이 도구는 항상 새 theme 블록을 파일 "끝에 추가"하므로
(기존 theme는 절대 건드리지 않는다) 그 자체로 안전하다 — `apply_locale_binding.py`처럼 기존
줄 사이에 끼워 넣어야 하는 상황이 아니다.
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import re
import sys

import yaml

import verify_lesson_content as vlc

TOOLS_DIR = pathlib.Path(__file__).resolve().parent
CONTENT_DIR = TOOLS_DIR.parent
SERVER_DIR = CONTENT_DIR.parent
REPO_ROOT = SERVER_DIR.parent

LEXICON_DIR = CONTENT_DIR / "nurse" / "lexicon"
TOPICS_DIR = CONTENT_DIR / "nurse" / "topics"
NBICON_PATH = REPO_ROOT / "mobile" / "src" / "components" / "nb" / "NbIcon.tsx"

MIN_WORDS = 30
FALLBACK_ICON = "board"

ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions"

# 스펙(build-spec-index.md §6 결정 2)은 "모델은 Sonnet"이라고 못박는다 — 런타임 대화가 쓰는
# 값싼 모델보다 나은 결과를 미리 확보하는 것이 선생성을 고른 이유이기 때문이다. 그래서
# anthropic이 기본 provider이고, 이 파일이 정하는 진짜 기본 모델이다.
#
# `--provider openai`는 그 규칙을 바꾸는 것이 아니라, 이 저장소가 이미 쓰는 provider 전환
# 관례(`server/internal/config/config.go`의 LLM_PROVIDER: anthropic | openai)를 콘텐츠 생성기에도
# 그대로 옮긴 것뿐이다 — Anthropic 쪽 계정 잔액이 바닥나 한 걸음도 못 뗄 때(2026-09-25 이 작업
# 당시 실제로 벌어진 일이다) 도구 자체를 못 쓰게 되는 것을 막는 비상구다. 부서 전량 생성처럼
# 실제 콘텐츠를 만드는 실행에서는 반드시 anthropic(Sonnet)을 쓴다 — openai로 만든 결과를
# 커밋하기 전에 그 사실을 보고서에 남겨라.
DEFAULT_PROVIDER = os.environ.get("CONTENT_GEN_PROVIDER", "anthropic")
DEFAULT_MODELS = {
    "anthropic": os.environ.get("CONTENT_GEN_MODEL", "claude-sonnet-4-6"),
    "openai": os.environ.get("CONTENT_GEN_MODEL_OPENAI", "gpt-4o"),
}


# ---------------------------------------------------------------------------
# 아이콘 허용 집합 — mobile/src/components/nb/NbIcon.tsx의 실제 목록에서 읽는다
# ---------------------------------------------------------------------------

def load_icon_names() -> list[str]:
    text = NBICON_PATH.read_text()
    m = re.search(r"export type NbIconName =\s*(.*?);", text, re.S)
    if not m:
        sys.exit(f"{NBICON_PATH}: NbIconName union을 못 찾았다 — 아이콘 목록 파싱 실패")
    return re.findall(r"'([a-zA-Z0-9]+)'", m.group(1))


# ---------------------------------------------------------------------------
# .env 로더 — 이 저장소는 godotenv 자동 로딩이 없다(서버도 셸/컨테이너가 주입).
# 이미 환경에 있으면 그대로 쓰고, 없을 때만 server/.env를 참고한다.
# ---------------------------------------------------------------------------

def _load_dotenv_fallback(key: str) -> str | None:
    env_path = SERVER_DIR / ".env"
    if not env_path.exists():
        return None
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        if k.strip() == key:
            return v.strip().strip('"').strip("'")
    return None


def _api_key(env_keys: tuple[str, ...], label: str) -> str:
    for k in env_keys:
        v = os.environ.get(k) or _load_dotenv_fallback(k)
        if v:
            return v
    sys.exit(f"{'/'.join(env_keys)}가 없다 — server/.env를 확인하라 ({label})")


def api_key() -> str:
    """Anthropic 키. 하위 호환을 위해 이름을 유지한다(다른 도구가 import할 수 있다)."""
    return _api_key(("ANTHROPIC_API_KEY", "ANTHROPIC_KEY"), "anthropic")


def call_claude(system: str, user: str, *, max_tokens: int = 8192, model: str | None = None) -> str:
    """Anthropic Messages API 호출. `server/internal/adapters/anthropic/anthropic.go`와 같은
    엔드포인트·헤더 관례를 쓴다 — 이 저장소가 이미 쓰는 방식을 그대로 옮겼다."""
    import requests

    resp = requests.post(
        ANTHROPIC_ENDPOINT,
        headers={
            "content-type": "application/json",
            "x-api-key": api_key(),
            "anthropic-version": ANTHROPIC_VERSION,
        },
        json={
            "model": model or DEFAULT_MODELS["anthropic"],
            "max_tokens": max_tokens,
            "system": system,
            "messages": [{"role": "user", "content": user}],
        },
        timeout=180,
    )
    resp.raise_for_status()
    data = resp.json()
    if data.get("error"):
        sys.exit(f"anthropic error: {data['error']}")
    return "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")


def call_openai(system: str, user: str, *, max_tokens: int = 8192, model: str | None = None) -> str:
    """OpenAI Chat Completions 호출 — 비상구 provider (위 DEFAULT_MODELS 주석 참고)."""
    import requests

    key = _api_key(("OPENAI_API_KEY", "OPENAI_KEY"), "openai")
    resp = requests.post(
        OPENAI_ENDPOINT,
        headers={"content-type": "application/json", "Authorization": f"Bearer {key}"},
        json={
            "model": model or DEFAULT_MODELS["openai"],
            "max_tokens": max_tokens,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        },
        timeout=180,
    )
    resp.raise_for_status()
    data = resp.json()
    if data.get("error"):
        sys.exit(f"openai error: {data['error']}")
    return data["choices"][0]["message"]["content"] or ""


def call_llm(system: str, user: str, *, provider: str = DEFAULT_PROVIDER, max_tokens: int = 8192, model: str | None = None) -> str:
    if provider == "anthropic":
        return call_claude(system, user, max_tokens=max_tokens, model=model)
    if provider == "openai":
        return call_openai(system, user, max_tokens=max_tokens, model=model)
    sys.exit(f"알 수 없는 provider: {provider!r} (anthropic|openai)")


# ---------------------------------------------------------------------------
# 프롬프트
# ---------------------------------------------------------------------------

def build_prompt(theme_key: str, seeds: list[dict], icon_names: list[str]) -> tuple[str, str]:
    situations = [
        {
            "title": s.get("title"),
            "tagline": s.get("tagline"),
            "brief": s.get("brief"),
            "goals": s.get("goals"),
            "keyPhrases": s.get("keyPhrases"),
        }
        for s in seeds
    ]
    system = (
        "You are building a clinical-English vocabulary bank for Korean nurses learning "
        "workplace English for a US hospital. You will be given ALL the distinct situations "
        "that belong to one learning theme. Produce a word bank that those situations would "
        "actually use in real speech — not generic English filler words.\n\n"
        f"Produce AT LEAST {MIN_WORDS} words. Prefer more if the situations' vocabulary supports it. "
        "Each word must be something a nurse would plausibly say or hear in at least one of the "
        "given situations (a term, an action verb, a body part, an object, a clinical concept). "
        "Do not include a word merely because it is common English; include it because these "
        "situations need it.\n\n"
        "Return ONLY a JSON array (no markdown fences, no commentary), each element:\n"
        '  {"id": "w-<kebab-slug>", "en": "<headword, lowercase, singular base form>", '
        '"ipa": "/.../", "ko": "<Korean gloss>", "icon": "<one of the allowed icon names>", '
        '"example": "<one natural English sentence using the word>"}\n\n'
        "Rules:\n"
        "- `id` is unique within this response, kebab-case, prefixed `w-`.\n"
        "- `en` is the base/dictionary form (singular noun, base verb) so the sentence generator "
        "can inflect it — do not pre-inflect (e.g. 'check', not 'checking').\n"
        "- `en` may be a short multi-word term when the concept is genuinely a fixed phrase "
        "(e.g. 'wristband', 'call bell'), but prefer single words.\n"
        "- `icon` MUST be exactly one of this allowed set (case-sensitive): "
        + ", ".join(icon_names) + ". If nothing fits well, use '" + FALLBACK_ICON + "'.\n"
        "- `example` is one short, natural sentence — the kind actually said in these situations.\n"
        "- No duplicate `en` headwords.\n"
    )
    user = json.dumps({"theme": theme_key, "situations": situations}, ensure_ascii=False, indent=2)
    return system, user


# ---------------------------------------------------------------------------
# 파싱 / 검증 / 삽입
# ---------------------------------------------------------------------------

def extract_json_array(text: str) -> list[dict]:
    text = text.strip()
    # 모델이 markdown 펜스를 붙였을 수 있다 — 관대하게 벗긴다.
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


def validate_words(words: list[dict], icon_names: set[str]) -> list[str]:
    problems = []
    if len(words) < MIN_WORDS:
        problems.append(f"단어 {len(words)}개 (최소 {MIN_WORDS}개 필요)")
    seen_ids: set[str] = set()
    for i, w in enumerate(words):
        for field in ("id", "en", "ko", "example"):
            if not w.get(field):
                problems.append(f"word[{i}]: '{field}' 비어 있음")
        wid = w.get("id", "")
        if wid in seen_ids:
            problems.append(f"word[{i}]: id 중복 '{wid}'")
        seen_ids.add(wid)
        if w.get("icon") not in icon_names:
            problems.append(f"word[{i}] id={wid}: icon '{w.get('icon')}' 허용 목록에 없음 -> '{FALLBACK_ICON}'로 대체")
            w["icon"] = FALLBACK_ICON
    return problems


def format_lexicon_block(theme_key: str, words: list[dict]) -> str:
    entry = [{"theme": theme_key, "words": words}]
    return yaml.safe_dump(entry, allow_unicode=True, sort_keys=False, default_flow_style=False, width=4096)


def existing_themes(dept: str) -> dict[str, dict]:
    path = LEXICON_DIR / f"{dept}.yaml"
    if not path.exists():
        return {}
    return vlc.parse_lexicon(path.read_text())


def append_lexicon(dept: str, theme_key: str, words: list[dict]) -> pathlib.Path:
    LEXICON_DIR.mkdir(parents=True, exist_ok=True)
    path = LEXICON_DIR / f"{dept}.yaml"
    block = format_lexicon_block(theme_key, words)
    if path.exists():
        existing = path.read_text()
        if existing and not existing.endswith("\n"):
            existing += "\n"
        path.write_text(existing + block)
    else:
        header = (
            f"# {dept.upper()} 주제별 단어 은행 (v44 STEP 1). gen_lexicon.py가 주제 하나마다\n"
            "# 이 파일에 새 theme 블록을 추가한다(기존 블록은 건드리지 않는다).\n"
        )
        path.write_text(header + block)
    return path


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dept", required=True, help="예: er")
    ap.add_argument("--theme", help="주제 key 하나로 좁힌다 (생략하면 그 부서의 모든 주제)")
    ap.add_argument(
        "--provider", default=DEFAULT_PROVIDER, choices=("anthropic", "openai"),
        help=f"기본 {DEFAULT_PROVIDER}. 실제 콘텐츠 생성은 anthropic(Sonnet)을 쓴다 — openai는 비상구(위 주석 참고)",
    )
    ap.add_argument("--model", default=None, help="기본은 provider별 DEFAULT_MODELS")
    ap.add_argument("--dry-run", action="store_true", help="파일에 쓰지 않고 결과만 출력한다")
    args = ap.parse_args()

    topics_path = TOPICS_DIR / f"{args.dept}.yaml"
    if not topics_path.exists():
        sys.exit(f"{topics_path} 없음")
    seeds = vlc.parse_topics(topics_path.read_text())

    themes_in_dept: dict[str, list[dict]] = {}
    for s in seeds:
        themes_in_dept.setdefault(s.get("theme"), []).append(s)

    target_themes = [args.theme] if args.theme else sorted(themes_in_dept)
    icon_names = load_icon_names()
    icon_set = set(icon_names)
    already = existing_themes(args.dept)

    for theme_key in target_themes:
        theme_seeds = themes_in_dept.get(theme_key)
        if not theme_seeds:
            print(f"[skip] {theme_key}: {args.dept}.yaml에 이 주제의 시드가 없다")
            continue
        if theme_key in already and already[theme_key]:
            print(f"[skip] {theme_key}: 이미 렉시콘에 있음 ({len(already[theme_key])}개 단어) — 건너뜀")
            continue

        model_label = args.model or DEFAULT_MODELS.get(args.provider, "?")
        print(f"[gen] {theme_key}: 상황 {len(theme_seeds)}건으로 단어 은행 생성 중 (provider={args.provider} model={model_label})...")
        system, user = build_prompt(theme_key, theme_seeds, icon_names)
        raw = call_llm(system, user, provider=args.provider, model=args.model)
        words = extract_json_array(raw)
        problems = validate_words(words, icon_set)
        for p in problems:
            print(f"  ! {p}")
        hard_fail = any("최소" in p or "비어 있음" in p or "id 중복" in p for p in problems)
        if hard_fail:
            sys.exit(f"{theme_key}: 생성 결과가 최소 기준을 못 채웠다 — 위 문제를 보고 프롬프트를 고쳐라")

        print(f"  -> {len(words)}개 단어 생성됨")
        for w in words:
            print(f"     {w['id']:24s} {w['en']:20s} {w.get('ko','')}")

        if args.dry_run:
            print(f"  (dry-run) {theme_key}: 파일에 쓰지 않음")
            continue

        path = append_lexicon(args.dept, theme_key, words)
        print(f"  written -> {path}")


if __name__ == "__main__":
    main()
