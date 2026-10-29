import yaml,re,collections,sys
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v
d=yaml.safe_load(open(sys.argv[1] if len(sys.argv)>1 else 'icu-nutrition.yaml'))
cnt=collections.Counter(); where=collections.defaultdict(list)
MK=[r'면\b',r'려고',r'전에',r'전엔',r'도록',r'위해',r'(후|뒤)에?\b',r'자마자',r'때\b',r'함께',r'따로']
mk_both=[];mk_any=collections.Counter()
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        mine=v._ko_stems(x['ko'])
        for k in x['distractorsKo']:
            for st in v._ko_stems(k)-mine:
                cnt[st]+=1; where[st].append(f"{si}.{j}")
        for m in MK:
            ink=bool(re.search(m,x['ko'])); a=[bool(re.search(m,k)) for k in x['distractorsKo']]
            if not ink and any(a): mk_any[m]+=1
            if not ink and all(a): mk_both.append((f"{si}.{j}",m))
        # length rule
        L=len(x['ko'])
        for k in x['distractorsKo']:
            if not (len(k)<=L*1.25 and abs(len(k)-L)<=3): print('LEN',si,j,k,len(k),L)
        if min(len(k) for k in x['distractorsKo'])>L: print('BOTHLONGER',f"{si}.{j}")
print('stems>=4:')
for st,c in cnt.most_common():
    if c>=4: print(' ',st,c,where[st])
print('markers only in distractors (any):',dict(mk_any))
print('markers in BOTH distractors not in ko:',mk_both)
