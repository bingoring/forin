#!/usr/bin/env python3
"""v44 4단계 학습 콘텐츠(단어 은행 · 문장)의 상호 참조가 실제로 맞는지 검사한다.

설계는 `docs/dlc/projects/forin/02-construction/lesson-four-steps-v44/`의
build-spec-index.md §2·§2-1·§2-2·§6, implementation-plan.md §B에 있다.

생성기(gen_lexicon.py · gen_sentences.py)보다 **먼저** 쓴 도구다. STEP 1(단어)은 따로 저작하지
않고 STEP 2 문장이 참조한 은행 단어를 모아서 만들기 때문에, 그 참조가 실제로 맞다는 것을
검사할 수 있어야 생성기의 결과를 믿을 수 있다.

    python3 verify_lesson_content.py --dept er
    python3 verify_lesson_content.py --dept er --theme core-safety-er
    python3 verify_lesson_content.py --selftest      # 손으로 만든 어긋난 표본으로 이 도구 자체를 검증

## 검사 항목 (build-spec-index.md §2가 요구하는 것)

    V1  문장의 words id가 그 주제(theme) 은행에 있다
    V2  그 단어가 문장의 en에 실제로 나온다 (어형 변화 포함)
    V3  상황마다 문장 5개 이상, 그 문장들이 모은 단어 8개 이상 (최솟값)
    V4  시드의 keyPhrases 3개가 문장에 모두 들어 있다 (사람이 저작·검토한 문장 — 버리지 않는다)
    V5  chunks를 이으면 en과 같다 (조립 문제가 풀리도록)
    V6  goal이 시드 goals 범위 안이다
    V7  은행 단어가 어느 문장에도 안 쓰이면 경고 (오류 아님 — 은행이 부풀기만 하는 것을 막는다)
    V8  청크가 실제로 문장을 쪼갠다 (조립 문제에 풀 것이 있도록)
    V9  청크가 구를 가로질러 자르지 않는다 (의미로 순서를 정할 수 있도록)

V1~V6·V8·V9는 오류(비정상 종료 코드), V7은 경고(항상 종료 코드에 영향 없음)다.

## V9 — 왜 V8만으로도 부족한가

V8은 조각의 **개수**를 센다. 그래서 문장을 기계적으로 n등분해도 통과한다. 실제로 그런 결과가
나왔다.

    ['On a scale of', 'one to ten, how', 'bad is the', 'pain right now', '?']
    ['Your heart rate is', 'a bit fast, so', "we'll keep a close", 'eye on you', '.']

`bad is the`도 `we'll keep a close`도 구가 아니다. 조각이 의미 단위가 아니면 학습자는 뜻으로
순서를 정할 수 없고 **위치를 외워야** 한다 — 배우는 것이 달라진다.

의미 단위인지를 기계가 온전히 판정할 수는 없다. 그래서 **절대 그럴 리 없는 경우만** 잡는다:
조각이 관사(`the`·`a`·`an`)나 `of`로 끝나면 그 조각은 다음 말과 떨어질 수 없다. 이 규칙은
오탐이 거의 없고(손으로 쪼갠 주제 여섯 개에서 한 건도 걸리지 않았다) 기계적 n등분은 대부분
걸린다.

나머지는 규칙으로 닿지 않는다. 지시서가 "구 경계에서 쪼개라"고 말하고 사람이 표본을 본다.

## V8 — 왜 V5만으로는 부족한가

V5는 "조각을 이으면 원문이 된다"만 본다. 그래서 조각이 통째로 하나여도 통과한다.

    chunks: ["Can you state your full name for me", "?"]   ← V5 통과. 그러나 풀 것이 없다

청크 조립은 문장을 의미 단위로 쪼개 순서대로 붙이는 연습이다. 조각이 하나면 화면에 조각
하나와 물음표 하나가 놓일 뿐이고, 학습자는 아무것도 배우지 않는다. 실제로 첫 생성 결과가
그렇게 나왔다.

그래서 **문장 길이에 비례한 최소 조각 수**를 본다. 구두점만으로 이루어진 조각은 세지 않는다 —
`"?"`는 쪼갠 것이 아니다.

    낱말 4개 이하  → 조각 2개 이상   (짧은 문장까지 억지로 쪼개지 않는다)
    낱말 5~8개     → 조각 3개 이상
    낱말 9개 이상  → 조각 4개 이상

핸드오프의 본보기가 이 규칙을 통과한다: "I need to check your wristband every time."은 낱말
8개에 조각 4개다.

## V2 판정 규칙 — 어형 변화를 어떻게 감안하는가

영어 어형 변화를 완전히 처리하는 형태소 분석기를 새로 들이는 대신, 이 저장소 규모(단어가
학회지 수준의 불규칙 변화를 요구하지 않는 임상 용어 위주)에 맞는 **의도적으로 단순한 규칙**을
쓴다. `stem()`이 하는 일:

    -ies 로 끝나면 y로 되돌린다   (allergies → allergy)
    -ing 로 끝나면 없앤다         (checking  → check)
    -ed  로 끝나면 없앤다         (checked   → check)
    -es  로 끝나면 없앤다         (watches   → watch)
    -s   로 끝나면 없앤다 (-ss 제외) (wristbands → wristband)

문장의 각 토큰과 단어의 각 토큰에 같은 규칙을 적용한 뒤 스템이 같으면 나온 것으로 본다.
단어가 여러 토큰으로 된 구(예: "check in")면 그 토큰 시퀀스가 문장 토큰 시퀀스에 연속으로
나오는지를 스템 기준으로 본다 — 단일 단어는 이 시퀀스 길이가 1인 특수한 경우일 뿐이다.

알려진 한계(허용): 자음 두 배(stop/stopping → stem이 "stopp"/"stop"으로 갈려 불일치),
불규칙 동사(go/went), 불규칙 복수(child/children)는 잡지 못한다. 이 저장소의 임상 용어는
대부분 규칙 변화이므로(check/checking, wristband/wristbands, allergy/allergies) 실용적
타협으로 본다. 어긋나면 V2가 그 사례를 정확히 짚어 주므로, 프롬프트를 더 쉬운 어형으로
유도하거나 이 규칙을 넓히면 된다.

## V5 이음 규칙 — Go 쪽(`server/internal/domain/content/lexicon.go` `JoinChunks`)과 그대로 맞춘다

이 파일을 처음 쓸 때는 Task A(Go 쪽 스키마)가 아직 이 규칙을 커밋하기 전이었다. 이후
`server/internal/domain/content/lexicon.go`에 `JoinChunks`가 랜딩된 것을 확인하고 **그 규칙
그대로**를 옮겼다 — 두 벌이 달라지면 파이썬은 통과하는데 서버가 거절하는 일이 생기기 때문이다.

    1. 조각은 기본적으로 정확히 스페이스 한 칸으로 이어진다.
    2. 조각이 `,` `.` `?` `!` 넷 중 하나로 **시작**하면, 앞 조각에 스페이스 없이 바로 붙는다
       (영어는 이 문장부호 앞에 스페이스를 두지 않는다).

그래서 `["Let me check your wristband", "?"]`는 "Let me check your wristband?"로,
`["wristband", ", right", "?"]`는 "wristband, right?"로 이어진다. 문장부호는 **그 자체가 별도
조각**이다 — 마지막 조각에서 문장부호를 없애는 방식이 아니다. `en`과 완전히 동일해야 하고,
끝 문장부호를 빼고 비교하는 예외는 없다.
"""
from __future__ import annotations

