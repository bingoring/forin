"""icu-mech-ventilation — keyPhrase 4문장 + 일반 문장 2개 교체(2026-10-26). base-icu-mech-ventilation.yaml → icu-mech-ventilation.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-mech-ventilation.yaml'))
CH = []
OLD = []

# 10. 기관튜브 위치·고정 확인 [2]
T = '기관튜브 위치·고정 확인'
o = "The tape is secure, so the tube won't move out of place."
OLD.append(o)
replace(doc, CH, 1, T, 2, o, {
    'en': 'The tape is secure, so the tube is much less likely to move out of place.',
    'ko': '테이프가 잘 고정돼 있어서 튜브가 밀려날 가능성이 훨씬 적어요.',
    'chunks': ['The tape is secure,', 'so the tube', 'is much less likely', 'to move out of place', '.'],
    'why': ("so로 이유와 결과를 잇되, much less likely로 '절대 안 빠진다'가 아니라 '빠질 가능성이 훨씬 적다'고 말해요. "
            "고정해도 튜브는 움직일 수 있어서, 계속 확인한다는 말을 함께 해야 안심이 방심이 되지 않아요."),
    'distractorsKo': ['테이프가 새로 붙어 있어서 튜브가 밀려날 가능성이 훨씬 적어요',
                      '테이프가 잘 고정돼 있어서 튜브가 접힐 가능성이 훨씬 적어요'],
}, ['en', 'ko', 'chunks'], "won't move(장담) → is much less likely to move")

# 14. 회로 연결·습화 점검 [4] (keyPhrase 아님)
T = '회로 연결·습화 점검'
o = 'This water in the tubing is just moisture from his breath, not a problem.'
OLD.append(o)
replace(doc, CH, 2, T, 4, o, {
    'en': "This water in the tubing is just moisture from his breath, and I'll drain it before it builds up.",
    'ko': '튜빙에 있는 물은 호흡에서 나온 수분일 뿐이고, 고이기 전에 빼 드릴게요.',
    'chunks': ['This water in the tubing', 'is just moisture', 'from his breath,', "and I'll drain it", 'before it builds up', '.'],
    'words': ['w-tubing', 'w-moisture', 'w-breath', 'w-drain'],
    'tag': '설명·처치',
    'why': ("just moisture로 숨에서 나온 수분일 뿐이라고 먼저 안심시키고, and I'll drain it으로 그래도 할 일을 덧붙여요. "
            "고인 물은 환자 쪽으로 흘러들거나 기계가 숨을 잘못 감지하게 할 수 있어서, 문제없다고 넘기지 않고 쌓이기 전에 빼요."),
    'distractorsKo': ['튜빙에 있는 물은 입에서 나온 침일 뿐이고, 고이기 전에 빼 드릴게요',
                      '튜빙에 있는 물은 호흡에서 나온 수분일 뿐이고, 고이기 전에 닦아 드릴게요'],
}, ['en', 'ko', 'chunks', 'words'], 'not a problem(고인 물을 방치해도 되는 듯함) → and I\'ll drain it before it builds up; +w-drain')

# 11·15. 기도내압 상승 경보 감별 [2][3]
T = '기도내압 상승 경보 감별'
o = "He's still getting oxygen while I work through the causes."
OLD.append(o)
replace(doc, CH, 8, T, 2, o, {
    'en': "I'm making sure he gets enough oxygen while I work through the causes.",
    'ko': '원인을 찾는 동안 산소가 충분히 들어가는지 계속 확인하고 있어요.',
    'chunks': ["I'm making sure", 'he gets enough oxygen', 'while I work', 'through the causes', '.'],
    'tag': '산소 확인',
    'why': ("I'm making sure는 저절로 된다고 장담하지 않고 간호사가 직접 챙기고 있다는 뜻이에요. 고압 경보는 환기가 제대로 안 들어간다는 신호일 수 있어서, "
            "원인을 찾는 동안에도 산소가 충분한지 먼저 지킨다고 알리면 보호자가 가장 걱정하는 점부터 풀려요."),
    'decoy': 'for the chart',
    'distractorsKo': ['원인을 찾는 동안 수액이 충분히 들어가는지 계속 확인하고 있어요',
                      '원인을 찾는 동안 가습이 충분히 되는지 계속 확인하고 있어요'],
}, ['en', 'ko', 'chunks'], "He's still getting oxygen(고압 경보 중에도 환기가 된다고 단정) → I'm making sure he gets enough oxygen")

o = "This alarm isn't an emergency, it just means I need to look closer."
OLD.append(o)
replace(doc, CH, 8, T, 3, o, {
    'en': "This alarm doesn't always mean an emergency, but I need to look closer right away.",
    'ko': '이 경보가 늘 응급상황이라는 뜻은 아니지만, 바로 더 자세히 봐야 해요.',
    'chunks': ['This alarm', "doesn't always mean", 'an emergency,', 'but I need to look closer', 'right away', '.'],
    'tag': '경보 대응',
    'why': ("doesn't always mean은 '늘 그런 건 아니다'로 오해를 풀되 응급일 가능성은 열어 두는 모양이에요. "
            "but … right away로 그래도 지금 바로 확인한다고 이어서, 가족을 안심시키면서도 경보를 가볍게 넘기지 않아요."),
    'distractorsKo': ['이 경보가 늘 응급상황이라는 뜻은 아니지만, 바로 더 자세히 들어 봐야 해요',
                      '이 경보가 늘 고장이라는 뜻은 아니지만, 바로 더 자세히 봐야 해요'],
}, ['en', 'ko', 'chunks'], "isn't an emergency(응급이 아니라고 단정) → doesn't always mean an emergency, but … right away")

# 12. 인공호흡기 부조화 인지 [1]
T = '인공호흡기 부조화 인지'
o = "I'll adjust the trigger and flow so it matches his effort better."
OLD.append(o)
replace(doc, CH, 9, T, 1, o, {
    'en': "I'll ask RT to adjust the trigger and flow so it matches his effort better.",
    'ko': '호흡치료사에게 트리거와 유량을 조정해 달라고 해서 환자분 호흡 노력에 더 맞출게요.',
    'chunks': ["I'll ask RT", 'to adjust', 'the trigger and flow', 'so it matches', 'his effort better', '.'],
    'tag': '조정 요청',
    'why': ("I'll ask RT to …는 설정 변경을 호흡치료사에게 요청한다는 모양이에요. 미국 병원에서 호흡기 설정은 보통 처방이나 프로토콜에 따라 호흡치료사가 바꿔요. "
            "trigger는 숨 시작 신호의 민감도이고 flow는 기계가 숨을 주는 속도라서, 바꾸면 기계가 환자의 노력에 맞춰져요."),
    'distractorsKo': ['호흡치료사에게 트리거와 알람을 조정해 달라고 해서 환자분 호흡 노력에 더 맞출게요',
                      '호흡치료사에게 트리거와 유량을 조정해 달라고 해서 의사 선생님 요구에 더 맞출게요'],
}, ['en', 'ko', 'chunks'], "I'll adjust(간호사가 직접 설정 변경) → I'll ask RT to adjust")
ol = sit(doc, 9, T)['order']
l3 = ol['lines'][2]
assert l3['en'] == "Once I see it, I'll adjust the trigger and flow to match his effort."
l3['en'] = "Once I see it, I'll ask RT to adjust the settings to match his effort."
l3['ko'] = '찾으면 호흡치료사에게 설정을 조정해 맞춰 달라고 할게요'
ol['why'] = ("어긋난 것 같다고 알리고, 어디서 어긋나는지 파형을 보고, 찾으면 호흡치료사에게 설정 조정을 요청하고, 그러면 환자가 편해 보일 것이라고 맺어요. "
             "Once I see it과 That이 앞 줄의 일을 가리켜서 순서가 하나예요.")

# 13. 심한 부조화 진정 심화 판단 [2]
T = '심한 부조화 진정 심화 판단'
o = "I'll page the intensivist while you draw up the medication."
OLD.append(o)
remove_word(doc, 'w-draw')
CH.append({'kind': 'word-remove', 'id': 'w-draw', 'why': '바꾼 문장에 draw가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 19, T, 2, o, {
    'en': "I'll page the intensivist for orders while you get the medication ready.",
    'ko': '약을 준비하는 동안 저는 중환자전담의를 호출해 처방을 받을게요.',
    'chunks': ["I'll page", 'the intensivist', 'for orders', 'while you get', 'the medication ready', '.'],
    'words': ['w-page', 'w-intensivist', 'w-medication', 'w-ready'],
    'why': ("I'll … while you …는 두 사람이 동시에 각자 맡을 일을 나눠 말하는 모양이에요. for orders를 붙여 약은 처방을 받은 뒤에 준다는 순서를 분명히 하고, "
            "그동안 약을 준비해 두면 처방이 나오는 대로 바로 줄 수 있어요."),
    'distractorsKo': ['약을 준비하는 동안 저는 중환자전담의를 호출해 병상을 물을게요',
                      '기록을 정리하는 동안 저는 중환자전담의를 호출해 처방을 받을게요'],
    'blank': blank('orders', ['supplies', 'visitors', 'transport']),
}, ['en', 'ko', 'chunks', 'words'], 'draw up the medication(처방 전 약 준비가 투여로 이어지는 듯함) → page … for orders while you get the medication ready; −w-draw +w-ready')

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-mech-ventilation.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-mech-ventilation.yaml'), CH)
print('icu-mech-ventilation.yaml 저장')
