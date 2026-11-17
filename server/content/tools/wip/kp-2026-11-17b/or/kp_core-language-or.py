"""core-language-or — keyPhrase 6문장 교체 + keyPhrase chunks 다시 자르기(2026-11-17 OR 묶음 4 결정, '추천대로').
base-core-language-or.yaml → core-language-or.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks
kp_common.MARK = 'keyPhrase 교체(2026-11-17 사용자 결정)'

doc = load(os.path.join(HERE, 'base-core-language-or.yaml'))
CH = []
NOTE = []  # v45·v46 필드(order·nuance) 고침 — changes 목록 대상이 아님(V16은 v44만 봄)
OLD = []
DASH = '—'


def check_new(s):
    assert len(re.findall(r'(?<![\w-])' + re.escape(s['blank']['answer']) + r'(?![\w-])', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert len(s['distractorsKo']) == 2 and s['ko'] not in s['distractorsKo']
    assert not any('려고' in x for x in s['distractorsKo']), s['distractorsKo']
    assert meaningful_chunks(s['chunks']) >= min_chunks_for(s['en']), (s['en'], s['chunks'])
    assert not dangling_chunks(s['chunks']), s['chunks']


def recut(si, title, index, en, chunks, extra=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(필요하면 decoy도 새 조각 자리에 맞춘다)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    if extra:
        s.update(extra)
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert meaningful_chunks(s['chunks']) >= min_chunks_for(s['en']), (s['en'], s['chunks'])
    assert not dangling_chunks(s['chunks']), s['chunks']
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'] + sorted(extra or {}),
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"
                      + (f"; decoy를 새 조각 자리 모양으로({extra['decoy']})" if extra and 'decoy' in extra else '')})


# ── 1. keyPhrase 문장 교체 ─────────────────────────────────────────────

# 1-1. 동의 통역 확인 [1] 문장 0 — 동의 설명은 집도의, 통역사는 옮기는 통로
T = '동의 통역 확인'
o = 'The interpreter will explain the consent in your language.'
OLD.append(o)
s = replace(doc, CH, 1, T, 0, o, {
    'en': 'The surgeon will explain the consent through the interpreter.',
    'ko': '집도의가 통역사를 통해 동의서 내용을 설명해 드릴 거예요.',
    'chunks': ['The surgeon', 'will explain', 'the consent', 'through the interpreter', '.'],
    'words': ['w-explain', 'w-consent', 'w-through', 'w-interpreter'],
    'tag': '동의 설명',
    'icon': 'speech',
    'why': ('설명하는 사람은 집도의이고, through the interpreter로 통역사는 그 말을 그대로 옮기는 통로라는 역할을 밝혀요. '
            'will은 곧 일어날 일을 안내하는 미래형이에요.'),
    'decoy': 'the billing form',
    'distractorsKo': ['집도의가 통역사를 통해 수술 일정을 설명해 드릴 거예요.',
                      '동의서는 환자분이 이해하는 언어로 설명돼야 해요.'],
    'blank': blank('interpreter', ['technician', 'dietitian', 'chaplain']),
}, ['en', 'ko', 'chunks', 'words'],
    'The interpreter will explain the consent in your language → The surgeon will explain the consent through the interpreter.'
    '(동의 설명은 시술자가 하고 통역사는 옮김; 검토 A); −w-language 태그(다른 문장에 남음) +w-through 태그')
check_new(s)
od = sit(doc, 1, T)['order']
assert od['lines'][0]['en'] == s['en'], od['lines'][0]

# 1-2. 금식·준비 통역 안내 [2] 문장 0 — 지침은 간호사가 주고 통역사는 옮김
T = '금식·준비 통역 안내'
o = 'The interpreter will go over your fasting instructions.'
OLD.append(o)
s = replace(doc, CH, 2, T, 0, o, {
    'en': "I'll go over your fasting instructions through the interpreter.",
    'ko': '통역사를 통해 금식 지침을 하나하나 짚어 드릴게요.',
    'chunks': ["I'll", 'go over', 'your fasting instructions', 'through the interpreter', '.'],
    'words': ['w-fast', 'w-instruction', 'w-through', 'w-interpreter'],
    'tag': '금식 안내',
    'icon': 'board',
    'why': ('go over는 한 항목씩 훑으며 설명한다는 구동사예요. 지침을 주는 사람은 나이고, '
            'through the interpreter로 통역사는 그 말을 옮기는 통로임을 밝혀요.'),
    'decoy': 'your discharge instructions',
    'distractorsKo': ['통역사를 통해 퇴원 지침을 하나하나 짚어 드릴게요.',
                      '금식 지침은 마취 중 흡인을 막으려는 거예요.'],
    'blank': blank('fasting', ['visiting', 'parking', 'discharge']),
}, ['en', 'ko', 'chunks', 'words'],
    "The interpreter will go over your fasting instructions → I'll go over your fasting instructions through the interpreter."
    '(지침은 간호사·마취과가 주고 통역사는 옮김; 검토 A); +w-through 태그')
check_new(s)
sl = sit(doc, 2, T)['nuance'][0]
assert sl['kind'] == 'slider' and sl['example'] == o, sl
sl['example'], sl['exKo'] = s['en'], s['ko']
NOTE.append({'kind': 'nuance', 'situation': T, 'index': 0, 'fields': ['example', 'exKo'], 'why': 'slider 예문이 바꾼 문장이라 새 문장으로'})
od = sit(doc, 2, T)['order']
assert od['lines'][0]['en'] == s['en'], od['lines'][0]

# 1-3. 마취 설명 통역 [3] 문장 0 — 마취 설명은 마취팀
T = '마취 설명 통역'
o = 'The interpreter will explain how the anesthesia works.'
OLD.append(o)
s = replace(doc, CH, 3, T, 0, o, {
    'en': 'The anesthesia team will explain how it works through the interpreter.',
    'ko': '마취팀이 통역사를 통해 마취가 어떻게 작동하는지 설명해 드릴 거예요.',
    'chunks': ['The anesthesia team', 'will explain', 'how it works', 'through the interpreter', '.'],
    'words': ['w-anesthesia', 'w-team', 'w-explain', 'w-work', 'w-through', 'w-interpreter'],
    'tag': '마취 설명',
    'icon': 'speech',
    'why': ('설명은 마취팀이 하고, through the interpreter로 통역사는 그 말을 옮긴다는 역할을 밝혀요. '
            'how it works는 작용 원리를 풀어 준다는 뜻이고, it은 마취를 가리켜요.'),
    'decoy': "how it's billed",
    'distractorsKo': ['마취팀이 통역사를 통해 마취가 언제 시작하는지 설명해 드릴 거예요.',
                      '마취팀이 통역사를 통해 마취가 어떻게 끝나는지 설명해 드릴 거예요.'],
    'blank': blank('anesthesia', ['transport', 'billing', 'security']),
}, ['en', 'ko', 'chunks', 'words'],
    'The interpreter will explain how the anesthesia works → The anesthesia team will explain how it works through the interpreter.'
    '(마취 설명은 마취팀이 함; 검토 A); +w-team·w-through 태그')
check_new(s)
od = sit(doc, 3, T)['order']
assert od['lines'][0]['en'] == s['en'], od['lines'][0]
assert od['why'].startswith('마취의 원리를 설명하고,'), od['why']
od['why'] = od['why'].replace('마취의 원리를 설명하고,', '마취팀이 통역사를 통해 원리를 설명해 준다고 알리고,', 1)
NOTE.append({'kind': 'order', 'situation': T, 'fields': ['why'], 'why': '간호사가 마취 원리를 설명하는 것으로 읽힘 — 마취팀이 설명한다고 알림'})

s11 = sent(doc, 1, '동의 통역 확인', 1, "Do you understand what you're agreeing to?")
assert s11['distractorsKo'][0] == '지금 동의하시는 내용을 통역사가 다 설명했나요?', s11['distractorsKo']
s11['distractorsKo'][0] = '지금 동의하시는 내용을 집도의가 다 설명했나요?'
NOTE.append({'kind': 'sentence-v46', 'situation': '동의 통역 확인', 'index': 1, 'fields': ['distractorsKo[0]'], 'why': '오답에 통역사가 설명한다는 옛 주장이 남음 — 1.0과 맞춰 집도의로'})

# 1-4. 통역 정확성 확인 [12] 문장 0 — 이해 확인은 teach-back(환자 she: 12.4·차트 장면과 같음)
T = '통역 정확성 확인'
o = 'Can you confirm the patient understood that correctly?'
OLD.append(o)
s = replace(doc, CH, 12, T, 0, o, {
    'en': "Let's use teach-back to confirm she understood that correctly.",
    'ko': '티치백으로 환자분이 그걸 정확하게 이해했는지 확인해 봅시다.',
    'chunks': ["Let's use", 'teach-back', 'to confirm', 'she understood that correctly', '.'],
    'words': ['w-confirm', 'w-understand', 'w-correctly'],
    'tag': '이해 확인',
    'icon': 'check',
    'why': ('teach-back은 환자가 들은 내용을 자기 말로 다시 설명하게 하는 확인법이라, 이해했는지를 통역사의 판단에 맡기지 않아요. '
            "Let's use로 함께 쓰자고 제안하고, correctly가 정확성을 짚어요."),
    'decoy': 'the consent form',
    'distractorsKo': ['티치백으로 환자분이 그걸 정확하게 기억하는지 확인해 봅시다.',
                      '통역을 거친 말은 원래 뜻과 조금씩 달라질 수 있어요.'],
    'blank': blank('understood', ['signed', 'spelled', 'paid']),
}, ['en', 'ko', 'chunks'],
    "Can you confirm the patient understood that correctly? → Let's use teach-back to confirm she understood that correctly."
    '(통역사에게 환자의 이해를 판단하게 하는 말로 읽힘 — 이해 확인은 teach-back; 검토 A)')
check_new(s)

# 1-5. 통역 없는 응급 동의 [15] 문장 2 — 응급 예외 판단은 집도의, 간호사는 전함
T = '통역 없는 응급 동의'
o = 'Patient safety justifies proceeding under emergency provisions.'
OLD.append(o)
s = replace(doc, CH, 15, T, 2, o, {
    'en': 'The surgeon says patient safety justifies proceeding under emergency provisions.',
    'ko': '집도의는 환자 안전을 위해 응급 규정에 따라 진행하는 게 정당하다고 해요.',
    'chunks': ['The surgeon says', 'patient safety', 'justifies proceeding', 'under emergency provisions', '.'],
    'words': ['w-safety', 'w-justify', 'w-proceed', 'w-under', 'w-emergency', 'w-provision'],
    'tag': '판단 전달',
    'icon': 'shield',
    'why': ('The surgeon says로 응급 예외를 판단한 사람이 집도의임을 밝혀, 간호사는 그 판단을 팀에 전하고 기록하는 쪽이 돼요. '
            'justifies proceeding under ~는 어떤 근거 아래 진행하는지 밝히는 격식 있는 말이에요.'),
    'decoy': 'under the visitor policy',
    'distractorsKo': ['집도의는 환자 안전을 위해 병원 규정에 따라 진행하는 게 정당하다고 해요.',
                      '응급에서는 동의를 기다리는 사이에 환자 상태가 빠르게 나빠지기도 해요.'],
    'blank': blank('justifies', ['delays', 'limits', 'replaces']),
}, ['en', 'ko', 'chunks'],
    'Patient safety justifies proceeding under emergency provisions → The surgeon says patient safety justifies proceeding under emergency provisions.'
    '(응급 예외 판단은 시술자 — 간호사가 정당화를 선언하는 말이 됨; 검토 A)')
check_new(s)
od = sit(doc, 15, T)['order']
l1 = od['lines'][1]
assert l1['en'] == s['en'], l1
l1['ko'] = '집도의는 환자 안전을 위해 응급 규정에 따라 진행하는 게 정당하다고 해요'
l1['note'] = '판단'
NOTE.append({'kind': 'order', 'situation': T, 'fields': ['lines[1].ko', 'lines[1].note'], 'why': '줄 ko를 바꾼 문장 ko에 맞춤(판단 주체가 집도의)'})

# 1-6. 위기 설명 신속 통역 [18] 문장 2 — 쉽게 말하는 몫은 말하는 나(통역사에게 단순화를 시키지 않음)
T = '위기 설명 신속 통역'
o = 'Keep it simple so nothing is misunderstood.'
OLD.append(o)
s = replace(doc, CH, 18, T, 2, o, {
    'en': "I'll keep it simple so nothing is misunderstood.",
    'ko': '잘못 이해되지 않게 제가 간단하게 말할게요.',
    'chunks': ["I'll keep it simple", 'so nothing', 'is misunderstood', '.'],
    'words': ['w-simple', 'w-nothing', 'w-misunderstand'],
    'tag': '간단히',
    'icon': 'bulb',
    'why': ("I'll keep it simple로 쉽게 말하는 몫을 말하는 나에게 두어, 통역사는 들은 그대로 옮기게 해요. "
            'so nothing is misunderstood는 오해가 하나도 없게 하려는 목적을 수동태로 말해요.'),
    'decoy': "I'll keep it formal",
    'distractorsKo': ['잘못 이해되지 않게 제가 천천히 말할게요.',
                      '서두르지 않게 제가 간단하게 말할게요.'],
    'blank': blank('simple', ['quiet', 'secret', 'formal']),
}, ['en', 'ko', 'chunks'],
    "Keep it simple so nothing is misunderstood → I'll keep it simple so nothing is misunderstood."
    '(통역사에게 단순화를 시키는 말로 읽힘 — 정확히 옮기기 원칙; 검토 A)')
check_new(s)
od = sit(doc, 18, T)['order']
assert od['lines'][2]['en'] == "While you do, I'll keep it simple so nothing is misunderstood.", od['lines'][2]

# ── 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-core-language-or-A.md ─────
# 금식·준비 통역 안내 #0 · 마취 설명 통역 #0 · 통역 없는 응급 동의 #2는 위 1에서 새 문장으로 잘랐다.
recut(13, '청각장애 수어 통역', 2, 'Let me know if you need me to slow down.',
      ['Let me know', 'if', 'you need me', 'to slow down', '.'], {'decoy': 'to calm down'})
recut(4, '통증 소통 통역', 1, "Point to where it hurts if that's easier.",
      ['Point to', 'where it hurts', "if that's easier", '.'], {'decoy': 'where the exit is'})
recut(5, '가족 통역 한계 인지', 1, "It's for accuracy and your family member's safety.",
      ["It's", 'for accuracy', "and your family member's safety", '.'], {'decoy': 'for convenience'})
recut(6, '전화·영상 통역 활용', 0, 'We can use a phone or video interpreter right now.',
      ['We', 'can use', 'a phone or video interpreter', 'right now', '.'], {'decoy': 'a text or email service'})
recut(6, '전화·영상 통역 활용', 1, 'Let me set up the remote interpreting line.',
      ['Let me', 'set up', 'the remote interpreting line', '.'])
recut(8, '문화적 표현 차이 조율', 1, "Please share only what you're comfortable with.",
      ['Please', 'share only', "what you're comfortable with", '.'], {'decoy': 'what you ate today'})
recut(9, '진정 후 비언어 소통', 0, 'Squeeze my hand if you can hear me.',
      ['Squeeze', 'my hand', 'if you can hear me', '.'], {'decoy': 'the bed rail'})
recut(10, '통역 통한 불안 완화', 0, "Through the interpreter, I hear that you're scared.",
      ['Through the interpreter', ', I hear', "that you're scared", '.'], {'decoy': "that you're tired"})
recut(11, '의료 용어 평이한 설명', 2, "Ask me anything that's still unclear.",
      ['Ask me', 'anything', "that's still unclear", '.'], {'decoy': "that's still on the way"})
recut(12, '통역 정확성 확인', 2, 'Please repeat back what the patient just said.',
      ['Please', 'repeat back', 'what the patient just said', '.'], {'decoy': 'what the monitor just showed'})
recut(14, '응급 신속 통역 확보', 1, f'This is urgent {DASH} connect us as fast as possible.',
      ['This is', 'urgent', f'{DASH} connect us', 'as fast as possible', '.'], {'decoy': 'as neatly as possible'})
recut(15, '통역 없는 응급 동의', 1, "Let's document the emergency and the consent process.",
      ["Let's document", 'the emergency', 'and the consent process', '.'])
recut(16, '언어장벽 알레르기 미확인', 1, "Let's get an interpreter before any medication.",
      ["Let's get", 'an interpreter', 'before any medication', '.'])
recut(16, '언어장벽 알레르기 미확인', 2, f"This is a safety risk {DASH} I'm flagging it now.",
      ['This is', 'a safety risk', f"{DASH} I'm flagging it", 'now', '.'])
recut(19, '이해 불가 응급 진행', 0, "The patient can't fully understand, but this is a true emergency.",
      ['The patient', "can't fully understand", ', but this is', 'a true emergency', '.'])
recut(20, '나쁜 소식 통역 전달', 1, 'Take all the time you need to process this.',
      ['Take', 'all the time', 'you need', 'to process this', '.'])

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['The interpreter will explain', 'The interpreter will go over', '통역사가 동의서', '통역사가 금식', '통역사가 마취가',
            '간단하게 말해 주세요']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'core-language-or.yaml'))
append_changes(os.path.join(HERE, 'changes-core-language-or.yaml'), CH)
for n in NOTE:
    print('  note:', n)
print('core-language-or.yaml 저장')
