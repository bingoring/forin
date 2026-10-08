import yaml, glob
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
files=sorted(glob.glob(D+'add_er-genitourinary_v46_*.yaml'))
data={f:yaml.safe_load(open(f)) for f in files}
idx={}
for f,sits in data.items():
    for s in sits: idx[s['title']]=s
# (title, sentence idx): (answer or None, options)
P={
 ('요관결석'[:0]+'신산통(요관결석)',5):('wait',['pay','apply','push']),
 ('급성 신우신염',2):(None,['after','without','instead of']),
 ('급성 신우신염',3):(None,['skin','lung','bone']),
 ('남성 요폐(전립선)',5):('relieve',['measure','record','increase']),
 ('고환염전 청소년',3):('quickly',['slowly','randomly','quietly']),
 ('고환염전 청소년',4):('calling',['avoiding','forgetting','ignoring']),
 ('카테터 관련 요로감염',0):(None,['charge','control','trouble']),
 ('카테터 관련 요로감염',3):('catheter',['dressing','bandage','sheet']),
 ('혈뇨+항응고제',3):('take',['miss','skip','refill']),
 ('혈뇨+항응고제',4):(None,['types','cells','vessels']),
 ('투석 환자 응급',3):('days',['hours','weeks','months']),
 ('투석 환자 응급',5):('removed',['added','given','stored']),
 ('결석+구토 탈수',1):('medicine',['insulin','oxygen','blood']),
 ('결석+구토 탈수',2):('urine',['stool','saliva','sweat']),
 ('결석+구토 탈수',3):('down',['up','out','away']),
 ('결석+구토 탈수',4):('last',['first','next','never']),
 ('결석+구토 탈수',5):('Once',['Before','Unless','Although']),
 ('임신 중 신우신염',2):(None,['gender','name','birthday']),
 ('임신 중 신우신염',4):('monitor',['ignore','skip','forget']),
 ('폐쇄성 요로감염 패혈증',2):(None,['annual','optional','elective']),
 ('고칼륨혈증 위기(무뇨)',0):(None,['X-ray','MRI','EEG']),
 ('고칼륨혈증 위기(무뇨)',1):(None,['slightly','mildly','barely']),
 ('고칼륨혈증 위기(무뇨)',4):('affect',['improve','repair','cure']),
 ('고칼륨혈증 위기(무뇨)',5):('closely',['rarely','hardly','never']),
 ('신부전 폐부종',0):('oxygen',['fluids','insulin','antibiotics']),
 ('신부전 폐부종',3):(None,['harder','slower','tougher']),
 ('외상성 방광파열',0):(None,['surgery','holiday','wedding']),
 ('외상성 방광파열',1):(None,['sedation','anesthesia','oxygen']),
}
for (t,j),(a,o) in P.items():
    n=idx[t]['s'][j]
    if a: n['a']=a
    n['o']=o
# order tweak
for l in idx['신성 위기 급변 인계']['order']['lines']:
    if l['en'].startswith('With those numbers'):
        l['en']="With that amount and those numbers, I'm going to call the on-call doctor now."
        l['ko']="그 양과 수치를 가지고 지금 당직 의사에게 연락할 거예요"
# decoy dedupe
seen={}
ALT=['by morning','for the nurse','in the hallway','next visit','at triage','over the phone','this week','on the monitor','during rounds','at the bedside','after the scan','for now']
used=set()
allsent=[(s['title'],j,n) for f in files for s in data[f] for j,n in enumerate(s['s'])]
cnt={}
for t,j,n in allsent: cnt[n['d']]=cnt.get(n['d'],0)+1
k=0
seen={}
for t,j,n in allsent:
    d=n['d']
    if cnt[d]>1:
        seen[d]=seen.get(d,0)+1
        if seen[d]>1:
            n['d']=ALT[k%len(ALT)]; k+=1
for f in files:
    yaml.safe_dump(data[f],open(f,'w'),allow_unicode=True,sort_keys=False,width=1000)
