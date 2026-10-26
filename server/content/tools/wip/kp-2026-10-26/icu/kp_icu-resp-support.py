"""icu-resp-support — keyPhrase 3문장 교체(2026-10-26). base-icu-resp-support.yaml → icu-resp-support.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-resp-support.yaml'))
CH = []
OLD = []

# 16. 심인성 폐부종 CPAP [2]
T = '심인성 폐부종 CPAP'
o = "Try to breathe with the machine; you'll feel relief soon."
OLD.append(o)
replace(doc, CH, 9, T, 2, o, {
    'en': 'Try to breathe with the machine; you should start to feel some relief soon.',
    'ko': '기계에 맞춰 숨을 쉬어 보세요, 곧 조금씩 편해지기 시작하실 거예요.',
    'chunks': ['Try to breathe', 'with the machine;', 'you should start', 'to feel some relief', 'soon', '.'],
    'why': ("Try to…는 명령 대신 부탁으로 들려요. you should start to feel some relief는 '곧 편해질 거예요'라는 장담 대신 "
            "조금씩 나아지기 시작할 거라는 기대로 말해요. CPAP이 듣지 않으면 다음 단계 치료를 생각해야 해서 결과를 약속하지 않아요."),
    'distractorsKo': ['기계에 맞춰 숨을 쉬어 보세요, 곧 조금씩 졸리기 시작하실 거예요.',
                      '기계에 맞춰 숨을 쉬어 보세요, 곧 조금씩 입이 마르기 시작하실 거예요.'],
}, ['en', 'ko', 'chunks'], "you'll feel relief soon(결과 장담) → you should start to feel some relief soon")
ol = sit(doc, 9, T)['order']
l3 = ol['lines'][2]
assert l3['en'] == "If you do, the fluid should clear and you'll feel relief soon."
l3['en'] = 'If you do, the fluid should clear and you should feel some relief.'
l3['ko'] = '그러면 체액이 빠지면서 조금씩 편해지실 거예요'
ol['why'] = ("장치가 하는 일을 먼저 말하고, 기계에 맞춰 숨 쉬어 달라고 부탁한 뒤, 그러면 체액이 빠지며 조금씩 편해질 거라고 기대를 말하고, "
             "심장 부담까지 이어요. 3줄의 If you do는 2줄의 부탁을, 4줄의 that은 3줄의 변화를 가리켜서 순서가 하나예요.")

# 17. 면역저하 환자 NIV 선택 [0]
T = '면역저하 환자 NIV 선택'
o = 'For immunocompromised patients, NIV can avoid ventilator infections.'
OLD.append(o)
replace(doc, CH, 13, T, 0, o, {
    'en': 'For immunocompromised patients, NIV can help avoid ventilator-associated infections.',
    'ko': '면역저하 환자에게는 NIV가 인공호흡기 관련 감염을 피하는 데 도움이 될 수 있어요.',
    'chunks': ['For immunocompromised patients,', 'NIV can help', 'avoid', 'ventilator-associated infections', '.'],
    'why': ("can help avoid는 '피하는 데 도움이 될 수 있다'는 가능성 표현이라 NIV가 감염을 완전히 막는다는 과장을 피해요. "
            "ventilator-associated는 삽관하고 인공호흡기를 쓰면서 생기는 감염(인공호흡기 관련 폐렴 등)을 가리키는 정식 표현이에요."),
    'distractorsKo': ['면역저하 환자에게는 NIV가 인공호흡기 관련 소음을 피하는 데 도움이 될 수 있어요.',
                      '어린이에게는 NIV가 인공호흡기 관련 감염을 피하는 데 도움이 될 수 있어요.'],
}, ['en', 'ko', 'chunks'], "can avoid ventilator infections(과장·비정식 용어) → can help avoid ventilator-associated infections")

# 18. NIV 지연 호흡정지 임박 [2]
T = 'NIV 지연 호흡정지 임박'
o = "We should have escalated sooner; let's secure the airway immediately."
OLD.append(o)
replace(doc, CH, 16, T, 2, o, {
    'en': "We need to escalate now; let's secure the airway immediately.",
    'ko': '지금 단계를 올려야 해요, 바로 기도를 확보해요.',
    'chunks': ['We need to escalate', 'now;', "let's secure", 'the airway immediately', '.'],
    'tag': '단계 상승',
    'why': ("We need to escalate now는 지난 판단을 돌아보지 않고 지금 할 일만 말해요. 위기 한복판에서 '더 일찍 했어야'는 탓으로 들려 팀을 흔들 수 있어 "
            "그런 이야기는 사후 디브리핑으로 미루고, 세미콜론 뒤에 바로 행동 지시를 이어요."),
    'distractorsKo': ['지금 기록을 남겨야 해요, 바로 기도를 확보해요.',
                      '지금 자세를 바꿔야 해요, 바로 기도를 확보해요.'],
    'blank': blank('escalate', ['explain', 'argue', 'apologize']),
}, ['en', 'ko', 'chunks'], "We should have escalated sooner(위기 중 탓으로 들림) → We need to escalate now")

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-resp-support.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-resp-support.yaml'), CH)
print('icu-resp-support.yaml 저장')
