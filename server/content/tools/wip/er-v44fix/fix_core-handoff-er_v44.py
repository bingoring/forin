#!/usr/bin/env python3
"""core-handoff-er v44 필드 수정 (결정 11 예외, 2026-10-08). base-core-handoff-er.yaml 을 제자리에서 고친다."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib_v44fix_s55 import Fixer

F = Fixer('core-handoff-er')
T = '환자 정보 재확인'

# ── 4.4 (base 3.4) 병상 번호를 확인 항목으로 보이지 않게
F.set_sentence(T, 4, 'Her diagnosis and bed number both match the chart.',
               '병상 번호를 확인 항목으로 보여 줌(NPSG.01.01.01은 이름·생년월일) — 이름과 생년월일로 바로잡음',
               en='Her name and date of birth both match the chart.',
               ko='이름과 생년월일 모두 차트와 일치합니다.',
               chunks=['Her name', 'and date of birth', 'both match', 'the chart', '.'],
               words=['w-match', 'w-chart'],
               why='both match는 두 항목이 모두 일치한다고 한 번에 보고해요. 이름과 생년월일은 환자 식별에 쓰는 두 식별자라 이 둘을 대조해요(병상 번호는 위치 확인용).',
               distractorsKo=['이름과 생년월일이 모두 다릅니다', '이름만 차트와 일치합니다'])

# ── 4.2 (base 3.2) name band → ID band (keyPhrase)
S32 = '(keyPhrase 문장이라 상황 keyPhrases도 바꿈)'
F.set_sentence(T, 2, 'Can you read the name band back to me?',
               '미국 병원은 name band보다 ID band·wristband를 더 흔히 씀 ' + S32,
               en='Can you read the ID band back to me?',
               ko='ID 밴드를 저에게 다시 읽어 주시겠어요?',
               chunks=['Can you', 'read', 'the ID band', 'back to me', '?'],
               distractorsKo=['ID 밴드를 새로 채워 주시겠어요?', 'ID 밴드를 저에게 건네 주시겠어요?'],
               blank={'answer': 'ID', 'options': [{'en': 'alert'}, {'en': 'ID'}, {'en': 'allergy'}, {'en': 'blood'}]})
# w-band: 예문 'Read the name band back to me.' 는 이 문장이 아니라 단어 은행의 짧은 예문이다 — 같이 ID band 로
assert F.W['w-band']['example'] == 'Read the name band back to me.'
F.word_set('w-band', 'name band를 ID band로 바꿔 예문·exKo도 맞춤', example='Read the ID band back to me.', exKo='ID 밴드를 다시 읽어 주세요.')
F.W['w-band']['cue'] = "환자 손목에 찬 신원 확인 밴드 — 'ID ___'"
pr = F.nu(T, 'pair')
assert pr['pairs'][0] == ['read the name band', 'back to me']
pr['pairs'][0] = ['read the ID band', 'back to me']
od = F.sits[T]['order']
assert od['lines'][1]['en'] == 'Yes. Can you read his name band back to me?'
od['lines'][1].update({'en': 'Yes. Can you read his ID band back to me?', 'ko': '네. ID 밴드를 읽어 주시겠어요?'})
od['why'] = od['why'].replace('이름 밴드를 읽게', 'ID 밴드를 읽게')
assert 'ID 밴드' in od['why']

F.key_phrases(T, {'Can you read the name band back to me?': 'Can you read the ID band back to me?'})
F.save()
