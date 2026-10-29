"""icu-gi-bleed — keyPhrase 3문장 교체 + 11.5 엑스레이 확인 단계 + keyPhrase chunks 11문장 다시 자르기(2026-10-29).
base-icu-gi-bleed.yaml → icu-gi-bleed.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-gi-bleed.yaml'))
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


# 1. 정맥류 출혈 초기 관리 [6] — let's start … now → I'll start … as ordered
T = '정맥류 출혈 초기 관리'
o = "Yes, let's start the octreotide drip now."
OLD.append(o)
replace(doc, CH, 6, T, 0, o, {
    'en': "Yes, I'll start the octreotide drip as ordered.",
    'ko': '네, 지시대로 옥트레오타이드 주입을 시작할게요.',
    'chunks': ['Yes', ", I'll start", 'the octreotide drip', 'as ordered', '.'],
    'words': ['w-start', 'w-octreotide', 'w-drip', 'w-order'],
    'tag': '처치 시작',
    'why': ("'I'll start'로 자기가 맡을 일을 분명히 하고, 'as ordered'로 처방에 따라 시작한다는 점을 밝혀요. "
            "정맥류 출혈이 의심되면 옥트레오타이드는 처방이 나오는 대로 서둘러 시작해요."),
    'decoy': ", I'll starts",
    'distractorsKo': ['네, 옥트레오타이드 주입 전엔 라인을 씻을게요.',
                      '네, 옥트레오타이드 주입으로 문맥압을 낮출게요.'],
}, ['en', 'ko', 'chunks', 'words'], "let's start … now → I'll start … as ordered(간호사가 약 시작을 정하는 어조); +w-order")
od = sit(doc, 6, T)['order']
l = od['lines'][2]
assert l['en'] == "Alongside that, let's start the octreotide drip and give the antibiotic as ordered."
l['en'] = "Alongside that, I'll start the octreotide drip and give the antibiotic as ordered."
l['ko'] = '그와 함께 지시대로 옥트레오타이드 주입을 시작하고 항생제를 줄게요'

# 2. 대량출혈 쇼크 대량수혈 [15] — Activate MTP … → MTP is activated — I'll get the cooler now.
T = '대량출혈 쇼크 대량수혈'
o = 'Activate MTP and get the cooler now.'
OLD.append(o)
replace(doc, CH, 15, T, 0, o, {
    'en': "MTP is activated — I'll get the cooler now.",
    'ko': 'MTP가 발동됐으니 제가 지금 쿨러를 가져올게요.',
    'chunks': ['MTP is activated', "— I'll get", 'the cooler', 'now', '.'],
    'tag': '역할 맡기',
    'why': ("'MTP is activated'로 프로토콜이 이미 발동됐다고 확인하고, 'I'll get'으로 자기가 맡을 일을 바로 말해요. "
            "대량수혈 프로토콜 발동은 보통 의사나 병원 지침이 정한 사람이 하고, 간호사는 혈액을 가져와 투여를 맡아요."),
    'decoy': "— I'll gets",
    'distractorsKo': ['MTP가 발동됐으니 쿨러가 오면 팩 번호를 맞출게요.',
                      'MTP가 발동됐으니 제가 지금 담요를 가져올게요.'],
}, ['en', 'ko', 'chunks'], '명령형 발동 지시 → 발동됐음을 확인하고 쿨러를 맡음(장면 첫마디가 동료의 발동, 발동은 의사·지정자) — words 그대로')
od = sit(doc, 15, T)['order']
l = od['lines'][1]
assert l['en'] == 'So activate MTP and get the cooler now.'
l['en'] = "So with MTP activated, I'll get the cooler now."
l['ko'] = '그래서 MTP가 발동됐으니 제가 지금 쿨러를 가져올게요'
assert od['why'].startswith('이유를 말한 뒤 프로토콜을 발동하고,')
od['why'] = od['why'].replace('이유를 말한 뒤 프로토콜을 발동하고,', '이유를 말한 뒤 발동된 프로토콜에 맞춰 쿨러를 가져오고,')

# 3. 재출혈 급변 소생 [18] — Open the fluids wide → run the ordered fluids
T = '재출혈 급변 소생'
o = 'Open the fluids wide and call for blood now.'
OLD.append(o)
drop_word('w-open', '18.0 문장을 바꿔 어느 문장도 태그하지 않게 됨')
drop_word('w-wide', '18.0 문장을 바꿔 어느 문장도 태그하지 않게 됨')
replace(doc, CH, 18, T, 0, o, {
    'en': "Let's run the ordered fluids and call for blood now.",
    'ko': '처방된 수액을 주입하고 지금 혈액을 요청하죠.',
    'chunks': ["Let's run", 'the ordered fluids', 'and call for blood', 'now', '.'],
    'words': ['w-order', 'w-fluid', 'w-call', 'w-blood'],
    'tag': '긴급 대응',
    'why': ("'the ordered fluids'로 처방된 수액만 쓴다는 점을 밝히고, 'Let's'로 팀이 함께 움직이자고 말해요. "
            "위장관 출혈에서는 수액보다 혈액이 먼저라 'call for blood now'를 같은 문장에 붙여요."),
    'decoy': 'and calls for blood',
    'distractorsKo': ['처방된 수액을 주입하기 전에 라인을 살펴요.',
                      '처방된 수액 백은 버리지 말고 빈 팩과 모아 두죠.'],
    'blank': blank('fluids', ['reports', 'numbers', 'audits']),
}, ['en', 'ko', 'chunks', 'words'], 'Open the fluids wide → run the ordered fluids(처방 없이 정질액 최대 개방); −w-open −w-wide(word-remove)')

# 4. balloon tamponade 보조 [11] 문장 5 — 부분 팽창 뒤 엑스레이 위치 확인 단계
T = 'balloon tamponade 보조'
o = 'Once both balloons are inflated, we tape the tube in place.'
OLD.append(o)
replace(doc, CH, 11, T, 5, o, {
    'en': 'We partly inflate the gastric balloon and confirm its position on X-ray before taping the tube in place.',
    'ko': '위 풍선을 조금만 부풀려 엑스레이로 위치를 확인한 뒤에 관을 테이프로 고정해요.',
    'chunks': ['We partly inflate', 'the gastric balloon', 'and confirm its position', 'on X-ray',
               'before taping', 'the tube in place', '.'],
    'words': ['w-inflate', 'w-balloon', 'w-confirm', 'w-tape', 'w-tube', 'w-place'],
    'tag': '위치 확인',
    'icon': 'magnify',
    'why': ("'partly inflate'로 처음엔 조금만 부풀린다고 하고, 'before taping'으로 엑스레이 확인이 고정보다 먼저라는 순서를 분명히 해요. "
            "위 풍선이 식도에서 부풀면 식도가 찢어질 수 있어서 위 안에 있는지부터 엑스레이로 봐요."),
    'decoy': 'before taped',
    'distractorsKo': ['위 풍선을 조금만 부풀려 엑스레이로 위치를 확인한 뒤에 관에 깊이를 표시해요.',
                      '위 풍선을 조금만 부풀려 엑스레이로 위치를 확인한 뒤에 관을 붕대로 감아 고정해요.'],
    'blank': blank('inflate', ['drain', 'flush', 'clamp']),
}, ['en', 'ko', 'chunks', 'words'],
    '두 풍선을 다 부풀린 뒤 고정 → 위 풍선 부분 팽창 뒤 엑스레이로 위치 확인하고 고정(검토 A·B: 위치 확인 단계 빠짐, 식도 풍선은 출혈이 계속될 때만); +w-confirm')
od = sit(doc, 11, T)['order']
assert od['lines'][2]['en'] == o
od['lines'][2] = {'en': "Once it's in, we partly inflate the gastric balloon and confirm it on X-ray.",
                  'icon': 'magnify', 'ko': '관이 들어가면 위 풍선을 조금만 부풀려 엑스레이로 확인해요', 'note': '확인'}
assert od['lines'][3]['en'].startswith("Once it's taped,")
od['lines'][3] = {'en': 'Once the X-ray confirms it, we finish inflating and tape the tube in place.',
                  'icon': 'pushpin', 'ko': '엑스레이로 확인되면 마저 부풀리고 관을 테이프로 고정해요', 'note': '고정'}
od['why'] = ('풍선을 테스트하고 물품을 챙긴 뒤, 기도를 확보하고 관을 넣어요. 위 풍선을 조금만 부풀려 엑스레이로 위치를 확인한 '
             '다음에야 마저 부풀리고 관을 고정해요.')
for ln in od['lines']:
    assert len(ln['en'].split()) <= 15, ln['en']

# keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-gi-bleed-A.md E절 보고 11문장
recut(0, 'GI 출혈 징후 사정', 4, 'Tell me right away if you feel dizzy or want to vomit again.',
      ['Tell me right away', 'if you feel dizzy', 'or want to vomit', 'again', '.'])
recut(3, '혈역학·Hb 추세 감시', 0, 'Yes, that can happen when the blood count drops.',
      ['Yes', ', that can happen', 'when the blood count', 'drops', '.'], {'decoy': 'dropping'})
recut(3, '혈역학·Hb 추세 감시', 1, "I'm watching your blood pressure and your lab trends.",
      ["I'm watching", 'your blood pressure', 'and', 'your lab trends', '.'])
recut(7, '내시경 준비·조율', 1, "I'll get consent and the pre-procedure checklist done.",
      ["I'll get consent", 'and the pre-procedure checklist', 'done', '.'])
recut(8, '제한적 수혈 목표 판단', 0, 'For a stable bleed, we usually hold to the restrictive target.',
      ['For a stable bleed', ', we', 'usually hold to', 'the restrictive target', '.'], {'decoy': 'usually holds to'})
recut(8, '제한적 수혈 목표 판단', 1, "Let's reassess if he shows signs of ongoing bleeding.",
      ["Let's reassess", 'if he shows', 'signs', 'of ongoing bleeding', '.'])
recut(9, 'PPI 주입 관리', 0, 'The PPI infusion is started at the ordered rate.',
      ['The PPI infusion', 'is started', 'at', 'the ordered rate', '.'])
recut(12, '하부출혈 감별·검사', 1, "We'll do tests to find exactly where it's coming from.",
      ["We'll do", 'tests', 'to find', "exactly where it's coming from", '.'], {'decoy': 'to finds'})
recut(12, '하부출혈 감별·검사', 2, "I'm watching your vitals while we sort this out.",
      ["I'm watching", 'your vitals', 'while', 'we sort this out', '.'], {'decoy': 'we sorts this out'})
recut(13, '재출혈 감시·재평가', 0, 'We watch his vitals, labs, and any new bleeding closely.',
      ['We watch', 'his vitals, labs,', 'and any new bleeding', 'closely', '.'], {'decoy': 'We watches'})
recut(13, '재출혈 감시·재평가', 1, 'Please tell me if he vomits blood or feels faint.',
      ['Please', 'tell me', 'if he vomits blood', 'or feels faint', '.'])

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-gi-bleed.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-gi-bleed.yaml'), CH)
print('icu-gi-bleed.yaml 저장')
