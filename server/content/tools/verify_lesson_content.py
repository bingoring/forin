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

    V10 은행 안에 같은 id가 두 번 있다
    V11 은행 항목의 값이 문자열이 아니다 (따옴표 없는 off·on·no·yes)

v45 (build-spec-index.md §11 — Go 쪽 content/nuance.go 와 같은 규칙):

    V12 v45 은행의 모든 단어에 exKo·cue·tag·distractorsEn 2·distractorsKo 2·decoyChips ≥1이 있고,
        chips를 이음 규칙으로 이으면 en과 같다 (낱말 안의 조각은 붙이고 낱말 사이는 한 칸)
    V13 오답이 정답과 같지 않고 오답끼리 다르다, 오답 조각이 정답 조각에 없다, cue에 정답 영어가 없다
    V14 뉘앙스 kind가 허용 집합이고 모양이 맞다. v45 은행의 상황은 STEP 1(slider|pair) ≥1,
        STEP 2(reel|context|swap) ≥1
    V15 뉘앙스의 words가 비어 있지 않고, 전부 이 상황 문장이 쓰는 단어 id다
    V16 (--baseline) 보강 패스가 v44 필드를 바꾸지 않았다 — 단어의 id·en·ko·ipa·icon·example,
        문장의 en·ko·chunks·words·goal
    V17 (--baseline) 문장 ko를 고쳤으면 그 문장을 예문으로 쓰는 단어의 exKo도 옛 번역으로 남지 않았다(결정 13)

v46 (학습 화면 핸드오프 1:1 — `lesson-fidelity-v46/build-spec-index.md` §D, Go 쪽 content/lessonv46.go 와
같은 규칙). 전부 **선택 필드**라 없으면 묻지 않고, 있으면 모양을 본다:

    V18 문장의 tag(≤10자)·icon(NbIcon 이름)·why·decoy가 비어 있지 않다. decoy는 그 문장의 청크가
        아니고 en 안에도 없다. distractorsKo는 2개, 서로 다르고 문장 ko와 다르다. blank의 answer는
        en에 낱말 경계로 정확히 한 번 나오고, options는 4개·서로 다르고·answer를 포함하며 저마다 icon이 있다
    V19 상황의 order(순서 배열 카드)는 ko·why가 있고 줄이 정확히 4개, 줄마다 en·icon이 있고 en이
        겹치지 않는다. tag·icon과 줄의 ko·note는 있으면 비어 있지 않다. 문장 없는 상황에 order만 있으면 오류
    V14 (더함) context의 word와 ko는 함께 있거나 함께 없다. swap의 ko는 있으면 비어 있지 않다

Go는 `omitempty` 문자열이라 `why: ""`와 키 없음을 구별하지 못해 공백만 있는 값만 잡는다. 이 검사기는
키를 보므로 빈 문자열도 잡는다 — 저작 단계에서 더 엄격한 쪽이 이 도구다.

v45 필드가 하나도 없는 은행은 v44 콘텐츠로 보고 V12~V14의 최솟값을 묻지 않는다(보강 전의
ER·ICU·OR). 한 단어라도 v45 필드가 있으면 그 은행 전체가 v45다.

    python3 verify_lesson_content.py --dept er --baseline HEAD   # 보강 전(HEAD)과 비교해 V16

V7은 경고(항상 종료 코드에 영향 없음), 나머지는 전부 오류(비정상 종료 코드)다.

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

규칙으로 닿지 않는 것은 표로 본다 — 불규칙 동사(go/went), 불규칙 복수(child/children),
비교급·최상급(worse/best). 규칙을 넓히려다 오히려 흔한 낱말을 뭉갠 적이 여러 번 있어서
(`-er`이 `number`를, `-est`가 `arrest`를 뭉갰다) 규칙 대신 표를 고른 것이다.

**남은 한계.** `-age` 같은 명사화는 **일부러** 묶지 않는다(`drain`/`drainage`,
`identify`/`identification`) — 학습자에게 따로 배우는 낱말이다. 표에 없는 불규칙은 그때마다
V2가 정확히 짚어 주므로 한 줄씩 더하면 된다. ER 35개 주제를 만들며 그렇게 스무 번 남짓
넓혔다.

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


def parse_lexicon_raw(raw: str) -> dict[str, list[dict]]:
    """theme -> 단어 목록. parse_lexicon과 달리 사전으로 접지 않는다.

    {id: word} 사전을 만드는 순간 같은 id를 가진 두 항목은 하나로 접히고, 그
    뒤로는 V1도 V7도 중복을 볼 수 없다. V10이 보는 것은 접히기 전의 목록이다.
    """
    data = yaml.safe_load(raw) or []
    return {e.get("theme"): (e.get("words") or []) for e in data}


def duplicate_word_ids(words: list[dict]) -> list[str]:
    """한 은행 안에서 두 번 이상 나온 word id를 나온 순서대로 돌려준다."""
    seen: set[str] = set()
    dup: list[str] = []
    for w in words:
        wid = w.get("id")
        if not wid:
            continue
        if wid in seen and wid not in dup:
            dup.append(wid)
        seen.add(wid)
    return dup


def parse_topics(raw: str) -> list[dict]:
    return yaml.safe_load(raw) or []


def load_lexicon(dept: str) -> dict[str, dict[str, dict]]:
    path = LEXICON_DIR / f"{dept}.yaml"
    if not path.exists():
        return {}
    return parse_lexicon(path.read_text())


def load_lexicon_raw(dept: str) -> dict[str, list[dict]]:
    path = LEXICON_DIR / f"{dept}.yaml"
    if not path.exists():
        return {}
    return parse_lexicon_raw(path.read_text())


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
    # 영어 불규칙 동사 목록 전체와 대조해 한꺼번에 채운 것이다. `hidden` 하나가
    # core-family-icu 에서 보고됐는데, 훑어 보니 여든여덟이 어긋나 있었다.
    #
    # **다 넣지는 않는다.** 이 분야에서 값이 비싼 것들은 뺐다.
    #   `wound`(상처)는 `wind`(감다)의 과거형이기도 하다 — 상처는 이 콘텐츠의 중심 낱말이다.
    #   `shot`(주사)은 `shoot`(쏘다)의 과거형이기도 하다 — "a flu shot"이 훨씬 흔하다.
    #   `tore`·`torn`은 한때 뺐다 — `tear`가 눈물이기도 해서였다. 데이터 없이 내린
    #   판단이었고, 콘텐츠 아흔여섯 주제를 뒤져 보니 되돌리는 쪽이 맞았다. `tear`는
    #   은행에 넉 군데 있는데 **셋이 "찢어짐"**(대동맥 박리·경동맥 박리)이고 눈물은
    #   하나뿐이다. 찢어지는 쪽이 훨씬 흔하고, 수술실에서는 장갑이 찢어진다.
    #   두 뜻이 한 자리에 모이는 값은 치르되(같은 철자라 어차피 헤드워드가 같다),
    #   `torn`·`tore`가 통째로 버려지는 것은 막는다.
    #   `bore`·`borne`은 `bloodborne`·`airborne`과 얽혀 값이 비싸다.
    #   `lay`는 `lie`의 과거형이자 `lay`의 원형이라 어느 쪽으로도 모을 수 없다.
    "arisen": "arise",
    "arose": "arise",
    "awoke": "awake",
    "awoken": "awake",
    "beaten": "beat",
    "bent": "bend",
    "blew": "blow",
    "blown": "blow",
    "bound": "bind",
    "clung": "cling",
    "crept": "creep",
    "dealt": "deal",
    "dug": "dig",
    "flew": "fly",
    "flown": "fly",
    "forbade": "forbid",
    "forbidden": "forbid",
    "hidden": "hide",
    "hung": "hang",
    "knelt": "kneel",
    "lent": "lend",
    "lit": "light",
    "rang": "ring",
    "ridden": "ride",
    "risen": "rise",
    "rode": "ride",
    "rose": "rise",
    "rung": "ring",
    "sang": "sing",
    "sank": "sink",
    "shone": "shine",
    "shrank": "shrink",
    "shrunk": "shrink",
    "sold": "sell",
    "sought": "seek",
    "spat": "spit",
    "sped": "speed",
    "sprang": "spring",
    "sprung": "spring",
    "spun": "spin",
    "stank": "stink",
    "stole": "steal",
    "stolen": "steal",
    "struck": "strike",
    "stunk": "stink",
    "sung": "sing",
    "sunk": "sink",
    "swam": "swim",
    "swept": "sweep",
    "swore": "swear",
    "sworn": "swear",
    "tore": "tear",
    "torn": "tear",
    # `overshot`은 접두사 규칙이 못 잡는다 — `shot`을 일부러 표에서 뺐기 때문이다.
    # 그래서 이것만 따로 넣는다. `shot`(주사)은 그대로 지켜진다.
    "overshot": "overshoot",
    "swum": "swim",
    "swung": "swing",
    "wept": "weep",
    "won": "win",
    # `be-`·`for-` 계열. 접두사 규칙(`_prefixed_irregular`)은 이 둘을 보지 않는다 —
    # `beside`·`believe`·`forehead`처럼 접두사가 아닌 낱말이 너무 많아 넣지 않았다.
    # 그래서 이 계열만 표로 채운다. `became`이 icu-liver-failure에서 보고됐고, 한 건만
    # 채우지 않고 같은 모양을 함께 훑었다.
    "became": "become",
    "begun": "begin",
    "beheld": "behold",
    "forgot": "forget", "forgotten": "forget",
    "forgave": "forgive", "forgiven": "forgive",
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
    # 불규칙 명사 복수형 — 규칙으로는 닿지 않는다.
    "feet": "foot", "teeth": "tooth", "children": "child",
    "men": "man", "women": "woman", "people": "person", "knives": "knife",
    "did": "do", "done": "do", "does": "do",
    "paid": "pay",
    "laid": "lay",
    "froze": "freeze", "frozen": "freeze",
    "drew": "draw", "drawn": "draw",
    "knew": "know", "known": "know",
    "showed": "show", "shown": "show",
    "grew": "grow", "grown": "grow",
    "threw": "throw", "thrown": "throw",
    # `torn`/`tore`는 넣지 않는다 — `tear`가 이 분야에서 눈물도 뜻한다.
    "stung": "sting",
    "had": "have", "has": "have",
    "been": "be", "was": "be", "were": "be", "am": "be", "are": "be", "is": "be",
    "stuck": "stick",
    "shook": "shake", "shaken": "shake",
    "drove": "drive", "driven": "drive",
    "felt": "feel",
    # 다섯 글자 `-ing`는 규칙이 못 잡는다 — `-ing`을 떼는 조건이 다섯 글자 초과이기
    # 때문이다. 그 조건을 낮추면 `thing`이 `th`가 되고 `bring`이 `br`이 되어 복수형·
    # 3인칭형과 어긋난다(둘 다 이 콘텐츠에서 흔하다). 그래서 여기에 적는다.
    # `lying`·`dying`·`tying`은 철자까지 바뀌므로 조건을 낮춰도 어차피 안 된다.
    "being": "be", "going": "go", "doing": "do", "using": "use",
    "lying": "lie", "dying": "die", "tying": "tie",
}

