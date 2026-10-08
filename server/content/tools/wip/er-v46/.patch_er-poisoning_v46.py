import re,glob
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
files={f:open(f).read() for f in sorted(glob.glob(D+'add_er-poisoning_v46_*.yaml'))}
def rep(old,new):
    n=sum(t.count(old) for t in files.values()); assert n==1,(old,n)
    for f in files:
        if old in files[f]: files[f]=files[f].replace(old,new)
def edit(wp, a=None, o=None):
    hits=[(f,i) for f,t in files.items() for i,l in enumerate(t.split('\n')) if l.startswith('  - {t:') and ('w: "'+wp) in l]
    assert len(hits)==1,(wp,len(hits))
    f,i=hits[0]; L=files[f].split('\n'); l=L[i]
    m=re.search(r'a: "([^"]*)", o: \[([^\]]*)\]',l); assert m
    na=a if a is not None else m.group(1)
    no=o if o is not None else m.group(2)
    if isinstance(no,list): no=', '.join(f'"{x}"' for x in no)
    L[i]=l[:m.start()]+f'a: "{na}", o: [{no}]'+l[m.end():]
    files[f]='\n'.join(L)
rep('"어지러우면 눕지 말고 앉아 계세요"','"어지러우면 침대 머리를 올려 드릴게요"')
rep('"증상이 없는지 몇 시간 뒤에 다시 볼게요"','"몇 시간 뒤에 증상을 다시 확인할게요"')
rep('["리듬이 바뀌면 심장 초음파를 볼게요", "리듬이 바뀌면 보호자분께 알릴게요"]','["리듬이 바뀌면 약부터 다시 확인할게요", "리듬이 바뀌면 보호자분께 알릴게요"]')
rep('"지금은 너무 서두르지 않아도 돼요"','"지금은 천천히 이야기하셔도 돼요"')
rep('["미상 섭취, GCS 15, 상태 안정적입니다", "알려진 섭취, 활력징후 정상입니다"]','["가족이 가져온 약병을 확인 중입니다", "의사 호출은 이미 했습니다"]')
rep('["섭취 약물은 확인된 바 없습니다", "섭취는 어제 저녁이었습니다"]','["섭취는 어제 저녁이었다고 합니다", "섭취한 약은 아세트아미노펜이라고 합니다"]')
rep('["인수 때 말은 못 했습니다", "이송 중 열이 올랐습니다"]','["인수 때부터 열이 있었습니다", "이송 중 구토가 있었습니다"]')
rep('["마지막 혈압은 120에 80이었고 처치는 없었습니다", "마지막 맥박은 40이었고 아트로핀을 드렸습니다"]','["마지막 혈압은 120에 80이었습니다", "마지막 맥박은 40이었고 아트로핀을 드렸습니다"]')
rep('"Stay with me and tell me right away if you feel your heart racing or skipping."','"Stay with me and tell me if your heart races or skips."')
rep('"Last pressure was eighty over forty, and I gave a bicarb bolus.", icon: chartup','"His latest pressure was eighty over forty, and I gave a bicarb bolus.", icon: chartup')
E=[('What…and how much','much',['old','far','tall']),
('while I stay with으로','stay',['sleep','play','sit']),
('How many…and over','aspirin',['antibiotics','vitamins','antacids']),
('How much와 how many',None,['spend','owe','earn']),
('each step으로',None,['skip','delay','rush']),
("I'm giving으로",None,['increase','repeat','feed']),
('each thing으로',None,['ask','count','cover']),
('suggest로',None,['prove','deny','replace']),
('new…or supplement',None,['finish','refuse','skip']),
('a clue that으로',None,['gift','reward','joke']),
('the whole family로',None,['gift','cost','joke']),
('take over로',None,['burn','fold','bury']),
('while it can still help으로',None,['optional','tasty','painless']),
('not alone과',None,['busy','tired','bored']),
("don't add up으로",None,['wrong','rude','silly']),
('everything we might need로',None,['late','absent','missing']),
('may…but…으로',None,['once','rarely','briefly']),
('helps로 중탄산염이',None,['louder','weaker','sharper']),
('because로 서두르는',None,['slowly','quietly','lazily']),
('feel your heart…ing로',None,['want','keep','need']),
('any blood in…or',None,['sweat','tears','spit']),
('oxygen and alertness로',None,['height','weight','shoe size']),
('can mean으로',None,['prevent','cancel','fix']),
('until로 끝나는 기준을 시간이 아니라 몸의',None,['quit','pause','delay']),
('You did the right thing으로',None,['late','gently','quietly']),
("There's…we can give로",None,['better','calmer','smaller']),
('unstable로 상태를',None,['canceling','dropping','hiding']),
('핵심 정보를',None,['ignoring','delaying','abandoning']),
("I'm not here to로",None,['refuse','hate','fear']),
('숫자를 먼저',None,['rash','fracture','sprain']),
('목록 세 개를',None,['allergy','migraine','fracture'])]
for e in E: edit(*e)
for f,t in files.items(): open(f,'w').write(t)
print('patched')
