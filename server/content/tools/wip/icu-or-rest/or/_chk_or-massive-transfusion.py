import yaml,re,collections,sys
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v
d=yaml.safe_load(open('or-massive-transfusion.yaml'))
cnt=collections.Counter(); where=collections.defaultdict(list)
wcnt=collections.Counter(); wwhere=collections.defaultdict(list)
def toks(t): return re.findall(r'[가-힣]+',t)
bad=[]
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        k=f'{si}-{j}'
        mine=v._ko_stems(x['ko'])
        mt=set(toks(x['ko']))
        L=lambda t:len(re.sub(r'\s','',t))
        a,b=L(x['distractorsKo'][0]),L(x['distractorsKo'][1]);c=L(x['ko'])
        if min(a,b)>c: bad.append((k,'both longer than ko',c,a,b))
        for dk in x['distractorsKo']:
            for st in v._ko_stems(dk)-mine: cnt[st]+=1; where[st].append(k)
            for t in set(toks(dk))-mt: wcnt[t]+=1; wwhere[t].append(k)
print('LEN',bad)
print('STEM top:',[(s,c,where[s]) for s,c in cnt.most_common(14) if c>=5])
print('WORD top:',[(s,c) for s,c in wcnt.most_common(14) if c>=4])
# prep verbs / 팩 by regex over all dk text where ko lacks
prep={'보':r'보(다|려|세요|봐|며|일|여|고|도|면|아|자|았|았어|세|겠|게|지)', '꺼내':r'꺼내|꺼냅|꺼낼|꺼내요','닦':r'닦','켜':r'켜|켭|켠','펴':r'펴|폅|펼|펼치|폈','쓰':r'(?<!생)쓰|씁|써|쓸','팩':r'팩','잡':r'잡','쥐':r'쥐|쥡|쥘','챙기':r'챙기|챙길|챙깁','씻':r'씻','열':r'열(어|게|읍|세|다)|엽','누르':r'누르|눌러|누릅','확인':r'확인','기록':r'기록','번호':r'번호','표':r'표(를|가|는|에|로)? '}
for name,pat in prep.items():
    n=0; w=[]
    for si,s in enumerate(d['situations']):
        for j,x in enumerate(s['sentences']):
            for dk in x['distractorsKo']:
                if re.search(pat,dk) and not re.search(pat,x['ko']): n+=1; w.append(f'{si}-{j}')
    print(name,n,w)
Pm=re.compile(r'(려고|(?<!쿨)러 |도록|위해)')
print('both purpose:',[f'{si}-{j}' for si,s in enumerate(d['situations']) for j,x in enumerate(s['sentences']) if all(Pm.search(y+' ') for y in x['distractorsKo'])])
print('purpose count',sum(1 for s in d['situations'] for x in s['sentences'] for y in x['distractorsKo'] if Pm.search(y+' ')))
# blank wrong counts
bc=collections.Counter(); dc=collections.Counter()
for s in d['situations']:
    for x in s['sentences']:
        for o in x['blank']['options']:
            if o['en']!=x['blank']['answer']: bc[o['en'].lower()]+=1
        dc[x['decoy'].lower()]+=1
print('blank>=3',[(a,c) for a,c in bc.items() if c>=3]); print('decoy>=2',[(a,c) for a,c in dc.items() if c>=2])
