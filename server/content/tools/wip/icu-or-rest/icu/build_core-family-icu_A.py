import yaml, copy
class L(yaml.SafeLoader): pass
class D(yaml.SafeDumper): pass
def rep(d,data): return d.represent_scalar('tag:yaml.org,2002:str',data,style=None)
D.add_representer(str, lambda d,s: d.represent_scalar('tag:yaml.org,2002:str',s))
base=yaml.safe_load(open('base-core-family-icu.yaml'))
W={}
for i in (1,2,3): W.update(yaml.load(open(f'add_core-family-icu_A_words_{i}.yaml'),L))
N={}
for i in (1,2): N.update(yaml.load(open(f'add_core-family-icu_A_nuance_{i}.yaml'),L))
RM={'time','day','home','room','body','doctor','family','know','see','come','say','tell','think','want','help','feel','need','people','person'}
KO={'w-rate':'속도·율','w-level':'수준','w-sense':'이치','w-support':'지원','w-wish':'~하면 좋겠다','w-respond':'반응을 보이다','w-result':'검사 결과','w-outcome':'최종 결과','w-update':'최신 소식','w-social':'사회복지의','w-worker':'종사자','w-get':'마련해 주다','w-look':'살펴보다','w-rush':'서두름'}
out=copy.deepcopy(base); changes=[]
rmids={'w-'+r for r in RM}
for s in out['situations']:
  for i,x in enumerate(s['sentences']):
    new=[w for w in x['words'] if w not in rmids]
    if new!=x['words']:
      gone=[w for w in x['words'] if w in rmids]
      x['words']=new
      changes.append({'kind':'sentence','situation':s['title'],'index':i,'fields':['words'],'why':'쉬운 단어 태그 빼기: '+', '.join(gone)})
  assert s['title'] in N, s['title']
  s['nuance']=N[s['title']]
used={w for s in out['situations'] for x in s['sentences'] for w in x['words']}
nw=[]
for w in out['words']:
  if w['id'] not in used:
    changes.append({'kind':'word-remove','id':w['id'],'why':'너무 쉬움 — 어느 문장도 태그하지 않게 됐다'}); continue
  a=W[w['id']]
  if w['id'] in KO:
    w['ko']=KO[w['id']]
    changes.append({'kind':'word','id':w['id'],'fields':['ko'],'why':'ko 정확히/은행 안 같은 뜻 구분'})
  w.update({'cue':a['cue'],'exKo':a['exKo'],'tag':a['tag'],'distractorsEn':a['dEn'],'distractorsKo':a['dKo'],'chips':a['chips'],'decoyChips':a['dec']})
  nw.append(w)
out['words']=nw
yaml.dump(out,open('core-family-icu.A.yaml','w'),Dumper=D,allow_unicode=True,sort_keys=False,width=1000)
yaml.dump({'theme':'core-family-icu','changes':changes},open('changes-core-family-icu.yaml','w'),Dumper=D,allow_unicode=True,sort_keys=False,width=1000)
print(len(nw),len(changes))
