"""or-tourniquet — keyPhrase 5문장 교체(2026-11-17 OR 묶음 2 결정, '추천대로').
base-or-tourniquet.yaml → or-tourniquet.yaml"""
import io, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import kp_common
from kp_common import *  # noqa
kp_common.MARK = 'keyPhrase 교체(2026-11-17 사용자 결정)'

doc = load(os.path.join(HERE, 'base-or-tourniquet.yaml'))
CH = []
OLD = []


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert len(s['distractorsKo']) == 2 and s['ko'] not in s['distractorsKo']


def drop_word(wid, why):
    remove_word(doc, wid)
    CH.append({'kind': 'word-remove', 'id': wid, 'why': why})


def order_line(si, title, li, old_en, new):
    od = sit(doc, si, title)['order']
    l = od['lines'][li]
    assert l['en'] == old_en, (title, li, l['en'])
    l.update(new)
    assert len(l['en'].split()) <= 15, l['en']
    return od


# 1. 소아 압력 조정 [11] 문장 2 — AORN은 사지에 맞는 것 중 가장 넓은 커프를 권함(K1)
T = '소아 압력 조정'
o = 'We use the smallest appropriate cuff.'
OLD.append(o)
drop_word('w-small', '11.2 문장을 smallest → widest로 바꿔 어느 문장도 태그하지 않게 됨(w-wide는 4.3에 이미 있음)')
s = replace(doc, CH, 11, T, 2, o, {
    'en': 'We use the widest appropriate cuff.',
    'ko': '적절한 것 중 가장 넓은 커프를 써요.',
    'chunks': ['We use', 'the widest', 'appropriate cuff', '.'],
    'words': ['w-use', 'w-wide', 'w-appropriate', 'w-cuff'],
    'tag': '넓은 커프',
    'icon': 'bandage',
    'why': ('the widest appropriate cuff는 사지에 맞는 것 가운데 폭이 가장 넓은 것이라는 최상급이에요. '
            '넓을수록 더 낮은 압력으로 혈류를 막지만, appropriate가 한계라 아이 사지에 맞지 않는 큰 커프는 쓰지 않아요.'),
    'decoy': 'the brightest',
    'distractorsKo': ['적절한 것 중 가장 싼 커프를 써요.',
                      '적절한 것 중 가장 가벼운 커프를 써요.'],
    'blank': blank('widest', ['newest', 'cheapest', 'lightest']),
}, ['en', 'ko', 'chunks', 'words'],
    'We use the smallest appropriate cuff → We use the widest appropriate cuff(AORN은 사지에 맞는 것 중 가장 넓은 커프를 권함; 검토 A K1); '
    '−w-small 태그(word-remove) +w-wide 태그(4.3에 있음)')
check_new(s)
od = order_line(11, T, 2, "With the new number in hand, I'll choose the right cuff size.", {
    'en': "With the new number in hand, I'll choose the widest appropriate cuff.",
    'ko': '새 값이 있으니 알맞은 것 중 가장 넓은 커프를 고를게요',
})
assert od['why'] == ('소아 사지는 더 낮은 압력이 필요하다고 말하고, 아이 체구로 다시 계산하고, 새 값에 맞춰 알맞은 커프 크기를 고르고, '
                     '그 선택을 올리기 전에 함께 확인해요.'), od['why']
od['why'] = ('소아 사지는 더 낮은 압력이 필요하다고 말하고, 아이 체구로 다시 계산하고, 새 값에 맞춰 알맞은 것 중 가장 넓은 커프를 고르고, '
             '그 선택을 올리기 전에 함께 확인해요.')

# 2. 재적용 시간 관리 [13] 문장 0 — '안전 시간이 짧아진다'는 일반 규칙이 아님, resets shorter도 어색함(K2)
T = '재적용 시간 관리'
o = 'After reperfusion, the safe reinflation time resets shorter.'
OLD.append(o)
drop_word('w-short', '13.0 문장을 바꿔(resets shorter → we reset the timer) 어느 문장도 태그하지 않게 됨')
s = replace(doc, CH, 13, T, 0, o, {
    'en': 'After reperfusion, we reset the timer for reinflation.',
    'ko': '재관류 후에는 재적용 타이머를 다시 맞춰요.',
    'chunks': ['After reperfusion', ', we reset', 'the timer', 'for reinflation', '.'],
    'words': ['w-reperfusion', 'w-reset', 'w-reinflation'],
    'tag': '타이머 재설정',
    'icon': 'calendar',
    'why': ('After reperfusion,으로 기준 시점을 먼저 깔고, we reset the timer로 다시 올릴 구간의 시간을 처음부터 잰다고 알려요. '
            '앞 구간의 시간은 기록에 그대로 남겨요.'),
    'decoy': 'for the dressing',
    'distractorsKo': ['재관류 후에는 휴식 타이머를 다시 맞춰요.',
                      '재관류 후에는 사지에 피가 다시 돌아요.'],
    'blank': blank('reperfusion', ['intubation', 'induction', 'extubation']),
}, ['en', 'ko', 'chunks', 'words'],
    'After reperfusion, the safe reinflation time resets shorter → After reperfusion, we reset the timer for reinflation'
    "(재적용 안전 시간이 짧아진다는 것은 일반 규칙이 아니고 resets shorter도 어색함; 검토 A K2); −w-safe 태그(다른 문장에 남음) −w-short 태그(word-remove)")
