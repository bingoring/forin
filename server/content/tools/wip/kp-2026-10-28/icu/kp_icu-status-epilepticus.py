"""icu-status-epilepticus — keyPhrase 3문장 교체(+연쇄 19.3) + keyPhrase chunks 6문장 다시 자르기(2026-10-28).
base-icu-status-epilepticus.yaml → icu-status-epilepticus.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-status-epilepticus.yaml'))
CH = []
OLD = []


def recut(si, title, index, en, chunks, extra=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다."""
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


# 5. 항경련 마취 중 혈역학 붕괴 [19] — 동료에게 승압제 시작을 지시하는 말 → 처방된 승압제를 함께 시작
T = '항경련 마취 중 혈역학 붕괴'
o = 'Start a pressor and give fluid to support his pressure.'
OLD.append(o)
replace(doc, CH, 19, T, 0, o, {
    'en': "Let's start the ordered pressor and give fluid to support his pressure.",
    'ko': '처방된 승압제를 시작하고 수액을 줘서 혈압을 지지하죠.',
    'chunks': ["Let's start", 'the ordered pressor', 'and give fluid', 'to support his pressure', '.'],
    'words': ['w-start', 'w-order', 'w-pressor', 'w-give', 'w-fluid', 'w-support', 'w-pressure'],
    'tag': '처방 시행',
    'why': ("'Let's'로 팀이 함께 움직이자고 말하고, 'the ordered pressor'로 간호사가 정하는 게 아니라 처방된 승압제를 "
            "시작한다는 점을 분명히 해요. 'to support his pressure'가 두 처치의 목적을 붙여요."),
    'decoy': 'the ordered antibiotic',
    'distractorsKo': ['처방된 승압제를 시작하고 수액을 줘서 콩팥을 보호하죠.',
                      '처방된 승압제를 시작하고 수액을 줘서 뇌 혈류를 지키죠.'],
    'blank': blank('pressor', ['antibiotic', 'antiemetic', 'laxative']),
}, ['en', 'ko', 'chunks', 'words'],
    "Start a pressor(동료에게 승압제 시작을 지시 — 업무 범위) → Let's start the ordered pressor; +w-order")

# 연쇄 — 19.3 "deepened the infusion"(어색한 영어)을 KP 6과 같은 sedation으로 (검토 A keyPhrase 표)
o3 = 'His pressure dropped fast right after we deepened the infusion.'
OLD.append(o3)
replace(doc, CH, 19, T, 3, o3, {
    'en': 'His pressure dropped fast right after we deepened the sedation.',
    'ko': '진정을 깊게 한 직후 혈압이 빠르게 떨어졌어요.',
    'chunks': ['His pressure dropped fast', 'right after', 'we deepened', 'the sedation', '.'],
    'words': ['w-pressure', 'w-drop', 'w-fast', 'w-after', 'w-deepen', 'w-sedation'],
    'why': ("'dropped fast'는 빠른 하강을 알리고, 'right after we deepened the sedation'으로 의심되는 처치와 시점을 함께 "
            "보고해 팀이 바로 진정 주입을 다시 보게 해요."),
    'decoy': 'right before',
    'distractorsKo': ['체위를 바꾼 직후 혈압이 빠르게 떨어졌어요.',
                      '흡인을 한 직후 혈압이 빠르게 떨어졌어요.'],
}, ['en', 'ko', 'chunks', 'words'],
    "deepened the infusion(어색한 영어 — 깊게 하는 것은 진정) → deepened the sedation, KP 16.1 교체에 맞춤; −w-infusion(19.2에서 계속 씀) +w-sedation")

s19 = sit(doc, 19, T)
sl, cx = s19['nuance'][0], s19['nuance'][1]
assert sl['kind'] == 'slider' and sl['cue'] == 'Colleague: "His pressure dropped right after we deepened the infusion."'
sl['cue'] = 'Colleague: "His pressure dropped right after we deepened the sedation."'
assert sl['why'].startswith('마취성 주입을 깊게 한 뒤')
sl['why'] = sl['why'].replace('마취성 주입을 깊게 한 뒤', '진정을 깊게 한 뒤', 1)
assert cx['kind'] == 'context' and cx['scenes'][0]['en'] == 'His pressure dropped after we deepened the infusion.'
cx['scenes'][0]['en'] = 'His pressure dropped after we deepened the sedation.'
od = s19['order']
l0, l1 = od['lines'][0], od['lines'][1]
assert l0['en'] == 'His pressure dropped fast right after we deepened the infusion.'
l0['en'] = 'His pressure dropped fast right after we deepened the sedation.'
l0['ko'] = '진정을 깊게 한 직후 혈압이 빠르게 떨어졌어요'
assert l1['en'] == 'Start a pressor and give fluid to support his pressure right now.'
l1['en'] = "Let's start the ordered pressor and give fluid to support his pressure."
l1['ko'] = '처방된 승압제를 시작하고 수액을 줘서 혈압을 지지하죠'
assert '승압제와 수액으로 받치고' in od['why']
od['why'] = od['why'].replace('승압제와 수액으로 받치고', '처방된 승압제와 수액으로 받치고')

