import yaml,sys,copy,re
sys.path.insert(0,'.')
from importlib import import_module
V=import_module('revB_icu-transport-procedure_vals'.replace('-','_')) if False else None
import importlib.util
spec=importlib.util.spec_from_file_location('v','revB_icu-transport-procedure_vals.py'); V=importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
d=yaml.safe_load(open('icu-transport-procedure.yaml'))
def S(k):
  a,b=map(int,k.split('.')); return d['situations'][a]['sentences'][b]
for k,(x1,x2) in V.DK.items():
  s=S(k); dk=list(s['distractorsKo'])
  if x1: dk[0]=x1
  if x2: dk[1]=x2
  s['distractorsKo']=dk
for k,(ans,opts) in V.BL.items():
  s=S(k); s['blank']={'answer': ans or s['blank']['answer'], 'options':[{'en':o} for o in opts]}
for k,v in V.DC.items(): S(k)['decoy']=v
for k,v in V.ICON.items(): S(k)['icon']=v
for k,v in V.WHY.items(): S(k)['why']=v
for si,li,en,ko in V.ORD:
  L=d['situations'][si]['order']['lines'][li-1]; L['en']=en
  if ko: L['ko']=ko
for si,w in getattr(V,'ORDWHY',{}).items(): d['situations'][si]['order']['why']=w
# S11 reorder: old L2(tray) becomes L1, time-out L2, role L3
if True:
  L=d['situations'][11]['order']['lines']
  icons={'tray':'shield','to':'pushpin','role':'handshake2'}
  L[0]['icon'],L[0]['note']='shield','준비'
  L[1]['icon'],L[1]['note']='pushpin','타임아웃'
  L[2]['icon'],L[2]['note']='handshake2','역할'
yaml.safe_dump(d,open('revB_icu-transport-procedure_new.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
print('written')