check_new(s)
# w-reset — 새 문장은 타동사(we reset the timer)라 뜻·단서·오답 뜻을 '하다' 틀로
w = word(doc, 'w-reset')
assert w['ko'] == '재설정되다'
w['ko'] = '재설정하다'
w['cue'] = '시계나 값을 처음 상태로 되돌리는 일'
w['distractorsKo'] = ['연장하다', '누적하다']
CH.append({'kind': 'word', 'id': w['id'], 'fields': ['ko'],
           'why': '예문이 타동사 문장(we reset the timer)으로 바뀌어 뜻을 재설정되다 → 재설정하다로'})
od = sit(doc, 13, T)['order']
assert od['lines'][0]['en'] == s['en']           # 수정 단계에서 이미 새 문장으로 맞춰 둠
assert '짧' not in od['why'] and '짧' not in od['lines'][0]['ko']

# 3. 허용 시간 초과 임박 [15] 문장 0 — 감압은 집도의가 정함, 간호사는 시급함을 알리며 묻는다(K3)
T = '허용 시간 초과 임박'
o = 'We\'re at the maximum safe time — we need to deflate now.'
OLD.append(o)
DASH = '—'
s0 = sent(doc, 15, T, 0, o)
assert DASH in s0['en'] and s0['en'].split(DASH)[0] == "We're at the maximum safe time "
new_en = s0['en'].split(DASH)[0] + DASH + ' do we deflate now?'
s = replace(doc, CH, 15, T, 0, o, {
    'en': new_en,
    'ko': '최대 안전 시간에 왔어요 — 지금 공기를 뺄까요?',
    'chunks': ["We're at", 'the maximum safe time', DASH + ' do we deflate', 'now', '?'],
    'words': ['w-maximum', 'w-safe', 'w-deflate'],
    'tag': '감압 문의',
    'icon': 'siren',
    'why': ("We're at …으로 한계에 지금 왔다는 사실을 먼저 알리고, do we deflate now?로 감압 여부를 집도의에게 물어요. "
            '시급함은 분명히 말하되 공기를 뺄지는 집도의가 정해요.'),
    'decoy': 'the maximum tray size',
    'distractorsKo': ['최대 안전 시간에 왔어요 — 빼기 전에 마취과에 알릴까요?',
                      '최대 안전 시간에 왔어요 — 알람 소리 들리세요?'],
    'blank': blank('maximum', ['minimum', 'average', 'usual']),
}, ['en', 'ko', 'chunks'],
    "We're at the maximum safe time — we need to deflate now → … — do we deflate now?(감압은 집도의가 정함 — 간호사는 시급함을 알리며 묻는다; 검토 A K3)")
check_new(s)
assert s['en'] == "We're at the maximum safe time — do we deflate now?"

# 4. 허용 시간 초과 임박 [15] 문장 2 — 집도의에게 한계를 명령하지 않고 임박을 알린다(K4)
o = 'Surgeon, we cannot exceed this time.'
OLD.append(o)
s = replace(doc, CH, 15, T, 2, o, {
    'en': "Surgeon, we're about to exceed this time.",
    'ko': '집도의, 곧 이 시간을 초과해요.',
    'chunks': ['Surgeon', ", we're about to", 'exceed this time', '.'],
    'words': ['w-surgeon', 'w-exceed'],
    'tag': '초과 임박',
    'icon': 'siren',
    'why': ("Surgeon,으로 먼저 불러 누구에게 하는 말인지 분명히 해요. we're about to exceed는 곧 넘긴다는 사실을 알리는 말이라, "
            '한계는 분명히 전하고 다음 결정은 집도의가 내리게 해요.'),
    'decoy': 'enter this room',
    'distractorsKo': ['집도의, 곧 이 일정을 초과해요.',
                      '집도의, 이 시간을 넘기면 위험해요.'],
    'blank': blank('exceed', ['enter', 'move', 'open']),
}, ['en', 'ko', 'chunks'],
    'Surgeon, we cannot exceed this time → Surgeon, we\'re about to exceed this time(집도의에게 한계를 명령하지 않고 임박을 알림; 검토 A K4)')
check_new(s)
od = sit(doc, 15, T)['order']
assert [l['en'] for l in od['lines']] == [
    "We're at the maximum safe time.", "I'm telling the surgeon right away.",
    "The surgeon agrees we can't go past it, so we deflate now.", "Once it's down, I'll note that time."]

