import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
f=Fx('/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-poisoning.yaml')
# 18.5 메탄올: 신장이 아니라 시신경·대사성 산증
en="We're moving fast because your vision and your blood's acid level are both at risk."
ko='시력과 혈액의 산성도가 둘 다 위험해서 빠르게 움직이고 있어요.'
x=f.set_sent(18,5,'메탄올의 표적은 시신경과 대사성 산증이지 신장이 아님(신장은 에틸렌글리콜) — 같은 문장 why와도 맞춤',
  en=en,ko=ko,chunks=["We're moving fast",'because your vision',"and your blood's acid level",'are both at risk','.'],words=['w-fast','w-vision','w-acid'])
x['why']='because로 서두르는 이유를 바로 대요. 메탄올 중독은 시신경 손상과 혈액이 산성으로 기우는 대사성 산증이 중요하고, 빠른 처치가 영구적인 시력 손상을 줄이는 데 도움이 돼요.'
f.set_word('w-vision','18.5 문장이 바뀜 — 예문도 새 문장으로',example=en,exKo=ko)
f.add_word({'id':'w-acid','en':'acid','ipa':'/ˈæsɪd/','ko':'산성','icon':'cross','example':en,'exKo':ko,
  'cue':"메탄올 중독에서 혈액이 시큼해지듯 산성으로 기울 때 — 'your blood's ___ level'",'tag':'중독 징후','distractorsEn':['acne','aside'],'distractorsKo':['염분','당분'],'chips':[['ac','id']],'decoyChips':['at','it']},
  'w-kidney','18.5에서 kidney가 빠지고 acid가 들어와 새 단어로')
f.rm_word('w-kidney','18.5에서 kidneys를 blood\'s acid level로 바꿔 어디에도 쓰이지 않음')
# 1.3 활성탄
en='I know this tastes bad, but it will help soak up the poison.'
ko='맛이 안 좋다는 거 알아요, 하지만 독을 빨아들여 붙잡는 데 도움이 될 거예요.'
f.set_sent(1,3,'활성탄은 독을 씻어 내는 것이 아니라 흡착하므로 clean out을 soak up으로',en=en,ko=ko,chunks=['I know','this tastes bad,','but it will help','soak up the poison','.'])
for w in ('w-taste','w-poison'): f.set_word(w,'1.3 문장이 바뀜 — 예문도 새 문장으로',example=en,exKo=ko)
# 17.4
en="We're cooling you and giving medication to calm your body down."
ko='열을 식히고, 몸을 진정시키도록 약을 드릴게요.'
x=f.set_sent(17,4,'We\'re giving cooling and medication이 부자연스러운 영어라 cooling you and giving medication으로',en=en,ko=ko,chunks=["We're cooling you",'and giving medication','to calm','your body down','.'])
x['blank']={'answer':'cooling','options':[{'en':'cooling'},{'en':'weighing'},{'en':'scanning'},{'en':'moving'}]}
f.set_word('w-calm','17.4 문장이 바뀜 — 예문도 새 문장으로',example=en,exKo=ko)
# 15.0
ko='동공이 점같이 작고 호흡수는 8회예요 — 중독 증후군(톡시드롬) 같아요.'
f.set_sent(15,0,'톡시드롬 음차가 낯설어 중독 증후군(톡시드롬)으로 풀어 씀',ko=ko)
for w in ('w-pupil','w-pinpoint','w-respiration','w-toxidrome'): f.set_word(w,'15.0 문장 ko가 바뀜 — exKo도 새 ko로',exKo=ko)
for l in f.sit(15)['order']['lines']:
    if l['ko'].startswith('톡시드롬 같아서'): l['ko']=l['ko'].replace('톡시드롬','중독 증후군(톡시드롬)',1)
# 20.2
ko='마지막 혈압은 80에 40이었고, 중탄산제 볼루스를 투여했습니다.'
x=f.set_sent(20,2,'드렸습니다는 인계 말이 아니라 투여했습니다로',ko=ko)
for w in ('w-pressure','w-bicarb','w-bolus'): f.set_word(w,'20.2 문장 ko가 바뀜 — exKo도 새 ko로',exKo=ko)
x['distractorsKo']=[d.replace('아트로핀을 드렸습니다','아트로핀을 투여했습니다') for d in x['distractorsKo']]
for l in f.sit(20)['order']['lines']:
    l['ko']=l['ko'].replace('볼루스를 드렸습니다','볼루스를 투여했습니다')
# chunks 3.0, 14.1, 17.3
f.set_sent(3,0,'청크가 breathe / in the fumes를 끊음',chunks=['Which products','did you mix,','and did you','breathe in the fumes','?'])
f.set_sent(14,1,'청크 ". Can we talk"이 문장 부호를 다음 문장 머리에 붙임',chunks=['Some of your signs','tell me','your body reacted','to something','.','Can we talk about it','?'])
f.set_sent(17,3,'청크가 your body / temperature is를 끊음',chunks=['Your muscles','are stiff','and your body temperature','is very high','.'])
f.finish('/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-poisoning.yaml')
