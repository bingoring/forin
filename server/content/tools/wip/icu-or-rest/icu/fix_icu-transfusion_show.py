import yaml,sys
sys.path.insert(0,'.')
d=yaml.safe_load(open('icu-transfusion.pre-fix.yaml'))
from revB_icu_transfusion_vals import KO,BLANK,DECOY,ICON,WHY
for k in sys.argv[1:]:
    si,j=map(int,k.split('.')); x=d['situations'][si]['sentences'][j]
    print('=====',k,d['situations'][si]['title'])
    for f in ['en','ko','chunks','words','tag','icon','why','decoy','distractorsKo','blank']: print(' ',f,':',x[f] if f!='blank' else (x[f]['answer'],[o['en'] for o in x[f]['options']]))
    print('  B-new: KO',KO.get(k,[None,None])[:2],'BLANK',BLANK.get(k,[None,None])[:2],'DECOY',DECOY.get(k,[None])[0],'ICON',ICON.get(k,[None,None])[1],'WHY',WHY.get(k))
