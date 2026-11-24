"""or-emergency-open — keyPhrase 6문장 교체 + keyPhrase chunks 다시 자르기(2026-11-24 OR 묶음 5 결정, '추천대로').
base-or-emergency-open.yaml → or-emergency-open.yaml
근거: wip/icu-or-rest/or/fix-or-emergency-open-A.md §9 (K1~K6, N14 swap 연동, KP chunks 목록)"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks
kp_common.MARK = 'keyPhrase 교체(2026-11-24 사용자 결정)'

doc = load(os.path.join(HERE, 'base-or-emergency-open.yaml'))
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


def order_line(si, title, li, old_en, new):
    od = sit(doc, si, title)['order']
    l = od['lines'][li]
    assert l['en'] == old_en, (title, li, l['en'])
    l.update(new)
    assert len(l['en'].split()) <= 15, l['en']
    NOTE.append({'kind': 'order', 'situation': title, 'line': li, 'fields': sorted(new)})


def order_why(si, title, old, new):
    od = sit(doc, si, title)['order']
    assert od['why'] == old, (title, od['why'])
    od['why'] = new
    NOTE.append({'kind': 'order', 'situation': title, 'fields': ['why']})


def swap_set(si, title, ni, old_answer, who, wrong_before, options, answer, notes, why, ko, words=None):
    sw = sit(doc, si, title)['nuance'][ni]
    assert sw['kind'] == 'swap' and sw['answer'] == old_answer, (title, sw.get('answer'))
    assert set(notes) == set(options) and answer in options and wrong_before in options and wrong_before != answer
    assert options.index(answer) == sw['options'].index(old_answer), '정답 칸은 base 자리 그대로'
    sw.update({'who': who, 'before': ['', wrong_before, ''], 'options': options, 'answer': answer,
               'notes': notes, 'why': why, 'ko': ko})
    if words is not None:
        sw['words'] = words
    NOTE.append({'kind': 'nuance', 'situation': title, 'index': ni,
                 'fields': ['who', 'before', 'options', 'answer', 'notes', 'why', 'ko'] + (['words'] if words else [])})


# ── 1. keyPhrase 문장 교체 ─────────────────────────────────────────────

# 1-1. K1 손상통제 수술 전환 [19] 문장 0 — tagline에서 집도의가 이미 선언 → 복창
T = '손상통제 수술 전환'
o = "Let's pack and do a temporary closure."
OLD.append(o)
s = replace(doc, CH, 19, T, 0, o, {
    'en': f"Got it {DASH} we're packing and doing a temporary closure.",
    'ko': '알겠어요 — 패킹하고 임시 봉합을 해요.',
    'chunks': ['Got it', f"{DASH} we're packing", 'and doing', 'a temporary closure', '.'],
    'words': ['w-pack', 'w-temporary', 'w-closure'],
    'tag': '결정 복창',
    'icon': 'scalpel',
    'why': ("Got it으로 집도의의 결정을 받았다고 먼저 알리고, we're packing and doing …으로 할 일을 그대로 되말해 지시를 닫아요(closed-loop). "
            '손상통제 전환은 집도의가 정하고, 순환간호사는 복창으로 팀이 같은 계획을 듣게 해요.'),
    'decoy': 'a ward round',
    'distractorsKo': ['알겠어요 — 임시 봉합으로 수술 시간을 줄여요.',
                      '알겠어요 — 패킹은 거즈로 해요.'],
    'blank': blank('packing', ['measuring', 'retracting', 'draping']),
}, ['en', 'ko', 'chunks'],
    f"Let's pack and do a temporary closure → Got it {DASH} we're packing and doing a temporary closure."
    '(손상통제 방법을 간호사가 Let\'s로 정함 — tagline의 집도의 선언을 되받는 복창으로; 검토 A K1)')
check_new(s)
order_line(19, T, 0, o, {'en': s['en'], 'ko': '알겠어요 — 패킹하고 임시 봉합을 해요', 'note': '복창'})
order_why(19, T,
          '패킹과 임시 봉합을 제안하고, 그 봉합 물품이 준비됐다고 알리고, 물품이 준비된 상태에서 봉합 후 중환자실에 연락한다고 말하고, 그곳에서 소생 치료를 하고 돌아온다고 계획을 맺어요. '
          'that closure·With those supplies ready·there가 앞 줄을 가리켜요.',
          '집도의의 패킹·임시 봉합 결정을 복창하고, 그 봉합 물품이 준비됐다고 알리고, 물품이 준비된 상태에서 봉합 후 중환자실에 연락한다고 말하고, '
          '그곳에서 소생 치료를 하고 돌아온다고 계획을 맺어요. that closure·With those supplies ready·there가 앞 줄을 가리켜요.')

# 1-2. K3 파종성 응고장애 [18] 문장 1 — 제제 요구 = 처방 → 의사에게 묻기
T = '파종성 응고장애'
o1 = 'I need FFP, platelets, and cryo now.'
OLD.append(o1)
s = replace(doc, CH, 18, T, 1, o1, {
    'en': 'Do you want FFP, platelets, and cryo now?',
    'ko': '지금 FFP와 혈소판, 크라이오가 필요하세요?',
    'chunks': ['Do you want', 'FFP', ', platelets', ', and cryo now', '?'],
    'words': ['w-ffp', 'w-platelet', 'w-cryo'],
    'tag': '제제 확인',
    'icon': 'pill',
    'why': ('Do you want …?로 제제를 정하는 의사에게 묻고, 제제 이름을 곧장 나열해 예·아니요로 바로 답할 수 있게 해요. '
            '간호사는 답을 받는 대로 혈액은행에 전해요.'),
    'decoy': 'Do we have',
    'distractorsKo': ['FFP와 혈소판, 크라이오가 혈액은행에 있나요?',
                      '지금 FFP와 혈소판, 크라이오가 도착했나요?'],
}, ['en', 'ko', 'chunks', 'words'],
    'I need FFP, platelets, and cryo now → Do you want FFP, platelets, and cryo now?'
    '(제제 요구는 처방 — 의사에게 묻는 말로; 검토 A K3); -w-need 태그(다른 상황에 남음)')
check_new(s)

# 1-3. K2 파종성 응고장애 [18] 문장 0 — 간호사의 진단 단정 → 팀의 판단 확인
o0 = f"She's oozing everywhere {DASH} this is DIC."
OLD.append(o0)
s = replace(doc, CH, 18, T, 0, o0, {
    'en': f"She's oozing everywhere {DASH} are we treating this as DIC?",
    'ko': '곳곳에서 배어 나오고 있어요 — DIC로 보고 처치하는 건가요?',
    'chunks': ["She's oozing", 'everywhere', f'{DASH} are we treating', 'this as DIC', '?'],
    'words': ['w-ooze', 'w-everywhere', 'w-dic'],
    'tag': '소견·확인',
    'icon': 'siren',
    'why': ('oozing은 스며 나오다라는 뜻으로 조금씩 계속 나오는 출혈을 묘사해요. 본 것을 먼저 말하고, 대시 뒤 are we treating this as …?로 '
            '진단을 단정하지 않고 팀의 판단을 확인해요. DIC 진단과 처치 방향은 의사가 정해요.'),
    'decoy': 'from the port',
    'distractorsKo': ['곳곳에서 배어 나오고 있어요 — DIC 검사 결과가 나왔나요?',
                      '곳곳에서 배어 나오고 있어요 — DIC가 왜 생긴 건가요?'],
}, ['en', 'ko', 'chunks'],
    f"She's oozing everywhere {DASH} this is DIC → She's oozing everywhere {DASH} are we treating this as DIC?"
    '(간호사의 진단 단정 — 팀의 판단을 묻는 말로; 검토 A K2)')
check_new(s)

swap_set(18, T, 1, o1,
         who='순환간호사 → 집도의·마취과 · 제제 확인',
         wrong_before='She might want some clotting stuff, I think.',
         options=['She might want some clotting stuff, I think.',
                  "I'll just order whatever blood bank has.",
                  'Do you want FFP, platelets, and cryo now?'],
         answer='Do you want FFP, platelets, and cryo now?',
         notes={
             'She might want some clotting stuff, I think.': "'응고 관련 뭔가'처럼 막연해서 무엇을 묻는지 알 수 없고, 의사가 답할 수 없다.",
             "I'll just order whatever blood bank has.": '처방 없이 간호사가 아무 제제나 주문하겠다는 말이라, 제제를 정하는 의사를 건너뛴다.',
             'Do you want FFP, platelets, and cryo now?': '제제 이름을 넣어 물어서 의사가 바로 답하고, 그 답을 혈액은행에 그대로 전할 수 있다.',
         },
         why=('어떤 제제를 쓸지는 집도의·마취과가 정해요. 간호사는 제제 이름을 분명히 넣어 묻고, 답을 받으면 혈액은행에 그대로 전해요. '
              '막연한 말이나 처방 없는 주문은 잘못된 제제를 부르거나 지체시켜요.'),
         ko='지금 FFP와 혈소판, 크라이오가 필요하세요?',
         words=['w-ffp', 'w-platelet', 'w-cryo'])

# order 18 — 첫 두 줄이 질문이 되어 뒤 줄이 '예'를 전제하지 않게 조건으로 잇는다
order_line(18, T, 0, o0, {'en': f"She's oozing everywhere {DASH} are we treating this as DIC?",
                          'ko': '곳곳에서 배어 나와요 — DIC로 보고 처치하는 건가요?', 'note': '확인'})
order_line(18, T, 1, 'For that, I need FFP, platelets, and cryo now.',
           {'en': 'If so, do you want FFP, platelets, and cryo now?',
            'ko': '그렇다면 지금 FFP와 혈소판, 크라이오가 필요하세요?', 'note': '질문'})
order_line(18, T, 2, "I'll call blood bank and request all of that.",
           {'en': "Once those are ordered, I'll call blood bank for them.",
            'ko': '그 주문이 들어가면 혈액은행에 전화할게요'})
order_line(18, T, 3, 'Blood bank is preparing those products now.',
           {'en': "After that call, I'll tell you when they're ready.",
            'ko': '전화한 뒤 제제가 준비되면 알려 드릴게요', 'icon': 'pager', 'note': '보고'})
order_why(18, T,
          '출혈을 알리고, 그 DIC 때문에 필요한 제제를 나열하고, 그 전체를 혈액은행에 요청하고, 혈액은행이 그 제제를 준비 중이라고 확인해요. '
          'For that·all of that·those products가 앞 줄을 가리켜요.',
          '출혈 양상을 알리며 DIC로 보고 처치하는지 묻고, 그렇다면 제제가 필요한지 묻고, 주문이 들어가면 혈액은행에 전화하고, '
          "그 전화 뒤 제제가 준비되면 알려요. 진단과 제제는 의사가 정하니 '예'를 듣기 전에는 요청하지 않아요. If so·those·that call이 앞 줄을 가리켜요.")

# 1-4. K4 산모 대량 출혈 위기 [16] 문장 0 — 개시 결정은 집도의·마취과, 간호사는 혈액은행에 알림
T = '산모 대량 출혈 위기'
o = 'Activating the OB massive transfusion protocol.'
OLD.append(o)
s = replace(doc, CH, 16, T, 0, o, {
    'en': 'Calling the blood bank to activate the OB massive transfusion protocol.',
    'ko': '산과 대량수혈 프로토콜을 개시하려고 혈액은행에 전화하고 있어요.',
    'chunks': ['Calling', 'the blood bank', 'to activate', 'the OB massive transfusion protocol', '.'],
    'words': ['w-call', 'w-bloodbank', 'w-activate', 'w-ob', 'w-massive', 'w-transfusion', 'w-protocol'],
    'tag': '개시 연락',
    'icon': 'siren',
    'why': ('Calling the blood bank to …로 누구에게 무엇을 위해 연락하는지 한 번에 알려요. 개시는 집도의·마취과가 정하고, '
            '순환간호사는 그 결정을 받아 혈액은행에 프로토콜 이름으로 전해 긴급 절차를 가동시켜요.'),
    'decoy': 'the OB discharge protocol',
    'distractorsKo': ['산과 대량수혈 프로토콜이 개시되면 혈액은행이 쿨러를 차례로 보내요.',
                      '산과 대량수혈 프로토콜은 제제를 정해진 비율로 묶어 보내요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'Activating the OB massive transfusion protocol → Calling the blood bank to activate the OB massive transfusion protocol.'
    '(개시 결정은 집도의·마취과, 순환간호사는 혈액은행에 알림 — 묶음 4 K1 확정 꼴; 검토 A K4); +w-call·w-bloodbank 태그(16.1·16.3에 있음)')
check_new(s)

swap_set(16, T, 1, o,
         who='순환간호사 → 수술팀 · 개시 알림',
         wrong_before="I'll ask the blood bank if they have a few extra bags.",
         options=['Calling the blood bank to activate the OB massive transfusion protocol.',
                  "I'll ask the blood bank if they have a few extra bags.",
                  "Let's see if she keeps bleeding first."],
         answer='Calling the blood bank to activate the OB massive transfusion protocol.',
         notes={
             'Calling the blood bank to activate the OB massive transfusion protocol.': '누구에게 무엇을 위해 연락하는지 밝혀서, 팀이 프로토콜이 가동되고 있음을 바로 안다.',
             "I'll ask the blood bank if they have a few extra bags.": '몇 팩 더 묻는 일반 요청이라 혈액은행이 긴급 절차인지 알 수 없다.',
             "Let's see if she keeps bleeding first.": '대량 출혈에서 지켜보며 기다리면 혈액이 늦게 온다.',
         },
         why=('개시 결정은 집도의와 마취과가 하고, 순환간호사는 혈액은행에 전화해 프로토콜 이름으로 개시를 알려요. 그 연락을 하고 있다고 팀에 말하면 '
              "모두 같은 절차를 떠올려요. '몇 팩 더'처럼 에둘러 말하면 일반 요청으로 들려요."),
         ko='산과 대량수혈 프로토콜을 개시하려고 혈액은행에 전화하고 있어요.')

order_line(16, T, 0, o, {'en': s['en'], 'ko': '산과 대량수혈 프로토콜을 개시하려고 혈액은행에 전화해요', 'note': '연락'})
order_why(16, T,
          '프로토콜을 개시하고, 혈액은행이 팩을 보내는 상황을 알리고, 그 팩 말고도 더 요청하고, 추가로 요청한 팩까지 추적해요. '
          'for it·beyond those·the extra ones I called for가 앞 줄을 가리켜요.',
          '혈액은행에 전화해 프로토콜을 개시하고, 혈액은행이 팩을 보내는 상황을 알리고, 그 팩 말고도 더 요청하고, 추가로 요청한 팩까지 추적해요. '
          'for it·beyond those·the extra ones I called for가 앞 줄을 가리켜요.')

# 1-5. K5 다중 위기 동시 대응 [20] 문장 0 — 수혈 투여는 마취과, 순환간호사는 조율
T = '다중 위기 동시 대응'
o = "You take the airway, I'll manage the transfusion."
OLD.append(o)
s = replace(doc, CH, 20, T, 0, o, {
    'en': "You take the airway, I'll coordinate the transfusion.",
    'ko': '선생님이 기도를 맡으시면 저는 수혈을 조율할게요.',
    'chunks': ['You take', 'the airway', ", I'll coordinate", 'the transfusion', '.'],
    'words': ['w-airway', 'w-transfusion'],
    'why': ("You take …, I'll …처럼 두 사람의 몫을 쉼표로 나란히 말하면 누가 무엇을 하는지 한 번에 정리돼요. "
            'coordinate는 혈액은행 연락·제제 확인·쿨러 관리로 수혈이 끊기지 않게 맞춘다는 뜻이고, 투여는 마취과가 해요.'),
}, ['en', 'ko', 'chunks', 'words'],
    "You take the airway, I'll manage the transfusion → You take the airway, I'll coordinate the transfusion."
    '(수혈 투여는 마취과, 순환간호사는 혈액 조율; 검토 A K5); -w-manage 태그(20.3에 남음, example도 20.3)')
check_new(s)
assert word(doc, 'w-manage')['example'] == "I'll manage the blood products while you handle the bleeding."
sl = sit(doc, 20, T)['nuance'][0]
assert sl['kind'] == 'slider' and sl['scale'][2] == "You take the airway, I'll manage the transfusion" and sl['answerAt'] == 2
sl['scale'][2] = "You take the airway, I'll coordinate the transfusion"
sl['example'], sl['exKo'] = s['en'], s['ko']
sl['words'] = ['w-airway', 'w-transfusion']
NOTE.append({'kind': 'nuance', 'situation': T, 'index': 0, 'fields': ['scale[2]', 'example', 'exKo', 'words'],
             'why': '정답 칸·예문이 바꾼 20.0 — manage가 빠져 words에서 w-manage도 뺌'})
order_line(20, T, 1, "With roles assigned, you take the airway, I'll manage the transfusion.",
           {'en': "With roles assigned, you take the airway, I'll coordinate the transfusion.",
            'ko': '역할이 정해졌으니 선생님은 기도를, 저는 수혈 조율을 맡을게요'})

# 1-6. K6 혈액 확보 확인 [3] 문장 1 — '몇 분 안'은 간호사가 보장할 수 없음 → 출처를 밝힘
T = '혈액 확보 확인'
o = 'Blood bank can send more within minutes.'
OLD.append(o)
s = replace(doc, CH, 3, T, 1, o, {
    'en': 'Blood bank says they can send more within minutes.',
    'ko': '혈액은행에서 몇 분 안에 더 보낼 수 있다고 해요.',
    'chunks': ['Blood bank says', 'they can send', 'more', 'within minutes', '.'],
    'words': ['w-bloodbank', 'w-send'],
    'why': ('Blood bank says …로 출처를 밝혀, 몇 분이라는 시간이 간호사의 보장이 아니라 혈액은행의 말임을 알려요. '
            'can send more는 보낼 수 있다는 뜻이라 아직 요청 전임을 보여 줘요.'),
    'distractorsKo': ['혈액은행에서 몇 분 안에 더 찾을 수 있다고 해요.',
                      '혈액은행에서 몇 분 안에 더 보관할 수 있다고 해요.'],
}, ['en', 'ko', 'chunks'],
    'Blood bank can send more within minutes → Blood bank says they can send more within minutes.'
    "('몇 분 안'은 병원·제제마다 달라 간호사가 보장할 수 없음 — 출처를 밝힘; 검토 A K6)")
check_new(s)
order_line(3, T, 1, o, {'en': s['en'], 'ko': '혈액은행에서 몇 분 안에 더 보낼 수 있다고 해요'})
order_why(3, T,
          '지금 있는 양을 말하고, 더 보낼 수 있다고 알리고, 그 연락선을 열어 두겠다고 한 뒤, 팩이 들어갈 때마다 그 연락선을 갱신해요. more·them·that line이 앞 줄을 가리켜요.',
          '지금 있는 양을 말하고, 혈액은행이 더 보낼 수 있다고 한 말을 전하고, 그 연락선을 열어 두겠다고 한 뒤, 팩이 들어갈 때마다 그 연락선을 갱신해요. '
          'more·them·that line이 앞 줄을 가리켜요.')

# ── 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-or-emergency-open-A.md §9 끝 목록 ─────
# 16.0은 위 1에서 새 문장으로 잘랐다.
recut(2, '대량 흡인 준비', 2, "Say the word and I'll swap them out fast.",
      ['Say the word', "and I'll", 'swap them out', 'fast', '.'], {'decoy': 'wash them out'})
recut(5, '긴급 팀 소집', 2, 'Anesthesia backup is on the way.',
      ['Anesthesia backup', 'is', 'on the way', '.'], {'decoy': 'on the phone'})
recut(7, '응급 제왕 신생아 준비', 1, 'Neonatal resuscitation supplies are set up.',
      ['Neonatal resuscitation supplies', 'are', 'set up', '.'], {'decoy': 'Adult resuscitation supplies'})
recut(9, '신속 마취 유도 협조', 1, 'Tell me when to apply and when to release.',
      ['Tell me', 'when to apply', 'and', 'when to release', '.'])
recut(10, '시간 압박 무균 유지', 0, 'Even in a rush, we protect the sterile field.',
      ['Even in a rush', ', we', 'protect', 'the sterile field', '.'])
recut(10, '시간 압박 무균 유지', 2, f"Watch your hands {DASH} I'll guide you in.",
      ['Watch your hands', f"{DASH} I'll", 'guide you in', '.'], {'decoy': 'Watch your head'})
recut(15, '개복 중 심정지', 2, "I'll run the code timing and call it out.",
      ["I'll run", 'the code timing', 'and', 'call it out', '.'])
recut(20, '다중 위기 동시 대응', 1, "Let's assign a role to each pair of hands.",
      ["Let's assign", 'a role', 'to', 'each pair of hands', '.'])

# ── 3. 남은 옛 문장·옛 주장 확인 ─────
check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['this is DIC.', 'I need FFP', 'manage the transfusion', 'Blood bank can send', "Let's pack and do",
            'Activating the OB', '이건 DIC', '개시하고 있어요.', '프로토콜을 개시해요', 'request all of that',
            '패킹과 임시 봉합을 제안', '수혈을 관리할게요', '더 보낼 수 있어요']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'or-emergency-open.yaml'))
append_changes(os.path.join(HERE, 'changes-or-emergency-open.yaml'), CH)
for n in NOTE:
    print('  note:', n)
print('or-emergency-open.yaml 저장')
