import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-fever-infection.yaml'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-fever-infection.yaml'
d=yaml.safe_load(open(P)); S=d['situations']; Wl=d['words']; W={w['id']:w for w in Wl}
chg=[]; R='v46 검토 결정 11 예외: '
def S_(n,title,idx,old,reason,**kw):
    s=S[n-1]; assert s['title']==title,(n,s['title']); t=s['sentences'][idx]; assert t['en']==old,t['en']
    f=[k for k in ('en','ko','chunks','words') if k in kw and kw[k]!=t[k]]
    t.update(kw)
    chg.append({'kind':'sentence','situation':title,'index':idx,'fields':f,'why':R+reason})
    return t
def order(n,idx,old,**kw):
    l=[x for x in S[n-1]['order']['lines'] if x['en']==old]; assert len(l)==1,old; l[0].update(kw)
def word(wid,reason,**kw):
    for k,v in kw.items(): W[wid][k]=v
    f=[k for k in kw if k in('en','ko','ipa','icon','example')]
    if f: chg.append({'kind':'word','id':wid,'fields':f,'why':R+reason})

# 20.0 (S21 idx0) — 수막구균은 비말 격리
T='고위험 감염 이송 인계'
S_(21,T,0,"Suspected meningococcemia — he's on airborne and contact precautions.",
   '수막구균혈증은 비말 격리(CDC)인데 공기·접촉 격리로 적혀 있었다',
   en="Suspected meningococcemia — he's on droplet precautions.",
   ko='수막구균혈증 의심 — 비말 격리 중입니다.',
   chunks=['Suspected meningococcemia',"— he's on",'droplet precautions','.'],
   words=['w-suspect','w-meningococcemia','w-droplet','w-precaution'],
   why='Suspected로 확진 전임을 먼저 밝히고 대시 뒤에 격리 상태를 이어요. 수막구균은 비말로 퍼져 비말 격리(droplet precautions)를 해요. 인계는 진단 의심과 현재 격리 조치를 첫 줄에 말해야 받는 쪽이 방과 보호구를 준비해요.')
for wid in('w-suspect','w-meningococcemia'):
    word(wid,'예문이 21.0 문장과 같아 새 en·ko로 맞춤',example="Suspected meningococcemia — he's on droplet precautions.",exKo='수막구균혈증 의심 — 비말 격리 중입니다.')
word('w-precaution','예문의 격리 종류가 21.0과 어긋나 비말 격리로 맞춤',example="He's on droplet precautions.",exKo='비말 격리 중입니다.')
# w-airborne 제거 (이 문장 말고는 쓰는 곳이 없음) + w-droplet 추가
i=[w['id'] for w in Wl].index('w-airborne')
assert 'w-airborne' not in str([x['words'] for s in S for x in s['sentences']])
Wl.pop(i)
chg.append({'kind':'word-remove','id':'w-airborne','why':R+'수막구균 격리를 비말로 고치면서 21.0 말고는 쓰는 곳이 없어 은행에서 뺌'})
Wl.insert(i,{'id':'w-droplet','en':'droplet','ipa':'/ˈdrɑːplət/','ko':'비말','icon':'shield',
 'example':"He's on droplet precautions, so please wear a mask.",'exKo':'비말 격리 중이시니 마스크를 써 주세요.',
 'cue':'기침·재채기로 튀는 침방울로 퍼지는 — 수막구균·독감의 격리 방식','tag':'격리',
 'distractorsEn':['dropper','triplet'],'distractorsKo':['공기매개','혈액매개'],'chips':[['drop','let']],'decoyChips':['drip','lot']})
chg.append({'kind':'word-add','id':'w-droplet','why':R+'21.0 격리 종류를 비말로 고치며 새 단어 추가'})
nz=S[20]['nuance'][0]; assert nz['kind']=='pair'
nz['words']=['w-droplet' if x=='w-contact' else x for x in nz['words']]
nz['pairs']=[['droplet','precautions'] if p==['contact','precautions'] else p for p in nz['pairs']]
nz['why']='굵은 정맥로는 large-bore IVs, 격리 조치는 droplet precautions 꼴로, 지금까지 들어간 양은 one liter of fluids so far로 인계해요.'

# 10.3 (S11 idx3) — within a minute
S_(11,'소아 고열 보호자',3,'Seizures like this look scary, but they usually stop on their own within a minute.',
   '`within a minute`은 과장된 안심(열성경련은 대개 몇 분 안)',
   en='Seizures like this look scary, but they usually stop on their own within a few minutes.',
   ko='이런 경련은 무서워 보이지만 보통 몇 분 안에 저절로 멈춰요.',
   chunks=['Seizures like this','look scary',', but they usually stop','on their own','within a few minutes','.'])
