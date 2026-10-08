#!/usr/bin/env python3
"""ER 대시 표기를 앞뒤 공백 대시로 통일한다(2026-10-09 사용자 결정, 결정 11 예외).
base-<주제>.yaml을 제자리에서 고치고, 바뀐 v44 필드는 changes/er/changes-<주제>.yaml 끝에 잇는다.
한 번만 돌린다(이미 적용됐으면 멈춘다). 실행 전 파일은 따로 복사해 둘 것."""
import io, re, sys, pathlib, yaml

HERE = pathlib.Path(__file__).resolve().parent
CHANGES = HERE.parent.parent / "changes" / "er"
WHY = "v46 검토 결정 11 예외: 대시 표기를 앞뒤 공백 대시로 통일(사용자 결정 2026-10-09)"

# (주제, 옛 en, 새 en, 새 chunks 또는 None=대시 조각 자동 분할, ko 옛→새(마침표 뺀 꼴) 또는 None)
DASH = {
    "er-stroke": [
        "This arm—when did it stop moving?",
        "I need you to stay with me—can you open your eyes?",
        "Stay with me—can you hear my voice?",
        "One pupil is now larger—that's an important change.",
    ],
    "er-seizure-loc": [
        "Seizure before—point to how many times.",
        "Medicine—do you take it? Yes or no?",
        "Oxygen saturation is dropping—bag-mask now.",
        "We found several empty bottles—checking what they were.",
    ],
    "er-ortho-trauma": ["Try to stay relaxed—tensing makes it harder."],
    "er-burn": ["What caused the burn—heat, chemical, or electricity?"],
    "er-bleeding-wound": [
        "Don't keep lifting the gauze to check—hold the pressure.",
        "My head is bleeding so much—it's all over.",
        "I take aspirin and clopidogrel—it keeps bleeding through.",
        "It's spurting out with every heartbeat—help!",
        "Surgery wants a handoff—give me the report.",
    ],
}
# 마침표로 끊었던 문장 → 공백 대시 한 문장
SPLIT = {
    "er-burn": [
        ("Keep rinsing. This removes the chemical from your skin.",
         "Keep rinsing — this removes the chemical from your skin.",
         ["Keep rinsing", "— this removes", "the chemical", "from your skin", "."],
         ("계속 헹궈 주세요. 이렇게 하면 피부에서 화학물질이 제거돼요",
          "계속 헹궈 주세요—이렇게 하면 피부에서 화학물질이 제거돼요")),
        ("Try to stay calm. This will help you breathe safely.",
         "Try to stay calm — this will help you breathe safely.",
         ["Try to", "stay calm", "— this will help you", "breathe safely", "."],
         ("차분함을 유지해 보세요. 그러면 안전하게 숨쉬는 데 도움이 돼요",
          "차분함을 유지해 보세요—그러면 안전하게 숨쉬는 데 도움이 돼요")),
    ],
    "er-chest-abd-trauma": [
        ("I'm pressing on your upper left belly. Tell me if it's tender.",
         "I'm pressing on your upper left belly — tell me if it's tender.",
         ["I'm pressing", "on your upper left belly", "— tell me", "if it's tender", "."],
         ("왼쪽 윗배를 눌러볼게요. 아프면 말씀해 주세요",
          "왼쪽 윗배를 눌러볼게요—아프면 말씀해 주세요")),
        ("We will not remove the object. We'll stabilize it in place.",
         "We will not remove the object — we'll stabilize it in place.",
         ["We will not remove", "the object", "— we'll stabilize it", "in place", "."],
         None),
        ("Try to stay still. This will help you breathe in a moment.",
         "Try to stay still — this will help you breathe in a moment.",
         ["Try to", "stay still", "— this will help you", "breathe in a moment", "."],
         ("가만히 계세요. 곧 숨쉬기가 편해질 거예요",
          "가만히 계세요—곧 숨쉬기가 편해질 거예요")),
    ],
}
# 새 청크 조합에서 문장이 되어 버리는 decoy 교체: (주제, 문장 새 en) → (옛 decoy, 새 decoy)
DECOY = {
    ("er-ortho-trauma", "Try to stay relaxed — tensing makes it harder."): ("while we count", "the cast"),
}


