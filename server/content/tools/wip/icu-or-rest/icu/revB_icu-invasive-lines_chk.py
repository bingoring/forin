import yaml,re,sys,collections
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools'); sys.path.insert(0,'.')
import verify_lesson_content as v
from revB_icu_invasive_lines_vals import DK,BLANK,DECOY,ICON
d=yaml.safe_load(open('icu-invasive-lines.yaml'))
n=lambda s:len(s.replace(' ',''))
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        k=f"{si}.{j}"
        if k in DK:
            x['distractorsKo']=[a if a is not None else b for a,b in zip(DK[k],x['distractorsKo'])]
        if k in BLANK:
            b=BLANK[k]; x['blank']={'answer':b.get('answer',x['blank']['answer']),'options':[{'en':o} for o in b['options']]}
        if k in DECOY: x['decoy']=DECOY[k]
        if k in ICON: x['icon']=ICON[k]
        L=n(x['ko']); ds=x['distractorsKo']
        for t in ds:
            a=n(t)
            if a>L*1.25 and abs(a-L)>3: print('V20',k,t,a,L)
        if min(n(t) for t in ds)>L: print('BOTHLONGER',k,[n(t) for t in ds],L)
        if len(set(ds))<2 or x['ko'] in ds: print('DUP',k)
        b=x['blank']; a=b['answer']
        if not re.search(r'(?<![\w-])'+re.escape(a)+r'(?![\w-])',x['en']) or x['en'].count(a)!=1: print('BLANKANS',k,a)
        if a not in [o['en'] for o in b['options']] or len({o['en'] for o in b['options']})!=4: print('BLANKOPT',k)
        dc=x['decoy']
        if dc in x['chunks'] or dc.lower() in x['en'].lower(): print('DECOY',k,dc)
        if x['icon'] not in v.NB_ICONS: print('ICON',k)
seeds=[{'sentences':[x for s in d['situations'] for x in s['sentences']]}]
for c,m in v.check_theme_repetition(seeds): print(c,m)
cnt=collections.Counter()
for s in d['situations']:
    for x in s['sentences']:
        for t in x['distractorsKo']:
            for st in v._ko_stems(t)-v._ko_stems(x['ko']): cnt[st]+=1
print('top stems',cnt.most_common(12))
MK=[r'면\b',r'려고',r'전에?\b',r'앞서',r'도록',r'위해',r'(후|뒤)',r'자마자',r'면서|하며|주며',r'함께',r'따로']
both=[]
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        for m in MK:
            if not re.search(m,x['ko']) and all(re.search(m,t) for t in x['distractorsKo']): both.append((f"{si}.{j}",m))
        anymk=[any(re.search(m,t) and not re.search(m,x['ko']) for m in MK) for t in x['distractorsKo']]
        if all(anymk): both.append((f"{si}.{j}",'각기 다른 표지'))
print('표지가 오답 둘에만:',both)
