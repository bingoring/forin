import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _lib_v44fix_polyfive import *
f=Fx('er-shock'); S=f.S; W=f.W
T=lambda n: S[n]['title']
ICONS={x['icon'] for s in S for x in s['sentences']}
# 9.1 (keyPhrase)
f.sent(9,T(9),1,"We're watching your urine output as a good sign.",'영어·한국어 모두 어색한 `as a good sign`을 `for signs that you\'re improving`으로 바꿈',
  en="We're watching your urine output for signs that you're improving.",
  ko='소변량을 보면서 몸이 나아지고 있는지 지켜보고 있어요.',
  chunks=["We're watching",'your urine output','for signs',"that you're improving",'.'],
  words=['w-watch','w-urine','w-output','w-sign','w-improve'],
  blank={'answer':'improving','options':[{'en':'improving'},{'en':'sleeping'},{'en':'leaving'},{'en':'drinking'}]},
  why="for signs that…으로 소변량을 보는 이유를 나아지는 신호를 찾는 일이라고 같이 알려요. 소변량은 신장으로 가는 혈류, 즉 장기 관류가 회복되는지 보여 주는 지표예요.")
W['w-sign']['cue']="몸이 보내는 객관적 단서 — 'for ___s that you're improving'"
# 11.4
f.sent(11,T(11),4,"Let's ask if you missed a dose or took extra medicine.",'환자에게 직접 묻는 자리에서 `Let\'s ask`는 제3자에게 묻자는 말로 들려 `Can I ask`로 바꿈',
  en='Can I ask if you missed a dose or took extra medicine?',
  ko='약을 거르셨거나 추가로 더 드셨는지 여쭤봐도 될까요?',
  chunks=['Can I ask','if you missed','a dose or','took extra medicine','?'],
  why='Can I ask if …?로 물어봐도 되는지 허락을 구하는 모양이라 추궁하는 느낌을 피해요. 약을 거르거나 더 먹은 경우 모두 응고 수치에 영향을 줘서 둘 다 물어요.')
# 19.2 ko (keyPhrase는 그대로)
f.sent(19,T(19),2,'Give fluids and consider a pressor and atropine.','en은 명령인데 ko가 진행·제안이라 뜻이 어긋나 ko를 명령으로 맞춤',
  ko='수액을 주고, 승압제와 아트로핀도 고려하세요.')
# 21.3
f.sent(21,T(21),3,"Steroids can't just stop suddenly without a plan.",'주어가 어긋나(스테로이드가 스스로 멈춤) 환자를 주어로 바꿈',
  en="You can't just stop steroids suddenly without a plan.",
  chunks=["You can't",'just stop steroids','suddenly','without a plan','.'])
# 20.2, 20.4
f.sent(20,T(20),2,'I recommend ICU admission and central monitoring now.','`central monitoring`은 중앙 원격 모니터로 읽히기 쉬워 `close monitoring`으로 바꿈',
  en='I recommend ICU admission and close monitoring now.',
  chunks=['I recommend','ICU admission','and close monitoring','now','.'],
  words=['w-recommend','w-icu','w-admission','w-monitor'])
f.sent(20,T(20),4,'I think she needs central monitoring in the ICU now.','`central monitoring`은 중앙 원격 모니터로 읽히기 쉬워 `close monitoring`으로 바꿈',
  en='I think she needs close monitoring in the ICU now.',
  chunks=['I think','she needs','close monitoring','in the ICU now','.'],
  words=['w-think','w-need','w-monitor','w-icu'])
L=S[20]['order']['lines'][3]; assert 'central monitoring' in L['en']; L['en']=L['en'].replace('central','close')
f.rm_word('w-central','20.2·20.4와 S20 order에서 central monitoring을 버려 쓰는 문장이 없어짐')
# 21.4
f.sent(21,T(21),4,"We'll give hydrocortisone now to help prevent a crisis.",'이미 부신위기 저혈압인 상황이라 위기를 막는다가 아니라 위기를 치료한다고 바꿈',
  en="We'll give hydrocortisone now to treat the crisis.",
  ko='위기를 치료하려고 지금 하이드로코르티손을 드릴게요.',
  chunks=["We'll give hydrocortisone",'now','to treat','the crisis','.'],
  words=['w-give','w-hydrocortisone','w-crisis'],
  why='to treat로 약의 목적을 알려요. 이미 부신위기로 혈압이 떨어진 상태라, 모자란 코르티솔을 바로 채워 위기를 치료해요.')
# 겹치는 쌍 — 뜻이 겹치는 뒤쪽 문장을 같은 상황에서 새 내용으로
f.sent(3,T(3),4,"We'll watch how much you drink and give small sips slowly.",'3.2와 뜻이 겹쳐 낙상 예방 안내로 바꿈',
  en='Call us before you stand up, because you may feel dizzy.',
  ko='일어나시기 전에 저희를 불러 주세요, 어지러우실 수 있어요.',
  chunks=['Call us','before you stand up',', because you','may feel dizzy','.'],
  words=['w-call','w-stand','w-dizzy'],
  tag='낙상 예방',icon='shield',decoy='at night',
  distractorsKo=['소변량을 기록할게요','수액이 다 들어가면 알려 드릴게요'],
  blank={'answer':'dizzy','options':[{'en':'dizzy'},{'en':'hungry'},{'en':'bored'},{'en':'busy'}]},
  why='Call us before…로 혼자 일어나지 말고 먼저 부르라고 해요. because로 이유를 붙이면 지시가 걱정으로 들려요. 탈수로 혈압이 낮을 때는 일어설 때 어지러워 쓰러지기 쉬워서 낙상을 막아요.')
