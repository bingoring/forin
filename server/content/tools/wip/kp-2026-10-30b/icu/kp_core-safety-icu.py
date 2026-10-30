"""core-safety-icu — keyPhrase 2문장 교체 + keyPhrase chunks 3문장 다시 자르기(2026-10-30 묶음 9 결정).
base-core-safety-icu.yaml → core-safety-icu.yaml"""
import io, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-core-safety-icu.yaml'))
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
    check_new(s)
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


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1, s['en']
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']


# 1. 고위험약 이중확인 [2] 문장 0 — together(함께 읽으며 확인)가 독립확인과 어긋남 → 각자 확인 뒤 대조
T = '고위험약 이중확인'
o = "Let's verify the drug, dose, rate, and pump settings together."
OLD.append(o)
s = replace(doc, CH, 2, T, 0, o, {
    'en': "Let's each verify the drug, dose, rate, and pump settings, then compare.",
    'ko': '약물, 용량, 속도, 펌프 설정을 각자 확인한 뒤 맞춰 봐요.',
    'chunks': ["Let's each verify", 'the drug, dose, rate,', 'and pump settings', ', then compare', '.'],
    'words': ['w-verify', 'w-drug', 'w-dose', 'w-rate', 'w-pump', 'w-setting'],
    'why': ("Let's each verify로 확인은 두 사람이 각자 따로 한다는 것을 밝히고, then compare로 따로 얻은 값을 그다음에 맞춰 본다는 순서를 정해요. "
            "상대 값을 먼저 들으면 따라 하게 돼서 독립 이중확인이 깨져요."),
    'distractorsKo': ['약물, 용량, 속도, 펌프 설정을 각자 확인하려고 처방을 띄워요.',
                      '약물, 용량, 속도, 펌프 설정이 처방지에 다 나와요.'],
    '_moved': {'w-together': ("Let's stop and check this together before we give it.", '주기 전에 같이 멈추고 이걸 확인해요.')},
}, ['en', 'ko', 'chunks', 'words'],
    "… pump settings together → Let's each verify … pump settings, then compare(together가 함께 읽으며 확인하는 것으로 읽혀 독립확인·12장과 어긋남); "
    '−w-together 태그(이 문장에서 together가 빠짐, 2.4 등에 남음)')
check_new(s)
od = order_line(2, T, 1, "Let's check those two against the order together before anything runs.", {
    'en': "Let's check those two against the order before anything runs.",
    'ko': '아무것도 들어가기 전에 그 두 개를 처방과 대조해 봐요',
})
assert '들어가기 전에 처방과 함께 확인하고' in od['why']
od['why'] = od['why'].replace('들어가기 전에 처방과 함께 확인하고', '들어가기 전에 처방과 대조하고')

# 2. 알람 무시 급변 위기 [18] 문장 1 — ICU 안에서는 담당의 호출, 이미 산소 중이니 증량
T = '알람 무시 급변 위기'
o = 'Call for the rapid response and start oxygen.'
OLD.append(o)
drop_word('w-rapidresponse', '18.1 문장을 바꿔 어느 문장도 태그하지 않게 됨(ICU 안에서는 신속대응팀이 아니라 담당의를 부름)')
s = replace(doc, CH, 18, T, 1, o, {
    'en': 'Call the ICU physician now and increase his oxygen.',
    'ko': '지금 중환자실 담당의를 부르고 산소를 올려요.',
    'chunks': ['Call the ICU physician', 'now', 'and increase', 'his oxygen', '.'],
    'words': ['w-call', 'w-physician', 'w-oxygen'],
    'tag': '담당의·산소',
    'why': ("Call the ICU physician now로 부를 사람과 시점을 먼저 못 박고 and increase his oxygen으로 처치를 함께 지시해요. "
            "ICU 안에서는 대개 신속대응팀이 아니라 담당의를 바로 부르고, 이미 산소를 쓰는 환자라 start가 아니라 increase예요."),
    'decoy': 'his room temperature',
    'distractorsKo': ['담당의를 부르려고 지금 전화기를 들어요.',
                      '산소포화도 알람이 울린 지 몇 분이 지났어요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'Call for the rapid response and start oxygen → Call the ICU physician now and increase his oxygen(ICU 안에서는 RRT가 아니라 담당의 호출, '
    '산소포화도 알람이 난 ICU 환자는 대개 이미 산소 중); −w-rapidresponse(word-remove) −w-start 태그(2.7에 남음) +w-physician 태그')
check_new(s)
od = order_line(18, T, 1, 'Assess him with me, and someone call for the rapid response.', {
    'en': 'Assess him with me, and someone call the ICU physician now.',
    'ko': '저와 같이 사정하고, 누군가 지금 중환자실 담당의를 불러주세요',
})
assert '같이 사정하며 신속대응팀을 부르고' in od['why']
od['why'] = od['why'].replace('같이 사정하며 신속대응팀을 부르고', '같이 사정하며 담당의를 부르고')

# 3. keyPhrase chunks 다시 자르기 (en 그대로) — fix-core-safety-icu-A.md K7
recut(19, '전원·펌프 고장 위기 대응', 0, 'Switch to battery backup and the red emergency outlets.',
      ['Switch to', 'battery backup', 'and', 'the red emergency outlets', '.'])
recut(10, '섬망 환자 안전 환경', 1, 'Secure and camouflage his lines out of easy reach.',
      ['Secure', 'and camouflage', 'his lines', 'out of easy reach', '.'])
recut(12, '이중확인·독립확인 프로토콜', 2, 'This is required for all high-alert medications.',
      ['This is required', 'for all', 'high-alert medications', '.'])

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['rapid response', '신속대응팀을 부르', '신속대응팀은', 'w-rapidresponse', 'settings together', '처방과 함께']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'core-safety-icu.yaml'))
append_changes(os.path.join(HERE, 'changes-core-safety-icu.yaml'), CH)

print('core-safety-icu.yaml 저장')