import argparse
import collections
import pathlib
import re
import sys
from dataclasses import dataclass

import yaml

TOOLS_DIR = pathlib.Path(__file__).resolve().parent
CONTENT_DIR = TOOLS_DIR.parent
LEXICON_DIR = CONTENT_DIR / "nurse" / "lexicon"
TOPICS_DIR = CONTENT_DIR / "nurse" / "topics"

MIN_SENTENCES = 5
MIN_WORDS = 8

TOKEN_RE = re.compile(r"[A-Za-z']+")
# JoinChunks의 "스페이스 없이 붙는" 문장부호 집합 — Go 쪽과 정확히 같은 네 글자.
SENTENCE_PUNCT_START = (",", ".", "?", "!")


# ---------------------------------------------------------------------------
# 파싱 — 파일 경로와 분리해 두어 selftest가 실제 파일 없이 이 함수들을 재사용한다.
# ---------------------------------------------------------------------------

def parse_lexicon(raw: str) -> dict[str, dict[str, dict]]:
    """theme -> {word_id: word_dict}."""
    data = yaml.safe_load(raw) or []
    out: dict[str, dict[str, dict]] = {}
    for entry in data:
        theme = entry.get("theme")
        words = {w["id"]: w for w in (entry.get("words") or []) if w.get("id")}
        out[theme] = words
    return out


def parse_topics(raw: str) -> list[dict]:
    return yaml.safe_load(raw) or []


def load_lexicon(dept: str) -> dict[str, dict[str, dict]]:
    path = LEXICON_DIR / f"{dept}.yaml"
    if not path.exists():
        return {}
    return parse_lexicon(path.read_text())


def load_topics(dept: str) -> list[dict]:
    path = TOPICS_DIR / f"{dept}.yaml"
    if not path.exists():
        return []
    return parse_topics(path.read_text())


# ---------------------------------------------------------------------------
# V2 — 어형 변화를 감안한 포함 판정
# ---------------------------------------------------------------------------

def tokenize(text: str) -> list[str]:
    return TOKEN_RE.findall((text or "").lower())