for nu in S[3]['nuance']:
    if nu.get('words') and 'w-drink' in nu['words']: nu['words']=[x for x in nu['words'] if x!='w-drink']
f.sent(7,T(7),4,"Let's listen to your heart and lungs now.",'7.2와 뜻이 겹쳐 가슴 압박감이 심해지면 알려 달라는 말로 바꿈',
  en='Tell me right away if the pressure in your chest gets worse.',
  ko='가슴 압박감이 더 심해지면 바로 말씀해 주세요.',
  chunks=['Tell me right away','if the pressure','in your chest','gets worse','.'],
  words=['w-chest','w-pressure'],
  tag='악화 알림',icon='siren',decoy='at night',
  distractorsKo=['심전도는 곧 끝나요','가슴 소리를 들어 볼게요'],
  blank={'answer':'worse','options':[{'en':'worse'},{'en':'better'},{'en':'lighter'},{'en':'calmer'}]},
  why='right away로 지체 없이 알리라고 하고 if the pressure in your chest gets worse로 환자가 직접 느끼는 변화를 기준으로 줘요. 심인성 쇼크에서는 가슴 압박감이 심해지는 것이 심장 상태가 나빠진다는 신호일 수 있어 바로 팀에 알려야 해요.')
f.sent(16,T(16),4,'Call the team and prepare for possible thrombolytics.','16.2와 뜻이 겹쳐 폐색전 의심 환자의 다리를 문지르지 말라는 말로 바꿈',
  en="Don't rub his swollen leg, and keep it still.",
  ko='부은 다리는 문지르지 말고 가만히 두세요.',
  chunks=["Don't rub",'his swollen leg',', and keep','it still','.'],
  words=['w-swell','w-leg','w-still'],
  tag='다리 주의',icon='shield',decoy='for ten minutes',
  distractorsKo=['다리 둘레를 재 주세요','양쪽 다리 맥박을 확인해 주세요'],
  blank={'answer':'rub','options':[{'en':'rub'},{'en':'bend'},{'en':'wrap'},{'en':'lift'}]},
  why="Don't rub으로 하지 말아야 할 일을 먼저 짚고 and keep it still로 해야 할 일을 붙여요. 다리 깊은 정맥에 혈전이 있으면 문지르거나 주물 때 떨어져 나가 폐로 갈 수 있어서, 폐색전이 의심될 때는 부은 다리를 건드리지 않아요.")
f.sent(19,T(19),3,'His slow heart rate and low pressure suggest neurogenic shock.','19.0과 뜻이 겹쳐 신경성 쇼크의 체온 조절 장애에 대한 지시로 바꿈',
  en="He can't keep himself warm, so watch his temperature.",
  ko='스스로 체온을 유지하지 못하니 체온을 지켜보세요.',
  chunks=["He can't keep",'himself warm',', so watch','his temperature','.'],
  words=['w-keep','w-warm','w-watch'],
  tag='체온 관리',icon='bulb',decoy='this morning',
  distractorsKo=['열이 나니 해열제를 준비하세요','체온 대신 맥박을 지켜보세요'],
  blank={'answer':'temperature','options':[{'en':'temperature'},{'en':'pulse'},{'en':'diet'},{'en':'vision'}]},
  why='so로 이유와 할 일을 한 문장에 이어요. 신경성 쇼크에서는 교감신경이 끊겨 혈관과 체온 조절이 안 돼서 체온이 떨어지기 쉬워, 체온을 계속 확인하고 보온해요.')
# 청크
for n,idx,ch in [(15,1,['Get','broad-spectrum antibiotics in','within the hour','.']),
  (18,0,['Activate','the massive transfusion protocol','now','.']),
  (0,3,['Your','blood pressure','is a little low','right now','.']),
  (3,0,['Losing','that much fluid','can lower','your blood pressure','.']),
  (10,3,["It's okay",'to feel nervous','about','a new medicine','.'])]:
    f.sent(n,T(n),idx,S[n]['sentences'][idx]['en'],'구를 끊는 청크(`in within / the hour`, `massive / transfusion protocol`, `Your blood / pressure`, `about a new / medicine`)를 구 경계로 다시 나눔',chunks=ch)
# 새 문장에 없는 단어의 예문 — 같은 주제의 다른 문장으로
for wid in getattr(f,'needs',[]):
    for s in S:
        hit=[x for x in s['sentences'] if wid in x['words'] and x['en']!=W[wid]['example']]
        if hit: W[wid]['example']=hit[0]['en']; W[wid]['exKo']=hit[0]['ko']; print('  ->',wid,hit[0]['en']); f.wwhy=getattr(f,'wwhy',{}); f.wwhy[wid]='예문이 문장 en과 같았으나 그 문장이 바뀌어 단어가 빠져, 이 낱말이 든 다른 문장으로 바꿈'; break
f.finish()
