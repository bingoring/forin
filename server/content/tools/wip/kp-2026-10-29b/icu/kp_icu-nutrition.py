"""icu-nutrition — keyPhrase 인슐린 2문장 교체 + keyPhrase chunks 5문장 다시 자르기(2026-10-29 묶음 7 결정 '추천대로').
base-icu-nutrition.yaml → icu-nutrition.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-nutrition.yaml'))
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


# 1. 혈당·전해질 연계 감시 [5] 2 — adjust … as needed → give … as ordered
T = '혈당·전해질 연계 감시'
o = "We'll adjust insulin coverage as needed."
OLD.append(o)
replace(doc, CH, 5, T, 2, o, {
    'en': "We'll give insulin coverage as ordered.",
    'ko': '처방대로 인슐린 보충을 투여할게요.',
    'chunks': ["We'll give", 'insulin coverage', 'as ordered', '.'],
    'words': ['w-insulin', 'w-coverage', 'w-order'],
    'tag': '처방대로',
    'icon': 'pill',
    'why': ("as ordered로 인슐린 양을 간호사가 정하지 않고 처방된 척도를 따른다는 점을 밝혀요. "
            "coverage는 높아진 혈당을 덮어 주려고 더 주는 인슐린을 가리켜요."),
    'decoy': "We'll gives",
    'distractorsKo': ['인슐린 보충을 투여하려고 수치부터 볼게요.',
                      '인슐린 보충은 급식이 늘면 더 필요해져요.'],
    'blank': blank('ordered', ['tolerated', 'requested', 'preferred']),
}, ['en', 'ko', 'chunks', 'words'],
    "adjust … as needed → give … as ordered(인슐린 척도 변경은 처방 — 간호사가 알아서 조정하는 약속으로 읽힘, 검토 A); −w-adjust −w-need 태그(다른 문장에 남음)")
od = sit(doc, 5, T)['order']
l = od['lines'][2]
assert l['en'] == "If the glucose runs high, we'll adjust insulin coverage as needed."
l['en'] = "If the glucose runs high, we'll give insulin coverage as ordered."
l['ko'] = '혈당이 높게 나오면 처방대로 인슐린 보충을 투여해요'
assert '높으면 조절한다고 설명하고,' in od['why']
od['why'] = od['why'].replace('높으면 조절한다고 설명하고,', '높으면 처방대로 인슐린을 준다고 설명하고,')

# 2. TPN 관련 대사 위기 [18] 0 — adjust the insulin → get the insulin adjusted
T = 'TPN 관련 대사 위기'
o = "Let's adjust the insulin and recheck the glucose."
OLD.append(o)
replace(doc, CH, 18, T, 0, o, {
    'en': "Let's get the insulin adjusted and recheck the glucose.",
    'ko': '인슐린 용량을 조정받고 혈당을 재확인해요.',
    'chunks': ["Let's get", 'the insulin adjusted', 'and recheck', 'the glucose', '.'],
    'tag': '조정 요청',
    'why': ("get the insulin adjusted는 간호사가 직접 바꾸는 것이 아니라 처방자에게 조정을 받는다는 뜻이에요. "
            "and recheck로 조정한 뒤 효과를 다시 확인하는 순서를 붙여요."),
    'decoy': 'the bed adjusted',
    'distractorsKo': ['인슐린 용량을 조정받으려고 혈당 수치를 전해요.',
                      '인슐린 용량은 혈당 수치에 맞춰 조정돼요.'],
}, ['en', 'ko', 'chunks'],
    "adjust the insulin → get the insulin adjusted(인슐린 조정은 처방 — 간호사가 조정하는 말로 읽힘, 검토 A) — words 그대로")

# keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-nutrition-A.md keyPhrase 표의 chunks 보고 5문장
recut(9, '복강내압 측정', 1, "Let's trend it and watch for a rising number.",
      ["Let's", 'trend it', 'and watch for', 'a rising number', '.'], {'decoy': 'and watches for'})
recut(18, 'TPN 관련 대사 위기', 2, 'We may need to hold or change the TPN rate.',
      ['We may need', 'to hold', 'or change', 'the TPN rate', '.'])
recut(20, '장기 영양불량 예후 소통', 0, "Despite full nutrition, his body isn't keeping up.",
      ['Despite full nutrition', ', his body', "isn't keeping up", '.'], {'decoy': ', his appetite'})
recut(20, '장기 영양불량 예후 소통', 1, 'This tells us his illness is very advanced.',
      ['This tells us', 'his illness', 'is very advanced', '.'], {'decoy': 'This tell us'})
recut(20, '장기 영양불량 예후 소통', 2, "Let's talk about what would give him the most comfort.",
      ["Let's", 'talk about', 'what would give him', 'the most comfort', '.'])

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ('adjust insulin coverage as needed', 'adjust the insulin and', '인슐린 보충을 조절', '인슐린을 조절하'):
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'icu-nutrition.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-nutrition.yaml'), CH)
print('icu-nutrition.yaml 저장')
