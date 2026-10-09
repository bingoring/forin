#!/usr/bin/env python3
"""core-safety-er v44 필드 수정 (결정 11 예외, 2026-10-08). base-core-safety-er.yaml 을 제자리에서 고친다."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib_v44fix_s55 import Fixer

F = Fixer('core-safety-er')

# ── 14.0 (base S13.0) date of birth in 1962 는 비문 (keyPhrase) — 생년월일 전체로
F.set_sentence('오환자 시술 방지', 0, 'Time-out: this is John Reyes, date of birth in 1962.',
               "'date of birth in 1962'는 비문 — 생년월일 전체로 (keyPhrase 문장이라 상황 keyPhrases도 바꿈)",
               en='Time-out: this is John Reyes, date of birth March 3, 1962.',
               ko='타임아웃, 이분은 존 레예스, 생년월일은 1962년 3월 3일이에요.',
               chunks=['Time-out:', 'this is John Reyes,', 'date of birth', 'March 3, 1962', '.'])
F.key_phrases('오환자 시술 방지', {'Time-out: this is John Reyes, date of birth in 1962.': 'Time-out: this is John Reyes, date of birth March 3, 1962.'})

# ── 9.4 (base S8.4) 침상 번호는 식별자가 아님
F.set_sentence('검체 라벨 오류 방지', 4, 'Always check the bed number before you label the tube.',
               '침상 번호는 환자 식별자가 아님 — 손목밴드를 확인하는 습관으로',
               en='Always check the wristband before you label the tube.',
               ko='튜브에 라벨을 붙이기 전에 항상 손목밴드를 확인해요.',
               chunks=['Always check', 'the wristband', 'before you label', 'the tube', '.'],
               words=['w-check', 'w-wristband', 'w-label', 'w-tube'],
               why='Always로 예외 없는 규칙임을 말해요. before you label은 라벨을 붙이기 전이라는 순서를 정해요. 환자 확인은 손목밴드의 이름과 생년월일로 하고, 병실·침상 번호는 식별자가 아니에요.',
               distractorsKo=['라벨을 붙인 뒤 손목밴드를 확인해요', '튜브는 늘 같은 방향으로 놓아요'])

# ── 11.3 (base S10.3) 낙상 위험만으로는 억제대 근거가 안 됨(CMS)
F.set_sentence('억제대 사용 안전', 3, 'Restraints are only used when he might pull out his IV line or fall.',
               '낙상 위험만으로는 억제대 사용 근거가 안 됨(CMS) — 치료 기구를 빼낼 위험으로',
               en='Restraints are only used when he might pull out his IV line or breathing tube.',
               ko='억제대는 정맥 주사줄이나 기관 튜브를 잡아당길 위험이 있을 때만 사용해요.',
               chunks=['Restraints are only used', 'when he might pull out', 'his IV line', 'or breathing tube', '.'],
               words=['w-restraint', 'w-pull', 'w-iv_line'],
               why='only used when …은 사용 조건을 좁게 한정해요. 억제대는 다른 방법으로 안전을 지킬 수 없을 때 쓰는 마지막 수단이고, 낙상 위험만으로는 쓰지 않아요.')

# ── 3.4 (base S2.4) 난간 전부 상시 올림은 억제대로 간주될 수 있음 [처방 없음 — 직접 고친 문장]
F.set_sentence('침상 안전 설정', 4, "The rails will stay up whenever I'm not right beside you.",
               '난간 전부를 상시 올려 두면 억제대로 간주될 수 있어 위쪽 난간만으로 한정',
               en="The top rails will stay up whenever I'm not right beside you.",
               ko='제가 바로 옆에 없을 때는 위쪽 난간을 올려 둘게요.',
               chunks=['The top rails will stay up', "whenever I'm", 'not right', 'beside you', '.'],
               why='whenever로 난간을 올려 두는 시점을 분명히 말해요. 올리는 것은 위쪽 난간이고, 난간 전부를 늘 올려 두면 억제대로 간주될 수 있어요.')

# ── 19.4 (base S18.4) 침대는 carry가 아니라 밀어 옮김
F.set_sentence('화재·대피 안전', 4, 'Two of us will carry the intubated patient on the bed together.',
               '침대는 carry가 아니라 밀어 옮김 — move … on the bed로',
               en='Two of us will move the intubated patient on the bed together.',
               chunks=['Two of us', 'will move', 'the intubated patient', 'on the bed together', '.'],
               why='move … on the bed together는 침대째 함께 옮긴다는 말이에요. 삽관 환자는 튜브와 장비가 붙어 있어서 여러 명이 맞춰 움직여야 해요.',
               blank={'answer': 'move', 'options': [{'en': 'leave'}, {'en': 'wake'}, {'en': 'move'}, {'en': 'bathe'}]})

# ── chunks 경계 (en 그대로)
F.set_sentence('침상 안전 설정', 6, 'Setting up your bed and call button correctly helps prevent falls.', 'correctly helps prevent로 구를 끊음 — 청크 경계만 고침',
               chunks=['Setting up', 'your bed and call button', 'correctly', 'helps prevent falls', '.'])
F.set_sentence('신원 불명 환자 등록', 1, 'Put the temporary band on and label all samples with it.', 'on and label로 구를 끊음 — 청크 경계만 고침',
               chunks=['Put the temporary band on', 'and label', 'all samples', 'with it', '.'])
F.set_sentence('급변 환자 조기 경고', 0, 'Her heart rate is up and pressure is dropping.', 'is up and / pressure is로 구를 끊음 — 청크 경계만 고침',
               chunks=['Her heart rate', 'is up', 'and pressure', 'is dropping', '.'])
F.set_sentence('투약 위해사건 대응', 0, 'The patient got double the ordered dose.', 'double the ordered / dose로 구를 끊음 — 청크 경계만 고침',
               chunks=['The patient got', 'double', 'the ordered dose', '.'])
F.save()
