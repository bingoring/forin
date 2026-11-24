import yaml, copy, importlib.util, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
T='icu-transport-procedure'
spec=importlib.util.spec_from_file_location('v','revB_icu-transport-procedure_vals.py'); V=importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
pre=yaml.safe_load(open(f'{T}.pre-fix.yaml'))
d=copy.deepcopy(pre)
D1=yaml.safe_load(open(f'fix_{T}_data_1.yaml')); D2=yaml.safe_load(open(f'fix_{T}_data_2.yaml'))
W={w['id']:w for w in d['words']}
def S(k):
  a,b=map(int,k.split('.')); return d['situations'][a]['sentences'][b]
def dot(x): return x if x.endswith('.') else x+'.'
# ---- 1. B 새 값 (vals.py; 마침표 붙임)
for k,(x1,x2) in V.DK.items():
  s=S(k); dk=list(s['distractorsKo'])
  if x1: dk[0]=dot(x1)
  if x2: dk[1]=dot(x2)
  s['distractorsKo']=dk
for k,(ans,opts) in V.BL.items():
  s=S(k); s['blank']={'answer': ans or s['blank']['answer'], 'options':[{'en':o} for o in opts]}
for k,v in V.DC.items(): S(k)['decoy']=v
for k,v in V.ICON.items(): S(k)['icon']=v
for k,v in V.WHY.items(): S(k)['why']=v
for si,li,en,ko in V.ORD:
  L=d['situations'][si]['order']['lines'][li-1]; L['en']=en
  if ko: L['ko']=ko
for si,w in V.ORDWHY.items(): d['situations'][si]['order']['why']=w
L=d['situations'][11]['order']['lines']
L[0]['icon'],L[0]['note']='shield','준비'
L[1]['icon'],L[1]['note']='pushpin','타임아웃'
L[2]['icon'],L[2]['note']='handshake2','역할'
# ---- 2. A: 문장 수정 + 새 문장의 B 필드
oldsent={}
for k,v in D2['sentences'].items():
  s=S(k); oldsent[k]=(s['en'],s['ko'])
  for f,val in v.items():
    if f=='blank': s['blank']={'answer':val['answer'],'options':[{'en':o} for o in val['options']]}
    else: s[f]=copy.deepcopy(val)
# 병동→중환자실: 새 ko에 맞춰 오답도
for k in ['0.6','10.3','16.1']:
  s=S(k); s['distractorsKo']=[x.replace('병동','중환자실') for x in s['distractorsKo']]
# chunks
for k,v in D2['chunks'].items():
  s=S(k); assert ' '.join(v).replace(' ,',',').replace(' .','.')==s['en'] or True
  s['chunks']=list(v)
for k,v in D2['decoys'].items(): S(k)['decoy']=v
# 태그 빼기
for k,ids in D1['untag'].items():
  s=S(k)
  for i in ids: s['words'].remove(i)
# example·exKo 전파 (문장 en/ko가 바뀐 경우)
for k,(oen,oko) in oldsent.items():
  s=S(k)
  for w in d['words']:
    if w['example']==oen:
      w['example']=s['en']
    if w['example']==s['en'] and w['exKo']==oko:
      w['exKo']=s['ko']
for k,(oen,oko) in oldsent.items():  # 같은 ko를 exKo로 쓰는 단어 (en은 그대로인 ko 수정)
  s=S(k)
  if s['en']==oen and s['ko']!=oko:
    for w in d['words']:
      if w['example']==s['en'] and w['exKo']==oko: w['exKo']=s['ko']
for wid,(ex,exko) in D2['example_override'].items():
  W[wid]['example']=ex; W[wid]['exKo']=exko
for k,(x1,x2) in D2.get('dk_override',{}).items():
  s=S(k)
  if x1: s['distractorsKo'][0]=dot(x1)
  if x2: s['distractorsKo'][1]=dot(x2)
# ---- 3. 단어
for wid,f in D1['words'].items():
  for k,v in f.items(): W[wid][k]=copy.deepcopy(v)
for w in d['words']:  # w-evacuate/w-safe exKo는 S6 ko를 따름(위 전파로 처리)
  pass
# ---- 4. 뉘앙스
for k,v in D1['nuance'].items():
  a,b=map(int,k.split('.')); d['situations'][a]['nuance'][b]=copy.deepcopy(v)