# 비교급·최상급 — **규칙이 아니라 표로** 본다.
#
# 규칙(`-er`·`-est`)은 두 번 넣었다가 두 번 뺐다. `-er`은 `number`를 `numb`로, `-ier`은
# `identifier`를 `identify`로, `-est`는 `arrest`를 `ar`로 만들었다. 전부 이 분야에서 흔한
# 낱말이라 값이 비쌌다.
#
# 표에는 그런 위험이 없다. `worse`가 `bad`로 모이는 것은 `number`와 아무 상관이 없다.
# 불규칙 동사에 쓴 것과 같은 방법이고, 진작 이렇게 했어야 했다 — 한 주제에서만 다섯 개
# (`worse`·`easier`·`lower`·`weaker`·`highest`)를 놓치고 있었다.
COMPARATIVE = {
    "worse": "bad", "worst": "bad",
    "better": "good", "best": "good",
    "more": "much", "most": "much",
    "less": "little", "least": "little",
    "lower": "low", "lowest": "low",
    "higher": "high", "highest": "high",
    "easier": "easy", "easiest": "easy",
    "weaker": "weak", "weakest": "weak",
    "stronger": "strong", "strongest": "strong",
    "deeper": "deep", "deepest": "deep",
    "quieter": "quiet", "quietest": "quiet",
    "closer": "close", "closest": "close",
    "larger": "large", "largest": "large",
    "smaller": "small", "smallest": "small",
    "faster": "fast", "fastest": "fast",
    "slower": "slow", "slowest": "slow",
    "safer": "safe", "safest": "safe",
    "later": "late", "latest": "late",
    "earlier": "early", "earliest": "early",
    "longer": "long", "longest": "long",
    "shorter": "short", "shortest": "short",
    "harder": "hard", "hardest": "hard",
    "softer": "soft", "softest": "soft",
    # `warmer`(보온기)·`cooler`(혈액 운반 용기)·`thinner`(혈액희석제)는 병원에서 **명사**다. 표에 넣었더니
    # 혈액은행 상황의 "two more coolers on the way"가 깨졌다. 비교급으로 보지 않는다.
    "warmest": "warm",
    "coolest": "cool",
    "thinnest": "thin",   # `thinner`는 넣지 않는다 — "blood thinner"가 이 콘텐츠에 있다
    "tighter": "tight", "tightest": "tight",
    "nearer": "near", "nearest": "near",
    "newer": "new", "newest": "new",
    "older": "old", "oldest": "old",
    "bigger": "big", "biggest": "big",
    "calmer": "calm", "calmest": "calm",
    "darker": "dark", "darkest": "dark",
    "lighter": "light", "lightest": "light",
    "colder": "cold", "coldest": "cold",
    "hotter": "hot", "hottest": "hot",
    "sicker": "sick", "sickest": "sick",
    "sorer": "sore", "sorest": "sore",
    "sharper": "sharp", "sharpest": "sharp",
    "duller": "dull", "dullest": "dull",
    "clearer": "clear", "clearest": "clear",
    "heavier": "heavy", "heaviest": "heavy",
    "thicker": "thick", "thickest": "thick",
    "younger": "young", "youngest": "young",
    "drier": "dry", "driest": "dry",
    "wetter": "wet", "wettest": "wet",
    # 아래는 icu-shock의 `firmer`(복부가 단단해진다) 하나가 보고된 뒤, 한 건만 채우지
    # 않고 임상에서 흔한 형용사 마흔여섯 짝을 한꺼번에 훑어 채운 것이다. 서른일곱이
    # 비어 있었다. 보고를 기다리며 한 건씩 왕복하면 주제 하나마다 같은 일이 생긴다.
    "firmer": "firm", "firmest": "firm",
    "looser": "loose", "loosest": "loose",
    "wider": "wide", "widest": "wide",
    "narrower": "narrow", "narrowest": "narrow",
    "busier": "busy", "busiest": "busy",
    "steadier": "steady", "steadiest": "steady",
    "rougher": "rough", "roughest": "rough",
    "smoother": "smooth", "smoothest": "smooth",
    "brighter": "bright", "brightest": "bright",
    "paler": "pale", "palest": "pale",
    "redder": "red", "reddest": "red",
    "fuller": "full", "fullest": "full",
    "emptier": "empty", "emptiest": "empty",
    "quicker": "quick", "quickest": "quick",
    "simpler": "simple", "simplest": "simple",
    "stiffer": "stiff", "stiffest": "stiff",
    "louder": "loud", "loudest": "loud",
    "finer": "fine", "finest": "fine",
    "dirtier": "dirty", "dirtiest": "dirty",
    "fresher": "fresh", "freshest": "fresh",
    "healthier": "healthy", "healthiest": "healthy",
    "taller": "tall", "tallest": "tall",
    "sleepier": "sleepy", "sleepiest": "sleepy",
    "dizzier": "dizzy", "dizziest": "dizzy",
    "sweeter": "sweet", "sweetest": "sweet",
    "kinder": "kind", "kindest": "kind",
    "gentler": "gentle", "gentlest": "gentle",
    "rarer": "rare", "rarest": "rare",
    "happier": "happy", "happiest": "happy",
    "sadder": "sad", "saddest": "sad",
    "angrier": "angry", "angriest": "angry",
    "hungrier": "hungry", "hungriest": "hungry",
    "thirstier": "thirsty", "thirstiest": "thirsty",
    "braver": "brave", "bravest": "brave",
    # 지금까지 만든 문장에서 `-er`·`-est`로 끝나는 낱말 161종을 전수로 뽑아 훑은 결과다.
    # 그 가운데 진짜 비교급은 여섯뿐이었다. 나머지는 `catheter`·`bladder`·`interpreter`
    # 처럼 어미가 아니라 낱말 자체다 — 규칙을 쓰지 않고 표를 쓰는 이유가 이 비율에 있다.
    "fewer": "few", "fewest": "few",
    "further": "far", "furthest": "far",
    "farther": "far", "farthest": "far",
    "sooner": "soon", "soonest": "soon",
    "milder": "mild", "mildest": "mild",
    "riskier": "risky", "riskiest": "risky",
    "plainer": "plain", "plainest": "plain",
    # `stranger`(낯선 사람)와 `cleaner`(청소 담당·세정제)는 병원에서 **명사**다.
    # `warmer`·`cooler`·`thinner`와 같은 이유로 비교급 쪽만 뺀다.
    "strangest": "strange",
    "cleanest": "clean",
}

# 끝의 `s`를 떼면 안 되는 꼬리. `focus`·`status`·`analysis`는 복수형이 아니다.
NOT_PLURAL_TAIL = ("ss", "us", "is")
# 꼬리로는 못 거르는, `s`로 끝나는 단수 명사들. 복수형이 `-es`를 붙이기 때문에 이것들만
# 따로 막아야 양쪽이 만난다 — `lenses`는 `-es`를 떼고 `lens`에서 멈추는데 원형 `lens`는
# 끝의 `s`가 복수형으로 보여 `len`이 되어, "안경알을 닦아 드릴게요"라는 멀쩡한 문장이
# 거절됐다(icu-delirium에서 보고됨).
#
# 한때 `stem`을 두 번 돌려 양쪽을 `len`으로 모으려 했다. 은행 낱말 2,729개를 전수
# 대조해 보니 그 방법은 **`dose`를 `do`와, `pulse`를 `pull`과, `nose`를 `no`와, `false`를
# `fall`과 한 자리에 모은다.** 끝의 `e`를 떼고 남은 `s`를 두 번째 바퀴가 복수형으로 보기
# 때문이다. 전부 이 분야의 중심 낱말이라 값이 너무 비싸다. 규칙 대신 표를 두는 것은
# 비교급·최상급 때와 같은 결론이다.
S_SINGULAR = frozenset({"lens", "bias", "canvas", "atlas", "pancreas"})
# `-ie`로 끝나는 명사의 복수형. `-ies`는 대개 `-y` 명사의 복수형이라(`injury`/`injuries`,
# `allergy`/`allergies`, `baby`/`babies` — 전부 정상으로 만난다) 규칙이 `-ies`를 `-y`로
# 되돌리는데, 원형이 이미 `-ie`인 소수는 그 규칙에 걸려 짝과 갈린다. `calorie`는 `calori`가
# 되고 `calories`는 `calor`가 되어 "칼로리를 늘립니다"라는 멀쩡한 문장이 거절됐다
# (icu-aki-crrt에서 보고됨).
#
# `tie`·`lie`는 멀쩡하다 — `-es` 규칙의 길이 조건(`> 4`)에 걸리지 않아 다른 길로 간다.
# 깨지는 것은 여섯 글자 이상인 것들뿐이라, 규칙을 건드리지 않고 표로 둔다.
# `-f`·`-fe`로 끝나는 명사의 복수형. `half`/`halves`가 or-count 에서 보고됐다. 규칙으로
# 만들 수도 있지만(`-ves` → `-f`), `-ves`로 끝나는 낱말이 전부 이 부류는 아니라 표로 둔다.
#
# `lives`와 `leaves`는 **넣지 않는다.** 각각 `life`·`leaf`의 복수형이면서 동시에
# `live`·`leave`의 3인칭 단수다("he lives alone" / "nothing leaves this room").
# 어느 한쪽으로 모으면 다른 쪽이 깨진다 — `leaves`는 실제로 넣었다가 er-geriatric 의
# "nothing leaves this room without your say."를 깨뜨려 전체 회귀에서 잡혔다.
# `knives`는 이미 다른 길로 `knife`와 만나고 있어 넣지 않는다.
# `-le`로 끝나는 형용사의 부사. `gentle`/`gently`가 or-induction-airway 에서 보고됐다.
# 어미에서 `e`가 `y`로 바뀌므로 `-ly`만 떼면 `gent`가 남아 `gentle`(→`gentl`)과 갈린다.
# 서른셋을 훑어 보니 **전부** 어긋나 있었다.
#
# 규칙으로는 못 한다. `gently`의 앞부분 `gent`와 `badly`의 앞부분 `bad`를 낱말 모양만
# 보고 가를 방법이 없는데, `bad`/`badly`는 지금 제대로 만나고 있어 건드리면 그쪽이 깨진다.
# 그래서 표로 둔다.
# `-ee`로 끝나는 동사의 과거형. `-ed`가 붙어 `-eed`가 되는데, `-eed`는 어미로 보지 않는
# 예외에 걸려 원형과 갈린다. `agree`/`agreed`가 or-preop-verification 에서 보고됐다.
#
# 코드 주석에 "이 분야에서 드물어 감수한다"고 적어 뒀던 자리다. 실제로 걸렸으니 그
# 판단이 틀렸다. `-eed` 예외 자체는 그대로 둔다 — `bleed`·`feed`·`need`·`speed`는
# 어미가 아니라 낱말이고, 그쪽이 훨씬 흔하다. 예외의 예외만 표로 판다.
EED_PAST = {
    "agreed": "agree",
    "disagreed": "disagree",
    "freed": "free",
    "guaranteed": "guarantee",
    "decreed": "decree",
}

LE_ADVERB = {
    "ably": "able",
    "audibly": "audible",
    "capably": "capable",
    "comfortably": "comfortable",
    "considerably": "considerable",
    "doubly": "double",
    "flexibly": "flexible",
    "gently": "gentle",
    "horribly": "horrible",
    "humbly": "humble",
    "idly": "idle",
    "impossibly": "impossible",
    "incredibly": "incredible",
    "nimbly": "nimble",
    "noticeably": "noticeable",
    "possibly": "possible",
    "probably": "probable",
    "reasonably": "reasonable",
    "remarkably": "remarkable",
    "responsibly": "responsible",
    "sensibly": "sensible",
    "simply": "simple",
    "singly": "single",
    "stably": "stable",
    "subtly": "subtle",
    "suitably": "suitable",
    "terribly": "terrible",
    "uncomfortably": "uncomfortable",
    "understandably": "understandable",
    "unstably": "unstable",
    "valuably": "valuable",
    "visibly": "visible",
}

FVES_PLURAL = {
    "halves": "half",
    "shelves": "shelf",
    "selves": "self",
    "calves": "calf",
    "wives": "wife",
    "thieves": "thief",
    "loaves": "loaf",
    "scarves": "scarf",
    "hooves": "hoof",
    "wolves": "wolf",
}

IE_PLURAL = {
    "calories": "calorie",
    "bougies": "bougie",
    "cookies": "cookie",
    "movies": "movie",
    "sweeties": "sweetie",
    "smoothies": "smoothie",
}
# `as`는 짧은 낱말에서만 예외다. `gas`·`was`·`has`는 복수형이 아니지만, 긴 낱말의 `-as`는
# 대개 `-a` 명사의 복수형이다 — `areas`가 `area`와 어긋나 화상 주제에서 걸렸다.
SHORT_AS_MAX = 3

VOWELS = "aeiou"


# 접두사가 붙은 불규칙 동사. `draw`/`drawn`은 표에 있는데 `withdraw`/`withdrawn`은 없어서
# "지지를 먼저 거둡니다"라는 문장이 거절됐다(icu-brain-death에서 보고됨). 한 낱말이 아니라
# 부류다 — 열네 짝을 훑어 보니 열둘이 어긋나 있었다.
#
# 여기서는 표가 아니라 규칙이 맞다. 표에 이미 있는 원형을 그대로 재활용하는 것이고, 표를
# 늘리는 것이 아니라 표를 **한 번 더 보는** 것뿐이라, 표가 자라도 저절로 따라온다.
# `be-`는 넣지 않는다 — `beside`·`believe`처럼 접두사가 아닌 것이 너무 많다.
#
# **어미를 뗀 뒤에** 본다. 맨 앞에 뒀더니 `relying`이 `re`+`lying`으로 쪼개져 `lie`를 거쳐
# `relie`가 되었고, `rely`와 갈렸다. 어미가 먼저 떨어지면 `relying`은 `rely`가 되고 남는
# 부분이 두 글자라 이 규칙이 아예 보지 않는다. `withdrawn`처럼 어미 규칙이 하나도 걸리지
# 않는 낱말만 여기까지 내려온다.
IRREGULAR_PREFIXES = ("with", "over", "under", "out", "re", "un", "mis", "fore", "up")


def _prefixed_irregular(t: str) -> str | None:
    """`withdrawn` → `withdraw`. 접두사를 떼고 표를 본 뒤 다시 붙인다.

    남는 부분이 세 글자는 되어야 본다 — `reset`의 `set`처럼 짧은 것까지는 보되,
    `out`+`it` 같은 우연한 쪼개짐은 막는다.
    """
    for pre in IRREGULAR_PREFIXES:
        if t.startswith(pre) and len(t) - len(pre) >= 3:
            rest = t[len(pre):]
            if rest in IRREGULAR:
                return pre + IRREGULAR[rest]
    return None


