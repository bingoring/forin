"""or-difficult-airway — keyPhrase 8문장 교체 + keyPhrase chunks 다시 자르기(2026-11-17 OR 묶음 3 결정, '추천대로').
base-or-difficult-airway.yaml → or-difficult-airway.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks
kp_common.MARK = 'keyPhrase 교체(2026-11-17 사용자 결정)'

doc = load(os.path.join(HERE, 'base-or-difficult-airway.yaml'))
CH = []
OLD = []
DASH = '—'


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert len(s['distractorsKo']) == 2 and s['ko'] not in s['distractorsKo']
    assert meaningful_chunks(s['chunks']) >= min_chunks_for(s['en']), (s['en'], s['chunks'])
    assert not dangling_chunks(s['chunks']), s['chunks']


def drop_word(wid, why):
    remove_word(doc, wid)
    CH.append({'kind': 'word-remove', 'id': wid, 'why': why})


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


# ── 1. keyPhrase 문장 교체 ─────────────────────────────────────────────

# 1-1. 예측 어려운 기도 계획 [6] 문장 0 — 안은 마취과가 정함, 간호사는 같이 짚어 본다
T = '예측 어려운 기도 계획'
o = "Let's define plan A, B, and C before induction."
OLD.append(o)
drop_word('w-define', '6.0 문장을 define → go over로 바꿔 어느 문장도 태그하지 않게 됨')
s = replace(doc, CH, 6, T, 0, o, {
    'en': "Let's go over plan A, B, and C before induction.",
    'ko': '유도 전에 계획 A, B, C를 같이 짚어 봐요.',
    'chunks': ["Let's", 'go over', 'plan A, B, and C', 'before induction', '.'],
    'words': ['w-plan', 'w-induction'],
    'tag': '계획 공유',
    'icon': 'compass',
    'why': ("go over는 하나씩 함께 짚어 본다는 구동사라, 마취과가 세운 안을 팀이 같이 듣고 맞춰 보는 말이 돼요. "
            'A, B, C를 유도 전에 한꺼번에 짚어 두면 하나가 실패해도 그 자리에서 의논하느라 시간을 쓰지 않아요.'),
    'decoy': 'the consent form',
    'distractorsKo': ['유도 전에 역할 A, B, C를 같이 짚어 봐요.',
                      '유도 전에 계획 A, B, C를 같이 외워 봐요.'],
    'blank': blank('induction', ['transport', 'discharge', 'handoff']),
}, ['en', 'ko', 'chunks', 'words'],
    "Let's define plan A, B, and C before induction → Let's go over plan A, B, and C before induction"
    '(간호사가 안을 정하는 말로 읽힘 — 안은 마취과가 정하고 팀이 같이 짚어 봄; slider 예문과 같은 문장; 검토 A); −w-define 태그(word-remove)')
check_new(s)
od = sit(doc, 6, T)['order']
l0 = od['lines'][0]
assert l0['en'] == o and l0['note'] == '정의', l0
l0.update({'en': s['en'], 'ko': '유도 전에 계획 A, B, C를 같이 짚어 봐요', 'note': '검토'})
assert od['why'].startswith('계획 A, B, C를 먼저 정하고,'), od['why']
od['why'] = od['why'].replace('계획 A, B, C를 먼저 정하고,', '계획 A, B, C를 먼저 같이 짚어 보고,', 1)
assert [l['note'] for l in od['lines']] == ['검토', '전환', '확인', '공유']

# 1-2. 산소화 우선 원칙 [12] 문장 0 — 백 환기는 마취과가 정함, 근거를 대며 묻는다
T = '산소화 우선 원칙'
o = "Oxygenation comes before intubation — let's bag him."
OLD.append(o)
s = replace(doc, CH, 12, T, 0, o, {
    'en': 'Oxygenation comes before intubation — can we bag him?',
    'ko': '산소화가 삽관보다 우선이에요 — 백을 짜서 환기할까요?',
    'chunks': ['Oxygenation comes', 'before intubation', DASH + ' can we bag him', '?'],
    'words': ['w-oxygenation', 'w-intubation', 'w-bag'],
    'tag': '우선 제안',
    'icon': 'siren',
    'why': ('comes before는 어느 쪽이 먼저인지 한 번에 정리하는 구예요. 대시 뒤를 can we …?로 물어, '
            '환기할지 정하는 마취과에게 원칙을 근거로 제안해요.'),
    'decoy': 'before the incision',
    'distractorsKo': ['산소화가 수술보다 우선이에요 — 백을 짜서 환기할까요?',
                      '산소화가 삽관보다 우선이에요 — 환기하려고 백을 연결할까요?'],
    'blank': blank('bag', ['tube', 'turn', 'move']),
}, ['en', 'ko', 'chunks'],
    "Oxygenation comes before intubation — let's bag him → … — can we bag him?(처치를 간호사가 지시하는 말이고 같은 상황 swap의 '지시 말투 ✕'와 어긋남; 검토 A)")
check_new(s)

# 1-3. 예상외 어려운 기도 [18] 문장 1 — 실패 기도 전환은 마취과가 정함, 제안으로
T = '예상외 어려운 기도'
o = "Let's switch to the failed airway algorithm now."
OLD.append(o)
s = replace(doc, CH, 18, T, 1, o, {
    'en': 'Should we switch to the failed airway algorithm now?',
    'ko': '지금 실패 기도 알고리즘으로 전환할까요?',
    'chunks': ['Should we', 'switch', 'to the failed airway algorithm', 'now', '?'],
    'words': ['w-switch', 'w-fail', 'w-airway', 'w-algorithm'],
    'tag': '전환 제안',
    'icon': 'compass',
    'why': ('Should we …?로 물어, 실패 기도로 넘어갈지 정하는 마취과에게 전환을 제안해요. '
            'failed airway algorithm은 기도 확보가 실패했을 때 따르도록 정해 둔 절차이고, now가 미룰 수 없다는 뜻을 더해요.'),
    'decoy': 'to the sedation checklist',
    'distractorsKo': ['지금 실패 기도로 전환하려고 카드를 꺼낼까요?',
                      '지금 시야가 예상보다 훨씬 나쁜가요?'],
    'blank': blank('failed', ['routine', 'usual', 'normal']),
}, ['en', 'ko', 'chunks'],
    "Let's switch to the failed airway algorithm now → Should we switch to the failed airway algorithm now?(실패 기도 전환은 마취과가 결정함; 검토 A)")
check_new(s)
od = sit(doc, 18, T)['order']
assert od['lines'][2]['en'] == 'That means anesthesia is switching to the failed airway algorithm now.'

# 1-4. CICO 상황 [15] 문장 1 — FONA는 마취과가 정함, 간호사는 복창
T = 'CICO 상황'
o = 'We move to emergency front-of-neck access now.'
OLD.append(o)
s = replace(doc, CH, 15, T, 1, o, {
    'en': f"Understood {DASH} we're moving to emergency front-of-neck access now.",
    'ko': '알겠습니다 — 지금 응급 전경부 접근으로 넘어가요.',
    'chunks': ['Understood', f"{DASH} we're moving", 'to emergency front-of-neck access', 'now', '.'],
    'words': ['w-move', 'w-emergency', 'w-frontofneck', 'w-access'],
    'tag': '전환 복창',
    'icon': 'siren',
    'why': ("Understood로 마취과의 결정을 받았다고 먼저 알리고, 같은 말을 되풀이해 팀 전체가 같은 단계를 듣게 해요. "
            "we're moving은 지금 넘어가는 중이라는 진행형이고, emergency가 계획된 처치가 아님을 밝혀요."),
    'decoy': 'to the airway cart',
    'distractorsKo': ['알겠습니다 — 전경부 접근으로 넘어가려고 목을 펴요.',
                      '알겠습니다 — 산소화가 안 되면 곧 뇌가 손상돼요.'],
    'blank': blank('emergency', ['routine', 'elective', 'planned']),
}, ['en', 'ko', 'chunks'],
    "We move to emergency front-of-neck access now → Understood — we're moving to emergency front-of-neck access now.(FONA는 마취과가 결정 — 복창으로; 검토 A)")
check_new(s)
od = sit(doc, 15, T)['order']
assert od['lines'][1]['en'] == 'So anesthesia is moving to emergency front-of-neck access now.'

# 1-5. 기도 완전 폐쇄 [19] 문장 1 — 같은 이유로 복창
T = '기도 완전 폐쇄'
o = 'We go straight to front-of-neck access.'
OLD.append(o)
s = replace(doc, CH, 19, T, 1, o, {
    'en': f"Understood {DASH} we're going straight to front-of-neck access.",
    'ko': '알겠습니다 — 곧장 전경부 접근으로 가요.',
    'chunks': ['Understood', f"{DASH} we're going straight", 'to front-of-neck access', '.'],
    'words': ['w-straight', 'w-frontofneck', 'w-access'],
    'tag': '전환 복창',
    'icon': 'siren',
    'why': ('Understood로 마취과의 결정을 받았다고 알리고 같은 말로 복창해요. go straight to는 중간 단계를 건너뛴다는 뜻이라, '
            '완전 폐쇄에서는 다른 방법을 먼저 해 볼 시간이 없다는 의미를 담아요.'),
    'decoy': 'to the dressing change',
    'distractorsKo': ['알겠습니다 — 전경부로 가려고 머리를 젖혀요.',
                      '알겠습니다 — 완전 폐쇄면 위로는 길이 없어요.'],
    'blank': blank('access', ['x-ray', 'exam', 'massage']),
}, ['en', 'ko', 'chunks'],
    "We go straight to front-of-neck access → Understood — we're going straight to front-of-neck access.(FONA는 마취과가 결정 — 복창으로; 검토 A)")
check_new(s)
od = sit(doc, 19, T)['order']
assert od['lines'][1]['en'] == 'So anesthesia is going straight to front-of-neck access.'

# 1-6. 응급 윤상갑상막절개 [16] 문장 1 — 후두를 잡는 것은 시술자의 손; 간호사는 머리와 목을 고정
T = '응급 윤상갑상막절개'
o = "I'll stabilize the larynx for you."
OLD.append(o)
drop_word('w-larynx', '16.1 문장을 the larynx → his head and neck으로 바꿔 어느 문장도 태그하지 않게 됨')
s = replace(doc, CH, 16, T, 1, o, {
    'en': "I'll stabilize his head and neck for you.",
    'ko': '머리와 목을 고정해 드릴게요.',
    'chunks': ["I'll stabilize", 'his head and neck', 'for you', '.'],
    'words': ['w-stabilize', 'w-neck'],
    'tag': '머리 고정',
    'icon': 'handshake2',
    'why': ("I'll stabilize는 부탁받기 전에 내가 먼저 맡겠다는 약속이에요. 후두를 잡는 것은 시술자의 손이라, "
            '간호사는 머리와 목이 움직이지 않게 잡아 절개 자리를 지켜 줘요.'),
    'decoy': 'his arms and hands',
    'distractorsKo': ['머리와 목을 고정하려고 수건을 대요.',
                      '목이 흔들리면 막을 놓쳐요.'],
    'blank': blank('neck', ['wrist', 'knee', 'ankle']),
}, ['en', 'ko', 'chunks', 'words'],
    "I'll stabilize the larynx for you → I'll stabilize his head and neck for you(후두를 잡는 것은 시술자의 손 동작; 검토 A); "
    '−w-larynx 태그(word-remove) +w-neck 태그(0.2·10.0에 있음)')
check_new(s)
od = sit(doc, 16, T)['order']
assert od['lines'][1]['en'] == "While you hold it, I'll stabilize his head and neck for you."

# 1-7. 저산소 서맥 진행 [17] 문장 2 — 부자연스럽고 지시하는 말 → 간호사가 하는 일을 알림
T = '저산소 서맥 진행'
o = 'Push the airway rescue and prep for code.'
OLD.append(o)
drop_word('w-push', '17.2 문장을 바꿔(Push the airway rescue → I\'m prepping for a code) 어느 문장도 태그하지 않게 됨')
s = replace(doc, CH, 17, T, 2, o, {
    'en': f"I'm prepping for a code {DASH} the crash cart is coming.",
    'ko': '코드에 대비하고 있어요 — 크래시 카트가 오고 있어요.',
    'chunks': ["I'm prepping", 'for a code', f'{DASH} the crash cart', 'is coming', '.'],
    'words': ['w-prep', 'w-code', 'w-cart'],
    'tag': '코드 대비',
    'icon': 'siren',
    'why': ("I'm prepping은 지금 대비하고 있다는 진행형이라, 산소화에 매달린 팀에게 내가 맡은 일을 알려요. "
            '대시 뒤 the crash cart is coming으로 카트가 이미 오는 중이라는 상태를 덧붙여요.'),
    'decoy': 'for a transfer',
    'distractorsKo': ['코드에 대비하려고 제세동 패드를 미리 꺼내요.',
                      '코드에 대비하고 있어요 — 맥박이 계속 느려지고 있어요.'],
    'blank': blank('crash', ['linen', 'supply', 'isolation']),
}, ['en', 'ko', 'chunks', 'words'],
    "Push the airway rescue and prep for code → I'm prepping for a code — the crash cart is coming.(영어가 부자연스럽고 지시하는 말이며 관사가 빠짐; 검토 A); "
    '−w-push 태그(word-remove) −w-airway·w-rescue 태그(다른 문장에 남음) +w-cart 태그(다른 상황에 있음)')
check_new(s)
od = sit(doc, 17, T)['order']
assert od['lines'][2]['en'] == f"So I'm prepping for a code {DASH} the crash cart is coming."

# 1-8. 후두마스크 구조 환기 [8] 문장 0 — LMA를 건네는 쪽이 간호사
T = '후두마스크 구조 환기'
o = f"Hand me the LMA {DASH} we're rescuing the airway."
OLD.append(o)
s = replace(doc, CH, 8, T, 0, o, {
    'en': f"Here's the LMA {DASH} we're rescuing the airway.",
    'ko': '후두마스크 여기 있어요 — 기도를 구조하는 거예요.',
    'chunks': ["Here's the LMA", f"{DASH} we're rescuing", 'the airway', '.'],
    'words': ['w-lma', 'w-rescue', 'w-airway'],
    'tag': '장비 전달',
    'icon': 'handshake2',
    'why': ("Here's …는 건네는 동작과 말을 한꺼번에 하는 표현이라, 받는 마취과가 손을 내밀 때를 맞춰요. "
            "대시 뒤 we're rescuing으로 왜 지금 이 장비인지 덧붙여 팀이 상황을 알아요."),
    'decoy': "Here's the gauze",
    'distractorsKo': ['후두마스크를 건네려고 포장을 뜯고 있어요.',
                      '후두마스크 여기 있어요 — 크기는 4호예요.'],
    'blank': blank('rescuing', ['cleaning', 'measuring', 'labeling']),
}, ['en', 'ko', 'chunks'],
    "Hand me the LMA — we're rescuing the airway → Here's the LMA — we're rescuing the airway.(화자가 뒤바뀜 — LMA를 건네는 쪽이 간호사; 검토 A)")
check_new(s)
od = sit(doc, 8, T)['order']
assert od['lines'][0]['en'] == f"Here's the LMA {DASH} we couldn't ventilate with the mask."

# ── 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-or-difficult-airway-A.md ─────
# S6.0·S8.0은 위 1에서 새 문장으로 잘랐다.
recut(5, '산소화 유지 보조', 2, 'Saturation is good before we proceed.',
      ['Saturation', 'is good', 'before we proceed', '.'],
      {'decoy': 'Blood pressure'})
recut(17, '저산소 서맥 진행', 1, "We need to oxygenate immediately or he'll arrest.",
      ['We need', 'to oxygenate', 'immediately', "or he'll arrest", '.'])
recut(1, 'Mallampati 평가', 0, 'Open your mouth as wide as you can, please.',
      ['Open', 'your mouth', 'as wide as you can', ', please', '.'],
      {'decoy': 'as slowly as you can'})
# 그대로 둔 것(구를 지키면 V8을 못 맞춤): S2.0 · S4.2 · S20.1 — 돌려줄 말에 이유

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ["Let's define", 'larynx', '후두를 고정', 'Push the airway', 'Hand me the LMA', "let's bag him", 'We move to emergency',
            'We go straight', "Let's switch to the failed", 'w-define', 'w-larynx', 'w-push', '밀어붙']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'or-difficult-airway.yaml'))
append_changes(os.path.join(HERE, 'changes-or-difficult-airway.yaml'), CH)
print('or-difficult-airway.yaml 저장')
