"""icu-transfusion — keyPhrase 5문장 교체 + keyPhrase chunks 7문장 다시 자르기(2026-10-29 묶음 7 결정 '추천대로').
base-icu-transfusion.yaml → icu-transfusion.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-transfusion.yaml'))
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


def order_line(si, title, li, old_en, new):
    od = sit(doc, si, title)['order']
    l = od['lines'][li]
    assert l['en'] == old_en, (title, li, l['en'])
    l.update(new)
    assert len(l['en'].split()) <= 15, l['en']
    return od


# 1. 급성 용혈 아나필락시스 위기 [16] 문장 3 — 수액 최대·코드팀 → 수액 볼루스·ICU 담당의
T = '급성 용혈 아나필락시스 위기'
o = "I'm opening fluids wide and calling the code team."
OLD.append(o)
drop_word('w-wide', '16.3 문장을 바꿔 어느 문장도 태그하지 않게 됨')
doc['words'].append({
    'id': 'w-bolus', 'en': 'bolus', 'ipa': '/ˈboʊləs/', 'ko': '볼루스', 'icon': 'pill',
    'example': "I'm starting a fluid bolus and calling the ICU doctor now.",
    'exKo': '수액 볼루스를 시작하고 지금 ICU 담당의를 부를게요.',
    'cue': '정해진 양을 짧은 시간에 한꺼번에 넣는 투여 방식',
    'tag': '처치·약물',
    'distractorsEn': ['bonus', 'bolts'],
    'distractorsKo': ['점적 주입', '경구 투여'],
    'chips': [['bo', 'lus']],
    'decoyChips': ['ba', 'less'],
})
CH.append({'kind': 'word-add', 'id': 'w-bolus', 'why': '16.3 새 문장(fluid bolus)의 가르칠 말 — v44+v45 필드 전부'})
code_19_5 = sent(doc, 19, '대량수혈 저칼슘 심정지 위기', 5, 'I need the code team here right now.')
replace(doc, CH, 16, T, 3, o, {
    'en': "I'm starting a fluid bolus and calling the ICU doctor now.",
    'ko': '수액 볼루스를 시작하고 지금 ICU 담당의를 부를게요.',
    'chunks': ["I'm starting", 'a fluid bolus', 'and calling', 'the ICU doctor', 'now', '.'],
    'words': ['w-start', 'w-fluid', 'w-bolus', 'w-call'],
    'tag': '수액·의사 호출',
    'why': ("아나필락시스의 저혈압에는 에피네프린과 함께 수액 볼루스로 순환을 받쳐요(처방·프로토콜에 따라). "
            "맥박이 있는 환자라 심정지 호출(코드)이 아니라 ICU 담당의를 바로 불러요."),
    'decoy': 'and cleaning',
    'distractorsKo': ['수액 볼루스는 아나필락시스 저혈압을 받치려고 줘요',
                      'ICU 담당의가 오면 기도 관리를 함께 정할게요'],
    'blank': blank('bolus', ['chart', 'balance', 'order']),
    '_moved': {'w-code': (code_19_5['en'], code_19_5['ko'])},
}, ['en', 'ko', 'chunks', 'words'],
    '수액 최대 개방·코드팀 호출 → 수액 볼루스·ICU 담당의 호출(맥박 있는 환자에게 심정지 호출 ✕, 수액 최대는 처방 전제 없음); '
    '+w-bolus −w-wide(word-remove) −w-code −w-team 태그(둘 다 다른 문장에 남음)')
od = order_line(16, T, 2, "With the epi going in, I'm opening fluids wide and calling the code team.", {
    'en': "With the epi going in, I'm starting a fluid bolus and calling the ICU doctor.",
    'ko': '에피네프린이 들어가는 동안 수액 볼루스를 시작하고 ICU 담당의를 부를게요',
})
assert od['why'].startswith('증상을 보고하고 중단과 에피네프린을 지시한 뒤, 수액과 코드 호출을 하고,')
od['why'] = od['why'].replace('수액과 코드 호출을 하고,', '수액 볼루스를 시작하며 ICU 담당의를 부르고,')

# 2. TRALI 급성 호흡부전 위기 [18] 문장 1 — this is → this looks like
T = 'TRALI 급성 호흡부전 위기'
o = 'Stop the transfusion — this is TRALI, not overload.'
OLD.append(o)
replace(doc, CH, 18, T, 1, o, {
    'en': 'Stop the transfusion — this looks like TRALI, not overload.',
    'ko': '수혈을 멈추세요 — 과부하가 아니라 TRALI 같아요.',
    'chunks': ['Stop the transfusion', '— this looks like', 'TRALI', ', not overload', '.'],
    'why': ("TRALI는 수액 과부하가 아니라 폐 손상이라 이뇨제로 해결되지 않아요. 'looks like'로 의심을 말하고 확정은 의료진에게 맡기며, "
            "중단 지시와 감별을 한 문장에 담았어요."),
    'decoy': 'a rash',
    'distractorsKo': ['수혈을 멈추세요 — 과부하가 아니라 알레르기 같아요.',
                      '수혈을 멈추세요 — TRALI는 이뇨제로 좋아지지 않아요'],
}, ['en', 'ko', 'chunks'], 'this is TRALI → this looks like TRALI(간호사의 진단 단정, TRALI는 배제 진단) — words 그대로')
od = order_line(18, T, 1, o, {'en': 'Stop the transfusion — this looks like TRALI, not overload.',
                              'ko': '수혈을 멈추세요 — 과부하가 아니라 TRALI 같아요'})
assert od['why'].startswith('호흡부전을 보고하고 중단과 감별을 알린 뒤,')
od['why'] = od['why'].replace('중단과 감별을 알린 뒤,', '수혈을 멈추고 TRALI가 의심된다고 알린 뒤,')

# 3. DIC 출혈·혈전 동반 위기 [17] 문장 1 — this is DIC → this looks like DIC (chunks도 구 경계로)
T = 'DIC 출혈·혈전 동반 위기'
o = "He's bleeding from every puncture site — this is DIC."
OLD.append(o)
replace(doc, CH, 17, T, 1, o, {
    'en': "He's bleeding from every puncture site — this looks like DIC.",
    'ko': '모든 천자 부위에서 출혈이 있어요 — DIC 같아요.',
    'chunks': ["He's bleeding", 'from every puncture site', '— this looks like', 'DIC', '.'],
    'why': ("채혈과 정맥 천자 부위마다 피가 멈추지 않는 것은 DIC의 대표 소견이에요. "
            "'looks like'로 의심을 알리고 확정은 검사와 의료진에게 맡겨요."),
    'decoy': 'from every old scar',
    'distractorsKo': ['모든 천자 부위에서 통증이 있어요 — DIC 같아요.',
                      '모든 천자 부위에서 출혈이 있어요 — 감염 같아요.'],
}, ['en', 'ko', 'chunks'], "this is DIC → this looks like DIC(진단 단정) + chunks 구 경계(every puncture / site 끊김) — words 그대로")
od = order_line(17, T, 0, o, {'en': "He's bleeding from every puncture site — this looks like DIC.",
                              'ko': '모든 천자 부위에서 출혈이 있어요 — DIC 같아요', 'note': '의심'})
assert od['why'].startswith('DIC임을 알리고')
od['why'] = od['why'].replace('DIC임을 알리고', 'DIC가 의심된다고 알리고', 1)

# 4. 알레르기·발열 반응 관리 [13] 문장 1 — 간호사 판단 투약 → 처방자에게 묻기
T = '알레르기·발열 반응 관리'
o = "For mild hives, I'll pause and give an antihistamine."
OLD.append(o)
replace(doc, CH, 13, T, 1, o, {
    'en': "For mild hives, I'll pause it and ask the provider about an antihistamine.",
    'ko': '경미한 두드러기면 잠시 멈추고 의료진에게 항히스타민제를 물어볼게요.',
    'chunks': ['For mild hives', ", I'll pause it", 'and ask the provider', 'about an antihistamine', '.'],
    'words': ['w-mild', 'w-hives', 'w-pause', 'w-ask', 'w-provider', 'w-antihistamine'],
    'icon': 'speech',
    'why': ("경미한 두드러기라도 수혈을 잠시 멈추고 처방자에게 알려요. 'ask the provider about'으로 항히스타민제 투여와 "
            "재개를 간호사가 혼자 정하지 않고 처방대로 한다는 점을 밝혀요."),
    'decoy': 'about a blanket',
    'distractorsKo': ['경미한 두드러기는 수혈 중에 비교적 흔하고 대개 금방 가라앉는 편이에요',
                      '경미한 두드러기는 대개 공여자 혈장 속 단백질에 대한 알레르기예요'],
}, ['en', 'ko', 'chunks', 'words'], "pause and give an antihistamine → pause it and ask the provider about an antihistamine(보고 단계 없이 간호사 판단 투약으로 들림); +w-ask +w-provider")

# 5. 혈액 성분 종류 이해 [3] 문장 1 — 쉼표 이음 → and
T = '혈액 성분 종류 이해'
o = 'FFP replaces clotting factors, platelets treat thrombocytopenia.'
OLD.append(o)
replace(doc, CH, 3, T, 1, o, {
    'en': 'FFP replaces clotting factors, and platelets treat thrombocytopenia.',
    'chunks': ['FFP replaces', 'clotting factors', ', and platelets', 'treat thrombocytopenia', '.'],
    'why': "FFP는 응고인자를, 혈소판은 혈소판 수치를 채워요. 두 절을 'and'로 이어 두 성분의 역할을 나란히 말하면 덜 헷갈려요.",
    'decoy': 'treats thrombocytopenia',
}, ['en', 'chunks'], '쉼표로 두 절을 이은 문법 오류 → and로 이음 — ko·words 그대로')

# keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-transfusion-A.md K13 (17.1은 위 3번에서 함께)
recut(0, '수혈 전 확인·동의', 5, 'Consent is signed and in the chart.',
      ['Consent', 'is signed', 'and in the chart', '.'], {'decoy': 'and in the drawer'})
recut(1, '수혈 시작·초기 감시', 0, "I'll run it slow for the first fifteen minutes.",
      ["I'll run it", 'slow', 'for', 'the first fifteen minutes', '.'])
recut(2, '수혈 반응 징후 인지', 0, 'Fever, rash, or dyspnea can signal a transfusion reaction.',
      ['Fever, rash,', 'or dyspnea', 'can signal', 'a transfusion reaction', '.'])
recut(7, 'TACO와 TRALI 감별', 2, 'TRALI is non-cardiogenic with normal filling pressures.',
      ['TRALI is', 'non-cardiogenic', 'with normal filling pressures', '.'], {'decoy': 'with missing filling pressures'})
recut(8, '대량수혈 비율 관리', 4, 'Next cooler is on the way from the blood bank.',
      ['Next cooler', 'is', 'on the way', 'from the blood bank', '.'])
recut(11, '항응고 역전 관리', 2, 'For his DOAC, we may need the specific reversal agent.',
      ['For his DOAC', ', we', 'may need', 'the specific reversal agent', '.'], {'decoy': 'may needs'})
recut(12, '혈소판 수혈 적응 판단', 3, 'Before a procedure, we aim for a higher count.',
      ['Before a procedure', ', we', 'aim for', 'a higher count', '.'], {'decoy': 'aims for'})

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-transfusion.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-transfusion.yaml'), CH)
print('icu-transfusion.yaml 저장')
