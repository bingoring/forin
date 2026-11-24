"""or-preop-checklist — keyPhrase 5문장 교체 + keyPhrase chunks 다시 자르기(2026-11-24 OR 묶음 6 결정, '추천대로').
base-or-preop-checklist.yaml → or-preop-checklist.yaml
근거: wip/icu-or-rest/or/fix-or-preop-checklist-A.md 'keyPhrase — 사용자 결정 필요' 표(17.2·16.2·15.2·7.2·9.2, chunks 10.0·12.2·18.1·10.1·19.0·8.0)
대화 상대(정본 persona): 7·9·15 마취과의사, 16 소독간호사, 17 외과의."""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks
kp_common.MARK = 'keyPhrase 교체(2026-11-24 사용자 결정)'

doc = load(os.path.join(HERE, 'base-or-preop-checklist.yaml'))
CH = []
NOTE = []  # v45·v46 필드(order·nuance) 고침 — changes 목록 대상이 아님(V16은 v44만 봄)
OLD = []


def klen(s):
    return len(re.sub(r'\s', '', s))


def blank_at(answer, others, pos):
    """정답 칸을 base 자리 그대로(blank()는 정답을 맨 앞에 둔다)."""
    b = blank(answer, others)
    o = b['options'][1:]
    o.insert(pos, {'en': answer})
    b['options'] = o
    return b


def check_new(s):
    assert len(re.findall(r'(?<![\w-])' + re.escape(s['blank']['answer']) + r'(?![\w-])', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert len(s['distractorsKo']) == 2 and s['ko'] not in s['distractorsKo']
    a = klen(s['ko'])
    for x in s['distractorsKo']:
        b = klen(x)
        assert max(a, b) / min(a, b) <= 1.25 or abs(a - b) <= 3, (s['ko'], x, a, b)
    assert min(klen(x) for x in s['distractorsKo']) <= a, ('오답 하나는 정답 길이 이하', s['ko'])
    assert meaningful_chunks(s['chunks']) >= min_chunks_for(s['en']), (s['en'], s['chunks'])
    assert not dangling_chunks(s['chunks']), s['chunks']
    for w in s['words']:
        assert w in {x['id'] for x in doc['words']}, w


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
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'],
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"
                      + (f"; decoy를 새 조각 자리 모양으로({extra['decoy']})" if extra and 'decoy' in extra else '')})


def order_line(si, title, li, old_en, new):
    od = sit(doc, si, title)['order']
    l = od['lines'][li]
    assert l['en'] == old_en, (title, li, l['en'])
    l.update(new)
    assert len(l['en'].split()) <= 15, l['en']
    NOTE.append({'kind': 'order', 'situation': title, 'line': li, 'fields': sorted(new)})


def slider_example(si, title, ni, old_en, s, why=None):
    sl = sit(doc, si, title)['nuance'][ni]
    assert sl['kind'] == 'slider' and sl['example'] == old_en, (title, sl.get('example'))
    sl['example'], sl['exKo'] = s['en'], s['ko']
    f = ['example', 'exKo']
    if why:
        assert sl['why'] == why[0], sl['why']
        sl['why'] = why[1]
        f.append('why')
    NOTE.append({'kind': 'nuance', 'situation': title, 'index': ni, 'fields': f})


# ── 1. keyPhrase 문장 교체 ─────────────────────────────────────────────

# 1-1. 17.2 교차혈액 없이 출혈 수술 — MTP 발동은 집도의·마취과, 간호사는 혈액은행에 알림(or-bleeding 18.0과 같은 결정·같은 ko)
T = '교차혈액 없이 출혈 수술'
o = "I'm activating the massive transfusion protocol."
OLD.append(o)
s17 = replace(doc, CH, 17, T, 2, o, {
    'en': "I'm calling the blood bank to activate the massive transfusion protocol.",
    'ko': '대량수혈 프로토콜을 발동하려고 혈액은행에 전화하고 있어요.',
    'chunks': ["I'm calling", 'the blood bank', 'to activate', 'the massive transfusion protocol', '.'],
    'words': ['w-call', 'w-bloodbank', 'w-activate', 'w-massive', 'w-transfusion', 'w-protocol'],
    'tag': '발동 연락',
    'icon': 'siren',
    'why': ("I'm calling the blood bank to …로 누구에게 무엇을 위해 연락하는지 한 번에 알려요. "
            '발동은 집도의·마취과가 정하고, 순환간호사는 그 결정을 받아 혈액은행에 전화해 프로토콜을 가동시켜요.'),
    'decoy': 'the malignant hyperthermia protocol',
    'distractorsKo': ['대량수혈 프로토콜을 발동하려고 혈액은행에 전화할 번호를 찾고 있어요.',
                      '프로토콜이 발동되면 혈액은행이 쿨러를 차례로 보내요.'],
    'blank': blank_at('activate', ['review', 'revise', 'archive'], 2),
}, ['en', 'ko', 'chunks', 'words'],
    "I'm activating the massive transfusion protocol → I'm calling the blood bank to activate the massive transfusion protocol."
    '(발동 결정은 집도의·마취과, 간호사는 혈액은행에 알림 — or-bleeding과 같은 결정; 검토 A 17.2); +w-call·w-bloodbank 태그(6.2에 있음)')
