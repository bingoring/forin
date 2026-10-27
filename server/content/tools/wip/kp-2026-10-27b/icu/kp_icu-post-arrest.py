"""icu-post-arrest — keyPhrase 3문장 교체 + keyPhrase chunks 다시 자르기(2026-10-27). base-icu-post-arrest.yaml → icu-post-arrest.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-post-arrest.yaml'))
CH = []
OLD = []


def other(si, k):
    s = doc['situations'][si]['sentences'][k]
    return (s['en'], s['ko'])


def recut(si, title, index, en, chunks, extra=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(필요하면 decoy도 새 조각 자리에 맞춘다)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    if extra:
        s.update(extra)
    if 'blank' in s:
        import re
        assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', en)) == 1
    assert s['decoy'] not in chunks and s['decoy'] not in en, s['decoy']
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'],
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"})


# 1. 냉각 중 부정맥 위기 [0]
T = '냉각 중 부정맥 위기'
o = 'Deep hypothermia is causing bradycardia and now VT.'
OLD.append(o)
remove_word(doc, 'w-hypothermia')
CH.append({'kind': 'word-remove', 'id': 'w-hypothermia', 'why': '바꾼 문장에 hypothermia가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 17, T, 0, o, {
    'en': 'Overcooling below our target is causing bradycardia and now VT.',
    'ko': '목표 아래로 과냉각된 것이 서맥을 일으키고 이제 심실빈맥까지 왔어요.',
    'chunks': ['Overcooling below our target', 'is causing', 'bradycardia', 'and now VT', '.'],
    'words': ['w-target', 'w-bradycardia', 'w-vt'],
    'icon': 'monitor',
    'why': ("'Overcooling below our target'으로 원인이 냉각 치료 자체가 아니라 목표보다 더 식은 데 있음을 짚어요. "
            "and now로 서맥에 이어 더 위험한 리듬이 새로 나왔다는 변화도 알려요."),
    'distractorsKo': ['목표 아래로 과냉각된 것이 저혈압을 일으키고 이제 심실빈맥까지 왔어요.',
                      '낮은 칼륨 수치가 서맥을 일으키고 이제 심실빈맥까지 왔어요.'],
    'blank': blank('bradycardia', ['tachycardia', 'seizures', 'delirium']),
}, ['en', 'ko', 'chunks', 'words'],
    'Deep hypothermia(TTM 32~36도는 깊은 저체온이 아님 — 목표 아래로 과냉각된 장면) → Overcooling below our target; −w-hypothermia(은행에서 지움) +w-target')
sl = sit(doc, 17, T)['nuance'][0]
assert sl['kind'] == 'slider' and 'w-hypothermia' in sl['words']
sl['words'] = [w for w in sl['words'] if w != 'w-hypothermia']
assert '깊은' not in sl['why']

# 2. TTM 냉각 유도·유지 관리 [1]
T = 'TTM 냉각 유도·유지 관리'
o = 'Once there, we hold the temperature tightly stable.'
OLD.append(o)
replace(doc, CH, 6, T, 1, o, {
    'en': 'Once there, we keep the temperature tightly controlled.',
    'ko': '도달하면 체온을 좁은 범위에서 엄격하게 조절합니다.',
    'chunks': ['Once there', ', we keep', 'the temperature', 'tightly controlled', '.'],
    'words': ['w-temperature', 'w-tight', 'w-control'],
    'why': "Once there로 시점을 먼저 깔고, tightly controlled로 체온을 좁은 범위 안에서 계속 조절한다는 뜻을 전해요.",
    'distractorsKo': ['도달하면 혈당을 좁은 범위에서 엄격하게 조절합니다.',
                      '도달하면 체온을 좁은 범위에서 엄격하게 지켜봅니다.'],
    'blank': blank('temperature', ['sedation', 'nutrition', 'ventilation']),
}, ['en', 'ko', 'chunks', 'words'],
    'hold … tightly stable(어색한 영어) → keep … tightly controlled; −w-stable(5.3에서 계속 씀) +w-control')
ol = sit(doc, 6, T)['order']
assert ol['lines'][2]['en'] == 'From there, we keep the temperature tightly controlled.'

# 3. 재가온 단계 관리 [1]
T = '재가온 단계 관리'
o = 'Watch for vasodilation, hypotension, and hyperkalemia shifts.'
OLD.append(o)
replace(doc, CH, 11, T, 1, o, {
    'en': 'Watch for vasodilation, hypotension, and potassium shifts.',
    'ko': '혈관확장, 저혈압, 칼륨 변동을 지켜보세요.',
    'chunks': ['Watch for vasodilation', ', hypotension', ', and potassium shifts', '.'],
    'words': ['w-vasodilation', 'w-hypotension', 'w-potassium', 'w-shift'],
    'why': ("Watch for 뒤에 지켜볼 변화 셋을 나열해요. potassium shifts는 냉각 때 세포 안으로 들어간 칼륨이 "
            "재가온하면서 다시 나와 수치가 오르내린다는 뜻이에요."),
    'decoy': ', and calcium shifts',
    'distractorsKo': ['혈관확장, 저혈압, 칼륨 변동을 기록하세요.',
                      '혈관확장, 저혈압, 칼륨 변동을 알려 주세요.'],
    'blank': blank('potassium', ['sodium', 'protein', 'oxygen']),
    '_moved': {'w-hyperkalemia': other(13, 1)},
}, ['en', 'ko', 'chunks', 'words'],
    'hyperkalemia shifts(이동하는 것은 칼륨) → potassium shifts; −w-hyperkalemia(13.1에서 계속 씀) +w-potassium')
s11 = sit(doc, 11, T)
pr = s11['nuance'][0]
assert pr['kind'] == 'pair' and 'w-hyperkalemia' in pr['words']
pr['words'] = [w if w != 'w-hyperkalemia' else 'w-potassium' for w in pr['words']]
l3 = s11['order']['lines'][2]
assert l3['en'] == 'As he warms, watch for vasodilation, hypotension, and hyperkalemia.'
l3['en'] = 'As he warms, watch for vasodilation, hypotension, and potassium shifts.'
l3['ko'] = '가온되는 동안 혈관확장, 저혈압, 칼륨 변동을 보세요'

# chunks 다시 자르기 — 검토(fix-A keyPhrase 절, judge-A keyPhrase 절)가 구 경계를 끊는다고 보고한 keyPhrase
recut(1, '12유도 심전도·원인 검사', 0, 'Get a twelve-lead ECG to look for STEMI.',
      ['Get a twelve-lead ECG', 'to look for', 'STEMI', '.'])
recut(1, '12유도 심전도·원인 검사', 1, 'Send troponin and a full metabolic panel.',
      ['Send', 'troponin', 'and a full metabolic panel', '.'], {'decoy': 'and a blood culture'})
recut(3, '체온·전해질 모니터', 2, 'Watch for trends, not just single values.',
      ['Watch for', 'trends', ', not just single values', '.'])
recut(6, 'TTM 냉각 유도·유지 관리', 2, 'Avoid overshooting below the target range.',
      ['Avoid', 'overshooting', 'below the target range', '.'], {'decoy': 'below the glucose range'})
recut(10, 'ROSC 후 환기·산소 목표', 1, 'Keep his CO2 in the normal range.',
      ['Keep', 'his CO2', 'in the normal range', '.'], {'decoy': 'his glucose'})
recut(11, '재가온 단계 관리', 2, 'Controlled rewarming protects his recovery.',
      ['Controlled rewarming', 'protects', 'his recovery', '.'])
recut(13, 'K 전해질 변동 관리', 1, 'Rewarming can cause rebound hyperkalemia.',
      ['Rewarming', 'can cause', 'rebound hyperkalemia', '.'])
recut(16, '재가온 중 혈압 붕괴 위기', 2, 'Slow the rewarming rate while we stabilize him.',
      ['Slow', 'the rewarming rate', 'while we stabilize him', '.'], {'decoy': 'while we reposition him'})
recut(18, '신경학적 예후 불량 가족 상담', 2, "Let's talk about what he would have wanted for his care.",
      ["Let's", 'talk about', 'what he would have wanted', 'for his care', '.'])
recut(20, '연명과 중단 윤리 갈등', 1, "Let's focus on what he would have wanted for himself.",
      ["Let's", 'focus on', 'what he would have wanted', 'for himself', '.'])

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-post-arrest.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-post-arrest.yaml'), CH)
print('icu-post-arrest.yaml 저장')
