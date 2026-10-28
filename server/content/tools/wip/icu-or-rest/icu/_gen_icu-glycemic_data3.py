# fix-icu-glycemic-B.md 표 F(빈칸)·G(decoy)와 newko 사전에서 데이터 파일 3을 만든다.
import re, yaml, sys
sys.path.insert(0,'.')
txt=open('fix-icu-glycemic-B.md',encoding='utf-8').read()
f_part=txt.split('### F.')[1].split('### G.')[0]
g_part=txt.split('### G.')[1].split('### H.')[0]
blank={}
for line in f_part.splitlines():
    if not line.startswith('| ') or line.startswith('| 문장') or line.startswith('|---'): continue
    c=[x.strip() for x in line.strip().strip('|').split('|')]
    k,ans,opts=c[0],c[1],c[2]
    if '→' in ans: ans=ans.split('→')[1].strip()
    opts=re.split(r'\s*\(',opts,1)[0]
    o=[x.strip() for x in opts.split('/')]
    blank[k]={'answer':ans,'wrong':o}
decoy={}
for line in g_part.splitlines():
    if not line.startswith('| ') or line.startswith('| 문장') or line.startswith('|---'): continue
    c=[x.strip() for x in line.strip().strip('|').split('|')]
    for a in range(0,len(c),2):
        k,v=c[a],c[a+1]
        v=re.sub(r'^[◆◇]\s*','',v)
        decoy[k]=v
from newko_icu_glycemic_B import NEW
dko={f"{k}.{i}":v for (k,i),v in NEW.items()}
yaml.safe_dump({'blank':blank,'decoy':decoy,'dko':dko},open('fix_icu-glycemic_data_3.yaml','w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=10**9)
print(len(blank),len(decoy),len(dko))