# 불규칙 동사 — 규칙으로는 닿지 않는다. 이 자리에서 다루는 어휘는 임상 회화라 범위가
# 좁으므로, 실제로 부딪힌 것부터 적어 둔 작은 표로 충분하다. 표에 없어서 어긋나면 V2가
# 그 사례를 정확히 짚어 주므로 그때 한 줄 더하면 된다.
IRREGULAR = {
    "gave": "give", "given": "give",
    "took": "take", "taken": "take",
    "went": "go", "gone": "go",
    "came": "come",
    "saw": "see", "seen": "see",
    "got": "get", "gotten": "get",
    "told": "tell",
    "felt": "feel",
    "kept": "keep",
    "left": "leave",
    "brought": "bring",
    "held": "hold",
    "found": "find",
    "said": "say",
    "made": "make",
    "put": "put", "let": "let", "set": "set", "hurt": "hurt", "cut": "cut",
    "ran": "run", "began": "begin", "broke": "break", "broken": "break",
    "fell": "fall", "fallen": "fall",
    "lay": "lie", "lain": "lie",
    "woke": "wake", "woken": "wake",
    "wore": "wear", "worn": "wear",
    # 아래는 ER 콘텐츠를 만들며 실제로 부딪혔거나, 임상 회화에서 흔해 미리 채운 것들.
    "understood": "understand",
    "thought": "think",
    "spoke": "speak", "spoken": "speak",
    "wrote": "write", "written": "write",
    "drank": "drink", "drunk": "drink",
    "ate": "eat", "eaten": "eat",
    "slept": "sleep",
    "sat": "sit",
    "stood": "stand",
    "lost": "lose",
    "sent": "send",
    "spent": "spend",
    "meant": "mean",
    "built": "build",
    "caught": "catch",
    "taught": "teach",
    "bought": "buy",
    "fought": "fight",
    "heard": "hear",
    "led": "lead",
    "bled": "bleed",
    "fed": "feed",
    "met": "meet",
    "swollen": "swell", "swelled": "swell",
    "bit": "bite", "bitten": "bite",
    "chose": "choose", "chosen": "choose",
    "felt": "feel",
}

# 끝의 `s`를 떼면 안 되는 꼬리. `focus`·`status`·`analysis`는 복수형이 아니다.
NOT_PLURAL_TAIL = ("ss", "us", "is", "as")

VOWELS = "aeiou"


def stem(tok: str) -> str:
    """어형을 한 자리로 모은다. 사전이 없으므로 규칙만으로 하되, **양쪽을 같은 자리로**
    모으는 것이 목적이지 올바른 원형을 복원하는 것이 목적이 아니다.

    다섯 가지를 본다. 전부 실제로 콘텐츠를 만들다 부딪힌 것들이다.

    ⑥ **비교급은 다루지 않는다.** `-er`은 `number`를 `numb`(저리다)로 만들고, `-ier`은
       `identifier`(신원 확인 항목)를 `identify`로 만들어 `identifiers`와 어긋나게 한다.
       둘 다 임상에서 흔해 오탐의 값이 비싸다. 실제로 `-ier`을 넣었다가 이미 만든 주제의
       "I always confirm two identifiers for every patient."가 깨졌다. 얻는 것은
       `easy`/`easier` 한 사례이고 잃는 것은 만들어 둔 콘텐츠라, 넣지 않는다.
    ⓪ 소유격 `'s`를 먼저 뗀다(`doctor's`→`doctor`). 토크나이저가 어퍼스트로피를 붙여
       한 토큰으로 잡기 때문이다.
    ① 불규칙 동사(`gave`→`give`)는 표로 본다.
    ② `-ied`는 `y`로 되돌린다(`tried`→`try`). 일반 `-ed` 규칙이 `tri`를 만들어 어긋났다.
    ③ 끝의 겹자음은 **언제나** 하나로 줄인다(`dropp`→`drop`, `fill`→`fil`). 어미를 뗀 뒤에만
       줄이면 `fill`을 지키려다 `control`/`controlled`가 어긋난다 — 둘을 규칙으로 가를 수
       없으므로, 대신 양쪽을 같은 자리로 모은다(⑤와 같은 수법).
    ④ 끝의 `s`는 `ss`·`us`·`is`·`as`로 끝나면 떼지 않는다. `focus`가 `focu`가 되어
       `focused`(→`focus`)와 어긋났다.
    ⑤ 마지막에 끝의 `e`를 뗀다. `-es` 규칙이 두 글자를 자르는 탓에 `medicines`→`medicin`이
       원형 `medicine`과 어긋나던 것을 양쪽에서 맞춘다.

    ③·⑤의 대가로 `fill`과 `fil`, `car`와 `care`가 한자리에 모인다. V2가 묻는 것은 "적어 둔 단어를 정말
    썼는가"이므로, 드문 오탐은 체계적인 누락보다 훨씬 싸다.

    `identify`와 `identification`은 여전히 어긋난다 — 명사화는 인정하지 않는다.
    """
    t = tok.lower()
    for poss in ("'s", "\u2019s"):
        if t.endswith(poss) and len(t) > len(poss) + 1:
            t = t[: -len(poss)]
            break
    if t in IRREGULAR:
        t = IRREGULAR[t]
    elif t.endswith("ies") and len(t) > 4:
        t = t[:-3] + "y"
    elif t.endswith("ied") and len(t) > 4:
        t = t[:-3] + "y"
    elif t.endswith("ing") and len(t) > 5:
        t = t[:-3]
    elif t.endswith("ed") and not t.endswith("eed") and len(t) > 4:
        # `-eed`는 자르지 않는다. `bleed`·`feed`·`need`·`speed`는 어미가 아니라 낱말
        # 자체이고, 자르면 `bleed`가 `ble`이 되어 `bleeding`(→`bleed`)과 어긋난다.
        # 전부 임상에서 흔한 말이다. (`agreed`처럼 어간이 e로 끝나 d만 붙는 경우는
        # 이 예외에 걸려 `agree`와 어긋난다 — 이 분야에서 드물어 감수한다.)
        t = t[:-2]
    elif t.endswith("es") and len(t) > 4:
        t = t[:-2]
    elif t.endswith("s") and not t.endswith(NOT_PLURAL_TAIL) and len(t) > 3:
        t = t[:-1]
    if t.endswith("e") and len(t) > 3:
        t = t[:-1]
    return _undouble(t)


