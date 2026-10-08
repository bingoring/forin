import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _fixlib_p1 import Fix
f=Fix('er-arrhythmia')
def chk(si,k,en): assert f.sent(si,k)['en']==en,(si,k,f.sent(si,k)['en'])
def replace_all(obj,old,new):
    n=0
    if isinstance(obj,dict):
        for k,v in obj.items():
            if isinstance(v,str):
                if old in v: obj[k]=v.replace(old,new); n+=1
            else: n+=replace_all(v,old,new)
    elif isinstance(obj,list):
        for i,v in enumerate(obj):
            if isinstance(v,str):
                if old in v: obj[i]=v.replace(old,new); n+=1
            else: n+=replace_all(v,old,new)
    return n

# 15.2 (keyPhrase) feel -> get : 15.4/order와 모순 해소
chk(15,2,"You'll feel a quick shock while you're sedated — we're right here.")
f.set_sentence(15,2,'"충격을 느낀다"가 15.4·order(진정 중엔 느끼지도 기억하지도 못함)와 모순되어 "충격을 받는다"로 바꿈(keyPhrase)',
    en="You'll get a quick shock while you're sedated — we're right here.",
    ko='진정된 상태에서 짧은 전기 충격을 받으실 텐데 — 저희가 바로 옆에 있을게요.',
    chunks=["You'll get",'a quick shock',"while you're sedated","— we're right here",'.'],
    words=['w-shock','w-sedate'])
# 20.0 (keyPhrase) 환자 이름 + 넓은 QRS
chk(20,0,'Situation: bed 2 just converted to a wide-complex tachycardia.')
OLD_EN='Situation: bed 2 just converted to a wide-complex tachycardia.'
NEW_EN='Situation: Mrs. Lopez in bed 2 just converted to a wide-complex tachycardia.'
f.set_sentence(20,0,'침상 번호만으로 환자를 가리키지 않게 이름을 더하고, "광범위 QRS"(오역)를 "넓은 QRS"로 바로잡음(keyPhrase)',
    en=NEW_EN,
    ko='상황: 2번 침상 로페즈 환자분이 방금 넓은 QRS 빈맥으로 전환됐습니다.',
    chunks=['Situation: Mrs. Lopez in bed 2','just converted','to a wide-complex','tachycardia','.'])
s=f.sent(20,0)
s['distractorsKo']=['배경: 로페즈 환자분은 심장 병력이 있습니다','평가: 로페즈 환자분은 안정적입니다']
old_tail='실제 보고에서는 환자 이름으로 누구인지 밝혀요(침상 번호는 위치일 뿐이에요).'
assert old_tail in s['why']
s['why']=s['why'].replace(old_tail,'환자 이름과 침상 번호를 함께 말해야 누구인지 틀리지 않아요(침상 번호만으로는 환자가 바뀌어도 알기 어려워요).')
n=replace_all(f.sit(20).get('order'),OLD_EN,NEW_EN)+replace_all(f.sit(20).get('nuance'),OLD_EN,NEW_EN)
n+=replace_all(f.sit(20).get('order'),'상황: 2번 침상 환자가 방금 광범위 QRS 빈맥으로 전환됐습니다','상황: 2번 침상 로페즈 환자분이 방금 넓은 QRS 빈맥으로 전환됐습니다')
n+=replace_all(f.sit(20).get('nuance'),'상황: 2번 침상 환자가 방금 광범위 QRS 빈맥으로 전환됐습니다','상황: 2번 침상 로페즈 환자분이 방금 넓은 QRS 빈맥으로 전환됐습니다')
print('S20 nuance/order replaced',n)
# 16.1 ko
chk(16,1,'Stay with me — are you still with us?')
f.set_sentence(16,1,'직역투 ko를 자연스러운 말로',ko='정신 놓지 마세요 — 제 말 들리세요?')
# 14.5
chk(14,5,"Let's keep monitoring both of you closely for the next while.")
f.set_sentence(14,5,'"for the next while"은 미국에서 드문 표현이라 "for a while"로',
    en="Let's keep monitoring both of you closely for a while.",
    chunks=["Let's keep monitoring",'both of you','closely','for a while','.'])
s=f.sent(14,5)
s['why']="keep …ing로 지금 하는 일을 이어 간다고 알려요. for a while은 정확한 시간을 정하지 않고 '당분간'이라고 말하는 표현이에요."
# 6.1 (keyPhrase) fast-acting
chk(6,1,"If that doesn't work, we'll give a fast medicine through your IV.")
OLD='If that doesn\'t work, we\'ll give a fast medicine through your IV.'
f.set_sentence(6,1,'미국 현장에서는 "a fast medicine"이 아니라 "a fast-acting medicine"이라 바로잡음(keyPhrase)',
    en="If that doesn't work, we'll give a fast-acting medicine through your IV.",
    chunks=["If that doesn't work,","we'll give",'a fast-acting medicine','through your IV','.'])