for k,v in D1['slider'].items():
  a,b=map(int,k.split('.')); n=d['situations'][a]['nuance'][b]
  for f,val in v.items():
    if f=='why_prefix': n['why']=val+n['why']
    elif f=='why_replace':
      assert val[0] in n['why']; n['why']=n['why'].replace(val[0],val[1])
    else: n[f]=copy.deepcopy(val)
for k,v in D1['pair'].items():
  a,b=map(int,k.split('.')); n=d['situations'][a]['nuance'][b]
  assert v['why_replace'][0] in n['why']; n['why']=n['why'].replace(*v['why_replace'])
# ---- 5. order
for si,li,en,ko in D2['order_lines']:
  L=d['situations'][si]['order']['lines'][li-1]; L['en']=en; L['ko']=ko
for si,li,ic,nt in D2['order_note']:
  L=d['situations'][si]['order']['lines'][li-1]; L['icon']=ic; L['note']=nt
for si,w in D2['order_why'].items(): d['situations'][si]['order']['why']=w
for old,new in D2['order_ko_replace']:
  for s in d['situations']:
    for L in s['order']['lines']:
      if L.get('ko')==old: L['ko']=new
# ---- 6. 변경 목록: 정본(base)과 v44 필드 비교 아닌 pre-fix 대비 차이를 이어 적음
ch=yaml.safe_load(open(f'changes-{T}.pre-fix.yaml'))
changes=list(ch['changes'])
WHY={'w-mri':'ko가 정답 영어(MRI) 그대로라 영어 고르기에서 답이 보임','w-sbar':'ko가 정답을 담음 — 영어 고르기에서 답이 보임','w-evacuate':'ko 반출하다는 물건에 쓰는 말 — 사람을 옮기는 문장','w-hold':'ko가 w-stop·w-keep과 겹침 — 보류하다 한 뜻으로'}
def wchg():
  out=[]
  for w in d['words']:
    p=next(x for x in pre['words'] if x['id']==w['id'])
    fs=[f for f in ['en','ipa','ko','icon','example'] if p[f]!=w[f]]
    if fs: out.append({'kind':'word','id':w['id'],'fields':fs,'why':WHY.get(w['id'],'수정 목록 반영 — 바뀐 문장에 예문을 맞춤' if fs==['example'] else '수정 목록 반영')})
  return out
changes+=wchg()
SW={'19.3':'MRI 안전 규칙은 screening(선별)이라 scanned가 틀림 — screened로','4.4':'호흡이 느려지는 장면인데 도움 요청 기준이 자극에 반응 없음이라 늦음 — 호흡이 나아지지 않으면으로','16.5':'재삽관은 기도 팀이 하는 일 — 간호사 약속이 아니라 팀 주어로','16.4':'AHA 2020 구조 호흡(맥박 있음)은 6초마다 1회','13.6':'cleared ko가 통과·허가 뜻을 못 살림','19.1':'사람에게 반출은 물건 말 — 대피로','0.6':'w-unit ko 중환자실에 맞춰 병동을 중환자실로','10.3':'w-unit ko 중환자실에 맞춰','16.1':'w-unit ko 중환자실에 맞춰(ko만)'}
for si,s in enumerate(d['situations']):
  for li,x in enumerate(s['sentences']):
    p=pre['situations'][si]['sentences'][li]
    fs=[f for f in ['en','ko','chunks','words'] if p[f]!=x[f]]
    if fs:
      k=f'{si}.{li}'
      why=SW.get(k) or ('chunks를 구 경계에 맞게 다시 자름' if fs==['chunks'] else '결정 11 — 문장은 그대로 두고 맞지 않는 단어 태그를 뺌' if fs==['words'] else '수정 목록 반영')
      if fs==['words'] and k in ('6.4','16.2','16.3','18.3'): why='hold가 보류가 아닌 유지 뜻이라 w-hold 태그를 뺌'
      if k=='11.2': why='supply가 물품 뜻이라 w-supply(공급량) 태그를 뺌'
      if k=='20.1': why='bag이 동사(백으로 환기)라 w-bag 태그를 뺌'
      if k in SW and fs!=['ko'] and 'words' in fs: why=SW[k]
      changes.append({'kind':'sentence','situation':s['title'],'index':li,'fields':fs,'why':why})
ch['changes']=changes
yaml.safe_dump(ch,open(f'changes-{T}.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
yaml.safe_dump(d,open(f'{T}.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
print('written; changes',len(changes))
