import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-shock.yaml'
f=Fx(R+'base-er-shock.yaml')
def S(i,t,j):
    assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)['sentences'][j]
def opts(x,l): x['blank']['options']=[{'en':n} for n in l]
# 1 order
o=f.sit(21)['order']; assert o['lines'][2]['en'].startswith('To help prevent that')
o['lines'][2].update(en="That's what's happening now, so we'll give hydrocortisone and fluids right away.",ko='지금 그 위기가 온 거라서 하이드로코르티손과 수액을 바로 드릴게요')
o['why']="스테로이드를 끊은 사정을 묻고, 그것이 위험한 위기가 될 수 있다고 알리고, 지금 그 위기가 왔으니 바로 약을 준다고 하고, 약이 들어간 뒤 갑자기 끊지 말라고 교육해요. 'it'·'that'·'the hydrocortisone'이 앞 줄을 가리켜 순서가 하나예요."
# 2 21.4
T='부신위기 저혈압'
x=S(21,T,4); assert x['en']=="We'll give hydrocortisone now to treat the crisis."
f.set_sent(21,4,'21.4 21.2와 겹치고 decoy가 투여를 늦추는 위험한 문장이 됨 — 약의 원리 설명으로 새로 씀',
 en='Hydrocortisone replaces the hormone your body is missing right now.',
 ko='하이드로코르티손은 지금 몸에 모자란 호르몬을 채워 줘요.',
 chunks=['Hydrocortisone replaces','the hormone','your body','is missing','right now','.'],
 words=['w-hydrocortisone','w-miss'])
x['tag']='약 설명'; x['icon']='pill'
x['why']='replaces the hormone …으로 약이 몸에 모자란 코르티솔을 채운다는 원리를 쉬운 말로 알려요. 이미 부신위기로 혈압이 떨어진 상태라 위기를 막는 게 아니라 모자란 호르몬을 바로 채워 치료해요.'
x['blank']={'answer':'missing','options':[{'en':n} for n in ['missing','making','storing','blocking']]}; x['decoy']='is optional'
# 3 16.4
x=S(16,'폐색전 폐쇄성 쇼크',4); assert x['en']=="Don't rub his swollen leg, and keep it still."
f.set_sent(16,4,'16.4 다리 안정은 근거가 약하고 장면과 안 맞음 — 혈전용해 전 정맥로 확보 권고로 교체',
 en='Get two large-bore IVs in before the thrombolytics start.',
 ko='혈전용해제를 시작하기 전에 굵은 정맥로를 두 개 잡아 주세요.',
 chunks=['Get two','large-bore IVs in','before the thrombolytics','start','.'],
 words=['w-large','w-bore','w-iv','w-thrombolytic','w-start'])
x['tag']='투여 전 준비'; x['icon']='shield'
x['why']='before the thrombolytics start로 순서를 못 박아요. 혈전용해제가 들어간 뒤에는 새로 찌른 자리에서 피가 잘 멎지 않아서, 필요한 정맥로와 채혈은 미리 해 둬요.'
x['blank']={'answer':'IVs','options':[{'en':n} for n in ['IVs','doses','scans','beds']]}; x['decoy']='is negative'
x['distractorsKo']=['혈전용해제 용량을 다시 확인해 주세요','다리 둘레를 재 주세요']
# 4,5
x=S(7,'심인성 쇼크 감별',4); assert x['blank']['answer']=='worse'
x['blank']={'answer':'chest','options':[{'en':n} for n in ['chest','ears','eyes','sinuses']]}
assert x['decoy']=='at night'; x['decoy']='than before'
# 6
x=S(3,'탈수 관련 저혈압 교육',4); assert x['decoy']=='at night'; x['decoy']='the bathroom'
# 7
x=S(9,'수액 반응성 평가',1); assert x['decoy']=='every minute'; x['decoy']='as a good'
# 8
x=S(15,'패혈증성 쇼크 급속 악화 번들',1); assert x['decoy']=='by tomorrow'; x['decoy']='are optional'
# 9
x=S(21,T,3); assert x['decoy']=='for a day'; x['decoy']="Steroids can't"
# 10
x=S(20,'다장기 악화 SBAR·ICU 이송',2); assert x['decoy']=='a short stay'; x['decoy']='is stable'
x=S(20,'다장기 악화 SBAR·ICU 이송',4); assert x['decoy']=='at home'; x['decoy']="she's stable"
# 11
x=S(0,'저혈압 초기 활력 인지',3); assert x['decoy']=='all day'; x['decoy']='a little high'
# 12
x=S(19,'신경성 쇼크 척수손상',3); assert x['blank']['answer']=='temperature'
x['blank']['options']=[{'en':n} for n in ['temperature','weight','diet','vision']]
f.finish(C)
