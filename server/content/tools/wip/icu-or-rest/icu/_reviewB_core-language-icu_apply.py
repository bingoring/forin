import yaml,re
import importlib.util as u;sp=u.spec_from_file_location("v","_reviewB_core-language-icu_vals.py");v=u.module_from_spec(sp);sp.loader.exec_module(v);DK,BL,DC=v.DK,v.BL,v.DC
d=yaml.safe_load(open('core-language-icu.yaml'))
def ns(x): return len(re.sub(r'\s','',x))
for si,s in enumerate(d['situations']):
  for k,t in enumerate(s['sentences']):
    key=f"{si}.{k}"; end=t['ko'][-1] if t['ko'][-1] in '.?' else ''
    if key in DK:
      for i,v2 in enumerate(DK[key]):
        if v2 is not None: t['distractorsKo'][i]=v2+end
      a,b=(ns(z) for z in t['distractorsKo']);n=ns(t['ko'])
      bad=[z for z in t['distractorsKo'] if ns(z)>n*1.25 and abs(ns(z)-n)>3 or ns(z)*1.25<n and abs(ns(z)-n)>3]
      flag=' LEN!' if bad else ''
      flag+=' BOTHLONGER' if a>n and b>n else ''
      if flag: print(key,n,a,b,flag)
    if key in BL:
      ans,opts=BL[key]; assert len(re.findall(r'\b'+re.escape(ans)+r'\b',t['en']))==1,(key,ans)
      t['blank']={'answer':ans,'options':[{'en':o} for o in opts]}
    if key in DC: t['decoy']=DC[key]
yaml.safe_dump(d,open('_reviewB_core-language-icu_chk/core-language-icu.yaml','w'),allow_unicode=True,sort_keys=False,width=200)
print('written')