# 3.3 (S4 idx3) — thirty minutes
t=S_(4,'해열제 투여 설명',3,'This medicine will bring your fever down within thirty minutes or so.',
   '아세트아미노펜 효과는 30~60분이라 30분은 짧음',
   en='This medicine will bring your fever down within an hour or so.',
   ko='이 약은 한 시간쯤 안에 열을 내려줄 거예요.',
   chunks=['This medicine will','bring your fever','down','within an hour','or so','.'],
   decoy='for a week',
   why='within…or so로 정확한 시각 대신 대략의 범위를 말해 기대를 현실적으로 맞춰요. 먹는 약은 효과가 나타나기까지 시간이 걸려요.')
t['blank']={'answer':'medicine','options':[{'en':'medicine'},{'en':'pillow'},{'en':'window'},{'en':'towel'}]}
order(4,1,'It should start working within thirty minutes or so.',en='It should start working within an hour or so.',ko='한 시간쯤 안에 듣기 시작할 거예요')
word('w-within','예문의 30분도 같이 맞춤',example='This will bring your fever down within an hour.',exKo='이 약이 한 시간 안에 열을 내려 줄 거예요.')
# 15.2 / 18.4 — 수액 ko
S_(16,'호중구감소성 발열 패혈증',2,'Febrile neutropenia with sepsis — I need fluids running and a physician now.',
   '"수액을 흘리고"는 한국어로 어색',
   ko='발열성 호중구감소증에 패혈증까지 — 수액을 달고 의사가 지금 필요해요.')
S_(19,'독성쇼크증후군',4,'We need fluids running fast to bring your pressure back up.',
   '"수액을 빠르게 흘릴게요"는 한국어로 어색',
   ko='혈압을 다시 올리려고 수액을 빠르게 넣을게요.')
for wid in('w-run','w-up'):
    W[wid]['exKo']='혈압을 다시 올리려고 수액을 빠르게 넣을게요.'
# 8.3 (S9 idx3) — ko
S_(9,'인플루엔자 시즌 선별',3,'Everyone at your work having the flu makes this very likely.',
   '"이것도 그럴 가능성이 커요"는 어색',
   ko='직장 동료들이 다 독감이라면 독감일 가능성이 아주 커요.')
# 12.0 / 17.0 — concerns me about
S_(13,'수막염 의심 두통·발열',0,'The stiff neck with fever and headache concerns me about meningitis.',
   '`concerns me about`은 자연스러운 영어가 아니라 `makes me worried about`로',
   en='The stiff neck with fever and headache makes me worried about meningitis.',
   chunks=['The stiff neck','with fever and headache','makes me worried','about meningitis','.'],
   words=['w-stiff','w-neck','w-fever','w-headache','w-worry','w-meningitis'],
   decoy='since morning',
   why='makes me worried about으로 의료진의 걱정을 직접 말해 검사가 필요한 이유를 알려요. 목 뻣뻣함·열·두통은 수막염을 의심하는 대표 조합이라 서둘러 확인해요.')
order(13,0,'The stiff neck with fever and headache concerns me about meningitis.',en='The stiff neck with fever and headache makes me worried about meningitis.')
S_(18,'괴사성 근막염',0,'Pain this severe with a fever worries me about a deep infection.',
   '`worries me about`은 자연스러운 영어가 아니라 `makes me worried about`로',
   en='Pain this severe with a fever makes me worried about a deep infection.',
   chunks=['Pain this severe','with a fever','makes me worried','about a deep infection','.'],
   decoy='since morning',
   why='makes me worried about으로 의료진의 걱정을 솔직히 말해 왜 서두르는지 이유를 줘요. 겉보기보다 심한 통증에 열이 더해지면 깊은 조직 감염을 의심해요.')
order(18,0,'Pain this severe with a fever worries me about a deep infection.',en='Pain this severe with a fever makes me worried about a deep infection.')
word('w-worry','예문이 17.0 en과 같아 새 en으로 맞춤',example='Pain this severe with a fever makes me worried about a deep infection.',
     cue="의료진이 소견을 보고 불안한 마음을 솔직히 말할 때 — 'It makes me ___ed.'")
Wl.pop([w['id'] for w in Wl].index('w-concern'))
chg.append({'kind':'word-remove','id':'w-concern','why':R+'12.0이 `concerns me`를 버려 쓰는 곳이 없어짐; 12.0은 w-worry 태그로 바꿈'})

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
c=yaml.safe_load(open(C)); c['changes'].extend(chg)
yaml.safe_dump(c,open(C,'w'),allow_unicode=True,sort_keys=False,width=10000)
