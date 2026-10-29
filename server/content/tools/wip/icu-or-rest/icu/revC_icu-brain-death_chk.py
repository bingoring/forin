import yaml,re,sys,collections
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v
d=yaml.safe_load(open('icu-brain-death.yaml'))
n=lambda s:len(s.replace(' ',''))
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        k=f"{si}.{j}"
        L=n(x['ko']); ds=x['distractorsKo']
        for t in ds:
            a=n(t)
            if a>L*1.25 and abs(a-L)>3: print('V20',k,t,a,L)
            if a<L/1.25 and abs(a-L)>3: print('V20short',k,t,a,L)
        if min(n(t) for t in ds)>L: print('BOTHLONGER',k,[n(t) for t in ds],L)
        if len(set(ds))<2 or x['ko'] in ds: print('DUP',k)
        b=x['blank']; a=b['answer']
        if x['en'].count(a)!=1: print('BLANKANS',k,a)
        dc=x['decoy']
        if dc in x['chunks'] or dc.lower() in x['en'].lower(): print('DECOY',k,dc)
        if x['icon'] not in v.NB_ICONS: print('ICON',k)
        if ' '.join(x['chunks']).replace(' .','.').replace(' ,',',')!=x['en'].replace(' .','.') and ''.join(x['chunks']).replace(' ','')!=x['en'].replace(' ',''): print('CHUNK',k)
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
print('표지가 오답 둘에만:',both)
# 낱말 길이(단어)
for w in d['words']:
    L=n(w['en']); 
    for t in w['distractorsEn']:
        if n(t)>L*1.25 and abs(n(t)-L)>3 or n(t)<L/1.25 and abs(n(t)-L)>3: print('WORD dEn',w['id'],t)
    Lk=n(w['ko'])
    for t in w['distractorsKo']:
        if n(t)>Lk*1.25 and abs(n(t)-Lk)>3 or n(t)<Lk/1.25 and abs(n(t)-Lk)>3: print('WORD dKo',w['id'],t)