# 5. 재관류 대사 급변 [19] 문장 1 — labs drawn up은 어색함: 채혈(labs drawn)과 약 준비(meds drawn up)를 가름(K5)
T = '재관류 대사 급변'
o = 'Anesthesia, do you need labs or treatment drawn up?'
OLD.append(o)
drop_word('w-treatment', '19.1 문장을 바꿔(labs or treatment drawn up → labs drawn or meds drawn up) 어느 문장도 태그하지 않게 됨')
NEW19 = 'Anesthesia, do you need labs drawn or meds drawn up?'
KO19 = '마취과, 검사 채혈이나 약 준비가 필요하세요?'
# w-med — 새 문장의 meds를 가르칠 말(원형 헤드워드 med; OR 다른 주제 w-med와 같은 꼴)
idx = [i for i, w in enumerate(doc['words']) if w['id'] == 'w-draw'][0]
doc['words'].insert(idx + 1, {
    'id': 'w-med', 'en': 'med', 'ipa': '/mɛd/', 'ko': '약', 'icon': 'pill',
    'example': NEW19,
    'cue': '주사기에 재어 두거나 투여하는 약을 줄여 부르는 구어 — 흔히 복수로',
    'tag': '재관류',
    'distractorsEn': ['lab', 'pad'],
    'distractorsKo': ['붕대', '장갑'],
    'chips': [['med']],
    'decoyChips': ['mad'],
    'exKo': KO19,
})
CH.append({'kind': 'word-add', 'id': 'w-med',
           'why': '19.1 새 문장의 meds(약을 줄여 부르는 구어)를 가르칠 말 — w-treatment 대신'})
s = replace(doc, CH, 19, T, 1, o, {
    'en': NEW19,
    'ko': KO19,
    'chunks': ['Anesthesia', ', do you need', 'labs drawn', 'or meds drawn up', '?'],
    'words': ['w-anesthesia', 'w-lab', 'w-draw', 'w-med'],
    'tag': '검사·약 준비',
    'icon': 'stetho',
    'why': ('이름을 먼저 부르고 do you need …?로 상대 필요를 묻는 공손한 제안이에요. labs drawn은 검사용 피를 뽑는 것, '
            'meds drawn up은 약을 주사기에 재어 준비해 두는 것이라 draw 하나로 두 일을 가려 말해요.'),
    'decoy': 'or meds drawn on',
    'distractorsKo': ['마취과, 검사 채혈이나 약 준비를 언제 할까요?',
                      '마취과, 채혈하려고 검사 용기를 꺼내 둘까요?'],
    'blank': blank('labs', ['films', 'scans', 'consults']),
}, ['en', 'ko', 'chunks', 'words'],
    'Anesthesia, do you need labs or treatment drawn up → … labs drawn or meds drawn up(labs drawn up은 어색함 — 채혈과 약 준비를 가름; 검토 A K5); '
    '−w-treatment 태그(word-remove) −w-up 태그(drawn up의 up은 지혈대를 올린 상태를 뜻하는 w-up과 다름; 다른 문장에 남음) +w-med 태그(word-add)')
check_new(s)
# w-draw — 채혈(labs drawn)과 약 준비(meds drawn up)를 함께 가르치게 됨
w = word(doc, 'w-draw')
assert w['cue'] == '주사기에 약을 빨아올려 채워 두는 일'
w['cue'] = '주사기로 검사할 피를 뽑거나 약을 빨아올려 채워 두는 일'
od = order_line(19, T, 1, 'Anesthesia, do you need labs or treatment drawn up for it?', {
    'en': 'Anesthesia, do you need labs drawn or meds drawn up for it?',
    'ko': '마취과, 그에 맞춰 검사 채혈이나 약 준비가 필요하세요',
})
assert od['why'] == ('재관류 뒤 대사성 급증이 보인다고 알리고, 마취과에 검사나 치료제가 필요한지 묻고, 필요하면 바로 말해 달라고 하고, '
                     '어느 쪽이든 돕겠다고 해요.'), od['why']
od['why'] = ('재관류 뒤 대사성 급증이 보인다고 알리고, 마취과에 검사 채혈이나 약 준비가 필요한지 묻고, 필요하면 바로 말해 달라고 하고, '
             '어느 쪽이든 돕겠다고 해요.')

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['smallest', '가장 작은', '작은 커프', 'resets shorter', '더 짧게', '재설정돼요', 'cannot exceed', '초과할 수 없', '초과 불가',
            'need to deflate now', '빼야 해요', 'labs or treatment', '치료제', '검사와 치료제', 'w-small', 'w-short', 'w-treatment']:
    assert bad not in raw, bad
assert "I'll choose the right cuff size." not in raw
dump(doc, os.path.join(HERE, 'or-tourniquet.yaml'))
append_changes(os.path.join(HERE, 'changes-or-tourniquet.yaml'), CH)
print('or-tourniquet.yaml 저장')