check_new(s17)
# swap 17 — 정답이 이미 새 결정의 구(calling the blood bank to activate …). ko만 새 KP ko에 맞춤
sw = sit(doc, 17, T)['nuance'][1]
assert sw['kind'] == 'swap' and sw['answer'] == 'calling the blood bank to activate the massive transfusion protocol'
assert sw['ko'] == '혈액은행에 전화해서 대량수혈 프로토콜을 발동할게요'
sw['ko'] = '대량수혈 프로토콜을 발동하려고 혈액은행에 전화하고 있어요'
assert sw['notes']['calling the blood bank to activate the massive transfusion protocol'] == '혈액은행에 전화해 프로토콜을 가동하는 간호사의 역할을 정확히 말해요.'
sw['notes']['calling the blood bank to activate the massive transfusion protocol'] = '결정권자의 발동 결정을 받아 혈액은행에 전화하는 간호사의 역할을 정확히 말해요.'
NOTE.append({'kind': 'nuance', 'situation': T, 'index': 1, 'fields': ['ko', 'notes'],
             'why': '정답 보기가 바꾼 17.2와 같은 말 — ko를 KP ko와 같게, 해설에 발동 결정은 결정권자라고'})

# 1-2. 16.2 항생제 미투여 절개 임박 — 절개 직전 정맥 투여는 보통 마취과, 순환간호사는 시각 기록(상대 소독간호사)
T = '항생제 미투여 절개 임박'
o = "I'm giving it now and documenting the time."
OLD.append(o)
s16 = replace(doc, CH, 16, T, 2, o, {
    'en': "Anesthesia is giving it now, and I'll document the time.",
    'ko': '마취과에서 지금 투여하고 있고, 시각은 제가 기록할게요.',
    'chunks': ['Anesthesia is giving it', 'now', ", and I'll document", 'the time', '.'],
    'words': ['w-anesthesia', 'w-give', 'w-document'],
    'tag': '투여·기록',
    'icon': 'pill',
    'why': ('Anesthesia is giving it now로 누가 지금 투여하는지 밝혀 소독간호사가 상황을 따라오게 하고, '
            "and I'll document the time으로 순환간호사의 몫인 투여 시각 기록을 맡아요. 절개 직전 정맥 투여는 보통 마취과가 해요."),
    'decoy': 'Pharmacy is mixing it',
    'distractorsKo': ['마취과에서 지금 투여하고 있고, 시각은 제가 부를게요.',
                      '마취과에서 지금 투여하고 있고, 흐름은 제가 봐 둘게요.'],
}, ['en', 'ko', 'chunks', 'words'],
    "I'm giving it now and documenting the time → Anesthesia is giving it now, and I'll document the time."
    '(절개 직전 수술실 정맥 투여는 보통 마취과 — 같은 상황 16.3·16.4와 누가 주는지 맞춤; 검토 A 16.2); +w-anesthesia 태그')
check_new(s16)

# 1-3. 15.2 검사 이상치 수술 지연 — 상대가 마취과의사 → 마취과를 3인칭으로 부르지 않음
T = '검사 이상치 수술 지연'
o = "I'm calling the surgeon and anesthesia right now."
OLD.append(o)
s15 = replace(doc, CH, 15, T, 2, o, {
    'en': "I'm calling the surgeon right now.",
    'ko': '지금 바로 집도의에게 전화할게요.',
    'chunks': ["I'm calling", 'the surgeon', 'right now', '.'],
    'words': ['w-call', 'w-surgeon'],
    'why': ("I'm calling…right now로 지금 이 순간 하고 있는 행동을 진행형으로 알려요. "
            '마취과는 지금 대화하는 상대라 이미 듣고 있으니, 함께 정할 또 한 사람인 집도의를 부른다고 짚어요.'),
    'distractorsKo': ['집도의에게 전화할 번호를 지금 찾을게요.',
                      '집도의가 이 수치를 알아야 해요.'],
}, ['en', 'ko', 'chunks', 'words'],
    "I'm calling the surgeon and anesthesia right now → I'm calling the surgeon right now."
    '(대화 상대가 마취과의사 — 지금 말하는 상대에게 마취과에 전화한다고 함; 검토 A 15.2); -w-anesthesia 태그(16.2에 남음)')
check_new(s15)
slider_example(15, T, 0, o, s15)

