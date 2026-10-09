import sys,yaml; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
B='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-peds.yaml'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-peds.yaml'
# changes: 17.1 take 태그 항목 삭제
t=yaml.safe_load(open(C)); L=t['changes'] if isinstance(t,dict) else t
keep=[c for c in L if not (c.get('kind')=='sentence' and c.get('situation')=='영아 SIDS 소생 실패' and c.get('index')==1 and 'take 태그를 더함' in c.get('why',''))]
assert len(keep)==len(L)-1
if isinstance(t,dict): t['changes']=keep
else: t=keep
open(C,'w').write(yaml.safe_dump(t,allow_unicode=True,sort_keys=False,width=100000))
f=Fx(B)
si=[i for i,s in enumerate(f.d['situations']) if s['title']=='영아 SIDS 소생 실패'][0]
assert f.sent(si,1)['words']==['w-alltime','w-take']
f.sent(si,1)['words']=['w-alltime']
f.set_sent(si,0,'w-take(재다)를 17.1에서 빼고 사망 고지 핵심 표현 everything을 새 단어로 태그',words=['w-sorry','w-survive','w-everything'])
f.add_word({'id':'w-everything','en':'everything','ipa':'/ˈɛvriθɪŋ/','ko':'모든 것','icon':'handshake2',
 'example':"I'm so sorry — we did everything we could, and she didn't survive.",
 'exKo':'정말 유감입니다 — 저희가 할 수 있는 모든 걸 다 했지만, 아이는 살아나지 못했어요.',
 'cue':"소생에 실패한 뒤 가족에게 최선을 다했다고 전할 때 — 'we did ___ we could'",'tag':'사별 지지',
 'distractorsEn':['everyone','evening'],'distractorsKo':['모든 사람','저녁'],'chips':[['ev','ery','thing']],'decoyChips':['eve','ry']},
 'w-sorry','사망 고지의 핵심 표현 we did everything we could — 17.1에 맞지 않는 w-take 태그를 대신해 17.0에 태그')
# 10.5 decoy
si2=[i for i,s in enumerate(f.d['situations']) if s['title']=='학대 의심 정황'][0]
x=f.sent(si2,5); assert x['decoy']=='at the desk'; x['decoy']='keeps him safe'
f.finish(C)