def _undouble(t: str) -> str:
    """끝의 겹자음을 하나로 줄인다. `dropp`→`drop`, `fill`→`fil`, `controll`→`control`.

    예외를 두지 않는 것이 핵심이다. 한때 `l`·`s`·`z`를 건드리지 않아 `fill`/`filled`를
    지켰는데, 그 예외가 `control`/`controlled`를 깨뜨렸다 — `controlled`에서 어미를 떼면
    `controll`이 되고, 예외 탓에 `control`로 줄지 않는다. 둘은 규칙으로 가를 수 없다
    (`fill`은 원래 겹쳐 있고 `control`은 어미가 겹치게 만든다).

    그래서 원형을 복원하려 들지 않고 **양쪽을 같은 자리로 모은다.** `fill`도 `filled`도
    `fil`이 되고, `control`도 `controlled`도 `control`이 된다."""
    if len(t) > 2 and t[-1] == t[-2] and t[-1] not in VOWELS:
        return t[:-1]
    return t


def word_appears(sentence_en: str, word_en: str) -> bool:
    """word_en(단일 단어 또는 구)이 sentence_en에 어형 변화를 감안하고 나오는가."""
    word_stems = [stem(t) for t in tokenize(word_en)]
    if not word_stems:
        return False
    sent_stems = [stem(t) for t in tokenize(sentence_en)]
    n, m = len(sent_stems), len(word_stems)
    for i in range(n - m + 1):
        if sent_stems[i : i + m] == word_stems:
            return True
    return False


# ---------------------------------------------------------------------------
# V5 — 청크 이음 규칙. Go `JoinChunks`와 바이트 단위로 같은 규칙(위 docstring 참고).
# ---------------------------------------------------------------------------

def chunks_join(chunks: list[str]) -> str:
    out: list[str] = []
    for i, c in enumerate(chunks):
        if i > 0 and c[:1] not in SENTENCE_PUNCT_START:
            out.append(" ")
        out.append(c)
    return "".join(out)


# V9 — 이것으로 끝나는 조각은 다음 말과 떨어질 수 없다.
DANGLING_TAIL = {"the", "a", "an", "of"}


def dangling_chunks(chunks: list[str]) -> list[str]:
    """구를 가로질러 잘린 것이 분명한 조각들.

    **뒤에 실질 내용이 있을 때만** 매달린 것이다. 문장 끝의 전치사가 자기 조각인 경우
    (`['that you know', 'of', '?']`)는 뒤에 구두점밖에 없으므로 잘린 것이 아니다 —
    "that you know of"는 온전한 영어다."""
    out = []
    for i, c in enumerate(chunks):
        rest = "".join(chunks[i + 1 :])
        if not rest.strip(" " + "".join(SENTENCE_PUNCT_START)):
            continue  # 뒤가 구두점뿐이다
        toks = c.strip().rstrip(",;:").split()
        if toks and toks[-1].lower() in DANGLING_TAIL:
            out.append(c)
    return out


def meaningful_chunks(chunks: list[str]) -> int:
    """구두점만으로 이루어진 조각은 쪼갠 것이 아니므로 세지 않는다."""
    return sum(1 for c in chunks if c.strip(" " + "".join(SENTENCE_PUNCT_START)))


def min_chunks_for(en: str) -> int:
    """문장 길이에 비례한 최소 조각 수. 위 docstring의 표 그대로."""
    words = len([w for w in en.split() if w.strip(" " + "".join(SENTENCE_PUNCT_START))])
    if words <= 4:
        return 2
    if words <= 8:
        return 3
    return 4


def assembles_to(chunks: list[str], en: str) -> bool:
    if not chunks:
        return False
    return chunks_join(chunks) == (en or "")


# ---------------------------------------------------------------------------
# 검사 본체
# ---------------------------------------------------------------------------

@dataclass
class Violation:
    dept: str
    theme: str
    title: str
    rule: str
    detail: str

    def __str__(self) -> str:
        return f"[{self.rule}] {self.dept}/{self.theme}/{self.title!r}: {self.detail}"


