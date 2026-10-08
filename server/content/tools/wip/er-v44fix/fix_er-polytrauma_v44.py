import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _lib_v44fix_polyfive import *
f=Fx('er-polytrauma'); S=f.S; W=f.W
T=lambda n: S[n]['title']
# 15.4 사실: 긴장성 기흉은 압력이 차오름
t=f.sent(15,T(15),4,"We're moving fast because this side is losing pressure quickly.",'긴장성 기흉은 압력이 줄어드는 것이 아니라 차오른다(사실 거꾸로)',
  en="We're moving fast because the pressure on this side is building quickly.",
  ko='이쪽 압력이 빠르게 차오르고 있어서 서두르고 있어요.',
  chunks=["We're moving fast",'because the pressure','on this side','is building quickly','.'],
  words=['w-fast','w-side','w-pressure'],
  why='because로 서두르는 이유를 말하면 거친 손길도 급해서라고 이해돼요. 긴장성 기흉은 한쪽 가슴 안에 공기가 갇혀 압력이 계속 차오르고(building), 그 압력이 심장으로 돌아오는 피를 막아 쇼크로 가기 때문에 서둘러 압력을 빼야 해요.')
t['distractorsKo']=['이쪽 폐 사진을 지금 찍고 있어요','이쪽 가슴에 소독을 하고 있어요']
# 2.1 안전: 경추 확인 전 머리를 들게 하는 질문
t=f.sent(2,T(2),1,'Do you feel dizzy when you lift your head?','경추 확인 전 다발외상 환자에게 머리를 들게 하는 질문이라 지금 느낌만 묻도록 바꿈',
  en='Do you feel dizzy or lightheaded right now?',
  ko='지금 어지럽거나 머리가 핑 도는 느낌이 있으세요?',
  chunks=['Do you feel','dizzy','or lightheaded','right now','?'],
  words=['w-feel','w-dizzy'],
  why='right now를 붙이면 몸을 움직이게 하지 않고 지금 상태만 물어요. 경추를 확인하기 전의 다발외상 환자에게는 머리를 들게 하지 않아요. 가만히 있는데도 어지럽거나 핑 도는 느낌이 있으면 혈압이 떨어졌을 수 있다는 단서예요.')
t['distractorsKo']=['지금 목이 아프세요?','지금 구역질이 나세요?']
f.W['w-dizzy']['cue']='핑 도는 어지러운 느낌 — 실혈·저혈압을 짐작하게 하는 증상'
f.rm_word('w-lift','2.1에서 머리를 들게 하는 질문을 버려 w-lift를 쓰는 문장이 없어짐(예문 문장도 사라짐)')
for n in (2,):
    for nu in S[n]['nuance']:
        if 'words' in nu and 'w-lift' in nu['words']: nu['words']=[x for x in nu['words'] if x!='w-lift']
# order S2 L3
L=S[2]['order']['lines'][2]; assert L['en'].startswith("That's why I'm asking")
L['en']="That's why I'm asking: do you feel dizzy or lightheaded right now?"; L['ko']='그래서 묻는데, 지금 어지럽거나 머리가 핑 도는 느낌이 있으세요?'
f.chg.append({'kind':'sentence','situation':T(2),'index':-1,'fields':[],'why':'x'}); f.chg.pop()
# 14.3 안전: 응고를 떨어뜨리는 것은 저체온
f.sent(14,T(14),3,'Shivering can make it harder for your blood to clot.','응고를 떨어뜨리는 것은 저체온이고 떨림은 그 신호일 뿐이라 원인을 몸이 차가워지는 것으로 바로잡음',
  en='Getting cold can make it harder for your blood to clot.',
  ko='몸이 차가워지면 혈액이 응고되기가 더 어려워질 수 있어요.',
  chunks=['Getting cold can make it','harder','for your blood','to clot','.'],
  words=['w-cold','w-harder','w-blood','w-clot'],
  why='can make it harder로 단정하지 않고 어려워질 수 있다고 말해요. 몸이 차가워지면 피가 굳는 반응이 느려져 출혈이 멈추기 어려워요. 떨림은 체온이 떨어진다는 신호일 뿐이라 이 문장에서는 원인인 차가워짐을 말해요.')
