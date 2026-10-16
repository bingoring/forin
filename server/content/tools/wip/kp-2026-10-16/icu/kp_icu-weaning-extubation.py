"""icu-weaning-extubation — keyPhrase 1문장 교체(2026-10-16). base → icu-weaning-extubation.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-weaning-extubation.yaml'))
CH = []

T = '발관 직후 호흡부전 급변'
OLD = "If he's alert with a manageable airway, we can trial rescue NIV briefly."
s = sent(doc, T, 0, OLD)
s.update({
    'en': "If he's alert with a manageable airway, we can trial rescue NIV briefly if the physician agrees.",
    'ko': '각성돼 있고 기도가 다룰 만하면, 의사가 동의할 경우 잠시 구조 NIV를 시도할 수 있어요.',
    'chunks': ["If he's alert", 'with a manageable airway', ', we can trial', 'rescue NIV briefly', 'if the physician agrees', '.'],
    'words': ['w-alert', 'w-manageable', 'w-airway', 'w-trial', 'w-niv', 'w-briefly', 'w-physician'],
    'why': ("If절의 두 조건(각성, 다룰 만한 기도)이 시도의 전제이고, briefly가 짧게만 한다는 한도를 붙여요. "
            "끝의 if the physician agrees로 구조 NIV는 의사가 정하는 일임을 밝혀, 간호사는 제안하되 혼자 시작하지 않아요."),
    'distractorsKo': ['각성돼 있고 기도가 다룰 만하면, 의사가 도착할 경우 잠시 구조 NIV를 시도할 수 있어요.',
                      '각성돼 있고 기도가 다룰 만하면, 의사가 동의할 경우 잠시 구조 NIV를 설명할 수 있어요.'],
})
CH.append({'kind': 'sentence', 'situation': T, 'index': 0, 'fields': ['en', 'ko', 'chunks', 'words'],
           'why': '구조 NIV는 의사 결정 — if the physician agrees를 붙임; +w-physician'})
for wid in ('w-alert', 'w-manageable', 'w-briefly'):
    w = word(doc, wid)
    assert w['example'] == OLD
    w['example'], w['exKo'] = s['en'], s['ko']
    CH.append({'kind': 'word', 'id': wid, 'fields': ['example'], 'why': '예문을 바꾼 문장으로'})

o = sit(doc, T)['order']
assert o['lines'][0]['en'] == OLD
o['lines'][0]['en'] = "If he's alert, we can trial rescue NIV briefly if the physician agrees."
o['lines'][0]['ko'] = '각성돼 있으면 의사가 동의할 때 잠시 구조 NIV를 해 볼 수 있어요'
o['why'] = ('의사 동의를 전제로 시도의 근거를 말하고, 2줄의 that으로 그 시도에 시간 제한을 걸고, '
            '제한을 넘어 악화될 때의 행동을 말한 뒤, 그 결정을 빨리 내리도록 호출을 요청해요.')

dump(doc, os.path.join(HERE, 'icu-weaning-extubation.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-weaning-extubation.yaml'), CH)
print('icu-weaning-extubation.yaml 저장')