def stem(tok: str) -> str:
    """어형을 한 자리로 모은다. 사전이 없으므로 규칙만으로 하되, **양쪽을 같은 자리로**
    모으는 것이 목적이지 올바른 원형을 복원하는 것이 목적이 아니다.

    다섯 가지를 본다. 전부 실제로 콘텐츠를 만들다 부딪힌 것들이다.

    ⑦ 부사 `-ly`와 형용사 `-y`도 마지막에 뗀다(`seriously`→`serious`, `sweaty`→`sweat`).
       `family`→`fami`처럼 어미가 아닌 자리도 떼지만, 양쪽에 똑같이 적용되므로 맞는다.
    ⑥ **비교급·최상급은 규칙이 아니라 표로 본다**(`COMPARATIVE`). 규칙을 두 번 넣었다가
       두 번 뺀 끝에 내린 결론이다. 아래 설명은 그 규칙들을 왜 넣지 않는지에 대한 것이다. `-er`은 `number`를 `numb`(저리다)로 만들고, `-ier`은
       `identifier`(신원 확인 항목)를 `identify`로 만들어 `identifiers`와 어긋나게 한다.
       둘 다 임상에서 흔해 오탐의 값이 비싸다. 실제로 `-ier`을 넣었다가 이미 만든 주제의
       "I always confirm two identifiers for every patient."가 깨졌다. 얻는 것은
       `easy`/`easier` 한 사례이고 잃는 것은 만들어 둔 콘텐츠라, 넣지 않는다.

       최상급 `-est`도 한때 넣었다가 뺐다. "떼고 남는 것이 세 글자는 되어야 한다"는 조건이
       `test`·`chest`·`rest`는 지켰지만 더 긴 낱말은 못 지켰다 — `arrest`가 `ar`이 되어
       `arrested`(→`arrest`)와 어긋났고, `suggest`·`protest`·`request`도 같이 뭉개졌다.
       `arrest`는 심정지 주제의 중심 낱말이다. 얻는 것은 `safest`·`latest` 몇 사례이고
       잃는 것은 이 분야의 흔한 낱말들이라, 비교급과 같은 결론을 낸다.
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
    elif t in COMPARATIVE:
        t = COMPARATIVE[t]
    elif t in EED_PAST:
        t = EED_PAST[t]
    elif t in LE_ADVERB:
        t = LE_ADVERB[t]
    elif t in FVES_PLURAL:
        t = FVES_PLURAL[t]
    elif t in IE_PLURAL:
        t = IE_PLURAL[t]
    elif t.endswith("ies") and len(t) > 4:
        t = t[:-3] + "y"
    elif t.endswith("ied") and len(t) > 4:
        t = t[:-3] + "y"
    elif t.endswith("ing") and len(t) > 5:
        t = t[:-3]
    elif t.endswith("ed") and not t.endswith("eed") and len(t) >= 4:
        # 길이 조건이 `>= 4`인 것은 `used`(네 글자) 때문이다 — `> 4`였을 때 `use`와
        # 어긋났다.
        # `-eed`는 자르지 않는다. `bleed`·`feed`·`need`·`speed`는 어미가 아니라 낱말
        # 자체이고, 자르면 `bleed`가 `ble`이 되어 `bleeding`(→`bleed`)과 어긋난다.
        # 전부 임상에서 흔한 말이다. (`agreed`처럼 어간이 e로 끝나 d만 붙는 경우는
        # 이 예외에 걸려 `agree`와 어긋난다 — 이 분야에서 드물어 감수한다.)
        t = t[:-2]
    elif t.endswith("es") and len(t) > 4:
        t = t[:-2]
    elif (
        t.endswith("s")
        and t not in S_SINGULAR
        and not t.endswith(NOT_PLURAL_TAIL)
        and not (t.endswith("as") and len(t) <= SHORT_AS_MAX)
        and len(t) > 2
    ):
        # 길이 조건이 `> 2`인 것은 세 글자 약어의 복수형 때문이다 — `IVs`·`ECGs`·`ORs`가
        # `> 3`였을 때 원형과 어긋났다. `gas`·`his`·`was`·`bus`는 NOT_PLURAL_TAIL이
        # 이미 막는다. `lens`처럼 꼬리로 못 거르는 것은 S_SINGULAR가 막는다.
        t = t[:-1]
    # 어미를 뗀 결과가 다시 표에 있으면 한 번 더 모은다. `thoughts`가 그 자리다 —
    # 복수형이라 `-s`로 `thought`가 되는데, 원형 `thought`는 표를 거쳐 `think`가 되어
    # 서로 갈렸다. `thought`는 명사이자 동사 과거형이라 어느 한쪽을 버릴 수 없고, 둘 다
    # 자살 위험 선별에서 쓰인다("Have you thought about…" / "thoughts like this").
    if t in IRREGULAR:
        t = IRREGULAR[t]
    elif (prefixed := _prefixed_irregular(t)) is not None:
        t = prefixed
    elif t in COMPARATIVE:
        t = COMPARATIVE[t]

    # 아래 셋은 어미가 아니라 **양쪽을 같은 자리로 모으는** 마무리다. 원형 복원이 아니므로
    # 어느 쪽이 원형인지 따지지 않고 둘 다에 똑같이 적용한다.
    if t.endswith("ily") and len(t) > 4:
        # `easily`→`easy`. 일반 `-ly`만 떼면 `easi`가 남아 `easy`(→`eas`)와 어긋난다 —
        # 자음+y 형용사가 부사가 될 때 y가 i로 바뀌기 때문이다(happy/happily도 같다).
        t = t[:-3] + "y"
    if t.endswith("ly") and len(t) > 3:
        t = t[:-2]                      # seriously→serious, safely→safe
    if t.endswith("ical") and len(t) > 5:
        # `-ic` 형용사의 부사는 `-ically`다. `-ly`만 떼면 `specifical`·`systematical`이
        # 남아, 실제 원형인 `specific`·`systematic`과 갈린다(or-count 에서 보고됨).
        # `-ical`을 `-ic`으로 마저 모으면 양쪽이 만난다. `clinical`/`clinically`처럼
        # 원형이 `-ical`인 쪽도 똑같이 `clinic`으로 모이므로 함께 지켜진다.
        #
        # 값: `clinic`·`topic`·`music`이 `clinical`·`topical`·`musical`과 한 자리에
        # 모인다. 지금까지 만든 아흔한 주제를 훑어 그 짝이 함께 나오는 자리가 하나도
        # 없음을 확인했고, `-ically` 부사는 열세 번밖에 안 쓰였다. 값이 싸다.
        t = t[:-2]
    while t.endswith("e") and len(t) > 2:
        # 남김없이 떼는 것은 `agree` 때문이다. `agrees`는 `-es`로 두 글자가 잘려 `agre`가
        # 되고 거기서 `e` 하나를 더 떼 `agr`이 되는데, 원형 `agree`는 한 번만 떼면 `agre`라
        # 어긋났다. 남김없이 떼면 둘 다 `agr`이다.
        # 길이 조건이 `> 2`인 것은 `use`(세 글자) 때문이다 — `> 3`였을 때 `used`(→`us`)와
        # 어긋났다.
        t = t[:-1]                      # medicine→medicin (⑤)
    if t.endswith("y") and len(t) > 3:
        t = t[:-1]                      # sweaty→sweat, allergy→allerg
    if t.endswith("ing") and len(t) > 5:
        # `-ing`을 마지막에 한 번 더 뗀다. 앞의 elif 사슬은 한 갈래만 타므로,
        # `-s`로 간 낱말은 `-ing`을 못 만난다 — `mornings`가 `morning`에서 멈춰
        # 원형 `morning`(→`morn`)과 어긋났다. `warnings`·`evenings`도 같다.
        # 길이 조건은 앞과 같아서 `thing`·`bring`은 여기서도 지켜진다.
        t = t[:-3]
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
        if not toks:
            continue
        # 홀로 선 대문자 한 글자는 관사가 아니라 **라벨**이다 — `plan A`, `specimen B`,
        # `site C`. 소문자로 내려 비교하면 `A`가 관사 `a`로 읽혀 멀쩡한 청크가 거절된다
        # (or-specimen 과 or-difficult-airway 에서 두 번 걸렸다).
        #
        # 다만 문장 맨 앞의 `A`는 진짜 관사일 수 있다("A patient is waiting"). 그래서
        # **첫 조각의 첫 낱말일 때만** 예외를 주지 않는다.
        if len(toks[-1]) == 1 and toks[-1].isupper() and not (i == 0 and len(toks) == 1):
            continue
        if toks[-1].lower() in DANGLING_TAIL:
            out.append(c)
    return out


def meaningful_chunks(chunks: list[str]) -> int:
    """구두점만으로 이루어진 조각은 쪼갠 것이 아니므로 세지 않는다."""
    return sum(1 for c in chunks if c.strip(" " + "".join(SENTENCE_PUNCT_START)))


def min_chunks_for(en: str) -> int:
    """문장 길이에 비례한 최소 조각 수. 위 docstring의 표 그대로.

    **글자도 숫자도 없는 토막은 낱말로 세지 않는다.** 앞서는 `,.?!`만 걸렀는데,
    이 콘텐츠에는 엠대시가 잦아서 `—`가 낱말 하나로 세어졌다. 여덟 낱말짜리 문장이
    아홉으로 세어져 조각을 하나 더 쪼개라고 요구했고, 저작자들이 다섯 번 그 요구에
    맞춰 멀쩡한 구 경계를 더 잘게 나눴다. 세는 쪽을 고친다.

    이 고침은 요구를 **느슨하게** 만들기만 하므로 이미 통과한 콘텐츠는 그대로 통과한다.
    """
    words = len([w for w in en.split() if any(ch.isalnum() for ch in w)])
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

# ---------------------------------------------------------------------------
# v45 — 회상 재료(단어)와 뉘앙스(상황). Go 쪽 content/nuance.go 와 규칙을 맞춘다.
# ---------------------------------------------------------------------------

V45_WORD_FIELDS = ("exKo", "cue", "tag", "distractorsEn", "distractorsKo", "chips", "decoyChips")
# NbIcon 이 그리는 이름. 정본은 mobile/src/components/nb/NbIcon.tsx 의 `NbIconName` 유니온이고, 그 파일이
# 있으면 거기서 읽는다(모바일 contentIcons 테스트와 같은 방식) — 손으로 적은 목록은 새 아이콘(faceWorried,
# 결정 9)이 그려지는 순간 어긋난다. 아래 목록은 저장소 밖에서 이 도구만 돌릴 때의 대체값이다.
NB_ICON_FILE = CONTENT_DIR.parent.parent / "mobile" / "src" / "components" / "nb" / "NbIcon.tsx"
_NB_ICONS_FALLBACK = set("""baby bandage bell board bulb calendar chartup check chevronDown chevronLeft chevronRight
chevronUp coffee compass cross faceAngry faceWorried gear handshake2 home hospital lab lock magnify me mic monitor pencil pill
plane pushpin redo scalpel shield siren speaker speech star stetho trophy""".split())


def _load_nb_icons() -> set[str]:
    try:
        src = NB_ICON_FILE.read_text(encoding="utf-8")
        union = src[src.index("NbIconName"):src.index("export function NbIcon")]
        found = set(re.findall(r"'([a-zA-Z0-9-]+)'", union))
        return found if len(found) > 20 else _NB_ICONS_FALLBACK
    except (OSError, ValueError):
        return _NB_ICONS_FALLBACK


NB_ICONS = _load_nb_icons()
MAX_FRAGS_PER_WORD, MAX_FRAGS = 4, 6


def _not_str(value, path: str) -> list[tuple[str, str]]:
    """문자열이어야 할 자리에 문자열이 아닌 값(따옴표 없는 on·off·no·yes → 불리언, 숫자)."""
    out = []
    if isinstance(value, list):
        for i, v in enumerate(value):
            out += _not_str(v, f"{path}[{i}]")
    elif value is not None and not isinstance(value, str):
        out.append(("V11", f"{path}={value!r} is {type(value).__name__}, not a string "
                           f"(YAML reads bare off/on/no/yes as booleans — quote it)"))
    return out


def _stems(text) -> set[str]:
    return {stem(t) for t in tokenize(str(text)) if len(t) >= 3}


def _same_word(a, b) -> bool:
    """철자는 달라도 같은 낱말의 어형인가 — keep/kept, begin/began, injury/injure."""
    ta, tb = tokenize(str(a)), tokenize(str(b))
    return len(ta) == len(tb) and len(ta) > 0 and [stem(x) for x in ta] == [stem(x) for x in tb]
NUANCE_STEP = {"slider": 1, "pair": 1, "reel": 2, "context": 2, "swap": 2}


def join_chips(chips) -> str:
    """낱말 안의 조각은 붙이고 낱말 사이는 한 칸 — Go `content.JoinChips`와 같다."""
    return " ".join("".join(str(f) for f in word) for word in (chips or []))


def _norm(s) -> str:
    return " ".join(str(s).lower().split())


def is_v45_word(w: dict) -> bool:
    return any(w.get(k) for k in V45_WORD_FIELDS)


def check_word_v45(w: dict) -> list[tuple[str, str]]:
    """V11(값 타입)·V12·V13. (규칙, 설명) 목록을 돌려준다."""
    out: list[tuple[str, str]] = []
    for k in V45_WORD_FIELDS:
        vals = w.get(k)
        if k == "chips" and isinstance(vals, list):
            vals = [f for word in vals if isinstance(word, list) for f in word]
        out += [(r, f"word {w.get('id')!r}: {d}") for r, d in _not_str(vals, k)]
    wid, en, ko = w.get("id"), str(w.get("en") or ""), str(w.get("ko") or "")
    for k in ("exKo", "cue", "tag"):
        if not str(w.get(k) or "").strip():
            out.append(("V12", f"word {wid!r}: {k} is empty"))
    for k in ("distractorsEn", "distractorsKo"):
        n = len(w.get(k) or [])
        if n != 2:
            out.append(("V12", f"word {wid!r}: {k} has {n}, want 2"))
    if not w.get("decoyChips"):
        out.append(("V12", f"word {wid!r}: decoyChips is empty"))
    chips = w.get("chips") or []
    if not all(isinstance(x, list) for x in chips):
        out.append(("V12", f"word {wid!r}: chips must be a list of words, each a list of fragments: {chips!r}"))
    elif join_chips(chips) != en:
        out.append(("V12", f"word {wid!r}: chips join to {join_chips(chips)!r}, want {en!r}"))

    for k, answer in (("distractorsEn", en), ("distractorsKo", ko)):
        seen = {_norm(answer)}
        for o in w.get(k) or []:
            n = _norm(o)
            if n == _norm(answer):
                out.append(("V13", f"word {wid!r}: {k} option {o!r} is the answer"))
            elif n in seen:
                out.append(("V13", f"word {wid!r}: {k} option {o!r} repeats"))
            seen.add(n)
    real = {_norm(f) for word in chips if isinstance(word, list) for f in word}
    for d in w.get("decoyChips") or []:
        if _norm(d) in real:
            out.append(("V13", f"word {wid!r}: decoy chip {d!r} is one of the answer's own fragments"))
    if en and en.lower() in str(w.get("cue") or "").lower():
        out.append(("V13", f"word {wid!r}: cue gives the answer {en!r} away"))
    elif en and _stems(en) & _stems(w.get("cue") or ""):
        out.append(("W13", f"word {wid!r}: cue may give a form of the answer {en!r} away — read it"))
    for o in w.get("distractorsEn") or []:
        if _norm(o) != _norm(en) and _same_word(o, en):
            out.append(("W13", f"word {wid!r}: distractor {o!r} may be only another form of {en!r} — read it"))
    if isinstance(chips, list) and all(isinstance(x, list) for x in chips):
        if any(len(word) > MAX_FRAGS_PER_WORD for word in chips) or sum(len(x) for x in chips) > MAX_FRAGS:
            out.append(("V12", f"word {wid!r}: too many fragments {chips!r} "
                               f"(≤{MAX_FRAGS_PER_WORD} per word, ≤{MAX_FRAGS} in all)"))
    return out


def check_nuance(items: list, used: set[str], required: bool) -> list[tuple[str, str]]:
    """V14·V15. `used`는 이 상황 문장이 쓰는 단어 id, `required`는 v45 은행의 상황인가."""
    out: list[tuple[str, str]] = []
    steps = collections.Counter()
    for i, n in enumerate(items or []):
        kind = n.get("kind")
        if kind not in NUANCE_STEP:
            out.append(("V14", f"nuance[{i}]: unknown kind {kind!r} (allowed: {sorted(NUANCE_STEP)})"))
            continue
        steps[NUANCE_STEP[kind]] += 1
        for k in ("why", "cue", "example", "exKo", "word", "who", "icon", "answer", "scale", "decoys", "before", "options", "ko"):
            out += [(r, f"nuance[{i}] ({kind}): {d}") for r, d in _not_str(n.get(k), k)]
        for p in n.get("pairs") or []:
            out += [(r, f"nuance[{i}] ({kind}): {d}") for r, d in _not_str(p, "pairs")]
        for j, sc in enumerate(n.get("scenes") or []):
            for k in ("who", "icon", "en", "ko", "tone", "fix"):
                out += [(r, f"nuance[{i}] ({kind}): {d}") for r, d in _not_str(sc.get(k), f"scenes[{j}].{k}")]
            if sc.get("icon") and sc.get("icon") not in NB_ICONS:
                out.append(("V14", f"nuance[{i}] ({kind}): scene icon {sc.get('icon')!r} is not an NbIcon name"))
        if n.get("icon") and n.get("icon") not in NB_ICONS:
            out.append(("V14", f"nuance[{i}] ({kind}): icon {n.get('icon')!r} is not an NbIcon name"))
        # v46 — C5 머리(대상 단어 + “한국어 뜻” 메모)와 C6 한국어 줄. Go validateNuanceV46 와 같다.
        if kind == "context":
            has_word, has_ko = _filled(n.get("word")), _filled(n.get("ko"))
            if "ko" in n and not has_ko:
                out.append(("V14", f"nuance[{i}] context: ko is blank"))
            if has_word != has_ko:
                out.append(("V14", f"nuance[{i}] context: needs word and ko together — the C5 title draws the word, its memo the Korean"))
        elif kind == "swap" and "ko" in n and not _filled(n.get("ko")):
            out.append(("V14", f"nuance[{i}] swap: ko is blank"))
        words = n.get("words") or []
        if not words:
            out.append(("V15", f"nuance[{i}] ({kind}): names no words"))
        for wid in words:
            if wid not in used:
                out.append(("V15", f"nuance[{i}] ({kind}): word {wid!r} is not used by this situation's sentences"))
        if kind == "slider":
            scale = n.get("scale") or []
            at = n.get("answerAt")
            if len(scale) < 3:
                out.append(("V14", f"nuance[{i}] slider: scale has {len(scale)}, want >= 3"))
            if not isinstance(at, int) or isinstance(at, bool) or not (0 <= at < len(scale)):
                out.append(("V14", f"nuance[{i}] slider: answerAt={at!r} out of range"))
        elif kind == "pair":
            pairs = n.get("pairs") or []
            if len(pairs) < 2:
                out.append(("V14", f"nuance[{i}] pair: {len(pairs)} pair(s), want >= 2"))
            for p in pairs:
                if not isinstance(p, list) or len(p) != 2:
                    out.append(("V14", f"nuance[{i}] pair: {p!r} is not [left, right]"))
            if not n.get("decoys"):
                out.append(("V14", f"nuance[{i}] pair: no decoys"))
            lefts = [str(p[0]) for p in pairs if isinstance(p, list) and len(p) == 2]
            rights = [str(p[1]) for p in pairs if isinstance(p, list) and len(p) == 2]
            if len(set(map(_norm, lefts))) != len(lefts) or len(set(map(_norm, rights))) != len(rights):
                out.append(("V14", f"nuance[{i}] pair: a word appears twice on one side — the match must be unique"))
            for d in n.get("decoys") or []:
                if _norm(d) in set(map(_norm, rights)):
                    out.append(("V14", f"nuance[{i}] pair: decoy {d!r} is also a right-hand answer"))
        elif kind == "reel":
            if len(n.get("scenes") or []) < 4:
                out.append(("V14", f"nuance[{i}] reel: {len(n.get('scenes') or [])} scene(s), want >= 4"))
            # 스펙 §11-8 — 감상 칩 3~4개(빈 값·중복 없음)와, 칩을 고르면 펼칠 해설.
            feels = n.get("feels") or []
            if not 3 <= len(feels) <= 4:
                out.append(("V14", f"nuance[{i}] reel: {len(feels)} feel(s), want 3-4"))
            if any(not str(f).strip() for f in feels) or len(set(feels)) != len(feels):
                out.append(("V14", f"nuance[{i}] reel: a feel is blank or repeated"))
            if not str(n.get("why") or "").strip():
                out.append(("V14", f"nuance[{i}] reel: no why — the note a feel unfolds"))
        elif kind == "context":
            scenes = n.get("scenes") or []
            if len(scenes) != 3:
                out.append(("V14", f"nuance[{i}] context: {len(scenes)} scene(s), want 3"))
            wrong = [sc for sc in scenes if sc.get("ok") is False]
            if len(wrong) != 1:
                out.append(("V14", f"nuance[{i}] context: {len(wrong)} scene(s) marked ok: false, want exactly 1"))
            for sc in wrong:
                if not str(sc.get("fix") or "").strip():
                    out.append(("V14", f"nuance[{i}] context: the scene that does not fit has no fix"))
        elif kind == "swap":
            if len(n.get("before") or []) != 3:
                out.append(("V14", f"nuance[{i}] swap: before has {len(n.get('before') or [])} part(s), want 3"))
            elif not str((n.get("before") or ["", ""])[1]).strip():
                out.append(("V14", f"nuance[{i}] swap: the word to swap (before[1]) is empty"))
            elif _norm(n.get("before")[1]) == _norm(n.get("answer") or ""):
                out.append(("V14", f"nuance[{i}] swap: the word to swap is already the answer"))
            options, notes = n.get("options") or [], n.get("notes") or {}
            if n.get("answer") not in options:
                out.append(("V14", f"nuance[{i}] swap: answer {n.get('answer')!r} is not an option"))
            for o in options:
                if not str(notes.get(o) or "").strip():
                    out.append(("V14", f"nuance[{i}] swap: option {o!r} has no note"))
    reels = sum(1 for n in items or [] if n.get("kind") == "reel")
    if reels > 1:
        out.append(("V14", f"{reels} reels — a situation has at most one"))
    if required:
        if steps[1] == 0:
            out.append(("V14", "no STEP 1 nuance (slider|pair) — a v45 situation needs at least one"))
        if steps[2] == 0:
            out.append(("V14", "no STEP 2 nuance (reel|context|swap) — a v45 situation needs at least one"))
    return out


# ---------------------------------------------------------------------------
# v46 — 문장 낱장(tag·icon·why·decoy·distractorsKo·blank)과 순서 배열 카드(order).
# Go content/lessonv46.go 와 같은 규칙. 전부 선택 필드 — 없으면 묻지 않는다.
# ---------------------------------------------------------------------------

MAX_TAG_CHARS = 10   # Go MaxTagRunes — 머리 태그는 유형 라벨·"n / N"과 한 줄(줄바꿈 없음)
ORDER_LINES = 4      # Go OrderLines
BLANK_OPTIONS = 4    # Go BlankOptions
V46_SENTENCE_KEYS = ("tag", "icon", "why", "decoy", "distractorsKo", "blank")


def _filled(v) -> bool:
    return isinstance(v, str) and v.strip() != ""


def _is_word_char(ch: str) -> bool:
    return ch.isalpha() or ch.isdigit() or ch == "'"


def count_word_occurrences(text: str, part: str) -> int:
    """`part`가 `text`에 낱말 경계로 몇 번 나오는가 — 앞뒤에 글자·숫자·아포스트로피가 붙지 않은 자리만.
    "petit"은 "repetitive"에 없고, "it"은 "it feels it."에 두 번. 대소문자 구별. Go CountWordOccurrences 와 같다."""
    if not part:
        return 0
    n, i = 0, 0
    while True:
        at = text.find(part, i)
        if at < 0:
            return n
        end = at + len(part)
        if (at == 0 or not _is_word_char(text[at - 1])) and (end == len(text) or not _is_word_char(text[end])):
            n += 1
        i = at + 1


def _tag_problem(tag) -> str | None:
    if not _filled(tag):
        return "tag is blank"
    if len(tag.strip()) > MAX_TAG_CHARS:
        return f"tag {tag!r} has {len(tag.strip())} characters, want <= {MAX_TAG_CHARS}"
    return None


def _icon_problem(field: str, icon) -> str | None:
    if not _filled(icon):
        return f"{field} is blank"
    if icon not in NB_ICONS:
        return f"{field} {icon!r} is not an NbIcon name"
    return None


def check_sentence_v46(i: int, sent: dict) -> list[tuple[str, str]]:
    """V11(값 타입)·V18 — 문장 하나의 v46 필드. 키가 있는 것만 본다."""
    out: list[tuple[str, str]] = []
    at = f"sentence[{i}]"
    for k in ("tag", "icon", "why", "decoy", "distractorsKo"):
        out += [(r, f"{at}: {d}") for r, d in _not_str(sent.get(k), k)]
    blank = sent.get("blank")
    if isinstance(blank, dict):
        out += [(r, f"{at}: {d}") for r, d in _not_str(blank.get("answer"), "blank.answer")]
        for j, o in enumerate(blank.get("options") or []):
            if isinstance(o, dict):
                for k in ("en", "icon"):
                    out += [(r, f"{at}: {d}") for r, d in _not_str(o.get(k), f"blank.options[{j}].{k}")]
    if any(r == "V11" for r, _ in out):
        return out  # 불리언·숫자가 섞인 자리에서 아래 문자열 비교는 엉뚱한 말만 한다

    if "tag" in sent and (p := _tag_problem(sent.get("tag"))):
        out.append(("V18", f"{at}: {p}"))
    if "icon" in sent and (p := _icon_problem("icon", sent.get("icon"))):
        out.append(("V18", f"{at}: {p}"))
    if "why" in sent and not _filled(sent.get("why")):
        out.append(("V18", f"{at}: why is blank"))
    en, ko, chunks = str(sent.get("en") or ""), str(sent.get("ko") or ""), sent.get("chunks") or []
    if "decoy" in sent:
        d = _norm(sent.get("decoy") or "")
        if not d:
            out.append(("V18", f"{at}: decoy is blank"))
        elif count_word_occurrences(_norm(en), d) > 0:
            out.append(("V18", f"{at}: decoy {sent.get('decoy')!r} is part of the sentence — it would build a right answer"))
        elif any(_norm(c) == d for c in chunks):
            out.append(("V18", f"{at}: decoy {sent.get('decoy')!r} is one of the sentence's own chunks"))
    if "distractorsKo" in sent:
        opts = sent.get("distractorsKo")
        opts = opts if isinstance(opts, list) else []
        if len(opts) != 2:
            out.append(("V18", f"{at}: distractorsKo has {len(opts)}, want 2"))
        seen = {_norm(ko)}
        for o in opts:
            n = _norm(o)
            if not n:
                out.append(("V18", f"{at}: distractorsKo has a blank option"))
            elif n == _norm(ko):
                out.append(("V18", f"{at}: distractorsKo option {o!r} is the sentence's own ko"))
            elif n in seen:
                out.append(("V18", f"{at}: distractorsKo option {o!r} repeats"))
            seen.add(n)
    if "blank" in sent:
        if not isinstance(blank, dict):
            out.append(("V18", f"{at}: blank must be a mapping {{answer, options}}, got {blank!r}"))
            return out
        answer = blank.get("answer") or ""
        c = count_word_occurrences(en, answer)
        if not _filled(answer):
            out.append(("V18", f"{at}: blank answer is empty"))
        elif c == 0:
            out.append(("V18", f"{at}: blank answer {answer!r} is not a whole word or phrase of en {en!r}"))
        elif c > 1:
            out.append(("V18", f"{at}: blank answer {answer!r} occurs {c} times in en — the blank would be ambiguous"))
        opts = blank.get("options") or []
        if len(opts) != BLANK_OPTIONS:
            out.append(("V18", f"{at}: blank has {len(opts)} options, want {BLANK_OPTIONS}"))
        seen, offered = set(), False
        for o in opts:
            o = o if isinstance(o, dict) else {}
            n = _norm(o.get("en") or "")
            if not n:
                out.append(("V18", f"{at}: blank has an empty option"))
                continue
            if n in seen:
                out.append(("V18", f"{at}: blank option {o.get('en')!r} repeats"))
            seen.add(n)
            offered = offered or o.get("en") == answer
            if p := _icon_problem(f"blank option {o.get('en')!r} icon", o.get("icon")):
                out.append(("V18", f"{at}: {p}"))
        if not offered:
            out.append(("V18", f"{at}: blank answer {answer!r} is not one of the options"))
    return out


def check_order(order) -> list[tuple[str, str]]:
    """V11·V19 — 상황의 순서 배열 카드. 없으면(None) 묻지 않는다 — 화면이 그 장을 건너뛴다."""
    if order is None:
        return []
    if not isinstance(order, dict):
        return [("V19", f"order must be a mapping {{ko, why, lines}}, got {order!r}")]
    out: list[tuple[str, str]] = []
    for k in ("tag", "icon", "ko", "why"):
        out += [(r, f"order: {d}") for r, d in _not_str(order.get(k), k)]
    lines = order.get("lines") or []
    for j, l in enumerate(lines):
        if isinstance(l, dict):
            for k in ("en", "icon", "ko", "note"):
                out += [(r, f"order: {d}") for r, d in _not_str(l.get(k), f"lines[{j}].{k}")]
    if out:
        return out
    if not _filled(order.get("ko")):
        out.append(("V19", "order: ko is empty — the card's header line"))
    if not _filled(order.get("why")):
        out.append(("V19", "order: why is empty — the note after the answer"))
    if "tag" in order and (p := _tag_problem(order.get("tag"))):
        out.append(("V19", f"order: {p}"))
    if "icon" in order and (p := _icon_problem("icon", order.get("icon"))):
        out.append(("V19", f"order: {p}"))
    if len(lines) != ORDER_LINES:
        out.append(("V19", f"order: has {len(lines)} lines, want {ORDER_LINES}"))
    seen = set()
    for j, l in enumerate(lines):
        l = l if isinstance(l, dict) else {}
        if not _filled(l.get("en")):
            out.append(("V19", f"order: line {j} has no en"))
        elif _norm(l["en"]) in seen:
            out.append(("V19", f"order: line {j} {l['en']!r} repeats another line"))
        else:
            seen.add(_norm(l["en"]))
        if p := _icon_problem(f"line {j} icon", l.get("icon")):
            out.append(("V19", f"order: {p}"))
        for k in ("ko", "note"):
            if k in l and not _filled(l.get(k)):
                out.append(("V19", f"order: line {j} {k} is blank"))
    return out


V44_WORD_KEYS = ("id", "en", "ko", "ipa", "icon", "example")
V44_SENTENCE_KEYS = ("en", "ko", "chunks", "words", "goal")


def load_changes(raw: str) -> tuple[str, list[dict]]:
    """changes-<theme>.yaml → (theme, 변경 목록). 결정 11."""
    d = yaml.safe_load(raw) or {}
    return d.get("theme", ""), d.get("changes") or []


def _allowances(changes: list[dict]) -> tuple[dict, set, set, dict, list[str]]:
    """변경 목록을 V16이 쓰는 허용 집합으로. 끝의 목록은 목록 자체의 결함(why 없음·모르는 kind)."""
    word_fields: dict[str, set] = collections.defaultdict(set)
    added, removed = set(), set()
    sent_fields: dict[tuple, set] = collections.defaultdict(set)
    bad: list[str] = []
    for c in changes:
        kind = c.get("kind")
        if not str(c.get("why") or "").strip():
            bad.append(f"change {c!r} has no why")
        if kind == "word":
            word_fields[c.get("id")].update(c.get("fields") or [])
        elif kind == "word-add":
            added.add(c.get("id"))
        elif kind == "word-remove":
            removed.add(c.get("id"))
        elif kind == "sentence":
            sent_fields[(c.get("situation"), c.get("index"))].update(c.get("fields") or [])
        else:
            bad.append(f"change has unknown kind {kind!r}")
    return word_fields, added, removed, sent_fields, bad


def check_backfill(dept: str, base_banks: dict[str, list[dict]], base_seeds: list[dict],
                   banks: dict[str, list[dict]], seeds: list[dict],
                   changes: dict[str, list[dict]] | None = None) -> list["Violation"]:
    """V16 — 보강 패스가 v44 필드를 바꾸지 않았는가. 보강 전(base)과 후를 비교한다.

    `changes`(주제 → 변경 목록, 결정 11)에 적힌 변경만 허용한다. 목록 밖의 변경은 전부 오류다.
    """
    out: list[Violation] = []
    changes = changes or {}
    for theme, base_words in base_banks.items():
        wf, added, removed, _, bad = _allowances(changes.get(theme, []))
        for b in bad:
            out.append(Violation(dept, theme, "-", "V16", b))
        now = {w.get("id"): w for w in banks.get(theme, [])}
        base_ids = {w.get("id") for w in base_words}
        for wid in sorted(map(str, set(now) - base_ids)):
            if wid not in added:
                out.append(Violation(dept, theme, "-", "V16", f"word {wid!r} added without a word-add change"))
        for wid in sorted(map(str, base_ids - set(now))):
            if wid not in removed:
                out.append(Violation(dept, theme, "-", "V16", f"word {wid!r} removed without a word-remove change"))
        for bw in base_words:
            w = now.get(bw.get("id"))
            if w is None:
                continue
            for k in V44_WORD_KEYS:
                if bw.get(k) != w.get(k) and k not in wf.get(bw.get("id"), set()):
                    out.append(Violation(dept, theme, "-", "V16", f"word {bw.get('id')!r}: {k} changed {bw.get(k)!r} -> {w.get(k)!r}"))
    now_seeds = {(sd.get("theme"), sd.get("title")): sd for sd in seeds}
    for bs in base_seeds:
        if not bs.get("sentences"):
            continue
        key = (bs.get("theme"), bs.get("title"))
        sf = _allowances(changes.get(key[0], []))[3]
        sd = now_seeds.get(key)
        if sd is None:
            out.append(Violation(dept, key[0], key[1], "V16", "situation disappeared"))
            continue
        before, after = bs.get("sentences") or [], sd.get("sentences") or []
        if len(before) != len(after):
            out.append(Violation(dept, key[0], key[1], "V16", f"sentence count changed {len(before)} -> {len(after)}"))
            continue
        for i, (b, a) in enumerate(zip(before, after)):
            for k in V44_SENTENCE_KEYS:
                if b.get(k) != a.get(k) and k not in sf.get((key[1], i), set()):
                    out.append(Violation(dept, key[0], key[1], "V16", f"sentence[{i}] {k} changed"))
            # V17 — 문장 ko를 고쳤는데 그 문장을 예문으로 쓰는 단어의 exKo가 옛 번역 그대로다.
            # 결정 13: Sonnet 수정이 두 주제 모두 이렇게 빠뜨렸다(w-neck·w-numbness). 원래부터
            # 다른 의역인 exKo(정본 ER 715건)는 잡지 않는다 — 옛 문장 ko와 글자까지 같은 것만.
            if b.get("ko") and b.get("ko") != a.get("ko"):
                for w in banks.get(key[0], []):
                    if w.get("example") == a.get("en") and w.get("exKo") == b.get("ko"):
                        out.append(Violation(dept, key[0], key[1], "V17",
                                             f"word {w.get('id')!r}: exKo is the old ko of sentence[{i}] — update it with the sentence"))
    return out


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
    raw_banks: dict[str, list[dict]] | None = None,
) -> tuple[list[Violation], list[Violation], dict]:
    """한 부서의 (렉시콘, 시드 목록)을 검사한다.

    돌려주는 것: (오류 목록, 경고 목록, 커버리지 통계).
    """
    violations: list[Violation] = []
    used_words_by_theme: dict[str, set[str]] = collections.defaultdict(set)
    themes_seen: set[str] = set()
    v45_themes: set[str] = set()
    v45_warnings: list[Violation] = []

    # V10 — 은행 안의 id 중복. 서버(gencontent)가 적재할 때 오류로 막는 조건이라,
    # 여기서 통과시키면 파일을 합치는 순간에야 드러난다. raw_banks가 없으면(옛
    # 호출부) 검사를 건너뛴다 — 사전으로 접힌 은행에서는 볼 수 없는 것이다.
    for theme, words in (raw_banks or {}).items():
        if theme_filter and theme != theme_filter:
            continue
        for wid in duplicate_word_ids(words):
            violations.append(Violation(dept, theme, "-", "V10", f"bank has duplicate word id {wid!r}"))

        # V11 — 은행 항목의 값이 문자열이 아니다. YAML 1.1은 따옴표 없는 `off`·`on`·`no`·
        # `yes`·`y`·`n`을 불리언으로 읽는다. 전부 임상에서 쓰는 말이라 `en: off`가 말없이
        # `False`가 되고, 그 뒤로 V2가 낼 말은 어형이 어긋났다는 엉뚱한 소리뿐이다.
        # icu-cardiogenic 저작자가 실제로 여기 걸려 한참을 헤맸다.
        for w in words:
            for key in ("id", "en", "ko"):
                val = w.get(key)
                if val is not None and not isinstance(val, str):
                    violations.append(Violation(
                        dept, theme, "-", "V11",
                        f"word {w.get('id')!r}: {key}={val!r} is {type(val).__name__}, not a string "
                        f"(YAML reads bare off/on/no/yes as booleans — quote it)",
                    ))

        # V12·V13 — v45 은행이면 모든 단어에 회상 재료가 온전히 있어야 한다.
        if any(is_v45_word(w) for w in words):
            v45_themes.add(theme)
            for w in words:
                for rule, detail in check_word_v45(w):
                    # W13 은 경고다. 어간 규칙은 공격적이라(tube/tub, unit/unity) 같은 낱말인지
                    # 기계가 확정할 수 없고, worse/worst 처럼 뜻이 다른 좋은 오답도 같이 걸린다.
                    (v45_warnings if rule.startswith("W") else violations).append(Violation(dept, theme, "-", rule, detail))

    n_seeds = n_with_sentences = 0

    for seed in seeds:
        theme = seed.get("theme")
        if theme_filter and theme != theme_filter:
            continue
        n_seeds += 1
        themes_seen.add(theme)
        sentences = seed.get("sentences")
        if not sentences:
            if seed.get("nuance"):
                violations.append(Violation(dept, theme, seed.get("title", "?"), "V15",
                                            "has nuance but no sentences to anchor it"))
            if seed.get("order") is not None:
                violations.append(Violation(dept, theme, seed.get("title", "?"), "V19",
                                            "has an order card but no sentences — there is no STEP 2 to hold it"))
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
                if not isinstance(wdef.get("en"), str):
                    # V11이 이미 잡은 자리다(따옴표 없는 `true`·`off` 따위). 여기서
                    # 그냥 넘기지 않으면 `tokenize`가 불리언을 받아 터지고, **V11이
                    # 보고되기도 전에** 검사기 전체가 죽는다. 실제로 core-language-or
                    # 저작자가 그 오류를 만났다 — 원인과 아무 상관 없는 말만 보인다.
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

            # V18 — v46 낱장 필드(있을 때만)
            for rule, detail in check_sentence_v46(i, sent):
                violations.append(Violation(dept, theme, title, rule, detail))

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

        # V14·V15 — 뉘앙스. 이 상황 문장이 쓰는 단어 id를 기준으로 본다.
        sentence_word_ids = {w for sent in sentences for w in (sent.get("words") or [])}
        for rule, detail in check_nuance(seed.get("nuance") or [], sentence_word_ids, theme in v45_themes):
            violations.append(Violation(dept, theme, title, rule, detail))

        # V19 — 순서 배열 카드(있을 때만)
        for rule, detail in check_order(seed.get("order")):
            violations.append(Violation(dept, theme, title, rule, detail))

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

    warnings += v45_warnings
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
    ("You are colder than you feel, so let us get you warm.", "cold", True),
    ("The pain is sharper when you breathe in?", "sharp", True),
    # ⑲ -ing 명사의 복수형 — elif 사슬이 한 갈래만 타므로 마지막에 한 번 더 뗀다.
    ("Have you noticed feeling like this in the mornings before?", "morning", True),
    ("You had a seizure earlier.", "have", True),
    ("Cultures were drawn before the antibiotic.", "draw", True),
    ("Any known allergies?", "know", True),
    # ⑳ 불규칙 명사 복수형
    ("Your hands and feet are going cold and blotchy.", "foot", True),
    ("Can you smile and show me your teeth?", "tooth", True),
    ("We check every child's injury to keep them safe.", "child", True),
    # ㉑ 남은 불규칙 — 흔한 동사 마흔 짝을 훑어 찾아냈다.
    ("We only did it to keep you safe.", "do", True),
    ("The blood is frozen for later testing.", "freeze", True),
    ("He bled through the dressing.", "bleed", True),
    # ⑧ 원래 -eed로 끝나는 낱말은 어미로 보지 않는다
    ("She is bleeding from the wound.", "bleed", True),
    ("We are feeding him slowly.", "feed", True),
    ("He needed two units.", "need", True),
    # 비교급을 넣지 않은 이유 — 둘 다 오탐의 값이 비싸다.
    ("What is the room number?", "numb", False),
    ("Is your arm numb?", "numb", True),
    ("I always confirm two identifiers for every patient.", "identifier", True),
    # ⑬ 형용사 비교급 — icu-shock의 `firmer` 하나가 보고된 뒤 마흔여섯 짝을 훑어 서른일곱을
    #    채웠다. 표에 얹힌 것을 문장 자리에서도 확인한다.
    ("His belly is getting firmer than an hour ago.", "firm", True),
    ("Her breathing is quieter and steadier now.", "steady", True),
    ("The drainage looks thicker and darker today.", "thick", True),
    ("He gets dizzier when he sits up.", "dizzy", True),
    ("Let me tie the gown a little looser.", "loose", True),
    ("The alarm is louder than the others.", "loud", True),
    ("Her skin looks paler than this morning.", "pale", True),
    ("This is the simplest way to explain it.", "simple", True),
    # 명사와 겹치는 `-er`은 비교급으로 보지 않는다. `stranger`(낯선 사람)와
    # `cleaner`(청소 담당·세정제)는 `number`·`identifier`와 같은 자리에 있다.
    ("A stranger brought him in.", "strange", False),
    ("The cleaner will come after the transfer.", "clean", False),
    ("This is the strangest reading I have seen.", "strange", True),
    ("Let me get you the cleanest gown we have.", "clean", True),
    # ⑭ `s`로 끝나는 단수 명사. `lenses`는 `-es`를 떼고 `lens`에서 멈추는데 원형 `lens`는
    #    끝의 `s`가 복수형으로 보여 `len`이 되어 서로 갈렸다(icu-delirium에서 보고됨).
    ("I'll clean the lenses so everything looks clearer.", "lens", True),
    ("Her contact lens is still in the right eye.", "lens", True),
    # ⑮ 불규칙·`-ier` 비교급 여섯. `-er`로 끝나는 낱말 161종 가운데 진짜 비교급은 이것뿐이다.
    ("Combining mechanisms improves comfort with fewer side effects.", "few", True),
    ("Call me sooner next time if it gets worse.", "soon", True),
    ("His pain is milder than it was this morning.", "mild", True),
    ("Waiting makes the procedure riskier for him.", "risky", True),
    # ⑯ `-ie`로 끝나는 명사. `-ies` 규칙이 `-y`로 되돌리는 바람에 짝과 갈렸다
    #    (icu-aki-crrt에서 보고됨). 바로 아래 두 건은 그 규칙이 여전히 살아 있어야 한다는
    #    쪽이다 — 표를 넓히다 `-y` 명사를 건드리면 이 둘이 먼저 깨진다.
    ("We increase his calories to make up for what CRRT takes out.", "calorie", True),
    ("Have the bougies ready at the bedside.", "bougie", True),
    ("Tell me about his allergies.", "allergy", True),
    ("Both injuries are on the same side.", "injury", True),
    # ⑰ 접두사가 붙은 불규칙. `draw`/`drawn`은 표에 있는데 `withdraw`/`withdrawn`은 없어서
    #    거절됐다(icu-brain-death에서 보고됨). 열네 짝을 훑어 열둘이 어긋나 있었다.
    ("Here, support is withdrawn first, and we wait.", "withdraw", True),
    ("He underwent surgery last night.", "undergo", True),
    ("The dose was withheld this morning.", "withhold", True),
    # 이 규칙은 **어미를 뗀 뒤에** 봐야 한다. 맨 앞에 뒀더니 `relying`이 `re`+`lying`으로
    # 쪼개져 `lie`를 거쳤고, `rely`와 갈렸다. 아래 둘이 그 자리를 지킨다.
    ("She is relying on the machine to breathe.", "rely", True),
    ("He relies on his daughter for everything.", "rely", True),
    # ⑱ `be-`·`for-` 계열은 접두사 규칙이 보지 않는다(`beside`·`forehead` 때문에). 표로 채웠다.
    ("His pupil just became sluggish, and this is an emergency.", "become", True),
    ("She has forgotten why she is here.", "forget", True),
    ("Let me put that in plainer terms for you.", "plain", True),
    # ⑲ 불규칙 동사 목록 전체와 대조해 쉰다섯을 채웠다. `hidden` 하나가 보고된 자리다.
    ("Nothing is being hidden — let me go through everything with you.", "hide", True),
    ("His fever rose again overnight.", "rise", True),
    ("The alarm rang twice while you were out.", "ring", True),
    ("We sought a second opinion this morning.", "seek", True),
    ("She was struck by a car last night.", "strike", True),
    # 값이 비싸서 **일부러 넣지 않은** 짝들. 이 넷이 표를 넓히는 손을 막는다.
    ("Let me look at the wound on his leg.", "wind", False),
    ("He is due for a flu shot.", "shoot", False),
    ("The gown is torn at the shoulder.", "tear", True),
    ("We overshot — her temperature is climbing too high.", "overshoot", True),
    ("He is due for a flu shot.", "overshoot", False),
    ("We follow bloodborne precautions here.", "bear", False),
    # ⑳ `-ic` 형용사의 부사는 `-ically`다. `-ly`만 떼면 `systematical`이 남아 갈린다
    #    (or-count 에서 보고됨). `-ical`을 `-ic`으로 마저 모아 양쪽을 만나게 했다.
    ("Let's search the drapes systematically.", "systematic", True),
    ("She is critically ill right now.", "critical", True),
    ("He is clinically stable this morning.", "clinical", True),
    ("Check him neurologically every hour.", "neurologic", True),
    # ㉑ `-f`·`-fe` 명사의 복수형 (or-count 의 `halves`).
    ("Let's account for both halves before closing.", "half", True),
    ("Check the calves for swelling.", "calf", True),
    # `lives`는 표에 넣지 않았다. 아래 둘이 그 자리를 지킨다 — 넣으면 뒤엣것이 깨진다.
    ("We saved three lives tonight.", "life", False),
    ("He lives alone at home.", "live", True),
    ("Nothing leaves this room without your say.", "leave", True),
    ("Sweep the leaves off the ramp.", "leaf", False),
    # ㉒ `-le` 형용사의 부사. 어미에서 `e`가 `y`로 바뀌어 `-ly`만 떼면 갈린다
    #    (or-induction-airway 에서 보고됨). 서른셋 전부 어긋나 있었다.
    ("I'll hold the mask gently and keep him calm.", "gentle", True),
    ("Just breathe normally and stay comfortably still.", "comfortable", True),
    ("His pressure is probably going to drop.", "probable", True),
    ("Simply squeeze my hand if it hurts.", "simple", True),
    # 규칙으로 넓히면 아래 둘이 먼저 깨진다. `gently`의 `gent`와 `badly`의 `bad`를
    # 낱말 모양만 보고 가를 수 없어 표로 둔 이유다.
    ("He is breathing badly right now.", "bad", True),
    ("We can move you safely now.", "safe", True),
    # ㉓ `-ee` 동사의 과거형. `-eed` 예외에 걸려 원형과 갈렸다
    #    (or-preop-verification 에서 보고됨). 예외 자체는 남기고 예외의 예외만 표로 판다.
    ("Let me clarify exactly what you've agreed to.", "agree", True),
    ("Her hands are freed now that the restraints are off.", "free", True),
    # `-eed` 예외가 지켜야 하는 쪽. 표를 규칙으로 바꾸면 이 넷이 먼저 깨진다.
    ("She is bleeding from the wound.", "bleed", True),
    ("We are feeding him slowly.", "feed", True),
    ("He needed two units.", "need", True),
    ("Let's proceed with the case.", "proceed", True),
    # 겉모양이 같아도 비교급이 아닌 것들. 전수 조사에서 가장 흔했던 축이다.
    ("I'll flush the catheter now.", "cat", False),
    ("Let me call the interpreter for you.", "interpret", False),
    # 아래 넷은 이 고침을 **규칙으로** 하면 깨지는 자리다. `stem`을 두 번 돌려 `lens`와
    # `lenses`를 모으려 했더니, 끝의 `e`를 뗀 뒤 남은 `s`를 두 번째 바퀴가 복수형으로 보아
    # `dose`가 `do`와, `pulse`가 `pull`과 한 자리에 모였다. 표로 바꾼 이유가 이것이다.
    ("Give the second dose in one hour.", "do", False),
    ("I can do that for you now.", "dose", False),
    ("His pulse is weak on the left side.", "pull", False),
    ("Don't pull on the line, please.", "pulse", False),
    # ⑩ -ly 부사 · -y 형용사 · 네 글자 과거형 (흉통 주제에서 부딪힌 것들)
    ("She looks pale and sweaty.", "sweat", True),
    ("Take this seriously, please.", "serious", True),
    ("We can move you safely now.", "safe", True),
    ("Have you used cocaine today?", "use", True),
    ("Her family is waiting outside.", "family", True),
    # ⑪ 최상급을 넣지 않은 이유 — arrest가 뭉개진다. 이 둘이 그 판단을 지킨다.
    ("He re-arrested — restart compressions immediately.", "arrest", True),
    ("We need to find why he keeps re-arresting.", "arrest", True),
    # ⑫ 끝의 e는 남김없이 뗀다
    ("The team agrees it's time to focus on his comfort.", "agree", True),
    # ⑬ 세 글자 약어의 복수형
    ("Two large-bore IVs and get O-negative blood up here.", "IV", True),
    # ⑭ 비교급·최상급 — 규칙이 아니라 표로 본다(COMPARATIVE).
    ("Is it worse when you lie down?", "bad", True),
    ("This will help you breathe easier.", "easy", True),
    ("Your oxygen is lower than we'd like.", "low", True),
    ("Has your cough gotten weaker?", "weak", True),
    ("We want a safe number, not the highest number.", "high", True),
    ("Once you feel better, we will move you.", "good", True),
    # 병원에서 명사로 쓰이는 것은 표에 넣지 않는다.
    ("Blood bank has two more coolers on the way.", "cooler", True),
    ("The baby is under a warmer.", "warmer", True),
    # ⑮ 다섯 글자 -ing — 규칙이 못 잡아 표에 적었다. thing·bring이 함께 지켜져야 한다.
    ("Is it worse when you lie flat or at night?", "lying", True),
    ("He is lying on his left side.", "lie", True),
    ("We are using the smaller mask.", "use", True),
    ("Is the cough bringing anything up?", "bring", True),
    ("Two more things to check.", "thing", True),
    # ⑯ -ily 부사 — 자음+y 형용사가 부사가 될 때 y가 i로 바뀐다.
    ("Blood can spread more easily on thinners.", "easy", True),
    # -age 명사화는 일부러 묶지 않는다. identify/identification과 같은 부류다.
    ("We are watching your drainage.", "drain", False),
    # ⑰ -as 복수형 — 짧은 낱말만 예외다.
    ("Your legs and back count as larger areas than your arms.", "area", True),
    ("Have you ever been stung and reacted like this before?", "sting", True),
    ("She has two lines in.", "has", True),
    # thinner는 비교급 표에 넣지 않는다 — 이 콘텐츠에서 명사다(blood thinner).
    ("Which blood thinner do you take?", "blood thinner", True),
    ("Which blood thinner do you take?", "thin", False),
    ("Is the blood darker or lighter than before?", "dark", True),
    ("Is the blood darker or lighter than before?", "light", True),
    # ⑱ 어미를 뗀 결과가 다시 표에 있는 경우 — thought는 명사이자 동사 과거형이다.
    ("Have you had thoughts like this before today?", "thought", True),
    ("Have you thought about hurting yourself?", "think", True),
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


# 어간 값 자체를 재는 표본. `word_appears`만으로는 부족하다 — 원형과 활용형이 **똑같이**
# 망가지면 매칭은 여전히 맞아서, 규칙이 낱말을 통째로 뭉개도 통과한다. 이 콘텐츠에서 흔한
# 낱말이 제 모습으로 남는지는 여기서 잰다.
_STEM_VALUE_CASES = [
    ("chest", "chest"),   # 한때 최상급 규칙이 `ch`로 뭉갰다
    ("arrest", "arrest"),  # 같은 규칙이 `ar`로 뭉갰다 — 심정지 주제의 중심 낱말이다
    ("request", "request"),
    ("suggest", "suggest"),
    ("test", "test"),
    ("rest", "rest"),
    ("heart", "heart"),
    ("pain", "pain"),
    ("blood", "blood"),
    ("gas", "gas"),        # 세 글자 -s 낱말이 복수형 규칙에 걸리면 안 된다
    ("his", "his"),
]


def run_stem_selftest() -> int:
    bad = 0
    for tok, want in _STEM_VALUE_CASES:
        got = stem(tok)
        if got != want:
            bad += 1
            print(f"[FAIL] stem({tok!r}) = {got!r}, want {want!r}")
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

    # V9 예외 — 홀로 선 대문자 한 글자는 관사가 아니라 라벨이다(`plan A`·`specimen B`).
    # 소문자로 내려 비교하던 탓에 멀쩡한 청크가 두 번 거절됐다.
    v9ok = """
  sentences:
    - en: "If plan A fails, check the name on the band."
      ko: "A 계획이 안 되면 밴드의 이름을 확인합니다."
      chunks: ["If plan A", "fails,", "check the name", "on the band", "."]
      words: [w-check, w-name, w-band]
      goal: 1