t=S[14]['sentences'][3]; t['distractorsKo']=['몸이 차가워지면 호흡이 가빠질 수 있어요','몸이 차가워지면 맥박이 빨라질 수 있어요']
# 19.2 안전: 수술 동의는 외과의가 받음 (keyPhrase)
f.sent(19,T(19),2,'I need your consent to proceed immediately.','수술 동의는 외과의가 설명하고 받으므로 간호사가 받는 것처럼 말하지 않음',
  en='The surgeon needs your consent to proceed immediately.',
  ko='즉시 진행하려면 외과 의사가 보호자분의 동의를 받아야 해요.',
  chunks=['The surgeon needs','your consent','to proceed','immediately','.'],
  words=['w-need','w-consent','w-proceed','w-immediately'],
  why='The surgeon needs your consent로 동의를 받는 사람이 외과의라고 분명히 해요. 수술의 위험과 방법은 외과의가 설명하고 동의를 받으며, 간호사는 보호자가 이해했는지 돕고 확인해요. 보호자를 구할 시간이 없는 응급에서는 응급 예외로 진행하기도 해요.')
# 8.4 문법·뜻
f.sent(8,T(8),4,"Please tell me every medication you're taking, even the small dose ones.",'`small dose ones`가 어색한 영어라 even the ones in small doses로 고침',
  en="Please tell me every medication you're taking, even the ones in small doses.",
  chunks=['Please tell me','every medication',"you're taking,",'even the ones','in small doses','.'],
  why="even the ones in small doses로 적은 양이라고 빼놓지 않게 미리 막아요. 소량의 아스피린이나 보충제도 출혈에 영향을 줄 수 있어서 전부 알아야 해요.")
# 16.4 words
f.add_word({'id':'w-respond','en':'respond','ipa':'/rɪˈspɑːnd/','ko':'반응하다','icon':'speech',
  'example':"You're barely responding, but we're right here with you.",'exKo':'거의 반응이 없으시지만, 저희가 바로 곁에 있어요.',
  'cue':"부르거나 자극하는 말에 환자가 얼마나 반응하는지 말할 때 — 'barely ___ing'",'tag':'의식 확인',
  'distractorsEn':['report','respect'],'distractorsKo':['보고하다','존중하다'],'chips':[['re','spond']],'decoyChips':['ri','sped']},
  'w-open','16.4에 `words: []`라 반응 정도를 말하는 핵심 낱말 respond를 단어 은행에 더해 태그함')
f.sent(16,T(16),4,"You're barely responding, but we're right here with you.",'words가 비어 있어 respond를 태그함',words=['w-respond'])
# 대시를 넘는 청크
D=[(0,1,["Take",'a deep breath','for me','— does it hurt','to breathe','?']),
 (1,0,["Please don't move",'your neck','— hold still','for me','.']),
 (2,2,['Your heart rate','is high',"— we're watching you",'closely','.']),
 (6,1,['You look pale',"— we're watching for",'internal bleeding','.']),
 (15,2,['Stay with me',"— we're helping you",'breathe','.']),
 (16,2,['Stay with me','— open','your eyes','if you can','.']),
 (17,0,['Continue compressions','— checking for','tension pneumothorax','.']),
 (17,3,['Pulse check','now','— hold compressions','.']),
 (17,4,['Switching compressors','— continue at','the same rate','.']),
 (18,4,['Watching for','internal bleeding','— next scan','in an hour','.'])]
for n,idx,ch in D:
    old=S[n]['sentences'][idx]['en']; assert '—' in old and ' — ' not in old
    f.sent(n,T(n),idx,old,'대시를 넘는 청크라 대시 앞뒤에 공백을 두고 대시에서 조각을 나눔(내용 같음)',en=old.replace('—',' — '),chunks=ch)
f.finish()