def verify_dept(
    dept: str,
    lexicon: dict[str, dict[str, dict]],
    seeds: list[dict],
    theme_filter: str | None = None,
) -> tuple[list[Violation], list[Violation], dict]:
    """한 부서의 (렉시콘, 시드 목록)을 검사한다.

    돌려주는 것: (오류 목록, 경고 목록, 커버리지 통계).
    """
    violations: list[Violation] = []
    used_words_by_theme: dict[str, set[str]] = collections.defaultdict(set)
    themes_seen: set[str] = set()

    n_seeds = n_with_sentences = 0

    for seed in seeds:
        theme = seed.get("theme")
        if theme_filter and theme != theme_filter:
            continue
        n_seeds += 1
        themes_seen.add(theme)
        sentences = seed.get("sentences")
        if not sentences:
            continue  # 아직 2차가 안 돌았다 — 이 시드는 검사 대상이 아니다 (부분 실행 정상)
        n_with_sentences += 1

        title = seed.get("title", "?")
        bank = lexicon.get(theme, {})
        goals = seed.get("goals") or []
        key_phrases = seed.get("keyPhrases") or []

        collected_word_ids: set[str] = set()

        for i, sent in enumerate(sentences):
            en = sent.get("en", "")
            words = sent.get("words") or []
            chunks = sent.get("chunks") or []
            goal = sent.get("goal")

            # V1
            missing = [w for w in words if w not in bank]
            if missing:
                violations.append(
                    Violation(dept, theme, title, "V1", f"sentence[{i}] references unknown word id(s) {missing}")
                )

            # V2 (V1에서 이미 없다고 잡은 id는 건너뛴다 — 중복 보고 방지)
            for w in words:
                wdef = bank.get(w)
                if wdef is None:
                    continue
                if not word_appears(en, wdef.get("en", "")):
                    violations.append(
                        Violation(
                            dept, theme, title, "V2",
                            f"sentence[{i}] word {w} ('{wdef.get('en')}') not found in en: {en!r}",
                        )
                    )

            # V5
            if not assembles_to(chunks, en):
                violations.append(
                    Violation(dept, theme, title, "V5", f"sentence[{i}] chunks {chunks!r} joined != en {en!r}")
                )

            # V8 — 쪼개긴 쪼갰는가. V5(이으면 원문이 된다)만으로는 통째로 하나여도 통과한다.
            want = min_chunks_for(en)
            got = meaningful_chunks(chunks)
            if got < want:
                violations.append(
                    Violation(
                        dept, theme, title, "V8",
                        f"sentence[{i}] has {got} meaningful chunk(s), want >= {want} "
                        f"for a {len(en.split())}-word sentence: {chunks!r}",
                    )
                )

            # V9 — 구를 가로질러 자르지 않았는가.
            dangling = dangling_chunks(chunks)
            if dangling:
                violations.append(
                    Violation(
                        dept, theme, title, "V9",
                        f"sentence[{i}] chunk(s) end mid-phrase {dangling!r}: {chunks!r}",
                    )
                )

            # V6
            if not isinstance(goal, int) or not (1 <= goal <= len(goals)):
                violations.append(
                    Violation(dept, theme, title, "V6", f"sentence[{i}] goal={goal!r} out of range 1..{len(goals)}")
                )

            collected_word_ids.update(w for w in words if w in bank)
            used_words_by_theme[theme].update(w for w in words if w in bank)

        # V3
        if len(sentences) < MIN_SENTENCES:
            violations.append(
                Violation(dept, theme, title, "V3", f"only {len(sentences)} sentences (need >= {MIN_SENTENCES})")
            )
        if len(collected_word_ids) < MIN_WORDS:
            violations.append(
                Violation(
                    dept, theme, title, "V3",
                    f"only {len(collected_word_ids)} distinct bank words used (need >= {MIN_WORDS})",
                )
            )

        # V4
        sentence_ens = {(s.get("en") or "").strip() for s in sentences}
        for kp in key_phrases:
            if kp.strip() not in sentence_ens:
                violations.append(
                    Violation(dept, theme, title, "V4", f"keyPhrase not found verbatim among sentences: {kp!r}")
                )

    # V7 — theme 단위 경고. 그 theme의 모든 시드가 아직 2차를 안 거쳤으면(부분 실행) 대부분의
    # 은행 단어가 "안 쓰임"으로 잡히는 것이 정상이다 — 오류가 아니라 경고인 이유이기도 하다.
    warnings: list[Violation] = []
    for theme, bank in lexicon.items():
        if theme_filter and theme != theme_filter:
            continue
        used = used_words_by_theme.get(theme, set())
        unused = sorted(wid for wid in bank if wid not in used)
        if unused:
            warnings.append(
                Violation(dept, theme, "-", "V7", f"{len(unused)}/{len(bank)} bank word(s) unused: {unused}")
            )

    coverage = {"seeds": n_seeds, "with_sentences": n_with_sentences, "themes": sorted(themes_seen)}
    return violations, warnings, coverage


# ---------------------------------------------------------------------------
# selftest — 손으로 만든 어긋난 표본으로 이 도구 자체를 검증한다
# ---------------------------------------------------------------------------

