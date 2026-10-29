"""icu-stroke-icu — keyPhrase 2문장 교체 + keyPhrase chunks 8문장 다시 자르기(2026-10-29).
base-icu-stroke-icu.yaml → icu-stroke-icu.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-stroke-icu.yaml'))
CH = []
OLD = []


def nlen(s):
    return len(re.sub(r'\s', '', s))


def dko(ko, ds):
    """문장 distractorsKo 길이(V20: 1.25배 이내 또는 3자 이내) + 하나는 정답 길이 이하."""
    a = nlen(ko)
    for d in ds:
        b = nlen(d)
        assert max(a, b) <= 1.25 * min(a, b) or abs(a - b) <= 3, (ko, d)
    assert min(nlen(d) for d in ds) <= a, (ko, ds)
    return list(ds)


def line(si, title, k, old_en, en, ko):
    l = sit(doc, si, title)['order']['lines'][k]
    assert l['en'] == old_en, (title, k, l['en'])
    assert len(en.split()) <= 15, en
    l['en'], l['ko'] = en, ko


def owhy(si, title, old, new):
    od = sit(doc, si, title)['order']
    assert old in od['why'], (title, od['why'])
    od['why'] = od['why'].replace(old, new)


def recut(si, title, index, en, chunks, decoy=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(decoy가 새 조각 자리에 안 맞으면 새로)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    fields = ['chunks']
    if decoy:
        s['decoy'] = decoy
        fields.append('decoy')
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', en)) == 1
    assert s['decoy'] not in chunks and s['decoy'] not in en, s['decoy']
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'],
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"
                      + (f"; decoy를 새 조각 자리에 맞춤({decoy})" if decoy else '')})


# 1. 두부 거상·체위 [4] — 머리 거상이 뇌혈류를 돕는다는 근거 약함(HeadPoST) → 의료진이 지시한 안전 자세
T = '두부 거상·체위'
o = 'This position also helps blood flow to your brain.'
OLD.append(o)
ko = '이건 안전을 지키려고 의료진이 지시한 자세예요.'
replace(doc, CH, 4, T, 1, o, {
    'en': 'This is the position your team ordered to keep you safe.',
    'ko': ko,
    'chunks': ['This is', 'the position', 'your team ordered', 'to keep you safe', '.'],
    'words': ['w-position', 'w-team', 'w-keep', 'w-safe'],
    'tag': '자세 이유',
    'icon': 'shield',
    'why': ("'your team ordered'로 이 자세가 의료진의 지시라는 근거를 밝혀요. 효과를 약속하지 않고 "
            "'to keep you safe'로 목적만 말해서, 환자가 자세를 바꾸고 싶을 때 먼저 물어보게 해요."),
    'decoy': 'to keep you warm',
    'distractorsKo': dko(ko, ['이건 편하시라고 의료진이 지시한 자세예요.',
                              '이건 안전을 지키려고 의료진이 지시한 식단이에요.']),
    'blank': blank('position', ['diet', 'schedule', 'dressing']),
    '_moved': {
        'w-blood': ("We're keeping your blood flow steady to protect your brain.", '뇌를 보호하기 위해 혈류를 안정적으로 유지하고 있어요.'),
        'w-flow': ("We're keeping your blood flow steady to protect your brain.", '뇌를 보호하기 위해 혈류를 안정적으로 유지하고 있어요.'),
    },
}, ['en', 'ko', 'chunks', 'words'],
    '머리 거상이 뇌혈류를 돕는다는 근거가 약함(HeadPoST, 재관류 후 허혈성 환자) → 의료진이 지시한 안전 자세; '
    '−w-help −w-blood −w-flow −w-brain(4.0·11.2 등에서 계속 씀) +w-team +w-keep +w-safe(은행에 있음). '
    '같은 상황 4.5 why("앞 문장의 이점")와 N4 context 장면 2의 뇌관류 목적도 흡인 예방으로 맞춤')
s4 = sit(doc, 4, T)
s45 = s4['sentences'][5]
assert s45['en'] == 'For some patients, this also lowers the pressure inside the head.'
assert "'also'는 앞 문장의 이점에 하나를 더한다는 뜻이에요." in s45['why']
s45['why'] = s45['why'].replace("'also'는 앞 문장의 이점에 하나를 더한다는 뜻이에요.",
                                "'also'는 폐를 보호한다는 첫 이점에 하나를 더한다는 뜻이에요.")
ctx = [n for n in s4['nuance'] if n['kind'] == 'context'][0]
sc = ctx['scenes'][1]
assert sc['en'] == 'We will raise the cephalic end of your bed to optimize cerebral perfusion.'
sc['en'] = 'We will raise the cephalic end of your bed to minimize aspiration risk.'

# 2. tPA 후 대량 뇌출혈 위기 [16] — 역전 시작은 처방 → 처방을 바로 받아 내기
T = 'tPA 후 대량 뇌출혈 위기'
o = 'Stop the tPA and start reversal immediately.'
OLD.append(o)
ko = 'tPA를 중단하고 지금 역전 처방을 받으세요.'
replace(doc, CH, 16, T, 0, o, {
    'en': 'Stop the tPA and get the reversal orders now.',
    'ko': ko,
    'chunks': ['Stop the tPA', 'and get', 'the reversal orders', 'now', '.'],
    'words': ['w-stop', 'w-tpa', 'w-reversal'],
    'why': ("'Stop … and get …'으로 프로토콜상 간호사가 바로 할 일(점적 중단)과 처방이 필요한 일(역전)을 한 문장에 묶어요. "
            "역전 약과 시점은 처방자가 정하니 'get the reversal orders'로 처방을 바로 받아 내라고 하고, 'now'로 기다리지 말라는 뜻을 더해요."),
    'decoy': 'and set',
    'distractorsKo': dko(ko, ['tPA를 중단하고 지금 신경외과에 연락하세요.',
                              'tPA를 중단하고 지금 혈압을 조절하세요.']),
    '_moved': {
        'w-immediately': ("Let's get her ready for angio immediately.", '즉시 혈관조영을 위해 준비시키죠.'),
    },
}, ['en', 'ko', 'chunks', 'words'],
    '역전 시작은 처방인데 간호사 명령형으로 지시 → get the reversal orders now; '
    '−w-start −w-immediately(9.5·17.0 등에서 계속 씀). w-get은 은행 뜻이 데려가다(이송)라 태그하지 않음. '
    'order 16 줄 2·why와 N16 swap(같은 틀)도 새 문장 틀로')
line(16, T, 1, 'Given that, stop the tPA and start reversal immediately.',
     'Given that, stop the tPA and get the reversal orders now.',
     '그러니 tPA를 중단하고 지금 역전 처방을 받으세요')
owhy(16, T, '그에 따라 tPA 중단과 역전을 지시한 뒤', '그에 따라 tPA를 중단하고 역전 처방을 받게 한 뒤')
s16 = sit(doc, 16, T)
sw = [n for n in s16['nuance'] if n['kind'] == 'swap'][0]
assert sw['before'] == ['Stop the tPA and ', 'commence reversal', ' immediately.']
sw.update({
    'words': ['w-reversal'],
    'before': ['Stop the tPA and ', 'procure the reversal orders', ' now.'],
    'options': ['get the reversal orders', 'procure the reversal orders', 'secure reversal authorization'],
    'answer': 'get the reversal orders',
    'notes': {
        'get the reversal orders': '짧고 분명해서 응급 상황에서 바로 알아들어요.',
        'procure the reversal orders': '격식 있는 말이라 급한 현장에서는 느리게 들려요.',
        'secure reversal authorization': '길고 문서 같은 표현이라 급한 지시에는 맞지 않아요.',
    },
    'ko': 'tPA를 중단하고 지금 역전 처방을 받으세요',
})
assert '역전 약과 시점은 처방자가 정해요.' in sw['why']

# keyPhrase chunks 다시 자르기(en 그대로) — fix-icu-stroke-icu-A.md E절 'keyPhrase chunks 구 경계' 8문장
recut(2, '삼킴 전 금식·흡인 예방', 0, 'We need to check that you can swallow safely before you drink.',
      ['We need to check', 'that you can swallow', 'safely', 'before you drink', '.'], 'before you sleep')
recut(5, '의식 변화 관찰', 1, 'Small changes matter, so please keep letting me know.',
      ['Small changes', 'matter', ', so please', 'keep letting me know', '.'], 'keep letting him know')
recut(5, '의식 변화 관찰', 2, "I'm going to wake him and see how he responds.",
      ["I'm going to", 'wake him', 'and see', 'how he responds', '.'], 'how he sleeps')
recut(11, '혈전제거 후 재관류 관리', 0, 'The procedure went well, but we still need to watch you closely.',
      ['The procedure went well', ', but we still need', 'to watch you', 'closely', '.'])
recut(13, '조기 재활·합병증 예방', 1, "We'll go slowly and I'll support you the whole time.",
      ["We'll go", 'slowly', "and I'll support you", 'the whole time', '.'])
recut(17, '대혈관 급성 악화', 2, "I'll call report to the neuro-interventional team.",
      ["I'll", 'call report', 'to the neuro-interventional team', '.'])
recut(20, '광범위 뇌손상 목표·예후 소통', 0, "I wish I had better news, and I'll be honest with you.",
      ['I wish', 'I had better news', ", and I'll be honest", 'with you', '.'], ", and I'll be brief")
recut(20, '광범위 뇌손상 목표·예후 소통', 2, "Let's talk together about what he would have wanted.",
      ["Let's talk", 'together', 'about what', 'he would have wanted', '.'], 'you would have wanted')

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for frag in ['start reversal', 'commence reversal', 'helps blood flow', '뇌로 가는 혈류', '즉시 역전을']:
    assert frag not in raw, frag
dump(doc, os.path.join(HERE, 'icu-stroke-icu.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-stroke-icu.yaml'), CH)
print('icu-stroke-icu.yaml 저장')
