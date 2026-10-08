import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-environmental.yaml'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-environmental.yaml'
d=yaml.safe_load(open(P)); S=d['situations']; W={w['id']:w for w in d['words']}
chg=[]
def sit(n,title):
    s=S[n-1]; assert s['title']==title,(n,s['title']); return s
def S_(n,title,idx,old,reason,**kw):
    s=sit(n,title); t=s['sentences'][idx]; assert t['en']==old,t['en']
    f=[k for k in ('en','ko','chunks','words') if k in kw]
    t.update(kw)
    chg.append({'kind':'sentence','situation':title,'index':idx,'fields':f,'why':'v46 검토 결정 11 예외: '+reason})
    return t

# 14.1 / 14.4 — 통역사에게 3인칭으로 묻지 않고 보호자에게 직접
T='고산/환경 노출 언어장벽'
S_(14,T,0,'Through the interpreter — how high did he climb and how fast?',
   '통역사에게 3인칭으로 부탁하지 않고 보호자에게 직접 묻는다(미국 병원 통역 원칙)',
   en='How high did he climb, and how fast?',
   ko='얼마나 높이, 얼마나 빨리 올라갔나요?',
   chunks=['How high','did he climb',', and how fast','?'],
   words=['w-high','w-climb','w-fast'],
   tag='고도 문진', decoy='or what time',
   why='how high·how fast처럼 짧은 질문 두 개로 나누면 통역을 거쳐도 뜻이 덜 흐려져요. 통역사가 아니라 보호자를 보고 직접 물어요.')
t=S_(14,T,3,'Please ask him how high he climbed and how quickly.',
   '`Please ask him`은 통역사에게 3인칭으로 부탁하는 모양이라 보호자에게 직접 묻는 말로 바꾼다',
   en='Can you tell me how high he climbed and how quickly?',
   ko='얼마나 높이, 얼마나 빨리 올라갔는지 말씀해 주시겠어요?',
   chunks=['Can you tell me','how high','he climbed','and how quickly','?'],
   tag='고도 확인',
   why='Can you tell me…로 정중하게 직접 요청하고 how high·how quickly를 한 문장에 담아요. 통역을 거치더라도 통역사가 아니라 보호자를 보고 말하는 것이 원칙이에요.')
t['blank']={'answer':'tell','options':[{'en':'tell'},{'en':'show'},{'en':'lend'},{'en':'hide'}]}
# 12.5 — 구조한 사람이 간호사가 아님
T='익수 후 저체온'
t=S_(12,T,4,'We pulled him out of the ice water a few minutes ago.',
   '`We pulled`은 간호사가 구조한 것으로 읽혀 주어를 구조대로 바꾼다',
   en='The rescuers pulled him out of the ice water a few minutes ago.',
   ko='구조대가 몇 분 전에 얼음물에서 끌어냈어요.',
   chunks=['The rescuers pulled him out','of the ice water','a few minutes','ago','.'],
   why='a few minutes ago로 시간을 어림으로 전해요. 물에서 나온 뒤 경과 시간은 저체온 정도와 치료를 정하는 단서라서 구조 시점을 팀과 가족이 같이 알아요.')
W['w-pull']['example']='The rescuers pulled him out of the ice water a few minutes ago.'
W['w-pull']['exKo']='구조대가 몇 분 전에 얼음물에서 끌어냈어요.'
chg.append({'kind':'word','id':'w-pull','fields':['example'],'why':'v46 검토 결정 11 예외: 예시 문장이 12.5 en과 같아 새 en으로 맞춤'})
# 6.2 — on you
T='열사병'
S_(6,T,1,"We're putting cool packs and misting you to bring it down.",
   '`cool packs`에 `on you`가 빠져 있었다',
   en="We're putting cool packs on you and misting you to bring it down.",
   chunks=["We're putting",'cool packs on you','and misting you','to bring it down','.'])
ln=S[5]['order']['lines'][1]; assert ln['en']=="We're putting cool packs and misting you to bring it down."
ln['en']="We're putting cool packs on you and misting you to bring it down."
# 5.6 — 5.3과 거의 같은 문장
T='탈수 수분보충 교육'
S_(5,T,5,'Small sips are easier on your stomach than big gulps.',
   '5.3과 거의 같은 문장(조금씩 ↔ 벌컥)이라 큰 모금이 부르는 증상으로 달리 쓴다',
   en='Big gulps can upset your stomach and make you throw up.',
   ko='한꺼번에 많이 마시면 속이 불편해져서 토할 수 있어요.',
   chunks=['Big gulps','can upset your stomach','and make you','throw up','.'],
   words=['w-gulp'], decoy='last night',
   why='can upset으로 한꺼번에 마실 때 생길 수 있는 일을 알려요. 큰 모금이 위를 자극해 토하게 할 수 있어서 조금씩 마시라는 안내에 설득력이 생겨요.')
S[4]['sentences'][5]['blank']={'answer':'stomach','options':[{'en':'ankle'},{'en':'stomach'},{'en':'eyes'},{'en':'hair'}]}
# w-clothes distractor
W['w-clothes']['distractorsEn']=['clocks','closets']

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
c=yaml.safe_load(open(C)); c['changes'].extend(chg)
yaml.safe_dump(c,open(C,'w'),allow_unicode=True,sort_keys=False,width=10000)
