import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
f=Fx(R+'base-er-anaphylaxis.yaml')
sit=f.sit(7); assert sit['title']=='항생제 IV 중 반응'
o=sit['order']['lines']
assert o[2]['en'].startswith('Besides that, is your throat closing up, or is your chest getting tighter')
o[2]['en']='Besides that, is your throat closing up, or does your chest feel tight?'
o[2]['ko']='그 밖에 목이 막히거나 가슴이 조이세요?'
o[3]['en']='Thanks. Epinephrine is drawn up — if any of that starts, it goes in right away.'
o[3]['ko']='고마워요. 에피네프린은 준비돼 있어요 — 그런 증상이 하나라도 생기면 바로 놓을게요'
w=sit['order']['why']; a="'that tightness'가 가슴 조임을 가리켜 심해지면 바로 에피네프린을 놓겠다고 닫아요"
assert a in w
sit['order']['why']=w.replace(a,"'any of that'이 앞 두 줄의 증상을 가리켜, 하나라도 생기면 바로 에피네프린을 놓겠다고 닫아요")
x=sit['sentences'][2]; assert x['en'].startswith('I have epinephrine ready')
a='목이 막히거나 가슴 조임이 심해지거나 혈압이 떨어지면'; assert a in x['why']
x['why']=x['why'].replace(a,'목이 조이거나 숨이 차거나 혈압이 떨어지면')
c=[n for n in sit['nuance'] if n['kind']=='context'][0]
sc=c['scenes'][2]; assert 'gets worse' in sc['fix']
sc['fix']='I\'m right here, and the medicine is ready if you start having trouble breathing.'
for wid in ('w-latex','w-touch'):
    f.set_word(wid,'13.3에서 바로잡은 뜻(사물이 라텍스에 닿음)이 예문에 남아 있어 새 문장으로',
      example='Nothing with latex should touch you.',exKo='라텍스가 든 어떤 것도 몸에 닿으면 안 돼요.')
f.finish('/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-anaphylaxis.yaml')
