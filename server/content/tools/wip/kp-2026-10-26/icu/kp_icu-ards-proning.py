"""icu-ards-proning — keyPhrase 3문장 교체(2026-10-26). base-icu-ards-proning.yaml → icu-ards-proning.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-ards-proning.yaml'))
CH = []
OLD = []

# 1. 기흉·기압손상 동반 위기 [1]
T = '기흉·기압손상 동반 위기'
o = 'Lower the tidal volume and prepare for a chest tube.'
OLD.append(o)
replace(doc, CH, 19, T, 1, o, {
    'en': "Ask RT to lower the tidal volume, and let's prepare for a chest tube.",
    'ko': '호흡치료사에게 일회 호흡량을 낮춰 달라고 하고, 흉관 삽입을 준비해요.',
    'chunks': ['Ask RT', 'to lower', 'the tidal volume', ',', "and let's prepare", 'for a chest tube', '.'],
    'why': ("Ask RT to …로 호흡량 조절은 호흡치료사에게 요청하고, let's로 흉관 준비는 팀이 함께 한다고 나눠 말해요. "
            "환기 설정은 의사 오더에 따라 호흡치료사가 바꾸고, 흉관은 의사가 넣으며 간호사는 준비를 맡아요."),
    'distractorsKo': ['호흡치료사에게 일회 호흡량을 낮춰 달라고 하고, 그 시각을 기록해요.',
                      '호흡치료사에게 호흡기 경보를 확인해 달라고 하고, 흉관 삽입을 준비해요.'],
}, ['en', 'ko', 'chunks'], '간호사가 직접 설정을 바꾸는 지시처럼 들림 → 호흡치료사에게 요청하고 흉관은 함께 준비')

# 2. 복와위 중 심정지 긴급 앙와위 전환 [0]
T = '복와위 중 심정지 긴급 앙와위 전환'
s4 = sit(doc, 16, T)['sentences'][4]
o = 'Call the code and flip him supine so we can start compressions.'
OLD.append(o)
replace(doc, CH, 16, T, 0, o, {
    'en': 'Call the code and flip him supine as fast as we safely can.',
    'ko': '코드를 부르고 안전하게 할 수 있는 한 빨리 앙와위로 뒤집어요.',
    'chunks': ['Call the code', 'and flip him supine', 'as fast as', 'we safely can', '.'],
    'words': ['w-call', 'w-code', 'w-flip', 'w-supine', 'w-fast', 'w-safely'],
    'why': ("as fast as we safely can은 서두르되 기도와 라인을 지킬 수 있는 만큼만 빨리라는 한계를 함께 말해요. "
            "앙와위 압박이 표준이지만, 빨리 돌릴 수 없으면 엎드린 채 등(견갑골 사이)을 눌러 압박을 먼저 시작하는 것도 타당해요(AHA 2020)."),
    'distractorsKo': ['코드를 부르고 안전하게 할 수 있는 한 빨리 침대를 평평하게 해요.',
                      '코드를 부르고 안전하게 할 수 있는 한 빨리 제세동기를 가져와요.'],
    'blank': blank('safely', ['quietly', 'politely', 'cheaply']),
    '_moved': {'w-compression': (s4['en'], s4['ko'])},
}, ['en', 'ko', 'chunks', 'words'],
    "so we can start compressions(돌린 뒤에만 압박하는 것처럼 들림 — AHA 2020은 빨리 못 돌리면 복와위 CPR 허용) → as fast as we safely can; −w-start −w-compression(다른 문장에서 계속 씀) +w-fast +w-safely")
ol = sit(doc, 16, T)['order']
l1 = ol['lines'][0]
assert l1['en'] == 'No pulse — call the code and flip him supine.'
l1['en'] = 'No pulse — call the code and flip him supine as fast as we safely can.'
l1['ko'] = '맥박이 없어요 — 코드를 부르고 안전하게 할 수 있는 한 빨리 앙와위로 뒤집어요'
ol['why'] = ("맥박이 없으면 코드를 부르고 안전한 범위에서 최대한 빨리 뒤집은 다음, 돌리는 동안 기도와 라인을 보호하고, 눕는 순간 압박을 시작해요. "
             "압박이 시작되면 다른 사람이 코드 카트를 가져와요. 빨리 돌릴 수 없으면 엎드린 채로 등을 눌러 압박을 먼저 시작할 수 있어요(AHA 2020).")

# 3. PEEP·recruitment 반응 평가 [2]
T = 'PEEP·recruitment 반응 평가'
o = "I'll watch for overdistension so we don't harm the good lung."
OLD.append(o)
replace(doc, CH, 10, T, 2, o, {
    'en': "I'll watch for overdistension so we don't harm the healthier parts of the lung.",
    'chunks': ["I'll watch", 'for overdistension', "so we don't harm", 'the healthier parts', 'of the lung', '.'],
    'why': ("'so we don't harm'은 지켜보는 이유를 밝혀요. ARDS 폐는 고르게 상하지 않아서 '좋은 폐'가 따로 있는 게 아니라 "
            "상대적으로 덜 손상된 부위(healthier parts)가 있고, 폐포를 여는 수기는 이미 열려 있는 그 부위를 과하게 부풀릴 수 있어요."),
}, ['en', 'chunks'], 'the good lung(ARDS에 따로 좋은 폐가 있는 듯함) → the healthier parts of the lung; ko는 이미 "덜 손상된 폐 부위"라 그대로')
ol = sit(doc, 10, T)['order']
l4 = ol['lines'][3]
assert l4['en'] == "While we compare, I'll watch for overdistension so we don't harm the good lung."
l4['en'] = "While we compare, I'll watch for overdistension in the healthier parts of the lung."
l4['ko'] = '비교하는 동안 덜 손상된 폐 부위에 과팽창이 생기는지 지켜볼게요'

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-ards-proning.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-ards-proning.yaml'), CH)
print('icu-ards-proning.yaml 저장')
