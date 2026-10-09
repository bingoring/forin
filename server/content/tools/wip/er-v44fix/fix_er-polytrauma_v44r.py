import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-polytrauma.yaml'
f=Fx(R+'base-er-polytrauma.yaml')
def S(i,t,j):
    assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)['sentences'][j]
W='v46 검토 결정 11 예외 재검토: '
# 1. 4.4 단어 태그
x=S(4,'수상기전(MOI) 청취',4); assert x['words']==[]
f.add_word({'id':'w-sit','en':'sit','ipa':'/sɪt/','ko':'앉다','icon':'me',
 'example':'Which part of the car were you sitting in?','exKo':'차 안에서 어느 자리에 앉아 계셨나요?',
 'cue':"사고 때 차 안 어디에 앉아 있었는지 물을 때 — 'were you ___ting in'",'tag':'수상기전',
 'distractorsEn':['stand','lie'],'distractorsKo':['서다','눕다'],'chips':[['sit']],'decoyChips':['set']},'w-seatbelt','4.4 words 비어 있던 것에 단어 추가')
f.set_sent(4,4,'4.4 words를 w-sit로 태그',words=['w-sit'])
# 2,3. 2.1
x=S(2,'활력·쇼크지수 사정',1); assert x['decoy']=='in the car'
x['blank']={'answer':'feel','options':[{'en':n} for n in ['feel','look','sound','smell']]}; x['decoy']='is normal'
# 4
x=S(1,'경추 보호 설명',0); assert x['decoy']=='to the side'; x['decoy']='is fine'
# 5
x=S(8,'항응고제 복용 외상',4); assert x['decoy']=='from home'; x['decoy']='small dose ones'
# 6
x=S(0,'1차평가 ABCDE 순서',1); assert x['decoy']=='all at once'; x['decoy']='breathe deep'
# 7
x=S(17,'외상성 심정지 대응',3); assert x['decoy']=='Rhythm check'; x['decoy']='Pulse is'
# 8
L=f.sit(18)['order']['lines'][3]; assert 'bleeding—next' in L['en']; L['en']=L['en'].replace('bleeding—next','bleeding — next')
f.finish(C)
