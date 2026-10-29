"""icu-endocrine-crisis — keyPhrase 9문장 교체 + keyPhrase chunks 8문장 다시 자르기(2026-10-28).
base-icu-endocrine-crisis.yaml → icu-endocrine-crisis.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-endocrine-crisis.yaml'))
CH = []
OLD = []


def other(si, k):
    s = doc['situations'][si]['sentences'][k]
    return (s['en'], s['ko'])


def line(si, title, k, old_en, en, ko):
    l = sit(doc, si, title)['order']['lines'][k]
    assert l['en'] == old_en, (title, k, l['en'])
    assert len(en.split()) <= 15, en
    l['en'], l['ko'] = en, ko


def recut(si, title, index, en, chunks):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', en)) == 1
    assert s['decoy'] not in chunks and s['decoy'] not in en, s['decoy']
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'],
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"})


# 1·2. 심한 저혈당 의식소실 위기 [0][2]
T = '심한 저혈당 의식소실 위기'
o = "Check a stat glucose and push D50 now — he's unresponsive."
n = "Check a stat glucose, and if he's low, push D50 per protocol — he's unresponsive."
OLD.append(o)
replace(doc, CH, 18, T, 0, o, {
    'en': n,
    'ko': '즉시 혈당을 확인하고, 낮으면 프로토콜대로 D50을 주세요, 반응이 없어요.',
    'chunks': ['Check a stat glucose', ", and if he's low", ', push D50', 'per protocol —', "he's unresponsive", '.'],
    'words': ['w-check', 'w-stat', 'w-glucose', 'w-low', 'w-push', 'w-protocol', 'w-unresponsive'],
    'why': ("'if he's low'로 D50을 혈당 결과에 걸어 확인한 뒤에 준다는 순서를 밝히고, 'per protocol'로 정해진 용량과 절차를 따른다고 말해요. "
            "끝의 'he's unresponsive'가 왜 서두르는지 알려요."),
    'decoy': "he's still talking",
    'distractorsKo': ['즉시 혈당을 확인하고, 낮으면 프로토콜대로 D50을 주세요, 정맥 라인 있어요.',
                      '즉시 혈당을 확인하고, 낮으면 프로토콜대로 D50을 주세요, 산소 달았어요.'],
    'blank': blank('stat', ['fasting', 'bedtime', 'routine']),
}, ['en', 'ko', 'chunks', 'words'],
    "D50을 혈당 결과 전에 주는 순서로 읽힘 → 'if he's low' 조건과 'per protocol'을 넣음; +w-low +w-protocol")

o = 'Recheck the sugar in a few minutes and stay ready to repeat.'
n = 'Recheck the sugar in fifteen minutes and stay ready to repeat.'
OLD.append(o)
replace(doc, CH, 18, T, 2, o, {
    'en': n,
    'ko': '15분 뒤에 혈당을 다시 확인하고, 반복할 준비를 해 두세요.',
    'chunks': ['Recheck the sugar', 'in fifteen minutes', 'and stay ready', 'to repeat', '.'],
    'why': ("'in fifteen minutes'로 D50 뒤 다시 잴 시점을 정확히 정해 줘요. "
            "'stay ready to repeat'는 한 번으로 끝나지 않을 수 있다는 대비예요."),
    'decoy': 'Recheck the potassium',
    'distractorsKo': ['15분 뒤에 다시 재야 D50이 충분했는지 알 수 있어요.',
                      '15분 뒤에 다시 잴 때까지 곁을 떠나지 않고 있을게요.'],
    'blank': blank('repeat', ['transfer', 'discharge', 'ambulate']),
}, ['en', 'ko', 'chunks'], "대부분 프로토콜은 D50 15분 뒤 재측정 — 'a few minutes' → 'fifteen minutes'")
s18 = sit(doc, 18, T)
line(18, T, 1, "Check a stat glucose and push D50 now — he's unresponsive.",
     "Check a stat glucose, and if he's low, push D50 per protocol.",
     '즉시 혈당을 확인하고, 낮으면 프로토콜대로 D50을 주세요')
line(18, T, 3, 'Recheck the sugar in a few minutes and stay ready to repeat.',
     'Recheck the sugar in fifteen minutes and stay ready to repeat.',
     '15분 뒤에 혈당을 다시 확인하고 반복할 준비를 해요')
s18['order']['why'] = ('경과로 저혈당을 추정하고, 즉시 혈당을 재서 낮으면 프로토콜대로 포도당을 주고, '
                       '그동안 기도를 보호하며, 15분 뒤 재확인과 반복을 대비해요.')

# 3. K 보정·인슐린 균형 [1]
T = 'K 보정·인슐린 균형'
o = 'We may need to slow the insulin if potassium keeps falling.'
n = 'We may need to hold the insulin if potassium falls below the protocol limit.'
OLD.append(o)
replace(doc, CH, 7, T, 1, o, {
    'en': n,
    'ko': '칼륨이 프로토콜 기준 아래로 떨어지면 인슐린을 보류해야 할 수도 있어요.',
    'chunks': ['We may need', 'to hold the insulin', 'if potassium falls', 'below the protocol limit', '.'],
    'words': ['w-need', 'w-hold', 'w-insulin', 'w-potassium', 'w-fall', 'w-protocol'],
    'tag': '보류 기준',
    'icon': 'lab',
    'why': ("'may need to'는 확정이 아니라 필요할 수도 있다는 완곡한 표현이에요. "
            "'below the protocol limit'로 보류하는 기준을 개인 판단이 아니라 프로토콜 수치에 걸어요."),
    'decoy': 'before the next dose',
    'distractorsKo': ['칼륨이 프로토콜 기준 아래로 떨어지면 칼륨 보충을 늘려야 할 수도 있어요.',
                      '칼륨이 프로토콜 기준 아래로 떨어지면 심장 리듬이 불규칙해질 수 있어요.'],
    'blank': blank('potassium', ['sodium', 'calcium', 'chloride']),
    '_moved': {'w-slow': other(14, 1)},
}, ['en', 'ko', 'chunks', 'words'],
    '칼륨이 기준 아래면 인슐린은 늦추지 않고 보류함(slow → hold, keeps falling → falls below the protocol limit); −w-slow(14.1 등에서 계속 씀) +w-hold +w-protocol')

# 4. 인슐린 주입 준비 [1]
T = '인슐린 주입 준비'
o = "Let's double-check the concentration and pump settings together."
n = "Let's each double-check the concentration and pump settings independently."
OLD.append(o)
replace(doc, CH, 3, T, 1, o, {
    'en': n,
    'ko': '농도랑 펌프 설정을 각자 따로 다시 확인해요.',
    'chunks': ["Let's each", 'double-check', 'the concentration and pump settings', 'independently', '.'],
    'words': ['w-check', 'w-concentration', 'w-pump', 'w-setting'],
    'why': ("Let's each로 두 사람이 저마다 확인하자고 청하고, 끝의 independently가 서로 값을 불러 주지 않고 따로 본다는 뜻을 더해요. "
            "인슐린 같은 고위험 약은 이렇게 독립 이중 확인을 해요."),
    'decoy': 'together',
    'distractorsKo': ['농도랑 펌프 설정을 다시 봐야 열 배 오류를 막아요.',
                      '농도랑 펌프 설정을 맞추고 라벨을 붙여요.'],
    'blank': blank('independently', ['occasionally', 'collectively', 'informally']),
    '_moved': {'w-together': other(10, 2)},
}, ['en', 'ko', 'chunks', 'words'],
    'together는 독립 이중 확인(ISMP — 두 사람이 각자 따로)과 어긋남 → each … independently; −w-together(10.2 등에서 계속 씀)')
assert sit(doc, 3, T)['order']['lines'][2]['en'] == "Before I start, let's each check those settings against the order."

# 5. 부신위기 스테로이드 투여 [2]
T = '부신위기 스테로이드 투여'
o = "We'll keep monitoring and give more if his stress level demands it."
n = "We'll keep monitoring and give more as ordered if his body needs it."
OLD.append(o)
remove_word(doc, 'w-demand')
CH.append({'kind': 'word-remove', 'id': 'w-demand', 'why': '바꾼 문장에 demand가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 12, T, 2, o, {
    'en': n,
    'ko': '계속 지켜보다가 몸에 필요하면 처방대로 더 드릴 거예요.',
    'chunks': ["We'll keep monitoring", 'and give more', 'as ordered', 'if his body needs it', '.'],
    'words': ['w-keep', 'w-monitor', 'w-give', 'w-order', 'w-need'],
    'why': ("'as ordered'로 추가 용량을 간호사가 정하지 않고 처방에 따른다는 점을 밝혀요. "
            "'if his body needs it'은 가족이 마음의 스트레스로 오해하지 않게 몸의 필요를 기준으로 말해요."),
    'decoy': 'if his fever rises',
    'distractorsKo': ['계속 지켜보는 건 몸이 아직 호르몬을 충분히 못 만들어서예요.',
                      '계속 지켜보다가 몸이 회복되면 처방대로 용량을 줄여 갈 거예요.'],
    'blank': blank('ordered', ['requested', 'tolerated', 'scheduled']),
}, ['en', 'ko', 'chunks', 'words'],
    "추가 투여는 처방 판단이고 'stress level'이 가족에게 감정으로 들림 → as ordered if his body needs it; −w-stress −w-level(다른 문장에서 계속 씀) −w-demand(은행에서 지움) +w-order +w-need")
line(12, T, 3, "If that response fades, we'll give more as his stress level demands.",
     "If that response fades, we'll give more as ordered.", '그 반응이 약해지면 처방대로 더 드릴게요')

# 6·7. 부신위기 순환붕괴 [0][2]
T = '부신위기 순환붕괴'
o = "Let's push the stress-dose steroid and start a pressor together now."
n = "Let's push the ordered stress-dose steroid and start the pressor together now."
OLD.append(o)
replace(doc, CH, 17, T, 0, o, {
    'en': n,
    'ko': '처방된 스트레스 용량 스테로이드를 주고, 승압제도 지금 같이 시작해요.',
    'chunks': ["Let's push", 'the ordered stress-dose steroid', 'and start the pressor', 'together now', '.'],
    'words': ['w-push', 'w-order', 'w-stress', 'w-steroid', 'w-start', 'w-pressor', 'w-together'],
    'why': ("'Let's'는 팀이 함께 움직이자는 제안이고, 'the ordered'로 처방된 약을 준다는 점을 밝혀요. "
            "'together now'가 스테로이드와 승압제를 미루지 않고 동시에 시작한다는 뜻이에요."),
    'decoy': 'the ordered steroid cream',
    'distractorsKo': ['처방된 스트레스 용량 스테로이드가 있어야 승압제가 제대로 들어요.',
                      '처방된 스트레스 용량 스테로이드는 부신이 못 만드는 걸 대신해요.'],
    'blank': blank('pressor', ['feeding', 'dialysis', 'warmer']),
}, ['en', 'ko', 'chunks', 'words'], '처방 경유가 드러나지 않음 → the ordered stress-dose steroid, a pressor → the pressor; +w-order')
line(17, T, 2, "Until they're here, let's push the stress-dose steroid and start a pressor.",
     "Until they're here, let's push the ordered stress-dose steroid and start the pressor.",
     '오기 전까지 처방된 스트레스 용량 스테로이드를 주고 승압제를 시작해요')

o = 'Call the intensivist — this is a true adrenal crisis.'
n = 'Call the intensivist — this looks like a true adrenal crisis.'
OLD.append(o)
replace(doc, CH, 17, T, 2, o, {
    'en': n,
    'ko': '중환자전문의를 불러 주세요, 진짜 부신위기처럼 보여요.',
    'chunks': ['Call', 'the intensivist —', 'this looks like', 'a true adrenal crisis', '.'],
    'why': ("명령형 'Call'이 짧고 분명해 위급할 때 쓰기 좋아요. 'this looks like'로 진단을 단정하지 않고 본 대로 알리면서, "
            "'true'로 진짜 위기라는 급함은 그대로 전해요."),
    'decoy': 'a minor thyroid problem',
    'distractorsKo': ['중환자전문의를 불러 주세요, 진짜 패혈증처럼 보여요.',
                      '중환자전문의를 불러 주세요, 진짜 갑상선 위기처럼 보여요.'],
    'blank': blank('adrenal', ['thyroid', 'hypertensive', 'asthma']),
}, ['en', 'ko', 'chunks'], '간호사가 진단을 단정 → this looks like')

# 8. DKA 인슐린 주입 적정 [1]
T = 'DKA 인슐린 주입 적정'
o = 'Bringing it down too fast can be risky, so we titrate carefully.'
n = 'Bringing it down too fast can be risky, so we adjust it carefully.'
OLD.append(o)
replace(doc, CH, 6, T, 1, o, {
    'en': n,
    'ko': '너무 빨리 내리면 위험할 수 있어서, 조심스럽게 조절하고 있어요.',
    'chunks': ['Bringing it down', 'too fast', 'can be risky,', 'so we adjust it', 'carefully', '.'],
    'words': ['w-bring', 'w-fast', 'w-risky', 'w-adjust', 'w-carefully'],
    'why': ("'can be'는 가능성을 말해 겁주지 않으면서 조심할 이유를 줘요. "
            "환자에게는 titrate 대신 쉬운 'adjust it carefully'로 반응을 보며 맞춘다고 말해요."),
    'decoy': 'can be painful,',
    'blank': blank('adjust', ['label', 'flush', 'store']),
    '_moved': {'w-titrate': other(17, 1)},
}, ['en', 'ko', 'chunks', 'words'],
    '환자에게 titrate(이 주제의 swap·context가 환자에게 쓰지 말라고 가르치는 말) → adjust it; −w-titrate(17.1·17.4에서 계속 씀) +w-adjust')
s6 = sit(doc, 6, T)
ctx = s6['nuance'][1]
assert ctx['kind'] == 'context' and ctx['words'] == ['w-titrate']
ctx.update({
    'words': ['w-adjust'],
    'word': 'adjust',
    'ko': '조절하다',
    'scenes': [
        {'who': '의사 라운드', 'icon': 'monitor', 'en': 'Adjust the insulin drip per the DKA protocol.', 'ok': True},
        {'who': '약사와 통화', 'icon': 'speech', 'en': 'We adjust it against the hourly glucose, not by guess.', 'ok': True},
        {'who': '환자에게', 'icon': 'me',
         'en': "I'm going to adjust your insulin infusion based on your serial POC glucose values.", 'ok': False,
         'fix': "I'm adjusting your insulin a little at a time based on your sugar checks."},
    ],
    'why': ("의료진끼리는 프로토콜·매시간 혈당처럼 조절 기준을 짧게 말해요. 환자에게는 serial POC glucose 같은 말 대신 "
            "'혈당 검사에 맞춰 조금씩 조절한다'고 쉬운 말로 알려 주세요."),
})

# 9. 혈당·케톤·ABG 모니터 [0]
T = '혈당·케톤·ABG 모니터'
o = 'We check your sugar, your ketones, and your blood acid every hour to keep you safe.'
n = 'We check your sugar every hour, and your ketones and blood acid often, to keep you safe.'
OLD.append(o)
replace(doc, CH, 1, T, 0, o, {
    'en': n,
    'ko': '안전하게 지켜드리려고 혈당은 매시간, 케톤이랑 혈액 산도는 자주 확인하고 있어요.',
    'chunks': ['We check your sugar', 'every hour,', 'and your ketones and blood acid', 'often,', 'to keep you safe', '.'],
    'why': ("'every hour'와 'often'으로 검사마다 간격이 다르다는 점을 나눠 알려요. "
            "끝의 'to keep you safe'가 반복 검사의 목적을 환자의 안전으로 밝혀 귀찮은 검사라는 느낌을 줄여요."),
    'decoy': 'to keep you awake',
    'distractorsKo': ['편안하게 지켜드리려고 혈당은 매시간, 케톤이랑 혈액 산도는 자주 확인하고 있어요.',
                      '빨리 퇴원시켜 드리려고 혈당은 매시간, 케톤이랑 혈액 산도는 자주 확인하고 있어요.'],
    'blank': blank('ketones', ['platelets', 'cholesterol', 'vitamins']),
}, ['en', 'ko', 'chunks'], '혈당은 매시간이지만 케톤·산도는 보통 2~4시간마다 → sugar every hour, and your ketones and blood acid often')
line(1, T, 0, 'We check your sugar, ketones, and blood acid every hour to keep you safe.',
     'We check your sugar every hour, and your ketones and blood acid often.',
     '혈당은 매시간, 케톤과 혈액 산도는 자주 확인해요')

# keyPhrase chunks 다시 자르기 — fix-icu-endocrine-crisis-A.md 'keyPhrase chunks 구 경계'(8곳)
recut(2, '수액 소생 시작', 0, "You lost a lot of fluid, so we're replacing it quickly at first.",
      ['You lost', 'a lot of fluid,', "so we're replacing it", 'quickly at first', '.'])
recut(3, '인슐린 주입 준비', 2, "I'll start the infusion once potassium is confirmed safe.",
      ["I'll start", 'the infusion', 'once potassium', 'is confirmed safe', '.'])
recut(7, 'K 보정·인슐린 균형', 0, "Let's replace potassium and keep monitoring it closely with the insulin running.",
      ["Let's replace", 'potassium', 'and keep monitoring it closely', 'with the insulin running', '.'])
recut(8, 'anion gap 종결 판단', 1, 'We overlap the drip with the first long-acting dose before stopping.',
      ['We overlap', 'the drip', 'with the first long-acting dose', 'before stopping', '.'])
recut(11, '유발원인 동반 치료', 1, 'Fixing the cause helps prevent this from coming back.',
      ['Fixing the cause', 'helps', 'prevent this', 'from coming back', '.'])
recut(14, '교정속도 뇌부종 위험 인지', 0, 'Correcting too quickly can cause dangerous brain swelling.',
      ['Correcting too quickly', 'can cause', 'dangerous brain swelling', '.'])
recut(16, '갑상선폭풍 위기', 0, 'Her thyroid is dangerously overactive, causing this fever and racing heart.',
      ['Her thyroid', 'is dangerously overactive,', 'causing this fever', 'and racing heart', '.'])
recut(20, '내분비 위기 다장기 악화', 2, "We're escalating his care and staying right at his bedside.",
      ["We're escalating", 'his care', 'and staying', 'right at his bedside', '.'])

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-endocrine-crisis.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-endocrine-crisis.yaml'), CH)
print('icu-endocrine-crisis.yaml 저장')
