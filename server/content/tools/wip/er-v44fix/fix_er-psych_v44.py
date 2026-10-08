import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _lib_v44fix_polyfive import *
f=Fx('er-psych'); S=f.S; W=f.W
T=lambda n: S[n]['title']
# 1.1 자살 선별 질문 (keyPhrase)
t=f.sent(0,T(0),0,'Have you had any thoughts of hurting yourself?','자살 사고 선별 장면인데 자해를 물어 `ending your life`로 분명히 물음',
  en='Have you had any thoughts of ending your life?',
  ko='삶을 끝내려는 생각이 든 적이 있나요?',
  chunks=['Have you had','any thoughts','of ending','your life','?'],
  words=['w-thought'],tag='자살 질문',
  why="any thoughts of로 행동이 아니라 '생각'부터 물어요. ending your life처럼 분명한 말로 물어야 위험을 놓치지 않아요. 자살을 직접 묻는다고 그 생각을 심어 주지 않아요.")
# 18.6 병상
f.sent(17,T(17),5,"We're doing everything possible to get a bed for both of you.",'병상은 환자 것이라 `a bed for both of you`를 `a bed as soon as possible`로 바꿈',
  en="We're doing everything we can to get a bed as soon as possible.",
  ko='병상을 최대한 빨리 구하려고 할 수 있는 모든 걸 하고 있어요.',
  chunks=["We're doing",'everything we can','to get a bed','as soon as possible','.'],
  words=['w-do','w-everything','w-possible','w-get','w-bed'],
  why='everything we can로 노력의 범위를 말하되 as soon as possible이라 시간을 약속하지는 않아요. 언제 날지 모르는 병상을 두고 지킬 수 있는 말만 해요.')
# 8.4 홀딩
f.sent(7,T(7),3,'We have to assess you before we can let you go.','억류 중인 환자에게 평가 뒤 내보낸다고 약속하는 말로 읽혀, 평가가 먼저이고 다음 단계는 그 뒤에 이야기한다고 바꿈',
  en="The doctor will assess you first, and then we'll talk about next steps.",
  ko='먼저 의사 선생님이 평가하고, 그다음 다음 단계를 이야기해요.',
  chunks=['The doctor will assess you','first',', and then',"we'll talk",'about next steps','.'],
  words=['w-assess','w-first','w-next','w-step'],
  why='will assess you first로 결정 전에 평가가 먼저라는 순서를 알려요. 보호 중인 환자에게 평가가 끝나면 나간다고 약속하지 않고, 평가 뒤 다음 단계를 이야기한다고만 말해요.')
# 13.5 시터
f.sent(12,T(12),4,"They're not here to watch you like a punishment.",'시터는 실제로 곁에 있으므로 감시가 아니라고 부정하지 않고 안전을 위해 곁에 있다고 말함(환자에게 watch는 감시로 들림)',
  en="They'll stay with you to keep you safe, not as a punishment.",
  ko='안전을 지키려고 곁에 있는 것이지, 벌로 그러는 게 아니에요.',
  chunks=["They'll stay",'with you','to keep you safe',', not as','a punishment','.'],
  words=['w-stay','w-keep','w-safe','w-punishment'],
  blank={'answer':'safe','options':[{'en':'safe'},{'en':'sorry'},{'en':'busy'},{'en':'quiet'}]},
  why='to keep you safe로 곁에 머무는 목적을 안전이라고 말하고, not as a punishment로 벌이 아니라고 덧붙여요. 시터는 실제로 곁에 있으므로 감시가 아니라고 부정하지 않고 왜 곁에 있는지를 솔직히 말해요. 환자에게 watch you는 감시처럼 들려서 stay with you를 써요. 1:1 관찰을 벌로 느끼면 위축되고 숨기게 돼요.')
for nu in S[12]['nuance']:
    if nu.get('words') and 'w-watch' in nu['words']: nu['words']=[x for x in nu['words'] if x!='w-watch']
# 10.4 귀가
t=f.sent(9,T(9),3,'I want to double-check a few things before you go home.','자살 위험을 부정하는 환자에게 귀가를 전제하지 않고 먼저 확인한다고 바꿈',
  en='I want to double-check a few things with you first.',
  ko='먼저 몇 가지만 같이 다시 확인하고 싶어요.',
  chunks=['I want to double-check','a few things','with you','first','.'],
  tag='확인 요청',icon='check',decoy='your medications',
  blank={'answer':'things','options':[{'en':'things'},{'en':'minutes'},{'en':'people'},{'en':'rooms'}]},
  why='with you first로 확인이 먼저라는 순서를 말해요. 자살 위험을 부정하는 환자도 위험을 다시 확인하고, 퇴원 결정은 평가 뒤에 의사가 해요.')
W['w-thought']['cue']=W['w-thought']['cue'].replace('hurting yourself','ending your life').replace('자해를 떠올린 적이 있는지','삶을 끝낼 생각을 한 적이 있는지')
for wid in getattr(f,'needs',[]):
    if wid in('w-hurt','w-watch'): continue
    for s in S:
        hit=[x for x in s['sentences'] if wid in x['words'] and x['en']!=W[wid]['example']]
        if hit: W[wid]['example']=hit[0]['en']; W[wid]['exKo']=hit[0]['ko']; f.wwhy=getattr(f,'wwhy',{}); f.wwhy[wid]='예문이 문장 en과 같았으나 그 문장이 바뀌어 단어가 빠져, 이 낱말이 든 다른 문장으로 바꿈'; print('  ->',wid,hit[0]['en']); break
f.rm_word('w-watch','13.5에서 watch를 버리고 S13 context 카드의 태그도 뺐더니 쓰는 곳이 없어짐(예문도 옛 13.5 문장)')
f.word('w-hurt','단독 예문이 바뀐 1.1 문장이라 hurt가 든 다른 문장(수단 접근 질문)으로 바꿈',example='Do you have access to anything you could use to hurt yourself?',exKo='자해에 쓸 만한 것에 접근할 수 있나요?')
f.finish()
