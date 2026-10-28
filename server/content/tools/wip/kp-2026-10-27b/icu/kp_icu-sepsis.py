"""icu-sepsis — keyPhrase 1문장 교체 + keyPhrase chunks 2문장 다시 자르기(2026-10-27).
base-icu-sepsis.yaml → icu-sepsis.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-sepsis.yaml'))
CH = []
OLD = []

# 4. 감염원 병력·부위 사정 [0] — ko는 수정 단계(K1)에서 이미 새 en에 맞게 고쳐 둠
T = '감염원 병력·부위 사정'
o = "Can you tell me where you've had pain, redness, or a fever?"
n = "Can you tell me where you've had pain or redness, and whether you've had a fever?"
OLD.append(o)
s = replace(doc, CH, 4, T, 0, o, {
    'en': n,
    'chunks': ['Can you tell me', "where you've had", 'pain or redness', ', and whether', "you've had a fever", '?'],
    'why': ("Can you tell me …?는 시험하듯 묻지 않고 부탁하는 모양이에요. 자리가 있는 통증·발적은 where로, "
            "자리가 없는 열은 whether로 따로 물어 두 간접 의문을 한 문장에 담아요."),
}, ['en', 'chunks'], "where … pain, redness, or a fever(열에는 '어디'가 없음) → where … pain or redness, and whether you've had a fever")
assert s['ko'] == '어디가 아프거나 빨갛게 됐는지, 열이 난 적은 있는지 말씀해 주시겠어요?'
assert s['words'] == ['w-tell', 'w-pain', 'w-redness', 'w-fever']
for wid in ['w-pain', 'w-redness', 'w-fever']:
    w = word(doc, wid)
    assert w['example'] == n and w['exKo'] == s['ko'], wid
ol = sit(doc, 4, T)['order']
l = ol['lines'][0]
assert l['en'] == o
# 새 keyPhrase는 16단어라 순서 카드 한 줄(15단어 안쪽)에 맞게 줄인다
l['en'] = 'Where have you had pain or redness, and have you had a fever?'
l['ko'] = '어디가 아프거나 빨갛게 됐고, 열이 난 적은 있나요?'

# keyPhrase chunks 다시 자르기 (en 그대로)
RECUT = [
    (10, '스테로이드 보조 판단', 0, 'His pressure still needs high vasopressor support despite fluids.',
     ['His pressure', 'still needs', 'high vasopressor support', 'despite fluids', '.'], '복합명사를 끊은 chunks(high vasopressor / support)를 구 단위로'),
    (15, '불응성 패혈성 쇼크 다중승압', 2, "Let's call the intensivist and prepare the next line of support.",
     ["Let's call", 'the intensivist', 'and prepare', 'the next line of support', '.'], "'line of support'를 끊은 chunks(the next line / of support)를 구 단위로"),
]
for si, t, i, en, chunks, why in RECUT:
    s = sent(doc, si, t, i, en)
    s['chunks'] = chunks
    assert join_chunks(chunks) == en
    assert s['decoy'] not in chunks and s['decoy'] not in en
    CH.append({'kind': 'sentence', 'situation': t, 'index': i, 'fields': ['chunks'], 'why': f'keyPhrase {why}'})

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-sepsis.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-sepsis.yaml'), CH)
print('icu-sepsis.yaml 저장')
