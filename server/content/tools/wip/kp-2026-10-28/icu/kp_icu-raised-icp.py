"""icu-raised-icp — keyPhrase 6문장 교체 + keyPhrase chunks 3문장 다시 자르기(2026-10-28).
base-icu-raised-icp.yaml → icu-raised-icp.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-raised-icp.yaml'))
CH = []
OLD = []


def line(si, title, k, old_en, en, ko):
    l = sit(doc, si, title)['order']['lines'][k]
    assert l['en'] == old_en, (title, k, l['en'])
    assert len(en.split()) <= 15, en
    l['en'], l['ko'] = en, ko


def recut(si, title, index, en, chunks):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', en)) == 1
    assert s['decoy'] not in chunks and s['decoy'] not in en, s['decoy']
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'],
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"})


# 10·11. 뇌탈출 임박 위기 [0][3]
T = '뇌탈출 임박 위기'
o = 'A blown pupil means herniation — give hypertonic and hyperventilate now.'
n = 'A blown pupil can mean herniation — give hypertonic and hyperventilate per protocol now.'
OLD.append(o)
replace(doc, CH, 15, T, 0, o, {
    'en': n,
    'ko': '동공이 산대되면 뇌탈출일 수 있으니, 프로토콜대로 지금 고장액을 주고 과호흡을 시작하세요.',
    'chunks': ['A blown pupil', 'can mean herniation', '— give hypertonic', 'and hyperventilate', 'per protocol now', '.'],
    'words': ['w-blown', 'w-pupil', 'w-mean', 'w-herniation', 'w-hypertonic', 'w-hyperventilate', 'w-protocol'],
    'why': ("'can mean'으로 징후를 뇌탈출로 단정하지 않으면서도 바로 움직이게 해요. 'per protocol'은 고장액과 과호흡을 "
            "정해진 절차 안에서 한다는 뜻이고, give와 hyperventilate를 and로 묶어 지시를 한 번에 내려요."),
    'decoy': 'can mean dehydration',
    'distractorsKo': ['호흡이 불규칙해지면 뇌탈출일 수 있으니, 프로토콜대로 지금 고장액을 주고 과호흡을 시작하세요.',
                      '맥박이 느려지면 뇌탈출일 수 있으니, 프로토콜대로 지금 고장액을 주고 과호흡을 시작하세요.'],
}, ['en', 'ko', 'chunks', 'words'],
    '단정(15.1은 until proven otherwise)이고 처방·프로토콜 없이 고장액·과호흡을 지시 → can mean … per protocol; +w-protocol')

o = "I'm draining the EVD and elevating his head immediately."
n = "I'm draining the EVD per parameters and elevating his head immediately."
OLD.append(o)
replace(doc, CH, 15, T, 3, o, {
    'en': n,
    'ko': '지시 기준대로 즉시 EVD를 배액하고 머리를 올릴게요.',
    'chunks': ["I'm draining", 'the EVD', 'per parameters', 'and elevating his head', 'immediately', '.'],
    'words': ['w-drain', 'w-evd', 'w-per', 'w-parameter', 'w-elevate', 'w-immediately'],
    'why': ("I'm draining…처럼 진행형으로 말하면 지금 하고 있다는 사실이 동료에게 바로 전해져요. "
            "'per parameters'로 배액을 처방된 기준 안에서 한다는 점을 밝히고, immediately로 지체 없이라는 뜻을 더해요."),
    'decoy': 'the Foley bag',
    'distractorsKo': ['지시 기준대로 배액하려고 EVD 높이부터 먼저 읽을게요',
                      '즉시 머리를 올리면서 양쪽 동공 크기도 함께 비춰 볼게요'],
    'blank': blank('draining', ['labeling', 'cleaning', 'taping']),
}, ['en', 'ko', 'chunks', 'words'],
    'EVD 배액은 처방된 기준 안에서(6.4 keyPhrase의 per parameters와 맞춤) → per parameters; +w-per +w-parameter')
line(15, T, 1, 'Call neurosurgery stat while I drain the EVD and raise his head.',
     'Call neurosurgery stat while I drain the EVD per parameters and raise his head.',
     '제가 지시 기준대로 EVD를 배액하고 머리를 올리는 동안 신경외과에 즉시 연락하세요')

# 12. EVD 막힘·과배액 위기 [4]
T = 'EVD 막힘·과배액 위기'
o = 'If it over-drained, we reposition and reassess immediately.'
n = 'If it over-drained, we clamp it, recheck the level, and notify neurosurgery immediately.'
OLD.append(o)
replace(doc, CH, 16, T, 4, o, {
    'en': n,
    'ko': '과배액됐다면 배액관을 잠그고 수평을 다시 확인한 뒤, 즉시 신경외과에 알려요.',
    'chunks': ['If it over-drained', ', we clamp it', ', recheck the level', ', and notify neurosurgery', 'immediately', '.'],
    'words': ['w-over', 'w-drain', 'w-clamp', 'w-recheck', 'w-level', 'w-notify', 'w-neurosurgery', 'w-immediately'],
    'tag': '과배액 대처',
    'icon': 'siren',
    'why': ("over-drained는 너무 많이 빠졌다는 뜻이에요. 잠그기·수평 재확인·신경외과 보고를 쉼표로 이어, "
            "과배액 때 할 일을 순서대로 한 번에 말해요."),
    'decoy': ', recheck the dressing',
    'distractorsKo': ['과배액되면 뇌실이 줄어들어 출혈이 생길 수 있어서 배액관을 서둘러 잠가요.',
                      '배액관을 잠근 뒤에는 신경외과가 다시 정한 높이로 수평을 맞춰 둬요.'],
    'blank': blank('clamp', ['label', 'tape', 'empty']),
}, ['en', 'ko', 'chunks', 'words'],
    '과배액 대응의 핵심(잠그기·신경외과 보고)이 빠지고 reposition이 모호(안전) → clamp it, recheck the level, and notify neurosurgery; '
    '−w-reposition −w-reassess(8.4·16.3에서 계속 씀) +w-clamp +w-recheck +w-level +w-notify +w-neurosurgery')

# 13. 급성 뇌출혈 확대 악화 [3]
T = '급성 뇌출혈 확대 악화'
o = "I'm reversing any anticoagulation per protocol now."
n = "We're reversing any anticoagulation per protocol now."
OLD.append(o)
replace(doc, CH, 18, T, 3, o, {
    'en': n,
    'chunks': ["We're reversing", 'any anticoagulation', 'per protocol', 'now', '.'],
    'why': ("We're reversing처럼 we와 진행형으로 말하면 역전 처방과 투여를 팀이 함께 지금 진행하고 있다는 사실이 전해져요. "
            "any anticoagulation은 어떤 항응고라도 해당된다는 뜻이에요."),
    'decoy': 'any antibiotics',
    'blank': blank('anticoagulation', ['hyperglycemia', 'hypothermia', 'paralysis']),
}, ['en', 'chunks'], "역전 결정은 처방이고 투여는 간호사 몫 — 주어를 팀으로(I'm → We're); ko는 주어가 드러나지 않아 그대로")

# 14. EVD 시스템·영점 이해 [1]
T = 'EVD 시스템·영점 이해'
o = 'Its height is set to a reference point at his ear to drain correctly.'
n = 'Its height is set to a reference point near his ear, per protocol, so it drains correctly.'
OLD.append(o)
replace(doc, CH, 2, T, 1, o, {
    'en': n,
    'ko': '프로토콜에 따라 귀 근처의 기준점에 맞춰 높이를 설정해서 정확히 배액되게 해요.',
    'chunks': ['Its height is set', 'to a reference point', 'near his ear', ', per protocol', ', so it drains', 'correctly', '.'],
    'words': ['w-height', 'w-set', 'w-reference', 'w-point', 'w-protocol', 'w-drain', 'w-correctly'],
    'why': ("reference point는 기준이 되는 지점이라는 말이에요. 기준점이 병원마다 조금씩 달라 'near his ear, per protocol'로 "
            "귀 부근을 프로토콜대로 잡는다고 말하고, is set은 사람이 맞춰 놓은 상태를 수동태로 말해요."),
    'decoy': 'near his nose',
    'distractorsKo': ['프로토콜에 따라 귀 근처의 기준점에 맞춰 높이를 설정하고 나서 배액량을 지켜봐요',
                      '프로토콜에 따라 귀 근처의 기준점에 맞춰 높이를 설정하고 나서 손을 씻어요'],
    'blank': blank('height', ['alarm', 'clamp', 'timer']),
}, ['en', 'ko', 'chunks', 'words'],
    '기준점은 프로토콜마다(이주·외이도) 다름 → near his ear, per protocol, so it drains correctly; +w-protocol')
line(2, T, 1, 'Its height is set to a point at his ear.',
     'Its height is set to a point near his ear, per protocol.',
     '높이는 프로토콜에 따라 귀 근처의 한 지점에 맞춰 설정돼 있어요')

# 15. ICP·CPP 모니터 판독 [0]
T = 'ICP·CPP 모니터 판독'
o = "One number is the pressure in his brain, the other is his brain's blood flow."
n = 'One number is the pressure in his brain, the other is the pressure pushing blood into his brain.'
OLD.append(o)
replace(doc, CH, 3, T, 0, o, {
    'en': n,
    'ko': '한 수치는 뇌압이고, 다른 하나는 뇌로 혈액을 밀어 넣는 압력이에요.',
    'chunks': ['One number is', 'the pressure in his brain', ', the other is', 'the pressure pushing blood', 'into his brain', '.'],
    'words': ['w-number', 'w-pressure', 'w-brain', 'w-blood', 'w-push'],
    'why': ("One…, the other…로 두 수치를 짝지어 소개하면 숫자 둘이 헷갈리지 않아요. "
            "the pressure pushing blood into his brain은 뇌관류압(CPP)을 가족이 알아듣게 풀어 쓴 말이에요."),
    'distractorsKo': ['한 수치는 뇌압이고, 다른 하나는 어제 같은 시각의 뇌압이에요.',
                      '한 수치는 뇌압이고, 다른 하나는 그 뇌압의 목표 범위예요.'],
    'blank': blank('pushing', ['draining', 'holding', 'thinning']),
}, ['en', 'ko', 'chunks', 'words'],
    "CPP는 혈류가 아니라 관류압 → the pressure pushing blood into his brain; −w-flow(3.2 등에서 계속 씀) +w-push")
line(3, T, 2, "The other is his brain's blood flow.",
     'The other is the pressure pushing blood into his brain.',
     '다른 하나는 뇌로 혈액을 밀어 넣는 압력이에요')

# keyPhrase chunks 다시 자르기 — fix-icu-raised-icp-A.md 'chunks (전수)'·'사용자 결정' 표의 3문장
# (6.2 'If it stays / high'(선택)는 붙이면 9단어에 의미 조각 3개라 V8에 걸려 두었다)
recut(11, '발작 예방·감시', 0, "He's on a seizure-prevention medication given his brain injury.",
      ["He's on", 'a seizure-prevention medication', 'given', 'his brain injury', '.'])
recut(14, '진정 중단과 신경검사 균형', 2, "We time the wake-up window when he's most stable.",
      ['We time', 'the wake-up window', "when he's", 'most stable', '.'])
recut(20, '뇌사 진행 인지·검사 연계', 3, "We'll support you and discuss his wishes when you're ready.",
      ["We'll support you", 'and discuss', 'his wishes', "when you're ready", '.'])

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-raised-icp.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-raised-icp.yaml'), CH)
print('icu-raised-icp.yaml 저장')