# 6. 초불응성 SE 관리 [16] — deepen the infusion → deepen the sedation
T = '초불응성 SE 관리'
o = "Let's keep his pressure supported as we deepen the infusion."
OLD.append(o)
replace(doc, CH, 16, T, 1, o, {
    'en': "Let's keep his pressure supported as we deepen the sedation.",
    'ko': '진정을 깊게 하는 동안 혈압을 지지해 둡시다.',
    'chunks': ["Let's keep", 'his pressure supported', 'as we deepen', 'the sedation', '.'],
    'words': ['w-keep', 'w-pressure', 'w-support', 'w-deepen', 'w-sedation'],
    'why': ("'keep … supported'는 상태를 계속 받쳐 준다는 뜻이에요. 'as we deepen the sedation'은 진정을 깊게 하는 "
            "바로 그동안 함께 한다는 뜻이라, 진정이 깊어지며 떨어질 혈압을 미리 받쳐요."),
    'decoy': 'the pressor',
    'distractorsKo': ['진정을 깊게 하는 동안 혈압 알람을 좁혀 둡시다.',
                      '진정을 깊게 하는 동안 뇌파를 지켜봐 둡시다.'],
}, ['en', 'ko', 'chunks', 'words'],
    'deepen the infusion(어색한 영어) → deepen the sedation; −w-infusion(6.1 등에서 계속 씀) +w-sedation')
s16 = sit(doc, 16, T)
cx = s16['nuance'][1]
assert cx['kind'] == 'context' and cx['scenes'][2]['en'] == "We're supporting his MAP with vasopressors as we deepen the infusion."
cx['scenes'][2]['en'] = "We're supporting his MAP with vasopressors as we deepen the sedation."
od = s16['order']
l = od['lines'][1]
assert l['en'] == "Let's keep his pressure supported as we deepen the infusion."
l['en'] = "Let's keep his pressure supported as we deepen the sedation."
l['ko'] = '진정을 깊게 하는 동안 혈압을 지지해 둡시다'
assert '주입을 깊게 하는 동안' in od['why']
od['why'] = od['why'].replace('주입을 깊게 하는 동안', '진정을 깊게 하는 동안')

# 7. 혈당·전해질 확인 [4] — 나트륨은 '즉시 다' 교정하지 않음 → 교정을 바로 시작
T = '혈당·전해질 확인'
o = 'If we find a cause, we correct it immediately.'
OLD.append(o)
remove_word(doc, 'w-immediately')
CH.append({'kind': 'word-remove', 'id': 'w-immediately', 'why': '바꾼 문장에 immediately가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 4, T, 2, o, {
    'en': 'If we find a cause, we start correcting it right away.',
    'ko': '원인을 찾으면 바로 교정을 시작할게요.',
    'chunks': ['If we find a cause', ', we start', 'correcting it', 'right away', '.'],
    'words': ['w-find', 'w-cause', 'w-start', 'w-correct'],
    'why': ("'If we find'는 결과에 따라 움직인다는 계획이에요. 'start correcting it right away'는 교정을 미루지 않고 바로 "
            "시작한다는 뜻이고, 나트륨처럼 한 번에 다 바로잡지 않고 속도를 지켜 올리는 경우도 담아요."),
    'decoy': 'collecting it',
    'distractorsKo': ['원인을 찾으면 바로 처방부터 받을게요.',
                      '원인을 찾으면 가족에게도 바로 알려 드릴게요.'],
    'blank': blank('correcting', ['recording', 'predicting', 'repeating']),
}, ['en', 'ko', 'chunks', 'words'],
    'correct it immediately(나트륨은 즉시 다 교정하지 않음) → start correcting it right away; −w-immediately(은행에서 지움) +w-start')

# keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-status-epilepticus-A.md keyPhrase 표
recut(2, '벤조디아제핀 초기 투여 보조', 2, "I'll watch his breathing closely after we give it.",
      ["I'll watch", 'his breathing', 'closely', 'after we give it', '.'])
recut(3, '활력·산소 감시', 2, "Let's keep suction and airway equipment ready.",
      ["Let's keep", 'suction and airway equipment', 'ready', '.'])
recut(6, '2차 항경련제 로딩', 1, "Let's confirm the weight-based dose and infusion rate.",
      ["Let's confirm", 'the weight-based dose', 'and infusion rate', '.'])
recut(7, '지속 EEG 모니터 연계', 1, 'Continuous EEG lets us catch those hidden seizures.',
      ['Continuous EEG', 'lets us catch', 'those hidden seizures', '.'])
recut(15, '불응성 SE 마취약 주입 위기', 1, 'This requires the airway secured and close hemodynamic monitoring.',
      ['This', 'requires', 'the airway secured', 'and close hemodynamic monitoring', '.'])
recut(20, '지속 SE 예후·목표 소통', 1, 'The team will explain what recovery might look like.',
      ['The team', 'will explain', 'what recovery', 'might look like', '.'])

# nuance가 지운 단어를 가리키지 않는지
for s in doc['situations']:
    for n in s.get('nuance') or []:
        assert 'w-immediately' not in (n.get('words') or []), s['title']

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-status-epilepticus.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-status-epilepticus.yaml'), CH)
print('icu-status-epilepticus.yaml 저장')