""" + _good_sentences().split("  sentences:\n", 1)[1]
    # V8 예외 — 엠대시는 낱말이 아니다. 아래 문장은 글자가 있는 토막이 여덟이라
    # 조각 셋이면 충분한데, `—`를 세던 때는 넷을 요구했다.
    v8ok = """
  sentences:
    - en: "Check the name — the wristband is right there."
      ko: "이름을 확인하세요 — 손목밴드가 바로 거기 있습니다."
      chunks: ["Check the name", "— the wristband", "is right there", "."]
      words: [w-check, w-name, w-wristband]
      goal: 1
""" + _good_sentences().split("  sentences:\n", 1)[1]
    cases.append(("V8 exception (an em dash is not a word)", _LEX_BASE, _seed_with_sentences(v8ok), "", False))

    cases.append(("V9 exception (a bare capital letter is a label)", _LEX_BASE, _seed_with_sentences(v9ok), "", False))

    # V10 — 은행에 같은 id가 두 번 있다. 문장 쪽은 GOOD과 한 글자도 다르지 않다.
    # 실제로 er-poisoning 은행이 이 모양이었고(w-oxygen 두 번), 35개 주제를 전부
    # "통과"로 넘긴 뒤 gencontent가 적재하는 자리에서야 드러났다.
    lex_dup = _LEX_BASE.rstrip("\n") + "\n    - {id: w-check, en: check, ipa: /x/, ko: 확인, icon: board, example: e2}\n"
    cases.append(("V10 (duplicate bank word id)", lex_dup, _seed_with_sentences(_good_sentences()), "V10", False))

    # V11 — 따옴표 없는 `off`. YAML이 불리언으로 읽어 `en`이 False가 된다. 실제로
    # icu-cardiogenic 저작자가 여기 걸렸고, 그때 검사기가 낸 말은 V2(어형 불일치)라
    # 원인과 아무 상관이 없었다.
    lex_bool = _LEX_BASE.rstrip("\n") + "\n    - {id: w-off, en: off, ipa: /x/, ko: 끔, icon: board, example: e}\n"
    cases.append(("V11 (bare off parsed as boolean)", lex_bool, _seed_with_sentences(_good_sentences()), "V11", False))

    # ── v45 (V12~V15) — GOOD 대조군을 v45로 바꾼 은행과 뉘앙스 ──
    def v45_lex(mutate=None) -> str:
        banks = yaml.safe_load(_LEX_BASE)
        for w in banks[0]["words"]:
            en = w["en"]
            w.update({
                "exKo": "예문 번역", "cue": "맥락 단서", "tag": "분류",
                "distractorsEn": [en + "x", en + "y"], "distractorsKo": [w["ko"] + "1", w["ko"] + "2"],
                "chips": [[en[: len(en) // 2], en[len(en) // 2:]]], "decoyChips": ["zz"],
            })
        if mutate:
            mutate(banks[0]["words"])
        return yaml.safe_dump(banks, allow_unicode=True)

    good_nuance = [
        {"kind": "slider", "words": ["w-check"], "cue": "c", "scale": ["a", "b", "c"], "answerAt": 1, "why": "w"},
        {"kind": "context", "words": ["w-name"], "why": "w", "scenes": [
            {"who": "a", "en": "1", "ok": True}, {"who": "b", "en": "2", "ok": False, "fix": "f"}, {"who": "c", "en": "3", "ok": True}]},
    ]

    def v45_seed(nuance) -> str:
        seeds = parse_topics(_seed_with_sentences(_good_sentences()))
        if nuance is not None:
            seeds[0]["nuance"] = nuance
        return yaml.safe_dump(seeds, allow_unicode=True)

    cases.append(("GOOD v45 (no violations expected)", v45_lex(), v45_seed(good_nuance), "", False))
    cases.append(("V12 (cue missing)", v45_lex(lambda ws: ws[0].update(cue="")), v45_seed(good_nuance), "V12", False))
    cases.append(("V12 (chips joined with a space do not make the word)",
                  v45_lex(lambda ws: ws[0].update(chips=[["wrist"], ["band"]])), v45_seed(good_nuance), "V12", False))
    cases.append(("V12 (half-backfilled bank — one word still v44)",
                  v45_lex(lambda ws: [ws[1].pop(k) for k in V45_WORD_FIELDS]), v45_seed(good_nuance), "V12", False))
    cases.append(("V13 (a distractor is the answer)",
                  v45_lex(lambda ws: ws[0].update(distractorsEn=["Wristband", "armband"])), v45_seed(good_nuance), "V13", False))
    cases.append(("V13 (a decoy chip is a real fragment)",
                  v45_lex(lambda ws: ws[0].update(decoyChips=[ws[0]["chips"][0][0]])), v45_seed(good_nuance), "V13", False))
    cases.append(("V13 (the cue gives the answer away)",
                  v45_lex(lambda ws: ws[0].update(cue="wristband을 확인")), v45_seed(good_nuance), "V13", False))
    cases.append(("V14 (a v45 situation with no nuance)", v45_lex(), v45_seed(None), "V14", False))
    two_wrong = [dict(good_nuance[0]), {**good_nuance[1], "scenes": [
        {"who": "a", "en": "1", "ok": False, "fix": "f"}, {"who": "b", "en": "2", "ok": False, "fix": "f"}, {"who": "c", "en": "3", "ok": True}]}]
    cases.append(("V14 (context with two scenes that do not fit)", v45_lex(), v45_seed(two_wrong), "V14", False))
    stray = [{**good_nuance[0], "words": ["w-nowhere"]}, good_nuance[1]]
    cases.append(("V15 (nuance on a word the sentences do not use)", v45_lex(), v45_seed(stray), "V15", False))
    # 파일럿 3주제가 짚은 구멍들 (2026-09-30)
    cases.append(("V11 (bare on inside decoyChips reads as a boolean)",
                  v45_lex(lambda ws: ws[0].update(decoyChips=[True])), v45_seed(good_nuance), "V11", False))
    cases.append(("V12 (too many fragments)",
                  v45_lex(lambda ws: ws[0].update(chips=[list(ws[0]["en"][:5]), [ws[0]["en"][5:]]])), v45_seed(good_nuance), "V12", False))
    swap_empty = [good_nuance[0], {"kind": "swap", "words": ["w-name"], "before": ["", "", " b"], "options": ["x", "y"],
                                   "answer": "x", "notes": {"x": "1", "y": "2"}, "why": "w"}]
    cases.append(("V14 (swap with nothing to swap)", v45_lex(), v45_seed(swap_empty), "V14", False))
    swap_same = [good_nuance[0], {**swap_empty[1], "before": ["a ", "x", " b"]}]
    cases.append(("V14 (swap target is already the answer)", v45_lex(), v45_seed(swap_same), "V14", False))
    reel = {"kind": "reel", "words": ["w-name"], "word": "name", "scenes": [{"who": str(k), "en": str(k)} for k in range(4)],
            "feels": ["a", "b", "c"], "why": "w"}
    cases.append(("V14 (two reels)", v45_lex(), v45_seed(good_nuance + [reel, reel]), "V14", False))
    cases.append(("one complete reel — no violations", v45_lex(), v45_seed(good_nuance + [reel]), "", False))
    cases.append(("V14 (reel without feels)", v45_lex(), v45_seed(good_nuance + [{**reel, "feels": []}]), "V14", False))
    cases.append(("V14 (reel feel repeated)", v45_lex(), v45_seed(good_nuance + [{**reel, "feels": ["a", "a", "b"]}]), "V14", False))
    cases.append(("V14 (reel without why)", v45_lex(), v45_seed(good_nuance + [{**reel, "why": ""}]), "V14", False))
    pair_decoy = [{"kind": "pair", "words": ["w-name"], "pairs": [["a", "b"], ["c", "d"]], "decoys": ["b"], "why": "w"}, good_nuance[1]]
    cases.append(("V14 (a pair decoy is also a right answer)", v45_lex(), v45_seed(pair_decoy), "V14", False))
    bad_icon = [good_nuance[0], {**good_nuance[1], "scenes": [{**good_nuance[1]["scenes"][0], "icon": "round"}] + good_nuance[1]["scenes"][1:]}]
    cases.append(("V14 (a scene icon NbIcon does not draw)", v45_lex(), v45_seed(bad_icon), "V14", False))
    cases.append(("W13 (a distractor that is only a past tense — warning)",
                  v45_lex(lambda ws: ws[1].update(distractorsEn=["checked", "chuck"])), v45_seed(good_nuance), "W13", True))

    # v44 은행에 뉘앙스가 없는 것은 정상이다 — 보강 전의 ER·ICU·OR.
    cases.append(("v44 bank, no nuance (no violations expected)", _LEX_BASE, v45_seed(None), "", False))

    # ── v46 (V18·V19, V14 더함) — 핸드오프 SENTS 모양을 GOOD 대조군 둘째 문장("Let me check your
    # wristband.")에 얹는다. 은행은 v44 그대로 — v46 필드는 은행 판과 무관하게 선택이다.
    def v46_sentence() -> dict:
        return {
            "tag": "신원 확인", "icon": "bandage", "why": "Let me…로 시작하면 지시가 아니라 안내로 들려요.",
            "decoy": "for the doctor", "distractorsKo": ["지금 약을 드릴게요", "차트에 기록했어요"],
            "blank": {"answer": "wristband", "options": [
                {"en": "wristband", "icon": "bandage"}, {"en": "chart", "icon": "board"},
                {"en": "pill", "icon": "pill"}, {"en": "monitor", "icon": "monitor"}]},
        }

    def v46_order() -> dict:
        return {"tag": "대화 흐름", "icon": "compass", "ko": "신원 확인 4문장 순서", "why": "공감이 먼저예요.",
                "lines": [{"en": "I know it feels repetitive.", "icon": "faceAngry", "ko": "반복처럼 느껴지시죠", "note": "공감"},
                          {"en": "It's for your safety.", "icon": "shield", "note": "이유"},
                          {"en": "Can you tell me your name?", "icon": "board", "note": "확인"},
                          {"en": "Thank you.", "icon": "star", "note": "감사"}]}

    def v46_seed(sent_mut=None, order="good", nuance=None, sentences=True) -> str:
        seeds = parse_topics(_seed_with_sentences(_good_sentences()))
        sn = seeds[0]["sentences"][1]
        sn.update(v46_sentence())
        if sent_mut:
            sent_mut(sn)
        if order is not None:
            seeds[0]["order"] = v46_order() if order == "good" else order
        if nuance is not None:
            seeds[0]["nuance"] = nuance
        if not sentences:
            seeds[0].pop("sentences")
        return yaml.safe_dump(seeds, allow_unicode=True)

    def order_with(mut) -> dict:
        o = v46_order()
        mut(o)
        return o

    cases.append(("GOOD v46 (no violations expected)", _LEX_BASE, v46_seed(), "", False))
    cases.append(("v46 fields absent (no violations expected)", _LEX_BASE, v46_seed(lambda s: [s.pop(k) for k in V46_SENTENCE_KEYS], order=None), "", False))
    for name, mut in (
        ("empty tag", lambda s: s.update(tag="")),
        ("tag longer than 10 characters", lambda s: s.update(tag="환자에게 반복 신원확인 이유 설명")),
        ("icon NbIcon does not draw", lambda s: s.update(icon="round")),
        ("empty icon", lambda s: s.update(icon="")),
        ("empty why", lambda s: s.update(why=" ")),
        ("decoy is one of the chunks", lambda s: s.update(decoy="Check Your")),
        ("decoy is inside the en", lambda s: s.update(decoy="me check")),
        ("empty decoy", lambda s: s.update(decoy="")),
        ("one ko distractor", lambda s: s.update(distractorsKo=["지금 약을 드릴게요"])),
        ("ko distractor is the ko", lambda s: s.update(distractorsKo=[s["ko"], "차트에 기록했어요"])),
        ("ko distractors repeat", lambda s: s.update(distractorsKo=["같은 말", "같은 말"])),
        ("blank answer not in en", lambda s: s["blank"].update(answer="bandage")),
        ("blank answer mid-word", lambda s: (s["blank"].update(answer="wrist"), s["blank"]["options"][0].update(en="wrist"))),
        ("blank answer twice in en", lambda s: s.update(en="Let me check your wristband, your wristband.",
                                                        chunks=["Let me", "check your", "wristband", ", your wristband", "."])),
        ("blank with three options", lambda s: s["blank"]["options"].pop()),
        ("blank answer not offered", lambda s: s["blank"]["options"][0].update(en="band")),
        ("blank options repeat", lambda s: s["blank"]["options"][2].update(en="Chart")),
        ("blank option icon NbIcon does not draw", lambda s: s["blank"]["options"][3].update(icon="round")),
        ("blank option without icon", lambda s: s["blank"]["options"][3].pop("icon")),
        ("blank is not a mapping", lambda s: s.update(blank=["wristband"])),
    ):
        cases.append((f"V18 ({name})", _LEX_BASE, v46_seed(mut), "V18", False))
    cases.append(("V11 (bare on as a sentence tag reads as a boolean)", _LEX_BASE, v46_seed(lambda s: s.update(tag=True)), "V11", False))
    for name, mut in (
        ("three lines", lambda o: o["lines"].pop()),
        ("five lines", lambda o: o["lines"].append({"en": "Bye.", "icon": "star"})),
        ("no ko", lambda o: o.pop("ko")),
        ("no why", lambda o: o.update(why="")),
        ("tag longer than 10 characters", lambda o: o.update(tag="불만 환자 응대의 대화 흐름 순서")),
        ("icon NbIcon does not draw", lambda o: o.update(icon="round")),
        ("line without en", lambda o: o["lines"][2].update(en=" ")),
        ("line without icon", lambda o: o["lines"][1].pop("icon")),
        ("line icon NbIcon does not draw", lambda o: o["lines"][1].update(icon="round")),
        ("line note blank", lambda o: o["lines"][1].update(note="")),
        ("line ko blank", lambda o: o["lines"][0].update(ko=" ")),
        ("lines repeat", lambda o: o["lines"][3].update(en="it's for your  safety.")),
    ):
        cases.append((f"V19 ({name})", _LEX_BASE, v46_seed(order=order_with(mut)), "V19", False))
    cases.append(("V19 (order is not a mapping)", _LEX_BASE, v46_seed(order=["a", "b", "c", "d"]), "V19", False))
    cases.append(("V19 (an order card with no sentences)", _LEX_BASE, v46_seed(sentences=False), "V19", False))
    ctx = {"kind": "context", "words": ["w-name"], "why": "w", "word": "name", "ko": "이름", "scenes": [
        {"who": "a", "en": "1", "ok": True}, {"who": "b", "en": "2", "ok": False, "fix": "f"}, {"who": "c", "en": "3", "ok": True}]}
    swap = {"kind": "swap", "words": ["w-check"], "before": ["a ", "x", " b"], "options": ["y", "z"], "answer": "y",
            "notes": {"y": "1", "z": "2"}, "why": "w", "ko": "어젯밤 어머니가 돌아가셨어요"}
    cases.append(("GOOD v46 nuance — context word+ko, swap ko", _LEX_BASE, v46_seed(nuance=[ctx, swap]), "", False))
    cases.append(("V14 (context ko without its word)", _LEX_BASE, v46_seed(nuance=[{**ctx, "word": ""}, swap]), "V14", False))
    cases.append(("V14 (context word without its ko)", _LEX_BASE, v46_seed(nuance=[{k: v for k, v in ctx.items() if k != "ko"}, swap]), "V14", False))
    cases.append(("V14 (swap ko blank)", _LEX_BASE, v46_seed(nuance=[ctx, {**swap, "ko": " "}]), "V14", False))

    ok = True
    print("=== verify_lesson_content.py selftest ===")
    stem_bad = run_stem_selftest()
    for name, lex_yaml, seeds_yaml, want_rule, is_warning in cases:
        lexicon = parse_lexicon(lex_yaml)
        seeds = parse_topics(seeds_yaml)
        violations, warnings, _ = verify_dept(
            "selftest", lexicon, seeds, theme_filter=None, raw_banks=parse_lexicon_raw(lex_yaml)
        )
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
    # V16 — 보강 전후 비교. 새 필드만 더한 것은 통과, v44 필드를 바꾼 것은 걸린다.
    base_banks, base_seeds = parse_lexicon_raw(_LEX_BASE), parse_topics(_seed_with_sentences(_good_sentences()))
    after_ok_banks, after_ok_seeds = parse_lexicon_raw(v45_lex()), parse_topics(v45_seed(good_nuance))
    v16_ok = not check_backfill("selftest", base_banks, base_seeds, after_ok_banks, after_ok_seeds)
    touched = parse_topics(v45_seed(good_nuance))
    touched[0]["sentences"][0]["ko"] = "바뀐 번역"
    touched_bank = parse_lexicon_raw(v45_lex(lambda ws: ws[0].update(example="changed")))
    ws_first_id = parse_lexicon_raw(_LEX_BASE)["t1"][0]["id"]
    v16_bad = any("sentence[0] ko" in v.detail for v in check_backfill("selftest", base_banks, base_seeds, after_ok_banks, touched)) \
        and any("example changed" in v.detail for v in check_backfill("selftest", base_banks, base_seeds, touched_bank, after_ok_seeds))
    # 결정 11 — 변경 목록에 적힌 변경은 허용, 적히지 않은 것은 여전히 오류.
    listed = {"t1": [{"kind": "sentence", "situation": "T", "index": 0, "fields": ["ko"], "why": "번역이 어색"},
                     {"kind": "word", "id": ws_first_id, "fields": ["example"], "why": "예문을 고침"}]}
    v16_listed_ok = not check_backfill("selftest", base_banks, base_seeds, touched_bank, touched, listed)
    unlisted = {"t1": [{"kind": "sentence", "situation": "T", "index": 0, "fields": ["ko"], "why": "번역"}]}
    v16_unlisted = any("example changed" in v.detail for v in check_backfill("selftest", base_banks, base_seeds, touched_bank, touched, unlisted))
    no_why = {"t1": [{"kind": "sentence", "situation": "T", "index": 0, "fields": ["ko"]}]}
    v16_no_why = any("no why" in v.detail for v in check_backfill("selftest", base_banks, base_seeds, after_ok_banks, touched, no_why))
    added_bank = parse_lexicon_raw(v45_lex(lambda ws: ws.append({**ws[0], "id": "w-new"})))
    v16_add = any("added without" in v.detail for v in check_backfill("selftest", base_banks, base_seeds, added_bank, after_ok_seeds))
    v16_add_ok = not check_backfill("selftest", base_banks, base_seeds, added_bank, after_ok_seeds,
                                    {"t1": [{"kind": "word-add", "id": "w-new", "why": "새 단어"}]})
    # V17 — 문장 ko를 고치고 같은 예문을 쓰는 단어의 exKo를 옛 번역으로 남긴 것.
    s0 = parse_topics(v45_seed(good_nuance))[0]["sentences"][0]
    stale_bank = parse_lexicon_raw(v45_lex(lambda ws: ws[0].update(example=s0["en"], exKo=s0["ko"])))
    fresh_bank = parse_lexicon_raw(v45_lex(lambda ws: ws[0].update(example=s0["en"], exKo="바뀐 번역")))
    v17_stale = any(v.rule == "V17" for v in check_backfill("selftest", base_banks, base_seeds, stale_bank, touched, listed))
    v17_fresh = not any(v.rule == "V17" for v in check_backfill("selftest", base_banks, base_seeds, fresh_bank, touched, listed))
    for name, hit in (("V17 a stale exKo after a sentence ko fix fires", v17_stale),
                      ("V17 an exKo updated with the sentence passes", v17_fresh)):
        print(f"[{'PASS' if hit else 'FAIL'}] {name}")
        ok = ok and hit
    for name, hit in (("V16 listed changes are allowed (결정 11)", v16_listed_ok),
                      ("V16 a change not on the list still fires", v16_unlisted),
                      ("V16 a change without a why fires", v16_no_why),
                      ("V16 an added word needs a word-add change", v16_add),
                      ("V16 an added word listed as word-add passes", v16_add_ok)):
        print(f"[{'PASS' if hit else 'FAIL'}] {name}")
        ok = ok and hit
    for name, hit in (("V16 backfill that only adds fields — no violations expected", v16_ok),
                      ("V16 backfill that edits a v44 sentence or word — V16 fires", v16_bad)):
        print(f"[{'PASS' if hit else 'FAIL'}] {name}")
        ok = ok and hit
    print()
    ok = ok and stem_bad == 0
    print("ALL PASS" if ok else "SOME FAILED")
    return 0 if ok else 1


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def git_show(ref: str, path: pathlib.Path) -> str:
    """`git show ref:path`. 그 ref에 파일이 없으면 멈춘다 — 빈 기준선은 V16을 전부 통과시킨다."""
    import subprocess
    root = pathlib.Path(subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=TOOLS_DIR,
                                       capture_output=True, text=True, check=True).stdout.strip())
    rel = path.resolve().relative_to(root)
    r = subprocess.run(["git", "show", f"{ref}:{rel}"], cwd=root, capture_output=True, text=True)
    if r.returncode != 0:
        # Fail closed: an empty baseline would make V16 pass everything, silently — the
        # exact thing --baseline exists to stop. A department with nothing at that ref has
        # no v44 content to protect; run without --baseline for it.
        sys.exit(f"--baseline {ref}: {rel} is not in that ref ({r.stderr.strip()}) — V16 cannot compare")
    return r.stdout


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dept", help="예: er (생략하면 topics/*.yaml에 있는 모든 부서)")
    ap.add_argument("--theme", help="주제(theme) key 하나로 좁힌다")
    ap.add_argument("--selftest", action="store_true", help="이 도구 자체를 어긋난 표본으로 검증한다")
    ap.add_argument("--baseline", help="git ref (예: HEAD). 보강 전 파일과 비교해 V16을 검사한다")
    ap.add_argument("--changes", help="changes-<theme>.yaml 이 든 디렉터리 (결정 11). 여기 적힌 변경만 V16이 허용한다")
    args = ap.parse_args()

    if args.selftest:
        sys.exit(run_selftest())

    depts = [args.dept] if args.dept else sorted(p.stem for p in TOPICS_DIR.glob("*.yaml"))

    total_violations = 0
    total_warnings = 0
    for dept in depts:
        lexicon = load_lexicon(dept)
        raw_banks = load_lexicon_raw(dept)
        seeds = load_topics(dept)
        violations, warnings, coverage = verify_dept(dept, lexicon, seeds, args.theme, raw_banks=raw_banks)
        if args.baseline:
            base_banks = parse_lexicon_raw(git_show(args.baseline, LEXICON_DIR / f"{dept}.yaml"))
            base_seeds = parse_topics(git_show(args.baseline, TOPICS_DIR / f"{dept}.yaml"))
            if args.theme:
                base_banks = {k: v for k, v in base_banks.items() if k == args.theme}
                base_seeds = [sd for sd in base_seeds if sd.get("theme") == args.theme]
            chg: dict[str, list[dict]] = {}
            if args.changes:
                for f in sorted(pathlib.Path(args.changes).glob("changes-*.yaml")):
                    t, lst = load_changes(f.read_text())
                    chg.setdefault(t, []).extend(lst)
            violations += check_backfill(dept, base_banks, base_seeds, raw_banks, seeds, chg)
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
