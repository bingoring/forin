"""icu-invasive-lines — keyPhrase 4문장 교체 + keyPhrase chunks 4문장 다시 자르기(2026-10-29 묶음 7 결정 '추천대로').
base-icu-invasive-lines.yaml → icu-invasive-lines.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-invasive-lines.yaml'))
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
    assert l['en'] == old_en, l['en']
    l.update(new)
    assert len([t for t in l['en'].split() if t != '—']) <= 15, l['en']
    return od


# 1. 라인 관련 대량출혈·혈종 위기 [20] 1 — 신속대응팀 발동 → 의사를 침상 곁으로
T = '라인 관련 대량출혈·혈종 위기'
o = "His pressure is dropping — I'm activating the rapid response."
OLD.append(o)
for w in ('w-activate', 'w-rapid', 'w-response'):
    drop_word(w, '20.1 keyPhrase를 바꿔 어느 문장도 태그하지 않게 됨')
replace(doc, CH, 20, T, 1, o, {
    'en': 'His pressure is dropping — I need the physician at the bedside now.',
    'ko': '혈압이 떨어지고 있어요, 지금 의사 선생님이 침상 곁으로 와 주셔야 해요.',
    'chunks': ['His pressure', 'is dropping', '— I need the physician', 'at the bedside now', '.'],
    'words': ['w-pressure', 'w-drop', 'w-physician'],
    'tag': '의사 호출',
    'icon': 'bell',
    'why': ("상태 악화를 먼저 말하고 대시 뒤에 I need … now로 요청을 붙이면 왜 지금 와야 하는지가 한 번에 전달돼요. "
            "ICU에서는 신속대응팀이 아니라 담당 의사를 침상 곁으로 바로 불러요."),
    'decoy': '— I needs the physician',
    'distractorsKo': ['혈압이 떨어지고 있어요, 의사 선생님께 알리려고 수치를 다시 읽어 볼게요.',
                      '혈압이 떨어지고 있어요, 혈종 속으로 피가 계속 고이고 있어서예요.'],
}, ['en', 'ko', 'chunks', 'words'],
    "I'm activating the rapid response → I need the physician at the bedside now(ICU 안에서 신속대응팀 발동은 맞지 않음, 검토 A E절); −w-activate −w-rapid −w-response, +w-physician")
od = order_line(20, T, 1, "Even so, his pressure is dropping — I'm activating the rapid response.", {
    'en': 'Even so, his pressure is dropping — I need the physician at the bedside now.',
    'ko': '그래도 혈압이 떨어지고 있어요, 지금 의사 선생님이 침상 곁으로 와 주셔야 해요'})
assert '그래도 혈압이 떨어지면 신속대응을 부르고,' in od['why']
od['why'] = od['why'].replace('그래도 혈압이 떨어지면 신속대응을 부르고,', '그래도 혈압이 떨어지면 의사를 침상 곁으로 부르고,')

# 2. 라인 개방 공기색전 위기 [18] 2 — 코드팀 → 의사를 곁으로(맥박이 있으면 코드가 아님)
T = '라인 개방 공기색전 위기'
o = "This looks like an air embolism — I'm calling the code team."
OLD.append(o)
drop_word('w-code', '18.2 keyPhrase를 바꿔 어느 문장도 태그하지 않게 됨')
replace(doc, CH, 18, T, 2, o, {
    'en': 'This looks like an air embolism — I need the physician here now.',
    'ko': '공기색전으로 보여요, 지금 의사 선생님이 여기 와 주셔야 해요.',
    'chunks': ['This looks like', 'an air embolism', '— I need the physician', 'here now', '.'],
    'words': ['w-embolism', 'w-physician'],
    'tag': '위기 호출',
    'icon': 'bell',
    'why': ("looks like는 확진 전에도 가능성을 말해 행동을 시작하게 해요. "
            "맥박이 있는 동안은 코드팀이 아니라 담당 의사를 곁으로 부르고, here now로 지금 와야 한다는 급함을 분명히 해요."),
    'decoy': 'an allergic reaction',
    'distractorsKo': ['공기색전으로 보여요, 의사 선생님을 부르려고 전화기를 집을게요.',
                      '공기색전으로 보여요, 풀린 뚜껑으로 공기가 들어가서예요.'],
    '_moved': {'w-team': ("I've got her airway protected while we wait for the team.",
                          '팀 올 때까지 기도는 제가 보호하고 있을게요.')},
}, ['en', 'ko', 'chunks', 'words'],
    "I'm calling the code team → I need the physician here now(맥박이 있으면 코드가 아님, 검토 A E절); −w-code −w-call(6.3 등에 남음) −w-team(19.3에 남음), +w-physician")
od = order_line(18, T, 3, "Because of all that, this looks like an air embolism — I'm calling the code team.", {
    'en': 'With all that, this looks like an air embolism — I need the physician here now.',
    'ko': '그 모든 걸 보면 공기색전으로 보여요, 지금 의사 선생님이 여기 와 주셔야 해요'})
assert od['why'].endswith('공기색전으로 판단해 코드팀을 불러요.')
od['why'] = od['why'].replace('공기색전으로 판단해 코드팀을 불러요.', '공기색전으로 판단해 의사를 곁으로 불러요.')

# 3. 흉관 파동·개통 확인 [9] 2 — 흉관 훑기 → 혈전·꺾임 점검
T = '흉관 파동·개통 확인'
o = "I'll milk the tubing gently and reassess."
OLD.append(o)
for w in ('w-milk', 'w-gently'):
    drop_word(w, '9.2 keyPhrase를 바꿔 어느 문장도 태그하지 않게 됨')
replace(doc, CH, 9, T, 2, o, {
    'en': "I'll check the tubing for clots and kinks and reassess.",
    'ko': '튜빙에 혈전이나 꺾인 곳이 있는지 살펴보고 다시 평가할게요.',
    'chunks': ["I'll check", 'the tubing', 'for clots and kinks', 'and reassess', '.'],
    'words': ['w-check', 'w-tubing', 'w-clot', 'w-kink', 'w-reassess'],
    'tag': '개통 점검',
    'icon': 'magnify',
    'why': ("check A for B 틀로 어디서 무엇을 찾는지 한 번에 말하고, and reassess로 점검한 뒤 수봉을 다시 본다는 순서를 붙여요. "
            "흉관을 훑거나 짜는 것은 흉강 음압을 크게 올릴 수 있어 처방이나 병원 지침이 있을 때만 해요."),
    'decoy': 'and reassesses',
    'distractorsKo': ['튜빙에 혈전이나 꺾인 곳이 있으면 수봉이 멈출 수 있어요.',
                      '튜빙에 꺾인 곳이 있으면 펴 주고 테이프로 고정할게요.'],
    'blank': blank('reassess', ['relabel', 'reschedule', 'reorder']),
}, ['en', 'ko', 'chunks', 'words'],
    "I'll milk the tubing gently → I'll check the tubing for clots and kinks(흉관 훑기는 지침·처방으로 제한, 검토 A E절); −w-milk −w-gently, +w-check +w-clot +w-kink")
od = order_line(9, T, 2, "To clear it, I'll milk the tubing gently and reassess.", {
    'en': "I'll check the tubing for both and reassess.",
    'icon': 'magnify',
    'ko': '튜빙에 둘 중 어느 쪽이 있는지 살펴보고 다시 평가할게요'})
assert '가능한 원인을 말한 뒤, 부드럽게 조작해 보고,' in od['why']
od['why'] = od['why'].replace('가능한 원인을 말한 뒤, 부드럽게 조작해 보고,', '가능한 원인을 말한 뒤, 튜빙에서 그 원인을 찾아보고,')

# 4. 중심정맥관 삽입 보조·준비 [0] 1 — 최대 멸균 차단 목록에 모자
T = '중심정맥관 삽입 보조·준비'
o = 'Full barrier precautions are ready — gown, gloves, mask, drape.'
OLD.append(o)
replace(doc, CH, 0, T, 1, o, {
    'en': 'Full barrier precautions are ready — cap, mask, gown, gloves, drape.',
    'ko': '최대 멸균 차단 다 준비됐어요, 모자, 마스크, 가운, 장갑, 방포까지요.',
    'chunks': ['Full barrier precautions', 'are ready', '— cap,', 'mask,', 'gown,', 'gloves,', 'drape', '.'],
    'why': ("품목을 대시 뒤에 나열하면 무엇이 갖춰졌는지 한눈에 확인돼요. "
            "최대 멸균 차단은 모자·마스크·멸균 가운·멸균 장갑·온몸을 덮는 큰 방포를 모두 갖춘 것이라 Full이라고 해요."),
    'distractorsKo': ['최대 멸균 차단 다 주문해 뒀어요, 모자, 마스크, 가운, 장갑, 방포까지요.',
                      '최대 멸균 차단 다 가져다 달라고 했어요, 모자, 마스크, 가운, 장갑, 방포까지요.'],
}, ['en', 'ko', 'chunks'],
    '최대 멸균 차단 목록에 모자(cap)가 빠짐 → cap, mask, gown, gloves, drape(검토 A E절, slider 0 why와 맞춤) — words 그대로(w-cap은 뚜껑 뜻이라 태그하지 않음)')

# keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-invasive-lines-A.md E절 보고(9.2는 위에서 새 문장으로)
recut(14, '장치 제거 후 지혈·관찰', 0, "I'll hold firm pressure for at least five minutes.",
      ["I'll hold", 'firm pressure', 'for', 'at least five minutes', '.'], {'decoy': "I'll holds"})
recut(17, '흉관 우발적 제거 개방기흉 위기', 1, 'Watch for a tension pneumothorax as I seal it.',
      ['Watch', 'for', 'a tension pneumothorax', 'as I seal it', '.'], {'decoy': 'any bleeding'})
recut(18, '라인 개방 공기색전 위기', 0, 'Place him in left lateral Trendelenburg position now.',
      ['Place him', 'in left lateral Trendelenburg position', 'now', '.'])
recut(19, 'PA 카테터 폐동맥 파열 위기', 0, "Hemoptysis after wedging — I'm worried about pulmonary artery rupture.",
      ['Hemoptysis', 'after wedging', "— I'm worried", 'about pulmonary artery rupture', '.'], {'decoy': 'after suctioning'})

check(doc, OLD)
# 새 why 셋은 옛 관행을 '하지 않는다'고 일부러 짚으므로 빼고 본다
NEW_WHY = {sit(doc, 20, '라인 관련 대량출혈·혈종 위기')['sentences'][1]['why'],
           sit(doc, 18, '라인 개방 공기색전 위기')['sentences'][2]['why'],
           sit(doc, 9, '흉관 파동·개통 확인')['sentences'][2]['why']}
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for w in NEW_WHY:
    raw = raw.replace(w, '')
for bad in ('신속대응', '코드팀', '훑', 'milk', 'rapid response', 'code team', 'gown, gloves, mask'):
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'icu-invasive-lines.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-invasive-lines.yaml'), CH)
print('icu-invasive-lines.yaml 저장')
