"""icu-hemodynamics — keyPhrase 2문장 교체(2026-10-26). base-icu-hemodynamics.yaml → icu-hemodynamics.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-hemodynamics.yaml'))
CH = []
OLD = []

# 8. 수액 반응성 평가 [1]
T = '수액 반응성 평가'
o = "If the pulse pressure variation drops, she's likely fluid responsive."
OLD.append(o)
replace(doc, CH, 13, T, 1, o, {
    'en': "If the pulse pressure variation is high, she's likely fluid responsive.",
    'ko': '맥압변이가 크면 수액에 반응할 가능성이 높아요.',
    'chunks': ['If the pulse pressure variation', 'is high', ", she's likely", 'fluid responsive', '.'],
    'words': ['w-pulse', 'w-pressure', 'w-variation', 'w-fluid', 'w-responsive'],
    'why': ("likely는 확률을 뜻하는 말이라 반응한다가 아니라 반응할 가능성이 높다로 단정을 피해요. 맥압변이가 크다는 건 숨에 따라 박출량이 크게 출렁인다는 뜻이라 "
            "수액에 반응할 쪽이에요. 자발호흡이나 부정맥이 있으면 이 값을 믿기 어려워서 다리 거상 같은 검사와 함께 판단해요."),
    'distractorsKo': ['심박수 변화가 크면 수액에 반응할 가능성이 높아요',
                      '의식 변화가 크면 수액에 반응할 가능성이 높아요'],
}, ['en', 'ko', 'chunks', 'words'],
    "variation drops(방향이 거꾸로 — 맥압변이가 클 때 수액 반응성) → variation is high; chunks가 pulse pressure variation을 끊던 것도 바로잡음; −w-drop(다른 문장에서 계속 씀)")

# 9. 승압 중 급성 서맥 심정지 전조 [2]
T = '승압 중 급성 서맥 심정지 전조'
o = 'Start atropine and prepare for CPR.'
OLD.append(o)
replace(doc, CH, 18, T, 2, o, {
    'en': 'Give atropine and prepare for CPR.',
    'ko': '아트로핀을 투여하고 CPR을 준비하세요.',
    'chunks': ['Give atropine', 'and prepare', 'for CPR', '.'],
    'words': ['w-atropine', 'w-prepare', 'w-cpr'],
    'why': ("Give atropine처럼 약 이름 앞에 give를 써서 한 번 투여하라고 짧게 지시해요. 아트로핀은 점적으로 '시작'하는 약이 아니라 정맥으로 한 번씩 주는 약이에요. "
            "prepare for CPR은 아직 하지 않지만 곧 필요할 수 있어 미리 준비하라는 뜻이에요."),
    'distractorsKo': ['아트로핀을 투여하고 패드를 준비하세요', '아트로핀을 투여하고 산소를 준비하세요'],
}, ['en', 'ko', 'chunks', 'words'], 'Start atropine(점적처럼 들림 — 아트로핀은 1회 정맥 투여) → Give atropine; −w-start(다른 문장에서 계속 씀)')
ol = sit(doc, 18, T)['order']
l3 = ol['lines'][2]
assert l3['en'] == 'With the cart here, start atropine and prepare for CPR.'
l3['en'] = 'With the cart here, give atropine and prepare for CPR.'
l3['ko'] = '카트가 오면 아트로핀을 투여하고 CPR을 준비하세요'

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-hemodynamics.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-hemodynamics.yaml'), CH)
print('icu-hemodynamics.yaml 저장')
