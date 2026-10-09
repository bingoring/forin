import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-genitourinary.yaml'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-genitourinary.yaml'
d=yaml.safe_load(open(P)); S=d['situations']; Wl=d['words']
chg=[]; R='v46 검토 결정 11 예외: '
T='남성 요폐(전립선)'
s=S[7]; assert s['title']==T
t=s['sentences'][2]; assert t['en']=='This will tell us how much urine is left inside.'
t.update(en='This will tell us how much urine is inside your bladder.',
 ko='이걸로 방광 안에 소변이 얼마나 있는지 알 수 있어요.',
 chunks=['This will tell us','how much urine','is inside','your bladder','.'],
 words=['w-tell','w-much','w-urine','w-inside','w-bladder'],
 why='This는 앞 문장의 스캔을 가리켜 검사의 목적을 풀어 줘요. how much…is inside는 방광에 지금 차 있는 소변량을 묻는 말이에요. 요폐에서는 이 양이 도뇨를 정하는 단서예요.')
chg.append({'kind':'sentence','situation':T,'index':2,'fields':['en','ko','chunks','words'],
 'why':R+'요폐(배뇨 전) 장면의 방광 스캔은 남은 양(left)이 아니라 방광에 찬 양을 재므로 `left`를 `inside your bladder`로'})
sw=[n for n in s['nuance'] if n['kind']=='swap'][0]
assert 'PVR' in sw['notes']
sw['notes']['PVR']='의료진끼리의 약어(post-void residual, 배뇨 후 남은 양). 환자는 모르고, 아직 소변을 못 보는 환자의 방광 용적에는 맞지도 않는다.'
sw['why']='방광 스캔은 휴대용 초음파기로 방광에 찬 소변량을 재요. PVR 같은 약어 대신 환자에게는 bladder scan이라고 하면 무엇을 하는지 바로 알아요.'
Wl.pop([w['id'] for w in Wl].index('w-left'))
chg.append({'kind':'word-remove','id':'w-left','why':R+'8.3이 `left`를 버려 쓰는 곳이 없어짐(남은 양=잔뇨는 이 장면의 뜻이 아님)'})
yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
c=yaml.safe_load(open(C)); c['changes'].extend(chg)
yaml.safe_dump(c,open(C,'w'),allow_unicode=True,sort_keys=False,width=10000)
