"""icu-pain-nonverbal — keyPhrase 4문장 교체(2026-10-27). base-icu-pain-nonverbal.yaml → icu-pain-nonverbal.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-pain-nonverbal.yaml'))
CH = []
OLD = []

# 15. 급성 심한 통증 위기 [1]
T = '급성 심한 통증 위기'
o = "Let's rule out ischemia and give urgent analgesia."
OLD.append(o)
replace(doc, CH, 15, T, 1, o, {
    'en': "Let's rule out ischemia and get urgent analgesia ordered.",
    'ko': '허혈을 배제하고 긴급 진통제 처방을 받아요.',
    'chunks': ["Let's rule out", 'ischemia', 'and get', 'urgent analgesia', 'ordered', '.'],
    'words': ['w-rule', 'w-ischemia', 'w-urgent', 'w-analgesia'],
    'why': ("rule out은 의심되는 원인을 하나씩 지워 간다는 구동사예요. get … ordered는 진통을 미루지 않되 처방을 받아서 한다는 말이라, "
            "원인 찾기와 진통 준비를 함께 진행해요."),
    'decoy': 'an allergy',
    'distractorsKo': ['허혈을 배제하고 긴급 진통제 투여를 기록해요.',
                      '감염을 배제하고 긴급 진통제 처방을 받아요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'give urgent analgesia(처방·프로토콜 조건이 없는 진통 지시) → get urgent analgesia ordered; −w-give(다른 문장에서 계속 씀)')

# 16. 임종기 통증·호흡곤란 완화 [4]
T = '임종기 통증·호흡곤란 완화'
o = 'You can stay close and talk to him — he can feel your presence.'
OLD.append(o)
remove_word(doc, 'w-presence')
CH.append({'kind': 'word-remove', 'id': 'w-presence', 'why': '바꾼 문장에 presence가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 18, T, 4, o, {
    'en': 'You can stay close and talk to him — he may still hear you.',
    'ko': '가까이서 이야기해주세요 — 아직 들으실 수도 있어요.',
    'chunks': ['You can', 'stay close', 'and talk to him', '— he may still hear you', '.'],
    'words': ['w-stay'],
    'why': ("You can stay close는 곁에 있어도 된다는 허락이에요. may still로 확인할 수 없는 일을 단정하지 않고 가능성으로 전해요 — "
            "청각은 마지막까지 남을 수 있다고 알려져 있어 말을 걸어도 된다는 근거가 돼요."),
    'distractorsKo': ['가까이서 노래해주세요 — 아직 들으실 수도 있어요.',
                      '가까이서 이야기해주세요 — 아직 보실 수도 있어요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'he can feel your presence(의식 없는 환자가 느낀다는 단정) → he may still hear you; −w-presence(은행에서 지움)')

# 17. 통증 조절 실패·불응 [4]
T = '통증 조절 실패·불응'
o = 'We escalate to keep him from suffering.'
OLD.append(o)
replace(doc, CH, 19, T, 4, o, {
    'en': 'We escalate his treatment to keep him from suffering.',
    'chunks': ['We escalate', 'his treatment', 'to keep him', 'from suffering', '.'],
    'why': ("escalate his treatment로 무엇을 올리는지 목적어까지 밝혀 지금 요법에서 더 강한 대응으로 넘어간다고 말해요. "
            "keep him from suffering이 목적이라 올리는 이유가 환자의 고통이고, 상향은 처방과 협진을 거쳐요."),
}, ['en', 'chunks'], 'We escalate(무엇을 올리는지 없음) → We escalate his treatment(ko는 이미 "치료 단계를 올려요")')

# 18. 가족의 대리 통증 관찰 활용 [0]
T = '가족의 대리 통증 관찰 활용'
o = 'You know him best — that furrowed brow is helpful to know.'
OLD.append(o)
remove_word(doc, 'w-helpful')
CH.append({'kind': 'word-remove', 'id': 'w-helpful', 'why': '바꾼 문장에 helpful이 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 14, T, 0, o, {
    'en': 'You know him best — telling us about that furrowed brow helps.',
    'chunks': ['You know him best', '— telling us', 'about that furrowed brow', 'helps', '.'],
    'words': ['w-tell', 'w-furrow', 'w-brow', 'w-help'],
    'why': ("You know him best로 가족의 지식을 먼저 인정하면 정보를 나누기 쉬워져요. telling us … helps로 알려 주는 일 자체가 "
            "도움이 된다고 말해 앞으로도 알려 주게 해요."),
}, ['en', 'chunks', 'words'],
    'that furrowed brow is helpful to know(어색함) → telling us about that furrowed brow helps(ko는 이미 "알려 주셔서 도움이 돼요"); −w-helpful(은행에서 지움) +w-tell·w-help')

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-pain-nonverbal.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-pain-nonverbal.yaml'), CH)
print('icu-pain-nonverbal.yaml 저장')
