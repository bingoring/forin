import yaml, glob, sys
T='icu-cardiogenic'
base=yaml.safe_load(open(f'base-{T}.yaml',encoding='utf-8'))
data={}
for f in sorted(glob.glob(f'add_{T}_A_words_*.yaml')):
    for e in yaml.safe_load(open(f,encoding='utf-8')):
        for k,v in e.items():
            if isinstance(v,list):
                for x in v:
                    if isinstance(x,list):
                        for y in x: assert isinstance(y,str),(e['id'],y)
                    else: assert isinstance(x,str),(e['id'],x)
        assert 'w-'+e['id'] not in data, e['id']
        data['w-'+e['id']]=e
nuance=yaml.safe_load(open(f'add_{T}_A_nuance.yaml',encoding='utf-8'))
REMOVE={'now','hand','doctor','nurse','family','minute','hour','time','today','morning','day','know','come'}
REMOVE={'w-'+r for r in REMOVE}
HEAD={ # id: (en, ipa)
 'w-fail':('fail','/feɪl/'),'w-overwork':('overwork','/ˌoʊvərˈwɜːrk/'),'w-lower':('lower','/ˈloʊər/'),'w-slip':('slip','/slɪp/'),
 'w-rupture':('rupture','/ˈrʌptʃər/'),'w-alarm':('alarm','/əˈlɑːrm/'),'w-stop':('stop','/stɑːp/'),'w-call':('call','/kɔːl/'),
 'w-stay':('stay','/steɪ/'),'w-arrive':('arrive','/əˈraɪv/'),'w-inotrope':('inotrope','/ˈɪnoʊˌtroʊp/'),
 'w-compression':('compression','/kəmˈprɛʃən/'),'w-send':('send','/sɛnd/'),'w-secure':('secure','/sɪˈkjʊr/'),
 'w-recover':('recover','/rɪˈkʌvər/'),'w-hope':('hope','/hoʊp/'),'w-fit':('fit','/fɪt/'),'w-matter':('matter','/ˈmætər/')}
KO={'w-get':'확보하다','w-clear':'물러나다'}
sen={x['en']:x['ko'] for s in base['situations'] for x in s['sentences']}
words=[];changes=[]
for w in base['words']:
    if w['id'] in REMOVE:
        changes.append({'kind':'word-remove','id':w['id'],'why':'너무 쉬움 — 간호사가 이미 아는 말이라 STEP 1에서 뺀다(공통 쉬운 단어 목록)'}); continue
    d=data.pop(w['id'])
    o=dict(w); fields=[]
    if w['id'] in HEAD:
        o['en'],o['ipa']=HEAD[w['id']]; fields+=['en','ipa']
    if w['id'] in KO:
        o['ko']=KO[w['id']]; fields.append('ko')
    if fields:
        why={'ko':'뜻이 문장과 맞게'}
        changes.append({'kind':'word','id':w['id'],'fields':fields,'why':('활용형 헤드워드를 원형으로' if 'en' in fields else 'ko를 문장 속 뜻에 맞게')})
    o['exKo']=sen[w['example']]
    o['cue']=d['cue']; o['tag']=d['tag']
    o['distractorsEn']=d['en2']; o['distractorsKo']=d['ko2']
    o['chips']=d['chips']; o['decoyChips']=d['dc']
    words.append(o)
assert not data, list(data)
out={'theme':T,'words':words,'situations':[]}
for i,s in enumerate(base['situations']):
    ns={'title':s['title'],'sentences':[]}
    for j,x in enumerate(s['sentences']):
        y=dict(x); keep=[t for t in x['words'] if t not in REMOVE]
        if keep!=x['words']:
            y['words']=keep
            changes.append({'kind':'sentence','situation':s['title'],'index':j,'fields':['words'],'why':'쉬운 단어 태그 빼기'})
        ns['sentences'].append(y)
    ns['nuance']=nuance[i]
    out['situations'].append(ns)
yaml.safe_dump(out,open(f'{T}.A.yaml','w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=1000)
yaml.safe_dump({'theme':T,'changes':changes},open(f'changes-{T}.yaml','w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=1000)
print(len(words),'words',len(changes),'changes')
