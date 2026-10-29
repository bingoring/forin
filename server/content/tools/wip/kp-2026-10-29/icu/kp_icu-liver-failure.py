"""icu-liver-failure — keyPhrase 3문장 교체 + keyPhrase chunks 5문장 다시 자르기(2026-10-29).
base-icu-liver-failure.yaml → icu-liver-failure.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-liver-failure.yaml'))
CH = []
OLD = []


def recut(si, title, index, en, chunks, extra=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(필요하면 decoy도 새 조각 자리에 맞춘다)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    if extra:
        s.update(extra)
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', en)) == 1
    assert s['decoy'] not in chunks and s['decoy'] not in en, s['decoy']
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'] + sorted(extra or {}),
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"})


def drop_word(wid, why):
    remove_word(doc, wid)
    CH.append({'kind': 'word-remove', 'id': wid, 'why': why})


# 5. 응고장애·출혈 위험 관리 [7] — 시술 전 일상 교정 → 처방되면 시술 직전에
T = '응고장애·출혈 위험 관리'
o = "Let's correct with products just before the procedure."
OLD.append(o)
drop_word('w-correct', '7.0 문장을 바꿔 어느 문장도 태그하지 않게 됨')
replace(doc, CH, 7, T, 0, o, {
    'en': "If products are ordered, we'll give them just before the procedure.",
    'ko': '제제가 처방되면 시술 직전에 줄게요.',
    'chunks': ['If products', 'are ordered', ", we'll give them", 'just before the procedure', '.'],
    'words': ['w-product', 'w-give', 'w-procedure'],
    'tag': '투여 시점',
    'why': ("'If products are ordered'로 제제를 줄지는 처방으로 정한다는 점을 먼저 밝히고, 'just before'로 효과가 남아 있을 때 "
            "시술하도록 시점을 맞춰요. 간 질환에서는 INR만 보고 제제를 주지 않아요."),
    'decoy': ", we'll gives them",
    'distractorsKo': ['제제가 처방되면 먼저 동의서를 받을게요.',
                      '제제가 처방되면 시술 직전에 팔찌를 대조해요.'],
    'blank': blank('procedure', ['transfer', 'rounds', 'handoff']),
}, ['en', 'ko', 'chunks', 'words'],
    "Let's correct with products → If products are ordered, we'll give them(INR만 보고 시술 전 교정은 AGA 2021·AASLD 권고와 반대, 간호사가 교정을 정하는 말); −w-correct(word-remove) +w-give")
s7 = sit(doc, 7, T)
s72 = s7['sentences'][2]
assert s72['en'] == "We'll recheck the coags and watch for bleeding."
assert '교정 후 수치가 따라 올랐는지 봐야 해서' in s72['why']
s72['why'] = s72['why'].replace('교정 후 수치가 따라 올랐는지 봐야 해서', '제제를 줬다면 그 뒤 수치가 어떻게 바뀌었는지 봐야 해서')
od = s7['order']
assert od['why'].startswith('INR이 높다는 말과 함께 혈장이 필요한지 팀에 묻고,')
od['why'] = od['why'].replace('INR이 높다는 말과 함께 혈장이 필요한지 팀에 묻고,', 'INR이 높다고 알리되 혈장을 줄지는 팀에 묻고,')

# 6. 영양·단백 관리 [13] — 암모니아로 단백 조정 → 필요에 맞춰
T = '영양·단백 관리'
o = 'We adjust it carefully based on your ammonia.'
OLD.append(o)
replace(doc, CH, 13, T, 1, o, {
    'en': 'We adjust it carefully based on your needs.',
    'ko': '필요한 양을 보고 조심스럽게 조정해요.',
    'chunks': ['We adjust it carefully', 'based on', 'your needs', '.'],
    'words': ['w-adjust', 'w-carefully', 'w-base'],
    'tag': '맞춤 조정',
    'why': ("'carefully'는 서두르지 않고 조금씩 맞춘다는 뜻이고, 'based on your needs'는 정해진 수치가 아니라 그 사람의 상태와 "
            "근육량에 맞춘다는 말이에요. 간질환에서는 보통 단백질을 일부러 줄이지 않아요."),
    'decoy': 'We adjusts it carefully',
    'distractorsKo': ['필요한 양을 보고 빠르게 조정해요.',
                      '입맛을 보고 조심스럽게 조정해요.'],
    'blank': blank('carefully', ['rarely', 'loosely', 'once']),
}, ['en', 'ko', 'chunks', 'words'],
    'based on your ammonia → based on your needs(단백질은 암모니아로 조정하지 않음 — ESPEN·AASLD); −w-ammonia 태그(1.1·2.3에서 계속 씀)')
od = sit(doc, 13, T)['order']
l = od['lines'][1]
assert l['en'] == 'We adjust that protein carefully based on your ammonia.'
l['en'] = 'We adjust that protein carefully based on your needs.'
l['ko'] = '그 단백질은 필요한 양을 보고 조심스럽게 조정해요'
assert '수치로 조정한다고 알린 뒤' in od['why']
od['why'] = od['why'].replace('수치로 조정한다고 알린 뒤', '필요한 양에 맞춰 조정한다고 알린 뒤')

# 7. 급성 간부전 뇌부종 뇌탈출 위기 [15] — as ordered 덧붙임
T = '급성 간부전 뇌부종 뇌탈출 위기'
o = 'Give the hypertonic saline and elevate his head.'
OLD.append(o)
replace(doc, CH, 15, T, 0, o, {
    'en': 'Give the hypertonic saline as ordered and elevate his head.',
    'ko': '고장성 식염수를 처방대로 주고 머리를 높이세요.',
    'chunks': ['Give', 'the hypertonic saline', 'as ordered', 'and elevate', 'his head', '.'],
    'why': ("명령문은 동사로 시작해 위급할 때 짧게 전달되고, 'as ordered'로 처방된 대로 준다는 점을 밝혀요. "
            "고장성 식염수와 머리 거상은 뇌압을 낮추는 두 가지 조치예요."),
    'distractorsKo': ['고장성 식염수를 처방대로 주고 나트륨을 재세요.',
                      '고장성 식염수를 처방대로 주고 정맥관 위치를 보세요.'],
}, ['en', 'ko', 'chunks'], "as ordered 덧붙임(처방 단서 없이 동료에게 고장성 식염수 지시) — words 그대로")

# keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-liver-failure-A.md '사용자 결정' 표
recut(3, '출혈 경향 감시', 2, 'Please tell me about any new bleeding right away.',
      ['Please', 'tell me', 'about any new bleeding', 'right away', '.'], {'decoy': 'tells me'})
recut(10, '이식 평가 연계', 2, "I'll help connect you with the transplant coordinator.",
      ["I'll help", 'connect you', 'with the transplant coordinator', '.'], {'decoy': 'connects you'})
recut(12, '감염 예방·조기 치료', 0, "Let's keep up strict hand hygiene and line care.",
      ["Let's", 'keep up', 'strict hand hygiene', 'and line care', '.'])
recut(19, '응급 이식 조율 위기', 1, "I'll give a full handoff to the transplant center.",
      ["I'll give", 'a full handoff', 'to', 'the transplant center', '.'])
recut(2, '락툴로오스 투여·배변 관리', 1, 'We aim for a few soft stools a day.',
      ['We aim for', 'a few', 'soft stools', 'a day', '.'])

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-liver-failure.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-liver-failure.yaml'), CH)
print('icu-liver-failure.yaml 저장')
