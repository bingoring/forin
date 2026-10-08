import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'

C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-fever-infection.yaml'
f=Fx(R+'base-er-fever-infection.yaml')
def S(i,t,j):
    assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)['sentences'][j]
x=S(20,'고위험 감염 이송 인계',0); assert x['decoy']=='Probable measles'; x['decoy']='is cleared'
x=S(3,'해열제 투여 설명',3); assert x['blank']['answer']=='medicine'
x['blank']['options']=[{'en':n} for n in ['medicine','thermometer','bandage','inhaler']]
for i,j in ((12,0),(17,0)):
    x=f.sit(i)['sentences'][j]; assert x['decoy']=='since morning'; x['decoy']='keeps me'
why='예문의 concerns me about은 자연스러운 영어가 아니라 makes me worried about로(12.0과 같은 이유)'
f.set_word('w-stiff',why,example='The stiff neck with fever makes me worried about meningitis.')
f.set_word('w-neck',why,example='The stiff neck with fever makes me worried about meningitis.')
f.set_word('w-meningitis',why,example='A stiff neck makes me worried about meningitis.')
w=f.W['w-precaution']; assert "contact ___s" in w['cue']; w['cue']="전파 경로에 따라 정한 보호 조치 — 'droplet ___'"
w=f.W['w-worry']; assert "worryed" not in w['cue']; w['cue']="의료진이 소견을 보고 불안한 마음을 솔직히 말할 때 — 'I ___ about a deep infection.'"
f.finish(C)
