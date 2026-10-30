"""core-family-icu — keyPhrase 3문장 교체 + keyPhrase chunks 13문장 다시 자르기(2026-10-30 묶음 9 결정).
base-core-family-icu.yaml → core-family-icu.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-core-family-icu.yaml'))
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


# 1. 대리결정 부재 상황 [18] 문장 2 — 윤리위원회는 자문 기구(대신 결정하지 않음)
T = '대리결정 부재 상황'
o = "We'll involve the ethics committee to decide in his best interest."
OLD.append(o)
s = replace(doc, CH, 18, T, 2, o, {
    'en': "We'll involve the ethics committee to help decide what's in his best interest.",
    'ko': '그에게 무엇이 가장 이로운지 정하는 일을 돕도록 윤리위원회를 참여시킬게요.',
    'chunks': ["We'll involve", 'the ethics committee', 'to help decide', "what's in his best interest", '.'],
    'why': ("involve는 어떤 기관을 과정에 참여시킨다는 뜻이에요. 윤리위원회는 대신 결정하는 곳이 아니라 자문하는 곳이라 "
            "to help decide로 돕는 역할을 말하고, what's in his best interest로 기준이 그에게 가장 이로운 것임을 밝혀요."),
    'distractorsKo': ['그에게 무엇이 가장 이로운지 정하는 일을 돕도록 윤리위원회를 기다릴게요.',
                      '그에게 무엇이 가장 이로운지 설명하는 일을 돕도록 윤리위원회를 참여시킬게요.'],
}, ['en', 'ko', 'chunks'],
    "to decide in his best interest → to help decide what's in his best interest(윤리위원회는 자문 기구 — '결정한다'고 가르쳤음) — words 그대로")
check_new(s)
od = order_line(18, T, 2, "As part of that, we'll involve the ethics committee to decide in his best interest.", {
    'en': "As part of that, the ethics committee will help decide what's in his best interest.",
    'ko': '그 일환으로 윤리위원회가 그에게 무엇이 이로운지 정하는 일을 도울 거예요',
})
assert '그 절차로 윤리위원회를 참여시킨다고 설명하며' in od['why']
od['why'] = od['why'].replace('그 절차로 윤리위원회를 참여시킨다고 설명하며', '그 절차로 윤리위원회가 결정을 돕는다고 설명하며')

# 2. 분노·불신 가족 대응 [19] 문장 1 — 병원 전체를 대신한 장담 → 간호사가 아는 범위
T = '분노·불신 가족 대응'
o = 'Nothing is being hidden — let me go through everything with you.'
OLD.append(o)
s = replace(doc, CH, 19, T, 1, o, {
    'en': "I'm not hiding anything from you — let me go through what I know with you.",
    'ko': '제가 숨기는 건 아무것도 없어요 — 제가 아는 것을 함께 살펴봐 드릴게요.',
    'chunks': ["I'm not hiding anything", 'from you', '— let me go through', 'what I know', 'with you', '.'],
    'why': ("I'm not hiding anything from you는 의심에 내 이름으로 정면으로 답하는 말이에요. 병원 전체를 대신해 장담하지 않고 "
            "what I know로 내가 아는 범위를 밝힌 뒤, let me go through … with you로 행동으로 보여 주겠다고 이어요."),
    'distractorsKo': ['제가 숨기는 건 아무것도 없어요 — 제가 아는 것을 내일 살펴봐 드릴게요.',
                      '제가 숨기는 건 아무것도 없어요 — 제가 아는 것을 간호사실에서 살펴봐 드릴게요.'],
    'blank': blank('hiding', ['taking', 'hearing', 'expecting']),
}, ['en', 'ko', 'chunks'],
    "Nothing is being hidden — let me go through everything → I'm not hiding anything from you — let me go through what I know(간호사가 병원 전체를 대신해 장담, "
    '화난 가족에게 방어적으로 들림) — words 그대로, 빈칸 hidden → hiding')
check_new(s)
sl = [n for n in sit(doc, 19, T)['nuance'] if n['kind'] == 'slider']
assert len(sl) == 1 and sl[0]['example'] == 'Nothing is being hidden.'
sl[0]['example'] = "I'm not hiding anything from you."
sl[0]['exKo'] = '제가 숨기는 건 아무것도 없어요.'
order_line(19, T, 2, 'Nothing is being hidden — let me go through everything with you.', {
    'en': "I'm not hiding anything — let me go through what I know with you.",
    'ko': '제가 숨기는 건 없어요, 제가 아는 것을 함께 살펴봐 드릴게요',
})

# 3. 예후 불확실성 소통 [12] 문장 1 — the next days(비원어민 말투) → the next few days
T = '예후 불확실성 소통'
o = 'His condition is serious, and the next days are critical.'
OLD.append(o)
s = replace(doc, CH, 12, T, 1, o, {
    'en': 'His condition is serious, and the next few days are critical.',
    'chunks': ['His condition', 'is serious', ', and the next few days', 'are critical', '.'],
    'why': ("serious와 critical처럼 쉬운 말로 상태의 무게를 사실대로 말해요. the next few days로 시점을 짚어 "
            "가족이 지금 어떤 때인지 알 수 있게 해요."),
}, ['en', 'chunks'], 'the next days → the next few days(the next days는 비원어민 말투) — ko·words 그대로')
check_new(s)
order_line(12, T, 1, 'His condition is serious, and the next days are critical.', {
    'en': 'His condition is serious, and the next few days are critical.',
})
wc = word(doc, 'w-critical')
assert wc['example'] == 'The next days are critical.'
wc['example'] = 'The next few days are critical.'
CH.append({'kind': 'word', 'id': 'w-critical', 'fields': ['example'], 'why': '예문의 the next days를 바꾼 문장처럼 the next few days로'})

# 4. keyPhrase chunks 다시 자르기 (en 그대로) — fix-core-family-icu-A.md K7
recut(0, '면회 안내·환경 설명', 0, "Let me walk you through what you'll see at her bedside.",
      ['Let me', 'walk you through', "what you'll see", 'at her bedside', '.'])
recut(2, '일일 상태 업데이트', 0, 'Today his oxygen levels are a little better.',
      ['Today', 'his oxygen levels', 'are a little better', '.'], {'decoy': 'his blood sugar levels'})
recut(2, '일일 상태 업데이트', 2, "It's a small step, but it's in the right direction.",
      ["It's", 'a small step', ", but it's", 'in the right direction', '.'], {'decoy': 'a quick fix'})
recut(3, '가족 질문 응대', 1, 'Let me explain that in a way that makes sense.',
      ['Let me', 'explain that', 'in a way', 'that makes sense', '.'])
recut(5, '가족 정서 지지 기초', 2, 'There are support services here whenever you need them.',
      ['There are', 'support services', 'here', 'whenever you need them', '.'])
recut(9, '의사결정 대리인 확인', 0, 'Did he name a healthcare proxy in any documents?',
      ['Did he', 'name', 'a healthcare proxy', 'in any documents', '?'])
recut(11, '가족 참여 돌봄', 2, 'Being here for him is meaningful care too.',
      ['Being here for him', 'is meaningful care', 'too', '.'], {'decoy': 'is hard work'})
recut(12, '예후 불확실성 소통', 0, 'I wish I could give you a certain answer.',
      ['I wish', 'I could', 'give you', 'a certain answer', '.'], {'decoy': 'a written answer'})
recut(16, '가족 급성 비탄·위기 대응', 1, "Take a moment; there's no need to hold it together.",
      ['Take', 'a moment;', "there's no need", 'to hold it together', '.'], {'decoy': 'to say anything'})
recut(17, '목표 불일치·갈등 중재', 0, "You both want what's best for him — that's your common ground.",
      ['You both want', "what's best for him", "— that's", 'your common ground', '.'], {'decoy': 'your next step'})
recut(17, '목표 불일치·갈등 중재', 1, "Let's center this on what he would have wanted.",
      ["Let's", 'center this', 'on what he', 'would have wanted', '.'], {'decoy': 'on what we'})
recut(18, '대리결정 부재 상황', 1, "Since there's no named proxy, the team follows a set process.",
      ["Since there's", 'no named proxy', ', the team follows', 'a set process', '.'], {'decoy': 'a quick process'})
recut(20, '사별·애도 지원·후속', 0, "I'm so deeply sorry for your loss.",
      ["I'm", 'so deeply sorry', 'for your loss', '.'], {'decoy': 'for the wait'})

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['Nothing is being hidden', 'next days', 'to decide in his', '방향으로 결정하도록', '전부 함께 살펴']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'core-family-icu.yaml'))
append_changes(os.path.join(HERE, 'changes-core-family-icu.yaml'), CH)
print('core-family-icu.yaml 저장')
