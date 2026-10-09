import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
def sent(d,i,j,title,**kw):
    s=d['situations'][i]; assert s['title']==title,(s['title'],title)
    x=s['sentences'][j]; x.update(kw); return x
def exs(d,old,new,newko=None):
    for w in d['words']:
        if w.get('example')==old:
            w['example']=new
            if newko: w['exKo']=newko
# ---- burn
f=R+'base-er-burn.yaml'; d=load(f)
old94=d['situations'][9]['sentences'][4]['en']; assert old94.startswith('We may need to cut the tight, burned')
sent(d,9,4,'순환성 전층화상',en='Once we relieve the pressure, blood can reach your fingers again.',
 ko='압력을 풀면 손가락까지 피가 다시 통할 수 있어요.',
 chunks=['Once we relieve','the pressure,','blood can reach','your fingers again','.'],
 words=['w-relieve','w-pressure','w-blood','w-finger'],tag='기대 효과',icon='bulb',
 why='Once we…로 처치 뒤에 올 좋은 변화를 알려 절개를 앞둔 두려움을 줄여요. 가피의 압력이 풀리면 눌려 있던 혈관으로 손가락까지 피가 다시 흘러요.')
for w in d['words']:
    if w['id']=='w-relieve':
        w['example']='Once we relieve the pressure, blood can reach your fingers again.'; w['exKo']='압력을 풀면 손가락까지 피가 다시 통할 수 있어요.'
old184=d['situations'][18]['sentences'][4]['en']; assert old184.startswith('We may need to cut the tight skin')
sent(d,18,4,'흉부 원주형 화상 환기장애',en="We'll keep checking how well your chest rises.",
 ko='가슴이 얼마나 잘 올라오는지 계속 확인할게요.',
 chunks=["We'll keep checking",'how well','your chest rises','.'],
 words=['w-keep','w-check','w-chest'],tag='관찰 약속',icon='magnify',
 blank={'answer':'rises','options':[{'en':'rises'},{'en':'sinks'},{'en':'shrinks'},{'en':'sleeps'}]},decoy='your arm',
 why='keep checking으로 계속 지켜본다고 약속해요. 가슴 둘레 가피가 조이면 숨 쉴 때 가슴이 덜 올라와서 절개 전후로 가슴 움직임과 산소 수치를 계속 봐요.')
exs(d,old184,"We'll keep checking how well your chest rises.",'가슴이 얼마나 잘 올라오는지 계속 확인할게요.')
s=d['situations'][17]; assert s['title']=='일산화탄소/시안 중독'
old174=s['sentences'][4]['en']
s['sentences'][4].update(en='This oxygen helps clear the poison from your blood faster.',
 ko='이 산소가 혈액 속 독성 물질을 더 빨리 없애 줘요.',
 chunks=['This oxygen','helps clear','the poison','from your blood faster','.'],
 words=['w-oxygen','w-help','w-poison','w-blood','w-fast'],tag='산소 효과',icon='bulb',
 blank={'answer':'clear','options':[{'en':'clear'},{'en':'add'},{'en':'hide'},{'en':'store'}]},decoy='to the doctor',
 why='helps clear로 산소를 주는 이유를 쉬운 말로 알려요. 고농도 산소는 헤모글로빈에 붙은 일산화탄소가 떨어져 나가는 시간을 크게 줄여요.')
exs(d,old174,'This oxygen helps clear the poison from your blood faster.','이 산소가 혈액 속 독성 물질을 더 빨리 없애 줘요.')
save(d,f)
# ---- chest-abd-trauma
f=R+'base-er-chest-abd-trauma.yaml'; d=load(f)
sent(d,6,5,'폐좌상 지연성 악화',chunks=["I'll",'recheck','your oxygen level','in a few minutes','.'])
save(d,f)
# ---- diabetic
f=R+'base-er-diabetic.yaml'; d=load(f)
x=sent(d,20,2,'DKA 급변 야간 인계')
x['blank']['options']=[{'en':'acid'},{'en':'protein'},{'en':'salt'},{'en':'water'}]
sent(d,15,1,'DKA 중증 저칼륨',chunks=['Do your legs','or your arms','feel weak','?'])
K='이해하셨는지 알 수 있게 어떻게 하실지 보여주시겠어요?'
sent(d,14,3,'당뇨 언어장벽 교육',ko=K)
exs(d,"Can you show me how you'd do it, so I know you understand?","Can you show me how you'd do it, so I know you understand?",K)
G='pH와 음이온차 추이를 명확히 보고할게요.'
sent(d,20,3,'DKA 급변 야간 인계',ko=G)
exs(d,"I'll report your pH and anion gap trend clearly.","I'll report your pH and anion gap trend clearly.",G)
save(d,f)
# ---- dyspnea
f=R+'base-er-dyspnea.yaml'; d=load(f)
s=d['situations'][18]; assert s['title']=='후두부종 아나필락시스 기도'
sc=[n for n in s['nuance'] if n.get('kind')=='context'][0]['scenes'][0]
assert sc['en']=='Give IM epi now — her airway is closing.'; sc['en']='Give IM epi now per protocol — her airway is closing.'
s=d['situations'][21]; assert s['title']=='기관절개 튜브 폐쇄·이탈'
o=s['order']; assert '공기가 통하는지 묻고' in o['why']; o['why']=o['why'].replace('공기가 통하는지 묻고','공기가 통하는지 직접 확인하고')
s=d['situations'][1]; assert s['title']=='산소포화·호흡수 사정 설명'
o=s['order']; L=o['lines']
L[2].update(en='While it reads, just rest and breathe normally for that minute.',ko='재는 동안 그 1분은 편히 쉬면서 평소처럼 숨 쉬세요')
L[3].update(en="Once we have the number, if your oxygen is low, we'll give you some.",ko='수치가 나오면, 산소가 낮을 때 산소를 드릴게요')
o['why']="집게를 끼운다고 알리고, 그 집게가 아프지 않다고 안심시키고, 재는 동안 편히 쉬게 하고(그 사이 호흡수는 조용히 세요), 수치가 나오면 필요한 조치를 알립니다. 'It'·'that minute'·'the number'가 앞 줄을 가리켜 순서가 하나예요."
save(d,f)
