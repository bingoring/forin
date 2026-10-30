"""or-massive-transfusion — keyPhrase 2문장 교체 + keyPhrase chunks 9문장 다시 자르기(2026-10-30 OR 묶음 1 결정, '추천대로').
base-or-massive-transfusion.yaml → or-massive-transfusion.yaml"""
import io, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-or-massive-transfusion.yaml'))
CH = []
OLD = []


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']


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


# 1. 혈액 재고 소진 위기 [19] 문장 2 — 미국에서 쓰는 절차 이름이 아님 → 혈액은행이 지역 공급처에 주문
T = '혈액 재고 소진 위기'
o = 'Should we activate a regional blood request?'
OLD.append(o)
drop_word('w-request', '19.2 문장을 바꿔 어느 문장도 태그하지 않게 됨(regional blood request → 혈액은행이 지역 공급처에 주문)')
s = replace(doc, CH, 19, T, 2, o, {
    'en': 'Should we ask the blood bank to order from the regional supplier?',
    'ko': '혈액은행에 지역 공급처에서 주문해 달라고 할까요?',
    'chunks': ['Should we ask', 'the blood bank', 'to order', 'from the regional supplier', '?'],
    'words': ['w-bank', 'w-regional'],
    'tag': '지역 주문',
    'icon': 'pager',
    'why': ("Should we …?로 혼자 정하지 않고 팀에 먼저 물어요. 지역 공급처에 주문을 넣는 건 병원 혈액은행이라, "
            "ask the blood bank to order로 누가 주문하는지를 분명히 해요."),
    'decoy': 'to borrow',
    'distractorsKo': ['지역 공급처에 주문하기 전에 남은 단위를 셀까요?',
                      '지역 공급처에서 오는 혈액은 시간이 걸릴까요?'],
    'blank': blank('supplier', ['office', 'courier', 'registry']),
    '_moved': {'w-activate': ("Let's activate the emergency release now.", '지금 응급 불출을 요청합시다.')},
}, ['en', 'ko', 'chunks', 'words'],
    'Should we activate a regional blood request → Should we ask the blood bank to order from the regional supplier'
    "(미국에서 쓰는 절차 이름이 아님 — 지역 공급처 긴급 주문은 병원 혈액은행이 함; 검토 A K3); −w-activate·−w-request 태그 +w-bank 태그"
    "(w-activate는 19.4에 남음, w-request는 word-remove)")
check_new(s)
od = order_line(19, T, 2, 'Should we activate a regional blood request as a backup?', {
    'en': 'Should we ask the blood bank to order from the regional supplier as a backup?',
    'ko': '예비로 혈액은행에 지역 공급처에서 주문해 달라고 할까요',
})
order_line(19, T, 3, "I'll ask our blood bank to start it with the regional supplier.", {
    'en': "If the team agrees, I'll call our blood bank to place that order.",
    'ko': '팀이 동의하면 혈액은행에 연락해 그 주문을 넣어 달라고 할게요',
})
assert od['why'].endswith('예비로 지역 혈액 요청을 제안한 뒤, 혈액은행에 지역 공급처로 시작해 달라고 부탁해요.'), od['why']
od['why'] = ('남은 양을 알리고, 응급 O형 음성 불출을 요청하고, 예비로 지역 공급처 주문을 혈액은행에 부탁할지 팀에 물은 뒤, '
             '팀이 동의하면 혈액은행에 그 주문을 넣어 달라고 연락해요.')

