"""icu-aki-crrt — keyPhrase 2문장 교체 + keyPhrase chunks 다시 자르기(2026-10-27). base-icu-aki-crrt.yaml → icu-aki-crrt.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-aki-crrt.yaml'))
CH = []
OLD = []


def other(si, k):
    s = doc['situations'][si]['sentences'][k]
    return (s['en'], s['ko'])


def recut(si, title, index, en, chunks, extra=None, note=None):
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
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로" + (note or '')})


# 4. 시트르산 축적 위기 [1] — 알칼리증 → 대사성 산증(음이온차 증가)
T = '시트르산 축적 위기'
o = "He's developing metabolic alkalosis and low ionized calcium."
OLD.append(o)
remove_word(doc, 'w-alkalosis')
CH.append({'kind': 'word-remove', 'id': 'w-alkalosis', 'why': '바꾼 문장에 alkalosis가 없어 어느 문장도 태그하지 않게 됐다'})
NEW_EN = "He's developing metabolic acidosis and low ionized calcium."
NEW_KO = '대사성 산증과 낮은 이온화 칼슘이 진행되고 있어요.'
doc['words'].append({
    'id': 'w-acidosis',
    'en': 'acidosis',
    'ipa': '/ˌæsɪˈdoʊsɪs/',
    'ko': '산증',
    'icon': 'monitor',
    'example': NEW_EN,
    'exKo': NEW_KO,
    'cue': '시트르산 같은 산이 쌓여 혈액이 정상보다 산성 쪽으로 기운 상태',
    'tag': '전해질',
    'distractorsEn': ['alkalosis', 'ketosis'],
    'distractorsKo': ['알칼리증', '케톤증'],
    'chips': [['ac', 'i', 'do', 'sis']],
    'decoyChips': ['ax', 'dose'],
})
CH.append({'kind': 'word-add', 'id': 'w-acidosis',
           'why': '시트르산 축적의 전형은 음이온차가 늘어난 대사성 산증 — 바꾼 문장이 가르치는 말(w-alkalosis 대신)'})
replace(doc, CH, 17, T, 1, o, {
    'en': NEW_EN,
    'ko': NEW_KO,
    'chunks': ["He's developing", 'metabolic acidosis', 'and low ionized calcium', '.'],
    'words': ['w-develop', 'w-metabolic', 'w-acidosis', 'w-low', 'w-ionized', 'w-calcium'],
    'why': ("'developing'은 이미 진행 중이라는 진행형이에요. 시트르산이 대사되지 못하고 쌓이면 음이온차가 늘어난 "
            "대사성 산증과 낮은 이온화 칼슘이 함께 나타나서, 둘을 한 번에 전해요."),
    'distractorsKo': ['심한 빈혈과 낮은 이온화 칼슘이 진행되고 있어요.',
                      '대사성 산증과 낮은 혈소판 수치가 진행되고 있어요.'],
    'blank': blank('ionized', ['total', 'dietary', 'urinary']),
}, ['en', 'ko', 'chunks', 'words'],
    'metabolic alkalosis(시트르산 축적의 전형은 음이온차 대사성 산증 — 알칼리증은 대사가 정상인 과부하 쪽) → metabolic acidosis; −w-alkalosis(은행에서 지움) +w-acidosis(새 단어)')
s17 = sit(doc, 17, T)
l2 = s17['order']['lines'][1]
assert l2['en'] == 'His ionized calcium is also low.'
l2['en'] = "That's why he's developing metabolic acidosis and low ionized calcium."
l2['ko'] = '그래서 대사성 산증과 낮은 이온화 칼슘이 진행되고 있어요'

# 5. 시트르산 항응고 대사 감시 [0]
T = '시트르산 항응고 대사 감시'
o = 'We monitor the systemic and circuit calcium ratio closely.'
OLD.append(o)
replace(doc, CH, 8, T, 0, o, {
    'en': 'We monitor his systemic and circuit ionized calcium closely.',
    'ko': '전신과 회로의 이온화 칼슘을 자세히 감시해요.',
    'chunks': ['We monitor', 'his systemic and circuit', 'ionized calcium', 'closely', '.'],
    'words': ['w-monitor', 'w-systemic', 'w-circuit', 'w-ionized', 'w-calcium', 'w-closely'],
    'why': ("'systemic and circuit'을 짝지어 말하면 몸 전체의 이온화 칼슘과 필터 뒤 회로의 이온화 칼슘을 각각 본다는 뜻이 돼요. "
            "'closely'는 자주 본다는 뉘앙스예요."),
    'distractorsKo': ['전신과 회로의 이온화 칼슘을 매번 그래프로 그려요.',
                      '전신과 회로의 이온화 칼슘을 인계 때 꼭 말해요.'],
    'blank': blank('systemic', ['urinary', 'dietary', 'gastric']),
    '_moved': {'w-ratio': other(8, 3)},
}, ['en', 'ko', 'chunks', 'words'],
    'the systemic and circuit calcium ratio(둘 사이의 비처럼 읽힘 — 전신·회로 이온화 칼슘은 따로 재는 값) → his systemic and circuit ionized calcium; −w-ratio(8.3·8.5에서 계속 씀) +w-ionized')
s8 = sit(doc, 8, T)
ol = s8['order']
assert ol['lines'][0]['en'] == o
ol['lines'][0]['en'] = 'We monitor his systemic and circuit ionized calcium closely.'
ol['lines'][0]['ko'] = '전신과 회로의 이온화 칼슘을 자세히 감시해요'
assert ol['lines'][1]['en'] == 'If it keeps rising, the citrate may be building up.'
ol['lines'][1]['en'] = 'If his total-to-ionized ratio keeps rising, the citrate may be building up.'
ol['lines'][1]['ko'] = '총-이온화 비율이 계속 오르면 시트르산이 쌓이고 있을 수 있어요'
assert ol['why'].startswith('무엇을 감시하는지 말하고, 비율이 오르면')

# chunks 다시 자르기 — 검토(fix-A chunks 절 'keyPhrase라 보고만 함')가 구 경계를 끊는다고 보고한 keyPhrase
recut(3, 'CRRT 개념·목적 이해', 1, "It's gentler on the blood pressure than regular dialysis.",
      ["It's", 'gentler', 'on the blood pressure', 'than regular dialysis', '.'])
recut(6, 'CRRT 처방 파라미터 이해', 0, "Let's review the blood flow rate and dialysate settings.",
      ["Let's", 'review', 'the blood flow rate', 'and dialysate settings', '.'])
recut(6, 'CRRT 처방 파라미터 이해', 1, 'His net fluid removal goal is set per hour.',
      ['His', 'net fluid removal goal', 'is set', 'per hour', '.'],
      note='(9낱말이라 V8이 넷째 조각을 요구 — 동사구 is set과 용어 net fluid removal goal을 지키려고 His에서 끊음)')
recut(8, '시트르산 항응고 대사 감시', 1, 'Watch for signs of citrate accumulation in his acid-base status.',
      ['Watch for', 'signs', 'of citrate accumulation', 'in his acid-base status', '.'])
recut(11, '저혈압 동반 CRRT 관리', 1, "Let's coordinate the pressor support with the CRRT settings.",
      ["Let's", 'coordinate', 'the pressor support', 'with the CRRT settings', '.'])
recut(17, '시트르산 축적 위기', 0, 'The rising total-to-ionized calcium ratio suggests citrate accumulation.',
      ['The rising total-to-ionized calcium ratio', 'suggests', 'citrate accumulation', '.'], {'decoy': 'circuit clotting'})

check(doc, OLD)
rest = {**doc, 'words': [w for w in doc['words'] if w['id'] != 'w-acidosis']}  # w-acidosis 오답(alkalosis·알칼리증)만 빼고 본다
raw = yaml.safe_dump(rest, allow_unicode=True, width=10000)
assert 'alkal' not in raw.lower() and '알칼리' not in raw, '알칼리증 서술이 남음'
dump(doc, os.path.join(HERE, 'icu-aki-crrt.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-aki-crrt.yaml'), CH)
print('icu-aki-crrt.yaml 저장')