_LEX_BASE = """
- theme: t1
  words:
    - {id: w-wristband, en: wristband, ipa: /x/, ko: 손목밴드, icon: bandage, example: e}
    - {id: w-check, en: check, ipa: /x/, ko: 확인, icon: board, example: e}
    - {id: w-allergy, en: allergy, ipa: /x/, ko: 알레르기, icon: bell, example: e}
    - {id: w-name, en: name, ipa: /x/, ko: 이름, icon: board, example: e}
    - {id: w-birth, en: birthdate, ipa: /x/, ko: 생년월일, icon: calendar, example: e}
    - {id: w-band, en: band, ipa: /x/, ko: 밴드, icon: bandage, example: e}
    - {id: w-verify, en: verify, ipa: /x/, ko: 대조하다, icon: magnify, example: e}
    - {id: w-record, en: record, ipa: /x/, ko: 기록, icon: board, example: e}
"""

_SEED_HEADER = """
- theme: t1
  title: T
  keyPhrases: ["Can you tell me your name and birthdate?"]
  goals: [g1, g2]
"""


def _seed_with_sentences(sentences_yaml: str) -> str:
    return _SEED_HEADER + sentences_yaml


def _good_sentences() -> str:
    # V1~V6를 모두 통과하는 대조군 — 8개 은행 단어를 5문장에 걸쳐 쓰고, keyPhrase 1개를
    # 그대로 한 문장으로 포함한다 (테스트 keyPhrases는 1개만 두었다 — spec은 3개를 요구하지만
    # 대조군은 판정 로직 자체를 보이는 것이 목적이라 개수를 줄여도 규칙 검증에는 지장이 없다).
    # V5 규칙대로, 끝 문장부호는 그 자체가 별도 조각이다(JoinChunks와 동일).
    return """
  sentences:
    - en: "Can you tell me your name and birthdate?"
      ko: "이름과 생년월일을 말씀해 주시겠어요?"
      chunks: ["Can you tell me", "your name", "and birthdate", "?"]
      words: [w-name, w-birth]
      goal: 1
    - en: "Let me check your wristband."
      ko: "손목밴드를 확인할게요."
      chunks: ["Let me", "check your", "wristband", "."]
      words: [w-check, w-wristband]
      goal: 1
    - en: "I need to verify this against your record."
      ko: "이걸 기록과 대조해서 확인해야 해요."
      chunks: ["I need to", "verify this", "against your record", "."]
      words: [w-verify, w-record]
      goal: 2
    - en: "Do you have any allergy band on?"
      ko: "알레르기 밴드를 차고 계신가요?"
      chunks: ["Do you have", "any allergy band", "on", "?"]
      words: [w-allergy, w-band]
      goal: 2
    - en: "I'm checking your wristband and allergy record again."
      ko: "손목밴드와 알레르기 기록을 다시 확인하고 있어요."
      chunks: ["I'm checking", "your wristband", "and allergy record", "again", "."]
      words: [w-check, w-wristband, w-allergy, w-record]
      goal: 2
"""


# V2 어형 판정 자체를 재는 표본. 규칙이 사전 없이 도는 이상, 어느 쪽으로 틀렸는지는
# 이렇게 양방향으로 고정해 두어야 안다 — 한쪽만 재면 "전부 통과"로 만드는 규칙도 통과한다.
_STEM_CASES = [
    # 실제로 걸렸던 것들 — 전부 ER 콘텐츠를 만들다 부딪힌 사례다.
    # ① e로 끝나는 단어의 평범한 복수형
    ("I have your medicines ready.", "medicine", True),
    ("Both samples are labeled.", "sample", True),
    ("Put on clean gloves first.", "glove", True),
    ("Check the tubes at the bedside.", "tube", True),
    ("Two names must match.", "name", True),
    # ② -ing/-ed 앞 자음 겹침
    ("Her pressure is dropping.", "drop", True),
    ("We stopped the drip.", "stop", True),
    # ③ 불규칙 동사
    ("I gave him the medicine.", "give", True),
    ("The nurse took him to CT.", "take", True),
    ("He felt dizzy after standing.", "feel", True),
    ("I told the doctor already.", "tell", True),
    # ④ -ied
    ("We tried a lower dose.", "try", True),
    # ⑤ 복수형이 아닌데 s로 끝나는 낱말
    ("Stay focused on his breathing.", "focus", True),
    # 겹자음 — 원래 겹친 낱말도, 어미가 겹치게 만든 낱말도 양쪽이 맞아야 한다.
    ("He had a fall last night.", "fall", True),
    ("Please stay still.", "still", True),
    ("The syringe is filled.", "fill", True),
    ("From nursing, her pain is controlled but mobility is poor.", "control", True),
    # ⑥ 소유격
    ("Please confirm the accepting doctor's name before transport.", "doctor", True),
    # ⑦ 표에 넣은 불규칙 동사
    ("Please tell me back what you understood.", "understand", True),
    ("Have you thought about hurting yourself?", "think", True),
    ("He bled through the dressing.", "bleed", True),
    # ⑧ 원래 -eed로 끝나는 낱말은 어미로 보지 않는다
    ("She is bleeding from the wound.", "bleed", True),
    ("We are feeding him slowly.", "feed", True),
    ("He needed two units.", "need", True),
    # 비교급을 넣지 않은 이유 — 둘 다 오탐의 값이 비싸다.
    ("What is the room number?", "numb", False),
    ("Is your arm numb?", "numb", True),
    ("I always confirm two identifiers for every patient.", "identifier", True),
    # 원래 되던 것들 — 고치면서 깨지지 않아야 한다.
    ("Do you have any allergies?", "allergy", True),
    ("I am checking your wristband.", "check", True),
    ("Let me check your wristband.", "wristband", True),
    # 인정하지 않기로 한 것 — 명사화.
    ("We need identification first.", "identify", False),
    # 아예 없는 것.
    ("The doctor is here.", "wristband", False),
    # s를 떼면 안 되는 낱말이 엉뚱한 것과 맞으면 안 된다.
    ("His status is stable.", "stat", False),
]


