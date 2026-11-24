import yaml,json,re
d=yaml.safe_load(open('icu-transport-procedure.yaml'))
T=[('원내 이송 전 안정성 평가',6),('이송 중 악화 대비 계획',3),('이송 중 발관·라인 이탈 위기',1),('이송 중 발관·라인 이탈 위기',5),
('검사실 안전',6),('MRI 중 응급상황 대응',1),('MRI 중 응급상황 대응',3),('시술 진정 중 활력·기도 감시',4),('베드사이드 시술 보조',2),('이송 중 산소·전원 소진 위기',1),
('병원간 이송 인계·문서',4),('시술 중 대량출혈 급변',6),('이송 위험-이익 판단 소통',3),('이송 중 심정지 대응',6),('이송 중 산소·전원 소진 위기',6),('이송 위험-이익 판단 소통',4),('병원간 이송 인계·문서',3),('MRI 중 응급상황 대응',4),('이송 중 악화 대비 계획',4),
('시술 진정 전 사정·동의',6),('이송 중 심정지 대응',2),('이송 중 악화 대비 계획',2)]
S={s['title']:s for s in d['situations']}
for t,i in T:
    x=S[t]['sentences'][i]; en=x['en']
    ex=[w['id'] for w in d['words'] if w['example']==en]
    o=S[t].get('order',{}); ol=[k for k,l in enumerate(o.get('lines',[])) if en in json.dumps(l,ensure_ascii=False)]
    print(t,i,'|',en,'| example:',ex,'| order lines:',ol,'| v46:',[k for k in x if k not in('en','ko','chunks','words','goal')])
# situation distinct words
for t in ['베드사이드 시술 보조','이송 중 산소·전원 소진 위기','인공호흡 환자 이송 관리','이송 중 발관·라인 이탈 위기','시술 중 대량출혈 급변','시술 진정 중 활력·기도 감시','MRI 중 응급상황 대응','이송 중 승압·주입 유지','이송 장비·산소·약물 준비','이송 중 악화 대비 계획']:
    ws=set(w for x in S[t]['sentences'] for w in x['words']); print('V3',t,len(ws))
for w in d['words']:
    if w['en'].lower() in w['ko'].lower(): print('KO=EN',w['id'],w['ko'])
for wid in ['w-evacuate','w-hold','w-supply','w-bag','w-respond','w-stimulation','w-reintubate','w-zone','w-reserve','w-pressor','w-brisk','w-unit']:
    w=[x for x in d['words'] if x['id']==wid][0]; print(wid,'example=',w['example'],'|',w['exKo'])
print(json.dumps(S['이송 중 발관·라인 이탈 위기'].get('order'),ensure_ascii=False)[:800])
