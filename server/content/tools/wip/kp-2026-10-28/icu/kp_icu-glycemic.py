"""icu-glycemic — keyPhrase 4문장 교체 + keyPhrase chunks 7문장 다시 자르기(2026-10-28).
base-icu-glycemic.yaml → icu-glycemic.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-glycemic.yaml'))
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


# 1. 심한 저혈당 의식저하 위기 [15] — 5분 → 15분(ADA·병원 저혈당 프로토콜, 같은 주제 KP 8.0과 같은 숫자)
T = '심한 저혈당 의식저하 위기'
o = "Recheck in five minutes and repeat if he's still low."
OLD.append(o)
replace(doc, CH, 15, T, 2, o, {
    'en': "Recheck in fifteen minutes and repeat if he's still low.",
    'ko': '15분 후 재확인하고 여전히 낮으면 반복해요.',
    'chunks': ['Recheck', 'in fifteen minutes', 'and repeat', "if he's still low", '.'],
    'why': ("'Recheck … and repeat'는 두 동사로 재평가 뒤 반복이라는 순서를 보여 줘요. "
            "포도당을 준 뒤 15분에 다시 재는 것이 저혈당 프로토콜의 기준이고, 'if'로 반복할 조건을 붙여요."),
    'distractorsKo': ['15분 후 재확인하고 오르면 식사를 챙겨요.',
                      '15분 후 재확인하고 정상이면 한 시간 뒤 또 재요.'],
    'blank': blank('Recheck', ['Reposition', 'Document', 'Weigh']),
}, ['en', 'ko', 'chunks'], 'five minutes → fifteen minutes(D50 뒤 재측정 표준 15분, KP 8.0과 숫자 통일)')
s15 = sit(doc, 15, T)
od = s15['order']
assert od['lines'][2]['en'] == 'Recheck in five minutes.'
od['lines'][2]['en'] = 'Recheck in fifteen minutes.'
od['lines'][2]['ko'] = '15분 후 재확인하세요'
assert '5분 뒤 재확인' in od['why']
od['why'] = od['why'].replace('5분 뒤 재확인', '15분 뒤 재확인')

# 2. 인슐린 용량사고 위기 [16] — start → get … ready(포도당은 지시·프로토콜로 시작)
T = '인슐린 용량사고 위기'
o = "Check his sugar now and start dextrose if he's dropping."
OLD.append(o)
replace(doc, CH, 16, T, 1, o, {
    'en': "Check his sugar now and get dextrose ready if he's dropping.",
    'ko': '지금 혈당을 확인하고 떨어지고 있으면 포도당을 준비해 둬요.',
    'chunks': ['Check his sugar', 'now', 'and get dextrose ready', "if he's dropping", '.'],
    'words': ['w-check', 'w-sugar', 'w-dextrose', 'w-drop'],
    'why': ("'Check … and get … ready if'는 먼저 재 보고, 떨어지는 중이면 포도당을 곁에 준비해 두라는 순서예요. "
            "포도당 투여는 지시나 프로토콜에 따라 시작하고, 'dropping'은 지금 떨어지는 중이라는 진행형이에요."),
    'decoy': 'and gets dextrose ready',
    'distractorsKo': ['지금 혈당을 확인하고 땀을 흘리면 포도당을 준비해 둬요.',
                      '지금 혈당을 확인하고 손이 떨리면 포도당을 준비해 둬요.'],
}, ['en', 'ko', 'chunks', 'words'], 'start dextrose → get dextrose ready(간호사 단독 시작으로 읽힘); −w-start(9.1 등에서 계속 씀)')
s16 = sit(doc, 16, T)
od = s16['order']
l = od['lines'][1]
assert l['en'] == "Next, check his sugar now and start dextrose if he's dropping."
l['en'] = "Next, check his sugar now and get dextrose ready if he's dropping."
l['ko'] = '다음으로 혈당을 확인하고 떨어지면 포도당을 준비해 둬요'
assert '떨어지면 포도당을 시작하며' in od['why']
od['why'] = od['why'].replace('떨어지면 포도당을 시작하며', '떨어지면 포도당을 준비하며')

# 3. 급식 중단 후 저혈당 급변 [18] — Start dextrose → Follow the hypoglycemia protocol
T = '급식 중단 후 저혈당 급변'
o = 'Start dextrose and recheck his sugar immediately.'
OLD.append(o)
replace(doc, CH, 18, T, 1, o, {
    'en': 'Follow the hypoglycemia protocol and recheck his sugar immediately.',
    'ko': '저혈당 프로토콜을 따르고 즉시 혈당을 재확인해요.',
    'chunks': ['Follow', 'the hypoglycemia protocol', 'and recheck', 'his sugar immediately', '.'],
    'words': ['w-follow', 'w-protocol', 'w-recheck', 'w-sugar', 'w-immediately'],
    'why': ("'Follow the hypoglycemia protocol'로 간호사가 혼자 정하지 않고 병원이 정해 둔 저혈당 절차(포도당 투여 포함)대로 "
            "처치한다고 말해요. 'immediately'는 처치 뒤 재확인을 미루지 말라는 뜻이에요."),
    'distractorsKo': ['저혈당 프로토콜을 따르고 급식 펌프를 점검해요.',
                      '저혈당 프로토콜을 따르고 급식 재개 시간을 팀과 정해요.'],
    'blank': blank('hypoglycemia', ['hypotension', 'hypothermia', 'delirium']),
}, ['en', 'ko', 'chunks', 'words'],
    'Start dextrose → Follow the hypoglycemia protocol(간호사 단독 판단으로 읽힘); −w-start −w-dextrose(9.1·16.1에서 계속 씀) +w-follow +w-protocol')
s18 = sit(doc, 18, T)
od = s18['order']
l = od['lines'][2]
assert l['en'] == 'With that done, start dextrose and recheck his sugar immediately.'
l['en'] = 'With that done, follow the hypoglycemia protocol and recheck his sugar.'
l['ko'] = '그러고 나서 저혈당 프로토콜을 따르고 혈당을 재확인해요'
assert '포도당을 시작해 재확인한 뒤' in od['why']
od['why'] = od['why'].replace('포도당을 시작해 재확인한 뒤', '저혈당 프로토콜대로 처치하고 재확인한 뒤')

# 4. 반복 저혈당 프로토콜 재설계 [19] — 수 일치
T = '반복 저혈당 프로토콜 재설계'
o = 'Three lows means we need to review the whole regimen with the team.'
OLD.append(o)
replace(doc, CH, 19, T, 0, o, {
    'en': 'Three lows mean we need to review the whole regimen with the team.',
    'chunks': ['Three lows mean', 'we need to review', 'the whole regimen', 'with the team', '.'],
    'why': ("주어 'Three lows'가 복수라 동사는 mean이에요. 횟수가 다시 살펴볼 기준이 된다는 뜻이고, "
            "'with the team'으로 혼자가 아닌 팀의 일임을 말해요."),
    'decoy': 'Three lows means',
}, ['en', 'chunks'], 'means → mean(복수 주어 수 일치) — ko는 그대로')

# keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-glycemic-A.md keyPhrase 표 6
recut(3, '저혈당 징후 인지', 0, "Those shaky, sweaty feelings can mean a low sugar, so let's check now.",
      ['Those shaky, sweaty feelings', 'can mean', 'a low sugar', ", so let's check now", '.'], {'decoy': 'can means'})
recut(5, '혈당 경향 보고', 1, "Let's look at the pattern over the last several checks together.",
      ["Let's look at", 'the pattern', 'over the last several checks', 'together', '.'], {'decoy': 'the dose'})
recut(10, '주입에서 피하 전환 관리', 0, 'We give your first long-acting shot before stopping the drip.',
      ['We give', 'your first long-acting shot', 'before stopping', 'the drip', '.'])
recut(10, '주입에서 피하 전환 관리', 1, 'That overlap keeps your sugar covered during the switch.',
      ['That overlap', 'keeps your sugar', 'covered', 'during the switch', '.'])
recut(12, '혈당 변동성 관리', 1, 'Smoother insulin adjustments help level out the ups and downs.',
      ['Smoother insulin adjustments', 'help', 'level out', 'the ups and downs', '.'], {'decoy': 'helps'})
recut(14, 'POC와 정맥혈당 불일치 인지', 1, 'If they conflict, we confirm with a venous sample.',
      ['If they conflict', ', we', 'confirm', 'with a venous sample', '.'], {'decoy': 'confirms'})
recut(20, '혈당 급변·의식변화 감별', 0, "First I'll check his sugar, since a low or high can cause confusion.",
      ["First I'll check his sugar", ', since a low or high', 'can cause', 'confusion', '.'], {'decoy': 'can causes'})

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-glycemic.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-glycemic.yaml'), CH)
print('icu-glycemic.yaml 저장')
