#!/usr/bin/env python3
"""er-abdominal v44 필드 수정 (결정 11 예외, 2026-10-08). base-er-abdominal.yaml 을 제자리에서 고친다."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib_v44fix_s55 import Fixer

F = Fixer('er-abdominal')
KP = ' (keyPhrase 문장이라 상황 keyPhrases도 바꿈)'

# ── 16.0 ko 번역투
T = '장간막 허혈'
F.set_sentence(T, 0, 'Your pain is much worse than what we feel on exam — that concerns us.', '"그게 저희를 걱정시켜요"는 번역투 — "그래서 걱정이 돼요"',
               ko='진찰에서 느끼는 것보다 통증이 훨씬 심해요, 그래서 걱정이 돼요.')
L = F.sits[T]['order']['lines']
assert L[0]['ko'].endswith('그게 저희를 걱정시켜요')
L[0]['ko'] = '진찰에서 느끼는 것보다 통증이 훨씬 심해요, 그래서 걱정이 돼요'

# ── 15.0 환자에게 in quality는 의료진 말투 (keyPhrase)
T = '대동맥류 파열(찢는 통증)'
F.word_remove('w-quality', 'in quality가 문장에서 빠져 은행에서 뺌')
F.set_sentence(T, 0, 'Is the pain tearing or ripping in quality?', "환자에게 하는 문장인데 'in quality'는 의료진 말투 — 쉬운 말로" + KP,
               en='Does the pain feel tearing or ripping?',
               ko='통증이 찢어지거나 뜯기는 느낌인가요?',
               chunks=['Does the pain', 'feel tearing', 'or ripping', '?'],
               words=['w-pain', 'w-tear', 'w-rip'])
o = F.sits[T]['order']['lines']
assert o[0]['en'] == 'Is the pain tearing or ripping in quality?'
o[0].update({'en': 'Does the pain feel tearing or ripping?', 'ko': '통증이 찢어지거나 뜯기는 느낌인가요?'})
F.key_phrases(T, {'Is the pain tearing or ripping in quality?': 'Does the pain feel tearing or ripping?'})

# ── S17 천공성 궤양 (17.1 flat → 편한 자세로 가만히, 17.2 SBAR 환자에게 말하지 않기) [17.1·17.2는 처방 없음 — 직접 고친 문장]
T = '천공성 궤양(판자복부)'
F.word_remove('w-flat', 'flat이 문장에서 빠져 은행에서 뺌(복막염 환자는 무릎을 굽힌 자세를 편해하는 경우가 많음)')
F.word_add({
    'id': 'w-comfortable', 'en': 'comfortable', 'ipa': '/ˈkʌmftəbəl/', 'ko': '편안한', 'icon': 'home',
    'example': "We're going to keep you still and comfortable to reduce the pain.",
    'exKo': '통증을 줄이기 위해 편한 자세로 가만히 계시게 할게요.',
    'cue': '배가 아픈 환자가 덜 아픈 자세로 있게 해 줄 때',
    'tag': '처치', 'distractorsEn': ['comfort', 'capable'], 'distractorsKo': ['불편한', '뜨거운'],
    'chips': [['com', 'fort', 'able']], 'decoyChips': ['cap', 'ible']}, "flat을 대신해 편한 자세로 가만히 있게 한다는 새 문장의 핵심 낱말")
F.word_remove('w-sbar', '환자에게 보고 틀 이름(SBAR)을 말하는 문장을 고쳐 은행에서 뺌')
F.word_remove('w-report', '환자에게 보고 틀 이름(SBAR)을 말하는 문장을 고쳐 은행에서 뺌')
F.set_sentence(T, 1, "We're going to keep you flat and still to reduce the pain.",
               '복막염 환자는 무릎을 굽힌 자세를 편해하는 경우가 많아 flat이 맞지 않음(still이 핵심) — 편한 자세로 가만히' + KP,
               en="We're going to keep you still and comfortable to reduce the pain.",
               ko='통증을 줄이기 위해 편한 자세로 가만히 계시게 할게요.',
               chunks=["We're going", 'to keep you', 'still and comfortable', 'to reduce the pain', '.'],
               words=['w-keep', 'w-still', 'w-comfortable', 'w-reduce', 'w-pain'],
               why='to reduce the pain으로 가만히 있는 이유를 붙여요. 움직이면 복막이 자극되어 더 아프니 가만히 있게 하되, 무릎을 굽히는 등 환자가 편한 자세를 쓰게 해요.',
               blank={'answer': 'comfortable', 'options': [{'en': 'comfortable'}, {'en': 'awake'}, {'en': 'warm'}, {'en': 'thirsty'}]})
# nuance pair (SBAR) 교체
pr = F.nu(T, 'pair')
assert pr['words'] == ['w-sbar', 'w-report']
pr['words'] = ['w-call', 'w-surgeon']
pr['pairs'] = [['call', 'the surgeon'], ['come', 'see you']]
pr['decoys'] = ['to the surgeon']
pr['why'] = "call은 전치사 없이 the surgeon을 바로 받아요. 'come see you'는 와서 환자를 봐 달라는 뜻으로, 의사를 부를 때 목적을 함께 말해요."
F.set_sentence(T, 2, "I'm calling the surgeon now with an SBAR report.",
               '환자에게 보고 틀 이름(SBAR)을 말하는 것이 어색(why도 이 문장을 본보기로 삼음) — 외과를 부르는 일을 쉬운 말로' + KP,
               en="I'm calling the surgeon right now to come see you.",
               ko='지금 바로 외과 선생님이 와서 봐 주시도록 연락하고 있어요.',
               chunks=["I'm calling", 'the surgeon', 'right now', 'to come see you', '.'],
               words=['w-call', 'w-surgeon'],
               tag='외과 호출',
               why='calling the surgeon right now로 지금 누구를 부르는지 알려요. 환자 앞에서 누구를 왜 부르는지 말하면 방치되지 않는다고 느껴요. SBAR 같은 보고 틀 이름은 의료진끼리 쓰는 말이라 환자에게는 풀어서 말해요.',
               distractorsKo=['움직이지 말고 가만히 계세요', '열이 있는지 확인할게요'])
F.key_phrases(T, {"We're going to keep you flat and still to reduce the pain.": "We're going to keep you still and comfortable to reduce the pain.",
                  'I\'m calling the surgeon now with an SBAR report.': "I'm calling the surgeon right now to come see you."})
F.save()