# 1-4. 7.2 필수 검사 결과 누락 — 상대가 마취과의사
T = '필수 검사 결과 누락'
o = "I'll let the surgeon and anesthesia know."
OLD.append(o)
s7 = replace(doc, CH, 7, T, 2, o, {
    'en': "I'll let the surgeon know.",
    'ko': '집도의에게 알릴게요.',
    'chunks': ["I'll let", 'the surgeon', 'know', '.'],
    'words': ['w-surgeon'],
    'why': ("I'll let … know로 내가 직접 전한다고 밝혀요. 마취과는 지금 대화하는 상대라, "
            '진행을 함께 정할 또 한 사람인 집도의에게 알린다고 짚어요.'),
    'decoy': "I'll make",
    'distractorsKo': ['알릴 내용을 적을게요.',
                      '진행은 집도의와 정해요.'],
    'blank': blank_at('let', ['make', 'help', 'get'], 1),
    '_moved': {'w-anesthesia': (s16['en'], s16['ko'])},
}, ['en', 'ko', 'chunks', 'words'],
    "I'll let the surgeon and anesthesia know → I'll let the surgeon know."
    '(대화 상대가 마취과의사 — 지금 말하는 상대에게 마취과에 알린다고 함; 검토 A 7.2); -w-anesthesia 태그(16.2에 남음, example도 16.2로)')
check_new(s7)
# order 7 줄3 — them은 집도의 한 사람을 가리킴(ko '그분들께'가 복수로 어긋남)
order_line(7, T, 2, 'I\'ll ask them whether we hold the case until it results.',
           {'ko': '결과가 나올 때까지 보류할지 그분께도 여쭤볼게요'})

# 1-5. 9.2 항생제 투여 시각 지연 — 투여 시점을 간호사 혼자 조정하는 말 → 함께 맞추고 기록은 내가
T = '항생제 투여 시각 지연'
o = "I'll adjust the timing and document it."
OLD.append(o)
s9 = replace(doc, CH, 9, T, 2, o, {
    'en': "Let's adjust the timing, and I'll document it.",
    'ko': '시각을 함께 맞추고, 기록은 제가 할게요.',
    'chunks': ["Let's adjust", 'the timing', ", and I'll", 'document it', '.'],
    'words': ['w-adjust', 'w-timing', 'w-document'],
    'tag': '조정·기록',
    'icon': 'pencil',
    'why': ("Let's adjust로 투여 시점을 마취과와 함께 맞추자고 하고, and I'll document it으로 기록은 내가 맡는다고 몫을 나눠요. "
            '투여 시점은 간호사 혼자 정하지 않아요.'),
    'decoy': 'the room temperature',
    'distractorsKo': ['시각을 함께 맞추고, 알림은 제가 켤게요.',
                      '투여 시각은 절개 시각을 기준으로 잡아요.'],
}, ['en', 'ko', 'chunks'],
    "I'll adjust the timing and document it → Let's adjust the timing, and I'll document it."
    '(투여 시점을 간호사 혼자 조정하는 말로 들림 — 함께 맞추고 기록은 내가; 검토 A 9.2)')
check_new(s9)
slider_example(9, T, 0, o, s9)

# ── 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-or-preop-checklist-A.md 표 ─────
# 17.2·16.2·15.2·7.2·9.2는 위 1에서 새 문장으로 잘랐다.
recut(10, '정맥로 불량 재확보', 0, "This line isn't flowing well, so I'll start a new one.",
      ['This line', "isn't flowing well", ", so I'll start", 'a new one', '.'])
recut(12, '수술 전 VTE 예방 확인', 2, "I'll confirm the VTE prevention orders.",
      ["I'll", 'confirm', 'the VTE prevention orders', '.'], {'decoy': 'the fall prevention orders'})
recut(18, '심박동기 환자 소작 위험', 1, 'We should use bipolar and place the pad away from the device.',
      ['We should', 'use bipolar', 'and place the pad', 'away from the device', '.'])
recut(10, '정맥로 불량 재확보', 1, "You'll feel a small pinch.",
      ["You'll", 'feel', 'a small pinch', '.'], {'decoy': 'a sudden cramp'})
recut(19, '응급 체크리스트 생략 압박', 0, 'We still need the time-out even in an emergency.',
      ['We still need', 'the time-out', 'even', 'in an emergency', '.'])
recut(8, '인공관절·심박동기 정보', 0, 'Do you have a pacemaker or any metal implants?',
      ['Do you have', 'a pacemaker', 'or', 'any metal implants', '?'], {'decoy': 'any hearing aids'})

# ── 3. 남은 옛 문장·옛 주장 확인 ─────
check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ["I'm activating", 'the surgeon and anesthesia know', 'surgeon and anesthesia right now',
            "I'm giving it now", "I'll adjust the timing", '발동시킬게요', '지금 투여하고 시각을 기록할게요',
            '집도의와 마취과에 전화할게요', '집도의와 마취과에 알릴게요', '시각을 조정하고 기록해 둘게요', '그분들께']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'or-preop-checklist.yaml'))
append_changes(os.path.join(HERE, 'changes-or-preop-checklist.yaml'), CH)
for n in NOTE:
    print('  note:', n)
print('or-preop-checklist.yaml 저장')
