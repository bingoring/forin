"""or-malignant-hyperthermia — keyPhrase 2문장 교체(2026-10-16). base → or-malignant-hyperthermia.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-or-malignant-hyperthermia.yaml'))
CH = []

# 7. 유발약 회피 마취 [1]
T7 = '유발약 회피 마취'
OLD7 = 'The machine is flushed and the vaporizers are off.'
s = sent(doc, T7, 1, OLD7)
s.update({
    'en': 'The machine is flushed and the vaporizers are removed.',
    'ko': '기계는 세척되어 있고 기화기는 제거되어 있어요.',
    'chunks': ['The machine', 'is flushed', 'and the vaporizers', 'are removed', '.'],
    'words': ['w-machine', 'w-flush', 'w-vaporizer', 'w-remove'],
    'why': ('is flushed와 are removed는 수동태라 누가 했는지보다 지금 상태가 어떤지를 말해요. '
            '기화기는 꺼 둔 것(off)이 아니라 제거됐다(removed)고 보고해야 유발 가스가 나올 여지가 없다는 뜻이 돼요.'),
    'distractorsKo': ['기계는 세척되어 있고 기화기는 라벨되어 있어요.',
                      '침대는 세척되어 있고 기화기는 제거되어 있어요.'],
})
CH.append({'kind': 'sentence', 'situation': T7, 'index': 1, 'fields': ['en', 'ko', 'chunks', 'words'],
           'why': 'vaporizers are off → are removed(꺼 둔 것만으로는 부족); −w-off +w-remove'})
for wid in ('w-flush', 'w-vaporizer'):
    w = word(doc, wid)
    assert w['example'] == OLD7
    w['example'], w['exKo'] = s['en'], s['ko']
    CH.append({'kind': 'word', 'id': wid, 'fields': ['example'], 'why': '예문을 바꾼 문장으로'})
sl = nuance(doc, T7, 'slider')
sl['words'] = [x for x in sl['words'] if x != 'w-off']   # V15 — 이 상황 문장에 off가 더는 없다
o = sit(doc, T7)['order']
assert o['lines'][1]['en'] == OLD7
o['lines'][1]['en'] = s['en']
o['lines'][1]['ko'] = '기계는 세척됐고 기화기는 제거됐어요'

# 8. MH 위기 발동 [0]
T8 = 'MH 위기 발동'
OLD8 = "This is malignant hyperthermia — I'm declaring it."
s = sent(doc, T8, 0, OLD8)
s.update({
    'en': "Anesthesia has declared malignant hyperthermia — I'm getting the MH cart.",
    'ko': '마취과에서 악성 고열을 선언했어요 — 제가 MH 카트를 가져올게요.',
    'chunks': ['Anesthesia has declared', 'malignant hyperthermia', '—', "I'm getting", 'the MH cart', '.'],
    'words': ['w-declare', 'w-mhfull', 'w-mh', 'w-cart'],
    'tag': '선언 전달',
    'icon': 'siren',
    'why': ('MH 선언은 마취과가 내리는 판단이라, 간호사는 has declared로 이미 내려진 선언을 팀에 알려요. '
            "곧바로 I'm getting the MH cart로 자기가 맡은 일을 밝혀, 같은 일을 둘이 하거나 빠뜨리지 않게 해요."),
    'decoy': 'the OR schedule',
    'distractorsKo': ['마취과에서 악성 고열을 선언했어요 — 제가 얼음팩을 가져올게요.',
                      '외과에서 악성 고열을 선언했어요 — 제가 MH 카트를 가져올게요.'],
    'blank': blank('declared', ['excluded', 'reversed', 'treated']),
})
CH.append({'kind': 'sentence', 'situation': T8, 'index': 0, 'fields': ['en', 'ko', 'chunks', 'words'],
           'why': "위기 선언은 마취과 판단 — 간호사는 선언을 알리고 바로 행동(MH 카트); +w-mh +w-cart"})
w = word(doc, 'w-declare')
assert w['example'] == OLD8
w['example'], w['exKo'] = s['en'], s['ko']
CH.append({'kind': 'word', 'id': 'w-declare', 'fields': ['example'], 'why': '예문을 바꾼 문장으로'})

sl = nuance(doc, T8, 'slider')
sl['cue'] = ("EtCO2 is rising, the jaw is tight, and the heart rate is up. "
             "The anesthesiologist has just declared MH, and you tell the room.")
sl['scale'] = [
    "Anesthesia thinks this might be MH, but they aren't sure yet.",
    "Anesthesia says this looks like MH, so let's keep watching it.",
    "Anesthesia has declared MH — I'm getting the MH cart now.",
]
sl['answerAt'] = 2
sl['why'] = ('MH 선언은 마취과가 내리는 판단이에요. 선언이 나왔다면 간호사는 might be·looks like로 흐리지 않고 '
             'has declared로 분명히 전한 뒤, 곧바로 맡은 일(카트, 도움 요청)을 붙여요.')
sl['example'] = "Anesthesia has declared malignant hyperthermia — I'm getting the MH cart. Call for help."
sl['exKo'] = '마취과에서 악성 고열을 선언했어요 — 제가 MH 카트를 가져올게요. 도움을 요청해 주세요.'

cx = nuance(doc, T8, 'context')
sc = cx['scenes'][2]
assert sc['en'] == "I'm declaring that your husband has malignant hyperthermia." and sc['ok'] is False
sc['en'] = 'Anesthesia has declared malignant hyperthermia for your husband.'

o = sit(doc, T8)['order']
assert o['lines'][0]['en'] == OLD8
o['why'] = ('1줄에서 마취과의 선언을 알리고 바로 카트를 가지러 가요. 2줄의 Because of that은 1줄의 선언을 받아 유발 약제 중단을 말하고, '
            '3줄의 While the agents are being stopped는 2줄의 중단을 받아 도움을 요청해요. '
            '4줄은 1줄의 카트와 3줄의 도움을 함께 받아 단트롤렌 혼합을 시작하니 순서가 하나예요.')
o['lines'] = [
    {'en': s['en'], 'icon': 'siren', 'ko': '마취과에서 악성 고열을 선언했어요 — 카트를 가져올게요', 'note': '전달'},
    o['lines'][1],
    {'en': 'While the agents are being stopped, someone call for help.', 'icon': 'bell',
     'ko': '약제를 멈추는 동안 누군가 도움을 요청해 주세요', 'note': '요청'},
    {'en': 'With the cart here and help on the way, start mixing dantrolene.', 'icon': 'pill',
     'ko': '카트가 왔고 도움도 오고 있으니 단트롤렌 혼합을 시작해요', 'note': '처치'},
]
assert o['lines'][1]['en'] == 'Because of that, we stop all triggering agents immediately.'

# 8b. MH 위기 발동 [3] — keyPhrase는 아니지만 같은 결정(간호사가 선언하지 않음)으로 고친다
s = sent(doc, T8, 3, "I'm calling it — this is MH, and we start the protocol now.")
s.update({
    'en': 'Anesthesia is calling it — this is MH, and we start the protocol now.',
    'ko': '마취과가 선언했어요 — 이건 MH이고, 지금 프로토콜을 시작합니다.',
    'chunks': ['Anesthesia is calling it', '— this is MH', ', and we start', 'the protocol now', '.'],
    'why': ('calling it은 판단을 확정해 말한다는 관용구인데, 그 판단은 마취과 몫이라 Anesthesia is calling it으로 누가 정했는지 밝혀요. '
            'we start the protocol now로 선언을 받자마자 팀이 프로토콜을 시작한다고 이어 말해요.'),
    'distractorsKo': ['마취과가 선언했어요 — 이건 MH이고, 지금 기록을 시작합니다.',
                      '마취과가 선언했어요 — 이건 MH이고, 지금 타이머를 시작합니다.'],
})
CH.append({'kind': 'sentence', 'situation': T8, 'index': 3, 'fields': ['en', 'ko', 'chunks'],
           'why': "I'm calling it(간호사가 선언) → Anesthesia is calling it(마취과 선언을 받아 프로토콜 시작)"})

dump(doc, os.path.join(HERE, 'or-malignant-hyperthermia.yaml'))
append_changes(os.path.join(HERE, 'changes-or-malignant-hyperthermia.yaml'), CH)
print('or-malignant-hyperthermia.yaml 저장')
