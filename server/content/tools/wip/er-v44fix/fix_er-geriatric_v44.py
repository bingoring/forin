import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-geriatric.yaml'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-geriatric.yaml'
d=yaml.safe_load(open(P)); S=d['situations']; Wl=d['words']; W={w['id']:w for w in Wl}
chg=[]; R='v46 검토 결정 11 예외: '
def S_(n,title,idx,old,reason,**kw):
    s=S[n-1]; assert s['title']==title,(n,s['title']); t=s['sentences'][idx]; assert t['en']==old,t['en']
    f=[k for k in ('en','ko','chunks','words') if k in kw and kw[k]!=t[k]]
    t.update(kw)
    chg.append({'kind':'sentence','situation':title,'index':idx,'fields':f,'why':R+reason})
    return t
def title(n): return S[n-1]['title']
# 10.1 — 지킬 수 없는 비밀 보장
t=S_(11,title(11),1,"You're safe to talk with me — nothing leaves this room without your say.",
  '지킬 수 없는 비밀 보장(노인 학대 의심 시 APS 신고 의무)을 약속하지 않고, 누가 더 알아야 하는지 솔직히 알린다',
  en="You're safe to talk with me — I'll be honest about who else needs to know.",
  ko='여기서는 안전하게 말씀하셔도 돼요 — 누가 더 알아야 하는지는 솔직하게 말씀드릴게요.',
  chunks=["You're safe",'to talk with me',"— I'll be honest",'about who else','needs to know','.'],
  words=['w-safe','w-need'],
  why="You're safe to talk with me로 말해도 안전하다는 느낌을 먼저 줘요. 미국에서는 노인 학대가 의심되면 병원 지침과 주법에 따라 보고해야 할 수 있어서, 비밀 보장을 약속하지 않고 I'll be honest about who else needs to know로 누가 더 알아야 하는지를 정직하게 알려요.")
# 19.4 — NPO
t=S_(20,title(20),4,'Drink some water to help stay hydrated before surgery.',
  '금식(NPO)은 마취팀이 정하므로 간호사는 물을 권하지 않고 마셔도 되는지 확인하겠다고 말한다',
  en='Let me check if you can drink water to stay hydrated before surgery.',
  ko='수술 전에 수분 유지를 위해 물을 드셔도 되는지 확인해 볼게요.',
  chunks=['Let me check','if you can drink water','to stay hydrated','before surgery','.'],
  decoy='for a week',
  why='Let me check if…로 물을 마셔도 되는지 먼저 확인하겠다고 말해요. 수술을 기다리는 환자의 금식 여부는 마취팀 지시가 정하므로 간호사는 확인하기 전에는 물을 권하지 않고, 마셔도 된다는 확인이 나온 뒤에 수분 유지를 안내해요.')
t['blank']={'answer':'check','options':[{'en':'check'},{'en':'cancel'},{'en':'refuse'},{'en':'forget'}]}
# 19.5 — keep you moving
S_(20,title(20),5,"Let's keep you moving and oriented while you wait.",
  '`keep you moving`은 고관절 골절 환자에게 움직임을 권하는 말로 읽힌다',
  en="Let's keep you oriented and engaged while you wait.",
  ko='기다리시는 동안 지남력을 유지하고 계속 이야기 나누며 지내시도록 도와드릴게요.',
  chunks=["Let's keep you",'oriented','and engaged','while you wait','.'],
  why='oriented는 날짜와 있는 곳을 아는 상태를, engaged는 말을 걸어 대화에 계속 함께하는 것을 가리켜요. 수술 전 고관절 골절 환자는 골절 부위를 고정하고 움직임을 제한하므로, 간호사가 실제로 하는 일은 말을 걸어 지남력을 유지하는 쪽이에요.')
# 8.4 — ko
S_(9,title(9),4,'This combination may be making you unsteady on your feet.',
  '"다리 힘을 불안정하게 만들고"가 어색',
  ko='이 약 조합 때문에 걸을 때 휘청거리실 수 있어요.')
W['w-unsteady']['exKo']='이 약 조합 때문에 걸을 때 휘청거리실 수 있어요.'
# 10.1에서 빠진 단어: 쓰는 곳이 없어짐
assert 'w-leave' not in str([x['words'] for s in S for x in s['sentences']])
for wid in ('w-leave','w-say'):
    Wl.pop([w['id'] for w in Wl].index(wid))
    chg.append({'kind':'word-remove','id':wid,'why':R+'10.1에서 비밀 보장 표현(leave·say)을 버려 쓰는 곳이 없어짐'})
yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
c=yaml.safe_load(open(C)); c['changes'].extend(chg)
yaml.safe_dump(c,open(C,'w'),allow_unicode=True,sort_keys=False,width=10000)
