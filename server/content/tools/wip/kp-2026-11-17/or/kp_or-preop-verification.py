"""or-preop-verification — keyPhrase chunks 2문장 다시 자르기(2026-11-17 OR 묶음 2 결정, '추천대로'). en은 그대로.
base-or-preop-verification.yaml → or-preop-verification.yaml"""
import io, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(HERE))))   # tools/ — verify_lesson_content
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks  # noqa: E402 (도구 폴더)
kp_common.MARK = 'keyPhrase 교체(2026-11-17 사용자 결정)'

doc = load(os.path.join(HERE, 'base-or-preop-verification.yaml'))
CH = []


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert meaningful_chunks(s['chunks']) >= min_chunks_for(s['en']), (s['chunks'], min_chunks_for(s['en']))
    assert not dangling_chunks(s['chunks']), s['chunks']


def recut(si, title, index, en, chunks, extra, why):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(decoy도 새 조각 자리에 맞춘다)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    s.update(extra)
    check_new(s)
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'] + sorted(extra),
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로; {why}"})


# 0.1 — before we go / in 이 구동사 go in을 끊음. 권고 자름(I just want to / confirm who you are / before we go in)은
# 낱말 12개에 조각 3개라 V8(4조각)에 걸려, confirm과 목적절 who you are 사이를 하나 더 나눈다.
recut(0, '환자 신원 2가지 확인', 1, 'I just want to confirm who you are before we go in.',
      ['I just want to', 'confirm', 'who you are', 'before we go in', '.'],
      {'decoy': 'before we go home'},
      '검토 A KP 0.1; V8 때문에 confirm / who you are로 한 번 더 나눔, decoy는 before we go in 자리 모양으로(옛 decoy의 who we are는 ko “신원을 확인”에 그대로 맞아 바꿈)')
# 8.2 — as a missing / site marking 이 명사구를 끊음. 권고 자름(I'm reporting this / as a missing site marking)은
# 낱말 8개에 조각 2개라 V8(3조각)에 걸려, 주어 I'm과 reporting this 사이를 나눈다.
recut(8, '부위 표시 없이 입실', 2, "I'm reporting this as a missing site marking.",
      ["I'm", 'reporting this', 'as a missing site marking', '.'],
      {'decoy': 'as a missing name band'},
      "검토 A KP 8.2; V8 때문에 I'm / reporting this로 나눔, decoy는 옛 decoy(name band)를 새 명사구 자리 모양으로")

dump(doc, os.path.join(HERE, 'or-preop-verification.yaml'))
append_changes(os.path.join(HERE, 'changes-or-preop-verification.yaml'), CH)
print('or-preop-verification.yaml 저장')
