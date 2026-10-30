"""core-handoff-icu — keyPhrase 4문장 교체 + keyPhrase chunks 10문장 다시 자르기(2026-10-30 묶음 8 결정).
base-core-handoff-icu.yaml → core-handoff-icu.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-core-handoff-icu.yaml'))
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


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']


# 1. 검사·시술 후 인계 [13] 문장 3 — 문법(Repeat가 동사 자리) + 기관지경 뒤 엑스레이는 기흉 확인
T = '검사·시술 후 인계'
o = 'Repeat her chest X-ray was ordered for placement.'
OLD.append(o)
drop_word('w-placement', '13.3 문장을 바꿔 어느 문장도 태그하지 않게 됨(기관지경 뒤 엑스레이는 위치 확인이 아니라 기흉 확인)')
s = replace(doc, CH, 13, T, 3, o, {
    'en': 'A repeat chest X-ray was ordered to rule out a pneumothorax.',
    'ko': '기흉 배제를 위해 흉부 엑스레이 재촬영이 처방되었습니다.',
    'chunks': ['A repeat chest X-ray', 'was ordered', 'to rule out', 'a pneumothorax', '.'],
    'words': ['w-repeat', 'w-chest', 'w-xray', 'w-order'],
    'why': ("was ordered to + 동사는 오더가 난 목적까지 붙이는 수동태예요. 기관지경검사(특히 생검) 뒤에는 기흉이 생길 수 있어 "
            "rule out으로 없는지 확인한다고 말해요."),
    'decoy': 'a rib fracture',
    'blank': blank('pneumothorax', ['fracture', 'stroke', 'blood clot']),
}, ['en', 'ko', 'chunks', 'words'],
    'Repeat her chest X-ray … for placement → A repeat chest X-ray … to rule out a pneumothorax(Repeat가 동사 자리인 문법 오류, '
    '기관지경 뒤 엑스레이는 위치가 아니라 기흉 확인); −w-placement(word-remove)')
check_new(s)
od = order_line(13, T, 1, 'As a follow-up, a repeat chest X-ray was ordered for placement.', {
    'en': 'As a follow-up, a repeat chest X-ray was ordered to rule out a pneumothorax.',
    'ko': '후속으로 기흉 배제를 위해 흉부 엑스레이 재촬영이 처방됐어요',
})
order_line(13, T, 3, 'Given that, watch her oxygen and let me know if you see any new bleeding at the site.', {
    'en': 'Given that, watch her oxygen and watch for blood in her secretions.',
    'ko': '그러니 산소와 분비물에 섞이는 피를 지켜봐 주세요',
})
assert od['why'] == '시술이 끝났다는 사실로 시작하고, 후속 영상 오더를 알리고, 그 사이 산소 상태를 보고한 뒤, 앞으로 볼 것으로 끝내요.'
od['why'] = '시술이 끝났다는 사실로 시작하고, 기흉을 배제할 후속 엑스레이 오더를 알리고, 그 사이 산소 상태를 보고한 뒤, 앞으로 볼 것으로 끝내요.'

# 2. 다수 중환자 동시 인계 우선화 [20] 문장 3 — go off(경보처럼 들림) → crash
T = '다수 중환자 동시 인계 우선화'
o = 'If two go off at once, call for help early.'
OLD.append(o)
s = replace(doc, CH, 20, T, 3, o, {
    'en': 'If two of them crash at once, call for help early.',
    'chunks': ['If two of them crash', 'at once', ', call for help', 'early', '.'],
    'words': ['w-crash', 'w-call'],
    'why': ("If two of them crash at once처럼 가정을 구체적으로 정해 두면 그 순간 주저 없이 도움을 부를 수 있어요. "
            "crash는 상태가 갑자기 무너진다는 현장 말이고, early는 혼자 버티다 늦지 말라는 뜻이에요."),
    'decoy': 'If two of them complain',
}, ['en', 'chunks', 'words'], 'If two go off → If two of them crash(환자에게 go off는 안 씀 — 경보가 울린다로 들림); +w-crash 태그 — ko 그대로')
check_new(s)
od = order_line(20, T, 3, 'If two of them get worse at once, call for help early.', {
    'en': 'If two of them crash at once, call for help early.',
    'ko': '그중 둘이 동시에 급변하면 일찍 도움을 요청하세요',
})

# 3. 불안정 환자 인계 강조점 [14] 문장 0 — 승압제 시작에 처방 전제
T = '불안정 환자 인계 강조점'
o = 'If his MAP drops below sixty-five, start pressors and call me.'
OLD.append(o)
s = replace(doc, CH, 14, T, 0, o, {
    'en': 'If his MAP drops below sixty-five, start pressors per the order and call me.',
    'ko': 'MAP이 65 아래로 떨어지면 처방대로 승압제를 시작하고 저를 불러 주세요.',
    'chunks': ['If his MAP drops', 'below sixty-five', ', start pressors', 'per the order', 'and call me', '.'],
    'words': ['w-map', 'w-drop', 'w-pressor', 'w-call'],
    'why': ("If … drops below + 수치는 부르는 기준을 숫자로 정해요. per the order를 붙여 승압제는 간호사 판단이 아니라 "
            "처방된 기준(titration order)대로 시작한다는 점을 분명히 해요."),
    'decoy': 'If her MAP drops',
    'blank': blank('order', ['schedule', 'routine', 'handout']),
    'distractorsKo': ['MAP 65는 신장과 뇌 같은 장기 관류를 지키려고 흔히 잡는 목표예요.',
                      'MAP이 65 아래로 오래 머물면 신장과 뇌로 가는 피가 줄어들어요.'],
}, ['en', 'ko', 'chunks'], 'start pressors and call me → start pressors per the order and call me(승압제 시작을 처방 전제 없이 인계로 지시 — 업무 범위) — words 그대로, 빈칸을 처치(pressors)에서 per the order로 옮김')
check_new(s)
# order 14 셋째 줄은 이미 'start pressors per the order and call me' — 그대로

# 4. night shift 인계 우선순위 [10] 문장 2 — 영국식 two-hourly → 미국식 every two hours
T = 'night shift 인계 우선순위'
o = "Labs are due at four, and he's on a two-hourly neuro check."
OLD.append(o)
s = replace(doc, CH, 10, T, 2, o, {
    'en': "Labs are due at four, and he's on neuro checks every two hours.",
    'chunks': ['Labs are due', 'at four', ", and he's on", 'neuro checks', 'every two hours', '.'],
    'why': ("be due at + 시각으로 검사 시간을 못 박고 on neuro checks every two hours로 반복 확인과 그 간격을 한 문장에 담아요. "
            "미국 병원에서는 간격을 every two hours(차트에는 q2)로 말해요."),
    'decoy': ", and she's on",
}, ['en', 'chunks'], "a two-hourly neuro check → neuro checks every two hours(two-hourly는 영국·호주식, 미국은 every two hours·q2) — ko·words 그대로")
check_new(s)
order_line(10, T, 2, "With that focus, labs are due at four, and he's on a two-hourly neuro check.", {
    'en': 'With that focus, labs are due at four, and neuro checks are every two hours.',
    'ko': '그 집중 속에서 검사는 4시고 신경학적 확인은 두 시간마다예요',
})

# 5. keyPhrase chunks 다시 자르기 (en 그대로) — fix-core-handoff-icu-A.md K8
recut(1, '활력·주입약 인계', 0, "She's on norepinephrine at eight, titrating to a MAP of sixty-five.",
      ["She's on norepinephrine", 'at eight', ', titrating', 'to a MAP of sixty-five', '.'])
recut(1, '활력·주입약 인계', 3, "Her pressure's been stable for the last two hours.",
      ["Her pressure's", 'been stable', 'for', 'the last two hours', '.'])
recut(2, '라인·장치 목록 인계', 0, 'He has a right IJ central line and a left radial art line.',
      ['He has', 'a right IJ central line', 'and', 'a left radial art line', '.'])
recut(2, '라인·장치 목록 인계', 1, "The Foley's draining well and the NG is to low suction.",
      ["The Foley's draining well", 'and the NG', 'is', 'to low suction', '.'])
recut(3, '간호 문제·계획 인계', 0, 'Top priority is her respiratory status — watch her weaning trial.',
      ['Top priority is', 'her respiratory status', '— watch', 'her weaning trial', '.'], {'decoy': 'her meal tray'})
recut(4, '알레르기·주의사항 전달', 1, "There's a latex allergy flag on her chart too.",
      ["There's", 'a latex allergy flag', 'on her chart', 'too', '.'], {'decoy': 'a food allergy flag'})
recut(7, 'OR에서 ICU 수술후 인계', 2, 'What were the estimated blood loss and last pressor doses?',
      ['What were', 'the estimated blood loss', 'and', 'last pressor doses', '?'])
recut(8, 'cath lab에서 ICU 인계', 4, 'Let me read back the sheath status and hold parameters.',
      ['Let me', 'read back', 'the sheath status', 'and hold parameters', '.'])
recut(12, '응급실에서 ICU 입실 인계', 2, 'Is he on any pressors coming up from the ED?',
      ['Is he on', 'any pressors', 'coming up', 'from the ED', '?'], {'decoy': 'from the OR'})
recut(12, '응급실에서 ICU 입실 인계', 3, 'Let me confirm his lines, antibiotics, and last vitals.',
      ['Let me confirm', 'his lines', ', antibiotics', ', and last vitals', '.'])

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['for placement', 'two-hourly', 'If two go off', 'w-placement']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'core-handoff-icu.yaml'))
append_changes(os.path.join(HERE, 'changes-core-handoff-icu.yaml'), CH)
print('core-handoff-icu.yaml 저장')