def q(c):
    return "'" + c + "'" if c[0] in "?!:&*%@`'\"{[|>#,-" and not c.startswith("— ") else c


def rep_chunks(text, old_en, new_chunks):
    lines = text.split("\n")
    hits = [i for i, l in enumerate(lines) if l == "  - en: " + old_en]
    assert len(hits) == 1, (old_en, len(hits))
    i = hits[0]
    a = next(j for j in range(i, i + 6) if lines[j] == "    chunks:")
    b = next(j for j in range(a + 1, a + 20) if lines[j] == "    words:")
    lines[a + 1:b] = ["    - " + q(c) for c in new_chunks]
    return "\n".join(lines)


def auto_chunks(text, old_en):
    lines = text.split("\n")
    i = lines.index("  - en: " + old_en)
    a = lines.index("    chunks:", i)
    b = lines.index("    words:", a)
    out = []
    for l in lines[a + 1:b]:
        c = yaml.safe_load(l[6:]) if l.startswith("    - ") else None
        assert isinstance(c, str), l
        if "—" in c:
            x, y = c.split("—", 1)
            assert x and y and not x.endswith(" ") and not y.startswith(" "), c
            out += [x, "— " + y]
        else:
            out.append(c)
    return out


def snap(path):
    d = yaml.safe_load(io.open(path, encoding="utf-8"))
    sents = {}
    for sit in d["situations"]:
        for k, s in enumerate(sit["sentences"]):
            sents[(sit["title"], k)] = s
    return d, sents


def main():
    entries = {}
    for theme in sorted(set(DASH) | set(SPLIT)):
        path = HERE / f"base-{theme}.yaml"
        text = path.read_text(encoding="utf-8")
        before_doc, before_s = snap(path)
        jobs = []  # (old_en, new_en, chunks, ko_pair)
        for old in DASH.get(theme, []):
            jobs.append((old, old.replace("—", " — "), auto_chunks(text, old), None))
        for old, new, ch, ko in SPLIT.get(theme, []):
            jobs.append((old, new, ch, ko))
        for old, new, ch, ko in jobs:
            assert ("  - en: " + old + "\n") in text, f"이미 적용됐거나 없음: {old}"
            text = rep_chunks(text, old, ch)
            text = text.replace(old, new)
            if ko:
                text = text.replace(ko[0], ko[1])
            d = DECOY.get((theme, new))
            if d:
                assert ("    decoy: " + d[0] + "\n") in text
                text = text.replace("    decoy: " + d[0] + "\n", "    decoy: " + d[1] + "\n", 1)
        path.write_text(text, encoding="utf-8")

        # 바뀐 필드를 yaml 비교로 뽑아 changes에 적는다
        after_doc, after_s = snap(path)
        ent = []
        for key, s in before_s.items():
            t = after_s[key]
            f = [k for k in ("en", "ko", "chunks") if s.get(k) != t.get(k)]
            if f:
                ent.append(f"- kind: sentence\n  situation: {key[0]}\n  index: {key[1]}\n  fields: [{', '.join(f)}]\n  why: '{WHY}'")
        bw = {w["id"]: w for w in before_doc["words"]}
        for w in after_doc["words"]:
            o = bw[w["id"]]
            f = [k for k in ("en", "ko", "ipa", "icon", "example", "exKo") if o.get(k) != w.get(k)]
            if f:
                ent.append(f"- kind: word\n  id: {w['id']}\n  fields: [{', '.join(f)}]\n  why: '{WHY}'")
        entries[theme] = ent
        cp = CHANGES / f"changes-{theme}.yaml"
        cur = cp.read_text(encoding="utf-8")
        if not cur.endswith("\n"):
            cur += "\n"
        cp.write_text(cur + "\n".join(ent) + "\n", encoding="utf-8")
        print(f"{theme}: changes +{len(ent)} (문장 {sum(1 for e in ent if 'sentence' in e)}, 단어 {sum(1 for e in ent if 'kind: word' in e)})")


if __name__ == "__main__":
    main()