def run_stem_selftest() -> int:
    bad = 0
    for sent, word, want in _STEM_CASES:
        got = word_appears(sent, word)
        if got != want:
            bad += 1
            print(f"[FAIL] word_appears({word!r}, {sent!r}) = {got}, want {want}")
    print(f"[{'PASS' if bad == 0 else 'FAIL'}] V2 어형 판정 {len(_STEM_CASES)}건")
    return bad


def run_selftest() -> int:
    cases: list[tuple[str, str, str, str, bool]] = []
    # (name, lex_yaml, seeds_yaml, expected_rule, is_warning)

    # 대조군 — 아무 규칙도 걸리지 않아야 한다.
    cases.append(("GOOD (no violations expected)", _LEX_BASE, _seed_with_sentences(_good_sentences()), "", False))

    # V1 — 존재하지 않는 단어 id를 참조한다.
    v1 = """
  sentences:
    - en: "I like the apple."
      ko: "나는 사과를 좋아해요."
      chunks: ["I like the", "apple."]
      words: [w-name, w-ghost]
      goal: 1
    - en: "Let me check your wristband."
      ko: "손목밴드를 확인할게요."
      chunks: ["Let me check", "your wristband."]
      words: [w-check, w-wristband]
      goal: 1
    - en: "I need to verify this against your record."
      ko: "이걸 기록과 대조해서 확인해야 해요."
      chunks: ["I need to verify", "this against your record."]
      words: [w-verify, w-record]
      goal: 2
    - en: "Do you have any allergy band on?"
      ko: "알레르기 밴드를 차고 계신가요?"
      chunks: ["Do you have any", "allergy band on?"]
      words: [w-allergy, w-band]
      goal: 2
    - en: "What is your birthdate?"
      ko: "생년월일이 어떻게 되세요?"
      chunks: ["What is", "your birthdate?"]
      words: [w-birth]
      goal: 1
"""
    cases.append(("V1 (unknown word id)", _LEX_BASE, _seed_with_sentences(v1), "V1", False))

    # V2 — id는 은행에 있지만 그 단어가 문장 en에 없다.
    v2 = _good_sentences().replace(
        'en: "Let me check your wristband."',
        'en: "Let me check your bandage."',
    )
    cases.append(("V2 (word id valid, text absent)", _LEX_BASE, _seed_with_sentences(v2), "V2", False))

    # V3 — 문장이 3개뿐이고 쓰인 단어도 4개뿐이다.
    v3 = """
  sentences:
    - en: "Can you tell me your name and birthdate?"
      ko: "이름과 생년월일을 말씀해 주시겠어요?"
      chunks: ["Can you tell me", "your name and birthdate?"]
      words: [w-name, w-birth]
      goal: 1
    - en: "Let me check your wristband."
      ko: "손목밴드를 확인할게요."
      chunks: ["Let me check", "your wristband."]
      words: [w-check, w-wristband]
      goal: 1
    - en: "I need to verify this."
      ko: "이걸 확인해야 해요."
      chunks: ["I need to verify", "this."]
      words: [w-verify]
      goal: 2
"""
    cases.append(("V3 (below minimums)", _LEX_BASE, _seed_with_sentences(v3), "V3", False))

    # V4 — keyPhrase가 어느 문장의 en과도 정확히 일치하지 않는다.
    v4 = _good_sentences().replace(
        'en: "Can you tell me your name and birthdate?"',
        'en: "Could you please tell me your name and birthdate?"',
    )
    cases.append(("V4 (keyPhrase not verbatim)", _LEX_BASE, _seed_with_sentences(v4), "V4", False))

    # V5 — chunks를 이어도 en이 되지 않는다 (중간 단어 누락).
    v5 = _good_sentences().replace(
        'chunks: ["Let me", "check your", "wristband", "."]',
        'chunks: ["Let me check wristband", "."]',
    )
    cases.append(("V5 (chunks don't assemble)", _LEX_BASE, _seed_with_sentences(v5), "V5", False))

    # V6 — goal이 goals 범위(1..2) 밖이다.
    v6 = _good_sentences().replace("goal: 2\n", "goal: 9\n", 1)
    cases.append(("V6 (goal out of range)", _LEX_BASE, _seed_with_sentences(v6), "V6", False))

    # V7 — 은행에 있는데 어느 문장에도 안 쓰이는 단어가 있다 (경고).
    # "record"·"verify"를 아예 안 쓰는 표본을 따로 만들어 명확히 한다.
    v7 = """
  sentences:
    - en: "Can you tell me your name and birthdate?"
      ko: "이름과 생년월일을 말씀해 주시겠어요?"
      chunks: ["Can you tell me", "your name and birthdate?"]
      words: [w-name, w-birth]
      goal: 1
    - en: "Let me check your wristband."
      ko: "손목밴드를 확인할게요."
      chunks: ["Let me check", "your wristband."]
      words: [w-check, w-wristband]
      goal: 1
    - en: "Do you have any allergy band on?"
      ko: "알레르기 밴드를 차고 계신가요?"
      chunks: ["Do you have any", "allergy band on?"]
      words: [w-allergy, w-band]
      goal: 2
    - en: "I'm checking again."
      ko: "다시 확인하고 있어요."
      chunks: ["I'm checking", "again."]
      words: [w-check]
      goal: 2
    - en: "One more check on your name."
      ko: "이름을 한 번 더 확인할게요."
      chunks: ["One more check", "on your name."]
      words: [w-check, w-name]
      goal: 1
"""
    cases.append(("V7 (unused bank word -> warning)", _LEX_BASE, _seed_with_sentences(v7), "V7", True))

    # V8 — 이으면 원문이 되지만 통째로 한 조각이다. V5는 통과하고 V8만 잡아야 한다.
    # 첫 생성 결과가 실제로 이 모양이었다: ["Can you state your full name for me", "?"].
    v8 = """
  sentences:
    - en: "Let me check your wristband now."
      ko: "지금 손목밴드를 확인할게요."
      chunks: ["Let me check your wristband now", "."]
      words: [w-check, w-wristband]
      goal: 1
""" + _good_sentences().split("  sentences:\n", 1)[1]
    cases.append(("V8 (one chunk, nothing to assemble)", _LEX_BASE, _seed_with_sentences(v8), "V8", False))

    # V9 — 조각 수는 넉넉한데 구를 가로질러 잘렸다. 문장을 기계적으로 n등분하면 이렇게 된다.
    # 실제로 그런 결과가 나왔다: ['On a scale of', 'one to ten, how', 'bad is the', ...].
    v9 = """
  sentences:
    - en: "Let me check the wristband now."
      ko: "지금 손목밴드를 확인할게요."
      chunks: ["Let me check the", "wristband", "now", "."]
      words: [w-check, w-wristband]
      goal: 1
""" + _good_sentences().split("  sentences:\n", 1)[1]
    cases.append(("V9 (chunk cut mid-phrase)", _LEX_BASE, _seed_with_sentences(v9), "V9", False))

    ok = True
    print("=== verify_lesson_content.py selftest ===")
    stem_bad = run_stem_selftest()
    for name, lex_yaml, seeds_yaml, want_rule, is_warning in cases:
        lexicon = parse_lexicon(lex_yaml)
        seeds = parse_topics(seeds_yaml)
        violations, warnings, _ = verify_dept("selftest", lexicon, seeds, theme_filter=None)
        pool = warnings if is_warning else violations
        if want_rule == "":
            hit = len(violations) == 0
            label = "no violations"
        else:
            hit = any(v.rule == want_rule for v in pool)
            label = f"{want_rule} fires"
        status = "PASS" if hit else "FAIL"
        if not hit:
            ok = False
        print(f"[{status}] {name} — expected {label}")
        if not hit:
            print("         violations:", [str(v) for v in violations])
            print("         warnings:  ", [str(v) for v in warnings])
    print()
    ok = ok and stem_bad == 0
    print("ALL PASS" if ok else "SOME FAILED")
    return 0 if ok else 1


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dept", help="예: er (생략하면 topics/*.yaml에 있는 모든 부서)")
    ap.add_argument("--theme", help="주제(theme) key 하나로 좁힌다")
    ap.add_argument("--selftest", action="store_true", help="이 도구 자체를 어긋난 표본으로 검증한다")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(run_selftest())

    depts = [args.dept] if args.dept else sorted(p.stem for p in TOPICS_DIR.glob("*.yaml"))

    total_violations = 0
    total_warnings = 0
    for dept in depts:
        lexicon = load_lexicon(dept)
        seeds = load_topics(dept)
        violations, warnings, coverage = verify_dept(dept, lexicon, seeds, args.theme)
        total_violations += len(violations)
        total_warnings += len(warnings)

        header = f"=== {dept} "
        if args.theme:
            header += f"(theme={args.theme}) "
        header += (
            f"— {coverage['with_sentences']}/{coverage['seeds']} situation(s) have sentences, "
            f"{len(coverage['themes'])} theme(s) touched ==="
        )
        print(header)
        if not violations and not warnings:
            print("  (문제 없음)")
        for v in violations:
            print(f"  {v}")
        for w in warnings:
            print(f"  (warning) {w}")
        print()

    print(f"TOTAL: {total_violations} violation(s), {total_warnings} warning(s) across {len(depts)} dept(s)")
    sys.exit(1 if total_violations else 0)


if __name__ == "__main__":
    main()
