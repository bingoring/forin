#!/usr/bin/env python3
"""er-alcohol-withdrawal v44 필드 수정 (결정 11 예외, 2026-10-08). base-er-alcohol-withdrawal.yaml 을 제자리에서 고친다."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib_v44fix_s55 import Fixer

F = Fixer('er-alcohol-withdrawal')
KP = ' (keyPhrase 문장이라 상황 keyPhrases도 바꿈)'

# ── 2.3 ko: en은 even when you feel fine(본인이 느끼기에)
F.set_sentence('CIWA 척도 설명', 3, 'I check on you often, even when you feel fine.', "ko '괜찮아 보여도'가 en(본인이 느끼기에 괜찮아도)과 어긋남",
               ko='괜찮다고 느끼셔도 자주 확인하러 와요.')

# ── 4.0 졸린 만취 환자의 흡인 예방은 옆으로 눕히기(회복 자세) [처방 없음 — 직접 고친 문장] (keyPhrase)
T = '만취 관찰 환자'
F.set_sentence(T, 0, "I'm going to keep the head of your bed up to protect your breathing.",
               '졸린 만취 환자의 흡인 예방은 보통 옆으로 눕히기(회복 자세)인데 침대 머리 올리기만 가르침 — 옆으로 눕히는 말로' + KP,
               en="I'm going to keep you on your side to protect your breathing.",
               ko='숨쉬는 걸 지켜드리려고 옆으로 누워 계시게 할게요.',
               chunks=["I'm going to keep", 'you on your side', 'to protect', 'your breathing', '.'],
               words=['w-keep', 'w-protect', 'w-breathe'],
               why='하는 일과 이유를 함께 말하면 환자가 몸을 맡겨요. 졸리고 토할 수 있는 취한 환자는 옆으로 눕혀(회복 자세) 두면 토한 것이 기도로 들어갈 위험을 줄일 수 있어요.',
               decoy='for your privacy')
F.word_set('w-keep', '예문의 침대 머리 올리기를 옆으로 눕히기로 맞춤', example="I'm going to keep you on your side.", exKo='옆으로 누워 계시게 할게요.')
F.W['w-keep']['cue'] = '어떤 상태를 계속 그대로 두는 동사 — 옆으로 누운 채, 난간을 올린 채'
F.word_set('w-bed', '예문의 침대 머리 올리기를 옆으로 눕히기로 바꾼 데 맞춰 침대에 머무르게 하는 예문으로', example="Please stay in bed — I don't want you to fall.", exKo='침대에 계셔주세요 — 넘어지실까 봐 그래요.')
for x in F.sits[T]['sentences']:
    x['distractorsKo'] = ['옆으로 눕혀 드릴게요' if v in ('침대 머리를 올릴게요', '침대 머리를 올려 둘게요') else v for v in x['distractorsKo']]
od = F.sits[T]['order']
assert od['why'].startswith('침대 머리를 올리는 이유를')
od['why'] = od['why'].replace('침대 머리를 올리는 이유를', '옆으로 눕혀 두는 이유를', 1)
L = od['lines']
L[0].update({'en': "I'm going to keep you on your side to protect your breathing.", 'ko': '숨쉬기를 지키려고 옆으로 눕혀 둘게요'})
assert L[1]['en'].startswith('With your head up like that')
L[1].update({'en': "With you on your side like that, please stay in bed — I don't want you to fall.", 'ko': '그렇게 옆으로 누운 채 침대에 계셔 주세요 — 넘어지시면 안 돼요'})
F.key_phrases(T, {"I'm going to keep the head of your bed up to protect your breathing.": "I'm going to keep you on your side to protect your breathing."})

# ── 16.0, 16.3 팀에 벤조 투약을 지시하는 말 — 의사 오더·프로토콜 전제를 문장에 명시 [처방 없음 — 직접 고친 문장]
T = '불응성 금단 발작 중첩'
F.set_sentence(T, 0, "He's in status — give another dose of benzodiazepine now.",
               '간호사가 팀에 벤조 투약을 지시하는 말인데 오더·프로토콜 복창이라는 전제가 문장·장면에 없음 — per protocol을 명시' + KP,
               en="He's in status — give another dose of benzodiazepine per protocol.",
               ko='발작이 지속되고 있어요 — 프로토콜에 따라 벤조디아제핀을 한 번 더 투여하세요.',
               chunks=["He's in status", '— give another dose', 'of benzodiazepine', 'per protocol', '.'],
               why='상태를 짧게 말한 뒤 곧바로 지시를 이어요. 투약은 간호사 판단이 아니라 의사 오더·표준 프로토콜에 따르므로 per protocol을 붙여 근거를 밝혀요.')
ctx = F.nu(T, 'context')
assert ctx['scenes'][0]['en'] == "He's in status — give another dose of benzodiazepine now."
ctx['scenes'][0]['en'] = "He's in status — give another dose of benzodiazepine per protocol."
L = F.sits[T]['order']['lines']
assert L[0]['en'] == "He's in status — give another dose of benzodiazepine now."
L[0].update({'en': "He's in status — give another dose of benzodiazepine per protocol.", 'ko': '발작이 지속되고 있어요 — 프로토콜에 따라 벤조디아제핀을 한 번 더 투여하세요'})
F.set_sentence(T, 3, 'This is his third seizure — give the next benzodiazepine dose now.',
               '간호사가 팀에 벤조 투약을 지시하는 말인데 의사 오더 전제가 없음 — as ordered를 명시',
               en='This is his third seizure — give the next benzodiazepine dose as ordered.',
               ko='이번이 세 번째 발작이에요 — 오더대로 벤조디아제핀 다음 용량을 투여하세요.',
               chunks=['This is his third seizure', '— give the next', 'benzodiazepine dose', 'as ordered', '.'],
               why='third로 횟수를 말해 발작이 반복된다는 근거를 줘요. 횟수와 간격은 팀이 다음 용량을 정할 때 필요한 정보이고, as ordered로 의사 오더에 따른 투약임을 밝혀요.')
F.key_phrases(T, {"He's in status — give another dose of benzodiazepine now.": "He's in status — give another dose of benzodiazepine per protocol."})
F.save()
