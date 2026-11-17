"""or-bleeding — keyPhrase 5문장 교체 + keyPhrase chunks 다시 자르기(2026-11-17 OR 묶음 4 결정, '추천대로').
base-or-bleeding.yaml → or-bleeding.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks
kp_common.MARK = 'keyPhrase 교체(2026-11-17 사용자 결정)'

doc = load(os.path.join(HERE, 'base-or-bleeding.yaml'))
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


def order_line(si, title, li, old_en, new):
    od = sit(doc, si, title)['order']
    l = od['lines'][li]
    assert l['en'] == old_en, (title, li, l['en'])
    l.update(new)
    NOTE.append({'kind': 'order', 'situation': title, 'line': li, 'fields': sorted(new)})


def order_why(si, title, old, new):
    od = sit(doc, si, title)['order']
    assert od['why'] == old, (title, od['why'])
    od['why'] = new
    NOTE.append({'kind': 'order', 'situation': title, 'fields': ['why']})


# ── 1. keyPhrase 문장 교체 ─────────────────────────────────────────────

# 1-1. 대량수혈 프로토콜 발동 [18] 문장 0 — 발동은 집도의·마취과가 정하고 순환 간호사는 혈액은행에 알림
T = '대량수혈 프로토콜 발동'
o = "I'm activating the massive transfusion protocol."
OLD.append(o)
s = replace(doc, CH, 18, T, 0, o, {
    'en': "I'm calling the blood bank to activate the massive transfusion protocol.",
    'ko': '대량수혈 프로토콜을 발동하려고 혈액은행에 전화하고 있어요.',
    'chunks': ["I'm calling", 'the blood bank', 'to activate', 'the massive transfusion protocol', '.'],
    'words': ['w-call', 'w-bloodbank', 'w-activate', 'w-massive', 'w-transfusion', 'w-protocol'],
    'tag': '발동 연락',
    'icon': 'siren',
    'why': ("I'm calling the blood bank to …로 누구에게 무엇을 위해 연락하는지 한 번에 알려요. "
            '발동은 집도의·마취과가 정하고, 순환 간호사는 그 결정을 받아 혈액은행에 전화해 프로토콜을 가동시켜요.'),
    'decoy': 'the malignant hyperthermia protocol',
    'distractorsKo': ['대량수혈 프로토콜은 제제를 정해진 비율로 묶어 보내 줘요.',
                      '대량수혈 프로토콜이 발동되면 혈액은행이 쿨러를 차례로 보내요.'],
    'blank': blank('activate', ['draft', 'rewrite', 'archive']),
}, ['en', 'ko', 'chunks', 'words'],
    "I'm activating the massive transfusion protocol → I'm calling the blood bank to activate the massive transfusion protocol."
    '(발동 결정은 집도의·마취과, 간호사는 혈액은행에 발동을 알림; 검토 A K1); +w-call·w-bloodbank 태그(17.1·17.4에 있음)')
check_new(s)
order_line(18, T, 0, o, {'en': s['en'], 'ko': '대량수혈 프로토콜을 발동하려고 혈액은행에 전화하고 있어요', 'note': '연락'})
order_why(18, T,
          '프로토콜을 발동하고, 첫 쿨러가 오고 있다고 알리고, 도착하면 단위를 기록하며 수량을 맞추고, 그동안 다음 쿨러가 곧 온다고 맺는 순서예요.',
          '혈액은행에 전화해 프로토콜을 가동하고, 첫 쿨러가 오고 있다고 알리고, 도착하면 단위를 기록하며 수량을 맞추고, 그동안 다음 쿨러가 곧 온다고 맺는 순서예요.')

# 1-2. 혈압 급강하 순환 허탈 [16] 문장 0 — 승압제는 마취과가 투여, 간호사는 그 상태를 알림
T = '혈압 급강하 순환 허탈'
o = f'Pressure has crashed {DASH} pushing pressors now.'
OLD.append(o)
s = replace(doc, CH, 16, T, 0, o, {
    'en': f'Pressure has crashed {DASH} anesthesia is pushing pressors now.',
    'ko': '혈압이 급강하했어요 — 마취과가 지금 승압제를 투여하고 있어요.',
    'chunks': ['Pressure has crashed', f'{DASH} anesthesia', 'is pushing pressors', 'now', '.'],
    'words': ['w-pressure', 'w-crash', 'w-push', 'w-pressor'],
    'tag': '위기 보고',
    'icon': 'siren',
    'why': ('현재완료 has crashed로 이미 벌어진 결과를 먼저 알리고, 대시 뒤에 누가 무엇을 하고 있는지(anesthesia is pushing pressors)를 덧붙여요. '
            '승압제는 마취과가 투여하니, 간호사는 그 사실을 팀에 전하는 쪽이에요.'),
    'decoy': 'Pressure has expired',
    'distractorsKo': ['혈압이 급강하했어요 — 알람이 울리기 직전까지는 안정적이었어요.',
                      '혈압이 급강하하면 뇌와 심장으로 가는 혈류가 금세 부족해져요.'],
    'blank': blank('crashed', ['spiked', 'settled', 'normalized']),
}, ['en', 'ko', 'chunks'],
    'Pressure has crashed — pushing pressors now → Pressure has crashed — anesthesia is pushing pressors now.'
    '(승압제 투여는 마취과 — 간호사가 투여하는 말로 읽힘; 검토 A K2)')
check_new(s)
order_line(16, T, 0, o, {'en': s['en'], 'ko': '혈압이 급강하해서 마취과가 승압제를 투여하고 있어요'})
order_line(16, T, 3, "Once you do, I'll start easing off the pressors.",
           {'en': "Once you do, I'll tell anesthesia so they can ease off the pressors.",
            'ko': '그러면 마취과에 알려 승압제를 줄일 수 있게 할게요', 'note': '전달'})
order_why(16, T,
          '혈압 저하와 승압제 투여를 알리고, 동시에 수액을 열었다고 말하고, 그 모든 것이 돌아가는 중에 출혈이 잡히면 알려 달라고 한 뒤, 잡히면 승압제를 줄여 가는 순서예요.',
          '혈압 급강하와 마취과의 승압제 투여를 알리고, 동시에 수액이 열려 있다고 말하고, 그 모든 것이 돌아가는 중에 출혈이 잡히면 알려 달라고 한 뒤, '
          '잡히면 마취과에 알려 승압제를 줄일 수 있게 하는 순서예요. 승압제를 줄이는 것도 마취과가 정해요.')

# 1-3. 수액로 개통 확인 [5] 문장 1 — '필요하면'인데 이미 최대로 흐르는 중이라는 말 → 준비해 둔 상태
T = '수액로 개통 확인'
o = "I've got fluids running wide open if we need it."
OLD.append(o)
s = replace(doc, CH, 5, T, 1, o, {
    'en': "I've got fluids ready to run wide open if we need it.",
    'ko': '필요하면 수액을 완전히 열어 흘릴 수 있게 준비해 뒀어요.',
    'chunks': ["I've got fluids", 'ready to run', 'wide open', 'if we need it', '.'],
    'words': ['w-fluid', 'w-run', 'w-wide', 'w-open'],
    'tag': '수액 대기',
    'icon': 'pill',
    'why': ('ready to run은 아직 흘리지 않고 언제든 열 수 있게 준비해 뒀다는 뜻이고, wide open은 조절기를 끝까지 연 최대 속도예요. '
            'if we need it으로 그 속도는 필요할 때를 위한 대비임을 밝혀요.'),
    'decoy': 'at room temperature',
    'distractorsKo': ['필요하면 수액을 데워서 흘릴 수 있게 준비해 뒀어요.',
                      '필요하면 수액을 한 병 더 걸 수 있게 준비해 뒀어요.'],
    'blank': blank('wide', ['half', 'slightly', 'partly']),
}, ['en', 'ko', 'chunks'],
    "I've got fluids running wide open if we need it → I've got fluids ready to run wide open if we need it."
    "('필요하면'인데 이미 최대 속도로 흐른다는 말이라 뜻이 어긋남; 검토 A K5)")
check_new(s)
od = sit(doc, 5, T)['order']
assert od['lines'][1]['en'] == s['en'], od['lines'][1]

# 1-4. 응고병증 발생 [17] 문장 0 — 진단·혈액제제 결정은 마취과, 간호사는 관찰을 말하고 묻는다
T = '응고병증 발생'
o = f"He's coagulopathic {DASH} I need FFP and platelets now."
s = replace(doc, CH, 17, T, 0, o, {
    'en': f'He looks coagulopathic {DASH} do you want FFP and platelets now?',
    'ko': '응고병증이 있어 보여요 — 지금 FFP와 혈소판이 필요하세요?',
    'chunks': ['He looks coagulopathic', f'{DASH} do you want', 'FFP and platelets', 'now', '?'],
    'words': ['w-coagulopathic', 'w-ffp', 'w-platelet'],
    'tag': '제제 확인',
    'icon': 'siren',
    'why': ('He looks …로 본 것을 완곡하게 말하고, 대시 뒤 do you want …?로 혈액제제를 정하는 마취과에게 물어요. '
            '진단과 주문은 마취과가 정하고, 간호사는 답을 듣는 대로 혈액은행에 연결해요.'),
    'decoy': 'He looks complicated',
    'distractorsKo': ['응고병증이 있어 보여요 — FFP와 혈소판이 혈액은행에 있나요?',
                      '응고병증이 있어 보여요 — 지금 FFP와 혈소판이 도착했나요?'],
    'blank': blank('coagulopathic', ['hypoglycemic', 'hypoxemic', 'febrile']),
}, ['en', 'ko', 'chunks'],
    "He's coagulopathic — I need FFP and platelets now → He looks coagulopathic — do you want FFP and platelets now?"
    '(진단과 혈액제제 요구는 마취과의 말 — 간호사는 관찰을 말하고 묻는다; 검토 A K3)')
check_new(s)
order_line(17, T, 0, o, {'en': s['en'], 'ko': '응고병증이 있어 보여요 — 지금 FFP와 혈소판이 필요하세요?', 'note': '질문'})
# 첫 줄이 질문이 되어 둘째 줄 'more platelets and cryo'가 '예'를 전제함 → 답을 조건으로 받는 줄로
order_line(17, T, 1, "I'll call the blood bank for more platelets and cryo.",
           {'en': "If you do, I'll call the blood bank for them right away.",
            'ko': '그러시면 바로 혈액은행에 전화할게요'})
order_why(17, T,
          '응고병증을 알리며 제제를 요청하고, 혈액은행에 더 요청하고, 제제가 오면 지혈과 함께 교정한 뒤, 끝나면 응고 수치를 다시 확인하는 순서예요.',
          '응고병증이 보인다고 알리며 제제가 필요한지 묻고, 그렇다면 혈액은행에 바로 전화하고, 제제가 오면 지혈과 함께 교정한 뒤, 끝나면 응고 수치를 다시 확인하는 순서예요.')
# context 17.1 첫 장면(마취과 → 순환 간호사)은 옛 문장 그대로 둔다 — 마취과의 말이라 범위 문제가 아님
ctx = sit(doc, 17, T)['nuance'][1]
assert ctx['kind'] == 'context' and ctx['scenes'][0]['who'] == '마취과 → 순환 간호사' and ctx['scenes'][0]['en'] == o

# 1-5. 지혈 불가 손상통제 [19] 문장 0 — 손상통제 전환은 집도의 결정, 제안으로
T = '지혈 불가 손상통제'
o = "Let's pack and shift to damage control."
OLD.append(o)
s = replace(doc, CH, 19, T, 0, o, {
    'en': 'Should we pack and shift to damage control?',
    'ko': '패킹하고 손상통제로 전환할까요?',
    'chunks': ['Should we pack', 'and shift', 'to damage control', '?'],
    'words': ['w-pack', 'w-shift', 'w-damagecontrol'],
    'tag': '전환 제안',
    'icon': 'siren',
    'why': ('Should we …?로 물어, 손상통제로 넘어갈지 정하는 집도의에게 전환을 제안해요. '
            'pack and shift로 먼저 패킹하고 방침을 바꾼다는 두 단계를 and로 이어요.'),
    'decoy': 'to a laparoscopic approach',
    'distractorsKo': ['손상통제는 수술을 짧게 끝내는 건가요?',
                      '패킹하기 전에 거즈를 더 꺼내 둘까요?'],
    'blank': blank('pack', ['irrigate', 'drape', 'scrub']),
}, ['en', 'ko', 'chunks'],
    "Let's pack and shift to damage control → Should we pack and shift to damage control?(손상통제 전환은 집도의 결정 — 제안으로; 검토 A K4)")
check_new(s)
# 셋째 줄이 질문이면 넷째 줄 'After that, the plan is…'가 '예'를 전제함 → 평서문으로, 앞 줄(임시 폐쇄 준비)을 가리켜 순서를 못 박음
order_line(19, T, 2, o, {'en': "Once that's ready, we'll pack and shift on the surgeon's call.",
                         'ko': '준비되면 집도의 결정에 따라 패킹하고 전환해요'})
order_why(19, T,
          '지혈이 안 되면 전환할 수도 있다는 기준을 말하고, 그 경우를 대비해 임시 폐쇄 물품을 준비하고, 패킹하며 전환한 뒤, 그다음 계획으로 중환자실 소생을 말하는 순서예요.',
          '지혈이 안 되면 전환할 수도 있다는 기준을 말하고, 그 경우를 대비해 임시 폐쇄 물품을 준비하고, 준비되면 집도의 결정에 따라 패킹하고 전환한 뒤, '
          '그다음 계획으로 중환자실 소생을 말하는 순서예요.')

# ── 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-or-bleeding-A.md K6 ─────
# 18.0은 위 1에서 새 문장으로 잘랐다.
recut(2, '거즈 무게 출혈 추정', 1, "Dry weight subtracted, that's about 150 milliliters.",
      ['Dry weight subtracted', ", that's", 'about 150 milliliters', '.'])
recut(6, '출혈량 증가 추세 보고', 2, 'Do you want me to alert anesthesia and get blood ready?',
      ['Do you want me', 'to alert anesthesia', 'and get blood', 'ready', '?'])
recut(7, '국소 지혈제 적용', 1, 'Let me pack it against the bleeding surface.',
      ['Let me', 'pack it', 'against the bleeding surface', '.'], {'decoy': 'against the instrument tray'})
recut(7, '국소 지혈제 적용', 2, 'Hold pressure while it sets up.',
      ['Hold pressure', 'while', 'it sets up', '.'], {'decoy': 'it warms up'})
recut(12, '세포회수기 사용', 1, 'We can salvage and return his own red cells.',
      ['We can', 'salvage', 'and return', 'his own red cells', '.'], {'decoy': 'the donor red cells'})
recut(15, '급성 대량 출혈', 1, "Second suction coming, and I've got more lap pads.",
      ['Second suction', 'coming', ", and I've got", 'more lap pads', '.'], {'decoy': 'more basins'})
recut(16, '혈압 급강하 순환 허탈', 1, 'Volume wide open through both lines and the warmer.',
      ['Volume', 'wide open', 'through both lines', 'and the warmer', '.'])
recut(18, '대량수혈 프로토콜 발동', 2, "I'll track units in and keep the counts straight.",
      ["I'll track", 'units in', 'and keep', 'the counts straight', '.'], {'decoy': 'the drapes straight'})
recut(20, '심정지 임박 출혈', 0, f"He's about to arrest {DASH} crash cart at the bedside.",
      ["He's", 'about to arrest', f'{DASH} crash cart', 'at the bedside', '.'], {'decoy': 'about to vomit'})

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
old17 = f"He's coagulopathic {DASH} I need FFP and platelets now."
assert raw.count(old17) == 1, raw.count(old17)   # context 17.1 마취과 장면 하나만
for bad in ["I'm activating", f'{DASH} pushing pressors now', 'running wide open if', "Let's pack and shift", "I'll start easing off",
            '혈액은행에 더 요청하고', '프로토콜을 발동하고,']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'or-bleeding.yaml'))
append_changes(os.path.join(HERE, 'changes-or-bleeding.yaml'), CH)
for n in NOTE:
    print('  note:', n)
print('or-bleeding.yaml 저장')
