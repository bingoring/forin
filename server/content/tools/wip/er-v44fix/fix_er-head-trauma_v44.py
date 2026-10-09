import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-head-trauma.yaml'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-head-trauma.yaml'
d=yaml.safe_load(open(P)); S=d['situations']; Wl=d['words']; W={w['id']:w for w in Wl}
chg=[]; R='v46 검토 결정 11 예외: '
def S_(n,idx,old,reason,**kw):
    s=S[n-1]; t=s['sentences'][idx]; assert t['en']==old,t['en']
    f=[k for k in ('en','ko','chunks','words') if k in kw and kw[k]!=t[k]]
    t.update(kw)
    chg.append({'kind':'sentence','situation':s['title'],'index':idx,'fields':f,'why':R+reason})
    return t
touched=[]
EX0={w['id']:w['example'] for w in Wl}
def sweep(x,old,new,path=''):
    """문장 en을 그대로 인용한 곳(order 줄·nuance 장면·단어 예문)을 새 en으로 맞춘다."""
    if isinstance(x,dict):
        for k,v in x.items():
            if isinstance(v,str):
                if v==old and k in('en','example'): x[k]=new; touched.append((path,k))
            else: sweep(v,old,new,path+'/'+str(x.get('id',k)))
    elif isinstance(x,list):
        for i,v in enumerate(x): sweep(v,old,new,path)
# 18.3 — 우측 산대와 모순
S_(19,3,'Left pupil remains reactive and equal.',
   '18.1에서 우측이 산대인데 `equal`(양쪽 동일)이라 모순이라 좌측 소견만 말한다',
   en='Left pupil remains brisk and reactive.',
   ko='좌측 동공은 여전히 반응이 빠르고 정상입니다.',
   chunks=['Left pupil','remains brisk','and reactive','.'])
W['w-reactive']['example']='Left pupil remains brisk and reactive.'
W['w-reactive']['exKo']='좌측 동공은 여전히 반응이 빠르고 정상입니다.'
chg.append({'kind':'word','id':'w-reactive','fields':['example'],'why':R+'예문이 18.3 en과 같아 새 en으로 맞춤'})
# 대시를 넘는 청크 — 대시 앞뒤에 공백을 두어 대시에서 조각을 나눈다(다른 ER 주제와 같은 표기)
fixes=[
 (3,0,"I'm shining a light in your eyes—look straight ahead.",["I'm shining",'a light','in your eyes','— look','straight ahead','.']),
 (10,1,"I can't tell if it's alcohol or your injury—so we watch you.",["I can't tell","if it's alcohol",'or your injury','— so we watch you','.']),
 (13,2,"This could mean rising pressure—we're rechecking him now.",['This could mean','rising pressure',"— we're rechecking him",'now','.']),
 (15,0,"Your headache is suddenly much worse—we're acting now.",['Your headache','is suddenly','much worse',"— we're acting now",'.']),
 (17,0,"GCS is 6—we need to secure the airway.",['GCS is 6','— we need','to secure','the airway','.']),
 (17,4,"Airway takes priority—GCS is too low to protect it.",['Airway takes','priority','— GCS is too low','to protect it','.']),
]
for n,idx,old,ch in fixes:
    new=old.replace('—',' — ')
    S_(n,idx,old,'대시를 넘는 청크라 대시 앞뒤에 공백을 두고 대시에서 조각을 나눔(내용 같음)',en=new,chunks=ch)
    sweep(d,old,new)
for w in Wl:
    if w['example']!=EX0[w['id']] and w['id']!='w-reactive':
        chg.append({'kind':'word','id':w['id'],'fields':['example'],'why':R+'예문이 대시 간격을 고친 문장 en과 같아 새 en으로 맞춤'})
yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
c=yaml.safe_load(open(C)); c['changes'].extend(chg)
yaml.safe_dump(c,open(C,'w'),allow_unicode=True,sort_keys=False,width=10000)
print(touched)
