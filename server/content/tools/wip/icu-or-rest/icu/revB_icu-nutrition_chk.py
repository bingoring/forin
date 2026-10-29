import yaml,re,sys,collections,copy
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools'); sys.path.insert(0,'.')
import verify_lesson_content as v
from revB_icu_nutrition_vals import KO,BLANK,DECOY,ICON,ORDER
mode=sys.argv[1] if len(sys.argv)>1 else 'new'
d=yaml.safe_load(open('icu-nutrition.yaml'))
n=lambda s:len(re.sub(r'\s','',s))
MK=[r'면\b',r'려고',r'전에?\b',r'앞서',r'도록',r'위해',r'(후|뒤)',r'자마자',r'면서|하며|주며',r'함께',r'따로',r'때\b']
if mode=='new':
  for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        k=f"{si}.{j}"
        if k in KO: x['distractorsKo']=[a if a is not None else b for a,b in zip(KO[k][:2],x['distractorsKo'])]
        if k in BLANK:
            a,opts,_=BLANK[k]; x['blank']={'answer':a or x['blank']['answer'],'options':[{'en':o} for o in opts]}
        if k in DECOY: x['decoy']=DECOY[k][0]
        if k in ICON: x['icon']=ICON[k][1]
  for si,li,en,ko,_ in ORDER:
      d['situations'][si]['order']['lines'][li-1].update(en=en,ko=ko)
both=[];v20=[];longer=[]
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        k=f"{si}.{j}"
        ds=x['distractorsKo']
        for t in ds:
            if v.length_tell(x['ko'],t): v20.append(k)
        if min(n(t) for t in ds)>n(x['ko']): longer.append(k)
        if len(set(ds))<2 or x['ko'] in ds: print('DUP',k)
        b=x['blank']; a=b['answer']
        if len(re.findall(r'(?<![\w-])'+re.escape(a)+r'(?![\w-])',x['en']))!=1: print('BLANKANS',k,a)
        if a not in [o['en'] for o in b['options']] or len({o['en'] for o in b['options']})!=4: print('BLANKOPT',k)
        dc=x['decoy']
        if dc in x['chunks'] or dc.lower() in x['en'].lower(): print('DECOY',k,dc)
        if x['icon'] not in v.NB_ICONS: print('ICON',k)
        anymk=[any(re.search(m,t) and not re.search(m,x['ko']) for m in MK) for t in ds]
        if all(anymk): both.append(k)
    for l in s['order']['lines']:
        if len(l['en'].split())>15: print('ORDERLEN',si,l['en'])
        if l['icon'] not in v.NB_ICONS: print('ICON order',si)
print('V20:',v20); print('오답 둘 다 정답보다 김:',longer); print('표지가 오답 둘에만:',both)
seeds=[{'sentences':[x for s in d['situations'] for x in s['sentences']]}]
print('W18-21:',v.check_theme_repetition(seeds))
cnt=collections.Counter();where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        for t in x['distractorsKo']:
            for st in v._ko_stems(t)-v._ko_stems(x['ko']): cnt[st]+=1;where[st].append(f'{si}.{j}')
print('ko-only stems top:',[(a,c,where[a]) for a,c in cnt.most_common(10)])
bw=collections.Counter();dw=collections.Counter()
STOP=set('the a an to of and for his her my your in on at with is it'.split())
for s in d['situations']:
    for x in s['sentences']:
        ans=x['blank']['answer'].lower()
        for o in x['blank']['options']:
            if o['en'].lower()!=ans: bw[o['en'].lower()]+=1
        for w in re.findall(r"[a-z']+",x['decoy'].lower()):
            if w not in STOP: dw[w]+=1
print('blank wrong top:',bw.most_common(8)); print('decoy words top:',dw.most_common(10))
