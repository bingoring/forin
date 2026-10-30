"""icu-transport-procedure — keyPhrase 2문장 교체 + keyPhrase chunks 18문장 다시 자르기(2026-10-29 묶음 7 결정 '추천대로').
base-icu-transport-procedure.yaml → icu-transport-procedure.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-transport-procedure.yaml'))
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


# 6. MRI 중 응급상황 대응 [19] 문장 2 — 자석 구역을 벗어난 뒤 압박 → 지금 시작해 옮기는 동안 계속
T = 'MRI 중 응급상황 대응'
o = 'Start compressions the moment we clear the magnet.'
OLD.append(o)
drop_word('w-moment', '19.2 문장을 바꿔 어느 문장도 태그하지 않게 됨')
replace(doc, CH, 19, T, 2, o, {
    'en': 'Start compressions now and keep going as we move her out.',
    'ko': '지금 흉부압박을 시작하고, 밖으로 옮기는 동안에도 계속해요.',
    'chunks': ['Start compressions', 'now', 'and keep going', 'as we move her out', '.'],
    'words': ['w-start', 'w-compression', 'w-move'],
    'tag': '즉시 압박',
    'why': ("now로 압박을 미루지 않고, keep going as we move her out으로 옮기는 동안에도 멈추지 않는다는 걸 분명히 해요. "
            "코드 카트·제세동기처럼 금속 장비가 필요한 소생은 자석 방 밖에서 이어 가요."),
    'decoy': 'and keeps going',
    'distractorsKo': ['흉부압박은 금속 장비 없이 손으로 하니 스캐너 옆에서도 할 수 있어요.',
                      '검사실을 벗어나면 코드 카트와 제세동기가 다가와요.'],
    'blank': blank('move', ['check', 'sign', 'log']),
}, ['en', 'ko', 'chunks', 'words'],
    '자석 구역을 벗어나는 순간 압박 → 지금 압박을 시작해 옮기는 동안 계속(ACR MR 안전 — 압박을 미루지 않음); −w-moment(word-remove) −w-clear −w-magnet 태그(둘 다 다른 문장에 남음)')
od = sit(doc, 19, T)['order']
assert [l['en'] for l in od['lines']] == [
    'We lost her pulse right as the scan started.',
    'Without a pulse, we move her out of the magnet room to resuscitate.',
    "Since she's out of the magnet room, evacuate her to the safe zone.",
    "Once she's in the safe zone, start compressions at once."]
od['lines'] = [
    {'en': 'We lost her pulse right as the scan started.', 'icon': 'faceWorried',
     'ko': '검사가 시작되자마자 맥박이 사라졌어요', 'note': '발생'},
    {'en': 'No pulse, so start compressions now and keep going as we move her out.', 'icon': 'siren',
     'ko': '맥박이 없으니 지금 흉부압박을 시작하고, 밖으로 옮기는 동안에도 계속해요', 'note': '압박'},
    {'en': "Once she's out of the magnet room, evacuate her to the safe zone.", 'icon': 'compass',
     'ko': '자석 방을 벗어나면 안전 구역으로 대피시켜요', 'note': '대피'},
    {'en': "Once she's in the safe zone, the code cart and defibrillator come to her.", 'icon': 'monitor',
     'ko': '안전 구역에 들어서면 코드 카트와 제세동기를 환자 곁으로 가져와요', 'note': '장비'},
]
for ln in od['lines']:
    assert len(ln['en'].split()) <= 15, ln['en']
od['why'] = ('맥박이 사라지면 곧바로 압박을 시작해 옮기는 동안에도 이어 가고, 자석 방을 벗어나면 안전 구역으로 대피시킨 뒤, '
             '그곳에서 코드 카트와 제세동기를 써요.')
sl = sit(doc, 19, T)['nuance'][0]
assert sl['kind'] == 'slider' and '먼저 옮기고 거기서 소생을 이어가요' in sl['why']
sl['why'] = ('MRI 구역은 Zone I부터 IV까지 있고, 자석이 있는 방이 Zone IV예요. 응급이면 압박을 바로 시작해 이어 가면서 '
             '환자를 Zone IV 밖으로 옮기고, 코드 카트와 제세동기는 밖에서 써요. 코드 카트는 자석 방에 들이지 않아요.')
assert sl['example'] == 'The magnet room is Zone IV, so we move her out first.'
sl['example'] = 'The magnet room is Zone IV, so we keep compressing as we move her out.'
sl['exKo'] = '자석 방은 Zone IV라서 압박을 이어 가며 환자를 밖으로 옮겨요.'

# 7. 시술 중 대량출혈 급변 [18] 문장 0 — 수액을 활짝 → 혈액을 바로 걸기
T = '시술 중 대량출혈 급변'
o = 'Bleeding is brisk — apply pressure and open fluids wide.'
OLD.append(o)
for wid in ('w-open', 'w-fluid', 'w-wide'):
    drop_word(wid, '18.0 문장을 바꿔 어느 문장도 태그하지 않게 됨')
replace(doc, CH, 18, T, 0, o, {
    'en': 'Bleeding is brisk — apply pressure and get blood hanging.',
    'ko': '출혈이 급격해요 — 압박하고 혈액을 바로 걸어요.',
    'chunks': ['Bleeding', 'is brisk', '— apply pressure', 'and get blood hanging', '.'],
    'words': ['w-bleed', 'w-brisk', 'w-apply', 'w-pressure', 'w-blood'],
    'why': ("대시 앞에서 상황을 한마디로 말하고 뒤에서 두 가지 행동을 and로 이어요. 대량 출혈에는 수액보다 혈액이 먼저라 "
            "get blood hanging으로 혈액을 바로 걸게 해요(시술자 지시·프로토콜에 따라)."),
    'decoy': '— applies pressure',
    'blank': blank('brisk', ['minor', 'slight', 'mild']),
}, ['en', 'ko', 'chunks', 'words'],
    'open fluids wide → get blood hanging(대량 출혈은 혈액 우선, 수액 최대 개방은 처방 전제 없음); −w-open −w-fluid −w-wide(word-remove) +w-blood')
od = sit(doc, 18, T)['order']
l = od['lines'][0]
assert l['en'] == o
l['en'] = 'Bleeding is brisk — apply pressure and get blood hanging.'
l['ko'] = '출혈이 급격해요 — 압박하고 혈액을 바로 걸어요'
l = od['lines'][2]
assert l['en'] == 'With the protocol on, get me two units of blood to the bedside stat.'
l['en'] = 'With the protocol on, get me two more units to the bedside stat.'
l['ko'] = '프로토콜을 켰으니 혈액 2유닛을 더 즉시 침상 곁으로 가져다주세요'
assert od['why'].startswith('압박하고 수액을 열며 시작하고,')
od['why'] = '압박하고 혈액을 걸며 시작하고, 압박을 유지한 채 대량수혈과 외과를 부르고, 혈액을 더 요청한 뒤, 도착을 알려요.'
for ln in od['lines']:
    assert len(ln['en'].split()) <= 15, ln['en']

# keyPhrase chunks 다시 자르기 (en 그대로) — fix-icu-transport-procedure-A.md 19개 목록(18.0은 위 7번에서 함께)
recut(0, '원내 이송 전 안정성 평가', 0, 'His vitals are stable enough for transport right now.',
      ['His vitals', 'are stable enough', 'for transport', 'right now', '.'])
recut(1, '이송 장비·산소·약물 준비', 2, 'Emergency meds and a bag-valve mask are in the bag.',
      ['Emergency meds', 'and a bag-valve mask', 'are', 'in the bag', '.'], {'decoy': 'in the side pocket'})
recut(2, '이송 중 모니터·라인 관리', 2, 'The oxygen tubing is clear of the wheels.',
      ['The oxygen tubing', 'is', 'clear of the wheels', '.'], {'decoy': 'clear of the sheet'})
recut(6, '인공호흡 환자 이송 관리', 0, "I've matched the transport vent settings to his current ones.",
      ["I've matched", 'the transport vent settings', 'to', 'his current ones', '.'])
recut(9, '진정 역전제 준비', 0, 'Naloxone is drawn up for opioid reversal.',
      ['Naloxone', 'is drawn up', 'for opioid reversal', '.'], {'decoy': 'are drawn up'})
recut(9, '진정 역전제 준비', 1, 'Flumazenil is ready for benzodiazepine oversedation.',
      ['Flumazenil', 'is ready', 'for benzodiazepine oversedation', '.'], {'decoy': 'are ready'})
recut(10, '이송 중 악화 대비 계획', 1, 'I know where the nearest code cart and phone are on the route.',
      ['I know', 'where', 'the nearest code cart and phone', 'are on the route', '.'], {'decoy': 'is on the route'})
recut(12, '병원간 이송 인계·문서', 0, "I'll give an SBAR handoff to the transport team.",
      ["I'll give", 'an SBAR handoff', 'to', 'the transport team', '.'], {'decoy': "I'll gives"})
recut(14, '이송 위험-이익 판단 소통', 0, "The scan could change management, but she's borderline stable.",
      ['The scan could', 'change management', ', but', "she's borderline stable", '.'])
recut(15, '이송 중 심정지 대응', 0, 'Stop the bed — no pulse, starting compressions now.',
      ['Stop the bed', '— no pulse', ', starting compressions', 'now', '.'])
recut(15, '이송 중 심정지 대응', 1, 'Call a code and get the nearest crash cart.',
      ['Call', 'a code', 'and get', 'the nearest crash cart', '.'], {'decoy': 'and gets'})
recut(15, '이송 중 심정지 대응', 2, "I'm bagging him while you push the code meds.",
      ["I'm bagging him", 'while', 'you push', 'the code meds', '.'], {'decoy': 'you pushes'})
recut(16, '이송 중 발관·라인 이탈 위기', 2, 'Hold pressure on the dislodged line.',
      ['Hold pressure', 'on', 'the dislodged line', '.'], {'decoy': 'Holds pressure'})
recut(17, '시술 진정 중 호흡정지 위기', 0, "She's apneic — I'm bagging her with a good seal.",
      ["She's apneic", "— I'm bagging her", 'with', 'a good seal', '.'], {'decoy': 'a good view'})
recut(17, '시술 진정 중 호흡정지 위기', 2, "Prepare to intubate if she doesn't recover.",
      ['Prepare', 'to intubate', "if she doesn't recover", '.'], {'decoy': 'to intubating'})
recut(18, '시술 중 대량출혈 급변', 2, "We're converting this to an emergency procedure.",
      ["We're converting", 'this', 'to an emergency procedure', '.'], {'decoy': 'to a teaching procedure'})
recut(20, '이송 중 산소·전원 소진 위기', 0, 'The tank is almost empty — switch to the backup cylinder now.',
      ['The tank', 'is almost empty', '— switch to', 'the backup cylinder', 'now', '.'])
recut(20, '이송 중 산소·전원 소진 위기', 2, 'Find the nearest wall oxygen and power source.',
      ['Find', 'the nearest wall oxygen', 'and power source', '.'])

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-transport-procedure.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-transport-procedure.yaml'), CH)
print('icu-transport-procedure.yaml 저장')