# 2. 순환 과부하 TACO [20] 문장 1 — 반응이 의심되면 늦추지 않고 일단 멈추고 보고
T = '순환 과부하 TACO'
o = 'Slow the transfusion—this looks like TACO.'
OLD.append(o)
s = replace(doc, CH, 20, T, 1, o, {
    'en': 'Stop the transfusion—this looks like TACO.',
    'ko': '수혈을 멈추세요. TACO 같아요.',
    'chunks': ['Stop', 'the transfusion—this', 'looks like TACO', '.'],
    'words': ['w-stop', 'w-transfusion', 'w-taco'],
    'tag': '수혈 중단',
    'icon': 'siren',
    'why': ("Stop을 맨 앞에 두어 할 일을 먼저 말하고 this looks like로 이유를 짧게 붙여요. "
            "순환 과부하가 의심되면 수혈을 일단 멈추고 마취과 의사에게 알려 다음 조치를 정해요."),
    'decoy': 'looks like TRALI',
    'distractorsKo': ['수혈을 멈추세요. TRALI 같아요.',
                      '수혈을 멈추면 순환 부담이 줄어요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'Slow the transfusion → Stop the transfusion(반응이 의심되면 미국 관행은 일단 멈추고 평가·보고; judge A); −w-slow 태그(3.1·20.4에 남음) +w-stop 태그')
check_new(s)
od = order_line(20, T, 1, 'With those rising, slow the transfusion—this looks like TACO.', {
    'en': 'With those rising, stop the transfusion—this looks like TACO.',
    'ko': '그게 오르니 수혈을 멈추세요, TACO 같아요',
    'note': '중단',
})
assert od['why'] == '정맥압과 부종이 오른다고 알리고, 수혈 속도를 늦추며, 이뇨제를 주고, 투여 뒤 폐와 혈압을 다시 평가해요.', od['why']
od['why'] = '정맥압과 부종이 오른다고 알리고, 수혈을 일단 멈춘 뒤, 이뇨제를 주고, 투여 뒤 폐와 혈압을 다시 평가해요.'
# 20.4(목록 밖, en 그대로) — 멈춘 뒤 다시 이어 갈 때의 말로 why를 맞춘다(v46 필드)
s4 = sent(doc, 20, T, 4, "Let's slow the rate and recheck the pressure.")
s4['why'] = ('평가 뒤 수혈을 다시 이어 갈 때의 말이에요. slow와 recheck를 and로 이어 속도를 낮추고 확인하는 두 단계를 한 문장에 담고, '
             'the pressure로 재확인 대상이 혈압임을 분명히 해요.')
# swap 20 — 정답을 stop으로(뉘앙스: v44 필드 아님)
sw = [n for n in sit(doc, 20, T)['nuance'] if n['kind'] == 'swap']
assert len(sw) == 1 and sw[0]['answer'] == 'slow down'
sw = sw[0]
sw['words'] = ['w-stop', 'w-transfusion', 'w-taco']
sw['options'] = ['speed up', 'slow down', 'stop']
sw['answer'] = 'stop'
sw['notes'] = {
    'speed up': sw['notes']['speed up'],
    'slow down': '늦추기만 하면 이미 넘친 순환에 피가 계속 들어가요. 과부하가 의심되면 먼저 멈추고 평가해요.',
    'stop': '순환 과부하가 의심되면 수혈을 일단 멈추고 마취과 의사에게 알려 평가해요.',
}
sw['why'] = 'TACO는 너무 많이, 너무 빨리 넣어 순환이 넘치는 반응이에요. 수혈을 일단 멈추고 마취과 의사와 다음 조치를 정해요.'
sw['ko'] = '수혈을 멈춥시다. TACO 같아요'

# 3. keyPhrase chunks 다시 자르기 (en 그대로) — fix-…-A.md K4 · judge-…-A.md
recut(2, '혈액 가온 적용', 0, "Let's route this through the warmer.",
      ["Let's route", 'this', 'through the warmer', '.'],
      {'decoy': 'through the cooler'})
recut(3, '수혈 속도 조정', 1, 'We can slow it if the numbers stabilize.',
      ['We can', 'slow it', 'if the numbers stabilize', '.'],
      {'decoy': 'if the cooler arrives'})
recut(8, '수혈 저체온 예방', 2, "I'll raise the room temperature.",
      ["I'll", 'raise', 'the room temperature', '.'],
      {'decoy': 'the room lights'})
recut(12, '희석성 응고장애', 0, "There's diffuse oozing from the field.",
      ["There's", 'diffuse oozing', 'from the field', '.'],
      {'decoy': 'from the dressing'})
recut(13, '산-염기 대사 감시', 0, "Let's get an arterial blood gas.",
      ["Let's", 'get', 'an arterial blood gas', '.'],
      {'decoy': 'a venous blood gas'})
recut(14, '반복 응고검사', 1, "We'll dose product off the latest results.",
      ["We'll", 'dose product', 'off the latest results', '.'])
recut(16, '고칼륨혈증 부정맥', 2, 'Watch the rhythm—it could deteriorate fast.',
      ['Watch', 'the rhythm—it', 'could deteriorate fast', '.'],
      {'decoy': 'the cooler—it'})
recut(18, 'TRALI 급성 호흡곤란', 0, 'Sats are falling with new pulmonary edema.',
      ['Sats', 'are falling', 'with new pulmonary edema', '.'],
      {'decoy': 'with new wheezing'})
recut(19, '혈액 재고 소진 위기', 0, "We're down to our last two units.",
      ["We're", 'down to', 'our last two units', '.'],
      {'decoy': 'our last two blankets'})

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['regional blood request', '지역 혈액 요청', 'w-request', '속도 감속', '수혈 속도를 늦추세요', '수혈 속도를 늦춥시다',
            '수혈 속도를 늦추며', 'slow the transfusion']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'or-massive-transfusion.yaml'))
append_changes(os.path.join(HERE, 'changes-or-massive-transfusion.yaml'), CH)
print('or-massive-transfusion.yaml 저장')
