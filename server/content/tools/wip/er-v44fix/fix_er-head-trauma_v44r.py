import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-head-trauma.yaml'
f=Fx(R+'base-er-head-trauma.yaml')
def S(i,t,j):
    assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)['sentences'][j]
# 1~3 decoy
x=S(12,'반복 구토·기면 진행',2); assert x['decoy']=='a stomach bug'; x['decoy']='keeps sleeping'
x=S(16,'두부외상 삽관·환기',4); assert x['decoy']=='Fluids take'; x['decoy']='takes turns'
x=S(16,'두부외상 삽관·환기',0); assert x['decoy']=='to clean'; x['decoy']='was 6'
# 5. 대시 청크 6문장
WHY='대시를 넘는 청크라 대시 앞뒤에 공백을 두고 대시에서 조각을 나눔(내용 같음)'
def dash(i,t,j,old,new,chunks,decoy=None):
    x=S(i,t,j); assert x['en']==old,(x['en'],old)
    if decoy: assert x['decoy']==decoy[0]; x['decoy']=decoy[1]
    f.set_sent(i,j,WHY,en=new,chunks=chunks)
    for w in f.d['words']:
        if w.get('example')==old: f.set_word(w['id'],'예문이 대시 간격을 고친 문장 en과 같아 새 en으로 맞춤',example=new)
    for s in f.d['situations']:
        for n in s.get('nuance',[]) or []:
            if n.get('kind')=='order':
                for l in n['lines']:
                    if l['en']==old: l['en']=new
dash(10,'두개저 골절 징후',0,'I see bruising around your eyes—when did that appear?','I see bruising around your eyes — when did that appear?',
     ['I see','bruising','around your eyes','— when did that appear','?'])
dash(13,'언어장벽 두부외상',1,'Blood thinner medicine—do you take it?','Blood thinner medicine — do you take it?',
     ['Blood thinner','medicine','— do you','take it','?'])
dash(14,'경막외혈종 명료기 후 악화',3,'You felt fine minutes ago—now tell me what changed.','You felt fine minutes ago — now tell me what changed.',
     ['You felt fine','minutes ago','— now tell me','what changed','.'],('days ago—now','days ago'))
dash(15,'뇌탈출 임박(동공 산대)',0,'One pupil is blown—this is an emergency.','One pupil is blown — this is an emergency.',
     ['One pupil','is blown','— this is an emergency','.'])
dash(15,'뇌탈출 임박(동공 산대)',4,'Check the other pupil now—compare both sides.','Check the other pupil now — compare both sides.',
     ['Check the other pupil now','— compare','both sides','.'])
dash(17,'관통성 두부손상',3,'We will not remove it here—that could cause more bleeding.','We will not remove it here — that could cause more bleeding.',
     ['We will not remove it','here','— that could cause','more bleeding','.'])
f.finish(C)
# (후속 실행 기록) order 줄 인용 2건(S11 L1, S16 L1)은 situation['order']['lines']에 있어 별도 패치로 새 en에 맞춤
