"""icu-arrhythmia — keyPhrase 4문장 교체(2026-10-26). base-icu-arrhythmia.yaml → icu-arrhythmia.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-arrhythmia.yaml'))
CH = []
OLD = []

# 4·7. 예정 심율동전환 준비 [1][0]
T = '예정 심율동전환 준비'
o = "You'll get sedation, so you won't feel the shock."
OLD.append(o)
replace(doc, CH, 12, T, 1, o, {
    'en': "You'll get sedation, so you shouldn't feel the shock.",
    'ko': '진정제를 드릴 테니 전기충격은 아마 느끼지 못하실 거예요.',
    'chunks': ["You'll get sedation", ', so you', "shouldn't feel", 'the shock', '.'],
    'why': ("shouldn't feel은 '느끼지 않을 거예요'라는 장담 대신 '느끼지 않는 게 보통'이라는 기대로 말해요. "
            "진정 깊이에 따라 드물게 기억하는 환자도 있어서, 가장 걱정하는 아픔을 덜어 주면서도 약속은 하지 않아요."),
    'distractorsKo': ['진정제를 드릴 테니 주사는 아마 느끼지 못하실 거예요.',
                      '진정제를 드릴 테니 전기충격은 아마 듣지 못하실 거예요.'],
}, ['en', 'ko', 'chunks'], "won't feel(장담) → shouldn't feel(기대)")

o = "We'll confirm your blood thinner has been at the right level."
OLD.append(o)
replace(doc, CH, 12, T, 0, o, {
    'en': "We'll confirm you've been taking your blood thinner as prescribed.",
    'ko': '혈액희석제를 처방대로 드셔 왔는지 확인할게요.',
    'chunks': ["We'll confirm", "you've been taking", 'your blood thinner', 'as prescribed', '.'],
    'words': ['w-confirm', 'w-blood', 'w-thinner'],
    'why': ("you've been taking은 현재완료진행형이라 '그동안 빠짐없이 계속 드셨는지'를 물어요. 심율동전환 전에는 혈전을 막으려고 "
            "정해진 기간 동안 항응고를 이어 왔는지가 중요하고, 수치를 재지 않는 약도 많아서 처방대로 복용했는지를 확인해요."),
    'decoy': 'for the scan',
    'distractorsKo': ['혈액희석제를 식후에 드셔 왔는지 확인할게요.',
                      '혈액희석제를 처방대로 드셔 왔는지 서류에 적을게요.'],
    'blank': blank('prescribed', ['advertised', 'described', 'promised']),
}, ['en', 'ko', 'chunks', 'words'],
    "has been at the right level(수치 확인 — 수치를 재지 않는 항응고제가 많음) → you've been taking … as prescribed; −w-level(다른 문장에서 계속 씀)")
ol = sit(doc, 12, T)['order']
l1, l4 = ol['lines'][0], ol['lines'][3]
assert l1['en'] == "We'll confirm your blood thinner has been at the right level."
assert l4['en'] == "You'll get sedation, so you won't feel it."
l1['en'] = "We'll confirm you've been taking your blood thinner as prescribed."
l1['ko'] = '혈액희석제를 처방대로 드셔 왔는지 확인할게요'
l4['en'] = "You'll get sedation, so you shouldn't feel it."
l4['ko'] = '진정제를 드릴 테니 아마 느끼지 못하실 거예요'
ol['why'] = ("안전 확인을 먼저 하고, 2줄의 that이 그 확인을 받아 동의서를 살피고, 기계가 하는 일을 설명한 뒤, "
             "4줄의 it이 3줄의 전기충격을 가리켜 진정 덕분에 아마 느끼지 못할 거라는 말로 안심시켜요.")

# 5. 페이스메이커·ICD 환자 모니터 [1]
T = '페이스메이커·ICD 환자 모니터'
o = "If it fires, it's doing its job to protect you."
OLD.append(o)
replace(doc, CH, 13, T, 1, o, {
    'en': "If it fires, it's most likely doing its job to protect you.",
    'ko': '작동하더라도 그건 아마 보호하려는 제 역할을 하는 거예요.',
    'chunks': ['If it fires', ", it's most likely", 'doing its job', 'to protect you', '.'],
    'why': ("doing its job은 '제 일을 하는 중'이라 작동이 고장이 아니라는 안심을 줘요. most likely를 넣은 건 드물게 필요 없는 작동도 있어서예요 — "
            "그래서 작동하면 알려 달라는 말과 함께 써요."),
    'distractorsKo': ['작동하더라도 그건 아마 알려 주려는 제 역할을 하는 거예요.',
                      '작동하더라도 그건 아마 깨우려는 제 역할을 하는 거예요.'],
}, ['en', 'ko', 'chunks'], "it's doing its job(모든 작동이 적절하다고 단정 — 부적절 쇼크 있음) → it's most likely doing its job")
ol = sit(doc, 13, T)['order']
l3 = ol['lines'][2]
assert l3['en'] == "When it does, it's just doing its job to protect you."
l3['en'] = "When it does, it's most likely doing its job to protect you."
l3['ko'] = '작동해도 아마 보호하려는 제 역할을 하는 거예요'

# 6. 경정맥 임시 페이싱 관리 [1]
T = '경정맥 임시 페이싱 관리'
o = 'Let me set the output a bit above the capture threshold.'
OLD.append(o)
remove_word(doc, 'w-bit')
CH.append({'kind': 'word-remove', 'id': 'w-bit', 'why': '바꾼 문장에 bit이 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 11, T, 1, o, {
    'en': 'Let me set the output with a safe margin above the capture threshold.',
    'ko': '출력을 캡처 역치보다 안전 여유를 두고 높게 설정할게요.',
    'chunks': ['Let me set', 'the output', 'with a safe margin', 'above the capture threshold', '.'],
    'words': ['w-set', 'w-output', 'w-above', 'w-capture', 'w-threshold'],
    'why': ("with a safe margin above는 역치에 딱 맞추지 않고 안전한 여유를 두고 그 위로 맞춘다는 말이에요. "
            "실제 값은 처방·지침대로(보통 역치의 2~3배) 맞춰 캡처를 놓치지 않게 해요."),
    'distractorsKo': ['출력을 감지 역치보다 안전 여유를 두고 높게 설정할게요.',
                      '출력을 알람 역치보다 안전 여유를 두고 높게 설정할게요.'],
}, ['en', 'ko', 'chunks', 'words'], 'a bit above(여유가 적게 들림 — 보통 역치의 2~3배) → with a safe margin above; −w-bit')
ol = sit(doc, 11, T)['order']
l1 = ol['lines'][0]
assert l1['en'] == o
l1['en'] = 'Let me set the output with a safe margin above the capture threshold.'
l1['ko'] = '출력을 캡처 역치보다 안전 여유를 두고 높게 설정할게요'
ol['why'] = ("출력을 역치 위로 안전 여유를 두고 맞추고, 그 설정에서의 정상 반응을 설명하고, 선을 고정해 감시하다가 소실되면 출력을 올려요. "
             "2줄의 that setting이 1줄을, 3줄의 one이 2줄의 박동을 가리켜서 순서가 하나예요.")

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-arrhythmia.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-arrhythmia.yaml'), CH)
print('icu-arrhythmia.yaml 저장')
