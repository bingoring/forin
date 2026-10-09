import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _fixlib_p1 import Fix
f=Fix('er-anaphylaxis')
# 20.3 시각 모순
assert f.sent(20,3)['en']=='Vitals were steady all shift until about zero-one-thirty.'
f.set_sentence(20,3,'20.0의 "02:00까지 안정"과 시각이 어긋나 02:00로 맞춤',
    en='Vitals were steady all shift until about zero-two-hundred.',
    ko='활력징후는 새벽 2시쯤까지 근무 내내 안정적이었습니다.',
    chunks=['Vitals were steady','all shift','until about zero-two-hundred','.'])
o=f.sit(20)['order']['lines'][1]
assert 'zero-one-thirty' in o['en']
o['en']='Before that, vitals were steady all shift until about zero-two-hundred.'
o['ko']='그 전에는 근무 내내 새벽 2시쯤까지 안정적이었습니다'
# 13.3 라텍스
assert f.sent(13,3)['en']=='Nothing in this room should touch latex from now on.'
f.set_sentence(13,3,'"방 안 물건"이 아니라 "라텍스가 환자에게 닿지 않게"라는 뜻으로 바로잡음',
    en='Nothing with latex should touch you from now on.',
    ko='이제부터 라텍스가 든 어떤 것도 몸에 닿으면 안 돼요.',
    chunks=['Nothing','with latex','should touch you','from now on','.'])
s=f.sent(13,3)
s['why']=s['why'].replace('Nothing…should touch…로 주어를 사물로 두어 환자가 아니라 환경이 책임진다고 말해요.','Nothing with latex should touch you로 주어를 사물로 두어 환자가 조심할 일이 아니라 환경이 책임질 일이라고 말해요.')
assert 'Nothing with latex should touch you' in s['why']
o=f.sit(13)['order']['lines'][1]
assert 'in this room' in o['en']
o['en']='With that done, nothing with latex should touch you from now on.'
o['ko']='그렇게 하고 나면 이제부터 라텍스가 든 어떤 것도 몸에 닿으면 안 돼요'
f.save()
