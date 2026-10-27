"""icu-airway — keyPhrase 5문장 교체(2026-10-27). base-icu-airway.yaml → icu-airway.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-airway.yaml'))
CH = []
OLD = []


def other(si, k):
    s = doc['situations'][si]['sentences'][k]
    return (s['en'], s['ko'])


# 4. 삽관 중 저산소·서맥 급변 [2]
T = '삽관 중 저산소·서맥 급변'
o = 'If the heart rate stays low, we start the arrest algorithm.'
OLD.append(o)
remove_word(doc, 'w-low')
CH.append({'kind': 'word-remove', 'id': 'w-low', 'why': '바꾼 문장에 low가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 16, T, 2, o, {
    'en': 'If he loses his pulse, we start the arrest algorithm.',
    'ko': '맥박이 없어지면 심정지 알고리즘을 시작해요.',
    'chunks': ['If he loses', 'his pulse', ', we start', 'the arrest algorithm', '.'],
    'words': ['w-start', 'w-arrest', 'w-algorithm'],
    'why': ("'If he loses his pulse'로 심정지 알고리즘을 시작하는 조건을 맥박 소실로 분명히 해요. "
            "맥박이 있는 서맥은 산소화가 먼저이고, 그래도 낮으면 서맥 알고리즘(아트로핀·페이싱)으로 가요."),
    'distractorsKo': ['맥박이 없어지면 응급 카트를 침상 옆으로 당겨요.',
                      '맥박이 없어지면 큰 소리로 코드 팀을 불러요.'],
    'blank': blank('pulse', ['appetite', 'balance', 'voice']),
    '_moved': {'w-heart': other(16, 3), 'w-rate': other(16, 3)},
}, ['en', 'ko', 'chunks', 'words'],
    'If the heart rate stays low(맥박이 있는 서맥은 심정지 알고리즘이 아님) → If he loses his pulse; −w-heart·w-rate·w-stay·w-low(w-low는 은행에서 지움)')

# 5·6. 삽관 후 위치 확인 협조 [2][0]
T = '삽관 후 위치 확인 협조'
o = "I'll order the chest X-ray to check the tube depth."
OLD.append(o)
replace(doc, CH, 3, T, 2, o, {
    'en': "Let's get the chest X-ray to check the tube depth.",
    'ko': '튜브 깊이를 확인하기 위해 흉부 엑스레이를 찍죠.',
    'chunks': ["Let's get", 'the chest X-ray', 'to check', 'the tube depth', '.'],
    'words': ['w-get', 'w-chest', 'w-xray', 'w-check', 'w-tube', 'w-depth'],
    'tag': '영상 확인',
    'why': ("'Let's get'은 처방을 대신 내지 않고 팀에 검사를 진행하자고 하는 말이에요. "
            "튜브 깊이는 숨소리와 캡노그래피만으로는 알 수 없어서 영상으로 확인해요."),
    'distractorsKo': ['튜브 깊이를 확인하기 위해 흉부 엑스레이를 기다리죠.',
                      '튜브 크기를 확인하기 위해 흉부 엑스레이를 찍죠.'],
    '_moved': {'w-order': other(8, 3)},
}, ['en', 'ko', 'chunks', 'words'],
    "I'll order(흉부 X선 처방은 의사의 일) → Let's get; −w-order(8.3에서 계속 씀) +w-get")

o = 'We have sustained color change on capnography, confirming the airway.'
OLD.append(o)
remove_word(doc, 'w-color')
CH.append({'kind': 'word-remove', 'id': 'w-color', 'why': '바꾼 문장에 color가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 3, T, 0, o, {
    'en': 'We have a sustained waveform on capnography, confirming tracheal placement.',
    'ko': '캡노그래피에서 파형이 지속되어 기관 내 위치를 확인했어요.',
    'chunks': ['We have', 'a sustained waveform', 'on capnography', ', confirming tracheal placement', '.'],
    'words': ['w-sustain', 'w-capnography', 'w-confirm', 'w-placement'],
    'why': ("'sustained'는 한 번 반짝이고 마는 게 아니라 숨마다 이어지는 파형이라는 뜻이에요. "
            "지속되는 이산화탄소 파형이 튜브가 기관 안에 있다는 가장 믿을 만한 확인이에요."),
    'decoy': 'on pulse oximetry',
    'distractorsKo': ['캡노그래피에서 파형이 지속되어 엑스레이 결과를 기다려요.',
                      '캡노그래피에서 파형이 지속되어 기관 내 위치를 팀에 알렸어요.'],
    'blank': blank('confirming', ['excluding', 'doubting', 'delaying']),
    '_moved': {'w-change': other(5, 0)},
}, ['en', 'ko', 'chunks', 'words'],
    'color change on capnography(색 변화는 비색식 감지기, capnography는 파형) → a sustained waveform … confirming tracheal placement; −w-color(은행에서 지움)·w-change·w-airway +w-placement')

ol = sit(doc, 3, T)['order']
l1 = ol['lines'][0]
assert l1['en'] == 'We have sustained color change on capnography.'
l1['en'] = 'We have a sustained waveform on capnography.'
l1['ko'] = '캡노그래피에서 파형이 지속돼요'
assert '색' not in ol['why']

# 7. 식도 삽관 인지·즉시 교정 [0]
T = '식도 삽관 인지·즉시 교정'
o = 'No sustained capnography means the tube is not in the trachea.'
OLD.append(o)
replace(doc, CH, 19, T, 0, o, {
    'en': 'No sustained CO2 on capnography means the tube is not in the trachea.',
    'ko': '캡노그래피에서 이산화탄소가 지속되지 않는다는 건 튜브가 기관 안에 없다는 뜻이에요.',
    'chunks': ['No sustained CO2', 'on capnography', 'means', 'the tube is not', 'in the trachea', '.'],
    'why': ("'sustained'는 한 번이 아니라 숨마다 이어지는 이산화탄소를 말해요. 캡노그래피에 이산화탄소가 이어지지 않으면 "
            "가스가 폐에서 오지 않는다는 뜻이라 튜브가 기관 밖일 가능성이 높아요."),
    'distractorsKo': ['청진에서 호흡음이 지속되지 않는다는 건 튜브가 기관 안에 없다는 뜻이에요.',
                      '캡노그래피에서 이산화탄소가 지속되지 않는다는 건 위관이 기관 안에 없다는 뜻이에요.'],
    'blank': blank('sustained', ['brief', 'early', 'slight']),
}, ['en', 'ko', 'chunks'], 'No sustained capnography(측정법을 값처럼 씀) → No sustained CO2 on capnography')

ol = sit(doc, 19, T)['order']
l1 = ol['lines'][0]
assert l1['en'] == o
l1['en'] = 'No sustained CO2 on capnography means the tube is not in the trachea.'
l1['ko'] = '캡노그래피에서 이산화탄소가 지속되지 않는다는 건 튜브가 기관 안에 없다는 뜻이에요'
assert ol['why'].startswith('파형이 없다는 사실로')
ol['why'] = ol['why'].replace('파형이 없다는 사실로', '지속되는 이산화탄소가 없다는 사실로', 1)

# 8. 삽관 전 전산소화·apneic 산소 [2]
T = '삽관 전 전산소화·apneic 산소'
o = 'This buys us more safe time during the intubation attempt.'
OLD.append(o)
replace(doc, CH, 7, T, 2, o, {
    'en': 'This buys us more safe apnea time during the intubation attempt.',
    'ko': '이게 삽관 시도 중 안전한 무호흡 시간을 더 벌어줘요.',
    'chunks': ['This buys us', 'more safe apnea time', 'during', 'the intubation attempt', '.'],
    'why': ("'buys us'는 시간을 번다는 비유예요. 'safe apnea time'은 숨이 멈춘 뒤 포화도가 위험하게 떨어지기 전까지 "
            "쓸 수 있는 시간을 뜻해요."),
    'distractorsKo': ['이게 진정 시도 중 안전한 무호흡 시간을 더 벌어줘요.',
                      '이게 삽관 시도 중 안전한 회복 시간을 더 벌어줘요.'],
}, ['en', 'ko', 'chunks'], "more safe time(어색함 — 보통 safe apnea time) → more safe apnea time; chunks의 'during the intubation / attempt' 절단도 함께 바로잡음")

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-airway.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-airway.yaml'), CH)
print('icu-airway.yaml 저장')
