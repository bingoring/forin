"""icu-mobility-prevention — keyPhrase 1문장 교체 + keyPhrase chunks 16문장 다시 자르기(2026-10-30 묶음 8 결정).
base-icu-mobility-prevention.yaml → icu-mobility-prevention.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-mobility-prevention.yaml'))
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


# 1. 급성 폐색전 발생 위기 [18] 문장 2 — 신속대응팀 → 담당의를 침상으로
T = '급성 폐색전 발생 위기'
o = "I'm giving high-flow oxygen and calling the rapid response."
OLD.append(o)
drop_word('w-rapid', '18.2 문장을 바꿔 어느 문장도 태그하지 않게 됨(ICU 안에서는 신속대응팀이 아니라 담당의를 부름)')
drop_word('w-response', '18.2 문장을 바꿔 어느 문장도 태그하지 않게 됨(ICU 안에서는 신속대응팀이 아니라 담당의를 부름)')
s = replace(doc, CH, 18, T, 2, o, {
    'en': "I'm giving high-flow oxygen and calling the provider to the bedside.",
    'ko': '고유량 산소를 주고 주치의를 침상으로 부르고 있어요.',
    'chunks': ["I'm giving", 'high-flow oxygen', 'and calling', 'the provider', 'to the bedside', '.'],
    'words': ['w-oxygen', 'w-call', 'w-provider'],
    'why': ("산소(처방·프로토콜 범위 안에서)와 호출을 'and'로 이어 두 가지를 동시에 한다고 알려요. "
            "'to the bedside'를 붙여 전화 지시가 아니라 직접 와서 봐 달라는 뜻을 분명히 해요."),
    'decoy': 'to the waiting room',
    'distractorsKo': ['고유량 산소를 주고 주치의를 침상으로 부르려고 전화를 들어요.',
                      '폐색전은 몇 분 만에 심정지로 이어질 수 있어요.'],
    'blank': blank('bedside', ['station', 'doorway', 'hallway']),
}, ['en', 'ko', 'chunks', 'words'],
    'calling the rapid response → calling the provider to the bedside(ICU 안에는 담당의가 상주해 신속대응팀이 아니라 담당의를 침상으로 부름); '
    '+w-call +w-provider 태그, −w-rapid −w-response(word-remove)')
od = order_line(18, T, 2, "Because of that worry, I'm giving high-flow oxygen and calling the rapid response.", {
    'en': "Because of that worry, I'm giving high-flow oxygen and calling the provider to the bedside.",
    'ko': '그 우려 때문에 고유량 산소를 주고 주치의를 침상으로 부르고 있어요',
})
# 15단어 상한 — 위 줄은 15단어
order_line(18, T, 3, "While they're on the way, we need imaging and the provider at the bedside.", {
    'en': "When the provider gets here, we'll need imaging right away.",
    'ko': '주치의가 오면 바로 영상검사가 필요해요',
})
assert od['why'] == '증상을 보고하고, 폐색전 우려를 말하고, 그 우려에 따라 산소와 신속대응을 시작한 뒤, 영상검사와 주치의를 요청해요.'
od['why'] = '증상을 보고하고, 폐색전 우려를 말하고, 그 우려에 따라 산소를 주며 주치의를 침상으로 부른 뒤, 주치의가 오면 바로 할 영상검사를 말해요.'

# 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-mobility-prevention-A.md keyPhrase 16문장
recut(0, 'VTE 위험 평가·예방', 3, "I'll confirm the chemical prophylaxis order and any contraindications.",
      ["I'll confirm", 'the chemical prophylaxis order', 'and', 'any contraindications', '.'])
recut(1, '욕창 위험 사정', 2, 'Low mobility and moisture are her biggest factors.',
      ['Low mobility', 'and moisture', 'are her biggest factors', '.'], {'decoy': 'are her biggest strengths'})
recut(3, '조기 이동 스크리닝', 1, 'Her oxygenation and hemodynamics meet the mobility criteria.',
      ['Her oxygenation', 'and hemodynamics', 'meet the mobility criteria', '.'], {'decoy': 'and her appetite'})
recut(4, '피부·압박점 사정', 2, "This area doesn't blanch — it may be a stage-one injury.",
      ['This area', "doesn't blanch", '— it may be', 'a stage-one injury', '.'])
recut(5, '수동 관절운동', 1, "I'll take each joint gently through its full range.",
      ["I'll take", 'each joint', 'gently', 'through its full range', '.'], {'decoy': 'each dose'})
recut(5, '수동 관절운동', 3, "This helps prevent contractures while he's immobile.",
      ['This helps prevent', 'contractures', "while he's immobile", '.'], {'decoy': "while he's at dialysis"})
recut(8, '욕창 단계별 관리', 1, 'This looks like a stage-two injury with partial-thickness loss.',
      ['This', 'looks like', 'a stage-two injury', 'with partial-thickness loss', '.'])
recut(9, '의료기기 관련 욕창 예방', 3, 'The collar and mask edges are common pressure points.',
      ['The collar', 'and mask edges', 'are', 'common pressure points', '.'], {'decoy': 'common entry points'})
recut(12, 'ICU 획득 쇠약 예방', 1, 'Early mobility helps prevent ICU-acquired weakness.',
      ['Early mobility', 'helps prevent', 'ICU-acquired weakness', '.'], {'decoy': 'Early bathing'})
recut(12, 'ICU 획득 쇠약 예방', 2, "We'll minimize deep sedation to keep her participating.",
      ["We'll minimize", 'deep sedation', 'to keep her participating', '.'], {'decoy': 'to keep her eating'})
recut(13, '점진적 좌위·의자 이동', 3, "I'm watching her vitals and how she's feeling at each step.",
      ["I'm watching", 'her vitals', "and how she's feeling", 'at each step', '.'], {'decoy': "and how she's dressed"})
recut(14, '영양·피부 통합 관리', 1, 'Adequate protein and calories support wound healing.',
      ['Adequate protein', 'and calories', 'support wound healing', '.'], {'decoy': 'and caffeine'})
recut(15, '심부 욕창·감염 위기', 1, 'The wound is deep with foul drainage — this looks infected.',
      ['The wound', 'is deep', 'with foul drainage', '— this looks infected', '.'])
recut(15, '심부 욕창·감염 위기', 3, 'We may need debridement and cultures.',
      ['We may need', 'debridement', 'and cultures', '.'], {'decoy': 'and imaging'})
recut(17, '이동 중 낙상·손상 위기', 3, "I'll call for help and assess her from head to toe.",
      ["I'll call", 'for help', 'and assess her', 'from head to toe', '.'], {'decoy': 'from bed to chair'})
recut(20, '다발성 욕창·불응 목표 소통', 2, 'I want to talk honestly about his overall condition.',
      ['I want to talk', 'honestly', 'about', 'his overall condition', '.'], {'decoy': 'his turning schedule'})

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
assert 'rapid response' not in raw and '신속대응을 시작' not in raw
dump(doc, os.path.join(HERE, 'icu-mobility-prevention.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-mobility-prevention.yaml'), CH)
print('icu-mobility-prevention.yaml 저장')