s=f.sent(6,1)
s['blank']={'answer':'fast-acting','options':[{'en':x} for x in ['slow-acting','daily','weekly','fast-acting']]}
print('S6 order',replace_all(f.sit(6)['order'],"a fast medicine","a fast-acting medicine"))
# 21.1
chk(21,1,'We\'ll give medicine to calm your heart and the shocks.')
f.set_sentence(21,1,'"calm … the shocks"가 어색해 "calm your heart and stop the shocks"로',
    en="We'll give medicine to calm your heart and stop the shocks.",
    ko='심장을 진정시키고 충격을 멈추게 하는 약을 드릴게요.',
    chunks=["We'll give",'medicine','to calm your heart','and stop the shocks','.'])
# 17.0 (keyPhrase)
chk(17,0,'I need to flag that you have WPW to the team right away.')
OLD17="I need to flag that you have WPW to the team right away."
NEW17="I'm flagging your WPW right away so the whole team knows."
f.set_sentence(17,0,'환자에게 하는 말로 업무 말투("I need to flag that you have … to the team")를 쉬운 말로(keyPhrase)',
    en=NEW17,
    ko='WPW가 있다는 걸 지금 바로 표시해서 팀 모두가 알게 할게요.',
    chunks=["I'm flagging",'your WPW','right away','so the whole team knows','.'])
s=f.sent(17,0)
s['why']="I'm flagging …은 지금 하고 있는 일을 알리는 말이에요. so the whole team knows로 이유를 붙여 환자가 이 표시가 자신을 위한 것임을 알게 해요. WPW처럼 치료 선택에 영향을 주는 진단은 팀 전체가 알도록 바로 공유하는 것이 안전해요."
print('S17 order',replace_all(f.sit(17)['order'],OLD17,NEW17),replace_all(f.sit(17)['order'],'WPW가 있다는 걸 팀에 바로 알려야 해요','WPW가 있다는 걸 지금 바로 표시해서 팀 모두가 알게 할게요'))
# 17.4 — 17.0과 겹치는 쌍 해소: 환자에게 부탁하는 문장으로
chk(17,4,"I'm making sure everyone on the team knows about your WPW right away.")
f.set_sentence(17,4,'17.0과 같은 말·같은 빈칸이 두 번 나와 환자에게 직접 부탁하는 문장으로 바꿈',
    en='Please tell every new member of the team that you have WPW.',
    ko='새로 오는 팀원마다 WPW가 있다고 꼭 말씀해 주세요.',
    chunks=['Please tell','every new member','of the team','that you have WPW','.'],
    words=['w-team'])
s=f.sent(17,4)
s['tag']='직접 말하기'; s['icon']='speech'
s['why']="Please tell …로 환자에게 정중히 부탁해요. 교대나 호출로 새 사람이 올 때 정보가 끊기기 쉬워서, 환자도 직접 한 번 더 알려 주면 위험한 약을 막는 데 도움이 돼요."
s['decoy']='right now'
s['distractorsKo']=['WPW라고 적힌 팔찌를 채워 드릴게요','다른 병원에서도 같은 진단을 받으셨어요?']
s['blank']={'answer':'new','options':[{'en':x} for x in ['new','busy','tired','young']]}
# 11.4 — 11.2와 겹치는 쌍 해소
chk(11,4,'Missing even a few doses can let the abnormal rhythm return.')
f.set_sentence(11,4,'11.2와 같은 말·같은 조립이 두 번 나와, 증상이 돌아오면 연락하라는 문장으로 바꿈',
    en='Please call us right away if the irregular rhythm comes back.',
    ko='불규칙한 리듬이 다시 돌아오면 바로 연락 주세요.',
    chunks=['Please call us','right away','if the irregular rhythm','comes back','.'],
    words=['w-rhythm','w-irregular'])
s=f.sent(11,4)
s['tag']='재발 시 연락'; s['icon']='bell'
s['why']='if로 어떤 경우에 연락할지 조건을 분명히 말해요. 약을 거른 뒤 불규칙한 리듬이 돌아오면 미루지 말고 알려야 해서 right away를 붙여요.'
s['decoy']='at the clinic'
s['distractorsKo']=['복용 알람을 같이 설정해 드릴게요','다음 진료 날짜를 잡아 드릴게요']
s['blank']={'answer':'irregular','options':[{'en':x} for x in ['irregular','calm','slow','normal']]}
f.save()
