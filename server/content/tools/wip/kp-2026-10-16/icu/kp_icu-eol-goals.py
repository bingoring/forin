"""icu-eol-goals — keyPhrase 5문장 교체(2026-10-16). base-icu-eol-goals.yaml → icu-eol-goals.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-eol-goals.yaml'))
CH = []

# 1. 인공호흡기 철회 중 증상 급변 관리 [2]
T1 = '인공호흡기 철회 중 증상 급변 관리'
s = sent(doc, T1, 2, "Stay with her — I'm right here and she'll settle.")
s.update({
    'en': "Stay with her — I'm right here, and we'll keep her comfortable.",
    'ko': '곁에 계세요 — 저도 바로 여기 있고, 저희가 편안하게 해드릴게요.',
    'chunks': ['Stay', 'with her', '—', "I'm right here", ',', "and we'll keep her", 'comfortable', '.'],
    'words': ['w-stay', 'w-comfortable'],
    'why': ("Stay with her는 곁에 있어도 된다는 허락이고, I'm right here로 간호사도 함께 있다고 알려요. "
            "we'll keep her comfortable은 곧 가라앉는다는 장담 대신 팀이 할 일을 약속하는 말이라, 결과를 보장하지 않고도 안심을 줘요."),
    'distractorsKo': ['곁에 계세요 — 저도 바로 밖에 있고, 저희가 편안하게 해드릴게요',
                      '곁에 계세요 — 저도 바로 여기 있고, 저희가 깨끗하게 해드릴게요'],
    'blank': blank('here', ['downstairs', 'outside', 'upstairs']),
})
CH.append({'kind': 'sentence', 'situation': T1, 'index': 2, 'fields': ['en', 'ko', 'chunks', 'words'],
           'why': "she'll settle(결과 장담) → we'll keep her comfortable; −w-settle +w-comfortable"})
remove_word(doc, 'w-settle')
CH.append({'kind': 'word-remove', 'id': 'w-settle', 'why': '바꾼 문장에 settle이 없어 어느 문장도 태그하지 않게 됐다'})
o = sit(doc, T1)['order']
l4 = o['lines'][3]
assert l4['en'].startswith("Now that she's settling")
l4['en'] = "Now that she's more comfortable, you did exactly the right thing calling me over."
l4['ko'] = '더 편안해지셨으니, 저를 불러주신 게 정확히 맞았어요'
o['why'] = ("먼저 곁에 있으라고 하고 약을 주고, 3줄의 That medication은 2줄의 약을 가리켜요. "
            "4줄의 Now that she's more comfortable은 3줄에서 약이 듣기 시작한 결과라 마지막에 와요.")

# 2~4. 임종 급변·가족 위기 대응 [0][1][2]
T2 = '임종 급변·가족 위기 대응'
s = sent(doc, T2, 0, "I'm right here with you and I won't leave.")
s.update({
    'en': "I'm right here with you, and I'll stay as long as I can.",
    'ko': '저는 바로 여기 곁에 있고, 할 수 있는 한 오래 함께 있을게요.',
    'chunks': ["I'm right here", 'with you', ',', "and I'll stay", 'as long as I can', '.'],
    'words': ['w-stay'],
    'why': ("I'm right here로 지금 곁에 있다는 것을 먼저 말하고, as long as I can으로 지킬 수 있는 만큼만 약속해요. "
            "다른 환자나 호출로 자리를 비울 수도 있는 간호사에게는 절대 떠나지 않겠다는 말보다 정직한 약속이에요."),
    'distractorsKo': ['저는 바로 여기 문 앞에 있고, 할 수 있는 한 오래 함께 있을게요',
                      '저는 바로 여기 곁에 있고, 교대할 때까지 함께 있을게요'],
    'blank': blank('here', ['upstairs', 'outside', 'downstairs']),
})
CH.append({'kind': 'sentence', 'situation': T2, 'index': 0, 'fields': ['en', 'ko', 'chunks', 'words'],
           'why': "I won't leave(지킬 수 없는 약속) → I'll stay as long as I can; −w-leave +w-stay"})

s = sent(doc, T2, 1, "His passing looks peaceful and he's not in pain.")
s.update({
    'en': 'His passing looks peaceful, and he seems comfortable.',
    'ko': '그분의 임종은 평온해 보이고, 편안하신 것 같아요.',
    'chunks': ['His passing looks', 'peaceful', ',', 'and he seems', 'comfortable', '.'],
    'words': ['w-passing', 'w-peaceful', 'w-comfortable'],
    'why': ("passing은 죽음을 부드럽게 돌려 쓴 말이라 슬픔에 잠긴 가족에게 덜 날카롭게 전해져요. "
            "looks와 seems는 눈에 보이는 모습을 말하는 동사라, 통증이 없다고 단정하지 않고 지금 관찰한 편안함만 전해요."),
    'distractorsKo': ['그분의 얼굴은 평온해 보이고, 편안하신 것 같아요',
                      '그분의 임종은 평온해 보이고, 조용하신 것 같아요'],
})
CH.append({'kind': 'sentence', 'situation': T2, 'index': 1, 'fields': ['en', 'ko', 'chunks', 'words'],
           'why': "he's not in pain(단정) → he seems comfortable(관찰); −w-pain +w-comfortable"})
w = word(doc, 'w-passing')
w['example'], w['exKo'] = s['en'], s['ko']
CH.append({'kind': 'word', 'id': 'w-passing', 'fields': ['example'], 'why': '예문을 바꾼 문장으로'})

s = sent(doc, T2, 2, 'Take a breath — you can talk to him, he can hear you.')
s.update({
    'en': 'Take a breath — you can talk to him; he may still hear you.',
    'ko': '숨을 한 번 쉬어보세요 — 말을 거셔도 되고, 그분이 아직 들으실 수도 있어요.',
    'chunks': ['Take a breath', '—', 'you can talk', 'to him;', 'he may still hear you', '.'],
    'why': ("Take a breath는 감정이 큰 사람에게 잠깐 멈추라는 짧은 안내예요. "
            "he may still hear you는 청각이 마지막까지 남을 수 있다는 점을 may로 열어 두고 말해, 장담하지 않으면서 말을 걸어도 좋다고 권해요."),
    'distractorsKo': ['숨을 한 번 쉬어보세요 — 손을 잡으셔도 되고, 그분이 아직 들으실 수도 있어요',
                      '물을 한 번 마셔보세요 — 말을 거셔도 되고, 그분이 아직 들으실 수도 있어요'],
    'blank': blank('hear', ['see', 'answer', 'smell']),
})
CH.append({'kind': 'sentence', 'situation': T2, 'index': 2, 'fields': ['en', 'ko', 'chunks'],
           'why': 'he can hear you(단정) → he may still hear you'})
l3 = sit(doc, T2)['order']['lines'][2]
assert 'hearing is often the last sense' in l3['en']
l3['en'] = 'As his breathing changes, keep talking to him; hearing may be the last sense to go.'
l3['ko'] = '호흡이 달라지는 동안 계속 말을 걸어주세요, 청각은 마지막까지 남을 수 있어요'

# 5. 장기기증 옵션 소통 [0]
T5 = '장기기증 옵션 소통'
s = sent(doc, T5, 0, 'Donation is an option some families find meaningful.')
s.update({
    'en': "If you'd like, a donation specialist can talk with you about it.",
    'ko': '원하시면 기증 전문가가 그 이야기를 나눠 드릴 수 있어요.',
    'chunks': ["If you'd like", ',', 'a donation specialist', 'can talk with you', 'about it', '.'],
    'words': ['w-donation', 'w-specialist'],
    'tag': '전문가 연결',
    'icon': 'speech',
    'why': ("If you'd like로 먼저 가족의 뜻을 묻고, 기증 이야기는 간호사가 권하지 않고 기증 전문가에게 이어 줘요. "
            "미국에서는 장기조달기관(OPO)이나 훈련받은 지정 요청자가 기증을 꺼내도록 규정돼 있어서예요."),
    'decoy': 'about the bill',
    'distractorsKo': ['원하시면 기증 전문가가 그 서류를 보내 드릴 수 있어요',
                      '원하시면 사회복지사가 그 이야기를 나눠 드릴 수 있어요'],
    'blank': blank('donation', ['billing', 'discharge', 'insurance']),
})
CH.append({'kind': 'sentence', 'situation': T5, 'index': 0, 'fields': ['en', 'ko', 'chunks', 'words'],
           'why': '간호사가 기증을 먼저 권하지 않음(CMS — OPO·지정 요청자) → 원하면 기증 전문가에게 연결; −w-option −w-meaningful +w-specialist'})
w = word(doc, 'w-donation')
w['example'], w['exKo'] = s['en'], s['ko']
CH.append({'kind': 'word', 'id': 'w-donation', 'fields': ['example'], 'why': '예문을 바꾼 문장으로'})
remove_word(doc, 'w-meaningful')
CH.append({'kind': 'word-remove', 'id': 'w-meaningful', 'why': '바꾼 문장에 meaningful이 없어 어느 문장도 태그하지 않게 됐다'})
o = sit(doc, T5)['order']
assert o['lines'][0]['en'] == 'Donation is an option some families find meaningful.'
o['why'] = ("기증은 간호사가 권하지 않고, 원하면 전문가가 이야기한다는 연결로 시작해요. "
            "2줄의 That specialist는 1줄의 전문가를, 3줄의 that team은 2줄의 치료팀을, 4줄의 that decision은 3줄의 결정을 가리켜 순서가 하나예요.")
o['lines'] = [
    {'en': "If you'd like, a donation specialist can talk with you about it.", 'icon': 'speech',
     'ko': '원하시면 기증 전문가가 그 이야기를 나눠 드릴 수 있어요', 'note': '연결'},
    {'en': 'That specialist works separately from his care team.', 'icon': 'stetho',
     'ko': '그 전문가는 그분의 치료팀과 따로 일해요', 'note': '분리'},
    {'en': 'Whatever you decide, that team will keep caring for him the same way.', 'icon': 'shield',
     'ko': '어떻게 결정하셔도 그 치료팀은 똑같이 돌봐 드려요', 'note': '보장'},
    {'en': "Take your time with that decision; there's no need to answer today.", 'icon': 'calendar',
     'ko': '그 결정은 천천히 생각하세요, 오늘 답하실 필요는 없어요', 'note': '시간'},
]

dump(doc, os.path.join(HERE, 'icu-eol-goals.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-eol-goals.yaml'), CH)
print('icu-eol-goals.yaml 저장')
