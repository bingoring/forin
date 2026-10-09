import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
F=Fx(R+'base-er-abdominal.yaml')
t=F.sit(17); assert t['title']=='천공성 궤양(판자복부)'
S=t['sentences']
# nuance pair decoys
p=t['nuance'][0]; assert p['decoys']==['to the surgeon']; p['decoys']=['seeing you']
# 17.2
OLD="I'm calling the surgeon right now to come see you."; NEW="We're calling the surgeon right now to come see you."
x=S[2]; assert x['en']==OLD; assert x['decoy']=='tomorrow'
x['decoy']="tomorrow's"
x['en']=NEW; x['chunks'][0]="We're calling"
assert x['why'].startswith('calling the surgeon right now로 지금 누구를 부르는지 알려요.')
x['why']=x['why'].replace('calling the surgeon right now로 지금 누구를 부르는지 알려요.',"We're calling the surgeon right now로 팀이 지금 누구를 부르는지 알려요.",1)
L=t['order']['lines'][1]; assert L['en']=="Because of that sign, I'm calling the surgeon right now."
L['en']="Because of that sign, we're calling the surgeon right now."
# 17.1
x=S[1]; assert x['decoy']=='in the hallway'; x['decoy']='to the pain'
x['blank']['options']=[{'en':'comfortable'},{'en':'awake'},{'en':'busy'},{'en':'thirsty'}]
# 17.4 distractorsKo
x=S[4]; assert x['distractorsKo']==['지금은 아무것도 드시지 마세요','SBAR로 보고했어요']
x['distractorsKo']=['지금은 아무것도 드시지 마세요','외과 선생님께 연락했어요']
# 15.0 decoy
x=F.sent(15,0); assert x['decoy']=='in your leg'; x['decoy']='is it sharp'
save(F.d,F.path)
p=R+'keyphrases.tsv'; s=open(p).read(); a=f"er-abdominal\tI'm calling the surgeon now with an SBAR report.\t{OLD}"
assert a in s; open(p,'w').write(s.replace(a,a.replace(OLD,NEW)))
p=R+'keyphrase-seed-changes-er-abdominal.yaml'; s=open(p).read(); assert OLD in s; open(p,'w').write(s.replace(OLD,NEW))
