"""icu-electrolytes — keyPhrase 3문장 교체 + keyPhrase chunks 4문장 다시 자르기(2026-10-27).
base-icu-electrolytes.yaml → icu-electrolytes.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-electrolytes.yaml'))
CH = []
OLD = []

# 1. 전해질 패널 추세 사정 [0]
T = '전해질 패널 추세 사정'
o = 'We check his electrolytes to see how his body is balancing.'
n = 'We check his electrolytes to see how well his body is keeping them balanced.'
nko = '몸이 전해질 균형을 얼마나 잘 지키고 있는지 보려고 전해질을 확인해요.'
OLD.append(o)
replace(doc, CH, 0, T, 0, o, {
    'en': n,
    'ko': nko,
    'chunks': ['We check', 'his electrolytes', 'to see how well', 'his body', 'is keeping them balanced', '.'],
    'words': ['w-check', 'w-electrolyte', 'w-keep', 'w-balance'],
    'why': ("'to see how well'로 검사 목적을 먼저 말하면 가족이 왜 자꾸 피를 뽑는지 이해해요. "
            "'keeping them balanced'는 몸이 전해질을 스스로 알맞게 맞춰 두는지를 본다는 뜻이에요."),
    'distractorsKo': ['몸이 전해질 균형을 얼마나 잘 지키고 있는지 보려고 소변을 확인해요.',
                      '몸이 전해질 균형을 얼마나 잘 지키고 있는지 보려고 심전도를 확인해요.'],
    'blank': blank('balanced', ['warm', 'quiet', 'hidden']),
}, ['en', 'ko', 'chunks', 'words'],
    'how his body is balancing(무엇의 균형인지 없는 자동사) → how well his body is keeping them balanced; +w-keep')
ol = sit(doc, 0, T)['order']
l = ol['lines'][0]
assert l['en'] == o
l['en'] = n
l['ko'] = '몸이 전해질 균형을 얼마나 잘 지키고 있는지 보려고 전해질을 확인해요'

# 2. 종양용해증후군 대사 관리 [1]
T = '종양용해증후군 대사 관리'
o = "Let's ensure aggressive fluids and check for low calcium."
n = "Let's start aggressive fluids and check for low calcium."
OLD.append(o)
remove_word(doc, 'w-ensure')
CH.append({'kind': 'word-remove', 'id': 'w-ensure', 'why': '바꾼 문장에 ensure가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 14, T, 1, o, {
    'en': n,
    'ko': '적극적인 수액 시작하고 저칼슘 확인하겠습니다.',
    'chunks': ["Let's start", 'aggressive fluids', 'and check', 'for low calcium', '.'],
    'words': ['w-start', 'w-aggressive', 'w-fluid', 'w-check', 'w-low', 'w-calcium'],
    'why': ("'Let's start'는 수액을 지금 시작하자는 팀 제안이에요. 'aggressive fluids'는 소변을 많이 만들어 노폐물을 씻어 내려는 치료이고, "
            "'check for low calcium'은 인산이 오르면 칼슘이 떨어질 수 있어서예요."),
    'distractorsKo': ['적극적인 수액 시작하고 저칼슘 여부를 보고하겠습니다.',
                      '적극적인 수액은 요산을 씻어 내 콩팥을 지켜요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'ensure aggressive fluids(잘 안 쓰는 결합) → start aggressive fluids; −w-ensure(은행에서 지움) +w-start')
S = sit(doc, 14, T)
ol = S['order']
l = ol['lines'][2]
assert l['en'] == "To manage that, let's ensure aggressive fluids and check for low calcium."
l['en'] = "To manage that, let's start aggressive fluids and check for low calcium."
l['ko'] = '그걸 관리하려고 적극적인 수액을 시작하고 저칼슘을 확인하겠습니다'
# 뉘앙스 context가 지운 w-ensure를 가리킴 → 세 장면에 이미 있는 aggressive로 옮긴다
cx = [x for x in S['nuance'] if x['kind'] == 'context']
assert len(cx) == 1 and cx[0]['words'] == ['w-ensure']
cx = cx[0]
cx['words'] = ['w-aggressive']
cx['word'] = 'aggressive'
cx['ko'] = '적극적인'
assert cx['scenes'][1]['en'] == 'Can you ensure the fluids are running before his chemo?'
cx['scenes'][1]['en'] = 'Can you start the aggressive fluids before his chemo?'
cx['why'] = ("의료진끼리는 aggressive hydration, euvolemia, crystalloid 같은 말로 수액 관리를 짧게 말해요. "
             "보호자에게는 aggressive가 '공격적인'으로 들려 겁을 주고 euvolemia, resuscitation도 낯설어요. "
             "수액을 넉넉히 줘서 신장을 지킨다는 것만 쉽게 알려 줘요.")

# 3. 생명위협 고칼륨혈증 위기 [2]
T = '생명위협 고칼륨혈증 위기'
o = "Let's activate emergent dialysis to remove the potassium."
n = "Let's call for emergent dialysis to remove the potassium."
OLD.append(o)
remove_word(doc, 'w-activate')
CH.append({'kind': 'word-remove', 'id': 'w-activate', 'why': '바꾼 문장에 activate가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 15, T, 2, o, {
    'en': n,
    'ko': '칼륨 제거하려고 응급 투석 요청하겠습니다.',
    'chunks': ["Let's call for", 'emergent dialysis', 'to remove', 'the potassium', '.'],
    'words': ['w-call', 'w-emergent', 'w-dialysis', 'w-remove', 'w-potassium'],
    'tag': '투석 요청',
    'why': ("'call for'는 다른 팀에 바로 와 달라고 요청하는 말이라 투석을 부를 때 맞아요. "
            "'emergent'는 지금 바로 해야 하는 응급이라는 뜻이고, 약으로는 부족할 때 투석이 칼륨을 몸 밖으로 빼 줘요."),
    'distractorsKo': ['열 내리려고 응급 투석 요청하겠습니다.',
                      '통증 줄이려고 응급 투석 요청하겠습니다.'],
    'blank': blank('remove', ['test', 'record', 'chart']),
}, ['en', 'ko', 'chunks', 'words'],
    'activate emergent dialysis(activate는 팀·코드에 씀) → call for emergent dialysis; −w-activate(은행에서 지움) +w-call')
S = sit(doc, 15, T)
sl = [x for x in S['nuance'] if x['kind'] == 'slider']
assert len(sl) == 1 and sl[0]['words'] == ['w-sine', 'w-activate']
sl[0]['words'] = ['w-sine', 'w-dialysis']  # 예문 "… prepare dialysis"에 있는 말

# keyPhrase chunks 다시 자르기 (en 그대로)
RECUT = [
    (1, '정맥 보충 안전 투여', 0, 'We give potassium slowly and at a safe concentration.',
     ['We give potassium', 'slowly', 'and', 'at a safe concentration', '.'], '전치사 at을 목적어와 떼어 놓은 chunks(and at / a safe concentration)를 구 단위로'),
    (4, '교정 중 재검·모니터', 1, 'Frequent labs help us avoid over- or under-correcting.',
     ['Frequent labs', 'help us', 'avoid', 'over- or under-correcting', '.'], 'over-를 혼자 떼어 놓은 chunks(avoid over- / or under-correcting)를 구 단위로'),
    (16, '급격 저나트륨 경련 위기', 0, "He's seizing from acute severe hyponatremia.",
     ["He's seizing", 'from', 'acute severe hyponatremia', '.'], '수식어 둘을 갈라 놓은 chunks(from acute / severe hyponatremia)를 구 단위로'),
    (19, '저칼슘 후두경련·발작 위기', 2, "Let's monitor his heart and recheck the ionized calcium.",
     ["Let's monitor", 'his heart', 'and recheck', 'the ionized calcium', '.'], '형용사-명사를 끊은 chunks(the ionized / calcium)를 구 단위로'),
]
for si, t, i, en, chunks, why in RECUT:
    s = sent(doc, si, t, i, en)
    s['chunks'] = chunks
    assert join_chunks(chunks) == en
    assert s['decoy'] not in chunks and s['decoy'] not in en
    CH.append({'kind': 'sentence', 'situation': t, 'index': i, 'fields': ['chunks'], 'why': f'keyPhrase {why}'})

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-electrolytes.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-electrolytes.yaml'), CH)
print('icu-electrolytes.yaml 저장')
