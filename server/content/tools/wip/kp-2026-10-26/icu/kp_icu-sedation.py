"""icu-sedation — keyPhrase 2문장 교체(2026-10-26). base-icu-sedation.yaml → icu-sedation.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-sedation.yaml'))
CH = []
OLD = []

# 19. 진정 부족 자가발관 위험 급변 [1]
T = '진정 부족 자가발관 위험 급변'
o = 'Give a bolus now and reassess the drip rate.'
OLD.append(o)
replace(doc, CH, 18, T, 1, o, {
    'en': 'Give a PRN bolus per order now and reassess the drip rate.',
    'ko': '지금 처방에 따라 PRN 볼루스를 주고 주입 속도를 다시 평가해요.',
    'chunks': ['Give a PRN bolus', 'per order', 'now', 'and reassess', 'the drip rate', '.'],
    'words': ['w-bolus', 'w-order', 'w-reassess', 'w-drip', 'w-rate'],
    'why': ("PRN 볼루스는 필요할 때 쓰도록 미리 처방된 추가 투여이고, per order는 그 처방 범위 안에서 준다는 뜻이에요. "
            "처방 없이 펌프로 볼루스를 주지 않고, 준 뒤에는 and reassess로 속도를 다시 보는 확인까지 이어요."),
    'distractorsKo': ['지금 처방에 따라 PRN 볼루스를 주고 호흡수를 다시 평가해요.',
                      '지금 처방에 따라 PRN 볼루스를 주고 진정 점수를 다시 평가해요.'],
}, ['en', 'ko', 'chunks', 'words'], 'Give a bolus(처방 범위 없이 주는 듯함) → Give a PRN bolus per order; +w-order')
ol = sit(doc, 18, T)['order']
l3, l4 = ol['lines'][2], ol['lines'][3]
assert l3['en'] == 'For the agitation behind that, give a bolus now and reassess the drip rate.'
assert l4['en'] == 'Needing that bolus tells us his sedation was too light.'
l3['en'] = 'For the agitation behind that, give a PRN bolus per order now.'
l3['ko'] = '그 초조 때문에 지금 처방에 따라 PRN 볼루스를 줘요'
l4['en'] = 'Needing that PRN bolus tells us his sedation was too light.'
l4['ko'] = '그 PRN 볼루스가 필요했다는 건 진정이 너무 얕았다는 뜻이에요'
ol['why'] = ("튜브를 잡으려는 상황을 먼저 알리고, 2줄의 that tube가 그 튜브를 가리켜요. 3줄의 that은 2줄에서 막으려는 상황을 가리켜요. "
             "4줄의 that PRN bolus는 3줄에서 처방에 따라 준 볼루스를 가리켜서 순서가 하나예요.")

# 20. 덱스 서맥·저혈압 급변 [1]
T = '덱스 서맥·저혈압 급변'
o = "Let's give atropine and fluids and recheck the pressure."
OLD.append(o)
replace(doc, CH, 19, T, 1, o, {
    'en': "Let's get orders for atropine and fluids and recheck the pressure.",
    'ko': '아트로핀과 수액 처방을 받고 혈압을 다시 확인해요.',
    'chunks': ["Let's get orders", 'for atropine and fluids', 'and recheck', 'the pressure', '.'],
    'words': ['w-order', 'w-atropine', 'w-fluid', 'w-recheck', 'w-pressure'],
    'tag': '처방 요청',
    'why': ("get orders for …는 약을 바로 주지 않고 먼저 처방을 받는다는 말이에요. 아트로핀과 수액은 의사 처방으로 주고, "
            "and recheck the pressure로 투여 뒤 효과를 다시 보는 흐름까지 담아요."),
    'distractorsKo': ['아트로핀과 수액 처방을 받고 심박수를 다시 확인해요.',
                      '아트로핀과 수액 라인을 잡고 혈압을 다시 확인해요.'],
}, ['en', 'ko', 'chunks', 'words'], "Let's give(처방 전 투여처럼 들림) → Let's get orders for; +w-order")

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-sedation.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-sedation.yaml'), CH)
print('icu-sedation.yaml 저장')
