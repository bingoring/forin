import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
f=Fx('/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-peds.yaml')
# 10.5
en='My job right now is to keep him safe.'; ko='지금 제 역할은 아이를 안전하게 지키는 거예요.'
f.set_sent(10,5,'nothing more가 신고 의무를 부정하는 말로 읽혀 삭제 — 학대 의심 시 의무 신고(S18)와 어긋남',en=en,ko=ko,chunks=['My job','right now','is to','keep him safe','.'])
f.set_word('w-job','10.5 문장이 바뀜 — 예문도 새 문장으로',example=en,exKo=ko)
# 17.3
en='This is not your fault.'; ko='부모님 잘못이 아니에요.'
x=f.set_sent(17,3,'could have prevented는 검시 전에 단정하면 안 되어 탓하지 않는 말로 바꿈',en=en,ko=ko,chunks=['This is','not','your fault','.'],words=['w-fault'])
x['blank']={'answer':'fault','options':[{'en':'fault'},{'en':'choice'},{'en':'turn'},{'en':'plan'}]}
x['why']="This is not your fault로 부모의 죄책감을 덜어요. 원인 불명의 영아 사망은 검시관 조사가 끝나야 원인이 정해지니, '막을 수 없었다' 같은 원인 단정은 하지 않고 탓하지 않는 말에 집중해요."
f.add_word({'id':'w-fault','en':'fault','ipa':'/fɔːlt/','ko':'잘못','icon':'board','example':en,'exKo':ko,
  'cue':"아이를 잃은 부모에게 꼭 하는 말 — '당신 탓이 아니에요'",'tag':'정서 지지','distractorsEn':['flaw','fall'],'distractorsKo':['책임감','우연'],'chips':[['fault']],'decoyChips':['fall']},
  'w-prevent','17.3에서 prevent가 빠지고 fault가 들어와 새 단어로')
for l in f.sit(17)['order']['lines']:
    if l['en']=='This is not something you caused or could have prevented.':
        l['en']=en; l['ko']='부모님 잘못이 아니에요'
for n in f.sit(17)['nuance']:
    if n['kind']=='pair':
        n['pairs'][1]=["this isn't",'your fault']
        n['words']=['w-sorry','w-fault','w-alltime']
        n['why']="사망을 알리며 건네는 첫마디는 I'm so sorry, 부모의 죄책감을 덜 때는 this isn't your fault, 서두르지 않게 할 때는 take all the time you need예요."
f.set_sent(17,1,'17.3에서 prevent·cause가 빠져 이 상황의 서로 다른 단어가 8개 밑으로 내려가 take 태그를 더함(V3)',words=['w-alltime','w-take'])
f.rm_word('w-prevent','17.3에서 could have prevented를 지우고 nuance pair도 this isn\'t your fault로 바꿔 어디에도 쓰이지 않음')
# 3.4 her->his
en="I'll double-check his numbers against the chart for his age."
f.set_sent(3,4,'S3의 다른 문장·카드는 his인데 이 문장만 her',en=en,chunks=["I'll double-check",'his numbers','against the chart','for his age','.'])
f.set_word('w-chart','3.4 문장이 바뀜 — 예문도 새 문장으로',example=en)
f.finish('/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-peds.yaml')
