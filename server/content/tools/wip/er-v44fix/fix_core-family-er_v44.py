#!/usr/bin/env python3
"""core-family-er v44 필드 수정 (결정 11 예외, 2026-10-08). base-core-family-er.yaml 을 제자리에서 고친다."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib_v44fix_s55 import Fixer

F = Fixer('core-family-er')

# ── 3.4 ko: 말하는 상대는 가족
F.set_sentence('가족 질문 경청', 4, 'Every question you have matters to me.', '말하는 상대가 가족인데 환자분이 하시는 질문으로 옮겨 가족 대상으로 바로잡음',
               ko='하시는 모든 질문이 저에게는 중요해요.')
# ── 10.4, 14.2 ko: 소아 장면 아님
F.set_sentence('보호자 과잉 개입', 4, 'You can stand right here and talk softly to her.', '소아 장면이 아닌데 아이에게로 옮김 — 10.0과 같이 환자분께',
               ko='바로 여기 서서 환자분께 부드럽게 말씀해 주셔도 돼요.')
F.set_sentence('소생 중 가족 입회', 2, 'Stand here with me — you can talk to her.', '소아 장면이 아닌데 아이에게로 옮김 — 환자분께',
               ko='제 옆에 서 계세요, 환자분께 말을 걸어주셔도 돼요.')

# ── 10.3 let me guide how → let me show you how
F.word_remove('w-guide', 'guide how가 부자연스러워 문장이 show you how로 바뀌어 단어 은행에서 뺌')
F.word_add({
    'id': 'w-show', 'en': 'show', 'ipa': '/ʃoʊ/', 'ko': '보여 주다', 'icon': 'compass',
    'example': 'I know you want to help — let me show you how.',
    'exKo': '도와주고 싶으신 마음 알아요, 어떻게 하면 될지 보여 드릴게요.',
    'cue': '돕고 싶어 하는 보호자에게 할 일을 직접 해 보이며 알려 줄 때',
    'tag': '처치 동행', 'distractorsEn': ['shoe', 'snow'], 'distractorsKo': ['막다', '지켜보다'],
    'chips': [['show']], 'decoyChips': ['shoe']}, 'let me guide how를 let me show you how로 고치며 새 문장의 핵심 동사 show 추가')
F.set_sentence('보호자 과잉 개입', 3, 'I know you want to help — let me guide how.', "'let me guide how'는 부자연스러운 영어 — let me show you how",
               en='I know you want to help — let me show you how.',
               ko='도와주고 싶으신 마음 알아요, 어떻게 하면 될지 보여 드릴게요.',
               chunks=['I know you want', 'to help', '— let me', 'show you how', '.'],
               words=['w-know', 'w-want', 'w-help', 'w-show'],
               why='I know you want to …로 상대의 마음을 인정하고 let me show you how로 그 마음이 갈 곳을 직접 보여 줘요. 막는 말 대신 방법을 주면 보호자가 쓸모없다고 느끼지 않아요.')
sw = F.nu('보호자 과잉 개입', 'swap')
assert sw['answer'] == 'let me guide how'
sw['words'] = ['w-show', 'w-help', 'w-want']
sw['options'] = ['let me show you how', "you're in the way", 'please stop touching her']
sw['answer'] = 'let me show you how'
sw['notes'] = {'let me show you how': '돕고 싶은 마음을 인정하고 할 수 있는 역할을 직접 보여 줘요.',
               "you're in the way": sw['notes']["you're in the way"], 'please stop touching her': sw['notes']['please stop touching her']}
sw['ko'] = '도와주고 싶으신 마음 알아요, 어떻게 하면 될지 보여 드릴게요'

# ── 18.3 every right to it → to feel that way
F.set_sentence('가족 분노·비난 대응', 3, 'I hear your anger — you have every right to it.', "'every right to it'는 덜 자연스러움 — every right to feel that way",
               en='I hear your anger — you have every right to feel that way.',
               chunks=['I hear your anger', '— you have', 'every right', 'to feel that way', '.'])
o = F.sits['가족 분노·비난 대응']['order']['lines']
assert o[0]['en'] == 'I hear your anger — you have every right to it.'
o[0]['en'] = 'I hear your anger — you have every right to feel that way.'

# ── S17 장기기증 대화 연계 (처방 없음 — 직접 고친 문장)
T = '장기기증 대화 연계'
for wid in ['w-entirely', 'w-sensitive', 'w-option', 'w-mention', 'w-gently']:
    F.word_remove(wid, '기증 흐름 재작성(병상 간호사는 기증을 청하지 않고 OPO 담당자에게 연결)으로 문장에서 빠져 은행에서 뺌')
F.word_add({
    'id': 'w-connect', 'en': 'connect', 'ipa': '/kəˈnɛkt/', 'ko': '연결하다', 'icon': 'handshake2',
    'example': "There's no pressure — I'm only connecting you with the donation team.",
    'exKo': '압박은 전혀 없어요, 저는 기증 담당 팀과 연결해 드릴 뿐이에요.',
    'cue': '기증 이야기는 담당 팀에 이어 주는 것이 간호사의 역할이라고 밝힐 때',
    'tag': '임종·애도', 'distractorsEn': ['collect', 'correct'], 'distractorsKo': ['끊다', '모으다'],
    'chips': [['con', 'nect']], 'decoyChips': ['col', 'rect']}, '기증 흐름 재작성: 간호사는 연결만 한다는 말의 핵심 동사')
F.word_add({
    'id': 'w-register', 'en': 'register', 'ipa': '/ˈrɛdʒɪstər/', 'ko': '등록하다', 'icon': 'board',
    'example': 'The donation team will also check whether your loved one is a registered donor.',
    'exKo': '기증 담당 팀이 소중한 분이 기증자로 등록하셨는지도 확인할 거예요.',
    'cue': '기증 의사를 미리 공식 명단에 올려 두었는지를 말할 때',
    'tag': '임종·애도', 'distractorsEn': ['regret', 'recover'], 'distractorsKo': ['취소하다', '거절하다'],
    'chips': [['reg', 'ister']], 'decoyChips': ['ret', 'ion']}, '기증 흐름 재작성: 환자가 기증 등록자일 수 있다는 사실의 핵심 낱말')

WHY17 = '병상 간호사는 기증을 먼저 청하지 않고 OPO 담당자가 가족과 이야기하도록 연결하는 미국 관행에 맞춤(keyPhrase 문장이라 상황 keyPhrases도 바꿈)'
F.set_sentence(T, 1, "When you're ready, a specialist can talk about donation.", WHY17,
    en="When you're ready, a donation specialist will come to talk with you.",
    ko='준비되시면 기증 전문 담당자가 와서 이야기해 드릴 거예요.',
    chunks=["When you're ready", ', a donation specialist', 'will come', 'to talk with you', '.'],
    words=['w-ready', 'w-donation', 'w-specialist', 'w-come', 'w-talk'],
    tag='전문가 연결',
    why="When you're ready로 시작해 가족의 속도를 존중해요. a donation specialist will come은 기증 이야기를 하러 담당자가 온다는 알림이에요. 기증 요청은 OPO(장기구득기관) 담당자 몫이라 간호사가 먼저 청하지 않고 연결만 해요.",
    decoy='instead of me',
    distractorsKo=['의사 선생님이 지금 수술하세요', '보험 담당자가 설명해요'],
    blank={'answer': 'specialist', 'options': [{'en': 'salesperson'}, {'en': 'stranger'}, {'en': 'specialist'}, {'en': 'reporter'}]})
F.set_sentence(T, 2, "There's no pressure — it's entirely your family's choice.", WHY17 + ' — 환자가 기증 등록자일 수 있어 전적으로 가족의 선택이라고 단정하지 않음',
    en="There's no pressure — I'm only connecting you with the donation team.",
    ko='압박은 전혀 없어요, 저는 기증 담당 팀과 연결해 드릴 뿐이에요.',
    chunks=["There's no pressure", "— I'm only", 'connecting you', 'with the donation team', '.'],
    words=['w-pressure', 'w-connect', 'w-donation', 'w-team'],
    tag='압박 없음',
    why='no pressure로 압박이 없다고 먼저 말하고, I\'m only connecting you with …로 간호사의 역할이 연결뿐임을 밝혀요. 기증은 설득이 아니라 선택으로 전해야 하고, 요청과 설명은 훈련받은 OPO 담당자가 해요.',
    decoy='of mine',
    distractorsKo=['의사 선생님이 결정하실 거예요', '기증은 꼭 하셔야 해요'],
    blank={'answer': 'only', 'options': [{'en': 'only'}, {'en': 'never'}, {'en': 'rarely'}, {'en': 'barely'}]})
F.set_sentence(T, 3, "There's a sensitive option I'd like to gently mention.", WHY17 + ' — 환자 본인의 기증 등록 여부를 담당 팀이 확인한다는 사실로 대체',
    en='The donation team will also check whether your loved one is a registered donor.',
    ko='기증 담당 팀이 소중한 분이 기증자로 등록하셨는지도 확인할 거예요.',
    chunks=['The donation team', 'will also check', 'whether your loved one', 'is a registered donor', '.'],
    words=['w-donation', 'w-team', 'w-check', 'w-register'],
    tag='등록 확인', icon='magnify',
    why='also check whether …로 환자 본인이 기증 등록을 해 두었는지 담당 팀이 확인한다고 알려요. 등록자라면 본인의 뜻이 우선이라, 간호사가 가족의 선택이라고 단정하지 않아요.',
    decoy='at the desk',
    distractorsKo=['기증 팀이 보험을 확인할 거예요', '기증 팀이 수술 일정을 잡을 거예요'],
    blank={'answer': 'registered', 'options': [{'en': 'registered'}, {'en': 'retired'}, {'en': 'required'}, {'en': 'relaxed'}]})

# nuance: pair · swap
pr = F.nu(T, 'pair')
pr['words'] = ['w-connect', 'w-answer', 'w-question', 'w-donation']
pr['pairs'] = [['connecting you', 'with the team'], ['answer', 'your questions'], ['the donation', 'coordinator']]
pr['decoys'] = ['to the team']
pr['why'] = 'connect you with는 사람을 다른 사람에게 이어 주는 말이고, answer는 전치사 없이 questions를 바로 받아요. 기증 설명은 donation coordinator(기증 코디네이터)가 맡아요.'
sw = F.nu(T, 'swap')
sw['words'] = ['w-pressure', 'w-connect', 'w-team']
sw['before'] = ['', 'You should really consider it', " — I'm only connecting you with the donation team."]
sw['notes'] = {"There's no pressure": '압박이 없다고 먼저 말하고 간호사는 연결만 한다고 선을 그어요.',
               'You should really consider it': "권유는 압박으로 들리고, 뒤의 '연결만 해요'와 모순돼요.",
               'It would help so many people': sw['notes']['It would help so many people']}
sw['ko'] = '압박은 전혀 없어요, 저는 기증 담당 팀과 연결해 드릴 뿐이에요'
# order
od = F.sits[T]['order']
od['why'] = ("애도로 시작하고, 준비되면 기증 담당자가 이야기하러 올 거라고 알리고, That said로 압박이 없고 간호사는 연결만 한다고 선을 긋고, "
             "가족이 더 듣고 싶어 하면 코디네이터가 설명해요. 기증 요청과 설명은 OPO 담당자 몫이고 간호사는 연결만 해요. "
             "That said, If you do가 앞 줄을 이어서 순서가 하나예요(do는 3줄의 '압박 없음'에 맞서는 말).")
L = od['lines']
assert L[1]['en'].startswith("When you're ready, there's a sensitive") and L[2]['en'].startswith('That said')
L[1].update({'en': "When you're ready, a donation specialist will come to talk with you.", 'ko': '준비되시면 기증 전문 담당자가 와서 이야기해 드릴 거예요', 'note': '담당자'})
L[2].update({'en': "That said, there's no pressure — I'm only connecting you with them.", 'ko': '다만 압박은 없고, 저는 담당 팀과 연결해 드릴 뿐이에요', 'note': '역할'})

F.key_phrases(T, {"When you're ready, a specialist can talk about donation.": "When you're ready, a donation specialist will come to talk with you.",
                  "There's no pressure — it's entirely your family's choice.": "There's no pressure — I'm only connecting you with the donation team."})
F.save()
