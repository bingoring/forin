"""core-language-icu — keyPhrase 3문장 교체 + keyPhrase chunks 8문장 다시 자르기(2026-10-30 묶음 9 결정).
base-core-language-icu.yaml → core-language-icu.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-core-language-icu.yaml'))
CH = []
OLD = []


def recut(si, title, index, en, chunks, extra=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(필요하면 decoy도 새 조각 자리에 맞춘다)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    if extra:
        s.update(extra)
    check_new(s)
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'] + sorted(extra or {}),
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"})


def order_line(si, title, li, old_en, new):
    od = sit(doc, si, title)['order']
    l = od['lines'][li]
    assert l['en'] == old_en, (title, li, l['en'])
    l.update(new)
    assert len(l['en'].split()) <= 15, l['en']
    return od


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1, s['en']
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']


# 1. 통역 통한 동의·설명 [7] 문장 0 — 동의 설명은 의사가, 통역사는 옮길 뿐
T = '통역 통한 동의·설명'
o = 'The interpreter will explain the procedure fully.'
OLD.append(o)
s = replace(doc, CH, 7, T, 0, o, {
    'en': 'The doctor will explain the procedure fully, through the interpreter.',
    'ko': '의사 선생님이 통역사를 통해 시술을 빠짐없이 설명해 드릴 거예요.',
    'chunks': ['The doctor', 'will explain', 'the procedure fully', ', through the interpreter', '.'],
    'why': ("설명은 의사가 하고, through the interpreter로 통역사는 그 말을 옮기는 사람이라고 역할을 나눠 말해요. "
            "fully를 붙이면 설명이 일부가 아니라 빠짐없이 전해진다는 뜻이 돼요."),
    'distractorsKo': ['의사 선생님이 통역사를 통해 시술을 천천히 설명해 드릴 거예요.',
                      '의사 선생님이 통역사를 통해 회복을 빠짐없이 설명해 드릴 거예요.'],
}, ['en', 'ko', 'chunks'],
    'The interpreter will explain … → The doctor will explain … fully, through the interpreter(동의 설명은 의사의 일, 통역사는 옮길 뿐 — '
    '같은 상황 context why와 맞춤) — words 그대로')
check_new(s)
od = order_line(7, T, 0, 'The interpreter will explain the procedure fully.', {
    'en': 'The doctor will explain the procedure fully, through the interpreter.',
    'ko': '의사 선생님이 통역사를 통해 시술을 빠짐없이 설명해 드릴 거예요',
})
assert od['why'].startswith('설명이 먼저 있고,')
od['why'] = od['why'].replace('설명이 먼저 있고,', '의사가 통역사를 통해 설명하는 것이 먼저 있고,', 1)

# 2. 삽관 환자 비언어 소통 [1] 문장 2 — 깜빡임 체계를 이 주제의 "한 번=예"로 통일
T = '삽관 환자 비언어 소통'
o = 'Blink twice for yes, once for no — is that okay?'
OLD.append(o)
s = replace(doc, CH, 1, T, 2, o, {
    'en': 'Blink once for yes, twice for no — is that okay?',
    'ko': '예는 한 번, 아니오는 두 번 깜빡이시면 돼요, 괜찮으세요?',
    'chunks': ['Blink once', 'for yes', ', twice for no', '— is that okay', '?'],
    'why': ("Blink once for yes, twice for no로 신호를 먼저 약속하고 — is that okay?로 곧바로 동의를 물어요. "
            "한 번은 예, 두 번은 아니오로 정해 두면 같은 병상에서 쓰는 다른 신호(Blink once if…)와도 어긋나지 않아요."),
    'distractorsKo': ['예는 한 번, 아니오는 두 번 쥐시면 돼요, 괜찮으세요?',
                      '예는 한 번, 아니오는 두 번 끄덕이시면 돼요, 괜찮으세요?'],
}, ['en', 'ko', 'chunks'],
    'Blink twice for yes, once for no → Blink once for yes, twice for no(같은 주제 6장·19장의 "한 번=예"와 정반대였음 — 미국 병상의 흔한 약속도 한 번=예) — words 그대로')
check_new(s)
assert s['blank']['answer'] == 'once'

# 3. 문화 갈등·치료 거부 소통 [20] 문장 2 — 통역사는 중재자가 아니라 옮기는 사람
T = '문화 갈등·치료 거부 소통'
o = 'The interpreter and ethics team can help us find common ground.'
OLD.append(o)
s = replace(doc, CH, 20, T, 2, o, {
    'en': 'With the interpreter, the ethics team can help us find common ground.',
    'ko': '통역사가 함께하는 자리에서 윤리팀이 공통점을 찾도록 도와줄 거예요.',
    'chunks': ['With the interpreter', ', the ethics team', 'can help us', 'find common ground', '.'],
    'why': ("With the interpreter로 통역사는 말을 옮기는 자리에 두고, 공통점을 찾도록 돕는 일은 윤리팀이 맡는다고 나눠 말해요. "
            "find common ground는 서로 다른 입장 사이에서 겹치는 부분을 찾는다는 관용구예요."),
    'distractorsKo': ['통역사가 함께하는 자리에서 윤리팀이 빈 방을 찾도록 도와줄 거예요.',
                      '통역사가 함께하는 자리에서 윤리팀이 공통점을 기록하도록 도와줄 거예요.'],
}, ['en', 'ko', 'chunks'],
    'The interpreter and ethics team can help us … → With the interpreter, the ethics team can help us …(통역사를 공통점을 찾는 중재자로 묶었음 — 중재는 윤리팀) — words 그대로')
check_new(s)

# 4. keyPhrase chunks 다시 자르기 (en 그대로) — fix-core-language-icu-A.md K6
recut(10, '청각·시각 장애 병행 소통', 0, 'We can use his hearing aids and a large-print board.',
      ['We can use', 'his hearing aids', 'and', 'a large-print board', '.'])
recut(14, '소통 오류 확인·재확립', 0, "Let's make sure we're both on the same page.",
      ["Let's", 'make sure', "we're both", 'on the same page', '.'], {'decoy': 'on the same floor'})
recut(15, '급변 중 언어장벽 위기 소통', 1, 'The interpreter phone is coming — stay with me.',
      ['The interpreter phone', 'is coming', '— stay with me', '.'])
recut(17, '임종 결정 언어장벽', 1, "Let's decide based on what he would have wanted.",
      ["Let's decide", 'based on', 'what he', 'would have wanted', '.'], {'decoy': 'what we'})
recut(19, '통역 부재 응급 대응', 0, "I'm using the phone interpreter line right now.",
      ["I'm using", 'the phone interpreter line', 'right now', '.'], {'decoy': 'the video interpreter line'})
recut(19, '통역 부재 응급 대응', 1, 'Point to this picture board to tell me what you feel.',
      ['Point to', 'this picture board', 'to tell me', 'what you feel', '.'], {'decoy': 'this wall clock'})
recut(10, '청각·시각 장애 병행 소통', 1, "I'll face him and speak clearly on his better side.",
      ["I'll face him", 'and speak', 'clearly', 'on his better side', '.'], {'decoy': 'loudly'})
recut(8, '문화적 표현·금기 고려', 2, "Please guide me on what's appropriate for your family.",
      ['Please', 'guide me', "on what's appropriate", 'for your family', '.'], {'decoy': 'for the visit'})

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['Blink twice for yes', '예는 두 번', 'The interpreter will explain', 'The interpreter and ethics team', '통역사와 윤리팀']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'core-language-icu.yaml'))
append_changes(os.path.join(HERE, 'changes-core-language-icu.yaml'), CH)
print('core-language-icu.yaml 저장')
