"""icu-shock — keyPhrase 3문장 교체 + 해설 1건(2026-10-26). base-icu-shock.yaml → icu-shock.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-shock.yaml'))
CH = []
OLD = []

# 21. 소생 목표와 무의미성 갈등 [0]
T = '소생 목표와 무의미성 갈등'
o = "I understand how hard this is, and we're not giving up on him."
OLD.append(o)
replace(doc, CH, 20, T, 0, o, {
    'en': "I understand how hard this is, and we're not giving up on caring for him.",
    'ko': '이게 얼마나 힘든 일인지 이해해요, 그리고 저희는 그분을 돌보는 일을 포기하지 않아요.',
    'chunks': ['I understand', 'how hard this is', ", and we're not", 'giving up', 'on caring for him', '.'],
    'words': ['w-understand', 'w-hard', 'w-care'],
    'why': ("I understand …로 먼저 공감하고 and로 약속을 이어요. giving up on caring for him은 포기하지 않는 것이 치료 전부가 아니라 "
            "그분을 돌보는 일이라고 정확히 말해서, 치료 목표가 바뀌어도 편안함을 지키는 돌봄은 계속된다는 뜻이 돼요. "
            "지킬 수 없는 약속을 하지 않으면서 버려진다는 느낌을 덜어 줘요."),
    'distractorsKo': ['이게 얼마나 놀라운 일인지 이해해요, 그리고 저희는 그분을 돌보는 일을 포기하지 않아요',
                      '이게 얼마나 힘든 일인지 이해해요, 그리고 저희는 가족분들을 돌보는 일을 포기하지 않아요'],
}, ['en', 'ko', 'chunks', 'words'], "not giving up on him(치료 전부를 약속하는 것처럼 들림) → not giving up on caring for him; +w-care")

# 22. 심장압전 응급 심낭천자 보조 [1]
T = '심장압전 응급 심낭천자 보조'
o = "I'll set up the pericardiocentesis tray and prime the monitor."
OLD.append(o)
replace(doc, CH, 17, T, 1, o, {
    'en': "I'll set up the pericardiocentesis tray and prime the pressure line.",
    'ko': '심낭천자 트레이를 준비하고 압력 라인도 채워 둘게요.',
    'chunks': ["I'll set up", 'the pericardiocentesis tray', 'and prime', 'the pressure line', '.'],
    'words': ['w-set', 'w-pericardiocentesis', 'w-tray', 'w-prime', 'w-pressure'],
    'why': ("set up은 바로 쓸 수 있게 펼쳐 둔다는 뜻이고, prime은 압력 라인에 수액을 채워 공기를 빼 둔다는 뜻이에요. "
            "모니터는 채우는 대상이 아니라서 prime 뒤에는 라인이 와요. 심낭천자는 급할 때 하는 시술이라 트레이와 압력 라인을 미리 준비해 두면 의사가 바로 시작할 수 있어요."),
    'distractorsKo': ['심낭천자 트레이를 준비하고 동의서도 챙겨 둘게요',
                      '심낭천자 트레이를 준비하고 수액 라인도 채워 둘게요'],
}, ['en', 'ko', 'chunks', 'words'], "prime the monitor(모니터는 prime하지 않음) → prime the pressure line; −w-monitor(다른 문장에서 계속 씀) +w-pressure")
ol = sit(doc, 17, T)['order']
l2 = ol['lines'][1]
assert l2['en'] == "I'll set up for a pericardiocentesis and prime the monitor."
l2['en'] = "I'll set up for a pericardiocentesis and prime the pressure line."
l2['ko'] = '심낭천자를 준비하고 압력 라인도 채워 둘게요'

# 23. 다장기부전 동반 불응성 쇼크 [1]
T = '다장기부전 동반 불응성 쇼크'
o = 'We need to reassess our goals of treatment.'
OLD.append(o)
remove_word(doc, 'w-treatment')
CH.append({'kind': 'word-remove', 'id': 'w-treatment', 'why': '바꾼 문장에 treatment가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 15, T, 1, o, {
    'en': 'We need to reassess our goals of care.',
    'ko': '돌봄 목표를 다시 검토해야 해요.',
    'chunks': ['We need to', 'reassess our goals', 'of care', '.'],
    'words': ['w-need', 'w-reassess', 'w-goal', 'w-care'],
    'why': ("We need to …는 해야 할 일을 팀 전체의 말로 하는 모양이에요. goals of care는 치료를 더할지 뺄지가 아니라 "
            "환자의 가치와 바람에 맞는 돌봄의 방향을 다시 묻는 정식 표현이라, 가족 회의에서 그대로 써요."),
    'distractorsKo': ['돌봄 일정을 다시 검토해야 해요', '돌봄 비용을 다시 검토해야 해요'],
}, ['en', 'ko', 'chunks', 'words'], "goals of treatment → goals of care(정식 표현); −w-treatment +w-care")
ol = sit(doc, 15, T)['order']
l3 = ol['lines'][2]
assert l3['en'] == 'We need to reassess our goals of treatment.'
l3['en'] = 'We need to reassess our goals of care.'
l3['ko'] = '돌봄 목표를 다시 검토해야 해요'

# 24. 젖산 클리어런스 목표 평가 [1] — en 그대로, why만
s = sent(doc, 12, '젖산 클리어런스 목표 평가', 1, "We're aiming for at least a 10 percent clearance.")
s['why'] = ("at least는 그 이상이면 좋다는 최소 기준이에요. 클리어런스는 시간이 지나며 수치가 얼마나 줄었는지 보는 값이라 퍼센트로 목표를 정해 소통해요. "
            "목표치는 병원 프로토콜을 따르고, 젖산은 보통 2시간 간격으로 다시 재서 확인해요.")

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-shock.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-shock.yaml'), CH)
print('icu-shock.yaml 저장')
