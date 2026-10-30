import yaml,re,importlib.util
spec=importlib.util.spec_from_file_location('v','revB_icu-mobility-prevention_vals.py'); V=importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
d=yaml.safe_load(open('icu-mobility-prevention.yaml'))
def S(k):
  a,b=map(int,k.split('.')); return d['situations'][a]['sentences'][b]
dot=lambda t: t if t.endswith(('.','?','!')) else t+'.'
for k,(x1,x2) in V.DK.items():
  s=S(k); dk=list(s['distractorsKo'])
  if x1: dk[0]=dot(x1)
  if x2: dk[1]=dot(x2)
  s['distractorsKo']=dk
for k,(ans,opts) in V.BL.items():
  s=S(k); a=ans or s['blank']['answer']
  assert len(re.findall(r'\b'+re.escape(a)+r'\b',s['en']))==1,(k,a)
  assert a in opts and len(set(opts))==4,(k,opts)
  s['blank']={'answer':a,'options':[{'en':o} for o in opts]}
for k,v in V.DC.items():
  s=S(k); assert v not in s['en'] and v not in s['chunks'],(k,v); s['decoy']=v
for k,v in V.ICON.items(): S(k)['icon']=v
for k,v in V.WHY.items(): S(k)['why']=v
for si,li,en,ko,note in V.ORD:
  L=d['situations'][si]['order']['lines'][li-1]; L['en']=en; L['ko']=ko
  if note: L['note']=note
L=d['situations'][19]['order']['lines']; L[2]['icon'],L[3]['icon']='pager','magnify'
for (si,li),ic in V.ORDICON.items(): d['situations'][si]['order']['lines'][li-1]['icon']=ic
for si,w in V.ORDWHY.items(): d['situations'][si]['order']['why']=w
yaml.safe_dump(d,open('revB_icu-mobility-prevention_new.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
print('written')
