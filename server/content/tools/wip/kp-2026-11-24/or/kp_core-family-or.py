"""core-family-or — keyPhrase 6문장 교체 + keyPhrase chunks 다시 자르기(2026-11-24 OR 묶음 5 결정, '추천대로').
base-core-family-or.yaml → core-family-or.yaml
근거: wip/icu-or-rest/or/fix-core-family-or-A.md §9 (묶음 A·B·C, keyPhrase chunks 표)"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks
kp_common.MARK = 'keyPhrase 교체(2026-11-24 사용자 결정)'

doc = load(os.path.join(HERE, 'base-core-family-or.yaml'))
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


def order_set(si, title, new_lines, ko, why):
    od = sit(doc, si, title)['order']
    assert len(new_lines) == 4
    for l in new_lines:
        assert len(l['en'].split()) <= 15, l['en']
    od['lines'] = new_lines
    od['ko'] = ko
    od['why'] = why
    NOTE.append({'kind': 'order', 'situation': title, 'fields': ['ko', 'why', 'lines']})


def word_remove(wid, why):
    remove_word(doc, wid)
    CH.append({'kind': 'word-remove', 'id': wid, 'why': why})


# ── 1. keyPhrase 문장 교체 ─────────────────────────────────────────────

# ── 묶음 A — 15 술중 합병증 소식 전달 → 집도의 면담 연결·동석 ──
T = '술중 합병증 소식 전달'

# 1-1. 15.0 — 합병증 고지는 집도의 몫: 간호사는 집도의가 직접 이야기하려 한다고 연결
o = 'There was a complication during the surgery.'
OLD.append(o)
word_remove('w-complication', '15.0 keyPhrase 교체로 어느 문장도 태그하지 않게 됨(합병증 고지는 집도의 몫 — 2026-11-24 결정)')
word_remove('w-during', '15.0 keyPhrase 교체로 어느 문장도 태그하지 않게 됨(2026-11-24 결정)')
s = replace(doc, CH, 15, T, 0, o, {
    'en': 'The surgeon wants to talk with you in person about the surgery.',
    'ko': '집도의 선생님이 수술에 대해 직접 말씀드리고 싶어 하세요.',
    'chunks': ['The surgeon wants', 'to talk with you', 'in person', 'about the surgery', '.'],
    'words': ['w-surgeon', 'w-want', 'w-talk', 'w-surgery'],
    'tag': '면담 연결',
    'icon': 'stetho',
    'why': ('무슨 일이 있었는지를 간호사가 먼저 말하지 않고, The surgeon wants to talk with you로 설명할 사람을 집도의로 세워요. '
            'in person은 직접 만나 이야기한다는 뜻이라 중요한 이야기라는 것을 얼버무리지 않고 알려요.'),
    'decoy': 'by phone',
    'distractorsKo': ['집도의 선생님이 마취에 대해 직접 말씀드리고 싶어 하세요.',
                      '집도의 선생님이 수술에 대해 전화로 말씀드리고 싶어 하세요.'],
    'blank': blank('person', ['writing', 'passing', 'general']),
}, ['en', 'ko', 'chunks', 'words'],
    'There was a complication during the surgery → The surgeon wants to talk with you in person about the surgery.'
    '(합병증 고지는 집도의 몫 — 간호사는 면담을 연결; 검토 A §9 묶음 A (가)); -w-complication·w-during(word-remove), +w-want·w-talk 태그')
check_new(s)

# 1-2. 15.1 — 15.0을 바꾸면 'it'이 가리킬 것이 없음 → 팀에게서 들은 현재 상태만
o = "The team is managing it and she's stable right now."
OLD.append(o)
s = replace(doc, CH, 15, T, 1, o, {
    'en': "The team told me she's stable right now.",
    'ko': '팀에서 지금은 안정적이시라고 알려 줬어요.',
    'chunks': ['The team', 'told me', "she's stable", 'right now', '.'],
    'words': ['w-team', 'w-stable', 'w-right'],
    'tag': '현황 전달',
    'icon': 'monitor',
    'why': ('The team told me로 이 말이 팀에게서 들은 것임을 밝혀, 간호사가 아는 범위만 전해요. '
            'right now는 지금 이 순간의 상태라 앞으로의 결과를 약속하지 않아요.'),
    'decoy': "she's awake",
    'distractorsKo': ['접수처에서 지금은 안정적이시라고 알려 줬어요.',
                      '팀에서 지금은 마취 중이시라고 알려 줬어요.'],
    'blank': blank('stable', ['discharged', 'extubated', 'transferred']),
}, ['en', 'ko', 'chunks', 'words'],
    "The team is managing it and she's stable right now → The team told me she's stable right now."
    "(15.0을 바꿔 'it'이 가리킬 합병증이 없어짐; 검토 A §9 묶음 A); -w-manage 태그(3.0에 남음)")
check_new(s)

sl = sit(doc, 15, T)['nuance'][0]
assert sl['kind'] == 'slider' and sl['cue'].startswith('A wife has just been told there was a complication')
sl['cue'] = ("A wife has just been told that the surgeon wants to talk with her in person, and the surgeon is on the way. "
             "She is shaking, and you are the nurse in the room. She grabs your arm and asks, 'Are you leaving me here alone?'")
NOTE.append({'kind': 'nuance', 'situation': T, 'index': 0, 'fields': ['cue'],
             'why': '간호사가 합병증을 알린 뒤로 읽히는 전제 → 집도의 면담 소식을 들은 뒤로'})
sw = sit(doc, 15, T)['nuance'][2]
assert sw['kind'] == 'swap' and sw['who'] == '간호사 → 가족 · 합병증 소식 뒤'
sw['who'] = '간호사 → 가족 · 집도의 면담 전'
k = 'Complications happen all the time, so try not to worry.'
assert sw['notes'][k].startswith('흔하다고 말해')
sw['notes'][k] = '합병증이 있었다고 간호사가 먼저 확인해 주는 셈이고, 흔하다고 말해 충격을 가볍게 만들며, 걱정하지 말라는 것은 불가능한 부탁이에요.'
NOTE.append({'kind': 'nuance', 'situation': T, 'index': 2, 'fields': ['who', 'notes'],
             'why': '합병증 소식을 간호사가 전한 뒤로 읽히는 who → 면담 전; 오답 note에 고지 범위를 더함'})

order_set(15, T, [
    {'en': 'The surgeon wants to talk with you in person about the surgery.', 'icon': 'stetho',
     'ko': '집도의 선생님이 수술에 대해 직접 말씀드리고 싶어 하세요', 'note': '연결'},
    {'en': "Until that talk, I can share that the team says she's stable.", 'icon': 'monitor',
     'ko': '그 면담 전까지는 팀 말로 지금 안정적이시라는 것만 말씀드릴 수 있어요', 'note': '현황'},
    {'en': 'Anything beyond that, the surgeon will explain in detail.', 'icon': 'board',
     'ko': '그 밖의 것은 집도의 선생님이 자세히 설명해 주실 거예요', 'note': '설명'},
    {'en': "I know this is hard, so I'll stay with you through that explanation.", 'icon': 'handshake2',
     'ko': '힘드신 거 알아요, 그 설명을 듣는 동안 곁에 있을게요', 'note': '동석'},
], '집도의 면담 연결 4문장 순서',
    '집도의가 직접 이야기하고 싶어 한다고 먼저 알리고, 그 면담 전에 간호사가 전할 수 있는 것은 팀이 알려 준 현재 상태뿐이라고 말한 뒤, '
    '그 밖의 것은 집도의가 설명한다고 넘기고, 그 설명을 듣는 자리에 함께 있겠다고 약속하는 순서예요. '
    "'that talk'·'beyond that'·'that explanation'이 앞 줄을 가리켜요.")

# ── 묶음 B — 16 나쁜 소식 준비·전달 → 집도의 면담 준비·동석 ──
T = '나쁜 소식 준비·전달'

# 16.3(비KP, 검토 A §9 조건부) — 고지자의 서두 → 집도의가 오기 전 숨 고르기
o3 = "There's no easy way to say this."
OLD.append(o3)
word_remove('w-easy', '16.3을 집도의 면담 준비 문장으로 바꿔 어느 문장도 태그하지 않게 됨(검토 A §9 묶음 B 조건부 고침)')
word_remove('w-happen', '16.1 keyPhrase 교체로 어느 문장도 태그하지 않게 됨(2026-11-24 결정; slider 16.n0 words에서도 뺌)')
s = replace(doc, CH, 16, T, 3, o3, {
    'en': f'I know this is difficult {DASH} take a moment before the surgeon comes in.',
    'ko': '힘드신 거 알아요 — 집도의 선생님이 들어오시기 전에 잠시 숨을 고르세요.',
    'chunks': ['I know this is difficult', f'{DASH} take a moment', 'before the surgeon', 'comes in', '.'],
    'words': ['w-difficult', 'w-moment', 'w-before', 'w-surgeon'],
    'tag': '숨 고르기',
    'icon': 'faceWorried',
    'why': ('I know this is difficult로 힘든 마음을 먼저 인정하고, take a moment before …로 집도의가 오기 전에 마음을 추스를 틈을 줘요. '
            '소식은 집도의가 전하니 간호사는 그 자리를 준비해요.'),
    'decoy': f'{DASH} take a number',
    'distractorsKo': ['힘드신 거 알아요 — 집도의 선생님이 나가시기 전에 잠시 숨을 고르세요.',
                      '힘드신 거 알아요 — 집도의 선생님이 들어오시기 전에 질문을 적어 두세요.'],
    'blank': blank('difficult', ['routine', 'familiar', 'simple']),
}, ['en', 'ko', 'chunks', 'words'],
    f"There's no easy way to say this → I know this is difficult {DASH} take a moment before the surgeon comes in."
    '(고지자의 서두 — 16.0·16.1 keyPhrase 교체에 딸린 조건부 고침; 검토 A §9 묶음 B); -w-easy(word-remove), +w-difficult·w-moment·w-before·w-surgeon 태그')
check_new(s)
w = word(doc, 'w-difficult')
assert w['example'] == f'Let\'s sit down together {DASH} I have some difficult news.'
NEW163 = (s['en'], s['ko'])

# 1-3. 16.0 — 간호사가 나쁜 소식의 전달자 → 집도의가 온다고 예고
o = f"Let's sit down together {DASH} I have some difficult news."
OLD.append(o)
s = replace(doc, CH, 16, T, 0, o, {
    'en': f"Let's sit down together {DASH} the surgeon is coming to talk with you.",
    'ko': '함께 앉아요, 집도의 선생님이 말씀하러 오고 계세요.',
    'chunks': ["Let's sit down", 'together', f'{DASH} the surgeon is coming', 'to talk with you', '.'],
    'words': ['w-sit', 'w-together', 'w-surgeon', 'w-talk'],
    'tag': '면담 예고',
    'icon': 'faceWorried',
    'why': ('앉자고 먼저 청하고 대시 뒤에 집도의가 온다고 알려, 소식을 전할 사람이 따로 있다는 것과 마음의 준비를 할 시간을 함께 줘요.'),
    'decoy': 'by the window',
    'distractorsKo': ['함께 걸어요, 집도의 선생님이 말씀하러 오고 계세요.',
                      '창가에 앉아요, 집도의 선생님이 말씀하러 오고 계세요.'],
    'blank': blank('together', ['alone', 'apart', 'separately']),
    '_moved': {'w-difficult': NEW163},
}, ['en', 'ko', 'chunks', 'words'],
    f"Let's sit down together {DASH} I have some difficult news → Let's sit down together {DASH} the surgeon is coming to talk with you."
    '(간호사가 나쁜 소식의 전달자 — 집도의 면담 예고로; 검토 A §9 묶음 B); -w-difficult(16.3으로)·w-news 태그, +w-surgeon·w-talk 태그')
check_new(s)

# 1-4. 16.1 — 'what happened'을 간호사가 설명하겠다는 말 → 아는 만큼만
o = 'I want to be honest with you about what happened.'
OLD.append(o)
s = replace(doc, CH, 16, T, 1, o, {
    'en': "I'll be honest with you about what I know.",
    'ko': '제가 아는 것은 솔직하게 말씀드릴게요.',
    'chunks': ["I'll be honest", 'with you', 'about', 'what I know', '.'],
    'words': ['w-honest'],
    'tag': '솔직한 전달',
    'icon': 'speech',
    'why': ("I'll be honest로 얼버무리지 않겠다고 약속하되, about what I know로 아는 범위까지만 말하겠다고 선을 그어요. "
            '모르는 것은 집도의가 설명해요.'),
    'decoy': 'what I think',
    'distractorsKo': ['제가 아는 것은 천천히 말씀드릴게요.',
                      '제가 생각하는 것은 솔직하게 말씀드릴게요.'],
    'blank': blank('honest', ['formal', 'cheerful', 'casual']),
}, ['en', 'ko', 'chunks', 'words'],
    "I want to be honest with you about what happened → I'll be honest with you about what I know."
    "('what happened'을 간호사가 설명하겠다는 말 — slider 16.n0과 반대; 검토 A §9 묶음 B); -w-want·w-happen 태그(w-happen word-remove)")
check_new(s)

sl = sit(doc, 16, T)['nuance'][0]
assert sl['kind'] == 'slider' and sl['example'] == o
sl['words'] = ['w-honest', 'w-surgeon']
sl['example'], sl['exKo'] = s['en'], s['ko']
NOTE.append({'kind': 'nuance', 'situation': T, 'index': 0, 'fields': ['words', 'example', 'exKo'],
             'why': '예문이 바꾼 16.1 — w-happen·w-news가 이 상황 문장에서 빠져 words를 [w-honest, w-surgeon]으로(검토 A §9)'})

order_set(16, T, [
    {'en': f"Let's sit down together {DASH} the surgeon is coming to talk with you.", 'icon': 'faceWorried',
     'ko': '함께 앉아요, 집도의 선생님이 말씀하러 오고 계세요', 'note': '예고'},
    {'en': "Until then, I'll be honest with you about what I know.", 'icon': 'speech',
     'ko': '그때까지 제가 아는 것은 솔직하게 말씀드릴게요', 'note': '솔직'},
    {'en': "For anything more, the surgeon will explain, and I'll stay right beside you.", 'icon': 'handshake2',
     'ko': '그 이상은 집도의 선생님이 설명해 주시고, 저는 바로 곁에 있을게요', 'note': '동석'},
    {'en': f"After hearing all of that, take whatever time you need {DASH} I'm right here.", 'icon': 'handshake2',
     'ko': '그 이야기를 다 들으신 뒤에는 필요한 만큼 시간을 가지세요, 제가 여기 있어요', 'note': '곁'},
], '집도의 면담 준비 4문장 순서',
    '앉자고 청하며 집도의가 온다고 예고하고, 그때까지는 아는 만큼만 솔직하게 말하겠다고 한 뒤, 그 이상은 집도의가 설명하고 그동안 곁에 있겠다고 하고, '
    "그 이야기를 다 들은 뒤에는 시간을 가지라며 곁을 지키겠다고 맺는 순서예요. 'Until then'·'anything more'·'all of that'이 앞 줄을 가리켜요.")

# ── 묶음 C — 20 위기 중 가족 결정 지원 ──
T = '위기 중 가족 결정 지원'

# 1-5. 20.0 — 선택지 설명은 집도의 → 설명되도록 챙기기
o = 'Let me explain the options as clearly as I can.'
OLD.append(o)
s = replace(doc, CH, 20, T, 0, o, {
    'en': "I'll make sure the options are explained as clearly as possible.",
    'ko': '선택지를 최대한 명확하게 설명받으실 수 있게 할게요.',
    'chunks': ["I'll make sure", 'the options', 'are explained', 'as clearly as possible', '.'],
    'words': ['w-make', 'w-explain', 'w-option', 'w-clearly'],
    'tag': '설명 연결',
    'icon': 'board',
    'why': ("수동태 are explained로 설명하는 사람(집도의)을 간호사로 바꾸지 않고, I'll make sure로 가족이 설명을 제대로 듣게 챙기는 쪽임을 말해요. "
            'as clearly as possible은 최대한 알기 쉽게라는 뜻이에요.'),
    'decoy': 'the visiting rules',
    'distractorsKo': ['비용을 최대한 명확하게 설명받으실 수 있게 할게요.',
                      '선택지를 최대한 빠르게 설명받으실 수 있게 할게요.'],
    'blank': blank('clearly', ['loudly', 'harshly', 'secretly']),
}, ['en', 'ko', 'chunks', 'words'],
    "Let me explain the options as clearly as I can → I'll make sure the options are explained as clearly as possible."
    '(선택지 설명은 집도의 — slider 20.n0 why와 반대; 검토 A §9 묶음 C); +w-make(make sure) 태그')
check_new(s)

# 1-6. 20.1 — 과거완료가 이미 숨진 사람처럼 들림 → 현재 뜻
o = 'Think about what he would have wanted.'
OLD.append(o)
s = replace(doc, CH, 20, T, 1, o, {
    'en': 'Think about what he would want.',
    'ko': '환자분이 원하실 걸 생각해보세요.',
    'chunks': ['Think about', 'what', 'he would want', '.'],
    'words': ['w-want'],
    'tag': '가치 안내',
    'icon': 'compass',
    'why': ('what he would want는 가족의 바람이 아니라 환자 본인의 뜻을 기준으로 삼게 하는 틀이에요. '
            '현재 would want라 지금 살아 있는 환자의 뜻을 묻는 말로 들리고, 결정을 대신 내리지 않고 기준만 건네요.'),
    'decoy': 'Look for',
    'distractorsKo': ['환자분이 원하실 걸 찾아보세요.',
                      '환자분이 걱정하실 걸 생각해보세요.'],
    'blank': blank('want', ['fear', 'miss', 'hide']),
}, ['en', 'ko', 'chunks'],
    'Think about what he would have wanted → Think about what he would want.(과거완료가 이미 숨진 사람처럼 들림; 검토 A §9 묶음 C)')
check_new(s)

od = sit(doc, 20, T)['order']
assert od['lines'][0]['en'] == 'Let me explain the options as clearly as I can.'
assert od['lines'][1]['en'] == 'With those in mind, think about what he would have wanted.'
od['lines'][0].update({'en': "I'll make sure the options are explained as clearly as possible.",
                       'ko': '선택지를 최대한 명확하게 설명받으실 수 있게 할게요', 'note': '연결'})
od['lines'][1].update({'en': 'With those in mind, think about what he would want.',
                       'ko': '그걸 염두에 두고 환자분이 원하실 걸 생각해보세요'})
assert od['why'].startswith('선택지를 설명하고,')
od['why'] = ('선택지가 명확히 설명되도록 챙기고, 그것을 염두에 두고 환자의 뜻을 떠올리게 하고, 어떤 결정이든 지지하겠다고 약속한 뒤, '
             "결정하실 때까지 질문을 환영하며 맺는 순서예요. 'those'·'Until then'이 앞 줄을 가리켜요.")
NOTE.append({'kind': 'order', 'situation': T, 'fields': ['lines[0]', 'lines[1]', 'why']})

# ── 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-core-family-or-A.md §9 표 ─────
# 20.1은 위 1에서 새 문장으로 잘랐다.
recut(0, '대기실 안내', 0, 'You can wait right here in the surgical waiting area.',
      ['You can', 'wait', 'right here', 'in the surgical waiting area', '.'], {'decoy': 'in the recovery area'})
recut(1, '예상 소요 시간 안내', 0, 'The surgery usually takes about two to three hours.',
      ['The surgery', 'usually', 'takes', 'about two to three hours', '.'], {'decoy': 'about four to five hours'})
recut(1, '예상 소요 시간 안내', 2, "Times can vary, and we'll keep you posted.",
      ['Times can vary', ', and', "we'll keep you posted", '.'], {'decoy': "we'll keep you waiting"})
recut(2, '진행 상황 업데이트', 0, 'The team just let me know things are going well.',
      ['The team', 'just', 'let me know', 'things are going well', '.'], {'decoy': 'things are running late'})
recut(2, '진행 상황 업데이트', 2, "I'll come back with the next update.",
      ["I'll", 'come back', 'with the next update', '.'], {'decoy': 'with the visitor badge'})
recut(3, '가족 질문 응대', 2, "That's a common concern, and we plan for it.",
      ["That's", 'a common concern', ', and we plan', 'for it', '.'], {'decoy': 'a billing question'})
recut(4, '회복실 면회 안내', 1, "A nurse will come get you when she's ready.",
      ['A nurse', 'will come', 'get you', "when she's ready", '.'], {'decoy': 'when the shift ends'})
recut(4, '회복실 면회 안내', 2, "Usually that's about thirty minutes after surgery.",
      ["Usually that's", 'about thirty minutes', 'after surgery', '.'], {'decoy': 'after admission'})
recut(5, '연락 방법 안내', 0, "Leave me your cell number and I'll call you.",
      ['Leave me', 'your cell number', 'and', "I'll call you", '.'], {'decoy': 'your email address'})
recut(5, '연락 방법 안내', 1, "There's a pager system if you prefer.",
      ["There's", 'a pager system', 'if you prefer', '.'], {'decoy': 'a shuttle service'})
recut(9, '제한된 정보 범위 소통', 0, "I can share that he's stable and doing well.",
      ['I can share', 'that', "he's stable", 'and doing well', '.'], {'decoy': "he's awake"})
recut(10, '다국어 가족 소통', 0, f"Your son is doing well {DASH} he's stable.",
      ['Your son', 'is doing well', f"{DASH} he's stable", '.'], {'decoy': f"{DASH} he's hungry"})
recut(11, '소아 보호자 소통', 0, 'Your daughter is in very good hands.',
      ['Your daughter', 'is', 'in very good hands', '.'], {'decoy': 'in very busy hands'})
recut(14, '종교적 요구 조율', 1, 'I can arrange a moment before we take him back.',
      ['I can arrange', 'a moment', 'before', 'we take him back', '.'])
recut(17, '사망 소식 지원', 0, "I'm so deeply sorry for your loss.",
      ["I'm", 'so deeply sorry', 'for your loss', '.'], {'decoy': 'for your patience'})
recut(17, '사망 소식 지원', 2, "When you're ready, I can help with the next steps.",
      ['When', "you're ready", ', I can help', 'with the next steps', '.'])

# ── 3. 남은 옛 문장·옛 주장 확인 ─────
check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['managing it', 'both of those', 'difficult news', 'about what happened', 'honestly what happened', 'no easy way', 'Being direct',
            'would have wanted', 'as I can', 'complication during', '합병증 소식 뒤', 'has just been told there was a complication',
            '힘든 소식을 전해', '나쁜 소식 전달 4문장']:
    assert bad not in raw, bad
for wid in ['w-complication', 'w-during', 'w-happen', 'w-easy']:
    assert wid not in raw, wid
dump(doc, os.path.join(HERE, 'core-family-or.yaml'))
append_changes(os.path.join(HERE, 'changes-core-family-or.yaml'), CH)
for n in NOTE:
    print('  note:', n)
print('core-family-or.yaml 저장')
